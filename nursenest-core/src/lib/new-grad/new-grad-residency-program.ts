import { listNewGradWorkAreaSlugs } from "@/lib/new-grad/new-grad-work-areas";

export type NewGradResidencyTrackId =
  | "medical-surgical"
  | "emergency"
  | "icu"
  | "telemetry"
  | "cardiac"
  | "perioperative"
  | "pacu"
  | "labour-delivery"
  | "postpartum"
  | "pediatrics"
  | "nicu"
  | "mental-health"
  | "community"
  | "home-care"
  | "long-term-care"
  | "dialysis"
  | "oncology";

export type NewGradRoadmapWindow = "30-day" | "60-day" | "90-day" | "180-day" | "365-day";

export type NewGradLearningActivity =
  | "lessons"
  | "flashcards"
  | "questions"
  | "clinical-skills"
  | "pharmacology"
  | "ecg"
  | "simulations"
  | "case-studies"
  | "reflection-exercises"
  | "dosage-calculations"
  | "rhythm-drills"
  | "clinical-judgment-exercises";

export type NewGradResidencyPillarId =
  | "surviving-first-year"
  | "high-risk-clinical-scenarios"
  | "medication-confidence"
  | "clinical-skills-mastery"
  | "telemetry-ecg-essentials"
  | "simulation-center";

export type NewGradResidencyPillar = {
  readonly id: NewGradResidencyPillarId;
  readonly title: string;
  readonly positioning: string;
  readonly topics: readonly string[];
  readonly requiredActivities: readonly NewGradLearningActivity[];
  readonly dashboardSignal: (typeof NEW_GRAD_READINESS_DIMENSIONS)[number]["id"];
};

export type NewGradResidencyTrack = {
  readonly id: NewGradResidencyTrackId;
  readonly slug: string;
  readonly title: string;
  readonly packageKey: NewGradCommercialPackageKey;
  readonly focus: string;
  readonly firstMonthPriorities: readonly string[];
  readonly signatureSimulations: readonly string[];
  readonly requiredActivities: readonly NewGradLearningActivity[];
};

export type NewGradRoadmapMilestone = {
  readonly window: NewGradRoadmapWindow;
  readonly label: string;
  readonly focus: string;
  readonly learnerCanAnswer: readonly string[];
  readonly requiredActivities: readonly NewGradLearningActivity[];
};

export type NewGradCompetencyDomain = {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly evidenceSources: readonly NewGradLearningActivity[];
};

export type NewGradShiftReadinessModule = {
  readonly id: string;
  readonly title: string;
  readonly focus: string;
  readonly appliesTo: readonly NewGradResidencyTrackId[];
};

export type NewGradSurvivalGuide = {
  readonly id: string;
  readonly title: string;
  readonly riskFocus: string;
  readonly appliesTo: readonly NewGradResidencyTrackId[];
};

export type NewGradSimulationCase = {
  readonly id: string;
  readonly title: string;
  readonly trackId: NewGradResidencyTrackId;
  readonly judgmentFocus: readonly string[];
};

export type NewGradReadinessDimension = {
  readonly id: string;
  readonly label: string;
  readonly weight: number;
  readonly evidenceSources: readonly NewGradLearningActivity[];
};

export type NewGradCommercialPackageKey =
  | "new-grad-base"
  | "icu-specialty"
  | "telemetry-specialty"
  | "emergency-specialty"
  | "perioperative-specialty"
  | "cardiac-specialty"
  | "specialty-library";

export type NewGradCommercialPackage = {
  readonly key: NewGradCommercialPackageKey;
  readonly title: string;
  readonly includedTracks: readonly NewGradResidencyTrackId[];
  readonly entitlementHint: string;
};

export type NewGradContentLaunchTarget = {
  readonly id: string;
  readonly label: string;
  readonly minimum: number;
  readonly rationale: string;
};

export type NewGradAdaptiveCompetencyId =
  | "clinical-judgment"
  | "pharmacology"
  | "prioritization"
  | "delegation"
  | "communication"
  | "documentation"
  | "ecg"
  | "skills";

export type NewGradAdaptiveCompetencyProfile = {
  readonly id: NewGradAdaptiveCompetencyId;
  readonly label: string;
  readonly weakAreaEvidence: readonly string[];
  readonly remediationActivities: readonly NewGradLearningActivity[];
};

export type NewGradDashboardMetric = {
  readonly id: (typeof NEW_GRAD_READINESS_DIMENSIONS)[number]["id"] | "competency-heat-map";
  readonly label: string;
  readonly score: number;
  readonly status: "not-started" | "needs-support" | "developing" | "ready";
};

const ALL_ACTIVITIES: readonly NewGradLearningActivity[] = [
  "lessons",
  "flashcards",
  "questions",
  "clinical-skills",
  "pharmacology",
  "ecg",
  "simulations",
  "case-studies",
];

