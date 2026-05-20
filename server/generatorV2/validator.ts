import { VALID_BODY_SYSTEMS } from "./taxonomyRegistry";
import { normalizeSystem, normalizeTopic, type NormalizationResult } from "./topicNormalizer";

const VALID_SYSTEMS = [...VALID_BODY_SYSTEMS];

const VALID_DIFFICULTIES = ["moderate", "hard", "very_challenging"];

const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2614}-\u{2615}\u{2648}-\u{2653}\u{267F}\u{2693}\u{26A1}\u{26AA}-\u{26AB}\u{26BD}-\u{26BE}\u{26C4}-\u{26C5}\u{26CE}\u{26D4}\u{26EA}\u{26F2}-\u{26F3}\u{26F5}\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}]/gu;

const ECHO_PATTERNS = [
  /you are (chatgpt|an ai|a language model|gpt)/i,
  /follow these instructions/i,
  /generate \d+ questions/i,
  /output (json|strict json|valid json)/i,
  /instructions?:/i,
  /you must (output|return|generate|produce)/i,
  /do not (include|use|add|output)/i,
  /here (is|are) the (questions|items|json)/i,
  /as (requested|instructed|per your)/i,
  /i('ll| will) (generate|create|produce)/i,
  /\bprompt\b.*\b(text|instructions?)\b/i,
  /response format/i,
  /json schema/i,
  /no markdown/i,
  /no code fences/i,
  /no prose/i,
];

function stripEmoji(text: string): string {
  return text.replace(EMOJI_REGEX, "").replace(/\s{2,}/g, " ").trim();
}

function containsEchoPattern(text: string): boolean {
  if (!text) return false;
  for (const pat of ECHO_PATTERNS) {
    if (pat.test(text)) return true;
  }
  return false;
}

function sanitizeField(text: string): string {
  let cleaned = stripEmoji(text);
  cleaned = cleaned.replace(/^(Instructions?:\s*|You are\s+|Generate\s+|Output\s+JSON\s*)/i, "").trim();
  return cleaned;
}

export interface RawQuestion {
  id?: string;
  idx?: number;
  type?: string;
  difficulty?: string;
  system?: string;
  stem?: string;
  scenario?: string;
  choices?: any[];
  correct_answers?: any;
  correctAnswers?: any;
  correct?: any;
  rationale?: any;
  exam_pearl?: string;
  examPearl?: string;
  clinicalPearl?: string;
  clinical_pearl?: string;
  tags?: string[];
  category?: string;
  topic?: string;
  [key: string]: any;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  normalized: {
    idx: number;
    type: string;
    difficulty: string;
    system: string;
    stem: string;
    scenario: string;
    choices: { label: string; text: string }[];
    correctAnswers: string[];
    rationale: {
      correctReasoning: string;
      incorrectBreakdown: Record<string, string>;
      keyPathophysiology: string;
      nursingImplication: string;
    };
    examPearl: string;
    hash: string;
    topic?: string;
    tags?: string[];
    taxonomyMapping?: NormalizationResult;
  } | null;
}

function normalizeHash(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split("")
    .reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
    .toString(36);
}

function normalizeChoices(raw: any[]): { label: string; text: string }[] {
  return raw.map((c, i) => {
    if (typeof c === "string") {
      const match = c.match(/^([A-H])\)\s*(.+)/);
      if (match) return { label: match[1], text: match[2] };
      const letter = String.fromCharCode(65 + i);
      return { label: letter, text: c };
    }
    if (c && typeof c === "object") {
      return {
        label: c.label || c.id || String.fromCharCode(65 + i),
        text: c.text || c.content || String(c),
      };
    }
    return { label: String.fromCharCode(65 + i), text: String(c) };
  });
}

function normalizeCorrectAnswers(raw: any): string[] {
  if (typeof raw === "string") return [raw.toUpperCase()];
  if (Array.isArray(raw)) return raw.map((a: any) => String(a).toUpperCase());
  return [];
}

function normalizeRationale(raw: any): {
  correctReasoning: string;
  incorrectBreakdown: Record<string, string>;
  keyPathophysiology: string;
  nursingImplication: string;
} {
  if (!raw || typeof raw !== "object") {
    return {
      correctReasoning: typeof raw === "string" ? raw : "",
      incorrectBreakdown: {},
      keyPathophysiology: "",
      nursingImplication: "",
    };
  }
  return {
    correctReasoning: raw.correctReasoning || raw.correct_reasoning || raw.rationaleCorrect || "",
    incorrectBreakdown: raw.incorrectBreakdown || raw.incorrect_breakdown || raw.rationaleIncorrect || {},
    keyPathophysiology: raw.keyPathophysiology || raw.key_pathophysiology || "",
    nursingImplication: raw.nursingImplication || raw.nursing_implication || "",
  };
}

