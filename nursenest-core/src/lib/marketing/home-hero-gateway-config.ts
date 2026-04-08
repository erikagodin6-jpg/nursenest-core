import { marketingAssetUrl } from "@/lib/legacy-marketing-routes";
import { getExamPathwayHeroItems } from "@/lib/marketing/country-exam-offerings";
import {
  ALLIED,
  HUB,
  NP,
  RN,
  alliedCareersMarketingUrl,
  alliedHub,
  alliedQuestions,
  loginWithCallback,
  npNpQuestionsForRegion,
  npPracticeProgrammatic,
  pnLessons,
  pnPrimaryHub,
  pnPracticeProgrammatic,
  pnQuestions,
  rnLessons,
  rnQuestions,
  type MarketingRegionToggle,
} from "@/lib/marketing/marketing-entry-routes";

export type NursenestMarketingRegion = MarketingRegionToggle;

export type HeroGatewayLink = {
  id: string;
  labelKey: string;
  descriptionKey?: string;
  href: string;
  external?: boolean;
};

export type HeroGatewayCluster = {
  id: string;
  titleKey: string;
  introKey?: string;
  tier: "primary" | "secondary";
  primaryCta?: HeroGatewayLink;
  links: HeroGatewayLink[];
};

/**
 * “Choose your path” clusters: copy from i18n keys; hrefs from marketing-entry-routes.
 */
export function buildHeroGatewayClusters(region: NursenestMarketingRegion): HeroGatewayCluster[] {
  const isUs = region === "US";
  const alliedBrochure = alliedCareersMarketingUrl();

  return [
    {
      id: "nursing",
      titleKey: "home.gateway.nursing.title",
      introKey: isUs ? "home.gateway.nursing.introUS" : "home.gateway.nursing.introCA",
      tier: "primary",
      primaryCta: {
        id: "rn-start",
        labelKey: "home.gateway.nursing.ctaPrimary",
        descriptionKey: "home.gateway.nursing.ctaPrimaryDesc",
        href: rnQuestions(region),
      },
      links: [
        { id: "rn-seo", labelKey: "home.gateway.nursing.link.seoOverview", href: RN.practiceProgrammatic },
        { id: "rn-lessons", labelKey: "home.gateway.nursing.link.lessons", href: rnLessons(region) },
        { id: "rn-exams", labelKey: "home.gateway.nursing.link.timedMocks", href: HUB.practiceExams },
      ],
    },
    {
      id: "practical-nursing",
      titleKey: isUs ? "home.gateway.practical.titleUS" : "home.gateway.practical.titleCA",
      introKey: isUs ? "home.gateway.practical.introUS" : "home.gateway.practical.introCA",
      tier: "primary",
      primaryCta: {
        id: "pn-questions",
        labelKey: isUs ? "home.gateway.practical.ctaUS" : "home.gateway.practical.ctaCA",
        descriptionKey: "home.gateway.practical.ctaDesc",
        href: pnQuestions(region),
      },
      links: [
        { id: "pn-lessons", labelKey: "home.gateway.practical.link.lessons", href: pnLessons(region) },
        { id: "pn-hub", labelKey: "home.gateway.practical.link.hub", href: pnPrimaryHub(region) },
        {
          id: "pn-seo",
          labelKey: "home.gateway.practical.link.seoOverview",
          href: pnPracticeProgrammatic(region),
        },
      ],
    },
    {
      id: "np",
      titleKey: "home.gateway.np.title",
      introKey: isUs ? "home.gateway.np.introUS" : "home.gateway.np.introCA",
      tier: "primary",
      primaryCta: {
        id: "np-practice",
        labelKey: isUs ? "home.gateway.np.ctaUS" : "home.gateway.np.ctaCA",
        descriptionKey: isUs ? "home.gateway.np.ctaDescUS" : "home.gateway.np.ctaDescCA",
        href: npNpQuestionsForRegion(region),
      },
      links: isUs
        ? [
            {
              id: "np-seo",
              labelKey: "home.gateway.np.link.seoOverview",
              href: npPracticeProgrammatic(region),
            },
            { id: "fnp-l", labelKey: "home.gateway.np.link.fnpLessons", href: NP.fnpLessons },
            { id: "ag-l", labelKey: "home.gateway.np.link.agpcnpLessons", href: NP.agpcnpLessons },
          ]
        : [
            {
              id: "np-seo",
              labelKey: "home.gateway.np.link.seoOverviewCa",
              href: npPracticeProgrammatic(region),
            },
            { id: "ca-np", labelKey: "home.gateway.np.link.caHub", href: NP.caNpHub },
            { id: "fnp-l", labelKey: "home.gateway.np.link.fnpLessonsUs", href: NP.fnpLessons },
            { id: "ag-l", labelKey: "home.gateway.np.link.agpcnpLessonsUs", href: NP.agpcnpLessons },
          ],
    },
    {
      id: "allied",
      titleKey: "home.gateway.allied.title",
      introKey: "home.gateway.allied.intro",
      tier: "secondary",
      primaryCta: {
        id: "allied-questions",
        labelKey: "home.gateway.allied.ctaPrimary",
        descriptionKey: "home.gateway.allied.ctaDesc",
        href: alliedQuestions(region),
      },
      links: [
        { id: "allied-in", labelKey: "home.gateway.allied.link.hub", href: alliedHub(region) },
        {
          id: "allied-brochure",
          labelKey: "home.gateway.allied.link.brochure",
          href: alliedBrochure,
          external: true,
        },
      ],
    },
    {
      id: "tools-newgrad",
      titleKey: "home.gateway.tools.title",
      introKey: "home.gateway.tools.intro",
      tier: "secondary",
      primaryCta: {
        id: "tools",
        labelKey: "home.gateway.tools.ctaPrimary",
        href: HUB.tools,
      },
      links: [
        { id: "exam-lessons", labelKey: "home.gateway.tools.link.examLessons", href: HUB.examLessons },
        {
          id: "roadmap",
          labelKey: "home.gateway.tools.link.roadmap",
          href: "/new-graduate-nursing-roadmap",
        },
        {
          id: "new-grad-support",
          labelKey: "home.gateway.tools.link.newGradSupport",
          href: marketingAssetUrl("/new-graduate-support"),
          external: true,
        },
        {
          id: "flashcards",
          labelKey: "home.gateway.tools.link.flashcards",
          href: "/flashcards",
        },
        {
          id: "exams-login",
          labelKey: "home.gateway.tools.link.practiceExams",
          href: HUB.practiceExams,
        },
      ],
    },
  ];
}

export type HeroQuickEntryItem = { labelKey: string; href: string };

export function heroQuickEntryLinks(region: NursenestMarketingRegion): HeroQuickEntryItem[] {
  const pathway = getExamPathwayHeroItems(region).map(({ labelKey, href }) => ({ labelKey, href }));
  return [...pathway, { labelKey: "home.quickEntry.studyTools", href: HUB.tools }];
}

/** Hero pathway row only: RN / PN / NP / Allied — same order as header strip (`getExamPathwayHeroItems`). */
export function heroPathwayEntryLinks(region: NursenestMarketingRegion): HeroQuickEntryItem[] {
  return getExamPathwayHeroItems(region).map(({ labelKey, href }) => ({ labelKey, href }));
}
