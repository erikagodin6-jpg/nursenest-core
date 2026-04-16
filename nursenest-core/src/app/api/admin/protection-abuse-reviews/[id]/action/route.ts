import { NextResponse } from "next/server";
import { ProtectionAbuseReviewResolution } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { PROTECTION_ABUSE_REVIEW_NOTE_MAX } from "@/lib/admin/protection-abuse-review-constants";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  action: z.enum(["dismiss", "resolve"]),
  note: z.string().max(PROTECTION_ABUSE_REVIEW_NOTE_MAX).optional(),
});

function normalizeNote(s: string | undefined): string | null {
  if (s == null) return null;
  const t = s.trim();
  return t.length > 0 ? t : null;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { id } = await ctx.params;
  if (!id || id.length < 8) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: `Invalid body (note max ${PROTECTION_ABUSE_REVIEW_NOTE_MAX} characters)` },
      { status: 400 },
    );
  }

  const resolution =
    parsed.data.action === "dismiss" ? ProtectionAbuseReviewResolution.DISMISSED : ProtectionAbuseReviewResolution.RESOLVED;
  const adminNote = normalizeNote(parsed.data.note);

  const row = await prisma.protectionAbuseReview.findFirst({
    where: { id, dismissedAt: null },
    select: { id: true },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found or already closed" }, { status: 409 });
  }

  await prisma.protectionAbuseReview.update({
    where: { id },
    data: {
      dismissedAt: new Date(),
      resolution,
      dismissedByUserId: gate.admin.userId,
      adminNote,
    },
  });

  return NextResponse.json({ ok: true });
}
