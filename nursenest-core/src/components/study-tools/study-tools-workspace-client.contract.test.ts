import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = readFileSync(join(__dirname, "study-tools-workspace-client.tsx"), "utf8");

describe("study-tools-workspace-client", () => {
  it("renders active session via StudyToolsWorkspaceActiveItem + single switch(item.kind) (no duplicate current.kind chain)", () => {
    assert.match(SRC, /function StudyToolsWorkspaceActiveItem/);
    assert.match(SRC, /switch \(item\.kind\)/);
    assert.ok(
      !SRC.includes("switch (current.kind)"),
      "active item body must switch on the prop `item`, not outer `current`, to keep exhaustiveness stable",
    );
    const ternaryKindChecks = SRC.match(/current\.kind\s*===/g) ?? [];
    assert.ok(
      ternaryKindChecks.length <= 1,
      `expected at most one current.kind=== guard (e.g. matchingChoices); found ${ternaryKindChecks.length}`,
    );
  });
});
