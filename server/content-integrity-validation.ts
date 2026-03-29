import {
  validateContentLanguage,
  checkTerminologyConsistency,
  checkPublishingGate,
  type LanguageValidationReport,
} from "./language-enforcement";
import { pool } from "./storage";

export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
  autoFixSuggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  autoRepairs?: AutoRepairAction[];
  languageValidation?: LanguageValidationReport;
}

export interface AutoRepairAction {
  field: string;
  action: string;
  beforeValue: any;
  afterValue: any;
}

const NGN_QUESTION_TYPES = [
  "DRAG_DROP_CLOZE", "DRAG_DROP_RATIONALE", "DROPDOWN_CLOZE", "DROPDOWN_RATIONALE",
  "DROPDOWN_TABLE", "MATRIX_SINGLE", "MATRIX_MULTI", "MULTI_RESPONSE_GROUPING",
  "TREND", "HIGHLIGHT_TEXT", "BOWTIE", "CASE_STUDY_SERIES", "LAB_INTERPRETATION",
  "IMAGE_HOTSPOT", "CALCULATION_NUMERIC", "MATCHING_GRID",
];

const NGN_REQUIRED_FIELDS: Record<string, string[]> = {
  DRAG_DROP_CLOZE: ["textTemplate", "draggableOptions", "blanks"],
  DRAG_DROP_RATIONALE: ["baseSentenceTemplate", "draggableCauses", "draggableEffects", "effectsCount"],
  DROPDOWN_CLOZE: ["paragraphs", "dropdowns"],
  DROPDOWN_RATIONALE: ["sentenceTemplate", "causeOptions", "effectOptions", "effectsCount"],
  DROPDOWN_TABLE: ["columns", "rows"],
  MATRIX_SINGLE: ["columns", "rows"],
  MATRIX_MULTI: ["columns", "rows", "selectionRule"],
  MULTI_RESPONSE_GROUPING: ["groups"],
  TREND: ["timepoints", "embeddedItem"],
  HIGHLIGHT_TEXT: ["passage", "highlightSpans", "maxSelections"],
  BOWTIE: ["conditionOptions", "actionOptions", "monitorOptions", "slots"],
  CASE_STUDY_SERIES: ["patientSummary", "tabs", "subQuestions"],
  LAB_INTERPRETATION: ["panelName", "labValues", "embeddedQuestion"],
  IMAGE_HOTSPOT: ["imageUrl", "regions", "maxSelections"],
  CALCULATION_NUMERIC: ["problemStatement", "expectedAnswer", "tolerance", "unit"],
  MATCHING_GRID: ["columnA", "columnB"],
};

const KNOWN_CONTENT_BLOCK_TYPES = new Set([
  "heading", "paragraph", "bulletList", "list", "numberedList", "numbered-list",
  "callout", "clinical-pearl", "clinicalPearl", "table", "image", "divider",
  "quiz", "quizEmbed", "medication", "warning", "quiz-question", "references",
]);

const BLOCK_REQUIRED_FIELDS: Record<string, string[]> = {
  heading: [],
  paragraph: [],
  bulletList: [],
  list: [],
  numberedList: [],
  "numbered-list": [],
  callout: [],
  "clinical-pearl": [],
  clinicalPearl: [],
  table: [],
  image: ["url"],
  divider: [],
  quiz: [],
  quizEmbed: [],
  medication: [],
  warning: [],
  "quiz-question": [],
  references: [],
};

const BOILERPLATE_PATTERNS = [
  /is a clinical topic requiring comprehensive nursing knowledge/i,
  /requires comprehensive nursing knowledge and understanding/i,
  /is an important clinical topic that nursing students/i,
  /\[Topic\] is a/i,
  /\[Insert .+? here\]/i,
  /Lorem ipsum/i,
  /TODO:?\s/i,
  /placeholder text/i,
  /sample question about/i,
];

