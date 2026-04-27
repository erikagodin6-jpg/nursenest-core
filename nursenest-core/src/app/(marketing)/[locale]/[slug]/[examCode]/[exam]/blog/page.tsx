import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import {
  getPublishedLocalizedBlogPostsPage,
  LOCALIZED_BLOG_LIST_PAGE_SIZE,
} from "@/lib/blog/safe-localized-blog-queries";
import {
  normalizeBlogIndexParams,
  type RawBlogIndexParams,
  buildLocalizedBlogHref,
} from "@/lib/blog/localized-blog-route-params";
import { isGlobalRegionSlug, REGION_CONFIG } from "@/lib/i18n/global-regions";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { localizedMarketingBlogIndexCopy } from "@/lib/blog/blog-index-hero-copy";

// See src/lib/blog/localized-blog-route-params.ts for why slug/examCode are overloaded here.
type Props = {
  params: Promise<RawBlogIndexParams>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, region, profession, exam } = normalizeBlogIndexParams(await params);
  const pathname = buildLocalizedBlogHref({ locale, region, profession, exam });

  return safeGenerateMetadata(
    async () => {
      if (!isGlobalRegionSlug(region)) return {};
      const regionConfig = REGION_CONFIG[region as GlobalRegionSlug];
      const regionName = regionConfig?.displayName ?? region;
      const copy = localizedMarketingBlogIndexCopy(region as GlobalRegionSlug, regionName, exam);

      return {
        title: copy.metadataTitle,
        description: copy.metadataDescription,
        alternates: { canonical: pathname },
      };
    },
    { pathname, locale, routeGroup: "marketing.locale.localized_blog.index" },
  );
}

export default async function LocalizedBlogIndexPage({ params, searchParams }: Props) {
  const { locale, region, profession, exam } = normalizeBlogIndexParams(await params);
  const sp = await searchParams;

  if (!isCoreHostedNonDefaultLocale(locale) && locale !== "en") notFound();
  if (!isGlobalRegionSlug(region)) notFound();

  const regionConfig = REGION_CONFIG[region as GlobalRegionSlug];
  const regionName = regionConfig?.displayName ?? region;
  const blogIndexCopy = localizedMarketingBlogIndexCopy(region as GlobalRegionSlug, regionName, exam);
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const { posts, total, pageSize } = await getPublishedLocalizedBlogPostsPage({
    locale: locale as GlobalLocaleCode,
    region: region as GlobalRegionSlug,
    profession,
    exam,
    page,
    pageSize: LOCALIZED_BLOG_LIST_PAGE_SIZE,
  });

  const totalPages = Math.ceil(total / pageSize);
  const basePath = buildLocalizedBlogHref({ locale, region, profession, exam });

  const breadcrumbs = [
    { label: "Home", href: `/${locale}/${region}` },
    { label: regionName, href: `/${locale}/${region}` },
    { label: exam.toUpperCase(), href: `/${locale}/${region}/${profession}/${exam}` },
    { label: "Blog", href: basePath },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <BreadcrumbJsonLd items={breadcrumbs.map((b) => ({ name: b.label, item: b.href }))} />
      <div className="mb-6">
        <BreadcrumbTrail items={breadcrumbs.map((b) => ({ name: b.label, href: b.href }))} />
      </div>

      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">{blogIndexCopy.heroH1}</h1>
        <p className="mt-2 text-[var(--theme-muted-text)]">{blogIndexCopy.heroSubtitle}</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-center text-[var(--theme-muted-text)]">
          No articles published yet for this exam pathway.
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-[var(--theme-card-border)] p-5 transition-shadow hover:shadow-md"
            >
              <Link href={buildLocalizedBlogHref({ locale, region, profession, exam, postSlug: post.localizedSlug })} className="group">
                <h2 className="text-xl font-bold text-[var(--theme-heading-text)] group-hover:text-primary">
                  {post.localizedTitle}
                </h2>
                <p className="mt-2 text-sm text-[var(--theme-muted-text)] line-clamp-2">
                  {post.localizedExcerpt}
                </p>
                {post.publishedAt ? (
                  <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
                    {post.publishedAt.toISOString().slice(0, 10)}
                  </p>
                ) : null}
              </Link>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="mt-10 flex items-center justify-center gap-4">
          {page > 1 ? (
            <Link
              href={`${basePath}?page=${page - 1}`}
              className="rounded-lg bg-[var(--theme-page-bg)] px-4 py-2 text-sm font-medium text-primary hover:underline"
            >
              ← Previous
            </Link>
          ) : null}
          <span className="text-sm text-[var(--theme-muted-text)]">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`${basePath}?page=${page + 1}`}
              className="rounded-lg bg-[var(--theme-page-bg)] px-4 py-2 text-sm font-medium text-primary hover:underline"
            >
              Next →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
