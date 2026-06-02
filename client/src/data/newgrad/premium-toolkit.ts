export interface ResumeTemplate {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  sections: string[];
  preview: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  sampleAnswer: string;
  tips: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface SalaryData {
  region: string;
  specialty: string;
  entryLevel: string;
  midCareer: string;
  experienced: string;
  notes: string;
}

export interface CareerFramework {
  id: string;
  title: string;
  description: string;
  steps: { title: string; description: string; timeline: string }[];
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "med-surg-new-grad",
    title: "Med-Surg New Graduate Resume",
    description: "ATS-optimized resume template for new graduate nurses applying to medical-surgical units. Highlights clinical rotations, assessment skills, and medication administration experience.",
    targetRole: "Medical-Surgical RN",
    sections: ["Professional Summary", "Education", "Licenses & Certifications", "Clinical Rotations", "Skills", "Professional Memberships"],
    preview: "Professional Summary: Compassionate and detail-oriented new graduate BSN-prepared registered nurse with 720+ clinical hours across medical-surgical, pediatric, and critical care settings. Strong foundation in patient assessment, medication administration, and interdisciplinary communication. Seeking a medical-surgical RN position to apply clinical judgment and evidence-based practice skills in a fast-paced acute care environment.",
  },
  {
    id: "icu-new-grad",
    title: "ICU New Graduate Resume",
    description: "Specialized resume template for new graduates targeting intensive care unit positions. Emphasizes critical care clinical hours, advanced skills, and certification readiness.",
    targetRole: "ICU RN",
    sections: ["Professional Summary", "Education", "Licenses & Certifications", "Critical Care Clinical Experience", "Advanced Skills", "Professional Development"],
    preview: "Professional Summary: Highly motivated new graduate registered nurse with BSN and 180+ critical care clinical hours. Demonstrated proficiency in hemodynamic monitoring, ventilator management, and ACLS protocols. Capstone experience in a 24-bed MICU with exposure to complex multi-system patients. ACLS and BLS certified with strong critical thinking and rapid assessment skills.",
  },
  {
    id: "er-new-grad",
    title: "Emergency Department New Graduate Resume",
    description: "Resume template optimized for emergency nursing applications. Highlights triage experience, rapid assessment skills, and emergency care competencies.",
    targetRole: "Emergency Department RN",
    sections: ["Professional Summary", "Education", "Licenses & Certifications", "Emergency & Acute Care Experience", "Competencies", "Volunteer Experience"],
    preview: "Professional Summary: Energetic and adaptable new graduate RN with BSN degree and clinical experience in emergency department, trauma, and acute care settings. 160+ hours of ED clinical rotation with exposure to triage, rapid assessment, and multi-patient management. BLS, ACLS, and TNCC certified. Thrives in fast-paced environments with strong prioritization and communication skills.",
  },
  {
    id: "pediatric-new-grad",
    title: "Pediatric Nursing New Graduate Resume",
    description: "Tailored resume for new graduates applying to pediatric units, children's hospitals, or NICU positions.",
    targetRole: "Pediatric RN / NICU RN",
    sections: ["Professional Summary", "Education", "Licenses & Certifications", "Pediatric Clinical Experience", "Family-Centered Care Skills", "Community Involvement"],
    preview: "Professional Summary: Dedicated new graduate BSN-prepared nurse with a passion for pediatric and family-centered care. 200+ clinical hours in pediatric acute care, NICU, and outpatient pediatric settings. Experienced in developmental assessment, family education, and age-appropriate care delivery. PALS and NRP certified with strong therapeutic communication skills.",
  },
  {
    id: "cover-letter-template",
    title: "New Graduate Nursing Cover Letter",
    description: "Customizable cover letter framework with unit-specific variations for med-surg, ICU, ER, L&D, pediatrics, and specialty applications.",
    targetRole: "All Nursing Positions",
    sections: ["Opening Hook", "Clinical Experience Connection", "Career Goal Alignment", "Professional Closing"],
    preview: "Dear [Hiring Manager Name], I am writing to express my enthusiastic interest in the [Unit] Registered Nurse position at [Hospital Name]. As a recent BSN graduate from [School] with [X] clinical hours and a deep commitment to [specialty area], I am excited about the opportunity to contribute to your team's mission of [reference hospital mission].",
  },
];

