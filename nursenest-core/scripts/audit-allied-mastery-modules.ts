import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ensureAlliedMasteryScaffolds, ALLIED_MASTERY_SCAFFOLDS_PATH } from "./generate-allied-mastery-scaffolds";
import {
  evaluateAlliedMasteryScaffold,
  type AlliedMasteryScaffoldMap,
} from "../src/lib/allied/allied-mastery-module-scaffolding";
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
  scaffoldStatus: "complete" | "incomplete";
  scaffoldMissing: string[];
  scaffoldCounts: {
    lessonOutlines: number;
    quizPlaceholders: number;
    caseScenarioTitles: number;
    rapidDrillSets: number;
    worksheetPlaceholders: number;
    patternMapDefinitions: number;
    visualQuestionPlaceholders: number;
  };
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

function readScaffoldMap(): AlliedMasteryScaffoldMap {
  if (!existsSync(ALLIED_MASTERY_SCAFFOLDS_PATH)) return {};
  const raw = readFileSync(ALLIED_MASTERY_SCAFFOLDS_PATH, "utf8").trim();
  if (!raw) return {};
  return JSON.parse(raw) as AlliedMasteryScaffoldMap;
}

function auditModules(scaffolds: AlliedMasteryScaffoldMap): ModuleAuditItem[] {
  const items: ModuleAuditItem[] = [];
  for (const group of groupedAlliedMasteryModules()) {
    for (const module of group.modules) {
      const exposure = exposureChecks(module.route, module.entitlementKey);
      const scaffold = scaffolds[module.id];
      const scaffoldCompleteness = evaluateAlliedMasteryScaffold(scaffold, module);
      const issues: string[] = [];
      if (module.isPublic) issues.push("module is public");
      if (!module.adminPreviewOnly) issues.push("module is not adminPreviewOnly");
      if (module.access !== "admin_preview_only") issues.push("module access is not admin_preview_only");
      if (scaffoldCompleteness.status === "incomplete") {
        issues.push(`module scaffold incomplete: ${scaffoldCompleteness.missing.join(", ")}`);
      }
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
        scaffoldStatus: scaffoldCompleteness.status,
        scaffoldMissing: scaffoldCompleteness.missing,
        scaffoldCounts: {
          lessonOutlines: scaffold?.lessonOutlines?.length ?? 0,
          quizPlaceholders: scaffold?.quizPlaceholders?.length ?? 0,
          caseScenarioTitles: scaffold?.caseScenarioTitles?.length ?? 0,
          rapidDrillSets: scaffold?.rapidDrillSets?.length ?? 0,
          worksheetPlaceholders: scaffold?.worksheetPlaceholders?.length ?? 0,
          patternMapDefinitions: scaffold?.patternMapDefinitions?.length ?? 0,
          visualQuestionPlaceholders: scaffold?.visualQuestionPlaceholders?.length ?? 0,
        },
        issues,
      });
    }
  }
  return items;
}

function markdownReport(items: ModuleAuditItem[], generation: Awaited<ReturnType<typeof ensureAlliedMasteryScaffolds>>): string {
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
    `- Complete scaffolds: ${items.filter((item) => item.scaffoldStatus === "complete").length}`,
    `- Incomplete scaffolds: ${items.filter((item) => item.scaffoldStatus === "incomplete").length}`,
    `- Exposure issues: ${items.reduce((sum, item) => sum + item.issues.length, 0)}`,
    "",
    "## Scaffold Generation",
    "",
    `- Scaffold path: ${generation.path}`,
    `- Modules checked: ${generation.modulesChecked}`,
    `- Modules generated or completed this run: ${generation.modulesGenerated}`,
    `- Modules complete after generation: ${generation.modulesCompleted}`,
    `- Incomplete before generation: ${generation.incompleteBefore.length}`,
    `- Incomplete after generation: ${generation.incompleteAfter.length}`,
    `- Generated module IDs: ${generation.generatedModuleIds.length ? generation.generatedModuleIds.join(", ") : "None"}`,
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
    lines.push(`- Scaffold status: ${item.scaffoldStatus}`);
    lines.push(
      `- Scaffold counts: ${item.scaffoldCounts.lessonOutlines} lesson outlines, ${item.scaffoldCounts.quizPlaceholders} quiz placeholders, ${item.scaffoldCounts.caseScenarioTitles} case titles, ${item.scaffoldCounts.rapidDrillSets} rapid drill sets, ${item.scaffoldCounts.worksheetPlaceholders} worksheet placeholders, ${item.scaffoldCounts.patternMapDefinitions} pattern maps, ${item.scaffoldCounts.visualQuestionPlaceholders} visual question placeholders`,
    );
    lines.push(`- Scaffold missing: ${item.scaffoldMissing.length ? item.scaffoldMissing.join(", ") : "None"}`);
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
  const generation = await ensureAlliedMasteryScaffolds();
  const scaffolds = readScaffoldMap();
  const items = auditModules(scaffolds);
  const pass = items.every((item) => item.issues.length === 0);
  const report = {
    generatedAt: new Date().toISOString(),
    pass,
    scaffoldGeneration: generation,
    summary: {
      occupationsConfigured: Object.keys(ALLIED_MASTERY_PROFESSION_LABELS).length,
      modulesConfigured: ALLIED_MASTERY_MODULES.length,
      hiddenModules: items.filter((item) => item.hiddenStatus === "hidden").length,
      publicModules: items.filter((item) => item.publicEnabled).length,
      completeScaffolds: items.filter((item) => item.scaffoldStatus === "complete").length,
      incompleteScaffolds: items.filter((item) => item.scaffoldStatus === "incomplete").length,
      exposureIssues: items.reduce((sum, item) => sum + item.issues.length, 0),
    },
    modules: items,
  };

  await mkdir("reports", { recursive: true });
  await writeFile("reports/allied-mastery-modules-readiness.json", `${JSON.stringify(report, null, 2)}\n`);
  await writeFile("reports/allied-mastery-modules-readiness.md", markdownReport(items, generation));

  if (!pass) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
