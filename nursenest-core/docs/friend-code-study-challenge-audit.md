# Friend Code and Study Challenge Ecosystem Audit

Date: 2026-05-29

## Scope

Audited repository references for `friend`, `friends`, `friendCode`, `challenge`, `leaderboard`, `social`, `studyBuddy`, `compare`, `competition`, and `invite` across app code, Prisma schema, tests, and marketing content.

Marketing advertises social study on the homepage through `PremiumSocialStudy`: Friend Challenge Codes, Score Comparisons, Classrooms & Groups, Privacy Controls, and Motivation Without Pressure.

## Executive Status

| Feature | Status | User exposure | Database support | API support |
| --- | --- | --- | --- | --- |
| Friend code generation | Implemented and working | Dashboard card and `/app/account/social` | `social_invite_codes` | `GET/POST/PATCH /api/learner/social/invite-code` |
| Friend code lookup | Implemented and working | Dashboard code entry | `social_invite_codes`, `social_groups` | `POST /api/learner/social/connect` |
| Friend requests | Implemented and working | `/app/account/social` Friends panel | `social_connections` | `GET /api/learner/social/friends`, `POST /api/learner/social/connect` |
| Friend acceptance/rejection | Implemented and working | `/app/account/social` Friends panel | `social_connections.status` | `PATCH /api/learner/social/friends/[connectionId]` |
| Friend removal/blocking | Implemented and working | `/app/account/social` Friends panel | `REMOVED`, `BLOCKED` statuses | `PATCH /api/learner/social/friends/[connectionId]` |
| Privacy controls | Implemented and working | `/app/account/social` | `social_privacy_settings` | `GET/PATCH /api/learner/social/privacy` |
| Score comparison | Implemented and exposed | `/app/account/social` Compare action | `social_stat_snapshots` | `GET /api/learner/social/compare/[friendUserId]` |
| Study analytics comparison | Implemented and exposed | `/app/account/social` Compare action | `social_stat_snapshots` populated from existing learner profile/readiness/topic data | `GET /api/learner/social/compare/[friendUserId]` |
| Leaderboards | Implemented and exposed | `/app/account/social` Groups panel | `social_groups`, `social_group_memberships`, `social_stat_snapshots` | `GET /api/learner/social/groups/[groupId]/leaderboard` |
| Challenge system | Implemented and exposed | `/app/account/social` Create challenge panel | `social_challenges`, `social_challenge_participants` | `GET/POST /api/learner/social/challenges`, `PATCH /api/learner/social/challenges/[challengeId]` |
| Notifications | Partially implemented | `/app/account/social` Social notifications panel | Derived from social tables | `GET /api/learner/social/notifications` |
| Mobile responsiveness | Implemented and covered by smoke test | Dashboard and `/app/account/social` | Not applicable | Playwright paid-user smoke |

## Implemented And Working

### Friend Code System

- `generateSocialInviteCode` creates a unique display code and stores only the SHA-256 hash for lookup.
- `disableSocialInviteCode` disables a user-owned code.
- `connectWithSocialCode` supports both friend invite codes and group/classroom codes.
- The learner dashboard exposes code copy/regeneration and a join-code entry point.
- The social settings page exposes code creation, disabling, and sharing guidance.

### Friend Requests And Friend Management

- `connectWithSocialCode` creates `PENDING` `SocialConnection` rows.
- `acceptSocialConnection` updates a connection to `ACCEPTED`.
- The connection route supports `accept`, `decline`, `remove`, and `block`.
- The Friends panel now shows incoming/outgoing status, accepted friends, and actions for accept, decline, compare, remove, and block.
- API responses now normalize each row with `direction` and `otherUser.displayName`, without exposing email addresses.

### Privacy Controls

- Privacy settings are backed by `social_privacy_settings`.
- Learners can enable/disable social study, hide stats, pause visibility, choose visibility scope, select visible stat ranges, opt into leaderboards, and allow friend/group challenges.
- `resolveVisibleSocialStats` enforces social enabled, hidden stats, paused visibility, visibility scope, accepted-friend relationship, and visible stat keys before returning stats.

### Challenges

- Challenge creation supports friend participants, title, prompt, expiry, and challenge type.
- Challenge participant updates support accepted, declined, completed, and cancelled states.
- The UI now exposes flashcard sprint, question challenge, weak-area recovery, weekly streak challenge, and CAT/readiness challenge labels.
- The schema does not have a dedicated `CAT_CHALLENGE` enum. The existing `READINESS_IMPROVEMENT` type is used for CAT/readiness-oriented challenges.

### Groups And Leaderboards

- Learners can create private groups, join by code, leave groups, and view privacy-gated leaderboards.
- Admin classroom routes exist for staff/classroom management.
- Leaderboard entries are only returned for active group members who have opted in and have visible stats.

## Partially Implemented

### Study Analytics Comparison

