import type { EeatEditorialRow } from "@/lib/admin/eeat-editorial-dashboard";

/** Client-safe CSV export (no Node imports). */
export function rowsToCsv(rows: EeatEditorialRow[]): string {
  const headers = [
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
  ];
  const lines = [headers.join(",")];
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
    ].map((c) => {
      const s = String(c).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    });
    lines.push(cells.join(","));
  }
  return lines.join("\n");
}
