import type { LessonContent } from "./types";

export const delegationByLicenseLessons: Record<string, LessonContent> = {
  "delegation-license-rpn": {
    title: "Delegation and Scope",
    cellular: {
      title: "Understanding Scope of Practice",
      content:
        "The Registered Practical Nurse (RPN) practices within a scope defined by predictable patient outcomes and clinical stability. RPNs accept delegated tasks from Registered Nurses when the patient condition is stable, the intervention has a known expected outcome, and the nurse possesses the necessary competency. Delegation questions account for 15-25% of exam logic items, making a thorough understanding of scope boundaries essential for success. The nurse must recognize when patient status changes require escalation to the nurse and must never independently initiate care reserved for broader scopes of practice.",
    },
    riskFactors: [
      "Accepting tasks outside legislated scope of practice",
      "Failing to escalate when patient status changes from stable to unstable",
      "Inadequate communication during handoff of delegated tasks",
      "Lack of competency verification before accepting a delegated task",
      "Working without appropriate supervision when required",
    ],
    diagnostics: [
      "Assess task complexity against your own documented competencies before accepting delegation",
      "Evaluate patient stability: stable and predictable outcomes are required for RPN-level care; unstable or complex patients require RN oversight",
      "Verify delegation authority: confirm the delegating RN has assessed the patient and determined appropriate level of care",
      "Review the five rights of delegation: right task, right circumstance, right person, right direction/communication, right supervision/evaluation",
      "Assess UAP competency using direct observation and return demonstration before delegating tasks to unregulated care providers",
      "Monitor outcomes of delegated tasks: reassess the patient after UAP completes care to verify safe and effective completion",
    ],
    management: [
      "Verify competency before accepting any delegated task",
      "Confirm that the patient meets stability criteria for RPN-level care",
      "Communicate changes in patient condition to the nurse immediately",
      "Document all delegated tasks, interventions performed, and outcomes",
      "Follow organizational policies on scope and delegation",
    ],
    nursingActions: [
      "Perform routine medication administration for stable patients",
      "Monitor and record vital signs at prescribed intervals",
      "Complete hygiene care, ambulation assistance, and repositioning",
      "Perform wound dressing changes on stable, predictable wounds",
      "Conduct blood glucose monitoring and report abnormal values",
      "Oversee UAP/PSW tasks including feeding, toileting, and transport",
    ],
    signs: {
      left: [
        "Tasks RPN CAN accept: routine medication administration",
        "Tasks RPN CAN accept: vital signs on stable patients",
        "Tasks RPN CAN accept: hygiene and ambulation assistance",
        "Tasks RPN CAN accept: wound dressing changes for stable wounds",
        "Tasks RPN CAN accept: blood glucose monitoring",
      ],
      right: [
        "Tasks requiring RN: IV push medications",
        "Tasks requiring RN: blood transfusion initiation",
        "Tasks requiring RN: initial comprehensive assessment",
        "Tasks requiring RN: care of unstable or deteriorating patients",
        "Tasks requiring RN: complex wound care management",
      ],
    },
    medications: [
      {
        name: "Oral Metoprolol",
        type: "Beta-blocker",
        action:
          "Reduces heart rate and blood pressure by blocking beta-1 adrenergic receptors; routine oral administration may be delegated to the nurse for stable patients",
        sideEffects: "Bradycardia, hypotension, fatigue, dizziness",
        contra:
          "Heart rate below 60 bpm, systolic blood pressure below 100 mmHg, second or third degree heart block",
        pearl:
          "The nurse must check heart rate and blood pressure before administration and withhold if parameters are not met, then notify the RN",
      },
    ],
    pearls: [
      "RPNs care for patients with predictable outcomes; if the outcome becomes unpredictable, escalate to the nurse immediately",
      "Delegation does not transfer accountability from the RN; the nurse remains accountable for the overall plan of care",
      "UAP/PSW tasks overseen by the nurse include feeding assistance, repositioning, toileting, and patient transport",
      "The nurse must escalate to the nurse when abnormal findings, new symptoms, or changes in patient status occur",
      "Always confirm competency and organizational policy before accepting a delegated task",
    ],
    quiz: [
      {
        question:
          "Which task is appropriate for the nurse to perform independently for a stable patient?",
        options: [
          "Initiate a blood transfusion",
          "Administer an IV push medication",
          "Perform a routine wound dressing change on a healing surgical site",
          "Complete the initial comprehensive nursing assessment",
        ],
        correct: 2,
        rationale:
          "Routine wound dressing changes on stable, predictable wounds fall within the nurse scope of practice. Blood transfusion initiation, IV push medications, and initial comprehensive assessments require the RN.",
      },
      {
        question:
          "The nurse is monitoring a previously stable patient who now reports sudden chest pain and shortness of breath. What is the priority action?",
        options: [
          "Document the findings and continue monitoring",
          "Administer PRN nitroglycerin and reassess in 30 minutes",
          "Notify the nurse immediately about the change in patient status",
          "Delegate vital sign monitoring to the PSW and continue other tasks",
        ],
        correct: 2,
        rationale:
          "A change from stable to unstable status requires immediate escalation to the RN. The patient is no longer within the predictable-outcome criteria for RPN-level independent management.",
      },
      {
        question:
          "Which task can the nurse delegate to a PSW/UAP?",
        options: [
          "Blood glucose monitoring using a glucometer",
          "Feeding assistance for a patient with no swallowing precautions",
          "Medication administration for a stable patient",
          "Assessment of a new skin breakdown area",
        ],
        correct: 1,
        rationale:
          "Feeding assistance for patients without swallowing precautions is within the UAP/PSW scope. Blood glucose monitoring, medication administration, and skin assessment require the nurse or RN.",
      },
    ],
  },

  "delegation-license-rn": {
    title: "Delegation and Assignment Authority",
    cellular: {
      title: "Principles of Delegation and Assignment",
      content:
        "The Registered Nurse holds authority to delegate tasks to RPNs/LPNs and unregulated care providers while retaining accountability for patient outcomes. Delegation is guided by the Five Rights: right task, right circumstance, right person, right direction, and right supervision. The charge nurse assigns patients to RNs and RPNs based on acuity, complexity, and required scope of practice. Nursing judgment, initial assessments, care planning, and evaluation cannot be delegated. Understanding delegation frameworks accounts for 15-25% of licensing exam questions.",
    },
    riskFactors: [
      "Delegating nursing judgment or clinical decision-making to unlicensed personnel",
      "Assigning unstable patients to providers with insufficient scope",
      "Failing to provide clear direction and expected outcomes when delegating",
      "Inadequate supervision of delegated tasks",
      "Not following the chain of command when refusing an unsafe assignment",
    ],
    management: [
      "Apply the Five Rights of Delegation before every delegation decision",
      "Assign patients based on acuity matching to provider scope and competency",
      "Provide clear, specific direction including expected outcomes and timelines",
      "Maintain ongoing supervision proportional to task complexity and delegate experience",
      "Document delegation decisions, communication, and outcomes",
      "Use the chain of command when an assignment is unsafe",
    ],
    nursingActions: [
      "Perform initial comprehensive patient assessments",
      "Develop and modify the nursing care plan",
      "Administer IV therapy, blood products, and IV push medications",
      "Manage care for unstable, complex, or unpredictable patients",
      "Evaluate patient outcomes and revise interventions as needed",
      "Supervise and evaluate delegated tasks performed by RPNs and UAPs",
    ],
    signs: {
      left: [
        "RN-only tasks: initial assessment and care planning",
        "RN-only tasks: IV push medications and blood product administration",
        "RN-only tasks: care of unstable or unpredictable patients",
        "RN-only tasks: patient and family education for complex conditions",
        "RN-only tasks: evaluation of patient outcomes and care plan revision",
      ],
      right: [
        "Tasks appropriate for UAP: ADLs and hygiene care",
        "Tasks appropriate for UAP: vital signs on stable patients",
        "Tasks appropriate for UAP: ambulation and repositioning",
        "Tasks appropriate for UAP: intake and output measurement",
        "Tasks appropriate for UAP: specimen collection and feeding assistance",
      ],
    },
    medications: [
      {
        name: "Packed Red Blood Cells (pRBCs)",
        type: "Blood product",
        action:
          "Replaces oxygen-carrying capacity in patients with significant blood loss or severe anemia; initiation and monitoring of transfusion is an RN-only responsibility",
        sideEffects:
          "Transfusion reaction (fever, chills, urticaria, dyspnea), fluid overload, hemolytic reaction",
        contra:
          "Patient refusal, known incompatibility, absence of informed consent, no second nurse verification",
        pearl:
          "Blood transfusion initiation and first-15-minute monitoring cannot be delegated to the nurse or UAP; the nurse must remain with the patient during the initial phase",
      },
    ],
    pearls: [
      "The Five Rights of Delegation: right task, right circumstance, right person, right direction, right supervision",
      "The delegator (RN) retains accountability even after delegating a task; the delegate is responsible for their own actions within the delegation",
      "Nursing judgment, initial assessment, care planning, and evaluation of outcomes cannot be delegated",
      "When refusing an unsafe assignment, document the concern, notify the charge nurse, and follow the chain of command",
      "Stable patients with predictable outcomes can be assigned to the RPN; complex or unstable patients require the RN",
      "Always verify the competency of the delegate and the appropriateness of the task before delegating",
    ],
    quiz: [
      {
        question:
          "Which component is NOT one of the Five Rights of Delegation?",
        options: [
          "Right task",
          "Right documentation",
          "Right supervision",
          "Right person",
        ],
        correct: 1,
        rationale:
          "The Five Rights of Delegation are right task, right circumstance, right person, right direction, and right supervision. Right documentation is not one of the five rights, although documentation remains an important nursing responsibility.",
      },
      {
        question:
          "The charge nurse is making patient assignments. Which patient should be assigned to the nurse rather than the RPN?",
        options: [
          "A patient 2 days post-appendectomy with stable vital signs awaiting discharge",
          "A patient receiving scheduled oral medications with no recent status changes",
          "A patient admitted 1 hour ago with new-onset atrial fibrillation and hemodynamic instability",
          "A patient with a chronic wound requiring a routine dressing change",
        ],
        correct: 2,
        rationale:
          "The patient with new-onset atrial fibrillation and hemodynamic instability is unpredictable and requires the broader scope and assessment skills of the RN. The other patients are stable with predictable outcomes appropriate for the RPN.",
      },
      {
        question:
          "The nurse delegates vital sign measurement to a UAP. Which action by the nurse best demonstrates appropriate delegation?",
        options: [
          "Telling the UAP to take vitals and intervene if values are abnormal",
          "Providing specific parameters for reporting and a timeline for completion",
          "Asking the UAP to assess the patient and decide if vitals are needed",
          "Delegating the task verbally without follow-up or supervision",
        ],
        correct: 1,
        rationale:
          "Providing specific parameters for reporting and a timeline addresses the right direction component of delegation. UAPs cannot independently intervene on abnormal findings or make assessment decisions. Follow-up supervision is always required.",
      },
    ],
  },

  "delegation-license-np": {
    title: "Delegation and Interprofessional Authority",
    cellular: {
      title: "Scope, Delegation, and Collaborative Practice",
      content:
        "the clinician operates with an expanded scope that includes prescribing, diagnostic ordering, and procedural authority. NPs delegate to RNs and RPNs through standing orders, medical directives, and protocol-based care frameworks. Practice models vary by jurisdiction, with some allowing independent NP practice and others requiring collaborative agreements with physicians. The clinician must recognize when clinical complexity exceeds their scope and warrants referral to a physician specialist, while also coordinating interprofessional care across respiratory therapy, pharmacy, social work, and dietetics.",
    },
    riskFactors: [
      "Practicing beyond jurisdictional scope without a collaborative agreement when required",
      "Failing to refer to a physician specialist when complexity exceeds NP scope",
      "Issuing medical directives without ensuring delegate competency",
      "Inadequate documentation of standing orders and delegation protocols",
      "Assuming liability for tasks delegated without proper oversight framework",
    ],
    management: [
      "Maintain current knowledge of jurisdictional scope boundaries and collaborative agreement requirements",
      "Establish clear standing orders and medical directives with defined parameters",
      "Verify RN and RPN competency before issuing protocol-based delegation",
      "Coordinate interprofessional referrals and orders across disciplines",
      "Document all prescribing decisions, diagnostic orders, and delegation frameworks",
      "Refer to physician specialists when clinical presentation exceeds NP scope",
    ],
    nursingActions: [
      "Perform advanced comprehensive assessments for complex presentations",
      "Prescribe pharmacological and non-pharmacological interventions",
      "Order and interpret diagnostic tests including laboratory and imaging studies",
      "Develop and implement medical directives for RN and RPN use",
      "Manage chronic disease protocols including vaccination standing orders",
      "Collaborate with interprofessional team members and coordinate referrals",
    ],
    signs: {
      left: [
        "NP interventions: prescribing medications and treatments",
        "NP interventions: ordering and interpreting diagnostics",
        "NP interventions: performing procedures within scope",
        "NP interventions: managing complex clinical presentations",
        "NP interventions: establishing medical directives and standing orders",
      ],
      right: [
        "NP delegation to RN/RPN: protocol-based chronic disease management",
        "NP delegation to RN/RPN: vaccination administration via standing orders",
        "NP delegation to RN/RPN: routine follow-up care per medical directive",
        "Refer to physician: surgical intervention required",
        "Refer to physician: presentation exceeds NP diagnostic or management scope",
      ],
    },
    medications: [
      {
        name: "Amoxicillin",
        type: "Aminopenicillin antibiotic",
        action:
          "Inhibits bacterial cell wall synthesis; commonly prescribed by NPs for community-acquired infections such as otitis media, sinusitis, and urinary tract infections",
        sideEffects:
          "Diarrhea, nausea, rash, allergic reaction including anaphylaxis",
        contra:
          "Known penicillin allergy, history of anaphylaxis to beta-lactam antibiotics",
        pearl:
          "NPs can independently prescribe amoxicillin in most jurisdictions; a standing order may allow the nurse to initiate a first dose per protocol before NP review in urgent care settings",
      },
    ],
    pearls: [
      "NP practice authority varies by jurisdiction: some allow fully independent practice while others require collaborative physician agreements",
      "Standing orders and medical directives allow RNs and RPNs to initiate specific interventions without a direct order for each patient encounter",
      "The clinician retains liability for medical directives and must ensure delegates are competent and the directive parameters are clearly defined",
      "Interprofessional delegation includes ordering from respiratory therapy, pharmacy, social work, and dietetics within the clinician scope",
      "Chronic disease management protocols and vaccination standing orders are common examples of NP-to-RN/RPN task sharing in primary care",
      "When a clinical presentation requires specialist consultation or surgical intervention, the clinician must initiate a referral rather than managing beyond scope",
    ],
    quiz: [
      {
        question:
          "Which action is within the clinician scope but NOT within the Registered Nurse scope?",
        options: [
          "Administering medications per a physician order",
          "Prescribing a new antibiotic for a diagnosed infection",
          "Performing a focused respiratory assessment",
          "Delegating vital sign monitoring to a UAP",
        ],
        correct: 1,
        rationale:
          "Prescribing medications is within the clinician expanded scope of practice but not within the nurse scope. RNs administer medications per orders but do not independently prescribe. Assessment and delegation are shared competencies across nursing roles.",
      },
      {
        question:
          "An NP in a primary care clinic creates a medical directive allowing RNs to administer influenza vaccines to eligible patients. Which element is essential for this directive to be valid?",
        options: [
          "The nurse must contact the clinician before each individual vaccine administration",
          "The directive must include patient eligibility criteria, contraindications, and required documentation",
          "Only RPNs may carry out medical directives, not RNs",
          "The directive eliminates NP liability once signed",
        ],
        correct: 1,
        rationale:
          "A valid medical directive must include clear eligibility criteria, contraindications, dosing parameters, and documentation requirements. The clinician retains liability, the directive applies to both RNs and RPNs with competency, and individual contact before each administration is not required when a proper directive is in place.",
      },
      {
        question:
          "The clinician is managing a patient whose symptoms suggest a condition requiring surgical evaluation. What is the appropriate NP action?",
        options: [
          "Independently manage the condition with advanced pharmacotherapy",
          "Delegate the assessment to the nurse for further evaluation",
          "Initiate a referral to the appropriate physician specialist",
          "Discharge the patient with instructions to return if symptoms worsen",
        ],
        correct: 2,
        rationale:
          "When a clinical presentation requires surgical intervention or exceeds the clinician scope of independent management, the appropriate action is to refer to a physician specialist. Continuing to manage beyond scope, delegating the assessment, or discharging without referral would be inappropriate.",
      },
    ],
  },
};
