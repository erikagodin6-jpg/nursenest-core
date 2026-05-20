function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const dentalHygieneSections = {
  periodontalAssessment: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Periodontal assessment is the core reasoning domain for dental hygiene. Hygienists connect probing depths, clinical attachment loss, bleeding on probing, recession, mobility, furcation involvement, radiographic bone loss, calculus, plaque biofilm, risk factors, and patient history into a prevention and care plan."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "A periodontal evaluation is not a single probing number. Probing depth measures sulcus or pocket depth. Clinical attachment level incorporates recession or gingival margin position. Bleeding on probing suggests inflammation. Furcation, mobility, and radiographic bone loss increase severity. Risk factors such as smoking, diabetes, xerostomia, medications, oral hygiene access, and previous periodontal disease shape maintenance intervals and escalation."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient has generalized 5 to 6 mm probing depths, bleeding on probing, subgingival calculus, and radiographic bone loss. The hygienist should not chart this as simple gingivitis. The pattern suggests periodontitis-level assessment and requires appropriate documentation, debridement planning, referral or dentist evaluation by protocol, and patient education focused on risk and maintenance."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Dental hygiene board questions often test whether the learner can distinguish gingivitis from periodontitis, probing depth from attachment loss, localized from generalized involvement, and routine prophylaxis from nonsurgical periodontal therapy."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Periodontal classification depends on patterns: probing, attachment, inflammation, radiographs, furcation, mobility, and risk factors together."
    }
  ],
  instrumentation: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Instrumentation is prevention, therapy, ergonomics, and tissue safety combined. Effective scaling and debridement require correct instrument selection, adaptation, angulation, lateral pressure, stroke direction, fulcrum stability, and clinician posture."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Calculus removal depends on adapting the correct cutting edge or working end to tooth anatomy. Explorers detect deposits and root irregularities. Sickles are commonly used supragingivally; curettes and ultrasonic instrumentation support subgingival debridement according to training and indication. Safe technique uses stable fulcrum, controlled lateral pressure, correct angulation, overlapping strokes, adequate visibility, and tissue-aware adaptation. Ergonomics reduce clinician injury."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A hygienist detects tenacious subgingival calculus on a posterior root surface. The safest exam answer is not random scraping. The clinician should choose appropriate instrumentation, adapt to the root surface, use stable fulcrum and controlled strokes, and reassess with explorer feedback."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Instrumentation questions often test which instrument or motion is appropriate, how to identify the working end, when adaptation is incorrect, and which ergonomic or fulcrum issue causes poor calculus removal or tissue trauma."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Effective instrumentation is controlled adaptation plus reassessment. Poor angulation, unstable fulcrum, or wrong instrument choice can leave calculus or damage tissue."
    }
  ],
  radiography: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Dental radiography supports diagnosis of caries, bone loss, calculus, pathology, eruption, impaction, restorations, and treatment needs. Hygienists must capture diagnostic images while minimizing exposure and recognizing common errors."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Radiographic safety follows ALARA principles: prescribe only indicated images, use appropriate receptor and technique, collimate, protect patients by policy, and prevent repeats. Bitewings evaluate interproximal caries and crestal bone. Periapicals show the full tooth and surrounding apex. Panoramic images show broad anatomy but less fine detail. Common errors include cone cuts, overlap from horizontal angulation error, foreshortening or elongation from vertical angulation error, receptor placement mistakes, motion, and poor exposure."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A bitewing shows overlapped interproximal contacts, making caries assessment difficult. The likely issue is horizontal angulation. The hygienist should correct receptor placement and beam alignment before repeating when a repeat is justified by diagnostic need."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Board questions commonly test radiographic error correction, image selection, ALARA, landmark recognition, caries detection, crestal bone interpretation, and whether a repeat is clinically justified."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "A diagnostic dental image requires correct selection, placement, angulation, exposure, and repeat judgment."
    }
  ],
  prevention: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Dental hygiene is prevention-centered. Caries risk, periodontal risk, fluoride, sealants, diet counseling, tobacco cessation, xerostomia support, home care, and recall interval planning all depend on individualized assessment."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Caries risk rises with frequent fermentable carbohydrates, inadequate fluoride exposure, xerostomia, high plaque levels, exposed roots, orthodontic appliances, low socioeconomic access, and previous caries. Prevention plans may include fluoride varnish, prescription fluoride, sealants, dietary counseling, improved interdental cleaning, salivary support, and recall changes. Education should be specific, behaviorally realistic, and culturally respectful."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient with dry mouth, new root caries, frequent sipping of sugary drinks, and poor plaque control needs more than a generic reminder to brush. The hygienist should identify xerostomia and diet as risk drivers, provide targeted home-care and fluoride strategies, and coordinate with the dentist for risk-based care."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Prevention questions often test caries-risk classification, fluoride indications, sealant selection, diet counseling, xerostomia management, motivational interviewing, and matching intervention intensity to risk."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Prevention must match risk. Identify the driver, choose targeted intervention, and teach in a way the patient can realistically follow."
    }
  ],
  medicalEmergencies: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Dental settings can have medical emergencies: syncope, hypoglycemia, allergic reactions, asthma attacks, chest pain, seizure, stroke symptoms, and local anesthetic complications. Hygienists must recognize early warning signs and activate office emergency protocols."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Emergency readiness includes medical history review, vital signs when indicated, medication and allergy review, stress reduction, chair positioning, oxygen and emergency kit awareness, and team role clarity. Syncope often improves with supine positioning and monitoring. Hypoglycemia requires rapid glucose if the patient is conscious and can swallow. Airway symptoms, severe allergic reaction, chest pain, stroke signs, or altered consciousness require urgent escalation according to office protocol and emergency services activation."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient develops wheezing, facial swelling, and difficulty breathing after a medication exposure. The hygienist should stop treatment, activate the emergency protocol, maintain airway and oxygen support within role, and ensure emergency services are contacted. Continuing prophylaxis is unsafe."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Emergency questions test first action and prioritization. Common traps include leaving a patient upright during syncope, giving oral glucose to an unconscious patient, ignoring airway swelling, or delaying emergency activation for chest pain or stroke symptoms."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Stop treatment, assess ABCs, activate the office protocol, and escalate urgent symptoms quickly."
    }
  ],
  ethics: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Ethics and jurisprudence shape dental hygiene practice. Informed consent, confidentiality, documentation, scope, cultural safety, professional boundaries, mandatory reporting, and refusal of care are common exam domains."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Ethical practice includes autonomy, beneficence, nonmaleficence, justice, veracity, and confidentiality. Hygienists must document objectively, obtain or confirm informed consent according to jurisdiction and office policy, protect patient privacy, avoid practicing outside scope, manage conflicts of interest, and escalate suspected abuse or neglect according to law and policy."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient refuses radiographs despite caries risk. The hygienist should explain the reason for the recommendation, risks and limitations of refusing, alternatives where possible, document the discussion, and involve the dentist or supervising provider according to policy. Coercion or ignoring the refusal is inappropriate."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Ethics questions often test consent, refusal, confidentiality, accurate documentation, scope of practice, cultural respect, impaired provider concerns, and professional boundaries. The safest answer usually protects autonomy while documenting and escalating appropriately."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Respect autonomy, protect privacy, stay within scope, document clearly, and escalate legal or safety concerns by policy."
    }
  ]
};

