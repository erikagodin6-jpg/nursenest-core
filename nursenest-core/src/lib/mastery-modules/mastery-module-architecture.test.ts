import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { MASTERY_MODULE_REGISTRY, masteryModulesByType } from "@/lib/mastery-modules/mastery-module-registry";

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

test("shared MasteryModule Prisma architecture exists", () => {
  const schema = readFileSync(join(process.cwd(), "prisma/schema.prisma"), "utf8");
  for (const model of ["MasteryModule", "MasteryLesson", "MasteryQuestion", "MasteryCaseScenario", "MasteryPatternMap"]) {
    assert.match(schema, new RegExp(`model\\s+${model}\\s+\\{`), model);
  }
  assert.match(schema, /@@map\("mastery_modules"\)/);
  assert.match(schema, /moduleType\s+String\s+@map\("module_type"\)/);
  assert.match(schema, /isPublic\s+Boolean\s+@default\(false\)/);
  assert.match(schema, /adminPreviewOnly\s+Boolean\s+@default\(true\)/);
});

test("all planned mastery modules are represented in the shared registry with required module types", () => {
  const byType = new Map(MASTERY_MODULE_REGISTRY.map((module) => [module.id, module.moduleType]));
  const expected = {
    "ecg-mastery": "ecg",
    "lab-values-basics": "lab-values",
    "lab-values-basic": "lab-values",
    "lab-values-advanced": "lab-values",
    "respiratory-abg-mastery": "abg",
    "respiratory-ventilator-basics": "ventilator-management",
    "respiratory-ventilator-management": "ventilator-management",
    "respiratory-paramedic-oxygen-delivery": "oxygen-delivery",
    "paramedic-oxygen-delivery": "oxygen-delivery",
    "respiratory-paramedic-respiratory-distress": "respiratory-distress",
    "paramedic-respiratory-distress": "respiratory-distress",
    "pharmacy-tech-iv-infusion-safety": "iv-infusion-safety",
    "paramedic-iv-infusion-safety": "iv-infusion-safety",
    "paramedic-neuro-stroke-recognition": "neuro-stroke-recognition",
    "ota-neuro-stroke-recognition": "neuro-stroke-recognition",
    "paramedic-trauma-triage": "trauma-triage",
    "mlt-advanced-lab-interpretation": "advanced-lab-interpretation",
    "pharmacy-tech-pharmacology-patterns": "pharmacy",
    "pharmacy-tech-dosage-calculations": "pharmacy",
    "ota-adl-functional-assessment": "functional-assessment",
    "pta-msk-rehab-assessment": "msk-rehab",
    "imaging-image-recognition": "image-recognition",
    "sonography-ecg-cardiac-patterns": "cardiac-pattern-recognition",
    "paramedic-emergency-pattern-recognition": "emergency-pattern-recognition",
  } as const;
  assert.equal(MASTERY_MODULE_REGISTRY.length, Object.keys(expected).length);
  for (const [id, moduleType] of Object.entries(expected)) {
    assert.equal(byType.get(id), moduleType, id);
  }
  assert.equal(masteryModulesByType("oxygen-delivery").length, 2);
  assert.equal(masteryModulesByType("respiratory-distress").length, 2);
  assert.equal(masteryModulesByType("iv-infusion-safety").length, 2);
  assert.equal(masteryModulesByType("neuro-stroke-recognition").length, 2);
  assert.equal(masteryModulesByType("lab-values").length, 3);
});

test("shared mastery registry entries stay hidden and admin-preview only", () => {
  for (const module of MASTERY_MODULE_REGISTRY) {
    assert.equal(module.isPublic, false, module.id);
    assert.equal(module.adminPreviewOnly, true, module.id);
    assert.ok(module.route.startsWith("/"), module.id);
  }
});

test("admin module routes are guarded and allied admin preview is paginated", () => {
  const adminRoot = readFileSync(join(process.cwd(), "src/app/(admin)/admin/modules/page.tsx"), "utf8");
  const alliedAdmin = readFileSync(join(process.cwd(), "src/app/(admin)/admin/modules/allied/page.tsx"), "utf8");
  assert.match(adminRoot, /requireAdmin\(\)/);
  assert.match(alliedAdmin, /requireAdmin\(\)/);
  assert.match(alliedAdmin, /ADMIN_ALLIED_MODULES_PAGE_SIZE/);
  assert.match(alliedAdmin, /slice\(\(page - 1\) \* ADMIN_ALLIED_MODULES_PAGE_SIZE/);
});

test("hidden mastery modules stay out of public exposure surfaces", () => {
  const sitemapAndSeo = readFiles(["src/app/sitemap.xml/route.ts", "src/lib/seo", "reports/localized-seo-audit.json", "reports/localized-seo-audit.md"]);
  const navPricingHome = readFiles([
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
  for (const module of MASTERY_MODULE_REGISTRY) {
    assert.doesNotMatch(sitemapAndSeo, new RegExp(module.route.replaceAll("/", "\\/")), module.route);
    assert.doesNotMatch(navPricingHome, new RegExp(module.route.replaceAll("/", "\\/")), module.route);
    assert.doesNotMatch(navPricingHome, new RegExp(module.entitlementKey.replaceAll("/", "\\/")), module.entitlementKey);
  }
});

test("CAT and core practice exam code do not query MasteryQuestion", () => {
  const poolSources = readFiles(["src/lib/cat", "src/lib/practice-tests", "src/lib/exam-pathways", "src/app/api/cat", "src/app/api/practice-tests"]);
  assert.doesNotMatch(poolSources, /masteryQuestion/i);
  assert.doesNotMatch(poolSources, /MasteryQuestion/);
  assert.doesNotMatch(poolSources, /mastery_questions/);
});

test("mastery media stays URL/config only with no local media imports", () => {
  const masterySources = readFiles(["src/lib/allied", "src/lib/mastery-modules", "src/components/ecg-module", "src/components/study/ecg-live-strip.tsx"]);
  assert.doesNotMatch(masterySources, /import\s+.*\.(mp4|webm|mp3|wav|png|jpg|jpeg|gif|svg)/i);
  assert.doesNotMatch(masterySources, /from\s+["'][^"']+\.(mp4|webm|mp3|wav|png|jpg|jpeg|gif|svg)["']/i);
  assert.match(masterySources, /Url|mediaConfig|deviceImageUrl|waveformImageUrl|videoUrl|audioUrl/);
});