import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

test("curriculum coverage admin surface is wired to the server intelligence loader", () => {
  const pagePath = "src/app/(admin)/admin/curriculum-coverage/page.tsx";
  assert.equal(existsSync(path.join(ROOT, pagePath)), true);
  const page = read(pagePath);
  assert.match(page, /loadCurriculumCoverageDashboard/);
  assert.match(page, /Coverage score/);
  assert.match(page, /Content creation priorities/);
});

test("curriculum coverage engine includes every requested exam and competency map", () => {
  const engine = read("src/lib/curriculum-coverage/curriculum-coverage-intelligence.ts");
  for (const key of ["nclex", "rex_pn", "cnple", "hesi", "teas", "rt_competencies", "new_grad_competencies"]) {
    assert.match(engine, new RegExp(`${key}:`), `${key} curriculum definition missing`);
  }
  for (const contentType of ["questions", "flashcards", "lessons", "simulations", "ecg", "pharmacology", "clinical_skills"]) {
    assert.match(engine, new RegExp(`\"${contentType}\"`), `${contentType} coverage missing`);
  }
});

test("admin route policy allows support access to curriculum coverage", () => {
  const policy = read("src/lib/auth/admin-path-policy.ts");
  assert.match(policy, /\/admin\/curriculum-coverage/);
});
