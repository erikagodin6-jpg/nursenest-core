-- Localized display overlays for canonical English educational content (questions, pathway lessons, flashcards).
-- Grading and CAT use core `exam_questions` rows; overlays are display-only.

CREATE TYPE "EducationalTranslationSourceKind" AS ENUM (
  'EXAM_QUESTION',
  'PATHWAY_LESSON',
  'FLASHCARD_DECK',
  'FLASHCARD',
  'FLASHCARD_TAG'
);

CREATE TYPE "EducationalTranslationStatus" AS ENUM (
  'DRAFT',
  'REVIEWED',
  'PUBLISHED'
);

CREATE TABLE "educational_translation_overlays" (
  "id" TEXT NOT NULL,
  "source_kind" "EducationalTranslationSourceKind" NOT NULL,
  "source_id" VARCHAR(512) NOT NULL,
  "locale" VARCHAR(32) NOT NULL,
  "status" "EducationalTranslationStatus" NOT NULL DEFAULT 'DRAFT',
  "payload" JSONB NOT NULL,
  "reviewed_at" TIMESTAMP(3),
  "published_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "educational_translation_overlays_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "educational_translation_overlays_source_kind_source_id_locale_key"
  ON "educational_translation_overlays" ("source_kind", "source_id", "locale");

CREATE INDEX "educational_translation_overlays_locale_status_source_kind_idx"
  ON "educational_translation_overlays" ("locale", "status", "source_kind");

CREATE INDEX "educational_translation_overlays_source_kind_status_idx"
  ON "educational_translation_overlays" ("source_kind", "status");
