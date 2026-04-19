import "server-only";

import Link from "next/link";
import type { BlogIndexPost } from "@/lib/blog/safe-blog-queries";
import { loadHomeBlogTeaserPostsSafe } from "@/lib/blog/home-blog-teaser";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { MarketingBlogLatestLinksWithPosts } from "@/components/marketing/marketing-blog-latest-links";

export function HomeBlogTeaserSectionShell({ m, posts }: { m: MarketingMessages; posts: BlogIndexPost[] }) {
  return (
    <section className="mx-auto mt-6 w-full max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
      <div className="nn-card border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">
              {resolveMarketingCopy(m, "pages.home.blogTeaser.title", undefined, "")}
            </h2>
            <p className="mt-1 max-w-prose text-sm text-[var(--theme-muted-text)]">
              {resolveMarketingCopy(m, "pages.home.blogTeaser.subtitle", undefined, "")}
            </p>
          </div>
          <Link href="/blog" className="shrink-0 text-sm font-semibold text-primary hover:underline">
            {resolveMarketingCopy(m, "pages.home.blogTeaser.viewAll", undefined, "")}
          </Link>
        </div>
        <MarketingBlogLatestLinksWithPosts
          take={3}
          posts={posts}
          className="mt-4 border-t border-[var(--border-subtle)] pt-4"
          heading={resolveMarketingCopy(m, "pages.home.blogTeaser.latestHeading", undefined, "")}
        />
      </div>
    </section>
  );
}

/**
 * Async tail for homepage blog teaser — streamed after shell so `/` first byte is not blocked on DB.
 * (When optional marketing DB reads are skipped, the parent renders {@link HomeBlogTeaserSectionShell} only.)
 */
export async function HomeBlogTeaserSectionAsync({ m }: { m: MarketingMessages }) {
  const posts = await loadHomeBlogTeaserPostsSafe(3);
  return <HomeBlogTeaserSectionShell m={m} posts={posts} />;
}
