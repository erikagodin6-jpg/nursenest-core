export interface QualityScore {
  dimension: string;
  score: number;
  maxScore: number;
  feedback: string;
  passed: boolean;
}

export interface ItemQualityResult {
  itemIndex: number;
  itemType: "question" | "flashcard" | "rationale";
  overallScore: number;
  passed: boolean;
  scores: QualityScore[];
  revisionFeedback: string[];
  status: "pass" | "needs_revision";
}

export interface BatchQualityReport {
  batchSize: number;
  passedCount: number;
  flaggedCount: number;
  overallPassRate: number;
  itemResults: ItemQualityResult[];
  batchIssues: string[];
  diversityReport: DiversityReport;
}

export interface DiversityReport {
  structuralRepetitionRate: number;
  answerPositionBias: Record<string, number>;
  formatDistribution: Record<string, number>;
  topicClustering: Record<string, number>;
  phrasingSimilarityFlags: number;
  issues: string[];
}

const PASS_THRESHOLD = 0.65;

const FAKE_PATIENT_PATTERNS = [
  /\bjohn doe\b/i, /\bjane doe\b/i, /\bjohn smith\b/i, /\bjane smith\b/i,
  /\bpatient x\b/i, /\bpatient y\b/i, /\bpatient z\b/i,
  /\bmr\.\s*x\b/i, /\bms\.\s*x\b/i, /\bmrs\.\s*x\b/i,
];

const UNREALISTIC_VITALS = [
  { pattern: /bp\s*[:=]?\s*(\d+)\/(\d+)/i, check: (s: number, d: number) => s > 300 || d > 200 || s < 40 || d < 20 },
  { pattern: /hr\s*[:=]?\s*(\d+)/i, check: (v: number) => v > 300 || v < 10 },
  { pattern: /temp(?:erature)?\s*[:=]?\s*(\d+\.?\d*)\s*[°]?[fF]/i, check: (v: number) => v > 115 || v < 85 },
  { pattern: /temp(?:erature)?\s*[:=]?\s*(\d+\.?\d*)\s*[°]?[cC]/i, check: (v: number) => v > 46 || v < 29 },
  { pattern: /rr\s*[:=]?\s*(\d+)/i, check: (v: number) => v > 80 || v < 2 },
  { pattern: /spo2\s*[:=]?\s*(\d+)/i, check: (v: number) => v > 100 || v < 30 },
];

const TEMPLATE_STEM_PATTERNS = [
  /^a\s+\d+[\s-]?year[\s-]?old\s+(male|female|man|woman|patient|client)\s+(presents|comes|arrives|is admitted)/i,
  /^the nurse is caring for a\s+/i,
  /^a patient is admitted with\s+/i,
  /^which of the following\s+/i,
];

const SPECIALTY_TERMINOLOGY: Record<string, { terms: string[]; settings: string[]; scopeMarkers: string[] }> = {
  rrt: {
    terms: ["ventilator", "intubation", "extubation", "ABG", "FiO2", "PEEP", "tidal volume", "bronchoscopy", "nebulizer", "spirometry", "CPAP", "BiPAP", "capnography", "tracheostomy", "suctioning"],
    settings: ["respiratory care unit", "pulmonary function lab", "ICU", "NICU", "emergency department", "sleep lab"],
    scopeMarkers: ["respiratory therapist", "RRT", "respiratory care practitioner"],
  },
  pharmacyTech: {
    terms: ["compounding", "dispensing", "formulary", "DEA schedule", "NDC", "lot number", "beyond-use date", "USP 795", "USP 797", "sig code", "DAW", "adjudication"],
    settings: ["pharmacy", "compounding area", "clean room", "retail pharmacy", "hospital pharmacy", "IV room"],
    scopeMarkers: ["pharmacy technician", "pharmacist supervision", "PTCB"],
  },
  paramedic: {
    terms: ["prehospital", "field assessment", "rapid transport", "BVM", "IO access", "12-lead ECG", "ACLS", "PALS", "triage", "extrication", "RSI"],
    settings: ["scene", "ambulance", "field", "prehospital", "transport", "emergency scene", "MCI"],
    scopeMarkers: ["paramedic", "EMS", "NREMT", "first responder"],
  },
  mlt: {
    terms: ["specimen", "centrifuge", "reagent", "QC", "calibration", "pipette", "hemolysis", "crossmatch", "gram stain", "culture", "sensitivity", "CLIA"],
    settings: ["laboratory", "blood bank", "microbiology lab", "chemistry analyzer", "hematology analyzer"],
    scopeMarkers: ["medical laboratory technologist", "MLT", "ASCP", "lab technician"],
  },
  imaging: {
    terms: ["kVp", "mAs", "collimation", "positioning", "radiograph", "exposure", "ALARA", "artifact", "CR", "DR", "fluoroscopy", "contrast media"],
    settings: ["radiology department", "imaging suite", "x-ray room", "CT suite", "MRI suite"],
    scopeMarkers: ["radiologic technologist", "ARRT", "imaging technologist"],
  },
  psychotherapist: {
    terms: ["therapeutic alliance", "transference", "countertransference", "CBT", "DBT", "EMDR", "psychodynamic", "treatment plan", "therapeutic modality", "session", "intervention"],
    settings: ["private practice", "therapy office", "counseling center", "mental health clinic", "group therapy room"],
    scopeMarkers: ["psychotherapist", "therapist", "counselor", "CRPO", "clinical supervision"],
  },
  addictionsCounsellor: {
    terms: ["harm reduction", "motivational interviewing", "stages of change", "relapse prevention", "MAT", "detoxification", "withdrawal", "CIWA", "COWS", "12-step"],
    settings: ["treatment center", "detox facility", "outpatient clinic", "recovery house", "safe consumption site"],
    scopeMarkers: ["addictions counsellor", "substance use counselor", "CASW", "addiction worker"],
  },
  socialWorker: {
    terms: ["biopsychosocial", "case management", "advocacy", "NASW", "code of ethics", "duty to warn", "informed consent", "mandated reporting", "systems theory"],
    settings: ["social service agency", "community health center", "hospital social work", "child welfare", "school setting"],
    scopeMarkers: ["social worker", "ASWB", "MSW", "BSW", "LCSW"],
  },
  addictionsWorker: {
    terms: ["harm reduction", "motivational interviewing", "stages of change", "relapse prevention", "MAT", "detoxification", "withdrawal", "CIWA", "COWS", "12-step"],
    settings: ["treatment center", "detox facility", "outpatient clinic", "recovery house", "safe consumption site"],
    scopeMarkers: ["addictions counsellor", "substance use counselor", "CASW", "addiction worker"],
  },
  ot: {
    terms: ["occupation", "ADLs", "IADLs", "adaptive equipment", "splint", "sensory processing", "motor planning", "fine motor", "functional assessment"],
    settings: ["rehabilitation center", "occupational therapy clinic", "inpatient rehab", "home health", "school-based OT"],
    scopeMarkers: ["occupational therapist", "OT", "OTR", "COTA"],
  },
  pt: {
    terms: ["gait", "range of motion", "manual muscle testing", "therapeutic exercise", "modality", "mobilization", "proprioception", "balance training"],
    settings: ["physical therapy clinic", "outpatient rehab", "inpatient rehab", "sports medicine", "home health PT"],
    scopeMarkers: ["physical therapist", "PT", "PTA", "DPT"],
  },
};

