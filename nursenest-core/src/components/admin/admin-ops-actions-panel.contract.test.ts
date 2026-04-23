import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const panelPath = join(here, "admin-ops-actions-panel.tsx");

describe("AdminOpsActionsPanel — production guard", () => {
  const src = readFileSync(panelPath, "utf8");

  it("requires window.confirm before high-impact ops POST", () => {
    assert.match(src, /window\.confirm/);
    assert.match(src, /OPS_CONFIRM_ACTIONS/);
    assert.match(src, /run_job_worker/);
    assert.match(src, /run_blog_publish_scheduler/);
  });
});
