/**
 * Punjabi (Gurmukhi) hand patches for high-traffic keys
 * (Study Next, nav, auth, CTAs, footer).
 * Run after merge/Lingva: node script/apply-pa-priority-patches.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PATCHES = {
  // Study Next
  "studyNext.title": "ਅਗਲਾ ਅਧਿਐਨ",
  "studyNext.primary": "ਸਿਫ਼ਾਰਸ਼ਿਤ ਅਗਲਾ ਕਦਮ",
  "studyNext.secondary": "ਹੋਰ ਮਦਦਗਾਰ ਕਾਰਵਾਈਆਂ",
  "studyNext.confidence.high": "ਉੱਚ ਭਰੋਸਾ",
  "studyNext.confidence.medium": "ਦਰਮਿਆਨਾ ਭਰੋਸਾ",
  "studyNext.confidence.low": "ਸੀਮਿਤ ਸਬੂਤ",
  "studyNext.cta.continue": "ਜਾਰੀ ਰੱਖੋ",
  "studyNext.cta.practiceNow": "ਹੁਣ ਅਭਿਆਸ ਕਰੋ",
  "studyNext.cta.reviewNow": "ਹੁਣ ਦੁਹਰਾਓ",
  "studyNext.linkStudyPlan": "ਅਧਿਐਨ ਯੋਜਨਾ",
  "studyNext.openCta": "ਖੋਲ੍ਹੋ",
  "studyNext.reasons.continue_path_started": "ਤੁਸੀਂ ਇਹ ਰਾਹ ਸ਼ੁਰੂ ਕੀਤਾ ਹੈ",
  "studyNext.reasons.pathway_progress_stalled":
    "ਤੁਹਾਡੇ ਰਾਹ ਦੀ ਤਰੱਕੀ ਰੁਕ ਗਈ ਹੈ",
  "studyNext.reasons.weak_topic_high_confidence":
    "ਇਸ ਵਿਸ਼ੇ ਵਿੱਚ ਕਮਜ਼ੋਰੀ ਬਾਰੇ ਕਾਫ਼ੀ ਡੇਟਾ ਹੈ",
  "studyNext.reasons.weak_topic_recent_miss":
    "ਇਸ ਵਿਸ਼ੇ ਵਿੱਚ ਹਾਲ ਦੀਆਂ ਗਲਤੀਆਂ",
  "studyNext.reasons.weak_topic_low_confidence":
    "ਇਸ ਵਿਸ਼ੇ ਵਿੱਚ ਘੱਟ ਭਰੋਸਾ",
  "studyNext.reasons.practice_retest_weak_pool":
    "ਆਪਣੇ ਕਮਜ਼ੋਰ ਸਵਾਲਾਂ ਦੇ ਸਮੂਹ ਦੀ ਦੁਹਰਾਅ ਕਰੋ",
  "studyNext.reasons.insufficient_signals_mixed_bank":
    "ਮਿਸ਼ਰਤ ਅਭਿਆਸ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ",
  // Conversion preview (product name Study Next kept for recognition)
  "conversion.lockedStudyNext.ariaLabel":
    "ਸਬਸਕ੍ਰਾਈਬਰ Study Next ਦੀ ਝਲਕ (ਨਮੂਨਾ ਡੇਟਾ, ਲੌਕ)",
  "conversion.lockedStudyNext.previewHint":
    "ਨਮੂਨਾ ਲੇਆਉਟ — ਸਬਸਕ੍ਰਿਪਸ਼ਨ ਤੋਂ ਬਾਅਦ ਤੁਹਾਡੇ ਅਭਿਆਸ ਅਨੁਸਾਰ ਸਿਫ਼ਾਰਸ਼ਾਂ ਵਿਅਕਤੀਗਤ ਹੋਣਗੀਆਂ।",
  // Navigation
  "components.navigation.closeMenu": "ਮੈਨੂ ਬੰਦ ਕਰੋ",
  "components.navigation.freeTools": "ਮੁਫ਼ਤ ਟੂਲ",
  "components.navigation.internationalNurses": "ਅੰਤਰਰਾਸ਼ਟਰੀ ਨਰਸ",
  "components.navigation.npExamPreparation": "NP ਇਮਤਿਹਾਨ ਦੀ ਤਿਆਰੀ",
  "components.navigation.openMenu": "ਮੈਨੂ ਖੋਲ੍ਹੋ",
  "components.navigation.siConventionalConverter":
    "SI ↔ ਕਨਵੈਂਸ਼ਨਲ ਕਨਵਰਟਰ",
  // Auth
  "auth.forgotPassword": "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ",
  "auth.login": "ਲਾਗ ਇਨ",
  "auth.resetPassword": "ਪਾਸਵਰਡ ਰੀਸੈੱਟ",
  "auth.signup": "ਖਾਤਾ ਬਣਾਓ",
  // CTAs
  "cta.continuePlan": "ਆਪਣੀ ਯੋਜਨਾ ਜਾਰੀ ਰੱਖੋ",
  "cta.improveWeakAreas": "ਆਪਣੇ ਕਮਜ਼ੋਰ ਖੇਤਰ ਸੁਧਾਰੋ",
  "cta.seePlansPricing": "ਪਲੈਨ ਅਤੇ ਕੀਮਤ ਵੇਖੋ",
  "cta.unlockPlan": "ਆਪਣੀ ਨਿੱਜੀ ਅਧਿਐਨ ਯੋਜਨਾ ਅਨਲੌਕ ਕਰੋ",
  // Footer
  "footer.about": "NurseNest ਬਾਰੇ",
  "footer.acceptableUse": "ਸਵੀਕਾਰਯੋਗ ਵਰਤੋਂ",
  "footer.allSpecialties": "ਸਾਰੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
  "footer.alliedHealth": "ਐਲਾਇਡ ਹੈਲਥ",
  "footer.alliedHealthExamPrep": "ਐਲਾਇਡ ਹੈਲਥ ਇਮਤਿਹਾਨ ਤਿਆਰੀ",
  "footer.alliedHealthGuides": "ਐਲਾਇਡ ਹੈਲਥ ਗਾਈਡ",
  "footer.anatomyExplorer": "ਐਨਾਟਮੀ ਐਕਸਪਲੋਰਰ",
  "footer.applyNest": "ApplyNest ਕਰੀਅਰ ਟੂਲ",
  "footer.blog": "ਬਲੌਗ",
  "footer.caseSimulations": "ਕੇਸ ਸਿਮੂਲੇਸ਼ਨ",
  "footer.caseStudies": "ਕੇਸ ਸਟਡੀ",
  "footer.clinicalClarity": "ਕਲੀਨੀਕਲ ਸਪੱਸ਼ਟਤਾ",
  "footer.clinicalLessons": "ਕਲੀਨੀਕਲ ਸਬਕ",
  "footer.clinicalTools": "ਕਲੀਨੀਕਲ ਟੂਲ",
  "footer.contact": "ਸੰਪਰਕ",
  "footer.disclaimer": "ਅਸਵੀਕਾਰ",
  "footer.ecosystem": "ਈਕੋਸਿਸਟਮ",
  "footer.ecosystemCareers": "ਸਿਹਤ ਖੇਤਰ ਕਰੀਅਰ",
  "footer.ecosystemExamPrep": "ਇਮਤਿਹਾਨ ਤਿਆਰੀ",
  "footer.ecosystemNewGrad": "ਨਵੇਂ ਗ੍ਰੈਜੂਏਟ ਸਹਾਇਤਾ",
  "footer.educationEcosystem": "ਸਿੱਖਿਆ ਈਕੋਸਿਸਟਮ",
  "footer.emailBannerPhase2":
    "ਨਿਊਜ਼ਲੈਟਰ ਸਾਈਨਅਪ ਫੇਜ਼ 2 ਵਿੱਚ ਸਬਸਕ੍ਰਾਈਬ API ਨਾਲ ਜੁੜੇਗਾ।",
  "footer.emailBannerSubtitle":
    "ਚੁਣੋ ਕਿ ਕਿੰਨੀ ਵਾਰ ਸੁਨੋ। ਕਿਸੇ ਵੀ ਵੇਲੇ ਅਨਸਬਸਕ੍ਰਾਈਬ।",
  "footer.emailBannerTitle":
    "ਕਲੀਨੀਕਲ ਸਵਾਲ ਆਪਣੇ ਈਮੇਲ ਵਿੱਚ ਪਾਓ",
  "footer.examPrep": "ਇਮਤਿਹਾਨ ਤਿਆਰੀ",
  "footer.faq": "FAQ",
  "footer.feedback": "ਫੀਡਬੈਕ",
  "footer.forSchools": "ਸਕੂਲਾਂ ਲਈ",
  "footer.healthcareJobs": "ਸਿਹਤ ਨੌਕਰੀਆਂ",
  "footer.icuGuide": "ICU ਗਾਈਡ",
  "footer.imagingGuide": "ਇਮੇਜਿੰਗ ਡਾਇਗਨੋਸਟਿਕ ਗਾਈਡ",
  "footer.labValues": "ਲੈਬ ਮੁੱਲ",
  "footer.legal": "ਕਾਨੂੰਨੀ",
  "footer.legalDisclaimer":
    "NurseNest ਇਮਤਿਹਾਨ ਤਿਆਰੀ ਲਈ ਸਿੱਖਿਆ ਸਮੱਗਰੀ ਦਿੰਦਾ ਹੈ ਅਤੇ NCLEX, ਰੈਗੂਲੇਟਰੀ ਅਦਾਰਿਆਂ ਜਾਂ ਲਾਇਸੰਸਿੰਗ ਨਾਲ ਸੰਬੰਧਿਤ ਨਹੀਂ ਹੈ।",
  "footer.medLabTech": "ਮੈਡ ਲੈਬ ਟੈਕ",
  "footer.medMath": "ਦਵਾਈ ਗਣਿਤ",
  "footer.medSurgGuide": "ਮੈਡ-ਸਰਜ ਨਰਸਿੰਗ ਗਾਈਡ",
  "footer.medicationMastery": "ਦਵਾਈ ਮਾਸਟਰੀ",
  "footer.mentalHealthGuide": "ਮਾਨਸਿਕ ਸਿਹਤ ਨਰਸਿੰਗ ਗਾਈਡ",
  "footer.mltGuide": "MLT ਗਾਈਡ",
  "footer.mockExams": "ਮੌਕ ਇਮਤਿਹਾਨ",
  "footer.nephroGuide": "ਨਫਰੋਲੋਜੀ ਨਰਸਿੰਗ ਗਾਈਡ",
  "footer.newGradHub": "ਨਵੇਂ ਗ੍ਰੈਜੂਏਟ ਹੱਬ",
  "footer.newGradSupportSection": "ਨਵੇਂ ਗ੍ਰੈਜੂਏਟ ਸਹਾਇਤਾ",
  "footer.nicuGuide": "NICU ਗਾਈਡ",
  "footer.nursing": "ਨਰਸਿੰਗ",
  "footer.nursingSpecialties": "ਨਰਸਿੰਗ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
  "footer.orthoGuide": "ਆਰਥੋ ਨਰਸਿੰਗ ਗਾਈਡ",
  "footer.otGuide": "OT ਗਾਈਡ",
  "footer.palliativeGuide": "ਪੈਲੀਏਟਿਵ ਕੇਅਰ ਗਾਈਡ",
  "footer.paramedic": "ਪੈਰਾਮੈਡਿਕ",
  "footer.paramedicGuide": "ਪੈਰਾਮੈਡਿਕ ਗਾਈਡ",
  "footer.preNursing": "ਪ੍ਰੀ-ਨਰਸਿੰਗ",
  "footer.pricing": "ਕੀਮਤਾਂ",
  "footer.privacy": "ਪਰਾਈਵੇਟੀ",
  "footer.ptGuide": "PT ਗਾਈਡ",
  "footer.questionOfTheDay": "ਦਿਨ ਦਾ ਸਵਾਲ",
  "footer.refundPolicy": "ਰਿਫੰਡ ਪਾਲਿਸੀ",
  "footer.resources": "ਸਰੋਤ",
  "footer.respiratoryTherapy": "ਰੈਸਪਰੇਟਰੀ ਥੈਰਪੀ",
  "footer.rights": "ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ।",
  "footer.rrtGuide": "RRT ਗਾਈਡ",
  "footer.studyInYourLanguage": "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਨਰਸਿੰਗ ਸਿੱਖੋ",
  "footer.studyTools": "ਅਧਿਐਨ ਟੂਲ",
  "footer.terms": "ਸ਼ਰਤਾਂ",
  "footer.testBank": "ਟੈਸਟ ਬੈਂਕ",
  "footer.toolsHub": "ਟੂਲ ਹੱਬ",
  "footer.traumaGuide": "ਟਰੌਮਾ ਨਰਸਿੰਗ ਗਾਈਡ",
  "footer.videoLectures": "ਵੀਡੀਓ ਲੈਕਚਰ",
  "footer.viewAllLanguages": "ਸਾਰੀਆਂ ਭਾਸ਼ਾਵਾਂ ਵੇਖੋ →",
};

const paPath = path.join(root, "nursenest-core/public/i18n/pa.json");
const clientPath = path.join(root, "client/public/i18n/pa.json");

const pa = JSON.parse(readFileSync(paPath, "utf8"));
for (const [k, v] of Object.entries(PATCHES)) {
  if (!(k in pa)) console.warn("missing key in pa.json:", k);
  pa[k] = v;
}
const json = JSON.stringify(pa);
writeFileSync(paPath, json);
writeFileSync(clientPath, json);
console.log(`Patched ${Object.keys(PATCHES).length} Punjabi strings`);