function detectBoilerplateContent(data: any): ValidationError[] {
  const errors: ValidationError[] = [];
  const fieldsToCheck: { key: string; value: string }[] = [];

  if (data.stem && typeof data.stem === "string") fieldsToCheck.push({ key: "stem", value: data.stem });
  if (data.rationale && typeof data.rationale === "string") fieldsToCheck.push({ key: "rationale", value: data.rationale });

  for (const field of fieldsToCheck) {
    for (const pattern of BOILERPLATE_PATTERNS) {
      if (pattern.test(field.value)) {
        errors.push({
          field: field.key,
          message: `Boilerplate/template text detected in ${field.key}: matches pattern "${pattern.source}"`,
          severity: "error",
        });
        break;
      }
    }
  }

  if (data.stem && typeof data.stem === "string" && data.rationale && typeof data.rationale === "string") {
    const stemWords = new Set(data.stem.toLowerCase().split(/\s+/).filter((w: string) => w.length > 4));
    const rationaleWords = data.rationale.toLowerCase().split(/\s+/).filter((w: string) => w.length > 4);
    if (stemWords.size > 5 && rationaleWords.length > 5) {
      const overlap = rationaleWords.filter((w: string) => stemWords.has(w)).length;
      const overlapRatio = overlap / rationaleWords.length;
      if (overlapRatio > 0.8) {
        errors.push({
          field: "rationale",
          message: "Rationale appears to be a near-duplicate of the stem (>80% word overlap), likely formulaic content",
          severity: "error",
        });
      }
    }
  }

  return errors;
}

export function validateQuestion(data: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!data.stem || typeof data.stem !== "string" || data.stem.trim().length < 10) {
    errors.push({ field: "stem", message: "Question stem is required and must be at least 10 characters", severity: "error" });
  }

  const options = Array.isArray(data.options) ? data.options : [];
  if (options.length < 4) {
    errors.push({ field: "options", message: `At least 4 answer options are required (found ${options.length})`, severity: "error" });
  }

  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    const text = typeof opt === "string" ? opt : opt?.text;
    if (!text || text.trim().length === 0) {
      errors.push({ field: `options[${i}]`, message: `Option ${String.fromCharCode(65 + i)} is empty`, severity: "error" });
    }
  }

  if (data.correctAnswer === undefined || data.correctAnswer === null ||
      (Array.isArray(data.correctAnswer) && data.correctAnswer.length === 0)) {
    errors.push({ field: "correctAnswer", message: "Correct answer must be specified", severity: "error" });
  }

  if (!data.tier) {
    errors.push({ field: "tier", message: "Tier is required", severity: "error" });
  }

  if (!data.rationale || (typeof data.rationale === "string" && data.rationale.trim().length < 20)) {
    errors.push({ field: "rationale", message: "Rationale is required for publishing (min 20 characters)", severity: "error", autoFixSuggestion: "ai_generate_rationale" });
  }

  if (!data.isAdaptiveEligible) {
    if (!data.correctAnswerExplanation || (typeof data.correctAnswerExplanation === "string" && data.correctAnswerExplanation.trim().length === 0)) {
      warnings.push({ field: "correctAnswerExplanation", message: "Correct answer explanation is missing", severity: "warning", autoFixSuggestion: "ai_generate_rationale" });
    }

    if (!data.distractorRationales || (typeof data.distractorRationales === "object" && Object.keys(data.distractorRationales).length === 0)) {
      warnings.push({ field: "distractorRationales", message: "Distractor rationales are missing", severity: "warning", autoFixSuggestion: "ai_generate_rationale" });
    }

    if (!data.clinicalPearl || (typeof data.clinicalPearl === "string" && data.clinicalPearl.trim().length === 0)) {
      warnings.push({ field: "clinicalPearl", message: "Clinical pearl is missing", severity: "warning", autoFixSuggestion: "ai_generate_rationale" });
    }
  }

  if (!data.bodySystem) {
    errors.push({ field: "bodySystem", message: "Body system is required for publishing", severity: "error", autoFixSuggestion: "ai_infer_metadata" });
  }

  if (!data.topic) {
    errors.push({ field: "topic", message: "Topic is required for publishing", severity: "error", autoFixSuggestion: "ai_infer_metadata" });
  }

  if (!data.tags || (Array.isArray(data.tags) && data.tags.length === 0)) {
    errors.push({ field: "tags", message: "At least one tag is required for publishing", severity: "error", autoFixSuggestion: "ai_infer_metadata" });
  }

  const boilerplateErrors = detectBoilerplateContent(data);
  errors.push(...boilerplateErrors);

  const ngnErrors = validateNGNPayload(data);
  errors.push(...ngnErrors.filter(e => e.severity === "error"));
  warnings.push(...ngnErrors.filter(e => e.severity === "warning"));

  const langErrors = detectMixedLanguage(data, "question");
  warnings.push(...langErrors);

  return { valid: errors.length === 0, errors, warnings };
}

