import Link from "next/link";
import type { BlogPublishingRelatedPost } from "@/lib/blog/blog-publishing-package";

export function BlogRelatedReadingSection({ items }: { items: BlogPublishingRelatedPost[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10 rounded-xl border border-border/60 bg-muted/15 p-5">
      <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Related reading</h2>
      <ul className="mt-3 space-y-2 text-sm text-[var(--theme-body-text)]">
        {items.map((r) => (
          <li key={r.slug}>
            <Link href={`/blog/${encodeURIComponent(r.slug)}`} className="font-medium text-primary hover:underline">
              {r.title}
            </Link>
            {r.excerpt ? <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{r.excerpt}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
