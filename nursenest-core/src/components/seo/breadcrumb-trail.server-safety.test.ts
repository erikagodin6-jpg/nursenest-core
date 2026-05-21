import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const SOURCE = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "breadcrumb-trail.tsx"),
  "utf8",
);

describe("BreadcrumbTrail server safety", () => {
  it("does not pass onClick to Link unless onCrumbClick is provided (RSC regression)", () => {
    assert.equal(
      SOURCE.includes("onClick={() => onCrumbClick?.("),
      false,
      "unconditional onClick breaks Server Components (exam hub digest 386784597)",
    );
    assert.ok(
      SOURCE.includes(") : onCrumbClick ? ("),
      "expected guarded Link branches for optional onCrumbClick",
    );
  });
});
