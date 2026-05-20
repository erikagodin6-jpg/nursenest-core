export interface LanguageValidationResult {
  isValid: boolean;
  detectedLanguage: string;
  requestedLanguage: string;
  confidence: number;
  issues: string[];
}

export interface TerminologyCheckResult {
  passed: boolean;
  foreignTerms: string[];
  ratio: number;
}

const LANGUAGE_MARKERS: Record<string, { patterns: RegExp[]; commonWords: string[] }> = {
  en: {
    patterns: [/\b(the|and|for|with|that|this|from|have|will|been|are|was|not|but|you|our|your)\b/gi],
    commonWords: ["the", "and", "for", "with", "that", "this", "from", "have", "will", "are", "was", "not", "but", "you"],
  },
  fr: {
    patterns: [/\b(le|la|les|des|une|est|sont|dans|pour|avec|que|qui|sur|par|pas|nous|vous|ils|elles|cette|ces|aux|du)\b/gi],
    commonWords: ["le", "la", "les", "des", "une", "est", "sont", "dans", "pour", "avec", "que", "qui"],
  },
  es: {
    patterns: [/\b(el|la|los|las|de|del|en|que|por|con|una|son|para|como|está|más|pero|sus|este|esta|estos|estas)\b/gi],
    commonWords: ["el", "la", "los", "las", "de", "del", "en", "que", "por", "con", "una", "son"],
  },
  tl: {
    patterns: [/\b(ang|ng|mga|sa|na|at|ay|ito|iyan|para|kung|hindi|naman|po|ko|mo|niya|nila|kami|tayo|sila)\b/gi],
    commonWords: ["ang", "ng", "mga", "sa", "na", "at", "ay", "ito"],
  },
  hi: {
    patterns: [/[\u0900-\u097F]/g],
    commonWords: [],
  },
  zh: {
    patterns: [/[\u4E00-\u9FFF]/g],
    commonWords: [],
  },
  "zh-tw": {
    patterns: [/[\u4E00-\u9FFF]/g],
    commonWords: [],
  },
  ar: {
    patterns: [/[\u0600-\u06FF]/g],
    commonWords: [],
  },
  ko: {
    patterns: [/[\uAC00-\uD7AF\u1100-\u11FF]/g],
    commonWords: [],
  },
  ja: {
    patterns: [/[\u3040-\u309F\u30A0-\u30FF]/g],
    commonWords: [],
  },
  pt: {
    patterns: [/\b(os|as|do|da|dos|das|em|que|por|com|uma|são|para|como|está|mais|mas|seus|este|esta|não|isso)\b/gi],
    commonWords: ["os", "as", "do", "da", "dos", "das", "em", "que", "por"],
  },
  de: {
    patterns: [/\b(der|die|das|ein|eine|und|ist|von|zu|mit|auf|für|nicht|sich|den|dem|des|oder|auch|nach)\b/gi],
    commonWords: ["der", "die", "das", "ein", "eine", "und", "ist", "von"],
  },
  vi: {
    patterns: [/[\u00C0-\u01B0\u1EA0-\u1EF9]/g, /\b(của|và|là|trong|cho|này|đã|được|có|không|với|một|các|từ|khi)\b/gi],
    commonWords: ["của", "và", "là", "trong", "cho"],
  },
  ur: {
    patterns: [/[\u0600-\u06FF]/g],
    commonWords: [],
  },
  pa: {
    patterns: [/[\u0A00-\u0A7F]/g],
    commonWords: [],
  },
  fa: {
    patterns: [/[\u0600-\u06FF\u0750-\u077F]/g],
    commonWords: [],
  },
  th: {
    patterns: [/[\u0E00-\u0E7F]/g],
    commonWords: [],
  },
  tr: {
    patterns: [/\b(bir|ve|bu|için|ile|olan|gibi|daha|ancak|veya|ama|kadar|sonra|önce|çok|her|bazı)\b/gi, /[çğıöşüÇĞİÖŞÜ]/g],
    commonWords: ["bir", "ve", "bu", "için", "ile"],
  },
  id: {
    patterns: [/\b(dan|yang|di|untuk|dengan|ini|itu|dari|pada|tidak|akan|ada|atau|juga|oleh|ke|mereka|kami|kita)\b/gi],
    commonWords: ["dan", "yang", "di", "untuk", "dengan", "ini"],
  },
  ht: {
    patterns: [/\b(nan|ak|pou|ki|sa|pa|li|yo|se|gen|tout|anpil|men|lè|kè)\b/gi],
    commonWords: ["nan", "ak", "pou", "ki", "sa"],
  },
};

