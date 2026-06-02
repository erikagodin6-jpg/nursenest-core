# Learner Study Workspace Architecture

This document is the current contract for NurseNest learner study routes after the practice-entry convergence pass. The platform is one clinical study workspace; individual tools change the center activity, not the shell architecture.

## Canonical Entry Flows

| Experience | Canonical Route | Route Owner | Shell Owner | Notes |
| --- | --- | --- | --- | --- |
| Dashboard mode | `/app` | `src/app/(app)/app/(learner)/page.tsx` | Learner shell | Owns recommendations, study continuity, and learner cockpit content. Other study shells should not inject dashboard widgets. |
| Lesson mode | `/app/lessons`, `/app/lessons/[id]` | `src/app/(app)/app/(learner)/lessons/*` | Lesson reader inside learner shell | Focused on lesson navigation, lesson content, semantic callouts, and reading progress. No continuation widgets at the bottom of learner lesson detail. |
| Flashcard mode | `/app/flashcards` | `src/app/(app)/app/(learner)/flashcards/page.tsx` | Shared study setup inside learner shell | Uses `SharedStudySetupLayout` and `SharedStudySetupSurface`; session launch is owned by flashcard clients/API. |
| Practice setup mode | `/app/practice-tests` | `src/app/(app)/app/(learner)/practice-tests/page.tsx` | Shared study setup inside learner shell | Uses the same setup architecture as flashcards. `/app/practice`, `/app/practice-exams`, `/app/exams`, and `/app/cat` are redirect aliases only. |
| Focused exam mode | `/app/practice-tests/[id]` | `src/app/(app)/app/(learner)/practice-tests/[id]/page.tsx` | Focused exam shell | Suppresses learner dashboard chrome, footer, recommendation engines, and unrelated widgets. Results and setup routes are excluded from focus mode. |
| CAT mode | `/app/practice-tests?catLaunch=1&pathwayId=...` | `PathwayCatSessionStartClient` and practice session routes | Shared setup, then focused exam shell | CAT launch uses the canonical practice-tests path. CNPLE redirects to `/app/cases/cnple`; active CAT sessions render through the focused exam shell. |

## Routing Conventions

- Study hubs use `/app/practice-tests`, `/app/flashcards`, and `/app/lessons`.
- Practice exam setup does not use `startMode`; mode selection belongs to the shared setup client state.
- CAT launch uses `catLaunch=1` when it must deep-link into the launch flow.
- Alias routes preserve query params and redirect to `/app/practice-tests`; they do not import or mount practice setup UI.
- Deprecated alias routes are compatibility shims only. They must not grow new UI, providers, or data loaders.
- Hidden alternate setup directories such as `quiz-setup`, `adaptive-setup`, `exam-setup`, and `cat-setup` must not exist under the learner route group.

## Deprecated Alias Inventory

These routes remain temporarily for safe rollout and old callback/link compatibility. Remove navigation entry points first, verify access logs/telemetry, then delete in a later isolated cleanup.

| Deprecated Route/System | Replacement | Current Status | Removal Gate |
| --- | --- | --- | --- |
| `/app/practice-tests/start` | `/app/practice-tests?catLaunch=1` | Redirect alias only; no setup UI. | Confirm zero/low direct traffic and no auth callback dependence. |
| `/app/practice-tests/cat-launch` | `/app/practice-tests?catLaunch=1&pathwayId=...` or `/app/cases/cnple` for CNPLE | Redirect alias only; preserves CNPLE special case. | Confirm route access logs show no live non-CNPLE dependence. |
| `/app/questions/session` | `/app/practice-tests` with preserved query params | Redirect alias only; no session UI. | Confirm weak-area/remediation callbacks have migrated. |
| Legacy question-bank inline setup clients | Unified practice setup flow for exam sessions; `/app/questions` remains a bank surface | Active compatibility surface, not removal-ready. | Decide whether `/app/questions` remains a separate bank product before deprecating components. |

Cleanup rule: never delete one of these entries in the same change that removes navigation links. Keep each removal reversible and backed by focused route tests.

## Provider And Shell Hierarchy

1. Root app providers and global CSS.
2. `(app)/app` authenticated app route group.
3. `(learner)` layout with learner navigation, theme-aware learner shell, and route-level chrome gates.
4. Activity-specific surfaces:
   - Dashboard surfaces own dashboard recommendations.
   - Shared study setup surfaces own flashcard/practice content selection.
   - Lesson reader owns lesson-specific navigation and content blocks.
   - Focused exam shell owns active question/CAT session chrome.

Focused exam mode is detected by `src/lib/learner/focused-exam-shell.ts`. It only returns true for exactly one dynamic segment under `/app/practice-tests/`; setup, CAT launch, insights, and results routes keep normal learner chrome.

## Shared Setup Flow

`SharedStudySetupLayout` and `SharedStudySetupSurface` are the shared foundation for Flashcards and Practice Exams. New study modes should extend this setup system instead of creating a separate landing page.

Shared responsibilities:

- Pathway/system selection.
- Topic/category filtering.
- Difficulty and question/card count controls when the mode supports them.
- Mode-specific start action.
- Loading skeletons and recovery UI that preserve the setup structure.

Mode-specific responsibilities:

- Flashcards: deck/card session initialization.
- Practice Exams: question session initialization.
- CAT: adaptive launch and eligibility checks before focused session entry.

## Regression Safeguards

The primary contracts are:

- `tests/contracts/premium-full-platform-convergence.contract.test.ts`
- `src/lib/learner/canonical-learner-routes.contract.test.ts`
- `src/lib/learner/learning-live-routes-import.contract.test.ts`
- `src/lib/learner/focused-exam-shell.test.ts`
- `src/lib/practice-tests/practice-alias-redirect.contract.test.ts`

These guards cover the single canonical practice entry, alias redirects, shared setup usage, focused exam isolation, CAT launch correctness, and the absence of legacy setup directories.
