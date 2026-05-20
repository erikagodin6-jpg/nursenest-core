import type { LessonContent } from "./types";

export const rnContentBatch008Lessons: Record<string, LessonContent> = {
  "anti-infectives-bacterial-resistance-rn": {
    title: "Anti-infectives, Bacterial Structure, and Antimicrobial Resistance",
    cellular: {
      title: "Bacterial Cell Structure and Mechanisms of Antibiotic Resistance",
      content: "Bacteria are classified by Gram stain: Gram-positive organisms (S. aureus, Streptococcus, Enterococcus) have a thick peptidoglycan cell wall that retains crystal violet stain, while Gram-negative organisms (E. coli, Pseudomonas, Klebsiella) have a thin peptidoglycan layer surrounded by an outer lipopolysaccharide (LPS) membrane that acts as an endotoxin. Antibiotics target essential bacterial processes: cell wall synthesis (beta-lactams, vancomycin), protein synthesis (aminoglycosides target 30S ribosome; macrolides, tetracyclines target 30S; chloramphenicol, clindamycin target 50S), DNA replication (fluoroquinolones inhibit DNA gyrase/topoisomerase IV), folic acid synthesis (sulfonamides, trimethoprim), and cell membrane integrity (daptomycin, polymyxins). Antimicrobial resistance develops through multiple mechanisms: enzymatic degradation (beta-lactamases including ESBLs and carbapenemases), target modification (altered PBPs in MRSA, ribosomal methylation), efflux pumps (pump antibiotic out of the cell), porin mutations (reduced drug entry in Gram-negatives), and biofilm formation. Resistance genes spread horizontally between bacteria via plasmids, transposons, and transformation. Multidrug-resistant organisms (MDROs) including MRSA, VRE, ESBL-producing Enterobacteriaceae, and CRE (carbapenem-resistant Enterobacteriaceae) represent critical public health threats. Antibiotic stewardship—using the right drug, right dose, right duration for the right indication—is essential to slow resistance development."
    },
    riskFactors: [
      "MDRO colonization/infection risk: prior antibiotic use (strongest risk factor), prolonged hospitalization, ICU admission, invasive devices (ventilator, central line, urinary catheter)",
      "Healthcare facility residence (long-term care, rehabilitation centers)",
      "Immunosuppression: organ transplant, chemotherapy, HIV/AIDS, chronic corticosteroid therapy",
      "International travel (exposure to resistant organisms endemic in other regions)",
      "Poor hand hygiene compliance by healthcare workers (primary transmission vector for MDROs)",
      "Inappropriate antibiotic prescribing: unnecessary antibiotics, broad-spectrum when narrow would suffice, incomplete courses"
    ],
    diagnostics: [
      "Culture and sensitivity (C&S): gold standard for identifying organism and guiding antibiotic therapy; obtain BEFORE starting antibiotics when possible",
      "Blood cultures: two sets from separate sites; if central line present, one peripheral and one from the line",
      "Gram stain: rapid preliminary identification guiding empiric therapy (Gram-positive cocci in clusters = Staph; chains = Strep; Gram-negative rods = Enterobacteriaceae or Pseudomonas)",
      "Procalcitonin: helps differentiate bacterial from viral infection; guides antibiotic duration (stop when procalcitonin <0.25 or 80% decline from peak)",
      "Antibiogram: hospital-specific data showing local resistance patterns that guide empiric antibiotic selection",
      "Rapid molecular testing (PCR): identifies organisms and resistance genes (mecA for MRSA, vanA/vanB for VRE) within hours vs days for traditional culture"
    ],
    management: [
      "Empiric therapy: broad-spectrum based on suspected source and local antibiogram; de-escalate to narrow-spectrum when C&S results available",
      "Vancomycin for suspected MRSA (trough 15-20 for serious infections); daptomycin or linezolid for MRSA if vancomycin fails",
      "Piperacillin-tazobactam or meropenem for suspected Gram-negative including Pseudomonas",
      "Combination therapy for severe sepsis: beta-lactam PLUS aminoglycoside or fluoroquinolone for synergistic bactericidal activity",
      "Antibiotic stewardship principles: obtain cultures before antibiotics, use narrowest-spectrum agent effective, shortest effective duration, IV-to-oral conversion when stable",
      "Contact precautions for MDROs: gown and gloves for MRSA, VRE, ESBL, CRE; dedicated equipment"
    ],
    nursingActions: [
      "Obtain all cultures BEFORE starting antibiotics (blood cultures, urine, wound, sputum as indicated); do not delay antibiotics >60 minutes in sepsis",
      "Verify allergy history: distinguish true allergy (anaphylaxis, angioedema, urticaria) from intolerance (GI upset); document reaction type",
      "Administer antibiotics on time every time—therapeutic drug levels depend on consistent dosing intervals",
      "Monitor for adverse effects: nephrotoxicity (aminoglycosides, vancomycin—monitor troughs), ototoxicity (aminoglycosides), hepatotoxicity, C. difficile diarrhea, allergic reactions",
      "Monitor vancomycin trough levels: draw 30 minutes before 4th or 5th dose; target depends on infection site",
      "Monitor aminoglycoside peak and trough: trough <1 mcg/mL for gentamicin to prevent nephrotoxicity",
      "Assess IV site every shift: phlebitis is common with vancomycin and potassium-containing antibiotics",
      "Educate patients: complete the full course, do not share antibiotics, do not request antibiotics for viral infections",
      "Implement appropriate isolation precautions: contact for MRSA/VRE/CRE, droplet for N. meningitidis, airborne for TB"
    ],
    assessmentFindings: [
      "Signs of systemic infection (SIRS criteria): temperature >38°C or <36°C, heart rate >90, respiratory rate >20, WBC >12,000 or <4,000 or >10% bands",
      "Localized infection: erythema, warmth, swelling, pain, purulent drainage (abscess, cellulitis, wound infection)",
      "Drug-related adverse effects: rash (allergic reaction), diarrhea (C. difficile), tinnitus/hearing loss (aminoglycosides), renal function changes",
      "Superinfection: oral candidiasis (thrush), vaginal yeast infection, C. difficile colitis from disruption of normal flora"
    ],
    signs: {
      left: [
        "Fever, tachycardia, leukocytosis (infection)",
        "Localized: erythema, warmth, swelling, drainage",
        "Rash, pruritus (drug allergy)",
        "Diarrhea (C. difficile superinfection)"
      ],
      right: [
        "Nephrotoxicity: rising creatinine, decreased UOP",
        "Ototoxicity: tinnitus, hearing loss, vertigo",
        "Anaphylaxis: hypotension, bronchospasm, angioedema",
        "Red Man syndrome: flushing with rapid vancomycin"
      ]
    },
    medications: [
      { name: "Piperacillin-Tazobactam (Zosyn)", type: "Extended-spectrum Penicillin / Beta-lactamase Inhibitor", action: "Piperacillin inhibits cell wall synthesis with broad-spectrum coverage. Tazobactam inhibits most beta-lactamases, restoring activity against ESBL-producing organisms. Covers Gram-positives (excluding MRSA), Gram-negatives including Pseudomonas, and anaerobes", sideEffects: "Hypersensitivity reactions (cross-reactivity with penicillin allergy), thrombocytopenia, diarrhea (C. difficile), seizures at high doses in renal impairment", contra: "History of anaphylaxis to any penicillin; dose adjust for renal impairment", pearl: "Workhorse antibiotic for nosocomial infections. Extended infusion (over 4 hours) achieves better pharmacodynamic targets than standard 30-minute infusion—improves clinical cure rates. Often paired with vancomycin for broad empiric coverage in sepsis (MRSA + Gram-negatives + anaerobes). Contains sodium—consider in fluid-restricted patients." },
      { name: "Meropenem", type: "Carbapenem", action: "Ultra-broad-spectrum beta-lactam that is resistant to most beta-lactamases including ESBLs. Covers Gram-positive (excluding MRSA and Enterococcus faecium), all Gram-negative including ESBL-producing organisms and most Pseudomonas, and anaerobes. Reserved for serious infections with resistant organisms", sideEffects: "Seizures (lower risk than imipenem), C. difficile-associated diarrhea, nausea, thrombocytopenia, allergic reactions", contra: "Anaphylaxis to carbapenems; cross-reactivity with penicillin is <1% but exercise caution in severe penicillin allergy. AVOID with valproic acid (dramatically reduces valproic acid levels causing seizure breakthrough)", pearl: "Last-line defense for many resistant Gram-negative infections. If Pseudomonas is suspected, extended infusion over 3 hours maximizes time above MIC. Carbapenem-resistant organisms (CRE) represent a critical threat—reserve carbapenems for culture-proven resistant infections to preserve efficacy. Reduces valproic acid levels by 60-100%—never combine." }
    ],
    pearls: [
      "Culture BEFORE antibiotics in all cases—but NEVER delay antibiotics >60 minutes in sepsis for the sake of cultures",
      "Red Man syndrome is NOT a vancomycin allergy—it is rate-related histamine release; slow the infusion and premedicate with diphenhydramine",
      "C. difficile risk increases with: broad-spectrum antibiotics, prolonged courses, fluoroquinolones, clindamycin, and advanced age",
      "Meropenem + valproic acid = seizures: carbapenems reduce valproic acid levels by 60-100%; this combination should never be used",
      "Antibiotic stewardship saves lives: narrowest spectrum, shortest effective duration, de-escalate when cultures return, IV-to-oral when stable"
    ],
    quiz: [
      { question: "A nurse is preparing to administer the first dose of IV ceftriaxone to a patient with a documented 'penicillin allergy: rash as a child.' Should the nurse administer the medication?", options: ["No, absolutely contraindicated with any penicillin allergy", "Yes, the cross-reactivity between penicillins and cephalosporins is <2%, and a childhood rash is low-risk; administer with monitoring", "Only if given simultaneously with epinephrine", "Only if desensitization is performed first"], correct: 1, rationale: "The cross-reactivity between penicillins and third-generation cephalosporins is <2%. A non-specific childhood rash is a low-risk allergy history. The medication can be safely administered with standard monitoring. Anaphylaxis history to penicillin would warrant more caution, but even then, third-generation cephalosporins are often considered safe." },
      { question: "A patient on vancomycin has a trough level of 8 mcg/mL for treatment of MRSA osteomyelitis. What should the nurse anticipate?", options: ["The dose is therapeutic; continue current regimen", "The dose needs to be increased—target trough is 15-20 mcg/mL for bone infections", "The dose is too high and should be reduced", "Vancomycin should be discontinued and switched to oral antibiotics"], correct: 1, rationale: "For serious MRSA infections including osteomyelitis, endocarditis, and bacteremia, vancomycin trough targets are 15-20 mcg/mL. A trough of 8 is subtherapeutic and may lead to treatment failure and development of vancomycin-intermediate S. aureus (VISA). The dose or frequency should be increased." },
      { question: "Which infection control precaution is appropriate for a patient with MRSA wound infection?", options: ["Standard precautions only", "Contact precautions with gown and gloves", "Airborne precautions with N95 respirator", "Droplet precautions with surgical mask"], correct: 1, rationale: "MRSA is transmitted by direct contact. Contact precautions (gown and gloves upon room entry, dedicated equipment) are required. Airborne precautions are for TB, measles, varicella. Droplet precautions are for meningococcus, influenza, pertussis." }
    ]
  },

  "vaccines-immunology-comprehensive-rn": {
    title: "Vaccines and Immunology: Comprehensive RN Knowledge",
    cellular: {
      title: "Immune Response and Vaccine Mechanisms",
      content: "The immune system comprises innate (nonspecific, immediate) and adaptive (specific, memory-forming) immunity. Innate immunity includes physical barriers (skin, mucous membranes), cellular defenses (neutrophils, macrophages, NK cells), and complement system activation. Adaptive immunity involves humoral (B-cell/antibody-mediated) and cell-mediated (T-cell) responses. B cells differentiate into plasma cells producing antibodies (IgG, IgM, IgA, IgE, IgD) and memory B cells. T cells include CD4+ helper T cells (coordinate immune response), CD8+ cytotoxic T cells (kill infected cells), and regulatory T cells (prevent autoimmunity). Vaccines exploit adaptive immunity by presenting antigens that stimulate the immune response without causing disease. Live attenuated vaccines (MMR, varicella, rotavirus, intranasal influenza) contain weakened organisms that replicate and produce broad, long-lasting immunity. Inactivated/killed vaccines (influenza injection, hepatitis A, rabies) contain non-replicating organisms requiring multiple doses and boosters. Subunit/toxoid vaccines (hepatitis B, DTaP, HPV, pneumococcal conjugate) contain purified antigens or inactivated toxins. mRNA vaccines (COVID-19 Pfizer/Moderna) instruct cells to produce spike protein antigen, triggering both humoral and cellular immune responses. Primary immune response (first exposure) produces IgM first, then IgG over 1-2 weeks. Secondary response (booster/re-exposure) produces rapid, high-titer IgG from memory cells."
    },
    riskFactors: [
      "Under-vaccination risk factors: parental vaccine hesitancy, lack of access to healthcare, missed well-child visits, homelessness, international adoption",
      "Vaccine-preventable disease risk: unvaccinated or under-vaccinated individuals, immunocompromised patients, international travelers",
      "Adverse reaction risk: prior anaphylaxis to vaccine component (e.g., egg allergy with some influenza vaccines, gelatin allergy, neomycin allergy)",
      "Immunocompromised patients: cannot receive live vaccines but have increased need for inactivated vaccines and protection through herd immunity",
      "Pregnancy: live vaccines contraindicated; inactivated influenza and Tdap (during each pregnancy, weeks 27-36) recommended"
    ],
    diagnostics: [
      "Immunization history review: check state immunization registry, previous medical records, school records",
      "Titer levels (quantitative antibody testing): determine immunity status for specific diseases (hepatitis B surface antibody, MMR titers, varicella IgG)",
      "TB screening: PPD skin test (Mantoux) or IGRA blood test before BCG vaccine or immunosuppressive therapy",
      "Pregnancy testing before administering live vaccines to women of childbearing age",
      "Assess for contraindications: anaphylaxis to prior dose or vaccine component, immunocompromised state (for live vaccines), pregnancy (for live vaccines), moderate-to-severe acute illness"
    ],
    management: [
      "Follow CDC immunization schedule: childhood (birth-18 years), catch-up schedule, adult schedule",
      "Administer Tdap during each pregnancy (27-36 weeks) to provide passive immunity to newborn against pertussis",
      "Annual influenza vaccine for all persons ≥6 months (inactivated injection for immunocompromised; live attenuated nasal spray contraindicated in immunocompromised and pregnancy)",
      "Pneumococcal vaccines: PCV15 or PCV20 for adults ≥65 and high-risk adults; PPSV23 may follow PCV15",
      "HPV vaccine: ages 9-26 (routine at 11-12); can give up to age 45 based on shared decision-making",
      "Shingles vaccine (Shingrix): adults ≥50, two doses 2-6 months apart; can give regardless of prior shingles or Zostavax"
    ],
    nursingActions: [
      "Screen for contraindications and precautions before every vaccine administration using the CDC screening questionnaire",
      "Verify vaccine name, lot number, expiration date, and proper storage conditions (cold chain maintenance)",
      "Administer vaccines using correct route and site: IM in vastus lateralis (infants) or deltoid (children ≥1yr and adults); SC in outer upper arm or thigh",
      "Use appropriate needle length: 1 inch for IM deltoid in adults; 5/8 inch for SC; 1-1.5 inch for IM in larger adults",
      "Observe for 15 minutes post-vaccination (30 minutes if history of anaphylaxis to any cause); have epinephrine immediately available",
      "Document: vaccine name, manufacturer, lot number, expiration date, site, route, dose, VIS date given, administrator name, patient name/date",
      "Report adverse events to VAERS (Vaccine Adverse Event Reporting System) as required",
      "Educate on expected side effects: injection site soreness, low-grade fever, mild malaise (24-48 hours); when to seek emergency care (anaphylaxis symptoms)",
      "Live vaccines: give same day or separate by ≥28 days; live vaccines delayed 11 months after IVIG administration"
    ],
    assessmentFindings: [
      "Expected post-vaccination reactions: local injection site pain, redness, swelling; low-grade fever; mild fatigue; myalgias",
      "Anaphylaxis (rare, 1-2 per million doses): occurs within minutes to 30 minutes; urticaria, angioedema, bronchospasm, hypotension, tachycardia",
      "Vaccine-specific reactions: febrile seizures (rare, with MMR), intussusception (rare, with rotavirus), Guillain-Barré syndrome (rare, associated with some influenza vaccines)",
      "Contraindication vs precaution: contraindication = do NOT give; precaution = benefits may outweigh risks in specific circumstances, consult specialist"
    ],
    signs: {
      left: [
        "Local: injection site pain, redness, swelling",
        "Systemic: low-grade fever, mild fatigue, myalgias",
        "These reactions are EXPECTED and self-limited",
        "Resolve within 24-48 hours without intervention"
      ],
      right: [
        "Anaphylaxis: urticaria, angioedema, bronchospasm, hypotension",
        "High fever >104°F (rare, warrants evaluation)",
        "Seizure activity (rare, febrile seizure with MMR)",
        "Severe allergic reaction requiring epinephrine"
      ]
    },
    medications: [
      { name: "Epinephrine (for Vaccine Anaphylaxis)", type: "Alpha/Beta Adrenergic Agonist", action: "Alpha-1: vasoconstriction reversing hypotension and reducing mucosal edema. Beta-1: increased heart rate and contractility. Beta-2: bronchodilation. Stabilizes mast cell membranes preventing further mediator release. ONLY first-line treatment for anaphylaxis", sideEffects: "Tachycardia, hypertension, tremor, anxiety, headache, nausea", contra: "No absolute contraindications in anaphylaxis—benefit always outweighs risk in life-threatening allergic reaction", pearl: "IM injection in lateral thigh (vastus lateralis): 0.01mg/kg of 1:1,000 (1mg/mL) up to 0.3mg in children, 0.3-0.5mg in adults. May repeat every 5-15 minutes. Antihistamines are NOT a substitute for epinephrine in anaphylaxis. Epinephrine auto-injectors must be immediately available in all locations where vaccines are administered." },
      { name: "Tdap Vaccine (Tetanus-Diphtheria-Pertussis)", type: "Combination Toxoid/Acellular Vaccine", action: "Contains tetanus toxoid, diphtheria toxoid, and acellular pertussis antigens. Stimulates active immunity producing protective antibodies. Given during each pregnancy (27-36 weeks) to provide transplacental passive antibody transfer protecting newborns against pertussis before they can be vaccinated at 2 months", sideEffects: "Injection site pain and swelling (most common), low-grade fever, fatigue, headache, GI symptoms", contra: "History of encephalopathy within 7 days of previous pertussis-containing vaccine (can give Td instead); anaphylaxis to prior dose or vaccine component", pearl: "Given during EACH pregnancy at 27-36 weeks gestation (optimal timing for antibody transfer). Td booster every 10 years for non-pregnant adults. If wound is dirty and >5 years since last tetanus, give Td/Tdap. Clean wound and >10 years since last tetanus, give Td/Tdap. Administer regardless of prior vaccination history during pregnancy." }
    ],
    pearls: [
      "Live vaccines are CONTRAINDICATED in immunocompromised patients and during pregnancy—always screen before administering MMR, varicella, rotavirus, or LAIV",
      "Epinephrine is the ONLY first-line treatment for anaphylaxis—antihistamines alone are never sufficient; it must be immediately available wherever vaccines are given",
      "Live vaccines should be given on the same day OR separated by ≥28 days—giving them 1-27 days apart may impair immune response",
      "Tdap during EACH pregnancy (27-36 weeks) protects newborns against pertussis through passive maternal antibody transfer",
      "Mild illness with low-grade fever is NOT a contraindication to vaccination—only moderate-to-severe illness is a precaution"
    ],
    quiz: [
      { question: "A pregnant patient at 30 weeks gestation asks about recommended vaccines. Which vaccine should the nurse recommend?", options: ["MMR vaccine", "Tdap vaccine", "Live attenuated influenza vaccine (nasal spray)", "Varicella vaccine"], correct: 1, rationale: "Tdap is recommended during each pregnancy at 27-36 weeks gestation to provide passive immunity to the newborn against pertussis. MMR, varicella, and live attenuated influenza are all LIVE vaccines that are contraindicated during pregnancy." },
      { question: "A patient reports anaphylaxis to eggs. Which vaccine requires additional precaution?", options: ["Hepatitis B vaccine", "MMR vaccine", "Some influenza vaccines manufactured in eggs", "Tdap vaccine"], correct: 2, rationale: "Some influenza vaccines are manufactured using egg-based technology and may contain trace egg protein. Current CDC guidelines state that egg-allergic individuals can receive any age-appropriate influenza vaccine with standard precautions (15-30 minute observation period), but awareness of the egg protein content is important for informed consent." },
      { question: "A nurse is preparing to give vaccines to a 5-year-old. Two live vaccines (MMR and varicella) were not given today. When can the second live vaccine be administered?", options: ["Tomorrow", "1 week from today", "At least 28 days from today", "They must always be given on the same day"], correct: 2, rationale: "Live vaccines should be given on the same day or separated by at least 28 days. Giving live vaccines 1-27 days apart may result in impaired immune response to the second vaccine. If both cannot be given today, schedule the second for at least 28 days later." },
      { question: "After administering a vaccine, a patient develops hives, throat swelling, and hypotension within 10 minutes. What is the FIRST medication to administer?", options: ["Diphenhydramine 50mg IV", "Methylprednisolone 125mg IV", "Epinephrine 0.3mg IM in the vastus lateralis", "Albuterol nebulizer"], correct: 2, rationale: "Anaphylaxis requires IMMEDIATE epinephrine IM as the first-line treatment. Antihistamines and corticosteroids are adjuncts but are NOT substitutes for epinephrine. Delay in epinephrine administration increases mortality. Epinephrine reverses bronchospasm, hypotension, and angioedema simultaneously." }
    ]
  },

  "stress-physiology-hpa-axis-rn": {
    title: "Stress Physiology and HPA Axis: Clinical Nursing Implications",
    cellular: {
      title: "Neuroendocrine Stress Response and Allostatic Load",
      content: "The stress response involves two primary neuroendocrine pathways: the sympathetic-adrenal-medullary (SAM) axis for immediate 'fight-or-flight' and the hypothalamic-pituitary-adrenal (HPA) axis for sustained stress adaptation. The SAM axis: stressors activate the hypothalamus, which stimulates the sympathetic nervous system via preganglionic neurons. Postganglionic fibers release norepinephrine at target organs, and the adrenal medulla releases epinephrine and norepinephrine into the bloodstream, producing immediate effects: increased heart rate and contractility, bronchodilation, blood glucose elevation (glycogenolysis), pupil dilation, and blood shunting from digestive organs to skeletal muscle. The HPA axis: the hypothalamus releases corticotropin-releasing hormone (CRH), which stimulates the anterior pituitary to release ACTH, which stimulates the adrenal cortex to release cortisol. Cortisol provides sustained energy through gluconeogenesis, protein catabolism, and lipolysis; suppresses the immune system; promotes sodium retention; and provides negative feedback to the hypothalamus and pituitary. Chronic stress causes allostatic overload: persistently elevated cortisol leads to insulin resistance, visceral fat deposition, hypertension, immunosuppression, hippocampal atrophy (impaired memory), disrupted sleep, and increased cardiovascular risk. Understanding these mechanisms helps nurses recognize stress-related illness exacerbations, medication adjustments needed during physiological stress, and the importance of stress management interventions."
    },
    riskFactors: [
      "Chronic psychological stress: work-related burnout, caregiving burden, poverty, social isolation, adverse childhood experiences (ACEs)",
      "Physiological stress: critical illness, major surgery, trauma, severe infection, burns",
      "Chronic illness with repeated disease exacerbations",
      "Inadequate coping mechanisms and social support",
      "Sleep deprivation and circadian rhythm disruption (shift work)",
      "Nurse-specific: compassion fatigue, moral distress, high patient acuity, staffing shortages"
    ],
    diagnostics: [
      "Morning serum cortisol level: elevated in Cushing syndrome, decreased in adrenal insufficiency; diurnal variation (highest at 6-8 AM, lowest at midnight)",
      "24-hour urine free cortisol: integrated measure of cortisol production over a full day; elevated in Cushing syndrome",
      "ACTH level: differentiates primary adrenal disease from pituitary/hypothalamic causes",
      "Salivary cortisol: convenient, non-invasive; late-night salivary cortisol is a screening test for Cushing syndrome",
      "Serum glucose monitoring: stress hyperglycemia is common in critically ill patients even without diabetes",
      "Comprehensive metabolic panel: electrolytes, glucose, renal function to assess end-organ effects of stress hormones"
    ],
    management: [
      "Physiological stress: stress-dose steroids for adrenally insufficient patients during illness, surgery, or trauma (hydrocortisone 50-100mg IV q8h)",
      "Stress hyperglycemia in critical illness: insulin drip to maintain glucose 140-180 mg/dL in ICU patients (tight glycemic control)",
      "Non-pharmacological stress reduction: progressive muscle relaxation, deep breathing exercises, guided imagery, mindfulness meditation",
      "Sleep hygiene promotion: consistent sleep-wake cycle, reduced stimulation at night, clustered care to minimize nighttime disruptions",
      "Therapeutic communication: active listening, validation of feelings, empathetic responses to reduce patient anxiety",
      "Early mobility and structured daily routine for hospitalized patients to reduce ICU delirium and stress-related complications"
    ],
    nursingActions: [
      "Assess for signs of stress response: tachycardia, hypertension, diaphoresis, anxiety, hyperglycemia, insomnia",
      "Monitor blood glucose closely in critically ill patients—stress hyperglycemia is common and requires insulin management",
      "Administer stress-dose steroids for patients with known adrenal insufficiency or chronic corticosteroid use during physiological stress",
      "Implement anxiety-reducing interventions: explain procedures before performing them, maintain a calm environment, encourage family presence",
      "Promote sleep in hospitalized patients: dim lights at night, minimize noise, cluster care activities, avoid unnecessary nighttime vital signs",
      "Recognize the impact of chronic stress on disease exacerbation: asthma, heart failure, diabetes, autoimmune conditions, chronic pain",
      "Address nurse well-being: recognize signs of compassion fatigue and burnout in self and colleagues; utilize employee assistance programs",
      "Educate patients on stress management techniques: progressive muscle relaxation, diaphragmatic breathing, journaling, exercise"
    ],
    assessmentFindings: [
      "Acute stress response: tachycardia, hypertension, tachypnea, diaphoresis, mydriasis (pupil dilation), dry mouth, muscle tension",
      "Chronic stress manifestations: insomnia, fatigue, headaches, GI disturbance (IBS), weight gain (central adiposity), weakened immunity, mood changes",
      "Stress hyperglycemia: blood glucose >180 mg/dL in critically ill patients without prior diabetes diagnosis",
      "Psychological stress indicators: anxiety, irritability, difficulty concentrating, social withdrawal, hypervigilance",
      "Stress-related disease exacerbation: asthma attacks, heart failure decompensation, angina, autoimmune flares"
    ],
    signs: {
      left: [
        "Tachycardia, hypertension (SAM axis activation)",
        "Hyperglycemia (cortisol-mediated gluconeogenesis)",
        "Anxiety, insomnia, difficulty concentrating",
        "GI disturbance: nausea, diarrhea, anorexia"
      ],
      right: [
        "Immunosuppression with recurrent infections (chronic stress)",
        "Central obesity and metabolic syndrome (chronic cortisol)",
        "Disease exacerbations (asthma, HF, autoimmune)",
        "Depression, burnout, compassion fatigue (healthcare workers)"
      ]
    },
    medications: [
      { name: "Hydrocortisone (Stress Dosing)", type: "Glucocorticoid", action: "Replaces cortisol during physiological stress when the adrenal glands cannot mount an adequate stress response (adrenal insufficiency, chronic exogenous steroid use causing HPA suppression). Without stress dosing, patients risk hemodynamic collapse (adrenal crisis) during illness, surgery, or trauma", sideEffects: "Short-term: hyperglycemia, fluid retention, mood changes. Long-term: see Cushing syndrome features", contra: "No contraindication during adrenal crisis—lifesaving medication", pearl: "Stress dosing guidelines: minor stress (illness with fever): double usual dose. Moderate stress (minor surgery, significant illness): hydrocortisone 50mg IV q8h. Major stress (critical illness, major surgery): hydrocortisone 100mg IV bolus then 50mg q8h, taper over 1-3 days as stress resolves. Any patient on ≥5mg prednisone equivalent daily for ≥3 weeks may have HPA suppression and need stress dosing." },
      { name: "Insulin (Regular IV) for Stress Hyperglycemia", type: "Hormone", action: "Controls stress hyperglycemia in critically ill patients. Stress hormones (cortisol, epinephrine, glucagon, growth hormone) antagonize insulin, increase hepatic glucose production, and cause insulin resistance. Uncontrolled hyperglycemia impairs wound healing, increases infection risk, worsens neurological outcomes, and increases ICU mortality", sideEffects: "Hypoglycemia (primary concern—blood glucose <70 increases mortality in ICU patients), hypokalemia", contra: "Active hypoglycemia", pearl: "Target glucose 140-180 mg/dL in ICU patients (NICE-SUGAR trial showed tight control <110 increased mortality). Monitor blood glucose every 1-2 hours during IV insulin infusion. Transition to SC insulin when patient is eating and stable—overlap SC basal insulin by 2 hours before stopping the drip. Stress hyperglycemia often resolves as the acute illness resolves." }
    ],
    pearls: [
      "Any patient on ≥5mg prednisone daily for ≥3 weeks may have HPA axis suppression and need stress-dose steroids during illness or surgery",
      "Stress hyperglycemia in ICU: target glucose 140-180 mg/dL; tight control (<110) increases mortality (NICE-SUGAR trial)",
      "The stress response exacerbates virtually every chronic disease: HF, asthma, DM, autoimmune conditions, chronic pain, mental health disorders",
      "Promoting sleep in hospitalized patients reduces delirium, stress hormone levels, and length of stay—dim lights, cluster care, minimize noise",
      "Nurse burnout and compassion fatigue are occupational hazards—recognizing signs in yourself and colleagues is a professional responsibility"
    ],
    quiz: [
      { question: "A patient who takes prednisone 20mg daily for rheumatoid arthritis is admitted for emergency appendectomy. Which medication is essential in the perioperative period?", options: ["Continue prednisone 20mg orally only", "Administer stress-dose hydrocortisone IV perioperatively", "Discontinue prednisone and start methotrexate", "No additional steroid coverage is needed"], correct: 1, rationale: "Chronic prednisone use suppresses the HPA axis. During the physiological stress of surgery, the adrenal glands cannot mount an adequate cortisol response. Without stress-dose IV hydrocortisone (100mg bolus then 50mg q8h), the patient risks hemodynamic collapse from adrenal crisis." },
      { question: "A critically ill patient without diabetes has a blood glucose of 245 mg/dL. The nurse recognizes this as:", options: ["Undiagnosed diabetes requiring oral metformin", "Stress hyperglycemia requiring IV insulin with target 140-180 mg/dL", "A normal finding in critical illness that does not require treatment", "Diabetic ketoacidosis requiring aggressive fluid resuscitation"], correct: 1, rationale: "Stress hyperglycemia occurs in critically ill patients due to cortisol, epinephrine, and other counter-regulatory hormones causing insulin resistance and increased hepatic glucose production. It increases infection risk and mortality. Treatment with IV insulin targeting 140-180 mg/dL improves outcomes." },
      { question: "Which nursing intervention best reduces the physiological stress response in a hospitalized patient?", options: ["Administering sedatives on a scheduled basis", "Performing frequent vital signs assessments throughout the night", "Providing thorough explanations before procedures and maintaining a calm, predictable environment", "Restricting all visitors to minimize stimulation"], correct: 2, rationale: "Explaining procedures, maintaining predictability, and creating a calm environment reduce anxiety and the associated stress response (sympathetic activation). Unnecessary nighttime assessments disrupt sleep and increase stress. Scheduled sedatives have side effects. Appropriate visitor presence actually reduces stress." }
    ]
  }
};
