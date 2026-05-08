import Link from "next/link";
import { BlogTopicBadge } from "@/components/blog/blog-topic-badge";
import { resolveBlogTopicPresentation } from "@/lib/blog/blog-post-category-visual";

export type BlogPostCardFields = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string | null;
  createdAt: Date;
};

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function BlogPostCard({
  post,
  featured = false,
}: {
  post: BlogPostCardFields;
  featured?: boolean;
}) {
  const href = `/blog/${encodeURIComponent(post.slug)}`;
  const topic = resolveBlogTopicPresentation(post.category);
  return (
    <li
      className={[
        "nn-premium-blog-post-card group min-w-0 overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] shadow-[var(--semantic-shadow-soft,0_1px_0_rgba(0,0,0,0.04))] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md",
        featured ? "sm:col-span-2" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link href={href} className="block h-full min-w-0 p-4 sm:p-5">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-2 gap-y-1">
          {topic.displayLabel ? (
            <BlogTopicBadge label={topic.displayLabel} variant={topic.variant} href={topic.categoryArchiveHref} />
          ) : (
            <span className="text-xs font-medium text-[var(--theme-muted-text)]">Article</span>
          )}
          <time
            className="shrink-0 text-xs tabular-nums text-[var(--theme-muted-text)]"
            dateTime={post.createdAt.toISOString()}
          >
            {formatDate(post.createdAt)}
          </time>
        </div>
        <h3
          className={[
            "mt-2 min-w-0 font-semibold tracking-tight text-[var(--theme-heading-text)] group-hover:text-primary",
            featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg",
          ].join(" ")}
        >
          <span className="line-clamp-3 [overflow-wrap:anywhere]">{post.title}</span>
        </h3>
        <p className={`mt-2 min-w-0 text-sm leading-relaxed text-[var(--theme-muted-text)] [overflow-wrap:anywhere] ${featured ? "line-clamp-4" : "line-clamp-3"}`}>
          {post.excerpt}
        </p>
        <span className="mt-3 inline-flex text-sm font-semibold text-primary group-hover:underline">Read article</span>
      </Link>
    </li>
  );
}
