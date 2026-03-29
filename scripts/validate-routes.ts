import * as fs from "fs";
import * as path from "path";

let errors = 0;
let warnings = 0;
let info = 0;

function error(msg: string) {
  console.error(`  ❌ ERROR: ${msg}`);
  errors++;
}

function warn(msg: string) {
  console.warn(`  ⚠️  WARN: ${msg}`);
  warnings++;
}

function ok(msg: string) {
  console.log(`  ✅ ${msg}`);
  info++;
}

function extractRoutePaths(filePath: string): string[] {
  if (!fs.existsSync(filePath)) {
    warn(`Route file not found: ${filePath}`);
    return [];
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
  const routes: string[] = [];
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    routes.push(match[1]);
  }
  return routes;
}

function extractStaticPagePaths(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const pageRegex = /^\s+"(\/[^"]*)":\s*\{/gm;
  const paths: string[] = [];
  let match;
  while ((match = pageRegex.exec(content)) !== null) {
    paths.push(match[1]);
  }
  return paths;
}

function extractSitemapStaticPaths(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");

  const arrayMatch = content.match(/const staticRoutes[^=]*=\s*\[([\s\S]*?)\];/);
  if (!arrayMatch) {
    warn(`Could not locate staticRoutes array in ${filePath}`);
    return [];
  }
  const arrayContent = arrayMatch[1];

  const pathRegex = /path:\s*["']([^"']+)["']/g;
  const paths: string[] = [];
  let match;
  while ((match = pathRegex.exec(arrayContent)) !== null) {
    paths.push(match[1]);
  }
  return paths;
}

function isAdminOrHiddenRoute(route: string): boolean {
  const adminPrefixes = [
    "/admin", "/content-editor", "/login", "/register", "/profile",
    "/dashboard", "/upgrade", "/subscription", "/checkout", "/account",
    "/trial/", "/diagnostic-assessment", "/feedback", "/settings",
    "/notes", "/invite", "/reset-password", "/verify-email",
    "/reports", "/qbank", "/instructor",
  ];
  for (const prefix of adminPrefixes) {
    if (route === prefix || route.startsWith(prefix + "/")) return true;
  }
  if (route.includes(":") && route.includes("/report")) return true;
  return false;
}

function isDynamicRoute(route: string): boolean {
  return route.includes(":");
}

const NOINDEX_PATHS = new Set([
  "/admin", "/content-editor", "/login", "/register", "/profile",
  "/reports", "/dashboard", "/subscription/success", "/subscription/cancel",
  "/upgrade", "/feedback", "/diagnostic-assessment", "/probability-simulator",
  "/settings", "/notes", "/invite", "/reset-password", "/verify-email",
]);

const dynamicPatternPrefixes = [
  "/lessons/", "/clinical-clarity/", "/learn/", "/blog/", "/shop/",
  "/glossary/", "/compare/", "/conditions/", "/medications/", "/lab-values/",
  "/topics/", "/how-to-become-", "/applynest/careers/", "/new-grad/",
  "/rpn/questions/", "/rn/questions/", "/np/questions/",
  "/medical-imaging/", "/specialties/", "/certifications/", "/study-pathways/",
  "/newgrad/", "/career-development/", "/encycloped",
];

console.log("=== NurseNest Route Validation Tool ===\n");

const appTsxPath = path.resolve(process.cwd(), "client/src/App.tsx");
const alliedRoutesPath = path.resolve(process.cwd(), "client/src/allied/allied-routes.tsx");
const seoMetaPath = path.resolve(process.cwd(), "server/seo-meta.ts");
const mainSitemapPath = path.resolve(process.cwd(), "server/sitemap/main-site.ts");
const alliedSitemapPath = path.resolve(process.cwd(), "server/sitemap/allied-site.ts");
const newgradSitemapPath = path.resolve(process.cwd(), "server/sitemap/newgrad-site.ts");

const mainRoutes = extractRoutePaths(appTsxPath);
const alliedRoutes = extractRoutePaths(alliedRoutesPath);
const seoMetaPaths = extractStaticPagePaths(seoMetaPath);
const sitemapPaths = extractSitemapStaticPaths(mainSitemapPath);
const alliedSitemapPaths = fs.existsSync(alliedSitemapPath) ? extractSitemapStaticPaths(alliedSitemapPath) : [];
const newgradSitemapPaths = fs.existsSync(newgradSitemapPath) ? extractSitemapStaticPaths(newgradSitemapPath) : [];