const NEW_GRAD_FLOOR_TOPICS = [
  "delegation", "escalation", "shift management", "time management", "preceptor",
  "prioritization", "handoff", "SBAR", "charge nurse", "medication administration",
  "emotional resilience", "burnout", "imposter syndrome", "conflict resolution",
  "code blue", "rapid response", "patient assignment", "workload management",
  "first day", "orientation", "mentorship", "clinical judgment in practice",
  "safety reporting", "incident report", "chain of command", "scope of practice",
];

const NEW_GRAD_DISEASE_RECALL_MARKERS = [
  /pathophysiology of\b/i, /etiology of\b/i, /signs and symptoms of\b/i,
  /which disease\b/i, /define\s+/i, /what is the primary cause of\b/i,
  /which condition is characterized by\b/i, /the hallmark sign of\b/i,
];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function cosineSimilarity(a: string, b: string): number {
  const wordsA = a.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const wordsB = b.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  if (wordsA.length === 0 || wordsB.length === 0) return 0;
  const vocab = new Set([...wordsA, ...wordsB]);
  const vecA: number[] = [];
  const vecB: number[] = [];
  for (const w of vocab) {
    vecA.push(wordsA.filter(x => x === w).length);
    vecB.push(wordsB.filter(x => x === w).length);
  }
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

function extractStemPattern(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/\d+/g, "NUM")
    .replace(/\b(he|she|they|the patient|the client|the nurse|a nurse)\b/gi, "SUBJECT")
    .replace(/\b[A-Z][a-z]+\b/g, "NAME")
    .substring(0, 80)
    .trim();
}

