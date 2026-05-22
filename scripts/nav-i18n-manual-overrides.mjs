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
import { loadLocaleFlatMarketingMap, resolveMarketingI18nAppRoot } from "./lib/i18n-app-root.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const APP_ROOT = resolveMarketingI18nAppRoot(REPO_ROOT);
const MARKETING_LOCALE_DIR = path.join(REPO_ROOT, "tools", "i18n", "marketing", "locale");

const REQUIRED_LOCALE_NAV_KEYS = {
  fr: { "nav.getStarted": "Commencer" },
  es: { "nav.getStarted": "Comenzar" },
  tl: { "nav.getStarted": "Magsimula" },
  hi: { "nav.getStarted": "शुरू करें" },
};

function localeNavPath(code) {
  const shardPath = path.join(APP_ROOT, "public", "i18n", code, "nav.json");
  if (fs.existsSync(shardPath)) return shardPath;
  return path.join(APP_ROOT, "public", "i18n", `${code}.json`);
}

function localeCodesWithNavShards() {
  const dir = path.join(APP_ROOT, "public", "i18n");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((code) => fs.existsSync(path.join(dir, code, "nav.json")))
    .sort();
}

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
    "nav.topicAdaptiveTests": "Tests adaptatifs par sujet",
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
    "nav.testBank": "Banque d’entraînement",
    "nav.practiceExams": "Examens blancs",
    "nav.examPrep": "Préparation aux examens",
    "nav.learnerApp": "Appli élève",
    "nav.login": "Connexion",
    "nav.logIn": "Connexion",
    "nav.pricing": "Tarifs",
    "brand.homeAriaLabel": "Accueil NurseNest",
    "nav.studyDecks": "Paquets de cartes mémoire",
    "nav.studyDecksDesc":
      "Créez des paquets de cartes mémoire et révisez en modes Apprentissage et Test",
    "nav.simulators": "Simulations interactives",
    "footer.about": "À propos",
    "footer.privacy": "Confidentialité",
    "footer.faq": "FAQ",
    "components.footer.npExamPrepCa": "Préparation NP (Canada)",
    "components.footer.npExamPrepUs": "Préparation NP (É.-U.)",
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
    "components.footer.npExamPrepCa": "Preparación para NP (Canadá)",
    "components.footer.npExamPrepUs": "Preparación para NP (EE. UU.)",
    "footer.linkNpExamPrepCa": "Preparación para NP (Canadá)",
    "footer.linkNpExamPrepUs": "Preparación para NP (EE. UU.)",
    "footer.linkNursingExamPrepHub": "Centro de preparación de exámenes de enfermería",
    "nav.badge.alliedHealth": "Salud aliada",
    "nav.hub.lessonProgress": "{completed} de {total} lecciones completadas",
    "nav.mega.allied.category.acute": "Atención aguda y de campo",
    "nav.mega.allied.category.clinical": "Apoyo clínico y comunitario",
    "nav.mega.allied.category.lab": "Laboratorio e imagenología",
    "nav.mega.allied.category.therapy": "Terapia y rehabilitación",
    "nav.mega.allied.hubDescription":
      "Selecciona tu profesión para acceder a lecciones, preguntas de práctica y preparación de exámenes adaptadas a tu campo.",
    "nav.mega.allied.label": "Salud aliada",
    "nav.mega.newGrad.hubDescription":
      "Empieza con la ruta base para nuevos graduados y avanza con actividades de estudio prácticas.",
    "nav.mega.newGrad.label": "Nuevo graduado",
    "nav.mega.np.badgeCA": "Recomendado para Canadá",
    "nav.mega.np.badgeUS": "Recomendado para EE. UU.",
    "nav.mega.np.hubDescription":
      "Abre el centro de NP para elegir tu rama de examen y empezar a estudiar.",
    "nav.mega.pn.badgeCA": "Recomendado para Canadá",
    "nav.mega.pn.badgeUS": "Recomendado para EE. UU.",
    "nav.mega.pn.hubDescription":
      "Elige el centro de tu región para iniciar una preparación específica para tu ruta.",
    "nav.mega.rn.hubDescription":
      "Empieza en el centro de RN para practicar, tomar lecciones y seguir tu preparación.",
    "nav.tierDrop.alliedDesc": "Preparación para certificaciones de profesiones de salud aliadas",
    "nav.tierDrop.alliedTitle": "Salud aliada",
    "nav.tierDrop.heading": "Elige tu ruta de examen",
    "nav.tierDrop.lpnDesc": "Preparación para el examen de enfermería práctica para candidatos de EE. UU. (LPN/LVN)",
    "nav.tierDrop.npDesc": "Rutas de certificación FNP, PMHNP, AGPCNP y otras de NP",
    "nav.tierDrop.npTitle": "Enfermero practicante",
    "nav.tierDrop.preNursingDesc": "Cursos básicos y preparación para exámenes de admisión",
    "nav.tierDrop.rpnDesc": "Preparación para el examen de enfermería práctica para candidatos de Canadá (RPN)",
    "nav.tierDrop.toolsDesc": "Tarjetas, tutor con IA y utilidades de estudio",
    "nav.tierDrop.toolsTitle": "Herramientas de estudio",
  },
  pa: {
    "nav.marketingExplore": "ਅਸੀਂ ਕਿਨ੍ਹਾਂ ਦੀ ਮਦਦ ਕਰਦੇ ਹਾਂ",
    "nav.study": "ਸਿੱਖੋ ਅਤੇ ਅਭਿਆਸ ਕਰੋ",
    "nav.resources": "ਗਾਈਡਾਂ ਅਤੇ ਯੋਜਨਾਵਾਂ",
    "nav.chooseYourExam": "ਆਪਣੀ ਪਰੀਖਿਆ ਚੁਣੋ",
    "nav.examPrepShort": "ਪਰੀਖਿਆ ਦੀ ਤਿਆਰੀ",
    "dashboard.breadcrumbDashboard": "ਡੈਸ਼ਬੋਰਡ",
    "dashboard.breadcrumbHome": "ਹੋਮ",
    "nav.topicAdaptiveTests": "ਹਰ ਵਿਸ਼ੇ ਮੁਤਾਬਕ ਅਨੁਕੂਲ ਟੈਸਟ",
    "nav.studyPlanShort": "ਅਧਿਐਨ ਯੋਜਨਾ",
    "nav.articlesAndTips": "ਲੇਖ ਅਤੇ ਸੁਝਾਅ",
    "nav.caseStudiesShort": "ਕੇਸ ਅਧਿਐਨ",
    "footer.studyTools": "ਅਧਿਐਨ ਦੇ ਸਾਧਨ",
    "footer.examPrep": "ਪਰੀਖਿਆ ਦੀ ਤਿਆਰੀ",
    "footer.resources": "ਸਰੋਤ",
    "nav.home": "ਹੋਮ",
    "nav.tools": "ਸਾਧਨ",
    "nav.testBank": "ਟੈਸਟ ਬੈਂਕ",
    "footer.pricing": "ਕੀਮਤਾਂ",
    "brand.homeAriaLabel": "NurseNest ਹੋਮ",
    "nav.studyDecks": "ਫ਼ਲੈਸ਼ਕਾਰਡਾਂ ਦੇ ਸਮੂਹ",
    "nav.studyDecksDesc":
      "ਫ਼ਲੈਸ਼ਕਾਰਡਾਂ ਦੇ ਸਮੂਹ ਬਣਾਓ ਅਤੇ ਸਿੱਖਣ ਤੇ ਟੈਸਟ ਮੋਡਾਂ ਵਿੱਚ ਰਿਵਾਈਜ਼ ਕਰੋ",
    "nav.simulators": "ਇੰਟਰੈਕਟਿਵ ਅਭਿਆਸ",
    "home.region.caDesc":
      "REx-PN, NCLEX-RN ਅਤੇ NP ਵਾਲੀ ਪ੍ਰੀਖਿਆ ਸਮੱਗਰੀ — ਕਨੇਡਾ ਵਾਲੇ ਮਾਪ (°C, kg, cm) ਅਤੇ RPN ਭਾਸ਼ਾ।",
    "home.region.usDesc":
      "NCLEX-PN, NCLEX-RN ਅਤੇ AANP/ANCC ਵਾਲੀ ਪ੍ਰੀਖਿਆ ਸਮੱਗਰੀ — ਅਮਰੀਕੀ ਮਾਪ (°F, lbs, in) ਅਤੇ LPN/LVN ਭਾਸ਼ਾ।",
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
    "components.footer.npExamPrepCa": "NP तैयारी (कनाडा)",
    "components.footer.npExamPrepUs": "NP तैयारी (अमेरिका)",
    "footer.globalPathwaysLine": "उत्तर अमेरिका, एशिया और मध्य पूर्व में अध्ययन मार्ग",
    "footer.learnerSignIn": "लर्नर साइन-इन",
    "footer.linkNpExamPrepCa": "NP तैयारी (कनाडा)",
    "footer.linkNpExamPrepUs": "NP तैयारी (अमेरिका)",
    "footer.linkNursingExamPrepHub": "नर्सिंग परीक्षा तैयारी हब",
    "footer.supportingNursesGlobally": "दुनिया भर की नर्सों का समर्थन",
    "nav.badge.alliedHealth": "सहायक स्वास्थ्य",
    "nav.clearCountrySearch": "खोज साफ करें",
    "nav.examTracks.more": "और ट्रैक",
    "nav.hub.lessonProgress": "{total} में से {completed} पाठ पूरे",
    "nav.learnerMain.aria": "लर्नर नेविगेशन",
    "nav.marketingFlow.learn": "सीखें",
    "nav.marketingFlow.practice": "अभ्यास करें",
    "nav.marketingFlow.track": "प्रगति ट्रैक करें",
    "nav.marketingMore": "और",
    "nav.mega.allied.category.acute": "फील्ड और तीव्र देखभाल",
    "nav.mega.allied.category.clinical": "क्लिनिकल और सामुदायिक सहयोग",
    "nav.mega.allied.category.lab": "प्रयोगशाला और इमेजिंग",
    "nav.mega.allied.category.therapy": "थेरेपी और पुनर्वास",
    "nav.mega.allied.hubDescription":
      "अपने पेशे के अनुसार पाठ, अभ्यास प्रश्न और परीक्षा तैयारी पाने के लिए अपना करियर चुनें.",
    "nav.mega.allied.label": "सहायक स्वास्थ्य",
    "nav.mega.examHubSuffix": "परीक्षा हब",
    "nav.mega.group.learn": "सीखें",
    "nav.mega.group.practice": "अभ्यास करें",
    "nav.mega.group.studyTools": "अध्ययन उपकरण",
    "nav.mega.link.buildStudyPlan": "अध्ययन योजना बनाएँ",
    "nav.mega.link.catReadiness": "CAT तैयारियों की परीक्षा",
    "nav.mega.link.howItWorks": "यह कैसे काम करता है",
    "nav.mega.link.lessons": "पाठ",
    "nav.mega.link.practiceExams": "अभ्यास परीक्षाएँ",
    "nav.mega.link.practiceQuestions": "अभ्यास प्रश्न",
    "nav.mega.newGrad.hubDescription":
      "नए ग्रेजुएट के मुख्य पथ से शुरू करें और व्यावहारिक अध्ययन गतिविधियों के साथ आगे बढ़ें.",
    "nav.mega.newGrad.label": "नया ग्रेजुएट",
    "nav.mega.np.badgeCA": "कनाडा के लिए अनुशंसित",
    "nav.mega.np.badgeUS": "अमेरिका के लिए अनुशंसित",
    "nav.mega.np.hubDescription": "अपनी परीक्षा शाखा चुनने और पढ़ाई शुरू करने के लिए NP हब खोलें.",
    "nav.mega.openHub": "हब खोलें",
    "nav.mega.pn.badgeCA": "कनाडा के लिए अनुशंसित",
    "nav.mega.pn.badgeUS": "अमेरिका के लिए अनुशंसित",
    "nav.mega.pn.hubDescription":
      "अपनी क्षेत्रीय तैयारी शुरू करने के लिए अपने क्षेत्र का हब चुनें.",
    "nav.mega.rn.hubDescription": "अभ्यास, पाठ और तैयारी ट्रैकिंग शुरू करने के लिए RN हब में जाएँ.",
    "nav.mega.startHere": "यहाँ से शुरू करें",
    "nav.noCountriesFound": "कोई देश नहीं मिला",
    "nav.pathwayHubsAria": "पाथवे परीक्षा हब",
    "nav.searchCountriesAria": "देश खोजें",
    "nav.searchCountriesPlaceholder": "देश खोजें...",
    "nav.selectCountry": "देश चुनें",
    "nav.tierDrop.alliedDesc": "सहायक स्वास्थ्य पेशों के लिए प्रमाणन तैयारी",
    "nav.tierDrop.alliedTitle": "सहायक स्वास्थ्य",
    "nav.tierDrop.heading": "अपना परीक्षा ट्रैक चुनें",
    "nav.tierDrop.lpnDesc": "अमेरिकी उम्मीदवारों (LPN/LVN) के लिए प्रैक्टिकल नर्स परीक्षा तैयारी",
    "nav.tierDrop.npDesc": "FNP, PMHNP, AGPCNP और अन्य NP प्रमाणन ट्रैक",
    "nav.tierDrop.npTitle": "नर्स प्रैक्टिशनर",
    "nav.tierDrop.preNursingDesc": "मूलभूत पाठ्यक्रम और प्रवेश परीक्षा तैयारी",
    "nav.tierDrop.rpnDesc": "कनाडाई उम्मीदवारों (RPN) के लिए प्रैक्टिकल नर्स परीक्षा तैयारी",
    "nav.tierDrop.toolsDesc": "फ्लैशकार्ड, AI ट्यूटर और अध्ययन उपकरण",
    "nav.tierDrop.toolsTitle": "अध्ययन उपकरण",
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
    "nav.chooseYourExam": "Piliin ang iyong pagsusulit",
    "nav.examPrepShort": "Mga pagsusulit",
    "dashboard.breadcrumbDashboard": "Dashboard",
    "dashboard.breadcrumbHome": "Simula",
    "nav.topicAdaptiveTests": "Mga pagsusulit batay sa paksa",
    "nav.studyPlanShort": "Plano ng pag-aaral",
    "nav.articlesAndTips": "Mga artikulo at tip",
    "nav.caseStudiesShort": "Mga case",
    "footer.studyTools": "Mga kagamitan sa pag-aaral",
    "footer.examPrep": "Paghahanda sa pagsusulit",
    "footer.resources": "Mga mapagkukunan",
    "nav.home": "Simula",
    "nav.questionBank": "Bangko ng tanong",
    "nav.testBank": "Bangko ng pagsusulit",
    "nav.tools": "Mga kagamitan",
    "nav.practiceExams": "Mga pagsasanay na pagsusulit",
    "nav.caseSimulations": "Mga simulasyon ng kaso",
    "brand.homeAriaLabel": "Simula ng NurseNest",
    "nav.studyDecks": "Mga set ng card sa pag-aaral",
    "nav.studyDecksDesc":
      "Gumawa ng mga set ng flashcard; mag-aral gamit ang mga mode na Pag-aaral at Pagsusulit",
    "nav.simulators": "Mga interaktibong pagsasanay",
    "nav.learningTools": "Mga kagamitan sa pag-aaral",
    "footer.pricing": "Presyo",
    "components.footer.npExamPrepCa": "Paghahanda sa NP (Canada)",
    "components.footer.npExamPrepUs": "Paghahanda sa NP (US)",
    "footer.globalPathwaysLine": "Mga landas sa North America, Asia, at Middle East",
    "footer.learnerSignIn": "Pag-sign in ng mag-aaral",
    "footer.linkNpExamPrepCa": "Paghahanda sa NP (Canada)",
    "footer.linkNpExamPrepUs": "Paghahanda sa NP (US)",
    "footer.linkNursingExamPrepHub": "Hub ng paghahanda sa pagsusulit sa nursing",
    "footer.supportingNursesGlobally": "Sumusuporta sa mga nurse sa buong mundo",
    "nav.badge.alliedHealth": "Kaugnay na kalusugan",
    "nav.clearCountrySearch": "I-clear ang paghahanap",
    "nav.examTracks.more": "Iba pang track",
    "nav.hub.lessonProgress": "{completed} sa {total} na leksiyon ang natapos",
    "nav.learnerMain.aria": "Nabigasyon ng mag-aaral",
    "nav.marketingFlow.learn": "Matuto",
    "nav.marketingFlow.practice": "Magsanay",
    "nav.marketingFlow.track": "Subaybayan ang progreso",
    "nav.marketingMore": "Higit pa",
    "nav.mega.allied.category.acute": "Pang-emerhensiya at acute care",
    "nav.mega.allied.category.clinical": "Suportang klinikal at pangkomunidad",
    "nav.mega.allied.category.lab": "Laboratoryo at imaging",
    "nav.mega.allied.category.therapy": "Terapiya at rehabilitasyon",
    "nav.mega.allied.hubDescription":
      "Piliin ang iyong propesyon para sa mga leksiyon, tanong sa pagsasanay, at paghahanda sa pagsusulit na akma sa iyong larangan.",
    "nav.mega.allied.label": "Kaugnay na kalusugan",
    "nav.mega.examHubSuffix": "Hub ng pagsusulit",
    "nav.mega.group.learn": "Matuto",
    "nav.mega.group.practice": "Magsanay",
    "nav.mega.group.studyTools": "Mga kagamitan sa pag-aaral",
    "nav.mega.link.buildStudyPlan": "Bumuo ng plano sa pag-aaral",
    "nav.mega.link.catReadiness": "Pagsusulit sa kahandaang CAT",
    "nav.mega.link.howItWorks": "Paano ito gumagana",
    "nav.mega.link.lessons": "Mga leksiyon",
    "nav.mega.link.practiceExams": "Mga pagsasanay na pagsusulit",
    "nav.mega.link.practiceQuestions": "Mga tanong sa pagsasanay",
    "nav.mega.newGrad.hubDescription":
      "Magsimula sa pangunahing ruta para sa bagong graduate at humakbang gamit ang praktikal na mga gawain sa pag-aaral.",
    "nav.mega.newGrad.label": "Bagong graduate",
    "nav.mega.np.badgeCA": "Inirerekomenda para sa Canada",
    "nav.mega.np.badgeUS": "Inirerekomenda para sa US",
    "nav.mega.np.hubDescription":
      "Buksan ang NP hub upang piliin ang sangay ng iyong pagsusulit at magsimulang mag-aral.",
    "nav.mega.openHub": "Buksan ang hub",
    "nav.mega.pn.badgeCA": "Inirerekomenda para sa Canada",
    "nav.mega.pn.badgeUS": "Inirerekomenda para sa US",
    "nav.mega.pn.hubDescription":
      "Piliin ang hub para sa iyong rehiyon upang simulan ang paghahandang angkop sa iyong ruta.",
    "nav.mega.rn.hubDescription":
      "Magsimula sa RN hub para sa pagsasanay, mga leksiyon, at pagsubaybay sa kahandaan.",
    "nav.mega.startHere": "Magsimula rito",
    "nav.noCountriesFound": "Walang nahanap na bansa",
    "nav.pathwayHubsAria": "Mga hub ng pathway exam",
    "nav.searchCountriesAria": "Maghanap ng mga bansa",
    "nav.searchCountriesPlaceholder": "Maghanap ng mga bansa...",
    "nav.selectCountry": "Pumili ng bansa",
    "nav.tierDrop.alliedDesc": "Paghahanda sa sertipikasyon para sa mga propesyong allied health",
    "nav.tierDrop.alliedTitle": "Kaugnay na kalusugan",
    "nav.tierDrop.heading": "Piliin ang iyong exam track",
    "nav.tierDrop.lpnDesc": "Paghahanda sa pagsusulit para sa praktikal na nars sa mga kandidato sa US (LPN/LVN)",
    "nav.tierDrop.npDesc": "FNP, PMHNP, AGPCNP, at iba pang mga track ng sertipikasyon para sa NP",
    "nav.tierDrop.npTitle": "Nars practitioner",
    "nav.tierDrop.preNursingDesc": "Mga pundasyong kurso at paghahanda sa admission exam",
    "nav.tierDrop.rpnDesc": "Paghahanda sa pagsusulit para sa praktikal na nars sa mga kandidato sa Canada (RPN)",
    "nav.tierDrop.toolsDesc": "Mga flashcard, AI tutor, at kagamitan sa pag-aaral",
    "nav.tierDrop.toolsTitle": "Mga kagamitan sa pag-aaral",
    "home.region.caDesc":
      "Materyales sa REx-PN, NCLEX-RN, at NP: may mga sukat na para sa Canada (°C, kg, cm) at terminolohiyang RPN.",
    "home.region.usDesc":
      "Materyales sa NCLEX-PN, NCLEX-RN, at AANP/ANCC: may mga sukat na para sa US (°F, lbs, in) at terminolohiyang LPN/LVN.",
  },
};

