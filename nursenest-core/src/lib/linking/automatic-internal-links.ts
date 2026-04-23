import "server-only";

import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { blogLiveWhere } from "@/lib/blog/blog-visibility";
import { blogCountryFromPrismaTarget } from "@/lib/blog/blog-study-cta";
import { blogOfferingForCat, marketingRegionToggleForCat } from "@/lib/blog/blog-public-seo-helpers";
import { defaultPathwayIdForMarketingOffering } from "@/lib/marketing/country-exam-offerings";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
import { PATHWAY_LESSON_CANONICAL_DB_LOCALE } from "@/lib/lessons/pathway-lesson-locale";
import { primaryTaxonomyLeafForBlogPost } from "@/lib/seo/programmatic-seo-engine/blog-taxonomy";
import { isTaxonomyLeafForSeo } from "@/lib/seo/seo-taxonomy-align";
import { publicMarketingFlashcardDeckWhere } from "@/lib/entitlements/content-access-scope";
import type { LinkCandidate, LinkContext, PathwayRef, ResolvedLinks } from "@/lib/linking/internal-link-types";
import { normalizeTopicKey, resolveLinks } from "@/lib/linking/link-resolver";
import { synonymNormalizeOrSlugify } from "@/lib/linking/topic-synonym-map";
import { maxLinksFor } from "@/lib/linking/link-density-config";
import {
  blogExamsAllowPairing,
  blogSeoTiersAllowPairing,
  scoreBlogRelatedness,
  scoreLessonSiblingRelatedness,
  tagOverlapCount,
  tokenOverlapTitle,
} from "@/lib/linking/automatic-internal-links-scoring";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

const MARKETING_BUILD_PHASE = "phase-production-build";

function shouldSkipBlogDbForAutoLinks(): boolean {
  const raw = process.env.MARKETING_BLOG_SKIP_DB_FOR_BUILD?.trim().toLowerCase();
  if (raw === "true") return true;
  if (raw === "false") return false;
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE;
}

function pathwayIdForBlogPost(post: { exam: string | null | undefined; countryTarget: import("@prisma/client").CountryCode | null | undefined }): string | null {
  const country = blogCountryFromPrismaTarget(post.countryTarget);
  const region = marketingRegionToggleForCat(country);
  const offering = blogOfferingForCat(post.exam);
  try {
    return defaultPathwayIdForMarketingOffering(region, offering);
  } catch {
    return null;
  }
}

function pathwayRefFromDefinition(p: ExamPathwayDefinition): PathwayRef {
  return {
    countrySlug: p.countrySlug,
    roleTrack: p.roleTrack,
    examCode: p.examCode,
    examFamily: p.examFamily,
  };
}

function slugHintsFromTags(tags: readonly string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const t of tags) {
    const s = synonymNormalizeOrSlugify(t.trim()) ?? t.trim().toLowerCase().replace(/\s+/g, "-");
    const key = s.slice(0, 80);
    if (key.length < 2) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(key);
    if (out.length >= 12) break;
  }
  return out;
}

function dedupeCandidates(items: LinkCandidate[]): LinkCandidate[] {
  const seen = new Set<string>();
  const r: LinkCandidate[] = [];
  for (const c of items) {
    if (seen.has(c.href)) continue;
    seen.add(c.href);
    r.push(c);
  }
  return r;
}

function mergeKindLists(surface: LinkContext["surface"], kind: LinkCandidate["kind"], buckets: LinkCandidate[][]): LinkCandidate[] {
  const cap = maxLinksFor(surface, kind);
  const merged = dedupeCandidates(buckets.flat().filter((c) => c.kind === kind));
  merged.sort((a, b) => a.score - b.score);
  return merged.slice(0, cap);
}

