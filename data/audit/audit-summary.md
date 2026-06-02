# NurseNest legacy vs current audit summary

**Generated:** 2026-04-14T14:22:28.207Z

## Critical limitation

- **External old-site path not scanned:** `/Volumes/Backup Plus/NurseNest` is **not available** in the environment where this audit was generated.
- **Legacy proxy used:** `client/`, `server/`, `tools/`, `backup-system/`, `config/`, `script/`, plus repo-root `*.ts` / `*.txt` audit helpers — consistent with `docs/legacy-restoration-map.md`.

## Counts (best-effort)

| Metric | Value |
|--------|------:|
| Total legacy-proxy files inventoried | 2951 |
| Total current-app (`nursenest-core/`) files inventoried | 2996 |
| Legacy content-bearing (heuristic) | 715 |
| Current content-bearing (heuristic) | 376 |
| Legacy lesson index keys (prior audit) | 4223 |
| Lesson map create_missing (prior audit) | 4220 |
| High-value gap rows (this pass) | 1 (approx; see JSON) |
| Partial migration signals | 3+ |
| Unsafe direct migration entries | 4 |

### Category heuristics (automated)

- **Lessons (proxy):** 450 legacy / 53 current files tagged `lessons`
- **Question bank:** 193 / 59
- **Blog/SEO:** 7 / 191
- **Tools:** 2 / 15
- **Translations:** 95 / 173
- **Allied:** 178 / 51
- **New grad:** 25 / 15
- **CAT/adaptive:** 13 / 134
- **Scripts/importers:** 65 / 95

## Strongest recommendations

1. **Mount or copy** the full external NurseNest export into the repo (or symlink) and **re-run** inventory diff — this report is necessarily incomplete without it.
2. Treat **legacy-to-current-lesson-map.json** `create_missing` backlog as the master **content** gap list for RN/PN/NP/allied.
3. For **CAT**, port **UX patterns** (checkpoint/recovery) only; keep **current cat-engine + APIs** as truth.
4. Keep **one i18n pipeline**; never copy alternate client loaders.
5. Use existing **data/audit/*.json** (flashcards, duplicates, CAT) as working inputs — do not duplicate audit logic ad hoc.

## Artifacts written

- `legacy-full-file-inventory.json`
- `current-full-file-inventory.json`
- `legacy-vs-current-gap-analysis.json`
- `migration-opportunities-by-category.json`
- `high-value-missing-content.json`
- `unsafe-or-not-recommended-direct-migrations.json`
- `audit-summary.md` (this file)
- `proposed-implementation-backlog.json`
- `_generate-full-audit-artifacts.mjs` (regenerator; audit-only)

