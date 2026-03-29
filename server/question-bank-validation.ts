import type { InsertQuestionBankItem } from "@shared/schema";
import { pool } from "./storage";

const VALID_CORRECT_ANSWERS = ["A", "B", "C", "D"];
const VALID_DIFFICULTIES = ["easy", "moderate", "hard", "very_hard", "critical_thinking"];
const VALID_EXAM_TYPES = ["NCLEX-PN", "REx-PN"];
const VALID_COUNTRIES = ["US", "CA"];
const VALID_QUESTION_TYPES = ["MCQ"];
const VALID_STATUSES = ["active", "disabled"];

/** Stored lowercase; aligns with `allowedNursingExamQuestionTiersForUser` ladder (rpn/rn/np). */
export const QUESTION_BANK_CONTENT_TIERS = ["rpn", "rn", "np"] as const;
export type QuestionBankContentTier = (typeof QUESTION_BANK_CONTENT_TIERS)[number];

/**
 * Product rule: domestic PN bank items validated as NCLEX-PN / REx-PN map to the `rpn` content tier.
 * Future RN/NP-only exam types must add an explicit mapping here (no inference from category text).
 */
export function deriveQuestionBankContentTierFromExamType(examType: string): QuestionBankContentTier | null {
  if (examType === "NCLEX-PN" || examType === "REx-PN") return "rpn";
  return null;
}

const VALID_CATEGORIES = [
  "Foundations of Practice",
  "Collaborative Practice",
  "Professional Practice",
  "Ethical Practice",
  "Legal Practice",
  "Physiological Integrity",
  "Safe and Effective Care Environment",
  "Health Promotion and Maintenance",
  "Psychosocial Integrity",
  "Pharmacology",
  "Safety & Infection Control",
  "Basic Care & Comfort",
  "Management of Care",
  "Maternal-Child",
  "Mental Health",
  "Gerontology",
  "General",
];

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: InsertQuestionBankItem[];
  errors: ValidationError[];
  totalRows: number;
  acceptedCount: number;
  rejectedCount: number;
  duplicatesRejected: number;
}

function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

