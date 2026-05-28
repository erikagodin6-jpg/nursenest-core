"use client";

import { useMemo } from "react";

import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { marketingExamHubPath } from "@/lib/marketing/marketing-exam-navigation";
import { publicExamPrepHubDestinations } from "@/lib/navigation/canonical-destinations";
import { HUB } from "@/lib/navigation/canonical-destinations";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";

export type PremiumHomepagePathway = {
  id: "rn" | "pn" | "np" | "allied" | "pre-nursing";
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
    preNursing: string;
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
        preNursing: loc("/pre-nursing"),
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
            "Adaptive lessons, prioritization and delegation scenarios, weak-area targeting, and readiness loops for registered nurse candidates.",
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
            "Focused practical nursing prep across fundamentals, bedside safety, medication administration, and delegation.",
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
            region === "US" ? "FNP, AGPCNP, PMHNP, WHNP, and PNP-PC" : "CNPLE plus NP specialty discovery",
          ),
          body: tr(
            "pages.home.premium.pathways.np.body",
            "Specialty-first nurse practitioner prep with pathway hubs for primary care, psych, women's health, pediatrics, and Canada-specific CNPLE discovery.",
          ),
          href: loc(hubs.np),
          cta: tr("pages.home.premium.pathways.np.cta", "Explore NP"),
          tone: "success",
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
        {
          id: "pre-nursing",
          title: tr("pages.home.premium.pathways.preNursing.title", "Pre-Nursing"),
          subtitle: tr("pages.home.premium.pathways.preNursing.subtitle", "Public foundations and study planning"),
          body: tr(
            "pages.home.premium.pathways.preNursing.body",
            "Start with open foundations, prerequisite science support, and study planning before role-specific licensure prep.",
          ),
          href: loc("/pre-nursing"),
          cta: tr("pages.home.premium.pathways.preNursing.cta", "Explore Pre-Nursing"),
          tone: "warning",
        },
      ],
    };
  }, [locale, region, t]);
}
