import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpenCheck,
  Brain,
  ClipboardCheck,
  GraduationCap,
  HeartPulse,
  Search,
  Sparkles,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogMarketingPostListClient } from "@/components/blog/blog-marketing-post-list-client";
import {
  BLOG_LIST_PAGE_SIZE,
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

const BLOG_PUBLIC_MAX_PAGE = 250;

const pathwayCards = [
  { label: "NCLEX-RN", href: "/blog/category/NCLEX-RN", count: "RN exam articles", icon: Stethoscope },
  { label: "REx-PN", href: "/blog/category/REx-PN", count: "Canadian PN prep", icon: ClipboardCheck },
  { label: "NCLEX-PN", href: "/blog/category/NCLEX-PN", count: "PN exam strategy", icon: GraduationCap },
  { label: "Nurse Practitioner", href: "/blog/category/NP", count: "Advanced practice", icon: HeartPulse },
  { label: "Allied Health", href: "/blog/category/Allied%20Health", count: "Clinical career guides", icon: UsersRound },
  { label: "Study Strategies", href: "/blog/tag/study%20tips", count: "Smarter study loops", icon: BookOpenCheck },
  { label: "Clinical Judgment", href: "/blog/tag/clinical%20judgment", count: "Think like a nurse", icon: Brain },
] as const;

const topicExplorerLinks = [
  ["Med-Surg", "/blog/tag/med-surg"],
  ["Pharmacology", "/blog/tag/pharmacology"],
  ["Pediatrics", "/blog/tag/pediatrics"],
  ["Maternal-Newborn", "/blog/tag/maternal-newborn"],
  ["Mental Health", "/blog/tag/mental-health"],
  ["Community Health", "/blog/tag/community-health"],
  ["Leadership", "/blog/tag/leadership"],
  ["Clinical Judgment", "/blog/tag/clinical%20judgment"],
  ["ECG", "/blog/tag/ecg"],
  ["Lab Interpretation", "/blog/tag/lab%20interpretation"],
] as const;

export const dynamicParams = true;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const sp = await searchParams;
  const rawPage = Number(sp.page ?? "1");
  const page = Number.isFinite(rawPage) && rawPage >= 1 && rawPage <= BLOG_PUBLIC_MAX_PAGE ? Math.floor(rawPage) : 1;
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

type Props = { searchParams: Promise<{ page?: string; q?: string }> };

export default async function BlogIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Number(sp.page ?? "1");
  if (!Number.isFinite(raw) || raw < 1 || raw > BLOG_PUBLIC_MAX_PAGE) notFound();
  const page = Math.floor(raw);
  const initialQuery = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const [{ posts, total, pageSize, listLoad }, blogInlinePreloaded] = await Promise.all([
    getPublishedBlogPostsPage(page, BLOG_LIST_PAGE_SIZE, undefined, { includeTotal: false }),
    preloadInlineContentMap([...BLOG_INLINE_KEYS]),
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
  const postsForList = posts;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const { crumbs, schemaItems } = blogIndexBreadcrumbs();
  const showEmptyState = posts.length === 0;
  const showListLoadError = !listLoad.querySucceeded;

  const featured = page === 1 && postsForList.length > 0 ? postsForList[0] : null;
  const clientPostsRaw = featured ? postsForList.slice(1) : postsForList;
  const clientPosts = clientPostsRaw.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category ?? null,
    coverImage: p.coverImage ?? null,
    createdAt: blogPostCreatedAtIso(p.createdAt),
  }));

  return (
    <div className="nn-blog-index nn-premium-blog-index mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      </div>
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
              We’re updating our article library. Please try again in a moment.
            </p>
          </section>
          <MarketingStudyCrossLinks className="mt-10" />
        </>
      ) : null}
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
          <header className="relative mb-10 overflow-hidden rounded-[2rem] border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-brand)_10%,var(--theme-card-bg)),var(--theme-card-bg)_48%,color-mix(in_srgb,var(--semantic-success)_8%,var(--theme-card-bg)))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:items-center lg:gap-10">
            <div className="relative z-10 max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--theme-card-bg))] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Evidence-based nursing education
              </p>
              <EditableHeading
                as="h1"
                className="mt-5 max-w-2xl text-4xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-5xl"
                contentKey="inline.marketing.blog.index.h1"
                defaultText="Nursing knowledge. Real impact."
                preloaded={blogInlinePreloaded}
              />
              <EditableRichText
                contentKey="inline.marketing.blog.index.lead"
                defaultHtml="<p>Expert-reviewed articles, clinical insights, study guides, and exam strategies to help you learn, grow, and succeed.</p>"
                className="mt-4 max-w-xl text-base leading-8 text-[var(--theme-muted-text)] [&_p]:m-0"
                preloaded={blogInlinePreloaded}
              />
              <form action="/blog#blog-article-list" className="mt-6 flex max-w-xl overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] p-1 shadow-sm">
                <label className="flex min-w-0 flex-1 items-center gap-2 px-3">
                  <Search className="h-4 w-4 shrink-0 text-[var(--theme-muted-text)]" aria-hidden="true" />
                  <span className="sr-only">Search articles</span>
                  <input
                    name="q"
                    type="search"
                    defaultValue={initialQuery}
                    placeholder="Search articles, topics, and exams..."
                    className="min-h-[44px] min-w-0 flex-1 bg-transparent text-sm text-[var(--theme-body-text)] outline-none placeholder:text-[var(--theme-muted-text)]"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center rounded-xl bg-[var(--semantic-brand)] px-5 text-sm font-semibold text-[var(--semantic-on-brand)] shadow-sm transition hover:opacity-90"
                >
                  Search
                </button>
              </form>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--theme-muted-text)]">
                <span className="font-semibold text-[var(--theme-body-text)]">Popular:</span>
                {topicExplorerLinks.slice(0, 5).map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--theme-card-bg))] px-3 py-1.5 font-semibold text-[var(--theme-body-text)] hover:text-[var(--semantic-brand)]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative mt-8 hidden min-h-[260px] overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] shadow-[var(--semantic-shadow-soft)] md:block lg:mt-0">
              {featured?.coverImage ? (
                <Image
                  src={featured.coverImage}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_srgb,var(--semantic-success)_20%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--semantic-brand)_12%,var(--theme-card-bg)),var(--theme-card-bg))]" />
              )}
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--theme-card-bg)_88%,transparent)] p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Featured article</p>
                <p className="mt-1 line-clamp-2 text-lg font-semibold text-[var(--theme-heading-text)]">
                  {featured?.title ?? "Clinical articles for every stage of nursing study"}
                </p>
              </div>
            </div>
          </header>

          <section className="mb-10" aria-labelledby="blog-pathways-heading">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Browse by pathway</p>
                <h2 id="blog-pathways-heading" className="mt-1 text-2xl font-bold tracking-tight text-[var(--theme-heading-text)]">
                  Find content for your exam and role.
                </h2>
              </div>
              <Link href="/blog" className="text-sm font-semibold text-[var(--semantic-brand)] hover:underline">
                View all articles →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {pathwayCards.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group min-h-[150px] rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--theme-card-border))] hover:shadow-[var(--semantic-shadow-soft)]"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--semantic-brand)_9%,var(--theme-card-bg))] text-[var(--semantic-brand)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="mt-4 block text-sm font-bold text-[var(--theme-heading-text)]">{item.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-[var(--theme-muted-text)]">{item.count}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {postsForList.length > 0 ? (
            <>
              {featured ? (
                <div className="mb-8">
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--theme-heading-text)]">Featured articles</h2>
                    <Link href="/blog?page=2" className="text-sm font-semibold text-[var(--semantic-brand)] hover:underline">
                      More articles →
                    </Link>
                  </div>
                  <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <BlogPostCard
                      featured
                      post={{
                        slug: featured.slug,
                        title: featured.title,
                        excerpt: featured.excerpt,
                        category: featured.category ?? null,
                        coverImage: featured.coverImage ?? null,
                        createdAt: featured.createdAt,
                      }}
                    />
                  </ul>
                </div>
              ) : null}
              {clientPosts.length > 0 ? <div id="blog-article-list"><BlogMarketingPostListClient posts={clientPosts} initialQuery={initialQuery} /></div> : null}
              {featured && clientPosts.length === 0 ? (
                <p className="text-sm text-[var(--theme-muted-text)]">More articles appear here as they publish.</p>
              ) : null}
            </>
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
          <section className="mt-12 rounded-[1.75rem] border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-success)_8%,var(--theme-card-bg)),var(--theme-card-bg))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Topic explorer</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--theme-heading-text)]">Study guides organized around clinical decisions.</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {topicExplorerLinks.map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] px-3 py-2 text-xs font-semibold text-[var(--theme-body-text)] shadow-sm hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--theme-card-border))] hover:text-[var(--semantic-brand)]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
              <form className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] p-5 shadow-sm">
                <h3 className="text-base font-bold text-[var(--theme-heading-text)]">Get weekly clinical study notes</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">
                  Exam strategy, clinical insights, and new articles delivered to your inbox.
                </p>
                <label className="mt-4 block">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="min-h-[44px] w-full rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] px-3 text-sm text-[var(--theme-body-text)] outline-none focus:border-[var(--semantic-brand)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--semantic-brand)_20%,transparent)]"
                  />
                </label>
                <button type="submit" className="mt-3 inline-flex min-h-[44px] items-center rounded-xl bg-[var(--semantic-brand)] px-4 text-sm font-semibold text-[var(--semantic-on-brand)]">
                  Subscribe
                </button>
              </form>
            </div>
          </section>
          <MarketingStudyCrossLinks className="mt-14" />
        </>
      )}
    </div>
  );
}
