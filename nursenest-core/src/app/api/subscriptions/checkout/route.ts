import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LEGAL_POLICY_BUNDLE_VERSION } from "@/lib/legal/legal-config";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { recordCheckoutFailure } from "@/lib/observability/production-signal-metrics";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { publicAppOriginForBilling } from "@/lib/env/public-app-origin";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import {
  stripePriceEnvKey,
  alliedStripePriceEnvKey,
  STRIPE_TRIAL_DAYS,
  ALLIED_CAREER_KEYS,
  type AlliedCareerKey,
} from "@/lib/pricing/display-catalog";
import {
  CHECKOUT_APP_ORIGIN_MISCONFIGURED_CODE,
  CHECKOUT_DEMO_USER_FORBIDDEN_CODE,
  CHECKOUT_INVALID_PAYLOAD_CODE,
  CHECKOUT_POLICY_VERSION_MISMATCH_CODE,
  CHECKOUT_SESSION_FAILED_CODE,
  CHECKOUT_STRIPE_UNAVAILABLE_CODE,
  CHECKOUT_UNAUTHORIZED_CODE,
  includeStripePriceEnvKeyInCheckoutResponse,
  STRIPE_PRICE_NOT_CONFIGURED_CODE,
} from "@/lib/stripe/checkout-api-diagnostics";
import { findPriceEntry, findAlliedPriceEntry, type BillingDuration } from "@/lib/stripe/pricing-map";
import { JSON_BODY_CHECKOUT, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { getRegionalPricing } from "@/lib/pricing/regional-pricing-map";
import { isGlobalRegionSlug, type GlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { TierCode } from "@prisma/client";

const bodySchema = z.object({
  tier: z.enum(["PRE_NURSING", "NEW_GRAD", "RPN", "LVN_LPN", "RN", "NP", "ALLIED"]),
  duration: z.enum(["monthly", "3-month", "6-month", "yearly"]),
  alliedCareer: z.enum(ALLIED_CAREER_KEYS as unknown as [string, ...string[]]).optional(),
  /** Global region slug for regional pricing (e.g. "philippines", "india"). Falls back to "canada" (CA). */
  region: z.string().optional(),
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
  return runWithApiTelemetry(req, "POST /api/subscriptions/checkout", "billing", async () => {
  try {
    emitStructuredLog("checkout_started", "info", {
      correlationId: correlationIdFromRequest(req),
      route: "/api/subscriptions/checkout",
      method: "POST",
      flow: "billing",
    });
    safeServerLog("stripe_checkout", "checkout_route_entered", { route: "/api/subscriptions/checkout" });

    const session = await auth();
    const userId = sessionUserId(session);
    safeServerLog("stripe_checkout", "checkout_session_state", {
      sessionExists: session ? 1 : 0,
      userIdExists: userId ? 1 : 0,
    });
    if (!userId) {
      safeServerLog("stripe_checkout", "checkout_route_unauthorized", { route: "/api/subscriptions/checkout" });
      recordCheckoutFailure("unauthorized", req);
      const msg = "Sign in required to start checkout.";
      return NextResponse.json(
        { code: CHECKOUT_UNAUTHORIZED_CODE, message: msg, error: msg },
        { status: 401 },
      );
    }

    const demoBlock = await prisma.user.findUnique({
      where: { id: userId },
      select: { isDemoUser: true },
    });
    if (demoBlock?.isDemoUser) {
      recordCheckoutFailure("demo_forbidden", req);
      const msg = "Demo accounts cannot use real billing. Use a full test account for checkout.";
      return NextResponse.json(
        { code: CHECKOUT_DEMO_USER_FORBIDDEN_CODE, message: msg, error: msg },
        { status: 403 },
      );
    }

    setSentryServerContext({ route: "/api/subscriptions/checkout", feature: SERVER_FEATURE.payment, userId });

    const bodyRead = await parseJsonBodyWithLimit(req, JSON_BODY_CHECKOUT);
    if (!bodyRead.ok) {
      const status = bodyRead.response.status;
      if (status === 413) {
        recordCheckoutFailure("invalid_payload", req);
        const msg = "Request too large. Refresh the page and try again.";
        return NextResponse.json(
          { code: CHECKOUT_INVALID_PAYLOAD_CODE, message: msg, error: msg },
          { status: 413 },
        );
      }
      console.error("[stripe_checkout] invalid_json_payload", { status });
      safeServerLog("stripe_checkout", "checkout_invalid_json_payload", { route: "/api/subscriptions/checkout" });
      recordCheckoutFailure("invalid_payload", req);
      const msg = "Invalid checkout request. Refresh the page and try again.";
      return NextResponse.json(
        { code: CHECKOUT_INVALID_PAYLOAD_CODE, message: msg, error: msg },
        { status: 400 },
      );
    }

    const parsed = bodySchema.safeParse(bodyRead.value);
    if (!parsed.success) {
      safeServerLog("stripe_checkout", "checkout_payload_validation_failed", {
        route: "/api/subscriptions/checkout",
        issues: parsed.error.issues.map((issue) => issue.path.join(".")).join(","),
      });
      recordCheckoutFailure("invalid_payload", req);
      const msg = "Invalid checkout request. Refresh the page and try again.";
      return NextResponse.json(
        { code: CHECKOUT_INVALID_PAYLOAD_CODE, message: msg, error: msg },
        { status: 400 },
      );
    }

    const { tier, duration, policyVersion, alliedCareer, region: rawRegion } = parsed.data;

    const resolvedRegion: GlobalRegionSlug | undefined =
      rawRegion && isGlobalRegionSlug(rawRegion) ? rawRegion : undefined;
    const country = resolvedRegion === "us" ? "US" as const : "CA" as const;

    if (tier === "ALLIED" && !alliedCareer) {
      safeServerLog("stripe_checkout", "checkout_missing_allied_career", { tier, duration });
      recordCheckoutFailure("invalid_payload", req);
      const msg = "Please select a specific career line for Allied Health.";
      return NextResponse.json(
        { code: CHECKOUT_INVALID_PAYLOAD_CODE, message: msg, error: msg },
        { status: 400 },
      );
    }

    if (policyVersion !== LEGAL_POLICY_BUNDLE_VERSION) {
      safeServerLog("stripe_checkout", "checkout_policy_version_mismatch", {
        policyVersion,
        expectedPolicyVersion: LEGAL_POLICY_BUNDLE_VERSION,
      });
      recordCheckoutFailure("policy_mismatch", req);
      const msg = "Policy version outdated. Refresh the page and try again.";
      return NextResponse.json(
        { code: CHECKOUT_POLICY_VERSION_MISMATCH_CODE, message: msg, error: msg },
        { status: 400 },
      );
    }

    const tierCode = tier as TierCode;
    const durationCode = duration as BillingDuration;
    const careerKey = alliedCareer as AlliedCareerKey | undefined;
    const requestedPathway = tierCode === "ALLIED" ? (careerKey ?? "ALLIED") : tierCode;
    safeServerLog("stripe_checkout", "checkout_request_selection", {
      tier: tierCode,
      duration: durationCode,
      pathway: requestedPathway,
      region: resolvedRegion ?? "",
    });

    // Try regional pricing first (covers all 18 global markets), fall back to legacy CA/US map
    let priceId: string | undefined;
    let planCode: string | undefined;
    let resolvedCurrency: string = country === "US" ? "USD" : "CAD";

    if (resolvedRegion) {
      const regionalConfig = getRegionalPricing(resolvedRegion);
      const profKey = tierCode === "ALLIED" ? "allied" : "nursing";
      const entry = regionalConfig[profKey][durationCode];
      if (entry.stripePriceId) {
        priceId = entry.stripePriceId;
        planCode = `${resolvedRegion}_${profKey}_${durationCode}`;
        resolvedCurrency = entry.currency;
      }
    }

    // Fall back to legacy CA/US price map if regional didn't resolve
    if (!priceId) {
      const price = tierCode === "ALLIED" && careerKey
        ? findAlliedPriceEntry(country, careerKey, durationCode)
        : findPriceEntry(country, tierCode, durationCode);
      if (price) {
        priceId = price.priceId;
        planCode = price.planCode;
      }
    }

    const missingEnvKey = tierCode === "ALLIED" && careerKey
      ? alliedStripePriceEnvKey(country, careerKey, durationCode)
      : stripePriceEnvKey(country, tierCode, durationCode);
    safeServerLog("stripe_checkout", "checkout_price_resolution", {
      pathway: requestedPathway,
      tier: tierCode,
      duration: durationCode,
      envKey: missingEnvKey,
      priceId: priceId ?? "",
    });

    if (!priceId || !planCode) {
      safeServerLog("stripe_checkout", "rejected_missing_stripe_price_env", {
        tier: String(tier),
        duration: String(duration),
        region: resolvedRegion ?? "none",
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
      recordCheckoutFailure("price_not_configured", req);
      return NextResponse.json(payload, { status: 400 });
    }
    safeServerLog("stripe_checkout", "checkout_price_selected", {
      userId,
      tier,
      duration,
      alliedCareer: careerKey ?? "",
      priceId,
      planCode,
      region: resolvedRegion ?? "",
    });

    const stripe = await getStripeClient();
    if (!stripe) {
      safeServerLog("stripe_checkout", "stripe_client_unavailable", {});
      recordCheckoutFailure("stripe_unavailable", req);
      const msg = "Billing is temporarily unavailable. Try again shortly.";
      return NextResponse.json(
        { code: CHECKOUT_STRIPE_UNAVAILABLE_CODE, message: msg, error: msg },
        { status: 503 },
      );
    }

    const appUrl = publicAppOriginForBilling();
    if (!appUrl) {
      const msg = "Billing URL is not configured. Set NEXT_PUBLIC_APP_URL to your public https origin.";
      safeServerLog("stripe_checkout", "checkout_app_origin_missing", {});
      recordCheckoutFailure("app_origin", req);
      return NextResponse.json(
        { code: CHECKOUT_APP_ORIGIN_MISCONFIGURED_CODE, message: msg, error: msg },
        { status: 503 },
      );
    }

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
      currency: resolvedCurrency,
      tier,
      duration,
      planCode,
      trialDays: String(trialDays),
      app: "nursenest-core",
      legalPolicyVersion: policyVersion,
      legalPoliciesAcceptedAt: acceptedAt.toISOString(),
    };
    if (careerKey) {
      metadata.alliedCareer = careerKey;
    }
    if (resolvedRegion) {
      metadata.region = resolvedRegion;
    }

    const subscriptionData = trialDays > 0
      ? { trial_period_days: trialDays }
      : undefined;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      ...(subscriptionData ? {
        subscription_data: subscriptionData,
        payment_method_collection: "always",
      } : {}),
      ...(existingCustomerId ? { customer: existingCustomerId } : { customer_email: userForCheckout.email }),
      allow_promotion_codes: true,
      success_url: `${appUrl}/app?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      client_reference_id: userId,
      metadata,
    });
    safeServerLog("stripe_checkout", "checkout_session_created_stripe_payload", {
      stripeSessionId: checkoutSession.id,
      mode: checkoutSession.mode,
      status: checkoutSession.status ?? undefined,
      paymentStatus: checkoutSession.payment_status,
      amountSubtotal: checkoutSession.amount_subtotal ?? 0,
      amountTotal: checkoutSession.amount_total ?? 0,
      currency: checkoutSession.currency ?? "",
      trialPeriodDays: subscriptionData?.trial_period_days ?? 0,
      hasSubscriptionDataTrial: Boolean(subscriptionData?.trial_period_days),
      metadataTrialDays: checkoutSession.metadata?.trialDays ?? "",
      urlPresent: Boolean(checkoutSession.url),
      existingCustomer: Boolean(existingCustomerId),
    });
    const checkoutUrl = checkoutSession.url?.trim();
    if (!checkoutUrl) {
      throw new Error("Stripe checkout session did not include a redirect URL.");
    }
    safeServerLog("stripe_checkout", "checkout_session_url_returned", {
      stripeSessionId: checkoutSession.id,
      checkoutUrl,
    });

    void captureServerEvent(analyticsDistinctId(userId), "checkout_session_created", {
      tier: String(tier),
      duration: String(duration),
      alliedCareer: careerKey ?? undefined,
      planCode,
    }).catch(() => {});
    return NextResponse.json({ url: checkoutUrl });
  } catch (e) {
    console.error("[stripe_checkout] unhandled_checkout_error", e);
    safeServerLog("stripe_checkout", "checkout_session_create_failed", {
      route: "/api/subscriptions/checkout",
    });
    safeServerLogCritical(
      "stripe_checkout",
      "stripe_checkout_session_failed",
      { route: "/api/subscriptions/checkout" },
      e,
    );
    recordCheckoutFailure("session_failed", req);
    const msg = "Unable to start checkout. Try again shortly.";
    return NextResponse.json(
      { code: CHECKOUT_SESSION_FAILED_CODE, message: msg, error: msg },
      { status: 503 },
    );
  }
  });
}
