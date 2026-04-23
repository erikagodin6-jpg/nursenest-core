import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { stripBrokenOrEmptyImagesFromHtml } from "@/lib/blog/blog-image-workflow";
import {
  getPublishedLocalizedBlogBySlug,
  getPublishedVariantsForCanonical,
} from "@/lib/blog/safe-localized-blog-queries";
import {
  buildLocalizedBlogSeoMeta,
  type HreflangVariant,
} from "@/lib/blog/blog-seo-localized";
import {
  normalizeBlogPostParams,
  type RawBlogPostParams,
  buildLocalizedBlogHref,
} from "@/lib/blog/localized-blog-route-params";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { isGlobalRegionSlug } from "@/lib/i18n/global-regions";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { BlogStudyAnchorStrip } from "@/components/blog/blog-study-anchor-strip";
import {
  blogBrowserTitleForLocalizedEnPost,
  blogExamFramingHtml,
  blogExamGeoParts,
  blogH1ForPublicPost,
  blogKeywordStemFromTitles,
  blogSeoLeadSentence,
  blogStudyAnchorTargetsForLocalizedRegion,
  mergeBlogFaqItemsForPublicPage,
} from "@/lib/blog/blog-public-seo-helpers";
import { blogCountryFromRegionSlug } from "@/lib/blog/blog-study-cta";
import { BlogFaqPageJsonLd } from "@/components/seo/seo-json-ld";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

// See src/lib/blog/localized-blog-route-params.ts for why slug/examCode are overloaded here.
type Props = {
  params: Promise<RawBlogPostParams>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, region, profession, exam, postSlug } = normalizeBlogPostParams(await params);
  const pathname = buildLocalizedBlogHref({ locale, region, profession, exam, postSlug });

  return safeGenerateMetadata(
    async () => {
      const post = await getPublishedLocalizedBlogBySlug({
        locale,
        region,
        profession,
        exam,
        slug: postSlug,
      });
      if (!post) return {};

      const variants = await getPublishedVariantsForCanonical(post.canonicalArticleId);
      const hreflangVariants: HreflangVariant[] = variants.map((v) => ({
        locale: v.locale as GlobalLocaleCode,
        region: v.region as GlobalRegionSlug,
        slug: v.localizedSlug,
        profession: v.profession ?? profession,
        exam: v.exam ?? exam,
      }));

      const seo = buildLocalizedBlogSeoMeta({
        title: post.localizedTitle,
        metaTitle: post.localizedMetaTitle,
        description: post.localizedExcerpt,
        metaDescription: post.localizedMetaDescription,
        locale: locale as GlobalLocaleCode,
        region: region as GlobalRegionSlug,
        profession,
        exam,
        slug: postSlug,
        publishedAt: post.publishedAt?.toISOString() ?? null,
        updatedAt: post.updatedAt?.toISOString() ?? null,
        coverImage: null,
        variants: hreflangVariants,
      });

      const enTitle = blogBrowserTitleForLocalizedEnPost({
        localizedMetaTitle: post.localizedMetaTitle,
        localizedTitle: post.localizedTitle,
        regionSlug: region,
        exam,
        locale,
      });
      const pageTitle = enTitle ?? seo.title;

      return {
        title: pageTitle,
        description: seo.description,
        robots: { index: true, follow: true },
        alternates: {
          canonical: seo.canonicalUrl,
          languages: Object.fromEntries(seo.hreflangEntries.map((h) => [h.locale, h.href])),
        },
        openGraph: {
          title: enTitle ?? seo.ogTitle,
          description: seo.ogDescription,
          url: seo.ogUrl,
          type: "article",
        },
      };
    },
    { pathname, locale, routeGroup: "marketing.locale.localized_blog.slug" },
  );
}

