/**
 * Central rules for **authored** marketing message leaves and **runtime** resolution.
 *
 * - **Missing keys**: {@link missingMarketingCopyFallback} is always empty — public UI must use
 *   `getRequiredPublicMessage` (see `marketing-i18n-core.ts`) / build gates for required copy, never humanized key tails.
 * - **Mirror stubs**: template values that echo the key (e.g. `pages.foo.title` → `Title`, `foo.title2` → `Title`,
 *   `report.descriptionLabel` → `Description`).
 * - **Shouty template tokens**: explicit `LABEL`, `TITLE`, … — not generic ALL_CAPS (avoids blocking real acronyms).
 */

const MIRROR_ROOTS = ["title", "description", "label", "question", "answer", "text"] as const;
const MIRROR_ROOT_SET = new Set<string>(MIRROR_ROOTS);

/**
 * Map last path segment → mirror root if this key is meant to carry title-/question-style copy.
 * Handles `title2`, `descriptionLabel`, `questionCount` (only when value equals the root word).
 */
export function mirrorRootFromMessageKey(messageKey: string): string | null {
  const segRaw = messageKey.includes(".") ? (messageKey.split(".").pop() ?? messageKey) : messageKey;
  const seg = segRaw.toLowerCase().replace(/\d+$/u, "");
  if (MIRROR_ROOT_SET.has(seg)) return seg;
  for (const root of MIRROR_ROOTS) {
    if (seg.startsWith(root) && seg.length > root.length) return root;
  }
  return null;
}

/**
 * `pages.foo.title` → `Title`, `pages.foo.title2` → `Title`, `report.descriptionLabel` → `Description`.
 */
export function isKeyContentMirrorStub(messageKey: string, value: string): boolean {
  const v = value.trim();
  if (!v || !messageKey) return false;
  const root = mirrorRootFromMessageKey(messageKey);
  if (!root) return false;
  return v.toLowerCase() === root;
}

/** Whole-string template tokens (case-insensitive) that are never valid as final copy. */
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
    "subtitle",
    "cta",
    "button",
    "value1",
    "value2",
    "value3",
    "included1",
    "copy",
    "string",
  ].map((s) => s.toLowerCase()),
);

/** Known shouty CMS/Figma tokens — explicit list only (not “any ALL_CAPS”). */
const FORBIDDEN_SHOUTY_TEMPLATE_TOKENS = new Set([
  "LABEL",
  "TITLE",
  "DESCRIPTION",
  "QUESTION",
  "ANSWER",
  "TEXT",
  "PLACEHOLDER",
  "KICKER",
  "SUBTITLE",
  "HEADING",
  "EYEBROW",
  "INTRO",
  "LEAD",
  "CTA",
  "BUTTON",
  "STUB",
  "TODO",
  "TBD",
]);

export function isForbiddenShoutyTemplateToken(value: string): boolean {
  const t = value.trim();
  if (!/^[A-Z0-9_]{3,40}$/u.test(t)) return false;
  return FORBIDDEN_SHOUTY_TEMPLATE_TOKENS.has(t);
}

/** Case-insensitive substrings that must not appear anywhere in a public marketing string value. */
export const MARKETING_FORBIDDEN_VALUE_SUBSTRINGS = [
  "lorem ipsum",
  "<<stub",
  "tbd —",
  "tbd--",
  "{{missing",
  "[missing:",
  "content unavailable right now. please refresh the page.",
] as const;

const PUBLIC_OUTPUT_GUARD_WHOLE_CI = new Set<string>([
  ...MARKETING_FORBIDDEN_WHOLE_VALUE_CI,
  "title",
  "description",
  "question",
  "answer",
  "text",
]);

export function isForbiddenAuthoredMarketingLeafValue(value: string): boolean {
  const t = value.trim();
  if (!t) return false;
  if (MARKETING_FORBIDDEN_WHOLE_VALUE_CI.has(t.toLowerCase())) return true;
  if (isForbiddenShoutyTemplateToken(t)) return true;
  const lower = t.toLowerCase();
  for (const sub of MARKETING_FORBIDDEN_VALUE_SUBSTRINGS) {
    if (lower.includes(sub.toLowerCase())) return true;
  }
  return false;
}

/**
 * True when the **whole** trimmed value is a known design-system / Storybook singleton that must
 * never ship as authored copy (any casing). Used by {@link normalizeResolvedMarketingLeaf}.
 */
