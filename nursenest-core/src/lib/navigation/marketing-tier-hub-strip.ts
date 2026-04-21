/**
 * Public marketing header tier hub row (RN / PN / NP / New grad / Allied) — labels + hub URLs only.
 *
 * Hub URLs align with {@link marketingExamHubPath} / mega menus (same pathway roots as
 * {@link publicExamPrepHubDestinations}); do not send tier clicks to the shared `/lessons` index unless
 * that surface is the canonical hub for an offering (it is not for RN).
 */
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import type { MarketingPathwayMegaMenuKey } from "@/lib/navigation/marketing-mega-menu-active-prefixes";
import { publicNewGradStudyDestinations } from "@/lib/navigation/marketing-pathway-nav-destinations";

export type MarketingTierHubKey = MarketingPathwayMegaMenuKey;

export type MarketingTierHubStripItem = {
  key: MarketingTierHubKey;
  label: string;
  hubHref: string;
};

type TFn = (key: string) => string;

function tierHubHrefForOffering(region: MarketingRegionToggle, offering: "rn" | "pn" | "np" | "allied"): string {
  return marketingExamHubPath(region, offering);
}

export function buildMarketingTierHubStrip(region: MarketingRegionToggle, t: TFn): MarketingTierHubStripItem[] {
  const rnHub = tierHubHrefForOffering(region, "rn");
  const pnHub = tierHubHrefForOffering(region, "pn");
  const npHub = tierHubHrefForOffering(region, "np");
  const alliedHubHref = tierHubHrefForOffering(region, "allied");
  const newGradHubHref = publicNewGradStudyDestinations(region, rnHub).hubHref;

  return [
    { key: "rn", label: t("nav.mega.rn.label"), hubHref: rnHub },
    { key: "pn", label: region === "US" ? t("nav.mega.pn.labelUS") : t("nav.mega.pn.labelCA"), hubHref: pnHub },
    { key: "np", label: t("nav.mega.np.label"), hubHref: npHub },
    { key: "newgrad", label: t("nav.mega.newGrad.label"), hubHref: newGradHubHref },
    { key: "allied", label: t("nav.mega.allied.label"), hubHref: alliedHubHref },
  ];
}
