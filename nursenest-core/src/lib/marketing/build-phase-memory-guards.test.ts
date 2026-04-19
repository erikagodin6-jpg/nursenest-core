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
  const shardGroups = readAppFile("lib/marketing-i18n/marketing-i18n-shard-groups.ts");

  assert.match(defaultLayout, /process\.env\.NEXT_PHASE === MARKETING_BUILD_PHASE/);
  assert.match(defaultLayout, /MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS/);
  assert.match(defaultLayout, /MarketingMainI18nShards/);
  assert.match(shardGroups, /MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS = \[/);
  assert.match(shardGroups, /"marketing"/);
  assert.match(shardGroups, /"nav"/);
});

test("fixed home and lessons surfaces use page-body shards during production build", () => {
  const homePage = readAppFile("app/(marketing)/(default)/page.tsx");
  const homepageShardHelper = readAppFile("lib/marketing-i18n/homepage-message-shards.ts");
  const lessonsPage = readAppFile("app/(marketing)/(default)/lessons/page.tsx");
  const lessonSections = readAppFile("components/marketing/public-lessons-pathway-sections.tsx");

  assert.match(homePage, /@\/lib\/marketing-i18n\/homepage-message-shards/);
  assert.match(homepageShardHelper, /process\.env\.NEXT_PHASE === MARKETING_BUILD_PHASE/);
  assert.match(homepageShardHelper, /MARKETING_PAGE_BODY_MESSAGE_SHARDS/);

  assert.match(lessonsPage, /process\.env\.NEXT_PHASE === MARKETING_BUILD_PHASE/);
  assert.match(lessonsPage, /MARKETING_PAGE_BODY_MESSAGE_SHARDS/);

  assert.match(lessonSections, /process\.env\.NEXT_PHASE === MARKETING_BUILD_PHASE/);
  assert.match(lessonSections, /MARKETING_PAGE_BODY_MESSAGE_SHARDS/);
});

test("next config keeps webpack memory guards enabled during custom builds", () => {
  const nextConfig = readAppFile("../next.config.ts");

  assert.match(nextConfig, /webpackBuildWorker:\s*true/);
  assert.match(nextConfig, /webpackMemoryOptimizations:\s*true/);
  assert.match(nextConfig, /config\.parallelism = 1/);
});

