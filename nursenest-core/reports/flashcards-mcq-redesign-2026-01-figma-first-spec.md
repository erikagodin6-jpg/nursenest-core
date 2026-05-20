# Flashcards MCQ redesign — Figma-first spec (Phase 1)

**Phase:** Mockups + written spec only. **No production code changes** in this phase.

**Product truth:** Flashcards are **multiple-choice questions with rationale revealed after the learner submits an answer** (pick → reveal). Optional clinical imagery when present. **Not** flip cards, **not** Anki-style Easy/Hard/Again, **not** confidence-before-answer flows.

---

## Emotional UX and hierarchy (learner governance)

Aligned with learner-facing governance prompts:

1. **Immediate goal:** Answer the question confidently, see why the keyed answer is correct, and leave with a clear next step (next card / hub).
2. **What dominates:** Question stem + answer choices (readable, calm, single focal column on mobile).
3. **Secondary:** Session context (mode chip, topic), progress, and post-submit rationale blocks.
4. **Remove / avoid:** Flip metaphor, empty image chrome, dense dashboard-first rails that compete with the stem on small viewports (mockups may still show a rail for parity with current layout — implementation can simplify later).
5. **Motivation:** Multi-hue semantic success/info states, premium polish, clinical intelligence via clear structure — not gamified toy UI.
6. **Overload:** Avoid stacking equal-weight panels above the stem; rationale stays **after** commitment.
7. **Mode:** **Immersive study** during the question; **administrative** only for hub/setup/summary.
8. **Premium feel:** Soft gradients, semantic color bands, generous spacing — **not** monochrome grey slabs.
9. **Time on task:** One obvious primary action at each step (pick → rationale → rate/next).
10. **Momentum:** Sticky next on mobile mockup; hub CTAs for continue / sized session / weak areas.

---

## Interaction model — MCQ + rationale only

- **Commit:** Learner selects **one** lettered option (`tutor_select` default in `FlashcardStudyQuestionStack`).
- **Reveal timing:** On pick, `revealed` becomes true (`requestAnimationFrame` → `onReveal`), then **Answer & rationale** panel mounts (`FlashcardStudyRevealPanels`).
- **Rationale sources:** `explanation` / `exam.rationaleCorrect` for why correct; `exam.rationaleIncorrect[]` for per-letter incorrect rationales; optional clinical pearl.
- **Explicit non-goals:** Front/back flip UI, spaced-repetition grade buttons **as the primary interaction model** (ratings may exist post-reveal for queue semantics — out of scope for this visual redesign question surface).

---

## Themes and contrast

Mockups cover four palettes as **visual language probes** (not new tokens):

| Theme    | Mockup file(s) | Notes |
|----------|------------------|-------|
| Aurora   | `hub-aurora-pathway-stats-ctas.png`, `mcq-ecg-strip-aurora.png`, `theme-aurora-mcq-active.png` | Lilac / sky / soft rose accents on light surfaces |
| Ocean    | `session-gate-setup-ocean.png`, `mcq-with-clinical-image-ocean.png`, `rationale-panel-expanded-ocean.png` | Teal / aqua / sand — good for clinical figures |
| Garden   | `mcq-active-no-image-garden.png`, `session-summary-garden.png` | Sage / butter / warm cream — calm study |
| Midnight | `mobile-mcq-sticky-next-midnight.png` | Dark navy base; emerald/cyan accents; verify WCAG-style contrast in implementation using existing `[data-theme]` + semantic tokens |

**Contrast rule:** Dark theme must keep stem and option text at high contrast; use semantic success/danger only for state — not as large body text fills.

---

## Imagery rule — container only when an asset exists

**Code behavior (audit):**

1. **Leading `<img>` in prompt:** `splitPromptLeadingImage` — renders a bordered panel **only** when a leading `<img>` tag exists **and** `src` is non-empty and valid.
2. **Clinical figure:** Renders **only** when `clinicalImageUrl` is a string starting with `https://` (`FlashcardStudyQuestionStack`). Serialize layer omits key when absent (`flashcard-study-serialize`).

