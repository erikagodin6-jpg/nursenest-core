import {
  listNursingGlossaryTerms,
  type NursingGlossaryTerm,
} from "@/lib/seo/nursing-glossary-registry";
import { resolveRnCompetencyForTopic } from "@/lib/educational-graph/rn-competency-ontology";
import { EDUCATIONAL_ONTOLOGY_NAMESPACE } from "@/lib/educational-graph/educational-ontology-constants";

export const GLOSSARY_MIN_DEFINITION_CHARS = 72;
export const GLOSSARY_TARGET_TERM_COUNT = 200;

export type GlossaryGovernanceIssue = {
  code: "thin_definition" | "duplicate_slug" | "duplicate_term_label" | "missing_topic_slug";
  slug: string;
  message: string;
};

export type GlossaryGraphMetadata = {
  competencyId: string | null;
  ontologyNamespace: string;
  canonicalHref: string;
  telemetryNamespace: string;
  interpretationTopicSlug: string | null;
  remediationTopicSlug: string;
};

export function glossaryGraphMetadataForTerm(term: NursingGlossaryTerm): GlossaryGraphMetadata {
  const competency = resolveRnCompetencyForTopic(term.topicSlug);
  return {
    competencyId: competency?.id ?? null,
    ontologyNamespace: EDUCATIONAL_ONTOLOGY_NAMESPACE,
    canonicalHref: `/nursing-glossary/${term.slug}`,
    telemetryNamespace: `${EDUCATIONAL_ONTOLOGY_NAMESPACE}.glossary`,
    interpretationTopicSlug: term.topicSlug,
    remediationTopicSlug: term.topicSlug,
  };
}

export function validateGlossaryTerm(term: NursingGlossaryTerm): GlossaryGovernanceIssue[] {
  const issues: GlossaryGovernanceIssue[] = [];
  if (!term.topicSlug?.trim()) {
    issues.push({
      code: "missing_topic_slug",
      slug: term.slug,
      message: "Glossary term must map to a canonical topicSlug for graph linking.",
    });
  }
  if (term.definition.trim().length < GLOSSARY_MIN_DEFINITION_CHARS) {
    issues.push({
      code: "thin_definition",
      slug: term.slug,
      message: `Definition below minimum length (${GLOSSARY_MIN_DEFINITION_CHARS} chars).`,
    });
  }
  return issues;
}

export function auditNursingGlossaryRegistry(): {
  termCount: number;
  issues: GlossaryGovernanceIssue[];
  readyForIndex: boolean;
} {
  const terms = listNursingGlossaryTerms();
  const issues: GlossaryGovernanceIssue[] = [];
  const slugSeen = new Map<string, string>();
  const labelSeen = new Map<string, string>();

  for (const term of terms) {
    issues.push(...validateGlossaryTerm(term));
    const slugKey = term.slug.toLowerCase();
    if (slugSeen.has(slugKey)) {
      issues.push({
        code: "duplicate_slug",
        slug: term.slug,
        message: `Duplicate slug (also on ${slugSeen.get(slugKey)}).`,
      });
    } else {
      slugSeen.set(slugKey, term.slug);
    }
    const labelKey = term.term.trim().toLowerCase();
    if (labelSeen.has(labelKey)) {
      issues.push({
        code: "duplicate_term_label",
        slug: term.slug,
        message: `Duplicate display term (also on ${labelSeen.get(labelKey)}).`,
      });
    } else {
      labelSeen.set(labelKey, term.slug);
    }
  }

  return {
    termCount: terms.length,
    issues,
    readyForIndex: issues.length === 0 && terms.length >= 15,
  };
}
