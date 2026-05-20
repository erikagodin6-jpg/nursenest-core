-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "kind" VARCHAR(16) NOT NULL DEFAULT 'image',
    "fileSizeBytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altText" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "uploadedById" TEXT,
    "usageRefCount" INTEGER,
    "usageRefs" JSONB,
    "usageScannedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_publicUrl_key" ON "media_assets"("publicUrl");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_storageKey_key" ON "media_assets"("storageKey");

-- CreateIndex
CREATE INDEX "media_assets_createdAt_idx" ON "media_assets"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "media_assets_kind_idx" ON "media_assets"("kind");

-- CreateIndex
CREATE INDEX "media_assets_mimeType_idx" ON "media_assets"("mimeType");

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
