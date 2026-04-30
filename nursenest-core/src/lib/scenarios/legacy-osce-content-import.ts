/**
 * Placeholder for future legacy OSCE / clinical scenario imports.
 * When JSON or legacy bundles exist under `nursenest-core/src/legacy/`, map them here — do not auto-publish.
 */
export type LegacyOsceMigrationRecord = {
  sourcePath: string;
  pathwayId: string;
  title: string;
};

/** Returns candidate files/records once legacy sources are wired; empty until then. */
export function listLegacyOsceMigrationCandidates(): readonly LegacyOsceMigrationRecord[] {
  return [];
}
