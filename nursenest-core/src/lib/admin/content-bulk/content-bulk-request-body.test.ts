import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  contentBulkBlogBodySchema,
  contentBulkEnqueueBodySchema,
  contentBulkUtilityEnqueueSchema,
} from "@/lib/admin/content-bulk/content-bulk-request-body";

describe("content-bulk-request-body (module init / ZodObject.extend parity)", () => {
  it("imports without throwing (regression: ZodEffects has no .extend)", () => {
    assert.equal(typeof contentBulkBlogBodySchema.safeParse, "function");
    assert.equal(typeof contentBulkEnqueueBodySchema.safeParse, "function");
    assert.equal(typeof contentBulkUtilityEnqueueSchema.safeParse, "function");
  });

  it("enqueue schema accepts confirmation + blog body", () => {
    const r = contentBulkEnqueueBodySchema.safeParse({
      operation: "blog_seo_bundle_refresh",
      filters: { slugs: ["hello-world"] },
      confirmation: "CONFIRM_BULK_WRITE",
    });
    assert.equal(r.success, true);
  });

  it("blog body schema still applies taxonomy refinement", () => {
    const bad = contentBulkBlogBodySchema.safeParse({
      operation: "blog_assign_taxonomy",
      filters: { slugs: ["x"] },
      taxonomy: { tags: [] },
    });
    assert.equal(bad.success, false);
  });
});
