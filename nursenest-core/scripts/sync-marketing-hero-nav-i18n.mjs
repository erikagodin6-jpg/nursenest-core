/**
 * Syncs marketing i18n keys used by the homepage hero, header nav, sub-nav, tier dropdown,
 * and related UI from canonical `public/i18n/en.json` into every locale overlay (missing/empty only),
 * then applies French / Spanish / Arabic translations for those keys.
 *
 * Canonical source of truth: public/i18n/en.json (not tools/i18n/...).
 *
 * Usage: node scripts/sync-marketing-hero-nav-i18n.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const I18N_DIR = path.join(__dirname, "..", "public", "i18n");
const EN_PATH = path.join(I18N_DIR, "en.json");

/** Keys under these prefixes (plus exact keys) are considered hero/nav scope for this audit. */
const PREFIXES = [
  "nav.examStrip",
  "nav.tierDrop",
  "nav.pathwayHubsAria",
  "nav.preNursing",
  "nav.tools",
  "nav.regionLabel",
  "nav.marketingExplore",
  "nav.openMenu",
  "nav.closeMenu",
  "nav.more",
  "nav.language",
  "nav.theme",
  "nav.themeGroupLight",
  "nav.themeGroupDark",
  "nav.regionTheme",
  "nav.lessons",
  "nav.pricing",
  "nav.exams",
  "nav.logIn",
  "nav.getStarted",
  "nav.account",
  "nav.learnerApp",
  "nav.admin",
  "nav.signout",
  "nav.flashcards",
  "home.region",
  "home.conversion",
  "home.quickEntry",
  "components.trustSignals",
  "components.homeHeroCarousel",
  "brand.homeAriaLabel",
  "footer.faq",
  "account.idPrefix",
  "account.role",
];

const EXACT_KEYS = new Set(["pages.home.availableIn20LanguagesStudy"]);

function shouldSyncKey(k) {
  if (EXACT_KEYS.has(k)) return true;
  return PREFIXES.some((p) => k === p || k.startsWith(`${p}.`));
}

function isEmpty(v) {
  return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
}

/** French — hero/nav tier + exam meta + quickEntry (professional tone, country-aware acronyms kept). */
const FR = {
  "home.quickEntry.rnQuestions": "Questions NCLEX-RN",
  "home.quickEntry.pnQuestionsUS": "Questions NCLEX-PN (LPN)",
  "home.quickEntry.pnQuestionsCA": "Questions REx-PN (RPN)",
  "home.quickEntry.npQuestionsUS": "Questions NP (États-Unis)",
  "home.quickEntry.npQuestionsCA": "Questions CNPLE / NP",
  "home.quickEntry.alliedUS": "Questions professions paramédicales (É.-U.)",
  "home.quickEntry.alliedCA": "Questions professions paramédicales (Canada)",
  "home.conversion.heroTierIntro": "Choisissez votre filière, puis ouvrez votre hub d'examen.",
  "home.conversion.heroTierNavAria":
    "Parcours d'examens en soins infirmiers et professions paramédicales",
  "home.conversion.tierPill.rn": "RN",
  "home.conversion.tierPill.pnUS": "LPN · NCLEX-PN",
  "home.conversion.tierPill.pnCA": "RPN · REx-PN",
  "home.conversion.tierPill.np": "NP",
  "home.conversion.tierPill.allied": "Paramédical",
  "home.conversion.tierPill.preNursing": "Pré-infirmier",
  "home.conversion.examCard.metaRn": "NCLEX-RN",
  "home.conversion.examCard.metaPnUS": "NCLEX-PN (LPN)",
  "home.conversion.examCard.metaPnCA": "REx-PN (RPN)",
  "home.conversion.examCard.metaNpUS": "FNP · PMHNP · AGPCNP",
  "home.conversion.examCard.metaNpCA": "CNPLE",
  "home.conversion.examCard.metaAllied": "Santé paramédicale",
  "home.conversion.examCard.metaPreNursing": "Pré-infirmier",
  "home.conversion.examCard.newGradTitle": "Bases avant l'école d'infirmiers",
  "home.conversion.examCard.newGradDesc":
    "Rappels scientifiques, entraînement type TEAS et méthodes pour bien commencer.",
  "home.conversion.examCard.ctaNewGrad": "Découvrir le pré-infirmier",
  "nav.tierDrop.heading": "Choisissez votre filière d'examen",
  "nav.tierDrop.rnTitle": "NCLEX-RN",
  "nav.tierDrop.rnDesc": "Préparation à l'examen d'infirmier autorisé — États-Unis et Canada",
  "nav.tierDrop.lpnTitle": "NCLEX-PN · LPN",
  "nav.tierDrop.lpnDesc": "Préparation PN pour candidats aux États-Unis (LPN/LVN)",
  "nav.tierDrop.rpnTitle": "REx-PN · RPN",
  "nav.tierDrop.rpnDesc": "Préparation PN pour candidats au Canada (RPN)",
  "nav.tierDrop.npTitle": "Infirmier praticien (NP)",
  "nav.tierDrop.npDesc": "FNP, PMHNP, AGPCNP et autres certifications NP",
  "nav.tierDrop.alliedTitle": "Santé paramédicale",
  "nav.tierDrop.alliedDesc": "Préparation aux certifications des professions paramédicales",
  "nav.tierDrop.preNursingTitle": "Pré-infirmier",
  "nav.tierDrop.preNursingDesc": "Cours de base et préparation aux examens d'entrée",
  "nav.tierDrop.toolsTitle": "Outils d'étude",
  "nav.tierDrop.toolsDesc": "Fiches mémo, tuteur IA et utilitaires",
};

