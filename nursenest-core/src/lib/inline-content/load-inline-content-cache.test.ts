import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..", "..");

function readSource(): string {
  return readFileSync(join(repoRoot, "src", "lib", "inline-content", "load-inline-content.ts"), "utf8");
}

test("inline content loader uses a short-lived shared cache and falls back to uncached reads", () => {
  const source = readSource();

  assert.match(source, /unstable_cache/);
  assert.match(source, /INLINE_CONTENT_SHARED_CACHE_REVALIDATE_SEC = 120/);
  assert.match(source, /loadCachedInlineContentMap/);
  assert.match(source, /catch \{\s*return loadInlineContentMapImpl\(keysJoined\);?\s*\}/);
});
