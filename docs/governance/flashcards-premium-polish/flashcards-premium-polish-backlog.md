# Flashcards Premium Polish — Implementation Backlog

**Source:** Phase 2 UX audit from production-quality preview captures (`audit=1` clinical scenarios)  
**Screenshots:** `docs/screenshots/flashcards-ux-audit-phase2/`  
**Figma:** [Flashcards UX Audit — Phase 2](https://www.figma.com/design/GdZXKqUHG7Hw1XSnfcpRO1)  
**Constraint:** Existing layout preserved — spacing, typography, contrast, and bug fixes only.

---

## Critical

### C1 — Duplicate Submit Answer buttons on mobile

| Field | Detail |
|-------|--------|
| **Screenshot** | `mobile/mcq-unanswered--ocean--390x844.png` |
| **Problem** | Two stacked “Submit Answer” buttons appear (faded pink disabled + active teal). Learners cannot tell which control is authoritative; violates single-primary-CTA pattern. |
| **Recommendation** | Hide or remove the duplicate instance in the mobile stack (likely legacy + refined submit both rendering). Keep one semantic primary button tied to `.nn-flashcard-submit-answer`. |
| **Learner impact** | Faster answer submission; reduced hesitation and mis-taps. |
| **Retention impact** | Fewer abandoned cards from confusion during high-volume sessions. |
| **Effort** | S — CSS display guard or remove redundant markup in question stack mobile breakpoint. |

---

## High

### H1 — SM-2 + coach band below fold on 900px desktop

| Field | Detail |
|-------|--------|
| **Screenshot** | `desktop/mcq-unanswered--ocean--1440x900.png` + measurements |
| **Problem** | At 1440×900: grid bottom ≈525px; coach starts ≈571px; SM-2 top ≈711px. Learners must scroll to rate confidence/SM-2 after answering. |
| **Recommendation** | Reclaim ~130px bottom whitespace (see W1) and/or reduce coach strip vertical padding by ~16–24px to pull SM-2 above fold on 768–900px heights **without moving components to new regions**. |
| **Learner impact** | One-glance rating after reveal; faster card turnover. |
| **Retention impact** | Higher SM-2 completion rate → better scheduling signal. |
| **Effort** | M — CSS-only spacing tuning in `learner-flashcard-layout-refinement-pass.css`. |

### H2 — Rationale long-form readability

| Field | Detail |
|-------|--------|
| **Screenshot** | `desktop/mcq-long-rationale--ocean--1440x900.png` (capture in progress) |
| **Problem** | Long rationale paragraphs in right column use adequate width but line-height and section separation lag UWorld/Archer scannability. |
| **Recommendation** | Increase rationale body `line-height` to ~1.55; add subtle letter-level incorrect-option blocks with semantic left border (existing tokens); keep panel in place. |
| **Learner impact** | Faster skim of “why correct / why incorrect” during review. |
| **Retention impact** | Better encoding of distractor elimination patterns. |
| **Effort** | S — CSS in rationale panel + existing micro-question reveal components. |

### H3 — Topbar action cluster visual noise

| Field | Detail |
|-------|--------|
| **Screenshot** | All desktop `mcq-unanswered--*--1440x900.png` |
| **Problem** | CONV toggle, Pause, Finish compete with progress stats for attention (tertiary to question but high contrast). |
| **Recommendation** | Demote Pause/Finish to ghost/secondary styling; keep Finish accessible but not equal weight to question options. Do not remove controls. |
| **Learner impact** | Eye returns to stem/options faster after header scan. |
| **Retention impact** | Lower session fatigue in 30+ minute decks. |
| **Effort** | S — token-based button variant classes on topbar actions. |

---

## Medium

### M1 — Recover ~130px bottom whitespace

| Field | Detail |
|-------|--------|
| **Screenshot** | Measurements: `bottomGapPx: 130` at 1440×900 |
| **Problem** | ~130px empty space below SM-2 dock on common laptop viewport. |
| **Recommendation** | Reduce canvas bottom padding and/or SM-2 margin-bottom by 48–72px; optionally allow rationale column +24px height within same grid (no IA move). |
| **Learner impact** | More rationale visible without scroll after answer reveal. |
| **Retention impact** | Richer per-card learning without extra time on page. |
| **Effort** | S |

### M2 — Confidence scale discoverability

| Field | Detail |
|-------|--------|
| **Screenshot** | `desktop/mcq-unanswered--ocean--1440x900.png` |
| **Problem** | 1–5 confidence sits in coach grid column equal to Hint; easy to miss pre-submit. |
| **Recommendation** | Slightly increase label weight; add aria-describedby linking confidence to SM-2 (“rate after submit” hint text). No reposition to header. |
| **Learner impact** | More consistent metacognitive ratings. |
| **Retention impact** | Better adaptive weak-area signal quality. |
| **Effort** | S |

### M3 — Mobile SM-2 touch target audit

| Field | Detail |
|-------|--------|
| **Screenshot** | Mobile captures (390–430 widths) |
| **Problem** | SM-2 icons may fall below 44px min height when coach stack is expanded. |
| **Recommendation** | Enforce `min-height: 44px; min-width: 44px` on `.nn-flashcard-rating-dock button` at mobile breakpoints. |
| **Learner impact** | Easier thumb rating during commute study. |
| **Retention impact** | Fewer skipped ratings on mobile-heavy cohorts. |
| **Effort** | S |

### M4 — SATA select-all affordance

| Field | Detail |
|-------|--------|
| **Screenshot** | `sata-unanswered--ocean--1440x900.png` (capture in progress) |
| **Problem** | SATA options visually match MCQ radio styling until selected; “Select all that apply” may not dominate. |
| **Recommendation** | Strengthen existing SATA badge/label contrast using `--semantic-warning` or `--semantic-info` token; no layout move. |
| **Learner impact** | Reduced SATA format errors. |
| **Retention impact** | Better exam-format transfer. |
| **Effort** | S |

---

## Low

### L1 — Decorative corner gradients intensity (Blossom)

| Field | Detail |
|-------|--------|
| **Screenshot** | `desktop/mcq-unanswered--blossom--1440x900.png` |
| **Problem** | Corner blooms slightly compete with rationale panel on very wide screens. |
| **Recommendation** | Reduce opacity 10–15% on `[data-theme="blossom"]` session background ornaments. |
| **Learner impact** | Marginal focus improvement. |
| **Retention impact** | Neutral. |
| **Effort** | S |

### L2 — Heading eyebrow redundancy

| Field | Detail |
|-------|--------|
| **Screenshot** | Desktop samples |
| **Problem** | “Respiratory · clinical-judgment” repeats topic context already in topbar Focus chip. |
| **Recommendation** | Shorten eyebrow to topic only or merge with categories label — copy-only trim. |
| **Learner impact** | ~20px vertical savings for question stem. |
| **Retention impact** | Neutral. |
| **Effort** | S |

### L3 — Locked rationale empty state illustration

| Field | Detail |
|-------|--------|
| **Screenshot** | Unanswered desktop/mobile |
| **Problem** | Book icon + paragraph is clear but passive; could feel like dead space during first pass. |
| **Recommendation** | Slightly increase icon size and mute copy color hierarchy — keep placeholder, no new widgets. |
| **Learner impact** | Clearer “unlock by answering” affordance. |
| **Retention impact** | Neutral. |
| **Effort** | S |

---

## Documented exclusions (not backlog — product boundary)

| Item | Note |
|------|------|
| Bowtie / Matrix / NGN Case Study in flashcards | Not supported in flashcard stack; link to practice/CAT in ecosystem panels instead of forcing into flashcard layout. |
| Weak-area / custom-study auth captures | Blocked this run (DB seed unavailable in agent env); re-run `capture:flashcard-ux-audit-phase2` with seeded demo user. |

---

## Suggested implementation order

1. C1 (mobile duplicate submit)  
2. H1 + M1 (fold + whitespace)  
3. H2 (rationale typography)  
4. H3, M2–M4  
5. L1–L3  
