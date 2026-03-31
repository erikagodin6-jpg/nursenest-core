import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostDistributionFooter } from "@/components/blog/blog-post-distribution-footer";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { applyAutoLinksToHtml } from "@/lib/blog/blog-auto-link-html";
import {
  getBlogPostMetaBySlug,
  getPublishedBlogPostBySlug,
  isBlogPostMetaVisible,
} from "@/lib/blog/safe-blog-queries";
import { getStaticBlogPost, staticRecordToBlogDisplay } from "@/lib/blog/static-blog-posts";
import { BlogPostingJsonLd } from "@/components/seo/seo-json-ld";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { blogPostBreadcrumbsWithOptionalCategory } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import type { BlogPost } from "@prisma/client";

type Props = { params: Promise<{ slug: string }> };

/** ISR: slug pages are public; revalidate balances freshness vs load. */
export const revalidate = 120;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const visible = await isBlogPostMetaVisible(slug);
  if (!visible) return {};
  const post = await getBlogPostMetaBySlug(slug);
  if (!post) return {};
  const title = post.seoTitle?.trim() || post.title;
  const description = (post.seoDescription?.trim() || post.excerpt).slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/blog/${slug}`) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/blog/${slug}`),
      type: "article",
    },
  };
}

function isDbPost(p: BlogPost | ReturnType<typeof staticRecordToBlogDisplay>): p is BlogPost {
  return "postStatus" in p;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const dbPost = await getPublishedBlogPostBySlug(slug);
  let post: BlogPost | ReturnType<typeof staticRecordToBlogDisplay> | null = null;
  if (dbPost) {
    post = dbPost;
  } else {
    const s = getStaticBlogPost(slug);
    post = s ? staticRecordToBlogDisplay(s) : null;
  }
  if (!post) notFound();

  const { crumbs, schemaItems } = blogPostBreadcrumbsWithOptionalCategory(post.title, slug, post.category);

  const publishedAt = isDbPost(post) ? post.publishAt ?? post.createdAt : post.publishAt ?? post.createdAt;
  const bodyHtml = isDbPost(post)
    ? applyAutoLinksToHtml(post.body, {
        exam: post.exam,
        relatedLessonPaths: post.relatedLessonPaths,
        relatedTools: post.relatedTools,
      })
    : post.body;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <BlogPostingJsonLd
        slug={slug}
        title={post.seoTitle?.trim() || post.title}
        description={(post.seoDescription?.trim() || post.excerpt).slice(0, 320)}
        datePublished={publishedAt.toISOString()}
        coverImage={post.coverImage ?? null}
      />
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
        {isDbPost(post) && post.exam ? (
          <p className="text-xs font-medium text-primary">Exam focus: {post.exam}</p>
        ) : null}
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">{post.title}</h1>
        <p className="text-sm text-[var(--theme-muted-text)]">{publishedAt.toISOString().slice(0, 10)}</p>
      </header>
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage} alt="" className="mt-8 w-full rounded-xl border border-[var(--theme-card-border)] object-cover" />
      ) : null}
      <div
        className="prose prose-neutral mt-8 max-w-none dark:prose-invert [&_a]:text-primary [&_h2]:text-[var(--theme-heading-text)] [&_h3]:text-[var(--theme-heading-text)]"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
      {isDbPost(post) ? (
        <BlogPostDistributionFooter
          exam={post.exam}
          relatedLessonPaths={post.relatedLessonPaths}
          relatedQuestionIds={post.relatedQuestionIds}
          relatedTools={post.relatedTools}
        />
      ) : null}
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
