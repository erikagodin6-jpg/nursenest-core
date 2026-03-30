import type { Metadata } from "next";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { ToolsHubClient } from "@/components/tools/tools-hub-client";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Clinical tools | NurseNest",
  description: "Free nursing calculators: medication math, lab reference, and ABG interpretation practice.",
  alternates: { canonical: absoluteUrl("/tools") },
  openGraph: {
    title: "Clinical tools | NurseNest",
    url: absoluteUrl("/tools"),
    type: "website",
  },
};

export default function ToolsHubPage() {
  return (
    <>
      <ToolsHubClient />
      <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
        <MarketingStudyCrossLinks />
      </div>
    </>
  );
}
