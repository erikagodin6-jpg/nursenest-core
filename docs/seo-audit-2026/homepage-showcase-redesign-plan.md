# Homepage Feature Showcase — Redesign Plan

**Date:** 2026-05-31
**Status:** Pre-implementation plan

---

## Core Principle Shift

Stop treating the homepage as a product tour. Treat it as a conversion page.

The visitor needs four answers:

1. **What exam do you help me pass?** — Hero handles this (already: NCLEX-RN, REx-PN, CNPLE).
2. **Why are you different from UWorld/Archer?** — The feature showcase must answer this.
3. **Can I trust you?** — Testimonials and social proof answer this.
4. **Should I start today?** — CTAs and urgency answer this.

Everything in the old feature showcase answered none of these. It was a product tour of screenshots that:
- Showed broken/loading states
- Displayed "Live" when the DB had no value
- Described platform features instead of outcomes
- Required screenshot maintenance with every UI change

---

## Audit: Components to DELETE

### `HomepageEcosystemDiscovery` (568 lines) — DELETE ENTIRELY

| Section | Why Delete |
|---|---|
| 12 `PRODUCT_DEMOS` with screenshot images | Show loading/error states; platform-descriptive copy |
| 15 `FEATURES` cards with "Live" count labels | Returns "Live" when DB value = 0; no conversion value |
| Screenshot Gallery (12 screenshots) | Maintenance burden; blurry on mobile |
| Ecosystem map (`nn-home-ecosystem-map`) | Abstract node graph communicates nothing |
| Feature counters with `formatCount()` → "Live" | Trust-damaging; "ECG Cases: Live" is meaningless |
| Outcomes section with fabricated counts | Same problem |
| Value preview with screenshot | Screenshot shows wrong state |

**Keep from old component:**
- Comparison table logic (16 rows vs. "Traditional Question Bank")
- Institutions band copy
- Pathway card approach (but PremiumPathwayShowcase handles this better)

---

## What Replaces It: `HomepageFeatureShowcase`

A server component. No `"use client"`. No images. Pure design tokens.

### Architecture

```
HomepageFeatureShowcase
├── SECTION 1: Question Bank + Rationale Mockup
├── SECTION 2: NGN Clinical Judgment Mockup
├── SECTION 3: CAT Adaptive Readiness Mockup
├── SECTION 4: Platform Comparison Table
├── SECTION 5: Live Inventory (real counts only)
└── SECTION 6: Institutions Band
```

---

## Before/After Wireframes

### Section 1: Question Bank

**BEFORE (screenshot-based):**
```
┌──────────────────────────────────────────────────────────┐
│ [blurry PNG screenshot of question bank]                 │
│ "Real NCLEX-style questions, not generic quiz cards"     │
│ Body: "Completed practice items show the stem, answer..."│
│ Explore Question Bank →                                  │
└──────────────────────────────────────────────────────────┘
```
Problem: Screenshot shows stale UI; copy describes product, not outcome.

**AFTER (token mockup):**
```
┌──────────────────────────────────────────────────────────┐
│ EYEBROW: Question Bank                                   │
│ H2: Practice the same questions used on today's NCLEX.  │
│ BODY: 40,000+ exam-style questions with rationales...    │
│                                                          │
│ ┌ GRID: text | mockup ───────────────────────────────┐  │
│ │ [outcome bullets]   │  [token mockup panel]         │  │
│ │ ✓ NCLEX-style stems │  ┌──────────────────────┐    │  │
│ │ ✓ Clinical rationale│  │ A 58-year-old client…  │   │  │
│ │ ✓ Teaching pearls   │  │ ○ Administer O2        │   │  │
│ │ ✓ Confidence rating │  │ ◉ Position HOB >30°    │   │  │
│ │                     │  │ ○ Increase IV rate     │   │  │
│ │ [Start Free →]      │  │ ○ Call physician first │   │  │
│ │                     │  │ ─────────────────────  │   │  │
│ │                     │  │ ✓ Correct. HOB >30°    │   │  │
│ │                     │  │   reduces aspiration   │   │  │
│ └─────────────────────────────────────────────────┘   │  │
└──────────────────────────────────────────────────────────┘
```

