import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { listPublishedExamPathwaysForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { isClinicalScenariosPubliclyEnabled } from "@/lib/clinical-scenarios/clinical-scenarios-feature-flag";
import { isOsceScenariosPubliclyEnabled } from "@/lib/scenarios/osce-scenarios-feature-flag";

function normalizeOrigin(origin: string): string {
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

/** Nursing exam hubs — OSCE vs clinical scenarios gated independently. */
export function collectOsceScenariosMarketingHubUrls(origin: string): string[] {
  const osceOn = isOsceScenariosPubliclyEnabled();
  const clinicalOn = isClinicalScenariosPubliclyEnabled();
  if (!osceOn && !clinicalOn) return [];
  const o = normalizeOrigin(origin);
  const urls: string[] = [];
  for (const p of listPublishedExamPathwaysForPublicSite()) {
    if (p.roleTrack === "allied") continue;
    if (osceOn) urls.push(`${o}${buildExamPathwayPath(p, "osce")}`);
    if (clinicalOn) urls.push(`${o}${buildExamPathwayPath(p, "clinical-scenarios")}`);
  }
  return urls;
}