export const NEW_GRAD_RESIDENCY_PILLARS: readonly NewGradResidencyPillar[] = [
  {
    id: "surviving-first-year",
    title: "Surviving Your First Year",
    positioning: "Practical orientation and first-year professional practice support for real shifts, preceptorship, and consolidation.",
    topics: [
      "Time management",
      "Prioritization",
      "Organization",
      "Shift preparation",
      "Giving report",
      "Receiving report",
      "Calling physicians",
      "Escalation pathways",
      "Documentation",
      "Delegation",
      "Conflict management",
      "Difficult conversations",
      "Managing stress",
    ],
    requiredActivities: ["lessons", "flashcards", "simulations", "reflection-exercises"],
    dashboardSignal: "orientation-progress",
  },
  {
    id: "high-risk-clinical-scenarios",
    title: "High-Risk Clinical Scenarios",
    positioning: "Scenario-based practice for the deterioration patterns new graduates are most likely to miss early.",
    topics: [
      "Sepsis",
      "Respiratory distress",
      "Chest pain",
      "Stroke",
      "Hypoglycemia",
      "Hyperglycemia",
      "GI bleed",
      "Shock",
      "Falls",
      "Delirium",
      "Deteriorating patient",
      "End-of-life care",
    ],
    requiredActivities: ["lessons", "flashcards", "questions", "simulations", "clinical-judgment-exercises"],
    dashboardSignal: "clinical-confidence",
  },
  {
    id: "medication-confidence",
    title: "Medication Confidence Program",
    positioning: "Medication safety curriculum focused on high-frequency and high-alert decisions during transition to practice.",
    topics: [
      "Common medications",
      "High-alert medications",
      "IV medications",
      "Insulin",
      "Anticoagulants",
      "Opioids",
      "Antibiotics",
      "Cardiac medications",
    ],
    requiredActivities: ["pharmacology", "flashcards", "questions", "dosage-calculations", "case-studies"],
    dashboardSignal: "medication-readiness",
  },
  {
    id: "clinical-skills-mastery",
    title: "Clinical Skills Mastery",
    positioning: "Skill readiness with common mistakes, escalation criteria, and procedure-linked remediation.",
    topics: [
      "IV starts",
      "Blood administration",
      "Central line care",
      "NG tubes",
      "Foley insertion",
      "Wound care",
      "Tracheostomy care",
      "Chest tubes",
      "Telemetry interpretation",
      "Oxygen therapy",
      "PCA pumps",
    ],
    requiredActivities: ["clinical-skills", "lessons", "flashcards", "questions", "simulations"],
    dashboardSignal: "skill-readiness",
  },
  {
    id: "telemetry-ecg-essentials",
    title: "Telemetry & ECG Essentials",
    positioning: "Core rhythm recognition, clinical implications, and nursing actions integrated with the ECG ecosystem.",
    topics: [
      "Sinus rhythms",
      "Atrial fibrillation",
      "Atrial flutter",
      "SVT",
      "Bradycardias",
      "Heart blocks",
      "Ventricular rhythms",
      "STEMI recognition",
    ],
    requiredActivities: ["ecg", "lessons", "rhythm-drills", "questions", "simulations"],
    dashboardSignal: "telemetry-readiness",
  },
  {
    id: "simulation-center",
    title: "New Grad Simulation Center",
    positioning: "Flagship shift-based simulations built around patient assignments, competing priorities, interruptions, deterioration, and handoff.",
    topics: [
      "Full patient assignments",
      "Prioritization",
      "Interruptions",
      "Multiple competing tasks",
      "Deterioration events",
      "Shift management",
      "Four-patient medical assignment",
      "Busy surgical unit",
      "New admission during medication pass",
      "Rapid response activation",
      "End-of-shift handoff",
    ],
    requiredActivities: ["simulations", "case-studies", "clinical-judgment-exercises", "questions", "reflection-exercises"],
    dashboardSignal: "simulation-readiness",
  },
] as const;

export const NEW_GRAD_CONTENT_LAUNCH_TARGETS: readonly NewGradContentLaunchTarget[] = [
  {
    id: "lessons",
    label: "Lessons",
    minimum: 500,
    rationale: "Enough structured teaching to support orientation, consolidation, specialty transition, and first-year practice.",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    minimum: 3000,
    rationale: "Retention practice for safety cues, medications, ECG, skills, communication, and specialty patterns.",
  },
  {
    id: "questions",
    label: "Questions",
    minimum: 5000,
    rationale: "Clinical application practice across common, high-risk, and specialty transition decisions.",
  },
  {
    id: "clinical-skills",
    label: "Clinical Skills",
    minimum: 100,
    rationale: "Procedure readiness with common mistakes, escalation criteria, documentation, and linked remediation.",
  },
  {
    id: "simulations",
    label: "Simulations",
    minimum: 100,
    rationale: "Shift-based practice that feels like nursing work rather than static exam review.",
  },
  {
    id: "medication-lessons",
    label: "Medication Lessons",
    minimum: 250,
    rationale: "Medication confidence curriculum spanning common, high-alert, IV, insulin, anticoagulant, opioid, antibiotic, and cardiac medications.",
  },
  {
    id: "ecg-lessons",
    label: "ECG Lessons",
    minimum: 100,
    rationale: "Telemetry and ECG essentials aligned to first-year nursing actions and escalation criteria.",
  },
  {
    id: "telemetry-cases",
    label: "Telemetry Cases",
    minimum: 250,
    rationale: "Rhythm recognition, alarm response, artifact troubleshooting, and deterioration decisions.",
  },
  {
    id: "new-grad-medication-questions",
    label: "New Grad Medication Questions",
    minimum: 500,
    rationale: "Dedicated medication decision practice across hold/administer/clarify, monitoring, adverse effects, and patient teaching.",
  },
] as const;

