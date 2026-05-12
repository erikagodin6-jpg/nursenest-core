/**
 * POST /api/flashcards/remediation-signal
 *
 * Triggers a remediation capture for a missed question or knowledge gap,
 * boosting related flashcards to the top of the weak queue.
 *
 * Uses the existing `recordRemediationCapture` pipeline — this is a thin
 * bridge for non-question surfaces (e.g. ECG strip misses, CAT misses
 * without a direct questionId, or learner-initiated "I don't know this").
 *
 * Body: { topic, pathwayId?, bodySystem?, questionId? }
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { recordRemediationCapture } from "@/lib/remediation/record-remediation";
import { isRemediationEngineEnabled } from "@/lib/remediation/remediation-flag";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  topic: z.string().min(1).max(200),
  pathwayId: z.string().max(64).optional().nullable(),
  bodySystem: z.string().max(128).optional().nullable(),
  questionId: z.string().max(64).optional().nullable(),
  source: z.enum(["ecg_miss", "cat_miss", "flashcard_again", "manual"]).default("manual"),
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/flashcards/remediation-signal", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const { userId } = gate;
    setSentryServerContext({ route: "/api/flashcards/remediation-signal", feature: SERVER_FEATURE.flashcard, userId });

    if (!isRemediationEngineEnabled()) {
      return NextResponse.json({ ok: true, skipped: true, reason: "remediation_engine_disabled" });
    }

    let body: z.infer<typeof bodySchema>;
    try {
      body = bodySchema.parse(await req.json());
    } catch {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const syntheticQuestionId = body.questionId?.trim() || `flashcard-signal:${Date.now()}`;

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
    });

    return NextResponse.json({ ok: true });
  });
}
