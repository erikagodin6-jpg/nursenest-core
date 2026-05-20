# Phase 14 — Mobile / App Store platform readiness (classification audit)

**Scope:** Classification of existing `nursenest-core/src/app/api` patterns for future mobile-capable clients. No API rewrites. Entitlements, checkout, and admin behavior unchanged. Verify route lists and auth assumptions against production before shipping any native shell.

**Method:** Static review of App Router `route.ts` handlers (grep for HTTP verbs, `requireAdmin`, `searchParams`, `take` / pagination). Truthpack was not present in this workspace; cross-check tier and billing copy with production policy documents.

---

## Mobile-safe APIs (learner-authenticated JSON)

Positive list for study loops (paths are under `src/app/api`):

- **Pathway lessons:** `learner/pathway-lessons`, `learner/pathway-lesson`, `learner/pathway-lessons/topics`, `learner/pathway-hub-stats`, `learner/pathway-lesson-practice-questions`
- **Readiness / adaptive:** `learner/readiness`, `learner/adaptive-recommendations`, `learner/adaptive-post-miss`, `learner/adaptive-loop`, `learner/weak-areas`, `learner/insights`, `learner/personalized-study-plan`
- **Flashcards:** `flashcards/inventory`, `flashcards/custom-session`, `flashcards/due-summary`, `flashcards/stats`, `flashcards/route`, `flashcards/decks/*`, `flashcards/cards/*/review`, `flashcards/weak-queue`
- **Practice tests / CAT:** `practice-tests`, `practice-tests/[id]`, `practice-tests/[id]/question`, `practice-tests/cat-readiness`, `practice-tests/cat-insights`, `practice-tests/[id]/cat-study-review`
- **Questions:** `questions`, `questions/[id]`, `questions/grade`, `questions/discovery`, `questions/freemium-grade`, `questions/strategy-counts`
- **Progress / lessons:** `lessons`, `lessons/progress`, `lessons/pathway-progress`
- **Exams (session):** `exams/start`, `exams/session`, `exams/session/question`, `exams/submit`, `exams/attempt/[id]`
- **Profile / settings:** `learner/personal-profile`, `learner/study-settings`, `learner/study-budget`, `learner/email-engagement-prefs`, `learner/exam-plan`
- **Notes:** `learner/notes`, `learner/notes/recent`, `learner/command-center` (uses bounded `take` for notes)
- **Auth session sync:** `auth/sync-session` (GET)

These align with paginated or single-resource patterns in learner routes (for example `pathway-lessons` uses `limit` / `page` query params; several routes use Prisma `take` caps).

---

## Normalization candidates (query params and shape consistency)

Observed patterns that benefit from consistent client parsing on mobile:

- **Dual naming:** `learner/pathway-lessons` accepts both `topicSlug` and `topic` for filters (grep shows branching on both).
- **Boolean-ish query strings:** multiple routes use `searchParams.get` with manual trim/empty checks; clients should treat missing vs empty string uniformly.
- **Mixed `Request` vs `NextRequest`:** some learner handlers use `Request` and others `NextRequest` for `searchParams`; mobile HTTP client wrappers should support both URL construction styles.

---

## Pagination and bounded list needs

Routes that already mention pagination or `take` (non-exhaustive; grep-based):

- `learner/pathway-lessons` — `limit`, `page`, topic/pathway filters
- `learner/pathway-lessons/topics` — `take: TOPIC_ROWS_CAP`
- `learner/pre-nursing-progress` — `take: PRE_NURSING_PROGRESS_LIST_TAKE`
- `learner/notes/recent` — `take` query param
- `learner/engagement-nudges` — `take: 10`
- `learner/command-center` — `take` for notes
- `learner/baseline-assessment/questions` — `takeForIdIn(ids)` pattern

**Mobile implication:** Offline sync and list UIs must assume **server-enforced caps**; never rely on unbounded client-side aggregation of list endpoints.

---

## Auth hardening candidates (from route layout)

- **`/api/admin/*`:** Large tree of admin routes; grep shows widespread `requireAdmin` usage — correct for staff surfaces; **must not** be linked from learner or future native apps.
- **`/api/debug/*`:** For example `debug/me` is gated by `NODE_ENV` and env flags (`ADMIN_ACCESS_DEBUG`, `PLAYWRIGHT_DEBUG_ME`); mobile builds must not ship with these flags enabled.
- **`/api/subscriptions/webhook`:** Stripe webhook (POST) — server-only; mobile must never call it.
- **`/api/internal/reliability/*`:** Internal reliability routes — treat as **unsuitable for mobile clients** unless explicitly designed with separate auth.
- **`/api/cron/*`:** Cron-style POST routes — secret/header gated in production; **unsuitable for mobile**.

---

## Routes unsuitable for mobile (or web-only billing)

- **`subscriptions/checkout`:** Implements Stripe checkout session creation with Stripe SDK and billing diagnostics (grep: `getStripeClient`, checkout codes) — **web / server-initiated flow only**; not a mobile purchase authority.
- **`billing/portal`, `billing/cancel-subscription`:** Customer portal flows — typically opened in system browser; confirm same-origin and cookie behavior before in-app WebView embedding.
- **`subscribe`, `trial/start`, `trial/status`:** Subscription and trial state — ensure redirects and cookies work in embedded WebView if reused from mobile.
- **Marketing checkout helpers:** For example `marketing/stamp-checkout-global-region-context` — marketing coupling; validate CORS/cookies if called from non-web clients.

---

## Offline-safe surfaces (relative)

Better candidates for cache-and-queue (still server-authoritative on sync):

- Flashcard **due** and **review** endpoints (bounded payloads when used with existing query patterns).
- Single **pathway-lesson** GET by id/pathway/slug (one lesson body per request — matches “detail page loads one lesson” policy).
- **Practice test** detail `GET practice-tests/[id]` — confirm payload size before offline cache.

**Risky offline candidates:**

- `questions/discovery` and broad `questions` list — risk of large responses unless query params strictly bound (verify per handler).
- **ECG / video:** `modules/ecg/*`, `admin/ai/ecg-video-questions/generate` — streaming and generation assume network; treat as online-only for offline UX.

---

## Telemetry gaps (mobile-specific)

Existing server routes import PostHog/Sentry helpers (for example `subscriptions/checkout` uses `captureServerEvent`, `setSentryServerContext`). Typed contracts in `mobile-observability.ts` do not add new instrumentation.

**Gap:** No dedicated `mobile.*` event namespace in API routes today; future native clients would need explicit client telemetry mapping to `MobileTelemetryEvent` shapes and crash envelopes.

---

## Notification gaps

No FCM/APNs routes were found under `src/app/api` in this audit pass. Push governance remains **policy-only** (`mobile-notification-governance.ts`). Any future push backend would need consent storage, quiet hours, and classification aligned with `PushNotificationClass`.

---

## References (code)

- Session handoff types: `src/lib/mobile-native/auth-session-handoff.ts`
- Phase 14 mobile contracts: `src/lib/platform/phase14/mobile-*.ts`
- Contract test: `src/lib/platform/phase14/phase14-mobile-readiness.contract.test.ts`

