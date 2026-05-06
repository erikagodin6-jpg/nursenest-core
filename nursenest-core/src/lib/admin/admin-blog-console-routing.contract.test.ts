import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, "src", path), "utf8");
}

describe("admin blog console routing", () => {
  it("keeps /admin/blog as the canonical console with the full workflow sections", () => {
    const page = read("app/(admin)/admin/blog/page.tsx");

    assert.match(page, /AdminBlogControlPanelClient/);
    assert.match(page, /Generate blog draft/);
    assert.match(page, /Draft review\/edit/);
    assert.match(page, /SEO fields\/title\/slug\/meta description/);
    assert.match(page, /Schedule publish date\/time/);
    assert.match(page, /Publish now/);
    assert.match(page, /Scheduled\/queued posts with status/);
    assert.match(page, /Error\/failure messages/);
  });

  it("redirects duplicate admin blog generator and scheduler routes to /admin/blog", () => {
    for (const path of [
      "app/(admin)/admin/blog/control-panel/page.tsx",
      "app/(admin)/admin/blog/generate/page.tsx",
      "app/(admin)/admin/blog/gemini-draft/page.tsx",
      "app/(admin)/admin/blog/scheduler/page.tsx",
      "app/(admin)/admin/blog/studio/page.tsx",
    ]) {
      const page = read(path);
      assert.match(page, /from "next\/navigation"/);
      assert.match(page, /redirect\((["'`])\/admin\/blog/);
    }
  });

  it("exposes only one sidebar Blog entry", () => {
    const sidebar = read("components/admin/admin-sidebar-nav.tsx");
    assert.equal((sidebar.match(/label: "Blog"/g) ?? []).length, 1);
    assert.doesNotMatch(sidebar, /Blog AI panel|Blog library/);
  });
});
