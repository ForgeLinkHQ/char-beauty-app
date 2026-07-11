-- =============================================================================
-- Phase 2 · Booking engine core
-- Integrity-first: overlap exclusion, availability model, atomic reservation,
-- payments layer. Hardening pattern matches 20260704222213 (search_path pinned,
-- EXECUTE revoked by default, explicit grants only where public access is by design).
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- -----------------------------------------------------------------------------
-- 1. Booking settings — the owner-editable "business matrix" (singleton row)
-- -----------------------------------------------------------------------------
CREATE TABLE public.booking_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  timezone TEXT NOT NULL DEFAULT 'Europe/London',
  slot_granularity_minutes INT NOT NULL DEFAULT 15 CHECK (slot_granularity_minutes BETWEEN 5 AND 60),
  min_notice_hours INT NOT NULL DEFAULT 4 CHECK (min_notice_hours >= 0),
  max_advance_days INT NOT NULL DEFAULT 60 CHECK (max_advance_days BETWEEN 1 AND 365),
  hold_minutes INT NOT NULL DEFAULT 15 CHECK (hold_minutes BETWEEN 5 AND 120),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.booking_settings TO authenticated;
GRANT ALL ON public.booking_settings TO service_role;
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage booking_settings" ON public.booking_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'owner'))
  WITH CHECK (public.has_role(auth.uid(),'owner'));
CREATE TRIGGER trg_booking_settings_updated BEFORE UPDATE ON public.booking_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.booking_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. Business hours — multiple windows per weekday supported (split days)
--    day_of_week: 0 = Sunday … 6 = Saturday (Postgres EXTRACT(dow) convention)
-- -----------------------------------------------------------------------------
CREATE TABLE public.business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  opens_at TIME NOT NULL,
  closes_at TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (closes_at > opens_at)
);
GRANT SELECT ON public.business_hours TO authenticated;
GRANT ALL ON public.business_hours TO service_role;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage business_hours" ON public.business_hours
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'owner'))
  WITH CHECK (public.has_role(auth.uid(),'owner'));

-- Seed: Tue–Sat 09:00–17:00 (owner edits in admin)
INSERT INTO public.business_hours (day_of_week, opens_at, closes_at)
VALUES (2,'09:00','17:00'),(3,'09:00','17:00'),(4,'09:00','17:00'),(5,'09:00','17:00'),(6,'09:00','17:00');

-- -----------------------------------------------------------------------------
-- 3. Blackout periods — holidays, appointments-off, ad-hoc closures
-- -----------------------------------------------------------------------------
CREATE TABLE public.blackout_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);
CREATE INDEX idx_blackout_periods_range ON public.blackout_periods (starts_at, ends_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blackout_periods TO authenticated;
GRANT ALL ON public.blackout_periods TO service_role;
ALTER TABLE public.blackout_periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage blackout_periods" ON public.blackout_periods
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'owner'))
  WITH CHECK (public.has_role(auth.uid(),'owner'));

-- -----------------------------------------------------------------------------
-- 4. Bookings — integrity columns + THE exclusion constraint
--    blocked_until = ends_at + buffer (chair time), snapshotted per booking so
--    the constraint is self-contained. Double-booking becomes impossible at the
--    database layer for any row in a live status, regardless of code path.
-- -----------------------------------------------------------------------------
ALTER TABLE public.bookings
  ADD COLUMN buffer_minutes INT NOT NULL DEFAULT 0 CHECK (buffer_minutes >= 0),
  ADD COLUMN blocked_until TIMESTAMPTZ,
  ADD COLUMN hold_expires_at TIMESTAMPTZ,
  ADD COLUMN source TEXT NOT NULL DEFAULT 'online';

UPDATE public.bookings SET blocked_until = ends_at WHERE blocked_until IS NULL;

ALTER TABLE public.bookings
  ALTER COLUMN blocked_until SET NOT NULL,
  ADD CONSTRAINT bookings_time_order CHECK (ends_at > starts_at AND blocked_until >= ends_at);

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (tstzrange(starts_at, blocked_until, '[)') WITH &&)
  WHERE (status IN ('pending_payment','confirmed'));

CREATE INDEX idx_bookings_starts_at ON public.bookings (starts_at);
CREATE INDEX idx_bookings_live_holds ON public.bookings (hold_expires_at)
  WHERE status = 'pending_payment';

