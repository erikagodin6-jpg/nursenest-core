import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assessStructuralEligibility,
  evaluateCitationGate,
  partitionCitationsForBlog,
  parseBlogSourcesJson,
} from "./blog-citation-safety";

test("assessStructuralEligibility rejects http URL and short title", () => {
  const bad = assessStructuralEligibility({
    title: "ab",
    year: "2020",
    url: "http://example.com/x",
  });
  assert.equal(bad.ok, false);
  assert.ok(bad.reasons.some((r) => r.includes("title")));
  assert.ok(bad.reasons.some((r) => r.includes("https")));
});

test("assessStructuralEligibility accepts https + adequate title", () => {
  const ok = assessStructuralEligibility({
    title: "Clinical practice guideline for sepsis care",
    year: "2021",
    url: "https://www.who.int/news-room/fact-sheets",
  });
  assert.equal(ok.ok, true);
});

test("partitionCitationsForBlog verifies admin rows and never promotes AI stubs", () => {
  const admin = [
    {
      title: "Surviving Sepsis Campaign guidelines",
      year: "2021",
      url: "https://www.sccm.org/clinical-resources/guidelines",
    },
    { title: "x", year: "2020", source: "CDC" },
  ];
  const ai = [{ title: "Fake study on NCLEX", year: "2024", doi: "10.1234/fake" }];
  const part = partitionCitationsForBlog(admin, ai);
  assert.equal(part.verified.length, 1);
  assert.equal(part.verified[0]?.provenance, "admin_supplied");
  assert.ok(part.excluded.some((e) => e.provenance === "ai_suggested"));
  assert.ok(part.excluded.some((e) => e.provenance === "admin_supplied"));
  assert.equal(part.apaLines.length, 1);
});

test("evaluateCitationGate blocks high-risk topics without verified sources", () => {
  const blocked = evaluateCitationGate({
    riskFlags: ["medication_safety"],
    verifiedCount: 0,
    allowInsufficientCitations: false,
  });
  assert.equal(blocked.ok, false);
  if (!blocked.ok) {
    assert.equal(blocked.code, "INSUFFICIENT_CITATIONS");
  }
});

test("evaluateCitationGate allows override flag", () => {
  const allowed = evaluateCitationGate({
    riskFlags: ["medication_safety"],
    verifiedCount: 0,
    allowInsufficientCitations: true,
  });
  assert.equal(allowed.ok, true);
});

test("parseBlogSourcesJson reads envelope v2", () => {
  const raw = {
    version: 2,
    verified: [{ title: "A", year: "2020", source: "NIH", provenance: "admin_supplied" }],
    excluded: [],
    generatedAt: "2026-01-01T00:00:00.000Z",
  };
  const { envelope, legacyRecords } = parseBlogSourcesJson(raw);
  assert.ok(envelope);
  assert.equal(envelope?.verified.length, 1);
  assert.equal(legacyRecords.length, 0);
});
