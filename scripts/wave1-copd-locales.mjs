/**
 * Wave 1 COPD educational overlays — French (Canada), Spanish, Tagalog.
 * Keys: pathwayId:copd-clinical-judgment-gold (slug fixed in copd-gold-standard.ts)
 */
export const SECTION_HEADINGS = {
  fr: {
    clinical_meaning: "Portée clinique",
    exam_relevance: "Pertinence pour l'examen",
    core_concept: "Concept central — physiopathologie et surveillance",
    clinical_scenario: "Scénario clinique",
    takeaways: "Points clés",
  },
  es: {
    clinical_meaning: "Significado clínico",
    exam_relevance: "Relevancia para el examen",
    core_concept: "Concepto central — fisiopatología y vigilancia",
    clinical_scenario: "Escenario clínico",
    takeaways: "Ideas clave",
  },
  tl: {
    clinical_meaning: "Kahulugan sa klinika",
    exam_relevance: "Bakit mahalaga sa exam",
    core_concept: "Core concept — pathophysiology at monitoring",
    clinical_scenario: "Clinical scenario",
    takeaways: "Mga takeaway",
  },
};

export const SHARED_CORE = {
  fr: `**Physiopathologie**  
La BPCO associe un **rétrécissement des petites voies aériennes**, un **piège d'air** et souvent une **toux chronique productive** à une **perte alvéolaire / perte de récoil élastique** — plusieurs clients présentent un mélange. L'obstruction fixe augmente le travail respiratoire dès l'effort ; les **exacerbations** dépassent la variation habituelle, souvent déclenchées par une infection ou des irritants.

**À surveiller**  
Relier **fréquence respiratoire**, **muscles accessoires**, **état de conscience**, **SpO₂** (et le dispositif), **expectorations**, et **traitement de base** (O₂ à domicile, inhalateurs, corticoïdes/antibiotiques récents). Somnolence avec aggravation respiratoire : penser à une **insuffisance ventilatoire aiguë** (y compris rétention de CO₂).

**Soins fréquemment testés**  
Bronchodilatateurs, corticoïdes, antibiotiques si infection suspecte, **oxygène titré selon les ordonnances**, mobilisation précoce si sécuritaire, et **éducation** (inhalation, lèvres pincées, économie d'énergie, arrêt tabagique, vaccination, plan d'exacerbation).`,
  es: `**Fisiopatología**  
La EPOC combina **estrechamiento de vías pequeñas**, **atrapamiento aéreo** y tos crónica frecuente con **pérdida alveolar / pérdida de recoil elástico**; muchos pacientes muestran rasgos mixtos. La obstrucción fija aumenta el trabajo respiratorio con el esfuerzo; las **exacerbaciones** empeoran más allá de la variación habitual (infección, irritantes).

**Vigilancia**  
Integre **frecuencia respiratoria**, **músculos accesorios**, **estado mental**, **SpO₂** (y el dispositivo), **esputo** y **tratamiento basal** (oxígeno domiciliario, inhaladores, corticoides/antibióticos recientes). Somnolencia con empeoramiento respiratorio: piense en **fallo ventilatorio agudo** (incluye retención de CO₂).

**Terapias frecuentes en el examen**  
Broncodilatadores, corticoides, antibióticos si hay sospecha infecciosa, **oxígeno titulado según órdenes**, movilización temprana si es segura, y **educación** (técnica inhaladora, labios fruncidos, ahorro de energía, cesación tabáquica, vacunas, plan de exacerbación).`,
  tl: `**Pathophysiology**  
Ang COPD ay may **makitid na maliliit na daanan ng hangin**, **air trapping**, at madalas **ubo na may plema** kasama ang **pagkawala ng alveoli / elastic recoil** — maraming pasyente ay halo. Ang fixed obstruction ay nagpapataas ng trabaho ng paghinga; ang **exacerbation** ay tuloy-tuloy na paglala, kadalasang sanhi ng impeksiyon o irritant.

**Bantayan**  
Isama ang **respiratory rate**, **accessory muscles**, **mental status**, **SpO₂** (at device), **plema**, at **baseline** (home O₂, inhaler, kamakailang steroid/antibiotic). Pag **tumataas ang CO₂** na may **pagka-antok**: isipin ang **acute ventilatory failure**.

**Mga interbensyon na madalas sa exam**  
Bronchodilator, steroid, antibiotic kung may hinalang impeksiyon, **oxygen ayon sa order/target**, maagang mobilization kung ligtas, at **patient teaching** (inhaler, pursed-lip, energy conservation, smoking cessation, bakuna, plano kailan humingi ng agarang tulong).`,
};

function q(question, options, rationale) {
  return { question, options, rationale };
}

