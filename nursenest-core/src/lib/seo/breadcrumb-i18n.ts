import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
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
