import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { tightenPublicCap, isPublicRateLimitStrictMode } from "@/lib/config/rate-limit-tightening";

describe("rate-limit-tightening", () => {
  const prev = process.env.NN_RATE_LIMIT_STRICT_PUBLIC;

  afterEach(() => {
    if (prev === undefined) delete process.env.NN_RATE_LIMIT_STRICT_PUBLIC;
    else process.env.NN_RATE_LIMIT_STRICT_PUBLIC = prev;
  });

  it("tightenPublicCap is identity when strict mode off", () => {
    delete process.env.NN_RATE_LIMIT_STRICT_PUBLIC;
    assert.equal(isPublicRateLimitStrictMode(), false);
    assert.equal(tightenPublicCap(10), 10);
  });

  it("tightenPublicCap halves with floor 1 when strict mode on", () => {
    process.env.NN_RATE_LIMIT_STRICT_PUBLIC = "1";
    assert.equal(isPublicRateLimitStrictMode(), true);
    assert.equal(tightenPublicCap(10), 5);
    assert.equal(tightenPublicCap(3), 1);
    assert.equal(tightenPublicCap(1), 1);
  });
});
