/**
 * Generic three-layer content loader: Redis → snapshot file → live DB query.
 *
 * Each layer is tried in sequence; the first hit is returned and backfills
 * the layers above it (snapshot hit → write Redis; live hit → write Redis).
 *
 * This powers Phase 2.5 manifest acceleration: discovery aggregates, flashcard
 * inventory counts, and lesson metadata all use this loader so the DB is only
 * hit on cold cache with no snapshot, which should be rare after nightly exports.
 *
 * Usage:
 *   const { data, source } = await loadWithManifest({
 *     redisKey: "manifest:questions:discovery:RN:CA:nclex-rn",
 *     redisTtl: 60 * 60,
 *     snapshotPath: ["questions", "discovery-RN-CA-nclex-rn.json"],
 *     buildLive: () => loadSubscriberDiscoveryAggregates(entitlement, ctx),
 *   });
 *   // source: "redis" | "snapshot" | "live"
 */
import "server-only";

import { cacheGet, cacheSet } from "@/lib/server/content-cache";
import { readStudyPublishedSnapshotFile } from "@/lib/study-content-failover/study-published-snapshot-store";

export type ManifestSource = "redis" | "snapshot" | "live";

export interface ManifestLoaderOpts<T> {
  /** Redis key. Should be stable across deploys — include version suffix if schema changes. */
  redisKey: string;
  /** Redis TTL in seconds. */
  redisTtl: number;
  /**
   * Path segments relative to STUDY_PUBLISHED_SNAPSHOT_DIR, e.g.
   * ["questions", "discovery-RN-CA-nclex-rn.json"].
   * When the file is found, its payload is cached in Redis for redisTtl seconds.
   */
  snapshotPath: string[];
  /**
   * Live builder — called only when both Redis and snapshot miss.
   * Result is written to Redis (not to the snapshot file; that is the export script's job).
   */
  buildLive: () => Promise<T>;
  /**
   * Optional guard: if the loaded data (any source) does not satisfy this predicate,
   * it is treated as a miss and the next layer is tried.
   * Use to reject empty or stale payloads.
   */
  isValid?: (data: T) => boolean;
}

export interface ManifestLoaderResult<T> {
  data: T;
  source: ManifestSource;
  snapshotAgeMs?: number;
}

/**
 * Load data using Redis → snapshot file → live DB, in that order.
 * Caches every hit into Redis so subsequent requests skip the next layers.
 */
export async function loadWithManifest<T>(
  opts: ManifestLoaderOpts<T>,
): Promise<ManifestLoaderResult<T>> {
  const { redisKey, redisTtl, snapshotPath, buildLive, isValid } = opts;

  // ── Layer 1: Redis ──────────────────────────────────────────────────────────
  try {
    const cached = await cacheGet<T>(redisKey);
    if (cached !== null && cached !== undefined) {
      if (!isValid || isValid(cached)) {
        return { data: cached, source: "redis" };
      }
    }
  } catch {
    // Redis failure → continue to next layer
  }

  // ── Layer 2: Snapshot file ──────────────────────────────────────────────────
  try {
    const envelope = await readStudyPublishedSnapshotFile<T>(snapshotPath);
    if (envelope?.payload !== undefined && envelope.payload !== null) {
      if (!isValid || isValid(envelope.payload)) {
        // Backfill Redis
        const ageMs = envelope.capturedAt
          ? Math.max(0, Date.now() - Date.parse(envelope.capturedAt))
          : undefined;
        // Use a shorter TTL if the snapshot is stale (>22h) so Redis doesn't outlive freshness
        const effectiveTtl = ageMs && ageMs > 22 * 60 * 60 * 1000 ? Math.min(redisTtl, 600) : redisTtl;
        await cacheSet(redisKey, envelope.payload, effectiveTtl).catch(() => {});
        return { data: envelope.payload, source: "snapshot", snapshotAgeMs: ageMs };
      }
    }
  } catch {
    // Snapshot read failure → continue to live
  }

  // ── Layer 3: Live DB ────────────────────────────────────────────────────────
  const live = await buildLive();
  // Backfill Redis (best-effort)
  await cacheSet(redisKey, live, redisTtl).catch(() => {});
  return { data: live, source: "live" };
}

// ─── Shared payload types (used by routes and export scripts) ─────────────────

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

export interface FlashcardInventoryManifestPayload {
  tier: string;
  country: string;
  pathwayId: string;
  total: number;
  categoryOptions: unknown[];
  categories: { name: string; count: number }[];
}

export interface LessonManifestPayload {
  tier: string;
  country: string;
  totalLessons: number;
  topicBreakdown: { topic: string; count: number }[];
  firstPage: {
    id: string;
    title: string;
    slug: string | null;
    category: string | null;
    tier: string | null;
    publishedAt: string | null;
  }[];
  firstPageSize: number;
}

// ─── Key builders ─────────────────────────────────────────────────────────────

export function questionDiscoveryManifestKey(
  tier: string,
  country: string,
  pathwayId: string | null,
): string {
  const p = pathwayId?.replace(/[^a-z0-9_-]/gi, "_") ?? "_all";
  return `manifest:questions:discovery:${tier}:${country}:${p}:v1`;
}

export function flashcardInventoryManifestKey(
  tier: string,
  country: string,
  pathwayId: string,
): string {
  const p = pathwayId.replace(/[^a-z0-9_-]/gi, "_");
  return `manifest:flashcards:inventory:${tier}:${country}:${p}:v1`;
}

export function lessonManifestKey(tier: string, country: string): string {
  return `manifest:lessons:hub:${tier}:${country}:v1`;
}

export function clinicalSkillsManifestKey(pathwayId: string): string {
  return `manifest:clinical-skills:${pathwayId.replace(/[^a-z0-9_-]/gi, "_")}:v1`;
}

export function ecgManifestKey(): string {
  return "manifest:ecg:categories:v1";
}

// ─── Snapshot path builders ───────────────────────────────────────────────────

export function questionDiscoverySnapshotPath(
  tier: string,
  country: string,
  pathwayId: string | null,
): string[] {
  const p = (pathwayId ?? "all").replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
  return ["questions", `discovery-${tier.toLowerCase()}-${country.toLowerCase()}-${p}.json`];
}

export function flashcardInventorySnapshotPath(
  tier: string,
  country: string,
  pathwayId: string,
): string[] {
  const p = pathwayId.replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
  return ["flashcards", `inventory-${tier.toLowerCase()}-${country.toLowerCase()}-${p}.json`];
}

export function lessonManifestSnapshotPath(tier: string, country: string): string[] {
  return ["lessons", `manifest-${tier.toLowerCase()}-${country.toLowerCase()}.json`];
}

export function clinicalSkillsManifestSnapshotPath(pathwayId: string): string[] {
  return ["clinical-skills", `manifest-${pathwayId.replace(/[^a-z0-9_-]/gi, "_").toLowerCase()}.json`];
}

export function ecgManifestSnapshotPath(): string[] {
  return ["ecg", "manifest-categories.json"];
}
