import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  inferPathwayFamilyFromExamKeys,
  mapRowToCanonicalTopic,
} from "@/lib/questions/question-bank-taxonomy";

describe("question-bank-taxonomy", () => {
  it("infers pathway family from exam keys", () => {
    assert.equal(inferPathwayFamilyFromExamKeys(["NCLEX-RN", "NCLEX_RN"]), "nclex_rn");
    assert.equal(inferPathwayFamilyFromExamKeys(["NCLEX-PN"]), "nclex_pn");
    assert.equal(inferPathwayFamilyFromExamKeys(["NP", "FNP"]), "np");
    assert.equal(inferPathwayFamilyFromExamKeys(["ALLIED"]), "allied");
  });

  it("maps pharmacology keywords to canonical bucket", () => {
    const slug = mapRowToCanonicalTopic("nclex_rn", {
      topic: "Pharmacology",
      subtopic: null,
      bodySystem: null,
      exam: "NCLEX-RN",
    });
    assert.equal(slug, "pharmacology");
  });
});
