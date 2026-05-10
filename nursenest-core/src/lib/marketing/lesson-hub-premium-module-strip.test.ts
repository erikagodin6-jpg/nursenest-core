import assert from "node:assert";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { buildLessonHubPremiumModuleStripLinks } from "@/lib/marketing/lesson-hub-premium-module-strip";

describe("buildLessonHubPremiumModuleStripLinks", () => {
  it("includes labs and OSCE-style app links for Canada RN NCLEX-RN when modules are unlocked", () => {
    const pathway = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(pathway);
    const links = buildLessonHubPremiumModuleStripLinks(pathway, {
      ecgModulePublic: true,
      clinicalScenariosPublic: true,
      oscePublic: true,
      signedIn: true,
      messages: {
        "components.examPathwayHub.premiumModules.labsTitle": "Lab values & interpretation",
        "components.examPathwayHub.premiumModules.osceTitle": "OSCE scenarios",
      },
    });
    const keys = links.map((l) => l.key);
    assert.ok(keys.includes("labs"));
    assert.ok(keys.includes("osce"));
    assert.ok(keys.includes("clinical_scenarios"));
    const labs = links.find((l) => l.key === "labs");
    assert.ok(labs?.href.includes("/app/lab-drills"));
    assert.equal(labs?.label, "Lab values & interpretation");
  });

  it("omits ECG when pathway does not allow linked learning (RPN)", () => {
    const pathway = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(pathway);
    const links = buildLessonHubPremiumModuleStripLinks(pathway, {
      ecgModulePublic: true,
      signedIn: true,
      messages: {},
    });
    assert.equal(
      links.some((l) => l.key === "ecg"),
      false,
      "ECG strip chip must not appear on PN/RPN pathways",
    );
  });
});