export function isForbiddenPublicSingletonSurfaceCopy(value: string): boolean {
  const t = value.trim();
  if (!t) return false;
  return PUBLIC_OUTPUT_GUARD_WHOLE_CI.has(t.toLowerCase()) || isForbiddenShoutyTemplateToken(t);
}

export function isForbiddenPublicMarketingEntry(messageKey: string, value: string): boolean {
  return (
    isForbiddenAuthoredMarketingLeafValue(value) ||
    isKeyContentMirrorStub(messageKey, value) ||
    isForbiddenPublicSingletonSurfaceCopy(value)
  );
}

/** Dev-only humanized tail — mirrors `scripts/validate-marketing-production-surface.mjs`. */
export function humanizedMarketingKeyFallback(key: string): string {
  const tail = key.includes(".") ? (key.split(".").pop() ?? key) : key;
  const words = tail.replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").trim();
  if (!words) return "NurseNest";
  const s = words.charAt(0).toUpperCase() + words.slice(1);
  return s.length > 80 ? `${s.slice(0, 77)}…` : s;
}

/**
 * Deliberately always empty: humanized key tails (`*.title` → `Title`) leaked to public pages in dev
 * and confused deploy debugging. Use {@link humanizedMarketingKeyFallback} only in offline tooling,
 * and {@link getRequiredPublicMessage} / CI for required strings.
 */
export function missingMarketingCopyFallback(_key: string): string {
  return "";
}

function logPlaceholderScrub(debugCtx: string, sample: string): void {
  const payload = JSON.stringify({
    scope: "i18n",
    event: "marketing_placeholder_scrubbed",
    origin: debugCtx.slice(0, 200),
    sample: sample.slice(0, 80),
  });
  if (process.env.NODE_ENV !== "production") {
    console.error(`[marketing-i18n] ${payload}`);
  } else {
    console.error(`[nursenest-core] ${payload}`);
  }
}

export function assertNoPublicPlaceholderCopy(s: string, debugCtx: string): string {
  const t = s.trim();
  if (!t) return s;
  const lower = t.toLowerCase();
  for (const sub of MARKETING_FORBIDDEN_VALUE_SUBSTRINGS) {
    if (lower.includes(sub.toLowerCase())) {
      logPlaceholderScrub(debugCtx, t);
      if (process.env.NODE_ENV === "production") return "";
      throw new Error(`[marketing] forbidden substring in ${debugCtx}: ${sub}`);
    }
  }
  if (PUBLIC_OUTPUT_GUARD_WHOLE_CI.has(lower) || isForbiddenShoutyTemplateToken(t)) {
    logPlaceholderScrub(debugCtx, t);
    if (process.env.NODE_ENV === "production") return "";
    throw new Error(`[marketing] forbidden placeholder singleton in ${debugCtx}: "${t}"`);
  }
  return s;
}

/** Alias for {@link assertNoPublicPlaceholderCopy} — use at public/marketing text boundaries. */
export const assertNoPlaceholder = assertNoPublicPlaceholderCopy;

export function normalizeResolvedMarketingLeaf(raw: string | undefined, messageKey?: string): string | undefined {
  if (raw === undefined) return undefined;
  const t = raw.trim();
  if (!t) return undefined;
  if (messageKey && isKeyContentMirrorStub(messageKey, raw)) return undefined;
  if (isForbiddenAuthoredMarketingLeafValue(t)) return undefined;
  if (isForbiddenPublicSingletonSurfaceCopy(t)) return undefined;
  return raw;
}

export type FlatMessageScanHit = { file: string; key: string; value: string; reason: string };

export function scanFlatMarketingMessagesForForbiddenValues(
  fileLabel: string,
  messages: Record<string, unknown>,
): FlatMessageScanHit[] {
  const hits: FlatMessageScanHit[] = [];
  for (const [key, val] of Object.entries(messages)) {
    if (typeof val !== "string") continue;
    const t = val.trim();
    if (!t) continue;
    if (isForbiddenPublicMarketingEntry(key, t)) {
      const reason = isKeyContentMirrorStub(key, t)
        ? "key mirror stub (value matches key segment)"
        : "forbidden placeholder or stub value";
      hits.push({ file: fileLabel, key, value: t.slice(0, 120), reason });
    }
  }
  return hits;
}
