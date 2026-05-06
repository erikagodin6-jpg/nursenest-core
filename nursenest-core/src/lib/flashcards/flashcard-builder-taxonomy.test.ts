import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyCountsToBuilderCategories,
  builderCategoryOptionsForPathway,
  coalesceExamInventoryCountsOntoPathwayHubRows,
  resolveBuilderCategoryId,
} from "@/lib/flashcards/flashcard-builder-taxonomy";

describe("coalesceExamInventoryCountsOntoPathwayHubRows", () => {
  it("maps taxonomy classifier keys onto RN/PN hub row ids (renal_genitourinary → renal_urinary)", () => {
    const coalesced = coalesceExamInventoryCountsOntoPathwayHubRows("ca-rn-nclex-rn", {
      renal_genitourinary: 42,
      cardiovascular: 3,
    });
    assert.equal(coalesced.renal_urinary, 42);
    assert.equal(coalesced.cardiovascular, 3);
    assert.equal(coalesced.renal_genitourinary, undefined);
  });
});

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
    assert.equal(orphan?.title, "Legacy Orphan Topic Key");
  });

  it("hub_inventory lists full pathway skeleton even when counts are empty (flashcards hub / lessons IA)", () => {
    const skeleton = builderCategoryOptionsForPathway("ca-rn-nclex-rn");
    const opts = applyCountsToBuilderCategories("ca-rn-nclex-rn", {});
    assert.equal(opts.length, skeleton.length);
    assert.ok(opts.length > 5);
    assert.ok(opts.every((c) => c.count === 0));
  });

  it("non_empty_only returns empty when there are no positive counts", () => {
    assert.deepEqual(
      applyCountsToBuilderCategories("us-rn-nclex-rn", {}, { listMode: "non_empty_only" }),
      [],
    );
  });
});

describe("resolveBuilderCategoryId", () => {
  it("uses exam question bodySystem/topic to bias classification", () => {
    const id = resolveBuilderCategoryId({
      label: "General",
      topicCode: null,
      pathwayId: "ca-rn-nclex-rn",
      deckTitle: null,
      front: "Sample",
      back: "Back",
      examBodySystem: "Cardiovascular",
      examTopic: "Heart failure",
    });
    assert.equal(id, "cardiovascular");
  });
});
