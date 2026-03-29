import type { LessonContent } from "./types";

export const leadershipManagementLessons: Record<string, LessonContent> = {
  "leadership-mgmt-rpn": {
    title: "Leadership and Management Foundations",
    cellular: {
      title: "Foundations of Leadership",
      content:
        "Registered Practical Nurses (RPNs) function within a collaborative healthcare team and must understand their scope of practice regarding delegation and task assignment. RPNs may delegate specific tasks to unregulated care providers (UAPs) such as personal support workers, but retain accountability for assessing client status and determining appropriateness of delegation. Effective leadership at the nurse level includes time management for bedside care, professional communication during conflict resolution, and understanding incident reporting procedures. Just culture principles distinguish between human error, at-risk behavior, and reckless conduct, guiding how organizations respond to safety events rather than defaulting to punitive action."
    },
    riskFactors: [
      "Unclear delegation boundaries leading to scope-of-practice violations",
      "Poor time management resulting in missed assessments or medication errors",
      "Failure to report incidents or near-misses due to fear of blame",
      "Ineffective communication during handoff or shift change",
      "Working beyond scope without appropriate supervision"
    ],
    diagnostics: [
      "Evaluate delegation appropriateness using the five rights: right task, right circumstance, right person, right direction/communication, right supervision/evaluation",
      "Assess team workload distribution: identify unbalanced assignments that may compromise patient safety",
      "Audit incident reports for patterns: recurring events in the same unit or time period may indicate systemic issues rather than individual errors",
      "Use root cause analysis (RCA) framework to investigate adverse events and near-misses beyond surface-level explanations",
      "Assess communication effectiveness during handoff using standardized tools (SBAR) and identify gaps in information transfer",
      "Evaluate staff competency through direct observation, return demonstration, and performance feedback to ensure safe task assignment",
    ],
    management: [
      "Follow delegation guidelines specific to RPN scope of practice",
      "Use standardized handoff tools such as SBAR for communication",
      "Complete incident reports promptly and accurately without assigning blame",
      "Apply time management strategies including clustering care and prioritizing tasks",
      "Engage in quality improvement activities at the unit level"
    ],
    nursingActions: [
      "Assess client stability before delegating any task to a UAP",
      "Verify UAP competency for the specific task being delegated",
      "Provide clear instructions including expected outcomes and when to report back",
      "Document delegation decisions and follow-up assessments",
      "Report safety concerns through appropriate channels without delay"
    ],
    signs: {
      left: [
        "Effective delegation: RPN retains assessment and evaluation responsibilities",
        "Professional accountability: accepts only assignments within scope",
        "Just culture: human error is addressed with education and system improvement",
        "Proper incident reporting: timely, factual, non-punitive documentation"
      ],
      right: [
        "Unsafe delegation: assigning assessment tasks to unregulated providers",
        "Scope violation: performing tasks beyond RPN authorization without direction",
        "Blame culture: errors lead to punishment rather than system analysis",
        "Underreporting: failing to document near-misses or safety events"
      ]
    },
    medications: [
      {
        name: "Medication Administration Accountability",
        type: "Leadership Principle",
        action:
          "RPNs administer medications within their scope and cannot delegate medication administration to UAPs; the nurse remains accountable for verifying the rights of medication administration",
        sideEffects:
          "Medication errors may occur if verification steps are skipped under time pressure",
        contra:
          "Never delegate medication administration to unregulated care providers",
        pearl:
          "Always perform independent double-checks for high-alert medications regardless of workload pressure"
      }
    ],
    pearls: [
      "Delegation does not transfer accountability; the nurse remains responsible for outcomes of delegated tasks",
      "The right to refuse an assignment exists when the task is outside scope of practice or the nurse lacks competency, but must follow proper refusal procedures",
      "Just culture categorizes errors into three tiers: human error (consoling), at-risk behavior (coaching), and reckless conduct (disciplinary action)",
      "Incident reports are quality improvement tools, not disciplinary documents; they should contain objective facts without personal opinions",
      "Time management at the bedside begins with assessing all assigned clients and identifying priorities before initiating care"
    ],
    quiz: [
      {
        question:
          "An RPN is delegating morning hygiene care to a UAP. Which action by the nurse is most appropriate?",
        options: [
          "Delegate the task and move on to other responsibilities",
          "Assess the client first, provide clear instructions, and plan to follow up",
          "Ask the UAP to also perform a wound assessment during the bath",
          "Tell the UAP to report only if there is an emergency"
        ],
        correct: 1,
        rationale:
          "The nurse must assess the client before delegating, provide clear instructions with expected outcomes, and follow up. Assessment cannot be delegated to a UAP, and the nurse should request reporting of any changes, not just emergencies."
      },
      {
        question:
          "A nurse makes a medication error due to a confusing label on two similarly packaged drugs. Under just culture principles, how should this be classified?",
        options: [
          "Reckless conduct requiring immediate termination",
          "At-risk behavior requiring coaching and counseling",
          "Human error requiring consoling and system redesign",
          "Intentional violation requiring legal action"
        ],
        correct: 2,
        rationale:
          "Under just culture, an error caused by system design flaws such as confusing packaging is classified as human error. The appropriate response is to console the nurse and redesign the system to prevent recurrence, such as implementing tall-man lettering or separating look-alike medications."
      },
      {
        question:
          "An RPN is assigned a client whose condition requires interventions beyond the nurse scope of practice. What is the most appropriate action?",
        options: [
          "Attempt the interventions and ask for help if problems arise",
          "Refuse the assignment without notifying anyone",
          "Notify the charge nurse and request reassignment following proper procedures",
          "Ask a UAP to perform the interventions instead"
        ],
        correct: 2,
        rationale:
          "The nurse has a professional obligation to refuse assignments outside their scope of practice but must follow proper procedures, which include notifying the charge nurse and documenting the concern. Attempting tasks beyond scope or delegating them to a UAP would compromise patient safety."
      }
    ]
  },

  "leadership-mgmt-rn": {
    title: "Leadership and Management",
    cellular: {
      title: "Leadership, Delegation",
      content:
        "Registered Nurses hold expanded leadership responsibilities including charge nurse functions, delegation oversight, and team coordination across multiple patient assignments. The Five Rights of Delegation guide RN decision-making: right task, right circumstance, right person, right directions and communication, and right supervision and evaluation. The nurse retains full accountability for all delegated tasks and must match patient acuity to staff competency when making assignments. Prioritization frameworks such as ABCs (airway, breathing, circulation) and Maslow's hierarchy of needs provide structured approaches to clinical decision-making and time management during complex patient care scenarios."
    },
    riskFactors: [
      "Delegating assessment, evaluation, or nursing judgment tasks to unlicensed personnel",
      "Failing to match patient acuity with staff competency in assignments",
      "Ignoring chain of command when addressing conflicts or safety concerns",
      "Inadequate supervision of delegated tasks leading to adverse outcomes",
      "Charge nurse staffing decisions that compromise safe nurse-to-patient ratios"
    ],
    diagnostics: [
      "Root cause analysis (RCA) to identify system failures after adverse events",
      "PDSA (Plan-Do-Study-Act) cycle for quality improvement initiatives",
      "Staff competency assessments before delegation decisions",
      "Patient acuity classification systems for assignment decisions",
      "Evidence-based practice appraisal for clinical guideline updates"
    ],
    management: [
      "Apply the Five Rights of Delegation for every delegated task",
      "Use acuity-based assignment systems to distribute patient care equitably",
      "Follow chain of command when initial conflict resolution attempts fail",
      "Implement PDSA cycles for unit-based quality improvement projects",
      "Precept new staff using structured orientation checklists and competency validation"
    ],
    nursingActions: [
      "Perform charge nurse rounds to reassess patient status and staff workload",
      "Address disruptive behavior using direct professional communication and documentation",
      "Coordinate emergency responses including resource allocation and role assignment",
      "Complete incident reports with follow-up analysis and corrective action plans",
      "Mentor new nurses through clinical reasoning exercises and supervised practice"
    ],
    signs: {
      left: [
        "Proper delegation: Five Rights applied consistently to all task assignments",
        "Effective charge nurse: acuity-matched assignments with ongoing reassessment",
        "Quality improvement: PDSA cycles with measurable outcome data",
        "Conflict resolution: direct communication followed by chain of command escalation",
        "Evidence-based practice: clinical decisions grounded in current research"
      ],
      right: [
        "Improper delegation: assigning nursing judgment tasks to UAPs or LPNs beyond scope",
        "Unsafe staffing: assignments based on convenience rather than patient acuity",
        "Stagnant practice: resistance to quality improvement or evidence updates",
        "Unresolved conflict: avoiding confrontation or bypassing chain of command",
        "Inadequate precepting: new staff left unsupervised before competency validation"
      ]
    },
    medications: [
      {
        name: "High-Alert Medication Oversight",
        type: "Charge Nurse Responsibility",
        action:
          "The charge nurse ensures unit compliance with high-alert medication protocols including independent double-checks for insulin, heparin, chemotherapy, and opioids",
        sideEffects:
          "System failures in medication safety protocols increase risk of serious adverse drug events",
        contra:
          "Never allow workarounds that bypass established medication safety checks",
        pearl:
          "NCLEX frequently tests the charge nurse role in medication error prevention and response including when to complete an incident report versus when to notify the provider first"
      }
    ],
    pearls: [
      "The Five Rights of Delegation: right task, right circumstance, right person, right directions/communication, right supervision/evaluation",
      "The charge nurse should assign the most unstable patients to the most experienced nurses and keep a lighter assignment to remain available for emergencies",
      "NCLEX frequently tests charge nurse logic: which patient to see first, which task to delegate, and which assignment is most appropriate for a float nurse",
      "Floating policies should match the float nurse to a unit with similar patient population; never assign a float nurse to specialty patients without orientation",
      "Root cause analysis focuses on system failures rather than individual blame and asks why an event occurred rather than who caused it"
    ],
    quiz: [
      {
        question:
          "A charge nurse is making patient assignments. A float nurse from a medical unit is available. Which assignment is most appropriate for the float nurse?",
        options: [
          "A patient on continuous cardiac monitoring requiring titration of a vasopressor drip",
          "A stable postoperative patient requiring routine vital signs and ambulation",
          "A newly admitted patient with chest pain requiring serial troponin monitoring",
          "A patient requiring chemotherapy administration with vesicant precautions"
        ],
        correct: 1,
        rationale:
          "The float nurse from a medical unit should receive the most stable patient with tasks within general nursing competency. Vasopressor titration, new chest pain admissions, and chemotherapy administration require specialized training and orientation to the unit."
      },
      {
        question:
          "An RN delegates blood glucose monitoring to a UAP. The UAP reports a reading of 45 mg/dL. What is the RN's priority action?",
        options: [
          "Ask the UAP to recheck the blood glucose in 15 minutes",
          "Document the finding and continue with other patient care",
          "Assess the patient immediately and initiate the hypoglycemia protocol",
          "Delegate the UAP to administer orange juice to the patient"
        ],
        correct: 2,
        rationale:
          "A blood glucose of 45 mg/dL indicates hypoglycemia requiring immediate RN assessment and intervention. The nurse retains responsibility for clinical evaluation and treatment decisions. Delegating treatment to the UAP or delaying assessment could result in serious harm."
      },
      {
        question:
          "A nurse identifies a pattern of medication errors occurring during shift change on the unit. Which quality improvement approach should the nurse recommend?",
        options: [
          "Counsel each nurse individually about their specific errors",
          "Implement a PDSA cycle to test a standardized handoff process",
          "Report all involved nurses to the state board of nursing",
          "Increase surveillance cameras in the medication room"
        ],
        correct: 1,
        rationale:
          "The PDSA (Plan-Do-Study-Act) cycle is the appropriate quality improvement approach to systematically test and evaluate a process change such as standardized handoff. Individual counseling addresses symptoms rather than system causes, and reporting to the board is not warranted for system-level issues."
      }
    ]
  },

  "leadership-mgmt-np": {
    title: "Leadership and Management",
    cellular: {
      title: "Practice Leadership",
      content:
        "Nurse Practitioners function as healthcare team leaders who integrate clinical expertise with system-level management responsibilities including interprofessional collaboration, practice operations, and health policy advocacy. NP leadership extends beyond direct patient care to encompass program development, population health management, and organizational change using evidence-based frameworks. Quality metrics and outcomes measurement drive NP practice evaluation, requiring competency in data analysis, benchmarking, and translating research into clinical protocols. Resource allocation ethics challenge NPs to balance individual patient needs against population-level health outcomes while maintaining regulatory compliance and managing organizational risk."
    },
    riskFactors: [
      "Fragmented interprofessional communication leading to care gaps",
      "Failure to track quality metrics resulting in undetected outcome trends",
      "Resistance to organizational change from established team members",
      "Regulatory non-compliance exposing the practice to legal liability",
      "Inefficient practice management reducing patient access and revenue sustainability"
    ],
    diagnostics: [
      "Quality metrics dashboards tracking patient outcomes and process indicators",
      "Population health data analysis identifying at-risk groups and care gaps",
      "Practice management audits evaluating scheduling efficiency and referral patterns",
      "Regulatory compliance reviews ensuring adherence to prescriptive authority and collaborative agreements",
      "Evidence-based practice appraisals using GRADE framework for guideline evaluation"
    ],
    management: [
      "Lead interprofessional team meetings with structured agendas and action items",
      "Implement quality improvement initiatives using Lean or Six Sigma methodologies",
      "Develop clinical protocols based on systematic review of current evidence",
      "Advocate for health policy changes at local, state, and national levels",
      "Manage practice operations including scheduling optimization and revenue cycle oversight"
    ],
    nursingActions: [
      "Mentor nursing staff and students through clinical teaching and role modeling",
      "Design and implement population health management programs for chronic disease",
      "Lead root cause analysis investigations and develop corrective action plans",
      "Evaluate organizational readiness for change using validated assessment tools",
      "Establish risk management protocols including malpractice prevention strategies"
    ],
    signs: {
      left: [
        "Effective NP leadership: data-driven decisions with measurable outcome improvement",
        "Interprofessional collaboration: shared decision-making with mutual respect",
        "Evidence-based practice: clinical protocols grounded in current systematic reviews",
        "Ethical resource allocation: transparent criteria applied equitably across populations"
      ],
      right: [
        "Ineffective leadership: decisions based on tradition rather than evidence or data",
        "Siloed practice: limited communication with other disciplines or specialties",
        "Outdated protocols: clinical guidelines not updated with emerging evidence",
        "Inequitable allocation: resource distribution influenced by bias rather than need"
      ]
    },
    medications: [
      {
        name: "Prescriptive Authority Management",
        type: "NP Practice Responsibility",
        action:
          "NPs exercise prescriptive authority within their scope of practice, including scheduled and non-scheduled medications, requiring knowledge of state and provincial regulations, collaborative practice agreements, and formulary restrictions",
        sideEffects:
          "Prescribing errors may increase with expanded formularies or unfamiliar patient populations",
        contra:
          "Never prescribe outside the authorized scope defined by regulatory body or collaborative agreement",
        pearl:
          "NPs must maintain current knowledge of controlled substance regulations including prescription drug monitoring programs (PDMPs) and integrate pharmacogenomic data when available to optimize prescribing decisions"
      }
    ],
    pearls: [
      "Organizational change management requires assessing readiness, building a guiding coalition, creating a vision, communicating the change, empowering action, generating short-term wins, and anchoring change in the culture",
      "Population health management shifts focus from individual encounters to panel-level outcomes using risk stratification, care coordination, and preventive interventions",
      "Revenue cycle basics In clinical practice include proper coding and documentation (E/M levels), timely claim submission, denial management, and understanding reimbursement models (fee-for-service versus value-based)",
      "The GRADE framework (Grading of Recommendations, Assessment, Development, and Evaluation) helps NPs critically appraise evidence quality when developing or updating clinical protocols",
      "Risk management In clinical practice includes maintaining adequate documentation, obtaining informed consent, following up on diagnostic results, and establishing reliable referral tracking systems"
    ],
    quiz: [
      {
        question:
          "An NP is leading a quality improvement project to reduce hospital readmissions for heart failure patients. Which approach best demonstrates evidence-based practice implementation?",
        options: [
          "Implement changes based on what worked at a previous employer",
          "Conduct a systematic review of current literature, develop a protocol, and measure outcomes using PDSA cycles",
          "Survey staff opinions and implement the most popular suggestion",
          "Adopt the most recent pharmaceutical company recommendation for heart failure management"
        ],
        correct: 1,
        rationale:
          "Evidence-based practice implementation requires systematic review of current literature to inform protocol development, followed by structured evaluation using quality improvement methodology such as PDSA cycles. Anecdotal experience, popularity, or industry-sponsored recommendations alone do not constitute evidence-based practice."
      },
      {
        question:
          "An NP practice manager notices declining revenue despite stable patient volume. Which action should the clinician prioritize first?",
        options: [
          "Increase the number of patients scheduled per day",
          "Audit coding and documentation practices for appropriate E/M level capture",
          "Reduce support staff to decrease overhead costs",
          "Switch all patients to the most expensive procedures available"
        ],
        correct: 1,
        rationale:
          "Declining revenue with stable volume often indicates undercoding or documentation deficiencies. Auditing coding and documentation practices identifies whether services are being accurately captured at appropriate evaluation and management levels before making operational changes that could compromise care quality."
      },
      {
        question:
          "An NP is implementing a new chronic disease management program. Several experienced staff members are resistant to the change. What is the most effective leadership strategy?",
        options: [
          "Mandate compliance and discipline those who resist",
          "Abandon the program and maintain current practices",
          "Engage resistant staff in the planning process, address concerns, and demonstrate early wins",
          "Implement the program only with willing staff and exclude resisters"
        ],
        correct: 2,
        rationale:
          "Effective change management involves engaging stakeholders including those who resist change. Addressing concerns, involving staff in planning, and demonstrating short-term wins builds buy-in and reduces resistance more effectively than mandating compliance or excluding team members."
      }
    ]
  }
};
