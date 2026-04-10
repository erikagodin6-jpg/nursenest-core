import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRouteValidator } from "../../../scripts/audit-internal-links";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import {
  marketingExamPrepHubs,
  publicMarketingCatHrefForOffering,
} from "@/lib/marketing/marketing-exam-navigation";
import { isWellFormedExamHubPath } from "@/lib/marketing/nursing-exam-nav-validation";

describe("marketing route integrity", () => {
  const { isValidPath } = createRouteValidator();

  it("US and CA exam strip + hero hubs resolve to valid internal routes", () => {
    for (const region of ["US", "CA"] as const) {
      const hubs = marketingExamPrepHubs(region);
      for (const href of Object.values(hubs)) {
        assert.equal(isWellFormedExamHubPath(href), true, href);
        assert.equal(isValidPath(href), true, href);
      }
    }
  });

  it("public CAT entry links are valid one-segment-under-hub paths", () => {
    for (const region of ["US", "CA"] as const) {
      for (const id of ["rn", "pn", "np", "allied"] as const) {
        const cat = publicMarketingCatHrefForOffering(region, id);
        assert.ok(cat.startsWith("/") && !cat.includes("//"), cat);
        assert.equal(isValidPath(cat), true, cat);
      }
    }
  });

  it("canonical Canada REx-PN hub matches validator and well-formed guard (locale prefix handled by middleware)", () => {
    const href = "/canada/rpn/rex-pn";
    assert.equal(isWellFormedExamHubPath(href), true);
    assert.equal(isValidPath(href), true);
  });

  it("marketingExamHubPath matches country-exam-offerings contract", () => {
    for (const region of ["US", "CA"] as const) {
      for (const id of ["rn", "pn", "np", "allied"] as const) {
        const href = marketingExamHubPath(region, id);
        assert.equal(isWellFormedExamHubPath(href), true);
        assert.equal(isValidPath(href), true);
      }
    }
  });
});
