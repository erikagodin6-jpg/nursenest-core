/**
 * Meta description guardrails for nursing/clinical SERPs — specificity without keyword stuffing.
 */

export const META_DESCRIPTION_CHAR_MIN = 90;
export const META_DESCRIPTION_CHAR_SOFT_MAX = 158;

/** Phrases that rarely help CTR on clinical education pages (audit flags). */
export const META_DESCRIPTION_WEAK_FILLER_RE =
  /\b(click here|learn more about|read more|this article|discover|find out)\b/i;

/** Overused vague openers */
export const META_DESCRIPTION_VAGUE_START_RE =
  /^(learn about|learn how to|here you will|in this (article|guide)|this page)/i;

export function normalizeMetaDescription(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export type MetaDescriptionAuditFlag =
  | "too_short"
  | "too_long"
  | "weak_filler"
  | "vague_opener"
  | "missing_clinical_anchor";

/** Nursing/clinical anchors that strengthen intent match for educational SERPs (any one helps). */
const CLINICAL_ANCHOR_RE =
  /\b(nursing|nurse|patient|bedside|clinical|interpretation|pathophysiology|assessment|prioritization|NCLEX|exam)\b/i;

export function auditMetaDescriptionQuality(description: string): MetaDescriptionAuditFlag[] {
  const d = normalizeMetaDescription(description);
  const flags: MetaDescriptionAuditFlag[] = [];
  if (d.length < META_DESCRIPTION_CHAR_MIN) flags.push("too_short");
  if (d.length > META_DESCRIPTION_CHAR_SOFT_MAX + 25) flags.push("too_long");
  if (META_DESCRIPTION_WEAK_FILLER_RE.test(d)) flags.push("weak_filler");
  if (META_DESCRIPTION_VAGUE_START_RE.test(d)) flags.push("vague_opener");
  if (!CLINICAL_ANCHOR_RE.test(d)) flags.push("missing_clinical_anchor");
  return flags;
}

export function buildClinicalMetaDescription(parts: {
  promise: string;
  nursingAngle: string;
  outcome?: string;
}): string {
  const outcome = parts.outcome?.trim();
  const core = outcome
    ? `${parts.promise} ${parts.nursingAngle} ${outcome}`
    : `${parts.promise} ${parts.nursingAngle}`;
  return normalizeMetaDescription(core);
}
