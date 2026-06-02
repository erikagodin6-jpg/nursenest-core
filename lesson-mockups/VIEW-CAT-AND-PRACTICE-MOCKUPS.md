# CAT & Practice exam mockups — local review (no Figma required)

**Figma is optional.** Open the HTML galleries in your browser or browse PNGs in this repo. Everything lives under `lesson-mockups/` and `reports/screenshots/`.

## Quick open (from repo root)

| What | Path in workspace | Browser (`file://`) |
|------|-------------------|---------------------|
| **Master index** | `lesson-mockups/VIEW-CAT-AND-PRACTICE-MOCKUPS.md` | — |
| CAT in-session gallery | `lesson-mockups/rn-cat-exam-in-session-gallery.html` | `file:///…/nursenest-core/lesson-mockups/rn-cat-exam-in-session-gallery.html` |
| Practice in-session gallery | `lesson-mockups/rn-practice-exam-in-session-gallery.html` | `file:///…/nursenest-core/lesson-mockups/rn-practice-exam-in-session-gallery.html` |
| Practice exam hub gallery | `lesson-mockups/rn-practice-exam-hub-gallery.html` | `file:///…/nursenest-core/lesson-mockups/rn-practice-exam-hub-gallery.html` |
| Legacy CAT hub mockups (older) | `lesson-mockups/cat-exam-mockups.html` | optional — not the in-session matrix |

**In Cursor / VS Code:** right-click any `.html` or `.png` → **Reveal in File Explorer** / **Open with Live Preview** / open path in Chrome.

---

## HTML galleries (primary deliverable)

### A. CAT in-session (`rn-cat-exam-in-session-gallery.html`)

- **12 question types** (MCQ, SATA, bowtie, matrix, drag-drop, cloze, highlight, hotspot, case study, trend, ordered response)
- **5 layout directions** A–E
- **Themes:** Ocean, Blossom, Midnight
- Sticky controls switch type / direction / theme without Figma

See also: `lesson-mockups/VIEW-CAT-EXAM-IN-SESSION.md`

### B. Practice in-session (`rn-practice-exam-in-session-gallery.html`)

- **States:** Pre-submit → Submit → per-option + full rationale → Next
- **Rationale correct / incorrect**, SATA post-submit
- Lesson link placeholders, flag, tutor-mode chrome
- **Themes:** Ocean, Blossom, Midnight

### C. Practice exam hub (`rn-practice-exam-hub-gallery.html`)

- Lessons-hub-like layout: white space, semantic color accents on category tiles
- Filters: all topics, by category, by system, weak & unanswered
- Question count: 10 / 25 / 50 / custom + **Start practice session** CTA
- Full learner nav + NurseNest logo placeholder
- **Views:** default, filters active, custom count
- **Themes:** Ocean, Blossom, Midnight

See also: `lesson-mockups/VIEW-RN-PRACTICE-EXAM-HUB.md` (hub-specific notes)

---

## Regenerate PNGs (Playwright, no Figma)

From `nursenest-core/`:

```bash
npm run capture:rn-cat-exam-in-session      # CAT in-session matrix
npm run capture:rn-practice-exam-in-session # Practice in-session states
npm run capture:rn-practice-exam-hub        # Practice hub views
npm run capture:rn-practice-cat-mockups     # All three above
```

CAT hub (live app chrome, needs dev server + auth):

```bash
npm run capture:rn-cat-mockups   # → reports/screenshots/rn-cat-exam-mockups-2026/
```

---

## PNG folders & naming

| Folder | Gallery source | Naming pattern | Expected count |
|--------|----------------|----------------|----------------|
| `reports/screenshots/rn-cat-exam-mockups-2026/` | Live app capture | `01-cat-hub--{theme}--{desktop\|mobile}.png` | 4 |
| `reports/screenshots/rn-cat-exam-in-session-mockups-2026/` | CAT in-session HTML | `{type}--dir-{a\|b\|c\|d\|e}--{ocean\|blossom\|midnight}--desktop.png` | 180 (12×5×3) |
| `reports/screenshots/rn-practice-exam-in-session-mockups-2026/` | Practice in-session HTML | `{state}--{theme}--desktop.png` | 12 (4×3) |
| `reports/screenshots/rn-practice-exam-hub-mockups-2026/` | Practice hub HTML | `hub--{view}--{theme}--desktop.png` | 9 (3×3) |

**Note:** `rn-practice-exam-hub-mockups-2026/` may also contain older PNGs (`default--`, `category--`, `system--`, etc.) from a prior capture spec. Prefer the **`hub--*`** files that match the current gallery.

### Git / GitHub

- `reports/screenshots/**/*.png` is **not** in `.gitignore` — PNGs can be committed so reviewers see them on GitHub.
- Until committed, open files **locally** in the workspace (paths above).
- Large PNG batches are fine to commit for design review; skip if your team prefers CI-generated artifacts only.

---

## Practice in-session PNGs (12)

