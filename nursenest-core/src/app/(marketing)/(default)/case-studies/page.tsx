import type { Metadata } from "next";
import { CaseStudiesPageClient } from "@/components/marketing/case-studies-page-client";

export const metadata: Metadata = {
  title: "Clinical case studies | NurseNest",
  description: "Prioritization and safety vignettes for nursing exam preparation.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return <CaseStudiesPageClient />;
}
