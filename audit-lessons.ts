import { contentMap } from "./client/src/data/lessons/index";

function isPlaceholder(lesson: any): boolean {
  const cellVal = lesson.cellular;
  const content = typeof cellVal === "string" ? cellVal : cellVal?.content || "";
  if (content.includes("[WRITE YOUR") || content.includes("[PLACEHOLDER") || content.length < 20) return true;

  const genericRiskFactors = [
    "Advanced age or extremes of age",
    "Family history of",
    "Sedentary lifestyle and poor nutritional status",
    "Chronic comorbidities (hypertension, diabetes, obesity)",
    "Tobacco, alcohol, or substance use",
    "Immunocompromised state or prolonged medication use",
  ];
  const rf = lesson.riskFactors || [];
  const genericRfCount = rf.filter((r: string) =>
    genericRiskFactors.some((g: string) => r.startsWith(g) || r.includes(g))
  ).length;
  if (genericRfCount >= 3) return true;

  const meds = lesson.medications || [];
  const genericMedNames = ["Levetiracetam", "Metformin", "Acetaminophen"];
  const title = (lesson.title || "").toLowerCase();
  for (const med of meds) {
    if (genericMedNames.includes(med.name)) {
      const isRelevant =
        (med.name === "Levetiracetam" && (title.includes("seizure") || title.includes("epilep") || title.includes("anticonvulsant"))) ||
        (med.name === "Metformin" && (title.includes("diabet") || title.includes("metformin") || title.includes("glucose") || title.includes("endocrin"))) ||
        (med.name === "Acetaminophen" && (title.includes("pain") || title.includes("fever") || title.includes("analges") || title.includes("acetaminophen")));
      if (!isRelevant && meds.length === 1) return true;
    }
  }

  const genericNursingActions = [
    "Perform comprehensive assessment and interpret findings for changes in condition",
    "Implement evidence-based interventions and evaluate outcomes per established protocols",
    "Reinforce patient teaching as delegated regarding condition management",
    "Order and interpret diagnostic studies for changes in condition",
    "Prescribe pharmacological and non-pharmacological therapies per established protocols",
    "Formulate differential diagnosis and treatment plan based on assessment findings",
    "Counsel patients on disease management and prevention regarding condition management",
    "Document all interventions, assessments, and patient responses accurately",
  ];
  const na = lesson.nursingActions || [];
  const genericNaCount = na.filter((a: string) =>
    genericNursingActions.some((g: string) => a.startsWith(g))
  ).length;
  if (genericNaCount >= 2) return true;

  const genericAssessmentFindings = [
    "Changes in vital signs including temperature, pulse, blood pressure, and respirations",
    "Alterations in level of consciousness, orientation, or cognitive function",
    "Pain assessment using validated tools (onset, location, duration, character, severity)",
    "Skin assessment including color, turgor, moisture, integrity, and temperature",
    "Functional status changes including mobility, self-care ability, and nutritional intake",
  ];
  const af = lesson.assessmentFindings || [];
  const genericAfCount = af.filter((a: string) =>
    genericAssessmentFindings.some((g: string) => a.startsWith(g))
  ).length;
  if (genericAfCount >= 4) return true;

  if (content.includes("The nurse practitioner applies advanced clinical reasoning to the assessment and management") &&
      content.includes("integrating comprehensive pathophysiological knowledge with evidence-based diagnostic")) return true;

  const boilerplateRf = [
    "Age-related risk factors specific to",
    "Genetic predisposition and family history",
    "Modifiable lifestyle factors (smoking, obesity, sedentary behavior)",
    "Medication-related risk (polypharmacy, drug interactions)",
    "Environmental and occupational exposures",
    "Nutritional deficiencies or excesses",
    "Psychosocial factors (chronic stress, socioeconomic status)",
    "Previous history of related conditions",
  ];
  const boilerplateRfCount = rf.filter((r: string) =>
    boilerplateRf.some((g: string) => r.startsWith(g) || r === g)
  ).length;
  if (boilerplateRfCount >= 4) return true;

  const boilerplateDiag = [
    "Order comprehensive history and physical examination focused on",
    "Order CBC with differential, CMP, and targeted serology",
    "Order imaging studies appropriate to clinical presentation",
    "Calculate risk stratification score using validated clinical tools",
    "Order specialty-specific diagnostic studies as indicated",
    "Consider referral for advanced diagnostic procedures if indicated",
  ];
  const diag = lesson.diagnostics || [];
  const boilerplateDiagCount = diag.filter((d: string) =>
    boilerplateDiag.some((g: string) => d.startsWith(g))
  ).length;
  if (boilerplateDiagCount >= 3) return true;

  const boilerplateMgmt = [
    "Initiate evidence-based first-line pharmacotherapy for",
    "Implement non-pharmacological interventions as adjunct therapy",
    "Titrate medications based on clinical response and lab monitoring",
    "Coordinate multidisciplinary care team involvement",
    "Develop patient-specific treatment plan with shared decision-making",
    "Implement guideline-directed escalation protocols if initial therapy fails",
  ];
  const mgmt = lesson.management || [];
  const boilerplateMgmtCount = mgmt.filter((m: string) =>
    boilerplateMgmt.some((g: string) => m.startsWith(g))
  ).length;
  if (boilerplateMgmtCount >= 3) return true;

  for (const med of meds) {
    if (typeof med.type === "string" && med.type.startsWith("First-Line Agent for")) return true;
    if (typeof med.type === "string" && med.type.startsWith("Second-Line/Adjunctive Agent for")) return true;
  }

  const genericQuizPatterns = [
    "Which assessment finding requires immediate intervention",
    "Which nursing action is most appropriate when managing a patient with",
    "What is the best initial nursing response",
  ];
  const quiz = lesson.quiz || [];
  if (quiz.length > 0) {
    const genericQuizCount = quiz.filter((q: any) =>
      genericQuizPatterns.some((p: string) => q.question.includes(p))
    ).length;
    if (genericQuizCount >= 2 && quiz.length <= 3) return true;
  }

  const batchGenericRiskFactors = [
    "Age-related risk factors specific to",
    "Genetic predisposition and family history",
    "Modifiable lifestyle factors (smoking, obesity, sedentary behavior)",
    "Medication-related risk (polypharmacy, drug interactions)",
    "Psychosocial factors (chronic stress, socioeconomic status)",
    "Previous history of related conditions",
  ];
  const batchRfCount = rf.filter((r: string) =>
    batchGenericRiskFactors.some((g: string) => r.startsWith(g) || r === g)
  ).length;
  if (batchRfCount >= 4) return true;

  const batchGenericNursing = [
    "Perform systematic assessment using standardized tools for",
    "Implement evidence-based nursing interventions for symptom management",
    "Assess pain and implement multimodal pain management strategies",
    "Coordinate care transitions and discharge planning",
  ];
  const batchNaCount = na.filter((a: string) =>
    batchGenericNursing.some((g: string) => a.startsWith(g) || a === g)
  ).length;
  if (batchNaCount >= 3) return true;

  const batchGenericMgmt = [
    "Initiate evidence-based first-line pharmacotherapy for",
    "Implement non-pharmacological interventions as adjunct therapy",
    "Implement guideline-directed escalation protocols if initial therapy fails",
    "Plan appropriate follow-up intervals and outcome measurements",
  ];
  const batchMgmt = lesson.management || [];
  const batchMgmtCount = batchMgmt.filter((m: string) =>
    batchGenericMgmt.some((g: string) => m.startsWith(g) || m === g)
  ).length;
  if (batchMgmtCount >= 3) return true;

  const hasBoilerplateMedName = meds.some((med: any) =>
    med.name.startsWith("First-Line Agent for ") || med.name.startsWith("Adjunct Therapy for ")
  );
  if (hasBoilerplateMedName && (batchRfCount >= 2 || batchNaCount >= 2 || batchMgmtCount >= 2)) {
    return true;
  }

  if (quiz.length === 1 && quiz[0].question.includes("A 58-year-old patient presents with symptoms consistent with")) {
    const opts = quiz[0].options || [];
    if (opts.some((o: string) => o === "Prescribe empiric treatment without further evaluation")) return true;
  }

  return false;
}

