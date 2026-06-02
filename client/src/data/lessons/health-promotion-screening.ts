import type { LessonContent } from "./types";

export const healthPromotionScreeningLessons: Record<string, LessonContent> = {
  "health-promotion-rpn": {
    title: "Health Promotion and Disease Prevention",
    cellular: {
      title: "Foundations of Health Promotion",
      content:
        "Health promotion encompasses activities that enable individuals and communities to increase control over determinants of health, thereby improving overall well-being. At the cellular level, preventive interventions such as vaccination stimulate adaptive immune responses by presenting antigens to lymphocytes, triggering antibody production and immunological memory. Smoking cessation allows ciliated epithelial cells of the respiratory tract to regenerate, restoring mucociliary clearance within weeks to months. Obesity reduction decreases chronic low-grade inflammation driven by adipocyte-secreted cytokines such as TNF-alpha and IL-6, lowering the risk of insulin resistance and cardiovascular disease at the tissue level.",
    },
    riskFactors: [
      "Sedentary lifestyle and physical inactivity",
      "Tobacco use and secondhand smoke exposure",
      "Obesity with BMI greater than or equal to 30",
      "Incomplete or missed immunizations",
      "History of falls or impaired mobility",
      "Low health literacy",
      "Social isolation and lack of support systems",
    ],
    diagnostics: [
      "Review immunization records against current age-appropriate vaccination schedules and identify gaps requiring catch-up vaccines",
      "Screen for fall risk using validated tools such as the Morse Fall Scale or Timed Up and Go test",
      "Assess BMI and waist circumference as indicators of obesity-related health risk",
      "Conduct a smoking history assessment including pack-years and readiness to quit using the Stages of Change model",
      "Screen for depression and anxiety using validated tools (PHQ-9, GAD-7) as part of routine health promotion visits",
      "Review age-appropriate cancer screening status: cervical (Pap test), breast (mammography), colorectal (FIT/colonoscopy), lung (low-dose CT for high-risk smokers)",
    ],
    management: [
      "Implement age-appropriate vaccination schedules for routine childhood and adult immunizations",
      "Conduct fall risk assessment using the Morse Fall Scale",
      "Apply environmental modifications such as adequate lighting, handrails, and non-slip surfaces",
      "Use the Transtheoretical Model stages of change for smoking cessation readiness assessment",
      "Screen for obesity using BMI categories: underweight less than 18.5, normal 18.5 to 24.9, overweight 25 to 29.9, obese 30 and above",
      "Monitor developmental milestones including gross motor, fine motor, language, and social domains",
      "Educate on proper hand hygiene technique with a minimum of 20 seconds of handwashing",
      "Support chronic disease self-management through structured patient education",
    ],
    nursingActions: [
      "Assess patient readiness to learn and preferred learning style",
      "Provide culturally sensitive health education materials",
      "Document immunization status and identify gaps in vaccination schedule",
      "Perform fall risk screening on admission and with any change in condition",
      "Teach back method to confirm patient understanding",
      "Reinforce hand hygiene compliance among patients and families",
      "Report developmental milestone concerns to the interprofessional team",
    ],
    signs: {
      left: [
        "Fall risk indicators: unsteady gait, use of assistive devices, history of recent falls",
        "Stages of change: precontemplation, contemplation, preparation, action, maintenance",
        "BMI categories: underweight, normal weight, overweight, obese class I-III",
        "Developmental red flags: no babbling by 12 months, no words by 16 months, no two-word phrases by 24 months",
      ],
      right: [
        "Morse Fall Scale components: history of falling, secondary diagnosis, ambulatory aid, IV therapy, gait, mental status",
        "Hand hygiene moments: before patient contact, before aseptic task, after body fluid exposure, after patient contact, after touching surroundings",
        "Vaccination schedule milestones: DTaP series, MMR at 12-15 months, influenza annually, Tdap booster",
        "Patient education principles: assess readiness, set goals, deliver content, evaluate understanding",
      ],
    },
    medications: [
      {
        name: "Nicotine Replacement Therapy (patch, gum, lozenge)",
        type: "Smoking Cessation Aid",
        action:
          "Delivers controlled doses of nicotine to reduce withdrawal symptoms and cravings without the harmful chemicals found in tobacco smoke",
        sideEffects:
          "Skin irritation at patch site, insomnia, vivid dreams, nausea, mouth or jaw soreness with gum",
        contra:
          "Recent myocardial infarction within 2 weeks, unstable angina, serious cardiac arrhythmias, caution in pregnancy",
        pearl:
          "Rotate patch placement sites daily to minimize skin irritation and ensure consistent nicotine absorption",
      },
    ],
    pearls: [
      "The Morse Fall Scale score of 45 or higher indicates high fall risk requiring immediate interventions",
      "Teach back method is the gold standard for verifying patient comprehension of health education",
      "The stages of change model recognizes that behavior change is not linear and relapse is a normal part of the process",
      "Hand hygiene with alcohol-based hand rub is preferred unless hands are visibly soiled, in which case soap and water is required",
      "Childhood immunization schedules should be reviewed at every well-child visit to identify and address missed doses",
    ],
    quiz: [
      {
        question:
          "A nurse is using the Morse Fall Scale to assess a patient. Which score range indicates the patient is at high risk for falls?",
        options: [
          "0 to 24",
          "25 to 44",
          "45 or higher",
          "10 to 20",
        ],
        correct: 2,
        rationale:
          "A Morse Fall Scale score of 45 or higher classifies the patient as high risk for falls, requiring implementation of fall prevention interventions such as bed alarm, non-slip footwear, and close supervision.",
      },
      {
        question:
          "Which stage of the Transtheoretical Model describes a patient who acknowledges the need to quit smoking but has not yet set a quit date?",
        options: [
          "Precontemplation",
          "Contemplation",
          "Preparation",
          "Action",
        ],
        correct: 1,
        rationale:
          "In the contemplation stage, the individual recognizes the problem and is considering change within the next 6 months but has not yet committed to a specific plan or quit date.",
      },
      {
        question:
          "A parent asks when the first dose of MMR vaccine should be administered. What is the correct age?",
        options: [
          "6 months",
          "9 months",
          "12 to 15 months",
          "18 to 24 months",
        ],
        correct: 2,
        rationale:
          "The first dose of MMR (measles, mumps, rubella) vaccine is recommended at 12 to 15 months of age, with the second dose given at 4 to 6 years of age according to standard immunization schedules.",
      },
    ],
  },

  "health-promotion-rn": {
    title: "Health Promotion and Screening",
    cellular: {
      title: "Cellular Basis of Screening",
      content:
        "Cancer screening relies on detecting cellular dysplasia and neoplastic transformation before clinical symptoms develop. Cervical cancer screening identifies precancerous changes in squamous epithelial cells through Pap smear cytology, while HPV testing detects oncogenic viral DNA integrated into the host cell genome. Colorectal screening with colonoscopy permits identification and removal of adenomatous polyps before the adenoma-carcinoma sequence progresses to invasive malignancy. Cardiovascular risk screening targets endothelial dysfunction and atherosclerotic plaque formation, processes driven by lipid accumulation, smooth muscle proliferation, and chronic inflammatory cell infiltration within arterial walls.",
    },
    riskFactors: [
      "Family history of breast, cervical, colorectal, or lung cancer",
      "Tobacco use history of 20 pack-years or greater for lung cancer screening eligibility",
      "Hyperlipidemia and elevated ASCVD risk score",
      "Gestational diabetes in current or previous pregnancies",
      "Delayed or absent prenatal care",
      "Parental concern regarding developmental delays",
      "Obesity with BMI of 30 or greater",
      "History of recurrent falls in older adults",
    ],
    diagnostics: [
      "Mammography: annual or biennial starting at age 40-50 depending on guidelines",
      "Pap smear with HPV co-testing every 5 years starting at age 25-30",
      "Colonoscopy every 10 years starting at age 45, or FIT annually",
      "Low-dose CT chest annually for lung cancer screening in eligible adults aged 50-80 with 20 pack-year history",
      "Lipid panel every 4-6 years for average risk adults, more frequently with elevated ASCVD risk",
      "First trimester combined screening: nuchal translucency ultrasound plus serum PAPP-A and beta-hCG",
      "NIPT (cell-free fetal DNA) for chromosomal abnormality screening",
      "Oral glucose tolerance test at 24-28 weeks for gestational diabetes screening",
      "ASQ-3, M-CHAT-R/F, and Denver II for developmental screening in pediatric populations",
    ],
    management: [
      "Implement USPSTF and Canadian Task Force evidence-based screening recommendations",
      "Apply the 5 A's framework for smoking cessation: Ask, Advise, Assess, Assist, Arrange",
      "Use motivational interviewing techniques for obesity management and lifestyle change",
      "Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) for weight management",
      "Refer patients meeting criteria for bariatric surgery consultation when BMI exceeds 40 or BMI exceeds 35 with comorbidities",
      "Conduct multifactorial fall risk assessment including gait, balance, vision, medications, and environment",
      "Implement exercise programs such as Tai Chi or Otago Exercise Programme for fall prevention",
      "Review medications for fall risk contributors including sedatives, antihypertensives, and anticholinergics",
    ],
    nursingActions: [
      "Educate patients on age-appropriate cancer screening schedules and the importance of adherence",
      "Counsel pregnant patients on available prenatal screening options and informed consent",
      "Administer standardized developmental screening tools at recommended well-child intervals",
      "Document and communicate abnormal screening results to the healthcare provider promptly",
      "Provide evidence-based health teaching using current clinical practice guidelines",
      "Coordinate referrals for patients with positive screening results",
    ],
    signs: {
      left: [
        "Cancer warning signs: unexplained weight loss, persistent fatigue, change in bowel or bladder habits, non-healing sores",
        "Cardiovascular risk indicators: elevated LDL, low HDL, hypertension, diabetes, smoking history",
        "Prenatal screening abnormalities: elevated nuchal translucency, abnormal serum markers, positive NIPT",
        "Developmental screening red flags: failure to meet motor milestones, absent social smile by 2 months, no response to name by 12 months",
      ],
      right: [
        "USPSTF screening grade definitions: A and B are recommended, C is selective, D is discouraged, I is insufficient evidence",
        "5 A's framework: Ask about tobacco use, Advise to quit, Assess readiness, Assist with plan, Arrange follow-up",
        "Framingham risk categories: low (less than 10%), moderate (10-20%), high (greater than 20%) 10-year cardiovascular risk",
        "Fall prevention triad: exercise and balance training, medication review, environmental hazard reduction",
      ],
    },
    medications: [
      {
        name: "Nicotine Replacement Therapy (NRT) - patch, gum, lozenge, inhaler, nasal spray",
        type: "Smoking Cessation Aid",
        action:
          "Provides controlled nicotine delivery to alleviate withdrawal symptoms and reduce cravings, allowing gradual dose tapering over 8 to 12 weeks",
        sideEffects:
          "Skin irritation with patch, oral irritation with gum or lozenge, nasal irritation with spray, insomnia, vivid dreams",
        contra:
          "Recent acute cardiovascular event, temporomandibular joint disorder with gum form, caution in pregnancy where benefits must outweigh risks",
        pearl:
          "Combination therapy using a long-acting form (patch) with a short-acting form (gum or lozenge) for breakthrough cravings has higher quit rates than monotherapy",
      },
      {
        name: "Bupropion SR",
        type: "Smoking Cessation / Antidepressant",
        action:
          "Inhibits reuptake of norepinephrine and dopamine, reducing nicotine withdrawal symptoms and the urge to smoke; started 1-2 weeks before the target quit date",
        sideEffects:
          "Insomnia, dry mouth, agitation, headache, risk of seizures at higher doses",
        contra:
          "Seizure disorder, eating disorders (anorexia or bulimia), concurrent use of MAOIs, abrupt discontinuation of alcohol or sedatives",
        pearl:
          "Bupropion can be combined with NRT for enhanced efficacy and does not cause weight gain, making it an attractive option for patients concerned about post-cessation weight",
      },
    ],
    pearls: [
      "USPSTF Grade A and B recommendations are considered standard of care and should be routinely implemented in clinical practice",
      "The M-CHAT-R/F is administered at 18 and 24 months to screen for autism spectrum disorder and includes a follow-up interview to reduce false positives",
      "Combination NRT (patch plus short-acting form) yields the highest smoking cessation rates among pharmacological interventions",
      "Prenatal screening is optional and requires informed consent; positive screening results indicate increased risk, not a definitive diagnosis",
      "The Otago Exercise Programme has strong evidence for reducing falls in community-dwelling older adults by 35%",
    ],
    quiz: [
      {
        question:
          "According to USPSTF guidelines, at what age should average-risk adults begin colorectal cancer screening?",
        options: [
          "40 years",
          "45 years",
          "50 years",
          "55 years",
        ],
        correct: 1,
        rationale:
          "The USPSTF updated its recommendation in 2021 to begin colorectal cancer screening at age 45 for average-risk adults, which can include colonoscopy every 10 years, FIT annually, or other approved modalities.",
      },
      {
        question:
          "A nurse is counseling a patient about smoking cessation using the 5 A's framework. The patient states they are ready to quit. Which step should the nurse implement next?",
        options: [
          "Ask about tobacco use",
          "Advise the patient to quit",
          "Assist with developing a quit plan",
          "Arrange for a follow-up visit",
        ],
        correct: 2,
        rationale:
          "After Asking about use, Advising to quit, and Assessing readiness (the patient is ready), the next step is to Assist by developing a quit plan that may include setting a quit date, prescribing pharmacotherapy, and providing counseling resources.",
      },
      {
        question:
          "Which prenatal screening test analyzes cell-free fetal DNA from maternal blood to detect chromosomal abnormalities?",
        options: [
          "First trimester combined screening",
          "Non-invasive prenatal testing (NIPT)",
          "Amniocentesis",
          "Quad screen",
        ],
        correct: 1,
        rationale:
          "NIPT (non-invasive prenatal testing) analyzes cell-free fetal DNA circulating in maternal blood and can detect trisomy 21, 18, and 13 with high sensitivity. It is a screening test, not a diagnostic test, and positive results require confirmatory testing.",
      },
    ],
  },

  "health-promotion-np": {
    title: "Health Promotion and Preventive Medicine",
    cellular: {
      title: "Molecular and Cellular Foundations of",
      content:
        "Preventive medicine at the advanced practice level requires understanding the molecular mechanisms underpinning screening and intervention strategies. Statin therapy for primary cardiovascular prevention inhibits HMG-CoA reductase in hepatocytes, upregulating LDL receptor expression and reducing circulating atherogenic lipoprotein particles that drive endothelial injury and plaque formation. GLP-1 receptor agonists used in obesity pharmacotherapy act on pancreatic beta cells to enhance glucose-dependent insulin secretion while simultaneously acting on hypothalamic appetite centers to reduce caloric intake. Varenicline for tobacco cessation is a partial agonist at the alpha-4-beta-2 nicotinic acetylcholine receptor, providing enough dopamine release to reduce cravings while blocking the rewarding effects of nicotine if the patient resumes smoking.",
    },
    riskFactors: [
      "10-year ASCVD risk score of 7.5% or greater warranting statin therapy discussion",
      "20 pack-year smoking history in adults aged 50-80 for lung cancer screening eligibility",
      "Immunocompromised status requiring modified vaccination schedules",
      "Pregnancy requiring specific immunization considerations and contraindications",
      "BMI of 30 or greater with weight-related comorbidities",
      "T-score of negative 2.5 or below on DEXA scan indicating osteoporosis",
      "FRAX 10-year hip fracture probability of 3% or greater or major osteoporotic fracture probability of 20% or greater",
      "High-risk sexual behavior or multiple partners warranting STI screening",
    ],
    diagnostics: [
      "Low-dose CT chest: annual for adults 50-80 with 20 or more pack-year history who currently smoke or quit within past 15 years",
      "PSA testing: shared decision-making for men aged 55-69, not routinely recommended after age 70",
      "DEXA scan: women 65 and older, men 70 and older, or younger with risk factors; FRAX calculator for treatment decisions",
      "Lipid panel with ASCVD risk calculator to guide statin initiation threshold",
      "Comprehensive STI screening: HIV, syphilis, gonorrhea, chlamydia based on risk factors and population guidelines",
      "First trimester combined screening, NIPT, anatomy ultrasound at 18-22 weeks, GDM screening at 24-28 weeks",
      "Hepatitis B and C screening per USPSTF recommendations",
      "AAA screening with one-time abdominal ultrasound for men aged 65-75 who have ever smoked",
    ],
    management: [
      "Prescribe statins for primary prevention when 10-year ASCVD risk is 7.5% or greater after shared decision-making",
      "Aspirin for primary prevention is no longer routinely recommended; limit to select patients aged 40-59 with 10% or greater ASCVD risk after risk-benefit discussion",
      "Initiate varenicline 0.5 mg daily for days 1-3, then 0.5 mg twice daily for days 4-7, then 1 mg twice daily for 12 weeks with target quit date at day 8",
      "Prescribe bupropion SR 150 mg daily for 3 days then 150 mg twice daily, starting 1-2 weeks before quit date",
      "Order obesity pharmacotherapy: orlistat 120 mg three times daily with meals, or GLP-1 agonists such as semaglutide for weight management",
      "Administer modified immunization schedules for immunocompromised patients, avoiding live vaccines",
      "Order and interpret prenatal screening results, providing genetic counseling referral for abnormal findings",
      "Initiate bisphosphonate therapy for osteoporosis when T-score is negative 2.5 or below, or when FRAX indicates elevated fracture risk",
    ],
    nursingActions: [
      "Conduct comprehensive risk assessment using validated tools including ASCVD calculator, FRAX, and USPSTF screening criteria",
      "Engage in shared decision-making for screening tests where guidelines recommend individualized approaches",
      "Prescribe and manage tobacco cessation pharmacotherapy with appropriate follow-up",
      "Order and interpret DEXA scans and apply FRAX results to treatment decisions",
      "Manage immunization schedules for special populations including pregnant, immunocompromised, and traveling patients",
      "Coordinate care for patients with positive screening results including specialist referrals",
    ],
    signs: {
      left: [
        "Statin initiation criteria: LDL 190 or greater regardless of risk, diabetes aged 40-75, ASCVD risk 7.5% or greater with shared decision-making",
        "Lung CT screening criteria: aged 50-80, 20 pack-year history, currently smoking or quit within 15 years",
        "DEXA T-score interpretation: normal (above negative 1.0), osteopenia (negative 1.0 to negative 2.5), osteoporosis (negative 2.5 or below)",
        "Varenicline mechanism: partial agonist at nicotinic receptors providing controlled dopamine release while blocking nicotine reward",
      ],
      right: [
        "USPSTF Grade A examples: colorectal screening 45-75, cervical screening 21-65, hypertension screening adults 18 and older",
        "Immunization contraindications in pregnancy: live vaccines (MMR, varicella, live influenza), safe vaccines (Tdap, inactivated influenza, COVID-19)",
        "PSA shared decision-making: discuss potential benefits of early detection against harms of false positives, overdiagnosis, and overtreatment",
        "GLP-1 agonist benefits: weight loss of 15% or more of body weight, cardiovascular risk reduction, improved glycemic control",
      ],
    },
    medications: [
      {
        name: "Varenicline (Champix/Chantix)",
        type: "Smoking Cessation Agent",
        action:
          "Partial agonist at alpha-4-beta-2 nicotinic acetylcholine receptors; stimulates moderate dopamine release to reduce cravings and withdrawal symptoms while blocking the reinforcing effects of nicotine",
        sideEffects:
          "Nausea (most common, take with food and full glass of water), insomnia, abnormal dreams, headache, flatulence",
        contra:
          "History of serious hypersensitivity reaction to varenicline; use with caution in patients with psychiatric illness though FDA removed black box warning in 2016",
        pearl:
          "Varenicline has the highest single-agent quit rate among smoking cessation medications at approximately 33% at 12 months; nausea can be minimized by dose titration and taking with food",
      },
      {
        name: "Orlistat (Xenical/Alli)",
        type: "Weight Management Agent",
        action:
          "Inhibits pancreatic and gastric lipase in the GI tract, preventing hydrolysis and absorption of approximately 30% of dietary fat",
        sideEffects:
          "Oily spotting, flatus with discharge, fecal urgency, fatty or oily stools, fat-soluble vitamin deficiency (A, D, E, K)",
        contra:
          "Chronic malabsorption syndrome, cholestasis, pregnancy, concurrent use of cyclosporine",
        pearl:
          "Patients must take a daily multivitamin containing fat-soluble vitamins at least 2 hours before or after orlistat to prevent deficiencies; dietary fat intake should be distributed evenly across meals",
      },
      {
        name: "Atorvastatin (Lipitor)",
        type: "HMG-CoA Reductase Inhibitor (Statin)",
        action:
          "Competitively inhibits HMG-CoA reductase in the liver, reducing cholesterol synthesis and upregulating hepatic LDL receptor expression to increase clearance of LDL from the bloodstream",
        sideEffects:
          "Myalgia, elevated liver transaminases, rhabdomyolysis (rare but serious), new-onset diabetes, GI disturbances",
        contra:
          "Active liver disease or unexplained persistent elevations of serum transaminases, pregnancy and lactation",
        pearl:
          "High-intensity statin therapy (atorvastatin 40-80 mg) is recommended for primary prevention when ASCVD risk is 20% or greater; obtain baseline liver function tests and lipid panel before initiation",
      },
    ],
    pearls: [
      "NP certification exams heavily weight USPSTF screening intervals; memorize Grade A and B recommendations for all major conditions",
      "Aspirin for primary prevention of cardiovascular disease has shifted: current guidelines recommend against routine use in adults 60 and older due to bleeding risk outweighing benefit",
      "Varenicline is the most effective single-agent pharmacotherapy for smoking cessation with approximately double the quit rate compared to placebo",
      "FRAX calculator results guide treatment decisions for osteopenia; treatment is recommended when 10-year hip fracture probability is 3% or greater or major osteoporotic fracture probability is 20% or greater",
      "Live vaccines are contraindicated in immunocompromised patients and during pregnancy; inactivated vaccines are generally safe",
      "Shared decision-making is required for PSA screening, lung cancer screening, and low-dose aspirin in primary prevention according to current USPSTF guidelines",
    ],
    quiz: [
      {
        question:
          "An NP is evaluating a 55-year-old male with a 25 pack-year smoking history who quit smoking 10 years ago. Is this patient eligible for annual low-dose CT lung cancer screening?",
        options: [
          "No, because the patient has already quit smoking",
          "Yes, the patient meets all eligibility criteria for annual screening",
          "No, because the patient must be at least 60 years old",
          "Yes, but only if the patient has symptoms of lung disease",
        ],
        correct: 1,
        rationale:
          "USPSTF recommends annual low-dose CT screening for adults aged 50-80 with a 20 pack-year smoking history who currently smoke or have quit within the past 15 years. This patient is 55, has 25 pack-years, and quit 10 years ago, meeting all criteria.",
      },
      {
        question:
          "Which ASCVD 10-year risk threshold warrants a discussion about initiating statin therapy for primary prevention?",
        options: [
          "5.0% or greater",
          "7.5% or greater",
          "10.0% or greater",
          "20.0% or greater",
        ],
        correct: 1,
        rationale:
          "Current guidelines recommend discussing statin therapy initiation when the 10-year ASCVD risk score is 7.5% or greater, using shared decision-making that considers patient preferences, potential benefits, adverse effects, and drug interactions.",
      },
      {
        question:
          "A postmenopausal woman has a DEXA scan showing a T-score of negative 2.0 at the lumbar spine. How should the clinician classify and manage this result?",
        options: [
          "Normal bone density; no treatment needed",
          "Osteopenia; calculate FRAX score to determine if treatment is warranted",
          "Osteoporosis; initiate bisphosphonate therapy immediately",
          "Severe osteoporosis; refer for orthopedic consultation",
        ],
        correct: 1,
        rationale:
          "A T-score between negative 1.0 and negative 2.5 indicates osteopenia. The FRAX calculator should be used to estimate 10-year fracture probability. Treatment is recommended when the 10-year hip fracture risk is 3% or greater or major osteoporotic fracture risk is 20% or greater.",
      },
    ],
  },
};
