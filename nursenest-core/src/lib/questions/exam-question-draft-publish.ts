import type { Prisma } from "@prisma/client";

import {
  examQuestionDraftPublishableMinimalRequireRationaleSql,
  examQuestionDraftPublishableMinimalSql,
  examQuestionDraftPublishableStrictSql,
} from "@/lib/questions/exam-question-bank-sql";

/** CLI / script publish modes for draft ExamQuestion rows. */
export type DraftPublishMode = "minimal" | "minimal_require_rationale" | "strict";

export type ParsedDraftPublishCli = {
  dryRun: boolean;
  strict: boolean;
  requireRationale: boolean;
  json: boolean;
  mode: DraftPublishMode;
};

export function parseDraftPublishCli(argv: string[]): ParsedDraftPublishCli {
  const dryRun = argv.includes("--dry-run");
  const strict = argv.includes("--strict");
  const requireRationale = argv.includes("--require-rationale");
  const json = argv.includes("--json");
  if (strict && requireRationale) {
    throw new Error("Cannot combine --strict with --require-rationale.");
  }
  if (json && !dryRun) {
    throw new Error("--json is only supported with --dry-run.");
  }
  const mode: DraftPublishMode = strict
    ? "strict"
    : requireRationale
      ? "minimal_require_rationale"
      : "minimal";
  return { dryRun, strict, requireRationale, json, mode };
}

export function draftPublishWhereSql(mode: DraftPublishMode): Prisma.Sql {
  switch (mode) {
    case "strict":
      return examQuestionDraftPublishableStrictSql();
    case "minimal_require_rationale":
      return examQuestionDraftPublishableMinimalRequireRationaleSql();
    default:
      return examQuestionDraftPublishableMinimalSql();
  }
}
