/**
 * Public marketing header tier hub row (RN / PN / NP / New grad / Allied) — labels + hub URLs only.
 *
 * Uses {@link marketing-entry-routes} hub helpers only (no `exam-product-registry`, no allied
 * profession catalog). Keep URLs aligned with {@link marketingExamHubPath} / canonical hubs.
 */
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { alliedHub, HUB, NP, pnPrimaryHub } from "@/lib/marketing/marketing-entry-routes";
import type { MarketingPathwayMegaMenuKey } from "@/lib/navigation/marketing-mega-menu-active-prefixes";

export type MarketingTierHubKey = MarketingPathwayMegaMenuKey;

export type MarketingTierHubStripItem = {
  key: MarketingTierHubKey;
  label: string;
  hubHref: string;
};

/**
 * US new-grad transition lessons hub — must stay aligned with pathway `us-rn-new-grad-transition`
 * (`buildExamPathwayPath` → `/us/rn/new-grad-transition/lessons`).
 */
const US_NEW_GRAD_TRANSITION_LESSONS_HREF = "/us/rn/new-grad-transition/lessons" as const;

type TFn = (key: string) => string;

function tierHubHrefForOffering(region: MarketingRegionToggle, offering: "rn" | "pn" | "np" | "allied"): string {
  if (offering === "rn") return HUB.examLessons;
  if (offering === "pn") return pnPrimaryHub(region);
  if (offering === "np") return region === "US" ? NP.practiceProgrammatic : NP.practiceProgrammaticCa;
  return alliedHub(region);
}

export function buildMarketingTierHubStrip(region: MarketingRegionToggle, t: TFn): MarketingTierHubStripItem[] {
  const rnHub = tierHubHrefForOffering(region, "rn");
  const pnHub = tierHubHrefForOffering(region, "pn");
  const npHub = tierHubHrefForOffering(region, "np");
  const alliedHubHref = tierHubHrefForOffering(region, "allied");
  const newGradHubHref = region === "US" ? US_NEW_GRAD_TRANSITION_LESSONS_HREF : rnHub;

  return [
    { key: "rn", label: t("nav.mega.rn.label"), hubHref: rnHub },
    { key: "pn", label: region === "US" ? t("nav.mega.pn.labelUS") : t("nav.mega.pn.labelCA"), hubHref: pnHub },
    { key: "np", label: t("nav.mega.np.label"), hubHref: npHub },
    { key: "newgrad", label: t("nav.mega.newGrad.label"), hubHref: newGradHubHref },
    { key: "allied", label: t("nav.mega.allied.label"), hubHref: alliedHubHref },
  ];
}
