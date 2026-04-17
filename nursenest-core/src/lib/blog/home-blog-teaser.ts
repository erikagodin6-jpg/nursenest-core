import "server-only";

import type { BlogIndexPost } from "@/lib/blog/safe-blog-queries";
import { getPublishedBlogPostsPage } from "@/lib/blog/safe-blog-queries";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const HOME_BLOG_TEASER_SLOW_MS = 800;

/**
 * Bounded recent posts for the marketing homepage teaser — isolated from the rest of the page so a
 * slow/failed DB read cannot fail the entire `/` render (crawl + first paint).
 */
export async function loadHomeBlogTeaserPostsSafe(take: number): Promise<BlogIndexPost[]> {
  const t0 = Date.now();
  const safeTake = Math.min(6, Math.max(1, Math.floor(take)));
  try {
    const { posts } = await getPublishedBlogPostsPage(1, safeTake);
    const ms = Date.now() - t0;
    if (ms > HOME_BLOG_TEASER_SLOW_MS) {
      safeServerLog("crawl_surface", "home_blog_teaser_slow", { ms, count: posts.length });
    }
    return posts;
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    safeServerLog("crawl_surface", "home_blog_teaser_failed", {
      ms: Date.now() - t0,
      detail: detail.slice(0, 200),
    });
    return [];
  }
}
