/**
 * CHUNK 3: 30 new French Canadian blog topics (REx-PN exam difficulty,
 * study plans, common mistakes) + 5 full blog posts (1,200–1,500 words)
 *
 * IDs: fr-81 through fr-110
 * DISTINCT from french-blog-posts.ts (fr-1–fr-30) and
 * french-blog-posts-chunk2.ts (fr-31–fr-80)
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";

export type FR3Section = { heading: string; body: string };
export type FR3Faq = { question: string; answer: string };
export type FR3Ref = { text: string };
export type FR3Topic = {
  id: string; region: GlobalRegionSlug; locale: GlobalLocaleCode; profession: string; exam: string;
  title: string; metaTitle: string; metaDescription: string; slug: string; primaryKeyword: string;
  searchIntent: "transactional" | "informational" | "comparison";
};
export type FR3Post = FR3Topic & { wordCount: number; sections: FR3Section[]; faq: FR3Faq[]; references: FR3Ref[] };

function L() {
  const base = "/fr/canada/rpn/rex-pn";
  return {
    lessons: `${base}/lessons`, questions: `${base}/questions`, cat: `${base}/cat`,
    pricing: `${base}/pricing`,
    lesson: (s: string) => `${base}/lessons/${s}`,
  };
}
const lnk = L();

// ═════════════════════════════════════════════════════════════════════════════
// 30 TOPICS  (fr-81 → fr-110)
// ═════════════════════════════════════════════════════════════════════════════

export const FR3_TOPICS: FR3Topic[] = [

  // ── Difficulté du REx-PN (10) ─────────────────────────────────────────────
  { id: "fr-81", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Pourquoi le REx-PN est-il si difficile? Comprendre ce qui le rend différent",
    metaTitle: "Pourquoi le REx-PN est si difficile | NurseNest",
    metaDescription: "Le REx-PN est plus difficile que les examens scolaires. Comprendre pourquoi — format TAO, jugement clinique, questions ambiguës — est la première étape pour réussir.",
    slug: "pourquoi-rex-pn-si-difficile-comprendre-ce-qui-le-rend-different",
    primaryKeyword: "pourquoi REx-PN difficile", searchIntent: "informational" },

  { id: "fr-82", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Quel est le taux de réussite au REx-PN? Statistiques et ce qu'elles signifient",
    metaTitle: "Taux de réussite REx-PN statistiques | NurseNest",
    metaDescription: "Le taux de réussite au REx-PN pour les candidates canadiennes, les IFE et les tentatives multiples. Ce que les chiffres révèlent sur la préparation efficace.",
    slug: "taux-reussite-rex-pn-statistiques-signification",
    primaryKeyword: "taux de réussite REx-PN", searchIntent: "informational" },

  { id: "fr-83", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Les questions les plus difficiles au REx-PN : types et stratégies de réponse",
    metaTitle: "Questions les plus difficiles REx-PN | NurseNest",
    metaDescription: "Quels types de questions rendent le REx-PN si exigeant? Analyse des questions de jugement clinique, de priorisation et de délégation avec stratégies concrètes.",
    slug: "questions-plus-difficiles-rex-pn-types-strategies-reponse",
    primaryKeyword: "questions difficiles REx-PN", searchIntent: "informational" },

  { id: "fr-84", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Le REx-PN est-il plus difficile que le NCLEX? Comparaison pour les IAA canadiennes",
    metaTitle: "REx-PN vs NCLEX comparaison difficulté | NurseNest",
    metaDescription: "Le REx-PN et le NCLEX-RN sont deux examens adaptatifs, mais lequel est plus difficile? Comparaison du contenu, du format et des stratégies de préparation.",
    slug: "rex-pn-plus-difficile-nclex-comparaison-iaa-canadiennes",
    primaryKeyword: "REx-PN vs NCLEX difficulté comparaison", searchIntent: "comparison" },

  { id: "fr-85", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Les sujets les plus redoutés au REx-PN : classement et comment les maîtriser",
    metaTitle: "Sujets les plus redoutés REx-PN | NurseNest",
    metaDescription: "Pharmacologie, électrolytes, jugement clinique — les sujets qui terrifient les candidates au REx-PN. Classement par difficulté et plan de maîtrise pour chacun.",
    slug: "sujets-plus-redoutes-rex-pn-classement-comment-maitriser",
    primaryKeyword: "sujets redoutés REx-PN", searchIntent: "informational" },

  { id: "fr-86", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Quand le REx-PN s'arrête à 85 questions : est-ce bon ou mauvais signe?",
    metaTitle: "REx-PN arrête 85 questions bon mauvais | NurseNest",
    metaDescription: "L'examen s'est arrêté à 85 questions et vous paniquez? Comprendre pourquoi le TAO s'arrête tôt, ce que cela signifie et pourquoi ce n'est pas toujours mauvais.",
    slug: "rex-pn-arrete-85-questions-bon-mauvais-signe",
    primaryKeyword: "REx-PN arrête 85 questions", searchIntent: "informational" },

  { id: "fr-87", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Pourquoi l'examen scolaire ne vous prépare pas au REx-PN : les écarts à combler",
    metaTitle: "Examen scolaire vs REx-PN écarts | NurseNest",
    metaDescription: "Réussir vos examens de programme ne garantit pas le REx-PN. Les écarts entre l'évaluation scolaire et l'examen d'inscription — et comment les combler.",
    slug: "examen-scolaire-ne-prepare-pas-rex-pn-ecarts-combler",
    primaryKeyword: "examen scolaire vs REx-PN", searchIntent: "informational" },

  { id: "fr-88", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Le piège des questions « deux bonnes réponses » au REx-PN : comment trancher",
    metaTitle: "Questions deux bonnes réponses REx-PN | NurseNest",
    metaDescription: "Quand deux options semblent correctes au REx-PN, comment choisir? Technique systématique pour identifier la MEILLEURE réponse parmi des options plausibles.",
    slug: "piege-questions-deux-bonnes-reponses-rex-pn-comment-trancher",
    primaryKeyword: "deux bonnes réponses REx-PN", searchIntent: "informational" },

  { id: "fr-89", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Les compétences de la nouvelle génération au REx-PN : ce qui a changé depuis 2022",
    metaTitle: "Nouvelles compétences REx-PN depuis 2022 | NurseNest",
    metaDescription: "Le REx-PN évolue. Nouvelles compétences évaluées, types de questions ajoutés et ce que les candidates doivent savoir pour se préparer aux exigences actuelles.",
    slug: "competences-nouvelle-generation-rex-pn-change-depuis-2022",
    primaryKeyword: "nouvelles compétences REx-PN 2022", searchIntent: "informational" },

  { id: "fr-90", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Le REx-PN adaptatif : comment il devient plus difficile si vous répondez bien",
    metaTitle: "REx-PN adaptatif plus difficile répondez bien | NurseNest",
    metaDescription: "Le TAO ajuste la difficulté en temps réel. Comment fonctionne l'algorithme, pourquoi vous sentir perdu est souvent bon signe et comment maintenir votre confiance.",
    slug: "rex-pn-adaptatif-plus-difficile-si-repondez-bien",
    primaryKeyword: "REx-PN adaptatif difficulté", searchIntent: "informational" },

  // ── Plans d'étude (10) ────────────────────────────────────────────────────
  { id: "fr-91", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Plan d'étude REx-PN en 8 semaines : de zéro à la réussite, semaine par semaine",
    metaTitle: "Plan étude REx-PN 8 semaines | NurseNest",
    metaDescription: "Plan d'étude structuré de 8 semaines pour le REx-PN. Chaque semaine : sujets, nombre de questions, examens de simulation et critères de progression.",
    slug: "plan-etude-rex-pn-8-semaines-zero-reussite-semaine-par-semaine",
    primaryKeyword: "plan étude REx-PN 8 semaines", searchIntent: "transactional" },

  { id: "fr-92", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Plan d'étude REx-PN en 12 semaines pour les candidates à temps partiel",
    metaTitle: "Plan étude REx-PN 12 semaines temps partiel | NurseNest",
    metaDescription: "Vous n'avez que 60 à 90 minutes par jour? Plan d'étude étalé sur 12 semaines pour les IAA qui travaillent ou ont des obligations familiales.",
    slug: "plan-etude-rex-pn-12-semaines-candidates-temps-partiel",
    primaryKeyword: "plan étude REx-PN 12 semaines temps partiel", searchIntent: "transactional" },

  { id: "fr-93", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Plan d'étude REx-PN : dernières 2 semaines avant l'examen — quoi faire et quoi éviter",
    metaTitle: "REx-PN 2 dernières semaines avant examen | NurseNest",
    metaDescription: "Les 14 jours avant le REx-PN sont critiques. Ce qu'il faut intensifier, ce qu'il faut cesser et comment arriver au jour J dans la meilleure forme possible.",
    slug: "plan-etude-rex-pn-2-dernieres-semaines-avant-examen",
    primaryKeyword: "REx-PN 2 dernières semaines", searchIntent: "transactional" },

  { id: "fr-94", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Comment créer un plan d'étude REx-PN personnalisé selon vos faiblesses",
    metaTitle: "Plan étude REx-PN personnalisé faiblesses | NurseNest",
    metaDescription: "Un plan générique ne suffit pas. Comment identifier vos lacunes, prioriser les sujets faibles et créer un plan d'étude sur mesure pour le REx-PN.",
    slug: "creer-plan-etude-rex-pn-personnalise-selon-faiblesses",
    primaryKeyword: "plan étude REx-PN personnalisé faiblesses", searchIntent: "transactional" },

  { id: "fr-95", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Combien d'heures par jour étudier pour le REx-PN? Le minimum efficace",
    metaTitle: "Heures par jour étudier REx-PN minimum | NurseNest",
    metaDescription: "6 heures par jour? 2 heures? La science de l'apprentissage révèle le nombre d'heures optimal — et pourquoi plus n'est pas toujours mieux pour le REx-PN.",
    slug: "combien-heures-par-jour-etudier-rex-pn-minimum-efficace",
    primaryKeyword: "heures par jour étudier REx-PN", searchIntent: "informational" },

  { id: "fr-96", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Plan d'étude REx-PN pour les mères monoparentales : réaliste et efficace",
    metaTitle: "Plan étude REx-PN mères monoparentales | NurseNest",
    metaDescription: "Mère seule, travail et études : le triple défi. Plan d'étude REx-PN qui respecte vos contraintes réelles avec des blocs de 20 à 30 minutes.",
    slug: "plan-etude-rex-pn-meres-monoparentales-realiste-efficace",
    primaryKeyword: "plan étude REx-PN mères monoparentales", searchIntent: "transactional" },

  { id: "fr-97", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Révision par système corporel vs révision par compétence : quelle approche pour le REx-PN?",
    metaTitle: "Révision système corporel vs compétence REx-PN | NurseNest",
    metaDescription: "Faut-il étudier par organe (cardio, respi, rénal) ou par compétence (jugement clinique, délégation)? Comparaison des deux approches pour le REx-PN.",
    slug: "revision-systeme-corporel-vs-competence-approche-rex-pn",
    primaryKeyword: "révision système corporel vs compétence REx-PN", searchIntent: "comparison" },

  { id: "fr-98", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Comment intégrer les questions pratiques dans votre plan d'étude REx-PN",
    metaTitle: "Intégrer questions pratiques plan étude REx-PN | NurseNest",
    metaDescription: "Les questions pratiques ne sont pas un complément — elles sont le cœur de votre préparation. Comment les intégrer efficacement dans chaque jour d'étude.",
    slug: "integrer-questions-pratiques-plan-etude-rex-pn",
    primaryKeyword: "questions pratiques plan étude REx-PN", searchIntent: "informational" },

  { id: "fr-99", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Plan d'étude REx-PN après un échec : comment restructurer sa préparation",
    metaTitle: "Plan étude REx-PN après échec restructurer | NurseNest",
    metaDescription: "Vous avez échoué et devez reprendre. Ne refaites pas la même chose. Plan de reprise structuré qui cible les lacunes révélées par votre premier essai.",
    slug: "plan-etude-rex-pn-apres-echec-restructurer-preparation",
    primaryKeyword: "plan étude REx-PN après échec", searchIntent: "transactional" },

  { id: "fr-100", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "La technique de l'étude active pour le REx-PN : arrêtez de relire, commencez à pratiquer",
    metaTitle: "Étude active REx-PN pratiquer | NurseNest",
    metaDescription: "Relire ses notes est la méthode la moins efficace. L'étude active (rappel, questions, simulation) multiplie la rétention par 3. Guide pratique pour le REx-PN.",
    slug: "technique-etude-active-rex-pn-arreter-relire-commencer-pratiquer",
    primaryKeyword: "étude active REx-PN", searchIntent: "informational" },

  // ── Erreurs fréquentes (10) ───────────────────────────────────────────────
  { id: "fr-101", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "10 erreurs de préparation au REx-PN que 80 % des candidates commettent",
    metaTitle: "10 erreurs préparation REx-PN candidates | NurseNest",
    metaDescription: "Étudier trop de théorie, négliger les questions pratiques, ignorer les justifications — les 10 erreurs les plus courantes et comment les corriger immédiatement.",
    slug: "10-erreurs-preparation-rex-pn-80-pourcent-candidates-commettent",
    primaryKeyword: "erreurs préparation REx-PN candidates", searchIntent: "informational" },

  { id: "fr-102", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Pourquoi relire ses notes ne fonctionne pas pour le REx-PN : la science l'explique",
    metaTitle: "Relire notes ne fonctionne pas REx-PN | NurseNest",
    metaDescription: "La relecture donne une illusion de maîtrise. La recherche en sciences cognitives montre pourquoi — et quelle méthode la remplace efficacement pour le REx-PN.",
    slug: "pourquoi-relire-notes-ne-fonctionne-pas-rex-pn-science-explique",
    primaryKeyword: "relire notes REx-PN inefficace", searchIntent: "informational" },

  { id: "fr-103", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "L'erreur de vouloir tout mémoriser au REx-PN : misez sur le raisonnement",
    metaTitle: "Tout mémoriser REx-PN erreur raisonnement | NurseNest",
    metaDescription: "Le REx-PN ne teste pas la mémorisation — il teste le raisonnement clinique. Pourquoi le par cœur ne suffit pas et comment développer la pensée critique.",
    slug: "erreur-vouloir-tout-memoriser-rex-pn-miser-raisonnement",
    primaryKeyword: "mémoriser REx-PN erreur raisonnement", searchIntent: "informational" },

  { id: "fr-104", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Étudier sans faire de questions pratiques : la plus grande erreur au REx-PN",
    metaTitle: "Étudier sans questions pratiques erreur REx-PN | NurseNest",
    metaDescription: "Lire des manuels sans pratiquer des questions, c'est comme apprendre à nager en regardant des vidéos. Pourquoi les questions sont indispensables au REx-PN.",
    slug: "etudier-sans-questions-pratiques-plus-grande-erreur-rex-pn",
    primaryKeyword: "étudier sans questions pratiques REx-PN erreur", searchIntent: "informational" },

  { id: "fr-105", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Changer sa réponse au REx-PN : quand le faire et quand résister",
    metaTitle: "Changer réponse REx-PN quand résister | NurseNest",
    metaDescription: "« J'aurais dû garder ma première réponse! » Quand faut-il changer sa réponse au REx-PN? La recherche est claire — et elle vous surprendra.",
    slug: "changer-reponse-rex-pn-quand-faire-quand-resister",
    primaryKeyword: "changer réponse REx-PN", searchIntent: "informational" },

  { id: "fr-106", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Négliger les justifications : l'erreur silencieuse qui coûte le REx-PN",
    metaTitle: "Négliger justifications erreur REx-PN | NurseNest",
    metaDescription: "Faire des questions sans lire les justifications revient à s'entraîner sans coach. Comment transformer chaque justification en véritable apprentissage.",
    slug: "negliger-justifications-erreur-silencieuse-coute-rex-pn",
    primaryKeyword: "négliger justifications REx-PN erreur", searchIntent: "informational" },

  { id: "fr-107", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Se fier uniquement aux résumés pour le REx-PN : quand les raccourcis échouent",
    metaTitle: "Résumés uniquement REx-PN raccourcis échouent | NurseNest",
    metaDescription: "Les résumés et aide-mémoire sont utiles, mais insuffisants seuls. Le REx-PN exige une compréhension profonde que les raccourcis ne peuvent pas fournir.",
    slug: "fier-uniquement-resumes-rex-pn-raccourcis-echouent",
    primaryKeyword: "résumés uniquement REx-PN raccourcis", searchIntent: "informational" },

  { id: "fr-108", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Procrastiner le REx-PN : pourquoi repousser l'examen aggrave le problème",
    metaTitle: "Procrastiner REx-PN repousser examen | NurseNest",
    metaDescription: "Reporter le REx-PN « pour être plus prête » est un piège. Pourquoi l'attente excessive nuit à votre performance et comment fixer une date réaliste.",
    slug: "procrastiner-rex-pn-repousser-examen-aggrave-probleme",
    primaryKeyword: "procrastiner REx-PN repousser examen", searchIntent: "informational" },

  { id: "fr-109", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Étudier sans simuler le TAO : pourquoi les examens adaptatifs sont non négociables",
    metaTitle: "Simuler TAO REx-PN examens adaptatifs | NurseNest",
    metaDescription: "Pratiquer des questions à format fixe ne vous prépare pas au TAO du REx-PN. Pourquoi les examens de simulation adaptatifs sont indispensables à votre réussite.",
    slug: "etudier-sans-simuler-tao-examens-adaptatifs-non-negociables",
    primaryKeyword: "simuler TAO REx-PN adaptatifs", searchIntent: "transactional" },

  { id: "fr-110", region: "canada", locale: "fr", profession: "rpn", exam: "rex-pn",
    title: "Sous-estimer la fatigue cognitive au REx-PN : comment bâtir votre endurance mentale",
    metaTitle: "Fatigue cognitive REx-PN endurance mentale | NurseNest",
    metaDescription: "Après 60 questions, la fatigue cognitive détruit votre performance. Comment bâtir l'endurance mentale avec des sessions de pratique progressives.",
    slug: "sous-estimer-fatigue-cognitive-rex-pn-batir-endurance-mentale",
    primaryKeyword: "fatigue cognitive REx-PN endurance mentale", searchIntent: "informational" },
];

// ═════════════════════════════════════════════════════════════════════════════
// 5 FULL BLOG POSTS  (1,200 – 1,500 words each)
// ═════════════════════════════════════════════════════════════════════════════

export const FR3_POSTS: FR3Post[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Pourquoi le REx-PN est si difficile (~1,350 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...FR3_TOPICS[0],
    wordCount: 1350,
    sections: [
      { heading: "Introduction",
        body: `Si vous êtes en train de préparer le REx-PN, vous avez probablement entendu (ou ressenti) cette phrase : « C'est tellement plus difficile que mes examens de programme. »

Vous n'imaginez pas les choses. Le REx-PN EST plus difficile que vos examens scolaires — et c'est par conception. Mais comprendre POURQUOI il est difficile change complètement la façon dont vous vous préparez.

Trop de candidates traitent le REx-PN comme un examen scolaire plus long. Elles étudient de la même façon, et échouent. Ce guide vous explique précisément ce qui rend le REx-PN différent, et comment adapter votre préparation en conséquence.

[Commencez votre préparation](${lnk.questions}) — testez votre niveau actuel avec des questions pratiques gratuites.` },

      { heading: "Le format TAO : un algorithme qui vous pousse à vos limites",
        body: `La première raison pour laquelle le REx-PN se sent si difficile est son format adaptatif — le Test Adaptatif par Ordinateur (TAO).

**Comment fonctionne le TAO :**
L'algorithme adapte la difficulté de chaque question à votre niveau de performance. Si vous répondez correctement, la prochaine question sera plus difficile. Si vous répondez incorrectement, elle sera légèrement plus facile. L'objectif est de déterminer si votre compétence se situe au-dessus ou en dessous du seuil de réussite.

**Pourquoi cela vous déstabilise :**
- Vous ne pouvez pas revenir en arrière pour corriger une réponse
- Les questions deviennent de plus en plus nuancées si vous performez bien
- Vous avez l'impression de « tout rater » alors que l'algorithme augmente la difficulté — ce qui est souvent un SIGNE DE RÉUSSITE
- L'examen peut s'arrêter entre 85 et 150 questions — vous ne savez jamais quand

La meilleure préparation? Des [examens de simulation adaptatifs](${lnk.cat}) qui reproduisent exactement ce mécanisme. Les questions à format fixe ne vous préparent PAS au stress du TAO.

[Essayez un examen adaptatif](${lnk.cat}) — le simulateur NurseNest utilise le même mécanisme TAO que le vrai REx-PN.` },

      { heading: "Le jugement clinique : plus que de la connaissance",
        body: `Vos examens de programme testaient principalement vos CONNAISSANCES : « Quels sont les signes de l'hyperkaliémie? » Le REx-PN teste votre JUGEMENT : « Un patient présente ces symptômes — quelle est votre PREMIÈRE action? »

Cette distinction est cruciale. Le jugement clinique exige de :
- Reconnaître des schémas dans des données complexes
- Prioriser entre plusieurs interventions valides
- Distinguer l'urgent du non urgent
- Appliquer le champ de pratique de l'IAA (pas celui de l'infirmière autorisée)

Le [jugement clinique](${lnk.lesson("clinical-judgment-prioritization-gold")}) n'est pas quelque chose qu'on mémorise — c'est une compétence qu'on développe par la PRATIQUE RÉPÉTÉE de questions. Chaque question pratique que vous faites développe vos circuits de raisonnement.

C'est pourquoi les candidates qui font 1 000+ [questions pratiques](${lnk.questions}) réussissent mieux que celles qui relisent leurs notes 10 fois. La pratique développe le jugement; la relecture donne une illusion de maîtrise.` },

      { heading: "Les questions ambiguës : quand « deux réponses semblent bonnes »",
        body: `Le REx-PN est conçu pour que les questions aient des options PLAUSIBLES. Contrairement aux examens scolaires où une option est clairement absurde, ici, deux ou trois choix peuvent sembler corrects.

**Pourquoi le NCSBN fait cela :**
En pratique clinique réelle, il y a rarement un seul choix évident. Le REx-PN simule cette ambiguïté. Vous devez choisir la MEILLEURE réponse, pas la seule bonne réponse.

**Technique pour trancher entre deux bonnes réponses :**
1. **ABC d'abord** — la voie respiratoire prime toujours
2. **Évaluer avant d'agir** — en cas de doute, l'évaluation est presque toujours correcte
3. **Sécurité du patient** — l'option qui prévient le plus grand danger est prioritaire
4. **Champ de pratique IAA** — l'option qui respecte votre rôle est toujours correcte

**Piège fréquent :** choisir une intervention d'infirmière autorisée (IA) au lieu d'une action dans le champ de l'IAA. Le REx-PN teste votre compétence EN TANT QU'IAA, pas en tant qu'IA.

Pratiquez cette technique avec des [questions de priorisation](${lnk.questions}) et des [leçons structurées](${lnk.lessons}) qui expliquent le raisonnement derrière chaque bonne réponse.` },

      { heading: "L'écart entre les examens scolaires et le REx-PN",
        body: `Voici les différences concrètes qui expliquent pourquoi la transition est si brutale :

| Examens de programme | REx-PN |
|---|---|
| Contenu d'un seul cours | Contenu de TOUT le programme |
| Réponses évidentes | Plusieurs options plausibles |
| Format fixe (mêmes questions pour tous) | Adaptatif (questions personnalisées) |
| Mémorisation récompensée | Raisonnement exigé |
| Pas de pression temporelle | Fatigue cognitive sur 85-150 questions |
| Possibilité de revenir en arrière | Aucun retour possible |

L'erreur la plus courante est de préparer le REx-PN comme un examen scolaire — relire ses notes, faire des résumés, mémoriser des listes. Ces méthodes ont fonctionné dans le passé, mais elles ne fonctionnent PAS pour le REx-PN.

La méthode qui fonctionne : questions pratiques quotidiennes + révision systématique des justifications + [simulations TAO hebdomadaires](${lnk.cat}).

[Commencez votre préparation](${lnk.questions}) — la transition de l'étude passive à l'étude active commence avec votre première question pratique.` },

      { heading: "La fatigue cognitive : l'ennemi invisible",
        body: `On en parle rarement, mais la fatigue cognitive est un facteur majeur de difficulté au REx-PN.

Après 60 à 80 questions de raisonnement clinique intense, votre cerveau commence à fonctionner au ralenti. Vos dernières questions reçoivent MOINS de réflexion que vos premières — et c'est souvent là que se joue la réussite.

**Comment bâtir votre endurance mentale :**
- Augmentez progressivement la durée de vos sessions de pratique (20 questions → 40 → 60 → 85)
- Pratiquez en conditions réelles : pas de téléphone, pas de pause, temps chronométré
- Faites au moins 2-3 [examens de simulation complets](${lnk.cat}) avant le vrai examen
- Le jour de l'examen, utilisez vos pauses optionnelles stratégiquement

La recherche montre que l'endurance cognitive, comme l'endurance physique, se développe par l'entraînement progressif (Baumeister & Vohs, 2016). Ne la négligez pas dans votre préparation.

[Essayez gratuitement](${lnk.questions}) — commencez par 20 questions aujourd'hui et augmentez progressivement.` },

      { heading: "Le REx-PN est difficile — mais pas impossible",
        body: `Le REx-PN est difficile parce qu'il simule la réalité clinique, pas un examen scolaire. Mais des milliers de candidates le réussissent chaque année, y compris celles qui trouvaient leur préparation insuffisante.

**Ce qui fait la différence entre réussir et échouer :**
1. **Questions pratiques quotidiennes** — minimum 30-50 par jour avec [justifications complètes](${lnk.questions})
2. **Simulations TAO** — au moins hebdomadaires avec des [examens adaptatifs](${lnk.cat})
3. **Analyse des erreurs** — comprendre POURQUOI vous avez tort, pas juste constater
4. **Endurance cognitive** — bâtir progressivement votre capacité à raisonner sur 85+ questions
5. **Étude active** — pratiquer, pas relire

Le fait que vous lisiez cet article signifie que vous prenez votre préparation au sérieux. C'est déjà un avantage.

[Commencez votre préparation](${lnk.questions}) dès aujourd'hui. [Accédez aux leçons structurées](${lnk.lessons}) et aux [examens de simulation adaptatifs](${lnk.cat}). Le REx-PN est difficile — mais avec la bonne méthode, il est tout à fait à votre portée. [Essayez gratuitement](${lnk.pricing}).` },
    ],
    faq: [
      { question: "Le REx-PN est-il le même partout au Canada?", answer: "Oui, le REx-PN est l'examen national pour toutes les provinces qui l'ont adopté. Le contenu et le format TAO sont identiques, mais les exigences d'inscription varient entre l'OIIAQ (Québec) et le CNO (Ontario)." },
      { question: "Peut-on échouer même en se sentant bien pendant l'examen?", answer: "Oui, et l'inverse est aussi vrai. Le TAO rend l'évaluation subjective peu fiable — des candidates qui pensaient avoir échoué ont réussi, et vice versa. C'est pourquoi des indicateurs objectifs comme les scores de simulation sont plus fiables que vos impressions." },
      { question: "Est-ce que le REx-PN devient plus facile avec le temps?", answer: "Le REx-PN a plutôt tendance à évoluer vers plus de complexité avec l'introduction de nouvelles compétences. Repousser l'examen n'est généralement pas une bonne stratégie." },
    ],
    references: [
      { text: "National Council of State Boards of Nursing. (2023). *REx-PN examination: Test plan*. NCSBN. https://www.ncsbn.org/rex-pn" },
      { text: "Baumeister, R. F., & Vohs, K. D. (2016). Strength model of self-regulation as limited resource. *Advances in Experimental Social Psychology*, 54, 67–127." },
      { text: "Karpicke, J. D., & Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying. *Science*, 331(6018), 772–775." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. Plan d'étude 8 semaines (~1,380 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...FR3_TOPICS[10],
    wordCount: 1380,
    sections: [
      { heading: "Introduction",
        body: `Vous avez décidé de vous préparer au REx-PN. La première question : par où commencer?

Sans plan structuré, la plupart des candidates oscillent entre l'étude chaotique (« je lis un peu de tout ») et la paralysie (« il y a trop de matière, je ne sais pas quoi faire »). Les deux mènent à l'échec.

Ce plan de 8 semaines élimine ce problème. Chaque semaine a un objectif clair, des sujets précis, un nombre de questions cible et un critère de progression. Suivez-le tel quel ou adaptez-le à votre rythme — mais ne le sautez pas.

**Prérequis :** environ 90 à 120 minutes par jour, 5 à 6 jours par semaine. Si vous avez moins de temps, étalez sur 12 semaines.

[Commencez votre préparation](${lnk.questions}) — faites 20 questions de base pour établir votre niveau de départ.` },

      { heading: "Semaine 0 : évaluation de base (jour 1)",
        body: `Avant de commencer, vous devez connaître votre point de départ.

**Comment faire :**
1. Faites 25 [questions pratiques aléatoires](${lnk.questions}) — sans préparation, sans notes
2. Notez votre score global (pourcentage)
3. Identifiez vos 3 sujets les plus faibles

**Interprétation :**
- **60 %+** : bonne base — le plan de 8 semaines est parfait
- **45-59 %** : base moyenne — envisagez 10 semaines
- **Moins de 45 %** : base faible — ajoutez 2-4 semaines de révision fondamentale

**Ne vous découragez pas** si votre score est bas. C'est normal — le REx-PN est DIFFÉRENT de vos examens de programme. Ce plan est conçu pour vous amener de n'importe quel point de départ à la réussite.

[Faites un examen adaptatif](${lnk.cat}) pour une évaluation encore plus précise par sujet.` },

      { heading: "Semaines 1-2 : fondations — ce qui diffère du programme",
        body: `**Objectif :** maîtriser les concepts clés que le programme ne couvre pas assez

**Horaire quotidien (90 min) :**
- 30 min : [Leçon structurée](${lnk.lessons}) sur 1 sujet
- 45-60 min : 20-25 [questions pratiques](${lnk.questions}) + révision complète des justifications

**Semaine 1 — sujets prioritaires :**
- [Jugement clinique et priorisation](${lnk.lesson("clinical-judgment-prioritization-gold")}) — fondation du REx-PN
- Délégation et champ de pratique IAA (différent de celui de l'IA)
- Sécurité du patient et prévention des erreurs

**Semaine 2 — sujets prioritaires :**
- [Pharmacologie à haut risque](${lnk.lesson("high-alert-medications-gold")}) : insuline, héparine, warfarine, digoxine
- [Déséquilibres liquidiens et électrolytiques](${lnk.lesson("fluids-electrolytes-emergencies-gold")}) : hyperkaliémie, hyponatrémie
- Communication thérapeutique en santé mentale

**Critère de progression :** 50 %+ sur les questions ciblées de la semaine.

**Astuce :** commencez un journal d'erreurs dès le jour 1. Pour chaque question ratée, notez : le sujet, pourquoi vous avez tort et la règle à retenir. Ce journal deviendra votre outil le plus précieux.` },

      { heading: "Semaines 3-4 : élargissement — couvrir les grands systèmes",
        body: `**Objectif :** couvrir les systèmes corporels majeurs testés au REx-PN

**Horaire quotidien (100 min) :**
- 15 min : révision du journal d'erreurs de la veille
- 60-75 min : 30-35 [questions mixtes](${lnk.questions}) + justifications
- 15 min : 1 mini-leçon sur un sujet faible

**Semaine 3 — systèmes à couvrir :**
- Soins cardiaques : insuffisance cardiaque, SCA, arythmies
- Soins respiratoires : MPOC, asthme, oxygénothérapie
- Diabète : types d'insuline, ACD vs SHH

**Semaine 4 — systèmes à couvrir :**
- Soins rénaux : IRC, dialyse, IRA
- [Sepsie et contrôle des infections](${lnk.lesson("sepsis-early-recognition-gold")})
- Soins maternels et néonatals : accouchement, post-partum, évaluation du nouveau-né

**Critère de progression :** 55 %+ sur les questions mixtes. Premier [examen adaptatif](${lnk.cat}) — ne visez pas la réussite, visez l'identification de vos lacunes.

**Attention :** ne passez pas trop de temps sur les sujets que vous maîtrisez déjà. Votre journal d'erreurs vous montre où concentrer votre énergie.` },

      { heading: "Semaines 5-6 : intégration — mélanger et accélérer",
        body: `**Objectif :** intégrer tous les sujets, développer la rapidité et la confiance

**Horaire quotidien (100-120 min) :**
- 75-90 min : 40-50 [questions aléatoires](${lnk.questions}) (mode chronométré — 90 secondes par question)
- 15-30 min : révision du journal d'erreurs + mini-révision des sujets faibles

**Activités clés :**
1. **Questions mixtes obligatoires** — ne pratiquez plus un seul sujet à la fois
2. **Mode chronométré** — habituez-vous à la pression du temps
3. **1 [examen adaptatif](${lnk.cat}) par semaine** — chaque samedi ou dimanche
4. **Profondeur des justifications** — comprenez pourquoi CHAQUE option est correcte ou incorrecte

**Sujets avancés à ajouter :**
- Éthique et aspects juridiques (consentement, confidentialité, documentation)
- Gériatrie (chutes, démence, polymédication)
- Soins palliatifs et fin de vie
- Neurologie (AVC, convulsions)

**Critère de progression :** 60 %+ sur les questions aléatoires. Vos [examens adaptatifs](${lnk.cat}) commencent à montrer des résultats « près du seuil » ou « réussite ».

[Essayez gratuitement](${lnk.questions}) — si vous êtes en semaine 5 et n'avez pas encore commencé les questions pratiques, il est encore temps.` },

      { heading: "Semaines 7-8 : préparation finale — atteindre le seuil de réussite",
        body: `**Objectif :** atteindre le niveau de réussite de façon consistante et fixer la date d'examen

**Horaire quotidien (90-120 min) :**
- 90 min : 50-75 questions aléatoires chronométrées
- 30 min : UNIQUEMENT les sujets du journal d'erreurs — rien d'autre
- 2 [examens adaptatifs](${lnk.cat}) par semaine

**Critères pour réserver l'examen :**
- ✅ 3 [examens adaptatifs](${lnk.cat}) consécutifs avec résultat « RÉUSSITE »
- ✅ Précision globale de 63 %+ de façon constante
- ✅ Aucun sujet majeur en dessous du seuil
- ✅ Confiance avec les questions chronométrées

**Si vous n'atteignez pas ces critères :** ne réservez pas encore. Ajoutez 2 semaines supplémentaires ciblant vos faiblesses. Il vaut mieux investir 2 semaines de plus que payer les frais de reprise.

**Derniers 3-4 jours avant l'examen :**
- Réduisez l'intensité : 20-30 questions par jour seulement
- Dormez bien : 7-8 heures minimum
- Revoyez votre journal d'erreurs une dernière fois
- Préparez la logistique : centre Pearson VUE, documents, itinéraire

[Commencez votre préparation](${lnk.questions}) — ce plan fonctionne que vous commenciez à 60 % ou à 40 %. La clé est la constance quotidienne.` },

      { heading: "La constance bat l'intensité",
        body: `La leçon la plus importante de ce plan : **90 minutes par jour pendant 8 semaines battent 8 heures par jour pendant 2 semaines.**

L'apprentissage consolidé par la pratique espacée (Dunlosky et al., 2013) est 2 à 3 fois plus efficace que le bachotage intensif. Votre cerveau a besoin de temps entre les sessions pour consolider les apprentissages.

**Règles non négociables :**
1. Faites des questions CHAQUE jour — minimum 20, même les jours difficiles
2. Ne sautez jamais 2 jours consécutifs
3. Lisez CHAQUE justification — correcte ou incorrecte
4. Faites votre [examen adaptatif](${lnk.cat}) hebdomadaire — c'est votre boussole

Ce plan a un seul objectif : que vous soyez PRÊTE le jour de l'examen. Pas stressée, pas en train de bachoter, pas en doute — prête.

[Commencez votre préparation](${lnk.pricing}) avec NurseNest — [leçons structurées](${lnk.lessons}), [questions avec justifications](${lnk.questions}) et [examens TAO](${lnk.cat}), le tout en français. [Essayez gratuitement](${lnk.questions}).` },
    ],
    faq: [
      { question: "Ce plan fonctionne-t-il pour une deuxième tentative au REx-PN?", answer: "Oui, mais avec un ajustement important : commencez par analyser votre rapport de performance de la première tentative. Identifiez les sujets sous le seuil et doublez le temps qui leur est consacré dans les semaines 1-4. Le reste du plan s'applique tel quel." },
      { question: "Je n'ai que 60 minutes par jour — puis-je adapter ce plan?", answer: "Oui. Étalez le plan sur 12 semaines au lieu de 8. Réduisez le nombre de questions quotidiennes à 20-25 et maintenez les examens adaptatifs hebdomadaires. L'important est la constance, pas l'intensité." },
      { question: "Dois-je suivre exactement l'ordre des sujets?", answer: "Non. Si vous savez déjà que la pharmacologie est votre plus grande faiblesse, avancez-la à la semaine 1. Le plan est un cadre; adaptez l'ordre à VOS lacunes identifiées lors de l'évaluation de base." },
    ],
    references: [
      { text: "National Council of State Boards of Nursing. (2023). *REx-PN examination: Test plan*. NCSBN. https://www.ncsbn.org/rex-pn" },
      { text: "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest*, 14(1), 4–58." },
      { text: "Roediger, H. L., & Butler, A. C. (2011). The critical role of retrieval practice in long-term retention. *Trends in Cognitive Sciences*, 15(1), 20–27." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. 10 erreurs de préparation (~1,320 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...FR3_TOPICS[20],
    wordCount: 1320,
    sections: [
      { heading: "Introduction",
        body: `80 % des candidates au REx-PN commettent au moins 3 de ces 10 erreurs. Ce ne sont pas des erreurs de contenu (ne pas connaître la pharmacologie) — ce sont des erreurs de MÉTHODE (mal étudier la pharmacologie).

La bonne nouvelle : ces erreurs sont faciles à corriger une fois identifiées. La mauvaise nouvelle : la plupart des candidates ne réalisent leur erreur qu'après avoir échoué.

Ce guide vous épargne cette leçon coûteuse. Lisez-le, identifiez vos erreurs, et corrigez-les AVANT le jour de l'examen.

[Commencez votre préparation](${lnk.questions}) — le premier pas vers une préparation efficace est de reconnaître ce qui ne fonctionne pas.` },

      { heading: "Erreurs 1-3 : les problèmes de méthode d'étude",
        body: `**Erreur 1 : Relire ses notes au lieu de pratiquer des questions**

La relecture donne une « illusion de maîtrise » (Bjork & Bjork, 2011). Vous reconnaissez le contenu et pensez le maîtriser, mais en examen, vous ne pouvez pas le retrouver quand il le faut.

La solution : remplacez 70 % de votre temps de relecture par des [questions pratiques](${lnk.questions}). La recherche active (retrieval practice) est 2 à 3 fois plus efficace que la relecture.

**Erreur 2 : Faire des questions sans lire les justifications**

Faire 100 questions par jour sans lire les justifications revient à s'entraîner sans coach. Vous répétez vos erreurs au lieu de les corriger.

La solution : pour CHAQUE question, lisez la justification complète — même si vous avez répondu correctement. Comprenez pourquoi les options incorrectes sont incorrectes. Les [questions NurseNest](${lnk.questions}) incluent des justifications détaillées pour chaque option.

**Erreur 3 : Étudier par sujet au lieu de mélanger**

Étudier uniquement la pharmacologie pendant 3 jours, puis uniquement le cardio pendant 3 jours crée une fausse confiance. Le REx-PN mélange les sujets — une question de pharmacologie suivie d'une question de délégation suivie d'une question de soins maternels.

La solution : à partir de la 3e semaine de préparation, faites des [questions aléatoires mixtes](${lnk.questions}). L'interleaving (alternance des sujets) améliore la rétention à long terme de 43 % (Rohrer & Taylor, 2007).` },

      { heading: "Erreurs 4-6 : les problèmes de stratégie",
        body: `**Erreur 4 : Vouloir tout mémoriser**

Le REx-PN ne teste pas votre capacité à réciter des listes. Il teste votre capacité à RAISONNER à partir de connaissances. Mémoriser 500 médicaments sans comprendre les classes, les effets et les interactions est du temps perdu.

La solution : focalisez-vous sur la COMPRÉHENSION des mécanismes. Si vous comprenez pourquoi l'hyperkaliémie est dangereuse (effet sur le cœur), vous pouvez déduire les interventions sans les avoir mémorisées une par une. Les [leçons structurées](${lnk.lessons}) enseignent les concepts en profondeur.

**Erreur 5 : Négliger les simulations adaptatives**

Les questions à format fixe (50 questions, tout le monde reçoit les mêmes) ne simulent pas le REx-PN. Le TAO est une expérience unique — la difficulté change, vous ne pouvez pas revenir en arrière, et le stress est différent.

La solution : faites au moins 1 [examen adaptatif complet](${lnk.cat}) par semaine à partir de la 4e semaine de préparation. C'est NON NÉGOCIABLE.

**Erreur 6 : Étudier des sujets déjà maîtrisés**

Il est confortable de réviser les sujets que vous connaissez bien. Cela donne un faux sentiment de progrès. Mais chaque heure passée sur un sujet maîtrisé est une heure volée à un sujet faible.

La solution : utilisez votre journal d'erreurs pour identifier vos 3-5 sujets les plus faibles et consacrez-leur 60 % de votre temps d'étude. [Les examens adaptatifs](${lnk.cat}) identifient vos lacunes objectivement.` },

      { heading: "Erreurs 7-8 : les problèmes de gestion du temps",
        body: `**Erreur 7 : Bachoter 8 heures la fin de semaine au lieu d'étudier 90 minutes par jour**

Le bachotage intensif (« cramming ») est la méthode la MOINS efficace pour la rétention à long terme. Votre cerveau consolide les apprentissages pendant le sommeil entre les sessions, pas pendant les sessions elles-mêmes.

La solution : 90 minutes par jour, 5-6 jours par semaine, pendant 6-12 semaines. La constance bat l'intensité, toujours.

**Erreur 8 : Procrastiner la date de l'examen**

« Je ne suis pas encore prête » est parfois légitime, mais souvent, c'est de l'évitement. Reporter indéfiniment le REx-PN a des conséquences réelles :
- Perte de revenus (vous ne pouvez pas travailler comme IAA sans licence)
- Érosion des connaissances (ce que vous avez appris se dégrade avec le temps)
- Anxiété croissante (plus vous attendez, plus la pression monte)

La solution : fixez une date d'examen AVANT de commencer votre préparation. Étudier « jusqu'à ce que je me sente prête » n'a pas de fin. Avoir une date fixe crée l'urgence nécessaire.

Quand êtes-vous objectivement prête? Quand 3 [examens adaptatifs](${lnk.cat}) consécutifs montrent « RÉUSSITE ».` },

      { heading: "Erreurs 9-10 : les problèmes de mentalité",
        body: `**Erreur 9 : Se comparer aux autres candidates**

« Ma collègue a réussi en 4 semaines de préparation » — et alors? Chaque candidate a un point de départ différent, des forces différentes et un contexte de vie différent.

La solution : votre seule comparaison valide est VOUS-MÊME d'il y a une semaine. Vos scores de pratique augmentent? Vos erreurs récurrentes diminuent? Alors vous progressez, peu importe le rythme des autres.

**Erreur 10 : Ignorer la santé mentale et physique**

L'épuisement (burnout) est réel pendant la préparation au REx-PN. Étudier quand vous êtes épuisé est non seulement inefficace — cela peut CRÉER des erreurs d'apprentissage.

La solution : planifiez un jour de repos complet par semaine. Dormez 7-8 heures. Bougez physiquement. Mangez bien. Votre cerveau ne peut pas apprendre efficacement dans un corps épuisé.

L'ironie : les candidates qui prennent soin d'elles-mêmes réussissent MIEUX que celles qui sacrifient tout pour étudier.` },

      { heading: "Le plan d'action immédiat",
        body: `Ne changez pas les 10 choses en même temps. Identifiez les 2-3 erreurs que vous commettez MAINTENANT et corrigez-les cette semaine :

1. **Si vous relisez vos notes** → remplacez par 30 [questions pratiques](${lnk.questions}) quotidiennes
2. **Si vous ignorez les justifications** → lisez CHAQUE justification, correcte ou non
3. **Si vous étudiez un sujet à la fois** → passez aux questions aléatoires mixtes
4. **Si vous évitez les simulations** → faites 1 [examen adaptatif](${lnk.cat}) cette semaine
5. **Si vous bachotez** → passez à 90 min/jour au lieu de 8 h/week-end
6. **Si vous procrastinez** → fixez votre date d'examen aujourd'hui

[Essayez gratuitement](${lnk.questions}) — la correction de ces erreurs commence avec votre prochaine session de questions pratiques. [Accédez aux leçons](${lnk.lessons}) et aux [examens adaptatifs](${lnk.cat}) pour une préparation structurée et efficace. [Commencez votre préparation](${lnk.pricing}).` },
    ],
    faq: [
      { question: "Quelle est l'erreur la plus grave?", answer: "L'erreur 1 (relire au lieu de pratiquer) est la plus destructrice parce qu'elle crée une illusion de maîtrise. Vous pensez être prête parce que vous reconnaissez le contenu, mais en examen, la reconnaissance ne suffit pas — il faut le rappel actif." },
      { question: "Combien de questions pratiques par jour sont suffisantes?", answer: "Minimum 30 questions avec révision complète des justifications. Si vous faites 100 questions sans lire les justifications, c'est MOINS efficace que 30 questions avec justifications. La qualité bat la quantité." },
      { question: "Comment savoir si ma méthode d'étude fonctionne?", answer: "Vos scores de questions pratiques augmentent-ils de semaine en semaine? Vos erreurs récurrentes diminuent-elles? Vos examens adaptatifs montrent-ils une progression? Si oui, continuez. Sinon, changez de méthode." },
    ],
    references: [
      { text: "Bjork, R. A., & Bjork, E. L. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In M. A. Gernsbacher et al. (Eds.), *Psychology and the real world*. Worth Publishers." },
      { text: "Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science*, 35(6), 481–498." },
      { text: "Dunlosky, J., et al. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest*, 14(1), 4–58." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Plan d'étude après un échec (~1,300 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...FR3_TOPICS[18],
    wordCount: 1300,
    sections: [
      { heading: "Introduction",
        body: `Vous avez échoué au REx-PN. C'est douloureux, c'est décevant, et c'est normal de vous sentir découragée.

Mais voici la vérité que personne ne vous dit : la majorité des candidates qui échouent au premier essai RÉUSSISSENT au deuxième. L'échec n'est pas un verdict sur vos compétences — c'est une information sur votre MÉTHODE de préparation.

Le piège? Reprendre la MÊME méthode en espérant un résultat différent. Si vous avez étudié en relisant vos notes et en faisant peu de questions pratiques, refaire exactement la même chose ne changera rien.

Ce guide est un plan de reprise structuré. Pas de phrases de motivation vides — des actions concrètes basées sur votre performance de premier essai.

[Commencez votre préparation](${lnk.questions}) — cette fois, avec la bonne méthode.` },

      { heading: "Semaine 1 : analyse de votre premier essai (avant toute étude)",
        body: `Ne recommencez PAS à étudier immédiatement. La première semaine de votre reprise est consacrée à l'ANALYSE, pas à la révision.

**Étape 1 : Lisez votre rapport de performance**
Le NCSBN vous envoie un rapport qui indique vos forces et faiblesses par compétence. Ce rapport est votre carte.

**Étape 2 : Identifiez vos catégories « sous le seuil »**
Les catégories marquées « below the passing standard » sont vos priorités absolues. Ne les ignorez pas pour aller vers les sujets que vous aimez.

**Étape 3 : Évaluez votre méthode précédente**
Posez-vous honnêtement ces questions :
- Combien de questions pratiques ai-je faites au total? (Si < 800, c'est insuffisant)
- Ai-je lu les justifications de chaque question? (Si non, c'est le problème principal)
- Ai-je fait des examens adaptatifs? (Si non, vous n'étiez pas préparée au TAO)
- Ai-je étudié régulièrement ou par intermittence? (Si intermittent, c'est un problème)

**Étape 4 : Faites une [évaluation de base](${lnk.questions}) — 25 questions aléatoires**
Comparez votre score actuel à ce qu'il était avant votre premier essai. Cela vous dit combien de matière vous avez retenue.

[Examens adaptatifs](${lnk.cat}) — utilisez-les pour une évaluation précise par sujet.` },

      { heading: "Semaines 2-3 : reconstruction des fondations faibles",
        body: `**Objectif :** maîtriser les sujets « sous le seuil » de votre rapport de performance

**Horaire quotidien (90-120 min) :**
- 45 min : [Leçon structurée](${lnk.lessons}) sur un sujet « sous le seuil »
- 45-60 min : 25-30 [questions ciblées](${lnk.questions}) sur ce sujet + justifications

**Approche différente cette fois :**
- Commencez par vos PIRES sujets, pas vos meilleurs
- Pour chaque concept, demandez-vous : « Puis-je EXPLIQUER ceci sans mes notes? »
- Utilisez l'apprentissage actif : fermez vos notes et essayez de réciter l'information
- Créez un nouveau journal d'erreurs — ne réutilisez pas l'ancien

**Sujets typiquement « sous le seuil » pour les candidates en reprise :**
- [Jugement clinique et priorisation](${lnk.lesson("clinical-judgment-prioritization-gold")})
- Délégation et champ de pratique IAA
- [Pharmacologie à haut risque](${lnk.lesson("high-alert-medications-gold")})
- [Déséquilibres liquidiens et électrolytiques](${lnk.lesson("fluids-electrolytes-emergencies-gold")})

**Critère de progression :** 55 %+ sur les questions ciblées de vos sujets faibles.` },

      { heading: "Semaines 4-6 : intégration et pratique mixte",
        body: `**Objectif :** réintégrer tous les sujets et développer le raisonnement transversal

**Horaire quotidien (100-120 min) :**
- 15 min : révision du journal d'erreurs
- 75-90 min : 35-50 [questions aléatoires mixtes](${lnk.questions}) + justifications
- 15 min : mini-leçon sur le point faible du jour

**Règles strictes :**
1. **Aucune question ciblée par sujet** — tout est mélangé à partir de maintenant
2. **Mode chronométré** — 90 secondes par question maximum
3. **1 [examen adaptatif](${lnk.cat}) par semaine** — chaque fin de semaine
4. **Justifications obligatoires** — même pour les questions réussies

**Ce qui est DIFFÉRENT de votre première préparation :**
- Plus de questions, moins de relecture
- Plus de simulations TAO, pas seulement des questions fixes
- Journal d'erreurs actif (pas juste des notes)
- Focus sur le raisonnement, pas la mémorisation

**Critère de progression :** 60 %+ sur les questions mixtes. [Examen adaptatif](${lnk.cat}) montre « près du seuil » ou « réussite ».` },

      { heading: "Semaines 7-8 : préparation finale et critères de réservation",
        body: `**Objectif :** atteindre le seuil de réussite de façon CONSTANTE

**Horaire quotidien (90-120 min) :**
- 90 min : 50-75 questions aléatoires chronométrées
- 30 min : UNIQUEMENT le journal d'erreurs
- 2 [examens adaptatifs](${lnk.cat}) par semaine

**Réservez l'examen UNIQUEMENT quand :**
- ✅ 3 [examens adaptatifs](${lnk.cat}) consécutifs montrent « RÉUSSITE »
- ✅ Précision de 63 %+ de façon constante
- ✅ Aucun sujet majeur « sous le seuil »
- ✅ Vos sujets anciennement faibles sont maintenant à 55 %+

**IMPORTANT pour les candidates en reprise :**
Ne réservez PAS tant que vos simulations ne montrent pas une amélioration CLAIRE par rapport à votre première tentative. Le coût d'un deuxième échec (financier et émotionnel) est trop élevé pour prendre un risque.

**Derniers jours :**
- Réduisez à 20-30 questions par jour
- Dormez bien
- Faites de l'exercice physique léger
- Préparez votre logistique (centre Pearson VUE, documents)

[Essayez gratuitement](${lnk.questions}) — cette fois, votre préparation sera différente parce que votre MÉTHODE est différente.` },

      { heading: "Ce qui change tout : la méthode, pas l'effort",
        body: `La plupart des candidates en reprise pensent : « Je n'ai pas assez étudié. » La réalité est souvent : « J'ai mal étudié. »

**Les 3 changements les plus importants :**
1. **De la relecture aux questions** — 70 % de votre temps = [questions pratiques](${lnk.questions}) avec justifications
2. **Des questions fixes aux simulations TAO** — [examens adaptatifs](${lnk.cat}) hebdomadaires obligatoires
3. **De l'étude par sujet aux questions mixtes** — dès la 4e semaine, tout est mélangé

Ces trois changements, appliqués systématiquement pendant 8 semaines, transforment votre préparation. Ce n'est pas de la magie — c'est ce que la science de l'apprentissage recommande (Karpicke, 2012).

Vous avez échoué une fois. Cela fait de vous une candidate MIEUX INFORMÉE, pas une candidate plus faible. Vous connaissez maintenant le format, le stress et vos faiblesses. Utilisez cette information.

[Commencez votre préparation](${lnk.pricing}) avec NurseNest — [leçons](${lnk.lessons}), [questions](${lnk.questions}) et [examens adaptatifs](${lnk.cat}) conçus pour les candidates sérieuses. [Essayez gratuitement](${lnk.questions}).` },
    ],
    faq: [
      { question: "Combien de temps attendre avant de repasser le REx-PN?", answer: "Le NCSBN exige un délai minimum (généralement 45-90 jours selon la province). Utilisez ce temps pour le plan de reprise de 8 semaines. Ne reprenez pas avant d'avoir complété au minimum 6 semaines de préparation structurée." },
      { question: "Faut-il changer de matériel d'étude?", answer: "Pas nécessairement. Le problème est rarement le matériel — c'est la méthode. Si vous passiez de la relecture aux questions pratiques et aux simulations TAO avec le MÊME matériel, vos résultats changeraient. Cela dit, un outil avec de bonnes justifications et des simulations adaptatives est essentiel." },
      { question: "Le deuxième essai est-il plus difficile?", answer: "Non. L'examen est le même en termes de difficulté. Mais votre expérience est un avantage : vous connaissez le format, le stress et vos faiblesses. Si votre méthode de préparation change, vos chances augmentent significativement." },
    ],
    references: [
      { text: "Karpicke, J. D. (2012). Retrieval-based learning: Active retrieval promotes meaningful learning. *Current Directions in Psychological Science*, 21(3), 157–163." },
      { text: "National Council of State Boards of Nursing. (2023). *REx-PN examination: Test plan*. NCSBN. https://www.ncsbn.org/rex-pn" },
      { text: "Bjork, R. A. (2013). Desirable difficulties perspective on learning. In H. Pashler (Ed.), *Encyclopedia of the mind*. SAGE Publications." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Étude active vs relecture (~1,280 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...FR3_TOPICS[19],
    wordCount: 1280,
    sections: [
      { heading: "Introduction",
        body: `Vous étudiez 3 heures par jour et ne progressez pas. Vous relisez vos notes, faites des résumés, surlignez des passages — et vos scores de pratique stagnent à 50-55 %.

Le problème n'est pas votre intelligence ni votre effort. Le problème est votre MÉTHODE.

Depuis 20 ans, la recherche en sciences cognitives est unanime : la relecture est parmi les méthodes d'apprentissage les MOINS efficaces (Dunlosky et al., 2013). L'étude active — qui inclut le rappel, les questions et la simulation — est 2 à 3 fois plus efficace.

Ce guide vous apprend à passer de l'étude passive (qui gaspille votre temps) à l'étude active (qui construit votre compétence). Le changement est simple à comprendre, mais exige de la discipline.

[Essayez gratuitement](${lnk.questions}) — faites 20 questions pratiques et comparez l'apprentissage avec 20 minutes de relecture.` },

      { heading: "Pourquoi la relecture ne fonctionne pas : l'illusion de maîtrise",
        body: `Quand vous relisez vos notes sur l'hyperkaliémie, vous RECONNAISSEZ l'information. « Ah oui, potassium élevé, risque d'arythmie, surveiller l'ECG. » Vous vous sentez confiante.

Mais en examen, on ne vous demande pas de RECONNAÎTRE — on vous demande de PRODUIRE. « Ce patient a un potassium à 6,2 mEq/L. Quelle est votre PREMIÈRE action? » Et soudain, ce qui semblait évident dans vos notes devient flou.

C'est l'illusion de maîtrise (Bjork & Bjork, 2011). La reconnaissance est facile; le rappel est difficile. Et le REx-PN teste le rappel, pas la reconnaissance.

**L'expérience que vous pouvez faire aujourd'hui :**
1. Relisez vos notes sur un sujet pendant 20 minutes
2. Fermez vos notes et essayez d'écrire tout ce que vous vous rappelez
3. Comparez avec vos notes — combien avez-vous retenu?

La plupart des gens retiennent 20-30 % après relecture. Avec l'étude active, ce taux monte à 60-80 %.` },

      { heading: "Les 4 piliers de l'étude active pour le REx-PN",
        body: `**Pilier 1 : Le rappel actif (retrieval practice)**
Au lieu de relire, TESTEZ-VOUS. Fermez vos notes et essayez de vous rappeler l'information. Chaque effort de rappel renforce la trace mnésique.

Application REx-PN : faites des [questions pratiques](${lnk.questions}) avant de relire le sujet. Si vous ne savez pas, tant mieux — l'effort de réflexion renforce plus que la relecture.

**Pilier 2 : La pratique espacée (spaced practice)**
Au lieu de bachoter un sujet pendant 3 heures, répartissez votre étude sur plusieurs jours courts. 30 minutes de pharmacologie lundi, mercredi et vendredi est plus efficace que 90 minutes d'un coup.

Application REx-PN : les [questions aléatoires mixtes](${lnk.questions}) forcent naturellement l'espacement — vous revisitez les sujets de façon imprévisible.

**Pilier 3 : L'interleaving (alternance des sujets)**
Au lieu d'étudier un sujet à la fois, alternez. 10 questions de cardio, puis 10 de pharma, puis 10 de santé mentale. C'est plus difficile sur le moment, mais produit une meilleure rétention à long terme.

Application REx-PN : utilisez le mode « aléatoire » de votre [banque de questions](${lnk.questions}) — c'est exactement ce que le vrai examen fait.

**Pilier 4 : L'élaboration**
Au lieu de mémoriser un fait, connectez-le à ce que vous savez déjà. « Pourquoi l'hyperkaliémie cause des arythmies? Parce que le potassium affecte la conductivité cardiaque. »

Application REx-PN : les justifications détaillées des questions expliquent le POURQUOI, pas juste le QUOI. Lisez-les attentivement.` },

      { heading: "Comment restructurer votre session d'étude",
        body: `**Avant (étude passive — 90 minutes) :**
- 30 min : relire les notes de pharmacologie
- 30 min : faire des résumés
- 30 min : regarder une vidéo
- Résultat : impression de maîtrise, mais rétention < 30 %

**Après (étude active — 90 minutes) :**
- 5 min : réviser le journal d'erreurs de la veille (rappel)
- 50 min : 30 [questions pratiques mixtes](${lnk.questions}) + justifications (rappel + interleaving)
- 20 min : [leçon structurée](${lnk.lessons}) sur le point faible identifié (élaboration)
- 15 min : mettre à jour le journal d'erreurs (auto-évaluation)
- Résultat : apprentissage profond, rétention > 60 %

**La différence en résultats concrets :**
Après 4 semaines d'étude passive : scores stagnent à 50-55 %
Après 4 semaines d'étude active : scores progressent de 50 % à 62-68 %

Ce n'est pas théorique — c'est ce que la recherche montre de façon constante (Karpicke & Blunt, 2011).` },

      { heading: "Le journal d'erreurs : votre outil le plus puissant",
        body: `Le journal d'erreurs est la version appliquée de l'étude active. Pour chaque question ratée :

| Date | Sujet | Pourquoi j'ai eu tort | Règle à retenir | Revu? |
|---|---|---|---|---|
| 5 mai | Pharma | Confondu insuline rapide et intermédiaire | Lispro = rapide (15 min), NPH = intermédiaire (2-4h) | ☐ |

**Règles du journal :**
1. Remplissez-le PENDANT votre session, pas après
2. La colonne « Pourquoi j'ai eu tort » est la plus importante — pas ce que vous ne saviez pas, mais POURQUOI vous avez choisi la mauvaise réponse
3. Revoyez les 5 dernières entrées AVANT chaque session
4. Quand la même erreur apparaît 3 fois, c'est un signal d'alarme — consacrez une session entière à ce sujet

Après 4-6 semaines, votre journal devient un guide d'étude PERSONNALISÉ plus efficace que n'importe quel manuel — parce qu'il cible VOS faiblesses, pas celles de la candidate moyenne.` },

      { heading: "Le changement est inconfortable — et c'est le point",
        body: `L'étude active SEMBLE plus difficile que la relecture. C'est normal et c'est le point.

Quand vous relisez, tout coule facilement — vous reconnaissez le contenu, rien n'est difficile, vous vous sentez productive. C'est une illusion confortable.

Quand vous faites des questions et ratez 40 %, c'est frustrant. Quand vous essayez de vous rappeler une information et échouez, c'est humiliant. Mais c'est EXACTEMENT cet effort qui crée l'apprentissage.

Le concept de « difficulté désirable » (Bjork, 2013) explique que les méthodes qui semblent difficiles pendant l'étude produisent de meilleurs résultats en examen. La facilité pendant l'étude prédit la difficulté en examen, et vice versa.

**Votre objectif aujourd'hui :** remplacez 70 % de votre temps de relecture par des [questions pratiques](${lnk.questions}). C'est le changement le plus impactant que vous puissiez faire.

[Commencez votre préparation](${lnk.questions}) — 30 questions pratiques avec justifications. Comparez ce que vous retenez après ces 30 questions vs 30 minutes de relecture. Vous ne reviendrez jamais à l'ancienne méthode. [Accédez aux leçons](${lnk.lessons}) et aux [examens adaptatifs](${lnk.cat}) pour une préparation complète et active. [Essayez gratuitement](${lnk.pricing}).` },
    ],
    faq: [
      { question: "Dois-je complètement arrêter de lire mes notes?", answer: "Non. La relecture a sa place — elle est utile pour la première exposition à un nouveau concept. Mais elle ne devrait représenter que 20-30 % de votre temps d'étude. Les 70-80 % restants devraient être de la pratique active (questions, simulations, rappel)." },
      { question: "Comment savoir si l'étude active fonctionne?", answer: "Vos scores de questions pratiques augmentent de semaine en semaine. C'est la métrique la plus fiable. Si vous passez à l'étude active et que vos scores stagnent après 3 semaines, le problème est ailleurs (peut-être un sujet spécifique qui bloque)." },
      { question: "L'étude active est-elle efficace pour tous les sujets?", answer: "Oui. Pharmacologie, électrolytes, jugement clinique, délégation — tous les sujets bénéficient de la pratique active. La seule variation est que certains sujets (pharmacologie) demandent aussi un minimum de mémorisation, mais même celle-ci est mieux faite par rappel actif que par relecture." },
    ],
    references: [
      { text: "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest*, 14(1), 4–58." },
      { text: "Karpicke, J. D., & Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying with concept mapping. *Science*, 331(6018), 772–775." },
      { text: "Bjork, R. A., & Bjork, E. L. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In M. A. Gernsbacher et al. (Eds.), *Psychology and the real world*. Worth Publishers." },
    ],
  },
];

// ── Accessors ────────────────────────────────────────────────────────────────

export function getFR3Post(id: string): FR3Post | undefined {
  return FR3_POSTS.find((p) => p.id === id);
}
export function getAllFR3Topics(): FR3Topic[] {
  return FR3_TOPICS;
}
export function getAllFR3SeoMeta() {
  return FR3_TOPICS.map((t) => ({
    id: t.id, locale: t.locale, region: t.region, profession: t.profession,
    exam: t.exam, title: t.metaTitle, description: t.metaDescription, slug: t.slug,
  }));
}
