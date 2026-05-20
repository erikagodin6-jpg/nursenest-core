import { pool } from "./storage";
import crypto from "crypto";

export const SUPPORTED_GENERATION_LANGUAGES = [
  "en", "fr", "es", "zh", "zh-tw", "ar", "hi", "pt", "tl", "ko", "ja",
  "de", "vi", "pa", "ur", "fa"
] as const;

export type SupportedLanguage = typeof SUPPORTED_GENERATION_LANGUAGES[number];

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English", fr: "French", es: "Spanish", zh: "Chinese (Simplified)",
  "zh-tw": "Chinese (Traditional)", ar: "Arabic", hi: "Hindi", pt: "Portuguese",
  tl: "Filipino/Tagalog", ko: "Korean", ja: "Japanese", de: "German",
  vi: "Vietnamese", pa: "Punjabi", ur: "Urdu", fa: "Farsi/Persian",
};

export interface LanguageValidationReport {
  requested_language: string;
  detected_language: string;
  field_validation: Record<string, { passed: boolean; detected: string; confidence: number }>;
  validation_passed: boolean;
  terminology_check_passed: boolean;
  retry_count: number;
  status: "validated" | "validation_failed" | "pending_review";
}

export interface LanguageEnforcementResult<T = any> {
  content: T;
  validationReport: LanguageValidationReport;
}

const BRAND_NAMES_PRESERVED = ["NurseNest", "NurseNest.ca", "NCLEX", "NCLEX-RN", "NCLEX-PN", "REx-PN", "ASWB", "PTCB", "ExCPT", "NREMT", "ARRT", "ASCP"];

const MEDICAL_ABBREVIATIONS_UNIVERSAL = [
  "IV", "BP", "HR", "SpO2", "ECG", "EKG", "ABG", "CBC", "BMP", "CMP",
  "BMI", "GCS", "CPR", "AED", "NPO", "PRN", "BID", "TID", "QID",
  "IM", "SQ", "PO", "INR", "PT", "PTT", "WBC", "RBC", "Hgb", "Hct",
  "BUN", "Na+", "K+", "Ca2+", "Mg2+", "pH", "pCO2", "pO2", "HCO3",
  "ICU", "OR", "ER", "COPD", "CHF", "DVT", "PE", "MI", "CVA", "TIA",
  "UTI", "MRSA", "C.diff", "PICC", "NG", "Foley", "I&O", "ADL",
  "ROM", "DNR", "POLST", "HIPAA", "SBAR", "RACE", "PASS", "DSM-5",
  "NASW", "CBT", "MI", "SFBT", "PFA", "SSI", "SSDI", "TANF",
];

