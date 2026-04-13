import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import {
  getBlogPostMetaBySlug,
  getPublishedBlogPostBySlug,
  isBlogPostMetaVisible,
} from "@/lib/blog/safe-blog-queries";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ slug: string; postSlug: string }> };

export const revalidate = 120;

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
    async () => ({
      title: meta.seoTitle || meta.title,
      description: meta.seoDescription || meta.excerpt,
      alternates: { canonical: absoluteUrl(`/allied-health/${slug}/blog/${postSlug}`) },
      openGraph: {
        title: meta.seoTitle || meta.title,
        description: meta.seoDescription || meta.excerpt,
        url: absoluteUrl(`/allied-health/${slug}/blog/${postSlug}`),
        type: "article",
      },
    }),
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

  const crumbs = [
    { name: "Allied health", href: "/allied-health" },
    { name: prof.h1, href: `/allied-health/${slug}` },
    { name: "Blog", href: `/allied-health/${slug}/blog` },
    { name: post.title },
  ];
  const schemaItems = [
    { name: "Allied health", item: absoluteUrl("/allied-health") },
    { name: prof.h1, item: absoluteUrl(`/allied-health/${slug}`) },
    { name: "Blog", item: absoluteUrl(`/allied-health/${slug}/blog`) },
    { name: post.title, item: absoluteUrl(`/allied-health/${slug}/blog/${post.slug}`) },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={`/allied-health/${slug}/blog`} className="text-sm font-medium text-primary hover:underline">
        ← Back to blog
      </Link>
      <header className="mt-4">
        {post.category ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">{post.category}</p>
        ) : null}
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">{post.title}</h1>
        <p className="mt-3 text-base text-[var(--theme-muted-text)]">{post.excerpt}</p>
      </header>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  );
}
