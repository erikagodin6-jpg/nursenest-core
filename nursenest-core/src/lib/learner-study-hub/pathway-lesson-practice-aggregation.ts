import { buildAppLessonsReviewLessonHref } from "@/lib/learner/app-study-internal-links";
import type { PathwayLessonQuizItem, PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import type { CheckpointQuestion } from "@/lib/lessons/lesson-recall-types";
import { pathwayLessonEligibleForLearnerStudyInventory } from "@/lib/learner-study-hub/pathway-lesson-learner-study-guards";

function lessonReviewHref(pathwayId: string, lessonSlug: string): string {
  return buildAppLessonsReviewLessonHref(pathwayId, lessonSlug);
}

function normStem(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .slice(0, 240);
}

function dedupeKey(pathwayId: string, lessonSlug: string, stem: string): string {
  return `${pathwayId.trim()}|${lessonSlug}|${normStem(stem)}`;
}

export type PathwayLessonDerivedPracticeQuestion = {
  stem: string;
  options: string[];
  correctIndex: number;
  rationale?: string;
  pathwayId: string;
  lessonSlug: string;
  lessonTitle: string;
  topicSlug: string;
  bodySystem: string;
  difficulty: number;
  source:
    | "preTest"
    | "postTest"
    | "checkpoint"
    | "interactive_mini"
    | "section_practice"
    | "exam_trap"
    | "case_section";
  lessonHref: string;
};

function pushQuizItems(
  items: PathwayLessonQuizItem[] | undefined,
  args: {
    pathwayId: string;
    lessonSlug: string;
    lessonTitle: string;
    topicSlug: string;
    bodySystem: string;
    source: "preTest" | "postTest";
    seen: Set<string>;
    out: PathwayLessonDerivedPracticeQuestion[];
    cap: number;
  },
): void {
  const { pathwayId, lessonSlug, lessonTitle, topicSlug, bodySystem, source, seen, out, cap } = args;
  const href = lessonReviewHref(pathwayId, lessonSlug);
  for (const item of items ?? []) {
    if (out.length >= cap) return;
    const stem = String(item.question ?? "").trim();
    const opts = (item.options ?? []).map((o) => String(o ?? "").trim()).filter(Boolean);
    if (stem.length < 6 || opts.length < 2) continue;
    const correct = typeof item.correct === "number" && Number.isFinite(item.correct) ? Math.floor(item.correct) : 0;
    if (correct < 0 || correct >= opts.length) continue;
    const key = dedupeKey(pathwayId, lessonSlug, stem);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      stem,
      options: opts,
      correctIndex: correct,
      rationale: item.rationale?.trim() || undefined,
      pathwayId,
      lessonSlug,
      lessonTitle,
      topicSlug,
      bodySystem,
      difficulty: 3,
      source,
      lessonHref: href,
    });
  }
}

function pushCheckpoint(
  cq: CheckpointQuestion,
  args: {
    pathwayId: string;
    lessonSlug: string;
    lessonTitle: string;
    topicSlug: string;
    bodySystem: string;
    seen: Set<string>;
    out: PathwayLessonDerivedPracticeQuestion[];
    cap: number;
    difficulty?: number;
    source?: PathwayLessonDerivedPracticeQuestion["source"];
  },
): void {
  const { pathwayId, lessonSlug, lessonTitle, topicSlug, bodySystem, seen, out, cap } = args;
  const difficulty = args.difficulty ?? 3;
  const source = args.source ?? "checkpoint";
  if (out.length >= cap) return;
  const stem = String(cq.question ?? "").trim();
  const opts = cq.options.map((o) => String(o.text ?? "").trim()).filter(Boolean);
  if (stem.length < 6 || opts.length < 2) return;
  const correctIdx = cq.options.findIndex((o) => o.id === cq.correctId);
  if (correctIdx < 0 || correctIdx >= opts.length) return;
  const key = dedupeKey(pathwayId, lessonSlug, stem);
  if (seen.has(key)) return;
  seen.add(key);
  const href = lessonReviewHref(pathwayId, lessonSlug);
  out.push({
    stem,
    options: opts,
    correctIndex: correctIdx,
    rationale: String(cq.explanation ?? "").trim() || undefined,
    pathwayId,
    lessonSlug,
    lessonTitle,
    topicSlug,
    bodySystem,
    difficulty,
    source,
    lessonHref: href,
  });
}

