-- AlterTable: E-E-A-T attribution fields for public blog bylines (YMYL).
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "authorDisplayName" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "authorCredentials" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "authorBio" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "medicalReviewerName" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "medicalReviewerCredentials" TEXT;
