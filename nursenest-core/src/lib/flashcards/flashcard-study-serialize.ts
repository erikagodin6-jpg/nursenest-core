import { buildFlashcardExplanationFromSources } from "@/lib/content-quality/controlled-rationale-enrichment";
import { truncateForPreview } from "@/lib/flashcards/flashcard-access";
import { flashcardLessonCrossLinkForDeckStudyRow } from "@/lib/flashcards/flashcard-lesson-cross-link";
import { parseLessonLinkSourceKey } from "@/lib/flashcards/lesson-link-source-key";
import {
  correctAnswerLine,
  parseExamMicroQuestionFromDbFields,
  shuffleExamMicroQuestionOrder,
  type ExamMicroQuestionPayload,
  type SataQuestionPayload,
} from "@/lib/flashcards/flashcard-exam-style";
import {
  buildPayloadFromCanonical,
  fromDbRows,
  type CanonicalOption,
  type FlashcardOptionRow,
} from "@/lib/flashcards/flashcard-option-normalize";
import { applyFlashcardCardOverlay } from "@/lib/i18n/educational-content-overlay";
import type { FlashcardEducationalBundle } from "@/lib/i18n/educational-content-overlay";
import type { FlashcardItemKind, Prisma } from "@prisma/client";

/** Narrow DB select row for study serialization. */
export type FlashcardStudySelectRow = {
  id: string;
  front: string;
  back: string;
  lessonId?: string | null;
  sourceKey: string | null;
  examItemKind: FlashcardItemKind | null;
  questionStem: string | null;
  answerOptions: Prisma.JsonValue | null;
  correctAnswer: string | null;
  rationaleCorrect: string | null;
  rationaleIncorrect: Prisma.JsonValue | null;
  category: { name: string; topicCode: string | null };
  deck: { pathwayId: string | null; title?: string | null } | null;
  /** First HTTPS image from exam bank `images` JSON — render only when present (no placeholder). */
  clinicalImageUrl?: string | null;
  clinicalPearl?: string | null;
  keyTakeaway?: string | null;
  /** Canonical relational options (preferred over JSON fields when present). */
  canonicalOptions?: CanonicalOption[] | null;
  /** Raw Prisma relation rows; converted to canonicalOptions by the serializer. */
  options?: FlashcardOptionRow[] | null;
};

export type FlashcardStudyApiCard = {
  id: string;
  front: string;
  back: string;
  fullBackAvailable: boolean;
  topic: string;
  subtopic: string | null;
  sourceKey: string | null;
  pathwayId: string | null;
  explanation?: string;
  /** MCQ (single-correct) or SATA (multi-correct) payload. Omitted for plain term/definition cards. */
  examMicroQuestion?: ExamMicroQuestionPayload | SataQuestionPayload;
  /** Present on `lessonlink:v1|…` catalog-derived custom-session cards. */
  lessonLinkSectionKind?: string;
  lessonLinkCardType?: string;
  difficultyRating?: number;
  /** Resolved catalog pathway lesson (slug + title) — no duplicated bodies. */
  lessonStudyHref?: string;
  lessonStudyTitle?: string;
  /** Exam-bank clinical image — omit from JSON when absent so clients render no image chrome. */
  clinicalImageUrl?: string | null;
  /** Source of answer options: "canonical" = FlashcardOption rows; "json_fallback" = legacy JSON fields. */
  optionSource?: "canonical" | "json_fallback";
};

export { parseLessonLinkSourceKey } from "@/lib/flashcards/lesson-link-source-key";

/**
 * Resolve the best available exam payload for a card.
 * Prefers canonical FlashcardOption rows when present, falls back to JSON fields.
 */
function resolveExamPayload(
  card: FlashcardStudySelectRow,
  salt?: string | null,
): {
  payload: ExamMicroQuestionPayload | SataQuestionPayload | null;
  source: "canonical" | "json_fallback" | null;
} {
  // 1. Try canonical options
  const canonicalOptions =
    card.canonicalOptions ??
    (card.options && card.options.length > 0 ? fromDbRows(card.options) : null);

  if (canonicalOptions && canonicalOptions.length >= 3 && card.examItemKind && card.questionStem) {
    const canonical = buildPayloadFromCanonical(
      card.questionStem,
      card.rationaleCorrect ?? "",
      canonicalOptions,
      card.examItemKind,
    );
    if (canonical) {
      if (salt && canonical.itemKind !== "SATA" && "correctLetter" in canonical) {
        return { payload: shuffleExamMicroQuestionOrder(canonical, `${salt}:${card.id}`), source: "canonical" };
      }
      return { payload: canonical, source: "canonical" };
    }
  }
  // 2. Fall back to JSON fields
  const jsonPayload = parseExamMicroQuestionFromDbFields(card);
  if (jsonPayload) {
    const shuffled = salt ? shuffleExamMicroQuestionOrder(jsonPayload, `${salt}:${card.id}`) : jsonPayload;
    return { payload: shuffled, source: "json_fallback" };
  }
  return { payload: null, source: null };
}

function isExamBackedCard(card: FlashcardStudySelectRow): boolean {
  return Boolean(
    card.examItemKind ||
      card.questionStem?.trim() ||
      card.answerOptions != null ||
      card.correctAnswer?.trim() ||
      card.sourceKey?.startsWith("exam_q:"),
  );
}

