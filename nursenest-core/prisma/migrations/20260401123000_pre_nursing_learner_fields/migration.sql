-- CreateEnum
CREATE TYPE "PreNursingDatePlanType" AS ENUM ('UNSURE', 'PROPOSED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "preNursingTargetDate" TIMESTAMP(3),
ADD COLUMN "preNursingDatePlanType" "PreNursingDatePlanType",
ADD COLUMN "preNursingGoalSetAt" TIMESTAMP(3),
ADD COLUMN "preNursingFuturePathwayHint" VARCHAR(16);
