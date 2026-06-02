ALTER TYPE "ReferralRewardTrigger" ADD VALUE IF NOT EXISTS 'SIGNUP_ATTRIBUTED';
ALTER TYPE "ReferralRewardKind" ADD VALUE IF NOT EXISTS 'FIRST_MONTH_DISCOUNT';
ALTER TYPE "ReferralRewardKind" ADD VALUE IF NOT EXISTS 'PREMIUM_TRIAL';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ReferralRewardRecipient') THEN
    CREATE TYPE "ReferralRewardRecipient" AS ENUM ('REFERRER', 'FRIEND', 'BOTH');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ReferralAmbassadorStatus') THEN
    CREATE TYPE "ReferralAmbassadorStatus" AS ENUM ('NONE', 'AMBASSADOR', 'ELITE_AMBASSADOR');
  END IF;
END $$;

ALTER TABLE "referral_codes"
  ADD COLUMN IF NOT EXISTS "click_count" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "last_clicked_at" TIMESTAMP(3);

ALTER TABLE "referral_attributions"
  ADD COLUMN IF NOT EXISTS "first_landing_path" VARCHAR(512),
  ADD COLUMN IF NOT EXISTS "signup_path" VARCHAR(512),
  ADD COLUMN IF NOT EXISTS "utm_source" VARCHAR(120),
  ADD COLUMN IF NOT EXISTS "utm_medium" VARCHAR(120),
  ADD COLUMN IF NOT EXISTS "utm_campaign" VARCHAR(160);

ALTER TABLE "referral_reward_rules"
  ADD COLUMN IF NOT EXISTS "recipient" "ReferralRewardRecipient" NOT NULL DEFAULT 'REFERRER',
  ADD COLUMN IF NOT EXISTS "discount_percent" INTEGER;

ALTER TABLE "referral_reward_grants"
  ADD COLUMN IF NOT EXISTS "recipient" "ReferralRewardRecipient" NOT NULL DEFAULT 'REFERRER',
  ADD COLUMN IF NOT EXISTS "discount_percent" INTEGER;

DROP INDEX IF EXISTS "referral_reward_grants_rule_id_referrer_user_id_attribution_id_key";
CREATE UNIQUE INDEX IF NOT EXISTS "referral_reward_grants_rule_referrer_attr_recipient_key"
  ON "referral_reward_grants"("rule_id", "referrer_user_id", "attribution_id", "recipient");

CREATE TABLE IF NOT EXISTS "referral_clicks" (
  "id" TEXT NOT NULL,
  "referral_code_id" TEXT,
  "display_code" VARCHAR(32) NOT NULL,
  "landing_path" VARCHAR(512),
  "referrer_url" VARCHAR(1024),
  "utm_source" VARCHAR(120),
  "utm_medium" VARCHAR(120),
  "utm_campaign" VARCHAR(160),
  "session_hash" VARCHAR(128),
  "ip_hash" VARCHAR(128),
  "user_agent_hash" VARCHAR(128),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "referral_clicks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "referral_ambassador_profiles" (
  "user_id" TEXT NOT NULL,
  "status" "ReferralAmbassadorStatus" NOT NULL DEFAULT 'NONE',
  "paid_referral_count" INTEGER NOT NULL DEFAULT 0,
  "qualified_referral_count" INTEGER NOT NULL DEFAULT 0,
  "unlocked_at" TIMESTAMP(3),
  "elite_unlocked_at" TIMESTAMP(3),
  "featured_community_profile" BOOLEAN NOT NULL DEFAULT false,
  "early_feature_access" BOOLEAN NOT NULL DEFAULT false,
  "priority_support" BOOLEAN NOT NULL DEFAULT false,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "referral_ambassador_profiles_pkey" PRIMARY KEY ("user_id")
);

CREATE INDEX IF NOT EXISTS "referral_reward_rules_recipient_enabled_idx" ON "referral_reward_rules"("recipient", "enabled");
CREATE INDEX IF NOT EXISTS "referral_clicks_referral_code_id_created_at_idx" ON "referral_clicks"("referral_code_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "referral_clicks_display_code_created_at_idx" ON "referral_clicks"("display_code", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "referral_clicks_utm_source_created_at_idx" ON "referral_clicks"("utm_source", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "referral_ambassador_profiles_status_paid_referral_count_idx" ON "referral_ambassador_profiles"("status", "paid_referral_count");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'referral_clicks_referral_code_id_fkey'
  ) THEN
    ALTER TABLE "referral_clicks"
      ADD CONSTRAINT "referral_clicks_referral_code_id_fkey"
      FOREIGN KEY ("referral_code_id") REFERENCES "referral_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'referral_ambassador_profiles_user_id_fkey'
  ) THEN
    ALTER TABLE "referral_ambassador_profiles"
      ADD CONSTRAINT "referral_ambassador_profiles_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
