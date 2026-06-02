import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_ISOLATED_LANGUAGE_CODE,
  getIndexableIsolatedLanguageCodes,
  getIsolatedLanguageConfig,
  getIsolatedLanguageConfigBySubdomain,
  getPubliclyEnabledIsolatedLanguageCodes,
  ISOLATED_LANGUAGE_REGISTRY,
  isIsolatedLanguageEnabled,
  isIsolatedLanguageIndexable,
} from "@/lib/i18n/language-isolation-registry";
import { getMarketingLanguagesForSwitcher } from "@/lib/i18n/marketing-languages";
import {
  absoluteLanguageUrl,
  internalPathForLanguageSubdomain,
  localeFromLanguageSubdomainHost,
  publicPathForLanguageSubdomain,
} from "@/lib/i18n/language-subdomains";
import { absoluteMarketingCanonical, marketingHreflangLanguagesForEnPath } from "@/lib/seo/marketing-alternates";

const REQUIRED_SUBDOMAINS: Record<string, string> = {
  en: "nursenest.ca",
  fr: "fr.nursenest.ca",
  es: "es.nursenest.ca",
  hi: "hi.nursenest.ca",
  pt: "pt.nursenest.ca",
  ar: "ar.nursenest.ca",
  de: "de.nursenest.ca",
  ja: "jp.nursenest.ca",
  ko: "ko.nursenest.ca",
  zh: "zh.nursenest.ca",
  "zh-tw": "zh-tw.nursenest.ca",
  it: "it.nursenest.ca",
  tl: "tl.nursenest.ca",
};

test("language isolation registry owns every required subdomain independently", () => {
  for (const [languageCode, subdomain] of Object.entries(REQUIRED_SUBDOMAINS)) {
    const config = getIsolatedLanguageConfig(languageCode);
    assert.ok(config, `missing language registry entry for ${languageCode}`);
    assert.equal(config.subdomain, subdomain);
    assert.equal(getIsolatedLanguageConfigBySubdomain(subdomain)?.languageCode, languageCode);
    assert.match(config.featureFlag, /^ENABLE_[A-Z_]+$/);
  }
});

test("English is the only production/indexable language by default", () => {
  assert.equal(DEFAULT_ISOLATED_LANGUAGE_CODE, "en");
  assert.deepEqual(getIndexableIsolatedLanguageCodes(), ["en"]);
  assert.deepEqual(getPubliclyEnabledIsolatedLanguageCodes(), ["en"]);
  assert.equal(isIsolatedLanguageEnabled("en"), true);
  assert.equal(isIsolatedLanguageIndexable("en"), true);

  for (const language of ISOLATED_LANGUAGE_REGISTRY) {
    if (language.languageCode === "en") continue;
    assert.equal(language.publicationStatus === "published", false, `${language.languageCode} must not be published`);
    assert.equal(language.seoStatus, "noindex");
    assert.equal(language.indexingStatus, "noindex-nofollow");
    assert.equal(isIsolatedLanguageEnabled(language.languageCode), false);
    assert.equal(isIsolatedLanguageIndexable(language.languageCode), false);
  }
});

test("language subdomain routing preserves English apex behavior and isolates localized hosts", () => {
  assert.equal(localeFromLanguageSubdomainHost("nursenest.ca"), "en");
  assert.equal(localeFromLanguageSubdomainHost("fr.nursenest.ca"), "fr");
  assert.equal(localeFromLanguageSubdomainHost("jp.nursenest.ca"), "ja");
  assert.equal(localeFromLanguageSubdomainHost("zh-tw.nursenest.ca:443"), "zh-tw");

  assert.equal(internalPathForLanguageSubdomain("en", "/pricing"), "/pricing");
  assert.equal(publicPathForLanguageSubdomain("en", "/pricing"), "/pricing");
  assert.equal(internalPathForLanguageSubdomain("ja", "/nclex-rn"), "/ja/nclex-rn");
  assert.equal(publicPathForLanguageSubdomain("ja", "/ja/nclex-rn"), "/nclex-rn");
  assert.equal(absoluteLanguageUrl("ja", "/nclex-rn"), "https://jp.nursenest.ca/nclex-rn");
});

test("localized canonical generation cannot rewrite English production canonical", () => {
  assert.equal(absoluteMarketingCanonical("en", "/pricing"), "https://nursenest.ca/pricing");
  assert.equal(absoluteMarketingCanonical("fr", "/pricing"), "https://fr.nursenest.ca/pricing");
  assert.equal(absoluteMarketingCanonical("es", "/question-bank"), "https://es.nursenest.ca/question-bank");
  assert.equal(absoluteMarketingCanonical("ja", "/nclex-rn"), "https://jp.nursenest.ca/nclex-rn");
});

test("unfinished languages are absent from switcher and hreflang clusters by default", () => {
  assert.deepEqual(getMarketingLanguagesForSwitcher().map((language) => language.code), ["en"]);
  const languages = marketingHreflangLanguagesForEnPath("/pricing");
  assert.deepEqual(languages, {
    "x-default": "https://nursenest.ca/pricing",
    "en-CA": "https://nursenest.ca/pricing",
  });
});

test("English i18n namespace files remain physically isolated from non-English namespaces", () => {
  const root = join(process.cwd(), "public/i18n");
  const enNav = readFileSync(join(root, "en/nav.json"), "utf8");
  const esNav = readFileSync(join(root, "es/nav.json"), "utf8");
  const frNav = readFileSync(join(root, "fr/nav.json"), "utf8");

  assert.ok(enNav.includes("Dashboard") || enNav.includes("dashboard"));
  assert.notEqual(join(root, "en/nav.json"), join(root, "es/nav.json"));
  assert.notEqual(join(root, "en/nav.json"), join(root, "fr/nav.json"));
  assert.doesNotThrow(() => JSON.parse(enNav));
  assert.doesNotThrow(() => JSON.parse(esNav));
  assert.doesNotThrow(() => JSON.parse(frNav));
});

