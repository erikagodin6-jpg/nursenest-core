/**
 * Per-region blog market strategy config.
 *
 * Structured data (not buried prompts) that drives AI adaptation tone,
 * CTA framing, SEO emphasis, and audience targeting for each market.
 *
 * Priority order: underserved global markets first.
 */

import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { GlobalLocaleCode } from "@/lib/i18n/global-regions";

// ── Types ────────────────────────────────────────────────────────────────────

export type CompetitiveLevel = "uncontested" | "low" | "moderate" | "high" | "saturated";

export type BlogMarketStrategy = {
  region: GlobalRegionSlug;
  displayName: string;
  defaultLanguage: GlobalLocaleCode;
  allowedLocales: readonly GlobalLocaleCode[];
  priority: number;

  audienceFraming: string;
  nursingTerminologyStyle: string;
  toneRecommendation: string;
  examRelevance: string[];
  priceSensitivity: "very_high" | "high" | "moderate" | "low";
  ctaAngle: string;
  seoEmphasis: string[];
  competitiveLevel: CompetitiveLevel;

  /** Whether bilingual content (e.g. English + local language mixed) converts better. */
  bilingualContentPreferred: boolean;
  /** Key pain points that resonate with this market's nursing audience. */
  audiencePainPoints: string[];
  /** Whether audience is primarily domestic students or internationally educated nurses. */
  primaryAudienceType: "domestic" | "international" | "mixed";
};

// ── Strategy definitions ─────────────────────────────────────────────────────

