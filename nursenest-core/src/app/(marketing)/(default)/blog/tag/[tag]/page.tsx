import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import {
  BLOG_LIST_PAGE_SIZE,
  countPublishedPostsWithTag,
  getPublishedBlogPostsByTagPage,
} from "@/lib/blog/safe-blog-queries";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { blogTagBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ tag: string }>; searchParams: Promise<{ page?: string }> };

export const revalidate = 3600;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag).trim();
  return safeGenerateMetadata(
    async () => {
      const count = await countPublishedPostsWithTag(decoded);
      const sp = await searchParams;
      const raw = Number(sp.page ?? "1");
      const page = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;
      const path = `/blog/tag/${encodeURIComponent(decoded)}`;
      const canonicalPath = page <= 1 ? path : `${path}?page=${page}`;
      return {
        title: `Posts tagged “${decoded}” | NurseNest blog`,
        alternates: { canonical: absoluteUrl(canonicalPath) },
        openGraph: { url: absoluteUrl(canonicalPath) },
        ...(count === 0 ? { robots: { index: false, follow: true } } : {}),
      };
    },
    { pathname: `/blog/tag/${encodeURIComponent(decoded)}`, routeGroup: "marketing.default.blog.tag" },
  );
}

export default async function BlogTagPage({ params, searchParams }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag).trim();
  if (!decoded) notFound();

  const sp = await searchParams;
  const raw = Number(sp.page ?? "1");
  const page = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;

  const { posts, total, pageSize } = await getPublishedBlogPostsByTagPage(decoded, page, BLOG_LIST_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const base = `/blog/tag/${encodeURIComponent(decoded)}`;
  const { crumbs, schemaItems } = blogTagBreadcrumbs(decoded);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {total > 0 ? <BreadcrumbJsonLd items={schemaItems} /> : null}
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
        ← Blog
      </Link>
      <header className="mt-6 mb-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">Tag: {decoded}</h1>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          {total} post{total === 1 ? "" : "s"}
        </p>
      </header>
      {posts.length === 0 ? (
        <p className="text-sm text-[var(--theme-muted-text)]">No published posts with this tag yet.</p>
      ) : (
        <>
          <ul className="space-y-6">
            {posts.map((p) => (
              <li key={p.slug} className="border-b border-[var(--theme-separator)] pb-6">
                <Link href={`/blog/${p.slug}`} className="text-lg font-semibold text-primary hover:underline">
                  {p.title}
                </Link>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--theme-muted-text)]">{p.excerpt}</p>
                <p className="mt-2 text-xs text-[var(--theme-muted-text)]">{p.createdAt.toISOString().slice(0, 10)}</p>
              </li>
            ))}
          </ul>
          {totalPages > 1 ? (
            <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm" aria-label="Tag results pagination">
              <span className="text-[var(--theme-muted-text)]">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-3">
                {page > 1 ? (
                  <Link
                    href={page === 2 ? base : `${base}?page=${page - 1}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="text-[var(--theme-muted-text)]">Previous</span>
                )}
                {page < totalPages ? (
                  <Link href={`${base}?page=${page + 1}`} className="font-medium text-primary hover:underline">
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
