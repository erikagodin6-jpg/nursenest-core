import "server-only";

import { safeAwait } from "@/lib/async/safe-await";
import type { BlogIndexPost } from "@/lib/blog/safe-blog-queries";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const homeBlogTeaserSentryRuntimePromise = import("@/lib/observability/sentry-runtime");

const HOME_BLOG_TEASER_SLOW_MS = 800;
const HOME_BLOG_TEASER_TIMEOUT_MS = 1000;
const HOME_BLOG_TEASER_SENTRY_IMPORT_BUDGET_MS = 2000;

/**
 * Bounded recent posts for the marketing homepage teaser — isolated from the rest of the page so a
 * slow/failed DB read cannot fail the entire `/` render (crawl + first paint).
 */
export async function loadHomeBlogTeaserPostsSafe(take: number): Promise<BlogIndexPost[]> {
  const runtime = await safeAwait(
    homeBlogTeaserSentryRuntimePromise,
    "marketing_home.blog_teaser.sentry_import",
    HOME_BLOG_TEASER_SENTRY_IMPORT_BUDGET_MS,
  );

  const safeTake = Math.min(6, Math.max(1, Math.floor(take)));

  const loadInner = async (): Promise<BlogIndexPost[]> => {
    const t0 = Date.now();
    try {
      const { getPublishedBlogPostsPage } = await import("@/lib/blog/safe-blog-queries");
      const { posts } = await Promise.race([
        getPublishedBlogPostsPage(1, safeTake, undefined, { includeTotal: false }),
        new Promise<{ posts: BlogIndexPost[] }>((_, reject) => {
          setTimeout(() => reject(new Error("home_blog_teaser_timeout")), HOME_BLOG_TEASER_TIMEOUT_MS);
        }),
      ]);
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
      runtime?.captureSentryRuntimeSoftError?.({
        scope: "marketing_home",
        event: "blog_teaser_failed",
        error: e,
        route: "/",
        feature: "marketing_home",
        meta: { take: safeTake, detail: detail.slice(0, 200) },
      });
      return [];
    }
  };

  if (runtime?.withSentryRuntimeSpan) {
    return runtime.withSentryRuntimeSpan(
      {
        name: "marketing.home.blog_teaser",
        op: "resource.load",
        attributes: { route: "/", take: safeTake },
      },
      loadInner,
    );
  }
  return loadInner();
}