export function scoreQuestionQuality(
  question: any,
  batchContext: { stems: string[]; specialtyKey?: string; isNewGrad?: boolean; isAdaptive?: boolean; difficultyLevel?: string }
): ItemQualityResult {
  const scores: QualityScore[] = [];
  const feedback: string[] = [];
  const stem = question.stem || question.question || "";
  const scenario = question.scenario || "";
  const options = question.options || question.choices || [];
  const rationale = question.rationale || question.rationaleLong || question.rationale_long || "";
  const correctAnswer = question.correctAnswer || question.correct_answer || question.correctAnswers || question.correct_answers || "";
  const difficulty = question.difficulty || 3;

  const clinicalRealism = scoreClinicRealism(stem, scenario);
  scores.push(clinicalRealism);
  if (!clinicalRealism.passed) feedback.push(clinicalRealism.feedback);

  const educationalValue = scoreEducationalValue(stem, rationale, options);
  scores.push(educationalValue);
  if (!educationalValue.passed) feedback.push(educationalValue.feedback);

  const stemVariety = scoreStemVariety(stem, batchContext.stems);
  scores.push(stemVariety);
  if (!stemVariety.passed) feedback.push(stemVariety.feedback);

  const distractorQuality = scoreDistractorQuality(options, correctAnswer);
  scores.push(distractorQuality);
  if (!distractorQuality.passed) feedback.push(distractorQuality.feedback);

  const scenarioAuth = scoreScenarioAuthenticity(stem, scenario);
  scores.push(scenarioAuth);
  if (!scenarioAuth.passed) feedback.push(scenarioAuth.feedback);

  if (batchContext.specialtyKey) {
    const specialtyFit = scoreSpecialtyFit(stem, scenario, rationale, batchContext.specialtyKey);
    scores.push(specialtyFit);
    if (!specialtyFit.passed) feedback.push(specialtyFit.feedback);
  }

  if (batchContext.isNewGrad) {
    const newGradRelevance = scoreNewGradRelevance(stem, scenario);
    scores.push(newGradRelevance);
    if (!newGradRelevance.passed) feedback.push(newGradRelevance.feedback);
  }

  if (batchContext.isAdaptive && batchContext.difficultyLevel) {
    const adaptiveDifficulty = scoreAdaptiveDifficulty(stem, options, difficulty, batchContext.difficultyLevel);
    scores.push(adaptiveDifficulty);
    if (!adaptiveDifficulty.passed) feedback.push(adaptiveDifficulty.feedback);
  }

  const rationaleResult = scoreRationaleQuality(rationale, options, correctAnswer);
  scores.push(rationaleResult);
  if (!rationaleResult.passed) feedback.push(rationaleResult.feedback);

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const totalMax = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const overallScore = totalMax > 0 ? totalScore / totalMax : 0;
  const passed = overallScore >= PASS_THRESHOLD && !scores.some(s => s.score === 0 && s.maxScore > 5);

  return {
    itemIndex: 0,
    itemType: "question",
    overallScore: Math.round(overallScore * 100),
    passed,
    scores,
    revisionFeedback: feedback,
    status: passed ? "pass" : "needs_revision",
  };
}

function scoreClinicRealism(stem: string, scenario: string): QualityScore {
  let score = 10;
  const feedback: string[] = [];
  const combined = `${stem} ${scenario}`;

  if (stem.length < 50) {
    score -= 4;
    feedback.push("Stem is too short for a realistic clinical scenario (< 50 chars)");
  }

  const hasPatientContext = /\b(patient|client|resident|individual)\b/i.test(combined);
  const hasClinicalData = /\b(vitals|bp|hr|temp|lab|assessment|reports?|presents?|complain|symptom)\b/i.test(combined);
  if (!hasPatientContext) { score -= 2; feedback.push("No patient/client context in scenario"); }
  if (!hasClinicalData) { score -= 2; feedback.push("No clinical data or assessment findings mentioned"); }

  const hasAge = /\b\d{1,3}[\s-]?year[\s-]?old\b/i.test(combined);
  const hasHistory = /\b(history|hx|pmh|past medical)\b/i.test(combined);
  if (!hasAge && !hasHistory) { score -= 1; feedback.push("Consider adding age or medical history for realism"); }

  return {
    dimension: "Clinical Realism",
    score: Math.max(0, score),
    maxScore: 10,
    feedback: feedback.join("; ") || "Clinical scenario appears realistic",
    passed: score >= 6,
  };
}

function scoreEducationalValue(stem: string, rationale: string, options: any[]): QualityScore {
  let score = 10;
  const feedback: string[] = [];

  const triviaPatterns = [
    /who discovered\b/i, /what year was\b/i, /which scientist\b/i,
    /the abbreviation for\b/i, /what does .{1,10} stand for\b/i,
    /name the\b/i, /list the\b/i,
  ];
  for (const pattern of triviaPatterns) {
    if (pattern.test(stem)) {
      score -= 4;
      feedback.push("Question appears to test trivia rather than clinical reasoning");
      break;
    }
  }

  const actionVerbs = /\b(prioritize|assess|intervene|evaluate|delegate|educate|administer|monitor|notify|implement|plan|document)\b/i;
  if (!actionVerbs.test(stem)) {
    score -= 2;
    feedback.push("Stem lacks action-oriented clinical verbs (prioritize, assess, intervene, etc.)");
  }

  if (rationale.length < 50) {
    score -= 3;
    feedback.push("Rationale too brief to provide educational value");
  }

  return {
    dimension: "Educational Value",
    score: Math.max(0, score),
    maxScore: 10,
    feedback: feedback.join("; ") || "Strong educational value",
    passed: score >= 6,
  };
}

function scoreStemVariety(stem: string, batchStems: string[]): QualityScore {
  let score = 10;
  const feedback: string[] = [];
  const pattern = extractStemPattern(stem);

  let patternMatchCount = 0;
  for (const other of batchStems) {
    const otherPattern = extractStemPattern(other);
    if (pattern === otherPattern) patternMatchCount++;
  }

  if (patternMatchCount > 2) {
    score -= 5;
    feedback.push(`Stem pattern repeated ${patternMatchCount} times in batch — restructure for variety`);
  } else if (patternMatchCount > 1) {
    score -= 2;
    feedback.push("Stem pattern is similar to another item in the batch");
  }

  for (const tpl of TEMPLATE_STEM_PATTERNS) {
    if (tpl.test(stem)) {
      score -= 2;
      feedback.push("Stem uses a common template opening — consider more varied phrasing");
      break;
    }
  }

  return {
    dimension: "Stem Variety",
    score: Math.max(0, score),
    maxScore: 10,
    feedback: feedback.join("; ") || "Good stem variety",
    passed: score >= 6,
  };
}

