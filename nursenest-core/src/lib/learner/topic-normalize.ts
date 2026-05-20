/**
 * Canonical topic keys for UserTopicStat and weak-area deduplication.
 * Conservative: collapse formatting noise (whitespace, slash variants, case) without semantic synonym merging.
 */

/** Must match Prisma UserTopicStat.topic @db.VarChar(80) */
export const MAX_TOPIC_KEY_LENGTH = 80;

/** Suffix length when truncating: "~" + 4 hex chars from stable hash */
const TRUNC_HASH_LEN = 5;

function stableHash16(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 4);
}

/**
 * Maps raw topic strings to one stable key (≤ {@link MAX_TOPIC_KEY_LENGTH}).
 * - NFKC unicode normalization
 * - Trims; collapses internal whitespace
 * - Normalizes slash/backslash clusters to spaced " / "
 * - Strips redundant punctuation around separators
 * - Lowercase for stable identity (display via {@link formatTopicLabelForDisplay})
 */
export function normalizeTopicKey(raw: string | null | undefined): string {
  if (raw == null) return "general";
  let s = String(raw).normalize("NFKC");
  s = s.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF]/g, " ");
  s = s.replace(/\s*[/\\]+\s*/g, " / ");
  s = s.replace(/[,;]+/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  if (s.length === 0) return "general";
  s = s.toLowerCase();
  if (s.length <= MAX_TOPIC_KEY_LENGTH) return s;
  const h = stableHash16(s);
  const keep = MAX_TOPIC_KEY_LENGTH - TRUNC_HASH_LEN;
  return `${s.slice(0, keep)}~${h}`;
}

/**
 * Human-readable label from a canonical key (title-like casing for Latin text).
 */
export function formatTopicLabelForDisplay(canonicalKey: string): string {
  if (!canonicalKey || canonicalKey === "general") return "General";
  const base = canonicalKey.includes("~") ? canonicalKey.split("~")[0] ?? canonicalKey : canonicalKey;
  return base
    .split(" / ")
    .map((part) =>
      part
        .split(" ")
        .filter(Boolean)
        .map((w) => (w.length ? w[0]!.toUpperCase() + w.slice(1) : w))
        .join(" "),
    )
    .join(" / ");
}

/** @deprecated Use normalizeTopicKey — kept as alias for call sites. */
export function normalizeTopicLabel(topic: string | null | undefined): string {
  return normalizeTopicKey(topic);
}
