/**
 * 30 French Canadian blog topics + 5 full long-form blog posts (1200+ words)
 * for the Canada RPN / REx-PN market.
 *
 * Written in fluent Canadian French (québécois standard professionnel)
 * with correct nursing terminology (IAA = infirmière/infirmier auxiliaire
 * autorisé, OIIQ, OIIAQ, etc.). NOT literal translations from English.
 *
 * DISTINCT from:
 *   - market-blog-posts.ts  → 1 existing French post (blog-ca-fr: "Comment réussir le REx-PN")
 *   - market-landing-pages.ts → 1 existing French landing page
 *   - blog-topic-clusters.ts → English Canada RPN topics (ca-1 to ca-20)
 *   - conversion-blog-posts.ts → English REx-PN post (cv-ca-2)
 *   - long-form-seo-blog-posts.ts → English Canada RPN posts
 *
 * Route: /fr/canada/rpn/rex-pn/blog/{{slug}}
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";

// ── Types ────────────────────────────────────────────────────────────────────

export type FrenchBlogSection = {
  heading: string;
  body: string;
};

export type FrenchFaqItem = {
  question: string;
  answer: string;
};

export type FrenchReference = {
  text: string;
};

export type FrenchBlogTopic = {
  id: string;
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string;
  exam: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  primaryKeyword: string;
  searchIntent: "transactional" | "informational" | "comparison";
};

export type FrenchBlogPost = FrenchBlogTopic & {
  wordCount: number;
  sections: FrenchBlogSection[];
  faq: FrenchFaqItem[];
  references: FrenchReference[];
};

// ── Link helper (French Canadian locale) ─────────────────────────────────────

function L() {
  const base = "/fr/canada/rpn/rex-pn";
  return {
    lessons: `${base}/lessons`,
    questions: `${base}/questions`,
    cat: `${base}/cat`,
    pricing: `${base}/pricing`,
    lesson: (slug: string) => `${base}/lessons/${slug}`,
  };
}

const lnk = L();

// ═════════════════════════════════════════════════════════════════════════════
// PART 1: 30 FRENCH CANADIAN BLOG TOPICS
// ═════════════════════════════════════════════════════════════════════════════

export const FRENCH_BLOG_TOPICS: FrenchBlogTopic[] = [
  // ── Planification et stratégie d'étude ────────────────────────────────────
  { id: "fr-1", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Plan d'étude REx-PN en 6 semaines : guide complet pour les IAA du Québec", metaTitle: "Plan d'étude REx-PN 6 semaines Québec | NurseNest", metaDescription: "Plan d'étude structuré de 6 semaines pour réussir le REx-PN. Horaire quotidien, objectifs de questions pratiques et stratégies pour les infirmières auxiliaires autorisées.", slug: "plan-etude-rex-pn-6-semaines-guide-complet-iaa-quebec", primaryKeyword: "plan d'étude REx-PN", searchIntent: "transactional" },
  { id: "fr-2", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Comment réussir le REx-PN du premier coup : 10 conseils essentiels", metaTitle: "Réussir le REx-PN du premier coup | NurseNest", metaDescription: "10 conseils éprouvés pour réussir le REx-PN du premier coup. Stratégies d'étude, erreurs à éviter et ressources de préparation pour les IAA canadiennes.", slug: "reussir-rex-pn-premier-coup-10-conseils-essentiels", primaryKeyword: "réussir REx-PN premier coup", searchIntent: "transactional" },
  { id: "fr-3", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "REx-PN en 30 jours : plan d'étude accéléré pour les IAA pressées", metaTitle: "REx-PN en 30 jours plan accéléré | NurseNest", metaDescription: "Seulement 30 jours avant le REx-PN? Plan d'étude accéléré avec priorités quotidiennes, nombre de questions cible et stratégies de révision efficaces.", slug: "rex-pn-30-jours-plan-etude-accelere-iaa", primaryKeyword: "REx-PN 30 jours plan étude", searchIntent: "transactional" },
  { id: "fr-4", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Les 5 erreurs les plus fréquentes au REx-PN (et comment les corriger)", metaTitle: "5 erreurs fréquentes REx-PN | NurseNest", metaDescription: "Pourquoi les IAA échouent au REx-PN? Les 5 erreurs les plus courantes et les stratégies concrètes pour les corriger avant le jour de l'examen.", slug: "5-erreurs-frequentes-rex-pn-comment-corriger", primaryKeyword: "erreurs REx-PN fréquentes", searchIntent: "informational" },
  { id: "fr-5", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Cours de préparation REx-PN vs autoformation : que choisir?", metaTitle: "Cours préparation REx-PN vs autoformation | NurseNest", metaDescription: "Cours de préparation à 500 $+ ou autoformation en ligne? Comparaison des coûts, de l'efficacité et des résultats pour les candidates au REx-PN au Canada.", slug: "cours-preparation-rex-pn-vs-autoformation-que-choisir", primaryKeyword: "cours préparation REx-PN vs autoformation", searchIntent: "comparison" },

  // ── Questions pratiques et format d'examen ────────────────────────────────
  { id: "fr-6", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Questions pratiques REx-PN gratuites : testez votre niveau maintenant", metaTitle: "Questions pratiques REx-PN gratuites | NurseNest", metaDescription: "Essayez des questions pratiques REx-PN gratuites avec justifications détaillées. Évaluez votre raisonnement clinique et identifiez vos lacunes.", slug: "questions-pratiques-rex-pn-gratuites-testez-niveau", primaryKeyword: "questions pratiques REx-PN gratuites", searchIntent: "transactional" },
  { id: "fr-7", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Le format TAO du REx-PN expliqué : comment fonctionne le test adaptatif", metaTitle: "Format TAO REx-PN expliqué | NurseNest", metaDescription: "Le REx-PN utilise le test adaptatif par ordinateur (TAO). Comment ça fonctionne, combien de questions, et quand le test s'arrête — tout expliqué clairement.", slug: "format-tao-rex-pn-explique-test-adaptatif-ordinateur", primaryKeyword: "format TAO REx-PN", searchIntent: "informational" },
  { id: "fr-8", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Questions à choix multiples du REx-PN : types et stratégies de réponse", metaTitle: "Questions choix multiples REx-PN stratégies | NurseNest", metaDescription: "Les différents types de questions au REx-PN — choix unique, choix multiples, classement — et la stratégie systématique pour chaque type.", slug: "questions-choix-multiples-rex-pn-types-strategies-reponse", primaryKeyword: "questions choix multiples REx-PN", searchIntent: "informational" },
  { id: "fr-9", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Examens adaptatifs de pratique : pourquoi ils sont indispensables avant le REx-PN", metaTitle: "Examens adaptatifs pratique REx-PN | NurseNest", metaDescription: "Les examens de pratique adaptatifs simulent le vrai REx-PN. Découvrez pourquoi ils sont plus efficaces que les tests à format fixe et comment les utiliser.", slug: "examens-adaptatifs-pratique-indispensables-rex-pn", primaryKeyword: "examens adaptatifs pratique REx-PN", searchIntent: "transactional" },
  { id: "fr-10", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "REx-PN vs CPNRE : ce qui a changé et comment s'adapter", metaTitle: "REx-PN vs CPNRE différences | NurseNest", metaDescription: "Le REx-PN a remplacé le CPNRE en 2022. Quelles sont les différences? Format TAO, jugement clinique accru, et nouvelles stratégies de préparation.", slug: "rex-pn-vs-cpnre-changements-comment-adapter", primaryKeyword: "REx-PN vs CPNRE différences", searchIntent: "comparison" },

  // ── Contenu clinique ──────────────────────────────────────────────────────
  { id: "fr-11", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Pharmacologie au REx-PN : médicaments à haut risque que chaque IAA doit connaître", metaTitle: "Pharmacologie REx-PN médicaments haut risque | NurseNest", metaDescription: "Insuline, héparine, warfarine, digoxine — les médicaments à haut risque les plus testés au REx-PN. Règles d'administration, effets indésirables et interventions infirmières.", slug: "pharmacologie-rex-pn-medicaments-haut-risque-iaa", primaryKeyword: "pharmacologie REx-PN médicaments haut risque", searchIntent: "informational" },
  { id: "fr-12", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Jugement clinique au REx-PN : la compétence clé que votre programme n'a pas assez enseignée", metaTitle: "Jugement clinique REx-PN guide | NurseNest", metaDescription: "Le jugement clinique est la fondation du REx-PN. Qu'est-ce que c'est, en quoi il diffère de la mémorisation, et comment le développer — guide complet.", slug: "jugement-clinique-rex-pn-competence-cle-guide", primaryKeyword: "jugement clinique REx-PN", searchIntent: "informational" },
  { id: "fr-13", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Valeurs de laboratoire au REx-PN : les plages normales à mémoriser", metaTitle: "Valeurs laboratoire REx-PN | NurseNest", metaDescription: "Les valeurs de laboratoire essentielles pour le REx-PN : plages normales, valeurs critiques et interventions infirmières en cas de résultats anormaux.", slug: "valeurs-laboratoire-rex-pn-plages-normales-memoriser", primaryKeyword: "valeurs laboratoire REx-PN", searchIntent: "informational" },
  { id: "fr-14", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Délégation et champ de pratique IAA au REx-PN : guide de réponse", metaTitle: "Délégation champ de pratique REx-PN | NurseNest", metaDescription: "Les questions de délégation au REx-PN testent le champ de pratique des IAA. Que pouvez-vous déléguer? À qui? Guide avec exemples et pièges à éviter.", slug: "delegation-champ-pratique-iaa-rex-pn-guide-reponse", primaryKeyword: "délégation champ pratique IAA REx-PN", searchIntent: "informational" },
  { id: "fr-15", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Prévention des infections au REx-PN : précautions standard et isolement", metaTitle: "Prévention infections REx-PN | NurseNest", metaDescription: "Précautions standard, types d'isolement, et sepsie — contenu de prévention des infections fréquemment testé au REx-PN pour les IAA canadiennes.", slug: "prevention-infections-rex-pn-precautions-standard-isolement", primaryKeyword: "prévention infections REx-PN", searchIntent: "informational" },
  { id: "fr-16", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Liquides et électrolytes au REx-PN : le sujet le plus redouté simplifié", metaTitle: "Liquides électrolytes REx-PN simplifié | NurseNest", metaDescription: "Hyperkaliémie, hyponatrémie, solutés IV — les déséquilibres liquidiens et électrolytiques au REx-PN expliqués simplement pour les IAA.", slug: "liquides-electrolytes-rex-pn-sujet-redoute-simplifie", primaryKeyword: "liquides électrolytes REx-PN", searchIntent: "informational" },
  { id: "fr-17", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Soins cardiaques au REx-PN : insuffisance cardiaque, SCA et surveillance", metaTitle: "Soins cardiaques REx-PN | NurseNest", metaDescription: "Questions cardiaques au REx-PN : insuffisance cardiaque, syndrome coronarien aigu, types de choc et surveillance cardiaque — révision complète pour les IAA.", slug: "soins-cardiaques-rex-pn-insuffisance-cardiaque-sca-surveillance", primaryKeyword: "soins cardiaques REx-PN", searchIntent: "informational" },
  { id: "fr-18", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Diabète au REx-PN : insuline, ACD et interventions infirmières", metaTitle: "Diabète REx-PN insuline ACD | NurseNest", metaDescription: "Maîtrisez les questions sur le diabète au REx-PN : types d'insuline, acidocétose diabétique vs SHH, surveillance glycémique et interventions infirmières.", slug: "diabete-rex-pn-insuline-acd-interventions-infirmieres", primaryKeyword: "diabète REx-PN insuline", searchIntent: "informational" },
  { id: "fr-19", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Santé mentale au REx-PN : communication thérapeutique et médicaments psychiatriques", metaTitle: "Santé mentale REx-PN | NurseNest", metaDescription: "Communication thérapeutique, médicaments psychiatriques, intervention en situation de crise et règles de contention — sujets de santé mentale au REx-PN.", slug: "sante-mentale-rex-pn-communication-therapeutique-medicaments", primaryKeyword: "santé mentale REx-PN", searchIntent: "informational" },
  { id: "fr-20", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Évaluation respiratoire au REx-PN : MPOC, asthme et oxygénothérapie", metaTitle: "Évaluation respiratoire REx-PN | NurseNest", metaDescription: "Questions respiratoires au REx-PN : évaluation, MPOC, asthme, pneumonie et oxygénothérapie. Approche de réponse systématique pour les IAA.", slug: "evaluation-respiratoire-rex-pn-mpoc-asthme-oxygenotherapie", primaryKeyword: "évaluation respiratoire REx-PN", searchIntent: "informational" },

  // ── Motivation, processus et carrière ──────────────────────────────────────
  { id: "fr-21", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Comment s'inscrire au REx-PN au Québec : processus étape par étape", metaTitle: "Inscription REx-PN Québec étape par étape | NurseNest", metaDescription: "Guide complet d'inscription au REx-PN au Québec. OIIAQ, Pearson VUE, documents requis, délais et coûts — tout ce qu'une IAA doit savoir.", slug: "inscription-rex-pn-quebec-processus-etape-par-etape", primaryKeyword: "inscription REx-PN Québec", searchIntent: "informational" },
  { id: "fr-22", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Résultats du REx-PN : comment les lire et quoi faire ensuite", metaTitle: "Résultats REx-PN comment lire | NurseNest", metaDescription: "Vous avez passé le REx-PN — et maintenant? Comment lire vos résultats, quand ils arrivent, et quoi faire en cas d'échec.", slug: "resultats-rex-pn-comment-lire-quoi-faire-ensuite", primaryKeyword: "résultats REx-PN comment lire", searchIntent: "informational" },
  { id: "fr-23", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Échec au REx-PN? Ne lâchez pas — voici votre plan de reprise", metaTitle: "Échec REx-PN plan de reprise | NurseNest", metaDescription: "Échouer au REx-PN n'est pas la fin du monde. Analysez votre performance, changez votre approche et réussissez la prochaine fois — guide complet de reprise.", slug: "echec-rex-pn-ne-lachez-pas-plan-de-reprise", primaryKeyword: "échec REx-PN reprise", searchIntent: "transactional" },
  { id: "fr-24", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Anxiété avant le REx-PN : comment gérer le stress le jour de l'examen", metaTitle: "Anxiété REx-PN gérer stress | NurseNest", metaDescription: "L'anxiété avant le REx-PN est normale. Techniques de gestion du stress avant et pendant l'examen pour les IAA canadiennes.", slug: "anxiete-rex-pn-comment-gerer-stress-jour-examen", primaryKeyword: "anxiété REx-PN stress examen", searchIntent: "informational" },
  { id: "fr-25", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Étudier pour le REx-PN tout en travaillant : horaire réaliste pour les IAA", metaTitle: "Étudier REx-PN en travaillant | NurseNest", metaDescription: "Comment préparer le REx-PN tout en travaillant à temps plein? Horaire d'étude réaliste, astuces de productivité et stratégie de questions pratiques.", slug: "etudier-rex-pn-en-travaillant-horaire-realiste-iaa", primaryKeyword: "étudier REx-PN en travaillant", searchIntent: "transactional" },

  // ── Sujets cliniques spécialisés ──────────────────────────────────────────
  { id: "fr-26", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Priorisation au REx-PN : comment choisir la bonne réponse systématiquement", metaTitle: "Priorisation REx-PN bonne réponse | NurseNest", metaDescription: "La priorisation est testée dans presque chaque examen REx-PN. Approche systématique utilisant les ABC et la hiérarchie de Maslow pour choisir la bonne réponse.", slug: "priorisation-rex-pn-choisir-bonne-reponse-systematiquement", primaryKeyword: "priorisation REx-PN", searchIntent: "informational" },
  { id: "fr-27", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Soins maternels et néonatals au REx-PN : révision pour les IAA", metaTitle: "Soins maternels néonatals REx-PN | NurseNest", metaDescription: "Soins maternels et néonatals au REx-PN : urgences obstétricales, complications du travail, soins post-partum et évaluation du nouveau-né.", slug: "soins-maternels-neonatals-rex-pn-revision-iaa", primaryKeyword: "soins maternels néonatals REx-PN", searchIntent: "informational" },
  { id: "fr-28", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Soins pédiatriques au REx-PN : questions types et guide d'étude", metaTitle: "Soins pédiatriques REx-PN | NurseNest", metaDescription: "Questions pédiatriques au REx-PN : étapes de développement, vaccinations, urgences pédiatriques et calculs de doses — guide d'étude pour les IAA.", slug: "soins-pediatriques-rex-pn-questions-types-guide-etude", primaryKeyword: "soins pédiatriques REx-PN", searchIntent: "informational" },
  { id: "fr-29", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Soins des plaies au REx-PN : évaluation, traitement et complications", metaTitle: "Soins des plaies REx-PN | NurseNest", metaDescription: "Soins des plaies au REx-PN : classification, traitement, prévention des escarres, et complications postopératoires — révision pour les IAA canadiennes.", slug: "soins-plaies-rex-pn-evaluation-traitement-complications", primaryKeyword: "soins des plaies REx-PN", searchIntent: "informational" },
  { id: "fr-30", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn", title: "Préparation REx-PN abordable : réussir sans se ruiner", metaTitle: "Préparation REx-PN abordable | NurseNest", metaDescription: "Les cours de préparation à 500 $+ ne sont pas la seule option. Comparaison des ressources de préparation REx-PN abordables et efficaces pour les IAA au Canada.", slug: "preparation-rex-pn-abordable-reussir-sans-ruiner", primaryKeyword: "préparation REx-PN abordable", searchIntent: "comparison" },
];

// ═════════════════════════════════════════════════════════════════════════════
// PART 2: 5 FULL FRENCH BLOG POSTS (1200+ words each)
// ═════════════════════════════════════════════════════════════════════════════

export const FRENCH_BLOG_POSTS: FrenchBlogPost[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Plan d'étude REx-PN en 6 semaines (~1,380 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...FRENCH_BLOG_TOPICS[0],
    wordCount: 1380,
    sections: [
      {
        heading: "intro",
        body: `Vous terminez votre programme d'infirmière auxiliaire autorisée (IAA) et le REx-PN approche. Vous avez un emploi à temps partiel, peut-être des enfants, et la dernière chose dont vous avez besoin, c'est d'un plan d'étude qui exige six heures par jour.

La bonne nouvelle : vous n'avez pas besoin de six heures. Vous avez besoin de la bonne stratégie, appliquée de façon constante, pendant six semaines.

Ce plan a été conçu spécifiquement pour les infirmières auxiliaires autorisées canadiennes — pas les infirmières autorisées. Le champ de pratique testé au REx-PN est différent du NCLEX-RN, et votre préparation doit refléter cette réalité.

L'approche repose sur un principe appuyé par la recherche : la pratique de récupération (retrieval practice) — répondre à des questions et réviser les justifications — est plus efficace que la relecture passive de notes.

[CTA:early] [Essayez des questions REx-PN gratuites](${lnk.questions}) — commencez votre préparation maintenant et voyez immédiatement où vous en êtes.`,
      },
      {
        heading: "Pourquoi les plans d'étude génériques ne fonctionnent pas pour le REx-PN",
        body: `La plupart des plans d'étude en ligne sont conçus pour le NCLEX-RN. Le problème : le REx-PN teste le champ de pratique des infirmières auxiliaires autorisées, pas celui des infirmières autorisées. Si votre matériel d'étude couvre des compétences IA (infirmière autorisée) — comme l'évaluation initiale complète ou certaines interventions avancées — vous étudiez du contenu qui ne sera pas testé.

Deuxième problème : beaucoup de plans recommandent de commencer par des semaines de « révision de contenu » — relire des manuels, regarder des vidéos, prendre des notes. Cette approche passive donne l'impression de productivité, mais ne développe pas la compétence que le REx-PN évalue : le raisonnement clinique appliqué.

Troisième problème : les plans qui ne tiennent pas compte du format TAO (test adaptatif par ordinateur). Le REx-PN ajuste la difficulté en temps réel selon vos réponses. Étudier avec des examens à format fixe ne vous prépare pas à cette expérience.

Meilleure approche : consacrez 70 % de votre temps d'étude aux [questions pratiques](${lnk.questions}) avec justifications détaillées, et 30 % à la révision de contenu ciblée par les [leçons structurées](${lnk.lessons}).`,
      },
      {
        heading: "Le plan semaine par semaine",
        body: `**Semaines 1-2 : Construction des fondations**

Commencez par les sujets à plus haut rendement dans le champ de pratique IAA :
- [Jugement clinique et priorisation](${lnk.lesson("clinical-judgment-prioritization-gold")})
- [Médicaments à haut risque](${lnk.lesson("high-alert-medications-gold")})
- [Contenu à haut rendement IAA canadiennes](${lnk.lesson("canadian-rpn-high-yield-gold")})

Horaire quotidien (60-90 minutes) :
- **Matin (15 min) :** 10 questions pratiques sur le téléphone. Lisez chaque justification.
- **Pause du midi (15 min) :** 10 questions sur un sujet différent.
- **Soir (30-60 min) :** 1 leçon structurée + 15-20 questions supplémentaires.
- **Total : 35-40 questions + 1 leçon = environ 60-90 minutes.**

**Semaines 3-4 : Montée en volume**

Augmentez à 50-60 questions par jour. Élargissez les sujets :
- [Sepsie et prévention des infections](${lnk.lesson("sepsis-early-recognition-gold")})
- [Liquides et électrolytes](${lnk.lesson("fluids-electrolytes-emergencies-gold")})
- Délégation et champ de pratique IAA
- Soins cardiaques fondamentaux

Continuez 1 leçon par jour. La révision des justifications est votre étude de contenu principale.

[CTA:mid] [Suivez automatiquement vos lacunes](${lnk.lessons}) — NurseNest identifie les sujets à revoir en fonction de votre performance.

**Semaines 5-6 : Simulation d'examen**

Phase critique :
- 60-80 questions quotidiennes, en vous concentrant sur vos points faibles
- Prenez 2-3 [examens adaptatifs complets](${lnk.cat}) les jours de congé
- N'ajoutez pas de nouveaux sujets — consolidez ce que vous maîtrisez moins bien
- L'[examen adaptatif](${lnk.cat}) vous dira si vous êtes prête — ne vous fiez pas à votre impression

Les résultats des examens adaptatifs sont le meilleur indicateur de votre préparation réelle. Si vous réussissez systématiquement les simulations, vous êtes prête.`,
      },
      {
        heading: "Erreurs courantes à éviter",
        body: `**Erreur 1 : Étudier seulement les jours de congé.**
Six heures intensives une fois par semaine sont moins efficaces que 60 minutes quotidiennes. La constance construit le réflexe de raisonnement clinique.

**Erreur 2 : Privilégier la lecture aux questions.**
Quand on est fatigué, lire des notes semble plus facile que de répondre à des questions. Mais la lecture est passive. Le REx-PN ne teste pas ce que vous avez lu — il teste ce que vous pouvez appliquer.

**Erreur 3 : Ne pas suivre ses lacunes.**
Sans données, vous passez du temps sur des sujets que vous maîtrisez déjà. NurseNest identifie automatiquement vos sujets faibles.

**Erreur 4 : Reporter les [examens adaptatifs](${lnk.cat}) à la dernière semaine.**
Passez votre premier examen adaptatif dès la semaine 3. Vous devez connaître votre niveau réel — pas celui que vous supposez.

**Erreur 5 : Étudier du matériel IA (infirmière autorisée) pour un examen IAA.**
Le champ de pratique est différent. Utilisez des [ressources spécifiques au REx-PN](${lnk.lessons}) conçues pour le champ de pratique des IAA.`,
      },
      {
        heading: "Les 5 sujets à étudier en priorité",
        body: `Quand le temps est limité, commencez par les sujets les plus rentables :

1. **[Jugement clinique et priorisation](${lnk.lesson("clinical-judgment-prioritization-gold")})** — présent dans presque chaque examen. Apprenez le cadre, puis pratiquez abondamment.
2. **[Médicaments à haut risque](${lnk.lesson("high-alert-medications-gold")})** — insuline, héparine, warfarine, digoxine. Règles d'administration, effets indésirables, et quand suspendre.
3. **[Reconnaissance de la sepsie](${lnk.lesson("sepsis-early-recognition-gold")})** — critères de dépistage, SRIS vs sepsie, et interventions infirmières.
4. **[Liquides et électrolytes](${lnk.lesson("fluids-electrolytes-emergencies-gold")})** — hyperkaliémie, hyponatrémie, choix de solutés IV.
5. **Délégation et champ de pratique** — quoi déléguer, à qui, et les limites légales.

Ces cinq sujets représentent le contenu le plus fréquemment testé au REx-PN. Maîtrisez-les d'abord, puis élargissez.`,
      },
      {
        heading: "Stratégie de pratique quotidienne",
        body: `- Fixez un minimum quotidien non négociable : 25 questions par jour, sans exception
- Utilisez votre téléphone — NurseNest fonctionne sur mobile, vous pouvez pratiquer n'importe où
- Après chaque session, choisissez un sujet à revoir et lisez la leçon correspondante
- Chaque fin de semaine, faites un ensemble chronométré de 50-75 questions
- Les deux dernières semaines, prenez 2-3 [examens adaptatifs complets](${lnk.cat}) les jours de congé`,
      },
      {
        heading: "Vous êtes capable de réussir",
        body: `De nombreuses IAA canadiennes ont réussi le REx-PN tout en travaillant et en gérant des responsabilités familiales. Vous n'êtes pas différente d'elles. Vous avez besoin de trois choses :

- **Structure** — un horaire quotidien que vous suivez
- **Constance** — même fatiguée, faites vos 25 questions minimum
- **Données** — sachez où sont vos lacunes et concentrez-vous là

Ne pas attendre d'être « prête ». Commencer est ce qui vous prépare.

[CTA:final] NurseNest est conçu pour les IAA canadiennes : des [leçons structurées](${lnk.lessons}) de 15 minutes adaptées au champ de pratique IAA, des [questions pratiques](${lnk.questions}) avec justifications détaillées, et des [examens adaptatifs](${lnk.cat}) qui indiquent quand vous êtes prête. [Débloquez l'accès complet](${lnk.pricing}).`,
      },
    ],
    faq: [
      { question: "Est-ce qu'on peut réussir le REx-PN en étudiant seulement 1 heure par jour?", answer: "Oui — si cette heure est consacrée à la pratique active de questions et à la révision des justifications, pas à la relecture passive. La constance est plus importante que la durée. De nombreuses IAA ont réussi avec 60-90 minutes d'étude ciblée par jour pendant 6 semaines." },
      { question: "Dois-je démissionner pour étudier?", answer: "Non. Beaucoup d'IAA réussissent le REx-PN tout en travaillant. Si possible, réduisez vos quarts de travail le dernier mois, mais ce n'est pas obligatoire." },
      { question: "Combien de questions pratiques dois-je faire avant l'examen?", answer: "La plupart des candidates qui réussissent font entre 1 500 et 2 500 questions pendant leur période de préparation. La qualité (révision des justifications) est plus importante que la quantité brute." },
    ],
    references: [
      { text: "Roediger, H. L., & Butler, A. C. (2011). The critical role of retrieval practice in long-term retention. *Trends in Cognitive Sciences*, 15(1), 20–27. https://doi.org/10.1016/j.tics.2010.09.003" },
      { text: "Ordre des infirmières et infirmiers auxiliaires du Québec. (2023). *Guide de préparation à l'examen professionnel*. OIIAQ. https://www.oiiaq.org/" },
      { text: "Regulatory Exam — Practical Nurse (REx-PN). (2023). *Examen réglementaire — Infirmières et infirmiers auxiliaires*. CCPNR/NCSBN. https://www.ncsbn.org/rex-pn.htm" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. Les 5 erreurs les plus fréquentes au REx-PN (~1,320 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...FRENCH_BLOG_TOPICS[3],
    wordCount: 1320,
    sections: [
      {
        heading: "intro",
        body: `Pourquoi des étudiantes IAA bien préparées échouent-elles au REx-PN? Ce n'est pas un manque de connaissances. Ce n'est pas un manque d'effort. Dans la grande majorité des cas, c'est l'APPROCHE D'ÉTUDE qui est en cause — pas les connaissances.

Le REx-PN n'est pas un examen de mémorisation. C'est un examen de raisonnement clinique. Il vous place dans des scénarios patients et vous demande : « Quelle est la priorité? Que faites-vous en premier? Quelle information est la plus préoccupante? »

Si vous étudiez comme pour un examen scolaire — relire des notes, mémoriser des définitions — vous préparez le mauvais type de compétence.

Voici les cinq erreurs les plus fréquentes, et comment les corriger.

[CTA:early] [Essayez des questions gratuites](${lnk.questions}) — voyez immédiatement si votre approche actuelle fonctionne pour le format REx-PN.`,
      },
      {
        heading: "Erreur no 1 : Étudier avec du matériel conçu pour les infirmières autorisées",
        body: `C'est l'erreur la plus spécifique aux candidates IAA. Beaucoup de livres de préparation, de cours en ligne, et même de groupes d'étude utilisent du matériel NCLEX-RN — conçu pour les infirmières autorisées, pas les infirmières auxiliaires autorisées.

Le problème : le champ de pratique est fondamentalement différent. Les IA effectuent des évaluations initiales complètes, interprètent des résultats complexes, et prennent des décisions cliniques avancées. Les IAA travaillent dans un champ défini — évaluation ciblée, administration de médicaments dans le cadre de leur champ, suivi de l'état du patient et signalement des changements.

Si vos questions pratiques vous demandent régulièrement de faire des évaluations IA ou de prendre des décisions hors du champ IAA, vous pratiquez la mauvaise compétence.

**Comment corriger :** Utilisez des [ressources spécifiques au REx-PN](${lnk.lessons}) qui respectent le champ de pratique des IAA. Chaque question et leçon sur NurseNest est alignée avec les compétences testées par le REx-PN.`,
      },
      {
        heading: "Erreur no 2 : Consacrer trop de temps à la lecture et pas assez aux questions",
        body: `« Je vais d'abord relire tout le contenu, puis je ferai des questions. »

C'est l'approche la plus répandue — et l'une des moins efficaces. La recherche en sciences cognitives est claire : la pratique de récupération (répondre à des questions et récupérer activement l'information de sa mémoire) produit un apprentissage significativement plus durable que la relecture.

Chaque question pratique est une occasion d'apprentissage, pas seulement un test. Quand vous répondez à une question et lisez la justification — que votre réponse soit bonne ou mauvaise — vous apprenez le contenu de façon plus profonde qu'en relisant un manuel.

**Comment corriger :** Commencez les [questions pratiques](${lnk.questions}) dès le JOUR 1. Même si vous ne connaissez pas toutes les réponses, les justifications vous enseignent le contenu. Visez 70 % du temps d'étude sur les questions, 30 % sur la révision de [leçons](${lnk.lessons}).`,
      },
      {
        heading: "Erreur no 3 : Ne pas pratiquer le format adaptatif",
        body: `Le REx-PN utilise le Test Adaptatif par Ordinateur (TAO). Chaque question ajuste la difficulté selon vos réponses précédentes. Le nombre de questions varie. Vous ne savez pas quand l'examen se termine.

Beaucoup d'étudiantes pratiquent avec des tests à format fixe — 50 questions, pas d'adaptation, résultat en pourcentage. Cette expérience est fondamentalement différente du vrai examen.

Le stress du TAO vient de l'inconnu : « Pourquoi l'examen continue? Est-ce que les questions deviennent plus difficiles ou plus faciles? » Si vous n'avez jamais expérimenté ce format avant le jour de l'examen, l'anxiété peut compromettre votre performance.

**Comment corriger :** Prenez des [examens adaptatifs de pratique](${lnk.cat}) qui simulent le vrai format TAO. Faites-en au moins 2-3 pendant votre préparation, et commencez dès la semaine 3 ou 4 de votre plan d'étude — pas la veille de l'examen.

[CTA:mid] [Passez un examen adaptatif maintenant](${lnk.cat}) — la simulation la plus proche du vrai REx-PN disponible en ligne.`,
      },
      {
        heading: "Erreur no 4 : Étudier tous les sujets avec la même intensité",
        body: `Le REx-PN ne teste pas tous les sujets de façon égale. Certains sujets à haut rendement reviennent dans presque chaque examen :

- [Jugement clinique et priorisation](${lnk.lesson("clinical-judgment-prioritization-gold")})
- [Médicaments à haut risque](${lnk.lesson("high-alert-medications-gold")})
- [Reconnaissance de la sepsie](${lnk.lesson("sepsis-early-recognition-gold")})
- [Déséquilibres liquidiens et électrolytiques](${lnk.lesson("fluids-electrolytes-emergencies-gold")})
- Délégation et champ de pratique IAA

Passer le même temps sur l'anatomie détaillée du système musculosquelettique que sur les médicaments à haut risque est une mauvaise allocation de votre temps limité.

**Comment corriger :** Maîtrisez les 5 sujets les plus rentables d'abord, puis élargissez. Une maîtrise à 90 % de 5 sujets critiques vaut mieux qu'une maîtrise à 50 % de 20 sujets.`,
      },
      {
        heading: "Erreur no 5 : Ne pas analyser ses erreurs",
        body: `Beaucoup d'étudiantes font des questions, regardent leur score (« 68 %… pas terrible »), puis passent à autre chose. Le score brut n'est pas l'information la plus importante. Ce qui compte, c'est POURQUOI vous avez fait une erreur.

Il existe trois types d'erreurs aux questions REx-PN :
- **Erreur de connaissance :** Vous ne connaissiez pas le contenu. Solution : revoir la [leçon](${lnk.lessons}) correspondante.
- **Erreur de raisonnement :** Vous connaissiez le contenu mais avez mal priorisé ou mal interprété le scénario. Solution : pratiquer davantage le [jugement clinique](${lnk.lesson("clinical-judgment-prioritization-gold")}).
- **Erreur de lecture :** Vous avez mal lu la question ou manqué un détail important. Solution : ralentir et relire le scénario avant de répondre.

**Comment corriger :** Après chaque session de pratique, classez vos erreurs. NurseNest suit automatiquement vos lacunes par sujet, mais analysez aussi le TYPE d'erreur.`,
      },
      {
        heading: "Changez votre approche, changez votre résultat",
        body: `Ces cinq erreurs sont toutes corrigeables. Vous n'avez pas besoin de plus de temps. Vous avez besoin de la bonne stratégie :

- Des [leçons structurées](${lnk.lessons}) adaptées au champ de pratique IAA
- Des [questions pratiques](${lnk.questions}) quotidiennes avec justifications détaillées
- Des [examens adaptatifs](${lnk.cat}) qui simulent le vrai format TAO
- Une approche basée sur les données qui cible vos lacunes réelles

Beaucoup d'IAA canadiennes ont changé leur approche et réussi au deuxième essai. L'important n'est pas combien de temps vous étudiez — c'est COMMENT vous étudiez.

[CTA:final] NurseNest est conçu pour les IAA canadiennes : [leçons](${lnk.lessons}) alignées au champ de pratique IAA, [questions pratiques](${lnk.questions}) avec justifications complètes, et [examens adaptatifs](${lnk.cat}) qui simulent le format TAO. [Débloquez l'accès complet](${lnk.pricing}).`,
      },
    ],
    faq: [
      { question: "Est-ce que le REx-PN est plus difficile que le CPNRE?", answer: "Le format est différent — le TAO rend l'expérience plus imprévisible, et l'accent sur le jugement clinique est plus marqué. Mais avec une préparation appropriée, le taux de réussite est comparable." },
      { question: "Combien de questions pratiques dois-je faire?", answer: "Visez 1 500 à 2 500 questions pendant votre période de préparation. Révisez chaque justification — c'est là que se fait l'apprentissage." },
      { question: "Comment savoir si je suis prête?", answer: "Passez un examen adaptatif de pratique. Si vous réussissez systématiquement les simulations TAO, vous êtes prête. Ne vous fiez pas au sentiment — fiez-vous aux données." },
    ],
    references: [
      { text: "Karpicke, J. D., & Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying with concept mapping. *Science*, 331(6018), 772–775. https://doi.org/10.1126/science.1199327" },
      { text: "Regulatory Exam — Practical Nurse (REx-PN). (2023). *Plan d'examen*. CCPNR/NCSBN. https://www.ncsbn.org/rex-pn.htm" },
      { text: "Dunlosky, J., et al. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest*, 14(1), 4–58." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Jugement clinique au REx-PN (~1,340 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...FRENCH_BLOG_TOPICS[11],
    wordCount: 1340,
    sections: [
      {
        heading: "intro",
        body: `Si vous ne devez maîtriser qu'une seule compétence pour le REx-PN, c'est le jugement clinique.

Ce n'est pas une question de connaissances. Ce n'est pas de la mémorisation. Le jugement clinique, c'est la capacité de lire un scénario patient, d'identifier ce qui est le plus important, et de choisir l'action infirmière appropriée — même quand plusieurs options semblent correctes.

Pour les étudiantes IAA habituées aux examens de rappel (« Quelle est la définition de…? »), c'est le plus grand ajustement. Le REx-PN ne demande pas : « Qu'est-ce que la sepsie? » Il demande : « Le patient a une PA de 85/50, un pouls de 110, une température de 38,8 °C et un changement de l'état mental. Que faites-vous en premier? »

[CTA:early] [Essayez des questions de jugement clinique gratuites](${lnk.questions}) — voyez comment le REx-PN teste le raisonnement, pas la mémorisation.`,
      },
      {
        heading: "Qu'est-ce que le jugement clinique au REx-PN?",
        body: `Le modèle de mesure du jugement clinique du NCSBN (NCJMM) comprend 6 étapes :

1. **Reconnaître les indices** — Quelles données sont anormales ou préoccupantes?
2. **Analyser les indices** — Que signifient ces données ensemble?
3. **Prioriser les hypothèses** — Quel est le problème le PLUS probable?
4. **Générer des solutions** — Quelles interventions infirmières sont possibles?
5. **Agir** — Quelle action est la plus appropriée et la plus URGENTE?
6. **Évaluer les résultats** — L'intervention a-t-elle fonctionné?

Presque toutes les questions du REx-PN — qu'elles soient traditionnelles ou de nouvelle génération — testent une ou plusieurs de ces étapes.

Apprenez ce cadre en détail dans la [leçon sur le jugement clinique et la priorisation](${lnk.lesson("clinical-judgment-prioritization-gold")}).`,
      },
      {
        heading: "Pourquoi le jugement clinique est difficile pour les étudiantes IAA",
        body: `Dans les programmes d'IAA au Québec et ailleurs au Canada, beaucoup d'apprentissage se fait ainsi :
- Lire le manuel
- Mémoriser les étapes d'une procédure
- Rappeler les faits à l'examen

Le REx-PN est différent. Savoir ne suffit pas — il faut APPLIQUER.

**Exemple :**

Question de type scolaire : « Quelle est la plage normale du potassium sérique? »
Réponse : 3,5-5,0 mEq/L ✓

Question REx-PN : « Le potassium du patient est à 6,2 mEq/L. Le monitorage cardiaque est en place. Du kayexalate et une perfusion d'insuline sont prescrits. Deux heures plus tard, l'ECG montre des ondes T pointues. Quelle est l'action prioritaire de l'infirmière auxiliaire? »

Ici, connaître la valeur normale ne suffit pas. Vous devez interpréter l'ECG, comprendre l'urgence, identifier la bonne intervention, et savoir si elle est dans votre champ de pratique IAA. C'est ça, le jugement clinique.

La [leçon sur le contenu à haut rendement IAA](${lnk.lesson("canadian-rpn-high-yield-gold")}) vous aide à contextualiser ces compétences dans le champ de pratique IAA spécifiquement.`,
      },
      {
        heading: "Comment développer le jugement clinique",
        body: `**Stratégie 1 : L'approche « Qu'est-ce que je ferais? »**
Pour chaque question, ne cherchez pas la réponse du manuel. Demandez-vous : « Si ce patient était devant moi, que ferais-je en premier? » Cela active le raisonnement clinique plutôt que le rappel.

**Stratégie 2 : ABC et hiérarchie de Maslow**
Cadre de priorisation :
- Voies respiratoires d'abord → Respiration → Circulation → Sécurité → Confort
- Les besoins physiologiques avant les besoins psychologiques

**Stratégie 3 : Pratiquer la reconnaissance des indices**
La compétence la plus critique : distinguer l'information pertinente du « bruit ». Pour chaque scénario, demandez-vous : « Quelles données sont PRÉOCCUPANTES? Quelles données sont ATTENDUES? »

**Stratégie 4 : Utiliser des [leçons structurées](${lnk.lessons})**
La [leçon sur le jugement clinique](${lnk.lesson("clinical-judgment-prioritization-gold")}) enseigne le cadre étape par étape, puis propose des scénarios pratiques pour l'appliquer.

[CTA:mid] [Apprenez le cadre de jugement clinique](${lnk.lesson("clinical-judgment-prioritization-gold")}) — la fondation de tout l'examen REx-PN.`,
      },
      {
        heading: "Le jugement clinique dans les sujets les plus testés",
        body: `Le jugement clinique est présent dans tous les sujets, mais il est particulièrement dominant dans :

- **[Reconnaissance de la sepsie](${lnk.lesson("sepsis-early-recognition-gold")})** — reconnaître les signes précoces et agir immédiatement
- **[Urgences cardiaques](${lnk.lesson("acs-stemi-nstemi-ua-gold")})** — scénarios de douleur thoracique nécessitant évaluation et intervention rapides
- **[Médicaments à haut risque](${lnk.lesson("high-alert-medications-gold")})** — « Quand suspendre le médicament? Que faire en cas d'effet indésirable? »
- **Délégation et priorisation** — « Vous avez 4 patients. Lequel voyez-vous en premier? »
- **[Déséquilibres liquidiens et électrolytiques](${lnk.lesson("fluids-electrolytes-emergencies-gold")})** — valeurs critiques nécessitant une intervention infirmière urgente
- **Complications postopératoires** — « Le patient est 2 heures post-op et la distension abdominale augmente. Que faites-vous? »

Concentrez votre pratique de jugement clinique sur ces sujets — c'est là que le REx-PN investit le plus de questions.`,
      },
      {
        heading: "Stratégie de pratique",
        body: `- Pour chaque [question pratique](${lnk.questions}), AVANT de regarder les choix de réponse, demandez-vous : « Qu'est-ce qui est le plus important dans ce scénario? »
- Pratiquez 30-50 questions de jugement clinique par jour
- Révisez chaque justification — même pour les bonnes réponses. Comprenez POURQUOI c'est la meilleure réponse.
- Passez des [examens adaptatifs](${lnk.cat}) qui ajustent la difficulté — la meilleure formation pour le raisonnement clinique sous pression
- Suivez séparément votre exactitude en priorisation et en délégation — ce sont les tests directs du jugement clinique`,
      },
      {
        heading: "La fondation existe déjà en vous",
        body: `En tant qu'étudiante ou diplômée IAA, vous avez déjà une base clinique solide. Anatomie, physiologie, pharmacologie, et soins infirmiers fondamentaux — vous connaissez tout ça. Ce qui manque, c'est le cadre de raisonnement spécifique au REx-PN.

Vous ne partez pas de zéro. Il s'agit simplement d'un changement d'approche — passer de « quelle est la réponse? » à « en tant qu'infirmière auxiliaire, qu'est-ce que je ferais? »

Le jugement clinique est une COMPÉTENCE — et chaque compétence s'améliore avec la pratique. Chaque question à laquelle vous répondez renforce votre muscle de raisonnement clinique.

[CTA:final] NurseNest développe les compétences en jugement clinique des IAA canadiennes : des [leçons structurées](${lnk.lessons}) qui enseignent le cadre, des [questions pratiques](${lnk.questions}) qui testent le raisonnement (pas seulement le rappel), et des [examens adaptatifs](${lnk.cat}) qui reproduisent le format TAO. [Débloquez l'accès complet](${lnk.pricing}).`,
      },
    ],
    faq: [
      { question: "Est-ce que le jugement clinique peut s'apprendre ou est-ce inné?", answer: "Il s'apprend. Le jugement clinique est une compétence qui se renforce avec la pratique. Avec des questions pratiques quotidiennes et la révision des justifications, une amélioration significative est visible en 2 à 4 semaines." },
      { question: "Combien de questions du REx-PN testent le jugement clinique?", answer: "Presque toutes. Même les questions de pharmacologie ou de valeurs de laboratoire intègrent un composant de raisonnement clinique — appliquer les connaissances à un scénario patient est toujours requis." },
      { question: "Quelle est la différence entre le jugement clinique IA et IAA?", answer: "Le cadre est le même (NCJMM), mais les décisions se prennent dans le champ de pratique IAA — évaluation ciblée, soins infirmiers fondamentaux, signalement des changements. Le REx-PN ne vous demandera jamais de prendre une décision IA." },
    ],
    references: [
      { text: "Dickison, P., Haerling, K. A., & Lasater, K. (2019). Reimagining clinical nursing education with the NCSBN Clinical Judgment Model. *Journal of Nursing Education*, 58(10), 556–561." },
      { text: "Tanner, C. A. (2006). Thinking like a nurse: A research-based model of clinical judgment in nursing. *Journal of Nursing Education*, 45(6), 204–211." },
      { text: "Ordre des infirmières et infirmiers auxiliaires du Québec. (2023). *Champ d'exercice des infirmières et infirmiers auxiliaires*. OIIAQ. https://www.oiiaq.org/" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Échec au REx-PN? Ne lâchez pas (~1,280 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...FRENCH_BLOG_TOPICS[22],
    wordCount: 1280,
    sections: [
      {
        heading: "intro",
        body: `Vous avez échoué au REx-PN. Le cœur vous a décroché. La honte et la déception sont écrasantes. Vous avez l'impression que tout le temps, l'argent et l'énergie investis sont perdus.

Mais écoutez ceci : ce n'est pas la fin. De nombreuses IAA canadiennes ont échoué la première fois et réussi la deuxième. La différence entre elles et celles qui abandonnent : elles ont changé leur APPROCHE, pas seulement augmenté leurs heures d'étude.

Après un échec, deux choses à faire : (1) comprendre POURQUOI vous avez échoué, et (2) modifier votre plan d'étude en conséquence.

[CTA:early] [Essayez des questions pratiques gratuites](${lnk.questions}) — évaluez votre niveau actuel et identifiez vos lacunes.`,
      },
      {
        heading: "Pourquoi les IAA échouent au REx-PN",
        body: `Échouer ne signifie pas que vous manquez de connaissances. Les raisons les plus courantes :

**1. L'approche d'étude était inadaptée.** Trop de lecture et de cours, pas assez de questions pratiques. Le REx-PN est un examen de raisonnement clinique — pas de mémorisation.

**2. Le jugement clinique n'était pas maîtrisé.** Le [jugement clinique](${lnk.lesson("clinical-judgment-prioritization-gold")}) est la colonne vertébrale du REx-PN. Une étude basée sur le rappel ne suffit pas.

**3. Le format adaptatif n'a pas été pratiqué.** Le TAO ajuste la difficulté en temps réel. Les tests à format fixe ne préparent pas à cette pression.

**4. Les lacunes n'ont pas été identifiées.** Étudier tous les sujets également gaspille du temps sur des matières déjà maîtrisées.

**5. L'examen a été passé trop tôt.** Se fier au « sentiment » d'être prête plutôt qu'aux données. Les [examens adaptatifs de pratique](${lnk.cat}) auraient indiqué le vrai niveau de préparation.`,
      },
      {
        heading: "Étape 1 : Analysez votre performance",
        body: `Après l'échec, vous recevez un rapport de performance du candidat (RPC). C'est votre outil le plus important.

Le RPC indique votre performance dans chaque domaine de contenu :
- **Au-dessus du standard** — Vous êtes compétente ici
- **Près du standard** — Proche mais insuffisant
- **En dessous du standard** — Vos LACUNES sont ici

Concentrez toute votre reprise d'étude sur les domaines « En dessous » et « Près du standard ». Un maintien suffit pour les domaines « Au-dessus ».

Si le RPC n'est pas encore disponible, utilisez les [examens adaptatifs NurseNest](${lnk.cat}) pour identifier vos lacunes. Le TAO fournit une analyse de performance par sujet.`,
      },
      {
        heading: "Étape 2 : Changez votre plan d'étude",
        body: `Ne répétez pas le même plan qui a mené à l'échec. Changez l'approche :

**Si vous avez fait beaucoup de lecture et de cours :** → Adoptez la règle 70/30 : 70 % de votre temps sur les [questions pratiques](${lnk.questions}), 30 % sur la révision de contenu.

**Si vous n'avez pas pratiqué le format adaptatif :** → Passez un [examen adaptatif](${lnk.cat}) dès la PREMIÈRE SEMAINE de reprise. C'est votre point de départ.

**Si vous avez passé l'examen trop tôt :** → Ne planifiez pas de nouvelle date tant que vous ne réussissez pas systématiquement les simulations TAO.

[CTA:mid] [Passez un examen adaptatif maintenant](${lnk.cat}) — connaissez votre niveau réel avant de commencer la reprise.

**Plan de reprise (6-8 semaines) :**

Semaines 1-2 : Focus sur le [jugement clinique](${lnk.lesson("clinical-judgment-prioritization-gold")}) et les [médicaments à haut risque](${lnk.lesson("high-alert-medications-gold")}). 40-50 questions par jour.

Semaines 3-4 : Élargissez aux domaines « En dessous du standard » de votre RPC. [Sepsie](${lnk.lesson("sepsis-early-recognition-gold")}), [liquides et électrolytes](${lnk.lesson("fluids-electrolytes-emergencies-gold")}), délégation. 50-70 questions par jour.

Semaines 5-6 : Sujets mixtes. 70-80 questions par jour. 1 examen adaptatif par semaine.

Semaines 7-8 : Uniquement les lacunes. 75-100 questions par jour. 2-3 examens adaptatifs. Planifiez l'examen SEULEMENT quand vous réussissez systématiquement.`,
      },
      {
        heading: "Étape 3 : Travaillez sur votre état d'esprit",
        body: `Échouer au REx-PN ne reflète pas votre capacité en tant qu'infirmière auxiliaire. C'est le reflet de votre stratégie de préparation à l'examen — pas de vos compétences cliniques.

Rappelez-vous :
- Le taux de réussite à la reprise est élevé — surtout quand l'approche change
- Vous n'êtes pas seule — des centaines d'IAA canadiennes ont échoué la première fois et réussi la deuxième
- Chaque question à laquelle vous répondez et chaque justification que vous révisez renforce votre raisonnement clinique
- Ce n'est pas une course — la préparation est plus importante que la rapidité

Ne laissez pas un résultat d'examen définir toute votre carrière.`,
      },
      {
        heading: "Erreurs à éviter pendant la reprise",
        body: `- **Ne suivez PAS le même plan** qui a mené à l'échec
- **N'évitez pas les questions pratiques** — c'est l'outil d'étude le plus efficace
- **Ne sautez pas les [examens adaptatifs](${lnk.cat})** — savoir si vous êtes prête est essentiel
- **Ne vous isolez pas** — rejoignez un groupe d'étude ou une communauté en ligne pour la responsabilisation
- **Ne planifiez pas l'examen trop rapidement** — attendez que les DONNÉES disent que vous êtes prête, pas le sentiment`,
      },
      {
        heading: "L'échec n'est pas la fin — c'est un virage",
        body: `Beaucoup d'IAA qui exercent aujourd'hui au Canada ont échoué à leur premier REx-PN. Elles ont changé d'approche, ciblé leurs lacunes, pratiqué quotidiennement, et réussi.

Vous pouvez faire pareil. La seule question est : êtes-vous prête à changer votre approche?

Si oui — commencez. Pas demain. Pas la semaine prochaine. Aujourd'hui.

[CTA:final] NurseNest vous accompagne dans votre reprise : des [leçons structurées](${lnk.lessons}) sur les sujets à haut rendement, des [questions pratiques](${lnk.questions}) avec justifications détaillées pour apprendre de chaque erreur, et des [examens adaptatifs](${lnk.cat}) qui indiquent quand vous êtes prête. [Débloquez l'accès complet](${lnk.pricing}).`,
      },
    ],
    faq: [
      { question: "Après combien de temps puis-je repasser le REx-PN?", answer: "Cela dépend de votre organisme de réglementation provincial, mais la plupart exigent un délai minimum de 45 à 90 jours. Utilisez ce temps pour une reprise structurée avec une nouvelle approche." },
      { question: "Dois-je acheter de nouveaux manuels?", answer: "Non. Vous n'avez pas besoin de nouveaux manuels — vous avez besoin d'une nouvelle STRATÉGIE. Investissez dans des questions pratiques de qualité et des examens adaptatifs, pas dans des livres supplémentaires." },
      { question: "Est-ce normal d'avoir peur avant la reprise?", answer: "Absolument. Mais la peur diminue quand vous voyez une amélioration mesurable dans vos scores de pratique. Suivez votre progrès avec des DONNÉES — la confiance viendra des résultats, pas du sentiment." },
    ],
    references: [
      { text: "Regulatory Exam — Practical Nurse (REx-PN). (2023). *Examen réglementaire — Infirmières et infirmiers auxiliaires*. CCPNR/NCSBN. https://www.ncsbn.org/rex-pn.htm" },
      { text: "Roediger, H. L., & Butler, A. C. (2011). The critical role of retrieval practice in long-term retention. *Trends in Cognitive Sciences*, 15(1), 20–27. https://doi.org/10.1016/j.tics.2010.09.003" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Pharmacologie au REx-PN : médicaments à haut risque (~1,300 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...FRENCH_BLOG_TOPICS[10],
    wordCount: 1300,
    sections: [
      {
        heading: "intro",
        body: `La pharmacologie est l'un des sujets les plus redoutés — et les plus testés — au REx-PN. Et pour cause : les erreurs médicamenteuses sont la première cause d'événements indésirables évitables dans les soins de santé.

Le REx-PN ne vous demande pas de mémoriser la classification de centaines de médicaments. Il se concentre sur les médicaments à HAUT RISQUE — ceux qui peuvent causer des dommages graves si administrés incorrectement : insuline, héparine, warfarine, digoxine, opioïdes, potassium IV.

Pour chaque médicament, vous devez savoir : les règles d'administration, les effets indésirables critiques, les paramètres de suspension, l'enseignement au patient, et les interactions importantes.

[CTA:early] [Essayez des questions de pharmacologie gratuites](${lnk.questions}) — testez vos connaissances sur les médicaments à haut risque et voyez où vous en êtes.`,
      },
      {
        heading: "Pourquoi la pharmacologie REx-PN est différente de vos cours",
        body: `Dans votre programme IAA, vous avez probablement étudié la pharmacologie de façon systématique : classification, mécanisme d'action, indications, effets secondaires. C'est une bonne base. Mais le REx-PN teste la pharmacologie DIFFÉREMMENT.

Le REx-PN vous place dans un scénario clinique :
- « La glycémie du patient est à 3,2 mmol/L. Il a reçu de l'insuline lispro il y a 30 minutes. Quelle est l'action prioritaire? »
- « Le patient prend de la warfarine. Son INR est à 4,8. Que faites-vous? »
- « Le patient est sous perfusion d'héparine. Vous observez des saignements au site IV. Quelle est l'intervention? »

Ce ne sont pas des questions de rappel. Ce sont des questions de JUGEMENT CLINIQUE appliqué à la pharmacologie. Vous devez combiner la connaissance du médicament avec le raisonnement clinique.

La [leçon sur les médicaments à haut risque](${lnk.lesson("high-alert-medications-gold")}) enseigne cette approche intégrée.`,
      },
      {
        heading: "Les 6 médicaments à haut risque les plus testés",
        body: `**1. Insuline**
- Types : action rapide (lispro, aspart), action courte (régulière), action intermédiaire (NPH), action longue (glargine)
- Vérifications : glycémie AVANT administration, aspiration en cas de NPH, rotation des sites d'injection
- Urgences : hypoglycémie (< 4 mmol/L) → donner 15 g de glucides rapides, revérifier en 15 minutes

**2. Héparine**
- Surveillance : TCA (temps de céphaline activée) pour l'héparine non fractionnée
- Antidote : sulfate de protamine
- Signes de complication : saignements, ecchymoses, pétéchies, hématome au site d'injection

**3. Warfarine**
- Surveillance : INR (cible thérapeutique habituelle : 2,0-3,0)
- Antidote : vitamine K
- Enseignement au patient : éviter les aliments riches en vitamine K en grandes quantités, signaler tout saignement

**4. Digoxine**
- Vérification : fréquence cardiaque apicale pendant 1 minute complète AVANT administration
- Suspendre si : FC < 60 bpm (adulte), signes de toxicité (nausées, vision jaune/verte, bradycardie)
- Surveillance : taux sérique de digoxine et potassium (l'hypokaliémie augmente le risque de toxicité)

**5. Opioïdes (morphine, hydromorphone)**
- Surveillance : fréquence respiratoire AVANT administration
- Suspendre si : FR < 12/minute
- Antidote : naloxone
- Enseignement : prévention de la constipation

**6. Potassium IV**
- JAMAIS en bolus IV direct
- Surveillance : monitorage cardiaque pendant la perfusion
- Débit maximal : généralement 10 mEq/h en périphérique
- Signes de complications : brûlure au site IV, arythmies`,
      },
      {
        heading: "Stratégie pour les questions de pharmacologie",
        body: `**Étape 1 : Identifiez le médicament et son contexte.**
Quel médicament? Pourquoi le patient le prend-il? Quelles sont les données cliniques fournies?

**Étape 2 : Cherchez les drapeaux rouges.**
Y a-t-il un résultat de laboratoire anormal? Un signe vital préoccupant? Un symptôme d'effet indésirable?

**Étape 3 : Appliquez les règles de sécurité.**
Faut-il suspendre le médicament? Aviser le médecin? Administrer l'antidote? Fournir une intervention de soutien?

**Étape 4 : Respectez le champ de pratique IAA.**
Vous pouvez administrer des médicaments, surveiller les effets, signaler les changements. Vous ne faites PAS d'évaluation médicale initiale ni de modification de prescription.

[CTA:mid] [Pratiquez des questions de pharmacologie](${lnk.questions}) avec justifications détaillées — chaque option expliquée, bonne ou mauvaise.`,
      },
      {
        heading: "Les erreurs de pharmacologie les plus courantes au REx-PN",
        body: `**Erreur 1 : Mémoriser les noms de médicaments sans les règles de sécurité.**
Le REx-PN ne demande pas « Quelle classe de médicament est le métoprolol? » Il demande « Le patient sous métoprolol a une FC de 52 bpm. Que faites-vous? » Concentrez-vous sur les RÈGLES D'ACTION, pas les classifications.

**Erreur 2 : Ignorer les interactions médicament-laboratoire.**
Warfarine + INR. Héparine + TCA. Digoxine + potassium. Insuline + glycémie. Ces paires sont testées fréquemment. Connaissez les valeurs cibles et les actions en cas de résultat anormal.

**Erreur 3 : Ne pas connaître les antidotes.**
Héparine → protamine. Warfarine → vitamine K. Opioïdes → naloxone. Benzodiazépines → flumazénil. Ces antidotes apparaissent régulièrement au REx-PN.

**Erreur 4 : Confondre les types d'insuline.**
La confusion entre action rapide et action longue mène à des erreurs critiques. L'insuline lispro se donne AVEC les repas. L'insuline glargine se donne une fois par jour, jamais mélangée.`,
      },
      {
        heading: "Plan de révision pharmacologie",
        body: `- Étudiez la [leçon sur les médicaments à haut risque](${lnk.lesson("high-alert-medications-gold")}) comme point de départ
- Faites 15-20 questions de pharmacologie par jour, mélangées avec d'autres sujets
- Pour chaque question manquée, notez : quel médicament? Quelle erreur? (connaissance, raisonnement, ou lecture)
- Créez des cartes-éclair pour les paires médicament-laboratoire et les antidotes
- Pratiquez des scénarios « Suspendre ou administrer? » — ce format revient très souvent
- Dans les deux dernières semaines, intégrez la pharmacologie dans vos [examens adaptatifs](${lnk.cat})`,
      },
      {
        heading: "La pharmacologie se maîtrise — un médicament à la fois",
        body: `Ne tentez pas de tout mémoriser d'un coup. Commencez par les 6 médicaments à haut risque listés ci-dessus. Quand vous les maîtrisez (administration, effets indésirables, paramètres de suspension, antidotes), élargissez à d'autres classes : antihypertenseurs, antibiotiques, anticoagulants.

L'approche la plus efficace : apprendre par les questions. Chaque question de pharmacologie que vous faites, correcte ou non, renforce votre capacité à appliquer les connaissances dans un contexte clinique.

Le REx-PN ne demande pas un pharmacien. Il demande une infirmière auxiliaire qui administre les médicaments de façon SÉCURITAIRE et qui sait QUAND agir face à un problème.

[CTA:final] NurseNest vous prépare à la pharmacologie du REx-PN : des [leçons structurées](${lnk.lessons}) sur les médicaments à haut risque dans le champ de pratique IAA, des [questions pratiques](${lnk.questions}) avec justifications pharmacologiques détaillées, et des [examens adaptatifs](${lnk.cat}) qui intègrent la pharmacologie dans des scénarios complets. [Débloquez l'accès complet](${lnk.pricing}).`,
      },
    ],
    faq: [
      { question: "Combien de questions de pharmacologie y a-t-il au REx-PN?", answer: "La pharmacologie n'est pas testée comme un domaine séparé — elle est intégrée dans les scénarios cliniques de tous les domaines. Attendez-vous à ce que 15-25 % des questions impliquent des connaissances pharmacologiques." },
      { question: "Dois-je connaître tous les médicaments?", answer: "Non. Concentrez-vous sur les médicaments que les IAA administrent fréquemment : insuline, anticoagulants, analgésiques, médicaments cardiovasculaires courants, antibiotiques communs. Le REx-PN teste la sécurité médicamenteuse, pas l'encyclopédie pharmacologique." },
      { question: "Comment retenir les effets indésirables de chaque médicament?", answer: "Ne mémorisez pas des listes. Apprenez par les SCÉNARIOS cliniques. Quand vous répondez à une question et lisez la justification, le lien entre le médicament, l'effet indésirable, et l'intervention se fixe mieux en mémoire que la lecture d'un tableau." },
    ],
    references: [
      { text: "Institute for Safe Medication Practices Canada (ISMP Canada). (2023). *Médicaments à haut risque*. ISMP Canada. https://www.ismp-canada.org/" },
      { text: "Regulatory Exam — Practical Nurse (REx-PN). (2023). *Plan d'examen*. CCPNR/NCSBN. https://www.ncsbn.org/rex-pn.htm" },
      { text: "Ordre des infirmières et infirmiers auxiliaires du Québec. (2023). *Guide de pratique : administration sécuritaire des médicaments*. OIIAQ. https://www.oiiaq.org/" },
    ],
  },
];

// ── Accessors ────────────────────────────────────────────────────────────────

export function getFrenchBlogPost(id: string): FrenchBlogPost | undefined {
  return FRENCH_BLOG_POSTS.find((p) => p.id === id);
}

export function getAllFrenchTopics(): FrenchBlogTopic[] {
  return FRENCH_BLOG_TOPICS;
}

export function getAllFrenchSeoMeta() {
  return FRENCH_BLOG_TOPICS.map((t) => ({
    id: t.id,
    locale: t.locale,
    region: t.region,
    profession: t.profession,
    exam: t.exam,
    title: t.metaTitle,
    description: t.metaDescription,
    slug: t.slug,
  }));
}
