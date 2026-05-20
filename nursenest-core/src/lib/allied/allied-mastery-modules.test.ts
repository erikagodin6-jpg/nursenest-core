import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ALLIED_PROFESSION_KEYS, resolveAlliedProfessionFromRouteSlug } from "@/lib/allied/allied-professions-registry";
import {
  ALLIED_MASTERY_MODULES,
  alliedMasteryModulesForProfession,
  findAlliedMasteryModule,
  isAdminModulePreviewEnabled,
  isAlliedMasteryModulesPublicEnabled,
} from "@/lib/allied/allied-mastery-modules";
import {
  createDraftScaffoldForModule,
  evaluateAlliedMasteryScaffold,
  mergeScaffoldWithoutOverwrite,
} from "@/lib/allied/allied-mastery-module-scaffolding";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function readWorkspaceFile(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

function listFiles(relativePath: string): string[] {
  const absolutePath = join(appRoot, relativePath);
  if (!existsSync(absolutePath)) return [];
  const stat = statSync(absolutePath);
  if (stat.isFile()) return [absolutePath];
  const entries = readdirSync(absolutePath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const child = join(relativePath, entry.name);
    if (entry.isDirectory()) return listFiles(child);
    if (entry.isFile()) return [join(appRoot, child)];
    return [];
  });
}

function readFiles(relativePaths: string[]): string {
  return relativePaths.flatMap(listFiles).map((file) => readFileSync(file, "utf8")).join("\n");
}

test("all allied mastery modules are hidden admin-preview shells", () => {
  assert.equal(ALLIED_MASTERY_MODULES.length, 22);
  for (const module of ALLIED_MASTERY_MODULES) {
    assert.equal(module.isPublic, false, module.id);
    assert.equal(module.adminPreviewOnly, true, module.id);
    assert.equal(module.access, "admin_preview_only", module.id);
    assert.ok(module.entitlementKey.startsWith("ALLIED_"), module.id);
    assert.ok(module.route.startsWith("/allied/"), module.id);
    assert.match(module.route, /\/modules\/[a-z0-9-]+$/);
    assert.ok(module.contentTypes.includes("lessons"), module.id);
    assert.ok(module.contentTypes.includes("worksheets"), module.id);
    assert.ok(module.contentTypes.includes("clinical_action_layer"), module.id);
  }
});

test("feature flags default to hidden public modules and enabled admin preview", () => {
  assert.equal(isAlliedMasteryModulesPublicEnabled({ ENABLE_ALLIED_MASTERY_MODULES: undefined }), false);
  assert.equal(isAlliedMasteryModulesPublicEnabled({ ENABLE_ALLIED_MASTERY_MODULES: "false" }), false);
  assert.equal(isAlliedMasteryModulesPublicEnabled({ ENABLE_ALLIED_MASTERY_MODULES: "true" }), true);
  assert.equal(isAdminModulePreviewEnabled({ ENABLE_ADMIN_MODULE_PREVIEW: undefined }), true);
  assert.equal(isAdminModulePreviewEnabled({ ENABLE_ADMIN_MODULE_PREVIEW: "false" }), false);
});

test("modules use existing allied profession keys only", () => {
  const liveKeys = new Set(ALLIED_PROFESSION_KEYS);
  for (const module of ALLIED_MASTERY_MODULES) {
    for (const key of module.professionKeys) {
      assert.ok(liveKeys.has(key), `${module.id} uses unknown profession key ${key}`);
    }
  }
});

test("occupation mapping keeps modules profession-specific", () => {
  assert.ok(findAlliedMasteryModule("respiratory", "abg"));
  assert.ok(findAlliedMasteryModule("respiratory", "ventilator-management"));
  assert.ok(findAlliedMasteryModule("respiratory", "oxygen-delivery"));
  assert.ok(findAlliedMasteryModule("respiratory", "respiratory-distress"));
  assert.ok(findAlliedMasteryModule("paramedic", "oxygen-delivery"));
  assert.ok(findAlliedMasteryModule("paramedic", "respiratory-distress"));
  assert.ok(findAlliedMasteryModule("paramedic", "iv-infusion-safety"));
  assert.ok(findAlliedMasteryModule("pharmacy-tech", "iv-infusion-safety"));
  assert.ok(findAlliedMasteryModule("paramedic", "neuro-stroke-recognition"));
  assert.ok(findAlliedMasteryModule("ota", "neuro-stroke-recognition"));
  assert.ok(findAlliedMasteryModule("mlt", "advanced-lab-interpretation"));

  const mltModule = findAlliedMasteryModule("mlt", "advanced-lab-interpretation");
  assert.equal(mltModule?.route, "/allied/medical-lab-technology/modules/advanced-lab-interpretation");
  assert.equal(mltModule?.entitlementKey, "ALLIED_ADVANCED_LAB_INTERPRETATION_PAID");
  assert.deepEqual(mltModule?.professionKeys, ["mlt"]);

  assert.deepEqual(
    alliedMasteryModulesForProfession("respiratory").map((module) => module.slug).sort(),
    ["abg", "oxygen-delivery", "respiratory-distress", "ventilator-basics", "ventilator-management"],
  );
  assert.deepEqual(
    alliedMasteryModulesForProfession("paramedic").map((module) => module.slug).sort(),
    ["emergency-pattern-recognition", "iv-infusion-safety", "neuro-stroke-recognition", "oxygen-delivery", "respiratory-distress", "trauma-triage"],
  );
  assert.deepEqual(
    alliedMasteryModulesForProfession("mlt").map((module) => module.slug).sort(),
    ["advanced-lab-interpretation"],
  );
  assert.deepEqual(
    alliedMasteryModulesForProfession("pharmacy-tech").map((module) => module.slug).sort(),
    ["dosage-calculations", "iv-infusion-safety", "pharmacology-patterns"],
  );
  assert.equal(findAlliedMasteryModule("respiratory", "pharmacology-patterns"), null);
  assert.equal(findAlliedMasteryModule("respiratory", "advanced-lab-interpretation"), null);
  assert.equal(findAlliedMasteryModule("pharmacy-tech", "advanced-lab-interpretation"), null);
  assert.equal(findAlliedMasteryModule("ota", "advanced-lab-interpretation"), null);
  assert.equal(findAlliedMasteryModule("pta", "advanced-lab-interpretation"), null);
  assert.equal(findAlliedMasteryModule("pta", "adl-functional-assessment"), null);
  assert.equal(findAlliedMasteryModule("ota", "msk-rehab-assessment"), null);
  assert.ok(findAlliedMasteryModule("pta", "movement-injury-mechanics"));
  assert.ok(findAlliedMasteryModule("ota", "functional-assessment-adl-safety"));
  assert.equal(findAlliedMasteryModule("ota", "movement-injury-mechanics"), null);
  assert.equal(findAlliedMasteryModule("pta", "functional-assessment-adl-safety"), null);
  assert.equal(findAlliedMasteryModule("imaging", "abg"), null);
  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "respiratory")) {
    assert.equal(findAlliedMasteryModule(professionKey, "abg"), null, `${professionKey} should not receive ABG`);
    assert.equal(findAlliedMasteryModule(professionKey, "ventilator-management"), null, `${professionKey} should not receive Ventilator Management`);
  }
  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "respiratory" && key !== "paramedic")) {
    assert.equal(findAlliedMasteryModule(professionKey, "oxygen-delivery"), null, `${professionKey} should not receive Oxygen Delivery`);
    assert.equal(findAlliedMasteryModule(professionKey, "respiratory-distress"), null, `${professionKey} should not receive Respiratory Distress`);
  }
  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "pharmacy-tech" && key !== "paramedic")) {
    assert.equal(findAlliedMasteryModule(professionKey, "iv-infusion-safety"), null, `${professionKey} should not receive IV Infusion Safety`);
  }
  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "paramedic" && key !== "ota")) {
    assert.equal(findAlliedMasteryModule(professionKey, "neuro-stroke-recognition"), null, `${professionKey} should not receive Neuro Stroke Recognition`);
  }
  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "mlt")) {
    assert.equal(
      findAlliedMasteryModule(professionKey, "advanced-lab-interpretation"),
      null,
      `${professionKey} should not receive Advanced Lab Interpretation`,
    );
  }
});

