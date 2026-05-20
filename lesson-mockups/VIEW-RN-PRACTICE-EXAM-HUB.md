# RN Practice Exam Hub — mockup gallery

Static HTML gallery aligned to Figma frames (`RN Practice Exam Hub — NurseNest 2026`).

## Open locally

```bash
# From repo root — open in browser
xdg-open lesson-mockups/rn-practice-exam-hub-gallery.html
# or file://$(pwd)/lesson-mockups/rn-practice-exam-hub-gallery.html
```

Use the sticky control bar to switch **theme** (Ocean / Blossom / Midnight), **state**, and **viewport**.

## Capture PNGs (Playwright)

```bash
cd nursenest-core
npm run capture:rn-practice-exam-hub
```

Output: `reports/screenshots/rn-practice-exam-hub-mockups-2026/*.png` (30 files: 5 states × 3 themes × 2 viewports).

## States

| State | Purpose |
|-------|---------|
| `default` | Categories tab, no selection |
| `category` | Pharmacology tile selected |
| `system` | Body systems tab, cardiovascular selected |
| `weak` | Weak & unanswered tab + banner |
| `count-open` | Question-count popover / slider visible |

## Product notes

- **Not CAT licensing** — hub copy labels “Question practice” / “Practice exams”; CAT stays on `?cat=1`.
- **Session CTA** — “Start practice exam” → same shell as CAT with tutor/rationale (designed in-session elsewhere).
- **Question count** — preset chips (10 / 25 / 50 / 75) + stepper; popover for custom slider in `count-open` state.
