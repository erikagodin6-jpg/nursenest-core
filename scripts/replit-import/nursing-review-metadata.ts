/**
 * Reviewed metadata overrides, heuristic suggestions (suggestion-only), and enum validation
 * for nursing ai_cache → exam_questions import. No silent application of weak heuristics.
 */
import * as fs from "fs";
import * as path from "path";
import type { NursingEnrichmentContext } from "./nursing-exam-metadata-enrich";

/** Values accepted in reviewed override files and review artifact editor fields. */
export const ALLOWED_REVIEWED_TIERS = [
  "rpn",
  "rn",
  "np",
  "free",
  "allied",
  "imaging",
  "pharmacyTech",
  "paramedic",
  "mlt",
] as const;

export const ALLOWED_REVIEWED_EXAMS = [
  "NCLEX_RN",
  "NCLEX_PN",
  "REx-PN",
  "AANP",
  "ANCC",
  "NMC-CBT",
  "AHPRA-RN",
  "GULF-NURSING",
] as const;

export type ReviewedMetadataOverridesFileV1 = {
  version: 1;
  description?: string;
  /** Set true after human review of entries. */
  reviewed?: boolean;
  cacheKeyExact: Record<string, { tier: string; exam: string; note?: string; reviewedAt?: string; source?: string }>;
};

export type HeuristicSuggestion = {
  suggested_tier: string | null;
  suggested_exam: string | null;
  suggestion_confidence: "low" | "medium" | "high";
  suggestion_reasons: string[];
  auto_apply: boolean;
};

function optStr(o: Record<string, unknown>, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

/** Suggestion-only: scan concatenated text for known exam labels. Never auto_applied here. */
export function computeHeuristicSuggestion(
  item: Record<string, unknown>,
  _ctx: NursingEnrichmentContext,
): HeuristicSuggestion {
  const parts: string[] = [];
  const stem = typeof item.stem === "string" ? item.stem : typeof item.question === "string" ? item.question : "";
  const rat = typeof item.rationale === "string" ? item.rationale : "";
  const topic = typeof item.topic === "string" ? item.topic : "";
  parts.push(stem, rat, topic);
  const opt = item.options;
  if (opt && typeof opt === "object" && !Array.isArray(opt)) {
    for (const v of Object.values(opt as Record<string, unknown>)) {
      if (typeof v === "string") parts.push(v);
    }
  }
  const blob = parts.join(" ").slice(0, 12000);

  const reasons: string[] = [];
  let tier: string | null = null;
  let exam: string | null = null;

  if (/\bNCLEX[-\s]?RN\b/i.test(blob)) {
    exam = "NCLEX_RN";
    tier = "rn";
    reasons.push("text_match_NCLEX_RN");
  } else if (/\bNCLEX[-\s]?PN\b/i.test(blob)) {
    exam = "NCLEX_PN";
    tier = "rpn";
    reasons.push("text_match_NCLEX_PN");
  } else if (/\bREx[-\s]?PN\b/i.test(blob) || /\bCPNRE\b/i.test(blob)) {
    exam = "REx-PN";
    tier = "rpn";
    reasons.push("text_match_REx-PN_or_CPNRE");
  } else if (/\bAANP\b/i.test(blob)) {
    exam = "AANP";
    tier = "np";
    reasons.push("text_match_AANP");
  } else if (/\bANCC\b/i.test(blob)) {
    exam = "ANCC";
    tier = "np";
    reasons.push("text_match_ANCC");
  }

  const confidence: "low" | "medium" | "high" = reasons.length ? "low" : "low";
  return {
    suggested_tier: tier,
    suggested_exam: exam,
    suggestion_confidence: tier && exam ? confidence : "low",
    suggestion_reasons: reasons,
    auto_apply: false,
  };
}

export function validateReviewedTierExam(tier: string, exam: string): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const t = tier.trim().toLowerCase();
  const e = exam.trim();
  if (!ALLOWED_REVIEWED_TIERS.includes(t as (typeof ALLOWED_REVIEWED_TIERS)[number])) {
    errors.push(`tier_not_allowed:${tier}`);
  }
  if (!ALLOWED_REVIEWED_EXAMS.includes(e as (typeof ALLOWED_REVIEWED_EXAMS)[number])) {
    errors.push(`exam_not_allowed:${exam}`);
  }
  return { ok: errors.length === 0, errors };
}

export function resolveReviewedOverridesPath(repoRoot: string): string {
  const env = process.env.NURSING_REVIEWED_OVERRIDES_PATH?.trim();
  if (env) return path.isAbsolute(env) ? env : path.resolve(repoRoot, env);
  return path.join(repoRoot, "config", "nursing-reviewed-metadata-overrides.json");
}

let cachedReviewed: ReviewedMetadataOverridesFileV1 | null | undefined;

export function loadReviewedOverrides(repoRoot: string): ReviewedMetadataOverridesFileV1 | null {
  const p = resolveReviewedOverridesPath(repoRoot);
  if (!fs.existsSync(p)) return null;
  try {
    const raw = fs.readFileSync(p, "utf8");
    const j = JSON.parse(raw) as ReviewedMetadataOverridesFileV1;
    if (j?.version !== 1) return null;
    if (!j.cacheKeyExact || typeof j.cacheKeyExact !== "object") j.cacheKeyExact = {};
    return j;
  } catch {
    return null;
  }
}

export function loadReviewedOverridesCached(repoRoot: string = process.cwd()): ReviewedMetadataOverridesFileV1 | null {
  if (cachedReviewed !== undefined) return cachedReviewed;
  cachedReviewed = loadReviewedOverrides(repoRoot);
  return cachedReviewed;
}

export function clearReviewedOverridesCache(): void {
  cachedReviewed = undefined;
}

export function applyReviewedOverride(
  cacheKey: string | null,
  reviewed: ReviewedMetadataOverridesFileV1 | null,
): { tier: string; exam: string; key: string } | null {
  if (!reviewed || !cacheKey) return null;
  const ex = reviewed.cacheKeyExact[cacheKey];
  if (ex?.tier && ex.exam) {
    const v = validateReviewedTierExam(ex.tier, ex.exam);
    if (!v.ok) return null;
    return { tier: ex.tier.trim(), exam: ex.exam.trim(), key: `reviewed_override:exact:${cacheKey}` };
  }
  return null;
}
