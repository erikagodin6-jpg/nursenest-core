import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { questionIdWhereIfAllowed } from "@/lib/entitlements/assert-question-access";
import { prisma } from "@/lib/db";
import { withRetry } from "@/lib/resilience/with-retry";
import { recordRemediationCapture } from "@/lib/remediation/record-remediation";
import { isRemediationEngineEnabled } from "@/lib/remediation/remediation-flag";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { buildTopicLapseIndex, resolveTopicLapseCount, emptyLapseIndex } from "@/lib/remediation/lapse-resolution";

export const dynamic = "force-dynamic";

function effectivePathwayIdForCapture(requestPathway: unknown, storedLearnerPath: string | null | undefined): string | null {
  const req = typeof requestPathway === "string" ? requestPathway.trim() : "";
  if (req && getExamPathwayById(req)) return req;
  const stored = (storedLearnerPath ?? "").trim();
  if (stored && getExamPathwayById(stored)) return stored;
  return null;
}

/**
 * Secondary capture path (e.g. practice session records confidence after grading).
 * Incorrect answers are captured from POST /api/questions/grade directly.
 */
export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/remediation/capture", "content", async () => {
    if (!isRemediationEngineEnabled()) {
      return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
    }

    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    let body: {
      questionId?: string;
      pathwayId?: string;
      reason?: "low_confidence_correct";
      confidence?: "low" | "medium" | "high";
    };
    try {
      body = (await req.json()) as typeof body;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (body.reason !== "low_confidence_correct") {
      return NextResponse.json({ error: "unsupported_reason" }, { status: 400 });
    }
    if (body.confidence !== "low") {
      return NextResponse.json({ error: "confidence_required" }, { status: 400 });
    }

    const questionId = typeof body.questionId === "string" && body.questionId.length > 4 ? body.questionId : null;
    if (!questionId) {
      return NextResponse.json({ error: "questionId required" }, { status: 400 });
    }

    // Parallel: user row + question + lapse index — no sequential overhead.
    const [userRow, row, lapseIndex] = await Promise.all([
      prisma.user.findUnique({
        where: { id: gate.userId },
        select: { learnerPath: true },
      }),
      withRetry(() =>
        prisma.examQuestion.findFirst({
        where: questionIdWhereIfAllowed(questionId, gate.entitlement),
        select: {
          id: true,
          topic: true,
          subtopic: true,
          bodySystem: true,
          tags: true,
          exam: true,
          difficulty: true,
          questionType: true,
          nclexClientNeedsCategory: true,
          nclexClientNeedsSubcategory: true,
        },
      })),
      isRemediationEngineEnabled()
        ? buildTopicLapseIndex(prisma, gate.userId)
        : emptyLapseIndex(),
    ]);

    const pathwayId = effectivePathwayIdForCapture(body.pathwayId, userRow?.learnerPath ?? null);

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await recordRemediationCapture(prisma, {
      userId: gate.userId,
      questionId: row.id,
      reason: "low_confidence_correct",
      pathwayId,
      topic: row.topic ?? null,
      subtopic: row.subtopic ?? null,
      bodySystem: row.bodySystem ?? null,
      exam: row.exam ?? null,
      difficulty: row.difficulty ?? null,
      tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
      nclexClientNeedsCategory: row.nclexClientNeedsCategory ?? null,
      nclexClientNeedsSubcategory: row.nclexClientNeedsSubcategory ?? null,
      questionType: row.questionType,
      confidence: "low",
      catDifficultyHint: row.difficulty != null ? Number(row.difficulty) : null,
      lapseCount: resolveTopicLapseCount(lapseIndex, row.topic),
      remediationSource: "practice_incorrect" as const,
    });

    return NextResponse.json({ ok: true });
  });
}
