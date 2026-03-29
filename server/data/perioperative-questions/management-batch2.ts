import type { PerioperativeQuestion } from "./types";

export const managementBatch2Questions: PerioperativeQuestion[] = [
  {
    stem: "A perioperative nurse manager is analyzing OR efficiency data and discovers that the average room turnover time (time from one patient leaving the room to the next patient entering) is 52 minutes. What is the generally accepted benchmark for room turnover time?",
    options: [
      "90 minutes is the standard — 52 minutes is already excellent",
      "25-35 minutes for standard cases — a 52-minute average suggests opportunities for improvement through process analysis, parallel processing, and team coordination",
      "10 minutes — all rooms should be turned over as quickly as possible",
      "There is no benchmark — turnover time varies too much to standardize"
    ],
    correctAnswer: 1,
    rationaleLong: "OR room turnover time is a key efficiency metric defined as the interval from one patient leaving the operating room to the next patient entering (or alternatively, from closure of the previous case to incision of the next case, depending on institutional definition). The generally accepted benchmark for standard room turnover is 25-35 minutes, though this varies by procedure type (more complex procedures requiring extensive setup may take longer). A turnover time of 52 minutes suggests significant opportunities for improvement. The turnover process includes: terminal cleaning of the room (10-15 minutes), room setup for the next case (instruments, equipment, positioning devices), and patient transport (bringing the next patient to the room). Strategies for reducing turnover time include: (1) Parallel processing — performing multiple turnover tasks simultaneously rather than sequentially (e.g., cleaning starts while the previous patient is being transferred, equipment setup begins while cleaning is still in progress); (2) Standardized room setups — pre-configured preference cards that allow early preparation; (3) Dedicated turnover teams — specialized personnel for room cleaning and setup; (4) Case scheduling optimization — grouping similar cases in the same room to minimize setup changes; (5) Early patient preparation — having the next patient ready in the preoperative holding area before the previous case ends. Each minute of OR time costs approximately $30-100 depending on the facility, so reducing turnover by even 10-15 minutes per case across multiple rooms has significant financial impact.",
    learningObjective: "Apply OR turnover time benchmarks to identify improvement opportunities and implement parallel processing strategies",
    blueprintCategory: "Management of Personnel",
    subtopic: "OR efficiency",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Standard turnover benchmark: 25-35 minutes. Each minute of OR time costs $30-100. Parallel processing is key to reducing turnover time.",
    clinicalPearls: [
      "Room turnover benchmark: 25-35 minutes for standard cases",
      "Parallel processing (simultaneous tasks) is the most effective turnover reduction strategy",
      "Each minute of OR time costs approximately $30-100 — efficiency has significant financial impact"
    ],
    safetyNote: "Rushing turnover to meet time targets should never compromise room cleaning thoroughness or patient safety — efficient does not mean hurried",
    distractorRationales: [
      "90 minutes is far above the benchmark — 52 minutes is above target, not excellent",
      "10 minutes is unrealistically short and would compromise cleaning and setup quality",
      "Established benchmarks exist — turnover time can and should be standardized and tracked"
    ]
  },
  {
    stem: "A perioperative nurse manager is implementing a peer review process for the OR nursing staff. What is the primary purpose of professional peer review in perioperative nursing?",
    options: [
      "To find mistakes and punish nurses who perform poorly",
      "To evaluate the quality of nursing practice by professional peers for the purpose of improving patient care, identifying learning opportunities, and supporting professional development — peer review is confidential, non-punitive, and focused on improvement",
      "To rank nurses against each other for compensation decisions",
      "To replace the annual performance evaluation by the nurse manager"
    ],
    correctAnswer: 1,
    rationaleLong: "Professional peer review is a systematic process in which nursing professionals evaluate the quality of patient care delivered by their professional peers. The American Nurses Association (ANA) established peer review as a professional responsibility in the ANA Code of Ethics and the Nursing: Scope and Standards of Practice. The key principles of effective peer review include: (1) PURPOSE — the primary purpose is quality improvement, not punishment. Peer review identifies opportunities for improvement, reinforces best practices, and supports professional development; (2) CONFIDENTIALITY — peer review records are confidential and protected by peer review privilege statutes in most states; (3) NON-PUNITIVE — the review focuses on practice patterns and opportunities for growth, not on individual blame or discipline; (4) STRUCTURED — the review uses standardized criteria based on evidence-based practice standards, institutional policies, and professional guidelines; (5) RECIPROCAL — all nurses participate as both reviewers and reviewed; (6) ACTIONABLE — the review results in specific recommendations for improvement, education, or recognition of excellence. Common areas evaluated in perioperative peer review include: compliance with surgical safety checklists, correct counts, proper positioning, skin preparation technique, sterile technique compliance, documentation completeness, and communication effectiveness. Peer review is distinct from (and does not replace) the annual performance evaluation, which is a management function performed by the nurse manager.",
    learningObjective: "Understand the purpose and principles of professional peer review as a quality improvement tool in perioperative nursing",
    blueprintCategory: "Management of Personnel",
    subtopic: "peer review",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Peer review is confidential, non-punitive, and focused on quality improvement — it is NOT a punitive or ranking tool.",
    clinicalPearls: [
      "Peer review purpose: quality improvement, professional development, and patient care enhancement",
      "Key principles: confidential, non-punitive, structured, reciprocal, and actionable",
      "Peer review is distinct from managerial performance evaluation — they serve different purposes"
    ],
    safetyNote: "A punitive peer review process suppresses participation and honest self-assessment — maintain the non-punitive focus",
    distractorRationales: [
      "Peer review is NOT punitive — the purpose is quality improvement and professional development",
      "Peer review does not rank nurses competitively — it evaluates practice against standards",
      "Peer review complements but does not replace the annual performance evaluation"
    ]
  },
  {
    stem: "A charge nurse must create the next day's OR schedule. A surgeon has requested that three 4-hour procedures be scheduled in a single OR that is available from 7:00 AM to 5:00 PM (10 hours). With 30-minute room turnovers between cases, is this schedule feasible?",
    options: [
      "Yes — 12 hours of procedures fit easily in a 10-hour block",
      "The total time required is 13 hours (12 hours of procedures + 1 hour of turnovers), which exceeds the available 10 hours — the schedule is NOT feasible and will result in case cancellations or overtime. The charge nurse should schedule only two cases or find an alternative room",
      "Yes, if the turnovers are skipped",
      "The feasibility cannot be determined without more information"
    ],
    correctAnswer: 1,
    rationaleLong: "Accurate OR scheduling requires accounting for ALL time components, not just the estimated surgical procedure time. The time calculation for this schedule: (1) Three 4-hour procedures = 12 hours of procedure time; (2) Two 30-minute turnovers (between case 1 and 2, and between case 2 and 3) = 1 hour; (3) Total time required = 12 + 1 = 13 hours. With only 10 hours available (7:00 AM to 5:00 PM), this schedule is 3 hours over the available time. If the schedule is posted as-is, the third case will either start 3 hours late (ending at 8:00 PM with significant overtime), or be cancelled. Both outcomes are undesirable: overtime increases labor costs and staff fatigue (a patient safety concern), while cancellation inconveniences the patient and wastes planned resources. The charge nurse should: (1) Schedule only two procedures in this room; (2) Contact the surgeon to discuss options — perhaps the third case can be scheduled in a different room, on a different day, or the procedures can be consolidated if appropriate; (3) Account for additional potential time factors: case setup time, anesthesia induction/emergence time, and the likelihood that actual case duration may exceed the surgeon's estimated time. Best practice for scheduling includes adding a 15-20% buffer to surgeon-estimated case times based on historical actual case durations.",
    learningObjective: "Apply accurate time calculations to OR scheduling including procedure time, turnover time, and buffer for case variability",
    blueprintCategory: "Management of Personnel",
    subtopic: "OR scheduling",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Total scheduling time = procedure time + turnover time + buffer. Always add 15-20% buffer to surgeon estimates based on historical data.",
    clinicalPearls: [
      "Scheduling must account for: procedure time + turnovers + setup + anesthesia time + buffer",
      "Add 15-20% buffer to surgeon time estimates based on historical actual case durations",
      "Overscheduling leads to overtime (costs + fatigue) or cancellations (patient impact)"
    ],
    safetyNote: "Overscheduled ORs increase staff fatigue at end of day — fatigued staff have higher error rates and compromise patient safety",
    distractorRationales: [
      "12 hours of procedures alone exceeds the 10-hour block, even without turnovers",
      "Skipping turnovers is not an option — room cleaning and setup are required between cases",
      "The calculation is straightforward with the information provided — feasibility can be determined"
    ]
  },
  {
    stem: "A perioperative nurse manager is addressing high staff turnover rates in the OR department. The annual turnover rate is 28%, which exceeds the national average. Which strategy is MOST effective for improving perioperative nurse retention?",
    options: [
      "Increase mandatory overtime to cover staffing gaps created by departures",
      "Implement a comprehensive retention strategy including competitive compensation, professional development opportunities (CNOR certification support, tuition reimbursement), shared governance participation, mentorship programs, and work-life balance initiatives (flexible scheduling, wellness programs)",
      "Hire only new graduate nurses who have lower salary expectations",
      "Reduce orientation time to get new nurses on the floor faster"
    ],
    correctAnswer: 1,
    rationaleLong: "High perioperative nurse turnover is a significant operational and patient safety concern. The cost of replacing a perioperative nurse is estimated at 1.5-2 times the annual salary when accounting for recruitment, advertising, hiring, orientation (typically 6-12 months for a perioperative nurse), preceptor time, and reduced productivity during training. A 28% annual turnover rate means the department is losing over a quarter of its staff each year, creating a perpetual cycle of recruitment and orientation that strains experienced staff and potentially compromises patient safety. Evidence-based retention strategies include: (1) Competitive compensation and benefits — salary benchmarking, shift differentials, on-call compensation; (2) Professional development — CNOR certification support (study materials, exam fees, certification bonuses), continuing education funding, tuition reimbursement, career ladder programs; (3) Shared governance — giving nurses a voice in practice decisions, policy development, and departmental operations through committee participation; (4) Mentorship programs — pairing experienced perioperative nurses with newer nurses for ongoing support beyond the formal orientation period; (5) Work-life balance — flexible scheduling, self-scheduling, limited mandatory overtime, wellness programs, and recognition programs; (6) Healthy work environment — addressing workplace incivility, providing adequate staffing, and fostering collegial relationships.",
    learningObjective: "Implement evidence-based retention strategies to reduce perioperative nursing turnover and its impact on patient safety and operational costs",
    blueprintCategory: "Management of Personnel",
    subtopic: "staff retention",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Perioperative nurse replacement cost: 1.5-2x annual salary. Retention requires a comprehensive strategy — no single intervention is sufficient.",
    clinicalPearls: [
      "Replacement cost per perioperative nurse: 1.5-2x annual salary",
      "Perioperative nurse orientation: 6-12 months — a significant investment lost with each departure",
      "Shared governance, professional development, and mentorship are key evidence-based retention strategies"
    ],
    safetyNote: "High turnover results in a less experienced workforce — newer nurses have higher error rates during their learning period, impacting patient safety",
    distractorRationales: [
      "Mandatory overtime INCREASES turnover and burnout — it is counterproductive to retention",
      "Hiring only new graduates creates a skill deficit and increases orientation burden on experienced staff",
      "Reducing orientation time leads to poorly prepared nurses, increased errors, and ultimately MORE turnover"
    ]
  },
  {
    stem: "A perioperative nurse manager receives notification that The Joint Commission (TJC) will be conducting an unannounced survey of the facility next week. What is the nurse manager's BEST approach to preparation?",
    options: [
      "Quickly create documentation to fill any gaps in compliance",
      "Maintain a state of continuous readiness by ensuring ongoing compliance with TJC standards, accreditation requirements, and National Patient Safety Goals throughout the year — 'survey readiness' should be the daily standard, not a last-minute preparation",
      "Tell staff to hide any equipment or processes that are not compliant",
      "Cancel all elective surgeries during the survey period to reduce the risk of observed errors"
    ],
    correctAnswer: 1,
    rationaleLong: "The Joint Commission transitioned to unannounced surveys in 2006, specifically to assess organizations in their normal operating state rather than in a 'survey-ready' special mode. The philosophy behind unannounced surveys is that compliance with safety and quality standards should be continuous, not episodic. The nurse manager's best approach is to ensure that continuous readiness is the departmental standard throughout the year, not just when a survey is anticipated. This includes: (1) Ongoing compliance with National Patient Safety Goals (NPSGs) — including proper patient identification, effective communication (read-backs, hand-off communication), medication safety (labeling all medications on the sterile field), surgical site marking, and infection prevention; (2) Current and complete documentation — policy and procedure manuals, competency records, equipment maintenance logs, quality improvement data, and staff credentialing files should be maintained in real-time; (3) Staff education — all staff should be familiar with TJC standards relevant to their practice and be able to articulate how they implement these standards in daily practice; (4) Environment of care — fire safety equipment (extinguishers, exit routes), hazardous materials management, emergency preparedness, and infection control practices should be consistently maintained; (5) Tracer readiness — TJC surveyors use 'tracers' (following a patient's care journey through the facility) and staff should be prepared to walk a surveyor through any aspect of perioperative care.",
    learningObjective: "Implement continuous survey readiness as the standard operating approach rather than episodic preparation for regulatory surveys",
    blueprintCategory: "Management of Personnel",
    subtopic: "regulatory compliance",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "TJC surveys are UNANNOUNCED since 2006. Survey readiness = daily standard, not last-minute preparation. Know the National Patient Safety Goals.",
    clinicalPearls: [
      "TJC surveys are unannounced — compliance must be continuous, not episodic",
      "National Patient Safety Goals: patient ID, communication, medication safety, site marking, infection prevention",
      "TJC uses 'tracers' — following a patient's care journey to assess compliance across the care continuum"
    ],
    safetyNote: "Creating documentation after the fact or hiding non-compliance is fraudulent and violates accreditation standards — honest compliance is both ethical and practical",
    distractorRationales: [
      "Creating documentation after the fact is fraudulent and defeats the purpose of accreditation",
      "Hiding non-compliant processes is fraudulent and does not improve patient safety",
      "Cancelling elective surgeries disrupts patient care and does not address underlying compliance issues"
    ]
  }
];
