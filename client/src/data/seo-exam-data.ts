export interface SeoSampleQuestion {
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoExamFeature {
  title: string;
  description: string;
}

export interface SeoExamFormatDetails {
  questionCount: string;
  timeLimit: string;
  adaptiveOrFixed: "adaptive" | "fixed" | "linear-scaled";
  passRate: string;
  questionTypes: string[];
}

export interface SeoExamPageConfig {
  slug: string;
  examName: string;
  examCode: string;
  h1Title: string;
  introText: string;
  region: "US" | "CA" | "both";
  tier: "rpn" | "rn" | "np";
  formatDetails: SeoExamFormatDetails;
  features: SeoExamFeature[];
  sampleQuestions: SeoSampleQuestion[];
  faqItems: SeoFaqItem[];
  targetKeywords: string[];
}

export const SEO_EXAM_PAGES: SeoExamPageConfig[] = [
  {
    slug: "nclex-rn-mock-exam",
    examName: "NCLEX-RN",
    examCode: "NCLEX-RN",
    h1Title: "NCLEX-RN Practice Exam: Free Mock Questions and Test Prep",
    introText:
      "Prepare for the National Council Licensure Examination for Registered Nurses (NCLEX-RN) with realistic practice questions that mirror the Next Generation NCLEX format. Our mock exam simulator uses computer adaptive testing logic, timed sessions, and detailed rationales to help you build confidence before exam day. Whether you are a nursing student in the United States or Canada, NurseNest provides the clinical reasoning practice you need to pass the NCLEX-RN on your first attempt.",
    region: "both",
    tier: "rn",
    formatDetails: {
      questionCount: "60-85 questions (adaptive)",
      timeLimit: "5 hours maximum",
      adaptiveOrFixed: "adaptive",
      passRate: "Approximately 88% first-time pass rate nationally",
      questionTypes: [
        "Multiple Choice (MCQ)",
        "Select All That Apply (SATA)",
        "Ordered Response / Drag-and-Drop",
        "Hot Spot",
        "Fill-in-the-Blank Calculation",
        "Bowtie Items (NGN)",
        "Case Study Clusters (NGN)",
      ],
    },
    features: [
      {
        title: "Computer Adaptive Testing Simulation",
        description:
          "Experience question difficulty that adjusts based on your performance, replicating the real NCLEX-RN CAT algorithm used by the NCSBN.",
      },
      {
        title: "Timed Exam Sessions",
        description:
          "Practice under realistic time constraints with a 5-hour session timer, helping you develop the pacing strategies essential for exam day.",
      },
      {
        title: "Next Generation NCLEX Format",
        description:
          "Practice with NGN-style items including bowtie questions, case study clusters, and clinical judgment scenarios aligned to the NCSBN Clinical Judgment Measurement Model.",
      },
      {
        title: "Detailed Rationales and Analytics",
        description:
          "Review comprehensive explanations for every answer choice, track your performance by domain, and identify weak areas across all eight NCLEX-RN client needs categories.",
      },
      {
        title: "Domain-Weighted Question Distribution",
        description:
          "Questions are distributed across Management of Care, Pharmacological Therapies, Physiological Adaptation, and all other NCLEX-RN test plan categories following official NCSBN weightings.",
      },
    ],
    sampleQuestions: [
      {
        stem: "A nurse is caring for a client who is 2 hours post-cardiac catheterization via the right femoral artery. The client reports numbness and tingling in the right foot. Which action should the nurse take first?",
        options: [
          "Elevate the right leg on two pillows",
          "Assess the dorsalis pedis pulse in the right foot",
          "Notify the healthcare provider immediately",
          "Apply a warm compress to the insertion site",
        ],
        correctIndex: 1,
        rationale:
          "Numbness and tingling after femoral catheterization may indicate compromised circulation due to hematoma, thrombus, or arterial spasm. The nurse should first assess the neurovascular status by checking the dorsalis pedis pulse to determine if arterial flow is adequate. This assessment data is essential before notifying the provider so the nurse can report objective findings. Elevating the leg and applying warm compresses are not priority interventions when vascular compromise is suspected.",
      },
      {
        stem: "A nurse is preparing to administer a blood transfusion of packed red blood cells. The client's blood type is B positive. Which blood type is compatible for this transfusion?",
        options: [
          "A positive",
          "AB negative",
          "O negative",
          "A negative",
        ],
        correctIndex: 2,
        rationale:
          "A client with blood type B positive can safely receive packed red blood cells from type B or type O donors. Type O is the universal donor for red blood cells because O-negative RBCs lack A, B, and Rh antigens. Type A blood contains A antigens that would cause a transfusion reaction in a type B recipient. Type AB blood contains both A and B antigens and is not compatible. O negative is the safest choice among the options listed.",
      },
      {
        stem: "A nurse is caring for a client receiving IV heparin therapy. The activated partial thromboplastin time (aPTT) result is 120 seconds. The therapeutic range is 60-80 seconds. Which action should the nurse take?",
        options: [
          "Continue the current infusion rate",
          "Increase the heparin drip rate",
          "Stop the heparin infusion and notify the provider",
          "Administer vitamin K as prescribed",
        ],
        correctIndex: 2,
        rationale:
          "An aPTT of 120 seconds is significantly above the therapeutic range of 60-80 seconds, indicating an excessive anticoagulant effect and increased bleeding risk. The nurse should stop the heparin infusion immediately and notify the healthcare provider. Protamine sulfate, not vitamin K, is the antidote for heparin. Vitamin K reverses warfarin. Continuing or increasing the infusion would further increase bleeding risk.",
      },
      {
        stem: "A nurse is assessing a client with suspected left-sided heart failure. Which finding is most consistent with this diagnosis?",
        options: [
          "Jugular venous distention",
          "Hepatomegaly",
          "Crackles in the lung bases bilaterally",
          "Peripheral edema in the lower extremities",
        ],
        correctIndex: 2,
        rationale:
          "Left-sided heart failure causes blood to back up into the pulmonary vasculature, leading to pulmonary congestion. Crackles (rales) heard in the lung bases bilaterally are a hallmark finding of left-sided heart failure due to fluid accumulation in the alveoli. Jugular venous distention, hepatomegaly, and peripheral edema are classic signs of right-sided heart failure, which results from blood backing up into the systemic venous circulation.",
      },
      {
        stem: "A nurse is planning discharge teaching for a client prescribed warfarin (Coumadin). Which statement by the client indicates a need for further teaching?",
        options: [
          "I will have my INR levels checked regularly",
          "I should avoid taking aspirin with this medication",
          "I can eat as many green leafy vegetables as I want",
          "I will use an electric razor for shaving",
        ],
        correctIndex: 2,
        rationale:
          "Warfarin is a vitamin K antagonist. Clients taking warfarin should maintain a consistent intake of vitamin K-containing foods such as green leafy vegetables rather than eating unlimited amounts, as increased vitamin K intake reduces the effectiveness of warfarin. The statement about eating as many green leafy vegetables as desired indicates the client needs further education. Regular INR monitoring, avoiding aspirin, and using an electric razor are all appropriate safety measures.",
      },
    ],
    faqItems: [
      {
        question: "How many questions are on the NCLEX-RN exam?",
        answer:
          "The NCLEX-RN uses computer adaptive testing (CAT) and includes between 60 and 85 scored questions. The exam ends when the algorithm determines with 95% confidence whether you meet the passing standard, or when you reach the maximum of 85 questions or 5 hours.",
      },
      {
        question: "What is the pass rate for the NCLEX-RN?",
        answer:
          "The national first-time pass rate for U.S.-educated candidates is approximately 88%. Pass rates vary by nursing program. International candidates may have different pass rates. NurseNest practice exams help you identify weak areas so you can focus your preparation effectively.",
      },
      {
        question: "What topics are covered on the NCLEX-RN?",
        answer:
          "The NCLEX-RN test plan is organized into four major client needs categories: Safe and Effective Care Environment (Management of Care, Safety and Infection Control), Health Promotion and Maintenance, Psychosocial Integrity, and Physiological Integrity (Basic Care and Comfort, Pharmacological Therapies, Reduction of Risk Potential, Physiological Adaptation).",
      },
      {
        question: "What is the Next Generation NCLEX (NGN)?",
        answer:
          "The Next Generation NCLEX introduced new question types in April 2023 that assess clinical judgment using the NCSBN Clinical Judgment Measurement Model. NGN items include case study clusters, bowtie items, trend items, and enhanced multiple response questions. NurseNest practice exams include these NGN-style questions.",
      },
      {
        question: "How long should I study for the NCLEX-RN?",
        answer:
          "Most nursing graduates spend 4-8 weeks preparing for the NCLEX-RN after graduation. An effective study plan includes content review, practice questions with rationale analysis, and timed mock exams. NurseNest recommends completing at least 1,500-2,000 practice questions before your exam date.",
      },
    ],
    targetKeywords: [
      "NCLEX-RN practice exam",
      "NCLEX-RN mock exam",
      "NCLEX-RN practice questions",
      "NCLEX-RN test prep",
      "NCLEX-RN review",
      "Next Generation NCLEX practice",
      "NGN practice questions",
      "NCLEX-RN study guide",
      "NCLEX-RN pass rate",
      "NCLEX-RN question bank",
    ],
  },

  {
    slug: "nclex-pn-mock-exam",
    examName: "NCLEX-PN",
    examCode: "NCLEX-PN",
    h1Title: "NCLEX-PN Practice Exam: Free Mock Questions for LPN/LVN Test Prep",
    introText:
      "Master the National Council Licensure Examination for Practical Nurses (NCLEX-PN) with NurseNest's realistic practice exam simulator. Our platform delivers computer adaptive testing with questions aligned to the current NCLEX-PN test plan, covering all four client needs categories. Each question includes detailed rationales to strengthen your clinical reasoning skills and prepare you for licensure as a Licensed Practical Nurse (LPN) or Licensed Vocational Nurse (LVN).",
    region: "US",
    tier: "rpn",
    formatDetails: {
      questionCount: "60-85 questions (adaptive)",
      timeLimit: "5 hours maximum",
      adaptiveOrFixed: "adaptive",
      passRate: "Approximately 86% first-time pass rate for US-educated candidates",
      questionTypes: [
        "Multiple Choice (MCQ)",
        "Select All That Apply (SATA)",
        "Ordered Response",
        "Fill-in-the-Blank Calculation",
        "Hot Spot",
        "NGN Case Studies",
      ],
    },
    features: [
      {
        title: "Adaptive Difficulty Engine",
        description:
          "Questions adjust in difficulty based on your responses, simulating the real NCLEX-PN computer adaptive testing algorithm for an authentic exam experience.",
      },
      {
        title: "LPN/LVN Scope-Focused Content",
        description:
          "All questions are written within the practical nursing scope of practice, focusing on foundational nursing care, data collection, and supervised clinical decision-making.",
      },
      {
        title: "Timed Practice Sessions",
        description:
          "Develop your time management skills with realistic exam timing that mirrors the 5-hour NCLEX-PN session, including optional break periods.",
      },
      {
        title: "Comprehensive Rationale Review",
        description:
          "Every question includes an explanation of the correct answer and why each distractor is incorrect, reinforcing clinical reasoning and content mastery.",
      },
    ],
    sampleQuestions: [
      {
        stem: "A practical nurse is collecting data on a client who had a total hip replacement 24 hours ago. Which finding should be reported to the registered nurse immediately?",
        options: [
          "The client reports mild incisional pain rated 4 out of 10",
          "The client's affected leg appears shorter than the unaffected leg",
          "The client's temperature is 37.2 degrees Celsius (99 degrees Fahrenheit)",
          "The client is using an incentive spirometer as instructed",
        ],
        correctIndex: 1,
        rationale:
          "Leg length discrepancy after total hip replacement suggests hip dislocation or prosthesis displacement, which is a surgical emergency requiring immediate intervention. The practical nurse should report this finding to the RN immediately. Mild incisional pain, a low-grade temperature within 24 hours post-op, and using the incentive spirometer are all expected findings that do not require urgent reporting.",
      },
      {
        stem: "A practical nurse is reinforcing dietary teaching for a client with chronic kidney disease. Which food choice indicates the client understands the dietary restrictions?",
        options: [
          "Banana and orange juice for breakfast",
          "Grilled chicken salad with low-sodium dressing",
          "Tomato soup with a baked potato",
          "Dried apricots and trail mix for a snack",
        ],
        correctIndex: 1,
        rationale:
          "Clients with chronic kidney disease must follow a diet low in potassium, phosphorus, and sodium. Grilled chicken salad with low-sodium dressing is the best choice because it provides protein without excessive potassium or sodium. Bananas, oranges, tomatoes, potatoes, dried apricots, and nuts are all high in potassium and should be limited in a renal diet.",
      },
      {
        stem: "A practical nurse is caring for a client receiving an IV infusion of 0.9% normal saline at 125 mL/hr. The drop factor is 15 drops/mL. What is the correct drip rate in drops per minute?",
        options: [
          "21 drops per minute",
          "25 drops per minute",
          "31 drops per minute",
          "42 drops per minute",
        ],
        correctIndex: 2,
        rationale:
          "The drip rate is calculated using the formula: (Volume per hour x Drop factor) / 60 minutes. For this problem: (125 mL/hr x 15 drops/mL) / 60 min = 1875 / 60 = 31.25, rounded to 31 drops per minute. Accurate IV flow rate calculation is an essential practical nursing skill for safe medication administration.",
      },
    ],
    faqItems: [
      {
        question: "What is the difference between the NCLEX-PN and NCLEX-RN?",
        answer:
          "The NCLEX-PN tests competency for practical/vocational nursing practice (LPN/LVN), while the NCLEX-RN tests competency for registered nursing practice. The NCLEX-PN focuses on foundational nursing care, data collection, and contributing to the nursing care plan under RN supervision. The NCLEX-RN covers a broader scope including independent clinical judgment, complex care planning, and delegation.",
      },
      {
        question: "How many questions are on the NCLEX-PN?",
        answer:
          "The NCLEX-PN contains between 60 and 85 questions using computer adaptive testing. The exam ends when the algorithm determines your competency level with 95% confidence, or when you reach the maximum number of questions or the 5-hour time limit.",
      },
      {
        question: "What score do I need to pass the NCLEX-PN?",
        answer:
          "The NCLEX-PN uses a pass/fail system based on the logit passing standard set by the NCSBN Board of Directors. There is no percentage score. The CAT algorithm determines whether your ability level is consistently above or below the passing standard. The passing standard is reviewed and updated every three years.",
      },
      {
        question: "Can I use NurseNest to study for the NCLEX-PN in any state?",
        answer:
          "Yes. The NCLEX-PN is a national exam administered uniformly across all U.S. states and territories. NurseNest practice questions are aligned to the national NCLEX-PN test plan published by the NCSBN, making them appropriate for candidates in any jurisdiction.",
      },
    ],
    targetKeywords: [
      "NCLEX-PN practice exam",
      "NCLEX-PN practice questions",
      "NCLEX-PN mock test",
      "LPN practice exam",
      "LVN exam prep",
      "NCLEX-PN study guide",
      "NCLEX-PN review questions",
      "NCLEX-PN test prep",
      "practical nurse exam",
      "NCLEX-PN pass rate",
    ],
  },

  {
    slug: "rex-pn-mock-exam",
    examName: "REx-PN",
    examCode: "REX-PN",
    h1Title: "REx-PN Practice Exam: Canadian RPN Mock Questions and Study Prep",
    introText:
      "Prepare for the Regulatory Exam - Practical Nurse (REx-PN) with NurseNest's comprehensive practice exam platform designed specifically for Canadian nursing students. The REx-PN replaced the CPNRE in 2022 as the licensure examination for Registered Practical Nurses (RPNs) in Ontario and practical nurses across Canada. Our simulator mirrors the computer adaptive testing format with questions aligned to the REx-PN competency framework, covering Foundations of Practice, Collaborative Practice, Professional Practice, Ethical Practice, and Legal Practice.",
    region: "CA",
    tier: "rpn",
    formatDetails: {
      questionCount: "60-90 questions (adaptive)",
      timeLimit: "3 hours maximum",
      adaptiveOrFixed: "adaptive",
      passRate: "Results are reported as pass or fail based on competency assessment",
      questionTypes: [
        "Multiple Choice (MCQ)",
        "Select All That Apply",
        "Ordered Response",
        "Clinical Scenario-Based Items",
      ],
    },
    features: [
      {
        title: "Canadian RPN Competency Alignment",
        description:
          "Every question maps to the entry-to-practice competencies defined by the College of Nurses of Ontario (CNO) and the National Council of State Boards of Nursing Canada for the REx-PN.",
      },
      {
        title: "Computer Adaptive Testing Simulation",
        description:
          "Experience the adaptive algorithm that adjusts question difficulty based on your performance, replicating the real REx-PN exam environment delivered by Pearson VUE.",
      },
      {
        title: "Five-Domain Coverage",
        description:
          "Questions are distributed across Foundations of Practice (36%), Collaborative Practice (30%), Professional Practice (16%), Ethical Practice (10%), and Legal Practice (8%) to match the official exam blueprint.",
      },
      {
        title: "Canadian Clinical Context",
        description:
          "All scenarios use Canadian healthcare terminology, medications approved by Health Canada, metric units (Celsius, kilograms, centimeters), and Canadian nursing scope of practice standards.",
      },
    ],
    sampleQuestions: [
      {
        stem: "A registered practical nurse (RPN) is caring for a client with type 2 diabetes who reports feeling shaky, diaphoretic, and anxious. The client's blood glucose reading is 3.2 mmol/L. Which action should the RPN take first?",
        options: [
          "Administer the client's scheduled insulin dose",
          "Provide 15 grams of fast-acting carbohydrate",
          "Notify the registered nurse and await further orders",
          "Recheck the blood glucose level in 15 minutes",
        ],
        correctIndex: 1,
        rationale:
          "A blood glucose of 3.2 mmol/L is below the normal range of 4.0-7.0 mmol/L, indicating hypoglycemia. The immediate intervention is to provide 15 grams of fast-acting carbohydrate (such as 4 glucose tablets, 175 mL juice, or 15 mL sugar) per the Rule of 15. This is within the RPN scope of practice and should not be delayed to notify the RN. Administering insulin would further lower glucose. Rechecking should occur 15 minutes after treatment, not before it.",
      },
      {
        stem: "An RPN is providing wound care for a client with a stage 3 pressure injury on the sacrum. The wound bed has 60% red granulation tissue and 40% yellow slough. Which wound care approach is most appropriate?",
        options: [
          "Pack the wound tightly with dry gauze and secure with tape",
          "Apply a hydrogel dressing after gently irrigating the wound",
          "Leave the wound open to air to promote drying",
          "Apply a full-strength povidone-iodine solution to the wound bed",
        ],
        correctIndex: 1,
        rationale:
          "A wound with mixed granulation tissue and slough requires moist wound healing. Gently irrigating the wound with normal saline removes loose slough without damaging healthy granulation tissue. A hydrogel dressing maintains a moist environment that promotes autolytic debridement of the remaining slough while supporting granulation. Dry gauze and air exposure can damage granulation tissue. Full-strength povidone-iodine is cytotoxic to healing tissue.",
      },
      {
        stem: "An RPN is preparing to delegate a task to an unregulated care provider (UCP). Which task is appropriate for the RPN to delegate?",
        options: [
          "Performing a focused respiratory assessment on a client with pneumonia",
          "Administering a scheduled oral medication to a stable client",
          "Assisting a stable client with activities of daily living",
          "Interpreting a client's 12-lead ECG rhythm strip",
        ],
        correctIndex: 2,
        rationale:
          "Assisting with activities of daily living (bathing, dressing, feeding, ambulation) for stable clients is within the scope of an unregulated care provider and is an appropriate delegation. Assessment, medication administration, and ECG interpretation require regulated nursing knowledge and clinical judgment and cannot be delegated to a UCP. The RPN must ensure the delegated task matches the UCP's competency and that appropriate supervision is provided.",
      },
    ],
    faqItems: [
      {
        question: "What is the REx-PN exam?",
        answer:
          "The Regulatory Exam - Practical Nurse (REx-PN) is the Canadian licensure examination for practical nurses. It replaced the Canadian Practical Nurse Registration Examination (CPNRE) in January 2022. The REx-PN is a computer adaptive test developed by the NCSBN and administered by Pearson VUE. It assesses whether candidates meet the entry-to-practice competencies required for safe and effective practical nursing in Canada.",
      },
      {
        question: "How is the REx-PN different from the NCLEX-PN?",
        answer:
          "The REx-PN and NCLEX-PN are both developed by the NCSBN and use computer adaptive testing. The REx-PN is administered in Canada for Registered Practical Nurses (RPNs), while the NCLEX-PN is used in the United States for Licensed Practical Nurses (LPNs) and Licensed Vocational Nurses (LVNs). The REx-PN uses Canadian competency frameworks, metric units, Health Canada-approved medications, and Canadian healthcare system contexts.",
      },
      {
        question: "How many questions are on the REx-PN?",
        answer:
          "The REx-PN contains between 60 and 90 questions and must be completed within 3 hours. The computer adaptive testing algorithm selects questions based on your performance, and the exam ends when the algorithm reaches a pass or fail decision with sufficient statistical confidence.",
      },
      {
        question: "What provinces use the REx-PN?",
        answer:
          "The REx-PN is used as the licensure examination for practical nurses across Canadian provinces and territories, including Ontario (RPNs), British Columbia (LPNs), Alberta (LPNs), and other jurisdictions. Each provincial nursing regulatory body sets its own registration requirements, but the REx-PN exam is the standard national examination.",
      },
      {
        question: "How should I prepare for the REx-PN?",
        answer:
          "Effective REx-PN preparation includes reviewing the five competency domains (Foundations of Practice, Collaborative Practice, Professional Practice, Ethical Practice, Legal Practice), completing practice questions with rationale review, and taking timed mock exams. Focus on clinical judgment and application-level questions rather than memorization. NurseNest provides Canadian-specific practice questions aligned to the REx-PN blueprint.",
      },
    ],
    targetKeywords: [
      "REx-PN practice exam",
      "REx-PN mock exam",
      "REx-PN practice questions",
      "Canadian RPN exam prep",
      "REx-PN study guide",
      "REx-PN review questions",
      "CPNRE replacement exam",
      "Ontario RPN exam",
      "REx-PN test prep",
      "registered practical nurse exam Canada",
    ],
  },

  {
    slug: "canada-np-mock-exam",
    examName: "Canadian NP Exam (CNPLE)",
    examCode: "CNPLE",
    h1Title: "Canadian Nurse Practitioner Exam Prep: CNPLE Practice Questions",
    introText:
      "Prepare for the Canadian Nurse Practitioner Licensing Examination (CNPLE) with NurseNest's advanced practice exam simulator. The CNPLE is the national certification examination for nurse practitioners in Canada, testing competency across health assessment, diagnosis, therapeutics, health promotion and disease prevention, and professional role and responsibility. Our platform provides 180-question linear-scaled mock exams with detailed rationales written at the NP scope of practice, covering differential diagnosis, prescribing, and autonomous clinical decision-making.",
    region: "CA",
    tier: "np",
    formatDetails: {
      questionCount: "180 questions (fixed/linear)",
      timeLimit: "5 hours maximum",
      adaptiveOrFixed: "linear-scaled",
      passRate: "Results reported as scaled score; passing score of 500 on a 200-800 scale",
      questionTypes: [
        "Multiple Choice (MCQ)",
        "Case-Based Clinical Scenarios",
        "Differential Diagnosis Items",
        "Prescribing and Management Questions",
      ],
    },
    features: [
      {
        title: "NP-Level Clinical Reasoning",
        description:
          "Questions assess advanced practice competencies including differential diagnosis, diagnostic test ordering and interpretation, prescriptive authority, and independent clinical management.",
      },
      {
        title: "Linear-Scaled Exam Format",
        description:
          "Practice with the 180-question fixed-length format that mirrors the actual CNPLE, with scored results reported on a 200-800 scaled score range.",
      },
      {
        title: "Five-Domain Blueprint Alignment",
        description:
          "Questions are distributed across Health Assessment (25%), Diagnosis (20%), Therapeutics (25%), Health Promotion and Disease Prevention (15%), and Professional Role and Responsibility (15%).",
      },
      {
        title: "Canadian Prescribing Context",
        description:
          "All pharmacology questions reference Health Canada-approved medications, Canadian prescribing guidelines, and provincial NP scope of practice standards.",
      },
      {
        title: "Performance Analytics by Domain",
        description:
          "Track your scaled score and performance across all five CNPLE domains to identify strengths and target your study time on areas that need improvement.",
      },
    ],
    sampleQuestions: [
      {
        stem: "A 52-year-old female presents to the primary care clinic with fatigue, weight gain of 5 kg over 3 months, constipation, and cold intolerance. Physical examination reveals bradycardia, dry skin, and delayed deep tendon reflexes. Which initial diagnostic test should the nurse practitioner order?",
        options: [
          "Fasting blood glucose and HbA1c",
          "TSH and free T4",
          "Complete blood count with differential",
          "Serum cortisol level",
        ],
        correctIndex: 1,
        rationale:
          "The clinical presentation of fatigue, weight gain, constipation, cold intolerance, bradycardia, dry skin, and delayed deep tendon reflexes is classic for hypothyroidism. The initial diagnostic workup should include TSH and free T4 levels. An elevated TSH with low free T4 confirms primary hypothyroidism. While other conditions (diabetes, anemia, adrenal insufficiency) can cause fatigue, the constellation of findings strongly suggests thyroid dysfunction and TSH is the most sensitive initial screening test.",
      },
      {
        stem: "A nurse practitioner is managing a 68-year-old male with newly diagnosed atrial fibrillation and a CHA2DS2-VASc score of 4. Which anticoagulation therapy is most appropriate to initiate?",
        options: [
          "Acetylsalicylic acid (ASA) 81 mg daily",
          "Clopidogrel 75 mg daily",
          "Apixaban 5 mg twice daily",
          "No anticoagulation needed at this time",
        ],
        correctIndex: 2,
        rationale:
          "A CHA2DS2-VASc score of 4 indicates high risk for thromboembolic stroke and warrants oral anticoagulation therapy. Direct oral anticoagulants (DOACs) such as apixaban are recommended as first-line therapy for stroke prevention in non-valvular atrial fibrillation per Canadian Cardiovascular Society guidelines. Apixaban 5 mg twice daily is the standard dose (with dose reduction criteria for age, weight, and renal function). ASA alone is insufficient for stroke prevention in patients with this risk level. Clopidogrel is an antiplatelet, not an anticoagulant.",
      },
      {
        stem: "A 28-year-old female presents with dysuria, urinary frequency, and suprapubic tenderness. She has no fever, flank pain, or vaginal discharge. Urine dipstick is positive for leukocyte esterase and nitrites. Which management plan is most appropriate?",
        options: [
          "Order urine culture and sensitivity before initiating treatment",
          "Prescribe nitrofurantoin 100 mg twice daily for 5 days",
          "Prescribe ciprofloxacin 500 mg twice daily for 7 days",
          "Refer to urology for cystoscopy",
        ],
        correctIndex: 1,
        rationale:
          "This presentation is consistent with an uncomplicated lower urinary tract infection (cystitis) in a young, otherwise healthy female. Canadian guidelines recommend empiric treatment with nitrofurantoin 100 mg twice daily for 5 days as first-line therapy. Urine culture is not required for uncomplicated UTI in premenopausal, non-pregnant women. Fluoroquinolones such as ciprofloxacin should be reserved for complicated UTIs due to resistance concerns and adverse effect profile. Cystoscopy is not indicated for a straightforward first-episode UTI.",
      },
    ],
    faqItems: [
      {
        question: "What is the CNPLE exam?",
        answer:
          "The Canadian Nurse Practitioner Licensing Examination (CNPLE) is the national certification exam required for nurse practitioner licensure in Canada. It is administered by the Canadian Council of Registered Nurse Regulators and assesses competency in health assessment, diagnosis, therapeutics, health promotion, and professional practice at the NP level.",
      },
      {
        question: "How many questions are on the CNPLE?",
        answer:
          "The CNPLE contains 180 questions in a fixed-length (linear) format. Results are reported as a scaled score on a 200-800 scale, with a passing score of 500. The exam must be completed within 5 hours.",
      },
      {
        question: "What are the CNPLE exam domains?",
        answer:
          "The CNPLE covers five competency domains: Health Assessment (25%), Diagnosis (20%), Therapeutics (25%), Health Promotion and Disease Prevention (15%), and Professional Role and Responsibility (15%). Questions assess autonomous NP clinical judgment including differential diagnosis, prescribing, and patient management.",
      },
      {
        question: "Which provinces require the CNPLE for NP licensure?",
        answer:
          "The CNPLE is required for NP registration across Canadian provinces and territories. Each provincial nursing regulatory body (such as the CNO in Ontario, BCCNM in British Columbia, CARNA in Alberta) accepts the CNPLE as the national certification examination for nurse practitioner licensure.",
      },
    ],
    targetKeywords: [
      "CNPLE practice exam",
      "Canadian nurse practitioner exam",
      "CNPLE practice questions",
      "NP exam prep Canada",
      "CNPLE study guide",
      "nurse practitioner certification Canada",
      "CNPLE mock exam",
      "Canadian NP licensing exam",
      "CNPLE review questions",
      "NP exam questions Canada",
    ],
  },

  {
    slug: "us-np-mock-exam",
    examName: "US NP Certification (AANP/ANCC)",
    examCode: "AANP",
    h1Title: "Nurse Practitioner Certification Exam Prep: AANP and ANCC Practice Questions",
    introText:
      "Prepare for the American Association of Nurse Practitioners (AANP) or American Nurses Credentialing Center (ANCC) nurse practitioner certification examination with NurseNest's comprehensive practice exam platform. Our NP-level practice questions cover advanced assessment, differential diagnosis, pharmacological management, and evidence-based practice across primary care, acute care, and specialty domains. Whether you are preparing for the AANP FNP, AANP AGNP, ANCC FNP-BC, or ANCC AGPCNP-BC certification, NurseNest provides the clinical depth you need to pass your boards.",
    region: "US",
    tier: "np",
    formatDetails: {
      questionCount: "150 questions (fixed/linear)",
      timeLimit: "4 hours maximum",
      adaptiveOrFixed: "linear-scaled",
      passRate: "Results reported as scaled score; AANP uses 200-800 scale (pass: 500), ANCC uses 100-500 scale (pass: 350)",
      questionTypes: [
        "Multiple Choice (MCQ)",
        "Case-Based Clinical Vignettes",
        "Differential Diagnosis Items",
        "Pharmacological Management Questions",
        "Evidence-Based Practice Items",
      ],
    },
    features: [
      {
        title: "Dual Certification Preparation",
        description:
          "Practice questions are aligned to both AANP and ANCC exam blueprints, covering the shared competency domains used by both certifying bodies for family and adult-gerontology NP certification.",
      },
      {
        title: "Advanced Pharmacology Focus",
        description:
          "Extensive coverage of prescriptive authority topics including drug selection, dosing, drug interactions, controlled substance prescribing, and pharmacokinetic principles for the NP scope.",
      },
      {
        title: "Differential Diagnosis Training",
        description:
          "Clinical vignettes require you to distinguish between competing diagnoses using history, physical examination findings, and diagnostic test interpretation at the NP level of practice.",
      },
      {
        title: "Scaled Score Reporting",
        description:
          "Mock exam results are reported on scaled score ranges matching both AANP (200-800) and ANCC (100-500) scoring systems so you can gauge your readiness against the actual passing standard.",
      },
      {
        title: "Evidence-Based Practice Integration",
        description:
          "Questions incorporate current clinical practice guidelines from organizations including the AHA, ADA, USPSTF, and CDC to test your ability to apply evidence-based recommendations.",
      },
    ],
    sampleQuestions: [
      {
        stem: "A 45-year-old male presents with a 2-week history of epigastric pain that worsens after eating. He takes ibuprofen daily for chronic back pain. He is positive for H. pylori on urea breath test. Which treatment regimen should the nurse practitioner prescribe?",
        options: [
          "Omeprazole 20 mg daily for 4 weeks",
          "Clarithromycin 500 mg BID, amoxicillin 1000 mg BID, and omeprazole 20 mg BID for 14 days",
          "Sucralfate 1 g four times daily for 8 weeks",
          "Bismuth subsalicylate and metronidazole for 10 days",
        ],
        correctIndex: 1,
        rationale:
          "H. pylori-positive peptic ulcer disease requires triple therapy for eradication. The standard first-line regimen is clarithromycin-based triple therapy: a proton pump inhibitor (omeprazole 20 mg BID), clarithromycin 500 mg BID, and amoxicillin 1000 mg BID for 14 days. A PPI alone does not eradicate H. pylori and would lead to recurrence. Sucralfate provides mucosal protection but does not treat the underlying infection. The patient should also be counseled to discontinue ibuprofen and switch to an alternative analgesic.",
      },
      {
        stem: "A nurse practitioner is evaluating a 62-year-old female with a BMI of 32, fasting glucose of 118 mg/dL, blood pressure of 142/88 mmHg, triglycerides of 180 mg/dL, and HDL of 38 mg/dL. How many criteria for metabolic syndrome does this patient meet?",
        options: [
          "Two criteria",
          "Three criteria",
          "Four criteria",
          "Five criteria",
        ],
        correctIndex: 2,
        rationale:
          "Metabolic syndrome requires meeting at least three of five criteria: (1) waist circumference > 35 inches in women (BMI 32 suggests this is likely met), (2) fasting glucose >= 100 mg/dL (118 meets this), (3) blood pressure >= 130/85 mmHg (142/88 meets this), (4) triglycerides >= 150 mg/dL (180 meets this), (5) HDL < 50 mg/dL in women (38 meets this). This patient meets four criteria based on the values provided: elevated fasting glucose, elevated blood pressure, elevated triglycerides, and low HDL. Waist circumference would need to be measured to confirm the fifth criterion.",
      },
      {
        stem: "A 35-year-old female presents with anxiety, palpitations, heat intolerance, and unintentional weight loss of 4.5 kg over 2 months. Physical examination reveals a diffusely enlarged thyroid, exophthalmos, and a fine tremor. Laboratory results show TSH 0.05 mIU/L and free T4 4.2 ng/dL. Which condition is the most likely diagnosis?",
        options: [
          "Hashimoto thyroiditis",
          "Toxic multinodular goiter",
          "Graves disease",
          "Subacute thyroiditis",
        ],
        correctIndex: 2,
        rationale:
          "The combination of hyperthyroidism symptoms (anxiety, palpitations, heat intolerance, weight loss, tremor), a diffusely enlarged thyroid, exophthalmos, and laboratory findings of suppressed TSH with elevated free T4 is classic for Graves disease. Exophthalmos (proptosis) is a distinguishing feature of Graves disease caused by autoimmune inflammation of the retro-orbital tissues. Toxic multinodular goiter presents with a nodular rather than diffuse goiter and does not cause exophthalmos. Hashimoto thyroiditis causes hypothyroidism. Subacute thyroiditis is typically painful and self-limiting.",
      },
      {
        stem: "A nurse practitioner is prescribing metformin for a newly diagnosed type 2 diabetes patient with an eGFR of 42 mL/min. Which prescribing decision is most appropriate?",
        options: [
          "Initiate metformin 1000 mg twice daily",
          "Initiate metformin 500 mg daily with dose adjustment based on tolerance",
          "Do not initiate metformin; prescribe a sulfonylurea instead",
          "Initiate metformin 850 mg twice daily",
        ],
        correctIndex: 1,
        rationale:
          "Current guidelines allow metformin use with an eGFR of 30-45 mL/min, but the dose should be reduced and not exceed 1000 mg daily. For an eGFR of 42, initiating at 500 mg daily is appropriate with careful monitoring of renal function. Metformin is contraindicated when eGFR falls below 30 mL/min due to increased risk of lactic acidosis. Starting at 1000 mg twice daily or 850 mg twice daily exceeds the recommended dose for this level of renal impairment.",
      },
    ],
    faqItems: [
      {
        question: "What is the difference between the AANP and ANCC NP certification exams?",
        answer:
          "Both AANP and ANCC certify nurse practitioners for practice in the United States. The AANP exam is offered by the American Association of Nurse Practitioners and uses a 200-800 scaled score (pass: 500). The ANCC exam is offered by the American Nurses Credentialing Center and uses a 100-500 scaled score (pass: 350). Both exams cover similar content domains but may differ in question emphasis. Either certification is accepted for NP licensure in all 50 states.",
      },
      {
        question: "How many questions are on the NP certification exam?",
        answer:
          "The AANP exam contains 150 questions (135 scored + 15 pretest items) and allows 4 hours. The ANCC exam also contains 150 questions (135 scored + 15 pretest items) with a 4-hour time limit. Both exams use a fixed-length format rather than computer adaptive testing.",
      },
      {
        question: "What topics are covered on the NP board certification exam?",
        answer:
          "NP certification exams cover five major domains: Health Assessment (history taking, physical examination, screening), Diagnosis (differential diagnosis, diagnostic test interpretation), Therapeutics (pharmacological and non-pharmacological management, prescribing), Health Promotion and Disease Prevention (screening guidelines, patient education, immunizations), and Professional Role and Responsibility (evidence-based practice, ethics, collaboration, scope of practice).",
      },
      {
        question: "How long should I study for the NP boards?",
        answer:
          "Most NP candidates study for 2-4 months before their certification exam. An effective study plan includes content review of advanced pathophysiology, pharmacology, and assessment; practice questions with detailed rationale review; and full-length timed mock exams. NurseNest recommends completing at least 1,000-1,500 practice questions before your exam date.",
      },
      {
        question: "Can I practice as an NP with either AANP or ANCC certification?",
        answer:
          "Yes. Both AANP and ANCC certifications are recognized for NP licensure in all 50 U.S. states and territories. Your state board of nursing will accept either certification as part of the NP licensure application. Choose the certifying body whose exam format and content emphasis best match your preparation style.",
      },
    ],
    targetKeywords: [
      "AANP practice exam",
      "ANCC practice exam",
      "nurse practitioner board review",
      "NP certification exam prep",
      "AANP practice questions",
      "ANCC practice questions",
      "FNP board review",
      "nurse practitioner exam questions",
      "NP board certification study guide",
      "AANP ANCC exam prep",
    ],
  },
];

export function getExamPageBySlug(slug: string): SeoExamPageConfig | undefined {
  return SEO_EXAM_PAGES.find((page) => page.slug === slug);
}

export function getAllExamSlugs(): string[] {
  return SEO_EXAM_PAGES.map((page) => page.slug);
}
