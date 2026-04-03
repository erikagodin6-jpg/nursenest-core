"use client";

import Link from "next/link";
import type { AdaptiveLearnerRecommendations } from "@/lib/learner/adaptive-recommendations";
import { AdaptiveStudyOverview } from "@/components/student/adaptive-study-overview";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type Props = {
  adaptive: AdaptiveLearnerRecommendations;
  /** Defaults for default-locale marketing home; pass prefixed hrefs from `/[locale]` pages. */
  pricingHref?: string;
  signupHref?: string;
};

/**
 * Marketing homepage: illustrates Study Next with the same engine as subscribers, using fixed sample inputs.
 * Not indexed as personalized content — plain section, no structured data for “your” plan.
 */
export function HomeStudyNextPreviewSection({
  adaptive,
  pricingHref = "/pricing",
  signupHref = "/signup",
}: Props) {
  const { t } = useMarketingI18n();

  return (
    <section
      className="nn-card space-y-3 p-5 sm:p-6"
      aria-labelledby="home-study-next-preview-title"
      data-testid="home-study-next-preview"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="home-study-next-preview-title" className="text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl">
            {t("home.studyNextPreview.title")}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("home.studyNextPreview.subtitle")}</p>
        </div>
        <Link
          href={pricingHref}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {t("cta.continuePlan")}
        </Link>
      </div>
      <AdaptiveStudyOverview adaptive={adaptive} showHeading={false} compact subscriber={false} />
      <p className="text-xs text-muted-foreground">
        <Link href={signupHref} className="font-semibold text-primary underline-offset-2 hover:underline">
          {t("home.studyNextPreview.signupLink")}
        </Link>{" "}
        {t("home.studyNextPreview.footerAfterLink")}
      </p>
    </section>
  );
}
