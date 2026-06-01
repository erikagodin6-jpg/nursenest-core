# Content Pipeline Readiness
Generated: 2026-06-01

## Data Source Note
Database unavailable (placeholder `DATABASE_URL`). All analysis based on static file corpus:
- `src/content/blog-static-posts.ts` — 3 posts (en)
- `src/content/blog-static-longtail/` — 4,595 posts (en + 8 other locales)

No posts in the static corpus have a future publish date. The DB-backed scheduling system (cron routes at `/api/cron/blog-publish`, `/api/cron/blog-batch-schedule`, `/api/cron/blog-article-generation-jobs`) is the intended live pipeline; its queue state is not accessible without DB connectivity.

---

## Current Inventory
| Locale | Static TS | Longtail | Total Available | Status |
|--------|-----------|----------|-----------------|--------|
| en | 3 | 3,395 | 3,398 | All published |
| pt | 0 | 150 | 150 | All published |
| es | 0 | 150 | 150 | All published |
| ar | 0 | 150 | 150 | All published |
| tl/fil | 0 | 150 | 150 | All published |
| zh-Hans | 0 | 150 | 150 | All published |
| fr | 0 | 150 | 150 | All published |
| hi | 0 | 150 | 150 | All published |
| ja | 0 | 150 | 150 | All published |
| **Total** | **3** | **4,595** | **4,598** | — |

---

## English Content Breakdown by Pathway
| Pathway | Count | Notes |
|---------|-------|-------|
| NCLEX-RN / RN | 785 | Matches on `nclex`, `rn`, `new-grad` patterns in slug/title/category |
| REx-PN / CPNRE / RPN | 689 | Matches on `rpn`, `rex-pn`, `cpnre`, `canadian-pn` patterns |
| Nurse Practitioner (NP) | 747 | Matches on `np-cert`, `fnp`, `agpcnp`, `pmhnp` patterns |
| Other EN (RT, EMS, MLT, OT, Allied, Intl) | 1,177 | Respiratory Therapy, EMS, Medical Lab, OT, etc. |
| **Total EN** | **3,398** | |

---

## Runway Projections

### English (en)
| Pathway | Total Posts | 1/day | 3/day | 5/day | 10/day |
|---------|-------------|-------|-------|-------|--------|
| RN | 785 | 785 days | 261 days | 157 days | 78 days |
| RPN | 689 | 689 days | 229 days | 137 days | 68 days |
| NP | 747 | 747 days | 249 days | 149 days | 74 days |
| All EN combined | 3,398 | 3,398 days | 1,132 days | 679 days | 339 days |

### Non-English Locales (150 posts each)
| Locale | Total Posts | 1/day | 3/day | 5/day | 10/day |
|--------|-------------|-------|-------|-------|--------|
| fr | 150 | 150 days | 50 days | 30 days | 15 days |
| es | 150 | 150 days | 50 days | 30 days | 15 days |
| pt | 150 | 150 days | 50 days | 30 days | 15 days |
| ar | 150 | 150 days | 50 days | 30 days | 15 days |
| ja | 150 | 150 days | 50 days | 30 days | 15 days |
| zh-Hans | 150 | 150 days | 50 days | 30 days | 15 days |
| hi | 150 | 150 days | 50 days | 30 days | 15 days |
| tl/fil | 150 | 150 days | 50 days | 30 days | 15 days |

---

## Content Exhaustion Dates (from 2026-06-01)

These dates assume continuous staggered publishing starting today from the static corpus inventory.

### English
| Pathway | 1/day exhaustion | 3/day exhaustion | 5/day exhaustion |
|---------|-----------------|-----------------|-----------------|
| RN | ~2028-08-24 | ~2027-03-19 | ~2026-10-05 |
| RPN | ~2028-04-20 | ~2027-01-15 | ~2026-09-25 |
| NP | ~2028-07-17 | ~2027-03-07 | ~2026-10-26 |
| All EN | ~2035-09-21 | ~2029-07-03 | ~2028-02-08 |

### Non-English (150 posts per locale)
| Publish Rate | Exhaustion Date |
|-------------|-----------------|
| 1/day | ~2026-10-29 (150 days from 2026-06-01) |
| 3/day | ~2026-08-20 (50 days from 2026-06-01) |
| 5/day | ~2026-07-01 (30 days from 2026-06-01) |