```
reports/screenshots/rn-practice-exam-in-session-mockups-2026/pre_submit--blossom--desktop.png
reports/screenshots/rn-practice-exam-in-session-mockups-2026/pre_submit--midnight--desktop.png
reports/screenshots/rn-practice-exam-in-session-mockups-2026/pre_submit--ocean--desktop.png
reports/screenshots/rn-practice-exam-in-session-mockups-2026/rationale_correct--blossom--desktop.png
reports/screenshots/rn-practice-exam-in-session-mockups-2026/rationale_correct--midnight--desktop.png
reports/screenshots/rn-practice-exam-in-session-mockups-2026/rationale_correct--ocean--desktop.png
reports/screenshots/rn-practice-exam-in-session-mockups-2026/rationale_incorrect--blossom--desktop.png
reports/screenshots/rn-practice-exam-in-session-mockups-2026/rationale_incorrect--midnight--desktop.png
reports/screenshots/rn-practice-exam-in-session-mockups-2026/rationale_incorrect--ocean--desktop.png
reports/screenshots/rn-practice-exam-in-session-mockups-2026/sata_rationale--blossom--desktop.png
reports/screenshots/rn-practice-exam-in-session-mockups-2026/sata_rationale--midnight--desktop.png
reports/screenshots/rn-practice-exam-in-session-mockups-2026/sata_rationale--ocean--desktop.png
```

States: `pre_submit` | `rationale_correct` | `rationale_incorrect` | `sata_rationale`

---

## Practice hub PNGs — canonical (9)

```
reports/screenshots/rn-practice-exam-hub-mockups-2026/hub--count_custom--blossom--desktop.png
reports/screenshots/rn-practice-exam-hub-mockups-2026/hub--count_custom--midnight--desktop.png
reports/screenshots/rn-practice-exam-hub-mockups-2026/hub--count_custom--ocean--desktop.png
reports/screenshots/rn-practice-exam-hub-mockups-2026/hub--default--blossom--desktop.png
reports/screenshots/rn-practice-exam-hub-mockups-2026/hub--default--midnight--desktop.png
reports/screenshots/rn-practice-exam-hub-mockups-2026/hub--default--ocean--desktop.png
reports/screenshots/rn-practice-exam-hub-mockups-2026/hub--filters_active--blossom--desktop.png
reports/screenshots/rn-practice-exam-hub-mockups-2026/hub--filters_active--midnight--desktop.png
reports/screenshots/rn-practice-exam-hub-mockups-2026/hub--filters_active--ocean--desktop.png
```

Views: `default` | `filters_active` | `count_custom`

---

## CAT hub PNGs (4)

```
reports/screenshots/rn-cat-exam-mockups-2026/01-cat-hub--blossom--desktop.png
reports/screenshots/rn-cat-exam-mockups-2026/01-cat-hub--midnight--mobile.png
reports/screenshots/rn-cat-exam-mockups-2026/01-cat-hub--ocean--desktop.png
reports/screenshots/rn-cat-exam-mockups-2026/01-cat-hub--ocean--mobile.png
```

---

## CAT in-session PNGs

Full matrix: **12 types × 5 directions × 3 themes** = **180** desktop PNGs.

List locally:

```bash
find reports/screenshots/rn-cat-exam-in-session-mockups-2026 -name '*.png' | sort
```

Types: `mcq`, `sata`, `bowtie`, `matrix_mcq`, `matrix_mr`, `drag_drop`, `dropdown_cloze`, `highlight_text`, `hotspot`, `case_study`, `trend`, `ordered_response`

Example: `reports/screenshots/rn-cat-exam-in-session-mockups-2026/trend--dir-e--ocean--desktop.png`

---

## Capture specs (for maintainers)

| Spec | Output dir |
|------|------------|
| `nursenest-core/tests/e2e/preview/rn-cat-exam-in-session.capture.spec.ts` | `rn-cat-exam-in-session-mockups-2026/` |
| `nursenest-core/tests/e2e/preview/rn-practice-exam-in-session.capture.spec.ts` | `rn-practice-exam-in-session-mockups-2026/` |
| `nursenest-core/tests/e2e/preview/rn-practice-exam-hub.capture.spec.ts` | `rn-practice-exam-hub-mockups-2026/` |
| `nursenest-core/tests/e2e/visual-qa/rn-cat-exam-mockup-capture.spec.ts` | `rn-cat-exam-mockups-2026/` (app) |

---

## Figma / FINAL reports

No `reports/rn-*-figma-FINAL.md` files are required for review. If Figma links exist on your team, they are supplementary; **HTML + PNG in this repo are the source of truth for mockup review.**

---

## Audit summary (what was missing vs fixed)

| Item | Before | After |
|------|--------|-------|
| CAT in-session gallery HTML | Present (untracked) | Verified — interactive |
| CAT in-session PNGs | Partial (~65, mostly Ocean) | **180** (full matrix re-captured) |
| Practice in-session gallery | Missing | **Created** |
| Practice in-session PNGs | Missing | **12 generated** |
| Practice hub gallery | Partial / stale doc | **Created** (new states) |
| Practice hub PNGs | Folder missing | **9 canonical** `hub--*` (+ legacy files optional) |
| User index | Fragmented | **`VIEW-CAT-AND-PRACTICE-MOCKUPS.md`** (this file) |
| npm scripts | CAT only | **+ practice in-session, hub, bundle** |
