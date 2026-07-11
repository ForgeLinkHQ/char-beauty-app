-- Booking engine smoke suite — runs against a Supabase-compatible Postgres.
-- Local harness needs roles anon/authenticated/service_role + auth.uid() stub
-- (native on Supabase). All 12 sections must pass before deploy.

\set QUIET on
\pset footer off
\echo '================ T1: availability happy path (Tue 14 Jul, classic 120m) ================'
SET ROLE anon;
SELECT count(*) AS tue_slots_expected_25 FROM public.get_available_slots('classic-lash-set', DATE '2026-07-14');
SELECT min(slot_starts_at) AS first_slot, max(slot_starts_at) AS last_slot
FROM public.get_available_slots('classic-lash-set', DATE '2026-07-14');
RESET ROLE;

\echo '================ T2: reserve happy path (anon, 10:00 BST Tue 14 Jul) ================'
SET ROLE anon;
SELECT jsonb_pretty(public.reserve_slot(
  'classic-lash-set', TIMESTAMPTZ '2026-07-14 10:00:00+01',
  'Test','Client','test.client@example.com','07700900000', true, NULL
)) AS reservation;
RESET ROLE;

\echo '================ T3: second reserve, same slot, different client -> slot_taken ================'
SET ROLE anon;
DO $$ BEGIN
  PERFORM public.reserve_slot('classic-lash-set', TIMESTAMPTZ '2026-07-14 10:00:00+01',
    'Second','Person','second@example.com', NULL, false, NULL);
  RAISE EXCEPTION 'FAIL: double booking was allowed';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM IN ('taken','slot_taken') THEN RAISE NOTICE 'PASS: rejected with %', SQLERRM;
  ELSE RAISE; END IF;
END $$;
RESET ROLE;

\echo '================ T4: constraint as final arbiter — privileged direct INSERT bypass ================'
DO $$ BEGIN
  INSERT INTO public.bookings (client_id, service_id, starts_at, ends_at, blocked_until, buffer_minutes, status, price_gbp, deposit_gbp)
  SELECT c.id, s.id,
         TIMESTAMPTZ '2026-07-14 11:00:00+01',
         TIMESTAMPTZ '2026-07-14 12:00:00+01',
         TIMESTAMPTZ '2026-07-14 12:15:00+01',
         15, 'confirmed', 70, 15
  FROM public.clients c, public.services s
  WHERE c.email='test.client@example.com' AND s.slug='signature-facial';
  RAISE EXCEPTION 'FAIL: exclusion constraint did not fire';
EXCEPTION WHEN exclusion_violation THEN
  RAISE NOTICE 'PASS: 23P01 exclusion_violation blocked overlapping confirmed insert';
END $$;

\echo '================ T5: availability reflects the live hold (10:00 gone, 12:15 free) ================'
SET ROLE anon;
SELECT
  bool_and(slot_starts_at <> TIMESTAMPTZ '2026-07-14 10:00:00+01') AS ten_am_absent,
  bool_or (slot_starts_at =  TIMESTAMPTZ '2026-07-14 12:15:00+01') AS twelve_fifteen_present,
  count(*) AS remaining_slots
FROM public.get_available_slots('classic-lash-set', DATE '2026-07-14');
RESET ROLE;

\echo '================ T6: hold expiry — stale hold is lazily cancelled and slot rebooked ================'
UPDATE public.bookings SET hold_expires_at = now() - interval '1 minute'
WHERE status='pending_payment';
SET ROLE anon;
SELECT (public.reserve_slot('classic-lash-set', TIMESTAMPTZ '2026-07-14 10:00:00+01',
  'Third','Person','third@example.com', NULL, false, NULL)->>'booking_id') IS NOT NULL AS rebooked_after_expiry;
RESET ROLE;
SELECT status, count(*) FROM public.bookings GROUP BY status ORDER BY status;

\echo '================ T7: blackout blocks the afternoon ================'
INSERT INTO public.blackout_periods (starts_at, ends_at, reason)
VALUES (TIMESTAMPTZ '2026-07-14 13:00:00+01', TIMESTAMPTZ '2026-07-15 00:00:00+01', 'test blackout');
SET ROLE anon;
SELECT max(slot_starts_at) AS last_slot_should_end_by_1pm,
       count(*) AS slots_left
