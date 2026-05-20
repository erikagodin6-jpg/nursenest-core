import { absoluteUrl } from "@/lib/seo/site-origin";
import { isValidPublicUrl } from "@/lib/seo/public-url-validator";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { BreadcrumbSchemaItem } from "@/lib/breadcrumbs/breadcrumb-types";

function resolveItemUrl(item: string): string {
  const raw = item.trim();
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return absoluteUrl(raw);
}

/**
 * Schema.org `BreadcrumbList` object for `<script type="application/ld+json">`.
 * Filters invalid public URLs (same rules as `BreadcrumbJsonLd`).
 */
export function buildBreadcrumbListJsonLd(schemaItems: BreadcrumbSchemaItem[]): Record<string, unknown> | null {
  const filtered = schemaItems.filter((it, i) => {
    const resolved = resolveItemUrl(it.item);
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
  if (filtered.length < 1) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: filtered.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: resolveItemUrl(it.item),
    })),
  };
}
