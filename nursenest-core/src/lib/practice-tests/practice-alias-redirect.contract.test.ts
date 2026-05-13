/**
 * Learner `/app/practice` remains a redirect-only alias to `/app/practice-tests` (G-018 documentation guard).
 */
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
/** `src/` — same layout as {@link import("../seo/sitemap-merged-route.test.js") sitemap-merged-route.test.ts}. */
const srcRoot = join(here, "..", "..");
const pagePath = join(srcRoot, "app", "(student)", "app", "(learner)", "practice", "page.tsx");
const examsPagePath = join(srcRoot, "app", "(student)", "app", "(learner)", "exams", "page.tsx");

test("practice alias page redirects to practice-tests preserving search string construction", () => {
  const src = readFileSync(pagePath, "utf8");
  assert.match(src, /redirect\(/);
  assert.match(src, /\/app\/practice-tests/);
  assert.ok(src.includes("URLSearchParams"), "must forward query params");
});

test("exams alias page redirects to premium practice-tests preserving query params", () => {
  const src = readFileSync(examsPagePath, "utf8");
  assert.match(src, /redirect\(/);
  assert.match(src, /\/app\/practice-tests/);
  assert.ok(src.includes("URLSearchParams"), "must forward query params");
  assert.ok(src.includes("startMode"), "must preserve practice-exam intent for legacy /app/exams visits");
});
