import type { Metadata } from "next";
import { AdmissionsEntranceExamsHub } from "@/components/pre-nursing/admissions-entrance-exams-hub";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Admissions & Entrance Exams | NurseNest",
  description:
    "Prepare for ATI TEAS, HESI A2, and CASPER with NurseNest admissions lessons, flashcards, practice questions, study plans, and readiness tracking.",
  alternates: { canonical: absoluteUrl("/admissions") },
  openGraph: {
    title: "Admissions & Entrance Exams | NurseNest",
    description:
      "ATI TEAS, HESI A2, and CASPER admissions prep built as first-class NurseNest learning pathways.",
    url: absoluteUrl("/admissions"),
    type: "website",
  },
};

export default function AdmissionsPage() {
  return <AdmissionsEntranceExamsHub />;
}