console.log(`Main site routes (App.tsx): ${mainRoutes.length}`);
console.log(`Allied routes: ${alliedRoutes.length}`);
console.log(`SEO meta entries: ${seoMetaPaths.length}`);
console.log(`Main sitemap static paths: ${sitemapPaths.length}`);
console.log(`Allied sitemap static paths: ${alliedSitemapPaths.length}`);
console.log(`NewGrad sitemap static paths: ${newgradSitemapPaths.length}`);

console.log("\n--- 1. Main Sitemap URLs vs Registered Routes ---");
const staticSitemapPaths = sitemapPaths.filter(p => !isDynamicRoute(p));
const mainStaticRoutes = new Set(mainRoutes.filter(r => !isDynamicRoute(r)));

let sitemapOrphanCount = 0;
for (const sp of staticSitemapPaths) {
  if (isAdminOrHiddenRoute(sp)) continue;
  if (mainStaticRoutes.has(sp)) continue;

  const anyDynamicMatch = mainRoutes.some(r => {
    if (!r.includes(":")) return false;
    const regex = new RegExp("^" + r.replace(/:[^/]+/g, "[^/]+") + "$");
    return regex.test(sp);
  });
  if (!anyDynamicMatch) {
    warn(`Sitemap path "${sp}" has no matching registered route`);
    sitemapOrphanCount++;
  }
}
if (sitemapOrphanCount === 0) ok("All main sitemap static paths match registered routes");

console.log("\n--- 2. Allied Sitemap URLs vs Allied Routes ---");
const alliedStaticRoutes = new Set(alliedRoutes.filter(r => !isDynamicRoute(r)));
let alliedOrphanCount = 0;
for (const sp of alliedSitemapPaths.filter(p => !isDynamicRoute(p))) {
  if (isAdminOrHiddenRoute(sp)) continue;
  if (alliedStaticRoutes.has(sp)) continue;

  const anyDynamicMatch = alliedRoutes.some(r => {
    if (!r.includes(":")) return false;
    const regex = new RegExp("^" + r.replace(/:[^/]+/g, "[^/]+") + "$");
    return regex.test(sp);
  });
  if (!anyDynamicMatch) {
    warn(`Allied sitemap path "${sp}" has no matching allied route`);
    alliedOrphanCount++;
  }
}
if (alliedOrphanCount === 0) ok("All allied sitemap static paths match allied routes");

console.log("\n--- 3. Public Routes Missing SEO Meta ---");
const seoMetaSet = new Set(seoMetaPaths);
const publicStaticRoutes = mainRoutes.filter(r => !isDynamicRoute(r) && !isAdminOrHiddenRoute(r));
let missingMetaCount = 0;

for (const route of publicStaticRoutes) {
  if (NOINDEX_PATHS.has(route)) continue;
  if (route.startsWith("/demo")) continue;
  if (route.startsWith("/seo-")) continue;
  if (route === "/signup" || route === "/register") continue;
  const isHandledByDynamic = dynamicPatternPrefixes.some(p => route.startsWith(p));
  if (isHandledByDynamic) continue;

  if (!seoMetaSet.has(route)) {
    warn(`Public route "${route}" has no explicit SEO meta entry (will use fallback)`);
    missingMetaCount++;
  }
}
if (missingMetaCount === 0) ok("All major public routes have SEO meta entries");

console.log("\n--- 4. Duplicate Title Detection ---");
const seoEntries = extractStaticPagesFromSeoMeta(seoMetaPath);
const titleMap = new Map<string, string[]>();
for (const [pagePath, data] of Object.entries(seoEntries)) {
  const existing = titleMap.get(data.title) || [];
  existing.push(pagePath);
  titleMap.set(data.title, existing);
}
let dupeCount = 0;
for (const [title, paths] of titleMap) {
  if (paths.length > 1) {
    error(`Duplicate title "${title.substring(0, 60)}..." used on: ${paths.join(", ")}`);
    dupeCount++;
  }
}
if (dupeCount === 0) ok("No duplicate titles found");

