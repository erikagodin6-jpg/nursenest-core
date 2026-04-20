import type { CountryCode, CountryHomepageContent, CountryNavConfig } from "@/lib/marketing/countries/types";

/** Explicit country marketing hubs (URL segment after optional locale strip). */
export const MARKETING_COUNTRY_HUB_SEGMENTS: readonly CountryCode[] = [
  "canada",
  "us",
  "philippines",
  "middle-east",
] as const;

const FALLBACK_COUNTRY_NAV_BASE: CountryCode = "canada";

export const CANADA_NAV: CountryNavConfig = {
  country: "canada",
  regionLabel: "Canada",
  heroExamLabel: "Canadian nursing exam prep",
  primary: [
    {
      label: "REx-PN",
      href: "/canada/pn/rex-pn",
      kind: "primary",
      children: [
        { label: "Practice Questions", href: "/canada/pn/rex-pn/questions" },
        { label: "Lessons", href: "/canada/pn/rex-pn/lessons" },
        { label: "Flashcards", href: "/canada/pn/rex-pn/flashcards" },
        { label: "CAT Exams", href: "/canada/pn/rex-pn/cat" },
      ],
    },
    { label: "NCLEX-RN", href: "/canada/rn/nclex-rn", kind: "primary" },
    { label: "PN", href: "/canada/pn", kind: "primary" },
    { label: "RN", href: "/canada/rn", kind: "primary" },
    { label: "Lessons", href: "/lessons", kind: "secondary" },
    { label: "Pricing", href: "/pricing", kind: "cta" },
  ],
  secondary: [
    { label: "For International Nurses", href: "/exams/canada" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ],
  footerFeatured: [
    { label: "REx-PN prep", href: "/canada/pn/rex-pn" },
    { label: "Canadian NCLEX-RN", href: "/canada/rn/nclex-rn" },
    { label: "Nursing in Canada", href: "/canada" },
  ],
};

export const US_NAV: CountryNavConfig = {
  country: "us",
  regionLabel: "United States",
  heroExamLabel: "US nursing exam prep",
  primary: [
    { label: "NCLEX-RN", href: "/us/rn/nclex-rn", kind: "primary" },
    { label: "NCLEX-PN", href: "/us/pn/nclex-pn", kind: "primary" },
    { label: "RN", href: "/us/rn", kind: "primary" },
    { label: "PN", href: "/us/pn", kind: "primary" },
    { label: "Lessons", href: "/lessons", kind: "secondary" },
    { label: "Pricing", href: "/pricing", kind: "cta" },
  ],
  secondary: [
    { label: "Canada pathways", href: "/canada" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ],
  footerFeatured: [
    { label: "NCLEX-RN", href: "/us/rn/nclex-rn" },
    { label: "NCLEX-PN", href: "/us/pn/nclex-pn" },
    { label: "US exam hub", href: "/us" },
  ],
};

export const PHILIPPINES_NAV: CountryNavConfig = {
  country: "philippines",
  regionLabel: "Philippines",
  heroExamLabel: "Philippines and global pathways",
  primary: [
    { label: "NLE", href: "/exams/philippines", kind: "primary" },
    { label: "Work in Canada", href: "/canada", kind: "primary" },
    { label: "Work in US", href: "/us", kind: "primary" },
    { label: "Lessons", href: "/lessons", kind: "secondary" },
    { label: "Pricing", href: "/pricing", kind: "cta" },
  ],
  secondary: [
    { label: "REx-PN (Canada)", href: "/canada/pn/rex-pn" },
    { label: "NCLEX-RN (Canada)", href: "/canada/rn/nclex-rn" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ],
  footerFeatured: [
    { label: "NLE guide", href: "/exams/philippines" },
    { label: "Canada hub", href: "/canada" },
    { label: "US hub", href: "/us" },
  ],
};

export const MIDDLE_EAST_NAV: CountryNavConfig = {
  country: "middle-east",
  regionLabel: "Middle East",
  heroExamLabel: "Gulf nursing licensing prep",
  primary: [
    { label: "Saudi Prometric", href: "/middle-east/prometric-nursing-exam", kind: "primary" },
    { label: "DHA", href: "/middle-east/dha-exam", kind: "primary" },
    { label: "HAAD", href: "/middle-east/haad-exam", kind: "primary" },
    { label: "Regional hub", href: "/exams/middle-east", kind: "secondary" },
    { label: "Lessons", href: "/lessons", kind: "secondary" },
    { label: "Pricing", href: "/pricing", kind: "cta" },
  ],
  secondary: [
    { label: "Move to Canada", href: "/canada" },
    { label: "Move to US", href: "/us" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ],
  footerFeatured: [
    { label: "Saudi Prometric", href: "/middle-east/prometric-nursing-exam" },
    { label: "DHA", href: "/middle-east/dha-exam" },
    { label: "Middle East exams", href: "/exams/middle-east" },
  ],
};

export const NAV_BY_COUNTRY: Record<CountryCode, CountryNavConfig> = {
  canada: CANADA_NAV,
  us: US_NAV,
  philippines: PHILIPPINES_NAV,
  "middle-east": MIDDLE_EAST_NAV,
  china: { ...CANADA_NAV, country: "china", regionLabel: "China (global entry)" },
  japan: { ...CANADA_NAV, country: "japan", regionLabel: "Japan (global entry)" },
  portugal: { ...CANADA_NAV, country: "portugal", regionLabel: "Portugal (global entry)" },
};

export const CANADA_HOMEPAGE: CountryHomepageContent = {
  headline: "Canada-first nursing exam prep",
  subheadline:
    "Prepare for REx-PN, NCLEX-RN, and nursing pathways in Canada with lessons, flashcards, practice questions, and CAT exams.",
  brandLine: "Country-specific nursing exam prep, with exclusive REx-PN support in Canada.",
  primaryCta: { label: "Start REx-PN prep", href: "/canada/pn/rex-pn" },
  secondaryCta: { label: "Explore Canada pathways", href: "/canada/rn" },
  pathwayCards: [
    { title: "REx-PN", href: "/canada/pn/rex-pn", description: "Practical nurse entry exam for Canada." },
    { title: "NCLEX-RN", href: "/canada/rn/nclex-rn", description: "Registered nurse licensing aligned to Canadian regulators." },
    { title: "PN in Canada", href: "/canada/pn", description: "PN tracks, lessons, and practice built for Canadian scope." },
    { title: "RN in Canada", href: "/canada/rn", description: "RN hubs, lessons, and question banks for Canadian pathways." },
  ],
  proofStrip: ["Built for Canada", "REx-PN support", "Global learners welcome"],
  crossBorderCta: {
    title: "Internationally educated and heading to Canada?",
    href: "/exams/canada",
    label: "Read the Canada exam and registration overview",
  },
};

export const US_HOMEPAGE: CountryHomepageContent = {
  headline: "US nursing exam prep built around NCLEX",
  subheadline: "Study for NCLEX-RN and NCLEX-PN with structured lessons, flashcards, question banks, and CAT exams.",
  brandLine: "Country-specific nursing exam prep, with exclusive REx-PN support in Canada.",
  primaryCta: { label: "Start NCLEX-RN", href: "/us/rn/nclex-rn" },
  secondaryCta: { label: "Explore US pathways", href: "/us/rn" },
  pathwayCards: [
    { title: "NCLEX-RN", href: "/us/rn/nclex-rn", description: "Clinical judgment, lessons, and timed practice for RN candidates." },
    { title: "NCLEX-PN", href: "/us/pn/nclex-pn", description: "PN-focused prep with questions, flashcards, and CAT-style exams." },
    { title: "RN", href: "/us/rn", description: "RN hub: browse lessons, banks, and tools for US RN tracks." },
    { title: "PN", href: "/us/pn", description: "PN hub: structured study paths for US practical nursing exams." },
  ],
  proofStrip: ["Built for NCLEX depth", "Lessons + question banks", "CAT-style readiness checks"],
  crossBorderCta: {
    title: "Also targeting Canadian registration?",
    href: "/canada",
    label: "Explore Canada-first pathways",
  },
};

export const PHILIPPINES_HOMEPAGE: CountryHomepageContent = {
  headline: "Nursing exam prep for the Philippines and beyond",
  subheadline: "Study for the NLE and explore pathways for working in Canada or the United States.",
  brandLine: "Country-specific nursing exam prep, with exclusive REx-PN support in Canada.",
  primaryCta: { label: "Start NLE prep", href: "/exams/philippines" },
  secondaryCta: { label: "Explore Canada pathways", href: "/canada" },
  pathwayCards: [
    { title: "NLE", href: "/exams/philippines", description: "Philippines licensure context plus transferable study skills." },
    { title: "Work in Canada", href: "/canada", description: "Canada-first hubs for REx-PN, NCLEX-RN, and PN/RN tracks." },
    { title: "Work in US", href: "/us", description: "NCLEX-focused RN and PN prep when the United States is your goal." },
    { title: "Nursing lessons", href: "/lessons", description: "Structured lessons across pathways NurseNest supports publicly." },
  ],
  proofStrip: ["NLE context", "Migration-aware study", "Lessons + banks + CAT tools"],
  crossBorderCta: {
    title: "Planning Canada or the US after the NLE?",
    href: "/exams/philippines",
    label: "Open the Philippines NLE and migration guide",
  },
};

export const MIDDLE_EAST_HOMEPAGE: CountryHomepageContent = {
  headline: "Nursing licensing prep for the Middle East",
  subheadline: "Prepare for Saudi Prometric, DHA, and HAAD exams with structured study tools and lessons.",
  brandLine: "Country-specific nursing exam prep, with exclusive REx-PN support in Canada.",
  primaryCta: { label: "Start your exam", href: "/middle-east/prometric-nursing-exam" },
  secondaryCta: { label: "Compare pathways", href: "/exams/middle-east" },
  pathwayCards: [
    { title: "Saudi Prometric", href: "/middle-east/prometric-nursing-exam", description: "Nursing licensing exam prep context for Saudi pathways." },
    { title: "DHA", href: "/middle-east/dha-exam", description: "Dubai Health Authority exam orientation and study scaffolding." },
    { title: "HAAD", href: "/middle-east/haad-exam", description: "Abu Dhabi licensing exam overview and lesson-aligned study." },
    { title: "International pathways", href: "/exams/middle-east", description: "Regional hub for Gulf exams, English tests, and mobility planning." },
  ],
  proofStrip: ["Regional licensing focus", "Structured lessons", "Question banks + CAT exams"],
  crossBorderCta: {
    title: "Relocating to North America later?",
    href: "/canada",
    label: "Browse Canada-first exam prep",
  },
};

/** Canada-first global root: same structure as country pages, tuned for `/`. */
export const GLOBAL_ROOT_HOMEPAGE: CountryHomepageContent = {
  headline: "Canada-first nursing exam prep, built for nurses worldwide",
  subheadline:
    "NurseNest is a global study platform with Canada-first depth: REx-PN, NCLEX-RN, PN/RN pathways, lessons, flashcards, question banks, and CAT exams.",
  brandLine: "Country-specific nursing exam prep, with exclusive REx-PN support in Canada.",
  primaryCta: { label: "Start with Canada hubs", href: "/canada" },
  secondaryCta: { label: "Explore US NCLEX hubs", href: "/us" },
  pathwayCards: [
    { title: "Canada hub", href: "/canada", description: "REx-PN, NCLEX-RN, PN, and RN marketing pathways." },
    { title: "United States hub", href: "/us", description: "NCLEX-RN and NCLEX-PN structured prep." },
    { title: "Philippines hub", href: "/philippines", description: "NLE plus Canada and US mobility context." },
    { title: "Middle East hub", href: "/middle-east", description: "Prometric, DHA, HAAD, and regional exam guides." },
  ],
  proofStrip: ["Canada-first depth", "Global learners welcome", "Lessons, banks, and CAT exams"],
  crossBorderCta: {
    title: "Choose your country hub",
    href: "/canada",
    label: "Open Canada (REx-PN + NCLEX-RN)",
  },
};

export const HOMEPAGE_CONTENT_BY_COUNTRY: Record<CountryCode, CountryHomepageContent> = {
  canada: CANADA_HOMEPAGE,
  us: US_HOMEPAGE,
  philippines: PHILIPPINES_HOMEPAGE,
  "middle-east": MIDDLE_EAST_HOMEPAGE,
  china: CANADA_HOMEPAGE,
  japan: CANADA_HOMEPAGE,
  portugal: CANADA_HOMEPAGE,
};

export function getCountryNavConfig(country: CountryCode): CountryNavConfig {
  return NAV_BY_COUNTRY[country] ?? NAV_BY_COUNTRY[FALLBACK_COUNTRY_NAV_BASE];
}

export function getCountryHomepageContent(country: CountryCode): CountryHomepageContent {
  return HOMEPAGE_CONTENT_BY_COUNTRY[country] ?? HOMEPAGE_CONTENT_BY_COUNTRY[FALLBACK_COUNTRY_NAV_BASE];
}

export function isMarketingCountryHubSegment(segment: string): segment is CountryCode {
  return (MARKETING_COUNTRY_HUB_SEGMENTS as readonly string[]).includes(segment);
}