export const INTERVIEW_QUESTION_BANK: InterviewQuestion[] = [
  {
    id: "iq-1",
    category: "Patient Advocacy",
    question: "Tell me about a time you advocated for a patient.",
    sampleAnswer: "During my med-surg clinical rotation, I noticed a 78-year-old patient with diabetes was being served a regular diet tray despite having a diabetic diet order. I verified the order in the chart, contacted dietary services to correct the tray, informed my preceptor, and documented the dietary error. The patient received the correct meal, and I learned the importance of verifying even routine aspects of patient care.",
    tips: ["Use a specific clinical example", "Show your assessment and critical thinking process", "Emphasize the positive outcome for the patient", "Mention communication and documentation"],
    difficulty: "beginner",
  },
  {
    id: "iq-2",
    category: "Error Management",
    question: "Describe a time you made a mistake in clinical. How did you handle it?",
    sampleAnswer: "During my third clinical rotation, I nearly administered the wrong dose of metoprolol. I caught the error during my final rights check before administration. I immediately stopped, rechecked the MAR, consulted with my preceptor, and prepared the correct dose. I then voluntarily filed an incident report documenting the near-miss and participated in a debrief with my clinical instructor. The transparency led to a unit-wide discussion about medication safety.",
    tips: ["Show honesty and accountability", "Describe your immediate corrective actions", "Include what you learned", "Demonstrate commitment to patient safety culture"],
    difficulty: "intermediate",
  },
  {
    id: "iq-3",
    category: "Teamwork",
    question: "Give an example of a time you worked effectively as part of a team.",
    sampleAnswer: "During a clinical rotation in the ED, we received notification of a multi-vehicle accident with 4 incoming patients. I worked with my preceptor, two other RNs, and an ER tech to prepare rooms, gather supplies, and assign roles. I was responsible for documentation and vital sign monitoring for two patients. Clear communication and defined roles allowed us to stabilize all patients efficiently. I learned the critical importance of teamwork in high-acuity situations.",
    tips: ["Describe your specific role and contributions", "Show awareness of team dynamics", "Highlight communication skills", "Connect to patient outcomes"],
    difficulty: "beginner",
  },
  {
    id: "iq-4",
    category: "Conflict Resolution",
    question: "Tell me about a time you had a disagreement with a colleague or instructor.",
    sampleAnswer: "My preceptor and I disagreed about the best approach to wound care for a patient with a stage 3 pressure ulcer. I had learned a newer evidence-based technique in school, while my preceptor preferred the traditional method. Instead of challenging her directly, I asked if she could explain her approach, shared the recent research I'd read, and suggested we consult the wound care nurse. The wound care nurse confirmed the newer approach, and my preceptor appreciated my respectful way of raising the issue.",
    tips: ["Show emotional intelligence and respect", "Focus on resolution, not the conflict", "Demonstrate evidence-based thinking", "Avoid speaking negatively about anyone"],
    difficulty: "intermediate",
  },
  {
    id: "iq-5",
    category: "Prioritization",
    question: "How do you prioritize when you have multiple patients with competing needs?",
    sampleAnswer: "I use ABC assessment and Maslow's hierarchy to prioritize. During my capstone, I had a patient with acute chest pain, another requesting pain medication, and a third whose family needed a discharge education session. I immediately assessed the chest pain patient, called a rapid response, delegated the pain medication administration to my preceptor, and scheduled the discharge education for after the acute situation was stabilized. I documented all interventions and communicated status updates to the charge nurse.",
    tips: ["Reference clinical prioritization frameworks", "Give a specific example with multiple patients", "Show delegation skills", "Include documentation and communication"],
    difficulty: "advanced",
  },
  {
    id: "iq-6",
    category: "Cultural Sensitivity",
    question: "Describe a situation where you cared for a patient from a different cultural background.",
    sampleAnswer: "I cared for a Somali patient whose family requested that only female nurses provide care, and the patient preferred having family present during assessments. I coordinated with the charge nurse to ensure female nursing staff were assigned, arranged for an interpreter for medical discussions, and adapted my assessment approach to maintain the patient's cultural comfort while ensuring thorough care. I documented the cultural care preferences in the care plan for continuity.",
    tips: ["Show cultural awareness and respect", "Describe concrete accommodations you made", "Include how you ensured quality care was maintained", "Mention interdisciplinary collaboration"],
    difficulty: "intermediate",
  },
  {
    id: "iq-7",
    category: "Stress Management",
    question: "How do you handle stress in high-pressure clinical situations?",
    sampleAnswer: "During a code blue in my critical care rotation, I initially felt overwhelmed but quickly focused on my assigned role: documenting the timeline and interventions. I used controlled breathing to manage my anxiety, followed the code team's structured communication protocol, and maintained accurate records throughout the 20-minute resuscitation. Afterward, I participated in the debrief session and reflected on what I learned. I now use controlled breathing and mental preparation before entering high-pressure situations.",
    tips: ["Give a real clinical example", "Show self-awareness about your stress response", "Describe healthy coping mechanisms", "Include what you learned"],
    difficulty: "intermediate",
  },
  {
    id: "iq-8",
    category: "Time Management",
    question: "Tell me about a time you had to manage multiple tasks under a tight deadline.",
    sampleAnswer: "During my final semester clinical rotation, I was assigned 4 patients on a busy med-surg unit. I had morning medications due at 0800, two patients needing blood glucose checks before meals, a new admission arriving at 0830, and scheduled dressing changes for two patients. I created a prioritized task list, completed blood glucose checks first, administered time-sensitive medications, performed a focused admission assessment, and scheduled dressing changes for mid-morning. I communicated my plan to my preceptor and CNA to ensure nothing was missed.",
    tips: ["Describe your organizational strategy", "Show prioritization skills", "Include delegation when appropriate", "Quantify your workload"],
    difficulty: "beginner",
  },
  {
    id: "iq-9",
    category: "Behavioral (STAR)",
    question: "Tell me about a situation where you went above and beyond for a patient.",
    sampleAnswer: "Situation: During my pediatric rotation, I was caring for a 6-year-old patient who was terrified of blood draws and had been crying for hours. Task: I needed to find a way to make the experience less traumatic while ensuring the lab work was completed. Action: I spent time building rapport through age-appropriate play, used distraction techniques with bubble-blowing during the draw, and created a 'bravery certificate' for the child. Result: The blood draw was completed successfully with minimal distress, and the parents expressed profound gratitude. The charge nurse implemented distraction kits on the unit based on my approach.",
    tips: ["Structure your answer clearly using Situation, Task, Action, Result", "Quantify the impact when possible", "Show initiative beyond the minimum expectation", "Connect your actions to improved patient outcomes"],
    difficulty: "beginner",
  },
  {
    id: "iq-10",
    category: "Behavioral (STAR)",
    question: "Describe a time you identified a safety concern before it became a problem.",
    sampleAnswer: "Situation: During my med-surg rotation, I noticed a patient's armband had a different allergy listed than what was documented in the electronic health record. Task: I needed to verify the correct allergy information before any medications were administered. Action: I paused the medication pass, confirmed the allergy directly with the patient and family, cross-referenced with the pharmacy records, and alerted the charge nurse. I updated the EHR, ordered a new armband, and communicated the discrepancy to all team members during huddle. Result: The patient had a documented penicillin allergy that was missing from the armband, and an antibiotic in that class had been ordered. The medication was changed, preventing a potential allergic reaction.",
    tips: ["Emphasize proactive identification, not reactive response", "Show systematic verification and follow-through", "Highlight communication to the full care team", "Demonstrate understanding of error prevention culture"],
    difficulty: "intermediate",
  },
  {
    id: "iq-11",
    category: "Behavioral (STAR)",
    question: "Give an example of a time you had to adapt quickly to an unexpected change.",
    sampleAnswer: "Situation: Midway through my shift, two nurses called in sick and I was reassigned two additional patients, bringing my total to six on a busy med-surg unit. Task: I needed to safely manage the increased workload without compromising patient care. Action: I immediately reassessed priorities using ABC framework, delegated vital signs and hygiene tasks to the CNA, communicated with the charge nurse about which patients were highest acuity, and adjusted my documentation schedule. I also asked a more experienced nurse if she could serve as a resource for my two new patients during the transition. Result: All patients received safe, timely care. My charge nurse commended my adaptability and communication during the staffing challenge.",
    tips: ["Show flexibility and positive attitude toward change", "Demonstrate prioritization under pressure", "Include how you communicated and delegated", "Focus on patient safety outcomes"],
    difficulty: "intermediate",
  },
  {
    id: "iq-12",
    category: "Behavioral (STAR)",
    question: "Tell me about a time you received feedback that was difficult to hear. How did you respond?",
    sampleAnswer: "Situation: My preceptor told me that my documentation was too vague and wouldn't hold up to legal scrutiny. Task: I needed to accept the feedback constructively and improve my charting skills. Action: I asked my preceptor for specific examples of where my documentation fell short, reviewed the facility's charting guidelines, and created a personal documentation checklist. I also asked to review charts from experienced nurses to learn best practices. Over the following weeks, I had my preceptor review my notes before finalizing them. Result: Within three weeks, my preceptor noted significant improvement in the specificity and defensibility of my documentation. I developed habits that I continue to use.",
    tips: ["Show emotional maturity and openness to growth", "Describe concrete steps you took to improve", "Avoid being defensive about the feedback", "Show the positive outcome and lasting change"],
    difficulty: "beginner",
  },
  {
    id: "iq-13",
    category: "Behavioral (STAR)",
    question: "Describe a situation where you had to learn something new quickly in a clinical setting.",
    sampleAnswer: "Situation: During my critical care rotation, I was assigned a patient on a continuous renal replacement therapy (CRRT) machine — something I had only briefly covered in class. Task: I needed to understand the machine's operation, troubleshoot alarms, and monitor the patient effectively. Action: I asked my preceptor for a focused tutorial, reviewed the unit's CRRT protocol, watched an online training module during my break, and took detailed notes. I also created a quick-reference card with alarm meanings and troubleshooting steps. Result: By the end of the shift, I was independently managing routine CRRT monitoring and could explain the therapy rationale to the patient's family. My preceptor used my reference card for future student orientations.",
    tips: ["Show eagerness to learn and resourcefulness", "Describe multiple learning strategies you used", "Demonstrate how you applied the knowledge", "Highlight any lasting contribution from your learning"],
    difficulty: "intermediate",
  },
  {
    id: "iq-14",
    category: "Specialty - ICU",
    question: "What interests you about critical care nursing, and how have you prepared for this specialty?",
    sampleAnswer: "Critical care nursing appeals to me because of the complexity of patient management, the depth of pathophysiology knowledge required, and the opportunity to make immediate, measurable impacts on patient outcomes. During my nursing program, I completed 180 hours in a medical ICU where I gained experience with hemodynamic monitoring, ventilator management, and vasoactive drip titration. I'm ACLS certified and have completed additional coursework in advanced cardiac assessment. I've also joined the AACN student chapter and attend monthly journal clubs focused on critical care research.",
    tips: ["Be specific about your ICU clinical experience and hours", "Mention relevant certifications (ACLS, CCRN readiness)", "Show knowledge of ICU-specific skills and equipment", "Demonstrate commitment through professional development"],
    difficulty: "intermediate",
  },
  {
    id: "iq-15",
    category: "Specialty - ICU",
    question: "How would you approach caring for a patient on multiple vasoactive drips?",
    sampleAnswer: "I would start by understanding each medication's mechanism, target parameters, and titration protocols. I'd assess the patient's hemodynamic status using arterial line readings, MAP targets, and clinical signs of perfusion. I would ensure all drips are on dedicated lines with proper labeling, verify compatibility, and document titration changes with corresponding vital sign responses. I'd communicate any significant changes to the attending physician using SBAR and collaborate with pharmacy for complex drug interactions. Patient safety checks would include verifying pump settings against orders every hour.",
    tips: ["Demonstrate understanding of hemodynamic monitoring", "Show awareness of medication safety practices", "Include communication and documentation steps", "Mention collaboration with pharmacy and physicians"],
    difficulty: "advanced",
  },
  {
    id: "iq-16",
    category: "Specialty - ICU",
    question: "Describe how you would respond to a ventilator alarm for high peak pressures.",
    sampleAnswer: "I would immediately assess the patient at the bedside — checking for signs of respiratory distress, secretions, or patient-ventilator dyssynchrony. I'd systematically evaluate: is the patient biting the tube, are there excessive secretions requiring suctioning, has the patient's position shifted, or is there evidence of pneumothorax? I would check the circuit for kinks or water accumulation, assess lung sounds bilaterally, and review recent chest X-ray findings. If the cause isn't immediately identifiable and the patient is deteriorating, I would call the respiratory therapist and notify the physician while preparing for potential emergency interventions.",
    tips: ["Show systematic assessment approach", "Demonstrate understanding of common causes", "Include collaboration with respiratory therapy", "Mention escalation criteria"],
    difficulty: "advanced",
  },
  {
    id: "iq-17",
    category: "Specialty - ER",
    question: "How would you handle a busy emergency department with multiple patients arriving simultaneously?",
    sampleAnswer: "I would rely on triage principles using the Emergency Severity Index to rapidly categorize incoming patients. I'd assess for immediate life threats first — airway, breathing, circulation — and identify which patients need immediate intervention versus those who can safely wait. I'd communicate clearly with the charge nurse about incoming acuity levels, delegate tasks like obtaining vital signs to techs, and maintain awareness of all my patients through frequent reassessments. Documentation would be focused and concise to keep pace with the clinical demands.",
    tips: ["Reference triage frameworks (ESI, START)", "Show ability to prioritize under pressure", "Include delegation and teamwork", "Demonstrate awareness of documentation needs"],
    difficulty: "intermediate",
  },
  {
    id: "iq-18",
    category: "Specialty - ER",
    question: "Tell me about a time you had to provide care in a chaotic or unpredictable environment.",
    sampleAnswer: "During my ED clinical rotation, we received a trauma activation while I was managing two other patients. I quickly prioritized: I finished administering a time-sensitive antibiotic, asked the tech to continue monitoring my stable patient, and joined the trauma team in my assigned role of documentation and airway supply preparation. I remained focused despite the noise and urgency, accurately documented interventions and timeframes, and communicated clearly with the team. After the trauma was stabilized, I returned to my other patients and completed all outstanding tasks within the shift.",
    tips: ["Show calm under pressure", "Demonstrate ability to switch focus rapidly", "Include how you maintained care for all patients", "Highlight your team communication"],
    difficulty: "intermediate",
  },
  {
    id: "iq-19",
    category: "Specialty - Med-Surg",
    question: "How do you approach managing a patient assignment of 5-6 patients on a med-surg unit?",
    sampleAnswer: "I begin each shift by reviewing all patient charts during report, identifying high-priority needs and time-sensitive tasks. I create a prioritized task list organized by time blocks: assessments and 0800 medications first, then scheduled treatments, then documentation. I use a brain sheet to track vital signs, I&Os, and pending orders for each patient. I communicate with my CNA about delegated tasks and expected findings to report. I cluster care to minimize trips to each room and build in buffer time for unexpected events. By mid-shift, I reassess priorities and adjust my plan accordingly.",
    tips: ["Show systematic organization strategies", "Demonstrate use of tools like brain sheets", "Include delegation and teamwork", "Describe how you adapt when plans change"],
    difficulty: "beginner",
  },
  {
    id: "iq-20",
    category: "Specialty - Med-Surg",
    question: "How would you handle a post-surgical patient who develops sudden hypotension and tachycardia?",
    sampleAnswer: "I would immediately assess the patient using the ABCs, obtain a full set of vital signs, and check the surgical site for signs of hemorrhage. I'd assess the patient's level of consciousness, skin color, and capillary refill. If I suspected hemorrhage, I would apply direct pressure if applicable, position the patient flat, ensure IV access is patent, and prepare for potential fluid resuscitation. I'd use SBAR to notify the surgeon immediately with my assessment findings and anticipated needs. I would prepare for potential return to the OR and have blood products typed and crossmatched if not already done.",
    tips: ["Show systematic assessment approach (ABCs)", "Demonstrate knowledge of post-operative complications", "Include notification and communication steps", "Mention preparation for escalation of care"],
    difficulty: "advanced",
  },
  {
    id: "iq-21",
    category: "Specialty - Pediatrics",
    question: "How would you approach a pediatric patient who is frightened and uncooperative?",
    sampleAnswer: "I would first establish trust by getting to the child's eye level, using age-appropriate language, and involving the parents as comfort partners. For younger children, I'd use distraction techniques like bubble-blowing, tablet games, or storytelling. For school-age children, I'd offer choices when possible — which arm for the blood draw, which color bandage. I'd explain procedures in simple, honest terms without using scary words like 'shot' or 'needle.' I'd also consider the child's developmental stage and adapt my approach accordingly. If the child remains extremely distressed, I'd consult with the care team about timing, child life specialist involvement, or procedural comfort measures.",
    tips: ["Show developmental awareness across age groups", "Include family-centered care principles", "Describe specific distraction and comfort techniques", "Mention when to involve child life specialists"],
    difficulty: "intermediate",
  },
  {
    id: "iq-22",
    category: "Specialty - Pediatrics",
    question: "What experience do you have with pediatric medication dosing and safety?",
    sampleAnswer: "In my pediatric rotation, I learned that weight-based dosing is critical in pediatrics and that even small errors can have significant consequences. I always verified the child's current weight in kilograms, calculated the dose using the mg/kg formula, and cross-referenced with the recommended dosage range before administration. I used the facility's pediatric drug reference for every medication and confirmed concentrations with the pharmacist when unsure. I also verified proper measurement devices — using oral syringes instead of household spoons — and always double-checked pump programming for IV medications.",
    tips: ["Emphasize weight-based dosing knowledge", "Show awareness of pediatric-specific safety measures", "Include verification and double-check practices", "Mention resources you use for dosing references"],
    difficulty: "intermediate",
  },
  {
    id: "iq-23",
    category: "Specialty - L&D",
    question: "What attracts you to labor and delivery nursing, and how have you prepared?",
    sampleAnswer: "I'm drawn to L&D because it combines high-acuity clinical skills with the deeply personal experience of supporting families during one of life's most significant moments. During my OB rotation, I assisted with 12 deliveries, gained experience with fetal monitoring interpretation, managed postpartum hemorrhage protocols, and provided labor support including positioning and breathing techniques. I'm NRP certified and have completed additional training in electronic fetal monitoring. I understand that L&D requires the ability to shift rapidly from a low-risk, celebratory birth to an emergency C-section, and I'm prepared for that intensity.",
    tips: ["Show specific OB/L&D clinical experience", "Mention relevant certifications (NRP, EFM)", "Demonstrate understanding of the specialty's demands", "Include both clinical and emotional aspects of the role"],
    difficulty: "intermediate",
  },
  {
    id: "iq-24",
    category: "Specialty - L&D",
    question: "How would you handle a situation where fetal heart tones show late decelerations?",
    sampleAnswer: "Late decelerations indicate uteroplacental insufficiency and require immediate intervention. I would reposition the mother to left lateral, administer oxygen via non-rebreather mask, increase IV fluids if ordered, and discontinue any oxytocin infusion. I would perform a vaginal exam to assess for cord prolapse and document the pattern of decelerations. I'd immediately notify the attending physician or midwife using SBAR, stating the pattern I'm seeing and the interventions I've already initiated. I'd prepare for potential emergency delivery by ensuring the OR team is aware and neonatal resuscitation equipment is ready.",
    tips: ["Show knowledge of fetal heart rate patterns", "Demonstrate the intrauterine resuscitation steps", "Include physician notification and documentation", "Mention preparation for emergency delivery"],
    difficulty: "advanced",
  },
  {
    id: "iq-25",
    category: "Difficult Interviewer",
    question: "Why should we hire you over the other 50 new grads who applied for this position?",
    sampleAnswer: "I understand you have many qualified candidates. What sets me apart is my combination of clinical preparation and professional commitment. I completed 720+ clinical hours with a capstone in your hospital's cardiac step-down unit, where I received a commendation from my preceptor for my assessment skills and patient communication. I'm ACLS and BLS certified, and I've already begun studying for the CCRN. Beyond clinical skills, I bring a genuine growth mindset — I actively seek feedback, document my learning, and contribute positively to team dynamics. I've researched your unit's patient population and quality metrics, and I'm prepared to contribute meaningfully from orientation onward.",
    tips: ["Be confident without arrogance", "Reference specific qualifications and experiences", "Show knowledge of the specific facility and unit", "Avoid putting down other candidates"],
    difficulty: "advanced",
  },
  {
    id: "iq-26",
    category: "Difficult Interviewer",
    question: "What's your biggest weakness as a nurse?",
    sampleAnswer: "My biggest area for growth is delegation. As a student, I tended to take on tasks myself rather than delegating to CNAs or other team members, partly because I wanted to ensure everything was done to my standard. I've recognized that this approach isn't sustainable in a full patient assignment and actually limits my effectiveness. I've been actively working on this by practicing clear delegation with checkback communication, and during my capstone I made it a specific goal to delegate at least three tasks per shift and follow up appropriately.",
    tips: ["Choose a genuine but manageable weakness", "Show self-awareness and willingness to improve", "Describe specific steps you're taking to address it", "Never say 'I'm a perfectionist' or other cliché answers"],
    difficulty: "advanced",
  },
  {
    id: "iq-27",
    category: "Difficult Interviewer",
    question: "I see you have no nursing experience. Why would you be ready for this unit?",
    sampleAnswer: "While I don't have paid nursing experience, I bring 720+ clinical hours across diverse settings including your hospital system. During my capstone, I independently managed 4-patient assignments and received consistent feedback about my clinical reasoning and communication skills. I've also worked as a patient care technician for 18 months, which gave me direct experience with patient care flow, teamwork dynamics, and unit culture. I'm prepared for the learning curve of a new grad and I'm committed to the full residency program. My preceptor has offered to serve as a reference specifically for my readiness for this type of unit.",
    tips: ["Reframe clinical hours as valid experience", "Highlight any healthcare-adjacent work experience", "Show awareness of the learning curve ahead", "Reference strong mentors and references"],
    difficulty: "advanced",
  },
  {
    id: "iq-28",
    category: "Difficult Interviewer",
    question: "How would you handle a physician who was rude or dismissive to you?",
    sampleAnswer: "I would focus on the patient's needs rather than taking the behavior personally. If a physician was dismissive during a patient care interaction, I would calmly restate my concern using SBAR, emphasizing the clinical data supporting my assessment. If the behavior continued, I would use the CUS technique — stating 'I am concerned about this patient's condition.' If I still felt the patient's needs weren't being addressed, I would escalate through the chain of command. After the immediate situation was resolved, I would consider having a private, respectful conversation with the physician about effective collaboration.",
    tips: ["Stay focused on patient advocacy", "Reference structured communication tools", "Show knowledge of chain of command", "Demonstrate emotional intelligence and professionalism"],
    difficulty: "advanced",
  },
  {
    id: "iq-29",
    category: "Difficult Interviewer",
    question: "What would you do if you disagreed with a unit policy or protocol?",
    sampleAnswer: "I would first ensure I fully understand the rationale behind the policy by reviewing the evidence base and asking my preceptor or manager for context. If after understanding the rationale I still believed the policy could be improved, I would gather evidence-based literature supporting my perspective and present it through the proper channels — such as a unit-based practice council or shared governance committee. I would frame my concern constructively, focusing on patient outcomes rather than personal preference. I understand that change in healthcare requires a systematic, evidence-based approach.",
    tips: ["Show respect for existing protocols", "Demonstrate evidence-based thinking", "Know the proper channels for policy concerns", "Avoid coming across as someone who won't follow rules"],
    difficulty: "intermediate",
  },
  {
    id: "iq-30",
    category: "Confidence Drill",
    question: "Walk me through the first 60 minutes of your shift on a med-surg unit.",
    sampleAnswer: "I arrive 15 minutes early to log in and review overnight notes. During bedside shift report, I visualize each patient, check IV sites, and note any immediate needs. After report, I do focused assessments on my highest-acuity patients first, check IV pump settings and drip rates, and verify any pending stat orders. I then organize my brain sheet with medication times, scheduled procedures, and discharge tasks. I introduce myself to patients I haven't met, assess pain levels, and address urgent comfort needs. By the end of the first hour, I've completed assessments, identified my priorities for the shift, and communicated any concerns to the charge nurse.",
    tips: ["Show a systematic, organized approach", "Include patient safety checks", "Demonstrate time management skills", "Show how you prioritize your first actions"],
    difficulty: "beginner",
  },
  {
    id: "iq-31",
    category: "Confidence Drill",
    question: "How would you give an SBAR report to a physician about a patient with new-onset chest pain?",
    sampleAnswer: "Situation: 'Dr. Smith, this is Nurse Jones on 4 West. I'm calling about Mr. Williams in room 412 who is experiencing new-onset chest pain that started 10 minutes ago.' Background: 'He's a 67-year-old admitted for pneumonia, history of hypertension and hyperlipidemia. No known cardiac history. He's on aspirin and lisinopril.' Assessment: 'His pain is 7/10, substernal, radiating to his left arm. Vital signs: BP 158/92, HR 102, O2 sat 94% on room air. I've obtained a 12-lead ECG which shows ST-segment changes in leads II, III, and aVF. He appears diaphoretic and anxious.' Recommendation: 'I recommend activating the chest pain protocol. I have oxygen ready, and the ECG is available for your review. Would you like me to administer sublingual nitroglycerin and order troponins?'",
    tips: ["Practice SBAR until it feels natural", "Have all relevant data ready before the call", "Be specific with your assessment findings", "Include a clear recommendation"],
    difficulty: "intermediate",
  },
  {
    id: "iq-32",
    category: "Confidence Drill",
    question: "Explain how you would perform a head-to-toe assessment on a new admission.",
    sampleAnswer: "I would start with a general survey — level of consciousness, general appearance, and comfort level. Neurological: orientation, pupil response, grip strength, sensation. Head/neck: HEENT assessment, JVD, lymph nodes, tracheal alignment. Respiratory: rate, pattern, lung sounds in all lobes, work of breathing, O2 saturation. Cardiovascular: heart sounds, peripheral pulses, capillary refill, edema assessment. Abdomen: bowel sounds, distention, tenderness, last BM. GU: voiding pattern, foley if present. Musculoskeletal: ROM, strength, fall risk assessment. Skin: integrity, wounds, IV sites, turgor, bruising. Pain assessment using appropriate scale. I'd document findings in real-time and compare to baseline when available.",
    tips: ["Show a systematic, comprehensive approach", "Include documentation practices", "Demonstrate clinical assessment knowledge", "Mention baseline comparisons"],
    difficulty: "beginner",
  },
  {
    id: "iq-33",
    category: "Confidence Drill",
    question: "A family member asks you to explain a medication their loved one is receiving. Walk me through how you'd handle this.",
    sampleAnswer: "I would first verify the family member's relationship to the patient and check that the patient has consented to sharing medical information with them. I'd then explain the medication in plain language: the name of the medication, what it does, why the doctor ordered it, common side effects to watch for, and when they should notify the nurse. For example: 'Your father is receiving metoprolol, which is a heart medication that helps slow his heart rate and lower his blood pressure. He may feel a little dizzy when he stands up — that's a common side effect. Please call me if he feels lightheaded or his heart feels like it's racing.' I'd document the education provided.",
    tips: ["Always verify consent to share information", "Use plain language, avoid medical jargon", "Include what to watch for and when to call", "Document all patient/family education"],
    difficulty: "beginner",
  },
  {
    id: "iq-34",
    category: "Confidence Drill",
    question: "Your patient's blood sugar comes back at 42 mg/dL. Walk me through your response.",
    sampleAnswer: "This is a critical hypoglycemia that requires immediate intervention. First, I'd assess the patient's level of consciousness. If the patient is alert and able to swallow safely, I'd administer 15 grams of fast-acting glucose — 4 ounces of juice or glucose tablets — and recheck the blood sugar in 15 minutes. If the patient is unconscious or unable to swallow, I would ensure IV access and administer D50 (dextrose 50%) per facility protocol, or glucagon IM if no IV access is available. I'd hold any scheduled insulin or oral hypoglycemic medications, notify the physician, and investigate contributing factors — missed meals, medication timing, or insulin dose adjustments needed. I'd recheck blood sugar every 15 minutes until stable and document all interventions and responses.",
    tips: ["Show knowledge of the 15/15 rule", "Differentiate response based on patient consciousness", "Include investigation of the cause", "Mention medication holds and physician notification"],
    difficulty: "intermediate",
  },
  {
    id: "iq-35",
    category: "Behavioral (STAR)",
    question: "Tell me about a time you had to handle an emotionally challenging patient or family situation.",
    sampleAnswer: "Situation: During my clinical rotation, I cared for a terminally ill patient whose family was struggling to accept the transition to comfort care. Task: I needed to provide compassionate support while respecting the family's emotional process and maintaining quality patient care. Action: I sat with the family, listened actively without rushing, acknowledged their pain, and gently reinforced the palliative care team's guidance. I coordinated with the chaplain and social worker, ensured the patient's comfort measures were optimized, and provided the family with information about grief resources. Result: The family later thanked me specifically, saying I was the first person who 'just listened.' The experience reinforced my understanding that emotional support is as important as clinical intervention.",
    tips: ["Show empathy and emotional intelligence", "Demonstrate therapeutic communication skills", "Include interdisciplinary collaboration", "Avoid clinical detachment in your answer"],
    difficulty: "intermediate",
  },
  {
    id: "iq-36",
    category: "Specialty - ICU",
    question: "How do you stay current with evidence-based practices in critical care?",
    sampleAnswer: "I subscribe to the American Journal of Critical Care and Critical Care Nurse, and I regularly review AACN Practice Alerts for the most current evidence-based guidelines. I participate in online critical care journal clubs and attend webinars offered by AACN and SCCM. I've set up PubMed alerts for topics I frequently encounter, like sepsis management and ventilator-associated events. I also believe in sharing knowledge — when I learn something new, I bring it to my team through informal teaching moments or unit-based education sessions.",
    tips: ["Name specific journals and professional organizations", "Show commitment to lifelong learning", "Include how you share knowledge with colleagues", "Mention professional memberships"],
    difficulty: "intermediate",
  },
  {
    id: "iq-37",
    category: "Specialty - ER",
    question: "How would you handle a situation where a patient presents with symptoms that don't match their stated chief complaint?",
    sampleAnswer: "I would maintain a broad differential and not anchor to the stated chief complaint. I'd perform a thorough assessment, ask open-ended questions, and look for inconsistencies or additional symptoms the patient may not have initially reported. I'd consider that patients sometimes minimize symptoms, present atypically, or have difficulty articulating what they're experiencing. I'd also consider social and psychological factors — a patient presenting with 'abdominal pain' may actually be experiencing domestic violence or a psychiatric crisis. I'd document my findings objectively and communicate my assessment to the physician, sharing my clinical reasoning for any concerns beyond the stated complaint.",
    tips: ["Show clinical reasoning skills", "Demonstrate awareness of atypical presentations", "Include consideration of psychosocial factors", "Emphasize thorough assessment over assumptions"],
    difficulty: "advanced",
  },
  {
    id: "iq-38",
    category: "Conflict Resolution",
    question: "How would you handle a situation where you witnessed another nurse making a medication error?",
    sampleAnswer: "Patient safety is my top priority. I would first ensure the patient was safe and that any immediate clinical needs were addressed. Then I would approach the nurse privately, respectfully, and factually — saying something like 'I noticed the medication given was different from what was charted. Let's verify the order together.' I would support the nurse in completing an incident report, as these reports are designed for system improvement, not punishment. If the nurse was resistant to reporting, I would escalate to the charge nurse. I would document my own observations factually and follow the facility's error reporting protocol.",
    tips: ["Always prioritize patient safety first", "Approach colleagues with respect and privacy", "Show understanding of just culture principles", "Include proper reporting channels"],
    difficulty: "advanced",
  },
  {
    id: "iq-39",
    category: "Patient Safety",
    question: "Describe your approach to medication safety and the rights of medication administration.",
    sampleAnswer: "I follow the eight rights of medication administration: right patient (two identifiers), right medication (verify against MAR and order), right dose (appropriate for weight, age, renal function), right route, right time, right reason (understand the indication), right documentation (chart immediately after administration), and right response (monitor for expected and adverse effects). I also verify allergies before every administration, scan barcodes when available, perform independent double-checks for high-alert medications, and question any order that doesn't seem appropriate. I never pre-pour medications and I never leave medications at the bedside unattended.",
    tips: ["Know all eight rights thoroughly", "Include specific safety practices", "Mention high-alert medication protocols", "Show awareness of common error sources"],
    difficulty: "beginner",
  },
  {
    id: "iq-40",
    category: "Patient Safety",
    question: "What would you do if you were asked to perform a skill you hadn't been validated on?",
    sampleAnswer: "I would be honest about my competency level and not attempt to perform a skill I haven't been trained and validated on. I would communicate this to the charge nurse: 'I haven't been validated on this skill yet, and I want to ensure patient safety. Can someone who is validated perform this while I observe, or can I arrange to be supervised?' I would then proactively seek out the training and validation through my unit educator or preceptor so I'm prepared for next time. Patient safety should never be compromised for the sake of convenience or avoiding an uncomfortable conversation.",
    tips: ["Demonstrate honesty about competency", "Show commitment to patient safety over ego", "Include proactive steps to gain the skill", "Reference your scope of practice"],
    difficulty: "beginner",
  },
];

