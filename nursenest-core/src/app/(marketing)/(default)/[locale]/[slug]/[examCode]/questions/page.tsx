import Link from "next/link";
import { notFound } from "next/navigation";
import { NpQuestionsHubBoardLinks } from "@/components/exam-pathways/np-questions-hub-board-links";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { buildExamPathwayPath, resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayQuestionsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export default async function ExamPathwayQuestionsHubPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathway = resolveExamPathwayFromMarketingHubSegment(locale, slug, examCode);
  if (!pathway) notFound();

  const hubBase = `/${locale}/${slug}/${examCode}`;
  const { crumbs, schemaItems } = pathwayQuestionsHubBreadcrumbs(pathway, { hubBasePath: hubBase });
  const overviewHref = hubBase;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={overviewHref} className="text-sm font-medium text-primary hover:underline">
        ← {pathway.shortName} overview
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">{pathway.shortName} question bank</h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        The live bank filters by your subscription region and tier; pathway-specific exam labels (
        {pathway.contentExamKeys.length ? pathway.contentExamKeys.join(", ") : "tier defaults"}) are applied as content is
        retagged. Sign in to practice. No cross-role leakage at the product gate.
      </p>
      {pathway.roleTrack === "np" ? (
        <div className="mt-4 rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4 text-sm text-[var(--theme-body-text)]">
          <p className="font-semibold text-[var(--theme-heading-text)]">Board-named practice landings</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">
            Prefer a URL that matches how you search? These use the same pathway as{" "}
            <Link href={buildExamPathwayPath(pathway)} className="font-medium text-primary hover:underline">
              {pathway.shortName} overview
            </Link>{" "}
            (canonical hub)—no duplicate content tree.
          </p>
          <NpQuestionsHubBoardLinks pathwayId={pathway.id} />
        </div>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/app/questions"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Open question bank
        </Link>
        <Link href="/signup" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50">
          Create account
        </Link>
      </div>
    </div>
  );
}
