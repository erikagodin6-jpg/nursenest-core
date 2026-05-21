import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogMarketingPostListClient } from "@/components/blog/blog-marketing-post-list-client";
import {
  BLOG_LIST_PAGE_SIZE,
  PATHOPHYSIOLOGY_HUB_PRIMARY_TAG,
  getPathophysiologyBlogHubPosts,
  getPublishedBlogPostsPage,
} from "@/lib/blog/safe-blog-queries";
import { logPublicContentSurfaceFailure } from "@/lib/observability/public-content-surface-failure-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { blogIndexBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { RegionalBlogDiscoveryHint } from "@/components/marketing/regional-blog-discovery-hint";
import {
  EditableHeading,
  EditableRichText,
  EditableText,
  preloadInlineContentMap,
} from "@/components/inline-content";
import { DEFAULT_MARKETING_BLOG_INDEX } from "@/lib/blog/blog-index-hero-copy";
import { blogPostCreatedAtIso } from "@/lib/blog/safe-blog-post-date";

const BLOG_INLINE_KEYS = [
  "inline.marketing.blog.index.h1",
  "inline.marketing.blog.index.lead",
  "inline.marketing.blog.index.emptyState",
] as const;

export const dynamicParams = true;

// ISR + searchParams: without force-dynamic, Next.js serves ISR-cached page=1 metadata for all paginated variants.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const sp = await searchParams;
  const rawPage = Number(sp.page ?? "1");
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
  const canonicalPath = page <= 1 ? "/blog" : `/blog?page=${page}`;
  return safeGenerateMetadata(
    async () => {
      return {
        title: DEFAULT_MARKETING_BLOG_INDEX.metadataTitle,
        description: DEFAULT_MARKETING_BLOG_INDEX.metadataDescription,
        robots: { index: true, follow: true },
        alternates: { canonical: absoluteUrl(canonicalPath) },
        openGraph: {
          title: DEFAULT_MARKETING_BLOG_INDEX.openGraphTitle,
          url: absoluteUrl(canonicalPath),
          type: "website",
        },
      };
    },
    { pathname: "/blog", routeGroup: "marketing.default.blog" },
  );
}

/**
 * ISR backup window. On-demand revalidation runs on publish/approve/cron; keep this shorter so a missed
 * `revalidatePath` does not hide new posts for a full hour.
 */
