import { countWordsFromHtmlApproximate } from "@/lib/blog/blog-word-count";
import {
  SPANISH_PUBLISHED_BODY_CAMBIOS_ECG_HIPERPOTASEMIA,
  SPANISH_PUBLISHED_BODY_INTERPRETACION_GASES_ARTERIALES,
} from "@/lib/blog/multilingual-blog-seo-spanish-published-bodies";
import type {
  MultilingualBlogLocaleCode,
  MultilingualBlogRegistryEntry,
} from "@/lib/blog/multilingual-blog-seo-types";

const FR = "fr" as const;
const ES = "es" as const;

/** Short draft bodies — intentionally below {@link MULTILINGUAL_BLOG_INDEX_MIN_WORDS} so seeds stay non-indexable. */
function draftBodyFr(topic: string): string {
  return `
<p>Ce brouillon éditorial (${topic}) est en préparation pour une publication soignée sur NurseNest. Le texte complet,
les références et la revue clinique ne seront exposés aux moteurs de recherche qu’après validation du statut
<code>published</code>, revue qualité, et seuil de mots.</p>
<p>L’objectif est une page utile pour les infirmières et les candidats aux examens, avec des exemples cliniques
localisés et une terminologie précise — pas une traduction littérale minimale.</p>
`.trim();
}

function draftBodyEs(topic: string): string {
  return `
<p>Este borrador (${topic}) está en preparación para una versión revisada en NurseNest. El contenido indexable
solo estará disponible cuando el estado sea <code>published</code>, exista revisión de calidad y se cumpla el
umbral de palabras.</p>
<p>Buscaremos un español natural para SEO clínico, con ejemplos seguros y enlaces internos coherentes.</p>
`.trim();
}

function mkEntry(p: Omit<MultilingualBlogRegistryEntry, "wordCount"> & { localizedBodyHtml: string }): MultilingualBlogRegistryEntry {
  return {
    ...p,
    wordCount: countWordsFromHtmlApproximate(p.localizedBodyHtml),
  };
}

/**
 * GuardedLocalizedBlog registry — append-only; production indexing flows through
 * {@link evaluateMultilingualBlogIndexability}.
 */
