/**
 * Query budget contracts — Phase 2 enforcement.
 *
 * Static analysis tests ensuring critical hot-path query counts stay within
 * defined budgets. No DB connection required.
 *
 * Budgets (from the database performance war room spec):
 *   Hub pages:         ≤ 5 distinct DB call sites in the page handler
 *   Activity startup:  ≤ 2 network round-trips (fetch calls) per session load
 *   Question fetch:    ≤ 3 DB calls in random-offset helper
 *   Adaptive engine:   = 2 pool queries (cards + weak topics, no pre-COUNT)
 *   CAT pool floor:    = 30 (never silently raised)
 *
 * HOW TO READ A FAILURE:
 *   The source has more DB call sites than the budget allows, or a sequential
 *   chain was added where queries should be parallelised.
 *   Fix: parallelise with Promise.all, or cache/precompute.
 *
 * HOW TO ADJUST A BUDGET:
 *   Update the limit AND add a comment explaining WHY the higher budget is
 *   acceptable. Never raise without justification.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "../..");
const REPO_ROOT = join(__dirname, "../../../../");

function read(relPath: string): string {
  return readFileSync(join(SRC, relPath), "utf8");
}

function readRepo(relPath: string): string {
  return readFileSync(join(REPO_ROOT, relPath), "utf8");
}

/**
 * Count actual DB call sites in source text.
 * Counts prisma ORM calls, raw queries, and pool queries.
 * withRetry() wrappers are NOT counted separately — the inner call is counted.
 */
function countQueryCallSites(src: string): number {
  return (
    src.match(
      /\bprisma\.\w+\.(findMany|findFirst|findUnique|count|create|update|delete|upsert|groupBy|aggregate)\s*\(|\bprisma\.\$(?:queryRaw|executeRaw)\b|\bpool\.query\s*\(/g,
    )?.length ?? 0
  );
}

/** Extracts the body of the first function matching the given signature prefix. */
function extractFunctionBody(src: string, signaturePrefix: string): string {
  const start = src.indexOf(signaturePrefix);
  if (start === -1) return "";
  let depth = 0;
  let end = start;
  for (let i = start; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  return src.slice(start, end + 1);
}

// ── Hub pages ─────────────────────────────────────────────────────────────────

test("query budget: flashcards page server component ≤ 5 DB call sites", () => {
  const src = read("app/(app)/app/(learner)/flashcards/page.tsx");
  const body = extractFunctionBody(src, "async function FlashcardsPageContent") || src;
  const count = countQueryCallSites(body);
  assert.ok(
    count <= 5,
    `FlashcardsPageContent has ${count} DB call sites — budget is 5. Parallelise or cache.`,
  );
});

test("query budget: practice tests page server component ≤ 5 DB call sites", () => {
  const src = read("app/(app)/app/(learner)/practice-tests/page.tsx");
  const count = countQueryCallSites(src);
  assert.ok(
    count <= 5,
    `PracticeTestsPage has ${count} DB call sites — budget is 5. Parallelise or cache.`,
  );
});

// ── Question fetch ────────────────────────────────────────────────────────────

test("query budget: pickQuestionIdsByRandomOffset ≤ 3 DB calls (count + primary + wrap)", () => {
  const src = read("app/api/questions/route.ts");
  const body = extractFunctionBody(src, "async function pickQuestionIdsByRandomOffset");
  if (!body) return; // function removed — budget satisfied
  const count = countQueryCallSites(body);
  assert.ok(
    count <= 3,
    `pickQuestionIdsByRandomOffset has ${count} DB calls — budget is 3. If using COUNT pre-query, convert to single ORDER BY.`,
  );
});

// ── Adaptive engine ───────────────────────────────────────────────────────────

test("query budget: adaptive engine getNextCards has no sequential COUNT pre-query", () => {
  let src: string;
  try {
    src = readRepo("server/adaptive-engine.ts");
  } catch {
    return; // file absent in this environment
  }
  const body = extractFunctionBody(src, "export async function getNextCards");
  if (!body) return;

  assert.ok(
    !body.match(/SELECT COUNT\(\*\)/i),
    "getNextCards contains a COUNT(*) pre-query — this doubles connection usage per request. Use ORDER BY RANDOM().",
  );

  const poolCalls = (body.match(/pool\.query\s*\(/g) || []).length;
  assert.ok(
    poolCalls <= 2,
    `getNextCards has ${poolCalls} pool.query calls — budget is 2 (cards + weak topics). Extra queries exhaust the connection pool.`,
  );
});

// ── Activity startup ──────────────────────────────────────────────────────────

test("query budget: practice runner loadSession ≤ 2 fetchWithRetry calls", () => {
  const src = read("components/exam/nclex-practice-runner.tsx");
  const body = extractFunctionBody(src, "async function loadSession");
  if (!body) return;
  const calls = (body.match(/\bfetchWithRetry\s*\(/g) || []).length;
  assert.ok(
    calls <= 2,
    `loadSession has ${calls} fetchWithRetry calls — budget is 2 (session hydrate + first question).`,
  );
});

test("query budget: CAT runner loadSession ≤ 2 fetchWithRetry calls", () => {
  const src = read("components/exam/nclex-cat-runner.tsx");
  const body = extractFunctionBody(src, "async function loadSession");
  if (!body) return;
  const calls = (body.match(/\bfetchWithRetry\s*\(/g) || []).length;
  assert.ok(
    calls <= 2,
    `CAT loadSession has ${calls} fetchWithRetry calls — budget is 2 (session hydrate + first question).`,
  );
});

// ── CAT pool floor ────────────────────────────────────────────────────────────

test("query budget: CAT_MIN_COMPLETE_POOL is 30 — never silently raised above proven threshold", () => {
  const src = read("lib/practice-tests/cat-readiness-floor.ts");
  const match = src.match(/CAT_MIN_COMPLETE_POOL\s*=\s*(\d+)/);
  const value = match ? Number(match[1]) : null;
  assert.equal(
    value,
    30,
    `CAT_MIN_COMPLETE_POOL is ${value} — must be 30. Raising it blocks the CAT exam for users whose pool is between ${value - 1} and 30 questions.`,
  );
});

// ── Baseline assessment ───────────────────────────────────────────────────────

test("query budget: pickRandomBaselineQuestionIds uses single DISTINCT ON query (no per-topic loop)", () => {
  const src = read("lib/baseline/baseline-assessment.ts");
  const body = extractFunctionBody(src, "export async function pickRandomBaselineQuestionIds");
  if (!body) return;

  // Must contain DISTINCT ON (original single-query approach)
  assert.ok(
    body.includes("DISTINCT ON") || body.includes("distinct on"),
    "pickRandomBaselineQuestionIds lost the DISTINCT ON query. A per-topic loop creates N+1 queries (one per distinct topic).",
  );

  // Must NOT iterate over topics to make per-topic DB calls
  const hasTopicLoop = /for\s*\(.*of\s+shuffled(?:Topics|topic)/i.test(body);
  assert.ok(
    !hasTopicLoop,
    "pickRandomBaselineQuestionIds has a per-topic for-of loop with DB calls — this is an N+1 pattern. Restore the single DISTINCT ON query.",
  );
});
