import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import type {
  BreadcrumbCrumb,
  BreadcrumbResolution,
  BreadcrumbSchemaItem,
} from "@/lib/seo/breadcrumb-types";

export function localizeBreadcrumbCrumbs(
  crumbs: BreadcrumbCrumb[],
  primary: MarketingMessages,
  fallback?: MarketingMessages,
): BreadcrumbCrumb[] {
  return crumbs.map((c) => {
    if (!c.i18nKey) return { name: c.name, href: c.href };
    const localized = formatMarketingMessage(primary, c.i18nKey, c.i18nParams, fallback).trim();
    const name = localized || c.name.trim();
    if (!name && process.env.NODE_ENV !== "production") {
      throw new Error(`[breadcrumb-i18n] empty crumb label for key "${c.i18nKey}" (no structural name fallback).`);
    }
    return {
      name: name || c.name.trim(),
      href: c.href,
    };
  });
}

export function localizeBreadcrumbSchemaItems(
  items: BreadcrumbSchemaItem[],
  primary: MarketingMessages,
  fallback?: MarketingMessages,
): BreadcrumbSchemaItem[] {
  return items.map((s) => {
    if (!s.i18nKey) return { name: s.name, item: s.item };
    const localized = formatMarketingMessage(primary, s.i18nKey, s.i18nParams, fallback).trim();
    const name = localized || s.name.trim();
    if (!name && process.env.NODE_ENV !== "production") {
      throw new Error(`[breadcrumb-i18n] empty schema item name for key "${s.i18nKey}" (no structural name fallback).`);
    }
    return {
      name: name || s.name.trim(),
      item: s.item,
    };
  });
}

export function localizeBreadcrumbResolution(
  res: BreadcrumbResolution,
  primary: MarketingMessages,
  fallback?: MarketingMessages,
): BreadcrumbResolution {
  return {
    crumbs: localizeBreadcrumbCrumbs(res.crumbs, primary, fallback),
    schemaItems: localizeBreadcrumbSchemaItems(res.schemaItems, primary, fallback),
  };
}

function localizeBreadcrumbHref(locale: string, href: string | undefined): string | undefined {
  if (!href || locale === DEFAULT_MARKETING_LOCALE) return href;
  return withMarketingLocale(locale, href);
}

function localizeBreadcrumbSchemaItem(locale: string, item: string): string {
  if (locale === DEFAULT_MARKETING_LOCALE) return item;
  try {
    const url = new URL(item);
    const localizedPath = withMarketingLocale(locale, `${url.pathname}${url.search}${url.hash}`);
    return toAbsoluteSiteUrl(localizedPath);
  } catch {
    return toAbsoluteSiteUrl(withMarketingLocale(locale, item));
  }
}

export function localizeBreadcrumbResolutionForLocale(
  res: BreadcrumbResolution,
  primary: MarketingMessages,
  locale: string,
  fallback?: MarketingMessages,
): BreadcrumbResolution {
  const localized = localizeBreadcrumbResolution(res, primary, fallback);
  return {
    crumbs: localized.crumbs.map((crumb) => ({
      ...crumb,
      href: localizeBreadcrumbHref(locale, crumb.href),
    })),
    schemaItems: localized.schemaItems.map((item) => ({
      ...item,
      item: localizeBreadcrumbSchemaItem(locale, item.item),
    })),
  };
}
