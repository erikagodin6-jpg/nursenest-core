-- OAuth provider subject bindings (immutable provider account IDs for collision-safe linking)
CREATE TABLE IF NOT EXISTS "oauth_provider_links" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "provider" VARCHAR(16) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  "emailSnapshot" VARCHAR(320),
  "isApplePrivateRelay" BOOLEAN NOT NULL DEFAULT false,
  "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSignInAt" TIMESTAMP(3),
  CONSTRAINT "oauth_provider_links_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "oauth_provider_links_provider_providerAccountId_key"
  ON "oauth_provider_links"("provider", "providerAccountId");

CREATE INDEX IF NOT EXISTS "oauth_provider_links_userId_idx" ON "oauth_provider_links"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'oauth_provider_links_userId_fkey'
  ) THEN
    ALTER TABLE "oauth_provider_links"
      ADD CONSTRAINT "oauth_provider_links_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
