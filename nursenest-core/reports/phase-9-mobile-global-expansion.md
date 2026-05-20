# Phase 9 — Native mobile & global expansion foundations

**Scope:** planning, TypeScript contracts, read-only tooling, and this report. **No** React Native / Expo app, **no** weakening of entitlements, auth, SEO, or sitemap behavior, **no** unsafe caching of sensitive learner payloads.

**Contracts location:** `src/lib/mobile-native/` (barrel: `index.ts`).

**Tooling:** `npm run report:mobile-route-payloads` — complements `scripts/report-large-client-components.mjs` (run via `node scripts/report-large-client-components.mjs` if no npm alias).

---

## 1. Strategy summary

NurseNest's learner product is a **server-first Next.js App Router** shell with substantial RSC + client islands. A future native shell should:

1. Reuse the same **server-enforced entitlements** and session sources of truth as web.
2. Treat offline storage as **untrusted** until reconciled with the server (especially premium lesson bodies).
3. Keep push and engagement analytics behind **opt-in** and existing privacy-aware pipelines — no new public PII surfaces.

**Native framework options (do not couple to one):**

| Option | Fit | Notes |
|--------|-----|--------|
| **React Native (Expo)** | High if sharing React mental models | Strong ecosystem; still needs native auth session handling and a thin API boundary. |
| **Kotlin Multiplatform / Swift shared logic** | High for performance-critical sync | More upfront cost; best when UI is fully native. |
| **Capacitor / WebView shell** | Fastest to ship | Entitlement-sensitive flows should still hit native-issued cookies / attested WebView where possible; watch WebView storage. |
| **Flutter** | Medium | Rewrite UI; strong animation + one codebase; separate design system alignment work. |

Recommendation: keep **contracts** in plain TypeScript (`src/lib/mobile-native`) and let each platform implement `MobileNativeApiClient`, `MobileNativeOfflineSyncQueue`, and `MobileNativePushNotificationProvider`.

---

## 2. Mobile audit (Playwright + learner shell)

### 2.1 Playwright mobile config

- **Config:** `playwright.mobile.config.ts` — Pixel 7 + iPhone 14 projects, `workers: 1`, long timeouts for cold `next dev`, optional paid auth via `E2E_PAID_EMAIL` / `E2E_PAID_PASSWORD`.
- **Public specs:** `tests/e2e/mobile/mobile-regression.spec.ts`, `mobile-marketing-routes.spec.ts`, `mobile-learner-free-layout.spec.ts`.
- **Paid specs:** `mobile-learner-authenticated-layout.spec.ts`, `mobile-learner-study-interactions.spec.ts` (require `setup-paid-auth`).
- **Assertions:** `tests/e2e/helpers/mobile-layout-health.ts` — document vs `<main>` horizontal overflow; `assertOpenMenuButtonMinSize` for ~44px touch targets.

### 2.2 Learner shell

- **Layout:** `src/app/(student)/app/(learner)/layout.tsx` — session + `resolveEntitlementForPage`, marketing i18n shards, paywall stats, degraded / emergency skip paths, single `<main id="nn-learner-main">`.
- **Risk:** Large layout fan-out increases **hydration** surface for any client children; entitlement resolution must stay on server (already the case).

### 2.3 Flow-level bottlenecks (for native / PWA parity)

| Area | Bottleneck / pattern | Notes |
|------|----------------------|--------|
| **Hydration** | Client islands on study routes (flashcards, CAT, practice runner) | Prefer server data for first paint; native avoids DOM hydration but still pays JSON + parse cost. |
| **Payloads** | Large `page.tsx` / `layout.tsx` under `(learner)` | Run `npm run report:mobile-route-payloads`; large files suggest split or more RSC. |
| **Offline-hostile** | Paywall + entitlement on `/app/lessons` for free tier | Correct behavior; native must not cache unlocked lesson bodies without server proof. |
| **Touch / viewport** | Long CAT / practice flows, bottom nav | E2E covers horizontal overflow; scroll containers + sticky chrome need native-safe hit targets. |
| **Session** | Cookie-based auth with `next dev` for E2E | Native needs explicit handoff contract (`auth-session-handoff.ts`) — no secret embedding. |

---

## 3. Offline foundations (policy)

- **Flashcards:** Persist `MobileNativeOfflineFlashcardDeckHandle` (IDs + version) + queue of rating events; full card text only if server already returned it under current entitlement session.
- **Lessons:** `MobileNativeLessonReaderSnapshotPolicy` — default **`metadata_only`**; **`entitled_excerpt`** only with `entitlementProofId` from server.
- **Progress:** `MobileNativeProgressSyncQueueItem` — replay queue; bounded `payloadSummary`.
- **Resume:** `MobileNativeResumableSessionToken` — UX bookmark only; server owns graded truth.
- **Degraded mode:** Align with `isDegradedMode()` usage in learner shell — `MobileNativeDegradedModeInteraction` types for client policy.

