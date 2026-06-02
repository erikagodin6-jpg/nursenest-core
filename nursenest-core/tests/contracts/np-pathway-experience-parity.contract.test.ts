import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  listNpCertificationPathways,
  NP_CERTIFICATION_PATHWAY_COOKIE,
} from "../../src/lib/np/np-certification-pathways";
import { resolveNpCertificationPathwayId } from "../../src/lib/np/np-certification-selection";

const ROOT = process.cwd();
const src = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

describe("NP certification pathway selection", () => {
  it("registers all current NP certification pathways from the exam catalog", () => {
    const ids = listNpCertificationPathways().map((pathway) => pathway.pathwayId);
    assert.deepEqual(ids.sort(), [
      "ca-np-cnple",
      "us-np-agpcnp",
      "us-np-fnp",
      "us-np-pmhnp",
      "us-np-pnp-pc",
      "us-np-whnp",
    ].sort());
  });

  it("keeps specialty-specific hints, pearls, rationales, and readiness domains", () => {
    const byId = new Map(listNpCertificationPathways().map((pathway) => [pathway.pathwayId, pathway]));
    assert.match(byId.get("us-np-fnp")!.hint, /primary care/i);
    assert.match(byId.get("us-np-agpcnp")!.hint, /chronic disease|functional status/i);
    assert.match(byId.get("us-np-pmhnp")!.hint, /psychiatric/i);
    assert.match(byId.get("us-np-whnp")!.hint, /reproductive health/i);
    assert.match(byId.get("us-np-pnp-pc")!.hint, /developmental/i);
    assert.match(byId.get("ca-np-cnple")!.rationaleScope, /Canadian NP|CNPLE/i);
    for (const pathway of byId.values()) {
      assert.ok(pathway.clinicalPearl.length > 40, `${pathway.pathwayId} must have a meaningful clinical pearl`);
      assert.ok(pathway.readinessDomains.length >= 4, `${pathway.pathwayId} must have certification-specific readiness domains`);
    }
  });

  it("requires explicit NP selection before dashboard fallback when requested", () => {
    const noCookie = { get: () => undefined };
    assert.equal(resolveNpCertificationPathwayId({ cookieStore: noCookie, profilePathwayId: "us-np-fnp", requireExplicitSelection: true }), null);
    const cookieStore = { get: (name: string) => (name === NP_CERTIFICATION_PATHWAY_COOKIE ? { value: "us-np-pmhnp" } : undefined) };
    assert.equal(resolveNpCertificationPathwayId({ cookieStore, profilePathwayId: "us-np-fnp", requireExplicitSelection: true }), "us-np-pmhnp");
  });

  it("ships a learner selector route and persistence endpoint", () => {
    const page = src("src/app/(app)/app/(learner)/np/page.tsx");
    const api = src("src/app/api/learner/np-certification/route.ts");
    const selector = src("src/components/np/np-certification-selector.tsx");
    assert.match(page, /Choose Your Nurse Practitioner Certification Pathway|NpCertificationSelector/);
    assert.match(api, /NP_CERTIFICATION_PATHWAY_COOKIE/);
    assert.match(api, /res\.cookies\.set/);
    assert.match(selector, /data-np-certification-card/);
    assert.match(selector, /Questions/);
    assert.match(selector, /Lessons/);
    assert.match(selector, /Flashcards/);
    assert.match(selector, /Readiness/);
  });

  it("wires selected NP context into dashboard, learner chrome, and settings", () => {
    assert.match(src("src/app/(app)/app/(learner)/page.tsx"), /requireExplicitSelection: true/);
    assert.match(src("src/app/(app)/app/(learner)/page.tsx"), /selectedNpPathwayId/);
    assert.match(src("src/components/student/learner-study-home.tsx"), /Change Certification Pathway/);
    assert.match(src("src/app/(app)/app/(learner)/layout.tsx"), /effectivePathwayId/);
    assert.match(src("src/app/(app)/app/(learner)/account/settings/page.tsx"), /Change Certification Pathway/);
    assert.match(src("src/components/student/learner-study-settings-hub.tsx"), /Change Certification Pathway/);
  });

  it("uses existing pathway-scoped launch URLs instead of a generic NP pool", () => {
    const launchTiles = src("src/lib/learner/premium-dashboard-launch-tiles.ts");
    assert.match(launchTiles, /withPathwayQuery\(CANONICAL_LEARNER_ROUTES\.lessons, pathwayId\)/);
    assert.match(launchTiles, /withPathwayQuery\(CANONICAL_LEARNER_ROUTES\.flashcards, pathwayId\)/);
    assert.match(launchTiles, /withPathwayQuery\(CANONICAL_LEARNER_ROUTES\.practice, pathwayId\)/);
    assert.match(launchTiles, /withStudyToolPathwayQuery\(STUDY_TOOL_ROUTES\.clinicalSkills, pathwayId\)/);
    assert.match(launchTiles, /withPathwayQuery\(\"\/modules\/ecg\", pathwayId\)/);
    assert.match(src("src/lib/learner/pathway-scoped-href.ts"), /"\/app\/labs"/);
    assert.match(src("src/lib/learner/pathway-scoped-href.ts"), /"\/app\/study-plan"/);
    assert.match(src("src/lib/exam-pathways/pathway-content-scope.ts"), /npPathwaySpecialtyWhere\(pathway\)/);
  });
});
