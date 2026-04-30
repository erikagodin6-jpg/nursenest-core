import type { OsceStationFamily } from "@/lib/scenarios/osce-station-kinds";

export type DevSampleOsceStation = {
  id: string;
  title: string;
  family: OsceStationFamily;
  minutes: number;
};

export type DevSampleClinicalScenario = {
  id: string;
  title: string;
  categoryId: string;
  summary: string;
};

/** Non-production-only placeholders — never returned in production. */
export function devSampleOsceStations(): DevSampleOsceStation[] {
  if (process.env.NODE_ENV === "production") return [];
  return [
    { id: "dev-osce-1", title: "Sample medication safety station (dev)", family: "medication_safety", minutes: 8 },
    { id: "dev-osce-2", title: "Sample SBAR handoff (dev)", family: "documentation_sbar", minutes: 6 },
  ];
}

export function devSampleClinicalScenarios(): DevSampleClinicalScenario[] {
  if (process.env.NODE_ENV === "production") return [];
  return [
    {
      id: "dev-scn-1",
      title: "Unfolding case: post-op shortness of breath (dev)",
      categoryId: "respiratory",
      summary: "Placeholder vitals/labs copy for layout only — replace with authored scenarios before launch.",
    },
  ];
}
