import type { Metadata } from "next";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { assertNoPublicPlaceholderCopy } from "@/lib/marketing-i18n/marketing-message-value-policy";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";
import { marketingHreflangLanguagesForEnPath } from "@/lib/seo/marketing-alternates";
import { absoluteUrl } from "@/lib/seo/site-origin";

/**
 * @param urlLocale — Locale reflected in the **URL path** (`/` vs `/fr/...`), not necessarily the overlay
 *   used for merged titles. On `(default)/seo/[slug]` always pass {@link DEFAULT_MARKETING_LOCALE} so the
 *   canonical matches the unprefixed public URL even when the cookie prefers another language.
 */
export function buildProgrammaticMetadata(page: SeoPageDefinition, urlLocale: string): Metadata {
  const slug = page.slug;
  const rawTitle = (page.title ?? "").trim();
  const rawDesc = (page.description ?? "").trim();
  if (!rawTitle || !rawDesc) {
    throw new Error(
      `[marketing-metadata-strict] programmatic SEO registry entry "${slug}" has empty title or description.`,
    );
  }
  const title = assertNoPublicPlaceholderCopy(rawTitle, `programmatic:${slug}:title`).trim();
  const description = assertNoPublicPlaceholderCopy(rawDesc, `programmatic:${slug}:description`).trim();
  if (!title || !description) {
    throw new Error(
      `[marketing-metadata-strict] programmatic SEO entry "${slug}" title or description scrubbed to empty after placeholder guard.`,
    );
  }
  const isDefaultLocale = urlLocale === DEFAULT_MARKETING_LOCALE;
  /** Self-referencing canonical per locale (public URL is `/{slug}` or `/{locale}/{slug}`). */
  const canonicalPath = isDefaultLocale ? `/${slug}` : `/${urlLocale}/${slug}`;
  const canonical = absoluteUrl(canonicalPath);
  const enPath = `/${slug}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: marketingHreflangLanguagesForEnPath(enPath),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
    },
  };
}
