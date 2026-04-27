import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { billingLifecycleFields } from "@/lib/stripe/stripe-subscription-field-map";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import {
  canUserCancelStripeSubscription,
  persistStripeSubscriptionMirrorForUser,
  reconcileUserSubscriptionFromStripe,
} from "@/lib/subscriptions/stripe-subscription-reconcile";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/billing/cancel-subscription", "billing", async () => {
    const correlation = correlationIdFromRequest(req) ?? "";
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const userRow = await prisma.user.findUnique({ where: { id: userId }, select: { isDemoUser: true } });
    if (userRow?.isDemoUser) {
      return NextResponse.json(
        { ok: false, error: "Demo accounts cannot modify billing.", code: "DEMO_FORBIDDEN" },
        { status: 403 },
      );
    }

    setSentryServerContext({ route: "/api/billing/cancel-subscription", feature: SERVER_FEATURE.payment, userId });

    safeServerLog("subscription_cancel", "cancel_route_enter", {
      userIdPrefix: userId.slice(0, 8),
      correlation,
      severity: "info",
    });

    const stripe = await getStripeClient();
    if (!stripe) {
      return NextResponse.json({ ok: false, error: "Billing unavailable.", code: "STRIPE_UNAVAILABLE" }, { status: 503 });
    }

    const localBefore = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { stripeSubscriptionId: true, status: true, cancelAtPeriodEnd: true },
    });
    safeServerLog("subscription_cancel", "local_state_before_reconcile", {
      userIdPrefix: userId.slice(0, 8),
      correlation,
      localRowsJson: JSON.stringify(
        localBefore.map((r) => ({
          stripeSubscriptionIdPrefix: r.stripeSubscriptionId.slice(0, 12),
          status: r.status,
          cancelAtPeriodEnd: r.cancelAtPeriodEnd,
        })),
      ).slice(0, 900),
      severity: "info",
    });

    const { stripeSubscription } = await reconcileUserSubscriptionFromStripe(userId, {
      surface: "cancel_subscription_api",
    });
    if (!stripeSubscription || !canUserCancelStripeSubscription(stripeSubscription)) {
      safeServerLog("subscription_cancel", "no_active_subscription_for_cancel", {
        userIdPrefix: userId.slice(0, 8),
        correlation,
        hadStripeObject: stripeSubscription ? 1 : 0,
        stripeStatus: stripeSubscription?.status,
        severity: "info",
      });
      return NextResponse.json(
        {
          ok: false,
          error: "No active subscription found to cancel. If you believe this is wrong, contact support.",
          code: "NO_ACTIVE_SUBSCRIPTION",
        },
        { status: 400 },
      );
    }

    let updated: import("stripe").Stripe.Subscription;
    try {
      updated = await stripe.subscriptions.update(stripeSubscription.id, { cancel_at_period_end: true });
    } catch (e) {
      safeServerLogCritical(
        "subscription_cancel",
        "stripe_cancel_at_period_end_failed",
        {
          userIdPrefix: userId.slice(0, 8),
          stripeSubscriptionIdPrefix: stripeSubscription.id.slice(0, 14),
          correlation,
        },
        e,
      );
      return NextResponse.json(
        { ok: false, error: "Could not schedule cancellation.", code: "STRIPE_ERROR" },
        { status: 503 },
      );
    }

    await persistStripeSubscriptionMirrorForUser(userId, updated);

    const lifecycle = billingLifecycleFields(updated);
    const canceledAtUnix = (updated as unknown as { canceled_at?: number | null }).canceled_at;

    safeServerLog("subscription_cancel", "cancel_at_period_end_success", {
      userIdPrefix: userId.slice(0, 8),
      correlation,
      stripeSubscriptionIdPrefix: updated.id.slice(0, 14),
      stripeStatus: updated.status,
      cancelAtPeriodEnd: updated.cancel_at_period_end ? 1 : 0,
      severity: "info",
    });

    return NextResponse.json({
      ok: true,
      code: "CANCEL_SCHEDULED",
      stripeSubscriptionId: updated.id,
      status: updated.status,
      cancelAtPeriodEnd: updated.cancel_at_period_end,
      canceledAt:
        typeof canceledAtUnix === "number" && canceledAtUnix > 0 ? new Date(canceledAtUnix * 1000).toISOString() : null,
      currentPeriodEnd: lifecycle.currentPeriodEnd ? lifecycle.currentPeriodEnd.toISOString() : null,
    });
  });
}
