import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { MARKETING_HOME_FAQ_JSONLD } from "@/lib/seo/marketing-home-faq-schema";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import { getHomepageLessonTeasers } from "@/lib/marketing/homepage-lesson-teasers";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { absoluteUrl } from "@/lib/seo/site-origin";

/** ISR: homepage shell + cached lesson teaser strip (see getHomepageLessonTeasers). */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "NurseNest: NCLEX, REx-PN, NP, and allied exam prep",
  description:
    "Clinical practice questions, lessons, and timed exams for RPN or LPN, RN, NCLEX, REx-PN, NP, and allied health. Built for Canada and the US.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "NurseNest: NCLEX, REx-PN, NP, and allied exam prep",
    url: absoluteUrl("/"),
    type: "website",
  },
};

export default async function HomePage() {
  const lessonTeasers = await getHomepageLessonTeasers();
  const { crumbs, schemaItems } = marketingHomeSurfaceBreadcrumbs();
  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={MARKETING_HOME_FAQ_JSONLD} />
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <HomeRestoredClient lessonTeasers={lessonTeasers} />
    </>
  );
}
