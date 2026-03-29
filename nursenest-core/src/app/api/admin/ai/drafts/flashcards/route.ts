import { DraftReviewStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const status = req.nextUrl.searchParams.get("status") as DraftReviewStatus | null;
  const where = status
    ? { reviewStatus: status }
    : { reviewStatus: { in: [DraftReviewStatus.PENDING_REVIEW, DraftReviewStatus.APPROVED] } };

  const [total, drafts] = await Promise.all([
    prisma.generatedFlashcardDraft.count({ where }),
    prisma.generatedFlashcardDraft.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        frontPreview: true,
        reviewStatus: true,
        promotedEntityId: true,
        validationJson: true,
        createdAt: true,
        batchId: true,
        lessonId: true,
        categoryId: true,
      },
    }),
  ]);

  return NextResponse.json({ total, drafts });
}
