import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifySpineTopicForPathway,
  jaccard,
  pathwayIdsForSpineTopic,
  scorePathwayLessonAgainstSpineTopic,
  tokenizeForMatch,
  type NpSpineTopic,
} from "./np-spine-db-alignment";
import {
  buildNpSpineSystem,
  buildNpSpineTopic,
  buildPathwayLessonMatchRow,
} from "./test-fixtures";

const cardioSystem = buildNpSpineSystem();

describe("np-spine-db-alignment", () => {
  it("pathwayIdsForSpineTopic maps exam tags", () => {
    const t: NpSpineTopic = {
      id: "cv-x",
      title: "X",
      exams: ["FNP", "PMHNP", "UNKNOWN"],
    };
    assert.deepEqual(pathwayIdsForSpineTopic(t).sort(), ["us-np-fnp", "us-np-pmhnp"].sort());
  });

  it("jaccard handles overlap", () => {
    const a = tokenizeForMatch("Type 2 diabetes management");
    const b = tokenizeForMatch("Diabetes type 2 — outpatient management");
    assert.ok(jaccard(a, b) > 0.25);
  });

  it("exact topicSlug yields high score", () => {
    const topic: NpSpineTopic = buildNpSpineTopic({
      id: "endo-diabetes-t2",
      title: "Type 2 diabetes management",
      exams: ["FNP"],
    });
    const lesson = buildPathwayLessonMatchRow({
      id: "1",
      pathwayId: "us-np-fnp",
      slug: "fnp-endo-diabetes-t2-board",
      title: "Type 2 diabetes management",
      topic: "Diabetes",
      topicSlug: "endo-diabetes-t2",
      bodySystem: "Endocrine",
      status: "PUBLISHED",
      sections: Array.from({ length: 5 }, (_, i) => ({ id: String(i), body: "x".repeat(1500) })),
    });
    const s = scorePathwayLessonAgainstSpineTopic(lesson, topic, {
      id: "endocrine",
      name: "Endocrine",
      topics: [],
    });
    assert.ok(s.score >= 0.7);
    assert.ok(s.depth.depthScore >= 0.4);
  });

  it("classifies EXISTS_STRONG for dominant exact match", () => {
    const topic: NpSpineTopic = buildNpSpineTopic({ id: "cv-hf", title: "Heart failure overview", exams: ["FNP"] });
    const lesson = buildPathwayLessonMatchRow({
      id: "a",
      pathwayId: "us-np-fnp",
      slug: "cv-hf",
      title: "Heart failure overview",
      topic: "Heart failure",
      topicSlug: "cv-hf",
      bodySystem: "Cardiovascular",
      status: "PUBLISHED",
      sections: Array.from({ length: 5 }, (_, i) => ({ id: String(i), body: "y".repeat(2000) })),
    });
    const row = classifySpineTopicForPathway("us-np-fnp", cardioSystem, topic, [lesson]);
    assert.equal(row.classification, "EXISTS_STRONG");
    assert.equal(row.recommendedCanonicalSlug, "cv-hf");
  });

  it("classifies DUPLICATE_CLUSTER when two close high scores", () => {
    const topic: NpSpineTopic = buildNpSpineTopic({ id: "cv-afib", title: "Atrial fibrillation", exams: ["FNP"] });
    const a = buildPathwayLessonMatchRow({
      id: "1",
      pathwayId: "us-np-fnp",
      slug: "fnp-cv-afib-a",
      title: "Atrial fibrillation — board review",
      topic: "AFib",
      topicSlug: "cv-afib",
      bodySystem: "Cardiovascular",
      status: "PUBLISHED",
      sections: [{ id: "1", body: "x".repeat(2000) }],
    });
    const b = buildPathwayLessonMatchRow({
      id: "2",
      pathwayId: "us-np-fnp",
      slug: "fnp-cv-afib-b",
      title: "Atrial fibrillation management",
      topic: "AFib",
      topicSlug: "cv-afib",
      bodySystem: "Cardiovascular",
      status: "PUBLISHED",
      sections: [{ id: "1", body: "x".repeat(2000) }],
    });
    const row = classifySpineTopicForPathway("us-np-fnp", cardioSystem, topic, [a, b]);
    assert.equal(row.classification, "DUPLICATE_CLUSTER");
    assert.ok(row.mergeCandidateSlugs?.length);
  });

  it("classifies MISSING without candidates", () => {
    const topic: NpSpineTopic = buildNpSpineTopic({
      id: "rare-orphan-topic-xyz",
      title: "Rare orphan topic xyz",
      exams: ["FNP"],
    });
    const row = classifySpineTopicForPathway("us-np-fnp", cardioSystem, topic, []);
    assert.equal(row.classification, "MISSING");
  });
});
