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
  afterEach(() => {
    clearLoginFailures("k-test-lockout");
  });

  it("locks after MAX_ATTEMPTS failures and clears after clearLoginFailures", () => {
    const key = "k-test-lockout";
    for (let i = 0; i < 4; i += 1) recordLoginFailure(key);
    assert.equal(isLoginLocked(key).locked, false);
    recordLoginFailure(key);
    assert.equal(isLoginLocked(key).locked, true);
    assert.ok(isLoginLocked(key).remainingMs > 0);
    clearLoginFailures(key);
    assert.equal(isLoginLocked(key).locked, false);
  });

  it("exposes CAPTCHA_THRESHOLD before full lockout", () => {
    assert.equal(CAPTCHA_THRESHOLD, 3);
    const key = "k-test-lockout";
    assert.equal(getFailureCount(key), 0);
    recordLoginFailure(key);
    recordLoginFailure(key);
    assert.equal(getFailureCount(key), 2);
  });
});
