"use client";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { NP } from "@/lib/marketing/marketing-entry-routes";
import { npBoardAliasCrosslinkProps } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";

/** Inbound links from the public FNP lessons hub to board-named NP practice-test URLs (same pathway). */
export function FnpLessonsNpBoardCrosslinks() {
  const ev = PH.marketingPathwayHubCta;
  const surface = "fnp_lessons_board_link" as const;
  const pid = "us-np-fnp";
  const dims = npBoardAliasCrosslinkProps(pid);
  return (
    <p className="mt-4 text-sm leading-relaxed text-[var(--theme-muted-text)]">
      Prefer a board-named landing? Use the{" "}
      <MarketingTrackedLink
        href={NP.aanpPracticeTest}
        event={ev}
        eventProps={{ surface, pathway_id: pid, link_target: "aanp_practice_test", ...dims }}
        className="font-semibold text-primary hover:underline"
      >
        AANP practice test
      </MarketingTrackedLink>{" "}
      or{" "}
      <MarketingTrackedLink
        href={NP.anccFnpPracticeTest}
        event={ev}
        eventProps={{ surface, pathway_id: pid, link_target: "ancc_fnp_practice_test", ...dims }}
        className="font-semibold text-primary hover:underline"
      >
        ANCC FNP practice test
      </MarketingTrackedLink>{" "}
      hub—same FNP lessons and question scope.
    </p>
  );
}
