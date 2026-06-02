/**
 * French-language nursing SEO + learning registry — Canadian-focused, editorial-quality planning surface.
 *
 * - Routes are **planned** marketing paths under `/fr/…` (see `(marketing)/[locale]`). Pair with `routeEn` for hreflang when locale policy allows.
 * - **Do not** emit sitemap/hreflang for French nursing URLs until `status === "published"` **and** French is promoted for SEO (`isLocaleSeoIndexable("fr")`).
 * - Copy must be **human-reviewed Canadian French** — not machine-translated filler.
 */

import { isLocaleHreflangEligible, isLocaleSeoIndexable } from "@/lib/i18n/language-readiness";

export const FRENCH_MARKETING_LOCALE = "fr" as const;

export type FrenchNursingSeoCluster =
  | "french_nclex"
  | "french_rex_pn"
  | "french_med_math"
  | "french_simulation"
  | "french_interpretation";

export type FrenchNursingAudience =
  | "quebec_student"
  | "bilingual_canada"
  | "ien"
  | "rex_pn_candidate"
  | "nclex_fr_candidate"
  | "practical_nursing_fr"
  | "haitian_nurse"
  | "francophone_immigrant_clinician";

export type FrenchNursingSeoStatus = "figma_pending" | "draft" | "published";

export type ClinicalReviewStatus = "pending" | "approved" | "not_applicable";

export type LocalizationPipelineStatus =
  | "figma_pending"
  | "copy_draft"
  | "editorial_review"
  | "clinical_review"
  | "ready";

export type PublishReadiness = "blocked" | "staging" | "production";

export type FrenchNursingSegmentation = {
  freeHighlightsFr: string[];
  premiumHighlightsFr: string[];
};

export type FrenchNursingSeoEntry = {
  id: string;
  /** Localized marketing path (must start with `/fr`). */
  routeFr: string;
  /** Default-locale alternate for parity checks and future hreflang (`/` slug, no `/fr`). */
  routeEn: string;
  titleFr: string;
  metaDescriptionFr: string;
  /** English title for mapping QA — must not be copied into French metadata fields on publish. */
  titleEn: string;
  metaDescriptionEn: string;
  cluster: FrenchNursingSeoCluster;
  audiences: readonly FrenchNursingAudience[];
  segmentation: FrenchNursingSegmentation;
  /** Editorial + clinical localization lifecycle (independent of Next route existence). */
  localizationStatus: LocalizationPipelineStatus;
  clinicalReviewStatus: ClinicalReviewStatus;
  publishReadiness: PublishReadiness;
  /** SEO + CRM intent — French query phrases only in this array. */
  targetQueriesFr: readonly string[];
  status: FrenchNursingSeoStatus;
};

