/**
 * Hardened marketing i18n validation + normalization
 *
 * Guarantees:
 * - NEVER silently returns empty strings in production
 * - NEVER hides placeholder issues
 * - ALWAYS fails loudly OR provides safe fallback
 */

const MIRROR_ROOTS = ["title", "description", "label", "question", "answer", "text", "body", "link", "lead", "kicker"] as const;
const MIRROR_ROOT_SET = new Set<string>(MIRROR_ROOTS);

export function mirrorRootFromMessageKey(messageKey: string): string | null {
  const segRaw = messageKey.includes(".")
    ? (messageKey.split(".").pop() ?? messageKey)
    : messageKey;

  const seg = segRaw.toLowerCase().replace(/\d+$/u, "");

  if (MIRROR_ROOT_SET.has(seg)) return seg;

  for (const root of MIRROR_ROOTS) {
    if (seg.startsWith(root) && seg.length > root.length) return root;
  }

  return null;
}

export function isKeyContentMirrorStub(messageKey: string, value: string): boolean {
  const v = value.trim();
  if (!v || !messageKey) return false;

  const root = mirrorRootFromMessageKey(messageKey);
  if (!root) return false;

  return v.toLowerCase() === root;
}

export const MARKETING_FORBIDDEN_WHOLE_VALUE_CI = new Set(
  [
    "label",
    "placeholder",
    "todo",
    "tbd",
    "stub",
    "lorem",
    "heading",
    "eyebrow",
    "intro",
    "lead",
    "kicker",
    "title",
    "body",
    "link",
    "subtitle",
    "cta",
    "button",
    "copy",
    "string",
  ].map((s) => s.toLowerCase()),
);

const FORBIDDEN_SHOUTY_TEMPLATE_TOKENS = new Set([
  "LABEL",
  "KICKER",
  "TITLE",
  "DESCRIPTION",
  "LEAD",
  "QUESTION",
  "ANSWER",
  "BODY",
  "LINK",
  "TEXT",
  "PLACEHOLDER",
  "CTA",
  "BUTTON",
  "STUB",
  "TODO",
  "TBD",
]);

export function isForbiddenShoutyTemplateToken(value: string): boolean {
  const t = value.trim();
  return /^[A-Z0-9_]{3,40}$/u.test(t) && FORBIDDEN_SHOUTY_TEMPLATE_TOKENS.has(t);
}

export function isForbiddenAuthoredMarketingLeafValue(value: string): boolean {
  const t = value.trim();
  if (!t) return false;
  return MARKETING_FORBIDDEN_WHOLE_VALUE_CI.has(t.toLowerCase()) || isForbiddenShoutyTemplateToken(t);
}

export const MARKETING_FORBIDDEN_VALUE_SUBSTRINGS = [
  "lorem ipsum",
  "<<stub",
  "tbd —",
  "{{missing",
  "[missing:",
] as const;

function logViolation(debugCtx: string, value: string) {
  console.error(
    `[marketing-i18n] violation: ${JSON.stringify({
      ctx: debugCtx,
      sample: value.slice(0, 80),
    })}`,
  );
}

/**
 * Production scrubs invalid placeholder leaves to empty so callers with safe fallbacks can render
 * human copy; development throws loudly so missing keys stay visible during local work.
 */
export function assertNoPublicPlaceholderCopy(s: string, debugCtx: string): string {
  const t = s.trim();
  if (!t) return s;

  const lower = t.toLowerCase();

  for (const sub of MARKETING_FORBIDDEN_VALUE_SUBSTRINGS) {
    if (lower.includes(sub)) {
      logViolation(debugCtx, t);
      if (process.env.NODE_ENV === "production") return "";
      throw new Error(`[marketing] forbidden substring "${sub}" in ${debugCtx}`);
    }
  }

  if (
    MARKETING_FORBIDDEN_WHOLE_VALUE_CI.has(lower) ||
    isForbiddenShoutyTemplateToken(t)
  ) {
    logViolation(debugCtx, t);
    if (process.env.NODE_ENV === "production") return "";
    throw new Error(`[marketing] forbidden placeholder "${t}" in ${debugCtx}`);
  }

  return s;
}