export const SALARY_DATA: SalaryData[] = [
  { region: "Northeast US", specialty: "Med-Surg", entryLevel: "$62,000-$75,000", midCareer: "$75,000-$90,000", experienced: "$85,000-$105,000", notes: "Higher cost of living; strong union presence in many hospitals" },
  { region: "Southeast US", specialty: "Med-Surg", entryLevel: "$52,000-$62,000", midCareer: "$62,000-$78,000", experienced: "$75,000-$92,000", notes: "Lower cost of living; growing demand in major metro areas" },
  { region: "Midwest US", specialty: "Med-Surg", entryLevel: "$54,000-$65,000", midCareer: "$65,000-$82,000", experienced: "$78,000-$95,000", notes: "Moderate cost of living; competitive benefits packages" },
  { region: "West Coast US", specialty: "Med-Surg", entryLevel: "$72,000-$95,000", midCareer: "$90,000-$115,000", experienced: "$105,000-$135,000", notes: "Highest salaries but very high cost of living; California nurse ratios" },
  { region: "Ontario, Canada", specialty: "Med-Surg", entryLevel: "$60,000-$72,000 CAD", midCareer: "$72,000-$88,000 CAD", experienced: "$85,000-$100,000 CAD", notes: "ONA collective agreement; step increases based on experience" },
  { region: "British Columbia, Canada", specialty: "Med-Surg", entryLevel: "$62,000-$75,000 CAD", midCareer: "$75,000-$92,000 CAD", experienced: "$88,000-$105,000 CAD", notes: "BCNU collective agreement; geographic allowances for rural areas" },
  { region: "Alberta, Canada", specialty: "Med-Surg", entryLevel: "$64,000-$78,000 CAD", midCareer: "$78,000-$95,000 CAD", experienced: "$92,000-$110,000 CAD", notes: "UNA collective agreement; competitive compensation" },
  { region: "All Regions", specialty: "ICU/Critical Care", entryLevel: "+$3,000-$8,000", midCareer: "+$5,000-$12,000", experienced: "+$8,000-$18,000", notes: "Premium over med-surg base; additional for CCRN certification" },
  { region: "All Regions", specialty: "Emergency", entryLevel: "+$2,000-$6,000", midCareer: "+$4,000-$10,000", experienced: "+$6,000-$15,000", notes: "Shift differentials significant; trauma center premiums" },
  { region: "All Regions", specialty: "OR/Perioperative", entryLevel: "+$3,000-$7,000", midCareer: "+$5,000-$12,000", experienced: "+$8,000-$16,000", notes: "Limited new grad openings; strong demand for experienced nurses" },
];