**Non-English runway is critically short at 3+ posts/day.** With 150 posts per locale and a 3/day target, each non-English locale exhausts in approximately 50 days (by ~2026-08-20).

---

## Content Quality Concerns Affecting Pipeline

| Issue | Count | Impact |
|-------|-------|--------|
| Pipeline pointer stubs (incomplete body) | 50 | These 50 posts need body completion before they are useful content |
| Thin content (<300 words, non-stubs) | 288 | 288 posts may generate thin-content penalties; many are ja/zh-Hans intl posts at ~224 words |
| Zero internal links | 70 | These posts lack any href links and will not contribute to internal link graph |
| No cover image (all longtail) | 4,595 | No visual assets available for OG/social cards in the static corpus |

---

## Missing Topic Clusters
Topic categories with fewer than 3 posts in English (61 clusters):

| Category | EN Posts |
|----------|---------|
| Australian RN Practice | 1 |
| Australian RN Registration | 1 |
| Cardiovascular Disorders | 1 |
| Communication and Safety | 1 |
| Community health | 1 |
| Community nursing | 1 |
| Critical Care | 1 |
| Critical Care and Acute Medicine | 1 |
| Critical care orientation | 1 |
| Delegation | 1 |
| Diagnostics | 1 |
| Documentation | 1 |
| ECG | 1 |
| Education | 1 |
| Emergency nursing | 1 |
| Ethics | 1 |
| Fluids & Electrolytes | 1 |
| Health Systems | 1 |
| Hepatic Nursing | 1 |
| Informatics | 1 |
| Leadership & Ethics | 1 |
| NCLEX-RN | 1 |
| Neonatal Nursing | 1 |
| Nutrition | 1 |
| Oncology nursing | 1 |
| Palliative care | 1 |
| Pediatric nursing | 1 |
| Population Health | 1 |
| Prioritization | 1 |
| Professional Development | 1 |
| Public Health | 1 |
| Renal and Urinary | 1 |
| Research and Education | 1 |
| Respiratory Disorders | 1 |
| Rural Health | 1 |
| Shift organization | 1 |
| Wellness | 1 |
| Wound care | 1 |
| Acid-Base Balance | 2 |
| Clinical judgment | 2 |
| Community Health Nursing | 2 |
| Cultural Safety | 2 |
| Emergency Care | 2 |
| Emergency Nursing | 2 |
| Gastrointestinal Nursing | 2 |
| Gerontologic Nursing | 2 |
| Hematologic Nursing | 2 |
| Infection Control | 2 |
| Licensing Exam Prep | 2 |
| Maternal newborn | 2 |
| NCLEX exam prep | 2 |
| NCLEX-RN Strategy | 2 |
| Neurologic Nursing | 2 |
| Obstetric Nursing | 2 |
| Paramedic | 2 |
| Perioperative | 2 |
| Perioperative Nursing | 2 |
| Professional development | 2 |
| Psychiatric Nursing | 2 |
| Renal Nursing | 2 |
| Transition to practice | 2 |

**Priority expansion targets** (highest clinical exam relevance and <3 posts):
- Wound care (1 post) — High clinical relevance for NCLEX
- Neonatal Nursing (1 post) — Maternal-newborn is a major NCLEX category
- Oncology nursing (1 post) — Common NCLEX med-surg theme
- Palliative care (1 post) — Critical for NP certification
- Perioperative / Perioperative Nursing (2+2 posts, fragmented) — Should consolidate

---

## Pipeline Architecture Notes

The codebase has a full DB-backed generation pipeline:
- `src/app/api/cron/blog-article-generation-jobs/route.ts` — AI generation cron
- `src/app/api/cron/blog-publish/route.ts` — Scheduled publish cron
- `src/app/api/cron/blog-batch-schedule/route.ts` — Batch scheduling cron
- `src/lib/blog/admin-blog-generation-service.ts` — Generation service
- `src/lib/blog/blog-batch-schedule.ts` — Batch scheduling

The static corpus serves as fallback when DB is unavailable. For production content cadence, the DB pipeline must be operational with a valid `DATABASE_URL`.
