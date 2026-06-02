import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pricingClientPath = join(__dirname, "pricing-page-client.tsx");

describe("pricing-page-client — allied occupation selector", () => {
  const src = readFileSync(pricingClientPath, "utf8");

  it("shows career pills when Allied segment is active", () => {
    assert.match(src, /isAllied\s*&&/);
    assert.ok(src.includes("ALLIED_CAREER_KEYS.map"));
    assert.ok(src.includes('trackProductEvent("allied_career_selected"'));
  });

  it("includes alliedCareer in checkout POST body for Allied tier", () => {
    assert.ok(src.includes("body.alliedCareer"));
    assert.ok(src.includes("selectedAlliedCareer"));
  });
});
