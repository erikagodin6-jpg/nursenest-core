import { NextResponse } from "next/server";
import { BetaFeedbackKind, type BetaFeatureKey } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { BETA_FEATURE_OPTIONS } from "@/lib/beta/beta-feature-options";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

const FEATURES = new Set(BETA_FEATURE_OPTIONS.map((feature) => feature.key));
const KINDS = new Set<string>(["BUG", "SUGGESTION", "QUALITY_RATING", "GENERAL"]);

export async function POST(req: Request) {
  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Beta feedback is temporarily unavailable." }, { status: 503 });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
  if (!userId) return NextResponse.json({ error: "Sign in to send beta feedback." }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const feature = String(body.feature ?? "").trim();
  const kindRaw = String(body.kind ?? "GENERAL").trim();
  const summary = String(body.summary ?? "").trim();
  const details = String(body.details ?? "").trim();
  const pageUrl = String(body.pageUrl ?? "").trim();
  const browser = String(body.browser ?? req.headers.get("user-agent") ?? "").trim();
  const ratingRaw = Number(body.rating ?? 0);
  const rating = Number.isFinite(ratingRaw) && ratingRaw >= 1 && ratingRaw <= 5 ? Math.round(ratingRaw) : null;

  if (!FEATURES.has(feature as BetaFeatureKey)) return NextResponse.json({ error: "Select a valid beta feature." }, { status: 400 });
  if (!summary) return NextResponse.json({ error: "Summary is required." }, { status: 400 });
  const featureKey = feature as BetaFeatureKey;

  try {
    const row = await prisma.betaFeedbackReport.create({
      data: {
        userId,
        feature: featureKey,
        kind: (KINDS.has(kindRaw) ? kindRaw : "GENERAL") as BetaFeedbackKind,
        rating,
        summary: summary.slice(0, 500),
        details: details ? details.slice(0, 10000) : null,
        pageUrl: pageUrl ? pageUrl.slice(0, 2048) : null,
        browser: browser ? browser.slice(0, 512) : null,
      },
    });
    await prisma.betaActivityEvent.create({
      data: { userId, feature: featureKey, eventType: "BETA_FEEDBACK_SUBMITTED", pageUrl: pageUrl || null },
    });
    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (error) {
    safeServerLog("beta_feedback", "create_failed", {
      userIdPrefix: userId.slice(0, 8),
      detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
    });
    return NextResponse.json({ error: "Could not save your beta feedback. Try again." }, { status: 500 });
  }
}
