/**
 * Single country-aware source for marketing exam/program labels (i18n keys) and canonical hrefs.
 * UI resolves `labelKey` with `t(labelKey)` so switching region updates copy immediately.
 *
 * Paths stay aligned with `marketing-entry-routes.ts` and programmatic SEO slugs — do not rename routes here.
 */
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { ALLIED, RN, npPracticeProgrammatic, pnPracticeProgrammatic } from "@/lib/marketing/marketing-entry-routes";

export type CountryExamOfferingId = "rn" | "pn" | "np" | "allied";

/** Sub-navigation strip under the main header (compact exam-focused labels). */
export type ExamNavStripItem = {
  id: CountryExamOfferingId;
  labelKey: string;
  href: string;
};

/**
 * Order: RN, PN, NP, Allied — matches product breadth and keeps LPN/RPN context in the PN row only.
 */
export function getExamNavStripItems(region: MarketingRegionToggle): ExamNavStripItem[] {
  const isUs = region === "US";
  return [
    {
      id: "rn",
      labelKey: "nav.examStrip.rn",
      href: RN.practiceProgrammatic,
    },
    {
      id: "pn",
      labelKey: isUs ? "nav.examStrip.pnUS" : "nav.examStrip.pnCA",
      href: pnPracticeProgrammatic(region),
    },
    {
      id: "np",
      labelKey: isUs ? "nav.examStrip.npUS" : "nav.examStrip.npCA",
      href: npPracticeProgrammatic(region),
    },
    {
      id: "allied",
      labelKey: isUs ? "nav.examStrip.alliedUS" : "nav.examStrip.alliedCA",
      href: ALLIED.marketingLanding(),
    },
  ];
}
