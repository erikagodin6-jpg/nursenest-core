import Link from "next/link";
import type { BlogTopicBadgeVariant } from "@/lib/blog/blog-post-category-visual";

const VARIANT_CLASS: Record<BlogTopicBadgeVariant, string> = {
  success: "nn-badge-semantic-success",
  info: "nn-badge-semantic-info",
  warning: "nn-badge-semantic-warning",
  danger: "nn-badge-semantic-danger",
  brand: "nn-blog-topic-badge-brand",
  muted: "nn-blog-topic-badge-muted",
};

export function BlogTopicBadge({
  label,
  variant,
  href,
}: {
  label: string;
  variant: BlogTopicBadgeVariant;
  /** When set, badge is a link (e.g. category archive). */
  href?: string | null;
}) {
  const cls = VARIANT_CLASS[variant] ?? VARIANT_CLASS.muted;
  const inner = <span className={`${cls} max-w-full truncate`}>{label}</span>;
  if (href) {
    return (
      <Link href={href} className="min-w-0 max-w-full shrink outline-offset-2 focus-visible:ring-2 focus-visible:ring-primary/40 rounded-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
