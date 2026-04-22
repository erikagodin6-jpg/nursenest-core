import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterCardsByProgressFlags,
  parseCustomSessionSourceKind,
  prismaWhereForSourceKind,
} from "@/lib/flashcards/custom-session-card-filters";

describe("custom-session-card-filters", () => {
  it("parseCustomSessionSourceKind", () => {
    assert.equal(parseCustomSessionSourceKind(null), "all");
    assert.equal(parseCustomSessionSourceKind("LESSON"), "lesson");
    assert.equal(parseCustomSessionSourceKind("bogus"), "all");
  });

  it("prismaWhereForSourceKind", () => {
    assert.equal(prismaWhereForSourceKind("all"), null);
    assert.deepEqual(prismaWhereForSourceKind("lesson"), { lessonId: { not: null } });
  });

  it("filterCardsByProgressFlags notStudiedOnly", () => {
    const cards = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const map = new Map([
      ["a", { flashcardId: "a", lastQuality: 4, repetitions: 3, lastReviewedAt: new Date() }],
      ["b", { flashcardId: "b", lastQuality: null, repetitions: 0, lastReviewedAt: null }],
    ]);
    const out = filterCardsByProgressFlags(cards, map, {
      notStudiedOnly: true,
      recentStudiedOnly: false,
      recentWindowMs: 7 * 86_400_000,
      nowMs: Date.now(),
    });
    assert.deepEqual(out.map((c) => c.id).sort(), ["b", "c"].sort());
  });

  it("filterCardsByProgressFlags recentStudiedOnly", () => {
    const now = Date.now();
    const cards = [{ id: "x" }, { id: "y" }];
    const map = new Map([
      ["x", { flashcardId: "x", lastQuality: 4, repetitions: 2, lastReviewedAt: new Date(now - 86_400_000) }],
      ["y", { flashcardId: "y", lastQuality: 4, repetitions: 2, lastReviewedAt: new Date(now - 10 * 86_400_000) }],
    ]);
    const out = filterCardsByProgressFlags(cards, map, {
      notStudiedOnly: false,
      recentStudiedOnly: true,
      recentWindowMs: 2 * 86_400_000,
      nowMs: now,
    });
    assert.deepEqual(out.map((c) => c.id), ["x"]);
  });
});
