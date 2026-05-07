/**
 * Canonical list of high-value public marketing routes for production smoke / regression gates.
 * Prefer route builders from marketing + pathway modules — avoid ad hoc duplicate path strings.
 */

import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import { ALLIED, HUB, NP, PN } from "@/lib/marketing/marketing-entry-routes";
import { listNewGradWorkAreaSlugs } from "@/lib/new-grad/new-grad-work-areas";
import { newGradWorkAreaHubPath } from "@/lib/navigation/new-grad-marketing-hub-paths";
import { publicNewGradStudyDestinations } from "@/lib/navigation/marketing-pathway-nav-destinations";

const US_RN_HUB = CANONICAL_PATHWAY_HUB.usRn;
const CA_RN_HUB = CANONICAL_PATHWAY_HUB.caRn;

/** Stable, deduped public paths (English-default shell, no `/[locale]` prefix unless required). */
export function getProductionSmokePublicPaths(): readonly string[] {
  const usNewGrad = publicNewGradStudyDestinations("US", US_RN_HUB);
  const caNewGrad = publicNewGradStudyDestinations("CA", CA_RN_HUB);
  const set = new Set<string>([
    "/",
    HUB.pricing,
    "/blog",
    "/faq",
    "/pre-nursing",
    HUB.tools,
    HUB.examLessons,
    HUB.questionBank,
    HUB.practiceExams,
    HUB.flashcards,
    US_RN_HUB,
    `${US_RN_HUB}/lessons`,
    `${US_RN_HUB}/questions`,
    CA_RN_HUB,
    `${CA_RN_HUB}/lessons`,
    PN.usLessons,
    PN.usQuestions,
    PN.caHub,
    `${PN.caHub}/lessons`,
    NP.practiceProgrammatic,
    NP.aanpPracticeTest,
    NP.caNpHub,
    `${NP.caNpHub}/lessons`,
    ALLIED.marketingLanding(),
    ALLIED.usHub,
    ALLIED.caHub,
    usNewGrad.hubHref,
    usNewGrad.lessons,
    newGradWorkAreaHubPath("us", listNewGradWorkAreaSlugs()[0] ?? "med-surg"),
    caNewGrad.hubHref,
    newGradWorkAreaHubPath("canada", listNewGradWorkAreaSlugs()[0] ?? "med-surg"),
    "/sitemap.xml",
    "/robots.txt",
  ]);
  return [...set].sort((a, b) => a.localeCompare(b));
}

/**
 * Visible HTML / innerText must contain at least one of these substrings (case-sensitive where noted).
 * Keeps deploy gate aligned with real shipped copy — update when product copy intentionally changes.
 */
export const PRODUCTION_ROUTE_HTML_SUBSTRING_ASSERTIONS: Readonly<Record<string, readonly string[]>> = {
  "/": ["Canada-First Nursing Exam Prep"],
  "/pricing": ["Continue to checkout"],
  "/blog": ["NurseNest"],
  "/faq": ["FAQ"],
  "/pre-nursing": ["Pre-Nursing"],
  "/tools": ["NurseNest"],
  [HUB.examLessons]: ["Lessons"],
  [HUB.questionBank]: ["Question"],
  [US_RN_HUB]: ["NCLEX"],
  [ALLIED.marketingLanding()]: ["Allied"],
};
