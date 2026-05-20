/**
 * REx-PN SEO cluster — authoritative knowledge graph for the Canadian RPN exam prep lane.
 *
 * REx-PN (Registered Practical Nurse Entry-to-Practice Examination) is administered by
 * Canadian Nurses Association (CNA). It uses Computerized Adaptive Testing (CAT).
 * NurseNest is an independent prep platform and is not affiliated with CNA or CNO.
 */

/** Legacy RPN marketing aliases — prefer canonical `/canada/pn/rex-pn` (301 from `/canada/pn/rex-pn/*`). */
export const REX_PN_HUB = "/canada/pn/rex-pn" as const;
export const REX_PN_QUESTIONS = "/canada/pn/rex-pn/questions" as const;
export const REX_PN_STUDY_GUIDE = "/canada/pn/rex-pn/study-guide" as const;
export const REX_PN_CAT = "/canada/pn/rex-pn/cat" as const;
export const REX_PN_PHARMACOLOGY = "/canada/pn/rex-pn/pharmacology" as const;
export const REX_PN_CLIENT_NEEDS = "/canada/pn/rex-pn/client-needs" as const;

export const REX_PN_CLUSTER = {
  hub: REX_PN_HUB,
  questions: REX_PN_QUESTIONS,
  studyGuide: REX_PN_STUDY_GUIDE,
  cat: REX_PN_CAT,
  pharmacology: REX_PN_PHARMACOLOGY,
  clientNeeds: REX_PN_CLIENT_NEEDS,
} as const;

export type RexPnClusterPath = (typeof REX_PN_CLUSTER)[keyof typeof REX_PN_CLUSTER];

export const REX_PN_RELATED_LINKS: readonly { href: string; label: string }[] = [
  { href: REX_PN_HUB, label: "REx-PN Hub" },
  { href: REX_PN_QUESTIONS, label: "Practice Questions" },
  { href: REX_PN_STUDY_GUIDE, label: "Study Guide" },
  { href: REX_PN_CAT, label: "CAT Format" },
  { href: REX_PN_PHARMACOLOGY, label: "Pharmacology" },
  { href: REX_PN_CLIENT_NEEDS, label: "Client Needs" },
  { href: "/canada/pn/rex-pn", label: "REx-PN Prep Hub" },
  { href: "/canada/pn/rex-pn/questions", label: "Question Bank" },
  { href: "/nclex-vs-rex-pn", label: "NCLEX vs REx-PN" },
  { href: "/rex-pn-study-plan", label: "Study Plan" },
  { href: "/exams/canada", label: "Canada Nursing Exams" },
];

export const REX_PN_SITEMAP_PATHS: readonly RexPnClusterPath[] = [
  REX_PN_HUB,
  REX_PN_QUESTIONS,
  REX_PN_STUDY_GUIDE,
  REX_PN_CAT,
  REX_PN_PHARMACOLOGY,
  REX_PN_CLIENT_NEEDS,
];

export const REX_PN_DISCLAIMER =
  "NurseNest is an independent exam prep platform and is not affiliated with or endorsed by the Canadian Nurses Association (CNA) or any provincial regulatory college. " +
  "Practice questions and study domains reflect NurseNest's clinical taxonomy, not confirmed official REx-PN blueprint percentages or item formats. " +
  "Always verify exam details and eligibility directly with your provincial college and CNA.";

export const REX_PN_FRESHNESS_LABEL = "Updated for 2026 REx-PN";
