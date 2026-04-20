import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { examLessonsIndexBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { MarketingPublicStudyLanding } from "@/components/marketing/marketing-public-study-landing";
import { PublicLessonsPathwaySections } from "@/components/marketing/public-lessons-pathway-sections";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { HUB, loginWithCallback, rnQuestions, signupWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";

/** Shared server component for both the default-locale and non-default-locale lessons landing. */
export async function PublicLessonsHubView({ locale }: { locale: string }) {
  const marketingRegion = (await getMarketingRegionFromCookies()) as MarketingRegionToggle;
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);
  const h1Key = marketingRegion === "US" ? "pages.publicLessons.h1US" : "pages.publicLessons.h1CA";
  const introKey = marketingRegion === "US" ? "pages.publicLessons.introUS" : "pages.publicLessons.introCA";
  const signupLessons = withMarketingLocale(locale, signupWithCallback(HUB.examLessons));

  const { crumbs, schemaItems } = examLessonsIndexBreadcrumbs();

  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
        <BreadcrumbTrail items={crumbs} navClassName="nn-marketing-caption" />
      </div>
      <MarketingPublicStudyLanding
        h1={t(h1Key)}
        intro={t(introKey)}
        primaryCta={{
          href: `${withMarketingLocale(locale, "/lessons")}#exam-pathways`,
          label: t("pages.publicLessons.ctaBrowseByExam"),
        }}
        secondaryCta={{
          href: withMarketingLocale(locale, rnQuestions(marketingRegion)),
          label: t("pages.publicLessons.ctaPracticeQuestions"),
        }}
        signupCta={{ href: signupLessons, label: t("pages.publicLessons.ctaCreateAccount") }}
      >
        <PublicLessonsPathwaySections locale={locale} region={marketingRegion} />
        <p className="nn-marketing-body-sm text-muted">
          {t("pages.examLessons.appLessonsLead")}{" "}
          <Link href={loginWithCallback(HUB.examLessons)} className="font-semibold text-primary">
            {t("pages.examLessons.appLessonsLink")}
          </Link>
        </p>
        <MarketingStudyCrossLinks className="mt-4" />
      </MarketingPublicStudyLanding>
    </>
  );
}
