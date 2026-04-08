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
  const title = resolveMarketingCopy(
    m,
    "pages.publicQuestionBank.metaTitle",
    en,
    "NCLEX-RN, NCLEX-PN & REx-PN practice questions | NurseNest",
  );
  const description = resolveMarketingCopy(
    m,
    "pages.publicQuestionBank.metaDescription",
    en,
    "Practice nursing licensure questions with rationales: RN, PN/LVN, and NP pathways for the US and Canada. Create a free account to practice in the app.",
  );
  const alt = marketingAlternatesSharedPage(locale, "/test-bank");
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/test-bank"), languages: alt.languages },
    openGraph: { title, description, url: absoluteUrl("/test-bank"), type: "website" },
  };
}

export default async function PublicQuestionBankLandingPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);

  const signupQs = `${withMarketingLocale(locale, "/signup")}?callbackUrl=${encodeURIComponent("/app/questions")}`;

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
          <span className="text-[var(--theme-heading-text)]">{t("pages.publicQuestionBank.breadcrumbCurrent")}</span>
        </nav>
      </div>
      <MarketingPublicStudyLanding
        h1={t("pages.publicQuestionBank.h1")}
        intro={t("pages.publicQuestionBank.intro")}
        primaryCta={{ href: signupQs, label: t("pages.publicQuestionBank.ctaStartPracticing") }}
        secondaryCta={{ href: withMarketingLocale(locale, "/exam-lessons"), label: t("pages.publicQuestionBank.ctaBrowseLessons") }}
        signupCta={undefined}
      >
        <MarketingStudyCrossLinks className="mt-4" />
      </MarketingPublicStudyLanding>
    </>
  );
}
