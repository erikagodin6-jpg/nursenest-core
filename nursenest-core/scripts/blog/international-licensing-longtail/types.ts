export type InternationalLicensingTopicSpec = {
  slug: string;
  title: string;
  country: string;
  exam: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  tags: string[];
  /** Primary regulator or pathway name for references */
  regulatorLabel: string;
  /** Official or high-authority URL (no fabricated DOIs) */
  authorityUrl: string;
  takeaways: string[];
  /** 2–4 sentences of unique angle per section (plain text, HTML-escaped when rendered) */
  overview: string;
  eligibility: string;
  structure: string;
  clinicalJudgment: string;
  mistakes: string;
  studyStrategies: string;
  timeManagement: string;
  practiceStrategy: string;
  countryNursing: string;
  registration: string;
  faq: [string, string][];
  /** APA-style bibliographic lines; prefer ≤10 years; URLs allowed without DOI */
  references: string[];
};
