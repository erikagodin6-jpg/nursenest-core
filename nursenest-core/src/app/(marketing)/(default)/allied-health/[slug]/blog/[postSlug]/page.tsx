import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogStudyAnchorStrip } from "@/components/blog/blog-study-anchor-strip";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { BlogFaqPageJsonLd } from "@/components/seo/seo-json-ld";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
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
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { absoluteUrl } from "@/lib/seo/site-origin";
import {
  generateBlogSEOFromPostRow,
  mergeFaqForSchema,
  normalizeExamForBlogSeo,
  studyLinkAnchorsForExam,
} from "@/lib/blog/blog-generate-seo";
import {
  blogBrowserTitleForPublicPost,
  blogExamFramingHtml,
  blogExamGeoParts,
  blogH1ForPublicPost,
  blogKeywordStemFromTitles,
  blogStudyAnchorTargets,
  mergeBlogFaqItemsForPublicPage,
} from "@/lib/blog/blog-public-seo-helpers";
import { blogCountryFromPrismaTarget } from "@/lib/blog/blog-study-cta";
import { resolveBlogOgImageAbsolute } from "@/lib/blog/blog-seo-automation";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ slug: string; postSlug: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, postSlug } = await params;
  const prof = getAlliedProfessionByProfessionKey(slug);
  if (!prof) return {};
  const locale = await getMarketingLocaleForDefaultRoute();
  const visible = await isBlogPostMetaVisible(postSlug, {
    locale,
    sourceLocale: "en",
    careerSlug: prof.professionKey,
    allowSourceLocaleFallback: true,
  });
  const meta = await getBlogPostMetaBySlug(postSlug, {
    locale,
    sourceLocale: "en",
    careerSlug: prof.professionKey,
    allowSourceLocaleFallback: true,
  });
  if (!visible || !meta) {
    return {
      title: "Post not found | NurseNest",
      robots: { index: false, follow: false },
      alternates: { canonical: absoluteUrl(`/allied-health/${slug}/blog`) },
    };
  }
  return safeGenerateMetadata(
    async () => {
      const auto = generateBlogSEOFromPostRow(
        {
          title: meta.title,
          slug: postSlug,
          category: meta.category ?? null,
          tags: meta.tags,
          exam: meta.exam ?? null,
          countryTarget: meta.countryTarget ?? null,
        },
        { canonicalPath: `/allied-health/${slug}/blog/${postSlug}` },
      );
      const title = blogBrowserTitleForPublicPost({
        seoTitle: meta.seoTitle,
        title: meta.title,
        exam: meta.exam,
        countryTarget: meta.countryTarget,
        slug: postSlug,
        category: meta.category ?? null,
        tags: meta.tags,
      });
      const description = (meta.seoDescription?.trim() || auto.metaDescription).slice(0, 155);
      const canonical = absoluteUrl(`/allied-health/${slug}/blog/${postSlug}`);
      const seo = parseInternalLinkPlanJson(meta.internalLinkPlan).seo;
      const ogImage = resolveBlogOgImageAbsolute(seo, meta.coverImage);
      return {
        title,
        description,
        robots: { index: true, follow: true },
        alternates: { canonical },
        openGraph: {
          title,
          description,
          url: canonical,
          type: "article",
          ...(ogImage ? { images: [{ url: ogImage }] } : {}),
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          ...(ogImage ? { images: [ogImage] } : {}),
        },
      };
    },
    { pathname: `/allied-health/${slug}/blog/${postSlug}`, routeGroup: "marketing.default.allied_health.slug.blog.post" },
  );
}