const MEDICAL_TERMS = new Set([
  "nclex", "nclex-rn", "nclex-pn", "rex-pn", "aanp", "ancc",
  "nursing", "clinical", "pathophysiology", "pharmacology",
  "anatomy", "physiology", "assessment", "diagnosis",
  "prognosis", "syndrome", "symptom", "therapy",
  "iv", "gi", "cbc", "bmp", "cmp", "abg", "ekg", "ecg",
  "ct", "mri", "bmi", "bp", "hr", "rr", "spo2",
  "nursenest", "qbank",
]);

export function detectLanguage(text: string): { language: string; confidence: number } {
  if (!text || text.trim().length === 0) {
    return { language: "unknown", confidence: 0 };
  }

  const scores: Record<string, number> = {};
  const totalChars = text.length;
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 1);

  for (const [lang, markers] of Object.entries(LANGUAGE_MARKERS)) {
    let score = 0;

    for (const pattern of markers.patterns) {
      const matches = text.match(new RegExp(pattern.source, pattern.flags));
      if (matches) {
        const charCoverage = matches.join("").length / totalChars;
        score += charCoverage * 100;
      }
    }

    if (markers.commonWords.length > 0) {
      let wordHits = 0;
      for (const word of words) {
        if (markers.commonWords.includes(word)) wordHits++;
      }
      if (words.length > 0) {
        score += (wordHits / words.length) * 50;
      }
    }

    scores[lang] = score;
  }

  let bestLang = "unknown";
  let bestScore = 0;
  for (const [lang, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestLang = lang;
    }
  }

  const confidence = Math.min(bestScore / 100, 1);
  return { language: bestLang, confidence };
}

export function checkTerminology(
  text: string,
  targetLanguage: string
): TerminologyCheckResult {
  if (targetLanguage === "en") {
    return { passed: true, foreignTerms: [], ratio: 0 };
  }

  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) return { passed: true, foreignTerms: [], ratio: 0 };

  const enMarkers = LANGUAGE_MARKERS["en"];
  const foreignTerms: string[] = [];

  const originalWords = text.split(/\s+/).filter(w => w.length > 2);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const original = originalWords[i] || word;
    if (MEDICAL_TERMS.has(word)) continue;
    if (/^[A-Z]{1,5}$/.test(original)) continue;
    if (/^\d/.test(word)) continue;

    if (enMarkers.commonWords.includes(word) && word.length > 3) {
      foreignTerms.push(word);
    }
  }

  const ratio = foreignTerms.length / words.length;
  const threshold = 0.15;

  return {
    passed: ratio < threshold,
    foreignTerms: [...new Set(foreignTerms)].slice(0, 20),
    ratio: Math.round(ratio * 100) / 100,
  };
}

export function validateGeneratedPayload(
  payload: Record<string, any>,
  targetLanguage: string,
  fieldsToCheck: string[] = ["title", "content", "description", "body", "summary", "rationale", "stem", "scenario"]
): LanguageValidationResult {
  const issues: string[] = [];
  let totalConfidence = 0;
  let checksPerformed = 0;
  let detectedLang = "unknown";

  for (const field of fieldsToCheck) {
    const value = payload[field];
    if (!value || typeof value !== "string" || value.length < 10) continue;

    const detection = detectLanguage(value);
    checksPerformed++;
    totalConfidence += detection.confidence;

    if (checksPerformed === 1) {
      detectedLang = detection.language;
    }

    const normalizedTarget = normalizeLanguageCode(targetLanguage);
    const normalizedDetected = normalizeLanguageCode(detection.language);

    if (
      detection.confidence > 0.3 &&
      normalizedDetected !== normalizedTarget &&
      normalizedDetected !== "unknown"
    ) {
      issues.push(
        `Field "${field}" appears to be in ${detection.language} (confidence: ${(detection.confidence * 100).toFixed(0)}%) but ${targetLanguage} was requested`
      );
    }

    if (targetLanguage !== "en") {
      const termCheck = checkTerminology(value, targetLanguage);
      if (!termCheck.passed) {
        issues.push(
          `Field "${field}" contains ${termCheck.foreignTerms.length} English terms (${(termCheck.ratio * 100).toFixed(0)}% ratio): ${termCheck.foreignTerms.slice(0, 5).join(", ")}`
        );
      }
    }
  }

  const avgConfidence = checksPerformed > 0 ? totalConfidence / checksPerformed : 0;

  return {
    isValid: issues.length === 0,
    detectedLanguage: detectedLang,
    requestedLanguage: targetLanguage,
    confidence: Math.round(avgConfidence * 100) / 100,
    issues,
  };
}

function normalizeLanguageCode(code: string): string {
  const normalized = code.toLowerCase().replace(/_/g, "-");
  const mapping: Record<string, string> = {
    "fr-ca": "fr",
    "es-mx": "es",
    "es-es": "es",
    "pt-br": "pt",
    "zh-hans": "zh",
    "zh-hant": "zh-tw",
    "zh-cn": "zh",
  };
  return mapping[normalized] || normalized;
}
