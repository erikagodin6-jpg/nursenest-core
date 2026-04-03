import "server-only";

import { existsSync, readFileSync } from "fs";
import path from "path";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Per-question overlay keyed by `ExamQuestion.id` (stable). */
export type QuestionEducationalOverlay = {
  stem?: string;
  /** Parallel to DB `options` order — display labels only; grading uses canonical DB strings. */
  options?: string[];
  rationale?: string;
  correctAnswerExplanation?: string;
  clinicalReasoning?: string;
  keyTakeaway?: string;
  clinicalPearl?: string;
  examStrategy?: string;
  memoryHook?: string;
  clinicalTrap?: string;
  distractorRationales?: unknown;
  incorrectAnswerRationale?: unknown;
};

export type FlashcardEducationalBundle = {
  decks?: Record<string, { title?: string; description?: string | null }>;
  cards?: Record<string, { front?: string; back?: string }>;
};

const questionBundleCache = new Map<string, Record<string, QuestionEducationalOverlay> | null>();
const flashcardBundleCache = new Map<string, FlashcardEducationalBundle | null>();

function resolveEducationalI18nRoot(): string {
  const root = process.cwd();
  const candidates = [
    path.join(root, "public", "i18n", "educational-overlays"),
    path.join(root, "nursenest-core", "public", "i18n", "educational-overlays"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return path.join(root, "public", "i18n", "educational-overlays");
}

function readJsonFile<T>(fp: string): T | null {
  if (!existsSync(fp)) return null;
  try {
    return JSON.parse(readFileSync(fp, "utf8")) as T;
  } catch (e) {
    safeServerLog("i18n", "educational_overlay_parse_failed", {
      path: fp,
      detail: e instanceof Error ? e.message : String(e),
    });
    return null;
  }
}

/** Cached map: questionId → partial overlay for a locale. English has no overlay file. */
export function loadQuestionEducationalOverlayBundle(locale: string): Record<string, QuestionEducationalOverlay> {
  if (locale === DEFAULT_MARKETING_LOCALE) return {};
  const hit = questionBundleCache.get(locale);
  if (hit !== undefined) return hit ?? {};
  const base = resolveEducationalI18nRoot();
  const fp = path.join(base, locale, "questions.json");
  const data = readJsonFile<Record<string, QuestionEducationalOverlay>>(fp);
  const normalized = data && typeof data === "object" ? data : null;
  questionBundleCache.set(locale, normalized);
  return normalized ?? {};
}

export function loadFlashcardEducationalBundle(locale: string): FlashcardEducationalBundle {
  if (locale === DEFAULT_MARKETING_LOCALE) return {};
  const hit = flashcardBundleCache.get(locale);
  if (hit !== undefined) return hit ?? {};
  const base = resolveEducationalI18nRoot();
  const fp = path.join(base, locale, "flashcards.json");
  const data = readJsonFile<FlashcardEducationalBundle>(fp);
  const normalized = data && typeof data === "object" ? data : null;
  flashcardBundleCache.set(locale, normalized);
  return normalized ?? {};
}

export function clearEducationalOverlayCachesForTests(): void {
  questionBundleCache.clear();
  flashcardBundleCache.clear();
}

export function normalizeExamQuestionOptionsArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => {
    if (typeof x === "string") return x;
    if (x && typeof x === "object" && "label" in x) return String((x as { label?: string }).label ?? "");
    return String(x);
  });
}

function mergeStringField(base: string | null | undefined, overlay: string | undefined): string | null | undefined {
  if (overlay === undefined) return base;
  const t = overlay.trim();
  return t.length ? overlay : base;
}

export type QuestionDisplayLocalization = {
  /** Fields safe for display; `options` remains canonical from DB for grading. */
  stem: string;
  options: unknown;
  /** When present (same length as canonical options), use for UI labels only. */
  displayOptions?: string[];
  rationale?: string | null;
  correctAnswerExplanation?: string | null;
  clinicalReasoning?: string | null;
  keyTakeaway?: string | null;
  clinicalPearl?: string | null;
  examStrategy?: string | null;
  memoryHook?: string | null;
  clinicalTrap?: string | null;
  distractorRationales?: unknown;
  incorrectAnswerRationale?: unknown;
  /** True when any overlay field was applied for non-English locale. */
  overlayApplied: boolean;
};

type QuestionRowForDisplay = {
  id: string;
  stem: string;
  options?: unknown;
  rationale?: string | null;
  correctAnswerExplanation?: string | null;
  clinicalReasoning?: string | null;
  keyTakeaway?: string | null;
  clinicalPearl?: string | null;
  examStrategy?: string | null;
  memoryHook?: string | null;
  clinicalTrap?: string | null;
  distractorRationales?: unknown;
  incorrectAnswerRationale?: unknown;
};

/**
 * Merge JSON overlays for display. Never mutates `correctAnswer` / grading keys.
 * `options` in the returned object stays the DB value; `displayOptions` holds translated labels when valid.
 */
