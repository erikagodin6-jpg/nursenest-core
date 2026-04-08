import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPublicStudyLanding } from "@/components/marketing/marketing-public-study-landing";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage, resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title = resolveMarketingCopy(m, "pages.publicLessons.metaTitle", en, "Nursing exam lessons | NCLEX-RN, NCLEX-PN, REx-PN, NP | NurseNest");
  const description = resolveMarketingCopy(
    m,
    "pages.publicLessons.metaDescription",
    en,
    "Browse pathway-scoped clinical lessons for US and Canada: NCLEX-RN, NCLEX-PN, REx-PN, and NP tracks. Previews are public; full depth unlocks with a matching plan.",
  );
  const alt = marketingAlternatesSharedPage(locale, "/lessons");
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/lessons"), languages: alt.languages },
    openGraph: { title, description, url: absoluteUrl("/lessons"), type: "website" },
  };
}

export default async function PublicLessonsLandingPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);

  const signupLessons = `${withMarketingLocale(locale, "/signup")}?callbackUrl=${encodeURIComponent("/exam-lessons")}`;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
        <nav className="text-sm text-[var(--theme-muted-text)]">
          <Link href={withMarketingLocale(locale, "/")} className="hover:text-primary">
            {t("nav.home")}
          </Link>
          <span className="mx-1.5" aria-hidden>
            /
          </span>
          <span className="text-[var(--theme-heading-text)]">{t("pages.publicLessons.breadcrumbCurrent")}</span>
        </nav>
      </div>
      <MarketingPublicStudyLanding
        h1={t("pages.publicLessons.h1")}
        intro={t("pages.publicLessons.intro")}
        primaryCta={{ href: withMarketingLocale(locale, "/exam-lessons"), label: t("pages.publicLessons.ctaBrowseByExam") }}
        secondaryCta={{ href: withMarketingLocale(locale, "/test-bank"), label: t("pages.publicLessons.ctaPracticeQuestions") }}
        signupCta={{ href: signupLessons, label: t("pages.publicLessons.ctaCreateAccount") }}
      >
        <MarketingStudyCrossLinks className="mt-4" />
      </MarketingPublicStudyLanding>
    </>
  );
}
