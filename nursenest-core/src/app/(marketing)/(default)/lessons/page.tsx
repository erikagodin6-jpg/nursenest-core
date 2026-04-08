import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPublicStudyLanding } from "@/components/marketing/marketing-public-study-landing";
import { PublicLessonsPathwaySections } from "@/components/marketing/public-lessons-pathway-sections";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage, resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import {
  defaultPublicLessonsMetaDescription,
  defaultPublicLessonsMetaTitle,
} from "@/lib/marketing/nursing-tier-public-labels";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getMarketingLocaleForDefaultRoute();
  const marketingRegion = await getMarketingRegionFromCookies();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const metaSfx = marketingRegion === "US" ? "US" : "CA";
  const title = resolveMarketingCopy(
    m,
    `pages.publicLessons.metaTitle${metaSfx}`,
    en,
    defaultPublicLessonsMetaTitle(marketingRegion),
  );
  const description = resolveMarketingCopy(
    m,
    `pages.publicLessons.metaDescription${metaSfx}`,
    en,
    defaultPublicLessonsMetaDescription(marketingRegion),
  );
  const alt = marketingAlternatesSharedPage(locale, "/lessons");
  return {
    title,
    description,
    alternates: { canonical: alt.canonical, languages: alt.languages },
    openGraph: { title, description, url: alt.canonical, type: "website" },
  };
}

export default async function PublicLessonsLandingPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  const marketingRegion = await getMarketingRegionFromCookies();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);

  const signupLessons = `${withMarketingLocale(locale, "/signup")}?callbackUrl=${encodeURIComponent("/app/lessons")}`;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
        <nav className="nn-marketing-caption" aria-label="Breadcrumb">
          <Link href={withMarketingLocale(locale, "/")} className="hover:text-primary">
            {t("nav.home")}
          </Link>
          <span className="mx-1.5" aria-hidden>
            /
          </span>
          <span className="font-medium text-[var(--theme-heading-text)]">{t("pages.publicLessons.breadcrumbCurrent")}</span>
        </nav>
      </div>
      <MarketingPublicStudyLanding
        h1={t("pages.publicLessons.h1")}
        intro={t("pages.publicLessons.intro")}
        primaryCta={{
          href: `${withMarketingLocale(locale, "/lessons")}#exam-pathways`,
          label: t("pages.publicLessons.ctaBrowseByExam"),
        }}
        secondaryCta={{ href: withMarketingLocale(locale, "/question-bank"), label: t("pages.publicLessons.ctaPracticeQuestions") }}
        signupCta={{ href: signupLessons, label: t("pages.publicLessons.ctaCreateAccount") }}
      >
        <PublicLessonsPathwaySections locale={locale} region={marketingRegion} />
        <p className="nn-marketing-body-sm text-muted">
          {t("pages.examLessons.appLessonsLead")}{" "}
          <Link href={loginWithCallback("/app/lessons")} className="font-semibold text-primary">
            {t("pages.examLessons.appLessonsLink")}
          </Link>
        </p>
        <MarketingStudyCrossLinks className="mt-4" />
      </MarketingPublicStudyLanding>
    </>
  );
}
