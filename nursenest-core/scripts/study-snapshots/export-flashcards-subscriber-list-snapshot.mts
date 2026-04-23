/**
 * Export subscriber flashcard list page (matches GET /api/flashcards body shape) for DB failover.
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots npx tsx scripts/study-snapshots/export-flashcards-subscriber-list-snapshot.mts <tier> <country> <locale> <page> <pageSize>
 *
 * Example:
 *   ... RN_STANDARD US en 1 24
 */
import "../stub-server-only.cjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CountryCode, TierCode } from "@prisma/client";

import type { StudyPublishedSnapshotEnvelope } from "../../src/lib/study-content-failover/study-published-snapshot-types";
import type { FlashcardsSubscriberListSnapshotPayload } from "../../src/lib/study-content-failover/flashcards-list-snapshot-read";
import { flashcardAccessWhere } from "../../src/lib/entitlements/content-access-scope";
import type { AccessScope } from "../../src/lib/entitlements/user-access-types";
import { prisma } from "../../src/lib/db";
import { touchStudySnapshotManifest } from "./study-snapshot-manifest-touch.mts";

async function main(): Promise<void> {
  const [, , tierRaw, countryRaw, localeRaw, pageStr, sizeStr] = process.argv;
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
  if (!baseDir) {
    console.error("STUDY_PUBLISHED_SNAPSHOT_DIR is required");
    process.exit(1);
  }
  if (!tierRaw || !countryRaw || !localeRaw || !pageStr || !sizeStr) {
    console.error(
      "Usage: export-flashcards-subscriber-list-snapshot.mts <tier> <country> <locale> <page> <pageSize>",
    );
    process.exit(1);
  }
  const page = Math.max(1, Number(pageStr) || 1);
  const pageSize = Math.min(60, Math.max(8, Number(sizeStr) || 24));
  const skip = (page - 1) * pageSize;

  const scope: AccessScope = {
    hasAccess: true,
    reason: "active_subscription",
    tier: tierRaw as TierCode,
    country: countryRaw as CountryCode,
    alliedCareer: null,
  };

  const where = flashcardAccessWhere(scope);
  const [flashcards, total] = await Promise.all([
    prisma.flashcard.findMany({
      where,
      select: {
        id: true,
        front: true,
        back: true,
        examFamily: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.flashcard.count({ where }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const payload: FlashcardsSubscriberListSnapshotPayload = {
    page,
    pageSize,
    total,
    pageCount,
    flashcards: flashcards.map((c) => ({
      id: c.id,
      front: c.front,
      back: c.back,
      examFamily: c.examFamily,
      category: { name: c.category.name, slug: c.category.slug },
    })),
  };

  const version = process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`;
  const envelope: StudyPublishedSnapshotEnvelope<FlashcardsSubscriberListSnapshotPayload> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "flashcards_subscriber_list",
    version,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const tier = tierRaw.replace(/[^a-z0-9_-]/gi, "_").slice(0, 32);
  const country = countryRaw.replace(/[^a-z0-9_-]/gi, "_").slice(0, 16);
  const locale = localeRaw.replace(/[^a-z0-9_-]/gi, "_").slice(0, 16);
  const relDir = path.join(baseDir, "flashcards");
  await mkdir(relDir, { recursive: true });
  const filePath = path.join(relDir, `subscriber-list-${tier}-${country}-${locale}.json`);
  await writeFile(filePath, JSON.stringify(envelope, null, 2), "utf8");
  await touchStudySnapshotManifest(baseDir, "flashcards_subscriber_list");
  console.log(`Wrote ${filePath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
