import {
  ALLIED_MASTERY_MODULES,
  ALLIED_MASTERY_PROFESSION_LABELS,
  type AlliedMasteryModule,
} from "@/lib/allied/allied-mastery-modules";
import {
  createDraftScaffoldForModule,
  type AlliedMasteryCaseScenarioPlaceholder,
  type AlliedMasteryModuleScaffold,
  type AlliedMasteryQuestionClinicalData,
  type AlliedMasteryQuizPlaceholder,
  type AlliedMasteryRapidDrillSet,
  type AlliedMasteryVisualQuestionPlaceholder,
} from "@/lib/allied/allied-mastery-module-scaffolding";

export type AlliedQuestionAuditReadinessStatus = "ready" | "invalid";

export type AlliedQuestionModalityRequirement = {
  label: string;
  requiredFields: Array<keyof AlliedMasteryQuestionClinicalData | "imageUrl" | "videoUrl">;
  temporaryPlaceholderAllowedFields?: Array<"videoUrl">;
};

export type AlliedQuestionForAudit = {
  id: string;
  questionType: "quiz" | "case" | "rapid_drill" | "visual";
  title: string;
  questionText: string;
  answerOptions: string[];
  correctAnswer: string;
  rationale: string;
  whyOthersWrong?: string[];
  whatToLookFor?: string;
  clinicalData?: AlliedMasteryQuestionClinicalData;
  decisionLayer?: { whatIsHappening?: string; priorityAction?: string };
  rapidRecognition?: { compatible?: true; maxStemWords?: number };
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
};

export type AlliedQuestionAuditIssue = {
  questionId: string;
  severity: "invalid" | "warning";
  code: string;
  message: string;
};

export type AlliedModuleQuestionAudit = {
  moduleId: string;
  moduleTitle: string;
  professionKey: string;
  profession: string;
  questionCount: number;
  modalityCompliancePct: number;
  missingAudio: number;
  missingImage: number;
  missingVideo: number;
  accuracyIssues: number;
  rationaleIssues: number;
  decisionLayerIssues: number;
  rapidRecognitionIssues: number;
  readinessStatus: AlliedQuestionAuditReadinessStatus;
  issues: AlliedQuestionAuditIssue[];
};

export type AlliedQuestionModalityAuditReport = {
  generatedAt: string;
  pass: boolean;
  summary: {
    modulesAudited: number;
    questionCount: number;
    readyModules: number;
    invalidModules: number;
    averageModalityCompliancePct: number;
    missingAudio: number;
    missingImage: number;
    missingVideo: number;
    accuracyIssues: number;
  };
  modules: AlliedModuleQuestionAudit[];
};

export const ALLIED_MODALITY_REQUIREMENTS: Record<string, AlliedQuestionModalityRequirement> = {
  respiratory: { label: "ABG values", requiredFields: ["abgValues"] },
  mlt: { label: "lab panels", requiredFields: ["labPanel"] },
  "pharmacy-tech": { label: "medication orders", requiredFields: ["medicationOrder"] },
  ota: { label: "functional scenarios", requiredFields: ["functionalScenario"] },
  pta: { label: "movement/injury scenarios", requiredFields: ["movementInjuryScenario"] },
  imaging: { label: "image-based questions", requiredFields: ["imageUrl"] },
  sonography: {
    label: "ECG required; echo video strongly preferred",
    requiredFields: ["ecg"],
    temporaryPlaceholderAllowedFields: ["videoUrl"],
  },
  paramedic: { label: "audio lung sounds, ECG, and vitals", requiredFields: ["audioUrl", "ecg", "vitals"] },
};

