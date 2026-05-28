/**
 * Export flashcard inventory snapshots for Phase 2.5 startup acceleration.
 *
 * Generates pre-computed category counts per (tier × country × pathwayId).
 * These replace the three-query Prisma transaction at inventory route startup.
 *
 * Writes to:
 *   {STUDY_PUBLISHED_SNAPSHOT_DIR}/flashcards/inventory-{tier}-{country}-{pathway}.json
 *
 * Also uploads to Spaces when SPACES_* env vars are configured.
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots \
 *     npx tsx scripts/study-snapshots/export-flashcard-inventory-snapshots.mts
 */
import "../stub-server-only.cjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CountryCode, TierCode } from "@prisma/client";

import type { AccessScope } from "../../src/lib/entitlements/user-access-types";
import { loadFlashcardsExamInventoryForPathway } from "../../src/lib/flashcards/load-flashcards-exam-inventory.server";
import { getExamPathwayById } from "../../src/lib/exam-pathways/exam-product-registry";
import type { StudyPublishedSnapshotEnvelope } from "../../src/lib/study-content-failover/study-published-snapshot-types";
import { touchStudySnapshotManifest } from "./study-snapshot-manifest-touch.mts";
import {
  uploadSnapshotToSpaces,
  spacesConfigured,
} from "./lib/s3-snapshot-uploader.mts";
import { writeManifestToRedis, redisConfigured } from "./lib/redis-manifest-writer.mts";
import { flashcardInventoryManifestKey } from "../../src/lib/server/manifest-loader";

// ─── Config ──────────────────────────────────────────────────────────────────

const MANIFEST_TARGETS = [
  { tier: "RN",  country: "CA", pathwayId: "nclex-rn" },
  { tier: "RN",  country: "US", pathwayId: "nclex-rn" },
  { tier: "RPN", country: "CA", pathwayId: "rex-pn"   },
  { tier: "NP",  country: "CA", pathwayId: "cnple"    },
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FlashcardInventoryManifestPayload {
  tier: string;
  country: string;
  pathwayId: string;
  total: number;
  categoryOptions: unknown[];
  categories: { name: string; count: number }[];
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

function snapshotFilename(tier: string, country: string, pathwayId: string): string {
  const p = pathwayId.replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
  return `inventory-${tier.toLowerCase()}-${country.toLowerCase()}-${p}.json`;
}

// ─── Export ──────────────────────────────────────────────────────────────────

async function exportInventory(
  tier: string,
  country: string,
  pathwayId: string,
  baseDir: string,
): Promise<{ ok: boolean; filePath: string; error?: string }> {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    return { ok: false, filePath: "", error: `Unknown pathwayId: ${pathwayId}` };
  }

  const scope = syntheticScope(tier, country);
  const inv = await loadFlashcardsExamInventoryForPathway({
    userId: "snapshot-export",
    entitlement: scope,
    pathway,
  });

  if (!inv.ok) {
    return { ok: false, filePath: "", error: `inv.code=${inv.code}: ${inv.message}` };
  }

  const categories = Object.entries(inv.countsByBuilderId).map(([name, count]) => ({ name, count }));
  const payload: FlashcardInventoryManifestPayload = {
    tier,
    country,
    pathwayId,
    total: inv.total,
    categoryOptions: inv.categoryOptions,
    categories,
  };

  const version = process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`;
  const envelope: StudyPublishedSnapshotEnvelope<FlashcardInventoryManifestPayload> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "flashcard_inventory_manifest",
    version,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const relDir = path.join(baseDir, "flashcards");
  await mkdir(relDir, { recursive: true });
  const filename = snapshotFilename(tier, country, pathwayId);
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
  if (useSpaces) console.log("[flashcard-inventory] Spaces upload enabled");
  if (useRedis) console.log("[flashcard-inventory] Redis warming enabled");

  let ok = 0;
  let failed = 0;

  for (const { tier, country, pathwayId } of MANIFEST_TARGETS) {
    const label = `${tier}/${country}/${pathwayId}`;
    try {
      const result = await exportInventory(tier, country, pathwayId, baseDir);
      if (!result.ok) {
        console.warn(`[flashcard-inventory] SKIPPED ${label}: ${result.error}`);
        continue;
      }
      console.log(`[flashcard-inventory] ${label} → ${result.filePath}`);
      ok++;

      if (useSpaces) {
        const relKey = `flashcards/${snapshotFilename(tier, country, pathwayId)}`;
        await uploadSnapshotToSpaces(result.filePath, relKey);
      }

      if (useRedis) {
        const { readFile } = await import("node:fs/promises");
        const raw = JSON.parse(await readFile(result.filePath, "utf8")) as { payload: unknown };
        await writeManifestToRedis(
          flashcardInventoryManifestKey(tier, country, pathwayId),
          raw.payload,
        );
      }
    } catch (err: unknown) {
      console.error(`[flashcard-inventory] FAILED ${label}:`, err);
      failed++;
    }
  }

  await touchStudySnapshotManifest(baseDir, "flashcard_inventory_manifest");
  console.log(`\n[flashcard-inventory] Done: ${ok} exported, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error("[flashcard-inventory] Fatal:", e);
  process.exit(1);
});
