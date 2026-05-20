-- AlterTable
ALTER TABLE "User" ADD COLUMN "legalPoliciesAcceptedAt" TIMESTAMP(3),
ADD COLUMN "legalPoliciesVersion" VARCHAR(32);
