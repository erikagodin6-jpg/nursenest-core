const TIER_PREFIXES = /^(RN|NP|RPN|LVN|NCLEX|NCLEX-RN|NCLEX-PN|REx-PN)\s+/i;
const TIER_SUFFIXES_PAREN = /\s+\((RN|NP|RPN|LVN|NCLEX|RPN\/LVN|RPN\/RN|RN Level)\)$/i;
const TIER_SUFFIXES_BARE = /\s+(RN|NP|RPN|LVN|NCLEX)$/i;
const TIER_SLUG_SUFFIX = /-(rn|np|rpn|lvn|nclex)$/i;
const TIER_INLINE_DASH = /\s+-\s+(RPN|RN|NP|LVN)\s+(Basics|Foundation|Fundamentals|Essentials|Level)/i;
const TIER_INLINE_WORD = /\b(Rpn|Rn|Np)\b(?!\s*(\/|Level|Scope|&|and|vs|Basics|Foundation|Fundamentals|Essentials))/g;

export function canonicalDisplayName(name: string): string {
  if (!name) return name;
  let result = name
    .replace(TIER_PREFIXES, "")
    .replace(TIER_SUFFIXES_PAREN, "")
    .replace(TIER_SUFFIXES_BARE, "")
    .replace(TIER_INLINE_DASH, "")
    .replace(/\s+- RPN Basics$/i, "")
    .replace(/\s+- RPN Foundation$/i, "")
    .replace(/\s+- RPN Fundamentals$/i, "")
    .replace(/\s*\(RPN\/LVN\)/gi, "")
    .replace(/\s*\(RPN\)/gi, "")
    .replace(/\s*\(RN\)/gi, "")
    .replace(/\s*\(NP\)/gi, "")
    .replace(/\bfor Practical Nurses$/i, "")
    .replace(/\bfor Practical Nurse$/i, "")
    .replace(/\bfor RPN$/i, "")
    .replace(TIER_INLINE_WORD, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (result.endsWith(":")) {
    result = result.slice(0, -1).trim();
  }
  return result;
}

export function slugToDisplayName(slug: string): string {
  if (!slug) return slug;
  const stripped = slug.replace(TIER_SLUG_SUFFIX, "");
  return stripped.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function canonicalSlug(slug: string): string {
  if (!slug) return slug;
  return slug.replace(TIER_SLUG_SUFFIX, "");
}
