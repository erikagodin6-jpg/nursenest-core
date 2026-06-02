const LANGUAGE_CHAR_RANGES: Record<string, RegExp[]> = {
  zh: [/[\u4e00-\u9fff]/g, /[\u3400-\u4dbf]/g],
  ja: [/[\u3040-\u309f]/g, /[\u30a0-\u30ff]/g],
  ko: [/[\uac00-\ud7af]/g, /[\u1100-\u11ff]/g],
  ar: [/[\u0600-\u06ff]/g, /[\u0750-\u077f]/g],
  hi: [/[\u0900-\u097f]/g],
  pa: [/[\u0a00-\u0a7f]/g],
  ur: [/[\u0600-\u06ff]/g, /[\ufb50-\ufdff]/g],
  fa: [/[\u0600-\u06ff]/g, /[\ufb50-\ufdff]/g],
  th: [/[\u0e00-\u0e7f]/g],
};

const LANGUAGE_COMMON_WORDS: Record<string, string[]> = {
  en: ["the", "and", "for", "that", "with", "this", "from", "are", "was", "have", "been", "will", "your", "their", "which", "would", "should", "patient", "nursing"],
  fr: ["les", "des", "une", "que", "est", "dans", "pour", "avec", "sont", "cette", "peut", "être", "fait", "aussi", "mais", "très", "chez", "entre", "comme", "lors"],
  es: ["los", "las", "una", "del", "que", "con", "para", "por", "son", "está", "más", "puede", "como", "tiene", "entre", "desde", "sobre", "también", "cuando", "cada"],
  pt: ["dos", "das", "uma", "que", "com", "para", "por", "são", "está", "mais", "pode", "como", "tem", "entre", "sobre", "também", "quando", "cada", "após", "pela"],
  de: ["der", "die", "das", "und", "ist", "von", "den", "ein", "mit", "auf", "für", "eine", "dem", "des", "sich", "kann", "bei", "nach", "werden", "sind"],
  vi: ["của", "và", "các", "cho", "trong", "được", "không", "này", "với", "một", "những", "đã", "khi", "bệnh", "thuốc"],
  tl: ["ang", "mga", "nang", "para", "kung", "ito", "din", "lang", "naman", "dapat", "siya", "isa", "pag"],
};

export interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
  matchesRequested: boolean;
  details: {
    scriptMatch: string | null;
    wordMatchScores: Record<string, number>;
  };
}

export function detectLanguage(text: string, requestedLanguage: string): LanguageDetectionResult {
  if (!text || text.trim().length < 20) {
    return {
      detectedLanguage: requestedLanguage,
      confidence: 0,
      matchesRequested: true,
      details: { scriptMatch: null, wordMatchScores: {} },
    };
  }

  const cleanText = text.replace(/[A-Z]{2,6}/g, "").replace(/\d+(\.\d+)?/g, "");

  for (const [lang, patterns] of Object.entries(LANGUAGE_CHAR_RANGES)) {
    let totalMatches = 0;
    for (const pattern of patterns) {
      const matches = cleanText.match(pattern);
      totalMatches += matches ? matches.length : 0;
    }

    const charRatio = totalMatches / cleanText.length;
    if (charRatio > 0.15) {
      const normalizedRequested = normalizeLanguageCode(requestedLanguage);
      const normalizedDetected = normalizeLanguageCode(lang);
      const matches = normalizedDetected === normalizedRequested;

      return {
        detectedLanguage: lang,
        confidence: Math.min(charRatio * 3, 1),
        matchesRequested: matches,
        details: { scriptMatch: lang, wordMatchScores: {} },
      };
    }
  }

  const words = cleanText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (words.length < 5) {
    return {
      detectedLanguage: requestedLanguage,
      confidence: 0,
      matchesRequested: true,
      details: { scriptMatch: null, wordMatchScores: {} },
    };
  }

  const wordMatchScores: Record<string, number> = {};

  for (const [lang, commonWords] of Object.entries(LANGUAGE_COMMON_WORDS)) {
    let matchCount = 0;
    for (const word of words) {
      if (commonWords.includes(word)) matchCount++;
    }
    wordMatchScores[lang] = matchCount / words.length;
  }

  let bestLang = "en";
  let bestScore = 0;
  for (const [lang, score] of Object.entries(wordMatchScores)) {
    if (score > bestScore) {
      bestScore = score;
      bestLang = lang;
    }
  }

  const normalizedRequested = normalizeLanguageCode(requestedLanguage);
  const normalizedDetected = normalizeLanguageCode(bestLang);

  return {
    detectedLanguage: bestLang,
    confidence: Math.min(bestScore * 5, 1),
    matchesRequested: normalizedDetected === normalizedRequested || bestScore < 0.05,
    details: { scriptMatch: null, wordMatchScores },
  };
}

function normalizeLanguageCode(code: string): string {
  const mapping: Record<string, string> = {
    "zh-tw": "zh",
    "zh-hant": "zh",
    "fil": "tl",
    "nb": "no",
  };
  const lower = code.toLowerCase();
  return mapping[lower] || lower.split("-")[0];
}

export function validateGeneratedLanguage(
  text: string,
  requestedLanguage: string,
): { valid: boolean; result: LanguageDetectionResult; reason?: string } {
  if (requestedLanguage === "en") {
    return { valid: true, result: detectLanguage(text, "en") };
  }

  const result = detectLanguage(text, requestedLanguage);

  if (result.confidence < 0.1) {
    return {
      valid: true,
      result,
      reason: "Low confidence detection — cannot reliably validate",
    };
  }

  if (!result.matchesRequested && result.confidence > 0.3) {
    return {
      valid: false,
      result,
      reason: `Expected ${requestedLanguage} but detected ${result.detectedLanguage} (confidence: ${(result.confidence * 100).toFixed(0)}%)`,
    };
  }

  return { valid: true, result };
}
