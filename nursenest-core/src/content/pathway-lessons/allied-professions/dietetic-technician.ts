function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const dieteticSections = {
  nutritionAssessment: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Dietetic technician practice begins with structured nutrition assessment support. Learners must connect intake patterns, anthropometrics, labs, clinical history, medications, food access, swallowing or GI symptoms, cultural needs, and patient goals without stepping outside scope."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Nutrition assessment uses multiple data streams: dietary intake, weight history, BMI or growth patterns where appropriate, malnutrition risk, food security, chewing or swallowing concerns, GI tolerance, allergies, labs such as glucose, lipids, electrolytes, albumin context, renal markers, and medication-nutrient interactions. Dietetic technicians support screening, data collection, education, menu implementation, and monitoring under the dietitian or facility policy."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient has unintentional weight loss, poor intake, pressure injury risk, and limited access to food. The technician should not document 'eats poorly' and move on. A safer workflow is to collect intake and weight data, flag malnutrition and food-security concerns, document objectively, and notify the dietitian or care team."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Dietetic technician exams often test which data matter, when to escalate to the registered dietitian, and how social determinants like food insecurity affect nutrition planning."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Nutrition assessment is pattern recognition: intake, weight, clinical status, labs, access, and tolerance together."
    }
  ],
  medicalNutritionTherapy: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Medical nutrition therapy support requires understanding why diet orders exist and how to implement them safely. Diabetes, cardiovascular disease, renal disease, GI disorders, wounds, and malnutrition require different nutrition priorities."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      body: "Diabetes nutrition support may focus on carbohydrate consistency, label reading, hypoglycemia awareness, and balanced meals. Cardiovascular nutrition often emphasizes saturated fat, sodium, fiber, and overall dietary pattern. Renal nutrition may involve sodium, potassium, phosphorus, fluid, and protein considerations depending on stage and dialysis status. Wound healing increases attention to protein, calories, micronutrients, hydration, and glycemic control. Technicians implement and reinforce the plan, but diet prescription changes require dietitian/provider authorization.",
      kind: "core_concept"
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient on a renal diet asks if they can replace meals with high-potassium smoothies. The technician should not independently redesign the diet. The appropriate response is to provide plan-consistent education, recognize potassium risk, and refer to the dietitian for individualized guidance."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "MNT questions test disease-specific priorities and role boundaries. Common traps include giving independent medical nutrition prescriptions, ignoring renal electrolyte concerns, or applying a single generic diet to every chronic disease."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Support the nutrition plan, reinforce safe education, and escalate individualized diet changes to the dietitian."
    }
  ],
  foodServiceSafety: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Food-service safety is clinical safety. Temperature control, allergens, texture modifications, sanitation, cross-contamination prevention, tray accuracy, and infection-control procedures directly affect patient outcomes."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Safe food service includes hand hygiene, clean/dirty separation, time-temperature control, proper storage, allergen management, correct diet texture, thickened liquids when ordered, accurate patient tray delivery, and HACCP-style hazard control. High-risk patients include immunocompromised patients, older adults, infants, pregnant patients, and those with swallowing impairment."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient with a documented peanut allergy receives a tray containing an unlabeled dessert. The technician should stop tray delivery and verify ingredients according to allergen workflow rather than assuming the dessert is safe."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Food-service exam questions test allergens, temperatures, cross-contamination, storage, sanitation, dysphagia textures, tray accuracy, and when to hold or correct a tray before it reaches the patient."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Every tray is a safety event: verify diet, allergy, texture, temperature, and patient identity."
    }
  ],
  counselingEducation: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Nutrition education works only when it is understandable, realistic, culturally respectful, and matched to readiness for change. Dietetic technicians often reinforce education and help patients translate plans into daily routines."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Effective education uses plain language, teach-back, motivational interviewing basics, culturally relevant examples, food-budget awareness, literacy sensitivity, and patient-selected goals. Avoid shaming, rigid perfectionism, or assuming access to expensive foods. Education should reinforce the dietitian-approved plan and identify barriers that need follow-up."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient says they cannot afford the foods on a printed diabetes handout. The technician should not blame nonadherence. A better response is to explore affordable options within the plan, use teach-back, and flag resource barriers for the dietitian or care team."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Education questions test teach-back, cultural humility, food insecurity, readiness to change, motivational interviewing, and matching education to patient goals rather than lecturing."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Good nutrition education is practical, respectful, patient-centered, and verified with teach-back."
    }
  ],
  lifecycleNutrition: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Nutrition needs change across pregnancy, infancy, childhood, adulthood, older age, illness, and recovery. Dietetic technicians must understand life-stage priorities and know when specialized dietitian input is needed."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Pregnancy increases needs for folate, iron, iodine, energy adequacy, and food-safety awareness. Infants require age-appropriate feeding and growth monitoring. Children need growth-supportive nutrition and family-centered counseling. Older adults may face decreased appetite, swallowing issues, dental problems, medication interactions, sarcopenia, dehydration, and food insecurity. Acute illness or wounds may raise protein and energy needs."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "An older adult reports low appetite, recent weight loss, difficulty chewing, and living alone. The technician should recognize malnutrition risk and social barriers, document objectively, and escalate for dietitian and team follow-up."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Lifecycle questions test pregnancy nutrients, infant feeding safety, child growth, older-adult malnutrition risk, dysphagia, hydration, and when nutrition support requires escalation."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Life stage changes nutrition priorities. Match screening and education to age, condition, function, and access."
    }
  ],
  documentationScope: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Documentation and scope protect nutrition care quality. Dietetic technicians must chart objective intake, tolerance, education, barriers, and monitoring data while communicating concerns to the dietitian or team."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Good nutrition documentation includes intake percentage, supplement acceptance, weight trends, patient-reported barriers, education provided, teach-back response, diet tolerance, GI symptoms, swallowing concerns, tray issues, allergy or texture concerns, and escalation. Technicians should not independently diagnose malnutrition, prescribe therapeutic diets, or change diet orders outside policy and authorization."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A chart note says 'patient is difficult and won't eat.' Better documentation would state intake amount, reported nausea, foods refused, supplement acceptance, education provided, and notification to the dietitian. Objective notes support safer follow-up."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Documentation questions test objective language, intake monitoring, role boundaries, escalation, confidentiality, and diet-order safety."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Document what happened, what the patient reported, what was taught, what barriers exist, and who was notified."
    }
  ]
};

