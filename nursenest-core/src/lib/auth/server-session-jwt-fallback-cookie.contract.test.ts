import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

/**
 * Contract: RSC JWT fallback must see session cookies even when `headers()` omits the raw `Cookie`
 * header — `@auth/core` `getToken` only parses `Cookie` string (see `node_modules/@auth/core/jwt.js`).
 */
test("server-session-jwt-fallback hydrates Cookie from cookies() when the header bag has no Cookie", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(join(dir, "server-session-jwt-fallback.ts"), "utf8");
  assert.match(src, /from "next\/headers"/);
  assert.match(src, /\bcookies\b/);
  assert.match(src, /get\("cookie"\)/);
  assert.match(src, /getAll\(\)/);
});