function isCaseLikeSection(section: PathwayLessonSection): boolean {
  const k = String(section.kind);
  return k === "clinical_scenario" || k === "case_study";
}

function pushLoosePracticeQuestionObjects(
  raw: unknown,
  args: {
    pathwayId: string;
    lessonSlug: string;
    lessonTitle: string;
    topicSlug: string;
    bodySystem: string;
    seen: Set<string>;
    out: PathwayLessonDerivedPracticeQuestion[];
    cap: number;
    source: "section_practice" | "case_section";
    difficulty: number;
  },
): void {
  if (!Array.isArray(raw)) return;
  const { pathwayId, lessonSlug, lessonTitle, topicSlug, bodySystem, seen, out, cap, source, difficulty } = args;
  const href = lessonReviewHref(pathwayId, lessonSlug);
  for (const item of raw) {
    if (out.length >= cap) return;
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const stem = String(o.question ?? o.stem ?? "").trim();
    const optsRaw = o.options;
    if (!Array.isArray(optsRaw)) continue;
    const opts = optsRaw.map((x) => String(x ?? "").trim()).filter(Boolean);
    if (stem.length < 6 || opts.length < 2) continue;
    const correctRaw = o.correct ?? o.correctIndex;
    const correct = typeof correctRaw === "number" && Number.isFinite(correctRaw) ? Math.floor(correctRaw) : 0;
    if (correct < 0 || correct >= opts.length) continue;
    const key = dedupeKey(pathwayId, lessonSlug, stem);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      stem,
      options: opts,
      correctIndex: correct,
      rationale: typeof o.rationale === "string" ? o.rationale.trim() || undefined : undefined,
      pathwayId,
      lessonSlug,
      lessonTitle,
      topicSlug,
      bodySystem,
      difficulty,
      source,
      lessonHref: href,
    });
  }
}

function pushExamTrapTakeaways(
  lines: string[],
  args: {
    pathwayId: string;
    lessonSlug: string;
    lessonTitle: string;
    topicSlug: string;
    bodySystem: string;
    seen: Set<string>;
    out: PathwayLessonDerivedPracticeQuestion[];
    cap: number;
  },
): void {
  const { pathwayId, lessonSlug, lessonTitle, topicSlug, bodySystem, seen, out, cap } = args;
  const genericOpts = [
    "Treat it as a high-yield exam pitfall to watch for.",
    "Assume it is rarely tested — deprioritize.",
    "Treat it as documentation-only — not clinical priority.",
  ];
  for (const raw of lines) {
    if (out.length >= cap) return;
    const trap = raw.trim();
    if (trap.length < 16 || trap.length > 480) continue;
    const stem = trap.endsWith("?") ? trap : `Exam trap: ${trap.slice(0, 220)}${trap.length > 220 ? "…" : ""}`;
    const key = dedupeKey(pathwayId, lessonSlug, stem);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      stem,
      options: genericOpts,
      correctIndex: 0,
      rationale: "High-yield traps are written to steer you away from tempting but unsafe choices.",
      pathwayId,
      lessonSlug,
      lessonTitle,
      topicSlug,
      bodySystem,
      difficulty: 4,
      source: "exam_trap",
      lessonHref: lessonReviewHref(pathwayId, lessonSlug),
    });
  }
}

