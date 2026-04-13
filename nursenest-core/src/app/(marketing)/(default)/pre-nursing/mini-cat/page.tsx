import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { PreNursingMiniCatRunner } from "@/components/pre-nursing/pre-nursing-mini-cat-runner";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Pre-Nursing Mini Adaptive Exam | NurseNest",
  description:
    "Take a free adaptive practice exam designed for pre-nursing students. 10–15 beginner-friendly questions that adjust to your level. Instant feedback and personalized next steps.",
  alternates: { canonical: absoluteUrl("/pre-nursing/mini-cat") },
  openGraph: {
    title: "Pre-Nursing Mini Adaptive Exam | NurseNest",
    description: "Free adaptive exam for pre-nursing students. 10–15 questions, instant feedback, personalized next steps.",
    url: absoluteUrl("/pre-nursing/mini-cat"),
    type: "website",
  },
};

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Pre-Nursing", href: "/pre-nursing" },
  { label: "Mini Adaptive Exam", href: "/pre-nursing/mini-cat" },
];

const schemaItems = crumbs.map((c, i) => ({
  "@type": "ListItem" as const,
  position: i + 1,
  name: c.label,
  item: absoluteUrl(c.href),
}));

export default function PreNursingMiniCatPage() {
  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-4">
          <BreadcrumbTrail items={crumbs} />
        </div>

        <Link
          href="/pre-nursing"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--theme-muted-text)] hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pre-Nursing
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--theme-heading-text)" }}>
            Pre-Nursing Adaptive Exam
          </h1>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--semantic-text-secondary)" }}>
            A short adaptive exam covering 10 core pre-nursing topics. Questions adjust in real time based on how you answer — no prior knowledge required.
          </p>
        </div>

        {/* Runner card */}
        <div
          className="rounded-2xl border p-6 sm:p-8"
          style={{
            borderColor: "var(--semantic-border-soft)",
            background: "var(--semantic-surface)",
          }}
        >
          <PreNursingMiniCatRunner />
        </div>

        {/* Bottom reassurance */}
        <p className="mt-6 text-center text-xs" style={{ color: "var(--semantic-text-secondary)" }}>
          Free to take · No account required · Results are private
        </p>
      </div>
    </div>
  );
}
