import { buildExamPathwayPath, EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { absoluteUrl } from "@/lib/seo/site-origin";

/**
 * Regional hreflang for exam product hubs (`/{us|canada}/…`).
 * Pairs US vs Canada pathways that share the same `roleTrack` + `examCode` (same exam product, different region).
 *
 * - `en-US` → United States hub URL when present
 * - `en-CA` → Canada hub URL when present
 * - `x-default` → US hub if available, otherwise Canada, otherwise the current pathway’s hub
 *
 * Not used on auth routes (`/login`, `/signup`) — those are separate route modules.
 */
export function examPathwayRegionalHreflang(pathway: ExamPathwayDefinition): Record<string, string> {
  const siblings = EXAM_PATHWAYS.filter(
    (p) =>
      p.roleTrack === pathway.roleTrack &&
      p.examCode === pathway.examCode &&
      p.status !== "hidden",
  );
  const out: Record<string, string> = {};
  const us = siblings.find((p) => p.countrySlug === "us");
  const ca = siblings.find((p) => p.countrySlug === "canada");
  if (us) {
    out["en-US"] = absoluteUrl(buildExamPathwayPath(us));
  }
  if (ca) {
    out["en-CA"] = absoluteUrl(buildExamPathwayPath(ca));
  }
  const selfUrl = absoluteUrl(buildExamPathwayPath(pathway));
  out["x-default"] = us ? out["en-US"]! : ca ? out["en-CA"]! : selfUrl;
  return out;
}
