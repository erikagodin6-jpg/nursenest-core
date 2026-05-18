export type PrescribingCatDomain =
  | "antibiotic-stewardship"
  | "organism-coverage"
  | "renal-dosing"
  | "culture-interpretation"
  | "prescription-writing"
  | "escalation-recognition";

export interface PrescribingCatItem {
  id: string;
  domain: PrescribingCatDomain;
  difficulty: 1 | 2 | 3 | 4 | 5;
  discrimination: number;
  prompt: string;
  correctOptionId: string;
  optionIds: string[];
  remediationModule: string;
}

export interface PrescribingCatState {
  learnerId: string;
  answeredItemIds: string[];
  estimatedAbility: number;
  weakDomains: PrescribingCatDomain[];
}

export interface PrescribingCatSelection {
  item: PrescribingCatItem;
  reason: string;
}
