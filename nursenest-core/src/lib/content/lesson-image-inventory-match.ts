import {
  basenameWithoutExtension,
  inventoryBasenameCandidatesFromLabel,
  tokenizeForConceptMatch,
} from "@/lib/education-images/normalize-concept-token";

/** Extensions tried in preference order (smallest / best first). */
export const LESSON_IMAGE_PREFERRED_EXTENSIONS = [
  ".avif",
  ".webp",
  ".png",
  ".jpg",
  ".jpeg",
] as const;

/** Preferred Spaces image prefixes; root ("") catches bucket root objects e.g. `pulmonary-embolism.webp`. */
export const LESSON_IMAGE_PREFIXES = [
  "uploads/images/",
  "uploads/lesson-images/",
  "",
] as const;

/** Strip pathway/exam prefixes from lesson slugs (`us-rn-pulmonary-embolism` → `pulmonary-embolism`). */
const PATHWAY_SLUG_PREFIX =
  /^(?:(?:us|ca)-(?:rn|rpn|np)-(?:nclex-rn|rex-pn|fnp|nclex|rex-pn|fnp)-|(?:us|ca)-(?:rn|rpn|np)-)/i;

/**
 * Normalize a lesson title or slug to the canonical inventory basename form.
 * Example: "Pulmonary Embolism" → `pulmonary-embolism`
 */
export function normalizeLessonImageBasename(label: string): string {
  const candidates = inventoryBasenameCandidatesFromLabel(label);
  if (candidates.length > 0) return candidates[0]!;
  return label
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function stripPathwayLessonSlugPrefix(slug: string): string {
  let s = slug.trim().toLowerCase();
  for (let i = 0; i < 4; i++) {
    const next = s.replace(PATHWAY_SLUG_PREFIX, "");
    if (next === s) break;
    s = next;
  }
  return s.replace(/^-+|-+$/g, "");
}

/** Simple plural → singular for inventory basename matching. */
export function singularizeLessonImageBasename(basename: string): string {
  if (basename.endsWith("ies") && basename.length > 4) {
    return `${basename.slice(0, -3)}y`;
  }
  if (
    basename.endsWith("s") &&
    basename.length > 4 &&
    !basename.endsWith("ss") &&
    !basename.endsWith("us")
  ) {
    return basename.slice(0, -1);
  }
  return basename;
}

export function collectLessonImageBasenameCandidates(query: {
  slug: string;
  title?: string | null;
  topicSlug?: string | null;
}): string[] {
  const seen = new Set<string>();
  const addLabel = (label: string) => {
    for (const c of inventoryBasenameCandidatesFromLabel(label)) {
      seen.add(c);
      const singular = singularizeLessonImageBasename(c);
      if (singular !== c) seen.add(singular);
    }
    const direct = normalizeLessonImageBasename(label);
    if (direct.length >= 3) seen.add(direct);
  };

  addLabel(query.slug);
  const stripped = stripPathwayLessonSlugPrefix(query.slug);
  if (stripped.length >= 3 && stripped !== query.slug.trim().toLowerCase()) {
    addLabel(stripped);
  }
  if (query.title?.trim()) addLabel(query.title);
  if (query.topicSlug?.trim()) addLabel(query.topicSlug);

  return [...seen].filter((b) => b.length >= 3);
}

function basenameSimilarityScore(candidate: string, inventoryBasename: string): number {
  if (candidate === inventoryBasename) return 1;
  if (
    candidate.startsWith(`${inventoryBasename}-`) ||
    inventoryBasename.startsWith(`${candidate}-`)
  ) {
    return 0.92;
  }
  const aTokens = tokenizeForConceptMatch(candidate.replace(/-/g, " "));
  const bTokens = tokenizeForConceptMatch(inventoryBasename.replace(/-/g, " "));
  if (aTokens.length === 0 || bTokens.length === 0) return 0;
  const bSet = new Set(bTokens);
  let overlap = 0;
  for (const t of aTokens) {
    if (bSet.has(t)) overlap++;
  }
  const denom = Math.max(aTokens.length, bTokens.length);
  return overlap / denom;
}

/**
 * Locate the best object key for a basename across prefixes and extensions.
 */
export function findInventoryObjectKeyForBasename(
  basename: string,
  inventoryKeys: readonly string[],
): string | null {
  const base = basename.trim().toLowerCase();
  if (!base) return null;
  for (const ext of LESSON_IMAGE_PREFERRED_EXTENSIONS) {
    for (const prefix of LESSON_IMAGE_PREFIXES) {
      const candidate = `${prefix}${base}${ext}`;
      if (inventoryKeys.includes(candidate)) return candidate;
    }
  }
  return null;
}

export type InventoryMatchResult = {
  objectKey: string;
  matchedBasename: string;
  /** True when match was not an exact basename hit (fuzzy token overlap). */
  fuzzy: boolean;
};

const FUZZY_MIN_SCORE = 0.72;

/**
 * Resolve an inventory object key from slug/title/topic candidates, then fuzzy inventory basenames.
 */
export function resolveInventoryLessonImageKey(
  query: {
    slug: string;
    title?: string | null;
    topicSlug?: string | null;
  },
  inventoryKeys: readonly string[],
): InventoryMatchResult | null {
  const candidates = collectLessonImageBasenameCandidates(query);

  for (const basename of candidates) {
    const key = findInventoryObjectKeyForBasename(basename, inventoryKeys);
    if (key) return { objectKey: key, matchedBasename: basename, fuzzy: false };
  }

  const inventoryBasenames = basenamesFromInventoryKeys(inventoryKeys);
  if (inventoryBasenames.length === 0) return null;

  let best: { basename: string; score: number } | null = null;
  for (const cand of candidates) {
    for (const inv of inventoryBasenames) {
      if (cand === inv) continue;
      const score = basenameSimilarityScore(cand, inv);
      if (score < FUZZY_MIN_SCORE) continue;
      if (!best || score > best.score) {
        best = { basename: inv, score };
      }
    }
  }

  if (!best) return null;
  const key = findInventoryObjectKeyForBasename(best.basename, inventoryKeys);
  if (!key) return null;
  return { objectKey: key, matchedBasename: best.basename, fuzzy: true };
}

/** Build CDN path segment for diagnostics (basename only, no extension). */
export function lessonImageBasenameFromObjectKey(objectKey: string): string {
  return basenameWithoutExtension(objectKey);
}

/** Unique basenames from an explicit key list (used by resolver + audit tests). */
export function basenamesFromInventoryKeys(inventoryKeys: readonly string[]): string[] {
  const seen = new Set<string>();
  for (const key of inventoryKeys) {
    seen.add(basenameWithoutExtension(key));
  }
  return [...seen];
}
