/**
 * Urdu hand patches for high-traffic keys
 * (Study Next, nav, auth, CTAs, footer).
 * Run after merge/Lingva: node script/apply-ur-priority-patches.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PATCHES = {
  // Study Next
  "studyNext.title": "اگلا مطالعہ",
  "studyNext.primary": "تجویز کردہ اگلا قدم",
  "studyNext.secondary": "دیگر مفید اقدامات",
  "studyNext.confidence.high": "اعتماد زیادہ",
  "studyNext.confidence.medium": "اعتماد درمیانہ",
  "studyNext.confidence.low": "شواہد محدود",
  "studyNext.cta.continue": "جاری رکھیں",
  "studyNext.cta.practiceNow": "اب مشق کریں",
  "studyNext.cta.reviewNow": "اب دوبارہ دیکھیں",
  "studyNext.linkStudyPlan": "مطالعہ کا منصوبہ",
  "studyNext.openCta": "کھولیں",
  "studyNext.reasons.continue_path_started": "آپ نے یہ راستہ شروع کیا ہے",
  "studyNext.reasons.pathway_progress_stalled":
    "آپ کے راستے کی پیشرفت رک گئی ہے",
  "studyNext.reasons.weak_topic_high_confidence":
    "اس موضوع میں کمزوری کے لیے ڈیٹا کافی ہے",
  "studyNext.reasons.weak_topic_recent_miss":
    "اس موضوع میں حالیہ غلطیاں",
  "studyNext.reasons.weak_topic_low_confidence":
    "اس موضوع میں اعتماد کم ہے",
  "studyNext.reasons.practice_retest_weak_pool":
    "اپنے کمزور سوالات کے مجموعے کا جائزہ لیں",
  "studyNext.reasons.insufficient_signals_mixed_bank":
    "مخلوط مشق سے شروع کریں",
  // Conversion preview
  "conversion.lockedStudyNext.ariaLabel":
    "سبسکرائبرز کے لیے Study Next کا پیش نظارہ (نمونہ ڈیٹا، مقفل)",
  "conversion.lockedStudyNext.previewHint":
    "مثال لے آؤٹ — سبسکرائب کے بعد سفارشات آپ کی مشق کے مطابق ذاتی ہوں گی۔",
  // Navigation
  "components.navigation.closeMenu": "مینو بند کریں",
  "components.navigation.freeTools": "مفت ٹولز",
  "components.navigation.internationalNurses": "بین الاقوامی نرسز",
  "components.navigation.npExamPreparation": "NP امتحان کی تیاری",
  "components.navigation.openMenu": "مینو کھولیں",
  "components.navigation.siConventionalConverter":
    "SI ↔ روایتی کنورٹر",
  // Auth
  "auth.forgotPassword": "پاس ورڈ بھول گئے",
  "auth.login": "لاگ ان",
  "auth.resetPassword": "پاس ورڈ ری سیٹ",
  "auth.signup": "اکاؤنٹ بنائیں",
  // CTAs
  "cta.continuePlan": "اپنا منصوبہ جاری رکھیں",
  "cta.improveWeakAreas": "اپنے کمزور شعبے بہتر بنائیں",
  "cta.seePlansPricing": "منصوبے اور قیمتیں دیکھیں",
  "cta.unlockPlan": "اپنا ذاتی مطالعہ منصوبہ ان لاک کریں",
  // Footer
  "footer.about": "NurseNest کے بارے میں",
  "footer.acceptableUse": "قابل قبول استعمال",
  "footer.allSpecialties": "تمام تخصصات",
  "footer.alliedHealth": "الائیڈ ہیلتھ",
  "footer.alliedHealthExamPrep": "الائیڈ ہیلتھ امتحان کی تیاری",
  "footer.alliedHealthGuides": "الائیڈ ہیلتھ گائیڈز",
  "footer.anatomyExplorer": "اناتومی ایکسپلورر",
  "footer.applyNest": "ApplyNest کیریئر ٹولز",
  "footer.blog": "بلاگ",
  "footer.caseSimulations": "کیس سمولیشن",
  "footer.caseStudies": "کیس اسٹڈیز",
  "footer.clinicalClarity": "کلینیکل وضاحت",
  "footer.clinicalLessons": "کلینیکل اسباق",
  "footer.clinicalTools": "کلینیکل ٹولز",
  "footer.contact": "رابطہ",
  "footer.disclaimer": "دستبرداری",
  "footer.ecosystem": "ایکو سسٹم",
  "footer.ecosystemCareers": "صحت کے شعبے میں کیریئر",
  "footer.ecosystemExamPrep": "امتحان کی تیاری",
  "footer.ecosystemNewGrad": "نئے گریجویٹس کی معاونت",
  "footer.educationEcosystem": "تعلیمی ایکو سسٹم",
  "footer.emailBannerPhase2":
    "نیوز لیٹر سائن اپ فیز 2 میں سبسکرائب API سے منسلک ہوگا۔",
  "footer.emailBannerSubtitle":
    "منتخب کریں کتنی بار سننا چاہیں۔ کسی بھی وقت ان سبسکرائب۔",
  "footer.emailBannerTitle":
    "کلینیکل طور پر مفید سوالات اپنے ای میل میں پائیں",
  "footer.examPrep": "امتحان کی تیاری",
  "footer.faq": "FAQ",
  "footer.feedback": "فیڈ بیک",
  "footer.forSchools": "اسکولوں کے لیے",
  "footer.healthcareJobs": "صحت کی نوکریاں",
  "footer.icuGuide": "ICU گائیڈ",
  "footer.imagingGuide": "تصویر کشی تشخیص گائیڈ",
  "footer.labValues": "لیب ویلیوز",
  "footer.legal": "قانونی",
  "footer.legalDisclaimer":
    "NurseNest امتحان کی تیاری کے لیے تعلیمی مواد فراہم کرتا ہے اور NCLEX، ریگولیٹری کالجوں یا لائسنسنگ اداروں سے وابستہ نہیں ہے۔",
  "footer.medLabTech": "میڈ لیب ٹیک",
  "footer.medMath": "دوائی کی حساب کتاب",
  "footer.medSurgGuide": "میڈ سرج نرسنگ گائیڈ",
  "footer.medicationMastery": "دوائی میں مہارت",
  "footer.mentalHealthGuide": "ذہنی صحت نرسنگ گائیڈ",
  "footer.mltGuide": "MLT گائیڈ",
  "footer.mockExams": "ماک امتحانات",
  "footer.nephroGuide": "نفرولوجی نرسنگ گائیڈ",
  "footer.newGradHub": "نئے گریجویٹ ہب",
  "footer.newGradSupportSection": "نئے گریجویٹس کی معاونت",
  "footer.nicuGuide": "NICU گائیڈ",
  "footer.nursing": "نرسنگ",
  "footer.nursingSpecialties": "نرسنگ کی تخصصات",
  "footer.orthoGuide": "آرتھو نرسنگ گائیڈ",
  "footer.otGuide": "OT گائیڈ",
  "footer.palliativeGuide": "پیلی ایٹو کیئر گائیڈ",
  "footer.paramedic": "پیرامیڈک",
  "footer.paramedicGuide": "پیرامیڈک گائیڈ",
  "footer.preNursing": "پری نرسنگ",
  "footer.pricing": "قیمتیں",
  "footer.privacy": "پرائیویسی",
  "footer.ptGuide": "PT گائیڈ",
  "footer.questionOfTheDay": "آج کا سوال",
  "footer.refundPolicy": "رقم واپسی کی پالیسی",
  "footer.resources": "وسائل",
  "footer.respiratoryTherapy": "ریسپیریٹری تھیرپی",
  "footer.rights": "تمام حقوق محفوظ ہیں۔",
  "footer.rrtGuide": "RRT گائیڈ",
  "footer.studyInYourLanguage": "اپنی زبان میں نرسنگ سیکھیں",
  "footer.studyTools": "مطالعہ کے ٹولز",
  "footer.terms": "شرائط",
  "footer.testBank": "ٹیسٹ بینک",
  "footer.toolsHub": "ٹولز ہب",
  "footer.traumaGuide": "ٹراما نرسنگ گائیڈ",
  "footer.videoLectures": "ویڈیو لیکچرز",
  "footer.viewAllLanguages": "تمام زبانیں دیکھیں →",
};

const urPath = path.join(root, "nursenest-core/public/i18n/ur.json");
const clientPath = path.join(root, "client/public/i18n/ur.json");

const ur = JSON.parse(readFileSync(urPath, "utf8"));
for (const [k, v] of Object.entries(PATCHES)) {
  if (!(k in ur)) console.warn("missing key in ur.json:", k);
  ur[k] = v;
}
const json = JSON.stringify(ur);
writeFileSync(urPath, json);
writeFileSync(clientPath, json);
console.log(`Patched ${Object.keys(PATCHES).length} Urdu strings`);
