export const PERSONAL_STUDY_NOTEBOOK_MARKER = "__nursenestNotebook";
export const PERSONAL_STUDY_NOTEBOOK_VERSION = 1;
export const PERSONAL_STUDY_NOTEBOOK_CONTEXT_PREFIX = "nb:";

export const NOTEBOOK_CATEGORIES = [
  "notes",
  "saved_questions",
  "saved_pearls",
  "saved_memory_hooks",
  "saved_rationales",
  "ecg_notes",
  "lab_notes",
  "pharmacology_notes",
] as const;

export type NotebookCategory = (typeof NOTEBOOK_CATEGORIES)[number];

export const NOTEBOOK_SOURCE_TYPES = [
  "flashcard",
  "question",
  "cat_exam",
  "ecg",
  "pharmacology",
  "clinical_skill",
  "lesson",
  "simulation",
  "lab",
] as const;

export type NotebookSourceType = (typeof NOTEBOOK_SOURCE_TYPES)[number];

export type NotebookBody = {
  [PERSONAL_STUDY_NOTEBOOK_MARKER]: typeof PERSONAL_STUDY_NOTEBOOK_VERSION;
  category: NotebookCategory;
  sourceType: NotebookSourceType;
  content: string;
  sourceTitle?: string | null;
  sourceHref?: string | null;
  system?: string | null;
  topic?: string | null;
  tags?: string[];
  favorite?: boolean;
  createdByLabel?: string | null;
};

export type NotebookDecodedBody = {
  isNotebookEntry: boolean;
  category: NotebookCategory;
  sourceType: NotebookSourceType | null;
  content: string;
  sourceTitle: string | null;
  sourceHref: string | null;
  system: string | null;
  topic: string | null;
  tags: string[];
  favorite: boolean;
};

export const NOTEBOOK_CATEGORY_LABELS: Record<NotebookCategory, string> = {
  notes: "Notes",
  saved_questions: "Saved Questions",
  saved_pearls: "Saved Pearls",
  saved_memory_hooks: "Saved Memory Hooks",
  saved_rationales: "Saved Rationales",
  ecg_notes: "ECG Notes",
  lab_notes: "Lab Notes",
  pharmacology_notes: "Pharmacology Notes",
};

export const NOTEBOOK_SOURCE_LABELS: Record<NotebookSourceType, string> = {
  flashcard: "Flashcards",
  question: "Practice Questions",
  cat_exam: "CAT Exams",
  ecg: "ECG",
  pharmacology: "Pharmacology",
  clinical_skill: "Clinical Skills",
  lesson: "Lessons",
  simulation: "Simulations",
  lab: "Labs",
};

export function isNotebookContextId(contextId: string | null | undefined): boolean {
  return String(contextId ?? "").startsWith(PERSONAL_STUDY_NOTEBOOK_CONTEXT_PREFIX);
}

export function normalizeNotebookTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const value of tags) {
    const tag = String(value ?? "").trim().replace(/\s+/g, " ");
    if (!tag || seen.has(tag.toLowerCase())) continue;
    seen.add(tag.toLowerCase());
    normalized.push(tag.slice(0, 40));
  }
  return normalized.slice(0, 12);
}

export function encodeNotebookBody(input: Omit<NotebookBody, typeof PERSONAL_STUDY_NOTEBOOK_MARKER>): string {
  return JSON.stringify({
    [PERSONAL_STUDY_NOTEBOOK_MARKER]: PERSONAL_STUDY_NOTEBOOK_VERSION,
    ...input,
    content: input.content.slice(0, 60_000),
    tags: normalizeNotebookTags(input.tags),
    favorite: Boolean(input.favorite),
  });
}

