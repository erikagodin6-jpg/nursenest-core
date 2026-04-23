import { classifyHubDbFailure, type HubDbFailureCategory } from "@/lib/db/safe-database";

/**
 * Thrown when the marketing lessons hub cannot safely read pathway inventory from Postgres
 * (auth, timeout, missing URL, etc.). Callers must not treat this as “zero lessons”.
 */
export class HubLessonsListDatabaseError extends Error {
  readonly category: HubDbFailureCategory;
  readonly logLabel?: string;

  constructor(init: {
    category: HubDbFailureCategory;
    label?: string;
    message?: string;
    cause?: unknown;
  }) {
    super(init.message ?? `hub_lessons_database:${init.category}`);
    this.name = "HubLessonsListDatabaseError";
    this.category = init.category;
    this.logLabel = init.label;
    if (init.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = init.cause;
    }
  }

  static fromCaughtUnknown(err: unknown, label?: string): HubLessonsListDatabaseError {
    if (err instanceof HubLessonsListDatabaseError) return err;
    return new HubLessonsListDatabaseError({
      category: classifyHubDbFailure(err),
      label,
      message: err instanceof Error ? err.message : String(err),
      cause: err instanceof Error ? err : undefined,
    });
  }
}
