import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");

function readAppFile(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

test("default blog and lessons routes opt out of build-time static work", () => {
  const blogLayout = readAppFile("app/(marketing)/(default)/blog/layout.tsx");
  const lessonsPage = readAppFile("app/(marketing)/(default)/lessons/page.tsx");

  assert.match(blogLayout, /export const dynamic = "force-dynamic"/);
  assert.match(lessonsPage, /export const dynamic = "force-dynamic"/);
});

test("marketing default layout uses chrome-only shards and layers main page shards during production build", () => {
  const defaultLayout = readAppFile("app/(marketing)/(default)/layout.tsx");

  assert.match(defaultLayout, /process\.env\.NEXT_PHASE === MARKETING_BUILD_PHASE/);
  assert.match(defaultLayout, /MARKETING_CHROME_MESSAGE_SHARDS/);
  assert.match(defaultLayout, /MarketingMainI18nShards/);
});

test("fixed home and lessons surfaces use page-body shards during production build", () => {
  const homePage = readAppFile("app/(marketing)/(default)/page.tsx");
  const lessonsPage = readAppFile("app/(marketing)/(default)/lessons/page.tsx");
  const lessonSections = readAppFile("components/marketing/public-lessons-pathway-sections.tsx");

  assert.match(homePage, /process\.env\.NEXT_PHASE === MARKETING_BUILD_PHASE/);
  assert.match(homePage, /MARKETING_PAGE_BODY_MESSAGE_SHARDS/);

  assert.match(lessonsPage, /process\.env\.NEXT_PHASE === MARKETING_BUILD_PHASE/);
  assert.match(lessonsPage, /MARKETING_PAGE_BODY_MESSAGE_SHARDS/);

  assert.match(lessonSections, /process\.env\.NEXT_PHASE === MARKETING_BUILD_PHASE/);
  assert.match(lessonSections, /MARKETING_PAGE_BODY_MESSAGE_SHARDS/);
});

test("pathway lesson catalog sync avoids top-level heavy catalog JSON imports", () => {
  const source = readAppFile("lib/lessons/pathway-lesson-catalog-sync.ts");

  assert.doesNotMatch(source, /import catalog from ["']@\/content\/pathway-lessons\/catalog\.json["']/);
  assert.doesNotMatch(source, /import alliedBundledCatalog from ["']@\/content\/pathway-lessons\/allied-bundled-catalog\.json["']/);
  assert.doesNotMatch(source, /import newGradTransitionCatalog from ["']@\/content\/pathway-lessons\/new-grad-transition-catalog\.json["']/);
});
