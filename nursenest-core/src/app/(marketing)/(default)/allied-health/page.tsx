import type { Metadata } from "next";
import Link from "next/link";
import {
  type AlliedHealthHubCopy,
  AlliedHealthRegionStrip,
  AlliedHealthTrustStrip,
  AlliedHeroProfessionScan,
  AlliedHubProfessionSections,
} from "@/components/marketing/allied-health-hub-content";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { alliedProfessionsGroupedForHub } from "@/lib/allied/allied-professions-registry";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { alliedHubBreadcrumbs } from "@/lib/seo/allied-breadcrumbs";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 86400;

const BASE = "/allied-health";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);
  const title = t("pages.alliedHealthHub.metaTitle");
  const description = t("pages.alliedHealthHub.metaDescription");
  const alt = marketingAlternatesSharedPage(locale, BASE);
  return {
    title,
    description,
    alternates: { canonical: alt.canonical, languages: alt.languages },
    openGraph: { title, description, url: alt.canonical, type: "website" },
  };
}

function buildHubCopy(t: (key: string) => string): AlliedHealthHubCopy {
  return {
    scanTracksLabel: t("pages.alliedHealthHub.scanTracksLabel"),
    region: {
      badgeLabel: t("pages.alliedHealthHub.regionBadgeLabel"),
      h2: t("pages.alliedHealthHub.regionH2"),
      intro: t("pages.alliedHealthHub.regionIntro"),
      pathwayOverviewCta: t("pages.alliedHealthHub.regionPathwayOverviewCta"),
      questionBankCta: t("pages.alliedHealthHub.regionQuestionBankCta"),
    },
    professions: {
      badge: t("pages.alliedHealthHub.professionsBadge"),
      h2: t("pages.alliedHealthHub.professionsH2"),
      intro: t("pages.alliedHealthHub.professionsIntro"),
      openPrepGuide: t("pages.alliedHealthHub.professionOpenPrepGuide"),
      browseLessons: t("pages.alliedHealthHub.professionBrowseLessons"),
    },
    trust: {
      h2: t("pages.alliedHealthHub.trustH2"),
      sub: t("pages.alliedHealthHub.trustSub"),
      tile1: {
        title: t("pages.alliedHealthHub.trustTile1Title"),
        body: t("pages.alliedHealthHub.trustTile1Body"),
      },
      tile2: {
        title: t("pages.alliedHealthHub.trustTile2Title"),
        body: t("pages.alliedHealthHub.trustTile2Body"),
      },
      tile3: {
        title: t("pages.alliedHealthHub.trustTile3Title"),
        body: t("pages.alliedHealthHub.trustTile3Body"),
      },
    },
  };
}

