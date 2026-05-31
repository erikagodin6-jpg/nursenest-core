import { absoluteUrl } from "@/lib/seo/site-origin";

export type AlliedAuthorityProfessionKey =
  | "respiratory-therapy"
  | "paramedicine"
  | "occupational-therapy"
  | "physiotherapy"
  | "medical-laboratory-technology"
  | "psw";

export type AlliedKeywordClusterName =
  | "educational"
  | "career"
  | "placement"
  | "study"
  | "interview"
  | "clinicalSkills"
  | "exam"
  | "salary"
  | "certification";

export type AlliedAuthorityLink = {
  label: string;
  href: string;
};

export type AlliedSkillPage = {
  slug: string;
  title: string;
  deck: string;
  learningObjectives: string[];
  clinicalContext: string[];
  coreSteps: string[];
  commonMistakes: string[];
  practiceActivities: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: AlliedAuthorityLink[];
};

export type AlliedAuthorityProfile = {
  key: AlliedAuthorityProfessionKey;
  routeSlug: string;
  label: string;
  shortLabel: string;
  roleDescription: string;
  careerTitle: string;
  careerDeck: string;
  keywordClusters: Record<AlliedKeywordClusterName, string[]>;
  careerSections: Array<{ title: string; body: string[] }>;
  placementSections: Array<{ title: string; body: string[] }>;
  studyGuides: Array<{ title: string; description: string; resources: string[] }>;
  clinicalSkills: AlliedSkillPage[];
};

const CLUSTER_NAMES: AlliedKeywordClusterName[] = [
  "educational",
  "career",
  "placement",
  "study",
  "interview",
  "clinicalSkills",
  "exam",
  "salary",
  "certification",
];

function internalLinks(routeSlug: string): AlliedAuthorityLink[] {
  return [
    { label: "Allied Health Hub", href: "/allied-health" },
    { label: "Profession Overview", href: `/allied-health/${routeSlug}` },
    { label: "Placement Guide", href: `/allied-health/${routeSlug}/placement-guide` },
    { label: "Study Guide", href: `/allied-health/${routeSlug}/study-guide` },
    { label: "Interview Questions", href: `/allied-health/${routeSlug}/interview-questions` },
  ];
}

function skill(
  routeSlug: string,
  slug: string,
  title: string,
  deck: string,
  context: string[],
  steps: string[],
): AlliedSkillPage {
  return {
    slug,
    title,
    deck,
    learningObjectives: [
      `Explain when ${title.toLowerCase()} is clinically useful.`,
      "Identify priority safety checks before acting.",
      "Connect findings to escalation, documentation, and patient education.",
    ],
    clinicalContext: context,
    coreSteps: steps,
    commonMistakes: [
      "Treating the skill as a checklist without interpreting what the findings mean.",
      "Documenting task completion without recording the assessment data that changed clinical judgment.",
      "Delaying escalation when findings suggest deterioration or immediate safety risk.",
    ],
    practiceActivities: [
      `Complete a short ${title} case and identify the most important cue.`,
      "Write an SBAR update using the abnormal finding.",
      "Answer practice questions that test priority action and safety.",
    ],
    faqs: [
      {
        question: `What should learners focus on when studying ${title}?`,
        answer:
          "Focus on indications, safety checks, abnormal findings, communication, documentation, and how the result changes the next clinical decision.",
      },
      {
        question: `How does ${title} appear in clinical placement?`,
        answer:
          "Placement questions usually ask learners to explain what they are doing, why it matters, what would be unsafe, and when they would report findings to the supervising clinician.",
      },
    ],
    related: internalLinks(routeSlug),
  };
}

function sharedCareerSections(profession: string, setting: string, regulatorNote: string): AlliedAuthorityProfile["careerSections"] {
  return [
    {
      title: `What ${profession}s Do`,
      body: [
        `${profession}s support patient care through assessment, technical skill, communication, documentation, and profession-specific clinical judgment.`,
        `In Canada, daily work varies by province, employer, scope, and care setting. Learners should verify current regulatory requirements, admission requirements, and local employment expectations before making academic or career decisions.`,
      ],
    },
    {
      title: "Education Pathway",
      body: [
        `Most learners begin by comparing accredited programs, admission prerequisites, placement expectations, immunization and safety requirements, and graduate outcomes.`,
        "A strong preparation plan includes anatomy and physiology, communication, documentation, patient safety, clinical reasoning, and repeated practice with profession-specific scenarios.",
      ],
    },
    {
      title: "Licensing, Certification, And Registration",
      body: [
        regulatorNote,
        "Because requirements can change, NurseNest career pages are designed as educational planning guides and should be paired with current regulator, college, association, and school information.",
      ],
    },
    {
      title: "Clinical Placements",
      body: [
        `Placements usually test whether learners can apply classroom knowledge safely in ${setting}. Supervisors expect preparation, professionalism, communication, and increasing independence within scope.`,
        "High-performing students prepare by reviewing common skills, practicing handoff language, understanding safety policies, and reflecting after each shift.",
      ],
    },
    {
      title: "Salary And Job Research",
      body: [
        "Salary varies by province, union or employer, public versus private setting, seniority, overtime, rural or urban location, and specialty area.",
        "Use current job postings, provincial wage grids, professional associations, and employer career pages for up-to-date salary research rather than relying on a single national estimate.",
      ],
    },
  ];
}

