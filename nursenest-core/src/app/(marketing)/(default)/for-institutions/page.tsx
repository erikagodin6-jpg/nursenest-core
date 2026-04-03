import type { Metadata } from "next";
import { MarketingForInstitutionsPage } from "@/components/marketing/marketing-for-institutions-page";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";

export const metadata: Metadata = {
  title: "Institutional pricing",
  description:
    "Volume licensing and cohort access for nursing schools, programs, and healthcare education teams using NurseNest Core.",
  alternates: { canonical: "/for-institutions" },
};

export default async function ForInstitutionsPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingForInstitutionsPage locale={locale} />;
}