function classifyLessonStatus(lesson: any): "complete" | "placeholder" | "weak" | "broken" {
  if (!lesson || !lesson.title) return "broken";
  if (isPlaceholder(lesson)) return "placeholder";
  const cellularLen = typeof lesson.cellular === "string" ? lesson.cellular.length : (lesson.cellular?.content?.length || 0);
  const rfCount = lesson.riskFactors?.length || 0;
  const diagCount = lesson.diagnostics?.length || 0;
  const mgmtCount = lesson.management?.length || 0;
  const naCount = lesson.nursingActions?.length || 0;
  const assessmentCount = lesson.assessmentFindings?.length || 0;
  const medCount = lesson.medications?.length || 0;
  const pearlCount = lesson.pearls?.length || 0;
  const quizCount = lesson.quiz?.length || 0;
  const signsLeft = lesson.signs?.left?.length || 0;
  const signsRight = lesson.signs?.right?.length || 0;
  const signsArray = Array.isArray(lesson.signs) ? lesson.signs.length : 0;
  const hasSeo = !!(lesson.seo?.title && lesson.seo?.description);
  let score = 0;
  if (cellularLen > 200) score++;
  if (rfCount >= 3) score++;
  if (diagCount >= 3) score++;
  if (mgmtCount >= 3) score++;
  if (naCount >= 3) score++;
  if (assessmentCount >= 1) score++;
  if (medCount >= 1) score++;
  if (pearlCount >= 1) score++;
  if (quizCount >= 1) score++;
  if (signsLeft >= 1 || signsRight >= 1 || signsArray >= 1) score++;
  if (hasSeo) score++;
  if (score >= 7) return "complete";
  return "weak";
}

