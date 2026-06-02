import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { detectMixedLanguageText } from "@/lib/i18n/mixed-language-detector";
import { resolveStrictLocaleMessage } from "@/lib/i18n/strict-locale-fallback";

const SHARDS = ["allied", "auth", "billing", "brand", "common", "components", "errors", "learner", "marketing", "nav", "pages"] as const;
const ROOT = process.cwd();

function readShard(locale: string, shard: string): Record<string, string> {
  const file = path.join(ROOT, "public", "i18n", locale, `${shard}.json`);
  assert.ok(existsSync(file), `missing shard ${locale}/${shard}.json`);
  return JSON.parse(readFileSync(file, "utf8")) as Record<string, string>;
}

function readLocale(locale: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const shard of SHARDS) Object.assign(out, readShard(locale, shard));
  return out;
}

test("Tagalog public shards have every canonical English key and no extras", () => {
  for (const shard of SHARDS) {
    const en = readShard("en", shard);
    const tl = readShard("tl", shard);
    assert.deepEqual(Object.keys(tl).sort(), Object.keys(en).sort(), `tl/${shard}.json key set must match en/${shard}.json`);
  }
});

test("Tagalog critical UI values do not render placeholders or missing-key sentinels", () => {
  const tl = readLocale("tl");
  const hasPlaceholder = (value: string) =>
    /\[missing[:\]]|\{\{missing|lorem ipsum|translate this|content unavailable right now/i.test(value) ||
    /\bTODO\b|\bTBD\b/.test(value) ||
    /^(?:pages|nav|footer|brand|components|common|billing|learner|auth)\.[a-z0-9_.-]+$/i.test(value);
  const bad = Object.entries(tl)
    .filter(([key]) => /^(nav|footer|pages\.home|pages\.pricing|pages\.lessons|pages\.publicQuestionBank|pages\.questionBank|pricing|dashboard|learner|auth)\./.test(key))
    .filter(([, value]) => hasPlaceholder(value))
    .map(([key, value]) => `${key}=${value}`);
  assert.deepEqual(bad.slice(0, 20), []);
});

test("Tagalog critical SEO and navigation strings use natural Taglish while preserving protected exam terms", () => {
  const tl = readLocale("tl");
  for (const key of [
    "pages.home.metaTitleCA",
    "pages.home.metaDescriptionCA",
    "pages.pricing.title",
    "pages.pricing.description",
    "pages.publicQuestionBank.metaTitle",
    "pages.publicQuestionBank.metaDescription",
    "nav.pricing",
    "nav.lessons",
  ]) {
    assert.match(tl[key] ?? "", /\b(?:Paghahanda|Mga|Presyo|practice|questions|aralin|nursing|exam|pasyente)\b/i, `${key} should contain Tagalog or natural Taglish`);
  }
  assert.match(tl["pages.publicQuestionBank.metaTitle"] ?? "", /NCLEX|REx-PN/);
});

test("mixed-language detector catches obvious English fallback on Tagalog text", () => {
  const result = detectMixedLanguageText("Pricing and Practice Questions", "tl");
  assert.equal(result.hasBlockingLeak, true);
});

test("strict fallback uses Tagalog first, English second, and throws when English is missing", () => {
  assert.deepEqual(
    resolveStrictLocaleMessage({
      locale: "tl",
      key: "nav.pricing",
      messages: { "nav.pricing": "Presyo" },
      englishMessages: { "nav.pricing": "Pricing" },
    }),
    { value: "Presyo", usedFallback: false },
  );

  const warnings: string[] = [];
  assert.deepEqual(
    resolveStrictLocaleMessage({
      locale: "tl",
      key: "nav.home",
      messages: {},
      englishMessages: { "nav.home": "Home" },
      logWarning: (message) => warnings.push(message),
    }),
    { value: "Home", usedFallback: true },
  );
  assert.equal(warnings.length, 1);

  assert.throws(
    () => resolveStrictLocaleMessage({ locale: "tl", key: "nav.missing", messages: {}, englishMessages: {} }),
    /missing canonical English key/,
  );
});
