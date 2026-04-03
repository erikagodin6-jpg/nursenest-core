import "server-only";

import { existsSync, readFileSync } from "fs";
import path from "path";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type {
  PathwayLessonExamFocus,
  PathwayLessonLocaleMeta,
  PathwayLessonQuizItem,
  PathwayLessonRecord,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";
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
  /** Optional extra teaching line (overlay-only; not stored on `Flashcard` rows). */
  cards?: Record<string, { front?: string; back?: string; explanation?: string }>;
};

const questionBundleCache = new Map<string, Record<string, QuestionEducationalOverlay> | null>();
const flashcardBundleCache = new Map<string, FlashcardEducationalBundle | null>();
const lessonBundleCache = new Map<string, Record<string, unknown> | null>();

/** File shape: `lessons.json` keyed by `slug` or `pathwayId:slug`. */
export type PathwayLessonEducationalOverlay = {
  title?: string;
  topic?: string;
  seoTitle?: string;
  seoDescription?: string;
  /** Merge by section `id`. */
  sections?: Record<
    string,
    Partial<Pick<PathwayLessonSection, "heading" | "body">> & {
      examFocus?: Partial<PathwayLessonExamFocus>;
    }
  >;
  /** Parallel to lesson `preTest` / `postTest` arrays — do not include `correct` (grading index stays canonical). */
  preTest?: Array<Partial<Pick<PathwayLessonQuizItem, "question" | "options" | "rationale">>>;
  postTest?: Array<Partial<Pick<PathwayLessonQuizItem, "question" | "options" | "rationale">>>;
};

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

/** Cached map: lesson key (`slug` or `pathwayId:slug`) → overlay payload for a locale. */
export function loadLessonEducationalBundle(locale: string): Record<string, PathwayLessonEducationalOverlay> {
  if (locale === DEFAULT_MARKETING_LOCALE) return {};
  const hit = lessonBundleCache.get(locale);
  if (hit !== undefined) return (hit ?? {}) as Record<string, PathwayLessonEducationalOverlay>;
  const base = resolveEducationalI18nRoot();
  const fp = path.join(base, locale, "lessons.json");
  const data = readJsonFile<Record<string, PathwayLessonEducationalOverlay>>(fp);
  const normalized = data && typeof data === "object" ? data : null;
  lessonBundleCache.set(locale, normalized as unknown as Record<string, unknown> | null);
  return (normalized ?? {}) as Record<string, PathwayLessonEducationalOverlay>;
}

function mergeExamFocus(
  base: PathwayLessonExamFocus | undefined,
  patch: Partial<PathwayLessonExamFocus> | undefined,
): PathwayLessonExamFocus | undefined {
  if (!patch || Object.keys(patch).length === 0) return base;
  return { ...(base ?? {}), ...patch };
}

type PathwayLessonSectionOverlayPatch = Partial<Pick<PathwayLessonSection, "heading" | "body">> & {
  examFocus?: Partial<PathwayLessonExamFocus>;
};

function mergeLessonSection(base: PathwayLessonSection, patch: PathwayLessonSectionOverlayPatch): PathwayLessonSection {
  const heading = patch.heading !== undefined && patch.heading.trim() ? patch.heading : base.heading;
  const body = patch.body !== undefined && patch.body.trim() ? patch.body : base.body;
  const examFocus = mergeExamFocus(base.examFocus, patch.examFocus);
  return {
    ...base,
    heading,
    body,
    ...(examFocus !== undefined ? { examFocus } : {}),
  };
}

function mergeQuizList(
  base: PathwayLessonQuizItem[] | undefined,
  patch: PathwayLessonEducationalOverlay["preTest"],
  label: string,
  locale: string,
  slug: string,
): PathwayLessonQuizItem[] | undefined {
  if (!base?.length || !patch?.length) return base;
  const out = base.map((item, i) => {
    const p = patch[i];
    if (!p) return item;
    const question = p.question?.trim() ? p.question : item.question;
    let options = item.options;
    if (Array.isArray(p.options) && p.options.length === item.options.length) {
      options = p.options.map((x) => String(x));
    } else if (p.options !== undefined && p.options.length !== item.options.length) {
      safeServerLog("i18n", "educational_lesson_overlay_quiz_options_length_mismatch", {
        locale,
        slug,
        label,
        index: i,
        baseLen: item.options.length,
        patchLen: p.options.length,
      });
    }
    const rationale = p.rationale?.trim() ? p.rationale : item.rationale;
    return { ...item, question, options, correct: item.correct, ...(rationale ? { rationale } : {}) };
  });
  return out;
}

/**
 * Merge file-based lesson overlays for display. Does not change slug, pathway, or quiz `correct` indices.
 * Keys: `slug` or `pathwayId:slug` when `pathwayId` is provided (disambiguates duplicate slugs).
 */