export const FRENCH_NURSING_SEO_REGISTRY: readonly FrenchNursingSeoEntry[] = [
  {
    id: "fr-nclex-guide-canada",
    routeFr: "/fr/guide-nclex-canada",
    routeEn: "/guide-nclex-canada",
    titleFr: "Guide NCLEX Canada (français) : préparation sérieuse pour candidats francophones",
    metaDescriptionFr:
      "Cadre de préparation au NCLEX au Canada : étapes clés, jugement clinique, gestion du temps et liens vers questions commentées — articulé pour les étudiantes et infirmières francophones sans jargon inutile.",
    titleEn: "NCLEX Canada Guide — Prep Steps & Clinical Judgment for Canadian Candidates",
    metaDescriptionEn:
      "A rigorous NCLEX preparation framework for Canadian pathways: study sequencing, clinical judgment focus, and links to practice — paired with French editorial hubs when available.",
    cluster: "french_nclex",
    audiences: ["quebec_student", "bilingual_canada", "ien", "nclex_fr_candidate"],
    segmentation: {
      freeHighlightsFr: [
        "Vue d’ensemble du parcours d’examen et des attentes NCLEX",
        "Repères de jugement clinique adaptés au contexte canadien",
        "FAQ et glossaire bilingue des termes fréquents",
      ],
      premiumHighlightsFr: [
        "Banques adaptatives, simulations et révision ciblée des écarts",
        "Analyses détaillées et plans d’étude personnalisés",
        "Tableaux de progression et remédiation faibles points",
      ],
    },
    localizationStatus: "figma_pending",
    clinicalReviewStatus: "pending",
    publishReadiness: "blocked",
    targetQueriesFr: [
      "guide nclex canada",
      "préparation nclex",
      "étude nclex canada",
      "nclex français",
    ],
    status: "figma_pending",
  },
  {
    id: "fr-nclex-questions-corriges",
    routeFr: "/fr/questions-nclex-avec-corriges",
    routeEn: "/nclex-practice-questions-explained",
    titleFr: "Questions NCLEX avec corrigés — compréhension et stratégie (français)",
    metaDescriptionFr:
      "Entraînement NCLEX en français : questions types, raisonnement infirmier, pièges fréquents et corrigés pédagogiques pour renforcer la préparation sans réponses superficielles.",
    titleEn: "NCLEX Practice Questions with Rationales — Strategy & Nursing Reasoning",
    metaDescriptionEn:
      "NCLEX-style practice with rationales focused on nursing judgment, prioritization, and safety — paired with French editorial hubs for francophone candidates.",
    cluster: "french_nclex",
    audiences: ["quebec_student", "nclex_fr_candidate", "bilingual_canada"],
    segmentation: {
      freeHighlightsFr: [
        "Échantillon de questions avec corrigés pédagogiques",
        "Repères sur la formulation NCLEX et la lecture attentive des items",
      ],
      premiumHighlightsFr: [
        "Banques étendues, modes chronométrés et analyses de performance",
        "Scénarios NGN et remédiation sur mesure",
      ],
    },
    localizationStatus: "figma_pending",
    clinicalReviewStatus: "pending",
    publishReadiness: "blocked",
    targetQueriesFr: ["questions nclex français", "test nclex avec corrigé", "questions nclex avec corrigés"],
    status: "figma_pending",
  },
  {
    id: "fr-rex-pn-preparation",
    routeFr: "/fr/preparation-rex-pn",
    routeEn: "/rex-pn-exam-prep-overview",
    titleFr: "Préparation REx-PN : guide francophone pour l’examen d’infirmière auxiliaire",
    metaDescriptionFr:
      "Préparation au REx-PN pour francophones au Canada : priorités sécuritaires, études de cas, calculs essentiels et passages vers la pratique guidée — vocabulaire québécois compatible.",
    titleEn: "REx-PN Exam Prep Overview — Priorities & Practice Paths",
    metaDescriptionEn:
      "Structured REx-PN preparation emphasizing safety, delegation, and Canadian PN scope — cross-linked to French hubs where localized.",
    cluster: "french_rex_pn",
    audiences: ["rex_pn_candidate", "quebec_student", "practical_nursing_fr"],
    segmentation: {
      freeHighlightsFr: [
        "Sommaire du format d’examen et des domaines évalués",
        "Conseils de préparation et erreurs fréquentes à éviter",
      ],
      premiumHighlightsFr: [
        "Banques thématiques, chronométrage et rapports de progression",
        "Ateliers de jugement clinique et séances CAT alignées produit",
      ],
    },
    localizationStatus: "figma_pending",
    clinicalReviewStatus: "pending",
    publishReadiness: "blocked",
    targetQueriesFr: ["préparation rex-pn", "test pratique rex-pn", "examen infirmière auxiliaire"],
    status: "figma_pending",
  },
  {
    id: "fr-rex-pn-simulation",
    routeFr: "/fr/simulation-examen-rex-pn",
    routeEn: "/rex-pn-practice-simulation",
    titleFr: "Simulation d’examen REx-PN — mise en situation chronométrée",
    metaDescriptionFr:
      "Simulation REx-PN en français : gestion du temps, lecture d’items, stratégies antérieures à la révision — expérience premium disponible selon offre.",
    titleEn: "REx-PN Exam Simulation — Timed Practice Experience",
    metaDescriptionEn:
      "Timed REx-PN-style simulation emphasizing item comprehension and pacing — French editorial companion hub.",
    cluster: "french_rex_pn",
    audiences: ["rex_pn_candidate", "quebec_student"],
    segmentation: {
      freeHighlightsFr: ["Aperçu du déroulement et du chronométrage", "Conseils pour stabiliser la charge cognitive"],
      premiumHighlightsFr: [
        "Sessions complètes avec analyse détaillée des erreurs",
        "Parcours adaptatif et recommandations de révision",
      ],
    },
    localizationStatus: "figma_pending",
    clinicalReviewStatus: "pending",
    publishReadiness: "blocked",
    targetQueriesFr: ["simulation examen rex-pn", "test pratique rex-pn"],
    status: "figma_pending",
  },
  {
    id: "fr-med-math-debit-iv",
    routeFr: "/fr/calcul-debit-iv",
    routeEn: "/iv-flow-rate-calculator-nursing",
    titleFr: "Calcul du débit IV pour infirmières — gouttes/minute et ml/h (Canada)",
    metaDescriptionFr:
      "Maîtrisez le calcul du débit IV : formules, conversion des facteurs de gouttes, vérifications sécuritaires et erreurs fréquentes — pensé pour la pratique infirmière et les examens.",
    titleEn: "IV Flow Rate for Nurses — Drops per Minute & mL/hour",
    metaDescriptionEn:
      "Stepwise IV rate calculations with safety checks — paired with French nursing explanations for Canadian learners.",
    cluster: "french_med_math",
    audiences: ["quebec_student", "rex_pn_candidate", "nclex_fr_candidate", "bilingual_canada"],
    segmentation: {
      freeHighlightsFr: [
        "Rappels de formules et exemples guidés",
        "Repères de sécurité et arrondis cliniques",
      ],
      premiumHighlightsFr: [
        "Ateliers chronométrés et banques contextualisées service/clinique",
        "Révision des erreurs systématiques et remédiation",
      ],
    },
    localizationStatus: "figma_pending",
    clinicalReviewStatus: "pending",
    publishReadiness: "blocked",
    targetQueriesFr: ["calculatrice débit iv", "calcul gouttes/minute", "calculs médicaux infirmiers"],
    status: "figma_pending",
  },
  {
    id: "fr-med-math-dosage",
    routeFr: "/fr/calcul-dosage-medicaments",
    routeEn: "/medication-dosage-calculations-nursing",
    titleFr: "Calcul de dosage médicamenteux — sécurité et vérifications infirmières",
    metaDescriptionFr:
      "Dosages injectables et oraux : unités, conversions, enfants vs adultes, double vérification — langage clinique canadien et mise en garde contre les pièges fréquents.",
    titleEn: "Medication Dosage Calculations — Nursing Safety Checks",
    metaDescriptionEn:
      "Dosage math with emphasis on verification steps and pediatric considerations — French companion hub for Canadian nurses.",
    cluster: "french_med_math",
    audiences: ["ien", "quebec_student", "nclex_fr_candidate"],
    segmentation: {
      freeHighlightsFr: ["Principes de conversion et exemples guidés", "Check-list de sécurité avant administration"],
      premiumHighlightsFr: ["Drills adaptatifs et analyse d’erreurs détaillée", "Situations pédiatriques avancées"],
    },
    localizationStatus: "figma_pending",
    clinicalReviewStatus: "pending",
    publishReadiness: "blocked",
    targetQueriesFr: ["calcul dosage infirmier", "calcul médicaments pédiatriques", "calculs médicaux infirmiers"],
    status: "figma_pending",
  },
  {
    id: "fr-simulation-clinique",
    routeFr: "/fr/simulation-clinique-infirmiere",
    routeEn: "/nursing-clinical-simulation-practice",
    titleFr: "Simulation clinique infirmière — décisions, priorités et sécurité du patient",
    metaDescriptionFr:
      "Simulations infirmières en français : priorités, délégation, détérioration clinique et communication — aperçu gratuit avec parcours premium pour jugement clinique avancé.",
    titleEn: "Nursing Clinical Simulation — Prioritization & Patient Safety",
    metaDescriptionEn:
      "Branching clinical simulations emphasizing prioritization and safety — French editorial ecosystem hub.",
    cluster: "french_simulation",
    audiences: ["quebec_student", "ien", "bilingual_canada"],
    segmentation: {
      freeHighlightsFr: [
        "Scénarios d’introduction et démarche décisionnelle",
        "Principes de sécurité et communication interprofessionnelle",
      ],
      premiumHighlightsFr: [
        "Branches complètes, états dynamiques et analytics de progression",
        "Intégration labs/télémesure selon produit",
      ],
    },
    localizationStatus: "figma_pending",
    clinicalReviewStatus: "pending",
    publishReadiness: "blocked",
    targetQueriesFr: ["simulation clinique infirmière", "simulation examen nclex", "cas cliniques nclex"],
    status: "figma_pending",
  },
  {
    id: "fr-ngn-jugement",
    routeFr: "/fr/jugement-clinique-ngn",
    routeEn: "/ngn-clinical-judgment-overview",
    titleFr: "Jugement clinique NGN — formats Next Gen et raisonnement infirmier",
    metaDescriptionFr:
      "Comprendre les formats NGN (matrice, tendance, SATA, etc.) avec exemples francophones et liens vers entraînement adaptatif — sans promesse de duplication à l’examen.",
    titleEn: "NGN Clinical Judgment — Item Types & Reasoning Paths",
    metaDescriptionEn:
      "Overview of NGN item families with links to adaptive practice — French companion pages for Canadian candidates.",
    cluster: "french_simulation",
    audiences: ["nclex_fr_candidate", "quebec_student"],
    segmentation: {
      freeHighlightsFr: ["Cartographie des formats et stratégies de lecture", "Exemples guidés avec rationales"],
      premiumHighlightsFr: ["Drills adaptatifs et rapports de maîtrise", "Scénarios complexes multi-étapes"],
    },
    localizationStatus: "figma_pending",
    clinicalReviewStatus: "pending",
    publishReadiness: "blocked",
    targetQueriesFr: ["jugement clinique NGN", "simulation examen nclex", "next gen nclex français"],
    status: "figma_pending",
  },
  {
    id: "fr-lab-gaz-sanguins",
    routeFr: "/fr/interpretation-gaz-sanguins",
    routeEn: "/abg-interpretation-nursing-guide",
    titleFr: "Interprétation des gaz du sang artériels — bases pour infirmières (Canada)",
    metaDescriptionFr:
      "GAZ sanguins : acidose, alcalose, compensation, implications au lit — vocabulaire clinique canadien, focus sécurité et communication avec l’équipe, exemples progressifs.",
    titleEn: "Arterial Blood Gas Interpretation — Nursing Essentials",
    metaDescriptionEn:
      "ABG fundamentals linked to bedside assessment — French hub for Canadian nursing learners.",
    cluster: "french_interpretation",
    audiences: ["quebec_student", "ien", "nclex_fr_candidate"],
    segmentation: {
      freeHighlightsFr: ["Repères pH / PaCO₂ / HCO₃⁻ et lecture rapide", "Implications infirmières immédiates"],
      premiumHighlightsFr: ["Cas mélangés avancés et dérives physiologiques", "Drills chronométrés et révision ciblée"],
    },
    localizationStatus: "figma_pending",
    clinicalReviewStatus: "pending",
    publishReadiness: "blocked",
    targetQueriesFr: ["interprétation gaz sanguins", "interprétation gaz du sang", "acidose métabolique"],
    status: "figma_pending",
  },
  {
    id: "fr-interpretation-ecg",
    routeFr: "/fr/interpretation-ecg-infirmiere",
    routeEn: "/ecg-interpretation-nursing-basics",
    titleFr: "Interprétation ECG pour infirmières — rythmes essentiels et sécurité",
    metaDescriptionFr:
      "ECG à visée infirmière : intervalles, rythmes critiques, corrélation clinique et quand escalader — cadre canadien, pas un cours de cardiologie avancée.",
    titleEn: "ECG Interpretation for Nurses — Rhythm Essentials & Escalation",
    metaDescriptionEn:
      "Nursing-focused ECG literacy with escalation cues — French companion for Canadian pathways.",
    cluster: "french_interpretation",
    audiences: ["bilingual_canada", "quebec_student", "ien"],
    segmentation: {
      freeHighlightsFr: ["Anatomie de la dérivation et repères de lecture", "Alarmes et priorités sécuritaires"],
      premiumHighlightsFr: ["Banques rythmiques étendues et cas critiques", "Liens télémesure et réanimation selon produit"],
    },
    localizationStatus: "figma_pending",
    clinicalReviewStatus: "pending",
    publishReadiness: "blocked",
    targetQueriesFr: ["interprétation ecg infirmière", "ecg infirmière canada"],
    status: "figma_pending",
  },
  {
    id: "fr-valeurs-laboratoire",
    routeFr: "/fr/valeurs-laboratoire-infirmier",
    routeEn: "/lab-values-nursing-interpretation-intro",
    titleFr: "Valeurs de laboratoire pour infirmières — repères et interprétation clinique",
    metaDescriptionFr:
      "Laboratoire infirmier : repères utiles au lit, tendances, valeurs critiques et communication — éviter la simple liste de normes sans contexte clinique.",
    titleEn: "Lab Values for Nurses — Interpretation Beyond Reference Ranges",
    metaDescriptionEn:
      "Lab literacy with clinical context for nurses — French editorial hub aligned to Canadian practice.",
    cluster: "french_interpretation",
    audiences: ["ien", "quebec_student", "francophone_immigrant_clinician"],
    segmentation: {
      freeHighlightsFr: ["Principes d’interprétation et sécurité patient", "Tableaux de repères avec nuances cliniques"],
      premiumHighlightsFr: ["Tendances multi-paramètres et scénarios dégradation", "Drills et remédiation"],
    },
    localizationStatus: "figma_pending",
    clinicalReviewStatus: "pending",
    publishReadiness: "blocked",
    targetQueriesFr: [
      "valeurs normales laboratoire",
      "interprétation des laboratoires",
      "laboratoire infirmier canada",
    ],
    status: "figma_pending",
  },
] as const;

