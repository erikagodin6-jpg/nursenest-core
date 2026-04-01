import { publicCdnUrlForObjectKey } from "@/lib/education-images/cdn-url";
import { getInventoryKeys, listInventoryBasenames } from "@/lib/education-images/inventory";
import {
  basenameWithoutExtension,
  normalizeConceptToken,
  tokenizeForConceptMatch,
} from "@/lib/education-images/normalize-concept-token";

export type ConceptImageMatchTier = "exact_basename" | "keyword_score" | "body_system" | "none";

export type ConceptImageMatchResult = {
  url: string | null;
  objectKey: string | null;
  alt: string;
  tier: ConceptImageMatchTier;
  score: number;
  /** Dev-only diagnostics when `process.env.NODE_ENV === "development"`. */
  debug?: { candidates: string[]; bestBasename?: string; reason: string };
};

export type ConceptImageQuery = {
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
  tags?: string[] | null;
  title?: string | null;
  slug?: string | null;
  stemSnippet?: string | null;
};

function scoreAgainstBasename(queryTokens: Set<string>, basename: string): number {
  const bt = tokenizeForConceptMatch(basename.replace(/-/g, " "));
  if (bt.length === 0) return 0;
  let score = 0;
  for (const t of bt) {
    if (queryTokens.has(t)) score += 3;
    for (const q of queryTokens) {
      if (t.includes(q) || q.includes(t)) score += 1;
    }
  }
  return score;
}

function pickPreferredKeyForBasename(basename: string): string | null {
  const keys = getInventoryKeys();
  const preferred = [".webp", ".png", ".jpg", ".jpeg"];
  for (const ext of preferred) {
    const candidate = `uploads/images/${basename}${ext}`;
    if (keys.includes(candidate)) return candidate;
  }
  const hit = keys.find((k) => basenameWithoutExtension(k) === basename);
  return hit ?? null;
}

/**
 * Match storage education images by filename / concept tokens.
 * Prefers `uploads/images/{concept}.webp` then `.png` when present in inventory.
 */
export function matchConceptImage(query: ConceptImageQuery): ConceptImageMatchResult {
  const candidates: string[] = [
    query.title,
    query.slug?.replace(/-/g, " "),
    query.topic,
    query.subtopic,
    query.bodySystem,
    ...(query.tags ?? []),
    query.stemSnippet,
  ]
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((s) => normalizeConceptToken(s));

  const merged = candidates.join(" ");
  const queryTokens = new Set(tokenizeForConceptMatch(merged));

  if (queryTokens.size === 0) {
    return {
      url: null,
      objectKey: null,
      alt: "Clinical reference",
      tier: "none",
      score: 0,
      ...(process.env.NODE_ENV === "development"
        ? { debug: { candidates: [], reason: "no_query_tokens" } }
        : {}),
    };
  }

  const basenames = listInventoryBasenames();
  let best: { basename: string; score: number } | null = null;
  for (const b of basenames) {
    const sc = scoreAgainstBasename(queryTokens, b);
    if (!best || sc > best.score) best = { basename: b, score: sc };
  }

  if (best && best.score >= 6) {
    const key = pickPreferredKeyForBasename(best.basename);
    if (key) {
      return {
        url: publicCdnUrlForObjectKey(key),
        objectKey: key,
        alt: best.basename.replace(/-/g, " "),
        tier: "keyword_score",
        score: best.score,
        ...(process.env.NODE_ENV === "development"
          ? {
              debug: {
                candidates,
                bestBasename: best.basename,
                reason: `keyword_score=${best.score}`,
              },
            }
          : {}),
      };
    }
  }

  /** Body-system fallback: weak match on cardiovascular, respiratory, etc. */
  const body = normalizeConceptToken(query.bodySystem ?? "");
  if (body) {
    const bodyTokens = tokenizeForConceptMatch(body);
    for (const b of basenames) {
      const joined = b.replace(/-/g, " ");
      for (const bt of bodyTokens) {
        if (joined.includes(bt) || bt.includes(joined)) {
          const key = pickPreferredKeyForBasename(b);
          if (key) {
            return {
              url: publicCdnUrlForObjectKey(key),
              objectKey: key,
              alt: `${b.replace(/-/g, " ")} (related concept)`,
              tier: "body_system",
              score: 2,
              ...(process.env.NODE_ENV === "development"
                ? { debug: { candidates, bestBasename: b, reason: "body_system_fallback" } }
                : {}),
            };
          }
        }
      }
    }
  }

  return {
    url: null,
    objectKey: null,
    alt: "Clinical reference",
    tier: "none",
    score: 0,
    ...(process.env.NODE_ENV === "development"
      ? {
          debug: {
            candidates,
            bestBasename: best?.basename,
            reason: best ? `score_too_low=${best.score}` : "no_inventory",
          },
        }
      : {}),
  };
}
