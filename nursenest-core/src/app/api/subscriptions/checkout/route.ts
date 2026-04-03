import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LEGAL_POLICY_BUNDLE_VERSION } from "@/lib/legal/legal-config";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { stripePriceEnvKey } from "@/lib/pricing/display-catalog";
import {
  CHECKOUT_INVALID_PAYLOAD_CODE,
  CHECKOUT_POLICY_VERSION_MISMATCH_CODE,
  CHECKOUT_SESSION_FAILED_CODE,
  CHECKOUT_STRIPE_UNAVAILABLE_CODE,
  CHECKOUT_UNAUTHORIZED_CODE,
  includeStripePriceEnvKeyInCheckoutResponse,
  STRIPE_PRICE_NOT_CONFIGURED_CODE,
} from "@/lib/stripe/checkout-api-diagnostics";
import { findPriceEntry, type BillingDuration } from "@/lib/stripe/pricing-map";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { TierCode } from "@prisma/client";

/** Dynamic import so Next build (collect page data) never loads Stripe without a key. */
async function getStripeClient(): Promise<Stripe | null> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  const { default: Stripe } = await import("stripe");
  return new Stripe(key);
}

const bodySchema = z.object({
  country: z.enum(["CA", "US"]),
  tier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]),
  duration: z.enum(["monthly", "3-month", "6-month", "yearly"]),
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

  const { country, tier, duration, policyVersion } = parsed.data;
  if (policyVersion !== LEGAL_POLICY_BUNDLE_VERSION) {
    const msg = "Policy version outdated. Refresh the page and try again.";
    return NextResponse.json(
      { code: CHECKOUT_POLICY_VERSION_MISMATCH_CODE, message: msg, error: msg },
      { status: 400 },
    );
  }
  const tierCode = tier as TierCode;
  const durationCode = duration as BillingDuration;
  const price = findPriceEntry(country, tierCode, durationCode);
  const missingEnvKey = stripePriceEnvKey(country, tierCode, durationCode);
  if (!price) {
    safeServerLog("stripe_checkout", "rejected_missing_stripe_price_env", {
      country,
      tier: String(tier),
      duration: String(duration),
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
    await prisma.user.update({
      where: { id: userId },
      data: {
        legalPoliciesAcceptedAt: acceptedAt,
        legalPoliciesVersion: policyVersion,
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: price.priceId, quantity: 1 }],
      success_url: `${appUrl}/app?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      client_reference_id: userId,
      metadata: {
        userId,
        country,
        tier,
        duration,
        app: "nursenest-core",
        legalPolicyVersion: policyVersion,
        legalPoliciesAcceptedAt: acceptedAt.toISOString(),
      },
    });

    await captureServerEvent(analyticsDistinctId(userId), "checkout_session_created", {
      country,
      tier: String(tier),
      duration: String(duration),
    });
    return NextResponse.json({ url: checkoutSession.url });
  } catch (e) {
    safeServerLog("stripe_checkout", "checkout_session_create_failed", {
      country,
      tier: String(tier),
      duration: String(duration),
    });
    safeServerLogCritical(
      "stripe_checkout",
      "stripe_checkout_session_failed",
      { country, tier: String(tier), duration: String(duration) },
      e,
    );
    const msg = "Unable to start checkout. Try again shortly.";
    return NextResponse.json(
      { code: CHECKOUT_SESSION_FAILED_CODE, message: msg, error: msg },
      { status: 503 },
    );
  }
}
