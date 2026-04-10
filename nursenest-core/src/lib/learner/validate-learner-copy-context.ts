import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type LearnerCopySurface =
  | "hub_hero"
  | "hub_trust"
  | "cat_coach"
  | "cat_rationale"
  | "recommendation_card"
  | "topic_cluster";

type MismatchRule = {
  id: string;
  when: (p: ExamPathwayDefinition) => boolean;
  pattern: RegExp;
  label: string;
};

/**
 * Presentation-only heuristics: wrong-country exam labels in pathway-scoped copy.
 * Never throws; logs `learner_copy_context_mismatch` for follow-up.
 */
const RULES: MismatchRule[] = [
  {
    id: "ca_pn_us_nclex_pn",
    when: (p) => p.id === "ca-rpn-rex-pn",
    pattern: /\bNCLEX-PN\b|\bNCLEX_PN\b/i,
    label: "US NCLEX-PN reference in Canada REx-PN pathway",
  },
  {
    id: "ca_pn_uap",
    when: (p) => p.countrySlug === "canada" && (p.roleTrack === "rpn" || p.id.includes("rpn")),
    pattern: /\bUAP\b/i,
    label: "UAP term in Canadian PN pathway copy",
  },
  {
    id: "ca_pn_lvn",
    when: (p) => p.countrySlug === "canada" && (p.roleTrack === "rpn" || p.id.includes("rpn")),
    pattern: /\bLVN\b/i,
    label: "LVN term in Canadian PN pathway copy",
  },
  {
    id: "ca_pn_state_board",
    when: (p) => p.countrySlug === "canada" && (p.roleTrack === "rpn" || p.id.includes("rpn")),
    pattern: /\bstate board\b/i,
    label: "US state board phrasing in Canadian PN pathway copy",
  },
  {
    id: "us_pn_rex",
    when: (p) => p.id === "us-lpn-nclex-pn",
    pattern: /\bREx-PN\b|\bREX_PN\b/i,
    label: "Canadian REx-PN reference in US NCLEX-PN pathway",
  },
];

export function validateLearnerCopyForExamContext(
  pathway: ExamPathwayDefinition,
  text: string | null | undefined,
  surface: LearnerCopySurface,
): void {
  if (text == null || typeof text !== "string") return;
  const t = text.trim();
  if (t.length < 8) return;

  for (const rule of RULES) {
    if (!rule.when(pathway)) continue;
    if (!rule.pattern.test(t)) continue;
    safeServerLog("learner_copy", "learner_copy_context_mismatch", {
      event: "learner_copy_context_mismatch",
      rule_id: rule.id,
      pathway_id: pathway.id,
      expected_exam: pathway.shortName,
      surface,
      mismatch_label: rule.label,
      snippet: t.slice(0, 160),
    });
    break;
  }
}
