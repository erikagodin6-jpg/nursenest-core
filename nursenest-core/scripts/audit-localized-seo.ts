import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  buildLocalizedSeoAudit,
  duplicateLocalizedSlugs,
  getLocalizedSeoAuditLocales,
  LOCALIZED_SEO_SURFACES,
} from "../src/lib/seo/localized-seo-readiness";

type CompletenessSurface = {
  route: string;
  locale: string;
  indexable?: boolean;
  shouldNoindex?: boolean;
  seoIssues?: string[];
  jsonLdIssues?: string[];
  missingKeys?: string[];
  englishLeakSuspicions?: string[];
  untranslatedFields?: string[];
  placeholderFields?: string[];
};

async function readJsonIfExists<T>(path: string): Promise<T | null> {
  if (!existsSync(path)) return null;
  return JSON.parse(await readFile(path, "utf8")) as T;
}

function surfacesFromReport(raw: unknown): CompletenessSurface[] {
  if (!raw || typeof raw !== "object") return [];
  const record = raw as Record<string, unknown>;
  if (Array.isArray(record.surfaces)) return record.surfaces as CompletenessSurface[];
  if (Array.isArray(record.results)) return record.results as CompletenessSurface[];
  return [];
}

function formatIssueList(issues: string[]): string {
  return issues.length ? issues.map((x) => `- ${x}`).join("\n") : "- None";
}

function completenessReportCandidates(locale: string): string[] {
  const languageNames: Record<string, string> = {
    fr: "french",
    es: "spanish",
    hi: "hindi",
    tl: "tagalog",
    pt: "portuguese",
  };
  return [
    `${locale}-completeness-audit.json`,
    `${locale}-readiness-audit.json`,
    locale === "tl" ? "i18n-tl-audit-after.json" : "",
    locale === "pt" ? "i18n-pt-audit-after.json" : "",
    languageNames[locale] ? `${languageNames[locale]}-completeness-audit.json` : "",
  ].filter(Boolean);
}

async function main() {
  const reportsDir = join(process.cwd(), "reports");
  const locales = [...getLocalizedSeoAuditLocales()];
  const readinessByLocale = new Map<string, CompletenessSurface[]>();
  for (const locale of locales) {
    const surfaces: CompletenessSurface[] = [];
    for (const fileName of completenessReportCandidates(locale)) {
      const raw = await readJsonIfExists<unknown>(join(reportsDir, fileName));
      surfaces.push(...surfacesFromReport(raw));
    }
    readinessByLocale.set(locale, surfaces);
  }

  const items = buildLocalizedSeoAudit(locales).map((item) => {
    const readiness = readinessByLocale.get(item.locale)?.find((s) => s.route === item.localizedPath);
    const readinessIssues: string[] = [];
    if (readiness) {
      if (readiness.shouldNoindex) readinessIssues.push("translation readiness requires noindex");
      if (readiness.missingKeys?.length) readinessIssues.push(`missing translation keys: ${readiness.missingKeys.length}`);
      if (readiness.englishLeakSuspicions?.length) readinessIssues.push(`mixed-language SEO/content suspicions: ${readiness.englishLeakSuspicions.length}`);
      if (readiness.seoIssues?.length) readinessIssues.push(`SEO field issues: ${readiness.seoIssues.length}`);
      if (readiness.jsonLdIssues?.length) readinessIssues.push(`JSON-LD issues: ${readiness.jsonLdIssues.length}`);
    } else if (item.locale !== "en" && item.localizedRouteSupported) {
      readinessIssues.push("no translation-readiness audit row for localized route");
    }
    return {
      ...item,
      readinessMatched: Boolean(readiness),
      issues: [...item.issues, ...readinessIssues],
    };
  });

  const duplicateSlugs = Object.fromEntries(locales.map((locale) => [locale, duplicateLocalizedSlugs(locale)]));
  const duplicateSlugCount = Object.values(duplicateSlugs).reduce((sum, values) => sum + values.length, 0);
  const summary = {
    generatedAt: new Date().toISOString(),
    supportedLocalesAudited: locales,
    routesAudited: items.length,
    surfacesAudited: LOCALIZED_SEO_SURFACES.length,
    localizedSlugsConfigured: items.filter((x) => x.localizedSlug).length,
    breadcrumbIssues: items.filter((x) => x.breadcrumbs.some((b) => !b.label || !b.href)).length,
    metadataIssues: items.filter((x) => x.issues.some((i) => /metadata|SEO field/i.test(i))).length,
    hreflangIssues: items.filter((x) => x.hreflangExpected && Object.keys(x.hreflangLanguages).length < 2).length,
    canonicalIssues: items.filter((x) => !x.canonical).length,
    sitemapExpected: items.filter((x) => x.sitemapExpected).length,
    jsonLdIssues: items.filter((x) => x.issues.some((i) => /JSON-LD/i.test(i))).length,
    duplicateLocalizedSlugs: duplicateSlugs,
    blockedItems: items.filter((x) => x.issues.length > 0).length,
  };

  const report = { summary, items };
  await mkdir(reportsDir, { recursive: true });
  await writeFile(join(reportsDir, "localized-seo-audit.json"), `${JSON.stringify(report, null, 2)}\n`);

  const md = [
    "# Localized SEO Audit",
    "",
    `Generated: ${summary.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Locales audited: ${summary.supportedLocalesAudited.join(", ")}`,
    `- Localized routes audited: ${summary.routesAudited}`,
    `- Localized slug mappings configured: ${summary.localizedSlugsConfigured}`,
    `- Breadcrumb issues: ${summary.breadcrumbIssues}`,
    `- Metadata issues: ${summary.metadataIssues}`,
    `- Hreflang issues: ${summary.hreflangIssues}`,
    `- Canonical issues: ${summary.canonicalIssues}`,
    `- Sitemap-eligible localized URLs: ${summary.sitemapExpected}`,
    `- JSON-LD issues: ${summary.jsonLdIssues}`,
    `- Blocked items: ${summary.blockedItems}`,
    "",
    "## Duplicate Localized Slugs",
    "",
    ...Object.entries(duplicateSlugs).map(([locale, slugs]) => `- ${locale}: ${slugs.length ? slugs.join(", ") : "None"}`),
    "",
    "## Blockers",
    "",
    items
      .filter((x) => x.issues.length > 0)
      .map((x) => `### ${x.locale} ${x.surfaceType}\n\n- Path: ${x.localizedPath}\n- Canonical: ${x.canonical}\n- Sitemap expected: ${x.sitemapExpected ? "yes" : "no"}\n- Hreflang expected: ${x.hreflangExpected ? "yes" : "no"}\n\n${formatIssueList(x.issues)}\n\nRecommended fix: ${x.recommendedFix}`)
      .join("\n\n") || "None",
    "",
    "## PASS/FAIL",
    "",
    summary.blockedItems === 0 && duplicateSlugCount === 0
      ? "PASS: localized SEO policy has no blockers."
      : "FAIL: localized SEO blockers remain. Do not promote blocked localized routes to sitemap/hreflang/indexing.",
  ].join("\n");
  await writeFile(join(reportsDir, "localized-seo-audit.md"), `${md}\n`);
  console.log("[audit:localized-seo] wrote reports/localized-seo-audit.{json,md}");
  if (duplicateSlugCount > 0) process.exitCode = 1;
}

void main().catch((error) => {
  console.error("[audit:localized-seo] failed:");
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
