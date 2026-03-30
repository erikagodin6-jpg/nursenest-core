import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getProgrammaticSeoPage } from "@/lib/seo/programmatic-registry";

/**
 * Primary indexable programmatic URL for each product pathway (`/{slug}`).
 * Labels come from `getProgrammaticSeoPage(slug).h1` so breadcrumbs match the public page title.
 *
 * **US NCLEX-PN → `rex-pn-practice-questions`:** there is no separate NCLEX-PN-only slug in
 * `programmatic-registry`; that page’s h1 explicitly includes NCLEX-PN alongside REx-PN.
 *
 * **Allied → `allied-health-career-guides`:** only allied-themed programmatic entry today;
 * it leans career context while hubs are exam prep. Still the closest registry parent.
 *
 * **NP + CNPLE → `np-exam-practice-questions`:** shared umbrella for all NP tracks until
 * per-specialty programmatic pages exist.
 */
const PATHWAY_ID_TO_PROGRAMMATIC_SLUG: Record<string, string> = {
  "ca-rpn-rex-pn": "rex-pn-practice-questions",
  "ca-rn-nclex-rn": "nclex-rn-practice-questions",
  "us-rn-nclex-rn": "nclex-rn-practice-questions",
  "us-lpn-nclex-pn": "rex-pn-practice-questions",
  "us-np-fnp": "np-exam-practice-questions",
  "us-np-agpcnp": "np-exam-practice-questions",
  "us-np-pmhnp": "np-exam-practice-questions",
  "ca-np-cnple": "np-exam-practice-questions",
  "ca-allied-core": "allied-health-career-guides",
  "us-allied-core": "allied-health-career-guides",
};

export function getPathwayProgrammaticSeoLanding(pathway: ExamPathwayDefinition): { path: string; label: string } | null {
  const slug = PATHWAY_ID_TO_PROGRAMMATIC_SLUG[pathway.id];
  if (!slug) return null;
  const page = getProgrammaticSeoPage(slug);
  if (!page) return null;
  return { path: `/${slug}`, label: page.h1 };
}
