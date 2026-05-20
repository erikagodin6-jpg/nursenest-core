import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

describe("admin mutation intent enforcement (contract)", () => {
  it("requires confirm/dryRun for question bulk-import apply path", () => {
    const src = read("app/api/admin/questions/bulk-import/route.ts");
    assert.match(src, /parseAdminJsonMutationIntent/);
    assert.match(src, /if\s*\(\s*!dryRun\s*\)/);
  });

  it("requires mutation intent for media batch-scan writes", () => {
    const src = read("app/api/admin/media/batch-scan/route.ts");
    assert.match(src, /parseAdminJsonMutationIntent/);
    assert.match(src, /intent\.dryRun/);
  });

  it("requires confirmIntent on admin media upload", () => {
    const src = read("app/api/admin/media/upload/route.ts");
    assert.match(src, /confirmIntent/);
    assert.match(src, /admin-media-upload-confirm/);
  });

  it("requires mutation intent for blog draft-batch process", () => {
    const src = read("app/api/admin/blog/draft-batch/[id]/process/route.ts");
    assert.match(src, /parseAdminJsonMutationIntent/);
  });

  it("requires mutation intent for blog generation job tick", () => {
    const src = read("app/api/admin/blog/generation-jobs/[id]/tick/route.ts");
    assert.match(src, /parseAdminJsonMutationIntent/);
  });
});

describe("admin user analytics demo exclusion (contract)", () => {
  it("SQL aggregates exclude demo users", () => {
    const src = read("lib/admin/load-admin-user-analytics.ts");
    assert.match(src, /is_demo_user"\s*=\s*false/);
  });
});
