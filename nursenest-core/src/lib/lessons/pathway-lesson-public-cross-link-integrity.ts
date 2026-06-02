/**
 * Public marketing **lesson** cross-links — same integrity contract as the main lessons hub
 * ({@link verifyMarketingHubLessonRowsResolve} / {@link evaluatePublicMarketingLessonCrossLinkIntegrity}).
 *
 * Registry / DB helpers may suggest lesson hrefs; this module filters `ResolvedLinks.lessons` before render
 * so we never advertise a pathway lesson URL that detail + hub gates would reject.
 */
import "server-only";

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  evaluatePublicMarketingLessonCrossLinkIntegrity,
  mapWithConcurrency,
} from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import type { HubMarketingLessonDetailFailureReason } from "@/lib/lessons/pathway-lesson-marketing-link-integrity-reasons";
import { parseMarketingLessonSlugForPathwayHref } from "@/lib/lessons/pathway-lesson-marketing-detail-href-parse";
import {
  partitionParsedLessonCrossLinksByIntegrityEvaluations,
  type CrossLinkLessonIntegrityExcluded,
} from "@/lib/lessons/pathway-lesson-public-cross-link-partition";
import type { LinkCandidate, ResolvedLinks } from "@/lib/linking/internal-link-types";

export type { CrossLinkLessonIntegrityExcluded };

export { parseMarketingLessonSlugForPathwayHref } from "@/lib/lessons/pathway-lesson-marketing-detail-href-parse";

/**
 * Drops `resolved.lessons` entries that fail {@link evaluatePublicMarketingLessonCrossLinkIntegrity}.
 * When `pathway` is missing, **all** lesson links are dropped (cannot assert pathway context).
 */
export async function filterResolvedLinksLessonsByPublicMarketingIntegrity(args: {
  pathway: ExamPathwayDefinition | null | undefined;
  lessonContentLocale: string;
  resolved: ResolvedLinks;
  concurrency?: number;
}): Promise<{ resolved: ResolvedLinks; excluded: CrossLinkLessonIntegrityExcluded[] }> {
  const excluded: CrossLinkLessonIntegrityExcluded[] = [];
  if (!args.pathway) {
    for (const c of args.resolved.lessons) {
      excluded.push({ href: c.href, reason: "cross_link_pathway_missing" });
    }
    return {
      resolved: { ...args.resolved, lessons: [] },
      excluded,
    };
  }

  const pathway = args.pathway;
  const parsed: { candidate: LinkCandidate; slug: string }[] = [];
  for (const c of args.resolved.lessons) {
    const slug = parseMarketingLessonSlugForPathwayHref(pathway, c.href);
    if (!slug) {
      excluded.push({ href: c.href, reason: "cross_link_slug_parse_failed" });
      continue;
    }
    parsed.push({ candidate: c, slug });
  }

  const uniqueSlugs = [...new Set(parsed.map((p) => p.slug))];
  const concurrency = Math.max(1, Math.min(16, args.concurrency ?? 8));
  const evalBySlug = new Map<
    string,
    | { ok: true }
    | { ok: false; reason: HubMarketingLessonDetailFailureReason; slug: string }
  >();
  await mapWithConcurrency(uniqueSlugs, concurrency, async (slug) => {
    const ev = await evaluatePublicMarketingLessonCrossLinkIntegrity(pathway, slug, args.lessonContentLocale);
    evalBySlug.set(slug, ev.ok ? { ok: true } : { ok: false, reason: ev.reason, slug: ev.slug });
    return ev;
  });

  const { kept, excluded: partitionExcluded } = partitionParsedLessonCrossLinksByIntegrityEvaluations({
    parsed,
    evalBySlug,
  });
  excluded.push(...partitionExcluded);

  return {
    resolved: { ...args.resolved, lessons: kept },
    excluded,
  };
}
