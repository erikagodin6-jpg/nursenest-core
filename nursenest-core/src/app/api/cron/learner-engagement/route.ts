import { NextResponse } from "next/server";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import { runLearnerEngagementEmailBatch } from "@/lib/retention/learner-engagement-email-batch";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Subscriber engagement email worker — schedule from your platform cron with `Authorization: Bearer $CRON_SECRET`.
 * Respects per-user opt-out, demo accounts, staff roles, weekly caps, and per-kind cooldowns.
 */
export async function POST(req: Request) {
  const denied = enforceCronSecretOrResponse(req);
  if (denied) return denied;

  if (process.env.LEARNER_ENGAGEMENT_EMAIL_CRON_ENABLED?.trim() !== "true") {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "Set LEARNER_ENGAGEMENT_EMAIL_CRON_ENABLED=true to run sends.",
    });
  }

  const started = Date.now();
  let take = 40;
  try {
    const u = new URL(req.url);
    const raw = u.searchParams.get("take");
    if (raw) take = Math.min(200, Math.max(1, Number.parseInt(raw, 10) || 40));
  } catch {
    /* ignore */
  }

  try {
    const stats = await runLearnerEngagementEmailBatch({ take });
    safeServerLog("cron", "learner_engagement_done", { durationMs: Date.now() - started, ...stats });
    return NextResponse.json({ ok: true, durationMs: Date.now() - started, stats });
  } catch (e) {
    safeServerLog("cron", "learner_engagement_failed", {
      message: e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200),
    });
    return NextResponse.json({ ok: false, error: "batch_failed" }, { status: 500 });
  }
}
