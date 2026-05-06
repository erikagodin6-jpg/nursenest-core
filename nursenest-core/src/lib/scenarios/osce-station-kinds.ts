/**
 * OSCE station families the product shell supports (library rows + modes wire in later).
 */
export const OSCE_STATION_FAMILIES = [
  "assessment_history",
  "communication",
  "prioritization_delegation",
  "medication_safety",
  "documentation_sbar",
  "patient_teaching",
  "clinical_judgment",
] as const;

export type OsceStationFamily = (typeof OSCE_STATION_FAMILIES)[number];
