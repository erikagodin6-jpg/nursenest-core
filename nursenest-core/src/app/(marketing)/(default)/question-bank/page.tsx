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
import { publicExamPrepHubDestinations } from "@/lib/navigation/canonical-destinations";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { formatMarketingMessage, resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { parseMarketingRegionCookieValue } from "@/lib/region/marketing-region-cookie";
import {
  defaultQuestionBankMetaDescription,
  defaultQuestionBankMetaTitle,
} from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { MarketingQuestionBankViewBeacon } from "@/components/observability/marketing-study-surface-view-beacons";

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

const US_EXAM_HUBS = publicExamPrepHubDestinations("US");
const CA_EXAM_HUBS = publicExamPrepHubDestinations("CA");

const CARDS: PathwayCard[] = [
  {
    cardKey: "cardRnUs",
    publicQuestionsHref: RN.usQuestions,
    hubHref: US_EXAM_HUBS.rn,
    region: "US",
  },
  {
    cardKey: "cardRnCa",
    publicQuestionsHref: RN.caQuestions,
    hubHref: CA_EXAM_HUBS.rn,
    region: "CA",
  },
  {
    cardKey: "cardPnUs",
    publicQuestionsHref: PN.usQuestions,
    hubHref: US_EXAM_HUBS.pn,
    region: "US",
  },
  {
    cardKey: "cardPnCa",
    publicQuestionsHref: PN.caQuestions,
    hubHref: CA_EXAM_HUBS.pn,
    region: "CA",
  },
  {
    cardKey: "cardNpUs",
    publicQuestionsHref: NP.fnpQuestions,
    hubHref: US_EXAM_HUBS.np,
    region: "US",
  },
  {
    cardKey: "cardNpCa",
    publicQuestionsHref: NP.caNpQuestions,
    hubHref: CA_EXAM_HUBS.np,
    region: "CA",
  },
  {
    cardKey: "cardAlliedUs",
    publicQuestionsHref: ALLIED.usQuestions,
    hubHref: US_EXAM_HUBS.allied,
    region: "US",
  },
  {
    cardKey: "cardAlliedCa",
    publicQuestionsHref: ALLIED.caQuestions,
    hubHref: CA_EXAM_HUBS.allied,
    region: "CA",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      /** No `cookies()` here — keeps prerender / collectPageData static-safe (body may still read cookies). */
      const locale = DEFAULT_MARKETING_LOCALE;
      const marketingRegion = parseMarketingRegionCookieValue(undefined) as MarketingRegionToggle;
      const messages = await loadMarketingLayoutShardsOverlay(locale);
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const title = resolveMarketingCopy(
        messages,
        `pages.publicQuestionBank.metaTitle${metaSfx}`,
        undefined,
        defaultQuestionBankMetaTitle(marketingRegion),
      );
      const description = resolveMarketingCopy(
        messages,
        `pages.publicQuestionBank.metaDescription${metaSfx}`,
        undefined,
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
  const messages = await loadMarketingLayoutShardsOverlay(locale);
  const t = (key: string, params?: Record<string, string | number>) =>
    formatMarketingMessage(messages, key, params, undefined, { locale });
  const metaSfx = marketingRegion === "US" ? "US" : "CA";
  const title = resolveMarketingCopy(
    messages,
    `pages.publicQuestionBank.metaTitle${metaSfx}`,
    undefined,
    defaultQuestionBankMetaTitle(marketingRegion),
  );
  const description = resolveMarketingCopy(
    messages,
    `pages.publicQuestionBank.metaDescription${metaSfx}`,
    undefined,
    defaultQuestionBankMetaDescription(marketingRegion),
  );

  const appBank = loginWithCallback("/app/questions");

  const regionLabel = (r: MarketingRegionToggle) =>
    r === "CA" ? t("pages.publicQuestionBank.regionCanada") : t("pages.publicQuestionBank.regionUnitedStates");

  const { crumbs, schemaItems } = questionBankIndexBreadcrumbs();

  return (
    <>
      <MarketingQuestionBankViewBeacon marketingRegion={marketingRegion} marketingLocale={locale} />
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: "/question-bank",
          title,
          description,
        })}
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
        <details open className="group/qbank-list" id="question-bank-pathways">
          <summary className="mb-4 flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm font-medium text-[var(--semantic-brand)] shadow-[var(--semantic-shadow-soft)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]">
            <span className="text-[var(--theme-muted-text)]">{CARDS.length} exam pathways</span>
            <span className="group-open/qbank-list:hidden">Show all pathways</span>
            <span className="hidden group-open/qbank-list:inline">Hide full list</span>
          </summary>
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
        </details>

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
