import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..", "..");

describe("RN launch runbook package scripts", () => {
  it("keeps the documented readiness, audit, and release-health aliases wired", () => {
    const pkg = JSON.parse(readFileSync(join(appRoot, "package.json"), "utf8")) as {
      scripts?: Record<string, string>;
    };
    const scripts = pkg.scripts ?? {};

    assert.equal(
      scripts["readiness:emit-snapshot"],
      "npx tsx scripts/readiness/emit-pathway-readiness-snapshot.mts",
    );
    assert.equal(scripts["audit:flashcard-pools"], "npx tsx scripts/audit-flashcard-pools.ts");
    assert.equal(
      scripts["audit:practice-hub:us-rn"],
      "npx tsx scripts/audit-us-rn-nclex-rn-practice-hub-counts.mts",
    );
    assert.equal(
      scripts["audit:practice-hub:ca-rn"],
      "npx tsx scripts/audit-ca-rn-nclex-rn-practice-hub-counts.mts",
    );
    assert.equal(
      scripts["qa:release-gate:health"],
      "node scripts/validate-release-gate-env.mjs && npx playwright test -c playwright.release-gate.config.ts --project=release-health",
    );
  });
});