test("required allied mastery modules use canonical profession keys and routes", () => {
  const expected = [
    ["respiratory", "abg", "ALLIED_ABG_MASTERY_PAID", "/allied/respiratory-therapy/modules/abg"],
    ["respiratory", "ventilator-basics", "ALLIED_VENTILATOR_BASICS_PAID", "/allied/respiratory-therapy/modules/ventilator-basics"],
    ["respiratory", "ventilator-management", "ALLIED_VENTILATOR_MANAGEMENT_PAID", "/allied/respiratory-therapy/modules/ventilator-management"],
    ["respiratory", "oxygen-delivery", "ALLIED_OXYGEN_DELIVERY_PAID", "/allied/respiratory-therapy/modules/oxygen-delivery"],
    ["respiratory", "respiratory-distress", "ALLIED_RESPIRATORY_DISTRESS_PAID", "/allied/respiratory-therapy/modules/respiratory-distress"],
    ["mlt", "advanced-lab-interpretation", "ALLIED_ADVANCED_LAB_INTERPRETATION_PAID", "/allied/medical-lab-technology/modules/advanced-lab-interpretation"],
    ["pharmacy-tech", "pharmacology-patterns", "ALLIED_PHARMACOLOGY_PATTERNS_PAID", "/allied/pharmacy-tech/modules/pharmacology-patterns"],
    ["pharmacy-tech", "dosage-calculations", "ALLIED_DOSAGE_CALCULATIONS_PAID", "/allied/pharmacy-tech/modules/dosage-calculations"],
    ["ota", "adl-functional-assessment", "ALLIED_ADL_FUNCTIONAL_ASSESSMENT_PAID", "/allied/ota/modules/adl-functional-assessment"],
    ["pta", "msk-rehab-assessment", "ALLIED_MSK_REHAB_ASSESSMENT_PAID", "/allied/pta/modules/msk-rehab-assessment"],
    ["imaging", "image-recognition", "ALLIED_IMAGE_RECOGNITION_PAID", "/allied/imaging/modules/image-recognition"],
    ["sonography", "ecg-cardiac-patterns", "ALLIED_CARDIAC_PATTERN_RECOGNITION_PAID", "/allied/sonography/modules/ecg-cardiac-patterns"],
    ["paramedic", "oxygen-delivery", "ALLIED_OXYGEN_DELIVERY_PAID", "/allied/paramedic/modules/oxygen-delivery"],
    ["paramedic", "respiratory-distress", "ALLIED_RESPIRATORY_DISTRESS_PAID", "/allied/paramedic/modules/respiratory-distress"],
    ["pharmacy-tech", "iv-infusion-safety", "ALLIED_IV_INFUSION_SAFETY_PAID", "/allied/pharmacy-tech/modules/iv-infusion-safety"],
    ["paramedic", "iv-infusion-safety", "ALLIED_IV_INFUSION_SAFETY_PAID", "/allied/paramedic/modules/iv-infusion-safety"],
    ["paramedic", "neuro-stroke-recognition", "ALLIED_NEURO_STROKE_RECOGNITION_PAID", "/allied/paramedic/modules/neuro-stroke-recognition"],
    ["ota", "neuro-stroke-recognition", "ALLIED_NEURO_STROKE_RECOGNITION_PAID", "/allied/occupational-therapy/modules/neuro-stroke-recognition"],
    ["paramedic", "trauma-triage", "ALLIED_TRAUMA_TRIAGE_PAID", "/allied/paramedic/modules/trauma-triage"],
    ["paramedic", "emergency-pattern-recognition", "ALLIED_EMERGENCY_PATTERN_RECOGNITION_PAID", "/allied/paramedic/modules/emergency-pattern-recognition"],
    ["pta", "movement-injury-mechanics", "ALLIED_MOVEMENT_INJURY_MECHANICS_PAID", "/allied/physiotherapy/modules/movement-injury-mechanics"],
    ["ota", "functional-assessment-adl-safety", "ALLIED_FUNCTIONAL_ASSESSMENT_ADL_SAFETY_PAID", "/allied/occupational-therapy/modules/functional-assessment-adl-safety"],
  ] as const;

  for (const [professionKey, slug, entitlementKey, route] of expected) {
    const module = findAlliedMasteryModule(professionKey, slug);
    assert.ok(module, `${professionKey}/${slug}`);
    assert.equal(module.route, route);
    assert.equal(module.entitlementKey, entitlementKey);
    assert.equal(module.isPublic, false);
    assert.equal(module.adminPreviewOnly, true);
  }
});

