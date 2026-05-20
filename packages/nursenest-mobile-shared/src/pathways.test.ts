import { describe, expect, it } from "vitest";
import { DEFAULT_MOBILE_V1_PATHWAY_ID, isMobileV1PathwayId, MOBILE_V1_PATHWAYS } from "./pathways.js";

describe("pathways", () => {
  it("V1 ids align with known server pathway slugs", () => {
    const ids = new Set(MOBILE_V1_PATHWAYS.map((p) => p.id));
    expect(ids.has("us-rn-nclex-rn")).toBe(true);
    expect(ids.has("us-rn-new-grad-transition")).toBe(true);
    expect(ids.has("ca-rn-nclex-rn")).toBe(true);
    expect(ids.has("ca-rpn-rex-pn")).toBe(true);
    expect(ids.has("us-lpn-nclex-pn")).toBe(true);
    expect(ids.has("ca-np-cnple")).toBe(true);
    expect(ids.has("us-np-fnp")).toBe(true);
  });

  it("guards unknown pathway ids", () => {
    expect(isMobileV1PathwayId("uk-rn-nmc-test-of-competence")).toBe(false);
    expect(isMobileV1PathwayId(DEFAULT_MOBILE_V1_PATHWAY_ID)).toBe(true);
  });
});
