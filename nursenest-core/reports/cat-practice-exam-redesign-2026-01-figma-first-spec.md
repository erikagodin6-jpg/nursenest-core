# CAT + Practice Exam — Shared Shell (UI-only vision spec)

**Status:** Phase 1 — design intent + mockups only. **No implementation authorized** until stakeholder sign-off.  
**Scope boundary:** Visual composition, hierarchy, emotional UX, and component *mapping* to existing files. **Forbidden:** exam/CAT logic, routing, APIs, auth, entitlements, timing, persistence, scoring, analytics plumbing, question schema.

---

## 1. Emotional UX — high-stakes vs learning mode

### CAT (adaptive, assessment)

- **Primary feelings:** focus, procedural fairness, “this counts,” calm alertness. Learners should trust that the interface is **exam-authentic** and not coaching them mid-item.
- **Visual dominance:** the **item stem + answer surface**; secondary = timer / progress / minimal navigation affordances.
- **Avoid:** cheerleading microcopy, rationale peeking, tutor strips, or gamified streak UI during the run.
- **Post-session:** shift to **clear, sober analytics** (results mockup `11-cat-results-analytics-end-screen.png`) — informative, not a marketing celebration.

### Practice exam (coaching / study)

- **Primary feelings:** safety to learn, immediate feedback, momentum toward mastery. The shell stays **recognizably the same product** as CAT so muscle memory transfers.
- **Visual dominance:** stem + choices **plus** an obvious **rationale / coach zone** (sidebar desktop, drawer mobile — `03`, `04`).
- **Avoid:** turning practice into a cluttered “dashboard inside the exam”; coaching must feel **optional-to-expand** but **easy to find**.

---

## 2. CAT vs Practice differentiation (UI only)

| Dimension | CAT (minimal / authentic) | Practice (coaching) |
|-----------|---------------------------|---------------------|
| Header badge | `CAT · Adaptive` (or pathway-specific adaptive label) | `Practice` / `Practice exam · Learning` |
| Rationale | Hidden by default; no inline hints | Persistent panel or expandable drawer; optional “after each item” (customization — `10`) |
| Coach / tutor strip | Absent | Slim strip: hints, related lesson links, “why it matters” (`03`) |
| Answer reveal | Neutral choice styling until submit; **no** green/red per-option before completion | After submit/review: correct/incorrect affordances (`06`) |
| Break / pause | Rules-driven; modal overlay (`06`) | Same shell; may allow more forgiving copy (copy-only; behavior unchanged) |
| Customization | Briefing + pathway rules only (`09`) | Timed/untimed, counts, rationale toggles (`10`) |
| Results | Analytics-forward (`11`) | May emphasize learning metrics + review entry points (same route family; presentation only) |

---

## 3. Theme restraint — exam shell vs dashboard / marketing

- **Exam runner:** restrained palette — cool neutrals, soft teal/cyan accents, **glass shell** (frosted header + content card). Avoid homepage-style gradients and hero saturation (contrast with inspiration assets in readonly paths — those inform **marketing** tone; runner stays quieter).
- **Semantic hues:** Use multi-hue semantics for **data bars / domain breakdown** on results (`11`), not “everything primary.” Align later with `semantic-status-tokens.css` and `semanticFillClassForAccuracyPct` patterns — **no hardcoded hex in implementation** (spec visuals are illustrative).
- **Four themes (Aurora / Ocean / Garden / Midnight):** **subtle tint** on surfaces and header glass — especially **Midnight** must preserve **WCAG-minded contrast** for stems and choices (`02`, `05`). Themes are identity, not carnival filters.
- **Learner emotional guardrails:** Premium, calm, clinically intelligent — not toy-like gamification (per production governance).

---

## 4. Component mapping — existing codebase (post-approval implementation)

Use this table to anchor refactors **without** inventing parallel runners.

