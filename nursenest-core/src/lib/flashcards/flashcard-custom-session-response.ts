import type { BuilderCategoryOption } from "@/lib/flashcards/flashcard-builder-taxonomy";
import type { FlashcardsPoolInventoryDiagnostics } from "@/lib/flashcards/flashcards-hub-types";

export type FlashcardCustomSessionQueryRelaxation = "none" | "dropped_pathway_scope" | "dropped_country_match";

/** Hub + API transparency for catalog-derived lesson-linked virtual inventory. */
export type FlashcardLessonVirtualDiagnostics = {
  pathwayId: string;
  catalogLessonCount: number;
  lessonsWithDerivedCards: number;
  totalGeneratedVirtualCards: number;
  recallVirtualCount: number;
  sectionDerivedVirtualCount: number;
  genericFillerSectionCardHits: number;
  selectedCategoryIds: string[];
  filterModeLabel: string;
};

export type FlashcardCustomSessionSummary = {
  pathwayId: string | null;
  topicCode?: string | null;
  lessonId?: string | null;
  selectedCategories: string[];
  matchingCards: number;
  returnedCards: number;
  mode: string;
  shuffle: boolean;
  weakOnly: boolean;
  incorrectOnly: boolean;
  starredOnly: boolean;
  savedOnly?: boolean;
  notesOnly?: boolean;
  revisitOnly: boolean;
  notStudiedOnly: boolean;
  recentStudiedOnly?: boolean;
  recentDays?: number;
  sourceKind?: string;
  cardLimit: string;
  /** When the API widened access filters to return cards (debug / transparency). */
  queryRelaxation?: FlashcardCustomSessionQueryRelaxation;
  /** Opaque per-response salt used for MCQ option shuffle (and echoed for client debugging). */
  sessionShuffleSalt?: string;
  /** Zero-based window start for progressive session loading. */
  offset?: number;
  /** True when another card window can be fetched with the same session seed. */
  hasMore?: boolean;
  lessonVirtualDiagnostics?: FlashcardLessonVirtualDiagnostics | null;
  /** From `/api/flashcards/inventory` — exam bank vs Flashcard table transparency. */
  poolInventoryDiagnostics?: FlashcardsPoolInventoryDiagnostics | null;
};

export type ParsedCustomSessionSuccess = {
  ok: true;
  summary: FlashcardCustomSessionSummary | null;
  categoryOptions: BuilderCategoryOption[];
};

export type ParsedCustomSessionFailure = {
  ok: false;
  message: string;
};

export type FlashcardBodySystemsUiOutcome = "populated" | "empty" | "error";

/** Maps a parsed API payload to the hub body-systems strip outcome (never `pending`). */
export function flashcardBodySystemsUiOutcomeFromParsed(
  parsed: ParsedCustomSessionSuccess | ParsedCustomSessionFailure,
): FlashcardBodySystemsUiOutcome {
  if (!parsed.ok) return "error";
  return parsed.categoryOptions.length > 0 ? "populated" : "empty";
}

function parsePoolInventoryDiagnostics(raw: unknown): FlashcardsPoolInventoryDiagnostics | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const pathwayId = typeof d.pathwayId === "string" ? d.pathwayId.trim() : "";
  if (!pathwayId) return null;
  const examN = d.examQuestionSqlPoolCount;
  const examQuestionSqlPoolCount =
    typeof examN === "number" && Number.isFinite(examN) ? Math.max(0, Math.floor(examN)) : 0;
  const leg = d.legacyCanonicalPrismaPoolCount;
  const legacyCanonicalPrismaPoolCount =
    leg === null || leg === undefined
      ? null
      : typeof leg === "number" && Number.isFinite(leg)
        ? Math.max(0, Math.floor(leg))
        : null;
  const ded = d.dedicatedFlashcardRowCount;
  const dedicatedFlashcardRowCount =
    typeof ded === "number" && Number.isFinite(ded) ? Math.max(0, Math.floor(ded)) : 0;
  const poolSource = d.poolSource === "flashcard_learner_exam_norm_sql_v1" ? d.poolSource : "flashcard_learner_exam_norm_sql_v1";
  const zeroHint = typeof d.zeroHint === "string" ? d.zeroHint : undefined;
  return {
    pathwayId,
    examQuestionSqlPoolCount,
    legacyCanonicalPrismaPoolCount,
    dedicatedFlashcardRowCount,
    tier: typeof d.tier === "string" ? d.tier : null,
    country: typeof d.country === "string" ? d.country : null,
    poolSource,
    ...(zeroHint ? { zeroHint } : {}),
  };
}

