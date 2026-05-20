DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LocalizedBlogStatus') THEN
    CREATE TYPE "LocalizedBlogStatus" AS ENUM (
      'DRAFT',
      'AI_GENERATED',
      'AI_ADAPTED',
      'PENDING_REVIEW',
      'APPROVED',
      'SCHEDULED',
      'PUBLISHED',
      'REJECTED'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BlogAdaptationType') THEN
    CREATE TYPE "BlogAdaptationType" AS ENUM (
      'ORIGINAL',
      'TRANSLATED',
      'ADAPTED',
      'LOCALIZED_REWRITE',
      'MARKET_EXPANSION'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "LocalizedBlogArticle" (
  "id" TEXT NOT NULL,
  "canonicalArticleId" TEXT NOT NULL,
  "locale" VARCHAR(10) NOT NULL,
  "region" VARCHAR(32) NOT NULL,
  "profession" VARCHAR(32),
  "exam" VARCHAR(48),
  "sourceLanguage" VARCHAR(10) NOT NULL DEFAULT 'en',
  "adaptationType" "BlogAdaptationType" NOT NULL DEFAULT 'ADAPTED',
  "contentStatus" "LocalizedBlogStatus" NOT NULL DEFAULT 'DRAFT',
  "aiModelVersion" VARCHAR(64),
  "aiPromptVersion" VARCHAR(32),
  "localizedTitle" TEXT NOT NULL,
  "localizedExcerpt" TEXT NOT NULL,
  "localizedBody" TEXT NOT NULL,
  "canonicalSlug" VARCHAR(200) NOT NULL,
  "localizedSlug" VARCHAR(200) NOT NULL,
  "localizedMetaTitle" TEXT,
  "localizedMetaDescription" TEXT,
  "seoKeywordPrimary" TEXT,
  "seoKeywordSecondary" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "searchIntent" VARCHAR(48),
  "hreflangJson" JSONB,
  "canonicalUrl" TEXT,
  "targetAudience" VARCHAR(64),
  "ctaVariant" VARCHAR(48),
  "ctaText" TEXT,
  "ctaHref" TEXT,
  "internalLinkTargets" JSONB,
  "complianceReviewRequired" BOOLEAN NOT NULL DEFAULT false,
  "medicalReviewRequired" BOOLEAN NOT NULL DEFAULT false,
  "editorialReviewRequired" BOOLEAN NOT NULL DEFAULT true,
  "reviewFlags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "editorialNotes" TEXT,
  "publishedAt" TIMESTAMP(3),
  "scheduledAt" TIMESTAMP(3),
  "rejectedAt" TIMESTAMP(3),
  "rejectionReason" TEXT,
  "generationLog" JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LocalizedBlogArticle_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "LocalizedBlogArticle_contentStatus_scheduledAt_idx"
  ON "LocalizedBlogArticle"("contentStatus", "scheduledAt");

CREATE INDEX IF NOT EXISTS "LocalizedBlogArticle_region_locale_contentStatus_idx"
  ON "LocalizedBlogArticle"("region", "locale", "contentStatus");

CREATE INDEX IF NOT EXISTS "LocalizedBlogArticle_canonicalArticleId_idx"
  ON "LocalizedBlogArticle"("canonicalArticleId");

CREATE INDEX IF NOT EXISTS "LocalizedBlogArticle_localizedSlug_idx"
  ON "LocalizedBlogArticle"("localizedSlug");

CREATE INDEX IF NOT EXISTS "LocalizedBlogArticle_createdAt_idx"
  ON "LocalizedBlogArticle"("createdAt");

CREATE UNIQUE INDEX IF NOT EXISTS "LocalizedBlogArticle_canonicalArticleId_locale_region_key"
  ON "LocalizedBlogArticle"("canonicalArticleId", "locale", "region");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'LocalizedBlogArticle_canonicalArticleId_fkey'
  ) THEN
    ALTER TABLE "LocalizedBlogArticle"
      ADD CONSTRAINT "LocalizedBlogArticle_canonicalArticleId_fkey"
      FOREIGN KEY ("canonicalArticleId")
      REFERENCES "BlogPost"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;
