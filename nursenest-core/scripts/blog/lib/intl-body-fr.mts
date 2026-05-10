/** French long-form sections (native terminology; placeholders §T§ §E§ §N§). */
export function frSectionBlocks(ctx: { topicPhrase: string; examFrame: string; n: number }): string[] {
  const { topicPhrase: T, examFrame: E, n: N } = ctx;
  const sub = (s: string) => s.replace(/§T§/g, T).replace(/§E§/g, E).replace(/§N§/g, String(N));
  return [
    sub(`<h2>Introduction</h2>
<p>Cette ressource éducative relie §T§ aux priorités d’évaluation, de communication et de sécurité patient fréquemment testées dans §E§. Elle ne remplace ni les protocoles locaux ni la supervision clinique ; elle sert de trame d’étude pour les candidats comparant plusieurs systèmes de santé.</p>
<p>Le fil conducteur reste explicite : repérer le risque, documenter avec précision, escalader à temps et éduquer le patient lorsque l’état le permet. Les examens présentent ces étapes comme des décisions séquentielles plutôt que comme des listes hors contexte.</p>
<p>L’index §N§ rappelle que la profondeur vient de répéter le même cadre clinique avec des nuances différentes : interactions médicamenteuses, barrières culturelles, contraintes de ressources et travail interprofessionnel.</p>`),
    sub(`<h2>Points clés</h2>
<ul>
  <li>§T§ s’intègre dans des choix de priorisation : d’abord la stabilité hémodynamique et la voie aérienne si nécessaire, puis les causes réversibles et l’éducation.</li>
  <li>La documentation doit refléter des signes objectifs, les interventions et la réponse du patient ; les jurys valorisent la traçabilité.</li>
  <li>La pharmacothérapie impose de vérifier allergies, fonction rénale/hépatique et redondances thérapeutiques avant administration ou proposition d’ajustement.</li>
  <li>L’éducation thérapeutique doit utiliser un langage vérifiable et tester la compréhension, surtout lors des transitions de soins.</li>
  <li>La préparation à §E§ progresse avec des cas qui obligent à comparer deux actions raisonnables et à justifier la plus sûre.</li>
</ul>`),
    sub(`<h2>Vue clinique et liens avec l’examen</h2>
<p>Dans §E§, les items mélangent souvent données partielles et leurres plausibles. Pour §T§, adoptez un script : identifier le déficit physiologique principal, anticiper les complications et aligner l’intervention sur le périmètre légal du rôle infirmier du pays cible.</p>
<p>Les référentiels de sécurité (checklists, double vérification, délais pour antibiotiques ou reperfusion) sont des attentes implicites. Nommez le principe de sécurité avant de choisir l’option technique.</p>
<p>La communication avec médecins et thérapeutes doit être concise : situation, antécédents pertinents, évaluation ciblée et recommandation infirmière lorsque le format le permet.</p>
<p>Enfin, l’éthique et le consentement éclairé structurent les réponses lorsque l’autonomie entre en tension avec un danger immédiat ; entraînez-vous sur des vignettes courtes.</p>`),
    sub(`<h2>Physiopathologie lorsque pertinente pour §T§</h2>
<p>La physiopathologie guide l’observation : quel signe annonce quel mécanisme. Pour §T§, reliez dérèglements hémodynamiques, équilibre acido-basique, inflammation ou dysfonction d’organe cible aux paramètres surveillés au lit.</p>
<p>Inutile de mémoriser chaque cascade moléculaire ; utile en revanche de comprendre les compensations pour interpréter des tendances de surveillance et de biologie.</p>
<p>Les examens aiment les mécanismes expliquant un résultat inattendu après une intervention ; entraînez ce lien pour éviter les réponses impulsives.</p>
<p>Si le focus est pédiatrique ou gériatrique, ajustez les seuils attendus et documentez fragilité ou comorbidités.</p>`),
    sub(`<h2>Priorités d’évaluation</h2>
<p>Commencez par ABC en cas d’instabilité ; poursuivez avec les systèmes pertinents pour §T§ selon inspection, palpation, auscultation et surveillance protocolaire.</p>
<p>Enregistrez douleur, conscience, diurèse, travail respiratoire et marqueurs de perfusion. Pour les données subjectives, citez les propos du patient et l’échelle utilisée.</p>
<p>Intégrez score d’alerte et voie d’escalade si elles existent ; l’examen vérifie que vous reconnaissez la détérioration et le canal de signalement.</p>
<p>Prenez en compte déterminants psychosociaux et linguistiques ; le jugement culturel responsable fait partie des soins sûrs.</p>`),
    sub(`<h2>Interventions infirmières et coordination</h2>
<p>Les interventions doivent être spécifiques, horodatées et évaluables. Pour §T§, décrivez positionnement, oxygénothérapie, accès veineux, préparation médicamenteuse, surveillance post-acte et éducation lorsque pertinent.</p>
<p>La coordination interprofessionnelle inclut lever l’ambiguïté des prescriptions et sécuriser les transmissions lors des transferts.</p>
<p>Prévention des infections et technique aseptique sont transversales ; intégrez-les même quand l’item semble centré sur la pharmacologie.</p>
<p>Documentez événements indésirables et actions correctives avec des faits observables et des horodatages.</p>`),
    sub(`<h2>Pharmacologie et médicaments associés</h2>
<p>Vérifiez nom, dose, voie, fréquence et contre-indications relatives. Pour §T§, attention aux ajustements selon poids, âge, grossesse ou insuffisance d’organe.</p>
<p>Évaluez interactions avec traitements domiciliaires et compléments ; questionnez ouvertement et confirmez avec les ressources institutionnelles.</p>
<ul>
  <li>Double contrôle pour médicaments à haut risque.</li>
  <li>Information sur effets indésirables fréquents et signaux d’alerte.</li>
  <li>Réconciliation à l’admission, au transfert et à la sortie.</li>
</ul>
<p>À l’examen, la bonne réponse s’aligne souvent sur les politiques de sécurité et les synthèses de recommandations.</p>`),
    sub(`<h2>Éducation du patient et de l’entourage</h2>
<ol>
  <li>§T§ : expliquer en langage clair la surveillance à domicile et comment relever des signes si indiqué.</li>
  <li>Vérifier la compréhension par démonstration inverse lorsqu’il y a dispositifs ou pansements.</li>
  <li>Proposer supports accessibles et temps pour questions ; noter barrières sensorielles ou cognitives.</li>
  <li>Mobiliser travail social ou interprétariat si risque social ou écart linguistique majeur.</li>
  <li>Rappeler critères de réconsultation précoce et canal de contact approprié.</li>
</ol>`),
    sub(`<h2>Jugement clinique et priorisation</h2>
<p>Face à deux actions raisonnables, choisissez d’abord celle qui supprime un risque vital ou prévient un dommage immédiat. §T§ se prête aux questions de triage par données hétérogènes.</p>
<p>Évitez l’ancrage : réévaluez quand les symptômes évoluent ou après une intervention. Formalisez le raisonnement dans des notes d’étude.</p>
<p>Intégrez l’éthique : confidentialité, équité et respect de l’autonomie dans les limites légales du pays d’exercice.</p>`),
    sub(`<h2>Révision express pour l’examen</h2>
<ul>
  <li>Signaux durs de détérioration liés à §T§ et escalade associée.</li>
  <li>Documentation minimale prouvant continuité et sécurité.</li>
  <li>Éducation vérifiable sans stéréotypes culturels.</li>
  <li>Travail en équipe et communication structurée.</li>
  <li>Réconciliation et surveillance médicamenteuse aux transitions.</li>
</ul>`),
    sub(`<h2>Approfondissement : sécurité et continuité</h2>
<p>La continuité se lit dans des notes compréhensibles par un collègue de garde : ce qui a changé, pourquoi, ce qui a été tenté et le plan si aggravation. Pour §T§, évitez les qualificatifs vagues (“stable”) sans données ; préférez tendances tensionnelles, bilan hydrique ou marqueurs pertinents.</p>
<p>La sécurité inclut ergonomie, prévention des chutes et intégrité cutanée. Dans §E§, ces thèmes reviennent comme “deuxième meilleure réponse” lorsque la première couvre déjà le danger immédiat.</p>
<p>Enfin, considérez l’équité d’accès à l’analgésie, à l’interprétation et au soutien social ; documentez faits observés et préférences du patient avec précision.</p>`),
    sub(`<h2>Approfondissement : communication de crise et limites éthiques</h2>
<p>En crise, un ton posé et une formulation technique brève réduisent l’erreur. Entraînez l’assertivité (“besoin d’avis immédiat pour hypotension symptomatique liée à §T§”) et la relecture lorsque le canal est téléphonique.</p>
<p>Les limites éthiques incluent le refus d’exécuter un acte jugé dommageable dans votre cadre légal, avec escalade institutionnelle appropriée. Les examens valorisent la protection du patient dans le respect des procédures.</p>
<p>Terminez chaque vignette par une ligne d’apprentissage : ce que vous surveilleriez différemment demain. Cela transforme §T§ en expérience cumulée plutôt qu’en mémorisation fragile.</p>`),
  ];
}
