import type { LessonContent } from "./types";

export const informaticsDocumentationLessons: Record<string, LessonContent> = {
  "informatics-doc-rpn": {
    title: "Documentation and Informatics",
    cellular: {
      title: "Electronic Health Records",
      content:
        "Electronic health records (EHRs) serve as the primary platform for clinical documentation in modern healthcare settings. RPNs must navigate EHR systems efficiently, understanding how to enter data accurately into designated fields, retrieve patient information, and document care in real time. Charting by exception (CBE) is a documentation method in which the nurse records only deviations from established norms or pre-set parameters, reducing redundancy while maintaining a complete clinical picture. Proper documentation principles require entries that are factual, objective, timely, legible, and free of blank spaces, with errors corrected using a single line through the incorrect entry along with initials and date."
    },
    riskFactors: [
      "Inaccurate or incomplete documentation leading to continuity-of-care errors and adverse patient outcomes",
      "Copy-paste errors propagating incorrect information across multiple chart entries",
      "Breaching patient confidentiality by leaving EHR sessions open or sharing login credentials",
      "Failure to document in real time resulting in missed or inaccurate entries from memory recall",
      "Using unapproved abbreviations that create ambiguity (e.g., U for units, QD vs QOD)",
      "Inadequate documentation of patient refusal, leaving the nurse without legal proof of informed decision-making",
    ],
    diagnostics: [
      "Audit documentation for completeness: every assessment, intervention, patient response, and communication must be recorded",
      "Review charting for objectivity: entries should contain measurable data and direct observations, not subjective opinions or judgments",
      "Verify timeliness: documentation should be completed at the time of care or as close to it as possible",
      "Check for proper error correction: single line through incorrect entry, initialed and dated, with corrected entry following",
      "Assess compliance with PHIPA/HIPAA requirements: are patient identifiers protected, screens locked when unattended, and printouts shredded?",
      "Evaluate the use of standardized nursing terminology and approved abbreviations in all documentation entries",
    ],
    nursingActions: [
      "Document assessments, interventions, and patient responses in real time using the EHR system",
      "Use only facility-approved abbreviations; avoid ambiguous abbreviations on the Do Not Use list (U, IU, QD, QOD, trailing zeros, lack of leading zeros)",
      "Correct charting errors with a single line through the incorrect entry, initial, date, and write the corrected entry",
      "Log off EHR workstations when stepping away from the computer to protect patient confidentiality",
      "Complete incident reports promptly using factual, objective language without assigning blame or including the report in the patient chart",
      "Document patient refusal of treatment including the information provided, the patient's stated reason, and notification of the physician",
      "Read back telephone and verbal orders to the prescriber for verification before entering into the chart",
    ],
    management: [
      "Use charting by exception to document only significant deviations from normal findings",
      "Complete narrative documentation for complex or unusual patient situations",
      "Record flow sheet data at required intervals for vital signs, intake and output, and routine assessments",
      "Document incident reports using factual, objective language without assigning blame",
      "Submit incident reports in a timely manner following facility policy",
      "Protect confidential data by logging off workstations, using strong passwords, and positioning screens away from public view",
      "Follow PHIPA and HIPAA regulations for all patient information handling",
      "Make late entries clearly labeled with the current date and time, referencing the date and time of the original event",
      "Accept telephone and verbal orders by reading back the complete order for verification"
    ],
    signs: {
      left: [
        "Documentation is factual, objective, and free of personal opinion",
        "Entries are dated, timed, and signed with professional designation",
        "Error corrections use single line through with initials and date",
        "Flow sheets are completed at required intervals",
        "Late entries are clearly identified as such"
      ],
      right: [
        "Blank spaces left in documentation entries",
        "Use of correction fluid or obliteration of errors",
        "Subjective or judgmental language in charting",
        "Sharing passwords or leaving workstations unlocked",
        "Delayed documentation without proper late entry notation"
      ]
    },
    medications: [
      {
        name: "High-Alert Medication Documentation",
        type: "Documentation Protocol",
        action:
          "Ensures accurate recording of high-alert medications including independent double checks, dose calculations, and pump settings in the EHR",
        sideEffects:
          "Documentation errors may lead to medication errors, adverse drug events, or failure to identify trends",
        contra:
          "Incomplete or inaccurate entries that omit required verification steps",
        pearl:
          "Always document the two-nurse independent double check for high-alert medications including the verifying nurse's name and time of verification"
      }
    ],
    pearls: [
      "If it was not documented, it was not done -- this principle underscores the legal weight of the medical record",
      "Never chart in advance; document care only after it has been provided",
      "When accepting telephone orders, use the read-back method: write the order, read it back verbatim, and obtain verbal confirmation from the prescriber",
      "Incident reports are internal quality improvement documents and should never be referenced in the patient chart",
      "Position computer screens so that patient information is not visible to unauthorized individuals in hallways or waiting areas"
    ],
    quiz: [
      {
        question:
          "A nurse discovers an error in a patient's electronic health record. What is the correct method for correcting the error?",
        options: [
          "Delete the incorrect entry and retype the correct information",
          "Draw a single line through the error, initial and date it, then enter the correct information",
          "Use correction fluid to cover the error and write over it",
          "Leave the error and add a note at the end of the chart explaining the mistake"
        ],
        correct: 1,
        rationale:
          "The correct method for correcting a documentation error is to draw a single line through the incorrect entry so it remains legible, then initial and date the correction before entering the accurate information. Deleting entries, using correction fluid, or obscuring errors is never acceptable."
      },
      {
        question:
          "Which action best protects patient confidentiality when using an electronic health record system?",
        options: [
          "Sharing login credentials with a trusted colleague for efficiency",
          "Leaving the workstation logged in when stepping away briefly",
          "Logging off the workstation each time before leaving the area",
          "Positioning the screen toward the hallway for better lighting"
        ],
        correct: 2,
        rationale:
          "Logging off the workstation each time the nurse leaves the area prevents unauthorized access to patient information and complies with PHIPA/HIPAA requirements. Sharing credentials, leaving sessions open, and positioning screens toward public areas all violate confidentiality standards."
      },
      {
        question:
          "A nurse needs to document care that was provided two hours ago but was not recorded at the time. What is the appropriate action?",
        options: [
          "Document the care using the current time and date without any additional notation",
          "Backdate the entry to reflect the time the care was actually provided",
          "Make a late entry clearly labeled with the current date and time, referencing when the care was provided",
          "Ask a colleague to document the care in their notes instead"
        ],
        correct: 2,
        rationale:
          "Late entries should be clearly identified as such, documented with the current date and time, and include a reference to the actual date and time the care was delivered. Backdating entries is falsification, and delegating documentation to others is inappropriate."
      }
    ]
  },

  "informatics-doc-rn": {
    title: "Advanced Documentation and Informatics",
    cellular: {
      title: "Charting Methods",
      content:
        "Registered nurses use structured documentation frameworks such as SOAP (Subjective, Objective, Assessment, Plan), DAR/Focus charting (Data, Action, Response), and SBAR (Situation, Background, Assessment, Recommendation) to organize clinical information systematically. Documentation serves as a legal record that may be subpoenaed in litigation, making accuracy, completeness, and adherence to retention requirements essential. Clinical decision support systems (CDSS) are integrated into EHRs to provide evidence-based alerts, reminders, and order suggestions that enhance patient safety. Barcode medication administration (BCMA) and smart pump technology add layers of verification that must be accurately documented to maintain audit trails and data integrity."
    },
    management: [
      "Apply SOAP format for comprehensive patient assessments and ongoing care documentation",
      "Use DAR/Focus charting to document nursing interventions and patient responses efficiently",
      "Employ SBAR format for structured handoff communication and provider notifications",
      "Maintain documentation as a legal record with awareness of subpoena and retention requirements",
      "Complete incident reports for adverse events and near-miss situations using standardized reporting systems",
      "Participate in root cause analysis documentation following sentinel events",
      "Support just culture principles by documenting system factors rather than individual blame",
      "Verify BCMA scanning at point of care and document any overrides with clinical rationale",
      "Program smart pumps according to drug library protocols and document all settings",
      "Follow telehealth documentation standards including informed consent and technology verification",
      "Document quality measures including core measures and nurse-sensitive indicators"
    ],
    signs: {
      left: [
        "SOAP notes contain all four components with objective clinical data",
        "SBAR communications are documented with provider response and orders received",
        "BCMA scanning is completed before medication administration with override rationale documented",
        "Incident reports include factual timeline, contributing factors, and immediate actions taken",
        "Audit trails demonstrate data integrity with no unauthorized modifications"
      ],
      right: [
        "Incomplete SOAP entries missing assessment or plan components",
        "SBAR handoffs without documentation of recommendations or provider response",
        "Bypassing BCMA scanning without documenting clinical rationale for override",
        "Incident reports containing blame-oriented language or speculation",
        "Gaps in audit trails suggesting potential data integrity issues"
      ]
    },
    medications: [
      {
        name: "Barcode Medication Administration (BCMA) Protocol",
        type: "Safety Technology Protocol",
        action:
          "Verifies the five rights of medication administration by scanning patient wristband and medication barcode before administration, creating an electronic timestamp and audit trail",
        sideEffects:
          "System downtime may require manual verification processes; alert fatigue from excessive override prompts may reduce vigilance",
        contra:
          "Administering medications without scanning when the system is functional; routinely overriding alerts without clinical justification",
        pearl:
          "When BCMA systems are down, implement the facility downtime procedure including manual verification of the five rights and retrospective electronic documentation once the system is restored"
      }
    ],
    pearls: [
      "SOAP documentation follows a logical clinical reasoning sequence: what the patient reports, what you observe, what you assess the problem to be, and what you plan to do about it",
      "Near-miss reporting is as important as adverse event reporting because it identifies system vulnerabilities before patient harm occurs",
      "Just culture distinguishes between human error, at-risk behavior, and reckless behavior -- documentation should reflect this framework",
      "Smart pump drug libraries reduce dosing errors but nurses must still verify the programmed rate and concentration against the original order",
      "Telehealth documentation must include verification of patient identity, location, informed consent for virtual care, and the technology platform used"
    ],
    quiz: [
      {
        question:
          "A nurse is using the SOAP format to document a patient encounter. Which entry belongs in the 'A' (Assessment) section?",
        options: [
          "Patient states 'I feel short of breath when I walk to the bathroom'",
          "Respiratory rate 24 breaths per minute, oxygen saturation 91% on room air",
          "Activity intolerance related to impaired gas exchange",
          "Administer supplemental oxygen at 2 L/min via nasal cannula and reassess in 30 minutes"
        ],
        correct: 2,
        rationale:
          "The Assessment section of a SOAP note contains the nurse's clinical judgment or nursing diagnosis based on the subjective and objective data. Activity intolerance related to impaired gas exchange is a nursing diagnosis. The patient statement is Subjective, vital signs are Objective, and interventions are part of the Plan."
      },
      {
        question:
          "During medication administration, the BCMA system alerts the nurse to a potential drug interaction. What is the most appropriate nursing action?",
        options: [
          "Override the alert and administer the medication as scheduled",
          "Hold the medication, investigate the alert, and notify the prescriber before administering",
          "Ignore the alert because BCMA systems frequently generate false alarms",
          "Ask another nurse to scan the medication to see if the same alert appears"
        ],
        correct: 1,
        rationale:
          "When a BCMA system generates a drug interaction alert, the nurse should hold the medication, investigate the clinical significance of the interaction, and notify the prescriber before proceeding. Overriding alerts without investigation, ignoring alerts, or having another nurse scan does not address the potential safety concern."
      },
      {
        question:
          "A nurse witnesses a near-miss medication error that did not reach the patient. What is the most appropriate action?",
        options: [
          "No report is needed because the patient was not harmed",
          "Verbally inform the charge nurse but do not complete written documentation",
          "Complete an incident report documenting the near-miss event and contributing factors",
          "Document the near-miss in the patient's progress notes"
        ],
        correct: 2,
        rationale:
          "Near-miss events should be reported through the incident reporting system to identify system vulnerabilities and prevent future errors. Even though no patient harm occurred, the event provides valuable data for quality improvement. Near-miss events are not documented in the patient chart but are reported through internal safety reporting systems."
      }
    ]
  },

  "informatics-doc-np": {
    title: "Clinical Documentation and Health Informatics",
    cellular: {
      title: "Clinical Documentation for Billing",
      content:
        "Nurse practitioners must produce clinical documentation that meets evaluation and management (E/M) coding requirements, with documentation elements aligned to the complexity of medical decision-making for each visit level. Prescribing documentation requires checking the Prescription Drug Monitoring Program (PDMP) before prescribing controlled substances, maintaining controlled substance agreements, and obtaining informed consent for high-risk medications. Health information exchange (HIE) enables the secure sharing of patient data across organizations to support care coordination, while population health data analytics allow NPs to identify trends, manage chronic disease registries, and report on quality metrics. Meaningful use and promoting interoperability requirements mandate structured data capture, clinical decision support utilization, and patient portal engagement to qualify for incentive programs."
    },
    management: [
      "Document E/M visits with elements appropriate to the coding level including history, examination, and medical decision-making complexity",
      "Check the PDMP database before prescribing or refilling controlled substances and document the query results",
      "Maintain signed controlled substance agreements for patients on chronic opioid or benzodiazepine therapy",
      "Obtain and document informed consent for high-risk medications including risks, benefits, and alternatives discussed",
      "Create comprehensive referral documentation including clinical indication, relevant history, diagnostic results, and specific consultation questions",
      "Document procedures with pre-procedure assessment, informed consent, technique description, findings, and post-procedure instructions",
      "Participate in health information exchange to support continuity of care across settings",
      "Utilize population health analytics to identify at-risk populations and implement targeted interventions",
      "Meet meaningful use and promoting interoperability requirements through structured EHR data entry",
      "Report to clinical registries and document quality metrics including preventive care measures",
      "Develop and maintain evidence-based order sets tailored to common clinical conditions"
    ],
    signs: {
      left: [
        "E/M documentation supports the billed code level with adequate history, exam, and medical decision-making elements",
        "PDMP query is documented with date, findings, and clinical decision for every controlled substance prescription",
        "Referral documentation includes specific clinical question, relevant diagnostics, and urgency level",
        "Quality metrics documentation demonstrates compliance with evidence-based guidelines",
        "Population health reports identify trends and document interventions for at-risk groups"
      ],
      right: [
        "E/M documentation insufficient to support the billed code level, risking audit findings or fraud allegations",
        "Controlled substance prescribing without documented PDMP query or patient agreement",
        "Referral letters lacking clinical context, specific questions, or supporting diagnostic data",
        "Missing or incomplete quality metric documentation affecting reporting compliance",
        "Failure to participate in clinical registry reporting or health information exchange"
      ]
    },
    medications: [
      {
        name: "Controlled Substance Prescribing Documentation",
        type: "Prescribing Protocol",
        action:
          "Establishes a structured documentation framework for prescribing controlled substances including PDMP verification, risk assessment tools, treatment agreements, and ongoing monitoring plans",
        sideEffects:
          "Inadequate documentation may result in regulatory scrutiny, DEA audit findings, licensure concerns, or liability in diversion cases",
        contra:
          "Prescribing controlled substances without documented PDMP query, risk assessment, or informed consent; failure to document periodic reassessment of ongoing controlled substance therapy",
        pearl:
          "Document the PDMP query date, findings, and clinical rationale for every controlled substance prescription including refills, and maintain signed patient treatment agreements that are renewed at least annually"
      }
    ],
    pearls: [
      "E/M coding is driven by medical decision-making complexity in current guidelines -- document the number and complexity of problems addressed, data reviewed, and risk of management options",
      "PDMP checks should be documented even when results are unremarkable, as the query itself demonstrates due diligence and standard of care compliance",
      "Procedure documentation must include a time-out verification, informed consent discussion, step-by-step technique description, specimen disposition if applicable, and specific follow-up instructions",
      "Meaningful use and promoting interoperability measures require not only data entry but also patient engagement through portal access, secure messaging, and electronic health information sharing",
      "Evidence-based order sets reduce variability in care delivery and should be reviewed and updated at least annually to reflect current clinical guidelines"
    ],
    quiz: [
      {
        question:
          "A nurse practitioner is documenting a visit for a patient with multiple chronic conditions and a new acute problem requiring additional workup. Which element most strongly determines the E/M coding level under current guidelines?",
        options: [
          "The length of time spent in direct patient contact",
          "The number of body systems examined during the physical assessment",
          "The complexity of medical decision-making including problems addressed, data reviewed, and management risk",
          "The number of history of present illness elements documented"
        ],
        correct: 2,
        rationale:
          "Under current E/M coding guidelines, medical decision-making complexity is the primary driver of code level selection. This includes the number and complexity of problems addressed, the amount and complexity of data reviewed and analyzed, and the risk of complications, morbidity, or mortality of patient management decisions."
      },
      {
        question:
          "Before prescribing a Schedule II controlled substance for chronic pain management, which documentation element is required?",
        options: [
          "A signed controlled substance agreement, PDMP query documentation, and informed consent for the medication",
          "Only a brief note indicating the patient requested the medication",
          "A peer review letter from another provider supporting the prescription decision",
          "Documentation that the patient has tried at least five alternative therapies"
        ],
        correct: 0,
        rationale:
          "Prescribing Schedule II controlled substances requires comprehensive documentation including a signed controlled substance agreement outlining expectations and monitoring requirements, documented PDMP query results showing the prescribing history review, and informed consent reflecting discussion of risks, benefits, and alternatives. This documentation protects both the patient and the prescriber."
      },
      {
        question:
          "A nurse practitioner is preparing a referral to a specialist. Which documentation approach best supports continuity of care?",
        options: [
          "Writing 'Please evaluate and treat' without additional clinical details",
          "Sending the entire patient chart without a summary letter",
          "Including the clinical indication, relevant history, diagnostic results, current medications, and a specific consultation question",
          "Providing only the patient's demographic information and insurance details"
        ],
        correct: 2,
        rationale:
          "Effective referral documentation includes the clinical indication for the referral, pertinent medical history, relevant diagnostic results, current medication list, and a specific consultation question. This approach supports continuity of care, reduces redundant testing, and helps the specialist address the clinical concern efficiently."
      }
    ]
  }
};