export const revalidate = 180;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function BlogIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Number(sp.page ?? "1");
  const page = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;
  const [{ posts, total, pageSize, listLoad }, pathophysiologyHub] = await Promise.all([
    getPublishedBlogPostsPage(page, BLOG_LIST_PAGE_SIZE),
    page === 1 ? getPathophysiologyBlogHubPosts(12) : Promise.resolve([]),
  ]);
  if (process.env.BLOG_INDEX_ROUTE_LIST_LOAD === "1") {
    safeServerLog("blog", "BLOG_INDEX_ROUTE_LIST_LOAD", {
      pathname: "/blog",
      page: String(page),
      querySucceeded: listLoad.querySucceeded ? "1" : "0",
      source: listLoad.source,
      rawCount: listLoad.rawCount === null ? "" : String(listLoad.rawCount),
      filteredCount: listLoad.filteredCount === null ? "" : String(listLoad.filteredCount),
      finalCount: String(listLoad.finalCount),
      reasonFailed: listLoad.reasonFailed ?? "",
      reasonDropped: listLoad.reasonDropped ?? "",
    });
  }
  if (!listLoad.querySucceeded) {
    logPublicContentSurfaceFailure({
      surface: "blog",
      reason: listLoad.reasonFailed ?? "blog_index_list_load_failed",
      count: listLoad.finalCount,
      exampleUrls: ["/blog"],
    });
  } else if (page === 1 && posts.length < 8) {
    logPublicContentSurfaceFailure({
      surface: "blog",
      reason: "blog_index_below_marketing_minimum_article_rows",
      count: posts.length,
      exampleUrls: posts.slice(0, 3).map((p) => `/blog/${p.slug}`),
    });
  }
  const pathoSlugSet = new Set(pathophysiologyHub.map((p) => p.slug));
  const postsForList = page === 1 ? posts.filter((p) => !pathoSlugSet.has(p.slug)) : posts;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const { crumbs, schemaItems } = blogIndexBreadcrumbs();
  const blogInlinePreloaded = await preloadInlineContentMap([...BLOG_INLINE_KEYS]);
  const pathoTagHref = `/blog/tag/${encodeURIComponent(PATHOPHYSIOLOGY_HUB_PRIMARY_TAG)}`;
  const showPathophysiologySection = pathophysiologyHub.length > 0;
  const showEmptyState = posts.length === 0 && !showPathophysiologySection;
  const showListLoadError = !listLoad.querySucceeded;

  const featured = page === 1 && postsForList.length > 0 ? postsForList[0] : null;
  const clientPostsRaw = featured ? postsForList.slice(1) : postsForList;
  const clientPosts = clientPostsRaw.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category ?? null,
    createdAt: blogPostCreatedAtIso(p.createdAt),
  }));

  return (
    <div className="nn-blog-index nn-premium-blog-index mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <RegionalBlogDiscoveryHint />
      {showListLoadError ? (
        <>
          <section
            className="mb-10 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--theme-card-bg))] p-6"
            role="alert"
            aria-live="polite"
          >
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Blog list could not load</h2>
            <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
              We could not reach the article database. This is usually temporary — refresh the page or try again in a
              moment.
            </p>
            <p className="mt-3 text-xs text-[var(--theme-muted-text)]">
              {listLoad.reasonFailed ? `Details: ${listLoad.reasonFailed}` : null}
            </p>
          </section>
          <MarketingStudyCrossLinks className="mt-10" />
        </>
      ) : null}
      <header className="mb-10 max-w-3xl">
        <EditableHeading
          as="h1"
          className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl"
          contentKey="inline.marketing.blog.index.h1"
          defaultText={DEFAULT_MARKETING_BLOG_INDEX.inlineH1Default}
          preloaded={blogInlinePreloaded}
        />
        <EditableRichText
          contentKey="inline.marketing.blog.index.lead"
          defaultHtml={DEFAULT_MARKETING_BLOG_INDEX.inlineLeadHtmlDefault}
          className="mt-2 text-[var(--theme-muted-text)] [&_p]:m-0"
          preloaded={blogInlinePreloaded}
        />
      </header>
      {showListLoadError ? null : showEmptyState ? (
        <>
          <EditableText
            as="p"
            className="text-sm text-[var(--theme-muted-text)]"
            contentKey="inline.marketing.blog.index.emptyState"
            defaultText="New clinical articles are added regularly. Check back soon, or explore lessons and the question bank in your account."
            preloaded={blogInlinePreloaded}
          />
          <MarketingStudyCrossLinks className="mt-10" />
        </>
      ) : (
        <>
          {showPathophysiologySection ? (
            <section
              className="nn-premium-blog-patho-spotlight nn-spectrum-rule-top mb-12 overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-7"
              aria-labelledby="blog-pathophysiology-heading"
              data-nn-blog-spotlight="pathophysiology"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2
                    id="blog-pathophysiology-heading"
                    className="text-xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-2xl"
                  >
                    Pathophysiology for nursing students
                  </h2>
                  <p className="mt-2 max-w-prose text-sm text-[var(--theme-muted-text)]">
                    Exam-style disease mechanisms and clinical reasoning — NCLEX-oriented depth with nursing scope in mind.
                  </p>
                </div>
                <Link
                  href={pathoTagHref}
                  className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/15"
                >
                  Browse all pathophysiology articles
                </Link>
              </div>
              <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2">
                {pathophysiologyHub.map((p) => (
                  <BlogPostCard
                    key={p.slug}
                    post={{
                      slug: p.slug,
                      title: p.title,
                      excerpt: p.excerpt,
                      category: p.category ?? null,
                      createdAt: p.createdAt,
                    }}
                  />
                ))}
              </ul>
            </section>
          ) : null}
          {postsForList.length > 0 ? (
            <>
              {page === 1 && showPathophysiologySection ? (
                <h2 className="mb-4 text-lg font-semibold text-[var(--theme-heading-text)]">All articles</h2>
              ) : null}
              {featured ? (
                <div className="mb-8">
                  <h3 className="sr-only">Featured article</h3>
                  <ul className="grid list-none gap-4 sm:grid-cols-2">
                    <BlogPostCard
                      featured
                      post={{
                        slug: featured.slug,
                        title: featured.title,
                        excerpt: featured.excerpt,
                        category: featured.category ?? null,
                        createdAt: featured.createdAt,
                      }}
                    />
                  </ul>
                </div>
              ) : null}
              {clientPosts.length > 0 ? <BlogMarketingPostListClient posts={clientPosts} /> : null}
              {featured && clientPosts.length === 0 ? (
                <p className="text-sm text-[var(--theme-muted-text)]">More articles appear here as they publish.</p>
              ) : null}
            </>
          ) : page === 1 && showPathophysiologySection ? (
            <p className="text-sm text-[var(--theme-muted-text)]">More clinical articles appear in the list as they publish.</p>
          ) : null}
          {totalPages > 1 ? (
            <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm" aria-label="Blog pagination">
              <span className="text-[var(--theme-muted-text)]">
                Page {page} of {totalPages}
              </span>
              <div className="flex flex-wrap gap-3">
                {page > 1 ? (
                  <Link
                    href={page === 2 ? "/blog" : `/blog?page=${page - 1}`}
                    className="inline-flex min-h-[44px] items-center font-semibold text-primary hover:underline"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="text-[var(--theme-muted-text)]">Previous</span>
                )}
                {page < totalPages ? (
                  <Link href={`/blog?page=${page + 1}`} className="inline-flex min-h-[44px] items-center font-semibold text-primary hover:underline">
                    Next
                  </Link>
                ) : (
                  <span className="text-[var(--theme-muted-text)]">Next</span>
                )}
              </div>
            </nav>
          ) : null}
          <MarketingStudyCrossLinks className="mt-14" />
        </>
      )}
    </div>
  );
}
