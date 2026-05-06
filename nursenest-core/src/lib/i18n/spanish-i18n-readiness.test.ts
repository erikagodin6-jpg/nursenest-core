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

test("Spanish public shards have every canonical English key and no extras", () => {
  for (const shard of SHARDS) {
    const en = readShard("en", shard);
    const es = readShard("es", shard);
    assert.deepEqual(Object.keys(es).sort(), Object.keys(en).sort(), `es/${shard}.json key set must match en/${shard}.json`);
  }
});

test("Spanish critical UI values do not render placeholders or missing-key sentinels", () => {
  const es = readLocale("es");
  const hasPlaceholder = (value: string) =>
    /\[missing[:\]]|\{\{missing|lorem ipsum|translate this|content unavailable right now/i.test(value) ||
    /\bTODO\b|\bTBD\b/.test(value) ||
    /^(?:pages|nav|footer|brand|components|common|billing|learner|auth)\.[a-z0-9_.-]+$/i.test(value);
  const bad = Object.entries(es)
    .filter(([key]) => /^(nav|footer|pages\.home|pages\.pricing|pages\.lessons|pages\.questionBank|pricing|dashboard|learner|auth)\./.test(key))
    .filter(([, value]) => hasPlaceholder(value))
    .map(([key, value]) => `${key}=${value}`);
  assert.deepEqual(bad.slice(0, 20), []);
});

test("mixed-language detector catches obvious English fallback on Spanish text", () => {
  const result = detectMixedLanguageText("Pricing and Practice Questions", "es");
  assert.equal(result.hasBlockingLeak, true);
});

test("strict fallback uses Spanish first, English second, and throws when English is missing", () => {
  assert.deepEqual(
    resolveStrictLocaleMessage({
      locale: "es",
      key: "nav.home",
      messages: { "nav.home": "Inicio" },
      englishMessages: { "nav.home": "Home" },
    }),
    { value: "Inicio", usedFallback: false },
  );

  const warnings: string[] = [];
  assert.deepEqual(
    resolveStrictLocaleMessage({
      locale: "es",
      key: "nav.home",
      messages: {},
      englishMessages: { "nav.home": "Home" },
      logWarning: (message) => warnings.push(message),
    }),
    { value: "Home", usedFallback: true },
  );
  assert.equal(warnings.length, 1);

  assert.throws(
    () => resolveStrictLocaleMessage({ locale: "es", key: "nav.missing", messages: {}, englishMessages: {} }),
    /missing canonical English key/,
  );
});
