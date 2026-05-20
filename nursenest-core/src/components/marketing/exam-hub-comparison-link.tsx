"use client";

import Link from "next/link";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Deep link to the homepage competitor-comparison section (anchor shared with HomeComparisonSection).
 */
export function ExamHubComparisonLink() {
  const { t, locale } = useMarketingI18n();
  const homeHref = `${withMarketingLocale(locale, "/")}#home-comparison-heading`;
  return (
    <p className="nn-marketing-body-sm mt-4 max-w-2xl text-[var(--theme-muted-text)]">
      <Link href={homeHref} className="font-semibold text-primary underline-offset-4 hover:underline">
        {t("home.comparison.hubLink")}
      </Link>
    </p>
  );
}
