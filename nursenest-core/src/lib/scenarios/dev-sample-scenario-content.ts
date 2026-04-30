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
  /** When set, allied occupation previews only include this row for matching `alliedProfession` keys. */
  professionKeys?: string[];
};

/** Filter dev placeholders by marketing / learner `alliedProfession` (no DB duplication). */
export function filterDevSampleClinicalScenariosByProfession(
  rows: DevSampleClinicalScenario[],
  professionKey: string | null | undefined,
): DevSampleClinicalScenario[] {
  const k = professionKey?.trim().toLowerCase();
  if (!k) return rows;
  return rows.filter((s) => !s.professionKeys?.length || s.professionKeys.includes(k));
}

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
    {
      id: "dev-scn-ma-1",
      title: "Office flow: elevated BP before a procedure (dev)",
      categoryId: "cardiovascular",
      summary: "Triage-style judgment for ambulatory care — vitals, escalation, and scope-safe next steps (layout only).",
      professionKeys: ["medical-assistant"],
    },
    {
      id: "dev-scn-psw-1",
      title: "Mobility: new unsteadiness after a bathroom transfer (dev)",
      categoryId: "musculoskeletal",
      summary: "Support-worker sequencing: safety, reporting, and falls prevention framing (layout only).",
      professionKeys: ["psw-hca"],
    },
  ];
}
