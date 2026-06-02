-- Add privacy-first social study, friend challenge, and group/classroom tables.
-- Additive only: no existing auth, entitlement, learner progress, billing, notes, or answer tables are changed.

CREATE TYPE "SocialVisibilityScope" AS ENUM ('PRIVATE', 'FRIENDS', 'GROUPS_CLASSROOMS', 'FRIENDS_AND_GROUPS', 'PAUSED');
CREATE TYPE "SocialStatKey" AS ENUM ('READINESS_BAND', 'READINESS_RANGE', 'WEEKLY_STREAK', 'PRACTICE_SCORE_RANGE', 'FLASHCARD_PROGRESS', 'WEAK_AREA_OVERLAP', 'CAT_COMPLETION');
CREATE TYPE "SocialConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED', 'REMOVED');
CREATE TYPE "SocialChallengeType" AS ENUM ('FLASHCARD_SPRINT', 'PRACTICE_QUIZ', 'WEAK_AREA_RECOVERY', 'DAILY_STREAK', 'READINESS_IMPROVEMENT');
CREATE TYPE "SocialChallengeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "SocialGroupKind" AS ENUM ('GROUP', 'CLASSROOM');
CREATE TYPE "SocialGroupRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'INSTRUCTOR');
CREATE TYPE "SocialCodeAudience" AS ENUM ('FRIEND', 'GROUP', 'CLASSROOM', 'FRIEND_OR_GROUP');

