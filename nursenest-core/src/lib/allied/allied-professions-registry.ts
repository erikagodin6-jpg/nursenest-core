import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/**
 * Marketing-only Allied profession hubs under `/allied-health/{segment}`.
 * Content is loaded from the pathway’s `pathway_lessons` with optional topic filters — never RN/PN/NP rows.
 */
export type AlliedProfessionMarketing = {
  /** URL segment including suffix, e.g. `paramedic-exam-prep` */
  segment: string;
  /** Primary pathway for lessons (US allied core). */
  pathwayId: string;
  /** When set, list/detail pages only surface these `pathway_lessons.topic_slug` values. Omit for all lessons in pathway. */
  topicSlugsIn?: string[];
  title: string;
  description: string;
  h1: string;
  examOverview: string[];
  features: string[];
  /** Optional CTA line */
  ctaLine: string;
};

const US_ALLIED = "us-allied-core";

export const ALLIED_PROFESSIONS: AlliedProfessionMarketing[] = [
  {
    segment: "paramedic-exam-prep",
    pathwayId: US_ALLIED,
    title: "Paramedic exam prep | Allied health | NurseNest",
    description:
      "Protocol-first paramedic certification study: prioritization, airway, trauma, and scope-safe judgment — pathway-scoped lessons and practice aligned to allied tier content.",
    h1: "Paramedic certification exam prep",
    examOverview: [
      "Allied health exams reward rapid scene judgment, scope boundaries, and protocol sequencing — not isolated facts.",
      "Use short lesson blocks, then return to pathway-scoped questions so feedback stays relevant to your authorization context.",
    ],
    features: [
      "Lessons and items filtered to the allied subscription tier — no RN-only depth mixed in by mistake.",
      "Preview sections stay discoverable; full lesson depth follows your plan.",
      "Pair lessons with timed practice and rationales to rehearse decision speed.",
    ],
    ctaLine: "Start with the lesson list, then open the question bank on a matching plan.",
  },
  {
    segment: "rrt-exam-prep",
    pathwayId: US_ALLIED,
    title: "Respiratory therapy (RRT) exam prep | NurseNest",
    description:
      "Ventilation, gas exchange, and airway management for respiratory therapy certification prep — scoped to allied pathways and US context where applicable.",
    h1: "Respiratory therapy (RRT) exam prep",
    examOverview: [
      "Respiratory certification items often test equipment logic, safety sequencing, and escalation — keep study loops short and repeatable.",
      "Use lessons to anchor protocols, then drill questions in the same topic cluster.",
    ],
    features: [
      "Pathway-scoped content lists — no cross-tier leakage.",
      "Paginated lesson hubs so pages stay fast as the library grows.",
      "Internal links from hub → profession → lessons → detail for clear crawling.",
    ],
    ctaLine: "Browse lessons below or return to the Allied hub to pick another discipline.",
  },
  {
    segment: "mlt-exam-prep",
    pathwayId: US_ALLIED,
    title: "Medical lab (MLT / MLS) exam prep | NurseNest",
    description:
      "Laboratory reasoning, quality control, and safety edges for medical laboratory certification study — allied-tier scoped.",
    h1: "Medical laboratory exam prep",
    examOverview: [
      "Lab exams mix interpretation with pre-analytical and analytical control concepts — alternate reading with question blocks.",
      "Keep sessions bounded; accuracy matters more than marathon length.",
    ],
    features: [
      "Metadata and breadcrumbs on every indexable page.",
      "Safe pagination on lesson lists (no full-table loads in one HTML response).",
      "404 on unknown lessons instead of soft errors.",
    ],
    ctaLine: "Open paginated lessons and add questions when you are on an allied plan.",
  },
  {
    segment: "imaging-exam-prep",
    pathwayId: US_ALLIED,
    title: "Medical imaging exam prep | NurseNest",
    description:
      "Safety, contrast, positioning, and protocol edges for imaging certification contexts — content scoped to allied pathways.",
    h1: "Medical imaging exam prep",
    examOverview: [
      "Imaging items often test ALARA thinking, contraindications, and team communication — rehearse with rationale-heavy review.",
      "Use the lesson hub as a map; avoid cramming every topic in one sitting.",
    ],
    features: [
      "ISR-friendly marketing pages with bounded database reads.",
      "Canonical URLs on lesson hubs; paginated pages use self-referencing canonicals when needed.",
      "Strict isolation from nursing-only hubs at the data layer.",
    ],
    ctaLine: "Start from lessons, then reinforce with pathway-scoped questions.",
  },
];

export function listAlliedProfessionsSorted(): AlliedProfessionMarketing[] {
  return [...ALLIED_PROFESSIONS].sort((a, b) => a.segment.localeCompare(b.segment));
}

export function getAlliedProfessionBySegment(segment: string): AlliedProfessionMarketing | undefined {
  return ALLIED_PROFESSIONS.find((p) => p.segment === segment);
}

export function getPathwayOrThrow(pathwayId: string): ExamPathwayDefinition | undefined {
  return getExamPathwayById(pathwayId);
}