export const CLINICAL_TERMINOLOGY: Record<string, Record<string, string>> = {
  en: {
    "blood_pressure": "blood pressure",
    "heart_rate": "heart rate",
    "respiratory_rate": "respiratory rate",
    "nursing_assessment": "nursing assessment",
    "patient_education": "patient education",
    "medication_administration": "medication administration",
    "vital_signs": "vital signs",
    "nursing_diagnosis": "nursing diagnosis",
    "care_plan": "care plan",
    "discharge_planning": "discharge planning",
    "informed_consent": "informed consent",
    "scope_of_practice": "scope of practice",
    "differential_diagnosis": "differential diagnosis",
    "clinical_judgment": "clinical judgment",
    "evidence_based_practice": "evidence-based practice",
  },
  fr: {
    "blood_pressure": "pression artérielle",
    "heart_rate": "fréquence cardiaque",
    "respiratory_rate": "fréquence respiratoire",
    "nursing_assessment": "évaluation infirmière",
    "patient_education": "éducation du patient",
    "medication_administration": "administration des médicaments",
    "vital_signs": "signes vitaux",
    "nursing_diagnosis": "diagnostic infirmier",
    "care_plan": "plan de soins",
    "discharge_planning": "planification du congé",
    "informed_consent": "consentement éclairé",
    "scope_of_practice": "champ de pratique",
    "differential_diagnosis": "diagnostic différentiel",
    "clinical_judgment": "jugement clinique",
    "evidence_based_practice": "pratique fondée sur les données probantes",
  },
  es: {
    "blood_pressure": "presión arterial",
    "heart_rate": "frecuencia cardíaca",
    "respiratory_rate": "frecuencia respiratoria",
    "nursing_assessment": "evaluación de enfermería",
    "patient_education": "educación del paciente",
    "medication_administration": "administración de medicamentos",
    "vital_signs": "signos vitales",
    "nursing_diagnosis": "diagnóstico de enfermería",
    "care_plan": "plan de cuidados",
    "discharge_planning": "planificación del alta",
    "informed_consent": "consentimiento informado",
    "scope_of_practice": "ámbito de práctica",
    "differential_diagnosis": "diagnóstico diferencial",
    "clinical_judgment": "juicio clínico",
    "evidence_based_practice": "práctica basada en la evidencia",
  },
  zh: {
    "blood_pressure": "血压",
    "heart_rate": "心率",
    "respiratory_rate": "呼吸频率",
    "nursing_assessment": "护理评估",
    "patient_education": "患者教育",
    "medication_administration": "药物管理",
    "vital_signs": "生命体征",
    "nursing_diagnosis": "护理诊断",
    "care_plan": "护理计划",
    "discharge_planning": "出院计划",
    "informed_consent": "知情同意",
    "scope_of_practice": "执业范围",
    "differential_diagnosis": "鉴别诊断",
    "clinical_judgment": "临床判断",
    "evidence_based_practice": "循证实践",
  },
  ar: {
    "blood_pressure": "ضغط الدم",
    "heart_rate": "معدل ضربات القلب",
    "respiratory_rate": "معدل التنفس",
    "nursing_assessment": "تقييم التمريض",
    "patient_education": "تثقيف المريض",
    "medication_administration": "إدارة الأدوية",
    "vital_signs": "العلامات الحيوية",
    "nursing_diagnosis": "التشخيص التمريضي",
    "care_plan": "خطة الرعاية",
    "discharge_planning": "تخطيط الخروج",
    "informed_consent": "الموافقة المستنيرة",
    "scope_of_practice": "نطاق الممارسة",
    "differential_diagnosis": "التشخيص التفريقي",
    "clinical_judgment": "الحكم السريري",
    "evidence_based_practice": "الممارسة القائمة على الأدلة",
  },
  hi: {
    "blood_pressure": "रक्तचाप",
    "heart_rate": "हृदय गति",
    "respiratory_rate": "श्वसन दर",
    "nursing_assessment": "नर्सिंग मूल्यांकन",
    "patient_education": "रोगी शिक्षा",
    "medication_administration": "दवा प्रशासन",
    "vital_signs": "महत्वपूर्ण संकेत",
    "nursing_diagnosis": "नर्सिंग निदान",
    "care_plan": "देखभाल योजना",
    "discharge_planning": "छुट्टी योजना",
    "informed_consent": "सूचित सहमति",
    "scope_of_practice": "अभ्यास का दायरा",
    "differential_diagnosis": "विभेदक निदान",
    "clinical_judgment": "नैदानिक निर्णय",
    "evidence_based_practice": "साक्ष्य-आधारित अभ्यास",
  },
  pt: {
    "blood_pressure": "pressão arterial",
    "heart_rate": "frequência cardíaca",
    "respiratory_rate": "frequência respiratória",
    "nursing_assessment": "avaliação de enfermagem",
    "patient_education": "educação do paciente",
    "medication_administration": "administração de medicamentos",
    "vital_signs": "sinais vitais",
    "nursing_diagnosis": "diagnóstico de enfermagem",
    "care_plan": "plano de cuidados",
    "discharge_planning": "planejamento de alta",
    "informed_consent": "consentimento informado",
    "scope_of_practice": "escopo de prática",
    "differential_diagnosis": "diagnóstico diferencial",
    "clinical_judgment": "julgamento clínico",
    "evidence_based_practice": "prática baseada em evidências",
  },
  ko: {
    "blood_pressure": "혈압",
    "heart_rate": "심박수",
    "respiratory_rate": "호흡수",
    "nursing_assessment": "간호 평가",
    "patient_education": "환자 교육",
    "medication_administration": "약물 투여",
    "vital_signs": "활력 징후",
    "nursing_diagnosis": "간호 진단",
    "care_plan": "간호 계획",
    "discharge_planning": "퇴원 계획",
    "informed_consent": "사전 동의",
    "scope_of_practice": "업무 범위",
    "differential_diagnosis": "감별 진단",
    "clinical_judgment": "임상 판단",
    "evidence_based_practice": "근거 기반 실무",
  },
  ja: {
    "blood_pressure": "血圧",
    "heart_rate": "心拍数",
    "respiratory_rate": "呼吸数",
    "nursing_assessment": "看護アセスメント",
    "patient_education": "患者教育",
    "medication_administration": "薬物投与",
    "vital_signs": "バイタルサイン",
    "nursing_diagnosis": "看護診断",
    "care_plan": "ケアプラン",
    "discharge_planning": "退院計画",
    "informed_consent": "インフォームドコンセント",
    "scope_of_practice": "業務範囲",
    "differential_diagnosis": "鑑別診断",
    "clinical_judgment": "臨床判断",
    "evidence_based_practice": "エビデンスに基づく実践",
  },
};

