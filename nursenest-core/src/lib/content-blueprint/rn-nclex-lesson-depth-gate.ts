/**
 * Optional depth check for catalog lessons on RN pathways when the slug exists in
 * `rn-nclex-master-map.json` — total plain-text words vs tier band from the map.
 */
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import type { ExpansionQualityViolation } from "@/lib/content-quality/lesson-expansion-quality-gate";
import map from "@/content/pathway-lessons/rn-nclex-master-map.json";
import {
  type RnNclexTier,
  RN_NCLEX_TIER_WORD_RANGE,
  rnNclexTierWordCountInBand,
} from "@/lib/content-blueprint/rn-nclex-content-depth-rules";

const RN_PATHWAYS = new Set(["us-rn-nclex-rn", "ca-rn-nclex-rn"]);

const bySlug = new Map(
  (map.lessons as Array<{ slug: string; tier: RnNclexTier; canonicalTitle: string }>).map((l) => [l.slug, l]),
);

export function evaluateRnNclexMapDepthForCatalogRow(input: {
  pathwayId: string;
  slug: string;
  sections: Array<{ body?: string }>;
}): ExpansionQualityViolation[] {
  if (!RN_PATHWAYS.has(input.pathwayId)) return [];
  const row = bySlug.get(input.slug);
  if (!row) return [];

  let total = 0;
  for (const s of input.sections) {
    total += countWords(stripToPlainText(typeof s.body === "string" ? s.body : ""));
  }

  if (rnNclexTierWordCountInBand(row.tier, total)) return [];

  const [lo, hi] = RN_NCLEX_TIER_WORD_RANGE[row.tier];
  return [
    {
      ruleId: "RN-DEPTH",
      severity: "warn",
      slug: input.slug,
      message: `RN master map tier ${row.tier} (“${row.canonicalTitle}”) targets ${lo}–${hi} words (full lesson body); current total ~${total}. Adjust depth, structure, or re-tier the map entry.`,
    },
  ];
}
