import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { isGlobalRegionSlug } from "@/lib/i18n/global-regions";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

/** Stable key: `pathway:{id}` or `region:{slug}`. */
export function parseLaunchWorkflowTargetKey(
  key: string,
): { kind: "pathway"; pathwayId: string } | { kind: "region"; region: GlobalRegionSlug } | null {
  if (key.startsWith("pathway:")) {
    const pathwayId = key.slice("pathway:".length).trim();
    if (!pathwayId) return null;
    return { kind: "pathway", pathwayId };
  }
  if (key.startsWith("region:")) {
    const region = key.slice("region:".length).trim();
    if (!region || !isGlobalRegionSlug(region)) return null;
    return { kind: "region", region };
  }
  return null;
}

export function formatLaunchWorkflowTargetKey(
  target: { kind: "pathway"; pathwayId: string } | { kind: "region"; region: GlobalRegionSlug },
): string {
  return target.kind === "pathway" ? `pathway:${target.pathwayId}` : `region:${target.region}`;
}

export function pathwayExistsInRegistry(pathwayId: string): boolean {
  return EXAM_PATHWAYS.some((p) => p.id === pathwayId);
}
