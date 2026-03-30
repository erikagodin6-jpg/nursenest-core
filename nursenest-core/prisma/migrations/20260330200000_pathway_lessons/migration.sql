-- Pathway-scoped marketing lessons (DB-first loader; catalog.json fallback per pathway).

CREATE TABLE "pathway_lessons" (
    "id" TEXT NOT NULL,
    "pathway_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "topic_slug" TEXT NOT NULL,
    "body_system" TEXT NOT NULL,
    "preview_section_count" INTEGER NOT NULL DEFAULT 1,
    "seo_title" TEXT NOT NULL,
    "seo_description" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "country_code" "CountryCode",
    "tier_code" "TierCode",
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pathway_lessons_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pathway_lessons_pathway_id_slug_key" ON "pathway_lessons"("pathway_id", "slug");
CREATE INDEX "pathway_lessons_pathway_id_status_sort_order_idx" ON "pathway_lessons"("pathway_id", "status", "sort_order");
