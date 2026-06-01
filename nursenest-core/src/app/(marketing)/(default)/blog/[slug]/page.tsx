import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, GraduationCap, Share2, Sparkles, Stethoscope } from "lucide-react";
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

function formatArticleDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

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
          className="nn-premium-blog-article mx-auto max-w-7xl px-4 py-10 sm:px-6"
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
            <div className="mt-6 grid gap-8 rounded-[2rem] border-0 border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-brand)_7%,var(--theme-card-bg)),var(--theme-card-bg)_52%,color-mix(in_srgb,var(--semantic-success)_7%,var(--theme-card-bg)))] p-5 shadow-[var(--semantic-shadow-soft)] sm:border sm:p-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
              <header className="min-w-0">
                <Link
                  href="/blog"
                  className="nn-premium-blog-back-link inline-flex min-h-[44px] min-w-0 items-center text-sm font-semibold text-[var(--semantic-brand)] hover:underline"
                >
                  ← Back to blog
                </Link>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {topic.displayLabel ? (
                    <BlogTopicBadge
                      label={topic.displayLabel}
                      variant={topic.variant}
                      href={topic.categoryArchiveHref}
                    />
                  ) : null}
                  {post.exam ? (
                    <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--theme-card-bg))] px-3 py-1 text-xs font-semibold text-[var(--semantic-brand)]">
                      {post.exam}
                    </span>
                  ) : null}
                </div>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-5xl [overflow-wrap:anywhere]">
                  {post.title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--theme-body-text)] [overflow-wrap:anywhere]">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--theme-muted-text)]">
                  {"authorDisplayName" in post && post.authorDisplayName ? (
                    <span className="font-semibold text-[var(--theme-body-text)]">
                      By {post.authorDisplayName}
                      {"authorCredentials" in post && post.authorCredentials ? `, ${post.authorCredentials}` : ""}
                    </span>
                  ) : null}
                  <time dateTime={publishedAt.toISOString()}>{formatArticleDate(publishedAt)}</time>
                  <span>8 min read</span>
                  {"lastReviewedAt" in post && post.lastReviewedAt ? (
                    <span>Clinically reviewed {formatArticleDate(new Date(post.lastReviewedAt))}</span>
                  ) : null}
                </div>
              </header>
              <figure className="min-w-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border-0 border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--theme-card-bg))] shadow-sm sm:border">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={"coverImageAlt" in post ? (post.coverImageAlt ?? "") : ""}
                      loading="eager"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_srgb,var(--semantic-success)_18%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--semantic-brand)_12%,var(--theme-card-bg)),var(--theme-card-bg))]" />
                  )}
                </div>
                {"coverImageCaption" in post && post.coverImageCaption ? (
                  <figcaption className="mt-2 text-xs text-muted-foreground">
                    {post.coverImageCaption}
                  </figcaption>
                ) : null}
              </figure>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] p-5 shadow-sm">
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
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)] lg:items-start">
            <div className="min-w-0">
              {clinicalBlurb ? (
                <section
                  className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--theme-card-bg))] p-5 shadow-sm"
                  aria-label="Clinical summary"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--theme-card-bg))] text-[var(--semantic-brand)]">
                      <Stethoscope className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Clinical summary</h2>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)] [overflow-wrap:anywhere]">{clinicalBlurb}</p>
                    </div>
                  </div>
                </section>
              ) : null}
              {takeaways.length > 0 ? (
                <section
                  className="mt-6 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_7%,var(--theme-card-bg))] p-5 shadow-sm"
                  aria-label="Key takeaways"
                >
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    <Sparkles className="h-4 w-4 text-[var(--semantic-success)]" aria-hidden="true" />
                    Key takeaways
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--theme-body-text)] [overflow-wrap:anywhere]">
                    {takeaways.map((t, i) => (
                      <li key={`${i}-${t.slice(0, 48)}`} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden="true" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              <div
                id="nn-blog-article-body"
                className="nn-premium-blog-prose prose prose-lg prose-neutral mt-8 min-w-0 max-w-none leading-8 dark:prose-invert [&_a]:text-[var(--semantic-brand)] [&_h2]:mt-12 [&_h2]:text-[var(--theme-heading-text)] [&_h3]:text-[var(--theme-heading-text)] [&_p]:leading-8"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
              <BlogRelatedReadingSection items={relatedReading} />
              <BlogPostDistributionFooter
                exam={post.exam}
                countryTarget={post.countryTarget}
                relatedLessonPaths={relatedLessonPathsFiltered}
                relatedQuestionIds={post.relatedQuestionIds}
                relatedTools={post.relatedTools}
              />
            </div>
            <aside className="space-y-4 lg:sticky lg:top-24" aria-label="Article resources">
              <BlogArticleToc containerId="nn-blog-article-body" />
              {relatedReading.length > 0 ? (
                <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] p-4 shadow-sm">
                  <h2 className="text-sm font-bold text-[var(--theme-heading-text)]">Related articles</h2>
                  <ul className="mt-3 space-y-3">
                    {relatedReading.slice(0, 3).map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/blog/${encodeURIComponent(item.slug)}`}
                          className="block rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--theme-card-bg))] p-3 text-sm font-semibold leading-5 text-[var(--theme-body-text)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--theme-card-border))] hover:text-[var(--semantic-brand)]"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-success)_8%,var(--theme-card-bg)),var(--theme-card-bg))] p-5 shadow-sm">
                <GraduationCap className="h-6 w-6 text-[var(--semantic-brand)]" aria-hidden="true" />
                <h2 className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">Excel on your exam</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">
                  Connect this article to practice questions, flashcards, and adaptive readiness work.
                </p>
                <Link
                  href="/app"
                  className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-[var(--semantic-brand)] px-4 text-sm font-semibold text-[var(--semantic-on-brand,var(--semantic-surface))]"
                >
                  Start practicing
                </Link>
              </section>
              <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] p-4 shadow-sm">
                <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--theme-heading-text)]">
                  <Share2 className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden="true" />
                  Share this article
                </h2>
                <p className="mt-2 text-xs leading-5 text-[var(--theme-muted-text)]">Copy the URL from your browser to share with a classmate or cohort.</p>
              </section>
            </aside>
          </div>
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
                  className="max-w-full min-w-0 rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[var(--theme-page-bg)] px-2.5 py-1 text-xs font-medium text-[var(--theme-body-text)] [overflow-wrap:anywhere] hover:border-primary/40 hover:text-primary"
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
