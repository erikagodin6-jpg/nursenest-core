import { marketingAssetUrl } from "@/lib/legacy-marketing-routes";
import {
  ALLIED,
  HUB,
  NP,
  PN,
  RN,
  alliedCareersMarketingUrl,
  alliedHub,
  alliedQuestions,
  loginWithCallback,
  npNpQuestionsForRegion,
  pnLessons,
  pnPrimaryHub,
  rnLessons,
  rnQuestions,
  type MarketingRegionToggle,
} from "@/lib/marketing/marketing-entry-routes";

export type NursenestMarketingRegion = MarketingRegionToggle;

export type HeroGatewayLink = {
  id: string;
  label: string;
  description?: string;
  href: string;
  external?: boolean;
};

export type HeroGatewayCluster = {
  id: string;
  title: string;
  tier: "primary" | "secondary";
  intro?: string;
  primaryCta?: HeroGatewayLink;
  links: HeroGatewayLink[];
};

/**
 * “Choose your path” clusters: one dominant CTA per group, short secondaries, paths from marketing-entry-routes.
 */
export function buildHeroGatewayClusters(region: NursenestMarketingRegion): HeroGatewayCluster[] {
  const isUs = region === "US";
  const alliedBrochure = alliedCareersMarketingUrl();

  return [
    {
      id: "nursing",
      title: isUs ? "Registered Nurse (NCLEX-RN)" : "Registered Nurse (NCLEX-RN, Canada)",
      tier: "primary",
      intro: "Clinical judgment items, lesson hubs, and timed mocks in one pathway. Start with questions or open lessons.",
      primaryCta: {
        id: "rn-start",
        label: "Start RN practice questions",
        description: "Pathway-scoped bank",
        href: rnQuestions(region),
      },
      links: [
        { id: "rn-seo", label: "NCLEX-RN prep overview", href: RN.practiceProgrammatic },
        { id: "rn-lessons", label: "RN lessons", href: rnLessons(region) },
        { id: "rn-exams", label: "Timed practice exams", href: RN.appExams },
      ],
    },
    {
      id: "practical-nursing",
      title: isUs ? "Practical nurse (NCLEX-PN)" : "Practical nurse (REx-PN)",
      tier: "primary",
      intro: isUs
        ? "LVN/LPN: safety-first stems and topic-tagged lessons."
        : "Canadian PN: REx-PN scope, lessons, and bank.",
      primaryCta: {
        id: "pn-lessons",
        label: "Explore LPN / PN lessons",
        description: "Lesson hubs by topic",
        href: pnLessons(region),
      },
      links: [
        { id: "pn-hub", label: "PN exam hub", href: pnPrimaryHub(region) },
        { id: "pn-seo", label: "PN prep overview", href: PN.practiceProgrammatic },
      ],
    },
    {
      id: "np",
      title: "Nurse practitioner (FNP & AGPCNP)",
      tier: "primary",
      intro: isUs
        ? "FNP and AGPCNP stay in separate hubs. Open the one that matches your exam."
        : "CNPLE hub for Canada; US FNP and AGPCNP lessons stay available if you sit US boards.",
      primaryCta: {
        id: "np-practice",
        label: "Try NP clinical cases",
        description: isUs ? "FNP question bank" : "CNPLE bank",
        href: npNpQuestionsForRegion(region),
      },
      links: isUs
        ? [
            { id: "np-seo", label: "NP certification overview", href: NP.practiceProgrammatic },
            { id: "fnp-l", label: "FNP lessons", href: NP.fnpLessons },
            { id: "ag-l", label: "AGPCNP lessons", href: NP.agpcnpLessons },
          ]
        : [
            { id: "np-seo", label: "NP certification overview", href: NP.practiceProgrammatic },
            { id: "ca-np", label: "Canadian NP hub", href: NP.caNpHub },
            { id: "fnp-l", label: "FNP lessons (US)", href: NP.fnpLessons },
            { id: "ag-l", label: "AGPCNP lessons (US)", href: NP.agpcnpLessons },
          ],
    },
    {
      id: "allied",
      title: "Allied health",
      tier: "secondary",
      intro: "In-app bank plus the allied careers overview. Country follows your toggle.",
      primaryCta: {
        id: "allied-browse",
        label: "Browse allied careers",
        href: alliedBrochure,
        external: true,
      },
      links: [
        { id: "allied-in", label: "Allied exam hub", href: alliedHub(region) },
        { id: "allied-q", label: "Allied question bank", href: alliedQuestions(region) },
      ],
    },
    {
      id: "tools-newgrad",
      title: "Tools & new grad",
      tier: "secondary",
      intro: "Calculators, lesson index, and first-year roadmaps. Career support opens in a new tab.",
      primaryCta: {
        id: "tools",
        label: "Use study tools",
        href: HUB.tools,
      },
      links: [
        { id: "exam-lessons", label: "Exam lesson hubs", href: HUB.examLessons },
        { id: "roadmap", label: "New graduate roadmap", href: "/new-graduate-nursing-roadmap" },
        {
          id: "new-grad-support",
          label: "New graduate support",
          href: marketingAssetUrl("/new-graduate-support"),
          external: true,
        },
        { id: "flashcards", label: "Flashcards (sign in)", href: loginWithCallback("/app/flashcards") },
        { id: "exams-login", label: "Practice exams (sign in)", href: loginWithCallback("/app/exams") },
      ],
    },
  ];
}

export function heroQuickEntryLinks(region: NursenestMarketingRegion): { label: string; href: string }[] {
  return [
    { label: "Start RN practice questions", href: rnQuestions(region) },
    { label: "Explore LPN / PN lessons", href: pnLessons(region) },
    { label: "Try NP clinical cases", href: npNpQuestionsForRegion(region) },
    { label: "Browse allied careers", href: alliedCareersMarketingUrl() },
    { label: "Use study tools", href: HUB.tools },
  ];
}