The comparison API and UI exist. This pass added `refreshSocialStatSnapshots`, which builds privacy-safe social ranges from existing learner profile, readiness history, and weak-topic data before compare and leaderboard reads. This keeps comparisons populated without exposing raw scores or personal study details.

### Notifications

The new notifications endpoint derives in-app notifications from existing immutable social tables:

- incoming friend request
- accepted friend connection
- pending challenge invite
- friend completed challenge

There is no persisted notification table, push notification channel, or email notification implementation in this pass.

## Implemented But Previously Hidden

The following capabilities existed in service/API/schema layers but were not discoverable enough from the learner UI:

- friend list and pending request management
- accepted-friend score comparison
- challenge creation and completion updates
- group creation, group code display, leave group
- leaderboard loading
- social update notifications

These are now surfaced from `/app/account/social`.

## Advertised But Missing Before This Pass

Homepage social marketing advertised score comparisons, private study challenges, and classroom/group experiences. Before this pass, the dashboard mostly exposed invite code generation and settings navigation; the richer controls were either API-only or not obvious. The social settings page now exposes the advertised learner actions.

## UI Locations

| Surface | File | Route |
| --- | --- | --- |
| Marketing social study section | `src/components/marketing/home/premium-social-study.tsx` | Homepage |
| Dashboard social card | `src/components/student/social-study-dashboard-card.tsx` | `/app` |
| Social settings page | `src/app/(app)/app/(learner)/account/social/page.tsx` | `/app/account/social` |
| Social settings client | `src/components/student/social-study-settings-client.tsx` | `/app/account/social` |

## API Routes

Learner routes:

- `GET /api/learner/social/invite-code`
- `POST /api/learner/social/invite-code`
- `PATCH /api/learner/social/invite-code`
- `POST /api/learner/social/connect`
- `GET /api/learner/social/friends`
- `PATCH /api/learner/social/friends/[connectionId]`
- `GET /api/learner/social/privacy`
- `PATCH /api/learner/social/privacy`
- `GET /api/learner/social/compare/[friendUserId]`
- `GET /api/learner/social/challenges`
- `POST /api/learner/social/challenges`
- `PATCH /api/learner/social/challenges/[challengeId]`
- `GET /api/learner/social/groups`
- `POST /api/learner/social/groups`
- `POST /api/learner/social/groups/join`
- `DELETE /api/learner/social/groups/[groupId]/membership`
- `GET /api/learner/social/groups/[groupId]/leaderboard`
- `GET /api/learner/social/notifications`

Admin routes:

- `GET /api/admin/social/classrooms`
- `POST /api/admin/social/classrooms`
- `PATCH /api/admin/social/classrooms/[groupId]`

## Database Schema Used

No new schema or migration was required. Existing migration:

- `prisma/migrations/20260510090000_add_social_study_system/migration.sql`

Existing Prisma models:

- `SocialPrivacySetting`
- `SocialInviteCode`
- `SocialConnection`
- `SocialGroup`
- `SocialGroupMembership`
- `SocialChallenge`
- `SocialChallengeParticipant`
- `SocialStatSnapshot`

Key indexes already exist for invite lookup, connection status, group membership, challenge participant status, challenge expiry/status, and stat snapshot lookup.

## Files Updated In This Pass

- `src/app/api/learner/social/friends/route.ts`
- `src/app/api/learner/social/compare/[friendUserId]/route.ts`
- `src/app/api/learner/social/groups/[groupId]/leaderboard/route.ts`
- `src/app/api/learner/social/notifications/route.ts`
- `src/lib/social-study/refresh-social-stat-snapshots.ts`
- `src/components/student/social-study-settings-client.tsx`
- `tests/e2e/paid-user/learner-dashboard-social-study.spec.ts`
- `docs/friend-code-study-challenge-audit.md`

## Validation

Automated checks:

- `node --import tsx --test src/lib/social-study/social-study.test.ts`
- `npx tsc --noEmit --pretty false`

Playwright coverage:

- `tests/e2e/paid-user/learner-dashboard-social-study.spec.ts` verifies dashboard social study visibility, theme switching across Ocean, Blossom, Midnight, Sunset, Aurora, mobile overflow protection, and the social settings surfaces for friend code, friends, challenges, groups/leaderboards, and notifications.
- Local command result: `npx playwright test tests/e2e/paid-user/learner-dashboard-social-study.spec.ts --project=chromium` registered the test and skipped it because paid E2E credentials were not present.

Manual authenticated screenshots were not captured in this environment because paid learner credentials and a live seeded social graph were not available to this run.

## Remaining Follow-Ups

- Optionally move social snapshot refresh from on-demand compare/leaderboard reads into an async activity/update job if usage volume requires it.
- Add persisted notification delivery if product requirements expand beyond derived in-app updates.
- Add a two-account Playwright functional journey when QA fixtures include two paid learner accounts: generate code, connect, accept, compare, create challenge, complete challenge, and verify notification.
