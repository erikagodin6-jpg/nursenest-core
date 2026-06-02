import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

test("blog-public-patho-pharm-counts.mts reports main vs scoped_generated columns", () => {
  const p = join(process.cwd(), "scripts/blog/blog-public-patho-pharm-counts.mts");
  const src = readFileSync(p, "utf8");
  for (const col of [
    "visible_public_total_main",
    "visible_public_total_scoped_generated",
    "patho_pharm_topical_main",
    "patho_pharm_topical_scoped_generated",
    "patho_pharm_long_tail_main",
    "patho_pharm_long_tail_scoped_generated",
  ]) {
    assert.ok(src.includes(col), `expected counts script to define ${col}`);
  }
});
