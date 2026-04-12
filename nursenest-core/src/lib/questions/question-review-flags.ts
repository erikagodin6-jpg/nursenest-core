/**
 * Safety scanning for localized questions.
 *
 * Scans question content (original or localized overlay) for risky claims
 * that require human review before the question can be activated for a market.
 *
 * Categories:
 *   - Clinical accuracy risk (drug doses, lab values, procedures)
 *   - Translation ambiguity (mixed languages, unclear phrasing)
 *   - Terminology mismatch (US terms in non-US markets)
 *   - Regulatory references (country-specific licensing/registration)
 *   - Exam framing mismatch (wrong exam context for target market)
 *   - SEO claim overreach (marketing copy exceeds actual support)
 */

import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { QUESTION_LOCALIZATION_PROFILES } from "./question-localization-config";

// ── Types ────────────────────────────────────────────────────────────────────

export type QuestionReviewFlagCategory =
  | "clinical_accuracy"
  | "translation_ambiguity"
  | "terminology_mismatch"
  | "regulatory_reference"
  | "exam_framing_mismatch"
  | "cultural_sensitivity"
  | "unit_mismatch"
  | "medication_naming"
  | "seo_claim_overreach"
  | "scope_of_practice";

export type QuestionReviewFlag = {
  category: QuestionReviewFlagCategory;
  severity: "info" | "warning" | "critical";
  message: string;
  matchedText?: string;
};

export type QuestionReviewResult = {
  flags: QuestionReviewFlag[];
  requiresClinicalReview: boolean;
  requiresTranslationReview: boolean;
  requiresEditorialReview: boolean;
  requiresRegulatoryReview: boolean;
  requiresSeoReview: boolean;
  /** True if any critical flag exists — blocks activation. */
  hasBlockingFlags: boolean;
};

// ── Pattern rules ────────────────────────────────────────────────────────────

type PatternRule = {
  pattern: RegExp;
  category: QuestionReviewFlagCategory;
  severity: "info" | "warning" | "critical";
  message: string;
  /** Only trigger for these regions (null = all non-US). */
  regionsExclude?: GlobalRegionSlug[];
};

const GLOBAL_PATTERNS: PatternRule[] = [
  {
    pattern: /\b(state board of nursing|joint commission|jcaho)\b/i,
    category: "regulatory_reference",
    severity: "warning",
    message: "US-specific regulatory body referenced",
  },
  {
    pattern: /\b(hipaa|emtala|stark law|anti-kickback)\b/i,
    category: "regulatory_reference",
    severity: "critical",
    message: "US healthcare law referenced — not applicable in non-US markets",
    regionsExclude: ["us"],
  },
  {
    pattern: /\b(medicare|medicaid)\b/i,
    category: "regulatory_reference",
    severity: "warning",
    message: "US insurance program referenced",
    regionsExclude: ["us"],
  },
  {
    pattern: /\b(cno|clpnbc|cnps|carna|bccnm)\b/i,
    category: "regulatory_reference",
    severity: "warning",
    message: "Canadian nursing regulatory body referenced",
    regionsExclude: ["canada"],
  },
  {
    pattern: /\b(fahrenheit|°F)\b/i,
    category: "unit_mismatch",
    severity: "info",
    message: "Fahrenheit temperature unit detected — most international markets use Celsius",
  },
  {
    pattern: /\b(\d+)\s*lbs?\b/i,
    category: "unit_mismatch",
    severity: "info",
    message: "Imperial weight unit (lbs) detected — most international markets use kg",
  },
  {
    pattern: /\b(tylenol|advil|motrin|aleve)\b/i,
    category: "medication_naming",
    severity: "info",
    message: "US brand medication name — use generic name for international markets",
  },
  {
    pattern: /\b(licensed practical nurse|lpn)\b/i,
    category: "terminology_mismatch",
    severity: "info",
    message: "US-specific nursing role title (LPN) — may differ in target market",
  },
  {
    pattern: /\b(nurse aide|cna|certified nursing assistant)\b/i,
    category: "scope_of_practice",
    severity: "info",
    message: "US-specific role — scope of practice varies internationally",
  },
  {
    pattern: /\bnclex\b/i,
    category: "exam_framing_mismatch",
    severity: "info",
    message: "NCLEX reference detected — verify appropriate for target market",
  },
];