const MODULE_MODALITY_REQUIREMENTS: Record<string, AlliedQuestionModalityRequirement> = {
  "respiratory-ventilator-management": {
    label: "ventilator settings, ABG values, and vitals",
    requiredFields: ["ventSettings", "abgValues", "vitals"],
  },
  "respiratory-paramedic-oxygen-delivery": {
    label: "oxygen delivery vitals and patient condition",
    requiredFields: ["vitals"],
  },
  "paramedic-oxygen-delivery": {
    label: "oxygen delivery vitals and patient condition",
    requiredFields: ["vitals"],
  },
  "paramedic-trauma-triage": {
    label: "trauma/triage vitals and patient scenario",
    requiredFields: ["vitals", "patientScenario"],
  },
  "respiratory-paramedic-respiratory-distress": {
    label: "respiratory distress vitals, work of breathing, and lung sound inputs",
    requiredFields: ["vitals", "patientScenario", "workOfBreathing"],
  },
  "paramedic-respiratory-distress": {
    label: "respiratory distress vitals, work of breathing, and lung sound inputs",
    requiredFields: ["vitals", "patientScenario", "workOfBreathing"],
  },
  "pharmacy-tech-iv-infusion-safety": {
    label: "IV infusion medication order and infusion data",
    requiredFields: ["medicationOrder", "infusionData"],
  },
  "paramedic-iv-infusion-safety": {
    label: "IV infusion medication order, infusion data, and vitals",
    requiredFields: ["medicationOrder", "infusionData", "vitals"],
  },
  "paramedic-neuro-stroke-recognition": {
    label: "neuro assessment findings and paramedic vitals",
    requiredFields: ["neuroFindings", "vitals"],
  },
  "ota-neuro-stroke-recognition": {
    label: "neuro assessment findings and OT functional task data",
    requiredFields: ["neuroFindings", "functionalTaskData"],
  },
};

function requirementFor(module: AlliedMasteryModule): AlliedQuestionModalityRequirement | undefined {
  return MODULE_MODALITY_REQUIREMENTS[module.id] ?? ALLIED_MODALITY_REQUIREMENTS[module.professionKeys[0]];
}

