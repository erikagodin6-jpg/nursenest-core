export interface NewGradGuideSection {
  id: string;
  title: string;
  overview: string;
  clinicalScenarios: { title: string; scenario: string; strategy: string }[];
  strategies: { title: string; description: string }[];
  tips: string[];
  commonMistakes: { mistake: string; correction: string }[];
  professionalInsights: string[];
  careerTips: string[];
}

export interface NewGradGuide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  heroSubtitle: string;
  color: string;
  colorAccent: string;
  icon: string;
  sections: NewGradGuideSection[];
}

export const NEWGRAD_GUIDES: NewGradGuide[] = [
  {
    slug: "guides",
    title: "New Grad Nursing Survival Guides",
    metaTitle: "New Grad Nurse Survival Guide | First Year Tips & Clinical Confidence | NurseNest",
    metaDescription: "Comprehensive survival guides for new graduate nurses. Transition to practice tips, shift organization, documentation strategies, and communication skills for your first year.",
    keywords: "new grad nurse survival guide, first year nurse tips, new graduate nursing, transition to practice, nursing orientation",
    heroSubtitle: "Evidence-based guides covering everything from your first shift to confident independent practice.",
    color: "#6C63FF",
    colorAccent: "#E8E6FF",
    icon: "BookOpen",
    sections: [
      {
        id: "transition-to-practice",
        title: "Transition to Practice",
        overview: "The transition from nursing student to independent practitioner is one of the most challenging periods in your nursing career. Research shows that new graduate nurses experience 'reality shock' — the gap between academic preparation and real-world clinical demands. Understanding this transition and preparing for common challenges can significantly reduce stress and improve patient outcomes.",
        clinicalScenarios: [
          { title: "Your First Admission", scenario: "You're assigned your first independent admission on a busy med-surg unit. The patient arrives from the ED with multiple active orders, a complex medication list, and a concerned family member asking questions.", strategy: "Use a systematic approach: complete the admission assessment using your facility's template, prioritize time-sensitive orders (stat labs, medications), communicate with the charge nurse about your workload, and set expectations with the family about your timeline. Don't try to do everything at once." },
          { title: "Rapid Response Call", scenario: "Your patient's condition deteriorates during your shift. Vital signs are trending downward, and you suspect the patient needs a higher level of care.", strategy: "Trust your clinical instincts. Use SBAR to communicate your concerns clearly: Situation (what's happening now), Background (relevant history), Assessment (your clinical findings), Recommendation (what you think should happen). Document everything and don't hesitate to call a rapid response." },
        ],
        strategies: [
          { title: "The First 30 Days Framework", description: "Focus on learning your unit's workflow, building relationships with your preceptor, and mastering core competencies. Don't worry about speed — accuracy and safety come first." },
          { title: "Clinical Confidence Building", description: "Keep a pocket reference guide with critical lab values, common medications, and assessment checklists. Review one clinical topic per week to build depth over time." },
          { title: "Reflection Practice", description: "After each shift, spend 10 minutes reflecting on what went well and what you'd do differently. This builds clinical judgment faster than passive studying." },
        ],
        tips: [
          "Arrive 15 minutes early to review your patient assignments and check overnight notes",
          "Introduce yourself to the charge nurse and ask about any critical patients on the unit",
          "Create a shift report sheet template that works for your unit's workflow",
          "Ask questions openly — experienced nurses respect curiosity over false confidence",
          "Build relationships with respiratory therapists, pharmacists, and case managers early",
        ],
        commonMistakes: [
          { mistake: "Trying to be fast instead of safe", correction: "Speed comes with experience. Focus on accuracy, double-checking medications, and following protocols. Safe practice is always the priority." },
          { mistake: "Not asking for help when overwhelmed", correction: "Experienced nurses expect new grads to need support. Asking for help demonstrates self-awareness and commitment to patient safety." },
          { mistake: "Comparing yourself to experienced nurses", correction: "You're in a different stage of your career. Your preceptor had their own learning curve too. Focus on your own growth trajectory." },
        ],
        professionalInsights: [
          "Most nurse managers expect new graduates to take 6-12 months to feel truly comfortable in their role.",
          "Research shows that structured preceptorship programs reduce new grad turnover by up to 50%.",
          "Imposter syndrome affects approximately 70% of new graduate nurses — it's normal and temporary.",
        ],
        careerTips: [
          "Document your competency milestones for future resume building",
          "Join a professional nursing organization during your first year",
          "Start building your professional network from day one of orientation",
        ],
      },
      {
        id: "shift-organization",
        title: "Shift Organization & Time Management",
        overview: "Time management is consistently identified as the biggest challenge for new graduate nurses. The ability to organize your shift, prioritize competing demands, and manage multiple patients safely is a skill that develops with practice and intentional strategy.",
        clinicalScenarios: [
          { title: "Multiple Patients with Competing Needs", scenario: "You have four patients. Patient A needs pain medication, Patient B's IV is beeping, Patient C's family is at the desk asking questions, and Patient D just returned from surgery. How do you prioritize?", strategy: "Use the ABCs and Maslow's hierarchy: address immediate safety concerns first (post-op assessment for Patient D), then urgent comfort needs (pain medication), then equipment alarms (IV pump), then family communication. Delegate what you can to nursing assistants." },
          { title: "Medication Pass Chaos", scenario: "Your 0800 medication pass includes 6 patients with a total of 30+ medications. Three patients need blood glucose checks first, and one has a new admission order.", strategy: "Start with time-sensitive medications (insulin, antibiotics with strict scheduling), then work systematically by room. Use your medication administration record to identify which meds can be given together versus separately. Ask for help if you're falling behind." },
        ],
        strategies: [
          { title: "Brain Sheet System", description: "Develop a standardized worksheet that tracks vital signs, medications, assessments, and to-do items for each patient. Update it throughout your shift as tasks are completed." },
          { title: "Cluster Care Approach", description: "Group nursing activities together — when entering a room for medication administration, also do your assessment, check IVs, and address comfort needs to minimize trips back and forth." },
          { title: "Time-Based Planning", description: "Map out your shift in time blocks: first hour for assessments, 0800-1000 for medication passes, scheduled documentation times, and built-in buffer time for unexpected events." },
        ],
        tips: [
          "Write down every task as it comes up — don't rely on memory during busy shifts",
          "Complete documentation in real-time whenever possible to avoid backlog",
          "Learn to delegate non-nursing tasks to CNAs and unit clerks appropriately",
          "Set personal deadlines for charting that are 30 minutes ahead of actual deadlines",
          "Keep frequently used supplies stocked in your pockets to save time",
        ],
        commonMistakes: [
          { mistake: "Trying to chart everything at end of shift", correction: "Chart assessments and interventions in real-time or as close to the event as possible. End-of-shift charting leads to missed details and overtime." },
          { mistake: "Not using delegation effectively", correction: "Your CNA is your partner in patient care. Clearly communicate tasks, expected timelines, and what findings to report back to you." },
          { mistake: "Spending too long on one patient", correction: "Set a mental timer for patient interactions. Address the most important needs, communicate your plan, and move on. You can return for non-urgent items." },
        ],
        professionalInsights: [
          "Studies show that effective time management reduces medication errors by 23%.",
          "The average nurse walks 4-5 miles per 12-hour shift — clustering care can cut this significantly.",
          "Experienced nurses report their time management skills took 12-18 months to fully develop.",
        ],
        careerTips: [
          "Time management skills are transferable to every nursing specialty",
          "Document examples of effective prioritization for performance reviews",
          "Consider creating unit-specific resources that help future new grads organize their shifts",
        ],
      },
      {
        id: "documentation",
        title: "Clinical Documentation Essentials",
        overview: "Accurate, timely, and thorough documentation is a cornerstone of safe nursing practice. As a new graduate, developing strong documentation habits early protects your patients, your license, and your institution. The mantra 'if it wasn't documented, it wasn't done' carries real legal and clinical weight.",
        clinicalScenarios: [
          { title: "Charting a Patient Fall", scenario: "Your patient falls while attempting to ambulate to the bathroom. They deny injury, but you notice a small skin tear on their forearm.", strategy: "Document the exact time, circumstances (patient attempted to ambulate independently), your assessment findings (vital signs, neurological check, skin tear location/size), interventions provided (wound care, notification of provider), patient response, and fall prevention measures implemented. File an incident report per facility policy." },
          { title: "Documenting Refusal of Care", scenario: "Your patient refuses their prescribed medication, stating they 'don't believe in pills.'", strategy: "Document the patient's exact words in quotes, your education provided about the medication's purpose and risks of refusal, the patient's understanding, and notification of the prescribing provider. Include that the patient was competent to make this decision." },
        ],
        strategies: [
          { title: "SOAP Note Framework", description: "Subjective (what the patient reports), Objective (your clinical findings), Assessment (your clinical judgment), Plan (interventions and next steps). This structure ensures comprehensive documentation." },
          { title: "Real-Time Documentation", description: "Document within 30 minutes of any significant event. Set alarms on your phone if needed to remind you to chart assessments and medication administration promptly." },
          { title: "Defensive Documentation", description: "Write as if your chart could be read in court. Be factual, objective, and specific. Avoid opinions, blame, or vague terms like 'appears normal.' Instead, document specific findings." },
        ],
        tips: [
          "Use specific measurements: '3cm x 2cm wound with serous drainage' instead of 'small wound'",
          "Document patient education provided and the patient's verbalized understanding",
          "Chart notifications to providers including time, method, and provider response",
          "Use facility-approved abbreviations only — when in doubt, spell it out",
          "Review your documentation at end of shift for completeness and accuracy",
        ],
        commonMistakes: [
          { mistake: "Using copy-forward without updating", correction: "Always review and update copied assessments. Carrying forward outdated information is both inaccurate and potentially dangerous." },
          { mistake: "Charting future events", correction: "Never pre-chart assessments or medications. If something changes, your documentation won't reflect what actually happened." },
          { mistake: "Using subjective language", correction: "Instead of 'patient seems anxious,' document 'patient reports feeling anxious, diaphoretic, heart rate elevated to 110 bpm.'" },
        ],
        professionalInsights: [
          "Approximately 75% of malpractice cases cite inadequate documentation as a contributing factor.",
          "Electronic health records have reduced documentation errors by 30% but increased documentation time by 20%.",
          "Strong documentation skills are consistently rated as one of the top qualities nurse managers look for in new graduates.",
        ],
        careerTips: [
          "Develop documentation efficiency early — it will serve you in every nursing role",
          "Ask experienced nurses to review your charting and provide feedback",
          "Familiarize yourself with your EHR system's shortcuts and templates",
        ],
      },
      {
        id: "communication",
        title: "Communication with Physicians & Team",
        overview: "Effective interprofessional communication is essential for patient safety and positive outcomes. New graduate nurses often feel intimidated communicating with physicians, but structured communication frameworks like SBAR provide confidence and clarity in these interactions.",
        clinicalScenarios: [
          { title: "Calling a Physician at 3 AM", scenario: "Your patient's blood pressure has dropped to 88/52 and heart rate is elevated to 118. The patient is on a fluid restriction and you need to contact the on-call physician.", strategy: "Prepare before calling: Have the patient's chart, current vitals, relevant labs, medication list, and your assessment ready. Use SBAR: 'This is [Name], RN on [Unit]. I'm calling about [Patient] in Room [X]. Situation: BP dropped to 88/52, HR 118. Background: Admitted for CHF, on fluid restriction. Assessment: I'm concerned about hypovolemia versus sepsis. Recommendation: Would you like me to start a fluid bolus and obtain blood cultures?'" },
        ],
        strategies: [
          { title: "SBAR Framework", description: "Situation, Background, Assessment, Recommendation. Practice this format until it becomes automatic. It organizes your thoughts and gives physicians the information they need to make decisions." },
          { title: "CUS Technique for Safety Concerns", description: "When you need to escalate: 'I'm Concerned,' 'I'm Uncomfortable,' 'This is a Safety issue.' Each level communicates increasing urgency." },
          { title: "Closed-Loop Communication", description: "Repeat back orders and verify understanding: 'To confirm, you'd like me to administer 500mL NS bolus over 30 minutes and recheck vitals in one hour. Is that correct?'" },
        ],
        tips: [
          "Always have relevant patient data in front of you before making a call",
          "Write down verbal orders immediately and read them back for confirmation",
          "Don't apologize for calling — you're advocating for your patient",
          "Follow up on pending orders and results proactively",
          "Document all communications with providers including time and content",
        ],
        commonMistakes: [
          { mistake: "Calling without preparation", correction: "Take 2 minutes to organize your thoughts and gather relevant data before picking up the phone. This saves time for both you and the provider." },
          { mistake: "Accepting unclear orders", correction: "If an order doesn't make sense or seems unsafe, question it. Ask for clarification: 'Can you help me understand the rationale for this dose?'" },
          { mistake: "Not escalating when necessary", correction: "If you feel a patient is deteriorating and the response is inadequate, use the chain of command. Most facilities have rapid response teams for this reason." },
        ],
        professionalInsights: [
          "The Joint Commission reports that communication failures are the leading cause of sentinel events.",
          "Structured communication tools like SBAR reduce adverse events by up to 30%.",
          "Physicians consistently rate nurses who use structured communication as more competent and reliable.",
        ],
        careerTips: [
          "Strong communication skills are the foundation of leadership roles in nursing",
          "Practice SBAR in low-stakes situations to build confidence for high-stakes ones",
          "Build professional relationships with providers through respectful, prepared communication",
        ],
      },
    ],
  },
  {
    slug: "career",
    title: "Nursing Career Pathways",
    metaTitle: "Nursing Career Pathways for New Grads | Specialties, Advancement & Growth | NurseNest",
    metaDescription: "Explore nursing career pathways for new graduates. Discover specialties, advancement opportunities, continuing education options, and leadership development strategies.",
    keywords: "nursing career pathways, new grad nursing specialties, nursing career advancement, nursing leadership, continuing education nursing",
    heroSubtitle: "Map your nursing career from first position through specialization, leadership, and advanced practice.",
    color: "#10B981",
    colorAccent: "#D1FAE5",
    icon: "TrendingUp",
    sections: [
      {
        id: "career-pathways",
        title: "Career Pathways & Specialization",
        overview: "Nursing offers extraordinary career flexibility with dozens of specialization options. Understanding these pathways early helps you make strategic decisions about your first position, continuing education, and long-term career goals.",
        clinicalScenarios: [
          { title: "Choosing Your First Specialty", scenario: "You've been offered positions on a med-surg unit and in the emergency department. You're not sure which will better prepare you for your long-term goal of becoming a nurse practitioner.", strategy: "Med-surg provides the broadest clinical foundation — you'll manage diverse patient populations across multiple body systems. This builds the assessment and critical thinking skills essential for NP practice. ED is excellent for acute care experience but may limit your medical management exposure. Consider starting in med-surg for 1-2 years, then transitioning to your target specialty." },
        ],
        strategies: [
          { title: "The 2-Year Foundation Strategy", description: "Spend your first 2 years building a solid clinical foundation in a general area. This gives you the experience base that specialty units and graduate programs require." },
          { title: "Certification Pathway Planning", description: "Research specialty certifications early. Most require 1-2 years of experience plus continuing education hours. Plan your CE activities to align with certification requirements." },
          { title: "Networking for Opportunities", description: "Join specialty nursing organizations, attend conferences, and connect with nurses in your target specialty. Internal transfers are often easier than external applications." },
        ],
        tips: [
          "Shadow nurses in specialties that interest you before committing to a transfer",
          "Most BSN-to-MSN programs require 1-2 years of clinical experience for admission",
          "Travel nursing can accelerate specialty exposure and significantly boost earnings",
          "Nurse residency programs in specialty areas provide structured transition support",
          "Document your specialty interests and relevant experience for future applications",
        ],
        commonMistakes: [
          { mistake: "Rushing into a specialty too early", correction: "Broad clinical experience in your first 1-2 years provides the foundation that makes you successful in any specialty. Don't skip the fundamentals." },
          { mistake: "Ignoring career planning", correction: "Set 1-year, 3-year, and 5-year career goals. Review them quarterly and adjust based on new interests and opportunities." },
          { mistake: "Not pursuing certifications", correction: "Specialty certifications demonstrate expertise, increase your earning potential, and make you competitive for advanced positions." },
        ],
        professionalInsights: [
          "Certified nurses earn an average of 7-12% more than non-certified nurses in the same role.",
          "The nursing profession offers over 100 specialty certification options through various credentialing organizations.",
          "Nurse practitioners are the fastest-growing advanced practice role with a projected 40% growth through 2032.",
        ],
        careerTips: [
          "Keep a professional portfolio documenting your certifications, achievements, and continuing education",
          "Seek mentors in your target specialty who can guide your career development",
          "Consider hospital-based leadership programs for management career tracks",
        ],
      },
      {
        id: "continuing-education",
        title: "Continuing Education & Lifelong Learning",
        overview: "Nursing is a profession of continuous learning. State licensing boards require ongoing continuing education, and staying current with evidence-based practice is essential for providing safe, effective care. Strategic CE planning accelerates both your clinical skills and career advancement.",
        clinicalScenarios: [
          { title: "Building a CE Portfolio", scenario: "Your license renewal requires 30 CE hours over 2 years, but you want to use this requirement strategically to advance your career.", strategy: "Align your CE activities with your career goals. If targeting ICU, focus on critical care CEs. Mix free online courses, conference attendance, and specialty-specific programs. Document everything in a professional portfolio that also serves as resume material." },
        ],
        strategies: [
          { title: "Strategic CE Planning", description: "Map your required CE hours to your career goals. Instead of random topics, focus on building depth in your target specialty while meeting licensing requirements." },
          { title: "Evidence-Based Practice Integration", description: "Subscribe to key nursing journals in your specialty. Read one research article per week and consider how findings apply to your daily practice." },
          { title: "Advanced Degree Planning", description: "If considering graduate school, research programs 1-2 years before applying. Many BSN-to-MSN or BSN-to-DNP programs allow part-time study while working." },
        ],
        tips: [
          "Many professional organizations offer free or discounted CE to members",
          "Hospital systems often provide internal CE opportunities and tuition reimbursement",
          "Online CE platforms allow flexible learning that fits around shift schedules",
          "Conference attendance provides both CE credit and valuable networking opportunities",
          "Track all CE completions in a central document for license renewal",
        ],
        commonMistakes: [
          { mistake: "Waiting until the last minute for CE requirements", correction: "Spread your CE activities throughout the renewal period. Last-minute cramming leads to poor learning and unnecessary stress." },
          { mistake: "Choosing only the easiest CE options", correction: "Challenge yourself with CE that builds new skills. Easy completions meet requirements but don't advance your practice." },
        ],
        professionalInsights: [
          "Nurses with advanced degrees earn significantly more over their careers — MSN-prepared nurses earn 25-35% more than BSN-prepared nurses.",
          "Employers increasingly prefer or require BSN-prepared nurses, making RN-to-BSN completion a wise investment.",
        ],
        careerTips: [
          "Many employers offer tuition reimbursement — take advantage of this benefit early in your career",
          "Consider becoming a preceptor after 2 years — teaching reinforces your own clinical knowledge",
        ],
      },
      {
        id: "leadership-development",
        title: "Leadership Development",
        overview: "Leadership in nursing isn't limited to management titles. Every nurse demonstrates leadership through patient advocacy, evidence-based practice, interprofessional collaboration, and mentoring. Developing leadership skills early positions you for formal leadership roles and makes you a more effective clinician.",
        clinicalScenarios: [
          { title: "Stepping Into Charge Nurse Role", scenario: "After 18 months on your unit, you're asked to serve as charge nurse for the first time. You'll be responsible for staffing assignments, admissions, and unit-level decision-making.", strategy: "Prepare by shadowing the current charge nurse for several shifts. Review acuity-based staffing assignment strategies. Communicate proactively with the nursing supervisor about any concerns. Remember that charge nurse leadership is about supporting your team, not controlling them." },
        ],
        strategies: [
          { title: "Shared Governance Participation", description: "Join your unit's practice council or hospital-wide committee. This builds leadership experience, demonstrates initiative, and gives you a voice in decisions that affect nursing practice." },
          { title: "Quality Improvement Projects", description: "Identify a clinical issue on your unit and propose a solution. QI projects demonstrate leadership, analytical thinking, and commitment to improving patient care." },
          { title: "Mentoring New Staff", description: "Once you're established (typically after 12-18 months), volunteer to mentor or precept new graduates. Teaching others solidifies your own knowledge and develops coaching skills." },
        ],
        tips: [
          "Read leadership books or listen to nursing leadership podcasts during your commute",
          "Seek feedback from colleagues about your communication and teamwork skills",
          "Volunteer for projects and committees that expand your visibility and skill set",
          "Develop conflict resolution skills — they're essential for any leadership role",
          "Build relationships across departments for a broader organizational perspective",
        ],
        commonMistakes: [
          { mistake: "Waiting to be asked before leading", correction: "Leadership opportunities are created, not given. Identify needs on your unit and propose solutions proactively." },
          { mistake: "Confusing leadership with authority", correction: "The most effective nurse leaders influence through expertise, empathy, and collaboration — not positional power." },
        ],
        professionalInsights: [
          "Nurse managers who were promoted from within their units report higher job satisfaction and team trust.",
          "Leadership development is the #1 factor that determines career advancement speed in nursing.",
        ],
        careerTips: [
          "Consider pursuing a Nurse Executive certification (NE-BC) if management interests you",
          "Hospital leadership fellowship programs are increasingly available for early-career nurses",
          "Document your leadership activities — committee work, precepting, and QI projects — for annual reviews",
        ],
      },
    ],
  },
  {
    slug: "interview",
    title: "Nursing Interview Preparation",
    metaTitle: "New Grad Nurse Interview Prep | 100+ Questions with STAR Answers | NurseNest",
    metaDescription: "Comprehensive nursing interview preparation for new graduates. Behavioral questions, clinical scenarios, STAR framework answers, and nurse manager insights to help you land your first position.",
    keywords: "new grad nurse interview questions, nursing interview preparation, STAR framework nursing, behavioral interview nurse, clinical interview questions nursing",
    heroSubtitle: "Master behavioral and clinical interview questions with structured STAR answers and insider tips from nurse managers.",
    color: "#F59E0B",
    colorAccent: "#FEF3C7",
    icon: "MessageSquare",
    sections: [
      {
        id: "behavioral-questions",
        title: "Behavioral Interview Questions",
        overview: "Behavioral interview questions make up approximately 70% of nursing interviews. They follow the format 'Tell me about a time when...' and are best answered using the STAR framework: Situation, Task, Action, Result. Preparing 8-10 STAR stories from your clinical rotations covers most behavioral categories.",
        clinicalScenarios: [
          { title: "Patient Advocacy Story", scenario: "An interviewer asks: 'Tell me about a time you advocated for a patient.' You need to demonstrate clinical judgment, communication skills, and patient-centered care.", strategy: "Choose a specific clinical rotation scenario where you identified a patient need, communicated it to the appropriate person, and achieved a positive outcome. Include what you observed, who you communicated with, how you communicated (SBAR), and the result for the patient." },
          { title: "Conflict Resolution", scenario: "The interviewer asks: 'Describe a situation where you had a conflict with a coworker or clinical instructor.'", strategy: "Select a scenario that shows emotional intelligence. Describe the situation factually, explain how you listened to the other perspective, the steps you took to resolve the conflict, and what you learned. Avoid blaming or speaking negatively about anyone." },
        ],
        strategies: [
          { title: "STAR Story Bank", description: "Prepare 8-10 clinical stories that can be adapted to different questions. Cover: patient advocacy, teamwork, conflict resolution, time management, error handling, learning from feedback, cultural sensitivity, and leadership." },
          { title: "The Pivot Technique", description: "If you don't have a perfect story for a question, use a related experience and connect it to the question's theme. Interviewers value authenticity and self-awareness over perfect answers." },
          { title: "Practice with Recording", description: "Record yourself answering common questions. Review for filler words, body language, and story completeness. Each STAR answer should be 2-3 minutes long." },
        ],
        tips: [
          "Every answer should include a specific clinical example — never give generic or hypothetical responses",
          "Quantify results when possible: 'The patient's SpO2 improved from 89% to 95%'",
          "Include what you learned or how you grew from each experience",
          "Practice answering questions aloud, not just in your head",
          "Research the hospital's mission and values and connect your answers to them",
        ],
        commonMistakes: [
          { mistake: "Giving hypothetical answers", correction: "Always use real examples from clinical rotations, simulation labs, or relevant life experiences. 'What I would do...' answers don't demonstrate competence." },
          { mistake: "Speaking negatively about instructors or facilities", correction: "Even if you had negative experiences, frame them as learning opportunities. Focus on what you gained rather than what went wrong." },
          { mistake: "Rambling without structure", correction: "Use STAR to keep answers focused. Practice timing yourself — most answers should be 2-3 minutes." },
        ],
        professionalInsights: [
          "Nurse managers report that preparation and enthusiasm are the top differentiators between candidates.",
          "Hospitals with new graduate residency programs evaluate candidates heavily on teamwork and communication skills.",
          "Following up with a personalized thank-you email within 24 hours increases callback rates by 25%.",
        ],
        careerTips: [
          "Keep a running document of STAR stories throughout nursing school and your first year",
          "Ask your preceptor for mock interview practice before applying to new positions",
          "Research common interview questions specific to the unit you're applying to",
        ],
      },
      {
        id: "clinical-scenarios",
        title: "Clinical Scenario Interview Questions",
        overview: "Clinical scenario questions test your critical thinking, prioritization skills, and patient safety knowledge. Unlike behavioral questions that ask about past experiences, these present hypothetical clinical situations and ask how you would respond.",
        clinicalScenarios: [
          { title: "Priority Setting Question", scenario: "'You have four patients. Patient A is having chest pain, Patient B needs a scheduled medication, Patient C's family is requesting a meeting, and Patient D needs help to the bathroom. How do you prioritize?'", strategy: "Use ABCs and Maslow's hierarchy: Assess Patient A immediately (potential MI — life-threatening), address Patient D's safety concern (fall risk), administer Patient B's scheduled medication, then arrange the family meeting for Patient C. Explain your rationale using clinical priority frameworks." },
          { title: "Medication Error Question", scenario: "'You realize you gave a patient the wrong dose of medication. What do you do?'", strategy: "Assess the patient for adverse effects, notify the charge nurse and attending physician immediately, document the error accurately, complete an incident report, and participate in the root cause analysis. Emphasize patient safety over self-protection." },
        ],
        strategies: [
          { title: "Think Aloud Approach", description: "Share your clinical reasoning process with the interviewer. They want to see how you think, not just what you'd do. Walk them through your assessment, priority-setting, and decision-making." },
          { title: "Framework-Based Answers", description: "Reference clinical frameworks: ABCs (Airway, Breathing, Circulation), Maslow's Hierarchy, nursing process (Assessment, Diagnosis, Planning, Implementation, Evaluation), and scope of practice." },
        ],
        tips: [
          "Always address patient safety first in any clinical scenario",
          "Mention delegation when appropriate — show you understand the nursing team's roles",
          "Ask clarifying questions if the scenario is unclear — this demonstrates critical thinking",
          "Reference evidence-based guidelines when possible",
          "Practice clinical scenarios with classmates or your preceptor",
        ],
        commonMistakes: [
          { mistake: "Forgetting to assess first", correction: "In any clinical scenario, your first step should always be assessment. Gather data before intervening." },
          { mistake: "Not mentioning documentation", correction: "Documentation is a key component of every clinical response. Include it in your answers." },
        ],
        professionalInsights: [
          "Nurse managers use clinical scenario questions to assess judgment, not textbook knowledge.",
          "Candidates who admit uncertainty and describe how they'd seek help score higher than those who give overconfident wrong answers.",
        ],
        careerTips: [
          "Review NCLEX-style clinical judgment questions to prepare for scenario-based interviews",
          "Practice responding to scenarios out loud under time pressure to build confidence",
        ],
      },
    ],
  },
  {
    slug: "resume",
    title: "Nursing Resume & Application Guide",
    metaTitle: "New Grad Nurse Resume Guide | ATS-Optimized Templates & Tips | NurseNest",
    metaDescription: "Build a standout nursing resume as a new graduate. ATS-optimized templates, clinical rotation formatting tips, cover letter frameworks, and application strategies for landing your first nursing position.",
    keywords: "new grad nurse resume, nursing resume template, ATS nursing resume, new graduate nurse cover letter, nursing job application tips",
    heroSubtitle: "Create an ATS-optimized nursing resume that highlights your clinical experience and gets you interviews.",
    color: "#8B5CF6",
    colorAccent: "#EDE9FE",
    icon: "FileText",
    sections: [
      {
        id: "resume-building",
        title: "Building Your Nursing Resume",
        overview: "Your nursing resume is often your first impression with a potential employer. As a new graduate, the challenge is demonstrating your clinical readiness despite limited work experience. The key is presenting your clinical rotations, skills, and education strategically using ATS-compatible formatting.",
        clinicalScenarios: [
          { title: "Translating Clinical Rotations to Resume Experience", scenario: "You completed clinical rotations in med-surg, pediatrics, labor and delivery, and mental health. How do you present this on your resume?", strategy: "List each rotation as a separate clinical experience entry. Include the facility name, unit type, dates, total clinical hours, patient population, and specific skills performed. Use action verbs: 'Performed comprehensive patient assessments,' 'Administered medications via PO, IV, and IM routes,' 'Educated patients on discharge instructions.'" },
        ],
        strategies: [
          { title: "ATS Optimization", description: "Use standard section headers (Education, Clinical Experience, Skills), avoid tables/graphics, use common fonts, and include keywords from the job posting. Most hospital systems use ATS to screen initial applications." },
          { title: "Skills Section Strategy", description: "List hard skills (IV insertion, catheterization, wound care, EKG interpretation) and clinical competencies (patient assessment, medication administration, SBAR communication) that match the target position." },
          { title: "Quantify Everything", description: "Numbers stand out: 'Managed care for 4-6 patients per shift,' 'Completed 120 clinical hours in med-surg setting,' 'Maintained 98% medication administration accuracy.'" },
        ],
        tips: [
          "Keep your resume to one page as a new graduate",
          "Include your expected graduation date and NCLEX eligibility if not yet licensed",
          "List BLS, ACLS, PALS, and any specialty certifications prominently",
          "Tailor your resume for each application using keywords from the job description",
          "Include clinical capstone or preceptorship details with specific competencies demonstrated",
          "Add relevant volunteer work, healthcare-related employment, and leadership roles",
        ],
        commonMistakes: [
          { mistake: "Using a non-healthcare resume template", correction: "Nursing resumes have unique sections (Clinical Rotations, Licenses/Certifications). Use a healthcare-specific template." },
          { mistake: "Including irrelevant work experience", correction: "Focus on healthcare-related experience. If space allows, non-healthcare roles that demonstrate customer service, teamwork, or leadership can be included briefly." },
          { mistake: "Submitting the same resume for every application", correction: "Customize your resume for each position. Mirror the job posting's language and highlight the most relevant experience." },
        ],
        professionalInsights: [
          "Nurse recruiters spend an average of 6-10 seconds on initial resume review.",
          "ATS systems filter out 75% of applications before a human sees them. Proper formatting and keywords are essential.",
          "Including clinical hours and specific skills performed significantly increases interview callbacks for new graduates.",
        ],
        careerTips: [
          "Start building your resume during your first semester of nursing school",
          "Keep a running document of skills performed, patient populations served, and clinical achievements",
          "Ask your clinical instructor or preceptor to serve as a reference and get their permission before listing them",
        ],
      },
      {
        id: "cover-letters",
        title: "Cover Letter Frameworks",
        overview: "A targeted cover letter can differentiate you from other new graduates. While not always required, a well-written cover letter demonstrates professionalism, genuine interest in the specific position, and communication skills that translate directly to nursing practice.",
        clinicalScenarios: [
          { title: "Writing to a Specific Unit", scenario: "You're applying to a pediatric intensive care unit at a children's hospital. How do you customize your cover letter?", strategy: "Research the hospital's pediatric programs, mention specific aspects that attract you, connect your pediatric clinical rotation experience to the unit's patient population, and explain why PICU aligns with your career goals. Show that you've done your homework about the specific unit and hospital." },
        ],
        strategies: [
          { title: "Three-Paragraph Framework", description: "Paragraph 1: Why you're applying and what draws you to this specific position/hospital. Paragraph 2: Your most relevant clinical experience and how it prepares you for this role. Paragraph 3: Your career goals and how this position fits your professional development plan." },
          { title: "Mirror the Job Posting", description: "Use specific language and keywords from the job description in your cover letter. This demonstrates that you've read the posting carefully and understand the role's requirements." },
        ],
        tips: [
          "Address the cover letter to the hiring manager by name whenever possible",
          "Research the hospital's mission, values, and recent achievements to reference",
          "Keep cover letters to one page with concise, impactful paragraphs",
          "Proofread multiple times — errors in a nursing application suggest attention-to-detail concerns",
          "Close with a clear call to action: 'I welcome the opportunity to discuss how my clinical experience aligns with your unit's needs'",
        ],
        commonMistakes: [
          { mistake: "Using a generic cover letter", correction: "Each cover letter should be customized for the specific hospital, unit, and position. Generic letters are immediately recognizable." },
          { mistake: "Repeating your resume", correction: "Your cover letter should complement your resume, not duplicate it. Use it to tell stories and show personality." },
        ],
        professionalInsights: [
          "Hiring managers report that personalized cover letters increase interview likelihood by 40%.",
          "Cover letters that reference specific hospital programs or values demonstrate genuine interest.",
        ],
        careerTips: [
          "Save your best cover letters as templates for future applications",
          "Ask a mentor or career advisor to review your cover letter before submitting",
        ],
      },
    ],
  },
  {
    slug: "workplace",
    title: "Workplace Navigation & Boundaries",
    metaTitle: "Workplace Navigation for New Grad Nurses | Professional Boundaries & Team Dynamics | NurseNest",
    metaDescription: "Navigate workplace dynamics as a new graduate nurse. Learn about professional boundaries, preceptor relationships, conflict resolution, and building effective team relationships.",
    keywords: "new nurse workplace tips, nursing professional boundaries, preceptor relationship nursing, workplace conflict nursing, new grad nurse team dynamics",
    heroSubtitle: "Navigate workplace dynamics, build professional relationships, and establish healthy boundaries in your first nursing position.",
    color: "#EC4899",
    colorAccent: "#FCE7F3",
    icon: "Users",
    sections: [
      {
        id: "workplace-dynamics",
        title: "Navigating Workplace Dynamics",
        overview: "Healthcare workplaces have complex social dynamics that can be challenging for new graduates. Understanding unit culture, building effective relationships, and navigating workplace politics are essential skills that aren't taught in nursing school but are critical for your success and well-being.",
        clinicalScenarios: [
          { title: "Dealing with a Difficult Colleague", scenario: "An experienced nurse on your unit consistently makes negative comments about new graduates and seems unwilling to help you when you have questions.", strategy: "First, don't take it personally — this behavior reflects their experience, not your worth. Seek support from your preceptor or charge nurse. Approach the colleague directly in a private moment: 'I value your experience and want to learn from you. Is there a better time I could ask questions?' If the behavior continues, document incidents and involve your manager." },
          { title: "Workplace Bullying", scenario: "You overhear colleagues making dismissive comments about your clinical skills. It's affecting your confidence and job satisfaction.", strategy: "Document specific incidents with dates, times, and witnesses. Speak with your preceptor or manager about your concerns. Most hospitals have zero-tolerance policies for workplace bullying. If internal resources don't help, contact your state nurses association or file a formal complaint." },
        ],
        strategies: [
          { title: "Observe Before Acting", description: "Spend your first 2-4 weeks observing unit culture, communication patterns, and informal hierarchies. Understanding the social landscape helps you navigate it effectively." },
          { title: "Build Alliances Strategically", description: "Identify colleagues who are supportive of new graduates and build relationships with them. A strong professional network provides support, learning opportunities, and advocacy." },
          { title: "Professional Communication Always", description: "Keep all workplace communication professional, including text messages and social media. What you say and write can have lasting professional consequences." },
        ],
        tips: [
          "Be the nurse who shows up prepared, asks thoughtful questions, and thanks people for their help",
          "Avoid participating in gossip or negative conversations about colleagues",
          "Learn everyone's name — including CNAs, unit clerks, housekeeping, and transport staff",
          "Express gratitude to those who help you learn — it builds goodwill and reciprocity",
          "Set up a meeting with your manager at 30, 60, and 90 days to discuss your progress",
        ],
        commonMistakes: [
          { mistake: "Trying to change unit culture as a new grad", correction: "Observe and adapt to the existing culture first. You can advocate for changes after you've established credibility and relationships." },
          { mistake: "Isolating yourself when struggling", correction: "Connect with other new graduates, your preceptor, or employee assistance programs. Isolation amplifies stress and reduces learning." },
        ],
        professionalInsights: [
          "Research shows that positive preceptor relationships are the #1 predictor of new graduate retention.",
          "New graduates who build strong interprofessional relationships report higher job satisfaction and lower burnout rates.",
        ],
        careerTips: [
          "Professional reputation is built over time through consistent, reliable behavior",
          "Document positive feedback and achievements for future performance reviews",
          "Consider joining a new graduate support group at your hospital for peer connection",
        ],
      },
      {
        id: "professional-boundaries",
        title: "Professional Boundaries",
        overview: "Maintaining appropriate professional boundaries protects both you and your patients. New graduates often struggle with boundary-setting as they navigate the emotional intensity of patient care and the desire to be helpful and liked by colleagues.",
        clinicalScenarios: [
          { title: "Patient Boundary Challenge", scenario: "A patient asks for your personal phone number because they 'want to stay in touch' after discharge. You've built a strong rapport during their hospitalization.", strategy: "Politely decline while validating the relationship: 'I appreciate our connection during your stay. For professional reasons, I'm not able to share personal contact information. I want to make sure you have all the resources you need for your recovery.' Redirect to appropriate discharge resources." },
        ],
        strategies: [
          { title: "Therapeutic Relationship Framework", description: "Remember that the nurse-patient relationship exists for the patient's benefit. Professional boundaries maintain the therapeutic nature of this relationship and protect both parties." },
          { title: "Work-Life Boundary Setting", description: "Establish clear boundaries between work and personal life. Avoid checking work emails at home, set limits on overtime, and maintain non-nursing relationships and activities." },
        ],
        tips: [
          "Never share personal contact information with patients or their families",
          "Maintain consistent professional behavior regardless of patient familiarity",
          "Discuss boundary challenges with your preceptor or manager for guidance",
          "Practice saying 'no' to overtime when you need recovery time",
          "Develop outside interests and relationships that provide perspective on your nursing role",
        ],
        commonMistakes: [
          { mistake: "Over-identifying with patients", correction: "Empathy is essential; over-identification leads to emotional exhaustion. Maintain compassionate professional distance." },
          { mistake: "Saying yes to every overtime request", correction: "Regular overtime leads to burnout and compromised patient care. Protect your rest and recovery time." },
        ],
        professionalInsights: [
          "Boundary violations are among the top reasons nurses face disciplinary action from licensing boards.",
          "Nurses who maintain work-life boundaries report 45% less burnout than those who don't.",
        ],
        careerTips: [
          "Strong boundary skills translate directly to charge nurse and leadership effectiveness",
          "Model healthy boundaries for other new graduates joining your unit",
        ],
      },
    ],
  },
  {
    slug: "burnout",
    title: "Burnout Prevention & Wellness",
    metaTitle: "New Grad Nurse Burnout Prevention | Wellness Strategies & Self-Care | NurseNest",
    metaDescription: "Prevent burnout as a new graduate nurse. Evidence-based wellness strategies, stress management techniques, self-care practices, and mental health resources for your first year in nursing.",
    keywords: "new nurse burnout prevention, nursing wellness, nurse self care, new grad stress management, nursing mental health, compassion fatigue nursing",
    heroSubtitle: "Protect your well-being with evidence-based burnout prevention strategies designed for new graduate nurses.",
    color: "#EF4444",
    colorAccent: "#FEE2E2",
    icon: "Heart",
    sections: [
      {
        id: "burnout-prevention",
        title: "Understanding & Preventing Burnout",
        overview: "Nursing burnout affects approximately 35-40% of nurses, with new graduates being particularly vulnerable during their first two years of practice. Burnout is characterized by emotional exhaustion, depersonalization, and reduced personal accomplishment. Recognizing early warning signs and implementing prevention strategies is essential for a sustainable nursing career.",
        clinicalScenarios: [
          { title: "Recognizing Early Burnout Signs", scenario: "You've been working for 6 months and notice you're dreading going to work, having trouble sleeping, feeling cynical about patient care, and withdrawing from friends and family.", strategy: "These are classic early burnout indicators. Take immediate action: speak with your manager about your workload, access your employee assistance program (EAP) for counseling, reconnect with non-nursing activities and relationships, and evaluate whether your current schedule is sustainable. Early intervention prevents progression to full burnout." },
          { title: "Compassion Fatigue After a Difficult Case", scenario: "A young patient on your unit passed away after a prolonged illness. You find yourself emotionally numb and having difficulty engaging with other patients.", strategy: "Compassion fatigue is a normal response to emotionally intense patient care. Attend the hospital's debrief session, speak with a chaplain or counselor, process the experience with trusted colleagues, and give yourself permission to grieve. Consider journaling about the experience to process your emotions." },
        ],
        strategies: [
          { title: "The Recovery Ritual", description: "Develop a transition routine between work and home: change clothes, listen to non-work music, take a shower, or do a brief meditation. This helps your brain shift from 'work mode' to 'life mode.'" },
          { title: "Three Pillars of Nurse Wellness", description: "Physical (adequate sleep, nutrition, exercise), Emotional (counseling, peer support, journaling), and Professional (continuing education, mentoring, career development). All three must be maintained for sustainability." },
          { title: "Saying No Strategically", description: "Learn to decline overtime, committee work, or additional responsibilities when your capacity is reached. Sustainable practice requires adequate recovery time between shifts." },
        ],
        tips: [
          "Prioritize sleep hygiene — especially important for night shift nurses",
          "Schedule non-negotiable self-care activities just like you schedule work shifts",
          "Maintain at least one hobby or interest completely unrelated to healthcare",
          "Build a support network of people who understand nursing demands",
          "Use your PTO — burnout prevention requires actual time away from work",
          "Know your employee assistance program (EAP) resources and don't hesitate to use them",
        ],
        commonMistakes: [
          { mistake: "Pushing through exhaustion as 'toughness'", correction: "Nursing culture sometimes glorifies overwork. This is neither healthy nor safe. Taking care of yourself is essential for taking care of patients." },
          { mistake: "Isolating when stressed", correction: "Reach out to peers, mentors, or professional counselors. Social connection is one of the strongest protective factors against burnout." },
          { mistake: "Using unhealthy coping mechanisms", correction: "Alcohol, overeating, and excessive screen time provide temporary relief but worsen burnout long-term. Invest in sustainable wellness practices." },
        ],
        professionalInsights: [
          "New graduate nurses who participate in structured wellness programs have 30% lower turnover rates.",
          "Research shows that just 10 minutes of daily mindfulness practice reduces nurse burnout symptoms by 25%.",
          "The average cost of replacing a nurse who leaves due to burnout is $40,000-$60,000 — hospitals are increasingly investing in wellness programs.",
        ],
        careerTips: [
          "Burnout prevention skills make you a more sustainable and effective nurse long-term",
          "Consider becoming a wellness champion on your unit after your first year",
          "Document your wellness strategies for potential future roles in nursing education or leadership",
        ],
      },
    ],
  },
  {
    slug: "salary",
    title: "Nursing Salary & Negotiation Guide",
    metaTitle: "New Grad Nurse Salary Guide | Negotiation Strategies & Compensation Data | NurseNest",
    metaDescription: "Navigate nursing salary expectations and negotiation as a new graduate. Regional salary data, benefits analysis, negotiation strategies, and total compensation comparison tools.",
    keywords: "new grad nurse salary, nursing salary negotiation, new nurse compensation, nursing salary by state, nurse benefits package, nursing pay scale",
    heroSubtitle: "Understand your worth and negotiate confidently with real salary data and proven negotiation strategies.",
    color: "#059669",
    colorAccent: "#D1FAE5",
    icon: "DollarSign",
    sections: [
      {
        id: "salary-landscape",
        title: "Understanding the Nursing Salary Landscape",
        overview: "Nursing compensation varies significantly by location, specialty, experience level, and employer type. Understanding these variables helps you evaluate offers, negotiate effectively, and plan your career for maximum earning potential. New graduate salaries have increased substantially in recent years due to nursing shortages.",
        clinicalScenarios: [
          { title: "Evaluating a Job Offer", scenario: "You receive an offer with a base salary of $58,000, $3,000 sign-on bonus, and a benefits package including health insurance, retirement matching, and tuition reimbursement.", strategy: "Calculate the total compensation: base salary + employer benefits contribution + signing bonus + overtime potential + shift differentials. Compare this to market data for your region. Research the cost of living and factor in commute costs, parking fees, and required certifications. A lower base salary with strong benefits may exceed a higher base salary with minimal benefits." },
        ],
        strategies: [
          { title: "Total Compensation Analysis", description: "Look beyond base salary. Factor in health insurance (employer contribution), retirement matching, tuition reimbursement, PTO/sick time, shift differentials, overtime availability, sign-on bonuses, and professional development stipends." },
          { title: "Market Research Method", description: "Use salary databases (Bureau of Labor Statistics, PayScale, Glassdoor), connect with recent graduates in your market, and check hospital job postings for published salary ranges. This data provides leverage in negotiations." },
          { title: "Negotiation Framework", description: "Express enthusiasm for the position, present your research-based salary expectations, highlight unique qualifications, and be willing to negotiate on non-salary items (schedule flexibility, tuition reimbursement, start date) if salary is firm." },
        ],
        tips: [
          "Research typical new grad salaries in your specific geographic area before interviews",
          "Night and weekend shift differentials can add $5,000-$15,000 annually",
          "Tuition reimbursement is worth $5,000-$20,000 per year if you plan to continue education",
          "Sign-on bonuses typically require a 1-2 year commitment — factor this into your decision",
          "Union hospitals often have standardized pay scales with less room for individual negotiation",
          "Understand the difference between gross pay and take-home pay, especially for new grads",
        ],
        commonMistakes: [
          { mistake: "Accepting the first offer without negotiating", correction: "Most employers expect some negotiation. Even a modest increase in starting salary compounds significantly over your career." },
          { mistake: "Focusing only on base salary", correction: "Total compensation includes benefits that can be worth $15,000-$30,000 annually. A lower salary with excellent benefits may be the better deal." },
          { mistake: "Not understanding your market value", correction: "Research salary data for your specific region, specialty, and experience level before entering negotiations." },
        ],
        professionalInsights: [
          "New graduate nurses who negotiate their starting salary earn an average of $5,000-$8,000 more in their first year.",
          "The nursing shortage has pushed new graduate starting salaries up 10-15% in most markets since 2020.",
          "Travel nursing can boost early-career earnings by 50-100%, but requires flexibility and adaptability.",
        ],
        careerTips: [
          "Keep a record of your market research for future salary negotiations and job changes",
          "Negotiate salary increases at annual reviews with documented achievements and market data",
          "Consider the long-term earning potential of different career paths when making early career decisions",
        ],
      },
    ],
  },
  {
    slug: "professional-development",
    title: "Professional Development & Growth",
    metaTitle: "New Grad Nurse Professional Development | Growth Strategies & Career Planning | NurseNest",
    metaDescription: "Accelerate your professional development as a new graduate nurse. Career planning frameworks, certification pathways, mentoring strategies, and professional portfolio building.",
    keywords: "new nurse professional development, nursing career growth, nursing mentorship, nursing certification pathways, nursing portfolio, professional nursing organizations",
    heroSubtitle: "Build a strategic professional development plan that accelerates your nursing career from day one.",
    color: "#2563EB",
    colorAccent: "#DBEAFE",
    icon: "Award",
    sections: [
      {
        id: "professional-growth",
        title: "Strategic Professional Growth",
        overview: "Professional development in nursing goes beyond continuing education credits. It encompasses building a professional identity, developing expertise, contributing to the profession, and strategically positioning yourself for advancement. Starting this process in your first year sets you apart from peers and accelerates career growth.",
        clinicalScenarios: [
          { title: "Building Your Professional Portfolio", scenario: "You're 8 months into your first position and want to start documenting your professional growth for future opportunities.", strategy: "Create a professional portfolio that includes: your current resume (updated regularly), copies of certifications and licenses, documentation of CE activities, letters of recommendation, examples of quality improvement projects, committee participation records, and a professional development plan with goals and timelines." },
        ],
        strategies: [
          { title: "90-Day Growth Cycles", description: "Set professional development goals in 90-day cycles. Each cycle should include one clinical skill to master, one professional relationship to build, and one career development activity to complete." },
          { title: "Mentorship Strategy", description: "Identify 2-3 mentors at different career stages: a peer mentor (1-2 years ahead of you), a mid-career mentor (in your target specialty), and a senior mentor (in a leadership role you aspire to). Each provides different perspectives and guidance." },
          { title: "Professional Visibility", description: "Attend professional conferences, present at unit meetings, participate in journal clubs, and contribute to evidence-based practice committees. Visibility builds reputation and creates opportunities." },
        ],
        tips: [
          "Join at least one professional nursing organization during your first year",
          "Subscribe to journals in your specialty — read one article per week minimum",
          "Volunteer for committees and projects that expose you to hospital leadership",
          "Attend at least one professional conference per year for networking and learning",
          "Start a professional development journal to track goals, achievements, and reflections",
          "Connect with nursing colleagues on LinkedIn and maintain a professional online presence",
        ],
        commonMistakes: [
          { mistake: "Waiting for opportunities to come to you", correction: "Proactively seek development opportunities. Volunteer for projects, request challenging assignments, and express your career interests to your manager." },
          { mistake: "Focusing only on clinical skills", correction: "Leadership, communication, and organizational skills are equally important for career advancement. Develop all dimensions of your professional identity." },
          { mistake: "Not maintaining a professional portfolio", correction: "Start documenting your achievements now. When opportunities arise, you'll have evidence of your qualifications ready." },
        ],
        professionalInsights: [
          "Nurses who engage in professional development activities within their first year are 60% more likely to be promoted within 3 years.",
          "Professional organization membership provides networking, CE opportunities, and advocacy representation.",
          "Building a professional portfolio is increasingly required for specialty certification and graduate school applications.",
        ],
        careerTips: [
          "Set a calendar reminder to update your resume and portfolio quarterly",
          "Identify professional development opportunities that your employer will sponsor or reimburse",
          "Consider pursuing a specialty certification within your first 2-3 years of practice",
        ],
      },
    ],
  },
];

export function getNewGradGuideBySlug(slug: string): NewGradGuide | undefined {
  return NEWGRAD_GUIDES.find(g => g.slug === slug);
}
