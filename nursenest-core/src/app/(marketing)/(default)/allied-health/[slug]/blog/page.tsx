import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import { BLOG_LIST_PAGE_SIZE, getPublishedBlogPostsPage } from "@/lib/blog/safe-blog-queries";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prof = getAlliedProfessionByProfessionKey(slug);
  if (!prof) return {};
  return safeGenerateMetadata(
    async () => {
      const sp = await searchParams;
      const raw = Number(sp.page ?? "1");
      const page = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;
      const canonicalPath =
        page <= 1 ? `/allied-health/${slug}/blog` : `/allied-health/${slug}/blog?page=${page}`;
      return {
        title: `${prof.title} blog | NurseNest`,
        description: `Clinical and exam-prep blog content for ${prof.title}.`,
        alternates: { canonical: absoluteUrl(canonicalPath) },
        openGraph: { title: `${prof.title} blog | NurseNest`, url: absoluteUrl(canonicalPath), type: "website" },
      };
    },
    { pathname: `/allied-health/${slug}/blog`, routeGroup: "marketing.default.allied_health.slug.blog" },
  );
}

export default async function AlliedProfessionBlogIndexPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const prof = getAlliedProfessionByProfessionKey(slug);
  if (!prof) notFound();
  const locale = await getMarketingLocaleForDefaultRoute();
  const sp = await searchParams;
  const raw = Number(sp.page ?? "1");
  const page = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;
  const { posts, total, pageSize } = await getPublishedBlogPostsPage(page, BLOG_LIST_PAGE_SIZE, {
    locale,
    sourceLocale: "en",
    careerSlug: prof.professionKey,
    allowSourceLocaleFallback: true,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const crumbs = [
    { name: "Allied health", href: "/allied-health" },
    { name: prof.h1, href: `/allied-health/${slug}` },
    { name: "Blog" },
  ];
  const schemaItems = [
    { name: "Allied health", item: absoluteUrl("/allied-health") },
    { name: prof.h1, item: absoluteUrl(`/allied-health/${slug}`) },
    { name: "Blog", item: absoluteUrl(`/allied-health/${slug}/blog`) },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">
          {prof.h1} blog
        </h1>
        <p className="mt-2 text-[var(--theme-muted-text)]">
          Profession-specific clinical insights, certification strategies, and practical study guidance.
        </p>
      </header>
      {posts.length === 0 ? (
        <p className="text-sm text-[var(--theme-muted-text)]">
          No published posts yet for this profession. Check back soon.
        </p>
      ) : (
        <>
          <ul className="space-y-6">
            {posts.map((p) => (
              <li key={p.slug} className="border-b border-[var(--theme-separator)] pb-6">
                <Link href={`/allied-health/${slug}/blog/${p.slug}`} className="text-lg font-semibold text-primary hover:underline">
                  {p.title}
                </Link>
                {p.category ? (
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">
                    {p.category}
                  </p>
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
                    href={page === 2 ? `/allied-health/${slug}/blog` : `/allied-health/${slug}/blog?page=${page - 1}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="text-[var(--theme-muted-text)]">Previous</span>
                )}
                {page < totalPages ? (
                  <Link href={`/allied-health/${slug}/blog?page=${page + 1}`} className="font-medium text-primary hover:underline">
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
