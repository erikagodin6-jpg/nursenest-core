import type {
  OrganismCoverageTarget,
  OrganismMatchPrompt
} from "./organism-coverage-types";

export const ORGANISM_COVERAGE_TARGETS: OrganismCoverageTarget[] = [
  {
    id: "mrsa",
    name: "MRSA",
    category: "gram-positive",
    commonSyndromes: ["purulent cellulitis", "abscess", "severe SSTI"],
    coveragePearl:
      "Purulence and prior beta-lactam failure increase suspicion for MRSA."
  },
  {
    id: "pseudomonas",
    name: "Pseudomonas aeruginosa",
    category: "gram-negative",
    commonSyndromes: ["ventilator-associated pneumonia", "high-risk sepsis"],
    coveragePearl:
      "Do not reflexively cover pseudomonas in routine outpatient infections."
  },
  {
    id: "atypicals",
    name: "Atypical Pneumonia Organisms",
    category: "atypical",
    commonSyndromes: ["community-acquired pneumonia"],
    coveragePearl:
      "Beta-lactams alone do not adequately cover atypicals."
  }
];

export const ORGANISM_MATCH_PROMPTS: OrganismMatchPrompt[] = [
  {
    id: "mrsa-outpatient",
    organismId: "mrsa",
    prompt:
      "A patient presents with purulent cellulitis after recent beta-lactam exposure. Which therapy best targets the likely organism?",
    correctAntibioticIds: ["tmp-smx", "doxycycline", "vancomycin"],
    unsafeAntibioticIds: ["amoxicillin"],
    rationale:
      "Purulence and prior beta-lactam exposure increase concern for MRSA."
  },
  {
    id: "pseudomonas-overuse",
    organismId: "pseudomonas",
    prompt:
      "Which prescribing approach demonstrates poor stewardship in uncomplicated outpatient sinusitis?",
    correctAntibioticIds: ["avoid-pseudomonas-coverage"],
    unsafeAntibioticIds: ["cefepime", "piperacillin-tazobactam"],
    rationale:
      "Broad antipseudomonal coverage is inappropriate in routine outpatient sinusitis."
  }
];
