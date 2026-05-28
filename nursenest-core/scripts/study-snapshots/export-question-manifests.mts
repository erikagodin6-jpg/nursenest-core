/**
 * Export question discovery manifests for Phase 2.5 startup acceleration.
 *
 * Generates pre-computed topic/exam aggregate counts per (tier × country × pathway).
 * These replace the expensive GROUP BY queries at discovery route startup.
 *
 * Writes to:
 *   {STUDY_PUBLISHED_SNAPSHOT_DIR}/questions/discovery-{tier}-{country}-{pathway}.json
 *
 * Also uploads to Spaces when SPACES_* env vars are configured.
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots \
 *     npx tsx scripts/study-snapshots/export-question-manifests.mts
 */
import "../stub-server-only.cjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CountryCode, TierCode } from "@prisma/client";

import type { AccessScope } from "../../src/lib/entitlements/user-access-types";
import {
  loadSubscriberDiscoveryAggregates,
  type DiscoveryAggregateRow,
  type DiscoveryExamRow,
} from "../../src/lib/questions/subscriber-discovery-aggregates";
import { buildGlobalExamContext } from "../../src/lib/exam-context/exam-registry";
import type { StudyPublishedSnapshotEnvelope } from "../../src/lib/study-content-failover/study-published-snapshot-types";
import { touchStudySnapshotManifest } from "./study-snapshot-manifest-touch.mts";
import {
  uploadSnapshotToSpaces,
  spacesConfigured,
} from "./lib/s3-snapshot-uploader.mts";
import { writeManifestToRedis, redisConfigured } from "./lib/redis-manifest-writer.mts";
import {
  questionDiscoveryManifestKey,
} from "../../src/lib/server/manifest-loader";

// ─── Config ──────────────────────────────────────────────────────────────────

/**
 * Combinations to generate manifests for.
 * Add more pathways as the platform expands.
 */
const MANIFEST_TARGETS = [
  { tier: "RN",  country: "CA", pathwayId: "nclex-rn" },
  { tier: "RN",  country: "US", pathwayId: "nclex-rn" },
  { tier: "RPN", country: "CA", pathwayId: "rex-pn"   },
  { tier: "NP",  country: "CA", pathwayId: "cnple"    },
  { tier: "RN",  country: "CA", pathwayId: null        }, // no-pathway fallback
  { tier: "RPN", country: "CA", pathwayId: null        },
  { tier: "NP",  country: "CA", pathwayId: null        },
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface QuestionDiscoveryManifestPayload {
  tier: string;
  country: string;
  pathwayId: string | null;
  total: number;
  topicBuckets: { topic: string; count: number }[];
  examBuckets: { exam: string | null; count: number }[];
  topicsTruncated: boolean;
  examsTruncated: boolean;
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

function snapshotFilename(tier: string, country: string, pathwayId: string | null): string {
  const p = (pathwayId ?? "all").replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
  return `discovery-${tier.toLowerCase()}-${country.toLowerCase()}-${p}.json`;
}

// ─── Export ──────────────────────────────────────────────────────────────────

async function exportManifest(
  tier: string,
  country: string,
  pathwayId: string | null,
  baseDir: string,
): Promise<{ ok: boolean; filePath: string }> {
  const scope = syntheticScope(tier, country);
  const examContext = pathwayId ? buildGlobalExamContext(pathwayId, "en") : null;

  const { total, topicRows, examRows } = await loadSubscriberDiscoveryAggregates(
    scope,
    examContext,
  );

  const topicBuckets = topicRows.map((r: DiscoveryAggregateRow) => ({
    topic: r.topic ?? "Unknown",
    count: Number(r.cnt),
  }));
  const examBuckets = examRows.map((r: DiscoveryExamRow) => ({
    exam: r.exam ?? null,
    count: Number(r.cnt),
  }));

  const payload: QuestionDiscoveryManifestPayload = {
    tier,
    country,
    pathwayId,
    total,
    topicBuckets,
    examBuckets,
    topicsTruncated: topicRows.length >= 250,
    examsTruncated: examRows.length >= 120,
  };

  const version = process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`;
  const envelope: StudyPublishedSnapshotEnvelope<QuestionDiscoveryManifestPayload> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "question_discovery_manifest",
    version,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const relDir = path.join(baseDir, "questions");
  await mkdir(relDir, { recursive: true });
  const filename = snapshotFilename(tier, country, pathwayId);
  const filePath = path.join(relDir, filename);
  await writeFile(filePath, JSON.stringify(envelope), "utf8");

  return { ok: true, filePath };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // STUDY_PUBLISHED_SNAPSHOT_DIR is optional — os.tmpdir() is used when not set.
  // On ephemeral containers (DO App Platform, Railway) without a volume, omit it
  // and let Redis warming carry the data instead.
  const { tmpdir } = await import("node:os");
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim() || tmpdir();

  const useSpaces = spacesConfigured();
  const useRedis = redisConfigured();
  if (useSpaces) console.log("[question-manifests] Spaces upload enabled");
  if (useRedis) console.log("[question-manifests] Redis warming enabled");
  if (!useSpaces && !useRedis) console.log("[question-manifests] Filesystem only (no Spaces or Redis configured)");

  let ok = 0;
  let failed = 0;

  for (const { tier, country, pathwayId } of MANIFEST_TARGETS) {
    const label = `${tier}/${country}/${pathwayId ?? "all"}`;
    try {
      const result = await exportManifest(tier, country, pathwayId, baseDir);
      console.log(`[question-manifests] ${label} → ${result.filePath}`);
      ok++;

      if (useSpaces) {
        const relKey = `questions/${snapshotFilename(tier, country, pathwayId)}`;
        await uploadSnapshotToSpaces(result.filePath, relKey);
      }

      // Warm Redis directly — this is the primary production path on ephemeral containers
      if (useRedis) {
        const { readFile } = await import("node:fs/promises");
        const raw = JSON.parse(await readFile(result.filePath, "utf8")) as { payload: unknown };
        await writeManifestToRedis(
          questionDiscoveryManifestKey(tier, country, pathwayId),
          raw.payload,
        );
      }
    } catch (err: unknown) {
      console.error(`[question-manifests] FAILED ${label}:`, err);
      failed++;
    }
  }

  await touchStudySnapshotManifest(baseDir, "question_discovery_manifest");
  console.log(`\n[question-manifests] Done: ${ok} exported, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error("[question-manifests] Fatal:", e);
  process.exit(1);
});
