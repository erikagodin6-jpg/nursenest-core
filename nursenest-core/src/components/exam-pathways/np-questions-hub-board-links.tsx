"use client";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { NP } from "@/lib/marketing/marketing-entry-routes";
import type { PathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";

export type NpQuestionsHubBoardLinkContext = PathwayMarketingHubLinkContext;

export function NpQuestionsHubBoardLinks({
  pathwayId,
  linkContext,
  surface = "questions_hub_board_link",
}: {
  pathwayId: string;
  /** From `pathwayMarketingHubLinkContext(pathway, npAliasSegment)` — includes `pathway_id`, alias dimensions, canonical hub path. */
  linkContext: NpQuestionsHubBoardLinkContext;
  surface?: string;
}) {
  const ev = PH.marketingPathwayHubCta;
  const baseProps = {
    ...linkContext,
    surface,
    pathway_id: pathwayId,
    destination_type: "cat_practice_tests" as const,
  };

  if (pathwayId === "us-np-fnp") {
    return (
      <p className="mt-3 text-[var(--theme-muted-text)]">
        <MarketingTrackedLink
          href={NP.aanpPracticeTest}
          event={ev}
          eventProps={{ ...baseProps, link_target: "aanp_practice_test" }}
          className="font-semibold text-primary hover:underline"
        >
          AANP practice test
        </MarketingTrackedLink>
        {" · "}
        <MarketingTrackedLink
          href={NP.anccFnpPracticeTest}
          event={ev}
          eventProps={{ ...baseProps, link_target: "ancc_fnp_practice_test" }}
          className="font-semibold text-primary hover:underline"
        >
          ANCC FNP practice test
        </MarketingTrackedLink>
      </p>
    );
  }
  if (pathwayId === "us-np-pmhnp") {
    return (
      <p className="mt-3 text-[var(--theme-muted-text)]">
        <MarketingTrackedLink
          href={NP.pmhnpPracticeTest}
          event={ev}
          eventProps={{ ...baseProps, link_target: "pmhnp_practice_test" }}
          className="font-semibold text-primary hover:underline"
        >
          PMHNP practice test
        </MarketingTrackedLink>
      </p>
    );
  }
  if (pathwayId === "ca-np-cnple") {
    return (
      <p className="mt-3 text-[var(--theme-muted-text)]">
        <MarketingTrackedLink
          href={NP.cnplePracticeTest}
          event={ev}
          eventProps={{ ...baseProps, link_target: "cnple_practice_test" }}
          className="font-semibold text-primary hover:underline"
        >
          CNPLE practice test
        </MarketingTrackedLink>
      </p>
    );
  }
  return null;
}
