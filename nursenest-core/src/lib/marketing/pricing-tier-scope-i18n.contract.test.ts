import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.join(__dirname, "..", "..", "..");
const PAGES_EN = path.join(pkgRoot, "public", "i18n", "en", "pages.json");

const REQUIRED_KEYS = [
  "pages.pricing.tierScope.section.included",
  "pages.pricing.tierScope.section.scope",
  "pages.pricing.tierScope.section.notIncluded",
  "pages.pricing.tierScope.rn.scope",
  "pages.pricing.tierScope.rpn.scope",
  "pages.pricing.tierScope.lvn_lpn.scope",
  "pages.pricing.tierScope.np.scope",
  "pages.pricing.tierScope.newgrad.scope",
  "pages.pricing.tierScope.allied.scope",
  "pages.pricing.tierScope.allied.notIncluded0",
  "pages.pricing.tierScope.allied.checkoutHint",
] as const;

describe("pricing tier scope i18n contract", () => {
  it("defines canonical English copy for the pricing tier scope panel", () => {
    const pages = JSON.parse(fs.readFileSync(PAGES_EN, "utf8")) as Record<string, string>;

    for (const key of REQUIRED_KEYS) {
      const value = pages[key];
      assert.equal(typeof value, "string", `missing string for ${key}`);
      assert.ok(value.trim().length > 0, `empty value for ${key}`);
    }
  });
});
