import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogStudyAnchorStrip } from "@/components/blog/blog-study-anchor-strip";
import { BlogPostDistributionFooter } from "@/components/blog/blog-post-distribution-footer";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { applyAutoLinksToHtml } from "@/lib/blog/blog-auto-link-html";
import {
  parseInternalLinkPlanJson,
  stripBrokenOrEmptyImagesFromHtml,
} from "@/lib/blog/blog-image-workflow";
import { isBlogPostMarketingMetaVisible } from "@/lib/blog/blog-visibility";
import { getBlogPostMetaBySlug, getPublishedBlogPostBySlug } from "@/lib/blog/safe-blog-queries";
import { EeatContentAttribution } from "@/components/seo/eeat-content-attribution";
import {
  BlogFaqPageJsonLd,
  BlogPostingJsonLd,
} from "@/components/seo/seo-json-ld";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import {
  blogSchemaKeywords,
  resolveBlogOgImageAbsolute,
  resolveOpenGraphCopy,
  resolvePublicCanonicalUrl,
} from "@/lib/blog/blog-seo-automation";
import { withCrawlSurfacePageRender } from "@/lib/observability/crawl-surface-observability";
import {
  blogBrowserTitleForPublicPost,
  blogExamFramingHtml,
  blogExamGeoParts,
  blogH1ForPublicPost,
  blogKeywordStemFromTitles,
  blogStudyAnchorTargets,
  mergeBlogFaqItemsForPublicPage,
} from "@/lib/blog/blog-public-seo-helpers";
import {
  autoBreadcrumbsToCrumbs,
  autoBreadcrumbsToSchemaItems,
  generateBlogSEOFromPostRow,
  mergeFaqForSchema,
  normalizeExamForBlogSeo,
  studyLinkAnchorsForExam,
} from "@/lib/blog/blog-generate-seo";
import { blogCountryFromPrismaTarget } from "@/lib/blog/blog-study-cta";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { mergePublicBlogMetaDescription } from "@/lib/seo/programmatic-seo-engine/blog-public-metadata";
import { buildProgrammaticBlogContinuationLinks } from "@/lib/seo/programmatic-seo-engine/server-blog-continuation";
import { ProgrammaticSeoContinuationSection } from "@/components/seo/programmatic-seo-continuation-section";
import { AutomaticRelatedContentForPublic } from "@/components/linking/automatic-related-content-for-public";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