export const dentalHygieneLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "dental-hygiene-periodontal-assessment-classification-and-risk",
    title: "Periodontal Assessment, Classification, and Risk",
    topic: "Dental Hygiene Periodontology",
    topicSlug: "dental-hygiene-periodontology",
    system: "dental-hygiene",
    bodySystem: "periodontology",
    previewSectionCount: 2,
    seoTitle: "Dental Hygiene Periodontal Assessment Classification and Risk",
    seoDescription: "Dental hygiene board-prep lesson on probing depths, clinical attachment loss, bleeding, furcation, mobility, radiographic bone loss, gingivitis, periodontitis, and risk factors.",
    alliedProfessionKey: "dental-hygiene",
    sections: dentalHygieneSections.periodontalAssessment,
    studyTakeaways: ["Periodontal diagnosis is pattern-based.", "Attachment loss is not the same as probing depth.", "Risk factors shape maintenance and escalation."],
    studyCommonTraps: ["Calling periodontitis gingivitis", "Ignoring recession in attachment calculations", "Forgetting smoking or diabetes risk"],
    preTest: [quiz("Generalized 5 to 6 mm pockets with bleeding and radiographic bone loss most strongly suggests:", ["Simple gingivitis only", "Periodontitis-level assessment", "Normal tissue", "No need to document"], 1, "Pocketing with radiographic bone loss supports periodontitis-level assessment, not simple gingivitis.")],
    postTest: [quiz("Clinical attachment level is influenced by probing depth plus:", ["Gingival margin/recession relationship", "Patient shoe size", "Room temperature", "Instrument color"], 0, "Attachment level incorporates gingival margin position/recession, not probing depth alone.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "dental-hygiene-instrumentation-scaling-and-root-debridement",
    title: "Instrumentation, Scaling, and Root Debridement",
    topic: "Dental Hygiene Instrumentation",
    topicSlug: "dental-hygiene-instrumentation",
    system: "dental-hygiene",
    bodySystem: "instrumentation",
    previewSectionCount: 2,
    seoTitle: "Dental Hygiene Instrumentation Scaling and Root Debridement",
    seoDescription: "Dental hygiene lesson on instrument selection, working end, adaptation, angulation, lateral pressure, fulcrum, ultrasonic scaling, calculus detection, and ergonomics.",
    alliedProfessionKey: "dental-hygiene",
    sections: dentalHygieneSections.instrumentation,
    studyTakeaways: ["Adaptation and angulation determine safe calculus removal.", "Stable fulcrum improves control.", "Reassess after instrumentation."],
    studyCommonTraps: ["Wrong working end", "Unstable fulcrum", "Poor adaptation causing tissue trauma"],
    preTest: [quiz("Tenacious subgingival calculus requires which approach?", ["Appropriate instrument adaptation and controlled strokes", "Random scraping", "Ignoring explorer feedback", "No reassessment"], 0, "Calculus removal requires correct instrument choice, adaptation, controlled strokes, and reassessment.")],
    postTest: [quiz("An unstable fulcrum most directly reduces:", ["Instrumentation control", "Patient identity", "Radiograph exposure time only", "Dietary carbohydrate frequency"], 0, "A stable fulcrum supports controlled instrumentation.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "dental-hygiene-radiography-errors-alara-and-interpretation",
    title: "Radiography: Errors, ALARA, and Interpretation",
    topic: "Dental Radiography",
    topicSlug: "dental-radiography",
    system: "dental-hygiene",
    bodySystem: "radiography",
    previewSectionCount: 2,
    seoTitle: "Dental Hygiene Radiography Errors ALARA and Interpretation",
    seoDescription: "Dental hygiene board-prep lesson on bitewings, periapicals, panoramic images, ALARA, cone cuts, overlap, elongation, foreshortening, caries, and bone levels.",
    alliedProfessionKey: "dental-hygiene",
    sections: dentalHygieneSections.radiography,
    studyTakeaways: ["Horizontal angulation errors cause overlap.", "Image selection must match diagnostic need.", "Repeat only when diagnostic benefit justifies exposure."],
    studyCommonTraps: ["Repeating without correcting the error", "Confusing horizontal and vertical angulation errors", "Ignoring ALARA"],
    preTest: [quiz("Overlapped contacts on bitewings usually indicate an error in:", ["Horizontal angulation", "Patient blood pressure", "Probe depth", "Fluoride type"], 0, "Overlapped contacts are commonly caused by incorrect horizontal angulation.")],
    postTest: [quiz("ALARA in dental radiography means:", ["Use indicated images and minimize unnecessary exposure", "Take every image possible", "Repeat for aesthetics only", "Ignore collimation"], 0, "ALARA balances diagnostic need with exposure reduction.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "dental-hygiene-caries-prevention-fluoride-sealants-and-xerostomia",
    title: "Caries Prevention, Fluoride, Sealants, and Xerostomia",
    topic: "Dental Hygiene Prevention",
    topicSlug: "dental-hygiene-prevention",
    system: "dental-hygiene",
    bodySystem: "prevention",
    previewSectionCount: 2,
    seoTitle: "Dental Hygiene Caries Prevention Fluoride Sealants and Xerostomia",
    seoDescription: "Dental hygiene lesson on caries risk, fluoride, sealants, diet counseling, xerostomia, plaque control, root caries, motivational interviewing, and prevention planning.",
    alliedProfessionKey: "dental-hygiene",
    sections: dentalHygieneSections.prevention,
    studyTakeaways: ["Prevention should match risk level.", "Xerostomia increases caries risk.", "Education should be specific and realistic."],
    studyCommonTraps: ["Generic advice for high-risk patients", "Ignoring dry mouth", "Skipping fluoride when indicated"],
    preTest: [quiz("Dry mouth, frequent sugary drinks, and new root caries indicate:", ["Higher caries risk needing targeted prevention", "No risk", "Only cosmetic concern", "No need for fluoride discussion"], 0, "Xerostomia plus diet and new caries suggests elevated risk requiring targeted prevention.")],
    postTest: [quiz("Sealants are primarily used to protect:", ["Pit and fissure surfaces at risk", "Patient privacy forms", "Blood pressure cuffs", "Radiographic sensors only"], 0, "Sealants protect susceptible pits and fissures from caries.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "dental-hygiene-medical-emergencies-in-the-dental-office",
    title: "Medical Emergencies in the Dental Office",
    topic: "Dental Medical Emergencies",
    topicSlug: "dental-medical-emergencies",
    system: "dental-hygiene",
    bodySystem: "medical-emergencies",
    previewSectionCount: 2,
    seoTitle: "Dental Hygiene Medical Emergencies in the Dental Office",
    seoDescription: "Dental hygiene lesson on syncope, hypoglycemia, asthma, allergic reaction, chest pain, seizure, stroke symptoms, emergency protocol, oxygen, and office readiness.",
    alliedProfessionKey: "dental-hygiene",
    sections: dentalHygieneSections.medicalEmergencies,
    studyTakeaways: ["Stop treatment when emergencies occur.", "Airway and breathing symptoms are urgent.", "Follow office emergency protocol and activate help."],
    studyCommonTraps: ["Giving oral glucose to an unconscious patient", "Ignoring airway swelling", "Continuing treatment during chest pain"],
    preTest: [quiz("Wheezing, facial swelling, and trouble breathing after exposure suggests:", ["Possible severe allergic reaction", "Routine anxiety only", "Normal prophylaxis response", "No escalation needed"], 0, "Airway symptoms with swelling suggest a potentially severe allergic reaction requiring emergency protocol.")],
    postTest: [quiz("The first response to a medical emergency during treatment is to:", ["Stop treatment and assess/escalate", "Keep scaling", "Ignore symptoms", "Send the patient home alone"], 0, "Treatment should stop while the team follows emergency assessment and escalation protocol.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "dental-hygiene-ethics-consent-confidentiality-and-jurisprudence",
    title: "Ethics, Consent, Confidentiality, and Jurisprudence",
    topic: "Dental Hygiene Ethics",
    topicSlug: "dental-hygiene-ethics",
    system: "dental-hygiene",
    bodySystem: "ethics",
    previewSectionCount: 2,
    seoTitle: "Dental Hygiene Ethics Consent Confidentiality and Jurisprudence",
    seoDescription: "Dental hygiene board-prep lesson on informed consent, refusal, confidentiality, documentation, scope, professional boundaries, cultural respect, and mandatory reporting.",
    alliedProfessionKey: "dental-hygiene",
    sections: dentalHygieneSections.ethics,
    studyTakeaways: ["Respect autonomy and document refusal.", "Protect confidentiality.", "Stay within scope and escalate legal concerns."],
    studyCommonTraps: ["Coercing consent", "Sharing private information casually", "Practicing outside scope"],
    preTest: [quiz("A patient refuses recommended radiographs. What is appropriate?", ["Explain risks/limitations, document, and involve provider per policy", "Force radiographs", "Ignore refusal and expose anyway", "Shame the patient"], 0, "Informed refusal should be explained, documented, and managed according to policy.")],
    postTest: [quiz("Confidentiality requires:", ["Protecting patient information and using authorized disclosure", "Discussing cases publicly", "Posting radiographs online", "Sharing details with anyone who asks"], 0, "Patient information must be protected and disclosed only as authorized or required by law/policy.")]
  }
];

export default { lessons: dentalHygieneLessons };
