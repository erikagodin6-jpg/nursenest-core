import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

/**
 * Contract: RSC JWT fallback must see session cookies even when `headers()` omits the raw `Cookie`
 * header — `@auth/core` `getToken` only parses `Cookie` string (see `node_modules/@auth/core/jwt.js`).
 *
 * Implementation must route hydration through `ensureCookieHeaderForJwtRead` so behavior is
 * unit-tested in `jwt-read-cookie-header-merge.test.ts` and cannot drift.
 */
test("server-session-jwt-fallback uses shared ensureCookieHeaderForJwtRead + cookies() getAll", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(join(dir, "server-session-jwt-fallback.ts"), "utf8");
  assert.match(src, /from "next\/headers"/);
  assert.match(src, /ensureCookieHeaderForJwtRead/);
  assert.match(src, /getAll\(\)/);
});

test("guards: requireAdmin logs redirect-to-login under ADMIN_ACCESS_DEBUG only", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  const guards = readFileSync(join(dir, "guards.ts"), "utf8");
  assert.match(guards, /requireAdmin_redirect_login/);
  assert.match(guards, /adminAccessDebug\(\)/);
});

test("jwt fallback emits jwt_fallback_rsc_read when ADMIN_ACCESS_DEBUG", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(join(dir, "server-session-jwt-fallback.ts"), "utf8");
  assert.match(src, /jwt_fallback_rsc_read/);
  assert.match(src, /adminJwtReadDebug/);
});
