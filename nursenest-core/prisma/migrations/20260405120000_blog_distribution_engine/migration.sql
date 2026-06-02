-- Blog distribution: scheduling, SEO fields, lesson/question/tool links (no markdown-only blog).

CREATE TYPE "BlogPostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED');
CREATE TYPE "BlogPostTemplate" AS ENUM ('HOW_TO_PASS', 'TOPIC_EXPLAINED', 'TOP_MISTAKES', 'PRACTICE_QUESTIONS', 'STUDY_PLAN');

ALTER TABLE "BlogPost" ADD COLUMN "postStatus" "BlogPostStatus" NOT NULL DEFAULT 'DRAFT';
ALTER TABLE "BlogPost" ADD COLUMN "publishAt" TIMESTAMP(3);
ALTER TABLE "BlogPost" ADD COLUMN "exam" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "seoTitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "seoDescription" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "postTemplate" "BlogPostTemplate";
ALTER TABLE "BlogPost" ADD COLUMN "relatedLessonPaths" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "BlogPost" ADD COLUMN "relatedQuestionIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "BlogPost" ADD COLUMN "relatedTools" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "BlogPost" SET "postStatus" = 'PUBLISHED' WHERE "published" = true;
UPDATE "BlogPost" SET "postStatus" = 'DRAFT' WHERE "published" = false;

ALTER TABLE "BlogPost" DROP COLUMN "published";

DROP INDEX IF EXISTS "BlogPost_published_createdAt_idx";
CREATE INDEX "BlogPost_postStatus_publishAt_idx" ON "BlogPost"("postStatus", "publishAt");
CREATE INDEX "BlogPost_createdAt_idx" ON "BlogPost"("createdAt");
