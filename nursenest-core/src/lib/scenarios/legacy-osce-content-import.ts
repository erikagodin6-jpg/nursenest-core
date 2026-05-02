import {
  LEGACY_OSCE_SKILL_DATA_SOURCES,
  getMergedLegacyOsceSkillStations,
} from "@/lib/scenarios/legacy-osce-stations-runtime";

/**
 * Audit rows for OSCE recovery — one row per bundled legacy station (skills library).
 * Live read path: DB `osce_stations` when **published** rows exist (see `hasAnyPublishedOsceStation` in
 * `osce-stations-resolve.server.ts`); otherwise merged legacy JSON only when `OSCE_LEGACY_FALLBACK` is enabled.
 */
export type LegacyOsceMigrationRecord = {
  sourcePath: string;
  pathwayId: string;
  title: string;
  stationId: string;
};

/** Nursing (non-allied) pathways share this clinical-skills OSCE bank until per-pathway splits exist. */
const OSCE_SKILL_BANK_PATHWAY_SCOPE = "nursing-non-allied-shared-bank";

/** One row per merged station; `sourcePath` is the logical bundle (see LEGACY_OSCE_SKILL_DATA_SOURCES). */
export function listLegacyOsceMigrationCandidates(): readonly LegacyOsceMigrationRecord[] {
  const merged = getMergedLegacyOsceSkillStations();
  const sourcePath = LEGACY_OSCE_SKILL_DATA_SOURCES.join(", ");
  return merged.map((s) => ({
    sourcePath,
    pathwayId: OSCE_SKILL_BANK_PATHWAY_SCOPE,
    title: s.title,
    stationId: s.id,
  }));
}
