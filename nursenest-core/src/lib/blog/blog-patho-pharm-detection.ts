import { BlogPostTemplate } from "@prisma/client";

/** Keywords for clinical / patho / pharm content signals (title, excerpt, body, tags, etc.). */
export const CLINICAL_PATHO_PHARM_DETECTION_KEYWORDS = [
  "pathophysiology",
  "disease process",
  "pharmacology",
  "medication",
  "medications",
  "drug",
  "mechanism of action",
  "adverse effect",
  "adverse effects",
  "contraindication",
  "contraindications",
  "dosage",
  "lab value",
  "lab values",
  "nursing intervention",
  "nursing interventions",
  "assessment finding",
  "assessment findings",
  "complication",
  "complications",
] as const;

const PATHO_PHARM_TAG_REGEX =
  /(pharm|pathophys|patholog|pharmacolog|medication|medications|drug|dosage|antibiotic|anticoag|insulin|opio|diuretic|beta.block|ace inhibitor|nsaid|chemotherapy|vasopressor|electrolyte)/i;

const STRONG_TEMPLATES: ReadonlySet<BlogPostTemplate> = new Set([
  BlogPostTemplate.MEDICATION_REVIEW,
  BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
  BlogPostTemplate.LAB_VALUES_GUIDE,
]);

export type PathoPharmRowShape = {
  postTemplate: BlogPostTemplate | null;
  category: string | null;
  title: string;
  tags: string[];
};

/**
 * Same topical gate as `scripts/blog/blog-public-patho-pharm-counts.mts` patho_pharm SQL
 * (template / category / title / tags).
 */
export function rowMatchesPathoPharmTopicalCriteria(row: PathoPharmRowShape): boolean {
  const t = row.postTemplate;
  if (t && STRONG_TEMPLATES.has(t)) return true;
  const cat = (row.category ?? "").toLowerCase();
  if (cat.includes("pharm") || cat.includes("patho")) return true;
  const title = row.title.toLowerCase();
  if (title.includes("pharmacology") || title.includes("pathophys") || title.includes("medication")) {
    return true;
  }
  for (const tag of row.tags) {
    if (PATHO_PHARM_TAG_REGEX.test(tag)) return true;
  }
  return false;
}

export function rowMatchesLongTailHeuristics(row: {
  slug: string;
  title: string;
  targetKeyword: string | null;
}): boolean {
  const dashCount = (row.slug.match(/-/g) ?? []).length;
  if (dashCount >= 4) return true;
  const wordCount = row.title.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount >= 12) return true;
  const kw = (row.targetKeyword ?? "").trim();
  if (kw.length >= 28) return true;
  return false;
}

/** True when body of text suggests clinical patho/pharm topics (broader than SQL topical match). */
export function textHasClinicalPathoPharmSignal(text: string): boolean {
  const blob = text.toLowerCase();
  for (const k of CLINICAL_PATHO_PHARM_DETECTION_KEYWORDS) {
    if (blob.includes(k)) return true;
  }
  return false;
}

export function hasStrongPathoPharmClassification(row: PathoPharmRowShape): boolean {
  if (row.postTemplate && STRONG_TEMPLATES.has(row.postTemplate)) return true;
  const cat = row.category ?? "";
  if (/\b(pathophys|pharmacolog|pharmacology|pharmacy|medication)\b/i.test(cat)) return true;
  if (/(pharm|patho)/i.test(cat)) return true;
  for (const tag of row.tags) {
    if (PATHO_PHARM_TAG_REGEX.test(tag)) return true;
  }
  return false;
}

/**
 * For a **visible** row that does not satisfy `rowMatchesPathoPharmTopicalCriteria`, list which
 * classification levers are missing (used in diagnostics).
 */
