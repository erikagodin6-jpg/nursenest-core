import { NextResponse } from "next/server";
import { SubscriptionStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { publicAppOriginForBilling } from "@/lib/env/public-app-origin";
import { getStripeClient } from "@/lib/stripe/stripe-client";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/billing/portal", feature: SERVER_FEATURE.payment, userId });

  const stripe = await getStripeClient();
  if (!stripe) {
    safeServerLog("billing_portal", "stripe_unavailable", {});
    return NextResponse.json({ error: "Billing portal unavailable." }, { status: 503 });
  }

  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: {
        in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE, SubscriptionStatus.PAST_DUE, SubscriptionStatus.CANCELLED],
      },
    },
    orderBy: { createdAt: "desc" },
    select: { stripeCustomerId: true },
  });

  const customerId = sub?.stripeCustomerId?.trim();
  if (!customerId) {
    return NextResponse.json(
      {
        error: "No Stripe customer on file. Subscribe from pricing first, or contact support if you already paid.",
        code: "NO_CUSTOMER",
      },
      { status: 400 },
    );
  }

  const appUrl = publicAppOriginForBilling();
  if (!appUrl) {
    safeServerLog("billing_portal", "app_origin_missing", {});
    return NextResponse.json(
      { error: "Billing URL is not configured.", code: "APP_ORIGIN_MISCONFIGURED" },
      { status: 503 },
    );
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/app/account/billing?portal=return`,
    });
    void captureServerEvent(analyticsDistinctId(userId), "billing_portal_session_created", {
      source: "billing_page",
    });
    return NextResponse.json({ url: portal.url });
  } catch (e) {
    safeServerLogCritical("billing_portal", "billing_portal_create_failed", { userIdPrefix: userId.slice(0, 8) }, e);
    return NextResponse.json({ error: "Could not open billing portal." }, { status: 503 });
  }
}
