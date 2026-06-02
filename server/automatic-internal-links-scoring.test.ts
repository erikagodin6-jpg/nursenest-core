import { describe, expect, it } from "vitest";
import {
  blogExamsAllowPairing,
  blogSeoTiersAllowPairing,
  scoreBlogRelatedness,
  scoreLessonSiblingRelatedness,
  tagOverlapCount,
  tokenOverlapTitle,
} from "@/lib/linking/automatic-internal-links-scoring";

describe("automatic-internal-links-scoring", () => {
  it("blogExamsAllowPairing requires exact exam when both set", () => {
    expect(blogExamsAllowPairing("NCLEX-RN", "NCLEX-RN")).toBe(true);
    expect(blogExamsAllowPairing("NCLEX-RN", "NCLEX-PN")).toBe(false);
    expect(blogExamsAllowPairing(null, null)).toBe(true);
    expect(blogExamsAllowPairing("NCLEX-RN", null)).toBe(false);
  });

  it("blogSeoTiersAllowPairing blocks RN vs PN", () => {
    expect(blogSeoTiersAllowPairing("NCLEX-RN", "NCLEX-RN")).toBe(true);
    expect(blogSeoTiersAllowPairing("NCLEX-RN", "NCLEX-PN")).toBe(false);
  });

  it("tagOverlapCount is case-insensitive", () => {
    expect(tagOverlapCount(["Heart", "Labs"], ["heart", "x"])).toBe(1);
  });

  it("scoreBlogRelatedness upgrades with taxonomy leaf + overlap", () => {
    const strong = scoreBlogRelatedness({
      postTags: ["cardio", "hf"],
      candidateTags: ["cardio", "hf", "labs"],
      categoryMatch: false,
      taxonomyLeafMatch: true,
    });
    expect(["strong", "moderate"]).toContain(strong.strength);
    const weak = scoreBlogRelatedness({
      postTags: ["a"],
      candidateTags: ["b"],
      categoryMatch: false,
      taxonomyLeafMatch: false,
    });
    expect(weak.strength).toBe("weak");
  });

  it("scoreLessonSiblingRelatedness treats same topic as strong", () => {
    const s = scoreLessonSiblingRelatedness({
      sameTopicSlug: true,
      sameBodySystem: false,
      titleTokenOverlap: 0,
    });
    expect(["strong", "moderate"]).toContain(s.strength);
  });

  it("tokenOverlapTitle finds shared clinical tokens", () => {
    expect(tokenOverlapTitle("Heart failure exacerbation", "Acute heart failure management")).toBeGreaterThanOrEqual(2);
  });
});
