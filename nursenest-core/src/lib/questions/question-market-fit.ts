/**
 * Question market fit engine.
 *
 * Evaluates whether a canonical ExamQuestion is suitable for a target market.
 * Uses structured rules (not prompt-only logic) to classify each question
 * into one of five fit levels, from direct reuse to exclusion.
 *
 * This is a pure function module — no DB access, no side effects.
 */

import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { QUESTION_LOCALIZATION_PROFILES, type LocalizationProfile } from "./question-localization-config";

// ── Fit classification ───────────────────────────────────────────────────────

export type QuestionMarketFitLevel =
  | "direct_reuse"
  | "translated_only"
  | "terminology_adapted"
  | "context_adapted"
  | "region_specific_variant"
  | "excluded";

export type QuestionMarketFitResult = {
  level: QuestionMarketFitLevel;
  reasons: string[];
  requiresReview: boolean;
  adaptationNotes: string[];
};

// ── Canonical question shape (minimal projection for fit evaluation) ─────────

export type QuestionFitInput = {
  id: string;
  exam: string;
  tier: string;
  questionType: string;
  regionScope: string | null;
  countryCode: string | null;
  languageCode: string | null;
  labUnitVariant: string | null;
  medicationNamingVariant: string | null;
  tags: string[];
  topic: string | null;
  bodySystem: string | null;
  stem: string;
  rationale: string | null;
  careerType: string | null;
  difficulty: number | null;
};

// ── Fit evaluation ───────────────────────────────────────────────────────────

/**
 * Evaluate whether a canonical question is suitable for a target market.
 *
 * Returns a structured classification with reasons and adaptation notes,
 * rather than a simple boolean. Downstream code uses this to decide
 * whether to serve, adapt, or exclude the question.
 */
export function evaluateQuestionMarketFit(
  question: QuestionFitInput,
  targetRegion: GlobalRegionSlug,
  targetProfession: string | null,
  targetExam: string | null,
): QuestionMarketFitResult {
  const profile = QUESTION_LOCALIZATION_PROFILES[targetRegion];
  const reasons: string[] = [];
  const adaptationNotes: string[] = [];
  let requiresReview = false;

  // ── Hard exclusions ────────────────────────────────────────────────────

  // Region scope exclusion (current US_ONLY / CA_ONLY system)
  if (question.regionScope === "US_ONLY" && targetRegion !== "us") {
    if (targetRegion !== "canada") {
      reasons.push("US-only region scope — excluded from non-US market");
      return { level: "excluded", reasons, requiresReview: false, adaptationNotes };
    }
  }
  if (question.regionScope === "CA_ONLY" && targetRegion !== "canada") {
    reasons.push("Canada-only region scope — excluded from non-CA market");
    return { level: "excluded", reasons, requiresReview: false, adaptationNotes };
  }

  // Career type mismatch
  if (targetProfession && question.careerType) {
    const profFit = evaluateProfessionFit(question.careerType, targetProfession);
    if (profFit === "excluded") {
      reasons.push(`Career type "${question.careerType}" does not match profession "${targetProfession}"`);
      return { level: "excluded", reasons, requiresReview: false, adaptationNotes };
    }
  }

  // ── Exam relevance ─────────────────────────────────────────────────────

  const examFit = evaluateExamRelevance(question.exam, targetExam, profile);
  if (examFit === "excluded") {
    reasons.push(`Exam "${question.exam}" not relevant for target exam "${targetExam}" in ${targetRegion}`);
    return { level: "excluded", reasons, requiresReview: false, adaptationNotes };
  }
  if (examFit === "partial") {
    reasons.push(`Exam "${question.exam}" partially relevant for ${targetRegion} — may need context adaptation`);
    adaptationNotes.push("Verify exam framing is appropriate for target market");
    requiresReview = true;
  }

  // ── Terminology analysis ───────────────────────────────────────────────

  const termIssues = evaluateTerminologyFit(question, profile);
  if (termIssues.length > 0) {
    reasons.push(...termIssues.map((t) => t.reason));
    adaptationNotes.push(...termIssues.map((t) => t.note));
    if (termIssues.some((t) => t.severe)) {
      return { level: "context_adapted", reasons, requiresReview: true, adaptationNotes };
    }
  }

  // ── Unit system check ──────────────────────────────────────────────────

  if (question.labUnitVariant && profile) {
    const unitFit = evaluateUnitFit(question.labUnitVariant, profile);
    if (unitFit !== "ok") {
      reasons.push(`Lab unit variant "${question.labUnitVariant}" needs adaptation for ${targetRegion}`);
      adaptationNotes.push(`Convert to ${profile.unitSystem} units`);
    }
  }

  // ── Medication naming ──────────────────────────────────────────────────

  if (question.medicationNamingVariant && profile) {
    if (question.medicationNamingVariant !== profile.medicationNaming) {
      reasons.push(`Medication naming "${question.medicationNamingVariant}" differs from ${targetRegion} convention`);
      adaptationNotes.push("Review medication naming for target market");
    }
  }

  // ── Language check ─────────────────────────────────────────────────────

  const sourceLang = question.languageCode ?? "en";
  if (profile && !profile.allowedLocales.includes(sourceLang as never)) {
    reasons.push(`Source language "${sourceLang}" — translation needed for ${targetRegion}`);
    return {
      level: reasons.length > 1 ? "context_adapted" : "translated_only",
      reasons,
      requiresReview,
      adaptationNotes,
    };
  }

  // ── Classify final fit level ───────────────────────────────────────────

  if (reasons.length === 0) {
    return { level: "direct_reuse", reasons: ["No adaptations needed"], requiresReview: false, adaptationNotes };
  }

  if (adaptationNotes.length > 0 && (requiresReview || adaptationNotes.length >= 2)) {
    return { level: "terminology_adapted", reasons, requiresReview, adaptationNotes };
  }

  return { level: "translated_only", reasons, requiresReview, adaptationNotes };
}

