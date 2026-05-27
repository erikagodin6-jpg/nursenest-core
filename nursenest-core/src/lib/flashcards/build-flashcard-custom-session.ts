import { randomUUID } from "node:crypto";
import { ContentStatus, type Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { PRISMA_ID_IN_CHUNK_SIZE, takeForIdIn } from "@/lib/db/prisma-find-many-bounds";
import { flashcardPathwayAccessOptionsFromPathwayId } from "@/lib/flashcards/flashcard-pathway-scope";
import {
  applyCountsToBuilderCategories,
  builderCategoryTitleForId,
  FLASHCARD_BUILDER_UNCATEGORIZED_ID,
  resolveBuilderCategoryId,
  type BuilderCategoryOption,
} from "@/lib/flashcards/flashcard-builder-taxonomy";
import { loadLessonLinkedFlashcardVirtuals } from "@/lib/flashcards/lesson-linked-flashcards-for-pathway";
import {
  collectMergedLessonVirtualFlashcardsForPathway,
  FLASHCARD_PADDING_CARD_RATIONALE_MARKER,
} from "@/lib/flashcards/lesson-linked-virtual-flashcards-aggregator";
import {
  serializeFlashcardForCustomSession,
  type FlashcardStudySelectRow,
} from "@/lib/flashcards/flashcard-study-serialize";
import { isSataPayload } from "@/lib/flashcards/flashcard-exam-style";
import type {
  FlashcardCustomSessionQueryRelaxation,
  FlashcardCustomSessionSummary,
  FlashcardLessonVirtualDiagnostics,
} from "@/lib/flashcards/flashcard-custom-session-response";
import type { FlashcardsPoolInventoryDiagnostics } from "@/lib/flashcards/flashcards-hub-types";
import {
  filterCardsByProgressFlags,
  parseCustomSessionSourceKind,
  prismaWhereForSourceKind,
  type CustomSessionSourceKind,
} from "@/lib/flashcards/custom-session-card-filters";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { bankExamQuestionRowToFlashcardStudySelectRow } from "@/lib/flashcards/bank-exam-question-to-flashcard-select";
import { loadExamQuestionRowsForFlashcardPool } from "@/lib/flashcards/flashcard-exam-bank-hub-inventory";
import { firstHttpsImageUrlFromExamQuestionImages } from "@/lib/study-question-pool/exam-question-image-url";
import { getStudyQuestionPoolForPathway } from "@/lib/study-question-pool/get-study-question-pool-for-pathway";
import { normalizePathwayIdForStudySurfaces } from "@/lib/study-question-pool/study-pathway-normalize";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  loadFlashcardsExamInventoryForPathway,
  resolveAccessScopeForPathwayExamQuestionPool,
} from "@/lib/flashcards/load-flashcards-exam-inventory.server";

export type CustomSessionStudyMode = "term_to_definition" | "definition_to_term" | "mixed";

export type BuildFlashcardCustomSessionInput = {
  userId: string;
  entitlement: AccessScope;
  pathwayId: string | null;
  topicCode?: string | null;
  lessonId?: string | null;
  selectedCategories: string[];
  stateIds: string[];
  weakOnly: boolean;
  incorrectOnly: boolean;
  starredOnly: boolean;
  savedOnly: boolean;
  notesOnly: boolean;
  revisitOnly: boolean;
  notStudiedOnly: boolean;
  recentStudiedOnly: boolean;
  recentDays: number;
  shuffle: boolean;
  mode: CustomSessionStudyMode;
  limit: number;
  includeCards: boolean;
  sourceKind: CustomSessionSourceKind;
  /** Optional deterministic shuffle seed (falls back to random). */
  sessionSeed?: string | null;
  cardLimitRaw?: string | null;
};

export type CustomSessionSerializedCard = ReturnType<typeof serializeFlashcardForCustomSession> & {
  lessonHref?: string;
  lessonTitle?: string;
  lessonSlug?: string;
};

