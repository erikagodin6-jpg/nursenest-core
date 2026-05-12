import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BlogPostDistributionFooter } from "@/components/blog/blog-post-distribution-footer";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { applyAutoLinksToHtml } from "@/lib/blog/blog-auto-link-html";
import {
  parseInternalLinkPlanJson,
  stripBrokenOrEmptyImagesFromHtml,
} from "@/lib/blog/blog-image-workflow";
import {
  getBlogPostMetaBySlug,
  getPublishedBlogPostBySlug,
  isBlogPostMetaVisible,
} from "@/lib/blog/safe-blog-queries";
import { EeatContentAttribution } from "@/components/seo/eeat-content-attribution";
import {
  BlogFaqPageJsonLd,
  BlogPostingJsonLd,
} from "@/components/seo/seo-json-ld";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import {
  blogDisplayCrumbsFromSeo,
  blogPostSchemaItemsForPublic,
  blogSchemaKeywords,
  resolveBlogOgImageAbsolute,
  resolveOpenGraphCopy,
  resolvePublicCanonicalUrl,
} from "@/lib/blog/blog-seo-automation";
import { expectedCanonicalBlogPath } from "@/lib/blog/generated-blog-post-publish";
import { withCrawlSurfacePageRender } from "@/lib/observability/crawl-surface-observability";
import { logBlogSlugPipeline } from "@/lib/observability/content-source-trace";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { StaffEditLivePageBanner } from "@/components/staff/staff-edit-live-page-banner";
import { BlogRelatedReadingSection } from "@/components/blog/blog-related-reading-section";
import { BlogArticleToc } from "@/components/blog/blog-article-toc";
import { BlogTopicBadge } from "@/components/blog/blog-topic-badge";
import { parsePublishingPackage } from "@/lib/blog/blog-publishing-package";
import { filterRelatedBlogReadingForParentExam } from "@/lib/blog/blog-related-reading-public";
import { filterMarketingLessonPathsForBlogExam } from "@/lib/blog/blog-marketing-lesson-path-tier";
import { resolveBlogTopicPresentation } from "@/lib/blog/blog-post-category-visual";
import {
  extractFaqPairsFromFaqSchemaSectionHtml,
  publicBlogClinicalBlurb,
  sanitizePublicBlogBodyHtml,
} from "@/lib/blog/blog-public-article-html";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