/** Spanish */
const ES = {
  "home.quickEntry.rnQuestions": "Preguntas NCLEX-RN",
  "home.quickEntry.pnQuestionsUS": "Preguntas NCLEX-PN (LPN)",
  "home.quickEntry.pnQuestionsCA": "Preguntas REx-PN (RPN)",
  "home.quickEntry.npQuestionsUS": "Preguntas NP (EE. UU.)",
  "home.quickEntry.npQuestionsCA": "Preguntas CNPLE / NP",
  "home.quickEntry.alliedUS": "Preguntas de salud aliada (EE. UU.)",
  "home.quickEntry.alliedCA": "Preguntas de salud aliada (Canadá)",
  "home.conversion.heroTierIntro": "Elige tu trayecto y abre tu centro de examen.",
  "home.conversion.heroTierNavAria": "Rutas de examen de enfermería y salud aliada",
  "home.conversion.tierPill.rn": "RN",
  "home.conversion.tierPill.pnUS": "LPN · NCLEX-PN",
  "home.conversion.tierPill.pnCA": "RPN · REx-PN",
  "home.conversion.tierPill.np": "NP",
  "home.conversion.tierPill.allied": "Aliada",
  "home.conversion.tierPill.preNursing": "Pre-enfermería",
  "home.conversion.examCard.metaRn": "NCLEX-RN",
  "home.conversion.examCard.metaPnUS": "NCLEX-PN (LPN)",
  "home.conversion.examCard.metaPnCA": "REx-PN (RPN)",
  "home.conversion.examCard.metaNpUS": "FNP · PMHNP · AGPCNP",
  "home.conversion.examCard.metaNpCA": "CNPLE",
  "home.conversion.examCard.metaAllied": "Salud aliada",
  "home.conversion.examCard.metaPreNursing": "Pre-enfermería",
  "home.conversion.examCard.newGradTitle": "Fundamentos antes de la escuela de enfermería",
  "home.conversion.examCard.newGradDesc":
    "Repaso de ciencias, práctica estilo TEAS y hábitos de estudio sólidos.",
  "home.conversion.examCard.ctaNewGrad": "Explorar pre-enfermería",
  "nav.tierDrop.heading": "Elige tu examen",
  "nav.tierDrop.rnTitle": "NCLEX-RN",
  "nav.tierDrop.rnDesc": "Preparación para RN — EE. UU. y Canadá",
  "nav.tierDrop.lpnTitle": "NCLEX-PN · LPN",
  "nav.tierDrop.lpnDesc": "Preparación PN para candidatos en EE. UU. (LPN/LVN)",
  "nav.tierDrop.rpnTitle": "REx-PN · RPN",
  "nav.tierDrop.rpnDesc": "Preparación PN para candidatos en Canadá (RPN)",
  "nav.tierDrop.npTitle": "Nurse Practitioner",
  "nav.tierDrop.npDesc": "FNP, PMHNP, AGPCNP y otras certificaciones NP",
  "nav.tierDrop.alliedTitle": "Salud aliada",
  "nav.tierDrop.alliedDesc": "Preparación para certificaciones en disciplinas aliadas",
  "nav.tierDrop.preNursingTitle": "Pre-enfermería",
  "nav.tierDrop.preNursingDesc": "Cursos base y preparación para exámenes de ingreso",
  "nav.tierDrop.toolsTitle": "Herramientas de estudio",
  "nav.tierDrop.toolsDesc": "Tarjetas, tutor IA y utilidades",
};