function sharedPlacementSections(profession: string): AlliedAuthorityProfile["placementSections"] {
  return [
    {
      title: "Before Placement",
      body: [
        `Review the common conditions, safety expectations, documentation standards, and communication patterns for ${profession}.`,
        "Prepare a small notebook of normal values, red flags, handoff prompts, and questions to ask your preceptor.",
      ],
    },
    {
      title: "During Placement",
      body: [
        "Use a repeatable routine: preview the assignment, identify safety risks, clarify expectations, perform skills within scope, document promptly, and ask for feedback.",
        "The best placement learning comes from explaining your reasoning, not just completing assigned tasks.",
      ],
    },
    {
      title: "After Placement",
      body: [
        "Write down one strength, one uncertainty, one safety lesson, and one skill to practice before the next shift.",
        "Convert feedback into study tasks: review the relevant lesson, practice flashcards, answer questions, and rehearse the skill or handoff.",
      ],
    },
  ];
}

function interviewQuestions(profile: AlliedAuthorityProfile): string[] {
  const clinical = [
    `How would you explain your role as a ${profile.shortLabel} to a patient or family member?`,
    "Tell us about a time you noticed a patient safety risk.",
    "How do you decide what to report immediately to a preceptor or supervisor?",
    "Describe how you handle conflicting information in a patient chart.",
    "What assessment finding would make you stop and escalate care?",
    "How do you stay within scope while still being helpful to the team?",
    "Describe a situation where communication prevented an error.",
    "How do you manage a task when you are unsure of the next step?",
    "What does patient-centered care mean in your profession?",
    "How do you document clearly after a busy clinical interaction?",
  ];
  const teamwork = [
    "Tell us about a time you received difficult feedback.",
    "How do you handle conflict with a team member?",
    "What would you do if you saw a peer using an unsafe shortcut?",
    "How do you prioritize when several people need help at once?",
    "Describe a time you advocated for someone.",
    "How do you build trust with patients who are anxious or frustrated?",
    "What does cultural safety mean in daily practice?",
    "How do you prepare for a clinical day?",
    "What would your preceptor say is your biggest strength?",
    "What skill are you actively working to improve?",
  ];
  const professionSpecific = profile.clinicalSkills.flatMap((item) => [
    `How would you approach a clinical situation involving ${item.title.toLowerCase()}?`,
    `What safety issue matters most during ${item.title.toLowerCase()}?`,
  ]);
  const learning = [
    "How do you learn from a mistake without becoming defensive?",
    "What is your approach to studying for practical or written evaluations?",
    "How do you respond when a patient asks a question you cannot answer?",
    "Describe your process for giving or receiving a handoff.",
    "How would you support a patient with low health literacy?",
    "What does professionalism look like when the unit is busy?",
    "How do you protect privacy and confidentiality?",
    "What would you do if a patient refused care or an intervention?",
    "How do you recognize that a patient may be deteriorating?",
    "Why did you choose this profession?",
    "What clinical setting interests you most and why?",
    "How do you manage stress during placement or practicum?",
    "How would you prepare for a high-stakes skill check?",
    "What do you do after receiving an abnormal result or concerning finding?",
    "What is one patient safety topic every learner in your profession should understand?",
    "How do you communicate urgency without sounding alarmist?",
    "How do you balance empathy with professional boundaries?",
    "What would you do if documentation was incomplete?",
    "How do you contribute to interprofessional care?",
    "What are your goals for your first year in practice?",
    "How would you explain a complex finding in plain language?",
    "What would you do if you felt a patient's condition was changing but others seemed less concerned?",
  ];
  return [...clinical, ...teamwork, ...professionSpecific, ...learning].slice(0, 50);
}

