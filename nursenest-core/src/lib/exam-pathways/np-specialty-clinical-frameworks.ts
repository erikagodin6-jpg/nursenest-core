export type NpSpecialtyFramework = {
  specialty: string;
  currentReadinessEstimate: string;
  targetReadinessEstimate: string;
  coreCompetencies: readonly string[];
  longitudinalSimulationPriorities: readonly string[];
  prescribingFocusAreas: readonly string[];
  escalationSignals: readonly string[];
};

/**
 * Unified specialty maturity framework.
 *
 * Goal:
 * Bring all NP specialties toward the same operational maturity level
 * as the CNPLE flagship pathway.
 */
export const NP_SPECIALTY_CLINICAL_FRAMEWORKS: readonly NpSpecialtyFramework[] = [
  {
    specialty: 'FNP / AANP',
    currentReadinessEstimate: '78-84%',
    targetReadinessEstimate: '92-95%',
    coreCompetencies: [
      'Primary-care continuity',
      'Chronic disease progression',
      'Preventive screening',
      'Women\'s health management',
      'Pediatric outpatient care',
    ],
    longitudinalSimulationPriorities: [
      'Diabetes progression',
      'Hypertension escalation',
      'Preventive follow-up',
      'Medication titration continuity',
    ],
    prescribingFocusAreas: [
      'Antibiotic stewardship',
      'Chronic disease medication escalation',
      'Monitoring intervals',
      'Contraindication screening',
    ],
    escalationSignals: [
      'Delayed referral',
      'Unsafe follow-up planning',
      'Preventive care omission',
    ],
  },
  {
    specialty: 'PMHNP',
    currentReadinessEstimate: '58-70%',
    targetReadinessEstimate: '90-93%',
    coreCompetencies: [
      'Psychopharmacology',
      'Suicide-risk assessment',
      'Therapeutic communication',
      'Longitudinal psychiatric follow-up',
      'Crisis stabilization',
    ],
    longitudinalSimulationPriorities: [
      'Mood disorder progression',
      'Medication adherence decline',
      'Substance-use relapse',
      'Psychiatric crisis escalation',
    ],
    prescribingFocusAreas: [
      'Antipsychotic monitoring',
      'Mood stabilizer safety',
      'Polypharmacy interactions',
      'Medication adherence counseling',
    ],
    escalationSignals: [
      'Suicide-risk misses',
      'Psychosis escalation delay',
      'Unsafe psychopharmacology',
    ],
  },
  {
    specialty: 'AGACNP',
    currentReadinessEstimate: '55-68%',
    targetReadinessEstimate: '90-92%',
    coreCompetencies: [
      'Hemodynamic reasoning',
      'Ventilator interpretation',
      'Critical-care escalation',
      'Shock recognition',
      'Acute instability prioritization',
    ],
    longitudinalSimulationPriorities: [
      'Sepsis deterioration',
      'Ventilator adjustment progression',
      'Multi-organ failure escalation',
      'ICU instability monitoring',
    ],
    prescribingFocusAreas: [
      'Vasoactive medication titration',
      'Sedation safety',
      'Renal dosing in critical illness',
      'Antimicrobial escalation',
    ],
    escalationSignals: [
      'Delayed ICU escalation',
      'Hemodynamic instability misses',
      'Unsafe ventilator management',
    ],
  },
  {
    specialty: 'PNP',
    currentReadinessEstimate: '65-74%',
    targetReadinessEstimate: '90-93%',
    coreCompetencies: [
      'Developmental assessment',
      'Family-centered care',
      'Pediatric prioritization',
      'Pediatric pharmacology',
      'Growth and progression monitoring',
    ],
    longitudinalSimulationPriorities: [
      'Pediatric asthma progression',
      'Fever escalation',
      'Caregiver adherence challenges',
      'Developmental follow-up continuity',
    ],
    prescribingFocusAreas: [
      'Weight-based dosing',
      'Pediatric antibiotic stewardship',
      'Caregiver medication education',
      'Adverse pediatric reactions',
    ],
    escalationSignals: [
      'Pediatric deterioration misses',
      'Delayed emergency referral',
      'Unsafe pediatric dosing',
    ],
  },
  {
    specialty: 'WHNP',
    currentReadinessEstimate: '62-72%',
    targetReadinessEstimate: '90-94%',
    coreCompetencies: [
      'Prenatal continuity',
      'Reproductive endocrinology',
      'Contraceptive management',
      'Gynecologic assessment',
      'Menopausal care',
    ],
    longitudinalSimulationPriorities: [
      'Prenatal hypertension progression',
      'Contraceptive follow-up',
      'Abnormal uterine bleeding workup',
      'Fertility management continuity',
    ],
    prescribingFocusAreas: [
      'Hormonal therapy safety',
      'Prenatal medication counseling',
      'Contraceptive contraindications',
      'Menopause pharmacotherapy',
    ],
    escalationSignals: [
      'Preeclampsia escalation delay',
      'Unsafe hormonal prescribing',
      'Gynecologic red-flag misses',
    ],
  },
] as const;