export function applyQuestionEducationalOverlayForDisplay(
  row: QuestionRowForDisplay,
  locale: string,
): QuestionDisplayLocalization {
  if (locale === DEFAULT_MARKETING_LOCALE) {
    return {
      stem: row.stem,
      options: row.options,
      rationale: row.rationale ?? null,
      correctAnswerExplanation: row.correctAnswerExplanation ?? null,
      clinicalReasoning: row.clinicalReasoning ?? null,
      keyTakeaway: row.keyTakeaway ?? null,
      clinicalPearl: row.clinicalPearl ?? null,
      examStrategy: row.examStrategy ?? null,
      memoryHook: row.memoryHook ?? null,
      clinicalTrap: row.clinicalTrap ?? null,
      distractorRationales: row.distractorRationales,
      incorrectAnswerRationale: row.incorrectAnswerRationale,
      overlayApplied: false,
    };
  }

  const bundle = loadQuestionEducationalOverlayBundle(locale);
  const o = bundle[row.id];
  if (!o) {
    if (locale !== DEFAULT_MARKETING_LOCALE) {
      safeServerLog("i18n", "educational_question_overlay_miss", {
        locale,
        questionIdPrefix: row.id.slice(0, 8),
      });
    }
    return {
      stem: row.stem,
      options: row.options,
      rationale: row.rationale ?? null,
      correctAnswerExplanation: row.correctAnswerExplanation ?? null,
      clinicalReasoning: row.clinicalReasoning ?? null,
      keyTakeaway: row.keyTakeaway ?? null,
      clinicalPearl: row.clinicalPearl ?? null,
      examStrategy: row.examStrategy ?? null,
      memoryHook: row.memoryHook ?? null,
      clinicalTrap: row.clinicalTrap ?? null,
      distractorRationales: row.distractorRationales,
      incorrectAnswerRationale: row.incorrectAnswerRationale,
      overlayApplied: false,
    };
  }

  const canonical = normalizeExamQuestionOptionsArray(row.options);
  let displayOptions: string[] | undefined;
  if (Array.isArray(o.options) && o.options.length === canonical.length) {
    displayOptions = o.options.map((x) => String(x));
  } else if (o.options !== undefined && o.options.length !== canonical.length) {
    safeServerLog("i18n", "educational_question_overlay_options_length_mismatch", {
      locale,
      questionIdPrefix: row.id.slice(0, 8),
      canonicalLen: canonical.length,
      overlayLen: Array.isArray(o.options) ? o.options.length : -1,
    });
  }

  const overlayApplied = Boolean(
    displayOptions ||
      Object.keys(o).length > 0 ||
      mergeStringField(row.rationale, o.rationale) !== row.rationale,
  );

  return {
    stem: o.stem?.trim() ? o.stem : row.stem,
    options: row.options,
    ...(displayOptions ? { displayOptions } : {}),
    rationale: mergeStringField(row.rationale, o.rationale) ?? null,
    correctAnswerExplanation: mergeStringField(row.correctAnswerExplanation, o.correctAnswerExplanation) ?? null,
    clinicalReasoning: mergeStringField(row.clinicalReasoning, o.clinicalReasoning) ?? null,
    keyTakeaway: mergeStringField(row.keyTakeaway, o.keyTakeaway) ?? null,
    clinicalPearl: mergeStringField(row.clinicalPearl, o.clinicalPearl) ?? null,
    examStrategy: mergeStringField(row.examStrategy, o.examStrategy) ?? null,
    memoryHook: mergeStringField(row.memoryHook, o.memoryHook) ?? null,
    clinicalTrap: mergeStringField(row.clinicalTrap, o.clinicalTrap) ?? null,
    distractorRationales: o.distractorRationales !== undefined ? o.distractorRationales : row.distractorRationales,
    incorrectAnswerRationale:
      o.incorrectAnswerRationale !== undefined ? o.incorrectAnswerRationale : row.incorrectAnswerRationale,
    overlayApplied,
  };
}

/** Merge localized display fields onto an API question object (list/detail). Preserves extra keys (topic, exam, …). */
export function mergeQuestionApiPayload(q: Record<string, unknown>, locale: string): Record<string, unknown> {
  const m = applyQuestionEducationalOverlayForDisplay(q as QuestionRowForDisplay, locale);
  const out: Record<string, unknown> = { ...q, stem: m.stem, options: m.options };
  if (m.displayOptions) out.displayOptions = m.displayOptions;
  if ("rationale" in q) out.rationale = m.rationale;
  if ("correctAnswerExplanation" in q) out.correctAnswerExplanation = m.correctAnswerExplanation;
  if ("clinicalReasoning" in q) out.clinicalReasoning = m.clinicalReasoning;
  if ("keyTakeaway" in q) out.keyTakeaway = m.keyTakeaway;
  if ("clinicalPearl" in q) out.clinicalPearl = m.clinicalPearl;
  if ("examStrategy" in q) out.examStrategy = m.examStrategy;
  if ("memoryHook" in q) out.memoryHook = m.memoryHook;
  if ("clinicalTrap" in q) out.clinicalTrap = m.clinicalTrap;
  if ("distractorRationales" in q) out.distractorRationales = m.distractorRationales;
  if ("incorrectAnswerRationale" in q) out.incorrectAnswerRationale = m.incorrectAnswerRationale;
  return out;
}

