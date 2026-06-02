# Flashcard Rationale Quality Audit

Generated: 2026-05-30

## Scope

Audited the learner flashcard rationale path and the controlled rationale enrichment helpers that can provide fallback rationale, hint-adjacent, clinical pearl, takeaway, and distractor text.

## Rationale Templates Found

| Area | File | Finding | Status |
| --- | --- | --- | --- |
| Correct-answer fallback builder | `src/lib/questions/rationale-quality.ts` | Emitted `{answer} is correct because ... concept being tested ... match the answer choice ... generic priority framework`. | Replaced with educator-style fallback that references the key cue, physiology/safety logic, and nursing principle. |
| Distractor fallback builder | `src/lib/questions/rationale-quality.ts` | Emitted generic "does not explain the specific concept being tested" copy and echoed answer text. | Replaced with specific distractor framing that explains why the option points to a different mechanism, lower-priority cue, or unsafe first action. |
| Generic rationale detector | `src/lib/questions/rationale-quality.ts` | Did not block the exact production placeholder phrases. | Expanded prohibited-pattern detection for template phrases, placeholder availability text, and repetitive answer parroting. |
| Controlled enrichment fallback | `src/lib/content-quality/controlled-rationale-enrichment.ts` | Returned visible placeholder text when source-backed content was unavailable. | Replaced with empty output for unavailable source-backed sections so placeholder content is not shown as learner-facing education. |
| Rationale display fallback | `src/lib/content-quality/rationale-display.ts` | Returned "Clinical reasoning is not yet on file..." when no source fields existed. | Replaced with empty output. |
| Teaching payload fallback | `src/lib/content-quality/teaching-payload.ts` | Returned "Clinical reasoning is not yet on file..." when no source fields existed. | Replaced with empty output. |
| Flashcard reveal labels | `src/components/flashcards/flashcard-study-reveal-panels.tsx` and flashcard CSS | Forced Title Case labels into all caps through Tailwind/CSS. | Removed forced uppercase for flashcard rationale, pearl, takeaway, heading, and mobile rationale labels. |

## Prohibited Phrases Added To Governance

- `is correct because`
- `concept being tested`
- `connect it directly`
- `match the answer choice`
- `generic priority framework`
- `clinical reasoning is not yet on file`
- `detailed distractor explanations are not available`
- `concise clinical pearl is not available`

## Normalization Rules Added

- Collapse duplicate sentences.
- Reject duplicate sentence rationale content.
- Reject excessive answer-text repetition.
- Reject placeholder/template phrases.
- Reject correct-answer rationale content below 40 words in the governance helper.

## Remaining Notes

This pass hardens generated and fallback rationale text. Existing authored database content can still contain low-quality phrasing until a full content-library audit or remediation migration is run against production data.
