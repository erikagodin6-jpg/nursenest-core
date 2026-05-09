/**
 * `/app/cat` must route pathway-scoped bookmarks to cat-launch (adaptive entry), not only the generic hub.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pagePath = join(here, "page.tsx");

test("cat alias redirects pathway queries to cat-launch", () => {
  const src = readFileSync(pagePath, "utf8");
  assert.match(src, /redirect\(/);
  assert.match(src, /\/app\/practice-tests\/cat-launch/);
  assert.match(src, /pathwayId/);
});