function scoreDistractorQuality(options: any[], correctAnswer: any): QualityScore {
  let score = 10;
  const feedback: string[] = [];
  const optTexts = options.map((o: any) => typeof o === "string" ? o : (o.text || o.content || String(o)));

  if (optTexts.length < 4) {
    score -= 5;
    feedback.push(`Only ${optTexts.length} answer options — need at least 4`);
  }

  const lengths = optTexts.map((t: string) => t.length);
  const maxLen = Math.max(...lengths);
  const minLen = Math.min(...lengths);
  if (maxLen > 0 && minLen / maxLen < 0.2) {
    score -= 2;
    feedback.push("Large disparity in option lengths may make the answer obvious");
  }

  const lowerTexts = optTexts.map((t: string) => t.toLowerCase().trim());
  const uniques = new Set(lowerTexts);
  if (uniques.size < lowerTexts.length) {
    score -= 3;
    feedback.push("Duplicate answer options detected");
  }

  for (const t of lowerTexts) {
    if (/all of the above/i.test(t) || /none of the above/i.test(t)) {
      score -= 2;
      feedback.push("'All/None of the above' options reduce educational value");
      break;
    }
  }

  const veryShort = lowerTexts.filter((t: string) => t.length < 5);
  if (veryShort.length > 0) {
    score -= 1;
    feedback.push("Some options are very short — distractors should be plausible and substantive");
  }

  return {
    dimension: "Distractor Quality",
    score: Math.max(0, score),
    maxScore: 10,
    feedback: feedback.join("; ") || "Distractors are plausible and well-constructed",
    passed: score >= 6,
  };
}

function scoreScenarioAuthenticity(stem: string, scenario: string): QualityScore {
  let score = 10;
  const feedback: string[] = [];
  const combined = `${stem} ${scenario}`;

  for (const pattern of FAKE_PATIENT_PATTERNS) {
    if (pattern.test(combined)) {
      score -= 4;
      feedback.push("Uses obviously fake patient name (John Doe, Patient X, etc.)");
      break;
    }
  }

  for (const vital of UNREALISTIC_VITALS) {
    const match = combined.match(vital.pattern);
    if (match) {
      const values = match.slice(1).map(Number);
      const isUnrealistic = values.length === 2 ? (vital.check as any)(values[0], values[1]) : (vital.check as any)(values[0]);
      if (isUnrealistic) {
        score -= 3;
        feedback.push(`Unrealistic vital sign detected: ${match[0]}`);
        break;
      }
    }
  }

  const implausibleCombos = [
    { markers: [/\bpregnant\b/i, /\bprostate\b/i], msg: "Implausible combination: pregnant + prostate" },
    { markers: [/\bpediatric\b|\bchild\b|\binfant\b/i, /\bgeriatric\b|\belderly\b/i], msg: "Implausible combination: pediatric + geriatric in same patient" },
  ];
  for (const combo of implausibleCombos) {
    if (combo.markers.every(m => m.test(combined))) {
      score -= 4;
      feedback.push(combo.msg);
      break;
    }
  }

  return {
    dimension: "Scenario Authenticity",
    score: Math.max(0, score),
    maxScore: 10,
    feedback: feedback.join("; ") || "Scenario appears authentic",
    passed: score >= 6,
  };
}

function scoreSpecialtyFit(stem: string, scenario: string, rationale: string, specialtyKey: string): QualityScore {
  let score = 10;
  const feedback: string[] = [];
  const combined = `${stem} ${scenario} ${rationale}`.toLowerCase();
  const spec = SPECIALTY_TERMINOLOGY[specialtyKey];

  if (!spec) {
    return { dimension: "Specialty Fit", score: 10, maxScore: 10, feedback: "Specialty not configured for terminology check", passed: true };
  }

  const termMatches = spec.terms.filter(t => combined.includes(t.toLowerCase()));
  const termRatio = termMatches.length / Math.min(spec.terms.length, 5);
  if (termRatio < 0.2) {
    score -= 4;
    feedback.push(`Content lacks profession-specific terminology for ${specialtyKey}. Expected terms like: ${spec.terms.slice(0, 5).join(", ")}`);
  } else if (termRatio < 0.4) {
    score -= 2;
    feedback.push(`Limited use of ${specialtyKey}-specific terminology`);
  }

  const settingMatches = spec.settings.filter(s => combined.includes(s.toLowerCase()));
  if (settingMatches.length === 0) {
    score -= 2;
    feedback.push(`No profession-specific clinical settings mentioned. Consider: ${spec.settings.slice(0, 3).join(", ")}`);
  }

  const scopeMatches = spec.scopeMarkers.filter(m => combined.includes(m.toLowerCase()));
  if (scopeMatches.length === 0) {
    score -= 2;
    feedback.push("Content doesn't reference the specific professional role or scope of practice");
  }

  const genericNursingTerms = ["nursing diagnosis", "nursing process", "NANDA", "nursing care plan", "RN scope"];
  const genericHits = genericNursingTerms.filter(t => combined.includes(t.toLowerCase()));
  if (genericHits.length >= 2) {
    score -= 3;
    feedback.push("Content reads as generic nursing rather than specialty-specific — uses nursing-specific terminology");
  }

  return {
    dimension: "Specialty Fit",
    score: Math.max(0, score),
    maxScore: 10,
    feedback: feedback.join("; ") || `Content is well-suited for ${specialtyKey}`,
    passed: score >= 5,
  };
}

