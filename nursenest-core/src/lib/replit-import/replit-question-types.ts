import type { Prisma } from "@prisma/client";

export type ProductTrack = "RN" | "PN" | "NP" | "ALLIED";

export type ImportCountry = "US" | "CA";

export type NormalizedExamQuestion = {
  stem: string;
  options: Prisma.InputJsonValue;
  correctAnswer: Prisma.InputJsonValue;
  questionType: string;
  tier: string;
  exam: string;
  regionScope: string;
  countryCode: string | null;
  careerType: string;
  rationale: string;
  topic: string | null;
  bodySystem: string | null;
  tags: string[];
  difficulty: number;
  stemHash: string;
};

export type ImportPipelineOptions = {
  rootDir: string;
  dryRun: boolean;
  batchSize: number;
  maxRetries: number;
  defaultCountry: ImportCountry;
  defaultTrack: ProductTrack;
  statusDb: "draft" | "published";
};

export type ImportReport = {
  startedAt: string;
  finishedAt: string;
  dryRun: boolean;
  filesScanned: number;
  rawRecordsSeen: number;
  normalizedOk: number;
  validationErrors: number;
  duplicateSkippedInRun: number;
  duplicateSkippedInDb: number;
  /** Rows that passed validation + dedupe and would be inserted (dry-run) or were attempted (live). */
  rowsReadyToInsert: number;
  inserted: number;
  singleRowFallbackInserts: number;
  parseErrors: Array<{ file: string; message: string }>;
  normalizationErrors: Array<{ file: string; index: number; message: string }>;
  insertErrors: Array<{ message: string; batchSize: number }>;
};