**Design rule:** **Never** show an empty placeholder frame, dashed box, or image coming soon region when there is no asset. The no image mockup (`mcq-active-no-image-garden.png`) must remain **stem-first** with no image strip.

**Performance / CLS:** Prefer fixed `max-height` + `object-contain` (already in code for clinical URL images); lazy-load offscreen images; avoid injecting layout shifts when rationale expands — reserve minimum spacing or animate height with `content-visibility` cautiously in a later phase.

---

## Readonly audit — routes and components

### `/app` routes (learner)

| Path | Role |
|------|------|
| `nursenest-core/src/app/(student)/app/(learner)/flashcards/page.tsx` | Hub — server data, `FlashcardsHubClient`, pathway pick |
| `nursenest-core/src/app/(student)/app/(learner)/flashcards/[deckRef]/page.tsx` | Deck study — `FlashcardDeckStudyShell`, `?start=1`, `mode` learn/test |
| `nursenest-core/src/app/(student)/app/(learner)/flashcards/layout.tsx` | Metadata / dynamic |
| `nursenest-core/src/app/(student)/app/(learner)/flashcards/custom/page.tsx` | Custom session entry |
| `nursenest-core/src/app/(student)/app/(learner)/flashcards/weak-areas/page.tsx` | Weak areas |

### Core UI — mapping for implementation phase

| Concern | Primary files |
|---------|----------------|
| Hub / filters / CTAs | `nursenest-core/src/components/flashcards/flashcards-hub-client.tsx`, `flashcards-pathway-pick-surface.tsx` |
| Deck gate / setup | `nursenest-core/src/components/flashcards/flashcard-deck-study-gate.tsx`, `flashcard-deck-study-shell.tsx` |
| Session runner shell | `nursenest-core/src/components/flashcards/flashcard-study-client.tsx`, `nursenest-core/src/components/exam/exam-session-shell.tsx` |
| Active session / progress / summary | `nursenest-core/src/components/study/active-study-session.tsx` |
| Question + MCQ + images | `nursenest-core/src/components/flashcards/flashcard-study-question-stack.tsx` |
| MCQ options + states | `nursenest-core/src/components/flashcards/flashcard-exam-mcq-answer-list.tsx`, `flashcard-exam-mcq-styles.ts` |
| Rationale panels | `nursenest-core/src/components/flashcards/flashcard-study-reveal-panels.tsx` |
| Rich HTML stem | `nursenest-core/src/components/flashcards/flashcard-rich-content.tsx` |
| Custom / weak flows | `flashcard-custom-study-client.tsx`, `flashcard-weak-study-client.tsx` |

### Types / serialization (reference only)

- `nursenest-core/src/lib/flashcards/flashcard-exam-style.ts` — `ExamMicroQuestionPayload`
- `nursenest-core/src/lib/flashcards/flashcard-study-serialize.ts` — `clinicalImageUrl` inclusion rules
- `nursenest-core/src/lib/flashcards/build-flashcard-custom-session.ts` — clinical image from exam images

### APIs (listed for mapping only — **no changes** this phase)

- `/api/flashcards/decks/[deckRef]/study`, `/api/flashcards/decks/[deckRef]`, inventory/custom-session routes, etc.

---

## Mockups generated

**Directory:** `nursenest-core/reports/flashcards-mcq-redesign-mockups/`  
**Count:** 14 PNG files.

