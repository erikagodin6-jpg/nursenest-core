import assert from "node:assert/strict";
import test from "node:test";
import { ALLIED_MASTERY_MODULES, findAlliedMasteryModule } from "@/lib/allied/allied-mastery-modules";
import { createDraftScaffoldForModule } from "@/lib/allied/allied-mastery-module-scaffolding";
import {
  ALLIED_MODALITY_REQUIREMENTS,
  auditAlliedModuleQuestions,
  auditAlliedQuestion,
  buildAlliedQuestionModalityAuditReport,
} from "@/lib/allied/allied-question-modality-audit";

test("defines required modality input for every allied mastery profession", () => {
  assert.deepEqual(ALLIED_MODALITY_REQUIREMENTS.respiratory.requiredFields, ["abgValues"]);
  assert.deepEqual(ALLIED_MODALITY_REQUIREMENTS.mlt.requiredFields, ["labPanel"]);
  assert.deepEqual(ALLIED_MODALITY_REQUIREMENTS["pharmacy-tech"].requiredFields, ["medicationOrder"]);
  assert.deepEqual(ALLIED_MODALITY_REQUIREMENTS.ota.requiredFields, ["functionalScenario"]);
  assert.deepEqual(ALLIED_MODALITY_REQUIREMENTS.pta.requiredFields, ["movementInjuryScenario"]);
  assert.deepEqual(ALLIED_MODALITY_REQUIREMENTS.imaging.requiredFields, ["imageUrl"]);
  assert.deepEqual(ALLIED_MODALITY_REQUIREMENTS.sonography.requiredFields, ["ecg"]);
  assert.deepEqual(ALLIED_MODALITY_REQUIREMENTS.paramedic.requiredFields, ["audioUrl", "ecg", "vitals"]);
});

test("Oxygen Delivery generated questions require vitals and device-identification images", () => {
  for (const [professionKey, moduleId] of [
    ["respiratory", "respiratory-paramedic-oxygen-delivery"],
    ["paramedic", "paramedic-oxygen-delivery"],
  ] as const) {
    const module = findAlliedMasteryModule(professionKey, "oxygen-delivery");
    assert.ok(module);
    assert.equal(module.id, moduleId);
    const audit = auditAlliedModuleQuestions(module, createDraftScaffoldForModule(module));
    assert.equal(audit.readinessStatus, "ready", module.id);
    assert.equal(audit.modalityCompliancePct, 100, module.id);
  }
});

test("Respiratory Distress generated questions require vitals, work of breathing, and lung-sound audio", () => {
  for (const [professionKey, moduleId] of [
    ["respiratory", "respiratory-paramedic-respiratory-distress"],
    ["paramedic", "paramedic-respiratory-distress"],
  ] as const) {
    const module = findAlliedMasteryModule(professionKey, "respiratory-distress");
    assert.ok(module);
    assert.equal(module.id, moduleId);
    const audit = auditAlliedModuleQuestions(module, createDraftScaffoldForModule(module));
    assert.equal(audit.readinessStatus, "ready", module.id);
    assert.equal(audit.modalityCompliancePct, 100, module.id);
  }
});

test("IV Infusion Safety generated questions require medication orders and infusion data", () => {
  for (const [professionKey, moduleId] of [
    ["pharmacy-tech", "pharmacy-tech-iv-infusion-safety"],
    ["paramedic", "paramedic-iv-infusion-safety"],
  ] as const) {
    const module = findAlliedMasteryModule(professionKey, "iv-infusion-safety");
    assert.ok(module);
    assert.equal(module.id, moduleId);
    const audit = auditAlliedModuleQuestions(module, createDraftScaffoldForModule(module));
    assert.equal(audit.readinessStatus, "ready", module.id);
    assert.equal(audit.modalityCompliancePct, 100, module.id);
  }
});

test("IV medication safety questions require medicationOrder", () => {
  const module = findAlliedMasteryModule("pharmacy-tech", "iv-infusion-safety");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const orderQuestion = scaffold.quizPlaceholders.find((question) => /medication order safety/i.test(question.title));
  assert.ok(orderQuestion);
  orderQuestion.clinicalData.medicationOrder = undefined;

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_medicationOrder" || issue.code === "missing_medication_order"));
});

test("IV rate and fluid questions require infusionData", () => {
  const module = findAlliedMasteryModule("pharmacy-tech", "iv-infusion-safety");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const fluidQuestion = scaffold.quizPlaceholders.find((question) => /IV fluids overview/i.test(question.title));
  assert.ok(fluidQuestion);
  fluidQuestion.clinicalData.infusionData = undefined;

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_infusionData" || issue.code === "missing_infusion_data"));
});

