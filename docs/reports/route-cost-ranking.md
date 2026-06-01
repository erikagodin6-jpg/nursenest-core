# Route Cost Ranking

Generated: 2026-06-01

## Scope

Route families audited:

- homepage
- blog
- lessons
- questions
- flashcards
- NP
- RN
- RPN
- allied
- localized routes

Primary sources:

- `nursenest-core/reports/production-seo-current/results.json`
- `nursenest-core/reports/build-route-timings.json`
- live `curl` payload/time samples from production
- source-level Prisma dependency search across `src/app/(marketing)`, `src/lib/blog`, `src/lib/marketing`, and `src/lib/seo`

## Important Measurement Limitations

Production does not currently expose per-route Prisma query count, query duration, CPU time, or request memory allocation in HTTP responses. This report therefore separates:

- **Measured:** HTTP status, response time, cache status, payload size samples, build-time layout timing, source-level DB call sites.
- **Inferred:** CPU/memory pressure and DB duration risk, based on source dependencies and route behavior.

The latest crawl contains many fast 504s with upstream 503. Those are origin availability failures, not reliable route-local render-time measurements.

## Executive Finding

The 20% of routes causing most load are:

1. **Lessons**: 1,469 URLs, 100% 504 in the stale crawl, dynamic lesson pages with large payloads.
2. **Blog articles**: 5,801 URLs, 4,725 504s and 1,076 200s; enormous URL count makes it the dominant crawl-load family.
3. **Localized routes**: fewer URLs, but very large payload sample, likely due full localized chrome/footer/message payload.
4. **Homepage**: one route, but uncached MISS and historically high shared-layout cost.
5. **Public ECG/advanced public pages**: highest successful response times in the crawl, all cache HIT but still ~2.8-3.1s.

## Route Family Ranking

Ranked by combined load risk: URL volume, 5xx rate, p95 latency, payload size, and DB dependency risk.

| Rank | Family | URLs in Crawl | 200 | 5xx | 5xx % | Median ms | P95 ms | Max ms | DB Call-Site Risk | Payload Sample |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---|---:|
| 1 | blog | 5,801 | 1,076 | 4,725 | 81.5% | 126 | 206 | 375 | High: `safe-blog-queries.ts` contains many `findMany`, `count`, `groupBy`, and slug lookups | `/blog`: 1.69 MB |
| 2 | lessons | 1,469 | 0 | 1,469 | 100.0% | 132 | 223 | 478 | High: lesson route families use pathway lesson loaders and sitemap lesson collectors | sample lesson: 3.22 MB |
| 3 | other public / ECG | 167 | 12 | 155 | 92.8% | 125 | 2,854 | 3,125 | Medium: mixed static and public clinical pages | advanced ECG pages ~2.8-3.1s in crawl |
| 4 | localized routes | 45 | 0 | 45 | 100.0% | 111 | 190 | 228 | High payload/message risk; localized blog loaders use DB | `/fr`: 3.21 MB |
| 5 | allied | 62 | 0 | 62 | 100.0% | 248 | 343 | 358 | Medium/high: allied hub overview uses flashcard deck and exam question probes | `/allied-health`: 1.98 MB |
| 6 | NP | 192 | 2 | 190 | 99.0% | 123 | 186 | 220 | Medium/high: CNPLE/NP hubs and lessons use inventory and lesson lookups | `/cnple`: 1.60 MB |
| 7 | RPN | 79 | 0 | 79 | 100.0% | 125 | 192 | 230 | Medium: pathway and question-bank style routes | stale sample route returned 404 on `/rex-pn/test-bank` |
| 8 | RN | 73 | 0 | 73 | 100.0% | 114 | 189 | 218 | Medium: pathway and question-bank style routes | `/canada/rn/nclex-rn`: 1.61 MB |
| 9 | questions | 29 | 0 | 29 | 100.0% | 122 | 184 | 211 | High per-page query risk: programmatic question-topic pages count and fetch question rows | sample: 1.56 MB |
| 10 | flashcards | not represented as distinct crawl family | n/a | n/a | n/a | n/a | n/a | n/a | High per-page query risk: public flashcard landing uses tags, decks, and cards | `/flashcards`: 1.58 MB |
| 11 | homepage | 1 | 0 | 1 | 100.0% | 66 | 66 | 66 | Previously high: homepage public stats had 9 DB operations; now safe-mode skips optional DB reads | `/`: 0.89 MB, 6.44s live sample |

## Top 25 Most Expensive Routes

Sorted by measured response time from `production-seo-current/results.json`.

