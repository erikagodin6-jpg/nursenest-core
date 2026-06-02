# ECG Module Readiness Audit

Generated: 2026-05-04

## Current Counts

Runtime counts are produced by `getEcgModuleReadiness()` from `src/lib/ecg-module/ecg-module-readiness.ts`.

Required gates:
- 300 total ECG questions
- 150 rhythm interpretation questions
- 50 deterministic strip/video questions
- 50 case-based questions
- 30 electrolyte/medication questions
- 20 advanced ECG questions
- 100 linked ECG flashcards
- 20 linked ECG lessons or lesson-linked questions
- 100% rationale coverage
- 100% deterministic media coverage for strip/live-feed questions
- 90%+ rhythm/topic/difficulty tagging
- 100% pathway/tier scoping
- 0 medical QA failures
- 0 high-risk strips missing manual review

## Generation Activity

`ensureEcgMinimumContent()` triggers bounded generation only for missing categories:
- max generation per invocation: 100 questions
- max loops per invocation: 5
- batch insert via `createMany`
- duplicate filtering before write using normalized stem, clinical concept, answer similarity, and rationale similarity

## Deduplication Stats

Deduplication is enforced in `src/lib/ecg-module/ecg-question-dedup.ts`.

Tracked rejection reasons:
- `normalized_stem`
- `concept_answers_rationale`

## Deterministic Media

ECG strip media is generated from:
- `src/lib/ecg-module/ecg-rhythm-templates.ts`
- `src/lib/ecg-module/ecg-waveform-generator.ts`
- `src/lib/ecg-module/ecg-strip-clinical-validation.ts`

Authoritative strip media must use `mediaType = "ecg_live_strip"` and deterministic `mediaConfig`. AI-generated image-only ECG strips are not publishable as source of truth.

## Missing Requirements

Run the admin dashboard at `/admin/modules/ecg` or call the publish API to get exact current failed gates. Publishing returns exact failure reasons with `code = "ecg_publish_blocked"`.
