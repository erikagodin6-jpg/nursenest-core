import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  pathwayFlashcardsHubH1,
  pathwayFlashcardsHubMetaTitle,
  tryResolveExamPathwayForFlashcardsMetadataQuery,
} from "@/lib/lessons/pathway-flashcards-hub-seo";

describe("pathway-flashcards-hub-seo", () => {
  it("produces distinct H1 copy for Canada RN vs US RN NCLEX pathways", () => {
    const ca = getExamPathwayById("ca-rn-nclex-rn");
    const us = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(ca && us);
    const caH1 = pathwayFlashcardsHubH1(ca);
    const usH1 = pathwayFlashcardsHubH1(us);
    assert.match(caH1, /Canada/i);
    assert.match(usH1, /United States/i);
    assert.ok(!caH1.includes("United States"));
    assert.notStrictEqual(caH1, usH1);
  });

  it("meta title includes brand suffix once", () => {
    const ca = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(ca);
    const meta = pathwayFlashcardsHubMetaTitle(ca);
    assert.ok(meta.endsWith("| NurseNest"));
    assert.ok(meta.includes(pathwayFlashcardsHubH1(ca)));
  });

  it("resolves short marketing pathway ids for metadata", () => {
    assert.ok(tryResolveExamPathwayForFlashcardsMetadataQuery("ca-rn-nclex-rn")?.id === "ca-rn-nclex-rn");
    assert.strictEqual(tryResolveExamPathwayForFlashcardsMetadataQuery("ca-np")?.id, "ca-np-cnple");
  });
});
