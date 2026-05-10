/**
 * Contract: allied occupation hubs — premium module matrix, no ECG/NGN leakage, no `/admin` in built hrefs.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  buildPremiumMarketingModuleCards,
  resolvePremiumCardHref,
} from "@/lib/marketing/exam-pathway-hub-premium-modules";
import { alliedHubCatSurfaceUnlocked } from "@/lib/marketing/allied-hub-premium-module-policy";

const ALLIED = "us-allied-core";

function assertNoAdminInModel(json: string): void {
  assert.equal(/\/admin\/[^"'\s]*/i.test(json), false, "premium module models must not contain /admin/ URLs");
}

describe("allied hub premium module matrix (homepage contract suite)", () => {
  it("sample occupations + edge: no ECG, no NGN tools, no admin substrings in serialized cards", () => {
    const pathway = getExamPathwayById(ALLIED);
    assert.ok(pathway);
    const samples = ["mlt", "paramedic", "psychotherapy", "dietetic-technician"] as const;
    for (const alliedProfessionKey of samples) {
      const { studyTools } = buildPremiumMarketingModuleCards(pathway!, {
        clinicalScenariosPublic: true,
        oscePublic: false,
        alliedProfessionKey,
      });
      const json = JSON.stringify(studyTools);
      assertNoAdminInModel(json);
      assert.ok(!studyTools.some((c) => c.key === "ecg"), `${alliedProfessionKey}: no ECG tile on allied`);
      assert.ok(!studyTools.some((c) => c.key === "ngn_tools"), `${alliedProfessionKey}: no NGN tools on allied`);
      assert.ok(studyTools.some((c) => c.key === "flashcards"));
      assert.ok(studyTools.some((c) => c.key === "labs"));
      assert.ok(studyTools.some((c) => c.key === "skills_refresher"), `${alliedProfessionKey}: skills refresher`);
      assert.ok(studyTools.some((c) => c.key === "clinical_cases"), `${alliedProfessionKey}: clinical scenarios tile`);
      assert.ok(studyTools.some((c) => c.key === "allied_career_resources"), `${alliedProfessionKey}: career resources`);
      const catLocked = !alliedHubCatSurfaceUnlocked(alliedProfessionKey);
      assert.equal(
        studyTools.some((c) => c.key === "pathway_cat"),
        !catLocked,
        `${alliedProfessionKey}: pathway_cat only when CAT marketing unlocked`,
      );
    }
  });

  it("global allied hub cards omit occupation-scoped premium tiles when no profession is set", () => {
    const pathway = getExamPathwayById(ALLIED);
    assert.ok(pathway);
    const { studyTools } = buildPremiumMarketingModuleCards(pathway!, {
      clinicalScenariosPublic: false,
      oscePublic: false,
    });
    assert.ok(studyTools.some((c) => c.key === "skills_refresher"));
    assert.ok(!studyTools.some((c) => c.key === "pathway_cat"));
    assert.ok(!studyTools.some((c) => c.key === "clinical_cases"));
    assert.ok(!studyTools.some((c) => c.key === "allied_career_resources"));
  });

  it("labs + med calc + pharmacology locks apply for psychotherapy; labs unlocked for MLT", () => {
    const pathway = getExamPathwayById(ALLIED);
    assert.ok(pathway);
    const psych = buildPremiumMarketingModuleCards(pathway!, {
      clinicalScenariosPublic: false,
      oscePublic: false,
      alliedProfessionKey: "psychotherapy",
    }).studyTools;
    assert.equal(psych.find((c) => c.key === "labs")?.locked, true);
    assert.equal(psych.find((c) => c.key === "med_calc")?.locked, true);
    assert.equal(psych.find((c) => c.key === "pharmacology")?.locked, true);
    assert.equal(psych.find((c) => c.key === "skills_refresher")?.locked, true);

    const mlt = buildPremiumMarketingModuleCards(pathway!, {
      clinicalScenariosPublic: false,
      oscePublic: false,
      alliedProfessionKey: "mlt",
    }).studyTools;
    assert.ok(!mlt.find((c) => c.key === "labs")?.locked);
    assert.ok(!mlt.find((c) => c.key === "med_calc")?.locked);
    assert.ok(!mlt.find((c) => c.key === "skills_refresher")?.locked);
  });

  it("resolved guest hrefs for unlocked allied modules never point at admin", () => {
    const pathway = getExamPathwayById(ALLIED);
    assert.ok(pathway);
    const { studyTools } = buildPremiumMarketingModuleCards(pathway!, {
      clinicalScenariosPublic: false,
      oscePublic: false,
      alliedProfessionKey: "social-work",
    });
    for (const card of studyTools) {
      const href = resolvePremiumCardHref(card, false);
      assert.equal(/\/admin/i.test(href), false, `guest href for ${card.key}`);
    }
  });
});
