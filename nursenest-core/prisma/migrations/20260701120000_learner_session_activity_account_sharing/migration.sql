-- Soft account-sharing telemetry (hashed IP/UA only; no raw PII).

CREATE TABLE "learner_session_activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "session_key_hash" VARCHAR(64) NOT NULL,
    "user_agent_hash" VARCHAR(64) NOT NULL,
    "ip_hash" VARCHAR(64) NOT NULL,
    "region_hint" VARCHAR(8),
    "first_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "suspicious_reason" VARCHAR(240),

    CONSTRAINT "learner_session_activities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "learner_session_activities_userId_session_key_hash_key" ON "learner_session_activities"("userId", "session_key_hash");
CREATE INDEX "learner_session_activities_userId_last_seen_at_idx" ON "learner_session_activities"("userId", "last_seen_at" DESC);

ALTER TABLE "learner_session_activities" ADD CONSTRAINT "learner_session_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "learner_session_ip_observations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ip_hash" VARCHAR(64) NOT NULL,
    "region_hint" VARCHAR(8),
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learner_session_ip_observations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "learner_session_ip_observations_userId_ip_hash_key" ON "learner_session_ip_observations"("userId", "ip_hash");
CREATE INDEX "learner_session_ip_observations_userId_last_seen_at_idx" ON "learner_session_ip_observations"("userId", "last_seen_at" DESC);

ALTER TABLE "learner_session_ip_observations" ADD CONSTRAINT "learner_session_ip_observations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