function scoreNewGradRelevance(stem: string, scenario: string): QualityScore {
  let score = 10;
  const feedback: string[] = [];
  const combined = `${stem} ${scenario}`.toLowerCase();

  const floorTopicHits = NEW_GRAD_FLOOR_TOPICS.filter(t => combined.includes(t));
  if (floorTopicHits.length === 0) {
    score -= 4;
    feedback.push("Content lacks real-world floor topics (delegation, escalation, shift management, preceptor dynamics, etc.)");
  }

  let diseaseRecallCount = 0;
  for (const marker of NEW_GRAD_DISEASE_RECALL_MARKERS) {
    if (marker.test(combined)) diseaseRecallCount++;
  }
  if (diseaseRecallCount >= 2) {
    score -= 4;
    feedback.push("Content appears to be disease-process recall disguised as new grad content — focus on transition-to-practice scenarios");
  } else if (diseaseRecallCount === 1) {
    score -= 2;
    feedback.push("Content leans toward disease recall — ensure it tests real-world floor decision-making");
  }

  const transitionMarkers = /\b(first day|new graduate|new grad|orientation|transition|preceptor|residency program|floor|unit)\b/i;
  if (!transitionMarkers.test(combined)) {
    score -= 2;
    feedback.push("No transition-to-practice context markers found");
  }

  return {
    dimension: "New Grad Relevance",
    score: Math.max(0, score),
    maxScore: 10,
    feedback: feedback.join("; ") || "Content is relevant to new graduate transition-to-practice",
    passed: score >= 5,
  };
}

function scoreAdaptiveDifficulty(stem: string, options: any[], difficulty: number, expectedLevel: string): QualityScore {
  let score = 10;
  const feedback: string[] = [];
  const stemLower = stem.toLowerCase();

  const recallMarkers = /\b(define|identify|name|list|recall|recognize|what is)\b/i;
  const applicationMarkers = /\b(apply|implement|administer|demonstrate|calculate|perform|carry out)\b/i;
  const analysisMarkers = /\b(analyze|compare|differentiate|distinguish|prioritize|evaluate|which.*first|most appropriate|best action)\b/i;
  const judgmentMarkers = /\b(clinical judgment|competing priorities|ambiguous|uncertain|multiple comorbidities|complex|ethical dilemma)\b/i;

  const isRecall = recallMarkers.test(stemLower);
  const isApplication = applicationMarkers.test(stemLower);
  const isAnalysis = analysisMarkers.test(stemLower);
  const isJudgment = judgmentMarkers.test(stemLower);

  if (expectedLevel === "easy") {
    if (!isRecall && !isApplication && isAnalysis) {
      score -= 3;
      feedback.push("Easy-level items should test recognition/recall, not analysis");
    }
    if (difficulty > 3) {
      score -= 2;
      feedback.push(`Difficulty ${difficulty} is too high for easy-level pool items`);
    }
  } else if (expectedLevel === "medium") {
    if (isRecall && !isApplication && !isAnalysis) {
      score -= 3;
      feedback.push("Medium-level items should test application/analysis, not just recall");
    }
    if (difficulty < 2 || difficulty > 4) {
      score -= 2;
      feedback.push(`Difficulty ${difficulty} doesn't match medium-level expectations (2-4)`);
    }
  } else if (expectedLevel === "hard") {
    if (isRecall && !isJudgment && !isAnalysis) {
      score -= 5;
      feedback.push("Hard-level items must test clinical judgment under uncertainty, not just obscure facts");
    }
    if (!isJudgment && !isAnalysis) {
      score -= 3;
      feedback.push("Hard items should involve complex decision-making with competing priorities or ambiguity");
    }
    if (difficulty < 3) {
      score -= 2;
      feedback.push(`Difficulty ${difficulty} is too low for hard-level pool items`);
    }

    const stemWords = wordCount(stem);
    if (stemWords < 30) {
      score -= 2;
      feedback.push("Hard items should have longer, more complex stems with realistic ambiguity");
    }
  }

  return {
    dimension: "Adaptive Difficulty Fit",
    score: Math.max(0, score),
    maxScore: 10,
    feedback: feedback.join("; ") || `Item matches expected ${expectedLevel} difficulty level`,
    passed: score >= 5,
  };
}

