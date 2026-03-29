import type { LessonContent } from "./types";

export const legalEdgeCasesLessons: Record<string, LessonContent> = {
  "legal-edge-rpn": {
    title: "Legal and Regulatory Foundations",
    cellular: {
      title: "Legal Foundations for Practical Nursing",
      content:
        "Registered Practical Nurses (RPNs) operate within a defined scope of practice governed by provincial or state regulatory bodies. Understanding delegation authority is critical: RPNs must verify that any task delegated by an RN falls within their competence and scope before accepting it. Informed consent, mandatory reporting obligations, documentation standards, and confidentiality requirements form the legal backbone of safe practical nursing. Violations such as practicing outside scope, falsifying records, or breaching patient privacy on social media constitute professional misconduct and carry serious regulatory consequences including license suspension or revocation.",
    },
    riskFactors: [
      "Accepting delegated tasks beyond scope of practice",
      "Failing to verify informed consent before procedures",
      "Not recognizing signs of patient incapacity",
      "Incomplete or late documentation without proper correction procedures",
      "Posting patient information on social media platforms",
      "Failing to report suspected abuse or communicable disease",
    ],
    diagnostics: [
      "Assess patient capacity to provide informed consent: can the patient understand the information, appreciate how it applies to them, reason about options, and communicate a decision?",
      "Verify the presence of a valid informed consent form signed by the patient or substitute decision-maker before assisting with any invasive procedure",
      "Screen for indicators of potential abuse: unexplained injuries, inconsistent explanations, withdrawal, fear of caregiver, neglect of hygiene or nutrition",
      "Review documentation for completeness and legal defensibility: are entries factual, objective, timely, and free of subjective opinions or blame?",
      "Assess for situations requiring mandatory reporting: suspected child abuse, elder abuse, neglect, communicable disease, or fitness-to-drive concerns",
      "Evaluate whether a delegated task falls within RPN scope by consulting the regulatory body's practice standards and authorized acts",
    ],
    management: [
      "Obtain and document informed consent through the appropriate provider; the nurse may witness the signature but does not obtain consent for procedures requiring physician explanation",
      "Report suspected abuse immediately to the appropriate authorities as mandated by law; do not investigate independently",
      "Follow proper chain of command when reporting safety concerns: charge nurse, unit manager, regulatory body if internal reporting fails",
      "Apply advance directive instructions as documented: do-not-resuscitate orders, power of attorney for personal care, living wills",
      "Document incidents using factual, objective language in an incident report separate from the patient chart",
      "Maintain professional boundaries at all times including avoidance of dual relationships, gift acceptance, and social media contact with patients",
    ],
    nursingActions: [
      "Verify delegation authority before accepting any task from an RN",
      "Confirm informed consent is documented before assisting with procedures",
      "Report suspected child abuse, elder abuse, or communicable disease immediately",
      "Document factually, objectively, and in a timely manner",
      "Use proper late entry and error correction procedures in charting",
      "Maintain patient confidentiality in all settings including online",
      "Refuse tasks that fall outside RPN scope of practice",
    ],
    signs: {
      left: [
        "Patient unable to verbalize understanding of procedure",
        "Patient expressing confusion about treatment decisions",
        "Unexplained bruising or injuries suggesting abuse",
        "Patient withdrawing or showing fear around caregivers",
        "Inconsistent explanations for injuries from family members",
      ],
      right: [
        "Delegated task exceeds RPN competency or scope",
        "Missing or incomplete consent documentation",
        "Evidence of record falsification or alteration",
        "Patient information shared on social media platforms",
        "Failure to follow mandatory reporting timelines",
      ],
    },
    medications: [
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action:
          "Reverses opioid overdose by competitive antagonism at opioid receptors; RPNs may administer under standing orders or delegation in emergency situations",
        sideEffects:
          "Opioid withdrawal symptoms, tachycardia, hypertension, nausea, vomiting",
        contra:
          "Hypersensitivity to naloxone; use cautiously in patients physically dependent on opioids",
        pearl:
          "RPNs must understand their authority to administer naloxone under emergency protocols and document the administration, patient response, and delegation authority clearly",
      },
    ],
    pearls: [
      "An RPN cannot independently accept orders from a physician; tasks must be delegated through an RN or authorized by standing orders within scope",
      "Informed consent is the responsibility of the provider performing the procedure; the nursing role is to verify consent is documented, not to obtain it",
      "Mandatory reporting obligations override patient confidentiality; failure to report suspected abuse is a legal offense",
      "Late entries in documentation must be clearly labeled with the current date, time, and a reference to the original event date and time",
      "PHIPA (Canada) and HIPAA (US) protect personal health information; even discussing patient details in public areas constitutes a breach",
      "Social media posts that include any identifiable patient information, even without naming the patient, can result in professional misconduct charges",
    ],
    quiz: [
      {
        question:
          "An RN delegates medication administration to an RPN. The nurse has not been trained on this specific medication. What is the most appropriate action?",
        options: [
          "Administer the medication and research it afterward",
          "Decline the delegation and explain the lack of training",
          "Ask another RPN to administer the medication instead",
          "Contact the physician to verify the order first",
        ],
        correct: 1,
        rationale:
          "RPNs must only accept delegated tasks within their competence. Declining delegation when untrained protects both the patient and the nurse from harm and liability.",
      },
      {
        question:
          "An RPN notices unexplained bruising on an elderly patient during morning care. The patient states they fell but appears fearful. What is the priority action?",
        options: [
          "Document the findings and continue with care",
          "Confront the family about the suspected abuse",
          "Report suspected elder abuse to the appropriate authority",
          "Wait to see if the pattern continues before reporting",
        ],
        correct: 2,
        rationale:
          "Mandatory reporting of suspected elder abuse is a legal obligation. RPNs must report to the designated authority immediately upon suspicion; waiting or investigating independently is not appropriate.",
      },
      {
        question:
          "An RPN discovers a charting error from the previous shift. What is the correct procedure for correcting the error?",
        options: [
          "Use correction fluid to cover the error and rewrite the entry",
          "Draw a single line through the error, initial, date, and write the correct entry",
          "Remove the page from the chart and rewrite the entire entry",
          "Leave the error and add a note at the end of the chart",
        ],
        correct: 1,
        rationale:
          "Proper error correction in documentation requires drawing a single line through the incorrect entry so it remains legible, then initialing, dating, and writing the corrected information. Obliterating entries suggests falsification.",
      },
    ],
  },

  "legal-edge-rn": {
    title: "Legal and Ethical Edge Cases",
    cellular: {
      title: "Complex Legal",
      content:
        "Registered Nurses frequently encounter legal and ethical dilemmas that require nuanced clinical judgment and thorough understanding of patient rights, consent law, and end-of-life regulations. Key areas include managing treatment refusal based on religious beliefs, navigating consent issues with minors, understanding Medical Assistance in Dying (MAiD) legislation in Canada, and resolving end-of-life disputes among family members. Capacity assessment, substitute decision-maker hierarchies, guardianship law, and restraint regulations are heavily tested on RN licensing examinations. The nurse must balance patient autonomy, beneficence, and legal compliance while maintaining meticulous documentation of all decisions and communications.",
    },
    riskFactors: [
      "Patient refusing life-saving treatment on religious grounds",
      "Unclear capacity status in fluctuating clinical conditions",
      "Family disagreements about end-of-life care decisions",
      "Conflicts between advance directives and substitute decision-maker wishes",
      "Restraint use without proper orders or documentation",
      "Minor presenting for treatment without parental consent",
      "MAiD requests requiring conscientious objection navigation",
    ],
    management: [
      "Document refusal of treatment thoroughly including patient rationale and alternatives discussed",
      "Involve ethics committee for unresolved end-of-life disputes",
      "Follow hierarchy of substitute decision-makers when patient lacks capacity",
      "Apply least restrictive principle for all restraint decisions",
      "Ensure two-physician capacity assessment for contested situations",
      "Provide emergency treatment to minors regardless of consent status when life-threatening",
      "Facilitate effective referral when exercising conscientious objection to MAiD",
    ],
    signs: {
      left: [
        "Patient clearly states refusal of blood products citing religious beliefs",
        "Minor presenting alone requesting reproductive health services",
        "Patient with fluctuating level of consciousness and questionable capacity",
        "Family members disagreeing about withdrawal of life support",
        "Patient requesting information about Medical Assistance in Dying",
      ],
      right: [
        "Restraint applied without time-limited order or continuous monitoring",
        "Advance directive conflicting with substitute decision-maker instructions",
        "Court-appointed guardian overriding patient expressed wishes",
        "No documentation of capacity assessment before obtaining consent",
        "Nurse refusing MAiD participation without facilitating referral",
      ],
    },
    medications: [
      {
        name: "Midazolam",
        type: "Benzodiazepine / Sedative",
        action:
          "Short-acting benzodiazepine used for palliative sedation in end-of-life care; produces anxiolysis and sedation through GABA-A receptor modulation",
        sideEffects:
          "Respiratory depression, hypotension, paradoxical agitation, oversedation",
        contra:
          "Acute narrow-angle glaucoma, severe respiratory depression without ventilatory support, hypersensitivity to benzodiazepines",
        pearl:
          "In palliative sedation, midazolam use must be clearly documented with intent to relieve refractory symptoms, not to hasten death; this distinction is legally critical and differentiates palliative care from euthanasia",
      },
    ],
    pearls: [
      "A competent adult has the absolute right to refuse any treatment including life-saving blood transfusions; the nurse must document the refusal, alternatives discussed, and that the patient understands the consequences",
      "The mature minor doctrine allows minors who demonstrate sufficient understanding to consent to treatment independently; age alone does not determine capacity",
      "In emergencies, treatment of a minor can proceed without parental consent under the emergency doctrine when delay would risk serious harm or death",
      "MAiD in Canada requires the patient to have a grievous and irremediable medical condition; nurses may exercise conscientious objection but must provide an effective referral",
      "Substitute decision-makers must make decisions based on the patient's previously expressed wishes; if no wishes are known, the best interest standard applies",
      "Restraints require a time-limited order, continuous monitoring, regular reassessment, and documentation of less restrictive alternatives attempted first",
      "Fluctuating capacity does not mean permanent incapacity; patients should be assessed during their most lucid periods when possible",
    ],
    quiz: [
      {
        question:
          "A patient who is a Jehovah's Witness refuses a blood transfusion despite life-threatening hemorrhage. The patient is alert and oriented. What is the nurse's most appropriate action?",
        options: [
          "Administer the transfusion because it is a life-threatening emergency",
          "Contact the family to override the patient's decision",
          "Respect the refusal, document thoroughly, and explore alternative treatments",
          "Obtain a court order to administer the blood products",
        ],
        correct: 2,
        rationale:
          "A competent adult has the legal right to refuse any treatment, including life-saving interventions. The nurse must respect this decision, document the refusal and discussion of consequences, and collaborate with the team on alternative treatments.",
      },
      {
        question:
          "A 15-year-old presents to the emergency department with acute appendicitis. Parents cannot be reached. What is the appropriate course of action?",
        options: [
          "Wait until parental consent is obtained before proceeding",
          "Proceed with emergency treatment under the emergency doctrine",
          "Have the minor sign their own consent form",
          "Transfer the patient to a facility that can locate the parents",
        ],
        correct: 1,
        rationale:
          "The emergency doctrine permits treatment of a minor without parental consent when delay would result in serious harm or death. Acute appendicitis with risk of rupture constitutes a medical emergency.",
      },
      {
        question:
          "A nurse has a conscientious objection to participating in Medical Assistance in Dying (MAiD). What is the nurse's legal obligation?",
        options: [
          "The nurse must participate regardless of personal beliefs",
          "The nurse may refuse and has no further obligation",
          "The nurse may refuse but must provide an effective referral to another provider",
          "The nurse must obtain a formal exemption from the regulatory body before refusing",
        ],
        correct: 2,
        rationale:
          "Nurses may exercise conscientious objection to MAiD but have a legal and ethical obligation to provide an effective referral so that the patient's access to the service is not impeded.",
      },
      {
        question:
          "A patient with dementia has periods of lucidity. The family wants to make all healthcare decisions. The patient has a valid advance directive. What takes priority?",
        options: [
          "Family wishes because the patient has dementia",
          "The attending physician's clinical judgment",
          "The patient's advance directive and expressed wishes during lucid periods",
          "The hospital ethics committee recommendation",
        ],
        correct: 2,
        rationale:
          "A valid advance directive reflects the patient's autonomous wishes and takes priority. During lucid periods, the patient may also have capacity to make current decisions. Family cannot override a patient's own documented wishes.",
      },
    ],
  },

  "legal-edge-np": {
    title: "Advanced Legal and Regulatory Practice",
    cellular: {
      title: "Advanced Legal Frameworks Practice",
      content:
        "Nurse Practitioners function as independent or semi-independent practitioners depending on jurisdiction, carrying expanded legal responsibilities including prescriptive authority, diagnostic decision-making, and direct accountability for clinical outcomes. NPs must navigate complex regulatory frameworks including controlled substance prescribing regulations, conflict of interest management with pharmaceutical companies, and advanced capacity assessment with medicolegal documentation. Professional liability and malpractice law apply directly to NPs under the same standard of care framework as physicians, requiring proof of duty, breach, causation, and damages. Billing and coding ethics, expert witness obligations, and mandatory reporting duties as independent practitioners add layers of legal complexity that differ significantly from RN-level practice.",
    },
    riskFactors: [
      "Prescribing controlled substances without checking PDMP database",
      "Practicing beyond jurisdictional scope boundaries",
      "Accepting pharmaceutical gifts that create conflicts of interest",
      "Inadequate documentation of capacity assessments",
      "Upcoding or unbundling for higher reimbursement",
      "Failing to meet mandatory reporting obligations as independent practitioner",
      "Insufficient documentation to support medical necessity of treatments",
    ],
    management: [
      "Verify scope of practice boundaries for each jurisdiction of practice",
      "Check Prescription Drug Monitoring Program before every controlled substance prescription",
      "Disclose all pharmaceutical relationships and financial conflicts of interest",
      "Use validated capacity assessment tools with thorough documentation",
      "Bill and code accurately with documentation supporting medical necessity",
      "Maintain professional liability insurance adequate for independent practice",
      "Report suspected abuse, neglect, and communicable disease as mandated reporter",
      "Follow opioid prescribing guidelines including dose limits and monitoring requirements",
    ],
    diagnostics: [
      "Prescription Drug Monitoring Program (PDMP) database check",
      "Validated capacity assessment tools (Mini-Mental State Examination, Montreal Cognitive Assessment)",
      "Urine drug screening for controlled substance monitoring",
      "Clinical documentation audit for billing compliance",
      "Conflict of interest disclosure review",
    ],
    signs: {
      left: [
        "Patient presenting with requests for escalating opioid doses",
        "Multiple prescribers identified on PDMP report",
        "Patient unable to demonstrate understanding during capacity assessment",
        "Clinical documentation insufficient to support billed services",
        "Pharmaceutical representative offering financial incentives",
      ],
      right: [
        "NP prescribing outside jurisdictional authority",
        "PDMP check not performed before controlled substance prescription",
        "Capacity assessment not documented with validated tools",
        "Self-referral to facility with personal financial interest",
        "Expert testimony provided outside area of clinical competence",
      ],
    },
    medications: [
      {
        name: "Hydromorphone (Dilaudid)",
        type: "Opioid Analgesic (Schedule II Controlled Substance)",
        action:
          "Potent mu-opioid receptor agonist used for moderate to severe pain; NPs must follow strict prescribing regulations including PDMP checks, quantity limits, and monitoring protocols",
        sideEffects:
          "Respiratory depression, constipation, sedation, nausea, physical dependence, tolerance development",
        contra:
          "Severe respiratory depression, acute or severe bronchial asthma without monitoring, known hypersensitivity, concurrent use of MAO inhibitors within 14 days",
        pearl:
          "NPs must check the PDMP before every controlled substance prescription, document medical necessity, establish a pain management agreement, and follow jurisdictional opioid prescribing limits to avoid regulatory action and potential criminal liability",
      },
    ],
    pearls: [
      "NP scope of practice varies significantly by jurisdiction; some allow fully independent practice while others require collaborative agreements with physicians",
      "Malpractice liability for NPs follows the same four elements as physician liability: duty, breach of duty, causation, and damages",
      "PDMP checking is legally mandated in most jurisdictions before prescribing controlled substances; failure to check can constitute negligence",
      "Conflict of interest management requires disclosure of all pharmaceutical relationships; accepting gifts above nominal value may violate anti-kickback statutes",
      "Upcoding (billing for a higher-complexity visit than performed) and unbundling (separately billing components that should be billed together) are forms of healthcare fraud",
      "When serving as an expert witness, the clinician has a duty to provide objective, unbiased testimony based on the standard of care, regardless of which party retained them",
      "As independent practitioners, NPs carry their own mandatory reporting obligations and cannot defer reporting responsibility to a supervising physician",
    ],
    quiz: [
      {
        question:
          "An NP is prescribing oxycodone for a new patient with chronic pain. The PDMP check reveals the patient has active prescriptions from three other providers. What is the most appropriate action?",
        options: [
          "Prescribe the medication as requested since the patient reports adequate pain control",
          "Refuse to prescribe and dismiss the patient from the practice",
          "Discuss the PDMP findings with the patient and coordinate care with the other prescribers before prescribing",
          "Report the patient to law enforcement for suspected drug diversion",
        ],
        correct: 2,
        rationale:
          "Multiple prescribers on a PDMP report require investigation and care coordination. The clinician should discuss findings with the patient, contact other prescribers, and develop a coordinated pain management plan before making prescribing decisions.",
      },
      {
        question:
          "A pharmaceutical representative offers an NP an all-expenses-paid conference trip in exchange for prescribing their new medication. What is the appropriate response?",
        options: [
          "Accept the trip as it provides continuing education opportunity",
          "Accept the trip but disclose it to the practice administrator",
          "Decline the offer as it constitutes a conflict of interest that may violate anti-kickback regulations",
          "Accept the trip but prescribe the medication only if clinically indicated",
        ],
        correct: 2,
        rationale:
          "Accepting gifts of significant value from pharmaceutical companies creates conflicts of interest and may violate federal anti-kickback statutes. NPs must decline such offers to maintain professional integrity and legal compliance.",
      },
      {
        question:
          "An NP documents a Level 4 office visit but the clinical documentation supports only a Level 2 complexity. This practice is known as:",
        options: [
          "Unbundling",
          "Upcoding",
          "Medical necessity documentation",
          "Defensive charting",
        ],
        correct: 1,
        rationale:
          "Upcoding is billing for a higher level of service than what was documented or performed. It constitutes healthcare fraud and can result in fines, exclusion from insurance programs, and criminal prosecution.",
      },
    ],
  },
};
