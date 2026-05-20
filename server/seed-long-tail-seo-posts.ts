import { pool } from "./storage";

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  content: any[];
  tags: string[];
  category: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  primaryKeyword: string;
  profession: string;
}

function createPost(
  profession: string,
  title: string,
  slug: string,
  summary: string,
  primaryKeyword: string,
  seoTitle: string,
  seoDescription: string,
  tags: string[],
  seoKeywords: string[],
  sections: Array<{ heading: string; paragraphs: string[]; list?: string[]; callout?: string }>
): BlogPost {
  const content: any[] = [];

  for (const section of sections) {
    content.push({ type: "heading", text: section.heading });
    for (const p of section.paragraphs) {
      content.push({ type: "paragraph", text: p });
    }
    if (section.list) {
      content.push({ type: "list", items: section.list });
    }
    if (section.callout) {
      content.push({ type: "callout", text: section.callout });
    }
  }

  const categoryMap: Record<string, string> = {
    "nursing-rpn": "nursing-education",
    "nursing-rn": "nursing-education",
    "nursing-np": "nursing-education",
    "pharmacy-tech": "allied-health",
    "respiratory-therapy": "allied-health",
    "paramedic-ems": "allied-health",
    "mlt": "allied-health",
    "radiology": "allied-health",
    "occupational-therapy": "allied-health",
    "social-work": "allied-health",
  };

  return {
    title, slug, summary, content, tags, primaryKeyword, seoTitle, seoDescription, seoKeywords,
    category: categoryMap[profession] || "nursing-education",
    profession,
  };
}

function generateAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  // ===== NURSING RPN/LVN (6 posts) =====
  posts.push(createPost("nursing-rpn",
    "How to Pass the REx-PN Exam on Your First Attempt",
    "how-to-pass-rex-pn-exam-first-attempt",
    "A comprehensive guide to passing the REx-PN exam, covering study strategies, content areas, question types, and time management techniques for practical nursing students in Canada.",
    "pass REx-PN exam",
    "How to Pass the REx-PN Exam | Study Guide for LPN Students",
    "Learn proven strategies to pass the REx-PN exam on your first attempt. Covers study plans, practice questions, and test-day tips for Canadian practical nursing students.",
    ["rex-pn", "rpn", "lpn", "exam-prep", "nursing"],
    ["rex-pn exam tips", "pass rpn exam", "practical nursing exam", "lpn licensing exam"],
    [
      { heading: "Understanding the REx-PN Exam Format",
        paragraphs: [
          "The Regulatory Exam for Practical Nurses (REx-PN) is the licensing exam required for practical nurses in Canada. Administered by the Canadian Council of Practical Nurse Regulators, this computer-adaptive test evaluates your readiness to practice safely as an entry-level practical nurse. Understanding the exam format is the first step toward successful preparation.",
          "The REx-PN uses a computer-adaptive testing (CAT) format, meaning the difficulty of questions adjusts based on your performance. You will receive between 85 and 150 questions, with a maximum testing time of 4 hours. The exam covers four major content areas: professional practice, health assessment, nursing interventions, and collaborative practice.",
          "Each question is designed to assess clinical judgment at the entry-to-practice level. You will encounter multiple-choice questions, select-all-that-apply questions, and ordering questions. The exam does not penalize you for wrong answers, so it is important to answer every question rather than leaving any blank.",
        ],
        callout: "The REx-PN is a pass/fail exam. Your score is based on your ability to consistently answer questions above the passing standard, not on the total number of correct answers."
      },
      { heading: "Creating an Effective Study Plan",
        paragraphs: [
          "An effective study plan for the REx-PN should begin at least 8 to 12 weeks before your exam date. Start by reviewing the REx-PN Competency Document published by your provincial regulatory body, which outlines every competency area tested on the exam. This document serves as your study roadmap.",
          "Divide your study time across the four major competency categories: professional practice and accountability, foundational knowledge, collaborative practice, and clinical practice. Allocate more time to areas where you feel less confident. Use a combination of textbook review, practice questions, and clinical scenario analysis to strengthen your understanding.",
          "Practice questions are essential for REx-PN preparation. Aim to complete at least 1,500 to 2,000 practice questions before your exam date. After answering each question, review the rationale carefully, even for questions you answered correctly. Understanding why an answer is correct, and why the other options are incorrect, deepens your clinical reasoning skills.",
        ],
        list: [
          "Weeks 1-3: Review foundational nursing concepts and pharmacology",
          "Weeks 4-6: Focus on clinical scenarios and nursing interventions",
          "Weeks 7-9: Complete timed practice exams under test conditions",
          "Weeks 10-12: Review weak areas and complete final practice sets",
        ],
      },
      { heading: "Key Content Areas to Master",
        paragraphs: [
          "Pharmacology is one of the most heavily tested areas on the REx-PN. Focus on understanding drug classifications, mechanisms of action, common side effects, and nursing considerations. Pay special attention to high-alert medications such as insulin, heparin, warfarin, and opioids. Know the normal lab values that must be checked before administering specific medications.",
          "Health assessment skills are fundamental to the REx-PN. You should be able to perform a systematic head-to-toe assessment, recognize abnormal findings, and determine appropriate nursing actions based on assessment data. Practice interpreting vital signs in clinical context, as many questions present scenarios where you must identify the priority concern.",
          "Infection control and safety remain core competencies tested on the exam. Understand the chain of infection, standard precautions, transmission-based precautions, and sterile technique. Know when to apply different levels of precautions and how to educate patients and families about infection prevention.",
        ],
        callout: "Focus your pharmacology study on drug classes rather than individual medications. Understanding how ACE inhibitors work as a class is more valuable than memorizing every brand name."
      },
      { heading: "Test Day Strategies and Time Management",
        paragraphs: [
          "On test day, arrive at the testing center at least 30 minutes early with your required identification. The testing environment is standardized, with individual computer stations, noise-canceling headphones, and strict security protocols. Familiarize yourself with the testing center procedures in advance to reduce anxiety.",
          "During the exam, read each question stem carefully before looking at the answer options. Identify what the question is really asking: is it asking for the priority action, the first action, the best response, or the assessment finding that requires immediate intervention. These distinctions are critical for selecting the correct answer.",
          "Time management is important but should not cause undue stress. With up to 4 hours for a maximum of 150 questions, you have approximately 1.5 minutes per question. If a question is taking too long, make your best selection and move on. You cannot go back to previous questions in a CAT format, so commit to each answer and focus on the next question.",
        ],
      },
      { heading: "Practice Questions and Study Resources",
        paragraphs: [
          "The best way to prepare for the REx-PN is through consistent practice with exam-style questions. NurseNest offers practice question banks specifically designed for REx-PN preparation, covering all competency areas with detailed rationales. Using flashcard decks alongside practice questions helps reinforce key concepts and improve recall under exam conditions.",
          "Consider joining a study group with fellow nursing graduates to discuss clinical scenarios and share study strategies. Peer discussion helps you see questions from different perspectives and strengthens your clinical reasoning. Review your nursing program notes and textbooks for reference, but prioritize active learning methods over passive reading.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-rpn",
    "RPN Scope of Practice: What You Can and Cannot Do",
    "rpn-scope-of-practice-guide",
    "A detailed guide to the Registered Practical Nurse scope of practice in Canada, covering authorized acts, controlled acts, delegation, and practice limitations across provinces.",
    "RPN scope of practice",
    "RPN Scope of Practice Guide | What RPNs Can Do in Canada",
    "Understand the RPN scope of practice in Canada. Learn about authorized acts, controlled acts, delegation rules, and provincial differences for practical nurses.",
    ["rpn", "scope-of-practice", "nursing", "canada", "lpn"],
    ["rpn scope of practice", "what can rpn do", "rpn vs rn scope", "practical nurse scope"],
    [
      { heading: "Understanding RPN Scope of Practice",
        paragraphs: [
          "The Registered Practical Nurse (RPN) scope of practice defines the range of activities, procedures, and responsibilities that an RPN is authorized to perform. In Canada, the scope of practice is established by provincial and territorial nursing regulatory bodies and is outlined in provincial legislation such as the Nursing Act and associated regulations.",
          "RPNs are autonomous health care professionals who provide nursing care to patients across the health continuum. The scope of practice is based on the entry-to-practice competencies established by the regulatory body and is influenced by the practice setting, patient population, and complexity of care required.",
          "Understanding your scope of practice is essential for safe, ethical, and legal nursing practice. Practicing outside your scope can result in disciplinary action, loss of registration, and legal liability. It is your professional responsibility to know the boundaries of your practice and to seek guidance when you encounter situations that may be outside your competence.",
        ],
      },
      { heading: "Authorized Acts and Controlled Acts",
        paragraphs: [
          "In Ontario, controlled acts are specific procedures that carry a significant risk of harm if performed by unqualified persons. RPNs are authorized to perform certain controlled acts, including administering substances by injection or inhalation, performing prescribed procedures below the dermis, and putting an instrument or hand beyond specific body openings for assessment purposes.",
          "RPNs may also perform wound care including debridement, insert nasogastric tubes, perform urinary catheterization, and administer medications through various routes as ordered by a physician or nurse practitioner. The key principle is that RPNs must have a valid order from an authorized prescriber before performing most controlled acts.",
          "It is important to distinguish between what you are authorized to do and what you are competent to do. Even if a procedure falls within the RPN scope of practice, you should only perform it if you have the education, knowledge, and skill to do so safely. If you lack competence in a particular procedure, you have a professional obligation to seek additional training or to refer the task to another provider.",
        ],
        list: [
          "Administering medications by injection, oral, topical, and inhalation routes",
          "Performing venipuncture for blood collection",
          "Inserting and managing peripheral IV lines (in some jurisdictions)",
          "Wound care and wound assessment",
          "Urinary catheterization",
          "Nasogastric tube insertion and management",
          "Suctioning airways",
          "Performing point-of-care testing such as blood glucose monitoring",
        ],
      },
      { heading: "Differences Between RPN and RN Scope",
        paragraphs: [
          "While RPNs and Registered Nurses (RNs) share many common competencies, there are important differences in scope of practice. RNs generally have a broader scope, particularly in areas involving complex and unpredictable patient situations, critical care, and independent clinical decision-making.",
          "RPNs typically work with patients whose conditions are stable and predictable, or who are in the process of stabilization. RNs are expected to manage patients with complex, unstable, or unpredictable conditions. However, this distinction is not absolute, and RPNs increasingly work in acute care settings with appropriate support and collaboration.",
          "The decision about which nursing role is most appropriate for a given patient assignment should be based on patient acuity, complexity of care, and the availability of resources. This is a shared responsibility between the nurse and the employer, guided by the three-factor framework: client, nurse, and environment.",
        ],
        callout: "The three-factor framework (client complexity, nurse competence, and environmental supports) guides assignment decisions. RPNs can care for increasingly complex patients when appropriate supports are in place."
      },
      { heading: "Delegation and Interprofessional Collaboration",
        paragraphs: [
          "RPNs may delegate certain tasks to unregulated care providers (UCPs) such as personal support workers when appropriate. Delegation requires careful assessment of the task, the patient situation, and the competence of the person receiving the delegation. The RPN retains accountability for the decision to delegate and must ensure appropriate follow-up.",
          "Interprofessional collaboration is a core competency for RPNs. Working effectively with physicians, RNs, NPs, physiotherapists, occupational therapists, and other health care professionals ensures comprehensive patient care. RPNs contribute their unique perspective on patient care and advocate for patient needs within the health care team.",
        ],
      },
      { heading: "Resources for Understanding Your Scope",
        paragraphs: [
          "Your provincial or territorial nursing regulatory body publishes practice standards, guidelines, and competency documents that define the RPN scope of practice in your jurisdiction. Review these documents regularly, as scope of practice can evolve with legislative changes and advances in nursing practice. NurseNest provides study materials on scope of practice topics, including practice questions that test your understanding of professional boundaries and ethical decision-making.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-rpn",
    "Medication Administration Safety for Practical Nurses",
    "medication-administration-safety-practical-nurses",
    "Essential medication safety principles for RPNs and LPNs, covering the rights of medication administration, high-alert medications, error prevention, and documentation best practices.",
    "medication administration safety",
    "Medication Safety for Practical Nurses | RPN Guide",
    "Master medication administration safety as a practical nurse. Learn the rights of medication administration, high-alert drug protocols, and error prevention strategies.",
    ["medication-safety", "rpn", "pharmacology", "patient-safety", "nursing"],
    ["medication safety rpn", "rights of medication administration", "medication errors prevention", "high alert medications nursing"],
    [
      { heading: "The Rights of Medication Administration",
        paragraphs: [
          "Safe medication administration is one of the most critical responsibilities of a Registered Practical Nurse. The traditional five rights, right patient, right medication, right dose, right route, and right time, remain the foundation of medication safety. Modern practice has expanded this framework to include additional rights: right documentation, right reason, right response, and the right to refuse.",
          "Each right represents a checkpoint in the medication administration process. Verifying the right patient requires checking at least two patient identifiers (such as name and date of birth) before every medication administration. The right medication verification involves comparing the medication label against the medication administration record (MAR) three times: when removing from storage, when preparing, and at the point of administration.",
          "The right dose verification includes checking the prescribed dose against the medication on hand and performing any necessary calculations. For medications requiring dose calculations, always have a second nurse verify your math. The right route ensures you are administering the medication via the prescribed route, which is particularly important for medications available in multiple formulations.",
        ],
        callout: "Never crush or split medications without verifying they are safe to alter. Extended-release, enteric-coated, and sublingual formulations must not be crushed as this can cause dangerous dose dumping or loss of therapeutic effect."
      },
      { heading: "High-Alert Medications and Safety Protocols",
        paragraphs: [
          "High-alert medications are drugs that carry a heightened risk of significant patient harm when used in error. The Institute for Safe Medication Practices (ISMP) maintains a list of high-alert medications that includes insulin, opioids, anticoagulants, concentrated electrolytes, and neuromuscular blocking agents.",
          "When administering high-alert medications, follow your facility's independent double-check protocol. This typically requires a second nurse to independently verify the medication, dose, route, and patient before administration. Document the double-check in the patient's record. For insulin specifically, always verify the type, dose, and patient's current blood glucose level before administration.",
          "Anticoagulant management requires particular vigilance. Before administering heparin, check the most recent activated partial thromboplastin time (aPTT). Before giving warfarin, review the current international normalized ratio (INR). Know the therapeutic ranges and hold parameters for each medication, and contact the prescriber if values are outside expected parameters.",
        ],
        list: [
          "Insulin: verify type, dose, blood glucose, and rotation of injection sites",
          "Heparin: check aPTT, assess for signs of bleeding before administration",
          "Warfarin: check INR, review dietary vitamin K interactions with patient",
          "Opioids: assess respiratory rate, sedation level, and pain score before and after",
          "Digoxin: check apical heart rate for 60 seconds, hold if below 60 bpm",
          "Potassium: never give IV push, verify infusion rate does not exceed 10 mEq/hour",
        ],
      },
      { heading: "Preventing Medication Errors",
        paragraphs: [
          "Medication errors can occur at any point in the medication use process, from prescribing through to administration and monitoring. As the last line of defense before a medication reaches the patient, nurses play a critical role in intercepting errors. Common causes of medication administration errors include distractions during preparation, look-alike and sound-alike medications, and failure to check allergies.",
          "Create a distraction-free zone during medication preparation and administration. Many facilities designate specific areas for medication preparation where nurses should not be interrupted. If you are interrupted during medication preparation, restart the verification process from the beginning. Never pre-pour medications or remove them from their packaging until you are at the patient's bedside.",
          "Always check the patient's allergy status before administering any medication. Cross-reactivity between medications within the same drug class is common, so understanding drug classifications is essential. Document and report all medication errors and near-misses through your facility's incident reporting system, as this information drives system improvements that protect future patients.",
        ],
      },
      { heading: "Documentation and Communication Best Practices",
        paragraphs: [
          "Accurate documentation of medication administration is both a legal requirement and a patient safety measure. Document medications immediately after administration, never before. Record the time, dose, route, and site of administration. For PRN medications, also document the indication, patient assessment before administration, and effectiveness after a reasonable time interval.",
          "Effective handoff communication regarding medications is essential during shift changes. Report any medications that were held or refused, any PRN medications given near the end of your shift, and any pending lab results that may affect medication administration on the next shift. Use a structured handoff format such as SBAR to ensure no critical information is missed.",
        ],
      },
      { heading: "Continuing Education and Practice Resources",
        paragraphs: [
          "Medication safety is an area where ongoing education is essential. Drug recalls, new black box warnings, and updated administration guidelines are issued regularly. Subscribe to safety alerts from ISMP and review your facility's medication policies annually. NurseNest offers pharmacology practice questions and flashcard decks designed to reinforce medication safety concepts for practical nursing students and new graduates.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-rpn",
    "Wound Care Assessment and Management for RPNs",
    "wound-care-assessment-management-rpn",
    "A practical guide to wound assessment, wound types, healing stages, and evidence-based wound management for Registered Practical Nurses in clinical practice.",
    "wound care nursing rpn",
    "Wound Care for RPNs | Assessment and Management Guide",
    "Learn wound care assessment and management for RPNs. Covers wound types, healing stages, dressing selection, and documentation for practical nurses.",
    ["wound-care", "rpn", "clinical-skills", "nursing", "assessment"],
    ["wound care rpn", "wound assessment nursing", "wound dressing selection", "wound healing stages"],
    [
      { heading: "Systematic Wound Assessment",
        paragraphs: [
          "Wound assessment is a core clinical competency for Registered Practical Nurses. A thorough wound assessment provides the baseline data needed for appropriate treatment planning and allows you to monitor healing progress over time. Every wound assessment should follow a systematic approach that captures location, size, depth, wound bed characteristics, exudate, periwound skin condition, and signs of infection.",
          "Wound measurement should be performed consistently using the clock method. With the patient in the same position each time, measure the length (head to toe direction), width (side to side), and depth using a sterile cotton-tipped applicator. Document any undermining or tunneling, noting the direction using clock positions where 12 o'clock is toward the patient's head.",
          "Assess the wound bed for the percentage of tissue types present: granulation tissue (red, moist, bumpy), epithelial tissue (pink, pearly), slough (yellow, tan, or gray), and eschar (black or brown). A healthy healing wound should show increasing granulation tissue over time. Document the color, amount, and consistency of exudate: serous (clear, thin), sanguineous (bloody), serosanguineous (pink), or purulent (thick, cloudy, odorous).",
        ],
        callout: "Always assess the periwound skin (the skin surrounding the wound) for maceration, erythema, induration, and temperature changes. Periwound skin damage can enlarge the wound and indicates that the current dressing or treatment plan may need adjustment."
      },
      { heading: "Types of Wounds and Healing Stages",
        paragraphs: [
          "Wounds can be classified by etiology: surgical incisions, traumatic wounds, pressure injuries, diabetic foot ulcers, venous stasis ulcers, and arterial insufficiency ulcers. Each wound type has specific assessment considerations and treatment approaches. Pressure injuries are staged using the National Pressure Injury Advisory Panel (NPIAP) staging system from Stage 1 through Stage 4, with additional categories for unstageable and deep tissue pressure injuries.",
          "Wound healing progresses through four overlapping phases: hemostasis, inflammation, proliferation, and remodeling. The inflammatory phase typically lasts 1 to 4 days and is characterized by redness, warmth, swelling, and pain. If inflammation persists beyond the expected timeframe, suspect infection or other complications that may be delaying healing.",
          "The proliferative phase involves formation of granulation tissue, wound contraction, and epithelialization. This phase typically begins around day 4 and continues for 2 to 4 weeks, depending on wound size and patient factors. Adequate nutrition, particularly protein, vitamin C, and zinc, is essential during this phase to support tissue repair.",
        ],
      },
      { heading: "Evidence-Based Dressing Selection",
        paragraphs: [
          "Selecting the appropriate wound dressing is a clinical decision based on wound characteristics, treatment goals, and patient factors. The principle of moist wound healing guides modern dressing selection: wounds heal more rapidly in a moist environment that prevents tissue desiccation while managing excess exudate.",
          "Hydrocolloid dressings are appropriate for partial-thickness wounds with minimal to moderate exudate. They maintain a moist environment, promote autolytic debridement, and can remain in place for several days. Foam dressings are highly absorbent and suitable for wounds with moderate to heavy exudate, including pressure injuries and surgical wounds. Alginate dressings, derived from seaweed, are designed for heavily exudating wounds and have hemostatic properties.",
          "Transparent film dressings are appropriate for superficial wounds, IV insertion sites, and as secondary dressings over other wound care products. Silver-containing dressings provide antimicrobial activity and are indicated for wounds at risk of infection or with signs of bioburden. Always follow your facility's wound care protocols and consult with wound care specialists for complex wounds.",
        ],
        list: [
          "Dry wound bed: hydrogel to add moisture",
          "Minimal exudate: hydrocolloid or transparent film",
          "Moderate exudate: foam dressing",
          "Heavy exudate: alginate or hydrofiber",
          "Infected or critically colonized: silver dressings",
          "Necrotic tissue: enzymatic debriding agents or hydrogel for autolysis",
        ],
      },
      { heading: "Documentation and Interprofessional Communication",
        paragraphs: [
          "Thorough wound documentation protects both the patient and the nurse. Use a standardized wound assessment tool such as the Bates-Jensen Wound Assessment Tool or your facility's approved form. Document the wound assessment at every dressing change and at a minimum weekly for chronic wounds. Include wound measurements, tissue types, exudate characteristics, periwound condition, treatment applied, and patient response.",
          "Communicate wound status changes promptly to the interprofessional team. If you observe signs of infection (increasing pain, erythema, warmth, purulent drainage, fever), report to the physician or nurse practitioner immediately. Wound photography, when permitted by facility policy, provides valuable visual documentation of wound progression. NurseNest provides wound care study materials, practice questions, and clinical scenario flashcards to help RPNs develop competence in wound assessment and management.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-rpn",
    "Time Management Tips for New Graduate Practical Nurses",
    "time-management-tips-new-grad-rpn",
    "Practical time management strategies for new RPN graduates, covering prioritization frameworks, shift organization, clinical documentation efficiency, and managing multiple patient assignments.",
    "time management new grad nurse",
    "Time Management for New Grad RPNs | Practical Tips",
    "Master time management as a new graduate practical nurse. Learn prioritization frameworks, shift organization strategies, and efficiency tips for RPNs.",
    ["time-management", "new-grad", "rpn", "nursing", "career"],
    ["time management new nurse", "new grad rpn tips", "nursing shift organization", "prioritization nursing"],
    [
      { heading: "Building Your Shift Routine",
        paragraphs: [
          "Effective time management as a new graduate RPN begins with establishing a consistent shift routine. Having a predictable workflow reduces cognitive load and helps you complete essential tasks without relying solely on memory. Start each shift with a structured handoff report and immediately organize your priorities for the shift.",
          "Create a personal brain sheet or worksheet that captures key information for each patient: medications due, assessments needed, procedures scheduled, and any specific concerns from the previous shift. Many experienced nurses use a customized template that they fill out during report and reference throughout the shift.",
          "After receiving report, perform a focused assessment on each patient as early as possible. This initial round allows you to verify patient status, identify any urgent concerns, and confirm that the information from handoff matches what you observe. Early assessment prevents unpleasant surprises later in the shift when you may be less available.",
        ],
      },
      { heading: "Prioritization Frameworks for Clinical Practice",
        paragraphs: [
          "Prioritization is the skill that most distinguishes experienced nurses from new graduates. Use established frameworks such as Maslow's Hierarchy of Needs or the ABCs (Airway, Breathing, Circulation) to determine which patients and tasks require immediate attention. Physiological needs and life-threatening conditions always take priority.",
          "Learn to distinguish between urgent, important, and routine tasks. Urgent tasks require immediate action and include changes in vital signs, acute pain, falls, and medication administration at specific times (such as insulin before meals). Important tasks are time-sensitive but allow some flexibility, such as scheduled assessments and wound care. Routine tasks can be adjusted within the shift as needed.",
          "When you feel overwhelmed, stop and reassess your priorities. Ask yourself: which patient is at the highest risk right now? What is the one thing that must happen in the next 30 minutes? This mental reset prevents you from spending time on low-priority tasks while more critical needs go unaddressed.",
        ],
        callout: "When in doubt about prioritization, ask yourself: 'What action, if delayed, could result in patient harm?' That task moves to the top of your list."
      },
      { heading: "Efficient Documentation Strategies",
        paragraphs: [
          "Documentation is essential but can consume a disproportionate amount of your shift if not managed efficiently. Document at the point of care whenever possible rather than leaving charting until the end of your shift. Charting in real-time reduces errors and ensures you capture accurate details while they are fresh in your mind.",
          "Use charting templates and standardized language to save time without sacrificing quality. Learn the documentation shortcuts available in your electronic health record system. Many EHR systems allow you to create custom phrases or templates for common assessments and interventions.",
          "For narrative documentation, follow a structured format such as DAR (Data, Action, Response) or SBAR. This approach organizes your documentation logically and ensures you capture the essential elements. Remember that documentation serves as the legal record of the care you provided, so it must be accurate, timely, and complete.",
        ],
      },
      { heading: "Clustering Care and Batching Tasks",
        paragraphs: [
          "Clustering care means performing multiple tasks during a single patient interaction rather than making separate trips for each task. When you enter a patient's room for medication administration, also check vital signs, perform your assessment, and address any patient concerns. This approach reduces the number of trips to each room and is more efficient for you and less disruptive for the patient.",
          "Batch similar tasks together when possible. For example, gather all supplies for wound care dressing changes before starting your first patient. Complete all medication passes for a time period in sequence rather than alternating between medication administration and other tasks. This reduces transition time and the cognitive switching that leads to errors.",
        ],
      },
      { heading: "Asking for Help and Delegation",
        paragraphs: [
          "Knowing when and how to ask for help is a professional strength, not a weakness. If you are behind on your tasks or a patient's condition changes, communicate early with your charge nurse and colleagues. Effective delegation to unregulated care providers for tasks within their scope, such as vital signs, hygiene, and ambulation, frees your time for nursing-specific tasks that only you can perform.",
          "As you gain experience, your efficiency will naturally improve. Give yourself grace during the first few months of practice. Track your progress, identify recurring challenges, and seek feedback from preceptors and experienced colleagues. NurseNest offers clinical practice resources and time management flashcard decks to help new graduates build confidence and efficiency in their first year of practice.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-rpn",
    "Understanding IV Therapy Basics for Practical Nurses",
    "iv-therapy-basics-practical-nurses",
    "A foundational guide to IV therapy for RPNs, covering peripheral IV insertion, IV fluid types, flow rate calculations, common complications, and documentation requirements.",
    "IV therapy practical nurses",
    "IV Therapy Basics for RPNs | Peripheral IV Guide",
    "Learn IV therapy fundamentals for practical nurses. Covers IV insertion, fluid types, flow rate calculations, and complication management for RPNs.",
    ["iv-therapy", "rpn", "clinical-skills", "pharmacology", "nursing"],
    ["iv therapy rpn", "peripheral iv insertion", "iv fluid types nursing", "iv flow rate calculation"],
    [
      { heading: "Peripheral IV Access Fundamentals",
        paragraphs: [
          "Peripheral intravenous (IV) access is a foundational clinical skill for many Registered Practical Nurses. While the scope of IV therapy varies by province and practice setting, RPNs in many Canadian jurisdictions are authorized to initiate and maintain peripheral IV lines. Before performing IV insertion, verify that your regulatory body and employer authorize this skill within your scope of practice.",
          "Site selection for peripheral IV access is based on several factors: the purpose of the infusion, the expected duration of therapy, the patient's vein condition, and patient preference. The preferred sites are the forearm veins (cephalic and basilic), followed by the hand veins (dorsal metacarpal). Avoid veins in the antecubital fossa for continuous infusions as arm flexion may impede flow.",
          "Use the smallest gauge catheter that will accommodate the prescribed therapy. For most IV fluids and medications, a 20- or 22-gauge catheter is appropriate. Blood transfusions typically require an 18-gauge catheter to prevent hemolysis of red blood cells. Pediatric patients and patients with fragile veins may require a 24-gauge catheter.",
        ],
      },
      { heading: "IV Fluid Types and Clinical Indications",
        paragraphs: [
          "IV fluids are classified as crystalloids or colloids, and further categorized by their tonicity relative to blood plasma. Isotonic solutions (0.9% Normal Saline, Lactated Ringer's) have the same osmolality as blood and are used for volume replacement without causing fluid shifts between compartments. Normal Saline is the most commonly used isotonic fluid and is compatible with most IV medications.",
          "Hypotonic solutions (0.45% Normal Saline, D5W after dextrose metabolism) have lower osmolality than blood plasma and cause fluid to shift from the intravascular space into the cells. These solutions are used to treat cellular dehydration but must be administered cautiously because excessive administration can cause cerebral edema and increased intracranial pressure.",
          "Hypertonic solutions (3% Saline, D10W, D50W) have higher osmolality than blood and draw fluid from cells into the intravascular space. These solutions are used in specific clinical situations such as symptomatic hyponatremia and are typically restricted to critical care settings with close monitoring. Never administer hypertonic saline peripherally unless specifically ordered and appropriate monitoring is in place.",
        ],
        callout: "D5W (5% Dextrose in Water) is isotonic in the bag but becomes hypotonic once infused because the body rapidly metabolizes the dextrose. This means D5W is NOT appropriate for volume replacement."
      },
      { heading: "Flow Rate Calculations",
        paragraphs: [
          "Calculating IV flow rates is an essential nursing math skill. For gravity infusions, use the formula: drops per minute = (volume in mL x drop factor) / time in minutes. The drop factor depends on the IV tubing: macrodrip tubing typically has a drop factor of 10, 15, or 20 drops/mL, while microdrip tubing has a drop factor of 60 drops/mL.",
          "For IV pump infusions, calculate the rate in mL/hour: mL/hour = total volume / total time in hours. For example, if 1000 mL of Normal Saline is ordered to infuse over 8 hours, the pump rate is 1000 / 8 = 125 mL/hour. Always verify your calculation before programming the pump and have a second nurse verify high-risk infusions.",
          "For medication infusions, you may need to calculate the dose per hour or per minute. For example, if a patient is receiving dopamine at 5 mcg/kg/min and the premixed solution concentration is 1600 mcg/mL, you need the patient's weight in kg to determine the correct infusion rate. Practice these calculations regularly to build speed and accuracy.",
        ],
      },
      { heading: "Complications and Troubleshooting",
        paragraphs: [
          "Infiltration occurs when IV fluid leaks into surrounding tissue, causing localized swelling, coolness, and pallor at the insertion site. Discontinue the IV immediately, elevate the affected extremity, and apply a warm compress for most solutions. For vesicant infiltration (extravasation), follow your facility's specific protocol, which may include antidote administration.",
          "Phlebitis (inflammation of the vein) presents as redness, warmth, tenderness, and a palpable cord along the vein path. Risk factors include large-gauge catheters, irritating medications, prolonged catheter dwell time, and poor insertion technique. Assess the IV site at least every shift using a standardized phlebitis scale. Discontinue the IV if phlebitis is present and restart in a different location.",
          "Air embolism, though rare, is a serious complication. Prevent it by removing all air from tubing before connecting to the patient, using Luer-lock connections, and clamping tubing when changing IV bags. If air embolism is suspected (sudden dyspnea, chest pain, altered consciousness), place the patient on their left side in Trendelenburg position and notify the physician immediately.",
        ],
      },
      { heading: "Documentation and Ongoing Assessment",
        paragraphs: [
          "Document IV insertion including the date, time, catheter gauge, insertion site, number of attempts, patient tolerance, and the nurse's name. Assess the IV site at the beginning of each shift, before each medication administration, and whenever the patient reports discomfort. Document ongoing assessments and any interventions performed. NurseNest offers IV therapy study resources, practice calculation questions, and clinical scenario flashcards to help RPNs develop and maintain IV therapy competence.",
        ],
      },
    ]
  ));

  // ===== NURSING RN (6 posts) =====
  posts.push(createPost("nursing-rn",
    "How to Pass the NCLEX-RN on Your First Attempt",
    "how-to-pass-nclex-rn-first-attempt",
    "Proven strategies for passing the NCLEX-RN exam, including study planning, question analysis techniques, content review priorities, and managing test-day anxiety.",
    "pass NCLEX-RN first attempt",
    "How to Pass the NCLEX-RN | First Attempt Success Guide",
    "Learn proven strategies to pass the NCLEX-RN on your first attempt. Study plans, question analysis techniques, and test-day tips for nursing graduates.",
    ["nclex-rn", "rn", "exam-prep", "nursing", "study-tips"],
    ["pass nclex-rn first attempt", "nclex study plan", "nclex-rn strategies", "nursing exam preparation"],
    [
      { heading: "Understanding the NCLEX-RN Exam Structure",
        paragraphs: [
          "The National Council Licensure Examination for Registered Nurses (NCLEX-RN) is the licensing exam required to practice as a Registered Nurse in the United States and Canada. The exam uses Computer Adaptive Testing (CAT) technology, which adjusts question difficulty based on your responses. The minimum number of questions is 75 and the maximum is 145, with a 5-hour time limit.",
          "The NCLEX-RN test plan is organized around client needs categories: Safe and Effective Care Environment (Management of Care, Safety and Infection Control), Health Promotion and Maintenance, Psychosocial Integrity, and Physiological Integrity (Basic Care and Comfort, Pharmacological and Parenteral Therapies, Reduction of Risk Potential, Physiological Adaptation). Management of Care and Pharmacological Therapies are the two largest content areas.",
          "The Next Generation NCLEX (NGN) introduced new item types including case studies, matrix/grid questions, extended drag-and-drop, and cloze (drop-down) questions. These items assess clinical judgment using the NCSBN Clinical Judgment Measurement Model, which evaluates your ability to recognize cues, analyze information, prioritize hypotheses, generate solutions, take action, and evaluate outcomes.",
        ],
      },
      { heading: "Building a Strategic Study Plan",
        paragraphs: [
          "Begin your NCLEX preparation 6 to 8 weeks before your scheduled exam date. Use a structured study plan that allocates time based on the test plan percentages. Since Management of Care represents 15-21% of the exam, dedicate proportional study time to delegation, prioritization, and advocacy content.",
          "Content review should focus on understanding concepts rather than memorizing isolated facts. For pharmacology, study drug classes and their mechanisms of action rather than individual drug names. Understand why a beta-blocker is contraindicated in asthma (because beta-2 receptor blockade causes bronchoconstriction) rather than just memorizing the contraindication.",
          "Complete at least 2,000 to 3,000 practice questions during your preparation period. Research consistently shows that students who complete more practice questions perform better on the NCLEX. After each question, review the complete rationale, including explanations for why incorrect options are wrong. This approach builds the clinical reasoning skills tested on the exam.",
        ],
        callout: "The NCLEX tests clinical judgment, not recall. For every fact you study, ask yourself: how would this knowledge change my nursing actions? If you cannot connect a fact to a nursing action, you may not be studying at the right depth."
      },
      { heading: "Mastering Clinical Judgment Questions",
        paragraphs: [
          "Clinical judgment questions present complex patient scenarios and ask you to demonstrate the cognitive processes nurses use in practice. These questions require you to recognize relevant cues in patient data, analyze their significance, prioritize among competing hypotheses, and select appropriate nursing actions.",
          "When approaching a clinical judgment question, start by identifying all relevant data in the scenario. Look for assessment findings that are abnormal or trending in a concerning direction. Consider what nursing condition or complication the data suggests. Then evaluate each answer option against the clinical evidence presented.",
          "Practice with unfolding case studies where a patient scenario evolves over time. These multi-part questions test your ability to reassess, reprioritize, and adjust your plan of care as new information becomes available. NurseNest offers NCLEX-style practice question banks and clinical judgment scenarios with detailed rationales.",
        ],
      },
      { heading: "High-Yield Content Areas",
        paragraphs: [
          "Prioritization and delegation questions appear frequently on the NCLEX-RN. Know the RN scope of practice compared to LPN/LVN and UAP scopes. Understand which tasks can be delegated and which require RN-level assessment and judgment. The Airway-Breathing-Circulation framework and Maslow's Hierarchy guide prioritization decisions.",
          "Pharmacology is the single largest content area. Focus on drug interactions, adverse effects, patient education, and nursing considerations for major drug classes: cardiac glycosides, antihypertensives, antibiotics, anticoagulants, insulin, and psychotropic medications. Know the critical lab values that must be checked before administering specific medications.",
          "Safety and infection control content includes surgical asepsis, standard and transmission-based precautions, fall prevention, restraint use, and error prevention. These questions test your knowledge of evidence-based safety protocols and your ability to apply them in clinical scenarios.",
        ],
      },
      { heading: "Test Day Preparation and Anxiety Management",
        paragraphs: [
          "On test day, arrive early, bring required identification, and follow the testing center procedures. During the exam, read each question carefully and identify the key words that determine what is being asked. Words like 'first,' 'priority,' 'best,' and 'most appropriate' significantly change the correct answer.",
          "If you experience test anxiety, use brief relaxation techniques such as deep breathing or progressive muscle relaxation. Remember that the CAT format is designed to find your ability level, so receiving difficult questions is a positive sign. Trust your preparation and commit to each answer without second-guessing. NurseNest offers comprehensive NCLEX-RN preparation resources, including practice exams, flashcard decks, and clinical judgment exercises.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-rn",
    "Critical Care Nursing Skills Every New RN Should Know",
    "critical-care-nursing-skills-new-rn",
    "Essential critical care nursing skills for new RN graduates, covering hemodynamic monitoring, ventilator management, vasopressor administration, and rapid assessment techniques.",
    "critical care nursing skills",
    "Critical Care Skills for New RNs | ICU Nursing Guide",
    "Master essential critical care nursing skills as a new RN. Learn hemodynamic monitoring, ventilator basics, vasopressor management, and ICU assessment techniques.",
    ["critical-care", "icu", "rn", "clinical-skills", "nursing"],
    ["critical care nursing skills", "icu nursing new grad", "hemodynamic monitoring nursing", "ventilator management rn"],
    [
      { heading: "Hemodynamic Monitoring Fundamentals",
        paragraphs: [
          "Hemodynamic monitoring is central to critical care nursing practice. Understanding how to interpret arterial blood pressure waveforms, central venous pressure (CVP), and other hemodynamic parameters is essential for guiding fluid management and vasoactive medication titration. The arterial line provides continuous blood pressure monitoring and easy access for arterial blood gas sampling.",
          "Central venous pressure reflects the pressure in the superior vena cava or right atrium and provides information about right heart preload and fluid volume status. Normal CVP ranges from 2 to 8 mmHg. Low CVP may indicate hypovolemia, while elevated CVP may suggest fluid overload, right heart failure, or increased intrathoracic pressure from mechanical ventilation.",
          "When interpreting hemodynamic data, always correlate numbers with the clinical picture. A CVP of 12 mmHg in a patient who is hemodynamically stable has different implications than the same value in a patient with hypotension and poor urine output. Trending values over time provides more useful information than single measurements.",
        ],
        callout: "Always level and zero the transducer at the phlebostatic axis (fourth intercostal space, midaxillary line) before taking hemodynamic measurements. Inaccurate leveling can produce falsely high or low readings."
      },
      { heading: "Mechanical Ventilation Basics for Nurses",
        paragraphs: [
          "While respiratory therapists manage ventilator settings, nurses are responsible for ongoing assessment of the ventilated patient, airway management, and recognizing complications. Understanding basic ventilator modes (Assist-Control, SIMV, Pressure Support) and key parameters (tidal volume, PEEP, FiO2, respiratory rate) enables you to interpret ventilator data and communicate effectively with the interprofessional team.",
          "Endotracheal tube care includes securing the tube at the correct depth (typically 20 to 22 cm at the teeth for adults), maintaining cuff pressure between 20 and 30 cmH2O, providing oral care every 2 to 4 hours, and repositioning the tube holder to prevent skin breakdown. Document the tube position, cuff pressure, and oral care at regular intervals.",
          "Monitor for ventilator-associated complications including ventilator-associated pneumonia (VAP), barotrauma, and ventilator-patient dyssynchrony. The VAP prevention bundle includes head-of-bed elevation to 30 to 45 degrees, daily sedation vacations, daily assessment of readiness to extubate, DVT prophylaxis, and stress ulcer prophylaxis.",
        ],
      },
      { heading: "Vasoactive Medication Management",
        paragraphs: [
          "Vasoactive medications are titrated based on hemodynamic parameters and clinical response. Common vasoactive medications include norepinephrine (first-line vasopressor for septic shock), vasopressin (second-line adjunct), dopamine, dobutamine (inotrope for heart failure), and epinephrine. Each medication has specific hemodynamic effects, dose ranges, and potential adverse effects.",
          "Vasoactive medications should be administered through a central venous catheter whenever possible to reduce the risk of extravasation injury. If peripheral administration is necessary, use a large-bore IV in a proximal vein and monitor the site frequently. When titrating vasopressors, make gradual adjustments and reassess hemodynamic parameters within 5 to 10 minutes of each change.",
          "Documentation for vasoactive medication management should include the current dose, titration changes with the time and indication, hemodynamic parameters before and after titration, and any adverse effects observed. Clear documentation supports continuity of care during handoffs and provides a record of the patient's hemodynamic trajectory.",
        ],
      },
      { heading: "Rapid Patient Assessment in the ICU",
        paragraphs: [
          "ICU patients require systematic, frequent assessments that capture changes in condition early. Develop a consistent assessment pattern that you perform at the beginning of each shift and repeat at regular intervals. Start with airway and breathing (ventilator settings, breath sounds, oxygen saturation), progress to circulation (heart rate, blood pressure, skin color, peripheral pulses), and then assess neurological status, renal function, and gastrointestinal status.",
          "Recognize and respond to early warning signs of deterioration: increasing vasopressor requirements, declining urine output, rising lactate levels, worsening oxygenation despite escalating ventilator support, and new-onset confusion or agitation. Early recognition of these trends allows timely intervention before the patient progresses to a critical state.",
        ],
      },
      { heading: "Building ICU Competence as a New Graduate",
        paragraphs: [
          "Transitioning to the ICU as a new graduate is challenging but achievable with appropriate orientation, mentorship, and ongoing learning. Most ICU orientations last 12 to 16 weeks and include didactic education, simulation, and precepted clinical practice. Take advantage of every learning opportunity during orientation, ask questions freely, and keep a clinical journal to track your progress.",
          "Continuing education in critical care includes certification programs such as the CCRN (Critical Care Registered Nurse) certification. While this is typically pursued after gaining experience, studying the CCRN content early in your career accelerates your knowledge development. NurseNest offers critical care practice questions, pharmacology flashcards, and hemodynamic monitoring study resources for new ICU nurses.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-rn",
    "SBAR Communication Guide with Examples for Nurses",
    "sbar-communication-guide-nurses",
    "A comprehensive SBAR communication guide for nurses with clinical examples, templates, and strategies for effective handoff communication in hospital settings.",
    "SBAR communication nursing",
    "SBAR Communication Guide for Nurses | With Examples",
    "Master SBAR communication with this guide for nurses. Includes clinical examples, templates, and tips for effective handoff and physician notification.",
    ["communication", "sbar", "rn", "patient-safety", "nursing"],
    ["sbar communication nursing", "sbar examples nurses", "nurse physician communication", "nursing handoff communication"],
    [
      { heading: "What Is SBAR and Why It Matters",
        paragraphs: [
          "SBAR (Situation, Background, Assessment, Recommendation) is a structured communication framework used by nurses and other health care professionals to convey critical patient information in a clear, concise, and predictable format. Originally developed by the U.S. Navy for nuclear submarine operations, SBAR was adopted by health care to reduce communication errors that contribute to adverse patient events.",
          "Communication failures are a leading cause of sentinel events in hospitals. The Joint Commission has identified handoff communication as a patient safety priority, and SBAR provides a standardized approach that reduces ambiguity and ensures critical information is transmitted during handoffs, physician notifications, and interprofessional consultations.",
          "Using SBAR promotes a shared mental model between the sender and receiver of information. When both parties understand the communication structure, the conversation is more efficient and focused. SBAR also empowers nurses to present their clinical assessment and recommendation, fostering a culture of collaboration and shared decision-making.",
        ],
      },
      { heading: "Breaking Down the SBAR Components",
        paragraphs: [
          "Situation: State the patient's name, room number, and the reason for the communication. Be specific and concise. For example: 'I am calling about Mr. Johnson in room 412. His blood pressure has dropped to 82/50 and he is not responding to IV fluid bolus.' This immediately orients the receiver to the urgency and context of the communication.",
          "Background: Provide the relevant clinical history that gives context to the current situation. Include the admitting diagnosis, pertinent medical history, current medications, allergies, and any recent changes in condition or treatment. For example: 'He was admitted yesterday for community-acquired pneumonia. He has a history of COPD and heart failure. His baseline blood pressure has been 120/70.'",
          "Assessment: Share your clinical assessment of the patient's current condition and what you believe is happening. This is where your nursing judgment is most valuable. For example: 'I am concerned he may be developing sepsis. His temperature is 38.9, heart rate is 112, and his lactate is 3.2. He appears diaphoretic and is more confused than earlier today.'",
          "Recommendation: State what you think should be done or what you need from the receiver. For example: 'I would like to request an order for blood cultures, a serum lactate recheck, and initiation of the sepsis protocol. Would you like to come and assess the patient?' This component ensures the communication leads to action.",
        ],
        callout: "Before making an SBAR call, have the patient's chart open and vital signs documented. Anticipate what the physician may ask and have relevant lab values, current medications, and recent assessment findings ready."
      },
      { heading: "SBAR Clinical Examples",
        paragraphs: [
          "Example 1 (Post-surgical patient): Situation: 'I am calling about Mrs. Chen in room 318, post-op day 1 from a hip replacement. She is reporting new onset chest pain and shortness of breath.' Background: 'She had an uneventful surgery yesterday. She has been receiving enoxaparin for DVT prophylaxis. Her last set of vitals showed heart rate 110, respiratory rate 26, SpO2 91% on room air.' Assessment: 'I am concerned she may have a pulmonary embolism given her post-surgical status and sudden onset of symptoms.' Recommendation: 'I have started her on oxygen at 4L via nasal cannula. I am requesting a STAT CT pulmonary angiography and would like you to come assess her.'",
          "Example 2 (Mental health patient): Situation: 'I am calling about Mr. Davis in the psychiatric unit. He is expressing suicidal ideation and has made a specific plan.' Background: 'He was admitted 3 days ago for major depressive disorder. He has a history of a previous suicide attempt 2 years ago. His medications were adjusted yesterday.' Assessment: 'He is at high risk for self-harm based on his specific plan, access to means, and history of attempts.' Recommendation: 'I have placed him on 1:1 observation. I am requesting a psychiatric consultation for reassessment and consideration of safety planning.'",
        ],
      },
      { heading: "Common SBAR Mistakes and How to Avoid Them",
        paragraphs: [
          "The most common mistake is providing too much background information before stating the situation. The physician needs to know why you are calling before they can process the context. Lead with the situation to immediately establish the urgency and purpose of the communication.",
          "Another common error is omitting the assessment component. Many nurses feel uncomfortable stating their clinical judgment, but this is the most valuable part of the communication. Physicians rely on nurses' bedside assessments to guide their clinical decisions. Practice stating your assessment clearly and confidently.",
          "Failing to make a specific recommendation leaves the conversation incomplete. Instead of asking 'What would you like me to do?' offer a specific suggestion based on your assessment. This demonstrates clinical competence and accelerates the decision-making process. NurseNest offers SBAR practice scenarios and communication flashcards for nursing students and new graduates.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-rn",
    "Nursing Care Plan Development: A Step-by-Step Guide",
    "nursing-care-plan-development-guide",
    "Learn how to develop comprehensive nursing care plans using the nursing process framework, including assessment, diagnosis, planning, implementation, and evaluation with clinical examples.",
    "nursing care plan development",
    "Nursing Care Plan Guide | Step-by-Step for RN Students",
    "Master nursing care plan development with this step-by-step guide. Covers the nursing process, NANDA diagnoses, outcome identification, and evaluation for RN students.",
    ["care-plan", "nursing-process", "rn", "clinical-skills", "nursing"],
    ["nursing care plan", "nanda nursing diagnosis", "nursing process steps", "care plan examples"],
    [
      { heading: "The Nursing Process Framework",
        paragraphs: [
          "The nursing process is a systematic, patient-centered approach to care that guides all nursing practice. This cyclical framework consists of five interrelated steps: assessment, diagnosis, planning, implementation, and evaluation (ADPIE). Each step builds upon the previous one, creating a logical, evidence-based approach to patient care.",
          "Understanding and applying the nursing process is a fundamental competency for Registered Nurses. The nursing process distinguishes professional nursing practice from task-oriented care by emphasizing critical thinking, clinical judgment, and individualized patient care. Nursing care plans document the application of the nursing process and serve as communication tools for the health care team.",
          "The nursing process is iterative, meaning you continuously cycle through the steps as you gather new data and reassess patient outcomes. A care plan is not a static document; it must be updated as the patient's condition changes, new assessment data emerges, and goals are met or require modification.",
        ],
      },
      { heading: "Assessment: Gathering Patient Data",
        paragraphs: [
          "Assessment is the first and most critical step of the nursing process. Comprehensive assessment involves collecting subjective data (what the patient reports) and objective data (what you observe, measure, and document). Use a systematic approach such as a head-to-toe assessment or a body systems review to ensure no relevant data is missed.",
          "Subjective data includes the patient's chief complaint, health history, symptom description, pain assessment, psychosocial concerns, and cultural preferences. Objective data includes vital signs, physical examination findings, laboratory values, diagnostic test results, and functional status assessments.",
          "Organize your assessment data to identify patterns and clusters of related findings. For example, a patient reporting shortness of breath (subjective) who also has crackles on auscultation, elevated respiratory rate, and decreased oxygen saturation (objective) presents a cluster of data suggesting a respiratory problem that needs to be addressed in the care plan.",
        ],
      },
      { heading: "Nursing Diagnosis: Identifying Patient Problems",
        paragraphs: [
          "Nursing diagnoses are clinical judgments about the patient's response to actual or potential health problems. NANDA International (NANDA-I) provides a standardized taxonomy of nursing diagnoses that guides clinical decision-making. A complete nursing diagnosis includes the problem statement, related factors (etiology), and defining characteristics (signs and symptoms).",
          "The PES format (Problem, Etiology, Signs/Symptoms) structures the nursing diagnosis statement. For example: 'Ineffective airway clearance related to excessive secretions and weak cough reflex as evidenced by adventitious breath sounds, productive cough, and SpO2 of 89%.' This format clearly communicates the problem, its cause, and the supporting evidence.",
          "Prioritize nursing diagnoses using a framework such as Maslow's Hierarchy of Needs. Life-threatening problems (ineffective airway clearance, decreased cardiac output) take priority over safety concerns, which take priority over psychosocial needs. However, individual patient situations may require adjusting priorities based on clinical judgment.",
        ],
      },
      { heading: "Planning: Setting Goals and Selecting Interventions",
        paragraphs: [
          "During the planning phase, establish measurable, patient-centered goals and select evidence-based nursing interventions to achieve those goals. Goals should be SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. For example: 'Patient will maintain SpO2 above 94% on room air within 24 hours' is a measurable, time-bound goal.",
          "Nursing interventions should be based on best available evidence and tailored to the individual patient. The Nursing Interventions Classification (NIC) provides a standardized language for nursing interventions. For each intervention, document the frequency, the expected outcome, and any special considerations for this patient.",
          "Include patient education in your care plan whenever appropriate. Teaching plans should address the patient's learning needs, preferred learning style, and readiness to learn. Document what was taught, the patient's response, and any need for follow-up education.",
        ],
      },
      { heading: "Implementation and Evaluation",
        paragraphs: [
          "Implementation involves carrying out the planned interventions while continuously monitoring the patient's response. Document all interventions performed, the patient's tolerance, and any modifications needed. Coordinate care with other members of the health care team to ensure consistent, comprehensive care delivery.",
          "Evaluation determines whether the patient goals have been met, partially met, or not met. Reassess the patient using the same criteria established in the planning phase. If goals are met, the nursing diagnosis may be resolved. If goals are not met, analyze why and modify the care plan accordingly: adjust the interventions, revise the goals, or reassess the diagnosis. NurseNest offers nursing care plan templates, NANDA diagnosis flashcards, and clinical scenario practice questions to help RN students master care plan development.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-rn",
    "Understanding Sepsis: Early Recognition and Nursing Management",
    "sepsis-early-recognition-nursing-management",
    "A clinical guide to sepsis for registered nurses covering pathophysiology, early warning signs, SOFA and qSOFA screening tools, Surviving Sepsis guidelines, and priority nursing interventions.",
    "sepsis nursing management",
    "Sepsis Recognition and Nursing Management | RN Guide",
    "Learn early sepsis recognition and nursing management. Covers SOFA screening, Surviving Sepsis guidelines, and priority interventions for registered nurses.",
    ["sepsis", "critical-care", "rn", "clinical-skills", "nursing"],
    ["sepsis nursing", "early sepsis recognition", "sofa score nursing", "surviving sepsis guidelines"],
    [
      { heading: "Pathophysiology of Sepsis",
        paragraphs: [
          "Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. The current definition (Sepsis-3) emphasizes organ dysfunction rather than the older concept of systemic inflammatory response syndrome (SIRS). When the body's immune response to infection becomes dysregulated, the resulting widespread inflammation leads to tissue damage, organ dysfunction, and potentially death.",
          "The pathophysiology involves a cascade of inflammatory mediators that cause vasodilation, increased capillary permeability, microvascular thrombosis, and mitochondrial dysfunction. Vasodilation leads to distributive shock with decreased systemic vascular resistance. Increased capillary permeability causes fluid to shift from the intravascular space to the interstitial space, contributing to tissue edema and further reducing effective circulating volume.",
          "Septic shock is defined as sepsis with persistent hypotension requiring vasopressors to maintain a mean arterial pressure of 65 mmHg or greater, and a serum lactate level greater than 2 mmol/L despite adequate volume resuscitation. Septic shock carries a mortality rate exceeding 40%, making early recognition and aggressive treatment essential.",
        ],
      },
      { heading: "Screening Tools and Early Warning Signs",
        paragraphs: [
          "The quick SOFA (qSOFA) score is a bedside screening tool that identifies patients who may have sepsis using three clinical criteria: altered mental status (Glasgow Coma Scale less than 15), systolic blood pressure of 100 mmHg or less, and respiratory rate of 22 breaths per minute or greater. A qSOFA score of 2 or more should prompt further assessment for organ dysfunction.",
          "The full Sequential Organ Failure Assessment (SOFA) score evaluates six organ systems: respiratory (PaO2/FiO2 ratio), coagulation (platelet count), liver (bilirubin), cardiovascular (mean arterial pressure and vasopressor requirements), central nervous system (Glasgow Coma Scale), and renal (creatinine and urine output). An increase of 2 or more points from baseline indicates sepsis.",
          "Early warning signs that should trigger sepsis screening include fever or hypothermia, tachycardia, tachypnea, altered mental status, unexplained hypotension, decreased urine output, elevated or depressed white blood cell count, and elevated serum lactate. Nurses are often the first to identify these changes during routine assessment, making vigilant monitoring critical for early sepsis detection.",
        ],
        callout: "Not all septic patients present with fever. Elderly, immunocompromised, and very young patients may present with hypothermia (temperature below 36 degrees Celsius) as a sign of sepsis. A normal temperature does not rule out sepsis."
      },
      { heading: "The Surviving Sepsis Hour-1 Bundle",
        paragraphs: [
          "The Surviving Sepsis Campaign recommends initiating the hour-1 bundle as soon as sepsis is suspected. The bundle includes: measure serum lactate and remeasure if initial lactate is greater than 2 mmol/L, obtain blood cultures before administering antibiotics, administer broad-spectrum antibiotics, begin rapid administration of 30 mL/kg crystalloid fluid for hypotension or lactate greater than or equal to 4 mmol/L, and apply vasopressors if the patient is hypotensive during or after fluid resuscitation to maintain MAP greater than or equal to 65 mmHg.",
          "Time is critical in sepsis management. Research shows that for every hour antibiotics are delayed after the onset of septic shock, mortality increases by approximately 7.6%. The nursing role in implementing the sepsis bundle is pivotal: nurses identify the deteriorating patient, initiate the sepsis protocol, ensure timely blood culture collection, start IV fluid resuscitation, and administer antibiotics as soon as they are available.",
          "Reassessment after the initial resuscitation is equally important. Monitor the patient's response to fluids by assessing blood pressure, heart rate, urine output, lactate clearance, and clinical appearance. If the patient does not respond to the initial fluid bolus, escalation to vasopressor therapy should not be delayed. Document the time of each intervention and the patient's response to demonstrate bundle compliance.",
        ],
      },
      { heading: "Priority Nursing Interventions",
        paragraphs: [
          "Continuous hemodynamic monitoring is essential for the septic patient. Monitor vital signs every 15 to 30 minutes during the acute phase, with particular attention to trends in blood pressure, heart rate, and urine output. Insert a urinary catheter to accurately measure hourly urine output, with a goal of 0.5 mL/kg/hour or greater.",
          "Maintain strict intake and output documentation, including all IV fluids, medications, blood products, and enteral nutrition. Fluid balance is critical in sepsis management: adequate resuscitation is essential early, but excessive fluid administration can worsen pulmonary edema and organ dysfunction. Serial lactate measurements guide ongoing resuscitation.",
          "Implement the sepsis prevention bundle for all patients: hand hygiene, appropriate use of central venous catheters, urinary catheter care, ventilator-associated pneumonia prevention, and surgical site infection prevention. Educate patients and families about the signs and symptoms of infection and the importance of seeking early medical attention. NurseNest offers sepsis management practice questions and clinical scenario flashcards for RN exam preparation.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-rn",
    "Delegation in Nursing: What RNs Need to Know",
    "delegation-nursing-rn-guide",
    "A practical guide to delegation for RNs covering the five rights of delegation, scope of practice considerations, legal and ethical implications, and real-world delegation scenarios.",
    "delegation nursing RN",
    "Delegation in Nursing | RN Guide to Safe Delegation",
    "Master delegation in nursing with this RN guide. Covers the five rights of delegation, scope considerations, and practical scenarios for safe, effective task assignment.",
    ["delegation", "management", "rn", "leadership", "nursing"],
    ["delegation nursing", "five rights delegation", "rn delegation guide", "nursing task delegation"],
    [
      { heading: "The Five Rights of Delegation",
        paragraphs: [
          "Delegation is a professional nursing skill that involves transferring responsibility for a specific task to another person while retaining accountability for the overall outcome. The National Council of State Boards of Nursing (NCSBN) developed the Five Rights of Delegation framework to guide nurses in making safe delegation decisions: Right Task, Right Circumstance, Right Person, Right Direction/Communication, and Right Supervision/Evaluation.",
          "Right Task: Determine whether the task is appropriate for delegation. Tasks that involve nursing judgment, assessment, patient education, or evaluation should not be delegated. Routine, repetitive tasks with predictable outcomes, such as vital signs on stable patients, hygiene care, and ambulation, are generally appropriate for delegation.",
          "Right Circumstance: Consider the patient's condition and the setting. A task may be appropriate for delegation in one circumstance but not another. For example, taking vital signs may be delegated for a stable post-operative patient but should be performed by the RN for a patient who is hemodynamically unstable or showing signs of deterioration.",
        ],
      },
      { heading: "Understanding Scope of Practice for Delegation",
        paragraphs: [
          "Effective delegation requires understanding the scope of practice for each team member. Unlicensed assistive personnel (UAPs) can perform tasks such as vital signs, hygiene care, feeding, ambulation, and specimen collection. Licensed Practical Nurses (LPNs/RPNs) can perform medication administration, wound care, and other tasks within their scope of practice.",
          "The RN cannot delegate the nursing process: assessment, nursing diagnosis, care planning, and evaluation remain RN responsibilities. Even when delegating a task, the RN retains accountability for ensuring the task was performed correctly and for acting on the results. For example, an RN may delegate vital sign collection to a UAP but must assess the results and respond to any abnormalities.",
          "State and provincial nurse practice acts define the legal boundaries of delegation. Familiarize yourself with your jurisdiction's regulations, your facility's policies on delegation, and any position statements from your regulatory body. When in doubt about whether a task can be delegated, consult your charge nurse or nursing supervisor.",
        ],
        callout: "Remember the key principle: assessment, teaching, and evaluation cannot be delegated. If a task requires nursing judgment, it must be performed by a licensed nurse."
      },
      { heading: "Communication and Follow-Up",
        paragraphs: [
          "Clear communication is essential when delegating. Use the Right Direction component to provide specific instructions about what to do, when to do it, what to report, and when to seek help. For example: 'Please take Mr. Smith's vital signs at 1400 and report the results to me. Let me know immediately if his systolic blood pressure is below 100 or above 180, or if his heart rate is below 60 or above 120.'",
          "Right Supervision requires following up on delegated tasks to ensure they were completed correctly and that the patient's needs were met. Check in with the delegate at appropriate intervals, review the results, and provide feedback. Document the delegation, including the task delegated, the person performing it, the instructions given, and the outcome.",
          "When delegation does not go as planned, address issues promptly and constructively. If a delegate did not complete a task correctly, provide additional instruction and education. If patient safety was compromised, follow your facility's incident reporting procedures. Use each experience as a learning opportunity to improve future delegation decisions.",
        ],
      },
      { heading: "Common Delegation Scenarios and Exam Questions",
        paragraphs: [
          "NCLEX and REx-PN exams frequently test delegation knowledge. Common scenarios include determining which patient can be assigned to an LPN, identifying tasks that can be delegated to a UAP, and selecting which patient the RN should assess first after receiving report. Approach these questions systematically using the Five Rights framework.",
          "For example: an RN has four patients and a UAP. Which task should the RN delegate? Option analysis: obtaining vital signs on a stable patient (can be delegated to UAP), performing a wound assessment (requires nursing judgment, cannot be delegated), teaching a new diabetic patient about insulin injection (requires RN teaching, cannot be delegated), administering IV medications (requires licensed nurse). The correct delegation is obtaining vital signs on the stable patient. NurseNest offers delegation practice questions and flashcards to help nurses prepare for licensing exams and clinical practice.",
        ],
      },
    ]
  ));

  // ===== NURSING NP (6 posts) =====
  posts.push(createPost("nursing-np",
    "Nurse Practitioner Certification Guide: AANP vs ANCC",
    "nurse-practitioner-certification-aanp-vs-ancc",
    "A comparison guide for nurse practitioner certification exams, covering AANP vs ANCC exam differences, eligibility requirements, content areas, and study strategies for NP students.",
    "nurse practitioner certification",
    "NP Certification: AANP vs ANCC | Complete Comparison",
    "Compare AANP and ANCC nurse practitioner certification exams. Learn eligibility, content differences, pass rates, and study strategies for NP students.",
    ["np", "certification", "aanp", "ancc", "exam-prep"],
    ["nurse practitioner certification", "aanp vs ancc", "np exam comparison", "np certification guide"],
    [
      { heading: "Overview of NP Certification Options",
        paragraphs: [
          "Nurse Practitioner certification in the United States is offered by two national certifying bodies: the American Academy of Nurse Practitioners Certification Board (AANPCB), which administers the AANP exam, and the American Nurses Credentialing Center (ANCC). Both certifications are nationally recognized and accepted by state boards of nursing for NP licensure.",
          "Choosing between the AANP and ANCC exams depends on several factors including your educational preparation, clinical focus, and career goals. While both exams assess competency for entry-level NP practice, they differ in format, content emphasis, and testing approach. Understanding these differences helps you select the certification that best aligns with your strengths and practice focus.",
          "Both AANP and ANCC offer Family Nurse Practitioner (FNP) certification, which is the most commonly pursued NP specialty. ANCC also offers certifications in Adult-Gerontology (both primary and acute care), Pediatric, Psychiatric-Mental Health, and other specialties. AANP offers FNP and Adult-Gerontology Primary Care NP certifications.",
        ],
      },
      { heading: "Exam Format and Content Differences",
        paragraphs: [
          "The AANP exam consists of 150 multiple-choice questions (135 scored, 15 pilot questions) with a 3-hour time limit. The exam emphasizes clinical judgment and differential diagnosis. Content is weighted heavily toward assessment and diagnosis (approximately 80% of the exam covers assessment, diagnosis, and plan of care). Pharmacology and clinical management are integrated throughout the questions.",
          "The ANCC exam also consists of 175 questions (150 scored, 25 pilot) with a 3.5-hour time limit. The ANCC exam places greater emphasis on theory, research, and professional role development compared to the AANP. Approximately 30% of the ANCC exam covers role-based competencies including evidence-based practice, leadership, and health policy, while 70% covers clinical content.",
          "In general, the AANP exam is considered more clinically focused, with questions that closely mirror what you would encounter in primary care practice. The ANCC exam integrates more questions about the NP role, leadership, theory, and research. Students who prefer clinically focused content often gravitate toward the AANP, while those with strong foundations in nursing theory and research may prefer the ANCC.",
        ],
        callout: "Regardless of which exam you choose, you can practice in any state that accepts national NP certification. Both AANP and ANCC are recognized nationwide, so the choice does not limit your practice options."
      },
      { heading: "Eligibility Requirements",
        paragraphs: [
          "Both certifying bodies require completion of a graduate-level NP program that is accredited by either CCNE (Commission on Collegiate Nursing Education) or ACEN (Accreditation Commission for Education in Nursing). You must hold a current, active RN license and have completed a minimum number of supervised clinical hours (typically 500 or more) in your NP program.",
          "The AANP requires that your NP program includes separate, dedicated courses in advanced pathophysiology, advanced pharmacology, and advanced health assessment (the three Ps). The ANCC has similar requirements and may accept integrated coursework that covers these content areas across the curriculum. Verify your program's alignment with the certifying body's requirements before registering for the exam.",
          "Both certifications require renewal every 5 years through a combination of continuing education hours, practice hours, and in some cases, pharmacology-specific continuing education. Plan your continuing education to meet renewal requirements from the start of your NP career to avoid gaps in certification.",
        ],
      },
      { heading: "Study Strategies for NP Certification",
        paragraphs: [
          "Begin studying 3 to 4 months before your planned exam date. Use a comprehensive NP review course as your primary study resource. Popular review courses include Fitzgerald, Barkley, and Leik. Supplement your review course with practice questions specifically designed for the certification exam you have selected.",
          "Focus your study on the conditions and presentations most commonly seen in your certification area. For FNP certification, high-yield topics include hypertension management, diabetes care, thyroid disorders, COPD and asthma, depression and anxiety, pediatric well-child visits, and women's health. Know first-line treatments, when to refer, and evidence-based screening guidelines.",
          "Pharmacology is a critical component of both exams. Study drug classes, mechanisms of action, common interactions, contraindications, and monitoring parameters. Know the first-line medications for common conditions and understand when to escalate therapy or switch drug classes. NurseNest offers NP certification practice questions, pharmacology flashcards, and clinical decision-making scenarios.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-np",
    "Differential Diagnosis Skills for Nurse Practitioners",
    "differential-diagnosis-skills-nurse-practitioners",
    "Develop systematic differential diagnosis skills as a nurse practitioner. Learn clinical reasoning frameworks, red flag recognition, and evidence-based diagnostic approaches for primary care.",
    "differential diagnosis nurse practitioner",
    "Differential Diagnosis for NPs | Clinical Reasoning Guide",
    "Build differential diagnosis skills as a nurse practitioner. Learn systematic clinical reasoning, red flag recognition, and diagnostic approaches for primary care NPs.",
    ["differential-diagnosis", "np", "clinical-reasoning", "assessment"],
    ["differential diagnosis np", "clinical reasoning nurse practitioner", "np diagnostic skills", "primary care diagnosis"],
    [
      { heading: "Systematic Approach to Differential Diagnosis",
        paragraphs: [
          "Differential diagnosis is the process of distinguishing a particular disease or condition from others that present with similar clinical features. As a nurse practitioner, developing a systematic approach to differential diagnosis is essential for safe, accurate clinical decision-making. This process begins with thorough history-taking and physical examination, then uses pattern recognition and clinical reasoning to narrow the list of possibilities.",
          "Start by generating a broad differential based on the patient's chief complaint, then systematically narrow it using additional history, physical examination findings, and diagnostic testing. Consider anatomical causes (which organ systems could produce these symptoms), pathological categories (infectious, inflammatory, neoplastic, traumatic, metabolic, degenerative), and epidemiological factors (age, sex, risk factors, prevalence).",
          "The hypothetico-deductive model involves generating early hypotheses and then seeking data to confirm or refute each possibility. As you gather more information, revise your differential list. The goal is not to arrive at a single diagnosis immediately but to systematically narrow the possibilities to the most likely diagnosis while ruling out dangerous conditions that require immediate intervention.",
        ],
      },
      { heading: "Red Flags and Must-Not-Miss Diagnoses",
        paragraphs: [
          "Every chief complaint has associated red flags that suggest potentially dangerous diagnoses. These 'must-not-miss' diagnoses include conditions that are life-threatening, time-sensitive, or carry significant morbidity if missed. Your differential should always include these conditions until they can be reasonably excluded.",
          "For chest pain, must-not-miss diagnoses include acute myocardial infarction, pulmonary embolism, aortic dissection, tension pneumothorax, and esophageal rupture. For headache, consider subarachnoid hemorrhage, meningitis, temporal arteritis, and intracranial mass. For abdominal pain, rule out appendicitis, ectopic pregnancy, bowel obstruction, and aortic aneurysm.",
          "Document your clinical reasoning, including the diagnoses you considered and the evidence that supports or refutes each one. This documentation protects you legally and demonstrates thorough clinical thinking. If a patient returns with worsening symptoms, your documented differential helps guide reassessment and demonstrates that you considered serious diagnoses during the initial visit.",
        ],
        callout: "Always consider the 'worst first' approach: identify the most dangerous diagnosis on your differential and either rule it out or initiate treatment before moving on to less urgent possibilities."
      },
      { heading: "Using Evidence-Based Guidelines",
        paragraphs: [
          "Clinical practice guidelines provide evidence-based algorithms for diagnostic evaluation of common presentations. Use guidelines from organizations such as the American Heart Association, the U.S. Preventive Services Task Force, the American College of Chest Physicians, and specialty-specific organizations to guide your diagnostic workup.",
          "Understand the sensitivity and specificity of common diagnostic tests to interpret results accurately. A highly sensitive test is good for ruling out a diagnosis (when negative), while a highly specific test is good for ruling in a diagnosis (when positive). Consider pre-test probability when ordering tests, as testing in low-probability populations increases false-positive results.",
          "Point-of-care ultrasound (POCUS) is an increasingly valuable diagnostic tool for NPs. Bedside ultrasound can quickly assess for pleural effusion, pericardial effusion, abdominal free fluid, DVT, and intrauterine pregnancy. Many NP programs now include POCUS training, and continuing education courses are widely available.",
        ],
      },
      { heading: "Building Diagnostic Expertise",
        paragraphs: [
          "Diagnostic expertise develops through deliberate practice and reflective learning. After each clinical encounter, review whether your initial differential was appropriate and whether your diagnostic workup was efficient. Identify any diagnoses you missed or did not consider and explore why.",
          "Case-based learning is particularly effective for developing differential diagnosis skills. Work through clinical cases with colleagues, review interesting cases from the literature, and use clinical decision support tools to compare your differential with evidence-based guidelines. NurseNest offers clinical case studies, differential diagnosis practice scenarios, and evidence-based clinical decision-making resources for nurse practitioner students.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-np",
    "Prescriptive Authority for Nurse Practitioners: State-by-State Guide",
    "prescriptive-authority-nurse-practitioners-guide",
    "Understanding NP prescriptive authority across states, covering full practice authority vs collaborative agreements, controlled substance prescribing, and regulatory compliance requirements.",
    "nurse practitioner prescriptive authority",
    "NP Prescriptive Authority Guide | State Practice Laws",
    "Navigate nurse practitioner prescriptive authority laws. Learn about full practice authority, collaborative agreements, controlled substance prescribing, and state regulations.",
    ["prescriptive-authority", "np", "regulations", "pharmacology"],
    ["np prescriptive authority", "nurse practitioner state laws", "np controlled substance prescribing", "full practice authority"],
    [
      { heading: "Understanding NP Practice Authority Levels",
        paragraphs: [
          "Nurse practitioner practice authority in the United States varies significantly by state and is categorized into three levels: full practice, reduced practice, and restricted practice. Full practice authority states allow NPs to evaluate patients, diagnose, order and interpret diagnostic tests, and prescribe medications (including controlled substances) without physician oversight or collaborative agreements.",
          "Reduced practice states require NPs to enter into a collaborative agreement with a physician to provide at least one component of NP practice. The specifics of these agreements vary by state and may include chart review requirements, consultation requirements, or co-signature requirements for certain orders or prescriptions.",
          "Restricted practice states require physician supervision, delegation, or team management for NPs to practice. These states impose the most limitations on NP autonomy and typically require a formal supervisory agreement with a specific physician. The trend nationally has been toward expanding NP practice authority, with more states moving to full practice authority over time.",
        ],
      },
      { heading: "Controlled Substance Prescribing",
        paragraphs: [
          "NP authority to prescribe controlled substances is regulated at both the federal and state levels. At the federal level, NPs must register with the Drug Enforcement Administration (DEA) and obtain a DEA number to prescribe Schedule II through V controlled substances. Each state has its own regulations regarding which schedules NPs may prescribe and under what conditions.",
          "In full practice authority states, NPs can prescribe all schedules of controlled substances independently. In reduced and restricted practice states, NP prescribing of controlled substances may require physician co-signature, be limited to certain schedules, or require additional state-specific registrations.",
          "Regardless of your state's practice authority level, prescribing controlled substances carries significant professional and legal responsibility. Follow evidence-based guidelines for opioid prescribing, use prescription drug monitoring programs (PDMPs), and document your clinical rationale for prescribing controlled substances. Many states require NPs to check the PDMP before each controlled substance prescription.",
        ],
        callout: "Always check your state's current prescriptive authority regulations, as laws change frequently. The American Association of Nurse Practitioners (AANP) maintains an updated state practice environment map that tracks practice authority changes."
      },
      { heading: "Collaborative Practice Agreements",
        paragraphs: [
          "In states that require collaborative practice agreements, the agreement must specify the terms of the collaboration, including the types of consultations required, chart review frequency, prescriptive authority parameters, and emergency protocols. The agreement should be reviewed and updated regularly to reflect current practice standards.",
          "Select a collaborating physician who is knowledgeable about NP scope of practice and supportive of NP autonomy within legal boundaries. A good collaborative relationship enhances patient care and professional satisfaction. Many NPs find that collaborating physicians serve as valuable resources for complex cases, even in states where collaboration is not legally required.",
          "If you practice in a state with collaborative requirements and are considering relocating, research the practice authority laws in your destination state before making commitments. Practice authority significantly affects your clinical autonomy, professional satisfaction, and in some cases, compensation. NurseNest provides practice authority resources and regulatory compliance study materials for NP students.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-np",
    "Primary Care Management of Type 2 Diabetes for NPs",
    "primary-care-type-2-diabetes-management-np",
    "Evidence-based type 2 diabetes management for nurse practitioners in primary care, covering diagnostic criteria, treatment algorithms, medication selection, monitoring, and patient education strategies.",
    "type 2 diabetes management nurse practitioner",
    "Type 2 Diabetes Management for NPs | Primary Care Guide",
    "Master type 2 diabetes management in primary care as a nurse practitioner. Covers ADA guidelines, medication algorithms, monitoring, and patient education.",
    ["diabetes", "np", "primary-care", "pharmacology", "chronic-disease"],
    ["diabetes management np", "type 2 diabetes treatment", "np diabetes guidelines", "ada diabetes algorithm"],
    [
      { heading: "Diagnostic Criteria and Initial Assessment",
        paragraphs: [
          "Type 2 diabetes mellitus is diagnosed when any of the following criteria are met: fasting plasma glucose of 126 mg/dL or greater, 2-hour plasma glucose of 200 mg/dL or greater during an oral glucose tolerance test, HbA1c of 6.5% or greater, or random plasma glucose of 200 mg/dL or greater in a patient with classic hyperglycemic symptoms. In the absence of unequivocal hyperglycemia, diagnosis requires two abnormal test results from the same sample or two separate samples.",
          "The initial assessment of a newly diagnosed patient should include a comprehensive metabolic panel, lipid panel, HbA1c, urinalysis with microalbumin-to-creatinine ratio, thyroid function tests, and hepatic function tests. Assess for microvascular complications: dilated eye exam (retinopathy), foot examination (neuropathy and vascular disease), and urine albumin (nephropathy). Screen for cardiovascular risk factors including hypertension and dyslipidemia.",
          "Establish baseline values for ongoing monitoring and set individualized treatment targets based on the patient's age, comorbidities, life expectancy, and preferences. The American Diabetes Association (ADA) recommends an HbA1c target of less than 7% for most adults but acknowledges that less stringent targets (7.5-8%) may be appropriate for patients with limited life expectancy, extensive comorbidities, or a history of severe hypoglycemia.",
        ],
      },
      { heading: "Pharmacotherapy and Treatment Algorithms",
        paragraphs: [
          "Metformin remains the recommended first-line pharmacotherapy for type 2 diabetes, initiated at diagnosis along with lifestyle modifications. Start metformin at 500 mg once daily with a meal and titrate to a maximum of 2000 mg daily in divided doses. Metformin is contraindicated in patients with an eGFR below 30 mL/min and should be used with caution when eGFR is 30-45 mL/min.",
          "Second-line therapy selection should be individualized based on the patient's comorbidities, risk of hypoglycemia, weight considerations, cost, and preferences. For patients with established atherosclerotic cardiovascular disease (ASCVD), GLP-1 receptor agonists (liraglutide, semaglutide) or SGLT2 inhibitors (empagliflozin, dapagliflozin) are preferred due to demonstrated cardiovascular and renal benefits. SGLT2 inhibitors are also preferred for patients with heart failure or chronic kidney disease.",
          "Insulin therapy should be considered when HbA1c remains above target despite dual or triple oral therapy, or when the initial HbA1c is 10% or greater. Basal insulin (glargine or detemir) is typically initiated at 10 units daily or 0.1-0.2 units/kg/day and titrated based on fasting glucose levels. Bolus insulin is added when basal insulin alone is insufficient.",
        ],
      },
      { heading: "Monitoring and Follow-Up",
        paragraphs: [
          "Monitor HbA1c every 3 months until target is achieved, then every 6 months if stable. At each visit, assess self-monitoring blood glucose records (if applicable), medication adherence, hypoglycemic episodes, and lifestyle modifications. Annual monitoring includes comprehensive metabolic panel, lipid panel, urine albumin-to-creatinine ratio, and dilated eye exam referral.",
          "Foot examinations should be performed at every visit, with a comprehensive foot exam annually. Assess for loss of protective sensation using the 10-g monofilament test, absent pedal pulses, foot deformities, calluses, and skin breakdown. Patient education on daily foot inspection and appropriate footwear reduces the risk of foot ulcers and amputation.",
          "Screen for depression, diabetes distress, and cognitive impairment regularly, as these conditions are more prevalent in patients with diabetes and can significantly impact self-management. Use validated screening tools such as the PHQ-2/PHQ-9 for depression and the Diabetes Distress Scale for diabetes-related emotional burden. NurseNest offers diabetes management practice questions, pharmacology flashcards, and clinical case studies for NP students.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-np",
    "Evidence-Based Hypertension Management for NPs",
    "evidence-based-hypertension-management-np",
    "A clinical guide to hypertension management for nurse practitioners, covering JNC and AHA guidelines, antihypertensive selection, resistant hypertension, and special populations.",
    "hypertension management nurse practitioner",
    "Hypertension Management for NPs | Evidence-Based Guide",
    "Master evidence-based hypertension management as a nurse practitioner. Covers AHA guidelines, drug selection, resistant hypertension, and treatment for special populations.",
    ["hypertension", "np", "primary-care", "pharmacology", "cardiology"],
    ["hypertension management np", "antihypertensive medications", "blood pressure treatment guidelines", "resistant hypertension management"],
    [
      { heading: "Current Hypertension Guidelines",
        paragraphs: [
          "The 2017 ACC/AHA hypertension guidelines redefined hypertension as blood pressure of 130/80 mmHg or greater, lowering the threshold from the previous 140/90 mmHg. Blood pressure categories include normal (less than 120/80), elevated (120-129/less than 80), Stage 1 hypertension (130-139/80-89), and Stage 2 hypertension (140 or greater/90 or greater).",
          "Accurate blood pressure measurement is foundational. Use an appropriately sized cuff, ensure the patient has been seated and resting for at least 5 minutes, and take the average of at least 2 readings on at least 2 separate occasions before diagnosing hypertension. Ambulatory blood pressure monitoring (ABPM) or home blood pressure monitoring may be recommended to confirm the diagnosis and rule out white coat hypertension.",
          "Treatment thresholds depend on the patient's cardiovascular risk. For patients with known ASCVD or a 10-year ASCVD risk of 10% or greater, pharmacological treatment is recommended at 130/80 mmHg. For patients without ASCVD and a 10-year risk below 10%, pharmacological treatment is recommended at 140/90 mmHg. All patients with elevated blood pressure or Stage 1 hypertension should receive lifestyle modification counseling.",
        ],
      },
      { heading: "First-Line Antihypertensive Selection",
        paragraphs: [
          "Four classes of antihypertensive medications are recommended as first-line therapy: thiazide or thiazide-type diuretics, ACE inhibitors, angiotensin receptor blockers (ARBs), and calcium channel blockers (CCBs). Selection should be individualized based on patient-specific factors including comorbidities, race/ethnicity, age, and potential adverse effects.",
          "For Black patients without CKD or heart failure, initial therapy with a thiazide diuretic or CCB is recommended due to greater efficacy in this population. ACE inhibitors and ARBs are preferred first-line agents for patients with diabetes, CKD with proteinuria, or heart failure. Thiazide diuretics are particularly effective in older adults and for isolated systolic hypertension.",
          "If blood pressure is not controlled on a single agent at maximum tolerated dose, add a second agent from a different class. The combination of ACE inhibitor or ARB with a CCB or thiazide diuretic is effective and well-tolerated. Never combine an ACE inhibitor with an ARB due to increased risk of hyperkalemia, acute kidney injury, and hypotension without additional cardiovascular benefit.",
        ],
        callout: "Beta-blockers are no longer considered first-line antihypertensives unless the patient has a compelling indication such as heart failure with reduced ejection fraction, post-MI, or rate control for atrial fibrillation."
      },
      { heading: "Managing Resistant Hypertension",
        paragraphs: [
          "Resistant hypertension is defined as blood pressure above goal despite concurrent use of 3 antihypertensive agents of different classes (one being a diuretic) at optimal doses. Before diagnosing resistant hypertension, confirm medication adherence, exclude white coat hypertension with ABPM, and address contributing factors.",
          "Contributing factors to resistant hypertension include medication non-adherence, secondary causes (primary aldosteronism, renal artery stenosis, obstructive sleep apnea, pheochromocytoma), excessive dietary sodium, obesity, excessive alcohol consumption, and interfering medications (NSAIDs, decongestants, oral contraceptives). Screen for secondary causes in patients with onset before age 30 or after age 55, sudden worsening, or other clinical indicators.",
          "Spironolactone (25-50 mg daily) is the recommended fourth agent for resistant hypertension based on evidence from the PATHWAY-2 trial. Monitor potassium and renal function closely when adding spironolactone, particularly in patients already on ACE inhibitors or ARBs. NurseNest offers hypertension management practice questions and pharmacology flashcards for NP exam preparation.",
        ],
      },
    ]
  ));

  posts.push(createPost("nursing-np",
    "How to Become a Nurse Practitioner: Step-by-Step Career Guide",
    "how-to-become-nurse-practitioner-step-by-step",
    "A comprehensive career pathway guide for becoming a nurse practitioner, covering education requirements, clinical hours, certification options, and career specialization opportunities.",
    "how to become nurse practitioner",
    "How to Become a Nurse Practitioner | Career Guide",
    "Learn the steps to become a nurse practitioner. Covers BSN to MSN/DNP pathways, clinical hour requirements, certification, and NP career specializations.",
    ["np", "career", "education", "certification", "nursing"],
    ["how to become nurse practitioner", "np career pathway", "msn vs dnp", "nurse practitioner requirements"],
    [
      { heading: "Educational Pathways to Becoming an NP",
        paragraphs: [
          "Becoming a nurse practitioner requires earning a graduate degree in nursing, either a Master of Science in Nursing (MSN) or a Doctor of Nursing Practice (DNP). Both pathways prepare you for advanced practice nursing roles, but they differ in scope and depth of preparation. The MSN typically takes 2 to 3 years of full-time study beyond the BSN, while the DNP adds an additional 1 to 2 years focused on clinical scholarship and systems leadership.",
          "The most common pathway is BSN to MSN, where a Registered Nurse with a Bachelor of Science in Nursing enrolls in a graduate NP program. For nurses with an associate degree, ADN-to-MSN bridge programs are available at many universities. Direct-entry MSN programs also exist for individuals with non-nursing bachelor's degrees who wish to enter the nursing profession at the graduate level.",
          "NP programs require completion of the three P courses: advanced pathophysiology, advanced pharmacology, and advanced health assessment. These foundational courses build upon undergraduate nursing knowledge and prepare you for the advanced clinical decision-making required in NP practice. Clinical rotations, typically 500 to 1,000 hours, provide supervised experience in your chosen specialty area.",
        ],
      },
      { heading: "Choosing Your NP Specialty",
        paragraphs: [
          "NP specialties include Family Nurse Practitioner (FNP), Adult-Gerontology Primary Care (AGPCNP), Adult-Gerontology Acute Care (AGACNP), Pediatric Primary Care (PCPNP), Pediatric Acute Care (PACNP), Psychiatric-Mental Health (PMHNP), Neonatal (NNP), and Women's Health (WHNP). Your specialty choice determines your patient population, practice settings, and certification pathway.",
          "Family Nurse Practitioners have the broadest scope, caring for patients across the lifespan from infancy to geriatrics. This versatility makes FNP the most popular NP specialty and provides the greatest flexibility in practice settings. Psychiatric-Mental Health NP is the fastest-growing specialty due to the significant shortage of mental health providers nationwide.",
          "Consider your clinical interests, desired practice setting, job market demand, and lifestyle preferences when choosing a specialty. Shadow NPs in different specialties during your RN career to gain firsthand insight into what each role entails. Your specialty choice is important but not necessarily permanent. Post-master's certificate programs allow certified NPs to add additional specialties.",
        ],
      },
      { heading: "Certification and Licensure",
        paragraphs: [
          "After completing your NP program, you must obtain national certification in your specialty area through AANP or ANCC. Certification requires passing a board examination that tests clinical knowledge, pharmacology, and clinical decision-making. Preparation typically begins during the final semester of your NP program and continues for 2 to 3 months after graduation.",
          "State licensure as an NP requires national certification, an active RN license, completion of an accredited NP program, and application to your state board of nursing. Requirements vary by state and may include additional components such as state-specific prescriptive authority applications, collaborative practice agreements, and DEA registration for controlled substance prescribing.",
          "Maintain your certification through continuing education, clinical practice hours, and periodic recertification. Both AANP and ANCC require renewal every 5 years. Stay current with evolving clinical guidelines, pharmacological advances, and changes in scope of practice regulations. NurseNest offers NP career planning resources, certification exam preparation materials, and pharmacology flashcards for aspiring and current nurse practitioners.",
        ],
      },
    ]
  ));

  // ===== PHARMACY TECHNICIAN (6 posts) =====
  const pharmacyPosts = [
    { title: "How to Pass the PTCB Exam: Complete Study Guide", slug: "how-to-pass-ptcb-exam-study-guide", keyword: "pass PTCB exam", seoTitle: "How to Pass the PTCB Exam | Complete Study Guide", seoDesc: "Learn proven strategies to pass the PTCB exam. Covers study plans, content areas, calculation tips, and test-day strategies for pharmacy technician students.", sections: [
      { heading: "Understanding the PTCB Exam Format", paragraphs: ["The Pharmacy Technician Certification Board (PTCB) exam consists of 90 multiple-choice questions with a 2-hour time limit. Of these 90 questions, 80 are scored and 10 are unscored pilot questions that are being tested for future use. The exam covers four content domains: Medications (40%), Federal Requirements (12.5%), Patient Safety and Quality Assurance (26.25%), and Order Entry and Processing (21.25%).", "The exam uses a linear fixed-form format, meaning all candidates receive the same set of questions in a predetermined order. You cannot go back and change previous answers. The passing score is 1400 on a scale of 1000 to 1600. Understanding the exam structure helps you allocate your study time proportionally across content domains.", "Registration for the PTCB exam requires a high school diploma or equivalent and completion of a PTCB-recognized pharmacy technician education program or equivalent work experience. The exam fee is approximately $129, and you can schedule your exam at Pearson VUE testing centers nationwide."], callout: "The Medications domain accounts for 40% of the exam. Focus heavily on drug classifications, generic and brand name pairs, and common drug interactions to maximize your score in this critical area." },
      { heading: "Pharmacy Calculations You Must Master", paragraphs: ["Pharmacy calculations appear throughout the PTCB exam and are essential for daily pharmacy practice. Master these core calculation types: ratio and proportion, percentage calculations, dilution and concentration problems, dosage calculations based on body weight, and days supply calculations.", "For ratio and proportion problems, set up the equation with known values on one side and the unknown on the other. Cross-multiply and solve for the unknown. For example, if a prescription calls for 250 mg and the available tablet strength is 125 mg, the calculation is 250 mg / 125 mg = 2 tablets per dose.", "Days supply calculations are frequently tested and commonly encountered in retail pharmacy practice. To calculate days supply, divide the total quantity dispensed by the daily dose. For example, if a patient receives 90 tablets of a medication taken twice daily, the days supply is 90 / 2 = 45 days. For liquid medications, divide the total volume by the daily volume. Practice these calculations until they become automatic."] },
      { heading: "High-Yield Drug Knowledge for the PTCB", paragraphs: ["The top 200 medications list is a critical study resource for the PTCB exam. Focus on learning the generic name, brand name, drug class, common indications, and standard dosage forms for these medications. Group medications by class to identify patterns: all statins end in -statin, all ACE inhibitors end in -pril, all beta-blockers end in -olol, and all proton pump inhibitors end in -prazole.", "Know the controlled substance schedules and examples of drugs in each schedule. Schedule II drugs (oxycodone, methylphenidate, fentanyl) have high abuse potential and no refills. Schedule III drugs (codeine combinations, testosterone) allow up to 5 refills within 6 months. Schedule IV drugs (benzodiazepines, zolpidem) also allow 5 refills within 6 months.", "Understand common drug interactions, especially those involving warfarin, digoxin, and MAO inhibitors. Know which medications require monitoring of specific lab values (warfarin requires INR monitoring, metformin requires renal function monitoring, lithium requires serum level monitoring). NurseNest provides PTCB practice questions, drug classification flashcards, and pharmacy calculation exercises."] },
    ]},
    { title: "Top 200 Medications Every Pharmacy Tech Must Know", slug: "top-200-medications-pharmacy-technician", keyword: "top 200 medications pharmacy tech", seoTitle: "Top 200 Medications for Pharmacy Techs | Study Guide", seoDesc: "Master the top 200 medications for the PTCB exam. Drug classifications, generic/brand name pairs, indications, and memory tips for pharmacy technician students.", sections: [
      { heading: "Cardiovascular Medications", paragraphs: ["Cardiovascular medications represent a significant portion of the top 200 drugs list. ACE inhibitors (lisinopril, enalapril, ramipril) are first-line treatments for hypertension and heart failure. They work by inhibiting angiotensin-converting enzyme, reducing angiotensin II production, and causing vasodilation. Common side effects include dry cough and hyperkalemia. ACE inhibitors are contraindicated in pregnancy.", "Statins (atorvastatin, rosuvastatin, simvastatin) are the most commonly prescribed drug class in the United States. They lower LDL cholesterol by inhibiting HMG-CoA reductase in the liver. All statins should be taken in the evening when cholesterol synthesis is highest. Monitor liver function and report unexplained muscle pain, which may indicate rhabdomyolysis.", "Beta-blockers (metoprolol, carvedilol, atenolol) reduce heart rate and blood pressure by blocking beta-adrenergic receptors. Metoprolol succinate (Toprol-XL) is the extended-release formulation, while metoprolol tartrate (Lopressor) is the immediate-release form. Never confuse these formulations as they are not interchangeable. Patients should not abruptly discontinue beta-blockers due to the risk of rebound tachycardia."] },
      { heading: "CNS and Mental Health Medications", paragraphs: ["SSRIs (sertraline, escitalopram, fluoxetine) are first-line treatments for depression and anxiety disorders. These medications increase serotonin levels by blocking reuptake. It takes 4 to 6 weeks for full therapeutic effect. The black box warning for SSRIs states increased risk of suicidal thinking in children, adolescents, and young adults under 25.", "Benzodiazepines (alprazolam, lorazepam, diazepam, clonazepam) are Schedule IV controlled substances used for anxiety, insomnia, and seizure disorders. They enhance GABA activity in the brain. Dispensing rules include a maximum of 5 refills within 6 months from the date of the original prescription. Monitor for signs of dependence and tolerance.", "Opioid analgesics (oxycodone, hydrocodone, tramadol, morphine) are the most commonly prescribed controlled substances. Schedule II opioids (oxycodone, morphine, fentanyl) cannot be refilled and require a new prescription each time. Hydrocodone combination products were reclassified from Schedule III to Schedule II in 2014. NurseNest offers medication flashcards and practice questions covering all top 200 medications."] },
    ]},
    { title: "Pharmacy Technician Career Guide: From Certification to Advancement", slug: "pharmacy-technician-career-guide-certification-advancement", keyword: "pharmacy technician career", seoTitle: "Pharmacy Tech Career Guide | Certification to Advancement", seoDesc: "Explore pharmacy technician career paths from certification to advancement. Covers work settings, specializations, salary expectations, and professional development.", sections: [
      { heading: "Pharmacy Technician Work Settings and Roles", paragraphs: ["Pharmacy technicians work in diverse settings including retail pharmacies, hospital pharmacies, long-term care facilities, mail-order pharmacies, compounding pharmacies, and specialty pharmacies. Each setting offers unique responsibilities, challenges, and opportunities for professional growth. Retail pharmacy is the most common setting, where technicians fill prescriptions, manage inventory, and interact directly with patients.", "Hospital pharmacy technicians prepare IV admixtures, manage automated dispensing cabinets, compound sterile and non-sterile preparations, and support clinical pharmacy services. Hospital positions typically offer regular schedules, benefits, and higher pay compared to retail settings. Specialized hospital roles include chemotherapy compounding, nuclear pharmacy, and operating room pharmacy.", "Emerging roles for pharmacy technicians include pharmacy informatics, medication reconciliation, immunization administration (in states that permit it), and telepharmacy support. These advanced roles require additional training and certification but offer career advancement beyond traditional dispensing functions."] },
      { heading: "Specialization and Advancement Opportunities", paragraphs: ["Pharmacy technician specializations include compounding, IV preparation, oncology, nuclear pharmacy, and informatics. Each specialization may require additional certification or training. The PTCB offers advanced certifications in Compounded Sterile Preparation (CSPT) and Medication History (CPhT-Adv) for technicians seeking to demonstrate specialized competency.", "Career advancement can follow several paths: lead or senior pharmacy technician, pharmacy buyer, pharmacy informatics specialist, or pharmacy technician educator. Some technicians use their experience as a foundation for pursuing further education in pharmacy (PharmD), nursing, or other health care professions.", "Professional development includes attending pharmacy conferences, joining professional organizations such as the American Association of Pharmacy Technicians (AAPT), and pursuing continuing education. PTCB requires 20 hours of continuing education every 2 years for certification renewal, including at least 1 hour in pharmacy law and 1 hour in patient safety. NurseNest offers pharmacy technician career development resources and certification exam preparation materials."] },
    ]},
    { title: "Controlled Substance Regulations Every Pharmacy Tech Must Know", slug: "controlled-substance-regulations-pharmacy-technician", keyword: "controlled substance regulations pharmacy tech", seoTitle: "Controlled Substance Rules for Pharmacy Techs | Guide", seoDesc: "Master controlled substance regulations for the PTCB exam. DEA schedules, dispensing rules, storage requirements, and record-keeping for pharmacy technicians.", sections: [
      { heading: "DEA Controlled Substance Schedules", paragraphs: ["The Controlled Substances Act (CSA) classifies drugs into five schedules based on their accepted medical use, potential for abuse, and potential for dependence. Schedule I substances (heroin, LSD, marijuana at the federal level) have no accepted medical use and the highest abuse potential. Pharmacy technicians do not handle Schedule I substances in standard pharmacy practice.", "Schedule II substances (oxycodone, morphine, methylphenidate, amphetamine, fentanyl) have high abuse potential but accepted medical use. Schedule II prescriptions cannot be refilled. A new prescription is required each time. Schedule II prescriptions require the prescriber's handwritten signature on written prescriptions, though many states now accept electronic prescriptions for controlled substances (EPCS).", "Schedule III (codeine combinations, anabolic steroids, ketamine) and Schedule IV (benzodiazepines, zolpidem, tramadol) substances can be refilled up to 5 times within 6 months of the original prescription date. Schedule V substances (cough preparations with codeine, pregabalin) have the lowest abuse potential among controlled substances and may be dispensed without a prescription in some states with pharmacist oversight."], callout: "For PTCB exam purposes, memorize the refill rules: Schedule II has NO refills. Schedules III, IV, and V allow up to 5 refills within 6 months from the date the prescription was issued." },
      { heading: "Dispensing, Storage, and Record-Keeping", paragraphs: ["Controlled substances require special storage in a locked, substantially constructed cabinet or dispersed throughout non-controlled inventory to discourage theft. Schedule II substances require a separate perpetual inventory with ongoing documentation of every unit received and dispensed. Physical inventory of all controlled substances must be conducted at least every 2 years.", "The DEA Form 222 is required for ordering Schedule II controlled substances. This triplicate form provides a paper trail for all Schedule II transactions. The DEA has approved the Controlled Substance Ordering System (CSOS) as an electronic alternative to Form 222. Either method must be used for every Schedule II purchase.", "Record-keeping requirements mandate that controlled substance records be maintained for at least 2 years. Records must include the date of receipt or dispensing, drug name and strength, quantity, and the source or patient. Discrepancies between inventory records and physical counts must be reported to the pharmacy manager and may require DEA notification. NurseNest provides controlled substance regulation practice questions and study flashcards for PTCB exam preparation."] },
    ]},
    { title: "Sterile Compounding Basics for Pharmacy Technicians", slug: "sterile-compounding-basics-pharmacy-technician", keyword: "sterile compounding pharmacy technician", seoTitle: "Sterile Compounding for Pharmacy Techs | USP 797 Guide", seoDesc: "Learn sterile compounding fundamentals for pharmacy technicians. Covers USP 797 standards, aseptic technique, clean room procedures, and beyond-use dating.", sections: [
      { heading: "USP 797 Standards and Clean Room Requirements", paragraphs: ["United States Pharmacopeia Chapter 797 establishes minimum standards for compounding sterile preparations (CSPs) to ensure patient safety. USP 797 applies to all settings where sterile compounding occurs, including hospital pharmacies, compounding pharmacies, and home infusion services. Pharmacy technicians involved in sterile compounding must understand and comply with these standards.", "The clean room environment consists of several areas with progressively cleaner air quality. The anteroom (ISO Class 8) is where hand washing, garbing, and initial preparation occur. The buffer room (ISO Class 7) contains the primary engineering control, either a laminar airflow workbench (LAFW) or a biological safety cabinet (BSC). The primary engineering control provides ISO Class 5 air quality at the critical site.", "Personnel must follow specific garbing procedures: remove outer garments and jewelry, perform hand hygiene with antimicrobial soap, don shoe covers, hair cover, face mask, and a sterile gown. Sterile gloves are the last item applied and must be sanitized with 70% isopropyl alcohol. Garbing order is critical for maintaining the integrity of the sterile environment."] },
      { heading: "Aseptic Technique Fundamentals", paragraphs: ["Aseptic technique prevents contamination of sterile preparations during the compounding process. The critical site is any surface that contacts the sterile product, including needle hubs, syringe tips, vial septums, and IV bag injection ports. Never touch, breathe on, or pass non-sterile objects over critical sites.", "When reconstituting a medication vial, swab the septum with 70% IPA and allow it to dry completely before inserting the needle. Use the milking technique to mix powdered medications: inject diluent, withdraw the needle, and gently swirl the vial until the powder is completely dissolved. Never shake vials containing proteins or other sensitive preparations.", "Proper syringe technique includes removing air bubbles, measuring volume at the calibration line (not the rubber tip), and maintaining the sterility of the syringe tip and needle hub throughout the compounding process. Practice manipulating syringes, vials, and IV bags in the LAFW until the motions become smooth and confident. NurseNest offers sterile compounding practice questions and technique review resources for pharmacy technicians."] },
    ]},
    { title: "Pharmacy Law and Ethics for Technicians: What You Need to Know", slug: "pharmacy-law-ethics-technicians", keyword: "pharmacy law pharmacy technician", seoTitle: "Pharmacy Law and Ethics for Technicians | PTCB Guide", seoDesc: "Essential pharmacy law and ethics knowledge for pharmacy technicians. Covers federal regulations, state laws, HIPAA, patient rights, and ethical dilemmas in pharmacy practice.", sections: [
      { heading: "Federal Pharmacy Regulations", paragraphs: ["Federal pharmacy law is a major component of the PTCB exam, comprising 12.5% of the test content. Key federal laws include the Federal Food, Drug, and Cosmetic Act (FDCA), the Controlled Substances Act (CSA), the Health Insurance Portability and Accountability Act (HIPAA), the Drug Supply Chain Security Act (DSCSA), and the Omnibus Budget Reconciliation Act of 1990 (OBRA-90).", "The FDCA establishes the FDA's authority to regulate drugs, requiring that all medications be safe and effective before marketing. Drug manufacturers must submit a New Drug Application (NDA) for brand-name drugs or an Abbreviated New Drug Application (ANDA) for generics. OBRA-90 requires pharmacists to offer patient counseling and perform prospective drug utilization review for Medicaid patients.", "HIPAA protects patient health information (PHI) and establishes penalties for unauthorized disclosure. Pharmacy technicians handle PHI daily and must understand the privacy rule, the security rule, and the circumstances under which PHI may be shared without patient authorization (treatment, payment, and healthcare operations). Violations can result in civil and criminal penalties."], callout: "HIPAA permits sharing PHI for treatment, payment, and healthcare operations without explicit patient consent. However, the minimum necessary standard applies: share only the minimum amount of information needed to accomplish the purpose." },
      { heading: "Ethical Responsibilities in Pharmacy Practice", paragraphs: ["Pharmacy technicians face ethical situations daily, including handling requests for early controlled substance refills, identifying potential prescription fraud, managing drug shortages, and maintaining patient confidentiality. Ethical practice requires balancing patient needs, legal requirements, professional standards, and personal values.", "When you identify a potential error, such as a wrong drug, wrong dose, or significant drug interaction, you have a professional obligation to bring it to the pharmacist's attention before the prescription is dispensed. Error prevention is a shared responsibility, and a culture of safety encourages reporting near-misses and actual errors without fear of punitive action.", "Maintain professional boundaries with patients and colleagues. Avoid giving medical advice (which is outside the pharmacy technician scope of practice), refuse to share personal medical information about other patients, and report any colleague behavior that could compromise patient safety. NurseNest offers pharmacy law and ethics practice questions, HIPAA compliance resources, and PTCB exam preparation materials."] },
    ]},
  ];

  for (const p of pharmacyPosts) {
    posts.push(createPost("pharmacy-tech", p.title, p.slug, p.sections[0].paragraphs[0].substring(0, 200) + "...", p.keyword, p.seoTitle, p.seoDesc,
      ["pharmacy-tech", "ptcb", "certification", "allied-health"], [p.keyword, "pharmacy technician", "ptcb exam"],
      p.sections));
  }

  // ===== RESPIRATORY THERAPY (6 posts) =====
  const rtPosts = [
    { title: "ABG Interpretation for Respiratory Therapy Students", slug: "abg-interpretation-respiratory-therapy-students", keyword: "ABG interpretation respiratory therapy", seoTitle: "ABG Interpretation for RT Students | Step-by-Step Guide", seoDesc: "Master ABG interpretation as a respiratory therapy student. Learn the systematic approach to arterial blood gas analysis, compensation patterns, and clinical decision-making.", sections: [
      { heading: "Systematic ABG Interpretation", paragraphs: ["Arterial blood gas (ABG) interpretation is one of the most critical skills for respiratory therapy students. A systematic approach ensures accurate analysis every time. Start by evaluating the pH: normal range is 7.35 to 7.45. A pH below 7.35 indicates acidosis, while a pH above 7.45 indicates alkalosis. Next, evaluate the PaCO2 (normal 35-45 mmHg) and HCO3 (normal 22-26 mEq/L) to determine the primary disorder.", "The respiratory component (PaCO2) is controlled by the lungs. An elevated PaCO2 (greater than 45 mmHg) indicates respiratory acidosis (hypoventilation), while a decreased PaCO2 (less than 35 mmHg) indicates respiratory alkalosis (hyperventilation). The metabolic component (HCO3) is controlled by the kidneys. An elevated HCO3 indicates metabolic alkalosis, while a decreased HCO3 indicates metabolic acidosis.", "After identifying the primary disorder, assess for compensation. Compensation occurs when the opposite system (respiratory or metabolic) adjusts to normalize the pH. If the pH is within normal range but PaCO2 and HCO3 are both abnormal, the body has fully compensated. If the pH remains abnormal, compensation is partial. Understanding compensation is essential for determining the acuity of the acid-base disturbance."], callout: "Use the ROME mnemonic: Respiratory Opposite (pH and PaCO2 move in opposite directions in respiratory disorders), Metabolic Equal (pH and HCO3 move in the same direction in metabolic disorders)." },
      { heading: "Common ABG Patterns in Clinical Practice", paragraphs: ["Respiratory acidosis with acute characteristics (elevated PaCO2, normal HCO3, low pH) is seen in conditions that cause sudden hypoventilation: drug overdose, neuromuscular disease, acute exacerbation of COPD, and upper airway obstruction. Chronic respiratory acidosis (elevated PaCO2 with compensatory elevated HCO3 and near-normal pH) is typical in stable COPD patients.", "Metabolic acidosis is characterized by low HCO3 and low pH. Calculate the anion gap to differentiate causes: an elevated anion gap (greater than 12 mEq/L) suggests diabetic ketoacidosis, lactic acidosis, renal failure, or toxic ingestion (MUDPILES mnemonic). A normal anion gap suggests diarrhea, renal tubular acidosis, or excessive normal saline administration.", "Respiratory alkalosis (low PaCO2, high pH) results from hyperventilation due to anxiety, pain, early sepsis, pulmonary embolism, or high altitude. Metabolic alkalosis (high HCO3, high pH) is commonly caused by vomiting, nasogastric suctioning, diuretic use, or excessive antacid intake. NurseNest offers ABG interpretation practice questions and acid-base balance flashcards for respiratory therapy students."] },
    ]},
    { title: "Mechanical Ventilation Modes Explained for RT Students", slug: "mechanical-ventilation-modes-explained-rt-students", keyword: "mechanical ventilation modes respiratory therapy", seoTitle: "Ventilator Modes Explained for RT Students | Guide", seoDesc: "Understand mechanical ventilation modes as a respiratory therapy student. Learn AC, SIMV, PSV, PRVC, and APRV with clinical indications and troubleshooting tips.", sections: [
      { heading: "Volume-Controlled vs Pressure-Controlled Ventilation", paragraphs: ["Mechanical ventilation modes are broadly categorized as volume-controlled or pressure-controlled. In volume-controlled modes, the ventilator delivers a set tidal volume regardless of the airway pressure required. This guarantees a consistent tidal volume but can result in high peak airway pressures if lung compliance decreases. Volume-controlled ventilation is the most commonly used initial mode.", "In pressure-controlled modes, the ventilator delivers gas until a set inspiratory pressure is reached. The resulting tidal volume varies depending on lung compliance and airway resistance. Pressure-controlled ventilation provides a more even distribution of gas within the lungs and may be beneficial in patients with acute lung injury or ARDS. However, tidal volume is not guaranteed and must be closely monitored.", "Understanding the difference between these two approaches is fundamental to ventilator management. The respiratory therapist must match the ventilation mode to the patient's clinical condition, respiratory mechanics, and treatment goals. Monitor both airway pressures and delivered tidal volumes regardless of the mode selected."] },
      { heading: "Common Ventilation Modes and Clinical Applications", paragraphs: ["Assist-Control (AC) ventilation delivers a set tidal volume or pressure with every breath, whether initiated by the patient or the ventilator. The ventilator guarantees a minimum respiratory rate but allows the patient to trigger additional breaths. AC is commonly used for patients requiring full ventilatory support, such as those with respiratory failure or post-operative patients.", "Synchronized Intermittent Mandatory Ventilation (SIMV) delivers mandatory breaths synchronized with the patient's respiratory effort, while allowing spontaneous breaths between mandatory breaths. Spontaneous breaths can be augmented with pressure support. SIMV is sometimes used for weaning but has fallen out of favor compared to spontaneous breathing trials.", "Pressure Support Ventilation (PSV) augments the patient's spontaneous breaths with a set level of inspiratory pressure. The patient controls the respiratory rate, inspiratory time, and tidal volume. PSV is used for patients with adequate respiratory drive who need assistance overcoming airway resistance and the work of breathing associated with the endotracheal tube. NurseNest offers ventilator mode practice questions and respiratory therapy clinical scenario flashcards."], callout: "PEEP (Positive End-Expiratory Pressure) is not a ventilation mode but a setting applied in addition to the selected mode. PEEP maintains alveolar recruitment at end-expiration and improves oxygenation. Typical starting PEEP is 5 cmH2O." },
    ]},
    { title: "Respiratory Therapy Career Guide: From Student to Specialist", slug: "respiratory-therapy-career-guide-student-specialist", keyword: "respiratory therapy career", seoTitle: "Respiratory Therapy Career Guide | Student to Specialist", seoDesc: "Explore respiratory therapy career paths from entry-level to specialist. Covers RRT certification, specializations, work settings, and advancement opportunities.", sections: [
      { heading: "Becoming a Registered Respiratory Therapist", paragraphs: ["The path to becoming a Registered Respiratory Therapist (RRT) begins with completing an accredited respiratory therapy education program. Associate degree programs (2 years) provide entry-level preparation, while bachelor's degree programs (4 years) offer broader education including research methods and leadership. The Commission on Accreditation for Respiratory Care (CoARC) accredits respiratory therapy programs.", "After graduation, you must pass the Therapist Multiple-Choice (TMC) examination administered by the National Board for Respiratory Care (NBRC). The TMC exam has two scoring thresholds: the lower threshold earns the Certified Respiratory Therapist (CRT) credential, while the higher threshold earns eligibility for the Clinical Simulation Exam (CSE). Passing the CSE earns the Registered Respiratory Therapist (RRT) credential.", "The RRT is considered the standard credential for respiratory therapy practice. Most employers prefer or require the RRT credential, and some states require it for licensure. Study resources for the TMC and CSE include review courses, practice exams, and clinical simulation practice. NurseNest offers respiratory therapy exam preparation resources and clinical practice flashcards."] },
      { heading: "Specialization and Career Advancement", paragraphs: ["Respiratory therapy specializations include neonatal and pediatric respiratory care, adult critical care, pulmonary function testing, sleep medicine, pulmonary rehabilitation, and home care. Each specialization offers unique clinical challenges and professional growth opportunities. The NBRC offers specialty credentials including the Neonatal/Pediatric Specialist (NPS) and the Adult Critical Care Specialist (ACCS).", "Career advancement options include lead therapist, department supervisor, director of respiratory services, clinical educator, and sales representative for respiratory equipment companies. A bachelor's or master's degree opens doors to management and education positions. Some respiratory therapists pursue additional education to become physician assistants, perfusionists, or anesthesiologist assistants.", "Stay current with evolving respiratory care practices through continuing education, professional conferences, and membership in professional organizations such as the American Association for Respiratory Care (AARC). The respiratory therapy profession continues to evolve with advances in technology, pharmacology, and evidence-based practice."] },
    ]},
    { title: "Oxygen Therapy Devices and Clinical Applications for RT Students", slug: "oxygen-therapy-devices-clinical-applications-rt", keyword: "oxygen therapy devices respiratory therapy", seoTitle: "Oxygen Therapy Devices for RT Students | Clinical Guide", seoDesc: "Learn oxygen therapy devices and clinical applications for respiratory therapy students. Covers low-flow, high-flow, and reservoir systems with FiO2 ranges and indications.", sections: [
      { heading: "Low-Flow Oxygen Delivery Systems", paragraphs: ["Low-flow oxygen delivery systems provide supplemental oxygen at flow rates that do not meet the patient's total inspiratory demand. The patient entrains room air to supplement the delivered oxygen, resulting in a variable FiO2 that depends on the flow rate and the patient's breathing pattern. Low-flow devices include the nasal cannula, simple face mask, partial rebreather mask, and non-rebreather mask.", "The nasal cannula delivers 1 to 6 liters per minute (LPM), providing an estimated FiO2 of 24% to 44%. Each liter increase adds approximately 4% FiO2. The nasal cannula is well-tolerated, allows the patient to eat and speak, and is appropriate for patients requiring low to moderate supplemental oxygen. Flows above 6 LPM are generally not recommended as they cause nasal drying and discomfort without significantly increasing FiO2.", "The simple face mask delivers 5 to 10 LPM, providing approximately 35% to 55% FiO2. The minimum flow rate of 5 LPM is necessary to flush exhaled CO2 from the mask and prevent rebreathing. The non-rebreather mask delivers the highest FiO2 among low-flow devices (60% to 80% at 10 to 15 LPM) and is used for acute hypoxemic respiratory failure when a high FiO2 is needed urgently."] },
      { heading: "High-Flow Oxygen and Specialized Devices", paragraphs: ["High-flow nasal cannula (HFNC) therapy delivers heated, humidified oxygen at flow rates up to 60 LPM through large-bore nasal prongs. HFNC provides a more precise FiO2 (21% to 100%), generates low levels of positive airway pressure, reduces anatomical dead space, and improves mucociliary clearance. Clinical indications include acute hypoxemic respiratory failure, post-extubation support, and as an alternative to non-invasive ventilation in selected patients.", "Venturi masks (air-entrainment masks) are the only devices that deliver a precise, fixed FiO2 regardless of the patient's breathing pattern. Color-coded adapters set the entrainment ratio, delivering FiO2 values of 24%, 28%, 31%, 35%, 40%, or 50%. Venturi masks are particularly useful for patients with COPD who require a specific, controlled FiO2 to prevent suppression of the hypoxic ventilatory drive.", "Aerosol therapy devices deliver oxygen with large-volume nebulizers or heated humidifiers, providing 28% to 100% FiO2 with high humidity. These devices are used post-extubation, for patients with bypassed upper airways (tracheostomy), and for patients requiring high humidity to mobilize secretions. NurseNest offers oxygen therapy device practice questions and clinical scenario flashcards for respiratory therapy students."], callout: "For COPD patients with chronic CO2 retention, target SpO2 of 88-92% rather than the standard 94-98%. Excessive oxygen supplementation can suppress the hypoxic ventilatory drive and worsen hypercapnia." },
    ]},
    { title: "Pulmonary Function Testing: What RT Students Need to Know", slug: "pulmonary-function-testing-rt-students", keyword: "pulmonary function testing respiratory therapy", seoTitle: "Pulmonary Function Testing for RT Students | Guide", seoDesc: "Master pulmonary function testing as a respiratory therapy student. Covers spirometry, lung volumes, DLCO, and interpretation of obstructive vs restrictive patterns.", sections: [
      { heading: "Spirometry Fundamentals", paragraphs: ["Spirometry is the most commonly performed pulmonary function test and measures the volume and flow of air during forced breathing maneuvers. The key measurements include Forced Vital Capacity (FVC), which is the total volume of air exhaled during a maximal forced expiration, and Forced Expiratory Volume in 1 second (FEV1), which is the volume of air exhaled in the first second of the FVC maneuver. The FEV1/FVC ratio is the primary metric for distinguishing obstructive from restrictive lung disease.", "An FEV1/FVC ratio below 0.70 (or below the lower limit of normal) indicates an obstructive pattern, seen in conditions such as asthma, COPD, and bronchiectasis. In obstruction, airflow limitation causes a disproportionate reduction in FEV1 compared to FVC. A reduced FVC with a normal or elevated FEV1/FVC ratio suggests a restrictive pattern, seen in pulmonary fibrosis, chest wall deformities, and neuromuscular disease.", "Quality spirometry requires proper patient coaching, technique, and quality control. The patient must take a maximal inspiration and then blast the air out as hard and fast as possible for at least 6 seconds. The ATS/ERS criteria require at least 3 acceptable maneuvers with the two best FVC and FEV1 values within 150 mL of each other. Patient effort and cooperation are essential for valid results."] },
      { heading: "Lung Volumes and Diffusion Capacity", paragraphs: ["Complete pulmonary function testing includes measurement of static lung volumes using body plethysmography or gas dilution techniques. Total Lung Capacity (TLC), Functional Residual Capacity (FRC), and Residual Volume (RV) cannot be measured by spirometry alone because they include gas that remains in the lungs after maximal exhalation.", "In obstructive lung disease, air trapping causes elevated RV and FRC, which may increase TLC. In restrictive disease, TLC is reduced (below 80% of predicted). The RV/TLC ratio reflects the proportion of air trapped in the lungs after maximal exhalation; an elevated ratio (above 35%) indicates significant air trapping.", "Diffusion capacity for carbon monoxide (DLCO) measures the lungs' ability to transfer gas from the alveoli to the pulmonary capillary blood. A reduced DLCO can indicate emphysema, interstitial lung disease, pulmonary vascular disease, or anemia. An elevated DLCO may be seen in conditions with increased pulmonary blood flow such as polycythemia, left-to-right cardiac shunts, or exercise. NurseNest offers PFT interpretation practice questions and respiratory physiology flashcards for RT students."] },
    ]},
    { title: "How to Prepare for the TMC Exam: Respiratory Therapy Board Review", slug: "prepare-tmc-exam-respiratory-therapy-board-review", keyword: "TMC exam preparation respiratory therapy", seoTitle: "TMC Exam Prep for RT Students | Board Review Guide", seoDesc: "Prepare for the TMC respiratory therapy board exam with this comprehensive guide. Study strategies, content review, practice question tips, and test-day advice.", sections: [
      { heading: "TMC Exam Structure and Content", paragraphs: ["The Therapist Multiple-Choice (TMC) examination is the entry-level board exam for respiratory therapists administered by the National Board for Respiratory Care (NBRC). The exam consists of 160 questions with a 3-hour time limit. Of these 160 questions, 140 are scored and 20 are pilot questions. The exam covers three major content areas: patient data evaluation and recommendations, troubleshooting and quality improvement, and initiation and modification of therapeutic procedures.", "The TMC exam uses two scoring thresholds. Scoring at the lower threshold (CRT cut score) earns the Certified Respiratory Therapist credential. Scoring at the higher threshold earns eligibility to sit for the Clinical Simulation Exam (CSE), which, when passed, earns the Registered Respiratory Therapist (RRT) credential. Most respiratory therapy students aim for the RRT credential.", "Content distribution includes approximately 16% on patient data evaluation, 10% on equipment troubleshooting and quality control, and 74% on therapeutic procedures and patient management. Understanding this distribution helps you prioritize your study time effectively."] },
      { heading: "Study Strategies for Success", paragraphs: ["Begin your TMC exam preparation at least 8 to 12 weeks before your exam date. Use a comprehensive board review textbook such as Sills, Persing, or Ketai as your primary study resource. Supplement with practice questions from NBRC-approved question banks. The NBRC offers a Self-Assessment Examination (SAE) that closely mirrors the actual TMC exam format and content.", "Focus on clinical decision-making rather than rote memorization. TMC questions present clinical scenarios that require you to interpret patient data, select appropriate interventions, and modify therapy based on patient response. Practice interpreting ABGs, chest X-rays, pulmonary function tests, and hemodynamic data in the context of clinical scenarios.", "Create a study schedule that covers all content areas systematically. Allocate more time to areas where you feel less confident. Use active study methods: teach concepts to a study partner, create flashcards for high-yield topics, and complete timed practice exams under test conditions. After each practice exam, review every question regardless of whether you answered it correctly. NurseNest offers TMC exam practice questions, respiratory therapy flashcards, and clinical scenario exercises."] },
    ]},
  ];

  for (const p of rtPosts) {
    posts.push(createPost("respiratory-therapy", p.title, p.slug, p.sections[0].paragraphs[0].substring(0, 200) + "...", p.keyword, p.seoTitle, p.seoDesc,
      ["respiratory-therapy", "rrt", "tmc", "allied-health"], [p.keyword, "respiratory therapy", "rrt exam"],
      p.sections));
  }

  // ===== PARAMEDIC/EMS (6 posts) =====
  const paramedicPosts = [
    { t: "How to Pass the NREMT Exam: Paramedic Study Guide", s: "how-to-pass-nremt-exam-paramedic-study-guide", k: "pass NREMT exam paramedic" },
    { t: "12-Lead ECG Interpretation for Paramedic Students", s: "12-lead-ecg-interpretation-paramedic-students", k: "12-lead ECG paramedic" },
    { t: "Trauma Assessment and Management for EMS Providers", s: "trauma-assessment-management-ems-providers", k: "trauma assessment EMS" },
    { t: "Pharmacology Essentials for Paramedics: Field Drug Guide", s: "pharmacology-essentials-paramedics-field-drug-guide", k: "paramedic pharmacology" },
    { t: "Pediatric Emergencies in Prehospital Care: Paramedic Guide", s: "pediatric-emergencies-prehospital-care-paramedic", k: "pediatric emergencies paramedic" },
    { t: "Airway Management Techniques for Paramedic Students", s: "airway-management-techniques-paramedic-students", k: "airway management paramedic" },
  ];

  const paramedicSections: Record<string, Array<{ heading: string; paragraphs: string[]; callout?: string; list?: string[] }>> = {
    "how-to-pass-nremt-exam-paramedic-study-guide": [
      { heading: "Understanding the NREMT Paramedic Exam", paragraphs: ["The National Registry of Emergency Medical Technicians (NREMT) paramedic cognitive exam is a computer-adaptive test (CAT) that assesses your readiness for entry-level paramedic practice. The exam presents between 80 and 150 questions, with the computer adjusting question difficulty based on your performance. The exam covers five content areas: airway, respiration, and ventilation; cardiology and resuscitation; trauma; medical and obstetrics/gynecology; and EMS operations.", "Unlike a traditional exam where you need to answer a certain percentage correctly, the CAT format determines your competency level by analyzing your pattern of correct and incorrect answers at various difficulty levels. The exam ends when the computer has sufficient confidence in your ability level, either above or below the passing standard.", "The NREMT also requires a psychomotor skills examination that tests your ability to perform critical paramedic skills in simulated patient scenarios. Skills stations typically include patient assessment (trauma and medical), cardiac management (static and dynamic), oral station, and integrated skills such as IV therapy and ventilatory management."], callout: "The NREMT uses the CAT format, which means receiving difficult questions is a good sign. If you are consistently answering questions above the passing standard, you will pass even if you feel uncertain about many answers." },
      { heading: "Content Review and Study Strategies", paragraphs: ["Cardiology and resuscitation is the largest content area on the paramedic exam. Focus on ECG rhythm interpretation, ACLS algorithms, pharmacology of cardiac medications, and clinical decision-making in cardiac emergencies. Be able to interpret 12-lead ECGs, identify STEMI patterns, and apply appropriate field treatment protocols.", "Airway management questions test your knowledge of airway anatomy, oxygenation assessment, bag-valve-mask ventilation, endotracheal intubation, supraglottic airway devices, rapid sequence intubation medications, and troubleshooting ventilation problems. Practice making clinical decisions about when to escalate airway interventions.", "Trauma content covers mechanism of injury assessment, primary and secondary surveys, hemorrhage control, spinal motion restriction, chest trauma management, abdominal trauma assessment, and traumatic brain injury management. Understanding the physiology of traumatic shock and knowing when to prioritize transport over field treatment is critical. NurseNest offers NREMT-style practice questions, paramedic pharmacology flashcards, and ECG interpretation exercises."] },
    ],
    "12-lead-ecg-interpretation-paramedic-students": [
      { heading: "Systematic 12-Lead ECG Analysis", paragraphs: ["Twelve-lead ECG interpretation is an essential paramedic skill that directly impacts patient care in the field. A systematic approach ensures you do not miss critical findings. Begin by assessing rate and rhythm, then evaluate the P waves, PR interval, QRS complex, ST segment, and T waves. Finally, look at the overall pattern across all 12 leads.", "The 12-lead ECG views the heart from 12 different angles using 10 electrodes. Limb leads (I, II, III, aVR, aVL, aVF) view the heart in the frontal plane. Precordial leads (V1 through V6) view the heart in the horizontal plane. Understanding which leads correspond to which regions of the heart is critical for localizing myocardial infarction.", "When analyzing ST segment changes, compare the ST segment to the TP baseline. ST elevation greater than 1 mm in two or more contiguous leads is the hallmark of STEMI. Contiguous leads are anatomically adjacent: inferior leads (II, III, aVF), lateral leads (I, aVL, V5, V6), anterior leads (V1 through V4), and septal leads (V1, V2)."], callout: "Always obtain a right-sided 12-lead (V4R) when you identify an inferior STEMI (ST elevation in II, III, aVF). Right ventricular infarction changes your treatment approach: avoid nitroglycerin and prioritize fluid resuscitation." },
      { heading: "STEMI Recognition and Field Treatment", paragraphs: ["Rapid STEMI recognition in the prehospital setting directly impacts patient outcomes. Time from symptom onset to reperfusion is the critical metric: every minute of delay increases myocardial damage. As a paramedic, your ability to quickly interpret the 12-lead ECG and activate the cardiac catheterization lab while en route can save significant amounts of myocardium.", "Field treatment for STEMI follows established protocols: aspirin (324 mg chewed), IV access, 12-lead ECG acquisition and transmission, pain management (fentanyl or morphine per protocol), nitroglycerin (unless contraindicated by RV involvement or recent PDE5 inhibitor use), and transport to the nearest PCI-capable facility. Continuously monitor the rhythm for dysrhythmias, particularly ventricular fibrillation.", "Document the time of symptom onset, time of 12-lead acquisition, time of hospital notification, and time of patient arrival. This timeline is critical for determining the patient's eligibility for percutaneous coronary intervention (PCI) or fibrinolytic therapy. NurseNest offers 12-lead ECG interpretation practice, rhythm recognition flashcards, and ACLS scenario exercises for paramedic students."] },
    ],
    "trauma-assessment-management-ems-providers": [
      { heading: "Primary Survey and Rapid Trauma Assessment", paragraphs: ["The primary survey follows the ABCDE approach: Airway with cervical spine protection, Breathing and ventilation, Circulation with hemorrhage control, Disability (neurological status), and Exposure. The goal of the primary survey is to identify and treat immediately life-threatening conditions. Complete the primary survey within 60 to 90 seconds for critically injured patients.", "Scene safety assessment precedes all patient care activities. Evaluate the mechanism of injury to predict potential injuries. High-energy mechanisms such as vehicle ejection, falls greater than 20 feet, and pedestrian struck by vehicle at speed suggest the potential for severe multisystem trauma and warrant transport to a trauma center.", "The Glasgow Coma Scale (GCS) provides a standardized assessment of neurological status using three components: eye opening (1-4), verbal response (1-5), and motor response (1-6). A GCS of 8 or less indicates severe head injury and the need for definitive airway management. Document the GCS at initial assessment and at regular intervals to identify neurological deterioration."] },
      { heading: "Hemorrhage Control and Shock Management", paragraphs: ["Uncontrolled hemorrhage is the leading preventable cause of trauma death. Apply direct pressure to external bleeding first. For extremity hemorrhage not controlled by direct pressure, apply a commercial tourniquet proximal to the wound and note the time of application. Do not remove a tourniquet once applied in the field.", "Recognize the classes of hemorrhagic shock based on estimated blood loss and clinical signs. Class I (up to 750 mL) may present with minimal symptoms. Class II (750 to 1500 mL) produces tachycardia and narrowed pulse pressure. Class III (1500 to 2000 mL) causes significant tachycardia, tachypnea, and altered mental status. Class IV (greater than 2000 mL) is immediately life-threatening with severely altered consciousness and hypotension.", "Fluid resuscitation in trauma follows permissive hypotension principles for penetrating trauma: target a systolic blood pressure of 80 to 90 mmHg until surgical hemorrhage control is achieved. Excessive fluid administration before hemorrhage control dilutes clotting factors and can worsen bleeding. NurseNest offers trauma assessment practice questions, ITLS study resources, and EMS clinical scenario flashcards."], callout: "In trauma patients, treat the cause of shock, not just the vital signs. A normal blood pressure does not rule out significant hemorrhage, especially in young, healthy patients who compensate effectively until sudden decompensation." },
    ],
    "pharmacology-essentials-paramedics-field-drug-guide": [
      { heading: "Cardiac Emergency Medications", paragraphs: ["Epinephrine is the most important cardiac arrest medication. In cardiac arrest (VF/pVT, PEA, asystole), give 1 mg (1:10,000 or 0.1 mg/mL) IV/IO every 3 to 5 minutes. In anaphylaxis, give 0.3 to 0.5 mg (1:1,000 or 1 mg/mL) IM in the lateral thigh. Never give 1:1,000 concentration IV. The mechanism of action includes alpha-1 mediated vasoconstriction and beta-1 mediated chronotropy and inotropy.", "Amiodarone is the first-line antiarrhythmic for refractory VF/pVT. Give 300 mg IV/IO push, followed by 150 mg for a second dose if needed. For stable wide complex tachycardia, infuse 150 mg over 10 minutes. Amiodarone has a long half-life and can cause hypotension. Have IV fluid bolus ready when administering.", "Adenosine is the first-line treatment for stable narrow complex SVT. Give 6 mg rapid IV push followed by a 20 mL normal saline flush. If ineffective, give 12 mg rapid IV push. Adenosine must be given rapidly (less than 1 to 2 seconds) through a large proximal vein because its half-life is less than 10 seconds. Warn the patient they may experience brief chest discomfort and a sense of impending doom."], callout: "Always verify the concentration of epinephrine before administration. The 1:1,000 concentration (1 mg/mL) is for IM injection in anaphylaxis. The 1:10,000 concentration (0.1 mg/mL) is for IV use in cardiac arrest. Confusing these concentrations can be fatal." },
      { heading: "Pain Management and Sedation in the Field", paragraphs: ["Pain management is a core paramedic responsibility and should be addressed in all patient encounters where pain is present. Fentanyl is the most commonly used prehospital analgesic due to its rapid onset (1 to 2 minutes IV, 5 to 10 minutes intranasal), hemodynamic stability, and predictable dose-response relationship. Typical adult dose is 1 to 2 mcg/kg IV/IO or 1 to 2 mcg/kg intranasal.", "Ketamine is increasingly used in EMS for pain management, procedural sedation, and excited delirium management. For analgesia, give 0.1 to 0.3 mg/kg IV over 1 minute or 0.5 to 1 mg/kg IM. For procedural sedation, give 1 to 2 mg/kg IV or 4 to 5 mg/kg IM. Ketamine maintains airway reflexes and hemodynamic stability, making it valuable for trauma patients.", "Midazolam is a benzodiazepine used for seizure management, procedural sedation, and anxiety. For seizures, give 0.1 mg/kg IV (max 5 mg) or 0.2 mg/kg IM/IN (max 10 mg). Monitor respiratory status closely after benzodiazepine administration. Flumazenil is the reversal agent but is rarely used in the field due to seizure risk. NurseNest offers paramedic pharmacology flashcards, drug dose calculation exercises, and clinical protocol practice questions."] },
    ],
    "pediatric-emergencies-prehospital-care-paramedic": [
      { heading: "Pediatric Assessment Approach", paragraphs: ["Pediatric emergencies require a different assessment approach than adult patients. The Pediatric Assessment Triangle (PAT) provides a rapid, across-the-room assessment of appearance, work of breathing, and circulation to skin. This 30-second assessment helps you categorize the severity of illness and determine the urgency of intervention before you ever touch the child.", "Appearance assessment evaluates muscle tone, interactiveness, consolability, look/gaze, and speech/cry (TICLS mnemonic). A child who is alert, interactive, and consolable with a strong cry has a reassuring appearance. Altered appearance, including lethargy, poor eye contact, and weak cry, indicates a potentially serious condition.", "Vital sign ranges vary significantly by age. Know the normal ranges for heart rate, respiratory rate, and blood pressure for neonates, infants, toddlers, school-age children, and adolescents. Bradycardia in a pediatric patient is an ominous sign that often precedes cardiac arrest and requires immediate intervention."], callout: "In pediatric patients, cardiac arrest is most commonly caused by respiratory failure, not primary cardiac events. Maintaining the airway and ensuring adequate oxygenation and ventilation is the most important intervention you can provide." },
      { heading: "Common Pediatric Emergencies", paragraphs: ["Respiratory emergencies are the most common reason for pediatric EMS activation. Croup (laryngotracheobronchitis) presents with a barking cough, inspiratory stridor, and hoarse voice. Mild croup can be managed with cool mist and positioning. Moderate to severe croup with stridor at rest warrants nebulized epinephrine (0.5 mL/kg of 2.25% racemic epinephrine, max 0.5 mL, or 5 mL of 1:1,000 standard epinephrine).", "Febrile seizures are the most common seizure type in children aged 6 months to 5 years. Simple febrile seizures are brief (less than 15 minutes), generalized, and occur once in a 24-hour period. Complex febrile seizures are prolonged, focal, or recurrent. Management includes airway protection, fever reduction, and reassurance of the caregivers. Active seizures are treated with benzodiazepines per protocol.", "Pediatric medication dosing is weight-based, making accurate weight estimation critical. Use a length-based resuscitation tape (Broselow tape) for rapid weight estimation when the child's weight is unknown. Verify every calculated dose before administration, as even small dosing errors can have significant consequences in pediatric patients. NurseNest offers pediatric emergency practice questions, dosing calculation exercises, and age-specific assessment flashcards for paramedic students."] },
    ],
    "airway-management-techniques-paramedic-students": [
      { heading: "Basic Airway Management", paragraphs: ["Airway management is the most critical skill in emergency medicine. The approach follows a stepwise progression from basic maneuvers to advanced interventions. Begin with positioning: the head-tilt chin-lift for non-trauma patients and the jaw-thrust maneuver for patients with suspected cervical spine injury. These maneuvers lift the tongue from the posterior pharynx and open the airway.", "Oropharyngeal airways (OPA) and nasopharyngeal airways (NPA) are adjuncts that help maintain airway patency. The OPA is sized from the corner of the mouth to the angle of the mandible and is used only in unconscious patients without a gag reflex. The NPA is sized from the nostril to the tragus of the ear and can be used in patients with an intact gag reflex. Lubricate the NPA with water-soluble lubricant before insertion.", "Bag-valve-mask (BVM) ventilation is a fundamental skill that requires practice to master. Use the C-E technique for mask seal: form a C with the thumb and index finger around the mask and an E with the remaining fingers along the mandible. Squeeze the bag to deliver approximately 600 mL of tidal volume over 1 second. Excessive volume or rate causes gastric insufflation and increases aspiration risk."] },
      { heading: "Advanced Airway Techniques", paragraphs: ["Endotracheal intubation provides definitive airway management with direct access for suctioning, medication delivery, and controlled ventilation. Preparation includes equipment check (MSOAP: mask, suction, oxygen, airway equipment, pharmacology), patient positioning, and pre-oxygenation with 100% oxygen for 3 to 5 minutes when possible.", "Video laryngoscopy has become the standard of care in many EMS systems due to improved first-pass success rates, especially in difficult airways. Whether using direct or video laryngoscopy, the procedure requires visualization of the vocal cords, passage of the endotracheal tube through the cords, and confirmation of placement using waveform capnography, auscultation, and chest rise.", "Supraglottic airway devices (King LT, i-gel, LMA) provide an alternative to endotracheal intubation when intubation is difficult or not within the provider's scope of practice. These devices are inserted blindly into the pharynx and provide a seal around the laryngeal inlet. While they do not provide the same level of airway protection as an endotracheal tube, they offer a rapid and reliable alternative for ventilation. NurseNest offers airway management practice questions, intubation technique flashcards, and clinical scenario exercises for paramedic students."], callout: "Waveform capnography is the gold standard for confirming endotracheal tube placement and must be used after every intubation. A positive waveform confirms tracheal placement. Absence of a waveform strongly suggests esophageal intubation and requires immediate reintubation." },
    ],
  };

  for (const p of paramedicPosts) {
    const secs = paramedicSections[p.s] || [
      { heading: "Overview", paragraphs: [`This guide covers essential knowledge about ${p.t.toLowerCase()} for paramedic and EMS students preparing for certification exams and clinical practice.`] }
    ];
    posts.push(createPost("paramedic-ems", p.t, p.s, secs[0].paragraphs[0].substring(0, 200) + "...", p.k,
      `${p.t} | Study Guide`, `Complete guide covering ${p.k}. Evidence-based study resources for paramedic students preparing for the NREMT exam and clinical practice.`,
      ["paramedic", "ems", "nremt", "allied-health"], [p.k, "paramedic", "ems certification"],
      secs));
  }

  // ===== MLT (6 posts) =====
  const mltPosts = [
    { t: "Tips for New Medical Laboratory Technologists: First 90 Days", s: "tips-new-medical-laboratory-technologists-first-90-days", k: "new medical laboratory technologist tips", heading1: "Navigating Your First Month in the Lab", p1: "Starting your career as a Medical Laboratory Technologist (MLT) can be both exciting and overwhelming. The clinical laboratory environment is fast-paced, detail-oriented, and critical to patient care. Your first 90 days are about building competence, confidence, and relationships with your laboratory team. This guide provides practical tips for new MLT graduates transitioning from student to professional.", p2: "During your first few weeks, focus on learning your laboratory's standard operating procedures (SOPs) for each instrument and test methodology. Every lab has unique workflows, quality control protocols, and result reporting procedures, even if the underlying methodology is familiar from your training. Ask questions freely during orientation and take notes on procedures that differ from what you learned in school.", heading2: "Building Technical Competence", p3: "Develop proficiency with your lab's analyzers and instrumentation. Spend extra time understanding the principles behind each test: immunoassay, spectrophotometry, flow cytometry, molecular methods, and manual techniques. When you understand the principle, troubleshooting instrument problems becomes logical rather than mysterious.", p4: "Quality control is the backbone of reliable laboratory results. Understand the Westgard rules used in your laboratory, know how to interpret Levey-Jennings charts, and learn the corrective actions required when QC is out of range. Never report patient results when quality control has not been verified. NurseNest offers MLT practice questions, laboratory technique flashcards, and quality control study resources for new laboratory professionals." },
    { t: "ASCP Board Exam Preparation Guide for MLT Students", s: "ascp-board-exam-preparation-guide-mlt-students", k: "ASCP board exam MLT", heading1: "Understanding the ASCP MLT Exam", p1: "The American Society for Clinical Pathology (ASCP) Board of Certification examination is the primary certification exam for Medical Laboratory Technologists in the United States. The MLS (Medical Laboratory Scientist) exam consists of 100 questions with a 2.5-hour time limit. The exam covers all major laboratory disciplines: chemistry, hematology, microbiology, blood banking/immunohematology, urinalysis/body fluids, and immunology.", p2: "The exam uses a computer-based format with multiple-choice and multiple-select questions. Some questions include images such as microscopic slides, graphs, and instrument readouts that you must interpret. The passing score is set using a criterion-referenced method, meaning you must demonstrate competency across all content areas rather than simply achieving a total percentage.", heading2: "Study Strategies by Discipline", p3: "Clinical Chemistry is typically the largest content area. Focus on enzyme markers and their clinical significance, electrolyte imbalances, renal function tests, liver function tests, thyroid function, and cardiac biomarkers. Understand methodology principles including photometry, ion-selective electrodes, and immunoassay techniques.", p4: "Hematology questions test your ability to identify cells on peripheral blood smears, interpret CBC results, classify anemias, and recognize hematologic malignancies. Practice identifying normal and abnormal cells including blast forms, atypical lymphocytes, schistocytes, target cells, and sickle cells. NurseNest offers ASCP practice exams, laboratory discipline flashcards, and microscopy image study resources for MLT students." },
    { t: "Blood Banking Essentials for Laboratory Technologists", s: "blood-banking-essentials-laboratory-technologists", k: "blood banking MLT", heading1: "ABO and Rh Blood Group Systems", p1: "Blood banking (immunohematology) is a critical laboratory discipline that directly impacts patient safety. The ABO blood group system is the most clinically significant because ABO antibodies are naturally occurring IgM antibodies that cause immediate, complement-mediated hemolytic transfusion reactions. Understanding ABO typing, antibody screening, and crossmatching is essential for every laboratory technologist.", p2: "ABO typing requires both forward typing (testing patient red cells with known antisera) and reverse typing (testing patient serum/plasma with known reagent red cells). The forward and reverse types must agree before the blood type is reported. Discrepancies between forward and reverse typing must be resolved before issuing any blood products.", heading2: "Antibody Identification and Crossmatching", p3: "The antibody screen detects unexpected antibodies in the patient's serum using a panel of reagent red cells with known antigen profiles. A positive antibody screen requires identification of the specific antibody using a panel of 8 to 16 cells with known antigen phenotypes. Rule out antibodies based on cells that do not react, and confirm identification based on cells that do react.", p4: "Crossmatching ensures compatibility between donor red cells and patient serum. The electronic crossmatch compares ABO/Rh type records when no clinically significant antibodies have been detected. The serologic crossmatch includes an immediate spin phase (detects ABO incompatibility) and an AHG phase (detects IgG antibodies). NurseNest offers blood banking practice questions, antibody identification exercises, and transfusion medicine flashcards for MLT students." },
    { t: "Clinical Microbiology: Bacterial Identification for MLT Students", s: "clinical-microbiology-bacterial-identification-mlt", k: "bacterial identification MLT microbiology", heading1: "Systematic Bacterial Identification", p1: "Bacterial identification in the clinical microbiology laboratory follows a systematic approach beginning with Gram stain morphology and progressing through biochemical testing, automated identification systems, and molecular methods. The Gram stain is the single most important initial test: it categorizes bacteria as Gram-positive cocci, Gram-positive bacilli, Gram-negative cocci, or Gram-negative bacilli, immediately narrowing the differential.", p2: "Gram-positive cocci are further differentiated by catalase testing. Catalase-positive cocci are staphylococci, further identified by coagulase testing (Staphylococcus aureus is coagulase-positive). Catalase-negative cocci are streptococci and enterococci, differentiated by hemolysis patterns on blood agar, PYR testing, bile esculin testing, and NaCl tolerance.", heading2: "Gram-Negative Identification and Susceptibility", p3: "Gram-negative bacilli are a diverse group that includes Enterobacteriaceae (E. coli, Klebsiella, Proteus, Salmonella, Shigella), non-fermenters (Pseudomonas, Acinetobacter), and fastidious organisms (Haemophilus, Neisseria). Key differentiating tests include oxidase, indole, citrate, urease, triple sugar iron agar (TSI), and motility.", p4: "Antimicrobial susceptibility testing determines which antibiotics are effective against the isolated organism. Methods include disk diffusion (Kirby-Bauer), broth microdilution (MIC determination), and automated systems. Interpretation follows Clinical and Laboratory Standards Institute (CLSI) breakpoints. Understanding resistance mechanisms such as beta-lactamase production, ESBL, MRSA, and VRE is critical for accurate reporting. NurseNest offers microbiology identification practice, biochemical testing flashcards, and organism identification exercises for MLT students." },
    { t: "Hematology Case Studies: Peripheral Blood Smear Interpretation", s: "hematology-case-studies-peripheral-blood-smear-mlt", k: "peripheral blood smear interpretation MLT", heading1: "Systematic Blood Smear Evaluation", p1: "Peripheral blood smear review is one of the most important skills in clinical hematology. When automated CBC results trigger reflex review criteria (flagged results, abnormal cell populations, or critical values), the technologist must examine the blood smear to confirm, clarify, or correct the automated findings. Systematic evaluation ensures no abnormality is missed.", p2: "Evaluate the smear in three zones: the feathered edge for large cells and clumps, the body for overall cellularity and distribution, and the monolayer zone for detailed cell morphology. In the monolayer zone, red blood cells should barely touch without overlapping. Assess red cell morphology (size, shape, color, inclusions), white cell morphology and differential count, and platelet adequacy.", heading2: "Common Morphologic Abnormalities", p3: "Red cell morphology abnormalities provide important diagnostic clues. Microcytic hypochromic cells suggest iron deficiency anemia or thalassemia. Macrocytic cells suggest B12 or folate deficiency, liver disease, or myelodysplastic syndrome. Schistocytes (fragmented red cells) indicate microangiopathic hemolytic anemia (TTP, HUS, DIC). Target cells are seen in hemoglobin C disease, thalassemia, and liver disease.", p4: "White blood cell abnormalities include toxic granulation and Dohle bodies (infection/inflammation), hypersegmented neutrophils (megaloblastic anemia), atypical lymphocytes (viral infections, especially EBV), and blast cells (acute leukemia). Any blast cells identified on a peripheral smear require immediate physician notification and follow-up testing. NurseNest offers hematology case studies, blood smear image flashcards, and CBC interpretation practice questions for MLT students." },
    { t: "Quality Control in the Clinical Laboratory: Westgard Rules Explained", s: "quality-control-clinical-laboratory-westgard-rules", k: "Westgard rules quality control MLT", heading1: "Understanding Quality Control Principles", p1: "Quality control (QC) in the clinical laboratory ensures that analytical results are accurate and reliable before patient results are reported. QC involves running control materials with known values alongside patient samples and evaluating whether the results fall within acceptable ranges. The systematic application of statistical rules, known as Westgard rules, helps laboratory professionals detect errors and maintain analytical quality.", p2: "Control materials are run at two or three levels (normal, abnormal low, abnormal high) to assess accuracy across the measurement range. Results are plotted on Levey-Jennings charts with the mean value and standard deviation limits marked. These charts provide a visual representation of method performance over time and help identify trends and shifts before they affect patient results.", heading2: "Applying Westgard Rules", p3: "The six most commonly used Westgard rules are: 1-2s (warning rule, one control exceeds 2 SD), 1-3s (rejection rule, one control exceeds 3 SD), 2-2s (two consecutive controls exceed 2 SD in the same direction), R-4s (range rule, the difference between two controls exceeds 4 SD), 4-1s (four consecutive controls exceed 1 SD in the same direction), and 10x (ten consecutive controls on the same side of the mean).", p4: "Random errors are detected by rules like 1-3s and R-4s, while systematic errors are detected by rules like 2-2s, 4-1s, and 10x. When a Westgard rule violation occurs, do not report patient results. Troubleshoot by checking control material integrity, repeating the control, verifying reagent status, and performing calibration if needed. NurseNest offers quality control practice questions, Westgard rule flashcards, and QC troubleshooting exercises for MLT students." },
  ];

  for (const p of mltPosts) {
    posts.push(createPost("mlt", p.t, p.s, p.p1.substring(0, 200) + "...", p.k,
      `${p.t.substring(0, 55)} | Guide`, `${p.p1.substring(0, 150)}...`,
      ["mlt", "ascp", "laboratory", "allied-health"], [p.k, "medical laboratory", "mlt certification"],
      [
        { heading: p.heading1, paragraphs: [p.p1, p.p2] },
        { heading: p.heading2, paragraphs: [p.p3, p.p4] },
      ]
    ));
  }

  // ===== RADIOLOGY / MEDICAL IMAGING (6 posts) =====
  const radiologyPosts = [
    { t: "Radiography Positioning Guide: Essential Projections for Students", s: "radiography-positioning-guide-essential-projections", k: "radiography positioning guide", h1: "Upper Extremity Positioning", p1: "Radiographic positioning is the foundation of diagnostic imaging. Accurate positioning ensures optimal image quality, minimizes patient radiation dose, and reduces the need for repeat examinations. For upper extremity imaging, the standard projections include AP and lateral views as minimum requirements, with oblique views added as needed for specific clinical indications.", p2: "For hand radiographs, the standard series includes PA, PA oblique, and lateral projections. The PA projection is obtained with the hand flat on the image receptor, fingers slightly separated. The oblique is obtained by rotating the hand 45 degrees into a lateral oblique position. The lateral projection places the hand in a true lateral position with the thumb up.", h2: "Lower Extremity and Spine Positioning", p3: "Knee radiographs typically include AP and lateral projections with additional views as clinically indicated. The AP knee is obtained with the patient supine, knee extended, and the central ray directed 5 to 7 degrees cephalad to the tibial plateau. The lateral knee is obtained with the patient on their side, knee flexed 20 to 30 degrees, and the central ray directed to a point 1 inch distal to the medial epicondyle.", p4: "Spine positioning requires attention to proper technique factors, collimation, and shielding. Cervical spine series include AP, AP open mouth (odontoid), and lateral projections. For trauma patients, the cross-table lateral is obtained first without moving the patient. Thoracic and lumbar spine series include AP and lateral projections with technique adjustments for body habitus. NurseNest offers radiography positioning flashcards, anatomy review questions, and ARRT exam preparation resources for imaging students." },
    { t: "How to Pass the ARRT Exam: Radiography Student Guide", s: "how-to-pass-arrt-exam-radiography-student-guide", k: "pass ARRT exam radiography", h1: "Understanding the ARRT Exam Format", p1: "The American Registry of Radiologic Technologists (ARRT) certification exam in Radiography consists of 220 questions with a 3.5-hour time limit. Of these, 200 are scored and 20 are pilot questions. The exam covers five content areas: Image Production (30%), Procedures (27%), Patient Care and Education (20%), Radiation Protection and Equipment Operation (23%), and a smaller section on Quality Control.", p2: "The ARRT exam uses a linear-on-the-fly format, meaning questions are selected from a large item bank but the test is not computer-adaptive. All candidates receive questions of varying difficulty. The passing score is determined using a modified Angoff method and typically requires answering approximately 67-72% of scored questions correctly.", h2: "Study Strategies and Content Review", p3: "Image Production is the largest content area and covers technical factor selection (kVp, mAs, SID), image quality characteristics (contrast, spatial resolution, noise, distortion), digital image processing, and exposure indicator evaluation. Understand the relationship between technical factors and image quality: kVp controls contrast and penetration, mAs controls quantity and receptor exposure.", p4: "Patient Care and Education questions cover vital sign assessment, contrast media administration, patient communication, medical emergencies, and infection control. Know the signs and symptoms of contrast reactions (mild, moderate, and severe), emergency response protocols, and contraindications for contrast administration. NurseNest offers ARRT practice exams, positioning flashcards, and physics review resources for radiography students." },
    { t: "Radiation Protection Principles for Imaging Professionals", s: "radiation-protection-principles-imaging-professionals", k: "radiation protection radiography", h1: "ALARA Principle and Dose Optimization", p1: "Radiation protection is a fundamental responsibility for all imaging professionals. The ALARA principle (As Low As Reasonably Achievable) guides all radiation safety practices: use the minimum radiation dose necessary to produce a diagnostic quality image. This principle protects both patients and occupational workers from unnecessary radiation exposure.", p2: "Dose optimization involves selecting appropriate technical factors for each examination. The primary factors under the technologist's control include kVp, mAs, collimation, grid use, image receptor selection, and source-to-image distance (SID). Proper collimation to the area of interest is one of the most effective dose reduction techniques and also improves image quality by reducing scatter radiation.", h2: "Occupational Dose Monitoring and Shielding", p3: "Occupational dose monitoring is required for all radiation workers. Personal dosimeters (optically stimulated luminescence badges or thermoluminescent dosimeters) must be worn at collar level outside the lead apron during fluoroscopic procedures and at waist level for general radiography. Annual occupational dose limits are 50 mSv effective dose and 150 mSv to the lens of the eye.", p4: "Lead shielding protects patients from unnecessary radiation exposure. Gonadal shielding should be used when the gonads are within 5 cm of the primary beam and shielding will not obscure anatomy of interest. Lead aprons, thyroid shields, and lead gloves protect occupational workers during fluoroscopic procedures. Verify lead shielding integrity through annual fluoroscopic inspection. NurseNest offers radiation protection practice questions, dose calculation exercises, and ARRT exam preparation resources for imaging students." },
    { t: "CT Scan Basics: What Radiography Students Need to Know", s: "ct-scan-basics-radiography-students", k: "CT scan basics radiography", h1: "CT Physics and Image Formation", p1: "Computed Tomography (CT) uses an X-ray tube and detector array rotating around the patient to acquire cross-sectional images. The X-ray beam passes through the patient at multiple angles, and the detector measures the transmitted radiation. The computer uses mathematical algorithms (filtered back projection or iterative reconstruction) to create cross-sectional images from these measurements.", p2: "Key CT parameters include tube voltage (kVp), tube current-time product (mAs), slice thickness, pitch, and field of view. Higher kVp increases penetration and reduces noise but decreases contrast. Higher mAs reduces noise but increases patient dose. Slice thickness affects spatial resolution (thinner slices improve resolution) and noise (thinner slices increase noise). Pitch is the ratio of table movement per rotation to beam collimation.", h2: "CT Protocols and Contrast Administration", p3: "CT protocols are tailored to the clinical indication and body region. Standard protocols specify kVp, mAs (or reference mAs for dose modulation), slice thickness, reconstruction algorithm, and contrast parameters. Dose modulation techniques (automatic tube current modulation) adjust mAs based on patient size and anatomy, significantly reducing dose while maintaining image quality.", p4: "Iodinated contrast media is used in CT to enhance vascular structures, characterize lesions, and evaluate organ perfusion. Contraindications include severe contrast allergy and severe renal insufficiency. Risk factors for contrast-induced nephropathy include pre-existing renal disease, diabetes, dehydration, and concurrent nephrotoxic medications. Screening creatinine and eGFR are typically required before IV contrast administration. NurseNest offers CT physics practice questions, imaging protocol flashcards, and ARRT CT exam preparation resources for radiography students." },
    { t: "Digital Radiography: Image Quality and Exposure Indicators", s: "digital-radiography-image-quality-exposure-indicators", k: "digital radiography exposure indicators", h1: "Digital Image Characteristics", p1: "Digital radiography has replaced film-screen systems in most clinical settings. Understanding digital image characteristics is essential for producing optimal images and managing patient dose. Key image quality parameters in digital radiography include spatial resolution (determined by pixel size and matrix), contrast resolution (determined by bit depth and processing), noise (determined by exposure level and detector efficiency), and dynamic range.", p2: "Unlike film-screen systems, digital detectors have a wide dynamic range, meaning they can produce acceptable-looking images over a wide range of exposures. While this is advantageous for image visibility, it creates a risk of dose creep, where technologists may use higher-than-necessary exposures without obvious image degradation. Monitoring exposure indicators is essential to prevent this phenomenon.", h2: "Exposure Indicator Systems and Dose Management", p3: "The AAPM (American Association of Physicists in Medicine) standardized exposure indicator system uses three values: Exposure Index (EI), which indicates the exposure to the detector; Target Exposure Index (EIT), which is the ideal exposure for the examination; and Deviation Index (DI), which indicates how far the actual exposure deviates from the target. A DI of zero indicates optimal exposure, while positive values indicate overexposure and negative values indicate underexposure.", p4: "Aim for a DI within plus or minus 1 for routine examinations. Consistent overexposure (positive DI) means the patient is receiving unnecessary radiation. Consistent underexposure (negative DI) may result in noisy images that require repeat examination, ultimately increasing patient dose. Review your exposure indicators for every examination and adjust technique factors accordingly. NurseNest offers digital imaging practice questions, exposure indicator exercises, and ARRT exam preparation resources for radiography students." },
    { t: "MRI Safety for Radiologic Technologists: What You Need to Know", s: "mri-safety-radiologic-technologists", k: "MRI safety radiologic technologists", h1: "MRI Safety Zones and Screening", p1: "MRI safety is critical because the strong magnetic field, radiofrequency energy, and gradient fields can cause serious injury or death if safety protocols are not followed. The ACR (American College of Radiology) defines four safety zones: Zone I (general public access), Zone II (interface between public and MRI-controlled areas), Zone III (restricted access, controlled by MRI personnel), and Zone IV (the MRI scanner room itself, where the magnet is always on).", p2: "All patients, visitors, and personnel must be screened for MRI contraindications before entering Zone III. Absolute contraindications include certain cardiac pacemakers and defibrillators (non-MR conditional devices), metallic foreign bodies in the eyes, certain cochlear implants, and some metallic heart valves. Relative contraindications require case-by-case evaluation and may include some orthopedic implants, aneurysm clips, and metallic tattoos.", h2: "Projectile Hazards and Emergency Procedures", p3: "The projectile hazard is the most immediately dangerous risk in MRI. The static magnetic field of a clinical MRI scanner (typically 1.5T or 3T) exerts a strong attractive force on ferromagnetic objects. Items such as oxygen tanks, IV poles, wheelchairs, scissors, and pens can become lethal projectiles if brought into the scanner room. Every ferromagnetic object in Zone IV is a potential missile.", p4: "Emergency procedures in MRI include knowing the location and operation of the magnet quench button (which rapidly vents the cryogen to shut down the magnetic field), cardiac arrest response protocols specific to the MRI environment, and fire evacuation procedures. During a code in the MRI suite, the patient must be removed from Zone IV before standard resuscitation equipment can be used. NurseNest offers MRI safety practice questions, screening checklist resources, and ARRT MRI exam preparation materials for imaging professionals." },
  ];

  for (const p of radiologyPosts) {
    posts.push(createPost("radiology", p.t, p.s, p.p1.substring(0, 200) + "...", p.k,
      `${p.t.substring(0, 55)} | Guide`, `${p.p1.substring(0, 150)}...`,
      ["radiology", "arrt", "imaging", "allied-health"], [p.k, "radiography", "medical imaging"],
      [
        { heading: p.h1, paragraphs: [p.p1, p.p2] },
        { heading: p.h2, paragraphs: [p.p3, p.p4] },
      ]
    ));
  }

  // ===== OCCUPATIONAL THERAPY (6 posts) =====
  const otPosts = [
    { t: "How to Pass the NBCOT OTR Exam: Study Guide for OT Students", s: "how-to-pass-nbcot-otr-exam-study-guide", k: "pass NBCOT OTR exam", h1: "Understanding the NBCOT Exam Format", p1: "The National Board for Certification in Occupational Therapy (NBCOT) OTR exam is the certification exam required to practice as a registered occupational therapist. The exam consists of 200 questions with a 4-hour time limit. Questions are presented in multiple-choice and clinical simulation test (CST) formats. The exam covers four domains: evaluation and assessment, intervention management, competency and practice management, and outcomes and continuous improvement.", p2: "The CST format presents complex clinical scenarios where you must make sequential decisions about patient evaluation, intervention, and discharge planning. Each decision leads to different information and outcomes, testing your clinical reasoning across the therapeutic process. CST items carry more weight in the scoring algorithm, so performing well on these questions is important for passing.", h2: "Study Strategies for NBCOT Success", p3: "Begin studying 3 to 4 months before your exam date. Use a combination of content review, practice questions, and clinical reasoning exercises. The NBCOT offers a Self-Assessment Tool (SAT) that mirrors the exam format and provides valuable feedback on your readiness. Commercial review courses from AOTA, TherapyEd, and PassTheOT provide structured content review.", p4: "Focus on frames of reference and practice models: biomechanical, rehabilitative, sensorimotor, cognitive-behavioral, MOHO (Model of Human Occupation), and PEO (Person-Environment-Occupation). Understand when to apply each framework based on the patient population and clinical setting. Know adaptive equipment recommendations for ADL performance, splinting indications and precautions, and activity analysis principles. NurseNest offers NBCOT practice questions, OT clinical reasoning flashcards, and intervention planning study resources for OT students." },
    { t: "Occupational Therapy for Stroke Rehabilitation: Evidence-Based Approaches", s: "occupational-therapy-stroke-rehabilitation-approaches", k: "occupational therapy stroke rehabilitation", h1: "Assessment of Stroke Patients in OT", p1: "Occupational therapy plays a central role in stroke rehabilitation by helping patients regain independence in activities of daily living (ADLs), instrumental activities of daily living (IADLs), and meaningful occupations. The initial OT evaluation includes assessment of motor function, sensory function, cognition, perception, swallowing, and functional performance in self-care tasks.", p2: "Standardized assessments commonly used in stroke rehabilitation include the Functional Independence Measure (FIM), the Canadian Occupational Performance Measure (COPM), the Barthel Index, the Assessment of Motor and Process Skills (AMPS), and the National Institutes of Health Stroke Scale (NIHSS). These tools provide objective baseline data and measure progress over the course of rehabilitation.", h2: "Evidence-Based Intervention Strategies", p3: "Constraint-induced movement therapy (CIMT) is one of the most evidence-supported interventions for upper extremity motor recovery after stroke. CIMT involves constraining the unaffected limb while engaging the affected limb in intensive, repetitive, task-oriented practice. Modified CIMT protocols adapt the intensity and duration for patients who cannot tolerate the traditional protocol.", p4: "Task-specific training involves practicing the actual functional tasks the patient needs to perform rather than isolated exercises. Research shows that task-specific practice produces greater functional gains than impairment-based exercises alone. Combine task-specific training with environmental modification and adaptive equipment as needed. Adaptive equipment for stroke patients may include built-up utensils, rocker knives, sock aids, long-handled shoe horns, and tub benches. NurseNest offers stroke rehabilitation practice questions, intervention planning flashcards, and functional assessment study resources for OT students." },
    { t: "Sensory Integration Therapy: OT Approaches for Pediatric Patients", s: "sensory-integration-therapy-ot-pediatric", k: "sensory integration therapy occupational therapy", h1: "Understanding Sensory Processing", p1: "Sensory integration (SI) therapy, developed by A. Jean Ayres, is a clinical framework used by occupational therapists to assess and treat children with sensory processing difficulties. Sensory processing disorders affect how the nervous system receives, organizes, and responds to sensory input from the environment. Children with sensory processing difficulties may be over-responsive (hypersensitive), under-responsive (hyposensitive), or sensory-seeking.", p2: "The seven sensory systems include the five traditional senses (visual, auditory, tactile, olfactory, gustatory) plus the vestibular system (sense of movement and head position) and the proprioceptive system (sense of body position and joint movement). Dysfunction in any of these systems can affect a child's ability to participate in age-appropriate activities, learn in the classroom, and develop social skills.", h2: "SI Treatment Approaches and Activities", p3: "Ayres Sensory Integration (ASI) therapy is provided in a specially designed environment (the SI clinic or sensory gym) that offers opportunities for enhanced sensory experiences. The therapist creates a 'just-right challenge' by presenting activities that are achievable but require the child to organize and respond to sensory input at a slightly higher level than their current ability.", p4: "A sensory diet is a personalized plan of sensory activities provided throughout the day to help a child maintain optimal arousal and regulation. The sensory diet is developed by the OT and implemented by parents, teachers, and other caregivers. Activities may include deep pressure input (weighted blankets, compression clothing), vestibular input (swinging, rocking), proprioceptive input (heavy work activities, carrying, pushing), and oral motor activities (chewy foods, blowing activities). NurseNest offers sensory integration practice questions, pediatric OT intervention flashcards, and sensory processing assessment study resources." },
    { t: "Splinting in Occupational Therapy: Types, Indications, and Precautions", s: "splinting-occupational-therapy-types-indications", k: "splinting occupational therapy", h1: "Types of Splints and Clinical Indications", p1: "Splinting is a fundamental skill in occupational therapy used to protect healing structures, prevent deformity, correct existing deformity, improve function, and reduce pain. Occupational therapists fabricate custom splints using thermoplastic materials that are heated, molded to the patient's anatomy, and hardened to provide specific positioning and support.", p2: "Static splints maintain a fixed position and do not allow movement at the splinted joint. They are used for immobilization after fracture or surgery, protection of healing tendons, management of inflammation, and positioning to prevent contractures. Common static splints include the resting hand splint, wrist cock-up splint, thumb spica splint, and ulnar gutter splint.", h2: "Fabrication Principles and Precautions", p3: "Dynamic splints incorporate elastic components (springs, rubber bands, or elastic thread) that provide a sustained, low-load stretch to increase range of motion. They allow controlled movement in one direction while providing resistance or assistance. Dynamic splints are commonly used in tendon repair rehabilitation (dynamic extension splinting for flexor tendon repair, dynamic flexion splinting for extensor tendon repair).", p4: "Precautions during splint fabrication include avoiding pressure over bony prominences, ensuring proper fit to prevent skin breakdown, flaring edges to prevent pressure injuries, and verifying that the splint does not impede circulation. Check capillary refill, sensation, and skin color distal to the splint. Educate patients on wearing schedules, skin inspection, and signs of complications. NurseNest offers splinting technique flashcards, orthotic design practice questions, and hand therapy study resources for OT students." },
    { t: "Activity Analysis in Occupational Therapy: A Practical Guide", s: "activity-analysis-occupational-therapy-practical-guide", k: "activity analysis occupational therapy", h1: "Understanding Activity Analysis", p1: "Activity analysis is a core skill in occupational therapy that involves systematically breaking down an activity into its component parts to understand the demands it places on the individual. This analysis examines the physical, cognitive, psychosocial, sensory, and environmental demands of an activity, enabling the therapist to match activities to client abilities, modify activities to promote success, and select therapeutic activities that target specific performance components.", p2: "The components of activity analysis include: objects used and their properties, space demands, social demands, sequencing and timing, required body functions (motor, sensory, cognitive, emotional), and required body structures. For each component, the therapist evaluates the level of demand and determines whether the client can meet that demand or whether modification is needed.", h2: "Clinical Application of Activity Analysis", p3: "In practice, occupational therapists use activity analysis to grade activities from simple to complex, adapt activities to match client abilities, design therapeutic activities that challenge specific skills, and recommend assistive technology or environmental modifications. Grading involves systematically changing the demands of an activity to make it easier or more challenging.", p4: "For example, when analyzing the activity of meal preparation, consider the motor demands (standing tolerance, upper extremity reach, grasp strength, bilateral coordination), cognitive demands (sequencing, problem-solving, safety awareness, time management), and environmental demands (kitchen layout, counter height, access to utensils). Based on this analysis, the therapist may recommend adaptive equipment (rocker knife, jar opener), environmental modifications (seated workstation), or activity modifications (simplified recipes). NurseNest offers activity analysis practice questions, OT intervention planning flashcards, and therapeutic activity design study resources." },
    { t: "Mental Health Occupational Therapy: Groups, Interventions, and Recovery", s: "mental-health-occupational-therapy-groups-interventions", k: "mental health occupational therapy", h1: "OT's Role in Mental Health Recovery", p1: "Occupational therapy in mental health settings focuses on helping individuals with psychiatric conditions develop, maintain, or restore the skills needed for daily living, work, leisure, and social participation. The OT perspective emphasizes occupation as both a means and an end of therapy: engagement in meaningful activities promotes recovery, and recovery enables greater participation in meaningful activities.", p2: "Common mental health conditions addressed by occupational therapists include major depressive disorder, bipolar disorder, schizophrenia and other psychotic disorders, anxiety disorders, post-traumatic stress disorder, personality disorders, and substance use disorders. OT assessment in mental health evaluates occupational performance, roles, habits, routines, interests, values, and the impact of symptoms on daily functioning.", h2: "Group Interventions and Therapeutic Approaches", p3: "Group therapy is a primary modality in mental health OT. Common group types include psychoeducation groups (coping skills, stress management, medication management), task groups (cooking, art, horticulture), social skills groups, community reintegration groups, and wellness/recovery groups. Group protocols should be structured, time-limited, and outcome-oriented.", p4: "Evidence-based approaches in mental health OT include the Model of Human Occupation (MOHO), cognitive behavioral therapy (CBT) adapted for occupational performance, dialectical behavior therapy (DBT) skills, motivational interviewing techniques, and trauma-informed care principles. The recovery model emphasizes hope, self-determination, personal responsibility, and meaningful social roles as foundations for recovery from mental illness. NurseNest offers mental health OT practice questions, group protocol flashcards, and psychosocial intervention study resources for OT students." },
  ];

  for (const p of otPosts) {
    posts.push(createPost("occupational-therapy", p.t, p.s, p.p1.substring(0, 200) + "...", p.k,
      `${p.t.substring(0, 55)} | Guide`, `${p.p1.substring(0, 150)}...`,
      ["occupational-therapy", "nbcot", "rehabilitation", "allied-health"], [p.k, "occupational therapy", "OT certification"],
      [
        { heading: p.h1, paragraphs: [p.p1, p.p2] },
        { heading: p.h2, paragraphs: [p.p3, p.p4] },
      ]
    ));
  }

  // ===== SOCIAL WORK (6 posts) =====
  const swPosts = [
    { t: "How to Pass the ASWB Exam: Social Work Licensing Guide", s: "how-to-pass-aswb-exam-social-work-licensing-guide", k: "pass ASWB exam social work", h1: "Understanding the ASWB Exam Levels", p1: "The Association of Social Work Boards (ASWB) administers licensing examinations at four levels: Bachelors, Masters, Advanced Generalist, and Clinical. The exam level you take depends on your educational degree and the license type you are pursuing in your state. The Clinical exam is the most commonly taken and is required for independent clinical practice in most states.", p2: "All ASWB exams consist of 170 questions with a 4-hour time limit. Of these, 150 are scored and 20 are pilot questions. The exam covers four content areas at varying percentages depending on the exam level. For the Clinical exam, the content areas include Human Development, Diversity, and Behavior in the Environment (23%); Assessment and Intervention Planning (24%); Interventions with Clients/Client Systems (22%); and Professional Relationships, Values, and Ethics (31%).", h2: "Study Strategies for Success", p3: "Begin your ASWB preparation 2 to 3 months before your exam date. Use a comprehensive review resource such as the ASWB Practice Analysis or a commercial study guide (Dawn Apgar, TDC, Therapist Development Center). The ASWB offers a practice exam that closely mirrors the format and difficulty of the actual examination.", p4: "Focus on the NASW Code of Ethics, which forms the foundation for approximately one-third of exam questions. Know the ethical principles (service, social justice, dignity and worth, importance of human relationships, integrity, competence) and how to apply them in clinical scenarios. Understand confidentiality rules and exceptions, including mandatory reporting requirements, duty to warn (Tarasoff), and HIPAA provisions for mental health records. NurseNest offers ASWB practice questions, social work ethics flashcards, and clinical reasoning exercises for social work students." },
    { t: "Social Work Ethics and Boundaries: NASW Code of Ethics Guide", s: "social-work-ethics-boundaries-nasw-code-guide", k: "social work ethics NASW code", h1: "Core Ethical Principles", p1: "The NASW Code of Ethics provides the ethical foundation for social work practice in the United States. Understanding and applying these principles is essential for ethical practice and for passing the ASWB licensing examination. The Code establishes six core values: service, social justice, dignity and worth of the person, importance of human relationships, integrity, and competence.", p2: "Ethical dilemmas arise when two or more ethical principles conflict. For example, a client's right to self-determination may conflict with the social worker's obligation to protect the client or others from harm. Ethical decision-making models provide a framework for analyzing these conflicts: identify the ethical issue, review the Code of Ethics, consider laws and regulations, consult with supervisors and colleagues, consider all options, and make and document the decision.", h2: "Professional Boundaries and Dual Relationships", p3: "Professional boundaries define the limits of the therapeutic relationship and protect both the client and the social worker. The NASW Code prohibits dual relationships that create a risk of exploitation or harm to the client. Dual relationships occur when the social worker has another relationship with the client beyond the professional one: friend, employer, business partner, family connection, or romantic/sexual interest.", p4: "Managing boundaries in clinical practice requires ongoing self-awareness and supervision. Be alert to boundary crossings (minor deviations that may or may not be harmful) and boundary violations (serious breaches that exploit or harm the client). Document boundary-related decisions and consult with your supervisor when boundary issues arise. Common boundary challenges include gift-giving, self-disclosure, social media connections, and encounters outside the therapeutic setting. NurseNest offers social work ethics practice questions, boundary management flashcards, and ASWB exam preparation resources." },
    { t: "Crisis Intervention in Social Work: Assessment and Safety Planning", s: "crisis-intervention-social-work-assessment-safety-planning", k: "crisis intervention social work", h1: "Crisis Assessment Framework", p1: "Crisis intervention is a core competency in social work practice. A crisis occurs when an individual's usual coping mechanisms are overwhelmed by a stressful event, resulting in emotional distress, impaired functioning, and potential danger to self or others. Social workers are often the first professionals to assess and respond to individuals in crisis.", p2: "The crisis assessment includes evaluating the precipitating event, the individual's emotional and cognitive state, available support systems, current coping mechanisms, and the level of risk (to self and others). Use validated screening tools such as the Columbia Suicide Severity Rating Scale (C-SSRS) for suicide risk assessment and the Danger Assessment Scale for domestic violence situations.", h2: "Safety Planning and Intervention", p3: "Safety planning is a collaborative process between the social worker and the client that identifies warning signs, coping strategies, social supports, and professional resources the client can use during a crisis. The Stanley-Brown Safety Plan is a widely used evidence-based tool that guides the development of a personalized safety plan.", p4: "Crisis intervention techniques include active listening, validation of emotions, reality testing, problem-solving, and connecting the client with appropriate resources. Know mandatory reporting requirements for child abuse, elder abuse, and threats to identifiable third parties (Tarasoff duty to warn). Document all crisis assessments, interventions, and follow-up plans thoroughly. NurseNest offers crisis intervention practice questions, safety planning flashcards, and social work clinical skills study resources." },
    { t: "Cognitive Behavioral Therapy Techniques for Social Workers", s: "cognitive-behavioral-therapy-techniques-social-workers", k: "CBT techniques social work", h1: "CBT Foundations for Social Work Practice", p1: "Cognitive Behavioral Therapy (CBT) is one of the most widely used and evidence-supported therapeutic approaches in social work practice. CBT is based on the cognitive model, which posits that thoughts, emotions, and behaviors are interconnected, and that changing maladaptive thought patterns can lead to changes in emotional distress and behavioral dysfunction.", p2: "The CBT framework identifies three levels of cognition: automatic thoughts (immediate, spontaneous thoughts that arise in response to situations), intermediate beliefs (rules, attitudes, and assumptions that guide behavior), and core beliefs (deeply held beliefs about self, others, and the world). Therapy focuses on identifying and modifying distorted thinking at each level.", h2: "Common CBT Techniques in Practice", p3: "Cognitive restructuring involves identifying cognitive distortions (all-or-nothing thinking, catastrophizing, mind reading, emotional reasoning, overgeneralization) and challenging them with evidence-based alternative thoughts. Use Socratic questioning to help clients examine the evidence for and against their automatic thoughts rather than simply telling them their thinking is distorted.", p4: "Behavioral activation is an essential CBT technique for depression that involves gradually increasing engagement in pleasurable and mastery activities to counteract withdrawal and inertia. Activity scheduling, graded task assignments, and behavioral experiments help clients test their negative predictions and rebuild a sense of accomplishment and pleasure. NurseNest offers CBT technique practice questions, therapeutic intervention flashcards, and social work clinical skills study resources." },
    { t: "Child Welfare Social Work: Assessment and Family Reunification", s: "child-welfare-social-work-assessment-family-reunification", k: "child welfare social work", h1: "Child Safety Assessment", p1: "Child welfare social work involves the investigation of child abuse and neglect reports, assessment of family safety and risk, development of safety plans, and facilitation of family reunification when safe and appropriate. Social workers in child welfare settings must balance the paramount concern of child safety with the goal of family preservation and the rights of parents.", p2: "Safety assessment determines whether a child is in immediate danger of serious harm. Risk assessment evaluates the likelihood of future maltreatment. Structured Decision Making (SDM) tools provide standardized criteria for safety and risk assessment, reducing reliance on individual judgment and improving consistency across workers.", h2: "Family Reunification Planning", p3: "When children are removed from the home, the primary permanency goal is typically family reunification (unless aggravated circumstances exist). The social worker develops a family service plan that identifies the conditions that must be addressed before reunification can occur: substance abuse treatment, mental health services, parenting education, housing stability, and domestic violence intervention.", p4: "Reunification is a gradual process that typically includes supervised visitation, unsupervised visitation, overnight visits, and trial home placement before the case is officially closed. The social worker monitors the family's progress, assesses ongoing safety, and coordinates with courts, service providers, and other professionals throughout the process. NurseNest offers child welfare practice questions, family assessment flashcards, and social work licensing exam preparation resources." },
    { t: "Trauma-Informed Care in Social Work Practice", s: "trauma-informed-care-social-work-practice", k: "trauma-informed care social work", h1: "Understanding Trauma-Informed Care", p1: "Trauma-informed care (TIC) is an organizational and clinical approach that recognizes the widespread impact of trauma, understands paths to recovery, recognizes the signs and symptoms of trauma in clients and staff, and integrates knowledge about trauma into policies, procedures, and practices. The Substance Abuse and Mental Health Services Administration (SAMHSA) identifies six key principles of TIC: safety, trustworthiness and transparency, peer support, collaboration and mutuality, empowerment and choice, and cultural/historical/gender issues.", p2: "Adverse Childhood Experiences (ACEs) research has demonstrated the profound impact of childhood trauma on health and well-being across the lifespan. ACEs include physical, emotional, and sexual abuse; physical and emotional neglect; and household dysfunction such as domestic violence, substance abuse, mental illness, incarceration, and parental separation. Higher ACE scores correlate with increased risk of chronic disease, mental illness, substance use, and premature death.", h2: "Implementing Trauma-Informed Practices", p3: "Trauma-informed practice begins with screening for trauma history using validated instruments such as the ACE questionnaire, the Life Events Checklist (LEC-5), or the Trauma History Questionnaire. Screening should be conducted in a safe, supportive environment with appropriate follow-up resources available. Never require clients to disclose trauma details during screening.", p4: "Evidence-based trauma treatment approaches include Trauma-Focused Cognitive Behavioral Therapy (TF-CBT) for children and adolescents, Cognitive Processing Therapy (CPT) for adults with PTSD, Eye Movement Desensitization and Reprocessing (EMDR), and Seeking Safety for co-occurring trauma and substance use. The choice of treatment approach depends on the client's age, trauma type, presenting symptoms, and treatment goals. NurseNest offers trauma-informed care practice questions, therapeutic intervention flashcards, and ASWB exam preparation resources for social work students." },
  ];

  for (const p of swPosts) {
    posts.push(createPost("social-work", p.t, p.s, p.p1.substring(0, 200) + "...", p.k,
      `${p.t.substring(0, 55)} | Guide`, `${p.p1.substring(0, 150)}...`,
      ["social-work", "aswb", "mental-health", "allied-health"], [p.k, "social work", "social work licensing"],
      [
        { heading: p.h1, paragraphs: [p.p1, p.p2] },
        { heading: p.h2, paragraphs: [p.p3, p.p4] },
      ]
    ));
  }

  return posts;
}

async function seedPosts() {
  const posts = generateAllPosts();

  console.log(`Preparing to seed ${posts.length} long-tail SEO blog posts...`);

  let inserted = 0;
  let skipped = 0;
  const professionCounts: Record<string, number> = {};

  for (const post of posts) {
    const existing = await pool.query("SELECT id FROM content_items WHERE slug = $1", [post.slug]);
    if (existing.rows.length > 0) {
      console.log(`  SKIP: ${post.slug} (already exists)`);
      skipped++;
      continue;
    }

    const profTag = post.profession;
    professionCounts[profTag] = (professionCounts[profTag] || 0) + 1;

    const allTags = [...new Set([...post.tags, post.profession])];

    await pool.query(
      `INSERT INTO content_items (
        id, title, slug, type, category, tier, status, tags, summary, content,
        seo_title, seo_description, seo_keywords, primary_keyword,
        published_at, auto_publish, author_name, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, 'blog', $3, 'free', 'published', $4, $5, $6,
        $7, $8, $9, $10,
        NOW(), true, 'NurseNest Education Team', NOW(), NOW()
      )`,
      [
        post.title,
        post.slug,
        post.category,
        allTags,
        post.summary,
        JSON.stringify(post.content),
        post.seoTitle,
        post.seoDescription,
        post.seoKeywords,
        post.primaryKeyword,
      ]
    );

    inserted++;
    console.log(`  OK: ${post.slug} [${post.profession}]`);
  }

  console.log(`\nSeeding complete: ${inserted} inserted, ${skipped} skipped`);
  console.log("Posts per profession:", professionCounts);
  return { inserted, skipped, professionCounts };
}

seedPosts()
  .then((result) => {
    console.log("\nDone:", result);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
