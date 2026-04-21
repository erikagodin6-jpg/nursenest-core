import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { DB_PUBLISHED, freemiumQuestionWhereForProfile } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { logPaywallDeny, questionIdWhereIfAllowed } from "@/lib/entitlements/assert-question-access";
import { logBlockedAccess, logEntitlementMismatch } from "@/lib/entitlements/entitlement-logging";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { recordEntitlementResolveFailureSignal } from "@/lib/observability/production-signal-metrics";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import type { CountryCode, TierCode } from "@prisma/client";
import { QUESTION_PAYLOAD_WARN_BYTES } from "@/lib/questions/question-api-limits";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { logLargeApiResponse } from "@/lib/observability/perf-log";
import { notSubscribedResponse } from "@/lib/entitlements/require-subscriber-session";
import { mergeQuestionApiPayload } from "@/lib/i18n/educational-content-overlay";
import { resolveMergedQuestionOverlayBundle } from "@/lib/i18n/educational-translation-db";
import { getMarketingLocaleFromRequestCookie } from "@/lib/i18n/marketing-locale-cookie";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return runWithApiTelemetry(req, "GET /api/questions/[id]", "content", async () => {
  if (!id || id.length < 5) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wantsRationale =
    req.nextUrl.searchParams.get("includeRationale") === "1" ||
    req.nextUrl.searchParams.get("includeRationale") === "true";

  let entitlement;
  try {
    entitlement = await resolveEntitlement(userId);
  } catch (e) {
    const correlationId = correlationIdFromRequest(req);
    recordEntitlementResolveFailureSignal("api_questions_id", correlationId);
    emitStructuredLog("entitlement_resolve_failed", "error", {
      correlationId,
      route: "/api/questions/[id]",
      method: "GET",
      flow: "content",
      errorClass: e instanceof Error ? e.name : "unknown",
      message: "entitlement resolve failed before single question load",
    }, e);
    safeServerLogCritical("api_questions_id", "entitlement_resolve_failed", {}, e);
    return NextResponse.json({ error: "Unable to verify access. Try again shortly." }, { status: 503 });
  }

  if (entitlement.hasAccess) {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({ route: "/api/questions/[id]", feature: SERVER_FEATURE.question, userId: gate.userId });

    const educationalLocale = getMarketingLocaleFromRequestCookie(req);
    const questionOverlayBundle = await resolveMergedQuestionOverlayBundle(educationalLocale);

    try {
      const baseSelect = {
        id: true,
        stem: true,
        questionType: true,
        options: true,
        difficulty: true,
        exam: true,
        topic: true,
        bodySystem: true,
      } as const;
      const q = await withRetry(() =>
        prisma.examQuestion.findFirst({
          where: questionIdWhereIfAllowed(id, gate.entitlement),
          select: wantsRationale ? { ...baseSelect, rationale: true } : { ...baseSelect },
        }),
      );

      if (!q) {
        logPaywallDeny("/api/questions/[id]", "question_not_in_scope_or_missing", { id });
        logBlockedAccess({
          surface: "api_questions_id",
          reason: "question_not_in_subscriber_scope",
          questionIdPrefix: id.slice(0, 8),
          userTier: String(gate.entitlement.tier ?? ""),
          userCountry: String(gate.entitlement.country ?? ""),
        });
        const published = await withRetry(() =>
          prisma.examQuestion.findFirst({
            where: { id, status: DB_PUBLISHED },
            select: { tier: true, regionScope: true },
          }),
        );
        if (published) {
          logEntitlementMismatch({
            surface: "api_questions_id",
            reason: "published_question_excluded_by_entitlement",
            questionIdPrefix: id.slice(0, 8),
            contentTier: published.tier,
            contentRegionScope: published.regionScope ?? "",
          });
        }
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      const body = {
        question: mergeQuestionApiPayload({ ...q } as Record<string, unknown>, educationalLocale, questionOverlayBundle, {
          teachingExposure: wantsRationale ? "full" : "none",
        }),
        mode: "subscriber" as const,
        fields: wantsRationale ? ("full" as const) : ("preview" as const),
      };
      const approxPayloadBytes = estimateJsonUtf8Bytes(body);
      safeServerLog("api_questions_id", "single_payload", {
        approxPayloadBytes,
        payloadLarge: approxPayloadBytes >= QUESTION_PAYLOAD_WARN_BYTES ? 1 : 0,
        includeRationale: wantsRationale ? 1 : 0,
      });
      if (approxPayloadBytes >= QUESTION_PAYLOAD_WARN_BYTES) {
        safeServerLog("api_questions_id", "single_payload_warn", {
          approxPayloadBytes,
          threshold: QUESTION_PAYLOAD_WARN_BYTES,
          questionId: id,
        });
      }

      logLargeApiResponse("/api/questions/[id]", approxPayloadBytes);
      return NextResponse.json(body);
    } catch (e) {
      emitStructuredLog("question_load_failed", "error", {
        correlationId: correlationIdFromRequest(req),
        route: "/api/questions/[id]",
        method: "GET",
        flow: "content",
        userState: "subscriber",
        message: "single question fetch failed (subscriber)",
      }, e);
      safeServerLogCritical("api_questions_id", "fetch_failed", {}, e);
      return NextResponse.json({ error: "Unable to load question" }, { status: 503 });
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { country: true, tier: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snap = await getFreemiumSnapshot(userId);
  if (!snap || snap.questionRemaining <= 0) {
    logPaywallDeny("/api/questions/[id]", "freemium_exhausted", { id });
    return notSubscribedResponse();
  }

  if (wantsRationale) {
    return NextResponse.json(
      {
        code: "rationale_locked",
        message: "Explanations and rationales require an active subscription.",
      },
      { status: 403 },
    );
  }

  const where = {
    AND: [{ id }, freemiumQuestionWhereForProfile(user.country as CountryCode, user.tier as TierCode)],
  };

  const educationalLocale = getMarketingLocaleFromRequestCookie(req);
  const questionOverlayBundle = await resolveMergedQuestionOverlayBundle(educationalLocale);

  try {
    const q = await withRetry(() =>
      prisma.examQuestion.findFirst({
        where,
        select: {
          id: true,
          stem: true,
          questionType: true,
          options: true,
          topic: true,
          exam: true,
        },
      }),
    );

    if (!q) {
      logPaywallDeny("/api/questions/[id]", "freemium_question_not_in_scope", { id });
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const freemiumBody = {
      question: mergeQuestionApiPayload({ ...q } as Record<string, unknown>, educationalLocale, questionOverlayBundle, {
        teachingExposure: "none",
      }),
      mode: "freemium" as const,
      fields: "preview" as const,
      rationaleLocked: true as const,
    };
    logLargeApiResponse("/api/questions/[id]", estimateJsonUtf8Bytes(freemiumBody));
    return NextResponse.json(freemiumBody);
  } catch (e) {
    emitStructuredLog("question_load_failed", "error", {
      correlationId: correlationIdFromRequest(req),
      route: "/api/questions/[id]",
      method: "GET",
      flow: "content",
      userState: "freemium",
      message: "single question fetch failed (freemium)",
    }, e);
    safeServerLogCritical("api_questions_id", "fetch_failed_freemium", {}, e);
    return NextResponse.json({ error: "Unable to load question" }, { status: 503 });
  }
  });
}
