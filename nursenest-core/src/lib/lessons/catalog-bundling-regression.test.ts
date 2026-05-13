/**
 * Regression guard: lesson catalog JSON must NOT be bundled into server chunks.
 *
 * Before the P0 fix, `createRequire` caused Turbopack to statically trace all
 * 25 catalog files (~57 MB) into a 44 MB server chunk, causing 60+ second hub
 * load times and build OOMs. These tests ensure that regression cannot recur.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const ROOT = process.cwd();

function readSrc(relPath: string): string {
  return readFileSync(join(ROOT, relPath), "utf8");
}

describe("Catalog bundling regression guard", () => {
  it("pathway-lesson-catalog-sync does not import createRequire", () => {
    const src = readSrc("src/lib/lessons/pathway-lesson-catalog-sync.ts");
    // createRequire must not appear as a live import (comments are allowed)
    const hasImport = /^import\s*\{[^}]*createRequire[^}]*\}\s*from/m.test(src);
    assert.ok(!hasImport, "createRequire must not be imported — use readFileSync instead (see P0 fix in file header)");
  });

  it("pathway-lesson-catalog-sync uses readFileSync for catalog loading", () => {
    const src = readSrc("src/lib/lessons/pathway-lesson-catalog-sync.ts");
    assert.match(src, /readCatalogJsonSync/, "readCatalogJsonSync helper must be present");
    assert.match(src, /readFileSync\(abs, "utf8"\)/, "readFileSync must be the underlying read mechanism");
  });

  it("pathway-lesson-catalog-sync has no bare require() calls for JSON", () => {
    const src = readSrc("src/lib/lessons/pathway-lesson-catalog-sync.ts");
    // Bare require("...") or require('...') outside of comments
    const lines = src.split("\n").filter((l) => !l.trim().startsWith("//") && !l.trim().startsWith("*"));
    const bareRequire = lines.filter((l) => /\brequire\s*\(["']@\/content/.test(l));
    assert.equal(bareRequire.length, 0,
      `Found bare require() calls for catalog JSON: ${bareRequire.slice(0, 2).join(", ")}`);
  });

  it("pathway type guards exist and use explicit Set membership (not string matching)", () => {
    const src = readSrc("src/lib/lessons/pathway-lesson-catalog-sync.ts");
    // Explicit allowlist sets must be present
    assert.match(src, /RN_NCLEX_PATHWAY_IDS\s*=\s*new Set\(/, "RN_NCLEX_PATHWAY_IDS Set must exist");
    assert.match(src, /RPN_PATHWAY_IDS\s*=\s*new Set\(/, "RPN_PATHWAY_IDS Set must exist");
    assert.match(src, /NP_PATHWAY_IDS\s*=\s*new Set\(/, "NP_PATHWAY_IDS Set must exist");
    assert.match(src, /ALLIED_CORE_PATHWAY_IDS\s*=\s*new Set\(/, "ALLIED_CORE_PATHWAY_IDS Set must exist");
  });

  it("getCatalogLessonsRawFromBundledOnly guards RN expansions behind isRnNclexPathway", () => {
    const src = readSrc("src/lib/lessons/pathway-lesson-catalog-sync.ts");
    // The function must use isRnNclexPathway guard for each RN expansion
    assert.match(src, /isRnNclexPathway\(pathwayId\)\s*\?.*rnCardiovascularExpansion/s,
      "Cardiovascular expansion must be guarded by isRnNclexPathway");
    assert.match(src, /isRpnPathway\(pathwayId\)\s*\?.*rpnParityExpansion/s,
      "RPN parity expansion must be guarded by isRpnPathway");
    assert.match(src, /isNpPathway\(pathwayId\)\s*\?.*npParityExpansion/s,
      "NP parity expansion must be guarded by isNpPathway");
  });
});

describe("Server chunk size budget", () => {
  it("no .next/server/chunks/*.js file exceeds 10 MB (catalog bundling guard)", () => {
    const { readdirSync, statSync } = require("node:fs");
    const chunksDir = join(ROOT, ".next/server/chunks");

    let chunksDir_exists = false;
    try {
      readdirSync(chunksDir);
      chunksDir_exists = true;
    } catch {
      // No build output — skip this check
      return;
    }

    if (!chunksDir_exists) return;

    const BUDGET_BYTES = 10 * 1024 * 1024; // 10 MB
    const files = readdirSync(chunksDir).filter((f: string) => f.endsWith(".js"));
    const violations: string[] = [];

    for (const file of files) {
      const size = statSync(join(chunksDir, file)).size;
      if (size > BUDGET_BYTES) {
        violations.push(`${file}: ${Math.round(size / 1024 / 1024)}MB`);
      }
    }

    assert.equal(violations.length, 0,
      `Server chunks exceed 10 MB budget (likely catalog bundling regression):\n  ${violations.join("\n  ")}\n\n` +
      `This usually means createRequire was re-introduced in pathway-lesson-catalog-sync.ts. ` +
      `Run: grep -n "createRequire\\|catalogBundleRequire" src/lib/lessons/pathway-lesson-catalog-sync.ts`
    );
  });

  it("no .next/server/chunks/*.js file is larger than 5 MB (strict warning tier)", function() {
    const { readdirSync, statSync } = require("node:fs");
    const chunksDir = join(ROOT, ".next/server/chunks");

    try { readdirSync(chunksDir); } catch { return; }

    const WARN_BYTES = 5 * 1024 * 1024; // 5 MB
    const files = readdirSync(chunksDir).filter((f: string) => f.endsWith(".js"));
    const large: string[] = [];

    for (const file of files) {
      const size = statSync(join(chunksDir, file)).size;
      if (size > WARN_BYTES) {
        large.push(`${file}: ${Math.round(size / 1024 / 1024)}MB`);
      }
    }

    if (large.length > 0) {
      console.warn(
        `[catalog-budget] WARN: ${large.length} server chunk(s) over 5 MB:\n  ${large.join("\n  ")}\n` +
        `Target: all chunks < 5 MB after catalog bundling fix.`
      );
    }
    // Warning only — does not fail the test
  });
});
