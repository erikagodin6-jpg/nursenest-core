import assert from "node:assert/strict";
import test from "node:test";
import {
  checkRedisFixedWindowLimit,
  credentialsLoginBurstRedisKey,
  credentialsLoginComboRedisKey,
} from "@/lib/server/credentials-login-rate-limit";

test("credentials RL Redis key shapes are stable for operators and scripts", () => {
  assert.equal(credentialsLoginBurstRedisKey("203.0.113.1"), "ratelimit:auth:credentials_login:burst:ip:203.0.113.1");
  assert.equal(
    credentialsLoginComboRedisKey("203.0.113.1", "abc123def456"),
    "ratelimit:auth:credentials_login:combo:ip:203.0.113.1:acct:abc123def456",
  );
});

test("checkRedisFixedWindowLimit coerces bigint incr to number (Upstash-safe)", async () => {
  const redis = {
    async incr() {
      return BigInt(2);
    },
    async expire() {
      return 1;
    },
  };
  const r = await checkRedisFixedWindowLimit("ratelimit:test:bigint", { windowMs: 60_000, max: 5, redis });
  assert.equal(r.ok, true);
  assert.equal(r.remaining, 3);
});
