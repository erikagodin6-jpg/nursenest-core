import type { EeatEditorialRow } from "@/lib/admin/eeat-editorial-model";

export type EditorialFilterState = {
  contentType: string;
  pathway: string;
  scoreBand: string;
  staleOnly: boolean;
  thinOnly: boolean;
  missingLinks: boolean;
  missingAttr: boolean;
};

/** Single source of truth for client table + CSV export (no Node deps). */
export function filterEeatEditorialRows(rows: EeatEditorialRow[], f: EditorialFilterState): EeatEditorialRow[] {
  return rows.filter((r) => {
    if (f.contentType !== "all" && r.contentType !== f.contentType) return false;
    if (f.pathway !== "all" && r.pathwayKey !== f.pathway) return false;
    if (f.staleOnly && !r.staleContent) return false;
    if (f.thinOnly && !r.thinProgrammatic) return false;
    if (f.missingLinks && !r.missingInternalLinks) return false;
    if (f.missingAttr && !r.missingAttribution) return false;
    if (f.scoreBand !== "all") {
      if (f.scoreBand === "below70") {
        if (r.eeatScore >= 70) return false;
      } else if (r.priority !== f.scoreBand) {
        return false;
      }
    }
    return true;
  });
}
