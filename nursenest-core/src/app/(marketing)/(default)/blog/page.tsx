import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import {
  BLOG_LIST_PAGE_SIZE,
  getPublishedBlogPostsPage,
} from "@/lib/blog/safe-blog-queries";
import { blogIndexBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";

export const metadata: Metadata = {
  title: "Clinical education blog | NurseNest",
  description: "Evidence-based nursing articles on clinical reasoning, pharmacology, lab interpretation, and exam preparation.",
  alternates: { canonical: "/blog" },
};

/** ISR: list is bounded (page size); new posts visible within a few minutes without full dynamic SSR. */
export const revalidate = 120;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function BlogIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Number(sp.page ?? "1");
  const page = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;
  const { posts, total, pageSize } = await getPublishedBlogPostsPage(page, BLOG_LIST_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const { crumbs, schemaItems } = blogIndexBreadcrumbs();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">Clinical education blog</h1>
        <p className="mt-2 text-[var(--theme-muted-text)]">Scholarly articles for nursing and allied health exam preparation.</p>
      </header>
      {posts.length === 0 ? (
        <p className="text-sm text-[var(--theme-muted-text)]">
          New clinical articles are added regularly. Check back soon, or explore lessons and the question bank in your account.
        </p>
      ) : (
        <>
          <ul className="space-y-6">
            {posts.map((p) => (
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
        </>
      )}
    </div>
  );
}
