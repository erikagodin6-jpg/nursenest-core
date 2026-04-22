import { describe, expect, it } from "vitest";
import { getExamLabel, getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";
import { resolveDefaultLayoutMarketingExamRegion } from "@/lib/marketing/resolve-default-layout-marketing-exam-region";

describe("resolveDefaultLayoutMarketingExamRegion", () => {
  it("prefers explicit nn_marketing_region over nn_global_region", () => {
    expect(
      resolveDefaultLayoutMarketingExamRegion({
        marketingRegionCookie: "CA",
        globalRegionSlug: "us",
      }),
    ).toBe("CA");
    expect(
      resolveDefaultLayoutMarketingExamRegion({
        marketingRegionCookie: "US",
        globalRegionSlug: "canada",
      }),
    ).toBe("US");
  });

  it("maps nn_global_region us|canada when marketing cookie absent", () => {
    expect(
      resolveDefaultLayoutMarketingExamRegion({
        marketingRegionCookie: undefined,
        globalRegionSlug: "us",
      }),
    ).toBe("US");
    expect(
      resolveDefaultLayoutMarketingExamRegion({
        marketingRegionCookie: undefined,
        globalRegionSlug: "canada",
      }),
    ).toBe("CA");
  });

  it("Canada-first when no explicit marketing cookie and global is not us|canada", () => {
    expect(
      resolveDefaultLayoutMarketingExamRegion({
        marketingRegionCookie: undefined,
        globalRegionSlug: "philippines",
      }),
    ).toBe("CA");
    expect(
      resolveDefaultLayoutMarketingExamRegion({
        marketingRegionCookie: undefined,
        globalRegionSlug: null,
      }),
    ).toBe("CA");
  });
});

describe("nursing role labels for pricing tracks", () => {
  it("uses US PN naming for US", () => {
    expect(getNursingRoleLabel({ country: "US", role: "PN" })).toBe("LPN / LVN");
    expect(getExamLabel({ country: "US", role: "PN" })).toBe("NCLEX-PN");
  });

  it("uses Canadian PN naming for CA", () => {
    expect(getNursingRoleLabel({ country: "CA", role: "PN" })).toBe("RPN");
    expect(getExamLabel({ country: "CA", role: "PN" })).toBe("REX-PN");
  });

  it("keeps RN and NP exam labels stable", () => {
    expect(getExamLabel({ country: "US", role: "RN" })).toBe("NCLEX-RN");
    expect(getExamLabel({ country: "CA", role: "RN" })).toBe("NCLEX-RN");
    expect(getExamLabel({ country: "US", role: "NP" })).toBe("NP Certification Exam");
    expect(getExamLabel({ country: "CA", role: "NP" })).toBe("NP Certification Exam");
  });
});
