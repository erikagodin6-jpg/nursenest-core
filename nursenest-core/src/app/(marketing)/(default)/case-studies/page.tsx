import type { Metadata } from "next";
import { CaseStudiesPageClient } from "@/components/marketing/case-studies-page-client";
import { BreadcrumbsFromResolution } from "@/components/navigation/breadcrumbs";
import { caseStudiesBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export const metadata: Metadata = {
  title: "Clinical case studies | NurseNest",
  description: "Prioritization and safety vignettes for nursing exam preparation.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  const breadcrumbResolution = caseStudiesBreadcrumbs();
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <BreadcrumbsFromResolution resolution={breadcrumbResolution} pathname="/case-studies" />
      <CaseStudiesPageClient />
    </div>
  );
}
