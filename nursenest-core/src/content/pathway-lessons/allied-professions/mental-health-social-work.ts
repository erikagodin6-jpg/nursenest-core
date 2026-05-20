function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const mentalHealthSections = {
  therapeuticCommunication: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Therapeutic communication is the foundation of mental-health, addictions, and social-work practice. Professionals must balance empathy, boundaries, validation, assessment, safety, culture, trauma awareness, and goal-directed intervention."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Therapeutic communication uses active listening, reflection, clarification, open-ended questions, emotional validation, motivational interviewing principles, and nonjudgmental language. Unsafe approaches include arguing with delusions, shaming substance use, excessive reassurance, interrogating, giving false promises, or disclosing inappropriate personal details. Boundaries protect both client and clinician."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A client says, 'Nobody would care if I disappeared.' The safest response is not to quickly reassure or change the subject. The clinician should explore meaning, assess suicide risk according to role and setting, validate emotion, and escalate appropriately if risk is identified."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Mental-health exams heavily test communication choices. The safest answer is usually calm, validating, exploratory, and safety-focused rather than confrontational or falsely reassuring."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Therapeutic communication balances empathy, assessment, boundaries, and safety."
    }
  ],
  suicideRisk: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Suicide-risk assessment and safety planning are high-stakes responsibilities across mental-health, addictions, emergency, community, and social-work settings."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Risk assessment considers ideation, intent, plan, means, history of attempts, hopelessness, impulsivity, substance use, psychosis, social isolation, trauma, protective factors, supports, and acute stressors. Asking directly about suicide does not cause suicide. Immediate safety concerns require escalation according to role, law, and organizational policy. Safety planning includes coping strategies, support contacts, environmental safety, and crisis resources."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A client reports a specific suicide plan, access to means, and intent to act tonight. The clinician should not promise secrecy or schedule a routine follow-up next week. Immediate escalation and safety intervention are required according to protocol and jurisdiction."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Exam questions commonly test direct suicide questioning, warning signs, involuntary intervention thresholds, confidentiality limits, documentation, and prioritization of imminent risk."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Directly assess risk, identify protective factors, escalate imminent danger, and develop safety supports."
    }
  ],
  addictionsRecovery: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Addictions care combines harm reduction, recovery support, withdrawal recognition, relapse prevention, motivational interviewing, and trauma-informed practice."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Substance-use disorders are chronic biopsychosocial conditions, not moral failures. Clinicians assess stage of change, withdrawal risk, overdose risk, supports, housing, trauma history, co-occurring mental illness, and readiness for treatment. Harm reduction may include naloxone education, safer-use strategies, needle programs, or medication-assisted treatment support depending on role and setting. Withdrawal from alcohol or benzodiazepines may become medically dangerous and requires escalation."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A client says, 'I know drinking is ruining my life, but I don't think I can stop.' A therapeutic response would explore ambivalence and goals using motivational interviewing rather than shaming or demanding immediate abstinence."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Addictions questions test motivational interviewing, relapse prevention, overdose response, withdrawal risk, harm reduction, stigma reduction, and co-occurring mental-health conditions."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Addictions care is collaborative, nonjudgmental, safety-focused, and recovery-oriented."
    }
  ],
  traumaInformedCare: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Trauma-informed care recognizes that many behaviors, coping strategies, and emotional reactions are connected to past adversity, violence, discrimination, or unsafe experiences."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Trauma-informed practice emphasizes safety, choice, collaboration, empowerment, trustworthiness, and cultural humility. Clinicians avoid re-traumatization through respectful communication, predictable processes, consent, transparency, and emotional regulation support. Trauma-informed care does not require detailed trauma disclosure to provide respectful treatment."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A client becomes distressed when staff stand too close and raise their voice. A trauma-informed response would lower stimulation, offer choices, maintain calm tone, and preserve safety rather than escalating confrontation."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Trauma-informed exam items test de-escalation, emotional safety, consent, cultural humility, and avoiding coercive or judgmental interactions when possible."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Prioritize emotional safety, collaboration, empowerment, and nonjudgmental care."
    }
  ],
  crisisDeescalation: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Crisis intervention and de-escalation are essential in mental-health, addictions, outreach, shelters, hospitals, schools, and community programs."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "De-escalation uses calm tone, nonthreatening posture, emotional validation, active listening, clear limits, environmental safety, reduced stimulation, and collaborative problem-solving. Escalation risks increase with arguing, crowding, rapid commands, threats, humiliation, or power struggles. Safety planning includes awareness of exits, team support, and emergency activation when needed."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "An agitated client is pacing, shouting, and clenching fists. The safest response is not to stand over the client and argue. Staff should maintain safety distance, speak calmly, reduce stimulation, and prepare escalation supports according to protocol."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "De-escalation questions test communication, personal safety, violence-risk awareness, environmental control, and when emergency intervention becomes necessary."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Use calm communication, preserve safety, reduce stimulation, and avoid power struggles."
    }
  ],
  ethicsSystemsAdvocacy: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Mental-health and social-work professionals navigate ethics, confidentiality, mandated reporting, consent, advocacy, equity, housing instability, poverty, discrimination, and system barriers."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Ethical care includes confidentiality, informed consent, documentation, professional boundaries, cultural safety, anti-oppressive practice, and advocacy. Confidentiality has limits when there is risk of serious harm, abuse, or legal obligation. Social determinants of health such as housing, food security, transportation, and discrimination strongly affect outcomes and should be incorporated into care planning and resource navigation."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A youth discloses ongoing abuse and asks the worker not to tell anyone. The clinician should respond honestly about mandatory-reporting obligations while maintaining support and explaining the process compassionately."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Ethics questions test confidentiality limits, documentation, reporting duties, equity, anti-stigma practice, advocacy, and balancing autonomy with safety."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Protect confidentiality when possible, report when legally required, and advocate for safe equitable care."
    }
  ]
};

export const mentalHealthSocialWorkLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "mental-health-therapeutic-communication-and-boundaries",
    title: "Therapeutic Communication and Professional Boundaries",
    topic: "Mental Health Communication",
    topicSlug: "mental-health-communication",
    system: "mental-health",
    bodySystem: "therapeutic-communication",
    previewSectionCount: 2,
    seoTitle: "Mental Health Therapeutic Communication and Professional Boundaries",
    seoDescription: "Mental-health and social-work lesson on active listening, validation, motivational interviewing, boundaries, empathy, and therapeutic responses.",
    alliedProfessionKey: "mental-health-addictions",
    sections: mentalHealthSections.therapeuticCommunication,
    studyTakeaways: ["Validation is not agreement.", "Boundaries protect clients and clinicians.", "Therapeutic responses are exploratory and safety-aware."],
    studyCommonTraps: ["False reassurance", "Arguing with delusions", "Shaming substance use"],
    preTest: [quiz("A client says nobody would care if they disappeared. Best first response?", ["Explore feelings and assess safety", "Promise everything will be fine", "Change the subject", "Ignore the statement"], 0, "Statements suggesting hopelessness require exploration and safety assessment.")],
    postTest: [quiz("Therapeutic communication should generally be:", ["Empathic, exploratory, and nonjudgmental", "Confrontational and dismissive", "Argumentative", "Focused on quick reassurance only"], 0, "Therapeutic communication supports safety, trust, and assessment.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "mental-health-suicide-risk-assessment-and-safety-planning",
    title: "Suicide Risk Assessment and Safety Planning",
    topic: "Suicide Risk",
    topicSlug: "suicide-risk-assessment",
    system: "mental-health",
    bodySystem: "suicide-risk",
    previewSectionCount: 2,
    seoTitle: "Suicide Risk Assessment and Safety Planning",
    seoDescription: "Mental-health lesson on suicide ideation, intent, means, protective factors, safety planning, escalation, documentation, and crisis response.",
    alliedProfessionKey: "social-work",
    sections: mentalHealthSections.suicideRisk,
    studyTakeaways: ["Ask directly about suicide.", "Imminent risk requires escalation.", "Safety planning includes coping supports and crisis resources."],
    studyCommonTraps: ["Avoiding direct questions", "Promising secrecy", "Delaying imminent-risk intervention"],
    preTest: [quiz("A client reports intent and a suicide plan for tonight. What is safest?", ["Routine follow-up next week", "Immediate escalation and safety intervention", "Promise secrecy", "Ignore because talking about suicide is common"], 1, "Imminent risk requires immediate intervention and escalation.")],
    postTest: [quiz("Protective factors may include:", ["Supports, hope, coping, and connection", "Only isolation", "No future plans", "Access to lethal means"], 0, "Protective factors reduce risk and support safety planning.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "addictions-harm-reduction-withdrawal-and-recovery-support",
    title: "Addictions: Harm Reduction, Withdrawal, and Recovery Support",
    topic: "Addictions Care",
    topicSlug: "addictions-care",
    system: "mental-health",
    bodySystem: "addictions",
    previewSectionCount: 2,
    seoTitle: "Addictions Harm Reduction Withdrawal and Recovery Support",
    seoDescription: "Addictions lesson on motivational interviewing, overdose prevention, withdrawal, recovery support, naloxone, relapse prevention, and trauma-informed care.",
    alliedProfessionKey: "mental-health-addictions",
    sections: mentalHealthSections.addictionsRecovery,
    studyTakeaways: ["Addictions are biopsychosocial conditions.", "Harm reduction improves safety.", "Motivational interviewing explores ambivalence."],
    studyCommonTraps: ["Shaming relapse", "Ignoring withdrawal risk", "Demanding immediate change without collaboration"],
    preTest: [quiz("Motivational interviewing is most focused on:", ["Exploring ambivalence and supporting change", "Punishing relapse", "Arguing aggressively", "Ignoring patient goals"], 0, "Motivational interviewing is collaborative and explores readiness for change.")],
    postTest: [quiz("Alcohol withdrawal can become:", ["Medically dangerous and require escalation", "Always harmless", "Only a behavioral issue", "Impossible after long-term use"], 0, "Alcohol withdrawal may become medically dangerous and requires monitoring/escalation.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "trauma-informed-care-deescalation-and-emotional-safety",
    title: "Trauma-Informed Care, De-escalation, and Emotional Safety",
    topic: "Trauma-Informed Practice",
    topicSlug: "trauma-informed-care",
    system: "mental-health",
    bodySystem: "trauma-informed-care",
    previewSectionCount: 2,
    seoTitle: "Trauma Informed Care De-escalation and Emotional Safety",
    seoDescription: "Mental-health and social-work lesson on trauma-informed care, de-escalation, emotional safety, collaboration, empowerment, crisis response, and cultural humility.",
    alliedProfessionKey: "social-work",
    sections: mentalHealthSections.traumaInformedCare,
    studyTakeaways: ["Safety and collaboration reduce retraumatization.", "Calm communication supports regulation.", "Trauma-informed care does not require trauma disclosure."],
    studyCommonTraps: ["Escalating confrontation", "Crowding distressed clients", "Using coercive communication unnecessarily"],
    preTest: [quiz("A trauma-informed approach emphasizes:", ["Safety, choice, and collaboration", "Power struggles", "Humiliation", "Forced disclosure"], 0, "Trauma-informed care prioritizes emotional safety and empowerment.")],
    postTest: [quiz("During de-escalation, staff should generally:", ["Maintain calm tone and reduce stimulation", "Argue loudly", "Crowd the client", "Threaten immediately"], 0, "Calm communication and environmental control support de-escalation.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "mental-health-crisis-intervention-violence-risk-and-deescalation",
    title: "Crisis Intervention, Violence Risk, and De-escalation",
    topic: "Mental Health Crisis Intervention",
    topicSlug: "mental-health-crisis-intervention",
    system: "mental-health",
    bodySystem: "crisis-intervention",
    previewSectionCount: 2,
    seoTitle: "Mental Health Crisis Intervention Violence Risk and De-escalation",
    seoDescription: "Mental-health lesson on agitation, violence risk, de-escalation, environmental safety, emergency response, boundaries, and crisis communication.",
    alliedProfessionKey: "mental-health-addictions",
    sections: mentalHealthSections.crisisDeescalation,
    studyTakeaways: ["Reduce stimulation and preserve safety.", "Avoid power struggles.", "Prepare escalation supports when risk increases."],
    studyCommonTraps: ["Arguing with agitated clients", "Standing too close", "Ignoring personal safety"],
    preTest: [quiz("A pacing agitated client clenching fists should be approached with:", ["Calm tone, space, and de-escalation", "Aggressive confrontation", "Mocking language", "Crowding"], 0, "Safety-focused de-escalation reduces escalation risk.")],
    postTest: [quiz("Which behavior increases escalation risk?", ["Threats and humiliation", "Calm listening", "Reduced stimulation", "Validation"], 0, "Threats and humiliation commonly worsen agitation.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "social-work-ethics-confidentiality-advocacy-and-social-determinants",
    title: "Social Work Ethics, Confidentiality, Advocacy, and Social Determinants",
    topic: "Social Work Ethics",
    topicSlug: "social-work-ethics",
    system: "social-work",
    bodySystem: "ethics-advocacy",
    previewSectionCount: 2,
    seoTitle: "Social Work Ethics Confidentiality Advocacy and Social Determinants",
    seoDescription: "Social-work lesson on confidentiality, mandatory reporting, anti-oppressive practice, advocacy, housing, poverty, equity, cultural safety, and documentation.",
    alliedProfessionKey: "social-work",
    sections: mentalHealthSections.ethicsSystemsAdvocacy,
    studyTakeaways: ["Confidentiality has legal limits.", "Advocacy includes social determinants of health.", "Anti-oppressive practice improves equitable care."],
    studyCommonTraps: ["Promising absolute secrecy", "Ignoring housing insecurity", "Failing to report abuse when required"],
    preTest: [quiz("A youth discloses abuse and asks the worker not to tell anyone. Best response?", ["Explain reporting obligations compassionately", "Promise secrecy", "Ignore the disclosure", "Postpone action indefinitely"], 0, "Mandatory reporting obligations should be explained honestly and compassionately.")],
    postTest: [quiz("Social determinants of health include:", ["Housing, food access, transportation, and discrimination", "Only lab values", "Only exercise preferences", "Only genetics"], 0, "Social determinants strongly affect health and access to care.")]
  }
];

export default { lessons: mentalHealthSocialWorkLessons };
