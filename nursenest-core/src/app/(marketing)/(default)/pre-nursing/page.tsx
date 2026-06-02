import type { Metadata } from "next";
import { PreNursingMarketingHubMain } from "@/components/pre-nursing/pre-nursing-marketing-hub-main";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

export const revalidate = 86400;

const title = "Free Pre-Nursing foundations for nursing school | NurseNest";
const description =
  "Free interactive Pre-Nursing modules: anatomy, chemistry, infection control, communication & more. No subscription required. Optional readiness target and a clear path to paid NCLEX/RPN/NP prep when you’re ready.";
const alternates = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/pre-nursing");

export const metadata: Metadata = {
  title,
  description,
  alternates,
  openGraph: {
    title,
    description,
    url: alternates.canonical,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function PreNursingLandingPage() {
  return (
    <div className="nn-marketing-surface">
      <WebPageJsonLd title={title} description={description} path="/pre-nursing" inLanguage="en" />
      <PreNursingMarketingHubMain
        heroTitle="Pre-Nursing"
        heroSubtitle="Choose how you want to study today."
        linkHref={(p) => p}
      />
    </div>
  );
}
