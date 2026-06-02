import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { LEARNING_DELIVERY_THRESHOLDS_MS } from "@/lib/resilience/learning-continuity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "no-store" };
const ACTIVITY_STARTUP_WARN_MS = LEARNING_DELIVERY_THRESHOLDS_MS.warning;
const ACTIVITY_STARTUP_CRITICAL_MS = LEARNING_DELIVERY_THRESHOLDS_MS.critical;

async function boundedCount(label: string, run: () => Promise<number>): Promise<number | null> {
  const value = await withDatabaseFallbackTimeout(run, -1, 1_500, {
    scope: "activity_startup_health",
    label,
  });
  return value >= 0 ? value : null;
}

export async function GET() {
  const started = Date.now();
  const database = await checkDatabaseReadiness(1_500);
  const [flashcards, examQuestions, practiceSessionReady] = await Promise.all([
    boundedCount("flashcards_published", () => prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } })),
    boundedCount("exam_questions_published", () =>
      prisma.examQuestion.count({ where: { status: "published" } }),
    ),
    withDatabaseFallbackTimeout(
      async () => Boolean(await prisma.practiceTest.findFirst({ select: { id: true } })),
      false,
      1_500,
      { scope: "activity_startup_health", label: "practice_test_find_first" },
    ),
  ]);
  const durationMs = Date.now() - started;
  const ok = database.ok && flashcards !== null && examQuestions !== null;
  if (durationMs >= ACTIVITY_STARTUP_WARN_MS) {
    safeServerLog("activity_startup_health", durationMs >= ACTIVITY_STARTUP_CRITICAL_MS ? "critical_slow" : "slow", {
      durationMs,
      flashcards: flashcards ?? -1,
      examQuestions: examQuestions ?? -1,
    });
  }
  return NextResponse.json(
    {
      ok,
      activityStartup: ok ? "ok" : "degraded",
      durationMs,
      thresholds: {
        primaryTargetMs: LEARNING_DELIVERY_THRESHOLDS_MS.primaryTarget,
        backupDeliveryMs: LEARNING_DELIVERY_THRESHOLDS_MS.backupDelivery,
        warnMs: ACTIVITY_STARTUP_WARN_MS,
        criticalMs: ACTIVITY_STARTUP_CRITICAL_MS,
      },
      database: database.ok ? "ok" : "degraded",
      probes: {
        flashcardsPublished: flashcards,
        examQuestionsPublished: examQuestions,
        practiceSessionReady,
      },
    },
    { status: ok ? 200 : 503, headers: HEADERS },
  );
}
