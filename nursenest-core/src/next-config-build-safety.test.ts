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

test("next.config.mjs stays synchronously loadable and enforces single-worker build tuning", () => {
  const nextConfig = read("next.config.mjs");

  assert.doesNotMatch(nextConfig, /await\s+import\(\s*["']@sentry\/nextjs["']\s*\)/);
  assert.doesNotMatch(nextConfig, /\beslint\s*:\s*\{/);

  assert.match(nextConfig, /cpus:\s*1/);
  assert.match(nextConfig, /workerThreads:\s*false/);
  assert.match(nextConfig, /webpackBuildWorker:\s*false/);
  assert.match(nextConfig, /staticGenerationMaxConcurrency:\s*1/);
  assert.match(nextConfig, /const\s+webpackParallelism\s*=\s*1/);
  assert.match(nextConfig, /config\.parallelism\s*=\s*webpackParallelism/);
});