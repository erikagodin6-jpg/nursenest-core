/**
 * Hub verify must use uncached {@link getPathwayLessonImpl} — never {@link getPathwayLesson}'s unstable_cache wrapper —
 * or list vs detail can disagree right after publish (silent "0 lessons" hub).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("getPathwayLessonForMarketingHubVerify calls getPathwayLessonImpl without unstable_cache in that export", () => {
  const src = readFileSync(join(__dirname, "pathway-lesson-loader.ts"), "utf8");
  const marker = "export async function getPathwayLessonForMarketingHubVerify";
  const i = src.indexOf(marker);
  assert.ok(i >= 0, "expected export getPathwayLessonForMarketingHubVerify");
  const block = src.slice(i, i + 520);
  assert.match(block, /getPathwayLessonImpl\(/, "verify must load via uncached impl");
  assert.ok(!block.includes("unstable_cache"), "verify export must not wrap unstable_cache");
  assert.match(
    block,
    /preferPublishedLocaleScan:\s*true/,
    "verify must enable published-locale scan for hub list vs detail drift recovery",
  );
});

test("cached single-lesson read still wraps getPathwayLessonImpl (not getPathwayLesson) inside unstable_cache", () => {
  const src = readFileSync(join(__dirname, "pathway-lesson-loader.ts"), "utf8");
  assert.match(
    src,
    /async function getPathwayLessonWithDataCache[\s\S]*?unstable_cache\([\s\S]*?async \(\) => getPathwayLessonImpl/,
    "detail cache must target impl; hub verify bypasses this via getPathwayLessonForMarketingHubVerify",
  );
});
