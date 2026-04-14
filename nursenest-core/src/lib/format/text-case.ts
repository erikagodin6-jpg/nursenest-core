const PRESERVE_CASE: Readonly<Record<string, string>> = {
  rn: "RN",
  pn: "PN",
  lpn: "LPN",
  lvn: "LVN",
  rpn: "RPN",
  np: "NP",
  nclex: "NCLEX",
  "nclex-rn": "NCLEX-RN",
  "nclex-pn": "NCLEX-PN",
  "rex-pn": "REX-PN",
  cat: "CAT",
  cta: "CTA",
  us: "US",
  ca: "CA",
  agpcnp: "AGPCNP",
  pmhnp: "PMHNP",
  fnp: "FNP",
  cnple: "CNPLE",
  ai: "AI",
  ngn: "NGN",
  teas: "TEAS",
  abg: "ABG",
  ecg: "ECG",
  copd: "COPD",
  mi: "MI",
  stemi: "STEMI",
  nstemi: "NSTEMI",
  cbc: "CBC",
  bmp: "BMP",
  bnp: "BNP",
  hiv: "HIV",
  htn: "HTN",
  dka: "DKA",
  siadh: "SIADH",
  iv: "IV",
  icu: "ICU",
  nicu: "NICU",
  faq: "FAQ",
  nursenest: "NurseNest",
  applynest: "ApplyNest",
};

const SMALL_WORDS = new Set(["and", "or", "of", "the", "a", "an", "to", "for", "in", "on", "at", "by", "with"]);

function isEnglishLocale(locale?: string): boolean {
  if (!locale) return true;
  const normalized = locale.toLowerCase();
  return normalized === "en" || normalized.startsWith("en-") || normalized.startsWith("en_");
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function splitPunctuation(word: string): { lead: string; core: string; trail: string } {
  const match = /^([("']*)(.*?)([)"'.,:;!?]*)$/.exec(word);
  if (!match) return { lead: "", core: word, trail: "" };
  return { lead: match[1] ?? "", core: match[2] ?? "", trail: match[3] ?? "" };
}

function formatTokenTitleCase(token: string): string {
  if (!token) return token;
  const lower = token.toLowerCase();
  if (PRESERVE_CASE[lower]) return PRESERVE_CASE[lower]!;
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function formatTokenSentenceCase(token: string, isFirst: boolean): string {
  if (!token) return token;
  const lower = token.toLowerCase();
  const preserved = PRESERVE_CASE[lower];
  if (preserved) return preserved;
  if (!isFirst) return lower;
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function mapCompoundWord(
  core: string,
  mapper: (token: string, tokenIndex: number, tokenCount: number) => string,
): string {
  const tokens = core.split(/([/\-·])/);
  const rawWords = tokens.filter((part) => part !== "/" && part !== "-" && part !== "·" && part.length > 0);
  let seen = 0;
  return tokens
    .map((part) => {
      if (part === "/" || part === "-" || part === "·") return part;
      if (!part) return part;
      const value = mapper(part, seen, rawWords.length);
      seen += 1;
      return value;
    })
    .join("");
}

export function formatTitleCase(text: string, locale?: string): string {
  const compact = normalizeWhitespace(text);
  if (!compact || !isEnglishLocale(locale)) return compact;
  const words = compact.split(" ");
  return words
    .map((word, index) => {
      const { lead, core, trail } = splitPunctuation(word);
      if (!core) return word;
      const loweredCore = core.toLowerCase();
      if (index > 0 && index < words.length - 1 && SMALL_WORDS.has(loweredCore)) {
        return `${lead}${loweredCore}${trail}`;
      }
      return `${lead}${mapCompoundWord(core, (token) => formatTokenTitleCase(token))}${trail}`;
    })
    .join(" ");
}

export function formatSentenceCase(text: string, locale?: string): string {
  const compact = normalizeWhitespace(text);
  if (!compact || !isEnglishLocale(locale)) return compact;
  const words = compact.split(" ");
  return words
    .map((word, index) => {
      const { lead, core, trail } = splitPunctuation(word);
      if (!core) return word;
      const cased = mapCompoundWord(core, (token, tokenIndex) =>
        formatTokenSentenceCase(token, index === 0 && tokenIndex === 0),
      );
      return `${lead}${cased}${trail}`;
    })
    .join(" ");
}

export function formatEyebrow(text: string, locale?: string): string {
  const compact = normalizeWhitespace(text);
  if (!compact || !isEnglishLocale(locale)) return compact;
  return formatTitleCase(compact, locale).toUpperCase();
}