export function validateNGNPayload(data: any): ValidationError[] {
  const errors: ValidationError[] = [];
  const questionType = data.questionType || data.question_type;
  if (!questionType || !NGN_QUESTION_TYPES.includes(questionType)) {
    return errors;
  }

  const payload = data.ngnPayload || data.ngn_payload || data.exhibitData || data.exhibit_data;
  if (!payload || (typeof payload === "object" && Object.keys(payload).length === 0)) {
    errors.push({
      field: "ngnPayload",
      message: `NGN question type "${questionType}" requires a payload object with the expected structure`,
      severity: "error",
    });
    return errors;
  }

  const requiredFields = NGN_REQUIRED_FIELDS[questionType];
  if (requiredFields) {
    for (const field of requiredFields) {
      if (payload[field] === undefined || payload[field] === null) {
        errors.push({
          field: `ngnPayload.${field}`,
          message: `NGN "${questionType}" payload is missing required field "${field}"`,
          severity: "error",
        });
      }
    }
  }

  if (questionType === "BOWTIE") {
    if (payload.conditionOptions && !Array.isArray(payload.conditionOptions)) {
      errors.push({ field: "ngnPayload.conditionOptions", message: "BOWTIE conditionOptions must be an array", severity: "error" });
    }
    if (payload.actionOptions && !Array.isArray(payload.actionOptions)) {
      errors.push({ field: "ngnPayload.actionOptions", message: "BOWTIE actionOptions must be an array", severity: "error" });
    }
    if (payload.monitorOptions && !Array.isArray(payload.monitorOptions)) {
      errors.push({ field: "ngnPayload.monitorOptions", message: "BOWTIE monitorOptions must be an array", severity: "error" });
    }
  }

  if (questionType === "CASE_STUDY_SERIES") {
    if (payload.tabs && !Array.isArray(payload.tabs)) {
      errors.push({ field: "ngnPayload.tabs", message: "CASE_STUDY_SERIES tabs must be an array", severity: "error" });
    } else if (payload.tabs && payload.tabs.length === 0) {
      errors.push({ field: "ngnPayload.tabs", message: "CASE_STUDY_SERIES must have at least one tab", severity: "error" });
    }
    if (payload.subQuestions && !Array.isArray(payload.subQuestions)) {
      errors.push({ field: "ngnPayload.subQuestions", message: "CASE_STUDY_SERIES subQuestions must be an array", severity: "error" });
    } else if (payload.subQuestions && payload.subQuestions.length === 0) {
      errors.push({ field: "ngnPayload.subQuestions", message: "CASE_STUDY_SERIES must have at least one subQuestion", severity: "error" });
    }
  }

  if (questionType === "MATRIX_SINGLE" || questionType === "MATRIX_MULTI") {
    if (payload.columns && Array.isArray(payload.columns) && payload.columns.length < 2) {
      errors.push({ field: "ngnPayload.columns", message: `${questionType} must have at least 2 columns`, severity: "error" });
    }
    if (payload.rows && Array.isArray(payload.rows) && payload.rows.length < 2) {
      errors.push({ field: "ngnPayload.rows", message: `${questionType} must have at least 2 rows`, severity: "error" });
    }
  }

  if (questionType === "HIGHLIGHT_TEXT") {
    if (payload.passage && typeof payload.passage === "string" && payload.passage.trim().length < 20) {
      errors.push({ field: "ngnPayload.passage", message: "HIGHLIGHT_TEXT passage is too short (min 20 characters)", severity: "error" });
    }
    if (payload.highlightSpans && Array.isArray(payload.highlightSpans) && payload.highlightSpans.length === 0) {
      errors.push({ field: "ngnPayload.highlightSpans", message: "HIGHLIGHT_TEXT must have at least one highlight span", severity: "error" });
    }
  }

  if (questionType === "IMAGE_HOTSPOT") {
    if (payload.regions && Array.isArray(payload.regions) && payload.regions.length === 0) {
      errors.push({ field: "ngnPayload.regions", message: "IMAGE_HOTSPOT must have at least one region", severity: "error" });
    }
  }

  return errors;
}

