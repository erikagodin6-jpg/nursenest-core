const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  tl: "Filipino (Tagalog)",
  hi: "Hindi",
  zh: "Simplified Chinese",
  "zh-tw": "Traditional Chinese",
  ar: "Arabic",
  ko: "Korean",
  pt: "Portuguese",
  pa: "Punjabi",
  vi: "Vietnamese",
  ht: "Haitian Creole",
  ur: "Urdu",
  ja: "Japanese",
  fa: "Farsi (Persian)",
  de: "German",
  th: "Thai",
  tr: "Turkish",
  id: "Indonesian (Bahasa)",
};

const LANGUAGE_SPECIFIC_INSTRUCTIONS: Record<string, string> = {
  fr: "Use Canadian French (fr-CA) conventions. Maintain formal register (vouvoiement). Medical terminology should follow Canadian French medical standards.",
  es: "Use Latin American Spanish conventions. Medical terms should follow standard Spanish medical terminology.",
  ar: "Write in Modern Standard Arabic (MSA). Use right-to-left formatting conventions. Medical terms may be transliterated if no standard Arabic equivalent exists.",
  zh: "Write in Simplified Chinese. Use standard medical terminology as used in mainland China.",
  "zh-tw": "Write in Traditional Chinese. Use standard medical terminology as used in Taiwan.",
  hi: "Write in Devanagari script. Technical/medical terms without Hindi equivalents may be kept in English with Devanagari transliteration provided.",
  ko: "Write in Korean (Hangul). Medical terms may use Hanja equivalents where standard.",
  ja: "Write in Japanese using appropriate mix of kanji, hiragana, and katakana. Medical terms may use katakana for Western loan words.",
  th: "Write in Thai script. Medical terms without Thai equivalents may be kept in English.",
  vi: "Write in Vietnamese with proper diacritical marks (dấu). Medical terms should follow Vietnamese medical conventions.",
};

export interface LocalizedPromptOptions {
  targetLanguage: string;
  baseSystemPrompt: string;
  baseUserPrompt: string;
  preserveMedicalTerms?: boolean;
  contentType?: string;
}

export function buildLocalizedGeneratorPrompt(options: LocalizedPromptOptions): {
  systemPrompt: string;
  userPrompt: string;
} {
  const { targetLanguage, baseSystemPrompt, baseUserPrompt, preserveMedicalTerms = true, contentType } = options;

  if (targetLanguage === "en") {
    return { systemPrompt: baseSystemPrompt, userPrompt: baseUserPrompt };
  }

  const langName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
  const specificInstructions = LANGUAGE_SPECIFIC_INSTRUCTIONS[targetLanguage] || "";

  const languageBlock = [
    "",
    "LANGUAGE REQUIREMENTS (MANDATORY):",
    `- ALL output MUST be written entirely in ${langName}.`,
    `- Do NOT mix languages. Every field, label, explanation, rationale, and description must be in ${langName}.`,
    `- Do NOT output any English text except for:`,
    preserveMedicalTerms
      ? `  * Internationally recognized medical abbreviations (e.g., IV, GI, CBC, ABG, EKG, NCLEX)`
      : `  * None — translate everything.`,
    preserveMedicalTerms
      ? `  * Standardized medical terms that have no widely accepted ${langName} equivalent`
      : "",
    `  * Proper nouns (e.g., NurseNest)`,
    `- If a medical term is kept in English, provide the ${langName} equivalent in parentheses on first use.`,
    specificInstructions ? `- ${specificInstructions}` : "",
    `- Verify your entire response is in ${langName} before finalizing.`,
    "",
  ]
    .filter(Boolean)
    .join("\n");

  const enhancedSystemPrompt = baseSystemPrompt + "\n" + languageBlock;

  const languageReminder = `\n\nIMPORTANT: Generate ALL content in ${langName}. Do not use English except for standardized medical abbreviations and proper nouns.`;
  const enhancedUserPrompt = baseUserPrompt + languageReminder;

  return {
    systemPrompt: enhancedSystemPrompt,
    userPrompt: enhancedUserPrompt,
  };
}

export function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] || code;
}
