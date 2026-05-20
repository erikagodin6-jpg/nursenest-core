function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const physiotherapySections = {
  movementAssessment: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Physiotherapy and PTA practice starts with movement assessment. Learners must connect pain behavior, range of motion, strength, posture, gait, balance, functional limits, red flags, and patient goals into safe rehabilitation decisions."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "A movement assessment compares active and passive range, resisted testing, joint mobility, neurologic screen findings, gait pattern, balance reactions, functional transfers, and symptom irritability. Assistants must understand findings well enough to follow the plan of care, report meaningful change, and avoid progressing beyond scope or patient tolerance. Red flags such as unexplained weight loss, progressive neurologic deficit, saddle anesthesia, fever with spinal pain, suspected fracture, or acute vascular compromise require escalation."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient in rehab reports new foot drop and worsening numbness after a back-pain flare. The safe response is not to continue routine strengthening. The clinician or assistant should stop, document the change, and escalate according to the supervising therapist or emergency pathway because progressive neurologic deficit is a red flag."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Rehab exam items often test whether to continue, modify, regress, or escalate. Common traps include treating new neurologic findings as soreness, progressing exercises despite worsening symptoms, or ignoring function when isolated strength scores improve."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Movement assessment is pattern recognition plus safety. Compare function, symptoms, neuro signs, strength, ROM, and response to treatment before progressing."
    }
  ],
  therapeuticExercise: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Therapeutic exercise is dose-controlled rehabilitation. Correct exercise choice, load, repetitions, progression, regression, cueing, recovery, and symptom monitoring determine whether the plan builds capacity or aggravates tissue."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Exercise prescription considers tissue healing stage, irritability, baseline strength, endurance, mobility, balance, pain response, cardiopulmonary tolerance, and goals. Progression may increase resistance, range, complexity, speed, volume, or functional integration. Regression may reduce load, range, repetitions, speed, or position. PTAs deliver and adapt within the plan of care; unexpected deterioration, new pain pattern, or safety change requires communication with the supervising therapist."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A post-op patient develops swelling and sharp pain during an exercise that was previously tolerated. The correct response is not to push through for strength gains. Stop or regress the activity, assess response within role, document, and notify the therapist according to plan and protocol."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Therapeutic exercise questions test progression logic. The safest answer usually matches load to tissue tolerance and function, not the most aggressive strengthening option. Watch for contraindications, post-op restrictions, vital sign changes, and pain that changes quality or intensity."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Progress only when symptoms, control, and function support it. Regress or escalate when response is unsafe or unexpected."
    }
  ],
  gaitMobility: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Gait and mobility training are central to rehab safety. Transfers, assistive devices, weight-bearing status, stair negotiation, balance, fall risk, endurance, and environmental barriers determine whether patients can move safely outside the therapy session."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      body: "Safe mobility starts with weight-bearing precautions, device fit, footwear, lines and tubes, vital signs, cognition, balance, and fatigue. Cane use generally supports the opposite side of the involved limb. Walkers require correct height and sequencing. Crutches require instruction for gait pattern and stairs. Transfers require setup, brakes, surface height, guarding, and clear cues. A near fall, dizziness, chest pain, or significant oxygen desaturation requires stopping and escalation.",
      kind: "core_concept"
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient becomes dizzy and pale during gait training after standing. The safest response is to stop ambulation, guard and sit or assist safely, assess vital signs within role, and notify the therapist or clinical team according to protocol. Continuing to meet a walking-distance goal is unsafe."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Gait questions often test sequencing, device fit, guarding position, weight-bearing restrictions, stairs, fall prevention, and when to stop treatment. Do not ignore physiologic intolerance during mobility."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Mobility training is safety plus function. Respect weight-bearing orders, guard effectively, monitor tolerance, and stop when physiology or balance becomes unsafe."
    }
  ],
  neuroRehab: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Neurologic rehabilitation focuses on motor control, tone, balance, coordination, sensation, cognition, gait, transfers, and participation. Effective care links neuroplasticity principles to task-specific practice and patient safety."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Neuro rehab uses repetition, salience, specificity, feedback, progression, and functional task practice. Stroke, spinal cord injury, Parkinson disease, multiple sclerosis, traumatic brain injury, vestibular disorders, and peripheral neuropathy can alter movement strategy and safety. Watch for fatigue, autonomic issues, neglect, impulsivity, spasticity, foot drop, dysphagia-related precautions, and fall risk."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient after stroke consistently ignores objects on the left and bumps into the doorway during gait. The rehab response should incorporate safety guarding, cueing, environmental scanning, and therapist communication rather than assuming the patient is careless. Neglect is a neurologic safety issue."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Neuro rehab questions test safety, cueing, task-specific training, spasticity handling, fall risk, fatigue, vestibular symptoms, and recognizing when a neurologic change requires escalation."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Neuro rehab is repetition with purpose. Train meaningful tasks, monitor safety, cue effectively, and escalate new neurologic decline."
    }
  ],
  cardiopulmonary: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Cardiopulmonary rehab and acute mobility require careful monitoring of oxygenation, heart rate, blood pressure, perceived exertion, symptoms, fatigue, and recovery. Rehab professionals must know when activity is therapeutic and when it becomes unsafe."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Exercise tolerance is assessed through vitals, dyspnea scale, rate of perceived exertion, SpO2, heart rate response, blood pressure response, chest symptoms, dizziness, pallor, diaphoresis, and recovery time. Stop or escalate for chest pain, severe shortness of breath, syncope, new confusion, unstable vitals, significant desaturation by protocol, or signs of poor perfusion. Pacing, breathing strategies, energy conservation, and interval dosing support safer progression."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "During stair training, a patient develops chest pressure and becomes diaphoretic. The correct response is to stop activity, assist to a safe position, alert clinical staff or emergency protocol, and monitor within role. Coaching the patient to finish the stairs is unsafe."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Cardiopulmonary rehab questions test stop criteria, vital-sign interpretation, oxygen tubing safety, energy conservation, breathing strategies, and progression based on physiologic response rather than patient motivation alone."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Monitor response before, during, and after activity. Symptoms and unstable physiology override exercise goals."
    }
  ],
  documentationScope: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Rehab documentation and scope protect patients and licenses. PTAs and assistants must record objective response, communicate changes, follow the plan of care, and avoid independent evaluation or plan modification beyond role."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Good documentation states what was done, patient response, assistance level, device, distance, repetitions, symptoms, vitals when relevant, education, barriers, and communication with the therapist or team. Assistants may progress or regress within delegated parameters depending on jurisdiction and setting, but they do not independently diagnose, discharge, create a plan of care, or ignore unexpected changes."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A PTA documents that the patient 'seemed lazy' during gait training. This is not objective. Better documentation would describe distance, assist level, observed gait deviations, reported fatigue, vital response, rest breaks, and education provided."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Scope and documentation questions test delegation, objective language, reporting changes, reassessment triggers, discharge limits, patient confidentiality, and when the supervising therapist must be involved."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      body: "Document observable facts, follow the plan of care, communicate meaningful changes, and stay within role boundaries.",
      kind: "takeaways"
    }
  ]
};

