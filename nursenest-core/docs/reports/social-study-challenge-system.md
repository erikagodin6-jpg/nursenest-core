# Social Study Challenge System

## Summary

Implemented a privacy-first Social Study layer for optional friend connections, friendly challenges, informal groups, and staff/admin-created classrooms. The feature is additive and keeps learner stats private by default; shared responses use sanitized snapshots and never expose answers, private notes, billing/subscription status, email, or exact profile data.

Figma design checkpoint: https://www.figma.com/design/OyVyMQcddvNtBUL4Uts8pB

## Schema Changes

Added Prisma enums:

- `SocialVisibilityScope`
- `SocialStatKey`
- `SocialConnectionStatus`
- `SocialChallengeType`
- `SocialChallengeStatus`
- `SocialGroupKind`
- `SocialGroupRole`
- `SocialCodeAudience`

Added Prisma models:

- `SocialPrivacySetting`
- `SocialInviteCode`
- `SocialConnection`
- `SocialChallenge`
- `SocialChallengeParticipant`
- `SocialGroup`
- `SocialGroupMembership`
- `SocialStatSnapshot`

Migration:

- `prisma/migrations/20260510090000_add_social_study_system/migration.sql`

The migration is additive only and includes indexes for code lookup, user/status lists, memberships, challenge expiry/status, and snapshot reads.

## Routes And APIs

Learner routes:

- `GET/PATCH /api/learner/social/privacy`
- `GET/POST/PATCH /api/learner/social/invite-code`
- `POST /api/learner/social/connect`
- `GET /api/learner/social/friends`
- `PATCH /api/learner/social/friends/[connectionId]`
- `GET/POST /api/learner/social/challenges`
- `PATCH /api/learner/social/challenges/[challengeId]`
- `GET/POST /api/learner/social/groups`
- `POST /api/learner/social/groups/join`
- `GET /api/learner/social/groups/[groupId]/leaderboard`
- `DELETE /api/learner/social/groups/[groupId]/membership`
- `GET /api/learner/social/compare/[friendUserId]`

Admin routes:

- `GET/POST /api/admin/social/classrooms`
- `PATCH /api/admin/social/classrooms/[groupId]`

Learner routes use subscriber/session enforcement and private no-store headers. Classroom routes use existing `requireAdmin` server-side enforcement.

## Privacy Model

Defaults:

- Social features disabled.
- Stats hidden.
- Visibility private.
- No stat keys selected.
- Leaderboard opt-in off.
- Challenge opt-ins off.

Visibility requires all relevant gates: social enabled, stats not hidden, not paused, selected stat key, correct audience scope, accepted friendship or active group membership, and no blocked/removed relationship. Shared stats are bucketed into ranges or bands.

Explicit exclusions:

- No full exam answers.
- No private notes.
- No billing or subscription status.
- No email exposure.
- No exact personal profile data.
- No public searchable leaderboard.

## Dashboard And Account UI

Added:

- `Study With Friends` dashboard card with invite code, copy, regenerate, join-code form, privacy indicator, and challenge summary.
- `/app/account/social` page with controls for social enablement, stats hidden state, visibility scope, visible stat keys, invite code regeneration/disable, friend/group challenge opt-ins, and leaderboard opt-in.
- Settings hub link to the social privacy page.

The UI uses existing semantic/theme tokens and learner surface classes, with mobile-first wrapping controls and no hardcoded product hex colors.

## Tests Run

Passing:

- `npm run db:generate`
- `node --import tsx --test src/lib/social-study/social-study.test.ts`
- `npm run typecheck:critical`
- `ReadLints` on edited service, API, dashboard, and account social files

Added E2E spec:

- `tests/e2e/paid-user/learner-dashboard-social-study.spec.ts`

Not run in this pass:

- Focused Playwright social spec, because the targeted validation already covered type/schema/service correctness and the Playwright suite requires paid E2E credentials/runtime.

## Risks And Follow-Ups

- The Figma tool returned a headless file URL for the created frames; the original file creation URL is recorded above for review.
- Truthpack files were not present in this checkout, so implementation relied on the current application source, Prisma schema, and route conventions as source of truth.
- The first iteration includes API/UI foundation and service coverage. Deeper production rollout should add analytics events, richer friend/challenge management UI, and a classroom roster admin screen.
- Migration SQL was created manually after schema validation and should be reviewed before deployment.
