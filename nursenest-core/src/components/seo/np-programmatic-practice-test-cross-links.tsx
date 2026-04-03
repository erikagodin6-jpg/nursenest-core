"use client";

import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { NP } from "@/lib/marketing/marketing-entry-routes";
import { npBoardAliasCrosslinkProps } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const NP_PRACTICE_SLUGS = new Set(["np-exam-practice-questions", "cnple-practice-questions"]);

/**
 * Contextual links from NP programmatic guides to board-named pathway URLs (default-locale paths; locale wrapper applied).
 */
export function NpProgrammaticPracticeTestCrossLinks({ slug, locale }: { slug: string; locale: string }) {
  const { t } = useMarketingI18n();
  if (!NP_PRACTICE_SLUGS.has(slug)) return null;
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);
  const ev = PH.marketingPathwayHubCta;
  const surface = "programmatic_np_board_crosslink" as const;

  if (slug === "cnple-practice-questions") {
    const ca = npBoardAliasCrosslinkProps("ca-np-cnple");
    return (
      <section
        className="mb-10 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/40 p-5 sm:p-6"
        aria-labelledby="np-board-hubs-heading"
      >
        <h2 id="np-board-hubs-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          {t("programmatic.npCrosslinks.cnpleKeywordHeading")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">
          {t("programmatic.npCrosslinks.cnpleBodyBefore")}
          <MarketingTrackedLink
            href={loc(NP.cnplePracticeTest)}
            event={ev}
            eventProps={{
              surface,
              pathway_id: "ca-np-cnple",
              link_target: "cnple_practice_test",
              ...ca,
            }}
            className="font-semibold text-primary hover:underline"
          >
            {t("programmatic.npCrosslinks.cnpleLink")}
          </MarketingTrackedLink>
          {t("programmatic.npCrosslinks.cnpleBodyAfter")}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">/canada/np/cnple</code>.
        </p>
      </section>
    );
  }

  const usFnp = npBoardAliasCrosslinkProps("us-np-fnp");
  const usPmhnp = npBoardAliasCrosslinkProps("us-np-pmhnp");
  const caCnple = npBoardAliasCrosslinkProps("ca-np-cnple");

  return (
    <section
      className="mb-10 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/40 p-5 sm:p-6"
      aria-labelledby="np-board-hubs-heading"
    >
      <h2 id="np-board-hubs-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
        {t("programmatic.npCrosslinks.boardHubsHeading")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">
        {region === "US" ? (
          <>
            {t("programmatic.npCrosslinks.usBeforeCode")}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">/us/np/fnp</code>
            {t("programmatic.npCrosslinks.usBetweenCodeAndLinks")}
            <MarketingTrackedLink
              href={loc(NP.aanpPracticeTest)}
              event={ev}
              eventProps={{
                surface,
                pathway_id: "us-np-fnp",
                link_target: "aanp_practice_test",
                ...usFnp,
              }}
              className="font-semibold text-primary hover:underline"
            >
              {t("programmatic.npCrosslinks.aanpLink")}
            </MarketingTrackedLink>
            {t("programmatic.npCrosslinks.usBetweenAanpAndAncc")}
            <MarketingTrackedLink
              href={loc(NP.anccFnpPracticeTest)}
              event={ev}
              eventProps={{
                surface,
                pathway_id: "us-np-fnp",
                link_target: "ancc_fnp_practice_test",
                ...usFnp,
              }}
              className="font-semibold text-primary hover:underline"
            >
              {t("programmatic.npCrosslinks.anccLink")}
            </MarketingTrackedLink>
            {t("programmatic.npCrosslinks.usAfterAnccBeforePm")}
            <MarketingTrackedLink
              href={loc(NP.pmhnpPracticeTest)}
              event={ev}
              eventProps={{
                surface,
                pathway_id: "us-np-pmhnp",
                link_target: "pmhnp_practice_test",
                ...usPmhnp,
              }}
              className="font-semibold text-primary hover:underline"
            >
              {t("programmatic.npCrosslinks.pmhnpLink")}
            </MarketingTrackedLink>
            {t("programmatic.npCrosslinks.usEnd")}
          </>
        ) : (
          <>
            {t("programmatic.npCrosslinks.caIntroBefore")}
            <MarketingTrackedLink
              href={loc(NP.cnplePracticeTest)}
              event={ev}
              eventProps={{
                surface,
                pathway_id: "ca-np-cnple",
                link_target: "cnple_practice_test",
                ...caCnple,
              }}
              className="font-semibold text-primary hover:underline"
            >
              {t("programmatic.npCrosslinks.caLink")}
            </MarketingTrackedLink>
            {t("programmatic.npCrosslinks.caIntroAfter")}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">/canada/np/cnple</code>
            {t("programmatic.npCrosslinks.samePathwaySuffix")}
          </>
        )}
      </p>
    </section>
  );
}