test("IV site appearance questions require ivSiteImageUrl", () => {
  const module = findAlliedMasteryModule("pharmacy-tech", "iv-infusion-safety");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const siteQuestion = scaffold.rapidDrillSets.find((question) => /IV site swollen/i.test(question.title));
  assert.ok(siteQuestion);
  siteQuestion.clinicalData.ivSiteImageUrl = "";

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_iv_site_image"));
});

test("Neuro Stroke Recognition generated questions require neuroFindings and vitals/functionalTaskData", () => {
  for (const [professionKey, moduleId] of [
    ["paramedic", "paramedic-neuro-stroke-recognition"],
    ["ota", "ota-neuro-stroke-recognition"],
  ] as const) {
    const module = findAlliedMasteryModule(professionKey, "neuro-stroke-recognition");
    assert.ok(module);
    assert.equal(module.id, moduleId);
    const audit = auditAlliedModuleQuestions(module, createDraftScaffoldForModule(module));
    assert.equal(audit.readinessStatus, "ready", module.id);
    assert.equal(audit.modalityCompliancePct, 100, module.id);
  }
});

test("GCS questions require complete GCS component data", () => {
  const module = findAlliedMasteryModule("paramedic", "neuro-stroke-recognition");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const gcsQuestion = scaffold.quizPlaceholders.find((question) => /GCS/i.test(question.title));
  assert.ok(gcsQuestion);
  gcsQuestion.clinicalData.neuroFindings = { LOC: "drowsy" };

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_gcs_components"));
});

test("Hypoglycemia mimic questions require glucose value", () => {
  const module = findAlliedMasteryModule("paramedic", "neuro-stroke-recognition");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const mimicQuestion = scaffold.rapidDrillSets.find((question) => /glucose/i.test(question.title));
  assert.ok(mimicQuestion);
  mimicQuestion.clinicalData.glucoseMmolL = undefined;

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_glucose_value"));
});

test("OT functional deficit questions require functionalTaskData or media", () => {
  const module = findAlliedMasteryModule("ota", "neuro-stroke-recognition");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const funcQuestion = scaffold.rapidDrillSets.find((question) => /ignores left side/i.test(question.title));
  assert.ok(funcQuestion);
  funcQuestion.clinicalData.functionalTaskData = undefined;
  funcQuestion.clinicalData.imageUrl = "";

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_functional_task_data"));
});

test("Respiratory Distress lung sound questions cannot pass without audio", () => {
  const module = findAlliedMasteryModule("respiratory", "respiratory-distress");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const lungSoundQuestion = scaffold.quizPlaceholders.find((question) => /lung sounds/i.test(question.title));
  assert.ok(lungSoundQuestion);
  lungSoundQuestion.clinicalData.lungSoundAudioUrl = "";

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_lung_sound_audio"));
});

test("Respiratory Distress oxygen device questions require device image", () => {
  const module = findAlliedMasteryModule("respiratory", "respiratory-distress");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const deviceQuestion = scaffold.rapidDrillSets.find((question) => /wheezing not improving after oxygen escalation/i.test(question.title));
  assert.ok(deviceQuestion);
  deviceQuestion.clinicalData.deviceImageUrl = "";
  deviceQuestion.title = "oxygen device recognition";

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_oxygen_device_image"));
});

test("Respiratory Distress ABG questions require complete ABG values", () => {
  const module = findAlliedMasteryModule("respiratory", "respiratory-distress");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const abgQuestion = scaffold.rapidDrillSets.find((question) => /PaCO2|CO2/i.test(question.title));
  assert.ok(abgQuestion);
  abgQuestion.clinicalData.abgValues = { pH: 7.3, PaCO2: 60, HCO3: 26 };

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_complete_abg"));
});

test("Oxygen Delivery device-identification questions cannot pass without a device image", () => {
  const module = findAlliedMasteryModule("respiratory", "oxygen-delivery");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const deviceQuestion = scaffold.quizPlaceholders.find((question) => /device recognition/i.test(question.title));
  assert.ok(deviceQuestion);
  deviceQuestion.clinicalData.deviceImageUrl = "";

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_device_image"));
});

