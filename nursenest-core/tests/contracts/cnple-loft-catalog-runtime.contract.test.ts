/**
 * CNPLE LOFT runtime catalog contract.
 *
 * This guards against the recurring failure mode where authored CNPLE cases exist
 * in the repository but are not wired into the learner catalog/session runtime.
 *
 * Run from nursenest-core/:
 *   node --import tsx --test tests/contracts/cnple-loft-catalog-runtime.contract.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  CNPLE_LOFT_CASES,
  CNPLE_LOFT_CASE_CATALOG_METRICS,
  findCnpleLoftCase,
  listCnpleLoftCases,
} from "../../src/content/cases/cnple-case-catalog.ts";
import { CNPLE_SUPPLEMENTAL_LOFT_CASES } from "../../src/content/cases/cnple-supplemental-loft-cases.ts";

const ROOT = process.cwd();

const LIVE_RUNTIME_FILES = [
  "src/app/(student)/app/(learner)/cases/cnple/page.tsx",
  "src/app/(student)/app/(learner)/cases/cnple/[caseId]/page.tsx",
  "src/app/api/cases/cnple/session/route.ts",
  "src/app/api/cases/cnple/[sessionId]/advance/route.ts",
  "src/app/api/cases/cnple/[sessionId]/review/route.ts",
];

describe("CNPLE LOFT canonical runtime catalog", () => {
  it("includes every supplemental LOFT case in the canonical runtime catalog", () => {
    const canonicalIds = new Set(CNPLE_LOFT_CASES.map((c) => c.id));
    for (const supplemental of CNPLE_SUPPLEMENTAL_LOFT_CASES) {
      assert.ok(
        canonicalIds.has(supplemental.id),
        `Supplemental CNPLE LOFT case ${supplemental.id} is not exposed through CNPLE_LOFT_CASES`,
      );
    }
  });

  it("resolves supplemental cases through findCnpleLoftCase", () => {
    for (const supplemental of CNPLE_SUPPLEMENTAL_LOFT_CASES) {
      const found = findCnpleLoftCase(supplemental.id);
      assert.ok(found, `findCnpleLoftCase could not resolve supplemental case ${supplemental.id}`);
      assert.equal(found.id, supplemental.id);
      assert.ok(found.steps.length >= 3, `Supplemental case ${supplemental.id} must have at least 3 LOFT steps`);
    }
  });

  it("lists supplemental cases in the learner-facing catalog metadata", () => {
    const listedIds = new Set(listCnpleLoftCases().map((c) => c.id));
    for (const supplemental of CNPLE_SUPPLEMENTAL_LOFT_CASES) {
      assert.ok(
        listedIds.has(supplemental.id),
        `Supplemental case ${supplemental.id} is not present in listCnpleLoftCases()`,
      );
    }
  });

  it("catalog metrics include premium supplemental LOFT case volume", () => {
    assert.ok(
      CNPLE_LOFT_CASE_CATALOG_METRICS.totalCases >= 17,
      `Expected at least 17 CNPLE LOFT cases after supplemental build, got ${CNPLE_LOFT_CASE_CATALOG_METRICS.totalCases}`,
    );
    assert.ok(
      CNPLE_LOFT_CASE_CATALOG_METRICS.totalSteps >= 50,
      `Expected at least 50 CNPLE LOFT steps after supplemental build, got ${CNPLE_LOFT_CASE_CATALOG_METRICS.totalSteps}`,
    );
    assert.ok(
      CNPLE_LOFT_CASE_CATALOG_METRICS.domains.includes("reproductive-sexual-health"),
      "Maternal/reproductive health domain must be represented in CNPLE LOFT catalog metrics",
    );
    assert.ok(
      CNPLE_LOFT_CASE_CATALOG_METRICS.domains.includes("older-adult-care"),
      "Older adult care domain must remain represented in CNPLE LOFT catalog metrics",
    );
  });
});

describe("CNPLE LOFT live runtime imports", () => {
  it("runtime files use the canonical catalog instead of direct CNPLE_SAMPLE_CASES imports", () => {
    for (const relativePath of LIVE_RUNTIME_FILES) {
      const source = readFileSync(join(ROOT, relativePath), "utf-8");
      assert.doesNotMatch(
        source,
        /from\s+["']@\/content\/cases\/cnple-sample-cases["']/,
        `${relativePath} must not import cnple-sample-cases directly; use cnple-case-catalog instead`,
      );
      assert.doesNotMatch(
        source,
        /CNPLE_SAMPLE_CASES\.find\(/,
        `${relativePath} must not resolve cases from CNPLE_SAMPLE_CASES directly`,
      );
    }
  });

  it("API session, advance, and review routes resolve by findCnpleLoftCase", () => {
    const apiFiles = LIVE_RUNTIME_FILES.filter((p) => p.startsWith("src/app/api/"));
    for (const relativePath of apiFiles) {
      const source = readFileSync(join(ROOT, relativePath), "utf-8");
      assert.match(
        source,
        /findCnpleLoftCase/,
        `${relativePath} must resolve cases through findCnpleLoftCase so supplemental LOFT cases can launch`,
      );
    }
  });
});
