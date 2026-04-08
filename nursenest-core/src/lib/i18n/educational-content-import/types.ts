import type { EducationalTranslationSourceKind, EducationalTranslationStatus } from "@prisma/client";

/** One row after parsing JSON manifest or CSV. */
export type EducationalOverlayImportRow = {
  sourceKind: EducationalTranslationSourceKind;
  sourceId: string;
  locale: string;
  status: EducationalTranslationStatus;
  /** Stored as overlay JSON (never mutates canonical English rows). */
  payload: Record<string, unknown>;
  reviewedAt?: string | null;
  reviewerNote?: string | null;
  /** Original line / index for error reporting */
  _sourceRef?: string;
};

export type ImportAction =
  | "would_create"
  | "would_update"
  | "unchanged"
  | "skipped_published_protected"
  | "invalid";

export type RowOutcome = {
  action: ImportAction;
  sourceKind: EducationalTranslationSourceKind;
  sourceId: string;
  locale: string;
  reason?: string;
};

export type ImportSummary = {
  locale: string;
  dryRun: boolean;
  processed: number;
  wouldCreate: number;
  wouldUpdate: number;
  unchanged: number;
  skippedPublishedProtected: number;
  invalid: number;
  missingSourceIds: string[];
  outcomes: RowOutcome[];
};

export type ManifestJsonV1 = {
  version?: number;
  locale: string;
  items: Array<{
    sourceKind: EducationalTranslationSourceKind | string;
    sourceId: string;
    status: EducationalTranslationStatus | string;
    payload: Record<string, unknown>;
    reviewedAt?: string | null;
    reviewerNote?: string | null;
  }>;
};