| File | Intent |
|------|--------|
| `hub-aurora-pathway-stats-ctas.png` | Hub: pathway badge, stats row, Continue / Start N / Weak areas |
| `session-gate-setup-ocean.png` | Session setup / gate — Configure vs Start |
| `mcq-active-no-image-garden.png` | Active question — **no** image region |
| `mcq-with-clinical-image-ocean.png` | Clinical photo figure + MCQ |
| `mcq-ecg-strip-aurora.png` | ECG-style strip in figure panel |
| `mcq-lab-chart-panel.png` | Lab chart in figure panel |
| `mcq-answer-states-reference-strip.png` | Idle / selected / correct / incorrect / disabled reference |
| `rationale-panel-expanded-ocean.png` | Correct + why correct + why others incorrect |
| `session-summary-garden.png` | Session complete → return / weak areas |
| `mobile-mcq-sticky-next-midnight.png` | Mobile + sticky Next |
| `theme-aurora-mcq-active.png` | Aurora theme MCQ surface |
| `free-vs-premium-badge-comparison.png` | Subtle Free vs Premium styling |
| `staff-qa-banner.png` | Staff / QA banner |

### Gap list (acceptable subset)

- **Dedicated single-frame Ocean hub** not generated separately — Ocean is represented on gate, clinical MCQ, and rationale mockups.
- **Session setup:** Code today is **deck gate** (configure vs start) plus **hub custom session** builder (`FlashcardsHubClient`) with richer filters; mockups illustrate **plausible** controls only. Spec distinction: **concept** (full hub filters + weak-only + counts) vs **confirmed** in-app today (gate = deck metadata + configure link + `?start=1` tip; hub = category chips, card counts, shuffle, limits — see code).
- **Explicit submitted correct vs incorrect separate full screens:** Covered by composite `mcq-answer-states-reference-strip.png` rather than six standalone PNGs.

---

## Session setup — concept vs confirmed (in-app)

| Idea | Confirmed in code |
|------|-------------------|
| Pathway-scoped hub with filters and session size | **Yes** — `FlashcardsHubClient`, `CARD_COUNTS`, weak/starred filters via query |
| Deck entry gate before study | **Yes** — `FlashcardDeckStudyGate` when `start` ≠ `1` |
| Concept vs confirmed taxonomy toggle | **Not** as named control — exam items carry `itemKindCaption` when provided |
| Bookmark `?start=1` | **Yes** — copy in gate |

---

## Non-goals (this phase)

- No route, auth, API, schema, analytics, entitlement, or pathway routing edits.
- No change to grading logic or FSRS parameters.
- No replacement of `ActiveStudySession` rating API without a separate product decision.

---

## Approval gate before Phase 2 (implementation)

1. Stakeholder sign-off that **MCQ + post-submit rationale** remains the only core interaction (no reintroduction of flip as primary).
2. Visual sign-off on **empty-image** rule (no placeholder chrome).
3. Theme parity check on **Midnight** contrast for stems/options.
4. Confirm rail simplification scope (if any) for mobile — optional follow-up mock.

---

## Inspiration assets (readonly)

User-provided batch under `.cursor/projects/root-nursenest-core/assets/` — align **brand warmth and gradient language**; **do not** replicate flip cards or confidence-before-answer widgets from any legacy screenshots.

---

## Parent summary (3 bullets)

- **Audit:** Learner flashcards hub → `flashcards/page.tsx` + `FlashcardsHubClient`; session → `FlashcardDeckStudyShell` → `FlashcardStudyClient` → `ActiveStudySession` + `FlashcardStudyQuestionStack`; MCQ options/states in `flashcard-exam-mcq-*`; rationale after `revealed` via `FlashcardStudyRevealPanels`; images only when leading `<img>` valid or `clinicalImageUrl` starts with `https://`.
- **Mockups:** 14 PNGs in `nursenest-core/reports/flashcards-mcq-redesign-mockups/` covering hub, gate, MCQ variants (no image / photo / ECG / lab), answer states, rationale, summary, mobile sticky next, themes (Aurora/Ocean/Garden/Midnight), free vs premium, staff QA banner.
- **Spec:** This document locks emotional hierarchy, MCQ-only rationale, theme/contrast notes, image containment rule, file mapping, performance/CLS guidance, non-goals, and approval gate for implementation phase.
