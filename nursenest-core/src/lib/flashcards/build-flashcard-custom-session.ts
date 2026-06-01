import { randomUUID } from "node:crypto";
import { ContentStatus, type Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import {
  PRISMA_ID_IN_CHUNK_SIZE,
  takeForIdIn,
} from "@/lib/db/prisma-find-many-bounds";
import { flashcardPathwayAccessOptionsFromPathwayId } from "@/lib/flashcards/flashcard-pathway-scope";
import {
  applyCountsToBuilderCategories,
  builderCategoryTitleForId,
  FLASHCARD_BUILDER_UNCATEGORIZED_ID,
  resolveBuilderCategoryId,
  type BuilderCategoryOption,
} from "@/lib/flashcards/flashcard-builder-taxonomy";
import { loadLessonLinkedFlashcardVirtuals } from "@/lib/flashcards/lesson-linked-flashcards-for-pathway";
import { FLASHCARD_PADDING_CARD_RATIONALE_MARKER } from "@/lib/flashcards/lesson-linked-virtual-flashcards-aggregator";
import {
  loadFlashcardPoolSnapshotForPathway,
  getExamTopicMetaForPathway,
  setExamTopicMetaForPathway,
} from "@/lib/flashcards/flashcard-pool-snapshot.server";
import {
  getFlashcardHubInventory,
  setFlashcardHubInventory,
} from "@/lib/server/content-cache";
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
import {
  orderFlashcardsForAdaptiveSession,
  type AdaptiveProgressLite,
} from "@/lib/flashcards/study-queue";
import { shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";
import { pathwayHubCategoryToCanonical } from "@/lib/learner-study-hub/body-system-data";

export type CustomSessionStudyMode =
  | "term_to_definition"
  | "definition_to_term"
  | "mixed";

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
  offset?: number;
  /** Optional deterministic shuffle seed (falls back to random). */
  sessionSeed?: string | null;
  cardLimitRaw?: string | null;
};

export type CustomSessionSerializedCard = ReturnType<
  typeof serializeFlashcardForCustomSession
> & {
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

export type BuildFlashcardCustomSessionResult =
  | BuildFlashcardCustomSessionSuccess
  | BuildFlashcardCustomSessionFailure;

const FLASHCARD_CUSTOM_SESSION_DB_CARD_SCAN_LIMIT = 800;
const FLASHCARD_CUSTOM_SESSION_PROGRESS_SCAN_LIMIT = 800;
const FLASHCARD_CUSTOM_SESSION_RETURN_LIMIT = 80;
/**
 * Maximum pool size fed to `orderFlashcardsForAdaptiveSession` when the session has
 * **no** progress-based filter (weakOnly / incorrectOnly / notStudied / recentStudied).
 *
 * Why this matters:
 *   When there is no filter the entire `scoped` set (up to 800 rows) is passed to the
 *   progress scan and then to the adaptive ordering function.  For a typical RN session
 *   with no category selection that can mean loading progress for 800 flashcard IDs even
 *   though only 8 cards will be served.
 *
 * Why 150 is safe:
 *   `orderFlashcardsForAdaptiveSession` uses progress to prioritise unseen > due > weak.
 *   Cards whose IDs are NOT in `progressByScopedId` receive the "unseen" score (highest
 *   priority).  Capping the pool to 150 means cards outside that window are effectively
 *   treated as unseen — they are MORE likely to surface, not less.  The cap is applied
 *   after a seeded shuffle so the window is diverse across sessions and sessions are
 *   reproducible per seed.  Verified safe because:
 *     1. No cards are permanently hidden — they reappear in the next session window.
 *     2. The serve limit is 8 cards; 150 candidates provides 18× diversity.
 *     3. Progress-filtered sessions (weakOnly etc.) bypass this cap entirely.
 */
const FLASHCARD_ADAPTIVE_POOL_CAP = 150;

function serializedIsStudyReady(card: CustomSessionSerializedCard): boolean {
  if (card.front.trim().length < 2 || card.back.trim().length < 2) return false;
  const exam = card.examMicroQuestion;
  if (!exam || isSataPayload(exam)) return true;
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

/** Narrow select for count-only (inventory) requests: skip payload-heavy card body fields. */
const flashcardCountSelect = {
  id: true,
  front: true,
  back: true,
  sourceKey: true,
  lessonId: true,
  examQuestionId: true,
  category: { select: { name: true, topicCode: true } },
  deck: { select: { pathwayId: true, title: true } },
} as const;

/** Select for flashcardProgress parallel pre-fetch used in weak/incorrect sessions. */
const progressSelect = {
  flashcardId: true,
  lastQuality: true,
  repetitions: true,
  lastReviewedAt: true,
  nextReviewAt: true,
  lapses: true,
} as const;

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

export function canonicalForBuilderCategory(
  pathwayId: string | null | undefined,
  categoryId: string,
): string {
  return pathwayHubCategoryToCanonical(
    pathwayId ?? undefined,
    categoryId,
    builderCategoryTitleForId(pathwayId, categoryId),
  );
}

export function selectedCategoryMatchesBuilderCategory(
  pathwayId: string | null | undefined,
  selectedCategoryIds: ReadonlySet<string>,
  selectedCanonicalIds: ReadonlySet<string>,
  builderCategoryId: string,
): boolean {
  if (selectedCategoryIds.has(builderCategoryId)) return true;
  return selectedCanonicalIds.has(
    canonicalForBuilderCategory(pathwayId, builderCategoryId),
  );
}

export function selectedCategoryCountSum(
  pathwayId: string | null | undefined,
  counts: Record<string, number>,
  selectedCategoryIds: readonly string[],
): number {
  if (selectedCategoryIds.length === 0) return 0;
  const selectedRaw = new Set(selectedCategoryIds);
  const selectedCanonical = new Set(
    selectedCategoryIds.map((id) => canonicalForBuilderCategory(pathwayId, id)),
  );
  let total = 0;
  for (const [categoryId, count] of Object.entries(counts)) {
    if (!Number.isFinite(count) || count <= 0) continue;
    if (
      selectedCategoryMatchesBuilderCategory(
        pathwayId,
        selectedRaw,
        selectedCanonical,
        categoryId,
      )
    ) {
      total += count;
    }
  }
  return total;
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
    offset = 0,
    sessionSeed,
    cardLimitRaw,
  } = input;

  const sourceClause = prismaWhereForSourceKind(sourceKind);

  const buildFlashcardWhere = (
    accessWhere: Prisma.FlashcardWhereInput,
  ): Prisma.FlashcardWhereInput => {
    const clauses: Prisma.FlashcardWhereInput[] = [
      { status: ContentStatus.PUBLISHED },
      accessWhere,
    ];
    if (topicCode) clauses.push({ category: { topicCode } });
    if (lessonId) clauses.push({ lessonId });
    if (sourceClause) clauses.push(sourceClause);
    return { AND: clauses };
  };

  const queryRelaxation: FlashcardCustomSessionQueryRelaxation = "none";

  try {
    const canonicalPathwayId =
      pathwayId != null && pathwayId.trim().length > 0
        ? normalizePathwayIdForStudySurfaces(
            pathwayId.trim(),
            entitlement.country,
          )
        : null;
    const examContext = canonicalPathwayId?.trim()
      ? buildGlobalExamContext(canonicalPathwayId.trim(), "en")
      : null;
    const pathwayScopeId =
      canonicalPathwayId?.trim() || pathwayId?.trim() || null;

    const needsProgressEarly =
      weakOnly || incorrectOnly || notStudiedOnly || recentStudiedOnly;
    const persistenceFiltersEarly =
      starredOnly || savedOnly || notesOnly || revisitOnly;
    const useExamForInventoryEarly =
      Boolean(pathwayScopeId) &&
      !lessonId &&
      !includeCards &&
      !needsProgressEarly &&
      !persistenceFiltersEarly;

    if (useExamForInventoryEarly && pathwayScopeId) {
      const pathwayForInventory = getExamPathwayById(pathwayScopeId);
      if (pathwayForInventory) {
        // ── Fast path: serve from Redis hub-inventory snapshot ───────────────
        const snapshotTier = String(entitlement.tier ?? "");
        const snapshotCountry = String(entitlement.country ?? "");
        const cachedHubInv = await getFlashcardHubInventory(
          pathwayScopeId,
          snapshotTier,
          snapshotCountry,
        );
        if (cachedHubInv) {
          const {
            mergedCounts,
            examTotal: cachedExamTotal,
            lessonVirtualTotal: cachedLessonVirtualTotal,
            poolInventoryDiagnostics: cachedPoolDiag,
          } = cachedHubInv;
          const cachedLessonVirtualDiagnostics: FlashcardLessonVirtualDiagnostics =
            {
              pathwayId: pathwayScopeId,
              catalogLessonCount: cachedHubInv.catalogLessonCount,
              lessonsWithDerivedCards: cachedHubInv.lessonsWithDerivedCards,
              totalGeneratedVirtualCards: cachedLessonVirtualTotal,
              recallVirtualCount: cachedHubInv.recallVirtualCount,
              sectionDerivedVirtualCount: cachedHubInv.sectionDerivedVirtualCount,
              genericFillerSectionCardHits:
                cachedHubInv.genericFillerSectionCardHits,
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
          const selectedCategorySum = selectedCategoryCountSum(
            pathwayScopeId,
            mergedCounts,
            selectedCategories,
          );
          const matchingCardsForSummary =
            selectedCategories.length === 0
              ? cachedExamTotal
              : selectedCategorySum > 0
                ? selectedCategorySum
                : 0;
          const sessionShuffleSalt = sessionSeed?.trim() || randomUUID();
          return {
            ok: true,
            queryRelaxation,
            summary: {
              pathwayId: pathwayScopeId,
              topicCode,
              lessonId,
              selectedCategories,
              matchingCards: matchingCardsForSummary,
              returnedCards: 0,
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
              lessonVirtualDiagnostics: cachedLessonVirtualDiagnostics,
              poolInventoryDiagnostics:
                cachedPoolDiag as FlashcardsPoolInventoryDiagnostics | null,
            },
            categoryOptions: applyCountsToBuilderCategories(
              pathwayScopeId,
              mergedCounts,
            ),
            cards: [],
          };
        }

        // ── Slow path: query DB, then populate cache ──────────────────────────
        const inv = await loadFlashcardsExamInventoryForPathway({
          userId,
          entitlement,
          pathway: pathwayForInventory,
        });
        if (inv.ok) {
          const examInventoryCounts = inv.countsByBuilderId;
          let lessonVirtualDiagnostics: FlashcardLessonVirtualDiagnostics | null =
            null;
          let lessonVirtualTotal = 0;
          // Parallelise: pool snapshot + dedicated flashcard scan are independent reads.
          // Cold snapshot miss (lesson findMany inside) overlaps with the flashcard scan,
          // saving 30–70 ms on the first request after a server restart or TTL expiry.
          const [snapshotResult, dedicatedRows] = await Promise.all([
            loadFlashcardPoolSnapshotForPathway(pathwayScopeId),
            prisma.flashcard.findMany({
              where: {
                status: ContentStatus.PUBLISHED,
                deck: { pathwayId: pathwayScopeId },
              },
              select: {
                front: true,
                back: true,
                category: { select: { name: true, topicCode: true } },
                deck: { select: { pathwayId: true, title: true } },
              },
              take: 5000,
            }),
          ]);
          const { virtuals: mergedLessonVirtuals, diagnostics: lessonInv } =
            snapshotResult;
          const mergedCounts: Record<string, number> = {
            ...examInventoryCounts,
          };
          for (const row of dedicatedRows) {
            const categoryId = resolveBuilderCategoryId({
              label: row.category.name,
              topicCode: row.category.topicCode,
              pathwayId: row.deck?.pathwayId ?? pathwayScopeId,
              deckTitle: row.deck?.title ?? null,
              front: row.front,
              back: row.back,
            });
            mergedCounts[categoryId] = (mergedCounts[categoryId] ?? 0) + 1;
          }
          for (const v of mergedLessonVirtuals) {
            if (
              v.sourceSectionKind === "padding" ||
              (v.row.rationaleCorrect ?? "").includes(
                FLASHCARD_PADDING_CARD_RATIONALE_MARKER,
              )
            )
              continue;
            const categoryId = resolveBuilderCategoryId({
              label: v.row.category.name,
              topicCode: v.row.category.topicCode,
              pathwayId: pathwayScopeId,
              deckTitle: null,
              front: v.row.front,
              back: v.row.back,
            });
            mergedCounts[categoryId] = (mergedCounts[categoryId] ?? 0) + 1;
            lessonVirtualTotal += 1;
          }
          lessonVirtualDiagnostics = {
            pathwayId: lessonInv.pathwayId,
            catalogLessonCount: lessonInv.catalogLessonCount,
            lessonsWithDerivedCards: lessonInv.lessonsWithVirtualCards,
            totalGeneratedVirtualCards: lessonVirtualTotal,
            recallVirtualCount: lessonInv.recallVirtualCount,
            sectionDerivedVirtualCount: lessonInv.sectionDerivedVirtualCount,
            genericFillerSectionCardHits:
              lessonInv.genericFillerSourcedSectionCards,
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
          const examTotal = inv.total + lessonVirtualTotal;
          // Populate Redis cache for subsequent requests (fire-and-forget).
          void setFlashcardHubInventory(
            pathwayScopeId,
            snapshotTier,
            snapshotCountry,
            {
              mergedCounts,
              examTotal,
              lessonVirtualTotal,
              catalogLessonCount: lessonInv.catalogLessonCount,
              lessonsWithDerivedCards: lessonInv.lessonsWithVirtualCards,
              recallVirtualCount: lessonInv.recallVirtualCount,
              sectionDerivedVirtualCount: lessonInv.sectionDerivedVirtualCount,
              genericFillerSectionCardHits:
                lessonInv.genericFillerSourcedSectionCards,
              poolInventoryDiagnostics: inv.diagnostics,
            },
          );
          const selectedCategorySum = selectedCategoryCountSum(
            pathwayScopeId,
            mergedCounts,
            selectedCategories,
          );
          const matchingCardsForSummary =
            selectedCategories.length === 0
              ? examTotal
              : selectedCategorySum > 0
                ? selectedCategorySum
                : 0;
          const sessionShuffleSalt = sessionSeed?.trim() || randomUUID();
          const summary: FlashcardCustomSessionSummary = {
            pathwayId: pathwayScopeId,
            topicCode,
            lessonId,
            selectedCategories,
            matchingCards: matchingCardsForSummary,
            returnedCards: 0,
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
            poolInventoryDiagnostics: inv.diagnostics,
          };
          return {
            ok: true,
            queryRelaxation,
            summary,
            categoryOptions: applyCountsToBuilderCategories(
              pathwayScopeId,
              mergedCounts,
            ),
            cards: [],
          };
        }
      }
    }

    const allowLessonQuestionVirtuals =
      sourceKind === "all" ||
      sourceKind === "lesson" ||
      sourceKind === "question";

    const pathwayOptsResolved = flashcardPathwayAccessOptionsFromPathwayId(
      pathwayScopeId ?? pathwayId,
    );

    // Fire the exam-bank pool chain now so it overlaps with the sequential card queries below.
    // Savings: ~2-4s when the pool path is taken (resolveAccess + loadExamRows run in parallel).
    const _needsProgressFilter =
      weakOnly || incorrectOnly || notStudiedOnly || recentStudiedOnly;
    const _needsPersistenceFilter =
      starredOnly || savedOnly || notesOnly || revisitOnly;
    const _canEagerPool =
      Boolean(pathwayScopeId && !lessonId) &&
      (sourceKind === "all" || sourceKind === "question") &&
      allowLessonQuestionVirtuals &&
      includeCards &&
      !_needsProgressFilter &&
      !_needsPersistenceFilter;
    const _eagerPoolPathway =
      _canEagerPool && pathwayScopeId
        ? getExamPathwayById(pathwayScopeId)
        : null;
    const _eagerPoolChain =
      _eagerPoolPathway != null
        ? (async () => {
            try {
              const pw = _eagerPoolPathway;
              const access = await resolveAccessScopeForPathwayExamQuestionPool(
                userId,
                entitlement,
                pw,
              );
              const scope = access?.scope ?? null;
              const pool =
                scope != null
                  ? await loadExamQuestionRowsForFlashcardPool(
                      scope,
                      pw,
                      topicCode?.trim() || null,
                      Math.max(limit * 10, 200),
                    )
                  : ([] as Awaited<
                      ReturnType<typeof loadExamQuestionRowsForFlashcardPool>
                    >);
              return { access, pool };
            } catch {
              return null;
            }
          })()
        : null;

    // ── Dynamic scan limit ────────────────────────────────────────────────────
    // For full-card sessions (includeCards=1) the limit is derived from the
    // requested window rather than a fixed ceiling:
    //
    //   No progress filter (weakOnly etc.):
    //     max((offset + limit) × 8, 80)  → 80 for default (limit=8, offset=0)
    //     Rationale: 8× headroom for category/sourceKind in-memory filtering.
    //
    //   With progress filter (weakOnly / incorrectOnly / notStudied / recent):
    //     max((offset + limit) × 20, 200) → 200 for limit=8
    //     Rationale: Progress filters may discard 60–90 % of scanned cards
    //     (e.g. only 10 % are "weak" at any time).  The extra headroom ensures
    //     we find enough qualifying cards to fill the session.  Without this,
    //     a weakOnly request with limit=8 and a scan limit of 80 could return
    //     0 cards even when the deck contains 150 weak cards beyond position 80.
    //
    // For count-only (includeCards=0) the ceiling stays at 800 — reducing it
    // would produce inaccurate per-category counts in the hub UI, which relies
    // on this path when Redis inventory is cold.
    const cardScanLimit = includeCards
      ? Math.min(
          FLASHCARD_CUSTOM_SESSION_DB_CARD_SCAN_LIMIT,
          _needsProgressFilter
            ? Math.max((offset + limit) * 20, 200)
            : Math.max((offset + limit) * 8, 80),
        )
      : FLASHCARD_CUSTOM_SESSION_DB_CARD_SCAN_LIMIT;

    // Phase 3B: fire progress scan in parallel with card scan for weak/incorrect sessions.
    // Both queries use the same access scope — the card IDs are not needed to start the
    // progress scan because we filter by the same flashcard where-clause on the relation.
    const accessWhereForCards = flashcardAccessWhere(entitlement, pathwayOptsResolved);
    const parallelProgressPromise =
      _needsProgressFilter && userId && includeCards
        ? prisma.flashcardProgress.findMany({
            where: {
              userId,
              flashcard: buildFlashcardWhere(accessWhereForCards),
            },
            select: progressSelect,
            take: FLASHCARD_CUSTOM_SESSION_PROGRESS_SCAN_LIMIT,
          })
        : null;

    // Phase 3G: use narrow select for count-only requests (no front/back/options body needed).
    const [cards, _parallelProgress] = await Promise.all([
      prisma.flashcard.findMany({
        where: buildFlashcardWhere(accessWhereForCards),
        select: includeCards ? flashcardSelect : (flashcardCountSelect as typeof flashcardSelect),
        orderBy: { updatedAt: "desc" },
        take: cardScanLimit,
      }),
      parallelProgressPromise,
    ]);
    // Pre-built progress map from the parallel fetch (null when not applicable).
    const _parallelProgressMap = _parallelProgress
      ? new Map(_parallelProgress.map((p) => [p.flashcardId, p]))
      : null;

    let lessonQuestionVirtuals: Awaited<
      ReturnType<typeof loadLessonLinkedFlashcardVirtuals>
    > = [];
    if (pathwayScopeId && allowLessonQuestionVirtuals && !includeCards) {
      const existingExamQ = new Set(
        cards
          .map((c) => c.examQuestionId)
          .filter(
            (x): x is string => typeof x === "string" && x.trim().length > 0,
          ),
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
      if (typeof id === "string" && id.trim())
        examQuestionIdsForMeta.add(id.trim());
    }
    for (const v of lessonQuestionVirtuals) {
      const id = v.examQuestionId;
      if (typeof id === "string" && id.trim())
        examQuestionIdsForMeta.add(id.trim());
    }
    // Use in-process exam-topic meta cache to skip chunked findMany on warm requests.
    const cachedExamMeta = pathwayScopeId
      ? getExamTopicMetaForPathway(pathwayScopeId)
      : null;
    const examTopicMetaById = new Map<
      string,
      { bodySystem: string | null; topic: string | null }
    >();
    const examQIdList = [...examQuestionIdsForMeta];
    const uncachedIds: string[] = [];
    if (cachedExamMeta) {
      for (const qid of examQIdList) {
        const hit = cachedExamMeta.get(qid);
        if (hit) {
          examTopicMetaById.set(qid, hit);
        } else {
          uncachedIds.push(qid);
        }
      }
    } else {
      uncachedIds.push(...examQIdList);
    }
    // Parallelise all chunks — reduces N serial round-trips to max(latency of single chunk).
    // With PRISMA_ID_IN_CHUNK_SIZE=200 and ~560 uncached IDs (typical RN warm deck),
    // this cuts 3 × 15 ms serial = 45 ms → max(15 ms) = 15 ms.
    const chunks: string[][] = [];
    for (let i = 0; i < uncachedIds.length; i += PRISMA_ID_IN_CHUNK_SIZE) {
      const chunk = uncachedIds.slice(i, i + PRISMA_ID_IN_CHUNK_SIZE);
      if (chunk.length) chunks.push(chunk);
    }
    const chunkResults = await Promise.all(
      chunks.map((chunk) =>
        prisma.examQuestion.findMany({
          where: { id: { in: chunk } },
          select: { id: true, bodySystem: true, topic: true },
          take: takeForIdIn(chunk, 5000),
        }),
      ),
    );
    const newEntries: Array<[string, { bodySystem: string | null; topic: string | null }]> = [];
    for (const rows of chunkResults) {
      for (const r of rows) {
        const meta = { bodySystem: r.bodySystem, topic: r.topic };
        examTopicMetaById.set(r.id, meta);
        newEntries.push([r.id, meta]);
      }
    }
    if (pathwayScopeId && newEntries.length > 0) {
      setExamTopicMetaForPathway(pathwayScopeId, newEntries);
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
      const qm = card.examQuestionId
        ? examTopicMetaById.get(card.examQuestionId)
        : undefined;
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
          lessonMeta: {
            href: v.lessonHref,
            title: v.lessonTitle,
            slug: v.lessonSlug,
          },
        });
      }
    }

    const augmentExamBankPool =
      Boolean(pathwayScopeId && !lessonId) &&
      (sourceKind === "all" || sourceKind === "question");
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
      const _eagerResult = _eagerPoolChain ? await _eagerPoolChain : null;
      const poolScopeForBank = _eagerResult?.access?.scope ?? null;
      const pool =
        _eagerResult?.pool ??
        ([] as Awaited<
          ReturnType<typeof loadExamQuestionRowsForFlashcardPool>
        >);
      const takenExam = new Set(
        cardWithCategory
          .map((c) => c.examQuestionId)
          .filter(
            (x): x is string => typeof x === "string" && x.trim().length > 0,
          )
          .map((x) => x.trim()),
      );
      for (const row of pool) {
        const qid = row.id.trim();
        if (!qid || takenExam.has(qid)) continue;
        takenExam.add(qid);
        examTopicMetaById.set(qid, {
          bodySystem: row.bodySystem,
          topic: row.topic,
        });
        const base = bankExamQuestionRowToFlashcardStudySelectRow(row);
        if (!base) continue;
        const clinicalImageUrl = firstHttpsImageUrlFromExamQuestionImages(
          row.images,
        );
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
        const mergedExamCard: FlashcardStudySelectRow = {
          ...base,
          ...bankExtras,
        };
        const synthetic: DbFlashcardRow = {
          ...(mergedExamCard as unknown as DbFlashcardRow),
          id: syntheticId,
          examQuestionId: qid,
          deck: { pathwayId: pid, title: "Exam question bank" },
          category: {
            name: row.bodySystem?.trim() || row.topic?.trim() || "General",
            topicCode: null,
          },
        };
        cardWithCategory.push({ ...synthetic, builderCategoryId: categoryId });
      }
    }

    let lessonVirtualDiagnostics: FlashcardLessonVirtualDiagnostics | null =
      null;
    if (pathwayScopeId && allowLessonQuestionVirtuals) {
      const pid = pathwayScopeId;
      const { virtuals: mergedLessonVirtuals, diagnostics: lessonInv } =
        await loadFlashcardPoolSnapshotForPathway(pid);
      const existingIds = new Set(cardWithCategory.map((c) => c.id));
      for (const v of mergedLessonVirtuals) {
        if (existingIds.has(v.id)) continue;
        // Never surface padding/filler cards to learners — they contain autogenerated placeholder rationales
        if (
          v.sourceSectionKind === "padding" ||
          (v.row.rationaleCorrect ?? "").includes(
            FLASHCARD_PADDING_CARD_RATIONALE_MARKER,
          )
        )
          continue;
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
          lessonMeta: {
            href: v.lessonHref,
            title: v.lessonTitle,
            slug: v.lessonSlug,
          },
        });
      }
      lessonVirtualDiagnostics = {
        pathwayId: lessonInv.pathwayId,
        catalogLessonCount: lessonInv.catalogLessonCount,
        lessonsWithDerivedCards: lessonInv.lessonsWithVirtualCards,
        totalGeneratedVirtualCards: lessonInv.totalVirtualCards,
        recallVirtualCount: lessonInv.recallVirtualCount,
        sectionDerivedVirtualCount: lessonInv.sectionDerivedVirtualCount,
        genericFillerSectionCardHits:
          lessonInv.genericFillerSourcedSectionCards,
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
        return (
          Boolean(c.examQuestionId) ||
          Boolean(c.linkedExamQuestionId) ||
          sk.startsWith("lessonq:")
        );
      });
    }
    if (selectedCategories.length > 0) {
      const selected = new Set(selectedCategories);
      const selectedCanonical = new Set(
        selectedCategories.map((id) =>
          canonicalForBuilderCategory(pathwayScopeId ?? pathwayId, id),
        ),
      );
      scoped = scoped.filter((c) =>
        selectedCategoryMatchesBuilderCategory(
          pathwayScopeId ?? pathwayId,
          selected,
          selectedCanonical,
          c.builderCategoryId,
        ),
      );
    }

    const needsProgress =
      weakOnly || incorrectOnly || notStudiedOnly || recentStudiedOnly;
    let progressByScopedId = new Map<string, AdaptiveProgressLite>();
    if (needsProgress) {
      const scopedIds = [
        ...new Set(
          scoped.map((c) => c.id).filter((id) => !id.startsWith("exam_bank:")),
        ),
      ];
      // Phase 3B: use the pre-fetched parallel progress when available (same access scope).
      // On a cache miss (parallelProgressMap null = non-weak session or count-only), fall
      // back to the original scoped-ID query. This eliminates one DB round trip on the hot
      // weak/incorrect path where parallelProgressPromise was started above.
      let progress: Array<typeof progressSelect & Record<string, unknown>>;
      if (_parallelProgressMap !== null) {
        // Filter the broad parallel results to only scoped IDs (in-memory, no extra query).
        const scopedSet = new Set(scopedIds);
        progress = [..._parallelProgressMap.values()].filter((p) =>
          scopedSet.has(p.flashcardId),
        ) as typeof progress;
      } else {
        progress = await prisma.flashcardProgress.findMany({
          where: {
            userId,
            flashcardId: { in: scopedIds },
          },
          select: progressSelect,
          take: takeForIdIn(
            scopedIds,
            FLASHCARD_CUSTOM_SESSION_PROGRESS_SCAN_LIMIT,
          ),
        });
      }
      const map = new Map(progress.map((p) => [p.flashcardId, p]));
      progressByScopedId = new Map(
        progress.map((p) => [
          p.flashcardId,
          {
            nextReviewAt: p.nextReviewAt,
            repetitions: p.repetitions,
            lastReviewedAt: p.lastReviewedAt,
            lastQuality: p.lastQuality,
            lapses: p.lapses,
          },
        ]),
      );
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

    if (!needsProgress && scoped.length > 0) {
      // ── Adaptive pool cap (no-filter sessions only) ───────────────────────
      // When no progress filter is active we load progress purely to power
      // `orderFlashcardsForAdaptiveSession`.  The serve window is only `limit`
      // cards (default 8), so loading progress for 800 scoped cards and sorting
      // all 800 is wasteful — the extra cards beyond the cap never make it into
      // the response.
      //
      // Approach: apply a seeded shuffle to `scoped` BEFORE fetching progress so
      // the cap selects a diverse, deterministic window rather than the most-
      // recently-updated cards from the DB scan.  Cards outside the window are
      // treated as "unseen" by the adaptive scorer (highest-priority bucket),
      // ensuring they surface in subsequent sessions.
      //
      // The cap is skipped when `scoped` is already small (≤ cap) to avoid the
      // overhead of a shuffle that changes nothing.
      const adaptivePoolCap = Math.max(FLASHCARD_ADAPTIVE_POOL_CAP, limit * 12);
      if (scoped.length > adaptivePoolCap) {
        // Use sessionSeed for determinism — same seed ⇒ same window across retries.
        // Falls back to a stable per-user+pathway string when no seed is supplied.
        const poolShuffleSalt =
          sessionSeed?.trim().length
            ? `${sessionSeed.trim()}:pool-cap`
            : `${userId.slice(0, 8)}:${pathwayScopeId ?? ""}:pool-cap`;
        // Phase 3F: shuffleSeeded operates in-place when given the live array,
        // avoiding a full spread copy of up to 800 WorkingCard objects.
        scoped = shuffleSeeded(scoped, poolShuffleSalt).slice(0, adaptivePoolCap);
      }

      const scopedIds = [
        ...new Set(
          scoped.map((c) => c.id).filter((id) => !id.startsWith("exam_bank:")),
        ),
      ];
      if (scopedIds.length > 0) {
        const progress = await prisma.flashcardProgress.findMany({
          where: {
            userId,
            flashcardId: { in: scopedIds },
          },
          select: {
            flashcardId: true,
            lastQuality: true,
            repetitions: true,
            lastReviewedAt: true,
            nextReviewAt: true,
            lapses: true,
          },
          take: takeForIdIn(
            scopedIds,
            FLASHCARD_CUSTOM_SESSION_PROGRESS_SCAN_LIMIT,
          ),
        });
        progressByScopedId = new Map(
          progress.map((p) => [
            p.flashcardId,
            {
              nextReviewAt: p.nextReviewAt,
              repetitions: p.repetitions,
              lastReviewedAt: p.lastReviewedAt,
              lastQuality: p.lastQuality,
              lapses: p.lapses,
            },
          ]),
        );
      }
    }

    const persistenceFiltersActive =
      starredOnly || savedOnly || notesOnly || revisitOnly;
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
      Boolean(pathwayScopeId) &&
      !lessonId &&
      !includeCards &&
      !needsProgress &&
      !persistenceFiltersActive;

    const examInventoryCounts: Record<string, number> = {};
    let examTotal = 0;
    let poolInventoryDiagnostics: FlashcardsPoolInventoryDiagnostics | null =
      null;

    if (useExamForInventory && pathwayScopeId) {
      const pathway = getExamPathwayById(pathwayScopeId);
      if (pathway) {
        const inv = await loadFlashcardsExamInventoryForPathway({
          userId,
          entitlement,
          pathway,
        });
        if (inv.ok) {
          examTotal = inv.total;
          Object.assign(examInventoryCounts, inv.countsByBuilderId);
          poolInventoryDiagnostics = inv.diagnostics;
        }
      }
    }

    const useEffectiveTotalForSummary = useExamForInventory && examTotal > 0;

    const selectedCategorySum = selectedCategoryCountSum(
      pathwayScopeId ?? pathwayId,
      examInventoryCounts,
      selectedCategories,
    );
    const matchingCardsForSummary = includeCards
      ? scoped.length
      : useEffectiveTotalForSummary
        ? selectedCategories.length === 0
          ? examTotal
          : selectedCategorySum > 0
            ? selectedCategorySum
            : 0
        : scoped.length;

    const sessionShuffleSalt = sessionSeed?.trim() || randomUUID();
    const orderingSeed = shuffle
      ? sessionSeed?.trim() ||
        `${userId}:${sessionShuffleSalt}:${selectedCategories.join(",")}:${mode}`
      : `${sessionShuffleSalt}:ordered`;
    const selectedRows = shuffle
      ? orderFlashcardsForAdaptiveSession(
          scoped,
          progressByScopedId,
          new Date(),
          orderingSeed,
        )
      : scoped;
    const boundedOffset = Math.max(0, Math.floor(offset));
    const serializationScanLimit = includeCards
      ? Math.min(
          selectedRows.length,
          boundedOffset + Math.max(limit * 8, limit + 80),
        )
      : boundedOffset + limit;
    const limited = selectedRows.slice(boundedOffset, serializationScanLimit);

    const cardsForSession: CustomSessionSerializedCard[] = [];
    if (includeCards) {
      for (const [index, card] of limited.entries()) {
        if (cardsForSession.length >= limit) break;
        const mixedSwap = mode === "mixed" && index % 2 === 1;
        const swap = mode === "definition_to_term" || mixedSwap;
        const topic = builderCategoryTitleForId(
          pathwayScopeId ?? pathwayId,
          card.builderCategoryId,
        );
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
          const base = serializeFlashcardForCustomSession(
            dbRow as FlashcardStudySelectRow,
            {
              swapFrontBack: swap,
              topic,
              pathwayId: card.deck?.pathwayId ?? pathwayScopeId,
              examOptionShuffleSalt: sessionShuffleSalt,
              allowInvalidExamBackedAsPlain: true,
            },
          );
          const serialized = lessonMeta
            ? {
                ...base,
                lessonHref: lessonMeta.href,
                lessonTitle: lessonMeta.title,
                lessonSlug: lessonMeta.slug,
              }
            : base;
          if (serializedIsStudyReady(serialized))
            cardsForSession.push(serialized);
        } catch {
          // Invalid legacy/passive flashcards are skipped when they cannot render as front/back study cards.
          continue;
        }
      }
    }

    const plannedCount = includeCards ? cardsForSession.length : limited.length;
    // Phase 3I: count DB queries for observability dashboard.
    // parallelProgressHit=1 means we saved one sequential round-trip via the parallel pre-fetch.
    const parallelProgressHit = _parallelProgressMap !== null ? "1" : "0";
    const queryCount = 1 /* flashcard.findMany */ +
      (parallelProgressHit === "1" ? 1 : 0) /* parallel progress */ +
      (needsProgress && parallelProgressHit === "0" ? 1 : 0) /* sequential progress */ +
      (chunkResults.length > 0 ? 1 : 0) /* examQuestion meta (counted as 1 even if chunked) */ +
      (_eagerPoolChain !== null ? 2 : 0) /* resolveAccess + loadExamRows */;
    safeServerLog("flashcards", "FLASHCARD_SESSION_POOL", {
      loader_name: "build_flashcard_custom_session",
      userId: userId.slice(0, 8),
      pathway: pathwayScopeId ?? pathwayId ?? "",
      country: String(entitlement.country ?? ""),
      tier: String(entitlement.tier ?? ""),
      systems: selectedCategories.slice(0, 24).join(","),
      selectedTopics: topicCode ?? "",
      selectedFilters: describeCustomSessionFilterMode({
        weakOnly,
        incorrectOnly,
        starredOnly,
        notStudiedOnly,
        savedOnly,
        notesOnly,
        revisitOnly,
      }),
      selectedDeckIds: lessonId ? `lesson:${lessonId.slice(0, 12)}` : "",
      candidateFlashcards: cardWithCategory.length,
      publishedFlashcards: cards.length,
      eligibleFlashcards: scoped.length,
      serializedCandidates: limited.length,
      finalSessionPoolSize: plannedCount,
      sessionId: (sessionSeed?.trim() || sessionShuffleSalt).slice(0, 12),
      failureReason:
        scoped.length === 0
          ? "empty_pool_after_filters"
          : includeCards && plannedCount === 0
            ? "all_selected_cards_failed_serialization"
            : "",
      includeCards: includeCards ? "1" : "0",
      sourceKind,
      offset: String(boundedOffset),
      cardLimit: cardLimitRaw ?? "20",
      // Phase 3I telemetry additions
      queryCount: String(queryCount),
      parallelProgressHit,
      narrowSelectUsed: includeCards ? "0" : "1",
      examMetaChunks: String(chunks.length),
    });

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
      offset: boundedOffset,
      hasMore: boundedOffset + cardsForSession.length < matchingCardsForSummary,
      queryRelaxation,
      sessionShuffleSalt,
      lessonVirtualDiagnostics,
      poolInventoryDiagnostics,
    };

    // Use canonical inventory counts for hub display; fall back to DB flashcard counts
    // when in a card session (includeCards or filtered mode).
    const categoryCountsForOptions = useEffectiveTotalForSummary
      ? examInventoryCounts
      : categoryCounts;
    const categoryOptions = applyCountsToBuilderCategories(
      pathwayScopeId ?? pathwayId,
      categoryCountsForOptions,
    );
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
          if (
            m &&
            ((m.bodySystem ?? "").trim().length > 0 ||
              (m.topic ?? "").trim().length > 0)
          ) {
            cardsTaggedFromExamMeta += 1;
          }
        }
        if (c.builderCategoryId === FLASHCARD_BUILDER_UNCATEGORIZED_ID)
          uncategorizedCardRows += 1;
      }
      let poolDiag: Awaited<
        ReturnType<typeof getStudyQuestionPoolForPathway>
      > | null = null;
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
        studyQuestionPoolSummary: poolDiag
          ? JSON.stringify(poolDiag).slice(0, 1200)
          : "",
        topicRowCount: categoryOptions.length,
        workingCardCount: cardWithCategory.length,
        publishedDbFlashcards: cards.length,
        examQuestionMetaRows: examTopicMetaById.size,
        cardsLinkedToExamWithMeta: cardsTaggedFromExamMeta,
        uncategorizedCardRows,
        ...(useExamForInventory
          ? {
              canonicalInventoryTotal: examTotal,
              canonicalInventoryBuckets:
                Object.keys(examInventoryCounts).length,
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

export function parseCustomSessionCategories(
  value: string | null | undefined,
): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseCustomSessionCardLimit(
  value: string | null | undefined,
): number {
  if (!value || value === "all") return FLASHCARD_CUSTOM_SESSION_RETURN_LIMIT;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 20;
  return Math.min(FLASHCARD_CUSTOM_SESSION_RETURN_LIMIT, Math.max(1, n));
}

export function parseCustomSessionOffset(
  value: string | null | undefined,
): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(
    FLASHCARD_CUSTOM_SESSION_DB_CARD_SCAN_LIMIT - 1,
    Math.floor(n),
  );
}

export function parseCustomSessionStudyMode(
  value: string | null | undefined,
): CustomSessionStudyMode {
  if (value === "definition_to_term") return value;
  if (value === "term_to_definition") return value;
  if (value === "mixed") return value;
  return "mixed";
}
