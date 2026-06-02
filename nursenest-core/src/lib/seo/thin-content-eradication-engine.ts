import type { AuthorityContentCategory } from "@/lib/authority/healthcare-authority-content-engine";

export type IndexablePageKind =
  | "Authority Page"
  | "Supporting Page"
  | "Category Page"
  | "Programmatic Page"
  | "Landing Page"
  | "Marketing Page"
  | "Certification Page"
  | "Career Page"
  | "Blog Post"
  | "Lesson";

export type ThinContentDecision = "EXPAND" | "MERGE" | "REDIRECT" | "NOINDEX" | "DELETE";

export type ThinContentSignal =
  | "under_300_words"
  | "under_500_words"
  | "below_target_depth"
  | "no_internal_links"
  | "low_internal_links"
  | "no_educational_value"
  | "no_unique_content"
  | "placeholder_language"
  | "coming_soon"
  | "scaffold_content"
  | "generated_filler"
  | "duplicate_content"
  | "weak_allied_specificity"
  | "missing_authority_blocks";

export type ContentInventoryPage = {
  url: string;
  title: string;
  kind: IndexablePageKind;
  indexable: boolean;
  wordCount: number;
  uniqueContentScore: number;
  educationalValueScore: number;
  internalLinkCount: number;
  externalReferenceCount?: number;
  conversionPathCount?: number;
  duplicateGroupId?: string | null;
  targetKeywordValue: "high" | "medium" | "low";
  trafficPotential: "high" | "medium" | "low";
  conversionPotential: "high" | "medium" | "low";
  authorityCategory?: AuthorityContentCategory;
  profession?: "RN" | "RPN" | "NP" | "RT" | "Paramedic" | "OT" | "PT" | "MLT" | "PSW" | "Allied" | "Pre-Nursing";
  contentBlocks: readonly string[];
  bodyPreview: string;
};

export type ThinContentAuditResult = {
  page: ContentInventoryPage;
  targetDepth: { min: number; max: number | null };
  signals: ThinContentSignal[];
  severity: "none" | "low" | "medium" | "high" | "critical";
  decision: ThinContentDecision | "KEEP";
  rationale: string;
  requiredExpansionBlocks: readonly string[];
  requiredInternalLinks: readonly string[];
};

export type ThinContentDashboard = {
  pagesAudited: number;
  indexablePages: number;
  thinPages: number;
  pagesToExpand: number;
  pagesToMerge: number;
  pagesToRedirect: number;
  pagesToNoindex: number;
  pagesToDelete: number;
  authorityScore: number;
  crawledNotIndexedRisk: number;
  alliedHealthWeakPages: number;
  topExpansionCandidates: readonly ThinContentAuditResult[];
};

export type AuthorityExpansionRequirement = {
  category: AuthorityContentCategory | "certification" | "career" | "allied-health-guide";
  targetWords: { min: number; max: number };
  requiredBlocks: readonly string[];
  minimumInternalLinks: { min: number; max: number };
};