// ── Scanner ──────────────────────────────────────────────────────────────────

export function scanQuestionForReviewFlags(
  content: {
    stem: string;
    rationale: string | null;
    options: string | null;
  },
  targetRegion: GlobalRegionSlug,
): QuestionReviewResult {
  const profile = QUESTION_LOCALIZATION_PROFILES[targetRegion];
  const flags: QuestionReviewFlag[] = [];
  const textToScan = [content.stem, content.rationale ?? "", content.options ?? ""].join(" ");

  for (const rule of GLOBAL_PATTERNS) {
    if (rule.regionsExclude?.includes(targetRegion)) continue;

    const match = rule.pattern.exec(textToScan);
    if (match) {
      flags.push({
        category: rule.category,
        severity: rule.severity,
        message: rule.message,
        matchedText: match[0],
      });
    }
  }

  // Region-specific checks
  if (profile) {
    if (profile.unitSystem === "si") {
      checkSiUnitIssues(textToScan, flags);
    }
    if (profile.medicationNaming === "generic_international") {
      checkBrandMedicationIssues(textToScan, flags);
    }
  }

  return {
    flags,
    requiresClinicalReview: flags.some(
      (f) => f.category === "clinical_accuracy" || (f.category === "medication_naming" && f.severity !== "info"),
    ),
    requiresTranslationReview: flags.some((f) => f.category === "translation_ambiguity"),
    requiresEditorialReview: flags.some(
      (f) => f.category === "terminology_mismatch" || f.category === "scope_of_practice",
    ),
    requiresRegulatoryReview: flags.some((f) => f.category === "regulatory_reference"),
    requiresSeoReview: flags.some((f) => f.category === "seo_claim_overreach"),
    hasBlockingFlags: flags.some((f) => f.severity === "critical"),
  };
}

/**
 * Batch scan — returns a map of questionId → review result.
 */
export function batchScanQuestionsForReviewFlags(
  questions: Array<{
    id: string;
    stem: string;
    rationale: string | null;
    options: string | null;
  }>,
  targetRegion: GlobalRegionSlug,
): Map<string, QuestionReviewResult> {
  const results = new Map<string, QuestionReviewResult>();
  for (const q of questions) {
    results.set(
      q.id,
      scanQuestionForReviewFlags(
        { stem: q.stem, rationale: q.rationale, options: q.options },
        targetRegion,
      ),
    );
  }
  return results;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function checkSiUnitIssues(text: string, flags: QuestionReviewFlag[]): void {
  // Check for conventional lab values that should be SI
  const conventionalLabPatterns = [
    { pattern: /\b\d+\s*mg\/dL\b/i, unit: "mg/dL" },
    { pattern: /\b\d+\s*g\/dL\b/i, unit: "g/dL" },
  ];
  for (const p of conventionalLabPatterns) {
    if (p.pattern.test(text)) {
      flags.push({
        category: "unit_mismatch",
        severity: "warning",
        message: `Conventional unit ${p.unit} detected — SI market may need conversion`,
      });
    }
  }
}

function checkBrandMedicationIssues(text: string, flags: QuestionReviewFlag[]): void {
  const usBrands: Array<[RegExp, string]> = [
    [/\b(norvasc)\b/i, "amlodipine"],
    [/\b(lipitor)\b/i, "atorvastatin"],
    [/\b(zofran)\b/i, "ondansetron"],
    [/\b(lasix)\b/i, "furosemide"],
    [/\b(haldol)\b/i, "haloperidol"],
    [/\b(ativan)\b/i, "lorazepam"],
    [/\b(coumadin)\b/i, "warfarin"],
    [/\b(glucophage)\b/i, "metformin"],
    [/\b(protonix)\b/i, "pantoprazole"],
  ];
  for (const [pattern, generic] of usBrands) {
    if (pattern.test(text)) {
      flags.push({
        category: "medication_naming",
        severity: "warning",
        message: `US brand name detected — consider using generic name "${generic}" for international markets`,
      });
    }
  }
}
