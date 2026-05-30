# Figma Audit Annotations — Flashcards UX Audit Phase 2

**Figma file:** [Flashcards UX Audit — Phase 2](https://www.figma.com/design/GdZXKqUHG7Hw1XSnfcpRO1)  
**Screenshot root:** `docs/screenshots/flashcards-ux-audit-phase2/`  
**Organization:** Desktop → Tablet → Mobile (import remaining PNGs as capture job completes)

---

## Desktop — MCQ unanswered (`mcq-unanswered--{theme}--{width}x{height}.png`)

### Strengths
- Question stem is the dominant focal point in the left hero panel.
- Compact sticky topbar (~52px) preserves vertical study space.
- White canvas reads premium vs. prior gray exam shell.
- Locked rationale placeholder clearly communicates unlock behavior.

### Weaknesses
- Topbar Pause/Finish/CONV cluster competes with question for salience.
- ~130px unused space below SM-2 on 900px-tall viewports.
- Eyebrow + Focus chip duplicate topic context.

### Usability concerns
- SM-2 and confidence rating require scroll on 768–900px height laptops after answering.
- Submit disabled state (pink) vs. enabled (teal) hue shift may confuse Blossom users.

### Visual hierarchy issues
- Intended #1–2 (question/options) correct.
- Topbar stats register as #3 — should be #6+.

### Spacing opportunities
- Trim canvas bottom padding 48–72px.
- Reduce coach strip internal padding 8–12px.
- Optional +24px grid height if bottom gap recovered.

### Accessibility
- Option buttons appear keyboard-focusable; verify single tab order to one Submit.
- Rationale locked state should announce `aria-live` on reveal (verify in component).

### Conversion opportunities
- Related Lesson link visible in coach — good cross-sell to lessons without leaving session chrome.

---

## Desktop — MCQ answered / long rationale

### Strengths
- Split grid keeps rationale adjacent to question — UWorld-like scan path.
- Per-option incorrect rationales support distractor learning.

### Weaknesses
- Long rationale paragraphs need stronger line-height and section headers.
- Correct vs incorrect blocks similar visual weight.

### Recommendations (layout preserved)
- Semantic left border on incorrect lines (`--semantic-danger` tint).
- `line-height: 1.55` on rationale body.

---

## Desktop — SATA

### Strengths
- Same grid shell as MCQ — consistent muscle memory.

### Weaknesses
- “Select all that apply” may not visually dominate vs MCQ radio affordance.

### Recommendations
- Strengthen SATA badge contrast with `--semantic-info` / `--semantic-warning` tokens only.

---

## Tablet — iPad portrait / landscape

### Strengths
- Grid collapses to single column in refinement CSS at breakpoints (verify in `*-ipad-*.png`).
- Touch targets on options generally adequate.

### Weaknesses
- Vertical stack increases scroll depth for coach + SM-2.
- Landscape may under-use horizontal width for rationale side-by-side (breakpoint dependent).

### Recommendations
- Keep coach as horizontal strip in landscape where width ≥1024 if already supported; otherwise accept stack.

---

## Mobile — 390–430 widths

### Strengths
- No horizontal scroll in Ocean 390×844 sample.
- Stem typography readable without zoom.

### Weaknesses — **Critical**
- **Duplicate Submit Answer buttons** (disabled pink + active teal).

### Touch target notes
- Verify SM-2 dock `min-height: 44px` when visible below fold.
- Confidence 1–5 buttons may be narrow — measure in capture follow-up.

---

## Theme-specific notes

### Ocean
- Calm teal rationale panel; professional clinical default.
- Submit teal aligns with brand — ensure one CTA only on mobile.

### Blossom
- Warm pink submit accent — premium and motivating.
- Slightly reduce corner gradient opacity on wide screens.

### Midnight
- Import matrix when capture completes.
- Guard rationale panel text contrast (`midnight-dark-readability` contract).

---

## NGN item types (Bowtie / Matrix / Case Study)

**Not annotated in flashcard frames** — flashcard study stack supports MCQ + SATA only. Document ecosystem linking to Practice/CAT for NGN formats; do not force into this layout.

---

## Import checklist for full Figma board

1. Create frames: `Desktop`, `Tablet`, `Mobile`.
2. Batch-upload PNGs via Figma MCP `upload_assets` (5 per batch).
3. Paste annotation blocks from this doc as text layers beside each screenshot.
4. Link backlog IDs (C1, H1, …) on sticky notes for eng handoff.
