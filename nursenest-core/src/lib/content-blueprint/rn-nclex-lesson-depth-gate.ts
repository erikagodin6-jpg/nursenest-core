/**
 * Optional depth check for catalog lessons on RN pathways when the slug exists in
 * `rn-nclex-master-map.json` — total plain-text words vs tier band from the map.
 */
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import {
  type RnNclexTier,
  RN_NCLEX_TIER_WORD_RANGE,
  rnNclexTierWordCountInBand,
} from "@/lib/content-blueprint/rn-nclex-content-depth-rules";

const RN_PATHWAYS = new Set(["us-rn-nclex-rn", "ca-rn-nclex-rn"]);

type RnNclexDepthRow = { slug: string; tier: RnNclexTier; canonicalTitle: string };

let bySlugCache: Map<string, RnNclexDepthRow> | null = null;

function getRnNclexDepthRowsBySlug(): Map<string, RnNclexDepthRow> {
  if (bySlugCache) return bySlugCache;

  const map = require("@/content/pathway-lessons/rn-nclex-master-map.json") as {
    lessons?: RnNclexDepthRow[];
  };

  bySlugCache = new Map((map.lessons ?? []).map((lesson) => [lesson.slug, lesson]));
  return bySlugCache;
}

export function evaluateRnNclexMapDepthForCatalogRow(input: {
  pathwayId: string;
  slug: string;
  sections: Array<{ body?: string }>;
}): Array<{ ruleId: string; severity: "warn"; message: string; slug: string }> {
  if (!RN_PATHWAYS.has(input.pathwayId)) return [];
  const row = getRnNclexDepthRowsBySlug().get(input.slug);
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