export function validateQuestion(
  raw: RawQuestion,
  idx: number,
  existingHashes: Set<string>,
): ValidationResult {
  const errors: string[] = [];

  const type = (raw.type || "").toUpperCase();
  if (type !== "MCQ" && type !== "SATA") {
    errors.push(`Invalid type "${raw.type}", must be MCQ or SATA`);
  }

  const stem = sanitizeField(raw.stem || "");
  if (!stem || stem.length < 40) {
    errors.push(`Stem too short (${stem.length} chars, min 40)`);
  }

  if (containsEchoPattern(stem)) {
    errors.push("Stem contains instruction-echo text");
  }

  const scenario = sanitizeField(raw.scenario || stem);

  const difficulty = (raw.difficulty || "moderate").toLowerCase();
  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    errors.push(`Invalid difficulty "${raw.difficulty}"`);
  }

  const rawSystemInput = raw.system || raw.category || "Multi-system";
  const rawTopicInput = raw.topic || "";
  const taxonomyResult = normalizeTopic(rawTopicInput, rawSystemInput);
  let system = taxonomyResult.canonicalSystem;
  const canonicalTopic = taxonomyResult.canonicalTopic;

  if (!Array.isArray(raw.choices) || raw.choices.length < 4) {
    errors.push(`Choices must be an array with >= 4 items, got ${Array.isArray(raw.choices) ? raw.choices.length : "none"}`);
    return { valid: false, errors, normalized: null };
  }

  const choices = normalizeChoices(raw.choices);
  const correctAnswers = normalizeCorrectAnswers(raw.correct_answers || raw.correctAnswers || raw.correct);
  const choiceLabels = new Set(choices.map((c) => c.label));

  if (type === "MCQ") {
    if (choices.length !== 4) {
      errors.push(`MCQ must have exactly 4 choices, got ${choices.length}`);
    }
    if (correctAnswers.length !== 1) {
      errors.push(`MCQ must have exactly 1 correct answer, got ${correctAnswers.length}`);
    }
  }

  if (type === "SATA") {
    if (choices.length < 5) {
      errors.push(`SATA must have >= 5 choices, got ${choices.length}`);
    }
    if (correctAnswers.length < 2 || correctAnswers.length > 5) {
      errors.push(`SATA must have 2-5 correct answers, got ${correctAnswers.length}`);
    }
  }

  for (const ans of correctAnswers) {
    if (!choiceLabels.has(ans)) {
      errors.push(`Correct answer "${ans}" not found in choice labels`);
    }
  }

  const choiceTexts = choices.map((c) => c.text.toLowerCase().trim());
  const uniqueTexts = new Set(choiceTexts);
  if (uniqueTexts.size !== choiceTexts.length) {
    errors.push("Duplicate choice texts detected");
  }
  if (choiceTexts.some((t) => !t || t.length < 3)) {
    errors.push("Empty or very short choice text detected");
  }

  for (const ch of choices) {
    if (containsEchoPattern(ch.text)) {
      errors.push(`Choice "${ch.label}" contains instruction-echo text`);
    }
  }

  const rationale = normalizeRationale(raw.rationale);
  if (!rationale.correctReasoning || rationale.correctReasoning.length < 10) {
    errors.push("correctReasoning missing or too short");
  }
  if (containsEchoPattern(rationale.correctReasoning)) {
    errors.push("Rationale contains instruction-echo text");
  }

  const examPearl = raw.exam_pearl || raw.examPearl || raw.clinicalPearl || raw.clinical_pearl || "";

  const hash = "h" + Math.abs(parseInt(normalizeHash(stem), 36) || 0).toString(36);
  if (existingHashes.has(hash)) {
    errors.push("Duplicate question (stem hash collision)");
  }

  if (errors.length > 0) {
    return { valid: false, errors, normalized: null };
  }

  return {
    valid: true,
    errors: [],
    normalized: {
      idx,
      type: type.toUpperCase() as string,
      difficulty,
      system,
      stem: sanitizeField(stem),
      scenario: sanitizeField(scenario),
      choices: choices.map(c => ({ label: c.label, text: sanitizeField(c.text) })),
      correctAnswers,
      rationale: {
        correctReasoning: sanitizeField(rationale.correctReasoning),
        incorrectBreakdown: Object.fromEntries(Object.entries(rationale.incorrectBreakdown).map(([k, v]) => [k, sanitizeField(String(v))])),
        keyPathophysiology: sanitizeField(rationale.keyPathophysiology),
        nursingImplication: sanitizeField(rationale.nursingImplication),
      },
      examPearl: sanitizeField(examPearl),
      hash,
      topic: canonicalTopic || raw.topic || undefined,
      tags: Array.isArray(raw.tags) ? raw.tags : undefined,
      taxonomyMapping: taxonomyResult,
    },
  };
}

export function validateChunk(
  items: RawQuestion[],
  startIdx: number,
  existingHashes: Set<string>,
): { valid: ValidationResult[]; invalid: { idx: number; errors: string[] }[] } {
  const valid: ValidationResult[] = [];
  const invalid: { idx: number; errors: string[] }[] = [];
  const localHashes = new Set(existingHashes);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const idx = startIdx + i;
    const result = validateQuestion(item, idx, localHashes);
    if (result.valid && result.normalized) {
      localHashes.add(result.normalized.hash);
      valid.push(result);
    } else {
      invalid.push({ idx, errors: result.errors });
    }
  }

  return { valid, invalid };
}

export function extractJsonFromResponse(raw: string): string {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}
