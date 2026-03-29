import type { OSCESkillStation } from "./osce-skills-data";

export const osceSkillStations7: OSCESkillStation[] = [
  {
    id: "breaking-bad-news",
    title: "Breaking Bad News",
    category: "Communication",
    difficulty: "Advanced",
    icon: "MessageCircle",
    description:
      "Deliver difficult medical news to a patient or family member using a structured, compassionate communication framework such as SPIKES.",
    scenarioIntro:
      "You are caring for a 64-year-old patient who was admitted for investigation of persistent cough and weight loss. The biopsy results have returned confirming lung adenocarcinoma. The oncologist has asked you to be present when the diagnosis is discussed. The patient is alone in a private room and is anxious about the results.",
    equipment: [
      "Private room or area",
      "Tissues",
      "Chair positioned at the patient's level",
      "Contact information for support services",
      "Patient education materials",
      "Documentation tools"
    ],
    steps: [
      { id: "bbn-1", instruction: "Ensure a private, quiet environment free from interruptions. Silence pagers and phones.", rationale: "Privacy and minimal distractions allow the patient to process information and express emotions freely.", criticalStep: true },
      { id: "bbn-2", instruction: "Identify the patient using two identifiers and confirm their identity.", rationale: "Ensures the correct patient receives the information; a fundamental safety standard.", criticalStep: true },
      { id: "bbn-3", instruction: "Sit down at the patient's level, maintain appropriate eye contact, and adopt open body language.", rationale: "Sitting conveys that you have time and are not in a hurry. Eye contact builds trust and shows empathy.", criticalStep: false },
      { id: "bbn-4", instruction: "Ask the patient what they already know or understand about their condition (Perception step of SPIKES).", rationale: "Assessing prior knowledge helps tailor the conversation and correct any misconceptions before delivering the news.", criticalStep: true },
      { id: "bbn-5", instruction: "Ask the patient how much information they would like to receive (Invitation step of SPIKES).", rationale: "Respects patient autonomy; some patients want full details while others prefer a summary.", criticalStep: true },
      { id: "bbn-6", instruction: "Provide a warning shot before delivering the news, e.g., 'I'm afraid the results are not what we were hoping for.'", rationale: "A warning statement prepares the patient emotionally and reduces the shock of the bad news.", criticalStep: true },
      { id: "bbn-7", instruction: "Deliver the news clearly and concisely using plain language. Avoid medical jargon.", rationale: "Clear, simple language ensures comprehension. Jargon creates confusion and anxiety.", criticalStep: true },
      { id: "bbn-8", instruction: "Pause after delivering the news. Allow silence for the patient to process the information.", rationale: "Silence is therapeutic and allows the patient time to absorb the information before further discussion.", criticalStep: true },
      { id: "bbn-9", instruction: "Acknowledge and validate the patient's emotional response with empathic statements.", rationale: "Validation normalizes the patient's feelings and strengthens the therapeutic relationship.", criticalStep: true },
      { id: "bbn-10", instruction: "Assess the patient's understanding by asking them to summarize what they have heard.", rationale: "Teach-back confirms comprehension and identifies areas needing clarification.", criticalStep: false },
      { id: "bbn-11", instruction: "Provide information about next steps, treatment options, and support services.", rationale: "Offering a plan reduces feelings of helplessness and provides the patient with a sense of direction.", criticalStep: false },
      { id: "bbn-12", instruction: "Ask the patient if they have any questions and answer them honestly.", rationale: "Open questioning empowers the patient and addresses their specific concerns.", criticalStep: false },
      { id: "bbn-13", instruction: "Offer to contact a support person, chaplain, social worker, or counselor.", rationale: "Emotional and social support is essential; patients should not be left alone to cope after receiving bad news.", criticalStep: false },
      { id: "bbn-14", instruction: "Arrange follow-up and provide written information or contact numbers.", rationale: "Patients often cannot retain verbal information during emotional distress; written materials support recall.", criticalStep: false },
      { id: "bbn-15", instruction: "Document the conversation, patient's response, understanding, and plan in the medical record.", rationale: "Legal record-keeping ensures continuity of care and documents that the patient was informed.", criticalStep: true }
    ],
    commonErrors: [
      "Delivering bad news in a public or shared space",
      "Standing over the patient during the conversation",
      "Using medical jargon the patient cannot understand",
      "Not pausing after delivering the news, rushing through information",
      "Providing false reassurance or minimizing the diagnosis",
      "Failing to assess what the patient already knows",
      "Not offering emotional support or follow-up resources"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must use a structured framework (SPIKES), deliver the news clearly with empathy, allow silence, validate emotions, and document the conversation.",
    clinicalPearls: [
      "The SPIKES framework: Setting, Perception, Invitation, Knowledge, Emotions, Strategy/Summary.",
      "Never say 'There is nothing more we can do.' Instead, say 'We will focus on keeping you comfortable and maintaining quality of life.'",
      "Silence is one of the most powerful communication tools. Resist the urge to fill silence after delivering bad news.",
      "Patients retain very little information after hearing bad news. Always provide written materials.",
      "Debrief with colleagues after difficult conversations to process your own emotions."
    ],
    examLevel: "RN/NP",
    timeLimit: "15 minutes",
    candidateInstructions:
      "You will deliver a new cancer diagnosis to a patient using a structured communication approach. Demonstrate empathy, use plain language, and follow the SPIKES protocol.",
    patientActorScript:
      "You are anxious and have been waiting for results. Initially, you are hopeful the results are benign. When you hear the news, become tearful and quiet. Ask 'Am I going to die?' after a pause. If the nurse is compassionate and allows silence, gradually become more engaged. If the nurse rushes, become withdrawn.",
    examinerChecklist: [
      { action: "Ensures privacy and minimizes distractions", marks: 2 },
      { action: "Identifies patient with two identifiers", marks: 1 },
      { action: "Assesses patient's prior understanding", marks: 3 },
      { action: "Asks how much the patient wants to know", marks: 2 },
      { action: "Provides a warning shot before the news", marks: 3 },
      { action: "Delivers news clearly in plain language", marks: 3 },
      { action: "Allows silence after delivering the news", marks: 3 },
      { action: "Acknowledges and validates emotions", marks: 3 },
      { action: "Offers next steps and support resources", marks: 2 },
      { action: "Documents conversation and patient response", marks: 2 }
    ],
    criticalFailCriteria: [
      "Delivering news in a non-private setting",
      "Using medical jargon without explanation",
      "Providing false reassurance about prognosis",
      "Failing to allow the patient to react emotionally",
      "Not documenting the conversation"
    ],
    examinerQuestions: [
      { question: "What communication framework did you use and why?", answer: "SPIKES — it provides a structured, evidence-based approach to delivering bad news that ensures patient-centered communication." },
      { question: "Why is silence important after delivering bad news?", answer: "Silence gives the patient time to process the information emotionally before being asked to engage in further discussion." },
      { question: "What would you do if the patient refuses to hear the results?", answer: "Respect their autonomy, document their decision, and offer to revisit the conversation when they are ready." }
    ],
    teachingPoints: [
      "Breaking bad news is a skill that improves with practice and reflection.",
      "Cultural considerations may affect how patients receive and process difficult information.",
      "Always assess patient readiness before delivering news; timing matters.",
      "Self-care after delivering bad news is essential to prevent compassion fatigue."
    ]
  },
  {
    id: "discharge-teaching",
    title: "Discharge Teaching",
    category: "Communication",
    difficulty: "Intermediate",
    icon: "BookOpen",
    description:
      "Provide comprehensive discharge education to a patient, ensuring understanding of medications, follow-up care, warning signs, and self-management strategies.",
    scenarioIntro:
      "You are preparing to discharge a 52-year-old patient who was admitted for a first episode of heart failure. The patient has been started on new medications including furosemide and lisinopril. The patient lives alone and has no prior experience managing a chronic condition.",
    equipment: [
      "Written discharge instructions",
      "Medication list with schedule",
      "Teach-back assessment form",
      "Follow-up appointment information",
      "Weight log and dietary guidelines",
      "Community resource information",
      "Documentation tools"
    ],
    steps: [
      { id: "dt-1", instruction: "Perform hand hygiene and gather all discharge materials.", rationale: "Infection prevention and ensuring all necessary documents and resources are prepared.", criticalStep: false },
      { id: "dt-2", instruction: "Identify the patient using two identifiers.", rationale: "Patient safety standard to ensure the correct patient receives discharge education.", criticalStep: true },
      { id: "dt-3", instruction: "Assess the patient's learning readiness, literacy level, preferred language, and any barriers to learning.", rationale: "Tailoring education to the patient's needs improves comprehension and adherence.", criticalStep: true },
      { id: "dt-4", instruction: "Review the diagnosis and reason for hospitalization in simple terms.", rationale: "Ensures the patient understands their condition as a foundation for self-management education.", criticalStep: false },
      { id: "dt-5", instruction: "Review each medication: name, purpose, dose, frequency, route, and side effects.", rationale: "Medication errors are the most common adverse event post-discharge. Thorough medication education reduces readmission risk.", criticalStep: true },
      { id: "dt-6", instruction: "Teach warning signs that require immediate medical attention: weight gain of more than 2 pounds in one day, increasing shortness of breath, chest pain, or swelling.", rationale: "Early recognition of heart failure exacerbation prevents emergency department visits and readmission.", criticalStep: true },
      { id: "dt-7", instruction: "Teach daily self-monitoring: weigh every morning at the same time, record weight, monitor fluid intake.", rationale: "Daily weights are the earliest indicator of fluid retention in heart failure.", criticalStep: true },
      { id: "dt-8", instruction: "Review dietary restrictions: sodium restriction (less than 2 grams per day), fluid restriction if ordered.", rationale: "Sodium intake directly affects fluid retention and blood pressure in heart failure patients.", criticalStep: false },
      { id: "dt-9", instruction: "Review activity guidelines and exercise recommendations.", rationale: "Appropriate activity improves cardiac function and reduces deconditioning.", criticalStep: false },
      { id: "dt-10", instruction: "Confirm follow-up appointments and provide written appointment details.", rationale: "Follow-up within 7 days post-discharge reduces readmission rates.", criticalStep: true },
      { id: "dt-11", instruction: "Use teach-back method: ask the patient to explain the key points in their own words.", rationale: "Teach-back is the gold standard for confirming patient understanding; it identifies gaps requiring re-education.", criticalStep: true },
      { id: "dt-12", instruction: "Provide written discharge instructions and review them with the patient.", rationale: "Written materials reinforce verbal education and serve as a reference at home.", criticalStep: false },
      { id: "dt-13", instruction: "Provide contact numbers for questions after discharge and community resources.", rationale: "Access to support reduces anxiety and prevents unnecessary emergency visits.", criticalStep: false },
      { id: "dt-14", instruction: "Ask the patient if they have any remaining questions.", rationale: "Open-ended questioning ensures all concerns are addressed before the patient leaves.", criticalStep: false },
      { id: "dt-15", instruction: "Document all teaching provided, patient's level of understanding, and the discharge plan.", rationale: "Legal documentation ensures continuity of care and evidence that education was provided.", criticalStep: true }
    ],
    commonErrors: [
      "Providing too much information at once without checking understanding",
      "Using medical jargon instead of plain language",
      "Not assessing literacy level or learning barriers",
      "Forgetting to use teach-back to confirm understanding",
      "Not reviewing warning signs that require emergency care",
      "Providing only verbal instructions without written materials",
      "Not confirming follow-up appointments"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must assess learning readiness, review medications and warning signs, use teach-back, confirm follow-up, and document the teaching.",
    clinicalPearls: [
      "Patients retain approximately 50% of information provided during discharge teaching. Always provide written materials.",
      "Use the teach-back method ('Tell me in your own words...') rather than asking 'Do you understand?'",
      "Involve family members or caregivers whenever possible in discharge education.",
      "Heart failure patients who weigh daily and know their warning signs have significantly lower readmission rates.",
      "Consider health literacy: use simple language and visual aids."
    ],
    examLevel: "RN",
    timeLimit: "15 minutes",
    candidateInstructions:
      "Provide comprehensive discharge teaching to a heart failure patient, covering medications, warning signs, daily monitoring, and follow-up. Use the teach-back method to confirm understanding.",
    patientActorScript:
      "You are nervous about going home alone with a new diagnosis. You have difficulty understanding medical terms. When teach-back is used, initially get the medication schedule wrong. If the nurse re-teaches patiently, demonstrate improved understanding on the second attempt.",
    examinerChecklist: [
      { action: "Identifies patient with two identifiers", marks: 1 },
      { action: "Assesses learning readiness and barriers", marks: 2 },
      { action: "Reviews each medication with name, purpose, dose, and side effects", marks: 3 },
      { action: "Teaches warning signs requiring medical attention", marks: 3 },
      { action: "Teaches daily self-monitoring (weights)", marks: 2 },
      { action: "Uses teach-back method effectively", marks: 3 },
      { action: "Confirms follow-up appointments", marks: 2 },
      { action: "Provides written discharge materials", marks: 2 },
      { action: "Documents teaching and patient understanding", marks: 2 }
    ],
    criticalFailCriteria: [
      "Failing to review medications",
      "Not teaching warning signs",
      "Not using teach-back or any method to confirm understanding",
      "Not documenting the teaching provided"
    ],
    examinerQuestions: [
      { question: "Why is teach-back preferred over asking 'Do you understand?'", answer: "Patients often say they understand even when they don't. Teach-back requires them to demonstrate understanding, revealing actual comprehension gaps." },
      { question: "What is the most important daily self-monitoring task for this patient?", answer: "Daily weights at the same time each morning. A gain of more than 2 pounds in one day or 5 pounds in one week indicates fluid retention." },
      { question: "How would you modify teaching for a patient with low health literacy?", answer: "Use simple language, visual aids, limit to 2-3 key points per session, and use teach-back to confirm understanding." }
    ],
    teachingPoints: [
      "Discharge teaching should begin at admission, not on the day of discharge.",
      "Include caregivers and family members in education sessions when appropriate.",
      "Readmission within 30 days is a quality metric; effective discharge teaching is a primary prevention strategy.",
      "Cultural and language considerations must be addressed for effective communication."
    ]
  },
  {
    id: "medication-teaching",
    title: "Medication Teaching",
    category: "Communication",
    difficulty: "Intermediate",
    icon: "Pill",
    description:
      "Educate a patient about a newly prescribed medication, including purpose, dosage, administration, side effects, and interactions.",
    scenarioIntro:
      "You are caring for a 68-year-old patient who has been newly prescribed warfarin (Coumadin) for atrial fibrillation. The patient has no prior experience with anticoagulant therapy. The physician has asked you to provide thorough medication education before discharge.",
    equipment: [
      "Medication education handout",
      "Sample pill identification card",
      "INR monitoring schedule",
      "Food-drug interaction list (vitamin K foods)",
      "Medical alert bracelet information",
      "Documentation tools"
    ],
    steps: [
      { id: "mt-1", instruction: "Perform hand hygiene and gather educational materials.", rationale: "Preparation ensures a comprehensive and organized teaching session.", criticalStep: false },
      { id: "mt-2", instruction: "Identify the patient using two identifiers.", rationale: "Patient safety standard for medication education.", criticalStep: true },
      { id: "mt-3", instruction: "Assess patient's current knowledge about anticoagulants and learning preferences.", rationale: "Understanding baseline knowledge prevents redundant information and identifies gaps.", criticalStep: true },
      { id: "mt-4", instruction: "Explain the purpose of warfarin: to prevent blood clots in atrial fibrillation.", rationale: "Understanding the purpose increases medication adherence.", criticalStep: true },
      { id: "mt-5", instruction: "Explain the dosage, timing, and importance of taking the medication at the same time each day.", rationale: "Consistent timing maintains therapeutic drug levels and reduces fluctuations in INR.", criticalStep: true },
      { id: "mt-6", instruction: "Teach about INR monitoring: what it measures, target range (2.0-3.0), and frequency of blood tests.", rationale: "INR monitoring is essential for warfarin safety; the patient must understand the need for regular testing.", criticalStep: true },
      { id: "mt-7", instruction: "Teach signs of bleeding: gum bleeding, nosebleeds, blood in urine or stool, excessive bruising, prolonged bleeding from cuts.", rationale: "Early recognition of bleeding complications allows prompt medical intervention and prevents serious hemorrhage.", criticalStep: true },
      { id: "mt-8", instruction: "Teach signs of clot formation: sudden leg swelling, chest pain, shortness of breath, sudden severe headache.", rationale: "Despite anticoagulation, clots can still form if the dose is subtherapeutic. Patients must recognize stroke and PE symptoms.", criticalStep: true },
      { id: "mt-9", instruction: "Explain food-drug interactions: maintain consistent vitamin K intake; avoid large changes in green leafy vegetable consumption.", rationale: "Vitamin K counteracts warfarin. Consistency, not avoidance, is the key message.", criticalStep: true },
      { id: "mt-10", instruction: "Review drug interactions: avoid aspirin and NSAIDs unless prescribed; inform all providers about warfarin use.", rationale: "NSAIDs and aspirin increase bleeding risk. All healthcare providers must know the patient is on anticoagulation.", criticalStep: true },
      { id: "mt-11", instruction: "Advise about safety measures: use a soft toothbrush, electric razor, and avoid contact sports.", rationale: "Injury prevention is critical when on anticoagulant therapy to minimize bleeding risk.", criticalStep: false },
      { id: "mt-12", instruction: "Recommend wearing a medical alert bracelet and carrying an anticoagulant card.", rationale: "In emergencies, healthcare providers need to know the patient is on anticoagulation to guide treatment decisions.", criticalStep: false },
      { id: "mt-13", instruction: "Use teach-back: ask the patient to explain what to do if they miss a dose.", rationale: "Teach-back confirms understanding of a common real-world scenario.", criticalStep: true },
      { id: "mt-14", instruction: "Provide written materials including the medication schedule, warning signs, and INR appointment dates.", rationale: "Written materials serve as a home reference and reinforce verbal teaching.", criticalStep: false },
      { id: "mt-15", instruction: "Document the teaching provided, patient understanding, and plan for INR follow-up.", rationale: "Legal documentation and continuity of care.", criticalStep: true }
    ],
    commonErrors: [
      "Telling the patient to avoid all green vegetables instead of maintaining consistent intake",
      "Not teaching signs of both bleeding AND clot formation",
      "Forgetting to mention drug interactions with OTC medications like aspirin and NSAIDs",
      "Not explaining INR monitoring and target range",
      "Failing to use teach-back for critical concepts",
      "Not recommending a medical alert bracelet"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must explain purpose, dosing, INR monitoring, bleeding signs, clotting signs, food and drug interactions, and use teach-back.",
    clinicalPearls: [
      "The key message for vitamin K is CONSISTENCY, not avoidance. Patients should not dramatically change their diet.",
      "Warfarin has a narrow therapeutic index — small dose changes can cause significant INR fluctuations.",
      "An INR above 4.0 significantly increases bleeding risk; below 2.0 increases clotting risk.",
      "Always ask about herbal supplements; many interact with warfarin (e.g., ginkgo, garlic, ginger).",
      "If a dose is missed, the patient should take it as soon as remembered on the same day but never double the dose."
    ],
    examLevel: "RN",
    timeLimit: "12 minutes",
    candidateInstructions:
      "Provide comprehensive medication education about warfarin to a newly prescribed patient. Cover purpose, dosing, monitoring, side effects, food and drug interactions, and safety measures.",
    patientActorScript:
      "You have heard warfarin is 'rat poison' and are nervous about taking it. Ask 'Isn't this dangerous?' early in the conversation. You enjoy eating salads daily and are worried you will have to stop. If the nurse explains consistency well, express relief.",
    examinerChecklist: [
      { action: "Identifies patient with two identifiers", marks: 1 },
      { action: "Assesses baseline knowledge", marks: 2 },
      { action: "Explains purpose of warfarin clearly", marks: 2 },
      { action: "Teaches INR monitoring and target range", marks: 3 },
      { action: "Teaches bleeding signs", marks: 3 },
      { action: "Teaches clotting signs", marks: 2 },
      { action: "Explains vitamin K food consistency", marks: 3 },
      { action: "Reviews drug interactions", marks: 2 },
      { action: "Uses teach-back effectively", marks: 3 },
      { action: "Documents teaching", marks: 2 }
    ],
    criticalFailCriteria: [
      "Telling the patient to avoid all vitamin K foods",
      "Not teaching bleeding signs",
      "Not mentioning INR monitoring",
      "Failing to identify drug interactions"
    ],
    examinerQuestions: [
      { question: "What is the target INR range for this patient with atrial fibrillation?", answer: "2.0 to 3.0. A mechanical heart valve would require 2.5 to 3.5." },
      { question: "What would you tell a patient who says they missed yesterday's dose?", answer: "Do not double today's dose. Take the regular dose today and report the missed dose at the next INR appointment." },
      { question: "Why do we say 'maintain consistent vitamin K intake' rather than 'avoid vitamin K'?", answer: "Because vitamin K is essential for health. The goal is stable INR levels, which requires consistent dietary vitamin K so the warfarin dose can be calibrated appropriately." }
    ],
    teachingPoints: [
      "Warfarin education is one of the highest-yield topics in nursing licensure exams.",
      "The antidote for warfarin is vitamin K (phytonadione).",
      "Heparin and warfarin are often started simultaneously; heparin provides immediate anticoagulation while warfarin takes 3-5 days to reach therapeutic levels.",
      "Pharmacogenomic testing can identify patients who metabolize warfarin differently."
    ]
  },
  {
    id: "informed-consent",
    title: "Informed Consent Discussion",
    category: "Communication",
    difficulty: "Intermediate",
    icon: "ClipboardList",
    description:
      "Facilitate the informed consent process by ensuring the patient understands the procedure, risks, benefits, and alternatives before signing consent.",
    scenarioIntro:
      "You are caring for a 45-year-old patient scheduled for a laparoscopic cholecystectomy tomorrow morning. The surgeon has discussed the procedure with the patient and has asked you to witness the informed consent. The patient appears hesitant and has questions.",
    equipment: [
      "Informed consent form",
      "Procedure information sheet",
      "Pen",
      "Interpreter services if needed",
      "Documentation tools"
    ],
    steps: [
      { id: "ic-1", instruction: "Identify the patient using two identifiers.", rationale: "Ensures the correct patient is signing consent for the correct procedure.", criticalStep: true },
      { id: "ic-2", instruction: "Confirm the patient's identity matches the consent form and the correct procedure is listed.", rationale: "Wrong patient or wrong procedure consent is a sentinel event.", criticalStep: true },
      { id: "ic-3", instruction: "Assess the patient's understanding of the procedure by asking them to explain what they know.", rationale: "Determines if the physician's explanation was understood and identifies gaps.", criticalStep: true },
      { id: "ic-4", instruction: "Verify the patient can describe the procedure, expected benefits, risks, and alternatives.", rationale: "True informed consent requires understanding of all four elements: procedure, benefits, risks, and alternatives.", criticalStep: true },
      { id: "ic-5", instruction: "Ensure the patient understands the right to refuse the procedure at any time.", rationale: "Patient autonomy is a fundamental ethical principle; consent is voluntary.", criticalStep: true },
      { id: "ic-6", instruction: "Assess for barriers to consent: sedation, pain medication effects, language barriers, or cognitive impairment.", rationale: "Consent obtained from a patient who lacks capacity or is impaired is not legally valid.", criticalStep: true },
      { id: "ic-7", instruction: "If the patient has unanswered questions about the procedure, contact the surgeon to provide additional explanation.", rationale: "The nurse witnesses consent but the physician is responsible for explaining the procedure. Unresolved questions require physician involvement.", criticalStep: true },
      { id: "ic-8", instruction: "Confirm the patient is signing voluntarily without coercion.", rationale: "Coerced consent is not valid. The patient must freely choose to proceed.", criticalStep: true },
      { id: "ic-9", instruction: "Have the patient sign and date the consent form.", rationale: "The patient's signature indicates their voluntary agreement after being fully informed.", criticalStep: false },
      { id: "ic-10", instruction: "Sign the form as a witness, confirming the patient appeared to understand and signed voluntarily.", rationale: "The nurse's role is to witness that the patient signed voluntarily and appeared to comprehend the information.", criticalStep: true },
      { id: "ic-11", instruction: "Provide a copy of the signed consent to the patient.", rationale: "The patient has the right to a copy of any document they sign.", criticalStep: false },
      { id: "ic-12", instruction: "Place the original signed consent in the patient's medical record and document the process.", rationale: "Legal documentation ensures the consent is available for the surgical team and is part of the permanent record.", criticalStep: true }
    ],
    commonErrors: [
      "The nurse explaining the procedure instead of the physician",
      "Obtaining consent while the patient is sedated or impaired",
      "Not verifying the patient understands risks and alternatives",
      "Proceeding with consent despite the patient having unanswered questions",
      "Not confirming the correct procedure is listed on the form",
      "Forgetting to provide a copy to the patient"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must verify patient understanding, ensure capacity and voluntariness, contact the physician for unresolved questions, and properly witness and document.",
    clinicalPearls: [
      "The NURSE witnesses consent. The PHYSICIAN obtains consent by explaining the procedure.",
      "If a patient cannot read, the form must be read aloud and a witness must be present.",
      "Consent signed by a minor is not valid unless they are an emancipated minor.",
      "A patient can withdraw consent at any time, even in the operating room.",
      "Emergency situations may allow treatment without consent under implied consent doctrine."
    ],
    examLevel: "RN/RPN",
    timeLimit: "10 minutes",
    candidateInstructions:
      "You are witnessing an informed consent for a laparoscopic cholecystectomy. Verify the patient's understanding, ensure capacity, and properly witness the consent process.",
    patientActorScript:
      "You met with the surgeon briefly but feel rushed. You can name the procedure but are unclear about the risks and alternatives. Ask 'What if something goes wrong?' If the nurse appropriately contacts the surgeon or explains the witnessing role, sign willingly.",
    examinerChecklist: [
      { action: "Identifies patient with two identifiers", marks: 1 },
      { action: "Confirms correct procedure on consent form", marks: 2 },
      { action: "Assesses patient understanding of procedure", marks: 3 },
      { action: "Verifies understanding of risks, benefits, alternatives", marks: 3 },
      { action: "Assesses for barriers to valid consent", marks: 2 },
      { action: "Contacts physician for unanswered questions", marks: 3 },
      { action: "Confirms voluntary consent without coercion", marks: 2 },
      { action: "Properly witnesses and signs the form", marks: 2 },
      { action: "Documents the process", marks: 2 }
    ],
    criticalFailCriteria: [
      "Explaining the procedure instead of the physician",
      "Obtaining consent from an impaired patient",
      "Proceeding without resolving the patient's questions",
      "Not verifying the correct procedure on the consent form"
    ],
    examinerQuestions: [
      { question: "What is the nurse's role in the informed consent process?", answer: "The nurse witnesses that the patient signed voluntarily and appeared to understand the information. The physician is responsible for explaining the procedure." },
      { question: "What would you do if the patient seems confused from pain medication?", answer: "Do not proceed with consent. Notify the physician, document the concern, and wait until the patient has capacity to provide valid consent." },
      { question: "Can a patient withdraw consent after signing?", answer: "Yes, a patient can withdraw consent at any time, including immediately before or during the procedure." }
    ],
    teachingPoints: [
      "Informed consent has four elements: disclosure, comprehension, voluntariness, and competence.",
      "In emergencies, implied consent allows life-saving treatment without signed consent.",
      "Telephone consent requires two witnesses and must be documented carefully.",
      "For pediatric patients, a parent or legal guardian provides consent unless the minor is emancipated."
    ]
  },
  {
    id: "family-communication",
    title: "Family Communication During Deterioration",
    category: "Communication",
    difficulty: "Advanced",
    icon: "MessageCircle",
    description:
      "Communicate effectively with family members during a patient's clinical deterioration, providing updates, emotional support, and facilitating decision-making.",
    scenarioIntro:
      "You are caring for a 78-year-old ICU patient with septic shock who is deteriorating despite maximum medical therapy. The patient's daughter has arrived and is asking for an update. The patient's advance directive indicates they do not want prolonged mechanical ventilation. The intensivist is available for a family meeting.",
    equipment: [
      "Private family meeting room",
      "Patient's advance directive",
      "Tissues",
      "Contact information for social work, chaplaincy",
      "Documentation tools"
    ],
    steps: [
      { id: "fc-1", instruction: "Ensure a private, comfortable space for the family conversation.", rationale: "Privacy allows family members to express emotions and ask questions freely.", criticalStep: true },
      { id: "fc-2", instruction: "Introduce yourself and your role in the patient's care.", rationale: "Establishing your role builds trust and provides context for the information you share.", criticalStep: false },
      { id: "fc-3", instruction: "Assess the family member's current understanding of the patient's condition.", rationale: "Starting from their knowledge base allows you to fill gaps without overwhelming them with information.", criticalStep: true },
      { id: "fc-4", instruction: "Provide an honest, clear update on the patient's current status using plain language.", rationale: "Families deserve honest information. Euphemisms or medical jargon can create confusion and mistrust.", criticalStep: true },
      { id: "fc-5", instruction: "Explain the treatments being provided and their goals.", rationale: "Understanding what is being done helps families feel included and reduces the sense of helplessness.", criticalStep: false },
      { id: "fc-6", instruction: "Acknowledge the gravity of the situation without removing all hope.", rationale: "Balancing honesty with compassion maintains trust while preparing the family for possible outcomes.", criticalStep: true },
      { id: "fc-7", instruction: "Reference the patient's advance directive and their documented wishes.", rationale: "Advance directives represent the patient's autonomous wishes and guide end-of-life decision-making.", criticalStep: true },
      { id: "fc-8", instruction: "Allow the family member to express emotions and respond with empathic statements.", rationale: "Emotional validation supports the family and strengthens the therapeutic relationship.", criticalStep: true },
      { id: "fc-9", instruction: "Clarify the family's role in decision-making and the difference between their wishes and the patient's wishes.", rationale: "Families may feel burdened by decisions; clarifying that they are honoring the patient's wishes reduces guilt.", criticalStep: true },
      { id: "fc-10", instruction: "Offer to arrange a family meeting with the medical team for further discussion.", rationale: "Multidisciplinary meetings ensure consistent messaging and allow families to ask detailed clinical questions.", criticalStep: false },
      { id: "fc-11", instruction: "Offer support services: social worker, chaplain, or patient advocate.", rationale: "Comprehensive support addresses emotional, spiritual, and practical needs during a crisis.", criticalStep: false },
      { id: "fc-12", instruction: "Summarize the conversation and confirm the family's understanding of the plan.", rationale: "A summary ensures alignment and provides an opportunity to correct misunderstandings.", criticalStep: false },
      { id: "fc-13", instruction: "Document the conversation, family response, and any decisions or pending discussions.", rationale: "Accurate documentation ensures continuity among team members and provides a legal record.", criticalStep: true }
    ],
    commonErrors: [
      "Having the conversation in a hallway or busy area",
      "Using medical jargon that the family cannot understand",
      "Providing false reassurance when the prognosis is poor",
      "Not referencing the patient's advance directive",
      "Projecting personal values onto end-of-life decisions",
      "Failing to offer support services",
      "Not documenting the conversation"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must communicate honestly, reference advance directives, validate emotions, clarify decision-making roles, and document.",
    clinicalPearls: [
      "Families often ask 'What would you do?' Redirect by saying 'What would your loved one want?'",
      "Avoid saying 'withdrawal of care.' Instead say 'redirecting care to focus on comfort.'",
      "Family members are not making the decision; they are honoring the patient's wishes.",
      "Grief responses vary. Do not judge anger, denial, or silence — all are normal.",
      "Consistent messaging from the team prevents confusion and mistrust."
    ],
    examLevel: "RN/NP",
    timeLimit: "15 minutes",
    candidateInstructions:
      "Communicate with a patient's family member about clinical deterioration. Provide an honest update, reference advance directives, validate emotions, and offer support.",
    patientActorScript:
      "You are the patient's daughter. You are distressed and initially demanding that 'everything be done.' When the nurse references your parent's advance directive and their stated wishes, you become tearful but begin to accept the situation. If the nurse is empathetic and clear, ask for the chaplain.",
    examinerChecklist: [
      { action: "Ensures private setting for conversation", marks: 2 },
      { action: "Assesses family's current understanding", marks: 2 },
      { action: "Provides honest, clear clinical update", marks: 3 },
      { action: "References advance directive appropriately", marks: 3 },
      { action: "Validates emotions with empathic responses", marks: 3 },
      { action: "Clarifies family role in honoring patient's wishes", marks: 3 },
      { action: "Offers support services", marks: 2 },
      { action: "Documents conversation and family response", marks: 2 }
    ],
    criticalFailCriteria: [
      "Having the conversation in a non-private setting",
      "Providing false reassurance about recovery",
      "Ignoring or overriding the patient's advance directive",
      "Dismissing family emotions",
      "Not documenting the interaction"
    ],
    examinerQuestions: [
      { question: "How do you respond when a family member says 'Do everything!'?", answer: "Acknowledge their emotion, then gently refer to the patient's advance directive to redirect focus to the patient's documented wishes." },
      { question: "What is the difference between the family's role and the patient's rights?", answer: "The family serves as the patient's voice, honoring their expressed wishes. The decision belongs to the patient as documented in their advance directive." },
      { question: "When should you involve the interprofessional team?", answer: "When there is conflict, ethical dilemmas, or the family needs more detailed clinical information that requires physician involvement." }
    ],
    teachingPoints: [
      "Advance care planning conversations should happen when patients are well, not during a crisis.",
      "The substitute decision-maker must act based on the patient's known wishes, not their own.",
      "Palliative care consultation should be considered early, not just at end of life.",
      "Cultural, religious, and spiritual beliefs significantly influence family responses to deterioration and death."
    ]
  },
  {
    id: "fall-risk-assessment",
    title: "Fall Risk Assessment",
    category: "Geriatric Care",
    difficulty: "Intermediate",
    icon: "AlertTriangle",
    description:
      "Perform a comprehensive fall risk assessment on an older adult using a standardized tool and implement individualized prevention strategies.",
    scenarioIntro:
      "You are admitting an 82-year-old patient to a medical unit following a urinary tract infection. The patient uses a walker at home, takes multiple medications including a sedative and antihypertensive, and reports one fall in the past three months. You need to complete a fall risk assessment and implement prevention strategies.",
    equipment: [
      "Morse Fall Scale or facility fall risk tool",
      "Non-slip socks or footwear",
      "Call bell",
      "Bed alarm",
      "Fall prevention signage",
      "Assistive device (walker)",
      "Documentation tools"
    ],
    steps: [
      { id: "fra-1", instruction: "Perform hand hygiene and gather the fall risk assessment tool.", rationale: "Standard precautions and preparation for a systematic assessment.", criticalStep: false },
      { id: "fra-2", instruction: "Identify the patient using two identifiers.", rationale: "Patient safety standard.", criticalStep: true },
      { id: "fra-3", instruction: "Complete the Morse Fall Scale or facility-approved fall risk assessment tool.", rationale: "Standardized tools provide objective, evidence-based fall risk scoring for consistent classification.", criticalStep: true },
      { id: "fra-4", instruction: "Assess fall history: number of falls in the past 12 months, circumstances, and injuries sustained.", rationale: "Previous falls are the strongest predictor of future falls. Circumstances reveal modifiable risk factors.", criticalStep: true },
      { id: "fra-5", instruction: "Review current medications for fall-risk contributors: sedatives, opioids, antihypertensives, diuretics, and psychotropics.", rationale: "Polypharmacy and specific medication classes significantly increase fall risk through orthostatic hypotension, sedation, and impaired balance.", criticalStep: true },
      { id: "fra-6", instruction: "Assess gait and balance: observe ambulation, use of assistive device, steadiness, and ability to turn.", rationale: "Impaired gait and balance are primary fall risk factors. The Timed Up and Go test is a validated tool.", criticalStep: true },
      { id: "fra-7", instruction: "Assess orthostatic vital signs: lying, sitting, and standing blood pressures.", rationale: "A drop of 20 mmHg systolic or 10 mmHg diastolic upon standing indicates orthostatic hypotension, a major fall risk.", criticalStep: true },
      { id: "fra-8", instruction: "Assess vision and hearing.", rationale: "Sensory deficits impair spatial awareness and the ability to detect environmental hazards.", criticalStep: false },
      { id: "fra-9", instruction: "Assess cognitive status and orientation.", rationale: "Cognitive impairment, delirium, and confusion increase fall risk due to impaired judgment and safety awareness.", criticalStep: false },
      { id: "fra-10", instruction: "Assess continence status and toileting needs.", rationale: "Urgency and frequency of urination lead to rushing, which increases fall risk, especially at night.", criticalStep: false },
      { id: "fra-11", instruction: "Implement fall prevention interventions: non-slip footwear, bed in lowest position, call bell within reach, pathway clear of obstacles.", rationale: "Environmental modifications reduce modifiable risk factors and are evidence-based interventions.", criticalStep: true },
      { id: "fra-12", instruction: "Apply fall risk identification: yellow wristband, bed alarm, fall prevention signage.", rationale: "Visual identification alerts all staff to the patient's fall risk status for consistent safety measures.", criticalStep: true },
      { id: "fra-13", instruction: "Educate the patient and family about fall prevention strategies.", rationale: "Patient and family engagement in fall prevention improves adherence to safety measures.", criticalStep: false },
      { id: "fra-14", instruction: "Ensure the assistive device (walker) is within reach and in good working condition.", rationale: "Proper use of assistive devices improves stability and independence while reducing fall risk.", criticalStep: false },
      { id: "fra-15", instruction: "Document the fall risk score, interventions implemented, and patient education provided.", rationale: "Documentation communicates the care plan to all team members and provides legal evidence of risk mitigation.", criticalStep: true }
    ],
    commonErrors: [
      "Not using a standardized fall risk assessment tool",
      "Failing to assess orthostatic vital signs",
      "Not reviewing medications for fall-risk contributors",
      "Forgetting to assess gait and balance",
      "Implementing generic interventions instead of individualized strategies",
      "Not placing the call bell within reach",
      "Failing to apply fall risk identification (wristband, signage)"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must use a standardized tool, assess fall history, medications, gait, orthostatic vitals, implement prevention measures, and document.",
    clinicalPearls: [
      "Falls are the leading cause of injury in hospitalized older adults. Prevention is a nursing priority.",
      "The Morse Fall Scale scores: history of falls, secondary diagnosis, ambulatory aid, IV/heparin lock, gait, and mental status.",
      "Orthostatic hypotension is defined as a drop of ≥20 mmHg systolic or ≥10 mmHg diastolic within 3 minutes of standing.",
      "Toileting schedules and bedside commodes can significantly reduce nighttime fall risk.",
      "Post-fall assessment is critical: neurological status, injury assessment, and root cause analysis."
    ],
    examLevel: "RN/RPN",
    timeLimit: "12 minutes",
    candidateInstructions:
      "Perform a comprehensive fall risk assessment on an elderly patient using a standardized tool. Identify risk factors, implement prevention strategies, and document your findings.",
    patientActorScript:
      "You are a bit unsteady on your feet but insist you don't need help. You take 8 medications and admit to one fall last month 'because the rug was slippery.' If the nurse assesses your gait, demonstrate mild unsteadiness. Be cooperative with safety measures if explained well.",
    examinerChecklist: [
      { action: "Identifies patient with two identifiers", marks: 1 },
      { action: "Completes standardized fall risk tool", marks: 3 },
      { action: "Assesses fall history thoroughly", marks: 2 },
      { action: "Reviews medications for fall-risk drugs", marks: 2 },
      { action: "Assesses gait and balance", marks: 2 },
      { action: "Measures orthostatic vital signs", marks: 3 },
      { action: "Implements individualized prevention measures", marks: 3 },
      { action: "Applies fall risk identification", marks: 2 },
      { action: "Documents findings and interventions", marks: 2 }
    ],
    criticalFailCriteria: [
      "Not using a standardized fall risk assessment tool",
      "Failing to assess orthostatic vital signs",
      "Not implementing any fall prevention interventions",
      "Not documenting the assessment"
    ],
    examinerQuestions: [
      { question: "What is the most significant predictor of falls in hospitalized patients?", answer: "A previous history of falls is the strongest predictor of future falls." },
      { question: "What defines orthostatic hypotension?", answer: "A decrease of 20 mmHg or more in systolic BP or 10 mmHg or more in diastolic BP within 3 minutes of standing." },
      { question: "Name three medication classes that increase fall risk.", answer: "Sedatives/benzodiazepines, opioids, and antihypertensives. Also diuretics and psychotropic medications." }
    ],
    teachingPoints: [
      "Fall risk assessment should be repeated with any change in condition, medication, or after a fall event.",
      "Hourly rounding with the 4 Ps (pain, position, potty, possessions) reduces fall rates.",
      "Restraints are NOT a fall prevention strategy and can increase injury risk.",
      "Falls are a nurse-sensitive quality indicator tracked by regulatory agencies."
    ]
  },
  {
    id: "delirium-vs-dementia",
    title: "Delirium vs Dementia Assessment",
    category: "Geriatric Care",
    difficulty: "Advanced",
    icon: "Brain",
    description:
      "Differentiate between delirium and dementia in an older adult using clinical assessment tools, identify potential reversible causes, and initiate appropriate interventions.",
    scenarioIntro:
      "You are caring for an 84-year-old patient who was admitted for a hip fracture. The patient's daughter reports that her mother was 'fine yesterday' but is now confused, agitated, and pulling at her IV lines. The daughter states her mother has mild memory issues but 'nothing like this.' You need to determine if this is delirium and identify reversible causes.",
    equipment: [
      "CAM (Confusion Assessment Method) tool",
      "Mini-Mental State Examination or equivalent",
      "Penlight",
      "Vital signs equipment",
      "Medication administration record",
      "Documentation tools"
    ],
    steps: [
      { id: "dvd-1", instruction: "Perform hand hygiene and ensure patient safety: side rails, remove potential hazards.", rationale: "Confused patients are at high risk for injury; safety must be established before assessment.", criticalStep: true },
      { id: "dvd-2", instruction: "Identify the patient using two identifiers.", rationale: "Patient safety standard.", criticalStep: true },
      { id: "dvd-3", instruction: "Obtain a detailed history from the family about the patient's baseline cognitive function.", rationale: "Comparing current status to baseline differentiates acute delirium from chronic dementia.", criticalStep: true },
      { id: "dvd-4", instruction: "Determine the onset and course of the confusion: acute or gradual, fluctuating or stable.", rationale: "Delirium has an acute onset and fluctuating course; dementia has a gradual onset and progressive course.", criticalStep: true },
      { id: "dvd-5", instruction: "Apply the Confusion Assessment Method (CAM) tool to screen for delirium.", rationale: "CAM is the gold-standard screening tool for delirium, assessing acute onset, inattention, disorganized thinking, and altered LOC.", criticalStep: true },
      { id: "dvd-6", instruction: "Assess attention: ask the patient to recite months backward or serial 7s.", rationale: "Inattention is the hallmark feature of delirium and distinguishes it from dementia.", criticalStep: true },
      { id: "dvd-7", instruction: "Assess level of consciousness: alert, lethargic, stuporous, or comatose.", rationale: "Altered level of consciousness supports a delirium diagnosis; consciousness is typically preserved in dementia.", criticalStep: false },
      { id: "dvd-8", instruction: "Review medications for delirium-inducing agents: anticholinergics, benzodiazepines, opioids, steroids.", rationale: "Medications are one of the most common reversible causes of delirium in older adults.", criticalStep: true },
      { id: "dvd-9", instruction: "Assess for common delirium triggers: infection (UTI, pneumonia), pain, urinary retention, constipation, dehydration, electrolyte imbalance.", rationale: "Identifying and treating the underlying cause is the primary treatment for delirium.", criticalStep: true },
      { id: "dvd-10", instruction: "Check vital signs including temperature, oxygen saturation, and blood glucose.", rationale: "Fever, hypoxia, and hypoglycemia are treatable causes of acute confusion.", criticalStep: true },
      { id: "dvd-11", instruction: "Implement non-pharmacological interventions: reorient frequently, maintain day-night cycle, minimize noise, ensure glasses and hearing aids are available.", rationale: "Non-pharmacological strategies are first-line interventions for delirium management.", criticalStep: true },
      { id: "dvd-12", instruction: "Ensure adequate hydration and nutrition.", rationale: "Dehydration and malnutrition contribute to delirium and delay recovery.", criticalStep: false },
      { id: "dvd-13", instruction: "Notify the physician of your findings and the suspected delirium diagnosis.", rationale: "Delirium requires medical evaluation to identify and treat the underlying cause.", criticalStep: true },
      { id: "dvd-14", instruction: "Document the CAM assessment, baseline comparison, suspected triggers, and interventions.", rationale: "Documentation enables tracking of the patient's cognitive status and response to interventions.", criticalStep: true }
    ],
    commonErrors: [
      "Assuming confusion in elderly patients is 'just dementia'",
      "Not obtaining baseline cognitive information from family or caregivers",
      "Failing to use a standardized delirium screening tool (CAM)",
      "Not assessing attention, which is the hallmark of delirium",
      "Overlooking reversible causes: medications, infection, pain, dehydration",
      "Using physical restraints as a first intervention instead of non-pharmacological measures",
      "Not reassessing regularly for fluctuations"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must differentiate delirium from dementia, use the CAM tool, assess attention, identify reversible causes, implement non-pharmacological interventions, and notify the physician.",
    clinicalPearls: [
      "Delirium is ACUTE (hours to days) and REVERSIBLE. Dementia is CHRONIC (months to years) and PROGRESSIVE.",
      "Inattention is the cardinal feature of delirium. If the patient can focus and sustain attention, delirium is unlikely.",
      "Think DELIRIUM: Drugs, Electrolytes, Low oxygen, Infection, Retention (urinary), Impaction, Understimulation/overstimulation, Metabolic.",
      "Hypoactive delirium (quiet, withdrawn) is more common than hyperactive delirium but often goes unrecognized.",
      "Delirium in the elderly is a medical emergency and increases mortality significantly."
    ],
    examLevel: "RN/NP",
    timeLimit: "15 minutes",
    candidateInstructions:
      "Assess an elderly patient with acute confusion. Differentiate delirium from dementia using the CAM tool, identify reversible causes, and implement appropriate interventions.",
    patientActorScript:
      "You are confused and agitated. You cannot focus on questions and keep looking around the room. You pull at your IV tubing. You cannot recite months backward. When reoriented calmly, you settle briefly but then become confused again.",
    examinerChecklist: [
      { action: "Ensures patient safety before assessment", marks: 2 },
      { action: "Obtains baseline cognitive history from family", marks: 3 },
      { action: "Determines acute onset and fluctuating course", marks: 2 },
      { action: "Applies CAM tool correctly", marks: 3 },
      { action: "Assesses attention specifically", marks: 3 },
      { action: "Reviews medications for delirium triggers", marks: 2 },
      { action: "Identifies reversible causes", marks: 3 },
      { action: "Implements non-pharmacological interventions", marks: 3 },
      { action: "Notifies physician", marks: 2 },
      { action: "Documents findings", marks: 2 }
    ],
    criticalFailCriteria: [
      "Assuming confusion is dementia without assessment",
      "Not using a delirium screening tool",
      "Not looking for reversible causes",
      "Using restraints as first-line management",
      "Failing to notify the physician"
    ],
    examinerQuestions: [
      { question: "What are the four features assessed by the CAM tool?", answer: "Acute onset and fluctuating course, inattention, disorganized thinking, and altered level of consciousness." },
      { question: "What is the hallmark feature that distinguishes delirium from dementia?", answer: "Inattention. Patients with delirium cannot focus, sustain, or shift attention." },
      { question: "Name four common reversible causes of delirium.", answer: "Infection (UTI), medications (anticholinergics, benzodiazepines), dehydration, and pain." }
    ],
    teachingPoints: [
      "Delirium is often superimposed on pre-existing dementia, making diagnosis challenging.",
      "Prevention strategies (HELP protocol) include orientation, early mobilization, sleep hygiene, hydration, and sensory aids.",
      "Antipsychotics should only be used for delirium when the patient is a danger to self or others.",
      "Delirium can persist for weeks to months and is associated with increased length of stay, institutionalization, and mortality."
    ]
  },
  {
    id: "polypharmacy-review",
    title: "Polypharmacy Review",
    category: "Geriatric Care",
    difficulty: "Advanced",
    icon: "Pill",
    description:
      "Conduct a comprehensive medication review for an older adult taking multiple medications, identifying potentially inappropriate medications, interactions, and deprescribing opportunities.",
    scenarioIntro:
      "You are conducting a medication review for a 79-year-old patient admitted after a fall. The patient brings a bag of 14 medications, including prescription drugs, over-the-counter medications, and herbal supplements. The pharmacist has flagged the medication list for polypharmacy review.",
    equipment: [
      "Complete medication list",
      "Beers Criteria reference",
      "Drug interaction reference",
      "Medication reconciliation form",
      "Pill identification guide",
      "Documentation tools"
    ],
    steps: [
      { id: "pr-1", instruction: "Identify the patient using two identifiers.", rationale: "Patient safety standard for medication review.", criticalStep: true },
      { id: "pr-2", instruction: "Perform a complete medication reconciliation: list all prescription medications, OTC drugs, vitamins, and herbal supplements.", rationale: "A comprehensive list is the foundation of polypharmacy review; unlisted medications cause unidentified interactions.", criticalStep: true },
      { id: "pr-3", instruction: "Verify each medication: name, dose, frequency, route, and indication.", rationale: "Ensures accuracy and identifies medications without a clear indication, which may be candidates for deprescribing.", criticalStep: true },
      { id: "pr-4", instruction: "Ask the patient to describe how they take each medication, including timing and technique.", rationale: "Identifies non-adherence, incorrect administration, and practical issues such as difficulty swallowing pills.", criticalStep: true },
      { id: "pr-5", instruction: "Screen for potentially inappropriate medications using the Beers Criteria.", rationale: "The Beers Criteria identifies medications that pose higher risk than benefit in older adults, such as long-acting benzodiazepines and anticholinergics.", criticalStep: true },
      { id: "pr-6", instruction: "Assess for drug-drug interactions, particularly those that increase fall risk.", rationale: "Combinations of CNS depressants, antihypertensives, and diuretics multiply fall risk.", criticalStep: true },
      { id: "pr-7", instruction: "Assess for therapeutic duplication: two medications from the same class.", rationale: "Duplication increases side effect risk without additional therapeutic benefit.", criticalStep: true },
      { id: "pr-8", instruction: "Identify the prescribing cascade: a new drug prescribed to treat side effects of another drug.", rationale: "Prescribing cascades add unnecessary medications; the solution is often stopping the offending drug.", criticalStep: false },
      { id: "pr-9", instruction: "Assess renal and hepatic function for dose adjustment needs.", rationale: "Age-related decline in renal and hepatic function affects drug metabolism and elimination, requiring dose adjustments.", criticalStep: true },
      { id: "pr-10", instruction: "Discuss findings with the patient, explaining which medications may be contributing to their symptoms.", rationale: "Patient engagement improves adherence to deprescribing recommendations.", criticalStep: false },
      { id: "pr-11", instruction: "Collaborate with the prescriber and pharmacist to recommend deprescribing of inappropriate medications.", rationale: "Deprescribing is a systematic process of tapering or stopping medications that are no longer needed or are causing harm.", criticalStep: true },
      { id: "pr-12", instruction: "Educate the patient about the medication review outcomes and any changes.", rationale: "Understanding the rationale for changes improves patient adherence and reduces anxiety about stopping medications.", criticalStep: false },
      { id: "pr-13", instruction: "Document the complete medication reconciliation, identified issues, recommendations, and patient education.", rationale: "Documentation ensures continuity and provides a reference for all healthcare providers.", criticalStep: true }
    ],
    commonErrors: [
      "Not asking about OTC medications, vitamins, and herbal supplements",
      "Failing to verify how the patient actually takes each medication",
      "Not screening against the Beers Criteria",
      "Overlooking drug-drug interactions",
      "Not assessing renal function for dose adjustments",
      "Making deprescribing recommendations without interprofessional collaboration",
      "Not documenting the review"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must complete medication reconciliation, screen with Beers Criteria, identify interactions and duplications, assess renal function, recommend deprescribing, and document.",
    clinicalPearls: [
      "Polypharmacy is typically defined as taking 5 or more medications. Hyperpolypharmacy is 10 or more.",
      "The Beers Criteria is updated by the American Geriatrics Society and lists medications that are potentially inappropriate for older adults.",
      "Common Beers Criteria medications to avoid: long-acting benzodiazepines, first-generation antihistamines, and long-acting sulfonylureas.",
      "The prescribing cascade example: NSAID causes hypertension, which leads to a new antihypertensive being prescribed instead of stopping the NSAID.",
      "Deprescribing should be done one medication at a time with monitoring for withdrawal effects."
    ],
    examLevel: "RN/NP",
    timeLimit: "15 minutes",
    candidateInstructions:
      "Conduct a comprehensive medication review for an elderly patient taking 14 medications. Use the Beers Criteria, identify interactions and duplications, and make deprescribing recommendations.",
    patientActorScript:
      "You bring a bag of 14 pill bottles. You are unsure what some of them are for. You take a sleeping pill your neighbor gave you and a herbal supplement for memory. When asked about your fall, mention feeling dizzy when standing up.",
    examinerChecklist: [
      { action: "Identifies patient with two identifiers", marks: 1 },
      { action: "Completes full medication reconciliation including OTC and supplements", marks: 3 },
      { action: "Verifies each medication's indication", marks: 2 },
      { action: "Screens with Beers Criteria", marks: 3 },
      { action: "Identifies drug-drug interactions", marks: 3 },
      { action: "Identifies therapeutic duplication", marks: 2 },
      { action: "Assesses renal function for dose adjustments", marks: 2 },
      { action: "Recommends deprescribing with interprofessional collaboration", marks: 3 },
      { action: "Documents findings and recommendations", marks: 2 }
    ],
    criticalFailCriteria: [
      "Not including OTC medications and supplements in the review",
      "Not using the Beers Criteria or equivalent screening tool",
      "Missing obvious drug-drug interactions",
      "Not documenting the medication review"
    ],
    examinerQuestions: [
      { question: "What is the Beers Criteria and how is it used?", answer: "The Beers Criteria is an evidence-based list of medications that are potentially inappropriate for older adults. It guides deprescribing decisions by identifying high-risk medications." },
      { question: "What is a prescribing cascade? Give an example.", answer: "A prescribing cascade occurs when a new drug is prescribed to treat the side effect of another drug. Example: An NSAID causes elevated BP, leading to a new antihypertensive instead of stopping the NSAID." },
      { question: "Why is deprescribing important in geriatric patients?", answer: "Reducing unnecessary medications decreases adverse drug events, falls, hospitalizations, and improves quality of life. Each additional medication increases the risk of side effects exponentially." }
    ],
    teachingPoints: [
      "Medication reconciliation should occur at every transition of care: admission, transfer, and discharge.",
      "The START/STOPP criteria is an alternative to Beers that also identifies omissions in prescribing.",
      "Patient 'brown bag' reviews, where they bring all medications, are highly effective for identifying polypharmacy.",
      "Pharmacists are essential partners in polypharmacy management and deprescribing."
    ]
  },
  {
    id: "home-safety-assessment",
    title: "Home Safety Assessment",
    category: "Community Health",
    difficulty: "Intermediate",
    icon: "Home",
    description:
      "Conduct a comprehensive home safety assessment for a patient being discharged to home, identifying environmental hazards and recommending modifications to prevent falls and injuries.",
    scenarioIntro:
      "You are a community health nurse preparing to visit the home of a 76-year-old patient who was recently discharged after a hip replacement. The patient lives alone in a two-story house. You need to assess the home environment for safety hazards and recommend modifications.",
    equipment: [
      "Home safety assessment checklist",
      "Community resource directory",
      "Patient education materials on home safety",
      "Camera or documentation tool for noting hazards",
      "Documentation tools"
    ],
    steps: [
      { id: "hsa-1", instruction: "Introduce yourself, verify the patient's identity, and explain the purpose of the home safety assessment.", rationale: "Establishing rapport and explaining the purpose promotes cooperation and reduces anxiety.", criticalStep: true },
      { id: "hsa-2", instruction: "Assess the exterior: walkway condition, lighting, steps, handrails, and accessibility.", rationale: "Exterior hazards such as uneven walkways, poor lighting, and lack of handrails are common fall risks.", criticalStep: true },
      { id: "hsa-3", instruction: "Assess the entrance: doorway width for mobility aids, door locks, and threshold tripping hazards.", rationale: "Narrow doorways may prevent walker or wheelchair access; thresholds are common tripping points.", criticalStep: false },
      { id: "hsa-4", instruction: "Assess the living area: floor coverings, furniture arrangement for clear pathways, adequate lighting, and electrical cord placement.", rationale: "Throw rugs, cluttered pathways, and dim lighting are leading causes of falls in the home.", criticalStep: true },
      { id: "hsa-5", instruction: "Assess the kitchen: accessibility of frequently used items, fire safety, appliance safety, and floor condition.", rationale: "Reaching for high shelves increases fall risk; kitchen is the most common location for home burns.", criticalStep: false },
      { id: "hsa-6", instruction: "Assess the bathroom: grab bars near toilet and shower, non-slip mats, shower seat availability, and water temperature.", rationale: "The bathroom is the highest-risk area for falls. Grab bars reduce fall risk by up to 40%.", criticalStep: true },
      { id: "hsa-7", instruction: "Assess the bedroom: bed height, nightlight availability, clear path to bathroom, and phone accessibility.", rationale: "Nighttime falls are common when patients cannot see the path to the bathroom.", criticalStep: true },
      { id: "hsa-8", instruction: "Assess stairway safety: lighting, handrails on both sides, stair condition, and ability to navigate stairs.", rationale: "Stairs are a high-risk area; patients post-hip replacement may need to modify which floor they use.", criticalStep: true },
      { id: "hsa-9", instruction: "Assess medication storage and organization.", rationale: "Proper medication storage ensures medications are taken correctly and prevents accidental ingestion by children or pets.", criticalStep: false },
      { id: "hsa-10", instruction: "Assess emergency preparedness: working smoke detectors, carbon monoxide detectors, fire extinguisher, and emergency contact list.", rationale: "Functional safety devices and accessible emergency numbers are essential for patient safety.", criticalStep: true },
      { id: "hsa-11", instruction: "Assess the patient's functional ability within the home environment: transfers, mobility, and ADL performance.", rationale: "Observing the patient in their own environment reveals functional limitations not apparent in the hospital.", criticalStep: true },
      { id: "hsa-12", instruction: "Recommend specific modifications based on identified hazards.", rationale: "Actionable, specific recommendations improve compliance and safety outcomes.", criticalStep: true },
      { id: "hsa-13", instruction: "Provide information about community resources: home care services, Meals on Wheels, medical alert systems.", rationale: "Community services support independent living and provide safety nets for patients living alone.", criticalStep: false },
      { id: "hsa-14", instruction: "Document all findings, recommendations, and referrals.", rationale: "Documentation ensures accountability and enables follow-up on recommended modifications.", criticalStep: true }
    ],
    commonErrors: [
      "Not assessing the bathroom, which is the highest-risk area",
      "Focusing only on fall risks and ignoring fire safety and emergency preparedness",
      "Making generic recommendations instead of specific, actionable modifications",
      "Not assessing the patient's functional ability in the home",
      "Failing to provide community resource information",
      "Not documenting findings and recommendations"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must assess exterior, living areas, bathroom, bedroom, stairs, emergency preparedness, patient function, make specific recommendations, and document.",
    clinicalPearls: [
      "The bathroom is the single highest-risk area in the home for falls. Always assess and recommend grab bars.",
      "Remove all throw rugs or secure them with double-sided tape.",
      "Night lights along the path from bedroom to bathroom significantly reduce nighttime falls.",
      "Medical alert systems are critical for patients who live alone and are at fall risk.",
      "Assessing the patient performing tasks in their own home reveals functional limitations not seen in the hospital."
    ],
    examLevel: "RN/RPN",
    timeLimit: "15 minutes",
    candidateInstructions:
      "Conduct a comprehensive home safety assessment for an elderly patient post-hip replacement. Identify hazards in all areas of the home and make specific recommendations.",
    patientActorScript:
      "You live alone and are proud of your independence. Your house has throw rugs in the hallway, no grab bars in the bathroom, and dim lighting on the stairs. You are resistant to changes but open to suggestions if explained well. Your smoke detector battery is dead.",
    examinerChecklist: [
      { action: "Introduces self and explains purpose", marks: 1 },
      { action: "Assesses exterior and entrance", marks: 2 },
      { action: "Assesses living areas for hazards", marks: 2 },
      { action: "Assesses bathroom safety", marks: 3 },
      { action: "Assesses bedroom and nighttime safety", marks: 2 },
      { action: "Assesses stairway safety", marks: 2 },
      { action: "Assesses emergency preparedness", marks: 2 },
      { action: "Assesses patient function in home", marks: 2 },
      { action: "Makes specific safety recommendations", marks: 3 },
      { action: "Documents findings and recommendations", marks: 2 }
    ],
    criticalFailCriteria: [
      "Not assessing the bathroom",
      "Not checking smoke detectors or emergency preparedness",
      "Not making any specific recommendations",
      "Not documenting findings"
    ],
    examinerQuestions: [
      { question: "What is the highest-risk area in the home for falls?", answer: "The bathroom, due to wet surfaces, hard floors, and activities requiring balance changes such as getting in and out of the tub." },
      { question: "What single modification most reduces bathroom fall risk?", answer: "Installing grab bars near the toilet and in the shower/tub area." },
      { question: "Why is a home assessment more valuable than a hospital-based functional assessment?", answer: "The home environment reveals actual hazards and functional challenges specific to the patient's living situation that cannot be replicated in a hospital setting." }
    ],
    teachingPoints: [
      "Home safety assessment should be part of every community nursing visit for older adults.",
      "Cultural sensitivity is important; respect the patient's home while addressing safety.",
      "Economic barriers may prevent modifications; connect patients with community funding resources.",
      "Reassessment should occur after any change in functional status or after a fall."
    ]
  },
  {
    id: "chronic-disease-management",
    title: "Chronic Disease Management",
    category: "Community Health",
    difficulty: "Intermediate",
    icon: "ClipboardList",
    description:
      "Develop and implement a comprehensive chronic disease management plan for a patient with type 2 diabetes, including self-management education, monitoring, and care coordination.",
    scenarioIntro:
      "You are a community health nurse visiting a 58-year-old patient recently diagnosed with type 2 diabetes. The patient's HbA1c is 8.2% and they have been prescribed metformin 500mg twice daily. The patient has no prior experience managing diabetes and is overwhelmed. You need to establish a comprehensive management plan.",
    equipment: [
      "Blood glucose monitor and supplies",
      "Diabetes education materials",
      "Healthy eating plate model",
      "Medication information sheet",
      "Blood glucose log book",
      "Referral forms for dietitian and diabetes educator",
      "Documentation tools"
    ],
    steps: [
      { id: "cdm-1", instruction: "Identify the patient using two identifiers.", rationale: "Patient safety standard.", criticalStep: true },
      { id: "cdm-2", instruction: "Assess the patient's understanding of their diagnosis and readiness to learn.", rationale: "Meeting the patient at their current knowledge level improves education effectiveness.", criticalStep: true },
      { id: "cdm-3", instruction: "Explain type 2 diabetes in simple terms: what it is, why blood sugar control matters, and long-term implications.", rationale: "Understanding the disease process motivates self-management and adherence.", criticalStep: true },
      { id: "cdm-4", instruction: "Teach blood glucose self-monitoring: technique, target ranges, frequency, and when to check.", rationale: "Self-monitoring is the cornerstone of diabetes management, enabling the patient to understand the impact of food, activity, and medication.", criticalStep: true },
      { id: "cdm-5", instruction: "Demonstrate blood glucose monitoring and have the patient perform a return demonstration.", rationale: "Return demonstration confirms the patient can perform the technique independently and correctly.", criticalStep: true },
      { id: "cdm-6", instruction: "Teach about the prescribed medication (metformin): purpose, dose, timing, side effects, and importance of adherence.", rationale: "Metformin education includes taking with food to reduce GI side effects and understanding its role in glucose management.", criticalStep: true },
      { id: "cdm-7", instruction: "Teach recognition and management of hypoglycemia: symptoms, causes, and treatment (Rule of 15).", rationale: "Hypoglycemia is a life-threatening emergency. Patients must recognize symptoms and treat immediately.", criticalStep: true },
      { id: "cdm-8", instruction: "Teach recognition of hyperglycemia: symptoms, when to seek medical attention.", rationale: "Uncontrolled hyperglycemia can lead to diabetic ketoacidosis or hyperosmolar state.", criticalStep: false },
      { id: "cdm-9", instruction: "Provide nutrition education: carbohydrate counting basics, plate method, and glycemic impact of foods.", rationale: "Nutrition is a primary modifiable factor in blood glucose management.", criticalStep: true },
      { id: "cdm-10", instruction: "Discuss the role of physical activity in blood glucose management.", rationale: "Exercise improves insulin sensitivity and helps control blood glucose levels.", criticalStep: false },
      { id: "cdm-11", instruction: "Teach foot care: daily inspection, proper footwear, avoiding walking barefoot, and when to seek care.", rationale: "Diabetic neuropathy reduces sensation; foot injuries can progress to ulcers and amputation if not detected early.", criticalStep: true },
      { id: "cdm-12", instruction: "Review the schedule for ongoing monitoring: HbA1c every 3 months, annual eye exam, annual foot exam, kidney function tests.", rationale: "Regular monitoring detects complications early when intervention is most effective.", criticalStep: false },
      { id: "cdm-13", instruction: "Coordinate referrals: certified diabetes educator, dietitian, ophthalmologist, and podiatrist.", rationale: "Interprofessional team management improves diabetes outcomes.", criticalStep: false },
      { id: "cdm-14", instruction: "Set SMART goals collaboratively with the patient for the next visit.", rationale: "Patient-driven goals improve motivation and self-efficacy.", criticalStep: false },
      { id: "cdm-15", instruction: "Provide written educational materials and emergency contact numbers.", rationale: "Written materials reinforce verbal teaching and serve as a home reference.", criticalStep: false },
      { id: "cdm-16", instruction: "Document the care plan, education provided, patient understanding, and follow-up schedule.", rationale: "Documentation ensures continuity of care and tracks the patient's progress.", criticalStep: true }
    ],
    commonErrors: [
      "Providing too much information in a single visit",
      "Not teaching hypoglycemia recognition and management",
      "Forgetting to include foot care education",
      "Not having the patient demonstrate blood glucose monitoring",
      "Using medical jargon without plain-language explanation",
      "Not setting collaborative goals with the patient",
      "Failing to coordinate interprofessional referrals"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must assess readiness, teach disease basics, demonstrate blood glucose monitoring, review medication, teach hypoglycemia management, provide nutrition and foot care education, and document.",
    clinicalPearls: [
      "The HbA1c target for most adults with type 2 diabetes is less than 7%. The patient's HbA1c of 8.2% indicates poor control.",
      "The Rule of 15 for hypoglycemia: consume 15 grams of fast-acting carbohydrate, wait 15 minutes, recheck blood glucose.",
      "Metformin is taken with food to minimize GI side effects. It does not cause hypoglycemia when used alone.",
      "Foot care is one of the most important yet most overlooked aspects of diabetes education.",
      "Motivational interviewing techniques improve patient engagement in chronic disease management."
    ],
    examLevel: "RN/RPN",
    timeLimit: "15 minutes",
    candidateInstructions:
      "Provide comprehensive diabetes management education to a newly diagnosed patient. Cover blood glucose monitoring, medication, hypoglycemia, nutrition, foot care, and ongoing monitoring.",
    patientActorScript:
      "You are overwhelmed by the diagnosis. You eat fast food frequently and don't exercise. You are afraid of needles and nervous about checking your blood sugar. If the nurse is patient and supportive, gradually become more engaged. Ask 'Can I still eat rice?'",
    examinerChecklist: [
      { action: "Identifies patient with two identifiers", marks: 1 },
      { action: "Assesses understanding and readiness", marks: 2 },
      { action: "Explains diabetes in plain language", marks: 2 },
      { action: "Teaches blood glucose monitoring with return demonstration", marks: 3 },
      { action: "Reviews metformin education", marks: 2 },
      { action: "Teaches hypoglycemia recognition and Rule of 15", marks: 3 },
      { action: "Provides nutrition education", marks: 2 },
      { action: "Teaches foot care", marks: 2 },
      { action: "Documents care plan and education", marks: 2 }
    ],
    criticalFailCriteria: [
      "Not teaching hypoglycemia recognition and treatment",
      "Not demonstrating blood glucose monitoring",
      "Not providing any nutrition education",
      "Not documenting the care plan"
    ],
    examinerQuestions: [
      { question: "What is the Rule of 15 for hypoglycemia?", answer: "Consume 15 grams of fast-acting carbohydrate, wait 15 minutes, recheck blood glucose. Repeat if still below target." },
      { question: "Why is foot care education critical for diabetic patients?", answer: "Diabetic neuropathy reduces sensation, so patients may not feel injuries. Poor circulation impairs healing, leading to ulcers and potential amputation." },
      { question: "What is the HbA1c target for most adults with type 2 diabetes?", answer: "Less than 7% for most adults. Targets may be individualized based on age, comorbidities, and hypoglycemia risk." }
    ],
    teachingPoints: [
      "Diabetes self-management education should be ongoing, not a one-time event.",
      "The Chronic Care Model emphasizes productive interactions between informed patients and prepared practice teams.",
      "Cultural food preferences must be incorporated into nutrition education for effectiveness.",
      "Technology (apps, continuous glucose monitors) can enhance self-management in appropriate patients."
    ]
  },
  {
    id: "vaccination-counseling",
    title: "Vaccination Counseling",
    category: "Community Health",
    difficulty: "Beginner",
    icon: "Syringe",
    description:
      "Provide evidence-based vaccination counseling to a hesitant patient or parent, addressing concerns, providing accurate information, and obtaining informed consent.",
    scenarioIntro:
      "You are a public health nurse at a community immunization clinic. A 32-year-old parent has brought their 6-month-old infant for scheduled vaccinations but expresses concern about vaccine safety. The parent states 'I've read that vaccines cause autism and I'm not sure I want to proceed.' You need to address their concerns using evidence-based information.",
    equipment: [
      "Vaccine Information Statements (VIS)",
      "Immunization schedule (current CDC/NACI)",
      "Consent form",
      "Evidence-based FAQ handout",
      "Vaccine administration supplies",
      "Anaphylaxis kit",
      "Documentation tools"
    ],
    steps: [
      { id: "vc-1", instruction: "Introduce yourself and establish a non-judgmental, welcoming environment.", rationale: "A non-judgmental approach builds trust and opens dialogue. Dismissing concerns creates resistance.", criticalStep: true },
      { id: "vc-2", instruction: "Ask the parent to share their specific concerns about vaccination.", rationale: "Understanding the exact concerns allows targeted, relevant responses rather than generic reassurance.", criticalStep: true },
      { id: "vc-3", instruction: "Listen actively and validate their desire to make the best decision for their child.", rationale: "Validation acknowledges the parent's role as decision-maker and strengthens the therapeutic relationship.", criticalStep: true },
      { id: "vc-4", instruction: "Address the autism concern directly: explain that the study claiming a link was retracted due to fraud, and that numerous large studies have found no connection.", rationale: "The Wakefield study was retracted in 2010. Multiple studies involving millions of children have found no link between vaccines and autism.", criticalStep: true },
      { id: "vc-5", instruction: "Explain the benefits of vaccination: disease prevention, herd immunity, and protection of vulnerable populations.", rationale: "Understanding the purpose and benefits provides a positive framework for decision-making.", criticalStep: true },
      { id: "vc-6", instruction: "Explain the risks of not vaccinating: susceptibility to preventable diseases, potential complications, and community impact.", rationale: "Understanding the real risks of vaccine-preventable diseases provides context for the risk-benefit analysis.", criticalStep: true },
      { id: "vc-7", instruction: "Discuss common side effects (mild, expected) versus serious adverse reactions (rare).", rationale: "Transparency about side effects builds trust and prepares the parent for expected post-vaccination responses.", criticalStep: false },
      { id: "vc-8", instruction: "Provide the Vaccine Information Statement (VIS) and review key points.", rationale: "VIS provision is legally required before vaccination and ensures the parent has written, standardized information.", criticalStep: true },
      { id: "vc-9", instruction: "Answer all remaining questions honestly. If unsure, offer to find the answer rather than guessing.", rationale: "Honesty and humility build trust. Providing inaccurate information damages credibility.", criticalStep: false },
      { id: "vc-10", instruction: "Respect the parent's decision, whether they consent or decline.", rationale: "Autonomy must be respected. Coercion is unethical and may permanently damage the relationship.", criticalStep: true },
      { id: "vc-11", instruction: "If consent is given, verify allergies and contraindications before administration.", rationale: "Screening prevents adverse reactions in patients with known contraindications.", criticalStep: true },
      { id: "vc-12", instruction: "Document the counseling provided, VIS given, consent status, and any vaccines administered.", rationale: "Documentation provides legal evidence of informed consent and records the immunization.", criticalStep: true }
    ],
    commonErrors: [
      "Being dismissive of the parent's concerns",
      "Not asking what specific concerns the parent has",
      "Providing inaccurate information about vaccine safety",
      "Using fear-based tactics instead of evidence-based counseling",
      "Not providing the Vaccine Information Statement",
      "Pressuring or coercing a hesitant parent",
      "Forgetting to screen for contraindications before administration"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must listen to concerns, provide evidence-based responses, address the autism myth, discuss benefits and risks, provide VIS, respect autonomy, and document.",
    clinicalPearls: [
      "The motivational interviewing approach is more effective than lecturing for vaccine-hesitant parents.",
      "The Wakefield study linking MMR to autism was retracted in 2010 for ethical violations and data fraud.",
      "Herd immunity requires 85-95% vaccination rates depending on the disease.",
      "True contraindications to vaccination are rare. Most commonly cited 'reasons' are actually misconceptions.",
      "A strong recommendation from a trusted healthcare provider is the single most influential factor in vaccination decisions."
    ],
    examLevel: "RN/RPN",
    timeLimit: "10 minutes",
    candidateInstructions:
      "A parent is hesitant about vaccinating their infant due to concerns about autism. Provide evidence-based counseling, address their concerns, and facilitate informed decision-making.",
    patientActorScript:
      "You are a concerned parent who read online that vaccines cause autism. You are not anti-vaccine but are scared. If the nurse listens to your concerns and provides evidence calmly, you become more open. If the nurse is dismissive, become defensive and refuse.",
    examinerChecklist: [
      { action: "Establishes non-judgmental rapport", marks: 2 },
      { action: "Asks about specific concerns", marks: 2 },
      { action: "Validates parental concern", marks: 2 },
      { action: "Addresses autism myth with evidence", marks: 3 },
      { action: "Explains benefits of vaccination", marks: 2 },
      { action: "Explains risks of not vaccinating", marks: 2 },
      { action: "Provides Vaccine Information Statement", marks: 2 },
      { action: "Respects parent's autonomy", marks: 2 },
      { action: "Documents counseling and outcome", marks: 2 }
    ],
    criticalFailCriteria: [
      "Being dismissive or judgmental of the parent's concerns",
      "Providing inaccurate medical information",
      "Not providing the Vaccine Information Statement",
      "Coercing or pressuring the parent to vaccinate"
    ],
    examinerQuestions: [
      { question: "What evidence exists regarding the vaccine-autism link?", answer: "The original 1998 Wakefield study was retracted in 2010 due to fraud. Multiple large-scale studies involving millions of children have found no link between vaccines and autism." },
      { question: "What communication approach is most effective for vaccine-hesitant parents?", answer: "Motivational interviewing: ask open-ended questions, listen actively, validate concerns, and provide evidence-based information without judgment." },
      { question: "What are true contraindications to vaccination?", answer: "Severe allergic reaction (anaphylaxis) to a previous dose or vaccine component. Some live vaccines are contraindicated in immunocompromised patients and pregnant women." }
    ],
    teachingPoints: [
      "Vaccine hesitancy is recognized by the WHO as one of the top 10 threats to global health.",
      "The presumptive approach ('Your child is due for vaccines today') is more effective than the participatory approach ('Would you like to vaccinate today?').",
      "Documentation of refusal should include the risks discussed and the parent's signature.",
      "Ongoing relationship-building is key; parents who decline today may accept at future visits."
    ]
  },
  {
    id: "septic-shock-management",
    title: "Septic Shock Management",
    category: "Critical Care",
    difficulty: "Advanced",
    icon: "AlertTriangle",
    description:
      "Recognize septic shock and initiate time-critical interventions following the Surviving Sepsis Campaign guidelines, including fluid resuscitation, vasopressor initiation, and antibiotic administration.",
    scenarioIntro:
      "You are caring for a 67-year-old patient in the ICU who was admitted with pneumonia. Over the past hour, the patient has become tachycardic (HR 128), hypotensive (BP 78/42), tachypneic (RR 28), and febrile (39.2°C). Despite a 1-liter normal saline bolus, the blood pressure remains low. Lactate level is 4.8 mmol/L. You suspect septic shock.",
    equipment: [
      "IV access supplies (large bore)",
      "Crystalloid fluid (normal saline or lactated Ringer's)",
      "Vasopressor infusion (norepinephrine)",
      "Blood culture bottles",
      "Broad-spectrum antibiotics",
      "Arterial line setup",
      "Central venous catheter supplies",
      "Continuous monitoring equipment",
      "Urinary catheter",
      "Documentation tools"
    ],
    steps: [
      { id: "ssm-1", instruction: "Recognize the clinical presentation of septic shock: infection source, SIRS criteria met, hypotension refractory to initial fluid resuscitation, and elevated lactate.", rationale: "Septic shock is defined as sepsis with persistent hypotension requiring vasopressors and lactate greater than 2 mmol/L despite adequate fluid resuscitation.", criticalStep: true },
      { id: "ssm-2", instruction: "Activate the sepsis response team or rapid response and communicate using SBAR.", rationale: "Septic shock requires immediate multidisciplinary response. Early intervention significantly reduces mortality.", criticalStep: true },
      { id: "ssm-3", instruction: "Ensure two large-bore IV access sites (18 gauge or larger).", rationale: "Large-bore access allows rapid fluid administration and medication delivery.", criticalStep: true },
      { id: "ssm-4", instruction: "Obtain blood cultures (at least two sets from two different sites) BEFORE initiating antibiotics.", rationale: "Blood cultures identify the causative organism. They must be drawn before antibiotics to avoid false-negative results.", criticalStep: true },
      { id: "ssm-5", instruction: "Administer broad-spectrum antibiotics within one hour of septic shock recognition.", rationale: "Each hour of delay in antibiotic administration increases mortality by approximately 7.6%.", criticalStep: true },
      { id: "ssm-6", instruction: "Initiate aggressive fluid resuscitation: 30 mL/kg of crystalloid within the first 3 hours.", rationale: "Volume replacement restores intravascular volume and tissue perfusion. This is the Surviving Sepsis Campaign standard.", criticalStep: true },
      { id: "ssm-7", instruction: "Reassess fluid responsiveness using clinical endpoints: MAP, urine output, capillary refill, lactate clearance.", rationale: "Ongoing assessment prevents both under-resuscitation and fluid overload.", criticalStep: true },
      { id: "ssm-8", instruction: "If hypotension persists after initial fluid bolus, initiate norepinephrine infusion targeting MAP greater than or equal to 65 mmHg.", rationale: "Norepinephrine is the first-line vasopressor for septic shock. Target MAP of 65 mmHg ensures organ perfusion.", criticalStep: true },
      { id: "ssm-9", instruction: "Insert an indwelling urinary catheter and monitor urine output hourly.", rationale: "Urine output of 0.5 mL/kg/hr or greater indicates adequate renal perfusion; oliguria indicates end-organ dysfunction.", criticalStep: true },
      { id: "ssm-10", instruction: "Monitor serum lactate every 2-4 hours. Target lactate normalization.", rationale: "Lactate clearance is a marker of tissue perfusion improvement. Persistent elevation indicates ongoing tissue hypoxia.", criticalStep: true },
      { id: "ssm-11", instruction: "Assess for end-organ dysfunction: altered mental status, rising creatinine, elevated liver enzymes, coagulopathy.", rationale: "Multi-organ dysfunction indicates progression of septic shock and may require escalation of care.", criticalStep: false },
      { id: "ssm-12", instruction: "Prepare for central venous access and arterial line insertion.", rationale: "Central access allows vasopressor infusion; arterial line provides continuous blood pressure monitoring.", criticalStep: false },
      { id: "ssm-13", instruction: "Reassess the patient frequently and communicate changes to the medical team.", rationale: "Continuous reassessment guides treatment adjustments and detects deterioration early.", criticalStep: true },
      { id: "ssm-14", instruction: "Document all assessments, interventions, vital signs trends, and responses to treatment.", rationale: "Thorough documentation in critical care ensures continuity and provides a legal record of time-sensitive interventions.", criticalStep: true }
    ],
    commonErrors: [
      "Delaying antibiotic administration beyond one hour",
      "Drawing blood cultures after starting antibiotics",
      "Insufficient fluid resuscitation volume",
      "Not targeting MAP of 65 mmHg with vasopressors",
      "Failing to monitor lactate serially",
      "Not recognizing the transition from sepsis to septic shock",
      "Inadequate documentation of time-critical interventions"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must recognize septic shock, activate rapid response, obtain cultures before antibiotics, administer antibiotics within one hour, provide 30 mL/kg fluid, initiate vasopressors targeting MAP ≥ 65, monitor lactate, and document.",
    clinicalPearls: [
      "The SEP-1 bundle: blood cultures, lactate, antibiotics within 1 hour, 30 mL/kg crystalloid, and vasopressors if hypotension persists.",
      "Blood cultures BEFORE antibiotics. This is a classic exam question and a critical clinical practice.",
      "Norepinephrine is the FIRST-LINE vasopressor for septic shock. Vasopressin or epinephrine may be added as second-line.",
      "Lactate greater than 4 mmol/L is associated with significantly increased mortality.",
      "Source control (e.g., draining an abscess, removing an infected device) is essential in addition to antibiotics."
    ],
    examLevel: "RN/NP",
    timeLimit: "15 minutes",
    candidateInstructions:
      "Recognize and manage septic shock in a critically ill patient. Follow the Surviving Sepsis Campaign guidelines for fluid resuscitation, antibiotic administration, and vasopressor initiation.",
    patientActorScript:
      "You are confused and lethargic. Your skin is warm and flushed. You respond slowly to questions. Your blood pressure remains low despite IV fluids. You become less responsive over time if treatment is delayed.",
    examinerChecklist: [
      { action: "Recognizes septic shock presentation", marks: 3 },
      { action: "Activates rapid response/sepsis team", marks: 2 },
      { action: "Ensures large-bore IV access", marks: 1 },
      { action: "Obtains blood cultures before antibiotics", marks: 3 },
      { action: "Administers antibiotics within one hour", marks: 3 },
      { action: "Initiates 30 mL/kg fluid resuscitation", marks: 3 },
      { action: "Initiates vasopressor targeting MAP ≥ 65", marks: 3 },
      { action: "Monitors urine output and lactate", marks: 2 },
      { action: "Documents all interventions with timing", marks: 2 }
    ],
    criticalFailCriteria: [
      "Delaying antibiotics beyond one hour",
      "Drawing blood cultures after starting antibiotics",
      "Not providing adequate fluid resuscitation",
      "Not initiating vasopressors for persistent hypotension",
      "Failing to monitor lactate"
    ],
    examinerQuestions: [
      { question: "What is the first-line vasopressor for septic shock?", answer: "Norepinephrine, titrated to a target MAP of 65 mmHg or greater." },
      { question: "Why must blood cultures be drawn before antibiotics?", answer: "Antibiotics can sterilize blood cultures, leading to false-negative results and inability to identify the causative organism for targeted therapy." },
      { question: "What volume of crystalloid should be administered in the first 3 hours?", answer: "30 mL/kg of crystalloid. For a 70 kg patient, that is 2,100 mL." }
    ],
    teachingPoints: [
      "Septic shock has a mortality rate of 30-50%. Early recognition and bundle compliance significantly improve outcomes.",
      "The Hour-1 bundle emphasizes that ALL key interventions should begin within the first hour.",
      "Dynamic measures of fluid responsiveness (passive leg raise, pulse pressure variation) are preferred over static measures (CVP).",
      "Corticosteroids (hydrocortisone) may be added for refractory septic shock not responding to fluids and vasopressors."
    ]
  },
  {
    id: "rapid-deterioration",
    title: "Rapid Deterioration Recognition",
    category: "Critical Care",
    difficulty: "Advanced",
    icon: "Activity",
    description:
      "Recognize early signs of clinical deterioration in a hospitalized patient using early warning scores, escalate care appropriately, and initiate stabilization measures.",
    scenarioIntro:
      "You are caring for a 62-year-old patient on a general medical ward, admitted two days ago for cellulitis. During your hourly rounds, you notice the patient is more drowsy than before, their respiratory rate has increased to 26, heart rate is 110, blood pressure has dropped to 96/58, and oxygen saturation is 91% on room air. The patient appears pale and diaphoretic.",
    equipment: [
      "Early Warning Score (NEWS/MEWS) chart",
      "Vital signs equipment",
      "Oxygen delivery devices",
      "IV access supplies",
      "SBAR communication tool",
      "Crash cart location awareness",
      "Documentation tools"
    ],
    steps: [
      { id: "rdr-1", instruction: "Perform a rapid systematic assessment: airway, breathing, circulation, disability, exposure (ABCDE).", rationale: "ABCDE provides a structured approach to rapidly identify life-threatening problems in priority order.", criticalStep: true },
      { id: "rdr-2", instruction: "Obtain a complete set of vital signs immediately: HR, BP, RR, SpO2, temperature, and level of consciousness.", rationale: "Vital signs quantify the degree of deterioration and guide the urgency of response.", criticalStep: true },
      { id: "rdr-3", instruction: "Calculate the early warning score (NEWS or facility-approved tool).", rationale: "Early warning scores aggregate vital sign abnormalities into a single score that triggers escalation protocols.", criticalStep: true },
      { id: "rdr-4", instruction: "Apply supplemental oxygen to maintain SpO2 above 94% (or target range for COPD patients).", rationale: "Hypoxia must be corrected immediately to prevent organ damage.", criticalStep: true },
      { id: "rdr-5", instruction: "Ensure IV access is patent and functional. Establish a second IV if needed.", rationale: "Deteriorating patients require reliable IV access for fluid resuscitation and emergency medications.", criticalStep: true },
      { id: "rdr-6", instruction: "Position the patient appropriately: elevate head of bed for respiratory distress, or position flat with legs elevated for hypotension.", rationale: "Positioning optimizes ventilation or promotes venous return depending on the clinical presentation.", criticalStep: false },
      { id: "rdr-7", instruction: "Activate the rapid response team (RRT) or escalate to the most responsible physician using SBAR communication.", rationale: "Timely escalation brings critical care expertise to the bedside. SBAR provides a structured, concise handoff.", criticalStep: true },
      { id: "rdr-8", instruction: "Communicate using SBAR: Situation, Background, Assessment, Recommendation.", rationale: "SBAR standardizes communication, reduces errors, and ensures all critical information is transmitted.", criticalStep: true },
      { id: "rdr-9", instruction: "Initiate a fluid bolus if hypotensive and no contraindication (e.g., fluid overload).", rationale: "A crystalloid bolus helps restore intravascular volume and improve blood pressure in hypovolemic or distributive shock.", criticalStep: true },
      { id: "rdr-10", instruction: "Obtain point-of-care investigations: blood glucose, 12-lead ECG if indicated.", rationale: "Hypoglycemia and cardiac events are common treatable causes of acute deterioration.", criticalStep: false },
      { id: "rdr-11", instruction: "Review the medication administration record for potential contributing medications.", rationale: "Medications such as opioids, sedatives, or antihypertensives may be contributing to the deterioration.", criticalStep: false },
      { id: "rdr-12", instruction: "Stay with the patient and continue monitoring vital signs every 5-15 minutes until the response team arrives.", rationale: "Continuous monitoring detects further deterioration and provides trending data for the response team.", criticalStep: true },
      { id: "rdr-13", instruction: "Prepare for potential escalation: locate the crash cart, prepare for transfer to a higher level of care.", rationale: "Preparedness reduces response time if the patient's condition worsens further.", criticalStep: false },
      { id: "rdr-14", instruction: "Document the timeline of deterioration, assessments, interventions, communication, and response.", rationale: "Accurate, time-stamped documentation is critical for continuity of care and legal record-keeping.", criticalStep: true }
    ],
    commonErrors: [
      "Not recognizing the significance of subtle vital sign changes",
      "Failing to calculate or act on early warning scores",
      "Delaying escalation to the rapid response team",
      "Not using structured communication (SBAR) when calling for help",
      "Leaving the deteriorating patient unattended",
      "Not applying supplemental oxygen for hypoxia",
      "Incomplete documentation of the timeline"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must perform ABCDE assessment, calculate early warning score, apply oxygen, ensure IV access, activate rapid response using SBAR, initiate fluid resuscitation, maintain continuous monitoring, and document.",
    clinicalPearls: [
      "Subtle changes in vital signs often precede overt deterioration by 6-8 hours. Trust your clinical instincts.",
      "The National Early Warning Score (NEWS) uses: respiratory rate, SpO2, supplemental oxygen use, temperature, systolic BP, heart rate, and level of consciousness.",
      "A NEWS score of 7 or above is considered a critical trigger requiring immediate escalation.",
      "Respiratory rate is the single best predictor of clinical deterioration. An increasing trend is a red flag.",
      "Failure to rescue (failure to recognize and respond to deterioration) is a leading cause of preventable in-hospital deaths."
    ],
    examLevel: "RN",
    timeLimit: "10 minutes",
    candidateInstructions:
      "You discover a patient who is rapidly deteriorating. Perform an ABCDE assessment, calculate an early warning score, initiate stabilization measures, and escalate care using SBAR.",
    patientActorScript:
      "You are drowsy and confused. You are breathing rapidly and feel dizzy. You respond slowly to questions. Your skin is pale and damp. If asked, you report feeling 'something is not right.' You become less responsive over time.",
    examinerChecklist: [
      { action: "Performs ABCDE rapid assessment", marks: 3 },
      { action: "Obtains complete vital signs", marks: 2 },
      { action: "Calculates early warning score", marks: 3 },
      { action: "Applies supplemental oxygen", marks: 2 },
      { action: "Ensures IV access", marks: 1 },
      { action: "Activates rapid response team", marks: 3 },
      { action: "Communicates using SBAR", marks: 3 },
      { action: "Initiates fluid resuscitation", marks: 2 },
      { action: "Maintains continuous monitoring", marks: 2 },
      { action: "Documents timeline and interventions", marks: 2 }
    ],
    criticalFailCriteria: [
      "Failing to recognize the significance of abnormal vital signs",
      "Not escalating to the rapid response team",
      "Leaving the patient unattended during deterioration",
      "Not applying oxygen for SpO2 below 94%",
      "Not documenting the event"
    ],
    examinerQuestions: [
      { question: "What vital sign is the single best predictor of deterioration?", answer: "Respiratory rate. An increasing respiratory rate is often the earliest indicator of clinical deterioration." },
      { question: "What does SBAR stand for and why is it important?", answer: "Situation, Background, Assessment, Recommendation. It provides a standardized communication framework that reduces errors during critical escalation." },
      { question: "What is a NEWS score of 7 or above considered?", answer: "A critical trigger requiring immediate review by the senior clinician or rapid response team." }
    ],
    teachingPoints: [
      "Rapid response teams reduce cardiac arrest rates by 17-65% when used appropriately.",
      "Nurses should never hesitate to call a rapid response based on clinical concern, even if the score doesn't meet the trigger threshold.",
      "The 'worried' criterion — when the nurse feels something is wrong — is a valid reason for escalation.",
      "Post-event debriefing improves future recognition and response to deterioration."
    ]
  },
  {
    id: "cardiac-arrest-response",
    title: "Cardiac Arrest Initial Response",
    category: "Critical Care",
    difficulty: "Advanced",
    icon: "Heart",
    description:
      "Respond to a witnessed in-hospital cardiac arrest by initiating high-quality CPR, activating the code team, applying the AED/defibrillator, and coordinating the initial resuscitation response.",
    scenarioIntro:
      "You enter a patient's room for routine vital signs and find the 70-year-old patient unresponsive in bed. The cardiac monitor shows ventricular fibrillation. There is no pulse. You are the first responder and must initiate the code blue response.",
    equipment: [
      "Crash cart with defibrillator",
      "Bag-valve-mask (BVM)",
      "Oral airway",
      "Backboard",
      "Code blue documentation tools",
      "IV access supplies",
      "Emergency medications (epinephrine, amiodarone)",
      "Suction equipment"
    ],
    steps: [
      { id: "car-1", instruction: "Confirm unresponsiveness: tap shoulders and shout 'Are you okay?'", rationale: "Establishes that the patient is truly unresponsive before initiating resuscitation.", criticalStep: true },
      { id: "car-2", instruction: "Call for help immediately: activate the code blue/cardiac arrest team.", rationale: "Early activation brings the resuscitation team with advanced equipment and medications to the bedside.", criticalStep: true },
      { id: "car-3", instruction: "Check for a carotid pulse for no more than 10 seconds.", rationale: "Pulse check should be rapid; delays in starting CPR worsen outcomes.", criticalStep: true },
      { id: "car-4", instruction: "If no pulse, place the backboard under the patient and begin chest compressions immediately.", rationale: "A firm surface is needed for effective compressions. High-quality CPR must begin within 10 seconds of cardiac arrest recognition.", criticalStep: true },
      { id: "car-5", instruction: "Perform high-quality chest compressions: rate of 100-120 per minute, depth of 5-6 cm (2-2.4 inches), full chest recoil, minimal interruptions.", rationale: "Compression quality directly determines survival. Rate, depth, recoil, and minimal interruptions are the four pillars of high-quality CPR.", criticalStep: true },
      { id: "car-6", instruction: "Delegate roles: assign someone to retrieve the crash cart, prepare the defibrillator, manage the airway, start timing, and document.", rationale: "Clear role delegation improves efficiency and ensures all critical tasks are performed simultaneously.", criticalStep: true },
      { id: "car-7", instruction: "Apply defibrillator pads and analyze the rhythm. Identify ventricular fibrillation as a shockable rhythm.", rationale: "Early defibrillation for VF/VT is the most effective intervention. Every minute of delay decreases survival by 7-10%.", criticalStep: true },
      { id: "car-8", instruction: "Deliver the first shock. Immediately resume CPR for 2 minutes before rechecking rhythm.", rationale: "Post-shock, the myocardium needs perfusion from CPR before it can generate an effective rhythm.", criticalStep: true },
      { id: "car-9", instruction: "Ensure IV or IO access is established for medication administration.", rationale: "Vascular access allows delivery of resuscitation medications.", criticalStep: true },
      { id: "car-10", instruction: "Administer epinephrine 1 mg IV as directed by the code team leader (every 3-5 minutes).", rationale: "Epinephrine increases coronary perfusion pressure and myocardial blood flow during CPR.", criticalStep: true },
      { id: "car-11", instruction: "Provide ventilations using bag-valve-mask: 1 breath every 6 seconds (10 breaths per minute) with an advanced airway, or 30:2 ratio without.", rationale: "Adequate oxygenation supports myocardial recovery. Over-ventilation decreases venous return and worsens outcomes.", criticalStep: false },
      { id: "car-12", instruction: "Rotate compressors every 2 minutes to prevent fatigue and maintain compression quality.", rationale: "Compressor fatigue begins within 1-2 minutes, even if unrecognized. Regular rotation maintains compression effectiveness.", criticalStep: true },
      { id: "car-13", instruction: "Communicate clearly with the team: announce rhythm checks, medication timing, and any changes.", rationale: "Closed-loop communication prevents errors and ensures team situational awareness.", criticalStep: false },
      { id: "car-14", instruction: "After ROSC (return of spontaneous circulation), perform immediate post-arrest assessment and stabilization.", rationale: "Post-ROSC care includes hemodynamic support, targeted temperature management consideration, and transfer to ICU.", criticalStep: false },
      { id: "car-15", instruction: "Ensure complete documentation of the resuscitation: timeline, interventions, medications, rhythms, and outcome.", rationale: "Code documentation must be accurate and time-stamped for legal record-keeping and quality review.", criticalStep: true }
    ],
    commonErrors: [
      "Delaying the start of chest compressions while looking for equipment",
      "Performing compressions at incorrect rate or depth",
      "Not allowing full chest recoil between compressions",
      "Interrupting compressions for more than 10 seconds",
      "Over-ventilating the patient",
      "Not rotating compressors every 2 minutes",
      "Failing to delegate roles clearly",
      "Not documenting the resuscitation timeline"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must confirm unresponsiveness, activate the code team, begin high-quality CPR within 10 seconds, apply and use the defibrillator, delegate roles, ensure vascular access, and document.",
    clinicalPearls: [
      "Push hard, push fast, allow full recoil, and minimize interruptions — the four pillars of high-quality CPR.",
      "VF/pulseless VT are shockable rhythms. PEA and asystole are non-shockable rhythms.",
      "Defibrillation within 3-5 minutes of VF onset gives the best chance of survival.",
      "Epinephrine is given every 3-5 minutes. Amiodarone 300 mg IV is given after the third shock for refractory VF/VT.",
      "The compression fraction (percentage of time compressions are performed) should be greater than 80%."
    ],
    examLevel: "RN",
    timeLimit: "10 minutes",
    candidateInstructions:
      "You discover an unresponsive patient in ventricular fibrillation. Initiate the code blue response, perform high-quality CPR, use the defibrillator, delegate roles, and manage the initial resuscitation.",
    patientActorScript:
      "Manikin simulation. No response to stimulation. Monitor displays ventricular fibrillation. No pulse palpable. After appropriate interventions (defibrillation plus CPR), rhythm may convert to normal sinus with ROSC.",
    examinerChecklist: [
      { action: "Confirms unresponsiveness within 10 seconds", marks: 2 },
      { action: "Activates code blue immediately", marks: 2 },
      { action: "Checks pulse (no longer than 10 seconds)", marks: 1 },
      { action: "Begins compressions within 10 seconds", marks: 3 },
      { action: "Compression rate 100-120/min, depth 5-6 cm, full recoil", marks: 3 },
      { action: "Delegates roles clearly", marks: 2 },
      { action: "Applies defibrillator and identifies shockable rhythm", marks: 3 },
      { action: "Delivers shock and resumes CPR immediately", marks: 3 },
      { action: "Ensures vascular access", marks: 1 },
      { action: "Rotates compressors every 2 minutes", marks: 2 },
      { action: "Documents resuscitation timeline", marks: 2 }
    ],
    criticalFailCriteria: [
      "Delaying CPR more than 10 seconds after recognizing arrest",
      "Not activating the code team",
      "Performing compressions at incorrect rate or depth",
      "Not defibrillating a shockable rhythm",
      "Prolonged interruptions in compressions (>10 seconds)"
    ],
    examinerQuestions: [
      { question: "What are the four shockable and non-shockable rhythms?", answer: "Shockable: ventricular fibrillation (VF) and pulseless ventricular tachycardia (VT). Non-shockable: pulseless electrical activity (PEA) and asystole." },
      { question: "What is the recommended compression rate and depth?", answer: "Rate: 100-120 compressions per minute. Depth: 5-6 cm (2-2.4 inches) with full chest recoil." },
      { question: "How often should epinephrine be administered during cardiac arrest?", answer: "Every 3-5 minutes regardless of rhythm." }
    ],
    teachingPoints: [
      "In-hospital cardiac arrest survival rates are approximately 25% and are highly dependent on CPR quality and time to defibrillation.",
      "Hypothermia after cardiac arrest (targeted temperature management at 32-36°C) improves neurological outcomes.",
      "The H's and T's mnemonic helps identify reversible causes: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, Thrombosis (pulmonary/coronary).",
      "Post-event debriefing improves team performance in future resuscitations."
    ]
  },
  {
    id: "massive-transfusion",
    title: "Massive Transfusion Protocol",
    category: "Critical Care",
    difficulty: "Advanced",
    icon: "Droplets",
    description:
      "Initiate and manage a massive transfusion protocol (MTP) for a patient with life-threatening hemorrhage, including blood product administration, monitoring for transfusion reactions, and correction of coagulopathy.",
    scenarioIntro:
      "You are caring for a 38-year-old trauma patient in the emergency department who was involved in a motor vehicle collision. The patient has a large-bore IV in each antecubital fossa and is hemodynamically unstable: BP 72/40, HR 138, RR 30, and the patient is pale, diaphoretic, and confused. Estimated blood loss is greater than 2 liters. The trauma surgeon has activated the massive transfusion protocol.",
    equipment: [
      "Blood warmer/rapid infuser",
      "Packed red blood cells (PRBCs)",
      "Fresh frozen plasma (FFP)",
      "Platelets",
      "Cryoprecipitate",
      "Large-bore IV access (14-16 gauge)",
      "Blood administration tubing with filter",
      "Normal saline (0.9%)",
      "Calcium gluconate or calcium chloride",
      "Arterial blood gas supplies",
      "Continuous monitoring equipment",
      "Documentation tools"
    ],
    steps: [
      { id: "mtp-1", instruction: "Confirm activation of the massive transfusion protocol with the trauma team leader.", rationale: "MTP activation ensures the blood bank prepares and delivers blood products in a standardized, efficient manner.", criticalStep: true },
      { id: "mtp-2", instruction: "Verify two large-bore IV access sites (14-16 gauge). Establish additional access if needed.", rationale: "Large-bore access is essential for rapid blood product infusion. Flow rate is directly proportional to catheter diameter.", criticalStep: true },
      { id: "mtp-3", instruction: "Obtain a baseline type and screen, CBC, coagulation studies (PT/INR, PTT, fibrinogen), and arterial blood gas.", rationale: "Baseline labs guide transfusion decisions and identify pre-existing coagulopathy.", criticalStep: true },
      { id: "mtp-4", instruction: "Administer uncrossmatched O-negative blood (or type-specific blood when available) using proper blood administration tubing with a filter.", rationale: "In hemorrhagic shock, O-negative blood is given until type-specific blood is available. The filter removes clots and debris.", criticalStep: true },
      { id: "mtp-5", instruction: "Use a blood warmer or rapid infuser for all blood products.", rationale: "Cold blood products cause hypothermia, which worsens coagulopathy and creates a lethal triad (hypothermia, acidosis, coagulopathy).", criticalStep: true },
      { id: "mtp-6", instruction: "Administer blood products in the facility-approved MTP ratio (typically 1:1:1 PRBC:FFP:Platelets).", rationale: "Balanced resuscitation with a 1:1:1 ratio prevents dilutional coagulopathy and improves survival.", criticalStep: true },
      { id: "mtp-7", instruction: "Monitor for signs of transfusion reactions: fever, chills, urticaria, dyspnea, hemoglobinuria, and hypotension.", rationale: "Transfusion reactions can be life-threatening. Early recognition and intervention prevent fatal outcomes.", criticalStep: true },
      { id: "mtp-8", instruction: "Monitor for signs of the lethal triad: hypothermia (below 36°C), acidosis (pH below 7.2), and coagulopathy (INR above 1.5).", rationale: "The lethal triad in trauma is self-perpetuating; each component worsens the others. Prevention and correction are essential.", criticalStep: true },
      { id: "mtp-9", instruction: "Monitor and replace calcium: administer calcium gluconate for every 4 units of blood products given.", rationale: "Citrate in stored blood chelates calcium, causing hypocalcemia, which impairs cardiac function and clotting.", criticalStep: true },
      { id: "mtp-10", instruction: "Repeat labs every 30-60 minutes: CBC, coagulation studies, ABG, calcium, and potassium.", rationale: "Serial monitoring guides ongoing transfusion decisions and detects complications such as hyperkalemia from stored blood.", criticalStep: true },
      { id: "mtp-11", instruction: "Monitor urine output via indwelling catheter: target 0.5 mL/kg/hr.", rationale: "Urine output reflects renal perfusion and overall hemodynamic status.", criticalStep: false },
      { id: "mtp-12", instruction: "Communicate regularly with the blood bank about ongoing product needs and lab results.", rationale: "Coordinated communication ensures timely availability of blood products and prevents waste.", criticalStep: false },
      { id: "mtp-13", instruction: "Reassess hemodynamic status continuously: vital signs, level of consciousness, and bleeding control.", rationale: "Ongoing assessment determines the effectiveness of the MTP and guides decisions about surgical intervention.", criticalStep: true },
      { id: "mtp-14", instruction: "Document all blood products administered with times, volumes, vital signs, lab results, and any reactions.", rationale: "Accurate documentation is legally required for all blood product administration and enables quality review.", criticalStep: true }
    ],
    commonErrors: [
      "Not warming blood products, contributing to hypothermia",
      "Using an incorrect ratio of blood products (over-transfusing PRBCs without FFP and platelets)",
      "Not monitoring for transfusion reactions during rapid infusion",
      "Forgetting to supplement calcium",
      "Not monitoring for the lethal triad",
      "Inadequate documentation of blood products and timing",
      "Not repeating labs frequently enough to guide management"
    ],
    passingCriteria:
      "All critical steps must be performed. Candidate must confirm MTP activation, ensure large-bore access, use blood warmer, administer products in correct ratio, monitor for reactions and lethal triad, supplement calcium, repeat labs, and document.",
    clinicalPearls: [
      "The lethal triad of trauma: hypothermia, acidosis, and coagulopathy. Preventing and correcting these is as important as replacing blood volume.",
      "The 1:1:1 ratio (PRBC:FFP:Platelets) is based on the PROPPR trial and is the current standard for massive transfusion.",
      "Tranexamic acid (TXA) should be given within 3 hours of hemorrhage onset to reduce mortality (CRASH-2 trial).",
      "Hypocalcemia from citrate toxicity manifests as perioral tingling, muscle cramps, and prolonged QT interval.",
      "O-negative is the universal donor for RBCs; AB-positive is the universal donor for plasma."
    ],
    examLevel: "RN/NP",
    timeLimit: "15 minutes",
    candidateInstructions:
      "Manage a massive transfusion protocol for a hemorrhaging trauma patient. Administer blood products safely, monitor for complications, and coordinate with the team.",
    patientActorScript:
      "Manikin simulation. Patient is pale, diaphoretic, and tachycardic with active hemorrhage. Vital signs remain unstable until appropriate blood products are administered. If the lethal triad develops uncorrected, the patient's condition worsens.",
    examinerChecklist: [
      { action: "Confirms MTP activation", marks: 1 },
      { action: "Verifies large-bore IV access", marks: 2 },
      { action: "Obtains baseline labs", marks: 2 },
      { action: "Administers blood products with proper tubing and filter", marks: 2 },
      { action: "Uses blood warmer", marks: 3 },
      { action: "Follows 1:1:1 product ratio", marks: 3 },
      { action: "Monitors for transfusion reactions", marks: 2 },
      { action: "Monitors for lethal triad", marks: 3 },
      { action: "Supplements calcium appropriately", marks: 2 },
      { action: "Repeats labs at appropriate intervals", marks: 2 },
      { action: "Documents all products and timing", marks: 2 }
    ],
    criticalFailCriteria: [
      "Not warming blood products",
      "Using incorrect blood product ratios",
      "Not monitoring for transfusion reactions",
      "Failing to supplement calcium",
      "Not recognizing or addressing the lethal triad"
    ],
    examinerQuestions: [
      { question: "What is the lethal triad in trauma?", answer: "Hypothermia, acidosis, and coagulopathy. These three conditions create a self-perpetuating cycle that dramatically increases mortality." },
      { question: "What is the current evidence-based ratio for massive transfusion?", answer: "1:1:1 ratio of packed red blood cells to fresh frozen plasma to platelets, based on the PROPPR trial." },
      { question: "Why is calcium supplementation important during massive transfusion?", answer: "Citrate in stored blood products chelates ionized calcium, causing hypocalcemia. Calcium is essential for cardiac contractility and the coagulation cascade." }
    ],
    teachingPoints: [
      "Massive transfusion is defined as replacement of one entire blood volume within 24 hours, or more than 10 units of PRBCs in 24 hours.",
      "Permissive hypotension (target SBP 80-90 mmHg) may be appropriate in uncontrolled hemorrhage to prevent clot disruption.",
      "Point-of-care testing (thromboelastography/TEG, ROTEM) can guide targeted blood product replacement.",
      "The blood bank plays a critical coordination role; early communication and MTP activation streamline product availability."
    ]
  }
];
