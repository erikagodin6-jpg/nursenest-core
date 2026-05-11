"use client";

import { useMemo } from "react";

import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { marketingExamHubPath } from "@/lib/marketing/marketing-exam-navigation";
import { publicExamPrepHubDestinations } from "@/lib/navigation/canonical-destinations";
import { HUB } from "@/lib/navigation/canonical-destinations";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";

export type PremiumHomepagePathway = {
  id: "rn" | "pn" | "np" | "international-rn" | "allied";
  title: string;
  subtitle: string;
  body: string;
  href: string;
  cta: string;
  tone: "brand" | "info" | "success" | "warning" | "accent";
};

export type PremiumHomepageRoutes = {
  locale: string;
  region: "US" | "CA";
  loc: (path: string) => string;
  hrefs: {
    signup: string;
    pricing: string;
    schools: string;
    lessons: string;
    flashcards: string;
    questionBank: string;
    practiceExams: string;
    dashboard: string;
    internationalRn: string;
  };
  pathwayCards: PremiumHomepagePathway[];
};

function safeLocale(locale?: string | null) {
  return locale || "en";
}

function safeRegion(region?: string | null): "US" | "CA" {
  return region === "US" ? "US" : "CA";
}

function safeLocalizedPath(locale: string, path: string): string {
  try {
    return withMarketingLocale(locale, path);
  } catch {
    return path;
  }
}

export function usePremiumHomepageRoutes(): PremiumHomepageRoutes {
  const { locale: rawLocale, t } = useMarketingI18n();
  const { region: rawRegion } = useNursenestRegion();
  const locale = safeLocale(rawLocale);
  const region = safeRegion(rawRegion);

  return useMemo(() => {
    const loc = (path: string) => safeLocalizedPath(locale, path);
    const tr = (key: string, fallback: string) => safeHomepageMarketingT(t, key, fallback);
    let hubs = {
      rn: marketingExamHubPath(region, "rn"),
      pn: marketingExamHubPath(region, "pn"),
      np: marketingExamHubPath(region, "np"),
      allied: marketingExamHubPath(region, "allied"),
    };

    try {
      hubs = { ...hubs, ...publicExamPrepHubDestinations(region) };
    } catch {
      // Keep marketingExamHubPath fallbacks.
    }

    const internationalRn = "/exams/australia";

    return {
      locale,
      region,
      loc,
      hrefs: {
        signup: loc(HUB.signup),
        pricing: loc(HUB.pricing),
        schools: loc("/for-institutions"),
        lessons: loc(HUB.examLessons),
        flashcards: loc(HUB.flashcards),
        questionBank: loc(HUB.questionBank),
        practiceExams: loc(HUB.practiceExams),
        dashboard: loc(HUB.login),
        internationalRn: loc(internationalRn),
      },
      pathwayCards: [
        {
          id: "rn",
          title: tr("pages.home.premium.pathways.rn.title", "RN"),
          subtitle: tr(
            "pages.home.premium.pathways.rn.subtitle",
            region === "US" ? "NCLEX-RN" : "Canadian NCLEX-RN",
          ),
          body: tr(
            "pages.home.premium.pathways.rn.body",
            "Clinical judgment lessons, NGN case practice, and CAT-style readiness for registered nurse candidates.",
          ),
          href: loc(hubs.rn),
          cta: tr("pages.home.premium.pathways.rn.cta", "Explore RN"),
          tone: "brand",
        },
        {
          id: "pn",
          title: tr("pages.home.premium.pathways.pn.title", "PN / RPN"),
          subtitle: tr(
            "pages.home.premium.pathways.pn.subtitle",
            region === "US" ? "NCLEX-PN" : "REx-PN",
          ),
          body: tr(
            "pages.home.premium.pathways.pn.body",
            "Focused practical nursing prep across fundamentals, safety, medication administration, and delegation.",
          ),
          href: loc(hubs.pn),
          cta: tr("pages.home.premium.pathways.pn.cta", "Explore PN"),
          tone: "info",
        },
        {
          id: "np",
          title: tr("pages.home.premium.pathways.np.title", "NP"),
          subtitle: tr(
            "pages.home.premium.pathways.np.subtitle",
            region === "US" ? "FNP and board review" : "CNPLE pathway",
          ),
          body: tr(
            "pages.home.premium.pathways.np.body",
            "Advanced assessment, diagnostics, pharmacology, and primary care reasoning for NP candidates.",
          ),
          href: loc(hubs.np),
          cta: tr("pages.home.premium.pathways.np.cta", "Explore NP"),
          tone: "success",
        },
        {
          id: "international-rn",
          title: tr("pages.home.premium.pathways.internationalRn.title", "International RN"),
          subtitle: tr("pages.home.premium.pathways.internationalRn.subtitle", "Global registration pathways"),
          body: tr(
            "pages.home.premium.pathways.internationalRn.body",
            "Bridge-style RN study support for internationally educated nurses using launched country exam hubs.",
          ),
          href: loc(internationalRn),
          cta: tr("pages.home.premium.pathways.internationalRn.cta", "Explore global RN"),
          tone: "warning",
        },
        {
          id: "allied",
          title: tr("pages.home.premium.pathways.allied.title", "Allied Health"),
          subtitle: tr("pages.home.premium.pathways.allied.subtitle", "Cross-discipline certification prep"),
          body: tr(
            "pages.home.premium.pathways.allied.body",
            "Occupation-aware study hubs for allied roles with practice modes scoped to each profession.",
          ),
          href: loc(hubs.allied),
          cta: tr("pages.home.premium.pathways.allied.cta", "Explore Allied"),
          tone: "accent",
        },
      ],
    };
  }, [locale, region, t]);
}
