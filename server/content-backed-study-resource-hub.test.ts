import assert from "node:assert";
import { describe, it } from "vitest";
import { normalizeBodySystemUrlKey } from "@/lib/seo/content-backed-study-resource-hub-slug";

describe("normalizeBodySystemUrlKey", () => {
  it("slugifies body system labels for URL segments", () => {
    assert.equal(normalizeBodySystemUrlKey("  Cardiovascular  "), "cardiovascular");
    assert.equal(normalizeBodySystemUrlKey("Renal & Fluid"), "renal-fluid");
  });
});
