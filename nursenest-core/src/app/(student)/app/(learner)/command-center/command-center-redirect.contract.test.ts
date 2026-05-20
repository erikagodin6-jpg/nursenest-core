import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const pagePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "page.tsx",
);

test("command-center page redirects to canonical dashboard", () => {
  const src = readFileSync(pagePath, "utf8");
  assert.match(src, /redirect\("\/app"\)/);
});
