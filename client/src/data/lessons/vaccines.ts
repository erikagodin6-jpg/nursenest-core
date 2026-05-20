import type { LessonContent } from "./types";

const childhoodVaccines: LessonContent = {
  title: "Childhood & Adolescent Immunizations",
  cellular: {
    title: "Vaccine Immunology & Schedule Rationale",
    content: "Immunizations are one of the most heavily tested topics in nursing licensure examinations because they integrate immunology, safety, patient education, and public health priorities. Vaccines stimulate active immunity by exposing the immune system to antigens (attenuated, inactivated, or component-based) without causing disease. The immune system produces memory B and T cells that provide rapid response upon future exposure. The immunization schedule is designed around developmental immunology: vaccines are timed when maternal antibody protection wanes and immune system maturity allows adequate response. Key vaccines include: Hepatitis B (given at birth: prevents chronic liver disease and hepatocellular carcinoma), Rotavirus (oral, live vaccine: prevents severe gastroenteritis and dehydration), Haemophilus influenzae type b (Hib: prevents meningitis, epiglottitis, and invasive disease in young children), MMR (measles, mumps, rubella: live vaccine given after 12 months when maternal antibodies decline), Meningococcal (MCV: prevents Neisseria meningitidis meningitis, given to adolescents), Pneumococcal (PCV: prevents Streptococcus pneumoniae invasive disease), and HPV (prevents human papillomavirus-related cancers, given in adolescence). Vaccine reactions range from mild (fever, injection site soreness, irritability) to rare severe reactions (anaphylaxis)."
  },
  riskFactors: [
    "Unvaccinated or under-vaccinated children",
    "Immunocompromised patients (contraindication for live vaccines)",
    "Premature infants (may need adjusted schedules)",
    "Children with egg allergy (specific vaccines: influenza)",
    "History of severe allergic reaction to vaccine component",
    "Household contacts of immunocompromised individuals",
    "International travel to endemic regions",
    "Daycare or school attendance without up-to-date immunizations"
  ],
  diagnostics: [
    "Review immunization records for completeness and catch-up needs",
    "Assess contraindications and precautions before each vaccine administration",
    "Screen for immunodeficiency before administering live vaccines",
    "Monitor for adverse reactions for minimum 15 minutes post-vaccination",
    "Document vaccine name, lot number, manufacturer, site, route, date, and administrator",
    "Report adverse events through the Vaccine Adverse Event Reporting System (VAERS)"
  ],
  management: [
    "Follow current immunization schedule for age-appropriate vaccine administration",
    "Catch-up scheduling for missed or delayed vaccines",
    "Acetaminophen or ibuprofen for post-vaccination fever and discomfort (reactive, not prophylactic)",
    "Cold compress to injection site for local reactions",
    "Epinephrine immediately available at all vaccination sites for anaphylaxis",
    "Contraindication documentation and alternative vaccine planning when needed",
    "Education on expected reactions vs reportable adverse events"
  ],
  nursingActions: [
    "Verify vaccine schedule and assess for contraindications before administration",
    "Obtain informed consent and provide Vaccine Information Statements (VIS)",
    "Use correct route, site, and needle length for patient age and vaccine type",
    "Observe patient for minimum 15 minutes post-vaccination for adverse reactions",
    "Document all required information: vaccine, lot number, site, route, VIS date provided",
    "Educate parents on expected mild reactions and when to seek medical attention",
    "Maintain cold chain and proper vaccine storage and handling",
    "Report serious adverse events through VAERS"
  ],
  signs: {
    left: [
      "Expected mild reactions: low-grade fever, injection site redness/swelling, irritability",
      "Hep B: given at birth (first dose): series of 3 doses",
      "Rotavirus: ORAL live vaccine: given in infancy only",
      "MMR: live vaccine: given after 12 months",
      "HPV: given to adolescents (ages 11-12): cancer prevention"
    ],
    right: [
      "Anaphylaxis: rare but life-threatening: have epinephrine available",
      "Live vaccines contraindicated in immunocompromised patients",
      "High fever (>40.5C/105F) after vaccination: report and evaluate",
      "Seizures following vaccination: document and evaluate for future doses",
      "Intussusception risk with rotavirus vaccine (very rare)"
    ]
  },
  medications: [
    { name: "Hepatitis B Vaccine", type: "Inactivated vaccine", action: "Produces immunity against hepatitis B virus; given at birth to prevent vertical transmission and chronic infection", sideEffects: "Injection site soreness, low-grade fever", contra: "Severe allergic reaction to previous dose or yeast", pearl: "Given within 12 hours of birth; if mother is HBsAg+, infant also receives HBIG" },
    { name: "MMR Vaccine", type: "Live attenuated vaccine", action: "Provides immunity against measles, mumps, and rubella; contains live viruses", sideEffects: "Fever, rash (7-10 days post-vaccination), joint pain", contra: "Immunocompromised, pregnancy, severe allergy to neomycin/gelatin", pearl: "LIVE vaccine: cannot give to immunocompromised or pregnant patients. Given at 12-15 months." },
    { name: "Rotavirus Vaccine", type: "Live oral vaccine", action: "Prevents rotavirus gastroenteritis: a leading cause of severe dehydration in infants", sideEffects: "Mild diarrhea, irritability, fever", contra: "SCID, history of intussusception, intestinal malformation", pearl: "ORAL administration only: cannot be given if infant vomits during administration" },
    { name: "HPV Vaccine", type: "Recombinant vaccine", action: "Prevents HPV-related cancers (cervical, oropharyngeal, anal); recommended for ages 11-12", sideEffects: "Injection site pain, syncope (fainting: observe 15 minutes post-vaccination)", contra: "Severe allergy to yeast or previous dose, pregnancy", pearl: "Syncope is common in adolescents: have patient sit/lie down for 15 minutes after injection" }
  ],
  pearls: [
    "Hepatitis B vaccine is given at BIRTH: do not delay first dose",
    "Live vaccines (MMR, varicella, rotavirus) are contraindicated in immunocompromised and pregnant patients",
    "Rotavirus is an ORAL vaccine: the only oral vaccine on the routine infant schedule",
    "MMR is given after 12 months because maternal antibodies interfere before then",
    "HPV vaccine prevents cancer: given to adolescents (11-12 years); observe 15 min for syncope",
    "Mild fever and injection site reactions are EXPECTED: not reasons to withhold future doses",
    "Anaphylaxis kit must be available whenever vaccines are administered",
    "Egg allergy is generally NOT a contraindication to MMR (grown in fibroblast cells, not eggs)",
    "Meningococcal vaccine is recommended for adolescents and college-age students"
  ],
  quiz: [
    { question: "When should the first dose of Hepatitis B vaccine be administered?", options: ["At the 2-month well-baby visit", "At birth (within 12 hours)", "At 6 months", "At 12 months"], correct: 1, rationale: "Hepatitis B vaccine first dose is given at birth (within 12 hours) to prevent vertical transmission. If the mother is HBsAg+, HBIG is also given." },
    { question: "Which vaccines are contraindicated in immunocompromised patients?", options: ["All inactivated vaccines", "Live attenuated vaccines (MMR, varicella, rotavirus)", "Hepatitis B only", "No vaccines are contraindicated"], correct: 1, rationale: "Live attenuated vaccines contain weakened but viable organisms that can cause disease in immunocompromised patients. Inactivated vaccines are safe." },
    { question: "An adolescent receives the HPV vaccine and feels dizzy. What is the appropriate nursing action?", options: ["Call emergency services", "Have the patient sit or lie down and observe for 15 minutes: syncope is a common reaction", "Administer epinephrine", "Cancel remaining vaccine series"], correct: 1, rationale: "Syncope (fainting) is common after HPV vaccination in adolescents. Standard practice is to have patients sit/lie down and observe for 15 minutes post-injection." },
    { question: "A parent asks why their baby can't receive the MMR vaccine at 6 months. What is the correct explanation?", options: ["The baby is too small", "Maternal antibodies interfere with immune response before 12 months, making the vaccine less effective", "The vaccine hasn't been tested in infants", "It causes more side effects in young infants"], correct: 1, rationale: "Maternal antibodies transferred during pregnancy persist for several months and can neutralize the live vaccine virus, preventing adequate immune response. MMR is given after 12 months when maternal antibodies have declined." }
  ]
};

