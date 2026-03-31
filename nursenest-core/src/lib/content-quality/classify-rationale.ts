import type { ContentQualityTier } from "@/lib/content-quality/standards";
import {
  RATIONALE_MIN_WORDS,
  RATIONALE_PREFERRED_MAX_WORDS,
  RATIONALE_STRONG_MIN_WORDS,
} from "@/lib/content-quality/standards";
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";

/** Concatenate all explanatory fields for overall rationale depth (no fake content). */
export function totalRationaleWordCount(parts: Array<string | null | undefined>): number {
  const merged = parts.map((p) => stripToPlainText(p)).filter(Boolean).join("\n\n");
  return countWords(merged);
}

export type RationaleQualityResult = {
  tier: ContentQualityTier;
  wordCount: number;
  /** True when some text exists but is below premium target — show honest enrichment notice. */
  showEnrichmentNotice: boolean;
};

export function classifyRationaleWordCount(wordCount: number): RationaleQualityResult {
  if (wordCount <= 0) {
    return { tier: "missing", wordCount: 0, showEnrichmentNotice: false };
  }
  if (wordCount < RATIONALE_MIN_WORDS) {
    return { tier: "thin", wordCount, showEnrichmentNotice: true };
  }
  if (wordCount < RATIONALE_STRONG_MIN_WORDS) {
    return { tier: "acceptable", wordCount, showEnrichmentNotice: false };
  }
  return { tier: "strong", wordCount, showEnrichmentNotice: false };
}

/** @internal — for reporting only */
export function rationaleWithinPreferredBand(wordCount: number): boolean {
  return wordCount >= RATIONALE_STRONG_MIN_WORDS && wordCount <= RATIONALE_PREFERRED_MAX_WORDS;
}
