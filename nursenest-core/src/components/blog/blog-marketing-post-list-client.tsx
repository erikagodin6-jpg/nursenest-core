"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BlogPostCard } from "@/components/blog/blog-post-card";

export type BlogMarketingPostJson = {
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  createdAt: string;
};

const TOPIC_LINKS: { label: string; href: string }[] = [
  { label: "Pathophysiology", href: "/blog/tag/pathophysiology" },
  { label: "Pharmacology", href: "/blog/tag/pharmacology" },
  { label: "NCLEX strategy", href: "/blog/tag/NCLEX%20strategy" },
];

/**
 * Search + topic shortcuts + responsive card grid for marketing `/blog` lists.
 */
export function BlogMarketingPostListClient({ posts }: { posts: BlogMarketingPostJson[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((p) => {
      const hay = `${p.title} ${p.excerpt} ${p.category ?? ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [posts, q]);

  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <label className="block min-w-0 flex-1 sm:max-w-md">
            <span className="sr-only">Search articles</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search titles and topics…"
              autoComplete="off"
              className="w-full min-w-0 rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-[var(--theme-body-text)] shadow-sm outline-none ring-offset-[var(--theme-page-bg)] placeholder:text-[var(--theme-muted-text)] focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </label>
          <p className="text-xs text-[var(--theme-muted-text)] sm:text-right">
            Showing {filtered.length} of {posts.length}
          </p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Browse by topic">
          {TOPIC_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex max-w-full items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_7%,var(--theme-card-bg))] px-3 py-1.5 text-xs font-semibold text-[var(--theme-body-text)] shadow-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--theme-card-bg))] [overflow-wrap:anywhere]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--theme-muted-text)]">No articles match your search.</p>
      ) : (
        <ul className="grid list-none gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <BlogPostCard
              key={p.slug}
              post={{
                slug: p.slug,
                title: p.title,
                excerpt: p.excerpt,
                category: p.category,
                createdAt: new Date(p.createdAt),
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
