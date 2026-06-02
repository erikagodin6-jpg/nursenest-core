import "server-only";

import { type PrismaClient } from "@prisma/client";
import { blogLiveWhere } from "@/lib/blog/blog-visibility";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { evaluatePublicMarketingLessonCrossLinkIntegrity } from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
import type { SeoContentDomain, SeoTier } from "@/lib/seo/seo-taxonomy-align";
import { TAXONOMY } from "@/lib/taxonomy/taxonomy";

export type ResolvedInternalLink = {
  anchor: string;
  href: string;
  kind: "blog" | "lesson" | "hub";
};

/**
 * Returns 3–5 related internal links: same taxonomy category first, then cross-links.
 * Queries are bounded (`take`) — safe for save-time hooks.
 */
export async function resolveRelatedInternalLinks(
  prisma: PrismaClient,
  input: {
    category: string;
    domain: SeoContentDomain;
    tier: SeoTier;
    pathwayId?: string | null;
    locale?: string | null;
    limit?: number;
  },
): Promise<ResolvedInternalLink[]> {
  void input.tier;
  const limit = Math.min(Math.max(input.limit ?? 5, 3), 8);
  const out: ResolvedInternalLink[] = [];
  const cat = input.category;
  const now = new Date();

  const blogRows = await prisma.blogPost.findMany({
    where: {
      AND: [
        blogLiveWhere(now),
        { OR: [{ category: cat }, { tags: { has: cat } }] },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: 3,
    select: { slug: true, title: true, seoTitle: true },
  });

  for (const b of blogRows) {
    const anchor = (b.seoTitle ?? b.title).trim().slice(0, 90) || b.slug;
    out.push({ anchor, href: `/blog/${b.slug}`, kind: "blog" });
  }

  const pathway = input.pathwayId ? getExamPathwayById(input.pathwayId) : undefined;
  if (pathway && input.locale) {
    const lessonContentLocale = await getMarketingLocaleForDefaultRoute();
    const lessons = await prisma.pathwayLesson.findMany({
      where: { pathwayId: pathway.id, locale: input.locale, bodySystem: cat },
      orderBy: { updatedAt: "desc" },
      take: 2,
      select: { slug: true, title: true, topic: true },
    });
    for (const l of lessons) {
      const ev = await evaluatePublicMarketingLessonCrossLinkIntegrity(pathway, l.slug, lessonContentLocale);
      if (!ev.ok) continue;
      const anchor = (l.title || l.topic).trim().slice(0, 90) || l.slug;
      const href = pathwayLessonPublicDetailPath(pathway, l.slug);
      if (href) out.push({ anchor, href, kind: "lesson" });
    }
  }

  if (input.domain === "CLINICAL" && out.length < limit) {
    const pharmCats = [...TAXONOMY.PHARMACOLOGY];
    const pharm = await prisma.blogPost.findMany({
      where: { AND: [blogLiveWhere(now), { category: { in: pharmCats } }] },
      orderBy: { updatedAt: "desc" },
      take: 1,
      select: { slug: true, title: true, seoTitle: true },
    });
    for (const b of pharm) {
      const anchor = (b.seoTitle ?? b.title).trim().slice(0, 90) || b.slug;
      out.push({
        anchor: `${anchor} (related pharmacology review)`,
        href: `/blog/${b.slug}`,
        kind: "blog",
      });
    }
  }

  if (out.length < 3) {
    out.push({
      anchor: "NCLEX-style practice questions with rationales",
      href: "/practice-exams",
      kind: "hub",
    });
  }

  return dedupeLinks(out).slice(0, limit);
}

function dedupeLinks(links: ResolvedInternalLink[]): ResolvedInternalLink[] {
  const seen = new Set<string>();
  const r: ResolvedInternalLink[] = [];
  for (const l of links) {
    const k = `${l.href}|${l.anchor.toLowerCase()}`;
    if (seen.has(k)) continue;
    seen.add(k);
    r.push(l);
  }
  return r;
}
