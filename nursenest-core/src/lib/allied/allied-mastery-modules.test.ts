import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ALLIED_PROFESSION_KEYS } from "@/lib/allied/allied-professions-registry";
import {
  ALLIED_MASTERY_MODULES,
  alliedMasteryModulesForProfession,
  findAlliedMasteryModule,
  isAdminModulePreviewEnabled,
  isAlliedMasteryModulesPublicEnabled,
} from "@/lib/allied/allied-mastery-modules";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function readWorkspaceFile(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

function listFiles(relativePath: string): string[] {
  const absolutePath = join(appRoot, relativePath);
  if (!existsSync(absolutePath)) return [];
  const stat = statSync(absolutePath);
  if (stat.isFile()) return [absolutePath];
  const entries = readdirSync(absolutePath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const child = join(relativePath, entry.name);
    if (entry.isDirectory()) return listFiles(child);
    if (entry.isFile()) return [join(appRoot, child)];
    return [];
  });
}

function readFiles(relativePaths: string[]): string {
  return relativePaths.flatMap(listFiles).map((file) => readFileSync(file, "utf8")).join("\n");
}

test("all allied mastery modules are hidden admin-preview shells", () => {
  assert.equal(ALLIED_MASTERY_MODULES.length, 10);
  for (const module of ALLIED_MASTERY_MODULES) {
    assert.equal(module.isPublic, false, module.id);
    assert.equal(module.adminPreviewOnly, true, module.id);
    assert.equal(module.access, "admin_preview_only", module.id);
    assert.ok(module.entitlementKey.startsWith("ALLIED_"), module.id);
    assert.ok(module.route.startsWith(`/allied/${module.professionKeys[0]}/modules/`), module.id);
    assert.ok(module.contentTypes.includes("lessons"), module.id);
    assert.ok(module.contentTypes.includes("worksheets"), module.id);
    assert.ok(module.contentTypes.includes("clinical_action_layer"), module.id);
  }
});

test("feature flags default to hidden public modules and enabled admin preview", () => {
  assert.equal(isAlliedMasteryModulesPublicEnabled({ ENABLE_ALLIED_MASTERY_MODULES: undefined }), false);
  assert.equal(isAlliedMasteryModulesPublicEnabled({ ENABLE_ALLIED_MASTERY_MODULES: "false" }), false);
  assert.equal(isAlliedMasteryModulesPublicEnabled({ ENABLE_ALLIED_MASTERY_MODULES: "true" }), true);
  assert.equal(isAdminModulePreviewEnabled({ ENABLE_ADMIN_MODULE_PREVIEW: undefined }), true);
  assert.equal(isAdminModulePreviewEnabled({ ENABLE_ADMIN_MODULE_PREVIEW: "false" }), false);
});

test("modules use existing allied profession keys only", () => {
  const liveKeys = new Set(ALLIED_PROFESSION_KEYS);
  for (const module of ALLIED_MASTERY_MODULES) {
    for (const key of module.professionKeys) {
      assert.ok(liveKeys.has(key), `${module.id} uses unknown profession key ${key}`);
    }
  }
});

test("occupation mapping keeps modules profession-specific", () => {
  assert.ok(findAlliedMasteryModule("respiratory", "abg"));
  assert.ok(findAlliedMasteryModule("mlt", "advanced-lab-interpretation"));

  assert.deepEqual(
    alliedMasteryModulesForProfession("respiratory").map((module) => module.slug).sort(),
    ["abg", "ventilator-basics"],
  );
  assert.deepEqual(
    alliedMasteryModulesForProfession("pharmacy-tech").map((module) => module.slug).sort(),
    ["dosage-calculations", "pharmacology-patterns"],
  );
  assert.equal(findAlliedMasteryModule("respiratory", "pharmacology-patterns"), null);
  assert.equal(findAlliedMasteryModule("pta", "adl-functional-assessment"), null);
  assert.equal(findAlliedMasteryModule("ota", "msk-rehab-assessment"), null);
  assert.equal(findAlliedMasteryModule("imaging", "abg"), null);
});

test("public allied module routes fail closed and emit noindex nofollow", () => {
  const indexRoute = readWorkspaceFile("src/app/(marketing)/(default)/allied/[career]/modules/page.tsx");
  const moduleRoute = readWorkspaceFile("src/app/(marketing)/(default)/allied/[career]/modules/[moduleSlug]/page.tsx");
  for (const source of [indexRoute, moduleRoute]) {
    assert.match(source, /getCurrentAlliedMasteryModuleAccess/);
    assert.match(source, /notFound\(\)/);
    assert.match(source, /index:\s*false/);
    assert.match(source, /follow:\s*false/);
  }
});

test("admin preview area is admin guarded", () => {
  const source = readWorkspaceFile("src/app/(admin)/admin/modules/allied/page.tsx");
  assert.match(source, /requireAdmin\(\)/);
  assert.match(source, /Not visible to public users/);
  assert.match(source, /Hidden \/ Admin Preview Only/);
});

test("hidden allied mastery modules are absent from sitemap, localized SEO, public nav, and pricing surfaces", () => {
  const sitemapAndSeo = readFiles(["src/app/sitemap.xml/route.ts", "src/lib/seo", "reports/localized-seo-audit.json"]);
  const navSources = readFiles(["src/lib/navigation", "src/lib/marketing"]);
  const pricingSources = readFiles([
    "src/app/(marketing)/(default)/pricing",
    "src/app/(marketing)/[locale]/pricing",
    "src/lib/pricing",
    "src/lib/conversion/pricing-catalog.ts",
    "src/lib/stripe/pricing-map.ts",
  ]);

  for (const module of ALLIED_MASTERY_MODULES) {
    assert.doesNotMatch(sitemapAndSeo, new RegExp(module.route.replaceAll("/", "\\/")));
    assert.doesNotMatch(navSources, new RegExp(module.route.replaceAll("/", "\\/")));
    assert.doesNotMatch(pricingSources, new RegExp(module.route.replaceAll("/", "\\/")));
    assert.doesNotMatch(pricingSources, new RegExp(module.entitlementKey));
  }
});

test("hidden allied modules do not leak into CAT or practice exam pools", () => {
  const questionPoolSources = readFiles([
    "src/lib/cat",
    "src/lib/practice-tests",
    "src/lib/exam-pathways",
    "src/app/api/cat",
    "src/app/api/practice-tests",
  ]);
  for (const module of ALLIED_MASTERY_MODULES) {
    assert.doesNotMatch(questionPoolSources, new RegExp(module.route.replaceAll("/", "\\/")), module.id);
    assert.doesNotMatch(questionPoolSources, new RegExp(module.entitlementKey), module.id);
  }
});