export const MULTILINGUAL_BLOG_REGISTRY_ENTRIES: MultilingualBlogRegistryEntry[] = [
  mkEntry({
    locale: FR,
    localizedSlug: "jugement-clinique-jour-examen",
    sourceEnglishSlug: "clinical-judgment-on-exam-day",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Jugement clinique le jour de l’examen : repères pour décider vite",
    localizedMetaTitle: "Jugement clinique NCLEX : décisions sécuritaires sous pression | NurseNest",
    localizedMetaDescription:
      "Repères pour hiérarchiser les indices, éviter les pièges de NCLEX et garder une séquence airway–perfusion–risque électrolytique.",
    localizedExcerpt:
      "Priorités, délégation et lectures de laboratoire quand le stem mélange plusieurs patients et plusieurs alarmes.",
    localizedH1: "Jugement clinique le jour de l’examen",
    localizedBodyHtml: draftBodyFr("jugement clinique / délégation"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Stratégie d’examen",
  }),
  mkEntry({
    locale: ES,
    localizedSlug: "juicio-clinico-dia-del-examen",
    sourceEnglishSlug: "clinical-judgment-on-exam-day",
    status: "review",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Juicio clínico el día del examen: decisiones seguras bajo presión",
    localizedMetaTitle: "Juicio clínico NCLEX: priorizar con seguridad | NurseNest",
    localizedMetaDescription:
      "Cómo leer estabilidad vs urgencia, delegar dentro del alcance y evitar distractoras que suenan completas.",
    localizedExcerpt:
      "Guía breve para secuenciar valoración, oxigenación y acciones dentro del rol del RN.",
    localizedH1: "Juicio clínico el día del examen",
    localizedBodyHtml: draftBodyEs("juicio clínico / delegación"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Estrategia de examen",
  }),

  mkEntry({
    locale: FR,
    localizedSlug: "pharmacologie-sans-memorisation-chaotique",
    sourceEnglishSlug: "pharmacology-without-memorization-chaos",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Pharmacologie sans mémorisation chaotique : prototypes et surveillance",
    localizedMetaTitle: "Pharmacologie NCLEX : classes et surveillance essentielles | NurseNest",
    localizedMetaDescription:
      "Cartographier mécanismes, effets indésirables prioritaires et surveillance au lit plutôt que des listes interminables.",
    localizedExcerpt:
      "Grille courte pour relier mécanisme → risque → surveillance sur les classes à forte NCLEX-yield.",
    localizedH1: "Pharmacologie sans mémorisation chaotique",
    localizedBodyHtml: draftBodyFr("pharmacologie / pics d’insuline"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Pharmacologie",
  }),
  mkEntry({
    locale: ES,
    localizedSlug: "farmacia-sin-caos-de-memoria",
    sourceEnglishSlug: "pharmacology-without-memorization-chaos",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Farmacología sin caos de memoria: prototipos y vigilancia",
    localizedMetaTitle: "Farmacología NCLEX: prototipos y monitorización | NurseNest",
    localizedMetaDescription:
      "Aprende por mecanismo y vigilancia en lugar de memorizar miles de nombres comerciales.",
    localizedExcerpt:
      "Plantilla corta para relacionar clase → riesgo → signos de vigilancia en el paciente.",
    localizedH1: "Farmacología sin caos de memoria",
    localizedBodyHtml: draftBodyEs("farmacología / insulina"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Farmacología",
  }),

  mkEntry({
    locale: FR,
    localizedSlug: "tendances-laboratoire-insuffisance-renale-aigue",
    sourceEnglishSlug: "lab-trends-and-acute-kidney-injury",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Tendances des laboratoires et IRA : lire la trajectoire, pas le point isolé",
    localizedMetaTitle: "IRA : créatinine, potassium et décisions au lit | NurseNest",
    localizedMetaDescription:
      "Hyperkaliémie, surcharge volémique et perfusion : repères pour reconnaître une trajectoire dangereuse.",
    localizedExcerpt:
      "Pourquoi la même valeur peut raconter deux histoires différentes selon la tendance.",
    localizedH1: "Tendances des laboratoires et insuffisance rénale aiguë",
    localizedBodyHtml: draftBodyFr("interprétation de laboratoire"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Laboratoire",
  }),
  mkEntry({
    locale: ES,
    localizedSlug: "tendencias-laboratorio-lesion-renal-aguda",
    sourceEnglishSlug: "lab-trends-and-acute-kidney-injury",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Tendencias de laboratorio e IRA: interpreta la trayectoria",
    localizedMetaTitle: "IRA: creatinina, potasio y acciones de enfermería | NurseNest",
    localizedMetaDescription:
      "Cómo una tendencia mala importa más que un número “leve” aislado; foco en potasio y volumen.",
    localizedExcerpt:
      "Guía breve para enlazar laboratorio con inestabilidad hemodinámica y priorización.",
    localizedH1: "Tendencias de laboratorio y lesión renal aguda",
    localizedBodyHtml: draftBodyEs("interpretación de laboratorio"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Laboratorio",
  }),

  /* Native SEO example — electrolyte / ECG cluster (English long-tail blog slug as canonical hub). */
  mkEntry({
    locale: FR,
    localizedSlug: "modifications-ecg-hyperkaliemie",
    sourceEnglishSlug: "tl-intl-electrolyte-k-safety-intl-topic-114",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "ECG en hyperkaliémie : signes importants à reconnaître",
    localizedMetaTitle: "ECG en hyperkaliémie : ondes T et risque | NurseNest",
    localizedMetaDescription:
      "Repères ECG liés au potassium, surveillance et escalade — contenu complet à finaliser avant publication.",
    localizedExcerpt:
      "Aperçu éditorial : pics T, fusion QT et conduction; article long en préparation.",
    localizedH1: "ECG en hyperkaliémie : signes importants à reconnaître",
    localizedBodyHtml: draftBodyFr("hyperkaliémie / ECG"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Électrolytes",
  }),
  mkEntry({
    locale: ES,
    localizedSlug: "cambios-ecg-hiperpotasemia",
    sourceEnglishSlug: "tl-intl-electrolyte-k-safety-intl-topic-114",
    status: "published",
    qualityReviewed: true,
    lastReviewedAt: "2026-05-10",
    reviewerNotes:
      "Revisión editorial ES: enfoque NCLEX/NGN, sin dosis ni protocolos institucionales; enlaces internos verificados.",
    localizedTitle: "Cambios en el ECG por hiperpotasemia que debes reconocer",
    localizedMetaTitle: "Cambios en el ECG por hiperpotasemia que debes reconocer | NurseNest",
    localizedMetaDescription:
      "Patrones del electrocardiograma ligados al potasio alto, lectura con laboratorio y monitor, y priorización segura para el RN.",
    localizedExcerpt:
      "Guía larga para integrar hiperpotasemia, trazo y juicio clínico sin caer en distractoras que suenan completas.",
    localizedH1: "Cambios en el ECG por hiperpotasemia que debes reconocer",
    localizedBodyHtml: SPANISH_PUBLISHED_BODY_CAMBIOS_ECG_HIPERPOTASEMIA,
    localizedFaq: [
      {
        question: "¿Las ondas T altas siempre significan hiperpotasemia grave?",
        answer:
          "No. Las ondas T pueden cambiar por múltiples causas; el ítem suele combinar laboratorio, historia y trayectoria. La hiperpotasemia grave es un escenario integrado, no una etiqueta de una sola derivación.",
      },
      {
        question: "¿Qué priorizo si el paciente tiene hiperpotasemia pero parece estable?",
        answer:
          "Confirma tendencia del potasio, función renal descrita y señales de alteración eléctrica o neurológica en el texto. Las opciones que posponen la seguridad para tareas administrativas suelen ser distractoras cuando el escenario muestra empeoramiento potencial rápido.",
      },
      {
        question: "¿Debo memorizar cada milivoltio del ECG para el examen?",
        answer:
          "No se trata de memorizar dibujos fijos, sino de reconocer patrones de riesgo creciente y enlazarlos con hipoperfusión, acidosis o daño renal cuando el enunciado los propone.",
      },
    ],
    openGraphTitle: "Cambios en el ECG por hiperpotasemia que debes reconocer",
    openGraphDescription:
      "Patrones del ECG con potasio alto: lectura clínica, monitorización y priorización para ítems de enfermería.",
    twitterTitle: "Cambios en el ECG por hiperpotasemia que debes reconocer",
    twitterDescription:
      "Hiperpotasemia y electrocardiograma: cómo estudiarlo para NCLEX/NGN sin mnemotecnias frágiles.",
    schemaKeywords: [
      "hiperpotasemia",
      "electrocardiograma",
      "onda T",
      "electrolitos",
      "NCLEX español",
      "enfermería",
    ],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Electrolitos",
  }),

  mkEntry({
    locale: FR,
    localizedSlug: "gaz-du-sang-interpretation-infirmiere",
    sourceEnglishSlug: "tl-intl-acid-base-arterial-blood-gas-intl-topic-119",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Gaz du sang : lire acidose et alcalose sans se perdre",
    localizedMetaTitle: "ABG infirmier : étapes d’interprétation | NurseNest",
    localizedMetaDescription:
      "Approche par étapes pour relier pH, PaCO₂ et HCO₃ aux priorités de soins — brouillon.",
    localizedExcerpt:
      "Feuille de route ABG pour candidats NCLEX — version longue à venir.",
    localizedH1: "Gaz du sang : interprétation pour l’infirmière ou l’infirmier",
    localizedBodyHtml: draftBodyFr("ABG / gaz du sang"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Acido-base",
  }),
  mkEntry({
    locale: ES,
    localizedSlug: "interpretacion-gases-arteriales",
    sourceEnglishSlug: "tl-intl-acid-base-arterial-blood-gas-intl-topic-119",
    status: "published",
    qualityReviewed: true,
    lastReviewedAt: "2026-05-10",
    reviewerNotes:
      "Revisión editorial ES: marco acidosis/alcalosis para RN; sin recomendaciones de FiO2 ni ventilador con números inventados.",
    localizedTitle: "Cómo interpretar gases arteriales en enfermería",
    localizedMetaTitle: "Cómo interpretar gases arteriales en enfermería | NurseNest",
    localizedMetaDescription:
      "Pasos para integrar pH, PaCO₂ y bicarbonato con oxigenación y trabajo respiratorio; priorización segura en ítems de alto riesgo.",
    localizedExcerpt:
      "Interpretación de gasometría arterial con mentalidad de enfermería: ventilación, perfusión y alarmas antes que etiquetas perfectas.",
    localizedH1: "Cómo interpretar gases arteriales en enfermería",
    localizedBodyHtml: SPANISH_PUBLISHED_BODY_INTERPRETACION_GASES_ARTERIALES,
    localizedFaq: [
      {
        question: "¿Necesito clasificar el trastorno ácido-base con nombre exacto en cada ítem?",
        answer:
          "No siempre. Muchas preguntas premian reconocer la amenaza inmediata —hipoxemia, fatiga respiratoria o inestabilidad— incluso cuando la clasificación mixta es plausible.",
      },
      {
        question: "¿Qué hago si el bicarbonato y el dióxido de carbono parecen contradictorios?",
        answer:
          "Busca procesos simultáneos o compensación incompleta en el texto del caso. Los ítems suelen dar síntomas o datos de volumen que indican cuál sistema domina el riesgo en ese minuto.",
      },
      {
        question: "¿Cómo evito elegir la opción más larga solo porque parece más completa?",
        answer:
          "Filtra primero estabilidad de vía aérea y respiración. Las opciones educativas extensas suelen ser distractoras cuando el paciente aún no está ventilando de manera segura.",
      },
    ],
    openGraphTitle: "Cómo interpretar gases arteriales en enfermería",
    openGraphDescription:
      "Gasometría arterial para estudiantes de enfermería: integración clínica, errores típicos en ítems y práctica deliberada.",
    twitterTitle: "Cómo interpretar gases arteriales en enfermería",
    twitterDescription:
      "ABG paso a paso con foco en oxigenación, ventilación y priorización — pensado para preparación de examen.",
    schemaKeywords: [
      "gases arteriales",
      "gasometría",
      "acidosis",
      "alcalosis",
      "PaCO2",
      "enfermería",
    ],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Acido-base",
  }),

  mkEntry({
    locale: FR,
    localizedSlug: "bpco-thorax-en-tonneau-precautions",
    sourceEnglishSlug: "tl-intl-copd-exacerbation-education-intl-topic-127",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "BPCO, thorax en barrique et repères d’éducation patient",
    localizedMetaTitle: "BPCO : thorax en barrique et signes d’exacerbation | NurseNest",
    localizedMetaDescription:
      "Repères visibles et enseignements prioritaires — article long en rédaction.",
    localizedExcerpt:
      "Ébauche sur barrel chest et education — extension à compléter.",
    localizedH1: "BPCO et thorax en barrique",
    localizedBodyHtml: draftBodyFr("BPCO / thorax en barrique"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Respiratoire",
  }),
  mkEntry({
    locale: ES,
    localizedSlug: "epoc-pecho-en-barrilete",
    sourceEnglishSlug: "tl-intl-copd-exacerbation-education-intl-topic-127",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "EPOC y pecho en barrilete: señales para pacientes y estudiantes",
    localizedMetaTitle: "EPOC: pecho en barrilete y educación | NurseNest",
    localizedMetaDescription:
      "Guía breve — contenido completo y revisión clínica pendientes.",
    localizedExcerpt:
      "Borrador educativo sobre exacerbación y anatomía de caja torácica.",
    localizedH1: "EPOC y pecho en barrilete",
    localizedBodyHtml: draftBodyEs("EPOC"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Respiratorio",
  }),

  mkEntry({
    locale: ES,
    localizedSlug: "picos-insulina-vigilancia-hipoglucemia",
    sourceEnglishSlug: "tl-intl-hypoglycemia-falls-intl-topic-115",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Picos de insulina y ventanas de hipoglucemia que vigilamos en planta",
    localizedMetaTitle: "Insulina: picos, síntomas y vigilancia | NurseNest",
    localizedMetaDescription:
      "Borrador: tiempos de acción, señales tempranas de hipoglucemia y prevención de caídas — revisión editorial pendiente.",
    localizedExcerpt:
      "Avance para estudiantes de enfermería; versión larga en preparación.",
    localizedH1: "Picos de insulina y vigilancia de hipoglucemia",
    localizedBodyHtml: draftBodyEs("insulina / hipoglucemia"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Farmacología",
  }),

  mkEntry({
    locale: ES,
    localizedSlug: "alarmas-ventilacion-fallo-respiratorio",
    sourceEnglishSlug: "tl-intl-resp-failure-oxygen-intl-topic-118",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Alarmas del respiratorio y oxigenación: lectura rápida para enfermería",
    localizedMetaTitle: "Fallo respiratorio: alarmas y oxigenación | NurseNest",
    localizedMetaDescription:
      "Borrador: priorización ante alarmas, oxigenación y escalada según escenario — texto largo no indexable aún.",
    localizedExcerpt:
      "Guía en preparación sobre lectura de alarmas en contexto de fallo respiratorio.",
    localizedH1: "Alarmas del respiratorio en fallo ventilatorio",
    localizedBodyHtml: draftBodyEs("ventilador / alarmas"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Respiratorio",
  }),

  mkEntry({
    locale: ES,
    localizedSlug: "calculos-dosis-enfermeria-seguridad",
    sourceEnglishSlug: "tl-intl-dka-fluids-electrolytes-intl-topic-129",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Cálculos de dosis en enfermería: seguridad antes que velocidad",
    localizedMetaTitle: "Cálculos de dosis para enfermería | NurseNest",
    localizedMetaDescription:
      "Borrador: verificación, unidades y prevención de errores — contenido ≥1000 palabras en revisión.",
    localizedExcerpt:
      "Avance sobre pensamiento proporcional y chequeos humanos; versión publicable pendiente.",
    localizedH1: "Cálculos de dosis de medicamentos para enfermería",
    localizedBodyHtml: draftBodyEs("cálculos de dosis"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Farmacología",
  }),

  mkEntry({
    locale: ES,
    localizedSlug: "precauciones-infeccion-lineas-centrales",
    sourceEnglishSlug: "tl-intl-clabsi-prevention-care-intl-topic-125",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Precauciones ante infección asociada a líneas y cuidados en fuente",
    localizedMetaTitle: "Precauciones de aislamiento y líneas centrales | NurseNest",
    localizedMetaDescription:
      "Borrador: higiene, paquetes de inserción y comunicación interprofesional — pendiente de extensión.",
    localizedExcerpt:
      "Artículo en preparación sobre bundles de línea y precauciones.",
    localizedH1: "Precauciones de infección en líneas centrales",
    localizedBodyHtml: draftBodyEs("precauciones / CLABSI"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Infección",
  }),

  mkEntry({
    locale: ES,
    localizedSlug: "juicio-clinico-ngn-prioridades-abc",
    sourceEnglishSlug: "tl-intl-neuro-deficit-abc-intl-topic-116",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Juicio clínico NGN: déficit neurológico y prioridades ABC",
    localizedMetaTitle: "NGN: déficit focal y ABC | NurseNest",
    localizedMetaDescription:
      "Borrador: tablas clínicas, hallazgos neurológicos y secuencia segura — revisión editorial requerida.",
    localizedExcerpt:
      "Versión corta; expansión educativa planificada.",
    localizedH1: "Juicio clínico NGN con enfoque neurológico",
    localizedBodyHtml: draftBodyEs("NGN / neurológico"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "NGN",
  }),

  mkEntry({
    locale: ES,
    localizedSlug: "priorizacion-sepsis-delegacion-equipo",
    sourceEnglishSlug: "tl-intl-sepsis-early-care-intl-topic-113",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Priorización en sepsis: tiempo, equipo y delegación dentro del alcance",
    localizedMetaTitle: "Sepsis: prioridades y delegación | NurseNest",
    localizedMetaDescription:
      "Borrador: primeras horas, comunicación cerrada y roles — texto largo no listo para indexación.",
    localizedExcerpt:
      "Guía en desarrollo sobre jerarquía de intervenciones en sepsis.",
    localizedH1: "Priorización y delegación en sepsis temprana",
    localizedBodyHtml: draftBodyEs("sepsis / delegación"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Urgencias",
  }),

  mkEntry({
    locale: ES,
    localizedSlug: "interpretacion-laboratorio-balance-liquidos-aki",
    sourceEnglishSlug: "tl-intl-aki-fluid-balance-intl-topic-120",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Interpretación de laboratorio en IRA: líquidos, electrolitos y tendencias",
    localizedMetaTitle: "Laboratorio en IRA y balance hídrico | NurseNest",
    localizedMetaDescription:
      "Borrador: creatinina, sodio y líneas de tendencia — expansión prevista antes de publicar.",
    localizedExcerpt:
      "Avance sobre lectura de laboratorio contextualizada con volumen y perfusión.",
    localizedH1: "Laboratorio en lesión renal aguda",
    localizedBodyHtml: draftBodyEs("laboratorio / IRA"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Laboratorio",
  }),

  mkEntry({
    locale: ES,
    localizedSlug: "priorizacion-sca-primeras-horas-enfermeria",
    sourceEnglishSlug: "tl-intl-acs-nursing-first-hour-intl-topic-117",
    status: "draft",
    qualityReviewed: false,
    lastReviewedAt: null,
    localizedTitle: "Síndrome coronario agudo: primeras decisiones de enfermería en el texto del caso",
    localizedMetaTitle: "SCA: primeras horas desde enfermería | NurseNest",
    localizedMetaDescription:
      "Borrador: ECG, síntomas y secuencia segura — contenido extendido en preparación.",
    localizedExcerpt:
      "Artículo planificado sobre priorización cardíaca tipo examen.",
    localizedH1: "Priorización en síndrome coronario agudo",
    localizedBodyHtml: draftBodyEs("SCA / priorización"),
    localizedFaq: [],
    datePublished: "2026-05-01",
    dateModified: "2026-05-10",
    categoryLabel: "Cardiovascular",
  }),
];

const byLocaleSlug = new Map<string, MultilingualBlogRegistryEntry>();
const byLocaleSource = new Map<string, MultilingualBlogRegistryEntry>();

for (const e of MULTILINGUAL_BLOG_REGISTRY_ENTRIES) {
  byLocaleSlug.set(`${e.locale}:${e.localizedSlug}`, e);
  const clusterKey = `${e.locale}:${e.sourceEnglishSlug}`;
  if (byLocaleSource.has(clusterKey)) {
    throw new Error(`[multilingual-blog] duplicate source for locale ${clusterKey}`);
  }
  byLocaleSource.set(clusterKey, e);
}

export function listMultilingualBlogRegistryEntries(): MultilingualBlogRegistryEntry[] {
  return MULTILINGUAL_BLOG_REGISTRY_ENTRIES;
}

export function getMultilingualBlogEntryByLocalizedSlug(
  locale: string,
  localizedSlug: string,
): MultilingualBlogRegistryEntry | undefined {
  return byLocaleSlug.get(`${locale}:${localizedSlug}`);
}

export function getMultilingualBlogEntryByEnglishSource(
  locale: MultilingualBlogLocaleCode,
  sourceEnglishSlug: string,
): MultilingualBlogRegistryEntry | undefined {
  return byLocaleSource.get(`${locale}:${sourceEnglishSlug}`);
}

export function isMultilingualBlogSeoLocale(locale: string): locale is MultilingualBlogLocaleCode {
  return locale === FR || locale === ES;
}

const bySourceEnglish = new Map<string, MultilingualBlogRegistryEntry[]>();

for (const e of MULTILINGUAL_BLOG_REGISTRY_ENTRIES) {
  const list = bySourceEnglish.get(e.sourceEnglishSlug) ?? [];
  list.push(e);
  bySourceEnglish.set(e.sourceEnglishSlug, list);
}

/** All localized overlays targeting the same English `/blog/{slug}` hub. */
export function listMultilingualBlogEntriesForEnglishSource(sourceEnglishSlug: string): MultilingualBlogRegistryEntry[] {
  return bySourceEnglish.get(sourceEnglishSlug) ?? [];
}
