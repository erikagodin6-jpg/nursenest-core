-- SEO content engine: campaigns, queue items, workflow, references/image metadata.

ALTER TYPE "BlogPostTemplate" ADD VALUE IF NOT EXISTS 'EXAM_GUIDE';
ALTER TYPE "BlogPostTemplate" ADD VALUE IF NOT EXISTS 'MEDICATION_REVIEW';
ALTER TYPE "BlogPostTemplate" ADD VALUE IF NOT EXISTS 'LAB_VALUES_GUIDE';
ALTER TYPE "BlogPostTemplate" ADD VALUE IF NOT EXISTS 'DISEASE_PROCESS_EXPLAINER';
ALTER TYPE "BlogPostTemplate" ADD VALUE IF NOT EXISTS 'PRIORITIZATION_ARTICLE';
ALTER TYPE "BlogPostTemplate" ADD VALUE IF NOT EXISTS 'COMPARISON_ARTICLE';
ALTER TYPE "BlogPostTemplate" ADD VALUE IF NOT EXISTS 'CHECKLIST_ARTICLE';
ALTER TYPE "BlogPostTemplate" ADD VALUE IF NOT EXISTS 'FAQ_STYLE';
ALTER TYPE "BlogPostTemplate" ADD VALUE IF NOT EXISTS 'GLOSSARY';

CREATE TYPE "BlogPostIntent" AS ENUM (
  'INFORMATIONAL',
  'EXAM_PREP',
  'STUDY_STRATEGY',
  'COMPARISON',
  'CONVERSION',
  'PRACTICE_QUESTIONS',
  'CHECKLIST',
  'CONCEPT_EXPLAINER'
);

CREATE TYPE "BlogFunnelStage" AS ENUM ('AWARENESS', 'CONSIDERATION', 'CONVERSION', 'RETENTION');

CREATE TYPE "BlogWorkflowStatus" AS ENUM (
  'OUTLINE_READY',
  'GENERATED',
  'NEEDS_SOURCE_REVIEW',
  'NEEDS_MEDICAL_REVIEW',
  'NEEDS_SEO_REVIEW',
  'APPROVED',
  'SCHEDULED',
  'PUBLISHED',
  'STALE',
  'FAILED_GENERATION',
  'FAILED_IMAGE',
  'NEEDS_METADATA',
  'NEEDS_REFERENCES'
);

CREATE TYPE "BlogCampaignStatus" AS ENUM ('DRAFT', 'QUEUED', 'RUNNING', 'PAUSED', 'COMPLETED', 'FAILED');
CREATE TYPE "BlogCampaignItemStatus" AS ENUM ('QUEUED', 'GENERATING', 'GENERATED', 'FAILED', 'SCHEDULED', 'PUBLISHED');
CREATE TYPE "BlogImageStatus" AS ENUM ('NONE', 'REQUESTED', 'GENERATED', 'FAILED');

