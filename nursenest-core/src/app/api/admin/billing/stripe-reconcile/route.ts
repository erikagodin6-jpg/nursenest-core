import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { emitBillingAudit, prefixUserId } from "@/lib/observability/billing-entitlement-audit";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  runStripeSubscriptionReconciliation,
  summarizeStripeSubscriptionReconciliationReport,
} from "@/lib/stripe/stripe-subscription-reconciliation-run";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Second confirmation for destructive DB alignment (must be sent with `?apply=1`). */
const BILLING_RECONCILE_CONFIRM_HEADER = "x-nn-billing-reconcile-confirm";

const applyBodySchema = z.object({
  /** Required for `?apply=1` — support ticket / incident id, min length. */
  reason: z.string().trim().min(10).max(2000),
  confirmApply: z.literal(true),
});

/**
 * On-demand Stripe ↔ DB reconciliation (same core as `/api/cron/stripe-reconcile`).
 *
 * - Default: **dry run** (no writes). Any authenticated staff may run dry-run.
 * - `?apply=1`: **super-tier only**; requires JSON body `{ reason, confirmApply: true }` and
 *   header `x-nn-billing-reconcile-confirm: 1`. Writes are audited (`admin_reconciliation_invoked` + row-level `reconciliation_*`).
 */
export async function POST(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const correlation = correlationIdFromRequest(req) ?? "";
  const url = new URL(req.url);
  const apply = url.searchParams.get("apply") === "1";
  const full = url.searchParams.get("full") === "1";

  if (apply && gate.admin.tier !== "super") {
    emitBillingAudit("admin_reconciliation_apply_blocked", {
      correlationId: correlation || undefined,
      source: "admin",
      userIdPrefix: prefixUserId(gate.admin.userId),
      actorStaffTier: gate.admin.tier,
      reason: "apply_requires_super_tier",
      severity: "warn",
    });
    return NextResponse.json(
      { error: "Forbidden", code: "billing_reconcile_apply_requires_super" },
      { status: 403 },
    );
  }

  let parsedApplyBody: z.infer<typeof applyBodySchema> | null = null;
  if (apply) {
    const confirm = req.headers.get(BILLING_RECONCILE_CONFIRM_HEADER)?.trim();
    if (confirm !== "1") {
      return NextResponse.json(
        {
          error: "Confirmation header required",
          code: "billing_reconcile_confirm_header",
          hint: `Send ${BILLING_RECONCILE_CONFIRM_HEADER}: 1`,
        },
        { status: 400 },
      );
    }
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ error: "JSON body required for apply", code: "billing_reconcile_body" }, { status: 400 });
    }
    const parsed = applyBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid apply payload",
          code: "billing_reconcile_apply_payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }
    parsedApplyBody = parsed.data;
  }

  safeServerLog("billing_reconcile", "admin_reconcile_invoked", {
    apply: apply ? 1 : 0,
    full: full ? 1 : 0,
    actorTier: gate.admin.tier,
    correlation,
    severity: "info",
  });

  const started = Date.now();
  try {
    const report = await runStripeSubscriptionReconciliation(apply);
    const summary = summarizeStripeSubscriptionReconciliationReport(report);
    const durationMs = Date.now() - started;
    const fatal = !report.stripeConfigured || !report.databaseAvailable;

    const outcomeSummary = [
      `dryRun=${report.dryRun}`,
      `durationMs=${durationMs}`,
      `updated=${report.apply.subscriptionRowsUpdated}`,
      `creates=${report.apply.createsApplied}`,
      `errors=${report.apply.errors.length}`,
    ].join(";");

    emitBillingAudit("admin_reconciliation_invoked", {
      correlationId: correlation || undefined,
      source: "admin",
      userIdPrefix: prefixUserId(gate.admin.userId),
      actorStaffTier: gate.admin.tier,
      operation: apply ? "apply" : "dry_run",
      reason: apply ? parsedApplyBody!.reason.slice(0, 240) : "dry_run",
      newState: fatal ? "fatal_env" : outcomeSummary.slice(0, 240),
    });

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
    emitBillingAudit("admin_reconciliation_invoked", {
      correlationId: correlation || undefined,
      source: "admin",
      userIdPrefix: prefixUserId(gate.admin.userId),
      actorStaffTier: gate.admin.tier,
      operation: apply ? "apply" : "dry_run",
      reason: apply ? parsedApplyBody?.reason.slice(0, 240) ?? "apply" : "dry_run",
      newState: "handler_exception",
      severity: "error",
    });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
