import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "..");

function read(relativePath: string): string {
  return readFileSync(join(root, relativePath), "utf8");
}

test("next.config stays synchronously loadable by Next's config loader", () => {
  const nextConfig = read("next.config.ts");

  // Do not use async dynamic imports in next.config.ts.
  assert.doesNotMatch(nextConfig, /await\s+import\(\s*["']@sentry\/nextjs["']\s*\)/);

  // Keep Sentry optional and synchronously loaded through createRequire.
  assert.match(nextConfig, /createRequire\(import\.meta\.url\)/);
  assert.match(nextConfig, /\brequire\(\s*["']@sentry\/nextjs["']\s*\)/);
});