// ── Sub-evaluators ───────────────────────────────────────────────────────────

function evaluateProfessionFit(careerType: string, targetProfession: string): "fit" | "partial" | "excluded" {
  const ct = careerType.toLowerCase();
  const tp = targetProfession.toLowerCase();

  if (ct === tp) return "fit";
  if (ct === "nursing" && (tp === "rn" || tp === "rpn" || tp === "pn" || tp === "np")) return "fit";

  // Allied careers are isolated
  if (ct === "allied" && tp !== "allied") return "excluded";
  if (tp === "allied" && ct !== "allied") return "excluded";

  // NP content shouldn't leak to RPN
  if (ct === "np" && (tp === "rpn" || tp === "pn")) return "excluded";

  return "partial";
}

function evaluateExamRelevance(
  questionExam: string,
  targetExam: string | null,
  profile: LocalizationProfile | undefined,
): "fit" | "partial" | "excluded" {
  if (!targetExam) return "fit";
  const qe = questionExam.toUpperCase().replace(/[-_]/g, "");
  const te = targetExam.toUpperCase().replace(/[-_]/g, "");

  if (qe === te) return "fit";

  // NCLEX-RN content is broadly relevant to many international RN candidates
  if (qe === "NCLEXRN" && profile?.examRelevance?.includes("NCLEX-RN")) return "fit";
  if (qe === "NCLEXPN" && profile?.examRelevance?.includes("NCLEX-PN")) return "fit";
  if (qe === "REXPN" && te === "REXPN") return "fit";

  // Cross-exam partial relevance (e.g. RN content for PN if topic overlaps)
  if ((qe === "NCLEXRN" && te === "NCLEXPN") || (qe === "NCLEXPN" && te === "NCLEXRN")) return "partial";

  return "excluded";
}

type TermIssue = { reason: string; note: string; severe: boolean };

function evaluateTerminologyFit(question: QuestionFitInput, profile: LocalizationProfile | undefined): TermIssue[] {
  if (!profile) return [];
  const issues: TermIssue[] = [];
  const stemLower = question.stem.toLowerCase();

  // Check for US-specific regulatory references in non-US markets
  if (profile.region !== "us") {
    const usRegPatterns = [
      "state board of nursing",
      "joint commission",
      "cms guidelines",
      "hipaa",
      "medicare",
      "medicaid",
    ];
    for (const pat of usRegPatterns) {
      if (stemLower.includes(pat)) {
        issues.push({
          reason: `US-specific reference "${pat}" found in stem`,
          note: `Replace or contextualize "${pat}" for ${profile.region}`,
          severe: true,
        });
      }
    }
  }

  // Check for Canada-specific references in non-CA markets
  if (profile.region !== "canada") {
    const caRegPatterns = ["cno registration", "clpnbc", "provincial nursing"];
    for (const pat of caRegPatterns) {
      if (stemLower.includes(pat)) {
        issues.push({
          reason: `Canada-specific reference "${pat}" found`,
          note: `Contextualize for ${profile.region}`,
          severe: true,
        });
      }
    }
  }

  return issues;
}

function evaluateUnitFit(labUnitVariant: string, profile: LocalizationProfile): "ok" | "needs_conversion" {
  if (labUnitVariant.toLowerCase() === profile.unitSystem.toLowerCase()) return "ok";
  if (labUnitVariant === "conventional" && profile.unitSystem === "si") return "needs_conversion";
  if (labUnitVariant === "si" && profile.unitSystem === "conventional") return "needs_conversion";
  return "ok";
}

// ── Batch classification ─────────────────────────────────────────────────────

/**
 * Classify a batch of questions for a target market.
 * Returns a map of questionId → fit result for efficient filtering.
 */
export function classifyQuestionsForMarket(
  questions: QuestionFitInput[],
  targetRegion: GlobalRegionSlug,
  targetProfession: string | null,
  targetExam: string | null,
): Map<string, QuestionMarketFitResult> {
  const results = new Map<string, QuestionMarketFitResult>();
  for (const q of questions) {
    results.set(q.id, evaluateQuestionMarketFit(q, targetRegion, targetProfession, targetExam));
  }
  return results;
}
