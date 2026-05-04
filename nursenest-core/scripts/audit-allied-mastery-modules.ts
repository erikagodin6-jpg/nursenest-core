import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  ALLIED_MASTERY_MODULES,
  ALLIED_MASTERY_PROFESSION_LABELS,
  groupedAlliedMasteryModules,
} from "../src/lib/allied/allied-mastery-modules";

type ExposureCheck = {
  sitemap: boolean;
  localizedSeo: boolean;
  publicNav: boolean;
  pricing: boolean;
  questionPoolLeakage: boolean;
};

type ModuleAuditItem = {
  occupation: string;
  professionKey: string;
  id: string;
  slug: string;
  title: string;
  route: string;
  hiddenStatus: "hidden" | "public";
  publicEnabled: boolean;
  adminPreviewOnly: boolean;
  entitlementKey: string;
  adminPreviewRoute: string;
  contentTypes: string[];
  sitemapExposure: boolean;
  seoExposure: boolean;
  pricingExposure: boolean;
  navExposure: boolean;
  leakageCheck: "pass" | "fail";
  issues: string[];
};

function listFiles(relativePath: string): string[] {
  const absolutePath = join(process.cwd(), relativePath);
  if (!existsSync(absolutePath)) return [];
  const stat = statSync(absolutePath);
  if (stat.isFile()) return [absolutePath];
  return readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    const child = join(relativePath, entry.name);
    if (entry.isDirectory()) return listFiles(child);
    if (entry.isFile()) return [join(process.cwd(), child)];
    return [];
  });
}

function readFiles(paths: string[]): string {
  return paths.flatMap(listFiles).map((file) => readFileSync(file, "utf8")).join("\n");
}

function includesAny(source: string, needles: string[]): boolean {
  return needles.some((needle) => source.includes(needle));
}

function exposureChecks(route: string, entitlementKey: string): ExposureCheck {
  const sitemapSource = readFiles(["src/app/sitemap.xml/route.ts", "src/lib/seo/sitemap-static-xml.ts"]);
  const localizedSeoSource = readFiles(["src/lib/seo/localized-seo-readiness.ts", "reports/localized-seo-audit.json"]);
  const navSource = readFiles(["src/lib/navigation", "src/lib/marketing"]);
  const pricingSource = readFiles([
    "src/app/(marketing)/(default)/pricing",
    "src/app/(marketing)/[locale]/pricing",
    "src/lib/pricing",
    "src/lib/conversion/pricing-catalog.ts",
    "src/lib/stripe/pricing-map.ts",
  ]);
  const questionPoolSource = readFiles([
    "src/lib/cat",
    "src/lib/practice-tests",
    "src/lib/exam-pathways",
    "src/app/api/cat",
    "src/app/api/practice-tests",
  ]);

  return {
    sitemap: sitemapSource.includes(route),
    localizedSeo: localizedSeoSource.includes(route),
    publicNav: navSource.includes(route),
    pricing: includesAny(pricingSource, [route, entitlementKey]),
    questionPoolLeakage: includesAny(questionPoolSource, [route, entitlementKey]),
  };
}