export function validateContentBlocks(blocks: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!blocks) return errors;

  let parsedBlocks: any[];
  if (typeof blocks === "string") {
    try {
      parsedBlocks = JSON.parse(blocks);
    } catch {
      errors.push({ field: "content", message: "Content blocks JSON is malformed", severity: "error" });
      return errors;
    }
  } else if (Array.isArray(blocks)) {
    parsedBlocks = blocks;
  } else {
    return errors;
  }

  for (let i = 0; i < parsedBlocks.length; i++) {
    const block = parsedBlocks[i];
    if (!block || typeof block !== "object") {
      errors.push({ field: `content[${i}]`, message: `Content block at index ${i} is not a valid object`, severity: "error" });
      continue;
    }

    if (!block.type) {
      errors.push({ field: `content[${i}].type`, message: `Content block at index ${i} is missing a "type" field`, severity: "error" });
      continue;
    }

    if (!KNOWN_CONTENT_BLOCK_TYPES.has(block.type)) {
      errors.push({
        field: `content[${i}].type`,
        message: `Unknown content block type "${block.type}" at index ${i} cannot be rendered. Known types: ${Array.from(KNOWN_CONTENT_BLOCK_TYPES).join(", ")}`,
        severity: "error",
      });
    }

    const requiredFields = BLOCK_REQUIRED_FIELDS[block.type];
    if (requiredFields) {
      for (const field of requiredFields) {
        if (block[field] === undefined || block[field] === null || block[field] === "") {
          errors.push({
            field: `content[${i}].${field}`,
            message: `Content block "${block.type}" at index ${i} is missing required field "${field}"`,
            severity: "error",
          });
        }
      }
    }
  }

  return errors;
}

function hasExtendedLatinChars(text: string): boolean {
  return /[àâäéèêëïîôùûüÿçœæÀÂÄÉÈÊËÏÎÔÙÛÜŸÇŒÆ]/.test(text);
}

function hasCJKChars(text: string): boolean {
  return /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(text);
}

function hasCyrillicChars(text: string): boolean {
  return /[\u0400-\u04ff]/.test(text);
}

function hasArabicChars(text: string): boolean {
  return /[\u0600-\u06ff]/.test(text);
}

function detectScriptType(text: string): string {
  if (!text || text.trim().length === 0) return "empty";
  if (hasCJKChars(text)) return "cjk";
  if (hasCyrillicChars(text)) return "cyrillic";
  if (hasArabicChars(text)) return "arabic";
  if (hasExtendedLatinChars(text)) return "latin-extended";
  return "latin";
}

export function detectMixedLanguage(data: any, contentType: string): ValidationError[] {
  const warnings: ValidationError[] = [];

  const fieldsToCheck: { key: string; value: string }[] = [];

  if (contentType === "question") {
    if (data.stem) fieldsToCheck.push({ key: "stem", value: data.stem });
    const options = Array.isArray(data.options) ? data.options : [];
    for (let i = 0; i < options.length; i++) {
      const text = typeof options[i] === "string" ? options[i] : options[i]?.text;
      if (text) fieldsToCheck.push({ key: `options[${i}]`, value: text });
    }
    if (data.rationale) fieldsToCheck.push({ key: "rationale", value: data.rationale });
  } else if (contentType === "flashcard") {
    if (data.front) fieldsToCheck.push({ key: "front", value: data.front });
    if (data.back) fieldsToCheck.push({ key: "back", value: data.back });
  } else if (contentType === "lesson" || contentType === "blog") {
    if (data.title) fieldsToCheck.push({ key: "title", value: data.title });
    if (data.summary) fieldsToCheck.push({ key: "summary", value: data.summary });
    if (data.seoTitle) fieldsToCheck.push({ key: "seoTitle", value: data.seoTitle });
    if (data.seoDescription) fieldsToCheck.push({ key: "seoDescription", value: data.seoDescription });
  }

  if (fieldsToCheck.length < 2) return warnings;

  const scripts = fieldsToCheck
    .filter(f => f.value && f.value.trim().length > 5)
    .map(f => ({ ...f, script: detectScriptType(f.value) }))
    .filter(f => f.script !== "empty");

  if (scripts.length < 2) return warnings;

  const uniqueScripts = new Set(scripts.map(s => s.script));
  if (uniqueScripts.size > 1) {
    const scriptDetails = scripts.map(s => `${s.key}=${s.script}`).join(", ");
    warnings.push({
      field: "language",
      message: `Mixed language/script detected across fields: ${scriptDetails}. Content should be consistently in one language.`,
      severity: "warning",
    });
  }

  return warnings;
}

