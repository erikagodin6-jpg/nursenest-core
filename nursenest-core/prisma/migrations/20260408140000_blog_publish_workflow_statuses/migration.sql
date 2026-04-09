-- Blog publish workflow: editorial queue statuses + admin activity log (JSON array).

ALTER TYPE "BlogPostStatus" ADD VALUE 'NEEDS_REVIEW';
ALTER TYPE "BlogPostStatus" ADD VALUE 'APPROVED';
ALTER TYPE "BlogPostStatus" ADD VALUE 'FAILED';

ALTER TABLE "BlogPost" ADD COLUMN "adminPublishLog" JSONB NOT NULL DEFAULT '[]'::jsonb;
