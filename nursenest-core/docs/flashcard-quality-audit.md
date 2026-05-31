# Flashcard Quality Audit

Date: 2026-05-31
Status: Question, hint, rationale, and clinical pearl quality overhaul

Future content flags: `published=false`, `launchReady=false`, `adminOnly=true` until reviewed.

## Audit Scope

This audit applies to flashcards across RN, RPN, NP, Pre-Nursing, Admissions, Allied Health, ECG, Labs, Medication Math, Clinical Skills, Pharmacology, and future pathways.

Evidence reviewed:

- `src/content/flashcards/allied-pharmacy-technician.ts`
- `src/content/flashcard-samples.json`
- Existing flashcard rationale quality contracts
- Existing `src/lib/questions/rationale-quality.ts` flashcard rationale validation
- Platform and content parity audits

## Key Finding

Flashcard infrastructure is mature, but pathway-level flashcard inventory and quality counts are not consistently evidenced. The next quality pass should focus on proving every flashcard supports recognition, understanding, application, or clinical relevance.

## Low-Value Flashcard Types To Flag

| Issue | Description | Severity |
| --- | --- | --- |
| Trivia | Tests an isolated fact with no clinical or exam relevance | High |
| Duplicate card | Repeats the same concept with superficial wording changes | High |
| One-word card | Prompt or answer is too thin to support durable learning | Medium |
| No clinical context | Does not explain why the concept matters | Medium |
| Rote-only | Encourages memorization without recognition or application | Medium |
| Generic rationale | Uses filler such as "review the material" or "this is important" | High |
| Missing related lesson | Cannot connect learner back to deeper explanation | Medium |

## Premium Flashcard Standard

Every flashcard should include:

| Element | Standard |
| --- | --- |
| Prompt | Clear, specific, and aligned to a concept, cue, mechanism, safety risk, or exam pattern |
| Answer | Concise but not cryptic |
| Rationale | Explains why the answer matters |
| Clinical relevance | States how the learner will use the concept |
| Memory hook | Optional but useful for high-yield recall |
| Related content | Lesson, question, lab, ECG, pharmacology, skill, or readiness domain |
| Tags | Pathway, system, topic, difficulty, and scope |

## Flashcard Quality Dimensions

| Dimension | Question To Ask |
| --- | --- |
| Recognition | Does this card help the learner recognize a cue or pattern? |
| Understanding | Does it explain the underlying concept or mechanism? |
| Application | Can the learner apply it to a patient, exam item, or workflow? |
| Clinical Relevance | Would a clinician recognize why this matters? |
| Retention Value | Is it worth reviewing repeatedly? |
| Uniqueness | Is it meaningfully different from existing cards? |

## Examples

| Quality | Example |
| --- | --- |
| Strong | What early sign often appears before obvious respiratory distress in worsening heart failure? |
| Strong Answer | Rapid weight gain from fluid retention can appear before severe dyspnea. |
| Weak | Heart failure causes what? |
| Weak Answer | Fluid overload. |

## Recommendations

1. Add a pathway-level flashcard quality inventory that counts duplicates, one-word cards, missing rationales, missing clinical relevance, and missing related lessons.
2. Require every flashcard to map to at least one lesson or topic.
3. Require clinical context for all nursing, NP, allied, ECG, labs, pharmacology, medication math, and clinical skills cards.
4. Allow simpler definition cards in Pre-Nursing and Admissions, but still require why the concept matters.
5. Block publish for cards with placeholder text, duplicate normalized prompts, missing answers, or generic rationales.

