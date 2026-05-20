import assert from "node:assert/strict";
import test from "node:test";
import { runGuardrailValidation } from "./validate-exam-content-guardrails.mjs";

const baseCatalog = `{
  "ca-rpn-rex-pn": {
    "title": "REx-PN prep"
  },
  "us-rn-nclex-rn": {
    "title": "US RN prep"
  },
  "us-lpn-nclex-pn": {
    "title": "US PN prep"
  },
  "us-np-fnp": {
    "title": "US NP prep"
  }
}`;

const baseTerminology = `
const PROFILES = {
  CANADA_PN: {
    pn_exam_short: "REx-PN",
    unlicensed_assistive: "UCP"
  },
  CANADA_RN: {},
  US_PN: {
    pn_exam_short: "NCLEX-PN",
    unlicensed_assistive: "UAP"
  },
  US_RN: {}
};
`;

test("guardrail validation catches cross-region wording in scoped slices", () => {
  const catalogText = baseCatalog.replace('"REx-PN prep"', '"REx-PN prep with NCLEX-PN and UAP language"');
  const terminologySourceText = baseTerminology.replace('"REx-PN"', '"NCLEX-PN"');
  const result = runGuardrailValidation({
    catalogText,
    terminologySourceText,
    catalogFilePath: "/tmp/catalog.json",
    terminologyFilePath: "/tmp/terminology.ts",
  });
  assert.ok(result.failures.length > 0);
  assert.ok(result.failures.some((line) => line.includes("ca-pn-nclex-pn")));
  assert.ok(result.failures.some((line) => line.includes("terminology-ca-pn-us-terms")));
});

test("guardrail validation passes clean scoped content", () => {
  const result = runGuardrailValidation({
    catalogText: baseCatalog,
    terminologySourceText: baseTerminology,
    catalogFilePath: "/tmp/catalog.json",
    terminologyFilePath: "/tmp/terminology.ts",
  });
  assert.deepEqual(result.failures, []);
  assert.ok(result.checkedRules.length >= 2);
});