/** ISR backup; align with `/blog` so pathophysiology hub + lists refresh together after publish. */
export const revalidate = 180;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/blog/${slug}`;
  return safeGenerateMetadata(
    async () => {
      const post = await getBlogPostMetaBySlug(slug);
      if (!post) return {};
      if (
        !isBlogPostMarketingMetaVisible({
          postStatus: post.postStatus,
          publishAt: post.publishAt,
          scheduledAt: post.scheduledAt,
        })
      ) {
        return {};
      }
      const seo = parseInternalLinkPlanJson(post.internalLinkPlan).seo;
      const title = blogBrowserTitleForPublicPost({
        seoTitle: post.seoTitle,
        title: post.title,
        exam: post.exam,
        countryTarget: post.countryTarget,
        slug,
        category: post.category,
        tags: post.tags,
      });
      const autoMeta = generateBlogSEOFromPostRow({
        title: post.title,
        slug,
        category: post.category ?? null,
        tags: post.tags,
        exam: post.exam ?? null,
        countryTarget: post.countryTarget ?? null,
      });
      const description = mergePublicBlogMetaDescription(post.seoDescription, autoMeta.metaDescription).description;
      const og = resolveOpenGraphCopy(seo, title, description);
      const canonical = resolvePublicCanonicalUrl(slug, seo);
      const ogImage = resolveBlogOgImageAbsolute(seo, post.coverImage);
      return {
        title,
        description,
        robots: { index: true, follow: true },
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
      if (!post) notFound();

      const seo = parseInternalLinkPlanJson(post.internalLinkPlan).seo;
      const geo = blogExamGeoParts(post.exam, blogCountryFromPrismaTarget(post.countryTarget));
      const keywordStem = blogKeywordStemFromTitles(post.seoTitle, post.title);
      const auto = generateBlogSEOFromPostRow({
        title: post.title,
        slug,
        category: post.category ?? null,
        tags: post.tags,
        exam: post.exam ?? null,
        countryTarget: post.countryTarget ?? null,
      });
      const mergedPublicDescription = mergePublicBlogMetaDescription(post.seoDescription, auto.metaDescription);
      const h1Text = blogH1ForPublicPost({
        seoTitle: post.seoTitle,
        title: post.title,
        slug,
        category: post.category ?? null,
        tags: post.tags,
        exam: post.exam ?? null,
        countryTarget: post.countryTarget ?? null,
      });
      const browserTitle = blogBrowserTitleForPublicPost({
        seoTitle: post.seoTitle,
        title: post.title,
        exam: post.exam,
        countryTarget: post.countryTarget,
        slug,
        category: post.category ?? null,
        tags: post.tags,
      });
      const leadSentence = auto.intro;
      const crumbs = autoBreadcrumbsToCrumbs(auto.breadcrumbs);
      const schemaItems = autoBreadcrumbsToSchemaItems(auto.breadcrumbs);
      const studyAnchors = blogStudyAnchorTargets({
        exam: post.exam,
        countryTarget: post.countryTarget,
      });
      const studyAnchorsText = studyLinkAnchorsForExam(normalizeExamForBlogSeo(post.exam));

      const faqItemsRaw =
        post.faqBlock &&
        typeof post.faqBlock === "object" &&
        "items" in post.faqBlock
          ? (
              (post.faqBlock as { items?: { q: string; a: string }[] }).items ??
              []
            ).filter((x) => x.q?.trim() && x.a?.trim())
          : [];
      const mergedFaqForSchema = mergeFaqForSchema(
        mergeBlogFaqItemsForPublicPage(
          faqItemsRaw.map((x) => ({ q: x.q.trim(), a: x.a.trim() })),
          {
            keywordStem,
            examPlain: geo.examPlain,
            countryWord: geo.countryWord,
          },
        ).map((x) => ({ q: x.q, a: x.a })),
        auto.faq,
      );
      const mergedFaqItems = mergedFaqForSchema.map((x) => ({ q: x.question, a: x.answer }));
      const emitFaqJsonLd =
        mergedFaqItems.length >= 3 &&
        (seo === null ? true : seo.emitFaqSchema !== false);

      const publishedAt = post.publishAt ?? post.createdAt;
      const bodyHtml = stripBrokenOrEmptyImagesFromHtml(
        applyAutoLinksToHtml(post.body, {
          exam: post.exam,
          countryTarget: post.countryTarget,
          relatedLessonPaths: post.relatedLessonPaths,
          relatedTools: post.relatedTools,
          maxTotalAutoLinks: 14,
        }),
      );
      const continuationLinks = await buildProgrammaticBlogContinuationLinks(prisma, {
        slug,
        category: post.category,
        tags: post.tags,
        exam: post.exam,
        countryTarget: post.countryTarget,
      });
      const framingHtml = blogExamFramingHtml({
        keywordStem,
        examGeo: geo.examGeo,
        examPlain: geo.examPlain,
        bodyHtml: post.body,
      });
      const schemaKeywords = blogSchemaKeywords(seo, post.tags);

      return (
        <article className="mx-auto max-w-3xl px-4 py-12">
          <BlogPostingJsonLd
            slug={slug}
            title={browserTitle}
            description={mergedPublicDescription.description.slice(0, 320)}
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
              items={mergedFaqItems.map((f) => ({ question: f.q, answer: f.a }))}
            />
          ) : null}
          <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
          <Link
            href="/blog"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Blog
          </Link>
          <BlogStudyAnchorStrip
            {...studyAnchors}
            practiceAnchorText={studyAnchorsText.practice}
            adaptiveAnchorText={studyAnchorsText.adaptive}
            flashcardsAnchorText={studyAnchorsText.flashcards}
            className="mt-6"
            labelledById="blog-study-links-top"
          />
          <header className="mt-6 space-y-2">
            {post.category ? (
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">
                {post.category}
              </p>
            ) : null}
            {post.exam ? (
              <p className="text-xs font-medium text-primary">
                Exam focus: {post.exam}
              </p>
            ) : null}
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)]">
              {h1Text}
            </h1>
            <p className="text-base leading-relaxed text-[var(--theme-muted-text)]">{leadSentence}</p>
            <p className="text-sm text-[var(--theme-muted-text)]">
              {publishedAt.toISOString().slice(0, 10)}
            </p>
            {"workflowStatus" in post && post.workflowStatus ? (
              <p className="text-xs text-muted-foreground">
                Editorial status:{" "}
                {post.workflowStatus.replace(/_/g, " ").toLowerCase()}
              </p>
            ) : null}
            {"lastReviewedAt" in post && post.lastReviewedAt ? (
              <p className="text-xs text-muted-foreground">
                Last reviewed:{" "}
                {new Date(post.lastReviewedAt).toISOString().slice(0, 10)}
              </p>
            ) : null}
          </header>
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
          {framingHtml ? (
            <div
              className="mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: framingHtml }}
            />
          ) : null}
          <div
            className="prose prose-neutral mt-8 max-w-none dark:prose-invert [&_a]:text-primary [&_h2]:text-[var(--theme-heading-text)] [&_h3]:text-[var(--theme-heading-text)]"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
          {emitFaqJsonLd ? (
            <section
              className="mt-10 rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 not-prose"
              aria-labelledby="blog-faq-heading"
            >
              <h2
                id="blog-faq-heading"
                className="text-lg font-semibold text-[var(--theme-heading-text)]"
              >
                Frequently asked questions
              </h2>
              <dl className="mt-4 space-y-5">
                {mergedFaqItems.map((f) => (
                  <div key={f.q.slice(0, 120)}>
                    <dt className="font-medium text-[var(--theme-heading-text)]">{f.q}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-[var(--theme-muted-text)]">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          <AutomaticRelatedContentForPublic
            surface="blog"
            post={{
              slug: post.slug,
              title: post.title,
              tags: post.tags,
              category: post.category,
              exam: post.exam,
              countryTarget: post.countryTarget,
              locale: post.locale,
              relatedLessonPaths: post.relatedLessonPaths,
            }}
            excludeHrefs={continuationLinks.map((l) => l.href)}
          />
          <ProgrammaticSeoContinuationSection links={continuationLinks} />
          <BlogPostDistributionFooter
            exam={post.exam}
            countryTarget={post.countryTarget}
            relatedLessonPaths={post.relatedLessonPaths}
            relatedQuestionIds={post.relatedQuestionIds}
            relatedTools={post.relatedTools}
          />
          {"apaReferences" in post &&
          Array.isArray(post.apaReferences) &&
          post.apaReferences.length > 0 ? (
            <section className="mt-10 rounded-xl border border-border/60 bg-muted/20 p-5">
              <h2 className="text-base font-medium text-[var(--theme-heading-text)]">
                References (APA 7)
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                {post.apaReferences.map((ref: string, idx: number) => (
                  <li key={`${idx}-${ref.slice(0, 24)}`}>{ref}</li>
                ))}
              </ol>
            </section>
          ) : null}
          <section className="mt-6 rounded-xl border border-border/60 bg-muted/10 p-4 text-xs text-muted-foreground">
            Educational use only. Content supports exam preparation and is not a
            substitute for professional clinical judgment or local protocols.
          </section>
          {post.tags.length > 0 ? (
            <footer className="mt-10 flex flex-wrap gap-2 border-t border-[var(--theme-separator)] pt-6">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/blog/tag/${encodeURIComponent(t)}`}
                  className="rounded-full bg-[var(--theme-page-bg)] px-2 py-0.5 text-xs text-[var(--theme-muted-text)] hover:text-primary hover:underline"
                >
                  {t}
                </Link>
              ))}
            </footer>
          ) : null}
          <BlogStudyAnchorStrip
            {...studyAnchors}
            practiceAnchorText={studyAnchorsText.practice}
            adaptiveAnchorText={studyAnchorsText.adaptive}
            flashcardsAnchorText={studyAnchorsText.flashcards}
            className="mt-10"
            labelledById="blog-study-links-bottom"
          />
          <MarketingStudyCrossLinks className="mt-12" />
        </article>
      );
    },
  );
}
