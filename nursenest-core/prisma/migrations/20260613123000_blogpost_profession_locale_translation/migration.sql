-- Shared nursing + allied blog dimensions for profession, locale, and translation lifecycle.
ALTER TABLE "BlogPost"
ADD COLUMN "careerSlug" TEXT,
ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN "translationGroupId" TEXT,
ADD COLUMN "sourceLocale" TEXT,
ADD COLUMN "isAutoTranslated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "translationSource" TEXT,
ADD COLUMN "canonicalPostId" TEXT;

ALTER TABLE "BlogPost"
ADD CONSTRAINT "BlogPost_canonicalPostId_fkey"
FOREIGN KEY ("canonicalPostId") REFERENCES "BlogPost"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "BlogPost_careerSlug_locale_postStatus_publishAt_idx"
ON "BlogPost"("careerSlug", "locale", "postStatus", "publishAt");

CREATE INDEX "BlogPost_translationGroupId_locale_idx"
ON "BlogPost"("translationGroupId", "locale");

CREATE INDEX "BlogPost_canonicalPostId_idx"
ON "BlogPost"("canonicalPostId");