| Rank | Family | Status | ms | Cache | URL |
|---:|---|---:|---:|---|---|
| 1 | other public / ECG | 200 | 3,125 | HIT | `https://nursenest.ca/advanced-ecg-nursing` |
| 2 | other public / ECG | 200 | 3,091 | HIT | `https://nursenest.ca/advanced-ecg-nursing/telemetry-monitoring` |
| 3 | other public / ECG | 200 | 3,064 | HIT | `https://nursenest.ca/advanced-ecg-nursing/medication-induced-ecg-changes` |
| 4 | other public / ECG | 200 | 3,052 | HIT | `https://nursenest.ca/advanced-ecg-nursing/critical-care-ecg` |
| 5 | other public / ECG | 200 | 3,022 | HIT | `https://nursenest.ca/advanced-ecg-nursing/ecg-case-simulations` |
| 6 | other public / ECG | 200 | 2,974 | HIT | `https://nursenest.ca/advanced-ecg-nursing/12-lead-stemi` |
| 7 | other public / ECG | 200 | 2,955 | HIT | `https://nursenest.ca/advanced-ecg-nursing/electrolyte-ecg-changes` |
| 8 | other public / ECG | 200 | 2,885 | HIT | `https://nursenest.ca/advanced-ecg-nursing/pediatric-ecg` |
| 9 | other public / ECG | 200 | 2,875 | HIT | `https://nursenest.ca/advanced-ecg-nursing/acls-rhythms` |
| 10 | other public / ECG | 200 | 2,854 | HIT | `https://nursenest.ca/advanced-ecg-nursing/rhythm-practice` |
| 11 | lessons | 504 | 478 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/antibiotic-selection-resp-np` |
| 12 | lessons | 504 | 465 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/asthma-diagnostic-criteria-np` |
| 13 | lessons | 504 | 463 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/angioedema-np` |
| 14 | lessons | 504 | 461 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/ana-interpretation-np` |
| 15 | lessons | 504 | 428 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/ankylosing-spondylitis-np` |
| 16 | lessons | 504 | 426 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/antibiotic-duration-decisions-np` |
| 17 | lessons | 504 | 423 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/asthma-pathophysiology-advanced-np` |
| 18 | lessons | 504 | 422 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/asthma-pathophysiology-np` |
| 19 | lessons | 504 | 416 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/anticoag-bridging-concepts` |
| 20 | lessons | 504 | 414 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/anticholinergic-toxidrome-np` |
| 21 | lessons | 504 | 413 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/anxiety-disorders-core-np` |
| 22 | lessons | 504 | 412 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/aub-mechanisms-np` |
| 23 | lessons | 504 | 411 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/assessment-np` |
| 24 | lessons | 504 | 408 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/ascvd-risk-calculation-np` |
| 25 | lessons | 504 | 406 | MISS | `https://nursenest.ca/canada/np/cnple/lessons/antiphospholipid-syndrome-np` |

## Top 25 Most Expensive Successful Routes

The successful slowest routes are all cache hits, meaning they still cost users bandwidth/parse time even when origin rendering is avoided.

| Rank | Family | ms | Payload/Notes | URL |
|---:|---|---:|---|---|
| 1 | other public / ECG | 3,125 | cache HIT | `/advanced-ecg-nursing` |
| 2 | other public / ECG | 3,091 | cache HIT | `/advanced-ecg-nursing/telemetry-monitoring` |
| 3 | other public / ECG | 3,064 | cache HIT | `/advanced-ecg-nursing/medication-induced-ecg-changes` |
| 4 | other public / ECG | 3,052 | cache HIT | `/advanced-ecg-nursing/critical-care-ecg` |
| 5 | other public / ECG | 3,022 | cache HIT | `/advanced-ecg-nursing/ecg-case-simulations` |
| 6 | other public / ECG | 2,974 | cache HIT | `/advanced-ecg-nursing/12-lead-stemi` |
| 7 | other public / ECG | 2,955 | cache HIT | `/advanced-ecg-nursing/electrolyte-ecg-changes` |
| 8 | other public / ECG | 2,885 | cache HIT | `/advanced-ecg-nursing/pediatric-ecg` |
| 9 | other public / ECG | 2,875 | cache HIT | `/advanced-ecg-nursing/acls-rhythms` |
| 10 | other public / ECG | 2,854 | cache HIT | `/advanced-ecg-nursing/rhythm-practice` |
| 11 | blog | 248 | cache HIT | `/blog/au-np-acp-evidence-based-medicine-appraisal-for-nps-community-mental-health` |
| 12 | blog | 239 | cache HIT | `/blog/au-np-acp-evidence-based-medicine-appraisal-for-nps-primary-care-australia` |
| 13 | blog | 238 | cache HIT | `/blog/ar-intl-sepsis-early-care-intl-topic-113` |
| 14 | blog | 233 | cache HIT | `/blog/au-np-acp-polypharmacy-deprescribing-risk-review-reproductive-womens-health` |
| 15 | blog | 232 | cache HIT | `/blog/au-np-acp-lipid-management-statin-intolerance-educational-primary-care-australia` |
| 16 | blog | 231 | cache HIT | `/blog/au-np-acp-electrolyte-hyponatremia-chronic-educational-hospital-acute-interface` |
| 17 | blog | 230 | cache HIT | `/blog/ar-intl-arrhythmia-syncope-monitoring-intl-topic-109` |
| 18 | blog | 229 | cache HIT | `/blog/asthma-medications-pharmacology-explained` |
| 19 | blog | 226 | cache HIT | `/blog/ar-intl-arrhythmia-syncope-monitoring-intl-topic-081` |
| 20 | blog | 226 | cache STALE | `/blog/copd-symptoms-treatment-nursing-care` |
| 21 | blog | 224 | cache HIT | `/blog/au-np-acp-rural-access-telehealth-and-coordinated-care-reproductive-womens-health` |
| 22 | blog | 223 | cache HIT | `/blog/ar-intl-arrhythmia-syncope-monitoring-intl-topic-137` |
| 23 | blog | 223 | cache HIT | `/blog/au-np-acp-electrolyte-hyponatremia-chronic-educational-rural-remote-australia` |
| 24 | blog | 222 | cache HIT | `/blog/au-np-acp-abg-metabolic-respiratory-mixed-patterns-community-mental-health` |
| 25 | blog | 221 | cache HIT | `/blog/ar-intl-acute-intoxication-stabilization-intl-topic-139` |

