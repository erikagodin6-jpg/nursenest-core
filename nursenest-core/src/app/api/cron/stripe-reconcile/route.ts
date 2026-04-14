import { NextResponse } from "next/server";
import {
  runStripeSubscriptionReconciliation,
  summarizeStripeSubscriptionReconciliationReport,
} from "@/lib/stripe/stripe-subscription-reconciliation-run";
import { CronAdvisoryLock, releaseCronAdvisoryLock, tryAcquireCronAdvisoryLock } from "@/lib/cron/cron-advisory-lock";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Daily Stripe ↔ DB reconciliation. Set `STRIPE_RECONCILE_CRON_APPLY=true` to apply safe updates (same as CLI `--apply`).
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const lockId = CronAdvisoryLock.stripeReconcile;
  const acquired = await tryAcquireCronAdvisoryLock(lockId);
  if (!acquired) {
    safeServerLog("cron", "stripe_reconcile_skipped_overlap", {});
    return NextResponse.json({ ok: true, skipped: true, reason: "advisory_lock_held" });
  }

  const started = Date.now();
  try {
    const apply = process.env.STRIPE_RECONCILE_CRON_APPLY?.trim() === "true";
    const report = await runStripeSubscriptionReconciliation(apply);
    const summary = summarizeStripeSubscriptionReconciliationReport(report);
    const durationMs = Date.now() - started;

    safeServerLog("cron", "stripe_reconcile_complete", {
      durationMs,
      dryRun: report.dryRun,
      summary: JSON.stringify(summary),
      errorCount: report.apply.errors.length,
    });

    const fatal = !report.stripeConfigured || !report.databaseAvailable;
    const url = new URL(req.url);
    const full = url.searchParams.get("full") === "1";
    return NextResponse.json(
      {
        ok: !fatal,
        durationMs,
        apply,
        summary,
        ...(full ? { report } : {}),
      },
      { status: fatal ? 503 : 200 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("cron", "stripe_reconcile_failed", { message: msg });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  } finally {
    await releaseCronAdvisoryLock(lockId);
  }
}
