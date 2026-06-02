import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { buildRevenueAlertSubject, sendRevenueAlert } from "@/lib/revenue-alerts/revenue-alerts";

export const dynamic = "force-dynamic";

const ACTIONS = new Set(["email", "sms", "subscription", "renewal", "failed_payment", "cancellation"]);

export async function POST(req: Request) {
  await requireAdmin();
  const form = await req.formData();
  const action = String(form.get("action") ?? "");
  if (!ACTIONS.has(action)) {
    return NextResponse.json({ ok: false, error: "invalid_action" }, { status: 400 });
  }

  const base = {
    occurredAt: new Date(),
    userId: process.env.REVENUE_ALERT_AUDIT_USER_ID ?? null,
    tier: "RN",
    planLength: "12-month",
    country: "CA",
    provinceOrState: "ON",
    amountCents: 14900,
    currency: "cad",
    referralSource: "admin_test",
    marketingAttribution: "revenue_alert_center",
    metadata: { simulated: true, action },
  };

  const payload =
    action === "failed_payment"
      ? {
          ...base,
          eventType: "failed_payment" as const,
          subject: buildRevenueAlertSubject("failed_payment"),
          sms: "Failed renewal payment. Follow-up required.",
          failureReason: "Simulated card decline",
          recoveryStatus: "Simulated retry required",
        }
      : action === "cancellation"
        ? {
            ...base,
            eventType: "subscription_cancelled" as const,
            subject: buildRevenueAlertSubject("subscription_cancelled"),
            sms: "Subscription cancelled. RN.",
            cancellationReason: "Admin simulation",
            timeAsSubscriber: "42 days",
            totalRevenueCents: 14900,
          }
        : action === "renewal"
          ? {
              ...base,
              eventType: "subscription_renewal" as const,
              subject: buildRevenueAlertSubject("subscription_renewal"),
              sms: "Subscription renewal. RN. CAD $149.",
              trialOrDirect: "Renewal",
            }
          : {
              ...base,
              eventType: action === "subscription" ? ("new_subscription" as const) : ("test" as const),
              subject:
                action === "subscription" ? buildRevenueAlertSubject("new_subscription") : `NurseNest Revenue Alert Test (${action})`,
              sms:
                action === "sms"
                  ? "NurseNest revenue alert SMS test."
                  : action === "subscription"
                    ? "New RN subscription. 12-month plan. CAD $149."
                    : "NurseNest revenue alert email test.",
              trialOrDirect: "Direct purchase",
            };

  const result = await sendRevenueAlert(payload);
  return NextResponse.redirect(new URL(`/admin/revenue-alerts?test=${encodeURIComponent(action)}&delivered=${result.delivered ? "1" : "0"}`, req.url));
}
