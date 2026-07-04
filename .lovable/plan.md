
# C. Beauty — Full Booking, CRM & Marketing Platform (v3.1)

Editorial-luxe site for **C. Beauty, Farnborough (UK, GBP)** — a solo lash & skincare studio. Clients discover, book, complete forms, pay a deposit, and are nurtured with automated aftercare and personalised rebooking. C. runs the whole business — calendar, CRM, lash maps, marketing — from one admin.

---

## 1. Client-facing site
Home · Services · About · Reviews · Gallery/Before-&-After · Offers · Gift Cards · FAQ · Contact · Legal · Book · My Account · Confirmation.

**Services**: Lashes (Classic, Hybrid, Volume, Mega, Infills, Removal), Facials, Chemical Peels, LED, Spray Tans, Brow Waxing.

**Design**: cream `#F5EFE6`, champagne `#E8D5B7`, ink `#1A1A1A`, bronze `#8B7355`. Fraunces/Cormorant serif + Manrope sans. Magazine layout, hairlines, slow fades. Semantic tokens only.

## 2. Smart booking flow
Stepper: Service → Date/Time → Details → Forms & Preferences → Deposit → Confirmation. Add-ons, bundles, waitlist, abandoned-cart recovery, referral link `?ref=…`. Slot engine honours duration, buffer, patch-test lead time.

## 3. Returning-client rebook
Passwordless "My Account" (magic link). One-tap **Rebook last visit**, suggested next-visit date per service cadence, saved cards, saved forms, records, downloadable signed consents, loyalty balance, referral link. Email-lookup on public booking auto-fills and skips valid forms.

## 4. Consents, patch tests, consultations
Per-service tagged: consent (versioned, N-month expiry), patch test (≥48h gap, auto-appends free patch appointment), medical questionnaire (auto-flags contraindications), consultation. Signature pad + hash + PDF snapshot, immutable.

## 5. "Know / don't know / repeat last" preferences
Guided visual picker (style, curl, length, thickness, fans, placement, symmetry, inspiration photos) OR 3 sliders OR auto-fill last confirmed setup. Same light pattern for facials, peels, tan, brows.

## 6. Interactive lash map
SVG per eye (~40 zones), presets, per-zone length/curl/thickness/fans/note, versioned per appointment, compare-to-last-visit.

## 7. Client records & intelligent grouping (CRM)

Auto-created on first booking; manual for walk-ins/phone.

**Profile & data**: contact, DOB, address, allergies, meds, skin type, Fitzpatrick, private notes, appointment history, notes, products used, aftercare sent, retention rating, before/after photos, consents & patch tests with expiry, preferences & saved maps (versions), financials (LTV, avg ticket, deposits, refunds, credit, outstanding), loyalty (visits, points, tier, referrals), engagement (last visit, days since, next-due, churn risk, marketing consent, unsubscribes).

### Groups, tags & segments — the intelligent part

Three layers so C. can slice her book any way she thinks about it:

**1. Relationship tier (single-select, colour-chipped on every client card)**
- **VIP** — top spenders / longest tenure
- **Favourite** — C.'s personal love list (manual, heart icon)
- **Regular** — steady rebookers
- **Casual** — sporadic
- **New** — under 90 days / < 2 visits
- **Seasonal** — books in predictable windows (see below)
- **Lapsed** — no visit in 90+ days
- **Blocked** — never rebook

**2. Custom tags (multi-select, free-form + suggested)**
Colour-coded, searchable chips: `bride`, `bridal party`, `mother-of-bride`, `prom`, `holiday-glow`, `event-only`, `photoshoot`, `sensitive skin`, `allergy-latex`, `pregnancy-safe`, `no-caffeine`, `runs-late`, `chatty`, `quiet-please`, `left-handed`, `mobile-only-comms`, `weekend-only`, `evenings-only`, `cash-payer`, `press-media`, `staff-friends-family`, `gift-card-recipient`, `referred-by-<name>`. C. can create new tags in one click; tag library is reorderable.