export const AUTHORITY_EXPANSION_REQUIREMENTS: readonly AuthorityExpansionRequirement[] = [
  {
    category: "conditions",
    targetWords: { min: 3000, max: 5000 },
    requiredBlocks: ["Definition", "Why It Matters", "Assessment", "Diagnostics", "Management", "Common Mistakes", "Clinical Reasoning", "Exam Considerations", "FAQs", "References"],
    minimumInternalLinks: { min: 15, max: 30 },
  },
  {
    category: "medications",
    targetWords: { min: 2500, max: 4000 },
    requiredBlocks: ["Mechanism", "Indications", "Contraindications", "Monitoring", "Safety Alerts", "Medication Errors", "Patient Teaching", "Clinical Pearls", "Exam Considerations", "References"],
    minimumInternalLinks: { min: 15, max: 30 },
  },
  {
    category: "care-plans",
    targetWords: { min: 2000, max: 3500 },
    requiredBlocks: ["Patient Scenario", "Priority Diagnoses", "Clinical Reasoning", "Goals", "Interventions", "Rationales", "Evaluation", "Patient Education", "Complication Monitoring", "Documentation Examples"],
    minimumInternalLinks: { min: 15, max: 30 },
  },
  {
    category: "clinical-skills",
    targetWords: { min: 2500, max: 4000 },
    requiredBlocks: ["Purpose", "Indications", "Contraindications", "Equipment", "Procedure", "Safety Checks", "Common Errors", "Complications", "Documentation", "Knowledge Checks"],
    minimumInternalLinks: { min: 15, max: 30 },
  },
  {
    category: "labs",
    targetWords: { min: 2000, max: 3000 },
    requiredBlocks: ["Normal Values", "Function", "High Values", "Low Values", "Clinical Significance", "Nursing Actions", "Patient Implications", "Related Conditions", "FAQs", "References"],
    minimumInternalLinks: { min: 15, max: 30 },
  },
  {
    category: "certification",
    targetWords: { min: 4000, max: 8000 },
    requiredBlocks: ["Eligibility", "Exam Blueprint", "Study Timeline", "Question Types", "Readiness Plan", "Common Mistakes", "Resources", "FAQs", "References"],
    minimumInternalLinks: { min: 15, max: 30 },
  },
  {
    category: "career",
    targetWords: { min: 3000, max: 5000 },
    requiredBlocks: ["Role Overview", "Education Path", "Licensing", "Clinical Placement", "Skills", "Salary", "Career Outlook", "Interview Prep", "FAQs", "References"],
    minimumInternalLinks: { min: 15, max: 30 },
  },
  {
    category: "allied-health-guide",
    targetWords: { min: 3000, max: 5000 },
    requiredBlocks: ["Profession-Specific Role", "Competencies", "Clinical Skills", "Placement Expectations", "Certification", "Career Relevance", "Practice Scenarios", "FAQs", "References"],
    minimumInternalLinks: { min: 15, max: 30 },
  },
] as const;

const PUBLIC_AUTHORITY_BLOCKS = [
  "Clinical Pearls",
  "Case Examples",
  "Common Mistakes",
  "Clinical Reasoning",
  "Exam Considerations",
  "Practice Applications",
  "Patient Scenarios",
  "FAQs",
  "References",
  "Related Topics",
] as const;

const INTERNAL_LINK_TARGETS = [
  "Related Lessons",
  "Related Flashcards",
  "Related Questions",
  "Related Simulations",
  "Related Skills",
  "Related Care Plans",
  "Related Labs",
  "Related Medications",
  "Related Certifications",
] as const;

const placeholderPatterns = [
  /\bcoming soon\b/i,
  /\bplaceholder\b/i,
  /\blorem ipsum\b/i,
  /\bunder construction\b/i,
  /\bcontent will be added\b/i,
  /\bmore details soon\b/i,
  /\bthis page is being developed\b/i,
];

const fillerPatterns = [
  /\bas an ai\b/i,
  /\bin conclusion, it is important to note\b/i,
  /\bthis comprehensive guide will help you understand\b/i,
  /\bhealthcare professionals should be aware\b/i,
  /\bit is essential to understand the basics\b/i,
];

function depthForPage(page: ContentInventoryPage): { min: number; max: number | null } {
  const category = page.authorityCategory;
  if (category) {
    const requirement = AUTHORITY_EXPANSION_REQUIREMENTS.find((item) => item.category === category);
    if (requirement) return requirement.targetWords;
  }
  if (page.kind === "Certification Page") return { min: 4000, max: 8000 };
  if (page.kind === "Career Page") return { min: 3000, max: 5000 };
  if (page.kind === "Authority Page") return { min: 2000, max: 5000 };
  if (page.kind === "Supporting Page") return { min: 1200, max: 3000 };
  if (page.kind === "Blog Post") return { min: 1000, max: 2500 };
  if (page.kind === "Programmatic Page") return { min: 800, max: 1800 };
  if (page.kind === "Lesson") return { min: 600, max: 2500 };
  return { min: 500, max: null };
}

function valueScore(value: ContentInventoryPage["targetKeywordValue"] | ContentInventoryPage["trafficPotential"] | ContentInventoryPage["conversionPotential"]): number {
  return value === "high" ? 3 : value === "medium" ? 2 : 1;
}