export const NEW_GRAD_RESIDENCY_TRACKS: readonly NewGradResidencyTrack[] = [
  {
    id: "medical-surgical",
    slug: "med-surg",
    title: "Medical-Surgical",
    packageKey: "new-grad-base",
    focus: "Organizing multi-system care, recognizing deterioration, and managing common post-op and medical admissions.",
    firstMonthPriorities: ["shift organization", "post-op assessment", "infection risk", "falls prevention"],
    signatureSimulations: ["Four-patient medical assignment", "New admission during medication pass", "Post-op deterioration"],
    requiredActivities: ALL_ACTIVITIES,
  },
  {
    id: "emergency",
    slug: "emergency-department",
    title: "Emergency",
    packageKey: "emergency-specialty",
    focus: "Triage, stabilization, rapid reassessment, and time-sensitive pathway activation.",
    firstMonthPriorities: ["primary survey", "triage acuity", "stroke/STEMI/sepsis pathways", "handoff under pressure"],
    signatureSimulations: ["Stroke alert", "STEMI arrival", "Overdose with airway risk", "Sepsis in a crowded department"],
    requiredActivities: ALL_ACTIVITIES,
  },
  {
    id: "icu",
    slug: "icu",
    title: "ICU",
    packageKey: "icu-specialty",
    focus: "Hemodynamic trends, organ support, high-alert medications, ventilator safety, and structured escalation.",
    firstMonthPriorities: ["ICU orientation", "ventilator basics", "hemodynamic basics", "critical labs"],
    signatureSimulations: ["Septic shock", "ARDS", "Mechanical ventilation", "CRRT safety check", "Cardiogenic shock"],
    requiredActivities: ALL_ACTIVITIES,
  },
  {
    id: "telemetry",
    slug: "cardiac-icu",
    title: "Telemetry",
    packageKey: "telemetry-specialty",
    focus: "Telemetry alarms, lead troubleshooting, rhythm recognition, and escalation criteria.",
    firstMonthPriorities: ["telemetry lead placement", "artifact recognition", "atrial fibrillation", "heart block escalation"],
    signatureSimulations: ["New atrial fibrillation", "Complete heart block", "Ventricular tachycardia", "Pacemaker failure"],
    requiredActivities: ALL_ACTIVITIES,
  },
  {
    id: "cardiac",
    slug: "cardiac-icu",
    title: "Cardiac",
    packageKey: "cardiac-specialty",
    focus: "Cardiac assessment, heart failure trends, ischemia recognition, and medication safety.",
    firstMonthPriorities: ["chest pain assessment", "heart failure trends", "diuretic monitoring", "post-PCI safety"],
    signatureSimulations: ["Acute chest pain", "Decompensated heart failure", "Post-PCI complication"],
    requiredActivities: ALL_ACTIVITIES,
  },
  {
    id: "perioperative",
    slug: "operating-room",
    title: "Perioperative",
    packageKey: "perioperative-specialty",
    focus: "Surgical safety, sterile workflow, handoff quality, and intraoperative risk recognition.",
    firstMonthPriorities: ["surgical checklist", "sterile field awareness", "specimen handling", "OR communication"],
    signatureSimulations: ["Wrong-site prevention", "Instrument count discrepancy", "Intraoperative instability"],
    requiredActivities: ["lessons", "flashcards", "questions", "clinical-skills", "pharmacology", "simulations", "case-studies"],
  },
  {
    id: "pacu",
    slug: "pacu",
    title: "PACU",
    packageKey: "perioperative-specialty",
    focus: "Airway recovery, pain and sedation assessment, surgical complications, and discharge readiness.",
    firstMonthPriorities: ["airway positioning", "sedation scoring", "pain reassessment", "bleeding surveillance"],
    signatureSimulations: ["Post-anesthesia airway obstruction", "Uncontrolled pain", "Post-op bleeding"],
    requiredActivities: ALL_ACTIVITIES,
  },
  {
    id: "labour-delivery",
    slug: "labour-delivery",
    title: "Labour & Delivery",
    packageKey: "specialty-library",
    focus: "Maternal-fetal assessment, fetal monitoring basics, obstetric emergencies, and team communication.",
    firstMonthPriorities: ["fetal heart rate baseline", "uterine activity", "postpartum hemorrhage readiness", "neonatal transition"],
    signatureSimulations: ["Shoulder dystocia", "Postpartum hemorrhage", "Nonreassuring fetal tracing"],
    requiredActivities: ALL_ACTIVITIES,
  },
  {
    id: "postpartum",
    slug: "maternal-newborn",
    title: "Postpartum",
    packageKey: "specialty-library",
    focus: "Bleeding surveillance, newborn feeding support, hypertensive risk, and discharge teaching.",
    firstMonthPriorities: ["fundal assessment", "lochia changes", "preeclampsia warning signs", "newborn safety"],
    signatureSimulations: ["Delayed postpartum hemorrhage", "Postpartum hypertension", "Newborn feeding concern"],
    requiredActivities: ["lessons", "flashcards", "questions", "clinical-skills", "pharmacology", "simulations", "case-studies"],
  },
  {
    id: "pediatrics",
    slug: "pediatrics",
    title: "Pediatrics",
    packageKey: "specialty-library",
    focus: "Age-based assessment, family-centered communication, weight-based safety, and early deterioration recognition.",
    firstMonthPriorities: ["age-adjusted vitals", "weight-based meds", "respiratory distress", "family partnership"],
    signatureSimulations: ["Bronchiolitis deterioration", "Pediatric dehydration", "Asthma exacerbation"],
    requiredActivities: ["lessons", "flashcards", "questions", "clinical-skills", "pharmacology", "simulations", "case-studies"],
  },
  {
    id: "nicu",
    slug: "neonatal-icu",
    title: "NICU",
    packageKey: "specialty-library",
    focus: "Thermoregulation, feeding tolerance, respiratory support, infection prevention, and family teaching.",
    firstMonthPriorities: ["gestational-age context", "temperature stability", "glucose surveillance", "apnea/bradycardia events"],
    signatureSimulations: ["Apnea and bradycardia", "Neonatal hypoglycemia", "Feeding intolerance"],
    requiredActivities: ["lessons", "flashcards", "questions", "clinical-skills", "pharmacology", "simulations", "case-studies"],
  },
  {
    id: "mental-health",
    slug: "mental-health",
    title: "Mental Health",
    packageKey: "specialty-library",
    focus: "Therapeutic communication, safety planning, de-escalation, medication monitoring, and trauma-informed care.",
    firstMonthPriorities: ["suicide risk language", "de-escalation", "withdrawal safety", "antipsychotic adverse effects"],
    signatureSimulations: ["Suicide precautions", "Escalating agitation", "Medication refusal"],
    requiredActivities: ["lessons", "flashcards", "questions", "clinical-skills", "pharmacology", "simulations", "case-studies"],
  },
  {
    id: "community",
    slug: "community-public-health",
    title: "Community",
    packageKey: "new-grad-base",
    focus: "Population health, teaching, home and clinic safety, care coordination, and social determinants.",
    firstMonthPriorities: ["health teaching", "resource navigation", "infection prevention", "follow-up coordination"],
    signatureSimulations: ["Missed follow-up risk", "Community outbreak call", "Unsafe discharge supports"],
    requiredActivities: ["lessons", "flashcards", "questions", "clinical-skills", "simulations", "case-studies"],
  },
  {
    id: "home-care",
    slug: "home-care",
    title: "Home Care",
    packageKey: "new-grad-base",
    focus: "Autonomous visits, environmental risk, medication reconciliation, and escalation from the home.",
    firstMonthPriorities: ["visit safety", "oxygen safety", "home medication storage", "wound/line escalation"],
    signatureSimulations: ["Solo visit safety concern", "Home oxygen hazard", "Wound vac troubleshooting"],
    requiredActivities: ["lessons", "flashcards", "questions", "clinical-skills", "pharmacology", "simulations", "case-studies"],
  },
  {
    id: "long-term-care",
    slug: "long-term-care",
    title: "Long-Term Care",
    packageKey: "new-grad-base",
    focus: "Resident baseline changes, falls, delirium, infection recognition, and family communication.",
    firstMonthPriorities: ["baseline comparison", "falls response", "delirium vs dementia", "SBAR to provider"],
    signatureSimulations: ["Unwitnessed fall", "UTI with delirium", "Family concern during med pass"],
    requiredActivities: ["lessons", "flashcards", "questions", "clinical-skills", "pharmacology", "simulations", "case-studies"],
  },
  {
    id: "dialysis",
    slug: "renal-dialysis",
    title: "Dialysis",
    packageKey: "specialty-library",
    focus: "Access assessment, fluid balance, electrolyte risk, hemodynamic shifts, and infection prevention.",
    firstMonthPriorities: ["access bruit/thrill", "hypotension response", "potassium risk", "post-treatment teaching"],
    signatureSimulations: ["Intradialytic hypotension", "Access infection concern", "Hyperkalemia escalation"],
    requiredActivities: ["lessons", "flashcards", "questions", "clinical-skills", "pharmacology", "ecg", "simulations", "case-studies"],
  },
  {
    id: "oncology",
    slug: "oncology-hematology",
    title: "Oncology",
    packageKey: "specialty-library",
    focus: "Neutropenic risk, symptom management, central access safety, and escalation for treatment complications.",
    firstMonthPriorities: ["fever in neutropenia", "central line care", "nausea/dehydration", "pain and psychosocial support"],
    signatureSimulations: ["Febrile neutropenia", "Central line occlusion", "Uncontrolled chemotherapy nausea"],
    requiredActivities: ["lessons", "flashcards", "questions", "clinical-skills", "pharmacology", "simulations", "case-studies"],
  },
] as const;

