CREATE TYPE "ReferralQualificationStatus" AS ENUM (
  'ACCOUNT_CREATED',
  'EMAIL_VERIFIED',
  'ONBOARDED',
  'ACTIVE',
  'QUALIFIED',
  'SUBSCRIBED',
  'REJECTED',
  'FRAUD_REVIEW'
);

CREATE TYPE "ReferralRewardTrigger" AS ENUM (
  'QUALIFIED_REFERRAL_COUNT',
  'PAID_REFERRAL_COUNT',
  'MANUAL'
);

CREATE TYPE "ReferralRewardKind" AS ENUM (
  'FREE_DAYS',
  'FREE_MONTH',
  'ACCOUNT_CREDIT',
  'FEATURE_UNLOCK',
  'AMBASSADOR_STATUS',
  'MANUAL'
);

CREATE TYPE "ReferralRewardStatus" AS ENUM (
  'PENDING',
  'GRANTED',
  'REVOKED'
);

CREATE TYPE "ReferralFraudSignalType" AS ENUM (
  'SELF_REFERRAL',
  'DUPLICATE_NORMALIZED_EMAIL',
  'SHARED_SIGNUP_IP',
  'REFERRAL_LOOP',
  'DUPLICATE_DEVICE',
  'MANUAL_REVIEW'
);