function normalizeStem(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

function trigramSet(text: string): Set<string> {
  const normalized = normalizeStem(text);
  const trigrams = new Set<string>();
  for (let i = 0; i <= normalized.length - 3; i++) {
    trigrams.add(normalized.substring(i, i + 3));
  }
  return trigrams;
}

function trigramSimilarity(a: string, b: string): number {
  const setA = trigramSet(a);
  const setB = trigramSet(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const tri of setA) {
    if (setB.has(tri)) intersection++;
  }
  return intersection / Math.max(setA.size, setB.size);
}

const SIMILARITY_THRESHOLD = 0.75;

export async function checkDuplicateStem(stem: string, tier?: string): Promise<{ isDuplicate: boolean; similarStem?: string; similarity?: number }> {
  try {
    const normalized = normalizeStem(stem);
    if (normalized.length < 20) return { isDuplicate: false };

    const words = normalized.split(" ").filter(w => w.length > 3).slice(0, 5);
    if (words.length === 0) return { isDuplicate: false };

    const searchPattern = words.join(" & ");

    let query = `
      SELECT stem FROM exam_questions
      WHERE status = 'published'
    `;
    const params: any[] = [];
    let idx = 1;

    if (tier) {
      query += ` AND tier = $${idx++}`;
      params.push(tier);
    }

    query += ` ORDER BY id DESC LIMIT 2000`;

    const result = await pool.query(query, params);

    for (const row of result.rows) {
      if (!row.stem) continue;
      const sim = trigramSimilarity(stem, row.stem);
      if (sim >= SIMILARITY_THRESHOLD) {
        return { isDuplicate: true, similarStem: row.stem.substring(0, 100), similarity: Math.round(sim * 100) / 100 };
      }
    }

    return { isDuplicate: false };
  } catch {
    return { isDuplicate: false };
  }
}

export async function checkDuplicateStems(stems: string[], tier?: string): Promise<Map<number, { similarStem: string; similarity: number }>> {
  const duplicates = new Map<number, { similarStem: string; similarity: number }>();
  try {
    let query = `SELECT stem FROM exam_questions WHERE status = 'published'`;
    const params: any[] = [];
    if (tier) {
      query += ` AND tier = $1`;
      params.push(tier);
    }
    query += ` ORDER BY id DESC LIMIT 5000`;

    const result = await pool.query(query, params);
    const existingStems = result.rows.map((r: any) => r.stem).filter(Boolean);

    for (let i = 0; i < stems.length; i++) {
      const stem = stems[i];
      if (!stem || stem.length < 20) continue;

      for (const existing of existingStems) {
        const sim = trigramSimilarity(stem, existing);
        if (sim >= SIMILARITY_THRESHOLD) {
          duplicates.set(i, { similarStem: existing.substring(0, 100), similarity: Math.round(sim * 100) / 100 });
          break;
        }
      }
    }
  } catch {
  }
  return duplicates;
}

export function validateQuestionBankImport(rows: any[]): ValidationResult {
  const errors: ValidationError[] = [];
  const valid: InsertQuestionBankItem[] = [];
  const seenQuestions = new Set<string>();
  const seenRationales = new Set<string>();
  let duplicatesRejected = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;
    const rowErrors: ValidationError[] = [];

    if (!isNonEmptyString(row.question)) {
      rowErrors.push({ row: rowNum, field: "question", message: "Question text is required" });
    }
    if (!isNonEmptyString(row.option_a) && !isNonEmptyString(row.optionA)) {
      rowErrors.push({ row: rowNum, field: "option_a", message: "Option A is required" });
    }
    if (!isNonEmptyString(row.option_b) && !isNonEmptyString(row.optionB)) {
      rowErrors.push({ row: rowNum, field: "option_b", message: "Option B is required" });
    }
    if (!isNonEmptyString(row.option_c) && !isNonEmptyString(row.optionC)) {
      rowErrors.push({ row: rowNum, field: "option_c", message: "Option C is required" });
    }
    if (!isNonEmptyString(row.option_d) && !isNonEmptyString(row.optionD)) {
      rowErrors.push({ row: rowNum, field: "option_d", message: "Option D is required" });
    }

    const correctAnswer = (row.correct_answer || row.correctAnswer || "").toString().toUpperCase().trim();
    if (!VALID_CORRECT_ANSWERS.includes(correctAnswer)) {
      rowErrors.push({ row: rowNum, field: "correct_answer", message: `correct_answer must be one of: ${VALID_CORRECT_ANSWERS.join(", ")}` });
    }

    if (!isNonEmptyString(row.rationale)) {
      rowErrors.push({ row: rowNum, field: "rationale", message: "Rationale is required" });
    }

    if (!isNonEmptyString(row.category)) {
      rowErrors.push({ row: rowNum, field: "category", message: "Category is required" });
    }

    const difficulty = (row.difficulty || "").toString().toLowerCase().trim();
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      rowErrors.push({ row: rowNum, field: "difficulty", message: `difficulty must be one of: ${VALID_DIFFICULTIES.join(", ")}` });
    }

    const examType = (row.exam_type || row.examType || "").toString().trim();
    if (!VALID_EXAM_TYPES.includes(examType)) {
      rowErrors.push({ row: rowNum, field: "exam_type", message: `exam_type must be one of: ${VALID_EXAM_TYPES.join(", ")}` });
    }

    const country = (row.country || "").toString().toUpperCase().trim();
    if (!VALID_COUNTRIES.includes(country)) {
      rowErrors.push({ row: rowNum, field: "country", message: `country must be one of: ${VALID_COUNTRIES.join(", ")}` });
    }

    if (examType === "NCLEX-PN" && country === "CA") {
      rowErrors.push({ row: rowNum, field: "country", message: "NCLEX-PN questions must have country=US" });
    }
    if (examType === "REx-PN" && country === "US") {
      rowErrors.push({ row: rowNum, field: "country", message: "REx-PN questions must have country=CA" });
    }

    const defaultContentTier = deriveQuestionBankContentTierFromExamType(examType);
    const explicitRaw = (row.content_tier ?? row.contentTier ?? "").toString().trim().toLowerCase();
    let resolvedContentTier: string | undefined;
    if (explicitRaw) {
      if (!QUESTION_BANK_CONTENT_TIERS.includes(explicitRaw as QuestionBankContentTier)) {
        rowErrors.push({
          row: rowNum,
          field: "content_tier",
          message: `content_tier must be one of: ${QUESTION_BANK_CONTENT_TIERS.join(", ")}`,
        });
      } else if (defaultContentTier && explicitRaw !== defaultContentTier) {
        rowErrors.push({
          row: rowNum,
          field: "content_tier",
          message: `For ${examType}, content_tier must be ${defaultContentTier}`,
        });
      } else {
        resolvedContentTier = explicitRaw;
      }
    } else if (defaultContentTier) {
      resolvedContentTier = defaultContentTier;
    } else {
      rowErrors.push({
        row: rowNum,
        field: "content_tier",
        message: "content_tier is required when exam_type has no default mapping",
      });
    }

    const questionType = (row.question_type || row.questionType || "MCQ").toString().toUpperCase().trim();
    if (!VALID_QUESTION_TYPES.includes(questionType)) {
      rowErrors.push({ row: rowNum, field: "question_type", message: `question_type must be one of: ${VALID_QUESTION_TYPES.join(", ")}` });
    }

    if (!isNonEmptyString(row.client_needs) && !isNonEmptyString(row.clientNeeds)) {
      rowErrors.push({ row: rowNum, field: "client_needs", message: "client_needs is required" });
    }

    if (!isNonEmptyString(row.topic)) {
      rowErrors.push({ row: rowNum, field: "topic", message: "topic is required" });
    }

    const questionText = (row.question || "").toString().trim().toLowerCase();
    if (questionText && seenQuestions.has(questionText)) {
      rowErrors.push({ row: rowNum, field: "question", message: "Duplicate question text in import batch" });
      duplicatesRejected++;
    }

    const rationaleText = (row.rationale || "").toString().trim().toLowerCase();
    if (rationaleText && seenRationales.has(rationaleText)) {
      rowErrors.push({ row: rowNum, field: "rationale", message: "Duplicate rationale text in import batch" });
    }

    if (questionText && !seenQuestions.has(questionText)) {
      for (const existing of seenQuestions) {
        if (trigramSimilarity(questionText, existing) >= SIMILARITY_THRESHOLD) {
          rowErrors.push({ row: rowNum, field: "question", message: "Question is too similar to another question in this import batch" });
          duplicatesRejected++;
          break;
        }
      }
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      seenQuestions.add(questionText);
      seenRationales.add(rationaleText);
      valid.push({
        question: row.question.trim(),
        optionA: (row.option_a || row.optionA).trim(),
        optionB: (row.option_b || row.optionB).trim(),
        optionC: (row.option_c || row.optionC).trim(),
        optionD: (row.option_d || row.optionD).trim(),
        correctAnswer: correctAnswer as "A" | "B" | "C" | "D",
        rationale: row.rationale.trim(),
        category: row.category.trim(),
        difficulty: difficulty,
        examType: examType,
        country: country,
        questionType: questionType,
        clientNeeds: (row.client_needs || row.clientNeeds).trim(),
        topic: row.topic.trim(),
        status: "active",
        contentTier: resolvedContentTier!,
      });
    }
  }

  return {
    valid,
    errors,
    totalRows: rows.length,
    acceptedCount: valid.length,
    rejectedCount: rows.length - valid.length,
    duplicatesRejected,
  };
}

export function getCountryForUserRegion(userRegion: string | null | undefined): string | null {
  if (!userRegion) return null;
  if (userRegion === "US") return "US";
  if (userRegion === "CA") return "CA";
  return null;
}

export function getExamTypeForCountry(country: string): string {
  return country === "US" ? "NCLEX-PN" : "REx-PN";
}

/**
 * Legacy `question_bank` rows: non-admin learners may only receive rows for their profile
 * region's exam (US → NCLEX-PN, CA → REx-PN) and for `content_tier` values allowed by their
 * subscription (`allowedNursingExamQuestionTiersForUser`). Cross-region / IDOR / out-of-tier
 * access is blocked server-side.
 */
export type LegacyQuestionBankScope = { country: string; examType: string };

export function getLegacyQuestionBankScopeForUser(
  user: { region?: string | null } | null | undefined,
): LegacyQuestionBankScope | null {
  const country = getCountryForUserRegion(user?.region);
  if (!country) return null;
  return { country, examType: getExamTypeForCountry(country) };
}

export function legacyQuestionBankItemMatchesUserScope(
  item: { country: string; examType: string },
  scope: LegacyQuestionBankScope | null,
): boolean {
  if (!scope) return false;
  return item.country === scope.country && item.examType === scope.examType;
}
