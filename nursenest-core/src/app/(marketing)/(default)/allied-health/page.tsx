import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type AlliedHealthHubCopy, AlliedHealthTrustStrip, AlliedHubProfessionSections } from "@/components/marketing/allied-health-hub-content";
import { AlliedHealthHomepage, type AlliedPlatformStats } from "@/components/marketing/allied-health-homepage";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
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
import { ALLIED_HEALTH_FAQ_JSONLD } from "@/lib/seo/allied-health-faq-schema";

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
      const titleFromI18n = getRequiredPublicMetadataLine(
        m,
        "pages.alliedHealthHub.metaTitle",
        en,
        MARKETING_ALLIED_HUB_META_TITLE_FALLBACK,
      );
      const descFromI18n = getRequiredPublicMetadataLine(
        m,
        "pages.alliedHealthHub.metaDescription",
        en,
        MARKETING_ALLIED_HUB_META_DESCRIPTION_FALLBACK,
      );
      const title = titleFromI18n.length > 5 ? titleFromI18n
        : "NurseNest Allied Health | RT, Paramedic, MLT, PT, OT & More — Complete Exam Prep";
      const description = descFromI18n.length > 10 ? descFromI18n
        : "The most comprehensive allied health education platform. Profession-specific lessons, practice questions, CAT exams, clinical simulations, and competency tracking for 22+ allied health professions including Respiratory Therapy, Paramedicine, Medical Lab, Physiotherapy, Occupational Therapy, and more.";
      const alt = marketingAlternatesSharedPage(locale, BASE);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: { title, description, url: alt.canonical, type: "website" },
        twitter: { card: "summary_large_image", title, description },
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

async function loadAlliedStats(): Promise<AlliedPlatformStats> {
  try {
    const { getHomepagePublicHomeStats } = await import("@/lib/marketing/public-home-stats");
    const raw = await getHomepagePublicHomeStats();
    return {
      questionCount: raw.questionCount ?? 0,
      lessonCount: raw.totalLessons ?? 0,
      flashcardCount: raw.totalFlashcards ?? 0,
      simulationCount: raw.scenarioCount ?? 0,
      skillCount: raw.clinicalSkillCount ?? 0,
    };
  } catch {
    return {};
  }
}

export default async function AlliedHealthHubPage() {
  const alliedPathway = getCanonicalAlliedPathway();
  if (!alliedPathway) {
    notFound();
  }

  const [locale, alliedStats] = await Promise.all([
    getMarketingLocaleForDefaultRoute(),
    loadAlliedStats(),
  ]);
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
    <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:gap-12 lg:gap-14 nn-marketing-x nn-rhythm-page">
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={ALLIED_HEALTH_FAQ_JSONLD} />
      <div>
        <BreadcrumbTrail items={crumbs} />
      </div>

      {/* ── Premium Allied Health Homepage ────────────────────────────── */}
      <AlliedHealthHomepage
        professionExplorerHref="#allied-professions-explorer"
        pricingHref="/pricing"
        stats={alliedStats}
      />

      {/* ── Global pathway note ────────────────────────────────────────── */}
      <section
        className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--semantic-panel-muted)] px-5 py-5 sm:px-8 sm:py-6"
        aria-label="Allied pathway hub note"
      >
        <p className="text-sm leading-relaxed text-[var(--theme-muted-text)]">
          After you pick an occupation track, open the{" "}
          <Link href={ALLIED_GLOBAL_HUB_PATH} className="font-semibold text-primary underline-offset-4 hover:underline">
            global allied pathway hub
          </Link>{" "}
          for the shared Allied Health surface: occupation-scoped lessons, flashcards, practice
          questions, labs, and adaptive readiness entry points without a country fork.
        </p>
      </section>

      {/* ── Full Profession Directory (SEO depth) ─────────────────────── */}
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
  );
}
