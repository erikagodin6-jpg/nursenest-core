# Friend Invite & Referral Rewards System

## Scope

Implemented a referral lifecycle that sits beside the existing social study/friend ecosystem. Friend codes and challenges remain privacy-safe study features; referral rewards now track acquisition, qualification, paid conversion, fraud review, and configurable reward rules.

## User Flow

1. Existing learner opens `Invite Friends` from `/app/account/social`.
2. NurseNest creates a unique referral code and referral link.
3. Invited friend signs up through `/signup?ref=CODE` or submits the code through the signup form payload.
4. System records one attribution row for the referred account.
5. Referral progresses only when the referred learner verifies email, completes onboarding, and starts at least one learning activity.
6. Paid subscription conversion is tracked separately for premium reward rules.

## Qualification Rules

Rewards are not granted for clicks or account creation alone.

Required for qualified referral:

- Account created
- Email verified
- Onboarding completed
- First learning activity recorded

Premium conversion:

- First active paid subscription through Stripe checkout webhook

## Data Model

Migration:

`prisma/migrations/20260529143000_referral_rewards_system/migration.sql`

New tables:

- `referral_codes`
- `referral_attributions`
- `referral_reward_rules`
- `referral_reward_grants`
- `referral_fraud_signals`
- `referral_events`

## Surfaces

Learner:

- `/app/account/social`
- New `Invite Friends` card with friend code, referral link, referral counts, recent referrals, and earned rewards.

Admin:

- `/admin/referrals`
- Rule creation, rule enable/disable, top referrers, manual reward grants, recent rewards, conversion metrics, and fraud review queue.

## Abuse Protection

Implemented signals:

- Self-referral attempt
- Duplicate normalized email
- Shared signup IP
- Referral loop and duplicate-device enums prepared for future signals

Rewards are generated from referral attribution rows with uniqueness constraints to prevent duplicate rewards for the same rule/referrer/attribution.

## Existing Friend Ecosystem Audit

Already present:

- Friend code generation: `SocialInviteCode`
- Friend lookup/connect: `/api/learner/social/connect`
- Friend requests: `SocialConnection`
- Acceptance/rejection/removal/blocking: `/api/learner/social/friends/[connectionId]`
- Privacy controls: `/app/account/social`
- Score/readiness comparison: `/api/learner/social/compare/[friendUserId]`
- Leaderboards: `/api/learner/social/groups/[groupId]/leaderboard`
- Challenges: `/api/learner/social/challenges`
- Notifications: `/api/learner/social/notifications`

New in this pass:

- Referral attribution
- Reward qualification
- Configurable reward rules
- Paid-conversion tracking
- Admin referral management
- Learner referral dashboard

## Verification

Added contract coverage:

`src/lib/referrals/referral-rewards.contract.test.ts`

The test verifies:

- Rewards require verified/onboarded/active qualification gates.
- Signup, email verification, onboarding, activity, and Stripe subscription paths are wired.
- Learner and admin surfaces are discoverable.
- Referral schema includes attribution, rewards, fraud signals, and audit events.
