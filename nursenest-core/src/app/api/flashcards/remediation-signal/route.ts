/**
 * POST /api/flashcards/remediation-signal
 *
 * Unified remediation capture for non-question-bank surfaces:
 *   ecg_miss      — ECG strip missed
 *   cat_miss      — CAT/practice-test question missed
 *   practice_miss — General practice session miss (non-CAT)
 *   flashcard_again — Flashcard rated "again" by learner
 *   manual        — Learner-initiated "I don't know this"
 *
 * Lapse-frequency wiring:
 *   All sources resolve lapse count from FlashcardProgress via
 *   buildTopicLapseIndex (single DB read per request, O(1) lookup per topic).
 *   For flashcard_again the direct FlashcardProgress row is also fetched so the
 *   freshest post-review lapse count is included.
 *
 * Body: { topic, pathwayId?, bodySystem?, questionId?, flashcardId?, source }
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { recordRemediationCapture } from "@/lib/remediation/record-remediation";
import { isRemediationEngineEnabled } from "@/lib/remediation/remediation-flag";
import {
  buildTopicLapseIndex,
  resolveTopicLapseCount,
} from "@/lib/remediation/lapse-resolution";
import { prisma } from "@/lib/db";

const REMEDIATION_SOURCES = [
  "ecg_miss",
  "cat_miss",
  "practice_miss",
  "flashcard_again",
  "manual",
] as const;

export type RemediationSignalSource = (typeof REMEDIATION_SOURCES)[number];

const bodySchema = z.object({
  topic: z.string().min(1).max(200),
  pathwayId: z.string().max(64).optional().nullable(),
  bodySystem: z.string().max(128).optional().nullable(),
  questionId: z.string().max(64).optional().nullable(),
  /**
   * For source="flashcard_again": pass flashcardId so the fresh post-review
   * lapse count can be combined with the topic-level index.
   */
  flashcardId: z.string().max(64).optional().nullable(),
  source: z.enum(REMEDIATION_SOURCES).default("manual"),
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/flashcards/remediation-signal", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const { userId } = gate;
    setSentryServerContext({
      route: "/api/flashcards/remediation-signal",
      feature: SERVER_FEATURE.flashcard,
      userId,
    });

    if (!isRemediationEngineEnabled()) {
      return NextResponse.json({ ok: true, skipped: true, reason: "remediation_engine_disabled" });
    }

    let body: z.infer<typeof bodySchema>;
    try {
      body = bodySchema.parse(await req.json());
    } catch {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // ── Lapse resolution: parallel fetch, single read each ───────────────────
    // Topic lapse index: one read for all topics this user has lapsed.
    // Direct flashcard row: only for flashcard_again to get the freshest count.
    const [lapseIndex, flashcardDirectLapses] = await Promise.all([
      buildTopicLapseIndex(prisma, userId),
      body.source === "flashcard_again" && body.flashcardId
        ? prisma.flashcardProgress
            .findUnique({
              where: { userId_flashcardId: { userId, flashcardId: body.flashcardId } },
              select: { lapses: true },
            })
            .catch(() => null)
        : Promise.resolve(null),
    ]);

    // For flashcard_again: use the higher of the direct card count vs topic aggregate.
    // Topic aggregate reflects all cards in this topic; direct row is this card only.
    const topicIndexLapses = resolveTopicLapseCount(lapseIndex, body.topic);
    const directLapses = Math.max(0, flashcardDirectLapses?.lapses ?? 0);
    const lapseCount = Math.max(topicIndexLapses, directLapses);

    const syntheticQuestionId =
      body.questionId?.trim() || `signal:${body.source}:${Date.now()}`;

    await recordRemediationCapture(prisma, {
      userId,
      questionId: syntheticQuestionId,
      reason: "incorrect",
      pathwayId: body.pathwayId ?? null,
      topic: body.topic,
      subtopic: null,
      bodySystem: body.bodySystem ?? null,
      exam: null,
      difficulty: null,
      tags: [],
      questionType: body.source,
      confidence: "low",
      lapseCount,
      remediationSource: body.source,
    });

    return NextResponse.json({ ok: true });
  });
}
