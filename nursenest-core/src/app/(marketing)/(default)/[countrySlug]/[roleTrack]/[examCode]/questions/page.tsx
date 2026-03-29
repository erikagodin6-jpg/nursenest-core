import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import {
  getExamPathwayByRoute,
  listPublicExamPathways,
} from "@/lib/exam-pathways/exam-product-registry";
import { pathwayQuestionsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";

export function generateStaticParams() {
  return listPublicExamPathways().map((p) => ({
    countrySlug: p.countrySlug,
    roleTrack: p.roleTrack,
    examCode: p.examCode,
  }));
}

type Props = { params: Promise<{ countrySlug: string; roleTrack: string; examCode: string }> };

export default async function ExamPathwayQuestionsHubPage({ params }: Props) {
  const { countrySlug, roleTrack, examCode } = await params;
  const pathway = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
  if (!pathway) notFound();

  const { crumbs, schemaItems } = pathwayQuestionsHubBreadcrumbs(pathway);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={`/${pathway.countrySlug}/${pathway.roleTrack}/${pathway.examCode}`} className="text-sm font-medium text-primary hover:underline">
        ← {pathway.shortName} overview
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">{pathway.shortName} question bank</h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        The live bank filters by your subscription region and tier; pathway-specific exam labels (
        {pathway.contentExamKeys.length ? pathway.contentExamKeys.join(", ") : "tier defaults"}) are applied as content is
        retagged. Sign in to practice—no cross-role leakage at the product gate.
      </p>
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
