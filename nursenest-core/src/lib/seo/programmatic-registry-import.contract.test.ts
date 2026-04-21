import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

test("programmatic-registry does not static-import page payload modules", () => {
  const src = readFileSync(join(dir, "programmatic-registry.ts"), "utf8");
  assert.ok(
    !/from\s+["']\.\/programmatic-registry-pages-part-1["']/m.test(src),
    "registry must not static-import pages part 1",
  );
  assert.ok(
    !/from\s+["']\.\/programmatic-registry-pages-part-2["']/m.test(src),
    "registry must not static-import pages part 2",
  );
  assert.ok(
    !/from\s+["']\.\/programmatic-seo-authority-batch["']/m.test(src),
    "registry must not static-import authority batch",
  );
  assert.match(src, /createRequire/);
  assert.match(src, /require\(\s*["']\.\/programmatic-registry-pages-part-1["']\s*\)/);
});
