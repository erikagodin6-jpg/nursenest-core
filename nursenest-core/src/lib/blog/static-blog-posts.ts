import type { StaticBlogPostRecord } from "@/content/blog-static-posts";

type StaticBlogPostsModule = {
  STATIC_BLOG_POSTS: StaticBlogPostRecord[];
};

let staticBlogPostsCache: StaticBlogPostRecord[] | null = null;

function getStaticBlogPosts(): StaticBlogPostRecord[] {
  if (staticBlogPostsCache) return staticBlogPostsCache;
  staticBlogPostsCache = (require("@/content/blog-static-posts") as StaticBlogPostsModule).STATIC_BLOG_POSTS;
  return staticBlogPostsCache;
}

export function listStaticBlogPostsForIndex(): StaticBlogPostRecord[] {
  return [...getStaticBlogPosts()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getStaticBlogPost(slug: string): StaticBlogPostRecord | undefined {
  return getStaticBlogPosts().find((p) => p.slug === slug);
}

export function countStaticBlogPosts(): number {
  return getStaticBlogPosts().length;
}

/** Shape consumed by `/blog/[slug]` rendering (matches Prisma fields used there). */
export function staticRecordToBlogDisplay(s: StaticBlogPostRecord) {
  return {
    title: s.title,
    excerpt: s.excerpt,
    category: s.category,
    createdAt: new Date(s.createdAt + "T12:00:00Z"),
    body: s.bodyHtml,
    tags: s.tags,
    coverImage: null as string | null,
    exam: null as string | null,
    relatedLessonPaths: [] as string[],
    relatedQuestionIds: [] as string[],
    relatedTools: [] as string[],
    publishAt: null as Date | null,
    seoTitle: null as string | null,
    seoDescription: null as string | null,
  };
}
