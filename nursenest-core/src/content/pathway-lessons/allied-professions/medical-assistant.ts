function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const medicalAssistantSections = {
  rooming: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Medical assistant rooming is the first clinical safety screen in many ambulatory settings. Accurate identifiers, chief complaint capture, medication and allergy review, vital signs, screening tools, and escalation of abnormal findings help the clinician make safe decisions quickly."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "A safe rooming workflow includes two identifiers, reason for visit, relevant history, allergies, medication reconciliation support, preferred pharmacy, pain score, fall risk when relevant, depression or social screening when assigned, and accurate vital signs. The medical assistant does not diagnose, but must recognize red flags such as chest pain, severe shortness of breath, stroke symptoms, syncope, severe allergic reaction, abnormal vital signs, or rapidly worsening condition and escalate immediately."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient scheduled for a routine visit reports chest pressure, diaphoresis, and nausea while being roomed. The medical assistant should stop routine intake and immediately alert the clinician or emergency protocol. Continuing with paperwork because the appointment is routine is unsafe."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Medical assistant exams frequently test prioritization in ordinary clinic workflows. Common traps include documenting abnormal vitals without escalation, ignoring allergy discrepancies, skipping identifiers, or continuing routine rooming when urgent symptoms are present."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Rooming is clinical triage support. Verify identity, gather accurate data, recognize red flags, and escalate immediately when safety changes."
    }
  ],
  vitals: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Vital signs are not routine numbers. Blood pressure, pulse, respiratory rate, temperature, oxygen saturation, pain, height, and weight can uncover acute deterioration, chronic disease risk, medication effects, and measurement errors. Medical assistants must know how technique changes results."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Accurate blood pressure requires correct cuff size, arm position at heart level, patient rest, and proper placement. Pulse and respiratory rate require full attention, especially if irregular or abnormal. Oxygen saturation must be interpreted with perfusion, nail products, motion, and clinical appearance. Weight and height support dosing, BMI, growth, and chronic disease screening. Abnormal results should be repeated when technique error is possible and escalated according to clinic policy."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A blood pressure is very high after using a cuff that is too small. The medical assistant should repeat the measurement with the correct cuff and notify the clinician according to policy if the value remains elevated. Recording a possibly inaccurate value without correction can mislead care."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Exam items often test vital-sign technique: cuff size errors, oxygen saturation artifacts, respiratory counting shortcuts, fever screening, pain reassessment, pediatric measurements, and when abnormal values require immediate escalation."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Vital signs require correct technique, repeat when questionable, and escalation when abnormal or inconsistent with patient appearance."
    }
  ],
  infectionControl: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Ambulatory infection control protects patients, staff, and the community. Medical assistants manage hand hygiene, PPE, room turnover, cleaning levels, specimen handling, sharps safety, respiratory etiquette, and isolation workflow in fast-moving clinic settings."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Standard precautions apply to all patients. Transmission-based precautions add contact, droplet, or airborne protections when indicated by symptoms or diagnosis. Room turnover requires cleaning high-touch surfaces and reusable equipment according to product contact time. Sharps must be disposed of immediately in approved containers without recapping unless policy and device design allow safe technique. Specimens require correct labeling, leakproof containers, and biohazard handling."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient arrives coughing heavily with fever and rash. The medical assistant should apply clinic screening protocol, provide source control such as a mask if appropriate, place the patient according to isolation workflow, notify clinical staff, and use PPE. Letting the patient remain in a crowded waiting room without action increases exposure risk."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Infection-control exam traps include skipping hand hygiene after glove removal, recapping sharps, wiping surfaces without required contact time, mixing clean and dirty supplies, and ignoring respiratory symptoms in waiting-room flow."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Infection control is a sequence: hand hygiene, PPE, source control, clean/dirty separation, sharps safety, and correct disinfection contact time."
    }
  ],
  procedures: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Medical assistants often support minor procedures, ECGs, point-of-care testing, immunization workflow, specimen collection, wound care setup, and chaperoning. The key exam issue is safe preparation within scope, not independent diagnosis or prescribing."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Procedure support includes verifying patient identity and order, preparing supplies, checking consent workflow when required, confirming allergies or contraindication prompts, maintaining clean or sterile fields as assigned, labeling specimens at the bedside or point of collection, documenting accurately, and monitoring for post-procedure concerns. ECG support requires correct lead placement and artifact reduction. Point-of-care testing requires QC awareness and result routing according to policy."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A urine specimen cup is left unlabeled on the counter after the patient exits. The medical assistant should not guess whose specimen it is. The safe response is to follow specimen rejection or recollection policy because mislabeling can lead to wrong-patient results."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Procedure questions often test identity, consent workflow, sterile field contamination, ECG lead placement, specimen labeling, POCT QC, chaperone expectations, and documentation of patient response."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Procedure support is order verification, preparation, asepsis, accurate labeling, monitoring, documentation, and escalation when anything is unsafe or outside scope."
    }
  ],
  medications: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Medication-related work in medical assisting is high-risk because small communication, documentation, or allergy errors can harm patients. The medical assistant may support medication reconciliation, medication administration where permitted, vaccine workflow, and patient education within role and policy."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Medication safety includes the right patient, medication, dose, route, time, documentation, indication or order context, allergy review, expiration check, storage requirements, lot number and site documentation for vaccines when required, and escalation of discrepancies. Medical assistants do not prescribe, independently change doses, or provide clinical medication advice outside authorized scripts and protocols. High-alert situations include allergy mismatch, unclear order, wrong route, pediatric dosing, anticoagulants, insulin, opioids, and vaccines with contraindication prompts."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A vaccine is prepared, but the patient reports a previous severe reaction to the same vaccine. The medical assistant should stop the workflow and alert the clinician. Administering because the appointment was scheduled for that vaccine ignores a possible contraindication."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Medication safety questions reward stopping and clarifying. Common traps include ignoring allergy alerts, giving medication under the wrong patient, failing to document vaccine lot/site, changing dose instructions independently, or bypassing clinician review of contraindications."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Medication workflow requires verification, allergy review, scope awareness, documentation, and escalation before administration when anything is unclear."
    }
  ],
  admin: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Administrative medical assisting is part of patient safety. Scheduling, referrals, prior authorizations, privacy, records release, coding support, portal messages, and phone triage routing affect continuity, legal compliance, and timely care."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Administrative workflows require patient identity verification, privacy compliance, minimum necessary disclosure, accurate message routing, urgent-symptom escalation, referral tracking, documentation of communications, and professional boundaries. A medical assistant should not give independent clinical advice during phone calls or portal messages; urgent symptoms must be routed according to protocol."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A caller reports sudden one-sided weakness and slurred speech while asking for an appointment next week. The medical assistant should follow emergency protocol immediately rather than offering routine scheduling. Administrative access points can become clinical safety checkpoints."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Administrative exam questions often test HIPAA/privacy, release of information, urgent phone messages, referral follow-up, documentation, professional boundaries, and when to route to licensed staff."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Administrative work must protect privacy, route urgent symptoms, document clearly, and keep advice within role."
    }
  ]
};