-- -----------------------------------------------------------------------------
-- 5. Payments + Stripe webhook idempotency ledger
-- -----------------------------------------------------------------------------
CREATE TYPE public.payment_kind AS ENUM ('deposit','balance','refund');
CREATE TYPE public.payment_status AS ENUM ('requires_payment','processing','succeeded','failed','refunded');

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  kind public.payment_kind NOT NULL DEFAULT 'deposit',
  status public.payment_status NOT NULL DEFAULT 'requires_payment',
  amount_gbp NUMERIC(10,2) NOT NULL CHECK (amount_gbp > 0),
  currency CHAR(3) NOT NULL DEFAULT 'gbp',
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_booking ON public.payments (booking_id);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read payments" ON public.payments
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'owner'));
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Raw event ledger: webhook idempotency + audit. Service-role only; RLS enabled
-- with no policies = deny-all to every other role by construction.
CREATE TABLE public.stripe_events (
  event_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.stripe_events TO service_role;
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 6. Internal availability checker — single source of truth shared by the
--    public availability RPC and the atomic reserve RPC.
--    Returns NULL when the candidate is bookable, else a machine-readable reason.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.slot_unavailable_reason(
  _service public.services,
  _starts_at TIMESTAMPTZ,
  _skip_patch_lead BOOLEAN DEFAULT false
) RETURNS TEXT
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  s public.booking_settings%ROWTYPE;
  local_ts TIMESTAMP;
  svc_end TIMESTAMPTZ;
  chair_end TIMESTAMPTZ;
BEGIN
  SELECT * INTO s FROM public.booking_settings WHERE id = 1;

  local_ts  := _starts_at AT TIME ZONE s.timezone;
  svc_end   := _starts_at + make_interval(mins => _service.duration_minutes);
  chair_end := svc_end   + make_interval(mins => _service.buffer_minutes);

  -- Grid alignment
  IF EXTRACT(second FROM local_ts) <> 0
     OR (EXTRACT(minute FROM local_ts)::int % s.slot_granularity_minutes) <> 0 THEN
    RETURN 'off_grid';
  END IF;

  -- Notice + advance window
  IF _starts_at < now() + make_interval(hours => s.min_notice_hours) THEN
    RETURN 'too_soon';
  END IF;
  IF _starts_at > now() + make_interval(days => s.max_advance_days) THEN
    RETURN 'too_far_ahead';
  END IF;

  -- Patch-test lead time (skipped for returning clients at reserve time)
  IF _service.requires_patch_test AND NOT _skip_patch_lead
     AND _starts_at < now() + make_interval(hours => _service.patch_test_lead_hours) THEN
    RETURN 'patch_test_lead';
  END IF;

  -- Inside a business-hours window; service must finish by close (buffer may spill)
  IF NOT EXISTS (
    SELECT 1 FROM public.business_hours bh
    WHERE bh.day_of_week = EXTRACT(dow FROM local_ts)::smallint
      AND local_ts::time >= bh.opens_at
      AND (local_ts::time + make_interval(mins => _service.duration_minutes)) <= bh.closes_at
  ) THEN
    RETURN 'outside_hours';
  END IF;

  -- Blackouts block the full chair range
  IF EXISTS (
    SELECT 1 FROM public.blackout_periods bp
    WHERE tstzrange(bp.starts_at, bp.ends_at, '[)') && tstzrange(_starts_at, chair_end, '[)')
  ) THEN
    RETURN 'blackout';
  END IF;

  -- Live bookings: confirmed, or pending with an unexpired hold
  IF EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE (b.status = 'confirmed'
           OR (b.status = 'pending_payment' AND b.hold_expires_at > now()))
      AND tstzrange(b.starts_at, b.blocked_until, '[)') && tstzrange(_starts_at, chair_end, '[)')
  ) THEN
    RETURN 'taken';
  END IF;

  RETURN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 7. Public RPC: available slots for a service on a given local calendar day.
--    DST-safe: candidates are generated in local wall-clock time, then anchored
--    to UTC via the studio timezone.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_available_slots(
  _service_slug TEXT,
  _day DATE
) RETURNS TABLE (slot_starts_at TIMESTAMPTZ)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  svc public.services%ROWTYPE;
  s public.booking_settings%ROWTYPE;
  today_local DATE;
BEGIN
  SELECT * INTO s FROM public.booking_settings WHERE id = 1;
  SELECT * INTO svc FROM public.services WHERE slug = _service_slug AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'unknown_service' USING ERRCODE = 'P0001';
  END IF;

  today_local := (now() AT TIME ZONE s.timezone)::date;
  IF _day < today_local OR _day > today_local + s.max_advance_days THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT cand_utc
  FROM public.business_hours bh
  CROSS JOIN LATERAL generate_series(
         (_day + bh.opens_at)::timestamp,
         (_day + bh.closes_at)::timestamp - make_interval(mins => svc.duration_minutes),
         make_interval(mins => s.slot_granularity_minutes)
       ) AS g(local_ts)
  CROSS JOIN LATERAL (SELECT g.local_ts AT TIME ZONE s.timezone) AS c(cand_utc)
  WHERE bh.day_of_week = EXTRACT(dow FROM g.local_ts)::smallint
    AND public.slot_unavailable_reason(svc, c.cand_utc) IS NULL
  ORDER BY cand_utc;