test("Ventilator Management generated questions require vent settings, ABG values, and vitals", () => {
  const module = findAlliedMasteryModule("respiratory", "ventilator-management");
  assert.ok(module);
  const audit = auditAlliedModuleQuestions(module, createDraftScaffoldForModule(module));
  assert.equal(audit.readinessStatus, "ready");
  assert.equal(audit.modalityCompliancePct, 100);
  assert.equal(audit.missingAudio, 0);
  assert.equal(audit.missingImage, 0);
  assert.equal(audit.missingVideo, 0);
});

test("Ventilator Management questions fail audit when required vent modality inputs are missing", () => {
  const module = findAlliedMasteryModule("respiratory", "ventilator-management");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const first = scaffold.quizPlaceholders[0];
  assert.ok(first);
  first.clinicalData = {};

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_ventSettings"));
  assert.ok(audit.issues.some((issue) => issue.code === "missing_abgValues"));
  assert.ok(audit.issues.some((issue) => issue.code === "missing_vitals"));
});

test("Ventilator waveform questions cannot pass without waveform image or video media", () => {
  const module = findAlliedMasteryModule("respiratory", "ventilator-management");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const waveformDrill = scaffold.rapidDrillSets.find((question) => /waveform/i.test(question.title));
  assert.ok(waveformDrill);
  waveformDrill.clinicalData.waveformImageUrl = "";
  waveformDrill.clinicalData.waveformVideoUrl = "";

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_waveform_media"));
});

test("generated allied mastery scaffolds pass modality and clinical quality audit", () => {
  const report = buildAlliedQuestionModalityAuditReport();
  assert.equal(report.pass, true);
  assert.equal(report.summary.modulesAudited, ALLIED_MASTERY_MODULES.length);
  assert.equal(report.summary.invalidModules, 0);
  assert.equal(report.summary.missingAudio, 0);
  assert.equal(report.summary.missingImage, 0);
  assert.equal(report.summary.missingVideo, 0);
  assert.equal(report.summary.accuracyIssues, 0);
  assert.equal(report.summary.averageModalityCompliancePct, 100);
});

test("imaging questions fail audit when imageUrl is missing", () => {
  const module = findAlliedMasteryModule("imaging", "image-recognition");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const first = scaffold.visualQuestionPlaceholders?.[0];
  assert.ok(first);
  first.imageUrl = "";
  if (first.clinicalData) first.clinicalData.imageUrl = "";

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_imageUrl" || issue.code === "image_required"));
});

test("paramedic questions fail audit when audio, ECG, or vitals are missing", () => {
  const module = findAlliedMasteryModule("paramedic", "emergency-pattern-recognition");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const first = scaffold.quizPlaceholders[0];
  assert.ok(first);
  first.clinicalData = {};

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_audioUrl"));
  assert.ok(audit.issues.some((issue) => issue.code === "missing_ecg"));
  assert.ok(audit.issues.some((issue) => issue.code === "missing_vitals"));
});

test("audit rejects unrealistic clinical values and ambiguous answers", () => {
  const module = findAlliedMasteryModule("respiratory", "abg");
  assert.ok(module);
  const issues = auditAlliedQuestion(module, {
    id: "bad-abg",
    questionType: "quiz",
    title: "Bad ABG",
    questionText: "Review ABG values.",
    answerOptions: ["A", "B"],
    correctAnswer: "C",
    rationale: "Short rationale.",
    whyOthersWrong: [],
    whatToLookFor: "pH and PaCO2 direction.",
    clinicalData: { abgValues: { pH: 9.1, PaCO2: 200, HCO3: 2 } },
    decisionLayer: { whatIsHappening: "Severe impossible ABG", priorityAction: "Verify specimen" },
  });
  assert.ok(issues.some((issue) => issue.code === "clinical_accuracy"));
  assert.ok(issues.some((issue) => issue.code === "ambiguous_correct_answer"));
  assert.ok(issues.some((issue) => issue.code === "missing_distractor_rationales"));
});

test("advanced rapid drills require decision layer and concise rapid recognition compatibility", () => {
  const module = findAlliedMasteryModule("mlt", "advanced-lab-interpretation");
  assert.ok(module);
  const scaffold = createDraftScaffoldForModule(module);
  const first = scaffold.rapidDrillSets[0];
  assert.ok(first);
  first.decisionLayer = undefined;
  first.rapidRecognition = { compatible: true, maxStemWords: 2 };

  const audit = auditAlliedModuleQuestions(module, scaffold);
  assert.equal(audit.readinessStatus, "invalid");
  assert.ok(audit.issues.some((issue) => issue.code === "missing_decision_layer"));
  assert.ok(audit.issues.some((issue) => issue.code === "rapid_too_verbose"));
});