export function applyPathwayLessonEducationalOverlay(
  lesson: PathwayLessonRecord,
  locale: string,
  pathwayId?: string,
): PathwayLessonRecord {
  if (locale === DEFAULT_MARKETING_LOCALE) return lesson;

  const bundle = loadLessonEducationalBundle(locale);
  const compoundKey = pathwayId ? `${pathwayId}:${lesson.slug}` : null;
  const o = (compoundKey ? bundle[compoundKey] : undefined) ?? bundle[lesson.slug];
  if (!o || typeof o !== "object") {
    return lesson;
  }

  let applied = false;

  const title = o.title !== undefined && o.title.trim() ? o.title : lesson.title;
  if (title !== lesson.title) applied = true;
  const topic = o.topic !== undefined && o.topic.trim() ? o.topic : lesson.topic;
  if (topic !== lesson.topic) applied = true;
  const seoTitle = o.seoTitle !== undefined && o.seoTitle.trim() ? o.seoTitle : lesson.seoTitle;
  if (seoTitle !== lesson.seoTitle) applied = true;
  const seoDescription =
    o.seoDescription !== undefined && o.seoDescription.trim() ? o.seoDescription : lesson.seoDescription;
  if (seoDescription !== lesson.seoDescription) applied = true;

  let sections = lesson.sections;
  if (o.sections && lesson.sections.length > 0) {
    const byId = o.sections;
    const next = lesson.sections.map((s) => {
      const patch = byId[s.id];
      if (!patch) return s;
      applied = true;
      return mergeLessonSection(s, patch);
    });
    sections = next;
  }

  let preTest = lesson.preTest;
  let postTest = lesson.postTest;
  if (o.preTest?.length) {
    const merged = mergeQuizList(lesson.preTest, o.preTest, "preTest", locale, lesson.slug);
    if (merged !== lesson.preTest) {
      preTest = merged;
      applied = true;
    }
  }
  if (o.postTest?.length) {
    const merged = mergeQuizList(lesson.postTest, o.postTest, "postTest", locale, lesson.slug);
    if (merged !== lesson.postTest) {
      postTest = merged;
      applied = true;
    }
  }

  if (!applied) return lesson;

  const baseMeta: PathwayLessonLocaleMeta = lesson.localeMeta ?? {
    requestedContentLocale: locale,
    contentLocale: locale,
    usedLocaleFallback: false,
    isCatalogEnglishSource: false,
  };

  return {
    ...lesson,
    title,
    topic,
    seoTitle,
    seoDescription,
    sections,
    ...(preTest ? { preTest } : {}),
    ...(postTest ? { postTest } : {}),
    localeMeta: { ...baseMeta, educationalOverlayApplied: true },
  };
}

export function clearEducationalOverlayCachesForTests(): void {
  questionBundleCache.clear();
  flashcardBundleCache.clear();
  lessonBundleCache.clear();
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
    if (locale !== DEFAULT_MARKETING_LOCALE && process.env.NODE_ENV !== "production") {
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
  out.rationale = m.rationale;
  out.correctAnswerExplanation = m.correctAnswerExplanation;
  out.clinicalReasoning = m.clinicalReasoning;
  out.keyTakeaway = m.keyTakeaway;
  out.clinicalPearl = m.clinicalPearl;
  out.examStrategy = m.examStrategy;
  out.memoryHook = m.memoryHook;
  out.clinicalTrap = m.clinicalTrap;
  out.distractorRationales = m.distractorRationales;
  out.incorrectAnswerRationale = m.incorrectAnswerRationale;
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
    if (process.env.NODE_ENV !== "production") {
      safeServerLog("i18n", "educational_flashcard_deck_overlay_miss", {
        locale,
        deckIdPrefix: deck.id.slice(0, 8),
        slug: deck.slug,
      });
    }
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
): { front: string; back: string; explanation?: string } {
  if (locale === DEFAULT_MARKETING_LOCALE) return { front: card.front, back: card.back };
  const b = loadFlashcardEducationalBundle(locale);
  const c = b.cards?.[card.id];
  if (!c) {
    if (process.env.NODE_ENV !== "production") {
      safeServerLog("i18n", "educational_flashcard_card_overlay_miss", {
        locale,
        cardIdPrefix: card.id.slice(0, 8),
      });
    }
    return { front: card.front, back: card.back };
  }
  const explanation = c.explanation?.trim() ? c.explanation.trim() : undefined;
  return {
    front: c.front?.trim() ? c.front! : card.front,
    back: c.back?.trim() ? c.back! : card.back,
    ...(explanation ? { explanation } : {}),
  };
}