export function validateFlashcard(data: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!data.front || typeof data.front !== "string" || data.front.trim().length < 3) {
    errors.push({ field: "front", message: "Front of flashcard is required (min 3 characters)", severity: "error" });
  }

  if (!data.back || typeof data.back !== "string" || data.back.trim().length < 3) {
    errors.push({ field: "back", message: "Back of flashcard is required (min 3 characters)", severity: "error" });
  }

  if (!data.deckId) {
    warnings.push({ field: "deckId", message: "Flashcard is not assigned to a deck", severity: "warning" });
  }

  if (!data.tags || (Array.isArray(data.tags) && data.tags.length === 0)) {
    warnings.push({ field: "tags", message: "No tags assigned", severity: "warning", autoFixSuggestion: "ai_infer_metadata" });
  }

  const langErrors = detectMixedLanguage(data, "flashcard");
  warnings.push(...langErrors);

  return { valid: errors.length === 0, errors, warnings };
}

export function validateLesson(data: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!data.title || typeof data.title !== "string" || data.title.trim().length < 3) {
    errors.push({ field: "title", message: "Lesson title is required (min 3 characters)", severity: "error" });
  }

  if (!data.slug || typeof data.slug !== "string" || data.slug.trim().length < 2) {
    errors.push({ field: "slug", message: "Lesson slug is required", severity: "error" });
  }

  if (!data.seoTitle) {
    warnings.push({ field: "seoTitle", message: "SEO title is missing", severity: "warning", autoFixSuggestion: "ai_generate_seo" });
  }

  if (!data.seoDescription) {
    warnings.push({ field: "seoDescription", message: "SEO description is missing", severity: "warning", autoFixSuggestion: "ai_generate_seo" });
  }

  if (!data.tier) {
    warnings.push({ field: "tier", message: "Tier is not set", severity: "warning" });
  }

  const hasSubstantiveContent = data.definition || data.pathophysiology ||
    (Array.isArray(data.signsSymptoms) && data.signsSymptoms.length > 0) ||
    (Array.isArray(data.treatment) && data.treatment.length > 0) ||
    (Array.isArray(data.nursingInterventions) && data.nursingInterventions.length > 0);
  if (!hasSubstantiveContent) {
    warnings.push({ field: "content", message: "Lesson has no substantive content sections filled", severity: "warning" });
  }

  if (data.content) {
    const blockErrors = validateContentBlocks(data.content);
    errors.push(...blockErrors.filter(e => e.severity === "error"));
    warnings.push(...blockErrors.filter(e => e.severity === "warning"));
  }

  const langErrors = detectMixedLanguage(data, "lesson");
  warnings.push(...langErrors);

  return { valid: errors.length === 0, errors, warnings };
}

export function validateBlogPost(data: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!data.title || typeof data.title !== "string" || data.title.trim().length < 5) {
    errors.push({ field: "title", message: "Title is required (min 5 characters)", severity: "error" });
  }

  if (!data.slug || typeof data.slug !== "string") {
    errors.push({ field: "slug", message: "Slug is required", severity: "error" });
  }

  if (!data.content) {
    errors.push({ field: "content", message: "Content is required", severity: "error" });
  }

  if (!data.metaTitle) {
    warnings.push({ field: "metaTitle", message: "Meta title is missing", severity: "warning", autoFixSuggestion: "ai_generate_seo" });
  }

  if (!data.metaDescription) {
    warnings.push({ field: "metaDescription", message: "Meta description is missing", severity: "warning", autoFixSuggestion: "ai_generate_seo" });
  }

  if (data.content) {
    const blockErrors = validateContentBlocks(data.content);
    errors.push(...blockErrors.filter(e => e.severity === "error"));
    warnings.push(...blockErrors.filter(e => e.severity === "warning"));
  }

  const langErrors = detectMixedLanguage(data, "blog");
  warnings.push(...langErrors);

  return { valid: errors.length === 0, errors, warnings };
}

