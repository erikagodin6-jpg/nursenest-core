/**
 * Competency-graph navigation — bridges breadcrumbs to RN ontology and remediation ladders.
 */

import { normalizeTopicKey } from "@/lib/linking/link-resolver";
import {
  resolveRnCompetencyForTopic,
  type ClinicalReasoningRelation,
  type RnCompetencyId,
} from "@/lib/educational-graph/rn-competency-ontology";
import type { EducationalHierarchyNode } from "@/lib/breadcrumbs/navigation-ontology";

export type CompetencyNavContext = {
  topicSlug: string;
  pathwayId?: string | null;
};

export type CompetencyNavigationFrame = {
  competencyId: RnCompetencyId;
  competencyLabel: string;
  topicSlug: string;
  /** Suggested middle nodes for education-first trails (not geo). */
  hierarchyNodes: EducationalHierarchyNode[];
  /** Primary reasoning relation this page reinforces. */
  primaryRelation: ClinicalReasoningRelation;
};

/**
 * Builds competency-aware hierarchy nodes for lesson/topic pages.
 * Example: mechanism → disease → intervention framing without geo segments.
 */
export function buildCompetencyNavigationFrame(ctx: CompetencyNavContext): CompetencyNavigationFrame | null {
  const topicSlug = normalizeTopicKey(ctx.topicSlug) ?? ctx.topicSlug.trim().toLowerCase();
  if (!topicSlug) return null;
  const competency = resolveRnCompetencyForTopic(topicSlug);
  if (!competency) return null;

  return {
    competencyId: competency.id,
    competencyLabel: competency.label,
    topicSlug,
    hierarchyNodes: [
      { layer: "pathway", label: "Lessons", slug: "lessons" },
      { layer: "competency", label: competency.label, slug: competency.id },
      { layer: "topic_cluster", label: formatTopicLabel(topicSlug), slug: topicSlug },
    ],
    primaryRelation: relationForCompetency(competency.id),
  };
}

function formatTopicLabel(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function relationForCompetency(id: RnCompetencyId): ClinicalReasoningRelation {
  switch (id) {
    case "fluid_electrolyte_balance":
    case "acid_base_gas_exchange":
      return "lab_abnormality_to_prioritization";
    case "perfusion_hemodynamics":
    case "infection_sepsis":
      return "instability_to_escalation";
    case "pharmacology_safety":
      return "medication_to_safety_risk";
    case "delegation_supervision":
      return "disease_to_delegation_risk";
    default:
      return "assessment_to_intervention";
  }
}
