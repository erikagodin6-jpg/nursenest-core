const PLACEHOLDER_PREFIX_RE = /^\s*placeholder\b/i;
const KEY_LIKE_PLACEHOLDER_RE = /^\s*pages\.signup\.placeholder/i;

export function safeSignupFieldCopy(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  if (PLACEHOLDER_PREFIX_RE.test(trimmed) || KEY_LIKE_PLACEHOLDER_RE.test(trimmed)) return fallback;
  return trimmed;
}
