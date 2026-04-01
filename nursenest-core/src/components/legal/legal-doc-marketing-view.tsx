import { LegalMarkdownBody } from "@/components/legal/legal-markdown-body";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { loadLegalMarkdownDoc, type LegalDocId } from "@/lib/legal/load-legal-doc";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import type { BreadcrumbResolution } from "@/lib/seo/breadcrumb-types";

export type LegalDocMarketingViewProps =
  | { docId: LegalDocId; breadcrumbLabel: string; path: string }
  | { docId: LegalDocId; breadcrumbResolution: BreadcrumbResolution };

export async function LegalDocMarketingView(props: LegalDocMarketingViewProps) {
  const md = await loadLegalMarkdownDoc(props.docId);
  const { crumbs, schemaItems } =
    "breadcrumbResolution" in props
      ? props.breadcrumbResolution
      : simpleMarketingBreadcrumbs(props.breadcrumbLabel, props.path);
  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mx-auto max-w-3xl px-4 pt-4 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <LegalMarkdownBody markdown={md} />
      </article>
    </>
  );
}
