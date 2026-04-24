import Link from "next/link";
import type { BlogIndexPost } from "@/lib/blog/safe-blog-queries";
import { logBlogLatestLinkHrefs } from "@/lib/seo/seo-url-emission-audit";
import { safeServerLog } from "@/lib/observability/safe-server-log";

type Props = {
  /** How many recent posts to surface (keep small for crawl budget + layout). */
  take?: number;
  className?: string;
  /** Optional heading; omit for compact list-only strip. */
  heading?: string;
  /**
   * When set (e.g. homepage), avoids a second DB round-trip and lets parents use
   * {@link loadHomeBlogTeaserPostsSafe} so failures do not fail the whole page.
   */
  posts?: BlogIndexPost[];
};

/** Sync list render when posts are already loaded (e.g. homepage Suspense streaming). */
export function MarketingBlogLatestLinksWithPosts({
  take = 3,
  className,
  heading,
  posts,
}: {
  take?: number;
  className?: string;
  heading?: string;
  posts: BlogIndexPost[];
}) {
  const safeTake = Math.min(6, Math.max(1, Math.floor(take)));
  const sliced = posts.slice(0, safeTake);
  if (sliced.length === 0) return null;

  logBlogLatestLinkHrefs(sliced.map((p) => `/blog/${encodeURIComponent(p.slug)}`));

  return (
    <div className={className}>
      {heading ? <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">{heading}</p> : null}
      <ul className="mt-2 flex flex-col gap-1.5 text-sm">
        {sliced.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${encodeURIComponent(p.slug)}`} className="font-medium text-primary hover:underline">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Crawl-friendly internal links to the newest published blog posts.
 * Used on high-authority marketing surfaces (home, lessons, pathway hubs).
 */
export async function MarketingBlogLatestLinks({ take = 3, className, heading, posts: postsProp }: Props) {
  const safeTake = Math.min(6, Math.max(1, Math.floor(take)));
  if (postsProp !== undefined) {
    return <MarketingBlogLatestLinksWithPosts take={take} className={className} heading={heading} posts={postsProp} />;
  }
  try {
    const page = await (await import("@/lib/blog/safe-blog-queries")).getPublishedBlogPostsPage(
      1,
      safeTake,
      undefined,
      { includeTotal: false },
    );
    if (!page.listLoad.querySucceeded) {
      safeServerLog("blog", "marketing_blog_latest_links_list_load_error", {
        reason: page.listLoad.reasonFailed?.slice(0, 200) ?? "",
      });
      return null;
    }
    return (
      <MarketingBlogLatestLinksWithPosts take={take} className={className} heading={heading} posts={page.posts} />
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("blog", "marketing_blog_latest_links_degraded", {
      reason: msg.slice(0, 200),
    });
    return null;
  }
}
