import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { normalizeFeedbackPayload, toPrismaCreateArgs } from "@/lib/feedback/user-feedback-payload";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";

/**
 * Public intake for product feedback (optional session — userId linked when signed in).
 * Rate limits and screenshot storage upgrades belong in follow-up work.
 */
export async function POST(req: Request) {
  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Feedback is temporarily unavailable." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const normalized = normalizeFeedbackPayload(body);
  if (!normalized.ok) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  try {
    const row = await prisma.userFeedbackReport.create({
      data: toPrismaCreateArgs(normalized.data, userId),
    });
    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (e) {
    safeServerLog("api_feedback_report", "create_failed", { userId: userId ?? "" }, e);
    return NextResponse.json({ error: "Could not save your report. Please try again." }, { status: 500 });
  }
}
