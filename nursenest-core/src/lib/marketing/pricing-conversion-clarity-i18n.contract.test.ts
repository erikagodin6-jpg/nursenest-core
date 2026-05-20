import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.join(__dirname, "..", "..", "..");
const CONTRACT = path.join(pkgRoot, "scripts", "contracts", "pricing-conversion-clarity-keys.json");
const PAGES_EN = path.join(pkgRoot, "public", "i18n", "en", "pages.json");

function humanizedKeyFallback(key: string): string {
  const tail = key.includes(".") ? (key.split(".").pop() ?? key) : key;
  const words = tail.replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").trim();
  if (!words) return "NurseNest";
  const t = words.charAt(0).toUpperCase() + words.slice(1);
  return t.length > 80 ? `${t.slice(0, 77)}…` : t;
}

/** Explicit checklist (subset of contract JSON) for pricing conversion clarity section. */
const REQUIRED_PRICING_CONVERSION_CLARITY_KEYS = [
  "pages.pricing.conversionClarity.heading",
  "pages.pricing.conversionClarity.intro",
  "pages.pricing.conversionClarity.value1Title",
  "pages.pricing.conversionClarity.value1Body",
  "pages.pricing.conversionClarity.value2Title",
  "pages.pricing.conversionClarity.value2Body",
  "pages.pricing.conversionClarity.value3Title",
  "pages.pricing.conversionClarity.value3Body",
  "pages.pricing.conversionClarity.includedHeading",
  "pages.pricing.conversionClarity.included1",
  "pages.pricing.conversionClarity.included2",
  "pages.pricing.conversionClarity.included3",
  "pages.pricing.conversionClarity.included4",
  "pages.pricing.conversionClarity.included5",
  "pages.pricing.conversionClarity.notIncludedHeading",
  "pages.pricing.conversionClarity.notIncluded1",
  "pages.pricing.conversionClarity.notIncluded2",
  "pages.pricing.conversionClarity.notIncluded3",
] as const;

describe("pricing conversion clarity i18n contract", () => {
  it("required conversion clarity keys exist in en pages.json with real copy", () => {
    const pages = JSON.parse(fs.readFileSync(PAGES_EN, "utf8")) as Record<string, string>;
    for (const key of REQUIRED_PRICING_CONVERSION_CLARITY_KEYS) {
      const v = pages[key];
      assert.equal(typeof v, "string", `missing string for ${key}`);
      assert.ok(v.trim().length > 0, `empty value for ${key}`);
      assert.notEqual(
        v.trim().toLowerCase(),
        humanizedKeyFallback(key).toLowerCase(),
        `value for ${key} must not equal humanized missing-key fallback`,
      );
    }
  });

  it("canonical English pages.json defines every contract key with non-humanized copy", () => {
    const keys = JSON.parse(fs.readFileSync(CONTRACT, "utf8")) as string[];
    const pages = JSON.parse(fs.readFileSync(PAGES_EN, "utf8")) as Record<string, string>;

    assert.ok(Array.isArray(keys) && keys.length > 0, "contract must list keys");

    for (const key of keys) {
      const v = pages[key];
      assert.equal(typeof v, "string", `missing string for ${key}`);
      assert.ok(v.trim().length > 0, `empty value for ${key}`);
      assert.notEqual(
        v.trim().toLowerCase(),
        humanizedKeyFallback(key).toLowerCase(),
        `value for ${key} must not equal humanized missing-key fallback`,
      );
    }
  });
});
