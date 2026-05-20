import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("admin adaptive-summary API route contract", () => {
  it("uses requireAdmin(req) and bounded loader", () => {
    const src = readFileSync(
      join(process.cwd(), "src/app/api/admin/users/[userId]/adaptive-summary/route.ts"),
      "utf8",
    );
    assert.match(src, /requireAdmin\(req\)/);
    assert.match(src, /loadAdaptiveLearnerAdminSummary/);
  });
});