export const CAREER_FRAMEWORKS: CareerFramework[] = [
  {
    id: "clinical-ladder",
    title: "Clinical Ladder Advancement",
    description: "A structured pathway for clinical nurses to advance through levels of expertise, from novice to expert, with increasing responsibilities and compensation.",
    steps: [
      { title: "RN I - New Graduate", description: "Focus on building core competencies, passing probationary period, and establishing safe practice patterns.", timeline: "0-12 months" },
      { title: "RN II - Competent", description: "Demonstrate consistent competence, begin precepting students, participate in unit-based committees.", timeline: "1-3 years" },
      { title: "RN III - Proficient", description: "Serve as charge nurse, lead quality improvement projects, mentor new graduates, pursue specialty certification.", timeline: "3-5 years" },
      { title: "RN IV - Expert", description: "Function as clinical resource, lead evidence-based practice initiatives, contribute to policy development, present at conferences.", timeline: "5+ years" },
    ],
  },
  {
    id: "advanced-practice",
    title: "Advanced Practice Pathway",
    description: "Progression from bedside nursing to advanced practice roles (NP, CNS, CRNA, CNM) requiring graduate education and expanded scope.",
    steps: [
      { title: "Build Clinical Foundation", description: "Gain 2-3 years of clinical experience in your target specialty area.", timeline: "0-3 years" },
      { title: "Graduate Education", description: "Complete MSN or DNP program in your chosen advanced practice specialty.", timeline: "2-4 years (part-time)" },
      { title: "Certification & Licensure", description: "Pass national certification exam and obtain advanced practice licensure.", timeline: "6-12 months" },
      { title: "Independent Practice", description: "Establish your advanced practice role with prescriptive authority and clinical autonomy.", timeline: "Ongoing" },
    ],
  },
  {
    id: "leadership-track",
    title: "Nursing Leadership Track",
    description: "Career path from bedside nursing through management and administrative leadership roles.",
    steps: [
      { title: "Charge Nurse Experience", description: "Take on charge nurse responsibilities and develop shift-level leadership skills.", timeline: "1-3 years" },
      { title: "Assistant Nurse Manager", description: "Move into formal management with responsibility for staffing, scheduling, and team performance.", timeline: "3-5 years" },
      { title: "Nurse Manager / Director", description: "Lead a unit or department with budget, staffing, and quality outcome accountability.", timeline: "5-8 years" },
      { title: "Executive Leadership", description: "Advance to CNO, VP of Nursing, or system-level leadership roles.", timeline: "10+ years" },
    ],
  },
];