/** Arabic (RTL) — keep exam acronyms where standard */
const AR = {
  "home.quickEntry.rnQuestions": "أسئلة NCLEX-RN",
  "home.quickEntry.pnQuestionsUS": "أسئلة NCLEX-PN (LPN)",
  "home.quickEntry.pnQuestionsCA": "أسئلة REx-PN (RPN)",
  "home.quickEntry.npQuestionsUS": "أسئلة ممرض ممارس (الولايات المتحدة)",
  "home.quickEntry.npQuestionsCA": "أسئلة CNPLE / NP",
  "home.quickEntry.alliedUS": "أسئلة المهن الصحية المساندة (الولايات المتحدة)",
  "home.quickEntry.alliedCA": "أسئلة المهن الصحية المساندة (كندا)",
  "home.conversion.heroTierIntro": "اختر مسارك، ثم افتح مركز الامتحان المناسب.",
  "home.conversion.heroTierNavAria": "مسارات امتحانات التمريض والمهن الصحية المساندة",
  "home.conversion.tierPill.rn": "تمريض مسجل",
  "home.conversion.tierPill.pnUS": "LPN · NCLEX-PN",
  "home.conversion.tierPill.pnCA": "RPN · REx-PN",
  "home.conversion.tierPill.np": "ممرض ممارس",
  "home.conversion.tierPill.allied": "مساندة",
  "home.conversion.tierPill.preNursing": "ما قبل التمريض",
  "home.conversion.examCard.metaRn": "NCLEX-RN",
  "home.conversion.examCard.metaPnUS": "NCLEX-PN (LPN)",
  "home.conversion.examCard.metaPnCA": "REx-PN (RPN)",
  "home.conversion.examCard.metaNpUS": "FNP · PMHNP · AGPCNP",
  "home.conversion.examCard.metaNpCA": "CNPLE",
  "home.conversion.examCard.metaAllied": "صحة مساندة",
  "home.conversion.examCard.metaPreNursing": "ما قبل التمريض",
  "home.conversion.examCard.newGradTitle": "أساسيات قبل مدرسة التمريض",
  "home.conversion.examCard.newGradDesc": "مراجعة علوم، تدرب على أسلوب TEAS، ومهارات دراسية قوية.",
  "home.conversion.examCard.ctaNewGrad": "استكشف ما قبل التمريض",
  "nav.tierDrop.heading": "اختر مسار امتحانك",
  "nav.tierDrop.rnTitle": "NCLEX-RN",
  "nav.tierDrop.rnDesc": "تحضير امتحان الممرض المسجل — الولايات المتحدة وكندا",
  "nav.tierDrop.lpnTitle": "NCLEX-PN · LPN",
  "nav.tierDrop.lpnDesc": "تحضير التمريض العملي لمرشحي الولايات المتحدة (LPN/LVN)",
  "nav.tierDrop.rpnTitle": "REx-PN · RPN",
  "nav.tierDrop.rpnDesc": "تحضير التمريض العملي لمرشحي كندا (RPN)",
  "nav.tierDrop.npTitle": "ممرض ممارس",
  "nav.tierDrop.npDesc": "FNP وPMHNP وAGPCNP ومسارات NP أخرى",
  "nav.tierDrop.alliedTitle": "صحة مساندة",
  "nav.tierDrop.alliedDesc": "تحضير شهادات المهن الصحية المساندة",
  "nav.tierDrop.preNursingTitle": "ما قبل التمريض",
  "nav.tierDrop.preNursingDesc": "دورات أساسية وتحضير لامتحانات القبول",
  "nav.tierDrop.toolsTitle": "أدوات الدراسة",
  "nav.tierDrop.toolsDesc": "بطاقات، مدرّس ذكاء اصطناعي وأدوات مساعدة",
};

const LOCALE_PATCHES = { fr: FR, es: ES, ar: AR };

function main() {
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const keysToSync = Object.keys(en).filter(shouldSyncKey);
  console.log(`Canonical en.json: ${keysToSync.length} keys match hero/nav scope.`);

  const files = fs.readdirSync(I18N_DIR).filter((f) => f.endsWith(".json") && f !== "en.json");

  for (const file of files.sort()) {
    const p = path.join(I18N_DIR, file);
    const locale = JSON.parse(fs.readFileSync(p, "utf8"));
    const code = file.replace(/\.json$/, "");
    let filled = 0;

    for (const k of keysToSync) {
      const v = en[k];
      if (isEmpty(v)) continue;
      if (isEmpty(locale[k])) {
        locale[k] = v;
        filled++;
      }
    }

    const patch = LOCALE_PATCHES[code];
    let patched = 0;
    if (patch) {
      for (const [k, v] of Object.entries(patch)) {
        if (locale[k] !== v) {
          locale[k] = v;
          patched++;
        }
      }
    }

    fs.writeFileSync(p, JSON.stringify(locale));
    console.log(`${file}: filled ${filled} from en; applied ${patched} locale patches.`);
  }
}

main();
