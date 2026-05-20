import type { LessonContent, QuizQuestion } from "@legacy-client/data/lessons/types";
import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import { countMedMathLessonWords } from "./transform-med-math-lesson";

/** Med-math migration QA bar (stricter than global meaningful-lesson floor). */
export const MED_MATH_MIGRATION_MIN_WORDS = 800;

const UNIT_PATTERN = /\b(mg|mcg|g|kg|mL|ml|L|mEq|units|unit|hr|hrs|min|minutes?|tablet|tablets|IV|PO|IM|gtt|mcg\/kg)\b/gi;

export function validateMedMathLessonContent(lesson: LessonContent): string[] {
  const errors: string[] = [];
  const quiz = (lesson.quiz ?? []).filter(Boolean) as QuizQuestion[];
  if (quiz.length === 0) {
    errors.push("quiz: at least one assessment item is required");
  }
  for (let i = 0; i < quiz.length; i += 1) {
    const q = quiz[i]!;
    const rat = Array.isArray(q.rationale) ? q.rationale.join(" ") : q.rationale;
    if (!rat?.trim()) {
      errors.push(`quiz[${i}]: missing rationale`);
    }
  }
  return errors;
}

export function validateMedMathPayloadCorpus(sections: PathwayLessonSection[]): string[] {
  const errors: string[] = [];
  const parts: string[] = [];
  for (const s of sections) {
    parts.push(typeof s.body === "string" ? s.body : "");
    for (const cq of s.checkpointQuestions ?? []) {
      parts.push(cq.question, cq.explanation, ...cq.options.map((o) => o.text));
    }
  }
  const corpus = parts.join("\n\n");
  const wc = countMedMathLessonWords(sections);
  if (wc < MED_MATH_MIGRATION_MIN_WORDS) {
    errors.push(`word_count: ${wc} < ${MED_MATH_MIGRATION_MIN_WORDS} (sections + checkpoint text)`);
  }

  if (!/\n##\s*Safety\b/m.test(corpus) && !/###\s*Safety\b/m.test(corpus)) {
    errors.push("safety: missing dedicated Safety heading (expected '## Safety' or '### Safety')");
  }

  const unitHits = corpus.match(UNIT_PATTERN) ?? [];
  if (unitHits.length < 6) {
    errors.push(`units: expected ≥6 unit tokens (mg, mL, kg, …); found ${unitHits.length}`);
  }

  for (const s of sections) {
    for (const cq of s.checkpointQuestions ?? []) {
      if (!cq.explanation?.trim()) {
        errors.push(`checkpoint ${cq.id}: missing explanation (rationale)`);
      }
    }
  }

  return errors;
}

export function lessonCorpusPlain(lesson: LessonContent): string {
  const chunks: string[] = [lesson.title, cellularPlain(lesson)];
  for (const k of ["riskFactors", "diagnostics", "management", "nursingActions", "pearls"] as const) {
    const arr = lesson[k];
    if (Array.isArray(arr)) chunks.push(...arr);
  }
  if (lesson.medications?.length) {
    for (const m of lesson.medications) {
      chunks.push("action" in m ? `${m.name} ${m.action}` : `${m.name} ${m.dose}`);
    }
  }
  if (lesson.quiz?.length) {
    for (const q of lesson.quiz) {
      if (!q) continue;
      chunks.push(q.question, ...(q.options ?? []), Array.isArray(q.rationale) ? q.rationale.join(" ") : q.rationale);
    }
  }
  return chunks.join("\n");
}

function cellularPlain(lesson: LessonContent): string {
  const c = lesson.cellular;
  if (typeof c === "string") return c;
  return `${c.title}\n${c.content}`;
}