export interface ResumeBullet {
  id: string;
  category: string;
  bullets: string[];
}

export const RESUME_BULLET_BANK: ResumeBullet[] = [
  {
    id: "rb-clinical-rotations",
    category: "Clinical Rotations",
    bullets: [
      "Completed 720+ hours of supervised clinical rotations across medical-surgical, pediatric, critical care, and community health settings.",
      "Managed care for 4-6 patients per 12-hour shift during senior capstone rotation on a busy 36-bed med-surg unit.",
      "Performed comprehensive head-to-toe assessments, medication administration, and discharge planning under preceptor supervision.",
      "Participated in interdisciplinary care rounds, contributing assessment findings and patient education plans.",
      "Gained 180+ hours in ICU/critical care clinical experience including hemodynamic monitoring, ventilator management, and vasoactive drip titration.",
      "Completed 160+ hours of emergency department clinical rotation with exposure to triage, trauma activations, and rapid assessment protocols.",
      "Provided family-centered pediatric care during 200+ hours of clinical rotation in pediatric acute care, NICU, and outpatient settings.",
      "Assisted with 12+ deliveries during OB/L&D rotation, including fetal monitoring interpretation and postpartum assessment.",
    ],
  },
  {
    id: "rb-skills",
    category: "Clinical Skills",
    bullets: [
      "Proficient in IV insertion, phlebotomy, Foley catheter insertion, wound care, and nasogastric tube management.",
      "Experienced with electronic health record documentation using Epic, Cerner, and Meditech systems.",
      "Skilled in 12-lead ECG interpretation, telemetry monitoring, and cardiac rhythm identification.",
      "Competent in sterile technique, surgical wound assessment, and drain management (JP, Hemovac, chest tubes).",
      "Trained in point-of-care testing including blood glucose monitoring, urinalysis, and ABG interpretation.",
      "Proficient in medication administration via oral, IV push, IV piggyback, subcutaneous, intramuscular, and topical routes.",
    ],
  },
  {
    id: "rb-communication",
    category: "Communication & Teamwork",
    bullets: [
      "Utilized SBAR framework for all physician and interdisciplinary team communications, resulting in clear, efficient handoffs.",
      "Delivered patient and family education on medication management, disease processes, and discharge instructions.",
      "Collaborated with respiratory therapy, pharmacy, physical therapy, and social services to coordinate comprehensive care plans.",
      "Provided culturally sensitive care to diverse patient populations, coordinating interpreter services when needed.",
      "Participated in code blue response teams in documentation and supply preparation roles.",
      "Mentored junior nursing students during clinical rotations, demonstrating leadership and teaching skills.",
    ],
  },
  {
    id: "rb-achievements",
    category: "Achievements & Leadership",
    bullets: [
      "Recognized by clinical preceptor for exceptional assessment skills and patient communication during capstone evaluation.",
      "Achieved Dean's List distinction for [X] consecutive semesters while maintaining full clinical course load.",
      "Served as class representative on the Nursing Student Council, organizing professional development events.",
      "Completed senior research project on evidence-based fall prevention strategies, presented at university research symposium.",
      "Volunteered 100+ hours at community health fairs providing blood pressure screenings and health education.",
      "Received DAISY nomination from clinical site for outstanding compassionate care during pediatric rotation.",
    ],
  },
  {
    id: "rb-certifications",
    category: "Certifications & Training",
    bullets: [
      "BLS/CPR certified through the American Heart Association (AHA), current through [year].",
      "ACLS certified through AHA with demonstrated competency in cardiac arrest algorithms and acute coronary syndromes.",
      "PALS certified with training in pediatric emergency assessment, respiratory distress management, and shock treatment.",
      "TNCC certified with competency in systematic trauma assessment and evidence-based injury management.",
      "NRP certified with training in neonatal resuscitation steps, airway management, and medication administration.",
      "Completed 30-hour IV Therapy certification program covering peripheral and central line management.",
    ],
  },
];

