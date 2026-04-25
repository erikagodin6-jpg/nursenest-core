import "server-only";

import Link from "next/link";
import type { BlogIndexPost } from "@/lib/blog/safe-blog-queries";
import { loadHomeBlogTeaserPostsSafe } from "@/lib/blog/home-blog-teaser";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { getOptionalPublicMessage } from "@/lib/marketing-i18n-core";
import { MarketingBlogLatestLinksWithPosts } from "@/components/marketing/marketing-blog-latest-links";

function safeMessage(m: MarketingMessages, key: string): string {
  try {
    return getOptionalPublicMessage(m, key).trim();
  } catch {
    return "";
  }
}

async function loadPostsSafe(): Promise<BlogIndexPost[]> {
  try {
    return await loadHomeBlogTeaserPostsSafe(3);
  } catch {
    return [];
  }
}

export function HomeBlogTeaserSectionShell({
  m,
  posts,
}: {
  m: MarketingMessages;
  posts: BlogIndexPost[];
}) {
  const title = safeMessage(m, "pages.home.blogTeaser.title");
  const subtitle = safeMessage(m, "pages.home.blogTeaser.subtitle");
  const viewAll = safeMessage(m, "pages.home.blogTeaser.viewAll");
  const latestHeading = safeMessage(m, "pages.home.blogTeaser.latestHeading");

  const safePosts = Array.isArray(posts) ? posts : [];
  const hasList = safePosts.length > 0;
  const hasTopCopy = Boolean(title || subtitle || viewAll);

  if (!hasTopCopy && !hasList) return null;

  return (
    <section className="mx-auto mt-6 w-full max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
      <div className="nn-card border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-5">
        {hasTopCopy ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            {title || subtitle ? (
              <div>
                {title ? (
                  <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">
                    {title}
                  </h2>
                ) : null}

                {subtitle ? (
                  <p className="mt-1 max-w-prose text-sm text-[var(--theme-muted-text)]">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            ) : null}

            {viewAll ? (
              <Link
                href="/blog"
                className="shrink-0 text-sm font-semibold text-primary hover:underline"
              >
                {viewAll}
              </Link>
            ) : null}
          </div>
        ) : null}

        {hasList ? (
          <MarketingBlogLatestLinksWithPosts
            take={3}
            posts={safePosts}
            className={hasTopCopy ? "mt-4 border-t border-[var(--border-subtle)] pt-4" : ""}
            heading={latestHeading || undefined}
          />
        ) : null}
      </div>
    </section>
  );
}

export async function HomeBlogTeaserSectionAsync({ m }: { m: MarketingMessages }) {
  const posts = await loadPostsSafe();
  return <HomeBlogTeaserSectionShell m={m} posts={posts} />;
}