---

### Section 2: NGN Clinical Judgment

**BEFORE:**
```
[6 cards, each with the same 2 blurry screenshots repeated]
"Matrix items show advanced clinical judgment formats"
```
Problem: 3 of 6 cards show the same screenshot; copy is platform-descriptive.

**AFTER:**
```
┌──────────────────────────────────────────────────────────┐
│ EYEBROW: Next Generation NCLEX                          │
│ H2: Master all 6 NGN item types before exam day.        │
│                                                         │
│ 6 FORMAT BADGES — no screenshots                        │
│ [Bowtie] [Matrix] [SATA] [Trend] [Case Study] [Drag]   │
│                                                         │
│ BOWTIE MOCKUP — built from tokens                       │
│ ┌──────────┐   ┌────────────┐   ┌────────────────┐    │
│ │ Actions  │   │ Condition  │   │ Parameters     │    │
│ │ to Take  │ → │ at Risk    │ → │ to Monitor     │    │
│ │ [✓] x3   │   │ [Sepsis]   │   │ [✓] x3         │    │
│ └──────────┘   └────────────┘   └────────────────┘    │
│                                                         │
│ "Bowtie, matrix, SATA, trend, and extended response    │
│  formats — the same question types used on NCLEX       │
│  since 2023."                                          │
└──────────────────────────────────────────────────────────┘
```

---

### Section 3: CAT Adaptive Readiness

**BEFORE:**
```
[blurry CAT exam screenshot]
"Adaptive testing feels different from regular practice"
```

**AFTER:**
```
┌──────────────────────────────────────────────────────────┐
│ EYEBROW: CAT Adaptive Exams                             │
│ H2: Know your exam readiness before test day.           │
│                                                         │
│ ┌ GRID: mockup | text ────────────────────────────┐    │
│ │ ┌─────────────────────┐ │ ✓ Adaptive difficulty  │   │
│ │ │    READINESS GAUGE   │ │   adjusts to your level│   │
│ │ │   ┌──────────┐      │ │                        │   │
│ │ │   │  76%     │      │ │ ✓ Readiness score      │   │
│ │ │   │  READY   │      │ │   after every exam     │   │
│ │ │   └──────────┘      │ │                        │   │
│ │ │ Q 23 / 75           │ │ ✓ Domain-level weak    │   │
│ │ │ Difficulty: ●●●●○○  │ │   area identification  │   │
│ │ │                     │ │                        │   │
│ │ │ Strong: Med-Surg    │ │ ✓ Mimics actual        │   │
│ │ │ Focus:  Pediatrics  │ │   NCLEX CAT behavior   │   │
│ │ └─────────────────────┘ │                        │   │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

### Section 4: Comparison Table

**BEFORE:**
```
H2: "Compare Against Traditional Question Banks"
[table with same structure but generic headers]
```

**AFTER:**
```
H2: "Everything traditional question banks leave out."
SUBHEAD: UWorld and Archer give you questions. NurseNest
         gives you a complete exam prep system.

