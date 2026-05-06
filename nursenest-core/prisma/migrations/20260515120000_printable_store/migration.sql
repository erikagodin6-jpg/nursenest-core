-- CreateEnum
CREATE TYPE "PrintableDownloadSource" AS ENUM ('LEARNER', 'ADMIN_PREVIEW', 'PURCHASE', 'SUBSCRIPTION');

-- CreateEnum
CREATE TYPE "PrintableAccessSource" AS ENUM ('PURCHASE', 'SUBSCRIPTION', 'ADMIN_GRANT', 'FREE');

-- CreateTable
CREATE TABLE "printable_products" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "title" VARCHAR(512) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(128) NOT NULL,
    "pathway_id" VARCHAR(64) NOT NULL,
    "role_track" VARCHAR(64) NOT NULL,
    "file_asset_id" TEXT NOT NULL,
    "thumbnail_asset_id" TEXT,
    "price_cents" INTEGER NOT NULL DEFAULT 0,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'usd',
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "is_premium_included" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by_user_id" TEXT,
    "updated_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "printable_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "printable_download_events" (
    "id" TEXT NOT NULL,
    "printable_product_id" TEXT NOT NULL,
    "user_id" TEXT,
    "pathway_id" VARCHAR(64),
    "source" "PrintableDownloadSource" NOT NULL,
    "downloaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_agent_hash" VARCHAR(128),
    "ip_hash" VARCHAR(128),

    CONSTRAINT "printable_download_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "printable_accesses" (
    "id" TEXT NOT NULL,
    "printable_product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "source" "PrintableAccessSource" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "printable_accesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "printable_products_slug_key" ON "printable_products"("slug");

-- CreateIndex
CREATE INDEX "printable_products_pathway_id_idx" ON "printable_products"("pathway_id");

-- CreateIndex
CREATE INDEX "printable_products_is_published_idx" ON "printable_products"("is_published");

-- CreateIndex
CREATE INDEX "printable_products_category_idx" ON "printable_products"("category");

-- CreateIndex
CREATE INDEX "printable_download_events_printable_product_id_downloaded_at_idx" ON "printable_download_events"("printable_product_id", "downloaded_at");

-- CreateIndex
CREATE INDEX "printable_download_events_user_id_idx" ON "printable_download_events"("user_id");

-- CreateIndex
CREATE INDEX "printable_download_events_source_idx" ON "printable_download_events"("source");

-- CreateIndex
CREATE INDEX "printable_accesses_user_id_printable_product_id_idx" ON "printable_accesses"("user_id", "printable_product_id");

-- CreateIndex
CREATE INDEX "printable_accesses_printable_product_id_source_idx" ON "printable_accesses"("printable_product_id", "source");

-- AddForeignKey
ALTER TABLE "printable_products" ADD CONSTRAINT "printable_products_file_asset_id_fkey" FOREIGN KEY ("file_asset_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printable_products" ADD CONSTRAINT "printable_products_thumbnail_asset_id_fkey" FOREIGN KEY ("thumbnail_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printable_products" ADD CONSTRAINT "printable_products_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printable_products" ADD CONSTRAINT "printable_products_updated_by_user_id_fkey" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printable_download_events" ADD CONSTRAINT "printable_download_events_printable_product_id_fkey" FOREIGN KEY ("printable_product_id") REFERENCES "printable_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printable_download_events" ADD CONSTRAINT "printable_download_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printable_accesses" ADD CONSTRAINT "printable_accesses_printable_product_id_fkey" FOREIGN KEY ("printable_product_id") REFERENCES "printable_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printable_accesses" ADD CONSTRAINT "printable_accesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
