import type { PerioperativeQuestion } from "./types";

export const professionalAccountabilityQuestions: PerioperativeQuestion[] = [
  {
    stem: "A circulating nurse witnesses a surgeon make a disparaging comment about the patient while the patient is under general anesthesia. The comment is not related to the patient's care. What is the nurse's professional obligation?",
    options: [
      "Ignore the comment since the patient is unconscious and cannot hear it",
      "Address the behavior by reminding the surgeon that the patient deserves dignity and respect regardless of anesthesia status, and report the behavior through the appropriate chain of command if it continues",
      "Laugh along with the surgeon to maintain team rapport",
      "Wait until after the case to discuss the comment with the surgeon privately"
    ],
    correctAnswer: 1,
    rationaleLong: "The perioperative nurse has a professional and ethical obligation to advocate for the patient's dignity and rights at all times, including when the patient is under general anesthesia and unable to advocate for themselves. The ANA Code of Ethics for Nurses states that the nurse promotes, advocates for, and protects the rights, health, and safety of the patient. This includes protection of dignity, even when the patient is unaware of the violation. Several important considerations apply: (1) There have been documented cases of patients having awareness during general anesthesia and recalling conversations — the assumption that patients cannot hear is not always accurate; (2) Disrespectful behavior toward patients, even when unconscious, can normalize unprofessional conduct and erode the culture of respect essential to patient safety; (3) Studies have shown that operating room cultures that tolerate disrespectful behavior have higher rates of surgical errors and adverse events; (4) The nurse should address the behavior directly but respectfully, using a non-confrontational approach: 'I'd appreciate if we keep our conversation respectful and professional.' If the behavior continues or is egregious, the nurse should report it through the appropriate channels (charge nurse, nurse manager, or professional standards committee). AORN's position statement on a healthy perioperative practice environment emphasizes zero tolerance for disrespectful or abusive behavior in the operating room.",
    learningObjective: "Apply professional ethics and patient advocacy principles when witnessing unprofessional behavior in the perioperative setting",
    blueprintCategory: "Professional Accountability",
    subtopic: "patient advocacy",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Patients under GA may have awareness and recall conversations. Professional conduct is required at ALL times regardless of the patient's consciousness level.",
    clinicalPearls: [
      "Intraoperative awareness occurs in 1-2 per 1,000 general anesthetics — patients may hear and recall OR conversations",
      "Disrespectful OR cultures are associated with higher rates of surgical errors and adverse events",
      "The nurse is the patient's advocate at all times, including when the patient cannot advocate for themselves"
    ],
    safetyNote: "Professional behavior in the OR is a patient safety issue — disrespectful team dynamics impair communication and increase error rates",
    distractorRationales: [
      "The patient's unconscious state does not negate the right to dignity — awareness during anesthesia is documented",
      "Participating in unprofessional behavior violates the ANA Code of Ethics",
      "While private conversation after the case may be appropriate in addition, addressing the behavior in the moment protects the patient"
    ]
  },
  {
    stem: "A perioperative nurse has been assigned to circulate for a surgical procedure involving a technology she has never used before — a new robotic surgical system. The nurse has not received training on this system. What is the nurse's professional responsibility?",
    options: [
      "Accept the assignment and learn the technology during the case by observing the surgeon",
      "Decline the assignment and notify the charge nurse that she lacks the required competency for this technology, as practicing beyond one's competence violates professional standards",
      "Accept the assignment but inform the surgeon that she may need extra guidance during the case",
      "Read the equipment manual quickly before the case starts and proceed"
    ],
    correctAnswer: 1,
    rationaleLong: "The ANA Code of Ethics and state nurse practice acts establish that nurses are responsible for practicing within their scope of competence. Accepting an assignment for which the nurse lacks the required training and competency is unsafe and potentially constitutes negligence if patient harm results. Robotic surgery requires specialized knowledge including: emergency undocking procedures, troubleshooting system malfunctions, patient positioning for robotic ports, instrument exchange procedures, and understanding the communication between the surgeon at the console and the bedside team. The nurse should: (1) Immediately notify the charge nurse that she has not been trained or validated on the robotic system; (2) Request that a competent nurse be assigned to the case or that an experienced robotic nurse be available to precept; (3) Document the notification — if the facility attempts to force the assignment without providing competent backup, the nurse should escalate to the nurse manager. AORN's Perioperative Standards and Recommended Practices state that perioperative nurses must maintain competency through ongoing education and validation. Learning during a live patient case is not an acceptable substitute for formal training and competency validation. The nurse has a legal duty to refuse an assignment that she knows exceeds her competence — this is not insubordination, it is professional accountability.",
    learningObjective: "Apply professional standards regarding scope of competence when assigned to technology requiring specialized training",
    blueprintCategory: "Professional Accountability",
    subtopic: "scope of competence",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Practicing beyond competence is negligence, not dedication. Declining an unsafe assignment is professional accountability, not insubordination.",
    clinicalPearls: [
      "Nurses must practice within their validated scope of competence — new technology requires formal training",
      "Declining an unsafe assignment is a professional obligation, not insubordination",
      "Document notification of incompetence for the assigned task and request appropriate staffing"
    ],
    safetyNote: "Learning during a live patient case is never an acceptable substitute for formal training and competency validation",
    distractorRationales: [
      "Learning during a live case puts the patient at risk and violates professional standards",
      "Informing the surgeon of inexperience does not address the fundamental competency issue — the nurse is still unqualified",
      "Reading a manual before a case does not constitute adequate training for complex robotic surgical technology"
    ]
  },
  {
    stem: "A perioperative nurse suspects that a colleague is diverting controlled substances from the automated dispensing cabinet. The nurse has observed the colleague frequently wasting narcotics without a witness and has noticed discrepancies in narcotic counts at the end of several shifts. What is the nurse's obligation?",
    options: [
      "Confront the colleague directly and demand an explanation",
      "Report the suspicion to the nurse manager or the facility's drug diversion reporting system, as failure to report suspected diversion may constitute professional misconduct",
      "Ignore the observations since there is no definitive proof of diversion",
      "Ask other colleagues if they have noticed the same behavior before deciding whether to report"
    ],
    correctAnswer: 1,
    rationaleLong: "Drug diversion is the unauthorized redirection of controlled substances from their intended medical purpose. In the perioperative setting, opportunities for diversion exist at multiple points: during narcotic waste, during medication administration, and during undocumented controlled substance access. The nurse who suspects diversion has a legal and professional obligation to report the suspicion through the appropriate channels — typically the nurse manager, pharmacy director, or the facility's designated drug diversion reporting system. Most states mandate reporting of suspected drug diversion, and failure to report can result in disciplinary action against the non-reporting nurse's own license. The nurse should NOT: confront the colleague (this can prompt evidence destruction, denial, or even violence), investigate independently (this is the role of trained investigators), or delay reporting (delay enables continued diversion, potentially endangering patients who receive inadequate pain management). Signs of possible diversion include: frequent offers to administer or waste narcotics for other staff, narcotic count discrepancies, excessive narcotic waste amounts, patients reporting inadequate pain relief from medications administered by the suspected individual, behavioral changes (mood swings, impaired performance, frequent bathroom breaks), and documentation irregularities. The purpose of reporting is both patient safety (patients may receive subtherapeutic doses or no medication) and colleague safety (substance use disorder is a treatable condition, and early intervention can save a colleague's career and life).",
    learningObjective: "Fulfill the professional and legal obligation to report suspected controlled substance diversion through appropriate channels",
    blueprintCategory: "Professional Accountability",
    subtopic: "substance diversion reporting",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Failure to report suspected diversion can result in disciplinary action against YOUR license. Report through proper channels — do NOT confront or investigate independently.",
    clinicalPearls: [
      "Signs of diversion: frequent unwitnessed wasting, narcotic count discrepancies, patients reporting inadequate pain relief",
      "Report through proper channels (manager, pharmacy, diversion reporting system) — do not confront directly",
      "Failure to report suspected diversion may constitute professional misconduct"
    ],
    safetyNote: "Drug diversion endangers patients (inadequate medication) and the diverting nurse (substance use disorder) — reporting enables intervention for both",
    distractorRationales: [
      "Confronting the colleague can prompt evidence destruction and is not the proper reporting mechanism",
      "Ignoring suspected diversion violates legal and professional reporting obligations and enables ongoing patient harm",
      "Discussing with other colleagues delays reporting and may constitute gossip — report through proper channels"
    ]
  },
  {
    stem: "A perioperative nurse receives a verbal order from the surgeon during an emergency case for 'morphine ten.' What is the nurse's responsibility before administering the medication?",
    options: [
      "Administer morphine 10 mg immediately since it is an emergency",
      "Use the read-back verification process: repeat the order back to the surgeon including the drug name, dose, route, and frequency to ensure accuracy, then document the verbal order",
      "Write the order on a piece of paper and give it to the pharmacy for processing",
      "Administer what the nurse believes the surgeon intended based on the clinical situation"
    ],
    correctAnswer: 1,
    rationaleLong: "Verbal orders are inherently higher risk than written orders due to the potential for miscommunication, mishearing, and misinterpretation. The Joint Commission's National Patient Safety Goals require that verbal orders be verified using the read-back (or repeat-back) process. The nurse must: (1) Write down the complete verbal order immediately (or enter it into the electronic system); (2) Read back the complete order to the ordering physician, including the drug name (using both generic and brand name to avoid sound-alike confusion), dose with units (spelled out to avoid misinterpretation), route of administration, and frequency; (3) Receive confirmation from the ordering physician that the read-back is correct. In this case, 'morphine ten' is ambiguous — it could mean 10 mg, 10 mcg (unlikely but possible), and the route is not specified (IV, IM, PO, epidural?). The nurse must clarify: 'I understand morphine 10 mg, and by what route?' The surgeon confirms, and the nurse documents the complete order with time, date, surgeon's name, and the nurse's name as the recipient of the verbal order. The surgeon must co-sign the verbal order within the timeframe specified by institutional policy (typically 24-48 hours). Even in emergency situations, the few seconds required for read-back verification can prevent medication errors that may cause greater harm than the brief delay.",
    learningObjective: "Apply the read-back verification process for verbal medication orders to prevent miscommunication and medication errors",
    blueprintCategory: "Professional Accountability",
    subtopic: "verbal order management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Always read back verbal orders including drug name, dose, route, and frequency. 'Morphine ten' is ambiguous — clarify dose units and route.",
    clinicalPearls: [
      "Read-back process: write down → read back (drug, dose, route, frequency) → receive confirmation",
      "Ambiguous orders must be clarified before administration — 'ten' could be mg, mcg, or mL",
      "Surgeon must co-sign verbal orders within institutional timeframe (typically 24-48 hours)"
    ],
    safetyNote: "Never administer a medication based on an assumed verbal order — always clarify and verify using read-back before administration",
    distractorRationales: [
      "Even in emergencies, read-back verification takes only seconds and prevents potentially fatal medication errors",
      "Writing the order for pharmacy processing does not address the immediate verification needed at the point of administration",
      "Administering based on assumption is dangerous — ambiguous orders have caused fatal medication errors"
    ]
  },
  {
    stem: "A perioperative nurse discovers that the operating room schedule shows a procedure that requires informed consent from a patient who is a 16-year-old minor. The patient's parents are not present. The patient's 21-year-old sibling brought the patient to the hospital. What is the legal requirement for consent?",
    options: [
      "The 16-year-old can consent for their own procedure since they are over 14",
      "The 21-year-old sibling can sign the consent form as the responsible accompanying adult",
      "Consent must be obtained from a parent or legal guardian — a sibling is not a legal substitute decision-maker unless they have legal guardianship",
      "The surgeon can proceed with implied consent since the patient showed up for the appointment"
    ],
    correctAnswer: 2,
    rationaleLong: "For minor patients (typically under 18, though this varies by state), informed consent must be obtained from a parent or legal guardian. A sibling, regardless of age, does not have legal authority to consent to medical procedures for a minor unless they have been granted legal guardianship through a court order. The procedure should not proceed without proper consent from an authorized individual. There are limited exceptions to the parental consent requirement: (1) Emancipated minors — those who are married, in the military, living independently, or declared emancipated by a court can consent for themselves; (2) Mature minor doctrine — some states allow minors who demonstrate sufficient maturity to consent for certain treatments; (3) Emergency treatment — when a delay to obtain consent would endanger the patient's life or health, emergency treatment can proceed under implied consent; (4) Specific statutory exceptions — many states allow minors to consent independently for STI/STD treatment, contraception, pregnancy-related care, substance abuse treatment, and mental health services. The nurse should: (1) Contact the parents/legal guardian by phone to obtain telephone consent with a witness (if the procedure is time-sensitive and institutional policy allows), or (2) Delay the procedure until a parent/guardian can be present. Document all communication attempts and the final consent outcome.",
    learningObjective: "Apply legal consent requirements for minor patients, identifying who can and cannot provide consent",
    blueprintCategory: "Professional Accountability",
    subtopic: "consent for minors",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Siblings cannot consent for minor patients unless they have legal guardianship. Telephone consent from parents may be acceptable with a witness per institutional policy.",
    clinicalPearls: [
      "Minor consent requires parent or legal guardian — siblings, grandparents without guardianship cannot consent",
      "Exceptions: emancipated minors, mature minor doctrine, emergency treatment, specific statutory exceptions",
      "Telephone consent with a witness may be acceptable per institutional policy"
    ],
    safetyNote: "Never proceed with a non-emergency procedure on a minor without proper consent from a legally authorized individual",
    distractorRationales: [
      "Age 16 does not automatically confer the right to self-consent in most states for elective procedures",
      "A sibling does not have legal authority to consent unless they have court-ordered guardianship",
      "Showing up for an appointment does not constitute implied consent for an invasive procedure requiring explicit informed consent"
    ]
  },
  {
    stem: "A perioperative nurse is asked to document the operative record. The surgeon asks the nurse to record the start time as 30 minutes earlier than the actual procedure start to make the surgical schedule appear more efficient. What should the nurse do?",
    options: [
      "Record the time the surgeon requests since the surgeon has authority over the operative record",
      "Refuse to falsify the record and document the actual procedure start time, as falsifying medical records is illegal, unethical, and could constitute fraud",
      "Record both times in the chart and let administration determine which is correct",
      "Leave the start time blank and let the surgeon fill it in later"
    ],
    correctAnswer: 1,
    rationaleLong: "Falsifying medical records is a serious legal and ethical violation. The nurse has both a professional obligation (per the ANA Code of Ethics) and a legal obligation to document accurately, honestly, and completely. Medical records are legal documents, and intentional falsification can result in: (1) Criminal charges (fraud, falsification of records); (2) Civil liability (if the falsified record contributes to patient harm, the nurse and surgeon can be held liable); (3) Loss of nursing license (state boards of nursing take documentation integrity seriously); (4) Insurance fraud (if the falsified time affects billing or reimbursement); (5) Loss of employment and professional reputation. The nurse should: politely but firmly refuse to document a false time, document the actual start time, and if the surgeon insists or applies pressure, report the request to the nurse manager and/or compliance department. The nurse should also document the conversation in which the falsification was requested, as this protects the nurse if the surgeon later disputes the documented time. AORN's Standards of Perioperative Practice explicitly state that the perioperative nurse is responsible for accurate, complete, and contemporaneous documentation. The surgeon does not have authority to direct the nurse to falsify records — the nurse is independently accountable for the accuracy of their documentation.",
    learningObjective: "Maintain documentation integrity by refusing to falsify medical records regardless of pressure from other team members",
    blueprintCategory: "Professional Accountability",
    subtopic: "documentation integrity",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Falsifying medical records is a criminal offense regardless of who asks. The nurse is independently accountable for documentation accuracy.",
    clinicalPearls: [
      "Medical records are legal documents — falsification can result in criminal charges, license loss, and civil liability",
      "The nurse is independently accountable for documentation accuracy — physician authority does not extend to directing falsification",
      "Report requests to falsify records to the compliance department or nurse manager"
    ],
    safetyNote: "Accurate documentation protects both the patient and the nurse — never alter records to misrepresent clinical events or timing",
    distractorRationales: [
      "The surgeon does not have authority to direct documentation falsification — the nurse is independently accountable",
      "Recording both times does not resolve the falsification issue and creates a confusing medical record",
      "Leaving the time blank abdicates the nurse's documentation responsibility"
    ]
  },
  {
    stem: "A perioperative nurse is working as a first assistant during a surgical procedure. The nurse holds retractors, provides hemostasis with electrocautery, and closes subcutaneous tissue. Under what professional framework is the RN First Assistant (RNFA) practicing?",
    options: [
      "The RNFA functions outside of nursing scope of practice and requires a medical license",
      "The RNFA practices within an expanded perioperative nursing role with additional education, training, and credentialing beyond basic perioperative nursing",
      "Any registered nurse can function as a first assistant without additional education",
      "The RNFA role is identical to the circulating nurse role with no additional qualifications"
    ],
    correctAnswer: 1,
    rationaleLong: "The Registered Nurse First Assistant (RNFA) is an expanded perioperative nursing role recognized by AORN and state boards of nursing. The RNFA provides surgical assistance under the direct supervision of the surgeon, performing functions that include: tissue retraction, hemostasis, suturing, wound closure of subcutaneous tissue and skin, and other tasks at the direction of the surgeon. The RNFA role requires education and training beyond basic perioperative nursing, including: (1) A formal RNFA educational program (typically a post-baccalaureate certificate program or master's degree program) that includes didactic coursework in surgical anatomy, physiology, and pathophysiology, as well as supervised clinical practice in the first assistant role; (2) National certification (CRNFA — Certified Registered Nurse First Assistant) through the Competency & Credentialing Institute (CCI); (3) Institutional credentialing and privileging; (4) State board of nursing authorization (some states have specific regulations governing the RNFA role). The RNFA practices within the scope of nursing — it is NOT practicing medicine. The role is distinct from the circulating nurse and scrub nurse roles and requires separate competency validation. AORN's Official Statement on RN First Assistants defines the perioperative nursing behaviors, clinical skills, and accountabilities of the RNFA.",
    learningObjective: "Understand the RNFA role as an expanded perioperative nursing practice requiring additional education, certification, and credentialing",
    blueprintCategory: "Professional Accountability",
    subtopic: "role of the RNFA",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "The RNFA is an expanded NURSING role, not a medical role. It requires formal education, certification (CRNFA), and institutional credentialing beyond basic perioperative nursing.",
    clinicalPearls: [
      "RNFA: expanded perioperative nursing role — requires formal RNFA program, CRNFA certification, institutional credentialing",
      "RNFA scope: retraction, hemostasis, suturing, wound closure under surgeon's direct supervision",
      "RNFA is a nursing role (not medical) — governed by state boards of nursing and AORN standards"
    ],
    safetyNote: "Only credentialed and privileged RNFAs should perform first assistant functions — practicing without proper qualifications is outside scope of practice",
    distractorRationales: [
      "The RNFA is within nursing scope of practice — it does not require a medical license",
      "RNFA requires extensive additional education — any RN cannot function in this role",
      "The RNFA role is distinct from the circulating nurse role and requires separate qualifications"
    ]
  },
  {
    stem: "A perioperative nurse witnesses a medication error by a colleague — the wrong antibiotic was administered to a patient. The error did not cause apparent patient harm. What is the nurse's professional obligation regarding disclosure?",
    options: [
      "Do not disclose the error since no harm occurred — disclosure would unnecessarily alarm the patient",
      "Report the error through the facility's incident reporting system, document the facts in the medical record, and support transparent disclosure to the patient per institutional policy",
      "Inform only the nurse manager verbally and do not document the error",
      "Wait to see if the patient develops any adverse effects before deciding whether to report"
    ],
    correctAnswer: 1,
    rationaleLong: "Professional accountability requires transparent reporting and disclosure of medication errors regardless of whether apparent harm has occurred. The perioperative nurse's obligations include: (1) Report the error through the facility's incident reporting system (safety event report/occurrence report) — this enables the organization to identify system failures and implement corrective actions to prevent recurrence; (2) Document the objective facts of the event in the medical record — including what was administered, what was ordered, the time of the error, the patient's clinical status, the attending physician notification, and any interventions taken; (3) Notify the attending physician/surgeon so they can monitor for potential adverse effects and determine if additional intervention is needed; (4) Support transparent disclosure to the patient — The Joint Commission, CMS, and most state regulations require disclosure of unanticipated outcomes of care to patients, including harmful errors. Many organizations also have policies supporting disclosure of near-miss events or errors that did not cause apparent harm, as part of a just culture of transparency. The ANA Code of Ethics emphasizes honesty and the obligation to disclose errors. Hiding errors erodes trust, prevents learning, and may constitute a cover-up if the error is later discovered. Even 'no harm' errors deserve analysis because the same system failure could cause harm in a future occurrence.",
    learningObjective: "Fulfill professional and organizational obligations for transparent error reporting, documentation, and disclosure",
    blueprintCategory: "Professional Accountability",
    subtopic: "error disclosure",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "All medication errors must be reported regardless of whether harm occurred. Hiding errors prevents organizational learning and may constitute a cover-up.",
    clinicalPearls: [
      "Report ALL errors through incident reporting — even no-harm events enable system improvement",
      "Document objective facts in the medical record — do not use language that assigns blame",
      "TJC and CMS require disclosure of unanticipated outcomes to patients"
    ],
    safetyNote: "Transparent error reporting is essential for organizational learning — a just culture encourages reporting without fear of punishment",
    distractorRationales: [
      "Lack of apparent harm does not negate the reporting obligation — delayed harm may occur and system failures must be addressed",
      "Verbal-only reporting without documentation fails to create the record needed for system improvement",
      "Waiting for adverse effects delays reporting and intervention — the physician needs to know immediately to monitor the patient"
    ]
  }
];
