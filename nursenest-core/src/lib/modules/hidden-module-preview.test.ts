import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { UserRole } from "@prisma/client";
import { getAdminModulePreviewAccess, isAdminModulePreviewEnabled } from "@/lib/modules/admin-module-preview-access";
import {
  LAB_VALUES_ENTITLEMENTS,
  LAB_VALUES_MODULES,
  isLabValuesModuleEnabled,
} from "@/lib/lab-values/lab-values-module";
import { ECG_MASTERY_PAID } from "@/lib/modules/module-entitlement-placeholders";

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

test("admin module preview flags default to hidden public modules and enabled admin preview", () => {
  assert.equal(isAdminModulePreviewEnabled({ ENABLE_ADMIN_MODULE_PREVIEW: undefined }), true);
  assert.equal(isAdminModulePreviewEnabled({ ENABLE_ADMIN_MODULE_PREVIEW: "false" }), false);
  assert.equal(isLabValuesModuleEnabled({ ENABLE_LAB_VALUES_MODULE: undefined }), false);
  assert.equal(isLabValuesModuleEnabled({ ENABLE_LAB_VALUES_MODULE: "false" }), false);
  assert.equal(isLabValuesModuleEnabled({ ENABLE_LAB_VALUES_MODULE: "true" }), true);
});

test("lab values registry is hidden and keeps basics future-free but not public", () => {
  assert.deepEqual(
    LAB_VALUES_MODULES.map((module) => module.slug),
    ["basics", "basic", "advanced"],
  );
  for (const module of LAB_VALUES_MODULES) {
    assert.equal(module.isPublic, false, module.id);
    assert.equal(module.adminPreviewOnly, true, module.id);
    assert.ok(module.route.startsWith("/modules/lab-values/"), module.id);
  }
  assert.equal(LAB_VALUES_MODULES[0]?.futureAccess, "free");
  assert.equal(LAB_VALUES_MODULES[0]?.entitlementKey, LAB_VALUES_ENTITLEMENTS.BASICS_FREE);
  assert.equal(LAB_VALUES_MODULES[1]?.entitlementKey, LAB_VALUES_ENTITLEMENTS.MASTERY_PAID);
  assert.equal(LAB_VALUES_MODULES[2]?.entitlementKey, LAB_VALUES_ENTITLEMENTS.MASTERY_PAID);
  assert.equal(ECG_MASTERY_PAID, "ECG_MASTERY_PAID");
});

test("admin preview access helper fails closed for signed-out and non-admin users", async () => {
  const signedOut = await getAdminModulePreviewAccess({
    publicEnabled: false,
    surface: "auth.test.hidden_module",
    loadSession: async () => null,
    loadStaffSession: async () => null,
  });
  assert.deepEqual(signedOut, { ok: false, reason: "not-signed-in" });

  const learner = await getAdminModulePreviewAccess({
    publicEnabled: false,
    surface: "auth.test.hidden_module",
    loadSession: async () => ({ user: { id: "learner-1" }, expires: new Date().toISOString() }),
    loadStaffSession: async () => null,
  });
  assert.deepEqual(learner, { ok: false, reason: "not-admin" });

  const admin = await getAdminModulePreviewAccess({
    publicEnabled: false,
    surface: "auth.test.hidden_module",
    loadSession: async () => ({ user: { id: "admin-1" }, expires: new Date().toISOString() }),
    loadStaffSession: async () => ({ userId: "admin-1", role: UserRole.ADMIN, tier: "super" }),
  });
  assert.deepEqual(admin, { ok: true, mode: "admin-preview", userId: "admin-1" });
});

test("required hidden module learner routes are covered by 404/admin-preview guards", () => {
  const guardedRoutes = [
    "src/app/modules/lab-values/page.tsx",
    "src/app/modules/lab-values/basics/page.tsx",
    "src/app/modules/lab-values/basic/page.tsx",
    "src/app/modules/lab-values/advanced/page.tsx",
    "src/app/modules/ecg/page.tsx",
    "src/app/modules/ecg/basic/page.tsx",
    "src/app/modules/ecg/advanced/page.tsx",
  ];
  for (const route of guardedRoutes) {
    assert.equal(existsSync(join(process.cwd(), route)), true, route);
  }

  const labLayout = readFileSync(join(process.cwd(), "src/app/modules/lab-values/layout.tsx"), "utf8");
  const ecgLayout = readFileSync(join(process.cwd(), "src/app/modules/ecg/layout.tsx"), "utf8");
  const labAccess = readFileSync(join(process.cwd(), "src/lib/lab-values/lab-values-module.server.ts"), "utf8");
  const ecgAccess = readFileSync(join(process.cwd(), "src/lib/ecg-module/ecg-module.server.ts"), "utf8");

  assert.match(labLayout, /requireLabValuesModuleAccess/);
  assert.match(ecgLayout, /requireEcgModuleAccess/);
  assert.match(labAccess, /notFound\(\)/);
  assert.match(ecgAccess, /notFound\(\)/);
  assert.match(labAccess, /getAdminModulePreviewAccess/);
  assert.match(ecgAccess, /getAdminModulePreviewAccess/);
});

