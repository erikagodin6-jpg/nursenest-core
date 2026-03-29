import { contentMap } from "./client/src/data/lessons/index";

const weakIds = [
  "rpn-testbank-cardiovascular","rpn-testbank-respiratory","rpn-testbank-neuro","rpn-testbank-endocrine",
  "rpn-testbank-renal","rpn-testbank-safety","rpn-testbank-maternity","rpn-testbank-mental-health",
  "rn-testbank-cardiovascular","rn-testbank-respiratory","rn-testbank-neuro","rn-testbank-critical-care",
  "rn-testbank-pharmacology","rn-testbank-maternal-child","np-testbank-advanced-assessment",
  "np-testbank-prescribing","np-testbank-differential-diagnosis","np-testbank-emergency-management",
  "herbal-supplements-question-bank",
  "specimen-collection","antenatal-testing","newborn-reflexes",
  "flow-cytometry-immunophenotyping-mlt","hemostasis-advanced-testing-mlt","blood-gas-electrolyte-analysis-mlt",
  "automated-hematology-analyzers-mlt","mycology-laboratory-testing-mlt","blood-component-preparation-mlt",
  "tumor-marker-interpretation-mlt","antibiotic-resistance-mechanisms-mlt","hemolytic-disease-newborn-mlt",
  "molecular-techniques-fundamentals-mlt","westgard-rules-applied-mlt","transfusion-medicine-compatibility-mlt",
  "clinical-enzymology-mlt","parasitology-clinical-mlt","point-of-care-testing-management-mlt",
  "special-staining-techniques-mlt","serology-methodology-mlt","laboratory-math-calculations-mlt",
  "specimen-integrity-preanalytical-mlt","body-fluid-cell-counts-mlt","pharmacogenomics-clinical-mlt",
  "infection-control-laboratory-mlt","method-validation-verification-mlt","hemoglobinopathy-testing-mlt",
  "renal-function-assessment-mlt","regulatory-compliance-clia-mlt","urinalysis-comprehensive-mlt",
  "dna-rna-extraction-mlt","clinical-immunology-autoantibodies-mlt","transfusion-reaction-workup-mlt",
  "reference-range-statistics-mlt","microbiology-susceptibility-reporting-mlt",
  "nutrition-infants","nutrition-toddlers","nutrition-school-age","nutrition-adolescents",
  "nutrition-pregnancy","nutrition-lactation",
  "hemoglobin-hematocrit","serum-lipids","coagulation-studies","malnutrition-markers",
  "dic-pregnancy","torch-infections","chorioamnionitis","multiple-gestation","placental-abnormalities",
  "pregnancy-stis","uterine-rupture","pph-shock","subinvolution","postpartum-vte",
  "meconium-aspiration","hemorrhoids-rpn","informatics-doc-rn","informatics-doc-np",
];

for (const id of weakIds) {
  const lesson = contentMap[id];
  if (!lesson) { console.log(`MISSING: ${id}`); continue; }
  
  const cellularLen = typeof lesson.cellular === "string" ? lesson.cellular.length : ((lesson.cellular as any)?.content?.length || 0);
  const rfCount = lesson.riskFactors?.length || 0;
  const diagCount = lesson.diagnostics?.length || 0;
  const mgmtCount = lesson.management?.length || 0;
  const naCount = lesson.nursingActions?.length || 0;
  const assessmentCount = lesson.assessmentFindings?.length || 0;
  const medCount = lesson.medications?.length || 0;
  const pearlCount = lesson.pearls?.length || 0;
  const quizCount = lesson.quiz?.length || 0;
  const signsLeft = (lesson.signs as any)?.left?.length || 0;
  const signsRight = (lesson.signs as any)?.right?.length || 0;
  const signsArray = Array.isArray(lesson.signs) ? lesson.signs.length : 0;
  
  const missing: string[] = [];
  if (cellularLen <= 200) missing.push("cellular");
  if (rfCount < 3) missing.push("riskFactors");
  if (diagCount < 3) missing.push("diagnostics");
  if (mgmtCount < 3) missing.push("management");
  if (naCount < 3) missing.push("nursingActions");
  if (assessmentCount < 1) missing.push("assessmentFindings");
  if (medCount < 1) missing.push("medications");
  if (pearlCount < 1) missing.push("pearls");
  if (quizCount < 1) missing.push("quiz");
  if (signsLeft < 1 && signsRight < 1 && signsArray < 1) missing.push("signs");
  
  console.log(`${id} | title="${lesson.title}" | missing=[${missing.join(',')}]`);
}
