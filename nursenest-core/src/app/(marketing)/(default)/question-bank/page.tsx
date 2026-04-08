import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { MarketingPublicStudyLanding } from "@/components/marketing/marketing-public-study-landing";
import {
  ALLIED,
  NP,
  PN,
  RN,
  loginWithCallback,
  pnPrimaryHub,
  type MarketingRegionToggle,
} from "@/lib/marketing/marketing-entry-routes";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage, resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import {
  defaultQuestionBankMetaDescription,
  defaultQuestionBankMetaTitle,
} from "@/lib/marketing/nursing-tier-public-labels";

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
    hubHref: "/us/rn/nclex-rn",
    region: "US",
  },
  {
    cardKey: "cardRnCa",
    publicQuestionsHref: RN.caQuestions,
    hubHref: "/canada/rn/nclex-rn",
    region: "CA",
  },
  {
    cardKey: "cardPnUs",
    publicQuestionsHref: PN.usQuestions,
    hubHref: "/us/lpn/nclex-pn",
    region: "US",
  },
  {
    cardKey: "cardPnCa",
    publicQuestionsHref: PN.caQuestions,
    hubHref: pnPrimaryHub("CA"),
    region: "CA",
  },
  {
    cardKey: "cardNpUs",
    publicQuestionsHref: NP.fnpQuestions,
    hubHref: "/us/np/fnp",
    region: "US",
  },
  {
    cardKey: "cardNpCa",
    publicQuestionsHref: NP.caNpQuestions,
    hubHref: NP.caNpHub,
    region: "CA",
  },
  {
    cardKey: "cardAlliedUs",
    publicQuestionsHref: ALLIED.usQuestions,
    hubHref: ALLIED.usHub,
    region: "US",
  },
  {
    cardKey: "cardAlliedCa",
    publicQuestionsHref: ALLIED.caQuestions,
    hubHref: ALLIED.caHub,
    region: "CA",
  },
];

export async function generateMetadata(): Promise<Metadata> {
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
}

export default async function QuestionBankHubPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);

  const appBank = loginWithCallback("/app/questions");

  const regionLabel = (r: MarketingRegionToggle) =>
    r === "CA" ? t("pages.publicQuestionBank.regionCanada") : t("pages.publicQuestionBank.regionUnitedStates");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), path: "/" },
          { name: t("pages.publicQuestionBank.breadcrumbCurrent"), path: "/question-bank" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
        <nav className="nn-marketing-caption" aria-label="Breadcrumb">
          <Link href={withMarketingLocale(locale, "/")} className="hover:text-primary">
            {t("nav.home")}
          </Link>
          <span className="mx-1.5" aria-hidden>
            /
          </span>
          <span className="font-medium text-[var(--theme-heading-text)]">{t("pages.publicQuestionBank.breadcrumbCurrent")}</span>
        </nav>
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
