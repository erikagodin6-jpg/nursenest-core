import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NURSENEST_CORE_ROOT = path.resolve(__dirname, "../../..");

const PRE_NURSING_LESSONS_HUB_PAGE = path.join(
  NURSENEST_CORE_ROOT,
  "src/app/(marketing)/(default)/pre-nursing/lessons/page.tsx",
);

describe("pre-nursing lessons hub — card grid layout contract", () => {
  it("uses a flex grid cell wrapper so cards fill stretched rows (equal-height cards)", () => {
    const src = fs.readFileSync(PRE_NURSING_LESSONS_HUB_PAGE, "utf8");
    assert.match(src, /<li[^>]*className="[^"]*\bflex\b[^"]*"/, "grid <li> should be a flex container for reliable h-full/flex-1");
    assert.ok(
      src.includes("flex-1") && src.includes("flex-col"),
      "card link should be flex-1 flex-col to fill the grid cell",
    );
    assert.ok(src.includes("mt-auto"), "footer/meta row should use mt-auto for bottom-aligned CTAs");
  });

  it("reserves a minimum card height and clamps description lines for visual parity", () => {
    const src = fs.readFileSync(PRE_NURSING_LESSONS_HUB_PAGE, "utf8");
    assert.ok(src.includes("min-h-["), "cards should set a min-height token for short-copy parity");
    assert.ok(src.includes("line-clamp-3"), "subtitle should be line-clamped for consistent card bodies");
  });

  it("avoids extrabold hub chrome (headings stay semibold or lighter)", () => {
    const src = fs.readFileSync(PRE_NURSING_LESSONS_HUB_PAGE, "utf8");
    assert.equal(src.includes("font-extrabold"), false);
    assert.equal(src.includes("font-black"), false);
    assert.equal(/\bfont-bold\b/.test(src), false);
  });
});