function auditModules(): ModuleAuditItem[] {
  const items: ModuleAuditItem[] = [];
  for (const group of groupedAlliedMasteryModules()) {
    for (const module of group.modules) {
      const exposure = exposureChecks(module.route, module.entitlementKey);
      const issues: string[] = [];
      if (module.isPublic) issues.push("module is public");
      if (!module.adminPreviewOnly) issues.push("module is not adminPreviewOnly");
      if (module.access !== "admin_preview_only") issues.push("module access is not admin_preview_only");
      if (exposure.sitemap) issues.push("route appears in sitemap source");
      if (exposure.localizedSeo) issues.push("route appears in localized SEO source/report");
      if (exposure.publicNav) issues.push("route appears in public navigation/marketing source");
      if (exposure.pricing) issues.push("route or entitlement appears in pricing source");
      if (exposure.questionPoolLeakage) issues.push("route or entitlement appears in CAT/practice exam sources");

      items.push({
        occupation: group.professionLabel,
        professionKey: group.professionKey,
        id: module.id,
        slug: module.slug,
        title: module.title,
        route: module.route,
        hiddenStatus: module.isPublic ? "public" : "hidden",
        publicEnabled: module.isPublic,
        adminPreviewOnly: module.adminPreviewOnly,
        entitlementKey: module.entitlementKey,
        adminPreviewRoute: module.route,
        contentTypes: module.contentTypes,
        sitemapExposure: exposure.sitemap,
        seoExposure: exposure.localizedSeo,
        pricingExposure: exposure.pricing,
        navExposure: exposure.publicNav,
        leakageCheck: exposure.questionPoolLeakage ? "fail" : "pass",
        issues,
      });
    }
  }
  return items;
}

function markdownReport(items: ModuleAuditItem[]): string {
  const pass = items.every((item) => item.issues.length === 0);
  const lines: string[] = [
    "# Allied Mastery Modules Readiness",
    "",
    `PASS/FAIL: ${pass ? "PASS" : "FAIL"}`,
    "",
    "These career-specific allied mastery modules are hidden admin-preview shells only. Public launch, checkout, pricing, sitemap, hreflang, and localized SEO promotion remain disabled.",
    "",
    "## Summary",
    "",
    `- Occupations configured: ${Object.keys(ALLIED_MASTERY_PROFESSION_LABELS).length}`,
    `- Modules configured: ${ALLIED_MASTERY_MODULES.length}`,
    `- Hidden modules: ${items.filter((item) => item.hiddenStatus === "hidden").length}`,
    `- Public modules: ${items.filter((item) => item.publicEnabled).length}`,
    `- Exposure issues: ${items.reduce((sum, item) => sum + item.issues.length, 0)}`,
    "",
    "## Modules",
    "",
  ];

  for (const item of items) {
    lines.push(`### ${item.occupation} - ${item.title}`);
    lines.push("");
    lines.push(`- Route: ${item.route}`);
    lines.push(`- Status: ${item.hiddenStatus} / ${item.adminPreviewOnly ? "Admin Preview Only" : "Not admin-preview-only"}`);
    lines.push(`- Public enabled: ${item.publicEnabled}`);
    lines.push(`- Entitlement key: ${item.entitlementKey}`);
    lines.push(`- Content types: ${item.contentTypes.join(", ")}`);
    lines.push(`- Sitemap exposure: ${item.sitemapExposure}`);
    lines.push(`- Localized SEO exposure: ${item.seoExposure}`);
    lines.push(`- Pricing exposure: ${item.pricingExposure}`);
    lines.push(`- Public nav exposure: ${item.navExposure}`);
    lines.push(`- CAT/practice leakage check: ${item.leakageCheck}`);
    lines.push(`- Issues: ${item.issues.length ? item.issues.join("; ") : "None"}`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const items = auditModules();
  const pass = items.every((item) => item.issues.length === 0);
  const report = {
    generatedAt: new Date().toISOString(),
    pass,
    summary: {
      occupationsConfigured: Object.keys(ALLIED_MASTERY_PROFESSION_LABELS).length,
      modulesConfigured: ALLIED_MASTERY_MODULES.length,
      hiddenModules: items.filter((item) => item.hiddenStatus === "hidden").length,
      publicModules: items.filter((item) => item.publicEnabled).length,
      exposureIssues: items.reduce((sum, item) => sum + item.issues.length, 0),
    },
    modules: items,
  };

  await mkdir("reports", { recursive: true });
  await writeFile("reports/allied-mastery-modules-readiness.json", `${JSON.stringify(report, null, 2)}\n`);
  await writeFile("reports/allied-mastery-modules-readiness.md", markdownReport(items));

  if (!pass) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
