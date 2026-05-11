import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getHreflangEligibleLocales,
  getIndexableLocales,
  getLocaleSeoTier,
  getPreviewSeoLocales,
  getProductionSeoLocales,
  getSitemapIncludedLocales,
  isLocaleHreflangEligible,
  isLocaleRobotsPathDisallowed,
  isLocaleSeoIndexable,
  isLocaleSitemapIncluded,
  SEO_BLOCKED_LOCALES,
} from "@/lib/i18n/language-readiness";
import { MARKETING_LANGUAGES } from "@/lib/i18n/marketing-languages";
import {
  DEFAULT_MARKETING_LOCALE,
  isCoreHostedNonDefaultLocale,
} from "@/lib/i18n/marketing-locale-policy";
import {
  marketingAlternatesForNoindexUtilityPage,
  marketingAlternatesSharedPage,
  marketingCanonicalPathForLocale,
  marketingHreflangLanguagesForEnPath,
} from "@/lib/seo/marketing-alternates";
import {
  AUTH_MARKETING_PATHS_NOINDEX,
  isAuthNoindexMarketingPathname,
  isEligiblePublicIndexSitemapLoc,
} from "@/lib/seo/sitemap-marketing-exclusions";
import { localeRobotsOverride } from "@/lib/i18n/language-readiness";

/**
 * Cross-cutting locale SEO contracts that lock in the post-remediation invariants.
 *
 * The single source of truth is {@link getLocaleSeoTier}:
 *   - production  → indexable, in sitemap, in hreflang, no per-page robots override
 *   - preview     → crawlable, NOT in sitemap, NOT in hreflang, page emits noindex,follow
 *   - blocked     → reserved (no locale uses today)
 *
 * Auth/utility surfaces (`/login`, `/signup`, `/forgot-password`, `/reset-password`) are
 * always noindex,follow regardless of locale tier and never participate in hreflang clusters
 * or sitemap urlsets.
 *
 * Background: see `docs/reports/locale-seo-leakage-remediation.md`.
 */

const MARKETING_LOCALES = MARKETING_LANGUAGES.map((l) => l.code);
const NON_DEFAULT_MARKETING_LOCALES = MARKETING_LOCALES.filter((c) => c !== DEFAULT_MARKETING_LOCALE);

describe("Contract 1: noindex/blocked locale paths never appear in sitemap inclusion", () => {
  it("getSitemapIncludedLocales contains only production-tier locales", () => {
    const included = getSitemapIncludedLocales();
    for (const code of included) {
      assert.equal(
        getLocaleSeoTier(code),
        "production",
        `sitemap-included locale ${code} must be production tier (got ${getLocaleSeoTier(code)})`,
      );
      assert.equal(
        isLocaleSeoIndexable(code),
        true,
        `sitemap-included locale ${code} must be indexable`,
      );
    }
  });

  it("every preview-tier locale is excluded from sitemap inclusion", () => {
    for (const code of getPreviewSeoLocales()) {
      assert.equal(
        isLocaleSitemapIncluded(code),
        false,
        `preview-tier locale ${code} must NOT be in sitemap`,
      );
    }
  });

  it("every SEO_BLOCKED_LOCALES override is excluded from sitemap inclusion (even if its marketing tier is full)", () => {
    for (const code of SEO_BLOCKED_LOCALES) {
      assert.equal(isLocaleSitemapIncluded(code), false, code);
    }
  });
});

describe("Contract 2: hreflang clusters exclude every noindex / preview locale", () => {
  it("getHreflangEligibleLocales contains only production-tier locales", () => {
    for (const code of getHreflangEligibleLocales()) {
      assert.equal(
        getLocaleSeoTier(code),
        "production",
        `hreflang-eligible locale ${code} must be production tier`,
      );
      assert.equal(isLocaleSeoIndexable(code), true, code);
    }
  });

  it("every preview locale is excluded from hreflang eligibility", () => {
    for (const code of getPreviewSeoLocales()) {
      assert.equal(isLocaleHreflangEligible(code), false, code);
    }
  });

  it("marketingHreflangLanguagesForEnPath only references production locales", () => {
    const langs = marketingHreflangLanguagesForEnPath("/pricing");
    for (const tag of Object.keys(langs)) {
      if (tag === "x-default" || tag === "en-CA") continue;
      const base = tag.split("-")[0] ?? tag;
      // language tag mapping in marketing-alternates: fr → fr-CA, pt → pt-BR; others passthrough
      const canonicalCode =
        tag === "fr-CA" ? "fr" : tag === "pt-BR" ? "pt" : base;
      assert.equal(
        getLocaleSeoTier(canonicalCode),
        "production",
        `hreflang tag ${tag} → ${canonicalCode} must be production`,
      );
    }
  });

  it("hreflang does not include any SEO_BLOCKED_LOCALES code", () => {
    const langs = marketingHreflangLanguagesForEnPath("/pricing");
    const langKeys = Object.keys(langs);
    for (const code of SEO_BLOCKED_LOCALES) {
      assert.ok(
        !langKeys.includes(code) &&
          !langKeys.includes(code === "pt" ? "pt-BR" : `${code}-XX`),
        `hreflang must not include blocked code ${code}`,
      );
    }
  });
});

