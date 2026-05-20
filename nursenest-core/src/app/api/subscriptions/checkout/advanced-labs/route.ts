import { NextResponse } from "next/server";
import { SubscriptionStatus } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LEGAL_POLICY_BUNDLE_VERSION } from "@/lib/legal/legal-config";
import { publicAppOriginForBilling } from "@/lib/env/public-app-origin";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import {
  CHECKOUT_APP_ORIGIN_MISCONFIGURED_CODE,
  CHECKOUT_INVALID_PAYLOAD_CODE,
  CHECKOUT_POLICY_VERSION_MISMATCH_CODE,
  CHECKOUT_SESSION_FAILED_CODE,
  CHECKOUT_STRIPE_UNAVAILABLE_CODE,
  CHECKOUT_UNAUTHORIZED_CODE,
  includeStripePriceEnvKeyInCheckoutResponse,
  STRIPE_PRICE_NOT_CONFIGURED_CODE,
} from "@/lib/stripe/checkout-api-diagnostics";
import { loadCanonicalLearnerAccessForUserId } from "@/lib/entitlements/canonical-learner-access.server";
import {
  ADVANCED_LABS_ENTITLEMENT,
  ADVANCED_LABS_PLAN_CODE,
  advancedLabsStripePriceEnvKey,
  isAdvancedLabsTierEligible,
  isAdvancedLabsPlanCode,
} from "@/lib/advanced-labs/advanced-labs-module-config";
import { hasActiveAdvancedLabsEntitlementFromRows } from "@/lib/advanced-labs/advanced-labs-access";

const bodySchema = z
  .object({
    acceptPolicies: z.literal(true),
    policyVersion: z.string().min(1).max(64),
  })
  .strict();

function sessionUserId(session: { user?: unknown } | null): string | undefined {
  const u = session?.user;
  if (
    u &&
    typeof u === "object" &&
    "id" in u &&
    typeof (u as { id: unknown }).id === "string"
  ) {
    return (u as { id: string }).id;
  }
  return undefined;
}