test("Neurological Assessment + Stroke Recognition module is hidden and mapped only to Paramedic and OT", () => {
  const paramedic = findAlliedMasteryModule("paramedic", "neuro-stroke-recognition");
  const ot = findAlliedMasteryModule("ota", "neuro-stroke-recognition");
  assert.ok(paramedic);
  assert.ok(ot);
  assert.equal(paramedic.route, "/allied/paramedic/modules/neuro-stroke-recognition");
  assert.equal(ot.route, "/allied/occupational-therapy/modules/neuro-stroke-recognition");
  assert.equal(paramedic.entitlementKey, "ALLIED_NEURO_STROKE_RECOGNITION_PAID");
  assert.equal(ot.entitlementKey, "ALLIED_NEURO_STROKE_RECOGNITION_PAID");
  assert.deepEqual(paramedic.professionKeys, ["paramedic"]);
  assert.deepEqual(ot.professionKeys, ["ota"]);
  assert.equal(paramedic.isPublic, false);
  assert.equal(ot.isPublic, false);
  assert.equal(paramedic.adminPreviewOnly, true);
  assert.equal(ot.adminPreviewOnly, true);
  const sections = paramedic.sections.join("\n");
  for (const expected of [
    "Basic neuro assessment",
    "FAST/BE-FAST",
    "GCS basics",
    "facial droop",
    "increased ICP",
    "hypoglycemia",
    "OT functional implications",
    "acute facial droop",
    "altered LOC with low glucose",
    "unilateral neglect",
    "FAST/BE-FAST map",
    "GCS interpretation map",
    "stroke vs mimic map",
    "OT functional deficit",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.ok(paramedic.sections.filter((section) => /^Rapid drills:/i.test(section)).length >= 10);
  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "paramedic" && key !== "ota")) {
    assert.equal(findAlliedMasteryModule(professionKey, "neuro-stroke-recognition"), null);
  }
});

test("IV Therapy and Infusion Safety module is hidden and mapped only to Pharmacy Tech and Paramedic", () => {
  const pharmacy = findAlliedMasteryModule("pharmacy-tech", "iv-infusion-safety");
  const paramedic = findAlliedMasteryModule("paramedic", "iv-infusion-safety");
  assert.ok(pharmacy);
  assert.ok(paramedic);
  assert.equal(pharmacy.route, "/allied/pharmacy-tech/modules/iv-infusion-safety");
  assert.equal(paramedic.route, "/allied/paramedic/modules/iv-infusion-safety");
  assert.equal(pharmacy.entitlementKey, "ALLIED_IV_INFUSION_SAFETY_PAID");
  assert.equal(paramedic.entitlementKey, "ALLIED_IV_INFUSION_SAFETY_PAID");
  assert.deepEqual(pharmacy.professionKeys, ["pharmacy-tech"]);
  assert.deepEqual(paramedic.professionKeys, ["paramedic"]);
  assert.equal(pharmacy.isPublic, false);
  assert.equal(paramedic.isPublic, false);
  assert.equal(pharmacy.adminPreviewOnly, true);
  assert.equal(paramedic.adminPreviewOnly, true);

  const sections = pharmacy.sections.join("\n");
  for (const expected of [
    "IV therapy basics",
    "isotonic",
    "hypotonic",
    "hypertonic",
    "common infusion risks",
    "medication order safety",
    "infusion rate basics",
    "IV compatibility basics",
    "infiltration vs extravasation",
    "signs of infusion reaction",
    "high-alert medication awareness",
    "when to stop/escalate",
    "infusion reaction during medication administration",
    "infiltration/extravasation concern",
    "incompatible IV medication warning",
    "fluid overload risk",
    "high-alert medication order check",
    "paramedic fluid resuscitation scenario",
    "infiltration vs extravasation map",
    "infusion reaction escalation map",
    "fluid type comparison map",
    "compatibility safety map",
    "medication order safety check map",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.ok(pharmacy.sections.filter((section) => /^Rapid drills:/i.test(section)).length >= 10);

  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "pharmacy-tech" && key !== "paramedic")) {
    assert.equal(findAlliedMasteryModule(professionKey, "iv-infusion-safety"), null);
  }
});

