import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const panelPath = join(here, "admin-demo-users-panel.tsx");

describe("AdminDemoUsersPanel — create guard", () => {
  const src = readFileSync(panelPath, "utf8");

  it("requires window.confirm before POSTing demo user creation", () => {
    assert.match(src, /window\.confirm/);
    assert.match(src, /demo learner/i);
  });
});