export const assertNoPlaceholder = assertNoPublicPlaceholderCopy;

/**
 * NEVER return "" silently.
 * Either:
 * - return valid string
 * - OR return undefined (handled upstream)
 */
export function normalizeResolvedMarketingLeaf(
  raw: string | undefined,
  messageKey?: string,
): string | undefined {
  if (raw === undefined) return undefined;

  const t = raw.trim();
  if (!t) return undefined;

  if (messageKey && isKeyContentMirrorStub(messageKey, raw)) return undefined;

  if (isForbiddenAuthoredMarketingLeafValue(t)) return undefined;

  for (const sub of MARKETING_FORBIDDEN_VALUE_SUBSTRINGS) {
    if (t.toLowerCase().includes(sub)) return undefined;
  }

  return raw;
}

/**
 * Last-resort visible string when a key is missing or invalid after `formatMarketingMessage`.
 * Prefer adding real copy to `tools/i18n/marketing/marketing-en.json` (then `npm run i18n:normalize-marketing`)
 * so learner surfaces never depend on this heuristic.
 */
export function humanizedMarketingKeyFallback(key: string): string {
  const tail = key.includes(".") ? (key.split(".").pop() ?? key) : key;
  const words = tail.replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").trim();

  if (!words) return "NurseNest";

  const s = words.charAt(0).toUpperCase() + words.slice(1);
  return s.length > 80 ? `${s.slice(0, 77)}…` : s;
}

/**
 * Return an empty leaf and let public surfaces choose an explicit safe fallback.
 */
export function missingMarketingCopyFallback(key: string): string {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[marketing] missing required marketing copy: ${key}`);
  }
  return "";
}

/**
 * Strong scan: used in CI / validation scripts
 */
export type FlatMessageScanHit = {
  file: string;
  key: string;
  value: string;
  reason: string;
};

/**
 * Full authored-marketing leaf policy (mirror stubs + single-word placeholders) applies to
 * the flat `pages.*` table shipped as `public/i18n/en/pages.json`. Chrome shards (`components`,
 * `learner`, etc.) may legitimately use short labels like "Title" for form fields — those are
 * still guarded in runtime via {@link normalizeResolvedMarketingLeaf} where needed, but must
 * not fail the global marketing bundle scan.
 */
export function marketingShardUsesStrictPublicPageLeafPolicy(fileLabel: string): boolean {
  return fileLabel === "en/pages.json";
}

export function scanFlatMarketingMessagesForForbiddenValues(
  fileLabel: string,
  messages: Record<string, unknown>,
): FlatMessageScanHit[] {
  const hits: FlatMessageScanHit[] = [];
  const strictLeafPolicy = marketingShardUsesStrictPublicPageLeafPolicy(fileLabel);

  for (const [key, val] of Object.entries(messages)) {
    if (typeof val !== "string") continue;

    const t = val.trim();
    if (!t) continue;

    let substringHit: string | null = null;
    for (const sub of MARKETING_FORBIDDEN_VALUE_SUBSTRINGS) {
      if (t.toLowerCase().includes(sub.toLowerCase())) {
        substringHit = sub;
        break;
      }
    }
    if (substringHit) {
      hits.push({
        file: fileLabel,
        key,
        value: t.slice(0, 120),
        reason: `forbidden substring "${substringHit}"`,
      });
      continue;
    }

    if (isForbiddenShoutyTemplateToken(t)) {
      hits.push({
        file: fileLabel,
        key,
        value: t.slice(0, 120),
        reason: "invalid marketing copy",
      });
      continue;
    }

    if (
      strictLeafPolicy &&
      (isKeyContentMirrorStub(key, t) || MARKETING_FORBIDDEN_WHOLE_VALUE_CI.has(t.toLowerCase()))
    ) {
      hits.push({
        file: fileLabel,
        key,
        value: t.slice(0, 120),
        reason: "invalid marketing copy",
      });
    }
  }

  return hits;
}
