import { NextResponse } from "next/server";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { computeQuestionPsychometricsBatch } from "@/lib/questions/compute-question-psychometrics";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Nightly question psychometric computation.
 * Schedule: POST /api/cron/compute-question-quality (Authorization: Bearer $CRON_SECRET)
 *
 * Reads ExamQuestionPerformanceAggregate + ExamQuestionAnswerOptionAggregate,
 * computes p-value, distractor performance, flags outliers, and writes
 * qualityScore + qualityFeedback back to ExamQuestion.
 * Auto-disables critically flagged questions from CAT and mock exam pools.
 */
export async function POST(req: Request) {
  const denied = enforceCronSecretOrResponse(req);
  if (denied) return denied;

  let limit = 1000;
  try {
    const url = new URL(req.url);
    const raw = url.searchParams.get("limit");
    if (raw) limit = Math.min(5000, Math.max(1, Number.parseInt(raw, 10) || 1000));
  } catch { /* ignore */ }

  const t0 = Date.now();
  safeServerLog("cron", "question_quality_started", { limit });

  try {
    const result = await computeQuestionPsychometricsBatch({ limit });
    const durationMs = Date.now() - t0;

    safeServerLog("cron", "question_quality_complete", {
      durationMs,
      computed: result.computed,
      flagged: result.flagged,
      criticalFlags: result.criticalFlags,
      autoDisabled: result.autoDisabled,
      errors: result.errors,
    });

    return NextResponse.json({ ok: true, durationMs, ...result });
  } catch (e) {
    safeServerLog("cron", "question_quality_failed", { error: String(e) });
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