function scoreRationaleQuality(rationale: string, options: any[], correctAnswer: any): QualityScore {
  let score = 10;
  const feedback: string[] = [];

  const wc = wordCount(rationale);
  if (wc < 30) {
    score -= 5;
    feedback.push(`Rationale is too short (${wc} words) — must teach, not just state the answer`);
  } else if (wc < 80) {
    score -= 2;
    feedback.push(`Rationale could be more thorough (${wc} words) — aim for 80+ words`);
  }

  if (wc > 800) {
    score -= 2;
    feedback.push(`Rationale is bloated (${wc} words) — keep it tight and readable`);
  }

  const rationaleLower = rationale.toLowerCase();
  const incorrectMarkers = /\b(incorrect|wrong|not the best|not appropriate|is wrong because|is incorrect because)\b/i;
  if (!incorrectMarkers.test(rationaleLower) && options.length >= 4) {
    score -= 2;
    feedback.push("Rationale should explain why incorrect options are wrong, not just why the correct answer is right");
  }

  const correctMarkers = /\b(correct|right|best|appropriate|the answer)\b/i;
  if (!correctMarkers.test(rationaleLower)) {
    score -= 1;
    feedback.push("Rationale should clearly explain why the correct answer is correct");
  }

  return {
    dimension: "Rationale Quality",
    score: Math.max(0, score),
    maxScore: 10,
    feedback: feedback.join("; ") || "Rationale is thorough and educational",
    passed: score >= 6,
  };
}

export function scoreFlashcardQuality(
  card: any,
  batchContext: { cardTypes: Record<string, number>; totalCards: number; existingFronts: string[] }
): ItemQualityResult {
  const scores: QualityScore[] = [];
  const feedback: string[] = [];
  const front = card.front || "";
  const back = card.back || "";
  const cardType = card.cardType || card.card_type || "unknown";

  let conciseScore = 10;
  const conciseFeedback: string[] = [];
  const frontWc = wordCount(front);
  const backWc = wordCount(back);

  if (frontWc > 100) { conciseScore -= 3; conciseFeedback.push(`Front is too long (${frontWc} words) — keep under 100 words`); }
  if (frontWc < 5) { conciseScore -= 3; conciseFeedback.push(`Front is too short (${frontWc} words) — needs enough context`); }
  if (backWc > 300) { conciseScore -= 3; conciseFeedback.push(`Back is too long (${backWc} words) — keep under 300 words`); }
  if (backWc < 5) { conciseScore -= 3; conciseFeedback.push(`Back is too short (${backWc} words)`); }

  scores.push({
    dimension: "Conciseness",
    score: Math.max(0, conciseScore),
    maxScore: 10,
    feedback: conciseFeedback.join("; ") || "Card is concise and well-sized",
    passed: conciseScore >= 6,
  });
  if (conciseScore < 6) feedback.push(...conciseFeedback);

  let relevanceScore = 10;
  const relevanceFeedback: string[] = [];
  const triviaPatterns = [
    /who discovered\b/i, /what year\b/i, /which country\b/i,
    /name the inventor\b/i, /what does .{1,8} stand for\b/i,
  ];
  const combinedText = `${front} ${back}`;
  for (const p of triviaPatterns) {
    if (p.test(combinedText)) {
      relevanceScore -= 4;
      relevanceFeedback.push("Card appears to test trivia rather than clinically important concepts");
      break;
    }
  }

  const clinicalRelevance = /\b(patient|clinical|treatment|assessment|intervention|medication|drug|symptom|diagnosis|sign|lab|monitoring|safety|complication)\b/i;
  if (!clinicalRelevance.test(combinedText)) {
    relevanceScore -= 3;
    relevanceFeedback.push("Card lacks clinical relevance markers — should test a clinically important concept");
  }

  scores.push({
    dimension: "High-Yield Relevance",
    score: Math.max(0, relevanceScore),
    maxScore: 10,
    feedback: relevanceFeedback.join("; ") || "Card tests a high-yield clinical concept",
    passed: relevanceScore >= 6,
  });
  if (relevanceScore < 6) feedback.push(...relevanceFeedback);

  let diversityScore = 10;
  const diversityFeedback: string[] = [];
  if (batchContext.totalCards > 5) {
    const typeCount = batchContext.cardTypes[cardType] || 0;
    const typePct = typeCount / batchContext.totalCards;
    if (typePct > 0.4) {
      diversityScore -= 4;
      diversityFeedback.push(`Card type '${cardType}' makes up ${Math.round(typePct * 100)}% of the batch (>40%) — diversify card types`);
    }
  }

  for (const existing of batchContext.existingFronts) {
    const sim = cosineSimilarity(front, existing);
    if (sim > 0.85) {
      diversityScore -= 5;
      diversityFeedback.push("Card front is too similar to another card in the batch");
      break;
    }
  }

  scores.push({
    dimension: "Card Type Diversity",
    score: Math.max(0, diversityScore),
    maxScore: 10,
    feedback: diversityFeedback.join("; ") || "Good card type diversity",
    passed: diversityScore >= 6,
  });
  if (diversityScore < 6) feedback.push(...diversityFeedback);

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const totalMax = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const overallScore = totalMax > 0 ? totalScore / totalMax : 0;
  const passed = overallScore >= PASS_THRESHOLD;

  return {
    itemIndex: 0,
    itemType: "flashcard",
    overallScore: Math.round(overallScore * 100),
    passed,
    scores,
    revisionFeedback: feedback,
    status: passed ? "pass" : "needs_revision",
  };
}

