import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import {
  BLOG_LIST_PAGE_SIZE,
  getPublishedBlogPostsPage,
} from "@/lib/blog/safe-blog-queries";
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

export async function generateMetadata({
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      return {
        title: "Clinical education blog | NurseNest",
        description:
          "Evidence-based nursing articles on clinical reasoning, pharmacology, lab interpretation, and exam preparation.",
        alternates: { canonical: absoluteUrl("/blog") },
        openGraph: {
          title: "Clinical education blog | NurseNest",
          url: absoluteUrl("/blog"),
          type: "website",
        },
      };
    },
    { pathname: "/blog", routeGroup: "marketing.default.blog" },
  );
}

/** ISR: list is bounded (page size); cache publicly for one hour and revalidate in the background. */
export const revalidate = 3600;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function BlogIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Number(sp.page ?? "1");
  const page = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;
  const { posts, total, pageSize } = await getPublishedBlogPostsPage(page, BLOG_LIST_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const { crumbs, schemaItems } = blogIndexBreadcrumbs();
  const blogInlinePreloaded = await preloadInlineContentMap([...BLOG_INLINE_KEYS]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <RegionalBlogDiscoveryHint />
      <header className="mb-10">
        <EditableHeading
          as="h1"
          className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]"
          contentKey="inline.marketing.blog.index.h1"
          defaultText="Clinical education blog"
          preloaded={blogInlinePreloaded}
        />
        <EditableRichText
          contentKey="inline.marketing.blog.index.lead"
          defaultHtml="<p>Scholarly articles for nursing and allied health exam preparation.</p>"
          className="mt-2 text-[var(--theme-muted-text)] [&_p]:m-0"
          preloaded={blogInlinePreloaded}
        />
      </header>
      {posts.length === 0 ? (
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
          <MarketingStudyCrossLinks className="mt-14" />
        </>
      )}
    </div>
  );
}
