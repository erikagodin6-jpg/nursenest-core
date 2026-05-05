import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import {
  marketingHeaderLearnPracticeFlowDestinations,
  publicExamPrepHubDestinations,
} from "@/lib/navigation/canonical-destinations";
import { buildMarketingTierHubStrip } from "@/lib/navigation/marketing-tier-hub-strip";

const GENERIC_LESSONS_INDEX = "/lessons";

describe("top-tier marketing nav hub routes", () => {
  it("US: RN/NP/New Grad/Allied hubs are pathway roots, not the generic lessons-by-pathway index", () => {
    const hubs = publicExamPrepHubDestinations("US");
    assert.notEqual(hubs.rn, GENERIC_LESSONS_INDEX);
    assert.equal(hubs.rn, "/us/rn/nclex-rn");
    assert.equal(hubs.np, "/us/np/fnp");
    assert.equal(hubs.allied, "/us/allied/allied-health");
    assert.equal(hubs.pn, "/us/pn/nclex-pn");
    const strip = buildMarketingTierHubStrip("US", (k) => k);
    assert.equal(strip.find((r) => r.key === "rn")?.hubHref, hubs.rn);
    assert.equal(strip.find((r) => r.key === "np")?.hubHref, hubs.np);
    assert.equal(strip.find((r) => r.key === "allied")?.hubHref, hubs.allied);
    assert.equal(strip.find((r) => r.key === "pn")?.hubHref, hubs.pn);
    assert.equal(strip.find((r) => r.key === "newgrad")?.hubHref, "/us/rn/new-grad-transition");
  });

  it("CA: RN/NP/New Grad/Allied hubs are pathway roots; PN stays REx-PN hub", () => {
    const hubs = publicExamPrepHubDestinations("CA");
    assert.notEqual(hubs.rn, GENERIC_LESSONS_INDEX);
    assert.equal(hubs.rn, "/canada/rn/nclex-rn");
    assert.equal(hubs.np, "/canada/np/cnple");
    assert.equal(hubs.allied, "/canada/allied/allied-health");
    assert.equal(hubs.pn, "/canada/pn/rex-pn");
    const strip = buildMarketingTierHubStrip("CA", (k) => k);
    for (const row of strip) {
      assert.notEqual(row.hubHref, GENERIC_LESSONS_INDEX, `${row.key} must not land on mixed-tier lessons index`);
    }
    assert.equal(strip.find((r) => r.key === "newgrad")?.hubHref, "/canada/rn/nclex-rn");
  });

  it("marketingExamHubPath stays aligned with publicExamPrepHubDestinations for each offering", () => {
    for (const region of ["US", "CA"] as const) {
      const hubs = publicExamPrepHubDestinations(region);
      for (const id of ["rn", "pn", "np", "allied"] as const) {
        assert.equal(marketingExamHubPath(region, id), hubs[id]);
      }
    }
  });
});

describe("marketingHeaderLearnPracticeFlowDestinations (mobile Learn / Practice row)", () => {
  it("anonymous US targets RN hub lessons + questions, not /lessons or /question-bank", () => {
    const f = marketingHeaderLearnPracticeFlowDestinations("US", { tier: null, country: null });
    assert.equal(f.learnHref, "/us/rn/nclex-rn/lessons");
    assert.equal(f.practiceHref, "/us/rn/nclex-rn/questions");
    assert.ok(!f.practiceHref.includes("question-bank"));
  });

  it("entitled LPN/LVN US stays on PN hub for practice", () => {
    const f = marketingHeaderLearnPracticeFlowDestinations("US", { tier: "LVN_LPN", country: "US" });
    assert.equal(f.practiceHref, "/us/pn/nclex-pn/questions");
    assert.equal(f.learnMatchBase, "/us/pn/nclex-pn");
  });

  it("entitled NP CA stays on CNPLE hub", () => {
    const f = marketingHeaderLearnPracticeFlowDestinations("CA", { tier: "NP", country: "CA" });
    assert.equal(f.learnHref, "/canada/np/cnple/lessons");
    assert.equal(f.practiceHref, "/canada/np/cnple/questions");
  });

  it("PRE_NURSING uses pre-nursing surfaces only (no NCLEX hub)", () => {
    const f = marketingHeaderLearnPracticeFlowDestinations("US", { tier: "PRE_NURSING", country: "US" });
    assert.equal(f.practiceHref, "/pre-nursing");
    assert.equal(f.learnHref, "/pre-nursing/lessons");
    assert.ok(!f.practiceHref.includes("nclex"));
  });

  it("NEW_GRAD US uses transition pathway questions surface", () => {
    const f = marketingHeaderLearnPracticeFlowDestinations("US", { tier: "NEW_GRAD", country: "US" });
    assert.match(f.practiceHref, /new-grad-transition\/questions$/);
  });
});
