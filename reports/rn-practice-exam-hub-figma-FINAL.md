# RN Practice Exam Hub — Figma + PNG mockups (FINAL)

**Date:** 2026-05-20  
**Scope:** Non-CAT practice-tests hub (`/app/practice-tests` without `?cat=1`) — hub only; in-session exam + rationale handled separately.

---

## Figma

| Item | Value |
|------|--------|
| **File** | [RN Practice Exam Hub — NurseNest 2026](https://www.figma.com/design/NrqIluVqGFltGIufS1W4Oy) |
| **Page** | `Practice Exam Hub` |
| **Parity frame** | `Parity · Lessons hub vs Practice hub` (`2:89`) |

### Desktop frames (1440×920)

| Theme | Default | Category selected | System selected | Weak area | Count picker open |
|-------|---------|-------------------|-----------------|-----------|-------------------|
| **Ocean** | `1:3` | `1:45` | `1:87` | `1:126` | `1:170` |
| **Blossom** | `1:214` | `1:256` | `1:298` | `1:337` | `1:381` |
| **Midnight** | `1:425` | `1:467` | `1:509` | `1:548` | `1:592` |

### Mobile frames (390×844)

| Theme | Default | Category | Weak | Count open |
|-------|---------|----------|------|------------|
| **Ocean** | `2:2` | `2:9` | `2:16` | `2:23` |
| **Blossom** | `2:31` | `2:38` | `2:45` | `2:52` |
| **Midnight** | `2:60` | `2:67` | `2:74` | `2:81` |

**Deep link example:** `https://www.figma.com/design/NrqIluVqGFltGIufS1W4Oy?node-id=1-3`

---

## PNG exports

| Item | Path |
|------|------|
| **Gallery HTML** | `lesson-mockups/rn-practice-exam-hub-gallery.html` |
| **Viewer doc** | `lesson-mockups/VIEW-RN-PRACTICE-EXAM-HUB.md` |
| **Screenshots** | `reports/screenshots/rn-practice-exam-hub-mockups-2026/` |
| **Capture spec** | `nursenest-core/tests/e2e/preview/rn-practice-exam-hub.capture.spec.ts` |
| **npm script** | `npm run capture:rn-practice-exam-hub` (from `nursenest-core/`) |

**Count:** 30 PNGs — `{state}--{theme}--{desktop|mobile}.png`

---

## Emotional UX

- **Calm start:** compact hero, generous whitespace, no control-panel wall
- **Confidence:** “Practice exams” / “Question practice”; not CAT licensing
- **Focus:** filter tabs → selection → question count → one CTA
- **Momentum:** weak-area tab + preset counts (10/25/50/75) + stepper
- **Premium:** multi-hue semantic accents (not monochrome brand bars)

---

## Hierarchy

**Dominates:** filter grid + session panel + Start practice exam  
**Secondary:** hero, weak banner, preset chips  
**Out of scope here:** in-session rationale UI, CAT builder cards

---

## Verification

- Figma: 28 frames + parity note on page `Practice Exam Hub`
- Playwright: 30/30 captures passed