describe("Contract 3: utility/auth pages are noindex + excluded from sitemap + no hreflang languages cluster", () => {
  it("AUTH_MARKETING_PATHS_NOINDEX covers login, signup, forgot-password, reset-password", () => {
    const set = new Set<string>(AUTH_MARKETING_PATHS_NOINDEX);
    for (const required of ["/login", "/signup", "/forgot-password", "/reset-password"]) {
      assert.ok(set.has(required), `utility path ${required} must be in AUTH_MARKETING_PATHS_NOINDEX`);
    }
  });

  it("isAuthNoindexMarketingPathname recognises every hosted-locale auth path", () => {
    for (const path of AUTH_MARKETING_PATHS_NOINDEX) {
      assert.equal(isAuthNoindexMarketingPathname(path), true, path);
      for (const code of NON_DEFAULT_MARKETING_LOCALES) {
        if (!isCoreHostedNonDefaultLocale(code)) continue;
        assert.equal(
          isAuthNoindexMarketingPathname(`/${code}${path}`),
          true,
          `/${code}${path}`,
        );
      }
    }
  });

  it("isEligiblePublicIndexSitemapLoc drops every (locale, auth-path) combination", () => {
    const origin = "https://www.example.test";
    for (const code of [DEFAULT_MARKETING_LOCALE, ...NON_DEFAULT_MARKETING_LOCALES]) {
      for (const path of AUTH_MARKETING_PATHS_NOINDEX) {
        const loc = code === DEFAULT_MARKETING_LOCALE
          ? `${origin}${path}`
          : `${origin}/${code}${path}`;
        assert.equal(
          isEligiblePublicIndexSitemapLoc(loc, origin),
          false,
          `sitemap must drop ${loc}`,
        );
      }
    }
  });

  it("marketingAlternatesForNoindexUtilityPage does NOT emit a hreflang languages cluster", () => {
    const alt = marketingAlternatesForNoindexUtilityPage("en", "/forgot-password");
    assert.equal("languages" in alt, false);
    assert.match(alt.canonical, /\/forgot-password$/);
  });
});

describe("Contract 4: robots rules do not conflict with indexing rules", () => {
  it("robots.txt never Disallows any marketing locale (including default)", () => {
    for (const code of MARKETING_LOCALES) {
      assert.equal(
        isLocaleRobotsPathDisallowed(code),
        false,
        `locale ${code} must be crawlable so Googlebot can read page-level noindex`,
      );
    }
  });

  it("no locale is simultaneously Disallowed in robots AND included in sitemap", () => {
    for (const code of MARKETING_LOCALES) {
      const disallowed = isLocaleRobotsPathDisallowed(code);
      const sitemap = isLocaleSitemapIncluded(code);
      assert.equal(disallowed && sitemap, false, `conflict: ${code} Disallowed=${disallowed} sitemap=${sitemap}`);
    }
  });

  it("no locale is simultaneously Disallowed in robots AND hreflang-eligible", () => {
    for (const code of MARKETING_LOCALES) {
      const disallowed = isLocaleRobotsPathDisallowed(code);
      const hreflang = isLocaleHreflangEligible(code);
      assert.equal(disallowed && hreflang, false, `conflict: ${code} Disallowed=${disallowed} hreflang=${hreflang}`);
    }
  });

  it("every preview-tier locale emits page-level noindex,follow via localeRobotsOverride", () => {
    for (const code of getPreviewSeoLocales()) {
      const override = localeRobotsOverride(code);
      assert.deepEqual(
        override,
        { index: false, follow: true },
        `preview locale ${code} must emit noindex,follow`,
      );
    }
  });

  it("production-tier locales never emit a robots metadata override", () => {
    for (const code of getProductionSeoLocales()) {
      assert.equal(localeRobotsOverride(code), null, `production locale ${code} must not override robots`);
    }
  });
});

describe("Contract 5: canonical + alternate clusters only include production locales", () => {
  it("marketingAlternatesSharedPage('en', '/pricing') languages map references production locales only", () => {
    const { languages } = marketingAlternatesSharedPage("en", "/pricing");
    for (const tag of Object.keys(languages)) {
      if (tag === "x-default" || tag === "en-CA") continue;
      const canonicalCode =
        tag === "fr-CA" ? "fr" : tag === "pt-BR" ? "pt" : (tag.split("-")[0] ?? tag);
      assert.equal(
        getLocaleSeoTier(canonicalCode),
        "production",
        `canonical alternate ${tag} → ${canonicalCode} must be production`,
      );
    }
  });

  it("preview-tier canonical URLs do not surface localized siblings in their hreflang cluster", () => {
    const sample = ["pa", "zh-tw", "ht", "it", "tr", "ko", "ur"];
    for (const code of sample) {
      assert.equal(getLocaleSeoTier(code), "preview", code);
      assert.equal(isLocaleHreflangEligible(code), false, code);
      const indexable = getIndexableLocales();
      assert.equal(indexable.includes(code), false, code);
    }
  });

  it("canonical path for a production locale routes under /{code} or default-root", () => {
    for (const code of getProductionSeoLocales()) {
      const canonical = marketingCanonicalPathForLocale(code, "/pricing");
      if (code === DEFAULT_MARKETING_LOCALE) {
        assert.equal(canonical, "/pricing");
      } else {
        assert.equal(canonical, `/${code}/pricing`, code);
      }
    }
  });
});
