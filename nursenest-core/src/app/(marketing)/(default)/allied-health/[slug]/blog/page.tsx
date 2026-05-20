import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import { BLOG_LIST_PAGE_SIZE, getPublishedBlogPostsPage } from "@/lib/blog/safe-blog-queries";
import { safeServerLog } from "@/lib/observability/safe-server-log";
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
  const { posts, total, pageSize, listLoad } = await getPublishedBlogPostsPage(page, BLOG_LIST_PAGE_SIZE, {
    locale,
    sourceLocale: "en",
    careerSlug: prof.professionKey,
    allowSourceLocaleFallback: true,
  });
  if (process.env.BLOG_INDEX_ROUTE_LIST_LOAD === "1") {
    safeServerLog("blog", "BLOG_INDEX_ROUTE_LIST_LOAD", {
      pathname: `/allied-health/${slug}/blog`,
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
      {!listLoad.querySucceeded ? (
        <section
          className="mb-6 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--theme-card-bg))] p-6"
          role="alert"
          aria-live="polite"
        >
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Blog list could not load</h2>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            We could not reach the article database. Please refresh or try again shortly.
          </p>
          {listLoad.reasonFailed ? (
            <p className="mt-2 text-xs text-[var(--theme-muted-text)]">Details: {listLoad.reasonFailed}</p>
          ) : null}
        </section>
      ) : posts.length === 0 ? (
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