function hasActiveAdvancedLabsFromRows(
  rows: readonly {
    status: SubscriptionStatus;
    planCode: string | null;
    currentPeriodEnd: Date | null;
    trialEnd: Date | null;
    updatedAt: Date;
  }[],
): boolean {
  return rows.some(
    (row) =>
      isAdvancedLabsPlanCode(row.planCode) &&
      row.status === SubscriptionStatus.ACTIVE,
  );
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = sessionUserId(session);
    if (!userId) {
      return NextResponse.json(
        {
          code: CHECKOUT_UNAUTHORIZED_CODE,
          message: "Sign in required to start checkout.",
          error: "Sign in required to start checkout.",
        },
        { status: 401 },
      );
    }

    const body = bodySchema.safeParse(await req.json().catch(() => null));
    if (!body.success) {
      return NextResponse.json(
        {
          code: CHECKOUT_INVALID_PAYLOAD_CODE,
          message: "Invalid checkout request. Refresh the page and try again.",
          error: "Invalid checkout request. Refresh the page and try again.",
        },
        { status: 400 },
      );
    }

    if (body.data.policyVersion !== LEGAL_POLICY_BUNDLE_VERSION) {
      return NextResponse.json(
        {
          code: CHECKOUT_POLICY_VERSION_MISMATCH_CODE,
          message: "Policy version outdated. Refresh the page and try again.",
          error: "Policy version outdated. Refresh the page and try again.",
        },
        { status: 400 },
      );
    }

    const canonicalAccess = await loadCanonicalLearnerAccessForUserId(userId);
    if (!canonicalAccess.hasAccess) {
      return NextResponse.json(
        {
          code: CHECKOUT_INVALID_PAYLOAD_CODE,
          message:
            "An active base learner subscription is required before purchasing Advanced Labs Interpretation.",
          error:
            "An active base learner subscription is required before purchasing Advanced Labs Interpretation.",
        },
        { status: 403 },
      );
    }
    if (!isAdvancedLabsTierEligible(canonicalAccess.tier)) {
      return NextResponse.json(
        {
          code: CHECKOUT_INVALID_PAYLOAD_CODE,
          message:
            "Advanced Labs Interpretation is currently available only for RN and NP learners.",
          error:
            "Advanced Labs Interpretation is currently available only for RN and NP learners.",
        },
        { status: 403 },
      );
    }

    const existingRows = await prisma.subscription.findMany({
      where: {
        userId,
        status: {
          in: [
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.GRACE,
            SubscriptionStatus.PAST_DUE,
            SubscriptionStatus.CANCELLED,
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 16,
      select: {
        status: true,
        planCode: true,
        currentPeriodEnd: true,
        trialEnd: true,
        updatedAt: true,
      },
    });

    if (hasActiveAdvancedLabsFromRows(existingRows)) {
      return NextResponse.json(
        {
          code: CHECKOUT_INVALID_PAYLOAD_CODE,
          message: "Advanced Labs Interpretation is already active on this account.",
          error: "Advanced Labs Interpretation is already active on this account.",
        },
        { status: 409 },
      );
    }

    const priceEnvKey = advancedLabsStripePriceEnvKey();
    const priceId = process.env[priceEnvKey]?.trim();
    if (!priceId || priceId.toUpperCase().includes("PLACEHOLDER")) {
      const payload: Record<string, string> = {
        code: STRIPE_PRICE_NOT_CONFIGURED_CODE,
        message:
          "Advanced Labs Interpretation is not available for checkout yet. Billing configuration is incomplete.",
        error:
          "Advanced Labs Interpretation is not available for checkout yet. Billing configuration is incomplete.",
      };
      if (includeStripePriceEnvKeyInCheckoutResponse()) payload.envKey = priceEnvKey;
      return NextResponse.json(payload, { status: 400 });
    }

    const stripe = await getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        {
          code: CHECKOUT_STRIPE_UNAVAILABLE_CODE,
          message: "Billing is temporarily unavailable. Try again shortly.",
          error: "Billing is temporarily unavailable. Try again shortly.",
        },
        { status: 503 },
      );
    }

    const appUrl = publicAppOriginForBilling();
    if (!appUrl) {
      return NextResponse.json(
        {
          code: CHECKOUT_APP_ORIGIN_MISCONFIGURED_CODE,
          message:
            "Billing URL is not configured. Set NEXT_PUBLIC_APP_URL to your public https origin.",
          error:
            "Billing URL is not configured. Set NEXT_PUBLIC_APP_URL to your public https origin.",
        },
        { status: 503 },
      );
    }

    const acceptedAt = new Date();
    const userForCheckout = await prisma.user.update({
      where: { id: userId },
      data: {
        legalPoliciesAcceptedAt: acceptedAt,
        legalPoliciesVersion: body.data.policyVersion,
      },
      select: { email: true },
    });

    const existingCustomer = await prisma.subscription.findFirst({
      where: { userId, stripeCustomerId: { not: "" } },
      orderBy: { createdAt: "desc" },
      select: { stripeCustomerId: true },
    });

    const metadata = {
      userId,
      planCode: ADVANCED_LABS_PLAN_CODE,
      moduleKey: "advanced_labs",
      moduleEntitlement: ADVANCED_LABS_ENTITLEMENT,
      moduleType: "one_time_add_on",
      productSlug: "advanced-labs-interpretation",
      entitlement: ADVANCED_LABS_ENTITLEMENT,
      pathway: "advanced-labs",
      userTier: canonicalAccess.tier ?? "",
      baseTierAtCheckout: canonicalAccess.tier ?? "",
      baseCountryAtCheckout: canonicalAccess.country ?? "",
      app: "nursenest-core",
      legalPolicyVersion: body.data.policyVersion,
      legalPoliciesAcceptedAt: acceptedAt.toISOString(),
    };

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      ...(existingCustomer?.stripeCustomerId?.trim()
        ? { customer: existingCustomer.stripeCustomerId.trim() }
        : { customer_email: userForCheckout.email }),
      allow_promotion_codes: true,
      success_url: `${appUrl}/modules/labs-advanced?checkout=success`,
      cancel_url: `${appUrl}/advanced-labs-interpretation?checkout=cancelled`,
      client_reference_id: userId,
      metadata,
      payment_intent_data: { metadata },
    });

    const checkoutUrl = checkoutSession.url?.trim();
    if (!checkoutUrl) {
      throw new Error("Stripe checkout session did not include a redirect URL.");
    }

    // Track entitlement state for idempotency (webhook will be the authoritative grant)
    void hasActiveAdvancedLabsEntitlementFromRows(existingRows);

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    safeServerLog("stripe_checkout", "advanced_labs_checkout_failed", {
      detail:
        error instanceof Error ? error.message.slice(0, 180) : "unknown",
    });
    return NextResponse.json(
      {
        code: CHECKOUT_SESSION_FAILED_CODE,
        message: "Unable to start checkout. Try again shortly.",
        error: "Unable to start checkout. Try again shortly.",
      },
      { status: 503 },
    );
  }
}
