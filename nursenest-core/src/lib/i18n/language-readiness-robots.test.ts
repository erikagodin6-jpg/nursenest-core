import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  getLocaleSeoTier,
  isLocaleRobotsPathDisallowed,
  SEO_BLOCKED_LOCALES,
} from "@/lib/i18n/language-readiness";
import { MARKETING_LANGUAGES } from "@/lib/i18n/marketing-languages";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Locale readiness is enforced via page-level `noindex,follow` metadata — NEVER via robots.txt
 * Disallow. Blocking locale paths in robots.txt produced "Indexed, though blocked by robots.txt"
 * warnings in Google Search Console because Googlebot could not fetch the pages to read
 * the `noindex` tag.
 *
 * See `docs/reports/locale-seo-leakage-remediation.md`.
 */
describe("isLocaleRobotsPathDisallowed (never blocks marketing locales)", () => {
  it("never disallows default English", () => {
    assert.equal(isLocaleRobotsPathDisallowed("en"), false);
  });

  it("never disallows full-tier locales", () => {
    assert.equal(isLocaleRobotsPathDisallowed("fr"), false);
    assert.equal(isLocaleRobotsPathDisallowed("es"), false);
  });

  it("never disallows partial-tier locales (Tagalog, Hindi)", () => {
    assert.equal(isLocaleRobotsPathDisallowed("tl"), false);
    assert.equal(isLocaleRobotsPathDisallowed("hi"), false);
  });

  it("never disallows incomplete-tier locales", () => {
    assert.equal(isLocaleRobotsPathDisallowed("ta"), false);
    assert.equal(isLocaleRobotsPathDisallowed("de"), false);
    assert.equal(isLocaleRobotsPathDisallowed("zh"), false);
    assert.equal(isLocaleRobotsPathDisallowed("zh-tw"), false);
    assert.equal(isLocaleRobotsPathDisallowed("pa"), false);
    assert.equal(isLocaleRobotsPathDisallowed("ht"), false);
    assert.equal(isLocaleRobotsPathDisallowed("it"), false);
    assert.equal(isLocaleRobotsPathDisallowed("tr"), false);
    assert.equal(isLocaleRobotsPathDisallowed("ko"), false);
    assert.equal(isLocaleRobotsPathDisallowed("ur"), false);
  });

  it("never disallows any explicitly blocked audit locale", () => {
    for (const locale of SEO_BLOCKED_LOCALES) {
      assert.equal(isLocaleRobotsPathDisallowed(locale), false, locale);
    }
  });

  it("never disallows any registered marketing locale", () => {
    for (const lang of MARKETING_LANGUAGES) {
      assert.equal(isLocaleRobotsPathDisallowed(lang.code), false, lang.code);
    }
  });
});

describe("robots.txt body (no per-locale Disallow lines)", () => {
  const robotsSrc = readFileSync(join(HERE, "../../app/robots.txt/route.ts"), "utf8");

  it("declares the canonical Disallow set for system surfaces", () => {
    for (const line of [
      "Disallow: /app/",
      "Disallow: /admin/",
      "Disallow: /internal/",
      "Disallow: /api/",
      "Disallow: /seo/",
    ]) {
      assert.ok(robotsSrc.includes(line), `missing canonical disallow line: ${line}`);
    }
  });

  it("does NOT emit Disallow lines for any marketing locale", () => {
    for (const lang of MARKETING_LANGUAGES) {
      const disallow = `Disallow: /${lang.code}/`;
      assert.equal(
        robotsSrc.includes(disallow),
        false,
        `robots.txt must not Disallow marketing locale path ${disallow}`,
      );
    }
  });

  it("does not iterate MARKETING_LANGUAGES to build Disallow lines", () => {
    assert.ok(!/Disallow:\s*\/\$\{\s*(lang|locale)/i.test(robotsSrc));
  });
});

describe("getLocaleSeoTier (preview = noindex but crawlable)", () => {
  it("classifies default English + full-tier locales as production", () => {
    for (const code of ["en", "es", "tl", "hi"]) {
      assert.equal(getLocaleSeoTier(code), "production", code);
    }
  });

  it("classifies partial + incomplete + explicit-blocked locales as preview", () => {
    for (const code of ["fr", "pa", "zh-tw", "ht", "it", "tr", "ko", "ur", "pt"]) {
      assert.equal(getLocaleSeoTier(code), "preview", code);
    }
  });

  it("never returns blocked today (no locale is hard-404'd)", () => {
    for (const lang of MARKETING_LANGUAGES) {
      assert.notEqual(getLocaleSeoTier(lang.code), "blocked", lang.code);
    }
  });
});
