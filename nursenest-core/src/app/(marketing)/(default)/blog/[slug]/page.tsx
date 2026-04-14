import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostDistributionFooter } from "@/components/blog/blog-post-distribution-footer";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { applyAutoLinksToHtml } from "@/lib/blog/blog-auto-link-html";
import { parseInternalLinkPlanJson, stripBrokenOrEmptyImagesFromHtml } from "@/lib/blog/blog-image-workflow";
import {
  getBlogPostMetaBySlug,
  getPublishedBlogPostBySlug,
  isBlogPostMetaVisible,
} from "@/lib/blog/safe-blog-queries";
import { EeatContentAttribution } from "@/components/seo/eeat-content-attribution";
import { BlogFaqPageJsonLd, BlogPostingJsonLd } from "@/components/seo/seo-json-ld";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import {
  blogDisplayCrumbsFromSeo,
  blogPostSchemaItemsForPublic,
  blogSchemaKeywords,
  resolveOpenGraphCopy,
  resolvePublicCanonicalUrl,
} from "@/lib/blog/blog-seo-automation";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ slug: string }> };

/** ISR: slug pages are public; revalidate balances freshness vs load. */
export const revalidate = 120;

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
      const description = (post.seoDescription?.trim() || post.excerpt).slice(0, 160);
      const og = resolveOpenGraphCopy(seo, title, description);
      const canonical = resolvePublicCanonicalUrl(slug, seo);
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
          title: og.title,
          description: og.description,
          url: canonical,
          type: "article",
        },
      };
    },
    { pathname, routeGroup: "marketing.default.blog.slug" },
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  const seo = parseInternalLinkPlanJson(post.internalLinkPlan).seo;
  const crumbs = blogDisplayCrumbsFromSeo(seo, post.title, slug, post.category);
  const schemaItems = blogPostSchemaItemsForPublic(post.title, slug, post.category);

  const faqItems =
    post.faqBlock && typeof post.faqBlock === "object" && "items" in post.faqBlock
      ? ((post.faqBlock as { items?: { q: string; a: string }[] }).items ?? []).filter((x) => x.q?.trim() && x.a?.trim())
      : [];
  const emitFaqJsonLd =
    faqItems.length >= 2 && (seo === null ? true : seo.emitFaqSchema !== false);

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

  const schemaKeywords = blogSchemaKeywords(seo, post.tags);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <BlogPostingJsonLd
        slug={slug}
        title={post.seoTitle?.trim() || post.title}
        description={(post.seoDescription?.trim() || post.excerpt).slice(0, 320)}
        datePublished={publishedAt.toISOString()}
        dateModified={post.updatedAt.toISOString()}
        coverImage={post.coverImage ?? null}
        keywords={schemaKeywords.length ? schemaKeywords : undefined}
        articleSection={post.category ?? null}
        authorName={"authorDisplayName" in post ? post.authorDisplayName : null}
        authorJobTitle={"authorCredentials" in post ? post.authorCredentials : null}
      />
      {emitFaqJsonLd ? (
        <BlogFaqPageJsonLd items={faqItems.map((f) => ({ question: f.q, answer: f.a }))} />
      ) : null}
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
        ← Blog
      </Link>
      <header className="mt-6 space-y-2">
        {post.category ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">{post.category}</p>
        ) : null}
        {post.exam ? (
          <p className="text-xs font-medium text-primary">Exam focus: {post.exam}</p>
        ) : null}
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">{post.title}</h1>
        <p className="text-sm text-[var(--theme-muted-text)]">{publishedAt.toISOString().slice(0, 10)}</p>
        {"workflowStatus" in post && post.workflowStatus ? (
          <p className="text-xs text-muted-foreground">Editorial status: {post.workflowStatus.replace(/_/g, " ").toLowerCase()}</p>
        ) : null}
        {"lastReviewedAt" in post && post.lastReviewedAt ? (
          <p className="text-xs text-muted-foreground">Last reviewed: {new Date(post.lastReviewedAt).toISOString().slice(0, 10)}</p>
        ) : null}
      </header>
      {post.coverImage ? (
        <figure className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={"coverImageAlt" in post ? (post.coverImageAlt ?? "") : ""} className="w-full rounded-xl border border-[var(--theme-card-border)] object-cover" />
          {"coverImageCaption" in post && post.coverImageCaption ? (
            <figcaption className="mt-2 text-xs text-muted-foreground">{post.coverImageCaption}</figcaption>
          ) : null}
        </figure>
      ) : null}
      <div className="mt-6">
        <EeatContentAttribution
          variant="blog"
          authorDisplayName={"authorDisplayName" in post ? post.authorDisplayName : null}
          authorCredentials={"authorCredentials" in post ? post.authorCredentials : null}
          authorBio={"authorBio" in post ? post.authorBio : null}
          medicalReviewerName={"medicalReviewerName" in post ? post.medicalReviewerName : null}
          medicalReviewerCredentials={"medicalReviewerCredentials" in post ? post.medicalReviewerCredentials : null}
        />
      </div>
      <div
        className="prose prose-neutral mt-8 max-w-none dark:prose-invert [&_a]:text-primary [&_h2]:text-[var(--theme-heading-text)] [&_h3]:text-[var(--theme-heading-text)]"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
      <BlogPostDistributionFooter
        exam={post.exam}
        countryTarget={post.countryTarget}
        relatedLessonPaths={post.relatedLessonPaths}
        relatedQuestionIds={post.relatedQuestionIds}
        relatedTools={post.relatedTools}
      />
      {"apaReferences" in post && Array.isArray(post.apaReferences) && post.apaReferences.length > 0 ? (
        <section className="mt-10 rounded-xl border border-border/60 bg-muted/20 p-5">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">References (APA 7)</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            {post.apaReferences.map((ref: string, idx: number) => (
              <li key={`${idx}-${ref.slice(0, 24)}`}>{ref}</li>
            ))}
          </ol>
        </section>
      ) : null}
      <section className="mt-6 rounded-xl border border-border/60 bg-muted/10 p-4 text-xs text-muted-foreground">
        Educational use only. Content supports exam preparation and is not a substitute for professional clinical judgment or local protocols.
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
      <MarketingStudyCrossLinks className="mt-12" />
    </article>
  );
}