**3. Smart segments (auto-updating, rules-based)** — recompute nightly + on booking events. Examples shipped:
- **VIP** — lifetime spend ≥ £X OR ≥ N visits/12mo (thresholds editable).
- **Favourite (manual)** — starred by C.
- **Regular** — ≥ 4 visits in last 6 months, avg gap ≤ service cadence + 20%.
- **Casual** — 2–3 visits in last 12 months.
- **New (first-30 / first-90)** — since first booking.
- **Seasonal — Summer** — >60% of visits in Jun–Aug across ≥ 2 years (tan, brow tidy, lash top-up).
- **Seasonal — Party / Dec** — repeat Nov–Dec bookings 2+ years running.
- **Seasonal — Bridal window** — active during their wedding month ± 3.
- **Holiday prep** — books tan/lashes 3–10 days before a saved travel date.
- **Dip-and-out** — long gaps (90–180d) but always returns; treat gently, no aggressive win-back.
- **At-risk / Churn** — score based on days-since-last vs their personal cadence, no-shows, unread emails.
- **Rising star** — new client with 2+ visits inside 60 days → nurture to VIP.
- **Bridal party of <client>** — auto-linked when booked via a bride's referral.
- **Birthday-month**, **Patch-test expiring**, **Consent expiring**, **Deposit-outstanding**, **Waitlisted**, **Gift-card holder**, **Referral advocates** (referred ≥ 1 paying client).
- **Prefers weekday / evening / Saturday** — inferred from booked-slot pattern.
- **Service affinity** — top service = Lashes / Facials / Peels / Tan / Brows.

**Segment builder (no-code)**: AND/OR rules on any field — visits, spend, last visit, service, tag, tier, location, DOB month, consent status, cadence, deposit history, source. Preview count live. Save as segment. Pin to sidebar.

**How C. uses them**:
- Client list filters by tier + tag + segment simultaneously; saved views ("My VIPs", "Christmas lash regulars", "Bridal 2026", "Sensitive-skin peels").
- Bulk actions on a segment: send offer, add tag, add credit, invite to waitlist, export CSV, mark to call.
- Every automation targets a segment: e.g. "Send winter tan offer 1 Oct → Seasonal-Summer + Holiday-prep tags", "Bridal 6-week countdown series → Bridal window", "VIP birthday gift → VIP ∩ Birthday-month".
- **Suppression respected** — marketing consent + quiet hours + per-client throttle.
- **Client card** shows tier chip, tags, active segments, next-due date, cadence bar, churn dial, LTV, and a "why this client is in X" tooltip so grouping is transparent.

**Bulk & smart tools**:
- CSV import maps to tags/tier on ingest.
- "Suggested tags" — the system proposes tags C. can accept in one click (e.g. detects Dec-only pattern → suggests `party-season`).
- **Merge duplicates** (same phone/email) with field-level pick.
- **Family/household linking** (mother-daughter, bridal party, friends-referred).
- **Relationship graph** — who referred whom, visual tree.

**Quick actions on any client**: rebook last, duplicate previous lash map, add note, mark contraindication, send tailored offer, add to segment, add credit, block, GDPR export/erase.

## 8. Automated communications
**Transactional**: booking confirm (ICS + prep), patch-test reminders, 72h + 24h prep (service-specific), reschedule/refund, aftercare 2h post-visit, 48h retention check-in, 7-day review request, invoice/receipt, gift-card purchase/redemption.

**Lifecycle & marketing** (segment-targeted, consent-gated, throttled, quiet hours):
- Due-to-rebook at service cadence · Win-back 45/60/90 (skipped for `Dip-and-out`) · Birthday (7 days + day-of) · Welcome series (0/2/14) · New service / seasonal offer to matched segments · Loyalty milestones · Referral thank-you & credit awarded · Post-purchase gift-card nudge · Seasonal campaign presets (Summer glow, Party season, Bridal countdown) auto-schedule against seasonal segments.

Delivery: **Lovable Emails** (queue + suppression + unsubscribe footer). Owner-visible on/off, throttle (max N/month per client), quiet hours.

## 9. Offers, packages, gift cards, loyalty
Promo codes (rules, caps, windows), auto-promos (fill-my-day, off-peak, birthday, win-back, referral), packages/series (pre-paid, auto-decrement), gift cards (scheduled delivery), loyalty (points → credit, tiers with perks), referrals (per-client link, reward on first paid visit).

