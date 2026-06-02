import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { getRequiredPublicMetadataLine } from "@/lib/marketing-i18n/marketing-metadata-strict";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import {
  defaultFlashcardsMetaDescription,
  defaultFlashcardsMetaTitle,
} from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { AUTH_CALLBACK_PARAM } from "@/lib/auth/auth-flow-governance";
import { defaultPublicFlashcardsPathwayId } from "@/lib/flashcards/public-flashcards-auth-callback";
import { PublicFlashcardsStudyLauncher } from "@/components/flashcards/public-flashcards-study-launcher";
import { PublicStudyLandingLayout } from "@/components/marketing/public-study-landing-layout";

// Public educational landing surface; the launcher itself routes into the protected study app.
export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const locale = await getMarketingLocaleForDefaultRoute();
      const marketingRegion = await getMarketingRegionFromCookies();
      const m = await loadMarketingMessageShards(locale, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS);
      const en = await loadMarketingMessageShards(
        DEFAULT_MARKETING_LOCALE,
        MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
      );
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const title = getRequiredPublicMetadataLine(
        m,
        `pages.publicFlashcardsHub.metaTitle${metaSfx}`,
        en,
        defaultFlashcardsMetaTitle(marketingRegion),
      );
      const description = getRequiredPublicMetadataLine(
        m,
        `pages.publicFlashcardsHub.metaDescription${metaSfx}`,
        en,
        defaultFlashcardsMetaDescription(marketingRegion),
      );
      return {
        title,
        description,
        alternates: { canonical: absoluteUrl("/flashcards") },
      };
    },
    { pathname: "/flashcards", routeGroup: "marketing.default.flashcards" },
  );
}

export default async function PublicFlashcardsHubPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessageShards(locale, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS);
  const en = await loadMarketingMessageShards(
    DEFAULT_MARKETING_LOCALE,
    MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  );
  const t = (key: string, p?: Record<string, string | number>) => formatMarketingMessage(m, key, p, en);

  const marketingRegion = await getMarketingRegionFromCookies();
  const home = withMarketingLocale(locale, "/");
  const loginBaseHref = withMarketingLocale(locale, "/login");
  const pathwayId = defaultPublicFlashcardsPathwayId(marketingRegion);

  const flashcardsLabel = t("nav.flashcards");
  return (
    <PublicStudyLandingLayout
      breadcrumbs={[
        { name: t("nav.home"), href: home },
        { name: flashcardsLabel },
      ]}
      schemaItems={[
        { name: t("nav.home"), path: "/" },
        { name: flashcardsLabel, path: "/flashcards" },
      ]}
    >
      <PublicFlashcardsStudyLauncher
        pathwayId={pathwayId}
        loginBaseHref={loginBaseHref}
        callbackParam={AUTH_CALLBACK_PARAM}
      />
    </PublicStudyLandingLayout>
  );
}
