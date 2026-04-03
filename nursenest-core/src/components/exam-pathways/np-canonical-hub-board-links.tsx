"use client";

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { NP } from "@/lib/marketing/marketing-entry-routes";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";

/**
 * Inbound links from canonical NP hubs to board-named SEO URLs (single pathway; no duplicate trees).
 */
export function NpCanonicalHubBoardLinks({ pathway }: { pathway: ExamPathwayDefinition }) {
  const ev = PH.marketingPathwayHubCta;
  const linkCtx = pathwayMarketingHubLinkContext(pathway, undefined);
  const base = {
    ...linkCtx,
    surface: "canonical_hub_board_link" as const,
    destination_type: "cat_practice_tests" as const,
  };

  if (pathway.id === "us-np-fnp") {
    return (
      <aside className="nn-card mt-8 border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/60 px-4 py-4 text-sm text-[var(--theme-body-text)] sm:px-5">
        <h2 className="text-sm font-bold text-[var(--theme-heading-text)]">Looking for a board-named start page?</h2>
        <p className="mt-2 leading-relaxed text-[var(--theme-muted-text)]">
          Same Family NP track—pick the label that matches how you search:{" "}
          <MarketingTrackedLink
            href={NP.aanpPracticeTest}
            event={ev}
            eventProps={{ ...base, link_target: "aanp_practice_test" }}
            className="font-semibold text-primary hover:underline"
          >
            AANP practice test
          </MarketingTrackedLink>
          ,{" "}
          <MarketingTrackedLink
            href={NP.anccFnpPracticeTest}
            event={ev}
            eventProps={{ ...base, link_target: "ancc_fnp_practice_test" }}
            className="font-semibold text-primary hover:underline"
          >
            ANCC FNP practice test
          </MarketingTrackedLink>
          .
        </p>
      </aside>
    );
  }

  if (pathway.id === "us-np-pmhnp") {
    return (
      <aside className="nn-card mt-8 border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/60 px-4 py-4 text-sm text-[var(--theme-body-text)] sm:px-5">
        <h2 className="text-sm font-bold text-[var(--theme-heading-text)]">PMHNP keyword landing</h2>
        <p className="mt-2 leading-relaxed text-[var(--theme-muted-text)]">
          Prefer that phrasing in search? Use the{" "}
          <MarketingTrackedLink
            href={NP.pmhnpPracticeTest}
            event={ev}
            eventProps={{ ...base, link_target: "pmhnp_practice_test" }}
            className="font-semibold text-primary hover:underline"
          >
            PMHNP practice test
          </MarketingTrackedLink>{" "}
          URL—it resolves to this same pathway.
        </p>
      </aside>
    );
  }

  if (pathway.id === "ca-np-cnple") {
    return (
      <aside className="nn-card mt-8 border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/60 px-4 py-4 text-sm text-[var(--theme-body-text)] sm:px-5">
        <h2 className="text-sm font-bold text-[var(--theme-heading-text)]">CNPLE-oriented entry</h2>
        <p className="mt-2 leading-relaxed text-[var(--theme-muted-text)]">
          If you landed from a CNPLE search, the{" "}
          <MarketingTrackedLink
            href={NP.cnplePracticeTest}
            event={ev}
            eventProps={{ ...base, link_target: "cnple_practice_test" }}
            className="font-semibold text-primary hover:underline"
          >
            CNPLE practice test
          </MarketingTrackedLink>{" "}
          page is the same Canadian NP hub with a board-friendly URL.
        </p>
      </aside>
    );
  }

  return null;
}