/** ISR: slug pages are public; cache publicly for one hour and revalidate in the background. */
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/blog/${slug}`;
  return safeGenerateMetadata(
    async () => {
      const visible = await isBlogPostMetaVisible(slug);
      if (!visible) return {};
      const post = await getBlogPostMetaBySlug(slug);
      if (!post) return {};
      const seo = parseInternalLinkPlanJson(post.internalLinkPlan).seo;
      const title = post.seoTitle?.trim() || post.title;
      const description = (post.seoDescription?.trim() || post.excerpt).slice(
        0,
        160,
      );
      const og = resolveOpenGraphCopy(seo, title, description);
      const canonical = resolvePublicCanonicalUrl(slug, seo);
      const ogImage = resolveBlogOgImageAbsolute(seo, post.coverImage);
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
          title: og.title,
          description: og.description,
          url: canonical,
          type: "article",
          ...(ogImage ? { images: [{ url: ogImage }] } : {}),
        },
        twitter: {
          card: "summary_large_image",
          title: og.title,
          description: og.description,
          ...(ogImage ? { images: [ogImage] } : {}),
        },
      };
    },
    { pathname, routeGroup: "marketing.default.blog.slug" },
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const pathname = `/blog/${slug}`;
  return withCrawlSurfacePageRender(
    "marketing.blog_post",
    pathname,
    async () => {
      const post = await getPublishedBlogPostBySlug(slug);
      logBlogSlugPipeline({ slug, resolved: Boolean(post) });
      if (!post) notFound();

      // Career-scoped posts (rn, allied, nursing) have a canonical URL different from /blog/{slug}.
      // Serving them here creates duplicate content; redirect to the correct canonical path.
      const canonicalPath = expectedCanonicalBlogPath(slug, post.careerSlug);
      if (canonicalPath !== `/blog/${slug}`) redirect(canonicalPath);

      const seo = parseInternalLinkPlanJson(post.internalLinkPlan).seo;
      const crumbs = blogDisplayCrumbsFromSeo(
        seo,
        post.title,
        slug,
        post.category,
      );
      const schemaItems = blogPostSchemaItemsForPublic(
        post.title,
        slug,
        post.category,
      );

      let faqItems =
        post.faqBlock &&
        typeof post.faqBlock === "object" &&
        "items" in post.faqBlock
          ? (
              (post.faqBlock as { items?: { q: string; a: string }[] }).items ??
              []
            ).filter((x) => x.q?.trim() && x.a?.trim())
          : [];
      if (faqItems.length < 2) {
        const fromBody = extractFaqPairsFromFaqSchemaSectionHtml(post.body);
        if (fromBody.length >= 2) faqItems = fromBody;
      }
      const emitFaqJsonLd =
        faqItems.length >= 2 &&
        (seo === null ? true : seo.emitFaqSchema !== false);

      const publishedAt = post.publishAt ?? post.createdAt;
      const relatedLessonPathsFiltered = filterMarketingLessonPathsForBlogExam(post.exam, post.relatedLessonPaths ?? []);
      const linkPlanRaw =
        post.internalLinkPlan && typeof post.internalLinkPlan === "object"
          ? (post.internalLinkPlan as Record<string, unknown>)
          : null;
      const publishingPkg = linkPlanRaw ? parsePublishingPackage(linkPlanRaw.publishingPackage) : null;
      const relatedReading = filterRelatedBlogReadingForParentExam(post.exam, publishingPkg?.relatedBlogPosts ?? []);

      const bodyForPublic = sanitizePublicBlogBodyHtml(post.body, {
        hasStructuredApaReferences: Boolean(
          "apaReferences" in post &&
            Array.isArray(post.apaReferences) &&
            post.apaReferences.length > 0,
        ),
      });
      const bodyHtml = stripBrokenOrEmptyImagesFromHtml(
        applyAutoLinksToHtml(bodyForPublic, {
          exam: post.exam,
          countryTarget: post.countryTarget,
          relatedLessonPaths: relatedLessonPathsFiltered,
          relatedTools: post.relatedTools,
          maxTotalAutoLinks: 6,
        }),
      );

      const schemaKeywords = blogSchemaKeywords(seo, post.tags);
      const staffBlogAdminHref =
        typeof post.id === "string" && !post.id.startsWith("static:")
          ? `/admin/blog?id=${encodeURIComponent(post.id)}`
          : null;

      const topic = resolveBlogTopicPresentation(post.category);
      const clinicalBlurb = publicBlogClinicalBlurb({
        shortSummary: "shortSummary" in post ? post.shortSummary : null,
        schemaSummary: "schemaSummary" in post ? post.schemaSummary : null,
        seoSuggestedExcerpt: seo?.suggestedExcerpt ?? null,
      });
      const takeaways =
        "keyTakeaways" in post && Array.isArray(post.keyTakeaways)
          ? post.keyTakeaways.map((t) => (typeof t === "string" ? t.trim() : "")).filter((t) => t.length > 0)
          : [];

      return (
        <article
          className="nn-premium-blog-article mx-auto max-w-7xl px-4 py-12 sm:px-6"
          data-nn-blog-topic={topic.variant}
        >
          <BlogPostingJsonLd
            slug={slug}
            title={post.seoTitle?.trim() || post.title}
            description={(post.seoDescription?.trim() || post.excerpt).slice(
              0,
              320,
            )}
            datePublished={publishedAt.toISOString()}
            dateModified={post.updatedAt.toISOString()}
            coverImage={post.coverImage ?? null}
            keywords={schemaKeywords.length ? schemaKeywords : undefined}
            articleSection={post.category ?? null}
            authorName={
              "authorDisplayName" in post ? post.authorDisplayName : null
            }
            authorJobTitle={
              "authorCredentials" in post ? post.authorCredentials : null
            }
            reviewerName={
              "medicalReviewerName" in post ? post.medicalReviewerName : null
            }
            reviewerJobTitle={
              "medicalReviewerCredentials" in post
                ? post.medicalReviewerCredentials
                : null
            }
          />
          {emitFaqJsonLd ? (
            <BlogFaqPageJsonLd
              items={faqItems.map((f) => ({ question: f.q, answer: f.a }))}
            />
          ) : null}
          <div className="nn-premium-blog-article-hero">
            <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
            <Link
              href="/blog"
              className="nn-premium-blog-back-link inline-flex min-h-[44px] min-w-0 items-center text-sm font-semibold text-primary hover:underline"
            >
              ← Back to blog
            </Link>
            <header className="mt-6 space-y-3">
            {topic.displayLabel ? (
              <div className="flex flex-wrap gap-2">
                <BlogTopicBadge
                  label={topic.displayLabel}
                  variant={topic.variant}
                  href={topic.categoryArchiveHref}
                />
              </div>
            ) : null}
            {post.exam ? (
              <p className="text-xs font-medium text-primary">
                Exam focus: {post.exam}
              </p>
            ) : null}
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl [overflow-wrap:anywhere]">
              {post.title}
            </h1>
            <p className="text-sm text-[var(--theme-muted-text)]">
              <time dateTime={publishedAt.toISOString()}>{publishedAt.toISOString().slice(0, 10)}</time>
            </p>
            {"lastReviewedAt" in post && post.lastReviewedAt ? (
              <p className="text-xs text-muted-foreground">
                Last reviewed:{" "}
                {new Date(post.lastReviewedAt).toISOString().slice(0, 10)}
              </p>
            ) : null}
            </header>
          </div>
          {post.coverImage ? (
            <figure className="mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={"coverImageAlt" in post ? (post.coverImageAlt ?? "") : ""}
                className="w-full rounded-xl border border-[var(--theme-card-border)] object-cover"
              />
              {"coverImageCaption" in post && post.coverImageCaption ? (
                <figcaption className="mt-2 text-xs text-muted-foreground">
                  {post.coverImageCaption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
          <div className="mt-6">
            <EeatContentAttribution
              variant="blog"
              authorDisplayName={
                "authorDisplayName" in post ? post.authorDisplayName : null
              }
              authorCredentials={
                "authorCredentials" in post ? post.authorCredentials : null
              }
              authorBio={"authorBio" in post ? post.authorBio : null}
              medicalReviewerName={
                "medicalReviewerName" in post ? post.medicalReviewerName : null
              }
              medicalReviewerCredentials={
                "medicalReviewerCredentials" in post
                  ? post.medicalReviewerCredentials
                  : null
              }
            />
          </div>
          {clinicalBlurb ? (
            <section
              className="mt-8 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--theme-card-bg))] p-5 shadow-sm"
              aria-label="Clinical summary"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Clinical summary</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)] [overflow-wrap:anywhere]">{clinicalBlurb}</p>
            </section>
          ) : null}
          {takeaways.length > 0 ? (
            <section
              className="mt-6 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_7%,var(--theme-card-bg))] p-5 shadow-sm"
              aria-label="Key takeaways"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Key takeaways</h2>
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-[var(--theme-body-text)] [overflow-wrap:anywhere]">
                {takeaways.map((t, i) => (
                  <li key={`${i}-${t.slice(0, 48)}`}>{t}</li>
                ))}
              </ul>
            </section>
          ) : null}
          <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,65ch)_240px] lg:items-start lg:gap-10">
            <div
              id="nn-blog-article-body"
              className="nn-premium-blog-prose prose prose-neutral min-w-0 max-w-[65ch] dark:prose-invert [&_a]:text-primary [&_h2]:text-[var(--theme-heading-text)] [&_h3]:text-[var(--theme-heading-text)]"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
            <BlogArticleToc containerId="nn-blog-article-body" />
          </div>
          <BlogRelatedReadingSection items={relatedReading} />
          <BlogPostDistributionFooter
            exam={post.exam}
            countryTarget={post.countryTarget}
            relatedLessonPaths={relatedLessonPathsFiltered}
            relatedQuestionIds={post.relatedQuestionIds}
            relatedTools={post.relatedTools}
          />
          {"apaReferences" in post &&
          Array.isArray(post.apaReferences) &&
          post.apaReferences.length > 0 ? (
            <section className="mt-10 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-text-muted)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--theme-card-bg))] p-5">
              <h2 className="text-base font-medium text-[var(--theme-heading-text)]">
                References (APA 7)
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[var(--theme-muted-text)] [overflow-wrap:anywhere]">
                {post.apaReferences.map((ref: string, idx: number) => (
                  <li key={`${idx}-${ref.slice(0, 24)}`}>{ref}</li>
                ))}
              </ol>
            </section>
          ) : null}
          <section className="mt-6 overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_6%,var(--theme-card-bg))] p-4 text-xs text-[var(--theme-body-text)] [overflow-wrap:anywhere]">
            Educational use only. Content supports exam preparation and is not a
            substitute for professional clinical judgment or local protocols.
          </section>
          {post.tags.length > 0 ? (
            <footer className="mt-10 flex min-w-0 flex-wrap gap-2 border-t border-[var(--theme-separator)] pt-6">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/blog/tag/${encodeURIComponent(t)}`}
                  className="max-w-full min-w-0 rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)] px-2.5 py-1 text-xs font-medium text-[var(--theme-body-text)] [overflow-wrap:anywhere] hover:border-primary/40 hover:text-primary"
                >
                  {t}
                </Link>
              ))}
            </footer>
          ) : null}
          <MarketingStudyCrossLinks className="mt-12" />
          <StaffEditLivePageBanner adminHref={staffBlogAdminHref} label="Edit this blog post" />
        </article>
      );
    },
  );
}
