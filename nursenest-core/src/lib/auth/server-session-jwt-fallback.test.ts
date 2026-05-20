import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Session } from "next-auth";
import { sessionHasUserIdentity } from "./server-session-jwt-fallback";

describe("sessionHasUserIdentity", () => {
  it("returns false for null or empty id+email", () => {
    assert.equal(sessionHasUserIdentity(null), false);
    assert.equal(sessionHasUserIdentity(undefined), false);
    assert.equal(
      sessionHasUserIdentity({
        expires: new Date().toISOString(),
        user: { id: "", email: "", name: "", role: "LEARNER", country: "US", tier: "RN" },
      } as Session),
      false,
    );
  });

  it("returns true when id or email is present", () => {
    assert.equal(
      sessionHasUserIdentity({
        expires: new Date().toISOString(),
        user: {
          id: "usr_1",
          email: "",
          name: "A",
          role: "ADMIN",
          country: "CA",
          tier: "RN",
        },
      } as Session),
      true,
    );
    assert.equal(
      sessionHasUserIdentity({
        expires: new Date().toISOString(),
        user: {
          id: "",
          email: "a@b.co",
          name: "A",
          role: "LEARNER",
          country: "US",
          tier: "RN",
        },
      } as Session),
      true,
    );
  });
});
