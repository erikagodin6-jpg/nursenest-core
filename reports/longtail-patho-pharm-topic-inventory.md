# Long-tail pathophysiology / pharmacology — topic inventory (planning)

**Status:** Planning only — **no assertion that any row exists in production `BlogPost`.**

## Machine-readable table

**Canonical file:** `longtail-patho-pharm-topic-inventory.csv` (this directory) — **301 lines** = header + **300** data rows.

### Columns

| Column | Description |
|--------|-------------|
| `title` | Long-tail exam-oriented title (Why / How / NCLEX / Difference …). |
| `slug` | Unique kebab-case candidate for `BlogPost.slug`. |
| `primary_keyword` | Seed phrase. |
| `search_intent` | `informational` \| `exam-prep` \| `clinical-prioritization`. |
| `country` | `Global` for all rows (this pass). |
| `tier` | `RN` \| `PN` \| `NP`. |
| `category_cluster` | Editorial cluster id (patho vs pharm vs mixed). |
| `suggested_internal_links` | Pipe-separated marketing patterns; includes `LESSON_SLUG_TBD needs_mapping` until lesson registry mapping. PN/NP rows use `/nursing/pn/blog` or `/nursing/np/blog` per hub code. |

### Slug uniqueness

Validated when CSV was generated (300 unique `slug` values).

### Full table

Open `longtail-patho-pharm-topic-inventory.csv` in a spreadsheet or CI parser — embedding 300 rows inline in Markdown is redundant with this CSV.

**Policy:** **~300 posts require editorial/clinical QA** before production publish; **no broken curated internal links** — verify against lesson index / staging crawl.
