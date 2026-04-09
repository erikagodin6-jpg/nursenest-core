# RN NCLEX-RN lesson library (canonical inventory)

## Source of truth in this repo

There is **no single binary PDF** checked into the monorepo. Editorial sources are combined as follows:

1. **`data/premium-lessons-nclex-core-v1/`** — Premium NCLEX-core curriculum drafts (`PREMIUM_CURRICULUM_LESSONS_V1_PART_*.md`) plus `manifest.json`, which maps high-yield topics to on-site slugs (catalog + scoped gold).
2. **`src/content/pathway-lessons/nclex-rn-source-checklist.json`** — Machine-readable completeness targets; reconciled against the canonical map.
3. **`scripts/generate-rn-nclex-master-map.mjs`** — Builds **`src/content/pathway-lessons/rn-nclex-master-map.json`**: deduplicated titles, tiers, primary/secondary categories, slugs, and word bands.

When you add an official NCSBN outline or an uploaded outline PDF, extend the checklist and the `CATEGORIES` object in the generator, then regenerate the map and run `node scripts/audit-rn-nclex-map.mjs`.

## Canonical inventory

- **Artifact:** `src/content/pathway-lessons/rn-nclex-master-map.json`
- **Report:** `node scripts/rn-nclex-inventory-report.mjs`

Major **primary** category ids include: `cardiovascular`, `respiratory`, `gastrointestinal`, `neurological`, `renal_genitourinary`, `endocrine_metabolic_fluids`, `hematology_oncology_immunology`, `musculoskeletal`, `integumentary_immune_autoimmune`, `infectious_disease`, `emergency_critical_perioperative`, `pharmacology_master`, `maternity_newborn`, `pediatrics`, `mental_health`, `nclex_nursing_priorities_safety`.

## Lesson bodies (authoring contract)

- **Spine:** exam-complete premium sections (`src/lib/lessons/exam-complete-lesson-template.ts`, `pathway-lesson-premium.ts`).
- **Depth:** `src/lib/content-blueprint/rn-nclex-content-depth-rules.ts` (tier word bands; no thin stubs).

Do **not** bulk-append empty `sections` rows to `catalog.json` for production: the loader and quality gates expect real prose meeting minimums. Import in **batches** with full bodies (or use `scripts/import-rn-lesson-map-category.ts` / `rn-nclex-catalog-import-category.mjs` only when following your team’s policy for metadata-only rows).

## Scripts

| Script | Purpose |
|--------|---------|
| `node scripts/generate-rn-nclex-master-map.mjs` | Regenerate master map JSON from `CATEGORIES` |
| `node scripts/audit-rn-nclex-map.mjs` | Fail if checklist titles are missing from map |
| `node scripts/rn-nclex-inventory-report.mjs` | Print counts by primary category + tier |
| `node scripts/rn-nclex-catalog-import-category.mjs --category <id> [--dry-run]` | Idempotent catalog row append (metadata; see script header) |
