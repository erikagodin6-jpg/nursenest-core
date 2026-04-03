#!/usr/bin/env node
/**
 * Post-pass for priority namespaces: Tagalog strings that batch MT left matching English,
 * plus paywall feature labels. Exam acronyms (NCLEX-RN, REx-PN, CNPLE, etc.) stay as-is.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..", "..");
const LOCALE_DIR = path.join(REPO_ROOT, "tools", "i18n", "marketing", "locale");

/** @type {Record<string, Record<string, string>>} */
const OVERRIDES = {
  tl: {
    "home.hero.passRate": "94% na passing rate",
    "home.heroFeatures.areaPediatric": "Pangangalagang pediatric",
    "home.heroFeatures.areaPharmacology": "Farmakolohiya",
    "home.heroFeatures.multilingual": "Pag-aaral sa maraming wika",
    "home.heroFeatures.pathophysiology": "Pisyopatolohiya",
    "home.heroFeatures.trustRetention": "Nakabalangkas na pag-uulit",
    "nav.account": "Ang iyong account",
    "nav.admin": "Dashboard ng admin",
    "nav.learnerApp": "App ng mag-aaral",
    "paywall.feature.flashcards": "Mga flashcard",
    "paywall.feature.adaptivePlanner": "Plano ng pag-aaral na umaangkop",
    "footer.preNursing": "Bago ang nursing",
    "footer.medMath": "Matematika sa gamot",
    "footer.anatomyExplorer": "Galugarin ang anatomy",
    "footer.testBank": "Bangko ng pagsusulit",
    "footer.nursing": "Pangangalaga",
    "footer.paramedic": "Paramediko",
    "footer.respiratoryTherapy": "Therapy sa baga",
    "footer.faq": "Mga madalas itanong",
    "footer.blog": "Blog",
    "footer.legal": "Legal",
    "footer.disclaimer": "Paalala at limitasyon",
    "home.career.journeyBadge": "Mag-aral → Pumasa → Lumipat → Makakuha ng trabaho",
    "home.competitive.flashcards": "Bangko ng pagsusulit",
    "home.examPath.ca.pill1": "Pagsusulit na batay sa CAT",
    "home.exams.title": "Mga mock exam",
    "home.feature.autoSave": "Awtomatikong pag-save",
    "home.feature.instantFeedback": "Agad na feedback",
    "home.feature.learnMode": "Mode ng pag-aaral",
    "home.feature.stepwise": "Solusyon na hakbang-hakbang",
    "home.free.preNursing": "Mga batayan bago ang nursing",
    "home.howItWorks.step3.title": "Pumasa",
    "home.mostTested.obDesc":
      "Preeclampsia, paghihiwalay ng placenta, PPH, eclampsia",
    "home.new.decks.title": "Sistema ng deck ng flashcard",
    "home.nurses.floor": "Paghahanda sa specialty sa floor",
    "pages.login.placeholderPassword": "Ilagay ang password",
    "pages.signup.title": "Pag-sign up",
    "pages.signup.examFocus.allied": "Sertipikasyon sa allied health",
    "pages.signup.examFocus.nclexRnCa": "RN entry-to-practice (Canada)",
    "pages.signup.examFocus.npUs": "NP board exams (US)",
    "pages.signup.placeholderEmail": "E-mail",
    "pages.signup.placeholderPassword": "Ilagay ang password",
    "pages.signup.placeholderUsername": "Gamit na pangalan",
    "pages.signup.tierAllied": "Allied health",
    "pages.pricing.plan.avgSuffix": "karaniwan",
    "home.exploreHubs.link.nclexRn": "Hub ng pagsasanay para sa NCLEX-RN",
    "pages.signup.examFocus.nclexRnCa": "Unang praktis bilang RN (Canada)",
    "pages.signup.examFocus.npUs": "Mga pagsusulit sa lupon para sa NP (US)",
    "pages.signup.tierAllied": "Mga propesyonal sa allied health",
    "footer.blog": "Mga artikulo",
  },
};

function main() {
  for (const [code, pairs] of Object.entries(OVERRIDES)) {
    const file = path.join(LOCALE_DIR, `marketing-${code}.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    let n = 0;
    for (const [k, v] of Object.entries(pairs)) {
      if (k in data) {
        data[k] = v;
        n++;
      } else {
        console.warn(`[${code}] missing key (skipped): ${k}`);
      }
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
    console.log(`[${code}] updated ${n} manual overrides → ${file}`);
  }
}

main();
