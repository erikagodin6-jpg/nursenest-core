export interface MockExamTemplate {
  templateId: string;
  examCode: string;
  examName: string;
  templateName: string;
  description: string;
  questionCount: number;
  timeLimitMinutes: number;
  difficultyDistribution: {
    foundational: number;
    moderate: number;
    difficult: number;
  };
  domainWeights: { domain: string; weight: number }[];
  formatMix: {
    mcqSingle: number;
    selectAllThatApply: number;
    scenarioBased: number;
    prioritization: number;
    delegation: number;
  };
  passingStandard: number;
  seed: number;
  tier: string;
  active: boolean;
}

function makeTemplate(
  overrides: Partial<MockExamTemplate> & Pick<MockExamTemplate, "templateId" | "examCode" | "examName" | "templateName" | "description" | "questionCount" | "timeLimitMinutes" | "domainWeights" | "seed" | "tier">
): MockExamTemplate {
  return {
    difficultyDistribution: { foundational: 0.15, moderate: 0.55, difficult: 0.30 },
    formatMix: { mcqSingle: 0.50, selectAllThatApply: 0.20, scenarioBased: 0.15, prioritization: 0.10, delegation: 0.05 },
    passingStandard: 65,
    active: true,
    ...overrides,
  };
}

const NCLEX_RN_DOMAINS = [
  { domain: "Management of Care", weight: 0.19 },
  { domain: "Safety and Infection Control", weight: 0.12 },
  { domain: "Health Promotion and Maintenance", weight: 0.09 },
  { domain: "Psychosocial Integrity", weight: 0.09 },
  { domain: "Basic Care and Comfort", weight: 0.09 },
  { domain: "Pharmacological Therapies", weight: 0.15 },
  { domain: "Reduction of Risk Potential", weight: 0.12 },
  { domain: "Physiological Adaptation", weight: 0.14 },
];

const NCLEX_PN_DOMAINS = [
  { domain: "Physiological Integrity", weight: 0.54 },
  { domain: "Safe and Effective Care Environment", weight: 0.23 },
  { domain: "Health Promotion and Maintenance", weight: 0.12 },
  { domain: "Psychosocial Integrity", weight: 0.11 },
];

const REX_PN_DOMAINS = [
  { domain: "Foundations of Practice", weight: 0.36 },
  { domain: "Collaborative Practice", weight: 0.30 },
  { domain: "Professional Practice", weight: 0.16 },
  { domain: "Ethical Practice", weight: 0.10 },
  { domain: "Legal Practice", weight: 0.08 },
];

const FNP_DOMAINS = [
  { domain: "Health Assessment", weight: 0.25 },
  { domain: "Diagnosis", weight: 0.20 },
  { domain: "Therapeutics", weight: 0.25 },
  { domain: "Health Promotion & Disease Prevention", weight: 0.15 },
  { domain: "Professional Role & Responsibility", weight: 0.15 },
];

const AGNP_DOMAINS = [
  { domain: "Health Assessment", weight: 0.22 },
  { domain: "Diagnosis & Management", weight: 0.28 },
  { domain: "Pharmacology", weight: 0.22 },
  { domain: "Health Promotion", weight: 0.14 },
  { domain: "Professional Practice", weight: 0.14 },
];

const ACNP_DOMAINS = [
  { domain: "Complex Acute Care Assessment", weight: 0.22 },
  { domain: "Diagnosis & Patient Management", weight: 0.28 },
  { domain: "Advanced Pharmacology", weight: 0.20 },
  { domain: "Procedures & Monitoring", weight: 0.16 },
  { domain: "Professional Role", weight: 0.14 },
];

function shiftWeights(base: { domain: string; weight: number }[], emphasisIdx: number, boost: number): { domain: string; weight: number }[] {
  const result = base.map((d, i) => ({
    domain: d.domain,
    weight: i === emphasisIdx ? d.weight + boost : d.weight - boost / (base.length - 1),
  }));
  const total = result.reduce((s, d) => s + d.weight, 0);
  return result.map(d => ({ domain: d.domain, weight: Math.max(0.03, +(d.weight / total).toFixed(3)) }));
}

