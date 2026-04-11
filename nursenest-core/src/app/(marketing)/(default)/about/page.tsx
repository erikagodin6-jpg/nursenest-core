import type { Metadata } from "next";
import { AboutPageClient } from "@/components/marketing/about-page-client";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { absoluteUrl } from "@/lib/seo/site-origin";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/about");
      const canonical = absoluteUrl("/about");
      return {
        title: "About NurseNest — Adaptive Exam Prep Built for Nurses",
        description:
          "NurseNest combines structured clinical lessons, a CAT exam engine, smart review, and adaptive study plans to help nurses pass the NCLEX and reach exam readiness faster.",
        alternates: { canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: {
          title: "About NurseNest",
          description:
            "See how NurseNest's adaptive system — lessons, practice, CAT, and smart review — helps nurses prepare for real exam success.",
          url: canonical,
          type: "website",
          siteName: "NurseNest",
        },
        twitter: {
          card: "summary_large_image",
          title: "About NurseNest",
          description:
            "Adaptive lessons, practice questions, CAT exams, smart review, and personalised study plans — in one place.",
        },
      };
    },
    {
      pathname: "/about",
      locale: DEFAULT_MARKETING_LOCALE,
      routeGroup: "marketing.default.about",
    },
  );
}

export default function AboutPage() {
  return <AboutPageClient />;
}