export const medicalAssistantLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "medical-assistant-rooming-red-flags-and-clinical-intake",
    title: "Rooming, Red Flags, and Clinical Intake",
    topic: "Medical Assistant Clinical Intake",
    topicSlug: "ma-clinical-intake",
    system: "ambulatory-care",
    bodySystem: "clinical-intake",
    previewSectionCount: 2,
    seoTitle: "Medical Assistant Rooming Red Flags and Clinical Intake",
    seoDescription: "Medical assistant lesson on rooming workflow, two identifiers, chief complaint, allergies, medication reconciliation support, urgent symptoms, and escalation.",
    alliedProfessionKey: "medical-assistant",
    sections: medicalAssistantSections.rooming,
    studyTakeaways: ["Rooming is a safety screen.", "Urgent symptoms interrupt routine workflow.", "Medical assistants collect and escalate; they do not diagnose."],
    studyCommonTraps: ["Continuing routine intake during chest pain", "Skipping identifiers", "Documenting abnormal findings without escalation"],
    preTest: [quiz("A routine-visit patient reports chest pressure and diaphoresis during rooming. What should happen first?", ["Finish all paperwork", "Immediately alert clinical staff per protocol", "Tell the patient to wait quietly", "Ignore because the visit is routine"], 1, "Chest pressure with diaphoresis is a red flag requiring immediate escalation.")],
    postTest: [quiz("The safest purpose of rooming is to:", ["Collect accurate data and identify red flags", "Diagnose independently", "Prescribe medication", "Replace the clinician visit"], 0, "Medical assistants support safe clinical intake and escalation, not independent diagnosis.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "medical-assistant-vital-sign-technique-and-abnormal-results",
    title: "Vital Sign Technique and Abnormal Results",
    topic: "Vital Signs",
    topicSlug: "ma-vital-signs",
    system: "ambulatory-care",
    bodySystem: "vital-signs",
    previewSectionCount: 2,
    seoTitle: "Medical Assistant Vital Sign Technique and Abnormal Results",
    seoDescription: "Medical assistant lesson on blood pressure technique, cuff size, pulse, respirations, oxygen saturation, temperature, pain, height, weight, repeat measurement, and escalation.",
    alliedProfessionKey: "medical-assistant",
    sections: medicalAssistantSections.vitals,
    studyTakeaways: ["Technique changes vital-sign accuracy.", "Repeat questionable measurements correctly.", "Escalate abnormal or inconsistent findings."],
    studyCommonTraps: ["Using the wrong cuff size", "Estimating respirations", "Ignoring low SpO2 with distress"],
    preTest: [quiz("A blood pressure was taken with a cuff that is too small. What should the MA do?", ["Record it as final", "Repeat with correct cuff size", "Delete the visit", "Tell the patient to buy a cuff"], 1, "Incorrect cuff size can distort blood pressure and should be corrected.")],
    postTest: [quiz("Which oxygen saturation situation needs escalation?", ["Low SpO2 with shortness of breath", "Warm hands and normal breathing", "Normal reading after rest", "Probe aligned correctly"], 0, "Low oxygen saturation with respiratory symptoms requires prompt clinical escalation.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "medical-assistant-infection-control-sharps-and-room-turnover",
    title: "Infection Control, Sharps, and Room Turnover",
    topic: "Infection Control",
    topicSlug: "ma-infection-control",
    system: "ambulatory-care",
    bodySystem: "infection-control",
    previewSectionCount: 2,
    seoTitle: "Medical Assistant Infection Control Sharps and Room Turnover",
    seoDescription: "Medical assistant lesson on standard precautions, PPE, respiratory etiquette, sharps disposal, disinfection contact time, clean/dirty separation, specimens, and clinic isolation workflow.",
    alliedProfessionKey: "medical-assistant",
    sections: medicalAssistantSections.infectionControl,
    studyTakeaways: ["Standard precautions apply to every patient.", "Sharps go immediately into approved containers.", "Disinfectants need correct contact time."],
    studyCommonTraps: ["Skipping hand hygiene after gloves", "Recapping sharps unsafely", "Ignoring coughing patients in waiting rooms"],
    preTest: [quiz("After removing gloves, the medical assistant should:", ["Perform hand hygiene", "Touch clean supplies first", "Skip cleaning if gloves were worn", "Recap used needles"], 0, "Hand hygiene is required after glove removal.")],
    postTest: [quiz("A used needle should be placed:", ["Immediately in an approved sharps container", "Loose in the trash", "On the counter for later", "In a paper envelope"], 0, "Sharps must be disposed of immediately in approved sharps containers.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "medical-assistant-procedure-support-ecg-poct-and-specimens",
    title: "Procedure Support: ECG, POCT, and Specimens",
    topic: "Medical Assistant Procedures",
    topicSlug: "ma-procedure-support",
    system: "ambulatory-care",
    bodySystem: "procedures",
    previewSectionCount: 2,
    seoTitle: "Medical Assistant Procedure Support ECG POCT and Specimens",
    seoDescription: "Medical assistant lesson on procedure setup, ECG support, point-of-care testing, specimen labeling, sterile field awareness, chaperoning, and documentation.",
    alliedProfessionKey: "medical-assistant",
    sections: medicalAssistantSections.procedures,
    studyTakeaways: ["Verify order and identity before procedures.", "Label specimens at collection.", "POCT requires QC awareness and correct routing."],
    studyCommonTraps: ["Guessing unlabeled specimens", "Contaminating sterile fields", "Ignoring ECG artifact causes"],
    preTest: [quiz("An unlabeled urine specimen is found on the counter. What is safest?", ["Guess the patient", "Follow rejection/recollection policy", "Label it with the next patient", "Ignore the issue"], 1, "Unlabeled specimens create wrong-patient risk and require policy-based rejection or recollection.")],
    postTest: [quiz("Before point-of-care testing, the MA should confirm:", ["Identity, order, specimen, and QC/workflow requirements", "Only room color", "Patient shoe size", "No documentation is needed"], 0, "POCT requires identity, order, specimen integrity, QC awareness, and documentation/routing.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "medical-assistant-medication-and-vaccine-safety",
    title: "Medication and Vaccine Safety",
    topic: "Medication Safety",
    topicSlug: "ma-medication-safety",
    system: "ambulatory-care",
    bodySystem: "medication-safety",
    previewSectionCount: 2,
    seoTitle: "Medical Assistant Medication and Vaccine Safety",
    seoDescription: "Medical assistant lesson on medication workflow, vaccine safety, allergy review, rights of administration, contraindication prompts, lot/site documentation, and escalation.",
    alliedProfessionKey: "medical-assistant",
    sections: medicalAssistantSections.medications,
    studyTakeaways: ["Stop for allergy or contraindication concerns.", "Document vaccine lot, site, and required details by policy.", "Never independently change medication directions."],
    studyCommonTraps: ["Ignoring severe prior vaccine reaction", "Skipping allergy review", "Changing a dose independently"],
    preTest: [quiz("A patient reports a previous severe reaction to a vaccine scheduled today. What should the MA do?", ["Administer anyway", "Stop and alert the clinician", "Hide the information", "Tell the patient reactions do not matter"], 1, "Possible contraindications or severe reactions require stopping and clinician review.")],
    postTest: [quiz("Which medication workflow concern requires clarification?", ["Unclear order with allergy discrepancy", "Correct patient and clear order", "Documented lot number", "Normal screening answers"], 0, "Unclear orders and allergy discrepancies must be clarified before proceeding.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "medical-assistant-administrative-privacy-referrals-and-phone-triage-routing",
    title: "Administrative Safety: Privacy, Referrals, and Phone Triage Routing",
    topic: "Medical Office Administration",
    topicSlug: "ma-administrative-safety",
    system: "ambulatory-care",
    bodySystem: "administrative-safety",
    previewSectionCount: 2,
    seoTitle: "Medical Assistant Administrative Safety Privacy Referrals and Phone Triage",
    seoDescription: "Medical assistant lesson on privacy, release of information, urgent phone messages, referral tracking, documentation, role boundaries, and routing to licensed staff.",
    alliedProfessionKey: "medical-assistant",
    sections: medicalAssistantSections.admin,
    studyTakeaways: ["Administrative access points can reveal urgent symptoms.", "Protect privacy and minimum necessary disclosure.", "Route clinical advice and urgent concerns to licensed staff or emergency protocol."],
    studyCommonTraps: ["Scheduling stroke symptoms routinely", "Giving independent clinical advice", "Disclosing records without authorization"],
    preTest: [quiz("A caller reports sudden one-sided weakness and slurred speech. What should the MA do?", ["Schedule next month", "Follow emergency protocol immediately", "Give casual advice only", "Ignore because it is a phone call"], 1, "Stroke-like symptoms require emergency escalation, not routine scheduling.")],
    postTest: [quiz("Privacy-safe administrative workflow requires:", ["Identity verification and minimum necessary disclosure", "Sharing records with anyone who asks", "Posting results publicly", "Skipping documentation"], 0, "Privacy workflows require identity verification, authorization where needed, and minimum necessary disclosure.")]
  }
];

export default { lessons: medicalAssistantLessons };
