import type { LessonContent } from "./types";

export const therapeuticCommunicationLessons: Record<string, LessonContent> = {
  "therapeutic-comm-rpn": {
    title: "Therapeutic Communication",
    cellular: {
      title: "Foundations of Therapeutic Communication",
      content: "Therapeutic communication is a purposeful, goal-directed form of interaction used by nurses to establish a helping relationship with patients. It involves active listening, open-ended questioning, clarification, reflection, validation, and summarizing to facilitate understanding and trust. Nonverbal communication, including eye contact, body language, tone of voice, and respect for personal space, accounts for a significant portion of the message conveyed during nurse-patient interactions. The therapeutic relationship progresses through three distinct phases: orientation (establishing trust and defining roles), working (implementing interventions and achieving goals), and termination (evaluating outcomes and preparing for discharge)."
    },
    riskFactors: [
      "Lack of self-awareness in personal communication patterns",
      "Failure to recognize and maintain professional boundaries",
      "Cultural insensitivity or assumptions about patient values",
      "Using closed-ended or leading questions that limit patient expression",
      "Personal stress or burnout impairing active listening ability",
      "Over-identification with the patient leading to boundary erosion"
    ],
    diagnostics: [
      "Assess patient communication preferences: preferred language, hearing or vision impairments, cognitive ability, emotional readiness to receive information",
      "Evaluate the effectiveness of nurse-patient communication using the teach-back method: ask the patient to explain the information in their own words",
      "Identify non-therapeutic communication patterns: giving false reassurance, using cliches, changing the subject, offering personal opinions, or asking 'why' questions that create defensiveness",
      "Assess for barriers to therapeutic communication: pain, anxiety, sedation, sensory deficits, language differences, or cognitive impairment",
      "Evaluate the phase of the therapeutic relationship (orientation, working, termination) to determine appropriate communication strategies",
      "Screen for signs of boundary violations: excessive self-disclosure, gift-giving or receiving, social media contact with patients, or preferential treatment",
    ],
    management: [
      "Use open-ended questions to encourage patient expression",
      "Practice active listening by maintaining appropriate eye contact and avoiding interruptions",
      "Apply reflection and paraphrasing to confirm understanding",
      "Maintain professional boundaries by avoiding personal disclosure and gift acceptance",
      "Use silence therapeutically to allow the patient time to process thoughts",
      "Employ de-escalation techniques when patients display anger or agitation",
      "Recognize manipulative behavior patterns and respond with firm, consistent boundaries"
    ],
    nursingActions: [
      "Establish rapport during the orientation phase by introducing yourself and explaining your role",
      "Validate patient feelings without offering false reassurance",
      "Avoid asking 'why' questions as they can sound judgmental and cause defensiveness",
      "Document therapeutic interactions objectively in the patient record",
      "Recognize when to involve other team members for challenging communication situations",
      "Maintain confidentiality while following mandatory reporting obligations"
    ],
    signs: {
      left: [
        "Effective therapeutic communication indicators",
        "Patient willingly shares concerns and feelings",
        "Patient demonstrates trust through open body language",
        "Patient actively participates in care planning",
        "Patient asks clarifying questions about treatment"
      ],
      right: [
        "Barriers to therapeutic communication",
        "Patient withdraws or becomes guarded",
        "Patient displays increasing agitation or anger",
        "Patient gives only minimal or one-word responses",
        "Patient avoids eye contact and turns away from nurse"
      ]
    },
    medications: [
      {
        name: "Lorazepam",
        type: "Benzodiazepine (Anxiolytic)",
        action: "Enhances the effect of GABA at GABA-A receptors, producing anxiolytic, sedative, and muscle relaxant effects to reduce acute anxiety that may impair therapeutic communication",
        sideEffects: "Sedation, respiratory depression, dizziness, hypotension, paradoxical agitation in some patients",
        contra: "Severe respiratory depression, acute narrow-angle glaucoma, known hypersensitivity to benzodiazepines",
        pearl: "May be used PRN for acute anxiety that prevents meaningful nurse-patient interaction; monitor sedation level closely as oversedation can also impair communication"
      }
    ],
    pearls: [
      "The most therapeutic response on the licensing exam is typically the one that acknowledges the patient's feelings and encourages further expression",
      "Avoid false reassurance such as 'everything will be fine' as it dismisses the patient's concerns and damages trust",
      "Never ask 'why' questions; instead rephrase using 'what' or 'tell me more about' to reduce defensiveness",
      "Silence is a powerful therapeutic tool that allows the patient to gather thoughts and process emotions",
      "Empathy involves understanding and sharing the patient's feelings; sympathy involves feeling sorry for the patient and is not therapeutic",
      "Professional boundaries require avoiding social media connections with current patients, declining personal gifts, and refraining from self-disclosure that shifts focus away from the patient"
    ],
    quiz: [
      {
        question: "A patient states, 'I don't think anyone cares about what happens to me.' Which response by the nurse is most therapeutic?",
        options: [
          "Don't say that, of course people care about you.",
          "Why do you feel that way?",
          "It sounds like you're feeling alone right now. Tell me more about what you're experiencing.",
          "You should talk to your family about how you feel."
        ],
        correct: 2,
        rationale: "Reflecting the patient's feelings and inviting further expression is the most therapeutic response. Option A offers false reassurance, option B uses a 'why' question that may cause defensiveness, and option D gives advice rather than exploring the patient's feelings."
      },
      {
        question: "During the orientation phase of the therapeutic relationship, which nursing action is the priority?",
        options: [
          "Implementing the care plan and evaluating patient progress",
          "Establishing trust and defining the roles and expectations of the relationship",
          "Preparing the patient for discharge and terminating the relationship",
          "Encouraging the patient to share deeply personal information immediately"
        ],
        correct: 1,
        rationale: "The orientation phase focuses on establishing trust, building rapport, defining roles, and setting expectations for the therapeutic relationship. Implementation occurs during the working phase, and discharge preparation occurs during the termination phase."
      },
      {
        question: "A patient offers the nurse a gift at discharge. Which action is most appropriate?",
        options: [
          "Accept the gift graciously to avoid hurting the patient's feelings",
          "Accept the gift but report it to the charge nurse afterward",
          "Thank the patient for the thoughtfulness and explain that professional guidelines prevent acceptance of personal gifts",
          "Ignore the offer and change the subject"
        ],
        correct: 2,
        rationale: "Professional boundaries require declining gifts while acknowledging the patient's intention. Accepting gifts blurs professional boundaries, and ignoring the offer is dismissive and non-therapeutic."
      }
    ]
  },

  "therapeutic-comm-rn": {
    title: "Therapeutic Communication",
    cellular: {
      title: "Advanced Therapeutic Communication Techniques",
      content: "Advanced therapeutic communication builds on foundational skills by incorporating motivational interviewing, crisis intervention communication, and trauma-informed approaches. Motivational interviewing uses open-ended questions, affirmations, reflective listening, and summarizing (OARS) to explore ambivalence and support behavior change. Transference occurs when a patient projects feelings from past relationships onto the nurse, while countertransference occurs when the nurse unconsciously redirects feelings toward the patient. Recognizing these dynamics is essential for maintaining objectivity and therapeutic effectiveness. Interprofessional communication frameworks such as SBAR (Situation, Background, Assessment, Recommendation) standardize handoff communication and reduce the risk of errors during care transitions."
    },
    riskFactors: [
      "Unrecognized countertransference affecting clinical judgment",
      "Boundary crossing escalating into boundary violations",
      "Implicit bias influencing communication with diverse populations",
      "Failure to use qualified interpreters for patients with language barriers",
      "Inadequate de-escalation skills leading to patient or staff harm",
      "Using family members as interpreters which compromises accuracy and confidentiality"
    ],
    diagnostics: [
      "Assessment of patient communication capacity using validated cognitive screening tools",
      "Evaluation of suicide risk using structured screening instruments such as the Columbia Suicide Severity Rating Scale",
      "Assessment of substance use patterns using standardized tools like CAGE or AUDIT",
      "Mental status examination to evaluate thought processes and communication ability"
    ],
    management: [
      "Apply motivational interviewing techniques using the OARS framework for behavior change discussions",
      "Use SBAR format for all interprofessional handoff communications",
      "Implement trauma-informed communication by creating safe environments and avoiding retraumatization",
      "Address transference by recognizing the dynamic and redirecting the therapeutic focus",
      "Use qualified medical interpreters rather than family members for language barriers",
      "Apply de-escalation techniques: calm tone, non-threatening posture, offer choices, maintain safe distance",
      "Recognize implicit bias through self-reflection and continuing education"
    ],
    nursingActions: [
      "Conduct suicide risk assessments using direct, nonjudgmental language",
      "Use cultural humility by asking patients about their preferences and health beliefs",
      "Document all critical conversations objectively including patient responses",
      "Advocate for patients by escalating concerns through the chain of command when necessary",
      "Manage conflict with colleagues using I-statements and focusing on patient outcomes",
      "Use therapeutic silence appropriately during grief, processing, or emotional disclosure"
    ],
    signs: {
      left: [
        "Indicators of effective advanced communication",
        "Patient engages in shared decision-making willingly",
        "Patient expresses ambivalence and explores options for change",
        "Interprofessional team communicates consistently using SBAR",
        "Patient from diverse background reports feeling respected and heard"
      ],
      right: [
        "Indicators of communication breakdown",
        "Patient becomes dependent on the nurse for emotional support beyond professional scope",
        "Nurse feels personally responsible for patient outcomes beyond clinical role",
        "Repeated miscommunication during handoffs leading to near-miss events",
        "Patient refuses interpreter services but demonstrates limited comprehension"
      ]
    },
    medications: [
      {
        name: "Haloperidol",
        type: "First-generation antipsychotic",
        action: "Blocks dopamine D2 receptors in the mesolimbic pathway, reducing acute agitation, psychotic symptoms, and aggressive behavior that impairs safe communication",
        sideEffects: "Extrapyramidal symptoms (dystonia, akathisia, tardive dyskinesia), QT prolongation, neuroleptic malignant syndrome, sedation",
        contra: "Severe CNS depression, Parkinson disease, known QT prolongation, comatose states",
        pearl: "Often used IM for acute agitation when verbal de-escalation has failed; always attempt verbal intervention before pharmacological management and monitor for extrapyramidal symptoms"
      }
    ],
    pearls: [
      "On the licensing exam, the most therapeutic response explores the patient's feelings rather than providing information, giving advice, or offering reassurance",
      "Boundary crossing is a brief, often unintentional departure from expected behavior that may be therapeutic in context; boundary violation is harmful and exploitative",
      "When assessing suicide risk, ask directly: 'Are you thinking about hurting yourself or ending your life?' Direct questioning does not increase suicidal ideation",
      "SBAR reduces communication errors by 30% or more when used consistently during handoffs and escalation of concerns",
      "Cultural humility is an ongoing process of self-reflection and learning, unlike cultural competence which implies a fixed endpoint",
      "Therapeutic use of silence allows the patient time to process and does not require the nurse to fill every pause in conversation"
    ],
    quiz: [
      {
        question: "A patient who recently lost a spouse begins crying during assessment. Which RN response is most therapeutic?",
        options: [
          "I know exactly how you feel because I lost my parent last year.",
          "Try not to cry. You need to stay strong for your family.",
          "I can see this is very painful for you. I am here with you. Take the time you need.",
          "Would you like me to call the chaplain to come talk with you?"
        ],
        correct: 2,
        rationale: "Acknowledging the patient's pain and offering presence with therapeutic silence is the most therapeutic response. Self-disclosure shifts focus to the nurse, telling the patient not to cry invalidates their emotions, and immediately offering to call someone else avoids the therapeutic interaction."
      },
      {
        question: "An RN notices they feel anxious and overly protective when caring for a specific patient who reminds them of their own child. This is an example of which phenomenon?",
        options: [
          "Transference",
          "Countertransference",
          "Boundary violation",
          "Compassion fatigue"
        ],
        correct: 1,
        rationale: "Countertransference occurs when the nurse unconsciously redirects personal feelings toward a patient based on past relationships or associations. Transference is when the patient projects feelings onto the nurse. This is not yet a boundary violation but could lead to one if not addressed through self-awareness and supervision."
      },
      {
        question: "When using the SBAR communication tool, which component includes the nurse's clinical judgment about what is occurring?",
        options: [
          "Situation",
          "Background",
          "Assessment",
          "Recommendation"
        ],
        correct: 2,
        rationale: "The Assessment component of SBAR includes the nurse's clinical judgment and interpretation of the situation. Situation describes what is happening now, Background provides relevant history, and Recommendation states what the nurse believes should be done."
      }
    ]
  },

  "therapeutic-comm-np": {
    title: "Therapeutic Communication",
    cellular: {
      title: "Relational and Clinical Communication",
      content: "Nurse practitioners operate at an advanced practice level requiring communication skills that integrate clinical authority with therapeutic empathy. Shared decision-making involves presenting evidence-based options, discussing risks and benefits in language the patient can understand, and collaboratively selecting a plan that aligns with the patient's values and preferences. Motivational interviewing at the advanced practice level focuses on sustained behavior change for chronic disease management, substance use reduction, and treatment adherence using the stages of change model (precontemplation, contemplation, preparation, action, maintenance). Breaking bad news frameworks such as SPIKES (Setting, Perception, Invitation, Knowledge, Emotions, Strategy/Summary) provide structured approaches for delivering difficult diagnoses or prognosis information while maintaining therapeutic rapport."
    },
    riskFactors: [
      "Power differential between NP and patient undermining true shared decision-making",
      "Dual relationships in rural or small community practice settings",
      "Provider burnout leading to reduced empathy and communication quality",
      "Health literacy mismatches resulting in patients agreeing without true understanding",
      "Implicit bias affecting clinical recommendations for marginalized populations",
      "Documentation that includes subjective or judgmental language creating legal risk"
    ],
    diagnostics: [
      "Health literacy assessment using validated tools such as REALM or TOFHLA",
      "Decision-making capacity assessment evaluating understanding, appreciation, reasoning, and ability to express a choice",
      "Readiness for change assessment using the stages of change model",
      "Cultural assessment to identify health beliefs, practices, and communication preferences"
    ],
    management: [
      "Apply the SPIKES framework when breaking bad news to patients and families",
      "Use teach-back method to verify patient comprehension of risk-benefit discussions",
      "Implement motivational interviewing across all stages of change for chronic disease management",
      "Conduct informed consent conversations ensuring patient demonstrates understanding, not just agreement",
      "Address treatment non-adherence by exploring barriers rather than making assumptions",
      "Navigate family disagreements by facilitating structured family meetings with clear objectives",
      "Document all difficult conversations using objective, factual language without personal opinions"
    ],
    nursingActions: [
      "Assess decision-making capacity before obtaining informed consent for complex procedures",
      "Adapt communication strategies for patients with low health literacy using plain language and visual aids",
      "Address historical mistrust in healthcare by acknowledging systemic harms and building trust through transparency",
      "Apply trauma-informed principles by asking 'What happened to you?' rather than 'What is wrong with you?'",
      "Manage refusal of treatment by documenting the informed refusal process including risks explained",
      "Maintain professional distance in long-term care relationships while preserving therapeutic warmth"
    ],
    signs: {
      left: [
        "Indicators of effective advanced communication",
        "Patient demonstrates understanding of treatment options through teach-back",
        "Patient actively participates in goal-setting for chronic disease management",
        "Patient expresses readiness to make behavioral changes",
        "Family members and patient reach consensus on goals of care"
      ],
      right: [
        "Indicators of communication challenges requiring intervention",
        "Patient agrees to plan but cannot explain it in own words",
        "Patient repeatedly misses appointments or stops medications without discussion",
        "Family members override patient preferences in care decisions",
        "Patient expresses distrust based on prior negative healthcare experiences"
      ]
    },
    medications: [
      {
        name: "Naltrexone",
        type: "Opioid antagonist / Alcohol use disorder treatment",
        action: "Blocks opioid receptors reducing the reinforcing effects of alcohol and opioids, supporting behavior change conversations and treatment adherence in substance use disorders",
        sideEffects: "Nausea, headache, dizziness, hepatotoxicity at high doses, injection site reactions (IM formulation), precipitated withdrawal if opioids are present",
        contra: "Current opioid use or positive urine drug screen for opioids, acute hepatitis or liver failure, known hypersensitivity",
        pearl: "Prescribing naltrexone requires concurrent motivational interviewing to support sustained behavior change; ensure patient has been opioid-free for 7 to 10 days before initiating to prevent precipitated withdrawal"
      }
    ],
    pearls: [
      "Shared decision-making is not the same as informed consent; shared decision-making is an ongoing collaborative process while informed consent is a specific legal requirement before procedures",
      "The SPIKES framework structures difficult conversations: Setting up, assessing Perception, obtaining Invitation, delivering Knowledge, addressing Emotions, and providing Strategy or Summary",
      "Capacity is decision-specific and time-specific; a patient may have capacity for some decisions but not others, and capacity can fluctuate",
      "Document refusal of treatment by recording the specific risks explained, the patient's stated understanding, and that the patient was informed they could change their mind at any time",
      "In Indigenous health contexts, recognize the impact of historical trauma on healthcare engagement and prioritize relationship-building before clinical interventions",
      "Avoid subjective language in documentation such as 'patient is noncompliant' and instead use objective language such as 'patient reports not taking prescribed medication for the past two weeks'"
    ],
    quiz: [
      {
        question: "An NP is preparing to inform a patient of a new cancer diagnosis. Using the SPIKES framework, what should the clinician do first?",
        options: [
          "Deliver the diagnosis clearly and directly without delay",
          "Assess the patient's emotional readiness and understanding of why they are here",
          "Set up the environment by ensuring privacy, sitting down, and minimizing interruptions",
          "Provide a detailed treatment plan and prognosis immediately"
        ],
        correct: 2,
        rationale: "The first step in SPIKES is Setting up the environment by ensuring privacy, arranging seating, and minimizing interruptions. Assessing perception (step 2) comes next, followed by invitation, knowledge delivery, emotion management, and strategy/summary."
      },
      {
        question: "A patient with diabetes consistently misses follow-up appointments and reports not taking metformin. Which NP approach best demonstrates motivational interviewing?",
        options: [
          "If you don't take your medication, you will develop serious complications.",
          "You need to be more responsible about managing your diabetes.",
          "Help me understand what makes it difficult for you to take your medication and keep your appointments.",
          "I am going to refer you to a diabetes educator since you are not following the plan."
        ],
        correct: 2,
        rationale: "Motivational interviewing uses open-ended, nonjudgmental questions to explore the patient's barriers and ambivalence toward behavior change. Threatening consequences, assigning blame, or immediately referring away avoids the therapeutic conversation needed to promote self-efficacy and change."
      },
      {
        question: "An NP practicing in a rural community discovers that a new patient is also a neighbor and parent at the same school as the NP's children. Which action is most appropriate?",
        options: [
          "Refuse to treat the patient and refer them to a provider in another town",
          "Treat the patient but avoid discussing the dual relationship",
          "Acknowledge the dual relationship openly, discuss boundaries, and document the plan to manage the professional-personal overlap",
          "Treat the patient exactly as any other without addressing the relationship"
        ],
        correct: 2,
        rationale: "In rural and small community settings, dual relationships are sometimes unavoidable. The clinician should acknowledge the overlap, establish clear boundaries with the patient, and document the management plan. Refusing care may create an access barrier, and ignoring the dual relationship risks boundary violations."
      }
    ]
  }
};