console.log("\n--- 5. Duplicate Description Detection ---");
const descMap = new Map<string, string[]>();
for (const [pagePath, data] of Object.entries(seoEntries)) {
  const existing = descMap.get(data.description) || [];
  existing.push(pagePath);
  descMap.set(data.description, existing);
}
let dupeDescCount = 0;
for (const [desc, paths] of descMap) {
  if (paths.length > 1) {
    error(`Duplicate description "${desc.substring(0, 60)}..." used on: ${paths.join(", ")}`);
    dupeDescCount++;
  }
}
if (dupeDescCount === 0) ok("No duplicate descriptions found");

console.log("\n--- 6. Admin/Hidden Routes NOT in Sitemap ---");
const allSitemapPaths = [...sitemapPaths, ...alliedSitemapPaths, ...newgradSitemapPaths];
const adminInSitemap: string[] = [];
for (const sp of allSitemapPaths) {
  if (isAdminOrHiddenRoute(sp)) {
    adminInSitemap.push(sp);
  }
}
if (adminInSitemap.length > 0) {
  for (const p of adminInSitemap) {
    error(`Admin/hidden route in sitemap: ${p}`);
  }
} else {
  ok("No admin/hidden routes found in any sitemap");
}

console.log("\n--- 7. Content Structure Completeness ---");
const nursingTiers = ["rpn", "rn", "np"];
const expectedTierPages = ["questions", "test-bank"];
for (const tier of nursingTiers) {
  for (const page of expectedTierPages) {
    const route = `/${tier}/${page}`;
    if (!mainStaticRoutes.has(route) && !mainRoutes.some(r => r === route)) {
      warn(`Missing nursing tier route: ${route}`);
    }
  }
}

const expectedMainSections = [
  "/lessons", "/flashcards", "/mock-exams", "/question-bank",
  "/clinical-clarity", "/glossary", "/topics",
];
for (const section of expectedMainSections) {
  if (!mainStaticRoutes.has(section)) {
    warn(`Missing expected main section route: ${section}`);
  }
  if (!seoMetaSet.has(section)) {
    warn(`Missing SEO meta for main section: ${section}`);
  }
}
ok("Content structure check complete");

console.log("\n--- 8. Sitemap Includes Key Public Pages ---");
const sitemapPathSet = new Set(sitemapPaths);
const criticalPages = [
  "/", "/lessons", "/flashcards", "/pricing", "/mock-exams",
  "/clinical-clarity", "/blog", "/question-bank", "/glossary",
  "/exam-prep", "/new-graduate-support", "/healthcare-careers",
  "/nursing", "/nursing-specialties", "/nursing-certifications",
  "/study-pathways", "/topics", "/medical-imaging",
];
let missingSitemapCount = 0;
for (const page of criticalPages) {
  if (!sitemapPathSet.has(page)) {
    warn(`Critical page "${page}" may be missing from sitemap static routes`);
    missingSitemapCount++;
  }
}
if (missingSitemapCount === 0) ok("All critical pages present in sitemap");

console.log("\n--- 9. URL Normalization Check ---");
let normIssues = 0;
for (const route of [...mainRoutes, ...alliedRoutes]) {
  if (route.includes("/index.html")) {
    error(`Route contains /index.html: ${route}`);
    normIssues++;
  }
  if (route !== "/" && route.endsWith("/")) {
    error(`Route has trailing slash: ${route}`);
    normIssues++;
  }
  if (route !== route.toLowerCase() && !route.includes(":")) {
    warn(`Route has uppercase characters: ${route}`);
    normIssues++;
  }
}
if (normIssues === 0) ok("All routes properly normalized");

console.log("\n=== Summary ===");
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);
console.log(`Checks passed: ${info}`);

if (errors > 0) {
  console.error("\n🚨 CRITICAL: Fix errors before deploying!\n");
  process.exit(1);
} else if (warnings > 0) {
  console.log("\n⚠️  Deploy with caution — review warnings above.\n");
  process.exit(0);
} else {
  console.log("\n🎉 All route validation checks passed!\n");
  process.exit(0);
}

function extractStaticPagesFromSeoMeta(filePath: string): Record<string, { title: string; description: string }> {
  const content = fs.readFileSync(filePath, "utf-8");
  const result: Record<string, { title: string; description: string }> = {};

  const blockRegex = /^\s+"(\/[^"]*)":\s*\{\s*\n\s+title:\s*"([^"]+)",\s*\n\s+description:\s*"([^"]+)"/gm;
  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    result[match[1]] = { title: match[2], description: match[3] };
  }
  return result;
}
