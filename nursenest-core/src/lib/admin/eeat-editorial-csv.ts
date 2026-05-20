import type { EeatEditorialRow } from "@/lib/admin/eeat-editorial-model";

export const EEAT_EDITORIAL_CSV_HEADERS = [
  "id",
  "pathwayKey",
  "contentType",
  "eeatScore",
  "priority",
  "internalLinksCount",
  "sectionCompleteness",
  "wordCount",
  "stale",
  "thinProgrammatic",
  "missingAttribution",
  "flags",
  "lossReasons",
  "recommendedActions",
  "urlPattern",
] as const;

/** Escape one CSV field (RFC-style quoting when needed). Exported for tests. */
export function escapeCsvField(value: unknown): string {
  const s = String(value ?? "").replace(/"/g, '""');
  return /[",\n\r]/.test(s) ? `"${s}"` : s;
}

/** Client-safe CSV export (no Node imports). Matches filtered table rows 1:1. UTF-8 BOM prefix for Excel. */
export function rowsToCsv(rows: EeatEditorialRow[]): string {
  const lines = [EEAT_EDITORIAL_CSV_HEADERS.join(",")];
  for (const r of rows) {
    const cells = [
      r.id,
      r.pathwayKey,
      r.contentType,
      String(r.eeatScore),
      r.priority,
      String(r.internalLinksCount),
      String(r.sectionCompleteness),
      String(r.wordCount),
      r.staleContent ? "yes" : "",
      r.thinProgrammatic ? "yes" : "",
      r.missingAttribution ? "yes" : "",
      r.flags.join("|"),
      r.lossReasons.join(" | "),
      r.recommendedActions.join(" | "),
      r.urlPattern,
    ].map((c) => escapeCsvField(c));
    lines.push(cells.join(","));
  }
  return `\uFEFF${lines.join("\n")}`;
}