END $$;

-- -----------------------------------------------------------------------------
-- 8. Public RPC: atomic reservation. Creates/updates the client record, expires
--    stale holds in the window, inserts a pending_payment booking with a hold.
--    The exclusion constraint is the final arbiter — a concurrent race loses
--    with SQLSTATE 23P01 and gets a clean 'slot_taken'.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reserve_slot(
  _service_slug TEXT,
  _starts_at TIMESTAMPTZ,
  _first_name TEXT,
  _last_name TEXT,
  _email TEXT,
  _phone TEXT DEFAULT NULL,
  _marketing_consent BOOLEAN DEFAULT false,
  _notes TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  svc public.services%ROWTYPE;
  s public.booking_settings%ROWTYPE;
  v_email TEXT;
  v_client_id UUID;
  v_returning BOOLEAN;
  v_reason TEXT;
  v_ends TIMESTAMPTZ;
  v_blocked TIMESTAMPTZ;
  v_hold TIMESTAMPTZ;
  v_booking_id UUID;
  v_live_holds INT;
BEGIN
  -- Input hygiene
  v_email := lower(trim(_email));
  IF v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'invalid_email' USING ERRCODE = 'P0001';
  END IF;
  IF coalesce(trim(_first_name),'') = '' OR coalesce(trim(_last_name),'') = '' THEN
    RAISE EXCEPTION 'name_required' USING ERRCODE = 'P0001';
  END IF;

  SELECT * INTO s FROM public.booking_settings WHERE id = 1;
  SELECT * INTO svc FROM public.services WHERE slug = _service_slug AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'unknown_service' USING ERRCODE = 'P0001';
  END IF;

  -- Upsert client (email is the natural key; only fill blanks, never overwrite;
  -- marketing consent is upgrade-only with timestamp)
  INSERT INTO public.clients (email, phone, first_name, last_name, marketing_consent, marketing_consent_at)
  VALUES (v_email, nullif(trim(_phone),''), trim(_first_name), trim(_last_name),
          _marketing_consent, CASE WHEN _marketing_consent THEN now() END)
  ON CONFLICT (email) DO UPDATE SET
    first_name = coalesce(clients.first_name, EXCLUDED.first_name),
    last_name  = coalesce(clients.last_name,  EXCLUDED.last_name),
    phone      = coalesce(clients.phone,      EXCLUDED.phone),
    marketing_consent    = clients.marketing_consent OR EXCLUDED.marketing_consent,
    marketing_consent_at = CASE
      WHEN NOT clients.marketing_consent AND EXCLUDED.marketing_consent THEN now()
      ELSE clients.marketing_consent_at END
  RETURNING id INTO v_client_id;

  -- Returning client = at least one completed visit (patch-test lead waived per plan)
  SELECT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE client_id = v_client_id AND status = 'completed'
  ) INTO v_returning;

  IF svc.requires_patch_test AND NOT v_returning THEN
    v_reason := public.slot_unavailable_reason(svc, _starts_at, false);
  ELSE
    v_reason := public.slot_unavailable_reason(svc, _starts_at, true);
  END IF;

  -- Abuse brake: max 3 live holds per client
  SELECT count(*) INTO v_live_holds FROM public.bookings
  WHERE client_id = v_client_id AND status = 'pending_payment' AND hold_expires_at > now();
  IF v_live_holds >= 3 THEN
    RAISE EXCEPTION 'too_many_holds' USING ERRCODE = 'P0001';
  END IF;

  IF v_reason IS NOT NULL THEN
    RAISE EXCEPTION '%', v_reason USING ERRCODE = 'P0001';
  END IF;

  v_ends    := _starts_at + make_interval(mins => svc.duration_minutes);
  v_blocked := v_ends    + make_interval(mins => svc.buffer_minutes);
  v_hold    := now()     + make_interval(mins => s.hold_minutes);

  -- Lazy expiry: clear stale holds that overlap this window before inserting
  UPDATE public.bookings
  SET status = 'cancelled',
      notes  = trim(coalesce(notes,'') || ' [hold expired]')
  WHERE status = 'pending_payment'
    AND hold_expires_at <= now()
    AND tstzrange(starts_at, blocked_until, '[)') && tstzrange(_starts_at, v_blocked, '[)');

  BEGIN
    INSERT INTO public.bookings
      (client_id, service_id, starts_at, ends_at, blocked_until, buffer_minutes,
       status, price_gbp, deposit_gbp, hold_expires_at, source, notes)
    VALUES
      (v_client_id, svc.id, _starts_at, v_ends, v_blocked, svc.buffer_minutes,
       'pending_payment', svc.price_gbp, svc.deposit_gbp, v_hold, 'online', nullif(trim(_notes),''))
    RETURNING id INTO v_booking_id;
  EXCEPTION WHEN exclusion_violation THEN
    RAISE EXCEPTION 'slot_taken' USING ERRCODE = 'P0001';
  END;

  RETURN jsonb_build_object(
    'booking_id', v_booking_id,
    'service_name', svc.name,
    'starts_at', _starts_at,
    'ends_at', v_ends,
    'price_gbp', svc.price_gbp,
    'deposit_gbp', svc.deposit_gbp,
    'hold_expires_at', v_hold,
    'requires_patch_test', (svc.requires_patch_test AND NOT v_returning)
  );