[Capability]              [Question Bank]  [NurseNest]
────────────────────────────────────────────────────
Question Bank              ✓ Yes           ✓ Integrated
NGN Formats (all 6)        ⚠ Partial       ✓ Integrated
CAT Adaptive Exams         ⚠ Some          ✓ Integrated
Clinical Lessons           ✗ Separate      ✓ Integrated
ECG & Telemetry            ✗ Separate      ✓ Integrated
Lab Interpretation         ✗ Separate      ✓ Integrated
Medication Math            ✗ Separate      ✓ Integrated
Flashcards                 ✗ Separate      ✓ Integrated
Study Plans                ✗ Separate      ✓ Integrated
Readiness Analytics        ✗ Separate      ✓ Integrated
New Graduate Support       ✗ Separate      ✓ Integrated
RPN / REx-PN Pathway       ✗ No            ✓ Canada-first
NP / CNPLE Pathway         ✗ No            ✓ Dedicated
Allied Health Pathways     ✗ No            ✓ 22+ professions
```

---

### Section 5: Platform Inventory

**BEFORE:**
```
[dt] Questions [dd] Live
[dt] Flashcards [dd] Live
[dt] Simulations [dd] Live
```
Problem: "Live" is a trust-destroying label. It says "we don't know."

**AFTER:**
```
If questionCount > 0: show "40,000+ questions"
If lessonCount > 0: show "1,500+ lessons"
clinicalSkillCount: always valid, show "221 clinical skills"
ecgCaseCount: always valid, show "250+ ECG activities"
labCaseCount: always valid, show "200+ lab cases"
medicationMathProblemCount: always valid
If count = 0: show capability label only, no number
```

Rule: **Only show a number if it comes from a verified, non-zero source.**

---

## Count Safety Rules

| Stat | Source | Safe to show? |
|---|---|---|
| `questionCount` | DB query | ✅ if > 0 |
| `totalLessons` | DB query | ✅ if > 0 |
| `totalFlashcards` | DB query | ✅ if > 0 |
| `clinicalSkillCount` | Static catalog | ✅ always |
| `ecgCaseCount` | Static catalog | ✅ always |
| `labCaseCount` | Static catalog | ✅ always |
| `medicationMathProblemCount` | Static catalog | ✅ always |
| `scenarioCount` | DB query | ⚠ show if > 0, else omit |
| `registeredLearners` | DB query | ⚠ show if > 0, else omit |

---

## Copy Rewrite — Before/After

| Section | Before | After |
|---|---|---|
| Question Bank | "Real NCLEX-style questions, not generic quiz cards" | "Practice the same questions used on today's NCLEX — with rationales that explain the clinical thinking, not just the answer." |
| NGN | "Next Generation NCLEX formats are visible before sign-up" | "Master all 6 NGN item types before exam day." |
| CAT | "Adaptive testing feels different from regular practice" | "Know your exam readiness before test day." |
| Lessons | "Lessons teach clinical reasoning, not just definitions" | "Build the clinical reasoning that turns knowledge into correct answers at the bedside." |
| ECG | "ECG training shows the strip and the clinical reasoning" | "Recognize life-threatening rhythms at the bedside." |
| Clinical Skills | "Clinical skills support workplace readiness" | "Build confidence with interactive nursing skills training." |
| Readiness | "Learners can see their readiness report at a glance" | "Know your weakest domains today so you're not surprised on exam day." |
| Comparison | "Compare Against Traditional Question Banks" | "Everything traditional question banks leave out." |

---

## Layout Requirements

All mockup panels use:
```css
display: grid;
grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
```

Below md breakpoint (768px): single column.

All text containers: `min-w-0` to prevent overflow.
All mockup containers: `overflow-hidden`.

No text can overlap mockups — they are in separate grid cells.

---

## Accessibility

- All mockup text uses `var(--palette-heading)` and `var(--palette-text-muted)` — AA compliant
- `@media (prefers-reduced-motion)` — remove all CSS transitions
- No text embedded inside visual elements
- All interactive elements keyboard-accessible
- All decorative elements `aria-hidden`

---

## Implementation Order

1. Write `homepage-feature-showcase.tsx` (new server component)
2. Update `home-restored-with-deferred-stats.server.tsx` to use new component
3. Delete `HomepageEcosystemDiscovery` usage
4. Delete `homepage-ecosystem-discovery.css` classes from `homepage-ecosystem-overhaul.css`

The old `homepage-ecosystem-discovery.tsx` file remains but is no longer imported.