export type BuildFlashcardCustomSessionSuccess = {
  ok: true;
  queryRelaxation: FlashcardCustomSessionQueryRelaxation;
  summary: FlashcardCustomSessionSummary;
  categoryOptions: BuilderCategoryOption[];
  cards: CustomSessionSerializedCard[];
};

export type BuildFlashcardCustomSessionFailure = {
  ok: false;
  code: "database_error";
  message: string;
  reason: string;
};

export type BuildFlashcardCustomSessionResult = BuildFlashcardCustomSessionSuccess | BuildFlashcardCustomSessionFailure;

const FLASHCARD_CUSTOM_SESSION_DB_CARD_SCAN_LIMIT = 800;
const FLASHCARD_CUSTOM_SESSION_PROGRESS_SCAN_LIMIT = 800;
const FLASHCARD_CUSTOM_SESSION_RETURN_LIMIT = 80;

function serializedHasUsableMcq(card: CustomSessionSerializedCard): boolean {
  const exam = card.examMicroQuestion;
  if (!exam || isSataPayload(exam)) return false;
  return Boolean(
    typeof exam.questionStem === "string" &&
      exam.questionStem.trim().length >= 10 &&
      Array.isArray(exam.answerOptions) &&
      exam.answerOptions.length === 4 &&
      exam.answerOptions.every((option) => option.text.trim().length > 0) &&
      typeof exam.correctLetter === "string" &&
      exam.correctLetter.trim().length > 0,
  );
}

const flashcardSelect = {
  id: true,
  front: true,
  back: true,
  sourceKey: true,
  lessonId: true,
  examQuestionId: true,
  examItemKind: true,
  questionStem: true,
  answerOptions: true,
  correctAnswer: true,
  rationaleCorrect: true,
  rationaleIncorrect: true,
  category: { select: { name: true, topicCode: true } },
  deck: { select: { pathwayId: true, title: true } },
} as const;

function shuffled<T>(rows: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) h = (h ^ seed.charCodeAt(i)) * 16777619;
  const out = [...rows];
  for (let i = out.length - 1; i > 0; i -= 1) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function describeCustomSessionFilterMode(flags: {
  weakOnly: boolean;
  incorrectOnly: boolean;
  starredOnly: boolean;
  notStudiedOnly: boolean;
  savedOnly: boolean;
  notesOnly: boolean;
  revisitOnly: boolean;
}): string {
  const parts: string[] = [];
  if (flags.weakOnly) parts.push("weak areas");
  if (flags.incorrectOnly) parts.push("review incorrect");
  if (flags.starredOnly) parts.push("starred");
  if (flags.notStudiedOnly) parts.push("unseen");
  if (flags.savedOnly) parts.push("saved");
  if (flags.notesOnly) parts.push("notes");
  if (flags.revisitOnly) parts.push("revisit");
  return parts.length > 0 ? parts.join(" + ") : "all cards";
}

/**
 * Shared implementation for `GET /api/flashcards/custom-session` and server-side hub inventory.
 */
