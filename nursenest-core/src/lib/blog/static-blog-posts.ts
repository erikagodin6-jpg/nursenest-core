import {
  STATIC_BLOG_POSTS,
  type StaticBlogPostRecord,
} from "@/content/blog-static-posts";

const posts: StaticBlogPostRecord[] = STATIC_BLOG_POSTS;

export function listStaticBlogPostsForIndex(): StaticBlogPostRecord[] {
  return [...posts].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getStaticBlogPost(slug: string): StaticBlogPostRecord | undefined {
  return posts.find((p) => p.slug === slug);
}

export function countStaticBlogPosts(): number {
  return posts.length;
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