export const ALLIED_AUTHORITY_PROFILES: AlliedAuthorityProfile[] = [
  {
    key: "respiratory-therapy",
    routeSlug: "rrt-exam-prep",
    label: "Respiratory Therapy",
    shortLabel: "Respiratory Therapist",
    roleDescription:
      "Respiratory therapy learners need airway, ventilation, oxygenation, ABG, emergency response, and equipment-focused clinical reasoning.",
    careerTitle: "How To Become A Respiratory Therapist In Canada",
    careerDeck:
      "A Canadian respiratory therapy career guide covering education, placements, certification research, clinical skills, interviews, and study planning.",
    keywordClusters: {
      educational: ["respiratory therapy program Canada", "respiratory therapist school", "respiratory therapy prerequisites"],
      career: ["how to become a respiratory therapist in Canada", "respiratory therapist career path", "RRT jobs Canada"],
      placement: ["respiratory therapy clinical placement", "RRT placement tips", "respiratory therapy practicum guide"],
      study: ["respiratory therapy study guide", "ABG interpretation study", "ventilator settings review"],
      interview: ["respiratory therapy interview questions", "RRT interview questions", "respiratory therapist clinical interview"],
      clinicalSkills: ["ABG interpretation", "ventilator settings", "oxygen delivery devices", "airway suctioning"],
      exam: ["respiratory therapy exam prep", "RRT exam practice questions", "CBRC exam prep"],
      salary: ["respiratory therapist salary Canada", "RRT wage Canada", "respiratory therapy pay by province"],
      certification: ["respiratory therapist certification Canada", "CBRC RRT exam", "respiratory therapy registration Canada"],
    },
    careerSections: sharedCareerSections(
      "Respiratory Therapist",
      "acute care, emergency, ICU, neonatal, pulmonary function, home oxygen, and community respiratory settings",
      "Respiratory therapy registration and examination expectations are province-specific and should be confirmed through the appropriate regulator, program, and national exam resources.",
    ),
    placementSections: sharedPlacementSections("respiratory therapy"),
    studyGuides: [
      {
        title: "ABG And Oxygenation Review",
        description: "Build interpretation skill by connecting pH, PaCO2, HCO3, PaO2, SpO2, work of breathing, and patient context.",
        resources: ["ABG Interpretation", "Oxygen Delivery Devices", "Respiratory Failure Case Review"],
      },
      {
        title: "Ventilation And Equipment Review",
        description: "Practice mode recognition, alarms, patient-ventilator synchrony, humidification, suctioning, and escalation.",
        resources: ["Ventilator Settings", "Airway Suctioning", "Weaning Readiness"],
      },
    ],
    clinicalSkills: [
      skill("rrt-exam-prep", "abg-interpretation", "ABG Interpretation", "Interpret acid-base status, oxygenation, ventilation, and urgency.", ["ABG interpretation requires matching numbers with the patient, not memorizing normal ranges alone.", "Respiratory learners should connect compensation patterns to clinical deterioration and ventilatory support."], ["Check pH first.", "Determine whether PaCO2 or HCO3 explains the primary disorder.", "Assess oxygenation with PaO2, SpO2, oxygen device, and work of breathing.", "Identify whether the result requires urgent escalation."]),
      skill("rrt-exam-prep", "ventilator-settings", "Ventilator Settings", "Understand core ventilator parameters and patient response.", ["Ventilator settings matter because small changes can affect ventilation, oxygenation, comfort, and lung protection.", "Learners should always connect settings to alarms, assessment, and provider orders."], ["Identify the mode.", "Review FiO2, PEEP, rate, tidal volume or pressure target.", "Assess patient synchrony and alarm trends.", "Report unsafe or worsening patterns promptly."]),
      skill("rrt-exam-prep", "oxygen-delivery-devices", "Oxygen Delivery Devices", "Choose and monitor oxygen devices safely.", ["Oxygen therapy requires matching device, flow, patient tolerance, and target saturation.", "The priority is whether oxygenation improves without increasing risk."], ["Confirm ordered device and flow.", "Assess skin, mucosa, work of breathing, and saturation trend.", "Escalate if support is inadequate.", "Teach safe oxygen use."]),
      skill("rrt-exam-prep", "airway-suctioning", "Airway Suctioning", "Use suctioning to maintain airway patency while preventing harm.", ["Suctioning can improve airway clearance but may cause hypoxemia, trauma, vagal response, or anxiety.", "Good technique depends on assessment, preoxygenation when appropriate, sterile or clean technique per context, and reassessment."], ["Assess need before suctioning.", "Prepare equipment and oxygenation strategy.", "Limit suction duration.", "Reassess breath sounds, secretions, saturation, and tolerance."]),
    ],
  },
  {
    key: "paramedicine",
    routeSlug: "paramedic-exam-prep",
    label: "Paramedicine",
    shortLabel: "Paramedic",
    roleDescription:
      "Paramedicine learners need rapid assessment, scene safety, trauma, medical emergencies, transport decisions, and concise communication.",
    careerTitle: "How To Become A Paramedic In Canada",
    careerDeck: "A Canadian paramedic career guide for education pathways, clinical placements, exams, interviews, and field readiness.",
    keywordClusters: {
      educational: ["paramedic school Canada", "primary care paramedic program", "advanced care paramedic education"],
      career: ["how to become a paramedic in Canada", "paramedic career path", "paramedic jobs Canada"],
      placement: ["paramedic clinical placement", "ambulance ride out tips", "paramedic practicum guide"],
      study: ["paramedic study guide", "trauma assessment review", "primary survey practice"],
      interview: ["paramedic interview questions", "EMS interview questions", "paramedic scenario interview"],
      clinicalSkills: ["primary survey", "secondary survey", "trauma assessment", "stroke screen"],
      exam: ["paramedic exam prep", "PCP exam practice questions", "paramedic scenario questions"],
      salary: ["paramedic salary Canada", "paramedic wage by province", "EMS salary Canada"],
      certification: ["paramedic certification Canada", "paramedic licensing Canada", "PCP registration requirements"],
    },
    careerSections: sharedCareerSections(
      "Paramedic",
      "ambulance, emergency, community paramedicine, event medicine, transport, and urgent response settings",
      "Paramedic credentialing, scope, and registration vary by province and level of practice. Always confirm current requirements with provincial regulators and programs.",
    ),
    placementSections: sharedPlacementSections("paramedicine"),
    studyGuides: [
      {
        title: "Emergency Assessment Review",
        description: "Practice scene size-up, primary survey, secondary survey, vital-sign interpretation, and transport priorities.",
        resources: ["Primary Survey", "Secondary Survey", "Trauma Assessment"],
      },
      {
        title: "Medical Emergency Reasoning",
        description: "Connect cues to life threats, immediate actions, and concise handoff.",
        resources: ["Stroke Screen", "12-Lead ECG Acquisition", "Airway Adjuncts"],
      },
    ],
    clinicalSkills: [
      skill("paramedic-exam-prep", "primary-survey", "Primary Survey", "Rapidly identify and act on immediate life threats.", ["Primary survey is the first clinical filter in emergency care.", "The goal is to find what can kill the patient now and act within scope."], ["Confirm scene safety.", "Assess airway, breathing, circulation, disability, and exposure.", "Intervene as life threats are found.", "Reassess after each intervention."]),
      skill("paramedic-exam-prep", "secondary-survey", "Secondary Survey", "Gather focused findings after immediate threats are addressed.", ["Secondary survey helps explain the problem after immediate safety is stabilized.", "Learners should avoid becoming so detailed that they delay transport or priority care."], ["Obtain history and event details.", "Perform head-to-toe or focused assessment.", "Trend vital signs.", "Prepare a clear handoff."]),
      skill("paramedic-exam-prep", "trauma-assessment", "Trauma Assessment", "Prioritize safety, hemorrhage control, spinal considerations, and transport.", ["Trauma assessment requires pattern recognition and urgency.", "Findings should guide destination decision, interventions, and early notification."], ["Control catastrophic bleeding.", "Assess airway and breathing.", "Identify shock signs.", "Package, monitor, and communicate priority findings."]),
      skill("paramedic-exam-prep", "stroke-screen", "Stroke Screen", "Recognize stroke cues and time-sensitive escalation.", ["Stroke screening supports early recognition and destination planning.", "The time last known well and symptom pattern can change treatment options."], ["Determine last known well.", "Assess face, arm, speech, gaze, and balance per local tool.", "Check glucose when indicated.", "Notify receiving facility early."]),
    ],
  },
  {
    key: "occupational-therapy",
    routeSlug: "occupational-therapy-exam-prep",
    label: "Occupational Therapy",
    shortLabel: "Occupational Therapist",
    roleDescription:
      "Occupational therapy learners need functional assessment, ADLs, cognition, safety, adaptive strategies, and participation-focused reasoning.",
    careerTitle: "How To Become An Occupational Therapist In Canada",
    careerDeck: "A Canadian OT career guide for education planning, placement success, interviews, and functional assessment study.",
    keywordClusters: {
      educational: ["occupational therapy school Canada", "OT program prerequisites", "occupational therapy degree Canada"],
      career: ["how to become an occupational therapist in Canada", "occupational therapist career path", "OT jobs Canada"],
      placement: ["occupational therapy placement guide", "OT clinical placement tips", "occupational therapy fieldwork Canada"],
      study: ["occupational therapy study guide", "ADL assessment review", "OT clinical reasoning guide"],
      interview: ["occupational therapy interview questions", "OT interview questions", "occupational therapy school interview"],
      clinicalSkills: ["ADL assessment", "cognitive screening", "home safety assessment", "adaptive equipment"],
      exam: ["occupational therapy exam prep", "OT competency exam study", "occupational therapy practice questions"],
      salary: ["occupational therapist salary Canada", "OT wage Canada", "occupational therapy salary by province"],
      certification: ["occupational therapy registration Canada", "OT licensing Canada", "occupational therapy certification"],
    },
    careerSections: sharedCareerSections(
      "Occupational Therapist",
      "rehabilitation, acute care, mental health, community, pediatrics, long-term care, and return-to-work settings",
      "Occupational therapy education and registration requirements should be verified through Canadian OT regulators, associations, and university programs.",
    ),
    placementSections: sharedPlacementSections("occupational therapy"),
    studyGuides: [
      {
        title: "Functional Assessment Review",
        description: "Practice assessing ADLs, cognition, safety barriers, home setup, and participation goals.",
        resources: ["ADL Assessment", "Cognitive Screening", "Home Safety Assessment"],
      },
      {
        title: "Intervention Planning Review",
        description: "Connect goals to adaptive equipment, energy conservation, graded activity, and patient education.",
        resources: ["Adaptive Equipment", "Energy Conservation", "Functional Transfers"],
      },
    ],
    clinicalSkills: [
      skill("occupational-therapy-exam-prep", "adl-assessment", "ADL Assessment", "Assess self-care ability, barriers, safety, and support needs.", ["ADL assessment is about function, not just strength.", "OT reasoning connects environment, cognition, physical ability, routines, and patient priorities."], ["Clarify baseline function.", "Observe task performance.", "Identify barriers and safety risks.", "Recommend supports or adaptations."]),
      skill("occupational-therapy-exam-prep", "cognitive-screening", "Cognitive Screening", "Recognize cognitive factors affecting safety and independence.", ["Cognitive screening helps explain safety, medication management, discharge readiness, and caregiver needs.", "Findings should be interpreted with function and context."], ["Choose the appropriate screening tool.", "Observe attention, memory, sequencing, and insight.", "Connect findings to daily tasks.", "Document implications and referrals."]),
      skill("occupational-therapy-exam-prep", "home-safety-assessment", "Home Safety Assessment", "Identify environmental risks and practical modifications.", ["Home safety work prevents falls, supports independence, and reduces caregiver strain.", "Recommendations should be realistic for the person's home, budget, and goals."], ["Assess entry, bathroom, bedroom, kitchen, lighting, and mobility paths.", "Identify fall and accessibility risks.", "Recommend prioritized changes.", "Teach patient and caregiver safety strategies."]),
      skill("occupational-therapy-exam-prep", "adaptive-equipment", "Adaptive Equipment", "Match equipment to function, safety, and participation goals.", ["Equipment should solve a real functional problem.", "OT learners should avoid recommending devices without training, fit, and follow-up."], ["Identify the task barrier.", "Select an appropriate device.", "Teach use and safety.", "Reassess whether function improved."]),
    ],
  },
  {
    key: "physiotherapy",
    routeSlug: "physiotherapy-exam-prep",
    label: "Physiotherapy",
    shortLabel: "Physiotherapist",
    roleDescription:
      "Physiotherapy learners need mobility, strength, function, rehabilitation planning, gait, transfer, and safety-focused reasoning.",
    careerTitle: "How To Become A Physiotherapist In Canada",
    careerDeck: "A Canadian physiotherapy career guide for education, clinical placements, interviews, study planning, and rehabilitation skills.",
    keywordClusters: {
      educational: ["physiotherapy school Canada", "physical therapy program Canada", "physiotherapy prerequisites"],
      career: ["how to become a physiotherapist in Canada", "physiotherapist career path", "physiotherapy jobs Canada"],
      placement: ["physiotherapy clinical placement", "PT placement guide", "physiotherapy practicum tips"],
      study: ["physiotherapy study guide", "mobility assessment review", "gait assessment study"],
      interview: ["physiotherapy interview questions", "PT interview questions", "physiotherapy school interview"],
      clinicalSkills: ["mobility assessment", "gait assessment", "range of motion", "fall risk assessment"],
      exam: ["physiotherapy exam prep", "PCE practice questions", "physiotherapy competency exam"],
      salary: ["physiotherapist salary Canada", "physiotherapy wage Canada", "PT salary by province"],
      certification: ["physiotherapy registration Canada", "PCE exam Canada", "physiotherapy licensing Canada"],
    },
    careerSections: sharedCareerSections(
      "Physiotherapist",
      "rehabilitation, acute care, outpatient, sports, community, long-term care, pediatrics, and neurological recovery settings",
      "Physiotherapy registration and competency requirements vary by province and should be confirmed through current regulator and exam resources.",
    ),
    placementSections: sharedPlacementSections("physiotherapy"),
    studyGuides: [
      {
        title: "Mobility And Function Review",
        description: "Practice assessment, safety, progression, and patient education for mobility and rehabilitation.",
        resources: ["Mobility Assessment", "Gait Assessment", "Transfer Training"],
      },
      {
        title: "Musculoskeletal And Rehab Review",
        description: "Connect range of motion, strength, pain, function, and goals to safe treatment planning.",
        resources: ["Range Of Motion", "Fall Risk Assessment", "Exercise Progression"],
      },
    ],
    clinicalSkills: [
      skill("physiotherapy-exam-prep", "mobility-assessment", "Mobility Assessment", "Evaluate mobility, safety, assistance level, and functional limitations.", ["Mobility assessment helps determine risk, discharge needs, and rehabilitation goals.", "Learners should observe quality of movement, not just whether the patient can move."], ["Clarify baseline mobility.", "Assess bed mobility, transfers, standing, and gait as appropriate.", "Identify assistance level and safety risks.", "Document recommendations."]),
      skill("physiotherapy-exam-prep", "gait-assessment", "Gait Assessment", "Interpret gait pattern, balance, endurance, and assistive device needs.", ["Gait assessment links movement quality to fall risk and functional independence.", "The safest device is the one the patient can use correctly and consistently."], ["Assess posture, step length, cadence, balance, and endurance.", "Check device fit.", "Identify compensation or pain patterns.", "Teach safe progression."]),
      skill("physiotherapy-exam-prep", "range-of-motion", "Range Of Motion", "Assess joint movement and functional implications.", ["Range of motion findings are meaningful when connected to pain, strength, function, and goals.", "Documentation should distinguish active from passive movement."], ["Position safely.", "Measure or estimate movement consistently.", "Compare sides when appropriate.", "Document limitations and functional impact."]),
      skill("physiotherapy-exam-prep", "fall-risk-assessment", "Fall Risk Assessment", "Identify mobility-related risks and prevention strategies.", ["Fall risk is multi-factorial and often includes strength, balance, cognition, environment, medication effects, and footwear.", "A useful assessment leads to concrete prevention actions."], ["Review fall history.", "Assess gait, transfers, balance, and environment.", "Identify modifiable risks.", "Recommend targeted prevention strategies."]),
    ],
  },
  {
    key: "medical-laboratory-technology",
    routeSlug: "mlt-exam-prep",
    label: "Medical Laboratory Technology",
    shortLabel: "Medical Laboratory Technologist",
    roleDescription:
      "MLT learners need specimen integrity, quality control, critical value reporting, instrumentation, and diagnostic interpretation awareness.",
    careerTitle: "How To Become A Medical Laboratory Technologist In Canada",
    careerDeck: "A Canadian MLT career guide covering education, certification research, placements, lab skills, interviews, and study strategy.",
    keywordClusters: {
      educational: ["medical laboratory technology program Canada", "MLT school Canada", "medical lab technologist prerequisites"],
      career: ["how to become a medical laboratory technologist in Canada", "MLT career path", "medical laboratory technologist jobs Canada"],
      placement: ["MLT clinical placement", "medical laboratory technology practicum", "lab placement guide"],
      study: ["MLT study guide", "medical laboratory technology exam prep", "specimen collection review"],
      interview: ["MLT interview questions", "medical laboratory technologist interview questions", "lab technologist interview"],
      clinicalSkills: ["specimen collection", "critical value reporting", "hemolysis recognition", "quality control"],
      exam: ["MLT exam prep", "CSMLS exam practice questions", "medical laboratory technology certification exam"],
      salary: ["medical laboratory technologist salary Canada", "MLT wage Canada", "lab technologist salary by province"],
      certification: ["MLT certification Canada", "CSMLS exam", "medical laboratory technologist registration"],
    },
    careerSections: sharedCareerSections(
      "Medical Laboratory Technologist",
      "hospital laboratories, reference laboratories, microbiology, hematology, chemistry, transfusion medicine, and specimen collection settings",
      "Medical laboratory technology certification and registration should be confirmed through current CSMLS, provincial regulator, and program guidance.",
    ),
    placementSections: sharedPlacementSections("medical laboratory technology"),
    studyGuides: [
      {
        title: "Specimen Integrity Review",
        description: "Practice collection, labeling, transport, rejection criteria, and pre-analytical error recognition.",
        resources: ["Specimen Collection", "Hemolysis Recognition", "Blood Culture Collection"],
      },
      {
        title: "Quality And Reporting Review",
        description: "Connect quality control, critical values, instrument checks, and communication to patient safety.",
        resources: ["Critical Value Reporting", "Quality Control", "CBC Smear Basics"],
      },
    ],
    clinicalSkills: [
      skill("mlt-exam-prep", "specimen-collection", "Specimen Collection", "Protect specimen integrity from collection through transport.", ["Specimen quality directly affects diagnostic accuracy.", "Pre-analytical errors can delay care or lead to wrong clinical decisions."], ["Confirm patient identity.", "Use correct container and order of draw when relevant.", "Label at bedside or collection site per policy.", "Transport under required conditions."]),
      skill("mlt-exam-prep", "critical-value-reporting", "Critical Value Reporting", "Communicate urgent lab values accurately and promptly.", ["Critical values matter because delay can harm patients.", "Reporting requires accuracy, readback, documentation, and escalation if the responsible clinician cannot be reached."], ["Verify the value and specimen context.", "Notify the appropriate clinician per policy.", "Use readback.", "Document time, recipient, and action."]),
      skill("mlt-exam-prep", "hemolysis-recognition", "Hemolysis Recognition", "Recognize hemolysis and understand its effect on test reliability.", ["Hemolysis can alter results and may require recollection.", "Learners should connect specimen appearance to patient safety and result interpretation."], ["Inspect specimen quality.", "Identify affected tests.", "Follow rejection or comment policy.", "Communicate recollection needs promptly."]),
      skill("mlt-exam-prep", "quality-control", "Quality Control", "Use quality control to protect accurate laboratory reporting.", ["Quality control is a patient safety process, not paperwork.", "Unacceptable QC means results may be unreliable and should not be released until resolved."], ["Run QC as required.", "Compare against expected limits.", "Troubleshoot failures.", "Document corrective action."]),
    ],
  },
  {
    key: "psw",
    routeSlug: "psw-hca-exam-prep",
    label: "Personal Support Worker",
    shortLabel: "PSW",
    roleDescription:
      "PSW learners need safe care, communication, mobility assistance, infection control, dementia support, observation, and reporting.",
    careerTitle: "How To Become A Personal Support Worker In Canada",
    careerDeck: "A Canadian PSW career guide for training, placements, interviews, safety skills, study planning, and workplace readiness.",
    keywordClusters: {
      educational: ["PSW program Canada", "personal support worker course", "health care aide training Canada"],
      career: ["how to become a PSW in Canada", "personal support worker career path", "PSW jobs Canada"],
      placement: ["PSW clinical placement", "personal support worker placement guide", "health care aide practicum tips"],
      study: ["PSW study guide", "personal support worker exam prep", "PSW safety review"],
      interview: ["PSW interview questions", "personal support worker interview questions", "health care aide interview"],
      clinicalSkills: ["safe transfers", "infection control", "skin integrity checks", "dementia communication"],
      exam: ["PSW exam prep", "personal support worker practice questions", "health care aide test questions"],
      salary: ["PSW salary Canada", "personal support worker wage Canada", "health care aide salary by province"],
      certification: ["PSW certification Canada", "personal support worker training requirements", "health care aide registry"],
    },
    careerSections: sharedCareerSections(
      "Personal Support Worker",
      "long-term care, home care, assisted living, acute care support, rehabilitation, and community settings",
      "PSW, HCA, and care aide training and registry requirements vary by province and employer. Learners should verify current local expectations before enrolling.",
    ),
    placementSections: sharedPlacementSections("personal support work"),
    studyGuides: [
      {
        title: "Safety And Mobility Review",
        description: "Practice transfers, falls prevention, infection control, skin checks, and reporting concerns.",
        resources: ["Safe Transfers", "Infection Control", "Skin Integrity Checks"],
      },
      {
        title: "Communication And Daily Care Review",
        description: "Build confidence with dementia communication, meal assistance, dignity, privacy, and documentation.",
        resources: ["Dementia Communication", "Meal Assistance", "Documentation And Reporting"],
      },
    ],
    clinicalSkills: [
      skill("psw-hca-exam-prep", "safe-transfers", "Safe Transfers", "Assist mobility while protecting patient and worker safety.", ["Transfers require preparation, communication, body mechanics, and knowing when to ask for help.", "Unsafe transfer technique can injure both the patient and caregiver."], ["Assess ability and equipment needs.", "Explain the plan.", "Use safe body mechanics and aids.", "Report pain, dizziness, weakness, or near falls."]),
      skill("psw-hca-exam-prep", "infection-control", "Infection Control", "Use routine practices to reduce transmission risk.", ["Infection control protects residents, patients, coworkers, and families.", "The correct action depends on risk, task, PPE, hand hygiene, and cleaning."], ["Perform hand hygiene.", "Choose PPE for the task.", "Handle linen and waste safely.", "Report symptoms or exposure concerns."]),
      skill("psw-hca-exam-prep", "skin-integrity-checks", "Skin Integrity Checks", "Observe and report early signs of skin breakdown.", ["PSWs often notice skin changes early during daily care.", "Prompt reporting can prevent pressure injuries and infection."], ["Inspect high-risk areas during care.", "Notice redness, warmth, moisture, pain, or open areas.", "Reposition and protect skin per care plan.", "Report and document changes."]),
      skill("psw-hca-exam-prep", "dementia-communication", "Dementia Communication", "Use calm, respectful communication to support safety and dignity.", ["Dementia communication affects cooperation, distress, safety, and trust.", "The goal is to reduce threat and support function, not to win an argument."], ["Approach calmly.", "Use simple cues.", "Validate emotion.", "Redirect safely and report behavior changes."]),
    ],
  },
];