function words(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function hasField(question: AlliedQuestionForAudit, field: AlliedQuestionModalityRequirement["requiredFields"][number]): boolean {
  if (field === "imageUrl") return Boolean(question.imageUrl?.trim() || question.clinicalData?.imageUrl?.trim());
  if (field === "videoUrl") return Boolean(question.videoUrl?.trim() || question.clinicalData?.videoUrl?.trim());
  const value = question.clinicalData?.[field as keyof AlliedMasteryQuestionClinicalData];
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return false;
}

function realisticClinicalDataIssues(question: AlliedQuestionForAudit): string[] {
  const data = question.clinicalData;
  const issues: string[] = [];
  if (!data) return ["clinicalData missing"];
  const abg = data.abgValues;
  if (abg) {
    if (abg.pH < 6.8 || abg.pH > 7.8) issues.push("ABG pH outside realistic audit range");
    if (abg.PaCO2 < 10 || abg.PaCO2 > 120) issues.push("PaCO2 outside realistic audit range");
    if (abg.HCO3 < 5 || abg.HCO3 > 60) issues.push("HCO3 outside realistic audit range");
    if (abg.PaO2 != null && (abg.PaO2 < 20 || abg.PaO2 > 600)) issues.push("PaO2 outside realistic audit range");
    if (abg.SaO2 != null && (abg.SaO2 < 40 || abg.SaO2 > 100)) issues.push("SaO2 outside realistic audit range");
  }
  const vitals = data.vitals;
  if (vitals) {
    if (vitals.HR < 20 || vitals.HR > 260) issues.push("HR outside realistic audit range");
    if (vitals.RR < 4 || vitals.RR > 80) issues.push("RR outside realistic audit range");
    if (vitals.SpO2 < 40 || vitals.SpO2 > 100) issues.push("SpO2 outside realistic audit range");
  }
  const ecg = data.ecg;
  if (ecg && (ecg.rate < 20 || ecg.rate > 300)) issues.push("ECG rate outside realistic audit range");
  const vent = data.ventSettings;
  if (vent) {
    if (vent.tidalVolumeMl != null && (vent.tidalVolumeMl < 150 || vent.tidalVolumeMl > 1000)) issues.push("tidal volume outside realistic audit range");
    if (vent.respiratoryRate != null && (vent.respiratoryRate < 4 || vent.respiratoryRate > 45)) issues.push("ventilator respiratory rate outside realistic audit range");
    if (vent.FiO2 != null && (vent.FiO2 < 0.21 || vent.FiO2 > 1)) issues.push("FiO2 outside realistic audit range");
    if (vent.PEEP != null && (vent.PEEP < 0 || vent.PEEP > 30)) issues.push("PEEP outside realistic audit range");
    if (vent.peakPressure != null && (vent.peakPressure < 5 || vent.peakPressure > 80)) issues.push("peak pressure outside realistic audit range");
    if (vent.plateauPressure != null && (vent.plateauPressure < 5 || vent.plateauPressure > 60)) issues.push("plateau pressure outside realistic audit range");
  }
  return issues;
}

function scaffoldQuestions(scaffold: AlliedMasteryModuleScaffold): AlliedQuestionForAudit[] {
  const quiz = scaffold.quizPlaceholders.map((q: AlliedMasteryQuizPlaceholder): AlliedQuestionForAudit => ({
    id: q.id,
    questionType: "quiz",
    title: q.title,
    questionText: q.questionText,
    answerOptions: q.answerOptions,
    correctAnswer: q.correctAnswer,
    rationale: q.rationale,
    whyOthersWrong: q.whyOthersWrong,
    whatToLookFor: q.whatToLookFor,
    clinicalData: q.clinicalData,
    decisionLayer: q.decisionLayer,
  }));
  const cases = scaffold.caseScenarioTitles.map((q: AlliedMasteryCaseScenarioPlaceholder): AlliedQuestionForAudit => ({
    id: q.id,
    questionType: "case",
    title: q.title,
    questionText: q.questionText,
    answerOptions: q.answerOptions,
    correctAnswer: q.correctAnswer,
    rationale: q.rationale,
    whyOthersWrong: q.whyOthersWrong,
    whatToLookFor: q.whatToLookFor,
    clinicalData: q.clinicalData,
    decisionLayer: q.decisionLayer,
  }));
  const drills = scaffold.rapidDrillSets.map((q: AlliedMasteryRapidDrillSet): AlliedQuestionForAudit => ({
    id: q.id,
    questionType: "rapid_drill",
    title: q.title,
    questionText: q.questionText,
    answerOptions: q.answerOptions,
    correctAnswer: q.correctAnswer,
    rationale: q.rationale,
    whyOthersWrong: q.whyOthersWrong,
    whatToLookFor: q.whatToLookFor,
    clinicalData: q.clinicalData,
    rapidRecognition: q.rapidRecognition,
    decisionLayer: q.decisionLayer,
  }));
  const visual = (scaffold.visualQuestionPlaceholders ?? []).map((q: AlliedMasteryVisualQuestionPlaceholder): AlliedQuestionForAudit => ({
    id: q.id,
    questionType: "visual",
    title: q.title,
    questionText: q.questionText,
    answerOptions: q.answerOptions,
    correctAnswer: q.correctAnswer,
    rationale: q.rationale,
    whyOthersWrong: q.whyOthersWrong,
    whatToLookFor: q.whatToLookFor,
    clinicalData: q.clinicalData,
    decisionLayer: q.decisionLayer,
    rapidRecognition: q.rapidDrillMode ? { compatible: true, maxStemWords: 16 } : undefined,
    imageUrl: q.imageUrl,
    videoUrl: q.videoUrl,
  }));
  return [...quiz, ...cases, ...drills, ...visual];
}

export function auditAlliedQuestion(module: AlliedMasteryModule, question: AlliedQuestionForAudit): AlliedQuestionAuditIssue[] {
  const professionKey = module.professionKeys[0];
  const requirement = requirementFor(module);
  const issues: AlliedQuestionAuditIssue[] = [];
  if (!requirement) {
    issues.push({ questionId: question.id, severity: "invalid", code: "missing_requirement", message: `No modality rule for profession ${professionKey}` });
    return issues;
  }

  for (const field of requirement.requiredFields) {
    if (!hasField(question, field)) {
      issues.push({ questionId: question.id, severity: "invalid", code: `missing_${String(field)}`, message: `Missing required ${String(field)} modality for ${requirement.label}.` });
    }
  }

  if (professionKey === "imaging" && !hasField(question, "imageUrl")) {
    issues.push({ questionId: question.id, severity: "invalid", code: "image_required", message: "Imaging questions must include imageUrl and be image-dependent." });
  }
  if (professionKey === "paramedic" && !["oxygen-delivery", "trauma-triage", "respiratory-distress", "iv-infusion-safety"].includes(module.slug) && !hasField(question, "audioUrl")) {
    issues.push({ questionId: question.id, severity: "invalid", code: "audio_required", message: "Paramedic lung-sound questions require audioUrl." });
  }
  if (professionKey === "sonography" && !hasField(question, "videoUrl")) {
    issues.push({ questionId: question.id, severity: "warning", code: "echo_video_placeholder_allowed", message: "Echo video is strongly preferred; placeholder allowed during admin preview." });
  }
  if (module.id === "respiratory-ventilator-management" && /waveform/i.test(`${question.title} ${question.questionText}`)) {
    const hasWaveformMedia = Boolean(question.clinicalData?.waveformImageUrl?.trim() || question.clinicalData?.waveformVideoUrl?.trim());
    if (!hasWaveformMedia) {
      issues.push({ questionId: question.id, severity: "invalid", code: "missing_waveform_media", message: "Ventilator waveform questions require waveformImageUrl or waveformVideoUrl." });
    }
  }
  if (module.slug === "oxygen-delivery" && /device recognition|recognition|device|mask|nasal cannula|non-rebreather|venturi|nrb/i.test(`${question.title} ${question.questionText}`)) {
    if (!question.clinicalData?.deviceImageUrl?.trim()) {
      issues.push({ questionId: question.id, severity: "invalid", code: "missing_device_image", message: "Oxygen device-identification questions require deviceImageUrl." });
    }
  }
  if (module.slug === "respiratory-distress" && /lung sounds?|wheez|crackles?|stridor|diminished|absent breath/i.test(`${question.title} ${question.questionText}`)) {
    if (!question.clinicalData?.lungSoundAudioUrl?.trim() && !question.clinicalData?.audioUrl?.trim()) {
      issues.push({ questionId: question.id, severity: "invalid", code: "missing_lung_sound_audio", message: "Respiratory distress lung-sound questions require lungSoundAudioUrl or audioUrl." });
    }
  }
  if (module.slug === "respiratory-distress" && /device identification|device recognition|oxygen device|mask|nasal cannula|non-rebreather|venturi|nrb/i.test(`${question.title} ${question.questionText}`)) {
    if (!question.clinicalData?.deviceImageUrl?.trim()) {
      issues.push({ questionId: question.id, severity: "invalid", code: "missing_oxygen_device_image", message: "Respiratory distress oxygen-device identification requires oxygenDeviceImageUrl/deviceImageUrl." });
    }
  }
  if (module.slug === "respiratory-distress" && /ABG|PaCO2|PaO2|HCO3|oxygenation vs ventilation|CO2/i.test(`${question.title} ${question.questionText}`)) {
    const abg = question.clinicalData?.abgValues;
    if (!abg || abg.pH == null || abg.PaCO2 == null || abg.HCO3 == null || abg.PaO2 == null) {
      issues.push({ questionId: question.id, severity: "invalid", code: "missing_complete_abg", message: "ABG-based respiratory distress questions require pH, PaCO2, HCO3, and PaO2." });
    }
  }
  if (module.slug === "iv-infusion-safety" && /medication order|order|high-alert|compatibility|incompatible|medication/i.test(`${question.title} ${question.questionText}`)) {
    if (!question.clinicalData?.medicationOrder || Object.keys(question.clinicalData.medicationOrder).length === 0) {
      issues.push({ questionId: question.id, severity: "invalid", code: "missing_medication_order", message: "IV medication/order safety questions require medicationOrder details." });
    }
  }
  if (module.slug === "iv-infusion-safety" && /infusion rate|rate|fluid|isotonic|hypotonic|hypertonic|pump|resuscitation/i.test(`${question.title} ${question.questionText}`)) {
    if (!question.clinicalData?.infusionData || Object.keys(question.clinicalData.infusionData).length === 0) {
      issues.push({ questionId: question.id, severity: "invalid", code: "missing_infusion_data", message: "IV rate/fluid questions require infusionData." });
    }
  }
  if (module.slug === "iv-infusion-safety" && /IV site|infiltration|extravasation|swollen|painful|site appearance/i.test(`${question.title} ${question.questionText}`)) {
    if (!question.clinicalData?.ivSiteImageUrl?.trim()) {
      issues.push({ questionId: question.id, severity: "invalid", code: "missing_iv_site_image", message: "IV site appearance questions require ivSiteImageUrl." });
    }
  }
  if (module.slug === "neuro-stroke-recognition" && /GCS/i.test(`${question.title} ${question.questionText}`)) {
    const gcs = question.clinicalData?.neuroFindings?.GCS;
    if (!gcs || gcs.eye == null || gcs.verbal == null || gcs.motor == null || gcs.total == null) {
      issues.push({ questionId: question.id, severity: "invalid", code: "missing_gcs_components", message: "GCS questions require eye, verbal, motor, and total GCS data." });
    }
  }
  if (module.slug === "neuro-stroke-recognition" && /hypoglycemia|glucose|mimic/i.test(`${question.title} ${question.questionText}`)) {
    if (question.clinicalData?.glucoseMmolL == null) {
      issues.push({ questionId: question.id, severity: "invalid", code: "missing_glucose_value", message: "Stroke mimic questions require glucose value." });
    }
  }
  if (module.slug === "neuro-stroke-recognition" && /functional|ADL|neglect|dressing|care planning/i.test(`${question.title} ${question.questionText}`)) {
    if (!question.clinicalData?.functionalTaskData && !question.clinicalData?.imageUrl?.trim() && !question.videoUrl?.trim()) {
      issues.push({ questionId: question.id, severity: "invalid", code: "missing_functional_task_data", message: "OT visual/functional neuro questions require functionalTaskData or image/video media." });
    }
  }

  if (!question.questionText.trim()) issues.push({ questionId: question.id, severity: "invalid", code: "missing_question_text", message: "Question text is required." });
  if (!Array.isArray(question.answerOptions) || question.answerOptions.length < 2) issues.push({ questionId: question.id, severity: "invalid", code: "missing_answer_options", message: "At least two answer options are required." });
  if (!question.correctAnswer.trim() || !question.answerOptions.includes(question.correctAnswer)) issues.push({ questionId: question.id, severity: "invalid", code: "ambiguous_correct_answer", message: "One clearly correct answer must match an answer option." });
  if (!question.rationale.trim()) issues.push({ questionId: question.id, severity: "invalid", code: "missing_rationale", message: "Rationale is required." });
  if (!question.whyOthersWrong || question.whyOthersWrong.length < Math.min(3, Math.max(1, question.answerOptions.length - 1))) issues.push({ questionId: question.id, severity: "invalid", code: "missing_distractor_rationales", message: "Rationale must explain why other options are wrong." });
  if (!question.whatToLookFor?.trim()) issues.push({ questionId: question.id, severity: "invalid", code: "missing_what_to_look_for", message: "Question must include what to look for clinically." });

  for (const message of realisticClinicalDataIssues(question)) {
    issues.push({ questionId: question.id, severity: "invalid", code: "clinical_accuracy", message });
  }

  if (module.level === "advanced" && (!question.decisionLayer?.whatIsHappening?.trim() || !question.decisionLayer.priorityAction?.trim())) {
    issues.push({ questionId: question.id, severity: "invalid", code: "missing_decision_layer", message: "Advanced questions require what is happening and priority action." });
  }

  if (question.questionType === "rapid_drill") {
    if (question.rapidRecognition?.compatible !== true) issues.push({ questionId: question.id, severity: "invalid", code: "rapid_incompatible", message: "Rapid drill questions must be rapid-recognition compatible." });
    if (words(question.questionText) > (question.rapidRecognition?.maxStemWords ?? 30)) issues.push({ questionId: question.id, severity: "invalid", code: "rapid_too_verbose", message: "Rapid drill stem is too verbose." });
  }

  return issues;
}

export function auditAlliedModuleQuestions(module: AlliedMasteryModule, scaffold = createDraftScaffoldForModule(module)): AlliedModuleQuestionAudit {
  const questions = scaffoldQuestions(scaffold);
  const issues = questions.flatMap((question) => auditAlliedQuestion(module, question));
  const invalidIssues = issues.filter((issue) => issue.severity === "invalid");
  const compliantQuestionIds = new Set(questions.map((question) => question.id));
  for (const issue of invalidIssues.filter((issue) => issue.code.startsWith("missing_") || issue.code.endsWith("_required"))) {
    compliantQuestionIds.delete(issue.questionId);
  }
  const questionCount = questions.length;
  const modalityCompliancePct = questionCount > 0 ? Math.round((1000 * compliantQuestionIds.size) / questionCount) / 10 : 0;
  const professionKey = module.professionKeys[0];
  return {
    moduleId: module.id,
    moduleTitle: module.title,
    professionKey,
    profession: ALLIED_MASTERY_PROFESSION_LABELS[professionKey] ?? professionKey,
    questionCount,
    modalityCompliancePct,
    missingAudio: issues.filter((issue) => issue.code === "missing_audioUrl" || issue.code === "audio_required").length,
    missingImage: issues.filter((issue) => issue.code === "missing_imageUrl" || issue.code === "image_required").length,
    missingVideo: issues.filter((issue) => issue.code === "missing_videoUrl").length,
    accuracyIssues: issues.filter((issue) => issue.code === "clinical_accuracy" || issue.code === "ambiguous_correct_answer").length,
    rationaleIssues: issues.filter((issue) => issue.code === "missing_rationale" || issue.code === "missing_distractor_rationales" || issue.code === "missing_what_to_look_for").length,
    decisionLayerIssues: issues.filter((issue) => issue.code === "missing_decision_layer").length,
    rapidRecognitionIssues: issues.filter((issue) => issue.code === "rapid_incompatible" || issue.code === "rapid_too_verbose").length,
    readinessStatus: invalidIssues.length === 0 && questionCount > 0 ? "ready" : "invalid",
    issues,
  };
}

export function buildAlliedQuestionModalityAuditReport(modules: AlliedMasteryModule[] = ALLIED_MASTERY_MODULES): AlliedQuestionModalityAuditReport {
  const auditedModules = modules.map((module) => auditAlliedModuleQuestions(module));
  const questionCount = auditedModules.reduce((sum, item) => sum + item.questionCount, 0);
  const averageModalityCompliancePct = auditedModules.length
    ? Math.round((10 * auditedModules.reduce((sum, item) => sum + item.modalityCompliancePct, 0)) / auditedModules.length) / 10
    : 0;
  return {
    generatedAt: new Date().toISOString(),
    pass: auditedModules.every((item) => item.readinessStatus === "ready"),
    summary: {
      modulesAudited: auditedModules.length,
      questionCount,
      readyModules: auditedModules.filter((item) => item.readinessStatus === "ready").length,
      invalidModules: auditedModules.filter((item) => item.readinessStatus === "invalid").length,
      averageModalityCompliancePct,
      missingAudio: auditedModules.reduce((sum, item) => sum + item.missingAudio, 0),
      missingImage: auditedModules.reduce((sum, item) => sum + item.missingImage, 0),
      missingVideo: auditedModules.reduce((sum, item) => sum + item.missingVideo, 0),
      accuracyIssues: auditedModules.reduce((sum, item) => sum + item.accuracyIssues, 0),
    },
    modules: auditedModules,
  };
}

export function alliedQuestionModalityAuditMarkdown(report: AlliedQuestionModalityAuditReport): string {
  const lines = [
    "# Allied Question Modality Audit",
    "",
    `PASS/FAIL: ${report.pass ? "PASS" : "FAIL"}`,
    "",
    "Audits hidden allied mastery module draft questions for modality-correct inputs, clinically realistic values, rationale quality, decision-making layers, and rapid recognition compatibility.",
    "",
    "## Summary",
    "",
    `- Modules audited: ${report.summary.modulesAudited}`,
    `- Questions audited: ${report.summary.questionCount}`,
    `- Ready modules: ${report.summary.readyModules}`,
    `- Invalid modules: ${report.summary.invalidModules}`,
    `- Average modality compliance: ${report.summary.averageModalityCompliancePct}%`,
    `- Missing audio: ${report.summary.missingAudio}`,
    `- Missing image: ${report.summary.missingImage}`,
    `- Missing video: ${report.summary.missingVideo}`,
    `- Accuracy issues: ${report.summary.accuracyIssues}`,
    "",
    "## Modules",
    "",
  ];
  for (const item of report.modules) {
    lines.push(`### ${item.profession} - ${item.moduleTitle}`);
    lines.push("");
    lines.push(`- Module: ${item.moduleId}`);
    lines.push(`- Question count: ${item.questionCount}`);
    lines.push(`- Modality compliance: ${item.modalityCompliancePct}%`);
    lines.push(`- Missing audio/image/video: ${item.missingAudio}/${item.missingImage}/${item.missingVideo}`);
    lines.push(`- Accuracy issues: ${item.accuracyIssues}`);
    lines.push(`- Rationale issues: ${item.rationaleIssues}`);
    lines.push(`- Decision layer issues: ${item.decisionLayerIssues}`);
    lines.push(`- Rapid recognition issues: ${item.rapidRecognitionIssues}`);
    lines.push(`- Readiness status: ${item.readinessStatus}`);
    lines.push(`- Issues: ${item.issues.length ? item.issues.map((issue) => `${issue.questionId}:${issue.code}`).join(", ") : "None"}`);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}