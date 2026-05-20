import {
  rexPnCategories,
  rexPnConditions,
  rexPnMedications,
  rexPnLabValues,
  rexPnComparisons,
  rexPnStrategies,
  type RexPnPage,
  type RexPnPracticeQuestion,
  type RexPnInternalLink,
} from "@/data/rex-pn-hub-data";

export interface ValidationResult {
  slug: string;
  contentType: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
}

const VALID_REX_PN_ROUTES = new Set([
  "/rex-pn",
  "/rex-pn/practice-questions", "/rex-pn/fundamentals", "/rex-pn/pharmacology",
  "/rex-pn/safety-and-infection-control", "/rex-pn/clinical-judgment",
  "/rex-pn/exam-tips", "/rex-pn/study-plan",
  ...rexPnConditions.map(c => `/rex-pn/conditions/${c.slug}`),
  ...rexPnMedications.map(m => `/rex-pn/medications/${m.slug}`),
  ...rexPnLabValues.map(l => `/rex-pn/lab-values/${l.slug}`),
  ...rexPnComparisons.map(c => `/rex-pn/compare/${c.slug}`),
  ...rexPnStrategies.map(s => `/rex-pn/strategy/${s.slug}`),
]);

function validateQuestions(questions: RexPnPracticeQuestion[], errors: string[]) {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      errors.push(`Practice question ${i + 1}: correctIndex ${q.correctIndex} out of bounds (${q.options.length} options)`);
    }
    if (q.options.length < 2) {
      errors.push(`Practice question ${i + 1}: fewer than 2 options`);
    }
    if (!q.rationale || q.rationale.length < 10) {
      errors.push(`Practice question ${i + 1}: rationale missing or too short`);
    }
  }
}

const VALID_CROSS_NAMESPACE_PATTERNS = [
  /^\/medications\//,
  /^\/lab-values\//,
  /^\/conditions\//,
  /^\/mock-exams/,
  /^\/free-practice/,
  /^\/pricing/,
  /^\/flashcards/,
];

function isCrossNamespaceRoute(href: string): boolean {
  return VALID_CROSS_NAMESPACE_PATTERNS.some(pattern => pattern.test(href));
}

function validateLinks(links: RexPnInternalLink[], errors: string[]) {
  for (const link of links) {
    if (link.href.startsWith("/rex-pn") && !VALID_REX_PN_ROUTES.has(link.href)) {
      errors.push(`Internal link "${link.title}" points to unregistered route: ${link.href}`);
    } else if (!link.href.startsWith("/rex-pn") && !VALID_REX_PN_ROUTES.has(link.href) && !isCrossNamespaceRoute(link.href)) {
      errors.push(`Internal link "${link.title}" points to unknown route: ${link.href}`);
    }
  }
}

function validateCategory(page: typeof rexPnCategories[0]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!page.metaTitle || page.metaTitle.length < 20) errors.push("Meta title missing or too short (<20 chars)");
  if (page.metaTitle.length > 70) warnings.push("Meta title exceeds 70 characters");
  if (!page.metaDescription || page.metaDescription.length < 50) errors.push("Meta description missing or too short (<50 chars)");
  if (page.metaDescription.length > 160) warnings.push("Meta description exceeds 160 characters");
  if (!page.h1) errors.push("H1 heading missing");
  if (!page.introText || page.introText.length < 100) errors.push("Intro text missing or too short (<100 chars)");
  if (!page.sections || page.sections.length === 0) errors.push("No content sections");
  if (!page.practiceQuestions || page.practiceQuestions.length === 0) warnings.push("No practice questions");
  if (page.practiceQuestions) validateQuestions(page.practiceQuestions, errors);
  if (!page.internalLinks || page.internalLinks.length < 2) errors.push("Insufficient internal links (<2)");
  if (page.internalLinks) validateLinks(page.internalLinks, errors);
  if (!page.lastReviewed) errors.push("Missing lastReviewed date");
  if (!page.reviewer) errors.push("Missing reviewer name");

  return { slug: page.slug, contentType: "category", passed: errors.length === 0, errors, warnings };
}

