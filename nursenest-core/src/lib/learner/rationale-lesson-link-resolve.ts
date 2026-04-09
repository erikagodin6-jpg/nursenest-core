/**
 * Resolve **app-safe** and **marketing-fallback** hrefs for rationale lesson links.
 */
import type { PrismaClient } from "@prisma/client";
import { ContentStatus, CountryCode } from "@prisma/client";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  inferRationaleLessonSlugCandidates,
  normalizedTopicCodeForQuestion,
} from "@/lib/learner/rationale-lesson-link-engine";
import {
  RATIONALE_DB_EXACT_MIN_SCORE,
  RATIONALE_DB_WEAK_MIN_SCORE,
  rankPathwayLessonRowsForQuestion,
  type PathwayLessonScoreRow,
} from "@/lib/learner/lesson-question-rationale/pathway-lesson-match";
import { pathwayRationaleContextFromId } from "@/lib/learner/lesson-question-rationale/pathway-context";
import type { RationaleLessonLinkKind } from "@/lib/learner/lesson-question-rationale/types";
import { deriveTopicCode } from "@/lib/learner/topic-linking";
import { pickTopicClusterSlugForPathway } from "@/lib/lessons/lesson-topic-cluster-registry";
import { listTopicClusters } from "@/lib/lessons/pathway-lesson-loader";
import { defaultPathwayLessonContentLocaleForExamHubRoute } from "@/lib/lessons/pathway-lesson-locale";
import { SCOPED_GOLD_PROVIDERS } from "@/lib/lessons/scoped-lessons/scoped-gold-registry";

const SLUG_TO_TOPIC_SLUG = new Map<string, string>(
  SCOPED_GOLD_PROVIDERS.map((p) => [p.slug, p.topicSlug] as const),
);

export type RationaleLessonLinkResolved = {
  kind: RationaleLessonLinkKind;
  slug: string;
  title: string;
  href: string;
  /** `app` = `/app/lessons/:id`; `hub` = marketing pathway lesson URL. */
  hrefSource: "app" | "hub";
  ctaKey: "learner.qbank.rationaleLinks.reviewTopic" | "learner.qbank.rationaleLinks.readRelatedLesson" | "learner.qbank.rationaleLinks.reviewPrioritization" | "learner.qbank.rationaleLinks.browseTopicHub";
};

function ctaKeyForCandidate(
  kind: RationaleLessonLinkKind,
  index: number,
): RationaleLessonLinkResolved["ctaKey"] {
  if (kind === "prioritization") return "learner.qbank.rationaleLinks.reviewPrioritization";
  if (index === 1) return "learner.qbank.rationaleLinks.readRelatedLesson";
  return "learner.qbank.rationaleLinks.reviewTopic";
}

async function resolveSlugHref(
  prisma: PrismaClient,
  pathwayId: string,
  slug: string,
): Promise<{ href: string; title: string; hrefSource: "app" | "hub" } | null> {
  const row = await prisma.pathwayLesson.findFirst({
    where: { pathwayId, slug, status: ContentStatus.PUBLISHED, locale: "en" },
    select: { id: true, title: true },
  });
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) return null;

  if (row) {
    return { href: `/app/lessons/${row.id}`, title: row.title, hrefSource: "app" };
  }
  /** Avoid synthesizing marketing lesson URLs without a published row for Canadian pathways — reduces cross-catalog mismatches. */
  if (pathway.countryCode === CountryCode.CA) {
    return null;
  }
  const hub = buildExamPathwayPath(pathway, `lessons/${slug}`);
  const titleFromSlug = slug
    .replace(/-gold$/i, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { href: hub, title: titleFromSlug || slug, hrefSource: "hub" };
}

function topicHubFallback(pathwayId: string, topicSlug: string, titleLabel?: string): RationaleLessonLinkResolved | null {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) return null;
  const href = buildExamPathwayPath(pathway, `lessons/topics/${topicSlug}`);
  return {
    kind: "topic_hub",
    slug: `topic:${topicSlug}`,
    title: titleLabel?.trim() || topicSlug.replace(/-/g, " "),
    href,
    hrefSource: "hub",
    ctaKey: "learner.qbank.rationaleLinks.browseTopicHub",
  };
}

/**
 * Produces 0–3 lesson links for a graded question. When **no** slug matches, may return a **single**
 * topic-cluster hub link if `topicCode` is available (conservative fallback).
 */