export async function buildFlashcardCustomSession(
  input: BuildFlashcardCustomSessionInput,
): Promise<BuildFlashcardCustomSessionResult> {
  const {
    userId,
    entitlement,
    pathwayId,
    topicCode = null,
    lessonId = null,
    selectedCategories,
    stateIds,
    weakOnly,
    incorrectOnly,
    starredOnly,
    savedOnly,
    notesOnly,
    revisitOnly,
    notStudiedOnly,
    recentStudiedOnly,
    recentDays,
    shuffle,
    mode,
    limit,
    includeCards,
    sourceKind,
    sessionSeed,
    cardLimitRaw,
  } = input;

  const sourceClause = prismaWhereForSourceKind(sourceKind);

  const buildFlashcardWhere = (accessWhere: Prisma.FlashcardWhereInput): Prisma.FlashcardWhereInput => {
    const clauses: Prisma.FlashcardWhereInput[] = [{ status: ContentStatus.PUBLISHED }, accessWhere];
    if (topicCode) clauses.push({ category: { topicCode } });
    if (lessonId) clauses.push({ lessonId });
    if (sourceClause) clauses.push(sourceClause);
    return { AND: clauses };
  };

  const queryRelaxation: FlashcardCustomSessionQueryRelaxation = "none";

  try {
    const canonicalPathwayId =
      pathwayId != null && pathwayId.trim().length > 0
        ? normalizePathwayIdForStudySurfaces(pathwayId.trim(), entitlement.country)
        : null;
    const examContext = canonicalPathwayId?.trim() ? buildGlobalExamContext(canonicalPathwayId.trim(), "en") : null;
    const pathwayScopeId = canonicalPathwayId?.trim() || pathwayId?.trim() || null;

    const allowLessonQuestionVirtuals =
      sourceKind === "all" || sourceKind === "lesson" || sourceKind === "question";

    const pathwayOptsResolved = flashcardPathwayAccessOptionsFromPathwayId(pathwayScopeId ?? pathwayId);

    // Fire the exam-bank pool chain now so it overlaps with the sequential card queries below.
    // Savings: ~2-4s when the pool path is taken (resolveAccess + loadExamRows run in parallel).
    const _needsProgressFilter = weakOnly || incorrectOnly || notStudiedOnly || recentStudiedOnly;
    const _needsPersistenceFilter = starredOnly || savedOnly || notesOnly || revisitOnly;
    const _canEagerPool =
      Boolean(pathwayScopeId && !lessonId) &&
      (sourceKind === "all" || sourceKind === "question") &&
      allowLessonQuestionVirtuals &&
      includeCards &&
      !_needsProgressFilter &&
      !_needsPersistenceFilter;
    const _eagerPoolPathway = _canEagerPool && pathwayScopeId ? getExamPathwayById(pathwayScopeId) : null;
    const _eagerPoolChain = _eagerPoolPathway != null
      ? (async () => {
          try {
            const pw = _eagerPoolPathway;
            const access = await resolveAccessScopeForPathwayExamQuestionPool(userId, entitlement, pw);
            const scope = access?.scope ?? null;
            const pool = scope != null
              ? await loadExamQuestionRowsForFlashcardPool(
                  scope, pw, topicCode?.trim() || null, Math.max(limit * 10, 200)
                )
              : ([] as Awaited<ReturnType<typeof loadExamQuestionRowsForFlashcardPool>>);
            return { access, pool };
          } catch {
            return null;
          }
        })()
      : null;

    const cards = await prisma.flashcard.findMany({
      where: buildFlashcardWhere(flashcardAccessWhere(entitlement, pathwayOptsResolved)),
      select: flashcardSelect,
      orderBy: { updatedAt: "desc" },
      take: FLASHCARD_CUSTOM_SESSION_DB_CARD_SCAN_LIMIT,
    });

    let lessonQuestionVirtuals: Awaited<ReturnType<typeof loadLessonLinkedFlashcardVirtuals>> = [];
    if (pathwayScopeId && allowLessonQuestionVirtuals && !includeCards) {
      const existingExamQ = new Set(
        cards
          .map((c) => c.examQuestionId)
          .filter((x): x is string => typeof x === "string" && x.trim().length > 0),
      );
      lessonQuestionVirtuals = await loadLessonLinkedFlashcardVirtuals({
        pathwayId: pathwayScopeId,
        entitlement,
        existingExamQuestionIds: existingExamQ,
      });
    }

    const examQuestionIdsForMeta = new Set<string>();
    for (const c of cards) {
      const id = c.examQuestionId;
      if (typeof id === "string" && id.trim()) examQuestionIdsForMeta.add(id.trim());
    }
    for (const v of lessonQuestionVirtuals) {
      const id = v.examQuestionId;
      if (typeof id === "string" && id.trim()) examQuestionIdsForMeta.add(id.trim());
    }
    const examTopicMetaById = new Map<string, { bodySystem: string | null; topic: string | null }>();
    const examQIdList = [...examQuestionIdsForMeta];
    for (let i = 0; i < examQIdList.length; i += PRISMA_ID_IN_CHUNK_SIZE) {
      const chunk = examQIdList.slice(i, i + PRISMA_ID_IN_CHUNK_SIZE);
      if (!chunk.length) break;
      const rows = await prisma.examQuestion.findMany({
        where: { id: { in: chunk } },
        select: { id: true, bodySystem: true, topic: true },
        take: takeForIdIn(chunk, 5000),
      });
      for (const r of rows) {
        examTopicMetaById.set(r.id, { bodySystem: r.bodySystem, topic: r.topic });
      }
    }

    const categoryCounts: Record<string, number> = {};
    type DbFlashcardRow = (typeof cards)[number];

    type WorkingCard = DbFlashcardRow & {
      builderCategoryId: string;
      lessonMeta?: { href: string; title: string; slug: string };
      /** Present on lesson-linked virtual rows for `sourceKind` filtering. */
      linkedExamQuestionId?: string;
    };

    const cardWithCategory: WorkingCard[] = [];

    for (const card of cards) {
      const qm = card.examQuestionId ? examTopicMetaById.get(card.examQuestionId) : undefined;
      const categoryId = resolveBuilderCategoryId({
        label: card.category.name,
        topicCode: card.category.topicCode,
        pathwayId: card.deck?.pathwayId ?? pathwayScopeId,
        deckTitle: card.deck?.title,
        front: card.front,
        back: card.back,
        examBodySystem: qm?.bodySystem ?? null,
        examTopic: qm?.topic ?? null,
      });
      categoryCounts[categoryId] = (categoryCounts[categoryId] ?? 0) + 1;
      cardWithCategory.push({ ...card, builderCategoryId: categoryId });
    }

    if (pathwayScopeId && allowLessonQuestionVirtuals && !includeCards) {
      for (const v of lessonQuestionVirtuals) {
        const qm = examTopicMetaById.get(v.examQuestionId);
        const categoryId = resolveBuilderCategoryId({
          label: v.row.category.name,
          topicCode: v.row.category.topicCode,
          pathwayId: pathwayScopeId,
          deckTitle: null,
          front: v.row.front,
          back: v.row.back,
          examBodySystem: qm?.bodySystem ?? null,
          examTopic: qm?.topic ?? null,
        });
        categoryCounts[categoryId] = (categoryCounts[categoryId] ?? 0) + 1;
        const synthetic: DbFlashcardRow = {
          ...(v.row as unknown as DbFlashcardRow),
          lessonId: null,
          examQuestionId: v.examQuestionId,
        };
        cardWithCategory.push({
          ...synthetic,
          builderCategoryId: categoryId,
          linkedExamQuestionId: v.examQuestionId,
          lessonMeta: { href: v.lessonHref, title: v.lessonTitle, slug: v.lessonSlug },
        });
      }
    }

    const augmentExamBankPool =
      Boolean(pathwayScopeId && !lessonId) && (sourceKind === "all" || sourceKind === "question");
    const needsProgressEarly = weakOnly || incorrectOnly || notStudiedOnly || recentStudiedOnly;
    const persistenceFiltersEarly = starredOnly || savedOnly || notesOnly || revisitOnly;
    if (
      pathwayScopeId &&
      allowLessonQuestionVirtuals &&
      includeCards &&
      augmentExamBankPool &&
      !needsProgressEarly &&
      !persistenceFiltersEarly
    ) {
      const pid = pathwayScopeId;
      // Await the pre-fired pool chain (access resolution + exam rows loaded in parallel above).
      const _eagerResult = _eagerPoolChain ? (await _eagerPoolChain) : null;
      const poolScopeForBank = _eagerResult?.access?.scope ?? null;
      const pool = _eagerResult?.pool ?? ([] as Awaited<ReturnType<typeof loadExamQuestionRowsForFlashcardPool>>);
      const takenExam = new Set(
        cardWithCategory
          .map((c) => c.examQuestionId)
          .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
          .map((x) => x.trim()),
      );
      for (const row of pool) {
        const qid = row.id.trim();
        if (!qid || takenExam.has(qid)) continue;
        takenExam.add(qid);
        examTopicMetaById.set(qid, { bodySystem: row.bodySystem, topic: row.topic });
        const base = bankExamQuestionRowToFlashcardStudySelectRow(row);
        if (!base) continue;
        const clinicalImageUrl = firstHttpsImageUrlFromExamQuestionImages(row.images);
        const bankExtras: Partial<FlashcardStudySelectRow> = {
          clinicalPearl: row.clinicalPearl ?? null,
          keyTakeaway: row.keyTakeaway ?? null,
          ...(clinicalImageUrl ? { clinicalImageUrl } : {}),
        };
        const categoryId = resolveBuilderCategoryId({
          label: row.topic?.trim() || row.bodySystem?.trim() || "General",
          topicCode: null,
          pathwayId: pid,
          deckTitle: null,
          front: base.front,
          back: base.back,
          examBodySystem: row.bodySystem,
          examTopic: row.topic,
        });
        categoryCounts[categoryId] = (categoryCounts[categoryId] ?? 0) + 1;
        const syntheticId = `exam_bank:${qid}`;
        const mergedExamCard: FlashcardStudySelectRow = { ...base, ...bankExtras };
        const synthetic: DbFlashcardRow = {
          ...(mergedExamCard as unknown as DbFlashcardRow),
          id: syntheticId,
          examQuestionId: qid,
          deck: { pathwayId: pid, title: "Exam question bank" },
          category: { name: row.bodySystem?.trim() || row.topic?.trim() || "General", topicCode: null },
        };
        cardWithCategory.push({ ...synthetic, builderCategoryId: categoryId });
      }
    }

    let lessonVirtualDiagnostics: FlashcardLessonVirtualDiagnostics | null = null;
    if (pathwayScopeId && allowLessonQuestionVirtuals && !includeCards) {
      const pid = pathwayScopeId;
      const { virtuals: mergedLessonVirtuals, diagnostics: lessonInv } =
        collectMergedLessonVirtualFlashcardsForPathway(pid);
      const existingIds = new Set(cardWithCategory.map((c) => c.id));
      for (const v of mergedLessonVirtuals) {
        if (existingIds.has(v.id)) continue;
        // Never surface padding/filler cards to learners — they contain autogenerated placeholder rationales
        if (
          v.sourceSectionKind === "padding" ||
          (v.row.rationaleCorrect ?? "").includes(FLASHCARD_PADDING_CARD_RATIONALE_MARKER)
        ) continue;
        existingIds.add(v.id);
        const categoryId = resolveBuilderCategoryId({
          label: v.row.category.name,
          topicCode: v.row.category.topicCode,
          pathwayId: pathwayScopeId,
          deckTitle: null,
          front: v.row.front,
          back: v.row.back,
        });
        categoryCounts[categoryId] = (categoryCounts[categoryId] ?? 0) + 1;
        const synthetic: DbFlashcardRow = {
          ...(v.row as unknown as DbFlashcardRow),
          lessonId: null,
          examQuestionId: null,
        };
        cardWithCategory.push({
          ...synthetic,
          builderCategoryId: categoryId,
          lessonMeta: { href: v.lessonHref, title: v.lessonTitle, slug: v.lessonSlug },
        });
      }
      lessonVirtualDiagnostics = {
        pathwayId: lessonInv.pathwayId,
        catalogLessonCount: lessonInv.catalogLessonCount,
        lessonsWithDerivedCards: lessonInv.lessonsWithVirtualCards,
        totalGeneratedVirtualCards: lessonInv.totalVirtualCards,
        recallVirtualCount: lessonInv.recallVirtualCount,
        sectionDerivedVirtualCount: lessonInv.sectionDerivedVirtualCount,
        genericFillerSectionCardHits: lessonInv.genericFillerSourcedSectionCards,
        selectedCategoryIds: [...selectedCategories],
        filterModeLabel: describeCustomSessionFilterMode({
          weakOnly,
          incorrectOnly,
          starredOnly,
          notStudiedOnly,
          savedOnly,
          notesOnly,
          revisitOnly,
        }),
      };
    }

    let scoped: WorkingCard[] = cardWithCategory;
    if (sourceKind === "lesson") {
      scoped = scoped.filter((c) => {
        const sk = c.sourceKey ?? "";
        return (
          Boolean(c.lessonId) ||
          sk.startsWith("lessonq:") ||
          sk.startsWith("lessonrecall:") ||
          sk.startsWith("lessonlink:") ||
          sk.startsWith("lessontakeaway:") ||
          sk.startsWith("lessonanchor:")
        );
      });
    } else if (sourceKind === "question") {
      scoped = scoped.filter((c) => {
        const sk = c.sourceKey ?? "";
        return Boolean(c.examQuestionId) || Boolean(c.linkedExamQuestionId) || sk.startsWith("lessonq:");
      });
    }
    if (selectedCategories.length > 0) {
      const selected = new Set(selectedCategories);
      scoped = scoped.filter((c) => selected.has(c.builderCategoryId));
    }

    const needsProgress = weakOnly || incorrectOnly || notStudiedOnly || recentStudiedOnly;
    if (needsProgress) {
      const scopedIds = scoped.map((c) => c.id);
      const progress = await prisma.flashcardProgress.findMany({
        where: {
          userId,
          flashcardId: { in: scopedIds },
        },
        select: { flashcardId: true, lastQuality: true, repetitions: true, lastReviewedAt: true },
        take: takeForIdIn(scopedIds, FLASHCARD_CUSTOM_SESSION_PROGRESS_SCAN_LIMIT),
      });
      const map = new Map(progress.map((p) => [p.flashcardId, p]));
      if (weakOnly) {
        scoped = scoped.filter((c) => {
          const p = map.get(c.id);
          return Boolean(p && ((p.lastQuality ?? 3) <= 2 || p.repetitions < 2));
        });
      }
      if (incorrectOnly) {
        scoped = scoped.filter((c) => {
          const p = map.get(c.id);
          return Boolean(p && (p.lastQuality ?? 3) <= 1);
        });
      }
      if (notStudiedOnly || recentStudiedOnly) {
        scoped = filterCardsByProgressFlags(scoped, map, {
          notStudiedOnly,
          recentStudiedOnly,
          recentWindowMs: recentDays * 86_400_000,
          nowMs: Date.now(),
        });
      }
    }

    const persistenceFiltersActive = starredOnly || savedOnly || notesOnly || revisitOnly;
    if (persistenceFiltersActive) {
      const allowedIds = new Set(stateIds);
      if (starredOnly) {
        if (allowedIds.size === 0) scoped = [];
        else scoped = scoped.filter((c) => allowedIds.has(c.id));
      } else if (allowedIds.size > 0) {
        scoped = scoped.filter((c) => allowedIds.has(c.id));
      }
    }

    // Canonical inventory query — raw SQL with normalized exam keys (audit / discovery parity).
    const useExamForInventory =
      Boolean(pathwayScopeId) && !lessonId && !includeCards && !needsProgress && !persistenceFiltersActive;

    const examInventoryCounts: Record<string, number> = {};
    let examTotal = 0;
    let poolInventoryDiagnostics: FlashcardsPoolInventoryDiagnostics | null = null;

    if (useExamForInventory && pathwayScopeId) {
      const pathway = getExamPathwayById(pathwayScopeId);
      if (pathway) {
        const inv = await loadFlashcardsExamInventoryForPathway({ userId, entitlement, pathway });
        if (inv.ok) {
          examTotal = inv.total;
          Object.assign(examInventoryCounts, inv.countsByBuilderId);
          poolInventoryDiagnostics = inv.diagnostics;
        }
      }
    }

    const useEffectiveTotalForSummary = useExamForInventory && examTotal > 0;

    const selectedCategorySum = selectedCategories.reduce((s, id) => s + (examInventoryCounts[id] ?? 0), 0);
    const matchingCardsForSummary = includeCards
      ? scoped.length
      : useEffectiveTotalForSummary
        ? selectedCategories.length === 0
          ? examTotal
          : selectedCategorySum > 0
            ? selectedCategorySum
            : examTotal
        : scoped.length;

    const sessionShuffleSalt = sessionSeed?.trim() || randomUUID();
    const orderingSeed = shuffle
      ? sessionSeed?.trim() || `${userId}:${sessionShuffleSalt}:${selectedCategories.join(",")}:${mode}`
      : `${sessionShuffleSalt}:ordered`;
    const selectedRows = shuffle ? shuffled(scoped, orderingSeed) : scoped;
    const limited = selectedRows.slice(0, limit);

    const cardsForSession: CustomSessionSerializedCard[] = [];
    if (includeCards) {
      for (const [index, card] of selectedRows.entries()) {
        if (cardsForSession.length >= limit) break;
        const mixedSwap = mode === "mixed" && index % 2 === 1;
        const swap = mode === "definition_to_term" || mixedSwap;
        const topic = builderCategoryTitleForId(pathwayScopeId ?? pathwayId, card.builderCategoryId);
        const {
          builderCategoryId: _bc,
          lessonMeta,
          linkedExamQuestionId: _lq,
          lessonId: _lid,
          examQuestionId: _eqid,
          ...dbRow
        } = card;
        void _bc;
        void _lq;
        void _lid;
        void _eqid;
        try {
          const base = serializeFlashcardForCustomSession(dbRow as FlashcardStudySelectRow, {
            swapFrontBack: swap,
            topic,
            pathwayId: card.deck?.pathwayId ?? pathwayScopeId,
            examOptionShuffleSalt: sessionShuffleSalt,
          });
          const serialized = lessonMeta
            ? {
                ...base,
                lessonHref: lessonMeta.href,
                lessonTitle: lessonMeta.title,
                lessonSlug: lessonMeta.slug,
              }
            : base;
          if (serializedHasUsableMcq(serialized)) cardsForSession.push(serialized);
        } catch {
          // Invalid legacy/passive flashcards are skipped; study mode is MCQ-only.
          continue;
        }
      }
    }

    const plannedCount = includeCards ? cardsForSession.length : limited.length;

    const summary: FlashcardCustomSessionSummary = {
      pathwayId: pathwayScopeId ?? pathwayId,
      topicCode,
      lessonId,
      selectedCategories,
      matchingCards: matchingCardsForSummary,
      returnedCards: plannedCount,
      mode,
      shuffle,
      weakOnly,
      incorrectOnly,
      starredOnly,
      savedOnly,
      notesOnly,
      revisitOnly,
      notStudiedOnly,
      recentStudiedOnly,
      recentDays,
      sourceKind,
      cardLimit: cardLimitRaw ?? "20",
      queryRelaxation,
      sessionShuffleSalt,
      lessonVirtualDiagnostics,
      poolInventoryDiagnostics,
    };

    // Use canonical inventory counts for hub display; fall back to DB flashcard counts
    // when in a card session (includeCards or filtered mode).
    const categoryCountsForOptions = useEffectiveTotalForSummary ? examInventoryCounts : categoryCounts;
    const categoryOptions = applyCountsToBuilderCategories(pathwayScopeId ?? pathwayId, categoryCountsForOptions);
    if (matchingCardsForSummary === 0 || categoryOptions.length === 0) {
      safeServerLog("flashcards", "custom_session_zero_inventory", {
        loader_name: "build_flashcard_custom_session",
        user_id_prefix: userId.slice(0, 8),
        pathway_id: pathwayScopeId ?? pathwayId ?? "",
        tier: String(entitlement.tier ?? ""),
        country: String(entitlement.country ?? ""),
        source_kind: sourceKind,
        include_cards: includeCards ? "1" : "0",
        published_db_flashcards: cards.length,
        working_card_count: cardWithCategory.length,
        scoped_count: scoped.length,
        matching_cards: matchingCardsForSummary,
        returned_cards: plannedCount,
        category_options_count: categoryOptions.length,
        canonical_inventory_total: examTotal,
        canonical_inventory_buckets: Object.keys(examInventoryCounts).length,
        selected_category_count: selectedCategories.length,
        lesson_virtual_count: lessonQuestionVirtuals.length,
        lesson_id: lessonId ?? "",
        topic_code: topicCode ?? "",
      });
    }
    if (process.env.NODE_ENV === "development") {
      let cardsTaggedFromExamMeta = 0;
      let uncategorizedCardRows = 0;
      for (const c of cardWithCategory) {
        if (c.examQuestionId) {
          const m = examTopicMetaById.get(c.examQuestionId);
          if (m && ((m.bodySystem ?? "").trim().length > 0 || (m.topic ?? "").trim().length > 0)) {
            cardsTaggedFromExamMeta += 1;
          }
        }
        if (c.builderCategoryId === FLASHCARD_BUILDER_UNCATEGORIZED_ID) uncategorizedCardRows += 1;
      }
      let poolDiag: Awaited<ReturnType<typeof getStudyQuestionPoolForPathway>> | null = null;
      if (pathwayScopeId) {
        try {
          poolDiag = await getStudyQuestionPoolForPathway({
            entitlement,
            pathwayId: pathwayScopeId,
            country: entitlement.country,
            mode: "flashcards",
          });
        } catch {
          poolDiag = null;
        }
      }
      safeServerLog("flashcards", "hub_inventory_dev", {
        pathwayId: pathwayScopeId ?? pathwayId ?? "",
        studyQuestionPoolLoaded: poolDiag != null,
        studyQuestionPoolSummary: poolDiag ? JSON.stringify(poolDiag).slice(0, 1200) : "",
        topicRowCount: categoryOptions.length,
        workingCardCount: cardWithCategory.length,
        publishedDbFlashcards: cards.length,
        examQuestionMetaRows: examTopicMetaById.size,
        cardsLinkedToExamWithMeta: cardsTaggedFromExamMeta,
        uncategorizedCardRows,
        ...(useExamForInventory
          ? {
              canonicalInventoryTotal: examTotal,
              canonicalInventoryBuckets: Object.keys(examInventoryCounts).length,
            }
          : {}),
      });
    }

    return {
      ok: true,
      queryRelaxation,
      summary,
      categoryOptions,
      cards: cardsForSession,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("flashcards", "custom_session_builder_threw", {
      loader_name: "build_flashcard_custom_session",
      user_id_prefix: userId.slice(0, 8),
      pathway_id: pathwayId ?? "",
      tier: String(entitlement.tier ?? ""),
      country: String(entitlement.country ?? ""),
      error_name: e instanceof Error ? e.name : "unknown",
      error_message: message.slice(0, 500),
    });
    return {
      ok: false,
      code: "database_error",
      message: "Flashcards could not be loaded. Please retry.",
      reason: message.slice(0, 500),
    };
  }
}

export function parseCustomSessionCategories(value: string | null | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseCustomSessionCardLimit(value: string | null | undefined): number {
  if (!value || value === "all") return FLASHCARD_CUSTOM_SESSION_RETURN_LIMIT;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 20;
  return Math.min(FLASHCARD_CUSTOM_SESSION_RETURN_LIMIT, Math.max(10, n));
}

export function parseCustomSessionStudyMode(value: string | null | undefined): CustomSessionStudyMode {
  if (value === "definition_to_term") return value;
  if (value === "term_to_definition") return value;
  if (value === "mixed") return value;
  return "mixed";
}
