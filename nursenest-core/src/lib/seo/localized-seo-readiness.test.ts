import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLocalizedSeoAuditItem,
  duplicateLocalizedSlugs,
  getLocalizedSeoAuditLocales,
  localizedBreadcrumbsFor,
  localizedSlugFor,
  LOCALIZED_SEO_SURFACES,
} from "@/lib/seo/localized-seo-readiness";
import { collectLocaleMarketingSitemapSafeUrls } from "@/lib/seo/sitemap-static-xml";

function surface(type: string) {
  const found = LOCALIZED_SEO_SURFACES.find((s) => s.surfaceType === type);
  assert.ok(found, `missing surface ${type}`);
  return found;
}

test("localized breadcrumb labels and URLs use the selected language", () => {
  const pricing = surface("pricing");
  assert.deepEqual(localizedBreadcrumbsFor("fr", pricing), [
    { label: "Accueil", href: "/fr" },
    { label: "Tarifs", href: "/fr/pricing" },
  ]);
  assert.deepEqual(localizedBreadcrumbsFor("es", pricing), [
    { label: "Inicio", href: "/es" },
    { label: "Precios", href: "/es/pricing" },
  ]);
});

test("localized slug map provides URL-safe French and Spanish slugs without duplicates", () => {
  assert.equal(localizedSlugFor("fr", "practice-questions"), "questions-pratiques");
  assert.equal(localizedSlugFor("es", "practice-questions"), "preguntas-de-practica");
  assert.equal(localizedSlugFor("fr", "nursing-exam-prep"), "preparation-examens-soins-infirmiers");
  assert.equal(localizedSlugFor("es", "nursing-exam-prep"), "preparacion-examenes-enfermeria");
  assert.deepEqual(duplicateLocalizedSlugs("fr"), []);
  assert.deepEqual(duplicateLocalizedSlugs("es"), []);
});

test("localized SEO audit locales follow the supported marketing language registry", () => {
  const locales = getLocalizedSeoAuditLocales();
  assert.ok(locales.includes("en"));
  assert.ok(locales.includes("fr"));
  assert.ok(locales.includes("es"));
  assert.ok(locales.includes("tl"), "partial supported locales should be audited for future SEO readiness");
});

test("shared localized marketing pages get localized canonical and hreflang policy", () => {
  const item = buildLocalizedSeoAuditItem("es", surface("pricing"));
  assert.equal(item.localizedPath, "/es/pricing");
  assert.match(item.canonical, /\/es\/pricing$/);
  assert.equal(item.sitemapExpected, true);
  assert.equal(item.hreflangLanguages["es"], item.canonical);
  assert.equal(item.issues.length, 0);
});

test("French remains blocked from indexing until translation readiness is complete", () => {
  const item = buildLocalizedSeoAuditItem("fr", surface("pricing"));
  assert.equal(item.localizedPath, "/fr/pricing");
  assert.equal(item.sitemapExpected, false);
  assert.ok(item.issues.some((issue) => issue.includes("not SEO-indexable")));
});

test("supported locales without localized SEO assets fail closed instead of falling back to English", () => {
  const item = buildLocalizedSeoAuditItem("tl", surface("practice-questions-hub"));
  assert.ok(item.issues.some((issue) => issue.includes("missing localized breadcrumb labels")));
  assert.ok(item.issues.some((issue) => issue.includes("missing localized slug mapping")));
  assert.equal(item.sitemapExpected, false);
});

test("exam pathway hubs do not claim translated route slugs before routing supports them", () => {
  const item = buildLocalizedSeoAuditItem("es", surface("rex-pn-hub"));
  assert.equal(item.localizedRouteSupported, false);
  assert.equal(item.sitemapExpected, false);
  assert.ok(item.issues.some((issue) => issue.includes("localized route not supported")));
});

test("JSON-LD breadcrumb localization contract includes localized labels", () => {
  const crumbs = localizedBreadcrumbsFor("es", surface("practice-questions-hub"));
  assert.equal(crumbs[0]?.label, "Inicio");
  assert.equal(crumbs[1]?.label, "Preguntas de práctica");
  const item = buildLocalizedSeoAuditItem("es", surface("practice-questions-hub"));
  assert.ok(item.jsonLdFields.includes("BreadcrumbList.itemListElement.name"));
});

test("sitemap safe URL collector includes indexable Spanish localized hubs", () => {
  const urls = collectLocaleMarketingSitemapSafeUrls("https://www.nursenest.ca", "es");
  assert.ok(urls.includes("https://www.nursenest.ca/es"));
  assert.ok(urls.includes("https://www.nursenest.ca/es/pricing"));
  assert.ok(urls.includes("https://www.nursenest.ca/es/lessons"));
  assert.ok(urls.includes("https://www.nursenest.ca/es/question-bank"));
});
