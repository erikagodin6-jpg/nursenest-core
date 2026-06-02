# Route Cost Analysis

Generated: 2026-06-01

## Verdict

**Single-origin saturation, not one isolated route**

The 100 URL crawl at concurrency 12 pushed many unrelated public routes to the 20 second timeout ceiling. This indicates shared origin pressure from route rendering, layout/session work, and database-dependent content loaders.

## Method

Source:

```text
reports/origin-capacity-test/batch-100.json
reports/origin-capacity-test/summary.json
DigitalOcean run logs for active deployment 2a9127f6-689b-441a-8cc1-855fdea70b92
```

## Crawl Summary

| Metric | Value |
|---|---:|
| URLs audited | 100 |
| Concurrency | 12 |
| HTTP 200 | 87 |
| Fetch errors | 13 |
| p50 | 20001ms |
| p95 | 20003ms |
| max | 20010ms |
| health before | 200 |
| health after | timeout / later 504 |

## Top 25 Slowest Sampled URLs

| Rank | URL | Status | Time |
|---:|---|---:|---:|
| 1 | `/terms` | 200 | 20010ms |
| 2 | `/refund-policy` | 200 | 20010ms |
| 3 | `/blog/acute-abdominal-pain-workup-np-certification` | 200 | 20008ms |
| 4 | `/pricing` | 200 | 20007ms |
| 5 | `/about` | timeout | 20004ms |
| 6 | `/pre-nursing/lessons` | 200 | 20003ms |
| 7 | `/blog/airway-adjuncts-ems-post-intubation-confirmation-and-etco2-ems` | 200 | 20003ms |
| 8 | `/blog/anaphylaxis-prehospital-airway-edema-biphasic-return-precautions-ems` | 200 | 20003ms |
| 9 | `/blog/acute-care-ot-discharge-planning-basics` | 200 | 20002ms |
| 10 | `/blog/acute-kidney-injury-fluid-electrolyte-nursing-review-australia` | 200 | 20002ms |
| 11 | `/blog/acute-kidney-injury-prerenal-intrinsic-postrenal` | 200 | 20002ms |
| 12 | `/blog/acute-stroke-management-np-certification` | 200 | 20002ms |
| 13 | `/blog/adapting-to-nursing-work-australia-for-international-nurse-graduates` | 200 | 20002ms |
| 14 | `/blog/adaptive-equipment-adls-ot` | 200 | 20002ms |
| 15 | `/blog/adhd-management-review-np-certification` | 200 | 20002ms |
| 16 | `/blog/adls-vs-iadls-ot-student-guide` | 200 | 20002ms |
| 17 | `/blog/ahpra-nurse-registration-pathway-international-educational-overview` | 200 | 20002ms |
| 18 | `/blog/airway-adjuncts-ems-difficult-airway-communication-and-plan-b-ems` | 200 | 20002ms |
| 19 | `/blog/airway-adjuncts-ems-suction-bvm-and-two-person-ventilation-ems` | 200 | 20002ms |
| 20 | `/blog/airway-adjuncts-ems-supraglottic-airway-selection-basics-ems` | 200 | 20002ms |
| 21 | `/blog/altitude-illness-hape-hace-prehospital-recognition-ems` | 200 | 20002ms |
| 22 | `/blog/anaphylaxis-prehospital-epinephrine-im-first-line-and-repeat-dosing-ems` | 200 | 20002ms |
| 23 | `/blog/anaphylaxis-prehospital-h1-h2-blockers-steroids-as-adjuncts-ems` | 200 | 20002ms |
| 24 | `/blog/anaphylaxis-prehospital-protocol-epinephrine-ems` | timeout | 20002ms |
| 25 | `/blog/anion-gap-metabolic-acidosis-laboratory-mlt` | timeout | 20002ms |

## Expensive Route Families

| Family | Evidence | Likely Cost Drivers |
|---|---|---|
| Blog article routes | repeated `blog_post.by_slug db_timeout` at 12000ms | DB lookup, fallback resolution, route rendering under pool pressure |
| Marketing shell routes | `marketing_layout` loads 8937 messages; `marketing_main` loads 8073 primary messages | shared layout/message payload cost on many public pages |
| Static legal/pricing/about pages | hit 20s despite simple page purpose | shared layout/session/global loaders rather than page-local body |
| Pre-nursing lessons | `/pre-nursing/lessons` reached 20s | lesson index/render plus shared shell |
| NP/question routes | `pathway_lessons`, `practice_questions_hub`, and exam hub timeouts | DB aggregates and question/lesson count lookups |
| ECG/module routes | `ecg_module module_status db_timeout` | module status DB dependency |

## DB / Runtime Signals

Observed during the 100 URL crawl:

```text
blog_post.by_slug db_timeout timeout_ms=12000
blog_posts_by_tag.hybrid_fetch db_timeout timeout_ms=12000
staff_session.auth timeout
pathway_lessons hub_list_db_unavailable_fail_closed
practice_questions_hub db_timeout timeout_ms=1200
ecg_module module_status db_timeout timeout_ms=650
perf high_memory heapUsedMb=711 rssMb=955
```

## Root Cause

The expensive route issue is amplified by infrastructure shape:

```text
basic-s
instance_count=1
database connection_limit=5
```

At concurrency 12, public route rendering saturates the single instance and DB pool. Once the event loop and database queue are saturated, even simple pages inherit the delay through shared layout/session work.

## Recommended Fix Order

1. Resolve DigitalOcean account lock / 403.
2. Scale to at least two web instances.
3. Deploy readiness/telemetry fixes.
4. Re-run 100/500/1000 capacity tests.
5. Use new `runtime_resource activeRequests` logs to identify exact request pressure.
6. Then optimize route families in this order:
   - blog article loader/cache
   - shared marketing layout message payload
   - staff-session/auth timeout path on public pages
   - NP/question hub aggregate queries
   - module status DB fallbacks