export async function resolveRationaleLessonLinksForQuestion(
  prisma: PrismaClient,
  args: {
    pathwayId: string | null;
    topic?: string | null;
    subtopic?: string | null;
    bodySystem?: string | null;
    tags: string[];
    /** Improves DB + registry matching (token overlap with lesson titles). */
    stem?: string | null;
  },
): Promise<RationaleLessonLinkResolved[]> {
  const pathwayId = args.pathwayId;
  if (!pathwayId || !getExamPathwayById(pathwayId)) return [];

  const topicCodeDerived = deriveTopicCode({
    topic: args.topic,
    subtopic: args.subtopic,
    bodySystem: args.bodySystem,
  });
  const pathwayCtx = pathwayRationaleContextFromId(pathwayId);

  let dbRanked: Array<{
    row: PathwayLessonScoreRow;
    score: number;
    kind: RationaleLessonLinkKind;
  }> = [];
  if (topicCodeDerived && pathwayCtx) {
    const rows = await prisma.pathwayLesson.findMany({
      where: {
        pathwayId,
        topicSlug: topicCodeDerived,
        status: ContentStatus.PUBLISHED,
        locale: "en",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        topic: true,
        topicSlug: true,
        bodySystem: true,
        countryCode: true,
      },
    });
    dbRanked = rankPathwayLessonRowsForQuestion(
      {
        topic: args.topic,
        subtopic: args.subtopic,
        bodySystem: args.bodySystem,
        tags: args.tags ?? [],
        topicCode: topicCodeDerived,
        stem: args.stem ?? null,
      },
      pathwayCtx,
      rows,
      topicCodeDerived,
    );
  }

  const dbExact = dbRanked.filter((x) => x.score >= RATIONALE_DB_EXACT_MIN_SCORE);
  const dbWeak = dbRanked.filter(
    (x) => x.score >= RATIONALE_DB_WEAK_MIN_SCORE && x.score < RATIONALE_DB_EXACT_MIN_SCORE,
  );

  const candidates = inferRationaleLessonSlugCandidates(
    {
      topic: args.topic,
      subtopic: args.subtopic,
      bodySystem: args.bodySystem,
      tags: args.tags ?? [],
      pathwayId,
      stem: args.stem ?? null,
    },
    5,
  );

  const out: RationaleLessonLinkResolved[] = [];
  const seenSlug = new Set<string>();
  const seenHref = new Set<string>();

  const pushDb = (entry: (typeof dbRanked)[number]) => {
    const href = `/app/lessons/${entry.row.id}`;
    if (seenHref.has(href) || seenSlug.has(entry.row.slug)) return;
    seenHref.add(href);
    seenSlug.add(entry.row.slug);
    out.push({
      kind: entry.kind,
      slug: entry.row.slug,
      title: entry.row.title,
      href,
      hrefSource: "app",
      ctaKey: ctaKeyForCandidate(entry.kind, out.length),
    });
  };

  for (const d of dbExact.slice(0, 2)) {
    pushDb(d);
    if (out.length >= 2) break;
  }

  for (const c of candidates) {
    if (out.length >= 3) break;
    if (seenSlug.has(c.slug)) continue;
    const resolved = await resolveSlugHref(prisma, pathwayId, c.slug);
    if (!resolved) continue;
    if (seenHref.has(resolved.href)) continue;
    seenSlug.add(c.slug);
    seenHref.add(resolved.href);
    out.push({
      kind: c.kind,
      slug: c.slug,
      title: resolved.title,
      href: resolved.href,
      hrefSource: resolved.hrefSource,
      ctaKey: ctaKeyForCandidate(c.kind, out.length),
    });
  }

  if (out.length === 0) {
    for (const d of dbWeak.slice(0, 1)) {
      pushDb(d);
      break;
    }
  }

  if (out.length > 0) return dedupeByHref(out);

  const topicCode = normalizedTopicCodeForQuestion({
    topic: args.topic,
    subtopic: args.subtopic,
    bodySystem: args.bodySystem,
  });
  if (topicCode) {
    const legacy = await prisma.pathwayLesson.findFirst({
      where: { pathwayId, topicSlug: topicCode, status: ContentStatus.PUBLISHED, locale: "en" },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true, slug: true },
    });
    if (legacy) {
      return [
        {
          kind: "disease_process",
          slug: legacy.slug,
          title: legacy.title,
          href: `/app/lessons/${legacy.id}`,
          hrefSource: "app",
          ctaKey: "learner.qbank.rationaleLinks.reviewTopic",
        },
      ];
    }
  }

  const clusters = await listTopicClusters(pathwayId, defaultPathwayLessonContentLocaleForExamHubRoute());
  const pathwaySlugs = new Set(clusters.map((c) => c.topicSlug));
  const hubSlug = pickTopicClusterSlugForPathway(topicCode, pathwaySlugs);
  if (hubSlug) {
    const label = clusters.find((c) => c.topicSlug === hubSlug)?.label;
    const hub = topicHubFallback(pathwayId, hubSlug, label);
    return hub ? [hub] : [];
  }

  return [];
}

function dedupeByHref(links: RationaleLessonLinkResolved[]): RationaleLessonLinkResolved[] {
  const seen = new Set<string>();
  return links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}

/** Map slug → topic slug for diagnostics (hub topic filter). */
export function topicSlugForScopedGoldSlug(slug: string): string | undefined {
  return SLUG_TO_TOPIC_SLUG.get(slug);
}
