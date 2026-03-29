import type { ExamQuestion } from "./types";

export const npExamBatch45Questions: ExamQuestion[] = [
  {
    q: "An NP is conducting a research study involving human subjects at her clinic. What ethical framework must she follow?",
    o: ["The Belmont Report principles: respect for persons (informed consent), beneficence (maximize benefits, minimize harm), and justice (fair selection of subjects)", "No ethical oversight is needed for clinical research", "Only hospital-based research requires ethics review", "Ethics review is only needed for pharmaceutical trials"],
    a: 0,
    r: "The Belmont Report (1979) establishes the foundational ethical principles for human subjects research: 1) Respect for Persons (autonomous individuals can make informed decisions; protect those with diminished autonomy -- informed consent is mandatory), 2) Beneficence (obligation to maximize benefits and minimize potential harm -- risk-benefit assessment), 3) Justice (fair distribution of research burdens and benefits -- no exploitation of vulnerable populations). All human subjects research requires Institutional Review Board (IRB) approval regardless of setting. The Common Rule (45 CFR 46) codifies these protections.",
    s: "Professional Practice"
  },
  {
    q: "An NP working in a primary care clinic notices that her patient outcomes for diabetic management are below the national benchmark. She decides to implement a quality improvement project. What metrics should she track?",
    o: ["Process measures (HbA1c testing rates, foot exam completion, eye referral rates) and outcome measures (percentage of patients at HbA1c goal, ED visits for diabetes complications, patient satisfaction)", "Only HbA1c levels as the sole metric", "Financial metrics exclusively", "Patient complaint rates only"],
    a: 0,
    r: "Quality improvement in healthcare requires tracking both process measures (did we do the right things?) and outcome measures (did patients get better?). For diabetes management: Process measures include HbA1c testing frequency, annual foot and eye exams, medication reconciliation, and self-management education referrals. Outcome measures include HbA1c control rates (less than 7%, or individualized), hypoglycemia incidence, ED/hospitalization rates, and patient-reported outcomes. Balancing measures ensure improvement in one area does not cause deterioration in another. HEDIS measures provide standardized diabetes quality benchmarks.",
    s: "Professional Practice"
  },
  {
    q: "An NP is evaluating a new point-of-care test for strep pharyngitis. The test has a sensitivity of 95% and specificity of 80%. The prevalence of strep in her clinic population presenting with sore throat is 30%. A patient tests positive. What is the approximate positive predictive value?",
    o: ["Approximately 67% (the probability that a positive test truly indicates disease depends on prevalence)", "95% because that is the sensitivity", "80% because that is the specificity", "100% because the test is positive"],
    a: 0,
    r: "PPV (positive predictive value) depends on sensitivity, specificity, AND prevalence. Using Bayes' theorem: PPV = (sensitivity x prevalence) / [(sensitivity x prevalence) + ((1-specificity) x (1-prevalence))]. PPV = (0.95 x 0.30) / [(0.95 x 0.30) + (0.20 x 0.70)] = 0.285 / (0.285 + 0.14) = 0.285 / 0.425 = approximately 67%. This means 33% of positive results are false positives. Understanding this concept prevents over-treatment. In low-prevalence populations, even good tests produce many false positives. This is why confirmatory testing (throat culture) is important when rapid strep test is positive in low-prevalence settings.",
    s: "Professional Practice"
  },
  {
    q: "A 60-year-old male with diabetes presents with severe unilateral ear pain, purulent otorrhea, and granulation tissue in the external auditory canal. CT temporal bone shows bone erosion. He has been treated with topical ciprofloxacin drops without improvement. What is the most likely diagnosis?",
    o: ["Malignant (necrotizing) external otitis; requires prolonged IV anti-pseudomonal antibiotics (ciprofloxacin IV or antipseudomonal beta-lactam) for 6-8 weeks", "Simple otitis externa; continue topical drops", "Acute otitis media; oral amoxicillin", "Cholesteatoma; surgical excision"],
    a: 0,
    r: "Malignant (necrotizing) external otitis is a life-threatening invasive infection of the temporal bone and skull base, almost exclusively caused by Pseudomonas aeruginosa in elderly diabetic or immunocompromised patients. Key features: severe otalgia (often nocturnal, disproportionate to exam), granulation tissue at the bone-cartilage junction of the EAC, cranial nerve involvement (facial nerve CN VII most common), and bony erosion on CT. Treatment: prolonged IV anti-pseudomonal antibiotics (6-8 weeks minimum), often ciprofloxacin IV or cefepime/piperacillin-tazobactam. Mortality is 10-20% if cranial nerves are involved.",
    s: "Infectious Disease"
  },
  {
    q: "A 25-year-old sexually active female presents with painless genital ulcers. She has bilateral inguinal lymphadenopathy that is non-tender. RPR is reactive with a titer of 1:64. FTA-ABS is positive. She has no drug allergies. What is the treatment?",
    o: ["Benzathine penicillin G 2.4 million units IM single dose for primary syphilis", "Doxycycline 100 mg BID for 14 days as first-line", "Azithromycin 1 g single dose", "Ceftriaxone 250 mg IM single dose"],
    a: 0,
    r: "Primary syphilis (painless chancre with regional lymphadenopathy) is confirmed by reactive non-treponemal (RPR/VDRL) and treponemal (FTA-ABS/TP-PA) tests. First-line treatment for primary, secondary, and early latent syphilis: benzathine penicillin G 2.4 million units IM single dose. For penicillin-allergic non-pregnant patients: doxycycline 100 mg BID for 14 days is the alternative. Pregnant patients with penicillin allergy require desensitization and penicillin treatment (no alternative is acceptable in pregnancy). Sexual partners should be evaluated and treated. Follow RPR titers (expect 4-fold decline by 6-12 months).",
    s: "Infectious Disease"
  }
];