function parseLessonVirtualDiagnostics(
  raw: unknown,
): FlashcardLessonVirtualDiagnostics | null | undefined {
  if (raw === undefined) return undefined;
  if (raw === null) return null;
  if (typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const pathwayId = typeof d.pathwayId === "string" ? d.pathwayId.trim() : "";
  if (!pathwayId) return null;
  return {
    pathwayId,
    catalogLessonCount:
      typeof d.catalogLessonCount === "number" && Number.isFinite(d.catalogLessonCount) ? d.catalogLessonCount : 0,
    lessonsWithDerivedCards:
      typeof d.lessonsWithDerivedCards === "number" && Number.isFinite(d.lessonsWithDerivedCards)
        ? d.lessonsWithDerivedCards
        : 0,
    totalGeneratedVirtualCards:
      typeof d.totalGeneratedVirtualCards === "number" && Number.isFinite(d.totalGeneratedVirtualCards)
        ? d.totalGeneratedVirtualCards
        : 0,
    recallVirtualCount:
      typeof d.recallVirtualCount === "number" && Number.isFinite(d.recallVirtualCount) ? d.recallVirtualCount : 0,
    sectionDerivedVirtualCount:
      typeof d.sectionDerivedVirtualCount === "number" && Number.isFinite(d.sectionDerivedVirtualCount)
        ? d.sectionDerivedVirtualCount
        : 0,
    genericFillerSectionCardHits:
      typeof d.genericFillerSectionCardHits === "number" && Number.isFinite(d.genericFillerSectionCardHits)
        ? d.genericFillerSectionCardHits
        : 0,
    selectedCategoryIds: Array.isArray(d.selectedCategoryIds)
      ? d.selectedCategoryIds.filter((x): x is string => typeof x === "string")
      : [],
    filterModeLabel: typeof d.filterModeLabel === "string" ? d.filterModeLabel : "",
  };
}

/**
 * Validates GET /api/flashcards/custom-session JSON so the hub never treats
 * malformed payloads as an infinite load or a false "all topics" empty.
 */
export function parseFlashcardCustomSessionResponse(
  resOk: boolean,
  json: unknown,
): ParsedCustomSessionSuccess | ParsedCustomSessionFailure {
  if (!resOk) {
    const msg =
      json && typeof json === "object" && "error" in json && typeof (json as { error?: unknown }).error === "string"
        ? (json as { error: string }).error
        : "Request failed";
    return { ok: false, message: msg };
  }

  if (json == null || typeof json !== "object") {
    return { ok: false, message: "Invalid response" };
  }

  const o = json as Record<string, unknown>;

  if ("categoryOptions" in o && o.categoryOptions != null && !Array.isArray(o.categoryOptions)) {
    return { ok: false, message: "Invalid response shape" };
  }
  if ("categoryOptions" in o && o.categoryOptions === null) {
    return { ok: false, message: "Invalid response shape" };
  }

  const rawOptions = Array.isArray(o.categoryOptions) ? o.categoryOptions : [];

  const categoryOptions: BuilderCategoryOption[] = [];
  for (const row of rawOptions) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id.trim() : "";
    const title = typeof r.title === "string" ? r.title : "";
    const rawCount = r.count;
    const parsedCount =
      typeof rawCount === "number" && Number.isFinite(rawCount)
        ? rawCount
        : typeof rawCount === "string" && rawCount.trim()
          ? Number(rawCount)
          : NaN;
    const count = Number.isFinite(parsedCount) ? Math.max(0, Math.floor(parsedCount)) : 0;
    if (!id) continue;
    categoryOptions.push({
      id,
      title,
      description: typeof r.description === "string" ? r.description : undefined,
      count,
    });
  }

  let summary: FlashcardCustomSessionSummary | null = null;
  if (o.summary != null && typeof o.summary === "object") {
    const s = o.summary as Record<string, unknown>;
    summary = {
      pathwayId: typeof s.pathwayId === "string" ? s.pathwayId : null,
      topicCode: typeof s.topicCode === "string" ? s.topicCode : null,
      lessonId: typeof s.lessonId === "string" ? s.lessonId : null,
      selectedCategories: Array.isArray(s.selectedCategories)
        ? s.selectedCategories.filter((x): x is string => typeof x === "string")
        : [],
      matchingCards: typeof s.matchingCards === "number" && Number.isFinite(s.matchingCards) ? s.matchingCards : 0,
      returnedCards: typeof s.returnedCards === "number" && Number.isFinite(s.returnedCards) ? s.returnedCards : 0,
      mode: typeof s.mode === "string" ? s.mode : "mixed",
      shuffle: s.shuffle === true,
      weakOnly: s.weakOnly === true,
      incorrectOnly: s.incorrectOnly === true,
      starredOnly: s.starredOnly === true,
      savedOnly: s.savedOnly === true,
      notesOnly: s.notesOnly === true,
      revisitOnly: s.revisitOnly === true,
      notStudiedOnly: s.notStudiedOnly === true,
      recentStudiedOnly: s.recentStudiedOnly === true,
      recentDays: typeof s.recentDays === "number" ? s.recentDays : undefined,
      sourceKind: typeof s.sourceKind === "string" ? s.sourceKind : undefined,
      cardLimit: typeof s.cardLimit === "string" ? s.cardLimit : "20",
      queryRelaxation:
        s.queryRelaxation === "dropped_pathway_scope" ||
        s.queryRelaxation === "dropped_country_match" ||
        s.queryRelaxation === "none"
          ? s.queryRelaxation
          : undefined,
      sessionShuffleSalt: typeof s.sessionShuffleSalt === "string" ? s.sessionShuffleSalt : undefined,
      offset: typeof s.offset === "number" && Number.isFinite(s.offset) ? Math.max(0, Math.floor(s.offset)) : undefined,
      hasMore: s.hasMore === true,
      lessonVirtualDiagnostics: parseLessonVirtualDiagnostics(s.lessonVirtualDiagnostics),
      poolInventoryDiagnostics: parsePoolInventoryDiagnostics(s.poolInventoryDiagnostics),
    };
  }

  return { ok: true, summary, categoryOptions };
}

