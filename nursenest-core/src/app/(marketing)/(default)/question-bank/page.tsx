import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { questionBankIndexBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { MarketingPublicStudyLanding } from "@/components/marketing/marketing-public-study-landing";
import {
  ALLIED,
  NP,
  PN,
  RN,
  loginWithCallback,
  type MarketingRegionToggle,
} from "@/lib/marketing/marketing-entry-routes";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage, resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingAlternatesSharedPage, marketingCanonicalPathForLocale } from "@/lib/seo/marketing-alternates";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import {
  defaultQuestionBankMetaDescription,
  defaultQuestionBankMetaTitle,
} from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 600;

type CardKey =
  | "cardRnUs"
  | "cardRnCa"
  | "cardPnUs"
  | "cardPnCa"
  | "cardNpUs"
  | "cardNpCa"
  | "cardAlliedUs"
  | "cardAlliedCa";

type PathwayCard = {
  cardKey: CardKey;
  publicQuestionsHref: string;
  hubHref: string;
  region: MarketingRegionToggle;
};

const CARDS: PathwayCard[] = [
  {
    cardKey: "cardRnUs",
    publicQuestionsHref: RN.usQuestions,
    hubHref: marketingExamHubPath("US", "rn"),
    region: "US",
  },
  {
    cardKey: "cardRnCa",
    publicQuestionsHref: RN.caQuestions,
    hubHref: marketingExamHubPath("CA", "rn"),
    region: "CA",
  },
  {
    cardKey: "cardPnUs",
    publicQuestionsHref: PN.usQuestions,
    hubHref: marketingExamHubPath("US", "pn"),
    region: "US",
  },
  {
    cardKey: "cardPnCa",
    publicQuestionsHref: PN.caQuestions,
    hubHref: marketingExamHubPath("CA", "pn"),
    region: "CA",
  },
  {
    cardKey: "cardNpUs",
    publicQuestionsHref: NP.fnpQuestions,
    hubHref: marketingExamHubPath("US", "np"),
    region: "US",
  },
  {
    cardKey: "cardNpCa",
    publicQuestionsHref: NP.caNpQuestions,
    hubHref: marketingExamHubPath("CA", "np"),
    region: "CA",
  },
  {
    cardKey: "cardAlliedUs",
    publicQuestionsHref: ALLIED.usQuestions,
    hubHref: marketingExamHubPath("US", "allied"),
    region: "US",
  },
  {
    cardKey: "cardAlliedCa",
    publicQuestionsHref: ALLIED.caQuestions,
    hubHref: marketingExamHubPath("CA", "allied"),
    region: "CA",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const locale = await getMarketingLocaleForDefaultRoute();
      const marketingRegion = await getMarketingRegionFromCookies();
      const m = await loadMarketingMessages(locale);
      const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const title = resolveMarketingCopy(
        m,
        `pages.publicQuestionBank.metaTitle${metaSfx}`,
        en,
        defaultQuestionBankMetaTitle(marketingRegion),
      );
      const description = resolveMarketingCopy(
        m,
        `pages.publicQuestionBank.metaDescription${metaSfx}`,
        en,
        defaultQuestionBankMetaDescription(marketingRegion),
      );
      const alt = marketingAlternatesSharedPage(locale, "/question-bank");
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: { title, description, url: alt.canonical, type: "website" },
      };
    },
    { pathname: "/question-bank", routeGroup: "marketing.default.question_bank" },
  );
}

export default async function QuestionBankHubPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  const marketingRegion = await getMarketingRegionFromCookies();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);
  const metaSfx = marketingRegion === "US" ? "US" : "CA";
  const title = resolveMarketingCopy(
    m,
    `pages.publicQuestionBank.metaTitle${metaSfx}`,
    en,
    defaultQuestionBankMetaTitle(marketingRegion),
  );
  const description = resolveMarketingCopy(
    m,
    `pages.publicQuestionBank.metaDescription${metaSfx}`,
    en,
    defaultQuestionBankMetaDescription(marketingRegion),
  );

  const appBank = loginWithCallback("/app/questions");

  const regionLabel = (r: MarketingRegionToggle) =>
    r === "CA" ? t("pages.publicQuestionBank.regionCanada") : t("pages.publicQuestionBank.regionUnitedStates");

  const { crumbs, schemaItems } = questionBankIndexBreadcrumbs();

  return (
    <>
      <WebPageJsonLd
        title={title}
        description={description}
        path={marketingCanonicalPathForLocale(locale, "/question-bank")}
        inLanguage={locale}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
        <BreadcrumbTrail items={crumbs} navClassName="nn-marketing-caption" />
      </div>
      <MarketingPublicStudyLanding
        h1={t("pages.publicQuestionBank.h1")}
        intro={t("pages.publicQuestionBank.intro")}
        primaryCta={{ href: appBank, label: t("pages.publicQuestionBank.ctaStartPracticing") }}
        secondaryCta={{
          href: withMarketingLocale(locale, "/lessons"),
          label: t("pages.publicQuestionBank.ctaBrowseLessons"),
        }}
      >
        <ul className="flex flex-col gap-3 sm:gap-[var(--nn-rhythm-card-grid-gap)]">
          {CARDS.map((c) => {
            const p = `pages.publicQuestionBank.${c.cardKey}`;
            return (
              <li key={c.cardKey} className="nn-card p-4">
                <p className="nn-marketing-label nn-marketing-label--accent">
                  {regionLabel(c.region)} · {t(`${p}.examLabel`)}
                </p>
                <h2 className="mt-1 nn-marketing-h3">{t(`${p}.title`)}</h2>
                <p className="mt-2 nn-marketing-body-sm text-muted">{t(`${p}.who`)}</p>
                <p className="mt-2 nn-marketing-body-sm text-[var(--theme-muted-text)]">{t(`${p}.includes`)}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href={c.publicQuestionsHref} className="nn-marketing-body-sm font-semibold text-primary hover:underline">
                    {t("pages.publicQuestionBank.linkPublicQuestionsLanding")}
                  </Link>
                  <Link href={c.hubHref} className="nn-marketing-body-sm font-semibold text-primary hover:underline">
                    {t("pages.publicQuestionBank.linkPathwayHub")}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="nn-marketing-body-sm text-[var(--theme-muted-text)]">
          {t("pages.publicQuestionBank.footerTimedSetsP1")}
          <Link href={withMarketingLocale(locale, "/practice-exams")} className="font-semibold text-primary hover:underline">
            {t("pages.publicQuestionBank.linkPracticeExams")}
          </Link>
          {t("pages.publicQuestionBank.footerTimedSetsP2")}
        </p>
      </MarketingPublicStudyLanding>
    </>
  );
}
