# User/Profile Query Remediation

Date: 2026-06-01

## Executive Summary

Performance Phase 1 consolidated duplicate learner profile reads behind a request-scoped server cache.

Primary implementation:

- `src/lib/learner/load-learner-request-user.ts`
- `src/lib/learner/load-learner-activity-context.ts`
- `src/lib/entitlements/get-user-access.ts`
- `src/lib/auth/protected-route-session.ts`

The shared loader now provides the common learner row used by session active checks, entitlement derivation, learner pathway selection, measurement preferences, onboarding/baseline state, study settings, exam plan metadata, analytics identity, and account preference reads.

## Duplicate Lookup Findings

Search scope:

- `getServerSession`
- `auth()`
- `currentUser()`
- `user.findUnique()`
- `profile.findUnique()`
- learner pathway lookups
- entitlement lookups

Primary duplicate pattern:

1. Route calls `getProtectedRouteSession()` or `requireSubscriberSession()`.
2. Entitlement resolution calls `getUserAccess(userId)`.
3. The page/API then calls `prisma.user.findUnique()` again for `learnerPath`, `country`, `tier`, `measurementPreference`, `examDate`, or study settings.

## Remediated Surfaces

| Surface | Before User/Profile Reads | After User/Profile Reads | Expected Savings |
|---|---:|---:|---:|
| Learner layout shell | 3 | 1 | Removes duplicate active-user, entitlement, exam-date, and nav metadata reads |
| `/app` dashboard | 3 | 1 | Dashboard identity/onboarding reads reuse entitlement profile row |
| `/app/flashcards` | 3 | 1 | Pathway bootstrap reuses learner activity context |
| `/app/questions` | 3 | 1 | Question-bank pathway scoping reuses learner activity context |
| `/app/study-plan` | 3 | 1 | Exam plan/adaptive fields reuse shared learner profile |
| `/app/account/study-preferences` | 3 | 1 | Preference defaults reuse shared learner profile |
| `/app/account/analytics` | 3 | 1 | Display identity/exam metadata reuse shared learner profile |
| `/app/onboarding` | 2 | 1 | Onboarding state reuses protected-session user row |
| `/app/quick-start` | 2 | 1 | Baseline completion check reuses protected-session user row |
| `/api/learner/pathway-lessons` | 3 | 1 | Removed duplicate `auth()` + `resolveEntitlement()` pass and learner-path read |
| `/api/learner/pathway-lessons/topics` | 3 | 1 | Removed duplicate subscriber gate and learner-path read |
| `/api/learner/pathway-lesson` | 3 | 1 | Removed duplicate subscriber gate and learner-path read |
| `/api/learner/personalized-study-plan` | 2 | 1 | Study-plan learner path reuses activity context |
| `/api/learner/engagement-nudges` | 2 | 1 | Exam date and learner path reuse shared user row |
| `/api/learner/activity-warm-cache` | 2 | 1 | Warm-cache fallback path uses activity context |
| `/api/learner/study-budget` | 2 | 1 | Study budget GET reuses shared user row |
| `/api/learner/exam-plan` | 2 | 1 | Exam plan GET reuses shared user row |
| `/api/learner/study-settings` | 2 | 1 | Study settings GET reuses shared user row |
| `/api/learner/email-engagement-prefs` | 2 | 1 | Email preference GET reuses shared user row |
| Baseline assessment status/questions/submit | 2 | 1 | Baseline state reads reuse shared user row |
| Coach/adaptive/guided study loaders | 2-3 | 1 | Study budget, exam plan, and display profile reads reuse shared user row |

## Shared Contexts Added

### Request User Context

`loadLearnerRequestUser(userId)` is a React server `cache()` wrapper around a single bounded `prisma.user.findUnique()` select.

It now covers:

- identity: `email`, `name`, `firstName`, `lastName`, `displayName`
- routing: `learnerPath`, `targetExamPathwayId`, `country`, `tier`, `alliedProfessionKey`
- entitlement/trial fields: `trialStatus`, `trialEndsAt`, `role`
- preferences: `measurementPreference`, study settings, engagement opt-out
- exam plan: `examDate`, `examDatePlanType`, `examGoalSetAt`, `studyCadencePreference`
- learner state: onboarding and baseline assessment flags

### Learner Activity Context

`loadLearnerActivityContext(userId)` now derives from `loadLearnerRequestUser(userId)` and remains cached. It returns only the fields activity routes need:

- `learnerPath`
- `country`
- `tier`
- `alliedProfessionKey`
- `measurementPreference`

### Entitlement Context

`getUserAccess(userId)` now reuses `loadLearnerRequestUser(userId)` instead of issuing a separate user lookup before subscription checks.

## Remaining Direct User Reads

These were intentionally left as direct reads because they are write-path, sensitive, or account-management specific rather than repeated learner context:

| Location | Reason |
|---|---|
| `src/app/api/learner/personal-profile/route.ts` PATCH | Reads current region/tier immediately before a profile write and subscription lock validation |
| `src/lib/learner/load-billing-page-payload.ts` | Requires billing/security-specific fields such as password credential state |
| `src/lib/learner/load-account-hub-snapshot.ts` | Requires account security fields and subscription bundle assembly |
| `src/app/(app)/app/(learner)/account/overview/page.tsx` | Account overview reads billing/security profile fields not safe to add to the global learner context |
| `src/app/api/learner/account/oauth-disconnect/route.ts` | OAuth security mutation path |
| `src/app/api/learner/pre-nursing-plan/route.ts` | Pre-nursing write/read path with update-adjacent profile reads |
| `src/lib/learner/increment-bank-questions-graded-today.ts` | Transaction-local read inside an update transaction |

## Expected Impact

Highest-traffic learner routes now avoid 1-2 redundant user/profile queries per request.

Estimated savings:

- Learner shell pages: 2 fewer `User.findUnique` operations on most authenticated navigations.
- Lesson API routes: 2 fewer auth/entitlement/user-context passes per request.
- Study and analytics pages: 1-2 fewer profile reads before expensive dashboard/adaptive work begins.
- Dashboard and activity loaders: shared pathway/exam/preference data instead of repeated narrow selects.

This does not change learner behavior, scoring, entitlement logic, CAT logic, or route response shapes.

## Verification

Static audit after remediation:

- Remaining `prisma.user.findUnique()` calls in learner scope are limited to direct security/account/write-path exceptions plus the shared request loader.
- Core learner routing, entitlement, and activity pages now consume `loadLearnerRequestUser()` or `loadLearnerActivityContext()`.