const CARRYOVER_NAV_OVERRIDES = {
  fr: {
    "footer.howItWorks": "Fonctionnement",
    "footer.regionalHubLinks": "Carrefours régionaux",
    "nav.availableForRegion": "Disponible pour {{region}}",
    "nav.onlyLanguageAvailable": "Seul {{language}} est disponible pour {{region}}.",
    "nav.selectLanguage": "Choisir la langue",
  },
  es: {
    "footer.howItWorks": "Cómo funciona",
    "footer.regionalHubLinks": "Centros regionales",
    "nav.availableForRegion": "Disponible para {{region}}",
    "nav.onlyLanguageAvailable": "Solo {{language}} está disponible para {{region}}.",
    "nav.selectLanguage": "Seleccionar idioma",
  },
  tl: {
    "footer.howItWorks": "Paano ito gumagana",
    "footer.regionalHubLinks": "Mga rehiyonal na hub",
    "nav.availableForRegion": "Available para sa {{region}}",
    "nav.onlyLanguageAvailable": "{{language}} lang ang available para sa {{region}}.",
    "nav.selectLanguage": "Pumili ng wika",
  },
  hi: {
    "footer.howItWorks": "यह कैसे काम करता है",
    "footer.regionalHubLinks": "क्षेत्रीय हब",
    "nav.availableForRegion": "{{region}} के लिए उपलब्ध",
    "nav.onlyLanguageAvailable": "{{region}} के लिए केवल {{language}} उपलब्ध है।",
    "nav.selectLanguage": "भाषा चुनें",
  },
  pt: {
    "components.footer.npExamPrepCa": "Preparação NP (Canadá)",
    "components.footer.npExamPrepUs": "Preparação NP (EUA)",
    "footer.globalPathwaysLine": "Percursos na América do Norte, Ásia e Oriente Médio",
    "footer.howItWorks": "Como funciona",
    "footer.learnerSignIn": "Entrar como estudante",
    "footer.linkNpExamPrepCa": "Preparação NP (Canadá)",
    "footer.linkNpExamPrepUs": "Preparação NP (EUA)",
    "footer.linkNursingExamPrepHub": "Hub de preparação para exames de enfermagem",
    "footer.regionalHubLinks": "Hubs regionais",
    "footer.supportingNursesGlobally": "Apoiando enfermeiros no mundo todo",
    "nav.availableForRegion": "Disponível para {{region}}",
    "nav.badge.alliedHealth": "Saúde aliada",
    "nav.clearCountrySearch": "Limpar busca",
    "nav.examTracks.more": "Mais trilhas",
    "nav.getStarted": "Começar",
    "nav.hub.lessonProgress": "{completed} de {total} aulas concluídas",
    "nav.learnerMain.aria": "Navegação do estudante",
    "nav.marketingFlow.learn": "Aprender",
    "nav.marketingFlow.practice": "Praticar",
    "nav.marketingMore": "Mais",
    "nav.mega.allied.category.acute": "Atendimento de campo e agudo",
    "nav.mega.allied.category.clinical": "Apoio clínico e comunitário",
    "nav.mega.allied.category.lab": "Laboratório e imagem",
    "nav.mega.allied.category.therapy": "Terapia e reabilitação",
    "nav.mega.allied.hubDescription":
      "Selecione sua carreira para acessar aulas, questões práticas e preparação para exames no escopo da sua profissão.",
    "nav.mega.allied.label": "Aliados",
    "nav.mega.examHubSuffix": "Hub do exame",
    "nav.mega.group.learn": "Aprender",
    "nav.mega.group.practice": "Praticar",
    "nav.mega.group.studyTools": "Ferramentas de estudo",
    "nav.mega.link.catReadiness": "Exame de prontidão CAT",
    "nav.mega.link.howItWorks": "Como funciona",
    "nav.mega.link.lessons": "Aulas",
    "nav.mega.link.practiceExams": "Exames práticos",
    "nav.mega.link.practiceQuestions": "Questões práticas",
    "nav.mega.newGrad.hubDescription":
      "Comece pela trilha principal para recém-formados e avance com atividades práticas de estudo.",
    "nav.mega.newGrad.label": "Recém-formado",
    "nav.mega.np.badgeCA": "Recomendado para o Canadá",
    "nav.mega.np.badgeUS": "Recomendado para os EUA",
    "nav.mega.np.hubDescription": "Abra o hub NP para escolher sua ramificação de exame e começar a estudar.",
    "nav.mega.openHub": "Abrir hub",
    "nav.mega.pn.badgeCA": "Recomendado para o Canadá",
    "nav.mega.pn.badgeUS": "Recomendado para os EUA",
    "nav.mega.pn.hubDescription": "Escolha o hub da sua região para iniciar uma preparação específica da trilha.",
    "nav.mega.rn.hubDescription": "Comece no hub RN para praticar, fazer aulas e acompanhar sua prontidão.",
    "nav.mega.startHere": "Comece aqui",
    "nav.noCountriesFound": "Nenhum país encontrado",
    "nav.onlyLanguageAvailable": "Somente {{language}} está disponível para {{region}}.",
    "nav.pathwayHubsAria": "Hubs de exames por trilha",
    "nav.searchCountriesAria": "Pesquisar países",
    "nav.searchCountriesPlaceholder": "Pesquisar países...",
    "nav.selectLanguage": "Selecionar idioma",
    "nav.tierDrop.alliedDesc": "Preparação para certificações em disciplinas de saúde aliada",
    "nav.tierDrop.alliedTitle": "Saúde aliada",
    "nav.tierDrop.lpnDesc": "Preparação para exame de enfermagem prática para candidatos dos EUA (LPN/LVN)",
    "nav.tierDrop.npDesc": "FNP, PMHNP, AGPCNP e outras trilhas de certificação NP",
    "nav.tierDrop.npTitle": "Enfermeiro especialista",
    "nav.tierDrop.preNursingDesc": "Cursos de base e preparação para exames de admissão",
    "nav.tierDrop.rpnDesc": "Preparação para exame de enfermagem prática para candidatos canadenses (RPN)",
    "nav.tierDrop.toolsDesc": "Flashcards, tutor de IA e utilitários de estudo",
    "nav.tierDrop.toolsTitle": "Ferramentas de estudo",
  },
};

