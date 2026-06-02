/**
 * Structured data helpers — ontology-consistent interpretation entities.
 */
import type { ClinicalInterpretationId } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import type { InterpretationPanel } from "@/lib/measurements/measurement-interpretation-engine";
import type { BedsideCognitionPathway } from "@/lib/measurements/measurement-reasoning-expansion";

export type MeasurementStructuredEntity = {
  "@type": "MedicalWebPage" | "LearningResource" | "DefinedTerm";
  name: string;
  description: string;
  competencyId?: string;
  interpretationId?: ClinicalInterpretationId;
  educationalLevel?: string;
};

export function buildInterpretationLearningResource(args: {
  title: string;
  description: string;
  panel: InterpretationPanel;
  pathwayLabel?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: args.title,
    description: args.description,
    educationalLevel: args.pathwayLabel ?? "RN clinical interpretation",
    learningResourceType: "Clinical interpretation guide",
    about: {
      "@type": "DefinedTerm",
      name: args.panel.domain,
      description: args.panel.semantics.interpretationHint ?? args.panel.display,
    },
  };
}

export function buildTrendExplainerArticle(args: {
  headline: string;
  pathway: BedsideCognitionPathway;
  canonicalPath: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.headline,
    description: args.pathway.summary,
    url: args.canonicalPath,
    about: args.pathway.reasoningRelations.map((r) => ({
      "@type": "DefinedTerm",
      name: r,
    })),
  };
}

export function buildMonitoringPathwayFaq(args: {
  questions: Array<{ question: string; answer: string }>;
}): Record<string, unknown> | null {
  if (args.questions.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: args.questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}
