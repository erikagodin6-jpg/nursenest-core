# Platform Navigation Unification Report

Date: 2026-05-31

## Audit Findings

| Legacy surface | Component | Routes affected | File path | Usage count before migration |
|---|---|---:|---|---:|
| Learner dashboard shell | `LearnerShellLayout` legacy chrome block | All `/app/*` learner routes | `src/app/(app)/app/(learner)/layout.tsx` | 1 shared layout |
| Desktop learner study nav | `LearnerShellDesktopStudyLinks` | All non-focused `/app/*` learner routes | `src/components/layout/learner-shell-primary-nav.tsx` | 1 runtime mount |
| Mobile learner bottom nav | `LearnerShellMobileBottomNav` | All non-focused `/app/*` learner routes | `src/components/layout/learner-shell-primary-nav.tsx` | 1 runtime mount |
| Pathway banner / pill | `LearnerShellPathwayPill`, `LearnerPathwayContextBar`, `LearnerStudyPathStrip` | All non-focused `/app/*` learner routes | `src/app/(app)/app/(learner)/layout.tsx` | 3 runtime mounts |
| Duplicate account controls | `LearnerShellUserBar`, `SignOutButton` in learner chrome | All non-focused `/app/*` learner routes | `src/app/(app)/app/(learner)/layout.tsx` | 2 runtime mounts |
| Duplicate utility controls | `SupportEmailHeaderLink`, `LearnerShellLanguageControl`, `LearnerThemeControl` | All non-focused `/app/*` learner routes | `src/app/(app)/app/(learner)/layout.tsx` | 3 runtime mounts |
| Duplicate study recommendation strip | `LearnerStudyNextBlock` layout mount | Most non-dashboard `/app/*` learner routes | `src/app/(app)/app/(learner)/layout.tsx` | 1 conditional runtime mount |

## Route Mapping

| Route family | Before | After |
|---|---|---|
| Homepage, pricing, blog, public hubs | Homepage `SiteHeaderServer` | Homepage `SiteHeaderServer` |
| Dashboard `/app` | Learner dashboard shell + learner nav | Homepage `SiteHeaderServer` |
| Lessons, flashcards hub, question bank, readiness, account/profile | Learner shell + duplicate learner nav | Homepage `SiteHeaderServer` |
| Clinical Skills, ECG, Labs, Medication Math, Telemetry learner routes | Learner shell + module layouts | Homepage `SiteHeaderServer` at platform level |
| CAT / practice exam session | Focused exam chrome | Focused exam chrome |
| Flashcard study session | Focused flashcard study chrome | Focused flashcard study chrome |

## Migration Plan

1. Make `SiteHeaderServer` the canonical learner header.
2. Remove legacy learner header, pathway banner, study-nav row, bottom nav, duplicate account controls, duplicate support/language/theme controls, and shell-level study recommendation strip from the shared learner layout.
3. Preserve focused exam and study-session chrome as the only approved exceptions.
4. Keep admin learner QA simulation in the learner route body so admins see the same global navigation and content/paywall behavior as learners.
5. Update navigation governance contracts so CI enforces the new canonical header path.

## Implemented

- `src/app/(app)/app/(learner)/layout.tsx` now renders `SiteHeaderServer` for normal learner routes.
- Active CAT/practice exam and flashcard study sessions remain distraction-free.
- Legacy learner nav mounts were removed from the shared learner layout.
- The old duplicate learner nav implementation file `src/components/layout/learner-shell-primary-nav.tsx` was deleted.
- The unauthenticated learner gate now uses the global `SiteHeader`.
- Admin learner QA presets now expose the requested options:
  - View As RN Free User
  - View As RN Subscriber
  - View As RPN Subscriber
  - View As NP Subscriber
  - View As Allied Subscriber
  - View As Guest Visitor
- Navigation governance now points `CANONICAL_NAV_COMPONENT_PATH` to `src/components/layout/site-header-server.tsx`.
