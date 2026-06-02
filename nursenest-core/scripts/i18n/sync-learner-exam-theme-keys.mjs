#!/usr/bin/env node
/**
 * Merges missing learner.examTheme.* keys from en.json into every other locale file in public/i18n.
 * Run from nursenest-core: node scripts/i18n/sync-learner-exam-theme-keys.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const i18nDir = join(__dirname, "../../public/i18n");

const en = JSON.parse(readFileSync(join(i18nDir, "en.json"), "utf8"));
const examKeys = Object.keys(en)
  .filter((k) => k.startsWith("learner.examTheme"))
  .sort();

/** Locale code → translations for keys that were added to en after other locales. */
const EXTRA = {
  es: {
    "learner.examTheme.back": "Atrás",
    "learner.examTheme.beginExam": "Comenzar examen",
    "learner.examTheme.previewNext": "Siguiente",
    "learner.examTheme.previewPrevious": "Anterior",
    "learner.examTheme.previewProgress": "Progreso",
  },
  fr: {
    "learner.examTheme.back": "Retour",
    "learner.examTheme.beginExam": "Commencer l’examen",
    "learner.examTheme.previewNext": "Suivant",
    "learner.examTheme.previewPrevious": "Précédent",
    "learner.examTheme.previewProgress": "Progression",
  },
  de: {
    "learner.examTheme.back": "Zurück",
    "learner.examTheme.beginExam": "Prüfung beginnen",
    "learner.examTheme.previewNext": "Weiter",
    "learner.examTheme.previewPrevious": "Zurück",
    "learner.examTheme.previewProgress": "Fortschritt",
  },
  ja: {
    "learner.examTheme.back": "戻る",
    "learner.examTheme.beginExam": "試験を開始",
    "learner.examTheme.previewNext": "次へ",
    "learner.examTheme.previewPrevious": "前へ",
    "learner.examTheme.previewProgress": "進捗",
  },
  ko: {
    "learner.examTheme.back": "뒤로",
    "learner.examTheme.beginExam": "시험 시작",
    "learner.examTheme.previewNext": "다음",
    "learner.examTheme.previewPrevious": "이전",
    "learner.examTheme.previewProgress": "진행률",
  },
  tl: {
    "learner.examTheme.back": "Bumalik",
    "learner.examTheme.beginExam": "Simulan ang exam",
    "learner.examTheme.previewNext": "Susunod",
    "learner.examTheme.previewPrevious": "Nakaraan",
    "learner.examTheme.previewProgress": "Progreso",
  },
  ar: {
    "learner.examTheme.back": "رجوع",
    "learner.examTheme.beginExam": "بدء الامتحان",
    "learner.examTheme.previewNext": "التالي",
    "learner.examTheme.previewPrevious": "السابق",
    "learner.examTheme.previewProgress": "التقدم",
  },
  hi: {
    "learner.examTheme.back": "पीछे",
    "learner.examTheme.beginExam": "परीक्षा शुरू करें",
    "learner.examTheme.previewNext": "अगला",
    "learner.examTheme.previewPrevious": "पिछला",
    "learner.examTheme.previewProgress": "प्रगति",
  },
  zh: {
    "learner.examTheme.back": "返回",
    "learner.examTheme.beginExam": "开始考试",
    "learner.examTheme.previewNext": "下一步",
    "learner.examTheme.previewPrevious": "上一步",
    "learner.examTheme.previewProgress": "进度",
  },
  "zh-tw": {
    "learner.examTheme.back": "返回",
    "learner.examTheme.beginExam": "開始考試",
    "learner.examTheme.previewNext": "下一步",
    "learner.examTheme.previewPrevious": "上一步",
    "learner.examTheme.previewProgress": "進度",
  },
  vi: {
    "learner.examTheme.back": "Quay lại",
    "learner.examTheme.beginExam": "Bắt đầu bài thi",
    "learner.examTheme.previewNext": "Tiếp",
    "learner.examTheme.previewPrevious": "Trước",
    "learner.examTheme.previewProgress": "Tiến độ",
  },
  pt: {
    "learner.examTheme.back": "Voltar",
    "learner.examTheme.beginExam": "Iniciar exame",
    "learner.examTheme.previewNext": "Próximo",
    "learner.examTheme.previewPrevious": "Anterior",
    "learner.examTheme.previewProgress": "Progresso",
  },
  it: {
    "learner.examTheme.back": "Indietro",
    "learner.examTheme.beginExam": "Inizia esame",
    "learner.examTheme.previewNext": "Avanti",
    "learner.examTheme.previewPrevious": "Indietro",
    "learner.examTheme.previewProgress": "Avanzamento",
  },
  ru: {
    "learner.examTheme.back": "Назад",
    "learner.examTheme.beginExam": "Начать экзамен",
    "learner.examTheme.previewNext": "Далее",
    "learner.examTheme.previewPrevious": "Назад",
    "learner.examTheme.previewProgress": "Прогресс",
  },
  tr: {
    "learner.examTheme.back": "Geri",
    "learner.examTheme.beginExam": "Sınavı başlat",
    "learner.examTheme.previewNext": "İleri",
    "learner.examTheme.previewPrevious": "Önceki",
    "learner.examTheme.previewProgress": "İlerleme",
  },
  id: {
    "learner.examTheme.back": "Kembali",
    "learner.examTheme.beginExam": "Mulai ujian",
    "learner.examTheme.previewNext": "Berikutnya",
    "learner.examTheme.previewPrevious": "Sebelumnya",
    "learner.examTheme.previewProgress": "Kemajuan",
  },
  fa: {
    "learner.examTheme.back": "بازگشت",
    "learner.examTheme.beginExam": "شروع آزمون",
    "learner.examTheme.previewNext": "بعدی",
    "learner.examTheme.previewPrevious": "قبلی",
    "learner.examTheme.previewProgress": "پیشرفت",
  },
  ht: {
    "learner.examTheme.back": "Retounen",
    "learner.examTheme.beginExam": "Kòmanse egzamen",
    "learner.examTheme.previewNext": "Pwochen",
    "learner.examTheme.previewPrevious": "Anvan",
    "learner.examTheme.previewProgress": "Pwogrè",
  },
  pa: {
    "learner.examTheme.back": "ਪਿੱਛੇ",
    "learner.examTheme.beginExam": "ਪਰੀਖਿਆ ਸ਼ੁਰੂ ਕਰੋ",
    "learner.examTheme.previewNext": "ਅਗਲਾ",
    "learner.examTheme.previewPrevious": "ਪਿਛਲਾ",
    "learner.examTheme.previewProgress": "ਤਰੱਕੀ",
  },
  ur: {
    "learner.examTheme.back": "واپس",
    "learner.examTheme.beginExam": "امتحان شروع کریں",
    "learner.examTheme.previewNext": "اگلا",
    "learner.examTheme.previewPrevious": "پچھلا",
    "learner.examTheme.previewProgress": "پیش رفت",
  },
  th: {
    "learner.examTheme.back": "กลับ",
    "learner.examTheme.beginExam": "เริ่มสอบ",
    "learner.examTheme.previewNext": "ถัดไป",
    "learner.examTheme.previewPrevious": "ก่อนหน้า",
    "learner.examTheme.previewProgress": "ความคืบหน้า",
  },
  te: {
    "learner.examTheme.back": "వెనక్కి",
    "learner.examTheme.beginExam": "పరీక్ష ప్రారంభించు",
    "learner.examTheme.previewNext": "తర్వాత",
    "learner.examTheme.previewPrevious": "మునుపటి",
    "learner.examTheme.previewProgress": "ప్రగతి",
  },
  ta: {
    "learner.examTheme.back": "பின்",
    "learner.examTheme.beginExam": "தேர்வைத் தொடங்கு",
    "learner.examTheme.previewNext": "அடுத்து",
    "learner.examTheme.previewPrevious": "முந்தைய",
    "learner.examTheme.previewProgress": "முன்னேற்றம்",
  },
  mr: {
    "learner.examTheme.back": "मागे",
    "learner.examTheme.beginExam": "परीक्षा सुरू करा",
    "learner.examTheme.previewNext": "पुढे",
    "learner.examTheme.previewPrevious": "मागील",
    "learner.examTheme.previewProgress": "प्रगती",
  },
  bn: {
    "learner.examTheme.back": "পিছনে",
    "learner.examTheme.beginExam": "পরীক্ষা শুরু করুন",
    "learner.examTheme.previewNext": "পরবর্তী",
    "learner.examTheme.previewPrevious": "পূর্ববর্তী",
    "learner.examTheme.previewProgress": "অগ্রগতি",
  },
  gu: {
    "learner.examTheme.back": "પાછા",
    "learner.examTheme.beginExam": "પરીક્ષા શરૂ કરો",
    "learner.examTheme.previewNext": "આગળ",
    "learner.examTheme.previewPrevious": "પાછલું",
    "learner.examTheme.previewProgress": "પ્રગતિ",
  },
  hu: {
    "learner.examTheme.back": "Vissza",
    "learner.examTheme.beginExam": "Vizsga indítása",
    "learner.examTheme.previewNext": "Következő",
    "learner.examTheme.previewPrevious": "Előző",
    "learner.examTheme.previewProgress": "Haladás",
  },
};

const fallback = {
  "learner.examTheme.back": en["learner.examTheme.back"],
  "learner.examTheme.beginExam": en["learner.examTheme.beginExam"],
  "learner.examTheme.previewNext": en["learner.examTheme.previewNext"],
  "learner.examTheme.previewPrevious": en["learner.examTheme.previewPrevious"],
  "learner.examTheme.previewProgress": en["learner.examTheme.previewProgress"],
};

let updated = 0;
for (const name of readdirSync(i18nDir)) {
  if (!name.endsWith(".json") || name === "en.json") continue;
  const path = join(i18nDir, name);
  const locale = name.replace(/\.json$/, "");
  const data = JSON.parse(readFileSync(path, "utf8"));
  let changed = false;
  const pack = EXTRA[locale] ?? fallback;
  for (const key of examKeys) {
    if (data[key] === undefined) {
      data[key] = pack[key] ?? en[key];
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(path, `${JSON.stringify(data)}\n`);
    updated++;
  }
}
console.log(`Updated ${updated} locale file(s); merged ${examKeys.length} learner.examTheme keys where missing.`);
