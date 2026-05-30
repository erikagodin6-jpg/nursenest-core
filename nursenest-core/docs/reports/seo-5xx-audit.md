# SEO 5xx Audit

Generated: 2026-05-30T04:30:35.117Z

## Search Console Signal

- Reported Server Errors (5xx): 8,122
- URL export status: No local GSC URL CSV exports found. Reports use the aggregate counts from the prompt plus source/sitemap/robots analysis. Export affected URLs from GSC into data/gsc-indexing/ for frequency-accurate grouping.

## Local Root-Cause Assessment

| Surface | Finding | Risk | Action |
| --- | --- | --- | --- |
| Production build | `npm run build:production` completed successfully in the current workspace before this audit. | Low for build-time route failure | Keep build gate mandatory. |
| Root sitemap | `/sitemap.xml` is a DB-free sitemap index. | Low | Keep DB-free. |
| Sitemap children | 12 child sitemap urlsets are emitted by the index. | Medium if child route fetches DB without fallback | Verify each child with live sitemap checks. |
| Proxy/middleware | `src/proxy.ts` bypasses `/sitemap.xml`, `/sitemap-*.xml`, and `/robots.txt`. | Low for current code; historically high | Keep contract tests around public crawl bypass. |
| Robots route | `/robots.txt` is static and returns fallback 200 on invariant failure. | Low | Keep static route. |

## Live Production Timeout Evidence

`SITEMAP_VERIFY_MAX_URLS=500 SITEMAP_VERIFY_CONCURRENCY=8 npm run verify:sitemap` checked the first 500 production sitemap URLs on 2026-05-30. It found 17 route timeouts. Search Console may classify repeated crawler timeouts as Server Error / 5xx-equivalent availability failures.

| Template / Surface | Example URLs | Likely Failure Cause | Priority |
| --- | --- | --- | --- |
| Pathway question landing pages | `/canada/rn/nclex-rn/questions`, `/us/rn/nclex-rn/questions`, `/us/np/fnp/questions`, `/us/np/pmhnp/questions`, `/us/np/whnp/questions`, `/us/np/pnp-pc/questions` | Slow server render, metadata validation, DB/content-loader dependency, or upstream timeout. | P0 |
| NP pathway hub/pricing | `/us/np/pnp-pc`, `/us/np/pnp-pc/pricing` | Slow pathway resolution or pricing page render for PNP-PC. | P0 |
| Test-bank marketing pages | `/us/rn/nclex-rn/test-bank`, `/canada/rpn/rex-pn/test-bank`, `/canada/np/cnple/test-bank`, `/us/np/fnp/test-bank`, `/us/np/agpcnp/test-bank` | Commercial landing template timeout. | P0 |
| REx-PN body-system practice pages | `/canada/pn/rex-pn/rex-pn-practice-questions-cardiovascular`, `/respiratory`, `/gastrointestinal`, `/neurological` | Programmatic topic render timeout. | P0 |

Immediate remediation target: profile these templates in production, enforce bounded data loading and metadata generation, then rerun the live sitemap smoke until timeout count is zero.

## Highest-Risk Templates To Check First

_No Search Console URL export rows were available for this issue._

## Source Files With SEO/Crawl Error-Handling Surfaces

