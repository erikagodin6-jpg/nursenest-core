import assert from "node:assert/strict";
import test from "node:test";

import { ContentStatus } from "@prisma/client";

import {
  buildPathwayLessonUpdateFromLegacy,
  LEGACY_PIPELINE_ALLOWED_PATHWAY_IDS,
  assertPathwayAllowed,
  metadataNeedsRepair,
  type PathwayLessonRowShape,
} from "@/lib/legacy/legacy-public-content-merge";
import type { LegacyLessonExportRow } from "@/lib/legacy/legacy-public-content-types";
import { normalizeLegacySlug } from "@/lib/legacy/legacy-public-content-types";

const baseRow = (over: Partial<PathwayLessonRowShape>): PathwayLessonRowShape => ({
  id: "lesson-1",
  pathwayId: "ca-rn-nclex-rn",
  slug: "wrong-slug",
  title: "Old",
  topic: "",
  topicSlug: "",
  bodySystem: "",
  previewSectionCount: 1,
  seoTitle: "Old",
  seoDescription: "Desc",
  sections: [],
  locale: "en",
  exams: [],
  countries: [],
  priority: "medium",
  examMeta: [],
  status: ContentStatus.PUBLISHED,
  tierCode: null,
  structuralPublicComplete: false,
  published_at: new Date(),
  ...over,
});

test("normalizeLegacySlug lowercases and strips unsafe chars", () => {
  assert.equal(normalizeLegacySlug("  Hello World!!  "), "hello-world");
  assert.equal(normalizeLegacySlug(""), "");
});

test("assertPathwayAllowed accepts catalog pathway ids", () => {
  assert.ok(LEGACY_PIPELINE_ALLOWED_PATHWAY_IDS.has("ca-rn-nclex-rn"));
  assert.throws(() => assertPathwayAllowed("unknown-pathway-xyz"));
});

test("metadataNeedsRepair detects empty topic fields", () => {
  const legacy: LegacyLessonExportRow = {
    pathwayId: "ca-rn-nclex-rn",
    slug: "x",
    title: "T",
    topic: "Pharmacology",
    topicSlug: "pharmacology",
    bodySystem: "renal",
  };
  assert.equal(metadataNeedsRepair(legacy, { topic: "", topicSlug: "", bodySystem: "" }), true);
  assert.equal(
    metadataNeedsRepair(legacy, { topic: "Pharmacology", topicSlug: "pharmacology", bodySystem: "renal" }),
    false,
  );
});

test("buildPathwayLessonUpdateFromLegacy corrects slug when pathway matches", () => {
  const legacy: LegacyLessonExportRow = {
    pathwayId: "ca-rn-nclex-rn",
    slug: "canonical-slug",
    title: "Canonical title",
    topic: "Fluids",
    topicSlug: "fluids",
    bodySystem: "renal",
  };
  const current = baseRow({ slug: "wrong-slug" });
  const { data, notes } = buildPathwayLessonUpdateFromLegacy(legacy, current, {
    overwriteBody: false,
    allowPathwayCorrection: false,
  });
  assert.ok(!notes.some((n) => n.startsWith("skip_")));
  assert.equal(data.slug, "canonical-slug");
  assert.equal(data.title, "Canonical title");
});

test("buildPathwayLessonUpdateFromLegacy skips pathway move without flag", () => {
  const legacy: LegacyLessonExportRow = {
    pathwayId: "ca-rn-nclex-rn",
    slug: "s",
    title: "T",
  };
  const current = baseRow({ pathwayId: "ca-pn-nclex-pn", slug: "s" });
  const { data, notes } = buildPathwayLessonUpdateFromLegacy(legacy, current, {
    overwriteBody: false,
    allowPathwayCorrection: false,
  });
  assert.ok(notes.some((n) => n.startsWith("skip_pathway_mismatch")));
  assert.equal(Object.keys(data).length, 0);
});
