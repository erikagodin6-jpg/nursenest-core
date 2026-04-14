#!/usr/bin/env node
/**
 * Non-English UI strings for the five core learner/header nav keys where MT often
 * returns English unchanged (ko, pt, vi, ht, ur, ja, fa, de, th, tr, id).
 * Idempotent. Run: node scripts/patch-nav-five-carryover-locales.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const I18N_DIR = path.join(ROOT, "public", "i18n");

const PATCH = {
  ko: {
    "nav.chooseYourExam": "시험 선택",
    "nav.topicAdaptiveTests": "주제별 적응형 테스트",
    "nav.studyPlanShort": "학습 계획",
    "nav.articlesAndTips": "아티클과 팁",
    "nav.caseStudiesShort": "사례 연구",
  },
  pt: {
    "nav.chooseYourExam": "Escolha o seu exame",
    "nav.topicAdaptiveTests": "Testes adaptativos por tópico",
    "nav.studyPlanShort": "Plano de estudo",
    "nav.articlesAndTips": "Artigos e dicas",
    "nav.caseStudiesShort": "Estudos de caso",
  },
  vi: {
    "nav.chooseYourExam": "Chọn kỳ thi của bạn",
    "nav.topicAdaptiveTests": "Bài kiểm tra thích ứng theo chủ đề",
    "nav.studyPlanShort": "Kế hoạch học",
    "nav.articlesAndTips": "Bài viết và mẹo",
    "nav.caseStudiesShort": "Tình huống lâm sàng",
  },
  ht: {
    "nav.chooseYourExam": "Chwazi egzamen ou",
    "nav.topicAdaptiveTests": "Tès adapte pa sijè",
    "nav.studyPlanShort": "Plan etid",
    "nav.articlesAndTips": "Atik ak konsèy",
    "nav.caseStudiesShort": "Ka klinik",
  },
  ur: {
    "nav.chooseYourExam": "اپنا امتحان منتخب کریں",
    "nav.topicAdaptiveTests": "موضوع کے مطابق موافق ٹیسٹ",
    "nav.studyPlanShort": "مطالعہ کا منصوبہ",
    "nav.articlesAndTips": "مضامین اور تجاویز",
    "nav.caseStudiesShort": "کیس اسٹڈیز",
  },
  ja: {
    "nav.chooseYourExam": "試験を選ぶ",
    "nav.topicAdaptiveTests": "トピック別CAT形式テスト",
    "nav.studyPlanShort": "学習プラン",
    "nav.articlesAndTips": "記事とヒント",
    "nav.caseStudiesShort": "症例",
  },
  fa: {
    "nav.chooseYourExam": "انتخاب آزمون",
    "nav.topicAdaptiveTests": "آزمون‌های تطبیقی موضوعی",
    "nav.studyPlanShort": "برنامه مطالعه",
    "nav.articlesAndTips": "مقالات و نکات",
    "nav.caseStudiesShort": "مطالعات موردی",
  },
  de: {
    "nav.chooseYourExam": "Prüfung wählen",
    "nav.topicAdaptiveTests": "Themenadaptive Tests",
    "nav.studyPlanShort": "Lernplan",
    "nav.articlesAndTips": "Artikel und Tipps",
    "nav.caseStudiesShort": "Fallstudien",
  },
  th: {
    "nav.chooseYourExam": "เลือกการสอบของคุณ",
    "nav.topicAdaptiveTests": "แบบทดสอบปรับตามหัวข้อ",
    "nav.studyPlanShort": "แผนการเรียน",
    "nav.articlesAndTips": "บทความและเคล็ดลับ",
    "nav.caseStudiesShort": "เคสศึกษา",
  },
  tr: {
    "nav.chooseYourExam": "Sınavınızı seçin",
    "nav.topicAdaptiveTests": "Konuya göre uyarlanabilir testler",
    "nav.studyPlanShort": "Çalışma planı",
    "nav.articlesAndTips": "Makaleler ve ipuçları",
    "nav.caseStudiesShort": "Vaka çalışmaları",
  },
  id: {
    "nav.chooseYourExam": "Pilih ujian Anda",
    "nav.topicAdaptiveTests": "Tes adaptif per topik",
    "nav.studyPlanShort": "Rencana belajar",
    "nav.articlesAndTips": "Artikel dan tips",
    "nav.caseStudiesShort": "Studi kasus",
  },
  ar: {
    "nav.chooseYourExam": "اختر امتحانك",
    "nav.topicAdaptiveTests": "اختبارات تكيّفية حسب الموضوع",
    "nav.studyPlanShort": "خطة الدراسة",
    "nav.articlesAndTips": "مقالات ونصائح",
    "nav.caseStudiesShort": "دراسات حالة",
  },
  pa: {
    "nav.chooseYourExam": "ਆਪਣੀ ਪਰੀਖਿਆ ਚੁਣੋ",
    "nav.topicAdaptiveTests": "ਵਿਸ਼ਾ-ਅਨੁਕੂਲ ਅਡਾਪਟਿਵ ਟੈਸਟ",
    "nav.studyPlanShort": "ਅਧਿਐਨ ਯੋਜਨਾ",
    "nav.articlesAndTips": "ਲੇਖ ਅਤੇ ਸੁਝਾਅ",
    "nav.caseStudiesShort": "ਕੇਸ ਅਧਿਐਨ",
  },
};

function main() {
  for (const [code, keys] of Object.entries(PATCH)) {
    const p = path.join(I18N_DIR, `${code}.json`);
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    Object.assign(j, keys);
    fs.writeFileSync(p, JSON.stringify(j));
    console.log(`[${code}] patched 5 nav keys`);
  }
}

main();
