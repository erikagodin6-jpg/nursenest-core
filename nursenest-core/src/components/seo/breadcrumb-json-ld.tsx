import { MARKETING_SITE_ORIGIN } from "@/lib/seo/site-origin";

export type BreadcrumbJsonLdItem = { name: string; path: string };

function absolute(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${MARKETING_SITE_ORIGIN}${p}`;
}

/** Schema.org BreadcrumbList for public marketing pages (indexable). */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbJsonLdItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
