import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyCountsToBuilderCategories } from "@/lib/flashcards/flashcard-builder-taxonomy";

describe("applyCountsToBuilderCategories", () => {
  it("includes dynamic category ids that are not in the static pathway config (prevents empty categoryOptions)", () => {
    const opts = applyCountsToBuilderCategories("us-rn-nclex-rn", {
      cardiovascular: 2,
      legacy_orphan_topic_key: 5,
    });
    const ids = new Set(opts.map((o) => o.id));
    assert.ok(ids.has("cardiovascular"));
    assert.ok(ids.has("legacy_orphan_topic_key"));
    const orphan = opts.find((o) => o.id === "legacy_orphan_topic_key");
    assert.equal(orphan?.count, 5);
    assert.match(orphan?.title ?? "", /Legacy/);
  });

  it("returns empty array when there are no positive counts", () => {
    assert.deepEqual(applyCountsToBuilderCategories("us-rn-nclex-rn", {}), []);
  });
});
