import type { Metadata } from "next";
import Link from "next/link";
import {
  AlliedHealthRegionStrip,
  AlliedHealthTrustStrip,
  AlliedHubProfessionSections,
} from "@/components/marketing/allied-health-hub-content";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { alliedProfessionsGroupedForHub } from "@/lib/allied/allied-professions-registry";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { alliedHubBreadcrumbs } from "@/lib/seo/allied-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 86400;

const BASE = "/allied-health";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Allied health certification prep | RT, MLT, paramedic & more | NurseNest";
  const description =
    "Certification prep for respiratory therapy, medical lab, imaging, paramedic, pharmacy technician, PTA, OTA, and social work. Choose your country, then your profession. Lessons and practice stay scoped to allied plans.";
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(BASE) },
    openGraph: { title, description, url: absoluteUrl(BASE), type: "website" },
  };
}

export default async function AlliedHealthHubPage() {
  const usAllied = getExamPathwayById("us-allied-core");
  const caAllied = getExamPathwayById("ca-allied-core");
  if (!usAllied || !caAllied) {
    throw new Error("Allied exam pathways (us-allied-core / ca-allied-core) must exist in the product registry.");
  }

  const usOverview = buildExamPathwayPath(usAllied);
  const caOverview = buildExamPathwayPath(caAllied);
  const usQuestions = buildExamPathwayPath(usAllied, "questions");
  const caQuestions = buildExamPathwayPath(caAllied, "questions");

  const grouped = alliedProfessionsGroupedForHub();
  const { crumbs, schemaItems } = alliedHubBreadcrumbs();

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>

        <header className="relative overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-gradient-to-br from-[var(--accent-soft)] via-[var(--theme-card-bg)] to-[var(--bg-section-alt)] px-6 py-12 sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Allied health professionals</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl lg:text-[2.35rem] lg:leading-tight">
            Certification prep for your discipline, not a generic nursing page
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--theme-muted-text)] sm:text-lg">
            You are in the right place if you are preparing for RT, MLT, imaging, paramedic, pharmacy technician, PTA, OTA, or
            social work exams. Start with your country, jump into your profession, then open lessons or the question bank on
            an allied plan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
            >
              See allied plans
            </Link>
            <a
              href="#allied-region-heading"
              className="inline-flex rounded-full border border-[var(--border-medium)] bg-[var(--theme-card-bg)] px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-[var(--surface-interactive-hover)]"
            >
              Pick country and profession
            </a>
          </div>
        </header>

        <AlliedHealthRegionStrip
          us={{
            label: "United States allied hub",
            countryLine: "United States",
            overviewHref: usOverview,
            questionsHref: usQuestions,
            pricingHint: "Checkout uses US billing and the allied subscription tier.",
          }}
          ca={{
            label: "Canada allied hub",
            countryLine: "Canada",
            overviewHref: caOverview,
            questionsHref: caQuestions,
            pricingHint: "Checkout uses Canadian billing and the allied subscription tier.",
          }}
        />

        <AlliedHubProfessionSections grouped={grouped} />

        <AlliedHealthTrustStrip />

        <p className="mt-12 text-center text-xs text-[var(--theme-muted-text)]">
          <Link href="/exam-lessons" className="font-medium text-primary hover:underline">
            Looking for NCLEX or NP instead? Browse nursing and advanced practice pathways.
          </Link>
        </p>
      </div>
    </div>
  );
}
