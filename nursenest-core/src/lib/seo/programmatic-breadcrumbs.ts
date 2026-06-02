import type { BreadcrumbResolution } from "@/lib/seo/breadcrumb-types";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";

/**
 * Visible trail + JSON-LD items for programmatic SEO pages.
 * Clickable paths stay **unprefixed** (`/{slug}`): UI language uses the marketing cookie, not URL segments.
 * For the localized route tree (`/[locale]/[slug]`), pass `localized: true` so `item` URLs match that URL shape.
 */
export function buildProgrammaticSeoBreadcrumbResolution(
  page: SeoPageDefinition,
  locale: string,
  options?: { localized?: boolean },
): BreadcrumbResolution {
  const localized = Boolean(options?.localized);
  const homeHref = "/";
  const selfPath = localized ? `/${locale}/${page.slug}` : `/${page.slug}`;

  if (page.breadcrumb) {
    const midHref = page.breadcrumb.midPath;
    return {
      crumbs: [
        { name: "Home", href: homeHref },
        { name: page.breadcrumb.midLabel, href: midHref },
        { name: page.breadcrumb.currentLabel, href: undefined },
      ],
      schemaItems: [
        { name: "Home", item: "/" },
        { name: page.breadcrumb.midLabel, item: page.breadcrumb.midPath },
        { name: page.breadcrumb.currentLabel, item: selfPath },
      ],
    };
  }

  return {
    crumbs: [
      { name: "Home", href: homeHref },
      { name: page.h1, href: undefined },
    ],
    schemaItems: [
      { name: "Home", item: localized ? `/${locale}` : "/" },
      { name: page.h1, item: selfPath },
    ],
  };
}
