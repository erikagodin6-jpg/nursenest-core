import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import {
  clinicalInterpretationGuidePath,
  listPublishedClinicalInterpretationGuides,
} from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { publishedMechanismForTopic } from "@/lib/linking/mechanism-link-candidates";
import { normalizeTopicKey } from "@/lib/linking/link-resolver";
import { remediationLessonsTopicHref, remediationTopicDrillHref } from "@/lib/learner/remediation-links";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import { getNursingGlossaryTerm, listNursingGlossaryTerms } from "@/lib/seo/nursing-glossary-registry";

const GLOSSARY_HUB = "/nursing-glossary";

const TOPIC_INTERPRETATION_SLUG: Record<string, string> = {
  "abg-interpretation": "abg-interpretation",
  sepsis: "sepsis-interpretation",
  "fluid-balance": "electrolyte-interpretation",
  electrolytes: "electrolyte-interpretation",
  hyperkalemia: "electrolyte-interpretation",
  "heart-failure": "hemodynamic-interpretation",
  shock: "hemodynamic-interpretation",
};

export function normalizeGraphTopicSlug(topic: string): string {
  return normalizeTopicKey(topic) ?? topic.trim().toLowerCase();
}

export function publishedInterpretationForTopic(topicSlug: string): { title: string; href: string } | null {
  const key = normalizeGraphTopicSlug(topicSlug);
  const guideSlug = TOPIC_INTERPRETATION_SLUG[key];
  if (guideSlug) {
    const guide = listPublishedClinicalInterpretationGuides().find((g) => g.slug === guideSlug);
    if (guide) return { title: guide.h1, href: clinicalInterpretationGuidePath(guide.slug) };
  }
  for (const g of listPublishedClinicalInterpretationGuides()) {
    if (g.related.topicSlugs.some((t) => normalizeGraphTopicSlug(t) === key)) {
      return { title: g.h1, href: clinicalInterpretationGuidePath(g.slug) };
    }
  }
  return null;
}

export function publishedMechanismLinkForTopic(topicSlug: string): { title: string; href: string } | null {
  const m = publishedMechanismForTopic(topicSlug);
  return m ? { title: m.label, href: m.href } : null;
}

export function glossaryLinkForTopic(topicSlug: string): { title: string; href: string } | null {
  const key = normalizeGraphTopicSlug(topicSlug);
  const term = listNursingGlossaryTerms().find((t) => normalizeGraphTopicSlug(t.topicSlug) === key);
  if (!term) return null;
  return { title: term.term, href: `${GLOSSARY_HUB}/${term.slug}` };
}

export function appFlashcardsHref(pathwayId: string | null, topic: string): string {
  const q = new URLSearchParams();
  if (pathwayId) q.set("pathwayId", pathwayId);
  if (topic.trim()) q.set("q", topic.trim());
  const qs = q.toString();
  return qs ? `/app/flashcards?${qs}` : "/app/flashcards";
}

export function appLessonTopicHref(topic: string, pathwayId: string | null): string {
  return remediationLessonsTopicHref(topic, null, pathwayId);
}

export function appPrioritizationDrillHref(topic: string, pathwayId: string | null, mixed = false): string {
  const base = remediationTopicDrillHref(topic, pathwayId);
  return mixed ? `${base}${base.includes("?") ? "&" : "?"}studyMode=mixed` : base;
}

export function marketingQuestionsHref(pathway: ExamPathwayDefinition, topicSlug: string): string {
  return `${buildExamPathwayPath(pathway, "questions")}?topic=${encodeURIComponent(topicSlug)}`;
}

export function marketingFlashcardsHref(topicSlug: string): string {
  return `/flashcards/${encodeURIComponent(topicSlug)}`;
}

export function marketingCatHref(pathway: ExamPathwayDefinition): string {
  return buildExamPathwayPath(pathway, "cat");
}

export function reassessmentHref(args: {
  coachingModel: CoachingModel;
  pathwayId: string | null;
  marketingPathway?: ExamPathwayDefinition | null;
}): { title: string; href: string; stepKind: "loft_simulation" | "cat_exam" | "reassessment" } {
  if (args.coachingModel === "loft_readiness") {
    return { title: "LOFT reassessment", href: "/app/cases/cnple", stepKind: "loft_simulation" };
  }
  if (args.marketingPathway) {
    return {
      title: "Mixed-domain reassessment",
      href: marketingCatHref(args.marketingPathway),
      stepKind: "cat_exam",
    };
  }
  const href = args.pathwayId ? appPathwayCatSessionStartPath(args.pathwayId) : "/app/practice-tests";
  return { title: "Readiness reassessment", href, stepKind: "reassessment" };
}

/** Topic-specific clinical reasoning chain overrides (bedside progression). */
export function topicReasoningChainOverride(topicSlug: string): import("@/lib/educational-graph/rn-competency-ontology").ClinicalReasoningRelation[] | null {
  const key = normalizeGraphTopicSlug(topicSlug);
  if (key === "hyperkalemia" || key === "fluid-balance") {
    return [
      "lab_abnormality_to_prioritization",
      "symptom_to_mechanism",
      "assessment_to_intervention",
      "intervention_to_monitoring",
      "instability_to_escalation",
    ];
  }
  return null;
}
