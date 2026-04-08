/**
 * Wave 1 — priority med-surg overlays (heart failure, diabetes, electrolytes, sepsis, FNP respiratory).
 * Keys: pathwayId:slug — slugs unchanged from catalog.
 */
import { SECTION_HEADINGS } from "./wave1-copd-locales.mjs";

const HF = SECTION_HEADINGS;

function sec(heading, body) {
  return { heading, body };
}

/** Canada RN — shared blocks (HF & sepsis) */
const FR_CA_RN_EXAM = sec(
  HF.fr.exam_relevance,
  `Attendez-vous à la **priorisation**, à la **surveillance** et à la **sécurité** — surtout lorsque l'énoncé juxtapose des tâches routinières et une anomalie. Les items canadiens peuvent utiliser des **unités métriques** et des contextes de soins canadiens ; la logique de jugement reste la même.`,
);
const FR_CA_RN_CORE = sec(
  HF.fr.core_concept,
  `Reliez les interventions au **mécanisme sous-jacent** (perfusion, oxygénation, charge infectieuse, déplacements électrolytiques ou dynamique glucose–insuline) et à la **surveillance** qui confirme l'effet de l'intervention.`,
);
const FR_CA_RN_SCENARIO = sec(
  HF.fr.clinical_scenario,
  `Vous arbitrez des priorités concurrentes. Choisissez le client dont le **risque augmente le plus vite** sans intervention infirmière — puis l'évaluation ou l'ordonnance qui correspond à ce risque. Utilisez le contexte de soins aigus canadien lorsque l'énoncé mentionne des unités ou des rôles.`,
);

const ES_CA_RN_EXAM = sec(
  HF.es.exam_relevance,
  `Espere **priorización**, **monitorización** y **seguridad**, sobre todo cuando el enunciado suma tareas rutinarias junto a un hallazgo anormal. Los ítems canadienses pueden usar **unidades métricas** y entornos de cuidado canadienses; el patrón de juicio es el mismo.`,
);
const ES_CA_RN_CORE = sec(
  HF.es.core_concept,
  `Vincule intervenciones al **patrón subyacente** (perfusión, oxigenación, carga infecciosa, electrolitos o dinámica glucosa–insulina) y a la **monitorización** que demuestra que la intervención funciona.`,
);
const ES_CA_RN_SCENARIO = sec(
  HF.es.clinical_scenario,
  `Gestiona prioridades competidoras. Elija al cliente cuyo **riesgo sube más rápido** sin intervención de enfermería; luego la valoración u orden que corresponda. Use contexto canadiense de cuidados agudos cuando el enunciado cite unidades o roles.`,
);

const TL_CA_RN_EXAM = sec(
  HF.tl.exam_relevance,
  `Asahan ang **prioritization**, **monitoring**, at **safety** — lalo na kapag may routine tasks kasabay ng abnormal finding. Ang Canadian items ay maaaring gumamit ng **metric units** at Canadian care settings; pareho ang judgment pattern.`,
);
const TL_CA_RN_CORE = sec(
  HF.tl.core_concept,
  `Ikonekta ang mga interbensyon sa **underlying pattern** (perfusion, oxygenation, infection burden, electrolyte shifts, o glucose–insulin dynamics) at sa **monitoring** na nagpapatunay na gumagana ang plano.`,
);
const TL_CA_RN_SCENARIO = sec(
  HF.tl.clinical_scenario,
  `Namamahala ng magkakumpitensyang priyoridad. Piliin ang pasyenteng **pinakamabilis tumaas ang panganib** kung walang nursing intervention — pagkatapos ang assessment o order na tumutugma. Gamitin ang Canadian acute-care context kapag may units o roles sa stem.`,
);