test("hidden module routes fail closed and emit noindex nofollow", () => {
  const ecgLayouts = [
    readFileSync(join(process.cwd(), "src/app/modules/ecg/layout.tsx"), "utf8"),
    readFileSync(join(process.cwd(), "src/app/modules/ecg-interpretation/layout.tsx"), "utf8"),
  ];
  const labLayout = readFileSync(join(process.cwd(), "src/app/modules/lab-values/layout.tsx"), "utf8");
  const ecgAccess = readFileSync(join(process.cwd(), "src/lib/ecg-module/ecg-module.server.ts"), "utf8");
  const labAccess = readFileSync(join(process.cwd(), "src/lib/lab-values/lab-values-module.server.ts"), "utf8");

  for (const source of [...ecgLayouts, labLayout]) {
    assert.match(source, /index:\s*false/);
    assert.match(source, /follow:\s*false/);
  }
  assert.match(ecgAccess, /notFound\(\)/);
  assert.match(labAccess, /notFound\(\)/);
});

test("admin preview pages exist for hidden ECG and lab values modules", () => {
  for (const route of [
    "src/app/(admin)/admin/modules/page.tsx",
    "src/app/(admin)/admin/modules/ecg/page.tsx",
    "src/app/(admin)/admin/modules/lab-values/page.tsx",
    "src/app/modules/lab-values/page.tsx",
    "src/app/modules/lab-values/basics/page.tsx",
    "src/app/modules/lab-values/basic/page.tsx",
    "src/app/modules/lab-values/advanced/page.tsx",
    "src/app/modules/ecg/page.tsx",
    "src/app/modules/ecg/basic/page.tsx",
    "src/app/modules/ecg/advanced/page.tsx",
  ]) {
    assert.equal(existsSync(join(process.cwd(), route)), true, route);
  }
});

test("hidden module admin preview pages are admin guarded", () => {
  for (const route of [
    "src/app/(admin)/admin/modules/page.tsx",
    "src/app/(admin)/admin/modules/ecg/page.tsx",
    "src/app/(admin)/admin/modules/lab-values/page.tsx",
  ]) {
    const source = readFileSync(join(process.cwd(), route), "utf8");
    assert.match(source, /requireAdmin/);
    assert.match(source, /Not visible to public users|Hidden module previews|ECG Module/);
  }
});

test("hidden ECG and lab values modules stay out of sitemap, hreflang, localized SEO, public nav, and pricing", () => {
  const sitemapAndSeo = readFiles([
    "src/app/sitemap.xml/route.ts",
    "src/lib/seo",
    "reports/localized-seo-audit.json",
    "reports/localized-seo-audit.md",
  ]);
  const navSourceFiles = [...listFiles("src/lib/navigation"), ...listFiles("src/lib/marketing")].filter(
    (absPath) => !/\.(test|spec)\.(tsx?|jsx?|mts?|cts?)$/.test(absPath),
  );
  const navSources = navSourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  const pricingSources = readFiles([
    "src/app/(marketing)/(default)/pricing",
    "src/app/(marketing)/[locale]/pricing",
    "src/lib/pricing",
    "src/lib/conversion/pricing-catalog.ts",
    "src/lib/stripe/pricing-map.ts",
  ]);

  const hiddenRoutes = [
    "/modules/ecg",
    "/modules/ecg/basic",
    "/modules/ecg/advanced",
    "/modules/lab-values",
    ...LAB_VALUES_MODULES.map((module) => module.route),
  ];
  for (const route of hiddenRoutes) {
    const escaped = new RegExp(route.replaceAll("/", "\\/"));
    assert.doesNotMatch(sitemapAndSeo, escaped, route);
    assert.doesNotMatch(navSources, escaped, route);
    assert.doesNotMatch(pricingSources, escaped, route);
  }
  for (const entitlement of [LAB_VALUES_ENTITLEMENTS.BASICS_FREE, LAB_VALUES_ENTITLEMENTS.MASTERY_PAID, ECG_MASTERY_PAID]) {
    assert.doesNotMatch(pricingSources, new RegExp(entitlement), entitlement);
  }
});
