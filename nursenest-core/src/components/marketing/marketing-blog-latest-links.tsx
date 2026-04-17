import Link from "next/link";
import type { BlogIndexPost } from "@/lib/blog/safe-blog-queries";
import { getPublishedBlogPostsPage } from "@/lib/blog/safe-blog-queries";
import { logBlogLatestLinkHrefs } from "@/lib/seo/seo-url-emission-audit";

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

/**
 * Crawl-friendly internal links to the newest published blog posts.
 * Used on high-authority marketing surfaces (home, lessons, pathway hubs).
 */
export async function MarketingBlogLatestLinks({ take = 3, className, heading, posts: postsProp }: Props) {
  const safeTake = Math.min(6, Math.max(1, Math.floor(take)));
  const posts =
    postsProp !== undefined
      ? postsProp.slice(0, safeTake)
      : (await getPublishedBlogPostsPage(1, safeTake)).posts;
  if (posts.length === 0) return null;

  logBlogLatestLinkHrefs(posts.map((p) => `/blog/${encodeURIComponent(p.slug)}`));

  return (
    <div className={className}>
      {heading ? <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">{heading}</p> : null}
      <ul className="mt-2 flex flex-col gap-1.5 text-sm">
        {posts.map((p) => (
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
