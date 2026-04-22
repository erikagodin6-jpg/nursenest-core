import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const coreRoot = join(here, "..", "..");

test("marketing RN pathway lesson detail body does not mount EEAT / Editorial quality card", () => {
  const src = readFileSync(
    join(coreRoot, "app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx"),
    "utf8",
  );
  assert.equal(src.includes("EeatContentAttribution"), false);
  assert.equal(src.includes("Editorial quality"), false);
});

test("marketing allied-health lesson page does not mount EEAT / Editorial quality card", () => {
  const src = readFileSync(
    join(coreRoot, "app/(marketing)/(default)/allied-health/[slug]/lessons/[lessonSlug]/page.tsx"),
    "utf8",
  );
  assert.equal(src.includes("EeatContentAttribution"), false);
  assert.equal(src.includes("Editorial quality"), false);
});

test("marketing pathway lesson detail resolves session user (no hardcoded empty userId)", () => {
  const src = readFileSync(
    join(coreRoot, "app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx"),
    "utf8",
  );
  assert.equal(/\bconst\s+userId\s*=\s*["']["']/.test(src), false);
});
