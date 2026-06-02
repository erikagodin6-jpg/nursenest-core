const PRESERVED_ACRONYMS = [
  "RN",
  "RPN",
  "PN",
  "NP",
  "NCLEX",
  "CAT",
  "REx-PN",
  "ECG",
  "EKG",
  "IV",
  "ICU",
  "ATI",
  "CNA",
  "CPR",
  "BLS",
  "ACLS",
  "PALS",
  "NGN",
  "OSCE",
] as const;

const LOWERCASE_CONNECTOR_WORDS = [
  "a",
  "an",
  "and",
  "as",
  "at",
  "by",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
] as const;

const PLACEHOLDER_PATTERNS = [
  /\bplaceholder\b/i,
  /\bplaceholder\s+(?:cta|button|link|label|text)\b/i,
  /^(?:cta|button|link|label)$/i,
  /^(?:primary|secondary)\s+(?:cta|button|link)$/i,
  /\bclick\s+here\b/i,
  /\blorem\s+ipsum\b/i,
  /\btodo\b/i,
  /\btbd\b/i,
  /\bcoming\s+soon\b/i,
] as const;

const CTA_CONTEXT_PATTERNS = [
  /cta/i,
  /\bbutton(?:Text|Label|Copy)?\b/i,
  /\baction(?:Text|Label|Copy)?\b/i,
  /\blinkLabel\b/i,
  /\blabel\b/i,
  /\blaunchLabel\b/i,
  /\bprimaryAction\b/i,
  /\bsecondaryAction\b/i,
  /\bpricingAction\b/i,
  /\bonboardingAction\b/i,
  /\bpaywallAction\b/i,
] as const;

export type CTACasingIssue =
  | "empty"
  | "placeholder"
  | "too-long"
  | "sentence-case"
  | "all-caps"
  | "malformed-casing";

export type CTAValidationOptions = {
  maxWords?: number;
  allowTrailingArrow?: boolean;
};

export type CTAValidationResult = {
  ok: boolean;
  normalized: string;
  issues: CTACasingIssue[];
};

export const ctaCopyPolicy = {
  preservedAcronyms: PRESERVED_ACRONYMS,
  lowercaseConnectorWords: LOWERCASE_CONNECTOR_WORDS,
  placeholderPatterns: PLACEHOLDER_PATTERNS,
} as const;

const acronymByLower = new Map(PRESERVED_ACRONYMS.map((value) => [value.toLowerCase(), value]));
const lowercaseConnectors = new Set<string>(LOWERCASE_CONNECTOR_WORDS);

function trimCTA(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function splitWordAffixes(token: string): { prefix: string; core: string; suffix: string } {
  const match = token.match(/^([^A-Za-z0-9]*)([A-Za-z0-9][A-Za-z0-9+'/-]*[A-Za-z0-9]|[A-Za-z0-9])([^A-Za-z0-9]*)$/);
  if (!match) return { prefix: "", core: token, suffix: "" };
  return { prefix: match[1] ?? "", core: match[2] ?? token, suffix: match[3] ?? "" };
}

function titleCaseCore(core: string): string {
  const acronym = acronymByLower.get(core.toLowerCase());
  if (acronym) return acronym;
  return core
    .split("-")
    .map((part) => {
      const acronymPart = acronymByLower.get(part.toLowerCase());
      if (acronymPart) return acronymPart;
      if (part.length === 0) return part;
      return `${part.slice(0, 1).toUpperCase()}${part.slice(1).toLowerCase()}`;
    })
    .join("-");
}

function normalizeToken(token: string, index: number, total: number): string {
  if (/^[^\w]+$/u.test(token)) return token;
  const { prefix, core, suffix } = splitWordAffixes(token);
  const lower = core.toLowerCase();
  const isConnector = lowercaseConnectors.has(lower);
  const shouldLowercase = isConnector && index > 0 && index < total - 1;
  const normalizedCore = shouldLowercase ? lower : titleCaseCore(core);
  return `${prefix}${normalizedCore}${suffix}`;
}

export function containsPlaceholderCTACopy(text: string): boolean {
  const value = trimCTA(text);
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));
}

export function normalizeCTAText(text: string): string {
  const value = trimCTA(text);
  if (!value) return "";
  const tokens = value.split(" ");
  return tokens.map((token, index) => normalizeToken(token, index, tokens.length)).join(" ");
}

export function isLikelyCTA(input: string, context?: string): boolean {
  const value = trimCTA(input);
  if (!value) return false;
  if (context && CTA_CONTEXT_PATTERNS.some((pattern) => pattern.test(context))) return true;
  if (value.length > 56) return false;
  if (value.split(/\s+/u).length > 7) return false;
  return /^(?:start|view|create|continue|launch|open|choose|select|save|sign|log|try|get|join|browse|explore|practice|review|resume|upgrade|subscribe|compare|begin|take|go|back)\b/i.test(value);
}

export function validateCTACasing(
  text: string,
  options: CTAValidationOptions = {},
): CTAValidationResult {
  const value = trimCTA(text);
  const issues: CTACasingIssue[] = [];
  const maxWords = options.maxWords ?? 7;
  const normalized = normalizeCTAText(value);

  if (!value) issues.push("empty");
  if (containsPlaceholderCTACopy(value)) issues.push("placeholder");
  if (value.split(/\s+/u).filter(Boolean).length > maxWords) issues.push("too-long");

  const lettersOnly = value.replace(/[^A-Za-z]/g, "");
  if (lettersOnly.length > 1 && lettersOnly === lettersOnly.toUpperCase()) {
    issues.push("all-caps");
  }

  if (value && normalized !== value) {
    const firstToken = value.split(/\s+/u)[0] ?? "";
    const firstCore = splitWordAffixes(firstToken).core;
    if (firstCore && firstCore.slice(0, 1) === firstCore.slice(0, 1).toUpperCase()) {
      issues.push("malformed-casing");
    } else {
      issues.push("sentence-case");
    }
  }

  return {
    ok: issues.length === 0,
    normalized,
    issues: [...new Set(issues)],
  };
}

export function assertValidCompactCTA(text: string, options?: CTAValidationOptions): string {
  const result = validateCTACasing(text, options);
  if (!result.ok) {
    throw new Error(
      `Invalid CTA copy "${text}" (${result.issues.join(", ")}). Suggested: "${result.normalized}"`,
    );
  }
  return text;
}