function mergeResolvedForSurface(
  surface: LinkContext["surface"],
  parts: {
    lessons: LinkCandidate[][];
    flashcards: LinkCandidate[][];
    questions: LinkCandidate[][];
    blogs: LinkCandidate[][];
    cat: LinkCandidate[][];
  },
): ResolvedLinks {
  return {
    lessons: mergeKindLists(surface, "lesson", parts.lessons),
    flashcards: mergeKindLists(surface, "flashcard", parts.flashcards),
    questions: mergeKindLists(surface, "question", parts.questions),
    blogs: mergeKindLists(surface, "blog", parts.blogs),
    cat: mergeKindLists(surface, "cat", parts.cat),
  };
}

/** Prefer editorially curated lesson URLs from the blog row when present. */
function manualLessonCandidatesFromBlog(
  relatedLessonPaths: readonly string[] | undefined,
  pathway: ExamPathwayDefinition | null,
): LinkCandidate[] {
  if (!relatedLessonPaths?.length || !pathway) return [];
  const out: LinkCandidate[] = [];
  for (const raw of relatedLessonPaths.slice(0, 6)) {
    const href = raw.trim();
    if (!href.startsWith("/")) continue;
    const tail = href.split("/").filter(Boolean).pop() ?? "lesson";
    const label = tail.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    out.push({
      kind: "lesson",
      topicKey: "manual",
      href,
      anchorText: `Review: ${label}`,
      score: 5,
      strength: "strong",
      localeMatch: true,
      pathwayMatch: true,
      debugReason: "manual_relatedLessonPaths",
    });
  }
  return dedupeCandidates(out);
}

async function fetchRelatedBlogRows(post: {
  slug: string;
  exam: string | null;
  tags: string[];
  category: string | null;
}): Promise<
  Pick<
    import("@prisma/client").BlogPost,
    "slug" | "title" | "seoTitle" | "exam" | "tags" | "category"
  >[]
