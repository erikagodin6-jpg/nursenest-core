import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRouteValidator } from "../../../scripts/audit-internal-links";
import {
  getHomeHeroTierPillLinkSpecs,
  marketingExamHubPath,
} from "@/lib/marketing/country-exam-offerings";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
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

  it("homepage hero tier pill paths and PN label keys match US/CA matrix (no mixed slugs)", () => {
    const expectedPaths = {
      US: {
        rn: "/us/rn/nclex-rn",
        pn: "/us/lpn/nclex-pn",
        np: "/us/np/fnp",
        allied: "/us/allied/allied-health",
      },
      CA: {
        rn: "/canada/rn/nclex-rn",
        pn: "/canada/rpn/rex-pn",
        np: "/canada/np/cnple",
        allied: "/canada/allied/allied-health",
      },
    } as const;

    for (const region of ["US", "CA"] as const) {
      const specs = getHomeHeroTierPillLinkSpecs(region);
      const exp = expectedPaths[region];
      const byId = Object.fromEntries(specs.map((s) => [s.id, s])) as Record<string, (typeof specs)[number]>;

      assert.equal(byId.rn.path, exp.rn);
      assert.equal(byId.pn.path, exp.pn);
      assert.equal(byId.np.path, exp.np);
      assert.equal(byId.allied.path, exp.allied);
      assert.equal(byId["new-grad"].path, "/pre-nursing");

      assert.equal(byId.pn.tierPillLabelKey, region === "US" ? "home.conversion.tierPill.pnUS" : "home.conversion.tierPill.pnCA");
      assert.equal(isWellFormedExamHubPath(byId.rn.path), true);
      assert.equal(isWellFormedExamHubPath(byId.pn.path), true);
      assert.equal(isWellFormedExamHubPath(byId.np.path), true);
      assert.equal(isWellFormedExamHubPath(byId.allied.path), true);
      assert.equal(isValidPath(byId["new-grad"].path), true);
    }
  });

  it("resolveExamPathwaySafe rejects unsupported triples while keeping canonical hubs resolvable", () => {
    assert.equal(
      resolveExamPathwaySafe("us", "rpn", "rex-pn", { pathname: "/us/rpn/rex-pn" }),
      null,
    );

    const canadaPn = resolveExamPathwaySafe("canada", "rpn", "rex-pn", {
      pathname: "/canada/rpn/rex-pn",
    });
    assert.ok(canadaPn);
    assert.equal(canadaPn.id, "ca-rpn-rex-pn");
  });
});
