import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { clinicalInterpretationGuidePath, listPublishedClinicalInterpretationGuides } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { publishedMechanismForTopic } from "@/lib/linking/mechanism-link-candidates";
import { normalizeTopicKey } from "@/lib/linking/link-resolver";
import { topicHubEducationalIntro } from "@/lib/seo/topic-hub-educational-intros";
import { resolveRnCompetencyForTopic } from "@/lib/educational-graph/rn-competency-ontology";
import { dedupeGraphHrefs, TOPIC_HUB_GRAPH_MAX_LINKS } from "@/lib/educational-graph/graph-governance";

export type TopicHubLearningLink = {
  label: string;
  href: string;
  kind: "mechanism" | "interpretation" | "questions" | "flashcards" | "cat";
};

export type TopicHubLearningGraph = {
  topicSlug: string;
  competencyLabel: string | null;
  competencyDescription: string | null;
  studySequence: string[];
  links: TopicHubLearningLink[];
};

export function buildTopicHubLearningGraph(
  pathway: ExamPathwayDefinition,
  topicSlug: string,
): TopicHubLearningGraph | null {
  const key = normalizeTopicKey(topicSlug) ?? topicSlug.trim().toLowerCase();
  if (!key) return null;
  const intro = topicHubEducationalIntro(key);
  const competency = resolveRnCompetencyForTopic(key);

  const links: TopicHubLearningLink[] = [];
  const mechanism = publishedMechanismForTopic(key);
  if (mechanism) {
    links.push({ label: mechanism.label, href: mechanism.href, kind: "mechanism" });
  }
  for (const g of listPublishedClinicalInterpretationGuides()) {
    if (g.related.topicSlugs.some((t) => (normalizeTopicKey(t) ?? t) === key)) {
      links.push({
        label: g.h1,
        href: clinicalInterpretationGuidePath(g.slug),
        kind: "interpretation",
      });
      break;
    }
  }
  links.push({
    label: "Practice questions",
    href: `${buildExamPathwayPath(pathway, "questions")}?topic=${encodeURIComponent(key)}`,
    kind: "questions",
  });
  links.push({
    label: "Flashcards",
    href: `/flashcards/${encodeURIComponent(key)}`,
    kind: "flashcards",
  });
  links.push({
    label: "Adaptive reassessment",
    href: buildExamPathwayPath(pathway, "cat"),
    kind: "cat",
  });

  const deduped = dedupeGraphHrefs(links).slice(0, TOPIC_HUB_GRAPH_MAX_LINKS);

  const studySequence = [
    intro ? "Read the competency overview" : "Review foundational lessons in this topic",
    mechanism ? "Study the mechanism explainer" : "Clarify pathophysiology with a focused lesson",
    "Practice prioritization questions",
    "Drill flashcards for recall",
    "Reassess with a mixed adaptive set",
  ];

  return {
    topicSlug: key,
    competencyLabel: competency?.label ?? null,
    competencyDescription: competency?.description ?? null,
    studySequence,
    links: deduped,
  };
}
