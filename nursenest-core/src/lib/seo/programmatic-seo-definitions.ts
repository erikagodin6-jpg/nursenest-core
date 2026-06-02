import type { SeoPageKind } from "@/lib/seo/programmatic-page-kind";

export type SeoCluster =
  | "exam-nclex"
  | "exam-pn"
  | "exam-np"
  | "allied"
  | "category"
  | "hub"
  | "study-format"
  /** Shared cluster for lab, pharmacology, prioritization, and study plan guides */
  | "study-guide";

export type SeoPageDefinition = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  cluster: SeoCluster;
  /** Optional taxonomy for pipelines and quality gates (see `programmatic-page-kind.ts`). */
  pageKind?: SeoPageKind;
  /** Primary keyword phrase for related linking */
  keywords: string[];
  sections: { heading: string; level: 2 | 3; body: string[] }[];
  faq?: { question: string; answer: string }[];
  /** Optional 3-level breadcrumb: Home → hub → current */
  breadcrumb?: { midLabel: string; midPath: string; currentLabel: string };
  /** Render practice conversion blocks (see `programmatic-practice-config.ts`) */
  practiceConversion?: boolean;
  /**
   * Optional pathway pack for product links (lessons, questions, test bank, CAT, tools, flashcards).
   * When omitted, links are inferred from `cluster` for exam pages, otherwise general test bank routing applies.
   */
  linkPack?: "nclex-rn" | "nclex-pn" | "np" | "allied" | "general";
  /**
   * Optional comparison table for “X vs Y” pages. Rendered after the first section body
   * (explanation first, then table, then remaining sections).
   */
  comparisonTable?: {
    caption?: string;
    columns: string[];
    rows: string[][];
  };
};