export function analyzeBatchDiversity(items: any[]): DiversityReport {
  const issues: string[] = [];

  const stems = items.map(i => i.stem || i.front || "");
  const patterns = stems.map(s => extractStemPattern(s));
  const patternCounts: Record<string, number> = {};
  for (const p of patterns) {
    patternCounts[p] = (patternCounts[p] || 0) + 1;
  }
  const maxPatternCount = Math.max(...Object.values(patternCounts), 0);
  const structuralRepetitionRate = items.length > 0 ? maxPatternCount / items.length : 0;
  if (maxPatternCount > 2) {
    issues.push(`Structural repetition: one stem pattern used ${maxPatternCount} times (max 2 allowed)`);
  }

  const answerPositionBias: Record<string, number> = {};
  let totalAnswered = 0;
  for (const item of items) {
    const correct = item.correctAnswer || item.correct_answer || item.correctAnswers || item.correct_answers;
    let pos: string = "";
    if (typeof correct === "string") pos = correct.toUpperCase();
    else if (Array.isArray(correct) && correct.length > 0) pos = String(correct[0]).toUpperCase();
    else if (typeof correct === "number") pos = String.fromCharCode(65 + correct);
    if (pos) {
      answerPositionBias[pos] = (answerPositionBias[pos] || 0) + 1;
      totalAnswered++;
    }
  }
  if (totalAnswered > 0) {
    for (const [pos, count] of Object.entries(answerPositionBias)) {
      const pct = count / totalAnswered;
      if (pct > 0.35) {
        issues.push(`Answer position bias: '${pos}' is correct ${Math.round(pct * 100)}% of the time (max 35%)`);
      }
    }
  }

  const formatDistribution: Record<string, number> = {};
  for (const item of items) {
    const fmt = item.questionType || item.question_type || item.type || "unknown";
    formatDistribution[fmt] = (formatDistribution[fmt] || 0) + 1;
  }
  if (items.length > 4) {
    for (const [fmt, count] of Object.entries(formatDistribution)) {
      const pct = count / items.length;
      if (pct > 0.5) {
        issues.push(`Format overuse: '${fmt}' makes up ${Math.round(pct * 100)}% of the batch (max 50%)`);
      }
    }
  }

  const topicClustering: Record<string, number> = {};
  for (const item of items) {
    const topic = item.topic || item.domain || item.category || item.bodySystem || item.body_system || "unknown";
    topicClustering[topic] = (topicClustering[topic] || 0) + 1;
  }
  if (items.length > 5) {
    for (const [topic, count] of Object.entries(topicClustering)) {
      const pct = count / items.length;
      if (pct > 0.3) {
        issues.push(`Topic clustering: '${topic}' covers ${Math.round(pct * 100)}% of the batch (max 30%)`);
      }
    }
  }

  let phrasingSimilarityFlags = 0;
  for (let i = 0; i < stems.length && i < 50; i++) {
    for (let j = i + 1; j < stems.length && j < 50; j++) {
      const sim = cosineSimilarity(stems[i], stems[j]);
      if (sim > 0.8) {
        phrasingSimilarityFlags++;
        if (phrasingSimilarityFlags <= 3) {
          issues.push(`High phrasing similarity (${(sim * 100).toFixed(0)}%) between items ${i + 1} and ${j + 1}`);
        }
      }
    }
  }

  return {
    structuralRepetitionRate,
    answerPositionBias: totalAnswered > 0
      ? Object.fromEntries(Object.entries(answerPositionBias).map(([k, v]) => [k, Math.round((v / totalAnswered) * 100)]))
      : {},
    formatDistribution: items.length > 0
      ? Object.fromEntries(Object.entries(formatDistribution).map(([k, v]) => [k, Math.round((v / items.length) * 100)]))
      : {},
    topicClustering: items.length > 0
      ? Object.fromEntries(Object.entries(topicClustering).map(([k, v]) => [k, Math.round((v / items.length) * 100)]))
      : {},
    phrasingSimilarityFlags,
    issues,
  };
}

