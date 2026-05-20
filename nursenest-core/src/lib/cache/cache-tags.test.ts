import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CACHE_TAG_MARKETING_BLOG_SURFACES,
  CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS,
  CACHE_TAG_PATHWAY_LESSON_INDEX,
  cacheTagPathwayLessonsHub,
} from "./cache-tags";

test("pathway lessons hub cache tag matches pathway-lesson-loader contract", () => {
  assert.equal(cacheTagPathwayLessonsHub("ca-rn-nclex-rn"), "pathway-lessons:ca-rn-nclex-rn");
});

test("marketing public flashcard tags cache tag is stable for revalidateTag", () => {
  assert.match(CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS, /^marketing:/);
});

test("marketing blog surfaces cache tag is stable", () => {
  assert.equal(CACHE_TAG_MARKETING_BLOG_SURFACES, "marketing:blog");
});

test("pathway lesson index cache tag matches pathway-lesson-public-metadata", () => {
  assert.equal(CACHE_TAG_PATHWAY_LESSON_INDEX, "pathway-lesson-index");
});
