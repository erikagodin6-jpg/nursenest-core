import { RN_COMPETENCY_NODES } from "@/lib/educational-graph/rn-competency-ontology";
import type { NursingGlossaryTerm } from "@/lib/seo/nursing-glossary-registry";

export function buildCompetencyGlossaryTerms(): NursingGlossaryTerm[] {
  return RN_COMPETENCY_NODES.map((node) => ({
    slug: `competency-${node.id.replace(/_/g, "-")}`,
    term: node.label,
    definition: node.description,
    topicSlug: node.topicSlugs[0] ?? node.id.replace(/_/g, "-"),
  }));
}
