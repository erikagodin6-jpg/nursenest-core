/**
 * Standalone runtime i18n asset contracts.
 *
 * Verifies that:
 * - public/i18n/en/ exists and contains required shard files
 * - Critical locale shards (en, fr) are present and non-empty
 * - The shard loader handles missing directories without throwing
 * - The shard loader resolves multi-root candidates for standalone environments
 * - The ensure-standalone-public.mjs script exists and references correct asset dirs
 * - The build:deploy:postbuild script includes the public asset copy step
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const PKG = path.resolve(__dirname, "..", "..", "..");

function source(rel: string): string {
  return fs.readFileSync(path.join(PKG, rel), "utf8");
}

function i18nDir(locale: string): string {
  return path.join(PKG, "public", "i18n", locale);
}

describe("Standalone i18n runtime contracts", () => {
  // ── Shard file presence ────────────────────────────────────────────────────

  it("public/i18n/en/ exists with required shard files", () => {
    const enDir = i18nDir("en");
    assert.ok(fs.existsSync(enDir), `public/i18n/en/ must exist at ${enDir}`);
    const shards = fs.readdirSync(enDir).filter((n) => n.endsWith(".json"));
    assert.ok(shards.length >= 5, `expected at least 5 i18n shards in en, got ${shards.length}`);
  });

  it("public/i18n/en/ contains the critical nav, brand, pages, and marketing shards", () => {
    const enDir = i18nDir("en");
    for (const shard of ["nav", "brand", "pages", "marketing"]) {
      const filePath = path.join(enDir, `${shard}.json`);
      assert.ok(
        fs.existsSync(filePath),
        `public/i18n/en/${shard}.json must exist — required by homepage server islands and header`,
      );
      const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
      assert.ok(
        typeof content === "object" && !Array.isArray(content),
        `public/i18n/en/${shard}.json must be a flat key-value object`,
      );
      assert.ok(
        Object.keys(content).length > 0,
        `public/i18n/en/${shard}.json must be non-empty`,
      );
    }
  });

  it("public/i18n/fr/ exists with at least one shard file (French locale)", () => {
    const frDir = i18nDir("fr");
    assert.ok(fs.existsSync(frDir), `public/i18n/fr/ must exist for French locale support`);
    const shards = fs.readdirSync(frDir).filter((n) => n.endsWith(".json"));
    assert.ok(shards.length >= 1, `expected at least 1 i18n shard in fr, got ${shards.length}`);
  });

  it("public/i18n/en/pages.json contains homepage premium copy keys", () => {
    const pagesPath = path.join(i18nDir("en"), "pages.json");
    const content = JSON.parse(fs.readFileSync(pagesPath, "utf8")) as Record<string, string>;
    // At least one premium homepage key must exist
    const premiumKeys = Object.keys(content).filter((k) => k.startsWith("pages.home.premium."));
    assert.ok(
      premiumKeys.length > 0,
      "pages.json must contain pages.home.premium.* keys for server island rendering",
    );
  });

  // ── Shard loader multi-root robustness ────────────────────────────────────

  it("load-marketing-message-shards uses single bounded process.cwd() path (not import.meta.url)", () => {
    const src = source("src/lib/marketing-i18n/load-marketing-message-shards.ts");
    // Must use process.cwd() — NFT-opaque at static analysis time
    assert.match(src, /process\.cwd\(\)/, "must use process.cwd() for the i18n directory root");
    // Must use resolveI18nDir() abstraction for cached lookup
    assert.match(src, /resolveI18nDir/, "must use resolveI18nDir() to select the correct root");
    // Must NOT use import.meta.url — that lets NFT statically resolve __dirname equivalents
    assert.doesNotMatch(src, /import\.meta\.url/, "must not use import.meta.url — triggers NFT trace explosion");
    // Must NOT use fileURLToPath — paired with import.meta.url for __dirname resolution
    assert.doesNotMatch(src, /fileURLToPath/, "must not use fileURLToPath — paired with import.meta.url");
  });

  it("load-marketing-message-shards emits diagnostic log when i18n dir not found (not throws)", () => {
    const src = source("src/lib/marketing-i18n/load-marketing-message-shards.ts");
    assert.match(
      src,
      /process\.stderr\.write/,
      "must emit a diagnostic stderr message when no i18n dir is found",
    );
    assert.match(
      src,
      /Shard loading will use English defaults/,
      "diagnostic must explain the fallback behavior",
    );
    // Must NOT throw — the caller wraps with try/catch but we also verify the loader itself doesn't throw
    assert.doesNotMatch(
      src,
      /throw new Error.*public\/i18n/,
      "shard loader must not throw when i18n files are missing — returns empty object instead",
    );
  });

  it("load-marketing-message-shards resolves only once (cached, not per-request)", () => {
    const src = source("src/lib/marketing-i18n/load-marketing-message-shards.ts");
    assert.match(
      src,
      /_resolvedI18nDir !== undefined/,
      "must cache the resolved i18n dir to avoid repeated existsSync on every request",
    );
  });

  // ── ensure-standalone-public.mjs ──────────────────────────────────────────

  it("ensure-standalone-public.mjs exists and targets public/i18n", () => {
    const scriptPath = path.join(PKG, "scripts", "ensure-standalone-public.mjs");
    assert.ok(
      fs.existsSync(scriptPath),
      "scripts/ensure-standalone-public.mjs must exist — copies i18n assets into standalone output",
    );
    const src = fs.readFileSync(scriptPath, "utf8");
    assert.match(src, /["']i18n["']/, "ensure-standalone-public must target the i18n directory");
    assert.match(
      src,
      /PUBLIC_ASSET_DIRS/,
      "must define PUBLIC_ASSET_DIRS constant listing assets to copy",
    );
  });

  it("build:deploy:postbuild script includes ensure-standalone-public.mjs step", () => {
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(PKG, "package.json"), "utf8"),
    ) as { scripts?: Record<string, string> };
    const script = pkgJson.scripts?.["build:deploy:postbuild"] ?? "";
    assert.match(
      script,
      /ensure-standalone-public\.mjs/,
      "build:deploy:postbuild must include ensure-standalone-public.mjs to copy i18n into standalone",
    );
    // Must run after ensure-standalone-static (static assets first, then public assets)
    const staticIdx = script.indexOf("ensure-standalone-static.mjs");
    const publicIdx = script.indexOf("ensure-standalone-public.mjs");
    assert.ok(
      staticIdx >= 0 && publicIdx > staticIdx,
      "ensure-standalone-public.mjs must run AFTER ensure-standalone-static.mjs",
    );
  });

  // ── verify-standalone-artifact.mjs ────────────────────────────────────────

  it("verify-standalone-artifact.mjs exports verifyPublicI18nArtifact function", () => {
    const src = fs.readFileSync(
      path.join(PKG, "scripts", "verify-standalone-artifact.mjs"),
      "utf8",
    );
    assert.match(
      src,
      /export function verifyPublicI18nArtifact/,
      "verify-standalone-artifact must export verifyPublicI18nArtifact",
    );
    // Must check that the package-root i18n exists (hard fail)
    assert.match(src, /public\/i18n\/en/, "must verify English i18n shards specifically");
  });

  it("verify-standalone-artifact.mjs calls verifyPublicI18nArtifact in its main block", () => {
    const src = fs.readFileSync(
      path.join(PKG, "scripts", "verify-standalone-artifact.mjs"),
      "utf8",
    );
    // Must be called in the isDirectRun block so it runs during production build verification
    assert.match(
      src,
      /verifyPublicI18nArtifact\(\)/,
      "verifyPublicI18nArtifact() must be called in the script's main execution block",
    );
  });

  // ── Homepage server island loaders ────────────────────────────────────────

  it("loadServerIslandMessagesSafe imports from load-marketing-message-shards (correct module)", () => {
    const src = source(
      "src/components/marketing/home-restored-with-deferred-stats.server.tsx",
    );
    assert.match(
      src,
      /load-marketing-message-shards/,
      "home-restored-with-deferred-stats must import from load-marketing-message-shards",
    );
    assert.doesNotMatch(
      src,
      /from\s+["']@\/lib\/marketing-i18n\/load-marketing-messages["']/,
      "must NOT import from load-marketing-messages (wrong module — does not export loadMarketingMessageShards)",
    );
  });

  it("SiteHeaderServer imports from load-marketing-message-shards (correct module)", () => {
    const src = source("src/components/layout/site-header-server.tsx");
    assert.match(src, /load-marketing-message-shards/, "SiteHeaderServer must use the correct module");
  });

  it("homepage data fetches use Promise.allSettled (single failed fetch cannot cascade)", () => {
    const page = source("src/app/(marketing)/(default)/page.tsx");
    assert.match(page, /Promise\.allSettled/, "page.tsx must use Promise.allSettled");
    const stats = source(
      "src/components/marketing/home-restored-with-deferred-stats.server.tsx",
    );
    assert.match(
      stats,
      /Promise\.allSettled/,
      "HomeRestoredWithDeferredStats must use Promise.allSettled",
    );
  });
});