export function validateTargetLanguage(targetLanguage: string | undefined | null): string {
  if (!targetLanguage || typeof targetLanguage !== "string" || targetLanguage.trim() === "") {
    throw new Error(
      "LANGUAGE_ENFORCEMENT_ERROR: target_language parameter is required for all AI content generation. " +
      `Supported languages: ${SUPPORTED_GENERATION_LANGUAGES.join(", ")}`
    );
  }

  const normalized = targetLanguage.toLowerCase().trim();
  if (!SUPPORTED_GENERATION_LANGUAGES.includes(normalized as SupportedLanguage)) {
    throw new Error(
      `LANGUAGE_ENFORCEMENT_ERROR: Unsupported target_language "${targetLanguage}". ` +
      `Supported languages: ${SUPPORTED_GENERATION_LANGUAGES.join(", ")}`
    );
  }

  return normalized;
}

export function getLanguageLabel(lang: string): string {
  return LANGUAGE_LABELS[lang] || lang;
}

export function buildLanguageEnforcementPrompt(targetLanguage: string, retryAttempt: number = 0): string {
  const langLabel = getLanguageLabel(targetLanguage);

  if (targetLanguage === "en") {
    return `\n\nLANGUAGE REQUIREMENT: Generate ALL content in English. Every field, label, explanation, and text must be in English. Medical abbreviations (${MEDICAL_ABBREVIATIONS_UNIVERSAL.slice(0, 20).join(", ")}, etc.) remain unchanged. Brand names (${BRAND_NAMES_PRESERVED.join(", ")}) remain unchanged.\n`;
  }

  const strictnessLevel = retryAttempt === 0 ? "standard" : retryAttempt === 1 ? "strict" : "maximum";

  let enforcement = `\n\nCRITICAL LANGUAGE REQUIREMENT (${strictnessLevel.toUpperCase()} enforcement):
You MUST generate 100% of all content in ${langLabel} (language code: ${targetLanguage}).

RULES:
1. EVERY text field (titles, stems, rationales, options, explanations, descriptions, clinical pearls, hints, summaries, SEO fields, FAQ answers) MUST be in ${langLabel}.
2. ZERO tolerance for mixed-language content. No English phrases, sentences, or explanations unless they are universal medical abbreviations or brand names.
3. Medical abbreviations that remain in their original form: ${MEDICAL_ABBREVIATIONS_UNIVERSAL.slice(0, 30).join(", ")}, etc.
4. Brand names that remain unchanged: ${BRAND_NAMES_PRESERVED.join(", ")}
5. Use ${langLabel} clinical terminology conventions and medical vocabulary appropriate for ${langLabel}-speaking healthcare education.
6. JSON keys must remain in English (they are structural, not content).
7. Slug fields should use ${langLabel} words transliterated to ASCII with hyphens.
`;

  if (retryAttempt >= 1) {
    enforcement += `
PREVIOUS ATTEMPT FAILED LANGUAGE VALIDATION. You MUST ensure EVERY content field is fully in ${langLabel}.
Double-check each field before returning. Any English text in content fields will cause rejection.
`;
  }

  if (retryAttempt >= 2) {
    enforcement += `
THIS IS THE FINAL ATTEMPT. MAXIMUM STRICTNESS.
- Re-read every field and verify it contains ONLY ${langLabel} text.
- Translate any remaining English phrases.
- The content WILL be rejected if ANY field contains non-${langLabel} text (except medical abbreviations and brand names).
`;
  }

  const terminology = CLINICAL_TERMINOLOGY[targetLanguage];
  if (terminology) {
    const entries = Object.entries(terminology).slice(0, 10);
    enforcement += `\nUSE THESE STANDARD ${langLabel.toUpperCase()} CLINICAL TERMS:\n`;
    for (const [key, term] of entries) {
      const enTerm = CLINICAL_TERMINOLOGY["en"]?.[key] || key;
      enforcement += `- "${enTerm}" → "${term}"\n`;
    }
  }

  return enforcement;
}

