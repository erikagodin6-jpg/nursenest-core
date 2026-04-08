#!/usr/bin/env node
/**
 * Idempotent manual copy for high-traffic nav keys (priority marketing locales).
 * Run after `npm run i18n:nav-parity-fill`. Safe to re-run: overwrites listed keys only.
 *
 * Usage (from nursenest-core/): node scripts/nav-i18n-manual-overrides.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAuditedKeys } from "./lib/nav-i18n-audit.mjs";
import { ensureRequiredEnNavKeys } from "./lib/ensure-en-nav-keys.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EN_PATH = path.join(ROOT, "public/i18n", "en.json");
const I18N_DIR = path.join(ROOT, "public", "i18n");

/** Priority locales: natural, concise nursing-exam product UI wording. */
export const MANUAL_NAV_OVERRIDES = {
  fr: {
    "nav.marketingExplore": "Pour qui ?",
    "nav.study": "Apprendre et pratiquer",
    "nav.resources": "Guides et forfaits",
    "nav.chooseYourExam": "Choisir son examen",
    "nav.examPrepShort": "Examens",
    "dashboard.breadcrumbDashboard": "Tableau de bord",
    "dashboard.breadcrumbHome": "Accueil",
    "nav.topicAdaptiveTests": "Tests adaptatifs par thème",
    "nav.studyPlanShort": "Plan d’études",
    "nav.articlesAndTips": "Articles et conseils",
    "nav.caseStudiesShort": "Cas cliniques",
    "footer.studyTools": "Outils d’étude",
    "footer.examPrep": "Préparation aux examens",
    "footer.resources": "Ressources",
    "nav.lessons": "Leçons",
    "nav.practice": "Entraînement",
    "nav.questionBank": "Banque de questions",
    "nav.flashcards": "Cartes mémoire",
    "nav.testBank": "Banque de tests",
    "nav.practiceExams": "Examens blancs",
    "nav.examPrep": "Préparation aux examens",
    "nav.learnerApp": "Appli élève",
    "nav.login": "Connexion",
    "nav.logIn": "Connexion",
    "nav.pricing": "Tarifs",
    "brand.homeAriaLabel": "Accueil NurseNest",
    "nav.studyDecks": "Decks d’étude",
    "nav.studyDecksDesc":
      "Créez des decks de cartes, révisez en modes Apprentissage et Test",
    "nav.simulators": "Simulateurs",
    "footer.about": "À propos",
    "footer.privacy": "Confidentialité",
    "footer.faq": "FAQ",
  },
  es: {
    "nav.marketingExplore": "A quién ayudamos",
    "nav.study": "Aprender y practicar",
    "nav.resources": "Guías y planes",
    "nav.chooseYourExam": "Elige tu examen",
    "nav.examPrepShort": "Exámenes",
    "dashboard.breadcrumbDashboard": "Panel",
    "dashboard.breadcrumbHome": "Inicio",
    "nav.topicAdaptiveTests": "Exámenes adaptativos por tema",
    "nav.studyPlanShort": "Plan de estudio",
    "nav.articlesAndTips": "Artículos y consejos",
    "nav.caseStudiesShort": "Casos clínicos",
    "footer.studyTools": "Herramientas de estudio",
    "footer.examPrep": "Preparación de exámenes",
    "footer.resources": "Recursos",
    "nav.questionBank": "Banco de preguntas",
    "nav.logIn": "Iniciar sesión",
    "nav.openMenu": "Abrir menú",
    "nav.practiceExams": "Simulacros",
    "nav.testBank": "Banco de pruebas",
    "nav.examPrep": "Preparación del examen",
    "nav.learnerApp": "App del estudiante",
    "brand.homeAriaLabel": "Inicio de NurseNest",
    "nav.studyDecks": "Mazos de estudio",
    "nav.studyDecksDesc":
      "Crea mazos de tarjetas y estudia con los modos Aprender y Probar",
    "nav.simulators": "Simuladores",
    "footer.blog": "Blog",
  },
  pa: {
    "nav.marketingExplore": "ਅਸੀਂ ਕਿਨ੍ਹਾਂ ਦੀ ਮਦਦ ਕਰਦੇ ਹਾਂ",
    "nav.study": "ਸਿੱਖੋ ਅਤੇ ਅਭਿਆਸ ਕਰੋ",
    "nav.resources": "ਗਾਈਡਾਂ ਅਤੇ ਯੋਜਨਾਵਾਂ",
    "nav.chooseYourExam": "ਆਪਣੀ ਪਰੀਖਿਆ ਚੁਣੋ",
    "nav.examPrepShort": "ਪਰੀਖਿਆ ਦੀ ਤਿਆਰੀ",
    "dashboard.breadcrumbDashboard": "ਡੈਸ਼ਬੋਰਡ",
    "dashboard.breadcrumbHome": "ਹੋਮ",
    "nav.topicAdaptiveTests": "ਵਿਸ਼ਾ-ਅਨੁਕੂਲ ਅਡਾਪਟਿਵ ਟੈਸਟ",
    "nav.studyPlanShort": "ਅਧਿਐਨ ਯੋਜਨਾ",
    "nav.articlesAndTips": "ਲੇਖ ਅਤੇ ਸੁਝਾਅ",
    "nav.caseStudiesShort": "ਕੇਸ ਅਧਿਐਨ",
    "footer.studyTools": "ਅਧਿਐਨ ਟੂਲ",
    "footer.examPrep": "ਪਰੀਖਿਆ ਤਿਆਰੀ",
    "footer.resources": "ਸਰੋਤ",
    "nav.home": "ਹੋਮ",
    "nav.tools": "ਸਾਧਨ",
    "nav.testBank": "ਟੈਸਟ ਬੈਂਕ",
    "footer.pricing": "ਕੀਮਤਾਂ",
    "brand.homeAriaLabel": "NurseNest ਹੋਮ",
    "nav.studyDecks": "ਫ਼ਲੈਸ਼ਕਾਰਡ ਡੇਕ",
    "nav.studyDecksDesc":
      "ਫ਼ਲੈਸ਼ਕਾਰਡ ਡੇਕ ਬਣਾਓ, ਸਿੱਖੋ ਅਤੇ ਟੈਸਟ ਮੋਡਾਂ ਨਾਲ ਪੜ੍ਹੋ",
    "nav.simulators": "ਸਿਮੂਲੇਟਰ",
    "home.region.caDesc":
      "REx-PN, NCLEX-RN, NP ਪ੍ਰੀਖਿਆ ਸਮੱਗਰੀ — ਕਨੇਡਾਈ ਮਾਪ (°C, kg, cm) ਅਤੇ RPN ਸ਼ਬਦਾਵਲੀ।",
    "home.region.usDesc":
      "NCLEX-PN, NCLEX-RN, AANP/ANCC ਪ੍ਰੀਖਿਆ ਸਮੱਗਰੀ — ਅਮਰੀਕੀ ਮਾਪ (°F, lbs, in) ਅਤੇ LPN/LVN ਸ਼ਬਦਾਵਲੀ।",
  },
  hi: {
    "nav.marketingExplore": "हम किसकी मदद करते हैं",
    "nav.study": "सीखें और अभ्यास करें",
    "nav.resources": "गाइड और प्लान",
    "nav.chooseYourExam": "अपनी परीक्षा चुनें",
    "nav.examPrepShort": "परीक्षाएँ",
    "dashboard.breadcrumbDashboard": "डैशबोर्ड",
    "dashboard.breadcrumbHome": "होम",
    "nav.topicAdaptiveTests": "विषय के अनुकूल टेस्ट",
    "nav.studyPlanShort": "अध्ययन योजना",
    "nav.articlesAndTips": "लेख और सुझाव",
    "nav.caseStudiesShort": "केस अध्ययन",
    "footer.studyTools": "अध्ययन उपकरण",
    "footer.examPrep": "परीक्षा तैयारी",
    "footer.resources": "संसाधन",
    "nav.dashboard": "मेरा डैशबोर्ड",
    "nav.home": "होम",
    "nav.login": "लॉग इन",
    "nav.logIn": "लॉग इन",
    "nav.pricing": "मूल्य",
    "nav.testBank": "टेस्ट बैंक",
    "nav.flashcards": "फ़्लैश कार्ड",
    "brand.homeAriaLabel": "NurseNest होम",
    "nav.studyDecks": "फ़्लैशकार्ड डेक",
    "nav.studyDecksDesc":
      "फ़्लैशकार्ड डेक बनाएँ, सीखें और टेस्ट मोड में पढ़ें",
    "nav.simulators": "सिम्युलेटर",
  },
  zh: {
    "nav.marketingExplore": "服务对象",
    "nav.study": "学习与练习",
    "nav.resources": "指南与方案",
    "nav.chooseYourExam": "选择考试",
    "nav.examPrepShort": "备考",
    "dashboard.breadcrumbDashboard": "学习台",
    "dashboard.breadcrumbHome": "首页",
    "nav.topicAdaptiveTests": "分主题自适应测验",
    "nav.studyPlanShort": "学习计划",
    "nav.articlesAndTips": "文章与提示",
    "nav.caseStudiesShort": "病例学习",
    "footer.studyTools": "学习工具",
    "footer.examPrep": "考试备考",
    "footer.resources": "资源",
    "nav.home": "首页",
    "nav.lessons": "课程",
    "nav.practice": "练习",
    "nav.more": "更多",
    "footer.contact": "联系",
    "footer.pricing": "定价",
    "brand.homeAriaLabel": "NurseNest 首页",
    "nav.studyDecks": "记忆卡组",
    "nav.studyDecksDesc": "创建抽认卡组，使用学习与测验模式复习",
    "nav.simulators": "模拟演练",
    "home.region.caDesc":
      "显示 REx-PN、NCLEX-RN、NP 考试内容；加拿大单位（°C、kg、cm）及 RPN 用语。",
    "home.region.usDesc":
      "显示 NCLEX-PN、NCLEX-RN、AANP/ANCC 考试内容；美国单位（°F、lb、in）及 LPN/LVN 用语。",
  },
  "zh-tw": {
    "nav.marketingExplore": "服務對象",
    "nav.study": "學習與練習",
    "nav.resources": "指南與方案",
    "nav.chooseYourExam": "選擇考試",
    "nav.examPrepShort": "備考",
    "dashboard.breadcrumbDashboard": "學習台",
    "dashboard.breadcrumbHome": "首頁",
    "nav.topicAdaptiveTests": "分主題適應性測驗",
    "nav.studyPlanShort": "學習計畫",
    "nav.articlesAndTips": "文章與提示",
    "nav.caseStudiesShort": "病例學習",
    "footer.studyTools": "學習工具",
    "footer.examPrep": "考試備考",
    "footer.resources": "資源",
    "nav.home": "首頁",
    "nav.lessons": "課程",
    "nav.practice": "練習",
    "nav.more": "更多",
    "footer.contact": "聯絡",
    "footer.pricing": "定價",
    "brand.homeAriaLabel": "NurseNest 首頁",
    "nav.studyDecks": "記憶卡組",
    "nav.studyDecksDesc": "建立抽認卡組，使用學習與測驗模式複習",
    "nav.simulators": "模擬演練",
    "home.region.caDesc":
      "顯示 REx-PN、NCLEX-RN、NP 考試內容；加拿大單位（°C、kg、cm）及 RPN 用語。",
    "home.region.usDesc":
      "顯示 NCLEX-PN、NCLEX-RN、AANP/ANCC 考試內容；美國單位（°F、lb、in）及 LPN/LVN 用語。",
  },
  ar: {
    "nav.marketingExplore": "لمن نقدّم الدعم",
    "nav.study": "تعلّم وتدرّب",
    "nav.resources": "أدلة وخطط",
    "nav.chooseYourExam": "اختر امتحانك",
    "nav.examPrepShort": "الاختبارات",
    "dashboard.breadcrumbDashboard": "لوحة التحكم",
    "dashboard.breadcrumbHome": "الرئيسية",
    "nav.topicAdaptiveTests": "اختبارات تكيّفية حسب الموضوع",
    "nav.studyPlanShort": "خطة الدراسة",
    "nav.articlesAndTips": "مقالات ونصائح",
    "nav.caseStudiesShort": "دراسات حالة",
    "footer.studyTools": "أدوات الدراسة",
    "footer.examPrep": "التحضير للامتحان",
    "footer.resources": "الموارد",
    "nav.home": "الرئيسية",
    "nav.practice": "تدريب",
    "nav.examPrep": "التحضير للامتحان",
    "nav.testBank": "بنك الاختبارات",
    "brand.homeAriaLabel": "NurseNest — الرئيسية",
    "nav.studyDecks": "مجموعات بطاقات",
    "nav.studyDecksDesc":
      "أنشئ مجموعات بطاقات، وادرس بوضعي التعلّم والاختبار",
    "nav.simulators": "محاكيات",
  },
  tl: {
    "nav.marketingExplore": "Sino ang tinutulungan namin",
    "nav.study": "Matuto at magsanay",
    "nav.resources": "Mga gabay at plano",
    "nav.chooseYourExam": "Piliin ang iyong exam",
    "nav.examPrepShort": "Mga exam",
    "dashboard.breadcrumbDashboard": "Dashboard",
    "dashboard.breadcrumbHome": "Simula",
    "nav.topicAdaptiveTests": "Mga pagsusulit batay sa paksa",
    "nav.studyPlanShort": "Plano ng pag-aaral",
    "nav.articlesAndTips": "Mga artikulo at tip",
    "nav.caseStudiesShort": "Mga case",
    "footer.studyTools": "Mga tool sa pag-aaral",
    "footer.examPrep": "Pag-aaral para sa exam",
    "footer.resources": "Mga mapagkukunan",
    "nav.home": "Simula",
    "nav.questionBank": "Bangko ng tanong",
    "nav.testBank": "Bangko ng pagsusulit",
    "nav.tools": "Mga kagamitan",
    "nav.practiceExams": "Mga practice test",
    "nav.caseSimulations": "Mga case simulation",
    "brand.homeAriaLabel": "Simula ng NurseNest",
    "nav.studyDecks": "Mga deck ng pag-aaral",
    "nav.studyDecksDesc":
      "Gumawa ng flashcard deck, mag-aral gamit ang Learn at Test mode",
    "nav.simulators": "Mga simulator",
    "nav.learningTools": "Mga kagamitan sa pag-aaral",
    "footer.pricing": "Presyo",
  },
};

function main() {
  ensureRequiredEnNavKeys();
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const audited = new Set(getAuditedKeys(en));

  for (const [code, map] of Object.entries(MANUAL_NAV_OVERRIDES)) {
    const p = path.join(I18N_DIR, `${code}.json`);
    if (!fs.existsSync(p)) {
      console.warn(`[${code}] skip: ${p} missing`);
      continue;
    }
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    let n = 0;
    for (const [k, v] of Object.entries(map)) {
      if (!audited.has(k)) {
        console.warn(`[${code}] skip non-audited key: ${k}`);
        continue;
      }
      j[k] = v;
      n += 1;
    }
    fs.writeFileSync(p, JSON.stringify(j));
    console.log(`[${code}] applied ${n} manual nav overrides → ${p}`);
  }
  console.log("\nDone. Run: npm run i18n:validate-nav");
}

const isMain = Boolean(process.argv[1]) && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) main();
