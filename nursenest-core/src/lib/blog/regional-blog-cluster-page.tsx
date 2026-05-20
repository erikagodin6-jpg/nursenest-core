import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { BlogStudyAnchorStrip } from "@/components/blog/blog-study-anchor-strip";
import { BlogFaqPageJsonLd } from "@/components/seo/seo-json-ld";
import { applyAutoLinksToHtml } from "@/lib/blog/blog-auto-link-html";
import { parseInternalLinkPlanJson, stripBrokenOrEmptyImagesFromHtml } from "@/lib/blog/blog-image-workflow";
import { stripDuplicateStructuredModulesFromPublicBlogBodyHtml } from "@/lib/blog/blog-public-body-strip";
import {
  getBlogPostMetaBySlug,
  getPublishedBlogPostBySlug,
  getPublishedBlogPostsPage,
  isBlogPostMetaVisible,
  BLOG_LIST_PAGE_SIZE,
} from "@/lib/blog/safe-blog-queries";
import {
  regionalBlogClusterLabels,
  type RegionalBlogClusterSlug,
} from "@/lib/blog/blog-scoped-career-hubs";
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

// ─── Index page ──────────────────────────────────────────────────────────────

type IndexProps = { clusterSlug: RegionalBlogClusterSlug; searchParams: Promise<{ page?: string }> };

export async function generateRegionalBlogIndexMetadata(
  clusterSlug: RegionalBlogClusterSlug,
): Promise<Metadata> {
  const labels = regionalBlogClusterLabels(clusterSlug);
  const base = `/blog/${clusterSlug}`;
  return safeGenerateMetadata(
    async () => ({
      title: `${labels.short} exam prep articles | NurseNest`,
      description: `Study guides and practice-question articles for ${labels.h1} candidates — linked to full pathway lessons on NurseNest.`,
      alternates: { canonical: absoluteUrl(base) },
      openGraph: {
        title: `${labels.short} exam prep articles | NurseNest`,
        url: absoluteUrl(base),
        type: "website",
      },
    }),
    { pathname: base, routeGroup: `marketing.default.blog.${clusterSlug}.index` },
  );
}

