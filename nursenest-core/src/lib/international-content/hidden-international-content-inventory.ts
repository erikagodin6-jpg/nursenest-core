export type HiddenInternationalInventoryKind =
  | "lesson"
  | "question"
  | "flashcard"
  | "simulation"
  | "clinical_skill"
  | "blog_seed"
  | "blueprint"
  | "translation_overlay"
  | "marketing_asset";

export type HiddenInternationalInventoryScope =
  | "global"
  | "canada"
  | "united_states"
  | "united_kingdom"
  | "australia"
  | "new_zealand"
  | "ireland"
  | "future";

export type HiddenInternationalInventoryEntry = {
  readonly id: string;
  readonly title: string;
  readonly kind: HiddenInternationalInventoryKind;
  readonly scope: HiddenInternationalInventoryScope;
  readonly sourcePath: string;
  readonly reuseDisposition: "reuse" | "country_supplement" | "exam_supplement" | "review_required";
  readonly candidateMarkets: readonly string[];
  readonly published: false;
  readonly launchReady: false;
  readonly visibleInNavigation: false;
  readonly indexable: false;
  readonly adminOnly: true;
};

export const HIDDEN_INTERNATIONAL_CONTENT_INVENTORY: readonly HiddenInternationalInventoryEntry[] = [
  {
    id: "global-core-heart-failure",
    title: "Heart Failure Global Core",
    kind: "lesson",
    scope: "global",
    sourcePath: "src/content/pathway-lessons/rn-nclex-cardiovascular-expansion-catalog.json",
    reuseDisposition: "reuse",
    candidateMarkets: ["US", "GB", "AU", "NZ", "IE"],
    published: false,
    launchReady: false,
    visibleInNavigation: false,
    indexable: false,
    adminOnly: true,
  },
  {
    id: "global-core-copd",
    title: "COPD Global Core",
    kind: "lesson",
    scope: "global",
    sourcePath: "src/content/pathway-lessons/rn-nclex-respiratory-expansion-catalog.json",
    reuseDisposition: "reuse",
    candidateMarkets: ["US", "GB", "AU", "NZ", "IE"],
    published: false,
    launchReady: false,
    visibleInNavigation: false,
    indexable: false,
    adminOnly: true,
  },
  {
    id: "global-core-sepsis",
    title: "Sepsis Global Core",
    kind: "simulation",
    scope: "global",
    sourcePath: "src/content/clinical-case-studies.json",
    reuseDisposition: "reuse",
    candidateMarkets: ["US", "GB", "AU", "NZ", "IE"],
    published: false,
    launchReady: false,
    visibleInNavigation: false,
    indexable: false,
    adminOnly: true,
  },
  {
    id: "uk-nmc-blog-seeds",
    title: "UK NMC And ACP Blog Seeds",
    kind: "blog_seed",
    scope: "united_kingdom",
    sourcePath: "src/content/blog-static-longtail/",
    reuseDisposition: "country_supplement",
    candidateMarkets: ["GB", "IE"],
    published: false,
    launchReady: false,
    visibleInNavigation: false,
    indexable: false,
    adminOnly: true,
  },
  {
    id: "au-nursing-blog-seeds",
    title: "Australia Nursing Blog Seeds",
    kind: "blog_seed",
    scope: "australia",
    sourcePath: "data/blog-content/australia-nursing/",
    reuseDisposition: "country_supplement",
    candidateMarkets: ["AU"],
    published: false,
    launchReady: false,
    visibleInNavigation: false,
    indexable: false,
    adminOnly: true,
  },
  {
    id: "nz-cultural-safety-seeds",
    title: "New Zealand Cultural Safety Seeds",
    kind: "blog_seed",
    scope: "new_zealand",
    sourcePath: "src/content/blog-static-longtail/",
    reuseDisposition: "country_supplement",
    candidateMarkets: ["NZ"],
    published: false,
    launchReady: false,
    visibleInNavigation: false,
    indexable: false,
    adminOnly: true,
  },
  {
    id: "us-nclex-ngn-seeds",
    title: "U.S. NCLEX And NGN Seeds",
    kind: "question",
    scope: "united_states",
    sourcePath: "src/content/questions/",
    reuseDisposition: "exam_supplement",
    candidateMarkets: ["US"],
    published: false,
    launchReady: false,
    visibleInNavigation: false,
    indexable: false,
    adminOnly: true,
  },
  {
    id: "international-translation-overlays",
    title: "International Exam Translation Overlays",
    kind: "translation_overlay",
    scope: "future",
    sourcePath: "scripts/i18n/",
    reuseDisposition: "review_required",
    candidateMarkets: ["GB", "AU", "NZ", "IE", "PH", "IN", "SA", "AE"],
    published: false,
    launchReady: false,
    visibleInNavigation: false,
    indexable: false,
    adminOnly: true,
  },
] as const;

export function validateHiddenInternationalContentInventory(): readonly string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const entry of HIDDEN_INTERNATIONAL_CONTENT_INVENTORY) {
    if (ids.has(entry.id)) issues.push(`Duplicate hidden inventory id: ${entry.id}`);
    ids.add(entry.id);
    if (entry.published || entry.launchReady || entry.visibleInNavigation || entry.indexable || !entry.adminOnly) {
      issues.push(`${entry.id} must remain unpublished, hidden, noindex, not launch-ready, and admin-only`);
    }
    if (!entry.sourcePath.trim()) issues.push(`${entry.id} is missing a source path`);
    if (entry.candidateMarkets.length === 0) issues.push(`${entry.id} must name at least one candidate market`);
  }
  return issues;
}
