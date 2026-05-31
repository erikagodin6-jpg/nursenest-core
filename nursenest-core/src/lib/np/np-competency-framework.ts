import type { NpCertificationTag } from "./np-certification-ecosystem";

export type NpCompetencyDomainId =
  | "advanced-assessment"
  | "clinical-decision-making"
  | "diagnostics"
  | "pharmacology"
  | "health-promotion"
  | "leadership"
  | "professional-practice"
  | "evidence-based-practice"
  | "population-health"
  | "interprofessional-collaboration";

export type NpCompetencyWeight = "core" | "high" | "moderate" | "supporting";

export type NpCompetencyDomain = {
  readonly id: NpCompetencyDomainId;
  readonly title: string;
  readonly description: string;
  readonly sharedCoreTag: "NP_CORE";
};

export type NpCompetencyCrosswalkRow = {
  readonly certification: Exclude<NpCertificationTag, "NP_CORE">;
  readonly weights: Readonly<Record<NpCompetencyDomainId, NpCompetencyWeight>>;
};

export const NP_COMPETENCY_DOMAINS: readonly NpCompetencyDomain[] = [
  { id: "advanced-assessment", title: "Advanced Assessment", description: "Comprehensive and focused assessment across lifespan, acuity, and specialty contexts.", sharedCoreTag: "NP_CORE" },
  { id: "clinical-decision-making", title: "Clinical Decision-Making", description: "Risk stratification, prioritization, differential diagnosis, management, and referral decisions.", sharedCoreTag: "NP_CORE" },
  { id: "diagnostics", title: "Diagnostics", description: "Appropriate diagnostic testing, interpretation, stewardship, and follow-up.", sharedCoreTag: "NP_CORE" },
  { id: "pharmacology", title: "Pharmacology", description: "Prescribing safety, mechanisms, contraindications, monitoring, interactions, and education.", sharedCoreTag: "NP_CORE" },
  { id: "health-promotion", title: "Health Promotion", description: "Prevention, screening, counseling, immunization, and wellness planning.", sharedCoreTag: "NP_CORE" },
  { id: "leadership", title: "Leadership", description: "Quality improvement, systems thinking, clinical leadership, and practice improvement.", sharedCoreTag: "NP_CORE" },
  { id: "professional-practice", title: "Professional Practice", description: "Ethics, legal scope, documentation, role accountability, and regulatory practice.", sharedCoreTag: "NP_CORE" },
  { id: "evidence-based-practice", title: "Evidence-Based Practice", description: "Guideline appraisal, research literacy, and evidence-informed care planning.", sharedCoreTag: "NP_CORE" },
  { id: "population-health", title: "Population Health", description: "Health equity, epidemiology, community needs, and population-level prevention.", sharedCoreTag: "NP_CORE" },
  { id: "interprofessional-collaboration", title: "Interprofessional Collaboration", description: "Team-based care, referral, consultation, handoff, and shared care planning.", sharedCoreTag: "NP_CORE" },
] as const;

const baseWeights: Readonly<Record<NpCompetencyDomainId, NpCompetencyWeight>> = {
  "advanced-assessment": "core",
  "clinical-decision-making": "core",
  diagnostics: "core",
  pharmacology: "core",
  "health-promotion": "high",
  leadership: "moderate",
  "professional-practice": "high",
  "evidence-based-practice": "high",
  "population-health": "moderate",
  "interprofessional-collaboration": "high",
};

export const NP_COMPETENCY_CROSSWALK: readonly NpCompetencyCrosswalkRow[] = [
  { certification: "FNP", weights: { ...baseWeights, "health-promotion": "core", "population-health": "high" } },
  { certification: "AGPCNP", weights: { ...baseWeights, "advanced-assessment": "core", pharmacology: "core", "health-promotion": "moderate" } },
  { certification: "PMHNP", weights: { ...baseWeights, pharmacology: "core", diagnostics: "high", "population-health": "supporting" } },
  { certification: "WHNP", weights: { ...baseWeights, "health-promotion": "core", pharmacology: "high", "population-health": "high" } },
  { certification: "PNP_PC", weights: { ...baseWeights, "health-promotion": "core", pharmacology: "high", "population-health": "high" } },
  { certification: "PNP_AC", weights: { ...baseWeights, "clinical-decision-making": "core", diagnostics: "core", "health-promotion": "supporting" } },
  { certification: "ACNPC_AG", weights: { ...baseWeights, "clinical-decision-making": "core", diagnostics: "core", "health-promotion": "supporting" } },
  { certification: "ENP", weights: { ...baseWeights, "clinical-decision-making": "core", diagnostics: "core", "health-promotion": "supporting" } },
  { certification: "CNPLE", weights: { ...baseWeights, "professional-practice": "core", leadership: "core", "population-health": "core" } },
] as const;

export function validateNpCompetencyFramework(): readonly string[] {
  const issues: string[] = [];
  const domainIds = new Set<NpCompetencyDomainId>();
  for (const domain of NP_COMPETENCY_DOMAINS) {
    if (domainIds.has(domain.id)) issues.push(`Duplicate NP competency domain: ${domain.id}`);
    domainIds.add(domain.id);
    if (domain.sharedCoreTag !== "NP_CORE") issues.push(`${domain.id} must map to NP_CORE`);
  }
  for (const row of NP_COMPETENCY_CROSSWALK) {
    for (const domain of NP_COMPETENCY_DOMAINS) {
      if (!row.weights[domain.id]) issues.push(`${row.certification} missing ${domain.id}`);
    }
  }
  return issues;
}
