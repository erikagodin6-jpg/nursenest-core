/**
 * Export default published exam row (matches `resolveDefaultExamForUser` selection) for DB failover.
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots npx tsx scripts/study-snapshots/export-practice-exams-default-exam-snapshot.mts <country> <tier>
 */
import "../stub-server-only.cjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ContentStatus, type CountryCode, type TierCode } from "@prisma/client";

import { accessibleTiersForUserTier } from "../../src/lib/entitlements/content-access-scope";
import type { StudyPublishedSnapshotEnvelope } from "../../src/lib/study-content-failover/study-published-snapshot-types";
import type { DefaultPublishedExamSnapshotPayload } from "../../src/lib/study-content-failover/practice-exams-published-snapshot-read";
import { prisma } from "../../src/lib/db";
import { touchStudySnapshotManifest } from "./study-snapshot-manifest-touch.mts";

async function main(): Promise<void> {
  const [, , countryRaw, tierRaw] = process.argv;
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
  if (!baseDir) {
    console.error("STUDY_PUBLISHED_SNAPSHOT_DIR is required");
    process.exit(1);
  }
  if (!countryRaw || !tierRaw) {
    console.error("Usage: export-practice-exams-default-exam-snapshot.mts <country> <tier>");
    process.exit(1);
  }
  const country = countryRaw as CountryCode;
  const tier = tierRaw as TierCode;
  const tiers = accessibleTiersForUserTier(tier);

  const exact = await prisma.exam.findFirst({
    where: { status: ContentStatus.PUBLISHED, country, tier },
    select: { id: true, title: true },
  });
  const exam =
    exact ??
    (await prisma.exam.findFirst({
      where: { status: ContentStatus.PUBLISHED, country, tier: { in: tiers } },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true },
    }));

  const version = process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`;
  const envelope: StudyPublishedSnapshotEnvelope<DefaultPublishedExamSnapshotPayload> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "practice_exams_default",
    version,
    capturedAt: new Date().toISOString(),
    payload: { exam },
  };

  const countrySeg = countryRaw.replace(/[^a-z0-9_-]/gi, "_").slice(0, 8);
  const tierSeg = tierRaw.replace(/[^a-z0-9_-]/gi, "_").slice(0, 24);
  const relDir = path.join(baseDir, "practice-exams");
  await mkdir(relDir, { recursive: true });
  const filePath = path.join(relDir, `default-exam-${countrySeg}-${tierSeg}.json`);
  await writeFile(filePath, JSON.stringify(envelope, null, 2), "utf8");
  await touchStudySnapshotManifest(baseDir, "practice_exams_default");
  console.log(`Wrote ${filePath} (exam=${exam ? exam.id : "null"})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
