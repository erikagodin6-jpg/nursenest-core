import crypto from "crypto";
import { pool } from "./storage";

/**
 * ------------------------------
 * TYPES
 * ------------------------------
 */

export interface RpnQuestion {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  rationale: string;
  difficulty: string;
  exam: string;
  country: string;
  category: string;
  client_needs: string;
  topic: string;
}

/**
 * ------------------------------
 * HELPERS
 * ------------------------------
 */

export function stemHash(text: string): string {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  return crypto.createHash("md5").update(normalized).digest("hex");
}

function normalizeQuestion(q: RpnQuestion) {
  return {
    ...q,
    question: q.question.trim(),
    option_a: q.option_a.trim(),
    option_b: q.option_b.trim(),
    option_c: q.option_c.trim(),
    option_d: q.option_d.trim(),
    rationale: q.rationale?.trim() || "",
    difficulty: q.difficulty?.toLowerCase() || "moderate",
    exam: q.exam?.toUpperCase() || "NCLEX-PN",
    country: q.country?.toUpperCase() || "US",
  };
}

function validateQuestion(q: RpnQuestion): string[] {
  const errors: string[] = [];

  if (!q.question || q.question.length < 10) {
    errors.push("Invalid question stem");
  }

  const options = [q.option_a, q.option_b, q.option_c, q.option_d];
  if (options.some(o => !o || o.trim().length === 0)) {
    errors.push("Missing option text");
  }

  if (!["A", "B", "C", "D"].includes(q.correct_answer)) {
    errors.push("Invalid correct answer");
  }

  return errors;
}

/**
 * ------------------------------
 * QUESTION BANK
 * ------------------------------
 */

export const questions: RpnQuestion[] = [
  // KEEP ALL YOUR EXISTING QUESTIONS EXACTLY AS THEY ARE
];