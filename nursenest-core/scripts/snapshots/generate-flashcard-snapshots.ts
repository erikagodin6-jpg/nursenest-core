#!/usr/bin/env tsx
/**
 * Generate flashcard subscriber-list and hub-bootstrap snapshots.
 *
 * Writes to $STUDY_PUBLISHED_SNAPSHOT_DIR/flashcards/
 *
 * Run from nursenest-core/:
 *   npx tsx scripts/snapshots/generate-flashcard-snapshots.ts
 */

import "@/lib/db/script-env-bootstrap";

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

import { prisma } from "@/lib/db";
import { ContentStatus, type TierCode, type CountryCode } from "@prisma/client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";
import type { FlashcardsSubscriberListSnapshotPayload } from "@/lib/study-content-failover/flashcards-list-snapshot-read";
import type { FlashcardsHubPathwayBootstrapSnapshotPayload } from "@/lib/study-content-failover/flashcards-hub-bootstrap-snapshot-read";

const SNAPSHOT_DIR = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
const LOCALES = ["en", "fr"] as const;
const TIERS: TierCode[] = ["RN", "RPN", "NP", "ALLIED", "NEW_GRAD", "LVN_LPN", "PRE_NURSING"];
const COUNTRIES: CountryCode[] = ["CA", "US", "GB", "AU", "PH", "IN"];
const PAGE_SIZE = 50;

type WriteResult = { path: string; records: number; skipped?: boolean; error?: string };

async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

function versionStamp(payload: unknown): string {
  const hash = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex")
    .slice(0, 16);
  return `${new Date().toISOString().slice(0, 19)}Z-sha256:${hash}`;
}

function writeEnvelope<T>(
  surface: string,
  payload: T,
): StudyPublishedSnapshotEnvelope<T> {
  const capturedAt = new Date().toISOString();
  return {
    schema: "nursenest.study_snapshot.v1",
    surface,
    version: versionStamp(payload),
    capturedAt,
    payload,
  };
}

async function writeSnapshot(filePath: string, envelope: StudyPublishedSnapshotEnvelope<unknown>): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, JSON.stringify(envelope, null, 2), "utf8");
}

// ─── Flashcard Subscriber List ────────────────────────────────────────────────

async function generateSubscriberListSnapshot(
  baseDir: string,
  tier: TierCode,
  country: CountryCode,
  locale: string,
): Promise<WriteResult> {
  const filePath = path.join(baseDir, `subscriber-list-${tier}-${country}-${locale}.json`);
  try {
    const tierIn = getTierLadder(tier);
    const where = buildSubscriberWhere(tierIn, country);

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
        take: PAGE_SIZE,
      }),
      prisma.flashcard.count({ where }),
    ]);

    if (total === 0) {
      return { path: filePath, records: 0, skipped: true };
    }

    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const payload: FlashcardsSubscriberListSnapshotPayload = {
      page: 1,
      pageSize: PAGE_SIZE,
      total,
      pageCount,
      flashcards: flashcards.map((f) => ({
        id: f.id,
        front: f.front,
        back: f.back,
        examFamily: f.examFamily,
        category: { name: f.category?.name ?? "", slug: f.category?.slug ?? "" },
      })),
    };

    const envelope = writeEnvelope<FlashcardsSubscriberListSnapshotPayload>(
      "flashcards_subscriber_list",
      payload,
    );
    await writeSnapshot(filePath, envelope);
    return { path: filePath, records: total };
  } catch (e) {
    return { path: filePath, records: 0, error: e instanceof Error ? e.message : String(e) };
  }
}

// ─── Flashcard Hub Bootstrap ─────────────────────────────────────────────────

