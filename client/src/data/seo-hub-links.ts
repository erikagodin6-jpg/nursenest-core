export const SEO_HUB_TIER_CONFIG = {
  "rex-pn": {
    label: "REx-PN",
    hubPath: "/rex-pn",
    hubTitle: "REx-PN Exam Prep",
    questionBankPath: "/free-practice",
    questionBankTitle: "REx-PN Practice Questions",
    pricingPath: "/pricing",
  },
  "nclex-rn": {
    label: "NCLEX-RN",
    hubPath: "/nclex-rn",
    hubTitle: "NCLEX-RN Exam Prep",
    questionBankPath: "/free-practice",
    questionBankTitle: "NCLEX-RN Practice Questions",
    pricingPath: "/pricing",
  },
  "np-exam": {
    label: "NP Exam",
    hubPath: "/np-exam-prep",
    hubTitle: "NP Exam Prep",
    questionBankPath: "/free-practice",
    questionBankTitle: "NP Exam Practice Questions",
    pricingPath: "/pricing",
  },
} as const;

export type SeoHubTierKey = keyof typeof SEO_HUB_TIER_CONFIG;

export function getHubParentLink(tier: SeoHubTierKey) {
  const config = SEO_HUB_TIER_CONFIG[tier];
  return { title: config.hubTitle, href: config.hubPath };
}

export function getHubQuestionBankLink(tier: SeoHubTierKey) {
  const config = SEO_HUB_TIER_CONFIG[tier];
  return { title: config.questionBankTitle, href: config.questionBankPath };
}

export function buildInternalLinksForHub(tier: SeoHubTierKey, currentSlug: string) {
  const config = SEO_HUB_TIER_CONFIG[tier];
  return [
    { title: config.hubTitle, href: config.hubPath, rel: "parent" },
    { title: config.questionBankTitle, href: config.questionBankPath, rel: "related" },
    { title: "View Plans", href: config.pricingPath, rel: "conversion" },
  ].filter(link => link.href !== `/${currentSlug}`);
}