export function decodeNotebookBody(body: string, fallback?: { contextId?: string | null; scope?: string | null; topic?: string | null }): NotebookDecodedBody {
  const raw = String(body ?? "");
  try {
    const parsed = JSON.parse(raw) as Partial<NotebookBody>;
    if (parsed?.[PERSONAL_STUDY_NOTEBOOK_MARKER] === PERSONAL_STUDY_NOTEBOOK_VERSION && typeof parsed.content === "string") {
      return {
        isNotebookEntry: true,
        category: isNotebookCategory(parsed.category) ? parsed.category : inferNotebookCategory(fallback?.contextId, fallback?.scope),
        sourceType: isNotebookSourceType(parsed.sourceType) ? parsed.sourceType : null,
        content: parsed.content,
        sourceTitle: typeof parsed.sourceTitle === "string" ? parsed.sourceTitle : null,
        sourceHref: typeof parsed.sourceHref === "string" ? parsed.sourceHref : null,
        system: typeof parsed.system === "string" ? parsed.system : null,
        topic: typeof parsed.topic === "string" ? parsed.topic : fallback?.topic ?? null,
        tags: normalizeNotebookTags(parsed.tags),
        favorite: Boolean(parsed.favorite),
      };
    }
  } catch {
    // Plain legacy learner notes remain valid notebook entries.
  }

  return {
    isNotebookEntry: false,
    category: inferNotebookCategory(fallback?.contextId, fallback?.scope),
    sourceType: null,
    content: raw,
    sourceTitle: null,
    sourceHref: null,
    system: null,
    topic: fallback?.topic ?? null,
    tags: [],
    favorite: false,
  };
}

export function inferNotebookCategory(contextId: string | null | undefined, scope: string | null | undefined): NotebookCategory {
  const context = String(contextId ?? "");
  if (context.startsWith("rationale:")) return "saved_rationales";
  if (context.includes(":pearl:")) return "saved_pearls";
  if (context.includes(":memory_hook:")) return "saved_memory_hooks";
  if (context.includes(":question:")) return "saved_questions";
  if (context.startsWith("nb:ecg_notes")) return "ecg_notes";
  if (context.startsWith("nb:lab_notes")) return "lab_notes";
  if (context.startsWith("nb:pharmacology_notes")) return "pharmacology_notes";
  if (scope === "QUESTION_BANK") return "saved_questions";
  return "notes";
}

export function notebookScopeForSource(sourceType: NotebookSourceType, category: NotebookCategory): string {
  if (category === "saved_questions" || category === "saved_rationales" || sourceType === "question") return "QUESTION_BANK";
  if (sourceType === "cat_exam") return "PRACTICE_TEST";
  if (sourceType === "flashcard") return "FLASHCARD_DECK";
  if (sourceType === "lesson") return "CONTENT_LESSON";
  return "PATHWAY_LESSON";
}

export function buildNotebookContextId(input: {
  category: NotebookCategory;
  sourceType: NotebookSourceType;
  sourceId: string;
}): string {
  const sourceId = sanitizeContextSegment(input.sourceId || "item");
  const base = `${PERSONAL_STUDY_NOTEBOOK_CONTEXT_PREFIX}${input.category}:${input.sourceType}:`;
  const maxSourceLength = Math.max(8, 128 - base.length - 9);
  const trimmed = sourceId.length > maxSourceLength ? `${sourceId.slice(0, maxSourceLength)}:${shortHash(sourceId)}` : sourceId;
  return `${base}${trimmed}`.slice(0, 128);
}

export function notebookCategoryLabel(category: NotebookCategory): string {
  return NOTEBOOK_CATEGORY_LABELS[category] ?? "Notes";
}

export function notebookSourceLabel(sourceType: NotebookSourceType | null): string {
  return sourceType ? NOTEBOOK_SOURCE_LABELS[sourceType] : "Study";
}

function isNotebookCategory(value: unknown): value is NotebookCategory {
  return NOTEBOOK_CATEGORIES.includes(value as NotebookCategory);
}

function isNotebookSourceType(value: unknown): value is NotebookSourceType {
  return NOTEBOOK_SOURCE_TYPES.includes(value as NotebookSourceType);
}

function sanitizeContextSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9:_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96) || "item";
}

function shortHash(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36).slice(0, 8);
}
