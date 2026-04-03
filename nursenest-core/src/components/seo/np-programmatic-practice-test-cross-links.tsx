"use client";

import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { NP } from "@/lib/marketing/marketing-entry-routes";
import { PH } from "@/lib/observability/posthog-conversion-events";

const NP_PRACTICE_SLUGS = new Set(["np-exam-practice-questions", "cnple-practice-questions"]);

/**
 * Contextual links from NP programmatic guides to board-named pathway URLs (default-locale paths; locale wrapper applied).
 */
export function NpProgrammaticPracticeTestCrossLinks({ slug, locale }: { slug: string; locale: string }) {
  if (!NP_PRACTICE_SLUGS.has(slug)) return null;
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);
  const base = { event: PH.marketingPathwayHubCta as const, surface: "programmatic_np_board_crosslink" as const };

  if (slug === "cnple-practice-questions") {
    return (
      <section className="mb-10 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/40 p-5 sm:p-6" aria-labelledby="np-board-hubs-heading">
        <h2 id="np-board-hubs-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          CNPLE keyword hub
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">
          Prefer a single landing that says CNPLE in the URL? Open the{" "}
          <MarketingTrackedLink
            href={loc(NP.cnplePracticeTest)}
            event={base.event}
            eventProps={{ ...base, pathway_id: "ca-np-cnple", link_target: "cnple_practice_test" }}
            className="font-semibold text-primary hover:underline"
          >
            CNPLE practice test
          </MarketingTrackedLink>{" "}
          page—same Canadian NP pathway as <code className="rounded bg-muted px-1 py-0.5 text-xs">/canada/np/cnple</code>.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-10 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/40 p-5 sm:p-6" aria-labelledby="np-board-hubs-heading">
      <h2 id="np-board-hubs-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
        Board-named NP practice hubs
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">
        {region === "US" ? (
          <>
            US Family NP candidates often search by certifying body. These URLs use the same FNP pathway as{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">/us/np/fnm</code>…{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">/us/np/fnp</code>:{" "}
            <MarketingTrackedLink
              href={loc(NP.aanpPracticeTest)}
              event={base.event}
              eventProps={{ ...base, pathway_id: "us-np-fnp", link_target: "aanp_practice_test" }}
              className="font-semibold text-primary hover:underline"
            >
              AANP practice test
            </MarketingTrackedLink>
            ,{" "}
            <MarketingTrackedLink
              href={loc(NP.anccFnpPracticeTest)}
              event={base.event}
              eventProps={{ ...base, pathway_id: "us-np-fnp", link_target: "ancc_fnp_practice_test" }}
              className="font-semibold text-primary hover:underline"
            >
              ANCC FNP practice test
            </MarketingTrackedLink>
            . Psychiatric–mental health NP:{" "}
            <MarketingTrackedLink
              href={loc(NP.pmhnpPracticeTest)}
              event={base.event}
              eventProps={{ ...base, pathway_id: "us-np-pmhnp", link_target: "pmhnp_practice_test" }}
              className="font-semibold text-primary hover:underline"
            >
              PMHNP practice test
            </MarketingTrackedLink>
            .
          </>
        ) : (
          <>
            Canadian NP: use the{" "}
            <MarketingTrackedLink
              href={loc(NP.cnplePracticeTest)}
              event={base.event}
              eventProps={{ ...base, pathway_id: "ca-np-cnple", link_target: "cnple_practice_test" }}
              className="font-semibold text-primary hover:underline"
            >
              CNPLE practice test
            </MarketingTrackedLink>{" "}
            landing (same pathway as <code className="rounded bg-muted px-1 py-0.5 text-xs">/canada/np/cnple</code>).
          </>
        )}
      </p>
    </section>
  );
}
