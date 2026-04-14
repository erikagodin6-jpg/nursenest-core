# Lesson system inventory

Generated: 2026-04-14T13:52:25.407Z
Database URL configured: true

## Summary by tier group

| Tier | Lessons (merged) | Marketing render | Gate failed | Thin body (<200 chars, render) | Broken related refs | Dup slug buckets (raw catalog) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Allied (exam hub) | 76 | 0 | 76 | 0 | 0 | 0 |
| Canada PN / REx-PN | 1092 | 248 | 844 | 0 | 0 | 0 |
| Canada RN | 793 | 91 | 702 | 0 | 0 | 0 |
| NP | 9129 | 1139 | 7990 | 0 | 78 | 0 |
| Other / mixed | 234 | 0 | 234 | 0 | 0 | 0 |
| US PN (NCLEX-PN) | 1103 | 244 | 859 | 0 | 0 | 0 |
| US RN | 1077 | 77 | 1000 | 0 | 0 | 0 |

## Allied profession slices (merged DB + catalog, then topic filter)

| Profession | Pathway | Bundled-only (JSON+gold) | Merged filtered | Would render | Gate failed |
| --- | --- | ---: | ---: | ---: | ---: |
| pta | us-allied-core | 15 | 38 | 0 | 38 |
| ota | us-allied-core | 15 | 38 | 0 | 38 |
| mlt | us-allied-core | 15 | 38 | 0 | 38 |
| imaging | us-allied-core | 15 | 38 | 0 | 38 |
| respiratory | us-allied-core | 15 | 38 | 0 | 38 |
| paramedic | us-allied-core | 15 | 38 | 0 | 38 |
| pharmacy-tech | us-allied-core | 15 | 38 | 0 | 38 |
| social-work | us-allied-core | 15 | 38 | 0 | 38 |

## Machine-readable output

- `reports/lesson-system-inventory.json`

### Verification scope

- This run is **static**: catalog JSON + Prisma (if configured). It does **not** start Next.js or open a browser.
