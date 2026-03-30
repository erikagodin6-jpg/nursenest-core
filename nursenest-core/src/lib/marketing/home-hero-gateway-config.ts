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
  pnQuestions,
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
      title: isUs ? "NCLEX-RN (US)" : "NCLEX-RN (Canada)",
      tier: "primary",
      intro: isUs
        ? "Clinical judgment practice for US RN candidates: NGN-style stems, rationales per option, and full-length mocks when you are ready."
        : "Canadian RN registration: same high-stakes reasoning skills, scoped to your NCLEX-RN track and Canadian lesson hubs.",
      primaryCta: {
        id: "rn-start",
        label: "Run NCLEX-RN questions",
        description: "Starts in your selected region",
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
      title: isUs ? "NCLEX-PN (LVN/LPN)" : "REx-PN (Canada PN)",
      tier: "primary",
      intro: isUs
        ? "PN-level safety and pharmacology stems with lesson support—not RN material squeezed into an LPN label."
        : "REx-PN is its own exam. Use the Canadian PN bank and lessons built for REx-PN, not a relabeled US mix.",
      primaryCta: {
        id: "pn-questions",
        label: isUs ? "Run NCLEX-PN questions" : "Run REx-PN questions",
        description: "Pathway-filtered bank",
        href: pnQuestions(region),
      },
      links: [
        { id: "pn-lessons", label: "PN lessons", href: pnLessons(region) },
        { id: "pn-hub", label: "PN exam hub", href: pnPrimaryHub(region) },
        { id: "pn-seo", label: "PN prep overview", href: PN.practiceProgrammatic },
      ],
    },
    {
      id: "np",
      title: "Nurse practitioner",
      tier: "primary",
      intro: isUs
        ? "FNP and AGPCNP each have dedicated lessons and banks. Pick the board you are sitting—do not cross-train on the wrong blueprint."
        : "Canadian NP: start from the CNPLE hub. US FNP/AGPCNP stays available if you sit US certification exams.",
      primaryCta: {
        id: "np-practice",
        label: isUs ? "Open FNP question bank" : "Open CNPLE questions",
        description: isUs ? "US NP clinical cases" : "Canadian NP track",
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
      title: "Allied health exams",
      tier: "secondary",
      intro: "Separate from nursing tiers: pick your exam family, then drill in the allied hub and pathway bank for your country.",
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
      intro: "Dose calculators, lesson index, timed exams (sign in), and first-year roadmaps when you need a break from board mode.",
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
  const isUs = region === "US";
  return [
    { label: isUs ? "NCLEX-RN questions" : "Canada RN questions", href: rnQuestions(region) },
    { label: isUs ? "NCLEX-PN questions" : "REx-PN questions", href: pnQuestions(region) },
    { label: isUs ? "FNP question bank" : "CNPLE questions", href: npNpQuestionsForRegion(region) },
    { label: "Allied question bank", href: alliedQuestions(region) },
    { label: "Study tools", href: HUB.tools },
  ];
}
