import assert from "node:assert/strict";
import test from "node:test";
import {
  absoluteLanguageUrl,
  internalPathForLanguageSubdomain,
  LANGUAGE_SUBDOMAIN_CONFIG,
  localeFromLanguageSubdomainHost,
  publicPathForLanguageSubdomain,
} from "@/lib/i18n/language-subdomains";
import { absoluteMarketingCanonical, marketingHreflangLanguagesForEnPath } from "@/lib/seo/marketing-alternates";

test("French and Spanish subdomain hosts resolve to preview locales", () => {
  assert.equal(localeFromLanguageSubdomainHost("fr.nursenest.ca"), "fr");
  assert.equal(localeFromLanguageSubdomainHost("es.nursenest.ca:443"), "es");
  assert.equal(localeFromLanguageSubdomainHost("hi.nursenest.ca"), "hi");
  assert.equal(localeFromLanguageSubdomainHost("pt.nursenest.ca"), "pt");
  assert.equal(localeFromLanguageSubdomainHost("ar.nursenest.ca"), "ar");
  assert.equal(localeFromLanguageSubdomainHost("de.nursenest.ca"), "de");
  assert.equal(localeFromLanguageSubdomainHost("jp.nursenest.ca"), "ja");
  assert.equal(localeFromLanguageSubdomainHost("ko.nursenest.ca"), "ko");
  assert.equal(localeFromLanguageSubdomainHost("zh.nursenest.ca"), "zh");
  assert.equal(localeFromLanguageSubdomainHost("zh-tw.nursenest.ca"), "zh-tw");
  assert.equal(localeFromLanguageSubdomainHost("it.nursenest.ca"), "it");
  assert.equal(localeFromLanguageSubdomainHost("tl.nursenest.ca"), "tl");
  assert.equal(localeFromLanguageSubdomainHost("nursenest.ca"), "en");
  assert.equal(LANGUAGE_SUBDOMAIN_CONFIG.fr.publicationStatus, "preview");
  assert.equal(LANGUAGE_SUBDOMAIN_CONFIG.es.publicationStatus, "preview");
});

test("public language URLs use subdomains while internal routing keeps locale prefixes", () => {
  assert.equal(publicPathForLanguageSubdomain("fr", "/fr/pricing"), "/pricing");
  assert.equal(publicPathForLanguageSubdomain("es", "/es"), "/");
  assert.equal(internalPathForLanguageSubdomain("fr", "/pricing"), "/fr/pricing");
  assert.equal(internalPathForLanguageSubdomain("es", "/nclex-rn"), "/es/nclex-rn");
  assert.equal(internalPathForLanguageSubdomain("ja", "/nclex-rn"), "/ja/nclex-rn");
  assert.equal(internalPathForLanguageSubdomain("zh-tw", "/pricing"), "/zh-tw/pricing");
  assert.equal(absoluteLanguageUrl("fr", "/pricing"), "https://fr.nursenest.ca/pricing");
  assert.equal(absoluteLanguageUrl("es", "/nclex-rn"), "https://es.nursenest.ca/nclex-rn");
  assert.equal(absoluteLanguageUrl("ja", "/nclex-rn"), "https://jp.nursenest.ca/nclex-rn");
  assert.equal(absoluteLanguageUrl("zh-tw", "/pricing"), "https://zh-tw.nursenest.ca/pricing");
});

test("marketing canonicals use language subdomains for French and Spanish preview architecture", () => {
  assert.equal(absoluteMarketingCanonical("fr", "/pricing"), "https://fr.nursenest.ca/pricing");
  assert.equal(absoluteMarketingCanonical("es", "/question-bank"), "https://es.nursenest.ca/question-bank");
  assert.equal(absoluteMarketingCanonical("pt", "/pricing"), "https://pt.nursenest.ca/pricing");
  assert.equal(absoluteMarketingCanonical("ja", "/pricing"), "https://jp.nursenest.ca/pricing");
});

test("preview language subdomains stay out of hreflang clusters until publication readiness", () => {
  const languages = marketingHreflangLanguagesForEnPath("/pricing");
  assert.equal(languages["x-default"], "https://nursenest.ca/pricing");
  assert.equal(languages["en-CA"], "https://nursenest.ca/pricing");
  assert.equal("fr-CA" in languages, false);
  assert.equal("es" in languages, false);
});