## Live Payload Samples

| Family | URL | Status | Time | Downloaded HTML |
|---|---|---:|---:|---:|
| homepage | `/` | 200 | 6.44s | 0.89 MB |
| blog hub | `/blog` | 200 | 0.08s | 1.69 MB |
| lesson detail | `/canada/np/cnple/lessons/antibiotic-selection-resp-np` | 200 | 9.74s | 3.22 MB |
| localized | `/fr` | 200 | 6.80s | 3.21 MB |
| questions | `/questions/nclex-next-gen-question-types` | 200 | 0.59s | 1.56 MB |
| flashcards | `/flashcards` | 200 | 0.39s | 1.58 MB |
| NP | `/cnple` | 200 | 0.80s | 1.60 MB |
| RN | `/canada/rn/nclex-rn` | 200 | 1.02s | 1.61 MB |
| allied | `/allied-health` | 200 | 0.55s | 1.98 MB |

Payload conclusion: the biggest immediate bandwidth/parse offenders are lesson detail and localized routes, both over 3 MB for sampled HTML responses.

## DB Query Count And Duration Findings

Exact production DB query counts/durations are not available from the current artifacts. Static source tracing shows likely DB pressure:

| Family | Static DB Call-Site Finding |
|---|---|
| homepage | `public-home-stats.ts` had 9 Prisma operations: lesson counts, flashcard counts, user count, question counts, and question `groupBy`. Current safe-mode skips optional DB reads for `/`. |
| blog | `safe-blog-queries.ts` contains many public read paths: page `findMany`, total `count`, status `groupBy`, slug `findUnique/findFirst`, tag/category counts. |
| lessons | sitemap/lesson route families use `pathwayLesson` group/find queries and generated indexes; dynamic detail payload is very large. |
| questions | `load-programmatic-question-topic-page.ts` performs multiple counts and `findMany` for question rows. |
| flashcards | `public-flashcard-landing.ts` reads tags, decks, and cards; public marketing flashcard tags also read joins and decks. |
| NP/RN/RPN | pathway-specific hubs share lesson/question/flashcard inventory and programmatic study SEO loaders. |
| allied | `allied-pathway-hub-overview.ts` reads flashcard decks; allied pages probe exam questions. |
| localized routes | localized blog queries use `localizedBlogArticle.findMany/count`; localized layout/message payload is large. |

DB duration risk cannot be ranked precisely until Prisma query logging or request-scoped DB telemetry is enabled in production.

## CPU And Memory Findings

Exact per-request CPU time and memory allocation are not exposed in the current production data.

Build-time route tracing showed the shared marketing layout as the largest measured layout cost:

- `MarketingDefaultLocaleLayout`: max observed build/render trace duration 1,066 ms.
- Typical subsequent layout renders: ~10-25 ms.
- Observed memory deltas were generally small, but the large first render aligns with message/chrome warmup cost.

This supports treating shared marketing layout work as a cross-route multiplier rather than a single-route defect.

## 80/20 Load Drivers

The highest-leverage fixes are:

1. **Lesson detail payload reduction**: sampled HTML is 3.22 MB and the family had 1,469 504s.
2. **Localized payload reduction**: sampled `/fr` HTML is 3.21 MB.
3. **Blog crawl load management**: 5,801 URLs dominates crawler volume.
4. **Shared marketing layout/chrome minimization**: one layout affects homepage, public hubs, localized pages, questions, and pathway pages.
5. **Public ECG page payload/cache audit**: successful cache HIT pages still took ~3 seconds in the crawl.

## Recommended Next Instrumentation

To replace static estimates with exact data:

1. Add request-scoped Prisma query counters for public routes.
2. Log cumulative DB duration per request.
3. Add response payload-size logging before compression.
4. Add event-loop lag and RSS delta per request family.
5. Emit route family tags into production logs for `/`, blog, lessons, questions, flashcards, NP/RN/RPN/allied/localized routes.

Until this is deployed, query duration, CPU time, and memory allocation must be treated as inferred rather than directly measured.