- /admin/access (src/app/(admin)/admin/access/page.tsx)
- /admin/analytics/content-quality (src/app/(admin)/admin/analytics/content-quality/page.tsx)
- /admin/analytics/retention-risk (src/app/(admin)/admin/analytics/retention-risk/page.tsx)
- /admin/beta (src/app/(admin)/admin/beta/page.tsx)
- /admin/blog/control-panel (src/app/(admin)/admin/blog/control-panel/page.tsx)
- /admin/blog/gemini-draft (src/app/(admin)/admin/blog/gemini-draft/page.tsx)
- /admin/blog/generate (src/app/(admin)/admin/blog/generate/page.tsx)
- /admin/blog/scheduler (src/app/(admin)/admin/blog/scheduler/page.tsx)
- /admin/blog/studio (src/app/(admin)/admin/blog/studio/page.tsx)
- /admin/business-command-center (src/app/(admin)/admin/business-command-center/page.tsx)
- /admin/clinical-scenarios/[scenarioId] (src/app/(admin)/admin/clinical-scenarios/[scenarioId]/page.tsx)
- /admin/content-bulk (src/app/(admin)/admin/content-bulk/page.tsx)
- /admin/fraud (src/app/(admin)/admin/fraud/page.tsx)
- /admin/hub/publishing (src/app/(admin)/admin/hub/publishing/page.tsx)
- /admin/i18n (src/app/(admin)/admin/i18n/page.tsx)
- /admin/modules/allied (src/app/(admin)/admin/modules/allied/page.tsx)
- /admin/modules/ecg (src/app/(admin)/admin/modules/ecg/page.tsx)
- /admin/modules/lab-values (src/app/(admin)/admin/modules/lab-values/page.tsx)
- /admin/modules (src/app/(admin)/admin/modules/page.tsx)
- /admin/ops-center (src/app/(admin)/admin/ops-center/page.tsx)
- /admin/osce-stations/[id] (src/app/(admin)/admin/osce-stations/[id]/page.tsx)
- /admin/pathway-lessons/open (src/app/(admin)/admin/pathway-lessons/open/page.tsx)
- /admin/platform-ecosystem (src/app/(admin)/admin/platform-ecosystem/page.tsx)
- /admin/premium-protection (src/app/(admin)/admin/premium-protection/page.tsx)
- /admin/printables/[id]/analytics (src/app/(admin)/admin/printables/[id]/analytics/page.tsx)
- /admin/printables/[id] (src/app/(admin)/admin/printables/[id]/page.tsx)
- /admin/referrals (src/app/(admin)/admin/referrals/page.tsx)
- /admin/seo (src/app/(admin)/admin/seo/page.tsx)
- /admin/users/[userId] (src/app/(admin)/admin/users/[userId]/page.tsx)
- /admin/users/[userId]/view-as (src/app/(admin)/admin/users/[userId]/view-as/page.tsx)
- / (src/app/(admin)/layout.tsx)
- /app/account/beta (src/app/(app)/app/(learner)/account/beta/page.tsx)
- /app/account/mistakes (src/app/(app)/app/(learner)/account/mistakes/page.tsx)
- /app/account/motivation (src/app/(app)/app/(learner)/account/motivation/page.tsx)
- /app/account/overview (src/app/(app)/app/(learner)/account/overview/page.tsx)
- /app/account/progress (src/app/(app)/app/(learner)/account/progress/page.tsx)
- /app/account/readiness (src/app/(app)/app/(learner)/account/readiness/page.tsx)
- /app/account/study-history (src/app/(app)/app/(learner)/account/study-history/page.tsx)
- /app/baseline-assessment (src/app/(app)/app/(learner)/baseline-assessment/page.tsx)
- /app/clinical-skills (src/app/(app)/app/(learner)/clinical-skills/page.tsx)
- /app/command-center (src/app/(app)/app/(learner)/command-center/page.tsx)
- /app/exam-plan (src/app/(app)/app/(learner)/exam-plan/page.tsx)
- /app/exams/attempts/[id] (src/app/(app)/app/(learner)/exams/attempts/[id]/page.tsx)
- /app/flashcards (src/app/(app)/app/(learner)/flashcards/layout.tsx)
- /app/flashcards (src/app/(app)/app/(learner)/flashcards/page.tsx)
- /app/guided (src/app/(app)/app/(learner)/guided/page.tsx)
- /app (src/app/(app)/app/(learner)/layout.tsx)
- /app/lessons/[id] (src/app/(app)/app/(learner)/lessons/[id]/page.tsx)
- /app/lessons (src/app/(app)/app/(learner)/lessons/page.tsx)
- /app (src/app/(app)/app/(learner)/page.tsx)
- /app/pharmacology (src/app/(app)/app/(learner)/pharmacology/page.tsx)
- /app/practice-tests/[id] (src/app/(app)/app/(learner)/practice-tests/[id]/page.tsx)
- /app/practice-tests/[id]/results (src/app/(app)/app/(learner)/practice-tests/[id]/results/page.tsx)
- /app/practice-tests/cat-launch (src/app/(app)/app/(learner)/practice-tests/cat-launch/page.tsx)
- /app/practice-tests/start (src/app/(app)/app/(learner)/practice-tests/start/page.tsx)
- /app/printables (src/app/(app)/app/(learner)/printables/page.tsx)
- /app/prioritization-delegation (src/app/(app)/app/(learner)/prioritization-delegation/page.tsx)
- /app/quick-start (src/app/(app)/app/(learner)/quick-start/page.tsx)
- /app/review (src/app/(app)/app/(learner)/review/page.tsx)
- /app/simulation-center/clearances (src/app/(app)/app/(learner)/simulation-center/clearances/page.tsx)
- /app/simulation-center (src/app/(app)/app/(learner)/simulation-center/page.tsx)
- /app/simulation-center/readiness (src/app/(app)/app/(learner)/simulation-center/readiness/page.tsx)
- /app/start-studying (src/app/(app)/app/(learner)/start-studying/page.tsx)
- /app/strategy/[strategyKey] (src/app/(app)/app/(learner)/strategy/[strategyKey]/page.tsx)
- /app (src/app/(app)/app/layout.tsx)
- / (src/app/(app)/layout.tsx)
- /modules/ecg-advanced (src/app/(app)/modules/ecg-advanced/layout.tsx)
- /modules/ecg-interpretation (src/app/(app)/modules/ecg-interpretation/layout.tsx)
- /modules/ecg (src/app/(app)/modules/ecg/layout.tsx)
- /modules/ecg/pediatric/cases (src/app/(app)/modules/ecg/pediatric/cases/page.tsx)
- /modules/ecg/pediatric (src/app/(app)/modules/ecg/pediatric/page.tsx)
- /modules/hemodynamics-advanced (src/app/(app)/modules/hemodynamics-advanced/layout.tsx)
- /modules/hemodynamics-advanced (src/app/(app)/modules/hemodynamics-advanced/page.tsx)
- /modules/hemodynamics (src/app/(app)/modules/hemodynamics/layout.tsx)
- /modules/hemodynamics (src/app/(app)/modules/hemodynamics/page.tsx)
- /modules/lab-values (src/app/(app)/modules/lab-values/layout.tsx)
- /modules/labs-advanced/[slug] (src/app/(app)/modules/labs-advanced/[slug]/page.tsx)
- /modules/labs-advanced (src/app/(app)/modules/labs-advanced/layout.tsx)
- /modules/labs-advanced (src/app/(app)/modules/labs-advanced/page.tsx)
- /modules/rt-ventilator (src/app/(app)/modules/rt-ventilator/layout.tsx)
- ... 111 more

## P0 Remediation Plan

1. Export the GSC Server Error URL list and place it in `data/gsc-indexing/5xx.csv`.
2. Run `npm run audit:gsc-indexing` to group by template.
3. Run `SITEMAP_VERIFY_MAX_URLS=5000 npm run verify:sitemap` against production.
4. Fix any child sitemap or public page that returns 5xx; do not redirect 5xx URLs until the exception is fixed.
5. Keep `/sitemap.xml`, `/sitemap-*.xml`, and `/robots.txt` outside auth/proxy middleware.
