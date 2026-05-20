# Lesson completion factory (batch 2+)

Repeatable workflow to finish incomplete **bundled catalog** lessons without lowering audit thresholds or hiding thin pages.

## 1. Select a batch

1. Ensure `data/audit/lesson-completeness-priority-queue.json` is current (from `npx tsx scripts/audit/run-lesson-completeness-audit.mts`).
2. Run `npx tsx scripts/audit/build-lesson-fix-batch-2-plan.mts` (or copy the script to `build-lesson-fix-batch-N-plan.mts` and point `OUT` to `lesson-fix-batch-N-plan.json`).
3. Selection rules in the script: nursing pathways first, `structurally_incomplete` before score, then ascending `overallScore`, cap 100 rows.

## 2. Author real content

- **Legacy catalog shape** (`intro` / `core` / `clinical_application` / `exam_tips`): content is normalized to five blocks (`clinical_meaning`, `exam_relevance`, `core_concept`, `clinical_scenario`, `takeaways`). `exam_tips` is split into **exam_relevance** (first two sentences) and **takeaways** (remaining sentences)—author enough sentences so **takeaways** meets educational buckets after merge.
- **Explicit five-block** (`clinical_meaning` … `takeaways`): expand each section to subscriber floors and educational targets; **takeaways** must be ≥ ~80 words for the summary bucket.
- **Internal study flow**: target **3–8** `[label](LESSON:slug)` links in the corpus; avoid exceeding 8 (link score warning).
- **No** placeholder language, “coming soon,” or generic filler; every paragraph should teach exam-relevant nursing judgment.

**Patch workflow (batch 2):**

- Add entries to `nursenest-core/scripts/audit/batch2-catalog-patches.ts`.
- Run `npx tsx scripts/audit/apply-lesson-batch2-catalog-patches.mts` to merge into `src/content/pathway-lessons/catalog.json`.

## 3. Verify

```bash
cd nursenest-core
npx tsx scripts/audit/run-lesson-completeness-audit.mts
npx tsx scripts/audit/run-lesson-batch2-impact-report.mts   # adjust script name for batch N
```

Check for each slug:

- `publicComplete: true`, `contentReadinessStatus: production_ready_en` when that is the goal.
- Educational buckets satisfied (`evidence.educationalBucketsMissing` empty).
- `totalWords` typically ≥ ~550 to avoid thin structural penalties (see `scoreStructuralFromGate`).

## 4. What counts as “finished”

- **English spine:** `production_ready_en` — strong structural + educational + link scores, subscriber gate passes, **not** blocked by placeholder signals.
- **Full product “production_ready” (combined status)** may still show `localization_incomplete` until educational overlays exist in multiple locales—**do not** treat missing i18n overlay as “unfinished English” if `contentReadinessStatus` is already `production_ready_en`.

## 5. What never counts as complete

- Raising scores by weakening thresholds or deleting lessons from the catalog.
- Padding with lorem ipsum, “content expansion” placeholders, or repetitive non-clinical prose.
- **RelatedLessonRefs** alone without real body depth (metadata is secondary to the teaching corpus).

## 6. Ongoing batches

- Keep **one patch module per batch** (`batch3-catalog-patches.ts`, …) or merge into a single module with batch tags.
- Re-run the audit after every merge; update `lesson-fix-batch-N-impact.json` and `*-summary.md` for traceability.
