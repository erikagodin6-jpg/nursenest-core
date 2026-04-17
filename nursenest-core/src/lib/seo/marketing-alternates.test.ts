import assert from "node:assert/strict";
import test from "node:test";
import {
  marketingCanonicalPathForLocale,
  marketingHreflangLanguagesForEnPath,
} from "@/lib/seo/marketing-alternates";

test("marketingHreflangLanguagesForEnPath does not emit /{locale}/us/… for exam hub paths", () => {
  const path = "/us/np/fnp";
  const langs = marketingHreflangLanguagesForEnPath(path);
  assert.equal(Object.keys(langs).length, 2);
  assert.ok(langs["x-default"]?.includes("/us/np/fnp"));
  assert.ok(langs.en?.includes("/us/np/fnp"));
  assert.equal(langs.fr, undefined);
});

test("marketingHreflangLanguagesForEnPath strips a mistaken /fr prefix before detecting exam hubs", () => {
  const langs = marketingHreflangLanguagesForEnPath("/fr/us/np/fnp");
  assert.equal(Object.keys(langs).length, 2);
  assert.ok(!langs.fr?.includes("/fr/us/"));
});

test("marketingHreflangLanguagesForEnPath emits localized alternates only when a localized /exams shell exists", () => {
  const india = marketingHreflangLanguagesForEnPath("/exams/india");
  assert.ok(india.fr?.includes("/fr/exams/india"));

  const philippines = marketingHreflangLanguagesForEnPath("/exams/philippines");
  assert.equal(Object.keys(philippines).length, 2);
  assert.ok(philippines["x-default"]?.includes("/exams/philippines"));
  assert.equal(philippines.fr, undefined);

  const canada = marketingHreflangLanguagesForEnPath("/exams/canada");
  assert.equal(canada.fr, undefined);
});

test("marketingCanonicalPathForLocale never prefixes exam hub paths with locale", () => {
  assert.equal(marketingCanonicalPathForLocale("fr", "/us/np/fnp/pricing"), "/us/np/fnp/pricing");
});

test("marketingCanonicalPathForLocale prefixes normal marketing paths", () => {
  assert.equal(marketingCanonicalPathForLocale("fr", "/pricing"), "/fr/pricing");
});

test("marketingCanonicalPathForLocale does not prefix default-only expansion exam hubs", () => {
  assert.equal(marketingCanonicalPathForLocale("fr", "/exams/philippines"), "/exams/philippines");
  assert.equal(marketingCanonicalPathForLocale("fr", "/exams/india"), "/fr/exams/india");
});
