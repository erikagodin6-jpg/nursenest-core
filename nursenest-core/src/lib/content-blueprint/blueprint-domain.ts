/**
 * NCLEX-style client-need domains (operational planning — not CAT balancing).
 * Maps from {@link CanonicalTopicSlug} / optional `nclex_client_needs_category` strings.
 */

import type { CanonicalTopicSlug, PathwayFamily } from "@/lib/questions/question-bank-taxonomy";

/** Stable IDs for blueprint rows and coverage cells. */
export type BlueprintDomainId =
  | "management_of_care"
  | "safety_and_infection"
  | "health_promotion_maintenance"
  | "psychosocial_integrity"
  | "basic_care_comfort"
  | "pharmacological_therapies"
  | "risk_reduction"
  | "physiological_adaptation"
  | "uncategorized";

export const BLUEPRINT_DOMAIN_LABELS: Record<BlueprintDomainId, string> = {
  management_of_care: "Management of care / coordination / delegation",
  safety_and_infection: "Safety and infection control",
  health_promotion_maintenance: "Health promotion and maintenance",
  psychosocial_integrity: "Psychosocial integrity",
  basic_care_comfort: "Basic care and comfort",
  pharmacological_therapies: "Pharmacological and parenteral therapies",
  risk_reduction: "Reduction of risk potential",
  physiological_adaptation: "Physiological adaptation",
  uncategorized: "Uncategorized / needs tagging",
};

/** Optional DB column `nclex_client_needs_category` (lowercased for match). */
const CATEGORY_ALIASES: Array<{ match: RegExp; domain: BlueprintDomainId }> = [
  { match: /management|delegat|coordinat|assignment/i, domain: "management_of_care" },
  { match: /safety|infection|ppe|isolation/i, domain: "safety_and_infection" },
  { match: /health.?prom|maintenance|screen|immuniz/i, domain: "health_promotion_maintenance" },
  { match: /psych|mental|therap|abuse|grief/i, domain: "psychosocial_integrity" },
  { match: /basic.?care|comfort|adl|hygiene/i, domain: "basic_care_comfort" },
  { match: /pharm|medication|parenteral|iv.?therapy/i, domain: "pharmacological_therapies" },
  { match: /risk|complication|potential/i, domain: "risk_reduction" },
  { match: /physio|patho|adaptation|alteration/i, domain: "physiological_adaptation" },
];

export function inferBlueprintDomainFromNclexCategory(raw: string | null | undefined): BlueprintDomainId | null {
  if (!raw || !raw.trim()) return null;
  const s = raw.trim();
  for (const { match, domain } of CATEGORY_ALIASES) {
    if (match.test(s)) return domain;
  }
  return null;
}

/**
 * Map canonical topic bucket (already pathway-family–aware) to blueprint domain.
 */
export function blueprintDomainFromCanonicalTopic(
  family: PathwayFamily,
  slug: CanonicalTopicSlug,
): BlueprintDomainId {
  if (family === "np") {
    switch (slug) {
      case "advanced_assessment":
      case "specialty_focus":
        return "physiological_adaptation";
      case "differential_diagnosis":
        return "management_of_care";
      case "pharmacotherapy":
        return "pharmacological_therapies";
      case "professional_role":
        return "management_of_care";
      default:
        return "uncategorized";
    }
  }
  if (family === "allied") {
    switch (slug) {
      case "safety_infection":
        return "safety_and_infection";
      case "procedures_equipment":
        return "basic_care_comfort";
      case "lab_diagnostics":
        return "risk_reduction";
      case "regulation_ethics":
        return "management_of_care";
      case "clinical_judgment":
        return "management_of_care";
      default:
        return "uncategorized";
    }
  }

  // nclex_rn / nclex_pn
  switch (slug) {
    case "physiological_integrity":
      return "physiological_adaptation";
    case "safe_effective_care":
      return "management_of_care";
    case "psychosocial":
      return "psychosocial_integrity";
    case "pharmacology":
      return "pharmacological_therapies";
    case "prioritization_delegation":
      return "management_of_care";
    case "infection_control":
      return "safety_and_infection";
    case "fundamentals_assessment":
      return "basic_care_comfort";
    case "maternity_pediatrics":
      return "physiological_adaptation";
    default:
      return "uncategorized";
  }
}
