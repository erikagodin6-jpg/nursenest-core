# RN lesson fix batch 1 — impact summary

- **Audit generated:** 2026-04-15T03:08:59.909Z
- **Plan baseline:** 2026-04-15T02:56:25.921Z
- **Unique slugs in merged RN catalog patches:** 30
- **Plan rows whose slug is patched:** 12
- **Rows with improved overallScore (patched slugs):** 12
- **Average overallScore lift (among improved patched rows):** 72.1
- **Rows moving off structurally_incomplete (approx, patched rows):** 12
- **Rows reaching production_ready_en (patched rows):** 12
- **Of those, mainly blocked by localization overlay:** 12

## Quality gate

- Patched plan rows should show **production_ready_en** when English spine + educational + link thresholds pass.
- **no_educational_overlay_in_scanned_locales** may remain without failing EN spine.

## Next

- Continue **RN-only** patches for remaining slugs in `rn-lesson-fix-batch-1-plan.json` not yet in the merged patch map.
- See `rn-lesson-finishing-roadmap.md` for batch sequencing.