function hasPattern(text: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function missingBlocks(page: ContentInventoryPage): string[] {
  const present = new Set(page.contentBlocks.map((block) => block.toLowerCase()));
  return PUBLIC_AUTHORITY_BLOCKS.filter((block) => !present.has(block.toLowerCase()));
}

function computeSignals(page: ContentInventoryPage, targetDepth: { min: number; max: number | null }): ThinContentSignal[] {
  const signals: ThinContentSignal[] = [];
  if (page.wordCount < 300) signals.push("under_300_words");
  if (page.wordCount < 500) signals.push("under_500_words");
  if (page.wordCount < targetDepth.min) signals.push("below_target_depth");
  if (page.internalLinkCount === 0) signals.push("no_internal_links");
  else if (page.internalLinkCount < 15 && ["Authority Page", "Certification Page", "Career Page", "Supporting Page"].includes(page.kind)) signals.push("low_internal_links");
  if (page.educationalValueScore < 50) signals.push("no_educational_value");
  if (page.uniqueContentScore < 50) signals.push("no_unique_content");
  if (hasPattern(page.bodyPreview, placeholderPatterns)) signals.push("placeholder_language");
  if (/\bcoming soon\b/i.test(page.bodyPreview)) signals.push("coming_soon");
  if (/\bscaffold\b|\bstub\b/i.test(page.bodyPreview)) signals.push("scaffold_content");
  if (hasPattern(page.bodyPreview, fillerPatterns)) signals.push("generated_filler");
  if (page.duplicateGroupId) signals.push("duplicate_content");
  if (page.profession && ["RT", "Paramedic", "OT", "PT", "MLT", "PSW", "Allied"].includes(page.profession) && page.educationalValueScore < 70) signals.push("weak_allied_specificity");
  if (missingBlocks(page).length >= 4 && ["Authority Page", "Certification Page", "Career Page"].includes(page.kind)) signals.push("missing_authority_blocks");
  return [...new Set(signals)];
}

function severityForSignals(signals: readonly ThinContentSignal[]): ThinContentAuditResult["severity"] {
  if (signals.includes("under_300_words") || signals.includes("coming_soon") || signals.includes("placeholder_language")) return "critical";
  if (signals.includes("duplicate_content") || signals.includes("no_unique_content") || signals.includes("no_educational_value")) return "high";
  if (signals.includes("below_target_depth") || signals.includes("low_internal_links") || signals.includes("missing_authority_blocks")) return "medium";
  if (signals.length) return "low";
  return "none";
}

function decide(page: ContentInventoryPage, signals: readonly ThinContentSignal[]): ThinContentDecision | "KEEP" {
  const strategicValue = valueScore(page.targetKeywordValue) + valueScore(page.trafficPotential) + valueScore(page.conversionPotential);
  if (!page.indexable) return "KEEP";
  if (signals.includes("coming_soon") || signals.includes("placeholder_language") || signals.includes("scaffold_content")) {
    return strategicValue >= 7 ? "NOINDEX" : "DELETE";
  }
  if (signals.includes("duplicate_content")) {
    return strategicValue >= 7 ? "MERGE" : "REDIRECT";
  }
  if (signals.includes("under_300_words") && strategicValue <= 4) return "DELETE";
  if (signals.includes("no_unique_content") && strategicValue <= 5) return "REDIRECT";
  if (signals.includes("below_target_depth") || signals.includes("low_internal_links") || signals.includes("missing_authority_blocks") || signals.includes("weak_allied_specificity")) {
    return strategicValue >= 5 ? "EXPAND" : "NOINDEX";
  }
  return signals.length ? "NOINDEX" : "KEEP";
}

function rationale(decision: ThinContentDecision | "KEEP", page: ContentInventoryPage, signals: readonly ThinContentSignal[]): string {
  if (decision === "KEEP") return "Page meets current indexable quality thresholds.";
  if (decision === "EXPAND") return "High-value page should be expanded into a stronger authority asset instead of removed.";
  if (decision === "MERGE") return "Duplicate or overlapping page has enough value to consolidate into a stronger canonical asset.";
  if (decision === "REDIRECT") return "Low-value duplicate should pass any residual signal to a stronger canonical page.";
  if (decision === "NOINDEX") return "Page has strategic or operational value but should not be indexed until it meets quality thresholds.";
  return `Indexable ${page.kind.toLowerCase()} has ${signals.join(", ")} and insufficient unique value to keep.`;
}

function requiredExpansionBlocks(page: ContentInventoryPage): string[] {
  const base = missingBlocks(page);
  const requirement = AUTHORITY_EXPANSION_REQUIREMENTS.find((item) => item.category === page.authorityCategory);
  const requirementBlocks = requirement?.requiredBlocks.filter((block) => !page.contentBlocks.some((existing) => existing.toLowerCase() === block.toLowerCase())) ?? [];
  return [...new Set([...base, ...requirementBlocks])];
}

export function auditIndexablePage(page: ContentInventoryPage): ThinContentAuditResult {
  const targetDepth = depthForPage(page);
  const signals = page.indexable ? computeSignals(page, targetDepth) : [];
  const decision = decide(page, signals);
  return {
    page,
    targetDepth,
    signals,
    severity: severityForSignals(signals),
    decision,
    rationale: rationale(decision, page, signals),
    requiredExpansionBlocks: decision === "EXPAND" || decision === "NOINDEX" ? requiredExpansionBlocks(page) : [],
    requiredInternalLinks: page.internalLinkCount < 15 ? [...INTERNAL_LINK_TARGETS] : [],
  };
}

export function buildThinContentDashboard(pages: readonly ContentInventoryPage[]): ThinContentDashboard {
  const results = pages.map(auditIndexablePage);
  const indexable = results.filter((result) => result.page.indexable);
  const thin = results.filter((result) => result.signals.length > 0);
  const authorityPenalty = thin.reduce((sum, result) => sum + (result.severity === "critical" ? 5 : result.severity === "high" ? 3 : result.severity === "medium" ? 2 : 1), 0);
  return {
    pagesAudited: pages.length,
    indexablePages: indexable.length,
    thinPages: thin.length,
    pagesToExpand: results.filter((result) => result.decision === "EXPAND").length,
    pagesToMerge: results.filter((result) => result.decision === "MERGE").length,
    pagesToRedirect: results.filter((result) => result.decision === "REDIRECT").length,
    pagesToNoindex: results.filter((result) => result.decision === "NOINDEX").length,
    pagesToDelete: results.filter((result) => result.decision === "DELETE").length,
    authorityScore: Math.max(0, Math.min(100, Math.round(100 - authorityPenalty))),
    crawledNotIndexedRisk: Math.min(100, Math.round((thin.length / Math.max(1, indexable.length)) * 100)),
    alliedHealthWeakPages: results.filter((result) => result.signals.includes("weak_allied_specificity")).length,
    topExpansionCandidates: results
      .filter((result) => result.decision === "EXPAND")
      .sort((a, b) => valueScore(b.page.trafficPotential) + valueScore(b.page.conversionPotential) - (valueScore(a.page.trafficPotential) + valueScore(a.page.conversionPotential)))
      .slice(0, 20),
  };
}

export function classifyContentInventoryPage(page: ContentInventoryPage): IndexablePageKind {
  return page.kind;
}

export function buildIndexationImpactSummary(before: ThinContentDashboard, after: ThinContentDashboard): {
  thinPagesEliminated: number;
  pagesExpanded: number;
  pagesRedirected: number;
  pagesRemoved: number;
  authorityScoreChange: number;
  crawledNotIndexedRiskChange: number;
} {
  return {
    thinPagesEliminated: Math.max(0, before.thinPages - after.thinPages),
    pagesExpanded: before.pagesToExpand,
    pagesRedirected: before.pagesToRedirect,
    pagesRemoved: before.pagesToDelete,
    authorityScoreChange: after.authorityScore - before.authorityScore,
    crawledNotIndexedRiskChange: after.crawledNotIndexedRisk - before.crawledNotIndexedRisk,
  };
}

