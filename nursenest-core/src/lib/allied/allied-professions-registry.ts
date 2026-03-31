import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/**
 * Allied marketing + lesson routing.
 * - Hero URLs: `/allied-health/{segment}` where `segment` ends with `-exam-prep`
 * - Lesson lists + detail: `/allied-health/{professionKey}/lessons` and `.../lessons/[slug]`
 */
export type AlliedProfessionMarketing = {
  /** Short key for lesson routes, e.g. `paramedic` → `/allied-health/paramedic/lessons` */
  professionKey: string;
  /** Hero segment, e.g. `paramedic-exam-prep` → `/allied-health/paramedic-exam-prep` */
  segment: string;
  pathwayId: string;
  topicSlugsIn?: string[];
  title: string;
  description: string;
  h1: string;
  examOverview: string[];
  features: string[];
  ctaLine: string;
};

const US_ALLIED = "us-allied-core";

export const ALLIED_PROFESSIONS: AlliedProfessionMarketing[] = [
  {
    professionKey: "pta",
    segment: "pta-exam-prep",
    pathwayId: US_ALLIED,
    title: "Physical therapist assistant (PTA) exam prep | NurseNest",
    description:
      "Therapeutic exercise, mobility, and safety judgment for PTA certification study — pathway-scoped allied lessons and practice.",
    h1: "Physical therapist assistant exam prep",
    examOverview: [
      "PTA exams blend kinesiology with scope and delegation — short study loops beat long cram sessions.",
      "Alternate reading blocks with pathway-scoped questions so feedback stays in your authorization lane.",
    ],
    features: [
      "Strict allied-tier isolation from RN/PN/NP depth.",
      "Paginated lesson hubs — no full-library HTML payloads.",
      "Breadcrumbs and internal links from hub → profession → lessons.",
    ],
    ctaLine: "Open paginated lessons, then reinforce with questions on a matching allied plan.",
  },
  {
    professionKey: "ota",
    segment: "ota-exam-prep",
    pathwayId: US_ALLIED,
    title: "Occupational therapy assistant (OTA) exam prep | NurseNest",
    description:
      "Activity analysis, ADLs, and safety sequencing for OTA certification prep — allied pathway scope.",
    h1: "Occupational therapy assistant exam prep",
    examOverview: [
      "OTA items often test reasoning across environments — rehearse with rationale-heavy review.",
      "Keep sessions bounded; repeat weak clusters instead of marathon reads.",
    ],
    features: [
      "Metadata and canonical URLs on indexable routes.",
      "404 on unknown lessons instead of soft failures.",
      "No cross-profession leakage in learner-scoped views when a profession is set.",
    ],
    ctaLine: "Start from lessons, then drill questions in the same topic cluster.",
  },
  {
    professionKey: "mlt",
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
    professionKey: "imaging",
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
      "Canonical URLs on lesson hubs; paginated pages use noindex where appropriate.",
      "Strict isolation from nursing-only hubs at the data layer.",
    ],
    ctaLine: "Start from lessons, then reinforce with pathway-scoped questions.",
  },
  {
    professionKey: "respiratory",
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
    professionKey: "paramedic",
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
    professionKey: "pharmacy-tech",
    segment: "pharmacy-tech-exam-prep",
    pathwayId: US_ALLIED,
    title: "Pharmacy technician exam prep | NurseNest",
    description:
      "Calculations, high-alert meds, sterile technique, and regulatory edges for pharmacy technician certification — allied pathway scope.",
    h1: "Pharmacy technician exam prep",
    examOverview: [
      "Pharmacy tech exams stress accuracy and policy — alternate calculation drills with rationale review.",
      "Keep sessions short; repeat weak areas until patterns stick.",
    ],
    features: [
      "Tier-scoped content — no nursing-only pathways in allied learner views.",
      "Lesson lists stay paginated as the catalog grows.",
      "Honest readiness language — we never promise pass outcomes.",
    ],
    ctaLine: "Use lessons as your map, then practice under the same allied entitlement.",
  },
  {
    professionKey: "social-work",
    segment: "social-work-exam-prep",
    pathwayId: US_ALLIED,
    title: "Social work licensing exam prep | NurseNest",
    description:
      "Ethics, assessment, intervention planning, and boundaries for social work exam contexts — allied-tier pathway scope.",
    h1: "Social work exam prep",
    examOverview: [
      "Licensing items often test judgment under ambiguity — rehearse with scenario-heavy rationales.",
      "Alternate reading with short question bursts to keep context switching realistic.",
    ],
    features: [
      "Breadcrumb UI + JSON-LD on public marketing routes.",
      "Private dashboards and planner surfaces stay noindex.",
      "Profession-specific recommendations when you set your allied track in settings.",
    ],
    ctaLine: "Browse lessons on paginated hubs, then align questions with your plan.",
  },
];

export function listAlliedProfessionsSorted(): AlliedProfessionMarketing[] {
  return [...ALLIED_PROFESSIONS].sort((a, b) => a.segment.localeCompare(b.segment));
}

/** @deprecated use getAlliedProfessionByHeroSegment */
export function getAlliedProfessionBySegment(segment: string): AlliedProfessionMarketing | undefined {
  return ALLIED_PROFESSIONS.find((p) => p.segment === segment);
}

export function getAlliedProfessionByHeroSegment(segment: string): AlliedProfessionMarketing | undefined {
  return getAlliedProfessionBySegment(segment);
}

export function getAlliedProfessionByProfessionKey(key: string): AlliedProfessionMarketing | undefined {
  const k = key.trim().toLowerCase();
  return ALLIED_PROFESSIONS.find((p) => p.professionKey === k);
}

export function isAlliedHeroExamPrepSlug(slug: string): boolean {
  return slug.endsWith("-exam-prep");
}

/**
 * Resolve a `[slug]` param: hero `*-exam-prep` or short `professionKey`.
 */
export function resolveAlliedProfessionFromRouteSlug(slug: string): AlliedProfessionMarketing | undefined {
  const s = slug.trim();
  if (!s) return undefined;
  if (isAlliedHeroExamPrepSlug(s)) return getAlliedProfessionByHeroSegment(s);
  return getAlliedProfessionByProfessionKey(s);
}

export function getPathwayOrThrow(pathwayId: string): ExamPathwayDefinition | undefined {
  return getExamPathwayById(pathwayId);
}

/** Valid values for `User.alliedProfessionKey` */
export const ALLIED_PROFESSION_KEYS = ALLIED_PROFESSIONS.map((p) => p.professionKey);