export const physiotherapyRehabLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "physiotherapy-movement-assessment-red-flags-and-functional-baseline",
    title: "Movement Assessment, Red Flags, and Functional Baseline",
    topic: "Physiotherapy Assessment",
    topicSlug: "physiotherapy-assessment",
    system: "rehabilitation",
    bodySystem: "movement-assessment",
    previewSectionCount: 2,
    seoTitle: "Physiotherapy Movement Assessment Red Flags and Functional Baseline",
    seoDescription: "Physiotherapy and PTA lesson on movement assessment, ROM, strength, gait, balance, neurologic screen, red flags, function, and safe escalation.",
    alliedProfessionKey: "physiotherapy",
    sections: physiotherapySections.movementAssessment,
    studyTakeaways: ["Function, symptoms, and objective findings must match.", "New neurologic deficit is a red flag.", "Assistants report meaningful change within the plan of care."],
    studyCommonTraps: ["Treating foot drop as soreness", "Ignoring worsening symptoms", "Progressing without checking functional response"],
    preTest: [quiz("New foot drop during rehab should prompt:", ["Routine progression", "Escalation for new neurologic deficit", "Ignoring symptoms", "Only more resistance"], 1, "New foot drop is a neurologic red flag requiring escalation.")],
    postTest: [quiz("A functional baseline should include:", ["Mobility, symptoms, strength/ROM, balance, and safety", "Only favorite exercise", "No patient goals", "Only billing codes"], 0, "Functional baseline combines objective findings, symptoms, mobility, goals, and safety. ")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "physiotherapy-therapeutic-exercise-progression-and-regression",
    title: "Therapeutic Exercise Progression and Regression",
    topic: "Therapeutic Exercise",
    topicSlug: "therapeutic-exercise",
    system: "rehabilitation",
    bodySystem: "exercise-prescription",
    previewSectionCount: 2,
    seoTitle: "Therapeutic Exercise Progression and Regression for Physiotherapy and PTA",
    seoDescription: "Rehab lesson on exercise dosing, tissue irritability, load progression, regression, post-op restrictions, pain response, and safe PTA communication.",
    alliedProfessionKey: "physiotherapy",
    sections: physiotherapySections.therapeuticExercise,
    studyTakeaways: ["Progression must match tissue tolerance.", "Regress when pain or swelling changes unexpectedly.", "Communicate unsafe response to the therapist."],
    studyCommonTraps: ["Pushing through sharp pain", "Ignoring post-op restrictions", "Progressing load without control"],
    preTest: [quiz("Sharp new pain and swelling during exercise should lead to:", ["Stop/regress and notify as appropriate", "Add more weight", "Ignore it", "Discharge immediately without documentation"], 0, "Unexpected sharp pain and swelling require stopping or regressing and communicating according to plan.")],
    postTest: [quiz("Exercise progression may involve increasing:", ["Load, range, complexity, volume, or functional demand", "Only room temperature", "Documentation delay", "Pain severity intentionally"], 0, "Progression can occur through multiple variables, but only when response supports it.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "physiotherapy-gait-transfer-training-and-assistive-devices",
    title: "Gait, Transfer Training, and Assistive Devices",
    topic: "Gait and Mobility",
    topicSlug: "gait-and-mobility",
    system: "rehabilitation",
    bodySystem: "mobility",
    previewSectionCount: 2,
    seoTitle: "Gait Transfer Training and Assistive Devices for PTA and Physiotherapy",
    seoDescription: "Rehab lesson on transfers, gait training, cane/walker/crutches, weight-bearing precautions, stairs, guarding, fall risk, and stop criteria.",
    alliedProfessionKey: "pta",
    sections: physiotherapySections.gaitMobility,
    studyTakeaways: ["Respect weight-bearing restrictions.", "Guard based on fall risk and task.", "Dizziness or chest symptoms stop mobility training."],
    studyCommonTraps: ["Continuing through dizziness", "Wrong cane side", "Ignoring brakes, lines, or oxygen tubing"],
    preTest: [quiz("A patient becomes dizzy and pale during gait training. What is safest?", ["Continue to target distance", "Stop, guard, sit safely, assess, and notify per protocol", "Walk faster", "Remove the assistive device"], 1, "Dizziness and pallor during mobility require stopping and safe assessment/escalation.")],
    postTest: [quiz("A cane is commonly held on which side for unilateral lower-limb weakness?", ["Opposite the involved limb", "Always same side regardless of pattern", "In both hands", "Never used"], 0, "A cane usually supports the side opposite the involved limb, unless the plan specifies otherwise.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "physiotherapy-neurologic-rehab-motor-control-balance-and-safety",
    title: "Neurologic Rehab: Motor Control, Balance, and Safety",
    topic: "Neurologic Rehabilitation",
    topicSlug: "neurologic-rehabilitation",
    system: "rehabilitation",
    bodySystem: "neuro-rehab",
    previewSectionCount: 2,
    seoTitle: "Neurologic Rehab Motor Control Balance and Safety",
    seoDescription: "Physiotherapy lesson on stroke rehab, neuroplasticity, balance, neglect, spasticity, foot drop, vestibular symptoms, task-specific practice, and safety cueing.",
    alliedProfessionKey: "physiotherapy",
    sections: physiotherapySections.neuroRehab,
    studyTakeaways: ["Neuro rehab uses meaningful repetition.", "Neglect and impulsivity are safety issues.", "New neurologic decline requires escalation."],
    studyCommonTraps: ["Calling neglect carelessness", "Ignoring fatigue", "Using generic exercise without task specificity"],
    preTest: [quiz("A stroke patient bumps into objects on the left and ignores left-side cues. This suggests:", ["Possible neglect requiring safety cueing", "Poor attitude only", "Normal gait", "No rehab concern"], 0, "Left neglect is a neurologic safety concern and requires cueing and guarding strategies.")],
    postTest: [quiz("Task-specific practice means training:", ["Relevant functional tasks repeatedly and safely", "Only unrelated movements", "No patient goals", "Random activities without feedback"], 0, "Neuroplasticity-based rehab emphasizes meaningful, specific, repeated practice.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "physiotherapy-cardiopulmonary-rehab-vitals-and-stop-criteria",
    title: "Cardiopulmonary Rehab: Vitals and Stop Criteria",
    topic: "Cardiopulmonary Rehab",
    topicSlug: "cardiopulmonary-rehab",
    system: "rehabilitation",
    bodySystem: "cardiopulmonary-rehab",
    previewSectionCount: 2,
    seoTitle: "Cardiopulmonary Rehab Vitals and Stop Criteria",
    seoDescription: "Physiotherapy and PTA lesson on activity tolerance, SpO2, HR, BP, dyspnea, RPE, chest pain, desaturation, energy conservation, and stop criteria.",
    alliedProfessionKey: "pta",
    sections: physiotherapySections.cardiopulmonary,
    studyTakeaways: ["Physiologic response controls activity dosing.", "Chest pain and severe dyspnea require stopping and escalation.", "Recovery time matters."],
    studyCommonTraps: ["Finishing stairs despite chest pressure", "Ignoring desaturation", "Progressing based only on motivation"],
    preTest: [quiz("Chest pressure and diaphoresis during stair training should prompt:", ["Stop activity and activate clinical protocol", "Push to finish stairs", "Ignore if the patient is motivated", "Add ankle weights"], 0, "Chest pressure with diaphoresis during activity is urgent and requires stopping and escalation.")],
    postTest: [quiz("Which measure helps track exercise tolerance?", ["SpO2, heart rate, blood pressure, symptoms, and RPE", "Only shoe brand", "Only room number", "No reassessment"], 0, "Exercise tolerance is monitored with vitals, symptoms, perceived exertion, and recovery.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "physiotherapy-documentation-scope-and-plan-of-care-communication",
    title: "Documentation, Scope, and Plan-of-Care Communication",
    topic: "Rehab Documentation and Scope",
    topicSlug: "rehab-documentation-scope",
    system: "rehabilitation",
    bodySystem: "documentation-scope",
    previewSectionCount: 2,
    seoTitle: "PTA Documentation Scope and Plan of Care Communication",
    seoDescription: "PTA and physiotherapy lesson on objective documentation, plan of care, delegation, progression limits, supervising therapist communication, confidentiality, and reassessment triggers.",
    alliedProfessionKey: "pta",
    sections: physiotherapySections.documentationScope,
    studyTakeaways: ["Document observable facts, not judgments.", "Follow the plan of care and delegated parameters.", "Communicate meaningful change."],
    studyCommonTraps: ["Subjective blame language", "Changing the plan independently", "Failing to report unexpected decline"],
    preTest: [quiz("Which documentation is most objective?", ["Ambulated 40 ft with rolling walker and contact guard; reported fatigue 6/10", "Patient was lazy", "Did okay", "Bad attitude"], 0, "Objective documentation describes observable performance, assistance, device, symptoms, and response.")],
    postTest: [quiz("A PTA should involve the supervising therapist when:", ["Unexpected deterioration or plan-of-care concern occurs", "Everything is routine", "Only room temperature changes", "The note is already signed"], 0, "Unexpected deterioration or plan concerns require communication with the therapist.")]
  }
];

export default { lessons: physiotherapyRehabLessons };