export const PRIORITY_FR = {
  "ca-rn-nclex-rn:ca-rn-heart-failure": {
    title: "Insuffisance cardiaque (NCLEX-RN, Canada)",
    seoTitle: "Insuffisance cardiaque | NCLEX-RN Canada | NurseNest",
    seoDescription:
      "Contexte IR Canada : insuffisance cardiaque avec cadrage métrique et langage de portée.",
    sections: {
      clinical_meaning: sec(
        HF.fr.clinical_meaning,
        `Les items sur l'**insuffisance cardiaque** vérifient si vous reliez les **données d'évaluation au risque** : qu'est-ce qui change en premier, qu'est-ce qui exige une escalade, et quels enseignements ou ordres sont **inappropriés** dans le contexte.

**IR Canada :** utilisez les **laboratoires SI** lorsque l'énoncé donne des **mmol/L** (glucose, électrolytes, etc.) et interprétez-les avec le tableau clinique. Les normes provinciales et la politique de l'employeur encadrent toujours la délégation et les actions indépendantes.`,
      ),
      exam_relevance: FR_CA_RN_EXAM,
      core_concept: FR_CA_RN_CORE,
      clinical_scenario: FR_CA_RN_SCENARIO,
      takeaways: sec(
        HF.fr.takeaways,
        `• Reliez **constantes + laboratoires + récit** avant l'enseignement ou le congé.  
• Écartez les réponses qui **négligent l'évaluation** ou **retardent l'escalade** lorsque les données montrent une instabilité.  
• **Banque d'items :** pratiquez les questions étiquetées \`topic:heart-failure\`.  
• **Canada :** attention aux **unités métriques** et au vocabulaire de **portée** (IPR) dans certains énoncés.`,
      ),
    },
  },
  "us-rn-nclex-rn:us-rn-heart-failure": {
    title: "Insuffisance cardiaque (NCLEX-RN, É.-U.)",
    seoTitle: "Insuffisance cardiaque | NCLEX-RN É.-U. | NurseNest",
    seoDescription: "IR É.-U. : insuffisance cardiaque — leçon en cinq sections et banque d'items.",
    sections: {
      clinical_meaning: sec(
        HF.fr.clinical_meaning,
        `Les items sur l'**insuffisance cardiaque** vérifient si vous reliez les **données d'évaluation au risque** : qu'est-ce qui change en premier, qu'est-ce qui exige une escalade, et quels enseignements ou ordres sont **inappropriés** dans le contexte.`,
      ),
      exam_relevance: sec(
        HF.fr.exam_relevance,
        `Attendez-vous à la **priorisation**, à la **surveillance** et à la **sécurité** — surtout lorsque l'énoncé juxtapose des tâches routinières et une anomalie.`,
      ),
      core_concept: FR_CA_RN_CORE,
      clinical_scenario: sec(
        HF.fr.clinical_scenario,
        `Vous arbitrez des priorités concurrentes. Choisissez le client dont le **risque augmente le plus vite** sans intervention infirmière — puis l'évaluation ou l'ordonnance qui correspond à ce risque.`,
      ),
      takeaways: sec(
        HF.fr.takeaways,
        `• Reliez **constantes + laboratoires + récit** avant l'enseignement ou le congé.  
• Écartez les réponses qui **négligent l'évaluation** ou **retardent l'escalade** lorsque les données montrent une instabilité.  
• **Banque d'items :** pratiquez les questions étiquetées \`topic:heart-failure\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:diabetes-self-management-teaching": {
    title: "Enseignement sur l'autogestion du diabète (NCLEX-RN, Canada)",
    seoTitle: "Autogestion du diabète | NCLEX-RN Canada | NurseNest",
    seoDescription:
      "Jugement clinique endocrinien : relier données, risque, première action sécuritaire et délégation — cadre Canada.",
    sections: {
      clinical_meaning: sec(
        HF.fr.clinical_meaning,
        `**Enseignement sur l'autogestion du diabète** (Endocrinologie) est un thème de **jugement clinique** : relier les **données d'évaluation au risque**, choisir la **première action infirmière sécuritaire** et savoir quand **déléguer** plutôt que **conserver** une responsabilité d'évaluation. Les items canadiens peuvent utiliser des **unités SI** et un vocabulaire provincial ; la logique de priorisation reste celle du NCLEX-RN.`,
      ),
      exam_relevance: sec(
        HF.fr.exam_relevance,
        `Les concepteurs utilisent ce thème pour tester la **priorisation**, la **surveillance** et l'**escalade**. Attendez-vous à des **leurreurs** plausibles qui retardent l'évaluation, négligent un client instable ou délèguent à tort un jugement de niveau IR.`,
      ),
      core_concept: sec(
        HF.fr.core_concept,
        `Cadrez l'**autogestion du diabète** dans l'**endocrinologie** : reliez les constatations d'**évaluation** attendues aux **interventions** et à la **surveillance** qui démontre que le plan fonctionne. Difficulté par défaut sur la carte thématique : **3** ; priorité : **haut rendement**.`,
      ),
      clinical_scenario: sec(
        HF.fr.clinical_scenario,
        `Imaginez plusieurs clients ou tâches : choisissez l'option qui **réduit le préjudice le plus vite** pour le client dont l'état **se détériore** ou est à **haut risque** s'il reste sans surveillance. Si l'énoncé est stable, choisissez tout de même l'action qui **comble d'abord la lacune de données** avant les routines.`,
      ),
      takeaways: sec(
        HF.fr.takeaways,
        `• Reliez **constantes + laboratoires + récit** avant le confort ou le congé.  
• Éliminez les réponses qui **contournent l'évaluation** ou **retardent l'escalade** lorsque les données montrent un risque.  
• Associez cette page au **slug thématique \`endocrine\`** dans le hub et aux blocs chronométrés.  

**Sujets liés sur votre carte :** \`dka-vs-hhs-priorities\`, \`thyroid-storm-myxedema-clues\`, \`addisonian-crisis\`, \`cushing-syndrome-assessment\`, \`siadh-vs-di-basics\` — utilisez les filtres de la banque et du hub.`,
      ),
    },
  },
  "us-rn-nclex-rn:diabetes-self-management-teaching": {
    title: "Enseignement sur l'autogestion du diabète (NCLEX-RN, É.-U.)",
    seoTitle: "Autogestion du diabète | NCLEX-RN É.-U. | NurseNest",
    seoDescription:
      "IR É.-U. : items instable vs stable, délégation et première action dans l'autogestion du diabète.",
    sections: {
      clinical_meaning: sec(
        HF.fr.clinical_meaning,
        `**Enseignement sur l'autogestion du diabète** (Endocrinologie) est un thème de **jugement clinique** : relier les **données au risque**, choisir la **première action sécuritaire** et savoir quand **déléguer** ou **retenir** la responsabilité. Les items NCLEX-RN aux É.-U. testent souvent **instable vs stable**, **délégation** et **première action**.`,
      ),
      exam_relevance: sec(
        HF.fr.exam_relevance,
        `Les concepteurs utilisent ce thème pour tester la **priorisation**, la **surveillance** et l'**escalade**. Attendez-vous à des **leurreurs** plausibles qui retardent l'évaluation, négligent un client instable ou délèguent à tort un jugement de niveau IR.`,
      ),
      core_concept: sec(
        HF.fr.core_concept,
        `Cadrez l'**autogestion du diabète** dans l'**endocrinologie** : reliez les constatations d'**évaluation** aux **interventions** et à la **surveillance** qui démontre que le plan fonctionne. Difficulté par défaut : **3** ; priorité : **haut rendement**.`,
      ),
      clinical_scenario: sec(
        HF.fr.clinical_scenario,
        `Imaginez plusieurs clients ou tâches : choisissez l'option qui **réduit le préjudice le plus vite** pour le client dont l'état **se détériore** ou est à **haut risque** s'il reste sans surveillance. Si l'énoncé est stable, choisissez l'action qui **comble d'abord la lacune de données** avant les routines.`,
      ),
      takeaways: sec(
        HF.fr.takeaways,
        `• Reliez **constantes + laboratoires + récit** avant le confort ou le congé.  
• Éliminez les réponses qui **contournent l'évaluation** ou **retardent l'escalade** lorsque les données montrent un risque.  
• Associez cette page au **slug \`endocrine\`** dans le hub et aux blocs chronométrés.  

**Sujets liés :** \`dka-vs-hhs-priorities\`, \`thyroid-storm-myxedema-clues\`, \`addisonian-crisis\`, \`cushing-syndrome-assessment\`, \`siadh-vs-di-basics\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:diuretics-electrolyte-shifts": {
    title: "Diurétiques et déplacements électrolytiques (NCLEX-RN, Canada)",
    seoTitle: "Diurétiques et électrolytes | NCLEX-RN Canada | NurseNest",
    seoDescription:
      "Pharmacologie et surveillance : diurétiques, K⁺, Mg²⁺, acide-base — cadre Canada.",
    sections: {
      clinical_meaning: sec(
        HF.fr.clinical_meaning,
        `**Diurétiques et déplacements électrolytiques** (Pharmacologie) est un thème de **jugement clinique** : relier les **données au risque**, choisir la **première action sécuritaire** et distinguer **délégation** et **responsabilité IR**. Les items canadiens peuvent utiliser des **unités SI** et un vocabulaire provincial ; la logique de priorisation reste celle du NCLEX-RN.`,
      ),
      exam_relevance: sec(
        HF.fr.exam_relevance,
        `Les concepteurs testent la **priorisation**, la **surveillance** et l'**escalade**. Attendez-vous à des **leurreurs** qui retardent l'évaluation, négligent un client instable ou délèguent à tort un jugement de niveau IR.`,
      ),
      core_concept: sec(
        HF.fr.core_concept,
        `Cadrez les **diurétiques** dans la **pharmacologie** : reliez les constatations d'**évaluation** aux **interventions** et à la **surveillance** qui démontre que le plan fonctionne. Difficulté par défaut : **3** ; priorité : **haut rendement**.`,
      ),
      clinical_scenario: sec(
        HF.fr.clinical_scenario,
        `Imaginez plusieurs clients ou tâches : choisissez l'option qui **réduit le préjudice le plus vite** pour le client dont l'état **se détériore** ou est à **haut risque** s'il reste sans surveillance. Si l'énoncé est stable, choisissez l'action qui **comble d'abord la lacune de données** avant les routines.`,
      ),
      takeaways: sec(
        HF.fr.takeaways,
        `• Reliez **constantes + laboratoires + récit** avant le confort ou le congé.  
• Éliminez les réponses qui **contournent l'évaluation** ou **retardent l'escalade** lorsque les données montrent un risque.  
• Associez cette page au **slug \`pharmacology\`** dans le hub.  

**Sujets liés :** \`insulin-hypoglycemia\`, \`anticoagulants-bleeding-risk\`, \`antibiotic-classes-allergies\`, \`opioids-respiratory-depression\`, \`cardiac-glycosides-toxicity\`.`,
      ),
    },
  },
  "us-rn-nclex-rn:diuretics-electrolyte-shifts": {
    title: "Diurétiques et déplacements électrolytiques (NCLEX-RN, É.-U.)",
    seoTitle: "Diurétiques et électrolytes | NCLEX-RN É.-U. | NurseNest",
    seoDescription: "Pharmacologie NCLEX-RN É.-U. : diurétiques et surveillance électrolytique.",
    sections: {
      clinical_meaning: sec(
        HF.fr.clinical_meaning,
        `**Diurétiques et déplacements électrolytiques** (Pharmacologie) est un thème de **jugement clinique** : relier les **données au risque**, choisir la **première action sécuritaire** et distinguer **délégation** et **responsabilité IR**. Les items américains testent souvent **instable vs stable**, **délégation** et **première action**.`,
      ),
      exam_relevance: sec(
        HF.fr.exam_relevance,
        `Les concepteurs testent la **priorisation**, la **surveillance** et l'**escalade**. Attendez-vous à des **leurreurs** plausibles.`,
      ),
      core_concept: sec(
        HF.fr.core_concept,
        `Cadrez les **diurétiques** dans la **pharmacologie** : reliez les constatations d'**évaluation** aux **interventions** et à la **surveillance** qui démontre que le plan fonctionne. Difficulté par défaut : **3** ; priorité : **haut rendement**.`,
      ),
      clinical_scenario: sec(
        HF.fr.clinical_scenario,
        `Imaginez plusieurs clients ou tâches : choisissez l'option qui **réduit le préjudice le plus vite** pour le client dont l'état **se détériore** ou est à **haut risque** s'il reste sans surveillance.`,
      ),
      takeaways: sec(
        HF.fr.takeaways,
        `• Reliez **constantes + laboratoires + récit** avant le confort ou le congé.  
• Éliminez les réponses qui **contournent l'évaluation** ou **retardent l'escalade**.  
• Associez au **slug \`pharmacology\`**.  

**Sujets liés :** \`insulin-hypoglycemia\`, \`anticoagulants-bleeding-risk\`, \`antibiotic-classes-allergies\`, \`opioids-respiratory-depression\`, \`cardiac-glycosides-toxicity\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:sepsis-early-recognition-hy": {
    title: "Reconnaissance précoce de la sepsis (NCLEX-RN, Canada)",
    seoTitle: "Sepsis — reconnaissance précoce | NCLEX-RN Canada | NurseNest",
    seoDescription:
      "Infectiologie : repérer la détresse tôt, surveiller et escalader — cadre Canada.",
    sections: {
      clinical_meaning: sec(
        HF.fr.clinical_meaning,
        `**Reconnaissance précoce de la sepsis** (Maladies infectieuses) est un thème de **jugement clinique** : relier les **données au risque**, choisir la **première action sécuritaire** et distinguer **délégation** et **responsabilité IR**. Les items canadiens peuvent utiliser des **unités SI** et un vocabulaire provincial ; la logique de priorisation reste celle du NCLEX-RN.`,
      ),
      exam_relevance: sec(
        HF.fr.exam_relevance,
        `Les concepteurs testent la **priorisation**, la **surveillance** et l'**escalade**. Attendez-vous à des **leurreurs** plausibles.`,
      ),
      core_concept: sec(
        HF.fr.core_concept,
        `Cadrez la **sepsis** dans les **maladies infectieuses** : reliez les constatations d'**évaluation** aux **interventions** et à la **surveillance** qui démontre que le plan fonctionne. Difficulté par défaut : **4** ; priorité : **haut rendement**.`,
      ),
      clinical_scenario: sec(
        HF.fr.clinical_scenario,
        `Imaginez plusieurs clients ou tâches : choisissez l'option qui **réduit le préjudice le plus vite** pour le client dont l'état **se détériore** ou est à **haut risque** s'il reste sans surveillance.`,
      ),
      takeaways: sec(
        HF.fr.takeaways,
        `• Reliez **constantes + laboratoires + récit** avant le confort ou le congé.  
• Éliminez les réponses qui **contournent l'évaluation** ou **retardent l'escalade**.  
• Associez au **slug \`infectious\`**.  

**Sujets liés :** \`sepsis-early-recognition\`, \`hiv-confidentiality-pep-basics\`, \`isolation-precautions-in-practice\`, \`wound-infection-vs-colonization\`.`,
      ),
    },
  },
  "us-rn-nclex-rn:sepsis-early-recognition-hy": {
    title: "Reconnaissance précoce de la sepsis (NCLEX-RN, É.-U.)",
    seoTitle: "Sepsis — reconnaissance précoce | NCLEX-RN É.-U. | NurseNest",
    seoDescription: "Infectiologie NCLEX-RN É.-U. : priorisation et escalade dans la sepsis.",
    sections: {
      clinical_meaning: sec(
        HF.fr.clinical_meaning,
        `**Reconnaissance précoce de la sepsis** (Maladies infectieuses) est un thème de **jugement clinique** : relier les **données au risque**, choisir la **première action sécuritaire** et distinguer **délégation** et **responsabilité IR**. Les items américains testent souvent **instable vs stable**, **délégation** et **première action**.`,
      ),
      exam_relevance: sec(
        HF.fr.exam_relevance,
        `Les concepteurs testent la **priorisation**, la **surveillance** et l'**escalade**. Attendez-vous à des **leurreurs** plausibles.`,
      ),
      core_concept: sec(
        HF.fr.core_concept,
        `Cadrez la **sepsis** dans les **maladies infectieuses** : reliez les constatations d'**évaluation** aux **interventions** et à la **surveillance** qui démontre que le plan fonctionne. Difficulté par défaut : **4** ; priorité : **haut rendement**.`,
      ),
      clinical_scenario: sec(
        HF.fr.clinical_scenario,
        `Imaginez plusieurs clients ou tâches : choisissez l'option qui **réduit le préjudice le plus vite** pour le client dont l'état **se détériore** ou est à **haut risque** s'il reste sans surveillance.`,
      ),
      takeaways: sec(
        HF.fr.takeaways,
        `• Reliez **constantes + laboratoires + récit** avant le confort ou le congé.  
• Éliminez les réponses qui **contournent l'évaluation** ou **retardent l'escalade**.  
• Associez au **slug \`infectious\`**.  

**Sujets liés :** \`sepsis-early-recognition\`, \`hiv-confidentiality-pep-basics\`, \`isolation-precautions-in-practice\`, \`wound-infection-vs-colonization\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:ca-rn-sepsis": {
    title: "Sepsis (NCLEX-RN, Canada)",
    seoTitle: "Sepsis | NCLEX-RN Canada | NurseNest",
    seoDescription: "Contexte IR Canada : sepsis avec cadrage métrique et langage de portée.",
    sections: {
      clinical_meaning: sec(
        HF.fr.clinical_meaning,
        `Les items sur la **sepsis** vérifient si vous reliez les **données d'évaluation au risque** : qu'est-ce qui change en premier, qu'est-ce qui exige une escalade, et quels enseignements ou ordres sont **inappropriés** dans le contexte.

**IR Canada :** utilisez les **laboratoires SI** lorsque l'énoncé donne des **mmol/L** et interprétez-les avec le tableau clinique. Les normes provinciales et la politique de l'employeur encadrent la délégation et les actions indépendantes.`,
      ),
      exam_relevance: FR_CA_RN_EXAM,
      core_concept: FR_CA_RN_CORE,
      clinical_scenario: FR_CA_RN_SCENARIO,
      takeaways: sec(
        HF.fr.takeaways,
        `• Reliez **constantes + laboratoires + récit** avant l'enseignement ou le congé.  
• Écartez les réponses qui **négligent l'évaluation** ou **retardent l'escalade** lorsque les données montrent une instabilité.  
• **Banque d'items :** pratiquez les questions étiquetées \`topic:sepsis\`.  
• **Canada :** attention aux **unités métriques** et au vocabulaire de **portée** (IPR) dans certains énoncés.`,
      ),
    },
  },
  "us-rn-nclex-rn:us-rn-sepsis": {
    title: "Sepsis (NCLEX-RN, É.-U.)",
    seoTitle: "Sepsis | NCLEX-RN É.-U. | NurseNest",
    seoDescription: "IR É.-U. : sepsis — leçon en cinq sections et banque d'items.",
    sections: {
      clinical_meaning: sec(
        HF.fr.clinical_meaning,
        `Les items sur la **sepsis** vérifient si vous reliez les **données d'évaluation au risque** : qu'est-ce qui change en premier, qu'est-ce qui exige une escalade, et quels enseignements ou ordres sont **inappropriés** dans le contexte.`,
      ),
      exam_relevance: sec(
        HF.fr.exam_relevance,
        `Attendez-vous à la **priorisation**, à la **surveillance** et à la **sécurité** — surtout lorsque l'énoncé juxtapose des tâches routinières et une anomalie.`,
      ),
      core_concept: FR_CA_RN_CORE,
      clinical_scenario: sec(
        HF.fr.clinical_scenario,
        `Vous arbitrez des priorités concurrentes. Choisissez le client dont le **risque augmente le plus vite** sans intervention infirmière — puis l'évaluation ou l'ordonnance qui correspond à ce risque.`,
      ),
      takeaways: sec(
        HF.fr.takeaways,
        `• Reliez **constantes + laboratoires + récit** avant l'enseignement ou le congé.  
• Écartez les réponses qui **négligent l'évaluation** ou **retardent l'escalade** lorsque les données montrent une instabilité.  
• **Banque d'items :** pratiquez les questions étiquetées \`topic:sepsis\`.`,
      ),
    },
  },
  "us-np-fnp:fnp-overlay-respiratory-acute": {
    title: "EPOC, asthme, SDRA, pneumonie, EP — volet respiratoire aigu IPF/FNP (É.-U.)",
    seoTitle: "Volet respiratoire aigu NP | FNP É.-U. | NurseNest",
    seoDescription:
      "Superposition APRN pour pathologies respiratoires aiguës — décisions de niveau NP, jumeler avec la leçon RN.",
    sections: {
      intro: sec(
        "Introduction",
        `Il s'agit d'un **volet NP** pour **EPOC, asthme, SDRA, pneumonie, EP** — ce n'est pas la répétition intégrale de la leçon RN. Associez-le à la leçon RN \`us-rn-copd-respiratory\` du catalogue pour la physiopathologie et les exercices façon NCLEX, puis utilisez ce bloc pour les décisions de **niveau APRN**.`,
      ),
      diagnosis_np: sec(
        "Considérations diagnostiques",
        `Structurez la **représentation du problème**, les **drapeaux rouges** et les diagnostics **à ne pas manquer**. Les examens favorisent la **prochaine étape diagnostique** plutôt qu'un traitement prématuré — reliez anamnèse, examen et tests ciblés à la probabilité pré-test.`,
      ),
      management_np: sec(
        "Plans de prise en charge",
        `Exposez la **stabilisation initiale** (lorsque l'énoncé le suggère), une thérapie **conforme aux lignes directrices** lorsque le stem le permet, les **seuils de consultation** et **quand renvoyer** vers une spécialité ou les urgences. Préférez l'option qui correspond à la **gravité** et aux **comorbidités**.`,
      ),
      meds_np: sec(
        "Ajustements médicamenteux",
        `Attendez-vous à des pièges d'**ajustement posologique** selon la fonction rénale/hépatique, d'**interactions** et de **contre-indications**, de **déprescription** lorsque c'est indiqué, et de **surveillance** après un changement (laboratoires, constantes, signes de toxicité).`,
      ),
      followup_np: sec(
        "Suivi et surveillance",
        `Choisissez l'**intervalle de suivi**, l'**éducation du patient**, la **consigne de sécurité** et les **cibles de réévaluation** (symptômes, laboratoires, observance). Les items NP testent souvent si vous **bouclez le risque** — pas seulement la première action de la visite.`,
      ),
    },
  },
};

