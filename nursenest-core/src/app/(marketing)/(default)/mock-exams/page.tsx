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
    "pages.publicMockExams.metaTitle",
    en,
    "Practice exams & CAT-style simulations | NCLEX-RN, NCLEX-PN, REx-PN | NurseNest",
  );
  const description = resolveMarketingCopy(
    m,
    "pages.publicMockExams.metaDescription",
    en,
    "Timed practice exams and computer-adaptive style sessions for nursing licensure. Sign in to run mocks in the app; previews and pathways are organized by exam.",
  );
  const alt = marketingAlternatesSharedPage(locale, "/mock-exams");
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/mock-exams"), languages: alt.languages },
    openGraph: { title, description, url: absoluteUrl("/mock-exams"), type: "website" },
  };
}

export default async function PublicMockExamsLandingPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);

  const signupExams = `${withMarketingLocale(locale, "/signup")}?callbackUrl=${encodeURIComponent("/app/exams")}`;

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
          <span className="text-[var(--theme-heading-text)]">{t("pages.publicMockExams.breadcrumbCurrent")}</span>
        </nav>
      </div>
      <MarketingPublicStudyLanding
        h1={t("pages.publicMockExams.h1")}
        intro={t("pages.publicMockExams.intro")}
        primaryCta={{ href: signupExams, label: t("pages.publicMockExams.ctaStartPracticeExam") }}
        secondaryCta={{ href: withMarketingLocale(locale, "/exam-lessons"), label: t("pages.publicMockExams.ctaReviewLessons") }}
      >
        <MarketingStudyCrossLinks className="mt-4" />
      </MarketingPublicStudyLanding>
    </>
  );
}
