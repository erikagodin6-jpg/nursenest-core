/**
 * Strict search-style title patterns + topic key normalization for patho/pharm long-tail registry.
 */

/** Lowercase stop words removed from keys (not from titles). */
const TOPIC_KEY_STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "from",
  "into",
  "about",
  "as",
  "by",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "does",
  "do",
  "did",
  "why",
  "how",
  "what",
  "when",
  "where",
  "which",
  "who",
  "during",
  "nurses",
  "nurse",
  "should",
  "monitor",
  "physiologically",
]);

/**
 * Lowercase, strip punctuation, collapse whitespace, remove common stop words — for duplicate detection.
 */
export function normalizeTopicKey(title: string): string {
  const words = title
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0 && !TOPIC_KEY_STOP_WORDS.has(w));
  return words.join(" ");
}

/**
 * Production titles must match one of these Google-style question templates (exact structure).
 */
export function titleMatchesStrictSearchPattern(title: string): boolean {
  const t = title.trim();
  if (t.length < 24 || t.length > 200) return false;
  const patterns: RegExp[] = [
    /^Why does .+ cause .+\?$/,
    /^How does .+ cause .+\?$/,
    /^Why does .+ lead to .+\?$/,
    /^What should nurses monitor in .+ and why\?$/,
    /^How does .+ affect .+ physiologically\?$/,
  ];
  return patterns.some((re) => re.test(t));
}

const VAGUE_WORDS = /\b(overview|introduction|basics|everything you need to know|ultimate guide|deep dive)\b/i;

/** Overly broad or non-nursing-clinical-mechanism titles to reject before generation. */
const BANNED_SUBSTRINGS: RegExp[] = [
  /\bwhy does infection cause fever\b/i,
  /\bwhy does fever cause infection\b/i,
  /\bhemoglobin carry oxygen\b/i,
  /\bwhy does oxygen bind hemoglobin\b/i,
  /\boverview of\b/i,
  /\bintroduction to\b/i,
];

export function titleHasVaguePhrasing(title: string): boolean {
  return VAGUE_WORDS.test(title);
}

export function titleMatchesBannedBroadOrNonClinicalTopic(title: string): boolean {
  return BANNED_SUBSTRINGS.some((re) => re.test(title));
}

/**
 * Reject obvious cross-system "kitchen sink" titles (unrelated mechanisms in one question).
 * Conservative: blocks " and " bridging two major systems in a single clause.
 */
export function titleSuggestsUnrelatedSystemPairing(title: string): boolean {
  const t = title.toLowerCase();
  const systems: [RegExp, string][] = [
    [/kidney|renal|dialysis|creatinine|urin|nephro/i, "renal"],
    [/brain|neuro|stroke|seizure|mening|icp\b|spinal cord/i, "neuro"],
    [/liver|hepat|biliary|cirrhotic|ascites|varice/i, "hepatic"],
    [/lung|pneum|respir|copd|asthma|hypox|ards|pleur/i, "pulm"],
    [/heart|cardiac|coronary|stemi|afib|vt\b|shock|tamponade/i, "cardio"],
  ];
  const hits = new Set<string>();
  for (const [re, tag] of systems) {
    if (re.test(t)) hits.add(tag);
  }
  /* Four or more major organ-system anchors in one title usually means an over-broad mashup. */
  return hits.size >= 4;
}