const allIds = Object.keys(contentMap);
const results: Record<string, { id: string; title: string; score: number }[]> = {
  complete: [],
  placeholder: [],
  weak: [],
  broken: [],
};

const testbankStubs: string[] = [];

for (const id of allIds) {
  const lesson = contentMap[id];
  if (id.includes("testbank")) {
    testbankStubs.push(id);
  }
  const status = classifyLessonStatus(lesson);
  
  const cellularLen = typeof lesson.cellular === "string" ? lesson.cellular.length : (lesson.cellular?.content?.length || 0);
  const rfCount = lesson.riskFactors?.length || 0;
  const diagCount = lesson.diagnostics?.length || 0;
  const mgmtCount = lesson.management?.length || 0;
  const naCount = lesson.nursingActions?.length || 0;
  const assessmentCount = lesson.assessmentFindings?.length || 0;
  const medCount = lesson.medications?.length || 0;
  const pearlCount = lesson.pearls?.length || 0;
  const quizCount = lesson.quiz?.length || 0;
  const signsLeft = lesson.signs?.left?.length || 0;
  const signsRight = lesson.signs?.right?.length || 0;
  const signsArray = Array.isArray(lesson.signs) ? lesson.signs.length : 0;
  const hasSeo = !!(lesson.seo?.title && lesson.seo?.description);
  let score = 0;
  if (cellularLen > 200) score++;
  if (rfCount >= 3) score++;
  if (diagCount >= 3) score++;
  if (mgmtCount >= 3) score++;
  if (naCount >= 3) score++;
  if (assessmentCount >= 1) score++;
  if (medCount >= 1) score++;
  if (pearlCount >= 1) score++;
  if (quizCount >= 1) score++;
  if (signsLeft >= 1 || signsRight >= 1 || signsArray >= 1) score++;
  if (hasSeo) score++;
  
  results[status].push({ id, title: lesson.title || "UNTITLED", score });
}

console.log("=== LESSON AUDIT RESULTS ===");
console.log(`Total lessons: ${allIds.length}`);
console.log(`Complete: ${results.complete.length}`);
console.log(`Placeholder: ${results.placeholder.length}`);
console.log(`Weak: ${results.weak.length}`);
console.log(`Broken: ${results.broken.length}`);
console.log(`\nTestbank stubs: ${testbankStubs.length}`);
if (testbankStubs.length > 0) {
  for (const id of testbankStubs) console.log(`  STUB: ${id}`);
}

console.log(`\n=== PLACEHOLDER LESSONS (${results.placeholder.length}) ===`);
for (const l of results.placeholder) {
  console.log(`  ${l.id} | ${l.title} | score=${l.score}`);
}

console.log(`\n=== WEAK LESSONS (${results.weak.length}) ===`);
for (const l of results.weak.sort((a, b) => a.score - b.score)) {
  console.log(`  ${l.id} | ${l.title} | score=${l.score}`);
}

console.log(`\n=== BROKEN LESSONS (${results.broken.length}) ===`);
for (const l of results.broken) {
  console.log(`  ${l.id} | ${l.title} | score=${l.score}`);
}

// Output JSON for programmatic use
const outputData = {
  total: allIds.length,
  complete: results.complete.length,
  placeholder: results.placeholder.map(l => l.id),
  weak: results.weak.sort((a, b) => a.score - b.score).map(l => ({ id: l.id, score: l.score })),
  broken: results.broken.map(l => l.id),
  testbankStubs,
};
require('fs').writeFileSync('/tmp/audit-results.json', JSON.stringify(outputData, null, 2));
console.log("\nJSON results written to /tmp/audit-results.json");
