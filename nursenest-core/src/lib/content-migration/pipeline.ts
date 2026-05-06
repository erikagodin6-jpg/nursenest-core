import type { MigrationLogEntry, MigrationPhase, MigrationPipelineResult } from "./types";

export type MigrationPipelineOptions = {
  dryRun: boolean;
  validateOnly: boolean;
  /** When true, do not write DB — only collect would-be rows and validation. */
  skipWrites: boolean;
};

const defaultRollbackNotes =
  "Do not delete legacy sources until DB rows are verified on learner/public routes; keep DB backups before bulk migrate.";

/**
 * Shared migration skeleton: implement domain-specific `collect` / `apply` in scripts that import this module.
 * This stub returns an empty successful report so callers can compose incrementally.
 */
export async function runContentMigrationPipeline(
  phase: MigrationPhase,
  _opts: MigrationPipelineOptions,
  impl?: {
    collect?: () => Promise<MigrationLogEntry[]>;
  },
): Promise<MigrationPipelineResult> {
  const entries = (await impl?.collect?.()) ?? [];
  return {
    phase,
    entries,
    rollbackNotes: defaultRollbackNotes,
  };
}
