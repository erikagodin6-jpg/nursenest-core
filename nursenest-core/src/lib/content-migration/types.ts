export type MigrationPhase = "dry_run" | "validate" | "dedupe" | "migrate" | "verify" | "report";

export type MigrationLogEntry = {
  sourcePath: string;
  destinationModel: string;
  oldId: string;
  newId: string;
  pathwayId: string | null;
  publicRoute: string | null;
  learnerRoute: string | null;
  adminEditRoute: string | null;
  validationStatus: "ok" | "warn" | "fail";
  duplicateStatus: "unique" | "skipped_duplicate" | "merged";
  renderVerificationStatus: "pending" | "ok" | "fail";
};

export type MigrationPipelineResult = {
  phase: MigrationPhase;
  entries: MigrationLogEntry[];
  rollbackNotes: string;
};