/**
 * Validates GET /api/flashcards/inventory JSON (pathway-scoped pool counts).
 * Shapes a minimal {@link FlashcardCustomSessionSummary} so the hub can reuse the same state wiring.
 */
export function parseFlashcardInventoryResponse(
  resOk: boolean,
  json: unknown,
): ParsedCustomSessionSuccess | ParsedCustomSessionFailure {
  if (!resOk) {
    const msg =
      json && typeof json === "object"
        ? typeof (json as { message?: unknown }).message === "string"
          ? ((json as { message: string }).message as string)
          : typeof (json as { error?: unknown }).error === "string"
            ? ((json as { error: string }).error as string)
            : typeof (json as { code?: unknown }).code === "string"
              ? ((json as { code: string }).code as string)
              : "Request failed"
        : "Request failed";
    return { ok: false, message: msg };
  }

  if (json == null || typeof json !== "object") {
    return { ok: false, message: "Invalid response" };
  }

  const o = json as Record<string, unknown>;
  if (o.success !== true) {
    const msg =
      typeof o.message === "string"
        ? o.message
        : typeof o.error === "string"
          ? o.error
          : "Inventory failed";
    return { ok: false, message: msg };
  }

  if ("categoryOptions" in o && o.categoryOptions != null && !Array.isArray(o.categoryOptions)) {
    return { ok: false, message: "Invalid response shape" };
  }

  const rawTotalField = o.total;
  if (typeof rawTotalField !== "number" || !Number.isFinite(rawTotalField)) {
    // Do not infer "0 cards" from `{ success: true }` with missing/invalid `total` (ambiguous vs load failure).
    return { ok: false, message: "Invalid inventory response" };
  }

  const rawOptions = Array.isArray(o.categoryOptions) ? o.categoryOptions : [];
  const categoryOptions: BuilderCategoryOption[] = [];
  for (const row of rawOptions) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id.trim() : "";
    const title = typeof r.title === "string" ? r.title : "";
    const rawCount = r.count;
    const parsedCount =
      typeof rawCount === "number" && Number.isFinite(rawCount)
        ? rawCount
        : typeof rawCount === "string" && rawCount.trim()
          ? Number(rawCount)
          : NaN;
    const count = Number.isFinite(parsedCount) ? Math.max(0, Math.floor(parsedCount)) : 0;
    if (!id) continue;
    categoryOptions.push({
      id,
      title,
      description: typeof r.description === "string" ? r.description : undefined,
      count,
    });
  }

  const total = Math.max(0, Math.floor(rawTotalField));

  const poolInventoryDiagnostics = parsePoolInventoryDiagnostics(o.diagnostics);

  const summary: FlashcardCustomSessionSummary = {
    pathwayId: null,
    topicCode: null,
    lessonId: null,
    selectedCategories: [],
    matchingCards: total,
    returnedCards: 0,
    mode: "mixed",
    shuffle: false,
    weakOnly: false,
    incorrectOnly: false,
    starredOnly: false,
    savedOnly: false,
    notesOnly: false,
    revisitOnly: false,
    notStudiedOnly: false,
    cardLimit: "20",
    lessonVirtualDiagnostics: undefined,
    poolInventoryDiagnostics,
  };

  return { ok: true, summary, categoryOptions };
}
