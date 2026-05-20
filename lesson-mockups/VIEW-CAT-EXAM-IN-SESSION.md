# RN CAT in-session exam mockups (PNG)

**Not the practice hub** — full-screen exam chrome with NurseNest wordmark, timer, progress, type panel, and per-format question UI.

## View in browser

Open:

`lesson-mockups/rn-cat-exam-in-session-gallery.html`

Use the **Type**, **Direction (A–E)**, and **Theme** controls at the top.

## Export PNGs

```bash
cd nursenest-core
npm run capture:rn-cat-exam-in-session
```

Output folder:

`reports/screenshots/rn-cat-exam-in-session-mockups-2026/`

Naming: `{question-type}--dir-{a|b|c|d|e}--{ocean|blossom|midnight}--desktop.png`

## Question types (12)

| Type | File prefix |
|------|-------------|
| MCQ | `mcq--dir-*` |
| SATA | `sata--dir-*` |
| Bowtie | `bowtie--dir-*` |
| Matrix (one per row) | `matrix_mcq--dir-*` |
| Matrix (multi-response) | `matrix_mr--dir-*` |
| Drag & drop | `drag_drop--dir-*` |
| Drop-down cloze | `dropdown_cloze--dir-*` |
| Highlight text | `highlight_text--dir-*` |
| Hot spot | `hotspot--dir-*` |
| Case study | `case_study--dir-*` |
| Trend | `trend--dir-*` |
| Ordered response | `ordered_response--dir-*` |

## Design directions (pick one per type)

- **A · Balanced** — type panel + standard exam density  
- **B · Stem-forward** — larger stem, lighter chrome  
- **C · Dense** — workstation-tight padding  
- **D · Multi-hue** — semantic chart colors on progress/labels  
- **E · Minimal** — no side panel, more breathing room  

## Production note

Live CAT today renders **MCQ, SATA, and Bowtie** in-app; other formats use these mockups for design review until dedicated runners ship (`cat-runner-renderer-coverage.ts`).
