/**
 * Run: `node --import tsx --test src/lib/marketing/adaptive-learning-marketing-import-guard.test.ts`
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const BANNED = "@/lib/adaptive-learning";

function walkTsFiles(dir: string, acc: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const p = join(dir, name);
    const st = statSync(p, { throwIfNoEntry: false });
    if (!st) continue;
    if (st.isDirectory()) walkTsFiles(p, acc);
    else if (name.endsWith(".tsx") || name.endsWith(".ts")) acc.push(p);
  }
  return acc;
}

test("marketing app tree does not import @/lib/adaptive-learning", () => {
  const root = join(process.cwd(), "src/app/(marketing)");
  const files = walkTsFiles(root);
  const hits: string[] = [];
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    if (src.includes(BANNED)) hits.push(f.replace(process.cwd() + "/", ""));
  }
  assert.deepEqual(
    hits,
    [],
    `Marketing routes must not pull learner-only adaptive-learning into the marketing bundle.\n${hits.join("\n")}`,
  );
});
