-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyQuestionGoal" INTEGER,
ADD COLUMN     "bankQuestionsGradedUtcDay" DATE,
ADD COLUMN     "bankQuestionsGradedCount" INTEGER NOT NULL DEFAULT 0;
