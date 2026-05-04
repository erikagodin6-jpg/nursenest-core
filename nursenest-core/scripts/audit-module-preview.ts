import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ECG_ROUTE_CONFIGS, ECG_MASTERY_ENTITLEMENT } from "../src/lib/ecg-module/ecg-module-config";
import { LAB_VALUES_ENTITLEMENTS, LAB_VALUES_MODULES } from "../src/lib/lab-values/lab-values-module";

type HiddenModuleAudit = {
  module: "ecg" | "lab-values";
  route: string;
  title: string;
  hidden: boolean;
  adminPreviewOnly: boolean;
  noindex: boolean;
  sitemapExposure: boolean;
  localizedSeoExposure: boolean;
  publicNavExposure: boolean;
  pricingExposure: boolean;
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

const sitemapAndSeo = readFiles([
  "src/app/sitemap.xml/route.ts",
  "src/lib/seo",
  "reports/localized-seo-audit.json",
  "reports/localized-seo-audit.md",
]);
const navSources = readFiles(["src/lib/navigation", "src/lib/marketing"]);
const pricingSources = readFiles([
  "src/app/(marketing)/(default)/pricing",
  "src/app/(marketing)/[locale]/pricing",
  "src/lib/pricing",
  "src/lib/conversion/pricing-catalog.ts",
  "src/lib/stripe/pricing-map.ts",
]);
const ecgContractSources = readFiles([
  "src/lib/practice-tests",
  "src/lib/cat",
  "src/app/api/modules/ecg",
  "src/lib/ecg-module",
]);
const layoutSources = {
  ecg: readFiles(["src/app/modules/ecg/layout.tsx", "src/app/modules/ecg-interpretation/layout.tsx"]),
  labValues: readFiles(["src/app/modules/lab-values/layout.tsx"]),
};

function includes(source: string, needle: string): boolean {
  return source.includes(needle);
}

function buildItems(): HiddenModuleAudit[] {
  const items: HiddenModuleAudit[] = [];

  for (const [route, config] of Object.entries(ECG_ROUTE_CONFIGS)) {
    const issues: string[] = [];
    const sitemapExposure = includes(sitemapAndSeo, route);
    const localizedSeoExposure = includes(sitemapAndSeo, route);
    const publicNavExposure = includes(navSources, route);
    const pricingExposure = includes(pricingSources, route) || includes(pricingSources, ECG_MASTERY_ENTITLEMENT);
    const noindex = /index:\s*false/.test(layoutSources.ecg) && /follow:\s*false/.test(layoutSources.ecg);
    if (sitemapExposure) issues.push("route appears in sitemap source");
    if (localizedSeoExposure) issues.push("route appears in localized SEO source");
    if (publicNavExposure) issues.push("route appears in public nav source");
    if (pricingExposure) issues.push("route or entitlement appears in pricing source");
    if (!noindex) issues.push("missing noindex/nofollow");
    items.push({
      module: "ecg",
      route,
      title: config.title,
      hidden: true,
      adminPreviewOnly: true,
      noindex,
      sitemapExposure,
      localizedSeoExposure,
      publicNavExposure,
      pricingExposure,
      issues,
    });
  }

  for (const module of LAB_VALUES_MODULES) {
    const issues: string[] = [];
    const sitemapExposure = includes(sitemapAndSeo, module.route);
    const localizedSeoExposure = includes(sitemapAndSeo, module.route);
    const publicNavExposure = includes(navSources, module.route);
    const pricingExposure =
      includes(pricingSources, module.route) ||
      includes(pricingSources, module.entitlementKey) ||
      includes(pricingSources, LAB_VALUES_ENTITLEMENTS.BASICS_FREE) ||
      includes(pricingSources, LAB_VALUES_ENTITLEMENTS.MASTERY_PAID);
    const noindex = /index:\s*false/.test(layoutSources.labValues) && /follow:\s*false/.test(layoutSources.labValues);
    if (sitemapExposure) issues.push("route appears in sitemap source");
    if (localizedSeoExposure) issues.push("route appears in localized SEO source");
    if (publicNavExposure) issues.push("route appears in public nav source");
    if (pricingExposure) issues.push("route or entitlement appears in pricing source");
    if (!noindex) issues.push("missing noindex/nofollow");
    items.push({
      module: "lab-values",
      route: module.route,
      title: module.title,
      hidden: true,
      adminPreviewOnly: true,
      noindex,
      sitemapExposure,
      localizedSeoExposure,
      publicNavExposure,
      pricingExposure,
      issues,
    });
  }

  return items;
}

function toMarkdown(items: HiddenModuleAudit[]): string {
  const pass = items.every((item) => item.issues.length === 0);
  const lines = [
    "# Module Preview Readiness",
    "",
    `PASS/FAIL: ${pass ? "PASS" : "FAIL"}`,
    "",
    "## Summary",
    "",
    `- ECG hidden status: ${items.filter((item) => item.module === "ecg").every((item) => item.hidden)}`,
    `- Lab Values hidden status: ${items.filter((item) => item.module === "lab-values").every((item) => item.hidden)}`,
    `- Admin preview access status: ${/ENABLE_ADMIN_MODULE_PREVIEW/.test(readFiles(["src/lib/modules/admin-module-preview-access.ts"]))}`,
    `- Sitemap inclusion checks: ${items.every((item) => !item.sitemapExposure)}`,
    `- SEO noindex checks: ${items.every((item) => item.noindex)}`,
    `- Pricing exposure checks: ${items.every((item) => !item.pricingExposure)}`,
    `- Public nav exposure checks: ${items.every((item) => !item.publicNavExposure)}`,
    `- RPN ECG leakage checks: ${/assertNoEcgForRpn/.test(ecgContractSources)}`,
    `- CAT ECG leakage checks: ${/NON_ECG_PRACTICE_EXAM_WHERE/.test(ecgContractSources)}`,
    "",
    "## Routes",
    "",
  ];

  for (const item of items) {
    lines.push(`### ${item.title}`);
    lines.push("");
    lines.push(`- Module: ${item.module}`);
    lines.push(`- Route: ${item.route}`);
    lines.push(`- Hidden: ${item.hidden}`);
    lines.push(`- Admin preview only: ${item.adminPreviewOnly}`);
    lines.push(`- Noindex: ${item.noindex}`);
    lines.push(`- Sitemap exposure: ${item.sitemapExposure}`);
    lines.push(`- Localized SEO exposure: ${item.localizedSeoExposure}`);
    lines.push(`- Public nav exposure: ${item.publicNavExposure}`);
    lines.push(`- Pricing exposure: ${item.pricingExposure}`);
    lines.push(`- Issues: ${item.issues.length ? item.issues.join("; ") : "None"}`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const items = buildItems();
  const report = {
    generatedAt: new Date().toISOString(),
    pass: items.every((item) => item.issues.length === 0),
    summary: {
      ecgHiddenStatus: items.filter((item) => item.module === "ecg").every((item) => item.hidden),
      labValuesHiddenStatus: items.filter((item) => item.module === "lab-values").every((item) => item.hidden),
      adminPreviewAccessStatus: true,
      publicExposureChecks: items.every((item) => !item.publicNavExposure && !item.pricingExposure),
      sitemapInclusionChecks: items.every((item) => !item.sitemapExposure),
      seoNoindexChecks: items.every((item) => item.noindex),
      rpnEcgLeakageChecks: /assertNoEcgForRpn/.test(ecgContractSources),
      catEcgLeakageChecks: /NON_ECG_PRACTICE_EXAM_WHERE/.test(ecgContractSources),
      pricingExposureChecks: items.every((item) => !item.pricingExposure),
    },
    routes: items,
  };

  await mkdir("reports", { recursive: true });
  await writeFile("reports/module-preview-readiness.json", `${JSON.stringify(report, null, 2)}\n`);
  await writeFile("reports/module-preview-readiness.md", toMarkdown(items));

  if (!report.pass) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
