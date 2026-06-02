-- CreateTable
CREATE TABLE "content_quality_corpus_snapshots" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_quality_corpus_snapshots_pkey" PRIMARY KEY ("id")
);