test("pre-nursing i18n provider avoids top-level JSON imports", () => {
  const source = readAppFile("content/pre-nursing/pre-nursing-i18n.tsx");

  assert.doesNotMatch(source, /import strings from ["']\.\/pre-nursing-strings-en\.json["']/);
  assert.match(source, /require\(["']\.\/pre-nursing-strings-en\.json["']\)/);
});

test("root ux tracking avoids broad marketing path imports", () => {
  const uxTracking = readAppFile("lib/observability/frontend-ux-tracking.ts");

  assert.doesNotMatch(uxTracking, /@\/lib\/i18n\/marketing-path/);
  assert.match(uxTracking, /@\/lib\/i18n\/marketing-locale-prefix/);
});

test("admin blueprint coverage page avoids top-level catalog JSON imports", () => {
  const adminBlueprintPage = readAppFile("app/(admin)/admin/lessons/blueprint-coverage/page.tsx");

  assert.doesNotMatch(adminBlueprintPage, /import catalog from "@\/content\/pathway-lessons\/catalog\.json"/);
  assert.match(adminBlueprintPage, /require\("@\/content\/pathway-lessons\/catalog\.json"\)/);
});

test("pathway lesson catalog sync avoids top-level heavy catalog JSON imports", () => {
  const source = readAppFile("lib/lessons/pathway-lesson-catalog-sync.ts");

  assert.doesNotMatch(source, /import catalog from ["']@\/content\/pathway-lessons\/catalog\.json["']/);
  assert.doesNotMatch(source, /import alliedBundledCatalog from ["']@\/content\/pathway-lessons\/allied-bundled-catalog\.json["']/);
  assert.doesNotMatch(source, /import newGradTransitionCatalog from ["']@\/content\/pathway-lessons\/new-grad-transition-catalog\.json["']/);
});

test("priority content and catalog helper modules avoid top-level JSON imports", () => {
  const sourcePaths = [
    "lib/content/master-topic-map.ts",
    "lib/content-blueprint/rn-nclex-master-map.ts",
    "lib/lessons/pathway-lesson-registry-source.ts",
    "lib/content/topic-map-catalog-dedupe.ts",
    "lib/scalability/build-content-scalability-report.ts",
  ];

  for (const sourcePath of sourcePaths) {
    const source = readAppFile(sourcePath);
    assert.doesNotMatch(source, /import\s+.+\s+from\s+["']@\/(content|data)\/.+\.json["']/);
    assert.match(source, /require\(["']@\/content\/.+\.json["']\)/);
  }
});

test("homepage blog helpers lazy-load the static blog corpus and query layer", () => {
  const staticBlogPosts = readAppFile("lib/blog/static-blog-posts.ts");
  const homeBlogTeaser = readAppFile("lib/blog/home-blog-teaser.ts");
  const latestLinks = readAppFile("components/marketing/marketing-blog-latest-links.tsx");

  assert.doesNotMatch(staticBlogPosts, /import\s+\{\s*STATIC_BLOG_POSTS/);
  assert.match(staticBlogPosts, /require\(["']@\/content\/blog-static-posts["']\)/);

  assert.doesNotMatch(homeBlogTeaser, /import\s+\{\s*getPublishedBlogPostsPage/);
  assert.match(homeBlogTeaser, /await import\(["']@\/lib\/blog\/safe-blog-queries["']\)/);

  assert.doesNotMatch(latestLinks, /import\s+\{\s*getPublishedBlogPostsPage/);
  assert.match(latestLinks, /await import\(["']@\/lib\/blog\/safe-blog-queries["']\)/);
});

test("public lessons hub uses metadata helpers instead of the full lesson loader", () => {
  const lessonSections = readAppFile("components/marketing/public-lessons-pathway-sections.tsx");
  const publicMetadata = readAppFile("lib/lessons/pathway-lesson-public-metadata.ts");

  assert.doesNotMatch(lessonSections, /@\/lib\/lessons\/pathway-lesson-loader/);
  assert.match(lessonSections, /@\/lib\/lessons\/pathway-lesson-public-metadata/);
  assert.match(publicMetadata, /listCatalogPathwayIdsWithLessonsSync/);
  assert.match(publicMetadata, /getCatalogLessonPreviewTitlesForPublicSurface/);
});

test("shared lessons metadata lazy-loads the heavy catalog sync module", () => {
  const lessonSections = readAppFile("components/marketing/public-lessons-pathway-sections.tsx");
  const publicMetadata = readAppFile("lib/lessons/pathway-lesson-public-metadata.ts");

  assert.doesNotMatch(publicMetadata, /from ["']@\/lib\/lessons\/pathway-lesson-catalog-sync["']/);
  assert.match(publicMetadata, /await import\(["']@\/lib\/lessons\/pathway-lesson-catalog-sync["']\)/);
  assert.match(lessonSections, /await getCatalogLessonPreviewTitlesForPublicSurface\(/);
});

test("home and paywall shells lazy-load public home stats instead of importing the full stats module", () => {
  const defaultHomePage = readAppFile("app/(marketing)/(default)/page.tsx");
  const localizedHomePage = readAppFile("app/(marketing)/[locale]/page.tsx");
  const paywallHomeStats = readAppFile("lib/marketing/load-paywall-home-stats-for-shell.ts");

  assert.doesNotMatch(defaultHomePage, /from ["']@\/lib\/marketing\/public-home-stats["']/);
  assert.doesNotMatch(localizedHomePage, /from ["']@\/lib\/marketing\/public-home-stats["']/);
  assert.doesNotMatch(paywallHomeStats, /from ["']@\/lib\/marketing\/public-home-stats["']/);

  assert.match(defaultHomePage, /await import\(["']@\/lib\/marketing\/public-home-stats["']\)/);
  assert.match(localizedHomePage, /await import\(["']@\/lib\/marketing\/public-home-stats["']\)/);
  assert.match(paywallHomeStats, /await import\(["']@\/lib\/marketing\/public-home-stats["']\)/);
});

test("balanced surface split keeps marketing chrome server-only and localized home on cached shard helpers", () => {
  const defaultLayout = readAppFile("app/(marketing)/(default)/layout.tsx");
  const localizedLayout = readAppFile("app/(marketing)/[locale]/layout.tsx");
  const localizedHomePage = readAppFile("app/(marketing)/[locale]/page.tsx");

  assert.match(defaultLayout, /^import .*SiteHeaderServer.*["'];?$/m);
  assert.match(defaultLayout, /^import .*SiteFooterServer.*["'];?$/m);
  assert.match(localizedLayout, /^import .*SiteHeaderServer.*["'];?$/m);
  assert.match(localizedLayout, /^import .*SiteFooterServer.*["'];?$/m);

  assert.doesNotMatch(localizedHomePage, /\bloadMarketingMessages\(/);
  assert.match(localizedHomePage, /^import .*@\/lib\/marketing-i18n\/homepage-message-shards["'];?$/m);
});

test("homepage defers the anonymous exam selector gate behind a tiny lazy wrapper", () => {
  const defaultHomePage = readAppFile("app/(marketing)/(default)/page.tsx");
  const deferredGate = readAppFile("components/onboarding/exam-selector-gate-lazy.tsx");

  assert.doesNotMatch(defaultHomePage, /from ["']@\/components\/onboarding\/exam-selector-gate["']/);
  assert.match(defaultHomePage, /@\/components\/onboarding\/exam-selector-gate-lazy/);

  assert.match(deferredGate, /dynamic\(/);
  assert.match(deferredGate, /@\/components\/onboarding\/exam-selector-gate/);
  assert.match(deferredGate, /ssr:\s*false/);
});

test("learner shell defers optional study-next and tutor chrome until the request needs them", () => {
  const learnerShellLayout = readAppFile("app/(student)/app/(learner)/layout.tsx");

  assert.doesNotMatch(learnerShellLayout, /from ["']@\/components\/student\/learner-study-next-block["']/);
  assert.doesNotMatch(learnerShellLayout, /from ["']@\/components\/learner-tutor["']/);
  assert.match(learnerShellLayout, /await import\(["']@\/components\/student\/learner-study-next-block["']\)/);
  assert.match(learnerShellLayout, /await import\(["']@\/components\/learner-tutor["']\)/);
});

test("ops lesson helpers use loader config without importing the full loader", () => {
  const sourcePaths = [
    "lib/lessons/pathway-lesson-registry-source.ts",
    "lib/scalability/build-content-scalability-report.ts",
    "lib/lessons/pathway-lesson-translation-diagnostics.ts",
  ];

  for (const sourcePath of sourcePaths) {
    const source = readAppFile(sourcePath);
    assert.doesNotMatch(source, /@\/lib\/lessons\/pathway-lesson-loader["']/);
    assert.match(source, /@\/lib\/lessons\/pathway-lesson-loader-config["']/);
  }
});

test("remaining pre-nursing and interactive content modules avoid top-level JSON imports", () => {
  const sourcePaths = [
    "components/tools/calculators/transfusion-safety-tool.tsx",
    "components/pre-nursing/pre-nursing-landing-client.tsx",
    "components/pre-nursing/pre-nursing-milestone-strip.tsx",
    "components/pre-nursing/pre-nursing-module-engagement.tsx",
    "components/marketing/case-studies-page-client.tsx",
    "app/(marketing)/[locale]/pre-nursing/lessons/[slug]/page.tsx",
    "app/(marketing)/(default)/pre-nursing/lessons/page.tsx",
    "app/(marketing)/(default)/pre-nursing/lessons/[slug]/page.tsx",
    "app/(marketing)/(default)/pre-nursing/practice/[slug]/page.tsx",
  ];

  for (const sourcePath of sourcePaths) {
    const source = readAppFile(sourcePath);
    assert.doesNotMatch(source, /import\s+.+\s+from\s+["']@\/(content|data)\/.+\.json["']/);
    assert.match(source, /require\(["']@\/content\/.+\.json["']\)/);
  }
});

test("server-facing readiness and inventory helpers avoid top-level JSON imports", () => {
  const sourcePaths = [
    "lib/navigation/country-exam-readiness-snapshot.ts",
    "lib/education-images/inventory.ts",
  ];

  for (const sourcePath of sourcePaths) {
    const source = readAppFile(sourcePath);
    assert.doesNotMatch(source, /import\s+.+\s+from\s+["']@\/(config|content|data)\/.+\.json["']/);
    assert.match(source, /require\(["']@\/config\/.+\.json["']\)/);
  }
});
