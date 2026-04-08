/**
 * One-off Hindi hand patches for high-traffic keys (Study Next, nav chrome).
 * Run after merge/Lingva: node script/apply-hi-priority-patches.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PATCHES = {
  "studyNext.title": "अगला अध्ययन",
  "studyNext.primary": "अनुशंसित अगला कदम",
  "studyNext.secondary": "अन्य उपयोगी क्रियाएँ",
  "studyNext.reasons.continue_path_started": "आपने यह मार्ग शुरू किया है",
  "studyNext.reasons.pathway_progress_stalled": "आपकी मार्ग प्रगति रुक गई है",
  "studyNext.reasons.weak_topic_high_confidence": "इस विषय में कमज़ोरी पर पर्याप्त डेटा है",
  "studyNext.reasons.weak_topic_recent_miss": "इस विषय में हाल की गलतियाँ",
  "studyNext.reasons.weak_topic_low_confidence": "इस विषय में कम विश्वास",
  "studyNext.reasons.practice_retest_weak_pool": "अपने कमज़ोर क्षेत्र के प्रश्नों की समीक्षा करें",
  "studyNext.reasons.insufficient_signals_mixed_bank": "मिश्रित अभ्यास से शुरू करें",
  "studyNext.openCta": "खोलें",
  "conversion.lockedStudyNext.ariaLabel":
    "सदस्य Study Next का पूर्वावलोकन (नमूना डेटा, लॉक)",
  "conversion.lockedStudyNext.previewHint":
    "नमूना लेआउट — सदस्यता के बाद आपके अभ्यास से आपकी सिफ़ारिशें व्यक्तिगत होंगी।",
  "components.navigation.closeMenu": "मेनू बंद करें",
  "components.navigation.freeTools": "मुफ़्त उपकरण",
  "components.navigation.internationalNurses": "अंतर्राष्ट्रीय नर्स",
  "components.navigation.npExamPreparation": "NP परीक्षा तैयारी",
  "components.navigation.openMenu": "मेनू खोलें",
  "components.navigation.siConventionalConverter": "SI ↔ पारंपरिक कनवर्टर",
};

const hiPath = path.join(root, "nursenest-core/public/i18n/hi.json");
const clientPath = path.join(root, "client/public/i18n/hi.json");

const hi = JSON.parse(readFileSync(hiPath, "utf8"));
for (const [k, v] of Object.entries(PATCHES)) {
  if (!(k in hi)) console.warn("missing key in hi.json:", k);
  hi[k] = v;
}
const json = JSON.stringify(hi);
writeFileSync(hiPath, json);
writeFileSync(clientPath, json);
console.log(`Patched ${Object.keys(PATCHES).length} Hindi strings`);
