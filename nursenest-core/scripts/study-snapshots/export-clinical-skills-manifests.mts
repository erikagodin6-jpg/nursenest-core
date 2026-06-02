/**
 * Export clinical skills (OSCE station) category manifests.
 * Generates pre-computed station counts and competency breakdowns.
 *
 * Writes to:
 *   {STUDY_PUBLISHED_SNAPSHOT_DIR}/clinical-skills/manifest-categories.json
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots \
 *     npx tsx scripts/study-snapshots/export-clinical-skills-manifests.mts
 */
import "../stub-server-only.cjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { prisma } from "../../src/lib/db";
import type { StudyPublishedSnapshotEnvelope } from "../../src/lib/study-content-failover/study-published-snapshot-types";
import { touchStudySnapshotManifest } from "./study-snapshot-manifest-touch.mts";
import {
  uploadSnapshotToSpaces,
  spacesConfigured,
} from "./lib/s3-snapshot-uploader.mts";

export interface ClinicalSkillsManifestPayload {
  totalStations: number;
  publishedStations: number;
  competencyBreakdown: { competencyCategory: string; count: number }[];
  difficultyBreakdown: { difficulty: string | null; count: number }[];
}

async function main(): Promise<void> {
  const { tmpdir } = await import("node:os");
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim() || tmpdir();

  const useSpaces = spacesConfigured();

  const [totalStations, publishedStations, byCategory, byDifficulty] = await Promise.all([
    prisma.osceStation.count(),
    prisma.osceStation.count({ where: { isPublished: true } }),
    prisma.osceStation.groupBy({
      by: ["competencyCategory"],
      where: { isPublished: true },
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
      take: 50,
    }),
    prisma.osceStation.groupBy({
      by: ["difficulty"],
      where: { isPublished: true },
      _count: { _all: true },
    }).catch(() => [] as { difficulty: string | null; _count: { _all: number } }[]),
  ]);

  const payload: ClinicalSkillsManifestPayload = {
    totalStations,
    publishedStations,
    competencyBreakdown: byCategory.map((g) => ({
      competencyCategory: g.competencyCategory ?? "Uncategorized",
      count: g._count._all,
    })),
    difficultyBreakdown: byDifficulty.map((g) => ({
      difficulty: (g as { difficulty: string | null }).difficulty ?? null,
      count: g._count._all,
    })),
  };

  const envelope: StudyPublishedSnapshotEnvelope<ClinicalSkillsManifestPayload> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "clinical_skills_manifest",
    version: process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const relDir = path.join(baseDir, "clinical-skills");
  await mkdir(relDir, { recursive: true });
  const filePath = path.join(relDir, "manifest-categories.json");
  await writeFile(filePath, JSON.stringify(envelope), "utf8");
  console.log(`[clinical-skills] Wrote ${filePath} (${publishedStations} published stations)`);

  if (useSpaces) await uploadSnapshotToSpaces(filePath, "clinical-skills/manifest-categories.json");

  await touchStudySnapshotManifest(baseDir, "clinical_skills_manifest");
}

main().catch((e) => { console.error("[clinical-skills] Fatal:", e); process.exit(1); });
