import type { HealthcareProgramTier } from "@/lib/nursing-tiers/tier-pedagogy-profile";

export type ClinicalAuthenticityInput = {
  tier: HealthcareProgramTier;
  stem?: string | null;
  options?: unknown;
  rationale?: string | null;
  clinicalReasoning?: string | null;
};

export type ClinicalAuthenticityIssueCode =
  | "MISSING_BEDSIDE_CONTEXT"
  | "MISSING_CHARTLIKE_CUES"
  | "ROBOTIC_OR_TEXTBOOK_PHRASE"
  | "UNNATURAL_DIALOGUE"
  | "EXAGGERATED_SCENARIO"
  | "WEAK_NURSE_DECISION_LANGUAGE";

export type ClinicalAuthenticityIssue = {
  code: ClinicalAuthenticityIssueCode;
  severity: "warning" | "error";
  message: string;
  remediation: string;
};

export type ClinicalAuthenticityResult = {
  pass: boolean;
  score: number;
  issues: ClinicalAuthenticityIssue[];
};

const BEDSIDE_CONTEXT_PATTERNS = [
  /\b(nurse|charge nurse|practical nurse|provider|client|patient|resident|caregiver|family)\b/i,
  /\b(med[- ]surg|emergency department|clinic|long[- ]term care|postoperative|postpartum|home care|community|shift report|bedside|unit)\b/i,
] as const;

const CHARTLIKE_CUE_PATTERNS = [
  /\b(vital signs?|bp|blood pressure|hr|heart rate|rr|respiratory rate|temperature|temp|spo2|oxygen saturation|pain|intake|output|i\/o)\b/i,
  /\b(mar|order|report|handoff|shift report|nursing note|assessment|reassessment|trend|new onset|worsening|denies|reports|states|receiving|prescribed)\b/i,
  /\b\d{1,3}[- ]year[- ]old|\b\d+\s?(?:mg|mcg|units|l\/min|ml|kg|bpm|mmhg|%)\b/i,
] as const;

const ROBOTIC_OR_TEXTBOOK_PATTERNS = [
  /\b(clinical recall|the clinical principle being reviewed|in this educational scenario|for the purpose of this question)\b/i,
  /\b(which finding or action best reflects|demonstrates knowledge of the topic|as it relates to nursing care)\b/i,
  /\b(pathophysiology is defined as|according to textbook theory|textbook-only|memorize the concept)\b/i,
] as const;

const UNNATURAL_DIALOGUE_PATTERNS = [
  /\b(i am experiencing|i have a symptom of|my disease process is|i understand the teaching because|this indicates that i need)\b/i,
  /\bthe client verbalizes (?:perfect understanding|the exact rationale|the pathophysiology)\b/i,
] as const;

const EXAGGERATED_SCENARIO_PATTERNS = [
  /\b(all vital signs (?:are )?crashing|suddenly every system fails|catastrophic collapse|massive explosion|blood everywhere|screaming uncontrollably)\b/i,
  /\bimmediately dies|certain death|always fatal|never survives\b/i,
] as const;

const NURSE_DECISION_PATTERNS = [
  /\b(assess|reassess|monitor|administer|hold|question|teach|delegate|document|notify|report|escalate|call rapid response|position|implement|evaluate)\b/i,
  /\b(first|priority|next|most appropriate|requires follow-up|should the nurse|best response)\b/i,
] as const;

function text(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseArrayish(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function optionText(option: unknown): string {
  if (typeof option === "string") return option.trim();
  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    return text(String(record.text ?? record.content ?? record.label ?? ""));
  }
  return "";
}

function countMatches(value: string, patterns: readonly RegExp[]): number {
  return patterns.reduce((sum, pattern) => sum + (pattern.test(value) ? 1 : 0), 0);
}

function addIssue(issues: ClinicalAuthenticityIssue[], issue: ClinicalAuthenticityIssue): void {
  issues.push(issue);
}

export function evaluateClinicalAuthenticity(input: ClinicalAuthenticityInput): ClinicalAuthenticityResult {
  const stem = text(input.stem);
  const rationale = text(input.rationale);
  const reasoning = text(input.clinicalReasoning);
  const options = parseArrayish(input.options).map(optionText).filter(Boolean);
  const combined = [stem, rationale, reasoning, ...options].join(" ");
  const issues: ClinicalAuthenticityIssue[] = [];

  if (countMatches(stem, BEDSIDE_CONTEXT_PATTERNS) === 0) {
    addIssue(issues, {
      code: "MISSING_BEDSIDE_CONTEXT",
      severity: "error",
      message: "Question does not read like an actual bedside, clinic, or workflow situation.",
      remediation:
        "Add a realistic care setting, patient/client context, nurse role, or shift/workflow detail.",
    });
  }

  if (countMatches(stem, CHARTLIKE_CUE_PATTERNS) === 0) {
    addIssue(issues, {
      code: "MISSING_CHARTLIKE_CUES",
      severity: "warning",
      message: "Question lacks realistic charting or assessment cues.",
      remediation:
        "Use believable data such as vitals, symptoms, orders, MAR details, shift report, nursing notes, or reassessment findings.",
    });
  }

  if (countMatches(combined, ROBOTIC_OR_TEXTBOOK_PATTERNS) > 0) {
    addIssue(issues, {
      code: "ROBOTIC_OR_TEXTBOOK_PHRASE",
      severity: "error",
      message: "Question uses robotic, AI-like, or textbook-only phrasing.",
      remediation:
        "Rewrite in natural clinical language that an experienced nursing educator would use in a licensing item.",
    });
  }

  if (countMatches(combined, UNNATURAL_DIALOGUE_PATTERNS) > 0) {
    addIssue(issues, {
      code: "UNNATURAL_DIALOGUE",
      severity: "warning",
      message: "Patient or learner dialogue sounds unnatural.",
      remediation:
        "Use plain patient statements or realistic teach-back, not dialogue that recites the exact rationale.",
    });
  }

  if (countMatches(combined, EXAGGERATED_SCENARIO_PATTERNS) > 0) {
    addIssue(issues, {
      code: "EXAGGERATED_SCENARIO",
      severity: "error",
      message: "Scenario is exaggerated rather than clinically believable.",
      remediation:
        "Use realistic deterioration, workload pressure, or safety risk without melodrama.",
    });
  }

  if (input.tier !== "NP" && countMatches(combined, NURSE_DECISION_PATTERNS) < 2) {
    addIssue(issues, {
      code: "WEAK_NURSE_DECISION_LANGUAGE",
      severity: "warning",
      message: "Question does not clearly center genuine nurse decision-making.",
      remediation:
        "Ask what the nurse should assess, do first, teach, hold/question, delegate, report, document, or evaluate.",
    });
  }

  const penalty = issues.reduce((sum, issue) => sum + (issue.severity === "error" ? 18 : 8), 0);
  const score = Math.max(0, 100 - penalty);
  return {
    pass: score >= 80 && !issues.some((issue) => issue.severity === "error"),
    score,
    issues,
  };
}