test("Respiratory Distress module is hidden and mapped only to RT and Paramedic", () => {
  const respiratory = findAlliedMasteryModule("respiratory", "respiratory-distress");
  const paramedic = findAlliedMasteryModule("paramedic", "respiratory-distress");
  assert.ok(respiratory);
  assert.ok(paramedic);
  assert.equal(respiratory.route, "/allied/respiratory-therapy/modules/respiratory-distress");
  assert.equal(paramedic.route, "/allied/paramedic/modules/respiratory-distress");
  assert.equal(respiratory.entitlementKey, "ALLIED_RESPIRATORY_DISTRESS_PAID");
  assert.equal(paramedic.entitlementKey, "ALLIED_RESPIRATORY_DISTRESS_PAID");
  assert.deepEqual(respiratory.professionKeys, ["respiratory"]);
  assert.deepEqual(paramedic.professionKeys, ["paramedic"]);
  assert.equal(respiratory.isPublic, false);
  assert.equal(paramedic.isPublic, false);
  assert.equal(respiratory.adminPreviewOnly, true);
  assert.equal(paramedic.adminPreviewOnly, true);

  const sections = respiratory.sections.join("\n");
  for (const expected of [
    "What respiratory distress looks like",
    "accessory muscle use",
    "retractions",
    "nasal flaring",
    "tripod positioning",
    "inability to speak full sentences",
    "SpO2 interpretation",
    "respiratory rate interpretation",
    "wheezes",
    "crackles",
    "stridor",
    "diminished/absent sounds",
    "Oxygenation vs ventilation",
    "respiratory failure",
    "asthma exacerbation with wheezing",
    "CHF/pulmonary edema with crackles",
    "anaphylaxis/upper airway swelling with stridor",
    "COPD exacerbation with CO2 retention risk",
    "opioid overdose with hypoventilation",
    "trauma patient with absent breath sounds",
    "pediatric respiratory distress",
    "lung sound → likely cause map",
    "oxygenation vs ventilation map",
    "distress vs failure progression map",
    "oxygen escalation decision map",
    "RT/Paramedic priority action map",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.ok(respiratory.sections.filter((section) => /^Rapid drills:/i.test(section)).length >= 10);

  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "respiratory" && key !== "paramedic")) {
    assert.equal(findAlliedMasteryModule(professionKey, "respiratory-distress"), null);
  }
});

test("Oxygen Delivery module is hidden and mapped only to RT and Paramedic", () => {
  const respiratory = findAlliedMasteryModule("respiratory", "oxygen-delivery");
  const paramedic = findAlliedMasteryModule("paramedic", "oxygen-delivery");
  assert.ok(respiratory);
  assert.ok(paramedic);
  assert.equal(respiratory.route, "/allied/respiratory-therapy/modules/oxygen-delivery");
  assert.equal(paramedic.route, "/allied/paramedic/modules/oxygen-delivery");
  assert.equal(respiratory.entitlementKey, "ALLIED_OXYGEN_DELIVERY_PAID");
  assert.equal(paramedic.entitlementKey, "ALLIED_OXYGEN_DELIVERY_PAID");
  assert.deepEqual(respiratory.professionKeys, ["respiratory"]);
  assert.deepEqual(paramedic.professionKeys, ["paramedic"]);
  assert.equal(respiratory.isPublic, false);
  assert.equal(paramedic.isPublic, false);
  assert.equal(respiratory.adminPreviewOnly, true);
  assert.equal(paramedic.adminPreviewOnly, true);

  const sections = respiratory.sections.join("\n");
  for (const expected of [
    "SpO2 vs PaO2",
    "nasal cannula",
    "simple mask",
    "non-rebreather",
    "Venturi mask",
    "HFNC",
    "CPAP",
    "BiPAP/NIV",
    "flow rate",
    "approximate FiO2",
    "indications",
    "limitations",
    "risks",
    "device recognition",
    "FiO2 estimation",
    "COPD patient needing controlled oxygen",
    "acute hypoxia SpO2 below 85%",
    "trauma patient",
    "pediatric respiratory distress",
    "patient not improving on nasal cannula",
    "patient requiring escalation to NRB or HFNC",
    "oxygen escalation ladder",
    "FiO2 comparison map",
    "controlled vs uncontrolled oxygen logic",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.ok(respiratory.sections.filter((section) => /^Rapid drills:/i.test(section)).length >= 10);

  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "respiratory" && key !== "paramedic")) {
    assert.equal(findAlliedMasteryModule(professionKey, "oxygen-delivery"), null);
  }
});

