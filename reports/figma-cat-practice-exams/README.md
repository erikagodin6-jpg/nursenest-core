# CAT vs Practice Exam UX — Figma design systems

This folder holds **exported screenshots** and documentation for two **separate** Figma frame sets: **CAT Exam UX** (assessment shell) and **Practice Exam UX** (learning / tutor shell). Layouts use auto-layout so **desktop → tablet → mobile** stay structurally related; **Ocean** vs **Midnight** reuse the same information architecture with **token-level** density and contrast shifts (Midnight reads denser and more “workstation”).

## Figma file

| Field | Value |
|--------|--------|
| **File name** | NurseNest CAT vs Practice Exam UX |
| **File URL** | https://www.figma.com/design/Je5R2l2KpS427gURq9etOn/NurseNest-CAT-vs-Practice-Exam-UX |
| **File key** | `Je5R2l2KpS427gURq9etOn` |

## Pages (clear separation)

| Page in file | Intent |
|--------------|--------|
| **CAT Exam UX** | Minimal Pearson-style adaptive exam: item chrome, tools strip, timer, **no rationale** in-flow, subtle readiness telemetry only. |
| **Practice Exam UX** | Tutor-forward practice: **rationale** surfaces, remediation rails, cohort-style stats, linked lessons/flashcards, customization builder, stepped attempt → explain → reinforce. |

## Top-level frames (by name) and node IDs

### CAT Exam UX page

| Frame name | Node ID | Role |
|------------|---------|------|
| CAT / Ocean / Desktop | `3:2` | NGN **SATA** shell, telemetry strip, vertical tools, footer nav + timer |
| CAT / Ocean / Tablet | `4:2` | NGN **ranking / drag-handle** list shell + side tools |
| CAT / Ocean / Mobile | `4:29` | Compact stem + MCQ-style rows; **horizontal tools dock** |
| CAT / Midnight / Desktop | `5:2` | Exhibit panel + **drag-zone** targets, denser tools |
| CAT / Midnight / End — Score summary | `5:33` | **Theta / pass probability** style summary (dark) |
| CAT / Ocean / End — Score summary | `5:38` | Readiness index + provisional competency copy (light) |
| CAT / Midnight / Tablet | `6:2` | **Cloze** item + dense tools column |
| CAT / Midnight / Mobile | `6:22` | Tools-dominant mobile strip + sepsis-style stem |

### Practice Exam UX page

| Frame name | Node ID | Role |
|------------|---------|------|
| Practice / Ocean / Desktop | `7:2` | Stepped workflow chips, **expanded rationale**, cohort stats, remediation rail, customization column, lesson/flashcard CTAs |
| Practice / Ocean / Tablet | `8:2` | **Bow-tie** NGN shell + rationale line + cohort miss hint + links |
| Practice / Ocean / Mobile | `8:19` | Rationale preview card + weak-area rail + compact builder |
| Practice / Ocean / End — Tutor report | `8:30` | Session report: rationale summary, weak domains, next-step links |
| Practice / Midnight / Desktop | `9:2` | **Matrix** infection-control shell + rationale drawer + tutor sidecar + builder |
| Practice / Midnight / Tablet | `9:34` | Drop-zone priority item + rationale + weak signal + links (stacked) |
| Practice / Midnight / Mobile | `9:40` | Dense tutor card: rationale, stats, remediation micro-sim |
| Practice / Midnight / End — Tutor report | `9:46` | Rationale digest + weak areas + reinforce links (dark) |

## Screenshot files → Figma mapping

| Filename | Frame | Node ID |
|----------|-------|---------|
| `cat-ocean-desktop-ngn.png` | CAT / Ocean / Desktop | `3:2` |
| `cat-ocean-tablet-ranking.png` | CAT / Ocean / Tablet | `4:2` |
| `cat-ocean-mobile-tools.png` | CAT / Ocean / Mobile | `4:29` |
| `cat-midnight-desktop-ngn-exhibit.png` | CAT / Midnight / Desktop | `5:2` |
| `cat-midnight-tablet-tools.png` | CAT / Midnight / Tablet | `6:2` |
| `cat-midnight-mobile-tools.png` | CAT / Midnight / Mobile | `6:22` |
| `cat-end-report-ocean.png` | CAT / Ocean / End — Score summary | `5:38` |
| `cat-end-report-midnight.png` | CAT / Midnight / End — Score summary | `5:33` |
| `practice-ocean-desktop-tutor.png` | Practice / Ocean / Desktop | `7:2` |
| `practice-ocean-tablet-rationale.png` | Practice / Ocean / Tablet | `8:2` |
| `practice-ocean-mobile-shell.png` | Practice / Ocean / Mobile | `8:19` |
| `practice-end-report-ocean.png` | Practice / Ocean / End — Tutor report | `8:30` |
| `practice-midnight-desktop-remediation.png` | Practice / Midnight / Desktop | `9:2` |
| `practice-midnight-tablet-drops.png` | Practice / Midnight / Tablet | `9:34` |
| `practice-midnight-mobile-rationale.png` | Practice / Midnight / Mobile | `9:40` |
| `practice-end-report-midnight.png` | Practice / Midnight / End — Tutor report | `9:46` |

