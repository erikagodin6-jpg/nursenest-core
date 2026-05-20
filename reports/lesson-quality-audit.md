# Lesson quality audit — methodology and gates

Pathway and content-item lessons use **multiple layers**: structural completeness for marketing pathways, editorial word tiers for legacy JSON lessons, and **hard blocks** for obvious placeholder / AI-disclaimer language on publish.

## Surfaces

| Surface | Storage | Structural / depth signals |
| --- | --- | --- |
| Pathway (marketing) lessons | `PathwayLesson` (`sections` JSON) | `structuralPublicComplete`, `evaluatePathwayLessonStructuralGate` in `pathway-lesson-premium.ts`, catalog sync |
| Content-item lessons | Admin `body` → JSON via `bodyStringToContentJson` | `classifyContentItemLesson` (`LESSON_MIN_WORDS` = 500 in `content-quality/standards.ts`) |

## Weak-content definition (lesson-specific)

| Issue | Detection / mitigation |
| --- | --- |
| Stub sections / WIP phrasing | Placeholder guard on title + summary + body; pathway audits include JSON of `sections`. Pathway **publish** blocks `structuralPublicComplete === false` when transitioning to `PUBLISHED` (`pathway-lessons/[id]/route.ts`). |
| Thin body | `governContentItemLessonPublish` — thin/missing tiers require `acknowledgeBelowQualityBar` (except hard failures). |
| Weak rationales (exam items) | Separate track: `governExamQuestionPublish` / `RATIONALE_MIN_WORDS` — not pathway lesson body. |
| Duplicate copy-paste filler | `validateLessonForPublish` flags repeated long paragraph blocks when body is very long (`publish-validation.ts`). |
| Placeholder / AI disclaimer | **Hard block** in `validateLessonForPublish` and `governContentItemLessonPublish` (cannot be acknowledged away). |

## Code map

- `nursenest-core/src/lib/content/publish-validation.ts` — `validateLessonForPublish` (stricter summary floor, placeholders, duplicate paragraphs).
- `nursenest-core/src/lib/content/editorial-publish-policy.ts` — `governContentItemLessonPublish` (placeholder + disclaimer hard block before tier/override logic).
- `nursenest-core/src/lib/lessons/pathway-lesson-premium.ts` — structural gate for premium spine / legacy parity.
- `nursenest-core/src/lib/education/educational-content-placeholder-guard.ts` — shared patterns.

## Audits

- **Pathway + blog snapshot (DB):** `npm run content:audit-published-educational -- --limit=400` → `reports/educational-audit-snapshot-*.md`.
- **Marketing hub / completeness** (existing tooling): see `scripts/report-marketing-hub-review-required-lessons.mts`, `scripts/audit-lesson-completeness.runner.mts`, and `npm run test:pathway-lessons` for regression safety.

## Remediation

1. Fix placeholders and disclaimers first (fast, high trust impact).
2. Enrich thin sections while **keeping slug + locale + pathwayId** stable.
3. For pathway rows, ensure `structuralPublicComplete` becomes true via section bodies (not by bypassing gates).