test("Respiratory Therapy Ventilator Management module uses requested hidden preview route and content structure", () => {
  const module = findAlliedMasteryModule("respiratory", "ventilator-management");
  assert.ok(module);
  assert.equal(module.route, "/allied/respiratory-therapy/modules/ventilator-management");
  assert.equal(module.entitlementKey, "ALLIED_VENTILATOR_MANAGEMENT_PAID");
  assert.deepEqual(module.professionKeys, ["respiratory"]);
  assert.equal(module.isPublic, false);
  assert.equal(module.adminPreviewOnly, true);
  assert.equal(module.access, "admin_preview_only");

  const sections = module.sections.join("\n");
  for (const expected of [
    "What mechanical ventilation does",
    "AC/VC",
    "AC/PC",
    "SIMV",
    "PSV",
    "CPAP",
    "BiPAP/NIV",
    "tidal volume",
    "respiratory rate",
    "FiO2",
    "PEEP",
    "pressure support",
    "inspiratory pressure",
    "I:E ratio",
    "Oxygenation vs ventilation",
    "Peak pressure vs plateau pressure",
    "Alarms and troubleshooting",
    "Weaning basics",
    "ARDS with low oxygenation",
    "COPD with rising CO2",
    "high peak pressure",
    "low exhaled tidal volume alarm",
    "accidental extubation/disconnection",
    "weaning readiness",
    "PaCO2 rising",
    "SpO2 low despite FiO2",
    "high peak pressure with normal plateau",
    "low pressure alarm",
    "oxygenation problem map",
    "ventilation problem map",
    "peak vs plateau pressure map",
    "alarm troubleshooting map",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }

  const rapidDrills = module.sections.filter((section) => /^Rapid drills:/i.test(section));
  assert.ok(rapidDrills.length >= 10);
  assert.deepEqual(module.actionLayer, [
    "What is happening?",
    "Why it matters",
    "What to assess",
    "What action is priority",
    "When to escalate/call provider/team",
  ]);
});

test("Respiratory Therapy ABG module uses requested hidden preview route and content structure", () => {
  const prof = resolveAlliedProfessionFromRouteSlug("respiratory-therapy");
  assert.equal(prof?.professionKey, "respiratory");

  const module = findAlliedMasteryModule("respiratory", "abg");
  assert.ok(module);
  assert.equal(module.route, "/allied/respiratory-therapy/modules/abg");
  assert.equal(module.entitlementKey, "ALLIED_ABG_MASTERY_PAID");
  assert.deepEqual(module.professionKeys, ["respiratory"]);
  assert.equal(module.isPublic, false);
  assert.equal(module.adminPreviewOnly, true);
  assert.equal(module.access, "admin_preview_only");
  assert.deepEqual(module.contentTypes, [
    "lessons",
    "quizzes",
    "case_scenarios",
    "rapid_drills",
    "worksheets",
    "pattern_maps",
    "clinical_action_layer",
  ]);

  const sections = module.sections.join("\n");
  for (const expected of [
    "What is an ABG?",
    "pH",
    "PaCO2",
    "HCO3",
    "PaO2",
    "SaO2",
    "acidosis vs alkalosis",
    "respiratory vs metabolic",
    "compensation basics",
    "uncompensated",
    "partially compensated",
    "fully compensated",
    "mixed disorders",
    "COPD exacerbation",
    "DKA",
    "sepsis/lactic acidosis",
    "opioid overdose",
    "pulmonary embolism",
    "classify ABG pattern",
    "identify priority action",
    "student version",
    "answer key version",
    "pH + CO2 + HCO3 logic map",
    "compensation map",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }

  assert.deepEqual(module.actionLayer, [
    "What is happening?",
    "Why it matters",
    "Oxygenation or ventilation concern",
    "What to assess",
    "What to do first",
    "When to escalate",
  ]);
});

test("MLT Advanced Lab Interpretation shell includes requested hidden content structure", () => {
  const prof = resolveAlliedProfessionFromRouteSlug("medical-lab-technology");
  assert.equal(prof?.professionKey, "mlt");

  const module = findAlliedMasteryModule("mlt", "advanced-lab-interpretation");
  assert.ok(module);
  assert.equal(module.route, "/allied/medical-lab-technology/modules/advanced-lab-interpretation");
  assert.equal(module.entitlementKey, "ALLIED_ADVANCED_LAB_INTERPRETATION_PAID");
  assert.deepEqual(module.professionKeys, ["mlt"]);
  assert.equal(module.isPublic, false);
  assert.equal(module.adminPreviewOnly, true);
  assert.equal(module.access, "admin_preview_only");
  assert.deepEqual(module.contentTypes, [
    "lessons",
    "quizzes",
    "case_scenarios",
    "rapid_drills",
    "worksheets",
    "pattern_maps",
    "clinical_action_layer",
  ]);

  const sections = module.sections.join("\n");
  for (const expected of [
    "CBC review",
    "electrolytes",
    "renal markers",
    "liver markers",
    "coagulation basics",
    "anemia patterns",
    "infection/inflammation patterns",
    "renal impairment patterns",
    "electrolyte imbalance patterns",
    "liver injury patterns",
    "coagulation abnormality patterns",
    "iron deficiency anemia",
    "sepsis pattern",
    "acute kidney injury",
    "DKA pattern",
    "liver dysfunction",
    "bleeding/clotting risk",
    "identify abnormal cluster",
    "classify likely pattern",
    "identify critical value",
    "student version",
    "answer key version",
    "full lab panel interpretation",
    "CBC pattern map",
    "renal/electrolyte pattern map",
    "coagulation pattern map",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }

  assert.deepEqual(module.actionLayer, [
    "What pattern is present?",
    "Why it matters",
    "What values are critical",
    "What requires escalation",
    "What should be verified/rechecked",
  ]);
});

test("Diagnostic Imaging and Cardiac modules support visual question structures", () => {
  const imaging = findAlliedMasteryModule("imaging", "image-recognition");
  const cardiac = findAlliedMasteryModule("sonography", "ecg-cardiac-patterns");
  assert.ok(imaging);
  assert.ok(cardiac);

  for (const module of [imaging, cardiac]) {
    assert.equal(module.isPublic, false, module.id);
    assert.equal(module.adminPreviewOnly, true, module.id);
    assert.deepEqual(module.visualQuestionSupport?.questionTypes, [
      "image_based",
      "multi_image_comparison",
      "scenario_based",
      "rapid_drill",
    ]);
    assert.equal(module.visualQuestionSupport?.mediaFields.imageUrl, true);
    assert.equal(module.visualQuestionSupport?.mediaFields.secondaryImageUrl, "optional");
    assert.equal(module.visualQuestionSupport?.mediaFields.highlightOverlay, "optional");
    assert.deepEqual(module.visualQuestionSupport?.requiredQuestionStructure, [
      "questionText",
      "answerOptions",
      "correctAnswer",
      "rationale",
      "whatToLookFor",
      "commonMistakes",
    ]);
    assert.equal(module.visualQuestionSupport?.rapidDrillMode.fastImageRecognition, true);
    assert.equal(module.visualQuestionSupport?.rapidDrillMode.minimalText, true);
    assert.equal(module.visualQuestionSupport?.rapidDrillMode.delayedRationale, true);
    assert.equal(module.visualQuestionSupport?.worksheetSupport.printableLabelingWorksheets, true);
    assert.equal(module.visualQuestionSupport?.worksheetSupport.abnormalIdentificationSheets, true);
    assert.equal(module.visualQuestionSupport?.worksheetSupport.comparisonWorksheets, true);
  }

  assert.equal(cardiac.visualQuestionSupport?.cardiacSupport?.videoUrl, true);
  assert.equal(cardiac.visualQuestionSupport?.cardiacSupport?.framePreviewImageUrl, true);
  assert.equal(cardiac.visualQuestionSupport?.cardiacSupport?.functionalInterpretationPrompts, true);
});

test("allied hidden module flags are documented in the example env", () => {
  const envExample = readWorkspaceFile(".env.example");
  assert.match(envExample, /ENABLE_ALLIED_MASTERY_MODULES=false/);
  assert.match(envExample, /ENABLE_ADMIN_MODULE_PREVIEW=true/);
  assert.match(envExample, /ENABLE_LAB_VALUES_MODULE=false/);
});

test("public allied module routes fail closed and emit noindex nofollow", () => {
  const indexRoute = readWorkspaceFile("src/app/(marketing)/(default)/allied/[career]/modules/page.tsx");
  const moduleRoute = readWorkspaceFile("src/app/(marketing)/(default)/allied/[career]/modules/[moduleSlug]/page.tsx");
  const access = readWorkspaceFile("src/lib/allied/allied-mastery-module-access.server.ts");
  for (const source of [indexRoute, moduleRoute]) {
    assert.match(source, /getCurrentAlliedMasteryModuleAccess/);
    assert.match(source, /notFound\(\)/);
    assert.match(source, /index:\s*false/);
    assert.match(source, /follow:\s*false/);
  }
  assert.match(access, /getProtectedRouteSession/);
  assert.match(access, /getStaffSession/);
  assert.match(access, /not-signed-in/);
  assert.match(access, /not-admin/);
  assert.match(access, /module-disabled/);
});

test("admin preview area is admin guarded", () => {
  const source = readWorkspaceFile("src/app/(admin)/admin/modules/allied/page.tsx");
  assert.match(source, /requireAdmin\(\)/);
  assert.match(source, /Not visible to public users/);
  assert.match(source, /Hidden \/ Admin Preview Only/);
});

test("hidden allied mastery modules are absent from sitemap, localized SEO, public nav, and pricing surfaces", () => {
  const sitemapAndSeo = readFiles(["src/app/sitemap.xml/route.ts", "src/lib/seo", "reports/localized-seo-audit.json"]);
  const navSources = readFiles(["src/lib/navigation", "src/lib/marketing"]);
  const pricingSources = readFiles([
    "src/app/(marketing)/(default)/pricing",
    "src/app/(marketing)/[locale]/pricing",
    "src/lib/pricing",
    "src/lib/conversion/pricing-catalog.ts",
    "src/lib/stripe/pricing-map.ts",
  ]);

  for (const module of ALLIED_MASTERY_MODULES) {
    assert.doesNotMatch(sitemapAndSeo, new RegExp(module.route.replaceAll("/", "\\/")));
    assert.doesNotMatch(navSources, new RegExp(module.route.replaceAll("/", "\\/")));
    assert.doesNotMatch(pricingSources, new RegExp(module.route.replaceAll("/", "\\/")));
    assert.doesNotMatch(pricingSources, new RegExp(module.entitlementKey));
  }
});

test("hidden allied modules do not leak into CAT or practice exam pools", () => {
  const questionPoolSources = readFiles([
    "src/lib/cat",
    "src/lib/practice-tests",
    "src/lib/exam-pathways",
    "src/app/api/cat",
    "src/app/api/practice-tests",
  ]);
  for (const module of ALLIED_MASTERY_MODULES) {
    assert.doesNotMatch(questionPoolSources, new RegExp(module.route.replaceAll("/", "\\/")), module.id);
    assert.doesNotMatch(questionPoolSources, new RegExp(module.entitlementKey), module.id);
  }
});

test("allied mastery scaffold generator creates draft admin-preview placeholders for incomplete modules", () => {
  for (const module of ALLIED_MASTERY_MODULES) {
    const scaffold = createDraftScaffoldForModule(module);
    const completeness = evaluateAlliedMasteryScaffold(scaffold);
    assert.equal(completeness.status, "complete", module.id);
    assert.equal(scaffold.status, "draft", module.id);
    assert.equal(scaffold.adminPreviewOnly, true, module.id);
    assert.equal(scaffold.generated, true, module.id);
    assert.ok(scaffold.lessonOutlines.length > 0, module.id);
    assert.ok(scaffold.quizPlaceholders.length > 0, module.id);
    assert.ok(scaffold.caseScenarioTitles.length > 0, module.id);
    assert.ok(scaffold.rapidDrillSets.length > 0, module.id);
    assert.ok(scaffold.patternMapDefinitions.length > 0, module.id);
    assert.ok(scaffold.worksheetPlaceholders.some((worksheet) => worksheet.worksheetType === "student"), module.id);
    assert.ok(scaffold.worksheetPlaceholders.some((worksheet) => worksheet.worksheetType === "answer_key"), module.id);

    const entries = [
      ...scaffold.lessonOutlines,
      ...scaffold.quizPlaceholders,
      ...scaffold.caseScenarioTitles,
      ...scaffold.rapidDrillSets,
      ...scaffold.worksheetPlaceholders,
      ...scaffold.patternMapDefinitions,
    ];
    for (const entry of entries) {
      assert.equal(entry.status, "draft", entry.id);
      assert.equal(entry.adminPreviewOnly, true, entry.id);
      assert.equal(entry.generated, true, entry.id);
    }
  }
});

test("visual allied modules generate image, comparison, scenario, rapid, and cardiac placeholders", () => {
  const imaging = findAlliedMasteryModule("imaging", "image-recognition");
  const cardiac = findAlliedMasteryModule("sonography", "ecg-cardiac-patterns");
  assert.ok(imaging);
  assert.ok(cardiac);

  const imagingScaffold = createDraftScaffoldForModule(imaging);
  assert.equal(evaluateAlliedMasteryScaffold(imagingScaffold, imaging).status, "complete");
  assert.deepEqual(
    imagingScaffold.visualQuestionPlaceholders?.map((question) => question.questionType).sort(),
    ["image_based", "multi_image_comparison", "rapid_drill", "scenario_based"],
  );
  for (const question of imagingScaffold.visualQuestionPlaceholders ?? []) {
    assert.equal(question.adminPreviewOnly, true);
    assert.equal(question.status, "draft");
    assert.equal(question.generated, true);
    assert.ok(question.imageUrl);
    assert.ok(question.questionText);
    assert.ok(question.answerOptions.length >= 2);
    assert.ok(question.correctAnswer);
    assert.ok(question.rationale);
    assert.ok(question.whatToLookFor);
    assert.ok(question.commonMistakes.length > 0);
    assert.ok(question.highlightOverlay);
    if (question.questionType === "multi_image_comparison") assert.ok(question.secondaryImageUrl);
    if (question.questionType === "rapid_drill") {
      assert.equal(question.rapidDrillMode?.fastImageRecognition, true);
      assert.equal(question.rapidDrillMode?.minimalText, true);
      assert.equal(question.rapidDrillMode?.delayedRationale, true);
    }
  }

  const cardiacScaffold = createDraftScaffoldForModule(cardiac);
  assert.equal(evaluateAlliedMasteryScaffold(cardiacScaffold, cardiac).status, "complete");
  for (const question of cardiacScaffold.visualQuestionPlaceholders ?? []) {
    assert.ok(question.imageUrl);
    assert.ok(question.videoUrl);
    assert.ok(question.framePreviewImageUrl);
    assert.ok(question.functionalInterpretationPrompt);
  }
});

test("Emergency Pattern Recognition module is hidden and mapped only to Paramedic with required content", () => {
  const module = findAlliedMasteryModule("paramedic", "emergency-pattern-recognition");
  assert.ok(module, "emergency-pattern-recognition module must exist");
  assert.equal(module.route, "/allied/paramedic/modules/emergency-pattern-recognition");
  assert.equal(module.entitlementKey, "ALLIED_EMERGENCY_PATTERN_RECOGNITION_PAID");
  assert.deepEqual(module.professionKeys, ["paramedic"]);
  assert.equal(module.isPublic, false);
  assert.equal(module.adminPreviewOnly, true);
  assert.equal(module.access, "admin_preview_only");

  // Module maps ONLY to paramedic — all other professions get null
  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "paramedic")) {
    assert.equal(
      findAlliedMasteryModule(professionKey, "emergency-pattern-recognition"),
      null,
      `${professionKey} must not receive Emergency Pattern Recognition`,
    );
  }

  const sections = module.sections.join("\n");

  // Required lessons are present
  for (const expected of [
    "scene size-up",
    "primary survey",
    "shock pattern recognition",
    "respiratory emergency",
    "cardiac emergency",
    "altered LOC",
    "trauma red flags",
    "sepsis",
    "pediatric",
    "transport",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `Missing lesson content: ${expected}`);
  }

  // Required minimum 8 case scenarios are present
  for (const expected of [
    "anaphylaxis",
    "septic shock",
    "STEMI",
    "opioid overdose",
    "tension pneumothorax",
    "stroke",
    "hypovolemic shock",
    "pediatric respiratory",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `Missing case scenario: ${expected}`);
  }

  // Paramedic cases must include vitals (enforced in section text)
  assert.match(sections, /HR \d+/, "Cases must include HR vitals");
  assert.match(sections, /BP \d+/, "Cases must include BP vitals");
  assert.match(sections, /RR \d+/, "Cases must include RR vitals");
  assert.match(sections, /SpO2 \d+/, "Cases must include SpO2 vitals");

  // Lung sound cases require ClinicalMedia audio reference
  assert.match(sections, /ClinicalMedia audio/i, "Lung sound cases must reference ClinicalMedia audio");

  // ECG interpretation cases require ClinicalMedia ECG-compatible reference
  assert.match(sections, /ClinicalMedia ECG/i, "ECG/STEMI cases must reference ClinicalMedia ECG");

  // Stroke and hypoglycemia mimic cases must include glucose value
  assert.match(sections, /glucose/i, "Stroke/hypoglycemia mimic cases must include glucose value");

  // At least 15 rapid drills
  const rapidDrills = module.sections.filter((section) => /^Rapid drills:/i.test(section));
  assert.ok(rapidDrills.length >= 15, `Expected ≥15 rapid drills, got ${rapidDrills.length}`);

  // At least 6 pattern maps (shock, respiratory, cardiac, altered LOC, trauma, transport)
  const patternMaps = module.sections.filter((section) => /^Pattern maps:/i.test(section));
  assert.ok(patternMaps.length >= 6, `Expected ≥6 pattern maps, got ${patternMaps.length}`);

  // Admin preview route uses correct admin path — not public nav/pricing/sitemap
  const adminPreviewSources = readWorkspaceFile("src/app/(admin)/admin/modules/allied/page.tsx");
  assert.match(adminPreviewSources, /requireAdmin\(\)/);

  // Module not exposed in sitemap or public SEO
  const sitemapSource = readWorkspaceFile("src/app/sitemap.xml/route.ts");
  assert.doesNotMatch(sitemapSource, /emergency-pattern-recognition/);
  assert.doesNotMatch(sitemapSource, /ALLIED_EMERGENCY_PATTERN_RECOGNITION_PAID/);
});

test("Movement + Injury Mechanics module is hidden and mapped only to Physiotherapy with required content", () => {
  const module = findAlliedMasteryModule("pta", "movement-injury-mechanics");
  assert.ok(module, "movement-injury-mechanics module must exist");
  assert.equal(module.route, "/allied/physiotherapy/modules/movement-injury-mechanics");
  assert.equal(module.entitlementKey, "ALLIED_MOVEMENT_INJURY_MECHANICS_PAID");
  assert.deepEqual(module.professionKeys, ["pta"]);
  assert.equal(module.isPublic, false);
  assert.equal(module.adminPreviewOnly, true);
  assert.equal(module.access, "admin_preview_only");

  // Maps ONLY to pta — all other professions get null
  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "pta")) {
    assert.equal(
      findAlliedMasteryModule(professionKey, "movement-injury-mechanics"),
      null,
      `${professionKey} must not receive Movement + Injury Mechanics`,
    );
  }

  const sections = module.sections.join("\n");

  // Required lesson topics
  for (const expected of [
    "Movement assessment",
    "ROM",
    "Strength grading",
    "Gait",
    "pain vs weakness",
    "ankle sprain",
    "ACL",
    "rotator cuff",
    "low back",
    "hip fracture",
    "red flags",
    "rehab progression",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `Missing lesson: ${expected}`);
  }

  // Required case scenarios
  for (const expected of [
    "ankle inversion",
    "ACL",
    "shoulder",
    "hip fracture",
    "low back",
    "gait",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `Missing case: ${expected}`);
  }

  // PT case questions require movementFindings Json
  assert.match(sections, /movementFindings/i, "PT cases must include movementFindings Json");

  // Gait recognition cases require videoUrl
  assert.match(sections, /videoUrl/i, "Gait recognition cases must include videoUrl");

  // ROM/posture recognition cases require imageUrl
  assert.match(sections, /imageUrl/i, "ROM/posture recognition cases must include imageUrl");

  // At least 10 rapid drills
  const rapidDrills = module.sections.filter((section) => /^Rapid drills:/i.test(section));
  assert.ok(rapidDrills.length >= 10, `Expected ≥10 rapid drills, got ${rapidDrills.length}`);

  // At least 5 pattern maps (injury mechanism, gait abnormality, ROM limitation, red flag, rehab progression)
  const patternMaps = module.sections.filter((section) => /^Pattern maps:/i.test(section));
  assert.ok(patternMaps.length >= 5, `Expected ≥5 pattern maps, got ${patternMaps.length}`);

  // Admin preview route is admin guarded
  const adminPreviewSources = readWorkspaceFile("src/app/(admin)/admin/modules/allied/page.tsx");
  assert.match(adminPreviewSources, /requireAdmin\(\)/);

  // Module not exposed in sitemap or public SEO
  const sitemapSource = readWorkspaceFile("src/app/sitemap.xml/route.ts");
  assert.doesNotMatch(sitemapSource, /movement-injury-mechanics/);
  assert.doesNotMatch(sitemapSource, /ALLIED_MOVEMENT_INJURY_MECHANICS_PAID/);
});

