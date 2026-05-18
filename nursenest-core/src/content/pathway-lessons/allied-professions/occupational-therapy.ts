function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const occupationalTherapySections = {
  occupationBasedAssessment: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Occupational therapy starts with occupation-based assessment: what the person needs, wants, or is expected to do. OT and OTA learners must connect ADLs, IADLs, cognition, psychosocial context, motor skills, sensory factors, environment, routines, roles, and safety into practical intervention planning."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Assessment considers performance patterns, client factors, performance skills, environment, and occupational demands. ADLs include bathing, dressing, toileting, feeding, grooming, and functional mobility. IADLs include meal preparation, medication management, financial management, community mobility, home management, and caregiving. OTAs implement delegated plans and report response; OTs evaluate, set goals, interpret complex findings, and modify plans according to scope and jurisdiction."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A client can move the shoulder through full range but cannot safely complete upper-body dressing because of sequencing errors and poor awareness of the affected arm. The OT reasoning focus is not strength alone; cognition, body awareness, task demands, setup, cueing, and safety must be addressed."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "OT and OTA exam questions often test whether the learner identifies the actual occupational performance barrier instead of over-focusing on isolated impairment. Common traps include treating a strength score while missing cognition, environment, habit, or role demands."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "OT assessment links body, mind, task, role, and environment. The target is meaningful occupation, not isolated exercise alone."
    }
  ],
  adlIadlIntervention: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "ADL and IADL intervention is where occupational therapy becomes visible to patients: safer dressing, bathing, toileting, feeding, cooking, medication routines, home management, and community participation."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Interventions may use remediation, compensation, adaptation, environmental modification, assistive equipment, graded practice, habit training, caregiver education, and task simplification. The safest plan matches the patient's goals, cognition, physical capacity, culture, home environment, and available support. Adaptive equipment is useful only if the patient can access, learn, and consistently use it."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient with hip precautions repeatedly bends forward while dressing. The OTA should use the plan of care to teach adaptive equipment, safe setup, cueing, and repetition, while reporting persistent safety issues to the OT. Simply telling the patient 'do not bend' without task-specific training is weak intervention."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "ADL/IADL questions test safety sequencing, adaptive equipment selection, cueing level, environmental setup, grading, caregiver training, and whether the chosen intervention supports actual participation."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Effective OT intervention is task-specific, safe, realistic, and tied to the person's daily routines and environment."
    }
  ],
  cognitionPerception: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Cognition and perception affect safety, independence, and participation. Memory, attention, executive function, neglect, apraxia, visual-perceptual deficits, insight, judgment, and sequencing can determine whether a patient can complete a task even when strength is adequate."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "OT interventions may include environmental cues, errorless learning, spaced retrieval, routine building, task breakdown, visual scanning training, caregiver education, and safety modifications. Neglect is not laziness. Apraxia is not simple weakness. Poor insight changes supervision needs. Cueing should be graded: verbal, visual, tactile, gestural, or environmental, with the least support needed for safe success."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "After stroke, a patient leaves the left side of the plate untouched and bumps into the left doorframe. The intervention should include visual scanning, environmental setup, cueing, and safety education rather than assuming refusal or poor motivation."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Exam items often test neglect, apraxia, memory strategy selection, executive dysfunction, safety judgment, and matching cue level to client performance. A common trap is choosing strengthening when the limiting factor is cognitive-perceptual."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Cognitive-perceptual deficits change task safety. Intervene with cues, routines, environment, caregiver training, and graded supports."
    }
  ],
  upperExtremity: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Upper-extremity function supports dressing, feeding, grooming, writing, work, caregiving, and play. OT and OTA learners must connect ROM, strength, tone, coordination, edema, sensation, pain, splinting, precautions, and functional use."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Intervention may involve therapeutic activity, fine-motor training, edema management, positioning, sensory re-education, neuromuscular re-education, orthosis wear schedules per plan, joint protection, energy conservation, and graded functional use. Pain, new swelling, skin breakdown, color change, or neurovascular change requires reassessment or escalation."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A client using a resting hand orthosis develops redness that does not fade after removal. The OTA should stop use and notify the OT according to protocol. Continuing the wear schedule despite pressure signs can cause skin injury."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Upper-extremity questions test splint safety, edema, sensory loss, stroke arm handling, joint protection, functional activity grading, and when to stop due to pain or skin compromise."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "UE intervention should protect tissue, support function, monitor skin and sensation, and connect movement to meaningful tasks."
    }
  ],
  psychosocialPediatrics: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "OT spans mental health, pediatrics, school participation, sensory processing, routines, play, self-regulation, and family systems. This content is high-yield because OT exams often integrate psychosocial reasoning with functional goals."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Psychosocial OT may address coping skills, routines, social participation, medication-management routines, sleep hygiene, stress management, role re-entry, and group participation. Pediatric OT may address play, feeding, handwriting, sensory modulation, developmental milestones, school participation, caregiver education, and environmental supports. Interventions must be client-centered, trauma-informed, culturally safe, and developmentally appropriate."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A child avoids toothbrushing because of sensory defensiveness and becomes distressed during morning routines. OT reasoning would consider sensory modulation, graded exposure, caregiver coaching, routine structure, and functional participation rather than labeling the child as noncompliant."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Psychosocial and pediatric questions test developmental appropriateness, sensory strategies, group leadership, trauma-informed care, therapeutic use of self, caregiver education, and participation-based goals."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Psychosocial and pediatric OT should support participation, regulation, routines, caregiver capacity, and meaningful roles."
    }
  ],
  documentationScope: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "OT/OTA documentation and scope protect the plan of care. Objective documentation, supervision communication, goal linkage, and role boundaries are core exam domains."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Documentation should describe occupational task, assistance level, cueing, adaptive equipment, patient response, safety concerns, education, progress toward goals, and communication with the OT when needed. OTAs implement and contribute under supervision; they do not independently evaluate, create the plan of care, discharge, or ignore significant changes. Scope rules vary by jurisdiction and setting, so exam answers usually reward communication and safety."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "An OTA documents 'patient did badly with dressing.' Better documentation would state assistance level, cueing needed, adaptive equipment used, safety issues, patient response, and whether the OT was notified of a change. Objective detail supports care planning."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Scope questions test OT vs OTA roles, supervision, documentation, discharge limits, reassessment triggers, patient confidentiality, and when a change requires OT involvement."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Document occupational performance objectively, tie intervention to goals, communicate changes, and stay within OT/OTA role boundaries."
    }
  ]
};

