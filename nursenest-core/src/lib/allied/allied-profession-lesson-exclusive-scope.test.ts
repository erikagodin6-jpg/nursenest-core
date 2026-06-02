import "../../../scripts/stub-server-only.cjs";
import test from "node:test";
import assert from "node:assert/strict";
import {
  exclusiveTopicSlugsForAlliedProfession,
  exclusiveWinningProfessionForTopic,
} from "@/lib/allied/allied-profession-lesson-exclusive-scope";
import { filterCatalogLessonsForAlliedProfessionHub } from "@/lib/allied/allied-profession-catalog-hub-filter";
import { getCatalogLessonsRaw } from "@/lib/lessons/pathway-lesson-catalog-sync";

test("exclusive topic ownership yields different slug sets for MLT vs paramedic vs respiratory", () => {
  const pathwayId = "us-allied-core";
  const raw = getCatalogLessonsRaw(pathwayId);
  assert.ok(raw.length > 0, "catalog should have lessons for audit");

  const mlt = filterCatalogLessonsForAlliedProfessionHub(raw, "mlt", pathwayId).map((r) => r.slug).sort();
  const paramedic = filterCatalogLessonsForAlliedProfessionHub(raw, "paramedic", pathwayId).map((r) => r.slug).sort();
  const rt = filterCatalogLessonsForAlliedProfessionHub(raw, "respiratory", pathwayId).map((r) => r.slug).sort();

  assert.notDeepEqual(mlt, paramedic);
  assert.notDeepEqual(mlt, rt);
  assert.notDeepEqual(paramedic, rt);
});

test("exclusiveWinningProfessionForTopic is stable for shared topic", () => {
  const pathwayId = "us-allied-core";
  const a = exclusiveWinningProfessionForTopic(pathwayId, "clinical-documentation");
  const b = exclusiveWinningProfessionForTopic(pathwayId, "clinical-documentation");
  assert.equal(a, b);
  assert.ok(a && a.length > 0);
});

test("exclusiveTopicSlugsForAlliedProfession is subset of registry topics", () => {
  const pathwayId = "us-allied-core";
  const mltTopics = exclusiveTopicSlugsForAlliedProfession(pathwayId, "mlt");
  for (const t of mltTopics) {
    assert.ok(
      exclusiveWinningProfessionForTopic(pathwayId, t) === "mlt",
      `topic ${t} should be owned by mlt when listed for mlt`,
    );
  }
});