export const NEW_GRAD_ROADMAP_MILESTONES: readonly NewGradRoadmapMilestone[] = [
  {
    window: "30-day",
    label: "First 30 days",
    focus: "Orientation, unit routines, safe escalation, medication pass structure, and knowing when to ask for help.",
    learnerCanAnswer: [
      "What should I learn first on this unit?",
      "Who do I call when the patient changes?",
      "What safety checks must never be skipped?",
    ],
    requiredActivities: ["lessons", "flashcards", "questions", "clinical-skills", "simulations"],
  },
  {
    window: "60-day",
    label: "First 60 days",
    focus: "Common deterioration patterns, SBAR handoff, documentation habits, and prioritized patient assignments.",
    learnerCanAnswer: [
      "Which cues suggest the patient is worsening?",
      "What information belongs in a concise SBAR?",
      "How do I organize competing tasks safely?",
    ],
    requiredActivities: ["lessons", "questions", "case-studies", "simulations", "pharmacology"],
  },
  {
    window: "90-day",
    label: "First 90 days",
    focus: "Increasing assignment independence, medication confidence, delegation, and condition-specific readiness.",
    learnerCanAnswer: [
      "Which competencies am I missing?",
      "Which medications and labs create the highest risk on my unit?",
      "How do I delegate without losing accountability?",
    ],
    requiredActivities: ALL_ACTIVITIES,
  },
  {
    window: "180-day",
    label: "First 180 days",
    focus: "Complex patient clusters, specialty case patterns, teamwork under pressure, and reflection after near misses.",
    learnerCanAnswer: [
      "What specialty concepts are still weak?",
      "How do I recover after a near miss?",
      "Am I ready for a heavier assignment with support?",
    ],
    requiredActivities: ALL_ACTIVITIES,
  },
  {
    window: "365-day",
    label: "First year",
    focus: "Consolidation, specialty growth, preceptor-ready habits, and readiness for advanced responsibilities.",
    learnerCanAnswer: [
      "How have I progressed compared with my specialty roadmap?",
      "What should I study before my next career step?",
      "Which specialty track should I deepen next?",
    ],
    requiredActivities: ALL_ACTIVITIES,
  },
] as const;

