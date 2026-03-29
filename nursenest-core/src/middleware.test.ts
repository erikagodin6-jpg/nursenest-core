import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

/**
 * Regression: Next.js 16 uses `src/proxy.ts` (not middleware.ts). Auth must run in the Edge proxy
 * with HTTP redirect to `/login` before RSC — bare `/app` must be in the matcher or the dashboard
 * could hit `redirect()` in a layout and expose raw Flight payloads in the document.
 */
test("proxy matcher includes /app and /admin roots; auth-middleware uses authorized", () => {
  const proxySrc = readFileSync(join(dir, "proxy.ts"), "utf8");
  assert.match(proxySrc, /\/app",/);
  assert.match(proxySrc, /\/admin",/);
  assert.match(proxySrc, /matcher/);

  const am = readFileSync(join(dir, "lib", "auth-middleware.ts"), "utf8");
  assert.match(am, /authorized/);
  assert.match(am, /\/app/);
});
