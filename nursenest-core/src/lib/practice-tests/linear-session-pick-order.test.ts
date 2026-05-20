import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { linearSessionPickOrder, PRACTICE_TEST_MIN_Q } from "@/lib/practice-tests/linear-session-pick-order";

describe("linearSessionPickOrder (seeded linear pool)", () => {
  const pool = ["q01", "q02", "q03", "q04", "q05", "q06", "q07", "q08", "q09", "q10", "q11", "q12"];
  const saltA = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const saltB = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

  it("same pool + same salt ⇒ identical order (deterministic)", () => {
    const a = linearSessionPickOrder(pool, 8, saltA);
    const b = linearSessionPickOrder(pool, 8, saltA);
    assert.deepEqual(a, b);
  });

  it("same pool + different salts ⇒ different order when the pool is large enough", () => {
    const oa = linearSessionPickOrder(pool, 12, saltA);
    const ob = linearSessionPickOrder(pool, 12, saltB);
    assert.notDeepEqual(oa, ob);
    assert.deepEqual(new Set(oa), new Set(pool));
    assert.deepEqual(new Set(ob), new Set(pool));
  });

  it("never drops or duplicates ids; length respects min session floor and pool cap", () => {
    const picked = linearSessionPickOrder(pool, 100, saltA);
    assert.equal(picked.length, pool.length);
    assert.deepEqual(new Set(picked).size, picked.length);
    const small = ["a", "b", "c"];
    const p2 = linearSessionPickOrder(small, 20, saltA);
    assert.deepEqual(new Set(p2), new Set(small));
    assert.equal(p2.length, small.length);
  });

  it("requested count below pool size returns first N in seeded order (stable)", () => {
    const full = linearSessionPickOrder(pool, 12, saltA);
    const sub = linearSessionPickOrder(pool, 5, saltA);
    assert.equal(sub.length, 5);
    assert.deepEqual(sub, full.slice(0, 5));
  });

  it("salt shorter than 8 chars falls back to non-seeded path (still returns bounded slice)", () => {
    const short = "short";
    const a = linearSessionPickOrder(pool, PRACTICE_TEST_MIN_Q, short);
    assert.equal(a.length, PRACTICE_TEST_MIN_Q);
    assert.deepEqual(new Set(a).size, a.length);
    for (const id of a) assert.ok(pool.includes(id));
  });
});