function validateCondition(page: typeof rexPnConditions[0]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!page.metaTitle || page.metaTitle.length < 20) errors.push("Meta title missing or too short");
  if (!page.metaDescription || page.metaDescription.length < 50) errors.push("Meta description missing or too short");
  if (!page.definition || page.definition.length < 50) errors.push("Definition missing or too short");
  if (!page.pathophysiology || page.pathophysiology.length < 100) errors.push("Pathophysiology missing or too short");
  if (!page.causesRiskFactors || page.causesRiskFactors.length < 3) errors.push("Insufficient causes/risk factors (<3)");
  if (!page.signsSymptoms.early.length) errors.push("No early signs/symptoms");
  if (!page.signsSymptoms.late.length) errors.push("No late signs/symptoms");
  if (!page.labs || page.labs.length === 0) warnings.push("No lab values listed");
  if (!page.medications || page.medications.length === 0) warnings.push("No medications listed");
  if (!page.nursingInterventions || page.nursingInterventions.length < 3) errors.push("Insufficient nursing interventions (<3)");
  if (!page.complications || page.complications.length === 0) errors.push("No complications listed");
  if (!page.patientTeaching || page.patientTeaching.length < 3) errors.push("Insufficient patient teaching points (<3)");
  if (!page.examPearls || page.examPearls.length === 0) errors.push("No exam pearls");
  if (!page.practiceQuestions || page.practiceQuestions.length < 2) errors.push("Insufficient practice questions (<2)");
  if (page.practiceQuestions) validateQuestions(page.practiceQuestions, errors);
  if (!page.internalLinks || page.internalLinks.length < 2) errors.push("Insufficient internal links (<2)");
  if (page.internalLinks) validateLinks(page.internalLinks, errors);
  if (!page.lastReviewed) errors.push("Missing lastReviewed date");

  return { slug: page.slug, contentType: "condition", passed: errors.length === 0, errors, warnings };
}

function validateMedication(page: typeof rexPnMedications[0]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!page.metaTitle || page.metaTitle.length < 20) errors.push("Meta title missing or too short");
  if (!page.metaDescription || page.metaDescription.length < 50) errors.push("Meta description missing or too short");
  if (!page.mechanism || page.mechanism.length < 50) errors.push("Mechanism of action missing or too short");
  if (!page.indications || page.indications.length === 0) errors.push("No indications listed");
  if (!page.sideEffects || page.sideEffects.length === 0) errors.push("No side effects listed");
  if (!page.nursingConsiderations || page.nursingConsiderations.length < 3) errors.push("Insufficient nursing considerations (<3)");
  if (!page.monitoring || page.monitoring.length === 0) errors.push("No monitoring parameters");
  if (!page.patientTeaching || page.patientTeaching.length < 3) errors.push("Insufficient patient teaching (<3)");
  if (!page.examTips || page.examTips.length === 0) errors.push("No exam tips");
  if (!page.practiceQuestions || page.practiceQuestions.length < 2) errors.push("Insufficient practice questions (<2)");
  if (page.practiceQuestions) validateQuestions(page.practiceQuestions, errors);
  if (!page.internalLinks || page.internalLinks.length < 2) errors.push("Insufficient internal links (<2)");
  if (page.internalLinks) validateLinks(page.internalLinks, errors);

  return { slug: page.slug, contentType: "medication", passed: errors.length === 0, errors, warnings };
}

function validateLabValue(page: typeof rexPnLabValues[0]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!page.metaTitle || page.metaTitle.length < 20) errors.push("Meta title missing or too short");
  if (!page.metaDescription || page.metaDescription.length < 50) errors.push("Meta description missing or too short");
  if (!page.overview || page.overview.length < 50) errors.push("Overview missing or too short");
  if (!page.normalRangeUS.value) errors.push("Missing US normal range");
  if (!page.normalRangeCA.value) errors.push("Missing CA normal range");
  if (!page.nursingImplications || page.nursingImplications.length < 2) errors.push("Insufficient nursing implications (<2)");
  if (!page.examAlerts || page.examAlerts.length === 0) errors.push("No exam alerts");
  if (!page.practiceQuestions || page.practiceQuestions.length < 2) errors.push("Insufficient practice questions (<2)");
  if (page.practiceQuestions) validateQuestions(page.practiceQuestions, errors);
  if (!page.internalLinks || page.internalLinks.length < 2) errors.push("Insufficient internal links (<2)");
  if (page.internalLinks) validateLinks(page.internalLinks, errors);

  return { slug: page.slug, contentType: "lab-value", passed: errors.length === 0, errors, warnings };
}

