import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import {
  buildLinkContextForPublicBlogPost,
  resolveAutomaticRelatedBundleForBlogPost,
  toInlineAnchorSuggestions,
} from "@/lib/linking/automatic-internal-links";

type RouteContext = { params: Promise<{ id: string }> };

const select = {
  slug: true,
  title: true,
  tags: true,
  category: true,
  exam: true,
  countryTarget: true,
  locale: true,
  relatedLessonPaths: true,
} as const;

export async function GET(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const row = await prisma.blogPost.findUnique({ where: { id }, select: select });
  if (!row) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  const resolved = await resolveAutomaticRelatedBundleForBlogPost(row);
  const suggestions = toInlineAnchorSuggestions(resolved);
  const linkContext = buildLinkContextForPublicBlogPost(row);

  return NextResponse.json({
    ok: true,
    postId: id,
    slug: row.slug,
    linkContext,
    suggestions,
    counts: {
      lessons: resolved.lessons.length,
      flashcards: resolved.flashcards.length,
      questions: resolved.questions.length,
      blogs: resolved.blogs.length,
      cat: resolved.cat.length,
    },
  });
}
