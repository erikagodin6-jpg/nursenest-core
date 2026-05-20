import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const actionsPath = join(here, "../../app/(admin)/admin/feedback/actions.ts");

describe("admin feedback actions — mutation contract", () => {
  const src = readFileSync(actionsPath, "utf8");

  it("returns structured AdminMutationResult on invalid input (no silent void)", () => {
    assert.match(src, /AdminMutationResult/);
    assert.match(src, /return \{ ok: false/);
    assert.equal(src.includes("Promise<void>"), false);
  });

  it("failure branches use required code + message (not legacy error field)", () => {
    const failBlocks = src.match(/return\s*\{\s*ok:\s*false[^}]+}/g) ?? [];
    assert.ok(failBlocks.length > 0);
    for (const b of failBlocks) {
      assert.match(b, /code:\s*"/, b);
      assert.match(b, /message:\s*"/, b);
      assert.equal(b.includes("error:"), false, `unexpected error field in: ${b}`);
    }
  });

  it("maps Prisma record-not-found to a user-facing failure (P2025)", () => {
    assert.match(src, /P2025/);
    assert.match(src, /feedback_not_found/);
  });
});
