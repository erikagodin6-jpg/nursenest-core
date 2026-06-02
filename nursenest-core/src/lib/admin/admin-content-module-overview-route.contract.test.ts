import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("admin content overview route contract", () => {
  it("enforces admin authorization server-side", () => {
    const routeSource = readFileSync(
      join(process.cwd(), "src/app/(admin)/admin/content-overview/page.tsx"),
      "utf8",
    );

    assert.match(routeSource, /import\s+\{\s*requireAdmin\s*\}/);
    assert.match(routeSource, /await\s+requireAdmin\(\)/);
    assert.match(routeSource, /loadAdminContentModuleOverview/);
  });
});
