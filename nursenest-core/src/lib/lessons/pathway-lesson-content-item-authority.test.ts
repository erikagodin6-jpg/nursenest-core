import assert from "node:assert/strict";
import { test } from "node:test";
import {
  pathwayAuthorityBlocksContentItemLessonPatch,
} from "@/lib/lessons/pathway-lesson-content-item-authority";

test("pathwayAuthorityBlocksContentItemLessonPatch: no link allows edits", () => {
  assert.equal(pathwayAuthorityBlocksContentItemLessonPatch({ linkedPathwayLessonId: null, patch: { title: "x" } }), false);
  assert.equal(pathwayAuthorityBlocksContentItemLessonPatch({ linkedPathwayLessonId: "", patch: { title: "x" } }), false);
});

test("pathwayAuthorityBlocksContentItemLessonPatch: blocks canonical fields when linked", () => {
  const id = "clxxxxxxxxxxxxxxxxxxxxxx";
  assert.equal(pathwayAuthorityBlocksContentItemLessonPatch({ linkedPathwayLessonId: id, patch: { title: "x" } }), true);
  assert.equal(pathwayAuthorityBlocksContentItemLessonPatch({ linkedPathwayLessonId: id, patch: { body: "y" } }), true);
});

test("pathwayAuthorityBlocksContentItemLessonPatch: allows metadata-only patches when linked", () => {
  const id = "clxxxxxxxxxxxxxxxxxxxxxx";
  assert.equal(pathwayAuthorityBlocksContentItemLessonPatch({ linkedPathwayLessonId: id, patch: { tags: [] } }), false);
  assert.equal(pathwayAuthorityBlocksContentItemLessonPatch({ linkedPathwayLessonId: id, patch: {} }), false);
});