export const dieteticTechnicianLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "dietetic-technician-nutrition-assessment-screening-and-escalation",
    title: "Nutrition Assessment, Screening, and Escalation",
    topic: "Nutrition Assessment",
    topicSlug: "nutrition-assessment",
    system: "nutrition",
    bodySystem: "nutrition-assessment",
    previewSectionCount: 2,
    seoTitle: "Dietetic Technician Nutrition Assessment Screening and Escalation",
    seoDescription: "Dietetic technician lesson on intake, weight trends, malnutrition risk, labs, food insecurity, GI tolerance, allergies, screening, and escalation to the dietitian.",
    alliedProfessionKey: "dietetic-technician",
    sections: dieteticSections.nutritionAssessment,
    studyTakeaways: ["Assessment uses multiple data streams.", "Food insecurity is clinically relevant.", "Escalate malnutrition risk and unsafe intake patterns."],
    studyCommonTraps: ["Ignoring weight loss", "Treating albumin alone as nutrition diagnosis", "Missing food-access barriers"],
    preTest: [quiz("Unintentional weight loss plus poor intake should prompt:", ["Objective documentation and escalation", "Ignoring the pattern", "Blaming the patient", "Deleting intake records"], 0, "Weight loss and poor intake require objective documentation and escalation according to role.")],
    postTest: [quiz("Nutrition assessment should consider:", ["Intake, weight, labs, tolerance, access, and clinical context", "Only favourite foods", "Only room number", "No social factors"], 0, "Nutrition assessment uses intake, anthropometrics, clinical context, labs, tolerance, and social access factors.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "dietetic-technician-medical-nutrition-therapy-support",
    title: "Medical Nutrition Therapy Support",
    topic: "Medical Nutrition Therapy",
    topicSlug: "medical-nutrition-therapy",
    system: "nutrition",
    bodySystem: "medical-nutrition-therapy",
    previewSectionCount: 2,
    seoTitle: "Dietetic Technician Medical Nutrition Therapy Support",
    seoDescription: "Dietetic technician lesson on diabetes, cardiovascular, renal, wound, malnutrition, and GI nutrition priorities with role-safe education and escalation.",
    alliedProfessionKey: "dietetic-technician",
    sections: dieteticSections.medicalNutritionTherapy,
    studyTakeaways: ["Diet priorities differ by disease state.", "Technicians reinforce authorized plans.", "Individual diet changes require dietitian/provider authorization."],
    studyCommonTraps: ["Changing diet orders independently", "Ignoring renal potassium risk", "Using one generic diet for every condition"],
    preTest: [quiz("A renal-diet patient asks about high-potassium smoothies. What is safest?", ["Refer to the dietitian for individualized guidance", "Approve unlimited intake", "Ignore the question", "Tell them potassium never matters"], 0, "Renal diet questions involving potassium should be individualized by the dietitian or authorized provider.")],
    postTest: [quiz("Wound healing nutrition often emphasizes:", ["Adequate protein and energy", "Zero protein for everyone", "Only caffeine", "No hydration"], 0, "Wound healing commonly requires adequate protein, energy, hydration, and micronutrient support depending on plan.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "dietetic-technician-food-service-safety-allergens-and-textures",
    title: "Food-Service Safety, Allergens, and Texture-Modifed Diets",
    topic: "Food-Service Safety",
    topicSlug: "food-service-safety",
    system: "nutrition",
    bodySystem: "food-service-safety",
    previewSectionCount: 2,
    seoTitle: "Dietetic Technician Food Service Safety Allergens and Textures",
    seoDescription: "Dietetic technician lesson on food safety, allergens, tray accuracy, HACCP, sanitation, temperatures, dysphagia textures, thickened liquids, and cross-contamination prevention.",
    alliedProfessionKey: "dietetic-technician",
    sections: dieteticSections.foodServiceSafety,
    studyTakeaways: ["Allergens and texture orders are safety issues.", "Temperature control prevents foodborne illness.", "Tray accuracy matters clinically."],
    studyCommonTraps: ["Delivering uncertain allergen trays", "Ignoring thickened-liquid orders", "Skipping contact time or temperature checks"],
    preTest: [quiz("A tray contains an unlabeled dessert for a patient with peanut allergy. What should happen?", ["Hold and verify ingredients", "Deliver anyway", "Ask another patient", "Remove the label only"], 0, "Allergen uncertainty requires holding and verifying before delivery.")],
    postTest: [quiz("Texture-modified diets are especially important for patients with:", ["Dysphagia", "Perfect swallowing only", "No aspiration risk", "No diet order"], 0, "Dysphagia diets reduce choking and aspiration risk when ordered.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "dietetic-technician-nutrition-education-teach-back-and-behavior-change",
    title: "Nutrition Education, Teach-Back, and Behavior Change",
    topic: "Nutrition Education",
    topicSlug: "nutrition-education",
    system: "nutrition",
    bodySystem: "nutrition-education",
    previewSectionCount: 2,
    seoTitle: "Dietetic Technician Nutrition Education Teach Back and Behavior Change",
    seoDescription: "Dietetic technician lesson on patient education, teach-back, motivational interviewing basics, cultural humility, food insecurity, label reading, and realistic goal setting.",
    alliedProfessionKey: "dietetic-technician",
    sections: dieteticSections.counselingEducation,
    studyTakeaways: ["Teach-back verifies understanding.", "Education must fit access and culture.", "Avoid shaming and perfectionism."],
    studyCommonTraps: ["Lecturing without teach-back", "Ignoring food budget", "Using generic handouts as the whole intervention"],
    preTest: [quiz("A patient cannot afford foods on a handout. Best response?", ["Explore affordable plan-consistent options and flag barriers", "Blame nonadherence", "End the session", "Tell them to ignore meals"], 0, "Education should account for access and practical barriers.")],
    postTest: [quiz("Teach-back is used to:", ["Confirm understanding in the patient's own words", "Embarrass the patient", "Avoid education", "Replace all documentation"], 0, "Teach-back checks whether education was understood clearly.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "dietetic-technician-lifecycle-nutrition-pregnancy-pediatrics-and-aging",
    title: "Lifecycle Nutrition: Pregnancy, Pediatrics, and Aging",
    topic: "Lifecycle Nutrition",
    topicSlug: "lifecycle-nutrition",
    system: "nutrition",
    bodySystem: "lifecycle-nutrition",
    previewSectionCount: 2,
    seoTitle: "Lifecycle Nutrition Pregnancy Pediatrics and Aging",
    seoDescription: "Dietetic technician lesson on pregnancy nutrition, infant feeding, child growth, older adult malnutrition, dysphagia, hydration, food access, and life-stage priorities.",
    alliedProfessionKey: "dietetic-technician",
    sections: dieteticSections.lifecycleNutrition,
    studyTakeaways: ["Nutrition needs change by life stage.", "Older adults are at malnutrition and dehydration risk.", "Pregnancy and infancy require specialized safety awareness."],
    studyCommonTraps: ["Missing older-adult weight loss", "Ignoring chewing/swallowing barriers", "Using adult advice for infants"],
    preTest: [quiz("Older adult weight loss, low appetite, and chewing difficulty should raise concern for:", ["Malnutrition risk and need for follow-up", "No nutrition issue", "Only cosmetic concern", "Automatic discharge"], 0, "These findings suggest malnutrition risk and require follow-up.")],
    postTest: [quiz("Pregnancy nutrition commonly emphasizes adequate:", ["Folate, iron, iodine, and food-safety awareness", "Only caffeine", "No calories", "No hydration"], 0, "Pregnancy nutrition includes key micronutrients and food-safety considerations.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "dietetic-technician-documentation-scope-and-nutrition-monitoring",
    title: "Documentation, Scope, and Nutrition Monitoring",
    topic: "Dietetic Technician Scope",
    topicSlug: "dietetic-technician-scope",
    system: "nutrition",
    bodySystem: "documentation-scope",
    previewSectionCount: 2,
    seoTitle: "Dietetic Technician Documentation Scope and Nutrition Monitoring",
    seoDescription: "Dietetic technician lesson on objective documentation, intake monitoring, supplement acceptance, education notes, diet-order scope, escalation, and confidentiality.",
    alliedProfessionKey: "dietetic-technician",
    sections: dieteticSections.documentationScope,
    studyTakeaways: ["Document objectively.", "Monitor intake and tolerance trends.", "Do not independently prescribe or change therapeutic diets."],
    studyCommonTraps: ["Judgmental documentation", "Changing diet orders independently", "Failing to notify dietitian of poor intake"],
    preTest: [quiz("Which note is most objective?", ["Ate 25% of lunch; reported nausea; RD notified", "Patient is difficult", "Bad eater", "No need to chart"], 0, "Objective documentation includes intake, symptoms, and team notification.")],
    postTest: [quiz("A dietetic technician should escalate when:", ["Intake remains poor or safety concerns appear", "Everything is stable", "Only the tray color changes", "The room is quiet"], 0, "Poor intake or safety concerns require escalation according to role and policy.")]
  }
];

export default { lessons: dieteticTechnicianLessons };