CREATE TABLE "referral_codes" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "code_hash" VARCHAR(128) NOT NULL,
  "display_code" VARCHAR(32) NOT NULL,
  "referral_link" VARCHAR(512),
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "disabled_at" TIMESTAMP(3),
  CONSTRAINT "referral_codes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "referral_attributions" (
  "id" TEXT NOT NULL,
  "referrer_user_id" TEXT NOT NULL,
  "referred_user_id" TEXT NOT NULL,
  "referral_code_id" TEXT,
  "referral_code_display" VARCHAR(32) NOT NULL,
  "referral_link" VARCHAR(512),
  "status" "ReferralQualificationStatus" NOT NULL DEFAULT 'ACCOUNT_CREATED',
  "email_verified_at" TIMESTAMP(3),
  "onboarding_completed_at" TIMESTAMP(3),
  "first_activity_at" TIMESTAMP(3),
  "qualified_at" TIMESTAMP(3),
  "first_subscribed_at" TIMESTAMP(3),
  "rejected_at" TIMESTAMP(3),
  "rejection_reason" VARCHAR(500),
  "signup_ip_hash" VARCHAR(128),
  "device_hash" VARCHAR(128),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "referral_attributions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "referral_reward_rules" (
  "id" TEXT NOT NULL,
  "name" VARCHAR(160) NOT NULL,
  "description" VARCHAR(800),
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "trigger" "ReferralRewardTrigger" NOT NULL,
  "threshold" INTEGER NOT NULL DEFAULT 1,
  "reward_kind" "ReferralRewardKind" NOT NULL,
  "reward_value" INTEGER,
  "feature_key" VARCHAR(96),
  "duration_days" INTEGER,
  "created_by_user_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "referral_reward_rules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "referral_reward_grants" (
  "id" TEXT NOT NULL,
  "rule_id" TEXT,
  "attribution_id" TEXT,
  "referrer_user_id" TEXT NOT NULL,
  "recipient_user_id" TEXT NOT NULL,
  "status" "ReferralRewardStatus" NOT NULL DEFAULT 'PENDING',
  "reward_kind" "ReferralRewardKind" NOT NULL,
  "reward_value" INTEGER,
  "feature_key" VARCHAR(96),
  "duration_days" INTEGER,
  "reason" VARCHAR(240) NOT NULL,
  "granted_at" TIMESTAMP(3),
  "granted_by_user_id" TEXT,
  "revoked_at" TIMESTAMP(3),
  "revoke_reason" VARCHAR(500),
  "meta" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "referral_reward_grants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "referral_fraud_signals" (
  "id" TEXT NOT NULL,
  "attribution_id" TEXT,
  "subject_user_id" TEXT NOT NULL,
  "type" "ReferralFraudSignalType" NOT NULL,
  "severity" VARCHAR(32) NOT NULL DEFAULT 'review',
  "detail" VARCHAR(800) NOT NULL,
  "resolved_at" TIMESTAMP(3),
  "reviewed_by_user_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "referral_fraud_signals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "referral_events" (
  "id" TEXT NOT NULL,
  "attribution_id" TEXT,
  "user_id" TEXT,
  "event_type" VARCHAR(80) NOT NULL,
  "meta" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "referral_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "referral_codes_code_hash_key" ON "referral_codes"("code_hash");
CREATE UNIQUE INDEX "referral_codes_display_code_key" ON "referral_codes"("display_code");
CREATE INDEX "referral_codes_user_id_enabled_idx" ON "referral_codes"("user_id", "enabled");
CREATE INDEX "referral_codes_enabled_created_at_idx" ON "referral_codes"("enabled", "created_at");

CREATE UNIQUE INDEX "referral_attributions_referred_user_id_key" ON "referral_attributions"("referred_user_id");
CREATE INDEX "referral_attributions_referrer_user_id_status_created_at_idx" ON "referral_attributions"("referrer_user_id", "status", "created_at" DESC);
CREATE INDEX "referral_attributions_status_qualified_at_idx" ON "referral_attributions"("status", "qualified_at");
CREATE INDEX "referral_attributions_first_subscribed_at_idx" ON "referral_attributions"("first_subscribed_at");

CREATE INDEX "referral_reward_rules_enabled_trigger_threshold_idx" ON "referral_reward_rules"("enabled", "trigger", "threshold");
CREATE UNIQUE INDEX "referral_reward_grants_rule_id_referrer_user_id_attribution_id_key" ON "referral_reward_grants"("rule_id", "referrer_user_id", "attribution_id");
CREATE INDEX "referral_reward_grants_referrer_user_id_status_created_at_idx" ON "referral_reward_grants"("referrer_user_id", "status", "created_at" DESC);
CREATE INDEX "referral_reward_grants_recipient_user_id_status_created_at_idx" ON "referral_reward_grants"("recipient_user_id", "status", "created_at" DESC);
CREATE INDEX "referral_fraud_signals_subject_user_id_created_at_idx" ON "referral_fraud_signals"("subject_user_id", "created_at" DESC);
CREATE INDEX "referral_fraud_signals_type_created_at_idx" ON "referral_fraud_signals"("type", "created_at" DESC);
CREATE INDEX "referral_fraud_signals_resolved_at_idx" ON "referral_fraud_signals"("resolved_at");
CREATE INDEX "referral_events_attribution_id_created_at_idx" ON "referral_events"("attribution_id", "created_at" DESC);
CREATE INDEX "referral_events_event_type_created_at_idx" ON "referral_events"("event_type", "created_at" DESC);
CREATE INDEX "referral_events_user_id_created_at_idx" ON "referral_events"("user_id", "created_at" DESC);

ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "referral_attributions" ADD CONSTRAINT "referral_attributions_referrer_user_id_fkey" FOREIGN KEY ("referrer_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "referral_attributions" ADD CONSTRAINT "referral_attributions_referred_user_id_fkey" FOREIGN KEY ("referred_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "referral_attributions" ADD CONSTRAINT "referral_attributions_referral_code_id_fkey" FOREIGN KEY ("referral_code_id") REFERENCES "referral_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "referral_reward_rules" ADD CONSTRAINT "referral_reward_rules_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "referral_reward_grants" ADD CONSTRAINT "referral_reward_grants_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "referral_reward_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "referral_reward_grants" ADD CONSTRAINT "referral_reward_grants_attribution_id_fkey" FOREIGN KEY ("attribution_id") REFERENCES "referral_attributions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "referral_reward_grants" ADD CONSTRAINT "referral_reward_grants_referrer_user_id_fkey" FOREIGN KEY ("referrer_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "referral_reward_grants" ADD CONSTRAINT "referral_reward_grants_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "referral_reward_grants" ADD CONSTRAINT "referral_reward_grants_granted_by_user_id_fkey" FOREIGN KEY ("granted_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "referral_fraud_signals" ADD CONSTRAINT "referral_fraud_signals_attribution_id_fkey" FOREIGN KEY ("attribution_id") REFERENCES "referral_attributions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "referral_fraud_signals" ADD CONSTRAINT "referral_fraud_signals_subject_user_id_fkey" FOREIGN KEY ("subject_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "referral_fraud_signals" ADD CONSTRAINT "referral_fraud_signals_reviewed_by_user_id_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "referral_events" ADD CONSTRAINT "referral_events_attribution_id_fkey" FOREIGN KEY ("attribution_id") REFERENCES "referral_attributions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
