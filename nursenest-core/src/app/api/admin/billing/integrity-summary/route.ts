import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadEntitlementDriftSignals } from "@/lib/billing/entitlement-drift-signals.server";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

/**
 * Admin-only JSON summary of DB-side entitlement drift **signals** (no auto-fix).
 * Optional `?emitLog=1` emits `entitlement_drift_suspected` once per request when severity ≠ ok.
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const correlation = correlationIdFromRequest(req) ?? "";
  const emitLog = new URL(req.url).searchParams.get("emitLog") === "1";

  const summary = await loadEntitlementDriftSignals();

  if (emitLog && summary.severity !== "ok") {
    safeServerLog("entitlement", "entitlement_drift_suspected", {
      severity: summary.severity,
      activeLikeMissingStripeCustomer: summary.signals.activeLikeMissingStripeCustomer,
      activeLikeTierMismatchUser: summary.signals.activeLikeTierMismatchUser,
      recentWebhookEvents24h: summary.signals.recentWebhookEvents24h ?? -1,
      correlation,
      outcome: "report_only",
    });
  }

  return NextResponse.json(summary);
}