export async function RegionalBlogIndexPage({ clusterSlug, searchParams }: IndexProps) {
  const labels = regionalBlogClusterLabels(clusterSlug);
  const base = `/blog/${clusterSlug}`;
  const locale = await getMarketingLocaleForDefaultRoute();
  const sp = await searchParams;
  const rawPage = Number(sp.page ?? "1");
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

  const { posts, total, pageSize, listLoad } = await getPublishedBlogPostsPage(page, BLOG_LIST_PAGE_SIZE, {
    locale,
    sourceLocale: "en",
    careerSlug: clusterSlug,
    allowSourceLocaleFallback: true,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const crumbs = [
    { name: "Blog", href: "/blog" },
    { name: `${labels.short} articles`, href: base },
  ];
  const schemaItems = [
    { name: "Blog", item: absoluteUrl("/blog") },
    { name: `${labels.short} articles`, item: absoluteUrl(base) },
  ];

  if (!listLoad.querySucceeded && posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs crumbs={crumbs} schemaItems={schemaItems} pathname={base} analyticsIntent="discovery" />
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">
          {labels.h1} — {labels.examShort} study articles
        </h1>
        <p className="mt-2 text-[var(--theme-muted-text)]">
          Topic-focused guides with practice questions, each linking back to the full pathway lesson on NurseNest.
        </p>
      </header>

      {!listLoad.querySucceeded ? (
        <section
          className="mb-6 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--theme-card-bg))] p-6"
          role="alert"
          aria-live="polite"
        >
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Articles could not load</h2>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            We could not reach the article database. Please refresh or try again shortly.
          </p>
        </section>
      ) : posts.length === 0 ? (
        <p className="text-sm text-[var(--theme-muted-text)]">No published {labels.short} articles yet. Check back soon.</p>
      ) : (
        <>
          <ul className="space-y-6">
            {posts.map((p) => (
              <li key={p.slug} className="border-b border-[var(--theme-separator)] pb-6">
                <Link href={`${base}/${p.slug}`} className="text-lg font-semibold text-primary hover:underline">
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
              <span className="text-[var(--theme-muted-text)]">Page {page} of {totalPages}</span>
              <div className="flex gap-3">
                {page > 1 ? (
                  <Link href={page === 2 ? base : `${base}?page=${page - 1}`} className="font-medium text-primary hover:underline">
                    Previous
                  </Link>
                ) : <span className="text-[var(--theme-muted-text)]">Previous</span>}
                {page < totalPages ? (
                  <Link href={`${base}?page=${page + 1}`} className="font-medium text-primary hover:underline">
                    Next
                  </Link>
                ) : <span className="text-[var(--theme-muted-text)]">Next</span>}
              </div>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}

// ─── Detail page ─────────────────────────────────────────────────────────────

type DetailProps = { clusterSlug: RegionalBlogClusterSlug; postSlug: string };

export async function generateRegionalBlogDetailMetadata(
  clusterSlug: RegionalBlogClusterSlug,
  postSlug: string,
): Promise<Metadata> {
  const base = `/blog/${clusterSlug}`;
  const locale = await getMarketingLocaleForDefaultRoute();
  const visible = await isBlogPostMetaVisible(postSlug, {
    locale,
    sourceLocale: "en",
    careerSlug: clusterSlug,
    allowSourceLocaleFallback: true,
  });
  const meta = await getBlogPostMetaBySlug(postSlug, {
    locale,
    sourceLocale: "en",
    careerSlug: clusterSlug,
    allowSourceLocaleFallback: true,
  });
  if (!visible || !meta) {
    return {
      title: "Post not found | NurseNest",
      robots: { index: false, follow: false },
      alternates: { canonical: absoluteUrl(base) },
    };
  }
  return safeGenerateMetadata(
    async () => {
      const auto = generateBlogSEOFromPostRow(
        { title: meta.title, slug: postSlug, category: meta.category ?? null, tags: meta.tags, exam: meta.exam ?? null, countryTarget: meta.countryTarget ?? null },
        { canonicalPath: `${base}/${postSlug}` },
      );
      const title = blogBrowserTitleForPublicPost({
        seoTitle: meta.seoTitle, title: meta.title, exam: meta.exam, countryTarget: meta.countryTarget,
        slug: postSlug, category: meta.category ?? null, tags: meta.tags,
      });
      const description = (meta.seoDescription?.trim() || auto.metaDescription).slice(0, 155);
      const canonical = absoluteUrl(`${base}/${postSlug}`);
      const seo = parseInternalLinkPlanJson(meta.internalLinkPlan).seo;
      const ogImage = resolveBlogOgImageAbsolute(seo, meta.coverImage);
      return {
        title, description,
        robots: { index: true, follow: true },
        alternates: { canonical },
        openGraph: {
          title, description, url: canonical, type: "article",
          ...(ogImage ? { images: [{ url: ogImage }] } : {}),
        },
        twitter: {
          card: "summary_large_image", title, description,
          ...(ogImage ? { images: [ogImage] } : {}),
        },
      };
    },
    { pathname: `${base}/${postSlug}`, routeGroup: `marketing.default.blog.${clusterSlug}.post` },
  );
}

export async function RegionalBlogDetailPage({ clusterSlug, postSlug }: DetailProps) {
  const labels = regionalBlogClusterLabels(clusterSlug);
  const base = `/blog/${clusterSlug}`;
  const locale = await getMarketingLocaleForDefaultRoute();

  const post = await getPublishedBlogPostBySlug(postSlug, {
    locale,
    sourceLocale: "en",
    careerSlug: clusterSlug,
    allowSourceLocaleFallback: true,
  });
  if (!post) notFound();

  const seo = parseInternalLinkPlanJson(post.internalLinkPlan).seo;
  const geo = blogExamGeoParts(post.exam, blogCountryFromPrismaTarget(post.countryTarget));
  const keywordStem = blogKeywordStemFromTitles(post.seoTitle, post.title);
  const auto = generateBlogSEOFromPostRow(
    { title: post.title, slug: post.slug, category: post.category ?? null, tags: post.tags, exam: post.exam ?? null, countryTarget: post.countryTarget ?? null },
    { canonicalPath: `${base}/${post.slug}` },
  );
  const h1Text = blogH1ForPublicPost({
    seoTitle: post.seoTitle, title: post.title, slug: post.slug,
    category: post.category ?? null, tags: post.tags, exam: post.exam ?? null, countryTarget: post.countryTarget ?? null,
  });
  const faqItemsRaw =
    post.faqBlock && typeof post.faqBlock === "object" && "items" in post.faqBlock
      ? ((post.faqBlock as { items?: { q: string; a: string }[] }).items ?? []).filter((x) => x.q?.trim() && x.a?.trim())
      : [];
  const mergedFaqForSchema = mergeFaqForSchema(
    mergeBlogFaqItemsForPublicPage(
      faqItemsRaw.map((x) => ({ q: x.q.trim(), a: x.a.trim() })),
      { keywordStem, examPlain: geo.examPlain, countryWord: geo.countryWord },
    ).map((x) => ({ q: x.q, a: x.a })),
    auto.faq,
  );
  const mergedFaqItems = mergedFaqForSchema.map((x) => ({ q: x.question, a: x.answer }));
  const emitFaqJsonLd = mergedFaqItems.length >= 3 && (seo === null ? true : seo.emitFaqSchema !== false);
  const bodyHtml = stripDuplicateStructuredModulesFromPublicBlogBodyHtml(
    stripBrokenOrEmptyImagesFromHtml(
      applyAutoLinksToHtml(post.body, {
        exam: post.exam, countryTarget: post.countryTarget,
        relatedLessonPaths: post.relatedLessonPaths, relatedTools: post.relatedTools, maxTotalAutoLinks: 14,
      }),
    ),
    { hasStructuredFaq: emitFaqJsonLd, hasStructuredReferences: false },
  );
  const framingHtml = blogExamFramingHtml({
    keywordStem, examGeo: geo.examGeo, examPlain: geo.examPlain, bodyHtml: post.body,
  });
  const studyAnchors = blogStudyAnchorTargets({ exam: post.exam, countryTarget: post.countryTarget });
  const studyAnchorsText = studyLinkAnchorsForExam(normalizeExamForBlogSeo(post.exam));

  const crumbs = [
    { name: "Blog", href: "/blog" },
    { name: `${labels.short} articles`, href: base },
    { name: h1Text },
  ];
  const schemaItems = [
    { name: "Blog", item: absoluteUrl("/blog") },
    { name: `${labels.short} articles`, item: absoluteUrl(base) },
    { name: h1Text, item: absoluteUrl(`${base}/${post.slug}`) },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {emitFaqJsonLd ? (
        <BlogFaqPageJsonLd items={mergedFaqItems.map((f) => ({ question: f.q, answer: f.a }))} />
      ) : null}
      <Breadcrumbs
        crumbs={crumbs}
        schemaItems={schemaItems}
        pathname={`${base}/${post.slug}`}
        analyticsIntent="discovery"
      />
      <Link href={base} className="text-sm font-medium text-primary hover:underline">
        ← Back to {labels.short} articles
      </Link>
      <BlogStudyAnchorStrip
        {...studyAnchors}
        practiceAnchorText={studyAnchorsText.practice}
        adaptiveAnchorText={studyAnchorsText.adaptive}
        flashcardsAnchorText={studyAnchorsText.flashcards}
        className="mt-6"
        labelledById={`${clusterSlug}-blog-study-top`}
      />
      <header className="mt-4">
        {post.category ? (
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">{post.category}</p>
        ) : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)]">{h1Text}</h1>
        <p className="mt-2 text-base leading-relaxed text-[var(--theme-muted-text)]">{auto.intro}</p>
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
          aria-labelledby={`${clusterSlug}-blog-faq-heading`}
        >
          <h2
            id={`${clusterSlug}-blog-faq-heading`}
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
        labelledById={`${clusterSlug}-blog-study-bottom`}
      />
    </article>
  );
}
