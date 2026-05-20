import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { assertDeckOwner, getVerifiedStudyDeckForViewer } from "@/lib/verified-study/verified-study-decks.server";

export async function shareVerifiedStudyDeck(opts: {
  deckId: string;
  ownerId: string;
  targetUserId?: string | null;
  targetEmail?: string | null;
}) {
  const ownerOk = await assertDeckOwner(opts.deckId, opts.ownerId);
  if (!ownerOk) return { ok: false as const, code: "forbidden" as const };

  let targetUserId = opts.targetUserId?.trim() || null;
  const emailRaw = opts.targetEmail?.trim().toLowerCase() || null;
  if (!targetUserId && emailRaw) {
    const u = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailRaw }, { normalizedEmail: emailRaw }],
      },
      select: { id: true },
    });
    targetUserId = u?.id ?? null;
  }
  if (!targetUserId) return { ok: false as const, code: "target_not_found" as const };
  if (targetUserId === opts.ownerId) return { ok: false as const, code: "cannot_share_with_self" as const };

  const existing = await prisma.verifiedStudyDeckShare.findFirst({
    where: { deckId: opts.deckId, targetUserId },
  });
  if (!existing) {
    await prisma.verifiedStudyDeckShare.create({
      data: {
        deckId: opts.deckId,
        targetUserId,
        invitedById: opts.ownerId,
        permission: "VIEW",
      },
    });
  }

  const deckRow = await prisma.verifiedStudyDeck.findUnique({
    where: { id: opts.deckId },
    select: { visibility: true },
  });
  if (deckRow?.visibility === "PRIVATE" || deckRow?.visibility === "UNLISTED") {
    await prisma.verifiedStudyDeck.update({
      where: { id: opts.deckId },
      data: { visibility: "SHARED" },
    });
  }

  return { ok: true as const, targetUserId };
}

export async function reportVerifiedStudyDeck(opts: {
  deckId: string;
  reporterId: string;
  reason: string;
}) {
  const reason = opts.reason.trim().slice(0, 500);
  if (!reason) return { ok: false as const, code: "bad_request" as const };

  const gate = await getVerifiedStudyDeckForViewer({
    viewerId: opts.reporterId,
    deckId: opts.deckId,
    unlistedSlug: null,
  });
  if (!gate.ok) return { ok: false as const, code: gate.code };

  await prisma.verifiedStudyDeckReport.create({
    data: {
      deckId: opts.deckId,
      reporterId: opts.reporterId,
      reason,
      status: "OPEN",
    },
  });
  return { ok: true as const };
}

export async function upsertVerifiedStudyCardProgress(opts: {
  viewerId: string;
  cardId: string;
  patch: {
    viewedDelta?: number;
    correctDelta?: number;
    incorrectDelta?: number;
    weak?: boolean;
    starred?: boolean;
    mastered?: boolean;
    confidenceRating?: number | null;
    grade?: "correct" | "incorrect";
  };
}) {
  const card = await prisma.verifiedStudyCard.findUnique({
    where: { id: opts.cardId },
    select: { id: true, deckId: true },
  });
  if (!card) return { ok: false as const, code: "not_found" as const };

  const deck = await getVerifiedStudyDeckForViewer({
    viewerId: opts.viewerId,
    deckId: card.deckId,
    unlistedSlug: null,
  });
  if (!deck.ok) return { ok: false as const, code: "forbidden" as const };

  const p = opts.patch;
  const viewedInc = p.viewedDelta ?? 0;
  const correctInc = p.correctDelta ?? (p.grade === "correct" ? 1 : 0);
  const incorrectInc = p.incorrectDelta ?? (p.grade === "incorrect" ? 1 : 0);

  await prisma.verifiedStudyCardProgress.upsert({
    where: { userId_cardId: { userId: opts.viewerId, cardId: opts.cardId } },
    create: {
      userId: opts.viewerId,
      cardId: opts.cardId,
      viewedCount: Math.max(0, viewedInc),
      correctCount: Math.max(0, correctInc),
      incorrectCount: Math.max(0, incorrectInc),
      weak: p.weak ?? false,
      starred: p.starred ?? false,
      mastered: p.mastered ?? false,
      confidenceRating: p.confidenceRating ?? null,
      lastStudiedAt: new Date(),
    },
    update: {
      ...(viewedInc ? { viewedCount: { increment: viewedInc } } : {}),
      ...(correctInc ? { correctCount: { increment: correctInc } } : {}),
      ...(incorrectInc ? { incorrectCount: { increment: incorrectInc } } : {}),
      lastStudiedAt: new Date(),
      ...(p.weak !== undefined ? { weak: p.weak } : {}),
      ...(p.starred !== undefined ? { starred: p.starred } : {}),
      ...(p.mastered !== undefined ? { mastered: p.mastered } : {}),
      ...(p.confidenceRating !== undefined ? { confidenceRating: p.confidenceRating } : {}),
    },
  });

  return { ok: true as const };
}

export async function updateVerifiedStudyCardByOwner(opts: {
  cardId: string;
  ownerId: string;
  patch: {
    promptFront?: string;
    answerBack?: string;
    rationale?: string | null;
    clinicalPearl?: string | null;
    referencesJson?: unknown;
    canonicalCategoryId?: string | null;
  };
}) {
  const card = await prisma.verifiedStudyCard.findUnique({
    where: { id: opts.cardId },
    select: { id: true, deckId: true },
  });
  if (!card) return { ok: false as const, code: "not_found" as const };
  const ownerOk = await assertDeckOwner(card.deckId, opts.ownerId);
  if (!ownerOk) return { ok: false as const, code: "forbidden" as const };

  const data: Prisma.VerifiedStudyCardUpdateInput = {};
  if (opts.patch.promptFront != null) data.promptFront = opts.patch.promptFront.trim();
  if (opts.patch.answerBack != null) data.answerBack = opts.patch.answerBack.trim();
  if (opts.patch.rationale !== undefined) data.rationale = opts.patch.rationale?.trim() || null;
  if (opts.patch.clinicalPearl !== undefined) data.clinicalPearl = opts.patch.clinicalPearl?.trim() || null;
  if (opts.patch.canonicalCategoryId !== undefined) {
    data.canonicalCategoryId = opts.patch.canonicalCategoryId?.trim() || null;
  }
  if (opts.patch.referencesJson !== undefined) {
    data.referencesJson = opts.patch.referencesJson as Prisma.InputJsonValue;
    data.verificationStatus = "UNVERIFIED";
    data.lastVerifiedAt = null;
  }

  await prisma.verifiedStudyCard.update({ where: { id: card.id }, data });
  return { ok: true as const };
}
