import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

test("next.config stays synchronously loadable by Next's config loader", () => {
  const nextConfig = readFileSync(join(dir, "..", "next.config.ts"), "utf8");
  assert.doesNotMatch(nextConfig, /await\s+import\(["']@sentry\/nextjs["']\)/);
  assert.match(nextConfig, /createRequire\(import\.meta\.url\)/);
  assert.match(nextConfig, /require\(["']@sentry\/nextjs["']\)/);
});
