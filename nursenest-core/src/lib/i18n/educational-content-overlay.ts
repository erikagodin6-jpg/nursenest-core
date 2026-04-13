import "server-only";

import { existsSync, readdirSync, readFileSync } from "fs";
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
import { evaluateEducationalTranslation } from "@/lib/i18n/educational-translation-quality";

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
  /** `FlashcardTag.id` → display label overlay (DB or file). */
  tags?: Record<string, { label?: string }>;
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
  const cwd = /* turbopackIgnore: true */ process.cwd();
  const primary = path.join(cwd, "public", "i18n", "educational-overlays");
  const nestedMonorepo = path.join(cwd, "nursenest-core", "public", "i18n", "educational-overlays");
  if (existsSync(primary)) return primary;
  if (existsSync(nestedMonorepo)) return nestedMonorepo;
  return primary;
}

function readJsonFile<T>(fp: string): T | null {
  if (!existsSync(fp)) return null;
  try {
    return JSON.parse(readFileSync(/* turbopackIgnore: true */ fp, "utf8")) as T;
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
  const baseRoot = resolveEducationalI18nRoot();
  const fp = path.join(baseRoot, locale, "lessons.json");
  const data = readJsonFile<Record<string, PathwayLessonEducationalOverlay>>(fp);
  const normalized = data && typeof data === "object" ? data : {};
  const merged = mergeLessonOverlaysFromFragments(baseRoot, locale, normalized);
  lessonBundleCache.set(locale, merged as unknown as Record<string, unknown> | null);
  return merged;
}

function mergeExamFocus(
  base: PathwayLessonExamFocus | undefined,
  patch: Partial<PathwayLessonExamFocus> | undefined,
): PathwayLessonExamFocus | undefined {
  if (!patch || Object.keys(patch).length === 0) return base;
  return { ...(base ?? {}), ...patch };
}

type PickLocalizedResult = { value: string; fellBack: boolean };

/** Prefer localized overlay; fall back to English when quality heuristics fail (logged). */
function pickLocalizedOverlayString(
  englishBase: string,
  overlay: string | undefined,
  locale: string,
  logCtx: Record<string, unknown>,
): PickLocalizedResult {
  if (locale === DEFAULT_MARKETING_LOCALE) {
    return {
      value: overlay !== undefined && overlay.trim() ? overlay : englishBase,
      fellBack: false,
    };
  }
  if (overlay === undefined) return { value: englishBase, fellBack: false };
  const t = overlay.trim();
  if (!t.length) return { value: englishBase, fellBack: false };
  const q = evaluateEducationalTranslation(englishBase, t, locale);
  if (!q.acceptTranslation) {
    safeServerLog("i18n", "educational_translation_quality_fallback", {
      locale,
      reasons: q.reasons.slice(0, 8).join(", "),
      ...logCtx,
    });
    return { value: englishBase, fellBack: true };
  }
  return { value: overlay, fellBack: false };
}

function mergeExamFocusLocalized(
  base: PathwayLessonExamFocus | undefined,
  patch: Partial<PathwayLessonExamFocus> | undefined,
  locale: string,
  lessonSlug: string,
  sectionId: string,
): { focus: PathwayLessonExamFocus | undefined; fellBack: boolean } {
  const merged = mergeExamFocus(base, patch);
  if (!patch || locale === DEFAULT_MARKETING_LOCALE) {
    return { focus: merged, fellBack: false };
  }
  let fellBack = false;
  const keys: (keyof PathwayLessonExamFocus)[] = ["howTested", "commonTraps", "prioritizationCues"];
  const out: PathwayLessonExamFocus = { ...(merged ?? {}) };
  let touched = false;
  for (const k of keys) {
    const pv = patch[k];
    if (typeof pv !== "string" || !pv.trim()) continue;
    const bv = String(base?.[k] ?? merged?.[k] ?? "");
    const r = pickLocalizedOverlayString(bv, pv, locale, {
      surface: "lesson_exam_focus",
      lessonSlug,
      sectionId,
      field: k,
    });
    out[k] = r.value;
    if (r.fellBack) fellBack = true;
    touched = true;
  }
  return { focus: touched ? out : merged, fellBack };
}

type PathwayLessonSectionOverlayPatch = Partial<Pick<PathwayLessonSection, "heading" | "body">> & {
  examFocus?: Partial<PathwayLessonExamFocus>;
};

function mergeLessonSection(
  base: PathwayLessonSection,
  patch: PathwayLessonSectionOverlayPatch,
  locale: string,
  lessonSlug: string,
): { section: PathwayLessonSection; fellBack: boolean } {
  let fellBack = false;
  let heading = base.heading;
  if (patch.heading !== undefined && patch.heading.trim()) {
    const r = pickLocalizedOverlayString(base.heading, patch.heading, locale, {
      surface: "lesson_section_heading",
      lessonSlug,
      sectionId: base.id,
    });
    heading = r.value;
    if (r.fellBack) fellBack = true;
  }
  let body = base.body;
  if (patch.body !== undefined && patch.body.trim()) {
    const r = pickLocalizedOverlayString(base.body, patch.body, locale, {
      surface: "lesson_section_body",
      lessonSlug,
      sectionId: base.id,
    });
    body = r.value;
    if (r.fellBack) fellBack = true;
  }
  const { focus: examFocus, fellBack: efFb } = mergeExamFocusLocalized(
    base.examFocus,
    patch.examFocus,
    locale,
    lessonSlug,
    base.id,
  );
  if (efFb) fellBack = true;
  return {
    section: {
      ...base,
      heading,
      body,
      ...(examFocus !== undefined ? { examFocus } : {}),
    },
    fellBack,
  };
}

function mergeQuizList(
  base: PathwayLessonQuizItem[] | undefined,
  patch: PathwayLessonEducationalOverlay["preTest"],
  label: string,
  locale: string,
  slug: string,
): { merged: PathwayLessonQuizItem[] | undefined; fellBack: boolean } {
  if (!base?.length || !patch?.length) return { merged: base, fellBack: false };
  let fellBack = false;
  const out = base.map((item, i) => {
    const p = patch[i];
    if (!p) return item;
    let question = item.question;
    if (p.question?.trim()) {
      const r = pickLocalizedOverlayString(item.question, p.question, locale, {
        surface: `lesson_${label}_question`,
        lessonSlug: slug,
        index: i,
      });
      question = r.value;
      if (r.fellBack) fellBack = true;
    }
    let options = item.options;
    if (Array.isArray(p.options) && p.options.length === item.options.length) {
      options = p.options.map((x, j) => {
        const r = pickLocalizedOverlayString(item.options[j] ?? "", String(x), locale, {
          surface: `lesson_${label}_option`,
          lessonSlug: slug,
          index: i,
          optionIndex: j,
        });
        if (r.fellBack) fellBack = true;
        return r.value;
      });
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
    let rationale = item.rationale;
    if (p.rationale?.trim()) {
      const r = pickLocalizedOverlayString(item.rationale ?? "", p.rationale, locale, {
        surface: `lesson_${label}_rationale`,
        lessonSlug: slug,
        index: i,
      });
      rationale = r.value;
      if (r.fellBack) fellBack = true;
    }
    return { ...item, question, options, correct: item.correct, ...(rationale ? { rationale } : {}) };
  });
  return { merged: out, fellBack };
}

type QuizOverlayPatchRow = Partial<Pick<PathwayLessonQuizItem, "question" | "options" | "rationale">>;

function mergeQuizOverlayArrays(
  a: QuizOverlayPatchRow[] | undefined,
  b: QuizOverlayPatchRow[] | undefined,
): QuizOverlayPatchRow[] | undefined {
  if (!b?.length) return a;
  if (!a?.length) return b;
  const len = Math.max(a.length, b.length);
  const out: QuizOverlayPatchRow[] = [];
  for (let i = 0; i < len; i++) {
    out.push({ ...(a[i] ?? {}), ...(b[i] ?? {}) });
  }
  return out;
}

/** Deep-merge two partial lesson overlays (e.g. file + DB). DB patch wins on field conflicts. */
export function mergePathwayLessonEducationalOverlayPatches(
  a: PathwayLessonEducationalOverlay | undefined,
  b: PathwayLessonEducationalOverlay | undefined,
): PathwayLessonEducationalOverlay | undefined {
  if (!a) return b;
  if (!b) return a;
  const sections: PathwayLessonEducationalOverlay["sections"] = { ...a.sections };
  if (b.sections) {
    for (const [id, patch] of Object.entries(b.sections)) {
      const prev = sections[id] ?? {};
      sections[id] = { ...prev, ...patch };
    }
  }
  return {
    ...a,
    ...b,
    title: b.title?.trim() ? b.title : a.title,
    topic: b.topic?.trim() ? b.topic : a.topic,
    seoTitle: b.seoTitle?.trim() ? b.seoTitle : a.seoTitle,
    seoDescription: b.seoDescription?.trim() ? b.seoDescription : a.seoDescription,
    sections,
    preTest: mergeQuizOverlayArrays(a.preTest, b.preTest),
    postTest: mergeQuizOverlayArrays(a.postTest, b.postTest),
  };
}

/**
 * Deep-merge `fragments/*.json` into the base `lessons.json` map (same keys as {@link mergePathwayLessonEducationalOverlayPatches}).
 * Keeps authoring ergonomic: translators can split large pathway overlays without running a separate merge script before deploy.
 */
function mergeLessonOverlaysFromFragments(
  baseRoot: string,
  locale: string,
  base: Record<string, PathwayLessonEducationalOverlay>,
): Record<string, PathwayLessonEducationalOverlay> {
  const fragDir = path.join(baseRoot, locale, "fragments");
  if (!existsSync(fragDir)) return base;
  const merged: Record<string, PathwayLessonEducationalOverlay> = { ...base };
  const files = readdirSync(/* turbopackIgnore: true */ fragDir)
    .filter((x) => x.endsWith(".json"))
    .sort();
  for (const f of files) {
    const part = readJsonFile<Record<string, PathwayLessonEducationalOverlay>>(path.join(fragDir, f));
    if (!part || typeof part !== "object") continue;
    for (const [k, v] of Object.entries(part)) {
      merged[k] = mergePathwayLessonEducationalOverlayPatches(merged[k], v) ?? v;
    }
  }
  return merged;
}

/**
 * Merge file-based lesson JSON with optional DB-published overlays (same keys: `slug` or `pathwayId:slug`).
 */
export function mergePathwayLessonOverlayRecordBundles(
  file: Record<string, PathwayLessonEducationalOverlay>,
  db?: Record<string, PathwayLessonEducationalOverlay>,
): Record<string, PathwayLessonEducationalOverlay> {
  if (!db || Object.keys(db).length === 0) return file;
  const out: Record<string, PathwayLessonEducationalOverlay> = { ...file };
  for (const [key, dbPatch] of Object.entries(db)) {
    out[key] = mergePathwayLessonEducationalOverlayPatches(file[key], dbPatch) ?? dbPatch;
  }
  return out;
}

/**
 * Merge file-based lesson overlays for display. Does not change slug, pathway, or quiz `correct` indices.
 * Keys: `slug` or `pathwayId:slug` when `pathwayId` is provided (disambiguates duplicate slugs).
 * @param dbLessonOverlayBundle — optional `EducationalTranslationOverlay` rows (PUBLISHED) merged after file JSON.
 */
export function applyPathwayLessonEducationalOverlay(
  lesson: PathwayLessonRecord,
  locale: string,
  pathwayId?: string,
  dbLessonOverlayBundle?: Record<string, PathwayLessonEducationalOverlay>,
): PathwayLessonRecord {
  if (locale === DEFAULT_MARKETING_LOCALE) return lesson;

  const bundle = mergePathwayLessonOverlayRecordBundles(loadLessonEducationalBundle(locale), dbLessonOverlayBundle);
  const compoundKey = pathwayId ? `${pathwayId}:${lesson.slug}` : null;
  const o = (compoundKey ? bundle[compoundKey] : undefined) ?? bundle[lesson.slug];
  if (!o || typeof o !== "object") {
    return lesson;
  }

  let applied = false;
  let overlayTranslationFallback = lesson.localeMeta?.overlayTranslationFallback ?? false;

  let title = lesson.title;
  if (o.title !== undefined && o.title.trim()) {
    const r = pickLocalizedOverlayString(lesson.title, o.title, locale, {
      surface: "lesson_title",
      lessonSlug: lesson.slug,
    });
    title = r.value;
    if (r.fellBack) overlayTranslationFallback = true;
  }
  if (title !== lesson.title) applied = true;

  let topic = lesson.topic;
  if (o.topic !== undefined && o.topic.trim()) {
    const r = pickLocalizedOverlayString(lesson.topic, o.topic, locale, {
      surface: "lesson_topic",
      lessonSlug: lesson.slug,
    });
    topic = r.value;
    if (r.fellBack) overlayTranslationFallback = true;
  }
  if (topic !== lesson.topic) applied = true;

  let seoTitle = lesson.seoTitle;
  if (o.seoTitle !== undefined && o.seoTitle.trim()) {
    const r = pickLocalizedOverlayString(lesson.seoTitle, o.seoTitle, locale, {
      surface: "lesson_seo_title",
      lessonSlug: lesson.slug,
    });
    seoTitle = r.value;
    if (r.fellBack) overlayTranslationFallback = true;
  }
  if (seoTitle !== lesson.seoTitle) applied = true;

  let seoDescription = lesson.seoDescription;
  if (o.seoDescription !== undefined && o.seoDescription.trim()) {
    const r = pickLocalizedOverlayString(lesson.seoDescription, o.seoDescription, locale, {
      surface: "lesson_seo_description",
      lessonSlug: lesson.slug,
    });
    seoDescription = r.value;
    if (r.fellBack) overlayTranslationFallback = true;
  }
  if (seoDescription !== lesson.seoDescription) applied = true;

  let sections = lesson.sections;
  if (o.sections && lesson.sections.length > 0) {
    const byId = o.sections;
    const next = lesson.sections.map((s) => {
      const patch = byId[s.id];
      if (!patch) return s;
      applied = true;
      const { section, fellBack } = mergeLessonSection(s, patch, locale, lesson.slug);
      if (fellBack) overlayTranslationFallback = true;
      return section;
    });
    sections = next;
  }

  let preTest = lesson.preTest;
  let postTest = lesson.postTest;
  if (o.preTest?.length) {
    const { merged, fellBack } = mergeQuizList(lesson.preTest, o.preTest, "preTest", locale, lesson.slug);
    if (merged !== lesson.preTest) {
      preTest = merged;
      applied = true;
    }
    if (fellBack) overlayTranslationFallback = true;
  }
  if (o.postTest?.length) {
    const { merged, fellBack } = mergeQuizList(lesson.postTest, o.postTest, "postTest", locale, lesson.slug);
    if (merged !== lesson.postTest) {
      postTest = merged;
      applied = true;
    }
    if (fellBack) overlayTranslationFallback = true;
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
    localeMeta: {
      ...baseMeta,
      educationalOverlayApplied: true,
      ...(overlayTranslationFallback ? { overlayTranslationFallback: true } : {}),
    },
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

function mergeQuestionNullableStringWithQuality(
  base: string | null | undefined,
  overlay: string | undefined,
  locale: string,
  field: string,
  questionId: string,
): { value: string | null | undefined; usedOverlay: boolean; fellBack: boolean } {
  if (overlay === undefined) return { value: base ?? null, usedOverlay: false, fellBack: false };
  const t = overlay.trim();
  if (!t.length) return { value: base ?? null, usedOverlay: false, fellBack: false };
  const r = pickLocalizedOverlayString(base ?? "", overlay, locale, {
    surface: "question_field",
    field,
    questionId,
  });
  const value = (r.value.length ? r.value : base) ?? null;
  return {
    value,
    usedOverlay: !r.fellBack,
    fellBack: r.fellBack,
  };
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
  /** At least one overlay string failed quality checks and was reverted to English. */
  overlayTranslationFallback?: boolean;
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
  /** When set, merged file + DB overlays; otherwise file-based `questions.json` only. */
  overlayBundle?: Record<string, QuestionEducationalOverlay>,
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

  const bundle = overlayBundle ?? loadQuestionEducationalOverlayBundle(locale);
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
  let overlayApplied = false;
  let overlayTranslationFallback = false;

  const stemPick = o.stem?.trim()
    ? pickLocalizedOverlayString(row.stem, o.stem, locale, { surface: "question_stem", questionId: row.id })
    : { value: row.stem, fellBack: false };
  const stem = stemPick.value;
  if (o.stem?.trim()) {
    if (!stemPick.fellBack) overlayApplied = true;
    else overlayTranslationFallback = true;
  }

  let displayOptions: string[] | undefined;
  if (Array.isArray(o.options) && o.options.length === canonical.length) {
    let anyOptUsed = false;
    const built = o.options.map((x, i) => {
      const r = pickLocalizedOverlayString(canonical[i] ?? "", String(x), locale, {
        surface: "question_option",
        questionId: row.id,
        optionIndex: i,
      });
      if (!r.fellBack) anyOptUsed = true;
      else overlayTranslationFallback = true;
      return r.value;
    });
    if (anyOptUsed) {
      overlayApplied = true;
      const identical = built.every((v, i) => v === canonical[i]);
      displayOptions = identical ? undefined : built;
    }
  } else if (o.options !== undefined && o.options.length !== canonical.length) {
    safeServerLog("i18n", "educational_question_overlay_options_length_mismatch", {
      locale,
      questionIdPrefix: row.id.slice(0, 8),
      canonicalLen: canonical.length,
      overlayLen: Array.isArray(o.options) ? o.options.length : -1,
    });
  }

  const rat = mergeQuestionNullableStringWithQuality(row.rationale, o.rationale, locale, "rationale", row.id);
  if (rat.usedOverlay) overlayApplied = true;
  if (rat.fellBack) overlayTranslationFallback = true;

  const cae = mergeQuestionNullableStringWithQuality(
    row.correctAnswerExplanation,
    o.correctAnswerExplanation,
    locale,
    "correctAnswerExplanation",
    row.id,
  );
  if (cae.usedOverlay) overlayApplied = true;
  if (cae.fellBack) overlayTranslationFallback = true;

  const cr = mergeQuestionNullableStringWithQuality(row.clinicalReasoning, o.clinicalReasoning, locale, "clinicalReasoning", row.id);
  if (cr.usedOverlay) overlayApplied = true;
  if (cr.fellBack) overlayTranslationFallback = true;

  const kt = mergeQuestionNullableStringWithQuality(row.keyTakeaway, o.keyTakeaway, locale, "keyTakeaway", row.id);
  if (kt.usedOverlay) overlayApplied = true;
  if (kt.fellBack) overlayTranslationFallback = true;

  const cp = mergeQuestionNullableStringWithQuality(row.clinicalPearl, o.clinicalPearl, locale, "clinicalPearl", row.id);
  if (cp.usedOverlay) overlayApplied = true;
  if (cp.fellBack) overlayTranslationFallback = true;

  const es = mergeQuestionNullableStringWithQuality(row.examStrategy, o.examStrategy, locale, "examStrategy", row.id);
  if (es.usedOverlay) overlayApplied = true;
  if (es.fellBack) overlayTranslationFallback = true;

  const mh = mergeQuestionNullableStringWithQuality(row.memoryHook, o.memoryHook, locale, "memoryHook", row.id);
  if (mh.usedOverlay) overlayApplied = true;
  if (mh.fellBack) overlayTranslationFallback = true;

  const ct = mergeQuestionNullableStringWithQuality(row.clinicalTrap, o.clinicalTrap, locale, "clinicalTrap", row.id);
  if (ct.usedOverlay) overlayApplied = true;
  if (ct.fellBack) overlayTranslationFallback = true;

  return {
    stem,
    options: row.options,
    ...(displayOptions ? { displayOptions } : {}),
    rationale: rat.value,
    correctAnswerExplanation: cae.value,
    clinicalReasoning: cr.value,
    keyTakeaway: kt.value,
    clinicalPearl: cp.value,
    examStrategy: es.value,
    memoryHook: mh.value,
    clinicalTrap: ct.value,
    distractorRationales: o.distractorRationales !== undefined ? o.distractorRationales : row.distractorRationales,
    incorrectAnswerRationale:
      o.incorrectAnswerRationale !== undefined ? o.incorrectAnswerRationale : row.incorrectAnswerRationale,
    overlayApplied,
    ...(overlayTranslationFallback ? { overlayTranslationFallback: true } : {}),
  };
}

/** Merge localized display fields onto an API question object (list/detail). Preserves extra keys (topic, exam, …). */
export function mergeQuestionApiPayload(
  q: Record<string, unknown>,
  locale: string,
  overlayBundle?: Record<string, QuestionEducationalOverlay>,
): Record<string, unknown> {
  const m = applyQuestionEducationalOverlayForDisplay(q as QuestionRowForDisplay, locale, overlayBundle);
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
  out.overlayApplied = m.overlayApplied;
  if (m.overlayTranslationFallback) out.overlayTranslationFallback = true;
  return out;
}

/** Preview mode truncates stem after overlay merge (same 280-char cap as legacy). */
export function localizeQuestionListForApi(
  items: Array<Record<string, unknown>>,
  mode: "preview" | "full",
  locale: string,
  overlayBundle?: Record<string, QuestionEducationalOverlay>,
): Array<Record<string, unknown>> {
  if (mode === "preview") {
    return items.map((q) => {
      const merged = mergeQuestionApiPayload(q, locale, overlayBundle);
      const stem = String(merged.stem ?? "");
      return {
        ...merged,
        stem: stem.length > 280 ? `${stem.slice(0, 280).trim()}…` : stem,
      };
    });
  }
  return items.map((q) => mergeQuestionApiPayload(q, locale, overlayBundle));
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
  overlayBundle?: Record<string, QuestionEducationalOverlay>,
): T {
  if (locale === DEFAULT_MARKETING_LOCALE) return row;
  const bundle = overlayBundle ?? loadQuestionEducationalOverlayBundle(locale);
  const o = bundle[questionId];
  if (!o) return row;
  const stem = o.stem?.trim()
    ? pickLocalizedOverlayString(row.stem, o.stem, locale, {
        surface: "question_stem_grade",
        questionId,
      }).value
    : row.stem;
  const rationale = mergeQuestionNullableStringWithQuality(row.rationale, o.rationale, locale, "rationale", questionId).value;
  const correctAnswerExplanation = mergeQuestionNullableStringWithQuality(
    row.correctAnswerExplanation,
    o.correctAnswerExplanation,
    locale,
    "correctAnswerExplanation",
    questionId,
  ).value;
  const clinicalReasoning = mergeQuestionNullableStringWithQuality(
    row.clinicalReasoning,
    o.clinicalReasoning,
    locale,
    "clinicalReasoning",
    questionId,
  ).value;
  const keyTakeaway = mergeQuestionNullableStringWithQuality(row.keyTakeaway, o.keyTakeaway, locale, "keyTakeaway", questionId).value;
  const clinicalPearl = mergeQuestionNullableStringWithQuality(row.clinicalPearl, o.clinicalPearl, locale, "clinicalPearl", questionId).value;
  const examStrategy = mergeQuestionNullableStringWithQuality(row.examStrategy, o.examStrategy, locale, "examStrategy", questionId).value;
  const memoryHook = mergeQuestionNullableStringWithQuality(row.memoryHook, o.memoryHook, locale, "memoryHook", questionId).value;
  const clinicalTrap = mergeQuestionNullableStringWithQuality(row.clinicalTrap, o.clinicalTrap, locale, "clinicalTrap", questionId).value;
  return {
    ...row,
    stem,
    rationale: rationale ?? row.rationale,
    correctAnswerExplanation: correctAnswerExplanation ?? row.correctAnswerExplanation,
    clinicalReasoning: clinicalReasoning ?? row.clinicalReasoning,
    keyTakeaway: keyTakeaway ?? row.keyTakeaway,
    clinicalPearl: clinicalPearl ?? row.clinicalPearl,
    examStrategy: examStrategy ?? row.examStrategy,
    memoryHook: memoryHook ?? row.memoryHook,
    clinicalTrap: clinicalTrap ?? row.clinicalTrap,
    distractorRationales: o.distractorRationales !== undefined ? o.distractorRationales : row.distractorRationales,
    incorrectAnswerRationale:
      o.incorrectAnswerRationale !== undefined ? o.incorrectAnswerRationale : row.incorrectAnswerRationale,
  };
}

export function applyFlashcardDeckOverlay(
  deck: { id: string; slug: string; title: string; description: string | null },
  locale: string,
  /** Merged file + DB bundle; when omitted, file `flashcards.json` only. */
  bundleOverride?: FlashcardEducationalBundle,
): { title: string; description: string | null } {
  if (locale === DEFAULT_MARKETING_LOCALE) return { title: deck.title, description: deck.description };
  const b = bundleOverride ?? loadFlashcardEducationalBundle(locale);
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
  const title = d.title?.trim()
    ? pickLocalizedOverlayString(deck.title, d.title, locale, {
        surface: "flashcard_deck_title",
        deckId: deck.id,
      }).value
    : deck.title;
  let description: string | null = deck.description;
  if (d.description !== undefined) {
    const r = pickLocalizedOverlayString(deck.description ?? "", d.description ?? undefined, locale, {
      surface: "flashcard_deck_description",
      deckId: deck.id,
    });
    description = r.fellBack ? deck.description : r.value.length ? r.value : deck.description;
  }
  return { title, description };
}

export function applyFlashcardCardOverlay(
  card: { id: string; front: string; back: string },
  locale: string,
  bundleOverride?: FlashcardEducationalBundle,
): { front: string; back: string; explanation?: string } {
  if (locale === DEFAULT_MARKETING_LOCALE) return { front: card.front, back: card.back };
  const b = bundleOverride ?? loadFlashcardEducationalBundle(locale);
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
  const front = c.front?.trim()
    ? pickLocalizedOverlayString(card.front, c.front, locale, {
        surface: "flashcard_card_front",
        cardId: card.id,
      }).value
    : card.front;
  const back = c.back?.trim()
    ? pickLocalizedOverlayString(card.back, c.back, locale, {
        surface: "flashcard_card_back",
        cardId: card.id,
      }).value
    : card.back;
  let explanation: string | undefined;
  if (c.explanation?.trim()) {
    const r = pickLocalizedOverlayString("", c.explanation, locale, {
      surface: "flashcard_card_explanation",
      cardId: card.id,
    });
    explanation = r.fellBack ? undefined : r.value.trim() || undefined;
  }
  return {
    front,
    back,
    ...(explanation ? { explanation } : {}),
  };
}
