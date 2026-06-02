import { NextResponse } from "next/server";
import type { BetaFeatureKey } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { BETA_FEATURE_OPTIONS } from "@/lib/beta/beta-feature-options";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

const FEATURES = new Set(BETA_FEATURE_OPTIONS.map((feature) => feature.key));

export async function POST(req: Request) {
  if (!isDatabaseUrlConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const eventType = String(body.eventType ?? "").trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_").slice(0, 80);
  const featureRaw = String(body.feature ?? "").trim();
  const feature = FEATURES.has(featureRaw as BetaFeatureKey) ? (featureRaw as BetaFeatureKey) : null;
  const pageUrl = String(body.pageUrl ?? "").trim().slice(0, 2048);
  if (!eventType) return NextResponse.json({ error: "eventType is required." }, { status: 400 });

  try {
    await prisma.betaActivityEvent.create({
      data: {
        userId,
        feature,
        eventType,
        pageUrl: pageUrl || null,
        metadata: typeof body.metadata === "object" && body.metadata ? body.metadata : undefined,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    safeServerLog("beta_activity", "create_failed", {
      userIdPrefix: userId.slice(0, 8),
      detail: error instanceof Error ? error.message.slice(0, 180) : "unknown",
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
