/**
 * Shared deterministic signals for **placeholder**, **stub**, and **non-clinical meta** phrasing
 * across blog HTML and lesson/markdown bodies. Used by pre-publish gates and audit scripts.
 *
 * Keep patterns conservative: prefer obvious authoring stubs over brittle “AI tells”.
 */

export type EducationalPlaceholderPattern = { readonly id: string; readonly re: RegExp };

/** Lowercase, whitespace-normalized plain text (HTML tags stripped). */
export function educationalPlainLowerFromMixedContent(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Ordered patterns; each `id` is stable for logs, audits, and test assertions.
 * All regexes run against {@link educationalPlainLowerFromMixedContent} output.
 */
export const EDUCATIONAL_PLACEHOLDER_PATTERNS: readonly EducationalPlaceholderPattern[] = [
  { id: "lorem_ipsum", re: /\blorem ipsum\b/ },
  { id: "insert_bracket", re: /\b\[insert\b/ },
  { id: "todo_colon", re: /\btodo:\b/ },
  { id: "tbd_token", re: /\btbd\b/ },
  { id: "placeholder_word", re: /\bplaceholder\b/ },
  { id: "mustache_template", re: /\{\{[\s\S]{0,200}?\}\}/ },
  { id: "content_goes_here", re: /\b(content|topic|clinical)[\s-]*(goes|will go) here\b/ },
  { id: "replace_this_section", re: /\breplace this section\b/ },
  { id: "placeholder_paragraph", re: /\bplaceholder paragraph\b/ },
  { id: "section_connects_stub", re: /\bthis section connects\b/ },
  { id: "topic_specific_stub", re: /\btopic-specific clinical content goes here\b/ },
  { id: "coming_soon", re: /\bcoming soon\b/ },
  { id: "to_be_continued", re: /\bto be continued\b/ },
  { id: "work_in_progress", re: /\bwork in progress\b/ },
  { id: "under_construction", re: /\bunder construction\b/ },
  { id: "fixme_bracket", re: /\[(?:fixme|todo|tbd)\]/ },
] as const;

const AI_DISCLAIMER_PATTERNS: readonly RegExp[] = [
  /\bas an ai\b/,
  /\bas a language model\b/,
  /\bi cannot\b.*\bmedical advice\b/,
  /\bi am an ai\b/,
  /\bi'm an ai\b/,
];

export function collectEducationalPlaceholderIds(combinedText: string): string[] {
  const plain = educationalPlainLowerFromMixedContent(combinedText);
  if (!plain) return [];
  const hits = new Set<string>();
  for (const { id, re } of EDUCATIONAL_PLACEHOLDER_PATTERNS) {
    re.lastIndex = 0;
    if (re.test(plain)) hits.add(id);
  }
  return [...hits];
}

export function hasEducationalAiDisclaimerLanguage(combinedText: string): boolean {
  const plain = educationalPlainLowerFromMixedContent(combinedText);
  if (!plain) return false;
  return AI_DISCLAIMER_PATTERNS.some((re) => {
    re.lastIndex = 0;
    return re.test(plain);
  });
}

/**
 * Detects repeated substantive paragraphs (markdown-ish or plain). Intended for long-form lessons;
 * callers should gate on minimum body length to avoid noise.
 */
export function hasLargeDuplicateParagraphBlock(text: string, minParagraphChars = 140): boolean {
  const stripped = text.replace(/<[^>]+>/g, "\n");
  const chunks = stripped
    .split(/\n{2,}|\r\n\r\n/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length >= minParagraphChars);
  const seen = new Set<string>();
  for (const c of chunks) {
    if (seen.has(c)) return true;
    seen.add(c);
  }
  return false;
}