export default async function LocalizedBlogPostPage({ params }: Props) {
  const { locale, region, profession, exam, postSlug } = normalizeBlogPostParams(await params);

  if (!isCoreHostedNonDefaultLocale(locale) && locale !== "en") notFound();
  if (!isGlobalRegionSlug(region)) notFound();

  const post = await getPublishedLocalizedBlogBySlug({
    locale,
    region,
    profession,
    exam,
    slug: postSlug,
  });
  if (!post) notFound();

  const regionConfig = REGION_CONFIG[region as GlobalRegionSlug];
  const regionName = regionConfig?.displayName ?? region;

  const variants = await getPublishedVariantsForCanonical(post.canonicalArticleId);
  const hreflangVariants: HreflangVariant[] = variants.map((v) => ({
    locale: v.locale as GlobalLocaleCode,
    region: v.region as GlobalRegionSlug,
    slug: v.localizedSlug,
    profession: v.profession ?? profession,
    exam: v.exam ?? exam,
  }));

  const seo = buildLocalizedBlogSeoMeta({
    title: post.localizedTitle,
    metaTitle: post.localizedMetaTitle,
    description: post.localizedExcerpt,
    metaDescription: post.localizedMetaDescription,
    locale: locale as GlobalLocaleCode,
    region: region as GlobalRegionSlug,
    profession,
    exam,
    slug: postSlug,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    updatedAt: post.updatedAt?.toISOString() ?? null,
    coverImage: null,
    variants: hreflangVariants,
  });

  const bodyHtml = stripBrokenOrEmptyImagesFromHtml(post.localizedBody);
  const blogListHref = buildLocalizedBlogHref({ locale, region, profession, exam });
  const geo = blogExamGeoParts(exam, blogCountryFromRegionSlug(region));
  const keywordStem = blogKeywordStemFromTitles(post.localizedMetaTitle, post.localizedTitle);
  const h1Text =
    locale === "en" ?
      blogH1ForPublicPost({ seoTitle: post.localizedMetaTitle, title: post.localizedTitle })
    : post.localizedTitle;
  const enBrowserTitle = blogBrowserTitleForLocalizedEnPost({
    localizedMetaTitle: post.localizedMetaTitle,
    localizedTitle: post.localizedTitle,
    regionSlug: region,
    exam,
    locale,
  });
  const articleJsonLd = {
    ...seo.jsonLdArticle,
    ...(enBrowserTitle ? { headline: enBrowserTitle } : {}),
  };
  const leadSentence =
    locale === "en" ?
      blogSeoLeadSentence({
        keywordStem,
        examPlain: geo.examPlain,
        countryWord: geo.countryWord,
      })
    : null;
  const framingHtml =
    locale === "en" ?
      blogExamFramingHtml({
        keywordStem,
        examGeo: geo.examGeo,
        examPlain: geo.examPlain,
        bodyHtml: post.localizedBody,
      })
    : null;
  const mergedFaqItems = mergeBlogFaqItemsForPublicPage([], {
    keywordStem,
    examPlain: geo.examPlain,
    countryWord: geo.countryWord,
  });
  const emitFaqJsonLd = mergedFaqItems.length >= 3;
  const studyAnchors = blogStudyAnchorTargetsForLocalizedRegion({ exam, regionSlug: region });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {emitFaqJsonLd ? (
        <BlogFaqPageJsonLd
          items={mergedFaqItems.map((f) => ({ question: f.q, answer: f.a }))}
        />
      ) : null}

      <BreadcrumbJsonLd items={seo.breadcrumbs.map((b) => ({ name: b.label, item: b.href }))} />

      <div className="mb-6">
        <BreadcrumbTrail items={seo.breadcrumbs.map((b) => ({ name: b.label, href: b.href }))} />
      </div>

      <Link href={blogListHref} className="text-sm font-medium text-primary hover:underline">
        ← Blog
      </Link>

      <BlogStudyAnchorStrip
        {...studyAnchors}
        className="mt-6"
        labelledById="localized-blog-study-top"
      />

      <header className="mt-6 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">
          {regionName} · {exam.toUpperCase()}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)]">
          {h1Text}
        </h1>
        {leadSentence ? (
          <p className="text-base leading-relaxed text-[var(--theme-muted-text)]">{leadSentence}</p>
        ) : null}
        {post.publishedAt ? (
          <p className="text-sm text-[var(--theme-muted-text)]">
            {post.publishedAt.toISOString().slice(0, 10)}
          </p>
        ) : null}
      </header>

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
          aria-labelledby="localized-blog-faq-heading"
        >
          <h2
            id="localized-blog-faq-heading"
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
        className="mt-10"
        labelledById="localized-blog-study-bottom"
      />

      {post.ctaText && post.ctaHref ? (
        <div className="mt-10 rounded-2xl border border-[var(--semantic-brand)]/30 bg-[var(--semantic-panel-warm)] p-6 text-center">
          <p className="mb-4 text-lg font-semibold text-[var(--theme-heading-text)]">
            {post.ctaText}
          </p>
          <Link
            href={post.ctaHref}
            className="inline-block rounded-xl bg-[var(--semantic-brand)] px-6 py-3 text-sm font-bold text-white shadow-md transition-shadow hover:shadow-lg"
          >
            {post.ctaText}
          </Link>
        </div>
      ) : null}

      {hreflangVariants.length > 1 ? (
        <nav className="mt-8 rounded-xl border border-border/60 bg-muted/10 p-4">
          <p className="mb-2 text-sm font-medium text-[var(--theme-heading-text)]">
            Also available in:
          </p>
          <div className="flex flex-wrap gap-2">
            {hreflangVariants
              .filter((v) => !(v.locale === locale && v.region === region))
              .map((v) => {
                const vRegionConfig = REGION_CONFIG[v.region];
                return (
                  <Link
                    key={`${v.locale}-${v.region}`}
                    href={buildLocalizedBlogHref({
                      locale: v.locale,
                      region: v.region,
                      profession: v.profession,
                      exam: v.exam,
                      postSlug: v.slug,
                    })}
                    className="rounded-full bg-[var(--theme-page-bg)] px-3 py-1 text-xs text-[var(--theme-muted-text)] hover:text-primary hover:underline"
                  >
                    {vRegionConfig?.displayName ?? v.region} ({v.locale.toUpperCase()})
                  </Link>
                );
              })}
          </div>
        </nav>
      ) : null}

      <section className="mt-6 rounded-xl border border-border/60 bg-muted/10 p-4 text-xs text-muted-foreground">
        Educational use only. Content supports exam preparation and is not a substitute for
        professional clinical judgment or local protocols.
      </section>
    </article>
  );
}
