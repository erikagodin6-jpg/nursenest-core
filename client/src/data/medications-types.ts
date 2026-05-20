export interface Medication {
  id: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  moaCategory: string;
  mechanismOfAction: {
    summary: string;
    receptorPathway: string;
    cellularDetail: string;
  };
  indications: string[];
  sideEffects: {
    effect: string;
    mechanism: string;
    severity: "common" | "serious" | "life-threatening";
  }[];
  nursingConsiderations: string[];
  blackBoxWarnings?: string[];
  keyInteractions?: {
    drug: string;
    consequence: string;
    mechanism: string;
  }[];
  bodySystem: string;
  relatedLessons: { id: string; title: string }[];
}
