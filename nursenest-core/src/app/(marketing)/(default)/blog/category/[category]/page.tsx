import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import {
  BLOG_LIST_PAGE_SIZE,
  countPublishedPostsWithCategory,
  getPublishedBlogPostsByCategoryPage,
} from "@/lib/blog/safe-blog-queries";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { blogCategoryBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ category: string }>; searchParams: Promise<{ page?: string }> };

export const revalidate = 3600;

function getCanonicalBlogPostHref(slug: unknown): string | null {
  if (typeof slug !== "string") return null;
  const trimmed = slug.trim();
  if (!trimmed) return null;
  return `/blog/${encodeURIComponent(trimmed)}`;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category).trim();
  return safeGenerateMetadata(
    async () => {
      const count = await countPublishedPostsWithCategory(decoded);
      const sp = await searchParams;
      const raw = Number(sp.page ?? "1");
      const page = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;
      const path = `/blog/category/${encodeURIComponent(decoded)}`;
      const canonicalPath = page <= 1 ? path : `${path}?page=${page}`;
      return {
        title: `Posts in “${decoded}” | NurseNest blog`,
        alternates: { canonical: absoluteUrl(canonicalPath) },
        openGraph: { url: absoluteUrl(canonicalPath) },
        ...(count === 0 ? { robots: { index: false, follow: true } } : {}),
      };
    },
    { pathname: `/blog/category/${encodeURIComponent(decoded)}`, routeGroup: "marketing.default.blog.category" },
  );
}

export default async function BlogCategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const decoded = decodeURIComponent(category).trim();
  if (!decoded) notFound();

  const sp = await searchParams;
  const raw = Number(sp.page ?? "1");
  const page = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;

  const { posts, total, pageSize } = await getPublishedBlogPostsByCategoryPage(decoded, page, BLOG_LIST_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const base = `/blog/category/${encodeURIComponent(decoded)}`;
  const { crumbs, schemaItems } = blogCategoryBreadcrumbs(decoded);

  return (
    <div className="nn-blog-index nn-premium-blog-index mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {total > 0 ? <BreadcrumbJsonLd items={schemaItems} /> : null}
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link
        href="/blog"
        className="nn-premium-blog-back-link inline-flex min-h-[44px] min-w-0 items-center text-sm font-semibold text-primary hover:underline"
      >
        ← Back to blog
      </Link>
      <header className="mt-6 mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
          Browse by category
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
          {decoded}
        </h1>
        <p className="mt-3 text-sm text-[var(--theme-muted-text)]">
          {total} article{total === 1 ? "" : "s"} in this clinical category.
        </p>
      </header>
      {posts.length === 0 ? (
        <p className="text-sm text-[var(--theme-muted-text)]">No published posts in this category yet.</p>
      ) : (
        <>
          <ul className="grid list-none gap-4 sm:grid-cols-2">
            {posts.map((p) => {
              const href = getCanonicalBlogPostHref(p.slug);
              if (!href) {
                console.error("[blog-category] missing post slug", { category: decoded, title: p.title });
              }
              return (
                <BlogPostCard
                  key={p.slug || p.title}
                  post={{
                    slug: typeof p.slug === "string" ? p.slug : "",
                    title: p.title,
                    excerpt: p.excerpt,
                    category: p.category ?? null,
                    createdAt: p.createdAt,
                  }}
                />
              );
            })}
          </ul>
          {totalPages > 1 ? (
            <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm" aria-label="Category results pagination">
              <span className="text-[var(--theme-muted-text)]">
                Page {page} of {totalPages}
              </span>
              <div className="flex flex-wrap gap-3">
                {page > 1 ? (
                  <Link
                    href={page === 2 ? base : `${base}?page=${page - 1}`}
                    className="inline-flex min-h-[44px] min-w-0 items-center font-semibold text-primary hover:underline"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="text-[var(--theme-muted-text)]">Previous</span>
                )}
                {page < totalPages ? (
                  <Link href={`${base}?page=${page + 1}`} className="inline-flex min-h-[44px] min-w-0 items-center font-semibold text-primary hover:underline">
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