export const NEW_GRAD_COMPETENCY_DOMAINS: readonly NewGradCompetencyDomain[] = [
  {
    id: "knowledge",
    label: "Knowledge",
    description: "Core concepts, pathophysiology, assessments, labs, and specialty terminology.",
    evidenceSources: ["lessons", "questions", "flashcards", "case-studies"],
  },
  {
    id: "clinical-skills",
    label: "Clinical Skills",
    description: "Procedure preparation, safe technique, complication recognition, and documentation.",
    evidenceSources: ["clinical-skills", "lessons", "questions", "simulations"],
  },
  {
    id: "communication",
    label: "Communication",
    description: "SBAR, handoff, closed-loop team communication, family updates, and respectful inquiry.",
    evidenceSources: ["simulations", "case-studies", "questions"],
  },
  {
    id: "documentation",
    label: "Documentation",
    description: "Defensible notes, trend documentation, reassessment timing, and escalation records.",
    evidenceSources: ["lessons", "simulations", "case-studies"],
  },
  {
    id: "professional-practice",
    label: "Professional Practice",
    description: "Scope, ethics, policy use, preceptor feedback, self-advocacy, and boundaries.",
    evidenceSources: ["lessons", "questions", "case-studies"],
  },
  {
    id: "clinical-judgment",
    label: "Clinical Judgment",
    description: "Recognizing cues, analyzing trends, prioritizing hypotheses, taking action, and evaluating outcomes.",
    evidenceSources: ["questions", "case-studies", "simulations"],
  },
  {
    id: "time-management",
    label: "Time Management",
    description: "Shift planning, task clustering, interruption recovery, and assignment reprioritization.",
    evidenceSources: ["simulations", "case-studies", "questions"],
  },
  {
    id: "delegation",
    label: "Delegation",
    description: "Scope-aware delegation, follow-up, accountability, and charge/preceptor communication.",
    evidenceSources: ["questions", "simulations", "case-studies"],
  },
  {
    id: "prioritization",
    label: "Prioritization",
    description: "ABCs, unstable vs stable findings, time-sensitive pathways, and workload triage.",
    evidenceSources: ["questions", "simulations", "case-studies"],
  },
] as const;

