import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");

function readAppFile(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("marketing static generation policy", () => {
  it("keeps default exams route family dynamic at the layout level", () => {
    const examsLayout = readAppFile("app/(marketing)/(default)/exams/layout.tsx");
    assert.match(examsLayout, /export const dynamic = "force-dynamic"/);
  });

  it("uses a pass-through default blog layout (pages own dynamic / SEO policy)", () => {
    const blogLayout = readAppFile("app/(marketing)/(default)/blog/layout.tsx");
    assert.match(blogLayout, /MarketingBlogLayout/);
    assert.match(blogLayout, /children/);
  });

  it("uses build-phase DB skipping on the default public lessons hub", () => {
    const lessonsPage = readAppFile("app/(marketing)/(default)/lessons/page.tsx");

    assert.match(
      lessonsPage,
      /process\.env\.NEXT_PHASE === (?:MARKETING_BUILD_PHASE|"phase-production-build")/,
      "lessons page should gate optional DB reads on the production build phase",
    );
  });

  it("uses shard-based marketing i18n loaders on fixed lessons surfaces", () => {
    const lessonsPage = readAppFile("app/(marketing)/(default)/lessons/page.tsx");
    const lessonSections = readAppFile("components/marketing/public-lessons-pathway-sections.tsx");

    assert.match(lessonsPage, /loadMarketingMessageShards/, "lessons page should use shard loader");
    assert.doesNotMatch(lessonsPage, /loadMarketingMessages/, "lessons page should not use merged bundle loader");

    assert.match(lessonSections, /loadMarketingMessageShards/, "lesson sections should use shard loader");
    assert.doesNotMatch(
      lessonSections,
      /loadMarketingMessages/,
      "lesson sections should not use merged bundle loader",
    );
  });

  it("keeps the default tools hub dynamic", () => {
    const toolsPage = readAppFile("app/(marketing)/(default)/tools/page.tsx");
    assert.match(toolsPage, /export const dynamic = "force-dynamic"/);
  });

  it("keeps low-value default brochure, auth, and legal routes out of build-time static generation", () => {
    const dynamicPages = [
      "app/(marketing)/(default)/about/page.tsx",
      "app/(marketing)/(default)/contact/page.tsx",
      "app/(marketing)/(default)/faq/page.tsx",
      "app/(marketing)/(default)/how-it-works/page.tsx",
      "app/(marketing)/(default)/for-institutions/page.tsx",
      "app/(marketing)/(default)/login/page.tsx",
      "app/(marketing)/(default)/signup/page.tsx",
      "app/(marketing)/(default)/forgot-password/page.tsx",
      "app/(marketing)/(default)/reset-password/page.tsx",
      "app/(marketing)/(default)/acceptable-use/page.tsx",
      "app/(marketing)/(default)/content-review-policy/page.tsx",
      "app/(marketing)/(default)/editorial-policy/page.tsx",
      "app/(marketing)/(default)/privacy/page.tsx",
      "app/(marketing)/(default)/refund-policy/page.tsx",
      "app/(marketing)/(default)/terms/page.tsx",
      "app/(marketing)/(default)/disclaimer/page.tsx",
    ];

    for (const page of dynamicPages) {
      assert.match(readAppFile(page), /export const dynamic = "force-dynamic"/, page);
    }
  });

  it("uses metadata-slice loaders on default auth entry routes", () => {
    const authPages = [
      "app/(marketing)/(default)/login/page.tsx",
      "app/(marketing)/(default)/signup/page.tsx",
      "app/(marketing)/(default)/forgot-password/page.tsx",
      "app/(marketing)/(default)/reset-password/page.tsx",
      "app/(marketing)/(default)/for-institutions/page.tsx",
    ];

    for (const page of authPages) {
      const src = readAppFile(page);
      assert.match(src, /loadMarketingMetadataMessages/, page);
      assert.doesNotMatch(src, /loadMarketingMessages/, page);
    }
  });

  it("avoids merged marketing bundle loaders on shard-tightened marketing hotspots", () => {
    const pages = [
      "app/(marketing)/(default)/pricing/page.tsx",
      "app/(marketing)/[locale]/pricing/page.tsx",
      "app/(marketing)/(default)/question-bank/page.tsx",
      "app/(marketing)/[locale]/question-bank/page.tsx",
      "app/(marketing)/(default)/exams/india/page.tsx",
      "app/(marketing)/[locale]/exams/india/page.tsx",
    ];
    const shardLoader = /loadMarketingLayoutShardsOverlay|loadMarketingMetadataMessages|loadMarketingMessageShards/;

    for (const page of pages) {
      const src = readAppFile(page);
      assert.doesNotMatch(src, /loadMarketingMessages/, page);
      assert.match(src, shardLoader, page);
    }
  });

  it("does not use deprecated next eslint build config", () => {
    const nextConfig = readFileSync(join(appRoot, "..", "next.config.mjs"), "utf8");
    assert.doesNotMatch(nextConfig, /eslint:\s*\{/);
    assert.match(nextConfig, /cpus:\s*1/);
    assert.match(nextConfig, /workerThreads:\s*false/);
    assert.match(nextConfig, /webpackBuildWorker:\s*false/);
    assert.match(nextConfig, /staticGenerationMaxConcurrency:\s*1/);
    assert.match(nextConfig, /const\s+webpackParallelism\s*=\s*1/);
    assert.match(nextConfig, /config\.parallelism\s*=\s*webpackParallelism/);
  });
});
