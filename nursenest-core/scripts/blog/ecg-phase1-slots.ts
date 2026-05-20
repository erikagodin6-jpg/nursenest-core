/**
 * Deterministic multilingual clause banks for ECG long-tail generation (no external APIs).
 * Slot combinations reduce templated repetition while keeping professional clinical register.
 */

export type LangCode = "en" | "es" | "fr" | "pt" | "ar" | "hi" | "tl" | "zh" | "ja";

export const LANG_META: Record<
  LangCode,
  { locale: string; languageCode: string; dir: "ltr" | "rtl" }
> = {
  en: { locale: "en-US", languageCode: "en", dir: "ltr" },
  es: { locale: "es-ES", languageCode: "es", dir: "ltr" },
  fr: { locale: "fr-FR", languageCode: "fr", dir: "ltr" },
  pt: { locale: "pt-BR", languageCode: "pt", dir: "ltr" },
  ar: { locale: "ar-SA", languageCode: "ar", dir: "rtl" },
  hi: { locale: "hi-IN", languageCode: "hi", dir: "ltr" },
  tl: { locale: "tl-PH", languageCode: "tl", dir: "ltr" },
  zh: { locale: "zh-CN", languageCode: "zh", dir: "ltr" },
  ja: { locale: "ja-JP", languageCode: "ja", dir: "ltr" },
};

