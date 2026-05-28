/**
 * Export ECG category manifest — rhythm categories, question counts, lesson mappings.
 *
 * Writes to:
 *   {STUDY_PUBLISHED_SNAPSHOT_DIR}/ecg/manifest-categories.json
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots \
 *     npx tsx scripts/study-snapshots/export-ecg-manifests.mts
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

export interface EcgManifestPayload {
  totalEcgQuestions: number;
  rhythmCategoryBreakdown: { category: string; count: number }[];
  ecgLessonCount: number;
  ecgFlashcardCount: number;
}

async function main(): Promise<void> {
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
  if (!baseDir) { console.error("STUDY_PUBLISHED_SNAPSHOT_DIR is required"); process.exit(1); }

  const useSpaces = spacesConfigured();

  // ECG questions are tagged with module='ecg' or topic contains 'ecg'
  const [ecgQuestionCount, byCategory, ecgLessonCount, ecgFlashcardCount] = await Promise.all([
    prisma.examQuestion.count({
      where: {
        status: "published",
        OR: [
          { module: "ecg" },
          { topic: { contains: "ecg", mode: "insensitive" } },
          { tags: { array_contains: "ecg" } },
        ],
      },
    }),
    prisma.examQuestion.groupBy({
      by: ["topic"],
      where: {
        status: "published",
        OR: [
          { module: "ecg" },
          { topic: { contains: "ecg", mode: "insensitive" } },
        ],
      },
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
      take: 30,
    }),
    prisma.contentItem.count({
      where: {
        status: "published",
        OR: [
          { topic: { contains: "ecg", mode: "insensitive" } },
          { topicSlug: { contains: "ecg", mode: "insensitive" } },
        ],
      },
    }),
    prisma.flashcardDeck.count({
      where: {
        OR: [
          { title: { contains: "ecg", mode: "insensitive" } },
          { examFamily: { contains: "ecg", mode: "insensitive" } },
        ],
      },
    }).catch(() => 0),
  ]);

  const payload: EcgManifestPayload = {
    totalEcgQuestions: ecgQuestionCount,
    rhythmCategoryBreakdown: byCategory.map((g) => ({
      category: g.topic ?? "Uncategorized",
      count: g._count._all,
    })),
    ecgLessonCount,
    ecgFlashcardCount,
  };

  const envelope: StudyPublishedSnapshotEnvelope<EcgManifestPayload> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "ecg_manifest",
    version: process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const relDir = path.join(baseDir, "ecg");
  await mkdir(relDir, { recursive: true });
  const filePath = path.join(relDir, "manifest-categories.json");
  await writeFile(filePath, JSON.stringify(envelope), "utf8");
  console.log(`[ecg-manifests] Wrote ${filePath} (${ecgQuestionCount} ECG questions)`);

  if (useSpaces) await uploadSnapshotToSpaces(filePath, "ecg/manifest-categories.json");

  await touchStudySnapshotManifest(baseDir, "ecg_manifest");
}

main().catch((e) => { console.error("[ecg-manifests] Fatal:", e); process.exit(1); });
