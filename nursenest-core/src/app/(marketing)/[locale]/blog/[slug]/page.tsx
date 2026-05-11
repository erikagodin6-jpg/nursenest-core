import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { BlogFaqPageJsonLd, BlogPostingJsonLd } from "@/components/seo/seo-json-ld";
import { sanitizePublicBlogBodyHtml } from "@/lib/blog/blog-public-article-html";
import { formatRobotsForMultilingualBlog } from "@/lib/blog/multilingual-blog-seo-gates";
import { buildMultilingualBlogHreflangLanguages } from "@/lib/blog/multilingual-blog-seo-hreflang";
import { rewriteBlogHtmlAnchorsForLocale } from "@/lib/blog/multilingual-blog-seo-links";
import {
  absoluteUrlForPath,
  buildMultilingualBlogPublicPath,
  multilingualBlogRouteLocaleUnsupported,
  resolveMultilingualBlogIndexabilityForPage,
} from "@/lib/blog/multilingual-blog-seo-resolve";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";
import { withCrawlSurfacePageRender } from "@/lib/observability/crawl-surface-observability";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = true;
export const revalidate = 3600;

function schemaInLanguage(locale: string): string {
  if (locale === "fr") return "fr-FR";
  if (locale === "es") return "es-ES";
  return locale;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const pathname = `/${locale}/blog/${slug}`;

  return safeGenerateMetadata(
    async () => {
      if (multilingualBlogRouteLocaleUnsupported(locale)) return {};

      const { entry, indexability } = await resolveMultilingualBlogIndexabilityForPage({
        locale,
        slug,
      });
      if (!entry) return {};

      const title = entry.localizedMetaTitle.trim();
      const description = entry.localizedMetaDescription.trim().slice(0, 160);
      const canonical = absoluteUrlForPath(pathname);
      const robots = formatRobotsForMultilingualBlog(indexability);
      const languages = await buildMultilingualBlogHreflangLanguages({ entry });

      const ogTitle = (entry.openGraphTitle ?? entry.localizedMetaTitle).trim();
      const ogDesc = (entry.openGraphDescription ?? entry.localizedMetaDescription).trim().slice(0, 200);
      const twTitle = (entry.twitterTitle ?? ogTitle).trim();
      const twDesc = (entry.twitterDescription ?? ogDesc).trim().slice(0, 200);

      return {
        title,
        description,
        robots,
        alternates: {
          canonical,
          languages,
        },
        openGraph: {
          title: ogTitle,
          description: ogDesc,
          url: canonical,
          type: "article",
          locale: locale === "fr" ? "fr_FR" : locale === "es" ? "es_ES" : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title: twTitle,
          description: twDesc,
        },
      };
    },
    {
      pathname,
      locale,
      routeGroup: "marketing.locale.multilingual_blog.slug",
    },
  );
}

