import "server-only";

import { randomBytes } from "node:crypto";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { viewerCanAccessVerifiedStudyDeck } from "@/lib/verified-study/verified-study-deck-access";

const DECK_LIST_TAKE = 48;
const CARD_DETAIL_TAKE = 200;

function newUnlistedSlug(): string {
  return randomBytes(16).toString("base64url").replace(/=/g, "").slice(0, 32);
}

export async function listPublicCommunityVerifiedStudyDecks(pathwayId: string, take = 48) {
  const pid = pathwayId.trim();
  return prisma.verifiedStudyDeck.findMany({
    where: {
      pathwayId: pid,
      visibility: "PUBLIC",
      moderationStatus: "APPROVED",
      verificationStatus: "VERIFIED",
    },
    orderBy: { updatedAt: "desc" },
    take,
    select: {
      id: true,
      title: true,
      description: true,
      pathwayId: true,
      canonicalCategoryId: true,
      publishedAt: true,
      _count: { select: { cards: true } },
    },
  });
}

export async function listVerifiedStudyDecksSharedWithUser(opts: { userId: string; pathwayId: string }) {
  const pid = opts.pathwayId.trim();
  return prisma.verifiedStudyDeck.findMany({
    where: {
      pathwayId: pid,
      visibility: "SHARED",
      shares: { some: { targetUserId: opts.userId } },
    },
    orderBy: { updatedAt: "desc" },
    take: DECK_LIST_TAKE,
    select: {
      id: true,
      title: true,
      visibility: true,
      ownerId: true,
      updatedAt: true,
      _count: { select: { cards: true } },
    },
  });
}

export async function listVerifiedStudyDecksForPathway(opts: {
  userId: string;
  pathwayId: string;
}): Promise<
  Array<{
    id: string;
    title: string;
    visibility: string;
    verificationStatus: string;
    moderationStatus: string;
    cardCount: number;
    ownerId: string;
    updatedAt: Date;
  }>
