export type PlacementReadinessDomain =
  | "clinical_skills"
  | "medication_safety"
  | "documentation"
  | "communication"
  | "professionalism"
  | "assessment"
  | "prioritization";

export type PlacementReadinessInput = Readonly<Record<PlacementReadinessDomain, number>>;

export type PlacementReadinessReport = Readonly<{
  score: number;
  readyForPlacement: boolean;
  weakDomains: readonly PlacementReadinessDomain[];
  requiredRemediation: readonly string[];
}>;

const DOMAIN_LABELS: Record<PlacementReadinessDomain, string> = {
  clinical_skills: "Clinical Skills",
  medication_safety: "Medication Safety",
  documentation: "Documentation",
  communication: "Communication",
  professionalism: "Professionalism",
  assessment: "Assessment",
  prioritization: "Prioritization",
};

export function evaluatePlacementReadiness(input: PlacementReadinessInput): PlacementReadinessReport {
  const entries = Object.entries(input) as [PlacementReadinessDomain, number][];
  const score = Math.round(entries.reduce((sum, [, value]) => sum + value, 0) / entries.length);
  const weakDomains = entries.filter(([, value]) => value < 75).map(([domain]) => domain);

  return {
    score,
    readyForPlacement: score >= 80 && weakDomains.length === 0,
    weakDomains,
    requiredRemediation: weakDomains.map((domain) => `Complete targeted remediation for ${DOMAIN_LABELS[domain]}.`),
  };
}
