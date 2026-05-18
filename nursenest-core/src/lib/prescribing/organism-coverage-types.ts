export type OrganismCategory =
  | "gram-positive"
  | "gram-negative"
  | "anaerobe"
  | "atypical";

export interface OrganismCoverageTarget {
  id: string;
  name: string;
  category: OrganismCategory;
  commonSyndromes: string[];
  coveragePearl: string;
}

export interface OrganismMatchPrompt {
  id: string;
  organismId: string;
  prompt: string;
  correctAntibioticIds: string[];
  unsafeAntibioticIds: string[];
  rationale: string;
}

export interface OrganismMatchResult {
  correct: boolean;
  selectedAntibioticId: string;
  rationale: string;
  remediationTopic?: string;
}
