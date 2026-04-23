/**
 * Regression: Canada RN hub must not collapse to a tiny set because DB rows carry legacy
 * `countries: ["US"]` while `pathway_id` is `ca-rn-nclex-rn`. Pathway membership is canonical.
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
  it("unions pathway country into explicit US-only stamps for ca-rn-nclex-rn so hub context matches", () => {
    const raw = data.pathways["ca-rn-nclex-rn"]?.lessons?.[0];
    assert.ok(raw, "catalog should include at least one ca-rn-nclex-rn lesson for this regression");
    const stamped: LessonInput = { ...raw!, countries: ["US"] };
    const rec = normalizeLesson(stamped, "ca-rn-nclex-rn");
    assert.ok(rec.countries?.includes("CA"), "expected CA union for Canada pathway row");
    assert.ok(rec.countries?.includes("US"), "preserves explicit stamp for downstream consumers");
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("ca-rn-nclex-rn", rec), true);
  });

  it("unions pathway country into explicit CA-only stamps for us-rn-nclex-rn (symmetric)", () => {
    const raw = data.pathways["us-rn-nclex-rn"]?.lessons?.[0];
    assert.ok(raw, "catalog should include at least one us-rn-nclex-rn lesson for this regression");
    const stamped: LessonInput = { ...raw!, countries: ["CA"] };
    const rec = normalizeLesson(stamped, "us-rn-nclex-rn");
    assert.ok(rec.countries?.includes("US"));
    assert.ok(rec.countries?.includes("CA"));
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("us-rn-nclex-rn", rec), true);
  });

  it("does not add pathway country when metadata is explicitly GLOBAL", () => {
    const raw = data.pathways["us-rn-nclex-rn"]?.lessons?.[0];
    assert.ok(raw);
    const stamped: LessonInput = { ...raw!, countries: ["GLOBAL"] };
    const rec = normalizeLesson(stamped, "us-rn-nclex-rn");
    assert.deepEqual(rec.countries, ["GLOBAL"]);
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("us-rn-nclex-rn", rec), true);
  });

  it("keeps exam/country hub context for every stamped row (not structural gate — catalog depth varies)", () => {
    const rows = data.pathways["ca-rn-nclex-rn"]?.lessons ?? [];
    assert.ok(rows.length >= 3, "need several catalog rows to assert bulk hub filter");
    const stamped = rows.slice(0, 25).map((r) => ({ ...r, countries: ["US"] as const }));
    const records = stamped.map((r) => normalizeLesson(r, "ca-rn-nclex-rn"));
    const contextOk = records.filter((r) => pathwayLessonMatchesMarketingPathwayContext("ca-rn-nclex-rn", r)).length;
    assert.equal(
      contextOk,
      records.length,
      "legacy US-only country stamps must not drop Canada RN rows on context match (pathwayId is canonical)",
    );
  });
});