function assertValidExamBackedPayload(
  card: FlashcardStudySelectRow,
  exam: ExamMicroQuestionPayload | SataQuestionPayload | null,
): void {
  if (!isExamBackedCard(card)) return;
  const stem = exam?.questionStem?.trim() || card.questionStem?.trim() || "";
  const optionCount = Array.isArray(exam?.answerOptions) ? exam.answerOptions.length : 0;
  if (stem.length >= 10 && optionCount >= 3) return;
  throw new Error(`flashcard_exam_payload_invalid:${card.id}`);
}

export function serializeFlashcardForDeckStudy(
  card: FlashcardStudySelectRow,
  opts: {
    educationalLocale: string;
    flashcardBundle: FlashcardEducationalBundle | undefined;
    fullBackAvailable: boolean;
    /** When set, shuffles MCQ option order deterministically for this study batch. */
    examOptionShuffleSalt?: string | null;
  },
): FlashcardStudyApiCard {
  const { payload: exam, source: optionSource } = resolveExamPayload(card, opts.examOptionShuffleSalt);
  assertValidExamBackedPayload(card, exam);
  const loc = applyFlashcardCardOverlay(
    { id: card.id, front: card.front, back: card.back },
    opts.educationalLocale,
    opts.flashcardBundle,
  );
  const isMcq = exam && "correctLetter" in exam;
  const front = exam ? exam.questionStem : loc.front;
  const rawBack = isMcq ? correctAnswerLine(exam as ExamMicroQuestionPayload) : loc.back;
  const back = opts.fullBackAvailable ? rawBack : truncateForPreview(rawBack);
  const explanation = exam
    ? undefined
    : loc.explanation ??
      buildFlashcardExplanationFromSources({
        front: loc.front,
        back: loc.back,
        topic: card.category.name,
        subtopic: card.category.topicCode,
      });
  const lessonLink = flashcardLessonCrossLinkForDeckStudyRow(card.deck?.pathwayId ?? null, card);
  return {
    id: card.id,
    front,
    back,
    fullBackAvailable: opts.fullBackAvailable,
    topic: card.category.name,
    subtopic: card.category.topicCode,
    sourceKey: card.sourceKey,
    pathwayId: card.deck?.pathwayId ?? null,
    ...(exam ? { examMicroQuestion: exam } : {}),
    ...(!exam && explanation ? { explanation } : {}),
    ...(optionSource ? { optionSource } : {}),
    ...(lessonLink ? { lessonStudyHref: lessonLink.lessonStudyHref, lessonStudyTitle: lessonLink.lessonStudyTitle } : {}),
  };
}

export function serializeFlashcardForCustomSession(
  card: FlashcardStudySelectRow,
  opts: {
    swapFrontBack: boolean;
    topic: string;
    pathwayId: string | null;
    /** Per-request salt so option positions vary each session while staying reproducible with a fixed salt. */
    examOptionShuffleSalt?: string | null;
    /** Custom sessions may study legacy/incomplete exam-backed rows as plain front/back flashcards. */
    allowInvalidExamBackedAsPlain?: boolean;
  },
): Omit<FlashcardStudyApiCard, "fullBackAvailable"> & { rawTopic: string } {
  const { payload: resolvedExam, source: resolvedOptionSource } = resolveExamPayload(card, opts.examOptionShuffleSalt);
  let exam = resolvedExam;
  let optionSource = resolvedOptionSource;
  try {
    assertValidExamBackedPayload(card, exam);
  } catch (err) {
    if (!opts.allowInvalidExamBackedAsPlain) throw err;
    exam = null;
    optionSource = null;
  }
  const isMcq = exam && "correctLetter" in exam;
  let front = opts.swapFrontBack ? card.back : card.front;
  let back = opts.swapFrontBack ? card.front : card.back;
  if (exam) {
    front = exam.questionStem;
    back = isMcq ? correctAnswerLine(exam as ExamMicroQuestionPayload) : exam.rationaleCorrect;
  }
  const authoredRecall =
    !exam && typeof card.rationaleCorrect === "string" && card.rationaleCorrect.trim().length >= 8
      ? card.rationaleCorrect.trim()
      : null;
  const examTeachingExtra = [card.clinicalPearl?.trim(), card.keyTakeaway?.trim()].filter(Boolean).join("\n\n");
  const explanation = exam
    ? examTeachingExtra || undefined
    : authoredRecall ??
      buildFlashcardExplanationFromSources({
        front,
        back,
        topic: opts.topic,
        subtopic: card.category.topicCode,
      });
  const link = parseLessonLinkSourceKey(card.sourceKey);
  const pid = card.deck?.pathwayId ?? opts.pathwayId;
  const lessonLink = flashcardLessonCrossLinkForDeckStudyRow(pid, card);
  const img = card.clinicalImageUrl?.trim();
  return {
    id: card.id,
    front,
    back,
    topic: opts.topic,
    subtopic: card.category.topicCode,
    rawTopic: card.category.name,
    sourceKey: card.sourceKey,
    pathwayId: pid,
    ...(exam ? { examMicroQuestion: exam } : {}),
    ...(explanation ? { explanation } : {}),
    ...(optionSource ? { optionSource } : {}),
    ...(img && img.startsWith("https://") ? { clinicalImageUrl: img } : {}),
    ...(link
      ? {
          lessonLinkSectionKind: link.sectionKind,
          lessonLinkCardType: link.cardType,
          difficultyRating: link.difficulty,
        }
      : {}),
    ...(lessonLink ? { lessonStudyHref: lessonLink.lessonStudyHref, lessonStudyTitle: lessonLink.lessonStudyTitle } : {}),
  };
}
