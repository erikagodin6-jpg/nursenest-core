import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("CQIE command center route uses the live command-center loader", () => {
  const page = readRepoFile("src/app/(admin)/admin/content-command-center/page.tsx");
  assert.match(page, /loadContentQualityCommandCenter/);
  assert.match(page, /Content Quality Intelligence Engine/);
  assert.match(page, /Question analytics/);
  assert.match(page, /Scope compliance/);
});

test("CQIE loader composes all major educational surfaces into the existing quality engine", () => {
  const loader = readRepoFile("src/lib/content-quality/load-content-quality-command-center.server.ts");
  assert.match(loader, /buildContentQualityIntelligenceReport/);
  for (const surface of [
    "questionObjects",
    "flashcardObjects",
    "pathwayLessonObjects",
    "ecgObjects",
    "simulationObjects",
    "pharmacologyObjects",
    "clinicalSkillObjects",
    "studyPlanAndRemediationObjects",
  ]) {
    assert.match(loader, new RegExp(surface));
  }
});

test("CQIE admin route is discoverable and support-allowlisted", () => {
  const adminPage = readRepoFile("src/app/(admin)/admin/page.tsx");
  const policy = readRepoFile("src/lib/auth/admin-path-policy.ts");
  assert.match(adminPage, /\/admin\/content-command-center/);
  assert.match(policy, /\/admin\/content-command-center/);
});
