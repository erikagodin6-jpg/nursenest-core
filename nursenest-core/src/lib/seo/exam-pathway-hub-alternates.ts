import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { isPathwayPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { filterPublicHreflangRecord } from "@/lib/seo/public-url-validator";
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
      p.status !== "hidden" &&
      isPathwayPublishedForPublicSite(p.id),
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
  return filterPublicHreflangRecord(out, "seo", "exam_pathway_hreflang_rejected");
}

/**
 * Regional hreflang for pathway long-tail programmatic pages (`/{us|canada}/…/{topicSlug}`).
 *
 * **Not** the global marketing-locale cluster (`/fr/…`, `/es/…`): those URLs are not routed for this
 * tree and would 404 — see `collectLocaleMarketingUrls` / `stripForbiddenLocalePrefixedPathwayTopics`.
 *
 * Emits `en-US` / `en-CA` only when the same `topicSegment` exists in the pathway-topic registry for
 * that sibling hub; `x-default` prefers US when both exist (matches {@link examPathwayRegionalHreflang}).
 */
export async function examPathwayTopicRegionalHreflang(
  pathway: ExamPathwayDefinition,
  topicSegment: string,
): Promise<Record<string, string>> {
  const { getPathwayTopicProgrammaticRow } = await import("@/lib/seo/pathway-topic-programmatic-registry");
  const siblings = EXAM_PATHWAYS.filter(
    (p) =>
      p.roleTrack === pathway.roleTrack &&
      p.examCode === pathway.examCode &&
      p.status !== "hidden" &&
      isPathwayPublishedForPublicSite(p.id),
  );
  const out: Record<string, string> = {};
  const us = siblings.find((p) => p.countrySlug === "us");
  const ca = siblings.find((p) => p.countrySlug === "canada");
  if (us && getPathwayTopicProgrammaticRow(us.id, topicSegment)) {
    out["en-US"] = absoluteUrl(buildExamPathwayPath(us, topicSegment));
  }
  if (ca && getPathwayTopicProgrammaticRow(ca.id, topicSegment)) {
    out["en-CA"] = absoluteUrl(buildExamPathwayPath(ca, topicSegment));
  }
  const selfUrl = absoluteUrl(buildExamPathwayPath(pathway, topicSegment));
  out["x-default"] = us && getPathwayTopicProgrammaticRow(us.id, topicSegment)
    ? out["en-US"]!
    : ca && getPathwayTopicProgrammaticRow(ca.id, topicSegment)
      ? out["en-CA"]!
      : selfUrl;
  return filterPublicHreflangRecord(out, "seo", "exam_pathway_topic_hreflang_rejected");
}
