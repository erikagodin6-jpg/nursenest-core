/**
 * Language + locale metadata for deterministic international nursing long-tail batch.
 * Slug prefix uses ASCII (Next validators: kebab-case [a-z0-9-]).
 */
export type IntlNursingLangKey = "es" | "fr" | "pt" | "ar" | "hi" | "tl" | "zh-Hans" | "ja";

export type IntlNursingLangSpec = {
  key: IntlNursingLangKey;
  /** Frontmatter + record */
  locale: string;
  languageCode: string;
  /** ASCII slug prefix */
  slugPrefix: string;
  category: string;
  /** Exam / licensing frame for this audience (native phrasing) */
  examFrame: string;
  /** Premium CTA closing sentence (target language) */
  premiumCta: string;
};

export const INTL_NURSING_LANGS: IntlNursingLangSpec[] = [
  {
    key: "es",
    locale: "es",
    languageCode: "es",
    slugPrefix: "es-intl",
    category: "International nursing licensing (Spanish)",
    examFrame: "NCLEX-RN, exámenes de equivalencia y adaptación internacional",
    premiumCta:
      "Conecta esta lectura con la práctica guiada de NurseNest para consolidar razonamiento clínico, seguridad del paciente y vocabulario de examen.",
  },
  {
    key: "fr",
    locale: "fr",
    languageCode: "fr",
    slugPrefix: "fr-intl",
    category: "International nursing licensing (French)",
    examFrame: "épreuves d’adaptation, concours IFSI et mobilité professionnelle internationale",
    premiumCta:
      "Enchaîne avec les parcours d’entraînement NurseNest pour ancrer priorités de soins, sécurité et culture professionnelle française.",
  },
  {
    key: "pt",
    locale: "pt",
    languageCode: "pt",
    slugPrefix: "pt-intl",
    category: "International nursing licensing (Portuguese)",
    examFrame: "Revalida, concursos hospitalares e preparação para atuação em sistemas de saúde lusófonos",
    premiumCta:
      "Use os percursos NurseNest para treinar julgamento clínico, comunicação e priorização com o mesmo vocabulário dos cenários de prova.",
  },
  {
    key: "ar",
    locale: "ar",
    languageCode: "ar",
    slugPrefix: "ar-intl",
    category: "International nursing licensing (Arabic)",
    examFrame: "اختبارات الترخيص والتكييف السريري في بيئات الرعاية العربية",
    premiumCta:
      "أكمل التحضير عبر مسارات NurseNest التدريبية لربط المفاهيم بأسئلة الامتحان وبأولويات السلامة السريرية.",
  },
  {
    key: "hi",
    locale: "hi",
    languageCode: "hi",
    slugPrefix: "hi-intl",
    category: "International nursing licensing (Hindi)",
    examFrame: "NCLEX, CGFNS/visa screen तैयारी और अंतर्राष्ट्रीय नैदानिक संदर्भ",
    premiumCta:
      "NurseNest अभ्यास पथों के साथ इस लेख को जोड़ें ताकि परीक्षा शब्दावली और सुरक्षित नैदानिक निर्णय दोनों मजबूत हों।",
  },
  {
    key: "tl",
    locale: "fil",
    languageCode: "tl",
    slugPrefix: "tl-intl",
    category: "International nursing licensing (Tagalog)",
    examFrame: "NCLEX, CGFNS, at pandaigdigang klinikal na pagsasanay para sa mga RN",
    premiumCta:
      "Ituloy sa NurseNest practice pathways upang pagsanayin ang pagsusuri, komunikasyon, at priyoridad na gaya ng sa aktwal na exam.",
  },
  {
    key: "zh-Hans",
    locale: "zh-Hans",
    languageCode: "zh-Hans",
    slugPrefix: "zh-hans-intl",
    category: "International nursing licensing (Chinese Simplified)",
    examFrame: "国际护士执业考试准备与临床安全思维",
    premiumCta:
      "结合 NurseNest 练习路径，把本文要点转化为可重复的临床判断与考试用语训练。",
  },
  {
    key: "ja",
    locale: "ja",
    languageCode: "ja",
    slugPrefix: "ja-intl",
    category: "International nursing licensing (Japanese)",
    examFrame: "国際看護師試験・臨床適応と患者安全の学習枠組み",
    premiumCta:
      "NurseNest の学習パスで演習を重ね、本文の優先順位づけを試験レベルの判断速度まで高めてください。",
  },
];

/** Stable internal blog slugs (existing corpus) for cross-links — labels localized in body builder. */
export const INTL_LONGTAIL_INTERNAL_SLUGS = [
  "uk-nmc-cbt-exam-study-guide-international-nurses",
  "uk-nmc-registration-pathway-explained-overseas-nurses",
  "ahpra-nurse-registration-pathway-international-educational-overview",
  "nhs-sepsis-screening-recognition-nursing-overview",
  "news2-national-early-warning-score2-nurses-guide",
] as const;