export const NEW_GRAD_SHIFT_READINESS_MODULES: readonly NewGradShiftReadinessModule[] = [
  {
    id: "first-shift",
    title: "Before Your First Shift",
    focus: "Unit map, assignment sheet, medication pass rhythm, escalation contacts, and safe questions to ask.",
    appliesTo: NEW_GRAD_RESIDENCY_TRACKS.map((track) => track.id),
  },
  {
    id: "first-night-shift",
    title: "Before Your First Night Shift",
    focus: "Reduced resources, sleep planning, quiet-hour reassessments, overnight provider communication, and safety checks.",
    appliesTo: NEW_GRAD_RESIDENCY_TRACKS.map((track) => track.id),
  },
  {
    id: "first-charge-shift",
    title: "Before Your First Charge Shift",
    focus: "Assignment balancing, escalation chains, resource allocation, conflict containment, and documentation of decisions.",
    appliesTo: ["medical-surgical", "long-term-care", "community", "home-care", "postpartum"],
  },
  {
    id: "first-icu-assignment",
    title: "Before Your First ICU Assignment",
    focus: "Ventilator alarms, hemodynamic trends, high-alert drips, line safety, and urgent escalation criteria.",
    appliesTo: ["icu", "nicu", "pacu", "cardiac"],
  },
  {
    id: "first-telemetry-assignment",
    title: "Before Your First Telemetry Assignment",
    focus: "Lead placement, alarm response, rhythm change escalation, artifact troubleshooting, and chest pain pathways.",
    appliesTo: ["telemetry", "cardiac", "medical-surgical", "emergency"],
  },
] as const;

export const NEW_GRAD_SURVIVAL_GUIDES: readonly NewGradSurvivalGuide[] = [
  {
    id: "icu-emergencies",
    title: "Top 25 ICU Emergencies",
    riskFocus: "Shock, airway, ventilator, line, sedation, renal, and electrolyte events requiring immediate escalation.",
    appliesTo: ["icu", "pacu", "cardiac", "emergency"],
  },
  {
    id: "telemetry-pitfalls",
    title: "Top 25 Telemetry Pitfalls",
    riskFocus: "Artifact, missed heart block, inappropriate alarm silencing, chest pain delay, and electrolytes.",
    appliesTo: ["telemetry", "cardiac", "medical-surgical", "dialysis"],
  },
  {
    id: "er-priorities",
    title: "Top 25 ER Priorities",
    riskFocus: "Triage misses, sepsis delay, stroke/STEMI timing, unsafe discharge, and reassessment gaps.",
    appliesTo: ["emergency"],
  },
  {
    id: "medication-errors",
    title: "Top 25 Medication Errors",
    riskFocus: "High-alert medications, insulin, anticoagulants, opioids, antibiotics, and pump programming.",
    appliesTo: NEW_GRAD_RESIDENCY_TRACKS.map((track) => track.id),
  },
  {
    id: "documentation-mistakes",
    title: "Top 25 Documentation Mistakes",
    riskFocus: "Missing reassessment, unclear escalation, late entries, copy-forward risk, and incomplete handoff notes.",
    appliesTo: NEW_GRAD_RESIDENCY_TRACKS.map((track) => track.id),
  },
] as const;

export const NEW_GRAD_SIMULATION_CASES: readonly NewGradSimulationCase[] = [
  {
    id: "med-surg-four-patient-assignment",
    title: "Four-patient medical assignment",
    trackId: "medical-surgical",
    judgmentFocus: ["prioritization", "interruption recovery", "escalation timing"],
  },
  {
    id: "surgical-unit-new-admission-med-pass",
    title: "New admission during medication pass",
    trackId: "medical-surgical",
    judgmentFocus: ["time management", "medication safety", "handoff"],
  },
  {
    id: "icu-septic-shock",
    title: "Septic shock",
    trackId: "icu",
    judgmentFocus: ["hypoperfusion cues", "lactate trend", "vasoactive safety"],
  },
  {
    id: "icu-ards-ventilation",
    title: "ARDS and mechanical ventilation",
    trackId: "icu",
    judgmentFocus: ["oxygenation trend", "ventilator alarm response", "provider escalation"],
  },
  {
    id: "telemetry-new-afib",
    title: "New atrial fibrillation",
    trackId: "telemetry",
    judgmentFocus: ["rhythm recognition", "rate symptoms", "anticoagulation awareness"],
  },
  {
    id: "telemetry-complete-heart-block",
    title: "Complete heart block",
    trackId: "telemetry",
    judgmentFocus: ["bradycardia danger signs", "monitoring", "rapid escalation"],
  },
  {
    id: "emergency-stroke-alert",
    title: "Stroke alert",
    trackId: "emergency",
    judgmentFocus: ["last-known-well", "neurologic cues", "time-sensitive pathway"],
  },
  {
    id: "emergency-stemi",
    title: "STEMI arrival",
    trackId: "emergency",
    judgmentFocus: ["ECG recognition", "chest pain pathway", "team activation"],
  },
  {
    id: "oncology-febrile-neutropenia",
    title: "Febrile neutropenia",
    trackId: "oncology",
    judgmentFocus: ["infection risk", "urgent antibiotics", "protective precautions"],
  },
] as const;

