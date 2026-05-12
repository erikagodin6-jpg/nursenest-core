export type AuthorityResourcePage = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  cluster: "cnple" | "rex-pn" | "respiratory-therapy" | "ecg";
  eyebrow: string;
  lead: string;
  sections: readonly { heading: string; items: readonly string[] }[];
  table: {
    caption: string;
    columns: readonly string[];
    rows: readonly (readonly string[])[];
  };
  internalLinks: readonly { label: string; href: string }[];
  faq: readonly { question: string; answer: string }[];
};

function resourcePath(slug: string): string {
  return `/resources/${slug}`;
}

export const AUTHORITY_RESOURCE_PAGES: readonly AuthorityResourcePage[] = [
  {
    slug: "cnple-study-checklist",
    path: resourcePath("cnple-study-checklist"),
    title: "CNPLE Study Checklist: Printable NP Exam Prep Planner | NurseNest",
    description:
      "Use this printable CNPLE study checklist to plan diagnostics, prescribing review, case-based practice, LOFT simulation, and final remediation.",
    h1: "CNPLE study checklist",
    cluster: "cnple",
    eyebrow: "Printable study asset",
    lead:
      "This checklist turns CNPLE preparation into a visible workflow: diagnose weak areas, review Canadian NP content, practise case-based questions, simulate LOFT pacing, and repair repeated errors before exam day.",
    sections: [
      { heading: "Before you begin", items: ["Confirm current regulator and exam-administrator requirements.", "Block study time for questions, lessons, rationales, and simulation.", "Create a miss log with columns for cue, risk, action, and follow-up."] },
      { heading: "Weekly review", items: ["Complete at least one mixed question block.", "Review prescribing safety screens and contraindications.", "Retest missed concepts within 48 hours."] },
      { heading: "Final week", items: ["Run one timed LOFT-style session.", "Review only high-yield misses and safety rules.", "Prepare exam-day documents, route, and pacing plan."] },
    ],
    table: {
      caption: "CNPLE checklist sections",
      columns: ["Checklist area", "Why it matters", "Related NurseNest page"],
      rows: [
        ["Case-based reasoning", "Builds advanced-practice decision flow", "CNPLE case-based questions"],
        ["Pharmacology", "Protects prescribing and monitoring decisions", "CNPLE pharmacology questions"],
        ["LOFT pacing", "Trains fixed-length exam stamina", "CNPLE exam format"],
      ],
    },
    internalLinks: [
      { label: "CNPLE study plan", href: "/canada/np/cnple/study-plan" },
      { label: "CNPLE practice questions", href: "/canada/np/cnple/practice-questions" },
      { label: "CNPLE exam format", href: "/canada/np/cnple/exam-format" },
    ],
    faq: [
      { question: "Can I save this checklist as a PDF?", answer: "Yes. The page is print-friendly, so learners can use the browser print dialog to save it as a PDF or print it for weekly review." },
      { question: "How often should I update my CNPLE checklist?", answer: "Update it weekly after reviewing missed questions. The checklist should reflect actual weak areas, not a static list of topics." },
    ],
  },
  {
    slug: "rex-pn-study-plan",
    path: resourcePath("rex-pn-study-plan"),
    title: "REx-PN Study Plan: Printable Client Needs Planner | NurseNest",
    description:
      "Use this printable REx-PN study plan to organize client needs review, CAT practice, pharmacology, priority questions, and final remediation.",
    h1: "REx-PN study plan printable",
    cluster: "rex-pn",
    eyebrow: "Printable study asset",
    lead:
      "This REx-PN plan helps practical nursing candidates turn client-needs categories into weekly study blocks with targeted remediation, CAT simulation, and repeated-error cleanup.",
    sections: [
      { heading: "Diagnostic week", items: ["Complete a mixed client-needs block.", "Sort misses by category and decision error.", "Choose the first two weak categories to repair."] },
      { heading: "Remediation weeks", items: ["Alternate lessons with targeted question blocks.", "Add pharmacology, priority, and delegation drills.", "Use flashcards for repeated safety cues."] },
      { heading: "CAT readiness", items: ["Run CAT-style sessions after remediation.", "Track repeated miss patterns rather than one score.", "Keep final review focused and measurable."] },
    ],
    table: {
      caption: "REx-PN study plan sections",
      columns: ["Plan area", "Study goal", "Related NurseNest page"],
      rows: [
        ["Priority", "Choose safest first action", "REx-PN priority questions"],
        ["Delegation", "Match task, client stability, and scope", "REx-PN delegation questions"],
        ["CAT", "Build adaptive testing discipline", "REx-PN CAT simulation"],
      ],
    },
    internalLinks: [
      { label: "REx-PN study plan", href: "/canada/rpn/rex-pn/study-plan" },
      { label: "REx-PN practice questions", href: "/canada/rpn/rex-pn/practice-questions" },
      { label: "REx-PN CAT simulation", href: "/canada/rpn/rex-pn/cat-simulation" },
    ],
    faq: [
      { question: "How long should a REx-PN study plan be?", answer: "Many learners use 6 to 10 weeks, but the right length depends on baseline diagnostic performance, available time, and repeated miss patterns." },
      { question: "Should CAT practice start immediately?", answer: "Use CAT practice after some targeted remediation so the session measures readiness instead of avoidable content gaps." },
    ],
  },
  {
    slug: "abg-interpretation-cheat-sheet",
    path: resourcePath("abg-interpretation-cheat-sheet"),
    title: "ABG Interpretation Cheat Sheet for RT Students | NurseNest",
    description:
      "A print-friendly ABG interpretation cheat sheet covering pH, PaCO2, HCO3, compensation, oxygenation, and next-step decisions.",
    h1: "ABG interpretation cheat sheet",
    cluster: "respiratory-therapy",
    eyebrow: "Backlinkable RT asset",
    lead:
      "This ABG cheat sheet gives RT learners a compact interpretation sequence: classify acid-base status, identify the primary driver, assess compensation, evaluate oxygenation, then choose the safest next action.",
    sections: [
      { heading: "ABG sequence", items: ["Check pH first.", "Compare PaCO2 and HCO3.", "Assess compensation.", "Evaluate PaO2, SpO2, and FiO2 requirement.", "Connect the result to clinical status."] },
      { heading: "Clinical cautions", items: ["Do not treat the number without assessing the patient.", "Rising PaCO2 plus altered mental status is dangerous.", "Compensation does not automatically mean no intervention is needed."] },
    ],
    table: {
      caption: "ABG quick interpretation table",
      columns: ["Pattern", "Likely driver", "Clinical question"],
      rows: [
        ["Low pH + high PaCO2", "Respiratory acidosis", "Does the patient need ventilatory support?"],
        ["High pH + low PaCO2", "Respiratory alkalosis", "Is pain, anxiety, hypoxemia, or sepsis driving hyperventilation?"],
        ["Low pH + low HCO3", "Metabolic acidosis", "Is shock, renal failure, DKA, or lactic acidosis present?"],
      ],
    },
    internalLinks: [
      { label: "ABG practice questions", href: "/allied-health/respiratory-therapy/abg-practice-questions" },
      { label: "Oxygen therapy questions", href: "/allied-health/respiratory-therapy/oxygen-therapy-questions" },
      { label: "ARDS review", href: "/allied-health/respiratory-therapy/ards-review" },
    ],
    faq: [
      { question: "What is the first step in ABG interpretation?", answer: "Start with pH to determine acidemia or alkalemia, then compare PaCO2 and HCO3 to identify the primary process." },
      { question: "Why include oxygenation after acid-base interpretation?", answer: "A correct acid-base label is incomplete if the patient is hypoxemic, tiring, or needs escalation in oxygen or ventilatory support." },
    ],
  },
  {
    slug: "ventilator-modes-quick-reference",
    path: resourcePath("ventilator-modes-quick-reference"),
    title: "Ventilator Modes Quick Reference for RT Students | NurseNest",
    description:
      "A mobile and print-friendly ventilator modes quick reference covering volume control, pressure control, SIMV, pressure support, CPAP, and BiPAP.",
    h1: "Ventilator modes quick reference",
    cluster: "respiratory-therapy",
    eyebrow: "Backlinkable RT asset",
    lead:
      "This quick reference helps RT learners compare common ventilator modes by what is controlled, what varies, what to monitor, and which patient changes require reassessment.",
    sections: [
      { heading: "How to use it", items: ["Identify what the ventilator controls.", "Predict what variable will change with lung mechanics.", "Connect alarms and waveforms to patient assessment."] },
      { heading: "Safety checks", items: ["Monitor plateau pressure and driving pressure trends.", "Reassess oxygenation after PEEP changes.", "Check synchrony before blaming the mode."] },
    ],
    table: {
      caption: "Ventilator modes at a glance",
      columns: ["Mode", "Controlled variable", "Watch for"],
      rows: [
        ["Volume control", "Tidal volume", "High pressure with poor compliance or obstruction"],
        ["Pressure control", "Inspiratory pressure", "Changing tidal volume as compliance changes"],
        ["Pressure support", "Patient-triggered support", "Fatigue, apnea, or poor synchrony"],
      ],
    },
    internalLinks: [
      { label: "Ventilator modes review", href: "/allied-health/respiratory-therapy/ventilator-modes" },
      { label: "Mechanical ventilation questions", href: "/allied-health/respiratory-therapy/mechanical-ventilation-questions" },
      { label: "ARDS review", href: "/allied-health/respiratory-therapy/ards-review" },
    ],
    faq: [
      { question: "What is the difference between volume control and pressure control?", answer: "Volume control sets tidal volume and lets pressure vary; pressure control sets inspiratory pressure and lets tidal volume vary with mechanics." },
      { question: "Which ventilator mode should RT students learn first?", answer: "Start with volume control and pressure control, then add SIMV, pressure support, CPAP, and BiPAP once control variables are clear." },
    ],
  },
  {
    slug: "ecg-interpretation-quick-guide",
    path: resourcePath("ecg-interpretation-quick-guide"),
    title: "ECG Interpretation Quick Guide for Clinical Students | NurseNest",
    description:
      "A print-friendly ECG interpretation quick guide covering rate, rhythm, intervals, QRS width, ischemia clues, and escalation red flags.",
    h1: "ECG interpretation quick guide",
    cluster: "ecg",
    eyebrow: "Clinical readiness asset",
    lead:
      "This quick guide supports ECG interpretation without replacing formal clinical review. Use it to structure rhythm reading: rate, regularity, P waves, PR interval, QRS width, ST-T changes, symptoms, and escalation risk.",
    sections: [
      { heading: "ECG sequence", items: ["Confirm patient and lead quality.", "Assess rate and rhythm regularity.", "Check P waves, PR, and QRS.", "Review ST-T changes with symptoms.", "Escalate unstable rhythms immediately."] },
      { heading: "Red flags", items: ["Chest pain with ST elevation.", "Wide-complex tachycardia with instability.", "Bradycardia with hypotension or altered mentation.", "New rhythm change plus syncope."] },
    ],
    table: {
      caption: "ECG quick review",
      columns: ["Step", "Question", "Why it matters"],
      rows: [
        ["Rate", "Fast, slow, or normal?", "Frames urgency and perfusion risk"],
        ["Regularity", "Regularly regular, irregular, or chaotic?", "Separates sinus, AF, flutter, blocks, and lethal rhythms"],
        ["QRS", "Narrow or wide?", "Suggests supraventricular versus ventricular origin"],
      ],
    },
    internalLinks: [
      { label: "Clinical readiness tools", href: "/tools/lab-values" },
      { label: "CNPLE clinical judgment", href: "/canada/np/cnple/clinical-judgment" },
      { label: "REx-PN priority questions", href: "/canada/rpn/rex-pn/priority-questions" },
    ],
    faq: [
      { question: "Can this ECG guide diagnose a patient?", answer: "No. It is an educational study aid. Clinical ECG interpretation requires patient assessment, local protocols, and qualified clinical review." },
      { question: "What should learners check first on an ECG?", answer: "Confirm patient, lead quality, rate, rhythm regularity, P waves, PR interval, QRS width, and symptoms before interpreting isolated findings." },
    ],
  },
  {
    slug: "pharmacology-mnemonic-sheet",
    path: resourcePath("pharmacology-mnemonic-sheet"),
    title: "Nursing Pharmacology Mnemonic Sheet for Exam Prep | NurseNest",
    description:
      "A print-friendly pharmacology mnemonic sheet for nursing exam prep with safety checks, adverse effects, teaching points, and high-risk medications.",
    h1: "Pharmacology mnemonic sheet",
    cluster: "cnple",
    eyebrow: "Printable study asset",
    lead:
      "This mnemonic sheet keeps pharmacology tied to safety. Use it for medication questions that ask what to check, what to teach, when to hold a dose, and when to escalate.",
    sections: [
      { heading: "Safety screen", items: ["Allergy.", "Indication.", "Dose and route.", "Vitals and labs.", "Pregnancy, renal, and hepatic risks.", "Interactions and duplicate therapy."] },
      { heading: "Teaching screen", items: ["Expected effect.", "Common adverse effects.", "Serious report-now symptoms.", "Monitoring plan.", "Missed dose instructions when appropriate."] },
    ],
    table: {
      caption: "Medication safety mnemonic",
      columns: ["Prompt", "Question to ask", "Exam use"],
      rows: [
        ["AID-VLI", "Allergy, indication, dose, vitals, labs, interactions", "Before giving or prescribing"],
        ["TEACH", "Therapeutic effect, expected side effects, adverse red flags, check-back, hold parameters", "Client education questions"],
        ["STOP", "Symptom severity, timing, objective data, provider/regulator scope", "Hold or escalate decisions"],
      ],
    },
    internalLinks: [
      { label: "CNPLE pharmacology questions", href: "/canada/np/cnple/pharmacology-questions" },
      { label: "REx-PN pharmacology questions", href: "/canada/rpn/rex-pn/pharmacology-questions" },
      { label: "CNPLE practice questions", href: "/canada/np/cnple/practice-questions" },
    ],
    faq: [
      { question: "Are mnemonics enough for pharmacology?", answer: "No. Mnemonics help recall safety screens, but exam success depends on applying them to patient-specific cues and contraindications." },
      { question: "How should I use this sheet?", answer: "Use it after missed medication questions. Identify which safety or teaching check you skipped, then retest with a focused question set." },
    ],
  },
] as const;

const bySlug = new Map(AUTHORITY_RESOURCE_PAGES.map((page) => [page.slug, page]));

export function listAuthorityResourcePages(): readonly AuthorityResourcePage[] {
  return AUTHORITY_RESOURCE_PAGES;
}

export function listAuthorityResourcePaths(): string[] {
  return AUTHORITY_RESOURCE_PAGES.map((page) => page.path);
}

export function getAuthorityResourcePage(slug: string): AuthorityResourcePage | undefined {
  return bySlug.get(slug);
}
