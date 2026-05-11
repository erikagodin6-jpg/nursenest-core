import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pricingClientPath = join(__dirname, "pricing-page-client.tsx");

describe("pricing page - tier scope panel contract", () => {
  const src = readFileSync(pricingClientPath, "utf8");

  it("renders a dedicated tier scope panel in the pricing flow", () => {
    assert.match(src, /PricingTierScopePanel/);
    assert.match(src, /pricing-tier-scope-panel/);
  });
});