export function getAlliedAuthorityProfiles(): AlliedAuthorityProfile[] {
  return ALLIED_AUTHORITY_PROFILES;
}

export function getAlliedAuthorityProfileBySlug(slug: string): AlliedAuthorityProfile | undefined {
  return ALLIED_AUTHORITY_PROFILES.find((profile) => profile.routeSlug === slug);
}

export function getAlliedAuthoritySkill(profileSlug: string, skillSlug: string): { profile: AlliedAuthorityProfile; skill: AlliedSkillPage } | undefined {
  const profile = getAlliedAuthorityProfileBySlug(profileSlug);
  const skillPage = profile?.clinicalSkills.find((item) => item.slug === skillSlug);
  if (!profile || !skillPage) return undefined;
  return { profile, skill: skillPage };
}

export function getAlliedAuthoritySkillStaticParams(): Array<{ slug: string; skillSlug: string }> {
  return ALLIED_AUTHORITY_PROFILES.flatMap((profile) =>
    profile.clinicalSkills.map((skillPage) => ({ slug: profile.routeSlug, skillSlug: skillPage.slug })),
  );
}

export function buildAlliedAuthorityPath(profile: AlliedAuthorityProfile, page: "career" | "interview-questions" | "placement-guide" | "study-guide"): string {
  return `/allied-health/${profile.routeSlug}/${page}`;
}

