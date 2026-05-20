import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { JWT } from "next-auth/jwt";
import {
  JWT_SESSION_BRIEF_MAX_AGE_SEC,
  JWT_SESSION_REMEMBER_ABSOLUTE_CAP_SEC,
  JWT_SESSION_REMEMBER_MAX_AGE_SEC,
  JWT_SESSION_UPDATE_AGE_SEC,
} from "@/lib/auth/auth-session-constants";
import { rollSlidingJwtExpiry } from "@/lib/auth/jwt-session-slide";

describe("rollSlidingJwtExpiry", () => {
  const now = 1_700_000_000;

  it("does not extend brief (non-remember) sessions", () => {
    const login = now - JWT_SESSION_UPDATE_AGE_SEC - 3600;
    const token = {
      sub: "u1",
      rememberLong: false,
      loginAtSec: login,
      activityRollAtSec: login,
      exp: login + JWT_SESSION_BRIEF_MAX_AGE_SEC,
    } as JWT;
    rollSlidingJwtExpiry(token, now);
    assert.equal(token.exp, login + JWT_SESSION_BRIEF_MAX_AGE_SEC);
    assert.equal(token.activityRollAtSec, now);
  });

  it("extends remember sessions after updateAge idle, capped by absolute ceiling", () => {
    const login = now - JWT_SESSION_UPDATE_AGE_SEC - 3600;
    const token = {
      sub: "u2",
      rememberLong: true,
      loginAtSec: login,
      activityRollAtSec: login,
      exp: now + 3600,
    } as JWT;
    rollSlidingJwtExpiry(token, now);
    const expectedCap = login + JWT_SESSION_REMEMBER_ABSOLUTE_CAP_SEC;
    const expectedProposed = now + JWT_SESSION_REMEMBER_MAX_AGE_SEC;
    assert.equal(token.exp, Math.min(expectedProposed, expectedCap));
    assert.equal(token.activityRollAtSec, now);
  });

  it("no-ops when within updateAge since last roll", () => {
    const login = now - 1000;
    const prevExp = now + 86400;
    const token = {
      sub: "u3",
      rememberLong: true,
      loginAtSec: login,
      activityRollAtSec: now - 100,
      exp: prevExp,
    } as JWT;
    rollSlidingJwtExpiry(token, now);
    assert.equal(token.exp, prevExp);
  });

  it("no-ops when token already expired", () => {
    const token = {
      sub: "u4",
      rememberLong: true,
      loginAtSec: now - 10_000,
      activityRollAtSec: now - 10_000,
      exp: now - 1,
    } as JWT;
    rollSlidingJwtExpiry(token, now);
    assert.equal(token.exp, now - 1);
  });
});
