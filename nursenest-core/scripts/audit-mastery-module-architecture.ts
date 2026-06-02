import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { MASTERY_MODULE_REGISTRY } from "../src/lib/mastery-modules/mastery-module-registry";

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

function schemaHasSharedModels(schema: string): boolean {
  return ["MasteryModule", "MasteryLesson", "MasteryQuestion", "MasteryCaseScenario", "MasteryPatternMap"].every((model) =>
    new RegExp(`model\\s+${model}\\s+\\{`).test(schema),
  );
}

function markdown(report: typeof architectureReport): string {
  const lines = [
    "# Mastery Module Architecture Audit",
    "",
    `PASS/FAIL: ${report.pass ? "PASS" : "FAIL"}`,
    "",
    "## Summary",
    "",
    `- Modules registered: ${report.summary.modulesRegistered}`,
    `- Shared Prisma models present: ${report.summary.sharedPrismaModelsPresent}`,
    `- Hidden modules: ${report.summary.hiddenModules}`,
    `- Public modules: ${report.summary.publicModules}`,
    `- Exposure issues: ${report.summary.exposureIssues}`,
    `- CAT/practice MasteryQuestion leakage: ${report.summary.catPracticeMasteryQuestionLeakage}`,
    `- Media import issues: ${report.summary.mediaImportIssues}`,
    `- Admin pagination present: ${report.summary.adminPaginationPresent}`,
    "",
    "## Modules",
    "",
  ];
  for (const item of report.modules) {
    lines.push(`### ${item.title}`);
    lines.push(`- id: ${item.id}`);
    lines.push(`- moduleType: ${item.moduleType}`);
    lines.push(`- route: ${item.route}`);
    lines.push(`- hidden/adminPreviewOnly: ${!item.isPublic}/${item.adminPreviewOnly}`);
    lines.push(`- issues: ${item.issues.length ? item.issues.join("; ") : "None"}`);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

const schema = readFileSync("prisma/schema.prisma", "utf8");
const exposureSource = readFiles([
  "src/app/sitemap.xml/route.ts",
  "src/lib/seo",
  "reports/localized-seo-audit.json",
  "reports/localized-seo-audit.md",
  "src/lib/navigation",
  "src/lib/marketing",
  "src/app/(marketing)/(default)/pricing",
  "src/app/(marketing)/[locale]/pricing",
  "src/lib/pricing",
  "src/lib/conversion/pricing-catalog.ts",
  "src/lib/stripe/pricing-map.ts",
  "src/app/(marketing)/(default)/page.tsx",
  "src/app/(marketing)/[locale]/page.tsx",
]);
const poolSource = readFiles(["src/lib/cat", "src/lib/practice-tests", "src/lib/exam-pathways", "src/app/api/cat", "src/app/api/practice-tests"]);
const mediaSource = readFiles(["src/lib/allied", "src/lib/mastery-modules", "src/components/ecg-module", "src/components/study/ecg-live-strip.tsx"]);
const adminAllied = readFileSync("src/app/(admin)/admin/modules/allied/page.tsx", "utf8");

const modules = MASTERY_MODULE_REGISTRY.map((module) => {
  const issues: string[] = [];
  if (module.isPublic) issues.push("module is public");
  if (!module.adminPreviewOnly) issues.push("module is not adminPreviewOnly");
  if (exposureSource.includes(module.route)) issues.push("route appears in public exposure source");
  if (exposureSource.includes(module.entitlementKey)) issues.push("entitlement appears in public exposure source");
  return { ...module, issues };
});

const architectureReport = {
  generatedAt: new Date().toISOString(),
  pass: false,
  summary: {
    modulesRegistered: MASTERY_MODULE_REGISTRY.length,
    sharedPrismaModelsPresent: schemaHasSharedModels(schema),
    hiddenModules: modules.filter((module) => !module.isPublic && module.adminPreviewOnly).length,
    publicModules: modules.filter((module) => module.isPublic).length,
    exposureIssues: modules.reduce((sum, module) => sum + module.issues.length, 0),
    catPracticeMasteryQuestionLeakage: /masteryQuestion|MasteryQuestion|mastery_questions/.test(poolSource),
    mediaImportIssues: /import\s+.*\.(mp4|webm|mp3|wav|png|jpg|jpeg|gif|svg)|from\s+["'][^"']+\.(mp4|webm|mp3|wav|png|jpg|jpeg|gif|svg)["']/i.test(mediaSource),
    adminPaginationPresent: /ADMIN_ALLIED_MODULES_PAGE_SIZE/.test(adminAllied) && /slice\(\(page - 1\) \* ADMIN_ALLIED_MODULES_PAGE_SIZE/.test(adminAllied),
  },
  modules,
};
architectureReport.pass =
  architectureReport.summary.sharedPrismaModelsPresent &&
  architectureReport.summary.publicModules === 0 &&
  architectureReport.summary.exposureIssues === 0 &&
  !architectureReport.summary.catPracticeMasteryQuestionLeakage &&
  !architectureReport.summary.mediaImportIssues &&
  architectureReport.summary.adminPaginationPresent;

await mkdir("reports", { recursive: true });
await writeFile("reports/mastery-module-architecture-audit.json", `${JSON.stringify(architectureReport, null, 2)}\n`);
await writeFile("reports/mastery-module-architecture-audit.md", markdown(architectureReport));
if (!architectureReport.pass) process.exitCode = 1;