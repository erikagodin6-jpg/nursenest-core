export type CanonicalLessonHubInput = {
  slug: string;
  title: string;
  sectionCount?: number;
  bodyLength?: number;
  hiddenFromLessonHub?: boolean;
  canonicalLessonId?: string | null;
  redirectedToSlug?: string | null;
};

export type CanonicalLessonHubResult = {
  visibleSlugs: Set<string>;
  slugToCanonicalTitle: Record<string, string>;
  duplicateRedirects: Record<string, string>;
};

const TITLE_OVERRIDES = new Map<string, string>([
  ["copd", "COPD"],
  ["chronic obstructive pulmonary disease", "COPD"],
  ["chf", "Heart Failure"],
  ["congestive heart failure", "Heart Failure"],
  ["heart failure", "Heart Failure"],
  ["atrial fib", "Atrial Fibrillation"],
  ["atrial fibrillation", "Atrial Fibrillation"],
  ["a fib", "Atrial Fibrillation"],
  ["afib", "Atrial Fibrillation"],
  ["supraventricular tachycardia", "Supraventricular Tachycardia (SVT)"],
  ["svt", "Supraventricular Tachycardia (SVT)"],
  ["diabetes mellitus", "Diabetes"],
  ["dm", "Diabetes"],
  ["myocardial infarction", "Myocardial Infarction"],
  ["mi", "Myocardial Infarction"],
  ["cva", "Stroke"],
  ["cerebrovascular accident", "Stroke"],
  ["hypertension", "Hypertension"],
  ["htn", "Hypertension"],
  ["diabetic ketoacidosis", "DKA"],
  ["dka", "DKA"],
  ["siadh", "SIADH"],
]);

const KEY_ALIASES = new Map<string, string>([
  ["chronic obstructive pulmonary disease", "copd"],
  ["congestive heart failure", "heart failure"],
  ["chf", "heart failure"],
  ["atrial fib", "atrial fibrillation"],
  ["a fib", "atrial fibrillation"],
  ["afib", "atrial fibrillation"],
  ["svt", "supraventricular tachycardia"],
  ["dm", "diabetes"],
  ["diabetes mellitus", "diabetes"],
  ["cva", "stroke"],
  ["cerebrovascular accident", "stroke"],
  ["htn", "hypertension"],
  ["diabetic ketoacidosis", "dka"],
]);

const SUFFIX_PATTERNS: readonly RegExp[] = [
  /\s*[:\-–—]\s*(nclex|rex-pn|cnple|exam)\s*(review|prep|focus)?\s*$/i,
  /\s*\b(nclex|rex-pn|cnple|exam)\s*(review|prep|focus)?\s*$/i,
  /\s*\b(for nurses|for nursing|nursing)\s*$/i,
  /\s*\b(nursing care|nursing management|nursing interventions|care plan|care)\s*$/i,
  /\s*\b(management|treatment|treatments|interventions|assessment|diagnostics)\s*$/i,
  /\s*\b(discharge teaching|patient teaching|client education|education|teaching)\s*$/i,
  /\s*\b(basics|overview|review|fundamentals|introduction|intro|pathophysiology)\s*$/i,
  /\s*\b(medications|pharmacology|therapy|complications)\s*$/i,
];

const PREFIX_PATTERNS: readonly RegExp[] = [
  /^\s*(rn|rpn|pn|np|allied)\s*[:\-–—]\s*/i,
  /^\s*(nursing interventions for|nursing assessment of|nursing assessment for|nursing care for|nursing management of|management of|treatment of|care of the|care of|introduction to|overview of)\s+/i,
];

const LEGITIMATE_SPLIT_PATTERNS: readonly RegExp[] = [
  /\bexacerbation\b/i,
  /\bpediatric|paediatric|neonatal|newborn|pregnancy|prenatal|postpartum\b/i,
  /\bprocedure|osce|delegation|prioritization|scope\b/i,
  /\becg interpretation\b/i,
  /\bprescribing|differential diagnosis|diagnosis\b/i,
  /\bacute coronary syndrome\b/i,
];

