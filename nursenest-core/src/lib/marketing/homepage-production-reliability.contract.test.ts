/**
 * Production reliability contracts for the NurseNest marketing homepage.
 *
 * Guards against:
 * - 504 / error-shell responses replacing the real homepage HTML
 * - Missing title, meta description, html lang, or main landmark
 * - Accidental noindex on the public homepage
 * - Promise.all rejections cascading to a broken homepage render
 * - Bounded timeouts absent from optional data fetches
 * - SiteHeaderServer importing from the wrong module (silent silent failure)
 * - Homepage render path blocking on database or slow filesystem
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..");

function source(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

describe("Homepage production reliability and SEO contracts", () => {
  // ── Root layout metadata ────────────────────────────────────────────────────

  it("root layout exports metadata with title, description, and robots", () => {
    const layout = source("src/app/layout.tsx");
    assert.match(layout, /export const metadata/, "root layout must export metadata");
    assert.match(layout, /title:/, "metadata must include title");
    assert.match(layout, /description:/, "metadata must include description");
    assert.match(layout, /robots:/, "metadata must include robots directive");
  });

  it("root layout sets robots to index/follow in production and noindex otherwise", () => {
    const layout = source("src/app/layout.tsx");
    // Must be environment-gated: production → index,follow; non-production → noindex
    assert.match(
      layout,
      /robots:\s*process\.env\.NODE_ENV\s*===\s*["']production["']\s*\?\s*["']index,\s*follow["']\s*:\s*["']noindex["']/,
      "robots must be production-gated: 'index, follow' in production, 'noindex' otherwise",
    );
  });

  it("root layout html element has lang attribute for accessibility and SEO", () => {
    const layout = source("src/app/layout.tsx");
    assert.match(layout, /lang=["']en["']/, "html element must have lang=\"en\"");
  });

  it("root layout does not accidentally noindex the public homepage via global header rule", () => {
    const nextConfig = source("next.config.mjs");
    // The only X-Robots-Tag rules must be for /fr routes, not for /
    const robotsMatches = [...nextConfig.matchAll(/source:\s*["']([^"']+)["'][\s\S]{0,300}X-Robots-Tag/g)].map(
      (m) => m[1],
    );
    for (const pattern of robotsMatches) {
      assert.ok(
        pattern.startsWith("/fr"),
        `X-Robots-Tag noindex must only apply to /fr/* routes, not "${pattern}"`,
      );
    }
  });

  // ── Homepage page.tsx reliability ──────────────────────────────────────────

  it("homepage page.tsx uses Promise.allSettled for optional data fetches (not Promise.all)", () => {
    const page = source("src/app/(marketing)/(default)/page.tsx");
    assert.match(
      page,
      /Promise\.allSettled/,
      "homepage must use Promise.allSettled so a single failed optional fetch cannot cascade to 504",
    );
    // Promise.all would allow any rejection to fail the render
    assert.doesNotMatch(
      page,
      /await Promise\.all\s*\(\s*\[/,
      "homepage must NOT use Promise.all — individual failures would cascade to a render error",
    );
  });

  it("homepage page.tsx handles rejected allSettled results with fallbacks", () => {
    const page = source("src/app/(marketing)/(default)/page.tsx");
    assert.match(page, /status === ["']fulfilled["']/, "must check allSettled status before using result");
    assert.match(
      page,
      /HomeBlogTeaserSectionShell/,
      "blog section must have a safe fallback shell for failure cases",
    );
  });

  it("homepage page.tsx has a final catch-all failsafe that returns MarketingHomeEmergencyFallback", () => {
    const page = source("src/app/(marketing)/(default)/page.tsx");
    assert.match(
      page,
      /MarketingHomeEmergencyFallback/,
      "homepage must render MarketingHomeEmergencyFallback in catch-all error path",
    );
    assert.match(page, /FINAL HOMEPAGE FAILSAFE/, "failsafe must be logged for debugging");
  });

  it("MarketingHomeEmergencyFallback renders a <main> landmark for accessibility", () => {
    const fallback = source("src/components/marketing/marketing-home-emergency-fallback.tsx");
    assert.match(
      fallback,
      /<main/,
      "emergency fallback must include a <main> landmark so accessibility contracts survive error path",
    );
    assert.match(fallback, /NurseNest/, "emergency fallback must include the brand name");
  });

  // ── HomeRestoredWithDeferredStats reliability ──────────────────────────────

  it("HomeRestoredWithDeferredStats uses Promise.allSettled for homepage data fetch", () => {
    const stats = source(
      "src/components/marketing/home-restored-with-deferred-stats.server.tsx",
    );
    assert.match(
      stats,
      /Promise\.allSettled/,
      "HomeRestoredWithDeferredStats must use Promise.allSettled so carousel/messages/stats rejections do not fail the homepage",
    );
  });

  it("HomeRestoredWithDeferredStats provides degraded fallbacks for each allSettled result", () => {
    const stats = source(
      "src/components/marketing/home-restored-with-deferred-stats.server.tsx",
    );
    assert.match(stats, /getDegradedPublicHomeStatsFallback/, "stats must have a degraded fallback");
    // Carousel slides fallback: empty array
    assert.match(
      stats,
      /slidesResult\.status === ["']fulfilled["']/,
      "carousel slides must check fulfilled status",
    );
    // Server island messages fallback: empty object
    assert.match(
      stats,
      /messagesResult\.status === ["']fulfilled["']/,
      "island messages must check fulfilled status",
    );
  });

  it("loadServerIslandMessagesSafe has a bounded timeout (prevents fs stall causing 504)", () => {
    const stats = source(
      "src/components/marketing/home-restored-with-deferred-stats.server.tsx",
    );
    assert.match(
      stats,
      /TIMEOUT_MS\s*=\s*\d+/,
      "server island message loader must have an explicit timeout constant",
    );
    assert.match(
      stats,
      /Promise\.race\(\[/,
      "server island message loader must use Promise.race with a timeout to bound fs read time",
    );
  });

  it("loadServerIslandMessagesSafe imports from load-marketing-message-shards (correct module)", () => {
    const stats = source(
      "src/components/marketing/home-restored-with-deferred-stats.server.tsx",
    );
    assert.match(
      stats,
      /load-marketing-message-shards/,
      "must import from load-marketing-message-shards (not load-marketing-messages which lacks loadMarketingMessageShards)",
    );
  });

  // ── SiteHeaderServer reliability ───────────────────────────────────────────

  it("SiteHeaderServer nav loader imports from load-marketing-message-shards (correct module)", () => {
    const serverHeader = source("src/components/layout/site-header-server.tsx");
    assert.match(
      serverHeader,
      /load-marketing-message-shards/,
      "SiteHeaderServer must import from load-marketing-message-shards, not load-marketing-messages",
    );
    assert.doesNotMatch(
      serverHeader,
      /from\s+["']@\/lib\/marketing-i18n\/load-marketing-messages["']/,
      "SiteHeaderServer must not import from load-marketing-messages (that module does not export loadMarketingMessageShards)",
    );
  });

  it("SiteHeaderServer nav loader has a bounded timeout (prevents hanging on missing i18n files)", () => {
    const serverHeader = source("src/components/layout/site-header-server.tsx");
    assert.match(serverHeader, /Promise\.race/, "nav loader must use Promise.race with timeout");
    assert.match(serverHeader, /\d+/, "nav loader must have a numeric timeout value");
  });

  // ── Main landmark presence ────────────────────────────────────────────────

  it("default marketing layout renders <main> element wrapping page content", () => {
    const layout = source("src/app/(marketing)/(default)/layout.tsx");
    assert.match(
      layout,
      /<main\s/,
      "default marketing layout must render a <main> element for accessibility landmark",
    );
  });

  it("default marketing layout <main> element wraps the page children (not just footer)", () => {
    const layout = source("src/app/(marketing)/(default)/layout.tsx");
    const mainIdx = layout.indexOf("<main ");
    const childrenIdx = layout.indexOf("{children}", mainIdx);
    const closeMainIdx = layout.indexOf("</main>", mainIdx);
    assert.ok(mainIdx >= 0, "<main> must exist");
    assert.ok(
      childrenIdx > mainIdx && childrenIdx < closeMainIdx,
      "{children} must be inside the <main> element",
    );
  });

  // ── i18n shard file safety ────────────────────────────────────────────────

  it("load-marketing-message-shards returns empty object when shard file is missing", () => {
    const shards = source("src/lib/marketing-i18n/load-marketing-message-shards.ts");
    assert.match(
      shards,
      /existsSync/,
      "shard loader must check if file exists before reading",
    );
    assert.match(
      shards,
      /return\s*\{\}/,
      "shard loader must return empty object when file is missing",
    );
  });

  it("load-marketing-message-shards wraps all reads in try/catch (no uncaught fs errors)", () => {
    const shards = source("src/lib/marketing-i18n/load-marketing-message-shards.ts");
    assert.match(shards, /try\s*\{/, "shard loader must have try/catch error handling");
    assert.match(shards, /catch/, "shard loader must catch all errors");
  });

  // ── Stats/DB cannot block homepage ────────────────────────────────────────

  it("homepage stats loader has shared-cache budget timeout (does not block on DB)", () => {
    const stats = source("src/lib/marketing/public-home-stats.ts");
    assert.match(
      stats,
      /HOME_STATS_HOMEPAGE_SHARED_CACHE_BUDGET_MS\s*=\s*\d+/,
      "stats loader must have a numeric shared-cache budget (ms)",
    );
    assert.match(
      stats,
      /Promise\.race/,
      "stats loader must use Promise.race with timeout to bound response time",
    );
  });

  it("homepage stats loader returns degraded fallback on timeout (not an error)", () => {
    const stats = source("src/lib/marketing/public-home-stats.ts");
    assert.match(
      stats,
      /getDegradedPublicHomeStatsFallback/,
      "stats loader must return a degraded fallback on timeout",
    );
  });

  // ── Prisma not in SiteHeader client bundle ─────────────────────────────────

  it("SiteHeader does not import @prisma/client (Prisma removed from browser bundle)", () => {
    const header = source("src/components/layout/site-header.tsx");
    assert.doesNotMatch(
      header,
      /@prisma\/client/,
      "SiteHeader must not import @prisma/client — Prisma enum must not enter the browser bundle",
    );
  });
});
