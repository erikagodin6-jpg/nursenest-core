import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "node:test";
import { GUIDED_PRACTICE_ORDER_SEED_SUFFIX } from "@/lib/practice-tests/cat-session-seed-suffixes";
import { shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";

describe("guided practice question order (session entropy)", () => {
  it("two sessions with different UUID seeds produce mostly distinct orderings", () => {
    const poolIds = Array.from({ length: 16 }, (_, i) => `question-${String(i).padStart(3, "0")}`);
    const orders = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const seed = randomUUID();
      const shuffled = shuffleSeeded([...poolIds], `${seed}${GUIDED_PRACTICE_ORDER_SEED_SUFFIX}`);
      orders.add(shuffled.join("\0"));
    }
    assert.ok(orders.size >= 48, "expected mostly unique permutations across UUID seeds");
  });

  it("shuffles the full candidate id list before slicing (not raw query order)", () => {
    const sortedIds = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const seed = "22222222-2222-4222-8222-222222222222";
    const shuffled = shuffleSeeded([...sortedIds], `${seed}${GUIDED_PRACTICE_ORDER_SEED_SUFFIX}`);
    assert.deepEqual(new Set(shuffled), new Set(sortedIds));
    assert.notDeepEqual(shuffled, sortedIds);
    const run = shuffled.slice(0, 4);
    assert.equal(run.length, 4);
    assert.ok(run.every((id) => sortedIds.includes(id)));
  });
});