const UNICODE_RANGES: Record<string, RegExp[]> = {
  zh: [/[\u4e00-\u9fff]/g, /[\u3400-\u4dbf]/g],
  "zh-tw": [/[\u4e00-\u9fff]/g, /[\u3400-\u4dbf]/g],
  ja: [/[\u3040-\u309f]/g, /[\u30a0-\u30ff]/g, /[\u4e00-\u9fff]/g],
  ko: [/[\uac00-\ud7af]/g, /[\u1100-\u11ff]/g],
  ar: [/[\u0600-\u06ff]/g, /[\u0750-\u077f]/g],
  hi: [/[\u0900-\u097f]/g],
  pa: [/[\u0a00-\u0a7f]/g],
  ur: [/[\u0600-\u06ff]/g],
  fa: [/[\u0600-\u06ff]/g, /[\u0750-\u077f]/g],
};

const LATIN_LANGUAGES = ["en", "fr", "es", "pt", "de", "vi", "tl"];
const LATIN_CHAR_PATTERNS: Record<string, RegExp[]> = {
  fr: [/[àâäéèêëïîôùûüÿçœæ]/gi],
  es: [/[áéíóúñ¿¡ü]/gi],
  pt: [/[ãõáéíóúâêôçà]/gi],
  de: [/[äöüßÄÖÜ]/gi],
  vi: [/[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/gi],
};

function stripPreservedTokens(text: string): string {
  let cleaned = text;
  for (const brand of BRAND_NAMES_PRESERVED) {
    cleaned = cleaned.replace(new RegExp(brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
  }
  for (const abbr of MEDICAL_ABBREVIATIONS_UNIVERSAL) {
    cleaned = cleaned.replace(new RegExp(`\\b${abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'), '');
  }
  return cleaned;
}

function detectFieldLanguage(text: string, expectedLanguage: string): { detected: string; confidence: number; passed: boolean } {
  if (!text || typeof text !== "string" || text.trim().length < 3) {
    return { detected: expectedLanguage, confidence: 1.0, passed: true };
  }

  const cleaned = stripPreservedTokens(text);
  if (cleaned.trim().length < 3) {
    return { detected: expectedLanguage, confidence: 1.0, passed: true };
  }

  const scriptRanges = UNICODE_RANGES[expectedLanguage];
  if (scriptRanges) {
    let scriptCharCount = 0;
    for (const pattern of scriptRanges) {
      const matches = cleaned.match(pattern);
      scriptCharCount += matches ? matches.length : 0;
    }

    const totalNonSpace = cleaned.replace(/[\s\d\p{P}]/gu, '').length;
    if (totalNonSpace === 0) {
      return { detected: expectedLanguage, confidence: 0.5, passed: true };
    }

    const scriptRatio = scriptCharCount / totalNonSpace;

    if (scriptRatio > 0.3) {
      return { detected: expectedLanguage, confidence: Math.min(scriptRatio + 0.2, 1.0), passed: true };
    }

    const latinChars = cleaned.match(/[a-zA-Z]/g)?.length || 0;
    const latinRatio = latinChars / totalNonSpace;

    if (latinRatio > 0.5 && scriptRatio < 0.1) {
      return { detected: "en", confidence: 0.8, passed: false };
    }

    return { detected: scriptRatio > 0.1 ? expectedLanguage : "unknown", confidence: scriptRatio, passed: scriptRatio > 0.1 };
  }

  if (LATIN_LANGUAGES.includes(expectedLanguage) && expectedLanguage !== "en") {
    const patterns = LATIN_CHAR_PATTERNS[expectedLanguage];
    if (patterns) {
      let diacriticCount = 0;
      for (const pattern of patterns) {
        const matches = cleaned.match(pattern);
        diacriticCount += matches ? matches.length : 0;
      }

      const wordCount = cleaned.split(/\s+/).length;

      if (wordCount > 10 && diacriticCount === 0) {
        return { detected: "en", confidence: 0.6, passed: false };
      }

      if (diacriticCount > 0) {
        return { detected: expectedLanguage, confidence: Math.min(0.6 + (diacriticCount / wordCount) * 0.4, 1.0), passed: true };
      }
    }

    return { detected: expectedLanguage, confidence: 0.5, passed: true };
  }

  if (expectedLanguage === "en") {
    const nonLatinChars = cleaned.match(/[^\x00-\x7F]/g)?.length || 0;
    const totalChars = cleaned.replace(/\s/g, '').length;
    if (totalChars > 0 && nonLatinChars / totalChars > 0.3) {
      return { detected: "unknown", confidence: 0.7, passed: false };
    }
    return { detected: "en", confidence: 0.8, passed: true };
  }

  return { detected: expectedLanguage, confidence: 0.5, passed: true };
}

export function validateContentLanguage(
  content: Record<string, any>,
  targetLanguage: string,
  fieldsToValidate?: string[]
): { passed: boolean; fieldResults: Record<string, { passed: boolean; detected: string; confidence: number }> } {
  const fieldResults: Record<string, { passed: boolean; detected: string; confidence: number }> = {};
  let allPassed = true;

  const fields = fieldsToValidate || Object.keys(content);

  for (const field of fields) {
    const value = content[field];
    if (value === undefined || value === null) continue;

    if (typeof value === "string") {
      const result = detectFieldLanguage(value, targetLanguage);
      fieldResults[field] = result;
      if (!result.passed) allPassed = false;
    } else if (Array.isArray(value)) {
      const concatenated = value
        .map((item: any) => {
          if (typeof item === "string") return item;
          if (typeof item === "object" && item !== null) {
            return Object.values(item).filter(v => typeof v === "string").join(" ");
          }
          return "";
        })
        .join(" ");

      if (concatenated.trim().length > 0) {
        const result = detectFieldLanguage(concatenated, targetLanguage);
        fieldResults[field] = result;
        if (!result.passed) allPassed = false;
      }
    } else if (typeof value === "object") {
      const textValues = Object.values(value).filter(v => typeof v === "string").join(" ");
      if (textValues.trim().length > 0) {
        const result = detectFieldLanguage(textValues, targetLanguage);
        fieldResults[field] = result;
        if (!result.passed) allPassed = false;
      }
    }
  }

  return { passed: allPassed, fieldResults };
}

export function checkTerminologyConsistency(
  content: Record<string, any>,
  targetLanguage: string
): { passed: boolean; violations: Array<{ field: string; term: string; expected: string; found: string }> } {
  const terminology = CLINICAL_TERMINOLOGY[targetLanguage];
  if (!terminology || targetLanguage === "en") {
    return { passed: true, violations: [] };
  }

  const violations: Array<{ field: string; term: string; expected: string; found: string }> = [];

  const enTerms = CLINICAL_TERMINOLOGY["en"] || {};

  for (const [key, enTerm] of Object.entries(enTerms)) {
    const expectedTerm = terminology[key];
    if (!expectedTerm) continue;

    for (const [field, value] of Object.entries(content)) {
      if (typeof value !== "string") continue;

      const lowerValue = value.toLowerCase();
      if (lowerValue.includes(enTerm.toLowerCase())) {
        if (!lowerValue.includes(expectedTerm.toLowerCase())) {
          violations.push({
            field,
            term: key,
            expected: expectedTerm,
            found: enTerm,
          });
        }
      }
    }
  }

  return { passed: violations.length === 0, violations };
}

export function buildValidationReport(
  targetLanguage: string,
  fieldResults: Record<string, { passed: boolean; detected: string; confidence: number }>,
  terminologyPassed: boolean,
  retryCount: number,
  overallPassed: boolean
): LanguageValidationReport {
  const detectedLanguages = Object.values(fieldResults).map(r => r.detected);
  const primaryDetected = detectedLanguages.length > 0
    ? detectedLanguages.sort((a, b) =>
        detectedLanguages.filter(v => v === b).length - detectedLanguages.filter(v => v === a).length
      )[0]
    : targetLanguage;

  let status: LanguageValidationReport["status"];
  if (overallPassed && terminologyPassed) {
    status = "validated";
  } else if (retryCount >= 2) {
    status = "validation_failed";
  } else {
    status = "pending_review";
  }

  return {
    requested_language: targetLanguage,
    detected_language: primaryDetected,
    field_validation: fieldResults,
    validation_passed: overallPassed,
    terminology_check_passed: terminologyPassed,
    retry_count: retryCount,
    status,
  };
}

export function getContentFields(contentType: string): string[] {
  switch (contentType) {
    case "question":
    case "exam_question":
      return ["stem", "options", "rationale", "scenario", "clinicalPearl", "examStrategy",
              "correctAnswerExplanation", "distractorRationales", "clinicalReasoning",
              "keyTakeaway", "mnemonic", "memoryHook"];
    case "flashcard":
      return ["front", "back", "term", "definition", "clinicalRelevance", "examTip"];
    case "lesson":
      return ["title", "summary", "definition", "pathophysiology", "signsSymptoms",
              "treatment", "nursingInterventions"];
    case "blog":
    case "article":
      return ["title", "article", "seoTitle", "metaDescription", "summary"];
    case "nursing_page":
      return ["title", "article", "seoTitle", "metaDescription"];
    case "allied_health":
      return ["title", "article", "seoTitle", "metaDescription"];
    case "new_grad":
      return ["title", "summary", "seoTitle", "metaDescription"];
    case "social_work":
      return ["stem", "options", "rationale", "clinicalPearls", "ethicalConsiderations"];
    default:
      return ["title", "content", "description", "summary"];
  }
}

export async function saveWithTransactionGuard(
  saveFn: () => Promise<any>,
  validationReport: LanguageValidationReport
): Promise<any> {
  if (!validationReport.validation_passed || !validationReport.terminology_check_passed) {
    if (validationReport.status === "validation_failed") {
      await routeToAdminReview(validationReport);
    }
    throw new Error(
      `LANGUAGE_ENFORCEMENT_ERROR: Content failed language validation. ` +
      `Requested: ${validationReport.requested_language}, ` +
      `Detected: ${validationReport.detected_language}, ` +
      `Status: ${validationReport.status}`
    );
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await saveFn();
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function routeToAdminReview(report: LanguageValidationReport): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO publishing_queue (engine_key, content_type, title, content, status, metadata, created_by)
       VALUES ('language_review', 'language_validation_failure', $1, $2, 'validation_failed', $3, 'language_enforcement')`,
      [
        `Language validation failed: ${report.requested_language}`,
        JSON.stringify(report),
        JSON.stringify({
          requested_language: report.requested_language,
          detected_language: report.detected_language,
          retry_count: report.retry_count,
          failed_fields: Object.entries(report.field_validation)
            .filter(([, v]) => !v.passed)
            .map(([k]) => k),
        }),
      ]
    );
  } catch (err: any) {
    console.error("[LanguageEnforcement] Failed to route to admin review:", err.message);
  }
}

export function checkPublishingGate(
  validationReport: LanguageValidationReport | null | undefined,
  translationStatus?: string
): { allowed: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (!validationReport) {
    reasons.push("No language validation report found");
    return { allowed: false, reasons };
  }

  if (!validationReport.validation_passed) {
    reasons.push(`Language validation failed (requested: ${validationReport.requested_language}, detected: ${validationReport.detected_language})`);
  }

  if (!validationReport.terminology_check_passed) {
    reasons.push("Clinical terminology consistency check failed");
  }

  if (validationReport.status !== "validated") {
    reasons.push(`Validation status is '${validationReport.status}', not 'validated'`);
  }

  if (translationStatus && translationStatus !== "approved" && translationStatus !== "auto") {
    reasons.push(`Translation status '${translationStatus}' is not approved`);
  }

  if (validationReport.requested_language !== validationReport.detected_language &&
      validationReport.detected_language !== "unknown") {
    reasons.push(`Language mismatch: requested=${validationReport.requested_language}, detected=${validationReport.detected_language}`);
  }

  return { allowed: reasons.length === 0, reasons };
}

export function buildLanguageScopedCacheKey(baseKey: string, targetLanguage: string): string {
  return crypto.createHash("sha256")
    .update(`${baseKey}::lang=${targetLanguage}`)
    .digest("hex");
}

export function invalidateLanguageScopedCache(baseKey: string): string[] {
  return SUPPORTED_GENERATION_LANGUAGES.map(lang =>
    buildLanguageScopedCacheKey(baseKey, lang)
  );
}

export async function enforceLanguageOnGeneration<T>(
  generateFn: (promptSuffix: string) => Promise<T>,
  targetLanguage: string,
  contentType: string,
  maxRetries: number = 2
): Promise<LanguageEnforcementResult<T>> {
  const validatedLang = validateTargetLanguage(targetLanguage);
  const fields = getContentFields(contentType);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const promptSuffix = buildLanguageEnforcementPrompt(validatedLang, attempt);
    const content = await generateFn(promptSuffix);

    const contentObj = typeof content === "object" && content !== null
      ? content as Record<string, any>
      : {};

    const { passed: langPassed, fieldResults } = validateContentLanguage(contentObj, validatedLang, fields);
    const { passed: termPassed } = checkTerminologyConsistency(contentObj, validatedLang);

    const overallPassed = langPassed && termPassed;

    if (overallPassed || attempt === maxRetries) {
      const report = buildValidationReport(validatedLang, fieldResults, termPassed, attempt, overallPassed);

      if (!overallPassed && attempt === maxRetries) {
        console.error(
          `[LanguageEnforcement] Content failed language validation after ${maxRetries + 1} attempts. ` +
          `Requested: ${validatedLang}, Content type: ${contentType}. Routing to admin review.`
        );
      }

      return { content, validationReport: report };
    }

    console.warn(
      `[LanguageEnforcement] Attempt ${attempt + 1}/${maxRetries + 1} failed for ${contentType} in ${validatedLang}. ` +
      `Failed fields: ${Object.entries(fieldResults).filter(([, v]) => !v.passed).map(([k]) => k).join(", ")}. Retrying...`
    );
  }

  throw new Error("LANGUAGE_ENFORCEMENT_ERROR: Unreachable code in retry loop");
}

export function validateJobLanguage(jobConfig: any): string {
  const targetLanguage = jobConfig?.target_language || jobConfig?.targetLanguage || jobConfig?.lang || "en";
  return validateTargetLanguage(targetLanguage);
}

export function shouldBlockJobCompletion(validationReport: LanguageValidationReport | null): { blocked: boolean; reason?: string } {
  if (!validationReport) {
    return { blocked: true, reason: "No language validation report - content was not language-checked" };
  }

  if (validationReport.status === "validation_failed") {
    return {
      blocked: true,
      reason: `Language validation failed after ${validationReport.retry_count + 1} attempts. ` +
              `Requested: ${validationReport.requested_language}, Detected: ${validationReport.detected_language}`
    };
  }

  return { blocked: false };
}