## 10. Upsell & recommendations
Add-ons at checkout (LED after facial, brow tint with wax), next-best service, retail recommendations in aftercare, bundle prompts, personalised by history + skin type + preferences; C. can pin/exclude per client.

## 11. Owner admin
Dashboard · Calendar (drag-to-reschedule, colour by service) · Bookings · **Clients** (filter by tier/tag/segment, saved views, bulk actions, relationship graph) · Services · Availability · Forms · Preferences library · Marketing (automations, segments, campaigns, promos, gift cards, loyalty, referrals) · Retail/inventory · Reports (revenue, retention, no-show, cohort/LTV, promo, gift-card & loyalty liability, source) · Reviews · Waitlist board · Notifications · Settings.

## 12. Trust, compliance, accessibility (UK)
GDPR (double opt-in, granular unsubscribe, export/erase, cookies), PECR-compliant timing, UK VAT via Stripe, WCAG 2.2 AA, RLS, `has_role`, signed URLs, HMAC-verified webhooks, rate-limited public endpoints.

## 13. SEO & local
Per-route `head()` with local keywords, LocalBusiness + Service + FAQ JSON-LD, sitemap, dynamic OG images, analytics (Plausible/GA4) + server-side conversion events.

## 14. Handover to C.
Owner access, Stripe verification, email domain + DNS, admin guide (video + PDF): add service, block a day, edit lash map, refund deposit, publish consent version, launch offer, run birthday automation, **build a segment + tag a client**.

---

## Technical section (delta from v3)

Additional/updated tables to support grouping:
- `client_tiers` (enum: vip, favourite, regular, casual, new, seasonal, lapsed, blocked) stored as `clients.tier` + audit log.
- `tags` (id, name, colour, description) + `client_tags` (client_id, tag_id, added_by, added_at).
- `segments` (id, name, description, rule_json, is_system, is_pinned, colour) + `segment_members` (segment_id, client_id, joined_at) refreshed by a nightly cron server fn and on-write triggers (`bookings`, `payments`, `email_events`).
- `client_relationships` (from_client, to_client, kind: referred, bridal_party, family, friend).
- `client_metrics` materialised view (visits_12mo, spend_lt, avg_gap_days, last_visit_at, next_due_at, churn_score, service_affinity) recomputed on booking/payment events.
- `saved_views` (owner-scoped) storing filter combinations.
- All existing v3 tables: services/addons/packages, availability, clients, preferences, lash_maps (versioned), forms (versioned + immutable submissions), patch_tests, bookings + addons, waitlist, abandoned_checkouts, payments/refunds/invoices/credit_ledger, promo_codes/redemptions, gift_cards, loyalty_ledger, referrals, products/recommendations/sales, email_events/automations/automation_runs, reviews/testimonials, user_roles.

RLS: owner-only on `tags`, `segments`, `saved_views`, `client_relationships`, `client_metrics`. Clients never see grouping data. Grants per project rules.

Segment engine: pure SQL where possible; complex rules via a server fn evaluator returning `client_id[]` inserted into `segment_members`. Rebuild triggered by (a) nightly cron, (b) booking/payment insert, (c) manual "Refresh" button.

Stack, payments, emails, auth, storage, slot engine, signatures, SEO — unchanged from v3 (TanStack Start + Cloud + Stripe built-in + Lovable Emails + Cloud Auth magic link).

## Phased delivery
1. **Phase 1 (MVP)**: Site, slot engine, booking + deposits, consents/patch tests, basic client record with **tier + tags** and 4 system segments (VIP, New, Lapsed, Birthday-month), transactional emails, owner admin core.
2. **Phase 2**: Preference picker, lash map, one-tap rebook, loyalty, referrals, promos, waitlist, abandoned-cart, reviews, **segment builder + saved views + relationship links + churn score + seasonal segments**, reports.
3. **Phase 3**: Gift cards, packages, retail recommendations, full marketing automations tied to segments, bridal/seasonal campaign presets, blog/SEO expansion, suggested-tags AI.

Out of scope (future): multi-staff, SMS, 2-way calendar sync, native shipped shop, AI selfie style-recommender.

Approve and I'll start the build (enable Cloud + Stripe payments + set up email domain first).