export function buildAlliedSkillPath(profile: AlliedAuthorityProfile, skillPage: AlliedSkillPage): string {
  return `/allied-health/${profile.routeSlug}/skills/${skillPage.slug}`;
}

export function buildAlliedAuthorityBreadcrumbs(profile: AlliedAuthorityProfile, title: string, href: string): Array<{ name: string; href: string }> {
  return [
    { name: "Home", href: "/" },
    { name: "Allied Health", href: "/allied-health" },
    { name: profile.label, href: `/allied-health/${profile.routeSlug}` },
    { name: title, href },
  ];
}

export function buildAlliedFaqJsonLd(title: string, path: string, faqs: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    name: title,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function validateAlliedAuthorityProgram(): string[] {
  const issues: string[] = [];
  const routeSlugs = new Set<string>();
  for (const profile of ALLIED_AUTHORITY_PROFILES) {
    if (routeSlugs.has(profile.routeSlug)) issues.push(`Duplicate route slug: ${profile.routeSlug}`);
    routeSlugs.add(profile.routeSlug);
    for (const cluster of CLUSTER_NAMES) {
      if (!profile.keywordClusters[cluster]?.length) issues.push(`${profile.label} is missing ${cluster} keyword cluster.`);
    }
    if (interviewQuestions(profile).length !== 50) issues.push(`${profile.label} does not generate 50 interview questions.`);
    if (profile.clinicalSkills.length < 4) issues.push(`${profile.label} needs at least 4 seed clinical skill pages.`);
    for (const skillPage of profile.clinicalSkills) {
      if (skillPage.learningObjectives.length < 3) issues.push(`${skillPage.title} needs stronger objectives.`);
      if (skillPage.practiceActivities.length < 3) issues.push(`${skillPage.title} needs practice activities.`);
      if (skillPage.faqs.length < 2) issues.push(`${skillPage.title} needs FAQs.`);
      if (skillPage.related.length < 4) issues.push(`${skillPage.title} needs internal links.`);
    }
  }
  return issues;
}

export { interviewQuestions as getAlliedAuthorityInterviewQuestions };