CREATE TABLE "BlogCampaign" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "keywordCluster" TEXT NOT NULL,
  "targetExam" TEXT,
  "targetProfession" TEXT,
  "targetPathway" TEXT,
  "countryTarget" "CountryCode",
  "desiredPostCount" INTEGER NOT NULL,
  "postsPerWeek" INTEGER,
  "preferredWeekdays" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  "startDate" TIMESTAMP(3),
  "templateMix" "BlogPostTemplate"[] DEFAULT ARRAY[]::"BlogPostTemplate"[],
  "intentMix" "BlogPostIntent"[] DEFAULT ARRAY[]::"BlogPostIntent"[],
  "funnelStage" "BlogFunnelStage",
  "includeImages" BOOLEAN NOT NULL DEFAULT false,
  "includeAiImages" BOOLEAN NOT NULL DEFAULT false,
  "requireReferences" BOOLEAN NOT NULL DEFAULT false,
  "status" "BlogCampaignStatus" NOT NULL DEFAULT 'DRAFT',
  "progressJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BlogCampaign_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BlogCampaignItem" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "ordinal" INTEGER NOT NULL,
  "status" "BlogCampaignItemStatus" NOT NULL DEFAULT 'QUEUED',
  "plannedKeyword" TEXT,
  "plannedTitle" TEXT,
  "plannedSlug" TEXT,
  "plannedPublishAt" TIMESTAMP(3),
  "preferredTemplate" "BlogPostTemplate",
  "preferredIntent" "BlogPostIntent",
  "preferredFunnel" "BlogFunnelStage",
  "includeImage" BOOLEAN NOT NULL DEFAULT false,
  "includeAiImage" BOOLEAN NOT NULL DEFAULT false,
  "postId" TEXT,
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BlogCampaignItem_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "BlogPost" ADD COLUMN "campaignId" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "targetKeyword" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "keywordCluster" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "countryTarget" "CountryCode";
ALTER TABLE "BlogPost" ADD COLUMN "intent" "BlogPostIntent";
ALTER TABLE "BlogPost" ADD COLUMN "funnelStage" "BlogFunnelStage";
ALTER TABLE "BlogPost" ADD COLUMN "workflowStatus" "BlogWorkflowStatus" NOT NULL DEFAULT 'GENERATED';
ALTER TABLE "BlogPost" ADD COLUMN "outlineJson" JSONB;
ALTER TABLE "BlogPost" ADD COLUMN "keyQuestions" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "BlogPost" ADD COLUMN "keywordPlan" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "BlogPost" ADD COLUMN "internalLinkPlan" JSONB;
ALTER TABLE "BlogPost" ADD COLUMN "ctaType" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "ctaText" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "ctaHref" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "titleAlternates" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "BlogPost" ADD COLUMN "clickTitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "metaTitleVariant" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "metaDescriptionVariant" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "featuredSnippet" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "keyTakeaways" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "BlogPost" ADD COLUMN "faqBlock" JSONB;
ALTER TABLE "BlogPost" ADD COLUMN "definitionBox" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "checklistBlock" JSONB;
ALTER TABLE "BlogPost" ADD COLUMN "quickReferenceBlock" JSONB;
ALTER TABLE "BlogPost" ADD COLUMN "sourceReliabilityScore" INTEGER;
ALTER TABLE "BlogPost" ADD COLUMN "sourcesJson" JSONB;
ALTER TABLE "BlogPost" ADD COLUMN "apaReferences" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "BlogPost" ADD COLUMN "requiresReferences" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "BlogPost" ADD COLUMN "medicalRiskFlags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "BlogPost" ADD COLUMN "reviewDueAt" TIMESTAMP(3);
ALTER TABLE "BlogPost" ADD COLUMN "lastReviewedAt" TIMESTAMP(3);
ALTER TABLE "BlogPost" ADD COLUMN "coverImageAlt" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "coverImageCaption" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "coverImagePrompt" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "imageStyleType" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "imageStatus" "BlogImageStatus" NOT NULL DEFAULT 'NONE';
ALTER TABLE "BlogPost" ADD COLUMN "socialCaption" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "emailTeaser" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "shortSummary" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "promoBlurb" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "schemaSummary" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "perfImpressions" INTEGER;
ALTER TABLE "BlogPost" ADD COLUMN "perfClicks" INTEGER;
ALTER TABLE "BlogPost" ADD COLUMN "perfCtr" DOUBLE PRECISION;
ALTER TABLE "BlogPost" ADD COLUMN "perfInternalClicks" INTEGER;
ALTER TABLE "BlogPost" ADD COLUMN "perfConversionAssists" INTEGER;
ALTER TABLE "BlogPost" ADD COLUMN "perfSubscriptionAssists" INTEGER;
ALTER TABLE "BlogPost" ADD COLUMN "updateNeeded" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "BlogPost" ADD COLUMN "rankingNote" TEXT;

CREATE INDEX "BlogCampaign_status_startDate_idx" ON "BlogCampaign"("status", "startDate");
CREATE INDEX "BlogCampaign_keywordCluster_idx" ON "BlogCampaign"("keywordCluster");
CREATE UNIQUE INDEX "BlogCampaignItem_campaignId_ordinal_key" ON "BlogCampaignItem"("campaignId", "ordinal");
CREATE INDEX "BlogCampaignItem_campaignId_status_ordinal_idx" ON "BlogCampaignItem"("campaignId", "status", "ordinal");
CREATE INDEX "BlogCampaignItem_plannedPublishAt_idx" ON "BlogCampaignItem"("plannedPublishAt");
CREATE INDEX "BlogPost_campaignId_postStatus_publishAt_idx" ON "BlogPost"("campaignId", "postStatus", "publishAt");
CREATE INDEX "BlogPost_targetKeyword_idx" ON "BlogPost"("targetKeyword");
CREATE INDEX "BlogPost_keywordCluster_idx" ON "BlogPost"("keywordCluster");
CREATE INDEX "BlogPost_workflowStatus_idx" ON "BlogPost"("workflowStatus");

ALTER TABLE "BlogPost"
ADD CONSTRAINT "BlogPost_campaignId_fkey"
FOREIGN KEY ("campaignId") REFERENCES "BlogCampaign"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "BlogCampaignItem"
ADD CONSTRAINT "BlogCampaignItem_campaignId_fkey"
FOREIGN KEY ("campaignId") REFERENCES "BlogCampaign"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BlogCampaignItem"
ADD CONSTRAINT "BlogCampaignItem_postId_fkey"
FOREIGN KEY ("postId") REFERENCES "BlogPost"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
