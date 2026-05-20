-- AlterTable
ALTER TABLE "User" ADD COLUMN "alliedProfessionKey" VARCHAR(64);

-- CreateIndex
CREATE INDEX "User_alliedProfessionKey_idx" ON "User"("alliedProfessionKey");