async function generateHubBootstrapSnapshot(
  baseDir: string,
  country: CountryCode,
  tier: TierCode,
): Promise<WriteResult> {
  const filePath = path.join(baseDir, `hub-bootstrap-${country}-${tier}.json`);
  try {
    // Compatible pathways for this tier+country
    const compatiblePathways = EXAM_PATHWAYS.filter((p) => {
      const pCountry = p.countrySlug?.toUpperCase();
      return pCountry === country || pCountry === "BOTH";
    });

    if (compatiblePathways.length === 0) {
      return { path: filePath, records: 0, skipped: true };
    }

    const payload: FlashcardsHubPathwayBootstrapSnapshotPayload = {
      pathwayOptions: compatiblePathways.map((p) => ({
        id: p.id,
        label: p.shortName ?? p.id,
      })),
      compatibleRows: compatiblePathways.map((p) => ({
        id: p.id,
        shortName: p.shortName ?? p.id,
      })),
    };

    const envelope = writeEnvelope<FlashcardsHubPathwayBootstrapSnapshotPayload>(
      "flashcards_hub_pathway_bootstrap",
      payload,
    );
    await writeSnapshot(filePath, envelope);
    return { path: filePath, records: compatiblePathways.length };
  } catch (e) {
    return { path: filePath, records: 0, error: e instanceof Error ? e.message : String(e) };
  }
}

// ─── Tier Ladder ─────────────────────────────────────────────────────────────

function getTierLadder(tier: TierCode): TierCode[] {
  const ladders: Record<string, TierCode[]> = {
    RN: ["RN"],
    RPN: ["RPN"],
    LVN_LPN: ["LVN_LPN", "RPN"],
    NP: ["NP", "RN"],
    ALLIED: ["ALLIED"],
    NEW_GRAD: ["NEW_GRAD", "RN"],
    PRE_NURSING: ["PRE_NURSING"],
  };
  return ladders[tier] ?? [tier];
}

function buildSubscriberWhere(tierIn: TierCode[], country: CountryCode) {
  return {
    status: ContentStatus.PUBLISHED,
    tier: { in: tierIn },
    country,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function generateFlashcardSnapshots(): Promise<{
  results: WriteResult[];
  written: number;
  skipped: number;
  errors: number;
}> {
  if (!SNAPSHOT_DIR) {
    console.error("[snapshots] STUDY_PUBLISHED_SNAPSHOT_DIR is not set");
    process.exit(1);
  }

  const baseDir = path.join(SNAPSHOT_DIR, "flashcards");
  await ensureDir(baseDir);
  const results: WriteResult[] = [];

  // Subscriber list snapshots: tier × country × locale
  for (const tier of TIERS) {
    for (const country of COUNTRIES) {
      for (const locale of LOCALES) {
        const r = await generateSubscriberListSnapshot(baseDir, tier, country, locale);
        results.push(r);
        if (r.error) console.error(`  ✗ ${path.basename(r.path)}: ${r.error}`);
        else if (!r.skipped) console.log(`  ✓ ${path.basename(r.path)} (${r.records} cards)`);
      }
    }
  }

  // Hub bootstrap snapshots: country × tier
  for (const country of COUNTRIES) {
    for (const tier of TIERS) {
      const r = await generateHubBootstrapSnapshot(baseDir, country, tier);
      results.push(r);
      if (r.error) console.error(`  ✗ ${path.basename(r.path)}: ${r.error}`);
      else if (!r.skipped) console.log(`  ✓ ${path.basename(r.path)} (${r.records} pathways)`);
    }
  }

  const written = results.filter((r) => !r.skipped && !r.error).length;
  const skipped = results.filter((r) => r.skipped).length;
  const errors = results.filter((r) => Boolean(r.error)).length;

  return { results, written, skipped, errors };
}

if (process.argv[1] === import.meta.filename || process.argv[1]?.endsWith("generate-flashcard-snapshots.ts")) {
  const t0 = Date.now();
  console.log("[snapshots] Generating flashcard snapshots...");
  generateFlashcardSnapshots()
    .then(({ written, skipped, errors }) => {
      console.log(`[snapshots] Done in ${Date.now() - t0}ms: ${written} written, ${skipped} skipped, ${errors} errors`);
      if (errors > 0) process.exit(1);
    })
    .catch((e) => {
      console.error("[snapshots] Fatal error:", e);
      process.exit(1);
    });
}