function validateComparison(page: typeof rexPnComparisons[0]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!page.metaTitle || page.metaTitle.length < 20) errors.push("Meta title missing or too short");
  if (!page.metaDescription || page.metaDescription.length < 50) errors.push("Meta description missing or too short");
  if (!page.h1) errors.push("H1 missing");
  if (!page.introText || page.introText.length < 50) errors.push("Intro text missing or too short");
  if (!page.comparisonCategories || page.comparisonCategories.length < 3) errors.push("Insufficient comparison categories (<3)");
  if (!page.keyDifferences || page.keyDifferences.length < 2) errors.push("Insufficient key differences (<2)");
  if (!page.clinicalPearls || page.clinicalPearls.length === 0) errors.push("No clinical pearls");
  if (!page.practiceQuestions || page.practiceQuestions.length < 2) errors.push("Insufficient practice questions (<2)");
  if (page.practiceQuestions) validateQuestions(page.practiceQuestions, errors);
  if (!page.internalLinks || page.internalLinks.length < 2) errors.push("Insufficient internal links (<2)");
  if (page.internalLinks) validateLinks(page.internalLinks, errors);

  return { slug: page.slug, contentType: "comparison", passed: errors.length === 0, errors, warnings };
}

function validateStrategy(page: typeof rexPnStrategies[0]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!page.metaTitle || page.metaTitle.length < 20) errors.push("Meta title missing or too short");
  if (!page.metaDescription || page.metaDescription.length < 50) errors.push("Meta description missing or too short");
  if (!page.h1) errors.push("H1 missing");
  if (!page.introText || page.introText.length < 50) errors.push("Intro text missing or too short");
  if (!page.sections || page.sections.length < 2) errors.push("Insufficient sections (<2)");
  if (page.practiceQuestions) validateQuestions(page.practiceQuestions, errors);
  if (!page.internalLinks || page.internalLinks.length < 2) errors.push("Insufficient internal links (<2)");
  if (page.internalLinks) validateLinks(page.internalLinks, errors);

  return { slug: page.slug, contentType: "strategy", passed: errors.length === 0, errors, warnings };
}

function checkDuplicates(): ValidationResult[] {
  const results: ValidationResult[] = [];
  const allSlugs = new Map<string, string>();
  const allMetaDescriptions = new Map<string, string>();

  const allPages: { slug: string; type: string; metaDescription: string }[] = [
    ...rexPnCategories.map(p => ({ slug: `category/${p.slug}`, type: "category", metaDescription: p.metaDescription })),
    ...rexPnConditions.map(p => ({ slug: `condition/${p.slug}`, type: "condition", metaDescription: p.metaDescription })),
    ...rexPnMedications.map(p => ({ slug: `medication/${p.slug}`, type: "medication", metaDescription: p.metaDescription })),
    ...rexPnLabValues.map(p => ({ slug: `lab-value/${p.slug}`, type: "lab-value", metaDescription: p.metaDescription })),
    ...rexPnComparisons.map(p => ({ slug: `comparison/${p.slug}`, type: "comparison", metaDescription: p.metaDescription })),
    ...rexPnStrategies.map(p => ({ slug: `strategy/${p.slug}`, type: "strategy", metaDescription: p.metaDescription })),
  ];

  for (const page of allPages) {
    if (allSlugs.has(page.slug)) {
      results.push({
        slug: page.slug,
        contentType: page.type,
        passed: false,
        errors: [`Duplicate slug: ${page.slug} (also in ${allSlugs.get(page.slug)})`],
        warnings: [],
      });
    }
    allSlugs.set(page.slug, page.type);

    if (allMetaDescriptions.has(page.metaDescription)) {
      results.push({
        slug: page.slug,
        contentType: page.type,
        passed: false,
        errors: [`Duplicate meta description (shared with ${allMetaDescriptions.get(page.metaDescription)})`],
        warnings: [],
      });
    }
    allMetaDescriptions.set(page.metaDescription, page.slug);
  }

  return results;
}

export function validateAllRexPnContent(): { results: ValidationResult[]; summary: { total: number; passed: number; failed: number; warnings: number } } {
  const results: ValidationResult[] = [];

  rexPnCategories.forEach(p => results.push(validateCategory(p)));
  rexPnConditions.forEach(p => results.push(validateCondition(p)));
  rexPnMedications.forEach(p => results.push(validateMedication(p)));
  rexPnLabValues.forEach(p => results.push(validateLabValue(p)));
  rexPnComparisons.forEach(p => results.push(validateComparison(p)));
  rexPnStrategies.forEach(p => results.push(validateStrategy(p)));

  results.push(...checkDuplicates());

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const warnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  return { results, summary: { total: results.length, passed, failed, warnings } };
}
