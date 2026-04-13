/**
 * Heuristic **quality gates** for educational overlays (lessons, questions).
 * When checks fail, callers should **fall back to English** so clinical meaning stays intact.
 *
 * Not a substitute for human medical review — reduces obviously bad machine/lazy translations:
 * copy-pasted English, leaked boilerplate, missing expected script for the locale, broken markdown.
 */
import { DEFAULT_MARKETING_LOCALE, localePrimarySubtag } from "@/lib/i18n/marketing-locale-policy";

export type EducationalTranslationQualityResult = {
  /** When false, use English source instead of `candidate`. */
  acceptTranslation: boolean;
  reasons: string[];
};

/** Exam-style English phrases that should not appear verbatim in non-English overlays. */
const ENGLISH_BOILERPLATE: RegExp[] = [
  /\bwhich of the following\b/i,
  /\bselect all that apply\b/i,
  /\bselect all\b/i,
  /\bmost appropriate (?:action|response|intervention)\b/i,
  /\bpriority (?:nursing )?action\b/i,
  /\bthe nurse should (?:first|prioritize)\b/i,
  /\bbest (?:next )?step (?:for|is)\b/i,
];

function stripForCompare(s: string): string {
  return s
    .toLowerCase()
    .replace(/\*\*|__|`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenJaccardSimilarity(a: string, b: string): number {
  const words = (t: string) =>
    new Set(
      stripForCompare(t)
        .split(/\s+/)
        .filter((w) => w.length > 2),
    );
  const ta = words(a);
  const tb = words(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const x of ta) {
    if (tb.has(x)) inter += 1;
  }
  return inter / Math.max(ta.size, tb.size);
}

/** Locale/script key → Unicode script probe for “body text should not be all-Latin”. */
const EXPECT_SCRIPT: Record<string, RegExp> = {
  ar: /\p{Script=Arabic}/u,
  fa: /\p{Script=Arabic}/u,
  ur: /\p{Script=Arabic}/u,
  he: /\p{Script=Hebrew}/u,
  hi: /\p{Script=Devanagari}/u,
  pa: /\p{Script=Gurmukhi}/u,
  ja: /\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Han}/u,
  ko: /\p{Script=Hangul}/u,
  zh: /\p{Script=Han}/u,
  "zh-tw": /\p{Script=Han}/u,
  th: /\p{Script=Thai}/u,
  ru: /\p{Script=Cyrillic}/u,
};

/** `zh-tw` must not collapse to `zh` for Han expectation. */
export function scriptExpectationLocaleKey(locale: string): string {
  const l = locale.trim().toLowerCase();
  if (l === "zh-tw") return "zh-tw";
  return localePrimarySubtag(locale);
}

function isMostlyLatinLetters(text: string): boolean {
  const letters = text.replace(/[\s\d.,;:()[\]%°\-+/\\'"’“”]/gu, "");
  if (letters.length < 12) return false;
  let latin = 0;
  for (const ch of letters) {
    if (/[A-Za-z]/.test(ch)) latin += 1;
  }
  return latin / letters.length > 0.65;
}

function scriptExpectationIssues(candidate: string, locale: string): string[] {
  const key = scriptExpectationLocaleKey(locale);
  const probe = EXPECT_SCRIPT[key];
  if (!probe) return [];
  const t = candidate.trim();
  if (t.length < 36) return [];
  if (/^[\d\s.,%\-–—/]+$/u.test(t)) return [];
  if (!probe.test(t) && isMostlyLatinLetters(t)) {
    return [`missing_expected_script:${key}`];
  }
  return [];
}

function brokenPatternIssues(text: string): string[] {
  const out: string[] = [];
  if (/\bthe\s+the\b/i.test(text)) out.push("doubled_article_the");
  if (/\ba\s+a\b/i.test(text)) out.push("doubled_article_a");
  if (/\ban\s+an\b/i.test(text)) out.push("doubled_article_an");
  const stars = text.match(/\*\*/g);
  if (stars && stars.length % 2 !== 0) out.push("unbalanced_markdown_bold");
  return out;
}

function englishBoilerplateIssues(text: string): string[] {
  for (const re of ENGLISH_BOILERPLATE) {
    if (re.test(text)) return ["english_boilerplate"];
  }
  return [];
}

/**
 * Decide whether `candidate` is acceptable as a translation of `englishSource` for `locale`.
 * Pass empty `englishSource` to only run overlay-internal checks (script, grammar, boilerplate).
 */
export function evaluateEducationalTranslation(
  englishSource: string,
  candidate: string,
  locale: string,
): EducationalTranslationQualityResult {
  const reasons: string[] = [];
  const primary = localePrimarySubtag(locale);

  if (primary === DEFAULT_MARKETING_LOCALE) {
    return { acceptTranslation: true, reasons: [] };
  }

  const cand = candidate.trim();
  if (!cand.length) {
    return { acceptTranslation: false, reasons: ["empty_translation"] };
  }

  const en = englishSource.trim();
  if (en.length >= 16) {
    const enNorm = stripForCompare(englishSource);
    const candNorm = stripForCompare(candidate);
    if (enNorm.length >= 16 && candNorm === enNorm) {
      reasons.push("identical_to_english_source");
    } else if (enNorm.length >= 40 && candNorm.length >= 40) {
      const j = tokenJaccardSimilarity(englishSource, candidate);
      if (j >= 0.94) reasons.push("near_duplicate_of_english");
    }
  }

  reasons.push(...englishBoilerplateIssues(candidate));
  reasons.push(...scriptExpectationIssues(candidate, locale));
  reasons.push(...brokenPatternIssues(candidate));

  return { acceptTranslation: reasons.length === 0, reasons };
}

export function shouldUseEnglishOnlyLocale(locale: string): boolean {
  return localePrimarySubtag(locale) === DEFAULT_MARKETING_LOCALE;
}
