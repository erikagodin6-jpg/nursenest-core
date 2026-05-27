#!/usr/bin/env node
/**
 * Prints the canonical learner route files for flashcards + practice exams,
 * primary client components, duplicate filename hints, and optional Playwright smoke.
 *
 * Usage: from nursenest-core/: npm run verify:learning-routes
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const LIVE_FLASHCARDS_PAGE = "src/app/(app)/app/(learner)/flashcards/page.tsx";
const LIVE_PRACTICE_PAGE = "src/app/(app)/app/(learner)/practice-tests/page.tsx";
const PRACTICE_EXAMS_ALIAS = "src/app/(app)/app/(learner)/practice-exams/page.tsx";
const PRIMARY_FLASHCARDS_CLIENT = "src/components/flashcards/flashcards-hub-client.tsx";
const PRIMARY_PRACTICE_CLIENT = "src/components/student/practice-tests-hub-client.tsx";

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

console.log("--- NurseNest learning route trace ---\n");
console.log("Live flashcards route (GET /app/flashcards):");
console.log(`  ${LIVE_FLASHCARDS_PAGE}  exists=${exists(LIVE_FLASHCARDS_PAGE)}`);
console.log("\nLive practice exams hub (GET /app/practice-tests) — product name; not /app/practice-exams:");
console.log(`  ${LIVE_PRACTICE_PAGE}  exists=${exists(LIVE_PRACTICE_PAGE)}`);
console.log(`\nAlias /app/practice-exams → /app/practice-tests:`);
console.log(`  ${PRACTICE_EXAMS_ALIAS}  exists=${exists(PRACTICE_EXAMS_ALIAS)}`);

console.log("\nPrimary client components:");
console.log(`  flashcards: ${PRIMARY_FLASHCARDS_CLIENT}  exists=${exists(PRIMARY_FLASHCARDS_CLIENT)}`);
console.log(`  practice:   ${PRIMARY_PRACTICE_CLIENT}  exists=${exists(PRIMARY_PRACTICE_CLIENT)}`);

const marketingFlashcards = "src/app/(marketing)/(default)/flashcards/page.tsx";
const marketingPractice = "src/app/(marketing)/(default)/practice-exams/page.tsx";
console.log("\nMarketing (public SEO) — different URLs /flashcards and /practice-exams:");
console.log(`  ${marketingFlashcards}`);
console.log(`  ${marketingPractice}`);

const dupCandidates = [
  "src/components/flashcards/flashcards-hub-client.tsx",
  "src/app/(marketing)/(default)/flashcards/page.tsx",
  "src/app/(app)/app/(learner)/flashcards/custom/page.tsx",
];
console.log("\nDuplicate / alternate flashcard entry surfaces (confirm imports before deleting):");
for (const f of dupCandidates) {
  console.log(`  - ${f}`);
}

console.log("\nContract test (import / redirect wiring):");
const ct = spawnSync("npx", ["tsx", "--test", "src/lib/learner/learning-live-routes-import.contract.test.ts"], {
  cwd: root,
  stdio: "inherit",
  shell: false,
});
if (ct.status !== 0) {
  console.error("\nContract test FAILED");
  process.exit(ct.status ?? 1);
}
console.log("  learning-live-routes-import.contract.test.ts OK");

const paidEmail = process.env.E2E_PAID_EMAIL?.trim();
const paidPw = process.env.E2E_PAID_PASSWORD?.trim();
const skipE2e = process.env.VERIFY_LEARNING_ROUTES_SKIP_E2E === "1";

if (skipE2e) {
  console.log("\nPublic URL smoke tests: SKIPPED (VERIFY_LEARNING_ROUTES_SKIP_E2E=1)");
  process.exit(0);
}

if (!paidEmail || !paidPw) {
  console.log("\nPublic URL smoke tests: SKIPPED (set E2E_PAID_EMAIL + E2E_PAID_PASSWORD + DB for Playwright paid project)");
  process.exit(0);
}

console.log("\nRunning Playwright: playwright.learning-routes.config.ts …");
const pw = spawnSync(
  "npx",
  ["playwright", "test", "-c", "playwright.learning-routes.config.ts"],
  { cwd: root, stdio: "inherit", shell: false },
);
if (pw.status !== 0) {
  console.error("\nPlaywright smoke FAILED");
  process.exit(pw.status ?? 1);
}
console.log("\nPlaywright smoke OK");