function titleCase(input: string): string {
  const small = new Set(["and", "or", "of", "the", "for", "in", "to", "with"]);
  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (TITLE_OVERRIDES.has(lower)) return TITLE_OVERRIDES.get(lower)!;
      if (index > 0 && small.has(lower)) return lower;
      if (/^[A-Z0-9]{2,}$/.test(word)) return word;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ")
    .replace(/\bDvt\b/g, "DVT")
    .replace(/\bPe\b/g, "PE")
    .replace(/\bCopd\b/g, "COPD")
    .replace(/\bDka\b/g, "DKA")
    .replace(/\bSiadh\b/g, "SIADH")
    .replace(/\bStemi\b/g, "STEMI")
    .replace(/\bNstemi\b/g, "NSTEMI")
    .replace(/\bSvt\b/g, "SVT");
}

export function stripLessonTitleNoise(title: string): string {
  let t = String(title || "").trim();
  t = t.replace(/\s*\((rn|rpn|pn|np|allied|nclex|rex-pn|cnple|canada|us|specific|np-specific)\)\s*/gi, " ").trim();
  for (const pattern of PREFIX_PATTERNS) t = t.replace(pattern, "").trim();

  let changed = true;
  while (changed) {
    changed = false;
    for (const pattern of SUFFIX_PATTERNS) {
      const next = t.replace(pattern, "").trim();
      if (next !== t && next.length >= 2) {
        t = next;
        changed = true;
      }
    }
  }

  return t.replace(/[\s:;,.\-–—/&]+$/g, "").replace(/\s+/g, " ").trim();
}

export function canonicalLessonHubTitle(title: string): string {
  const original = String(title || "").trim();
  if (!original) return original;
  if (LEGITIMATE_SPLIT_PATTERNS.some((pattern) => pattern.test(original))) return original;

  const stripped = stripLessonTitleNoise(original);
  const key = stripped.toLowerCase();
  if (TITLE_OVERRIDES.has(key)) return TITLE_OVERRIDES.get(key)!;
  return titleCase(stripped);
}

export function canonicalLessonHubKey(title: string): string {
  let key = stripLessonTitleNoise(title).toLowerCase();
  key = key.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  return KEY_ALIASES.get(key) ?? key;
}

function lessonWeight(item: CanonicalLessonHubInput): number {
  return (item.sectionCount ?? 0) * 100_000 + (item.bodyLength ?? 0);
}

export function buildCanonicalLessonHubIndex(items: readonly CanonicalLessonHubInput[]): CanonicalLessonHubResult {
  const visibleSlugs = new Set<string>();
  const slugToCanonicalTitle: Record<string, string> = {};
  const duplicateRedirects: Record<string, string> = {};
  const byKey = new Map<string, CanonicalLessonHubInput[]>();

  for (const item of items) {
    const slug = item.slug.trim();
    const explicitRedirect = (item.redirectedToSlug || item.canonicalLessonId || "").trim();
    const isExplicitlyHidden = item.hiddenFromLessonHub || Boolean(explicitRedirect);
    const canonicalTitle = canonicalLessonHubTitle(item.title);
    slugToCanonicalTitle[slug] = canonicalTitle;

    if (explicitRedirect) duplicateRedirects[slug] = explicitRedirect;
    if (isExplicitlyHidden) continue;

    const key = canonicalLessonHubKey(canonicalTitle);
    if (!key) {
      visibleSlugs.add(slug);
      continue;
    }
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push({ ...item, slug, title: canonicalTitle });
  }

  for (const group of byKey.values()) {
    if (group.length === 1) {
      visibleSlugs.add(group[0].slug);
      continue;
    }

    const sorted = [...group].sort((a, b) => lessonWeight(b) - lessonWeight(a) || a.slug.localeCompare(b.slug));
    const canonical = sorted[0];
    visibleSlugs.add(canonical.slug);
    slugToCanonicalTitle[canonical.slug] = canonicalLessonHubTitle(canonical.title);

    for (const duplicate of sorted.slice(1)) {
      duplicateRedirects[duplicate.slug] = canonical.slug;
      slugToCanonicalTitle[duplicate.slug] = slugToCanonicalTitle[canonical.slug];
    }
  }

  return { visibleSlugs, slugToCanonicalTitle, duplicateRedirects };
}
