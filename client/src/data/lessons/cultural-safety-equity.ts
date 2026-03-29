import type { LessonContent } from "./types";

export const culturalSafetyEquityLessons: Record<string, LessonContent> = {
  "cultural-safety-rpn": {
    title: "Cultural Safety Foundations",
    cellular: {
      title: "Cultural Safety vs Cultural Competence vs",
      content:
        "Cultural awareness is the foundational recognition that cultural differences exist and influence health beliefs and behaviors. Cultural competence refers to acquiring knowledge and skills to work effectively across cultures, though it implies a finite endpoint. Cultural safety goes further by requiring healthcare providers to reflect on their own cultural identity and power, ensuring the care recipient defines whether the encounter was safe. In Canadian nursing practice, cultural safety is the standard expectation, recognizing that unsafe care can cause harm through discrimination, stereotyping, or failure to address systemic inequities.",
    },
    riskFactors: [
      "Historical trauma from residential schools and colonization",
      "Intergenerational trauma affecting Indigenous communities",
      "Language barriers leading to miscommunication and adverse events",
      "Low health literacy reducing treatment adherence",
      "Implicit bias resulting in disparate care delivery",
      "Lack of professional interpreter services",
      "Dietary and religious practices not accommodated in care plans",
      "Distrust of healthcare systems due to past harms",
    ],
    diagnostics: [
      "Conduct a cultural assessment on admission: preferred language, interpreter needs, spiritual or religious practices, dietary restrictions, decision-making preferences, and traditional healing practices",
      "Use validated health literacy screening tools (e.g., Newest Vital Sign, REALM-SF) to assess the patient's ability to understand health information",
      "Assess communication effectiveness: does the patient demonstrate understanding when using teach-back method?",
      "Evaluate patient satisfaction and perceived safety using culturally appropriate feedback tools",
      "Screen for social determinants of health: housing stability, food security, transportation access, social support, and financial barriers to care",
      "Assess for signs of healthcare avoidance or delayed care-seeking related to past negative experiences with the healthcare system",
    ],
    management: [
      "Use professional interpreters rather than family members for clinical communication",
      "Apply the teach-back method to verify patient understanding",
      "Provide plain language materials appropriate to literacy level",
      "Respect and integrate traditional healing practices when requested",
      "Accommodate dietary and religious considerations in meal planning and care",
      "Recognize and mitigate implicit bias through self-reflection",
      "Apply trauma-informed care principles: safety, trustworthiness, choice, collaboration, empowerment",
      "Document cultural preferences and care needs in the care plan",
    ],
    nursingActions: [
      "Assess health literacy level at admission using validated tools",
      "Arrange professional interpreter services before clinical encounters",
      "Ask patients about cultural or spiritual practices important to their care",
      "Avoid assumptions based on appearance, name, or background",
      "Create a welcoming environment that acknowledges diverse identities",
      "Report culturally unsafe practices or policies through appropriate channels",
    ],
    signs: {
      left: [
        "Patient avoids eye contact or appears withdrawn during assessment",
        "Family member interpreting instead of professional interpreter",
        "Patient nodding but unable to demonstrate understanding via teach-back",
        "Refusal of food or medications without documented cultural assessment",
        "Expressions of distrust toward healthcare providers or institutions",
      ],
      right: [
        "Patient actively participates when cultural needs are acknowledged",
        "Improved adherence after plain language education is provided",
        "Patient verbalizes feeling safe and respected in the care environment",
        "Successful teach-back demonstration after adapted communication",
        "Patient shares traditional healing practices they wish to incorporate",
      ],
    },
    medications: [
      {
        name: "Culturally Adapted Medication Education",
        type: "Communication Intervention",
        action:
          "Providing medication instructions in the patient's preferred language using professional translation, pictograms, and teach-back verification to ensure safe administration",
        sideEffects:
          "Increased time required for education sessions; need for interpreter scheduling",
        contra:
          "Using family members as interpreters for medication education due to risk of inaccurate translation",
        pearl:
          "Always verify medication understanding through teach-back regardless of perceived language proficiency; patients may appear to understand but miss critical safety information",
      },
    ],
    pearls: [
      "Cultural safety is defined by the recipient of care, not the provider. A nurse cannot self-declare their care as culturally safe.",
      "Using family members as interpreters violates best practice standards due to risks of filtering, inaccuracy, and role conflict.",
      "The teach-back method asks patients to explain information in their own words, confirming understanding rather than simply asking if they understand.",
      "Trauma-informed care assumes that any patient may have experienced trauma and adapts the approach accordingly without requiring disclosure.",
      "Residential schools operated in Canada until 1996, and their legacy continues to affect Indigenous health outcomes across generations.",
      "Implicit bias operates unconsciously and can affect clinical decisions including pain assessment, triage priority, and treatment recommendations.",
    ],
    quiz: [
      {
        question:
          "A nurse is caring for an Indigenous patient who requests a visit from a traditional healer. What is the most appropriate action?",
        options: [
          "Explain that hospital policy does not allow non-medical practitioners",
          "Facilitate the visit and document the patient's cultural care preferences",
          "Suggest the patient wait until discharge to see the healer",
          "Ask the physician to approve the visit first",
        ],
        correct: 1,
        rationale:
          "Facilitating access to traditional healing practices is a component of culturally safe care. The nurse should advocate for the patient's cultural needs and document preferences in the care plan.",
      },
      {
        question:
          "A patient with limited English proficiency needs discharge instructions. The patient's adult child offers to interpret. What should the nurse do?",
        options: [
          "Accept the offer since the family member knows the patient best",
          "Proceed with discharge using written instructions only",
          "Arrange for a professional interpreter before providing instructions",
          "Speak slowly and use medical terminology to be precise",
        ],
        correct: 2,
        rationale:
          "Professional interpreters are required for clinical communication to ensure accuracy, maintain confidentiality, and avoid role conflict. Family members may filter or inaccurately translate critical health information.",
      },
      {
        question:
          "Which statement best describes cultural safety in nursing practice?",
        options: [
          "The nurse has completed cultural competence training and certification",
          "The nurse treats all patients exactly the same regardless of background",
          "The care recipient determines whether the care provided was culturally safe",
          "The nurse has knowledge of multiple cultural practices and traditions",
        ],
        correct: 2,
        rationale:
          "Cultural safety is defined by the recipient of care. It goes beyond knowledge acquisition to address power imbalances and systemic factors. The patient determines whether care was safe, not the provider.",
      },
    ],
  },

  "cultural-safety-rn": {
    title: "Cultural Safety and Health Equity",
    cellular: {
      title: "Social Determinants of Health",
      content:
        "Social determinants of health are the non-medical factors that influence health outcomes, including income, education, housing, food security, social support networks, employment, and access to healthcare services. These determinants create systemic health inequities that disproportionately affect marginalized populations including Indigenous peoples, racialized communities, refugees, immigrants, LGBTQ2S+ individuals, and people with disabilities. Health equity frameworks require nurses to move beyond individual patient care to recognize and address structural barriers that produce unequal health outcomes. The Truth and Reconciliation Commission Calls to Action include specific directives for healthcare, and Jordan's Principle ensures Indigenous children receive needed services without jurisdictional delays.",
    },
    riskFactors: [
      "Poverty and income insecurity limiting access to medications, nutrition, and healthcare",
      "Housing instability and homelessness increasing exposure to illness and injury",
      "Food insecurity leading to malnutrition and chronic disease exacerbation",
      "Systemic racism creating barriers to equitable healthcare access",
      "Refugee and immigrant status with associated screening gaps and trust deficits",
      "LGBTQ2S+ discrimination leading to delayed care seeking and mental health impacts",
      "Disability-related barriers in healthcare environments and communication",
      "Geographic isolation limiting access to specialized services",
      "Implicit bias in pain management leading to undertreatment in racialized populations",
      "Diagnostic bias resulting in delayed or missed diagnoses in marginalized groups",
    ],
    management: [
      "Apply health equity frameworks when developing care plans",
      "Screen for social determinants using validated tools without re-traumatizing patients",
      "Implement trauma-informed screening approaches in clinical assessments",
      "Advocate for policy changes that address systemic barriers to health",
      "Apply Jordan's Principle to ensure Indigenous children receive timely services",
      "Use the medicine wheel approach when providing care to Indigenous patients who identify with this framework",
      "Create safe environments for LGBTQ2S+ patients including correct pronoun use",
      "Implement disability-inclusive care practices including accessible communication",
      "Address implicit bias through structured clinical decision-making tools",
      "Support anti-racism initiatives within healthcare organizations",
    ],
    nursingActions: [
      "Assess social determinants of health as part of comprehensive patient assessment",
      "Connect patients with community resources addressing housing, food, and income needs",
      "Use trauma-informed language and approaches during assessments and procedures",
      "Advocate for patients experiencing systemic barriers to care",
      "Document patient preferences regarding cultural and spiritual care needs",
      "Challenge discriminatory practices or language observed in the healthcare setting",
      "Apply standardized pain assessment tools to reduce bias in pain management",
      "Facilitate access to culturally appropriate mental health services",
    ],
    signs: {
      left: [
        "Patient presents with preventable complications due to delayed care seeking",
        "Repeated emergency department visits for conditions manageable in primary care",
        "Non-adherence to treatment plan related to medication cost or access barriers",
        "Signs of food insecurity such as unintentional weight loss or micronutrient deficiency",
        "Patient expresses fear or distrust of healthcare providers or institutions",
        "Evidence of diagnostic delay or undertreated pain in marginalized patient",
      ],
      right: [
        "Improved health outcomes when social determinants are addressed in the care plan",
        "Patient engagement increases when culturally safe care is provided",
        "Reduced emergency visits when connected with appropriate community resources",
        "Patient reports feeling respected and heard in the healthcare environment",
        "Successful care transitions when cultural and social needs are documented",
        "Improved medication adherence when affordability barriers are addressed",
      ],
    },
    medications: [
      {
        name: "Naloxone (Narcan) Distribution Programs",
        type: "Opioid Antagonist / Harm Reduction",
        action:
          "Reverses opioid-induced respiratory depression; distributed through community-based harm reduction programs that address health equity by providing life-saving medication to populations disproportionately affected by the opioid crisis",
        sideEffects:
          "Precipitated withdrawal symptoms including agitation, nausea, vomiting, tachycardia; may require repeat dosing",
        contra:
          "No absolute contraindications in emergency opioid overdose situations; hypersensitivity to naloxone",
        pearl:
          "Equitable naloxone distribution programs recognize that opioid-related harms disproportionately affect Indigenous communities, people experiencing homelessness, and those with concurrent mental health conditions; nurses should provide non-judgmental education on naloxone use",
      },
    ],
    pearls: [
      "Jordan's Principle is a child-first principle ensuring First Nations children can access public services without delays caused by jurisdictional disputes between federal and provincial governments.",
      "The medicine wheel approach addresses health holistically across physical, emotional, mental, and spiritual dimensions and should only be applied when the patient identifies with this framework.",
      "Implicit bias in pain management is well-documented; studies show racialized patients receive less analgesia and longer wait times for pain treatment compared to white patients with identical presentations.",
      "Trauma-informed care does not require patients to disclose trauma; it creates safety through predictable routines, clear communication, and patient choice.",
      "The Truth and Reconciliation Commission's Call to Action 23 calls for increasing the number of Indigenous health professionals and Call to Action 24 requires cultural competency training for all healthcare professionals.",
      "Anti-racism in healthcare requires active identification and dismantling of policies and practices that produce racial inequity, not simply the absence of overtly racist behavior.",
    ],
    quiz: [
      {
        question:
          "A nurse is assessing a patient who recently arrived in Canada as a refugee. The patient is reluctant to share health history. What is the most appropriate initial approach?",
        options: [
          "Insist on completing the full health history to ensure safe care",
          "Use a trauma-informed approach, explain confidentiality, and allow the patient to share at their own pace",
          "Ask the patient's family to provide the health history instead",
          "Document that the patient is non-compliant with the assessment",
        ],
        correct: 1,
        rationale:
          "Trauma-informed care recognizes that refugees may have experienced significant trauma. Building trust through transparency about confidentiality and allowing patient control over disclosure promotes safety and engagement without re-traumatization.",
      },
      {
        question:
          "A nurse notices that Indigenous patients on the unit consistently receive lower doses of analgesics compared to non-Indigenous patients with similar pain scores. What should the nurse do?",
        options: [
          "Accept that different patients have different pain thresholds",
          "Document the observation and report the pattern to the unit manager as a potential equity concern",
          "Individually adjust doses without addressing the systemic pattern",
          "Assume the prescriber has clinical rationale for each decision",
        ],
        correct: 1,
        rationale:
          "Patterns of disparate pain management based on race or ethnicity indicate potential implicit bias and represent a systemic equity concern. The nurse has a professional obligation to report observed patterns that may result in inequitable care.",
      },
      {
        question:
          "Which of the following best describes a social determinant of health?",
        options: [
          "A patient's genetic predisposition to cardiovascular disease",
          "A patient's inability to afford prescribed medications due to low income",
          "A patient's non-adherence to a prescribed exercise regimen",
          "A patient's allergic reaction to a first-line antibiotic",
        ],
        correct: 1,
        rationale:
          "Social determinants of health are the conditions in which people are born, grow, live, work, and age that affect health outcomes. Income insecurity affecting medication access is a social determinant. Genetic factors, lifestyle choices, and drug reactions are not social determinants.",
      },
    ],
  },

  "cultural-safety-np": {
    title: "Cultural Humility",
    cellular: {
      title: "Cultural Humility",
      content:
        "Cultural humility is a lifelong process of self-reflection and self-critique that acknowledges power differentials between healthcare providers and patients. Unlike cultural competence, which implies mastery, cultural humility recognizes that understanding culture is an ongoing, never-complete endeavor. Structural competency extends this framework by requiring nurse practitioners to understand how institutional policies, economic structures, and social systems create and perpetuate health disparities. Equity-informed prescribing considers socioeconomic factors such as medication affordability, formulary navigation, and access to pharmacy services when developing treatment plans, ensuring that clinical decisions do not inadvertently widen health inequities.",
    },
    riskFactors: [
      "Power differentials between NP and patient affecting shared decision-making",
      "Prescribing patterns that do not account for medication affordability",
      "Institutional policies that create barriers to care for marginalized populations",
      "Research evidence gaps for underrepresented populations in clinical trials",
      "Mental health assessment tools not validated across diverse cultural groups",
      "Lack of integration between traditional medicine and Western healthcare",
      "Health literacy barriers affecting informed consent and treatment adherence",
      "Systemic racism embedded in healthcare organizational structures",
      "Inadequate community health assessment informing population-level interventions",
    ],
    management: [
      "Practice cultural humility through ongoing self-reflection on biases and power dynamics",
      "Apply UNDRIP principles supporting Indigenous self-determination in healthcare decisions",
      "Consider medication cost and formulary coverage when prescribing",
      "Integrate traditional medicine with Western practice when requested by Indigenous patients",
      "Conduct community health assessments to identify population-level health inequities",
      "Adapt informed consent processes for varying health literacy levels",
      "Use equity-informed evidence appraisal recognizing gaps in research representation",
      "Design population-level interventions addressing root causes of health disparities",
      "Implement culturally adapted mental health screening and assessment tools",
      "Advocate for institutional policy changes that reduce structural barriers to care",
    ],
    nursingActions: [
      "Assess medication affordability before prescribing and offer alternatives when needed",
      "Adapt medication instructions using pictograms and plain language for low-literacy patients",
      "Engage in shared decision-making that acknowledges and addresses power differentials",
      "Apply equity lens when interpreting clinical guidelines and research evidence",
      "Collaborate with Indigenous communities to support self-determination in healthcare",
      "Conduct cultural safety assessments of clinical environments and practices",
      "Mentor other healthcare providers in cultural humility principles",
      "Participate in anti-racism and equity initiatives at the organizational level",
    ],
    signs: {
      left: [
        "Patient unable to fill prescriptions due to cost or formulary restrictions",
        "Treatment non-adherence related to culturally incongruent care plan",
        "Mental health symptoms assessed using tools not validated for patient's cultural background",
        "Indigenous patient declining Western treatment without exploration of traditional alternatives",
        "Informed consent obtained without assessing patient comprehension level",
        "Community health data showing persistent disparities despite available interventions",
      ],
      right: [
        "Improved treatment adherence when affordability is addressed in prescribing",
        "Patient engagement increases with shared decision-making and acknowledged power dynamics",
        "Successful integration of traditional and Western medicine in treatment plan",
        "Community health indicators improve with population-level equity interventions",
        "Informed consent process adapted to health literacy level with verified understanding",
        "Culturally adapted mental health assessment yields more accurate clinical picture",
      ],
    },
    medications: [
      {
        name: "Equity-Informed Formulary Navigation",
        type: "Prescribing Framework",
        action:
          "Systematic consideration of medication cost, insurance coverage, patient assistance programs, and generic alternatives when selecting pharmacotherapy to ensure treatment plans are accessible regardless of socioeconomic status",
        sideEffects:
          "May require additional time for research into patient assistance programs; potential need to deviate from first-line recommendations based on affordability",
        contra:
          "Prescribing expensive brand-name medications without assessing patient ability to afford them; assuming all patients have equivalent pharmacy access",
        pearl:
          "Always ask about drug coverage and financial barriers before finalizing a prescription; a medication the patient cannot afford is a medication they will not take, making it clinically ineffective regardless of its pharmacological efficacy",
      },
    ],
    pearls: [
      "Cultural humility differs from cultural competence in that it is a process rather than an endpoint; no provider ever achieves complete cultural understanding.",
      "UNDRIP (United Nations Declaration on the Rights of Indigenous Peoples) affirms Indigenous peoples' right to their traditional medicines and health practices, and the right to access all social and health services without discrimination.",
      "Structural competency requires NPs to look beyond individual patient factors and examine how institutional policies, funding models, and social systems create health disparities.",
      "Equity-informed prescribing means that medication cost, pharmacy access, and insurance coverage are clinical considerations as important as pharmacokinetics and drug interactions.",
      "Mental health assessment tools developed and validated primarily in Western populations may produce inaccurate results when applied across diverse cultural contexts without adaptation.",
      "Community health assessment at the population level allows NPs to identify systemic patterns of health inequity that are invisible at the individual patient level.",
    ],
    quiz: [
      {
        question:
          "An NP is prescribing antihypertensive medication for a patient with limited income and no drug coverage. What is the most equity-informed approach?",
        options: [
          "Prescribe the newest evidence-based medication regardless of cost",
          "Select an effective generic medication, verify affordability, and connect the patient with assistance programs if needed",
          "Recommend lifestyle modifications only to avoid medication costs",
          "Prescribe the medication and assume the patient will find a way to pay",
        ],
        correct: 1,
        rationale:
          "Equity-informed prescribing considers medication affordability as a clinical factor. Selecting an effective generic, verifying the patient can afford it, and connecting with assistance programs ensures the treatment plan is both evidence-based and accessible.",
      },
      {
        question:
          "An NP is conducting a mental health assessment for an Indigenous patient using a standardized screening tool. The patient's responses do not seem consistent with the clinical presentation. What should the clinician consider?",
        options: [
          "The patient is likely malingering or exaggerating symptoms",
          "The standardized tool may not be culturally validated for this population and a culturally adapted approach should be explored",
          "Standardized tools are universally valid and the results should be accepted",
          "The assessment should be repeated with a family member present",
        ],
        correct: 1,
        rationale:
          "Many standardized mental health screening tools were developed and validated in Western populations and may not accurately capture the mental health experience of Indigenous patients. Cultural adaptation of assessment approaches is necessary for accurate clinical evaluation.",
      },
      {
        question:
          "Which concept best describes the practice of examining how institutional policies and social systems create health disparities?",
        options: [
          "Cultural competence",
          "Cultural awareness",
          "Structural competency",
          "Clinical reasoning",
        ],
        correct: 2,
        rationale:
          "Structural competency is the framework that examines how institutions, policies, economic structures, and social systems create and perpetuate health disparities. It moves beyond individual cultural knowledge to address systemic root causes of inequity.",
      },
    ],
  },
};