export const PRIORITY_ES = {
  "ca-rn-nclex-rn:ca-rn-heart-failure": {
    title: "Insuficiencia cardíaca (NCLEX-RN, Canadá)",
    seoTitle: "Insuficiencia cardíaca | NCLEX-RN Canadá | NurseNest",
    seoDescription: "Contexto RN Canadá: insuficiencia cardíaca con unidades métricas y alcance.",
    sections: {
      clinical_meaning: sec(
        HF.es.clinical_meaning,
        `Los ítems de **insuficiencia cardíaca** comprueban si conecta los **datos de valoración con el riesgo**: qué cambia primero, qué requiere escalada y qué enseñanza u orden es **insegura** en contexto.

**RN Canadá:** use **laboratorios SI** cuando el enunciado muestre **mmol/L** (glucosa, electrolitos, etc.) e interprete junto al cuadro clínico. Las normas provinciales y la política del empleador siguen rigiendo la delegación y las acciones independientes.`,
      ),
      exam_relevance: ES_CA_RN_EXAM,
      core_concept: ES_CA_RN_CORE,
      clinical_scenario: ES_CA_RN_SCENARIO,
      takeaways: sec(
        HF.es.takeaways,
        `• Relacione **constantes + laboratorios + historia** antes de enseñar o dar el alta.  
• Descarte opciones que **eviten la valoración** o **retrasen la escalada** cuando los datos muestran inestabilidad.  
• **Banco:** practique ítems etiquetados \`topic:heart-failure\`.  
• **Canadá:** atención a **unidades métricas** y lenguaje de **alcance** (RPN) en algunos enunciados.`,
      ),
    },
  },
  "us-rn-nclex-rn:us-rn-heart-failure": {
    title: "Insuficiencia cardíaca (NCLEX-RN, EE. UU.)",
    seoTitle: "Insuficiencia cardíaca | NCLEX-RN EE. UU. | NurseNest",
    seoDescription: "RN EE. UU.: insuficiencia cardíaca — lección de cinco secciones y banco de ítems.",
    sections: {
      clinical_meaning: sec(
        HF.es.clinical_meaning,
        `Los ítems de **insuficiencia cardíaca** comprueban si conecta los **datos de valoración con el riesgo**: qué cambia primero, qué requiere escalada y qué enseñanza u orden es **insegura** en contexto.`,
      ),
      exam_relevance: sec(
        HF.es.exam_relevance,
        `Espere **priorización**, **monitorización** y **seguridad**, sobre todo cuando el enunciado suma tareas rutinarias junto a un hallazgo anormal.`,
      ),
      core_concept: ES_CA_RN_CORE,
      clinical_scenario: sec(
        HF.es.clinical_scenario,
        `Gestiona prioridades competidoras. Elija al cliente cuyo **riesgo sube más rápido** sin intervención de enfermería; luego la valoración u orden que corresponda.`,
      ),
      takeaways: sec(
        HF.es.takeaways,
        `• Relacione **constantes + laboratorios + historia** antes de enseñar o dar el alta.  
• Descarte opciones que **eviten la valoración** o **retrasen la escalada** cuando los datos muestran inestabilidad.  
• **Banco:** practique ítems etiquetados \`topic:heart-failure\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:diabetes-self-management-teaching": {
    title: "Enseñanza de autocuidado de la diabetes (NCLEX-RN, Canadá)",
    seoTitle: "Autocuidado de la diabetes | NCLEX-RN Canadá | NurseNest",
    seoDescription: "Juicio clínico endocrino: datos, riesgo, primera acción segura y delegación — Canadá.",
    sections: {
      clinical_meaning: sec(
        HF.es.clinical_meaning,
        `**Enseñanza de autocuidado de la diabetes** (Endocrino) es un tema de **juicio clínico**: conectar **datos de valoración con riesgo**, elegir la **primera acción segura** y saber cuándo **delegar** frente a **retener** responsabilidad de valoración. Los ítems canadienses pueden usar **unidades SI** y vocabulario provincial; la lógica de priorización sigue siendo la del NCLEX-RN.`,
      ),
      exam_relevance: sec(
        HF.es.exam_relevance,
        `Los elaboradores usan este tema para evaluar **priorización**, **monitorización** y **escalada**. Espere **distractores** plausibles que retrasen la valoración, descuiden al inestable o deleguen indebidamente juicio de nivel RN.`,
      ),
      core_concept: sec(
        HF.es.core_concept,
        `Enmarque el **autocuidado de la diabetes** en **Endocrino**: relacione hallazgos de **valoración** con **intervenciones** y **monitorización** que demuestren que el plan funciona. Dificultad por defecto en el mapa: **3**; prioridad: **alto rendimiento**.`,
      ),
      clinical_scenario: sec(
        HF.es.clinical_scenario,
        `Imagine varios clientes o tareas: elija la opción que **reduce el daño más rápido** para quien **empeora** o está en **alto riesgo** si no se atiende. Si el enunciado es estable, aún así elija la acción que **cierra primero la brecha de datos** antes que las rutinas.`,
      ),
      takeaways: sec(
        HF.es.takeaways,
        `• Relacione **constantes + laboratorios + historia** antes del confort o el alta.  
• Elimine respuestas que **eviten la valoración** o **retrasen la escalada** cuando hay riesgo.  
• Empareje con el slug \`endocrine\` en el hub y bloques cronometrados.  

**Temas relacionados:** \`dka-vs-hhs-priorities\`, \`thyroid-storm-myxedema-clues\`, \`addisonian-crisis\`, \`cushing-syndrome-assessment\`, \`siadh-vs-di-basics\`.`,
      ),
    },
  },
  "us-rn-nclex-rn:diabetes-self-management-teaching": {
    title: "Enseñanza de autocuidado de la diabetes (NCLEX-RN, EE. UU.)",
    seoTitle: "Autocuidado de la diabetes | NCLEX-RN EE. UU. | NurseNest",
    seoDescription: "RN EE. UU.: inestable vs estable, delegación y primera acción en diabetes.",
    sections: {
      clinical_meaning: sec(
        HF.es.clinical_meaning,
        `**Enseñanza de autocuidado de la diabetes** (Endocrino) es un tema de **juicio clínico**: conectar **datos con riesgo**, elegir la **primera acción segura** y saber cuándo **delegar** o **retener** responsabilidad. Los ítems NCLEX-RN en EE. UU. suelen evaluar **inestable vs estable**, **delegación** y **primera acción**.`,
      ),
      exam_relevance: sec(
        HF.es.exam_relevance,
        `Los elaboradores evalúan **priorización**, **monitorización** y **escalada**. Espere **distractores** plausibles.`,
      ),
      core_concept: sec(
        HF.es.core_concept,
        `Enmarque el **autocuidado de la diabetes** en **Endocrino**: relacione **valoración** con **intervenciones** y **monitorización** que demuestren efecto. Dificultad: **3**; prioridad: **alto rendimiento**.`,
      ),
      clinical_scenario: sec(
        HF.es.clinical_scenario,
        `Imagine varios clientes o tareas: elija la opción que **reduce el daño más rápido** para quien **empeora** o está en **alto riesgo** si no se atiende.`,
      ),
      takeaways: sec(
        HF.es.takeaways,
        `• Relacione **constantes + laboratorios + historia** antes del confort o el alta.  
• Elimine respuestas que **eviten la valoración** o **retrasen la escalada**.  
• Empareje con \`endocrine\`.  

**Temas relacionados:** \`dka-vs-hhs-priorities\`, \`thyroid-storm-myxedema-clues\`, \`addisonian-crisis\`, \`cushing-syndrome-assessment\`, \`siadh-vs-di-basics\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:diuretics-electrolyte-shifts": {
    title: "Diuréticos y cambios electrolíticos (NCLEX-RN, Canadá)",
    seoTitle: "Diuréticos y electrolitos | NCLEX-RN Canadá | NurseNest",
    seoDescription: "Farmacología: diuréticos, K, Mg, equilibrio ácido-base — Canadá.",
    sections: {
      clinical_meaning: sec(
        HF.es.clinical_meaning,
        `**Diuréticos y cambios electrolíticos** (Farmacología) es un tema de **juicio clínico**: conectar **datos con riesgo**, elegir la **primera acción segura** y distinguir **delegación** de **responsabilidad RN**. Los ítems canadienses pueden usar **SI** y vocabulario provincial.`,
      ),
      exam_relevance: sec(
        HF.es.exam_relevance,
        `Evalúan **priorización**, **monitorización** y **escalada**. Espere **distractores** plausibles.`,
      ),
      core_concept: sec(
        HF.es.core_concept,
        `Enmarque los **diuréticos** en **Farmacología**: relacione **valoración** con **intervenciones** y **monitorización** que demuestren efecto. Dificultad: **3**; prioridad: **alto rendimiento**.`,
      ),
      clinical_scenario: sec(
        HF.es.clinical_scenario,
        `Imagine varios clientes o tareas: elija la opción que **reduce el daño más rápido** para quien **empeora** o está en **alto riesgo** si no se atiende.`,
      ),
      takeaways: sec(
        HF.es.takeaways,
        `• Relacione **constantes + laboratorios + historia** antes del confort o el alta.  
• Elimine respuestas que **eviten la valoración** o **retrasen la escalada**.  
• Empareje con \`pharmacology\`.  

**Temas relacionados:** \`insulin-hypoglycemia\`, \`anticoagulants-bleeding-risk\`, \`antibiotic-classes-allergies\`, \`opioids-respiratory-depression\`, \`cardiac-glycosides-toxicity\`.`,
      ),
    },
  },
  "us-rn-nclex-rn:diuretics-electrolyte-shifts": {
    title: "Diuréticos y cambios electrolíticos (NCLEX-RN, EE. UU.)",
    seoTitle: "Diuréticos y electrolitos | NCLEX-RN EE. UU. | NurseNest",
    seoDescription: "Farmacología NCLEX-RN EE. UU.: diuréticos y vigilancia electrolítica.",
    sections: {
      clinical_meaning: sec(
        HF.es.clinical_meaning,
        `**Diuréticos y cambios electrolíticos** (Farmacología) es un tema de **juicio clínico**: conectar **datos con riesgo**, elegir la **primera acción segura** y distinguir **delegación** de **responsabilidad RN**. En EE. UU. suelen evaluar **inestable vs estable**, **delegación** y **primera acción**.`,
      ),
      exam_relevance: sec(
        HF.es.exam_relevance,
        `Evalúan **priorización**, **monitorización** y **escalada**.`,
      ),
      core_concept: sec(
        HF.es.core_concept,
        `Enmarque los **diuréticos** en **Farmacología**. Dificultad: **3**; prioridad: **alto rendimiento**.`,
      ),
      clinical_scenario: sec(
        HF.es.clinical_scenario,
        `Elija al cliente con **riesgo que sube más rápido** sin intervención de enfermería.`,
      ),
      takeaways: sec(
        HF.es.takeaways,
        `• Relacione **constantes + laboratorios + historia** antes del confort o el alta.  
• Empareje con \`pharmacology\`.  

**Temas relacionados:** \`insulin-hypoglycemia\`, \`anticoagulants-bleeding-risk\`, \`antibiotic-classes-allergies\`, \`opioids-respiratory-depression\`, \`cardiac-glycosides-toxicity\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:sepsis-early-recognition-hy": {
    title: "Reconocimiento temprano de la sepsis (NCLEX-RN, Canadá)",
    seoTitle: "Sepsis — reconocimiento temprano | NCLEX-RN Canadá | NurseNest",
    seoDescription: "Infeccioso: detectar deterioro temprano, vigilar y escalar — Canadá.",
    sections: {
      clinical_meaning: sec(
        HF.es.clinical_meaning,
        `**Reconocimiento temprano de la sepsis** (Enfermedades infecciosas) es un tema de **juicio clínico**: conectar **datos con riesgo**, elegir la **primera acción segura** y distinguir **delegación** de **responsabilidad RN**. Los ítems canadienses pueden usar **SI**.`,
      ),
      exam_relevance: sec(
        HF.es.exam_relevance,
        `Evalúan **priorización**, **monitorización** y **escalada**.`,
      ),
      core_concept: sec(
        HF.es.core_concept,
        `Enmarque la **sepsis** en **Infeccioso**. Dificultad: **4**; prioridad: **alto rendimiento**.`,
      ),
      clinical_scenario: sec(
        HF.es.clinical_scenario,
        `Elija la opción que **reduce el daño más rápido** para el cliente que **empeora**.`,
      ),
      takeaways: sec(
        HF.es.takeaways,
        `• Relacione **constantes + laboratorios + historia** antes del confort o el alta.  
• Empareje con \`infectious\`.  

**Temas relacionados:** \`sepsis-early-recognition\`, \`hiv-confidentiality-pep-basics\`, \`isolation-precautions-in-practice\`, \`wound-infection-vs-colonization\`.`,
      ),
    },
  },
  "us-rn-nclex-rn:sepsis-early-recognition-hy": {
    title: "Reconocimiento temprano de la sepsis (NCLEX-RN, EE. UU.)",
    seoTitle: "Sepsis — reconocimiento temprano | NCLEX-RN EE. UU. | NurseNest",
    seoDescription: "Infeccioso NCLEX-RN EE. UU.: priorización y escalada en sepsis.",
    sections: {
      clinical_meaning: sec(
        HF.es.clinical_meaning,
        `**Reconocimiento temprano de la sepsis** (Infeccioso) es un tema de **juicio clínico**. En EE. UU. suelen evaluar **inestable vs estable**, **delegación** y **primera acción**.`,
      ),
      exam_relevance: sec(
        HF.es.exam_relevance,
        `Evalúan **priorización**, **monitorización** y **escalada**.`,
      ),
      core_concept: sec(
        HF.es.core_concept,
        `Enmarque la **sepsis** en **Infeccioso**. Dificultad: **4**; prioridad: **alto rendimiento**.`,
      ),
      clinical_scenario: sec(
        HF.es.clinical_scenario,
        `Elija la opción que **reduce el daño más rápido** para el cliente que **empeora**.`,
      ),
      takeaways: sec(
        HF.es.takeaways,
        `• Relacione **constantes + laboratorios + historia** antes del confort o el alta.  
• Empareje con \`infectious\`.  

**Temas relacionados:** \`sepsis-early-recognition\`, \`hiv-confidentiality-pep-basics\`, \`isolation-precautions-in-practice\`, \`wound-infection-vs-colonization\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:ca-rn-sepsis": {
    title: "Sepsis (NCLEX-RN, Canadá)",
    seoTitle: "Sepsis | NCLEX-RN Canadá | NurseNest",
    seoDescription: "Contexto RN Canadá: sepsis con unidades métricas y alcance.",
    sections: {
      clinical_meaning: sec(
        HF.es.clinical_meaning,
        `Los ítems de **sepsis** comprueban si conecta **datos de valoración con riesgo**: qué cambia primero, qué requiere escalada y qué enseñanza u orden es **insegura** en contexto.

**RN Canadá:** use **laboratorios SI** cuando el enunciado muestre **mmol/L** e interprete junto al cuadro clínico. Las normas provinciales y la política del empleador siguen rigiendo la delegación.`,
      ),
      exam_relevance: ES_CA_RN_EXAM,
      core_concept: ES_CA_RN_CORE,
      clinical_scenario: ES_CA_RN_SCENARIO,
      takeaways: sec(
        HF.es.takeaways,
        `• Relacione **constantes + laboratorios + historia** antes de enseñar o dar el alta.  
• Descarte opciones que **eviten la valoración** o **retrasen la escalada** cuando hay inestabilidad.  
• **Banco:** practique ítems \`topic:sepsis\`.  
• **Canadá:** atención a **unidades métricas** y lenguaje de **alcance** (RPN).`,
      ),
    },
  },
  "us-rn-nclex-rn:us-rn-sepsis": {
    title: "Sepsis (NCLEX-RN, EE. UU.)",
    seoTitle: "Sepsis | NCLEX-RN EE. UU. | NurseNest",
    seoDescription: "RN EE. UU.: sepsis — lección de cinco secciones y banco de ítems.",
    sections: {
      clinical_meaning: sec(
        HF.es.clinical_meaning,
        `Los ítems de **sepsis** comprueban si conecta **datos de valoración con riesgo**: qué cambia primero, qué requiere escalada y qué enseñanza u orden es **insegura** en contexto.`,
      ),
      exam_relevance: sec(
        HF.es.exam_relevance,
        `Espere **priorización**, **monitorización** y **seguridad**, sobre todo cuando el enunciado suma tareas rutinarias junto a un hallazgo anormal.`,
      ),
      core_concept: ES_CA_RN_CORE,
      clinical_scenario: sec(
        HF.es.clinical_scenario,
        `Gestiona prioridades competidoras. Elija al cliente cuyo **riesgo sube más rápido** sin intervención de enfermería; luego la valoración u orden que corresponda.`,
      ),
      takeaways: sec(
        HF.es.takeaways,
        `• Relacione **constantes + laboratorios + historia** antes de enseñar o dar el alta.  
• Descarte opciones que **eviten la valoración** o **retrasen la escalada** cuando hay inestabilidad.  
• **Banco:** practique ítems \`topic:sepsis\`.`,
      ),
    },
  },
  "us-np-fnp:fnp-overlay-respiratory-acute": {
    title: "EPOC, asma, SDRA, neumonía, EP — suplemento respiratorio agudo NP/FNP (EE. UU.)",
    seoTitle: "Suplemento respiratorio agudo NP | FNP EE. UU. | NurseNest",
    seoDescription:
      "Superposición APRN para patología respiratoria aguda — decisiones de nivel NP; emparejar con la lección RN.",
    sections: {
      intro: sec(
        "Introducción",
        `Este es un **suplemento NP** para **EPOC, asma, SDRA, neumonía, EP** — no repite toda la lección RN. Empareje con \`us-rn-copd-respiratory\` del catálogo para fisiopatología y ejercicios estilo NCLEX; use este bloque para decisiones de **nivel APRN**.`,
      ),
      diagnosis_np: sec(
        "Consideraciones de diagnóstico",
        `Enmarque la **representación del problema**, **banderas rojas** y diagnósticos **que no puede perder**. Los exámenes favorecen el **siguiente paso diagnóstico** frente a tratamiento prematuro — una historia, examen y pruebas dirigidas con la probabilidad preprueba.`,
      ),
      management_np: sec(
        "Planes de manejo",
        `Exponga **estabilización inicial** (cuando el enunciado lo sugiera), terapia **alineada con guías** si el stem lo permite, **disparadores de consulta** y **cuándo derivar** a especialidad o urgencias. Prefiera la opción que coincida con **gravedad** y **comorbilidades**.`,
      ),
      meds_np: sec(
        "Ajustes de medicación",
        `Espere **ajuste de dosis** por función renal/hepática, trampas de **interacción** y **contraindicación**, **desprescripción** cuando corresponda y **monitorización** tras un cambio (laboratorios, constantes, toxicidad).`,
      ),
      followup_np: sec(
        "Seguimiento y monitorización",
        `Elija **intervalo de seguimiento**, **educación del paciente**, **red de seguridad** y **objetivos de reevaluación** (síntomas, laboratorios, adherencia). Los ítems NP suelen evaluar si **cierra el ciclo** del riesgo — no solo la primera acción de la visita.`,
      ),
    },
  },
};

