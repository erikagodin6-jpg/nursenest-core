import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { seededIndexInRange, shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";

describe("session-seeded-random", () => {
  it("seededIndexInRange is stable for the same seed and span", () => {
    assert.equal(seededIndexInRange("abc", 100), seededIndexInRange("abc", 100));
  });

  it("seededIndexInRange stays within [0, span)", () => {
    for (let span = 1; span < 50; span++) {
      const i = seededIndexInRange(`k${span}`, span);
      assert.ok(i >= 0 && i < span, `span=${span} i=${i}`);
    }
  });

  it("shuffleSeeded permutes without loss", () => {
    const keys = ["a", "b", "c", "d", "e"];
    const o = shuffleSeeded(keys, "session-salt-1");
    assert.deepEqual(new Set(o), new Set(keys));
    assert.equal(o.length, keys.length);
  });

  it("shuffleSeeded differs across session salts for the same canonical list", () => {
    const keys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"];
    const a = shuffleSeeded(keys, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:linear-pool");
    const b = shuffleSeeded(keys, "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb:linear-pool");
    assert.notDeepEqual(a, b);
  });

  it("shuffleSeeded differs for different pool-row-order salts", () => {
    const ids = Array.from({ length: 40 }, (_, i) => `id-${String(i).padStart(3, "0")}`);
    const sa = shuffleSeeded(ids, `${"a".repeat(36)}:cat-pool-row-order-v1`);
    const sb = shuffleSeeded(ids, `${"b".repeat(36)}:cat-pool-row-order-v1`);
    assert.notDeepEqual(sa, sb);
  });
});