export const occupationalTherapyLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "ot-occupation-based-assessment-adls-iadls-and-client-factors",
    title: "Occupation-Based Assessment: ADLs, IADLs, and Client Factors",
    topic: "Occupational Therapy Assessment",
    topicSlug: "ot-assessment",
    system: "occupational-therapy",
    bodySystem: "occupation-based-assessment",
    previewSectionCount: 2,
    seoTitle: "Occupational Therapy Assessment ADLs IADLs and Client Factors",
    seoDescription: "OT and OTA lesson on occupation-based assessment, ADLs, IADLs, client factors, performance skills, environment, routines, roles, and safety.",
    alliedProfessionKey: "occupational-therapy",
    sections: occupationalTherapySections.occupationBasedAssessment,
    studyTakeaways: ["OT assessment targets meaningful occupation.", "Performance barriers can be cognitive, physical, environmental, or social.", "OTAs report response within delegated plans."],
    studyCommonTraps: ["Treating impairment while missing occupation", "Ignoring cognition during ADLs", "Confusing OT and OTA roles"],
    preTest: [quiz("A client has full shoulder ROM but cannot sequence dressing safely. What is the main OT reasoning focus?", ["Only shoulder strengthening", "Cognition, task setup, cueing, and safety", "No intervention", "Only billing"], 1, "The barrier is occupational performance and sequencing, not ROM alone.")],
    postTest: [quiz("IADLs include:", ["Medication management and meal preparation", "Only tooth brushing", "Only bed mobility", "Only passive ROM"], 0, "IADLs include complex daily tasks such as medication management, home management, and meal preparation.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "ot-adl-iadl-intervention-adaptive-equipment-and-home-safety",
    title: "ADL/IADL Intervention, Adaptive Equipment, and Home Safety",
    topic: "OT Intervention",
    topicSlug: "ot-adl-iadl-intervention",
    system: "occupational-therapy",
    bodySystem: "adl-iadl-intervention",
    previewSectionCount: 2,
    seoTitle: "OT ADL IADL Intervention Adaptive Equipment and Home Safety",
    seoDescription: "Occupational therapy lesson on ADL/IADL intervention, adaptive equipment, task grading, home safety, caregiver training, hip precautions, and functional routines.",
    alliedProfessionKey: "occupational-therapy",
    sections: occupationalTherapySections.adlIadlIntervention,
    studyTakeaways: ["Interventions must support real daily routines.", "Adaptive equipment works only if the client can use it safely.", "Task-specific practice beats generic advice."],
    studyCommonTraps: ["Giving equipment without training", "Ignoring home setup", "Using generic reminders instead of task practice"],
    preTest: [quiz("A patient with hip precautions bends during dressing. Best OTA action within plan?", ["Teach safe adaptive-equipment use and task setup", "Ignore precautions", "Force bending practice", "Stop all ADLs forever"], 0, "Task-specific AE training helps maintain precautions during dressing.")],
    postTest: [quiz("Effective ADL intervention should be:", ["Task-specific and realistic for the environment", "Unrelated to patient goals", "Only verbal advice", "The same for every patient"], 0, "ADL intervention should be individualized, safe, and tied to real routines.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "ot-cognition-perception-neglect-apraxia-and-safety-cueing",
    title: "Cognition and Perception: Neglect, Apraxia, and Safety Cueing",
    topic: "OT Cognition and Perception",
    topicSlug: "ot-cognition-perception",
    system: "occupational-therapy",
    bodySystem: "cognition-perception",
    previewSectionCount: 2,
    seoTitle: "OT Cognition Perception Neglect Apraxia and Safety Cueing",
    seoDescription: "OT/OTA lesson on neglect, apraxia, executive function, memory strategies, attention, visual scanning, cueing levels, safety, and task performance.",
    alliedProfessionKey: "occupational-therapy",
    sections: occupationalTherapySections.cognitionPerception,
    studyTakeaways: ["Cognition can be the primary ADL barrier.", "Neglect is not poor motivation.", "Cueing should be graded to safe independence."],
    studyCommonTraps: ["Choosing strengthening for neglect", "Calling apraxia weakness", "Over-cueing without promoting independence"],
    preTest: [quiz("A post-stroke client ignores the left side of a plate and doorway. This suggests:", ["Neglect requiring safety cueing", "Normal behavior only", "Only arm weakness", "No OT relevance"], 0, "Neglect affects safety and ADL performance and requires cueing/environmental strategies.")],
    postTest: [quiz("Cueing should generally aim for:", ["Least support needed for safe success", "Maximum dependence always", "No safety monitoring", "Random prompting only"], 0, "Cueing is graded to support safe participation and independence.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "ot-upper-extremity-function-splinting-edema-and-sensation",
    title: "Upper-Extremity Function: Splinting, Edema, and Sensation",
    topic: "OT Upper Extremity",
    topicSlug: "ot-upper-extremity",
    system: "occupational-therapy",
    bodySystem: "upper-extremity",
    previewSectionCount: 2,
    seoTitle: "OT Upper Extremity Function Splinting Edema and Sensation",
    seoDescription: "Occupational therapy lesson on upper-extremity function, ROM, edema, sensation, orthosis safety, skin checks, pain, joint protection, and functional task grading.",
    alliedProfessionKey: "ota",
    sections: occupationalTherapySections.upperExtremity,
    studyTakeaways: ["Monitor skin and sensation during orthosis use.", "UE work should connect to function.", "Pain or neurovascular change requires escalation."],
    studyCommonTraps: ["Continuing splint use with persistent redness", "Ignoring sensory loss", "Training movement unrelated to occupation"],
    preTest: [quiz("Persistent redness after removing a hand orthosis should prompt:", ["Stop use and notify OT per protocol", "Continue wear schedule unchanged", "Ignore skin", "Add more straps"], 0, "Persistent redness suggests pressure risk and requires stopping and communication.")],
    postTest: [quiz("Upper-extremity intervention should prioritize:", ["Safe functional use and tissue protection", "Painful repetition only", "No skin checks", "Ignoring sensation"], 0, "UE intervention supports function while protecting skin, tissue, and neurovascular status.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "ot-psychosocial-pediatric-sensory-and-routine-based-intervention",
    title: "Psychosocial, Pediatric, Sensory, and Routine-Based Intervention",
    topic: "OT Psychosocial and Pediatrics",
    topicSlug: "ot-psychosocial-pediatrics",
    system: "occupational-therapy",
    bodySystem: "psychosocial-pediatrics",
    previewSectionCount: 2,
    seoTitle: "OT Psychosocial Pediatric Sensory and Routine-Based Intervention",
    seoDescription: "OT/OTA lesson on mental health, pediatrics, sensory modulation, routines, play, caregiver education, trauma-informed practice, group participation, and self-regulation.",
    alliedProfessionKey: "occupational-therapy",
    sections: occupationalTherapySections.psychosocialPediatrics,
    studyTakeaways: ["OT supports routines, roles, and regulation.", "Pediatric intervention must be developmental and family-centered.", "Psychosocial care should be trauma-informed."],
    studyCommonTraps: ["Labeling sensory distress as noncompliance", "Ignoring caregiver education", "Using adult strategies for children without adaptation"],
    preTest: [quiz("A child distressed by toothbrushing due to sensory sensitivity needs:", ["Sensory-aware graded routine intervention", "Punishment only", "No caregiver education", "Ignoring the routine"], 0, "Sensory modulation and routine-based caregiver coaching support participation.")],
    postTest: [quiz("Psychosocial OT commonly supports:", ["Coping skills, routines, roles, and participation", "Only radiology positioning", "Only lab values", "No functional goals"], 0, "Psychosocial OT supports meaningful participation, routines, coping, and roles.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "ot-ota-documentation-supervision-and-scope-of-practice",
    title: "OT/OTA Documentation, Supervision, and Scope of Practice",
    topic: "OT/OTA Scope",
    topicSlug: "ot-ota-documentation-scope",
    system: "occupational-therapy",
    bodySystem: "documentation-scope",
    previewSectionCount: 2,
    seoTitle: "OT OTA Documentation Supervision and Scope of Practice",
    seoDescription: "Occupational therapy lesson on objective documentation, OT/OTA roles, supervision, plan of care, reassessment triggers, discharge limits, confidentiality, and goal linkage.",
    alliedProfessionKey: "ota",
    sections: occupationalTherapySections.documentationScope,
    studyTakeaways: ["Document occupational performance objectively.", "OTAs communicate changes and follow the plan.", "Discharge and evaluation remain OT responsibilities where applicable."],
    studyCommonTraps: ["Vague notes", "Changing plan independently", "Ignoring reassessment triggers"],
    preTest: [quiz("Which OT/OTA note is most objective?", ["Dressed upper body with min assist and two verbal sequencing cues", "Did bad", "Lazy today", "Fine"], 0, "Objective notes describe task, assistance, cueing, and performance.")],
    postTest: [quiz("An OTA should notify the OT when:", ["A significant unexpected change affects the plan of care", "Only the clock changes", "The room is quiet", "No patient change occurs"], 0, "Unexpected changes that affect plan or safety require OT communication.")]
  }
];

export default { lessons: occupationalTherapyLessons };
