import { describe, expect, it } from "vitest";
import { ClinicalNursingScenarioTier } from "@prisma/client";
import { clinicalScenarioTierNarrative } from "./clinical-scenario-tier-focus";

describe("RPN_PN clinical scenario tier gating — contract", () => {
  it("ClinicalNursingScenarioTier enum includes RPN_PN", () => {
    expect(ClinicalNursingScenarioTier.RPN_PN).toBe("RPN_PN");
  });

  it("clinicalScenarioTierNarrative returns a non-empty string for RPN_PN", () => {
    const narrative = clinicalScenarioTierNarrative(ClinicalNursingScenarioTier.RPN_PN);
    expect(typeof narrative).toBe("string");
    expect(narrative.length).toBeGreaterThan(0);
  });

  it("RPN_PN narrative mentions practical nursing scope concepts (trend monitoring, escalation, or documentation)", () => {
    const narrative = clinicalScenarioTierNarrative(ClinicalNursingScenarioTier.RPN_PN);
    expect(narrative).toMatch(/trend monitoring|escalation|documentation/i);
  });

  it("RPN_PN narrative does NOT mention differential diagnosis (NP-scope concept)", () => {
    const narrative = clinicalScenarioTierNarrative(ClinicalNursingScenarioTier.RPN_PN);
    expect(narrative).not.toMatch(/differential diagnosis/i);
  });

  it("NP tier narrative mentions differential diagnosis", () => {
    const narrative = clinicalScenarioTierNarrative(ClinicalNursingScenarioTier.NP);
    expect(narrative).toMatch(/differential diagnosis/i);
  });

  it("RN_NCLEX_RN tier narrative mentions prioritization or delegation", () => {
    const narrative = clinicalScenarioTierNarrative(ClinicalNursingScenarioTier.RN_NCLEX_RN);
    expect(narrative).toMatch(/prioriti[sz]ation|delegation/i);
  });

  it("NEW_GRAD tier narrative returns a non-empty string", () => {
    const narrative = clinicalScenarioTierNarrative(ClinicalNursingScenarioTier.NEW_GRAD);
    expect(narrative.length).toBeGreaterThan(0);
  });

  it("unknown tier returns empty string without throwing", () => {
    const narrative = clinicalScenarioTierNarrative("UNKNOWN_TIER");
    expect(narrative).toBe("");
  });
});