| Mockup focus | Likely implementation touchpoints (readonly audit) |
|--------------|-----------------------------------------------------|
| Shared shell / layout / timer / nav chrome | `nursenest-core/src/components/student/practice-test-runner-client.tsx` |
| Board composition / split layouts | `nursenest-core/src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx` |
| CAT session start / briefing | `nursenest-core/src/components/student/pathway-cat-session-start-client.tsx`, page `src/app/(student)/app/(learner)/practice-tests/start/page.tsx` |
| Practice tests hub / entry | `nursenest-core/src/components/student/practice-tests-hub-client.tsx`, `src/app/(student)/app/(learner)/practice-tests/page.tsx` |
| Runner route host | `src/app/(student)/app/(learner)/practice-tests/[id]/page.tsx` |
| Results / analytics surface | `src/app/(student)/app/(learner)/practice-tests/[id]/results/page.tsx`, `src/components/student/practice-test-results-static.tsx` |
| Session error boundary | `src/components/exam/exam-session-error-boundary.tsx` |
| CAT insights history (related IA) | `src/app/(student)/app/(learner)/practice-tests/cat-insights/page.tsx` |
| Direct CAT launch | `src/app/(student)/app/(learner)/practice-tests/cat-launch/page.tsx` |
| Legacy `/app/cat` alias | `src/app/(student)/app/(learner)/cat/page.tsx` → redirects to `/app/practice-tests` |
| Nav links (canonical CAT entry) | `src/lib/navigation/learner-primary-nav.ts` (`cat`, `catBuilder`) |
| Motion / transition exclusions | `src/lib/motion/page-transition-shell.tsx` (practice-test runner paths) |

**Mobile app (React Native)** — separate codebase path; API parity noted in comments: `apps/mobile/App.tsx`, `PracticeRunnerGateScreen`, `PracticeHubScreen` — align web shell decisions before native port.

---

## 5. Performance constraints (implementation phase)

- **No heavy animation libraries** for the exam shell; prefer CSS transitions with **fixed dimensions** for skeletons to avoid **CLS** (layout shift).
- **Reserve space** for rationale drawer / coach strip in Practice mode so opening panels does not push the stem vertically on mobile.
- **Skeleton loading:** shimmer-only in place of content blocks (`06`); avoid layout-changing spinners mid-item.
- **Respect existing caching semantics** on `/app` surfaces — no weakening `private` / `no-store` behavior.

---

## 6. Non-goals (explicit)

- Changing CAT adaptation rules, stopping rules, or scoring models.
- New API routes, payload shapes, or question schema.
- Auth, entitlements, paywall, or analytics event taxonomy changes.
- Replacing `PracticeTestRunnerClient` with a second parallel runner without consolidation plan.
- Marketing homepage redesign (inspiration PNGs are reference only).

---

## 7. Asset manifest — Phase 1 mockups

**Folder:** `nursenest-core/reports/cat-practice-exam-redesign-mockups/`  

| File | Intent |
|------|--------|
| `01-shared-shell-desktop-cat-vs-practice-badge.png` | Shared glass header; CAT vs Practice differentiation at a glance |
| `02-cat-case-study-panels-midnight-theme.png` | Case study + vitals/labs/MAR; **Midnight** readability stress-test |
| `03-practice-rationale-sidebar-coach-strip.png` | Practice: rationale column + coach strip |
| `04-mobile-cat-active-plus-practice-rationale-drawer.png` | Mobile: CAT clean vs Practice rationale drawer |
| `05-theme-swatches-aurora-ocean-garden-midnight.png` | Subtle theme tint strips (four variants) |
| `06-states-flag-pause-skeleton-answer-reveal.png` | Flag, pause modal, skeleton, practice reveal vs CAT neutral |
| `07-question-flavors-ecg-labs-dosage.png` | ECG strip, lab table, dosage calc layouts |
| `08-sata-and-bowtie-formats-composite.png` | SATA + bowtie / trend diagram placeholders |
| `09-cat-pre-exam-briefing-screen.png` | Pre-exam briefing / rules deck |
| `10-practice-customization-modal-sheet.png` | Practice setup: timed/untimed, rationale toggle |
| `11-cat-results-analytics-end-screen.png` | CAT completion analytics / pass outlook visualization |

**Readonly inspiration (not part of deliverable count):** paths under `.cursor/projects/root-nursenest-core/assets/` referenced by stakeholders for homepage/practice marketing tone.

---

## 8. Approval gate

Implementation (TSX/CSS) begins only after:

1. Sign-off on mockups + this spec.  
2. Confirmation that **shared shell** approach preserves existing runner contracts (`PracticeTestRunnerClient`).  
3. Visual QA plan against **Midnight** and **mobile drawer** states.

---

*Document version: 2026-01 (Figma-first phase)*
