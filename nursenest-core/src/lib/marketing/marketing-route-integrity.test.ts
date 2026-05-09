import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { createRouteValidator } from "../../../../scripts/audit-internal-links";
import {
  defaultPathwayIdForMarketingOffering,
  EXAM_PATHWAY_ORDER,
  getHomeHeroPrimaryTrackSpecs,
  marketingExamHubPath,
} from "@/lib/marketing/country-exam-offerings";
import { isPathwayPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import {
  marketingExamPrepHubs,
  publicMarketingCatHrefForOffering,
} from "@/lib/marketing/marketing-exam-navigation";
import { isWellFormedExamHubPath } from "@/lib/marketing/nursing-exam-nav-validation";
import { publicMarketingFooterStudyToolsDestinations } from "@/lib/navigation/canonical-destinations";

describe("marketing route integrity", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
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

  it("marketing footer study-tool deep links stay on canonical /app and /modules paths", () => {
    for (const region of ["US", "CA"] as const) {
      const d = publicMarketingFooterStudyToolsDestinations(region);
      assert.ok(d.cat.startsWith("/"), d.cat);
      assert.equal(isValidPath(d.cat), true, d.cat);
      assert.match(d.ecg, /^\/modules\/ecg\//);
      assert.match(d.osce, /^\/app\/osce\?/);
      assert.match(d.labs, /^\/app\/lab-drills\?/);
      assert.match(d.medicationMathApp, /^\/app\/med-calculations\?/);
      assert.equal(d.medicationMathTool, "/tools/med-math");
      assert.match(d.pharmacology, /^\/app\/questions\?/);
      const pid = new URLSearchParams(d.labs.split("?")[1] ?? "").get("pathwayId");
      assert.ok(pid && pid.length > 4, d.labs);
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

  it("homepage hero primary track paths match US/CA matrix (no mixed slugs)", () => {
    const expectedPaths = {
      US: {
        rn: "/us/rn/nclex-rn",
        pn: "/us/pn/nclex-pn",
        np: "/us/np/fnp",
        allied: "/allied/allied-health",
      },
      CA: {
        rn: "/canada/rn/nclex-rn",
        pn: "/canada/pn/rex-pn",
        np: "/canada/np/cnple",
        allied: "/allied/allied-health",
      },
    } as const;

    for (const region of ["US", "CA"] as const) {
      const specs = getHomeHeroPrimaryTrackSpecs(region);
      const exp = expectedPaths[region];
      const byId = Object.fromEntries(specs.map((s) => [s.id, s])) as Record<string, (typeof specs)[number]>;

      for (const id of EXAM_PATHWAY_ORDER) {
        const pathwayId = defaultPathwayIdForMarketingOffering(region, id);
        const published = isPathwayPublishedForPublicSite(pathwayId);
        const row = byId[id];
        if (published) {
          assert.ok(row, `${region} hero must include ${id} when ${pathwayId} is launch-published`);
          assert.equal(row.path, exp[id]);
          assert.equal(isWellFormedExamHubPath(row.path), true);
        } else {
          assert.equal(row, undefined, `${region} hero must omit ${id} until ${pathwayId} is launch-published`);
        }
      }
    }
  });

  it("resolveExamPathwaySafe rejects unsupported triples while keeping canonical hubs resolvable", async () => {
    assert.equal(
      await resolveExamPathwaySafe("us", "rpn", "rex-pn", { pathname: "/us/rpn/rex-pn" }),
      null,
    );

    const canadaPn = await resolveExamPathwaySafe("canada", "rpn", "rex-pn", {
      pathname: "/canada/rpn/rex-pn",
    });
    assert.ok(canadaPn);
    assert.equal(canadaPn.id, "ca-rpn-rex-pn");
  });

  it("default public exams family is request-time rendered to avoid build-time prerender fanout", () => {
    const examsLayout = readFileSync(join(dir, "..", "..", "app", "(marketing)", "(default)", "exams", "layout.tsx"), "utf8");
    assert.match(examsLayout, /export const dynamic = "force-dynamic"/);
  });
});
