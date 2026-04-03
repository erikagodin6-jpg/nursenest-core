"use client";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { NP } from "@/lib/marketing/marketing-entry-routes";
import { PH } from "@/lib/observability/posthog-conversion-events";

export function NpQuestionsHubBoardLinks({ pathwayId }: { pathwayId: string }) {
  const ev = PH.marketingPathwayHubCta;
  const surface = "questions_hub_board_link" as const;

  if (pathwayId === "us-np-fnp") {
    return (
      <p className="mt-3 text-[var(--theme-muted-text)]">
        <MarketingTrackedLink
          href={NP.aanpPracticeTest}
          event={ev}
          eventProps={{ surface, pathway_id: pathwayId, link_target: "aanp_practice_test" }}
          className="font-semibold text-primary hover:underline"
        >
          AANP practice test
        </MarketingTrackedLink>
        {" · "}
        <MarketingTrackedLink
          href={NP.anccFnpPracticeTest}
          event={ev}
          eventProps={{ surface, pathway_id: pathwayId, link_target: "ancc_fnp_practice_test" }}
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
          eventProps={{ surface, pathway_id: pathwayId, link_target: "pmhnp_practice_test" }}
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
          eventProps={{ surface, pathway_id: pathwayId, link_target: "cnple_practice_test" }}
          className="font-semibold text-primary hover:underline"
        >
          CNPLE practice test
        </MarketingTrackedLink>
      </p>
    );
  }
  return null;
}
