import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";

describe("getOptionalPublicSession", () => {
  it("returns null without calling auth when the secret is missing", async () => {
    const previousAuthSecret = process.env.AUTH_SECRET;
    const previousNextAuthSecret = process.env.NEXTAUTH_SECRET;
    delete process.env.AUTH_SECRET;
    delete process.env.NEXTAUTH_SECRET;

    let called = false;
    try {
      const session = await getOptionalPublicSession(
        { pathname: "/us/rn/nclex-rn", surface: "marketing.exam_hub" },
        async () => {
          called = true;
          return { user: { id: "user_123" } };
        },
      );

      assert.equal(session, null);
      assert.equal(called, false);
    } finally {
      if (previousAuthSecret === undefined) delete process.env.AUTH_SECRET;
      else process.env.AUTH_SECRET = previousAuthSecret;
      if (previousNextAuthSecret === undefined) delete process.env.NEXTAUTH_SECRET;
      else process.env.NEXTAUTH_SECRET = previousNextAuthSecret;
    }
  });

  it("returns the session when auth succeeds", async () => {
    const previousAuthSecret = process.env.AUTH_SECRET;
    process.env.AUTH_SECRET = "test-secret";

    const session = await getOptionalPublicSession(
      { pathname: "/us/rn/nclex-rn", surface: "marketing.exam_hub" },
      async () => ({ user: { id: "user_123" } }),
    );

    try {
      assert.deepEqual(session, { user: { id: "user_123" } });
    } finally {
      if (previousAuthSecret === undefined) delete process.env.AUTH_SECRET;
      else process.env.AUTH_SECRET = previousAuthSecret;
    }
  });

  it("returns null when auth throws on a public route", async () => {
    const previousAuthSecret = process.env.AUTH_SECRET;
    process.env.AUTH_SECRET = "test-secret";

    const session = await getOptionalPublicSession(
      { pathname: "/us/rn/nclex-rn", surface: "marketing.exam_hub" },
      async () => {
        throw new Error("AUTH_SECRET missing");
      },
    );

    try {
      assert.equal(session, null);
    } finally {
      if (previousAuthSecret === undefined) delete process.env.AUTH_SECRET;
      else process.env.AUTH_SECRET = previousAuthSecret;
    }
  });
});
