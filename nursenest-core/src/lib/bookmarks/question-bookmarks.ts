import {
  buildNotebookContextId,
  decodeNotebookBody,
  encodeNotebookBody,
  type NotebookSourceType,
} from "@/lib/learner/personal-study-notebook";

export const QUESTION_BOOKMARK_TAG = "question-bookmark";

export const QUESTION_BOOKMARK_CATEGORIES = [
  "review_later",
  "difficult",
  "exam_day_review",
  "need_more_practice",
  "favorite_questions",
] as const;

export type QuestionBookmarkCategory = (typeof QUESTION_BOOKMARK_CATEGORIES)[number];

export const QUESTION_BOOKMARK_CATEGORY_LABELS: Record<QuestionBookmarkCategory, string> = {
  review_later: "Review Later",
  difficult: "Difficult",
  exam_day_review: "Exam Day Review",
  need_more_practice: "Need More Practice",
  favorite_questions: "Favorite Questions",
};

export const QUESTION_BOOKMARK_SOURCE_TYPES = [
  "flashcard",
  "practice_question",
  "cat_exam",
  "ecg_question",
  "pharmacology_question",
  "clinical_skills_question",
] as const;

export type QuestionBookmarkSourceType = (typeof QUESTION_BOOKMARK_SOURCE_TYPES)[number];

export const QUESTION_BOOKMARK_SOURCE_LABELS: Record<QuestionBookmarkSourceType, string> = {
  flashcard: "Flashcards",
  practice_question: "Practice Questions",
  cat_exam: "CAT Exams",
  ecg_question: "ECG Questions",
  pharmacology_question: "Pharmacology Questions",
  clinical_skills_question: "Clinical Skills Questions",
};

export type QuestionBookmarkPayload = {
  sourceType: QuestionBookmarkSourceType;
  sourceId: string;
  title: string;
  topic?: string | null;
  difficulty?: string | null;
  sourceHref?: string | null;
  pathwayId?: string | null;
  category?: QuestionBookmarkCategory;
};

export type QuestionBookmarkRow = {
  id: string;
  sourceType: QuestionBookmarkSourceType;
  sourceId: string;
  title: string;
  topic: string | null;
  difficulty: string | null;
  category: QuestionBookmarkCategory;
  categoryLabel: string;
  sourceLabel: string;
  sourceHref: string | null;
  pathwayId: string | null;
  savedAt: string;
  updatedAt: string;
};

const NOTEBOOK_SOURCE_BY_QUESTION_SOURCE: Record<QuestionBookmarkSourceType, NotebookSourceType> = {
  flashcard: "flashcard",
  practice_question: "question",
  cat_exam: "cat_exam",
  ecg_question: "ecg",
  pharmacology_question: "pharmacology",
  clinical_skills_question: "clinical_skill",
};

function isQuestionBookmarkCategory(value: unknown): value is QuestionBookmarkCategory {
  return QUESTION_BOOKMARK_CATEGORIES.includes(value as QuestionBookmarkCategory);
}

function isQuestionBookmarkSourceType(value: unknown): value is QuestionBookmarkSourceType {
  return QUESTION_BOOKMARK_SOURCE_TYPES.includes(value as QuestionBookmarkSourceType);
}

export function normalizeQuestionBookmarkCategory(value: unknown): QuestionBookmarkCategory {
  return isQuestionBookmarkCategory(value) ? value : "review_later";
}

export function questionBookmarkNotebookSourceType(sourceType: QuestionBookmarkSourceType): NotebookSourceType {
  return NOTEBOOK_SOURCE_BY_QUESTION_SOURCE[sourceType];
}

export function buildQuestionBookmarkSourceId(sourceType: QuestionBookmarkSourceType, sourceId: string): string {
  return `${sourceType}:${sourceId}`.slice(0, 1_000);
}

export function buildQuestionBookmarkContextId(sourceType: QuestionBookmarkSourceType, sourceId: string): string {
  return buildNotebookContextId({
    category: "saved_questions",
    sourceType: questionBookmarkNotebookSourceType(sourceType),
    sourceId: buildQuestionBookmarkSourceId(sourceType, sourceId),
  });
}

