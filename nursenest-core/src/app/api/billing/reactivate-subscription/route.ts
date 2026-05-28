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
  canUserReactivateStripeSubscription,
  persistStripeSubscriptionMirrorForUser,
  reconcileUserSubscriptionFromStripe,
} from "@/lib/subscriptions/stripe-subscription-reconcile";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/billing/reactivate-subscription", "billing", async () => {
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

    setSentryServerContext({ route: "/api/billing/reactivate-subscription", feature: SERVER_FEATURE.payment, userId });

    safeServerLog("subscription_reactivate", "reactivate_route_enter", {
      userIdPrefix: userId.slice(0, 8),
      correlation,
      severity: "info",
    });

    const stripe = await getStripeClient();
    if (!stripe) {
      return NextResponse.json({ ok: false, error: "Billing unavailable.", code: "STRIPE_UNAVAILABLE" }, { status: 503 });
    }

    const { stripeSubscription } = await reconcileUserSubscriptionFromStripe(userId, {
      surface: "reactivate_subscription_api",
    });
    if (!stripeSubscription || !canUserReactivateStripeSubscription(stripeSubscription)) {
      safeServerLog("subscription_reactivate", "no_scheduled_cancel_for_reactivate", {
        userIdPrefix: userId.slice(0, 8),
        correlation,
        hadStripeObject: stripeSubscription ? 1 : 0,
        stripeStatus: stripeSubscription?.status,
        cancelAtPeriodEnd: stripeSubscription?.cancel_at_period_end ? 1 : 0,
        severity: "info",
      });
      return NextResponse.json(
        {
          ok: false,
          error: "No scheduled cancellation found to reactivate.",
          code: "NO_SCHEDULED_CANCELLATION",
        },
        { status: 400 },
      );
    }

    let updated: import("stripe").Stripe.Subscription;
    try {
      updated = await stripe.subscriptions.update(stripeSubscription.id, { cancel_at_period_end: false });
    } catch (e) {
      safeServerLogCritical(
        "subscription_reactivate",
        "stripe_reactivate_failed",
        {
          userIdPrefix: userId.slice(0, 8),
          stripeSubscriptionIdPrefix: stripeSubscription.id.slice(0, 14),
          correlation,
        },
        e,
      );
      return NextResponse.json(
        { ok: false, error: "Could not reactivate your subscription.", code: "STRIPE_ERROR" },
        { status: 503 },
      );
    }

    await persistStripeSubscriptionMirrorForUser(userId, updated);

    const lifecycle = billingLifecycleFields(updated);

    safeServerLog("subscription_reactivate", "reactivate_success", {
      userIdPrefix: userId.slice(0, 8),
      correlation,
      stripeSubscriptionIdPrefix: updated.id.slice(0, 14),
      stripeStatus: updated.status,
      cancelAtPeriodEnd: updated.cancel_at_period_end ? 1 : 0,
      severity: "info",
    });

    return NextResponse.json({
      ok: true,
      code: "SUBSCRIPTION_REACTIVATED",
      stripeSubscriptionId: updated.id,
      status: updated.status,
      cancelAtPeriodEnd: updated.cancel_at_period_end,
      currentPeriodEnd: lifecycle.currentPeriodEnd ? lifecycle.currentPeriodEnd.toISOString() : null,
    });
  });
}