export const NEW_GRAD_READINESS_DIMENSIONS: readonly NewGradReadinessDimension[] = [
  {
    id: "clinical-confidence",
    label: "Clinical Confidence",
    weight: 20,
    evidenceSources: ["questions", "flashcards", "simulations", "case-studies"],
  },
  {
    id: "skill-readiness",
    label: "Skill Readiness",
    weight: 18,
    evidenceSources: ["clinical-skills", "lessons", "questions"],
  },
  {
    id: "medication-readiness",
    label: "Medication Readiness",
    weight: 18,
    evidenceSources: ["pharmacology", "questions", "case-studies"],
  },
  {
    id: "telemetry-readiness",
    label: "Telemetry Readiness",
    weight: 14,
    evidenceSources: ["ecg", "questions", "simulations"],
  },
  {
    id: "simulation-readiness",
    label: "Simulation Readiness",
    weight: 18,
    evidenceSources: ["simulations", "case-studies"],
  },
  {
    id: "orientation-progress",
    label: "Orientation Progress",
    weight: 12,
    evidenceSources: ["lessons", "clinical-skills", "case-studies"],
  },
] as const;

export const NEW_GRAD_ADAPTIVE_COMPETENCY_PROFILE: readonly NewGradAdaptiveCompetencyProfile[] = [
  {
    id: "clinical-judgment",
    label: "Clinical Judgment",
    weakAreaEvidence: ["missed deterioration cues", "incorrect prioritization", "low simulation outcome score"],
    remediationActivities: ["questions", "case-studies", "simulations", "lessons"],
  },
  {
    id: "pharmacology",
    label: "Pharmacology",
    weakAreaEvidence: ["medication safety errors", "low high-alert medication confidence", "missed monitoring parameters"],
    remediationActivities: ["pharmacology", "flashcards", "questions", "dosage-calculations"],
  },
  {
    id: "prioritization",
    label: "Prioritization",
    weakAreaEvidence: ["unstable patient selected late", "assignment sequencing errors", "difficulty recovering from interruptions"],
    remediationActivities: ["simulations", "questions", "case-studies", "reflection-exercises"],
  },
  {
    id: "delegation",
    label: "Delegation",
    weakAreaEvidence: ["scope mismatch", "missing follow-up", "unclear accountability after task assignment"],
    remediationActivities: ["lessons", "questions", "simulations", "case-studies"],
  },
  {
    id: "communication",
    label: "Communication",
    weakAreaEvidence: ["incomplete SBAR", "missed closed-loop communication", "unclear provider escalation"],
    remediationActivities: ["simulations", "reflection-exercises", "lessons", "case-studies"],
  },
  {
    id: "documentation",
    label: "Documentation",
    weakAreaEvidence: ["missing reassessment", "unclear escalation trail", "late or incomplete handoff note"],
    remediationActivities: ["lessons", "case-studies", "reflection-exercises"],
  },
  {
    id: "ecg",
    label: "ECG",
    weakAreaEvidence: ["missed rhythm change", "artifact confusion", "incorrect STEMI escalation"],
    remediationActivities: ["ecg", "rhythm-drills", "questions", "simulations"],
  },
  {
    id: "skills",
    label: "Skills",
    weakAreaEvidence: ["procedure sequencing error", "missed common mistake", "unclear complication response"],
    remediationActivities: ["clinical-skills", "lessons", "flashcards", "questions", "simulations"],
  },
] as const;

export const NEW_GRAD_COMMERCIAL_PACKAGES: readonly NewGradCommercialPackage[] = [
  {
    key: "new-grad-base",
    title: "New Grad Base Package",
    includedTracks: ["medical-surgical", "community", "home-care", "long-term-care"],
    entitlementHint: "Use the existing NEW_GRAD tier entitlement for transition-to-practice foundations.",
  },
  {
    key: "icu-specialty",
    title: "ICU Specialty Add-On",
    includedTracks: ["icu", "nicu"],
    entitlementHint: "Gate as a New Grad specialty add-on layered on top of NEW_GRAD.",
  },
  {
    key: "telemetry-specialty",
    title: "Telemetry Add-On",
    includedTracks: ["telemetry"],
    entitlementHint: "Gate as a telemetry-focused New Grad add-on with ECG dependencies.",
  },
  {
    key: "emergency-specialty",
    title: "Emergency Add-On",
    includedTracks: ["emergency"],
    entitlementHint: "Gate as an emergency-readiness New Grad add-on.",
  },
  {
    key: "perioperative-specialty",
    title: "Perioperative Add-On",
    includedTracks: ["perioperative", "pacu"],
    entitlementHint: "Gate perioperative and PACU transition modules together as a New Grad add-on.",
  },
  {
    key: "cardiac-specialty",
    title: "Cardiac Add-On",
    includedTracks: ["cardiac"],
    entitlementHint: "Gate cardiac transition modules as a New Grad add-on with optional ECG/Advanced ECG upgrade routing.",
  },
  {
    key: "specialty-library",
    title: "Specialty Library Add-On",
    includedTracks: ["labour-delivery", "postpartum", "pediatrics", "mental-health", "dialysis", "oncology"],
    entitlementHint: "Gate less-common specialty transition tracks as a bundled New Grad add-on library.",
  },
] as const;

