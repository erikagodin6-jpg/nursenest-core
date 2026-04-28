import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, "src", path), "utf8");
}

describe("admin blog generation service contract", () => {
  it("defines canonical URL, publish mode, and structured field-error helpers", () => {
    const service = read("lib/blog/admin-blog-generation-service.ts");
    assert.match(service, /export type AdminBlogPublishMode = "draft" \| "publish_now" \| "schedule"/);
    assert.match(service, /export function adminBlogPublicUrl/);
    assert.match(service, /\/blog\/\$\{encodeURIComponent\(slug\)\}/);
    assert.match(service, /field: string/);
    assert.match(service, /sanitizedValue: string \| null/);
    assert.match(service, /suggestedFix: string/);
    assert.match(service, /postStatus: BlogPostStatus\.SCHEDULED/);
    assert.match(service, /postStatus: BlogPostStatus\.PUBLISHED/);
  });

  it("keeps admin generation routes behind the canonical service boundary", () => {
    for (const path of [
      "app/api/admin/blog/generate-ai/route.ts",
      "app/api/admin/blog/control-panel/generate/route.ts",
      "app/api/admin/blog/control-panel/persist-draft/route.ts",
      "lib/blog/blog-batch-schedule.ts",
      "lib/blog/blog-draft-generation-batch.ts",
      "lib/blog/generate-blog-ai-draft.ts",
    ]) {
      const src = read(path);
      assert.match(src, /prepareAdminBlogGenerationInput/);
    }
  });

  it("does not construct public blog URLs from raw title variables in admin generation routes", () => {
    for (const path of [
      "app/api/admin/blog/generate-ai/route.ts",
      "app/api/admin/blog/control-panel/generate/route.ts",
      "app/api/admin/blog/control-panel/persist-draft/route.ts",
    ]) {
      const src = read(path);
      assert.doesNotMatch(src, /\/blog\/\$\{(?:topic|d\.topic|rawTitle|title)\}/);
    }
  });
});
