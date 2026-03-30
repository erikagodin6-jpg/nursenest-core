import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import type { BreadcrumbResolution, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";

/**
 * Visible trail + JSON-LD items for programmatic SEO pages (`/{slug}`).
 */
export function buildProgrammaticSeoBreadcrumbResolution(page: SeoPageDefinition, locale: string): BreadcrumbResolution {
  const homeHref = withMarketingLocale(locale, "/");
  const selfPath = locale === DEFAULT_MARKETING_LOCALE ? `/${page.slug}` : `/${locale}/${page.slug}`;

  if (page.breadcrumb) {
    const midHref = withMarketingLocale(locale, page.breadcrumb.midPath);
    return {
      crumbs: [
        { name: "Home", href: homeHref },
        { name: page.breadcrumb.midLabel, href: midHref },
        { name: page.breadcrumb.currentLabel, href: undefined },
      ],
      schemaItems: [
        { name: "Home", item: withMarketingLocale(locale, "/") },
        { name: page.breadcrumb.midLabel, item: withMarketingLocale(locale, page.breadcrumb.midPath) },
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
      { name: "Home", item: locale === DEFAULT_MARKETING_LOCALE ? "/" : `/${locale}` },
      { name: page.h1, item: selfPath },
    ],
  };
}
