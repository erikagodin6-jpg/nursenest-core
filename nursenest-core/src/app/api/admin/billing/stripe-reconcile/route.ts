import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  runStripeSubscriptionReconciliation,
  summarizeStripeSubscriptionReconciliationReport,
} from "@/lib/stripe/stripe-subscription-reconciliation-run";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * On-demand Stripe ↔ DB reconciliation (same core as `/api/cron/stripe-reconcile`).
 *
 * - Default: **dry run** (no writes). Pass `?apply=1` to apply repairs (super/support staff only).
 * - Pass `?full=1` for full JSON report (large).
 */
export async function POST(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const correlation = correlationIdFromRequest(req) ?? "";
  const url = new URL(req.url);
  const apply = url.searchParams.get("apply") === "1";
  const full = url.searchParams.get("full") === "1";

  safeServerLog("billing_reconcile", "admin_reconcile_invoked", {
    apply: apply ? 1 : 0,
    full: full ? 1 : 0,
    correlation,
    severity: "info",
  });

  const started = Date.now();
  try {
    const report = await runStripeSubscriptionReconciliation(apply);
    const summary = summarizeStripeSubscriptionReconciliationReport(report);
    const durationMs = Date.now() - started;
    const fatal = !report.stripeConfigured || !report.databaseAvailable;

    return NextResponse.json(
      {
        ok: !fatal,
        durationMs,
        apply,
        dryRun: report.dryRun,
        summary,
        ...(full ? { report } : {}),
      },
      { status: fatal ? 503 : 200 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("billing_reconcile", "admin_reconcile_failed", { message: msg, correlation, severity: "error" });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
