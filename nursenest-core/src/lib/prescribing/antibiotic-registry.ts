import type {
  AntibioticCoverageProfile,
  PrescribingDomain
} from "./types";

export const PRESCRIBING_DOMAINS: PrescribingDomain[] = [
  {
    slug: "foundations",
    title: "Foundations of Prescribing",
    description:
      "Core clinical prescribing frameworks for nurse practitioners.",
    modules: [
      {
        slug: "renal-dosing",
        title: "Renal Dosing",
        summary: "Dose adjustment and nephrotoxic prescribing safety.",
        premium: false,
        estimatedMinutes: 35
      },
      {
        slug: "qt-prolongation",
        title: "QT Prolongation",
        summary: "Recognize high-risk medication combinations.",
        premium: false,
        estimatedMinutes: 28
      }
    ]
  },
  {
    slug: "antibiotic-stewardship",
    title: "Antibiotic Stewardship",
    description:
      "Coverage-based antimicrobial reasoning and escalation/de-escalation.",
    modules: [
      {
        slug: "gram-positive-vs-negative",
        title: "Gram Positive vs Gram Negative",
        summary: "Clinically relevant organism differentiation.",
        premium: false,
        estimatedMinutes: 45
      },
      {
        slug: "pseudomonas-coverage",
        title: "Pseudomonas Coverage",
        summary: "High-risk broad-spectrum prescribing decisions.",
        premium: true,
        estimatedMinutes: 55
      }
    ]
  }
];

export const ANTIBIOTIC_REGISTRY: AntibioticCoverageProfile[] = [
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    className: "Aminopenicillin",
    routes: ["PO"],
    gramPositive: "strong",
    gramNegative: "moderate",
    anaerobes: "weak",
    atypicals: "none",
    mrsa: false,
    pseudomonas: false,
    pregnancyConsideration: "generally-safe",
    renalAdjustment: true,
    stewardshipNote:
      "Avoid unnecessary escalation when narrow-spectrum coverage is appropriate.",
    commonUses: ["otitis media", "strep pharyngitis", "community infections"],
    avoidWhen: ["suspected MRSA", "pseudomonas risk"]
  },
  {
    id: "piperacillin-tazobactam",
    name: "Piperacillin-Tazobactam",
    className: "Extended-spectrum penicillin",
    routes: ["IV"],
    gramPositive: "moderate",
    gramNegative: "strong",
    anaerobes: "strong",
    atypicals: "none",
    mrsa: false,
    pseudomonas: true,
    pregnancyConsideration: "case-by-case",
    renalAdjustment: true,
    stewardshipNote:
      "Reserve for high-risk or severe infections to reduce resistance pressure.",
    commonUses: ["sepsis", "complicated intra-abdominal infection"],
    avoidWhen: ["simple outpatient infections"]
  },
  {
    id: "vancomycin",
    name: "Vancomycin",
    className: "Glycopeptide",
    routes: ["IV", "PO"],
    gramPositive: "strong",
    gramNegative: "none",
    anaerobes: "none",
    atypicals: "none",
    mrsa: true,
    pseudomonas: false,
    pregnancyConsideration: "case-by-case",
    renalAdjustment: true,
    stewardshipNote:
      "Monitor levels and avoid unnecessary MRSA overcoverage.",
    commonUses: ["MRSA", "severe gram positive infections"],
    avoidWhen: ["low-risk nonpurulent cellulitis"]
  }
];
