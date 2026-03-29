import type { Metadata } from "next";
import { MarketingForInstitutionsPage } from "@/components/marketing/marketing-for-institutions-page";

export const metadata: Metadata = {
  title: "Institutional pricing",
  description:
    "Volume licensing and cohort access for nursing schools, programs, and healthcare education teams using NurseNest Core.",
  alternates: { canonical: "/for-institutions" },
};

export default function ForInstitutionsPage() {
  return <MarketingForInstitutionsPage locale="en" />;
}
