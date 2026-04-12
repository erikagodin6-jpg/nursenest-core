const PRESERVE_CASE: Readonly<Record<string, string>> = {
  rn: "RN",
  pn: "PN",
  lpn: "LPN",
  lvn: "LVN",
  rpn: "RPN",
  np: "NP",
  us: "US",
  ca: "CA",
  faq: "FAQ",
  icu: "ICU",
  nicu: "NICU",
  nclex: "NCLEX",
  "nclex-rn": "NCLEX-RN",
  "nclex-pn": "NCLEX-PN",
  "rex-pn": "REx-PN",
  "med-surg": "Med-Surg",
  "sign-in": "Sign-In",
  applynest: "ApplyNest",
  nursenest: "NurseNest",
};

const SMALL_WORDS = new Set(["and", "or", "of", "the", "a", "an", "to", "for", "in", "on", "at", "by"]);
const WARNED = new Set<string>();

function isEnglishLocale(locale?: string): boolean {
  const normalized = (locale ?? "en").toLowerCase();
  return normalized === "en" || normalized.startsWith("en-") || normalized.startsWith("en_");
}

function titleCaseToken(token: string): string {
  if (!token) return token;
  const normalized = token.toLowerCase();
  const preserved = PRESERVE_CASE[normalized];
  if (preserved) return preserved;
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function titleCaseWord(word: string, index: number, total: number): string {
  const match = /^([("']*)(.*?)([)"'.,:;!?]*)$/.exec(word);
  if (!match) return word;
  const [, leading, core, trailing] = match;
  if (!core) return word;

  const normalizedCore = core.toLowerCase();
  if (index > 0 && index < total - 1 && SMALL_WORDS.has(normalizedCore)) {
    return `${leading}${normalizedCore}${trailing}`;
  }

  const cased = core
    .split(/([\/\-·])/)
    .map((part) => (part === "/" || part === "-" || part === "·" ? part : titleCaseToken(part)))
    .join("");
  return `${leading}${cased}${trailing}`;
}

export function toTitleCase(value: string, locale?: string): string {
  if (!value) return value;
  const compact = value.replace(/\s+/g, " ").trim();
  if (!isEnglishLocale(locale)) return compact;
  const words = compact.split(" ");
  return words.map((word, i) => titleCaseWord(word, i, words.length)).join(" ");
}

export function isTitleCase(value: string, locale?: string): boolean {
  if (!value) return true;
  if (!isEnglishLocale(locale)) return true;
  return toTitleCase(value, locale) === value.replace(/\s+/g, " ").trim();
}

export function formatNavLabel(value: string, options?: { locale?: string; context?: string }): string {
  const locale = options?.locale;
  const normalized = toTitleCase(value, locale);
  if (process.env.NODE_ENV !== "production" && isEnglishLocale(locale) && !isTitleCase(value, locale)) {
    const context = options?.context ?? "unknown";
    const key = `${context}::${value}`;
    if (!WARNED.has(key)) {
      WARNED.add(key);
      console.warn(`Invalid casing detected in nav label: '${value}' (context: ${context})`);
    }
  }
  return normalized;
}
