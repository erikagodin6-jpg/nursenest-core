# Flashcard Support Block Quality Audit

## Scope

Audited learner-facing support block generation for:

- Hints
- Clinical Pearls
- Memory Hooks
- Why This Matters
- NCLEX/REx-PN/CNPLE Takeaways

## Findings

### Active Study Session

`src/components/study/active-study-session.tsx`

- `buildClinicalPearl` previously derived the pearl from the first rationale sentence, explanation, or answer.
- The coach panel hint used a generic topic echo.
- `Why This Matters` reused the same pearl text, so the patient-outcome block was not distinct from the teaching pearl.

### Flashcard Question Stack

`src/components/flashcards/flashcard-study-question-stack.tsx`

- `rationaleKeyConcept` selected a sentence from the rationale, which could repeat weak or generated explanation text.
- `buildExamTipForMcq` used broad template language.
- `buildMemoryHookForMcq` sliced rationale sentences, which created long, non-memorable hooks and could echo answer wording.
- SATA reveal hints used a generic static instruction.

### Plain Flashcard Reveal Panels

`src/components/flashcards/flashcard-study-reveal-panels.tsx`

- `buildMemoryHook` derived hooks by copying the first rationale sentences.
- `buildExamTip` used generic test-taking templates.
- Authored pearls were displayed without support-block validation.

## Remediation

Added `src/lib/flashcards/flashcard-support-block-quality.ts`.

The module now provides:

- Topic-aware support block builders
- Word-count contracts by support-block type
- Placeholder phrase rejection
- Answer-text echo detection
- Hint-specific answer letter and answer-token guards
- Patient-outcome validation for Why This Matters
- Exam-strategy validation for NCLEX/REx-PN/CNPLE Takeaways

## Quality Rules

- Hints: 15-40 words, no answer text, no answer letter, concept-focused.
- Clinical Pearls: 25-75 words, practical and nurse-focused.
- Memory Hooks: 5-20 words, concise and memorable.
- Why This Matters: 20-60 words, patient-outcome focused.
- Exam Takeaways: 15-40 words, decision-making and exam-strategy focused.

## Regression Coverage

Added `tests/contracts/flashcard-support-block-quality-governance.contract.test.ts`.

The contract verifies that support blocks:

- Stay within required word ranges
- Avoid answer parroting
- Reject placeholder phrases
- Reject answer-revealing hints
- Replace weak authored blocks with educator-quality fallback content
