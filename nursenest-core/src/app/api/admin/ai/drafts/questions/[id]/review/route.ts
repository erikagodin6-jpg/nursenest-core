import { DraftReviewStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  action: z.enum(["approve", "reject"]),
  notes: z.string().max(2000).optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const draft = await prisma.generatedQuestionDraft.findUnique({ where: { id } });
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (draft.reviewStatus !== DraftReviewStatus.PENDING_REVIEW) {
    return NextResponse.json({ error: "Draft is not awaiting review" }, { status: 400 });
  }

  const next =
    parsed.data.action === "approve" ? DraftReviewStatus.APPROVED : DraftReviewStatus.REJECTED;

  await prisma.generatedQuestionDraft.update({
    where: { id },
    data: {
      reviewStatus: next,
      reviewNotes: parsed.data.notes ?? null,
      reviewedById: gate.admin.userId,
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, reviewStatus: next });
}
