import { cookies } from "next/headers";
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
import { emitBillingAudit, prefixUserId } from "@/lib/observability/billing-entitlement-audit";
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
  CHECKOUT_NA_BILLING_SCOPE_ACK_REQUIRED_CODE,
  CHECKOUT_NA_BILLING_SCOPE_ACK_REQUIRED_MESSAGE,
  CHECKOUT_POLICY_VERSION_MISMATCH_CODE,
  CHECKOUT_SESSION_FAILED_CODE,
  CHECKOUT_STRIPE_UNAVAILABLE_CODE,
  CHECKOUT_UNAUTHORIZED_CODE,
  includeStripePriceEnvKeyInCheckoutResponse,
  STRIPE_PRICE_NOT_CONFIGURED_CODE,
} from "@/lib/stripe/checkout-api-diagnostics";
import { naBillingScopeAckRequiredForCheckout } from "@/lib/stripe/checkout-na-billing-scope-gate";
import { findPriceEntry, findAlliedPriceEntry, type BillingDuration } from "@/lib/stripe/pricing-map";
import { JSON_BODY_CHECKOUT, parseJsonBodyWithLimit } from "@/lib/http/json-body-limit";
import { getRegionalPricing } from "@/lib/pricing/regional-pricing-map";
import { isGlobalRegionSlug, type GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { GLOBAL_REGION_COOKIE, parseGlobalRegionCookie } from "@/lib/region/global-region-cookie";
import {
  checkoutRegionGateTelemetry,
  collectAuthoritativeCheckoutGlobalRegionSlugs,
  GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE,
} from "@/lib/region/checkout-global-region-context";
import type { TierCode } from "@prisma/client";

/**
 * Stripe Checkout: **line_items** use Price IDs resolved only from server env maps (`pricing-map`, `regional-pricing-map`).
 * No client `price_id`. Premium access is granted by webhooks into `Subscription`, not by `success_url` query params.
 */
/** Strict: rejects client-supplied price IDs, amounts, or other undeclared fields — only enum selections the server maps to env-backed Stripe Prices. */
const bodySchema = z
  .object({
    tier: z.enum(["PRE_NURSING", "NEW_GRAD", "RPN", "LVN_LPN", "RN", "NP", "ALLIED"]),
    duration: z.enum(["monthly", "3-month", "6-month", "yearly"]),
    alliedCareer: z.enum(ALLIED_CAREER_KEYS as unknown as [string, ...string[]]).optional(),
    /** Global region slug for regional pricing (e.g. "philippines", "india"). Falls back to legacy CA/US map when absent/invalid. */
    region: z.string().optional(),
    acceptPolicies: z.literal(true),
    policyVersion: z.string().min(1).max(64),
    /** Required when any authoritative global region (cookie, signed context, or body) is a partial market — see checkout-na-billing-scope-gate. */
    naBillingScopeAcknowledged: z.literal(true).optional(),
  })
  .strict();

function sessionUserId(session: { user?: unknown } | null): string | undefined {
  const u = session?.user;
  if (u && typeof u === "object" && "id" in u && typeof (u as { id: unknown }).id === "string") {
    return (u as { id: string }).id;
  }
  return undefined;
}

function auditCheckoutFailed(args: {
  correlation: string | undefined;
  reason: string;
  userId?: string;
  severity?: "warn" | "error";
}) {
  emitBillingAudit("checkout_failed", {
    correlationId: args.correlation,
    userIdPrefix: args.userId ? prefixUserId(args.userId) : undefined,
    reason: args.reason,
    source: "checkout",
    severity: args.severity ?? "warn",
  });
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/subscriptions/checkout", "billing", async () => {
  try {
    const correlation = correlationIdFromRequest(req) ?? undefined;
    emitStructuredLog("checkout_started", "info", {
      correlationId: correlation,
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
      auditCheckoutFailed({ correlation, reason: "unauthorized" });
      recordCheckoutFailure("unauthorized", req);
      const msg = "Sign in required to start checkout.";
      return NextResponse.json(
        { code: CHECKOUT_UNAUTHORIZED_CODE, message: msg, error: msg },
        { status: 401 },
      );
    }

    const userCheckoutRow = await prisma.user.findUnique({
      where: { id: userId },
      select: { isDemoUser: true, tier: true, country: true },
    });
    if (userCheckoutRow?.isDemoUser) {
      auditCheckoutFailed({ correlation, reason: "demo_forbidden", userId });
      recordCheckoutFailure("demo_forbidden", req);
      const msg = "Demo accounts cannot use real billing. Use a full test account for checkout.";
      return NextResponse.json(
        { code: CHECKOUT_DEMO_USER_FORBIDDEN_CODE, message: msg, error: msg },
        { status: 403 },
      );
    }

    setSentryServerContext({ route: "/api/subscriptions/checkout", feature: SERVER_FEATURE.payment, userId });

    emitBillingAudit("checkout_started", {
      correlationId: correlation,
      userIdPrefix: prefixUserId(userId),
      country: userCheckoutRow?.country != null ? String(userCheckoutRow.country) : undefined,
      tier: userCheckoutRow?.tier != null ? String(userCheckoutRow.tier) : undefined,
      source: "checkout",
    });

    const bodyRead = await parseJsonBodyWithLimit(req, JSON_BODY_CHECKOUT);
    if (!bodyRead.ok) {
      const status = bodyRead.response.status;
      if (status === 413) {
        auditCheckoutFailed({ correlation, reason: "payload_too_large", userId });
        recordCheckoutFailure("invalid_payload", req);
        const msg = "Request too large. Refresh the page and try again.";
        return NextResponse.json(
          { code: CHECKOUT_INVALID_PAYLOAD_CODE, message: msg, error: msg },
          { status: 413 },
        );
      }
      console.error("[stripe_checkout] invalid_json_payload", { status });
      safeServerLog("stripe_checkout", "checkout_invalid_json_payload", { route: "/api/subscriptions/checkout" });
      auditCheckoutFailed({ correlation, reason: "invalid_json", userId });
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
      auditCheckoutFailed({ correlation, reason: "payload_validation_failed", userId });
      recordCheckoutFailure("invalid_payload", req);
      const msg = "Invalid checkout request. Refresh the page and try again.";
      return NextResponse.json(
        { code: CHECKOUT_INVALID_PAYLOAD_CODE, message: msg, error: msg },
        { status: 400 },
      );
    }

    const { tier, duration, policyVersion, alliedCareer, region: rawRegion, naBillingScopeAcknowledged } =
      parsed.data;

    const resolvedRegion: GlobalRegionSlug | undefined =
      rawRegion && isGlobalRegionSlug(rawRegion) ? rawRegion : undefined;
    const country = resolvedRegion === "us" ? "US" as const : "CA" as const;

    if (tier === "ALLIED" && !alliedCareer) {
      safeServerLog("stripe_checkout", "checkout_missing_allied_career", { tier, duration });
      auditCheckoutFailed({ correlation, reason: "missing_allied_career", userId });
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
      auditCheckoutFailed({ correlation, reason: "policy_version_mismatch", userId });
      recordCheckoutFailure("policy_mismatch", req);
      const msg = "Policy version outdated. Refresh the page and try again.";
      return NextResponse.json(
        { code: CHECKOUT_POLICY_VERSION_MISMATCH_CODE, message: msg, error: msg },
        { status: 400 },
      );
    }

    const jar = await cookies();
    const globalRegionCookie = jar.get(GLOBAL_REGION_COOKIE)?.value;
    const checkoutRegionContextCookie = jar.get(GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE)?.value;
    const authoritativeSlugs = collectAuthoritativeCheckoutGlobalRegionSlugs({
      globalRegionCookieRaw: globalRegionCookie,
      checkoutRegionContextCookieRaw: checkoutRegionContextCookie,
      checkoutBodyRegionSlug: resolvedRegion,
    });
    const naAckRequired = naBillingScopeAckRequiredForCheckout({
      globalRegionCookieRaw: globalRegionCookie,
      checkoutRegionContextCookieRaw: checkoutRegionContextCookie,
      checkoutBodyRegionSlug: resolvedRegion,
    });
    const gateTelemetry = checkoutRegionGateTelemetry({
      globalRegionCookieRaw: globalRegionCookie,
      checkoutRegionContextCookieRaw: checkoutRegionContextCookie,
      checkoutBodyRegionSlug: resolvedRegion,
    });
    emitStructuredLog("checkout_region_gate_eval", "info", {
      correlationId: correlation,
      route: "/api/subscriptions/checkout",
      flow: "billing",
      contextSources: gateTelemetry.contextSources,
      unionSlugs: gateTelemetry.unionSlugs,
      gateRequired: gateTelemetry.gateRequired,
      naAckRequired: naAckRequired ? 1 : 0,
      naAckPresent: naBillingScopeAcknowledged ? 1 : 0,
    });
    if (naAckRequired && naBillingScopeAcknowledged !== true) {
      safeServerLog("stripe_checkout", "checkout_na_billing_scope_ack_required", {
        route: "/api/subscriptions/checkout",
        cookieRegion: parseGlobalRegionCookie(globalRegionCookie) ?? "",
        stampedRegionPresent: Boolean(checkoutRegionContextCookie && checkoutRegionContextCookie.length > 0),
        bodyRegion: resolvedRegion ?? "",
        authoritative_slugs: authoritativeSlugs.join(","),
        context_sources: gateTelemetry.contextSources,
        na_ack_required: 1,
        na_ack_present: 0,
      });
      auditCheckoutFailed({ correlation, reason: "na_billing_scope_ack_required", userId });
      recordCheckoutFailure("na_billing_scope_ack_required", req);
      const msg = CHECKOUT_NA_BILLING_SCOPE_ACK_REQUIRED_MESSAGE;
      return NextResponse.json(
        { code: CHECKOUT_NA_BILLING_SCOPE_ACK_REQUIRED_CODE, message: msg, error: msg },
        { status: 400 },
      );
    }

    const tierCode = tier as TierCode;
    const durationCode = duration as BillingDuration;
    const careerKey = alliedCareer as AlliedCareerKey | undefined;
    const requestedPathway = tierCode === "ALLIED" ? (careerKey ?? "ALLIED") : tierCode;

    if (userCheckoutRow && userCheckoutRow.tier !== tierCode) {
      safeServerLog("stripe_checkout", "checkout_tier_differs_from_profile", {
        userIdPrefix: userId.slice(0, 8),
        profileTier: String(userCheckoutRow.tier),
        requestedTier: String(tierCode),
        severity: "info",
      });
    }

    safeServerLog("stripe_checkout", "checkout_request_selection", {
      tier: tierCode,
      duration: durationCode,
      pathway: requestedPathway,
      region: resolvedRegion ?? "",
      authoritative_slugs: authoritativeSlugs.join(","),
      na_ack_required: naAckRequired ? 1 : 0,
      na_ack_present: naBillingScopeAcknowledged ? 1 : 0,
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
      auditCheckoutFailed({ correlation, reason: "price_not_configured", userId });
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
      auditCheckoutFailed({ correlation, reason: "stripe_client_unavailable", userId });
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
      auditCheckoutFailed({ correlation, reason: "app_origin_missing", userId });
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
      currency: resolvedCurrency,
      tier,
      duration,
      planCode,
      trialDays: String(trialDays),
      app: "nursenest-core",
      legalPolicyVersion: policyVersion,
      legalPoliciesAcceptedAt: acceptedAt.toISOString(),
    };
    /**
     * CA/US pool for `planFromCheckoutMetadata` + entitlements. For global regional markets (e.g. philippines),
     * omit `country` so we never label the session as Canada when the learner bought a non-NA price.
     */
    if (resolvedRegion) {
      metadata.region = resolvedRegion;
      if (resolvedRegion === "us") {
        metadata.country = "US";
      } else if (resolvedRegion === "canada") {
        metadata.country = "CA";
      }
    } else {
      metadata.country = country;
    }
    if (careerKey) {
      metadata.alliedCareer = careerKey;
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
    emitStructuredLog("checkout_session_created", "info", {
      correlationId: correlationIdFromRequest(req) ?? undefined,
      route: "/api/subscriptions/checkout",
      method: "POST",
      flow: "billing",
      message: `stripe session ${checkoutSession.id.slice(0, 12)} planCode=${planCode.slice(0, 48)} priceIdPrefix=${priceId.slice(0, 14)}`,
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
    auditCheckoutFailed({
      correlation: correlationIdFromRequest(req) ?? undefined,
      reason: "checkout_session_exception",
      severity: "error",
    });
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