---

## 4. Push / events (contracts only)

- **Channels:** `MobileNativeNotificationChannel` in `push-notifications.ts`.
- **Payloads:** Typed per channel; **opt-in** via `MobileNativeNotificationOptInFlags`.
- **Analytics hook:** `MobileNativePushAnalyticsHook` — phase + template id, not raw PII.
- **No FCM/APNs** in this phase — provider interface only.

---

## 5. Global localization readiness

### 5.1 Shards & compile pipeline

- **Doc:** `docs/i18n-architecture.md` — monolith tables, marketing merge, `npm run i18n:compile`, merged JSON under `public/i18n/`.
- **Validation (existing):** from repo root — `npm run i18n:validate`, `i18n:validate:production`, `i18n:check-drift`, `i18n:report-placeholder-fallbacks`, `i18n:audit-payload`; in `nursenest-core` package — `i18n:audit:all`, `i18n:seo:verify`, `test:i18n:routes` (Playwright).

### 5.2 SEO / locale routing

- **Constraint (this pass):** No changes to canonical URLs or sitemap generators.
- **Playwright:** `playwright.i18n-routes.config.ts`, `tests/e2e/seo/localized-seo.spec.ts` for route-level checks.

### 5.3 RTL risks

- Locales include `ar`, `fa`, `ur`, etc. (`docs/i18n-architecture.md`).
- **Gap:** Many learner/marketing components use physical `text-right` / directional Tailwind for layout (e.g. flashcards hub, lesson sequence nav, practice runner). RTL QA should prioritize **study surfaces** and **paywall** — prefer **logical** properties (`ms-*`, `ps-*`, `text-end`) incrementally in future UI passes.

### 5.4 Missing-key hotspots

- Non-English missing keys surface as `[missing:key]` (documented policy).
- Hottest verification: `i18n:validate:production` + per-locale `i18n:audit:*` scripts in `package.json`.

---

## 6. Mobile performance (read-only)

- **`report-large-client-components.mjs`:** Warn-only scan of large `"use client"` `.tsx` files (global `src/`).
- **`npm run report:mobile-route-payloads`:** Route-ish files under `(student)/app` and `(learner)` — **file size** + **`use client` directive count** per file (heuristic for bundle / hydration pressure).

---

## 7. Engagement analytics (contracts)

- **Events:** `src/lib/mobile-native/engagement-analytics-events.ts` — session start/end, streak, DAL checkpoint, return-day-n.
- **Server aggregation:** `MobileNativeEngagementAggregationPort` — placeholder interface for cron/worker implementations (**no** new public HTTP API in this phase).

---

## 8. App Store / distribution considerations (checklist)

- **Auth:** Use short-lived handoff + platform secure storage; no secrets in app binary.
- **Subscriptions:** Apple / Google IAP vs Stripe web entitlements — plan **single source of truth** on server (existing DB-backed model).
- **Content ratings:** Medical / exam prep copy may trigger age or accuracy disclaimers per store.
- **Privacy nutrition / data safety:** Declare analytics (e.g. PostHog) and push providers; map to opt-in flags.
- **Offline:** Disclose limited offline behavior; avoid implying full exam bank availability offline without purchase proof.

---

## 9. Validation log (agent run, 2026-05-06)

| Command | Result |
|---------|--------|
| `npm run typecheck` | **Killed (exit 137)** in this environment — likely OOM during full `tsc`; re-run on CI/workstation with adequate memory. |
| `npm run typecheck:critical` | **Pass (exit 0)** — includes `src/lib/mobile-native/**/*.ts` plus auth/stripe/subscriptions subset (~1m re-run after include). |
| `npm run build` | **Fail** — `verify:lesson-indexes` ENOENT for `src/content/pathway-lessons/generated-indexes/us-rn-new-grad-transition.json` (missing generated artifact in this checkout; unrelated to Phase 9 contracts). |
| `npm run report:mobile-route-payloads` | **Pass (exit 0)** — deduped learner route-ish files; largest route file flagged ~49KB source. |
| `node --import tsx --test src/lib/mobile-native/mobile-native.contract.test.ts` | **Pass (exit 0)** |
| `npm run test:e2e:mobile` | **Not executed** here (requires `next dev` + DB + optional paid creds; ~18 listed tests across Pixel + iPhone projects). |
| `npm run test:e2e:release` | **Not executed** (release smoke suite not run in this pass). |

---

## 10. Files added / touched (Phase 9)

| Path | Role |
|------|------|
| `src/lib/mobile-native/*.ts` | Contracts |
| `src/lib/mobile-native/mobile-native.contract.test.ts` | Minimal compile/export test |
| `scripts/report-mobile-route-payloads.mts` | Read-only route payload report |
| `scripts/report-large-client-components.mjs` | Cross-reference line to mobile report script |
| `package.json` | `report:mobile-route-payloads` script |
| `reports/phase-9-mobile-global-expansion.md` | This document |
