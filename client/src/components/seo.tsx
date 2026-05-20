import { useEffect, useRef } from "react";
import { SUPPORTED_LOCALES, getLocaleFromPath } from "@/lib/locale-utils";
import { buildBreadcrumbs, buildBreadcrumbJsonLd, type BreadcrumbItem } from "@/lib/breadcrumb-builder";
import { getLocalizedSEO } from "@/data/seo-metadata";
import { normalizeCanonicalUrl, isLowValueTranslatedPage } from "@shared/canonical-url";
import { HREFLANG_MAP, LOCALE_LANGUAGE_MAP, getMainSiteDomain } from "@shared/locales";

const SITE_DOMAIN = getMainSiteDomain();

let seoFirstRender = true;

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: string;
  noindex?: boolean;
  structuredData?: Record<string, any>;
  additionalStructuredData?: Record<string, any>[];
  breadcrumbs?: BreadcrumbItem[];
  noBreadcrumbs?: boolean;
}

export function SEO({ title, description, keywords, canonicalPath, ogType = "website", noindex, structuredData, additionalStructuredData, breadcrumbs, noBreadcrumbs }: SEOProps) {
  useEffect(() => {
    const currentPath = window.location.pathname;
    const { locale: activeLocale, pathWithoutLocale } = getLocaleFromPath(currentPath);

    let effectiveTitle = title;
    let effectiveDescription = description;
    let effectiveKeywords = keywords;
    if (activeLocale !== "en") {
      const localizedEntry = getLocalizedSEO(activeLocale, pathWithoutLocale);
      if (localizedEntry) {
        effectiveTitle = localizedEntry.title;
        effectiveDescription = localizedEntry.description;
        effectiveKeywords = localizedEntry.keywords;
      }
    }

    const indexableLocales: string[] = (window as any).__INDEXABLE_LOCALES__ || SUPPORTED_LOCALES;
    const localeNotIndexable = activeLocale !== "en" && !indexableLocales.includes(activeLocale);
    const utilityPageNoindex = isLowValueTranslatedPage(pathWithoutLocale, activeLocale);
    const shouldNoindexPage = noindex || localeNotIndexable || utilityPageNoindex;

    const fullTitle = effectiveTitle.includes("NurseNest") ? effectiveTitle : `${effectiveTitle} | NurseNest`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const existingRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    const serverSetNoindex = existingRobots && existingRobots.content.includes("noindex") && existingRobots.dataset.clientSet !== "true";

    if (shouldNoindexPage || serverSetNoindex) {
      setMeta("robots", "noindex, follow");
      const el = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
      if (el) el.dataset.clientSet = shouldNoindexPage ? "true" : "";
    } else {
      setMeta("robots", "index, follow");
      const el = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
      if (el) el.dataset.clientSet = "true";
    }

    setMeta("description", effectiveDescription);
    if (effectiveKeywords) setMeta("keywords", effectiveKeywords);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", effectiveDescription, true);
    setMeta("og:type", ogType, true);
    setMeta("og:image", `${SITE_DOMAIN}/opengraph.jpg`, true);
    setMeta("og:locale", LOCALE_LANGUAGE_MAP[activeLocale] || "en-CA", true);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", effectiveDescription);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:image", `${SITE_DOMAIN}/opengraph.jpg`);

    const hreflangLinks: HTMLLinkElement[] = [];

    if (canonicalPath) {
      const { pathWithoutLocale: canonicalBase } = getLocaleFromPath(canonicalPath);
      const canonicalUrl = normalizeCanonicalUrl(canonicalBase, activeLocale, SITE_DOMAIN);

      setMeta("og:url", canonicalUrl, true);

      const isFirstRender = seoFirstRender;
      seoFirstRender = false;

      const existingCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      const ssrCanonicalCorrect = isFirstRender && existingCanonical && existingCanonical.href === canonicalUrl;

      if (!ssrCanonicalCorrect) {
        let link = existingCanonical;
        if (!link) {
          link = document.createElement("link");
          link.rel = "canonical";
          document.head.appendChild(link);
        }
        link.href = canonicalUrl;
      }

      const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
      const ssrHreflangsCorrect = isFirstRender && existingHreflangs.length > 0;

      if (!ssrHreflangsCorrect) {
        existingHreflangs.forEach(el => el.remove());

        const filteredLocales = indexableLocales.filter(locale => {
          if (locale === "en") return true;
          if (isLowValueTranslatedPage(canonicalBase, locale)) return false;
          return true;
        });

        for (const locale of filteredLocales) {
          const altLink = document.createElement("link");
          altLink.rel = "alternate";
          altLink.hreflang = HREFLANG_MAP[locale] || locale;
          altLink.href = normalizeCanonicalUrl(canonicalBase, locale, SITE_DOMAIN);
          document.head.appendChild(altLink);
          hreflangLinks.push(altLink);
        }

        const xDefaultLink = document.createElement("link");
        xDefaultLink.rel = "alternate";
        xDefaultLink.hreflang = "x-default";
        xDefaultLink.href = normalizeCanonicalUrl(canonicalBase, "en", SITE_DOMAIN);
        document.head.appendChild(xDefaultLink);
        hreflangLinks.push(xDefaultLink);
      }
    }

    const scriptIds: string[] = [];

    const inLanguage = LOCALE_LANGUAGE_MAP[activeLocale] || "en-CA";

    if (structuredData) {
      const enrichedData = { ...structuredData, inLanguage };
      let script = document.getElementById("structured-data") as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.id = "structured-data";
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(enrichedData);
      scriptIds.push("structured-data");
    }

    if (additionalStructuredData) {
      const filtered = additionalStructuredData.filter(
        (data) => data["@type"] !== "BreadcrumbList"
      );
      filtered.forEach((data, i) => {
        const id = `structured-data-${i}`;
        const enrichedData = { ...data, inLanguage };
        let script = document.getElementById(id) as HTMLScriptElement;
        if (!script) {
          script = document.createElement("script");
          script.id = id;
          script.type = "application/ld+json";
          document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(enrichedData);
        scriptIds.push(id);
      });
    }

    if (!shouldNoindexPage && !noBreadcrumbs) {
      const items = breadcrumbs && breadcrumbs.length > 0
        ? breadcrumbs
        : buildBreadcrumbs(currentPath, { title: effectiveTitle });

      if (items.length >= 2) {
        const jsonLd = { ...buildBreadcrumbJsonLd(items), inLanguage };
        const existing = document.getElementById("breadcrumb-jsonld");
        if (existing) existing.remove();

        const script = document.createElement("script");
        script.id = "breadcrumb-jsonld";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(script);
        scriptIds.push("breadcrumb-jsonld");
      }
    }

    return () => {
      const mainScript = document.getElementById("structured-data");
      if (mainScript) mainScript.remove();
      scriptIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
      hreflangLinks.forEach((el) => el.remove());
    };
  }, [title, description, keywords, canonicalPath, ogType, noindex, structuredData, additionalStructuredData, breadcrumbs, noBreadcrumbs]);

  return null;
}
