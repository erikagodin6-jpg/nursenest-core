/**
 * Strict lesson routing: explicit country metadata must remain exam-specific.
 *
 * Run: `npx tsx --test src/lib/lessons/pathway-lesson-pathway-country-merge.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import catalog from "@/content/pathway-lessons/catalog.json";
import {
  normalizeLesson,
  pathwayLessonMatchesMarketingPathwayContext,
  type LessonInput,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

type CatalogShape = {
  pathways: Record<string, { lessons?: LessonInput[] }>;
};

const data = catalog as CatalogShape;

describe("pathway row country metadata vs pathwayId (CA/US hubs)", () => {
  it("does not union pathway country into explicit US-only stamps for ca-rn-nclex-rn", () => {
    const raw = data.pathways["ca-rn-nclex-rn"]?.lessons?.[0];
    assert.ok(raw, "catalog should include at least one ca-rn-nclex-rn lesson for this regression");
    const stamped: LessonInput = { ...raw!, countries: ["US"] };
    const rec = normalizeLesson(stamped, "ca-rn-nclex-rn");
    assert.deepEqual(rec.countries, ["US"]);
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("ca-rn-nclex-rn", rec), false);
    assert.equal(rec.examSpecificMetadata?.examType, "NCLEX_RN");
    assert.equal(rec.examSpecificMetadata?.country, "CA");
  });

  it("does not union pathway country into explicit CA-only stamps for us-rn-nclex-rn", () => {
    const raw = data.pathways["us-rn-nclex-rn"]?.lessons?.[0];
    assert.ok(raw, "catalog should include at least one us-rn-nclex-rn lesson for this regression");
    const stamped: LessonInput = { ...raw!, countries: ["CA"] };
    const rec = normalizeLesson(stamped, "us-rn-nclex-rn");
    assert.deepEqual(rec.countries, ["CA"]);
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("us-rn-nclex-rn", rec), false);
    assert.equal(rec.examSpecificMetadata?.unitSystem, "CON");
  });

  it("does not add pathway country when metadata is explicitly GLOBAL", () => {
    const raw = data.pathways["us-rn-nclex-rn"]?.lessons?.[0];
    assert.ok(raw);
    const stamped: LessonInput = { ...raw!, countries: ["GLOBAL"] };
    const rec = normalizeLesson(stamped, "us-rn-nclex-rn");
    assert.deepEqual(rec.countries, ["GLOBAL"]);
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("us-rn-nclex-rn", rec), true);
  });

  it("drops mismatched stamped rows from exam/country hub context", () => {
    const rows = data.pathways["ca-rn-nclex-rn"]?.lessons ?? [];
    assert.ok(rows.length >= 3, "need several catalog rows to assert bulk hub filter");
    const stamped = rows.slice(0, 25).map((r) => ({ ...r, countries: ["US"] as const }));
    const records = stamped.map((r) => normalizeLesson(r, "ca-rn-nclex-rn"));
    const contextOk = records.filter((r) => pathwayLessonMatchesMarketingPathwayContext("ca-rn-nclex-rn", r)).length;
    assert.equal(
      contextOk,
      0,
      "US-only country stamps must not appear in the Canada RN context",
    );
  });
});