export function validateZeroValidItems(contentType: string, data: any): ValidationError | null {
  if (contentType === "question" || contentType === "questions" || contentType === "exam_question") {
    const options = Array.isArray(data.options) ? data.options : [];
    const validOptions = options.filter((opt: any) => {
      const text = typeof opt === "string" ? opt : opt?.text;
      return text && text.trim().length > 0;
    });
    if (validOptions.length === 0 && (!data.stem || data.stem.trim().length === 0)) {
      return { field: "content", message: "Content item has zero valid questions/items and cannot be published", severity: "error" };
    }
  }

  if (contentType === "flashcard-set" || contentType === "flashcard-deck") {
    if (!data.cards || !Array.isArray(data.cards) || data.cards.length === 0) {
      return { field: "cards", message: "Flashcard set has zero cards and cannot be published", severity: "error" };
    }
  }

  if (contentType === "flashcard" || contentType === "flashcards") {
    if (data.cards !== undefined && Array.isArray(data.cards) && data.cards.length === 0) {
      return { field: "cards", message: "Flashcard set has zero cards and cannot be published", severity: "error" };
    }
    if (!data.front && !data.back && !data.term && !data.definition) {
      if (!data.cards || (Array.isArray(data.cards) && data.cards.length === 0)) {
        return { field: "content", message: "Flashcard has no content and cannot be published", severity: "error" };
      }
    }
  }

  if (contentType === "lesson" || contentType === "lessons") {
    const hasContent = data.content && (
      (Array.isArray(data.content) && data.content.length > 0) ||
      (typeof data.content === "string" && data.content.trim().length > 0)
    );
    const isNonEmptyString = (v: any) => typeof v === "string" && v.trim().length > 0;
    const hasSubstantive = isNonEmptyString(data.definition) || isNonEmptyString(data.pathophysiology) || isNonEmptyString(data.summary) ||
      (Array.isArray(data.signsSymptoms) && data.signsSymptoms.length > 0) ||
      (Array.isArray(data.treatment) && data.treatment.length > 0) ||
      (Array.isArray(data.nursingInterventions) && data.nursingInterventions.length > 0);
    if (!hasContent && !hasSubstantive) {
      return { field: "content", message: "Lesson has zero valid content sections and cannot be published", severity: "error" };
    }
  }

  if (contentType === "blog" || contentType === "blog-post" || contentType === "article") {
    const content = data.content;
    const contentStr = typeof content === "string" ? content.trim() : "";
    if (!content || contentStr.length === 0 ||
        contentStr === "null" || contentStr === "[]" || contentStr === "{}") {
      return { field: "content", message: "Content item has zero valid content and cannot be published", severity: "error" };
    }
    if (Array.isArray(content) && content.length === 0) {
      return { field: "content", message: "Content item has zero valid content blocks and cannot be published", severity: "error" };
    }
  }

  return null;
}

export function validateForPublish(contentType: string, data: any, targetLanguage?: string): ValidationResult {
  let result: ValidationResult;
  switch (contentType) {
    case "question":
    case "questions":
    case "exam_question":
      result = validateQuestion(data);
      break;
    case "flashcard":
    case "flashcards":
      result = validateFlashcard(data);
      break;
    case "lesson":
    case "lessons":
      result = validateLesson(data);
      break;
    case "blog":
    case "blog-post":
    case "article":
    case "blogs":
      result = validateBlogPost(data);
      break;
    default:
      result = { valid: true, errors: [], warnings: [] };
  }

  const zeroItemsError = validateZeroValidItems(contentType, data);
  if (zeroItemsError) {
    result.errors.push(zeroItemsError);
    result.valid = false;
  }

  if (targetLanguage) {
    const langResult = validateLanguageForPublish(data, targetLanguage, contentType);
    result.errors.push(...langResult.errors);
    result.warnings.push(...langResult.warnings);
    result.languageValidation = langResult.languageValidation;
    if (langResult.errors.length > 0) {
      result.valid = false;
    }
  }

  return result;
}

const VALID_TIER_VALUES = ["rpn", "rn", "np", "allied", "free", "newgrad", "lvn"];

