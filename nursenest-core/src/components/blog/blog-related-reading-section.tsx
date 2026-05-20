import Link from "next/link";
import type { BlogPublishingRelatedPost } from "@/lib/blog/blog-publishing-package";

export function BlogRelatedReadingSection({ items }: { items: BlogPublishingRelatedPost[] }) {
  if (items.length === 0) return null;
  return (
    <section className="nn-premium-blog-related mt-10 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_6%,var(--theme-card-bg))] p-5 shadow-sm">
      <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Related reading</h2>
      <ul className="mt-4 grid list-none gap-3 sm:grid-cols-2">
        {items.map((r) => (
          <li
            key={r.slug}
            className="nn-premium-blog-related-card min-w-0 overflow-hidden rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-4 shadow-sm transition hover:border-primary/35"
          >
            <Link
              href={`/blog/${encodeURIComponent(r.slug)}`}
              className="font-semibold text-primary [overflow-wrap:anywhere] hover:underline"
            >
              {r.title}
            </Link>
            {r.excerpt ? (
              <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[var(--theme-muted-text)] [overflow-wrap:anywhere]">
                {r.excerpt}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