export interface CoverLetterExample {
  id: string;
  title: string;
  targetUnit: string;
  content: string;
  keyElements: string[];
}

export const COVER_LETTER_BANK: CoverLetterExample[] = [
  {
    id: "cl-medsurg",
    title: "Med-Surg New Graduate Cover Letter",
    targetUnit: "Medical-Surgical",
    content: "Dear [Hiring Manager Name],\n\nI am writing to express my strong interest in the Medical-Surgical Registered Nurse position at [Hospital Name], as advertised on [source]. As a recent BSN graduate from [University] with 720+ clinical hours and a deep commitment to evidence-based patient care, I am excited about the opportunity to begin my nursing career on your renowned med-surg unit.\n\nDuring my senior capstone rotation on [Hospital]'s 36-bed medical-surgical unit, I independently managed care for 4-6 patients per shift, including medication administration, comprehensive assessments, wound care, and discharge planning. My preceptor commended my organizational skills and ability to prioritize competing patient needs — skills I know are essential for success on a busy med-surg floor.\n\nWhat draws me specifically to [Hospital Name] is your commitment to [reference specific program, value, or initiative — e.g., 'your Magnet-recognized nursing program' or 'your new graduate residency with structured mentorship']. I believe my clinical preparation, strong work ethic, and eagerness to learn align perfectly with your unit's culture of excellence.\n\nI am BLS and ACLS certified, proficient in [EHR system], and have additional training in wound care and IV therapy. I would welcome the opportunity to discuss how my clinical experience and professional dedication can contribute to your team.\n\nThank you for considering my application. I look forward to speaking with you.\n\nSincerely,\n[Your Name]",
    keyElements: ["Specific clinical hours and experience", "Unit-specific skills highlighted", "Research about the target hospital", "Relevant certifications mentioned"],
  },
  {
    id: "cl-icu",
    title: "ICU New Graduate Cover Letter",
    targetUnit: "Intensive Care Unit",
    content: "Dear [Hiring Manager Name],\n\nI am writing to apply for the ICU Registered Nurse position in your new graduate residency program at [Hospital Name]. My 180+ hours of critical care clinical experience, ACLS certification, and passion for complex patient management make me a strong candidate for your team.\n\nDuring my critical care rotation in [Hospital]'s 24-bed MICU, I gained hands-on experience with hemodynamic monitoring, ventilator management, vasoactive medication titration, and continuous renal replacement therapy. I managed care for critically ill patients with multi-system organ failure, sepsis, and post-cardiac arrest syndromes. My preceptor specifically noted my attention to subtle changes in patient status and my ability to anticipate clinical deterioration.\n\nI am drawn to [Hospital Name]'s ICU because of [specific reason — e.g., 'your ECMO program' or 'your commitment to nurse-driven protocols']. I understand that ICU nursing demands both clinical excellence and emotional resilience, and I am prepared for the intensity and growth this specialty requires.\n\nI am eager to bring my clinical foundation, critical thinking skills, and commitment to evidence-based practice to your critical care team.\n\nSincerely,\n[Your Name]",
    keyElements: ["Specific critical care clinical hours", "Advanced monitoring and equipment experience", "Knowledge of ICU-specific conditions", "Understanding of ICU demands"],
  },
  {
    id: "cl-er",
    title: "Emergency Department New Graduate Cover Letter",
    targetUnit: "Emergency Department",
    content: "Dear [Hiring Manager Name],\n\nI am excited to apply for the Emergency Department Registered Nurse position at [Hospital Name]. With 160+ hours of ED clinical experience, certifications in BLS, ACLS, and TNCC, and a demonstrated ability to perform effectively in fast-paced, high-pressure environments, I am prepared to contribute to your emergency team.\n\nMy ED rotation at [Hospital] exposed me to a full spectrum of emergency presentations — from trauma activations and acute MIs to psychiatric emergencies and pediatric febrile seizures. I developed strong triage assessment skills, learned to rapidly prioritize competing clinical demands, and became proficient in point-of-care testing and procedural assist. My clinical instructor praised my 'calm under pressure' and my consistent use of closed-loop communication during critical situations.\n\nYour emergency department's reputation for [specific quality — e.g., 'Level I trauma designation' or 'innovative fast-track program'] aligns with my career goal of becoming an expert emergency nurse. I am committed to the continuous learning and adaptability this specialty demands.\n\nI look forward to the opportunity to discuss how my clinical preparation and passion for emergency nursing can serve your team and patients.\n\nSincerely,\n[Your Name]",
    keyElements: ["ED-specific clinical hours and experiences", "Relevant certifications (TNCC, ACLS)", "Triage and rapid assessment skills", "Calm under pressure demonstrated"],
  },
  {
    id: "cl-peds",
    title: "Pediatric Nursing New Graduate Cover Letter",
    targetUnit: "Pediatric Unit / Children's Hospital",
    content: "Dear [Hiring Manager Name],\n\nI am writing to apply for the Pediatric Registered Nurse position at [Children's Hospital/Unit Name]. My 200+ hours of pediatric clinical experience, PALS and NRP certifications, and deep commitment to family-centered care make me an ideal candidate for your nursing team.\n\nDuring my pediatric rotations, I provided age-appropriate care across the developmental spectrum — from neonates in the NICU to adolescents in the pediatric medical unit. I developed expertise in pediatric vital sign interpretation, weight-based medication dosing, developmental assessment, and family education. A particularly meaningful experience was implementing distraction techniques for a fearful pediatric patient, which the unit subsequently adopted as a standard practice.\n\nI am drawn to [Hospital Name] because of [specific reason — e.g., 'your Child Life program integration' or 'your pediatric chronic disease management model']. I believe that every child deserves compassionate, developmentally appropriate care, and I am passionate about being a calming, supportive presence for both patients and their families.\n\nThank you for considering my application.\n\nSincerely,\n[Your Name]",
    keyElements: ["Pediatric-specific clinical hours", "Age-appropriate care knowledge", "Family-centered care commitment", "Pediatric certifications (PALS, NRP)"],
  },
  {
    id: "cl-followup",
    title: "Post-Interview Thank You Email",
    targetUnit: "All Units",
    content: "Subject: Thank You — [Position Title] Interview on [Date]\n\nDear [Interviewer Name],\n\nThank you for taking the time to speak with me today about the [Position Title] role on [Unit Name] at [Hospital Name]. I truly enjoyed learning more about your team's approach to [specific topic discussed in interview].\n\nOur conversation reinforced my enthusiasm for joining your unit. I was particularly inspired by [specific detail from interview — e.g., 'the mentorship structure you described' or 'your team's quality improvement initiatives']. I believe my [specific skill or experience discussed] would allow me to contribute meaningfully from day one.\n\nIf there is any additional information I can provide, please don't hesitate to reach out. I look forward to the possibility of joining your team.\n\nWarm regards,\n[Your Name]\n[Phone Number]\n[Email Address]",
    keyElements: ["Sent within 24 hours of interview", "References specific conversation topics", "Reaffirms interest and fit", "Professional and concise"],
  },
];