export function autoRepairContent(contentType: string, data: any): { repairedData: any; repairs: AutoRepairAction[] } {
  const repairs: AutoRepairAction[] = [];
  const repaired = { ...data };

  if (contentType === "question" || contentType === "questions" || contentType === "exam_question") {
    if (repaired.stem && typeof repaired.stem === "string") {
      const trimmed = repaired.stem.trim();
      if (trimmed !== repaired.stem) {
        repairs.push({ field: "stem", action: "trim_whitespace", beforeValue: repaired.stem.length, afterValue: trimmed.length });
        repaired.stem = trimmed;
      }
    }

    if (repaired.rationale && typeof repaired.rationale === "string") {
      const trimmed = repaired.rationale.trim();
      if (trimmed !== repaired.rationale) {
        repairs.push({ field: "rationale", action: "trim_whitespace", beforeValue: repaired.rationale.length, afterValue: trimmed.length });
        repaired.rationale = trimmed;
      }
    }

    if (Array.isArray(repaired.options)) {
      for (let i = 0; i < repaired.options.length; i++) {
        const opt = repaired.options[i];
        if (typeof opt === "string") {
          const trimmed = opt.trim();
          if (trimmed !== opt) {
            repairs.push({ field: `options[${i}]`, action: "trim_whitespace", beforeValue: opt.length, afterValue: trimmed.length });
            repaired.options[i] = trimmed;
          }
        } else if (opt?.text && typeof opt.text === "string") {
          const trimmed = opt.text.trim();
          if (trimmed !== opt.text) {
            repairs.push({ field: `options[${i}].text`, action: "trim_whitespace", beforeValue: opt.text.length, afterValue: trimmed.length });
            repaired.options[i] = { ...opt, text: trimmed };
          }
        }
      }
    }

    if (repaired.tags === null || repaired.tags === undefined) {
      repairs.push({ field: "tags", action: "normalize_empty_array", beforeValue: repaired.tags, afterValue: [] });
      repaired.tags = [];
    }

    if (!repaired.status) {
      repairs.push({ field: "status", action: "set_default_status", beforeValue: repaired.status, afterValue: "draft" });
      repaired.status = "draft";
    }

    if (repaired.tier && typeof repaired.tier === "string") {
      const normalized = repaired.tier.toLowerCase().trim();
      if (normalized !== repaired.tier) {
        repairs.push({ field: "tier", action: "normalize_tier_casing", beforeValue: repaired.tier, afterValue: normalized });
        repaired.tier = normalized;
      }
    }
  }

  if (contentType === "flashcard" || contentType === "flashcards") {
    if (repaired.front && typeof repaired.front === "string") {
      const trimmed = repaired.front.trim();
      if (trimmed !== repaired.front) {
        repairs.push({ field: "front", action: "trim_whitespace", beforeValue: repaired.front.length, afterValue: trimmed.length });
        repaired.front = trimmed;
      }
    }
    if (repaired.back && typeof repaired.back === "string") {
      const trimmed = repaired.back.trim();
      if (trimmed !== repaired.back) {
        repairs.push({ field: "back", action: "trim_whitespace", beforeValue: repaired.back.length, afterValue: trimmed.length });
        repaired.back = trimmed;
      }
    }
    if (!repaired.status) {
      repairs.push({ field: "status", action: "set_default_status", beforeValue: repaired.status, afterValue: "draft" });
      repaired.status = "draft";
    }
  }

  if (contentType === "lesson" || contentType === "lessons" || contentType === "blog" || contentType === "blog-post") {
    if (repaired.title && typeof repaired.title === "string") {
      const trimmed = repaired.title.trim();
      if (trimmed !== repaired.title) {
        repairs.push({ field: "title", action: "trim_whitespace", beforeValue: repaired.title.length, afterValue: trimmed.length });
        repaired.title = trimmed;
      }
    }
    if (!repaired.status) {
      repairs.push({ field: "status", action: "set_default_status", beforeValue: repaired.status, afterValue: "draft" });
      repaired.status = "draft";
    }
    if (repaired.tier && typeof repaired.tier === "string") {
      const normalized = repaired.tier.toLowerCase().trim();
      if (normalized !== repaired.tier) {
        repairs.push({ field: "tier", action: "normalize_tier_casing", beforeValue: repaired.tier, afterValue: normalized });
        repaired.tier = normalized;
      }
    }
  }

  return { repairedData: repaired, repairs };
}

