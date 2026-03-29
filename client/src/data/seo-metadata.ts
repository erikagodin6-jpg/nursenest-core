export interface LocalizedSEOEntry {
  title: string;
  description: string;
  keywords: string;
}

export type SEOLocale = "fr" | "es" | "zh" | "zh-tw" | "ar" | "hi" | "ko" | "pa" | "vi" | "ht" | "ur" | "ja" | "fa" | "de" | "pt" | "fil" | "th" | "tr" | "id";

const frenchMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – Préparation Examen Infirmier | Questions NCLEX & Banque de Questions",
    description: "Préparez vos examens infirmiers avec NurseNest. Accédez à des milliers de questions pratique NCLEX, des simulations cliniques, des cartes mémoire infirmière et des leçons de pathophysiologie. Pour étudiants RPN, RN et NP au Canada et aux États-Unis.",
    keywords: "questions pratique NCLEX, préparation examen infirmier, banque de questions infirmières, cartes mémoire infirmière, révision NCLEX, simulations cliniques, pathophysiologie soins infirmiers, examen infirmier Canada",
  },
  "/pricing": {
    title: "Tarifs & Forfaits | NurseNest – Préparation Examen Infirmier",
    description: "Comparez les forfaits NurseNest pour la préparation aux examens infirmiers. Accès gratuit inclus. Forfaits mensuels abordables avec banque de questions NCLEX, simulations cliniques et cartes mémoire.",
    keywords: "tarifs NurseNest, forfaits préparation NCLEX, prix examen infirmier, abonnement révision NCLEX, préparation examen infirmier prix",
  },
  "/lessons": {
    title: "Leçons Cliniques – Pathophysiologie & Soins Infirmiers | NurseNest",
    description: "Explorez nos leçons cliniques approfondies couvrant la pathophysiologie, la pharmacologie et le raisonnement clinique. Contenu structuré par système corporel pour RPN, RN et NP.",
    keywords: "leçons soins infirmiers, pathophysiologie infirmière, cours cliniques, raisonnement clinique, pharmacologie infirmière, révision NCLEX leçons",
  },
  "/flashcards": {
    title: "Cartes Mémoire Infirmière – Pharmacologie & Révision | NurseNest",
    description: "Étudiez avec des cartes mémoire infirmière vérifiées cliniquement. Pharmacologie, valeurs de laboratoire et pathophysiologie avec modes Apprendre et Test. Créez vos propres paquets.",
    keywords: "cartes mémoire infirmière, flashcards pharmacologie, révision NCLEX cartes, cartes mémoire soins infirmiers, étude infirmière",
  },
  "/mock-exams": {
    title: "Examens Simulés NCLEX – Simulation Chronométrée | NurseNest",
    description: "Simulez les conditions réelles d'examen avec nos examens simulés NCLEX chronométrés. Sélection adaptative de questions, suivi de performance et justifications détaillées.",
    keywords: "examens simulés NCLEX, simulation examen infirmier, examen pratique chronométré, préparation examen infirmier, test blanc NCLEX",
  },
  "/test-bank": {
    title: "Banque de Questions Infirmières – Questions Pratique NCLEX | NurseNest",
    description: "Accédez à notre banque de questions infirmières complète. Filtrez par système corporel, niveau et sujet. Chaque question inclut des justifications détaillées pour la révision NCLEX.",
    keywords: "banque de questions infirmières, questions pratique NCLEX, QCM infirmier, banque de tests soins infirmiers, questions examen infirmier",
  },
  "/question-bank": {
    title: "Banque de Questions Infirmières – Questions Pratique NCLEX | NurseNest",
    description: "Accédez à notre banque de questions infirmières complète. Filtrez par système corporel, niveau et sujet. Chaque question inclut des justifications détaillées pour la révision NCLEX.",
    keywords: "banque de questions infirmières, questions pratique NCLEX, QCM infirmier, banque de tests soins infirmiers, questions examen infirmier",
  },
  "/simulators": {
    title: "Simulateurs Cliniques – Scénarios Interactifs | NurseNest",
    description: "Pratiquez le jugement clinique avec des simulateurs interactifs. Scénarios de patients ramifiés incluant sepsis, infarctus du myocarde, ACD et détérioration du patient.",
    keywords: "simulateurs cliniques infirmiers, simulations patient, jugement clinique, scénarios infirmiers, simulation soins infirmiers",
  },
  "/free-practice": {
    title: "Questions Pratique Gratuites – Révision NCLEX | NurseNest",
    description: "Commencez votre préparation NCLEX avec des questions pratique gratuites. Justifications détaillées, raisonnement clinique et contenu aligné sur l'examen. Aucune carte de crédit requise.",
    keywords: "questions pratique NCLEX gratuites, révision NCLEX gratuite, questions infirmières gratuites, préparation examen infirmier gratuit",
  },
  "/anatomy": {
    title: "Anatomie & Physiologie – Révision Gratuite | NurseNest",
    description: "Maîtrisez l'anatomie et la physiologie avec notre révision gratuite et interactive. Tous les systèmes corporels couverts avec exercices d'étiquetage et contenu éducatif détaillé.",
    keywords: "anatomie physiologie infirmière, révision anatomie gratuite, systèmes corporels, anatomie soins infirmiers, A&P révision",
  },
  "/pre-nursing": {
    title: "Pré-Soins Infirmiers – Fondations & Modules Gratuits | NurseNest",
    description: "Explorez nos modules pré-soins infirmiers gratuits et interactifs. Biologie cellulaire, physiologie, terminologie médicale et bases de pharmacologie pour construire votre fondation clinique.",
    keywords: "pré-soins infirmiers, fondations soins infirmiers, biologie cellulaire infirmière, terminologie médicale, bases pharmacologie",
  },
  "/clinical-clarity": {
    title: "Clarté Clinique – Réponses Basées sur les Preuves | NurseNest",
    description: "Obtenez des réponses claires et basées sur les preuves aux questions cliniques fréquemment échouées aux examens. Contenu fondé sur des données probantes pour étudiants infirmiers.",
    keywords: "clarté clinique infirmière, réponses cliniques, raisonnement clinique, questions fréquentes examen infirmier",
  },
  "/study-plan": {
    title: "Plan d'Étude Personnalisé – Préparation NCLEX | NurseNest",
    description: "Créez votre plan d'étude personnalisé pour la préparation NCLEX. Parcours structuré adapté à votre niveau et vos objectifs d'examen.",
    keywords: "plan d'étude NCLEX, planification révision infirmière, parcours d'étude, programme révision NCLEX",
  },
  "/faq": {
    title: "Questions Fréquentes (FAQ) | NurseNest",
    description: "Trouvez des réponses à vos questions sur NurseNest. Informations sur les abonnements, le contenu éducatif, la préparation aux examens et les fonctionnalités de la plateforme.",
    keywords: "FAQ NurseNest, questions fréquentes, aide NurseNest, support plateforme infirmière",
  },
  "/contact": {
    title: "Contactez-Nous | NurseNest – Support & Questions",
    description: "Contactez l'équipe NurseNest pour toute question, commentaire ou demande de support. Nous sommes là pour vous aider dans votre parcours de préparation aux examens infirmiers.",
    keywords: "contact NurseNest, support NurseNest, aide préparation examen infirmier",
  },
  "/blog": {
    title: "Blog Éducation Clinique – Articles Infirmiers | NurseNest",
    description: "Articles d'éducation clinique fondés sur des preuves. Raisonnement clinique, pathophysiologie, pharmacologie et stratégies de préparation aux examens. Citations APA 7.",
    keywords: "blog infirmier, articles cliniques, éducation infirmière, raisonnement clinique blog, pharmacologie articles",
  },
  "/med-math": {
    title: "Calculs de Médicaments – Pratique Math Infirmière | NurseNest",
    description: "Pratiquez les calculs de dosage et mathématiques médicamenteuses avec des exercices interactifs. Solutions pas à pas et formules essentielles pour les examens infirmiers.",
    keywords: "calculs médicaments infirmier, mathématiques médicales, dosage médicaments, calcul perfusion, math infirmière",
  },
  "/lab-values": {
    title: "Valeurs de Laboratoire — Interprétation Clinique Infirmière | NurseNest",
    description: "Maîtrisez l'interprétation des valeurs de laboratoire anormales avec des scénarios cliniques. Plages normales, signification clinique et actions infirmières pour la préparation NCLEX et REx-PN.",
    keywords: "valeurs laboratoire infirmier, interprétation résultats labo, valeurs normales, analyse sanguine infirmière, valeurs labo NCLEX",
  },
  "/question-of-the-day": {
    title: "Question du Jour – Raisonnement Clinique Quotidien | NurseNest",
    description: "Recevez une question de raisonnement clinique quotidienne avec justification détaillée. Maintenez votre routine d'étude pour la préparation NCLEX.",
    keywords: "question du jour NCLEX, question clinique quotidienne, révision quotidienne infirmière, pratique journalière NCLEX",
  },
  "/compare": {
    title: "Comparer les Forfaits – NurseNest vs Alternatives | NurseNest",
    description: "Comparez les forfaits NurseNest et découvrez pourquoi NurseNest offre plus de fonctionnalités à un prix plus abordable que UWorld et Archer pour la préparation NCLEX.",
    keywords: "comparer NurseNest, NurseNest vs UWorld, préparation NCLEX comparaison, meilleure préparation NCLEX prix",
  },
  "/glossary": {
    title: "Glossaire Infirmier – Terminologie Médicale | NurseNest",
    description: "Consultez notre glossaire complet de termes infirmiers et médicaux. Définitions claires pour la terminologie utilisée en soins infirmiers et aux examens.",
    keywords: "glossaire infirmier, terminologie médicale, définitions soins infirmiers, vocabulaire infirmier",
  },
  "/medical-abbreviations-for-nurses": {
    title: "Abréviations Médicales pour Infirmières – Guide Terminologie Clinique | NurseNest",
    description: "Guide complet des abréviations médicales et de la terminologie clinique pour infirmières. Apprenez SBAR, ADPIE, PRN, BID, TID, STAT et les abréviations de documentation avec définitions, exemples cliniques et conseils NCLEX.",
    keywords: "abréviations médicales infirmière, abréviations soins infirmiers, SBAR, ADPIE, PRN, STAT, NPO, terminologie clinique, abréviations documentation, abréviations NCLEX",
  },
  "/nursing-skill-checklists": {
    title: "Listes de Vérification Compétences Infirmières – Guides de Procédures Cliniques | NurseNest",
    description: "Listes de vérification étape par étape pour l'insertion IV, soins de cathéter central, changement de pansement, oxygénothérapie et transfusion sanguine. Comprend la justification infirmière, les alertes de sécurité et les notes d'examen NCLEX.",
    keywords: "listes vérification compétences infirmières, procédures cliniques, insertion IV, soins cathéter central, pansement, oxygénothérapie, transfusion sanguine, NCLEX",
  },
  "/healthcare-policy-and-updates": {
    title: "Politique de Santé & Mises à Jour — Changements Réglementaires Infirmiers | NurseNest",
    description: "Restez informé des changements de politique de santé affectant les infirmières. Guides sur les mises à jour de licences, le recrutement international, les changements de format d'examen et les évolutions réglementaires.",
    keywords: "politique de santé infirmière, changements réglementaires, licences infirmières, recrutement international infirmier, mises à jour examens, réglementation soins infirmiers",
  },
  "/healthcare-policy-and-updates/licensing-policy-changes": {
    title: "Changements de Politique de Licences Infirmières — Compact, Portée de Pratique | NurseNest",
    description: "Guide complet des changements de politique de licences infirmières, y compris les mises à jour du Compact de Licences, les changements de portée de pratique et les exigences de renouvellement.",
    keywords: "changements licences infirmières, compact infirmier, portée de pratique, renouvellement licence, politique licences",
  },
  "/healthcare-policy-and-updates/international-nursing-recruitment": {
    title: "Recrutement International d'Infirmières — Évaluation des Diplômes & Programmes | NurseNest",
    description: "Guide des politiques de recrutement international d'infirmières. Évaluation des diplômes, voies d'immigration, programmes de transition et réglementations des agences de recrutement.",
    keywords: "recrutement infirmier international, évaluation diplômes infirmiers, programmes transition, visa infirmier, agences recrutement",
  },
  "/healthcare-policy-and-updates/exam-format-updates": {
    title: "Mises à Jour Format d'Examen Infirmier — NGN, CAT & Rapports de Scores | NurseNest",
    description: "Suivez les changements de format des examens infirmiers. Guide sur les mises à jour NGN du NCLEX, les changements de test adaptatif et les modifications de rapports de scores.",
    keywords: "mises à jour format examen NCLEX, NGN, test adaptatif, rapports scores infirmier, changements examen",
  },
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses": {
    title: "Changements Réglementaires Affectant les Infirmières — Dotation, Sécurité & Normes | NurseNest",
    description: "Guide des changements réglementaires affectant la pratique infirmière. Lois sur les ratios de dotation, normes de sécurité des patients, télésanté et exigences de sécurité au travail.",
    keywords: "changements réglementaires infirmiers, ratios dotation, sécurité patients, télésanté, normes pratique infirmière",
  },
  "/practice-questions": {
    title: "Questions Pratique Gratuites – Révision Infirmière | NurseNest",
    description: "Accédez à des questions pratique gratuites pour la révision infirmière. Contenu aligné sur les examens avec justifications détaillées pour chaque réponse.",
    keywords: "questions pratique gratuites infirmier, révision NCLEX gratuite, questions examen infirmier gratuites",
  },
  "/nclex-rn-practice-questions": {
    title: "Questions Pratique NCLEX-RN – Préparation Examen | NurseNest",
    description: "Préparez le NCLEX-RN avec des questions pratique ciblées. Raisonnement clinique, justifications détaillées et contenu aligné sur les domaines de l'examen.",
    keywords: "questions pratique NCLEX-RN, préparation NCLEX-RN, révision NCLEX-RN, examen RN questions",
  },
  "/nclex-pn-practice-questions": {
    title: "Questions Pratique NCLEX-PN – Préparation Examen | NurseNest",
    description: "Préparez le NCLEX-PN avec des questions pratique adaptées. Contenu RPN/LVN avec justifications cliniques et suivi de performance.",
    keywords: "questions pratique NCLEX-PN, préparation NCLEX-PN, révision RPN, examen PN questions",
  },
  "/rex-pn-practice-questions": {
    title: "Questions Pratique REx-PN – Préparation Examen Canada | NurseNest",
    description: "Préparez le REx-PN avec des questions pratique conçues pour les infirmiers praticiens au Canada. Contenu adapté aux normes canadiennes.",
    keywords: "questions pratique REx-PN, préparation REx-PN Canada, examen RPN Canada, révision REx-PN",
  },
  "/np-exam-practice-questions": {
    title: "Questions Pratique Examen NP – Certification Infirmier Praticien | NurseNest",
    description: "Préparez votre examen de certification NP avec des questions pratique avancées. Contenu AANP et ANCC avec justifications cliniques approfondies.",
    keywords: "questions pratique NP, préparation examen NP, certification infirmier praticien, révision AANP ANCC",
  },
  "/diagnostic-assessment": {
    title: "Évaluation Diagnostique – Testez Votre Niveau | NurseNest",
    description: "Évaluez votre niveau actuel avec notre évaluation diagnostique. Identifiez vos forces et faiblesses pour optimiser votre plan de révision NCLEX.",
    keywords: "évaluation diagnostique infirmier, test de niveau NCLEX, diagnostic préparation examen, évaluation connaissances infirmières",
  },
  "/medication-mastery": {
    title: "Maîtrise des Médicaments – Pharmacologie Infirmière | NurseNest",
    description: "Maîtrisez la pharmacologie infirmière avec nos outils de révision. Classes de médicaments, effets secondaires, contre-indications et calculs de dosage.",
    keywords: "pharmacologie infirmière, maîtrise médicaments, révision pharmacologie NCLEX, classes médicaments infirmier",
  },
  "/lectures": {
    title: "Cours Vidéo – Leçons Cliniques en Vidéo | NurseNest",
    description: "Regardez des cours vidéo sur la pathophysiologie, la pharmacologie et les soins infirmiers. Contenu pédagogique structuré par système corporel et niveau.",
    keywords: "cours vidéo infirmier, leçons vidéo soins infirmiers, pathophysiologie vidéo, cours cliniques en ligne",
  },
  "/nclex-rn-guide": {
    title: "Guide NCLEX-RN – Tout Savoir pour Réussir | NurseNest",
    description: "Guide complet pour réussir le NCLEX-RN. Format d'examen, domaines de contenu, stratégies de préparation et ressources d'étude recommandées.",
    keywords: "guide NCLEX-RN, réussir NCLEX-RN, préparation NCLEX-RN guide, stratégies examen RN",
  },
  "/rex-pn-guide": {
    title: "Guide REx-PN – Préparation Examen Canada | NurseNest",
    description: "Guide complet pour le REx-PN au Canada. Format d'examen, compétences évaluées et stratégies de préparation pour les infirmiers praticiens canadiens.",
    keywords: "guide REx-PN, préparation REx-PN Canada, examen RPN guide, réussir REx-PN",
  },
  "/np-exam-guide": {
    title: "Guide Examen NP – Certification Infirmier Praticien | NurseNest",
    description: "Guide complet pour les examens de certification NP. Couvre les examens AANP, ANCC et les spécialités FNP, AGPCNP, PMHNP et plus.",
    keywords: "guide examen NP, certification infirmier praticien guide, préparation AANP ANCC, réussir examen NP",
  },
  "/pathways": {
    title: "Parcours d'Apprentissage – Progression Structurée | NurseNest",
    description: "Suivez des parcours d'apprentissage structurés pour progresser du niveau fondamental au niveau avancé. Progression guidée pour chaque spécialité infirmière.",
    keywords: "parcours apprentissage infirmier, progression structurée, parcours étude NCLEX, programme révision infirmier",
  },
  "/shop": {
    title: "Boutique – Ressources d'Étude & Packs d'Examen | NurseNest",
    description: "Découvrez nos packs d'examen imprimables, guides d'étude et ressources de révision pour la préparation aux examens infirmiers.",
    keywords: "boutique NurseNest, packs examen infirmier, ressources étude, guides révision NCLEX",
  },
  "/nursing-exam-prep": {
    title: "Préparation Examen NCLEX – Révision Complète Infirmière | NurseNest",
    description: "Préparez votre examen NCLEX-RN, NCLEX-PN ou REx-PN avec des ressources complètes : questions pratique, examens simulés, cartes mémoire pharmacologie et leçons de pathophysiologie. Commencez votre révision dès maintenant.",
    keywords: "préparation examen NCLEX, révision NCLEX-RN, préparation NCLEX-PN, REx-PN préparation, examen infirmier Canada, questions NCLEX français",
  },
  "/nursing-simulation-practice": {
    title: "Simulation Clinique Infirmière – Scénarios de Pratique | NurseNest",
    description: "Améliorez vos compétences cliniques avec des simulations infirmières interactives. Scénarios patients, prise de décision clinique, communication SBAR et débriefing structuré pour étudiants en soins infirmiers.",
    keywords: "simulation clinique infirmière, simulation soins infirmiers, pratique scénarios patients, compétences cliniques infirmières, SBAR infirmier, jugement clinique",
  },
  "/hyperkalemia-effects-on-heart": {
    title: "Hyperkaliémie et Effets sur le Cœur — Physiologie Infirmière et Changements ECG | NurseNest",
    description: "Comprenez les effets de l'hyperkaliémie sur le cœur : ondes T pointues, élargissement du QRS, risque d'arrêt cardiaque et interventions infirmières essentielles. Guide clinique pour la préparation aux examens infirmiers.",
    keywords: "hyperkaliémie effets cœur, hyperkaliémie ECG, ondes T pointues, potassium élevé cœur, hyperkaliémie soins infirmiers, changements ECG hyperkaliémie",
  },
  "/international-nurses": {
      title: "Infirmières internationales – Guide de la pratique infirmière à l'étranger | NurseNest",
      description: "Guide complet pour les infirmières formées à l'international : permis d'exercice, examens, évaluation des diplômes, parcours migratoire et offres d'emploi à travers le monde.",
      keywords: "infirmières internationales, permis infirmier étranger, migration infirmière, NCLEX international, examen infirmier Canada",
    },
  "/nursing-schools": {
    title: "Répertoire des Écoles Infirmières – Guide Mondial des Programmes | NurseNest",
    description: "Répertoire complet des écoles infirmières dans le monde. Comparez les programmes, les frais de scolarité, les conditions d'admission et les résultats de licence dans 6 pays.",
    keywords: "écoles infirmières, programmes soins infirmiers, éducation infirmière, BScN programmes, écoles infirmières Canada, écoles infirmières internationales",
  },
  "/nurse-residency-programs": {
    title: "Programmes de Résidence Infirmière – Guide pour Nouveaux Diplômés | NurseNest",
    description: "Répertoire des programmes de résidence infirmière et de transition pour les nouveaux diplômés. Trouvez des programmes par pays, système hospitalier et spécialité.",
    keywords: "programmes résidence infirmière, programmes nouveaux diplômés infirmiers, transition vers la pratique, résidence hospitalière infirmière",
  },
  "/nursing-regulatory-bodies": {
    title: "Organismes de Réglementation Infirmière – Guide des Licences et de l'Inscription | NurseNest",
    description: "Répertoire complet des organismes de réglementation infirmière dans le monde. Comprenez les exigences de licence, les processus d'inscription et la reconnaissance des diplômes.",
    keywords: "organismes réglementation infirmière, licence infirmière, inscription infirmière, CNO, NMC, AHPRA, NCSBN, conseil infirmier",
  },
};

const spanishMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – Preparación Examen Enfermería | Preguntas NCLEX & Banco de Preguntas",
    description: "Prepárate para tus exámenes de enfermería con NurseNest. Accede a miles de preguntas NCLEX, simulaciones clínicas, tarjetas enfermería y lecciones de fisiopatología. Para estudiantes RPN, RN y NP en Canadá y Estados Unidos.",
    keywords: "preguntas NCLEX, preparación examen enfermería, banco de preguntas enfermería, tarjetas enfermería, repaso NCLEX, simulaciones clínicas, fisiopatología enfermería, examen enfermería",
  },
  "/pricing": {
    title: "Precios & Planes | NurseNest – Preparación Examen Enfermería",
    description: "Compara los planes de NurseNest para la preparación de exámenes de enfermería. Acceso gratuito incluido. Planes mensuales asequibles con banco de preguntas NCLEX, simulaciones clínicas y tarjetas de estudio.",
    keywords: "precios NurseNest, planes preparación NCLEX, costo examen enfermería, suscripción repaso NCLEX, preparación examen enfermería precio",
  },
  "/lessons": {
    title: "Lecciones Clínicas – Fisiopatología & Enfermería | NurseNest",
    description: "Explora nuestras lecciones clínicas detalladas sobre fisiopatología, farmacología y razonamiento clínico. Contenido estructurado por sistema corporal para RPN, RN y NP.",
    keywords: "lecciones enfermería, fisiopatología enfermería, clases clínicas, razonamiento clínico, farmacología enfermería, repaso NCLEX lecciones",
  },
  "/flashcards": {
    title: "Tarjetas de Estudio Enfermería – Farmacología & Repaso | NurseNest",
    description: "Estudia con tarjetas de enfermería verificadas clínicamente. Farmacología, valores de laboratorio y fisiopatología con modos Aprender y Examen. Crea tus propios mazos.",
    keywords: "tarjetas enfermería, flashcards farmacología, repaso NCLEX tarjetas, tarjetas estudio enfermería, estudio enfermería",
  },
  "/mock-exams": {
    title: "Exámenes Simulados NCLEX – Simulación Cronometrada | NurseNest",
    description: "Simula las condiciones reales del examen con nuestros exámenes simulados NCLEX cronometrados. Selección adaptativa de preguntas, seguimiento de rendimiento y justificaciones detalladas.",
    keywords: "exámenes simulados NCLEX, simulación examen enfermería, examen práctico cronometrado, preparación examen enfermería, simulacro NCLEX",
  },
  "/test-bank": {
    title: "Banco de Preguntas Enfermería – Preguntas Práctica NCLEX | NurseNest",
    description: "Accede a nuestro banco de preguntas de enfermería completo. Filtra por sistema corporal, nivel y tema. Cada pregunta incluye justificaciones detalladas para el repaso NCLEX.",
    keywords: "banco de preguntas enfermería, preguntas práctica NCLEX, preguntas examen enfermería, banco de tests enfermería",
  },
  "/question-bank": {
    title: "Banco de Preguntas Enfermería – Preguntas Práctica NCLEX | NurseNest",
    description: "Accede a nuestro banco de preguntas de enfermería completo. Filtra por sistema corporal, nivel y tema. Cada pregunta incluye justificaciones detalladas para el repaso NCLEX.",
    keywords: "banco de preguntas enfermería, preguntas práctica NCLEX, preguntas examen enfermería, banco de tests enfermería",
  },
  "/simulators": {
    title: "Simuladores Clínicos – Escenarios Interactivos | NurseNest",
    description: "Practica el juicio clínico con simuladores interactivos. Escenarios de pacientes ramificados incluyendo sepsis, infarto de miocardio, CAD y deterioro del paciente.",
    keywords: "simuladores clínicos enfermería, simulaciones paciente, juicio clínico, escenarios enfermería, simulación enfermería",
  },
  "/free-practice": {
    title: "Preguntas Práctica Gratuitas – Repaso NCLEX | NurseNest",
    description: "Comienza tu preparación NCLEX con preguntas práctica gratuitas. Justificaciones detalladas, razonamiento clínico y contenido alineado con el examen. Sin tarjeta de crédito.",
    keywords: "preguntas práctica NCLEX gratuitas, repaso NCLEX gratis, preguntas enfermería gratis, preparación examen enfermería gratis",
  },
  "/anatomy": {
    title: "Anatomía & Fisiología – Repaso Gratuito | NurseNest",
    description: "Domina la anatomía y fisiología con nuestro repaso gratuito e interactivo. Todos los sistemas corporales cubiertos con ejercicios de etiquetado y contenido educativo detallado.",
    keywords: "anatomía fisiología enfermería, repaso anatomía gratis, sistemas corporales, anatomía enfermería, A&P repaso",
  },
  "/pre-nursing": {
    title: "Pre-Enfermería – Fundamentos & Módulos Gratuitos | NurseNest",
    description: "Explora nuestros módulos de pre-enfermería gratuitos e interactivos. Biología celular, fisiología, terminología médica y bases de farmacología para construir tu fundación clínica.",
    keywords: "pre-enfermería, fundamentos enfermería, biología celular enfermería, terminología médica, bases farmacología",
  },
  "/clinical-clarity": {
    title: "Claridad Clínica – Respuestas Basadas en Evidencia | NurseNest",
    description: "Obtén respuestas claras y basadas en evidencia a preguntas clínicas frecuentemente falladas en exámenes. Contenido basado en evidencia para estudiantes de enfermería.",
    keywords: "claridad clínica enfermería, respuestas clínicas, razonamiento clínico, preguntas frecuentes examen enfermería",
  },
  "/study-plan": {
    title: "Plan de Estudio Personalizado – Preparación NCLEX | NurseNest",
    description: "Crea tu plan de estudio personalizado para la preparación NCLEX. Ruta estructurada adaptada a tu nivel y objetivos de examen.",
    keywords: "plan de estudio NCLEX, planificación repaso enfermería, ruta de estudio, programa repaso NCLEX",
  },
  "/faq": {
    title: "Preguntas Frecuentes (FAQ) | NurseNest",
    description: "Encuentra respuestas a tus preguntas sobre NurseNest. Información sobre suscripciones, contenido educativo, preparación de exámenes y funciones de la plataforma.",
    keywords: "FAQ NurseNest, preguntas frecuentes, ayuda NurseNest, soporte plataforma enfermería",
  },
  "/contact": {
    title: "Contáctanos | NurseNest – Soporte & Preguntas",
    description: "Contacta al equipo NurseNest para cualquier pregunta, comentario o solicitud de soporte. Estamos aquí para ayudarte en tu preparación para exámenes de enfermería.",
    keywords: "contacto NurseNest, soporte NurseNest, ayuda preparación examen enfermería",
  },
  "/blog": {
    title: "Blog Educación Clínica – Artículos Enfermería | NurseNest",
    description: "Artículos de educación clínica basados en evidencia. Razonamiento clínico, fisiopatología, farmacología y estrategias de preparación para exámenes. Citas APA 7.",
    keywords: "blog enfermería, artículos clínicos, educación enfermería, razonamiento clínico blog, farmacología artículos",
  },
  "/med-math": {
    title: "Cálculos de Medicamentos – Práctica Matemáticas Enfermería | NurseNest",
    description: "Practica cálculos de dosificación y matemáticas de medicamentos con ejercicios interactivos. Soluciones paso a paso y fórmulas esenciales para exámenes de enfermería.",
    keywords: "cálculos medicamentos enfermería, matemáticas médicas, dosificación medicamentos, cálculo infusión, matemáticas enfermería",
  },
  "/lab-values": {
    title: "Valores de Laboratorio – Interpretación Enfermería | NurseNest",
    description: "Domina la interpretación de valores de laboratorio. Rangos normales, significado clínico de resultados anormales y acciones de enfermería correspondientes.",
    keywords: "valores laboratorio enfermería, interpretación resultados lab, valores normales, análisis sanguíneo enfermería",
  },
  "/question-of-the-day": {
    title: "Pregunta del Día – Razonamiento Clínico Diario | NurseNest",
    description: "Recibe una pregunta de razonamiento clínico diaria con justificación detallada. Mantén tu rutina de estudio para la preparación NCLEX.",
    keywords: "pregunta del día NCLEX, pregunta clínica diaria, repaso diario enfermería, práctica diaria NCLEX",
  },
  "/compare": {
    title: "Comparar Planes – NurseNest vs Alternativas | NurseNest",
    description: "Compara los planes de NurseNest y descubre por qué NurseNest ofrece más funciones a un precio más asequible que UWorld y Archer para la preparación NCLEX.",
    keywords: "comparar NurseNest, NurseNest vs UWorld, preparación NCLEX comparación, mejor preparación NCLEX precio",
  },
  "/glossary": {
    title: "Glosario de Enfermería – Terminología Médica | NurseNest",
    description: "Consulta nuestro glosario completo de términos de enfermería y medicina. Definiciones claras para la terminología utilizada en enfermería y exámenes.",
    keywords: "glosario enfermería, terminología médica, definiciones enfermería, vocabulario enfermería",
  },
  "/medical-abbreviations-for-nurses": {
    title: "Abreviaturas Médicas para Enfermería – Guía de Terminología Clínica | NurseNest",
    description: "Guía completa de abreviaturas médicas y terminología clínica para enfermería. Aprende SBAR, ADPIE, PRN, BID, TID, STAT y abreviaturas de documentación con definiciones, ejemplos clínicos y consejos NCLEX.",
    keywords: "abreviaturas médicas enfermería, abreviaturas de enfermería, SBAR, ADPIE, PRN, STAT, NPO, terminología clínica, abreviaturas documentación, abreviaturas NCLEX",
  },
  "/nursing-skill-checklists": {
    title: "Listas de Verificación de Habilidades de Enfermería – Guías de Procedimientos Clínicos | NurseNest",
    description: "Listas de verificación paso a paso para inserción IV, cuidado de catéter central, cambio de vendaje, oxigenoterapia y transfusión sanguínea. Incluye justificación de enfermería, alertas de seguridad y notas de examen NCLEX.",
    keywords: "listas verificación habilidades enfermería, procedimientos clínicos, inserción IV, cuidado catéter central, vendaje, oxigenoterapia, transfusión sanguínea, NCLEX",
  },
  "/healthcare-policy-and-updates": {
    title: "Política de Salud y Actualizaciones — Cambios Regulatorios de Enfermería | NurseNest",
    description: "Manténgase informado sobre los cambios de política de salud que afectan a enfermeras. Guías sobre actualizaciones de licencias, reclutamiento internacional, cambios de formato de examen y desarrollos regulatorios.",
    keywords: "política de salud enfermería, cambios regulatorios, licencias enfermería, reclutamiento internacional enfermero, actualizaciones exámenes, regulación enfermería",
  },
  "/healthcare-policy-and-updates/licensing-policy-changes": {
    title: "Cambios de Política de Licencias de Enfermería — Compact, Ámbito de Práctica | NurseNest",
    description: "Guía completa de los cambios de política de licencias de enfermería, incluyendo actualizaciones del Compact de Licencias, cambios en el ámbito de práctica y requisitos de renovación.",
    keywords: "cambios licencias enfermería, compact enfermero, ámbito de práctica, renovación licencia, política licencias",
  },
  "/healthcare-policy-and-updates/international-nursing-recruitment": {
    title: "Reclutamiento Internacional de Enfermeras — Evaluación de Credenciales y Programas | NurseNest",
    description: "Guía de políticas de reclutamiento internacional de enfermeras. Evaluación de credenciales, vías de inmigración, programas de transición y regulaciones de agencias de reclutamiento.",
    keywords: "reclutamiento enfermero internacional, evaluación credenciales, programas transición, visa enfermero, agencias reclutamiento",
  },
  "/healthcare-policy-and-updates/exam-format-updates": {
    title: "Actualizaciones de Formato de Examen de Enfermería — NGN, CAT & Reportes | NurseNest",
    description: "Siga los cambios de formato de exámenes de enfermería. Guía sobre actualizaciones NGN del NCLEX, cambios en pruebas adaptativas y modificaciones de reportes de puntuación.",
    keywords: "actualizaciones formato examen NCLEX, NGN, test adaptativo, reportes puntuación, cambios examen enfermería",
  },
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses": {
    title: "Cambios Regulatorios que Afectan a Enfermeras — Dotación, Seguridad & Normas | NurseNest",
    description: "Guía de cambios regulatorios que afectan la práctica enfermera. Leyes de ratios de dotación, normas de seguridad del paciente, telesalud y requisitos de seguridad laboral.",
    keywords: "cambios regulatorios enfermería, ratios dotación, seguridad paciente, telesalud, normas práctica enfermera",
  },
  "/practice-questions": {
    title: "Preguntas Práctica Gratuitas – Repaso Enfermería | NurseNest",
    description: "Accede a preguntas práctica gratuitas para el repaso de enfermería. Contenido alineado con exámenes con justificaciones detalladas para cada respuesta.",
    keywords: "preguntas práctica gratuitas enfermería, repaso NCLEX gratis, preguntas examen enfermería gratis",
  },
  "/nclex-rn-practice-questions": {
    title: "Preguntas Práctica NCLEX-RN – Preparación Examen | NurseNest",
    description: "Prepárate para el NCLEX-RN con preguntas práctica dirigidas. Razonamiento clínico, justificaciones detalladas y contenido alineado con los dominios del examen.",
    keywords: "preguntas práctica NCLEX-RN, preparación NCLEX-RN, repaso NCLEX-RN, examen RN preguntas",
  },
  "/nclex-pn-practice-questions": {
    title: "Preguntas Práctica NCLEX-PN – Preparación Examen | NurseNest",
    description: "Prepárate para el NCLEX-PN con preguntas práctica adaptadas. Contenido RPN/LVN con justificaciones clínicas y seguimiento de rendimiento.",
    keywords: "preguntas práctica NCLEX-PN, preparación NCLEX-PN, repaso RPN, examen PN preguntas",
  },
  "/rex-pn-practice-questions": {
    title: "Preguntas Práctica REx-PN – Preparación Examen Canadá | NurseNest",
    description: "Prepárate para el REx-PN con preguntas práctica diseñadas para enfermeros en Canadá. Contenido adaptado a las normas canadienses.",
    keywords: "preguntas práctica REx-PN, preparación REx-PN Canadá, examen RPN Canadá, repaso REx-PN",
  },
  "/np-exam-practice-questions": {
    title: "Preguntas Práctica Examen NP – Certificación Enfermero Practicante | NurseNest",
    description: "Prepárate para tu examen de certificación NP con preguntas práctica avanzadas. Contenido AANP y ANCC con justificaciones clínicas detalladas.",
    keywords: "preguntas práctica NP, preparación examen NP, certificación enfermero practicante, repaso AANP ANCC",
  },
  "/diagnostic-assessment": {
    title: "Evaluación Diagnóstica – Evalúa Tu Nivel | NurseNest",
    description: "Evalúa tu nivel actual con nuestra evaluación diagnóstica. Identifica tus fortalezas y debilidades para optimizar tu plan de repaso NCLEX.",
    keywords: "evaluación diagnóstica enfermería, test de nivel NCLEX, diagnóstico preparación examen, evaluación conocimientos enfermería",
  },
  "/medication-mastery": {
    title: "Dominio de Medicamentos – Farmacología Enfermería | NurseNest",
    description: "Domina la farmacología de enfermería con nuestras herramientas de repaso. Clases de medicamentos, efectos secundarios, contraindicaciones y cálculos de dosificación.",
    keywords: "farmacología enfermería, dominio medicamentos, repaso farmacología NCLEX, clases medicamentos enfermería",
  },
  "/lectures": {
    title: "Clases en Video – Lecciones Clínicas en Video | NurseNest",
    description: "Mira clases en video sobre fisiopatología, farmacología y enfermería. Contenido pedagógico estructurado por sistema corporal y nivel.",
    keywords: "clases video enfermería, lecciones video enfermería, fisiopatología video, clases clínicas en línea",
  },
  "/nclex-rn-guide": {
    title: "Guía NCLEX-RN – Todo para Aprobar | NurseNest",
    description: "Guía completa para aprobar el NCLEX-RN. Formato del examen, dominios de contenido, estrategias de preparación y recursos de estudio recomendados.",
    keywords: "guía NCLEX-RN, aprobar NCLEX-RN, preparación NCLEX-RN guía, estrategias examen RN",
  },
  "/rex-pn-guide": {
    title: "Guía REx-PN – Preparación Examen Canadá | NurseNest",
    description: "Guía completa para el REx-PN en Canadá. Formato del examen, competencias evaluadas y estrategias de preparación para enfermeros canadienses.",
    keywords: "guía REx-PN, preparación REx-PN Canadá, examen RPN guía, aprobar REx-PN",
  },
  "/np-exam-guide": {
    title: "Guía Examen NP – Certificación Enfermero Practicante | NurseNest",
    description: "Guía completa para los exámenes de certificación NP. Cubre los exámenes AANP, ANCC y las especialidades FNP, AGPCNP, PMHNP y más.",
    keywords: "guía examen NP, certificación enfermero practicante guía, preparación AANP ANCC, aprobar examen NP",
  },
  "/pathways": {
    title: "Rutas de Aprendizaje – Progresión Estructurada | NurseNest",
    description: "Sigue rutas de aprendizaje estructuradas para progresar del nivel fundamental al avanzado. Progresión guiada para cada especialidad de enfermería.",
    keywords: "rutas aprendizaje enfermería, progresión estructurada, ruta estudio NCLEX, programa repaso enfermería",
  },
  "/shop": {
    title: "Tienda – Recursos de Estudio & Packs de Examen | NurseNest",
    description: "Descubre nuestros packs de examen imprimibles, guías de estudio y recursos de repaso para la preparación de exámenes de enfermería.",
    keywords: "tienda NurseNest, packs examen enfermería, recursos estudio, guías repaso NCLEX",
  },
  "/international-nurses": {
      title: "Enfermeras Internacionales – Guía de Enfermería Global | NurseNest",
      description: "Guía completa para enfermeras educadas internacionalmente: licencias, exámenes, evaluación de credenciales, rutas migratorias y oportunidades de empleo en todo el mundo.",
      keywords: "enfermeras internacionales, licencia enfermería extranjera, migración enfermería, NCLEX internacional, examen enfermería Canadá",
    },
  "/nursing-schools": {
    title: "Directorio de Escuelas de Enfermería – Guía Mundial de Programas | NurseNest",
    description: "Directorio completo de escuelas de enfermería en el mundo. Compare programas, matrículas, requisitos de admisión y resultados de licencia en 6 países.",
    keywords: "escuelas enfermería, programas enfermería, educación enfermería, BSN programas, escuelas enfermería internacionales",
  },
  "/nurse-residency-programs": {
    title: "Programas de Residencia de Enfermería – Guía para Nuevos Graduados | NurseNest",
    description: "Directorio de programas de residencia de enfermería y transición para nuevos graduados. Encuentre programas por país, sistema hospitalario y especialidad.",
    keywords: "programas residencia enfermería, programas nuevos graduados enfermería, transición a la práctica, residencia hospitalaria enfermería",
  },
  "/nursing-regulatory-bodies": {
    title: "Organismos Reguladores de Enfermería – Guía de Licencias y Registro | NurseNest",
    description: "Directorio completo de organismos reguladores de enfermería en el mundo. Comprenda los requisitos de licencia, procesos de registro y reconocimiento de credenciales.",
    keywords: "organismos reguladores enfermería, licencia enfermería, registro enfermería, NCSBN, NMC, AHPRA, consejo enfermería",
  },
};

const portugueseMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – Preparação para Exame de Enfermagem | Questões NCLEX e Banco de Questões",
    description: "Prepare-se para seus exames de enfermagem com o NurseNest. Acesse milhares de questões práticas NCLEX, simulações clínicas, flashcards de enfermagem e lições de fisiopatologia. Para estudantes RPN, RN e NP no Canadá e Estados Unidos.",
    keywords: "questões práticas NCLEX, preparação exame enfermagem, banco de questões enfermagem, flashcards enfermagem, revisão NCLEX, simulações clínicas, fisiopatologia enfermagem, exame enfermagem",
  },
  "/pricing": {
    title: "Preços e Planos | NurseNest – Preparação para Exame de Enfermagem",
    description: "Compare os planos do NurseNest para preparação de exames de enfermagem. Acesso gratuito incluído. Planos mensais acessíveis com banco de questões NCLEX, simulações clínicas e flashcards.",
    keywords: "preços NurseNest, planos preparação NCLEX, custo exame enfermagem, assinatura revisão NCLEX, preparação exame enfermagem preço",
  },
  "/lessons": {
    title: "Lições Clínicas – Fisiopatologia e Enfermagem | NurseNest",
    description: "Explore nossas lições clínicas detalhadas cobrindo fisiopatologia, farmacologia e raciocínio clínico. Conteúdo estruturado por sistema corporal para RPN, RN e NP.",
    keywords: "lições enfermagem, fisiopatologia enfermagem, aulas clínicas, raciocínio clínico, farmacologia enfermagem, revisão NCLEX lições",
  },
  "/flashcards": {
    title: "Flashcards de Enfermagem – Farmacologia e Revisão | NurseNest",
    description: "Estude com flashcards de enfermagem verificados clinicamente. Farmacologia, valores laboratoriais e fisiopatologia com modos Aprender e Testar. Crie seus próprios baralhos.",
    keywords: "flashcards enfermagem, flashcards farmacologia, revisão NCLEX cartões, flashcards estudo enfermagem, estudo enfermagem",
  },
  "/mock-exams": {
    title: "Simulados NCLEX – Simulação Cronometrada | NurseNest",
    description: "Simule condições reais de exame com nossos simulados NCLEX cronometrados. Seleção adaptativa de questões, acompanhamento de desempenho e justificativas detalhadas.",
    keywords: "simulados NCLEX, simulação exame enfermagem, exame prático cronometrado, preparação exame enfermagem, simulado NCLEX",
  },
  "/test-bank": {
    title: "Banco de Questões de Enfermagem – Questões Práticas NCLEX | NurseNest",
    description: "Acesse nosso banco de questões de enfermagem completo. Filtre por sistema corporal, nível e tópico. Cada questão inclui justificativas detalhadas para revisão NCLEX.",
    keywords: "banco de questões enfermagem, questões práticas NCLEX, questões exame enfermagem, banco de testes enfermagem",
  },
  "/question-bank": {
    title: "Banco de Questões de Enfermagem – Questões Práticas NCLEX | NurseNest",
    description: "Acesse nosso banco de questões de enfermagem completo. Filtre por sistema corporal, nível e tópico. Cada questão inclui justificativas detalhadas para revisão NCLEX.",
    keywords: "banco de questões enfermagem, questões práticas NCLEX, questões exame enfermagem, banco de testes enfermagem",
  },
  "/simulators": {
    title: "Simuladores Clínicos – Cenários Interativos | NurseNest",
    description: "Pratique julgamento clínico com simuladores interativos. Cenários de pacientes ramificados incluindo sepse, infarto do miocárdio, CAD e deterioração do paciente.",
    keywords: "simuladores clínicos enfermagem, simulações de paciente, julgamento clínico, cenários enfermagem, simulação enfermagem",
  },
  "/free-practice": {
    title: "Questões Práticas Gratuitas – Revisão NCLEX | NurseNest",
    description: "Comece sua preparação NCLEX com questões práticas gratuitas. Justificativas detalhadas, raciocínio clínico e conteúdo alinhado ao exame. Sem necessidade de cartão de crédito.",
    keywords: "questões práticas NCLEX gratuitas, revisão NCLEX grátis, questões enfermagem grátis, preparação exame enfermagem grátis",
  },
  "/anatomy": {
    title: "Anatomia e Fisiologia – Revisão Gratuita | NurseNest",
    description: "Domine anatomia e fisiologia com nossa revisão gratuita e interativa. Todos os sistemas corporais cobertos com exercícios de rotulagem e conteúdo educacional detalhado.",
    keywords: "anatomia fisiologia enfermagem, revisão anatomia grátis, sistemas corporais, anatomia enfermagem, A&P revisão",
  },
  "/pre-nursing": {
    title: "Pré-Enfermagem – Fundamentos e Módulos Gratuitos | NurseNest",
    description: "Explore nossos módulos de pré-enfermagem gratuitos e interativos. Biologia celular, fisiologia, terminologia médica e bases de farmacologia para construir sua base clínica.",
    keywords: "pré-enfermagem, fundamentos enfermagem, biologia celular enfermagem, terminologia médica, bases farmacologia",
  },
  "/clinical-clarity": {
    title: "Clareza Clínica – Respostas Baseadas em Evidências | NurseNest",
    description: "Obtenha respostas claras e baseadas em evidências para questões clínicas frequentemente erradas em exames. Conteúdo baseado em evidências para estudantes de enfermagem.",
    keywords: "clareza clínica enfermagem, respostas clínicas, raciocínio clínico, questões frequentes exame enfermagem",
  },
  "/study-plan": {
    title: "Plano de Estudo Personalizado – Preparação NCLEX | NurseNest",
    description: "Crie seu plano de estudo personalizado para preparação NCLEX. Percurso estruturado adaptado ao seu nível e objetivos de exame.",
    keywords: "plano de estudo NCLEX, planejamento revisão enfermagem, percurso de estudo, programa revisão NCLEX",
  },
  "/faq": {
    title: "Perguntas Frequentes (FAQ) | NurseNest",
    description: "Encontre respostas para suas perguntas sobre o NurseNest. Informações sobre assinaturas, conteúdo educacional, preparação para exames e funcionalidades da plataforma.",
    keywords: "FAQ NurseNest, perguntas frequentes, ajuda NurseNest, suporte plataforma enfermagem",
  },
  "/contact": {
    title: "Contate-nos | NurseNest – Suporte e Perguntas",
    description: "Entre em contato com a equipe NurseNest para qualquer pergunta, comentário ou solicitação de suporte. Estamos aqui para ajudá-lo em sua preparação para exames de enfermagem.",
    keywords: "contato NurseNest, suporte NurseNest, ajuda preparação exame enfermagem",
  },
  "/blog": {
    title: "Blog Educação Clínica – Artigos de Enfermagem | NurseNest",
    description: "Artigos de educação clínica baseados em evidências. Raciocínio clínico, fisiopatologia, farmacologia e estratégias de preparação para exames. Citações APA 7.",
    keywords: "blog enfermagem, artigos clínicos, educação enfermagem, raciocínio clínico blog, farmacologia artigos",
  },
  "/med-math": {
    title: "Cálculos de Medicamentos – Prática Matemática de Enfermagem | NurseNest",
    description: "Pratique cálculos de dosagem e matemática de medicamentos com exercícios interativos. Soluções passo a passo e fórmulas essenciais para exames de enfermagem.",
    keywords: "cálculos medicamentos enfermagem, matemática médica, dosagem medicamentos, cálculo infusão, matemática enfermagem",
  },
  "/lab-values": {
    title: "Valores Laboratoriais – Interpretação de Enfermagem | NurseNest",
    description: "Domine a interpretação de valores laboratoriais. Faixas normais, significado clínico de resultados anormais e ações de enfermagem correspondentes.",
    keywords: "valores laboratoriais enfermagem, interpretação resultados lab, valores normais, análise sanguínea enfermagem",
  },
  "/question-of-the-day": {
    title: "Questão do Dia – Raciocínio Clínico Diário | NurseNest",
    description: "Receba uma questão de raciocínio clínico diária com justificativa detalhada. Mantenha sua rotina de estudo para preparação NCLEX.",
    keywords: "questão do dia NCLEX, questão clínica diária, revisão diária enfermagem, prática diária NCLEX",
  },
  "/compare": {
    title: "Comparar Planos – NurseNest vs Alternativas | NurseNest",
    description: "Compare os planos do NurseNest e descubra por que o NurseNest oferece mais recursos a um preço mais acessível que UWorld e Archer para preparação NCLEX.",
    keywords: "comparar NurseNest, NurseNest vs UWorld, preparação NCLEX comparação, melhor preparação NCLEX preço",
  },
  "/glossary": {
    title: "Glossário de Enfermagem – Terminologia Médica | NurseNest",
    description: "Consulte nosso glossário completo de termos de enfermagem e medicina. Definições claras para a terminologia usada em enfermagem e exames.",
    keywords: "glossário enfermagem, terminologia médica, definições enfermagem, vocabulário enfermagem",
  },
  "/medical-abbreviations-for-nurses": {
    title: "Abreviaturas Médicas para Enfermagem – Guia de Terminologia Clínica | NurseNest",
    description: "Guia completo de abreviaturas médicas e terminologia clínica para enfermagem. Aprenda SBAR, ADPIE, PRN, BID, TID, STAT e abreviaturas de documentação com definições, exemplos clínicos e dicas NCLEX.",
    keywords: "abreviaturas médicas enfermagem, abreviaturas de enfermagem, SBAR, ADPIE, PRN, STAT, NPO, terminologia clínica, abreviaturas documentação, abreviaturas NCLEX",
  },
  "/nursing-skill-checklists": {
    title: "Listas de Verificação de Habilidades de Enfermagem – Guias de Procedimentos Clínicos | NurseNest",
    description: "Listas de verificação passo a passo para inserção de cateter IV, cuidados com cateter central, troca de curativo, oxigenoterapia e transfusão sanguínea. Inclui justificativa de enfermagem, alertas de segurança e notas de exame NCLEX.",
    keywords: "listas verificação habilidades enfermagem, procedimentos clínicos, inserção IV, cuidados cateter central, curativo, oxigenoterapia, transfusão sanguínea, NCLEX",
  },
  "/healthcare-policy-and-updates": {
    title: "Política de Saúde e Atualizações — Mudanças Regulatórias de Enfermagem | NurseNest",
    description: "Mantenha-se informado sobre mudanças na política de saúde que afetam enfermeiros. Guias sobre atualizações de licenciamento, recrutamento internacional, mudanças no formato de exames e desenvolvimentos regulatórios.",
    keywords: "política de saúde enfermagem, mudanças regulatórias, licenciamento enfermagem, recrutamento internacional enfermeiro, atualizações exames, regulamentação enfermagem",
  },
  "/healthcare-policy-and-updates/licensing-policy-changes": {
    title: "Mudanças na Política de Licenciamento de Enfermagem — Compact, Âmbito de Prática | NurseNest",
    description: "Guia completo das mudanças na política de licenciamento de enfermagem, incluindo atualizações do Compact de Licenças, mudanças no âmbito de prática e requisitos de renovação.",
    keywords: "mudanças licenciamento enfermagem, compact enfermeiro, âmbito de prática, renovação licença, política licenças",
  },
  "/healthcare-policy-and-updates/international-nursing-recruitment": {
    title: "Recrutamento Internacional de Enfermeiros — Avaliação de Credenciais e Programas | NurseNest",
    description: "Guia de políticas de recrutamento internacional de enfermeiros. Avaliação de credenciais, vias de imigração, programas de transição e regulamentos de agências de recrutamento.",
    keywords: "recrutamento enfermeiro internacional, avaliação credenciais, programas transição, visto enfermeiro, agências recrutamento",
  },
  "/healthcare-policy-and-updates/exam-format-updates": {
    title: "Atualizações de Formato de Exame de Enfermagem — NGN, CAT e Relatórios | NurseNest",
    description: "Acompanhe as mudanças no formato dos exames de enfermagem. Guia sobre atualizações NGN do NCLEX, mudanças em testes adaptativos e modificações nos relatórios de pontuação.",
    keywords: "atualizações formato exame NCLEX, NGN, teste adaptativo, relatórios pontuação, mudanças exame enfermagem",
  },
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses": {
    title: "Mudanças Regulatórias que Afetam Enfermeiros — Dotação, Segurança e Normas | NurseNest",
    description: "Guia de mudanças regulatórias que afetam a prática de enfermagem. Leis de proporções de pessoal, normas de segurança do paciente, telesaúde e requisitos de segurança no trabalho.",
    keywords: "mudanças regulatórias enfermagem, proporções pessoal, segurança paciente, telesaúde, normas prática enfermagem",
  },
  "/practice-questions": {
    title: "Questões Práticas Gratuitas – Revisão de Enfermagem | NurseNest",
    description: "Acesse questões práticas gratuitas para revisão de enfermagem. Conteúdo alinhado a exames com justificativas detalhadas para cada resposta.",
    keywords: "questões práticas gratuitas enfermagem, revisão NCLEX grátis, questões exame enfermagem grátis",
  },
  "/nclex-rn-practice-questions": {
    title: "Questões Práticas NCLEX-RN – Preparação para Exame | NurseNest",
    description: "Prepare-se para o NCLEX-RN com questões práticas direcionadas. Raciocínio clínico, justificativas detalhadas e conteúdo alinhado aos domínios do exame.",
    keywords: "questões práticas NCLEX-RN, preparação NCLEX-RN, revisão NCLEX-RN, exame RN questões",
  },
  "/nclex-pn-practice-questions": {
    title: "Questões Práticas NCLEX-PN – Preparação para Exame | NurseNest",
    description: "Prepare-se para o NCLEX-PN com questões práticas adaptadas. Conteúdo RPN/LVN com justificativas clínicas e acompanhamento de desempenho.",
    keywords: "questões práticas NCLEX-PN, preparação NCLEX-PN, revisão RPN, exame PN questões",
  },
  "/rex-pn-practice-questions": {
    title: "Questões Práticas REx-PN – Preparação para Exame Canadá | NurseNest",
    description: "Prepare-se para o REx-PN com questões práticas projetadas para enfermeiros no Canadá. Conteúdo adaptado às normas canadenses.",
    keywords: "questões práticas REx-PN, preparação REx-PN Canadá, exame RPN Canadá, revisão REx-PN",
  },
  "/np-exam-practice-questions": {
    title: "Questões Práticas Exame NP – Certificação Enfermeiro Praticante | NurseNest",
    description: "Prepare-se para seu exame de certificação NP com questões práticas avançadas. Conteúdo AANP e ANCC com justificativas clínicas detalhadas.",
    keywords: "questões práticas NP, preparação exame NP, certificação enfermeiro praticante, revisão AANP ANCC",
  },
  "/diagnostic-assessment": {
    title: "Avaliação Diagnóstica – Teste Seu Nível | NurseNest",
    description: "Avalie seu nível atual com nossa avaliação diagnóstica. Identifique seus pontos fortes e fracos para otimizar seu plano de revisão NCLEX.",
    keywords: "avaliação diagnóstica enfermagem, teste de nível NCLEX, diagnóstico preparação exame, avaliação conhecimentos enfermagem",
  },
  "/medication-mastery": {
    title: "Domínio de Medicamentos – Farmacologia de Enfermagem | NurseNest",
    description: "Domine a farmacologia de enfermagem com nossas ferramentas de revisão. Classes de medicamentos, efeitos colaterais, contraindicações e cálculos de dosagem.",
    keywords: "farmacologia enfermagem, domínio medicamentos, revisão farmacologia NCLEX, classes medicamentos enfermagem",
  },
  "/lectures": {
    title: "Videoaulas – Lições Clínicas em Vídeo | NurseNest",
    description: "Assista videoaulas sobre fisiopatologia, farmacologia e enfermagem. Conteúdo pedagógico estruturado por sistema corporal e nível.",
    keywords: "videoaulas enfermagem, lições vídeo enfermagem, fisiopatologia vídeo, aulas clínicas online",
  },
  "/nclex-rn-guide": {
    title: "Guia NCLEX-RN – Tudo para Passar | NurseNest",
    description: "Guia completo para passar no NCLEX-RN. Formato do exame, domínios de conteúdo, estratégias de preparação e recursos de estudo recomendados.",
    keywords: "guia NCLEX-RN, passar NCLEX-RN, preparação NCLEX-RN guia, estratégias exame RN",
  },
  "/rex-pn-guide": {
    title: "Guia REx-PN – Preparação para Exame Canadá | NurseNest",
    description: "Guia completo para o REx-PN no Canadá. Formato do exame, competências avaliadas e estratégias de preparação para enfermeiros canadenses.",
    keywords: "guia REx-PN, preparação REx-PN Canadá, exame RPN guia, passar REx-PN",
  },
  "/np-exam-guide": {
    title: "Guia Exame NP – Certificação Enfermeiro Praticante | NurseNest",
    description: "Guia completo para exames de certificação NP. Cobre exames AANP, ANCC e especialidades FNP, AGPCNP, PMHNP e mais.",
    keywords: "guia exame NP, certificação enfermeiro praticante guia, preparação AANP ANCC, passar exame NP",
  },
  "/pathways": {
    title: "Percursos de Aprendizagem – Progressão Estruturada | NurseNest",
    description: "Siga percursos de aprendizagem estruturados para progredir do nível fundamental ao avançado. Progressão guiada para cada especialidade de enfermagem.",
    keywords: "percursos aprendizagem enfermagem, progressão estruturada, percurso estudo NCLEX, programa revisão enfermagem",
  },
  "/shop": {
    title: "Loja – Recursos de Estudo e Pacotes de Exame | NurseNest",
    description: "Descubra nossos pacotes de exame imprimíveis, guias de estudo e recursos de revisão para preparação de exames de enfermagem.",
    keywords: "loja NurseNest, pacotes exame enfermagem, recursos estudo, guias revisão NCLEX",
  },
  "/international-nurses": {
      title: "Enfermeiros Internacionais – Guia de Enfermagem Global | NurseNest",
      description: "Guia completo para enfermeiros formados internacionalmente: licenciamento, exames, avaliação de credenciais, rotas migratórias e oportunidades de emprego no mundo.",
      keywords: "enfermeiros internacionais, licença enfermagem estrangeira, migração enfermagem, NCLEX internacional, exame enfermagem Canadá",
    },
};

const vietnameseMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – Ôn thi Điều dưỡng | Câu hỏi NCLEX & Ngân hàng đề thi",
    description: "Chuẩn bị kỳ thi điều dưỡng với NurseNest. Truy cập hàng ngàn câu hỏi luyện tập NCLEX, mô phỏng lâm sàng, thẻ ghi nhớ và bài học sinh lý bệnh. Dành cho sinh viên RPN, RN và NP tại Canada và Hoa Kỳ.",
    keywords: "câu hỏi luyện tập NCLEX, ôn thi điều dưỡng, ngân hàng câu hỏi điều dưỡng, thẻ ghi nhớ điều dưỡng, ôn tập NCLEX, mô phỏng lâm sàng, sinh lý bệnh điều dưỡng, kỳ thi điều dưỡng Canada",
  },
  "/pricing": {
    title: "Bảng giá & Các gói | NurseNest – Ôn thi Điều dưỡng",
    description: "So sánh các gói NurseNest cho ôn thi điều dưỡng. Bao gồm truy cập miễn phí. Gói hàng tháng hợp lý với ngân hàng câu hỏi NCLEX, mô phỏng lâm sàng và thẻ ghi nhớ.",
    keywords: "bảng giá NurseNest, gói ôn thi NCLEX, giá kỳ thi điều dưỡng, đăng ký ôn tập NCLEX, giá ôn thi điều dưỡng",
  },
  "/lessons": {
    title: "Bài học Lâm sàng – Sinh lý bệnh & Điều dưỡng | NurseNest",
    description: "Khám phá bài học lâm sàng chuyên sâu về sinh lý bệnh, dược lý và lý luận lâm sàng. Nội dung được sắp xếp theo hệ cơ thể cho RPN, RN và NP.",
    keywords: "bài học điều dưỡng, sinh lý bệnh điều dưỡng, khóa học lâm sàng, lý luận lâm sàng, dược lý điều dưỡng, ôn tập NCLEX bài học",
  },
  "/flashcards": {
    title: "Thẻ ghi nhớ Điều dưỡng – Dược lý & Ôn tập | NurseNest",
    description: "Học với thẻ ghi nhớ điều dưỡng đã xác minh lâm sàng. Dược lý, giá trị xét nghiệm và sinh lý bệnh với chế độ Học và Kiểm tra. Tạo bộ thẻ riêng.",
    keywords: "thẻ ghi nhớ điều dưỡng, flashcard dược lý, ôn tập NCLEX thẻ, thẻ ghi nhớ ôn thi, học điều dưỡng",
  },
  "/mock-exams": {
    title: "Thi thử NCLEX – Mô phỏng có giới hạn thời gian | NurseNest",
    description: "Mô phỏng điều kiện thi thực với thi thử NCLEX có giới hạn thời gian. Lựa chọn câu hỏi thích ứng, theo dõi hiệu suất và giải thích chi tiết.",
    keywords: "thi thử NCLEX, mô phỏng kỳ thi điều dưỡng, bài thi luyện tập có giờ, ôn thi điều dưỡng, thi thử NCLEX",
  },
  "/test-bank": {
    title: "Ngân hàng Câu hỏi Điều dưỡng – Câu hỏi Luyện tập NCLEX | NurseNest",
    description: "Truy cập ngân hàng câu hỏi điều dưỡng toàn diện. Lọc theo hệ cơ thể, cấp độ và chủ đề. Mỗi câu hỏi có giải thích chi tiết cho ôn tập NCLEX.",
    keywords: "ngân hàng câu hỏi điều dưỡng, câu hỏi luyện tập NCLEX, trắc nghiệm điều dưỡng, ngân hàng đề thi, câu hỏi kỳ thi điều dưỡng",
  },
  "/question-bank": {
    title: "Ngân hàng Câu hỏi Điều dưỡng – Câu hỏi Luyện tập NCLEX | NurseNest",
    description: "Truy cập ngân hàng câu hỏi điều dưỡng toàn diện. Lọc theo hệ cơ thể, cấp độ và chủ đề. Mỗi câu hỏi có giải thích chi tiết cho ôn tập NCLEX.",
    keywords: "ngân hàng câu hỏi điều dưỡng, câu hỏi luyện tập NCLEX, trắc nghiệm điều dưỡng, ngân hàng đề thi, câu hỏi kỳ thi điều dưỡng",
  },
  "/simulators": {
    title: "Mô phỏng Lâm sàng – Kịch bản Tương tác | NurseNest",
    description: "Luyện tập phán đoán lâm sàng với mô phỏng tương tác. Kịch bản bệnh nhân phân nhánh bao gồm nhiễm trùng huyết, nhồi máu cơ tim, DKA và suy giảm bệnh nhân.",
    keywords: "mô phỏng lâm sàng điều dưỡng, mô phỏng bệnh nhân, phán đoán lâm sàng, kịch bản điều dưỡng, mô phỏng chăm sóc điều dưỡng",
  },
  "/free-practice": {
    title: "Câu hỏi Luyện tập Miễn phí – Ôn tập NCLEX | NurseNest",
    description: "Bắt đầu ôn thi NCLEX với câu hỏi luyện tập miễn phí. Giải thích chi tiết, lý luận lâm sàng và nội dung phù hợp kỳ thi. Không cần thẻ tín dụng.",
    keywords: "câu hỏi luyện tập NCLEX miễn phí, ôn tập NCLEX miễn phí, câu hỏi điều dưỡng miễn phí, ôn thi điều dưỡng miễn phí",
  },
  "/anatomy": {
    title: "Giải phẫu & Sinh lý – Ôn tập Miễn phí | NurseNest",
    description: "Nắm vững giải phẫu và sinh lý với ôn tập miễn phí, tương tác. Tất cả hệ cơ thể với bài tập ghi nhãn và nội dung giáo dục chi tiết.",
    keywords: "giải phẫu sinh lý điều dưỡng, ôn tập giải phẫu miễn phí, hệ cơ thể, giải phẫu điều dưỡng, ôn tập A&P",
  },
  "/pre-nursing": {
    title: "Tiền Điều dưỡng – Nền tảng & Module Miễn phí | NurseNest",
    description: "Khám phá các module tiền điều dưỡng miễn phí, tương tác. Sinh học tế bào, sinh lý, thuật ngữ y khoa và cơ bản dược lý để xây dựng nền tảng lâm sàng.",
    keywords: "tiền điều dưỡng, nền tảng điều dưỡng, sinh học tế bào điều dưỡng, thuật ngữ y khoa, cơ bản dược lý",
  },
  "/healthcare-policy-and-updates": {
    title: "Chính sách Y tế & Cập nhật — Thay đổi Quy định Điều dưỡng | NurseNest",
    description: "Cập nhật các thay đổi chính sách y tế ảnh hưởng đến điều dưỡng viên. Hướng dẫn về cập nhật cấp phép, tuyển dụng quốc tế, thay đổi định dạng thi và phát triển quy định.",
    keywords: "chính sách y tế điều dưỡng, thay đổi quy định, cấp phép điều dưỡng, tuyển dụng quốc tế, cập nhật thi, quy định điều dưỡng",
  },
  "/healthcare-policy-and-updates/licensing-policy-changes": {
    title: "Thay đổi Chính sách Cấp phép Điều dưỡng | NurseNest",
    description: "Hướng dẫn toàn diện về thay đổi chính sách cấp phép điều dưỡng bao gồm cập nhật Compact, thay đổi phạm vi hành nghề và yêu cầu gia hạn.",
    keywords: "thay đổi cấp phép điều dưỡng, compact điều dưỡng, phạm vi hành nghề, gia hạn giấy phép",
  },
  "/healthcare-policy-and-updates/international-nursing-recruitment": {
    title: "Tuyển dụng Điều dưỡng Quốc tế — Đánh giá Bằng cấp | NurseNest",
    description: "Hướng dẫn chính sách tuyển dụng điều dưỡng quốc tế. Đánh giá bằng cấp, con đường nhập cư, chương trình chuyển tiếp.",
    keywords: "tuyển dụng điều dưỡng quốc tế, đánh giá bằng cấp, chương trình chuyển tiếp, visa điều dưỡng",
  },
  "/healthcare-policy-and-updates/exam-format-updates": {
    title: "Cập nhật Định dạng Thi Điều dưỡng — NGN & CAT | NurseNest",
    description: "Theo dõi thay đổi định dạng thi điều dưỡng. Hướng dẫn về cập nhật NGN NCLEX, thay đổi kiểm tra thích ứng và sửa đổi báo cáo điểm.",
    keywords: "cập nhật định dạng thi NCLEX, NGN, kiểm tra thích ứng, báo cáo điểm",
  },
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses": {
    title: "Thay đổi Quy định Ảnh hưởng Điều dưỡng | NurseNest",
    description: "Hướng dẫn thay đổi quy định ảnh hưởng thực hành điều dưỡng. Luật tỷ lệ nhân sự, tiêu chuẩn an toàn bệnh nhân, y tế từ xa.",
    keywords: "thay đổi quy định điều dưỡng, tỷ lệ nhân sự, an toàn bệnh nhân, y tế từ xa",
  },
  "/clinical-clarity": {
    title: "Rõ ràng Lâm sàng – Câu trả lời Dựa trên Bằng chứng | NurseNest",
    description: "Nhận câu trả lời rõ ràng, dựa trên bằng chứng cho các câu hỏi lâm sàng thường trả lời sai trong kỳ thi. Nội dung có cơ sở khoa học cho sinh viên điều dưỡng.",
    keywords: "rõ ràng lâm sàng điều dưỡng, câu trả lời lâm sàng, lý luận lâm sàng, câu hỏi thường gặp kỳ thi điều dưỡng",
  },
  "/study-plan": {
    title: "Kế hoạch Học tập Cá nhân – Ôn thi NCLEX | NurseNest",
    description: "Tạo kế hoạch học tập cá nhân cho ôn thi NCLEX. Lộ trình có cấu trúc phù hợp với cấp độ và mục tiêu thi của bạn.",
    keywords: "kế hoạch học tập NCLEX, lập kế hoạch ôn thi điều dưỡng, lộ trình học tập, chương trình ôn tập NCLEX",
  },
  "/faq": {
    title: "Câu hỏi Thường gặp (FAQ) | NurseNest",
    description: "Tìm câu trả lời cho các câu hỏi về NurseNest. Thông tin về đăng ký, nội dung giáo dục, ôn thi và tính năng nền tảng.",
    keywords: "FAQ NurseNest, câu hỏi thường gặp, trợ giúp NurseNest, hỗ trợ nền tảng điều dưỡng",
  },
  "/contact": {
    title: "Liên hệ | NurseNest – Hỗ trợ & Câu hỏi",
    description: "Liên hệ đội ngũ NurseNest cho bất kỳ câu hỏi, ý kiến hoặc yêu cầu hỗ trợ nào. Chúng tôi luôn sẵn sàng giúp bạn trong hành trình ôn thi điều dưỡng.",
    keywords: "liên hệ NurseNest, hỗ trợ NurseNest, trợ giúp ôn thi điều dưỡng",
  },
  "/blog": {
    title: "Blog Giáo dục Lâm sàng – Bài viết Điều dưỡng | NurseNest",
    description: "Bài viết giáo dục lâm sàng dựa trên bằng chứng. Lý luận lâm sàng, sinh lý bệnh, dược lý và chiến lược ôn thi. Trích dẫn APA 7.",
    keywords: "blog điều dưỡng, bài viết lâm sàng, giáo dục điều dưỡng, blog lý luận lâm sàng, bài viết dược lý",
  },
  "/med-math": {
    title: "Tính toán Thuốc – Luyện tập Toán Điều dưỡng | NurseNest",
    description: "Luyện tập tính liều lượng và toán dược với bài tập tương tác. Giải pháp từng bước và công thức thiết yếu cho kỳ thi điều dưỡng.",
    keywords: "tính toán thuốc điều dưỡng, toán dược, liều lượng thuốc, tính tốc độ truyền dịch, toán điều dưỡng",
  },
  "/lab-values": {
    title: "Giá trị Xét nghiệm – Phiên giải Điều dưỡng | NurseNest",
    description: "Nắm vững phiên giải giá trị xét nghiệm. Khoảng bình thường, ý nghĩa lâm sàng của kết quả bất thường và hành động điều dưỡng tương ứng.",
    keywords: "giá trị xét nghiệm điều dưỡng, phiên giải kết quả xét nghiệm, giá trị bình thường, phân tích máu điều dưỡng",
  },
  "/question-of-the-day": {
    title: "Câu hỏi Hàng ngày – Lý luận Lâm sàng Hàng ngày | NurseNest",
    description: "Nhận câu hỏi lý luận lâm sàng hàng ngày với giải thích chi tiết. Duy trì thói quen học tập cho ôn thi NCLEX.",
    keywords: "câu hỏi hàng ngày NCLEX, câu hỏi lâm sàng hàng ngày, ôn tập hàng ngày điều dưỡng, luyện tập hàng ngày NCLEX",
  },
  "/compare": {
    title: "So sánh Các gói – NurseNest vs Các lựa chọn khác | NurseNest",
    description: "So sánh các gói NurseNest và khám phá tại sao NurseNest cung cấp nhiều tính năng hơn với giá hợp lý hơn UWorld và Archer cho ôn thi NCLEX.",
    keywords: "so sánh NurseNest, NurseNest vs UWorld, so sánh ôn thi NCLEX, ôn thi NCLEX tốt nhất giá",
  },
  "/glossary": {
    title: "Từ điển Điều dưỡng – Thuật ngữ Y khoa | NurseNest",
    description: "Tra cứu từ điển thuật ngữ điều dưỡng và y khoa toàn diện. Định nghĩa rõ ràng cho thuật ngữ sử dụng trong chăm sóc điều dưỡng và kỳ thi.",
    keywords: "từ điển điều dưỡng, thuật ngữ y khoa, định nghĩa điều dưỡng, từ vựng điều dưỡng",
  },
  "/practice-questions": {
    title: "Câu hỏi Luyện tập Miễn phí – Ôn tập Điều dưỡng | NurseNest",
    description: "Truy cập câu hỏi luyện tập miễn phí cho ôn tập điều dưỡng. Nội dung phù hợp kỳ thi với giải thích chi tiết cho mỗi đáp án.",
    keywords: "câu hỏi luyện tập miễn phí điều dưỡng, ôn tập NCLEX miễn phí, câu hỏi kỳ thi điều dưỡng miễn phí",
  },
  "/nclex-rn-practice-questions": {
    title: "Câu hỏi Luyện tập NCLEX-RN – Ôn thi | NurseNest",
    description: "Chuẩn bị NCLEX-RN với câu hỏi luyện tập có mục tiêu. Lý luận lâm sàng, giải thích chi tiết và nội dung phù hợp các lĩnh vực thi.",
    keywords: "câu hỏi luyện tập NCLEX-RN, ôn thi NCLEX-RN, ôn tập NCLEX-RN, câu hỏi kỳ thi RN",
  },
  "/nclex-pn-practice-questions": {
    title: "Câu hỏi Luyện tập NCLEX-PN – Ôn thi | NurseNest",
    description: "Chuẩn bị NCLEX-PN với câu hỏi luyện tập phù hợp. Nội dung RPN/LVN với giải thích lâm sàng và theo dõi hiệu suất.",
    keywords: "câu hỏi luyện tập NCLEX-PN, ôn thi NCLEX-PN, ôn tập RPN, câu hỏi kỳ thi PN",
  },
  "/rex-pn-practice-questions": {
    title: "Câu hỏi Luyện tập REx-PN – Ôn thi Canada | NurseNest",
    description: "Chuẩn bị REx-PN với câu hỏi luyện tập thiết kế cho điều dưỡng thực hành tại Canada. Nội dung phù hợp tiêu chuẩn Canada.",
    keywords: "câu hỏi luyện tập REx-PN, ôn thi REx-PN Canada, kỳ thi RPN Canada, ôn tập REx-PN",
  },
  "/np-exam-practice-questions": {
    title: "Câu hỏi Luyện tập Kỳ thi NP – Chứng chỉ Điều dưỡng Chuyên khoa | NurseNest",
    description: "Chuẩn bị kỳ thi chứng chỉ NP với câu hỏi luyện tập nâng cao. Nội dung AANP và ANCC với giải thích lâm sàng chuyên sâu.",
    keywords: "câu hỏi luyện tập NP, ôn thi NP, chứng chỉ điều dưỡng chuyên khoa, ôn tập AANP ANCC",
  },
  "/diagnostic-assessment": {
    title: "Đánh giá Chẩn đoán – Kiểm tra Trình độ | NurseNest",
    description: "Đánh giá trình độ hiện tại với bài đánh giá chẩn đoán. Xác định điểm mạnh và điểm yếu để tối ưu kế hoạch ôn thi NCLEX.",
    keywords: "đánh giá chẩn đoán điều dưỡng, kiểm tra trình độ NCLEX, chẩn đoán ôn thi, đánh giá kiến thức điều dưỡng",
  },
  "/medication-mastery": {
    title: "Thành thạo Thuốc – Dược lý Điều dưỡng | NurseNest",
    description: "Thành thạo dược lý điều dưỡng với công cụ ôn tập. Nhóm thuốc, tác dụng phụ, chống chỉ định và tính toán liều lượng.",
    keywords: "dược lý điều dưỡng, thành thạo thuốc, ôn tập dược lý NCLEX, nhóm thuốc điều dưỡng",
  },
  "/lectures": {
    title: "Bài giảng Video – Bài học Lâm sàng Video | NurseNest",
    description: "Xem bài giảng video về sinh lý bệnh, dược lý và chăm sóc điều dưỡng. Nội dung giáo dục được sắp xếp theo hệ cơ thể và cấp độ.",
    keywords: "bài giảng video điều dưỡng, bài học video điều dưỡng, video sinh lý bệnh, khóa học lâm sàng trực tuyến",
  },
  "/nclex-rn-guide": {
    title: "Hướng dẫn NCLEX-RN – Tất cả để Đỗ | NurseNest",
    description: "Hướng dẫn toàn diện để đỗ NCLEX-RN. Hình thức thi, lĩnh vực nội dung, chiến lược ôn thi và tài liệu học tập được đề xuất.",
    keywords: "hướng dẫn NCLEX-RN, đỗ NCLEX-RN, hướng dẫn ôn thi NCLEX-RN, chiến lược kỳ thi RN",
  },
  "/rex-pn-guide": {
    title: "Hướng dẫn REx-PN – Ôn thi Canada | NurseNest",
    description: "Hướng dẫn toàn diện cho REx-PN tại Canada. Hình thức thi, năng lực được đánh giá và chiến lược ôn thi cho điều dưỡng Canada.",
    keywords: "hướng dẫn REx-PN, ôn thi REx-PN Canada, hướng dẫn kỳ thi RPN, đỗ REx-PN",
  },
  "/np-exam-guide": {
    title: "Hướng dẫn Kỳ thi NP – Chứng chỉ Điều dưỡng Chuyên khoa | NurseNest",
    description: "Hướng dẫn toàn diện cho kỳ thi chứng chỉ NP. Bao gồm AANP, ANCC và các chuyên ngành FNP, AGPCNP, PMHNP và hơn nữa.",
    keywords: "hướng dẫn kỳ thi NP, hướng dẫn chứng chỉ điều dưỡng chuyên khoa, ôn thi AANP ANCC, đỗ kỳ thi NP",
  },
  "/pathways": {
    title: "Lộ trình Học tập – Tiến trình Có cấu trúc | NurseNest",
    description: "Theo dõi lộ trình học tập có cấu trúc để tiến bộ từ cấp nền tảng đến nâng cao. Tiến trình có hướng dẫn cho mỗi chuyên ngành điều dưỡng.",
    keywords: "lộ trình học tập điều dưỡng, tiến trình có cấu trúc, lộ trình ôn thi NCLEX, chương trình ôn tập điều dưỡng",
  },
  "/shop": {
    title: "Cửa hàng – Tài liệu Học tập & Bộ đề Thi | NurseNest",
    description: "Khám phá bộ đề thi in được, hướng dẫn học tập và tài liệu ôn tập cho ôn thi điều dưỡng.",
    keywords: "cửa hàng NurseNest, bộ đề thi điều dưỡng, tài liệu học tập, hướng dẫn ôn tập NCLEX",
  },
  "/international-nurses": {
      title: "Điều dưỡng Quốc tế – Hướng dẫn Hành nghề Điều dưỡng Toàn cầu | NurseNest",
      description: "Hướng dẫn toàn diện cho điều dưỡng viên quốc tế: cấp phép, thi cử, đánh giá bằng cấp, lộ trình di cư và cơ hội việc làm trên toàn thế giới.",
      keywords: "điều dưỡng quốc tế, giấy phép điều dưỡng nước ngoài, di cư điều dưỡng, NCLEX quốc tế",
    },
};

const filipinoMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – Paghahanda sa Exam ng Nursing | NCLEX Questions & Question Bank",
    description: "Maghanda para sa iyong nursing exam gamit ang NurseNest. I-access ang libu-libong NCLEX practice questions, clinical simulations, nursing flashcards at pathophysiology lessons. Para sa RPN, RN at NP students sa Canada at US.",
    keywords: "NCLEX practice questions, paghahanda sa nursing exam, nursing question bank, nursing flashcards, NCLEX review, clinical simulations, pathophysiology nursing, nursing exam Canada",
  },
  "/pricing": {
    title: "Presyo & Mga Plano | NurseNest – Paghahanda sa Nursing Exam",
    description: "Ihambing ang mga plano ng NurseNest para sa paghahanda sa nursing exam. May libreng access. Abot-kayang monthly plans na may NCLEX question bank, clinical simulations at flashcards.",
    keywords: "presyo NurseNest, NCLEX prep plans, nursing exam cost, NCLEX review subscription",
  },
  "/lessons": {
    title: "Clinical Lessons – Pathophysiology & Nursing | NurseNest",
    description: "Tuklasin ang detalyadong clinical lessons tungkol sa pathophysiology, pharmacology at clinical reasoning. Nakaayos ayon sa body system para sa RPN, RN at NP.",
    keywords: "nursing lessons, pathophysiology nursing, clinical courses, clinical reasoning, pharmacology nursing",
  },
  "/flashcards": {
    title: "Nursing Flashcards – Pharmacology & Review | NurseNest",
    description: "Mag-aral gamit ang clinically-verified nursing flashcards. Pharmacology, lab values at pathophysiology na may Learn at Test modes. Gumawa ng sariling decks.",
    keywords: "nursing flashcards, pharmacology flashcards, NCLEX review cards, nursing study cards",
  },
  "/mock-exams": {
    title: "NCLEX Mock Exams – Timed Simulation | NurseNest",
    description: "I-simulate ang totoong exam conditions gamit ang timed NCLEX mock exams. Adaptive question selection, performance tracking at detalyadong rationales.",
    keywords: "NCLEX mock exams, nursing exam simulation, timed practice exam, nursing exam prep",
  },
  "/free-practice": {
    title: "Libreng Practice Questions – NCLEX Review | NurseNest",
    description: "Simulan ang iyong NCLEX prep gamit ang libreng practice questions. Detalyadong rationales, clinical reasoning at exam-aligned content. Walang credit card needed.",
    keywords: "libreng NCLEX practice questions, free NCLEX review, free nursing questions",
  },
  "/international-nurses": {
      title: "International Nurses – Global Nursing Practice Guide | NurseNest",
      description: "Komprehensibong gabay para sa mga nurse na may international na edukasyon: licensure, exams, credential evaluation, migration pathways, at job opportunities sa buong mundo.",
      keywords: "international nurses, foreign nursing license, nursing migration, NCLEX international, nursing exam Canada",
    },
  "/healthcare-policy-and-updates": {
    title: "Healthcare Policy & Updates — Mga Pagbabago sa Regulasyon ng Nursing | NurseNest",
    description: "Manatiling updated sa mga pagbabago sa healthcare policy na nakakaapekto sa mga nurse. Gabay sa licensing updates, international recruitment, exam format changes, at regulatory developments.",
    keywords: "healthcare policy nursing, regulatory changes, nursing licensing, international nurse recruitment, exam updates",
  },
  "/healthcare-policy-and-updates/licensing-policy-changes": {
    title: "Mga Pagbabago sa Nursing Licensing Policy | NurseNest",
    description: "Komprehensibong gabay sa mga pagbabago sa nursing licensing policy kabilang ang Compact updates, scope of practice changes, at renewal requirements.",
    keywords: "nursing licensing changes, compact nursing, scope of practice, license renewal",
  },
  "/healthcare-policy-and-updates/international-nursing-recruitment": {
    title: "International Nursing Recruitment — Credential Evaluation | NurseNest",
    description: "Gabay sa international nursing recruitment policies. Credential evaluation, immigration pathways, bridging programs.",
    keywords: "international nurse recruitment, credential evaluation, bridging programs, nurse visa",
  },
  "/healthcare-policy-and-updates/exam-format-updates": {
    title: "Mga Update sa Nursing Exam Format — NGN & CAT | NurseNest",
    description: "Sundan ang mga pagbabago sa nursing exam format. Gabay sa NGN NCLEX updates, adaptive testing changes, at score reporting modifications.",
    keywords: "NCLEX exam format updates, NGN, adaptive testing, score reporting",
  },
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses": {
    title: "Mga Regulatory Changes na Nakakaapekto sa Nurses | NurseNest",
    description: "Gabay sa mga regulatory changes na nakakaapekto sa nursing practice. Staffing ratio laws, patient safety regulations, telehealth.",
    keywords: "nursing regulatory changes, staffing ratios, patient safety, telehealth",
  },
};

const traditionalChineseMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – 護理考試準備 | NCLEX題庫與練習題",
    description: "使用NurseNest準備護理考試。存取數千道NCLEX練習題、臨床模擬、護理記憶卡和病理生理學課程。適用於加拿大和美國的RPN、RN和NP學生。",
    keywords: "NCLEX練習題, 護理考試準備, 護理題庫, 護理記憶卡, NCLEX複習, 臨床模擬, 病理生理學護理, 護理考試加拿大",
  },
  "/pricing": {
    title: "價格與方案 | NurseNest – 護理考試準備",
    description: "比較NurseNest護理考試準備方案。含免費存取。每月實惠方案含NCLEX題庫、臨床模擬和記憶卡。",
    keywords: "NurseNest價格, NCLEX準備方案, 護理考試費用, NCLEX複習訂閱",
  },
  "/lessons": {
    title: "臨床課程 – 病理生理學與護理 | NurseNest",
    description: "探索深入的病理生理學、藥理學和臨床推理課程。按身體系統分類，適用於RPN、RN和NP。",
    keywords: "護理課程, 病理生理學護理, 臨床課程, 臨床推理, 藥理學護理",
  },
  "/flashcards": {
    title: "護理記憶卡 – 藥理學與複習 | NurseNest",
    description: "使用經臨床驗證的護理記憶卡學習。藥理學、實驗室數值和病理生理學，含學習和測試模式。建立自己的牌組。",
    keywords: "護理記憶卡, 藥理學記憶卡, NCLEX複習卡, 護理學習卡",
  },
  "/mock-exams": {
    title: "NCLEX模擬考試 – 計時模擬 | NurseNest",
    description: "使用計時NCLEX模擬考試模擬真實考試條件。自適應題目選擇、成績追蹤和詳細解析。",
    keywords: "NCLEX模擬考試, 護理考試模擬, 計時練習考試, 護理考試準備",
  },
  "/free-practice": {
    title: "免費練習題 – NCLEX複習 | NurseNest",
    description: "使用免費練習題開始NCLEX準備。詳細解析、臨床推理和考試對齊內容。無需信用卡。",
    keywords: "免費NCLEX練習題, 免費NCLEX複習, 免費護理題目",
  },
  "/international-nurses": {
      title: "國際護理師 – 全球護理執業指南 | NurseNest",
      description: "為國際護理師提供的完整指南：執照、考試、學歷認證、移民途徑和全球就業機會。",
      keywords: "國際護理師, 海外護理執照, 護理移民, NCLEX國際, 護理考試加拿大",
    },
  "/healthcare-policy-and-updates": {
    title: "醫療政策與更新 — 護理法規變更 | NurseNest",
    description: "了解影響護理師的醫療政策變更。執照更新、國際招聘、考試格式變更和法規發展指南。",
    keywords: "醫療政策護理, 法規變更, 護理執照, 國際護理招聘, 考試更新, 護理法規",
  },
  "/healthcare-policy-and-updates/licensing-policy-changes": {
    title: "護理執照政策變更 — Compact執照、執業範圍 | NurseNest",
    description: "護理執照政策變更完整指南，包括執照Compact更新、執業範圍變更和續期要求。",
    keywords: "護理執照變更, 執照Compact, 執業範圍, 執照續期, 執照政策",
  },
  "/healthcare-policy-and-updates/international-nursing-recruitment": {
    title: "國際護理招聘 — 學歷評估與課程 | NurseNest",
    description: "國際護理招聘政策指南。學歷評估、移民途徑、過渡課程和招聘機構法規。",
    keywords: "國際護理招聘, 學歷評估, 過渡課程, 護理簽證, 招聘機構",
  },
  "/healthcare-policy-and-updates/exam-format-updates": {
    title: "護理考試格式更新 — NGN、CAT與成績報告 | NurseNest",
    description: "追蹤護理考試格式變更。NGN NCLEX更新、適應性測試變更和成績報告修改指南。",
    keywords: "NCLEX考試格式更新, NGN, 適應性測試, 成績報告, 護理考試變更",
  },
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses": {
    title: "影響護理師的法規變更 — 人員配置、安全與標準 | NurseNest",
    description: "影響護理實踐的法規變更指南。人員配置比例法律、病患安全法規、遠程醫療標準和工作場所安全要求。",
    keywords: "護理法規變更, 人員配置比例, 病患安全, 遠程醫療, 護理實踐標準",
  },
};

const germanMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – Pflegeprüfungsvorbereitung | NCLEX-Fragen & Fragenbank",
    description: "Bereiten Sie sich mit NurseNest auf Ihre Pflegeprüfung vor. Zugriff auf Tausende NCLEX-Übungsfragen, klinische Simulationen, Pflege-Lernkarten und Pathophysiologie-Lektionen. Für RPN-, RN- und NP-Studierende in Kanada und den USA.",
    keywords: "NCLEX Übungsfragen, Pflegeprüfungsvorbereitung, Pflege-Fragenbank, Pflege-Lernkarten, NCLEX-Wiederholung, klinische Simulationen, Pathophysiologie Pflege, Pflegeprüfung Kanada",
  },
  "/pricing": {
    title: "Preise & Pakete | NurseNest – Pflegeprüfungsvorbereitung",
    description: "Vergleichen Sie NurseNest-Pakete für die Pflegeprüfungsvorbereitung. Kostenloser Zugang inklusive. Erschwingliche Monatspakete mit NCLEX-Fragenbank, klinischen Simulationen und Lernkarten.",
    keywords: "NurseNest Preise, NCLEX-Vorbereitungspakete, Pflegeprüfungskosten, NCLEX-Wiederholungsabonnement",
  },
  "/lessons": {
    title: "Klinische Lektionen – Pathophysiologie & Pflege | NurseNest",
    description: "Entdecken Sie detaillierte klinische Lektionen zu Pathophysiologie, Pharmakologie und klinischem Denken. Nach Körpersystemen geordnet für RPN, RN und NP.",
    keywords: "Pflegelektionen, Pathophysiologie Pflege, klinische Kurse, klinisches Denken, Pharmakologie Pflege",
  },
  "/flashcards": {
    title: "Pflege-Lernkarten – Pharmakologie & Wiederholung | NurseNest",
    description: "Lernen Sie mit klinisch verifizierten Pflege-Lernkarten. Pharmakologie, Laborwerte und Pathophysiologie mit Lern- und Testmodus. Erstellen Sie eigene Decks.",
    keywords: "Pflege-Lernkarten, Pharmakologie-Lernkarten, NCLEX-Wiederholungskarten, Pflege-Lernkarten",
  },
  "/mock-exams": {
    title: "NCLEX-Probeprüfungen – Zeitsimulation | NurseNest",
    description: "Simulieren Sie reale Prüfungsbedingungen mit zeitgesteuerten NCLEX-Probeprüfungen. Adaptive Fragenauswahl, Leistungsverfolgung und detaillierte Erklärungen.",
    keywords: "NCLEX Probeprüfungen, Pflegeprüfungssimulation, zeitgesteuerte Übungsprüfung, Pflegeprüfungsvorbereitung",
  },
  "/free-practice": {
    title: "Kostenlose Übungsfragen – NCLEX-Wiederholung | NurseNest",
    description: "Starten Sie Ihre NCLEX-Vorbereitung mit kostenlosen Übungsfragen. Detaillierte Erklärungen, klinisches Denken und prüfungsrelevante Inhalte. Keine Kreditkarte erforderlich.",
    keywords: "kostenlose NCLEX-Übungsfragen, kostenlose NCLEX-Wiederholung, kostenlose Pflegefragen",
  },
  "/international-nurses": {
      title: "Internationale Pflegekräfte – Globaler Pflege-Leitfaden | NurseNest",
      description: "Umfassender Leitfaden für international ausgebildete Pflegekräfte: Lizenzierung, Prüfungen, Qualifikationsbewertung, Migrationswege und Beschäftigungsmöglichkeiten weltweit.",
      keywords: "internationale Pflegekräfte, ausländische Pflegelizenz, Pflegemigration, NCLEX international, Pflegeprüfung Kanada",
    },
  "/healthcare-policy-and-updates": {
    title: "Gesundheitspolitik & Aktualisierungen — Regulatorische Änderungen Pflege | NurseNest",
    description: "Bleiben Sie über gesundheitspolitische Änderungen informiert, die Pflegekräfte betreffen. Leitfäden zu Lizenzierungsaktualisierungen, internationaler Rekrutierung, Prüfungsformatänderungen und regulatorischen Entwicklungen.",
    keywords: "Gesundheitspolitik Pflege, regulatorische Änderungen, Pflegelizenzierung, internationale Pflegerekrutierung, Prüfungsaktualisierungen, Pflegeregulierung",
  },
  "/healthcare-policy-and-updates/licensing-policy-changes": {
    title: "Änderungen der Pflegelizenzierungspolitik — Compact, Praxisumfang | NurseNest",
    description: "Umfassender Leitfaden zu Änderungen der Pflegelizenzierungspolitik einschließlich Compact-Updates, Änderungen des Praxisumfangs und Verlängerungsanforderungen.",
    keywords: "Pflegelizenzierungsänderungen, Pflege-Compact, Praxisumfang, Lizenzverlängerung, Lizenzierungspolitik",
  },
  "/healthcare-policy-and-updates/international-nursing-recruitment": {
    title: "Internationale Pflegerekrutierung — Qualifikationsbewertung & Programme | NurseNest",
    description: "Leitfaden zur internationalen Pflegerekrutierungspolitik. Qualifikationsbewertung, Einwanderungswege, Übergangsprogramme und Agenturvorschriften.",
    keywords: "internationale Pflegerekrutierung, Qualifikationsbewertung, Übergangsprogramme, Pflegevisum, Rekrutierungsagenturen",
  },
  "/healthcare-policy-and-updates/exam-format-updates": {
    title: "Aktualisierungen des Pflegeprüfungsformats — NGN, CAT & Ergebnisberichte | NurseNest",
    description: "Verfolgen Sie Änderungen des Pflegeprüfungsformats. Leitfaden zu NGN-NCLEX-Updates, adaptiven Teständerungen und Ergebnisberichtsmodifikationen.",
    keywords: "NCLEX-Prüfungsformat-Updates, NGN, adaptiver Test, Ergebnisberichte, Pflegeprüfungsänderungen",
  },
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses": {
    title: "Regulatorische Änderungen für Pflegekräfte — Personal, Sicherheit & Standards | NurseNest",
    description: "Leitfaden zu regulatorischen Änderungen, die die Pflegepraxis betreffen. Personalverhältnisgesetze, Patientensicherheitsvorschriften, Telemedizinstandards und Arbeitssicherheitsanforderungen.",
    keywords: "regulatorische Pflegeänderungen, Personalverhältnisse, Patientensicherheit, Telemedizin, Pflegepraxisstandards",
  },
};

const thaiMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – เตรียมสอบพยาบาล | คำถาม NCLEX & คลังข้อสอบ",
    description: "เตรียมสอบพยาบาลกับ NurseNest เข้าถึงคำถามฝึกหัด NCLEX หลายพันข้อ การจำลองทางคลินิก แฟลชการ์ดพยาบาล และบทเรียนพยาธิสรีรวิทยา สำหรับนักศึกษา RPN, RN และ NP ในแคนาดาและสหรัฐอเมริกา",
    keywords: "คำถามฝึกหัด NCLEX, เตรียมสอบพยาบาล, คลังข้อสอบพยาบาล, แฟลชการ์ดพยาบาล, ทบทวน NCLEX, การจำลองทางคลินิก, พยาธิสรีรวิทยาพยาบาล, สอบพยาบาลแคนาดา",
  },
  "/pricing": {
    title: "ราคาและแพ็กเกจ | NurseNest – เตรียมสอบพยาบาล",
    description: "เปรียบเทียบแพ็กเกจ NurseNest สำหรับเตรียมสอบพยาบาล รวมการเข้าถึงฟรี แพ็กเกจรายเดือนราคาย่อมเยาพร้อมคลังข้อสอบ NCLEX การจำลองทางคลินิก และแฟลชการ์ด",
    keywords: "ราคา NurseNest, แพ็กเกจเตรียมสอบ NCLEX, ค่าใช้จ่ายสอบพยาบาล, สมัครสมาชิกทบทวน NCLEX",
  },
  "/lessons": {
    title: "บทเรียนคลินิก – พยาธิสรีรวิทยาและพยาบาล | NurseNest",
    description: "สำรวจบทเรียนคลินิกเชิงลึกเกี่ยวกับพยาธิสรีรวิทยา เภสัชวิทยา และการให้เหตุผลทางคลินิก จัดเรียงตามระบบร่างกายสำหรับ RPN, RN และ NP",
    keywords: "บทเรียนพยาบาล, พยาธิสรีรวิทยาพยาบาล, หลักสูตรคลินิก, การให้เหตุผลทางคลินิก, เภสัชวิทยาพยาบาล",
  },
  "/flashcards": {
    title: "แฟลชการ์ดพยาบาล – เภสัชวิทยาและทบทวน | NurseNest",
    description: "เรียนรู้ด้วยแฟลชการ์ดพยาบาลที่ได้รับการตรวจสอบทางคลินิก เภสัชวิทยา ค่าห้องปฏิบัติการ และพยาธิสรีรวิทยาพร้อมโหมดเรียนรู้และทดสอบ สร้างชุดของคุณเอง",
    keywords: "แฟลชการ์ดพยาบาล, แฟลชการ์ดเภสัชวิทยา, การ์ดทบทวน NCLEX, การ์ดเรียนพยาบาล",
  },
  "/mock-exams": {
    title: "สอบจำลอง NCLEX – จำลองแบบจับเวลา | NurseNest",
    description: "จำลองสภาวะสอบจริงด้วยสอบจำลอง NCLEX แบบจับเวลา การเลือกคำถามแบบปรับตัว ติดตามผลการเรียน และคำอธิบายโดยละเอียด",
    keywords: "สอบจำลอง NCLEX, จำลองสอบพยาบาล, สอบฝึกหัดแบบจับเวลา, เตรียมสอบพยาบาล",
  },
  "/free-practice": {
    title: "คำถามฝึกหัดฟรี – ทบทวน NCLEX | NurseNest",
    description: "เริ่มเตรียมสอบ NCLEX ด้วยคำถามฝึกหัดฟรี คำอธิบายโดยละเอียด การให้เหตุผลทางคลินิก และเนื้อหาตรงตามข้อสอบ ไม่ต้องใช้บัตรเครดิต",
    keywords: "คำถามฝึกหัด NCLEX ฟรี, ทบทวน NCLEX ฟรี, คำถามพยาบาลฟรี",
  },
  "/international-nurses": {
      title: "พยาบาลนานาชาติ – คู่มือการพยาบาลระดับโลก | NurseNest",
      description: "คู่มือฉบับสมบูรณ์สำหรับพยาบาลที่ศึกษาในต่างประเทศ: ใบอนุญาต, การสอบ, การประเมินคุณวุฒิ, เส้นทางการย้ายถิ่นฐาน และโอกาสการจ้างงานทั่วโลก",
      keywords: "พยาบาลนานาชาติ, ใบอนุญาตพยาบาลต่างประเทศ, การอพยพพยาบาล, NCLEX นานาชาติ",
    },
  "/healthcare-policy-and-updates": {
    title: "นโยบายสุขภาพและการอัปเดต — การเปลี่ยนแปลงกฎระเบียบพยาบาล | NurseNest",
    description: "ติดตามการเปลี่ยนแปลงนโยบายสุขภาพที่ส่งผลต่อพยาบาล คู่มือเกี่ยวกับการอัปเดตใบอนุญาต การสรรหาบุคลากรระหว่างประเทศ การเปลี่ยนแปลงรูปแบบการสอบ และพัฒนาการด้านกฎระเบียบ",
    keywords: "นโยบายสุขภาพพยาบาล, การเปลี่ยนแปลงกฎระเบียบ, ใบอนุญาตพยาบาล, การสรรหาพยาบาลนานาชาติ, อัปเดตการสอบ",
  },
  "/healthcare-policy-and-updates/licensing-policy-changes": {
    title: "การเปลี่ยนแปลงนโยบายใบอนุญาตพยาบาล | NurseNest",
    description: "คู่มือฉบับสมบูรณ์เกี่ยวกับการเปลี่ยนแปลงนโยบายใบอนุญาตพยาบาล รวมถึงการอัปเดต Compact การเปลี่ยนแปลงขอบเขตการปฏิบัติ และข้อกำหนดการต่ออายุ",
    keywords: "การเปลี่ยนแปลงใบอนุญาตพยาบาล, compact พยาบาล, ขอบเขตการปฏิบัติ, ต่ออายุใบอนุญาต",
  },
  "/healthcare-policy-and-updates/international-nursing-recruitment": {
    title: "การสรรหาพยาบาลนานาชาติ — การประเมินคุณวุฒิ | NurseNest",
    description: "คู่มือนโยบายการสรรหาพยาบาลนานาชาติ การประเมินคุณวุฒิ เส้นทางการย้ายถิ่นฐาน โปรแกรมเชื่อมต่อ",
    keywords: "การสรรหาพยาบาลนานาชาติ, การประเมินคุณวุฒิ, โปรแกรมเชื่อมต่อ, วีซ่าพยาบาล",
  },
  "/healthcare-policy-and-updates/exam-format-updates": {
    title: "การอัปเดตรูปแบบการสอบพยาบาล — NGN & CAT | NurseNest",
    description: "ติดตามการเปลี่ยนแปลงรูปแบบการสอบพยาบาล คู่มือ NGN NCLEX การเปลี่ยนแปลงการทดสอบแบบปรับตัว และการแก้ไขรายงานคะแนน",
    keywords: "อัปเดตรูปแบบสอบ NCLEX, NGN, การทดสอบแบบปรับตัว, รายงานคะแนน",
  },
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses": {
    title: "การเปลี่ยนแปลงกฎระเบียบที่ส่งผลต่อพยาบาล | NurseNest",
    description: "คู่มือการเปลี่ยนแปลงกฎระเบียบที่ส่งผลต่อการปฏิบัติงานพยาบาล กฎหมายอัตราส่วนบุคลากร มาตรฐานความปลอดภัยผู้ป่วย การแพทย์ทางไกล",
    keywords: "การเปลี่ยนแปลงกฎระเบียบพยาบาล, อัตราส่วนบุคลากร, ความปลอดภัยผู้ป่วย, การแพทย์ทางไกล",
  },
};

const turkishMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – Hemşirelik Sınavı Hazırlığı | NCLEX Soruları & Soru Bankası",
    description: "NurseNest ile hemşirelik sınavınıza hazırlanın. Binlerce NCLEX pratik sorusu, klinik simülasyonlar, hemşirelik bilgi kartları ve patofizyoloji dersleri. Kanada ve ABD'deki RPN, RN ve NP öğrencileri için.",
    keywords: "NCLEX pratik soruları, hemşirelik sınavı hazırlığı, hemşirelik soru bankası, hemşirelik bilgi kartları, NCLEX tekrar, klinik simülasyonlar, patofizyoloji hemşirelik, hemşirelik sınavı Kanada",
  },
  "/pricing": {
    title: "Fiyatlar & Planlar | NurseNest – Hemşirelik Sınavı Hazırlığı",
    description: "Hemşirelik sınavı hazırlığı için NurseNest planlarını karşılaştırın. Ücretsiz erişim dahil. NCLEX soru bankası, klinik simülasyonlar ve bilgi kartları ile uygun fiyatlı aylık planlar.",
    keywords: "NurseNest fiyatlar, NCLEX hazırlık planları, hemşirelik sınavı maliyeti, NCLEX tekrar aboneliği",
  },
  "/lessons": {
    title: "Klinik Dersler – Patofizyoloji & Hemşirelik | NurseNest",
    description: "Patofizyoloji, farmakoloji ve klinik muhakeme hakkında ayrıntılı klinik dersleri keşfedin. RPN, RN ve NP için vücut sistemine göre düzenlenmiştir.",
    keywords: "hemşirelik dersleri, patofizyoloji hemşirelik, klinik kurslar, klinik muhakeme, farmakoloji hemşirelik",
  },
  "/flashcards": {
    title: "Hemşirelik Bilgi Kartları – Farmakoloji & Tekrar | NurseNest",
    description: "Klinik olarak doğrulanmış hemşirelik bilgi kartları ile çalışın. Farmakoloji, laboratuvar değerleri ve patofizyoloji, Öğrenme ve Test modları ile. Kendi destelerinizi oluşturun.",
    keywords: "hemşirelik bilgi kartları, farmakoloji bilgi kartları, NCLEX tekrar kartları, hemşirelik çalışma kartları",
  },
  "/mock-exams": {
    title: "NCLEX Deneme Sınavları – Zamanlı Simülasyon | NurseNest",
    description: "Zamanlı NCLEX deneme sınavları ile gerçek sınav koşullarını simüle edin. Uyarlanabilir soru seçimi, performans takibi ve ayrıntılı açıklamalar.",
    keywords: "NCLEX deneme sınavları, hemşirelik sınavı simülasyonu, zamanlı pratik sınav, hemşirelik sınavı hazırlığı",
  },
  "/free-practice": {
    title: "Ücretsiz Pratik Sorular – NCLEX Tekrar | NurseNest",
    description: "Ücretsiz pratik sorular ile NCLEX hazırlığınıza başlayın. Ayrıntılı açıklamalar, klinik muhakeme ve sınava uygun içerik. Kredi kartı gerekmez.",
    keywords: "ücretsiz NCLEX pratik soruları, ücretsiz NCLEX tekrar, ücretsiz hemşirelik soruları",
  },
  "/international-nurses": {
      title: "Uluslararası Hemşireler – Küresel Hemşirelik Kılavuzu | NurseNest",
      description: "Uluslararası eğitimli hemşireler için kapsamlı kılavuz: lisanslama, sınavlar, yeterlilik değerlendirmesi, göç yolları ve dünya genelinde istihdam fırsatları.",
      keywords: "uluslararası hemşireler, yabancı hemşirelik lisansı, hemşirelik göçü, NCLEX uluslararası, hemşirelik sınavı Kanada",
    },
  "/healthcare-policy-and-updates": {
    title: "Sağlık Politikası ve Güncellemeler — Hemşirelik Düzenleyici Değişiklikler | NurseNest",
    description: "Hemşireleri etkileyen sağlık politikası değişikliklerinden haberdar olun. Lisanslama güncellemeleri, uluslararası işe alım, sınav formatı değişiklikleri ve düzenleyici gelişmeler hakkında rehberler.",
    keywords: "sağlık politikası hemşirelik, düzenleyici değişiklikler, hemşirelik lisansı, uluslararası hemşire işe alımı, sınav güncellemeleri",
  },
  "/healthcare-policy-and-updates/licensing-policy-changes": {
    title: "Hemşirelik Lisanslama Politikası Değişiklikleri | NurseNest",
    description: "Hemşirelik lisanslama politikası değişiklikleri hakkında kapsamlı rehber. Compact güncellemeleri, uygulama kapsamı değişiklikleri ve yenileme gereklilikleri.",
    keywords: "hemşirelik lisans değişiklikleri, compact hemşirelik, uygulama kapsamı, lisans yenileme",
  },
  "/healthcare-policy-and-updates/international-nursing-recruitment": {
    title: "Uluslararası Hemşire İşe Alımı — Yeterlilik Değerlendirmesi | NurseNest",
    description: "Uluslararası hemşire işe alım politikaları rehberi. Yeterlilik değerlendirmesi, göç yolları, köprü programları.",
    keywords: "uluslararası hemşire işe alımı, yeterlilik değerlendirmesi, köprü programları, hemşire vizesi",
  },
  "/healthcare-policy-and-updates/exam-format-updates": {
    title: "Hemşirelik Sınav Formatı Güncellemeleri — NGN & CAT | NurseNest",
    description: "Hemşirelik sınav formatı değişikliklerini takip edin. NGN NCLEX güncellemeleri, adaptif test değişiklikleri ve puan raporlaması değişiklikleri rehberi.",
    keywords: "NCLEX sınav formatı güncellemeleri, NGN, adaptif test, puan raporları",
  },
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses": {
    title: "Hemşireleri Etkileyen Düzenleyici Değişiklikler | NurseNest",
    description: "Hemşirelik uygulamasını etkileyen düzenleyici değişiklikler rehberi. Personel oranı yasaları, hasta güvenliği düzenlemeleri, telesağlık.",
    keywords: "hemşirelik düzenleyici değişiklikler, personel oranları, hasta güvenliği, telesağlık",
  },
};

const indonesianMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – Persiapan Ujian Keperawatan | Soal NCLEX & Bank Soal",
    description: "Persiapkan ujian keperawatan Anda dengan NurseNest. Akses ribuan soal latihan NCLEX, simulasi klinis, kartu flash keperawatan, dan pelajaran patofisiologi. Untuk mahasiswa RPN, RN, dan NP di Kanada dan AS.",
    keywords: "soal latihan NCLEX, persiapan ujian keperawatan, bank soal keperawatan, kartu flash keperawatan, ulasan NCLEX, simulasi klinis, patofisiologi keperawatan, ujian keperawatan Kanada",
  },
  "/pricing": {
    title: "Harga & Paket | NurseNest – Persiapan Ujian Keperawatan",
    description: "Bandingkan paket NurseNest untuk persiapan ujian keperawatan. Termasuk akses gratis. Paket bulanan terjangkau dengan bank soal NCLEX, simulasi klinis, dan kartu flash.",
    keywords: "harga NurseNest, paket persiapan NCLEX, biaya ujian keperawatan, langganan ulasan NCLEX",
  },
  "/lessons": {
    title: "Pelajaran Klinis – Patofisiologi & Keperawatan | NurseNest",
    description: "Jelajahi pelajaran klinis mendalam tentang patofisiologi, farmakologi, dan penalaran klinis. Diatur berdasarkan sistem tubuh untuk RPN, RN, dan NP.",
    keywords: "pelajaran keperawatan, patofisiologi keperawatan, kursus klinis, penalaran klinis, farmakologi keperawatan",
  },
  "/flashcards": {
    title: "Kartu Flash Keperawatan – Farmakologi & Ulasan | NurseNest",
    description: "Belajar dengan kartu flash keperawatan yang terverifikasi secara klinis. Farmakologi, nilai laboratorium, dan patofisiologi dengan mode Belajar dan Tes. Buat dek Anda sendiri.",
    keywords: "kartu flash keperawatan, kartu flash farmakologi, kartu ulasan NCLEX, kartu belajar keperawatan",
  },
  "/mock-exams": {
    title: "Ujian Simulasi NCLEX – Simulasi Berwaktu | NurseNest",
    description: "Simulasikan kondisi ujian nyata dengan ujian simulasi NCLEX berwaktu. Pemilihan soal adaptif, pelacakan kinerja, dan penjelasan terperinci.",
    keywords: "ujian simulasi NCLEX, simulasi ujian keperawatan, ujian latihan berwaktu, persiapan ujian keperawatan",
  },
  "/free-practice": {
    title: "Soal Latihan Gratis – Ulasan NCLEX | NurseNest",
    description: "Mulai persiapan NCLEX Anda dengan soal latihan gratis. Penjelasan terperinci, penalaran klinis, dan konten sesuai ujian. Tidak perlu kartu kredit.",
    keywords: "soal latihan NCLEX gratis, ulasan NCLEX gratis, soal keperawatan gratis",
  },
  "/international-nurses": {
      title: "Perawat Internasional – Panduan Keperawatan Global | NurseNest",
      description: "Panduan lengkap untuk perawat berpendidikan internasional: lisensi, ujian, evaluasi kredensial, jalur migrasi, dan peluang kerja di seluruh dunia.",
      keywords: "perawat internasional, lisensi keperawatan asing, migrasi keperawatan, NCLEX internasional, ujian keperawatan Kanada",
    },
  "/healthcare-policy-and-updates": {
    title: "Kebijakan Kesehatan & Pembaruan — Perubahan Regulasi Keperawatan | NurseNest",
    description: "Tetap terinformasi tentang perubahan kebijakan kesehatan yang memengaruhi perawat. Panduan pembaruan lisensi, rekrutmen internasional, perubahan format ujian, dan perkembangan regulasi.",
    keywords: "kebijakan kesehatan keperawatan, perubahan regulasi, lisensi keperawatan, rekrutmen perawat internasional, pembaruan ujian",
  },
  "/healthcare-policy-and-updates/licensing-policy-changes": {
    title: "Perubahan Kebijakan Lisensi Keperawatan | NurseNest",
    description: "Panduan lengkap perubahan kebijakan lisensi keperawatan termasuk pembaruan Compact, perubahan lingkup praktik, dan persyaratan perpanjangan.",
    keywords: "perubahan lisensi keperawatan, compact keperawatan, lingkup praktik, perpanjangan lisensi",
  },
  "/healthcare-policy-and-updates/international-nursing-recruitment": {
    title: "Rekrutmen Perawat Internasional — Evaluasi Kredensial | NurseNest",
    description: "Panduan kebijakan rekrutmen perawat internasional. Evaluasi kredensial, jalur imigrasi, program jembatan.",
    keywords: "rekrutmen perawat internasional, evaluasi kredensial, program jembatan, visa perawat",
  },
  "/healthcare-policy-and-updates/exam-format-updates": {
    title: "Pembaruan Format Ujian Keperawatan — NGN & CAT | NurseNest",
    description: "Ikuti perubahan format ujian keperawatan. Panduan pembaruan NGN NCLEX, perubahan tes adaptif, dan modifikasi laporan skor.",
    keywords: "pembaruan format ujian NCLEX, NGN, tes adaptif, laporan skor",
  },
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses": {
    title: "Perubahan Regulasi yang Memengaruhi Perawat | NurseNest",
    description: "Panduan perubahan regulasi yang memengaruhi praktik keperawatan. Undang-undang rasio staf, standar keselamatan pasien, telemedicine.",
    keywords: "perubahan regulasi keperawatan, rasio staf, keselamatan pasien, telemedicine",
  },
};

const hindiMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – नर्सिंग परीक्षा तैयारी | NCLEX प्रश्न और प्रश्न बैंक",
    description: "NurseNest के साथ अपनी नर्सिंग परीक्षाओं की तैयारी करें। हजारों NCLEX अभ्यास प्रश्न, क्लिनिकल सिमुलेशन, फ्लैशकार्ड और पैथोफिजियोलॉजी पाठ प्राप्त करें।",
    keywords: "NCLEX अभ्यास प्रश्न, नर्सिंग परीक्षा तैयारी, नर्सिंग प्रश्न बैंक, नर्सिंग फ्लैशकार्ड, NCLEX समीक्षा, क्लिनिकल सिमुलेशन",
  },
  "/pricing": {
    title: "मूल्य और योजनाएँ | NurseNest – नर्सिंग परीक्षा तैयारी",
    description: "नर्सिंग परीक्षा तैयारी के लिए NurseNest योजनाओं की तुलना करें। NCLEX प्रश्न बैंक, क्लिनिकल सिमुलेशन और फ्लैशकार्ड के साथ किफायती मासिक योजनाएँ।",
    keywords: "NurseNest मूल्य, NCLEX तैयारी योजनाएँ, नर्सिंग परीक्षा कीमत, NCLEX समीक्षा सदस्यता",
  },
  "/lessons": {
    title: "क्लिनिकल पाठ – पैथोफिजियोलॉजी और नर्सिंग | NurseNest",
    description: "पैथोफिजियोलॉजी, फार्माकोलॉजी और क्लिनिकल रीजनिंग पर गहन क्लिनिकल पाठ। शरीर प्रणाली के अनुसार संरचित सामग्री।",
    keywords: "नर्सिंग पाठ, पैथोफिजियोलॉजी नर्सिंग, क्लिनिकल कक्षाएं, क्लिनिकल रीजनिंग, फार्माकोलॉजी नर्सिंग",
  },
  "/flashcards": {
    title: "नर्सिंग फ्लैशकार्ड – फार्माकोलॉजी और समीक्षा | NurseNest",
    description: "क्लिनिकली सत्यापित नर्सिंग फ्लैशकार्ड के साथ अध्ययन करें। फार्माकोलॉजी, लैब वैल्यू और पैथोफिजियोलॉजी।",
    keywords: "नर्सिंग फ्लैशकार्ड, फार्माकोलॉजी फ्लैशकार्ड, NCLEX समीक्षा कार्ड, नर्सिंग अध्ययन",
  },
  "/mock-exams": {
    title: "NCLEX मॉक परीक्षा – समयबद्ध सिमुलेशन | NurseNest",
    description: "हमारी समयबद्ध NCLEX मॉक परीक्षाओं के साथ वास्तविक परीक्षा स्थितियों का अनुकरण करें। अनुकूली प्रश्न चयन और विस्तृत व्याख्या।",
    keywords: "NCLEX मॉक परीक्षा, नर्सिंग परीक्षा सिमुलेशन, समयबद्ध अभ्यास परीक्षा, NCLEX सिमुलेशन",
  },
  "/glossary": {
    title: "नर्सिंग शब्दावली – चिकित्सा शब्दावली | NurseNest",
    description: "नर्सिंग और चिकित्सा शब्दों का व्यापक शब्दकोश। नर्सिंग और परीक्षाओं में प्रयुक्त शब्दावली की स्पष्ट परिभाषाएँ।",
    keywords: "नर्सिंग शब्दावली, चिकित्सा शब्दावली, नर्सिंग परिभाषाएँ, नर्सिंग शब्दकोश",
  },
  "/clinical-clarity": {
    title: "क्लिनिकल स्पष्टता – साक्ष्य-आधारित उत्तर | NurseNest",
    description: "परीक्षाओं में अक्सर गलत उत्तर दिए जाने वाले क्लिनिकल प्रश्नों के स्पष्ट, साक्ष्य-आधारित उत्तर प्राप्त करें।",
    keywords: "क्लिनिकल स्पष्टता नर्सिंग, क्लिनिकल उत्तर, क्लिनिकल रीजनिंग, नर्सिंग परीक्षा प्रश्न",
  },
  "/blog": {
    title: "क्लिनिकल शिक्षा ब्लॉग – नर्सिंग लेख | NurseNest",
    description: "साक्ष्य-आधारित क्लिनिकल शिक्षा लेख। क्लिनिकल रीजनिंग, पैथोफिजियोलॉजी, फार्माकोलॉजी और परीक्षा तैयारी रणनीतियाँ।",
    keywords: "नर्सिंग ब्लॉग, क्लिनिकल लेख, नर्सिंग शिक्षा, क्लिनिकल रीजनिंग ब्लॉग",
  },
};

const simplifiedChineseMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – 护理考试备考 | NCLEX题库与练习题",
    description: "使用NurseNest备考护理考试。获取数千道NCLEX练习题、临床模拟、闪卡和病理生理学课程。",
    keywords: "NCLEX练习题, 护理考试备考, 护理题库, 护理闪卡, NCLEX复习, 临床模拟",
  },
  "/pricing": {
    title: "价格与方案 | NurseNest – 护理考试备考",
    description: "比较NurseNest护理考试备考方案。含NCLEX题库、临床模拟和闪卡的实惠月度方案。",
    keywords: "NurseNest价格, NCLEX备考方案, 护理考试价格, NCLEX复习订阅",
  },
  "/lessons": {
    title: "临床课程 – 病理生理学与护理 | NurseNest",
    description: "探索关于病理生理学、药理学和临床推理的深入临床课程。按人体系统结构化的内容。",
    keywords: "护理课程, 病理生理学护理, 临床课程, 临床推理, 药理学护理",
  },
  "/flashcards": {
    title: "护理闪卡 – 药理学与复习 | NurseNest",
    description: "使用经过临床验证的护理闪卡学习。药理学、实验室值和病理生理学。",
    keywords: "护理闪卡, 药理学闪卡, NCLEX复习卡, 护理学习",
  },
  "/mock-exams": {
    title: "NCLEX模拟考试 – 计时模拟 | NurseNest",
    description: "通过计时NCLEX模拟考试模拟真实考试条件。自适应题目选择和详细解析。",
    keywords: "NCLEX模拟考试, 护理考试模拟, 计时练习考试, NCLEX模拟",
  },
  "/glossary": {
    title: "护理词汇表 – 医学术语 | NurseNest",
    description: "查阅护理和医学术语综合词汇表。护理和考试中使用的术语清晰定义。",
    keywords: "护理词汇表, 医学术语, 护理定义, 护理词典",
  },
  "/clinical-clarity": {
    title: "临床清晰度 – 基于循证的答案 | NurseNest",
    description: "获取考试中常见错误临床问题的清晰、基于循证的答案。",
    keywords: "临床清晰度护理, 临床答案, 临床推理, 护理考试问题",
  },
  "/blog": {
    title: "临床教育博客 – 护理文章 | NurseNest",
    description: "基于循证的临床教育文章。临床推理、病理生理学、药理学和考试备考策略。",
    keywords: "护理博客, 临床文章, 护理教育, 临床推理博客",
  },
};

const arabicMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – التحضير لامتحان التمريض | أسئلة NCLEX وبنك الأسئلة",
    description: "استعد لامتحانات التمريض مع NurseNest. احصل على آلاف أسئلة NCLEX التدريبية والمحاكاة السريرية وبطاقات الذاكرة ودروس الفيزيولوجيا المرضية.",
    keywords: "أسئلة NCLEX تدريبية, التحضير لامتحان التمريض, بنك أسئلة التمريض, بطاقات التمريض, مراجعة NCLEX, محاكاة سريرية",
  },
  "/pricing": {
    title: "الأسعار والخطط | NurseNest – التحضير لامتحان التمريض",
    description: "قارن خطط NurseNest للتحضير لامتحانات التمريض. خطط شهرية بأسعار معقولة مع بنك أسئلة NCLEX ومحاكاة سريرية وبطاقات ذاكرة.",
    keywords: "أسعار NurseNest, خطط التحضير لـ NCLEX, سعر امتحان التمريض, اشتراك مراجعة NCLEX",
  },
  "/lessons": {
    title: "الدروس السريرية – الفيزيولوجيا المرضية والتمريض | NurseNest",
    description: "استكشف دروسنا السريرية المعمقة حول الفيزيولوجيا المرضية وعلم الأدوية والتفكير السريري. محتوى منظم حسب أجهزة الجسم.",
    keywords: "دروس التمريض, الفيزيولوجيا المرضية, الفصول السريرية, التفكير السريري, علم الأدوية التمريضي",
  },
  "/flashcards": {
    title: "بطاقات التمريض التعليمية – علم الأدوية والمراجعة | NurseNest",
    description: "ادرس مع بطاقات التمريض المعتمدة سريرياً. علم الأدوية وقيم المختبر والفيزيولوجيا المرضية.",
    keywords: "بطاقات التمريض, بطاقات علم الأدوية, بطاقات مراجعة NCLEX, دراسة التمريض",
  },
  "/mock-exams": {
    title: "اختبارات NCLEX التجريبية – محاكاة موقوتة | NurseNest",
    description: "حاكِ ظروف الاختبار الحقيقية مع اختباراتنا التجريبية الموقوتة لـ NCLEX. اختيار تكيفي للأسئلة وشرح مفصل.",
    keywords: "اختبارات NCLEX تجريبية, محاكاة امتحان التمريض, اختبار تدريبي موقوت, محاكاة NCLEX",
  },
  "/glossary": {
    title: "مسرد التمريض – المصطلحات الطبية | NurseNest",
    description: "استشر مسرد المصطلحات التمريضية والطبية الشامل. تعريفات واضحة للمصطلحات المستخدمة في التمريض والامتحانات.",
    keywords: "مسرد التمريض, المصطلحات الطبية, تعريفات التمريض, قاموس التمريض",
  },
  "/clinical-clarity": {
    title: "الوضوح السريري – إجابات مبنية على الأدلة | NurseNest",
    description: "احصل على إجابات واضحة ومبنية على الأدلة للأسئلة السريرية التي يتم الإجابة عنها بشكل خاطئ في الامتحانات.",
    keywords: "الوضوح السريري التمريضي, إجابات سريرية, التفكير السريري, أسئلة امتحان التمريض",
  },
  "/blog": {
    title: "مدونة التعليم السريري – مقالات التمريض | NurseNest",
    description: "مقالات تعليم سريري مبنية على الأدلة. التفكير السريري والفيزيولوجيا المرضية وعلم الأدوية واستراتيجيات التحضير للامتحانات.",
    keywords: "مدونة التمريض, مقالات سريرية, تعليم التمريض, مدونة التفكير السريري",
  },
};

const koreanMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – 간호사 시험 준비 | NCLEX 문제 및 문제은행",
    description: "NurseNest로 간호사 시험을 준비하세요. 수천 개의 NCLEX 연습 문제, 임상 시뮬레이션, 플래시카드 및 병태생리학 수업을 이용하세요.",
    keywords: "NCLEX 연습문제, 간호사 시험 준비, 간호 문제은행, 간호 플래시카드, NCLEX 복습, 임상 시뮬레이션",
  },
  "/pricing": {
    title: "가격 및 플랜 | NurseNest – 간호사 시험 준비",
    description: "간호사 시험 준비를 위한 NurseNest 플랜을 비교하세요. NCLEX 문제은행, 임상 시뮬레이션 및 플래시카드가 포함된 합리적인 월간 플랜.",
    keywords: "NurseNest 가격, NCLEX 준비 플랜, 간호사 시험 가격, NCLEX 복습 구독",
  },
  "/lessons": {
    title: "임상 수업 – 병태생리학 및 간호 | NurseNest",
    description: "병태생리학, 약리학 및 임상 추론에 관한 심층 임상 수업을 탐색하세요. 신체 시스템별로 구성된 콘텐츠.",
    keywords: "간호 수업, 병태생리학 간호, 임상 수업, 임상 추론, 약리학 간호",
  },
  "/flashcards": {
    title: "간호 플래시카드 – 약리학 및 복습 | NurseNest",
    description: "임상적으로 검증된 간호 플래시카드로 공부하세요. 약리학, 검사 수치 및 병태생리학.",
    keywords: "간호 플래시카드, 약리학 플래시카드, NCLEX 복습 카드, 간호 학습",
  },
  "/mock-exams": {
    title: "NCLEX 모의고사 – 시간제한 시뮬레이션 | NurseNest",
    description: "시간제한 NCLEX 모의고사로 실제 시험 조건을 시뮬레이션하세요. 적응형 문제 선택과 상세한 해설.",
    keywords: "NCLEX 모의고사, 간호사 시험 시뮬레이션, 시간제한 연습 시험, NCLEX 시뮬레이션",
  },
  "/glossary": {
    title: "간호 용어집 – 의학 용어 | NurseNest",
    description: "간호 및 의학 용어의 종합 용어집을 참조하세요. 간호 및 시험에서 사용되는 용어의 명확한 정의.",
    keywords: "간호 용어집, 의학 용어, 간호 정의, 간호 사전",
  },
  "/clinical-clarity": {
    title: "임상 명확성 – 근거 기반 답변 | NurseNest",
    description: "시험에서 자주 틀리는 임상 질문에 대한 명확하고 근거 기반의 답변을 받으세요.",
    keywords: "임상 명확성 간호, 임상 답변, 임상 추론, 간호 시험 문제",
  },
  "/blog": {
    title: "임상 교육 블로그 – 간호 기사 | NurseNest",
    description: "근거 기반 임상 교육 기사. 임상 추론, 병태생리학, 약리학 및 시험 준비 전략.",
    keywords: "간호 블로그, 임상 기사, 간호 교육, 임상 추론 블로그",
  },
};

const punjabiMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – ਨਰਸਿੰਗ ਪ੍ਰੀਖਿਆ ਤਿਆਰੀ | NCLEX ਸਵਾਲ ਅਤੇ ਸਵਾਲ ਬੈਂਕ",
    description: "NurseNest ਨਾਲ ਆਪਣੀਆਂ ਨਰਸਿੰਗ ਪ੍ਰੀਖਿਆਵਾਂ ਦੀ ਤਿਆਰੀ ਕਰੋ। ਹਜ਼ਾਰਾਂ NCLEX ਅਭਿਆਸ ਸਵਾਲ, ਕਲੀਨਿਕਲ ਸਿਮੂਲੇਸ਼ਨ, ਫਲੈਸ਼ਕਾਰਡ ਅਤੇ ਪੈਥੋਫਿਜ਼ੀਓਲੋਜੀ ਪਾਠ ਪ੍ਰਾਪਤ ਕਰੋ।",
    keywords: "NCLEX ਅਭਿਆਸ ਸਵਾਲ, ਨਰਸਿੰਗ ਪ੍ਰੀਖਿਆ ਤਿਆਰੀ, ਨਰਸਿੰਗ ਸਵਾਲ ਬੈਂਕ, ਨਰਸਿੰਗ ਫਲੈਸ਼ਕਾਰਡ, NCLEX ਸਮੀਖਿਆ",
  },
  "/pricing": {
    title: "ਕੀਮਤਾਂ ਅਤੇ ਯੋਜਨਾਵਾਂ | NurseNest – ਨਰਸਿੰਗ ਪ੍ਰੀਖਿਆ ਤਿਆਰੀ",
    description: "ਨਰਸਿੰਗ ਪ੍ਰੀਖਿਆ ਤਿਆਰੀ ਲਈ NurseNest ਯੋਜਨਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ। NCLEX ਸਵਾਲ ਬੈਂਕ ਅਤੇ ਕਲੀਨਿਕਲ ਸਿਮੂਲੇਸ਼ਨ ਨਾਲ ਕਿਫ਼ਾਇਤੀ ਮਹੀਨਾਵਾਰ ਯੋਜਨਾਵਾਂ।",
    keywords: "NurseNest ਕੀਮਤਾਂ, NCLEX ਤਿਆਰੀ ਯੋਜਨਾਵਾਂ, ਨਰਸਿੰਗ ਪ੍ਰੀਖਿਆ ਕੀਮਤ",
  },
  "/lessons": {
    title: "ਕਲੀਨਿਕਲ ਪਾਠ – ਪੈਥੋਫਿਜ਼ੀਓਲੋਜੀ ਅਤੇ ਨਰਸਿੰਗ | NurseNest",
    description: "ਪੈਥੋਫਿਜ਼ੀਓਲੋਜੀ, ਫਾਰਮਾਕੋਲੋਜੀ ਅਤੇ ਕਲੀਨਿਕਲ ਰੀਜ਼ਨਿੰਗ ਬਾਰੇ ਡੂੰਘੇ ਕਲੀਨਿਕਲ ਪਾਠ।",
    keywords: "ਨਰਸਿੰਗ ਪਾਠ, ਪੈਥੋਫਿਜ਼ੀਓਲੋਜੀ ਨਰਸਿੰਗ, ਕਲੀਨਿਕਲ ਕਲਾਸਾਂ, ਕਲੀਨਿਕਲ ਰੀਜ਼ਨਿੰਗ",
  },
  "/flashcards": {
    title: "ਨਰਸਿੰਗ ਫਲੈਸ਼ਕਾਰਡ – ਫਾਰਮਾਕੋਲੋਜੀ ਅਤੇ ਸਮੀਖਿਆ | NurseNest",
    description: "ਕਲੀਨਿਕਲੀ ਪ੍ਰਮਾਣਿਤ ਨਰਸਿੰਗ ਫਲੈਸ਼ਕਾਰਡ ਨਾਲ ਅਧਿਐਨ ਕਰੋ।",
    keywords: "ਨਰਸਿੰਗ ਫਲੈਸ਼ਕਾਰਡ, ਫਾਰਮਾਕੋਲੋਜੀ ਫਲੈਸ਼ਕਾਰਡ, NCLEX ਸਮੀਖਿਆ ਕਾਰਡ",
  },
  "/mock-exams": {
    title: "NCLEX ਮੌਕ ਪ੍ਰੀਖਿਆ – ਸਮੇਂਬੱਧ ਸਿਮੂਲੇਸ਼ਨ | NurseNest",
    description: "ਸਮੇਂਬੱਧ NCLEX ਮੌਕ ਪ੍ਰੀਖਿਆਵਾਂ ਨਾਲ ਅਸਲ ਪ੍ਰੀਖਿਆ ਹਾਲਾਤ ਦੀ ਨਕਲ ਕਰੋ।",
    keywords: "NCLEX ਮੌਕ ਪ੍ਰੀਖਿਆ, ਨਰਸਿੰਗ ਪ੍ਰੀਖਿਆ ਸਿਮੂਲੇਸ਼ਨ, ਸਮੇਂਬੱਧ ਅਭਿਆਸ ਪ੍ਰੀਖਿਆ",
  },
  "/glossary": {
    title: "ਨਰਸਿੰਗ ਸ਼ਬਦਾਵਲੀ – ਡਾਕਟਰੀ ਸ਼ਬਦਾਵਲੀ | NurseNest",
    description: "ਨਰਸਿੰਗ ਅਤੇ ਡਾਕਟਰੀ ਸ਼ਬਦਾਂ ਦਾ ਵਿਆਪਕ ਸ਼ਬਦਕੋਸ਼। ਸਪੱਸ਼ਟ ਪਰਿਭਾਸ਼ਾਵਾਂ।",
    keywords: "ਨਰਸਿੰਗ ਸ਼ਬਦਾਵਲੀ, ਡਾਕਟਰੀ ਸ਼ਬਦਾਵਲੀ, ਨਰਸਿੰਗ ਪਰਿਭਾਸ਼ਾਵਾਂ",
  },
};

const haitianCreoleMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – Preparasyon Egzamen Enfimyè | Kesyon NCLEX ak Bank Kesyon",
    description: "Prepare egzamen enfimyè ou ak NurseNest. Jwenn dè milye kesyon pratik NCLEX, simulasyon klinik, kat memwa ak leson patofiziyoloji.",
    keywords: "kesyon pratik NCLEX, preparasyon egzamen enfimyè, bank kesyon enfimyè, kat memwa enfimyè, revizyon NCLEX",
  },
  "/pricing": {
    title: "Pri ak Plan | NurseNest – Preparasyon Egzamen Enfimyè",
    description: "Konpare plan NurseNest pou preparasyon egzamen enfimyè. Plan mansyèl abòdab ak bank kesyon NCLEX ak simulasyon klinik.",
    keywords: "pri NurseNest, plan preparasyon NCLEX, pri egzamen enfimyè",
  },
  "/lessons": {
    title: "Leson Klinik – Patofiziyoloji ak Enfimyè | NurseNest",
    description: "Eksplore leson klinik pwofon sou patofiziyoloji, famakoloji ak rezonman klinik.",
    keywords: "leson enfimyè, patofiziyoloji enfimyè, klas klinik, rezonman klinik",
  },
  "/flashcards": {
    title: "Kat Memwa Enfimyè – Famakoloji ak Revizyon | NurseNest",
    description: "Etidye ak kat memwa enfimyè ki verifye klinikman. Famakoloji, valè laboratwa ak patofiziyoloji.",
    keywords: "kat memwa enfimyè, flashcard famakoloji, kat revizyon NCLEX",
  },
  "/mock-exams": {
    title: "Egzamen Simulasyon NCLEX – Simulasyon ak Tan | NurseNest",
    description: "Simile kondisyon egzamen reyèl ak egzamen simulasyon NCLEX nou yo ki gen tan.",
    keywords: "egzamen simulasyon NCLEX, simulasyon egzamen enfimyè, egzamen pratik ak tan",
  },
  "/glossary": {
    title: "Glosè Enfimyè – Tèminoloji Medikal | NurseNest",
    description: "Konsilte glosè konplè tèm enfimyè ak medikal. Definisyon klè pou tèminoloji ki itilize nan enfimyè ak egzamen.",
    keywords: "glosè enfimyè, tèminoloji medikal, definisyon enfimyè",
  },
};

const urduMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – نرسنگ امتحان کی تیاری | NCLEX سوالات اور سوال بینک",
    description: "NurseNest کے ساتھ اپنے نرسنگ امتحانات کی تیاری کریں۔ ہزاروں NCLEX پریکٹس سوالات، کلینیکل سمولیشن، فلیش کارڈز اور پیتھوفزیولوجی اسباق حاصل کریں۔",
    keywords: "NCLEX پریکٹس سوالات, نرسنگ امتحان تیاری, نرسنگ سوال بینک, نرسنگ فلیش کارڈز, NCLEX جائزہ",
  },
  "/pricing": {
    title: "قیمتیں اور منصوبے | NurseNest – نرسنگ امتحان تیاری",
    description: "نرسنگ امتحان کی تیاری کے لیے NurseNest منصوبوں کا موازنہ کریں۔ NCLEX سوال بینک اور کلینیکل سمولیشن کے ساتھ سستے ماہانہ منصوبے۔",
    keywords: "NurseNest قیمتیں, NCLEX تیاری منصوبے, نرسنگ امتحان قیمت",
  },
  "/lessons": {
    title: "کلینیکل اسباق – پیتھوفزیولوجی اور نرسنگ | NurseNest",
    description: "پیتھوفزیولوجی، فارماکولوجی اور کلینیکل استدلال پر گہرے کلینیکل اسباق۔",
    keywords: "نرسنگ اسباق, پیتھوفزیولوجی نرسنگ, کلینیکل کلاسز, کلینیکل استدلال",
  },
  "/flashcards": {
    title: "نرسنگ فلیش کارڈز – فارماکولوجی اور جائزہ | NurseNest",
    description: "کلینیکلی تصدیق شدہ نرسنگ فلیش کارڈز کے ساتھ مطالعہ کریں۔",
    keywords: "نرسنگ فلیش کارڈز, فارماکولوجی فلیش کارڈز, NCLEX جائزہ کارڈز",
  },
  "/mock-exams": {
    title: "NCLEX ماک امتحان – وقتی سمولیشن | NurseNest",
    description: "ہماری وقتی NCLEX ماک امتحانات کے ساتھ حقیقی امتحان کے حالات کی نقل کریں۔",
    keywords: "NCLEX ماک امتحان, نرسنگ امتحان سمولیشن, وقتی پریکٹس امتحان",
  },
  "/glossary": {
    title: "نرسنگ لغت – طبی اصطلاحات | NurseNest",
    description: "نرسنگ اور طبی اصطلاحات کی جامع لغت۔ واضح تعریفیں۔",
    keywords: "نرسنگ لغت, طبی اصطلاحات, نرسنگ تعریفیں",
  },
};

const japaneseMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – 看護師試験対策 | NCLEX問題と問題バンク",
    description: "NurseNestで看護師試験の準備をしましょう。数千のNCLEX練習問題、臨床シミュレーション、フラッシュカード、病態生理学レッスンにアクセスできます。",
    keywords: "NCLEX練習問題, 看護師試験対策, 看護問題バンク, 看護フラッシュカード, NCLEXレビュー, 臨床シミュレーション",
  },
  "/pricing": {
    title: "料金とプラン | NurseNest – 看護師試験対策",
    description: "看護師試験対策のNurseNestプランを比較。NCLEX問題バンク、臨床シミュレーション、フラッシュカード付きのお手頃月額プラン。",
    keywords: "NurseNest料金, NCLEX対策プラン, 看護師試験料金, NCLEXレビュー購読",
  },
  "/lessons": {
    title: "臨床レッスン – 病態生理学と看護 | NurseNest",
    description: "病態生理学、薬理学、臨床推論に関する詳細な臨床レッスン。身体システム別に構成されたコンテンツ。",
    keywords: "看護レッスン, 病態生理学看護, 臨床授業, 臨床推論, 薬理学看護",
  },
  "/flashcards": {
    title: "看護フラッシュカード – 薬理学とレビュー | NurseNest",
    description: "臨床的に検証された看護フラッシュカードで学習。薬理学、検査値、病態生理学。",
    keywords: "看護フラッシュカード, 薬理学フラッシュカード, NCLEXレビューカード, 看護学習",
  },
  "/mock-exams": {
    title: "NCLEX模擬試験 – 時間制限シミュレーション | NurseNest",
    description: "時間制限付きNCLEX模擬試験で実際の試験条件をシミュレート。適応型問題選択と詳細な解説。",
    keywords: "NCLEX模擬試験, 看護師試験シミュレーション, 時間制限付き練習試験, NCLEXシミュレーション",
  },
  "/glossary": {
    title: "看護用語集 – 医学用語 | NurseNest",
    description: "看護および医学用語の包括的な用語集。看護と試験で使用される用語の明確な定義。",
    keywords: "看護用語集, 医学用語, 看護定義, 看護辞典",
  },
  "/clinical-clarity": {
    title: "臨床クラリティ – エビデンスに基づく回答 | NurseNest",
    description: "試験で頻繁に間違える臨床質問への明確でエビデンスに基づく回答を得ましょう。",
    keywords: "臨床クラリティ看護, 臨床回答, 臨床推論, 看護試験問題",
  },
  "/blog": {
    title: "臨床教育ブログ – 看護記事 | NurseNest",
    description: "エビデンスに基づく臨床教育記事。臨床推論、病態生理学、薬理学、試験対策戦略。",
    keywords: "看護ブログ, 臨床記事, 看護教育, 臨床推論ブログ",
  },
};

const farsiMetadata: Record<string, LocalizedSEOEntry> = {
  "/": {
    title: "NurseNest – آمادگی آزمون پرستاری | سوالات NCLEX و بانک سوالات",
    description: "با NurseNest برای آزمون‌های پرستاری آماده شوید. به هزاران سوال تمرینی NCLEX، شبیه‌سازی بالینی، فلش‌کارت و دروس پاتوفیزیولوژی دسترسی پیدا کنید.",
    keywords: "سوالات تمرینی NCLEX, آمادگی آزمون پرستاری, بانک سوالات پرستاری, فلش‌کارت پرستاری, مرور NCLEX",
  },
  "/pricing": {
    title: "قیمت‌ها و طرح‌ها | NurseNest – آمادگی آزمون پرستاری",
    description: "طرح‌های NurseNest برای آمادگی آزمون پرستاری را مقایسه کنید. طرح‌های ماهانه مقرون به صرفه با بانک سوالات NCLEX و شبیه‌سازی بالینی.",
    keywords: "قیمت NurseNest, طرح‌های آمادگی NCLEX, قیمت آزمون پرستاری",
  },
  "/lessons": {
    title: "دروس بالینی – پاتوفیزیولوژی و پرستاری | NurseNest",
    description: "دروس بالینی عمیق درباره پاتوفیزیولوژی، فارماکولوژی و استدلال بالینی را کاوش کنید.",
    keywords: "دروس پرستاری, پاتوفیزیولوژی پرستاری, کلاس‌های بالینی, استدلال بالینی",
  },
  "/flashcards": {
    title: "فلش‌کارت پرستاری – فارماکولوژی و مرور | NurseNest",
    description: "با فلش‌کارت‌های پرستاری تأیید شده بالینی مطالعه کنید. فارماکولوژی، مقادیر آزمایشگاهی و پاتوفیزیولوژی.",
    keywords: "فلش‌کارت پرستاری, فلش‌کارت فارماکولوژی, کارت‌های مرور NCLEX",
  },
  "/mock-exams": {
    title: "آزمون آزمایشی NCLEX – شبیه‌سازی زمان‌دار | NurseNest",
    description: "با آزمون‌های آزمایشی زمان‌دار NCLEX شرایط واقعی آزمون را شبیه‌سازی کنید.",
    keywords: "آزمون آزمایشی NCLEX, شبیه‌سازی آزمون پرستاری, آزمون تمرینی زمان‌دار",
  },
  "/glossary": {
    title: "واژه‌نامه پرستاری – اصطلاحات پزشکی | NurseNest",
    description: "واژه‌نامه جامع اصطلاحات پرستاری و پزشکی. تعاریف روشن برای اصطلاحات مورد استفاده در پرستاری و آزمون‌ها.",
    keywords: "واژه‌نامه پرستاری, اصطلاحات پزشکی, تعاریف پرستاری",
  },
  "/clinical-clarity": {
    title: "وضوح بالینی – پاسخ‌های مبتنی بر شواهد | NurseNest",
    description: "پاسخ‌های روشن و مبتنی بر شواهد برای سوالات بالینی که اغلب در آزمون‌ها اشتباه پاسخ داده می‌شوند.",
    keywords: "وضوح بالینی پرستاری, پاسخ‌های بالینی, استدلال بالینی",
  },
  "/blog": {
    title: "بلاگ آموزش بالینی – مقالات پرستاری | NurseNest",
    description: "مقالات آموزش بالینی مبتنی بر شواهد. استدلال بالینی، پاتوفیزیولوژی، فارماکولوژی و راهبردهای آمادگی آزمون.",
    keywords: "بلاگ پرستاری, مقالات بالینی, آموزش پرستاری",
  },
};

export const localizedSEOMetadata: Partial<Record<SEOLocale, Record<string, LocalizedSEOEntry>>> = {
  fr: frenchMetadata,
  es: spanishMetadata,
  pt: portugueseMetadata,
  vi: vietnameseMetadata,
  fil: filipinoMetadata,
  "zh-tw": traditionalChineseMetadata,
  de: germanMetadata,
  th: thaiMetadata,
  tr: turkishMetadata,
  id: indonesianMetadata,
  hi: hindiMetadata,
  zh: simplifiedChineseMetadata,
  ar: arabicMetadata,
  ko: koreanMetadata,
  pa: punjabiMetadata,
  ht: haitianCreoleMetadata,
  ur: urduMetadata,
  ja: japaneseMetadata,
  fa: farsiMetadata,
};

export function getLocalizedSEO(locale: string, path: string): LocalizedSEOEntry | null {
  if (!(locale in localizedSEOMetadata)) return null;
  return localizedSEOMetadata[locale as SEOLocale]?.[path] || null;
}
