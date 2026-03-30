import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { DB_PUBLISHED, freemiumQuestionWhereForProfile, questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { logPaywallDeny, questionIdWhereIfAllowed } from "@/lib/entitlements/assert-question-access";
import { logBlockedAccess, logEntitlementMismatch } from "@/lib/entitlements/entitlement-logging";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import type { CountryCode, TierCode } from "@prisma/client";
import { QUESTION_PAYLOAD_WARN_BYTES } from "@/lib/questions/question-api-limits";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { logLargeApiResponse } from "@/lib/observability/perf-log";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!id || id.length < 5) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let entitlement;
  try {
    entitlement = await resolveEntitlement(userId);
  } catch (e) {
    safeServerLogCritical("api_questions_id", "entitlement_resolve_failed", {}, e);
    return NextResponse.json({ error: "Unable to verify access. Try again shortly." }, { status: 503 });
  }

  if (entitlement.hasAccess) {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({ route: "/api/questions/[id]", feature: "question", userId: gate.userId });

    const includeRationale =
      req.nextUrl.searchParams.get("includeRationale") === "1" ||
      req.nextUrl.searchParams.get("includeRationale") === "true";

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
          select: includeRationale ? { ...baseSelect, rationale: true } : { ...baseSelect },
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

      const body = { question: q, mode: "subscriber" as const, fields: includeRationale ? ("full" as const) : ("preview" as const) };
      const approxPayloadBytes = estimateJsonUtf8Bytes(body);
      safeServerLog("api_questions_id", "single_payload", {
        approxPayloadBytes,
        payloadLarge: approxPayloadBytes >= QUESTION_PAYLOAD_WARN_BYTES ? 1 : 0,
        includeRationale: includeRationale ? 1 : 0,
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
    return NextResponse.json(
      { error: "Subscription required", code: "paywall" },
      { status: 403 },
    );
  }

  const where = {
    AND: [{ id }, freemiumQuestionWhereForProfile(user.country as CountryCode, user.tier as TierCode)],
  };

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

    await prisma.user.update({
      where: { id: userId },
      data: { freeQuestionViews: { increment: 1 } },
    });

    const freemiumBody = { question: q, mode: "freemium" as const };
    logLargeApiResponse("/api/questions/[id]", estimateJsonUtf8Bytes(freemiumBody));
    return NextResponse.json(freemiumBody);
  } catch (e) {
    safeServerLogCritical("api_questions_id", "fetch_failed_freemium", {}, e);
    return NextResponse.json({ error: "Unable to load question" }, { status: 503 });
  }
}