FROM public.get_available_slots('spray-tan', DATE '2026-07-14');
RESET ROLE;
DELETE FROM public.blackout_periods WHERE reason='test blackout';

\echo '================ T8: patch-test lead time hides near slots ================'
UPDATE public.services SET patch_test_lead_hours = 96 WHERE slug='classic-lash-set';
SET ROLE anon;
SELECT count(*) AS classic_tue_slots_expect_0 FROM public.get_available_slots('classic-lash-set', DATE '2026-07-14');
RESET ROLE;
UPDATE public.services SET patch_test_lead_hours = 48 WHERE slug='classic-lash-set';

\echo '================ T9: validation — off-grid and too-soon rejected ================'
SET ROLE anon;
DO $$ BEGIN
  PERFORM public.reserve_slot('spray-tan', TIMESTAMPTZ '2026-07-14 10:07:00+01','A','B','offgrid@example.com',NULL,false,NULL);
  RAISE EXCEPTION 'FAIL: off-grid accepted';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM='off_grid' THEN RAISE NOTICE 'PASS: off_grid'; ELSE RAISE; END IF;
END $$;
DO $$ BEGIN
  PERFORM public.reserve_slot('spray-tan', date_trunc('hour', now()) + interval '2 hour','A','B','soon@example.com',NULL,false,NULL);
  RAISE EXCEPTION 'FAIL: too-soon accepted';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM IN ('too_soon','outside_hours','off_grid') THEN RAISE NOTICE 'PASS: rejected (%)', SQLERRM; ELSE RAISE; END IF;
END $$;
RESET ROLE;

\echo '================ T10: abuse brake — 4th live hold rejected ================'
SET ROLE anon;
SELECT public.reserve_slot('spray-tan', TIMESTAMPTZ '2026-07-15 10:00:00+01','H','Og','holds@example.com',NULL,false,NULL)->>'booking_id' IS NOT NULL AS h1;
SELECT public.reserve_slot('spray-tan', TIMESTAMPTZ '2026-07-15 11:00:00+01','H','Og','holds@example.com',NULL,false,NULL)->>'booking_id' IS NOT NULL AS h2;
SELECT public.reserve_slot('spray-tan', TIMESTAMPTZ '2026-07-15 12:00:00+01','H','Og','holds@example.com',NULL,false,NULL)->>'booking_id' IS NOT NULL AS h3;
DO $$ BEGIN
  PERFORM public.reserve_slot('spray-tan', TIMESTAMPTZ '2026-07-15 13:00:00+01','H','Og','holds@example.com',NULL,false,NULL);
  RAISE EXCEPTION 'FAIL: 4th hold accepted';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM='too_many_holds' THEN RAISE NOTICE 'PASS: too_many_holds'; ELSE RAISE; END IF;
END $$;
RESET ROLE;

\echo '================ T11: RLS posture from anon ================'
SET ROLE anon;
DO $$ BEGIN
  PERFORM * FROM public.bookings LIMIT 1;
  RAISE EXCEPTION 'FAIL: anon can read bookings';
EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'PASS: anon denied on bookings'; END $$;
DO $$ BEGIN
  PERFORM * FROM public.business_hours LIMIT 1;
  RAISE EXCEPTION 'FAIL: anon can read business_hours';
EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'PASS: anon denied on business_hours'; END $$;
DO $$ BEGIN
  PERFORM * FROM public.clients LIMIT 1;
  RAISE EXCEPTION 'FAIL: anon can read clients';
EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'PASS: anon denied on clients'; END $$;
DO $$ BEGIN
  PERFORM public.cancel_expired_holds();
  RAISE EXCEPTION 'FAIL: anon can run maintenance fn';
EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'PASS: anon denied on cancel_expired_holds'; END $$;
RESET ROLE;

\echo '================ T12: consent is upgrade-only ================'
SELECT email, marketing_consent, (marketing_consent_at IS NOT NULL) AS consent_stamped
FROM public.clients WHERE email='test.client@example.com';
