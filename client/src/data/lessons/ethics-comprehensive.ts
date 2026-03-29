import type { LessonContent } from "./types";

export const ethicsComprehensiveLessons: Record<string, LessonContent> = {
  "ethics-rpn-comprehensive": {
    title: "Ethics: Foundations of Ethical Nursing",
    cellular: {
      title: "Core Ethical Principles",
      content:
        "Ethical nursing practice for RPNs is grounded in six core principles: autonomy (respecting patient self-determination), beneficence (acting in the patient's best interest), nonmaleficence (do no harm), justice (fair and equitable treatment), fidelity (keeping promises and commitments), and veracity (truthfulness in all interactions). RPNs must maintain professional boundaries by establishing therapeutic relationships while avoiding dual relationships that could compromise objectivity or create conflicts of interest. Confidentiality and privacy are legally protected under frameworks such as PHIPA in Ontario and HIPAA in the United States, requiring RPNs to safeguard all personal health information. RPNs are expected to practice within their defined scope, advocate for patient safety, recognize when to escalate ethical concerns to the appropriate authority, and report unsafe practice or suspected abuse as mandated by law.",
    },
    riskFactors: [
      "Blurring of professional boundaries due to familiarity with patients in community or long-term care settings",
      "Sharing patient information on social media platforms or with unauthorized individuals",
      "Failure to recognize capacity limitations in patients who appear cooperative",
      "Not escalating concerns about unsafe staffing or workload to management",
      "Accepting gifts or forming personal relationships with patients or families",
    ],
    management: [
      "Apply the six core ethical principles when faced with clinical dilemmas",
      "Maintain clear professional boundaries and avoid dual relationships",
      "Follow institutional policy for reporting unsafe practice or suspected abuse",
      "Protect patient confidentiality by limiting information sharing to authorized personnel only",
      "Seek guidance from a supervisor or ethics committee when facing complex ethical situations",
    ],
    nursingActions: [
      "Assess patient capacity for informed consent before any procedure",
      "Document patient refusal of treatment and ensure the patient understands the consequences",
      "Advocate for patients who cannot advocate for themselves, including those with cognitive impairment",
      "Report suspected abuse of vulnerable populations as required by law",
      "Practice cultural safety by respecting diverse beliefs and values in care delivery",
    ],
    signs: {
      left: [
        "Patient expresses desire to refuse treatment (autonomy)",
        "Patient lacks understanding of proposed intervention (informed consent gap)",
        "Colleague engages in practice outside scope (unsafe practice indicator)",
        "Patient discloses abuse or neglect (mandatory reporting trigger)",
      ],
      right: [
        "Therapeutic relationship maintained with clear boundaries (ethical standard met)",
        "Patient information shared only with authorized care team (confidentiality upheld)",
        "Cultural preferences integrated into care plan (cultural safety demonstrated)",
        "Substitute decision-maker identified when patient lacks capacity (legal compliance)",
      ],
    },
    medications: [
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action:
          "Provides a structured approach to resolving ethical dilemmas by identifying stakeholders, evaluating options against ethical principles, and selecting the action that best balances competing interests",
        sideEffects:
          "Moral distress may occur when the ethically correct action conflicts with institutional policy or resource limitations",
        contra:
          "Should not be used to override patient autonomy without legal justification such as court order or emergency exception",
        pearl:
          "When in doubt, always prioritize patient safety and document your rationale for the chosen course of action",
      },
    ],
    pearls: [
      "Confidentiality is not absolute: mandatory reporting obligations for abuse, neglect, and certain communicable diseases override confidentiality",
      "A patient's right to refuse treatment must be respected even when the healthcare team disagrees, provided the patient has capacity",
      "Practicing within scope of practice is both an ethical and legal obligation; exceeding scope places the patient and the nurse at risk",
      "Social media posts that identify patients, even indirectly, constitute a breach of confidentiality and may result in disciplinary action",
      "Cultural safety goes beyond cultural awareness; it requires the nurse to reflect on power imbalances and their own biases",
    ],
    quiz: [
      {
        question:
          "A patient with decision-making capacity refuses a blood transfusion based on religious beliefs. What is the most appropriate nursing action?",
        options: [
          "Administer the transfusion because it is medically necessary",
          "Respect the patient's decision and document the refusal",
          "Contact the patient's family to override the decision",
          "Request a court order to proceed with treatment",
        ],
        correct: 1,
        rationale:
          "Autonomy is a fundamental ethical principle. A competent patient has the right to refuse any treatment, including life-sustaining interventions. The nurse must respect this decision and thoroughly document the refusal and the patient's understanding of consequences.",
      },
      {
        question:
          "An RPN discovers that a colleague has been documenting vital signs without actually measuring them. What should the nurse do first?",
        options: [
          "Confront the colleague privately and give them a warning",
          "Ignore it because it is not the RPN's responsibility",
          "Report the concern to the nurse manager or supervisor",
          "Begin measuring the patient's vital signs without saying anything",
        ],
        correct: 2,
        rationale:
          "Documentation integrity is essential for patient safety. Falsifying records is a serious professional misconduct issue. The nurse has an ethical and professional duty to report unsafe practice through proper channels, beginning with the nurse manager or supervisor.",
      },
      {
        question:
          "Which ethical principle is the nurse upholding when advocating for equitable access to pain medication for all patients regardless of background?",
        options: [
          "Autonomy",
          "Fidelity",
          "Justice",
          "Veracity",
        ],
        correct: 2,
        rationale:
          "Justice requires fair and equitable distribution of healthcare resources. Advocating for equal access to pain management regardless of a patient's socioeconomic status, ethnicity, or other characteristics is a direct application of the principle of justice.",
      },
    ],
  },

  "ethics-rn-comprehensive": {
    title: "Ethics: Advanced Ethical Practice",
    cellular: {
      title: "Ethical Frameworks",
      content:
        "Registered nurses apply the principlism framework (autonomy, beneficence, nonmaleficence, justice) to guide clinical decision-making in complex ethical situations. Moral distress arises when nurses know the ethically correct action but face institutional or systemic barriers to carrying it out, and recognizing this distress is critical for maintaining professional well-being. Informed consent requires verification that the patient understands the proposed treatment, has decision-making capacity, and consents voluntarily without coercion; emergency exceptions apply only when delay would result in serious harm and consent cannot be obtained. RNs hold professional accountability for delegation decisions, documentation integrity, incident reporting, and the obligation to refuse unsafe assignments when patient safety is at risk. Mandatory reporting obligations extend to child abuse, elder abuse, communicable diseases, and impaired colleagues, overriding confidentiality when required by law.",
    },
    riskFactors: [
      "Moral distress leading to burnout when institutional barriers prevent ethical care",
      "Inadequate informed consent processes that fail to verify patient understanding",
      "Delegation of tasks beyond the competency of the delegatee",
      "Failure to recognize signs of abuse in vulnerable populations",
      "Implicit bias affecting clinical decision-making and equitable care delivery",
    ],
    diagnostics: [
      "Capacity assessment using standardized tools to determine decision-making ability",
      "Review of advance directives and power of attorney documentation",
      "Ethics committee consultation for unresolved ethical dilemmas",
      "Incident report analysis to identify patterns of unsafe practice",
      "Assessment of patient understanding using teach-back method during informed consent",
    ],
    management: [
      "Apply ethical decision-making models (identify the dilemma, gather facts, consider principles, evaluate options, act, reflect)",
      "Verify informed consent is obtained by the responsible provider and documented appropriately",
      "Implement least restrictive interventions before considering restraints or seclusion",
      "Advocate for advance care planning discussions with patients and families",
      "Utilize ethics committees and institutional resources for complex dilemmas",
    ],
    nursingActions: [
      "Verify the patient's understanding of the procedure before witnessing informed consent",
      "Assess and document decision-making capacity when there is reason to question it",
      "Refuse unsafe assignments through proper channels and document the refusal",
      "File incident reports for medication errors, falls, and near-misses without fear of retaliation",
      "Initiate mandatory reporting when abuse or neglect is suspected",
      "Apply the least restrictive principle when managing patient behavior",
    ],
    signs: {
      left: [
        "Patient unable to demonstrate understanding of treatment plan (capacity concern)",
        "Unexplained bruising or injuries on vulnerable patient (abuse indicator)",
        "Nurse-to-patient ratio exceeds safe staffing levels (unsafe assignment)",
        "Patient or family requests withdrawal of life-sustaining treatment (end-of-life decision)",
      ],
      right: [
        "Advance directives reviewed and honored in care plan (patient autonomy upheld)",
        "Restraints applied only after all alternatives exhausted and documented (least restrictive principle met)",
        "Ethics committee consulted for complex dilemma resolution (institutional support utilized)",
        "Delegation decisions based on verified competency of delegatee (accountability maintained)",
      ],
    },
    medications: [
      {
        name: "Haloperidol (Chemical Restraint Consideration)",
        type: "Antipsychotic",
        action:
          "Blocks dopamine D2 receptors in the brain to reduce agitation and psychotic symptoms; used as a last resort for acute behavioral emergencies when physical safety interventions are insufficient",
        sideEffects:
          "Extrapyramidal symptoms, QT prolongation, sedation, neuroleptic malignant syndrome",
        contra:
          "Contraindicated in patients with Parkinson disease, severe CNS depression, or known QT prolongation; use requires careful ethical justification and documentation",
        pearl:
          "Chemical restraint use requires the same ethical scrutiny as physical restraints: least restrictive principle applies, a provider order is required, and continuous monitoring with frequent reassessment must be documented",
      },
    ],
    pearls: [
      "Informed consent is the provider's responsibility to obtain, but the nurse must verify patient understanding and advocate if the patient appears confused or coerced",
      "A DNR order means do not attempt resuscitation; it does not mean withhold all treatment or comfort care measures",
      "The best interest standard guides substitute decision-makers when the patient's wishes are unknown; it is different from the substituted judgment standard used when prior wishes were expressed",
      "Mandatory reporting is a legal obligation that overrides confidentiality; failure to report suspected abuse can result in criminal charges and license revocation",
      "Refusing an unsafe assignment is a professional right and obligation; the nurse must document the refusal and follow institutional policy to ensure patient coverage",
      "Restraint documentation must include the clinical justification, alternatives attempted, type of restraint, time applied, and ongoing reassessment at required intervals",
    ],
    quiz: [
      {
        question:
          "A nurse suspects that an elderly patient is being financially exploited by a family member. The patient asks the nurse not to tell anyone. What is the most appropriate action?",
        options: [
          "Respect the patient's wishes and maintain confidentiality",
          "Report the suspected abuse to the appropriate authorities as required by law",
          "Discuss the situation with the family member to clarify the concern",
          "Wait for additional evidence before taking any action",
        ],
        correct: 1,
        rationale:
          "Mandatory reporting of suspected elder abuse is a legal obligation that overrides patient confidentiality. The nurse must report to the appropriate authorities regardless of the patient's request. Delaying a report or confronting the suspected abuser may place the patient at further risk.",
      },
      {
        question:
          "A patient with a valid advance directive indicating DNR status is admitted for pneumonia. The patient develops respiratory failure. What should the nurse do?",
        options: [
          "Initiate CPR because the current admission is for a treatable condition",
          "Contact the family to confirm the DNR order is still valid",
          "Honor the DNR order and provide comfort measures",
          "Override the DNR because the patient did not specifically refuse treatment for pneumonia",
        ],
        correct: 2,
        rationale:
          "A valid DNR order must be honored regardless of the admitting diagnosis. The DNR applies to cardiopulmonary resuscitation efforts. The nurse should provide comfort measures and continue to treat the underlying condition as appropriate, but should not initiate CPR. DNR does not mean do not treat.",
      },
      {
        question:
          "An RN is assigned 10 patients on a medical-surgical unit, exceeding the recommended safe ratio. After raising the concern with the charge nurse and receiving no resolution, what should the nurse do?",
        options: [
          "Refuse the assignment and leave the unit immediately",
          "Accept the assignment without objection to avoid conflict",
          "Document the concern in writing, notify the supervisor, and provide care while continuing to advocate",
          "Transfer patients to other units without an order",
        ],
        correct: 2,
        rationale:
          "The nurse should never abandon patients. When an assignment is unsafe, the nurse must document the concern, escalate through the chain of command, and continue to provide care. Leaving patients without care constitutes patient abandonment and is a serious professional and legal violation.",
      },
    ],
  },

  "ethics-np-comprehensive": {
    title: "Ethics: Advanced Ethical Frameworks",
    cellular: {
      title: "Ethical Frameworks and Autonomous Practice",
      content:
        "Nurse practitioners operate within advanced ethical frameworks including principle-based ethics (principlism), care ethics (emphasizing relationships and context), virtue ethics (character-driven moral reasoning), and public health ethics (balancing individual rights with population-level outcomes). Autonomy assessment at the advanced practice level involves formal capacity evaluation using standardized instruments, supporting informed refusal through shared decision-making and comprehensive risk-benefit counseling, and recognizing that capacity is decision-specific and may fluctuate. Prescribing ethics requires controlled substance stewardship with particular attention to opioid risk management strategies, addressing polypharmacy through systematic deprescribing, and maintaining transparency about pharmaceutical relationships and conflicts of interest. End-of-life ethics for NPs includes facilitating goals-of-care conversations, advance care planning, understanding jurisdictional regulations around medical assistance in dying, and navigating the withdrawal of artificial nutrition and hydration with ethical rigor and family engagement.",
    },
    riskFactors: [
      "Conflict of interest from pharmaceutical industry relationships affecting prescribing decisions",
      "Inadequate capacity assessment leading to invalid informed consent",
      "Polypharmacy-related harm from failure to systematically review and deprescribe unnecessary medications",
      "Implicit bias affecting diagnostic reasoning and treatment recommendations",
      "Scope of practice violations when collaborative practice agreements are unclear or outdated",
    ],
    diagnostics: [
      "Formal capacity assessment using instruments such as the Aid to Capacity Evaluation (ACE) or Mini-Mental State Examination (MMSE) in context",
      "Prescription drug monitoring program (PDMP) review before prescribing controlled substances",
      "Comprehensive medication reconciliation to identify polypharmacy and deprescribing opportunities",
      "Ethics committee referral for complex cases involving withdrawal of treatment or MAiD requests",
      "Conflict of interest disclosure review for clinical trial participation or industry-sponsored education",
    ],
    management: [
      "Apply multiple ethical frameworks (principlism, care ethics, virtue ethics) to complex clinical decisions",
      "Conduct formal capacity assessments and document findings using standardized tools",
      "Implement opioid risk mitigation strategies including screening tools, treatment agreements, and naloxone co-prescribing",
      "Facilitate advance care planning discussions and document patient goals of care",
      "Engage in systematic deprescribing using evidence-based protocols for each medication class",
      "Maintain financial transparency by disclosing conflicts of interest to patients and institutions",
    ],
    nursingActions: [
      "Perform and document formal capacity assessments for patients with questionable decision-making ability",
      "Review PDMP data before each controlled substance prescription and document review",
      "Initiate goals-of-care conversations with patients and families facing serious illness",
      "Disclose conflicts of interest to patients when recommending treatments associated with industry relationships",
      "Collaborate with ethics committees and legal counsel for complex end-of-life decisions",
      "Report suspected abuse, impaired colleagues, and unsafe practice as legally mandated",
    ],
    signs: {
      left: [
        "Patient unable to articulate understanding of treatment risks and alternatives (capacity concern)",
        "Multiple prescribers identified on PDMP report (controlled substance risk indicator)",
        "Patient or family requests information about medical assistance in dying (end-of-life ethics trigger)",
        "Systemic barriers preventing equitable access to care for marginalized populations (justice concern)",
      ],
      right: [
        "Formal capacity assessment completed and documented with standardized tool (ethical compliance)",
        "Opioid risk mitigation plan in place with treatment agreement and naloxone prescription (prescribing stewardship)",
        "Goals-of-care discussion documented with patient preferences clearly stated (advance care planning)",
        "Cultural humility demonstrated through patient-centered care that addresses systemic bias (equity-informed practice)",
      ],
    },
    medications: [
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action:
          "Competitively binds to opioid receptors to reverse the effects of opioid overdose including respiratory depression, sedation, and hypotension",
        sideEffects:
          "Acute opioid withdrawal symptoms (agitation, nausea, vomiting, tachycardia, diaphoresis), potential for re-sedation if the opioid has a longer half-life than naloxone",
        contra:
          "Use with caution in patients with known cardiovascular disease as acute withdrawal may precipitate cardiovascular events; no absolute contraindications in life-threatening overdose",
        pearl:
          "Co-prescribing naloxone with opioid prescriptions is an ethical and evidence-based harm reduction strategy; NPs who prescribe opioids should routinely provide naloxone kits and education to patients and caregivers",
      },
    ],
    pearls: [
      "Capacity is decision-specific: a patient may have capacity to consent to a simple blood draw but lack capacity for complex surgical decisions",
      "Shared decision-making is the gold standard for autonomous NP practice; it requires presenting evidence-based options, eliciting patient values, and collaboratively selecting a plan",
      "Deprescribing is an ethical obligation when medication burden outweighs benefit; use evidence-based deprescribing guidelines and taper medications gradually",
      "Medical assistance in dying (MAiD) regulations vary by jurisdiction; NPs must understand local laws and their professional obligations regarding eligibility assessments and referrals",
      "Public health ethics may require balancing individual autonomy against community safety, such as during quarantine orders or vaccination mandates during outbreaks",
      "Documentation standards for NPs carry both ethical and legal weight; incomplete or inaccurate documentation can constitute professional misconduct",
    ],
    quiz: [
      {
        question:
          "An NP is conducting a capacity assessment for an elderly patient who wants to refuse dialysis. The patient can state the diagnosis but cannot explain the consequences of refusing treatment. What is the most appropriate next step?",
        options: [
          "Proceed with dialysis because the patient clearly lacks full capacity",
          "Provide additional education in an appropriate format and reassess capacity",
          "Contact the substitute decision-maker to consent on behalf of the patient",
          "Document that the patient has capacity because they stated their diagnosis correctly",
        ],
        correct: 1,
        rationale:
          "Capacity assessment requires that the patient can understand the relevant information, appreciate how it applies to their situation, reason about the options, and communicate a choice. If one element is missing, the clinician should attempt to support the patient's capacity through education and reassessment before concluding that the patient lacks capacity.",
      },
      {
        question:
          "An NP reviews the PDMP and discovers that a patient with chronic pain is receiving opioid prescriptions from three different providers. What is the most appropriate action?",
        options: [
          "Immediately discontinue the opioid prescription and discharge the patient from the practice",
          "Discuss the findings with the patient, coordinate with other prescribers, and develop a unified treatment plan",
          "Report the patient to law enforcement for suspected drug diversion",
          "Continue prescribing as usual because the other prescriptions are not the NP's responsibility",
        ],
        correct: 1,
        rationale:
          "Multiple prescriber situations require a collaborative and non-punitive approach. The clinician should discuss the PDMP findings with the patient in a nonjudgmental manner, coordinate with other prescribers to develop a single treatment plan, implement risk mitigation strategies, and consider referral to pain management or addiction services as appropriate. Abruptly discontinuing opioids can precipitate withdrawal and harm.",
      },
      {
        question:
          "A terminally ill patient asks the clinician about medical assistance in dying. The clinician practices in a jurisdiction where MAiD is legal but personally opposes it. What is the ethically appropriate response?",
        options: [
          "Refuse to discuss the topic and redirect the conversation to palliative care only",
          "Provide objective information about MAiD eligibility and refer the patient to an appropriate provider or resource",
          "Attempt to persuade the patient that MAiD is not an ethical choice",
          "Tell the patient that MAiD is not available even though it is legal in the jurisdiction",
        ],
        correct: 1,
        rationale:
          "Conscientious objection allows NPs to decline direct participation in procedures that conflict with personal values, but it does not permit withholding information or abandoning the patient. The clinician must provide objective, accurate information and facilitate a timely referral to a willing provider. Deceiving the patient or refusing to discuss legal options violates the principles of veracity and nonabandonment.",
      },
    ],
  },
};