function splitTrapBlob(blob: string): string[] {
  return blob
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export type GetPracticeQuestionsForPathwayOptions = {
  maxLessons?: number;
  maxQuestions?: number;
  bodySystems?: string[];
  topicSlug?: string | null;
  lessonsOverride?: PathwayLessonRecord[];
};

export type PracticeQuestionsPathwayAggregation = {
  pathwayId: string;
  questions: PathwayLessonDerivedPracticeQuestion[];
  truncated: boolean;
  byBodySystem: { bodySystem: string; count: number }[];
};

function buildBodySystemCounts(questions: PathwayLessonDerivedPracticeQuestion[]): { bodySystem: string; count: number }[] {
  const m = new Map<string, number>();
  for (const q of questions) {
    const k = (q.bodySystem || "general").trim().toLowerCase() || "general";
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()]
    .map(([bodySystem, count]) => ({ bodySystem, count }))
    .sort((a, b) => b.count - a.count || a.bodySystem.localeCompare(b.bodySystem));
}

/**
 * Aggregates inline MCQ-style content from normalized PathwayLesson inventory.
 * Dedupes by pathway + lesson slug + normalized stem.
 */
export function aggregatePracticeQuestionsFromInventoryLessons(
  pathwayId: string,
  lessonsIn: PathwayLessonRecord[],
  opts: GetPracticeQuestionsForPathwayOptions = {},
): PracticeQuestionsPathwayAggregation {
  const pid = pathwayId?.trim();
  if (!pid) return { pathwayId: "", questions: [], truncated: false, byBodySystem: [] };

  const maxLessons = Math.min(800, Math.max(1, opts.maxLessons ?? 400));
  const maxQuestions = Math.min(5000, Math.max(1, opts.maxQuestions ?? 2500));
  const lessons = lessonsIn.filter(pathwayLessonEligibleForLearnerStudyInventory).slice(0, maxLessons);
  const systemFilter = (opts.bodySystems ?? [])
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const topicFilter = opts.topicSlug?.trim().toLowerCase() ?? "";

  const seen = new Set<string>();
  const out: PathwayLessonDerivedPracticeQuestion[] = [];

  for (const lesson of lessons) {
    if (out.length >= maxQuestions) break;
    const bodyKey = ((lesson.bodySystem || lesson.system || "").trim().toLowerCase() || "general");
    if (systemFilter.length > 0 && !systemFilter.includes(bodyKey)) continue;
    if (topicFilter && (lesson.topicSlug ?? "").trim().toLowerCase() !== topicFilter) continue;

    const topicSlug = (lesson.topicSlug ?? "").trim().toLowerCase();
    const bodySystem = (lesson.bodySystem || lesson.system || "general").trim() || "general";
    const base = {
      pathwayId: pid,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      topicSlug,
      bodySystem,
      seen,
      out,
      cap: maxQuestions,
    };

    pushQuizItems(lesson.preTest, { ...base, source: "preTest" });
    pushQuizItems(lesson.postTest, { ...base, source: "postTest" });

    for (const section of lesson.sections ?? []) {
      if (out.length >= maxQuestions) break;
      const sec = section as PathwayLessonSection & { practiceQuestions?: unknown };
      pushLoosePracticeQuestionObjects(sec.practiceQuestions, {
        ...base,
        source: isCaseLikeSection(section) ? "case_section" : "section_practice",
        difficulty: isCaseLikeSection(section) ? 4 : 3,
      });

      if (section.kind === "exam_focus" && section.examFocus?.commonTraps) {
        pushExamTrapTakeaways(splitTrapBlob(String(section.examFocus.commonTraps)), base);
      }

      for (const cq of section.checkpointQuestions ?? []) {
        if (out.length >= maxQuestions) break;
        pushCheckpoint(cq, {
          ...base,
          difficulty: isCaseLikeSection(section) ? 4 : 3,
          source: isCaseLikeSection(section) ? "case_section" : "checkpoint",
        });
      }
    }

    pushExamTrapTakeaways((lesson.studyCommonTraps ?? []).map((s) => String(s)), base);

    for (const mod of lesson.interactiveModules ?? []) {
      if (out.length >= maxQuestions) break;
      if (mod.type !== "sound-library") continue;
      for (const item of mod.items ?? []) {
        if (out.length >= maxQuestions) break;
        const mq = item.miniQuestion;
        if (!mq?.question || !Array.isArray(mq.options) || mq.options.length < 2) continue;
        const stem = String(mq.question).trim();
        const opts = mq.options.map((o) => String(o ?? "").trim()).filter(Boolean);
        const correct = typeof mq.correctIndex === "number" ? Math.floor(mq.correctIndex) : 0;
        if (stem.length < 6 || correct < 0 || correct >= opts.length) continue;
        const key = dedupeKey(pid, lesson.slug, stem);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          stem,
          options: opts,
          correctIndex: correct,
          rationale: String(mq.rationale ?? "").trim() || undefined,
          pathwayId: pid,
          lessonSlug: lesson.slug,
          lessonTitle: lesson.title,
          topicSlug,
          bodySystem,
          difficulty: 3,
          source: "interactive_mini",
          lessonHref: lessonReviewHref(pid, lesson.slug),
        });
      }
    }
  }

  return {
    pathwayId: pid,
    questions: out,
    truncated: out.length >= maxQuestions,
    byBodySystem: buildBodySystemCounts(out),
  };
}
