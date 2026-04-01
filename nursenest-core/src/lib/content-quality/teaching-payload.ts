import type { Prisma } from "@prisma/client";
import { stripToPlainText } from "@/lib/content-quality/plain-text";
import { matchConceptImage } from "@/lib/education-images/match-concept-image";
import { parseRationaleReferenceMedia, type RationaleReferenceMedia } from "@/lib/content-quality/rationale-media";

export type TeachingDistractorNotes = string | null;

export type NormalizedTeachingPayload = {
  correctAnswers: string[];
  rationale: string | null;
  correctAnswerExplanation: string | null;
  distractorNotes: TeachingDistractorNotes;
  conceptTested: string | null;
  examStrategy: string | null;
  keyTakeaway: string | null;
  clinicalReasoning: string | null;
  clinicalPearl: string | null;
  clinicalTrap: string | null;
  memoryHook: string | null;
  /** Ordered sections for subscriber review / SEO-rich rendering (no fabricated facts). */
  sections: Array<{ id: string; heading: string; body: string }>;
};

type ExamQuestionTeachingRow = {
  stem: string;
  questionType: string;
  rationale?: string | null;
  correctAnswerExplanation?: string | null;
  clinicalReasoning?: string | null;
  keyTakeaway?: string | null;
  clinicalPearl?: string | null;
  examStrategy?: string | null;
  memoryHook?: string | null;
  clinicalTrap?: string | null;
  distractorRationales?: Prisma.JsonValue | null;
  incorrectAnswerRationale?: Prisma.JsonValue | null;
  correctAnswer?: Prisma.JsonValue | null;
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
  tags?: string[] | null;
  images?: Prisma.JsonValue | null;
};

function stringifyDistractors(raw: Prisma.JsonValue | null | undefined): string | null {
  if (raw == null) return null;
  if (typeof raw === "string") return raw.trim() ? raw : null;
  if (Array.isArray(raw)) {
    const lines = raw
      .map((x) => {
        if (typeof x === "string") return x;
        if (x && typeof x === "object" && "label" in x && "text" in x) {
          return `${String((x as { label?: string }).label ?? "")}: ${String((x as { text?: string }).text ?? "")}`;
        }
        return "";
      })
      .filter(Boolean);
    return lines.length ? lines.join("\n") : null;
  }
  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const lines = Object.entries(o).map(([k, v]) => `${k}: ${String(v ?? "")}`);
    return lines.join("\n").trim() || null;
  }
  return null;
}

function incorrectAnswerLines(raw: Prisma.JsonValue | null | undefined): string | null {
  const d = stringifyDistractors(raw);
  return d;
}

function normalizeCorrectList(correctAnswer: Prisma.JsonValue | null | undefined, questionType: string): string[] {
  if (correctAnswer == null) return [];
  if (Array.isArray(correctAnswer)) return correctAnswer.map((x) => String(x));
  if (typeof correctAnswer === "string") return [correctAnswer];
  return [String(correctAnswer)];
}

function deriveConceptTested(row: ExamQuestionTeachingRow): string | null {
  const parts = [row.topic, row.subtopic].filter((x): x is string => Boolean(x && String(x).trim()));
  if (parts.length) return parts.join(" · ");
  const stem = stripToPlainText(row.stem);
  const first = stem.split(/(?<=[.!?])\s+/)[0]?.trim();
  if (first && first.length >= 12 && first.length < 180) return first;
  return null;
}

function pushSection(
  out: Array<{ id: string; heading: string; body: string }>,
  id: string,
  heading: string,
  body: string | null | undefined,
) {
  const t = stripToPlainText(body);
  if (t.length < 2) return;
  out.push({ id, heading, body: t });
}

/**
 * Build a consistent teaching payload for review surfaces (question bank, post-CAT, SEO-capable blocks).
 * Omits empty sections; does not invent clinical content.
 */
export function buildNormalizedTeachingPayload(row: ExamQuestionTeachingRow): NormalizedTeachingPayload {
  const correctAnswers = normalizeCorrectList(row.correctAnswer, row.questionType);
  const rationale = row.rationale?.trim() ? row.rationale.trim() : null;
  const correctAnswerExplanation = row.correctAnswerExplanation?.trim() ? row.correctAnswerExplanation.trim() : null;
  const distractorFromJson = stringifyDistractors(row.distractorRationales);
  const incorrectLines = incorrectAnswerLines(row.incorrectAnswerRationale);
  const distractorNotes =
    [distractorFromJson, incorrectLines].filter(Boolean).join("\n\n").trim() || null;

  const conceptTested = deriveConceptTested(row);

  const sections: Array<{ id: string; heading: string; body: string }> = [];

  pushSection(sections, "why_correct", "Why this is the best answer", correctAnswerExplanation);
  pushSection(sections, "explanation", "Explanation", rationale);
  pushSection(sections, "clinical_reasoning", "Clinical reasoning", row.clinicalReasoning);
  pushSection(sections, "distractors", "Why other options fail", distractorNotes);
  pushSection(sections, "concept", "Concept tested", conceptTested);
  pushSection(sections, "exam_strategy", "Exam strategy", row.examStrategy);
  pushSection(sections, "takeaway", "High-yield takeaway", row.keyTakeaway);
  pushSection(sections, "pearl", "Clinical pearl", row.clinicalPearl);
  pushSection(sections, "trap", "Common trap", row.clinicalTrap);
  pushSection(sections, "memory_hook", "Memory hook", row.memoryHook);

  const dedup: typeof sections = [];
  const seen = new Set<string>();
  for (const s of sections) {
    const key = `${s.heading}:${s.body.slice(0, 120)}`;
    if (seen.has(key)) continue;
    const dupBody = dedup.some((d) => d.body === s.body && d.body.length > 40);
    if (dupBody) continue;
    seen.add(key);
    dedup.push(s);
  }

  return {
    correctAnswers,
    rationale,
    correctAnswerExplanation,
    distractorNotes,
    conceptTested,
    examStrategy: row.examStrategy?.trim() ? row.examStrategy.trim() : null,
    keyTakeaway: row.keyTakeaway?.trim() ? row.keyTakeaway.trim() : null,
    clinicalReasoning: row.clinicalReasoning?.trim() ? row.clinicalReasoning.trim() : null,
    clinicalPearl: row.clinicalPearl?.trim() ? row.clinicalPearl.trim() : null,
    clinicalTrap: row.clinicalTrap?.trim() ? row.clinicalTrap.trim() : null,
    memoryHook: row.memoryHook?.trim() ? row.memoryHook.trim() : null,
    sections: dedup,
  };
}

export type TeachingMediaBundle = {
  /** From `exam_questions.images` JSON (authoritative when present). */
  referenceMedia: RationaleReferenceMedia[];
  /** Filename-matched CDN image when inventory aligns with metadata. */
  matchedConceptImage: { url: string; alt: string; objectKey: string } | null;
};

export function buildTeachingMediaBundle(row: ExamQuestionTeachingRow): TeachingMediaBundle {
  const referenceMedia = parseRationaleReferenceMedia(row.images);
  const stemSnippet = stripToPlainText(row.stem).slice(0, 280);
  const matched = matchConceptImage({
    topic: row.topic,
    subtopic: row.subtopic,
    bodySystem: row.bodySystem,
    tags: row.tags ?? null,
    stemSnippet,
  });
  const matchedConceptImage =
    matched.url && matched.objectKey
      ? { url: matched.url, alt: matched.alt, objectKey: matched.objectKey }
      : null;
  return { referenceMedia, matchedConceptImage };
}