export const COPD_FR = {
    "us-lpn-nclex-pn:copd-clinical-judgment-gold": {
      title: "BPCO : jugement clinique (NCLEX-PN, É.-U.)",
      seoTitle: "BPCO — jugement clinique | NCLEX-PN É.-U. | NurseNest",
      seoDescription:
        "Portée de l'infirmière auxiliaire ou P.V. aux É.-U. : évaluation, délégation sécuritaire, oxygène et bronchodilatateurs selon ordonnance, escalade — sans mélanger avec le jugement réservé à l'IR.",
      sections: {
        clinical_meaning: {
          heading: SECTION_HEADINGS.fr.clinical_meaning,
          body: `**NCLEX-PN (LPN/LVN)** récompense des soins **sûrs et conformes au rôle** : observer et signaler les changements, exécuter les **ordonnances**, renforcer l'enseignement, protéger la délivrance d'oxygène **selon prescription**, et escalader rapidement lorsque les constatations dépassent une BPCO stable.

**Ligne de portée**  
La pratique PN/LVN **varie selon l'État et la politique de l'établissement**. À l'examen, privilégiez les actions qui **restent dans le jeu d'ordonnances / la direction de l'IR** lorsque l'item porte sur la délégation — évitez la titration indépendante, les nouvelles prescriptions ou le diagnostic au-delà du recueil de données infirmières.`,
        },
        exam_relevance: {
          heading: SECTION_HEADINGS.fr.exam_relevance,
          body: `Attendez-vous à la **priorisation** (qui a besoin d'attention en premier), à la **sécurité de l'oxygène liée aux ordonnances**, aux **indices d'infection/exacerbation** et à l'**enseignement** que vous pouvez renforcer. Pièges : faire une **triage de niveau IR** en tant qu'action LPN, **retarder un signalement urgent**, ou des **tâches routinières** avant un **changement respiratoire aigu**.`,
        },
        core_concept: { heading: SECTION_HEADINGS.fr.core_concept, body: SHARED_CORE.fr },
        clinical_scenario: {
          heading: SECTION_HEADINGS.fr.clinical_scenario,
          body: `**Vignette — unité médico-chirurgicale (É.-U.)**  
Votre client a une BPCO avec **2 L/min au nez** selon ordonnance. Vous notez **FR 32**, **position tripod** et **SpO₂ 84 %** au même débit. Le client est anxieux mais éveillé.

**Branche PN**  
Les premiers gestes relèvent de l'**évaluation et de l'escalade dans le cadre des ordres** : réévaluer la délivrance/l'équipement, coacher la **respiration à lèvres pincées**, rester avec le client, et **aviser immédiatement l'IR ou le fournisseur** pour réévaluation et ordonnances possibles. Le modèle d'erreur est d'**augmenter l'oxygène en silence** ou d'administrer des **sédatifs** pour « calmer » une détresse respiratoire non différenciée.`,
        },
        takeaways: {
          heading: SECTION_HEADINGS.fr.takeaways,
          body: `• **Signalez** les changements respiratoires aigus ; ne « attendez pas » face à une désaturation critique.  
• Les changements d'**oxygène** en BPCO exigent en général une **ordonnance/protocole** — votre rôle est une délivrance sécuritaire et une escalade rapide.  
• **Renforcez** l'enseignement prescrit (inhalateurs, lèvres pincées, économie d'énergie, arrêt tabagique).  
• Associez cette leçon à des items **respiratoires / BPCO** filtrés pour votre voie.`,
        },
      },
      preTest: [
        q(
          "Une PN soigne un client en BPCO sous 2 L/min au nez selon ordonnance. La SpO₂ passe de 92 % à 84 % et la fréquence respiratoire augmente. Que doit faire la PN en premier?",
          [
            "Augmenter l'oxygène à 6 L/min sans contacter personne.",
            "Évaluer le client et la délivrance d'oxygène, puis aviser l'IR ou le fournisseur du changement aigu.",
            "Demander au client de dormir à plat pour « reposer le diaphragme ».",
            "Administrer un sédatif PRN pour réduire l'anxiété.",
          ],
          "Évaluer la délivrance et le client, puis escalader pour réévaluation/ordonnances. Augmenter seule l'oxygène ou sédatiser peut être dangereux et sort souvent de la portée PN ; le décubitus dorsal peut aggraver la dyspnée.",
        ),
        q(
          "Quelle affirmation décrit le mieux la respiration à lèvres pincées en BPCO?",
          [
            "Elle augmente surtout la fréquence respiratoire pour éliminer le CO₂.",
            "Elle crée une légère contre-pression pour prolonger l'expiration et réduire le piège d'air.",
            "Elle remplace la bronchodilatation lorsque le client est stable.",
            "Elle ne s'utilise qu'au sommeil, pas à l'effort.",
          ],
          "Les lèvres pincées prolongent l'expiration et peuvent limiter l'effondrement dynamique des voies ; cela ne remplace ni les médicaments ni l'oxygène prescrit.",
        ),
        q(
          "Pendant une exacerbation de BPCO, quel signe la PN doit-elle signaler immédiatement?",
          [
            "Une demande de coussins supplémentaires pour le confort.",
            "Nouvelle confusion ou somnolence croissante avec aggravation du travail respiratoire.",
            "Une SpO₂ stable au niveau habituel à domicile sous oxygène prescrit.",
            "Une sécheresse buccale due à la lunette.",
          ],
          "Altération de l'état de conscience avec détérioration respiratoire : possible insuffisance hypercapnique ou maladie critique — signalement immédiat.",
        ),
      ],
      postTest: [
        q(
          "Quelle action PN soutient le mieux l'enseignement sur la prévention des infections pendant les soins de BPCO?",
          [
            "Encourager la vaccination annuelle contre la grippe lorsqu'elle figure au plan de soins et enseigner l'hygiène des mains.",
            "Dire au client d'arrêter toute activité physique de façon permanente.",
            "Recommander d'arrêter tous les inhalateurs lors d'un rhume.",
            "Conseiller de doubler le débit d'oxygène à domicile dès qu'il se sent fatigué.",
          ],
          "Immunisation et hygiène réduisent les déclencheurs ; l'activité se cadence ; inhalateurs et oxygène suivent la direction clinique.",
        ),
        q(
          "Un client dit : « Je peux fumer un peu ; ça ne change plus rien maintenant. » Meilleure réponse?",
          [
            "Vous avez raison — réduire suffit.",
            "Même de petites expositions entretiennent l'inflammation ; l'arrêt réduit encore les exacerbations — voyons les ressources prévues au plan.",
            "Passez à la vapoteuse seulement ; c'est sans danger.",
            "Les cigares sont filtrés, donc moins pires.",
          ],
          "La fumée de tabac aggrave l'évolution et le risque d'exacerbation ; enseignement factuel et motivationnel dans la portée infirmière.",
        ),
        q(
          "Quelle tâche convient le mieux à la PN lorsque l'IR délègue le renforcement d'un enseignement stable sur la BPCO?",
          [
            "Commander seule un CT urgent pour éliminer une EP.",
            "Observer la technique d'inhalateur et signaler les erreurs pour suivi IR/fournisseur.",
            "Prescrire des changements d'antibiotiques pour expectorations purulentes.",
            "Congédier le client sans collaboration de l'IR.",
          ],
          "Renforcer les habiletés et signaler les lacunes correspond à la portée PN ; prescrire, ordonner seul un diagnostic ou congédier ne l'est pas au NCLEX-PN.",
        ),
      ],
    },
    "ca-rpn-rex-pn:copd-clinical-judgment-gold": {
      title: "BPCO : jugement clinique (REx-PN, Canada)",
      seoTitle: "BPCO — jugement clinique | REx-PN Canada | NurseNest",
      seoDescription:
        "Infirmière praticienne au Canada : évaluation en contexte métrique, portée de l'ordre professionnel, délégation sécuritaire et escalade alignées sur le jugement de type REx-PN.",
      sections: {
        clinical_meaning: {
          heading: SECTION_HEADINGS.fr.clinical_meaning,
          body: `**REx-PN / soins infirmiers pratiques au Canada**  
Les items attendent une **portée définie par l'ordre professionnel**, des **constantes métriques et des laboratoires SI** lorsqu'ils sont présentés, et une escalade nette lorsque les constatations dépassent ce qu'une infirmière praticienne peut entreprendre seule.

**Sens clinique**  
Vous reliez **travail respiratoire**, **oxygénothérapie selon ordonnance**, **indices d'infection/exacerbation** et **éducation du client** — tout en tenant **hors de portée** la prescription indépendante ou la titration non supervisée, sauf si l'énoncé prévoit explicitement un ordre permanent ou un protocole autorisé.`,
        },
        exam_relevance: {
          heading: SECTION_HEADINGS.fr.exam_relevance,
          body: `Recherchez la **priorisation**, la **communication thérapeutique**, l'**administration sécuritaire** et le **moment d'aviser l'IR/IP/physicien**. Piège fréquent : confondre les actions **IPR** avec une **évaluation primaire d'IR** ou suggérer des **changements d'oxygène en silence** sans ordonnance.`,
        },
        core_concept: { heading: SECTION_HEADINGS.fr.core_concept, body: SHARED_CORE.fr },
        clinical_scenario: {
          heading: SECTION_HEADINGS.fr.clinical_scenario,
          body: `**Vignette — unité de soins actifs (Canada)**  
Une IPR a un client en BPCO avec **oxygène à faible débit prescrit**. En une heure, la **FR augmente**, la **SpO₂ baisse** au même débit, le client adopte une **posture tripod**.

**Branche IPR**  
Réévaluer l'équipement et le client, favoriser une **position confortable**, coacher la **respiration à lèvres pincées** et **aviser l'IR** pour réévaluation et ordonnances possibles. Éviter la **titration indépendante d'oxygène** sauf protocole clair.`,
        },
        takeaways: {
          heading: SECTION_HEADINGS.fr.takeaways,
          body: `• Les données **métriques** et les **contextes de soins canadiens** peuvent apparaître — même logique de jugement : évaluer → escalader si instable.  
• Les **normes de l'ordre professionnel** encadrent ce que vous pouvez initier ; en cas de doute, privilégiez la **collaboration** plutôt que des changements de niveau prescription seule.  
• Renforcez **arrêt tabagique**, **immunisation** et **plans d'action en exacerbation** dans votre rôle.  
• Enchaînez avec des items **REx-PN** respiratoires après ce bloc.`,
        },
      },
      preTest: [
        q(
          "Une IPR note une SpO₂ de 86 % sous oxygène prescrit chez un client en BPCO, avec travail respiratoire accru. Quelle est la meilleure action initiale?",
          [
            "Augmenter seule le débit d'oxygène pour maximiser la saturation.",
            "Réévaluer la délivrance et le client, aviser l'IR, et suivre ordonnances/protocoles.",
            "Demander au client de marcher dans le corridor pour mobiliser les sécrétions.",
            "Documenter seulement et réévaluer dans deux heures.",
          ],
          "Réévaluer et escalader ; la titration non supervisée peut être inappropriée sans ordonnance/protocole. La marche peut aggraver la détresse ; retarder le signalement est dangereux.",
        ),
        q(
          "Quel signe commande un signalement immédiat en exacerbation de BPCO?",
          [
            "Légère toux sèche sans changement des constantes.",
            "Confusion croissante avec motif de rétention de CO₂ et somnolence aggravée.",
            "Demande d'une deuxième couverture.",
            "Appétit stable avec oxygène habituel.",
          ],
          "Altération de l'état de conscience avec schéma d'insuffisance ventilatoire : escalade d'urgence.",
        ),
        q(
          "L'enseignement sur l'économie d'énergie en BPCO doit mettre l'accent sur quel principe?",
          [
            "Regrouper les activités avec des périodes de repos planifiées.",
            "Effectuer tous les soins rapidement sans pause.",
            "Éviter toute activité physique de façon permanente.",
            "Éliminer les bronchodilatateurs pour alléger la charge médicamenteuse.",
          ],
          "Le rythme réduit la dyspnée ; supprimer brutalement des médicaments prescrits est dangereux.",
        ),
      ],
      postTest: [
        q(
          "Quelle formulation reflète une langage correct de portée IPR au Canada pour les changements d'oxygène?",
          [
            "Je titille l'oxygène vers ma cible personnelle sans documenter.",
            "Je suis les ordonnances/protocoles autorisés et je collabore lorsque le client se déstabilise.",
            "Je prescris des antibiotiques dès que l'expectoration change de couleur.",
            "Je congédie les clients lorsqu'ils se sentent mieux.",
          ],
          "Collaboration et protocoles autorisés préservent la portée ; prescrire et congédier seule ne correspond pas à ce cadrage.",
        ),
        q(
          "Pourquoi la respiration à lèvres pincées est-elle utile en BPCO?",
          [
            "Elle accélère l'expiration pour augmenter le CO₂.",
            "Elle peut prolonger l'expiration et limiter l'effondrement dynamique des voies.",
            "Elle remplace l'oxygénothérapie.",
            "Elle ne sert que pour l'asthme, pas la BPCO.",
          ],
          "Mécanique du piège d'air ; cela complète — ne remplace pas — les thérapies ordonnées.",
        ),
        q(
          "Un client en BPCO développe fièvre, expectorations purulentes et dyspnée accrue. À quoi l'IPR doit-elle s'attendre dans des soins collaboratifs?",
          [
            "Ignorer les constantes parce que les clients en BPCO ont toujours de la fièvre.",
            "Surveiller étroitement constantes et statut respiratoire et signaler rapidement les constatations.",
            "Arrêter les liquides pour réduire les sécrétions.",
            "Couper l'oxygène pour favoriser des inspirations plus profondes.",
          ],
          "L'exacerbation peut nécessiter une réévaluation et des changements thérapeutiques ; surveillance et signalement sont au cœur du rôle IPR.",
        ),
      ],
    },
    "us-rn-nclex-rn:copd-clinical-judgment-gold": {
      title: "BPCO : jugement clinique (NCLEX-RN, É.-U.)",
      seoTitle: "BPCO — jugement clinique | NCLEX-RN É.-U. | NurseNest",
      seoDescription:
        "Contexte IR aux É.-U. : cibles d'oxygénation, prise en charge d'exacerbation, sécurité avec rétention de CO₂, priorisation et éducation du patient.",
      sections: {
        clinical_meaning: {
          heading: SECTION_HEADINGS.fr.clinical_meaning,
          body: `**NCLEX-RN** teste le **jugement clinique** : qui a besoin de vous en premier, quelle évaluation clarifie le risque, et quelle intervention correspond à la **physiopathologie** et aux **ordonnances**.

Pour la BPCO, attendez-vous aux **cibles d'oxygénation** (souvent **titrer vers une plage de SpO₂ prescrite**, fréquemment **~88–92 %** lorsque c'est le plan — pas un chiffre isolé de l'énoncé), au **moment des bronchodilatateurs/stéroïdes/antibiotiques**, à la **mobilisation précoce si stable**, et aux indices d'**insuffisance ventilatoire** (somnolence, CO₂ croissant) exigeant une escalade rapide.`,
        },
        exam_relevance: {
          heading: SECTION_HEADINGS.fr.exam_relevance,
          body: `Modèles à haut rendement : **priorisation** entre plusieurs clients, **administration sécuritaire d'oxygène**, chevauchement **infection vs insuffisance cardiaque**, **enseignement** qui démontre la compréhension, et **éviter la sédation** qui masque l'insuffisance respiratoire.`,
        },
        core_concept: { heading: SECTION_HEADINGS.fr.core_concept, body: SHARED_CORE.fr },
        clinical_scenario: {
          heading: SECTION_HEADINGS.fr.clinical_scenario,
          body: `**Vignette — salle d'urgence en attente**  
Un adulte de 68 ans avec BPCO présente **toux accrue**, **expectorations purulentes**, **38,3 °C**, **FR 30**, **SpO₂ 86 % à l'air ambiant**. Éveillé mais fatigué.

**Branche IR**  
Votre séquence suit ordonnances/protocoles : **oxygène vers la cible prescrite**, **accès IV si ordonné**, **laboratoires/gaz artériels si ordonnés**, **bronchodilatateurs**, **positionnement**, **surveillance rapprochée** pour une narcosis au CO₂ si les besoins en O₂ augmentent. Le piège est la **paperasse routinière** ou les **médicaments de routine** avant **oxygénation et préparation à l'escalade**.`,
        },
        takeaways: {
          heading: SECTION_HEADINGS.fr.takeaways,
          body: `• Associez **SpO₂** au **travail respiratoire et à l'état mental** — pas un nombre seul.  
• Paquets d'**exacerbation** : O₂ selon le plan, médicaments, surveillance, contrôle des infections, mobilisation si sécuritaire.  
• **Enseignez** les signes d'alerte d'exacerbation et l'usage correct des dispositifs.  
• Enchaînez avec un **bloc respiratoire chronométré** dans votre banque.`,
        },
      },
      preTest: [
        q(
          "Quelle intervention est la priorité absolue pour un client en exacerbation aiguë de BPCO avec SpO₂ 86 % à l'air ambiant et détresse modérée?",
          [
            "Terminer l'enseignement de congé sur le régime pauvre en sodium.",
            "Appliquer l'oxygène selon ordonnance/protocole et évaluer la réponse, en préparant une escalade si insuffisant.",
            "Planifier d'abord les soins de plaies en autre unité.",
            "Encourager un exercice vigoureux pour mobiliser les sécrétions.",
          ],
          "Traiter d'abord l'hypoxémie et la détresse potentiellement mortelles selon les ordres ; le reste est secondaire tant que la stabilité n'est pas établie.",
        ),
        q(
          "Quelle constatation suggère le mieux une insuffisance ventilatoire aiguë chez un client en BPCO recevant de l'oxygène?",
          [
            "Demande d'un plat préféré.",
            "Somnolence croissante, céphalées et motif de rétention de CO₂ / acidose aux gaz.",
            "SpO₂ stable à la cible prescrite avec parole facile.",
            "Anxiété légère sans changement des constantes.",
          ],
          "CO₂ croissant avec altération de l'état de conscience : drapeau rouge pour insuffisance respiratoire et intervention urgente.",
        ),
        q(
          "L'enseignement pour la prise en charge à domicile de la BPCO doit inclure quel élément?",
          [
            "Arrêter les inhalateurs dès l'amélioration des symptômes.",
            "Plan écrit d'exacerbation : quand appeler la clinique vs le 911.",
            "Éviter toutes les vaccins par crainte de poussées.",
            "Sédatifs au coucher pour le sommeil sans évaluation respiratoire.",
          ],
          "Plans d'action et immunisation appropriées réduisent les méfaits ; sédatifs PRN sans bilan respiratoire sont risqués.",
        ),
      ],
      postTest: [
        q(
          "Pourquoi un oxygène à haut débit peut-il être risqué chez certains clients en BPCO sans surveillance attentive?",
          [
            "Il guérit toujours l'hypercapnie.",
            "Il peut aggraver la rétention de CO₂ et la sédation chez les sujets sensibles — surveiller l'état mental et les gaz selon les ordres.",
            "Il n'est jamais utilisé en BPCO.",
            "Il n'affecte que la fréquence cardiaque, pas la ventilation.",
          ],
          "Les besoins en O₂ varient ; surveillez la narcosis au CO₂ et suivez les protocoles de titration.",
        ),
        q(
          "Quelle affirmation du client montre une compréhension de la respiration à lèvres pincées?",
          [
            "Je souffle vite pour éliminer le CO₂.",
            "J'inspire par le nez et j'expire lentement par les lèvres pincées pour contrôler l'expiration.",
            "Je retiens ma respiration le plus longtemps possible chaque minute.",
            "Je l'utilise à la place de mon bronchodilatateur.",
          ],
          "Expiration lente et contrôlée ; les bronchodilatateurs restent une thérapie prescrite.",
        ),
        q(
          "Lors du rapport de quart, quel client en BPCO l'IR doit-elle évaluer en premier?",
          [
            "Client devant la télé avec constantes stables sous 2 L/min.",
            "Client avec nouvelle confusion, FR 32 et SpO₂ en baisse malgré l'oxygène.",
            "Client qui demande un réglage d'oreiller avec SpO₂ stable.",
            "Client qui demande des glaçons avec mentation normale.",
          ],
          "Changement aigu d'oxygénation et de conscience avant les demandes de confort.",
        ),
      ],
    },
    "ca-rn-nclex-rn:copd-clinical-judgment-gold": {
      title: "BPCO : jugement clinique (NCLEX-RN, Canada)",
      seoTitle: "BPCO — jugement clinique | NCLEX-RN Canada | NurseNest",
      seoDescription:
        "Contexte IR au Canada : exacerbation de BPCO, cibles d'oxygène, détection d'insuffisance ventilatoire et priorisation façon NCLEX-RN.",
      sections: {
        clinical_meaning: {
          heading: SECTION_HEADINGS.fr.clinical_meaning,
          body: `**NCLEX-RN (Canada)**  
Les items évaluent le **jugement clinique** : qui voir en premier, quelles données confirment le risque, et quelle action correspond aux **ordonnances** et aux **normes provinciales / de l'établissement**.

Pour la BPCO : **stratégie d'oxygénation selon l'ordonnance**, reconnaissance d'**exacerbation**, signes de **défaillance ventilatoire** (somnolence, acidose/CO₂ si gaz) et **enseignement** adapté au client.`,
        },
        exam_relevance: {
          heading: SECTION_HEADINGS.fr.exam_relevance,
          body: `Même **épine dorsale de priorisation** que les items américains, avec parfois des **unités SI**, des **libellés canadiens** et le vocabulaire du **rôle infirmier**. Piège typique : tâches **routinières** ou enseignement de **congé** avant **stabilité respiratoire**.`,
        },
        core_concept: { heading: SECTION_HEADINGS.fr.core_concept, body: SHARED_CORE.fr },
        clinical_scenario: {
          heading: SECTION_HEADINGS.fr.clinical_scenario,
          body: `**Milieu hospitalier (Canada)**  
Client connu pour BPCO : **dyspnée croissante**, **expectorations purulentes**, **38,1 °C**, **FR 28**, **SpO₂ 88 %** à **2 L/min** selon ordonnance.

**Piste IR**  
Réévaluer la **délivrance d'oxygène et la réponse**, aviser **IP/physicien** pour hausse probable des thérapies, exécuter les **bronchodilatateurs / stéroïdes / antibiotiques** prescrits, surveiller la **rétention de CO₂** si les besoins en O₂ augmentent. Éviter le **congé** avant **stabilité**.`,
        },
        takeaways: {
          heading: SECTION_HEADINGS.fr.takeaways,
          body: `• Relire les **unités canadiennes** ; raisonner sur les données présentes, pas sur des seuils mémorisés hors contexte.  
• **Stabilité d'abord** : voies aériennes, respiration, circulation, puis confort.  
• Lier **infection** et **oxygénation** avec surveillance rapprochée.  
• Enchaînez avec des **items respiratoires** filtrés Canada IR dans la banque.`,
        },
      },
      preTest: [
        q(
          "Une IR au Canada s'occupe d'un client en exacerbation de BPCO avec SpO₂ 88 % sous oxygène actuel. Quelle est la priorité?",
          [
            "Terminer la documentation d'une erreur médicamenteuse d'un quart antérieur.",
            "Évaluer l'état respiratoire et la thérapie en O₂, puis collaborer pour des ajustements selon protocole ou ordonnance.",
            "Commencer la planification de congé pour le lendemain.",
            "Proposer un entraînement à haute intensité dans le corridor.",
          ],
          "Stabiliser et faire évoluer les soins selon les ordres ; la documentation et le congé passent après le risque immédiat.",
        ),
        q(
          "Quel signe doit déclencher une réévaluation urgente lors d'une exacerbation de BPCO?",
          [
            "Mentation stable avec amélioration de la SpO₂ après thérapie ordonnée.",
            "Nouvelle confusion et somnolence croissante avec travail respiratoire accru.",
            "Lecture d'un livre avec 2 L/min au nez.",
            "Légère toux sèche sans changement des constantes.",
          ],
          "Altération de la conscience avec détérioration respiratoire : possible hypercapnie — réévaluation immédiate.",
        ),
        q(
          "L'enseignement sur l'autogestion de la BPCO au Canada doit insister sur :",
          [
            "Arrêter les stéroïdes dès que le client se sent mieux.",
            "Reconnaître les déclencheurs d'exacerbation et quand consulter en urgence.",
            "Éviter toute activité de façon permanente.",
            "Emprunter l'inhalateur d'un proche si le sien est vide.",
          ],
          "Plans d'action et observance ; les médicaments d'entretien réduisent les poussées ; l'activité se cadence, ne s'abolit pas.",
        ),
      ],
      postTest: [
        q(
          "Concernant l'oxygène en BPCO, quelle formulation est la plus juste pour un raisonnement d'examen?",
          [
            "Viser systématiquement 100 % de SpO₂ chez tout le monde.",
            "Titrer selon les cibles prescrites ; surveiller la rétention de CO₂ chez les clients à risque.",
            "L'oxygène est contre-indiqué dans toute BPCO.",
            "La lunette nasale ne nécessite jamais d'humidification ni de soins de peau.",
          ],
          "Objectifs individualisés et surveillance ; les absolutismes sont souvent faux.",
        ),
        q(
          "Le client dit : « J'ai arrêté mon inhalateur parce que je me sentais bien. » Meilleure réponse?",
          [
            "Tant mieux — les médicaments ne servent qu'en cas de crise.",
            "Les traitements d'entretien contrôlent souvent l'inflammation et le bronchospasme même quand vous allez bien ; arrêter peut déclencher des poussées — revoyons votre schéma avec l'équipe.",
            "Passez aux vapeurs seulement.",
            "Doublez la dose la semaine prochaine sans en parler à un clinicien.",
          ],
          "Thérapie d'entretien et adhérence ; enseignement sans modifier seule une prescription.",
        ),
        q(
          "Quelle tâche peut être déléguée au personnel auxiliaire compétent pendant des soins stables de BPCO?",
          [
            "Interpréter seule les gaz du sang et modifier l'oxygène.",
            "Mesurer et consigner les constantes et signaler les anomalies.",
            "Enseigner de novo la technique d'inhalateur sans vérification.",
            "Poser un diagnostic aux fins de facturation.",
          ],
          "Collecte de données avec signalement : oui ; interprétation clinique et ordonnances : non.",
        ),
      ],
    },
    "us-np-fnp:copd-clinical-judgment-gold": {
      title: "BPCO : jugement en soins primaires (IPF/FNP, É.-U.)",
      seoTitle: "BPCO en soins primaires | IPF/FNP É.-U. | NurseNest",
      seoDescription:
        "Cadrage IPF adulte : concepts inspirés de GOLD, tri des exacerbations, différentiels vs ICC/EP, décision partagée et escalade sécuritaire.",
      sections: {
        clinical_meaning: {
          heading: SECTION_HEADINGS.fr.clinical_meaning,
          body: `**IPF / soins primaires adultes**  
Vous intégrez **l'histoire**, le **contexte spirométrique lorsqu'il est disponible**, la **charge comorbide**, le **risque infectieux** et le **statut fonctionnel** dans un plan qui correspond à la **prise en charge fondée sur les données** de la BPCO et à votre **entente collaborative**.

En style « item », mettez l'accent sur la **stratification du risque** (antécédents d'exacerbation, hospitalisations), les concepts de **montée/descente pharmacologique**, les **ancres non médicamenteuses** (arrêt tabagique, vaccins, réadaptation pulmonaire) et **quand l'urgence est plus sûre que des « ajustements au téléphone »**.`,
        },
        exam_relevance: {
          heading: SECTION_HEADINGS.fr.exam_relevance,
          body: `Recherchez la **différenciation** (exacerbation de BPCO vs **ICC aiguë** vs **drapeaux rouges d'EP**), les **examens appropriés**, les **décisions antibiotique/stéroïde** alignées sur les lignes directrices, la **sécurité de l'oxygène** et le **conseil centré sur la personne** sans franchir vers des actions non sécuritaires hors rôle.`,
        },
        core_concept: { heading: SECTION_HEADINGS.fr.core_concept, body: SHARED_CORE.fr },
        clinical_scenario: {
          heading: SECTION_HEADINGS.fr.clinical_scenario,
          body: `**Suivi externe après passage aux urgences**  
Un adulte de 62 ans avec BPCO revient après **corticothérapie orale et antibiotiques** pour exacerbation. Il a encore **dyspnée après un pâté de maisons**, **expectorations quotidiennes** et **deux visites aux urgences cette année**.

**Branche IPF**  
Vous optimisez la **thérapie de contrôle**, la **technique d'inhalateur**, l'**arrêt tabagique**, les **vaccins**, la **réadaptation pulmonaire** et un plan écrit d'**exacerbation**. Vous **signalez** syncope, **hypoxémie de repos sévère**, **changement rapide de l'état mental** ou **hémoptysie** pour une évaluation urgente. Le piège est de **minimiser des exacerbations fréquentes** comme « normales » sans intensifier la prévention.`,
        },
        takeaways: {
          heading: SECTION_HEADINGS.fr.takeaways,
          body: `• Traitez les **exacerbations** comme des événements à prévenir : vaccins, arrêt tabagique, réadaptation, schéma d'inhalateurs optimisé et consignes de secours claires.  
• Gardez le **diagnostic différentiel** actif quand la dyspnée s'aggrave (EP, SCA, ICC, pneumothorax).  
• **Documentez** les décisions partagées et les intervalles de suivi.  
• Utilisez des questions de pratique de **niveau IP** qui testent la **synthèse de gestion**.`,
        },
      },
      preTest: [
        q(
          "Quel élément d'histoire milite le plus pour intensifier la thérapie d'entretien de la BPCO en soins primaires?",
          [
            "Une seule exacerbation il y a dix ans.",
            "Exacerbations répétées ou hospitalisations dans l'année malgré la thérapie de base.",
            "Appendicectomie à distance.",
            "Céphalées légères occasionnelles sans symptômes respiratoires.",
          ],
          "Les exacerbations fréquentes orientent vers une escalade fondée sur les lignes directrices et des soutiens non pharmacologiques.",
        ),
        q(
          "Un client en BPCO développe une douleur thoracique pleuritique aiguë, un gonflement unilatéral de jambe et de la tachypnée. Quelle est la meilleure priorité initiale?",
          [
            "Augmenter seule la dose d'ICS à domicile.",
            "Reconnaître une possible EP/SCA et orienter vers une évaluation d'urgence.",
            "Doubler indéfiniment l'oxygène à domicile sans évaluation.",
            "Reporter l'évaluation de deux semaines.",
          ],
          "Symptômes cardiopulmonaires drapeaux rouges : évaluation urgente ; ne pas gérer comme simple réglage de BPCO.",
        ),
        q(
          "Quelle intervention a le plus fort impact à long terme sur mortalité et morbidité chez les fumeurs en BPCO?",
          [
            "Albuterol occasionnel sans arrêt tabagique.",
            "Arrêt tabac durable avec counseling et pharmacothérapie lorsque approprié.",
            "Sédatifs quotidiens pour l'anxiété.",
            "Éviter définitivement tout exercice.",
          ],
          "L'arrêt tabagique reste fondamental ; sédatifs et inactivité sont des schémas nocifs.",
        ),
      ],
      postTest: [
        q(
          "Quel élément doit figurer dans un plan d'action d'exacerbation pour les patients de soins primaires appropriés?",
          [
            "Doubler en secret les antibiotiques empruntés à un proche.",
            "Seuils clairs pour débuter stéroïdes/antibiotiques oraux de secours lorsque prescrits, et quand appeler le 911.",
            "Arrêter tous les inhalateurs durant les rhumes.",
            "Éviter la vaccination contre la grippe par crainte infondée.",
          ],
          "Plans écrits réduisent les méfaits ; emprunts ad hoc et refus de vaccins augmentent le risque.",
        ),
        q(
          "Pourquoi référer les patients éligibles en réadaptation pulmonaire?",
          [
            "Elle remplace toutes les médications.",
            "Elle améliore souvent dyspnée, capacité d'exercice et qualité de vie.",
            "Elle ne sert qu'après greffe pulmonaire.",
            "Elle guérit l'emphysème.",
          ],
          "La réadaptation pulmonaire est un adjuvant fondé sur les données ; elle ne remplace pas la pharmacothérapie.",
        ),
        q(
          "Quelle constatation en cabinet justifie le plus une escalade le jour même ou l'orientation aux urgences?",
          [
            "Marche stable depuis le stationnement sans détresse.",
            "SpO₂ de repos dans les années 70 % malgré oxygène prescrit et symptômes aigus.",
            "Fatigue légère après une journée de travail avec constantes stables.",
            "Demande de billet d'absence sans changement respiratoire.",
          ],
          "Hypoxémie sévère au repos avec maladie aiguë : motif d'urgence.",
        ),
      ],
    },
};