> {
  if (shouldSkipBlogDbForAutoLinks() || !isDatabaseUrlConfigured()) return [];
  const now = new Date();
  const leaf = primaryTaxonomyLeafForBlogPost(post);
  const or: Prisma.BlogPostWhereInput[] = [];
  if (post.tags.length) {
    or.push({ tags: { hasSome: post.tags.slice(0, 20) } });
  }
  if (post.category?.trim()) {
    or.push({ category: post.category.trim() });
    or.push({ tags: { has: post.category.trim() } });
  }
  if (or.length === 0) return [];
  const rows = await prisma.blogPost.findMany({
    where: {
      AND: [
        blogLiveWhere(now),
        { slug: { not: post.slug } },
        { OR: or },
        post.exam?.trim() ? { exam: post.exam.trim() } : { exam: null },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: 16,
    select: { slug: true, title: true, seoTitle: true, exam: true, tags: true, category: true },
  });
  return rows.filter(
    (r) =>
      blogExamsAllowPairing(post.exam, r.exam) &&
      blogSeoTiersAllowPairing(post.exam, r.exam) &&
      r.slug !== post.slug,
  );
}

async function fetchRelatedLessonRows(input: {
  pathwayId: string;
  excludeSlug?: string | null;
  slugHints: string[];
  category: string | null;
}): Promise<Pick<import("@prisma/client").PathwayLesson, "slug" | "title" | "topic" | "topicSlug" | "bodySystem">[]> {
  if (!isDatabaseUrlConfigured()) return [];
  const or: Prisma.PathwayLessonWhereInput[] = [];
  if (input.slugHints.length) {
    or.push({ topicSlug: { in: input.slugHints } });
  }
  if (input.category?.trim()) {
    const c = input.category.trim();
    or.push({ bodySystem: { equals: c, mode: "insensitive" } });
    if (isTaxonomyLeafForSeo(c)) {
      or.push({ topicSlug: { contains: c, mode: "insensitive" } });
    }
  }
  if (or.length === 0) return [];
  return prisma.pathwayLesson.findMany({
    where: {
      pathwayId: input.pathwayId,
      locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE,
      status: ContentStatus.PUBLISHED,
      structuralPublicComplete: true,
      ...(input.excludeSlug ? { slug: { not: input.excludeSlug } } : {}),
      OR: or,
    },
    orderBy: { sortOrder: "asc" },
    take: 14,
    select: { slug: true, title: true, topic: true, topicSlug: true, bodySystem: true },
  });
}

async function fetchRelatedFlashcardDecks(input: {
  pathway: ExamPathwayDefinition;
  slugHints: string[];
}): Promise<Pick<import("@prisma/client").FlashcardDeck, "slug" | "title" | "pathwayId" | "examFamily" | "tier">[]> {
  if (!isDatabaseUrlConfigured() || input.slugHints.length === 0) return [];
  const { pathway, slugHints } = input;
  return prisma.flashcardDeck.findMany({
    where: {
      AND: [
        publicMarketingFlashcardDeckWhere(),
        {
          OR: [{ pathwayId: pathway.id }, { pathwayId: null, examFamily: pathway.examFamily, country: pathway.countryCode }],
        },
        {
          tags: {
            some: {
              tag: { slug: { in: slugHints } } },
          },
        },
      ],
    },
    orderBy: { sortOrder: "asc" },
    take: 6,
    select: { slug: true, title: true, pathwayId: true, examFamily: true, tier: true },
  });
}

function pathwayHubCandidates(pathway: ExamPathwayDefinition): LinkCandidate[] {
  const q = buildExamPathwayPath(pathway, "questions");
  const c = buildExamPathwayPath(pathway, "cat");
  return [
    {
      kind: "question",
      topicKey: pathway.id,
      href: q,
      anchorText: `Pathway practice questions — ${pathway.shortName}`,
      score: 18,
      strength: "moderate",
      localeMatch: true,
      pathwayMatch: true,
    },
    {
      kind: "cat",
      topicKey: pathway.id,
      href: c,
      anchorText: `Adaptive CAT prep — ${pathway.shortName}`,
      score: 20,
      strength: "moderate",
      localeMatch: true,
      pathwayMatch: true,
    },
  ];
}

export type BlogPostAutoLinkSource = Pick<
  import("@prisma/client").BlogPost,
  "slug" | "title" | "tags" | "category" | "exam" | "countryTarget" | "locale" | "relatedLessonPaths"
>;

/**
 * DB + registry merged internal links for a public blog post.
 * Respects tier/exam pairing, caps density, drops weak matches unless registry needs them (handled in UI).
 */
export async function resolveAutomaticRelatedBundleForBlogPost(
  post: BlogPostAutoLinkSource,
  opts?: { excludeHrefs?: string[] },
): Promise<ResolvedLinks> {
  const locale = (post.locale ?? "en").trim() || "en";
  const pathwayId = pathwayIdForBlogPost(post);
  const pathway = pathwayId ? getExamPathwayById(pathwayId) : undefined;
  const leaf = primaryTaxonomyLeafForBlogPost(post);
  const topicKey = post.tags.map((t) => normalizeTopicKey(t)).find(Boolean) ?? normalizeTopicKey(post.category) ?? undefined;
  const slugHints = slugHintsFromTags(post.tags);
  const exclude = new Set(
    [`/blog/${post.slug}`, withMarketingLocale(locale, `/blog/${post.slug}`), ...(opts?.excludeHrefs ?? [])].filter(Boolean),
  );

  const ctx: LinkContext = {
    surface: "blog",
    locale,
    pathway: pathway ? pathwayRefFromDefinition(pathway) : undefined,
    topicKey: topicKey ?? undefined,
    bodySystem: post.category?.trim() && !isTaxonomyLeafForSeo(post.category.trim()) ? post.category.trim() : undefined,
    topicHints: post.tags.slice(0, 8),
    excludeHrefs: [...exclude],
  };

  const registry = resolveLinks(ctx);

  const dbBlogs: LinkCandidate[] = [];
  const dbLessons: LinkCandidate[] = [];
  const dbFlash: LinkCandidate[] = [];

  if (!shouldSkipBlogDbForAutoLinks() && isDatabaseUrlConfigured()) {
    const blogRows = await fetchRelatedBlogRows({
      slug: post.slug,
      exam: post.exam,
      tags: post.tags,
      category: post.category,
    });
    for (const r of blogRows) {
      const overlap = tagOverlapCount(post.tags, r.tags);
      const taxonomyLeafMatch = Boolean(leaf && (r.category === leaf || r.tags.includes(leaf)));
      const categoryMatch = Boolean(post.category?.trim() && r.category === post.category);
      const { rank, strength } = scoreBlogRelatedness({
        postTags: post.tags,
        candidateTags: r.tags,
        categoryMatch,
        taxonomyLeafMatch,
      });
      if (strength === "weak" && overlap < 2 && !taxonomyLeafMatch) continue;
      const href = withMarketingLocale(locale, `/blog/${r.slug}`);
      if (exclude.has(href)) continue;
      dbBlogs.push({
        kind: "blog",
        topicKey: r.slug,
        href,
        anchorText: (r.seoTitle ?? r.title).trim().slice(0, 90) || r.slug,
        score: rank,
        strength,
        localeMatch: true,
        pathwayMatch: true,
      });
    }

    if (pathway) {
      const lessonRows = await fetchRelatedLessonRows({
        pathwayId: pathway.id,
        slugHints,
        category: post.category,
      });
      for (const row of lessonRows) {
        const sameTopic = slugHints.includes(row.topicSlug);
        const sameBody =
          Boolean(post.category?.trim()) && row.bodySystem.toLowerCase() === post.category!.trim().toLowerCase();
        const titleTok = tokenOverlapTitle(post.title, row.title);
        const { rank, strength } = scoreLessonSiblingRelatedness({
          sameTopicSlug: sameTopic,
          sameBodySystem: sameBody,
          titleTokenOverlap: titleTok,
        });
        if (strength === "weak") continue;
        const rawHref = pathwayLessonPublicDetailPath(pathway, row.slug);
        if (!rawHref) continue;
        const href = withMarketingLocale(locale, rawHref);
        if (exclude.has(href)) continue;
        dbLessons.push({
          kind: "lesson",
          topicKey: row.topicSlug,
          href,
          anchorText: row.title.trim().slice(0, 90) || row.topic,
          score: rank,
          strength,
          localeMatch: true,
          pathwayMatch: true,
        });
      }

      const deckRows = await fetchRelatedFlashcardDecks({ pathway, slugHints });
      for (const d of deckRows) {
        if (d.pathwayId && d.pathwayId !== pathway.id) continue;
        if (!d.pathwayId && d.examFamily !== pathway.examFamily) continue;
        const href = withMarketingLocale(locale, `/flashcards/${d.slug}`);
        if (exclude.has(href)) continue;
        const deckTopicMatch =
          slugHints.some((h) => d.slug === h || d.title.toLowerCase().includes(h.replace(/-/g, " "))) ||
          Boolean(d.pathwayId && d.pathwayId === pathway.id);
        dbFlash.push({
          kind: "flashcard",
          topicKey: d.slug,
          href,
          anchorText: `${d.title} flashcards`.slice(0, 90),
          score: deckTopicMatch ? 22 : 30,
          strength: deckTopicMatch ? "moderate" : "weak",
          localeMatch: true,
          pathwayMatch: Boolean(d.pathwayId),
        });
      }
    }
  }

  const dbFlashFiltered = dbFlash.filter((c) => c.strength !== "weak");
  const manualLessons = manualLessonCandidatesFromBlog(post.relatedLessonPaths, pathway ?? null);
  const hubExtras = pathway ? pathwayHubCandidates(pathway) : [];

  return mergeResolvedForSurface("blog", {
    lessons: [[...manualLessons, ...dbLessons], registry.lessons],
    flashcards: [dbFlashFiltered, registry.flashcards],
    questions: [registry.questions, hubExtras.filter((c) => c.kind === "question")],
    blogs: [dbBlogs, registry.blogs],
    cat: [registry.cat, hubExtras.filter((c) => c.kind === "cat")],
  });
}

export type PathwayLessonAutoLinkSnapshot = Pick<
  import("@prisma/client").PathwayLesson,
  "slug" | "title" | "topic" | "topicSlug" | "bodySystem"
>;

/**
 * Automatic links for a marketing pathway lesson (complements sequence nav — skips duplicate lesson buckets when desired).
 */
export async function resolveAutomaticRelatedBundleForPathwayLesson(input: {
  pathway: ExamPathwayDefinition;
  lesson: PathwayLessonAutoLinkSnapshot;
  locale: string;
  /** When false, only flashcards + practice entry points (avoids duplicating adjacent lesson nav). */
  includeLessonBucket?: boolean;
}): Promise<ResolvedLinks> {
  const { pathway, lesson, locale } = input;
  const includeLesson = input.includeLessonBucket !== false;
  const topicKey = normalizeTopicKey(lesson.topicSlug) ?? normalizeTopicKey(lesson.topic) ?? lesson.topicSlug;
  const excludeHref = pathwayLessonPublicDetailPath(pathway, lesson.slug);
  const exclude = new Set(
    [excludeHref, excludeHref ? withMarketingLocale(locale, excludeHref) : null].filter(Boolean) as string[],
  );

  const ctx: LinkContext = {
    surface: "lesson",
    locale,
    pathway: pathwayRefFromDefinition(pathway),
    topicKey: topicKey ?? lesson.topicSlug,
    bodySystem: lesson.bodySystem,
    topicHints: [lesson.topic, lesson.topicSlug],
    excludeHrefs: [...exclude],
  };
  const registry = resolveLinks(ctx);

  const dbLessons: LinkCandidate[] = [];
  if (isDatabaseUrlConfigured()) {
    const siblings = await fetchRelatedLessonRows({
      pathwayId: pathway.id,
      excludeSlug: lesson.slug,
      slugHints: [lesson.topicSlug, ...slugHintsFromTags([lesson.topic])],
      category: lesson.bodySystem,
    });
    for (const row of siblings) {
      const sameTopic = row.topicSlug === lesson.topicSlug;
      const sameBody = row.bodySystem === lesson.bodySystem;
      const titleTok = tokenOverlapTitle(lesson.title, row.title);
      const { rank, strength } = scoreLessonSiblingRelatedness({
        sameTopicSlug: sameTopic,
        sameBodySystem: sameBody,
        titleTokenOverlap: titleTok,
      });
      if (strength === "weak") continue;
      const rawHref = pathwayLessonPublicDetailPath(pathway, row.slug);
      if (!rawHref) continue;
      const href = withMarketingLocale(locale, rawHref);
      if (exclude.has(href)) continue;
      dbLessons.push({
        kind: "lesson",
        topicKey: row.topicSlug,
        href,
        anchorText: row.title.trim().slice(0, 90) || row.topic,
        score: rank,
        strength,
        localeMatch: true,
        pathwayMatch: true,
      });
    }
  }

  const slugHints = slugHintsFromTags([lesson.topicSlug, lesson.topic]);
  const dbFlash = (
    await fetchRelatedFlashcardDecks({
      pathway,
      slugHints,
    })
  ).map((d, i) => {
    const href = withMarketingLocale(locale, `/flashcards/${d.slug}`);
    const strong = d.pathwayId === pathway.id;
    return {
      kind: "flashcard" as const,
      topicKey: d.slug,
      href,
      anchorText: `${d.title}`.slice(0, 90),
      score: strong ? 20 : 30,
      strength: (strong ? "moderate" : "weak") as import("@/lib/linking/internal-link-types").MatchStrength,
      localeMatch: true,
      pathwayMatch: strong,
    };
  });
  const dbFlashOk = dbFlash.filter((c) => c.strength !== "weak");
  const hubExtras = pathwayHubCandidates(pathway);

  return mergeResolvedForSurface("lesson", {
    lessons: includeLesson ? [dbLessons, registry.lessons] : [registry.lessons],
    flashcards: [dbFlashOk, registry.flashcards],
    questions: [registry.questions, hubExtras.filter((c) => c.kind === "question")],
    blogs: [registry.blogs],
    cat: [registry.cat, hubExtras.filter((c) => c.kind === "cat")],
  });
}

/** Admin / API: flat list with match metadata for editorial review. */
/** Public pages: require at least this many strong/moderate links before rendering auto blocks. */
export function countHighConfidenceCandidates(resolved: ResolvedLinks): number {
  const q = (items: LinkCandidate[]) => items.filter((c) => c.strength !== "weak").length;
  return (
    q(resolved.lessons) +
    q(resolved.flashcards) +
    q(resolved.questions) +
    q(resolved.blogs) +
    q(resolved.cat)
  );
}

export function buildLinkContextForPublicBlogPost(post: BlogPostAutoLinkSource): LinkContext {
  const pathwayId = pathwayIdForBlogPost(post);
  const pathway = pathwayId ? getExamPathwayById(pathwayId) : undefined;
  const topicKey =
    post.tags.map((t) => normalizeTopicKey(t)).find(Boolean) ?? normalizeTopicKey(post.category) ?? undefined;
  return {
    surface: "blog",
    locale: (post.locale ?? "en").trim() || "en",
    pathway: pathway ? pathwayRefFromDefinition(pathway) : undefined,
    topicKey: topicKey ?? undefined,
    bodySystem: post.category?.trim() && !isTaxonomyLeafForSeo(post.category.trim()) ? post.category.trim() : undefined,
    topicHints: post.tags.slice(0, 8),
    excludeHrefs: [`/blog/${post.slug}`],
  };
}

/**
 * Sync resolver for `/questions/{slug}` — registry + pathway practice entry points (no extra Prisma).
 */
export function resolveAutomaticRelatedLinksForProgrammaticQuestionTopic(
  def: { slug: string; primaryPathwayId: string },
  locale: string,
): ResolvedLinks {
  const pathway = getExamPathwayById(def.primaryPathwayId);
  if (!pathway) {
    return { lessons: [], flashcards: [], questions: [], blogs: [], cat: [] };
  }
  const topicKey = normalizeTopicKey(def.slug.replace(/-/g, " ")) ?? normalizeTopicKey(def.slug) ?? undefined;
  const ctx: LinkContext = {
    surface: "question",
    locale,
    pathway: pathwayRefFromDefinition(pathway),
    topicKey,
    topicHints: [def.slug],
    excludeHrefs: [withMarketingLocale(locale, `/questions/${def.slug}`), `/questions/${def.slug}`],
  };
  const registry = resolveLinks(ctx);
  const hubExtras = pathwayHubCandidates(pathway);
  return mergeResolvedForSurface("question", {
    lessons: [registry.lessons],
    flashcards: [registry.flashcards],
    questions: [registry.questions, hubExtras.filter((c) => c.kind === "question")],
    blogs: [registry.blogs],
    cat: [registry.cat],
  });
}

export function flattenResolvedLinksForAdmin(resolved: ResolvedLinks): LinkCandidate[] {
  return dedupeCandidates([
    ...resolved.lessons,
    ...resolved.flashcards,
    ...resolved.questions,
    ...resolved.blogs,
    ...resolved.cat,
  ]).sort((a, b) => a.score - b.score);
}

export type InlineAnchorSuggestion = {
  anchorText: string;
  href: string;
  kind: LinkCandidate["kind"];
  strength: LinkCandidate["strength"];
  /** Short machine reason for the editor (not shown to learners). */
  reason: string;
};

export function toInlineAnchorSuggestions(resolved: ResolvedLinks): InlineAnchorSuggestion[] {
  const flat = flattenResolvedLinksForAdmin(resolved).filter((c) => c.strength !== "weak").slice(0, 12);
  return flat.map((c) => ({
    anchorText: c.anchorText,
    href: c.href,
    kind: c.kind,
    strength: c.strength,
    reason: `${c.kind} · score ${c.score} · ${c.pathwayMatch ? "pathway" : "generic"}`,
  }));
}