END $$;

-- -----------------------------------------------------------------------------
-- 9. Maintenance: sweep expired holds (cron-callable; reserve also does this
--    lazily in its own window)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cancel_expired_holds()
RETURNS INT
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
DECLARE n INT;
BEGIN
  UPDATE public.bookings
  SET status = 'cancelled',
      notes  = trim(coalesce(notes,'') || ' [hold expired]')
  WHERE status = 'pending_payment' AND hold_expires_at <= now();
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $$;

-- -----------------------------------------------------------------------------
-- 10. Hardening — mirror of 20260704222213 pattern
--     Default posture: revoked. Public surface: exactly two functions.
-- -----------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.slot_unavailable_reason(public.services, timestamptz, boolean) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cancel_expired_holds() FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.cancel_expired_holds() TO service_role;

REVOKE EXECUTE ON FUNCTION public.get_available_slots(text, date) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_available_slots(text, date) TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.reserve_slot(text, timestamptz, text, text, text, text, boolean, text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.reserve_slot(text, timestamptz, text, text, text, text, boolean, text) TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 11. Seed the live service menu (parity with src/lib/services.ts — the
--     frontend switches to reading this table in the wizard build)
-- -----------------------------------------------------------------------------
INSERT INTO public.services
  (slug, category, name, tagline, description, duration_minutes, price_gbp, deposit_gbp, requires_patch_test, requires_consultation, sort_order)
VALUES
  ('classic-lash-set','lashes','Classic Lash Set','One extension per natural lash','A refined, mascara-effect look with one lightweight extension applied to each natural lash. Ideal for a first set or an everyday polish.',120,85,20,true,false,10),
  ('hybrid-lash-set','lashes','Hybrid Lash Set','A blend of classic and volume','A soft, textured mix of classic singles and lightweight fans. Fluffier than classic, softer than volume.',150,105,25,true,false,20),
  ('volume-lash-set','lashes','Volume Lash Set','Handmade fans for density','Bespoke handmade fans of 2–6 ultra-fine extensions per natural lash, mapped to your eye shape.',180,130,30,true,true,30),
  ('mega-volume','lashes','Mega Volume','Full, editorial density','The most dramatic finish — 10–16 ultra-fine fans per lash, handmade in the moment.',210,160,40,true,true,40),
  ('lash-infill-2-3wk','lashes','Infill · 2–3 weeks','Keep the set looking fresh','Top-up appointment for existing sets from C. Beauty. Please book within three weeks of your last visit.',75,55,15,false,false,50),
  ('lash-removal','lashes','Lash Removal','Gentle, cream-based','Careful removal of any existing extensions with a nourishing cream remover.',30,20,10,false,false,60),
  ('signature-facial','facials','Signature Facial','Deep cleanse, mask, massage','A 60-minute results-led facial tailored to your skin on the day — cleanse, exfoliation, mask, LED, massage.',60,70,15,false,false,70),
  ('glow-facial','facials','The Glow Facial','Event-ready radiance','A brightening facial with enzymatic exfoliation, lymphatic massage and LED for immediate luminosity.',75,90,20,false,false,80),
  ('gentle-peel','peels','Gentle Chemical Peel','Mandelic + lactic','A low-strength peel to refresh texture and tone with minimal downtime. Consultation required before first booking.',45,75,20,true,true,90),
  ('advanced-peel','peels','Advanced Peel','For pigmentation & texture','A stronger blend addressing pigmentation, congestion and fine lines. Suitable after a course-planning consultation.',60,110,30,true,true,100),
  ('led-therapy','led','LED Light Therapy','Calming, reparative','A 30-minute stand-alone LED session — red for repair, blue for blemish-prone skin, near-infrared for calm.',30,35,10,false,false,110),
  ('spray-tan','tan','Spray Tan','Custom-mixed, streak-free','A custom-mixed spray tan in your ideal depth, applied by hand for a natural, even finish.',30,35,10,false,false,120),
  ('brow-wax-shape','brows','Brow Wax & Shape','Considered, editorial','Bespoke shaping with wax and precision tweezing to enhance your natural brow.',30,25,10,false,false,130)
ON CONFLICT (slug) DO NOTHING;
