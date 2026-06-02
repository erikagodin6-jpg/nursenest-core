# RN Practice Exam — In-Session Figma Mockups (FINAL)

**Date:** 2026-05-20  
**Program:** RN Practice Exam (in-session shell — not hub, not CAT licensing without rationale)

## Figma file

| Field | Value |
|--------|--------|
| **File name** | RN Practice Exam — In-Session Mockups 2026 |
| **File URL** | https://www.figma.com/design/n4fpB9mvsQi7Z09Vf3Mrqx/RN-Practice-Exam-In-Session-Mockups-2026 |
| **File key** | `n4fpB9mvsQi7Z09Vf3Mrqx` |

## Design basis

- **Shared shell** with CAT in-session gallery: `lesson-mockups/rn-cat-exam-in-session-gallery.html` and PNGs in `reports/screenshots/rn-cat-exam-in-session-mockups-2026/`
- **Practice-only deltas** modeled in Figma:
  1. **Rationale panel** after submit — shown for **correct and incorrect**
  2. **Lesson links** inside rationale (e.g. `Review: Fluid overload management →`)
  3. **Flag** control in top bar (same as CAT)
  4. **Submit answer → rationale → Next item** (tutor mode; not silent CAT advance)
- **No page scroll** contract: frames labeled `no page scroll · 1280×900` (desktop) and `390×844` (mobile)

## Pages & frames delivered

### `00 — Cover & Index`

| Frame | Node ID |
|-------|---------|
| RN Practice Exam — In-Session Mockups 2026 (index) | `8:3` |

### `Practice Exam — Ocean`

| Frame | Node ID | State / type |
|-------|---------|----------------|
| Practice / Ocean / Desktop / MCQ — before submit | `3:2` | Unanswered MCQ |
| Practice / Ocean / Desktop / MCQ — after correct + rationale | `3:68` | Correct + rationale |
| Practice / Ocean / Desktop / MCQ — after incorrect + rationale + lesson | `3:140` | Incorrect + rationale + lesson link |
| Practice / Ocean / Desktop / SATA — post-rationale | `4:2` | SATA + rationale + lesson link |
| Practice / Ocean / Desktop / Bowtie — post-rationale | `4:70` | Bowtie + rationale + lesson link |
| Practice / Ocean / Mobile / MCQ — post-rationale | `5:2` | Mobile MCQ post-rationale |

### `Practice Exam — Midnight`

| Frame | Node ID | State |
|-------|---------|--------|
| Practice / Midnight / Desktop / MCQ — post-rationale | `6:3` | Midnight parity (key state) |

### `Comparison — CAT vs Practice`

| Frame | Node ID | Notes |
|-------|---------|--------|
| Comparison / Ocean / CAT vs Practice — side-by-side | `7:3` | CAT: no rationale + silent advance; Practice: rationale + Next item |

## Question types in Figma

| Type | Frame(s) |
|------|-----------|
| MCQ | Before submit, correct, incorrect, mobile, midnight, comparison |
| SATA | Ocean desktop post-rationale |
| Bowtie | Ocean desktop post-rationale |
| Matrix, Drag & drop, Case study | Covered in HTML gallery reference; add dedicated Figma frames in follow-up if product wants per-type parity |

## Themes

| Theme | Frames |
|-------|--------|
| **Ocean** | All Ocean page frames + comparison |
| **Midnight** | `6:3` desktop post-rationale |
| **Blossom** | Not duplicated in this pass (Ocean/Midnight minimum met); Blossom tokens available in gallery HTML |

## Emotional UX / hierarchy (PR checklist)

| Lens | Practice exam intent |
|------|----------------------|
| **Emotional UX** | Tutor mode feels supportive: rationale celebrates correct reasoning and explains misses without shame; lesson links restore momentum |
| **Hierarchy** | Stem + options dominate; rationale panel secondary but visible before Next item; Flag remains in top bar |
| **Simplification** | No hub chrome, no cohort walls — same lean in-session shell as CAT gallery |
| **Studying** | Submit → read rationale → optional lesson link → Next item keeps deliberate pacing |

## Related files

| Asset | Path |
|-------|------|
| CAT in-session HTML gallery | `lesson-mockups/rn-cat-exam-in-session-gallery.html` |
| CAT in-session screenshots | `reports/screenshots/rn-cat-exam-in-session-mockups-2026/` |
| Legacy CAT vs Practice UX (older tutor shells) | https://www.figma.com/design/Je5R2l2KpS427gURq9etOn/ |
| CAT design system file | https://www.figma.com/design/n2W9X5ZSC2XtrHtDXKqUeq/ |

## Governance

- Process: `docs/governance/figma-premium-ui-mandatory-process.md`
- Semantic multi-hue accents (chart-1…5), DM Sans, NurseNest logo/wordmark preserved
- **Not mocked:** practice hub landing page

## Next steps (implementation)

1. Product/design sign-off on Ocean MCQ three-state flow + comparison frame
2. Optional: add Matrix / Drag-drop / Case study post-rationale frames (clone shell from gallery)
3. Blossom parity frame if marketing requires it
4. Implement in app using `semantic-status-tokens.css` + existing exam runners (no new parallel shell)

**Figma-only delivery in this pass — no application code changed.**
