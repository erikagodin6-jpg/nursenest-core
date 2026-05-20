/**
 * Phase 2 — Internal admissions prep: taxonomy, governance, metadata, sitemap exclusion, no commerce on scaffold.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
  getExamPathwayByRoute,
  resolveExamPathwayFromMarketingHubSegment,
} from "@/lib/exam-pathways/exam-product-registry";
import {
  INTERNAL_ADMISSIONS_PREP_PATHWAY_IDS,
  PHASE_ONE_HIDDEN_ADMISSIONS_SCAFFOLD_PATHWAY_IDS,
  marketingRobotsForExamPathway,
  shouldAllowInternalAdmissionsOverviewRoute,
  shouldOmitRegionalHreflangForInternalAdmissionsPrep,
} from "@/lib/exam-pathways/admissions-prep-internal-pathways";
import {
  INTERNAL_ADMISSIONS_PATHWAY_ID_TO_KIND,
  validateAdmissionsPrepTaxonomyUniqueIds,
} from "@/lib/exam-pathways/admissions-prep-taxonomy";
import { assessMarketingCatSurfaceWithoutAuth } from "@/lib/exam-pathways/cat-eligibility";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { isFreeStripeBillingNursingTier } from "@/lib/pricing/display-catalog";
import { collectExamPathwayUrls } from "@/lib/seo/sitemap-static-xml";
import { listPublishedExamPathwaysForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";

const ROOT = process.cwd();

describe("admissions prep phase 2 — taxonomy", () => {
  it("validates unique taxonomy IDs", () => {
    const res = validateAdmissionsPrepTaxonomyUniqueIds();
    assert.equal(res.ok, true);
  });

  it("maps every internal pathway id to a taxonomy kind", () => {
    for (const id of INTERNAL_ADMISSIONS_PREP_PATHWAY_IDS) {
      assert.ok(
        id in INTERNAL_ADMISSIONS_PATHWAY_ID_TO_KIND,
        `missing taxonomy kind for ${id}`,
      );
    }
    assert.equal(Object.keys(INTERNAL_ADMISSIONS_PATHWAY_ID_TO_KIND).length, INTERNAL_ADMISSIONS_PREP_PATHWAY_IDS.length);
  });

  it("limits phase 1 hidden scaffold expansion to HESI A2 and ATI TEAS", () => {
    assert.deepEqual(
      [...PHASE_ONE_HIDDEN_ADMISSIONS_SCAFFOLD_PATHWAY_IDS].sort(),
      ["us-allied-ati-teas", "us-allied-hesi-a2"],
    );
  });
});

describe("admissions prep phase 2 — hidden routes & flag", () => {
  it("resolveExamPathwaySafe returns null when flag off", async () => {
    const prev = process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS;
    delete process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS;
    try {
      const p = await resolveExamPathwaySafe("us", "allied", "hesi-a2", { pathname: "/us/allied/hesi-a2" });
      assert.equal(p, null);
    } finally {
      if (prev !== undefined) process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS = prev;
      else delete process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS;
    }
  });

  it("resolveExamPathwaySafe resolves scaffold pathways when flag on", async () => {
    process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS = "1";
    try {
      const a = await resolveExamPathwaySafe("us", "allied", "hesi-exit", { pathname: "/us/allied/hesi-exit" });
      assert.ok(a);
      assert.equal(a!.id, "us-allied-hesi-exit");
    } finally {
      delete process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS;
    }
  });

  it("public marketing resolution never exposes admissions URLs", () => {
    for (const exam of ["hesi-a2", "hesi-exit", "ati-teas"] as const) {
      assert.equal(resolveExamPathwayFromMarketingHubSegment("us", "allied", exam), undefined);
    }
  });

  it("allows only the exact overview route for A2 and ATI TEAS", () => {
    const hesi = getExamPathwayByRoute("us", "allied", "hesi-a2")!;
    process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS = "1";
    try {
      assert.equal(
        shouldAllowInternalAdmissionsOverviewRoute(hesi, "/us/allied/hesi-a2", "/us/allied/hesi-a2"),
        true,
      );
      assert.equal(
        shouldAllowInternalAdmissionsOverviewRoute(hesi, "/us/allied/hesi-a2", "/us/allied/hesi-a2/questions"),
        false,
      );
    } finally {
      delete process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS;
    }
  });

  it("keeps HESI Exit blocked from phase 1 hidden scaffold exposure", () => {
    const exit = getExamPathwayByRoute("us", "allied", "hesi-exit")!;
    process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS = "1";
    try {
      assert.equal(
        shouldAllowInternalAdmissionsOverviewRoute(exit, "/us/allied/hesi-exit", "/us/allied/hesi-exit"),
        false,
      );
    } finally {
      delete process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS;
    }
  });
});

describe("admissions prep phase 2 — metadata & hreflang governance", () => {
  it("hidden admissions pathways use noindex/nofollow robots", () => {
    const p = getExamPathwayByRoute("us", "allied", "ati-teas")!;
    assert.equal(p.status, "hidden");
    const robots = marketingRobotsForExamPathway(p);
    assert.equal(robots.index, false);
    assert.equal(robots.follow, false);
  });

  it("omits regional hreflang alternates for internal admissions scaffold pathways", () => {
    const p = getExamPathwayByRoute("us", "allied", "hesi-a2")!;
    assert.equal(shouldOmitRegionalHreflangForInternalAdmissionsPrep(p), true);
  });
});

describe("admissions prep phase 2 — public listings & sitemap", () => {
  it("excludes admissions pathways from published public pathway list", () => {
    const pub = listPublishedExamPathwaysForPublicSite();
    for (const id of INTERNAL_ADMISSIONS_PREP_PATHWAY_IDS) {
      assert.ok(!pub.some((x) => x.id === id));
    }
  });

  it("collectExamPathwayUrls does not emit admissions-prep hub URLs", async () => {
    const urls = await collectExamPathwayUrls("https://www.example.com");
    for (const segment of ["hesi-a2", "hesi-exit", "ati-teas"]) {
      assert.ok(!urls.some((u) => u.includes(`/allied/${segment}`)), segment);
    }
  });
});

describe("admissions prep phase 2 — checkout and pool isolation", () => {
  it("keeps HESI A2 and ATI TEAS on the free PRE_NURSING tier with no Stripe checkout", () => {
    for (const exam of ["hesi-a2", "ati-teas"] as const) {
      const pathway = getExamPathwayByRoute("us", "allied", exam)!;
      assert.equal(pathway.stripeTier, "PRE_NURSING");
      assert.equal(isFreeStripeBillingNursingTier(pathway.stripeTier), true);
    }
  });

  it("fails question-bank scope closed for admissions pathways with empty contentExamKeys", () => {
    const pathway = getExamPathwayByRoute("us", "allied", "hesi-a2")!;
    const where = questionAccessWhereWithPathway(
      {
        hasAccess: true,
        reason: "active_subscription",
        tier: "PRE_NURSING",
        country: "US",
        alliedCareer: null,
      },
      pathway,
    );
    assert.deepEqual(where, { id: { in: [] } });
  });

  it("marks hidden admissions CAT as info-only rather than launchable", () => {
    const pathway = getExamPathwayByRoute("us", "allied", "ati-teas")!;
    const assessment = assessMarketingCatSurfaceWithoutAuth(pathway, { status: "unavailable" });
    assert.equal(assessment.reason, "pathway_info_only");
    assert.equal(assessment.marketingPrimaryCta, "none");
  });
});

describe("admissions prep phase 2 — scaffold source hygiene", () => {
  const scaffoldPath = path.resolve(ROOT, "src/components/marketing/internal-admissions-prep-hub-scaffold.tsx");

  it("scaffold source avoids checkout / Stripe / subscription API wiring", () => {
    const src = fs.readFileSync(scaffoldPath, "utf8").toLowerCase();
    const forbidden = ["stripe.com", "/api/subscriptions/checkout", "loadstripe"];
    for (const f of forbidden) {
      assert.ok(!src.includes(f), `forbidden fragment in scaffold: ${f}`);
    }
  });

  it("exam pathway page branches to InternalAdmissionsPrepHubScaffold before NCLEX hub content", () => {
    const pagePath = path.resolve(
      ROOT,
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx",
    );
    const src = fs.readFileSync(pagePath, "utf8");
    const idxEarly = src.indexOf("if (isInternalAdmissionsPrepPathwayId(pathway.id) && isPhaseOneHiddenAdmissionsScaffoldPathwayId(pathway.id))");
    const idxBuildContent = src.indexOf("buildNursingTierHubContent(pathway)");
    assert.ok(idxEarly > 0);
    assert.ok(idxBuildContent > 0);
    assert.ok(idxEarly < idxBuildContent, "early admissions return must precede NCLEX hub content builder");
    assert.ok(src.includes("isInternalAdmissionsPrepPathwayId"));
    assert.ok(src.includes("isPhaseOneHiddenAdmissionsScaffoldPathwayId"));
    assert.ok(src.includes("InternalAdmissionsPrepHubScaffold"));
  });

  it("layout blocks hidden admissions subroutes unless the request is the exact overview path", () => {
    const layoutPath = path.resolve(
      ROOT,
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/layout.tsx",
    );
    const src = fs.readFileSync(layoutPath, "utf8");
    assert.ok(src.includes("shouldAllowInternalAdmissionsOverviewRoute"));
    assert.match(src, /pathway\.status === "hidden"/);
  });
});

describe("admissions prep phase 2 — registry hygiene", () => {
  it("every admissions pathway row stays hidden in catalog", () => {
    for (const id of INTERNAL_ADMISSIONS_PREP_PATHWAY_IDS) {
      const p = EXAM_PATHWAYS.find((x) => x.id === id);
      assert.ok(p, id);
      assert.equal(p!.status, "hidden");
    }
  });
});