export function scoreRationaleStandalone(rationale: string, batchRationales: string[]): ItemQualityResult {
  const scores: QualityScore[] = [];
  const feedback: string[] = [];

  const wc = wordCount(rationale);
  let teachingScore = 10;
  const teachingFeedback: string[] = [];

  const correctMarkers = /\b(correct|right|best|appropriate|the answer is)\b/i;
  const incorrectMarkers = /\b(incorrect|wrong|not the best|is wrong because|is incorrect)\b/i;
  if (!correctMarkers.test(rationale)) { teachingScore -= 3; teachingFeedback.push("Does not explain why the correct answer is right"); }
  if (!incorrectMarkers.test(rationale)) { teachingScore -= 3; teachingFeedback.push("Does not explain why incorrect options are wrong"); }

  scores.push({
    dimension: "Teaching Value",
    score: Math.max(0, teachingScore),
    maxScore: 10,
    feedback: teachingFeedback.join("; ") || "Rationale has strong teaching value",
    passed: teachingScore >= 6,
  });
  if (teachingScore < 6) feedback.push(...teachingFeedback);

  let conciseScore = 10;
  const conciseFeedback: string[] = [];
  if (wc < 30) { conciseScore -= 5; conciseFeedback.push(`Too short (${wc} words) — not enough to teach effectively`); }
  else if (wc < 80) { conciseScore -= 2; conciseFeedback.push(`Could be more thorough (${wc} words)`); }
  if (wc > 800) { conciseScore -= 3; conciseFeedback.push(`Too long (${wc} words) — trim to stay readable`); }
  else if (wc > 500) { conciseScore -= 1; conciseFeedback.push(`Consider tightening (${wc} words)`); }

  scores.push({
    dimension: "Conciseness",
    score: Math.max(0, conciseScore),
    maxScore: 10,
    feedback: conciseFeedback.join("; ") || "Rationale length is appropriate",
    passed: conciseScore >= 6,
  });
  if (conciseScore < 6) feedback.push(...conciseFeedback);

  let readabilityScore = 10;
  const readabilityFeedback: string[] = [];
  const sentences = rationale.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 0) {
    const avgSentenceLen = wc / sentences.length;
    if (avgSentenceLen > 40) { readabilityScore -= 3; readabilityFeedback.push("Average sentence length is too long — break into shorter sentences"); }
  }

  const jargonDensity = (rationale.match(/\b[A-Z]{3,}\b/g) || []).length;
  if (jargonDensity > 10) { readabilityScore -= 2; readabilityFeedback.push("High abbreviation density may reduce readability"); }

  scores.push({
    dimension: "Readability",
    score: Math.max(0, readabilityScore),
    maxScore: 10,
    feedback: readabilityFeedback.join("; ") || "Good readability",
    passed: readabilityScore >= 6,
  });
  if (readabilityScore < 6) feedback.push(...readabilityFeedback);

  let repetitionScore = 10;
  const repetitionFeedback: string[] = [];
  for (const other of batchRationales) {
    const sim = cosineSimilarity(rationale, other);
    if (sim > 0.85) {
      repetitionScore -= 5;
      repetitionFeedback.push("Rationale is highly similar to another in the batch — appears copy-pasted");
      break;
    } else if (sim > 0.7) {
      repetitionScore -= 2;
      repetitionFeedback.push("Rationale has significant overlap with another in the batch");
      break;
    }
  }

  scores.push({
    dimension: "Template Repetition",
    score: Math.max(0, repetitionScore),
    maxScore: 10,
    feedback: repetitionFeedback.join("; ") || "No template repetition detected",
    passed: repetitionScore >= 6,
  });
  if (repetitionScore < 6) feedback.push(...repetitionFeedback);

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const totalMax = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const overallScore = totalMax > 0 ? totalScore / totalMax : 0;
  const passed = overallScore >= PASS_THRESHOLD;

  return {
    itemIndex: 0,
    itemType: "rationale",
    overallScore: Math.round(overallScore * 100),
    passed,
    scores,
    revisionFeedback: feedback,
    status: passed ? "pass" : "needs_revision",
  };
}

export function runContentQualityGate(
  items: any[],
  options: {
    contentType: "question" | "flashcard" | "mixed";
    specialtyKey?: string;
    isNewGrad?: boolean;
    isAdaptive?: boolean;
    difficultyLevel?: string;
  }
): BatchQualityReport {
  const itemResults: ItemQualityResult[] = [];
  const stems: string[] = [];
  const rationales: string[] = [];
  const cardTypes: Record<string, number> = {};
  const cardFronts: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let result: ItemQualityResult;

    const isFlashcard = options.contentType === "flashcard" ||
      (options.contentType === "mixed" && (item.front || item.cardType || item.card_type));

    if (isFlashcard) {
      const ct = item.cardType || item.card_type || "unknown";
      cardTypes[ct] = (cardTypes[ct] || 0) + 1;

      result = scoreFlashcardQuality(item, {
        cardTypes,
        totalCards: i + 1,
        existingFronts: cardFronts,
      });
      cardFronts.push(item.front || "");
    } else {
      result = scoreQuestionQuality(item, {
        stems,
        specialtyKey: options.specialtyKey,
        isNewGrad: options.isNewGrad,
        isAdaptive: options.isAdaptive,
        difficultyLevel: options.difficultyLevel,
      });
      stems.push(item.stem || item.question || "");

      const rationale = item.rationale || item.rationaleLong || item.rationale_long || "";
      if (rationale) {
        const rationaleResult = scoreRationaleStandalone(rationale, rationales);
        for (const rs of rationaleResult.scores) {
          const existing = result.scores.find(s => s.dimension === rs.dimension);
          if (!existing) {
            result.scores.push(rs);
            if (!rs.passed) result.revisionFeedback.push(rs.feedback);
          }
        }
        rationales.push(rationale);
      }
    }

    result.itemIndex = i;
    const totalScore = result.scores.reduce((sum, s) => sum + s.score, 0);
    const totalMax = result.scores.reduce((sum, s) => sum + s.maxScore, 0);
    result.overallScore = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    const hasCriticalFailure = result.scores.some(s => s.score === 0 && s.maxScore > 5);
    result.passed = result.overallScore >= PASS_THRESHOLD * 100 && !hasCriticalFailure;
    result.status = result.passed ? "pass" : "needs_revision";

    itemResults.push(result);
  }

  const diversityReport = analyzeBatchDiversity(items);

  const passedCount = itemResults.filter(r => r.passed).length;
  const flaggedCount = itemResults.filter(r => !r.passed).length;

  return {
    batchSize: items.length,
    passedCount,
    flaggedCount,
    overallPassRate: items.length > 0 ? Math.round((passedCount / items.length) * 100) : 0,
    itemResults,
    batchIssues: diversityReport.issues,
    diversityReport,
  };
}
