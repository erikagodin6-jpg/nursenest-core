# Blog Scheduling Audit
Generated: 2026-06-01

## Data Source Note
Database unavailable (placeholder credentials). All analysis is from static file corpus only. No posts in the static corpus have a future `publishedAt` date relative to 2026-06-01. All 4,598 static posts are considered live/published.

---

## Summary
| Metric | Count |
|--------|-------|
| Total Posts in Static Corpus | 4,598 |
| Posts with `publishedAt` field | 4,595 (longtail) |
| Posts without `publishedAt` (static TS, uses `createdAt`) | 3 |
| Future-scheduled posts | 0 |
| Posts with missed publish dates (past publishedAt, not "PUBLISHED" in DB) | N/A — DB unavailable |
| Schedule collisions (same day, same locale) | Yes — mass batch dates (see below) |
| Days with zero posts | All days except the 7 batch dates listed below |

---

## Publish Date Distribution
| PublishedAt | Total Posts | EN | Non-EN |
|-------------|-------------|-----|--------|
| 2025-09-15 | 1 | 1 | 0 |
| 2025-10-28 | 1 | 1 | 0 |
| 2025-11-12 | 1 | 1 | 0 |
| 2026-03-10 | 1 | 1 | 0 |
| 2026-03-11 | 1 | 1 | 0 |
| 2026-03-12 | 1 | 1 | 0 |
| 2026-05-09 | 3,825 | 2,625 | 1,200 |
| 2026-05-10 | 60 | 60 | 0 |
| 2026-05-14 | 12 | 12 | 0 |
| 2026-05-27 | 695 | 695 | 0 |

---

## Scheduling Calendar (Next 30 Days from 2026-06-01)
All static corpus posts have `publishedAt` in the past. There are **no posts scheduled for publication between 2026-06-01 and 2026-06-30** in the static corpus. Every day in the next 30-day window is a gap.

The gap analysis only applies to the static corpus. The live DB (unavailable) may contain scheduled posts via `postStatus = SCHEDULED` with future `publishAt` dates.

---

## 3 Posts/Day Target Gap Analysis
The target of 3 posts/day per pathway × locale is evaluated against the available static corpus inventory.

| Target Pathway | Target Locale | Available Posts | Days Runway @ 3/day | Days Runway @ 1/day |
|---------------|--------------|-----------------|---------------------|---------------------|
| RN | en | 785 | 261 | 785 |
| RPN | en | 689 | 229 | 689 |
| NP | en | 747 | 249 | 747 |
| RN | fr | 150 (combined intl) | 50 | 150 |
| RN | es | 150 (combined intl) | 50 | 150 |

Note: Non-EN pathways are not broken down by RN/RPN/NP since the multilingual longtail posts cover all nursing topics without pathway segmentation.

**Gap:** All pathway×locale combinations show >0 runway from the existing static corpus. However, the mass publication of 3,825 posts on a single date (2026-05-09) represents a scheduling anomaly — posts were not staggered over time, creating a massive single-day "collision" followed by long dead periods.

---

## Collision Days (Multiple Posts on Same Date)
The following dates have far more than 3 posts published simultaneously, indicating batch import rather than continuous cadence publishing:

| Date | Posts | Severity |
|------|-------|----------|
| 2026-05-09 | 3,825 | CRITICAL — mass batch import |
| 2026-05-27 | 695 | HIGH — bulk batch |
| 2026-05-10 | 60 | MEDIUM — batch |
| 2026-05-14 | 12 | LOW — batch |

**All posts on 2026-05-09 were published simultaneously.** This is not continuous publishing — it is a point-in-time corpus dump. Search engines may treat this as a low-quality site with artificial inflation.

---

## Missed Publish Dates
**Not determinable from static corpus.** A "missed" publish date occurs when `postStatus = SCHEDULED` and `publishAt < now()` in the DB but the cron job failed to set the status to PUBLISHED. Since the DB is unavailable, missed dates cannot be audited.

From static corpus: all posts have `publishedAt` in the past (no future-dated posts), so there are no "missed" static corpus posts.

---

## Posts By Locale
| Locale | Count | Publish Dates |
|--------|-------|---------------|
| en | 3,398 | 2025-09-15 to 2026-05-27 (sparse, then 3 bulk batches) |
| pt | 150 | 2026-05-09 (all on one day) |
| es | 150 | 2026-05-09 (all on one day) |
| ar | 150 | 2026-05-09 (all on one day) |
| tl/fil | 150 | 2026-05-09 (all on one day) |
| zh-Hans | 150 | 2026-05-09 (all on one day) |
| fr | 150 | 2026-05-09 (all on one day) |
| hi | 150 | 2026-05-09 (all on one day) |
| ja | 150 | 2026-05-09 (all on one day) |

All non-English locales were bulk-published on 2026-05-09 with no temporal distribution.

---

## Recommendations
1. **Implement publish staggering**: Redistribute the 3,825 posts from 2026-05-09 across future dates at 10–30 posts/day to create a believable editorial cadence.
2. **Fill the 2026-06-01 gap**: No new posts are scheduled for the next 30 days. Feed the DB-backed scheduling system with queued posts.
3. **Pathway cadence**: Establish separate publish queues for RN, RPN, and NP pathways rather than combined batch imports.
4. **3/day target**: Currently unmet for any pathway×locale combination in a continuous cadence sense. The inventory exists but it was dropped in bulk, not scheduled.
