import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const script = readFileSync(new URL("./audit-educational-readiness.mts", import.meta.url), "utf8");

test("educational readiness audit is exposed as an npm command", () => {
  assert.equal(
    packageJson.scripts["audit:educational-readiness"],
    "npx tsx scripts/audit-educational-readiness.mts",
  );
});

test("educational readiness audit writes both required reports", () => {
  assert.match(script, /educational-readiness-report\.json/);
  assert.match(script, /educational-readiness-report\.md/);
});

test("educational readiness audit is database-backed and failure-honest", () => {
  assert.match(script, /new PrismaClient\(\)/);
  assert.match(script, /Unable To Verify/);
  assert.match(script, /Database Unreachable/);
  assert.doesNotMatch(script, /Math\.random/);
});

test("educational readiness audit covers required learner pathways and assets", () => {
  for (const pathway of ["RN", "RPN", "NP", "RT", "ALLIED", "NEW_GRAD"]) {
    assert.match(script, new RegExp(pathway));
  }

  for (const asset of ["questions", "lessons", "flashcards", "simulations", "practiceExams", "catCoverage"]) {
    assert.match(script, new RegExp(asset));
  }
});