export const FLAGSHIP_MOCK_EXAM_TEMPLATES: MockExamTemplate[] = [
  // ===== NCLEX-RN (7 exams) =====
  makeTemplate({
    templateId: "nclex-rn-mock-1",
    examCode: "NCLEX-RN",
    examName: "NCLEX-RN Mock Exam 1",
    templateName: "Standard Blueprint",
    description: "Full-length NCLEX-RN simulation matching official test plan proportions with moderate-to-difficult items.",
    questionCount: 120,
    timeLimitMinutes: 300,
    domainWeights: NCLEX_RN_DOMAINS,
    seed: 1001,
    tier: "rn",
  }),
  makeTemplate({
    templateId: "nclex-rn-mock-2",
    examCode: "NCLEX-RN",
    examName: "NCLEX-RN Mock Exam 2",
    templateName: "Pharmacology Focus",
    description: "Increased pharmacology and physiological adaptation emphasis. Tests medication safety and clinical decision-making.",
    questionCount: 120,
    timeLimitMinutes: 300,
    domainWeights: shiftWeights(NCLEX_RN_DOMAINS, 5, 0.06),
    difficultyDistribution: { foundational: 0.10, moderate: 0.55, difficult: 0.35 },
    seed: 1002,
    tier: "rn",
  }),
  makeTemplate({
    templateId: "nclex-rn-mock-3",
    examCode: "NCLEX-RN",
    examName: "NCLEX-RN Mock Exam 3",
    templateName: "Management & Leadership",
    description: "Emphasis on management of care, delegation, and prioritization. Heavy scenario-based format.",
    questionCount: 130,
    timeLimitMinutes: 300,
    domainWeights: shiftWeights(NCLEX_RN_DOMAINS, 0, 0.08),
    formatMix: { mcqSingle: 0.40, selectAllThatApply: 0.15, scenarioBased: 0.25, prioritization: 0.15, delegation: 0.05 },
    seed: 1003,
    tier: "rn",
  }),
  makeTemplate({
    templateId: "nclex-rn-mock-4",
    examCode: "NCLEX-RN",
    examName: "NCLEX-RN Mock Exam 4",
    templateName: "Safety & Infection Control",
    description: "Focused on safety protocols, infection prevention, and risk reduction with challenging clinical scenarios.",
    questionCount: 110,
    timeLimitMinutes: 280,
    domainWeights: shiftWeights(NCLEX_RN_DOMAINS, 1, 0.07),
    difficultyDistribution: { foundational: 0.10, moderate: 0.50, difficult: 0.40 },
    seed: 1004,
    tier: "rn",
  }),
  makeTemplate({
    templateId: "nclex-rn-mock-5",
    examCode: "NCLEX-RN",
    examName: "NCLEX-RN Mock Exam 5",
    templateName: "Comprehensive Review",
    description: "Marathon-length exam covering all domains equally with high-difficulty items for final preparation.",
    questionCount: 150,
    timeLimitMinutes: 360,
    domainWeights: NCLEX_RN_DOMAINS.map(d => ({ domain: d.domain, weight: +(1 / NCLEX_RN_DOMAINS.length).toFixed(3) })),
    difficultyDistribution: { foundational: 0.10, moderate: 0.50, difficult: 0.40 },
    seed: 1005,
    tier: "rn",
  }),
  makeTemplate({
    templateId: "nclex-rn-mock-6",
    examCode: "NCLEX-RN",
    examName: "NCLEX-RN Mock Exam 6",
    templateName: "Psychosocial & Mental Health",
    description: "Emphasis on psychosocial integrity, therapeutic communication, and mental health nursing.",
    questionCount: 115,
    timeLimitMinutes: 280,
    domainWeights: shiftWeights(NCLEX_RN_DOMAINS, 3, 0.07),
    formatMix: { mcqSingle: 0.45, selectAllThatApply: 0.20, scenarioBased: 0.20, prioritization: 0.10, delegation: 0.05 },
    seed: 1006,
    tier: "rn",
  }),
  makeTemplate({
    templateId: "nclex-rn-mock-7",
    examCode: "NCLEX-RN",
    examName: "NCLEX-RN Mock Exam 7",
    templateName: "NGN Clinical Judgment",
    description: "Heavy on next-generation item types testing clinical judgment and critical thinking skills.",
    questionCount: 120,
    timeLimitMinutes: 300,
    domainWeights: shiftWeights(NCLEX_RN_DOMAINS, 6, 0.05),
    formatMix: { mcqSingle: 0.35, selectAllThatApply: 0.25, scenarioBased: 0.25, prioritization: 0.10, delegation: 0.05 },
    difficultyDistribution: { foundational: 0.10, moderate: 0.50, difficult: 0.40 },
    seed: 1007,
    tier: "rn",
  }),

  // ===== NCLEX-PN (6 exams) =====
  makeTemplate({
    templateId: "nclex-pn-mock-1",
    examCode: "NCLEX-PN",
    examName: "NCLEX-PN Mock Exam 1",
    templateName: "Standard Blueprint",
    description: "Full-length NCLEX-PN simulation matching official test plan with standard difficulty distribution.",
    questionCount: 100,
    timeLimitMinutes: 300,
    domainWeights: NCLEX_PN_DOMAINS,
    seed: 2001,
    tier: "rpn",
  }),
  makeTemplate({
    templateId: "nclex-pn-mock-2",
    examCode: "NCLEX-PN",
    examName: "NCLEX-PN Mock Exam 2",
    templateName: "Physiological Integrity Focus",
    description: "Heavy emphasis on physiological integrity including med-surg, pharmacology, and basic care.",
    questionCount: 100,
    timeLimitMinutes: 300,
    domainWeights: shiftWeights(NCLEX_PN_DOMAINS, 0, 0.08),
    difficultyDistribution: { foundational: 0.10, moderate: 0.55, difficult: 0.35 },
    seed: 2002,
    tier: "rpn",
  }),
  makeTemplate({
    templateId: "nclex-pn-mock-3",
    examCode: "NCLEX-PN",
    examName: "NCLEX-PN Mock Exam 3",
    templateName: "Safe Care Environment",
    description: "Focus on coordinated care, safety, and infection control in practical nursing settings.",
    questionCount: 110,
    timeLimitMinutes: 300,
    domainWeights: shiftWeights(NCLEX_PN_DOMAINS, 1, 0.07),
    seed: 2003,
    tier: "rpn",
  }),
  makeTemplate({
    templateId: "nclex-pn-mock-4",
    examCode: "NCLEX-PN",
    examName: "NCLEX-PN Mock Exam 4",
    templateName: "Clinical Scenarios",
    description: "Scenario-heavy exam testing practical nursing judgment with prioritization and delegation.",
    questionCount: 100,
    timeLimitMinutes: 300,
    domainWeights: NCLEX_PN_DOMAINS,
    formatMix: { mcqSingle: 0.35, selectAllThatApply: 0.20, scenarioBased: 0.25, prioritization: 0.15, delegation: 0.05 },
    difficultyDistribution: { foundational: 0.10, moderate: 0.50, difficult: 0.40 },
    seed: 2004,
    tier: "rpn",
  }),
  makeTemplate({
    templateId: "nclex-pn-mock-5",
    examCode: "NCLEX-PN",
    examName: "NCLEX-PN Mock Exam 5",
    templateName: "Comprehensive Marathon",
    description: "Extended exam covering all PN domains with challenging items for final prep.",
    questionCount: 130,
    timeLimitMinutes: 360,
    domainWeights: NCLEX_PN_DOMAINS,
    difficultyDistribution: { foundational: 0.10, moderate: 0.45, difficult: 0.45 },
    seed: 2005,
    tier: "rpn",
  }),
  makeTemplate({
    templateId: "nclex-pn-mock-6",
    examCode: "NCLEX-PN",
    examName: "NCLEX-PN Mock Exam 6",
    templateName: "Health Promotion & Psychosocial",
    description: "Emphasis on health promotion, maintenance, and psychosocial integrity for PN practice.",
    questionCount: 100,
    timeLimitMinutes: 280,
    domainWeights: shiftWeights(NCLEX_PN_DOMAINS, 2, 0.06),
    seed: 2006,
    tier: "rpn",
  }),

  // ===== REx-PN (6 exams) =====
  makeTemplate({
    templateId: "rex-pn-mock-1",
    examCode: "REX-PN",
    examName: "REx-PN Mock Exam 1",
    templateName: "Standard Blueprint",
    description: "Full-length REx-PN simulation matching Canadian regulatory exam blueprint.",
    questionCount: 100,
    timeLimitMinutes: 300,
    domainWeights: REX_PN_DOMAINS,
    seed: 3001,
    tier: "rpn",
  }),
  makeTemplate({
    templateId: "rex-pn-mock-2",
    examCode: "REX-PN",
    examName: "REx-PN Mock Exam 2",
    templateName: "Foundations Heavy",
    description: "Increased emphasis on foundations of practice with complex clinical judgment items.",
    questionCount: 100,
    timeLimitMinutes: 300,
    domainWeights: shiftWeights(REX_PN_DOMAINS, 0, 0.08),
    difficultyDistribution: { foundational: 0.10, moderate: 0.55, difficult: 0.35 },
    seed: 3002,
    tier: "rpn",
  }),
  makeTemplate({
    templateId: "rex-pn-mock-3",
    examCode: "REX-PN",
    examName: "REx-PN Mock Exam 3",
    templateName: "Collaborative Practice Focus",
    description: "Focus on interprofessional collaboration, team-based care, and patient advocacy.",
    questionCount: 110,
    timeLimitMinutes: 300,
    domainWeights: shiftWeights(REX_PN_DOMAINS, 1, 0.07),
    seed: 3003,
    tier: "rpn",
  }),
  makeTemplate({
    templateId: "rex-pn-mock-4",
    examCode: "REX-PN",
    examName: "REx-PN Mock Exam 4",
    templateName: "Professional & Ethical Practice",
    description: "Emphasis on professional responsibility, ethical decision-making, and legal frameworks.",
    questionCount: 100,
    timeLimitMinutes: 280,
    domainWeights: shiftWeights(REX_PN_DOMAINS, 2, 0.06),
    formatMix: { mcqSingle: 0.40, selectAllThatApply: 0.20, scenarioBased: 0.25, prioritization: 0.10, delegation: 0.05 },
    seed: 3004,
    tier: "rpn",
  }),
  makeTemplate({
    templateId: "rex-pn-mock-5",
    examCode: "REX-PN",
    examName: "REx-PN Mock Exam 5",
    templateName: "Comprehensive Review",
    description: "Full comprehensive REx-PN review with balanced domain coverage and high difficulty.",
    questionCount: 130,
    timeLimitMinutes: 360,
    domainWeights: REX_PN_DOMAINS,
    difficultyDistribution: { foundational: 0.10, moderate: 0.45, difficult: 0.45 },
    seed: 3005,
    tier: "rpn",
  }),
  makeTemplate({
    templateId: "rex-pn-mock-6",
    examCode: "REX-PN",
    examName: "REx-PN Mock Exam 6",
    templateName: "CAT Simulation",
    description: "Adaptive-style simulation mimicking the real REx-PN CAT experience with variable difficulty.",
    questionCount: 100,
    timeLimitMinutes: 300,
    domainWeights: REX_PN_DOMAINS,
    difficultyDistribution: { foundational: 0.15, moderate: 0.50, difficult: 0.35 },
    seed: 3006,
    tier: "rpn",
  }),

  // ===== AANP FNP (7 exams) =====
  makeTemplate({
    templateId: "aanp-fnp-mock-1",
    examCode: "AANP",
    examName: "AANP FNP Mock Exam 1",
    templateName: "Standard Blueprint",
    description: "Full-length AANP FNP certification simulation with standard domain proportions.",
    questionCount: 135,
    timeLimitMinutes: 240,
    domainWeights: FNP_DOMAINS,
    passingStandard: 70,
    seed: 4001,
    tier: "np",
  }),
  makeTemplate({
    templateId: "aanp-fnp-mock-2",
    examCode: "AANP",
    examName: "AANP FNP Mock Exam 2",
    templateName: "Diagnosis & Assessment Focus",
    description: "Heavy emphasis on differential diagnosis, health assessment, and clinical reasoning.",
    questionCount: 135,
    timeLimitMinutes: 240,
    domainWeights: shiftWeights(FNP_DOMAINS, 1, 0.08),
    difficultyDistribution: { foundational: 0.10, moderate: 0.50, difficult: 0.40 },
    passingStandard: 70,
    seed: 4002,
    tier: "np",
  }),
  makeTemplate({
    templateId: "aanp-fnp-mock-3",
    examCode: "AANP",
    examName: "AANP FNP Mock Exam 3",
    templateName: "Therapeutics & Pharmacology",
    description: "Focus on treatment planning, medication management, and evidence-based therapeutics.",
    questionCount: 135,
    timeLimitMinutes: 240,
    domainWeights: shiftWeights(FNP_DOMAINS, 2, 0.08),
    passingStandard: 70,
    seed: 4003,
    tier: "np",
  }),
  makeTemplate({
    templateId: "aanp-fnp-mock-4",
    examCode: "AANP",
    examName: "AANP FNP Mock Exam 4",
    templateName: "Primary Care Scenarios",
    description: "Scenario-driven exam simulating primary care encounters across the lifespan.",
    questionCount: 140,
    timeLimitMinutes: 250,
    domainWeights: FNP_DOMAINS,
    formatMix: { mcqSingle: 0.35, selectAllThatApply: 0.20, scenarioBased: 0.30, prioritization: 0.10, delegation: 0.05 },
    passingStandard: 70,
    seed: 4004,
    tier: "np",
  }),
  makeTemplate({
    templateId: "aanp-fnp-mock-5",
    examCode: "AANP",
    examName: "AANP FNP Mock Exam 5",
    templateName: "Health Promotion Focus",
    description: "Emphasis on preventive care, screening, patient education, and disease prevention strategies.",
    questionCount: 130,
    timeLimitMinutes: 230,
    domainWeights: shiftWeights(FNP_DOMAINS, 3, 0.07),
    passingStandard: 70,
    seed: 4005,
    tier: "np",
  }),
  makeTemplate({
    templateId: "aanp-fnp-mock-6",
    examCode: "AANP",
    examName: "AANP FNP Mock Exam 6",
    templateName: "Comprehensive Marathon",
    description: "Extended exam with high-difficulty items covering all FNP certification domains.",
    questionCount: 150,
    timeLimitMinutes: 270,
    domainWeights: FNP_DOMAINS,
    difficultyDistribution: { foundational: 0.08, moderate: 0.47, difficult: 0.45 },
    passingStandard: 70,
    seed: 4006,
    tier: "np",
  }),
  makeTemplate({
    templateId: "aanp-fnp-mock-7",
    examCode: "AANP",
    examName: "AANP FNP Mock Exam 7",
    templateName: "Professional Role & Ethics",
    description: "Focus on NP scope of practice, ethical considerations, and professional responsibilities.",
    questionCount: 120,
    timeLimitMinutes: 220,
    domainWeights: shiftWeights(FNP_DOMAINS, 4, 0.07),
    passingStandard: 70,
    seed: 4007,
    tier: "np",
  }),

  // ===== ANCC FNP (7 exams) =====
  makeTemplate({
    templateId: "ancc-fnp-mock-1",
    examCode: "ANCC",
    examName: "ANCC FNP Mock Exam 1",
    templateName: "Standard Blueprint",
    description: "Full-length ANCC FNP certification simulation with official domain proportions.",
    questionCount: 135,
    timeLimitMinutes: 240,
    domainWeights: FNP_DOMAINS,
    passingStandard: 70,
    seed: 5001,
    tier: "np",
  }),
  makeTemplate({
    templateId: "ancc-fnp-mock-2",
    examCode: "ANCC",
    examName: "ANCC FNP Mock Exam 2",
    templateName: "Clinical Assessment",
    description: "Emphasis on comprehensive health assessment and clinical evaluation techniques.",
    questionCount: 135,
    timeLimitMinutes: 240,
    domainWeights: shiftWeights(FNP_DOMAINS, 0, 0.08),
    difficultyDistribution: { foundational: 0.10, moderate: 0.50, difficult: 0.40 },
    passingStandard: 70,
    seed: 5002,
    tier: "np",
  }),
  makeTemplate({
    templateId: "ancc-fnp-mock-3",
    examCode: "ANCC",
    examName: "ANCC FNP Mock Exam 3",
    templateName: "Differential Diagnosis",
    description: "Focus on diagnostic reasoning, lab interpretation, and differential diagnosis skills.",
    questionCount: 130,
    timeLimitMinutes: 230,
    domainWeights: shiftWeights(FNP_DOMAINS, 1, 0.08),
    passingStandard: 70,
    seed: 5003,
    tier: "np",
  }),
  makeTemplate({
    templateId: "ancc-fnp-mock-4",
    examCode: "ANCC",
    examName: "ANCC FNP Mock Exam 4",
    templateName: "Treatment Planning",
    description: "Emphasis on pharmacological and non-pharmacological treatment strategies.",
    questionCount: 140,
    timeLimitMinutes: 250,
    domainWeights: shiftWeights(FNP_DOMAINS, 2, 0.07),
    passingStandard: 70,
    seed: 5004,
    tier: "np",
  }),
  makeTemplate({
    templateId: "ancc-fnp-mock-5",
    examCode: "ANCC",
    examName: "ANCC FNP Mock Exam 5",
    templateName: "Lifespan Scenarios",
    description: "Clinical scenarios across the lifespan from pediatrics to geriatrics.",
    questionCount: 135,
    timeLimitMinutes: 240,
    domainWeights: FNP_DOMAINS,
    formatMix: { mcqSingle: 0.35, selectAllThatApply: 0.20, scenarioBased: 0.30, prioritization: 0.10, delegation: 0.05 },
    difficultyDistribution: { foundational: 0.10, moderate: 0.50, difficult: 0.40 },
    passingStandard: 70,
    seed: 5005,
    tier: "np",
  }),
  makeTemplate({
    templateId: "ancc-fnp-mock-6",
    examCode: "ANCC",
    examName: "ANCC FNP Mock Exam 6",
    templateName: "Comprehensive Final",
    description: "Extended comprehensive exam with high difficulty for final certification readiness.",
    questionCount: 150,
    timeLimitMinutes: 270,
    domainWeights: FNP_DOMAINS,
    difficultyDistribution: { foundational: 0.08, moderate: 0.47, difficult: 0.45 },
    passingStandard: 70,
    seed: 5006,
    tier: "np",
  }),
  makeTemplate({
    templateId: "ancc-fnp-mock-7",
    examCode: "ANCC",
    examName: "ANCC FNP Mock Exam 7",
    templateName: "Prevention & Professional",
    description: "Focus on preventive medicine, health policy, and advanced practice role development.",
    questionCount: 125,
    timeLimitMinutes: 220,
    domainWeights: shiftWeights(FNP_DOMAINS, 3, 0.06),
    passingStandard: 70,
    seed: 5007,
    tier: "np",
  }),

  // ===== AGNP (6 exams) =====
  makeTemplate({
    templateId: "agnp-mock-1",
    examCode: "AGNP",
    examName: "AGNP Mock Exam 1",
    templateName: "Standard Blueprint",
    description: "Full-length Adult-Gerontology NP certification simulation with standard proportions.",
    questionCount: 135,
    timeLimitMinutes: 240,
    domainWeights: AGNP_DOMAINS,
    passingStandard: 70,
    seed: 6001,
    tier: "np",
  }),
  makeTemplate({
    templateId: "agnp-mock-2",
    examCode: "AGNP",
    examName: "AGNP Mock Exam 2",
    templateName: "Chronic Disease Management",
    description: "Focus on managing chronic conditions in adult and geriatric populations.",
    questionCount: 130,
    timeLimitMinutes: 230,
    domainWeights: shiftWeights(AGNP_DOMAINS, 1, 0.08),
    difficultyDistribution: { foundational: 0.10, moderate: 0.50, difficult: 0.40 },
    passingStandard: 70,
    seed: 6002,
    tier: "np",
  }),
  makeTemplate({
    templateId: "agnp-mock-3",
    examCode: "AGNP",
    examName: "AGNP Mock Exam 3",
    templateName: "Pharmacology Deep Dive",
    description: "Emphasis on age-appropriate pharmacological management and drug interactions.",
    questionCount: 135,
    timeLimitMinutes: 240,
    domainWeights: shiftWeights(AGNP_DOMAINS, 2, 0.08),
    passingStandard: 70,
    seed: 6003,
    tier: "np",
  }),
  makeTemplate({
    templateId: "agnp-mock-4",
    examCode: "AGNP",
    examName: "AGNP Mock Exam 4",
    templateName: "Geriatric Scenarios",
    description: "Clinical scenarios focusing on geriatric syndromes, polypharmacy, and functional assessment.",
    questionCount: 130,
    timeLimitMinutes: 230,
    domainWeights: shiftWeights(AGNP_DOMAINS, 0, 0.07),
    formatMix: { mcqSingle: 0.35, selectAllThatApply: 0.20, scenarioBased: 0.30, prioritization: 0.10, delegation: 0.05 },
    passingStandard: 70,
    seed: 6004,
    tier: "np",
  }),
  makeTemplate({
    templateId: "agnp-mock-5",
    examCode: "AGNP",
    examName: "AGNP Mock Exam 5",
    templateName: "Comprehensive Review",
    description: "Full comprehensive exam with equal domain coverage and challenging clinical items.",
    questionCount: 150,
    timeLimitMinutes: 270,
    domainWeights: AGNP_DOMAINS,
    difficultyDistribution: { foundational: 0.08, moderate: 0.47, difficult: 0.45 },
    passingStandard: 70,
    seed: 6005,
    tier: "np",
  }),
  makeTemplate({
    templateId: "agnp-mock-6",
    examCode: "AGNP",
    examName: "AGNP Mock Exam 6",
    templateName: "Health Promotion & Prevention",
    description: "Focus on screening, preventive care, and health promotion for adult populations.",
    questionCount: 120,
    timeLimitMinutes: 220,
    domainWeights: shiftWeights(AGNP_DOMAINS, 3, 0.07),
    passingStandard: 70,
    seed: 6006,
    tier: "np",
  }),

  // ===== ACNP (6 exams) =====
  makeTemplate({
    templateId: "acnp-mock-1",
    examCode: "ACNP",
    examName: "ACNP Mock Exam 1",
    templateName: "Standard Blueprint",
    description: "Full-length Acute Care NP certification simulation with standard domain proportions.",
    questionCount: 135,
    timeLimitMinutes: 240,
    domainWeights: ACNP_DOMAINS,
    passingStandard: 70,
    seed: 7001,
    tier: "np",
  }),
  makeTemplate({
    templateId: "acnp-mock-2",
    examCode: "ACNP",
    examName: "ACNP Mock Exam 2",
    templateName: "Critical Care Focus",
    description: "Emphasis on complex acute care assessment, hemodynamic monitoring, and critical interventions.",
    questionCount: 140,
    timeLimitMinutes: 250,
    domainWeights: shiftWeights(ACNP_DOMAINS, 0, 0.08),
    difficultyDistribution: { foundational: 0.08, moderate: 0.47, difficult: 0.45 },
    passingStandard: 70,
    seed: 7002,
    tier: "np",
  }),
  makeTemplate({
    templateId: "acnp-mock-3",
    examCode: "ACNP",
    examName: "ACNP Mock Exam 3",
    templateName: "Advanced Pharmacology",
    description: "Focus on high-alert medications, vasoactive drips, and acute care pharmacotherapy.",
    questionCount: 130,
    timeLimitMinutes: 230,
    domainWeights: shiftWeights(ACNP_DOMAINS, 2, 0.08),
    passingStandard: 70,
    seed: 7003,
    tier: "np",
  }),
  makeTemplate({
    templateId: "acnp-mock-4",
    examCode: "ACNP",
    examName: "ACNP Mock Exam 4",
    templateName: "Procedures & Monitoring",
    description: "Emphasis on invasive procedures, ventilator management, and patient monitoring.",
    questionCount: 130,
    timeLimitMinutes: 230,
    domainWeights: shiftWeights(ACNP_DOMAINS, 3, 0.08),
    formatMix: { mcqSingle: 0.35, selectAllThatApply: 0.20, scenarioBased: 0.30, prioritization: 0.10, delegation: 0.05 },
    passingStandard: 70,
    seed: 7004,
    tier: "np",
  }),
  makeTemplate({
    templateId: "acnp-mock-5",
    examCode: "ACNP",
    examName: "ACNP Mock Exam 5",
    templateName: "Comprehensive Marathon",
    description: "Extended comprehensive exam covering all acute care domains with high difficulty.",
    questionCount: 150,
    timeLimitMinutes: 270,
    domainWeights: ACNP_DOMAINS,
    difficultyDistribution: { foundational: 0.08, moderate: 0.42, difficult: 0.50 },
    passingStandard: 70,
    seed: 7005,
    tier: "np",
  }),
  makeTemplate({
    templateId: "acnp-mock-6",
    examCode: "ACNP",
    examName: "ACNP Mock Exam 6",
    templateName: "Diagnosis & Management",
    description: "Focus on acute diagnostic reasoning, differential diagnosis, and rapid management decisions.",
    questionCount: 135,
    timeLimitMinutes: 240,
    domainWeights: shiftWeights(ACNP_DOMAINS, 1, 0.08),
    difficultyDistribution: { foundational: 0.10, moderate: 0.50, difficult: 0.40 },
    passingStandard: 70,
    seed: 7006,
    tier: "np",
  }),
];

export function getMockExamsForExamCode(examCode: string): MockExamTemplate[] {
  return FLAGSHIP_MOCK_EXAM_TEMPLATES.filter(t => t.examCode === examCode && t.active);
}

export function getMockExamCountByExamCode(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of FLAGSHIP_MOCK_EXAM_TEMPLATES) {
    if (!t.active) continue;
    counts[t.examCode] = (counts[t.examCode] || 0) + 1;
  }
  return counts;
}

export function getMockExamCountByTier(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of FLAGSHIP_MOCK_EXAM_TEMPLATES) {
    if (!t.active) continue;
    counts[t.tier] = (counts[t.tier] || 0) + 1;
  }
  return counts;
}

export function getMockExamTemplate(templateId: string): MockExamTemplate | undefined {
  return FLAGSHIP_MOCK_EXAM_TEMPLATES.find(t => t.templateId === templateId);
}

export const FLAGSHIP_EXAM_CODES = ["NCLEX-RN", "NCLEX-PN", "REX-PN", "AANP", "ANCC", "AGNP", "ACNP", "AGPCNP", "AGACNP", "PMHNP", "PNP", "WHNP", "ENP"] as const;
export type FlagshipExamCode = typeof FLAGSHIP_EXAM_CODES[number];
