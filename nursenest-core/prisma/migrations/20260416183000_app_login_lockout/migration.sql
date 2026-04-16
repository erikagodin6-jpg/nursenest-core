-- Progressive login lockout rows (shared across horizontally scaled instances).
CREATE TABLE "app_login_lockout" (
    "id" VARCHAR(128) NOT NULL,
    "failures" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMPTZ(6),
    "last_failure_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "app_login_lockout_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "app_login_lockout_locked_until_idx" ON "app_login_lockout"("locked_until");
