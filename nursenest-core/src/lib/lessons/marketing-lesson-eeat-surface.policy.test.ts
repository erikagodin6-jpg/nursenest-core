import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const coreRoot = join(here, "..", "..");

test("marketing RN pathway lesson detail: editorial disclosure stays below study chrome", () => {
  const src = readFileSync(
    join(
      coreRoot,
      "app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
    ),
    "utf8",
  );
  const lines = src.split("\n");
  const eeatIdx = lines.findIndex((l) => l.includes("<EeatContentAttribution"));
  const crossLinksIdx = lines.findIndex((l) => l.includes("<MarketingStudyCrossLinks"));
  assert.ok(eeatIdx >= 0, "expected pathway lesson detail to mount EeatContentAttribution");
  assert.ok(crossLinksIdx >= 0, "expected MarketingStudyCrossLinks anchor");
  assert.ok(
    eeatIdx > crossLinksIdx,
    "Editorial disclosure must render after MarketingStudyCrossLinks (bottom of page), not near the hero",
  );
  const heroStart = lines.findIndex((l) => l.includes('<div className="mt-4 space-y-2">'));
  assert.ok(heroStart >= 0);
  const heroSlice = lines.slice(heroStart, heroStart + 8).join("\n");
  assert.equal(
    heroSlice.includes("EeatContentAttribution"),
    false,
    "Editorial disclosure must not sit in the hero notices stack",
  );
});

test("marketing allied-health lesson legacy redirect page does not mount pathway EEAT", () => {
  const src = readFileSync(
    join(coreRoot, "app/(marketing)/(default)/allied-health/[slug]/lessons/[lessonSlug]/page.tsx"),
    "utf8",
  );
  assert.equal(src.includes("EeatContentAttribution"), false);
});

test("marketing pathway lesson detail resolves session user (no hardcoded empty userId)", () => {
  const src = readFileSync(
    join(
      coreRoot,
      "app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
    ),
    "utf8",
  );
  assert.equal(/\bconst\s+userId\s*=\s*["']["']/.test(src), false);
});
