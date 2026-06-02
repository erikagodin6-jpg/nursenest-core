export const FLASHCARD_VERIFICATION_STATUSES = [
  "draft",
  "ai_generated_unverified",
  "imported_unverified",
  "student_created_unverified",
  "clinician_reviewed",
  "source_verified",
  "retired_needs_review",
] as const;

export type FlashcardVerificationStatus = (typeof FLASHCARD_VERIFICATION_STATUSES)[number];

export type FlashcardSourceReference = {
  label: string;
  url?: string;
  guidelineVersion?: string;
  accessedAt?: string;
};

export type FlashcardTrustMetadata = {
  verificationStatus: FlashcardVerificationStatus;
  reviewedBy?: string;
  reviewerCredentials?: string;
  reviewedAt?: string;
  primarySources?: FlashcardSourceReference[];
  reportIssueUrl?: string;
};

export type FlashcardQualityWarning = {
  code:
    | "empty_front"
    | "empty_back"
    | "duplicate_card"
    | "unsafe_absolute_claim"
    | "clinical_dosage_without_source"
    | "needs_review_date";
  severity: "block" | "warn";
  message: string;
};

export type FlashcardVerificationCandidate = {
  id?: string;
  front: string;
  back: string;
  explanation?: string;
  trust: FlashcardTrustMetadata;
};

const UNSAFE_ABSOLUTE_TERMS = /\b(always|never|only|guarantees?|must)\b/i;
const DOSAGE_PATTERN = /\b\d+(?:\.\d+)?\s?(?:mg|mcg|g|units?|u|mEq|mmol|mL|L)\b/i;

export function isVerifiedFlashcardStatus(status: FlashcardVerificationStatus): boolean {
  return status === "clinician_reviewed" || status === "source_verified";
}

export function getFlashcardTrustLabel(status: FlashcardVerificationStatus): string {
  switch (status) {
    case "source_verified":
      return "Source verified";
    case "clinician_reviewed":
      return "Clinician reviewed";
    case "ai_generated_unverified":
      return "AI generated — not reviewed";
    case "imported_unverified":
      return "Imported — not reviewed";
    case "student_created_unverified":
      return "Community deck — not reviewed";
    case "retired_needs_review":
      return "Retired — needs review";
    case "draft":
    default:
      return "Draft";
  }
}

export function getFlashcardTrustTone(status: FlashcardVerificationStatus): "verified" | "warning" | "neutral" {
  if (isVerifiedFlashcardStatus(status)) return "verified";
  if (status === "draft") return "neutral";
  return "warning";
}

export function validateFlashcardCandidate(
  candidate: FlashcardVerificationCandidate,
  existingNormalizedPairs: Set<string> = new Set(),
): FlashcardQualityWarning[] {
  const warnings: FlashcardQualityWarning[] = [];
  const front = candidate.front.trim();
  const back = candidate.back.trim();

  if (!front) {
    warnings.push({
      code: "empty_front",
      severity: "block",
      message: "Card front cannot be empty.",
    });
  }

  if (!back) {
    warnings.push({
      code: "empty_back",
      severity: "block",
      message: "Card back cannot be empty.",
    });
  }

  const normalizedPair = `${front.toLowerCase().replace(/\s+/g, " ")}::${back.toLowerCase().replace(/\s+/g, " ")}`;
  if (existingNormalizedPairs.has(normalizedPair)) {
    warnings.push({
      code: "duplicate_card",
      severity: "warn",
      message: "This card appears to duplicate another card in the deck.",
    });
  }

  const combined = `${front} ${back} ${candidate.explanation ?? ""}`;
  const hasSource = Boolean(candidate.trust.primarySources?.length);

  if (DOSAGE_PATTERN.test(combined) && !hasSource) {
    warnings.push({
      code: "clinical_dosage_without_source",
      severity: "block",
      message: "Clinical dosage statements need a source before publication.",
    });
  }

  if (UNSAFE_ABSOLUTE_TERMS.test(combined) && /\b(patient|clinical|medication|dose|treatment|nursing|always|never)\b/i.test(combined)) {
    warnings.push({
      code: "unsafe_absolute_claim",
      severity: "warn",
      message: "Absolute clinical wording should be reviewed for context and safety.",
    });
  }

  if (isVerifiedFlashcardStatus(candidate.trust.verificationStatus) && !candidate.trust.reviewedAt) {
    warnings.push({
      code: "needs_review_date",
      severity: "block",
      message: "Verified cards require a review date.",
    });
  }

  return warnings;
}
