import type { PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import type { ContentQualityTier } from "@/lib/content-quality/standards";
import {
  LESSON_MIN_WORDS,
  LESSON_PREFERRED_MAX_WORDS,
  LESSON_STRONG_MIN_WORDS,
} from "@/lib/content-quality/standards";
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";

const CANONICAL_KINDS = new Set([
  "clinical_meaning",
  "exam_relevance",
  "core_concept",
  "clinical_scenario",
  "takeaways",
]);

export type LessonQualityResult = {
  tier: ContentQualityTier;
  wordCount: number;
  /** Sections (by kind) with meaningful body text. */
  coveredCanonicalKinds: string[];
  /** Kinds expected for full structure but empty or missing. */
  missingCanonicalKinds: string[];
};

export function pathwayLessonWordCount(lesson: Pick<PathwayLessonRecord, "sections">): number {
  if (!lesson.sections?.length) return 0;
  const text = lesson.sections.map((s) => stripToPlainText(typeof s.body === "string" ? s.body : "")).join("\n\n");
  return countWords(text);
}

export function classifyPathwayLesson(lesson: Pick<PathwayLessonRecord, "sections">): LessonQualityResult {
  const wc = pathwayLessonWordCount(lesson);
  const sections = lesson.sections ?? [];

  const covered: string[] = [];
  for (const kind of CANONICAL_KINDS) {
    const bodies = sections.filter((s: PathwayLessonSection) => s.kind === kind).map((s) => stripToPlainText(s.body));
    const words = bodies.reduce((n, b) => n + countWords(b), 0);
    if (words >= 12) covered.push(kind);
  }
  const missingCanonicalKinds = [...CANONICAL_KINDS].filter((k) => !covered.includes(k));

  let tier: ContentQualityTier;
  if (wc <= 0) tier = "missing";
  else if (wc < LESSON_MIN_WORDS) tier = "thin";
  else if (wc < LESSON_STRONG_MIN_WORDS) tier = "acceptable";
  else tier = "strong";

  return {
    tier,
    wordCount: wc,
    coveredCanonicalKinds: covered,
    missingCanonicalKinds,
  };
}

/** @internal */
export function lessonWithinPreferredBand(wordCount: number): boolean {
  return wordCount >= LESSON_STRONG_MIN_WORDS && wordCount <= LESSON_PREFERRED_MAX_WORDS;
}

/** ContentItem JSON: array of strings or { text } blocks. */
export function contentItemWordCount(content: unknown): number {
  if (content == null) return 0;
  if (typeof content === "string") return countWords(content);
  if (!Array.isArray(content)) return 0;
  const chunks: string[] = [];
  for (const block of content) {
    if (typeof block === "string") chunks.push(block);
    else if (block && typeof block === "object" && "text" in block) {
      const t = (block as { text?: string }).text;
      if (typeof t === "string") chunks.push(t);
    }
  }
  return countWords(chunks.join("\n\n"));
}

export function classifyContentItemLesson(content: unknown): Pick<LessonQualityResult, "tier" | "wordCount"> {
  const wc = contentItemWordCount(content);
  let tier: ContentQualityTier;
  if (wc <= 0) tier = "missing";
  else if (wc < LESSON_MIN_WORDS) tier = "thin";
  else if (wc < LESSON_STRONG_MIN_WORDS) tier = "acceptable";
  else tier = "strong";
  return { tier, wordCount: wc };
}
