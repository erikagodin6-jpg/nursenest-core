import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { MarketingPublicStudyLanding } from "@/components/marketing/marketing-public-study-landing";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { loginCallbackDefaultRnCatStart, marketingExamHubPath } from "@/lib/marketing/marketing-exam-navigation";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

type Props = { locale: string };

/** Shared body for `/practice-exams` and `/{lang}/practice-exams`. */
export async function PracticeExamsHubContent({ locale }: Props) {
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);
  const marketingRegion = await getMarketingRegionFromCookies();

  const appExams = loginWithCallback("/app/exams");
  const appCatStartRn = loginCallbackDefaultRnCatStart(marketingRegion);
  const practiceExamsPath = withMarketingLocale(locale, "/practice-exams");
  const rnExamHub = withMarketingLocale(locale, marketingExamHubPath(marketingRegion, "rn"));

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-[var(--nn-rhythm-section-y)] nn-marketing-x nn-rhythm-page">
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), path: "/" },
          { name: t("pages.publicPracticeExams.breadcrumbCurrent"), path: practiceExamsPath },
        ]}
      />
      <nav className="nn-marketing-caption" aria-label="Breadcrumb">
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
          href: rnExamHub,
          label: t("pages.publicPracticeExams.ctaSecondaryQuestions"),
        }}
      />

      <section className="nn-card p-5" aria-labelledby="timed-mocks">
        <h2 id="timed-mocks" className="nn-marketing-h3">
          {t("pages.publicPracticeExams.sectionTimedMocksTitle")}
        </h2>
        <p className="mt-2 nn-marketing-body-sm text-[var(--theme-muted-text)]">{t("pages.publicPracticeExams.sectionTimedMocksBody")}</p>
      </section>

      <section className="nn-card p-5" aria-labelledby="cat-practice">
        <h2 id="cat-practice" className="nn-marketing-h3">
          {t("pages.publicPracticeExams.sectionCatTitle")}
        </h2>
        <p className="mt-2 nn-marketing-body-sm text-[var(--theme-muted-text)]">
          {t("pages.publicPracticeExams.catP1")}
          <strong className="font-semibold text-[var(--theme-heading-text)]">{t("pages.publicPracticeExams.catP1Strong")}</strong>
          {t("pages.publicPracticeExams.catP2")}
          <Link href={appCatStartRn} className="font-semibold text-primary underline">
            {t("pages.publicPracticeExams.catLinkPracticeTests")}
          </Link>
          {t("pages.publicPracticeExams.catP3")}
        </p>
      </section>

      <section className="nn-card p-5" aria-labelledby="pathway-sections">
        <h2 id="pathway-sections" className="nn-marketing-h3">
          {t("pages.publicPracticeExams.sectionPathwaysTitle")}
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 nn-marketing-body-sm text-[var(--theme-muted-text)]">
          <li>{t("pages.publicPracticeExams.pathwayRnPnBullet")}</li>
          <li>{t("pages.publicPracticeExams.pathwayNpBullet")}</li>
          <li>{t("pages.publicPracticeExams.pathwayAlliedBullet")}</li>
        </ul>
        <p className="mt-4 nn-marketing-body-sm text-[var(--theme-muted-text)]">
          {t("pages.publicPracticeExams.sectionPathwaysFooterBeforeLink")}
          <Link href={withMarketingLocale(locale, "/lessons")} className="font-semibold text-primary hover:underline">
            {t("pages.publicPracticeExams.lessonsOverviewLink")}
          </Link>
          {t("pages.publicPracticeExams.sectionPathwaysFooterAfterLink")}
        </p>
      </section>
    </div>
  );
}
