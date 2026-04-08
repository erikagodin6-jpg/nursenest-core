import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { MarketingPublicStudyLanding } from "@/components/marketing/marketing-public-study-landing";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
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
    "pages.publicPracticeExams.metaTitle",
    en,
    "NCLEX & REx-PN practice exams and mock tests | NurseNest",
  );
  const description = resolveMarketingCopy(
    m,
    "pages.publicPracticeExams.metaDescription",
    en,
    "Timed practice exams and computer-adaptive style sessions for nursing students. Create an account to launch mocks in the app; content is organized by RN, PN, NP, and Allied pathways.",
  );
  const alt = marketingAlternatesSharedPage(locale, "/practice-exams");
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/practice-exams"), languages: alt.languages },
    openGraph: { title, description, url: absoluteUrl("/practice-exams"), type: "website" },
  };
}

export default async function PracticeExamsHubPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);

  const appExams = loginWithCallback("/app/exams");
  const appPracticeTests = loginWithCallback("/app/practice-tests");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-[var(--nn-rhythm-section-y)] nn-marketing-x nn-rhythm-page">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Practice exams", path: "/practice-exams" },
        ]}
      />
      <nav className="text-sm text-[var(--theme-muted-text)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={withMarketingLocale(locale, "/")} className="text-primary underline">
              {t("nav.home")}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--theme-heading-text)]">{t("pages.publicPracticeExams.breadcrumbCurrent")}</li>
        </ol>
      </nav>

      <MarketingPublicStudyLanding
        h1={t("pages.publicPracticeExams.h1")}
        intro={t("pages.publicPracticeExams.intro")}
        primaryCta={{ href: appExams, label: t("pages.publicPracticeExams.ctaPrimary") }}
        secondaryCta={{
          href: withMarketingLocale(locale, "/question-bank"),
          label: t("pages.publicPracticeExams.ctaSecondaryQuestions"),
        }}
      />

      <section className="nn-card p-5" aria-labelledby="timed-mocks">
        <h2 id="timed-mocks" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          Timed mock exams
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Full-length or section-timed attempts with review of rationales and history—available to subscribers in the app for their
          entitled pathway. Use this when you want exam-day pacing and a score-oriented pass.
        </p>
      </section>

      <section className="nn-card p-5" aria-labelledby="cat-practice">
        <h2 id="cat-practice" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          Topic practice tests & CAT-style sessions
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          For supported pathways, NurseNest also offers <strong className="font-semibold text-[var(--theme-heading-text)]">topic-level</strong>{" "}
          practice tests in the app, including adaptive (CAT-style) sessions where the product implements them. Availability varies by
          pathway and content pack—open{" "}
          <Link href={appPracticeTests} className="font-semibold text-primary underline">
            practice tests
          </Link>{" "}
          after sign-in to see what your subscription includes. This is not a substitute for official NCLEX or board scheduling or
          rules.
        </p>
      </section>

      <section className="nn-card p-5" aria-labelledby="pathway-sections">
        <h2 id="pathway-sections" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          RN, PN, NP, and Allied
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--theme-muted-text)]">
          <li>
            <strong className="text-[var(--theme-heading-text)]">RN / PN:</strong> Mocks and drills align to NCLEX-RN, NCLEX-PN, or
            REx-PN context for your region.
          </li>
          <li>
            <strong className="text-[var(--theme-heading-text)]">NP:</strong> Advanced practice mocks are specialty-scoped (for example
            FNP vs PMHNP)—always enter from your NP pathway in the app.
          </li>
          <li>
            <strong className="text-[var(--theme-heading-text)]">Allied:</strong> Timed practice follows allied certification framing for
            your hub—not nursing NCLEX content.
          </li>
        </ul>
        <p className="mt-4 text-sm text-[var(--theme-muted-text)]">
          Start from your public lessons hub if you are still choosing a track:{" "}
          <Link href={withMarketingLocale(locale, "/lessons")} className="font-semibold text-primary hover:underline">
            Lessons overview
          </Link>{" "}
          links every exam-specific lesson catalog.
        </p>
      </section>
    </div>
  );
}