export interface PersonalStatementPrompt {
  id: string;
  category: string;
  title: string;
  prompt: string;
  tips: string[];
  sampleOpener: string;
}

export const PERSONAL_STATEMENT_BANK: PersonalStatementPrompt[] = [
  {
    id: "ps-1",
    category: "Nursing School Application",
    title: "Why Nursing?",
    prompt: "Describe the experience or moment that inspired you to pursue nursing. How has this motivation evolved throughout your education?",
    tips: ["Start with a specific, personal story — not a generic 'I want to help people'", "Connect your origin story to your current understanding of nursing", "Show how your perspective has deepened through clinical experience", "End by looking forward to how you'll contribute to the profession"],
    sampleOpener: "The moment I knew I wanted to be a nurse wasn't in a hospital — it was in my grandmother's kitchen, watching her measure insulin doses with hands that trembled more each month...",
  },
  {
    id: "ps-2",
    category: "Nursing School Application",
    title: "Overcoming Adversity",
    prompt: "Describe a significant challenge you've faced and how it has prepared you for the demands of nursing practice.",
    tips: ["Choose a genuine challenge — academic, personal, or professional", "Focus more on your response and growth than the difficulty itself", "Connect the lessons learned to specific nursing competencies", "Demonstrate resilience and self-awareness"],
    sampleOpener: "Failing my first anatomy exam wasn't just a grade — it was the first time I had to confront the difference between wanting something and being willing to do whatever it takes to achieve it...",
  },
  {
    id: "ps-3",
    category: "Scholarship Application",
    title: "Community Impact",
    prompt: "How have you contributed to your community, and how will a nursing career extend that impact?",
    tips: ["Include specific volunteer or community engagement examples", "Quantify your impact when possible", "Show a pattern of service, not a one-time event", "Connect community experience to healthcare equity and access"],
    sampleOpener: "For the past three years, I've organized monthly blood pressure screening events at my local community center, serving a predominantly immigrant neighborhood where preventive care access is limited...",
  },
  {
    id: "ps-4",
    category: "Scholarship Application",
    title: "Financial Need & Professional Goals",
    prompt: "Describe how financial support would impact your ability to pursue your nursing education and career goals.",
    tips: ["Be honest and specific about financial circumstances", "Connect financial support to specific educational goals", "Show a clear career plan and how the scholarship enables it", "Express genuine gratitude without being overly emotional"],
    sampleOpener: "As a first-generation college student working two part-time jobs to fund my nursing education, the balance between financial survival and academic excellence is one I navigate daily...",
  },
  {
    id: "ps-5",
    category: "Graduate Program Application",
    title: "Advanced Practice Goals",
    prompt: "Why are you pursuing advanced practice nursing (NP, CNS, CRNA, CNM)? What clinical experiences have prepared you for graduate-level study?",
    tips: ["Reference specific clinical experiences that inspired this path", "Show understanding of the advanced practice role's scope", "Include your long-term vision for practice", "Demonstrate that you understand the rigor of graduate education"],
    sampleOpener: "After two years in the ICU, I've seen firsthand how advanced practice nurses bridge the gap between bedside advocacy and evidence-based prescriptive practice...",
  },
  {
    id: "ps-6",
    category: "Graduate Program Application",
    title: "Leadership in Nursing",
    prompt: "Describe a leadership experience in nursing and how it has shaped your vision for healthcare improvement.",
    tips: ["Use a specific leadership example — formal or informal", "Show how you influenced others or improved a process", "Connect to your graduate education goals", "Demonstrate systems-level thinking"],
    sampleOpener: "When I noticed our unit's patient fall rate had increased 15% over the quarter, I didn't wait for someone else to address it — I organized a multidisciplinary fall prevention taskforce...",
  },
  {
    id: "ps-7",
    category: "Job Application",
    title: "Clinical Philosophy Statement",
    prompt: "Describe your nursing philosophy and how it guides your patient care approach.",
    tips: ["Be authentic — don't write what you think they want to hear", "Include examples of how your philosophy translates to practice", "Reference evidence-based practice and patient-centered care", "Keep it concise and focused"],
    sampleOpener: "My nursing philosophy centers on the belief that every patient interaction is an opportunity to reduce suffering, not only through clinical intervention, but through genuine human connection...",
  },
  {
    id: "ps-8",
    category: "Scholarship Application",
    title: "Diversity & Inclusion in Nursing",
    prompt: "How does your unique background or perspective contribute to diversity in the nursing profession?",
    tips: ["Share your authentic identity and experiences", "Connect your perspective to improved patient care", "Show understanding of health disparities and equity", "Describe how you plan to advocate for underrepresented communities"],
    sampleOpener: "Growing up as a bilingual child of immigrant parents, I learned early that healthcare isn't just about treating illness — it's about understanding the cultural context in which illness is experienced...",
  },
];

export const PORTFOLIO_SECTIONS = [
  { title: "Professional Summary", description: "Updated resume and career objective statement" },
  { title: "Education & Credentials", description: "Degree documentation, transcripts, and licensure verification" },
  { title: "Certifications", description: "BLS, ACLS, PALS, specialty certifications with expiration dates" },
  { title: "Clinical Competencies", description: "Skills checklist, competency validation records, orientation completion" },
  { title: "Professional Development", description: "CE certificates, conference attendance, workshop completions" },
  { title: "Quality & Safety", description: "QI project documentation, evidence-based practice contributions" },
  { title: "Leadership Activities", description: "Committee participation, precepting records, mentoring activities" },
  { title: "Professional References", description: "Contact information for 3-5 professional references with their permission" },
  { title: "Awards & Recognition", description: "Performance awards, DAISY nominations, peer recognition" },
  { title: "Goals & Reflections", description: "Professional development plan with short and long-term career goals" },
];