export function getFrenchNursingSeoById(id: string): FrenchNursingSeoEntry | undefined {
  return FRENCH_NURSING_SEO_REGISTRY.find((e) => e.id === id);
}

export function getFrenchNursingSeoByRouteFr(routeFr: string): FrenchNursingSeoEntry | undefined {
  const key = routeFr.trim().replace(/\/+$/, "") || "/";
  return FRENCH_NURSING_SEO_REGISTRY.find((e) => e.routeFr.replace(/\/+$/, "") === key);
}

/** Individual entry indexability (locale policy AND entry status). */
export function shouldIndexFrenchNursingSeoEntry(entry: FrenchNursingSeoEntry): boolean {
  return entry.status === "published" && isLocaleSeoIndexable(FRENCH_MARKETING_LOCALE);
}

export function frenchNursingRobotsDirective(entry: FrenchNursingSeoEntry): "index,follow" | "noindex,follow" {
  return shouldIndexFrenchNursingSeoEntry(entry) ? "index,follow" : "noindex,follow";
}

/** Hreflang alternate emission requires locale tier policy + entry readiness. */
export function shouldEmitFrenchHreflangAlternate(entry: FrenchNursingSeoEntry): boolean {
  return entry.status === "published" && isLocaleHreflangEligible(FRENCH_MARKETING_LOCALE);
}
