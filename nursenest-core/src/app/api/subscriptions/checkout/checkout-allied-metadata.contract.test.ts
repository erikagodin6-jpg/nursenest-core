import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const routePath = join(__dirname, "route.ts");

describe("checkout route — allied occupation metadata contract", () => {
  const src = readFileSync(routePath, "utf8");

  it("rejects ALLIED checkout without alliedCareer", () => {
    assert.match(src, /tier\s*===\s*["']ALLIED["']\s*&&\s*!alliedCareer/);
  });

  it("writes canonical profession metadata for Stripe session + subscription_data", () => {
    assert.ok(src.includes("metadata.alliedProfessionKey"));
    assert.ok(src.includes("canonicalProfessionKeyForAlliedCareer"));
    assert.ok(src.includes("metadata.alliedCareer"));
  });

  it("prefers shared allied Stripe env when configured", () => {
    assert.ok(src.includes("sharedAlliedStripePriceEnvKey"));
  });
});
