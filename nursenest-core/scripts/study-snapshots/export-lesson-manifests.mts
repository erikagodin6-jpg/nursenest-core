/**
 * Export lesson count and topic-breakdown manifests for Phase 2.5 startup acceleration.
 *
 * Generates pre-computed lesson counts and topic breakdowns per (tier × country).
 * These replace prisma.contentItem.count() + GROUP BY on lesson hub cold starts.
 *
 * Writes to:
 *   {STUDY_PUBLISHED_SNAPSHOT_DIR}/lessons/manifest-{tier}-{country}.json
 *
 * Also uploads to Spaces when SPACES_* env vars are configured.
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots \
 *     npx tsx scripts/study-snapshots/export-lesson-manifests.mts
 */
import "../stub-server-only.cjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CountryCode, TierCode } from "@prisma/client";

import { prisma } from "../../src/lib/db";
import type { AccessScope } from "../../src/lib/entitlements/user-access-types";
import { lessonAccessWhere } from "../../src/lib/entitlements/content-access-scope";
import type { StudyPublishedSnapshotEnvelope } from "../../src/lib/study-content-failover/study-published-snapshot-types";
import { touchStudySnapshotManifest } from "./study-snapshot-manifest-touch.mts";
import {
  uploadSnapshotToSpaces,
  spacesConfigured,
} from "./lib/s3-snapshot-uploader.mts";
import { writeManifestToRedis, redisConfigured } from "./lib/redis-manifest-writer.mts";
import { lessonManifestKey } from "../../src/lib/server/manifest-loader";

// ─── Config ──────────────────────────────────────────────────────────────────

const MANIFEST_TARGETS = [
  { tier: "RN",  country: "CA" },
  { tier: "RN",  country: "US" },
  { tier: "RPN", country: "CA" },
  { tier: "NP",  country: "CA" },
] as const;

// First-page size stored in the manifest (replaces the most common cold-start query)
const FIRST_PAGE_SIZE = 24;

// ─── Types ───────────────────────────────────────────────────────────────────

interface LessonMetadataItem {
  id: string;
  title: string;
  slug: string | null;
  category: string | null;
  tier: string | null;
  publishedAt: string | null;
}

export interface LessonManifestPayload {
  tier: string;
  country: string;
  totalLessons: number;
  topicBreakdown: { topic: string; count: number }[];
  firstPage: LessonMetadataItem[];
  firstPageSize: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function syntheticScope(tier: string, country: string): AccessScope {
  return {
    hasAccess: true,
    reason: "active_subscription",
    tier: tier as TierCode,
    country: country as CountryCode,
    alliedCareer: null,
  };
}

function snapshotFilename(tier: string, country: string): string {
  return `manifest-${tier.toLowerCase()}-${country.toLowerCase()}.json`;
}

// ─── Export ──────────────────────────────────────────────────────────────────

async function exportLessonManifest(
  tier: string,
  country: string,
  baseDir: string,
): Promise<{ ok: boolean; filePath: string }> {
  const scope = syntheticScope(tier, country);
  const where = lessonAccessWhere(scope);

  const [totalLessons, categoryGroups, firstPageRows] = await Promise.all([
    prisma.contentItem.count({ where }),
    prisma.contentItem.groupBy({
      by: ["category"],
      where: { ...where, category: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
      take: 100,
    }),
    prisma.contentItem.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        tier: true,
        publishedAt: true,
      },
      orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
      take: FIRST_PAGE_SIZE,
    }),
  ]);

  const topicBreakdown = categoryGroups
    .filter((g) => g.category !== null)
    .map((g) => ({ topic: g.category as string, count: g._count._all }));

  const firstPage: LessonMetadataItem[] = firstPageRows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    category: r.category,
    tier: r.tier,
    publishedAt: r.publishedAt?.toISOString() ?? null,
  }));

  const payload: LessonManifestPayload = {
    tier,
    country,
    totalLessons,
    topicBreakdown,
    firstPage,
    firstPageSize: FIRST_PAGE_SIZE,
  };

  const version = process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`;
  const envelope: StudyPublishedSnapshotEnvelope<LessonManifestPayload> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "lesson_manifest",
    version,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const relDir = path.join(baseDir, "lessons");
  await mkdir(relDir, { recursive: true });
  const filename = snapshotFilename(tier, country);
  const filePath = path.join(relDir, filename);
  await writeFile(filePath, JSON.stringify(envelope), "utf8");

  return { ok: true, filePath };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { tmpdir } = await import("node:os");
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim() || tmpdir();

  const useSpaces = spacesConfigured();
  const useRedis = redisConfigured();
  if (useSpaces) console.log("[lesson-manifests] Spaces upload enabled");
  if (useRedis) console.log("[lesson-manifests] Redis warming enabled");

  let ok = 0;
  let failed = 0;

  for (const { tier, country } of MANIFEST_TARGETS) {
    const label = `${tier}/${country}`;
    try {
      const result = await exportLessonManifest(tier, country, baseDir);
      console.log(`[lesson-manifests] ${label} → ${result.filePath}`);
      ok++;

      if (useSpaces) {
        const relKey = `lessons/${snapshotFilename(tier, country)}`;
        await uploadSnapshotToSpaces(result.filePath, relKey);
      }

      if (useRedis) {
        const { readFile } = await import("node:fs/promises");
        const raw = JSON.parse(await readFile(result.filePath, "utf8")) as { payload: unknown };
        await writeManifestToRedis(lessonManifestKey(tier, country), raw.payload);
      }
    } catch (err: unknown) {
      console.error(`[lesson-manifests] FAILED ${label}:`, err);
      failed++;
    }
  }

  await touchStudySnapshotManifest(baseDir, "lesson_manifest");
  console.log(`\n[lesson-manifests] Done: ${ok} exported, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error("[lesson-manifests] Fatal:", e);
  process.exit(1);
});
