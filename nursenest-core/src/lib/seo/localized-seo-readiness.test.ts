import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
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
  assert.deepEqual(localizedBreadcrumbsFor("tl", pricing), [
    { label: "Home", href: "/tl" },
    { label: "Presyo", href: "/tl/pricing" },
  ]);
});

test("localized slug map provides URL-safe slugs without duplicates", () => {
  assert.equal(localizedSlugFor("fr", "practice-questions"), "questions-pratiques");
  assert.equal(localizedSlugFor("es", "practice-questions"), "preguntas-de-practica");
  assert.equal(localizedSlugFor("tl", "practice-questions"), "mga-practice-questions");
  assert.equal(localizedSlugFor("fr", "nursing-exam-prep"), "preparation-examens-soins-infirmiers");
  assert.equal(localizedSlugFor("es", "nursing-exam-prep"), "preparacion-examenes-enfermeria");
  assert.equal(localizedSlugFor("tl", "nursing-exam-prep"), "paghahanda-nursing-exams");
  assert.deepEqual(duplicateLocalizedSlugs("fr"), []);
  assert.deepEqual(duplicateLocalizedSlugs("es"), []);
  assert.deepEqual(duplicateLocalizedSlugs("tl"), []);
});

test("localized SEO audit locales follow the supported marketing language registry", () => {
  const locales = getLocalizedSeoAuditLocales();
  assert.ok(locales.includes("en"));
  assert.ok(locales.includes("fr"));
  assert.ok(locales.includes("es"));
  assert.ok(locales.includes("hi"));
  assert.ok(locales.includes("tl"));
  assert.equal(locales.includes("pt"), false);
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

test("Tagalog has localized SEO breadcrumbs and slug mappings for shared pages", () => {
  const item = buildLocalizedSeoAuditItem("tl", surface("practice-questions-hub"));
  assert.equal(item.localizedPath, "/tl/question-bank");
  assert.equal(item.localizedSlug, "mga-practice-questions");
  assert.equal(item.breadcrumbs[0]?.label, "Home");
  assert.equal(item.breadcrumbs[1]?.label, "Mga practice questions");
  assert.equal(item.sitemapExpected, true);
  assert.equal(item.hreflangExpected, true);
});

test("Hindi has localized SEO breadcrumbs and slug mappings for shared pages", () => {
  const item = buildLocalizedSeoAuditItem("hi", surface("practice-questions-hub"));
  assert.equal(item.localizedPath, "/hi/question-bank");
  assert.equal(item.localizedSlug, "practice-prashn");
  assert.equal(item.breadcrumbs[0]?.label, "होम");
  assert.equal(item.breadcrumbs[1]?.label, "प्रैक्टिस प्रश्न");
  assert.equal(item.sitemapExpected, true);
});

test("Portuguese remains blocked from indexing until production readiness is explicitly restored", () => {
  const item = buildLocalizedSeoAuditItem("pt", surface("practice-questions-hub"));
  assert.equal(item.localizedPath, "/pt/question-bank");
  assert.equal(item.localizedSlug, "questoes-de-pratica");
  assert.equal(item.breadcrumbs[0]?.label, "Início");
  assert.equal(item.breadcrumbs[1]?.label, "Questões de prática");
  assert.equal(item.sitemapExpected, false);
  assert.equal(item.hreflangExpected, false);
  assert.equal("pt-BR" in item.hreflangLanguages, false);
  assert.ok(item.issues.some((issue) => issue.includes("not SEO-indexable")));
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

test("sitemap safe URL collector includes indexable Tagalog localized hubs", () => {
  const urls = collectLocaleMarketingSitemapSafeUrls("https://www.nursenest.ca", "tl");
  assert.ok(urls.includes("https://www.nursenest.ca/tl"));
  assert.ok(urls.includes("https://www.nursenest.ca/tl/pricing"));
  assert.ok(urls.includes("https://www.nursenest.ca/tl/lessons"));
  assert.ok(urls.includes("https://www.nursenest.ca/tl/question-bank"));
});

test("country exam readiness snapshot helper stays free of node:module and createRequire", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/lib/navigation/country-exam-readiness-snapshot.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /node:module/);
  assert.doesNotMatch(source, /createRequire/);
});

test("database url drift audit helper stays free of node:crypto for webpack route boot", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/lib/db/database-url-drift-audit.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /node:crypto/);
});

test("study snapshot startup diagnostics helper stays free of node:fs scheme imports for webpack route boot", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/lib/study-content-failover/study-snapshot-runtime-diagnostics.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /node:fs/);
  assert.doesNotMatch(source, /node:path/);
  assert.doesNotMatch(source, /import\s+.+\s+from\s+["']fs(?:\/promises)?["']/);
  assert.doesNotMatch(source, /import\s+.+\s+from\s+["']path["']/);
  assert.match(source, /webpackIgnore:\s*true/);
});