const RESIDENCY_TRACK_BY_ID = new Map(NEW_GRAD_RESIDENCY_TRACKS.map((track) => [track.id, track]));

export function listNewGradResidencyTracks(): readonly NewGradResidencyTrack[] {
  return NEW_GRAD_RESIDENCY_TRACKS;
}

export function getNewGradResidencyTrack(trackId: NewGradResidencyTrackId): NewGradResidencyTrack {
  const track = RESIDENCY_TRACK_BY_ID.get(trackId);
  if (!track) {
    throw new Error(`Unknown New Grad residency track: ${trackId}`);
  }
  return track;
}

export function findNewGradResidencyTrackByWorkAreaSlug(slug: string): NewGradResidencyTrack | null {
  return NEW_GRAD_RESIDENCY_TRACKS.find((track) => track.slug === slug) ?? null;
}

export function listNewGradResidencyTracksMissingWorkAreaHubs(): readonly NewGradResidencyTrack[] {
  const workAreaSlugs = new Set(listNewGradWorkAreaSlugs());
  return NEW_GRAD_RESIDENCY_TRACKS.filter((track) => !workAreaSlugs.has(track.slug));
}

export function listNewGradResidencyTracksForPackage(packageKey: NewGradCommercialPackageKey): readonly NewGradResidencyTrack[] {
  const pkg = NEW_GRAD_COMMERCIAL_PACKAGES.find((row) => row.key === packageKey);
  if (!pkg) return [];
  return pkg.includedTracks.map(getNewGradResidencyTrack);
}

export function calculateNewGradCompetencyCompletion(args: {
  completedEvidenceSources: readonly NewGradLearningActivity[];
  requiredEvidenceSources: readonly NewGradLearningActivity[];
}): number {
  const completed = new Set(args.completedEvidenceSources);
  const required = Array.from(new Set(args.requiredEvidenceSources));
  if (required.length === 0) return 0;
  const hits = required.filter((activity) => completed.has(activity)).length;
  return Math.round((hits / required.length) * 100);
}

export function calculateNewGradSpecialtyReadinessScore(
  dimensionScores: Partial<Record<(typeof NEW_GRAD_READINESS_DIMENSIONS)[number]["id"], number>>,
): number {
  const totalWeight = NEW_GRAD_READINESS_DIMENSIONS.reduce((sum, dimension) => sum + dimension.weight, 0);
  if (totalWeight <= 0) return 0;
  const weighted = NEW_GRAD_READINESS_DIMENSIONS.reduce((sum, dimension) => {
    const raw = dimensionScores[dimension.id];
    const score = typeof raw === "number" && Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 0;
    return sum + score * dimension.weight;
  }, 0);
  return Math.round(weighted / totalWeight);
}

export function listNewGradResidencyPillars(): readonly NewGradResidencyPillar[] {
  return NEW_GRAD_RESIDENCY_PILLARS;
}

export function listNewGradAdaptiveRemediationActivities(
  competencyId: NewGradAdaptiveCompetencyId,
): readonly NewGradLearningActivity[] {
  return NEW_GRAD_ADAPTIVE_COMPETENCY_PROFILE.find((profile) => profile.id === competencyId)?.remediationActivities ?? [];
}

export function buildNewGradDashboardMetrics(
  dimensionScores: Partial<Record<(typeof NEW_GRAD_READINESS_DIMENSIONS)[number]["id"], number>>,
): readonly NewGradDashboardMetric[] {
  const metrics = NEW_GRAD_READINESS_DIMENSIONS.map((dimension) => {
    const raw = dimensionScores[dimension.id];
    const score = typeof raw === "number" && Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 0;
    return {
      id: dimension.id,
      label: dimension.label,
      score,
      status: newGradDashboardStatus(score),
    } satisfies NewGradDashboardMetric;
  });

  const heatMapScore = calculateNewGradSpecialtyReadinessScore(dimensionScores);
  return [
    ...metrics,
    {
      id: "competency-heat-map",
      label: "Competency Heat Map",
      score: heatMapScore,
      status: newGradDashboardStatus(heatMapScore),
    },
  ];
}

function newGradDashboardStatus(score: number): NewGradDashboardMetric["status"] {
  if (score <= 0) return "not-started";
  if (score < 50) return "needs-support";
  if (score < 80) return "developing";
  return "ready";
}
