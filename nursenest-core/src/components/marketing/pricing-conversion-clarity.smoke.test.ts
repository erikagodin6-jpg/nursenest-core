import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.join(__dirname, "..", "..", "..");
const PAGES_EN = path.join(pkgRoot, "public", "i18n", "en", "pages.json");
const CONTRACT = path.join(pkgRoot, "scripts", "contracts", "pricing-conversion-clarity-keys.json");

/**
 * Static smoke: validates canonical EN copy for every key used by `PricingConversionClarity`
 * (avoids SSR + framer-motion + `jsx: preserve` needing `React` in every transitive module under `tsx --test`).
 */
describe("Pricing conversion clarity copy smoke (en pages.json)", () => {
  it("contract keys resolve to real English (no raw key paths; required phrases present)", () => {
    const keys = JSON.parse(fs.readFileSync(CONTRACT, "utf8")) as string[];
    const pages = JSON.parse(fs.readFileSync(PAGES_EN, "utf8")) as Record<string, string>;
    const chunks: string[] = [];

    for (const key of keys) {
      const v = pages[key];
      assert.equal(typeof v, "string", `missing string for ${key}`);
      assert.ok(v.trim(), `empty value for ${key}`);
      assert.equal(v.includes("pages.pricing."), false, `value must not echo raw path: ${key}`);
      chunks.push(v);
    }

    const blob = chunks.join("\n");
    const lower = blob.toLowerCase();
    assert.equal(lower.includes("pages.pricing."), false);
    assert.equal(lower.includes("conversionclarity"), false);

    assert.match(blob, /Know exactly what you're getting/);
    assert.match(blob, /What's included in every paid plan/);
    assert.match(blob, /Not included/);
    assert.match(blob, /Cancel anytime/);
    assert.match(blob, /Secure checkout/);
  });
});
