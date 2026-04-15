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
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

// See src/lib/blog/localized-blog-route-params.ts for why slug/examCode are overloaded here.
type Props = {
  params: Promise<RawBlogPostParams>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const revalidate = 120;

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

      return {
        title: seo.title,
        description: seo.description,
        alternates: {
          canonical: seo.canonicalUrl,
          languages: Object.fromEntries(seo.hreflangEntries.map((h) => [h.locale, h.href])),
        },
        openGraph: {
          title: seo.ogTitle,
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

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.jsonLdArticle) }}
      />

      <BreadcrumbJsonLd items={seo.breadcrumbs.map((b) => ({ name: b.label, item: b.href }))} />

      <div className="mb-6">
        <BreadcrumbTrail items={seo.breadcrumbs.map((b) => ({ name: b.label, href: b.href }))} />
      </div>

      <Link href={blogListHref} className="text-sm font-medium text-primary hover:underline">
        ← Blog
      </Link>

      <header className="mt-6 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">
          {regionName} · {exam.toUpperCase()}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)]">
          {post.localizedTitle}
        </h1>
        {post.publishedAt ? (
          <p className="text-sm text-[var(--theme-muted-text)]">
            {post.publishedAt.toISOString().slice(0, 10)}
          </p>
        ) : null}
      </header>

      <div
        className="prose prose-neutral mt-8 max-w-none dark:prose-invert [&_a]:text-primary [&_h2]:text-[var(--theme-heading-text)] [&_h3]:text-[var(--theme-heading-text)]"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
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