> {
  const pathwayId = opts.pathwayId.trim();
  const rows = await prisma.verifiedStudyDeck.findMany({
    where: {
      pathwayId,
      OR: [
        { ownerId: opts.userId },
        {
          visibility: "PUBLIC",
          moderationStatus: "APPROVED",
          verificationStatus: "VERIFIED",
        },
        {
          visibility: "SHARED",
          shares: { some: { targetUserId: opts.userId } },
        },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: DECK_LIST_TAKE,
    select: {
      id: true,
      title: true,
      visibility: true,
      verificationStatus: true,
      moderationStatus: true,
      ownerId: true,
      updatedAt: true,
      _count: { select: { cards: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    visibility: r.visibility,
    verificationStatus: r.verificationStatus,
    moderationStatus: r.moderationStatus,
    cardCount: r._count.cards,
    ownerId: r.ownerId,
    updatedAt: r.updatedAt,
  }));
}

export async function getVerifiedStudyDeckForViewer(opts: {
  viewerId: string;
  deckId: string;
  unlistedSlug: string | null;
}) {
  const deck = await prisma.verifiedStudyDeck.findUnique({
    where: { id: opts.deckId },
    include: {
      shares: {
        where: { targetUserId: opts.viewerId },
        select: { targetUserId: true },
        take: 5,
      },
    },
  });
  if (!deck) return { ok: false as const, code: "not_found" as const };

  const allowed = viewerCanAccessVerifiedStudyDeck({
    viewerId: opts.viewerId,
    deck: {
      ownerId: deck.ownerId,
      visibility: deck.visibility,
      moderationStatus: deck.moderationStatus,
      verificationStatus: deck.verificationStatus,
      unlistedSlug: deck.unlistedSlug,
    },
    sharesForViewer: deck.shares,
    unlistedSlugFromRequest: opts.unlistedSlug,
  });
  if (!allowed) return { ok: false as const, code: "forbidden" as const };

  const cards = await prisma.verifiedStudyCard.findMany({
    where: { deckId: deck.id },
    orderBy: { position: "asc" },
    take: CARD_DETAIL_TAKE,
  });

  return {
    ok: true as const,
    deck: {
      id: deck.id,
      title: deck.title,
      description: deck.description,
      pathwayId: deck.pathwayId,
      professionKey: deck.professionKey,
      canonicalCategoryId: deck.canonicalCategoryId,
      visibility: deck.visibility,
      verificationStatus: deck.verificationStatus,
      moderationStatus: deck.moderationStatus,
      sourceType: deck.sourceType,
      nurseNestVerified: deck.nurseNestVerified,
      ownerId: deck.ownerId,
      publishedAt: deck.publishedAt,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
    },
    cards: cards.map((c) => ({
      id: c.id,
      position: c.position,
      promptFront: c.promptFront,
      answerBack: c.answerBack,
      rationale: c.rationale,
      clinicalPearl: c.clinicalPearl,
      canonicalCategoryId: c.canonicalCategoryId,
      relatedLessonSlug: c.relatedLessonSlug,
      relatedExamQuestionId: c.relatedExamQuestionId,
      referencesJson: c.referencesJson,
      verificationStatus: c.verificationStatus,
      lastVerifiedAt: c.lastVerifiedAt,
    })),
  };
}

export async function createVerifiedStudyDeck(opts: {
  ownerId: string;
  title: string;
  description?: string | null;
  pathwayId: string;
  professionKey?: string | null;
  canonicalCategoryId?: string | null;
  visibility?: "PRIVATE" | "SHARED" | "PUBLIC" | "UNLISTED";
}) {
  const visibility = opts.visibility ?? "PRIVATE";
  const moderationStatus = visibility === "PUBLIC" ? "PENDING" : "APPROVED";
  const unlistedSlug = visibility === "UNLISTED" ? newUnlistedSlug() : null;

  return prisma.verifiedStudyDeck.create({
    data: {
      title: opts.title.trim().slice(0, 200),
      description: opts.description?.trim() ? opts.description.trim().slice(0, 2000) : null,
      pathwayId: opts.pathwayId.trim(),
      professionKey: opts.professionKey?.trim() || null,
      canonicalCategoryId: opts.canonicalCategoryId?.trim() || null,
      ownerId: opts.ownerId,
      visibility,
      moderationStatus,
      unlistedSlug,
    },
  });
}

export async function assertDeckOwner(deckId: string, ownerId: string) {
  const d = await prisma.verifiedStudyDeck.findFirst({
    where: { id: deckId, ownerId },
    select: { id: true },
  });
  return Boolean(d);
}

export async function updateVerifiedStudyDeck(
  deckId: string,
  ownerId: string,
  patch: {
    title?: string;
    description?: string | null;
    visibility?: "PRIVATE" | "SHARED" | "PUBLIC" | "UNLISTED";
    canonicalCategoryId?: string | null;
    professionKey?: string | null;
  },
) {
  const row = await prisma.verifiedStudyDeck.findFirst({
    where: { id: deckId, ownerId },
    select: { id: true },
  });
  if (!row) return { updated: false as const };

  const data: Prisma.VerifiedStudyDeckUpdateInput = {};
  if (patch.title != null) data.title = patch.title.trim().slice(0, 200);
  if (patch.description !== undefined) {
    data.description = patch.description?.trim() ? patch.description.trim().slice(0, 2000) : null;
  }
  if (patch.canonicalCategoryId !== undefined) {
    data.canonicalCategoryId = patch.canonicalCategoryId?.trim() || null;
  }
  if (patch.professionKey !== undefined) {
    data.professionKey = patch.professionKey?.trim() || null;
  }
  if (patch.visibility != null) {
    data.visibility = patch.visibility;
    if (patch.visibility === "PUBLIC") {
      data.moderationStatus = "PENDING";
      data.publishedAt = null;
    } else if (patch.visibility === "UNLISTED") {
      data.moderationStatus = "APPROVED";
      data.unlistedSlug = newUnlistedSlug();
    } else {
      data.moderationStatus = "APPROVED";
      data.unlistedSlug = null;
    }
  }

  await prisma.verifiedStudyDeck.update({
    where: { id: row.id },
    data,
  });
  return { updated: true as const };
}

export async function addVerifiedStudyCard(opts: {
  deckId: string;
  ownerId: string;
  promptFront: string;
  answerBack: string;
  rationale?: string | null;
  clinicalPearl?: string | null;
  referencesJson?: unknown;
  canonicalCategoryId?: string | null;
}) {
  const ok = await assertDeckOwner(opts.deckId, opts.ownerId);
  if (!ok) return null;
  const maxPos = await prisma.verifiedStudyCard.aggregate({
    where: { deckId: opts.deckId },
    _max: { position: true },
  });
  const position = (maxPos._max.position ?? -1) + 1;
  return prisma.verifiedStudyCard.create({
    data: {
      deckId: opts.deckId,
      position,
      promptFront: opts.promptFront.trim(),
      answerBack: opts.answerBack.trim(),
      rationale: opts.rationale?.trim() || null,
      clinicalPearl: opts.clinicalPearl?.trim() || null,
      canonicalCategoryId: opts.canonicalCategoryId?.trim() || null,
      referencesJson: (opts.referencesJson ?? []) as Prisma.InputJsonValue,
      verificationStatus: "UNVERIFIED",
    },
  });
}

export async function duplicateVerifiedStudyDeck(opts: { sourceDeckId: string; newOwnerId: string }) {
  const src = await prisma.verifiedStudyDeck.findUnique({
    where: { id: opts.sourceDeckId },
    include: { cards: { orderBy: { position: "asc" } } },
  });
  if (!src) return null;

  const shares = await prisma.verifiedStudyDeckShare.findMany({
    where: { deckId: src.id, targetUserId: opts.newOwnerId },
    take: 1,
  });
  const isOwner = src.ownerId === opts.newOwnerId;
  const isShared = shares.length > 0;
  const isPublicReader =
    src.visibility === "PUBLIC" && src.moderationStatus === "APPROVED" && src.verificationStatus === "VERIFIED";
  if (!isOwner && !isShared && !isPublicReader) return null;

  const dup = await prisma.verifiedStudyDeck.create({
    data: {
      title: `${src.title} (copy)`.slice(0, 200),
      description: src.description,
      pathwayId: src.pathwayId,
      professionKey: src.professionKey,
      canonicalCategoryId: src.canonicalCategoryId,
      ownerId: opts.newOwnerId,
      visibility: "PRIVATE",
      verificationStatus: "UNVERIFIED",
      moderationStatus: "APPROVED",
      sourceType: "USER_CREATED",
      duplicateOfDeckId: src.id,
    },
  });

  if (src.cards.length) {
    await prisma.verifiedStudyCard.createMany({
      data: src.cards.map((c, i) => ({
        deckId: dup.id,
        position: i,
        promptFront: c.promptFront,
        answerBack: c.answerBack,
        rationale: c.rationale,
        clinicalPearl: c.clinicalPearl,
        canonicalCategoryId: c.canonicalCategoryId,
        relatedLessonSlug: c.relatedLessonSlug,
        relatedExamQuestionId: c.relatedExamQuestionId,
        referencesJson: c.referencesJson as Prisma.InputJsonValue,
        verificationStatus: "UNVERIFIED",
      })),
    });
  }
  return dup;
}

export async function aggregateVerifiedStudyProgressForReport(userId: string) {
  const [agg, weakCount, masteredCount] = await Promise.all([
    prisma.verifiedStudyCardProgress.aggregate({
      where: { userId },
      _sum: {
        viewedCount: true,
        correctCount: true,
        incorrectCount: true,
      },
    }),
    prisma.verifiedStudyCardProgress.count({ where: { userId, weak: true } }),
    prisma.verifiedStudyCardProgress.count({ where: { userId, mastered: true } }),
  ]);
  return {
    viewedTotal: agg._sum.viewedCount ?? 0,
    correctTotal: agg._sum.correctCount ?? 0,
    incorrectTotal: agg._sum.incorrectCount ?? 0,
    weakCount,
    masteredCount,
  };
}
