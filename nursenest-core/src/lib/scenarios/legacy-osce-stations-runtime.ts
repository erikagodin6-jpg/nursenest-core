import type { OsceStationFamily } from "@/lib/scenarios/osce-station-kinds";
import type { OSCESkillStation } from "@/lib/scenarios/osce-station-types";

export type OSCECategory = string;

/** Legacy OSCE bundle imports are disabled for production build stability. */
export const LEGACY_OSCE_SKILL_DATA_SOURCES = [] as const;
export const osceSkillStations: OSCESkillStation[] = [];

export type LegacyOsceStationListItem = {
  id: string;
  title: string;
  family: OsceStationFamily;
  minutes?: number;
  /** Category · difficulty for cards. */
  meta: string;
};

export function mapOsceCategoryToFamily(category: OSCECategory | string): OsceStationFamily {
  const c = String(category);
  const table: Partial<Record<string, OsceStationFamily>> = {
    Assessment: "assessment_history",
    Communication: "communication",
    Hygiene: "documentation_sbar",
    Procedure: "clinical_judgment",
    "Drain & Tube Care": "clinical_judgment",
    "Core Skills": "clinical_judgment",
    "Acute Care": "clinical_judgment",
    "Maternal & Newborn": "patient_teaching",
    Pediatric: "patient_teaching",
    "Mental Health": "clinical_judgment",
    "Geriatric Care": "patient_teaching",
    "Community Health": "patient_teaching",
    "Critical Care": "clinical_judgment",
  };
  return table[c] ?? "clinical_judgment";
}

export function parseOsceTimeLimitMinutes(raw?: string): number | undefined {
  if (!raw?.trim()) return undefined;
  const m = raw.match(/(\d+)\s*(?:min|minute|mins)\b/i);
  if (m?.[1]) {
    const n = Number.parseInt(m[1], 10);
    return Number.isFinite(n) ? n : undefined;
  }
  const digits = raw.match(/^\s*(\d+)\s*$/);
  if (digits?.[1]) {
    const n = Number.parseInt(digits[1], 10);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export function getMergedLegacyOsceSkillStations(): OSCESkillStation[] {
  return osceSkillStations;
}

export function getLegacyOsceSkillStationById(id: string): OSCESkillStation | null {
  const key = id.trim();
  if (!key) return null;
  return getMergedLegacyOsceSkillStations().find((s) => s.id === key) ?? null;
}

export function legacyOsceStationsToListItems(stations: readonly OSCESkillStation[]): LegacyOsceStationListItem[] {
  return stations.map((s) => ({
    id: s.id,
    title: s.title,
    family: mapOsceCategoryToFamily(s.category),
    minutes: parseOsceTimeLimitMinutes(s.timeLimit),
    meta: `${s.category} · ${s.difficulty}`,
  }));
}

export function getLegacyOsceHubListItems(): LegacyOsceStationListItem[] {
  return legacyOsceStationsToListItems(getMergedLegacyOsceSkillStations());
}