export default async function AlliedProfessionBlogPostPage({ params }: Props) {
  const { slug, postSlug } = await params;
  const prof = getAlliedProfessionByProfessionKey(slug);
  if (!prof) notFound();
  const locale = await getMarketingLocaleForDefaultRoute();
  const post = await getPublishedBlogPostBySlug(postSlug, {
    locale,
    sourceLocale: "en",
    careerSlug: prof.professionKey,
    allowSourceLocaleFallback: true,
  });
  if (!post) notFound();

  const seo = parseInternalLinkPlanJson(post.internalLinkPlan).seo;
  const geo = blogExamGeoParts(post.exam, blogCountryFromPrismaTarget(post.countryTarget));
  const keywordStem = blogKeywordStemFromTitles(post.seoTitle, post.title);
  const auto = generateBlogSEOFromPostRow(
    {
      title: post.title,
      slug: post.slug,
      category: post.category ?? null,
      tags: post.tags,
      exam: post.exam ?? null,
      countryTarget: post.countryTarget ?? null,
    },
    { canonicalPath: `/allied-health/${slug}/blog/${post.slug}` },
  );
  const h1Text = blogH1ForPublicPost({
    seoTitle: post.seoTitle,
    title: post.title,
    slug: post.slug,
    category: post.category ?? null,
    tags: post.tags,
    exam: post.exam ?? null,
    countryTarget: post.countryTarget ?? null,
  });
  const leadSentence = auto.intro;
  const faqItemsRaw =
    post.faqBlock &&
    typeof post.faqBlock === "object" &&
    "items" in post.faqBlock
      ? ((post.faqBlock as { items?: { q: string; a: string }[] }).items ?? []).filter(
          (x) => x.q?.trim() && x.a?.trim(),
        )
      : [];
  const mergedFaqForSchema = mergeFaqForSchema(
    mergeBlogFaqItemsForPublicPage(
      faqItemsRaw.map((x) => ({ q: x.q.trim(), a: x.a.trim() })),
      { keywordStem, examPlain: geo.examPlain, countryWord: geo.countryWord },
    ).map((x) => ({ q: x.q, a: x.a })),
    auto.faq,
  );
  const mergedFaqItems = mergedFaqForSchema.map((x) => ({ q: x.question, a: x.answer }));
  const emitFaqJsonLd =
    mergedFaqItems.length >= 3 && (seo === null ? true : seo.emitFaqSchema !== false);
  const bodyHtml = stripBrokenOrEmptyImagesFromHtml(
    applyAutoLinksToHtml(post.body, {
      exam: post.exam,
      countryTarget: post.countryTarget,
      relatedLessonPaths: post.relatedLessonPaths,
      relatedTools: post.relatedTools,
      maxTotalAutoLinks: 14,
    }),
  );
  const framingHtml = blogExamFramingHtml({
    keywordStem,
    examGeo: geo.examGeo,
    examPlain: geo.examPlain,
    bodyHtml: post.body,
  });
  const studyAnchors = blogStudyAnchorTargets({
    exam: post.exam,
    countryTarget: post.countryTarget,
  });
  const studyAnchorsText = studyLinkAnchorsForExam(normalizeExamForBlogSeo(post.exam));

  const crumbs = [
    { name: "Allied health", href: "/allied-health" },
    { name: prof.h1, href: `/allied-health/${slug}` },
    { name: "Blog", href: `/allied-health/${slug}/blog` },
    { name: h1Text },
  ];
  const schemaItems = [
    { name: "Allied health", item: absoluteUrl("/allied-health") },
    { name: prof.h1, item: absoluteUrl(`/allied-health/${slug}`) },
    { name: "Blog", item: absoluteUrl(`/allied-health/${slug}/blog`) },
    { name: h1Text, item: absoluteUrl(`/allied-health/${slug}/blog/${post.slug}`) },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {emitFaqJsonLd ? (
        <BlogFaqPageJsonLd
          items={mergedFaqItems.map((f) => ({ question: f.q, answer: f.a }))}
        />
      ) : null}
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={`/allied-health/${slug}/blog`} className="text-sm font-medium text-primary hover:underline">
        ← Back to blog
      </Link>
      <BlogStudyAnchorStrip
        {...studyAnchors}
        practiceAnchorText={studyAnchorsText.practice}
        adaptiveAnchorText={studyAnchorsText.adaptive}
        flashcardsAnchorText={studyAnchorsText.flashcards}
        className="mt-6"
        labelledById="allied-blog-study-top"
      />
      <header className="mt-4">
        {post.category ? (
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">{post.category}</p>
        ) : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)]">{h1Text}</h1>
        <p className="mt-2 text-base leading-relaxed text-[var(--theme-muted-text)]">{leadSentence}</p>
        <p className="mt-3 text-base text-[var(--theme-muted-text)]">{post.excerpt}</p>
      </header>
      {framingHtml ? (
        <div className="mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: framingHtml }} />
      ) : null}
      <div
        className="prose prose-neutral mt-8 max-w-none dark:prose-invert [&_a]:text-primary"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
      {emitFaqJsonLd ? (
        <section
          className="mt-10 rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 not-prose"
          aria-labelledby="allied-blog-faq-heading"
        >
          <h2
            id="allied-blog-faq-heading"
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
      <BlogStudyAnchorStrip
        {...studyAnchors}
        practiceAnchorText={studyAnchorsText.practice}
        adaptiveAnchorText={studyAnchorsText.adaptive}
        flashcardsAnchorText={studyAnchorsText.flashcards}
        className="mt-10"
        labelledById="allied-blog-study-bottom"
      />
    </article>
  );
}
