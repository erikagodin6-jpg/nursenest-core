import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ADMIN_EDIT_PUBLISH_SURFACES } from "@/lib/admin/admin-edit-publish-surface-registry";
import { syncPublishedContentItemToPathwayLessons } from "@/lib/admin/sync-content-item-to-pathway-lesson";

const here = dirname(fileURLToPath(import.meta.url));
/** From `src/lib/admin` → app package root (`nursenest-core/`). */
const nursenestCoreRoot = join(here, "../../..");

test("admin edit publish registry: unique contentType keys", () => {
  const keys = ADMIN_EDIT_PUBLISH_SURFACES.map((r) => r.contentType);
  assert.equal(new Set(keys).size, keys.length);
});

test("admin edit publish registry: every row documents storage + public loader", () => {
  for (const r of ADMIN_EDIT_PUBLISH_SURFACES) {
    assert.ok(r.storageSource.trim().length >= 6, r.contentType);
    assert.ok(r.publicLoader.trim().length >= 6, r.contentType);
    assert.ok(r.saveApi.trim().length >= 3, r.contentType);
  }
});

test("ContentItem → PathwayLesson sync bridge remains a no-op (Option B authority)", () => {
  const src = readFileSync(join(nursenestCoreRoot, "src/lib/admin/sync-content-item-to-pathway-lesson.ts"), "utf8");
  assert.match(src, /Intentional no-op/);
  assert.equal(typeof syncPublishedContentItemToPathwayLessons, "function");
});

test("canonical admin APIs exist on disk", () => {
  const paths = [
    "src/app/api/admin/pathway-lessons/[id]/route.ts",
    "src/app/api/admin/marketing-public-content/route.ts",
    "src/app/(admin)/admin/content/page-copy/page.tsx",
    "src/app/api/admin/blog/control-panel/persist-draft/route.ts",
    "src/lib/blog/publish-blog-post-canonical.ts",
  ];
  for (const rel of paths) {
    assert.ok(existsSync(join(nursenestCoreRoot, rel)), `missing ${rel}`);
  }
});

test("pathway lesson public + admin edit pages exist", () => {
  assert.ok(
    existsSync(
      join(
        nursenestCoreRoot,
        "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/page.tsx",
      ),
    ),
  );
  assert.ok(existsSync(join(nursenestCoreRoot, "src/app/(admin)/admin/pathway-lessons/edit/page.tsx")));
});

test("pathway lesson admin API documents PathwayLesson as SoT", () => {
  const api = readFileSync(join(nursenestCoreRoot, "src/app/api/admin/pathway-lessons/[id]/route.ts"), "utf8");
  assert.match(api, /PathwayLesson is the authoring source of truth/);
});