export async function logAutoRepairs(contentType: string, contentId: string, repairs: AutoRepairAction[]): Promise<void> {
  for (const repair of repairs) {
    try {
      await pool.query(
        `INSERT INTO content_repair_log (id, scan_run_id, content_type, content_id, repair_type, field, before_value, after_value, repair_method, status, created_at)
         VALUES (gen_random_uuid(), NULL, $1, $2, $3, $4, $5, $6, 'auto_save_repair', 'applied', NOW())`,
        [contentType, contentId, repair.action, repair.field, String(repair.beforeValue)?.substring(0, 500), String(repair.afterValue)?.substring(0, 500)]
      );
    } catch (err: any) {
      console.error("[AutoRepair] Error logging repair:", err.message);
    }
  }
}

export async function quarantineContent(
  contentType: string,
  contentId: string,
  reason: string
): Promise<boolean> {
  try {
    const table = contentType === "question" || contentType === "questions" || contentType === "exam_question"
      ? "exam_questions"
      : contentType === "flashcard" || contentType === "flashcards"
      ? "flashcard_bank"
      : contentType === "lesson" || contentType === "lessons"
      ? "content_items"
      : contentType === "blog" || contentType === "blog-post"
      ? "content_items"
      : null;

    if (!table) return false;

    let previousStatus: string | null = null;

    if (table === "exam_questions") {
      const statusRes = await pool.query("SELECT status FROM exam_questions WHERE id = $1", [contentId]);
      previousStatus = statusRes.rows[0]?.status || null;
      await pool.query(
        `UPDATE exam_questions SET quarantined_at = NOW(), quarantine_reason = $2 WHERE id = $1`,
        [contentId, reason]
      );
    } else {
      const statusRes = await pool.query(`SELECT status FROM ${table} WHERE id = $1`, [contentId]);
      previousStatus = statusRes.rows[0]?.status || null;
      await pool.query(
        `UPDATE ${table} SET status = 'quarantined' WHERE id = $1`,
        [contentId]
      );
    }

    try {
      await pool.query(
        `INSERT INTO content_quarantine (id, content_id, content_type, reason, detected_by, previous_status, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, 'validation', $4, NOW())
         ON CONFLICT DO NOTHING`,
        [contentId, contentType, reason, previousStatus]
      );
    } catch {}

    return true;
  } catch (err: any) {
    console.error("[Quarantine] Error quarantining content:", err.message);
    return false;
  }
}

export function validateLanguageForPublish(
  data: any,
  targetLanguage: string,
  contentType: string
): { errors: ValidationError[]; warnings: ValidationError[]; languageValidation?: LanguageValidationReport } {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!targetLanguage || targetLanguage === "en") {
    return { errors, warnings };
  }

  const { passed: langPassed, fieldResults } = validateContentLanguage(data, targetLanguage);
  const { passed: termPassed, violations } = checkTerminologyConsistency(data, targetLanguage);

  if (!langPassed) {
    const failedFields = Object.entries(fieldResults)
      .filter(([, v]) => !v.passed)
      .map(([k]) => k);
    errors.push({
      field: "language",
      message: `Language validation failed for fields: ${failedFields.join(", ")}. Expected: ${targetLanguage}`,
      severity: "error",
    });
  }

  if (!termPassed) {
    for (const violation of violations) {
      warnings.push({
        field: violation.field,
        message: `Clinical terminology mismatch: found "${violation.found}", expected "${violation.expected}" in ${targetLanguage}`,
        severity: "warning",
      });
    }
  }

  const languageValidation: LanguageValidationReport = {
    requested_language: targetLanguage,
    detected_language: Object.values(fieldResults)[0]?.detected || targetLanguage,
    field_validation: fieldResults,
    validation_passed: langPassed,
    terminology_check_passed: termPassed,
    retry_count: 0,
    status: langPassed && termPassed ? "validated" : "validation_failed",
  };

  const gate = checkPublishingGate(languageValidation);
  if (!gate.allowed) {
    errors.push({
      field: "publishing_gate",
      message: `Publishing blocked: ${gate.reasons.join("; ")}`,
      severity: "error",
    });
  }

  return { errors, warnings, languageValidation };
}
