import type { Metadata } from "next";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";

/**
 * Canonical + hreflang for hub-nested programmatic pages (`/{country}/{role}/{exam}/{seoSlug}`).
 * `enPath` is the English-default URL shape (no UI locale prefix).
 */
export function buildPathwayTopicProgrammaticMetadata(page: SeoPageDefinition, enPath: string): Metadata {
  const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, enPath);
  return {
    title: page.title,
    description: page.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: alt.canonical,
      languages: alt.languages,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: alt.canonical,
      type: "article",
    },
  };
}
