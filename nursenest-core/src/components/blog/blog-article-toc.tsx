"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string; depth: 2 | 3 };

/**
 * Sticky "On this page" from H2/H3 inside the article body container (IDs assigned if missing).
 */
export function BlogArticleToc({ containerId }: { containerId: string }) {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;
    const headings = root.querySelectorAll<HTMLHeadingElement>("h2, h3");
    const next: TocItem[] = [];
    headings.forEach((h, i) => {
      const tag = h.tagName.toLowerCase();
      const depth = tag === "h2" ? 2 : 3;
      let id = h.id?.trim();
      if (!id) {
        id = `blog-section-${i}`;
        h.id = id;
      }
      const text = h.textContent?.trim() ?? "";
      if (text.length < 2) return;
      next.push({ id, text, depth });
    });
    setItems(next);
  }, [containerId]);

  if (items.length < 2) return null;

  return (
    <nav
      className="nn-premium-blog-toc sticky top-24 hidden max-h-[min(70vh,520px)] overflow-y-auto rounded-2xl border border-[var(--theme-card-border)] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--theme-card-bg))] p-4 text-sm lg:block"
      aria-label="On this page"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">On this page</p>
      <ol className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.depth === 3 ? "pl-3 [overflow-wrap:anywhere]" : "[overflow-wrap:anywhere]"}
          >
            <a
              href={`#${encodeURIComponent(item.id)}`}
              className="text-[var(--theme-body-text)] underline-offset-2 hover:text-primary hover:underline"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
