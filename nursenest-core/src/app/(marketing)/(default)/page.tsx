import type { Metadata } from "next";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export const metadata: Metadata = {
  title: "NurseNest: NCLEX, REx-PN, NP, and allied exam prep",
  description:
    "Clinical practice questions, lessons, and timed exams for RPN or LPN, RN, NCLEX, REx-PN, NP, and allied health. Built for Canada and the US.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const { crumbs, schemaItems } = marketingHomeSurfaceBreadcrumbs();
  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <HomeRestoredClient />
    </>
  );
}