export const PRIORITY_TL = {
  "ca-rn-nclex-rn:ca-rn-heart-failure": {
    title: "Heart failure (NCLEX-RN, Canada)",
    seoTitle: "Heart failure | NCLEX-RN Canada | NurseNest",
    seoDescription: "Canadian RN: heart failure na may metric units at scope language.",
    sections: {
      clinical_meaning: sec(
        HF.tl.clinical_meaning,
        `Sinusukat ng mga item sa **heart failure** kung naikonekta mo ang **assessment data sa panganib**: ano ang unang nagbabago, ano ang nangangailangan ng escalation, at aling teaching o order ang **hindi ligtas** sa konteksto.

**RN Canada:** gamitin ang **SI labs** kapag **mmol/L** ang nasa stem (glucose, electrolytes) at bigyang-kahulugan kasama ang clinical picture. Ang provincial standards at employer policy ay namamahala pa rin sa delegasyon.`,
      ),
      exam_relevance: TL_CA_RN_EXAM,
      core_concept: TL_CA_RN_CORE,
      clinical_scenario: TL_CA_RN_SCENARIO,
      takeaways: sec(
        HF.tl.takeaways,
        `• Ikonekta ang **vitals + labs + kwento** bago magturo o mag-discharge.  
• Alisin ang mga sagot na **lumalaktaw sa assessment** o **natatagalan ang escalation** kapag may instability.  
• **Bank:** mag-drill ng items na may tag na \`topic:heart-failure\`.  
• **Canada:** tingnan ang **metric labs** at **college scope** language sa PN stems.`,
      ),
    },
  },
  "us-rn-nclex-rn:us-rn-heart-failure": {
    title: "Heart failure (NCLEX-RN, US)",
    seoTitle: "Heart failure | NCLEX-RN US | NurseNest",
    seoDescription: "US RN: heart failure — limang section na leksyon at item bank.",
    sections: {
      clinical_meaning: sec(
        HF.tl.clinical_meaning,
        `Sinusukat kung naikonekta mo ang **assessment data sa panganib**: ano ang unang nagbabago, ano ang nangangailangan ng escalation, at aling teaching o order ang **hindi ligtas** sa konteksto.`,
      ),
      exam_relevance: sec(
        HF.tl.exam_relevance,
        `Asahan ang **prioritization**, **monitoring**, at **safety** — lalo na kapag may routine tasks kasabay ng abnormal finding.`,
      ),
      core_concept: TL_CA_RN_CORE,
      clinical_scenario: sec(
        HF.tl.clinical_scenario,
        `Namamahala ng magkakumpitensyang priyoridad. Piliin ang pasyenteng **pinakamabilis tumaas ang panganib** kung walang nursing intervention — pagkatapos ang assessment o order na tumutugma.`,
      ),
      takeaways: sec(
        HF.tl.takeaways,
        `• Ikonekta ang **vitals + labs + kwento** bago magturo o mag-discharge.  
• Alisin ang mga sagot na **lumalaktaw sa assessment** o **natatagalan ang escalation** kapag may instability.  
• **Bank:** mag-drill ng \`topic:heart-failure\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:diabetes-self-management-teaching": {
    title: "Diabetes self-management teaching (NCLEX-RN, Canada)",
    seoTitle: "Diabetes self-management | NCLEX-RN Canada | NurseNest",
    seoDescription: "Endocrine clinical judgment: data, risk, first safe action, delegation — Canada.",
    sections: {
      clinical_meaning: sec(
        HF.tl.clinical_meaning,
        `**Diabetes self-management teaching** (Endocrine) ay **clinical judgment** na tema: ikonekta ang **assessment data sa panganib**, piliin ang **unang ligtas na nursing action**, at alamin kailan **i-delegate** vs **panatilihin** ang responsibilidad. Maaaring may **SI units** at Canadian wording ang mga item; pareho ang NCLEX-RN prioritization logic.`,
      ),
      exam_relevance: sec(
        HF.tl.exam_relevance,
        `Ginagamit ito para sukatin ang **prioritization**, **monitoring**, at **escalation**. May **distractors** na mukhang tama pero nag-aatras ng assessment, lumalaktaw sa unstable client, o hindi tamang nagde-delegate ng RN-level judgment.`,
      ),
      core_concept: sec(
        HF.tl.core_concept,
        `I-frame ang **diabetes self-management** sa **Endocrine**: iugnay ang inaasahang **assessment** findings sa **interventions** at **monitoring** na nagpapakita na gumagana ang plano. Default difficulty sa topic map: **3**; priority: **high_yield**.`,
      ),
      clinical_scenario: sec(
        HF.tl.clinical_scenario,
        `Isipin ang maraming pasyente o gawain: piliin ang opsyon na **pinakamabilis bawasan ang pinsala** para sa taong **lumala** o **high risk** kung walang atensyon. Kung stable ang stem, piliin pa rin ang aksyon na **una ang data gap** bago ang routines.`,
      ),
      takeaways: sec(
        HF.tl.takeaways,
        `• **Vitals + labs + kwento** bago comfort o discharge teaching.  
• Alisin ang mga sagot na **lumalaktaw sa assessment** o **natatagalan ang escalation** kapag may risk.  
• Pair sa **topic slug \`endocrine\`** sa hub at timed blocks.  

**Related topics:** \`dka-vs-hhs-priorities\`, \`thyroid-storm-myxedema-clues\`, \`addisonian-crisis\`, \`cushing-syndrome-assessment\`, \`siadh-vs-di-basics\`.`,
      ),
    },
  },
  "us-rn-nclex-rn:diabetes-self-management-teaching": {
    title: "Diabetes self-management teaching (NCLEX-RN, US)",
    seoTitle: "Diabetes self-management | NCLEX-RN US | NurseNest",
    seoDescription: "US RN: unstable vs stable, delegation, first action sa diabetes teaching.",
    sections: {
      clinical_meaning: sec(
        HF.tl.clinical_meaning,
        `**Diabetes self-management teaching** (Endocrine) ay **clinical judgment** na tema: ikonekta ang **data sa panganib**, piliin ang **unang ligtas na aksyon**, at alamin kailan **mag-delegate** vs **panatilihin** ang responsibilidad. Ang US NCLEX-RN ay madalas mag-test ng **unstable vs stable**, **delegation**, at **first action**.`,
      ),
      exam_relevance: sec(
        HF.tl.exam_relevance,
        `Sinusukat ang **prioritization**, **monitoring**, at **escalation**. May **distractors** na mukhang makatwiran pero nag-aatras ng assessment.`,
      ),
      core_concept: sec(
        HF.tl.core_concept,
        `I-frame sa **Endocrine**: **assessment** → **interventions** → **monitoring** na nagpapatunay na gumagana ang plano. Difficulty: **3**; priority: **high_yield**.`,
      ),
      clinical_scenario: sec(
        HF.tl.clinical_scenario,
        `Maraming pasyente/gawain: unahin ang **pinakamabilis na pinsala** kung may **deterioration** o **high risk**.`,
      ),
      takeaways: sec(
        HF.tl.takeaways,
        `• **Vitals + labs + kwento** bago comfort o discharge.  
• Iwasan ang **skip assessment** / **delay escalation**.  
• Pair sa \`endocrine\`.  

**Related:** \`dka-vs-hhs-priorities\`, \`thyroid-storm-myxedema-clues\`, \`addisonian-crisis\`, \`cushing-syndrome-assessment\`, \`siadh-vs-di-basics\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:diuretics-electrolyte-shifts": {
    title: "Diuretics & electrolyte shifts (NCLEX-RN, Canada)",
    seoTitle: "Diuretics & electrolytes | NCLEX-RN Canada | NurseNest",
    seoDescription: "Pharmacology: diuretics, K, Mg, acid-base — Canada.",
    sections: {
      clinical_meaning: sec(
        HF.tl.clinical_meaning,
        `**Diuretics & electrolyte shifts** (Pharmacology) ay **clinical judgment** na tema: ikonekta ang **data sa panganib**, piliin ang **unang ligtas na aksyon**, at alamin kailan **mag-delegate** vs **panatilihin** ang RN-level judgment. Maaaring may **SI** ang Canadian items.`,
      ),
      exam_relevance: sec(
        HF.tl.exam_relevance,
        `Sinusukat ang **prioritization**, **monitoring**, at **escalation**.`,
      ),
      core_concept: sec(
        HF.tl.core_concept,
        `I-frame sa **Pharmacology**: **assessment** → **interventions** → **monitoring**. Difficulty: **3**; priority: **high_yield**.`,
      ),
      clinical_scenario: sec(
        HF.tl.clinical_scenario,
        `Unahin ang **pinakamataas na risk** na kailangan ng nursing intervention.`,
      ),
      takeaways: sec(
        HF.tl.takeaways,
        `• **Vitals + labs + kwento** bago comfort o discharge.  
• Pair sa \`pharmacology\`.  

**Related:** \`insulin-hypoglycemia\`, \`anticoagulants-bleeding-risk\`, \`antibiotic-classes-allergies\`, \`opioids-respiratory-depression\`, \`cardiac-glycosides-toxicity\`.`,
      ),
    },
  },
  "us-rn-nclex-rn:diuretics-electrolyte-shifts": {
    title: "Diuretics & electrolyte shifts (NCLEX-RN, US)",
    seoTitle: "Diuretics & electrolytes | NCLEX-RN US | NurseNest",
    seoDescription: "US NCLEX-RN pharmacology: diuretics at electrolyte monitoring.",
    sections: {
      clinical_meaning: sec(
        HF.tl.clinical_meaning,
        `**Diuretics & electrolyte shifts** (Pharmacology) — **clinical judgment**: **data → risk → first action**, **delegation** vs **retain**. US items: **unstable vs stable**, **delegation**, **first action**.`,
      ),
      exam_relevance: sec(
        HF.tl.exam_relevance,
        `**Prioritization**, **monitoring**, **escalation**.`,
      ),
      core_concept: sec(
        HF.tl.core_concept,
        `I-frame sa **Pharmacology**. Difficulty: **3**; priority: **high_yield**.`,
      ),
      clinical_scenario: sec(
        HF.tl.clinical_scenario,
        `Unahin ang **pinakamataas na risk** na kailangan ng intervention.`,
      ),
      takeaways: sec(
        HF.tl.takeaways,
        `• **Vitals + labs + kwento** bago comfort o discharge.  
• Pair sa \`pharmacology\`.  

**Related:** \`insulin-hypoglycemia\`, \`anticoagulants-bleeding-risk\`, \`antibiotic-classes-allergies\`, \`opioids-respiratory-depression\`, \`cardiac-glycosides-toxicity\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:sepsis-early-recognition-hy": {
    title: "Sepsis early recognition (NCLEX-RN, Canada)",
    seoTitle: "Sepsis early recognition | NCLEX-RN Canada | NurseNest",
    seoDescription: "Infectious disease: maagang pagkilala, monitor, escalate — Canada.",
    sections: {
      clinical_meaning: sec(
        HF.tl.clinical_meaning,
        `**Sepsis early recognition** (Infectious disease) — **clinical judgment**: **data → risk → first action**, **delegation** vs **retain**. Canadian items: maaaring may **SI**.`,
      ),
      exam_relevance: sec(
        HF.tl.exam_relevance,
        `**Prioritization**, **monitoring**, **escalation**.`,
      ),
      core_concept: sec(
        HF.tl.core_concept,
        `I-frame sa **Infectious disease**. Difficulty: **4**; priority: **high_yield**.`,
      ),
      clinical_scenario: sec(
        HF.tl.clinical_scenario,
        `Unahin ang **pinakamabilis na pinsala** kung may **deterioration**.`,
      ),
      takeaways: sec(
        HF.tl.takeaways,
        `• **Vitals + labs + kwento** bago comfort o discharge.  
• Pair sa \`infectious\`.  

**Related:** \`sepsis-early-recognition\`, \`hiv-confidentiality-pep-basics\`, \`isolation-precautions-in-practice\`, \`wound-infection-vs-colonization\`.`,
      ),
    },
  },
  "us-rn-nclex-rn:sepsis-early-recognition-hy": {
    title: "Sepsis early recognition (NCLEX-RN, US)",
    seoTitle: "Sepsis early recognition | NCLEX-RN US | NurseNest",
    seoDescription: "US NCLEX-RN infectious: prioritization at escalation sa sepsis.",
    sections: {
      clinical_meaning: sec(
        HF.tl.clinical_meaning,
        `**Sepsis early recognition** (Infectious disease). US items: **unstable vs stable**, **delegation**, **first action**.`,
      ),
      exam_relevance: sec(
        HF.tl.exam_relevance,
        `**Prioritization**, **monitoring**, **escalation**.`,
      ),
      core_concept: sec(
        HF.tl.core_concept,
        `I-frame sa **Infectious disease**. Difficulty: **4**; priority: **high_yield**.`,
      ),
      clinical_scenario: sec(
        HF.tl.clinical_scenario,
        `Unahin ang **pinakamataas na risk**.`,
      ),
      takeaways: sec(
        HF.tl.takeaways,
        `• **Vitals + labs + kwento** bago comfort o discharge.  
• Pair sa \`infectious\`.  

**Related:** \`sepsis-early-recognition\`, \`hiv-confidentiality-pep-basics\`, \`isolation-precautions-in-practice\`, \`wound-infection-vs-colonization\`.`,
      ),
    },
  },
  "ca-rn-nclex-rn:ca-rn-sepsis": {
    title: "Sepsis (NCLEX-RN, Canada)",
    seoTitle: "Sepsis | NCLEX-RN Canada | NurseNest",
    seoDescription: "Canadian RN: sepsis na may metric/scope framing.",
    sections: {
      clinical_meaning: sec(
        HF.tl.clinical_meaning,
        `Ang mga item sa **sepsis** ay sinusukat kung naikonekta mo ang **assessment data sa panganib**: ano ang unang nagbabago, ano ang nangangailangan ng escalation, at aling teaching o order ang **hindi ligtas** sa konteksto.

**RN Canada:** gamitin ang **SI labs** kapag **mmol/L** ang nasa stem at bigyang-kahulugan kasama ang clinical picture. Ang provincial standards at employer policy ay namamahala pa rin sa delegasyon.`,
      ),
      exam_relevance: TL_CA_RN_EXAM,
      core_concept: TL_CA_RN_CORE,
      clinical_scenario: TL_CA_RN_SCENARIO,
      takeaways: sec(
        HF.tl.takeaways,
        `• **Vitals + labs + kwento** bago magturo o mag-discharge.  
• Alisin ang mga sagot na **lumalaktaw sa assessment** o **natatagalan ang escalation** kapag may instability.  
• **Bank:** mag-drill ng \`topic:sepsis\`.  
• **Canada:** tingnan ang **metric labs** at **college scope** sa PN stems.`,
      ),
    },
  },
  "us-rn-nclex-rn:us-rn-sepsis": {
    title: "Sepsis (NCLEX-RN, US)",
    seoTitle: "Sepsis | NCLEX-RN US | NurseNest",
    seoDescription: "US RN: sepsis — limang section na leksyon at item bank.",
    sections: {
      clinical_meaning: sec(
        HF.tl.clinical_meaning,
        `Ang mga item sa **sepsis** ay sinusukat kung naikonekta mo ang **assessment data sa panganib**: ano ang unang nagbabago, ano ang nangangailangan ng escalation, at aling teaching o order ang **hindi ligtas** sa konteksto.`,
      ),
      exam_relevance: sec(
        HF.tl.exam_relevance,
        `Asahan ang **prioritization**, **monitoring**, at **safety** — lalo na kapag may routine tasks kasabay ng abnormal finding.`,
      ),
      core_concept: TL_CA_RN_CORE,
      clinical_scenario: sec(
        HF.tl.clinical_scenario,
        `Namamahala ng magkakumpitensyang priyoridad. Piliin ang pasyenteng **pinakamabilis tumaas ang panganib** kung walang nursing intervention — pagkatapos ang assessment o order na tumutugma.`,
      ),
      takeaways: sec(
        HF.tl.takeaways,
        `• **Vitals + labs + kwento** bago magturo o mag-discharge.  
• Alisin ang mga sagot na **lumalaktaw sa assessment** o **natatagalan ang escalation** kapag may instability.  
• **Bank:** mag-drill ng \`topic:sepsis\`.`,
      ),
    },
  },
  "us-np-fnp:fnp-overlay-respiratory-acute": {
    title: "COPD, asthma, ARDS, pneumonia, PE — NP respiratory overlay (FNP)",
    seoTitle: "NP acute respiratory overlay | FNP US | NurseNest",
    seoDescription:
      "APRN overlay para sa acute respiratory conditions — pair sa buong RN lesson sa catalog.",
    sections: {
      intro: sec(
        "Introduction",
        `Ito ay **NP overlay** para sa **COPD, asthma, ARDS, pneumonia, PE** — hindi ulit ng buong RN lesson. Pair sa \`us-rn-copd-respiratory\` sa pathway catalog para sa pathophysiology at NCLEX-style drills; gamitin ang block na ito para sa **APRN-level** na desisyon.`,
      ),
      diagnosis_np: sec(
        "Diagnosis considerations",
        `I-frame ang **problem representation**, **red flags**, at **must-not-miss** diagnoses. Mas gusto ng boards ang **next diagnostic step** kaysa **premature treatment** — iugnay ang history, exam, at targeted testing sa pre-test probability.`,
      ),
      management_np: sec(
        "Management plans",
        `Ilahad ang **initial stabilization** (kung ipinahiwatig ng stem), **guideline-concordant** therapy kung pinapayagan ng stem, **consult triggers**, at **kailan mag-defer** sa specialty o ED. Piliin ang opsyon na tumutugma sa **severity** at **comorbid constraints**.`,
      ),
      meds_np: sec(
        "Medication adjustments",
        `Asahan ang **dose adjustment** para sa renal/hepatic function, **interaction** at **contraindication** traps, **deprescribing** kung angkop, at **monitoring** pagkatapos ng pagbabago (labs, vitals, toxicity screens).`,
      ),
      followup_np: sec(
        "Follow-up & monitoring",
        `Piliin ang **follow-up interval**, **patient education**, **safety netting**, at **reassessment targets** (symptoms, labs, adherence). Ang NP items ay madalas sumusukat kung **nasa-sara mo ang loop** sa panganib — hindi lang ang unang aksyon sa visit.`,
      ),
    },
  },
};
