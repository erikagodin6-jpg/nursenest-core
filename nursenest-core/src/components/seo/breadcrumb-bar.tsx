import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";

/**
 * Server-rendered marketing breadcrumb row + matching BreadcrumbList JSON-LD.
 * Fixed min-height reduces layout shift when the trail wraps on small viewports.
 */
export function BreadcrumbBar({
  crumbs,
  schemaItems,
  navClassName,
}: {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
  navClassName?: string;
}) {
  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="min-h-9 mb-4">
        <BreadcrumbTrail items={crumbs} navClassName={navClassName} />
      </div>
    </>
  );
}
