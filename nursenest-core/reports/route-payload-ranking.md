# Route payload ranking — NurseNest (audit only)

**Method:** Static analysis (layouts, guards, large client modules, `scripts/audit-runtime-payloads.mjs`). No bundle analyzer run in this pass. **No behavior changes.**

**Categories:** `SAFE_FOR_AI` — safe for automation summaries · `DEV_REVIEW` — needs human judgment on trade-offs · `DEVELOPER_ONLY` — internal/admin or tooling-heavy

---

## A. Large on-disk JSON (server/catalog risk, not route imports)

From `node scripts/audit-runtime-payloads.mjs` (thresholds: warn ≥512 KiB, giant ≥2 MiB under `src/content`):

| Approx size | Path | Route leak risk |
|-------------|------|-----------------|
| ~14.3 MiB GIANT | `src/content/pathway-lessons/np-parity-expansion-catalog.json` | Must stay **server/build** only |
| ~10.8 MiB GIANT | `src/content/pathway-lessons/catalog.json` | Same |
| ~7.0 MiB GIANT | `src/content/pathway-lessons/np-core-catalog.json` | Same |
| ~4.7 MiB GIANT | `src/content/lessons/lesson-library.json` | **Explicitly banned** from hub `page.tsx` files per `lessons-hub-import-guard.test.ts` |
| + more expansion catalogs | `src/content/pathway-lessons/*-expansion-catalog.json` | Same |

**generated-indexes:** ~10 files, **~1.76 MiB total** — optional disk indexes (`pathway-lesson-generated-index.ts`); script reports **no `generated-indexes` string in `src/app`** (ok).

**Script isolation checks (passing):** no `pathway-lesson-catalog-sync` in `use client` under `src/app`; no direct `@/content/*` imports in client `src/app` files.

---

## B. Ranked routes / surfaces (heaviest first)

| Rank | Surface / route pattern | Server payload / work | Client payload | Hydration / boundary risk | Category | Notes |
|------|-------------------------|----------------------|----------------|---------------------------|----------|-------|
| 1 | **`/app/practice-tests/*` run session** (`practice-test-runner-client.tsx`) | RSC page + API hydrate for session/question | **Extreme** — ~3.1k-line client module importing CAT UI, smart review, study plan, ECG media, confidence analytics, many panels | **Highest** — single client island owns most of the tree | DEV_REVIEW | Dominates learner JS + state; see `oversized-client-components.md`. |
| 2 | **`/admin` blog control** (`admin-blog-control-panel-client.tsx`) | Admin RSC + heavy data | **Extreme** — ~2.9k lines | High (admin session) | DEVELOPER_ONLY | Staff-only; still affects editor laptops and CI. |
| 3 | **`/app/questions`** (`question-bank-practice-client.tsx`) | Pathway + bank fetches | **Very high** — ~1.9k lines | High | DEV_REVIEW | Long-lived session UI. |
| 4 | **`/app/practice-tests` hub** (`practice-tests-hub-client.tsx`) | Lists + filters server-side | **High** — ~1.5k lines | Medium–high | DEV_REVIEW | Drawer + topic grid complexity. |
| 5 | **Marketing pathway lesson hub** `[locale]/[slug]/[examCode]/lessons` | Paginated lessons + **capped** DB verify (`lessons-hub-import-guard.test.ts` documents past 5+ min failure mode) | Medium (mostly RSC cards) | Medium | SAFE_FOR_AI | Guards enforce `pageVerifyCap`; do not regress caps. |
| 6 | **Marketing pathway lesson detail** `[lessonSlug]` | Full lesson record server-side; **serialization contract** in `marketing-pathway-lesson-client-contract.ts` | Medium if props cross client boundary incorrectly | **High if** full `sections` leak to client | DEV_REVIEW | Contract says full record stays server-only. |
| 7 | **Learner shell** `/app/*` ( `(learner)/layout.tsx` ) | Every navigation: `resolveEntitlementForPage`, `loadPaywallHomeStatsForShell`, pathway nav (`loadLearnerPathwayNavMetadata` / fallback), optional study-next block, tutor shell | **Many client providers** under one tree (`SentryLearnerShell`, `PaywallHomeStatsProvider`, `LearnerExamStudyProviders`, nav, motion) | **High cumulative** hydration | DEV_REVIEW | `export const dynamic = "force-dynamic"` — no static shell cache. |
| 8 | **Site header (marketing)** | `force-dynamic` marketing layouts | `site-header.tsx` ~1.1k lines client | High on mobile (drawer) | SAFE_FOR_AI | Chunk-loaded drawer paths exist; still heavy. |
| 9 | **`/app/practice-tests/cat-insights`** | **Entire `page.tsx` is `"use client"`** — fetches `/api/practice-tests/cat-insights` | List state client-only | Medium (whole route client) | DEV_REVIEW | Could be RSC + small client table later (out of scope). |
| 10 | **Homepage `/`** | Marketing default layout + sections | `home-restored-client`, carousel, etc. | Medium | SAFE_FOR_AI | Marketing `force-dynamic`. |

---

## C. API / JSON response guards (reference)

`src/lib/observability/api-response-size-constants.ts`: `LARGE_API_RESPONSE_BYTES = 500_000`, `ALERT_API_PAYLOAD_BYTES = 250_000` — any route returning bigger JSON should be flagged in ops review.

---

## D. Optimization ROI (biggest win first — opinionated)

1. **Split / lazy-load** `practice-test-runner-client.tsx` by phase (linear vs CAT vs results) — **largest single-client payload + hydration**.  
2. **Admin blog control panel** code-splitting or route splitting — large but staff-only.  
3. **Question bank client** — second largest learner monolith.  
4. **Learner layout** — defer non-critical `Promise.all` work (already partially gated with `shouldSkipNonCriticalLearnerWork`); document duplicate read patterns for staff QA.  
5. **CAT insights page** — move data fetch to RSC + small client island.  
6. **Keep** hub verify caps and import guards — **zero ROI** in removing them; negative ROI if regressed.

---

## E. Duplicate runtime loading (patterns)

| Pattern | Where | Risk |
|---------|-------|------|
| Learner layout parallel fetch | `entitlement` + `paywallHomeStats` + `pathwayNav` + optional `studyNextBlock` | Intentional; watch **N+1** if new awaits added uncapped |
| Marketing + learner both load marketing shards | Learner paywalled body uses `MarketingI18nShardLayer` | Extra dictionary merge on client boundary — acceptable if shards bounded |

No automated duplicate-fetch detection was run beyond layout read.
