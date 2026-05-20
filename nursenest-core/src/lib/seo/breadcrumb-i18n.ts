import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import type {
  BreadcrumbCrumb,
  BreadcrumbResolution,
  BreadcrumbSchemaItem,
  BreadcrumbI18nParams,
} from "@/lib/seo/breadcrumb-types";

function toMarketingMessageParams(params?: BreadcrumbI18nParams): Record<string, string | number> | undefined {
  if (!params) return undefined;
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

const BREADCRUMB_LABEL_FALLBACKS: Record<string, Record<string, string>> = {
  hi: {
    "breadcrumbs.home": "होम",
    "breadcrumbs.pricing": "कीमतें",
    "breadcrumbs.lessons": "पाठ",
    "breadcrumbs.questionBank": "प्रैक्टिस प्रश्न",
  },
  tl: {
    "breadcrumbs.home": "Home",
    "breadcrumbs.pricing": "Presyo",
    "breadcrumbs.lessons": "Mga aralin",
    "breadcrumbs.questionBank": "Mga practice questions",
  },
  pt: {
    "breadcrumbs.home": "Início",
    "breadcrumbs.pricing": "Preços",
    "breadcrumbs.lessons": "Lições",
    "breadcrumbs.questionBank": "Questões de prática",
  },
};

function localizeBreadcrumbLabel(
  locale: string | null,
  key: string | undefined,
  structuralName: string,
  primary: MarketingMessages,
  fallback?: MarketingMessages,
  params?: Record<string, string | number>,
): string {
  if (!key) return structuralName;
  const localized = formatMarketingMessage(primary, key, params, fallback).trim();
  if (localized && localized !== key) return localized;
  const mapped = locale ? BREADCRUMB_LABEL_FALLBACKS[locale]?.[key] : undefined;
  if (mapped) return mapped;
  return localized || structuralName.trim();
}

export function localizeBreadcrumbCrumbs(
  crumbs: BreadcrumbCrumb[],
  primary: MarketingMessages,
  fallback?: MarketingMessages,
  locale?: string,
): BreadcrumbCrumb[] {
  return crumbs.map((c) => {
    if (!c.i18nKey) return { name: c.name, href: c.href };
    const name = localizeBreadcrumbLabel(
      locale ?? null,
      c.i18nKey,
      c.name,
      primary,
      fallback,
      toMarketingMessageParams(c.i18nParams),
    );
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
  locale?: string,
): BreadcrumbSchemaItem[] {
  return items.map((s) => {
    if (!s.i18nKey) return { name: s.name, item: s.item };
    const name = localizeBreadcrumbLabel(
      locale ?? null,
      s.i18nKey,
      s.name,
      primary,
      fallback,
      toMarketingMessageParams(s.i18nParams),
    );
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
  const localized = {
    crumbs: localizeBreadcrumbCrumbs(res.crumbs, primary, fallback, locale),
    schemaItems: localizeBreadcrumbSchemaItems(res.schemaItems, primary, fallback, locale),
  };
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
