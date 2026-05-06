#!/usr/bin/env node
/**
 * Static wiring checks for learner learning surfaces (no DB).
 * Fails fast when catalog / flashcard / blog / scenario / internal-course hooks drift.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function read(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) throw new Error(`missing: ${rel}`);
  return readFileSync(p, "utf8");
}

const errors = [];

function mustInclude(rel, needle, label) {
  const s = read(rel);
  if (!s.includes(needle)) errors.push(`${label}: expected "${needle}" in ${rel}`);
}

try {
  mustInclude(
    "src/lib/lessons/pathway-lesson-catalog-sync.ts",
    "rn-nclex-exam-notes-integration-batch4-catalog.json",
    "Lessons batch4 catalog merge",
  );
  mustInclude(
    "src/lib/flashcards/build-flashcard-custom-session.ts",
    "loadExamQuestionRowsForFlashcardPool",
    "Flashcards session uses exam pool loader",
  );
  mustInclude(
    "src/lib/flashcards/build-flashcard-custom-session.ts",
    "loadExamQuestionHubInventoryForPathway",
    "Flashcards hub inventory uses exam bank aggregates",
  );
  mustInclude("src/app/api/flashcards/custom-session/route.ts", "pathwayId is required", "Flashcards API requires pathwayId");
  mustInclude("src/lib/blog/blog-visibility.ts", "blogPostIsLive", "Blog live visibility helper");
  mustInclude(
    "src/lib/clinical-scenarios/clinical-scenario-learner-layout-gate.server.ts",
    "premium",
    "Clinical scenario gate (premium / access)",
  );
  mustInclude("src/lib/internal-courses/surface-visibility.test.ts", "internal", "Internal courses visibility tests");
} catch (e) {
  errors.push(String(e));
}

if (errors.length) {
  console.error("[verify-learning-surfaces] FAILED\n", errors.join("\n"));
  process.exit(1);
}
console.log("[verify-learning-surfaces] OK");
