CREATE TABLE "app_rate_limit_bucket" (
    "id" VARCHAR(128) NOT NULL,
    "count" INTEGER NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "app_rate_limit_bucket_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "app_rate_limit_bucket_expires_at_idx" ON "app_rate_limit_bucket"("expires_at");
