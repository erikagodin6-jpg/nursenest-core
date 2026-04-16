-- CreateEnum
CREATE TYPE "InlineContentKind" AS ENUM ('PLAIN', 'RICH_HTML');

-- CreateTable
CREATE TABLE "inline_content_entries" (
    "key" VARCHAR(512) NOT NULL,
    "body" TEXT NOT NULL,
    "kind" "InlineContentKind" NOT NULL DEFAULT 'PLAIN',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" TEXT,

    CONSTRAINT "inline_content_entries_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "inline_content_entries_updated_at_idx" ON "inline_content_entries"("updated_at");

-- AddForeignKey
ALTER TABLE "inline_content_entries" ADD CONSTRAINT "inline_content_entries_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
