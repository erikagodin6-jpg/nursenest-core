export const NURSING_TIERS = [
  { id: "pre_nursing", label: "Pre-Nursing", examCode: "pre_nursing", scope: "Foundational nursing concepts, anatomy, physiology, and health assessment basics for pre-nursing students." },
  { id: "rpn", label: "RPN / LVN", examCode: "rpn_lvn", scope: "Monitor, report, administer as ordered, basic assessments. RPNs/LVNs do NOT independently prescribe, diagnose, or initiate treatment plans." },
  { id: "rn", label: "RN (NCLEX-RN)", examCode: "nclex_rn", scope: "Protocol-based interventions, complex assessments, delegation, care coordination, patient education, critical thinking in acute and chronic settings." },
  { id: "rn_international", label: "RN International", examCode: "rn_intl", scope: "International RN licensure with focus on scope-of-practice adaptation, cultural competence, pharmacological conversions, and regulatory differences." },
  { id: "np", label: "Nurse Practitioner", examCode: "np", scope: "Order, prescribe, diagnose, advanced practice. NPs independently manage patient care, interpret diagnostics, prescribe pharmacotherapy, and make differential diagnoses." },
] as const;

export const NP_SPECIALTIES = [
  { id: "np_fnp", label: "Family Nurse Practitioner (FNP)", examCode: "aanp_fnp", focus: "Primary care across the lifespan, chronic disease management, health promotion, disease prevention." },
  { id: "np_agnp", label: "Adult-Gerontology NP (AGNP)", examCode: "agnp", focus: "Adult and geriatric primary/acute care, multi-morbidity management, polypharmacy, age-related changes." },
  { id: "np_pmhnp", label: "Psychiatric-Mental Health NP (PMHNP)", examCode: "pmhnp", focus: "Psychiatric assessment, psychopharmacology, therapeutic modalities, crisis intervention, substance use disorders." },
  { id: "np_pnp", label: "Pediatric NP (PNP)", examCode: "pnp", focus: "Pediatric primary/acute care, growth and development, immunizations, congenital conditions, pediatric pharmacology." },
  { id: "np_nnp", label: "Neonatal NP (NNP)", examCode: "nnp", focus: "Neonatal intensive care, premature infant management, neonatal resuscitation, congenital anomalies." },
  { id: "np_whnp", label: "Women's Health NP (WHNP)", examCode: "whnp", focus: "Reproductive health, obstetrics/gynecology, menopause management, contraception, prenatal/postnatal care." },
  { id: "np_cnpe", label: "CNPE (Canadian NP)", examCode: "cnpe_2025", focus: "Canadian NP competencies, SI units, Indigenous health, interprofessional collaboration, Canadian prescribing guidelines." },
] as const;

export const ALLIED_HEALTH_PROFESSIONS = [
  { id: "respiratory_therapy", label: "Respiratory Therapist (RRT)", examCode: "rrt_tmc", slug: "respiratory-therapy" },
  { id: "medical_lab_tech", label: "Medical Laboratory Technologist (MLT)", examCode: "mlt_ascp", slug: "medical-laboratory-technologist" },
  { id: "paramedic", label: "Paramedic / EMS (NREMT)", examCode: "nremt", slug: "paramedic" },
  { id: "radiologic_tech", label: "Radiologic Technologist (ARRT)", examCode: "arrt", slug: "radiologic-technologist" },
  { id: "diagnostic_sonography", label: "Diagnostic Medical Sonographer (ARDMS)", examCode: "ardms", slug: "diagnostic-sonography" },
  { id: "cardiac_sonographer", label: "Cardiac Sonographer (RDCS/RCS)", examCode: "rdcs", slug: "cardiac-sonographer" },
  { id: "occupational_therapy_asst", label: "Occupational Therapy Assistant (COTA)", examCode: "nbcot_cota", slug: "occupational-therapy-assistant" },
  { id: "physical_therapy_asst", label: "Physical Therapy Assistant (PTA)", examCode: "npte_pta", slug: "physiotherapy-assistant" },
  { id: "pharmacy_tech", label: "Pharmacy Technician (PTCB)", examCode: "ptcb", slug: "pharmacy-technician" },
  { id: "surgical_tech", label: "Surgical Technologist (CST)", examCode: "nbstsa_cst", slug: "surgical-technologist" },
  { id: "dental_hygienist", label: "Dental Hygienist (NBDHE)", examCode: "nbdhe", slug: "dental-hygienist" },
  { id: "dietitian", label: "Registered Dietitian (RD/CDR)", examCode: "cdr_rd", slug: "dietitian" },
  { id: "social_worker", label: "Social Worker (ASWB)", examCode: "aswb", slug: "social-worker" },
] as const;

