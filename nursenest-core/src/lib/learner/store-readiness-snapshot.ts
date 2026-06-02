import "server-only";

/**
 * Persist a learner readiness snapshot to the readiness_history table.
 *
 * One row per user per week (snapshot_week = ISO week key "YYYY-WNN").
 * Upserts: if a row already exists for this week, the score is updated only
 * if the new score is higher (prevents retrograde scores from bad sessions).
 *
 * Fire-and-forget: never throws, errors are logged.
 */

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { ReadinessResult } from "@/lib/learner/readiness-score";

/** Returns ISO week key like "2026-W21" for the given date. */
function isoWeekKey(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function examTypeFromPathway(pathwayId: string | null | undefined): string {
  if (!pathwayId) return "RN";
  const id = pathwayId.toLowerCase();
  if (id.includes("rpn") || id.includes("rex-pn")) return "RPN";
  if (id.includes("np") || id.includes("cnple")) return "NP";
  if (id.includes("allied")) return "ALLIED";
  if (id.includes("lpn") || id.includes("nclex-pn")) return "LPN";
  return "RN";
}

function readinessTierFromResult(result: ReadinessResult): string {
  const band = result.band;
  if (band === "ready") return "exam_ready";
  if (band === "near_ready") return "near_ready";
  if (band === "improving") return "developing";
  if (band === "not_ready") return "early_preparation";
  return "early_preparation";
}

export async function storeReadinessSnapshot(
  userId: string,
  pathwayId: string | null | undefined,
  result: ReadinessResult,
): Promise<void> {
  if (!isDatabaseUrlConfigured()) return;
  if (result.score == null) return;

  const snapshotWeek = isoWeekKey();
  const examType = examTypeFromPathway(pathwayId);
  const readinessTier = readinessTierFromResult(result);
  const score = Math.max(0, Math.min(100, Math.round(result.score)));
  const passProbability = result.band === "ready" ? 85 : result.band === "near_ready" ? 65 : 40;

  try {
    // Upsert: only update score upward within the same week
    const existing = await prisma.readiness_history.findUnique({
      where: { user_id_snapshot_week: { user_id: userId, snapshot_week: snapshotWeek } },
      select: { id: true, readiness_score: true },
    });

    if (existing) {
      if (score > existing.readiness_score) {
        await prisma.readiness_history.update({
          where: { id: existing.id },
          data: {
            readiness_score: score,
            pass_probability: passProbability,
            readiness_tier: readinessTier,
            exam_type: examType,
            factors: result.factors as unknown as import("@prisma/client").Prisma.JsonObject,
          },
        });
      }
      // Score didn't improve this week — don't downgrade
    } else {
      await prisma.readiness_history.create({
        data: {
          user_id: userId,
          readiness_score: score,
          pass_probability: passProbability,
          readiness_tier: readinessTier,
          exam_type: examType,
          snapshot_week: snapshotWeek,
          factors: result.factors as unknown as import("@prisma/client").Prisma.JsonObject,
        },
      });
    }
  } catch (e) {
    safeServerLog("readiness", "snapshot_store_failed", {
      userId: userId.slice(0, 8),
      snapshotWeek,
      error: e instanceof Error ? e.message.slice(0, 200) : String(e),
    });
  }
}
