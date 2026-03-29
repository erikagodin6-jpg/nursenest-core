import type { LucideIcon } from "lucide-react";

export interface SiloSection {
  title: string;
  lessons: string[];
}

export interface SiloInternalLink {
  label: string;
  href: string;
}

export interface SiloConfig {
  examSlug: string;
  tier: string;
  questionBankTierFilter: string;
  lessonSections: SiloSection[];
  internalLinks: SiloInternalLink[];
  pharmSystems: string[];
  showFlashcards: boolean;
}

export const SILO_CONFIGS: Record<string, SiloConfig> = {
  "nclex-rn": {
    examSlug: "nclex-rn",
    tier: "rn",
    questionBankTierFilter: "rn",
    lessonSections: [
      {
        title: "Cardiovascular",
        lessons: [
          "cardiovascular-rn", "mi-management", "hf-advanced", "cardiac-rhythm-rn",
          "cardiac-auscultation-rn", "cardiogenic-shock", "pe-dvt", "aortic-dissection",
          "rn-testbank-cardiovascular",
        ],
      },
      {
        title: "Respiratory",
        lessons: [
          "respiratory-rn", "copd-exacerbation-np", "pe-recognition",
          "rn-testbank-respiratory",
        ],
      },
      {
        title: "Neurological",
        lessons: [
          "stroke", "rn-testbank-neuro",
        ],
      },
      {
        title: "Critical Care & Emergency",
        lessons: [
          "shock-syndromes", "sepsis-mastery", "burn-management",
          "compartment-syndrome", "malignant-hyperthermia", "rn-testbank-critical-care",
        ],
      },
      {
        title: "Pharmacology",
        lessons: [
          "iv-therapy", "medication-administration-safety",
          "rn-testbank-pharmacology",
        ],
      },
      {
        title: "Maternal-Child",
        lessons: [
          "preeclampsia-management", "postpartum-hemorrhage-rn", "gestational-diabetes-rn",
          "rn-testbank-maternal-child",
        ],
      },
    ],
    internalLinks: [
      { label: "NCLEX-RN Test Bank", href: "/free-practice" },
      { label: "Timed Mock Exams", href: "/mock-exams" },
      { label: "Question of the Day", href: "/question-of-the-day" },
      { label: "Clinical Lessons", href: "/lessons" },
      { label: "Flashcard Study Decks", href: "/flashcards" },
      { label: "Printable Exam Packs", href: "/shop" },
      { label: "Lab Values Reference", href: "/lab-values" },
      { label: "Med Math Calculator", href: "/med-math" },
      { label: "Clinical Case Simulations", href: "/case-simulations" },
      { label: "Medication Mastery Engine", href: "/medication-mastery" },
      { label: "Blood Transfusion Simulator", href: "/blood-transfusion-simulator" },
      { label: "Electrolyte & ABG Simulator", href: "/electrolyte-abg-simulator" },
      { label: "Deteriorating Patient Simulator", href: "/deteriorating-patient-simulator" },
      { label: "First Action Simulator", href: "/first-action-simulator" },
      { label: "IV Complications Simulator", href: "/iv-complications-simulator" },
      { label: "Clinical Clarity Topics", href: "/clinical-clarity" },
      { label: "Anatomy Explorer", href: "/anatomy" },
      { label: "Video Lectures", href: "/lectures" },
      { label: "Study Pricing Plans", href: "/pricing" },
      { label: "Why Does Potassium Affect the Heart?", href: "/clinical-clarity/why-does-potassium-affect-the-heart" },
      { label: "Why Does Blood Pressure Drop During Sepsis?", href: "/clinical-clarity/why-does-blood-pressure-drop-during-sepsis" },
      { label: "Why Does DKA Cause Fruity Breath?", href: "/clinical-clarity/why-does-dka-cause-fruity-breath" },
    ],
    pharmSystems: ["Cardiovascular", "Respiratory", "Neurological", "Endocrine", "Renal", "Hematology", "GI", "Psychiatry"],
    showFlashcards: true,
  },
  "nclex-pn": {
    examSlug: "nclex-pn",
    tier: "rpn",
    questionBankTierFilter: "rpn",
    lessonSections: [
      {
        title: "Cardiovascular",
        lessons: [
          "cardiovascular-rpn", "chf-basics", "mi-acute", "hypertension-management",
          "cardiac-monitoring", "rpn-testbank-cardiovascular",
        ],
      },
      {
        title: "Respiratory",
        lessons: [
          "copd-basics-rpn", "asthma-basics-rpn", "pneumonia-basics-rpn",
          "rpn-testbank-respiratory",
        ],
      },
      {
        title: "Neurological & Endocrine",
        lessons: [
          "rpn-testbank-neuro", "rpn-testbank-endocrine", "hypothyroidism-basics",
          "siadh-di", "adrenal-insufficiency",
        ],
      },
      {
        title: "Renal & Safety",
        lessons: [
          "rpn-testbank-renal", "rpn-testbank-safety",
        ],
      },
      {
        title: "Maternity & Mental Health",
        lessons: [
          "rpn-testbank-maternity", "rpn-testbank-mental-health",
        ],
      },
    ],
    internalLinks: [
      { label: "NCLEX-PN Test Bank", href: "/free-practice" },
      { label: "Timed Mock Exams", href: "/mock-exams" },
      { label: "Question of the Day", href: "/question-of-the-day" },
      { label: "Clinical Lessons", href: "/lessons" },
      { label: "Flashcard Study Decks", href: "/flashcards" },
      { label: "Printable Study Packs", href: "/shop" },
      { label: "Lab Values Reference", href: "/lab-values" },
      { label: "Med Math Calculator", href: "/med-math" },
      { label: "Medication Mastery Engine", href: "/medication-mastery" },
      { label: "Clinical Case Simulations", href: "/case-simulations" },
      { label: "Anatomy Explorer", href: "/anatomy" },
      { label: "Pre-Nursing Foundations", href: "/pre-nursing" },
      { label: "Clinical Clarity Topics", href: "/clinical-clarity" },
      { label: "Video Lectures", href: "/lectures" },
      { label: "Study Pricing Plans", href: "/pricing" },
      { label: "Why Do Opioids Cause Constipation?", href: "/clinical-clarity/why-do-opioids-cause-constipation" },
      { label: "Why Does Dehydration Cause Confusion?", href: "/clinical-clarity/why-does-dehydration-cause-confusion" },
    ],
    pharmSystems: ["Cardiovascular", "Respiratory", "Endocrine", "GI", "Pharmacology"],
    showFlashcards: true,
  },
  "rex-pn": {
    examSlug: "rex-pn",
    tier: "rpn",
    questionBankTierFilter: "rpn",
    lessonSections: [
      {
        title: "Cardiovascular",
        lessons: [
          "cardiovascular-rpn", "chf-basics", "mi-acute", "hypertension-management",
          "cardiac-monitoring", "rpn-testbank-cardiovascular",
        ],
      },
      {
        title: "Respiratory",
        lessons: [
          "copd-basics-rpn", "asthma-basics-rpn", "pneumonia-basics-rpn",
          "rpn-testbank-respiratory",
        ],
      },
      {
        title: "Neurological & Endocrine",
        lessons: [
          "rpn-testbank-neuro", "rpn-testbank-endocrine", "hypothyroidism-basics",
          "siadh-di", "adrenal-insufficiency",
        ],
      },
      {
        title: "Renal & Safety",
        lessons: [
          "rpn-testbank-renal", "rpn-testbank-safety",
        ],
      },
      {
        title: "Maternity & Mental Health",
        lessons: [
          "rpn-testbank-maternity", "rpn-testbank-mental-health",
        ],
      },
    ],
    internalLinks: [
      { label: "REx-PN Test Bank", href: "/free-practice" },
      { label: "Timed Mock Exams", href: "/mock-exams" },
      { label: "Question of the Day", href: "/question-of-the-day" },
      { label: "Clinical Lessons", href: "/lessons" },
      { label: "Flashcard Study Decks", href: "/flashcards" },
      { label: "Printable Exam Packs", href: "/shop" },
      { label: "Lab Values Reference", href: "/lab-values" },
      { label: "Med Math Calculator", href: "/med-math" },
      { label: "Medication Mastery Engine", href: "/medication-mastery" },
      { label: "Clinical Case Simulations", href: "/case-simulations" },
      { label: "Anatomy Explorer", href: "/anatomy" },
      { label: "Pre-Nursing Foundations", href: "/pre-nursing" },
      { label: "Clinical Clarity Topics", href: "/clinical-clarity" },
      { label: "Video Lectures", href: "/lectures" },
      { label: "Study Pricing Plans", href: "/pricing" },
      { label: "Diagnostic Assessment", href: "/diagnostic-assessment" },
      { label: "Why Does Heart Failure Cause Edema?", href: "/clinical-clarity/why-does-heart-failure-cause-edema" },
    ],
    pharmSystems: ["Cardiovascular", "Respiratory", "Endocrine", "GI", "Pharmacology"],
    showFlashcards: true,
  },
  "np": {
    examSlug: "np",
    tier: "np",
    questionBankTierFilter: "np",
    lessonSections: [
      {
        title: "Advanced Assessment",
        lessons: [
          "np-testbank-advanced-assessment", "comprehensive-hpi-np",
          "differential-diagnosis-np", "ecg-advanced-np", "sofa-apache-np",
          "point-of-care-us-np",
        ],
      },
      {
        title: "Cardiovascular",
        lessons: [
          "cardiovascular-np", "mi-management-np", "pe-recognition",
          "infective-endocarditis", "peripheral-artery-disease",
        ],
      },
      {
        title: "Emergency & Critical Care",
        lessons: [
          "np-testbank-emergency-management", "shock-syndromes-np",
          "sepsis-mastery-np", "aaa-rupture-np", "dka-hhns-np",
          "increased-icp-np", "tumor-lysis-np",
        ],
      },
      {
        title: "Prescribing & Pharmacology",
        lessons: [
          "np-testbank-prescribing", "np-testbank-differential-diagnosis",
        ],
      },
      {
        title: "Maternal & Neonatal",
        lessons: [
          "hellp-syndrome-np", "eclampsia-np", "obstetric-hemorrhage-np",
          "amniotic-fluid-embolism-np", "neonatal-rds-np", "neonatal-hie-np",
          "persistent-pulm-htn-np", "neonatal-abstinence-np",
        ],
      },
      {
        title: "Procedures",
        lessons: [
          "central-line-np", "lumbar-puncture-np", "abg-sampling-np",
          "mechanical-vent-np",
        ],
      },
    ],
    internalLinks: [
      { label: "NP Test Bank", href: "/free-practice" },
      { label: "Timed Mock Exams", href: "/mock-exams" },
      { label: "Question of the Day", href: "/question-of-the-day" },
      { label: "NP Clinical Lessons", href: "/lessons" },
      { label: "Study Flashcards", href: "/flashcards" },
      { label: "NP Study Packs", href: "/shop" },
      { label: "NP Exam Prep Hub", href: "/np-exam-prep" },
      { label: "Lab Values Reference", href: "/lab-values" },
      { label: "Clinical Case Simulations", href: "/case-simulations" },
      { label: "Medication Mastery Engine", href: "/medication-mastery" },
      { label: "Electrolyte & ABG Simulator", href: "/electrolyte-abg-simulator" },
      { label: "Clinical Clarity Topics", href: "/clinical-clarity" },
      { label: "Anatomy Explorer", href: "/anatomy" },
      { label: "Video Lectures", href: "/lectures" },
      { label: "Study Pricing Plans", href: "/pricing" },
      { label: "Diagnostic Assessment", href: "/diagnostic-assessment" },
      { label: "Why Does Preeclampsia Cause Seizures?", href: "/clinical-clarity/why-does-preeclampsia-cause-seizures" },
      { label: "Why Does Liver Failure Cause Bleeding?", href: "/clinical-clarity/why-does-liver-failure-cause-bleeding" },
      { label: "Why Does Insulin Cause Hypokalemia?", href: "/clinical-clarity/why-does-insulin-cause-hypokalemia" },
    ],
    pharmSystems: ["Cardiovascular", "Respiratory", "Neurological", "Endocrine", "Renal", "GI", "Psychiatry", "Hematology", "Infectious Disease", "Women's Health"],
    showFlashcards: false,
  },
};
