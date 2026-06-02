import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";

/**
 * Server-rendered marketing breadcrumb row + matching BreadcrumbList JSON-LD.
 * @deprecated Import `Breadcrumbs` from `@/components/navigation/breadcrumbs`.
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
  return <Breadcrumbs crumbs={crumbs} schemaItems={schemaItems} navClassName={navClassName} />;
}
