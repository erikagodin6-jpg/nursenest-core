/**
 * @contract English i18n integrity
 *
 * Guards:
 *   - English (en) must have zero missing keys vs canonical source
 *   - English must NEVER render fallback / placeholder / raw keys
 *   - English must NEVER render "undefined"
 *   - All locale files must contain every key present in English
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const PUBLIC_I18N_DIR = path.resolve(process.cwd(), "public", "i18n");
const ALL_LOCALES = [
  "en",
  "fr",
  "es",
  "tl",
  "ar",
  "de",
  "id",
  "ja",
  "pt",
  "hi",
  "zh",
  "zh-tw",
  "ko",
  "ru",
  "vi",
  "th",
  "tr",
  "it",
  "fa",
  "ht",
  "ur",
  "pa",
];

function loadLocale(locale: string): Record<string, string> {
  const filePath = path.join(PUBLIC_I18N_DIR, `${locale}.json`);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as Record<string, string>;
}

describe("i18n-english-integrity", () => {
  const en = loadLocale("en");
  const enKeys = Object.keys(en);

  test("English has no empty string values", () => {
    const empty = enKeys.filter((k) => en[k]?.trim?.() === "");
    assert.equal(
      empty.length,
      0,
      `English has ${empty.length} empty values: ${empty.slice(0, 10).join(", ")}`
    );
  });

  test("English has no undefined-looking values", () => {
    const bad = enKeys.filter((k) =>
      ["undefined", "null", "[missing:"].some((s) => en[k]?.includes?.(s))
    );
    assert.equal(
      bad.length,
      0,
      `English has ${bad.length} corrupted values: ${bad.slice(0, 10).join(", ")}`
    );
  });

  test("English keys do not contain literal key paths as values", () => {
    // Spot-check: values should not look like dot-notation keys
    const suspicious = enKeys.filter((k) => {
      const v = en[k];
      return /^[a-z]+\.[a-z]+\.[a-zA-Z]+$/.test(v) && v === k;
    });
    assert.equal(
      suspicious.length,
      0,
      `English has ${suspicious.length} keys that equal their own path (untranslated fallback leak)`
    );
  });

  test("every locale contains all English keys (no missing translations)", () => {
    const missingByLocale: Record<string, string[]> = {};

    for (const locale of ALL_LOCALES) {
      if (locale === "en") continue;
      let data: Record<string, string>;
      try {
        data = loadLocale(locale);
      } catch {
        missingByLocale[locale] = ["FILE_NOT_FOUND"];
        continue;
      }
      const missing = enKeys.filter((k) => !(k in data));
      if (missing.length) missingByLocale[locale] = missing;
    }

    const localesWithMissing = Object.keys(missingByLocale);
    assert.equal(
      localesWithMissing.length,
      0,
      `Locales with missing keys: ${JSON.stringify(
        Object.fromEntries(
          Object.entries(missingByLocale).map(([k, v]) => [k, v.length])
        )
      )}`
    );
  });

  test("no locale has literal [missing: prefix in values", () => {
    const offenders: string[] = [];
    for (const locale of ALL_LOCALES) {
      let data: Record<string, string>;
      try {
        data = loadLocale(locale);
      } catch {
        continue;
      }
      const bad = Object.entries(data)
        .filter(([, v]) => typeof v === "string" && v.startsWith("[missing:"))
        .map(([k]) => `${locale}.${k}`);
      offenders.push(...bad);
    }
    assert.equal(
      offenders.length,
      0,
      `${offenders.length} values start with [missing: — first 10: ${offenders.slice(0, 10).join(", ")}`
    );
  });

  test("English key count matches expected baseline (regression guard)", () => {
    // Baseline: English should have ~21,000 keys.
    // If this changes significantly, someone modified the source without updating tests.
    assert.ok(
      enKeys.length >= 21_000,
      `English only has ${enKeys.length} keys; expected >= 21,000`
    );
    assert.ok(
      enKeys.length <= 25_000,
      `English has ${enKeys.length} keys; expected <= 25,000 (unexpected growth)`
    );
  });
});
