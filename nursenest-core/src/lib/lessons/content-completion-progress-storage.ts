import fs from "node:fs";
import path from "node:path";
import type { LessonCompletionBatchReport } from "@/lib/lessons/lesson-batch-completion";

export type ContentCompletionProgressRun = {
  at: string;
  pathwayId: string;
  batchSize: number;
  offset: number;
  write: boolean;
  mode: "complete" | "refine";
  onlyNotComplete: boolean;
  completenessApproxPctBefore: number;
  completenessApproxPctAfter: number;
  report: LessonCompletionBatchReport;
  notes: string[];
};

export type ContentCompletionProgressFile = {
  schemaVersion: 1;
  description: string;
  lastUpdated: string;
  latestSnapshotByPathway: Record<
    string,
    {
      completenessApproxPct: number;
      total: number;
      completeRough: number;
      partialRough: number;
      emptyRough: number;
      lastRunAt: string;
    }
  >;
  runs: ContentCompletionProgressRun[];
};

const DEFAULT_DESCRIPTION =
  "Append-only log for incremental lesson + quiz completion batches. completenessApproxPct is a rough hub metric (section spine + word count), not full bank-linked validation.";

export function emptyProgressFile(nowIso: string): ContentCompletionProgressFile {
  return {
    schemaVersion: 1,
    description: DEFAULT_DESCRIPTION,
    lastUpdated: nowIso,
    latestSnapshotByPathway: {},
    runs: [],
  };
}

/** Load progress JSON; on missing file, invalid shape, or parse error, returns a fresh file (runs reset). */
export function loadProgressFromPath(filePath: string, nowIso: string): ContentCompletionProgressFile {
  if (!fs.existsSync(filePath)) {
    return emptyProgressFile(nowIso);
  }
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as ContentCompletionProgressFile;
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.runs)) {
      throw new Error("Invalid progress file shape");
    }
    return parsed;
  } catch {
    return emptyProgressFile(nowIso);
  }
}

export const CONTENT_COMPLETION_MAX_RUNS = 200;

/** Writes pretty-printed JSON with trailing newline. Caps `runs` to the last {@link CONTENT_COMPLETION_MAX_RUNS} entries. */
export function saveProgressToPath(filePath: string, file: ContentCompletionProgressFile, nowIso: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const next: ContentCompletionProgressFile = {
    ...file,
    lastUpdated: nowIso,
  };
  if (next.runs.length > CONTENT_COMPLETION_MAX_RUNS) {
    next.runs = next.runs.slice(-CONTENT_COMPLETION_MAX_RUNS);
  }
  fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
}
