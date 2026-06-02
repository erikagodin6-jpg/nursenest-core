export interface MedicalTerm {
  english: string;
  translations: Record<string, string>;
  category: string;
  abbreviation?: string;
  preserveAbbreviation: boolean;
}

export const MEDICAL_TERMINOLOGY: MedicalTerm[] = [
  { english: "blood pressure", translations: { fr: "pression artérielle", es: "presión arterial", zh: "血压", ar: "ضغط الدم", hi: "रक्तचाप", pt: "pressão arterial", ko: "혈압", ja: "血圧", de: "Blutdruck", vi: "huyết áp" }, category: "vital_signs", abbreviation: "BP", preserveAbbreviation: true },
  { english: "heart rate", translations: { fr: "fréquence cardiaque", es: "frecuencia cardíaca", zh: "心率", ar: "معدل ضربات القلب", hi: "हृदय गति", pt: "frequência cardíaca", ko: "심박수", ja: "心拍数", de: "Herzfrequenz", vi: "nhịp tim" }, category: "vital_signs", abbreviation: "HR", preserveAbbreviation: true },
  { english: "respiratory rate", translations: { fr: "fréquence respiratoire", es: "frecuencia respiratoria", zh: "呼吸频率", ar: "معدل التنفس", hi: "श्वसन दर", pt: "frequência respiratória", ko: "호흡수", ja: "呼吸数", de: "Atemfrequenz", vi: "nhịp thở" }, category: "vital_signs", abbreviation: "RR", preserveAbbreviation: true },
  { english: "oxygen saturation", translations: { fr: "saturation en oxygène", es: "saturación de oxígeno", zh: "血氧饱和度", ar: "تشبع الأكسجين", hi: "ऑक्सीजन संतृप्ति", pt: "saturação de oxigênio", ko: "산소 포화도", ja: "酸素飽和度", de: "Sauerstoffsättigung", vi: "độ bão hòa oxy" }, category: "vital_signs", abbreviation: "SpO2", preserveAbbreviation: true },
  { english: "intravenous", translations: { fr: "intraveineux", es: "intravenoso", zh: "静脉注射", ar: "عن طريق الوريد", hi: "अंतःशिरा", pt: "intravenoso", ko: "정맥 내", ja: "静脈内", de: "intravenös", vi: "tiêm tĩnh mạch" }, category: "administration", abbreviation: "IV", preserveAbbreviation: true },
  { english: "intramuscular", translations: { fr: "intramusculaire", es: "intramuscular", zh: "肌肉注射", ar: "عضلي", hi: "इंट्रामस्क्युलर", pt: "intramuscular", ko: "근육 내", ja: "筋肉内", de: "intramuskulär", vi: "tiêm bắp" }, category: "administration", abbreviation: "IM", preserveAbbreviation: true },
  { english: "subcutaneous", translations: { fr: "sous-cutané", es: "subcutáneo", zh: "皮下注射", ar: "تحت الجلد", hi: "चमड़े के नीचे", pt: "subcutâneo", ko: "피하", ja: "皮下", de: "subkutan", vi: "tiêm dưới da" }, category: "administration", abbreviation: "SQ/SubQ", preserveAbbreviation: true },
  { english: "by mouth", translations: { fr: "par voie orale", es: "por vía oral", zh: "口服", ar: "عن طريق الفم", hi: "मुँह से", pt: "por via oral", ko: "경구", ja: "経口", de: "oral", vi: "đường uống" }, category: "administration", abbreviation: "PO", preserveAbbreviation: true },
  { english: "as needed", translations: { fr: "au besoin", es: "según necesidad", zh: "按需", ar: "حسب الحاجة", hi: "आवश्यकतानुसार", pt: "conforme necessário", ko: "필요시", ja: "必要時", de: "bei Bedarf", vi: "khi cần" }, category: "administration", abbreviation: "PRN", preserveAbbreviation: true },
  { english: "nothing by mouth", translations: { fr: "rien par la bouche", es: "nada por boca", zh: "禁食", ar: "لا شيء عن طريق الفم", hi: "मुँह से कुछ नहीं", pt: "nada por via oral", ko: "금식", ja: "絶食", de: "nüchtern", vi: "nhịn ăn" }, category: "administration", abbreviation: "NPO", preserveAbbreviation: true },
  { english: "complete blood count", translations: { fr: "numération formule sanguine", es: "hemograma completo", zh: "全血细胞计数", ar: "تعداد الدم الكامل", hi: "पूर्ण रक्त गणना", pt: "hemograma completo", ko: "전혈구검사", ja: "全血球計算", de: "großes Blutbild", vi: "công thức máu" }, category: "labs", abbreviation: "CBC", preserveAbbreviation: true },
  { english: "basic metabolic panel", translations: { fr: "bilan métabolique de base", es: "panel metabólico básico", zh: "基础代谢检查", ar: "لوحة الأيض الأساسية", hi: "बुनियादी चयापचय पैनल", pt: "painel metabólico básico", ko: "기초대사검사", ja: "基礎代謝パネル", de: "Basis-Stoffwechselpanel", vi: "xét nghiệm chuyển hóa cơ bản" }, category: "labs", abbreviation: "BMP", preserveAbbreviation: true },
  { english: "electrocardiogram", translations: { fr: "électrocardiogramme", es: "electrocardiograma", zh: "心电图", ar: "تخطيط كهربية القلب", hi: "इलेक्ट्रोकार्डियोग्राम", pt: "eletrocardiograma", ko: "심전도", ja: "心電図", de: "Elektrokardiogramm", vi: "điện tâm đồ" }, category: "diagnostics", abbreviation: "ECG/EKG", preserveAbbreviation: true },
  { english: "arterial blood gas", translations: { fr: "gaz du sang artériel", es: "gasometría arterial", zh: "动脉血气", ar: "غازات الدم الشرياني", hi: "धमनी रक्त गैस", pt: "gasometria arterial", ko: "동맥혈가스", ja: "動脈血ガス", de: "arterielle Blutgasanalyse", vi: "khí máu động mạch" }, category: "diagnostics", abbreviation: "ABG", preserveAbbreviation: true },
  { english: "chronic obstructive pulmonary disease", translations: { fr: "bronchopneumopathie chronique obstructive", es: "enfermedad pulmonar obstructiva crónica", zh: "慢性阻塞性肺疾病", ar: "مرض الانسداد الرئوي المزمن", hi: "क्रॉनिक ऑब्सट्रक्टिव पल्मोनरी डिजीज", pt: "doença pulmonar obstrutiva crônica", ko: "만성폐쇄성폐질환", ja: "慢性閉塞性肺疾患", de: "chronisch obstruktive Lungenerkrankung", vi: "bệnh phổi tắc nghẽn mạn tính" }, category: "conditions", abbreviation: "COPD", preserveAbbreviation: true },
  { english: "congestive heart failure", translations: { fr: "insuffisance cardiaque congestive", es: "insuficiencia cardíaca congestiva", zh: "充血性心力衰竭", ar: "فشل القلب الاحتقاني", hi: "कंजेस्टिव हार्ट फेल्योर", pt: "insuficiência cardíaca congestiva", ko: "울혈성심부전", ja: "うっ血性心不全", de: "Herzinsuffizienz", vi: "suy tim sung huyết" }, category: "conditions", abbreviation: "CHF", preserveAbbreviation: true },
  { english: "deep vein thrombosis", translations: { fr: "thrombose veineuse profonde", es: "trombosis venosa profunda", zh: "深静脉血栓", ar: "تخثر الأوردة العميقة", hi: "गहरी शिरा घनास्त्रता", pt: "trombose venosa profunda", ko: "심부정맥혈전증", ja: "深部静脈血栓症", de: "tiefe Venenthrombose", vi: "huyết khối tĩnh mạch sâu" }, category: "conditions", abbreviation: "DVT", preserveAbbreviation: true },
  { english: "urinary tract infection", translations: { fr: "infection urinaire", es: "infección del tracto urinario", zh: "尿路感染", ar: "التهاب المسالك البولية", hi: "मूत्र पथ का संक्रमण", pt: "infecção do trato urinário", ko: "요로감염", ja: "尿路感染症", de: "Harnwegsinfektion", vi: "nhiễm trùng đường tiết niệu" }, category: "conditions", abbreviation: "UTI", preserveAbbreviation: true },
  { english: "Glasgow Coma Scale", translations: { fr: "échelle de Glasgow", es: "escala de coma de Glasgow", zh: "格拉斯哥昏迷量表", ar: "مقياس غلاسكو للغيبوبة", hi: "ग्लासगो कोमा स्केल", pt: "escala de coma de Glasgow", ko: "글래스고 혼수 척도", ja: "グラスゴー昏睡尺度", de: "Glasgow-Koma-Skala", vi: "thang điểm Glasgow" }, category: "assessment", abbreviation: "GCS", preserveAbbreviation: true },
  { english: "patient assessment", translations: { fr: "évaluation du patient", es: "evaluación del paciente", zh: "患者评估", ar: "تقييم المريض", hi: "रोगी मूल्यांकन", pt: "avaliação do paciente", ko: "환자 평가", ja: "患者評価", de: "Patientenbeurteilung", vi: "đánh giá bệnh nhân" }, category: "nursing", preserveAbbreviation: false },
  { english: "nursing intervention", translations: { fr: "intervention infirmière", es: "intervención de enfermería", zh: "护理干预", ar: "تدخل تمريضي", hi: "नर्सिंग हस्तक्षेप", pt: "intervenção de enfermagem", ko: "간호 중재", ja: "看護介入", de: "Pflegeintervention", vi: "can thiệp điều dưỡng" }, category: "nursing", preserveAbbreviation: false },
  { english: "medication administration", translations: { fr: "administration des médicaments", es: "administración de medicamentos", zh: "药物管理", ar: "إعطاء الأدوية", hi: "दवा प्रशासन", pt: "administração de medicamentos", ko: "투약", ja: "薬剤投与", de: "Medikamentenverabreichung", vi: "cho thuốc" }, category: "nursing", preserveAbbreviation: false },
  { english: "vital signs", translations: { fr: "signes vitaux", es: "signos vitales", zh: "生命体征", ar: "العلامات الحيوية", hi: "जीवन के लक्षण", pt: "sinais vitais", ko: "활력 징후", ja: "バイタルサイン", de: "Vitalzeichen", vi: "dấu hiệu sinh tồn" }, category: "vital_signs", preserveAbbreviation: false },
  { english: "care plan", translations: { fr: "plan de soins", es: "plan de cuidados", zh: "护理计划", ar: "خطة الرعاية", hi: "देखभाल योजना", pt: "plano de cuidados", ko: "간호 계획", ja: "ケアプラン", de: "Pflegeplan", vi: "kế hoạch chăm sóc" }, category: "nursing", preserveAbbreviation: false },
];

