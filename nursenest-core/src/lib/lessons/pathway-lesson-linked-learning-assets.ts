/**
 * Canonical cross-surface keys for pathway lessons ↔ flashcards, question bank, and CAT practice.
 * Populated during {@link normalizeLesson} so list/detail surfaces and audits share one contract.
 */
import { pathwayLessonWordCount } from "@/lib/content-quality/classify-lesson";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { classifyLessonReadiness } from "@/lib/lessons/lesson-content-readiness";
import { explicitLessonStudyLoopCombinedIdCount } from "@/lib/lessons/load-lesson-study-loop-gate";
import type {
  PathwayLessonLinkedLearningSignals,
  PathwayLessonRecord,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";

const STOP = new Set([
  "nclex",
  "rn",
  "pn",
  "us",
  "ca",
  "np",
  "fnp",
  "rex",
  "exam",
  "lesson",
  "prep",
  "review",
  "and",
  "the",
  "for",
]);

function topicLabelToKebab(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function slugToFallbackTopicKey(slug: string): string {
  const s = slug.trim().toLowerCase();
  if (!s) return "general";
  const parts = s
    .split("-")
    .map((p) => p.trim())
    .filter((p) => p.length > 2 && !STOP.has(p));
  const joined = parts.slice(0, 4).join("-");
  return joined.length > 0 ? joined : s.split("-")[0] || "general";
}

/**
 * When `topicSlug` is missing in authoring, derive a stable key from topic label, body system, or slug
 * so every lesson can participate in topic-scoped study surfaces (bidirectional with hub filters).
 */
export function deriveCanonicalStudyTopicSlug(raw: {
  topicSlug?: string;
  topic?: string;
  slug?: string;
  bodySystem?: string;
  title?: string;
}): string {
  const ts = typeof raw.topicSlug === "string" ? raw.topicSlug.trim().toLowerCase() : "";
  if (ts.length > 0) return ts;
  const topic = typeof raw.topic === "string" ? raw.topic.trim() : "";
  if (topic.length > 0) {
    const k = topicLabelToKebab(topic);
    if (k.length > 0) return k;
  }
  const bs = typeof raw.bodySystem === "string" ? raw.bodySystem.trim() : "";
  if (bs.length > 0) {
    const k = topicLabelToKebab(bs);
    if (k.length > 0) return k;
  }
  const slug = typeof raw.slug === "string" ? raw.slug : "";
  return slugToFallbackTopicKey(slug);
}

function sectionLinkedFlashcardBodyLen(sections: PathwayLessonSection[]): number {
  const sec = sections.find((s) => String(s.kind) === "linked_flashcard_prompts");
  const body = typeof sec?.body === "string" ? sec.body.trim() : "";
  return body.length;
}

export function lessonHasLinkedFlashcardSignals(lesson: PathwayLessonRecord): boolean {
  const prompts = lesson.linked_flashcard_prompts?.length ?? 0;
  if (prompts > 0) return true;
  if (sectionLinkedFlashcardBodyLen(lesson.sections ?? []) > 40) return true;
  return lesson.topicSlug.trim().length > 0;
}

export function lessonHasLinkedPracticeQuestionSignals(lesson: PathwayLessonRecord): boolean {
  const n = explicitLessonStudyLoopCombinedIdCount(lesson.preTestQuestionIds, lesson.postTestQuestionIds);
  if (n > 0) return true;
  const pre = lesson.preTest?.length ?? 0;
  const post = lesson.postTest?.length ?? 0;
  if (pre + post > 0) return true;
  return lesson.topicSlug.trim().length > 0;
}

/**
 * True when the pathway can deep-link into practice-test / CAT **surfaces** (`/app/practice-tests?pathwayId=…`).
 * Distinct from {@link pathwayAllowsCatAdaptiveStart}: waitlist/upcoming pathways still ship lessons + pools;
 * the app may gate the CAT launcher separately.
 */
export function pathwayCatPoolSurfaceAvailable(pathwayId: string): boolean {
  const id = pathwayId.trim();
  if (!id) return true;
  const def = getExamPathwayById(id);
  if (!def) return true;
  return def.status !== "hidden";
}

export function computePathwayLessonLinkedLearningSignals(
  pathwayId: string,
  lesson: PathwayLessonRecord,
): PathwayLessonLinkedLearningSignals {
  /** Stable topic key for `/app/*?topic=` / `topicCode=` — falls back to label, body system, or slug. */
  const bidirectionalTopicKey = deriveCanonicalStudyTopicSlug(lesson);
  const flashcardsLinked = lessonHasLinkedFlashcardSignals(lesson);
  const practiceQuestionsLinked = lessonHasLinkedPracticeQuestionSignals(lesson);
  const catPoolLinked = pathwayCatPoolSurfaceAvailable(pathwayId);
  const wc = pathwayLessonWordCount(lesson);
  const sectionCount = lesson.sections?.length ?? 0;
  const bankHook =
    explicitLessonStudyLoopCombinedIdCount(lesson.preTestQuestionIds, lesson.postTestQuestionIds) > 0;
  const inlineHook = (lesson.preTest?.length ?? 0) + (lesson.postTest?.length ?? 0) > 0;
  const depth = classifyLessonReadiness({
    wordCount: wc,
    sectionCount,
    hasQuestions: bankHook || inlineHook,
  });
  const practiceDepthOk = bankHook || inlineHook || wc >= 200;
  const adaptiveLearningReadiness =
    flashcardsLinked &&
    practiceQuestionsLinked &&
    catPoolLinked &&
    depth !== "empty" &&
    practiceDepthOk;

  return {
    bidirectionalTopicKey,
    flashcardsLinked,
    practiceQuestionsLinked,
    catPoolLinked,
    adaptiveLearningReadiness,
  };
}

export type LinkedLearningGateViolation = { pathwayId: string; slug: string; reasons: string[] };

export function collectLinkedLearningGateViolations(
  pathwayId: string,
  lessons: PathwayLessonRecord[],
): LinkedLearningGateViolation[] {
  const out: LinkedLearningGateViolation[] = [];
  for (const lesson of lessons) {
    const sig = lesson.linkedLearningSignals ?? computePathwayLessonLinkedLearningSignals(pathwayId, lesson);
    const reasons: string[] = [];
    if (!sig.flashcardsLinked) reasons.push("missing_flashcards_link");
    if (!sig.practiceQuestionsLinked) reasons.push("missing_practice_questions_link");
    if (!sig.catPoolLinked) reasons.push("pathway_practice_surface_unavailable");
    if (!sig.adaptiveLearningReadiness) reasons.push("adaptive_learning_not_ready");
    if (!sig.bidirectionalTopicKey) reasons.push("missing_bidirectional_topic_key");
    if (reasons.length) out.push({ pathwayId, slug: lesson.slug, reasons });
  }
  return out;
}
