import assert from "node:assert/strict";
import test from "node:test";

import { getProtectedRouteSession } from "./protected-route-session";

test("getProtectedRouteSession returns null when session load throws", async () => {
  const session = await getProtectedRouteSession("test.protected_route", async () => {
    throw new Error("db offline");
  });

  assert.equal(session, null);
});

test("getProtectedRouteSession returns the loaded session when auth succeeds", async () => {
  const session = await getProtectedRouteSession("test.protected_route", async () => ({
    user: { id: "user_123" },
    expires: new Date("2030-01-01T00:00:00.000Z").toISOString(),
  }));

  assert.equal((session?.user as { id?: string } | undefined)?.id, "user_123");
});
