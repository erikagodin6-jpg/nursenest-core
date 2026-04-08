/**
 * German hand patches for high-traffic keys
 * (Study Next, nav, auth, CTAs, footer).
 * Run after merge/Lingva: node script/apply-de-priority-patches.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PATCHES = {
  // Study Next
  "studyNext.title": "Nächstes Lernen",
  "studyNext.primary": "Empfohlener nächster Schritt",
  "studyNext.secondary": "Weitere hilfreiche Aktionen",
  "studyNext.confidence.high": "Hohe Zuverlässigkeit",
  "studyNext.confidence.medium": "Mittlere Zuverlässigkeit",
  "studyNext.confidence.low": "Begrenzte Datenlage",
  "studyNext.cta.continue": "Weiter",
  "studyNext.cta.practiceNow": "Jetzt üben",
  "studyNext.cta.reviewNow": "Jetzt wiederholen",
  "studyNext.linkStudyPlan": "Lernplan",
  "studyNext.openCta": "Öffnen",
  "studyNext.reasons.continue_path_started": "Du hast diesen Lernpfad begonnen",
  "studyNext.reasons.pathway_progress_stalled":
    "Dein Fortschritt auf diesem Lernpfad stockt",
  "studyNext.reasons.weak_topic_high_confidence":
    "Schwächen in diesem Thema sind gut belegt",
  "studyNext.reasons.weak_topic_recent_miss":
    "Kürzlich Fehler in diesem Thema",
  "studyNext.reasons.weak_topic_low_confidence":
    "Geringe Zuverlässigkeit in diesem Thema",
  "studyNext.reasons.practice_retest_weak_pool":
    "Wiederhole deinen Schwächen-Pool",
  "studyNext.reasons.insufficient_signals_mixed_bank":
    "Beginne mit gemischtem Übungskatalog",
  // Conversion preview
  "conversion.lockedStudyNext.ariaLabel":
    "Vorschau für Abonnenten: Study Next (Beispieldaten, gesperrt)",
  "conversion.lockedStudyNext.previewHint":
    "Beispielansicht — nach dem Abonnement werden Empfehlungen an deine Übung angepasst.",
  // Navigation
  "components.navigation.closeMenu": "Menü schließen",
  "components.navigation.freeTools": "Kostenlose Tools",
  "components.navigation.internationalNurses": "Internationale Pflegekräfte",
  "components.navigation.npExamPreparation": "NP-Prüfungsvorbereitung",
  "components.navigation.openMenu": "Menü öffnen",
  "components.navigation.siConventionalConverter":
    "SI ↔ Konventionell Umrechner",
  // Auth
  "auth.forgotPassword": "Passwort vergessen",
  "auth.login": "Anmelden",
  "auth.resetPassword": "Passwort zurücksetzen",
  "auth.signup": "Konto erstellen",
  // CTAs
  "cta.continuePlan": "Plan fortsetzen",
  "cta.improveWeakAreas": "Schwächen verbessern",
  "cta.seePlansPricing": "Tarife und Preise ansehen",
  "cta.unlockPlan": "Deinen persönlichen Lernplan freischalten",
  // Footer
  "footer.about": "Über NurseNest",
  "footer.acceptableUse": "Akzeptable Nutzung",
  "footer.allSpecialties": "Alle Fachgebiete",
  "footer.alliedHealth": "Gesundheitsfachberufe",
  "footer.alliedHealthExamPrep": "Prüfungsvorbereitung Gesundheitsfachberufe",
  "footer.alliedHealthGuides": "Leitfäden Gesundheitsfachberufe",
  "footer.anatomyExplorer": "Anatomie-Explorer",
  "footer.applyNest": "ApplyNest Karrieretools",
  "footer.blog": "Blog",
  "footer.caseSimulations": "Fall-Simulationen",
  "footer.caseStudies": "Fallstudien",
  "footer.clinicalClarity": "Klinische Klarheit",
  "footer.clinicalLessons": "Klinische Lektionen",
  "footer.clinicalTools": "Klinische Tools",
  "footer.contact": "Kontakt",
  "footer.disclaimer": "Haftungsausschluss",
  "footer.ecosystem": "Ökosystem",
  "footer.ecosystemCareers": "Karrieren im Gesundheitswesen",
  "footer.ecosystemExamPrep": "Prüfungsvorbereitung",
  "footer.ecosystemNewGrad": "Support für Berufseinsteiger",
  "footer.educationEcosystem": "Bildungsökosystem",
  "footer.emailBannerPhase2":
    "Newsletter-Anmeldung wird in Phase 2 an die Abonnement-API angebunden.",
  "footer.emailBannerSubtitle":
    "Wähle, wie oft du von uns hören möchtest. Abmeldung jederzeit.",
  "footer.emailBannerTitle":
    "Klinisch nutzbare Fragen in dein Postfach",
  "footer.examPrep": "Prüfungsvorbereitung",
  "footer.faq": "FAQ",
  "footer.feedback": "Feedback",
  "footer.forSchools": "Für Schulen und Hochschulen",
  "footer.healthcareJobs": "Jobs im Gesundheitswesen",
  "footer.icuGuide": "ICU-Leitfaden",
  "footer.imagingGuide": "Leitfaden Bildgebung",
  "footer.labValues": "Laborwerte",
  "footer.legal": "Rechtliches",
  "footer.legalDisclaimer":
    "NurseNest bietet Bildungsinhalte zur Prüfungsvorbereitung und ist nicht mit NCLEX, Regulierungsbehörden oder Lizenzierungsorganisationen verbunden.",
  "footer.medLabTech":
    "Medizinisch-technische Laboratoriumsassistenten",
  "footer.medMath": "Medikamentenrechnung",
  "footer.medSurgGuide": "Leitfaden medizinisch-chirurgische Pflege",
  "footer.medicationMastery": "Medikamentenkompetenz",
  "footer.mentalHealthGuide": "Leitfaden psychische Gesundheit / Psychiatrie",
  "footer.mltGuide": "MLT-Leitfaden",
  "footer.mockExams": "Probeklausuren",
  "footer.nephroGuide": "Leitfaden Nephrologiepflege",
  "footer.newGradHub": "Hub Berufseinsteiger",
  "footer.newGradSupportSection": "Support Berufseinsteiger",
  "footer.nicuGuide": "NICU-Leitfaden",
  "footer.nursing": "Pflege",
  "footer.nursingSpecialties": "Pflegespezialitäten",
  "footer.orthoGuide": "Leitfaden Orthopädiepflege",
  "footer.otGuide": "Leitfaden Ergotherapie",
  "footer.palliativeGuide": "Leitfaden Palliativpflege",
  "footer.paramedic": "Notfallsanitäter",
  "footer.paramedicGuide": "Leitfaden Notfallsanitäter",
  "footer.preNursing": "Vorberufliche Pflege",
  "footer.pricing": "Preise",
  "footer.privacy": "Datenschutz",
  "footer.ptGuide": "Leitfaden Physiotherapie",
  "footer.questionOfTheDay": "Frage des Tages",
  "footer.refundPolicy": "Rückerstattungsrichtlinie",
  "footer.resources": "Ressourcen",
  "footer.respiratoryTherapy": "Atemtherapie",
  "footer.rights": "Alle Rechte vorbehalten.",
  "footer.rrtGuide": "Leitfaden Atemtherapie",
  "footer.studyInYourLanguage": "Pflege in deiner Sprache lernen",
  "footer.studyTools": "Lern-Tools",
  "footer.terms": "AGB",
  "footer.testBank": "Fragenpool",
  "footer.toolsHub": "Tool-Hub",
  "footer.traumaGuide": "Leitfaden Traumapflege",
  "footer.videoLectures": "Video-Vorlesungen",
  "footer.viewAllLanguages": "Alle Sprachen anzeigen →",
};

const dePath = path.join(root, "nursenest-core/public/i18n/de.json");
const clientPath = path.join(root, "client/public/i18n/de.json");

const de = JSON.parse(readFileSync(dePath, "utf8"));
for (const [k, v] of Object.entries(PATCHES)) {
  if (!(k in de)) console.warn("missing key in de.json:", k);
  de[k] = v;
}
const json = JSON.stringify(de);
writeFileSync(dePath, json);
writeFileSync(clientPath, json);
console.log(`Patched ${Object.keys(PATCHES).length} German strings`);
