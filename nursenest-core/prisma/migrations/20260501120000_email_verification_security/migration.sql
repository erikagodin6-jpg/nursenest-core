-- AlterTable: add security and verification fields to User
ALTER TABLE "User" ADD COLUMN "normalizedEmail" TEXT;
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "authProvider" VARCHAR(32) NOT NULL DEFAULT 'credentials';
ALTER TABLE "User" ADD COLUMN "signupIp" VARCHAR(64);
ALTER TABLE "User" ADD COLUMN "lastLoginIp" VARCHAR(64);
ALTER TABLE "User" ADD COLUMN "lastLoginAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_normalizedEmail_idx" ON "User"("normalizedEmail");

-- Backfill normalizedEmail from existing email (lowercase)
UPDATE "User" SET "normalizedEmail" = LOWER(TRIM("email")) WHERE "normalizedEmail" IS NULL;

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Personalization: name fields
ALTER TABLE "User" ADD COLUMN "firstName" VARCHAR(100);
ALTER TABLE "User" ADD COLUMN "lastName" VARCHAR(100);
ALTER TABLE "User" ADD COLUMN "displayName" VARCHAR(200);

-- Backfill firstName from existing name (first word)
UPDATE "User" SET "firstName" = SPLIT_PART(TRIM("name"), ' ', 1) WHERE "firstName" IS NULL AND "name" IS NOT NULL AND TRIM("name") <> '';
