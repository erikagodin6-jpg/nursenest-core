import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

/**
 * Regression: `getProtectedRouteSession` must not skip the JWT cookie fallback when `auth()` throws
 * or times out — otherwise signed-in staff pass the proxy but `requireAdmin` redirects to `/login`.
 */
test("protected-route-session: bounded auth read + JWT fallback outside primary-only catch", () => {
  const src = readFileSync(join(dir, "protected-route-session.ts"), "utf8");
  assert.match(src, /safeAwait\(/);
  assert.match(src, /AUTH_NODE_SESSION_READ_TIMEOUT_MS/);
  assert.match(src, /getAuthSessionWithJwtCookieFallback/);
  assert.match(src, /if \(loadSession\) return null/);
  assert.match(src, /protected_route_jwt_fallback_failed/);
});

test("auth-callbacks: session.user.id falls back to legacy JWT id when sub is empty", () => {
  const src = readFileSync(join(dir, "..", "auth-callbacks.ts"), "utf8");
  assert.match(src, /fromLegacyId/);
  assert.match(src, /fromSub \|\| fromLegacyId/);
});
