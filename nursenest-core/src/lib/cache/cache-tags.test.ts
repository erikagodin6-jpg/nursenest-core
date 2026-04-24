import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS,
  cacheTagPathwayLessonsHub,
} from "./cache-tags";

test("pathway lessons hub cache tag matches pathway-lesson-loader contract", () => {
  assert.equal(cacheTagPathwayLessonsHub("ca-rn-nclex-rn"), "pathway-lessons:ca-rn-nclex-rn");
});

test("marketing public flashcard tags cache tag is stable for revalidateTag", () => {
  assert.match(CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS, /^marketing:/);
});