function main() {
  ensureRequiredEnNavKeys();
  const en = loadLocaleFlatMarketingMap(APP_ROOT, "en");
  if (!en || typeof en !== "object") {
    throw new Error(`Cannot load English nav shard under ${APP_ROOT}/public/i18n`);
  }
  const audited = new Set(getAuditedKeys(en));

  for (const code of localeCodesWithNavShards()) {
    const p = localeNavPath(code);
    if (!fs.existsSync(p)) {
      console.warn(`[${code}] skip: ${p} missing`);
      continue;
    }
    const overlayPath = path.join(MARKETING_LOCALE_DIR, `marketing-${code}.json`);
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    const overlay = fs.existsSync(overlayPath) ? JSON.parse(fs.readFileSync(overlayPath, "utf8")) : null;
    let n = 0;
    for (const [k, v] of Object.entries(REQUIRED_LOCALE_NAV_KEYS[code] ?? {})) {
      if (!audited.has(k)) {
        console.warn(`[${code}] skip non-audited key: ${k}`);
        continue;
      }
      if (j[k] == null || String(j[k]).trim() === "") {
        j[k] = v;
        if (overlay) overlay[k] = v;
        n += 1;
      }
    }
    const manualOverrides = {
      ...(MANUAL_NAV_OVERRIDES[code] ?? {}),
      ...(CARRYOVER_NAV_OVERRIDES[code] ?? {}),
    };
    for (const [k, v] of Object.entries(manualOverrides)) {
      if (!audited.has(k)) {
        console.warn(`[${code}] skip non-audited key: ${k}`);
        continue;
      }
      j[k] = v;
      if (overlay) overlay[k] = v;
      n += 1;
    }
    if (j["nav.getStarted"] == null || String(j["nav.getStarted"]).trim() === "") {
      j["nav.getStarted"] = "Get Started";
      if (overlay) overlay["nav.getStarted"] = "Get Started";
      n += 1;
    }
    fs.writeFileSync(p, JSON.stringify(j));
    if (overlay) fs.writeFileSync(overlayPath, JSON.stringify(overlay, null, 2) + "\n");
    console.log(`[${code}] applied ${n} manual nav overrides → ${p}${overlay ? ` (+ ${overlayPath})` : ""}`);
  }
  console.log("\nDone. Run: npm run i18n:validate-nav");
}

const isMain = Boolean(process.argv[1]) && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) main();
