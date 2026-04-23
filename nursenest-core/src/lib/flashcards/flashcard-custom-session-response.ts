import type { BuilderCategoryOption } from "@/lib/flashcards/flashcard-builder-taxonomy";

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
    const count = typeof r.count === "number" && Number.isFinite(r.count) ? Math.max(0, r.count) : 0;
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
    };
  }

  return { ok: true, summary, categoryOptions };
}
