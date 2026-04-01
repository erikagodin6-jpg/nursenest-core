import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PreNursingAccountCapture } from "@/components/pre-nursing/pre-nursing-account-capture";
import { PreNursingMilestoneStrip } from "@/components/pre-nursing/pre-nursing-milestone-strip";
import { PreNursingNextStepsBlock } from "@/components/pre-nursing/pre-nursing-next-steps-block";
import { PreNursingSurfaceAnalytics } from "@/components/pre-nursing/pre-nursing-surface-analytics";
import { PreNursingStudyPlanClient } from "@/components/pre-nursing/pre-nursing-study-plan-client";
import { preNursingStudyPlanBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 86400;

const stTitle = "Pre-Nursing study planning — target date & pacing | NurseNest";
const stDesc =
  "Optional school-start or readiness target for free Pre-Nursing modules — not an NCLEX exam date. Pace foundations, then move to paid NurseNest exam prep when you choose.";

export const metadata: Metadata = {
  title: stTitle,
  description: stDesc,
  alternates: { canonical: absoluteUrl("/pre-nursing/study-plan") },
  openGraph: {
    title: stTitle,
    description: stDesc,
    url: absoluteUrl("/pre-nursing/study-plan"),
    type: "website",
  },
  twitter: { card: "summary_large_image", title: stTitle, description: stDesc },
};

export default function PreNursingStudyPlanPage() {
  const { crumbs, schemaItems } = preNursingStudyPlanBreadcrumbs();

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <PreNursingSurfaceAnalytics surface="study_plan" />
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>
        <PreNursingMilestoneStrip sourceSurface="study_plan" />

        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Free · Pre-Nursing</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
            Study planning
          </h1>
          <p className="mt-3 text-muted">
            Optional targets help you pace the free module library. This is not a licensure exam registration — it’s a
            readiness or program-start anchor you can change anytime.
          </p>
          <Link href="/pre-nursing" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
            ← Pre-Nursing overview
          </Link>
        </header>

        <PreNursingStudyPlanClient />
        <PreNursingAccountCapture sourceSurface="study_plan" />
        <PreNursingNextStepsBlock sourceSurface="study_plan" />
      </div>
    </div>
  );
}
