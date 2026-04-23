import type { LinkCandidate } from "@/lib/linking/internal-link-types";
import type {
  HubMarketingLessonDetailFailureReason,
  PublicMarketingLessonCrossLinkExclusionReason,
} from "@/lib/lessons/pathway-lesson-marketing-link-integrity-reasons";

export type CrossLinkLessonIntegrityExcluded = {
  href: string;
  reason: PublicMarketingLessonCrossLinkExclusionReason;
};

export type ParsedLessonCrossLinkCandidate = { candidate: LinkCandidate; slug: string };

/**
 * Applies per-slug integrity evaluations to parsed lesson link candidates (same keep/drop rules as
 * {@link filterResolvedLinksLessonsByPublicMarketingIntegrity} after parse + evaluate).
 */
export function partitionParsedLessonCrossLinksByIntegrityEvaluations(args: {
  parsed: readonly ParsedLessonCrossLinkCandidate[];
  evalBySlug: Map<
    string,
    | { ok: true }
    | { ok: false; reason: HubMarketingLessonDetailFailureReason; slug: string }
    | undefined
  >;
}): { kept: LinkCandidate[]; excluded: CrossLinkLessonIntegrityExcluded[] } {
  const excluded: CrossLinkLessonIntegrityExcluded[] = [];
  const kept: LinkCandidate[] = [];

  for (const { candidate, slug } of args.parsed) {
    const ev = args.evalBySlug.get(slug);
    if (!ev) {
      excluded.push({ href: candidate.href, reason: "cross_link_slug_parse_failed" });
      continue;
    }
    if (!ev.ok) {
      excluded.push({ href: candidate.href, reason: ev.reason });
      continue;
    }
    kept.push(candidate);
  }

  return { kept, excluded };
}
