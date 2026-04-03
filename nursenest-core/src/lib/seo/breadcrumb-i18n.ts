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
    return {
      name: formatMarketingMessage(primary, c.i18nKey, c.i18nParams, fallback),
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
    return {
      name: formatMarketingMessage(primary, s.i18nKey, s.i18nParams, fallback),
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