export function encodeQuestionBookmarkBody(input: Required<Pick<QuestionBookmarkPayload, "sourceType" | "sourceId" | "title">> & {
  category: QuestionBookmarkCategory;
  topic?: string | null;
  difficulty?: string | null;
  sourceHref?: string | null;
  pathwayId?: string | null;
}): string {
  const sourceLabel = QUESTION_BOOKMARK_SOURCE_LABELS[input.sourceType];
  const categoryLabel = QUESTION_BOOKMARK_CATEGORY_LABELS[input.category];
  return encodeNotebookBody({
    category: "saved_questions",
    sourceType: questionBookmarkNotebookSourceType(input.sourceType),
    sourceTitle: input.title,
    sourceHref: input.sourceHref ?? null,
    system: input.topic ?? null,
    topic: input.topic ?? null,
    favorite: input.category === "favorite_questions",
    content: [
      `${categoryLabel} bookmark from ${sourceLabel}.`,
      input.topic ? `Topic: ${input.topic}` : null,
      input.difficulty ? `Difficulty: ${input.difficulty}` : null,
    ].filter(Boolean).join("\n"),
    tags: [
      QUESTION_BOOKMARK_TAG,
      input.category,
      input.sourceType,
      input.topic ?? "",
      input.difficulty ? `difficulty:${input.difficulty}` : "",
    ].filter(Boolean),
    createdByLabel: "Question Bookmark",
  });
}

export function decodeQuestionBookmarkBody(row: {
  id: string;
  contextId: string;
  title: string | null;
  body: string;
  topic: string | null;
  pathwayId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): QuestionBookmarkRow | null {
  const decoded = decodeNotebookBody(row.body, { contextId: row.contextId, topic: row.topic });
  if (!decoded.tags.includes(QUESTION_BOOKMARK_TAG)) return null;

  const sourceTag = decoded.tags.find(isQuestionBookmarkSourceType);
  const categoryTag = decoded.tags.find(isQuestionBookmarkCategory);
  const sourceType = sourceTag ?? inferQuestionBookmarkSourceType(row.contextId, decoded.sourceType);
  if (!sourceType) return null;

  const sourceId = extractQuestionBookmarkSourceId(row.contextId, sourceType);
  const category = normalizeQuestionBookmarkCategory(categoryTag);
  const difficulty = decoded.tags.find((tag) => tag.startsWith("difficulty:"))?.replace(/^difficulty:/, "") || null;

  return {
    id: row.id,
    sourceType,
    sourceId,
    title: row.title ?? decoded.sourceTitle ?? "Bookmarked question",
    topic: decoded.topic ?? row.topic,
    difficulty,
    category,
    categoryLabel: QUESTION_BOOKMARK_CATEGORY_LABELS[category],
    sourceLabel: QUESTION_BOOKMARK_SOURCE_LABELS[sourceType],
    sourceHref: decoded.sourceHref,
    pathwayId: row.pathwayId,
    savedAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function inferQuestionBookmarkSourceType(
  contextId: string,
  notebookSourceType: string | null,
): QuestionBookmarkSourceType | null {
  for (const sourceType of QUESTION_BOOKMARK_SOURCE_TYPES) {
    if (contextId.includes(sourceType)) return sourceType;
  }
  if (notebookSourceType === "question") return "practice_question";
  if (notebookSourceType === "ecg") return "ecg_question";
  if (notebookSourceType === "pharmacology") return "pharmacology_question";
  if (notebookSourceType === "clinical_skill") return "clinical_skills_question";
  if (notebookSourceType === "flashcard" || notebookSourceType === "cat_exam") return notebookSourceType;
  return null;
}

function extractQuestionBookmarkSourceId(contextId: string, sourceType: QuestionBookmarkSourceType): string {
  const needle = `${sourceType}:`;
  const index = contextId.indexOf(needle);
  if (index < 0) return contextId;
  return contextId.slice(index + needle.length);
}
