import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractQuestionLikeRecords } from "./replit-json-extract";
import { inferCountryFromRaw, inferTrackFromRaw, mapTrackAndCountryToExamFields } from "./replit-exam-country-map";
import { normalizeRawQuestionRecord } from "./replit-question-normalize";

describe("replit-json-extract", () => {
  it("extracts root array", () => {
    const r = extractQuestionLikeRecords([{ a: 1 }], "x.json");
    assert.equal(r.length, 1);
  });

  it("extracts questions key", () => {
    const r = extractQuestionLikeRecords({ questions: [{ b: 2 }] }, "x.json");
    assert.equal((r[0] as { b: number }).b, 2);
  });

  it("expands ai_cache output_json strings", () => {
    const doc = [
      {
        output_json: JSON.stringify([
          { stem: "Test stem here?", options: ["A", "B"], correctIndex: 0, rationale: "Because." },
        ]),
      },
    ];
    const r = extractQuestionLikeRecords(doc, "ai_cache.json");
    assert.equal(r.length, 1);
  });
});

describe("replit-exam-country-map", () => {
  it("maps RN US to nclex-rn + rn tier", () => {
    const m = mapTrackAndCountryToExamFields("RN", "US");
    assert.equal(m.tier, "rn");
    assert.equal(m.exam, "NCLEX-RN");
    assert.equal(m.regionScope, "US_ONLY");
    assert.equal(m.countryCode, "US");
  });

  it("maps PN CA to rpn tier", () => {
    const m = mapTrackAndCountryToExamFields("PN", "CA");
    assert.equal(m.tier, "rpn");
    assert.equal(m.exam, "NCLEX-PN");
    assert.equal(m.regionScope, "CA_ONLY");
  });

  it("infers country from raw", () => {
    assert.equal(inferCountryFromRaw({ country: "canada" }, "US"), "CA");
    assert.equal(inferCountryFromRaw({}, "US"), "US");
  });

  it("infers track from raw", () => {
    assert.equal(inferTrackFromRaw({ tier: "np" }, "RN"), "NP");
    assert.equal(inferTrackFromRaw({ examFamily: "NCLEX_PN" }, "RN"), "PN");
  });
});

describe("normalizeRawQuestionRecord", () => {
  it("normalizes minimal MCQ", () => {
    const n = normalizeRawQuestionRecord(
      {
        stem: "Which action is priority for this client situation?",
        options: ["A", "B", "C"],
        correctIndex: 1,
        rationale: "Safety and assessment come before routine tasks.",
      },
      { defaultCountry: "US", defaultTrack: "RN", statusPublished: false },
    );
    assert.equal(n.ok, true);
    if (n.ok) {
      assert.equal(n.row.tier, "rn");
      assert.ok(n.row.stemHash.startsWith("s"));
    }
  });

  it("rejects short stem", () => {
    const n = normalizeRawQuestionRecord({ stem: "bad", options: ["a", "b"], correctIndex: 0, rationale: "x" }, {
      defaultCountry: "US",
      defaultTrack: "RN",
      statusPublished: false,
    });
    assert.equal(n.ok, false);
  });

  it("maps Replit correct_answer numeric indices to option strings", () => {
    const n = normalizeRawQuestionRecord(
      {
        stem: "Which option reflects safe nursing practice for this client?",
        options: ["Delay assessment", "Assess airway and breathing first", "Complete paperwork"],
        correct_answer: [1],
        rationale: "ABCs and safety precede documentation.",
      },
      { defaultCountry: "US", defaultTrack: "RN", statusPublished: true },
    );
    assert.equal(n.ok, true);
    if (n.ok) {
      assert.deepEqual(n.row.correctAnswer, ["Assess airway and breathing first"]);
    }
  });
});
