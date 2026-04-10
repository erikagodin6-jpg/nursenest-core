/**
 * Run: `npm run test:admin-system-status` or `tsx --test src/lib/db/prisma-readiness.test.ts`
 * Avoids importing Prisma (slow / heavy) — structural check only.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const THIS_DIR = dirname(fileURLToPath(import.meta.url));

describe("prisma-readiness shared ping", () => {
  it("defines boundedSelectOne for reuse with checkDatabaseReadiness", () => {
    const path = join(THIS_DIR, "prisma-readiness.ts");
    const src = readFileSync(path, "utf8");
    assert.ok(/export async function boundedSelectOne/.test(src));
    assert.ok(/await boundedSelectOne\(timeoutMs\)/.test(src));
  });
});
