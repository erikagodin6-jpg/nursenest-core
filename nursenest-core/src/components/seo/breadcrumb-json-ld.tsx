import type { BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";

/**
 * schema.org BreadcrumbList for indexable marketing pages.
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbSchemaItem[] }) {
  const list = items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: toAbsoluteSiteUrl(it.item),
  }));

  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list,
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD is safe static output
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
