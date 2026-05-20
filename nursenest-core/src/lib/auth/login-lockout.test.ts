/**
 * Progressive lockout after repeated failed credential attempts (per hashed identifier or IP fallback).
 */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  CAPTCHA_THRESHOLD,
  clearLoginFailures,
  getFailureCount,
  isLoginLocked,
  recordLoginFailure,
} from "@/lib/auth/login-lockout";

describe("login lockout", () => {
  afterEach(async () => {
    await clearLoginFailures("k-test-lockout");
  });

  it("locks after MAX_ATTEMPTS failures and clears after clearLoginFailures", async () => {
    const key = "k-test-lockout";
    for (let i = 0; i < 4; i += 1) await recordLoginFailure(key);
    assert.equal((await isLoginLocked(key)).locked, false);
    await recordLoginFailure(key);
    assert.equal((await isLoginLocked(key)).locked, true);
    assert.ok((await isLoginLocked(key)).remainingMs > 0);
    await clearLoginFailures(key);
    assert.equal((await isLoginLocked(key)).locked, false);
  });

  it("exposes CAPTCHA_THRESHOLD before full lockout", async () => {
    assert.equal(CAPTCHA_THRESHOLD, 3);
    const key = "k-test-lockout";
    assert.equal(await getFailureCount(key), 0);
    await recordLoginFailure(key);
    await recordLoginFailure(key);
    assert.equal(await getFailureCount(key), 2);
  });
});
