import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { assertPinnedAuthBasePath, PINNED_AUTH_BASE_PATH } from "./auth-base-path";

const dir = dirname(fileURLToPath(import.meta.url));
/** `src/` when tests live under `src/lib/auth/`. */
const srcRoot = join(dir, "..", "..");

test("effective NextAuth basePath is pinned to /api/auth", () => {
  assert.equal(PINNED_AUTH_BASE_PATH, "/api/auth");
  assert.doesNotThrow(() => assertPinnedAuthBasePath());
});

test("Node and Edge NextAuth configs import the same constant (no literal basePath drift)", () => {
  const authSrc = readFileSync(join(srcRoot, "lib", "auth.ts"), "utf8");
  const middlewareSrc = readFileSync(join(srcRoot, "lib", "auth-middleware.ts"), "utf8");
  assert.match(authSrc, /from ["']@\/lib\/auth\/auth-base-path["']/);
  assert.match(middlewareSrc, /from ["']@\/lib\/auth\/auth-base-path["']/);
  assert.match(authSrc, /basePath:\s*PINNED_AUTH_BASE_PATH/);
  assert.match(middlewareSrc, /basePath:\s*PINNED_AUTH_BASE_PATH/);
});
