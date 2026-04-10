# RN NCLEX-RN lesson library (canonical inventory)

## Source of truth in this repo

There is **no single binary PDF** checked into the monorepo. Editorial sources are combined as follows:

1. **`data/premium-lessons-nclex-core-v1/`** — Premium NCLEX-core curriculum drafts (`PREMIUM_CURRICULUM_LESSONS_V1_PART_*.md`) plus `manifest.json`, which maps high-yield topics to on-site slugs (catalog + scoped gold).
2. **`src/content/pathway-lessons/nclex-rn-source-checklist.json`** — Machine-readable completeness targets; reconciled against the canonical map.
3. **`scripts/generate-rn-nclex-master-map.mjs`** — Builds **`src/content/pathway-lessons/rn-nclex-master-map.json`**: deduplicated titles, tiers, primary/secondary categories, slugs, word bands, **lesson archetypes**, **staged build phases**, and **cross-list / overlap** metadata.

**Do not** start by generating every lesson body. First maintain the **map** from these sources (extend `CATEGORIES` + checklist when new outline material arrives), regenerate the JSON, then author or import **one staged phase at a time** (see below).

When you add an official NCSBN outline or an uploaded outline PDF, extend the checklist and the `CATEGORIES` object in the generator, then regenerate the map and run `node scripts/audit-rn-nclex-map.mjs`.

## Source-derived map (what the JSON contains)

From the combined NCLEX-aligned sources above, the generator produces:

1. **Master list** — `lessons[]`: one row per unique canonical title (`aggregates.uniqueLessonCount`).
2. **Grouping by category** — `primaryCategoryId` + `secondaryCategoryIds` for hub navigation; `buildOrder` lists primary categories in rollout order.
3. **Duplicates / overlaps** — Titles listed under multiple `CATEGORIES` buckets merge into **one** row; `mergeNote` + `PRIMARY_OWNER` record the editorial decision; `overlapsAndCrossLists.crossListedLessons` lists every title that still appears in secondary categories for coverage.
4. **Lesson kind (planning)** — `archetype` on each row: `medication_monograph` | `condition_disease` | `emergency_critical_care` | `nursing_priorities_safety` (definitions in `sourceMap.archetypeDefinitions`). Counts: `aggregates.byArchetype`.
5. **Recommended build order** — `stagedBuildPhases` (seven phases) matches the intended rollout: adult systems → emergency → pharmacology → maternity → pediatrics → mental health → NCLEX priorities / safety. **`buildOrder`** is the flat category sequence for tooling that expects a single array.

Authoring and catalog imports should follow **`stagedBuildPhases`** (or `node scripts/rn-nclex-catalog-import-category.mjs --category <id>` per category within a phase) so the app, hubs, and entitlements stay stable.

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
| `node scripts/rn-nclex-completeness-diff.mjs` | Manifest (24-topic premium core) ↔ master map keyword coverage |
| `node scripts/rn-nclex-catalog-import-category.mjs --category <id> [--dry-run]` | Idempotent catalog row append (metadata; see script header) |
| `node scripts/rn-nclex-explicit-inventory-audit.mjs` | Audit topic lines vs master map + US catalog (writes `docs/rn-nclex-explicit-inventory-audit-report.md`) |

## Explicit inventory audit (topic list vs map vs catalog)

Use this when reconciling a **long external outline** (or internal checklist) against the repo:

1. Add one topic per line to `src/content/pathway-lessons/rn-nclex-explicit-inventory-topics.txt` (optional `#` comments).
2. Add merge/synonym rows to `src/content/pathway-lessons/rn-nclex-explicit-inventory-aliases.json` so user phrasing maps to an existing **canonicalTitle** (avoid duplicate lessons).
3. Run `node scripts/rn-nclex-explicit-inventory-audit.mjs` and read `docs/rn-nclex-explicit-inventory-audit-report.md`.

Rows flagged **CATALOG_ROW_METADATA_ONLY_PENDING_FULL_BODY** mean the slug exists under `us-rn-nclex-rn` but **`sections` is still empty** — the lesson is planned/imported as metadata; full exam-complete authoring must follow `pathway-lesson-premium` + depth gates before claiming “strong / skip.”

## Completeness pass (inventory)

The **exam-complete premium spine** (`pathway-lesson-premium.ts`) already encodes diseases, symptoms, labs, interventions, complications, teaching, and red flags as section kinds — authors fill those blocks per lesson.

**Canonical inventory gaps** (vs `data/premium-lessons-nclex-core-v1/manifest.json` and curriculum markdown) are closed in the master map by:

- Merging **narrow** titles into **exam-sized** titles where appropriate (e.g. **Isolation Precautions: Contact, Droplet, and Airborne** replaces a standalone airborne-only row; **Dysrhythmias: Stable vs Unstable Management** replaces “malignant dysrhythmia red flags” only).
- Adding **non-duplicate** cross-cutting lessons: chronic **Diabetes Mellitus** management vs **DKA**; **Thyroid Storm and Myxedema Coma**; **AKI patterns**; adult **seizures/status** vs **febrile seizures**; **suicide risk** safety; **high-alert meds** and **multimodal pain**; **insulin / warfarin / beta-blockers / opioid analgesics** monographs.
- Renaming **Eclampsia** → **Preeclampsia and Eclampsia** (checklist alias keeps `Eclampsia` audit token); adding **Postpartum Hemorrhage** to maternity.

**Medication subsections in condition lessons:** the canonical map does not duplicate every drug mentioned in every condition — use **pharmacology_master** monographs and internal links in `related_next_steps` when authoring. New monographs above cover the highest-yield gaps (insulin, warfarin, beta-blockers, opioid reversal).

**Still manual:** authoring full prose for each map row into `catalog.json` (or DB) in batches — the map is the inventory; thin bulk inserts are disallowed.
