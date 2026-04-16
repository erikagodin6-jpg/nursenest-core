/**
 * Static policy checks for DB operations docs and env validation wiring.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { readFileSync as readInstr } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const nursenestCoreRoot = join(here, "..", "..", "..");

describe("database operations doc", () => {
  it("exists and mentions backup/restore without example passwords", () => {
    const doc = readFileSync(join(nursenestCoreRoot, "docs", "database-operations.md"), "utf8");
    assert.match(doc, /Backup and restore readiness/);
    assert.match(doc, /least privilege/i);
    assert.ok(!doc.includes("postgresql://user:password"), "no fake credential URL in doc");
  });
});

describe("production DB validation wiring", () => {
  it("Node instrumentation calls validateProductionDatabaseEnv", () => {
    const reg = readInstr(join(nursenestCoreRoot, "src", "lib", "instrumentation", "register-node.ts"), "utf8");
    assert.match(reg, /validateProductionDatabaseEnv/);
  });
});
