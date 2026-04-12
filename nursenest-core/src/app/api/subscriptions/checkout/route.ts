import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LEGAL_POLICY_BUNDLE_VERSION } from "@/lib/legal/legal-config";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import {
  stripePriceEnvKey,
  alliedStripePriceEnvKey,
  STRIPE_TRIAL_DAYS,
  ALLIED_CAREER_KEYS,
  type AlliedCareerKey,
} from "@/lib/pricing/display-catalog";
import {
  CHECKOUT_INVALID_PAYLOAD_CODE,
  CHECKOUT_POLICY_VERSION_MISMATCH_CODE,
  CHECKOUT_SESSION_FAILED_CODE,
  CHECKOUT_STRIPE_UNAVAILABLE_CODE,
  CHECKOUT_UNAUTHORIZED_CODE,
  includeStripePriceEnvKeyInCheckoutResponse,
  STRIPE_PRICE_NOT_CONFIGURED_CODE,
} from "@/lib/stripe/checkout-api-diagnostics";
import { findPriceEntry, findAlliedPriceEntry, type BillingDuration } from "@/lib/stripe/pricing-map";
import type { TierCode } from "@prisma/client";

const bodySchema = z.object({
  tier: z.enum(["PRE_NURSING", "NEW_GRAD", "RPN", "LVN_LPN", "RN", "NP", "ALLIED"]),
  duration: z.enum(["monthly", "3-month", "6-month", "yearly"]),
  alliedCareer: z.enum(ALLIED_CAREER_KEYS as unknown as [string, ...string[]]).optional(),
  acceptPolicies: z.literal(true),
  policyVersion: z.string().min(1).max(64),
});

function sessionUserId(session: { user?: unknown } | null): string | undefined {
  const u = session?.user;
  if (u && typeof u === "object" && "id" in u && typeof (u as { id: unknown }).id === "string") {
    return (u as { id: string }).id;
  }
  return undefined;
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = sessionUserId(session);
  if (!userId) {
    const msg = "Sign in required to start checkout.";
    return NextResponse.json(
      { code: CHECKOUT_UNAUTHORIZED_CODE, message: msg, error: msg },
      { status: 401 },
    );
  }

  setSentryServerContext({ route: "/api/subscriptions/checkout", feature: SERVER_FEATURE.payment, userId });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    const msg = "Invalid checkout request. Refresh the page and try again.";
    return NextResponse.json(
      { code: CHECKOUT_INVALID_PAYLOAD_CODE, message: msg, error: msg },
      { status: 400 },
    );
  }

  const { tier, duration, policyVersion, alliedCareer } = parsed.data;
  const country = "CA" as const;

  if (tier === "ALLIED" && !alliedCareer) {
    const msg = "Please select a specific career line for Allied Health.";
    return NextResponse.json(
      { code: CHECKOUT_INVALID_PAYLOAD_CODE, message: msg, error: msg },
      { status: 400 },
    );
  }

  if (policyVersion !== LEGAL_POLICY_BUNDLE_VERSION) {
    const msg = "Policy version outdated. Refresh the page and try again.";
    return NextResponse.json(
      { code: CHECKOUT_POLICY_VERSION_MISMATCH_CODE, message: msg, error: msg },
      { status: 400 },
    );
  }

  const tierCode = tier as TierCode;
  const durationCode = duration as BillingDuration;
  const careerKey = alliedCareer as AlliedCareerKey | undefined;

  const price = tierCode === "ALLIED" && careerKey
    ? findAlliedPriceEntry(country, careerKey, durationCode)
    : findPriceEntry(country, tierCode, durationCode);

  const missingEnvKey = tierCode === "ALLIED" && careerKey
    ? alliedStripePriceEnvKey(country, careerKey, durationCode)
    : stripePriceEnvKey(country, tierCode, durationCode);

  if (!price) {
    safeServerLog("stripe_checkout", "rejected_missing_stripe_price_env", {
      tier: String(tier),
      duration: String(duration),
      alliedCareer: careerKey ?? "",
      envKey: missingEnvKey.slice(0, 80),
    });
    const msg = "This plan is not available for checkout. Billing configuration is incomplete.";
    const payload: Record<string, string> = {
      code: STRIPE_PRICE_NOT_CONFIGURED_CODE,
      message: msg,
      error: msg,
    };
    if (includeStripePriceEnvKeyInCheckoutResponse()) {
      payload.envKey = missingEnvKey;
    }
    return NextResponse.json(payload, { status: 400 });
  }

  const stripe = await getStripeClient();
  if (!stripe) {
    safeServerLog("stripe_checkout", "stripe_client_unavailable", {});
    const msg = "Billing is temporarily unavailable. Try again shortly.";
    return NextResponse.json(
      { code: CHECKOUT_STRIPE_UNAVAILABLE_CODE, message: msg, error: msg },
      { status: 503 },
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

  try {
    const acceptedAt = new Date();
    const userForCheckout = await prisma.user.update({
      where: { id: userId },
      data: {
        legalPoliciesAcceptedAt: acceptedAt,
        legalPoliciesVersion: policyVersion,
      },
      select: { email: true, learnerPath: true },
    });

    const existingSub = await prisma.subscription.findFirst({
      where: { userId, stripeCustomerId: { not: "" } },
      orderBy: { createdAt: "desc" },
      select: { stripeCustomerId: true },
    });
    const existingCustomerId = existingSub?.stripeCustomerId?.trim() || undefined;

    const trialDays = STRIPE_TRIAL_DAYS;
    const metadata: Record<string, string> = {
      userId,
      country,
      currency: "CAD",
      tier,
      duration,
      planCode: price.planCode,
      trialDays: String(trialDays),
      app: "nursenest-core",
      legalPolicyVersion: policyVersion,
      legalPoliciesAcceptedAt: acceptedAt.toISOString(),
    };
    if (careerKey) {
      metadata.alliedCareer = careerKey;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: price.priceId, quantity: 1 }],
      ...(trialDays > 0 ? {
        subscription_data: { trial_period_days: trialDays },
        payment_method_collection: "always",
      } : {}),
      ...(existingCustomerId ? { customer: existingCustomerId } : { customer_email: userForCheckout.email }),
      allow_promotion_codes: true,
      success_url: `${appUrl}/app?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      client_reference_id: userId,
      metadata,
    });

    await captureServerEvent(analyticsDistinctId(userId), "checkout_session_created", {
      tier: String(tier),
      duration: String(duration),
      alliedCareer: careerKey ?? undefined,
      planCode: price.planCode,
    });
    return NextResponse.json({ url: checkoutSession.url });
  } catch (e) {
    safeServerLog("stripe_checkout", "checkout_session_create_failed", {
      tier: String(tier),
      duration: String(duration),
      alliedCareer: careerKey ?? "",
    });
    safeServerLogCritical(
      "stripe_checkout",
      "stripe_checkout_session_failed",
      { tier: String(tier), duration: String(duration) },
      e,
    );
    const msg = "Unable to start checkout. Try again shortly.";
    return NextResponse.json(
      { code: CHECKOUT_SESSION_FAILED_CODE, message: msg, error: msg },
      { status: 503 },
    );
  }
}