const vaccineReactions: LessonContent = {
  title: "Vaccine Reactions & Safety Management",
  cellular: {
    title: "Immune Response & Adverse Event Recognition",
    content: "Understanding vaccine reactions is essential for nursing practice because vaccines are administered across all clinical settings. Reactions range from expected immune responses to rare serious adverse events. Local reactions (injection site redness, swelling, pain) are the most common and reflect the immune system's inflammatory response to the antigen. Systemic reactions include low-grade fever, irritability, fatigue, and malaise: these indicate immune activation and are generally self-limiting. Febrile seizures may occur in children with fever following vaccination but are typically benign and do not indicate epilepsy. Anaphylaxis is the most serious vaccine reaction: it is rare but potentially fatal, occurring within minutes to hours of administration. Signs include urticaria, angioedema, bronchospasm, hypotension, and cardiovascular collapse. Epinephrine is the first-line treatment and must be immediately available whenever vaccines are given. Contraindications vs precautions is a critical distinction: a true contraindication (severe allergic reaction to previous dose or component) means the vaccine should NOT be given; a precaution (moderate illness, recent blood product) means the provider weighs risks and benefits. Mild illness, low-grade fever, current antibiotic use, and previous mild reactions are NOT contraindications."
  },
  riskFactors: [
    "History of anaphylaxis to previous vaccine dose or component",
    "Known allergy to vaccine components (gelatin, neomycin, yeast)",
    "Immunocompromised state (risk with live vaccines)",
    "History of Guillain-Barre syndrome within 6 weeks of prior vaccination",
    "Encephalopathy within 7 days of pertussis-containing vaccine",
    "Adolescent age group (higher syncope risk)",
    "History of febrile seizures (precaution, not contraindication)",
    "Concurrent moderate-to-severe acute illness (precaution)"
  ],
  diagnostics: [
    "Assess for signs of anaphylaxis: urticaria, angioedema, bronchospasm, hypotension",
    "Monitor temperature for post-vaccination fever",
    "Assess injection site for excessive swelling, redness, or induration",
    "Differentiate expected mild reactions from reportable adverse events",
    "Document timing and severity of any adverse reaction",
    "Report serious adverse events through VAERS within required timeframe"
  ],
  management: [
    "Epinephrine IM for anaphylaxis: first-line treatment without delay",
    "Supportive care for anaphylaxis: airway management, IV fluids, oxygen",
    "Acetaminophen or ibuprofen for fever and pain (reactive treatment only)",
    "Cold compress for local injection site reactions",
    "Observation and supportive care for febrile seizures",
    "Documentation and evaluation of serious reactions for future vaccine decisions",
    "Referral to allergist for evaluation after severe reactions"
  ],
  nursingActions: [
    "Have emergency equipment and epinephrine immediately available at all vaccination sites",
    "Observe all patients for minimum 15 minutes post-vaccination",
    "Observe adolescents in seated or supine position to prevent syncope-related injury",
    "Assess for early signs of anaphylaxis and initiate treatment immediately",
    "Educate caregivers on expected mild reactions and when to seek emergency care",
    "Document vaccine adverse events accurately with timing, severity, and interventions",
    "Report serious adverse events through VAERS as required",
    "Differentiate true contraindications from precautions and invalid contraindications"
  ],
  signs: {
    left: [
      "Expected local: redness, swelling, tenderness at injection site",
      "Expected systemic: low-grade fever, irritability, fatigue",
      "Febrile seizures may occur but are typically benign",
      "Mild illness is NOT a reason to delay vaccination",
      "Document vaccine type, lot number, site, route, and provider"
    ],
    right: [
      "Anaphylaxis: urticaria, angioedema, bronchospasm, hypotension: emergency",
      "High fever (>40.5C/105F): report and evaluate",
      "Inconsolable crying >3 hours: document and evaluate",
      "Encephalopathy within 7 days of pertussis vaccine: contraindication to future doses",
      "Guillain-Barre syndrome within 6 weeks: evaluate risk for future doses"
    ]
  },
  medications: [
    { name: "Epinephrine 1:1000", type: "Sympathomimetic", action: "First-line treatment for anaphylaxis: reverses bronchospasm, hypotension, and angioedema", sideEffects: "Tachycardia, anxiety, tremor, hypertension", contra: "None absolute in anaphylaxis: lifesaving", pearl: "Must be immediately available at every vaccination site. IM injection into lateral thigh is preferred." },
    { name: "Acetaminophen/Ibuprofen", type: "Antipyretic/analgesic", action: "Manages post-vaccination fever and injection site discomfort", sideEffects: "Hepatotoxicity (acetaminophen), GI upset (ibuprofen)", contra: "Acetaminophen: liver disease; Ibuprofen: <6 months old", pearl: "Prophylactic antipyretics are generally NOT recommended: may reduce immune response" }
  ],
  pearls: [
    "Mild illness, low-grade fever, and antibiotic use are NOT contraindications to vaccination",
    "Epinephrine must be immediately available at EVERY vaccination site",
    "Anaphylaxis can occur minutes to hours after administration: observe minimum 15 minutes",
    "Prophylactic antipyretics are generally NOT recommended: may reduce vaccine efficacy",
    "True contraindication: severe allergic reaction to previous dose or vaccine component",
    "Document: vaccine name, lot number, manufacturer, site, route, date, and administrator",
    "Report serious adverse events through the adverse event reporting system",
    "Previous mild reaction (low fever, local swelling) does NOT contraindicate future doses"
  ],
  quiz: [
    { question: "A child develops urticaria, wheezing, and hypotension 10 minutes after vaccination. What is the first-line treatment?", options: ["Diphenhydramine", "Epinephrine IM", "Albuterol nebulizer", "IV normal saline"], correct: 1, rationale: "Anaphylaxis requires immediate epinephrine IM. Antihistamines and other treatments are adjunctive but epinephrine is the only first-line treatment." },
    { question: "A parent brings a child with a mild upper respiratory infection for scheduled vaccinations. Should the vaccines be given?", options: ["No, reschedule when well", "Yes: mild illness is NOT a contraindication to vaccination", "Only give inactivated vaccines", "Only if afebrile"], correct: 1, rationale: "Mild illness with or without low-grade fever is NOT a contraindication. Delaying vaccines for minor illness creates missed immunization opportunities." },
    { question: "Why are prophylactic antipyretics generally NOT recommended before vaccination?", options: ["They cause allergic reactions", "They may reduce the immune response to the vaccine", "They interact with vaccines", "They mask anaphylaxis"], correct: 1, rationale: "Research suggests prophylactic antipyretics may blunt the immune response to vaccines, potentially reducing efficacy. Treat fever reactively rather than prophylactically." }
  ]
};

export const vaccinesLessons: Record<string, LessonContent> = {
  "childhood-immunizations": childhoodVaccines,
  "vaccine-reactions": vaccineReactions,
};