export const BLOG_MARKET_STRATEGIES: Record<GlobalRegionSlug, BlogMarketStrategy> = {
  philippines: {
    region: "philippines",
    displayName: "Philippines",
    defaultLanguage: "en",
    allowedLocales: ["en", "tl"],
    priority: 1,
    audienceFraming: "Filipino nurses preparing for international licensure exams and overseas employment pathways",
    nursingTerminologyStyle: "US NCLEX terminology with Filipino nursing education context",
    toneRecommendation: "Aspirational but practical. Acknowledge the hard work of studying while employed. Emphasize that passing is achievable with structured prep.",
    examRelevance: ["NCLEX-RN", "NCLEX-PN"],
    priceSensitivity: "very_high",
    ctaAngle: "Affordable exam prep that works around your schedule. Study smarter, pass faster, start your international nursing career.",
    seoEmphasis: ["NCLEX from Philippines", "nursing board exam Philippines", "international nursing prep", "NCLEX review center alternative"],
    competitiveLevel: "low",
    bilingualContentPreferred: true,
    audiencePainPoints: ["expensive review centers", "limited study time while working", "fear of failing NCLEX", "navigating international licensure"],
    primaryAudienceType: "international",
  },
  india: {
    region: "india",
    displayName: "India",
    defaultLanguage: "en",
    allowedLocales: ["en", "hi"],
    priority: 2,
    audienceFraming: "Indian nurses preparing for international licensure and competitive nursing exams",
    nursingTerminologyStyle: "US NCLEX terminology contextualized for Indian nursing graduates",
    toneRecommendation: "Value-focused and structured. Emphasize efficiency and clear study plans.",
    examRelevance: ["NCLEX-RN", "NCLEX-PN"],
    priceSensitivity: "very_high",
    ctaAngle: "Structured, affordable exam prep. Get a clear study plan and track your readiness without expensive coaching.",
    seoEmphasis: ["NCLEX preparation India", "nursing exam prep India", "study plan for Indian nurses", "NCLEX coaching alternative"],
    competitiveLevel: "low",
    bilingualContentPreferred: true,
    audiencePainPoints: ["high coaching fees", "lack of structured study plans", "uncertainty about exam readiness", "time management while preparing"],
    primaryAudienceType: "international",
  },
  nigeria: {
    region: "nigeria",
    displayName: "Nigeria",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 3,
    audienceFraming: "Nigerian nurses seeking international licensure through NCLEX and other pathways",
    nursingTerminologyStyle: "Standard US NCLEX terminology with awareness of Nigerian nursing education context",
    toneRecommendation: "Trustworthy and encouraging. Emphasize guided, structured preparation.",
    examRelevance: ["NCLEX-RN"],
    priceSensitivity: "very_high",
    ctaAngle: "Trusted, guided exam prep. Know exactly what to study and when you are ready.",
    seoEmphasis: ["NCLEX for Nigerian nurses", "nursing exam prep Nigeria", "international nursing licensure Nigeria"],
    competitiveLevel: "uncontested",
    bilingualContentPreferred: false,
    audiencePainPoints: ["limited access to quality prep materials", "uncertainty about international licensing process", "financial constraints"],
    primaryAudienceType: "international",
  },
  kenya: {
    region: "kenya",
    displayName: "Kenya",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 4,
    audienceFraming: "Kenyan nurses preparing for international licensing exams and career advancement",
    nursingTerminologyStyle: "Standard NCLEX terminology with East African nursing context",
    toneRecommendation: "Clear, supportive, and practical. Focus on accessibility and structured guidance.",
    examRelevance: ["NCLEX-RN"],
    priceSensitivity: "very_high",
    ctaAngle: "Affordable, structured prep that guides you step by step.",
    seoEmphasis: ["NCLEX prep Kenya", "nursing exam Kenya", "international nursing career Kenya"],
    competitiveLevel: "uncontested",
    bilingualContentPreferred: false,
    audiencePainPoints: ["limited local prep resources", "high cost of international prep", "navigating licensure process"],
    primaryAudienceType: "international",
  },
  pakistan: {
    region: "pakistan",
    displayName: "Pakistan",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 5,
    audienceFraming: "Pakistani nurses and nursing graduates preparing for international licensure",
    nursingTerminologyStyle: "Standard NCLEX terminology",
    toneRecommendation: "Professional, structured, and respectful. Emphasize value and clear outcomes.",
    examRelevance: ["NCLEX-RN"],
    priceSensitivity: "very_high",
    ctaAngle: "Budget-friendly, structured exam prep with clear progress tracking.",
    seoEmphasis: ["NCLEX preparation Pakistan", "nursing exam prep Pakistan"],
    competitiveLevel: "uncontested",
    bilingualContentPreferred: false,
    audiencePainPoints: ["lack of local NCLEX prep", "cost barriers", "uncertain study approach"],
    primaryAudienceType: "international",
  },
  bangladesh: {
    region: "bangladesh",
    displayName: "Bangladesh",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 6,
    audienceFraming: "Bangladeshi nurses pursuing international nursing careers through licensure exams",
    nursingTerminologyStyle: "Standard NCLEX terminology",
    toneRecommendation: "Supportive and practical. Acknowledge the determination required.",
    examRelevance: ["NCLEX-RN"],
    priceSensitivity: "very_high",
    ctaAngle: "Affordable prep that works. Study at your own pace and know when you are ready.",
    seoEmphasis: ["NCLEX prep Bangladesh", "international nursing Bangladesh"],
    competitiveLevel: "uncontested",
    bilingualContentPreferred: false,
    audiencePainPoints: ["very limited local prep options", "cost sensitivity", "information gaps about licensing process"],
    primaryAudienceType: "international",
  },
  "south-africa": {
    region: "south-africa",
    displayName: "South Africa",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 7,
    audienceFraming: "South African nurses preparing for local and international nursing exams",
    nursingTerminologyStyle: "International nursing terminology with South African regulatory awareness",
    toneRecommendation: "Professional and empowering. Acknowledge diverse nursing pathways.",
    examRelevance: ["NCLEX-RN", "SANC"],
    priceSensitivity: "high",
    ctaAngle: "Structured exam prep at a fair price. Track your progress and study what matters.",
    seoEmphasis: ["nursing exam prep South Africa", "NCLEX from South Africa", "SANC exam prep"],
    competitiveLevel: "low",
    bilingualContentPreferred: false,
    audiencePainPoints: ["gap between local training and international exam expectations", "limited structured prep"],
    primaryAudienceType: "mixed",
  },
  uae: {
    region: "uae",
    displayName: "United Arab Emirates",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 8,
    audienceFraming: "Internationally educated nurses working in the UAE and preparing for licensure exams",
    nursingTerminologyStyle: "International terminology with Gulf healthcare context",
    toneRecommendation: "Professional and focused. Recognize busy schedules of working nurses.",
    examRelevance: ["NCLEX-RN", "DHA", "HAAD", "MOH"],
    priceSensitivity: "moderate",
    ctaAngle: "Study efficiently around your hospital schedule. Structured prep for busy healthcare professionals.",
    seoEmphasis: ["nursing exam UAE", "NCLEX prep Dubai", "DHA exam nursing", "HAAD nursing exam"],
    competitiveLevel: "moderate",
    bilingualContentPreferred: false,
    audiencePainPoints: ["studying while working long shifts", "navigating multiple licensing bodies", "exam scheduling pressure"],
    primaryAudienceType: "international",
  },
  "saudi-arabia": {
    region: "saudi-arabia",
    displayName: "Saudi Arabia",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 9,
    audienceFraming: "Nurses in Saudi Arabia preparing for local licensing and international credentials",
    nursingTerminologyStyle: "International terminology with Gulf healthcare context",
    toneRecommendation: "Respectful, professional, and structured.",
    examRelevance: ["NCLEX-RN", "SCFHS"],
    priceSensitivity: "moderate",
    ctaAngle: "Professional exam prep that respects your time. Clear plans, tracked progress.",
    seoEmphasis: ["nursing exam Saudi Arabia", "SCFHS exam prep", "NCLEX prep Saudi"],
    competitiveLevel: "moderate",
    bilingualContentPreferred: false,
    audiencePainPoints: ["limited structured prep options", "balancing work and study", "credential recognition"],
    primaryAudienceType: "international",
  },
  singapore: {
    region: "singapore",
    displayName: "Singapore",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 10,
    audienceFraming: "Nurses in Singapore preparing for career advancement and international credentials",
    nursingTerminologyStyle: "International nursing terminology with Singapore healthcare system awareness",
    toneRecommendation: "Professional, efficient, results-oriented.",
    examRelevance: ["NCLEX-RN", "SNB"],
    priceSensitivity: "moderate",
    ctaAngle: "Efficient, structured exam prep. Study what matters and track your readiness.",
    seoEmphasis: ["nursing exam Singapore", "NCLEX prep Singapore", "SNB exam"],
    competitiveLevel: "moderate",
    bilingualContentPreferred: false,
    audiencePainPoints: ["competitive healthcare environment", "time constraints", "credential portability"],
    primaryAudienceType: "mixed",
  },
  jamaica: {
    region: "jamaica",
    displayName: "Jamaica",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 11,
    audienceFraming: "Jamaican nurses preparing for international licensure and Caribbean nursing exams",
    nursingTerminologyStyle: "Standard NCLEX terminology with Caribbean nursing context",
    toneRecommendation: "Warm, encouraging, and practical.",
    examRelevance: ["NCLEX-RN", "CRNBC"],
    priceSensitivity: "high",
    ctaAngle: "Structured prep that fits your budget. Study with confidence.",
    seoEmphasis: ["NCLEX prep Jamaica", "nursing exam Caribbean", "international nursing Jamaica"],
    competitiveLevel: "uncontested",
    bilingualContentPreferred: false,
    audiencePainPoints: ["limited local prep resources", "international exam intimidation", "cost concerns"],
    primaryAudienceType: "international",
  },
  trinidad: {
    region: "trinidad",
    displayName: "Trinidad and Tobago",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 12,
    audienceFraming: "Trinidad and Tobago nurses preparing for international licensure exams",
    nursingTerminologyStyle: "Standard NCLEX terminology with Caribbean nursing context",
    toneRecommendation: "Warm, direct, and supportive.",
    examRelevance: ["NCLEX-RN"],
    priceSensitivity: "high",
    ctaAngle: "Affordable exam prep with a clear study plan.",
    seoEmphasis: ["NCLEX prep Trinidad", "nursing exam Trinidad and Tobago"],
    competitiveLevel: "uncontested",
    bilingualContentPreferred: false,
    audiencePainPoints: ["limited prep access", "navigating international requirements"],
    primaryAudienceType: "international",
  },
  ireland: {
    region: "ireland",
    displayName: "Ireland",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 13,
    audienceFraming: "Nurses in Ireland preparing for NMBI registration, NCLEX, or international credentials",
    nursingTerminologyStyle: "UK/Ireland nursing terminology with international exam bridging",
    toneRecommendation: "Professional, clear, and supportive.",
    examRelevance: ["NCLEX-RN", "NMBI"],
    priceSensitivity: "moderate",
    ctaAngle: "Structured exam prep at a fair price. Prepare with confidence.",
    seoEmphasis: ["nursing exam Ireland", "NCLEX prep Ireland", "NMBI registration"],
    competitiveLevel: "low",
    bilingualContentPreferred: false,
    audiencePainPoints: ["bridging between Irish and international systems", "exam preparation stress"],
    primaryAudienceType: "mixed",
  },
  "new-zealand": {
    region: "new-zealand",
    displayName: "New Zealand",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 14,
    audienceFraming: "Nurses in New Zealand preparing for NCNZ competency assessments and international credentials",
    nursingTerminologyStyle: "UK/ANZ nursing terminology with international exam bridging",
    toneRecommendation: "Professional, direct, and practical.",
    examRelevance: ["NCLEX-RN", "NCNZ"],
    priceSensitivity: "moderate",
    ctaAngle: "Structured prep for nursing exams. Study efficiently and track your progress.",
    seoEmphasis: ["nursing exam New Zealand", "NCLEX prep NZ", "NCNZ competency assessment"],
    competitiveLevel: "low",
    bilingualContentPreferred: false,
    audiencePainPoints: ["limited local exam prep options", "bridging requirements"],
    primaryAudienceType: "mixed",
  },
  canada: {
    region: "canada",
    displayName: "Canada",
    defaultLanguage: "en",
    allowedLocales: ["en", "fr"],
    priority: 15,
    audienceFraming: "Canadian nursing students and practical nurses preparing for NCLEX-RN, REx-PN, and NP exams",
    nursingTerminologyStyle: "Canadian nursing exam terminology (NCLEX-RN, REx-PN, CNPLE) with SI units and Canadian practice norms",
    toneRecommendation: "Professional, exam-focused, and supportive. Acknowledge the Canadian regulatory context.",
    examRelevance: ["NCLEX-RN", "REx-PN", "CNPLE", "NP-US"],
    priceSensitivity: "moderate",
    ctaAngle: "Profession-specific, exam-aligned prep. Study the right material for your exam pathway.",
    seoEmphasis: ["NCLEX-RN Canada", "REx-PN study guide", "Canadian nursing exam prep", "CNPLE preparation"],
    competitiveLevel: "moderate",
    bilingualContentPreferred: false,
    audiencePainPoints: ["exam-specific study plan uncertainty", "REx-PN vs NCLEX confusion", "provincial regulation differences"],
    primaryAudienceType: "domestic",
  },
  us: {
    region: "us",
    displayName: "United States",
    defaultLanguage: "en",
    allowedLocales: ["en", "es"],
    priority: 16,
    audienceFraming: "US nursing students, new graduates, and internationally educated nurses preparing for NCLEX and NP boards",
    nursingTerminologyStyle: "US NCLEX standard terminology, NCSBN frameworks, Next Generation NCLEX clinical judgment",
    toneRecommendation: "Confident, exam-focused, and data-driven. Strong conversion orientation.",
    examRelevance: ["NCLEX-RN", "NCLEX-PN", "NP-US"],
    priceSensitivity: "low",
    ctaAngle: "Pass on your first attempt. Adaptive practice, smart review, and readiness scoring.",
    seoEmphasis: ["NCLEX-RN study guide", "NCLEX practice questions", "Next Generation NCLEX prep", "NP board review"],
    competitiveLevel: "saturated",
    bilingualContentPreferred: false,
    audiencePainPoints: ["NCLEX anxiety", "choosing between prep platforms", "study plan optimization", "clinical judgment preparation"],
    primaryAudienceType: "domestic",
  },
  uk: {
    region: "uk",
    displayName: "United Kingdom",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 17,
    audienceFraming: "Nurses in the UK preparing for NMC registration, OSCE, and international exams",
    nursingTerminologyStyle: "UK nursing terminology (NMC, OSCE) with bridging to international exam styles",
    toneRecommendation: "Professional and clear. Respect UK nursing standards.",
    examRelevance: ["NCLEX-RN", "NMC-CBT", "NMC-OSCE"],
    priceSensitivity: "moderate",
    ctaAngle: "Structured prep for nursing registration and international exams.",
    seoEmphasis: ["nursing exam UK", "NMC CBT prep", "OSCE preparation UK", "NCLEX from UK"],
    competitiveLevel: "moderate",
    bilingualContentPreferred: false,
    audiencePainPoints: ["OSCE preparation stress", "NMC registration process", "bridging to international credentials"],
    primaryAudienceType: "mixed",
  },
  aus: {
    region: "aus",
    displayName: "Australia",
    defaultLanguage: "en",
    allowedLocales: ["en"],
    priority: 18,
    audienceFraming: "Nurses in Australia preparing for AHPRA registration and international licensing exams",
    nursingTerminologyStyle: "Australian/UK nursing terminology with international exam bridging",
    toneRecommendation: "Direct, professional, results-focused.",
    examRelevance: ["NCLEX-RN", "AHPRA"],
    priceSensitivity: "low",
    ctaAngle: "Structured exam prep. Study efficiently and know when you are ready.",
    seoEmphasis: ["nursing exam Australia", "AHPRA registration", "NCLEX prep Australia"],
    competitiveLevel: "moderate",
    bilingualContentPreferred: false,
    audiencePainPoints: ["AHPRA registration requirements", "bridging programs", "international credential recognition"],
    primaryAudienceType: "mixed",
  },
};