/** Seeded PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rpick<T>(rand: () => number, arr: readonly T[]): T {
  if (arr.length === 0) throw new Error("empty pick");
  return arr[Math.floor(rand() * arr.length)]!;
}

const SLOTS_EN = {
  rhythm: [
    "sinus rhythm",
    "atrial fibrillation",
    "atrial flutter",
    "AV nodal reentrant tachycardia",
    "ventricular tachycardia",
    "torsades de pointes",
    "complete heart block",
    "paced rhythm",
    "junctional escape",
    "sinus bradycardia",
    "sinus tachycardia",
    "premature ventricular complexes",
    "Wolff-Parkinson-White pattern",
    "left bundle branch block",
    "right bundle branch block",
  ],
  lead: [
    "lead I",
    "lead II",
    "lead III",
    "aVR",
    "aVL",
    "aVF",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
  ],
  finding: [
    "ST elevation",
    "ST depression",
    "T-wave inversion",
    "pathologic Q waves",
    "PR prolongation",
    "delta wave",
    "epsilon wave",
    "Osborn J waves",
    "peaked T waves",
    "hyperacute T waves",
    "prolonged QT interval",
    "short QT interval",
    "electrical alternans",
    "poor R-wave progression",
    "left axis deviation",
    "right axis deviation",
  ],
  context: [
    "acute chest pain",
    "syncope",
    "palpitations",
    "post-cardiac surgery",
    "renal failure",
    "digitalis effect",
    "pericarditis",
    "pulmonary embolism",
    "hyperkalemia",
    "hypokalemia",
    "hypothermia",
    "toxicologic exposure",
    "sepsis",
    "pregnancy",
    "athletic training",
  ],
};

const SLOTS_ES: typeof SLOTS_EN = {
  rhythm: [
    "ritmo sinusal",
    "fibrilación auricular",
    "flutter auricular",
    "taquicardia por reentrada nodal AV",
    "taquicardia ventricular",
    "torsades de pointes",
    "bloqueo AV completo",
    "ritmo estimulado",
    "escape yuncional",
    "bradicardia sinusal",
    "taquicardia sinusal",
    "extrasístoles ventriculares",
    "patrón de Wolff-Parkinson-White",
    "bloqueo de rama izquierda",
    "bloqueo de rama derecha",
  ],
  lead: [
    "derivación I",
    "derivación II",
    "derivación III",
    "aVR",
    "aVL",
    "aVF",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
  ],
  finding: [
    "elevación del segmento ST",
    "depresión del segmento ST",
    "inversión de la onda T",
    "ondas Q patológicas",
    "prolongación del PR",
    "onda delta",
    "onda epsilon",
    "ondas J de Osborn",
    "ondas T picudas",
    "ondas T hiperagudas",
    "intervalo QT prolongado",
    "intervalo QT corto",
    "alternancia eléctrica",
    "mala progresión de la onda R",
    "desviación del eje a la izquierda",
    "desviación del eje a la derecha",
  ],
  context: [
    "dolor torácico agudo",
    "síncope",
    "palpitaciones",
    "postoperatorio cardíaco",
    "insuficiencia renal",
    "efecto digitálico",
    "pericarditis",
    "embolismo pulmonar",
    "hiperpotasemia",
    "hipopotasemia",
    "hipotermia",
    "exposición toxicológica",
    "sepsis",
    "embarazo",
    "entrenamiento deportivo",
  ],
};

const SLOTS_FR: typeof SLOTS_EN = {
  rhythm: [
    "rythme sinusal",
    "fibrillation auriculaire",
    "flutter auriculaire",
    "tachycardie jonctionnelle réentrante",
    "tachycardie ventriculaire",
    "torsades de pointes",
    "bloc auriculo-ventriculaire complet",
    "rythme stimulé",
    "échappement jonctionnel",
    "bradycardie sinusale",
    "tachycardie sinusale",
    "extrasystoles ventriculaires",
    "syndrome de Wolff-Parkinson-White",
    "bloc de branche gauche",
    "bloc de branche droit",
  ],
  lead: [
    "dérivation I",
    "dérivation II",
    "dérivation III",
    "aVR",
    "aVL",
    "aVF",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
  ],
  finding: [
    "sus-décalage du segment ST",
    "sous-décalage du segment ST",
    "onde T négative",
    "onde Q pathologique",
    "allongement du PR",
    "onde delta",
    "onde epsilon",
    "ondes J d’Osborn",
    "onde T pointue",
    "onde T hyperaiguë",
    "QT long",
    "QT court",
    "alternance électrique",
    "mauvaise progression de l’onde R",
    "déviation axiale gauche",
    "déviation axiale droite",
  ],
  context: [
    "douleur thoracique aiguë",
    "syncope",
    "palpitations",
    "post-chirurgie cardiaque",
    "insuffisance rénale",
    "effet digitalique",
    "péricardite",
    "embolie pulmonaire",
    "hyperkaliémie",
    "hypokaliémie",
    "hypothermie",
    "exposition toxicologique",
    "sepsis",
    "grossesse",
    "entraînement sportif",
  ],
};

const SLOTS_PT: typeof SLOTS_EN = {
  rhythm: [
    "ritmo sinusal",
    "fibrilação atrial",
    "flutter atrial",
    "taquicardia por reentrada nodal AV",
    "taquicardia ventricular",
    "torsades de pointes",
    "bloqueio AV completo",
    "ritmo marcapasso",
    "escape nodal",
    "bradicardia sinusal",
    "taquicardia sinusal",
    "extrassístoles ventriculares",
    "padrão de Wolff-Parkinson-White",
    "bloqueio de ramo esquerdo",
    "bloqueio de ramo direito",
  ],
  lead: [
    "derivação I",
    "derivação II",
    "derivação III",
    "aVR",
    "aVL",
    "aVF",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
  ],
  finding: [
    "supradesnivelamento do segmento ST",
    "infradesnivelamento do segmento ST",
    "inversão da onda T",
    "ondas Q patológicas",
    "prolongamento do PR",
    "onda delta",
    "onda epsilon",
    "ondas J de Osborn",
    "ondas T apiculadas",
    "ondas T hiperagudas",
    "intervalo QT prolongado",
    "intervalo QT curto",
    "alternância elétrica",
    "má progressão da onda R",
    "desvio do eixo à esquerda",
    "desvio do eixo à direita",
  ],
  context: [
    "dor torácica aguda",
    "síncope",
    "palpitações",
    "pós-cirurgia cardíaca",
    "insuficiência renal",
    "efeito digitálico",
    "pericardite",
    "embolia pulmonar",
    "hipercalemia",
    "hipocalemia",
    "hipotermia",
    "exposição toxicológica",
    "sepse",
    "gravidez",
    "treinamento atlético",
  ],
};

const SLOTS_AR: typeof SLOTS_EN = {
  rhythm: [
    "إيقاع جيبي",
    "رجفان أذيني",
    "رفرفة أذينية",
    "تسرع أذيني رجيع عقدي",
    "تسرع بطيني",
    "torsades de pointes",
    "حصار أذيني بطيني كامل",
    "إيقاع مُحفَّز",
    "هروب عقدي",
    "بطء جيبي",
    "تسرع جيبي",
    "انقباضات بطينية مبكرة",
    "نمط وولف باركنسون وايت",
    "حصار فرعي أيمن",
    "حصار فرعي أيسر",
  ],
  lead: [
    "سِلك I",
    "سِلك II",
    "سِلك III",
    "aVR",
    "aVL",
    "aVF",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
  ],
  finding: [
    "ارتفاع مقطع ST",
    "انخفاض مقطع ST",
    "قلب موجة T",
    "موجات Q مرضية",
    "إطالة فترة PR",
    "موجة دلتا",
    "موجة إبسيلون",
    "موجات J أوسبورن",
    "موجات T مدببة",
    "موجات T فرط حدة",
    "فترة QT ممتدة",
    "فترة QT قصيرة",
    "تناوب كهربائي",
    "تقدم ضعيف لموجة R",
    "انحراف المحور إلى اليسار",
    "انحراف المحور إلى اليمين",
  ],
  context: [
    "ألم صدر حاد",
    "إغماء",
    "خفقان",
    "بعد جراحة قلبية",
    "فشل كلوي",
    "تأثير الديجيتاليس",
    "التامورات",
    "انسداد رئوي",
    "فرط بوتاسيوم الدم",
    "نقص بوتاسيوم الدم",
    "انخفاض حرارة",
    "تعرض سمي",
    "إنتان",
    "حمل",
    "تدريب رياضي",
  ],
};

const SLOTS_HI: typeof SLOTS_EN = {
  rhythm: [
    "साइनस लय",
    "एट्रियल फाइब्रिलेशन",
    "एट्रियल फ्लटर",
    "एवी नोडल रीएंट्रेंट टैकीकार्डिया",
    "वेंट्रिकुलर टैकीकार्डिया",
    "torsades de pointes",
    "संपूर्ण एवी ब्लॉक",
    "पेस्ड लय",
    "जंक्शनल एस्केप",
    "साइनस ब्रैडीकार्डिया",
    "साइनस टैकीकार्डिया",
    "वेंट्रिकुलर प्रीमेच्योर कॉम्प्लेक्स",
    "वोल्फ-पार्किंसन-व्हाइट पैटर्न",
    "लेफ्ट बंडल ब्रांच ब्लॉक",
    "राइट बंडल ब्रांच ब्लॉक",
  ],
  lead: [
    "लीड I",
    "लीड II",
    "लीड III",
    "aVR",
    "aVL",
    "aVF",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
  ],
  finding: [
    "एसटी एलिवेशन",
    "एसटी डिप्रेशन",
    "टी-वेव इनवर्जन",
    "पैथोलॉजिक क्यू वेव्स",
    "पीआर प्रोलॉन्गेशन",
    "डेल्टा वेव",
    "एप्सिलॉन वेव",
    "ऑस्बॉर्न जे वेव्स",
    "पीक्ड टी वेव्स",
    "हाइपरएक्यूट टी वेव्स",
    "लंबा क्यूटी अंतराल",
    "छोटा क्यूटी अंतराल",
    "इलेक्ट्रिकल ऑल्टरनेंस",
    "कमजोर आर-वेव प्रोग्रेशन",
    "बायां अक्ष विचलन",
    "दायां अक्ष विचलन",
  ],
  context: [
    "तीव्र वक्ष पीड़ा",
    "सिंकोप",
    "धड़कन",
    "हृदय शल्यचिकित्सा के बाद",
    "वृक्क अपर्याप्तता",
    "डिजिटैलिस प्रभाव",
    "पेरिकार्डाइटिस",
    "पल्मोनरी एम्बोलिज्म",
    "हाइपरकलेमिया",
    "हाइपोकलेमिया",
    "हाइपोथर्मिया",
    "विषाक्त संपर्क",
    "सेप्सिस",
    "गर्भावस्था",
    "खेल प्रशिक्षण",
  ],
};

const SLOTS_TL: typeof SLOTS_EN = {
  rhythm: [
    "sinus rhythm",
    "atrial fibrillation",
    "atrial flutter",
    "AV nodal reentrant tachycardia",
    "ventricular tachycardia",
    "torsades de pointes",
    "kumpletong AV block",
    "paced rhythm",
    "junctional escape",
    "sinus bradycardia",
    "sinus tachycardia",
    "premature ventricular complexes",
    "Wolff-Parkinson-White pattern",
    "left bundle branch block",
    "right bundle branch block",
  ],
  lead: SLOTS_EN.lead,
  finding: [
    "elebasyon ng ST segment",
    "depresyon ng ST segment",
    "baligtad na T wave",
    "pathologic Q waves",
    "pinahaba na PR interval",
    "delta wave",
    "epsilon wave",
    "Osborn J waves",
    "matulis na T waves",
    "hyperacute T waves",
    "pinahabang QT interval",
    "maikling QT interval",
    "electrical alternans",
    "mahinang R-wave progression",
    "left axis deviation",
    "right axis deviation",
  ],
  context: [
    "matinding pananakit ng dibdib",
    "pagkahilo o pagkawala ng malay",
    "palpitasyon",
    "pagkatapos ng operasyon sa puso",
    "bato na hindi gumagana nang maayos",
    "epekto ng digitalis",
    "pericarditis",
    "pulmonary embolism",
    "mataas na potassium sa dugo",
    "mababang potassium sa dugo",
    "hypothermia",
    "pagkalantad sa lason",
    "sepsis",
    "pagbubuntis",
    "pagsasanay sa sports",
  ],
};

const SLOTS_ZH: typeof SLOTS_EN = {
  rhythm: [
    "窦性心律",
    "心房颤动",
    "心房扑动",
    "房室结折返性心动过速",
    "室性心动过速",
    "尖端扭转型室速",
    "三度房室传导阻滞",
    "起搏心律",
    "交界性逸搏",
    "窦性心动过缓",
    "窦性心动过速",
    "室性期前收缩",
    "预激综合征",
    "左束支传导阻滞",
    "右束支传导阻滞",
  ],
  lead: ["I导联", "II导联", "III导联", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"],
  finding: [
    "ST段抬高",
    "ST段压低",
    "T波倒置",
    "病理性Q波",
    "PR间期延长",
    "delta波",
    "epsilon波",
    "Osborn J波",
    "T波高尖",
    "超急性期T波",
    "QT间期延长",
    "QT间期缩短",
    "电交替",
    "R波递增不良",
    "电轴左偏",
    "电轴右偏",
  ],
  context: [
    "急性胸痛",
    "晕厥",
    "心悸",
    "心脏术后",
    "肾功能不全",
    "洋地黄效应",
    "心包炎",
    "肺栓塞",
    "高钾血症",
    "低钾血症",
    "低体温",
    "毒物暴露",
    "脓毒症",
    "妊娠",
    "运动训练",
  ],
};

const SLOTS_JA: typeof SLOTS_EN = {
  rhythm: [
    "洞調律",
    "心房細動",
    "心房粗動",
    "房室結再入性頻拍",
    "心室頻拍",
    "Torsades de pointes",
    "完全房室ブロック",
    "ペーシング調律",
    "接合部逸脱調律",
    "洞性徐脈",
    "洞性頻脈",
    "心室性期外収縮",
    "WPW症候群所見",
    "左脚ブロック",
    "右脚ブロック",
  ],
  lead: [
    "誘導I",
    "誘導II",
    "誘導III",
    "aVR",
    "aVL",
    "aVF",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
  ],
  finding: [
    "ST上昇",
    "ST低下",
    "T波陰転",
    "病的Q波",
    "PR延長",
    "デルタ波",
    "イプシロン波",
    "Osborn J波",
    "T波尖鋭化",
    "超急性期T波",
    "QT延長",
    "QT短縮",
    "電気的交替",
    "R波進行不良",
    "電軸左偏位",
    "電軸右偏位",
  ],
  context: [
    "急性胸痛",
    "失神",
    "動悸",
    "心臓手術後",
    "腎不全",
    "ジギタリス影響",
    "心膜炎",
    "肺塞栓症",
    "高カリウム血症",
    "低カリウム血症",
    "低体温",
    "毒物曝露",
    "敗血症",
    "妊娠",
    "運動トレーニング",
  ],
};

export function slotsFor(lang: LangCode): typeof SLOTS_EN {
  switch (lang) {
    case "en":
      return SLOTS_EN;
    case "es":
      return SLOTS_ES;
    case "fr":
      return SLOTS_FR;
    case "pt":
      return SLOTS_PT;
    case "ar":
      return SLOTS_AR;
    case "hi":
      return SLOTS_HI;
    case "tl":
      return SLOTS_TL;
    case "zh":
      return SLOTS_ZH;
    case "ja":
      return SLOTS_JA;
    default:
      return SLOTS_EN;
  }
}

export function sentenceForLang(lang: LangCode, rand: () => number, topicTitle: string): string {
  const S = slotsFor(lang);
  const r = rpick(rand, S.rhythm);
  const L = rpick(rand, S.lead);
  const f = rpick(rand, S.finding);
  const c = rpick(rand, S.context);

  if (lang === "en") {
    return `When teaching ${topicTitle}, emphasize that ${r} may coexist with ${c}; correlate ${f} across ${L} with symptoms, vitals, and prior tracings rather than interpreting a single complex in isolation.`;
  }
  if (lang === "es") {
    return `Al abordar ${topicTitle}, conviene recordar que ${r} puede asociarse a ${c}; integre ${f} en ${L} con síntomas, constantes y trazos previos en lugar de aislarse en un solo complejo.`;
  }
  if (lang === "fr") {
    return `Pour ${topicTitle}, soulignez que ${r} peut s’associer à ${c}; reliez ${f} sur ${L} aux symptômes, constantes et tracés antérieurs plutôt qu’à un complexe isolé.`;
  }
  if (lang === "pt") {
    return `Em ${topicTitle}, destaque que ${r} pode coexistir com ${c}; correlacione ${f} em ${L} com sintomas, sinais vitais e traçados anteriores, evitando leitura isolada de um único complexo.`;
  }
  if (lang === "ar") {
    return `عند شرح ${topicTitle}، لاحظ أن ${r} قد يرافق ${c}؛ وازن بين ${f} في ${L} والأعراض والعلامات الحيوية وتخطيطات سابقة بدل الاعتماد على معقد واحد.`;
  }
  if (lang === "hi") {
    return `${topicTitle} पढ़ाते समय याद दिलाएँ कि ${r} के साथ ${c} हो सकता है; ${L} में ${f} को लक्षणों, वाइटल्स और पुराने ट्रेस से जोड़ें, न कि केवल एक कॉम्प्लेक्स से।`;
  }
  if (lang === "tl") {
    return `Sa ${topicTitle}, bigyang-diin na maaaring magkasama ang ${r} at ${c}; iugnay ang ${f} sa ${L} sa sintomas, vital signs, at dating tracing—iwasang magdesisyon mula sa isang complex lamang.`;
  }
  if (lang === "zh") {
    return `讲解${topicTitle}时，请强调${r}可与${c}并存；应在${L}上把${f}与症状、生命体征及既往心电图对照，而非仅凭单个心搏判断。`;
  }
  if (lang === "ja") {
    return `「${topicTitle}」では、${r}が${c}と併存しうる点を強調し、${L}の${f}を症状・バイタル・既往心電図と対応づけ、単一の複合体だけで判断しない訓練を積ませます。`;
  }
  return "";
}