test("Functional Assessment + ADL Safety module is hidden and mapped only to Occupational Therapy with required content", () => {
  const module = findAlliedMasteryModule("ota", "functional-assessment-adl-safety");
  assert.ok(module, "functional-assessment-adl-safety module must exist");
  assert.equal(module.route, "/allied/occupational-therapy/modules/functional-assessment-adl-safety");
  assert.equal(module.entitlementKey, "ALLIED_FUNCTIONAL_ASSESSMENT_ADL_SAFETY_PAID");
  assert.deepEqual(module.professionKeys, ["ota"]);
  assert.equal(module.isPublic, false);
  assert.equal(module.adminPreviewOnly, true);
  assert.equal(module.access, "admin_preview_only");

  // Maps ONLY to ota — all other professions get null
  for (const professionKey of ALLIED_PROFESSION_KEYS.filter((key) => key !== "ota")) {
    assert.equal(
      findAlliedMasteryModule(professionKey, "functional-assessment-adl-safety"),
      null,
      `${professionKey} must not receive Functional Assessment + ADL Safety`,
    );
  }

  const sections = module.sections.join("\n");

  // Required lesson topics
  for (const expected of [
    "ADL",
    "IADL",
    "bathing",
    "dressing",
    "meal preparation",
    "medication management",
    "cognition",
    "visual neglect",
    "falls risk",
    "adaptive equipment",
    "energy conservation",
    "goal-writing",
    "discharge planning",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `Missing lesson: ${expected}`);
  }

  // Required case scenarios
  for (const expected of [
    "post-stroke",
    "fall risk",
    "COPD",
    "cognitive",
    "hip fracture",
    "low vision",
    "discharge planning",
  ]) {
    assert.match(sections, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `Missing case: ${expected}`);
  }

  // OT case questions require functionalTaskData Json
  assert.match(sections, /functionalTaskData/i, "OT cases must include functionalTaskData Json");

  // Cognition questions require cognitiveFindings Json
  assert.match(sections, /cognitiveFindings/i, "Cognition cases must include cognitiveFindings Json");

  // Home safety questions require environmentFindings Json
  assert.match(sections, /environmentFindings/i, "Home safety cases must include environmentFindings Json");

  // Visual task performance questions require videoUrl
  assert.match(sections, /videoUrl/i, "Visual task performance cases must include videoUrl");

  // At least 10 rapid drills
  const rapidDrills = module.sections.filter((section) => /^Rapid drills:/i.test(section));
  assert.ok(rapidDrills.length >= 10, `Expected ≥10 rapid drills, got ${rapidDrills.length}`);

  // At least 5 pattern maps (ADL/IADL, deficit/intervention, cognition/safety, home hazard, discharge planning)
  const patternMaps = module.sections.filter((section) => /^Pattern maps:/i.test(section));
  assert.ok(patternMaps.length >= 5, `Expected ≥5 pattern maps, got ${patternMaps.length}`);

  // Admin preview route is admin guarded
  const adminPreviewSources = readWorkspaceFile("src/app/(admin)/admin/modules/allied/page.tsx");
  assert.match(adminPreviewSources, /requireAdmin\(\)/);

  // Module not exposed in sitemap or public SEO
  const sitemapSource = readWorkspaceFile("src/app/sitemap.xml/route.ts");
  assert.doesNotMatch(sitemapSource, /functional-assessment-adl-safety/);
  assert.doesNotMatch(sitemapSource, /ALLIED_FUNCTIONAL_ASSESSMENT_ADL_SAFETY_PAID/);
});

test("allied mastery scaffold generator does not overwrite existing scaffold content", () => {
  const module = findAlliedMasteryModule("mlt", "advanced-lab-interpretation");
  assert.ok(module);
  const generated = createDraftScaffoldForModule(module);
  const existing = {
    ...generated,
    lessonOutlines: [
      {
        ...generated.lessonOutlines[0],
        id: "existing-m/manual-outline",
        title: "Manually reviewed outline",
        outline: ["Keep this manual outline"],
      },
    ],
  };

  const merged = mergeScaffoldWithoutOverwrite(existing, generated);
  assert.ok(merged.lessonOutlines.some((outline) => outline.id === "existing-m/manual-outline"));
  assert.ok(merged.lessonOutlines.some((outline) => outline.id === generated.lessonOutlines[0].id));
  assert.deepEqual(
    merged.lessonOutlines.find((outline) => outline.id === "existing-m/manual-outline")?.outline,
    ["Keep this manual outline"],
  );
  assert.equal(evaluateAlliedMasteryScaffold(merged).status, "complete");
});
