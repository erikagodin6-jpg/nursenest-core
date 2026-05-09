# Long-tail patho / pharm topic inventory (300 planned topics)

**Status:** Planning artifact only — **no claim these posts exist in the database.**

- **Machine-readable table:** \`longtail-patho-pharm-topic-inventory.csv\` (same directory) — UTF-8 CSV with header row.
- **Slug validation:** Generated programmatically; **300 data rows**, **300 unique \`slug\`** values (verified at generation time).

## Columns

| Column | Description |
|--------|-------------|
| title | Long-tail exam-style title (Why/How/What/NCLEX/Difference…) |
| slug | Unique kebab-case slug candidate for \`BlogPost.slug\` |
| primary_keyword | Seed keyword phrase |
| search_intent | informational \| exam-prep \| clinical-prioritization |
| country | Global (all rows this pass) |
| tier | RN \| PN \| NP |
| category_cluster | Topic cluster id |
| suggested_internal_links | Pipe-separated route patterns; \`LESSON_SLUG_TBD needs_mapping\` where lesson slug must be resolved from the lesson index |

## CSV

See \`reports/longtail-patho-pharm-topic-inventory.csv\` (301 lines = header + 300 rows).
