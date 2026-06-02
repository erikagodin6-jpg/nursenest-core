/**
 * Italian hand patches for high-traffic keys
 * (Study Next, nav, auth, CTAs, footer).
 * Run after merge/Lingva: node script/apply-it-priority-patches.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PATCHES = {
  // Study Next
  "studyNext.title": "Prossimo studio",
  "studyNext.primary": "Passo successivo consigliato",
  "studyNext.secondary": "Altre azioni utili",
  "studyNext.confidence.high": "Alta affidabilità",
  "studyNext.confidence.medium": "Affidabilità media",
  "studyNext.confidence.low": "Evidenza limitata",
  "studyNext.cta.continue": "Continua",
  "studyNext.cta.practiceNow": "Esercitati ora",
  "studyNext.cta.reviewNow": "Ripassa ora",
  "studyNext.linkStudyPlan": "Piano di studio",
  "studyNext.openCta": "Apri",
  "studyNext.reasons.continue_path_started": "Hai iniziato questo percorso",
  "studyNext.reasons.pathway_progress_stalled":
    "I progressi del tuo percorso sono fermi",
  "studyNext.reasons.weak_topic_high_confidence":
    "Il punto debole in questo argomento è ben supportato dai dati",
  "studyNext.reasons.weak_topic_recent_miss":
    "Errori recenti in questo argomento",
  "studyNext.reasons.weak_topic_low_confidence":
    "Bassa affidabilità in questo argomento",
  "studyNext.reasons.practice_retest_weak_pool":
    "Ripassa il pool delle aree deboli",
  "studyNext.reasons.insufficient_signals_mixed_bank":
    "Inizia con una pratica mista",
  // Conversion preview
  "conversion.lockedStudyNext.ariaLabel":
    "Anteprima Study Next per abbonati (dati di esempio, bloccato)",
  "conversion.lockedStudyNext.previewHint":
    "Esempio di layout — dopo l'abbonamento le raccomandazioni si personalizzano in base alla tua pratica.",
  // Navigation
  "components.navigation.closeMenu": "Chiudi menu",
  "components.navigation.freeTools": "Strumenti gratuiti",
  "components.navigation.internationalNurses": "Infermieri internazionali",
  "components.navigation.npExamPreparation": "Preparazione esame NP",
  "components.navigation.openMenu": "Apri menu",
  "components.navigation.siConventionalConverter":
    "Convertitore SI ↔ convenzionale",
  // Auth
  "auth.forgotPassword": "Password dimenticata",
  "auth.login": "Accedi",
  "auth.resetPassword": "Reimposta password",
  "auth.signup": "Crea account",
  // CTAs
  "cta.continuePlan": "Continua il tuo piano",
  "cta.improveWeakAreas": "Migliora le tue aree deboli",
  "cta.seePlansPricing": "Vedi piani e prezzi",
  "cta.unlockPlan": "Sblocca il tuo piano di studio personalizzato",
  // Footer
  "footer.about": "Informazioni su NurseNest",
  "footer.acceptableUse": "Uso accettabile",
  "footer.allSpecialties": "Tutte le specializzazioni",
  "footer.alliedHealth": "Professioni sanitarie ausiliarie",
  "footer.alliedHealthExamPrep":
    "Preparazione esami — professioni sanitarie ausiliarie",
  "footer.alliedHealthGuides": "Guide — professioni sanitarie ausiliarie",
  "footer.anatomyExplorer": "Esploratore anatomico",
  "footer.applyNest": "Strumenti di carriera ApplyNest",
  "footer.blog": "Blog",
  "footer.caseSimulations": "Simulazioni di casi",
  "footer.caseStudies": "Casi clinici",
  "footer.clinicalClarity": "Chiarezza clinica",
  "footer.clinicalLessons": "Lezioni cliniche",
  "footer.clinicalTools": "Strumenti clinici",
  "footer.contact": "Contatti",
  "footer.disclaimer": "Disclaimer",
  "footer.ecosystem": "Ecosistema",
  "footer.ecosystemCareers": "Carriere in sanità",
  "footer.ecosystemExamPrep": "Preparazione agli esami",
  "footer.ecosystemNewGrad": "Supporto neolaureati",
  "footer.educationEcosystem": "Ecosistema educativo",
  "footer.emailBannerPhase2":
    "L'iscrizione alla newsletter si collegherà all'API di abbonamento nella Fase 2.",
  "footer.emailBannerSubtitle":
    "Scegli la frequenza degli aggiornamenti. Disiscrizione in qualsiasi momento.",
  "footer.emailBannerTitle":
    "Domande utili in clinica nella tua casella di posta",
  "footer.examPrep": "Preparazione esami",
  "footer.faq": "FAQ",
  "footer.feedback": "Feedback",
  "footer.forSchools": "Per le scuole",
  "footer.healthcareJobs": "Lavoro in sanità",
  "footer.icuGuide": "Guida ICU",
  "footer.imagingGuide": "Guida diagnostica per immagini",
  "footer.labValues": "Valori di laboratorio",
  "footer.legal": "Note legali",
  "footer.legalDisclaimer":
    "NurseNest fornisce contenuti educativi per la preparazione agli esami e non è affiliata a NCLEX, ordini professionali o enti di licenza.",
  "footer.medLabTech": "Tecnico di laboratorio medico",
  "footer.medMath": "Calcolo dei farmaci",
  "footer.medSurgGuide": "Guida infermieristica medico-chirurgica",
  "footer.medicationMastery": "Padronanza farmacologica",
  "footer.mentalHealthGuide": "Guida infermieristica in salute mentale",
  "footer.mltGuide": "Guida MLT",
  "footer.mockExams": "Simulazioni d'esame",
  "footer.nephroGuide": "Guida infermieristica nefrologica",
  "footer.newGradHub": "Hub neolaureati",
  "footer.newGradSupportSection": "Supporto neolaureati",
  "footer.nicuGuide": "Guida NICU",
  "footer.nursing": "Infermieristica",
  "footer.nursingSpecialties": "Specializzazioni infermieristiche",
  "footer.orthoGuide": "Guida infermieristica ortopedica",
  "footer.otGuide": "Guida terapia occupazionale",
  "footer.palliativeGuide": "Guida cure palliative",
  "footer.paramedic": "Paramedico",
  "footer.paramedicGuide": "Guida paramedico",
  "footer.preNursing": "Pre-infermieristica",
  "footer.pricing": "Prezzi",
  "footer.privacy": "Privacy",
  "footer.ptGuide": "Guida fisioterapia",
  "footer.questionOfTheDay": "Domanda del giorno",
  "footer.refundPolicy": "Politica di rimborso",
  "footer.resources": "Risorse",
  "footer.respiratoryTherapy": "Terapia respiratoria",
  "footer.rights": "Tutti i diritti riservati.",
  "footer.rrtGuide": "Guida terapia respiratoria",
  "footer.studyInYourLanguage": "Studia infermieristica nella tua lingua",
  "footer.studyTools": "Strumenti di studio",
  "footer.terms": "Termini",
  "footer.testBank": "Banca domande",
  "footer.toolsHub": "Hub strumenti",
  "footer.traumaGuide": "Guida infermieristica trauma",
  "footer.videoLectures": "Videolezioni",
  "footer.viewAllLanguages": "Vedi tutte le lingue →",
};

const itPath = path.join(root, "nursenest-core/public/i18n/it.json");
const clientPath = path.join(root, "client/public/i18n/it.json");

const it = JSON.parse(readFileSync(itPath, "utf8"));
for (const [k, v] of Object.entries(PATCHES)) {
  if (!(k in it)) console.warn("missing key in it.json:", k);
  it[k] = v;
}
const json = JSON.stringify(it);
writeFileSync(itPath, json);
writeFileSync(clientPath, json);
console.log(`Patched ${Object.keys(PATCHES).length} Italian strings`);
