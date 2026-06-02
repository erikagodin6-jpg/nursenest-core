import type { PerioperativeQuestion } from "./types";

export const managementPersonnelQuestions: PerioperativeQuestion[] = [
  {
    stem: "The perioperative nurse manager is developing the annual operating room budget. Which cost category typically represents the LARGEST portion of the perioperative department budget?",
    options: [
      "Surgical supply costs including sutures, drapes, and disposable instruments",
      "Personnel costs including salaries, benefits, and overtime for nursing staff, surgical technologists, and support staff",
      "Equipment maintenance and capital equipment purchases",
      "Pharmaceutical costs including anesthetic agents and medications"
    ],
    correctAnswer: 1,
    rationaleLong: "Personnel costs consistently represent the largest single category in perioperative department budgets, typically accounting for 50-60% or more of the total operating budget. This includes: salaries for registered nurses (circulating nurses, scrub nurses, RNFAs, charge nurses, nurse managers), surgical technologists, nursing assistants, environmental services staff, sterile processing technicians, and perioperative support staff. Benefits (health insurance, retirement contributions, paid time off) typically add 25-35% on top of base salaries. Overtime costs can significantly increase personnel expenses, particularly in departments with staffing shortages or high call volumes. Understanding the personnel budget is essential for the perioperative nurse manager because: (1) Staffing decisions directly impact patient safety — inadequate staffing increases the risk of adverse events; (2) OR utilization metrics (first case on-time starts, room turnover times, case cancellation rates) are heavily influenced by adequate staffing; (3) Recruitment and retention costs are substantial — the cost of replacing a perioperative nurse is estimated at 1.5-2 times annual salary when accounting for recruitment, orientation, and productivity loss during training; (4) Skill mix (the ratio of RNs to surgical technologists) affects both cost and care quality. The nurse manager must balance budget constraints with safe staffing levels, recognizing that understaffing can lead to overtime costs, burnout, turnover, and increased adverse events that may ultimately cost more than adequate staffing.",
    learningObjective: "Identify personnel costs as the largest budget category and understand its implications for staffing decisions and patient safety",
    blueprintCategory: "Management of Personnel",
    subtopic: "budget management",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Personnel costs = 50-60%+ of the perioperative budget. Replacing a perioperative nurse costs 1.5-2x annual salary.",
    clinicalPearls: [
      "Personnel costs typically account for 50-60%+ of the perioperative department budget",
      "Cost of replacing a perioperative nurse: 1.5-2x annual salary (recruitment, orientation, productivity loss)",
      "Understaffing increases overtime costs, burnout, turnover, and adverse events"
    ],
    safetyNote: "Inadequate staffing to reduce budget costs can paradoxically increase overall costs through overtime, adverse events, and turnover",
    distractorRationales: [
      "Surgical supplies are a significant cost but typically rank second to personnel (15-25% of budget)",
      "Equipment costs are important but are usually a smaller percentage than personnel and supply costs",
      "Pharmaceutical costs contribute to the budget but are generally a smaller category than personnel"
    ]
  },
  {
    stem: "A charge nurse needs to determine the staffing requirements for the operating room. According to AORN staffing recommendations, what is the minimum staffing for each operating room where a surgical procedure is being performed?",
    options: [
      "One registered nurse circulator and one surgical technologist or second RN scrub role per operating room",
      "Two surgical technologists per operating room",
      "One LPN/LVN circulator and one surgical technologist per operating room",
      "One registered nurse who functions in both the circulating and scrub roles simultaneously"
    ],
    correctAnswer: 0,
    rationaleLong: "AORN's Position Statement on Perioperative Safe Staffing and On-Call Practices recommends that at minimum, each operating room where a surgical procedure is being performed should have: (1) One registered nurse in the circulating role — the circulator must be an RN because the role requires professional nursing judgment, assessment, planning, intervention, and evaluation that are within the RN scope of practice and cannot be delegated to unlicensed personnel; and (2) One scrub person — who can be either a registered nurse or a surgical technologist (CST/CSFA) working under RN supervision. This means the minimum staffing per operating room is two people: an RN circulator and a scrub person. Additional personnel may be needed based on the complexity of the procedure, patient acuity, surgeon-specific requirements, and institutional policies. The RN circulator role cannot be delegated to LPN/LVNs in most state practice acts because the circulating role requires independent nursing judgment, patient assessment, medication administration, and coordination of care that exceed the LPN scope. The same person cannot simultaneously circulate and scrub because these roles require different locations in the room, different attire (sterile gown/gloves for scrub; non-sterile for circulating), and continuous attention that cannot be split safely between two distinct functions.",
    learningObjective: "Apply AORN perioperative staffing standards for minimum safe staffing in the operating room",
    blueprintCategory: "Management of Personnel",
    subtopic: "staffing standards",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "The circulator MUST be an RN — this role cannot be delegated to LPN/LVN. Minimum staffing per OR: 1 RN circulator + 1 scrub person (RN or CST).",
    clinicalPearls: [
      "Minimum OR staffing: 1 RN circulator + 1 scrub person (RN or CST) per operating room",
      "The circulating role requires RN-level judgment and cannot be delegated to LPN/LVN",
      "Additional staff may be needed based on procedure complexity and patient acuity"
    ],
    safetyNote: "Never allow one person to function as both circulator and scrub simultaneously — this compromises both sterile technique and patient monitoring",
    distractorRationales: [
      "Two surgical technologists without an RN circulator does not meet the RN requirement for the circulating role",
      "LPN/LVN cannot circulate in most states — the role requires independent RN-level nursing judgment",
      "One person cannot safely perform both roles simultaneously — different locations, attire, and continuous attention required"
    ]
  },
  {
    stem: "A perioperative nurse manager is implementing a quality improvement initiative to reduce first case delays. Which metric is MOST important to track for this initiative?",
    options: [
      "Total number of surgical cases performed per month",
      "First case on-time start rate — defined as the percentage of first cases that enter the operating room within a defined threshold of the scheduled start time",
      "Average surgeon satisfaction score",
      "Number of new surgical procedures added to the schedule each quarter"
    ],
    correctAnswer: 1,
    rationaleLong: "First case on-time start (FCOTS) is one of the most widely tracked perioperative efficiency metrics and is directly linked to overall OR utilization, patient satisfaction, and revenue generation. FCOTS is typically defined as the percentage of first-of-the-day cases in which the patient enters the operating room (or incision occurs, depending on institutional definition) within a defined threshold of the scheduled start time (commonly ±5-10 minutes). Late first case starts create a cascade effect: every subsequent case in that room is delayed, leading to increased overtime costs, patient and surgeon dissatisfaction, and potential case cancellations at the end of the day. Common causes of first case delays include: patient not ready (incomplete workup, laboratory results, consent), anesthesia delays (preoperative assessment, equipment setup), surgeon late to the OR, equipment or instrument unavailability, room setup delays, and staffing issues. The quality improvement approach should: (1) Collect baseline data on FCOTS rate and identify the most common delay reasons; (2) Implement targeted interventions for the top delay causes; (3) Monitor the FCOTS rate over time to assess improvement; (4) Provide feedback to surgeons, anesthesiologists, and nursing staff on their individual and departmental FCOTS performance. A common benchmark target is ≥80-90% FCOTS compliance.",
    learningObjective: "Identify first case on-time start rate as a key perioperative efficiency metric and understand its impact on OR utilization",
    blueprintCategory: "Management of Personnel",
    subtopic: "OR efficiency metrics",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "FCOTS delays cascade to ALL subsequent cases in that room. Target benchmark: ≥80-90% on-time start compliance.",
    clinicalPearls: [
      "First case on-time start (FCOTS) directly impacts all subsequent cases in the same room",
      "Common delay causes: patient not ready, anesthesia delays, surgeon late, equipment issues, staffing",
      "Target FCOTS benchmark: ≥80-90% within ±5-10 minutes of scheduled start time"
    ],
    safetyNote: "Late starts that result in end-of-day case cancellations can delay medically necessary procedures and compromise patient care",
    distractorRationales: [
      "Total case volume is important but does not specifically address the first case delay problem",
      "Surgeon satisfaction is a relevant outcome but is not the primary metric for a first case delay initiative",
      "New procedure volume is a strategic growth metric, not a first case delay metric"
    ]
  },
  {
    stem: "A perioperative educator is designing a competency validation program for newly hired perioperative nurses. Which educational methodology is MOST effective for developing intraoperative clinical decision-making skills?",
    options: [
      "Reading the AORN Guidelines for Perioperative Practice textbook from cover to cover",
      "High-fidelity simulation-based training that replicates realistic perioperative scenarios requiring clinical judgment, followed by structured debriefing",
      "Watching video recordings of surgical procedures",
      "Completing online multiple-choice examinations about perioperative nursing content"
    ],
    correctAnswer: 1,
    rationaleLong: "High-fidelity simulation-based training is the most effective methodology for developing clinical decision-making skills in perioperative nursing. Simulation allows learners to practice critical thinking, prioritization, team communication, and emergency response in a safe environment where errors become learning opportunities rather than patient safety events. Key elements of effective perioperative simulation include: (1) High-fidelity scenarios that replicate realistic OR situations (malignant hyperthermia crisis, OR fire, massive hemorrhage, incorrect counts, equipment failure); (2) Realistic equipment and environmental setup; (3) Standardized patients or high-fidelity manikins; (4) Active participation requiring real-time clinical decision-making; (5) Structured debriefing after each scenario — the debriefing is the most important component of simulation, as it is where the learning is consolidated through reflection, identification of performance gaps, and reinforcement of correct behaviors. Research demonstrates that simulation-based training improves: clinical competence, team communication (using CUS, SBAR, and other communication frameworks), confidence in handling emergencies, and patient safety outcomes. While textbook study, video observation, and knowledge assessments are all valuable components of a comprehensive orientation program, they primarily address cognitive learning (knowledge) rather than the psychomotor and affective domains (skills and attitudes) that are essential for intraoperative clinical decision-making.",
    learningObjective: "Identify simulation-based training as the most effective methodology for developing perioperative clinical decision-making skills",
    blueprintCategory: "Management of Personnel",
    subtopic: "competency development",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The DEBRIEFING component of simulation is the most important learning element — it is where performance is analyzed and learning is consolidated.",
    clinicalPearls: [
      "High-fidelity simulation + structured debriefing is the gold standard for clinical decision-making development",
      "Debriefing is the most critical component of simulation — this is where learning occurs",
      "Simulation addresses psychomotor and affective domains that textbooks and tests cannot"
    ],
    safetyNote: "Simulation-based competency validation should include perioperative emergencies (MH, fire, hemorrhage) that occur too rarely for adequate real-world exposure during orientation",
    distractorRationales: [
      "Textbook reading develops knowledge but not the clinical decision-making skills needed in the OR",
      "Video observation is passive learning that does not develop active clinical judgment",
      "Multiple-choice tests assess knowledge recall but not the real-time decision-making required in clinical practice"
    ]
  },
  {
    stem: "A perioperative nurse manager receives a report that OR room utilization has been declining over the past quarter. The current utilization rate is 62%. What is the generally accepted benchmark for optimal OR utilization?",
    options: [
      "40-50% to ensure adequate time for room turnover and emergencies",
      "75-85% which balances efficient use of resources with adequate capacity for add-on cases, emergencies, and room turnover",
      "95-100% to maximize revenue and minimize idle time",
      "There is no established benchmark — utilization targets are set arbitrarily"
    ],
    correctAnswer: 1,
    rationaleLong: "Operating room utilization is a key metric for perioperative resource management, defined as the percentage of available operating room time that is actually used for surgical procedures (including patient in-room time, setup, and turnover). The generally accepted benchmark for optimal OR utilization is 75-85%. This range represents a balance between: (1) Efficient use of expensive OR resources (staffing, equipment, facilities) — each OR costs $30-100 per minute to operate, so idle time is costly; (2) Adequate capacity for emergency and add-on cases — if utilization is too high (>85%), there is no room in the schedule to accommodate urgent cases without displacing elective cases; (3) Realistic room turnover time — between cases, the room must be terminally cleaned, restocked, and set up for the next case (typically 20-45 minutes); (4) Buffer for case duration variability — cases frequently run longer than scheduled, and a schedule with no buffer results in end-of-day delays and overtime. A utilization rate of 62% suggests significant underutilization of OR resources. The nurse manager should investigate potential causes: scheduling inefficiencies, excessive block time allocation, high cancellation rates, prolonged turnover times, or late first case starts. Conversely, utilization consistently above 85% suggests overscheduling, which leads to staff burnout, overtime, case bumping, and reduced capacity for emergencies.",
    learningObjective: "Apply OR utilization benchmarks to assess departmental efficiency and identify opportunities for improvement",
    blueprintCategory: "Management of Personnel",
    subtopic: "OR utilization",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Optimal OR utilization: 75-85%. Below 75% = underutilization (wasted resources). Above 85% = overscheduling (burnout, overtime, no emergency capacity).",
    clinicalPearls: [
      "Optimal OR utilization benchmark: 75-85%",
      "Each OR costs $30-100/minute to operate — underutilization wastes significant resources",
      "Over 85% utilization reduces emergency capacity and increases staff burnout and overtime"
    ],
    safetyNote: "Overscheduling ORs (>85% utilization) reduces emergency case capacity and increases staff fatigue — both compromise patient safety",
    distractorRationales: [
      "40-50% represents significant underutilization and waste of expensive OR resources",
      "95-100% is unrealistic and dangerous — no capacity for emergencies, turnovers, or case variability",
      "Established benchmarks exist based on extensive operational research in perioperative management"
    ]
  },
  {
    stem: "A new perioperative nurse is being oriented to the operating room. The preceptor is explaining the difference between delegation and assignment. Which statement best describes delegation in the perioperative setting?",
    options: [
      "Delegation and assignment are the same thing — both involve distributing tasks to team members",
      "Delegation is the transfer of responsibility for performing a nursing activity to a competent individual, while the RN retains accountability for the outcome — assignment is directing someone to perform a task within their own scope of practice",
      "Delegation transfers both responsibility and accountability to the person performing the task",
      "Only nurse managers can delegate — staff nurses can only assign tasks"
    ],
    correctAnswer: 1,
    rationaleLong: "Understanding the distinction between delegation and assignment is a fundamental professional accountability concept for perioperative nurses. Delegation is defined by the ANA and NCSBN as the process by which a registered nurse transfers responsibility for the performance of a selected nursing activity to a competent individual. Critically, the RN retains ACCOUNTABILITY for the outcome — the RN cannot delegate accountability. The five rights of delegation guide this process: Right Task (can the task be delegated?), Right Circumstance (is the situation appropriate for delegation?), Right Person (is the delegate competent?), Right Direction/Communication (have clear instructions been given?), and Right Supervision/Evaluation (is appropriate monitoring in place?). Assignment, in contrast, involves directing a person to perform a task that is within their own scope of practice and for which they have independent accountability. For example, when a charge nurse assigns an RN to circulate in a specific operating room, that is an assignment because circulating is within the RN's scope and the RN has independent accountability for their practice. When an RN asks a surgical technologist to perform a sponge count, that is delegation because the RN retains accountability for the accuracy of the count even though the CST performs the actual counting. This distinction is important because the RN must verify delegated tasks and cannot simply delegate and walk away.",
    learningObjective: "Differentiate between delegation and assignment in the perioperative setting and understand that accountability cannot be delegated",
    blueprintCategory: "Management of Personnel",
    subtopic: "delegation principles",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Delegation transfers RESPONSIBILITY but NOT ACCOUNTABILITY. The RN always retains accountability for the outcome of delegated tasks.",
    clinicalPearls: [
      "Delegation: transfer of responsibility; RN retains accountability for the outcome",
      "Five Rights of Delegation: Right Task, Circumstance, Person, Direction, Supervision",
      "Assignment: directing someone to perform a task within their own scope with independent accountability"
    ],
    safetyNote: "The RN must verify and evaluate the outcomes of all delegated tasks — delegation without appropriate supervision is unsafe",
    distractorRationales: [
      "Delegation and assignment are distinct concepts with different implications for accountability",
      "Delegation transfers responsibility but NOT accountability — the RN always retains accountability",
      "All RNs can delegate appropriate tasks to competent individuals — delegation is not limited to managers"
    ]
  },
  {
    stem: "The perioperative nurse manager is implementing a TeamSTEPPS communication framework to improve team communication in the operating room. Which communication tool specifically provides a structured method for raising safety concerns using the pattern of escalating assertiveness?",
    options: [
      "SBAR (Situation, Background, Assessment, Recommendation)",
      "CUS (I am Concerned, I am Uncomfortable, this is a Safety issue) — an escalating assertiveness model for voicing safety concerns",
      "I-PASS (Illness severity, Patient summary, Action list, Situation awareness, Synthesis by receiver)",
      "Teach-back method for patient education"
    ],
    correctAnswer: 1,
    rationaleLong: "CUS is a TeamSTEPPS communication tool specifically designed to provide a structured, escalating assertiveness framework for team members to voice safety concerns. CUS stands for: (C) 'I am Concerned' — the first level of assertiveness, expressing concern about a situation; (U) 'I am Uncomfortable' — the second level, indicating that the concern has risen to personal discomfort with the current course of action; (S) 'This is a Safety issue' — the highest level of assertiveness, indicating that the team member believes patient safety is at risk and the current action should stop. The CUS model is particularly valuable in the operating room because of the inherent power hierarchy between surgeons, anesthesiologists, and nurses. Traditional hierarchical cultures may discourage junior team members from speaking up about safety concerns to more senior team members. CUS provides a structured vocabulary that all team members recognize as escalating safety communication. When a team member uses 'S' (Safety issue), the entire team understands that this is the highest level of concern and the situation demands immediate attention. Other TeamSTEPPS tools include: SBAR (structured communication for handoffs and situation reports), call-outs and check-backs (closed-loop communication), two-challenge rule (voicing a concern twice if the initial concern is not acknowledged), and DESC script (Describe, Express, Suggest, Consequences) for managing conflict.",
    learningObjective: "Apply the CUS assertive communication model for escalating safety concerns in the perioperative team",
    blueprintCategory: "Management of Personnel",
    subtopic: "team communication",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "CUS = Concerned, Uncomfortable, Safety issue — escalating assertiveness. SBAR = Situation, Background, Assessment, Recommendation — structured communication.",
    clinicalPearls: [
      "CUS: Concerned → Uncomfortable → Safety issue — escalating assertiveness for safety concerns",
      "When someone says 'Safety issue,' the team must stop and address the concern immediately",
      "CUS overcomes hierarchical barriers to speaking up about patient safety"
    ],
    safetyNote: "All team members, regardless of role or seniority, must be empowered to use CUS when they perceive a safety risk",
    distractorRationales: [
      "SBAR is a structured communication tool for handoffs, not an escalating assertiveness model",
      "I-PASS is a handoff communication tool, not specifically designed for escalating safety concerns",
      "Teach-back is a patient education verification method, not a team safety communication tool"
    ]
  },
  {
    stem: "A perioperative nurse is serving as a preceptor for a new graduate nurse during an orientation program. The preceptee makes a medication administration error that is caught before the medication reaches the patient. How should the preceptor handle this learning opportunity?",
    options: [
      "Report the preceptee to the nurse manager for disciplinary action",
      "Use this as a constructive learning opportunity — discuss the error in a non-punitive manner, identify the system and knowledge factors that contributed to the near-miss, reinforce the correct process, and document the event as a learning experience in the orientation progress record",
      "Ignore the near-miss since no harm occurred and move on to the next case",
      "Remove the preceptee from patient care for the remainder of the shift"
    ],
    correctAnswer: 1,
    rationaleLong: "A near-miss event (an error that is caught before reaching the patient) during orientation provides a valuable learning opportunity. The preceptor should use a constructive, non-punitive approach consistent with just culture principles: (1) Discuss the error with the preceptee privately and non-judgmentally — focus on what happened, not blame ('Let's talk about what happened with the medication'); (2) Identify the contributing factors — was it a knowledge deficit (didn't know the drug), a system factor (similar packaging, look-alike/sound-alike drugs, distraction), or a process deviation (skipped a verification step)?; (3) Reinforce the correct process — review the five rights of medication administration, independent double-check procedures, and any relevant policies; (4) Discuss strategies to prevent recurrence — what will the preceptee do differently next time?; (5) Document the event in the orientation progress record — this is part of the formal competency assessment and helps track the preceptee's development; (6) Report the near-miss through the safety event reporting system — near-miss reporting enables the organization to identify and fix system vulnerabilities before they cause actual patient harm. Immediate disciplinary action for a learning-stage error during orientation is counterproductive and inconsistent with just culture. However, ignoring the event is also inappropriate — near-misses deserve analysis and learning.",
    learningObjective: "Apply just culture and preceptor principles to handle near-miss events during nursing orientation as constructive learning opportunities",
    blueprintCategory: "Management of Personnel",
    subtopic: "preceptor role",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Near-misses during orientation are learning opportunities, not disciplinary events. But they must NOT be ignored — analysis and documentation are essential.",
    clinicalPearls: [
      "Near-miss events are valuable learning opportunities — analyze contributing factors and reinforce correct processes",
      "Just culture: console human error, coach at-risk behavior, discipline only reckless behavior",
      "Report near-misses through the safety event system — they reveal system vulnerabilities"
    ],
    safetyNote: "Near-miss reporting is as important as actual error reporting — the same system failure that caused a near-miss could cause patient harm next time",
    distractorRationales: [
      "Disciplinary action for a learning-stage error during orientation is counterproductive and inconsistent with just culture",
      "Ignoring near-misses loses the learning opportunity and fails to identify system vulnerabilities",
      "Removing from patient care is excessive for a caught near-miss — continued supervised practice with corrective feedback is more appropriate"
    ]
  }
];