const LANGUAGE_NAMES: Record<string, string> = {
  fr: "French", es: "Spanish", zh: "Chinese (Simplified)", "zh-tw": "Chinese (Traditional)",
  ar: "Arabic", hi: "Hindi", pt: "Portuguese", tl: "Filipino/Tagalog", ko: "Korean",
  ja: "Japanese", de: "German", vi: "Vietnamese", pa: "Punjabi", ur: "Urdu", fa: "Farsi/Persian",
  th: "Thai", tr: "Turkish", id: "Indonesian", ht: "Haitian Creole",
};

export function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] || code;
}

export function getTerminologyPromptBlock(targetLanguage: string): string {
  if (!targetLanguage || targetLanguage === "en") return "";

  const relevantTerms = MEDICAL_TERMINOLOGY.filter(t => t.translations[targetLanguage]);
  if (relevantTerms.length === 0) return "";

  const langName = getLanguageName(targetLanguage);
  const lines = [
    `\nMEDICAL TERMINOLOGY CONSISTENCY (${langName}):`,
    `Use the following standardized translations for key medical terms. Maintain abbreviations in their original form (e.g., BP, HR, IV, COPD).`,
  ];

  const grouped: Record<string, MedicalTerm[]> = {};
  for (const term of relevantTerms) {
    if (!grouped[term.category]) grouped[term.category] = [];
    grouped[term.category].push(term);
  }

  for (const [category, terms] of Object.entries(grouped)) {
    const catLabel = category.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    lines.push(`${catLabel}:`);
    for (const term of terms.slice(0, 8)) {
      const abbr = term.abbreviation ? ` (${term.abbreviation})` : "";
      lines.push(`  - "${term.english}"${abbr} → "${term.translations[targetLanguage]}"`);
    }
  }

  return lines.join("\n");
}

export function getLanguageInstructionBlock(targetLanguage: string): string {
  if (!targetLanguage || targetLanguage === "en") return "";

  const langName = getLanguageName(targetLanguage);

  return `
LANGUAGE REQUIREMENT:
You MUST generate ALL content in ${langName} (language code: ${targetLanguage}).
- All question stems, scenarios, rationales, clinical pearls, and explanations must be written in ${langName}.
- Keep medical abbreviations (BP, HR, IV, COPD, etc.) in their original English/Latin form.
- Keep drug names in their internationally recognized form.
- Keep measurement units in their standard form (mmol/L, mg/dL, etc.).
- Use proper medical terminology in ${langName} — do NOT transliterate English words.
- The "type", "difficulty", "system", "topic" field values should remain in English for database consistency.
- Only the human-readable text fields (stem, scenario, rationale text, exam_pearl, choice text) should be in ${langName}.`;
}
