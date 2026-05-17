import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { CollectionPageJsonLd } from "@/components/seo/seo-json-ld";
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
          description: DEFAULT_MARKETING_BLOG_INDEX.metadataDescription,
          url: absoluteUrl(canonicalPath),
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: DEFAULT_MARKETING_BLOG_INDEX.openGraphTitle,
          description: DEFAULT_MARKETING_BLOG_INDEX.metadataDescription,
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
    createdAt: p.createdAt.toISOString(),
  }));

  const collectionItemPaths = posts
    .map((post) => `/blog/${encodeURIComponent(post.slug)}`)
    .slice(0, 30);

  return (
    <div className="nn-blog-index nn-premium-blog-index mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <CollectionPageJsonLd
        title="NurseNest nursing education blog"
        description="Nursing, NCLEX, REx-PN, CNPLE, ECG, allied health, and clinical reasoning articles for Canadian and US healthcare learners."
        path={page <= 1 ? "/blog" : `/blog?page=${page}`}
        itemPaths={collectionItemPaths}
        collectionType="Blog"
      />
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
    </div>
  );
}