export default async function MultilingualMarketingBlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const pathname = `/${locale}/blog/${slug}`;

  return withCrawlSurfacePageRender(
    "marketing.blog_post",
    pathname,
    async () => {
      if (multilingualBlogRouteLocaleUnsupported(locale)) notFound();

      const { entry, indexability } = await resolveMultilingualBlogIndexabilityForPage({
        locale,
        slug,
      });
      if (!entry) notFound();

      const safeBody = sanitizePublicBlogBodyHtml(entry.localizedBodyHtml, {
        hasStructuredApaReferences: false,
      });
      const bodyHtml = await rewriteBlogHtmlAnchorsForLocale(safeBody, locale);

      const selfPath = buildMultilingualBlogPublicPath(locale, entry.localizedSlug);

      const crumbs: BreadcrumbCrumb[] = [
        { name: locale === "fr" ? "Accueil" : locale === "es" ? "Inicio" : "Home", href: `/${locale}` },
        { name: "Blog", href: "/blog" },
        { name: entry.localizedTitle },
      ];

      const schemaItems: BreadcrumbSchemaItem[] = [
        { name: crumbs[0].name, item: `/${locale}` },
        { name: "Blog", item: "/blog" },
        { name: entry.localizedTitle, item: selfPath },
      ];

      const faqItems = entry.localizedFaq.filter((f) => f.question.trim() && f.answer.trim());

      const publishedAt = entry.datePublished;
      const modifiedAt = entry.dateModified;

      return (
        <article className="nn-premium-blog-article mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <BlogPostingJsonLd
            slug={entry.localizedSlug}
            resourcePath={selfPath}
            title={entry.localizedMetaTitle.trim()}
            description={entry.localizedMetaDescription.trim().slice(0, 320)}
            datePublished={new Date(publishedAt).toISOString()}
            dateModified={new Date(modifiedAt).toISOString()}
            coverImage={entry.coverImageUrl ?? undefined}
            keywords={entry.schemaKeywords}
            articleSection={entry.categoryLabel ?? undefined}
            inLanguage={schemaInLanguage(locale)}
          />
          {faqItems.length >= 2 ?
            <BlogFaqPageJsonLd items={faqItems.map((f) => ({ question: f.question, answer: f.answer }))} />
          : null}
          <div className="nn-premium-blog-article-hero">
            <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
            <Link
              href="/blog"
              className="nn-premium-blog-back-link inline-flex min-h-[44px] min-w-0 items-center text-sm font-semibold text-primary hover:underline"
            >
              {locale === "fr" ? "← Retour au blog" : locale === "es" ? "← Volver al blog" : "← Back to blog"}
            </Link>
            <header className="mt-6 space-y-3">
              {entry.categoryLabel ?
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                  {entry.categoryLabel}
                </p>
              : null}
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl [overflow-wrap:anywhere]">
                {entry.localizedH1.trim()}
              </h1>
              <p className="text-sm text-[var(--theme-muted-text)]">
                <time dateTime={publishedAt}>{publishedAt}</time>
              </p>
              {!indexability.indexable ?
                <p className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--theme-card-bg))] px-3 py-2 text-xs text-[var(--theme-body-text)]">
                  {locale === "fr" ?
                    "Aperçu éditorial — indexation désactivée jusqu’à publication et revue qualité."
                  : locale === "es" ?
                    "Borrador editorial: la indexación permanece desactivada hasta publicación y revisión."
                  : "Editorial preview — indexing disabled until published and quality-reviewed."}
                </p>
              : null}
            </header>
          </div>

          {entry.coverImageUrl ?
            <figure className="mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.coverImageUrl}
                alt={entry.localizedCoverImageAlt ?? ""}
                className="w-full rounded-xl border border-[var(--theme-card-border)] object-cover"
              />
            </figure>
          : null}

          <p className="mt-6 text-lg text-[var(--theme-body-text)] [overflow-wrap:anywhere]">{entry.localizedExcerpt.trim()}</p>

          <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,65ch)_1fr] lg:items-start lg:gap-10">
            <div
              className="nn-premium-blog-prose prose prose-neutral min-w-0 max-w-[65ch] dark:prose-invert [&_a]:text-primary [&_h2]:text-[var(--theme-heading-text)] [&_h3]:text-[var(--theme-heading-text)]"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </div>

          <section className="mt-10 overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_6%,var(--theme-card-bg))] p-4 text-xs text-[var(--theme-body-text)] [overflow-wrap:anywhere]">
            {locale === "fr" ?
              "Usage éducatif seulement. Le contenu aide à la préparation aux examens et ne remplace pas le jugement clinique ni les protocoles locaux."
            : locale === "es" ?
              "Uso educativo únicamente. El contenido apoya la preparación de exámenes y no sustituye el juicio clínico ni los protocolos locales."
            : "Educational use only. This content supports exam preparation and does not replace clinical judgment or local protocols."}
          </section>
        </article>
      );
    },
  );
}
