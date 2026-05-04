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

test("Portuguese public shards have every canonical English key and no extras", () => {
  for (const shard of SHARDS) {
    const en = readShard("en", shard);
    const pt = readShard("pt", shard);
    assert.deepEqual(Object.keys(pt).sort(), Object.keys(en).sort(), `pt/${shard}.json key set must match en/${shard}.json`);
  }
});

test("Portuguese critical UI values do not render placeholders or missing-key sentinels", () => {
  const pt = readLocale("pt");
  const hasPlaceholder = (value: string) =>
    /\[missing[:\]]|\{\{missing|lorem ipsum|translate this|content unavailable right now/i.test(value) ||
    /\bTODO\b|\bTBD\b/.test(value) ||
    /^(?:pages|nav|footer|brand|components|common|billing|learner|auth)\.[a-z0-9_.-]+$/i.test(value);
  const bad = Object.entries(pt)
    .filter(([key]) => /^(nav|footer|pages\.home|pages\.pricing|pages\.lessons|pages\.publicQuestionBank|pages\.questionBank|pricing|dashboard|learner|auth)\./.test(key))
    .filter(([, value]) => hasPlaceholder(value))
    .map(([key, value]) => `${key}=${value}`);
  assert.deepEqual(bad.slice(0, 20), []);
});

test("Portuguese critical SEO and navigation strings are localized while preserving protected exam terms", () => {
  const pt = readLocale("pt");
  for (const key of [
    "pages.home.metaTitleCA",
    "pages.home.metaDescriptionCA",
    "pages.pricing.title",
    "pages.pricing.description",
    "pages.publicQuestionBank.metaTitle",
    "pages.publicQuestionBank.metaDescription",
    "nav.home",
    "nav.pricing",
  ]) {
    assert.match(pt[key] ?? "", /[áàâãéêíóôõúç]|\b(?:preparação|exames|enfermagem|preços|questões|prática|início)\b/i, `${key} should contain Portuguese text`);
  }
  assert.match(pt["pages.publicQuestionBank.metaTitle"] ?? "", /NCLEX|REx-PN/);
});

test("mixed-language detector catches obvious English fallback on Portuguese text", () => {
  const result = detectMixedLanguageText("Pricing and Practice Questions", "pt");
  assert.equal(result.hasBlockingLeak, true);
});

test("strict fallback uses Portuguese first, English second, and throws when English is missing", () => {
  assert.deepEqual(
    resolveStrictLocaleMessage({
      locale: "pt",
      key: "nav.home",
      messages: { "nav.home": "Início" },
      englishMessages: { "nav.home": "Home" },
    }),
    { value: "Início", usedFallback: false },
  );

  const warnings: string[] = [];
  assert.deepEqual(
    resolveStrictLocaleMessage({
      locale: "pt",
      key: "nav.home",
      messages: {},
      englishMessages: { "nav.home": "Home" },
      logWarning: (message) => warnings.push(message),
    }),
    { value: "Home", usedFallback: true },
  );
  assert.equal(warnings.length, 1);

  assert.throws(
    () => resolveStrictLocaleMessage({ locale: "pt", key: "nav.missing", messages: {}, englishMessages: {} }),
    /missing canonical English key/,
  );
});