export function explainMissingPathoPharmTopicalMatch(row: PathoPharmRowShape): string[] {
  if (rowMatchesPathoPharmTopicalCriteria(row)) return [];
  const reasons: string[] = [];
  const t = row.postTemplate;
  if (!t || !STRONG_TEMPLATES.has(t)) {
    reasons.push(
      `postTemplate is ${t ?? "null"} (counts script expects MEDICATION_REVIEW | DISEASE_PROCESS_EXPLAINER | LAB_VALUES_GUIDE)`,
    );
  }
  const catL = (row.category ?? "").toLowerCase();
  if (!catL.includes("pharm") && !catL.includes("patho")) {
    reasons.push('category missing "%pharm%" or "%patho%" substring (ILIKE heuristics)');
  }
  const titleL = row.title.toLowerCase();
  if (!titleL.includes("pharmacology") && !titleL.includes("pathophys") && !titleL.includes("medication")) {
    reasons.push("title missing pharmacology | pathophys* | medication (ILIKE heuristics)");
  }
  if (!row.tags.some((tag) => PATHO_PHARM_TAG_REGEX.test(tag))) {
    reasons.push("tags[] has no token matching patho/pharm/med/drug regex from counts script");
  }
  return reasons;
}

/** Raw SQL fragment: public “live” rows aligned with `blogLiveWhere(now)` (includes APPROVED). */
export function sqlBlogLiveWhere(alias = "p", nowParam = "$1"): string {
  const wfFail = `'FAILED_GENERATION','FAILED_IMAGE'`;
  const wfPipeline = `'GENERATED','OUTLINE_READY','NEEDS_SOURCE_REVIEW','NEEDS_MEDICAL_REVIEW','NEEDS_SEO_REVIEW','NEEDS_METADATA','NEEDS_REFERENCES'`;
  return `(
  (
    ${alias}."postStatus" = 'PUBLISHED'
    AND (${alias}."publishAt" IS NULL OR ${alias}."publishAt" <= ${nowParam}::timestamptz)
    AND ${alias}."workflowStatus"::text NOT IN (${wfFail}, ${wfPipeline})
  )
  OR (
    ${alias}."postStatus" = 'APPROVED'
    AND ${alias}."workflowStatus"::text NOT IN (${wfFail})
  )
  OR (
    ${alias}."postStatus" = 'SCHEDULED'
    AND (
      (${alias}."publishAt" IS NOT NULL AND ${alias}."publishAt" <= ${nowParam}::timestamptz)
      OR (${alias}."scheduledAt" IS NOT NULL AND ${alias}."scheduledAt" <= ${nowParam}::timestamptz)
    )
    AND ${alias}."workflowStatus"::text NOT IN (${wfFail}, ${wfPipeline})
  )
)`;
}

export function sqlPathoPharmTopical(alias = "p"): string {
  return `(
  ${alias}."postTemplate"::text IN ('MEDICATION_REVIEW','DISEASE_PROCESS_EXPLAINER','LAB_VALUES_GUIDE')
  OR COALESCE(${alias}."category", '') ILIKE '%pharm%'
  OR COALESCE(${alias}."category", '') ILIKE '%patho%'
  OR ${alias}."title" ILIKE '%pharmacology%'
  OR ${alias}."title" ILIKE '%pathophys%'
  OR ${alias}."title" ILIKE '%medication%'
  OR EXISTS (
    SELECT 1 FROM unnest(${alias}."tags") AS t(tag)
    WHERE lower(tag) ~ '(pharm|pathophys|patholog|pharmacolog|medication|medications|drug|dosage|antibiotic|anticoag|insulin|opio|diuretic|beta.block|ace inhibitor|nsaid|chemotherapy|vasopressor|electrolyte)'
  )
)`;
}

export function sqlPathoPharmLongTail(alias = "p"): string {
  return `(
  (length(${alias}."slug") - length(replace(${alias}."slug", '-', ''))) >= 4
  OR cardinality(regexp_split_to_array(trim(${alias}."title"), '\\s+')) >= 12
  OR length(trim(COALESCE(${alias}."targetKeyword", ''))) >= 28
)`;
}
