import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const catPoolPath = join(here, "cat-pool.ts");

test("cat-pool imports Prisma as a runtime value when using Prisma.DbNull", () => {
  const source = readFileSync(catPoolPath, "utf8");
  assert.match(source, /\bPrisma\.DbNull\b/);
  assert.match(source, /import\s+\{\s*Prisma\s*\}\s+from\s+["']@prisma\/client["']/);
  assert.doesNotMatch(source, /import\s+type\s+\{\s*Prisma\s*\}\s+from\s+["']@prisma\/client["']/);
});
