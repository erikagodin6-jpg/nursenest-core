import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
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

const BLOG_INLINE_KEYS = [
  "inline.marketing.blog.index.h1",
  "inline.marketing.blog.index.lead",
  "inline.marketing.blog.index.emptyState",
] as const;

export const dynamicParams = true;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      return {
        title: "Nursing exam prep blog for Canada | NurseNest",
        description:
          "Practice-focused NCLEX-RN, REx-PN, and NP articles for Canada: clinical reasoning, pharmacology, and exam strategy. Built for Canadian nurses.",
        robots: { index: true, follow: true },
        alternates: { canonical: absoluteUrl("/blog") },
        openGraph: {
          title: "Nursing exam prep blog for Canada | NurseNest",
          url: absoluteUrl("/blog"),
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
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
      <header className="mb-10">
        <EditableHeading
          as="h1"
          className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]"
          contentKey="inline.marketing.blog.index.h1"
          defaultText="Nursing exam prep blog for Canada"
          preloaded={blogInlinePreloaded}
        />
        <EditableRichText
          contentKey="inline.marketing.blog.index.lead"
          defaultHtml="<p>NCLEX-RN, REx-PN, and NP strategy for Canada: practice-focused articles with rationales and exam context.</p>"
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
              className="mb-12 rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 shadow-sm"
              aria-labelledby="blog-pathophysiology-heading"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <h2
                  id="blog-pathophysiology-heading"
                  className="text-xl font-semibold tracking-tight text-[var(--theme-heading-text)]"
                >
                  Pathophysiology for Nursing Students
                </h2>
                <Link
                  href={pathoTagHref}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Browse all pathophysiology articles
                </Link>
              </div>
              <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
                Exam-style disease mechanisms and clinical reasoning — NCLEX-oriented depth with nursing scope in mind.
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {pathophysiologyHub.map((p) => (
                  <li
                    key={p.slug}
                    className="rounded-lg border border-[var(--theme-separator)] bg-[var(--theme-page-bg)] p-4"
                  >
                    <Link href={`/blog/${p.slug}`} className="font-semibold text-primary hover:underline">
                      {p.title}
                    </Link>
                    {p.category ? (
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">{p.category}</p>
                    ) : null}
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--theme-muted-text)]">{p.excerpt}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {postsForList.length > 0 ? (
            <>
              {page === 1 && showPathophysiologySection ? (
                <h2 className="mb-4 text-lg font-semibold text-[var(--theme-heading-text)]">All articles</h2>
              ) : null}
              <ul className="space-y-6">
                {postsForList.map((p) => (
                  <li key={p.slug} className="border-b border-[var(--theme-separator)] pb-6">
                    <Link href={`/blog/${p.slug}`} className="text-lg font-semibold text-primary hover:underline">
                      {p.title}
                    </Link>
                    {p.category ? (
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">{p.category}</p>
                    ) : null}
                    <p className="mt-2 line-clamp-3 text-sm text-[var(--theme-muted-text)]">{p.excerpt}</p>
                    <p className="mt-2 text-xs text-[var(--theme-muted-text)]">{p.createdAt.toISOString().slice(0, 10)}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : page === 1 && showPathophysiologySection ? (
            <p className="text-sm text-[var(--theme-muted-text)]">More clinical articles appear in the list as they publish.</p>
          ) : null}
          {totalPages > 1 ? (
            <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm" aria-label="Blog pagination">
              <span className="text-[var(--theme-muted-text)]">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-3">
                {page > 1 ? (
                  <Link
                    href={page === 2 ? "/blog" : `/blog?page=${page - 1}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="text-[var(--theme-muted-text)]">Previous</span>
                )}
                {page < totalPages ? (
                  <Link href={`/blog?page=${page + 1}`} className="font-medium text-primary hover:underline">
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
