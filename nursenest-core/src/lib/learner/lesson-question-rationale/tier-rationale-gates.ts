import type { CountryCode } from "@prisma/client";
import type { RoleTrackSlug } from "@/lib/exam-pathways/types";
import type { PathwayRationaleContext } from "@/lib/learner/lesson-question-rationale/types";

export type MappingGateFields = {
  pathwayIdsAllow?: string[];
  pathwayIdsDeny?: string[];
  countryCodesAllow?: CountryCode[];
  roleTracksAllow?: RoleTrackSlug[];
};

export function gatesAllowEntry(entry: MappingGateFields, ctx: PathwayRationaleContext | null): boolean {
  if (entry.pathwayIdsDeny?.length) {
    if (ctx && entry.pathwayIdsDeny.includes(ctx.pathwayId)) return false;
  }
  if (entry.pathwayIdsAllow?.length) {
    if (!ctx || !entry.pathwayIdsAllow.includes(ctx.pathwayId)) return false;
  }
  if (entry.countryCodesAllow?.length) {
    if (!ctx || !entry.countryCodesAllow.includes(ctx.countryCode)) return false;
  }
  if (entry.roleTracksAllow?.length) {
    if (!ctx || !entry.roleTracksAllow.includes(ctx.roleTrack)) return false;
  }
  return true;
}