## Design notes — CAT Exam UX (assessment)

1. **Assessment-first hierarchy**: stem and response controls dominate; peripheral UI stays subordinate and restrained (Ocean) or low-luminance panels (Midnight).
2. **No rationale in-flow**: preserves CAT authenticity; only post-hoc summaries appear on end-report frames.
3. **Pearson-style chrome**: clear item container, thin dividers, professional footer with **Previous / timer / Next** — no tutoring copy in item flow.
4. **Telemetry without gamification**: a single **readiness / confidence** band at top — observational copy, not streaks or badges.
5. **Tools strip**: **Flag, Calculator, Contrast, font scaling (A− / A+)**; mobile uses a **horizontal tools dock** for reach.
6. **NGN variety**: **SATA** (Ocean desktop), **ranking** handles (Ocean tablet), **exhibit + drag targets** (Midnight desktop), **cloze** (Midnight tablet), **sepsis-style MCQ** (Midnight mobile) — realistic shells, not decorative cards.
7. **Midnight density**: same regions as Ocean with **tighter padding** and darker surfaces for workstation feel.
8. **Responsive structure**: desktop → tablet → mobile reuse the **same vertical information stack**; tools move side vs bottom.
9. **End state — CAT**: Ocean = **readiness index** + provisional competency; Midnight = **theta / pass probability** language — assessment tone only.
10. **Clinical copy**: plausible nursing stems (HF, DKA, sepsis, precautions) instead of lorem.

## Design notes — Practice Exam UX (learning)

1. **Tutor-forward hierarchy**: rationale, weak-area signals, and **next-step CTAs** are first-class inside a learning loop.
2. **Visible rationale**: expanded panels and mobile preview support **attempt → explain → reinforce**.
3. **Remediation rail**: weak area, suggested drill, **why wrong** — never used on CAT item screens.
4. **Cohort / class statistics**: plausible class and personal accuracy lines for motivation without implying live backend.
5. **Linked lessons + flashcards**: explicit CTAs; omitted entirely from CAT in-flow frames.
6. **Stepped workflow chips**: **Attempt · Explain · Reinforce** on desktop Ocean; CAT uses only item index + timer.
7. **Customization builder**: item counts, topics, timed/untimed, adaptive difficulty — practice-session controls only.
8. **NGN in practice**: **bow-tie** (Ocean tablet), **matrix** (Midnight desktop), **drop-zone prioritization** (Midnight tablet) with teaching affordances.
9. **Midnight practice**: mint/sky/amber accents on dark surfaces for **multi-hue semantics** (not single-brand monochrome).
10. **End state — Practice**: **tutor report** with rationale digest, weak domains, reinforcement links vs CAT probability summaries.

## CAT vs Practice — differentiation summary

| Dimension | CAT Exam UX | Practice Exam UX |
|-----------|-------------|-------------------|
| Primary goal | Measure under standard conditions | Teach and remediate |
| Rationale | Absent during items | Present (expand/collapse / drawer) |
| Side panels | Tools only | Tutor / remediation + builder |
| Analytics tone | Readiness / theta / pass probability | Weak areas, rationale digest, drills |
| Linked study | None in-flow | Lessons + flashcards |

## Artifact paths (absolute)

- `/root/nursenest-core/reports/figma-cat-practice-exams/README.md`
- `/root/nursenest-core/reports/figma-cat-practice-exams/cat-ocean-desktop-ngn.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/cat-ocean-tablet-ranking.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/cat-ocean-mobile-tools.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/cat-midnight-desktop-ngn-exhibit.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/cat-midnight-tablet-tools.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/cat-midnight-mobile-tools.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/cat-end-report-ocean.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/cat-end-report-midnight.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/practice-ocean-desktop-tutor.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/practice-ocean-tablet-rationale.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/practice-ocean-mobile-shell.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/practice-end-report-ocean.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/practice-midnight-desktop-remediation.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/practice-midnight-tablet-drops.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/practice-midnight-mobile-rationale.png`
- `/root/nursenest-core/reports/figma-cat-practice-exams/practice-end-report-midnight.png`

## Blocker note

Figma MCP was **available** for this run (`whoami`, `create_new_file`, `use_figma`, `get_screenshot`). If MCP auth is unavailable later, use the tables and bullets above as a **manual build spec** in Figma.
