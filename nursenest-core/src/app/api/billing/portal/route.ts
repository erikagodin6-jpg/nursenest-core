import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { serverLearnerPosthogDisabledForVerifiedQaUser } from "@/lib/observability/admin-learner-qa-analytics";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { publicAppOriginForBilling } from "@/lib/env/public-app-origin";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import { reconcileUserSubscriptionFromStripe } from "@/lib/subscriptions/stripe-subscription-reconcile";
import { SUPPORT_EMAIL, SUPPORT_RESPONSE_TIME_COPY } from "@/lib/support/support-policy";

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

  let customerRow = await prisma.subscription.findFirst({
    where: { userId, stripeCustomerId: { not: null } },
    orderBy: { createdAt: "desc" },
    select: { stripeCustomerId: true },
  });

  let customerId = customerRow?.stripeCustomerId?.trim();
  if (!customerId) {
    await reconcileUserSubscriptionFromStripe(userId, { surface: "billing_portal" });
    customerRow = await prisma.subscription.findFirst({
      where: { userId, stripeCustomerId: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { stripeCustomerId: true },
    });
    customerId = customerRow?.stripeCustomerId?.trim();
  }
  if (!customerId) {
    return NextResponse.json(
      {
        error: `No Stripe customer on file. Subscribe from pricing first, or email ${SUPPORT_EMAIL} if you already paid. ${SUPPORT_RESPONSE_TIME_COPY}`,
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
    if (!(await serverLearnerPosthogDisabledForVerifiedQaUser(userId))) {
      void captureServerEvent(analyticsDistinctId(userId), "billing_portal_session_created", {
        source: "billing_page",
      });
    }
    return NextResponse.json({ url: portal.url });
  } catch (e) {
    safeServerLogCritical("billing_portal", "billing_portal_create_failed", { userIdPrefix: userId.slice(0, 8) }, e);
    return NextResponse.json({ error: "Could not open billing portal." }, { status: 503 });
  }
}
