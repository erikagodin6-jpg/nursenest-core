import Link from "next/link";
import { BlogTopicBadge } from "@/components/blog/blog-topic-badge";
import { resolveBlogTopicPresentation } from "@/lib/blog/blog-post-category-visual";
import { parseBlogPostCreatedAt } from "@/lib/blog/safe-blog-post-date";

export type BlogPostCardFields = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string | null;
  coverImage?: string | null;
  createdAt: Date | string;
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
  const createdAt = parseBlogPostCreatedAt(post.createdAt);
  const href = `/blog/${encodeURIComponent(post.slug)}`;
  const topic = resolveBlogTopicPresentation(post.category);
  return (
    <li
      className={[
        "nn-premium-blog-post-card group min-w-0 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[var(--theme-card-bg)] shadow-[var(--semantic-shadow-soft,0_1px_0_rgba(0,0,0,0.04))] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md",
        featured ? "sm:col-span-2" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link href={href} className="block h-full min-w-0 p-4 sm:p-5">
        <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--theme-card-bg))]">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--semantic-brand)_22%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--semantic-success)_16%,var(--theme-card-bg)),var(--theme-card-bg))]" />
          )}
        </div>
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-2 gap-y-1">
          {topic.displayLabel ? (
            <BlogTopicBadge
              label={topic.displayLabel}
              variant={topic.variant}
              /* Avoid nested <a>: the card root is already a Link to the post. */
            />
          ) : (
            <span className="text-xs font-medium text-[var(--theme-muted-text)]">Article</span>
          )}
          <time
            className="shrink-0 text-xs tabular-nums text-[var(--theme-muted-text)]"
            dateTime={createdAt.toISOString()}
          >
            {formatDate(createdAt)}
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
