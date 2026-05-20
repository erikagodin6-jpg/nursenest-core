# RN lesson finishing roadmap

- **Audit:** 2026-04-15T03:08:59.909Z
- **RN routable lesson rows:** 415
- **English spine production_ready_en:** 59
- **Not yet production_ready_en:** 356
- **Production EN but localization backlog:** 59

## Recommended batch order

1. **us-rn-nclex-rn** — flagship US NCLEX-RN volume and lowest average scores in rollup.
2. **ca-rn-nclex-rn** — parallel Canada hub; share slugs with US where catalog is unified.
3. **us-rn-new-grad-transition** — transition topics after core licensure spine is strong.

## Batches remaining (plan size 100)

- **~4** batches at **100** RN rows each to cover current **notProductionReadyEn** rows (estimate; dedupe by shared slugs reduces authoring surface).

## Top recurring RN content issues (from non–production_ready_en rows)

- **673×** missing_educational
- **344×** no_educational_overlay_in_scanned_locales
- **211×** not_in_exam_filtered_hub_list
- **193×** links
- **172×** isolated_no_internal_links_or_related_refs
- **105×** thin_total_word_count
- **104×** low_total_word_count
- **102×** Missing required premium section
- **51×** Section "country_specific_notes" is missing
- **51×** Related / internal study flow
- **49×** Metadata
- **35×** Clinical scenario section must include a structured patient vignette (patient/cl

## Pathway rollup snapshot

- **ca-rn-nclex-rn:** 188 lessons, **productionReadyEn 29** (rollup field)
- **us-rn-nclex-rn:** 187 lessons, **productionReadyEn 30** (rollup field)
- **us-rn-new-grad-transition:** 40 lessons, **productionReadyEn 0** (rollup field)

## Workflow

1. `npx tsx scripts/audit/build-rn-lesson-fix-batch-1-plan.mts` (refresh RN plan).
2. Expand `rn-batch1-catalog-patches.ts` (or rn-batch-N) with real bodies; merge includes batch-2 shared slugs.
3. `npx tsx scripts/audit/apply-rn-lesson-batch1-catalog-patches.mts`
4. `npx tsx scripts/audit/run-lesson-completeness-audit.mts`
5. `npx tsx scripts/audit/run-rn-lesson-fix-batch-1-impact-report.mts`

Do not hide RN lessons to improve metrics; keep thresholds unchanged.
