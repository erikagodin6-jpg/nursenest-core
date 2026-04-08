/**
 * Traditional Chinese (Taiwan) hand patches for high-traffic keys
 * (Study Next, nav, auth, CTAs, footer).
 * Run after merge/Lingva: node script/apply-zh-tw-priority-patches.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PATCHES = {
  // Study Next
  "studyNext.title": "下一步學習",
  "studyNext.primary": "推薦的下一步",
  "studyNext.secondary": "其他有幫助的操作",
  "studyNext.confidence.high": "高置信度",
  "studyNext.confidence.medium": "中等置信度",
  "studyNext.confidence.low": "證據有限",
  "studyNext.cta.continue": "繼續",
  "studyNext.cta.practiceNow": "立即練習",
  "studyNext.cta.reviewNow": "立即複習",
  "studyNext.linkStudyPlan": "學習計畫",
  "studyNext.openCta": "開啟",
  "studyNext.reasons.continue_path_started": "你已開始此學習路徑",
  "studyNext.reasons.pathway_progress_stalled": "你的學習路徑進度已停滯",
  "studyNext.reasons.weak_topic_high_confidence":
    "此主題的薄弱處已有充分資料支持",
  "studyNext.reasons.weak_topic_recent_miss": "此主題近期錯題較多",
  "studyNext.reasons.weak_topic_low_confidence": "此主題置信度較低",
  "studyNext.reasons.practice_retest_weak_pool": "複習你的薄弱題庫",
  "studyNext.reasons.insufficient_signals_mixed_bank":
    "先從混合題庫練習開始",
  // Conversion preview
  "conversion.lockedStudyNext.ariaLabel":
    "訂閱者「下一步學習」預覽（範例資料，已鎖定）",
  "conversion.lockedStudyNext.previewHint":
    "這是範例版面。訂閱後，系統會依你的練習紀錄個人化推薦。",
  // Navigation
  "components.navigation.closeMenu": "關閉選單",
  "components.navigation.freeTools": "免費工具",
  "components.navigation.internationalNurses": "國際護理師",
  "components.navigation.npExamPreparation": "NP 考試準備",
  "components.navigation.openMenu": "開啟選單",
  "components.navigation.siConventionalConverter": "SI ↔ 常用單位換算",
  // Auth
  "auth.forgotPassword": "忘記密碼",
  "auth.login": "登入",
  "auth.resetPassword": "重設密碼",
  "auth.signup": "建立帳號",
  // CTAs
  "cta.continuePlan": "繼續你的學習計畫",
  "cta.improveWeakAreas": "提升你的薄弱環節",
  "cta.seePlansPricing": "查看方案與價格",
  "cta.unlockPlan": "解鎖你的個人化學習計畫",
  // Footer
  "footer.about": "關於 NurseNest",
  "footer.acceptableUse": "可接受使用政策",
  "footer.allSpecialties": "全部專科",
  "footer.alliedHealth": "聯合健康專業",
  "footer.alliedHealthExamPrep": "聯合健康專業考試準備",
  "footer.alliedHealthGuides": "聯合健康專業指南",
  "footer.anatomyExplorer": "解剖探索",
  "footer.applyNest": "ApplyNest 求職工具",
  "footer.blog": "部落格",
  "footer.caseSimulations": "病例模擬",
  "footer.caseStudies": "病例研究",
  "footer.clinicalClarity": "臨床要點",
  "footer.clinicalLessons": "臨床課程",
  "footer.clinicalTools": "臨床工具",
  "footer.contact": "聯絡我們",
  "footer.disclaimer": "免責聲明",
  "footer.ecosystem": "生態系統",
  "footer.ecosystemCareers": "醫療職涯發展",
  "footer.ecosystemExamPrep": "考試準備",
  "footer.ecosystemNewGrad": "新畢業生支援",
  "footer.educationEcosystem": "教育生態系統",
  "footer.emailBannerPhase2":
    "電子報訂閱將於第 2 階段接入訂閱 API。",
  "footer.emailBannerSubtitle":
    "選擇接收頻率。可隨時取消訂閱。",
  "footer.emailBannerTitle": "把有臨床價值的題目寄到你的信箱",
  "footer.examPrep": "考試準備",
  "footer.faq": "常見問題",
  "footer.feedback": "意見回饋",
  "footer.forSchools": "面向院校",
  "footer.healthcareJobs": "醫療職缺",
  "footer.icuGuide": "ICU 指南",
  "footer.imagingGuide": "影像診斷指南",
  "footer.labValues": "檢驗值",
  "footer.legal": "法律資訊",
  "footer.legalDisclaimer":
    "NurseNest 提供用於考試準備的教育內容，與 NCLEX、監管學院或執照機構無隸屬關係。",
  "footer.medLabTech": "醫檢技術",
  "footer.medMath": "用藥計算",
  "footer.medSurgGuide": "內外科護理指南",
  "footer.medicationMastery": "藥物管理精講",
  "footer.mentalHealthGuide": "精神健康護理指南",
  "footer.mltGuide": "MLT 指南",
  "footer.mockExams": "模擬考試",
  "footer.nephroGuide": "腎臟護理指南",
  "footer.newGradHub": "新畢業生中心",
  "footer.newGradSupportSection": "新畢業生支援",
  "footer.nicuGuide": "NICU 指南",
  "footer.nursing": "護理",
  "footer.nursingSpecialties": "護理專科",
  "footer.orthoGuide": "骨科護理指南",
  "footer.otGuide": "職能治療指南",
  "footer.palliativeGuide": "緩和護理指南",
  "footer.paramedic": "緊急醫療",
  "footer.paramedicGuide": "緊急醫療指南",
  "footer.preNursing": "護理預科",
  "footer.pricing": "定價",
  "footer.privacy": "隱私",
  "footer.ptGuide": "物理治療指南",
  "footer.questionOfTheDay": "今日一題",
  "footer.refundPolicy": "退款政策",
  "footer.resources": "資源",
  "footer.respiratoryTherapy": "呼吸治療",
  "footer.rights": "保留所有權利。",
  "footer.rrtGuide": "呼吸治療指南",
  "footer.studyInYourLanguage": "用你的語言學習護理",
  "footer.studyTools": "學習工具",
  "footer.terms": "條款",
  "footer.testBank": "題庫",
  "footer.toolsHub": "工具中心",
  "footer.traumaGuide": "創傷護理指南",
  "footer.videoLectures": "影片課程",
  "footer.viewAllLanguages": "查看所有語言 →",
};

const zhTwPath = path.join(root, "nursenest-core/public/i18n/zh-tw.json");
const clientPath = path.join(root, "client/public/i18n/zh-tw.json");

const zhTw = JSON.parse(readFileSync(zhTwPath, "utf8"));
for (const [k, v] of Object.entries(PATCHES)) {
  if (!(k in zhTw)) console.warn("missing key in zh-tw.json:", k);
  zhTw[k] = v;
}
const json = JSON.stringify(zhTw);
writeFileSync(zhTwPath, json);
writeFileSync(clientPath, json);
console.log(
  `Patched ${Object.keys(PATCHES).length} Traditional Chinese strings`,
);
