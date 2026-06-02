import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { prisma } from "@/lib/db";
import { ContentStatus, type TierCode, type CountryCode } from "@prisma/client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import { getPathwayLessonsPageFresh } from "@/lib/lessons/pathway-lesson-loader";
import { stableListOptsKey } from "@/lib/study-content-failover/study-published-snapshot-store";
import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";
import type { PathwayLessonsPageResult } from "@/lib/lessons/pathway-lesson-loader";
import type { FlashcardsSubscriberListSnapshotPayload } from "@/lib/study-content-failover/flashcards-list-snapshot-read";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const TIERS: TierCode[] = ["RN", "RPN", "NP", "ALLIED", "NEW_GRAD", "LVN_LPN", "PRE_NURSING"];
const COUNTRIES: CountryCode[] = ["CA", "US", "GB", "AU", "PH", "IN"];
const LOCALES = ["en", "fr"] as const;
const PAGE_SIZE = 50;

type SurfaceResult = { written: number; skipped: number; errors: number };

function snapshotDir(): string | null {
  return process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim() || null;
}

function versionStamp(payload: unknown): string {
  const hash = createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 16);
  return `${new Date().toISOString().slice(0, 19)}Z-sha256:${hash}`;
}

async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

async function writeSnapshot<T>(filePath: string, surface: string, payload: T): Promise<void> {
  const envelope: StudyPublishedSnapshotEnvelope<T> = {
    schema: "nursenest.study_snapshot.v1",
    surface,
    version: versionStamp(payload),
    capturedAt: new Date().toISOString(),
    payload,
  };
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, JSON.stringify(envelope, null, 2), "utf8");
}

function tierLadder(tier: TierCode): TierCode[] {
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

async function generateFlashcardSurface(base: string): Promise<SurfaceResult> {
  const dir = path.join(base, "flashcards");
  let written = 0; let skipped = 0; let errors = 0;

  for (const tier of TIERS) {
    for (const country of COUNTRIES) {
      for (const locale of LOCALES) {
        const fp = path.join(dir, `subscriber-list-${tier}-${country}-${locale}.json`);
        try {
          const tierIn = tierLadder(tier);
          const [cards, total] = await Promise.all([
            prisma.flashcard.findMany({
              where: { status: ContentStatus.PUBLISHED, tier: { in: tierIn }, country },
              select: { id: true, front: true, back: true, examFamily: true,
                        category: { select: { name: true, slug: true } } },
              orderBy: { updatedAt: "desc" },
              take: PAGE_SIZE,
            }),
            prisma.flashcard.count({
              where: { status: ContentStatus.PUBLISHED, tier: { in: tierIn }, country },
            }),
          ]);
          if (total === 0) { skipped++; continue; }
          const payload: FlashcardsSubscriberListSnapshotPayload = {
            page: 1, pageSize: PAGE_SIZE, total,
            pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
            flashcards: cards.map((c) => ({
              id: c.id, front: c.front, back: c.back, examFamily: c.examFamily,
              category: { name: c.category?.name ?? "", slug: c.category?.slug ?? "" },
            })),
          };
          await writeSnapshot(fp, "flashcards_subscriber_list", payload);
          written++;
        } catch (e) {
          errors++;
          safeServerLog("cron", "snapshot_surface_error", { surface: "flashcards", tier, country, locale, error: String(e) });
        }
      }
    }
  }
  return { written, skipped, errors };
}

async function generateLessonSurface(base: string): Promise<SurfaceResult> {
  const dir = path.join(base, "lessons-hub");
  let written = 0; let skipped = 0; let errors = 0;
  const optsKey = stableListOptsKey(undefined);

  for (const pathway of EXAM_PATHWAYS) {
    for (const locale of LOCALES) {
      const fp = path.join(dir, pathway.id, locale, `p1-s${PAGE_SIZE}-${optsKey}.json`);
      try {
        const result = await getPathwayLessonsPageFresh(pathway.id, 1, PAGE_SIZE, locale, undefined);
        if (!result || result.total === 0) { skipped++; continue; }
        const payload: PathwayLessonsPageResult = {
          items: result.items, total: result.total, page: result.page,
          pageSize: result.pageSize, pageCount: result.pageCount,
          locale: result.locale, renderableAll: result.renderableAll,
        };
        await writeSnapshot(fp, "pathway_lessons_hub", payload);
        written++;
      } catch (e) {
        errors++;
        safeServerLog("cron", "snapshot_surface_error", { surface: "lessons_hub", pathwayId: pathway.id, locale, error: String(e) });
      }
    }
  }
  return { written, skipped, errors };
}

export async function POST(req: Request) {
  const denied = enforceCronSecretOrResponse(req);
  if (denied) return denied;

  const base = snapshotDir();
  if (!base) {
    safeServerLog("cron", "snapshot_generation_skipped", { reason: "STUDY_PUBLISHED_SNAPSHOT_DIR_unset" });
    return NextResponse.json({ ok: true, skipped: true, reason: "STUDY_PUBLISHED_SNAPSHOT_DIR not set" });
  }

  const t0 = Date.now();
  safeServerLog("cron", "snapshot_generation_started", { base });

  const [flashcards, lessons] = await Promise.all([
    generateFlashcardSurface(base),
    generateLessonSurface(base),
  ]);

  const durationMs = Date.now() - t0;
  const manifest = {
    lastRefreshedAt: new Date().toISOString(),
    surfaces: { flashcards, lessons },
    durationMs,
  };

  try {
    await writeFile(path.join(base, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  } catch (e) {
    safeServerLog("cron", "snapshot_manifest_write_error", { error: String(e) });
  }

  safeServerLog("cron", "snapshot_generation_complete", {
    durationMs,
    flashcards_written: flashcards.written,
    flashcards_errors: flashcards.errors,
    lessons_written: lessons.written,
    lessons_errors: lessons.errors,
  });

  return NextResponse.json({ ok: true, durationMs, surfaces: { flashcards, lessons } });
}