export default async function AlliedHealthHubPage() {
  const usAllied = getExamPathwayById("us-allied-core");
  const caAllied = getExamPathwayById("ca-allied-core");
  if (!usAllied || !caAllied) {
    throw new Error("Allied exam pathways (us-allied-core / ca-allied-core) must exist in the product registry.");
  }

  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);
  const hubCopy = buildHubCopy((key) => t(key));

  const usOverview = buildExamPathwayPath(usAllied);
  const caOverview = buildExamPathwayPath(caAllied);
  const usQuestions = buildExamPathwayPath(usAllied, "questions");
  const caQuestions = buildExamPathwayPath(caAllied, "questions");

  const grouped = alliedProfessionsGroupedForHub();
  const { crumbs, schemaItems } = alliedHubBreadcrumbs();

  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-col gap-[var(--nn-rhythm-section-y)] nn-marketing-x nn-rhythm-page">
        <BreadcrumbJsonLd items={schemaItems} />
        <div>
          <BreadcrumbTrail items={crumbs} />
        </div>

        <header className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border-strong)] bg-gradient-to-br from-[var(--accent-soft)] via-[var(--theme-card-bg)] to-[var(--bg-section-alt)] px-6 py-[var(--space-hero-bottom)] shadow-[var(--shadow-elevated)] sm:px-11 sm:py-[clamp(2.5rem,5vw,3.5rem)]">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_12%,transparent)] blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-0 top-10 hidden h-[calc(100%-5rem)] w-1 rounded-full bg-gradient-to-b from-primary/80 via-primary/40 to-transparent sm:block"
            aria-hidden
          />
          <div className="relative">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
              {t("pages.alliedHealthHub.heroKicker")}
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl sm:leading-[1.12] lg:text-[2.5rem]">
              {t("pages.alliedHealthHub.heroH1")}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--theme-muted-text)] sm:text-lg sm:leading-relaxed">
              {t("pages.alliedHealthHub.heroValueLine")}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--theme-muted-text)] sm:text-lg sm:leading-relaxed">
              {t("pages.alliedHealthHub.heroWorkflowLine")}
            </p>
            <p className="mt-4 max-w-2xl text-sm italic leading-relaxed text-[var(--theme-muted-text)] sm:text-base">
              {t("pages.alliedHealthHub.heroTestimonial")}
            </p>
            <div className="mt-[var(--nn-rhythm-text-to-cta)] flex flex-wrap gap-[var(--nn-rhythm-btn-group-gap)] sm:gap-[calc(var(--nn-rhythm-btn-group-gap)+0.15rem)]">
              <Link
                href="/pricing"
                className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-95"
              >
                {t("pages.alliedHealthHub.ctaSeeAlliedPlans")}
              </Link>
              <a
                href="#allied-region-heading"
                className="inline-flex rounded-full border border-[var(--border-medium)] bg-[color-mix(in_srgb,var(--theme-primary)_5%,var(--theme-card-bg))] px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/35 hover:bg-[var(--surface-interactive-hover)]"
              >
                {t("pages.alliedHealthHub.ctaPickCountryProfession")}
              </a>
            </div>
            <AlliedHeroProfessionScan grouped={grouped} scanTracksLabel={hubCopy.scanTracksLabel} />
          </div>
        </header>

        <section
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)] px-5 py-6 shadow-[var(--shadow-card)] sm:px-8 sm:py-8"
          aria-labelledby="allied-who-heading"
        >
          <h2 id="allied-who-heading" className="nn-marketing-h3 text-[var(--theme-heading-text)]">
            {t("pages.alliedHealthHub.whoHeading")}
          </h2>
          <p className="nn-marketing-body-sm mt-3 max-w-2xl leading-relaxed text-[var(--theme-muted-text)]">
            {t("pages.alliedHealthHub.whoBody")}
          </p>
        </section>

        <AlliedHealthRegionStrip
          us={{
            label: t("pages.alliedHealthHub.regionUnitedStatesHubLabel"),
            countryLine: t("pages.alliedHealthHub.regionUnitedStatesCountryLine"),
            overviewHref: usOverview,
            questionsHref: usQuestions,
            pricingHint: t("pages.alliedHealthHub.regionUnitedStatesPricingHint"),
          }}
          ca={{
            label: t("pages.alliedHealthHub.regionCanadaHubLabel"),
            countryLine: t("pages.alliedHealthHub.regionCanadaCountryLine"),
            overviewHref: caOverview,
            questionsHref: caQuestions,
            pricingHint: t("pages.alliedHealthHub.regionCanadaPricingHint"),
          }}
          copy={hubCopy.region}
        />

        <AlliedHubProfessionSections grouped={grouped} copy={hubCopy.professions} />

        <AlliedHealthTrustStrip copy={hubCopy.trust} />

        <p className="mt-[var(--nn-rhythm-section-y)] border-t border-[var(--border-subtle)] pt-[var(--nn-rhythm-tight-y)] text-center text-xs text-[var(--theme-muted-text)]">
          <Link
            href="/lessons"
            className="font-semibold text-primary underline-offset-4 transition hover:underline"
          >
            {t("pages.alliedHealthHub.footerNursingPathwaysLink")}
          </Link>
        </p>
      </div>
    </>
  );
}
