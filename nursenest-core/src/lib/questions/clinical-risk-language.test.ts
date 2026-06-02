import test from "node:test";
import assert from "node:assert/strict";

import { scanClinicalRiskLanguage } from "./clinical-risk-language";

function codes(input: Parameters<typeof scanClinicalRiskLanguage>[0]): string[] {
  return scanClinicalRiskLanguage(input).map((signal) => signal.code);
}

test("flags outdated routine oxygen wording for chest pain / ACS", () => {
  const result = scanClinicalRiskLanguage({
    stem: "A client presents with chest pain. The nurse should automatically apply oxygen to all clients with suspected ACS.",
    rationale: "Oxygen is always first for myocardial infarction.",
  });

  assert.ok(result.some((signal) => signal.code === "ACS_OXYGEN_OUTDATED_PATTERN"));
  assert.ok(result.some((signal) => signal.severity === "high"));
});

test("flags insulin without safety checks", () => {
  assert.ok(
    codes({
      stem: "The nurse prepares to administer rapid-acting insulin before transport.",
      rationale: "The dose should be administered promptly.",
    }).includes("INSULIN_WITHOUT_SAFETY_CHECK"),
  );
});

test("does not flag insulin when safety checks are present", () => {
  assert.equal(
    codes({
      stem: "The nurse checks blood glucose and confirms the client is eating before administering rapid-acting insulin.",
      rationale: "Assessing glucose and meal status reduces hypoglycemia risk.",
    }).includes("INSULIN_WITHOUT_SAFETY_CHECK"),
    false,
  );
});

test("flags antibiotics without allergy, renal, culture, or adverse-risk context", () => {
  assert.ok(
    codes({
      stem: "The provider prescribes vancomycin for a client with fever.",
      rationale: "Administer the antibiotic as ordered.",
    }).includes("ANTIBIOTIC_WITHOUT_ALLERGY_OR_RENAL_CONTEXT"),
  );
});

test("flags pediatric dosing claims", () => {
  assert.ok(
    codes({
      stem: "A pediatric client weighing 18 kg is prescribed 250 mg of medication.",
      rationale: "The nurse prepares the ordered dose.",
    }).includes("PEDIATRIC_DOSE_RISK"),
  );
});

test("flags potassium administration without safeguards", () => {
  assert.ok(
    codes({
      stem: "The nurse prepares IV potassium chloride for a client with hypokalemia.",
      rationale: "Potassium replacement is needed.",
    }).includes("POTASSIUM_ADMINISTRATION_RISK"),
  );
});

test("flags pregnancy medication risk", () => {
  assert.ok(
    codes({
      stem: "A pregnant client asks whether warfarin is safe during the first trimester.",
      rationale: "The medication plan should be reviewed.",
    }).includes("PREGNANCY_MEDICATION_RISK"),
  );
});
