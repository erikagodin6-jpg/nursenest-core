-- CreateEnum
CREATE TYPE "TrialStatus" AS ENUM ('NONE', 'ACTIVE', 'EXPIRED', 'EXHAUSTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "trialStatus" "TrialStatus" NOT NULL DEFAULT 'NONE';
ALTER TABLE "User" ADD COLUMN "trialUsedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "trialStartedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "trialEndsAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "TrialDeviceBinding" (
    "id" TEXT NOT NULL,
    "fingerprintHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrialDeviceBinding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrialDeviceBinding_fingerprintHash_key" ON "TrialDeviceBinding"("fingerprintHash");

-- AddForeignKey
ALTER TABLE "TrialDeviceBinding" ADD CONSTRAINT "TrialDeviceBinding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
