import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isValidPublicUrl } from "@/lib/seo/public-url-validator";
import { absoluteUrl } from "@/lib/seo/site-origin";

/** Relative path (e.g. `/flashcards`) or site-root path. */
export type BreadcrumbJsonLdItem = { name: string; path: string };
/** Alternate shape from pathway/blog breadcrumb helpers (`item` may be absolute or relative). */
export type BreadcrumbJsonLdItemAlt = { name: string; item: string };

export type BreadcrumbJsonLdInput = BreadcrumbJsonLdItem | BreadcrumbJsonLdItemAlt;

function resolveItemUrl(it: BreadcrumbJsonLdInput): string {
  if ("path" in it) return absoluteUrl(it.path);
  const raw = it.item;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return absoluteUrl(raw);
}

/** Schema.org BreadcrumbList for public marketing pages (indexable). */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbJsonLdInput[] }) {
  const filtered = items.filter((it, i) => {
    const resolved = resolveItemUrl(it);
    const r = isValidPublicUrl(resolved);
    if (!r.ok) {
      safeServerLog("seo", "breadcrumb_jsonld_item_rejected", {
        position: String(i + 1),
        name: it.name.slice(0, 120),
        url: resolved.slice(0, 500),
        code: r.code,
        detail: (r.detail ?? "").slice(0, 200),
      });
      return false;
    }
    return true;
  });
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: filtered.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: resolveItemUrl(it),
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