/** Preview mode truncates stem after overlay merge (same 280-char cap as legacy). */
export function localizeQuestionListForApi(
  items: Array<Record<string, unknown>>,
  mode: "preview" | "full",
  locale: string,
): Array<Record<string, unknown>> {
  if (mode === "preview") {
    return items.map((q) => {
      const merged = mergeQuestionApiPayload(q, locale);
      const stem = String(merged.stem ?? "");
      return {
        ...merged,
        stem: stem.length > 280 ? `${stem.slice(0, 280).trim()}…` : stem,
      };
    });
  }
  return items.map((q) => mergeQuestionApiPayload(q, locale));
}

/** Row shape for grade-response teaching/rationale builders — overlay merged for subscriber-facing text only. */
export type ExamQuestionGradeDisplayRow = {
  stem: string;
  rationale?: string | null;
  correctAnswerExplanation?: string | null;
  clinicalReasoning?: string | null;
  keyTakeaway?: string | null;
  clinicalPearl?: string | null;
  examStrategy?: string | null;
  memoryHook?: string | null;
  clinicalTrap?: string | null;
  distractorRationales?: unknown;
  incorrectAnswerRationale?: unknown;
};

export function mergeQuestionOverlayForGradeResponse<T extends ExamQuestionGradeDisplayRow>(
  row: T,
  questionId: string,
  locale: string,
): T {
  if (locale === DEFAULT_MARKETING_LOCALE) return row;
  const bundle = loadQuestionEducationalOverlayBundle(locale);
  const o = bundle[questionId];
  if (!o) return row;
  return {
    ...row,
    stem: o.stem?.trim() ? o.stem : row.stem,
    rationale: mergeStringField(row.rationale, o.rationale) ?? row.rationale,
    correctAnswerExplanation: mergeStringField(row.correctAnswerExplanation, o.correctAnswerExplanation) ?? row.correctAnswerExplanation,
    clinicalReasoning: mergeStringField(row.clinicalReasoning, o.clinicalReasoning) ?? row.clinicalReasoning,
    keyTakeaway: mergeStringField(row.keyTakeaway, o.keyTakeaway) ?? row.keyTakeaway,
    clinicalPearl: mergeStringField(row.clinicalPearl, o.clinicalPearl) ?? row.clinicalPearl,
    examStrategy: mergeStringField(row.examStrategy, o.examStrategy) ?? row.examStrategy,
    memoryHook: mergeStringField(row.memoryHook, o.memoryHook) ?? row.memoryHook,
    clinicalTrap: mergeStringField(row.clinicalTrap, o.clinicalTrap) ?? row.clinicalTrap,
    distractorRationales: o.distractorRationales !== undefined ? o.distractorRationales : row.distractorRationales,
    incorrectAnswerRationale:
      o.incorrectAnswerRationale !== undefined ? o.incorrectAnswerRationale : row.incorrectAnswerRationale,
  };
}

export function applyFlashcardDeckOverlay(
  deck: { id: string; slug: string; title: string; description: string | null },
  locale: string,
): { title: string; description: string | null } {
  if (locale === DEFAULT_MARKETING_LOCALE) return { title: deck.title, description: deck.description };
  const b = loadFlashcardEducationalBundle(locale);
  const decks = b.decks ?? {};
  const d = decks[deck.id] ?? decks[deck.slug];
  if (!d) {
    safeServerLog("i18n", "educational_flashcard_deck_overlay_miss", {
      locale,
      deckIdPrefix: deck.id.slice(0, 8),
      slug: deck.slug,
    });
    return { title: deck.title, description: deck.description };
  }
  return {
    title: d.title?.trim() ? d.title! : deck.title,
    description: d.description !== undefined ? d.description : deck.description,
  };
}

export function applyFlashcardCardOverlay(
  card: { id: string; front: string; back: string },
  locale: string,
): { front: string; back: string } {
  if (locale === DEFAULT_MARKETING_LOCALE) return { front: card.front, back: card.back };
  const b = loadFlashcardEducationalBundle(locale);
  const c = b.cards?.[card.id];
  if (!c) {
    safeServerLog("i18n", "educational_flashcard_card_overlay_miss", {
      locale,
      cardIdPrefix: card.id.slice(0, 8),
    });
    return { front: card.front, back: card.back };
  }
  return {
    front: c.front?.trim() ? c.front! : card.front,
    back: c.back?.trim() ? c.back! : card.back,
  };
}
