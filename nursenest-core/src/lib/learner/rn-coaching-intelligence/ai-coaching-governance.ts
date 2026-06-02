import { enforceGovernedAiMeasurementCopy } from "@/lib/measurements/measurement-ai-boundary";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import { sanitizeCoachingNarrative } from "@/lib/learner/rn-coaching-intelligence/coaching-semantics";

const ALLOWED_HREF_PREFIXES = ["/app/", "/us/", "/canada/", "/flashcards/", "/modules/", "/pricing"];

const FORBIDDEN_AI_CLAIMS =
  /\b(guaranteed pass|100% pass|will pass|definitely pass|certified ready|licensed to practice)\b/i;

export type AiGovernanceResult = {
  ok: boolean;
  violations: string[];
  sanitizedText: string;
};

export function validateCoachingNarrativeForModel(
  text: string,
  coachingModel: CoachingModel,
): AiGovernanceResult {
  const violations: string[] = [];
  let sanitized = sanitizeCoachingNarrative(text, coachingModel, null);
  sanitized = enforceGovernedAiMeasurementCopy({
    text: sanitized,
    surface: "coaching",
    applyFallback: true,
  }).text;

  if (FORBIDDEN_AI_CLAIMS.test(sanitized)) {
    violations.push("deterministic_pass_claim");
    sanitized = sanitized.replace(FORBIDDEN_AI_CLAIMS, "readiness is still forming");
  }

  return { ok: violations.length === 0, violations, sanitizedText: sanitized };
}

export function validateRemediationRecommendation(href: string, title: string): AiGovernanceResult {
  const violations: string[] = [];
  if (!href.startsWith("/")) violations.push("invalid_href");
  if (!ALLOWED_HREF_PREFIXES.some((p) => href.startsWith(p))) violations.push("href_not_allowlisted");
  if (title.length > 120) violations.push("title_too_long");
  return { ok: violations.length === 0, violations, sanitizedText: title.slice(0, 120) };
}

export function governCoachingReportCopy(
  blocks: string[],
  coachingModel: CoachingModel,
): string[] {
  return blocks.map((b) => validateCoachingNarrativeForModel(b, coachingModel).sanitizedText);
}