/**
 * Get the market strategy for a region.
 * Returns undefined for unknown regions rather than throwing.
 */
export function getMarketStrategy(region: GlobalRegionSlug): BlogMarketStrategy | undefined {
  return BLOG_MARKET_STRATEGIES[region];
}

/** Regions sorted by priority (lowest number = highest priority). */
export function marketsByPriority(): BlogMarketStrategy[] {
  return Object.values(BLOG_MARKET_STRATEGIES).sort((a, b) => a.priority - b.priority);
}

/**
 * Build the editorial context string the AI sees when adapting content for a region.
 * Structured data → prompt string conversion happens here, not in the AI prompt template.
 */
export function buildRegionalEditorialContext(region: GlobalRegionSlug): string {
  const s = BLOG_MARKET_STRATEGIES[region];
  if (!s) return `Region: ${region}. No specific editorial context configured.`;

  return [
    `Country: ${s.displayName}.`,
    `Audience: ${s.audienceFraming}.`,
    `Terminology style: ${s.nursingTerminologyStyle}.`,
    `Tone: ${s.toneRecommendation}`,
    `Exam relevance: ${s.examRelevance.join(", ")}.`,
    `Price sensitivity: ${s.priceSensitivity}.`,
    `CTA angle: ${s.ctaAngle}`,
    `SEO emphasis: ${s.seoEmphasis.join(", ")}.`,
    `Competitive level: ${s.competitiveLevel}.`,
    `Audience type: ${s.primaryAudienceType}.`,
    s.bilingualContentPreferred ? "Bilingual content (English + local language mix) is preferred for this market." : "",
    `Key audience pain points: ${s.audiencePainPoints.join("; ")}.`,
  ].filter(Boolean).join("\n");
}
