/**
 * Simplified Chinese hand patches for high-traffic keys
 * (Study Next, nav, auth, CTAs, footer).
 * Run after merge/Lingva: node script/apply-zh-priority-patches.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PATCHES = {
  // Study Next
  "studyNext.title": "下一步学习",
  "studyNext.primary": "推荐的下一步",
  "studyNext.secondary": "其他有帮助的操作",
  "studyNext.confidence.high": "高置信度",
  "studyNext.confidence.medium": "中等置信度",
  "studyNext.confidence.low": "证据有限",
  "studyNext.cta.continue": "继续",
  "studyNext.cta.practiceNow": "立即练习",
  "studyNext.cta.reviewNow": "立即复习",
  "studyNext.linkStudyPlan": "学习计划",
  "studyNext.openCta": "打开",
  "studyNext.reasons.continue_path_started": "你已开始该学习路径",
  "studyNext.reasons.pathway_progress_stalled": "你的学习路径进度已停滞",
  "studyNext.reasons.weak_topic_high_confidence": "该主题的薄弱点已被充分数据支持",
  "studyNext.reasons.weak_topic_recent_miss": "该主题近期错题较多",
  "studyNext.reasons.weak_topic_low_confidence": "该主题置信度较低",
  "studyNext.reasons.practice_retest_weak_pool": "复习你的薄弱题库",
  "studyNext.reasons.insufficient_signals_mixed_bank": "先从混合题库练习开始",
  // Conversion preview
  "conversion.lockedStudyNext.ariaLabel":
    "订阅者“下一步学习”预览（示例数据，已锁定）",
  "conversion.lockedStudyNext.previewHint":
    "这是示例布局。订阅后，系统会根据你的练习记录个性化推荐。",
  // Navigation
  "components.navigation.closeMenu": "关闭菜单",
  "components.navigation.freeTools": "免费工具",
  "components.navigation.internationalNurses": "国际护士",
  "components.navigation.npExamPreparation": "NP 考试准备",
  "components.navigation.openMenu": "打开菜单",
  "components.navigation.siConventionalConverter": "SI ↔ 常用单位换算",
  // Auth
  "auth.forgotPassword": "忘记密码",
  "auth.login": "登录",
  "auth.resetPassword": "重置密码",
  "auth.signup": "创建账号",
  // CTAs
  "cta.continuePlan": "继续你的学习计划",
  "cta.improveWeakAreas": "提升你的薄弱环节",
  "cta.seePlansPricing": "查看套餐与价格",
  "cta.unlockPlan": "解锁你的个性化学习计划",
  // Footer
  "footer.about": "关于 NurseNest",
  "footer.acceptableUse": "可接受使用政策",
  "footer.allSpecialties": "全部专科",
  "footer.alliedHealth": "联合健康专业",
  "footer.alliedHealthExamPrep": "联合健康专业考试准备",
  "footer.alliedHealthGuides": "联合健康专业指南",
  "footer.anatomyExplorer": "解剖探索",
  "footer.applyNest": "ApplyNest 求职工具",
  "footer.blog": "博客",
  "footer.caseSimulations": "病例模拟",
  "footer.caseStudies": "病例研究",
  "footer.clinicalClarity": "临床要点",
  "footer.clinicalLessons": "临床课程",
  "footer.clinicalTools": "临床工具",
  "footer.contact": "联系我们",
  "footer.disclaimer": "免责声明",
  "footer.ecosystem": "生态系统",
  "footer.ecosystemCareers": "医疗职业发展",
  "footer.ecosystemExamPrep": "考试准备",
  "footer.ecosystemNewGrad": "新毕业生支持",
  "footer.educationEcosystem": "教育生态系统",
  "footer.emailBannerPhase2":
    "新闻邮件订阅将在第 2 阶段接入订阅 API。",
  "footer.emailBannerSubtitle":
    "选择接收频率。可随时取消订阅。",
  "footer.emailBannerTitle": "把有临床价值的题目发送到你的邮箱",
  "footer.examPrep": "考试准备",
  "footer.faq": "常见问题",
  "footer.feedback": "反馈",
  "footer.forSchools": "面向院校",
  "footer.healthcareJobs": "医疗岗位",
  "footer.icuGuide": "ICU 指南",
  "footer.imagingGuide": "影像诊断指南",
  "footer.labValues": "检验值",
  "footer.legal": "法律信息",
  "footer.legalDisclaimer":
    "NurseNest 提供用于考试准备的教育内容，与 NCLEX、监管学院或执照机构无隶属关系。",
  "footer.medLabTech": "医学检验技术",
  "footer.medMath": "用药计算",
  "footer.medSurgGuide": "内外科护理指南",
  "footer.medicationMastery": "药物管理精讲",
  "footer.mentalHealthGuide": "精神健康护理指南",
  "footer.mltGuide": "MLT 指南",
  "footer.mockExams": "模拟考试",
  "footer.nephroGuide": "肾脏护理指南",
  "footer.newGradHub": "新毕业生中心",
  "footer.newGradSupportSection": "新毕业生支持",
  "footer.nicuGuide": "NICU 指南",
  "footer.nursing": "护理",
  "footer.nursingSpecialties": "护理专科",
  "footer.orthoGuide": "骨科护理指南",
  "footer.otGuide": "作业治疗指南",
  "footer.palliativeGuide": "姑息护理指南",
  "footer.paramedic": "急救医疗",
  "footer.paramedicGuide": "急救医疗指南",
  "footer.preNursing": "护理预科",
  "footer.pricing": "定价",
  "footer.privacy": "隐私",
  "footer.ptGuide": "物理治疗指南",
  "footer.questionOfTheDay": "今日一题",
  "footer.refundPolicy": "退款政策",
  "footer.resources": "资源",
  "footer.respiratoryTherapy": "呼吸治疗",
  "footer.rights": "保留所有权利。",
  "footer.rrtGuide": "呼吸治疗指南",
  "footer.studyInYourLanguage": "用你的语言学习护理",
  "footer.studyTools": "学习工具",
  "footer.terms": "条款",
  "footer.testBank": "题库",
  "footer.toolsHub": "工具中心",
  "footer.traumaGuide": "创伤护理指南",
  "footer.videoLectures": "视频课程",
  "footer.viewAllLanguages": "查看所有语言 →",
};

const zhPath = path.join(root, "nursenest-core/public/i18n/zh.json");
const clientPath = path.join(root, "client/public/i18n/zh.json");

const zh = JSON.parse(readFileSync(zhPath, "utf8"));
for (const [k, v] of Object.entries(PATCHES)) {
  if (!(k in zh)) console.warn("missing key in zh.json:", k);
  zh[k] = v;
}
const json = JSON.stringify(zh);
writeFileSync(zhPath, json);
writeFileSync(clientPath, json);
console.log(`Patched ${Object.keys(PATCHES).length} Simplified Chinese strings`);
