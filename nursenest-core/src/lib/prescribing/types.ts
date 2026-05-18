export type CoverageStrength = "none" | "weak" | "moderate" | "strong";

export type RouteOfAdministration = "PO" | "IV" | "IM" | "topical";

export interface AntibioticCoverageProfile {
  id: string;
  name: string;
  className: string;
  routes: RouteOfAdministration[];
  gramPositive: CoverageStrength;
  gramNegative: CoverageStrength;
  anaerobes: CoverageStrength;
  atypicals: CoverageStrength;
  mrsa: boolean;
  pseudomonas: boolean;
  pregnancyConsideration: "generally-safe" | "avoid" | "case-by-case";
  renalAdjustment: boolean;
  stewardshipNote: string;
  commonUses: string[];
  avoidWhen: string[];
}

export interface PrescribingDomainModule {
  slug: string;
  title: string;
  summary: string;
  premium: boolean;
  estimatedMinutes: number;
}

export interface PrescribingDomain {
  slug: string;
  title: string;
  description: string;
  modules: PrescribingDomainModule[];
}

export interface CellulitisAssessmentInput {
  purulent: boolean;
  systemicSymptoms: boolean;
  diabetesOrVascularDisease: boolean;
  mrsaRisk: boolean;
  severeBetaLactamAllergy: boolean;
  pregnant: boolean;
  renalImpairment: boolean;
}

export interface PrescribingRecommendation {
  acuity: "self-limited" | "outpatient" | "urgent" | "emergent";
  firstLine: string[];
  alternatives: string[];
  avoid: string[];
  rationale: string[];
  monitoring: string[];
  escalationTriggers: string[];
  stewardshipScore: number;
}
