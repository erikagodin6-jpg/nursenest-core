import type { FlashcardData } from "./flashcards-rpn";

export const publicHealthFlashcards: FlashcardData[] = [
  {
    id: "ph-q1",
    type: "question",
    question: "What is the primary goal of primary prevention in public health nursing?",
    options: ["Early detection of disease", "Treatment of existing conditions", "Prevention of disease before it occurs", "Rehabilitation after illness"],
    correctIndex: 2,
    answer: "Primary prevention aims to prevent disease before it occurs through health promotion and specific protection. Examples include immunizations, health education, seat belt use, nutrition counseling, and environmental modifications. It targets healthy populations.",
    category: "Prevention Levels",
    difficulty: 1
  },
  {
    id: "ph-q2",
    type: "question",
    question: "A nurse is planning a community health education program. Which epidemiological measure describes the number of new cases of a disease in a population during a specific time period?",
    options: ["Prevalence", "Incidence", "Mortality rate", "Morbidity rate"],
    correctIndex: 1,
    answer: "Incidence refers to the number of NEW cases of a disease occurring in a population during a specific time period. Prevalence refers to the total number of existing cases (new + old) at a given point in time. Incidence measures risk; prevalence measures burden.",
    category: "Epidemiology",
    difficulty: 2
  },
  {
    id: "ph-q3",
    type: "question",
    question: "Which type of immunity results from receiving a vaccine?",
    options: ["Natural active immunity", "Artificial active immunity", "Natural passive immunity", "Artificial passive immunity"],
    correctIndex: 1,
    answer: "Vaccines provide artificial active immunity by stimulating the immune system to produce antibodies without causing the disease. Natural active immunity comes from recovering from illness. Passive immunity (natural: placental transfer; artificial: immune globulin) provides temporary protection.",
    category: "Immunization",
    difficulty: 1
  },
  {
    id: "ph-q4",
    type: "question",
    question: "During a disease outbreak investigation, what is the first step the public health nurse should take?",
    options: ["Implement quarantine measures", "Verify the diagnosis and confirm the outbreak", "Notify the media", "Begin mass vaccination"],
    correctIndex: 1,
    answer: "The first step in outbreak investigation is to verify the diagnosis and confirm the outbreak exists (determine if the number of cases exceeds the expected number). Steps: verify diagnosis → define/identify cases → describe by person/place/time → develop hypotheses → evaluate → implement control measures → communicate findings.",
    category: "Epidemiology",
    difficulty: 2
  },
  {
    id: "ph-q5",
    type: "question",
    question: "What is herd immunity and what percentage of the population typically needs to be vaccinated to achieve it?",
    options: ["Individual protection from one dose; 50%", "Community protection when enough people are immune; generally 80-95%", "Total elimination of a pathogen; 100%", "Natural immunity in livestock; not applicable to humans"],
    correctIndex: 1,
    answer: "Herd immunity occurs when a sufficient proportion of the population is immune (through vaccination or prior infection) to reduce disease transmission, protecting those who cannot be vaccinated. The threshold varies by disease: measles requires ~95%, polio ~80-85%, influenza ~75-90%.",
    category: "Immunization",
    difficulty: 2
  },
  {
    id: "ph-q6",
    type: "question",
    question: "A public health nurse is conducting a community assessment. What is the most important data to collect first?",
    options: ["Hospital readmission rates", "Demographic data including age, race, income, and health status of the population", "Number of healthcare facilities", "Air quality index"],
    correctIndex: 1,
    answer: "Community assessment begins with demographic data to understand the population's characteristics, health status, and needs. This includes age distribution, racial/ethnic composition, income levels, education, health indicators, morbidity/mortality data, and access to resources.",
    category: "Community Assessment",
    difficulty: 1
  },
  {
    id: "ph-q7",
    type: "question",
    question: "Which communicable disease requires airborne precautions?",
    options: ["Influenza", "MRSA", "Tuberculosis", "C. difficile"],
    correctIndex: 2,
    answer: "Tuberculosis requires airborne precautions (negative pressure room, N95 respirator, door closed). Other airborne diseases include measles, varicella (chickenpox), and disseminated herpes zoster. TB is caused by Mycobacterium tuberculosis and is spread by airborne droplet nuclei.",
    category: "Communicable Disease",
    difficulty: 1
  },
  {
    id: "ph-q8",
    type: "question",
    question: "What is the recommended childhood immunization schedule for the first dose of MMR vaccine?",
    options: ["At birth", "2 months", "12-15 months", "4-6 years"],
    correctIndex: 2,
    answer: "The first dose of MMR (measles, mumps, rubella) vaccine is recommended at 12-15 months of age, with the second dose at 4-6 years. MMR is a live attenuated vaccine and is contraindicated in pregnancy, immunocompromised individuals, and those with anaphylaxis to neomycin or gelatin.",
    category: "Immunization",
    difficulty: 1
  },
  {
    id: "ph-q9",
    type: "question",
    question: "A nurse is teaching a community about lead poisoning prevention. Which population is at highest risk?",
    options: ["Adolescents", "Children under 6 years living in homes built before 1978", "Elderly adults", "Pregnant women in new construction"],
    correctIndex: 1,
    answer: "Children under 6 years in homes built before 1978 are at highest risk for lead poisoning from lead-based paint. Lead causes neurodevelopmental damage. Blood lead level ≥5 mcg/dL requires follow-up. Prevention: test homes for lead paint, wet-mop frequently, handwashing before meals.",
    category: "Environmental Health",
    difficulty: 1
  },
  {
    id: "ph-q10",
    type: "question",
    question: "What is the chain of infection and how can public health nurses break it?",
    options: ["Virus → bacteria → fungus; use antibiotics", "Agent → reservoir → portal of exit → mode of transmission → portal of entry → susceptible host; intervene at any link", "Source → air → person; use masks", "Contact → droplet → airborne; use isolation"],
    correctIndex: 1,
    answer: "The chain of infection has 6 links: infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, and susceptible host. Break any link to prevent transmission. Examples: hand hygiene (transmission), vaccines (susceptible host), isolation (portal of exit).",
    category: "Communicable Disease",
    difficulty: 2
  },
  {
    id: "ph-q11",
    type: "question",
    question: "Which disease is classified as a Category A bioterrorism agent?",
    options: ["Brucellosis", "Anthrax", "Q fever", "Typhus"],
    correctIndex: 1,
    answer: "Category A bioterrorism agents pose the highest risk to national security. They include anthrax (Bacillus anthracis), smallpox (variola), plague (Yersinia pestis), botulism (Clostridium botulinum), tularemia, and viral hemorrhagic fevers. They are easily disseminated with high mortality.",
    category: "Disaster Preparedness",
    difficulty: 2
  },
  {
    id: "ph-q12",
    type: "question",
    question: "A positive tuberculin skin test (TST/PPD) is indicated by induration of what size in an immunocompromised individual?",
    options: ["≥5 mm", "≥10 mm", "≥15 mm", "≥20 mm"],
    correctIndex: 0,
    answer: "For immunocompromised individuals (HIV, organ transplant, close TB contacts, CXR changes), ≥5 mm induration is positive. For healthcare workers and high-risk groups, ≥10 mm is positive. For low-risk populations, ≥15 mm is positive. Read at 48-72 hours; measure induration, NOT redness.",
    category: "Communicable Disease",
    difficulty: 2
  },
  {
    id: "ph-q13",
    type: "question",
    question: "What is the public health nurse's role in disaster preparedness?",
    options: ["Provide individual patient care only", "Coordinate triage, surveillance, communication, and community-level interventions", "Focus solely on mental health", "Only respond after the disaster has ended"],
    correctIndex: 1,
    answer: "Public health nurses in disaster preparedness: develop emergency plans, coordinate triage (START triage system), conduct disease surveillance, manage shelters, provide community education, ensure communication systems, distribute resources, and address mental health needs. They serve as leaders in community response.",
    category: "Disaster Preparedness",
    difficulty: 2
  },
  {
    id: "ph-q14",
    type: "question",
    question: "What is secondary prevention?",
    options: ["Preventing disease from occurring", "Early detection and prompt treatment of disease", "Rehabilitation and preventing complications", "Health promotion activities"],
    correctIndex: 1,
    answer: "Secondary prevention focuses on early detection and prompt treatment to halt disease progression and limit disability. Examples: mammography screening, Pap smears, blood pressure screening, tuberculosis skin testing, colonoscopy, and newborn metabolic screening.",
    category: "Prevention Levels",
    difficulty: 1
  },
  {
    id: "ph-q15",
    type: "question",
    question: "Which reportable disease must be reported to the health department immediately (within 24 hours)?",
    options: ["Chlamydia", "Measles", "Lyme disease", "Hepatitis C"],
    correctIndex: 1,
    answer: "Measles requires immediate (within 24 hours) reporting due to its high transmissibility. Other immediately reportable diseases include: anthrax, botulism, cholera, plague, rabies, and SARS. Reporting requirements vary by jurisdiction. Public health nurses are mandated reporters.",
    category: "Communicable Disease",
    difficulty: 2
  },
  {
    id: "ph-q16",
    type: "question",
    question: "A community has a high prevalence of childhood obesity. What type of prevention strategy would a public health nurse implement?",
    options: ["Tertiary prevention only", "Primary prevention through health education and environmental changes", "Secondary prevention through screening only", "No nursing intervention is appropriate"],
    correctIndex: 1,
    answer: "Primary prevention strategies for childhood obesity include: school-based nutrition education, increasing physical activity programs, promoting healthy school lunch options, community gardens, reducing screen time, and advocating for safe recreational spaces. Address social determinants of health.",
    category: "Health Promotion",
    difficulty: 1
  },
  {
    id: "ph-q17",
    type: "question",
    question: "What is the Healthy People 2030 framework?",
    options: ["A clinical practice guideline for hospitals", "National health objectives to improve health outcomes and reduce disparities", "An insurance program for the uninsured", "A medication safety initiative"],
    correctIndex: 1,
    answer: "Healthy People 2030 provides science-based national objectives to improve health and well-being over the decade. Key focus areas include: social determinants of health, health equity, health literacy, elimination of health disparities, and data-driven benchmarks for measurable outcomes.",
    category: "Health Promotion",
    difficulty: 1
  },
  {
    id: "ph-q18",
    type: "question",
    question: "In a mass casualty incident using START triage, which color tag indicates the client should receive treatment last (expectant)?",
    options: ["Red", "Yellow", "Green", "Black"],
    correctIndex: 3,
    answer: "Black tag = expectant/deceased (injuries incompatible with survival). Red = immediate (life-threatening but salvageable). Yellow = delayed (serious but can wait). Green = minor (walking wounded). START triage: assess respirations, perfusion, and mental status in that order.",
    category: "Disaster Preparedness",
    difficulty: 2
  },
  {
    id: "ph-q19",
    type: "question",
    question: "What is the recommended vaccination for healthcare workers who have a needlestick injury from a hepatitis B-positive source?",
    options: ["Nothing if previously vaccinated with adequate titer", "Hepatitis B vaccine and HBIG regardless of vaccination status", "Hepatitis A vaccine", "Interferon therapy"],
    correctIndex: 0,
    answer: "If the healthcare worker was previously vaccinated AND has a documented adequate anti-HBs titer (≥10 mIU/mL), no treatment is needed. If unvaccinated or non-responder, administer HBIG and begin the hepatitis B vaccine series. Check anti-HBs titer if vaccination status is unknown.",
    category: "Occupational Health",
    difficulty: 2
  },
  {
    id: "ph-q20",
    type: "question",
    question: "What are social determinants of health?",
    options: ["Genetic factors only", "Economic stability, education, healthcare access, neighborhood/environment, and social/community context", "Individual health behaviors only", "Healthcare costs and insurance"],
    correctIndex: 1,
    answer: "Social determinants of health (SDOH) are conditions in which people are born, grow, live, work, and age that affect health outcomes. Five domains: economic stability, education access/quality, healthcare access/quality, neighborhood/built environment, and social/community context. They account for 30-55% of health outcomes.",
    category: "Health Equity",
    difficulty: 1
  },
  {
    id: "ph-q21",
    type: "question",
    question: "A nurse is counseling a client about HIV prevention. What is PrEP?",
    options: ["Post-exposure prophylaxis", "Pre-exposure prophylaxis - daily medication to prevent HIV", "A type of HIV test", "A vaccine against HIV"],
    correctIndex: 1,
    answer: "PrEP (pre-exposure prophylaxis) is daily oral medication (emtricitabine/tenofovir) taken by HIV-negative individuals at high risk to prevent HIV acquisition. When taken consistently, PrEP reduces HIV risk by ~99% through sex and ~74% among people who inject drugs. Requires regular HIV testing and follow-up.",
    category: "Communicable Disease",
    difficulty: 2
  },
  {
    id: "ph-q22",
    type: "question",
    question: "What is the window period in HIV testing?",
    options: ["Time between symptom onset and diagnosis", "Time between infection and detectable antibodies (typically 2-12 weeks)", "Time between diagnosis and treatment", "Time between treatment and viral suppression"],
    correctIndex: 1,
    answer: "The window period is the time between HIV infection and when the test can detect it. Antibody tests: 3-12 weeks. Antigen/antibody (4th gen) tests: 2-6 weeks. Nucleic acid tests (NAT): 10-33 days. During the window period, the person is infectious but may test negative.",
    category: "Communicable Disease",
    difficulty: 2
  },
  {
    id: "ph-q23",
    type: "question",
    question: "Which immunization is given as a live attenuated vaccine and is contraindicated in pregnancy?",
    options: ["Influenza (inactivated)", "Tdap", "MMR", "Hepatitis B"],
    correctIndex: 2,
    answer: "MMR (measles, mumps, rubella) is a live attenuated vaccine contraindicated in pregnancy due to theoretical risk to the fetus. Other live vaccines: varicella, rotavirus, live attenuated influenza (nasal spray), oral polio, BCG, and yellow fever. Wait 4 weeks after live vaccine before becoming pregnant.",
    category: "Immunization",
    difficulty: 1
  },
  {
    id: "ph-q24",
    type: "question",
    question: "A community nurse identifies that a neighborhood lacks access to fresh fruits and vegetables. This is known as a:",
    options: ["Food desert", "Food insecurity", "Malnutrition", "Health disparity"],
    correctIndex: 0,
    answer: "A food desert is a geographic area with limited access to affordable, nutritious food, particularly fresh fruits and vegetables. This contributes to health disparities including higher rates of obesity, diabetes, and cardiovascular disease. Interventions include mobile markets, community gardens, and policy advocacy.",
    category: "Environmental Health",
    difficulty: 1
  },
  {
    id: "ph-q25",
    type: "question",
    question: "What is the recommended schedule for the DTaP vaccine in children?",
    options: ["One dose at 12 months", "5 doses: 2, 4, 6, 15-18 months, and 4-6 years", "3 doses: 2, 4, 6 months", "2 doses: 12 and 18 months"],
    correctIndex: 1,
    answer: "DTaP (diphtheria, tetanus, acellular pertussis) is given in 5 doses: 2, 4, 6, 15-18 months, and 4-6 years. Tdap booster is recommended at 11-12 years and during each pregnancy (27-36 weeks). Td booster every 10 years for adults.",
    category: "Immunization",
    difficulty: 1
  },
  {
    id: "ph-q26",
    type: "question",
    question: "What is the epidemiological triad model?",
    options: ["Primary, secondary, tertiary prevention", "Agent, host, and environment", "Incidence, prevalence, and mortality", "Sensitivity, specificity, and predictive value"],
    correctIndex: 1,
    answer: "The epidemiological triad consists of agent (causative factor), host (organism harboring the disease), and environment (external factors that affect disease). Disease occurs when there is an imbalance among these three factors. Used to analyze communicable and non-communicable diseases.",
    category: "Epidemiology",
    difficulty: 1
  },
  {
    id: "ph-q27",
    type: "question",
    question: "A public health nurse is planning a community vaccination clinic. What is the correct storage temperature for most vaccines?",
    options: ["Room temperature", "2-8°C (36-46°F)", "-20°C (-4°F)", "Any cool temperature"],
    correctIndex: 1,
    answer: "Most vaccines require refrigerator storage at 2-8°C (36-46°F). Some vaccines (varicella, MMRV, live attenuated influenza) require frozen storage at -50°C to -15°C. The cold chain must be maintained from manufacturer to administration. Use calibrated thermometers and monitor twice daily.",
    category: "Immunization",
    difficulty: 2
  },
  {
    id: "ph-q28",
    type: "question",
    question: "What is contact tracing and when is it used?",
    options: ["Tracking patient records", "Identifying and notifying individuals who have been exposed to an infectious disease", "Following up on immunization records", "Monitoring hospital discharge patients"],
    correctIndex: 1,
    answer: "Contact tracing identifies people who may have been exposed to an infectious disease to prevent further transmission. Used for TB, STIs, COVID-19, and other communicable diseases. Steps: identify contacts, notify and educate, offer testing/treatment, and monitor for symptoms.",
    category: "Communicable Disease",
    difficulty: 1
  },
  {
    id: "ph-q29",
    type: "question",
    question: "What is the difference between quarantine and isolation?",
    options: ["They are the same", "Quarantine separates exposed individuals; isolation separates infected individuals", "Quarantine is for animals; isolation is for humans", "Quarantine is voluntary; isolation requires a court order"],
    correctIndex: 1,
    answer: "Quarantine restricts the movement of people who were exposed to a contagious disease to see if they become sick (well persons). Isolation separates people who are confirmed sick with a contagious disease from those who are not sick. Both are legal public health powers.",
    category: "Communicable Disease",
    difficulty: 1
  },
  {
    id: "ph-q30",
    type: "question",
    question: "A nurse is educating about safe water practices in a developing community. What is the most effective method to make water safe for drinking?",
    options: ["Letting it sit for 24 hours", "Boiling for at least 1 minute", "Adding lemon juice", "Filtering through cloth only"],
    correctIndex: 1,
    answer: "Boiling water for at least 1 minute (3 minutes at elevations >2000 m) effectively kills bacteria, viruses, and parasites. Other methods include chemical treatment (chlorine, iodine), filtration systems, and UV disinfection. Boiling is the most accessible and reliable method globally.",
    category: "Environmental Health",
    difficulty: 1
  },
  {
    id: "ph-q31",
    type: "question",
    question: "What screening is recommended for all adults aged 18-79 according to the USPSTF?",
    options: ["Hepatitis A screening", "Hepatitis C screening", "HIV screening only", "Hepatitis B screening"],
    correctIndex: 1,
    answer: "The USPSTF recommends one-time hepatitis C screening for all adults aged 18-79 years (Grade B recommendation). Risk factors for HCV include injection drug use, blood transfusion before 1992, and chronic hemodialysis. Early detection enables curative treatment with direct-acting antivirals.",
    category: "Screening",
    difficulty: 2
  },
  {
    id: "ph-q32",
    type: "question",
    question: "What is the nurse's role in mandatory reporting?",
    options: ["Report only if asked by the health department", "Report suspected cases of communicable diseases, child/elder abuse, and certain conditions as required by law", "Report only confirmed diagnoses", "Reporting is optional based on nurse judgment"],
    correctIndex: 1,
    answer: "Nurses are mandatory reporters for communicable diseases (TB, HIV, STIs, foodborne illness), suspected child/elder abuse and neglect, and certain injuries (gunshot wounds). Report to the local health department. Failure to report may result in legal consequences.",
    category: "Legal/Ethical",
    difficulty: 1
  },
  {
    id: "ph-q33",
    type: "question",
    question: "What is the recommended age range for the HPV vaccine?",
    options: ["6-12 months", "11-12 years (can start at 9 years)", "18-25 years only", "Over 26 years only"],
    correctIndex: 1,
    answer: "HPV vaccine is routinely recommended at 11-12 years (can start at age 9). Two doses are given if started before age 15; three doses if started at 15-26 years. Catch-up vaccination available through age 26 (shared decision-making for 27-45). Prevents cervical, anal, oropharyngeal, and other HPV-related cancers.",
    category: "Immunization",
    difficulty: 1
  },
  {
    id: "ph-q34",
    type: "question",
    question: "What is the goal of tertiary prevention?",
    options: ["Prevent disease occurrence", "Early detection", "Minimize disability and restore function in those with established disease", "Immunization"],
    correctIndex: 2,
    answer: "Tertiary prevention aims to minimize disability, prevent complications, and restore function in individuals with established disease. Examples: cardiac rehabilitation, diabetic foot care education, stroke rehabilitation, support groups for chronic illness, and assistive devices.",
    category: "Prevention Levels",
    difficulty: 1
  },
  {
    id: "ph-q35",
    type: "question",
    question: "A nurse suspects a food-borne disease outbreak at a local restaurant. Which pathogen has the shortest incubation period (1-6 hours)?",
    options: ["Salmonella", "Staphylococcus aureus", "E. coli O157:H7", "Hepatitis A"],
    correctIndex: 1,
    answer: "Staphylococcus aureus has the shortest incubation (1-6 hours) because it produces a preformed enterotoxin in food. Symptoms: sudden nausea, vomiting, diarrhea, abdominal cramps. Self-limiting (24-48 hours). Common sources: dairy, meats, salads left at room temperature.",
    category: "Communicable Disease",
    difficulty: 2
  },
  {
    id: "ph-q36",
    type: "question",
    question: "What is an endemic disease?",
    options: ["A disease affecting the entire world", "A disease constantly present in a particular geographic area", "A sudden outbreak of disease", "A disease that has been eradicated"],
    correctIndex: 1,
    answer: "Endemic: disease constantly present at a baseline level in a geographic area (e.g., malaria in sub-Saharan Africa). Epidemic: sudden increase above expected levels. Pandemic: epidemic affecting multiple countries/continents. Sporadic: irregular, occasional occurrence.",
    category: "Epidemiology",
    difficulty: 1
  },
  {
    id: "ph-q37",
    type: "question",
    question: "Which sexually transmitted infection is the most commonly reported in the United States?",
    options: ["Gonorrhea", "Syphilis", "Chlamydia", "HIV"],
    correctIndex: 2,
    answer: "Chlamydia is the most commonly reported STI in the US. It is often asymptomatic, especially in women. Screen all sexually active women under 25 annually. Treated with azithromycin or doxycycline. Untreated chlamydia can cause PID, ectopic pregnancy, and infertility.",
    category: "Communicable Disease",
    difficulty: 1
  },
  {
    id: "ph-q38",
    type: "question",
    question: "During a community health fair, a nurse is providing blood pressure screenings. A client has a BP of 142/92 mmHg. How should this be classified?",
    options: ["Normal", "Elevated", "Stage 1 hypertension", "Stage 2 hypertension"],
    correctIndex: 2,
    answer: "Per ACC/AHA guidelines: Normal <120/<80, Elevated 120-129/<80, Stage 1 HTN 130-139/80-89, Stage 2 HTN ≥140/≥90. A BP of 142/92 is Stage 1 (systolic) crossing into Stage 2 territory. Verify on two separate occasions. Educate on lifestyle modifications.",
    category: "Screening",
    difficulty: 1
  },
  {
    id: "ph-q39",
    type: "question",
    question: "What is the PRECEDE-PROCEED model used for in public health?",
    options: ["Clinical diagnosis", "Planning and evaluating health promotion programs", "Epidemiological surveillance", "Emergency preparedness"],
    correctIndex: 1,
    answer: "PRECEDE-PROCEED is a comprehensive planning model for health education and promotion programs. PRECEDE (planning): social, epidemiological, behavioral, educational, and administrative assessment. PROCEED (implementation): implementation, process evaluation, impact evaluation, and outcome evaluation.",
    category: "Health Promotion",
    difficulty: 2
  },
  {
    id: "ph-q40",
    type: "question",
    question: "A nurse is planning an immunization clinic for older adults. Which vaccines are recommended for adults 65 and older?",
    options: ["MMR and varicella only", "Influenza (annual), pneumococcal (PCV20 or PCV15+PPSV23), Tdap/Td, zoster (Shingrix), and COVID-19", "Hepatitis B only", "No vaccines are needed after age 65"],
    correctIndex: 1,
    answer: "Adults ≥65 should receive: annual influenza vaccine (high-dose or adjuvanted preferred), pneumococcal vaccine (PCV20 or PCV15 followed by PPSV23), Shingrix (recombinant zoster vaccine, 2 doses), Td/Tdap booster, and COVID-19 vaccine per current guidelines.",
    category: "Immunization",
    difficulty: 2
  },
  {
    id: "ph-q41",
    type: "question",
    question: "What is the nurse's priority when caring for a client with active tuberculosis in the community?",
    options: ["Encourage the client to wear a surgical mask", "Ensure the client completes the full course of treatment through directly observed therapy (DOT)", "Recommend bedrest for 6 months", "Isolate the client permanently"],
    correctIndex: 1,
    answer: "Directly observed therapy (DOT) is the gold standard for TB treatment compliance. A healthcare worker watches the client take each dose of medication. TB treatment typically involves 4 drugs (RIPE: rifampin, isoniazid, pyrazinamide, ethambutol) for 6-9 months. Non-adherence leads to drug-resistant TB.",
    category: "Communicable Disease",
    difficulty: 2
  },
  {
    id: "ph-q42",
    type: "term",
    question: "Define health disparities vs. health equity.",
    answer: "Health disparities are preventable differences in health outcomes among population groups linked to social, economic, or environmental disadvantage. Health equity is the attainment of the highest level of health for all people, requiring elimination of disparities and addressing social determinants of health.",
    category: "Health Equity",
    difficulty: 1
  },
  {
    id: "ph-q43",
    type: "question",
    question: "A nurse is providing education about Zika virus prevention. What is the primary mode of transmission?",
    options: ["Airborne droplets", "Fecal-oral route", "Bite of infected Aedes mosquito", "Direct person-to-person contact"],
    correctIndex: 2,
    answer: "Zika virus is primarily transmitted by the bite of infected Aedes species mosquitoes (A. aegypti and A. albopictus). Also transmitted sexually, through blood transfusion, and from mother to fetus. In pregnancy, Zika causes microcephaly and other birth defects. Prevention: mosquito avoidance, repellents, condoms.",
    category: "Communicable Disease",
    difficulty: 2
  },
  {
    id: "ph-q44",
    type: "question",
    question: "What type of epidemiological study follows a group of people over time to determine disease incidence?",
    options: ["Cross-sectional study", "Case-control study", "Cohort study", "Ecological study"],
    correctIndex: 2,
    answer: "A cohort study (prospective or retrospective) follows a group of people over time, comparing exposed and unexposed groups, to determine disease incidence and relative risk. Cross-sectional studies provide a snapshot. Case-control studies look backward from disease to exposure.",
    category: "Epidemiology",
    difficulty: 2
  },
  {
    id: "ph-q45",
    type: "question",
    question: "Which vaccine requires annual administration due to frequent antigenic variation of the pathogen?",
    options: ["Hepatitis B", "MMR", "Influenza", "Pneumococcal"],
    correctIndex: 2,
    answer: "Influenza vaccine is given annually because influenza viruses undergo frequent antigenic drift (minor mutations) and occasional antigenic shift (major changes). The vaccine composition is updated each year based on WHO surveillance data to match circulating strains.",
    category: "Immunization",
    difficulty: 1
  },
  {
    id: "ph-q46",
    type: "question",
    question: "What is the role of a public health nurse in cultural competence?",
    options: ["Impose Western healthcare practices on all clients", "Assess cultural beliefs, adapt care delivery, and advocate for culturally appropriate services", "Ignore cultural differences", "Only serve clients from the same cultural background"],
    correctIndex: 1,
    answer: "Culturally competent nursing includes: assessing cultural health beliefs and practices, using interpreters (not family members) when needed, adapting health education to literacy levels and cultural norms, recognizing health disparities, and advocating for accessible, equitable services.",
    category: "Health Equity",
    difficulty: 1
  },
  {
    id: "ph-q47",
    type: "question",
    question: "A community experiences flooding. What is the priority public health concern in the immediate aftermath?",
    options: ["Chronic disease management", "Safe drinking water, sanitation, and infectious disease prevention", "Cancer screening", "Mental health only"],
    correctIndex: 1,
    answer: "After flooding, priorities include ensuring safe drinking water (boil advisories), sanitation (sewage contamination), prevention of waterborne diseases (cholera, leptospirosis, hepatitis A), wound care, mold prevention, tetanus prophylaxis, and mental health assessment. Establish shelters with basic sanitation.",
    category: "Disaster Preparedness",
    difficulty: 2
  },
  {
    id: "ph-q48",
    type: "question",
    question: "What is the recommended cervical cancer screening guideline for average-risk women?",
    options: ["Annual Pap smear starting at age 18", "Pap smear every 3 years starting at age 21 or co-testing (Pap + HPV) every 5 years starting at age 30", "Pap smear only after sexual debut", "No screening needed if vaccinated for HPV"],
    correctIndex: 1,
    answer: "USPSTF/ACOG: Pap smear every 3 years for ages 21-29. Ages 30-65: Pap every 3 years, HPV test alone every 5 years, or co-testing (Pap + HPV) every 5 years. No screening before age 21 or after 65 (with adequate prior screening). HPV vaccination does not eliminate need for screening.",
    category: "Screening",
    difficulty: 2
  },
  {
    id: "ph-q49",
    type: "question",
    question: "What is the incubation period for COVID-19?",
    options: ["1-2 days", "2-14 days (average 5 days)", "21-30 days", "30-60 days"],
    correctIndex: 1,
    answer: "COVID-19 incubation period is typically 2-14 days, with an average of 5 days. Individuals may be infectious 1-2 days before symptom onset. This pre-symptomatic transmission contributes to the difficulty of containment. Isolation period and guidelines are updated as variants emerge.",
    category: "Communicable Disease",
    difficulty: 1
  },
  {
    id: "ph-q50",
    type: "question",
    question: "What is a Notifiable Disease Surveillance System (NNDSS)?",
    options: ["A hospital-based infection control program", "A national system for reporting specific diseases to the CDC for tracking and response", "A pharmacy database for medication tracking", "An insurance claims database"],
    correctIndex: 1,
    answer: "The NNDSS is a nationwide collaboration for monitoring notifiable diseases. Healthcare providers report specific diseases to local/state health departments, which forward data to the CDC. This surveillance enables detection of outbreaks, monitoring of disease trends, and evaluation of prevention strategies.",
    category: "Epidemiology",
    difficulty: 2
  },
  {
    id: "ph-q51",
    type: "question",
    question: "A public health nurse is planning a smoking cessation program. Which framework is best for understanding stages of behavior change?",
    options: ["Maslow's hierarchy of needs", "Transtheoretical model (Stages of Change)", "Piaget's cognitive development", "Erikson's psychosocial stages"],
    correctIndex: 1,
    answer: "The Transtheoretical Model (Stages of Change) by Prochaska and DiClemente: Precontemplation (not thinking about change), Contemplation (considering change), Preparation (planning to change), Action (actively changing), Maintenance (sustaining change). Tailor interventions to the client's current stage.",
    category: "Health Promotion",
    difficulty: 2
  },
  {
    id: "ph-q52",
    type: "question",
    question: "What is the leading cause of death in the United States?",
    options: ["Cancer", "Heart disease", "COVID-19", "Accidents"],
    correctIndex: 1,
    answer: "Heart disease remains the leading cause of death in the United States, followed by cancer, COVID-19 (varied by year), accidents/unintentional injuries, and stroke. Public health efforts focus on modifiable risk factors: diet, exercise, smoking cessation, blood pressure and cholesterol management.",
    category: "Epidemiology",
    difficulty: 1
  },
  {
    id: "ph-q53",
    type: "question",
    question: "What is the difference between sensitivity and specificity of a screening test?",
    options: ["They mean the same thing", "Sensitivity detects true positives; specificity detects true negatives", "Sensitivity is for treatment; specificity is for prevention", "Sensitivity is for rare diseases; specificity is for common diseases"],
    correctIndex: 1,
    answer: "Sensitivity = ability to correctly identify those WITH the disease (true positive rate). A highly sensitive test has few false negatives (SnNOut: sensitive test, negative result rules out). Specificity = ability to correctly identify those WITHOUT the disease (true negative rate). High specificity has few false positives (SpPIn: specific test, positive result rules in).",
    category: "Epidemiology",
    difficulty: 3
  },
  {
    id: "ph-q54",
    type: "question",
    question: "A nurse is providing education about safe food handling. At what temperature should hot foods be maintained to prevent bacterial growth?",
    options: ["Above 100°F (38°C)", "Above 140°F (60°C)", "Above 120°F (49°C)", "Above 160°F (71°C)"],
    correctIndex: 1,
    answer: "Hot foods should be maintained at ≥140°F (60°C) and cold foods at ≤40°F (4°C). The 'danger zone' for bacterial growth is 40-140°F (4-60°C). Do not leave perishable food in the danger zone for more than 2 hours (1 hour if ambient temperature >90°F).",
    category: "Environmental Health",
    difficulty: 1
  },
  {
    id: "ph-q55",
    type: "question",
    question: "What is the role of community health workers (CHWs) in public health?",
    options: ["Replace registered nurses", "Serve as trusted lay health workers who bridge the gap between communities and healthcare systems", "Prescribe medications", "Only provide transportation"],
    correctIndex: 1,
    answer: "Community health workers are trained lay members of the community who provide culturally appropriate health education, facilitate access to care, conduct outreach, provide informal counseling, and help navigate the healthcare system. They are trusted members who reduce health disparities and improve outcomes.",
    category: "Health Promotion",
    difficulty: 1
  }
];