export const CERTIFICATION_PREP_EXAMS = [
  { id: "cert_acls", label: "ACLS (Advanced Cardiovascular Life Support)", examCode: "acls", focus: "Cardiac arrest algorithms, arrhythmia management, post-cardiac arrest care, team dynamics." },
  { id: "cert_bls", label: "BLS (Basic Life Support)", examCode: "bls", focus: "CPR technique, AED use, choking management, rescue breathing for adults, children, and infants." },
  { id: "cert_pals", label: "PALS (Pediatric Advanced Life Support)", examCode: "pals", focus: "Pediatric cardiac arrest, respiratory emergencies, shock management, weight-based drug dosing." },
  { id: "cert_nrp", label: "NRP (Neonatal Resuscitation Program)", examCode: "nrp", focus: "Neonatal resuscitation algorithm, initial steps, positive pressure ventilation, chest compressions, medications." },
  { id: "cert_ccrn", label: "CCRN (Critical Care Registered Nurse)", examCode: "ccrn", focus: "Critical care nursing, hemodynamic monitoring, mechanical ventilation, vasoactive medications, multi-organ failure." },
  { id: "cert_cen", label: "CEN (Certified Emergency Nurse)", examCode: "cen", focus: "Emergency nursing, triage, trauma assessment, toxicology, environmental emergencies." },
  { id: "cert_med_surg", label: "Med-Surg Certification (CMSRN)", examCode: "cmsrn", focus: "Medical-surgical nursing, perioperative care, chronic disease management, patient safety." },
  { id: "cert_oncology", label: "Oncology Certification (OCN)", examCode: "ocn", focus: "Cancer pathophysiology, chemotherapy protocols, radiation therapy, oncologic emergencies, palliative care." },
  { id: "cert_wound_care", label: "Wound Care Certification (WCC/CWCN)", examCode: "wcc", focus: "Wound assessment, pressure injury staging, dressing selection, debridement, compression therapy." },
  { id: "cert_infection_control", label: "Infection Control (CIC)", examCode: "cic", focus: "Infection prevention, outbreak investigation, sterilization, surveillance, antimicrobial stewardship." },
  { id: "cert_gerontology", label: "Gerontological Nursing (GERO-BC)", examCode: "gero_bc", focus: "Geriatric syndromes, falls prevention, polypharmacy, dementia care, end-of-life, elder abuse." },
] as const;

export const CONTENT_TYPES = [
  { id: "questions", label: "Exam Questions", icon: "HelpCircle" },
  { id: "flashcards", label: "Flashcards", icon: "Layers" },
  { id: "lessons", label: "Study Lessons", icon: "BookOpen" },
  { id: "blog_articles", label: "Blog Articles", icon: "FileText" },
] as const;

export const QUESTION_FORMATS = [
  { id: "MCQ", label: "Multiple Choice (MCQ)", choiceCount: 4, correctCount: 1 },
  { id: "SATA", label: "Select All That Apply (SATA)", choiceCount: "5-8", correctCount: "2-5" },
  { id: "ORDERED", label: "Ordered Response / Prioritization", choiceCount: "4-6", correctCount: "all" },
  { id: "HOTSPOT", label: "Hotspot / Highlight", choiceCount: "N/A", correctCount: "1+" },
  { id: "SCENARIO", label: "Scenario / Case Study", choiceCount: 4, correctCount: 1 },
] as const;

export type TierGroupId = "nursing" | "np_specialty" | "allied_health" | "certification_prep";
export type ContentTypeId = "questions" | "flashcards" | "lessons" | "blog_articles";

export interface TierOption {
  id: string;
  label: string;
  group: TierGroupId;
  examCode: string;
}

export function getAllTierOptions(): TierOption[] {
  const options: TierOption[] = [];

  for (const t of NURSING_TIERS) {
    options.push({ id: t.id, label: t.label, group: "nursing", examCode: t.examCode });
  }
  for (const s of NP_SPECIALTIES) {
    options.push({ id: s.id, label: s.label, group: "np_specialty", examCode: s.examCode });
  }
  for (const p of ALLIED_HEALTH_PROFESSIONS) {
    options.push({ id: p.id, label: p.label, group: "allied_health", examCode: p.examCode });
  }
  for (const e of CERTIFICATION_PREP_EXAMS) {
    options.push({ id: e.id, label: e.label, group: "certification_prep", examCode: e.examCode });
  }

  return options;
}

export function getTierLabel(tierId: string): string {
  const all = getAllTierOptions();
  return all.find(t => t.id === tierId)?.label || tierId;
}

export function getTierGroup(tierId: string): TierGroupId | null {
  const all = getAllTierOptions();
  return all.find(t => t.id === tierId)?.group || null;
}

export function getAlliedHealthSlug(professionId: string): string | null {
  const prof = ALLIED_HEALTH_PROFESSIONS.find(p => p.id === professionId);
  return prof?.slug || null;
}

export const BLOG_TEMPLATES = {
  allied_health: [
    { id: "career_guide", label: "Career Guide", minWords: 1200, maxWords: 2000 },
    { id: "exam_prep", label: "Exam Preparation Guide", minWords: 1500, maxWords: 2000 },
    { id: "salary_guide", label: "Salary & Job Outlook Guide", minWords: 1200, maxWords: 1800 },
    { id: "day_in_life", label: "Day in the Life", minWords: 1200, maxWords: 1800 },
  ],
  new_grad: [
    { id: "career_guidance", label: "Career Guidance", minWords: 1200, maxWords: 2000 },
    { id: "interview_prep", label: "Interview Preparation", minWords: 1200, maxWords: 2000 },
    { id: "resume_advice", label: "Resume & Cover Letter Advice", minWords: 1200, maxWords: 1800 },
    { id: "transition", label: "Student-to-Professional Transition", minWords: 1200, maxWords: 2000 },
  ],
} as const;

export const LESSON_SECTIONS = [
  "definition",
  "pathophysiology",
  "risk_factors",
  "clinical_manifestations",
  "diagnostics",
  "treatment",
  "nursing_interventions",
  "exam_tips",
] as const;

export const GENERATION_DEFAULTS = {
  batchSize: { default: 10, max: 25 },
  dailyCaps: {
    questions: 2000,
    flashcards: 2000,
    lessons: 20,
    blog_articles: 10,
  },
} as const;
