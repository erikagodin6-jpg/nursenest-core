import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type AlliedHealthHubCopy, AlliedHealthTrustStrip, AlliedHubProfessionSections } from "@/components/marketing/allied-health-hub-content";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { alliedProfessionsGroupedForHub } from "@/lib/allied/allied-professions-registry";
import { ALLIED_GLOBAL_HUB_PATH, getCanonicalAlliedPathway } from "@/lib/allied/allied-global-pathway";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import {
  MARKETING_ALLIED_HUB_META_DESCRIPTION_FALLBACK,
  MARKETING_ALLIED_HUB_META_TITLE_FALLBACK,
} from "@/lib/marketing-i18n/marketing-safe-fallbacks";
import { getRequiredPublicMetadataLine } from "@/lib/marketing-i18n/marketing-metadata-strict";
import { alliedHubBreadcrumbs } from "@/lib/seo/allied-breadcrumbs";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

// 🧊 ISR: revalidate: 86400 already set below
export const revalidate = 86400;

const BASE = "/allied-health";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const locale = await getMarketingLocaleForDefaultRoute();
      const m = await loadMarketingMessageShards(locale, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS);
      const en = await loadMarketingMessageShards(
        DEFAULT_MARKETING_LOCALE,
        MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
      );
      const title = getRequiredPublicMetadataLine(
        m,
        "pages.alliedHealthHub.metaTitle",
        en,
        MARKETING_ALLIED_HUB_META_TITLE_FALLBACK,
      );
      const description = getRequiredPublicMetadataLine(
        m,
        "pages.alliedHealthHub.metaDescription",
        en,
        MARKETING_ALLIED_HUB_META_DESCRIPTION_FALLBACK,
      );
      const alt = marketingAlternatesSharedPage(locale, BASE);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: { title, description, url: alt.canonical, type: "website" },
      };
    },
    { pathname: BASE, routeGroup: "marketing.default.allied_health" },
  );
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
  const alliedPathway = getCanonicalAlliedPathway();
  if (!alliedPathway) {
    notFound();
  }

  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessageShards(locale, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS);
  const en = await loadMarketingMessageShards(
    DEFAULT_MARKETING_LOCALE,
    MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  );
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);
  const hubCopy = buildHubCopy((key) => t(key));

  const grouped = alliedProfessionsGroupedForHub();
  const { crumbs, schemaItems } = alliedHubBreadcrumbs();

  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:gap-12 lg:gap-14 nn-marketing-x nn-rhythm-page">
        <BreadcrumbJsonLd items={schemaItems} />
        <div>
          <BreadcrumbTrail items={crumbs} />
        </div>

        <header className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border-strong)] bg-[var(--hero-branded-wash)] px-6 py-[var(--space-hero-bottom)] shadow-[var(--shadow-elevated)] sm:px-11 sm:py-[clamp(2.25rem,4.5vw,3.25rem)]">
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
            <p className="nn-premium-home-eyebrow max-w-full whitespace-normal">{t("pages.alliedHealthHub.heroKicker")}</p>
            <h1 className="nn-marketing-h1 mt-4 max-w-[min(100%,42rem)] text-balance text-[var(--palette-heading)]">
              {t("pages.alliedHealthHub.heroH1")}
            </h1>
            <p className="nn-marketing-body mt-4 max-w-2xl text-pretty text-[var(--palette-text-muted)] sm:text-lg">
              {t("pages.alliedHealthHub.heroValueLine")}
            </p>
            <p className="nn-marketing-body mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)] sm:text-lg">
              {t("pages.alliedHealthHub.heroWorkflowLine")}
            </p>
            <p className="nn-marketing-body mt-3 max-w-2xl text-pretty italic text-[var(--palette-text-muted)] sm:text-base">
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
                href="#allied-professions-heading"
                className="inline-flex rounded-full border border-[var(--border-medium)] bg-[color-mix(in_srgb,var(--theme-primary)_5%,var(--theme-card-bg))] px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/35 hover:bg-[var(--surface-interactive-hover)]"
              >
                {t("pages.alliedHealthHub.ctaPickCountryProfession")}
              </a>
            </div>
          </div>
        </header>

        <section
          className="nn-card px-5 py-6 sm:px-8 sm:py-8"
          aria-labelledby="allied-who-heading"
        >
          <h2 id="allied-who-heading" className="nn-marketing-h3 text-[var(--theme-heading-text)]">
            {t("pages.alliedHealthHub.whoHeading")}
          </h2>
          <p className="nn-marketing-body-sm mt-3 max-w-2xl leading-relaxed text-[var(--theme-muted-text)]">
            {t("pages.alliedHealthHub.whoBody")}
          </p>
        </section>

        <section
          className="nn-card px-5 py-5 sm:px-8 sm:py-6"
          aria-label={t("pages.alliedHealthHub.regionH2")}
        >
          <p className="text-sm leading-relaxed text-[var(--theme-muted-text)]">
            After you pick an occupation track below, open the{" "}
            <Link href={ALLIED_GLOBAL_HUB_PATH} className="font-semibold text-primary underline-offset-4 hover:underline">
              global allied pathway hub
            </Link>{" "}
            for the shared Allied Health surface: occupation-scoped lessons, flashcards, practice questions, labs, and adaptive readiness
            entry points without a country fork.
          </p>
        </section>

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