CREATE TABLE "social_privacy_settings" (
  "user_id" TEXT NOT NULL,
  "social_enabled" BOOLEAN NOT NULL DEFAULT false,
  "stats_hidden" BOOLEAN NOT NULL DEFAULT true,
  "visibility_scope" "SocialVisibilityScope" NOT NULL DEFAULT 'PRIVATE',
  "visible_stat_keys" "SocialStatKey"[] NOT NULL DEFAULT ARRAY[]::"SocialStatKey"[],
  "paused_until" TIMESTAMP(3),
  "leaderboard_opt_in" BOOLEAN NOT NULL DEFAULT false,
  "allow_friend_challenges" BOOLEAN NOT NULL DEFAULT false,
  "allow_group_challenges" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "social_privacy_settings_pkey" PRIMARY KEY ("user_id"),
  CONSTRAINT "social_privacy_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "social_invite_codes" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "code_hash" VARCHAR(128) NOT NULL,
  "display_code" VARCHAR(32) NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "audience" "SocialCodeAudience" NOT NULL DEFAULT 'FRIEND_OR_GROUP',
  "regenerated_at" TIMESTAMP(3),
  "disabled_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "social_invite_codes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "social_invite_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "social_connections" (
  "id" TEXT NOT NULL,
  "requester_user_id" TEXT NOT NULL,
  "addressee_user_id" TEXT NOT NULL,
  "status" "SocialConnectionStatus" NOT NULL DEFAULT 'PENDING',
  "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "responded_at" TIMESTAMP(3),
  "removed_at" TIMESTAMP(3),
  "blocked_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "social_connections_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "social_connections_requester_user_id_fkey" FOREIGN KEY ("requester_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "social_connections_addressee_user_id_fkey" FOREIGN KEY ("addressee_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "social_connections_not_self_check" CHECK ("requester_user_id" <> "addressee_user_id")
);

CREATE TABLE "social_groups" (
  "id" TEXT NOT NULL,
  "kind" "SocialGroupKind" NOT NULL,
  "name" VARCHAR(160) NOT NULL,
  "description" VARCHAR(600),
  "code_hash" VARCHAR(128) NOT NULL,
  "display_code" VARCHAR(32) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "leaderboard_enabled" BOOLEAN NOT NULL DEFAULT false,
  "created_by_user_id" TEXT NOT NULL,
  "owner_user_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "social_groups_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "social_groups_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "social_groups_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "social_group_memberships" (
  "id" TEXT NOT NULL,
  "group_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "role" "SocialGroupRole" NOT NULL DEFAULT 'MEMBER',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "left_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "social_group_memberships_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "social_group_memberships_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "social_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "social_group_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "social_challenges" (
  "id" TEXT NOT NULL,
  "creator_user_id" TEXT NOT NULL,
  "group_id" TEXT,
  "type" "SocialChallengeType" NOT NULL,
  "status" "SocialChallengeStatus" NOT NULL DEFAULT 'PENDING',
  "title" VARCHAR(180) NOT NULL,
  "prompt" VARCHAR(600),
  "starts_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "social_challenges_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "social_challenges_creator_user_id_fkey" FOREIGN KEY ("creator_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "social_challenges_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "social_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "social_challenge_participants" (
  "id" TEXT NOT NULL,
  "challenge_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "status" "SocialChallengeStatus" NOT NULL DEFAULT 'PENDING',
  "accepted_at" TIMESTAMP(3),
  "declined_at" TIMESTAMP(3),
  "completed_at" TIMESTAMP(3),
  "completion_summary" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "social_challenge_participants_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "social_challenge_participants_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "social_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "social_challenge_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "social_stat_snapshots" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "audience_scope" "SocialVisibilityScope" NOT NULL,
  "stat_key" "SocialStatKey" NOT NULL,
  "value" JSONB NOT NULL,
  "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMP(3),
  CONSTRAINT "social_stat_snapshots_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "social_stat_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "social_invite_codes_code_hash_key" ON "social_invite_codes"("code_hash");
CREATE UNIQUE INDEX "social_invite_codes_display_code_key" ON "social_invite_codes"("display_code");
CREATE INDEX "social_invite_codes_user_id_enabled_idx" ON "social_invite_codes"("user_id", "enabled");
CREATE INDEX "social_invite_codes_enabled_audience_idx" ON "social_invite_codes"("enabled", "audience");
CREATE UNIQUE INDEX "social_connections_requester_user_id_addressee_user_id_key" ON "social_connections"("requester_user_id", "addressee_user_id");
CREATE INDEX "social_connections_requester_user_id_status_updated_at_idx" ON "social_connections"("requester_user_id", "status", "updated_at");
CREATE INDEX "social_connections_addressee_user_id_status_updated_at_idx" ON "social_connections"("addressee_user_id", "status", "updated_at");
CREATE UNIQUE INDEX "social_groups_code_hash_key" ON "social_groups"("code_hash");
CREATE UNIQUE INDEX "social_groups_display_code_key" ON "social_groups"("display_code");
CREATE INDEX "social_groups_kind_active_updated_at_idx" ON "social_groups"("kind", "active", "updated_at");
CREATE INDEX "social_groups_created_by_user_id_kind_idx" ON "social_groups"("created_by_user_id", "kind");
CREATE INDEX "social_groups_owner_user_id_idx" ON "social_groups"("owner_user_id");
CREATE UNIQUE INDEX "social_group_memberships_group_id_user_id_key" ON "social_group_memberships"("group_id", "user_id");
CREATE INDEX "social_group_memberships_user_id_active_updated_at_idx" ON "social_group_memberships"("user_id", "active", "updated_at");
CREATE INDEX "social_group_memberships_group_id_active_role_idx" ON "social_group_memberships"("group_id", "active", "role");
CREATE INDEX "social_privacy_settings_social_enabled_visibility_scope_idx" ON "social_privacy_settings"("social_enabled", "visibility_scope");
CREATE INDEX "social_privacy_settings_paused_until_idx" ON "social_privacy_settings"("paused_until");
CREATE INDEX "social_challenges_creator_user_id_status_updated_at_idx" ON "social_challenges"("creator_user_id", "status", "updated_at");
CREATE INDEX "social_challenges_group_id_status_expires_at_idx" ON "social_challenges"("group_id", "status", "expires_at");
CREATE INDEX "social_challenges_status_expires_at_idx" ON "social_challenges"("status", "expires_at");
CREATE UNIQUE INDEX "social_challenge_participants_challenge_id_user_id_key" ON "social_challenge_participants"("challenge_id", "user_id");
CREATE INDEX "social_challenge_participants_user_id_status_updated_at_idx" ON "social_challenge_participants"("user_id", "status", "updated_at");
CREATE INDEX "social_challenge_participants_challenge_id_status_idx" ON "social_challenge_participants"("challenge_id", "status");
CREATE INDEX "social_stat_snapshots_user_id_audience_scope_generated_at_idx" ON "social_stat_snapshots"("user_id", "audience_scope", "generated_at" DESC);
CREATE INDEX "social_stat_snapshots_user_id_stat_key_generated_at_idx" ON "social_stat_snapshots"("user_id", "stat_key", "generated_at" DESC);
CREATE INDEX "social_stat_snapshots_expires_at_idx" ON "social_stat_snapshots"("expires_at");
