import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

/** Default `/blog` (marketing root) — not Canada-specific; regional hubs use {@link localizedMarketingBlogIndexCopy}. */
export const DEFAULT_MARKETING_BLOG_INDEX = {
  metadataTitle: "Nursing Exam Prep Blog | NurseNest",
  metadataDescription:
    "Practice-focused nursing exam articles: clinical reasoning, pharmacology, infection control, and study strategy.",
  openGraphTitle: "Nursing Exam Prep Blog | NurseNest",
  inlineH1Default: "Nursing Exam Prep Blog",
  inlineLeadHtmlDefault:
    "<p>Clinical reasoning, pharmacology, and test-taking strategy for nurses preparing for NCLEX-style and international licensing exams.</p>",
} as const;

export type LocalizedBlogIndexMarketingCopy = {
  metadataTitle: string;
  metadataDescription: string;
  heroH1: string;
  heroSubtitle: string;
};

/**
 * Hero + metadata strings for `/[locale]/…/[exam]/blog` — US vs Canada vs other regions stay explicit so
 * Canada-only exam strings never appear on the US surface.
 */
export function localizedMarketingBlogIndexCopy(
  region: GlobalRegionSlug,
  regionDisplayName: string,
  exam: string,
): LocalizedBlogIndexMarketingCopy {
  const examUpper = exam.toUpperCase();
  const baseTitle = `${examUpper} Blog — ${regionDisplayName}`;

  if (region === "canada") {
    return {
      metadataTitle: `${baseTitle} | NurseNest`,
      metadataDescription: `${examUpper} exam prep in ${regionDisplayName}: NCLEX-RN, REx-PN, and NP articles with clinical rationales and Canadian exam context.`,
      heroH1: baseTitle,
      heroSubtitle: `Nursing Exam Prep Blog for Canada: NCLEX-RN, REx-PN, and NP-focused articles for nursing students in ${regionDisplayName}.`,
    };
  }

  if (region === "us") {
    return {
      metadataTitle: `${baseTitle} | NurseNest`,
      metadataDescription: `${examUpper} exam prep in ${regionDisplayName}: NCLEX-RN and NCLEX-PN articles with clinical rationales and US exam context.`,
      heroH1: baseTitle,
      heroSubtitle: `Nursing Exam Prep Blog: NCLEX-RN and NCLEX-PN articles with rationales and test-taking strategy for US nursing students in ${regionDisplayName}.`,
    };
  }

  return {
    metadataTitle: `${baseTitle} | NurseNest`,
    metadataDescription: `Exam prep articles, study tips, and guides for ${examUpper} nursing exam preparation in ${regionDisplayName}.`,
    heroH1: baseTitle,
    heroSubtitle: `Nursing Exam Prep Blog: exam prep articles and study guides for ${regionDisplayName} nursing students.`,
  };
}
