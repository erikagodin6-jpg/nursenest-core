import assert from "node:assert/strict";
import { test } from "node:test";
import {
  auditLessonImageMapEntryAgainstLessons,
  catalogRowMatchesImageMapEntry,
} from "./image-backed-lesson-audit";
import type { LessonImageMapEntry } from "./lesson-image-map";

const dvtEntry: LessonImageMapEntry = {
  objectKey: "dvt.png",
  slugs: ["deep-vein-thrombosis-dvt-prevention-and-nursing-management-nclex-rn"],
  keywords: ["deep vein thrombosis"],
  bodySystems: ["vascular"],
  category: "vascular",
};

test("catalogRowMatchesImageMapEntry: bundled NCLEX DVT slug matches map entry", () => {
  assert.equal(
    catalogRowMatchesImageMapEntry(
      { slug: "deep-vein-thrombosis-dvt-prevention-and-nursing-management-nclex-rn", title: "DVT: Prevention & Management" },
      dvtEntry,
    ),
    true,
  );
});

test("catalogRowMatchesImageMapEntry: title keyword match for DVT", () => {
  assert.equal(
    catalogRowMatchesImageMapEntry({ slug: "venous-thromboembolism-basics", title: "Deep vein thrombosis and PE overview" }, dvtEntry),
    true,
  );
});

test("auditLessonImageMapEntryAgainstLessons: matched when inventory + catalog overlap", () => {
  const row = auditLessonImageMapEntryAgainstLessons(dvtEntry, {
    inventoryKeySet: new Set(["dvt.png"]),
    lessonsByPathway: new Map([
      [
        "ca-rn-nclex-rn",
        [{ slug: "deep-vein-thrombosis-dvt-prevention-and-nursing-management-nclex-rn", title: "DVT" }],
      ],
    ]),
  });
  assert.equal(row.status, "matched");
  assert.equal(row.matches.length, 1);
});

test("auditLessonImageMapEntryAgainstLessons: missing when inventory present but no catalog row", () => {
  const row = auditLessonImageMapEntryAgainstLessons(dvtEntry, {
    inventoryKeySet: new Set(["dvt.png"]),
    lessonsByPathway: new Map([["ca-rn-nclex-rn", [{ slug: "unrelated-lesson", title: "Other" }]]]),
  });
  assert.equal(row.status, "missing");
});

test("auditLessonImageMapEntryAgainstLessons: skip when image not in inventory", () => {
  const row = auditLessonImageMapEntryAgainstLessons(dvtEntry, {
    inventoryKeySet: new Set(),
    lessonsByPathway: new Map(),
  });
  assert.equal(row.status, "skip");
});
