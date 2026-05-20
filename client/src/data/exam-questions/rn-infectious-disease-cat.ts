import type { ExamQuestion } from "./types";

export const rnInfectiousDiseaseCatQuestions: ExamQuestion[] = [
  // ===== BACTERIAL CELL STRUCTURE CAT (20 questions) =====
  {
    q: "A nurse is caring for four patients with infections. Which patient requires the MOST immediate intervention?\n\n1. Patient with MRSA wound: afebrile, wound improving on vancomycin\n2. Patient with gram-negative bacteremia: temperature 39.8°C, BP 78/42, HR 134, lactate 4.2 mmol/L\n3. Patient with uncomplicated UTI: mild dysuria, oral antibiotics started\n4. Patient with cellulitis: IV antibiotics infusing, redness improving",
    o: ["Patient 1: Stable MRSA wound infection", "Patient 2: Gram-negative septic shock with elevated lactate requiring immediate fluid resuscitation and vasopressors", "Patient 3: Uncomplicated UTI responding to treatment", "Patient 4: Cellulitis improving on therapy"],
    a: 1,
    r: "Patient 2 demonstrates septic shock from gram-negative bacteremia: hypotension (SBP <90), tachycardia, fever, and lactate >4 mmol/L (indicating severe tissue hypoperfusion). Endotoxin-mediated septic shock carries high mortality. Immediate interventions: 30 mL/kg crystalloid bolus, blood cultures, broad-spectrum antibiotics within 1 hour, vasopressors if unresponsive to fluids, and lactate reassessment.",
    s: "Infectious Disease"
  },
  {
    q: "A patient with a central line develops recurrent Staphylococcus epidermidis bacteremia despite 10 days of appropriate vancomycin therapy. Blood cultures are positive again after 72 hours of treatment. The nurse anticipates which intervention?\n\nA. Continue current vancomycin regimen for 4 more weeks\nB. Add rifampin to the vancomycin regimen\nC. Remove the central venous catheter (source control)\nD. Switch to oral cephalexin",
    o: ["Continue vancomycin for extended duration", "Add rifampin for combination therapy", "Remove the central venous catheter — biofilm on the device prevents antibiotic eradication", "Switch to oral cephalexin"],
    a: 2,
    r: "Recurrent bacteremia despite appropriate antibiotic therapy is the hallmark of biofilm-related device infection. S. epidermidis forms robust biofilm on central lines. Biofilm-embedded bacteria are 100-1000x more resistant to antibiotics, and persister cells within the biofilm cannot be eradicated pharmacologically. Source control (catheter removal) is essential for cure. Antibiotics alone will fail.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse receives a call from the lab reporting preliminary blood culture results. Match the Gram stain finding with the MOST appropriate empiric antibiotic:\n\nGram stain: Gram-positive cocci in clusters\n\nWhich empiric antibiotic should the nurse expect the provider to order?",
    o: ["Piperacillin-tazobactam (broad gram-negative coverage)", "Vancomycin (covers MRSA and other gram-positive organisms pending sensitivities)", "Metronidazole (anaerobic coverage)", "Fluconazole (antifungal)"],
    a: 1,
    r: "Gram-positive cocci in clusters = Staphylococcus species. Until sensitivities return, vancomycin is appropriate because it covers both MSSA and MRSA. If sensitivities show MSSA, de-escalation to nafcillin/cefazolin would follow. Piperacillin-tazobactam provides gram-negative coverage. Metronidazole targets anaerobes. Fluconazole is antifungal.",
    s: "Infectious Disease"
  },
  {
    q: "A critical care nurse is managing a patient with ventilator-associated pneumonia (VAP). The sputum culture grows Pseudomonas aeruginosa sensitive to meropenem and piperacillin-tazobactam. The patient has been on piperacillin-tazobactam for 48 hours with clinical improvement. Which action aligns with both infection control and stewardship principles?",
    o: ["Switch to meropenem for better Pseudomonas coverage", "Continue piperacillin-tazobactam since the patient is improving — avoid unnecessary escalation to carbapenems", "Add vancomycin for double coverage", "Discontinue all antibiotics since improvement is observed"],
    a: 1,
    r: "Since the organism is sensitive to piperacillin-tazobactam and the patient is improving, continuing this agent is appropriate. Escalating to meropenem when a narrower agent is effective violates stewardship — unnecessary carbapenem use drives CRE emergence. Adding vancomycin without gram-positive indication adds toxicity risk. Completing the appropriate course (typically 7 days for VAP) is essential.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is admitting a patient transferred from another hospital. The transfer note states the patient is 'colonized with CRE.' The nurse should implement which level of precautions?\n\nA. Standard precautions (CRE colonization doesn't require isolation)\nB. Contact precautions with gown and gloves\nC. Enhanced contact precautions: gown, gloves, dedicated equipment, private room, and enhanced environmental cleaning\nD. Airborne precautions with N95 respirator",
    o: ["Standard precautions only", "Standard contact precautions", "Enhanced contact precautions with dedicated equipment and enhanced cleaning — CRE is an urgent public health threat requiring maximum transmission prevention", "Airborne precautions"],
    a: 2,
    r: "CRE (carbapenem-resistant Enterobacterales) requires enhanced contact precautions even for colonized patients because: treatment options are extremely limited (40-50% mortality for invasive infections), transmission risk is high, and CRE can persist in the hospital environment. This includes dedicated patient equipment (stethoscope, BP cuff), private room, enhanced cleaning, and hand hygiene monitoring.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is performing wound care on a patient with a chronic diabetic foot ulcer. The wound has been draining for 3 months. Cultures consistently grow the same organism despite targeted antibiotics. The wound shows minimal erythema but persistent drainage. The nurse suspects which pathological process?",
    o: ["Acute cellulitis with inadequate antibiotic coverage", "Chronic biofilm infection — the extracellular polymeric substance matrix protects organisms from antibiotics and immune clearance", "Viral wound infection", "Allergic dermatitis at the wound site"],
    a: 1,
    r: "Chronic wounds with persistent positive cultures despite appropriate targeted antibiotics strongly suggest biofilm infection. Biofilm is present in approximately 60% of chronic wounds. The EPS matrix prevents antibiotic penetration, and persister cells within the biofilm re-seed infection when antibiotics are stopped. Management requires debridement (physical biofilm disruption) combined with topical and systemic antibiotics.",
    s: "Infectious Disease"
  },
  {
    q: "A patient asks: 'My doctor said my infection is caused by a gram-negative rod. Why does that matter?' The nurse's BEST response that demonstrates understanding of bacterial cell structure is:",
    o: ["It doesn't really matter — all bacteria are treated the same way", "Gram-negative bacteria have an outer membrane that acts as a barrier, limiting which antibiotics can reach the bacteria and making them harder to treat than some gram-positive infections. They also contain endotoxin that can trigger septic shock", "Gram-negative just means the bacteria are more dangerous", "It only matters for laboratory purposes, not for your treatment"],
    a: 1,
    r: "This response accurately explains clinical relevance: the outer membrane creates a permeability barrier limiting antibiotic options, and LPS endotoxin drives septic shock pathophysiology. Understanding this helps patients appreciate why specific antibiotics are chosen and why some infections are more dangerous. Effective patient education connects microbiology to clinical management.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing culture results for a patient with a complicated urinary tract infection. The report shows:\n\nOrganism: Klebsiella pneumoniae\nSensitivities: Ampicillin — Resistant; Ceftriaxone — Resistant; Ciprofloxacin — Resistant; Meropenem — Sensitive; Nitrofurantoin — Intermediate\n\nThe resistance pattern to ceftriaxone suggests the organism likely produces:",
    o: ["Altered porins only", "Extended-spectrum beta-lactamase (ESBL) that hydrolyzes third-generation cephalosporins", "Vancomycin-resistance enzymes", "Methicillin-resistance protein (PBP2a)"],
    a: 1,
    r: "Resistance to ampicillin AND ceftriaxone (third-generation cephalosporin) with preserved meropenem (carbapenem) sensitivity is the classic ESBL resistance pattern. ESBL enzymes (CTX-M) hydrolyze penicillins and cephalosporins but not carbapenems. Meropenem would be the treatment of choice for this complicated UTI. PBP2a is MRSA-specific, and vancomycin resistance is gram-positive.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is assessing four patients at shift change. Which finding requires the MOST immediate assessment and intervention?\n\n1. Patient with wound infection: purulent drainage present, vital signs stable, antibiotics infusing\n2. Patient with UTI: urine culture pending, mild dysuria, afebrile\n3. Patient with central line: new-onset rigors, temperature 39.6°C, hypotension developing\n4. Patient with pneumonia: productive cough, SpO2 94% on room air, antibiotics day 3",
    o: ["Patient 1: Wound with purulent drainage", "Patient 2: UTI with dysuria", "Patient 3: Central line patient with rigors, fever, and developing hypotension — possible CRBSI progressing to sepsis", "Patient 4: Pneumonia on treatment"],
    a: 2,
    r: "Patient 3 has cardinal signs of catheter-related bloodstream infection (CRBSI) progressing to sepsis: rigors (bacterial seeding from biofilm on the catheter), high fever, and developing hypotension. This requires immediate blood cultures (from the line AND peripherally), broad-spectrum antibiotics within 1 hour, fluid resuscitation, and likely central line removal (source control).",
    s: "Infectious Disease"
  },
  {
    q: "A patient with sepsis has positive blood cultures for E. coli. The nurse observes the patient develop acute onset of diffuse intravascular coagulation (DIC) with petechiae, oozing from IV sites, and prolonged PT/PTT. The nurse understands this complication is related to which bacterial component?",
    o: ["Peptidoglycan activation of clotting factors", "Lipid A (endotoxin) triggering TLR4-mediated inflammatory cascade leading to disseminated activation of coagulation", "Capsular polysaccharide causing platelet aggregation", "Fimbriae directly damaging blood vessels"],
    a: 1,
    r: "Lipid A (endotoxin) from gram-negative E. coli activates TLR4 on monocytes/macrophages, triggering release of tissue factor and pro-inflammatory cytokines. Tissue factor activates the extrinsic coagulation cascade systemically, leading to DIC: simultaneous widespread clot formation (consuming platelets and clotting factors) and bleeding. This is a life-threatening complication of gram-negative sepsis.",
    s: "Infectious Disease"
  },

  // ===== ANTIBIOTIC RESISTANCE CAT (20 questions) =====
  {
    q: "A nurse is participating in the 72-hour antibiotic timeout for four patients. Which patient represents the BEST opportunity for antibiotic de-escalation?\n\n1. Patient on vancomycin + meropenem with pending cultures, still febrile\n2. Patient on vancomycin + piperacillin-tazobactam; cultures grew MSSA, afebrile 48 hours\n3. Patient on ceftriaxone with documented ESBL E. coli bacteremia\n4. Patient on linezolid for VRE endocarditis, improving on day 3",
    o: ["Patient 1: Cultures pending, still febrile — cannot de-escalate yet", "Patient 2: MSSA identified — de-escalate vancomycin to nafcillin/cefazolin and discontinue pip-tazo since MSSA doesn't require broad gram-negative coverage", "Patient 3: ESBL needs escalation to carbapenem, not de-escalation", "Patient 4: VRE endocarditis requires continued linezolid"],
    a: 1,
    r: "Patient 2 is the ideal de-escalation candidate: MSSA is definitively identified, patient is clinically improving (afebrile 48 hours). De-escalate from vancomycin to nafcillin/cefazolin (more effective for MSSA than vancomycin) and discontinue piperacillin-tazobactam. Patient 1 cannot be de-escalated without culture results. Patient 3 needs escalation. Patient 4 has appropriate targeted therapy.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse reviews the following lab results for a patient on IV vancomycin:\n\nDay 1: SCr 0.9 mg/dL, Vancomycin AUC 520\nDay 3: SCr 1.1 mg/dL, Vancomycin AUC 580\nDay 5: SCr 1.8 mg/dL, Vancomycin AUC 650\n\nWhat is the PRIORITY nursing action?",
    o: ["Continue current vancomycin dosing — the AUC is close to therapeutic", "Hold vancomycin and notify the provider urgently — rising creatinine with supratherapeutic AUC indicates nephrotoxicity requiring dose reduction or alternative agent", "Increase vancomycin dose to maintain therapeutic levels despite rising creatinine", "Switch to oral vancomycin to reduce nephrotoxicity"],
    a: 1,
    r: "Rising creatinine (0.9 → 1.8 = doubling) concurrent with supratherapeutic vancomycin AUC (650 > target of 400-600) indicates drug-induced nephrotoxicity. The nurse must hold vancomycin and notify the provider immediately. Options include: dose reduction with re-monitoring, extended interval dosing, or switching to a non-nephrotoxic alternative (daptomycin, linezolid). Continuing the current dose risks acute kidney injury.",
    s: "Infectious Disease"
  },
  {
    q: "A patient is admitted with community-acquired pneumonia. The nurse reviews the chart and finds documentation of 'penicillin allergy — rash as a child.' The provider has ordered azithromycin + levofloxacin instead of the guideline-recommended beta-lactam + macrolide. What is the MOST appropriate stewardship action?",
    o: ["Accept the order — penicillin allergy precludes all beta-lactams", "Discuss with the provider: childhood rash is low-risk, cephalosporin cross-reactivity is only 1-2%, and guideline-concordant therapy with ceftriaxone + azithromycin would be more appropriate pending allergy clarification", "Administer penicillin without discussion", "Request infectious disease consultation immediately"],
    a: 1,
    r: "This is an excellent stewardship opportunity. A childhood rash is often a viral exanthem misattributed to penicillin. True cross-reactivity between penicillin and cephalosporins is only 1-2%. Avoiding beta-lactams unnecessarily leads to: suboptimal pneumonia treatment, increased fluoroquinolone exposure (C. diff risk, tendon rupture), and broader-spectrum therapy than needed. Formal penicillin allergy testing should be recommended.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is caring for a patient with C. difficile infection who has had two previous recurrences. The current episode was treated with oral vancomycin, and the patient improved but is now having a third recurrence. Which treatment does the nurse anticipate?",
    o: ["Higher dose oral vancomycin", "Fidaxomicin followed by a tapered and pulsed regimen, with consideration for fecal microbiota transplant (FMT) given multiple recurrences", "IV metronidazole alone", "Broad-spectrum antibiotics to clear all gut organisms"],
    a: 1,
    r: "Multiple C. difficile recurrences indicate profoundly disrupted gut microbiome. Fidaxomicin's narrow spectrum preserves protective flora better than vancomycin (lower recurrence rate). After ≥2 recurrences, fecal microbiota transplant (FMT) restores the protective colonic microbiome and has >85% efficacy for preventing further recurrence. The FDA has approved standardized FMT products (Vowst, Rebyota).",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is monitoring a patient on once-daily IV gentamicin for gram-negative endocarditis. The trough level drawn before the third dose returns at 2.8 mcg/mL (target: <1 mcg/mL). Which assessment finding should the nurse MOST carefully evaluate?",
    o: ["Blood glucose levels", "Hearing acuity and vestibular function (balance, dizziness), plus renal function (urine output, creatinine) — aminoglycoside trough accumulation causes irreversible ototoxicity and nephrotoxicity", "Skin color and turgor", "Appetite and oral intake"],
    a: 1,
    r: "Elevated aminoglycoside trough (2.8 > target <1) indicates drug accumulation, dramatically increasing risk of irreversible ototoxicity (hearing loss, vestibular damage) and nephrotoxicity. The nurse should assess hearing acuity, vestibular function (balance, vertigo, nystagmus), urine output, and serum creatinine. The dose must be held and adjusted. Ototoxicity may be permanent.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing culture reports for a patient with a wound infection. The report shows:\n\nOrganism: Pseudomonas aeruginosa\nSensitivities: Piperacillin-tazobactam — Sensitive; Meropenem — Sensitive; Ciprofloxacin — Resistant; Gentamicin — Resistant; Ceftazidime — Sensitive\n\nThe resistance to both ciprofloxacin and gentamicin (different classes) might be explained by:",
    o: ["Two separate random mutations", "Efflux pump overexpression — a single pump system (MexAB-OprM) can expel multiple antibiotic classes simultaneously", "Methicillin resistance gene (mecA)", "Biofilm formation only"],
    a: 1,
    r: "Pseudomonas MexAB-OprM efflux pump system can simultaneously expel fluoroquinolones, aminoglycosides, and other antibiotic classes. Overexpression of a single efflux pump creates resistance to multiple drug classes simultaneously, explaining why this organism is resistant to both ciprofloxacin (fluoroquinolone) and gentamicin (aminoglycoside) without requiring separate resistance mechanisms for each.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse identifies that a patient with suspected sepsis has been waiting 45 minutes for their first dose of antibiotics because the pharmacy is processing the order. What is the MOST appropriate nursing action?",
    o: ["Continue waiting — pharmacy will send the medication when ready", "Escalate immediately: contact the charge nurse and pharmacy directly, advocate for STAT antibiotic delivery — each hour of delay in sepsis antibiotic administration increases mortality by 7-8%", "Give a different antibiotic that is available on the unit", "Document the delay and address it at the next staff meeting"],
    a: 1,
    r: "Every hour of delay in antibiotic administration for sepsis increases mortality by approximately 7-8% (Surviving Sepsis Campaign data). The nurse must advocate aggressively for immediate antibiotic delivery: call pharmacy directly, escalate to the charge nurse or supervisor, request override medications from the automated dispensing cabinet, and ensure antibiotics are given within 1 hour of sepsis recognition.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is caring for a patient who has been receiving IV antibiotics for 14 days for a complicated intra-abdominal infection. The patient is now afebrile, tolerating a regular diet, WBC normalized, and the wound is healing. However, the provider has not addressed IV-to-PO conversion. What is the MOST appropriate nursing action?",
    o: ["Continue IV therapy as ordered without question", "Assess IV-to-PO conversion readiness and discuss with the provider: patient meets criteria (afebrile, tolerating PO, clinically improving), and continued IV access increases phlebitis, CLABSI risk, and prolongs hospital stay", "Discontinue IV antibiotics on nursing judgment", "Switch to oral antibiotics without a provider order"],
    a: 1,
    r: "The nurse should advocate for IV-to-PO conversion as a stewardship intervention. This patient meets all criteria: afebrile, tolerating oral intake, clinically improving, and functioning GI tract. Unnecessary continued IV therapy increases risk of phlebitis, CLABSI (biofilm on the IV catheter), nosocomial infections from prolonged hospitalization, and cost. The nurse is a key advocate for appropriate de-escalation.",
    s: "Infectious Disease"
  },
  {
    q: "A patient with a known penicillin allergy (anaphylaxis with penicillin 5 years ago) develops a serious ESBL E. coli bloodstream infection. The sensitivity shows the only effective beta-lactam is meropenem. What approach does the nurse anticipate?",
    o: ["Avoid meropenem entirely and use a non-beta-lactam alternative regardless of efficacy", "Administer meropenem with caution — carbapenem cross-reactivity with penicillin is approximately 1%, and the benefit outweighs the risk in life-threatening ESBL bacteremia. Have epinephrine available and monitor closely", "Give penicillin desensitization followed by amoxicillin", "Use oral ciprofloxacin instead of meropenem"],
    a: 1,
    r: "True cross-reactivity between penicillin and carbapenems is approximately 1% (much lower than previously believed). For life-threatening ESBL bacteremia where meropenem is the only effective agent, the benefit of appropriate treatment far outweighs the small cross-reactivity risk. Administer meropenem with epinephrine available, extended observation period, and close monitoring for allergic reactions.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse receives the following antibiogram data for the unit:\n\nE. coli susceptibility to ciprofloxacin: 65%\nE. coli susceptibility to ceftriaxone: 78%\nE. coli susceptibility to meropenem: 99%\nE. coli susceptibility to nitrofurantoin: 97%\n\nFor empiric treatment of an uncomplicated UTI on this unit, which antibiotic provides the BEST balance of efficacy and stewardship?",
    o: ["Ciprofloxacin — it's a commonly used UTI antibiotic", "Meropenem — it has the highest susceptibility rate", "Nitrofurantoin — 97% susceptibility, narrow spectrum (preserves carbapenems), and concentrated in urine for UTIs", "Ceftriaxone IV — 78% susceptibility is adequate"],
    a: 2,
    r: "Nitrofurantoin has high susceptibility (97%), narrow spectrum (minimal disruption to normal flora, low C. diff risk), achieves high urinary concentrations (ideal for UTI), and preserves broader-spectrum agents for resistant infections. Stewardship principles favor the narrowest effective agent. Using meropenem for uncomplicated UTI wastes a last-resort antibiotic. Ciprofloxacin susceptibility (65%) is below the 80% threshold for empiric use.",
    s: "Infectious Disease"
  },

  // ===== VACCINE MECHANISMS CAT (20 questions) =====
  {
    q: "A nurse is working in an immunization clinic. Four patients present for vaccinations. Which patient requires the MOST careful assessment before vaccine administration?\n\n1. Healthy 12-month-old due for MMR and varicella\n2. 25-year-old healthcare worker due for annual influenza\n3. 8-year-old currently receiving maintenance chemotherapy for ALL, parent requesting varicella vaccine\n4. 65-year-old due for pneumococcal vaccine (PCV20)",
    o: ["Patient 1: Routine childhood vaccines at standard age", "Patient 2: Healthy adult, routine influenza", "Patient 3: Immunocompromised child — live vaccines (varicella) are CONTRAINDICATED during chemotherapy", "Patient 4: Standard adult pneumococcal recommendation"],
    a: 2,
    r: "Patient 3 is receiving chemotherapy for ALL, causing immunosuppression. Varicella vaccine is LIVE and contraindicated in immunocompromised patients — the attenuated virus could cause disseminated, potentially fatal vaccine-strain infection. The nurse must refuse to administer the live vaccine, educate the parent about the risk, and coordinate with oncology about appropriate vaccination timing (typically 3-6 months after chemotherapy completion).",
    s: "Infectious Disease"
  },
  {
    q: "A nurse administers an influenza vaccine to a patient. Exactly 3 minutes later, the patient develops: diffuse urticaria, angioedema of lips/tongue, audible wheezing, and BP drops to 82/50. The nurse should immediately:",
    o: ["Administer diphenhydramine 50 mg IV and start oxygen", "Administer epinephrine 0.3 mg IM in the anterolateral thigh — this is anaphylaxis requiring immediate epinephrine as the FIRST intervention", "Call the provider and wait for orders before acting", "Apply ice to the injection site and elevate the patient's head"],
    a: 1,
    r: "This is textbook anaphylaxis: urticaria + angioedema + bronchospasm (wheezing) + hypotension = anaphylaxis. Epinephrine 0.3 mg IM (1:1000) in the anterolateral thigh is the FIRST-LINE intervention. Do NOT delay for other medications. Epinephrine reverses bronchospasm (beta-2), hypotension (alpha-1), and angioedema. Diphenhydramine and oxygen are adjuncts given AFTER epinephrine. Delay increases mortality.",
    s: "Infectious Disease"
  },
  {
    q: "A pregnant patient at 32 weeks gestation asks why she needs both Tdap AND influenza vaccines during pregnancy. The nurse's BEST response addresses:",
    o: ["These are required by law during pregnancy", "Tdap provides passive pertussis protection to your newborn through placental antibody transfer, and influenza protects you from serious flu complications since pregnancy increases your risk of severe influenza. Both are safe inactivated vaccines", "Only one of these vaccines is actually needed", "These vaccines are optional and only for high-risk pregnancies"],
    a: 1,
    r: "This response addresses both vaccines' rationale: Tdap at 27-36 weeks allows maximal maternal IgG production during peak placental transfer, protecting the newborn against pertussis during the vulnerable period before their own DTaP series. Influenza vaccination protects the mother (pregnant women are immunologically altered and at higher risk for severe influenza complications). Both are inactivated and safe in pregnancy.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is teaching a group of nursing students about the immunological basis of vaccination. A student asks: 'If vaccines work by stimulating antibodies, why do we need booster doses?' The MOST accurate nursing response explains:",
    o: ["Booster doses are only needed because the first dose didn't work", "Over time, antibody levels decline. Boosters restimulate memory B-cells that rapidly differentiate into plasma cells, producing a faster, stronger, higher-affinity antibody response than the original vaccination. This extends protection duration", "Booster doses contain different antigens than the primary series", "Boosters are only needed for live vaccines"],
    a: 1,
    r: "After primary vaccination, antibody levels gradually decline (waning immunity). Memory B-cells persist in lymphoid tissue but need antigen restimulation to mount a rapid secondary response. Boosters trigger memory B-cell activation, resulting in: faster antibody production (1-3 days vs. 7-14 days), higher antibody titers, better affinity maturation, and reinforced immunological memory for extended protection.",
    s: "Infectious Disease"
  },
  {
    q: "A parent brings their 15-month-old for the MMR vaccine. The child received a blood transfusion (packed RBCs) 4 weeks ago. The nurse should:",
    o: ["Administer MMR today — 4 weeks is sufficient wait time after blood products", "Defer MMR — passive antibodies from the blood transfusion can neutralize the live vaccine virus, reducing immunogenicity. Defer until 3-6 months after packed RBC transfusion per ACIP guidelines", "Administer a double dose of MMR to overcome the antibody interference", "Give inactivated vaccines only and never give MMR"],
    a: 1,
    r: "Blood products contain passive antibodies that can neutralize live attenuated vaccine organisms (MMR, varicella) before they replicate sufficiently to stimulate an immune response. Packed RBCs require a 3-6 month deferral for live vaccines. Inactivated vaccines (DTaP, IPV, Hep B, PCV) can be given on schedule as they are not affected by passive antibodies.",
    s: "Infectious Disease"
  },
  {
    q: "A vaccine-hesitant parent tells the nurse: 'I read that vaccines cause autism.' Which response demonstrates the BEST evidence-based practice?",
    o: ["There might be a small risk we don't fully understand", "I understand your concern. The original study making that claim was retracted due to fraud, and the researcher lost his medical license. Since then, extensive studies involving millions of children across many countries have consistently found no link between vaccines and autism. I strongly recommend vaccination to protect your child", "I can't discuss that — ask the pediatrician", "You shouldn't believe everything you read online"],
    a: 1,
    r: "This response: (1) acknowledges the concern without dismissal, (2) addresses the fraudulent origin of the claim factually, (3) provides evidence-based reassurance citing large-scale research, and (4) makes a strong personal recommendation. This follows the motivational interviewing approach recommended by AAP and CDC for vaccine-hesitant encounters. Dismissive or condescending responses increase resistance.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is preparing vaccines for administration. The digital thermometer in the vaccine refrigerator shows a current temperature of 12°C, which is above the required 2-8°C range. What should the nurse do?",
    o: ["Administer the vaccines — a brief temperature excursion is harmless", "Do NOT administer any vaccines from this refrigerator. Mark all vaccines 'Do Not Use,' document the temperature excursion, contact the manufacturer and immunization program for guidance, and report through the facility's cold chain protocol", "Move the vaccines to a freezer to cool them quickly", "Reset the thermometer — it is likely malfunctioning"],
    a: 1,
    r: "A temperature excursion to 12°C (well above the 2-8°C range) may have damaged vaccine potency. The nurse must: quarantine all affected vaccines (mark 'Do Not Use'), document the excursion (current temp, min/max temps, duration of excursion), contact the state immunization program and vaccine manufacturers for stability data, and follow facility cold chain break protocol. Administering potentially compromised vaccines risks failed immunization.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse in the pediatric clinic notes that a 2-month-old infant is due for multiple vaccines: DTaP, IPV, Hib, PCV13, rotavirus, and hepatitis B. The parent asks: 'Isn't that too many vaccines at once for such a small baby?' The BEST evidence-based response is:",
    o: ["Yes, we should spread them out over many visits to reduce the burden on the baby's immune system", "I understand your concern. Research shows that infants' immune systems can handle thousands of antigens simultaneously. Giving these vaccines together is safe, well-studied, and ensures your baby is protected during the most vulnerable period. Spreading them out leaves your baby unprotected longer and increases missed vaccine opportunities", "We can skip some vaccines and catch up later", "Only two vaccines should be given per visit"],
    a: 1,
    r: "Infants encounter thousands of antigens daily from food, bacteria, and environmental exposure. Vaccines contain only a tiny fraction of the antigens the immune system processes. Studies show simultaneous vaccination does not overwhelm the immune system, does not increase adverse effects, and is strongly recommended to minimize the window of vulnerability. Delayed schedules leave infants unprotected during the highest-risk period.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is caring for a newborn whose mother is HBsAg-positive. The birth dose of hepatitis B vaccine was given at 2 hours of life, but HBIG was not administered. It is now 10 hours after birth. What should the nurse do?",
    o: ["HBIG is no longer effective — the window has passed", "Administer HBIG immediately — it should be given within 12 hours of birth for infants of HBsAg-positive mothers, and there is still time within the recommended window", "Wait until the next hepatitis B vaccine dose at 1 month to give HBIG", "No HBIG is needed since the vaccine was already given"],
    a: 1,
    r: "HBIG should be given within 12 hours of birth for infants born to HBsAg-positive mothers. At 10 hours, there is still time within the recommended window. HBIG provides immediate passive antibody protection while the infant's immune system generates its own response to the vaccine. Both vaccine and HBIG are needed — the vaccine alone may not prevent vertical transmission without HBIG's immediate protection.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing the immunization record of a 4-year-old starting kindergarten. The record shows:\n- DTaP: 4 doses (2, 4, 6, 15 months)\n- IPV: 3 doses (2, 4, 6 months)\n- MMR: 1 dose (12 months)\n- Varicella: 1 dose (12 months)\n- Hep B: 3 doses (birth, 1 month, 6 months)\n\nWhich vaccines are still needed before school entry?",
    o: ["No additional vaccines needed", "DTaP 5th dose, IPV 4th dose, MMR 2nd dose, and varicella 2nd dose are needed for kindergarten entry per ACIP recommendations", "Only MMR 2nd dose is needed", "All vaccines need to be repeated"],
    a: 1,
    r: "Kindergarten entry requires: DTaP 5th dose (4-6 years booster), IPV 4th dose (4-6 years booster), MMR 2nd dose (4-6 years), and varicella 2nd dose (4-6 years). The hepatitis B series is complete. The nurse should review immunization records at every visit and advocate for catch-up vaccination before school entry, as school immunization requirements protect the community through herd immunity.",
    s: "Infectious Disease"
  },

  // ===== ADDITIONAL BACTERIAL CELL STRUCTURE CAT (10 questions) =====
  {
    q: "A nurse is triaging four ED patients. Which patient's presentation is MOST consistent with gram-negative endotoxin-mediated septic shock?\n\n1. Temperature 38.2°C, localized wound redness, stable BP\n2. Temperature 40.1°C, rigors, BP 72/40, HR 140, mottled extremities, recent UTI\n3. Temperature 37.8°C, mild cough, SpO2 96%\n4. Afebrile, chronic wound with purulent drainage",
    o: ["Patient 1: Low-grade fever with localized infection", "Patient 2: High fever, rigors, severe hypotension with mottled skin after UTI — classic endotoxin-mediated septic shock from gram-negative urosepsis", "Patient 3: Mild respiratory symptoms", "Patient 4: Chronic wound without systemic signs"],
    a: 1,
    r: "Patient 2 demonstrates endotoxin-mediated septic shock: high fever with rigors (bacterial seeding), severe hypotension (vasodilation from LPS/TLR4/cytokine cascade), tachycardia (compensatory), and mottled extremities (tissue hypoperfusion). Urosepsis is a common source of gram-negative bacteremia. Immediate interventions: 30 mL/kg crystalloid, blood and urine cultures, broad-spectrum antibiotics within 1 hour, vasopressors.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is caring for a burn patient who develops a wound infection. The wound drainage is green-blue with a fruity odor. The patient has progressive fever and is becoming hypotensive. Based on the organism characteristics, the nurse anticipates which antibiotic regimen?",
    o: ["Oral amoxicillin for 7 days", "IV anti-pseudomonal therapy (piperacillin-tazobactam or cefepime) with potential aminoglycoside combination — green-blue drainage with fruity odor is pathognomonic for Pseudomonas, which requires dual gram-negative coverage to prevent resistance", "IV vancomycin alone", "Topical mupirocin only"],
    a: 1,
    r: "Green-blue purulent drainage with fruity odor is pathognomonic for Pseudomonas aeruginosa (pyocyanin pigment, 2-aminoacetophenone metabolite). Pseudomonas burn wound infections can progress to sepsis rapidly. Anti-pseudomonal antibiotics with combination therapy (beta-lactam + aminoglycoside or fluoroquinolone) are recommended to prevent resistance emergence. Vancomycin has no gram-negative activity.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is assigned to care for a patient with chronic osteomyelitis of the tibia. Despite 6 weeks of IV antibiotics, imaging shows a sequestrum (dead bone). The orthopedic surgeon plans surgical debridement. A nursing student asks why surgery is necessary when antibiotics are being given. The BEST explanation is:",
    o: ["Surgery is optional and just speeds recovery", "Dead bone (sequestrum) harbors biofilm-embedded bacteria in an avascular environment — antibiotics cannot penetrate biofilm or reach bacteria in bone without blood supply. Surgical removal of the sequestrum is essential for source control and cure", "Surgery replaces the need for antibiotics entirely", "The antibiotics simply weren't the right ones"],
    a: 1,
    r: "Chronic osteomyelitis involves biofilm colonization of dead bone (sequestrum). Two factors prevent antibiotic cure alone: (1) biofilm's EPS matrix prevents antibiotic penetration, and (2) avascular necrotic bone has no blood supply to deliver antibiotics. Surgical debridement removes the biofilm-colonized sequestrum, restoring the ability of antibiotics to treat remaining infection. This is source control in action.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing the lab results of a septic patient. Which combination of findings is MOST concerning for gram-negative sepsis with DIC?\n\nA. WBC 18,000, platelets 250,000, PT normal, fibrinogen 400\nB. WBC 2,200, platelets 35,000, PT prolonged, fibrinogen 80, D-dimer elevated\nC. WBC 11,000, platelets 180,000, PT slightly prolonged\nD. WBC 15,000, platelets 150,000, normal coagulation studies",
    o: ["Option A: Elevated WBC with normal coagulation", "Option B: Leukopenia, severe thrombocytopenia, prolonged PT, low fibrinogen, and elevated D-dimer indicate DIC — a life-threatening complication of endotoxin-mediated sepsis", "Option C: Mild abnormalities not indicating DIC", "Option D: Mild leukocytosis with normal coagulation"],
    a: 1,
    r: "Option B shows classic DIC: leukopenia (bone marrow suppression from overwhelming sepsis), severe thrombocytopenia (platelet consumption in microthrombi), prolonged PT (clotting factor consumption), low fibrinogen (consumed in clot formation), and elevated D-dimer (fibrin degradation from simultaneous clotting and fibrinolysis). DIC in gram-negative sepsis is triggered by Lipid A/endotoxin activating tissue factor systemically.",
    s: "Infectious Disease"
  },
  {
    q: "A patient is admitted with a central line-associated bloodstream infection (CLABSI). The nurse is developing a care plan. Place the following nursing interventions in PRIORITY order:\n\n1. Obtain blood cultures from the line and peripherally\n2. Administer broad-spectrum IV antibiotics\n3. Notify the provider about line removal\n4. Document assessment findings\n\nWhich should be performed FIRST?",
    o: ["Obtain blood cultures FIRST — cultures must be drawn BEFORE antibiotics to identify the organism and guide targeted therapy", "Administer antibiotics first", "Notify the provider about line removal first", "Document assessment findings first"],
    a: 0,
    r: "Blood cultures must be obtained BEFORE antibiotic administration to avoid false-negative results. The sequence is: (1) blood cultures from the line AND peripherally, (2) antibiotics within 1 hour of sepsis recognition, (3) discuss line removal with the provider (source control), (4) document findings. However, in unstable sepsis, if cultures will significantly delay antibiotics, both should occur nearly simultaneously.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse educator is teaching about the clinical relevance of bacterial capsules. A student asks: 'If capsules prevent phagocytosis, how do conjugate vaccines work against encapsulated organisms?' The BEST response is:",
    o: ["Conjugate vaccines destroy the capsule directly", "Conjugate vaccines link capsular polysaccharides to protein carriers, generating anti-capsular antibodies. These antibodies opsonize the capsule, overcoming its anti-phagocytic properties and marking the bacteria for immune destruction. This is how PCV13, Hib, and meningococcal vaccines work", "Conjugate vaccines bypass the capsule entirely", "Capsules are only important for laboratory identification"],
    a: 1,
    r: "Conjugate vaccines generate anti-capsular antibodies that bind to the polysaccharide capsule surface, acting as opsonins. Opsonized bacteria are recognized by Fc receptors on neutrophils and macrophages, overcoming the capsule's anti-phagocytic properties. Complement activation on the opsonized capsule further enhances killing. This targeted approach is why conjugate vaccines are so effective against encapsulated pathogens.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is evaluating four patients for potential device-related biofilm infections. Which patient presentation is MOST consistent with biofilm-mediated device infection?\n\n1. New hemodialysis catheter placed 2 hours ago, no symptoms\n2. Prosthetic knee (3 years old): chronic low-grade knee pain, intermittent low-grade fevers, CRP mildly elevated, negative blood cultures\n3. Peripheral IV, day 1, no redness or tenderness\n4. Foley catheter, day 1, clear urine, afebrile",
    o: ["Patient 1: Too early for biofilm", "Patient 2: Chronic symptoms with prosthetic device, intermittent fevers, elevated inflammatory markers — classic biofilm-mediated prosthetic joint infection", "Patient 3: New IV without signs of infection", "Patient 4: Early Foley without UTI signs"],
    a: 1,
    r: "Patient 2 shows hallmarks of biofilm-mediated prosthetic joint infection: chronic duration (biofilm matures over time), low-grade symptoms (biofilm bacteria are in a low-metabolic state), intermittent fevers (periodic planktonic shedding from biofilm), mildly elevated CRP (chronic low-level inflammation), and negative blood cultures (organisms are primarily sessile in biofilm, not circulating). This typically requires prosthesis removal.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is caring for a mechanically ventilated ICU patient who develops ventilator-associated pneumonia (VAP) on day 7 of intubation. Sputum Gram stain shows gram-negative rods. The nurse understands that biofilm on the endotracheal tube contributes to VAP by:",
    o: ["Creating an allergic reaction to the tube material", "Serving as a reservoir: bacteria colonize the tube surface, form biofilm, and are dislodged into the lower airways during suctioning or patient movement, seeding the sterile lung tissue", "Preventing the ventilator from delivering adequate tidal volumes", "Causing the patient to produce more sputum"],
    a: 1,
    r: "Biofilm forms on endotracheal tubes within 24 hours of intubation. Gram-negative organisms (Pseudomonas, Klebsiella) are common colonizers. Biofilm fragments are dislodged into the lower airways during suctioning, repositioning, or ventilator circuit manipulation, seeding sterile lung parenchyma. This is a primary VAP mechanism, which is why VAP prevention bundles focus on minimizing intubation duration.",
    s: "Infectious Disease"
  },
  {
    q: "A patient has a positive urine culture for E. coli (100,000 CFU/mL) but is completely asymptomatic — no fever, dysuria, frequency, or urgency. The provider does not order antibiotics. The patient asks the nurse why. The BEST explanation is:",
    o: ["The lab result is probably a mistake", "This is asymptomatic bacteriuria — bacteria are present but not causing infection. Treating asymptomatic bacteriuria with antibiotics provides no benefit and increases antibiotic resistance risk and C. difficile risk. Antibiotics are only needed for symptomatic UTI or in specific situations like pregnancy", "All positive cultures need antibiotic treatment", "You should insist on antibiotics"],
    a: 1,
    r: "Asymptomatic bacteriuria is present in 3-5% of healthy women and up to 50% of catheterized patients. Treating asymptomatic bacteriuria with antibiotics does NOT prevent symptomatic UTI, does NOT improve outcomes, and contributes to antibiotic resistance and C. difficile. Exceptions requiring treatment: pregnancy (risk of pyelonephritis/preterm labor) and pre-urologic procedure. This is an important stewardship concept.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing the results of a rapid molecular diagnostic test (PCR panel) for a critically ill patient with suspected sepsis. The results return in 2 hours showing: 'Klebsiella pneumoniae detected, KPC gene detected.' The nurse understands this finding means:",
    o: ["The organism is susceptible to all standard antibiotics", "This is a carbapenem-resistant Enterobacterales (CRE) organism producing KPC carbapenemase — standard antibiotics including carbapenems will be ineffective, requiring ceftazidime-avibactam or polymyxin-based therapy and enhanced contact precautions", "Only oral antibiotics will work", "KPC is a benign finding that doesn't affect treatment"],
    a: 1,
    r: "Rapid molecular testing identifying KPC gene indicates CRE — the organism produces KPC carbapenemase that destroys carbapenems. Rapid identification (2 hours vs. 48-72 hours for traditional culture) allows immediate appropriate therapy (ceftazidime-avibactam, meropenem-vaborbactam) rather than waiting for phenotypic susceptibility. Enhanced contact precautions must be implemented immediately. CRE carries 40-50% mortality.",
    s: "Infectious Disease"
  },

  // ===== ADDITIONAL ANTIBIOTIC RESISTANCE CAT (10 questions) =====
  {
    q: "A nurse is caring for a critically ill patient in the ICU. The patient has been on meropenem for 5 days for ESBL E. coli bacteremia. Blood cultures are now negative, and the patient is clinically improving. The infectious disease physician recommends switching to ertapenem (a narrower carbapenem). The nurse understands this recommendation because:",
    o: ["Ertapenem and meropenem are identical", "Ertapenem has a narrower spectrum than meropenem — it covers ESBL organisms but lacks anti-pseudomonal activity, reducing selective pressure for Pseudomonas resistance. This is de-escalation within the carbapenem class", "Ertapenem is less expensive but otherwise the same", "The physician made an error — meropenem should be continued"],
    a: 1,
    r: "Ertapenem is a Group 1 carbapenem with ESBL coverage but WITHOUT anti-pseudomonal or Acinetobacter activity (unlike meropenem/imipenem). Switching from meropenem to ertapenem for susceptible ESBL infection is stewardship de-escalation within the carbapenem class — it maintains efficacy against the ESBL organism while reducing selective pressure for Pseudomonas and Acinetobacter resistance.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is managing four patients with different resistant organisms. Which patient requires the MOST stringent isolation precautions?\n\n1. MRSA wound infection, stable\n2. VRE colonization, no active infection\n3. ESBL UTI, on appropriate antibiotics\n4. Pan-resistant Acinetobacter baumannii pneumonia (resistant to all tested antibiotics including carbapenems and polymyxins)",
    o: ["Patient 1: MRSA requires standard contact precautions", "Patient 2: VRE requires contact precautions", "Patient 3: ESBL requires contact precautions", "Patient 4: Pan-resistant Acinetobacter requires the most stringent precautions — enhanced contact isolation, dedicated equipment, enhanced environmental cleaning, and potentially cohorted nursing staff"],
    a: 3,
    r: "Pan-resistant Acinetobacter (resistant to ALL tested antibiotics) represents the most extreme MDR threat. No effective treatment exists. Maximum infection control measures are essential: enhanced contact precautions, private room, dedicated equipment, enhanced cleaning with appropriate disinfectants, potentially dedicated nursing staff, and active surveillance of contacts. Containment is the only strategy when treatment options are exhausted.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is participating in a quality improvement project to reduce C. difficile rates on the unit. Which combination of interventions has the STRONGEST evidence base?\n\nA. Restrict fluoroquinolone and clindamycin prescribing + enhance environmental cleaning with bleach + improve hand hygiene with soap and water\nB. Place all patients on prophylactic oral vancomycin\nC. Use alcohol-based hand sanitizer more frequently\nD. Test all patients for C. difficile on admission",
    o: ["Option A: Antimicrobial stewardship + sporicidal cleaning + appropriate hand hygiene — a comprehensive evidence-based approach", "Option B: Prophylactic vancomycin increases resistance risk", "Option C: Alcohol-based sanitizer doesn't kill C. diff spores", "Option D: Testing asymptomatic patients leads to overdiagnosis and unnecessary treatment"],
    a: 0,
    r: "C. difficile prevention requires a comprehensive approach: (1) Stewardship — restricting high-risk antibiotics (fluoroquinolones, clindamycin, broad-spectrum cephalosporins) reduces C. diff risk by reducing normal flora disruption; (2) Bleach-based cleaning destroys spores on environmental surfaces; (3) Soap and water hand hygiene physically removes spores (alcohol is ineffective). Option B promotes resistance, C is ineffective against spores, D leads to over-treatment of asymptomatic carriers.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing the medication administration record and notices a patient has been prescribed both linezolid for VRE bacteremia and sertraline (an SSRI) for depression. What is the PRIORITY nursing concern?",
    o: ["Drug-drug cost implications", "Serotonin syndrome risk — linezolid is a weak MAO inhibitor, and combined with an SSRI, there is significant risk of serotonin toxicity (hyperthermia, clonus, agitation, autonomic instability). The nurse should hold linezolid, notify the provider immediately", "No interaction between these medications", "The sertraline may reduce linezolid effectiveness"],
    a: 1,
    r: "Linezolid is a weak, non-selective MAO inhibitor. Combined with serotonergic medications (SSRIs, SNRIs, tramadol, meperidine, triptans), it creates significant serotonin syndrome risk: hyperthermia, muscular rigidity, clonus, altered mental status, and autonomic instability. The nurse should hold the medication, notify the provider immediately, and advocate for either an alternative antibiotic (daptomycin for VRE) or temporary SSRI discontinuation with monitoring.",
    s: "Infectious Disease"
  },
  {
    q: "A patient with a wound infection asks: 'The doctor said the bacteria in my wound have efflux pumps that pump out antibiotics. How can any antibiotic work?' The nurse's BEST response incorporating patient education is:",
    o: ["Unfortunately, no antibiotics can work against efflux pumps", "Some antibiotics are not substrates for these pumps and can still enter the cell effectively. Your healthcare team will use susceptibility testing to find antibiotics that work against your specific infection, even with efflux pumps present. Some newer drugs are designed to overcome these resistance mechanisms", "Efflux pumps are not real", "You should accept that the infection cannot be treated"],
    a: 1,
    r: "Efflux pumps are substrate-specific — they pump out certain antibiotic classes but not all. Susceptibility testing identifies antibiotics that are not substrates for the expressed efflux pumps. Some newer antibiotics (e.g., eravacycline, omadacycline) are designed to evade common efflux pumps. Additionally, efflux pump inhibitors are in development. Patient education should provide hope while explaining the complexity.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing the following antibiotic order for a patient with sepsis:\n\nVancomycin 1g IV q12h (for MRSA coverage)\nPiperacillin-tazobactam 4.5g IV q8h over 4 hours (extended infusion)\nGentamicin 7mg/kg IV q24h (once-daily dosing)\n\nThe nurse recognizes that each antibiotic uses a different dosing strategy. Which pharmacodynamic principle explains the once-daily gentamicin dosing?",
    o: ["Gentamicin requires sustained levels like beta-lactams", "Aminoglycosides exhibit concentration-dependent killing — higher peak-to-MIC ratios produce greater bacterial kill. Once-daily dosing achieves very high peaks while allowing troughs to fall below toxic levels, maximizing efficacy and minimizing nephro/ototoxicity", "Once-daily dosing is simply more convenient for nursing", "All antibiotics should be given once daily"],
    a: 1,
    r: "Gentamicin's concentration-dependent killing means efficacy depends on peak concentration relative to MIC (Cmax/MIC >10). Once-daily (extended-interval) dosing produces very high peaks (maximizing killing) while allowing troughs to fall <1 mcg/mL (minimizing toxicity). This differs from vancomycin (AUC/MIC dependent, 400-600) and piperacillin-tazobactam (time-dependent, extended infusion maximizes fT>MIC).",
    s: "Infectious Disease"
  },
  {
    q: "A patient is being discharged with a PICC line for 4 weeks of IV ceftriaxone for osteomyelitis. The nurse is providing discharge education. Which topics are MOST important to include?",
    o: ["Only PICC line flushing instructions", "PICC line care (flushing, dressing changes, signs of complications), antibiotic administration timing and technique, signs of treatment failure (worsening pain, fever return), signs of adverse effects (rash, diarrhea, C. difficile warning signs), and when to call the provider or go to the ED", "Diet modifications only", "Return to normal activities immediately"],
    a: 1,
    r: "Comprehensive discharge education for outpatient parenteral antibiotic therapy (OPAT) must cover: PICC line care and complication recognition (infection, clotting, dislodgement), medication timing (consistent intervals), adverse effect monitoring (allergic reactions, C. difficile diarrhea, injection site reactions), treatment failure signs (worsening symptoms), and clear criteria for when to seek emergency care.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing a patient's antibiotic history and notes the following pattern over the past year:\n- January: Ciprofloxacin for UTI\n- April: Levofloxacin for bronchitis\n- July: Ciprofloxacin for UTI\n- October: Moxifloxacin for sinusitis\n\nThe nurse identifies which stewardship concern?",
    o: ["This prescribing pattern is appropriate and expected", "Excessive fluoroquinolone exposure — four courses in 12 months significantly increases C. difficile risk, promotes fluoroquinolone resistance in the patient's flora, and increases risk for tendon rupture, peripheral neuropathy, and aortic dissection (FDA black-box warnings)", "The patient should have received higher doses each time", "Only the bronchitis treatment was inappropriate"],
    a: 1,
    r: "Four fluoroquinolone courses in 12 months is excessive. Stewardship concerns: (1) C. difficile risk increases with each exposure, (2) the patient's flora is being selected for fluoroquinolone-resistant organisms, (3) cumulative FDA black-box warning risks (tendon rupture, peripheral neuropathy, CNS effects, aortic dissection), (4) viral bronchitis doesn't require antibiotics. Alternative narrow-spectrum agents should be prioritized.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse in the emergency department is caring for a patient with suspected meningococcal meningitis (fever, headache, petechial rash, nuchal rigidity). Blood cultures have been obtained. The provider orders ceftriaxone but the pharmacy reports a 30-minute delay. What is the MOST appropriate nursing action?",
    o: ["Wait for pharmacy to prepare ceftriaxone", "Administer ceftriaxone from the automated dispensing cabinet override immediately — bacterial meningitis mortality increases dramatically with each hour of antibiotic delay, and meningococcal disease can progress to fulminant sepsis within hours", "Give oral amoxicillin as a substitute", "Perform a lumbar puncture before any antibiotics"],
    a: 1,
    r: "Bacterial meningitis (especially meningococcal) can progress to fulminant sepsis and death within hours. Each hour of antibiotic delay increases mortality. The nurse should use the automated dispensing cabinet override to obtain ceftriaxone immediately. Blood cultures were already obtained. Lumbar puncture should NOT delay antibiotics — it can be performed after antibiotic initiation. Also implement droplet precautions immediately.",
    s: "Infectious Disease"
  },
  {
    q: "A medical-surgical nurse is caring for a patient on day 10 of IV vancomycin + cefepime for nosocomial pneumonia. The patient is improving: afebrile for 5 days, WBC normalized, sputum clearing. The most recent chest X-ray shows resolving infiltrate. No stop date has been set. Which stewardship intervention should the nurse advocate for?",
    o: ["Continue antibiotics until the chest X-ray is completely clear", "Discuss with the provider: clinical criteria for treatment completion are met (afebrile, normalizing WBC, improving imaging), and evidence supports 7-8 days of therapy for nosocomial pneumonia — prolonged courses beyond clinical resolution increase C. difficile and resistance risk without benefit", "Add a third antibiotic for complete coverage", "Switch to oral antibiotics and continue for 30 more days"],
    a: 1,
    r: "Evidence supports 7-8 day antibiotic courses for hospital-acquired/ventilator-associated pneumonia (PneumA trial, IDSA guidelines). Longer courses beyond clinical resolution do not improve outcomes but increase: C. difficile risk, antibiotic adverse effects, resistance selection, and cost. The nurse should advocate for a planned stop date and communicate clinical improvement during the antibiotic timeout discussion.",
    s: "Infectious Disease"
  },

  // ===== ADDITIONAL VACCINE MECHANISMS CAT (10 questions) =====
  {
    q: "A community health nurse is conducting a vaccination clinic in a neighborhood where measles vaccination coverage has dropped to 88%. A parent states: 'My child doesn't need the vaccine because everyone else is vaccinated.' The nurse's MOST effective response addresses:",
    o: ["That's correct — your child is protected by others' immunity", "At 88% coverage, your community is BELOW the 93-95% threshold needed for measles herd immunity. Each unvaccinated child creates a gap that can allow measles outbreaks — and measles is extremely contagious. Your child is not protected by the current coverage level and is at risk", "Herd immunity doesn't apply to measles", "Your child will be fine regardless"],
    a: 1,
    r: "Measles herd immunity requires 93-95% coverage (R0=12-18, one of the most contagious diseases). At 88%, the community is below this threshold, and measles outbreaks can occur. The parent's assumption is factually incorrect — their child is NOT protected at this coverage level. Recent outbreaks in communities with declining MMR coverage demonstrate this principle. Direct, factual communication is essential.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is caring for a 6-week-old premature infant (born at 32 weeks gestation, now corrected to 38 weeks) in the NICU who is being discharged. The parents ask about the vaccination schedule. The nurse advises:",
    o: ["Delay all vaccines until the baby reaches the weight of a full-term infant", "Premature infants should be vaccinated according to chronological age (age from birth), not corrected gestational age. The same doses and schedule apply, except hepatitis B vaccine requires the infant to be ≥2,000g at birth (or given at 1 month if <2,000g at birth)", "Premature infants should never receive vaccines", "Only give half-doses to premature infants"],
    a: 1,
    r: "Premature infants are at HIGHER risk for vaccine-preventable diseases and should be vaccinated on schedule based on chronological age from birth, not corrected age. Full standard doses are given — studies show premature infants mount adequate immune responses. The only exception is hepatitis B: if birth weight <2,000g AND mother is HBsAg-negative, the birth dose can be deferred to 1 month or hospital discharge.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is administering the Tdap vaccine to a healthcare worker. The nurse accidentally injects into the subcutaneous tissue instead of the deltoid muscle. What are the implications?",
    o: ["No difference — route doesn't matter for vaccines", "Subcutaneous injection of an IM vaccine may cause: increased local reaction (pain, redness, nodule formation), potentially reduced immunogenicity (suboptimal antigen presentation), but the dose should still count. Document the error and monitor the injection site", "The dose is completely wasted and must be immediately re-administered IM", "The subcutaneous route is preferred for Tdap"],
    a: 1,
    r: "Subcutaneous injection of an IM vaccine typically causes more pronounced local reactions (larger nodule, more pain, slower absorption) and may have slightly reduced immunogenicity for aluminum-adjuvanted vaccines (adjuvant works optimally in muscle). However, the dose generally still counts and does NOT need to be repeated. Document the route error, monitor the injection site, and use proper technique for future injections.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is caring for a bone marrow transplant recipient who is 8 months post-transplant. The patient received all childhood vaccines before transplant. The transplant team orders re-vaccination with the full childhood series. The patient asks why. The nurse explains:",
    o: ["It's just standard protocol without scientific basis", "Bone marrow transplant destroys the recipient's immune system, including all memory B-cells and T-cells. The donor's bone marrow creates a new immune system that has no immunological memory of previous vaccinations. Re-vaccination is necessary to rebuild immunity from scratch", "The previous vaccines expired", "Only booster doses are needed, not the full series"],
    a: 1,
    r: "Myeloablative conditioning for bone marrow transplant destroys the recipient's entire immune system, including all memory lymphocytes. The new immune system derived from donor stem cells has no memory of previous vaccinations. Complete re-vaccination is required starting 6-12 months post-transplant, beginning with inactivated vaccines. Live vaccines (MMR, varicella) are deferred until 24 months post-transplant and off immunosuppression.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse in the occupational health department discovers that a healthcare worker's hepatitis B surface antibody (anti-HBs) titer is <10 mIU/mL despite completing the 3-dose series 5 years ago. What does the nurse recommend?",
    o: ["No action needed — the worker was previously vaccinated", "Administer a single booster dose of hepatitis B vaccine and recheck the titer in 1-2 months. If still <10 mIU/mL, complete a second 3-dose series. Non-responders after 6 doses require alternative protection strategies", "The worker should avoid patient care", "Repeat the antibody test immediately — it's likely a lab error"],
    a: 1,
    r: "Anti-HBs <10 mIU/mL indicates non-protective immunity. The ACIP recommends a single booster dose with titer recheck at 1-2 months. If the anamnestic response boosts titers ≥10, the worker is protected. If still <10, a complete second 3-dose series is given. After 6 total doses, persistent non-responders (~5%) require post-exposure prophylaxis with HBIG if exposed to hepatitis B.",
    s: "Infectious Disease"
  },
  {
    q: "A 70-year-old patient received the first dose of Shingrix (recombinant zoster vaccine) 3 months ago and reports: 'The first shot gave me a sore arm and fatigue for 2 days. I don't want to get the second dose.' The nurse's BEST response is:",
    o: ["You're right to be concerned — skip the second dose", "Those symptoms were actually signs that your immune system was responding to the vaccine, which is a good sign. The second dose is essential — without it, protection drops significantly. Shingrix requires both doses for >90% effectiveness against shingles. I can pre-plan symptom management with acetaminophen after your injection", "The second dose has fewer side effects", "One dose provides complete protection"],
    a: 1,
    r: "Shingrix local and systemic reactogenicity (injection site pain, fatigue, myalgia) reflects immune activation — the AS01B adjuvant strongly stimulates innate immunity. Two doses are essential: single-dose efficacy is approximately 68-70%, while the complete 2-dose series provides >90% protection. The nurse should normalize the expected reactions, pre-plan symptom management, and strongly recommend completion.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is caring for a patient who received organ transplant immunosuppressive therapy (tacrolimus, mycophenolate, prednisone). The patient needs vaccination against COVID-19. Which vaccine considerations apply?",
    o: ["No vaccines can be given to transplant patients", "Inactivated and mRNA vaccines are safe for transplant patients but may have reduced immunogenicity due to immunosuppression. Additional doses may be recommended. Live vaccines are contraindicated. Antibody titers post-vaccination may help assess response", "Only live vaccines work in transplant patients", "Standard vaccine schedule applies without modification"],
    a: 1,
    r: "Solid organ transplant recipients on immunosuppression can receive inactivated/mRNA/subunit vaccines safely, but the immune response may be blunted (30-50% may not seroconvert after standard series). Additional doses are recommended for COVID-19 and other vaccines. Live vaccines (MMR, varicella, live influenza) are CONTRAINDICATED due to risk of disseminated vaccine-strain infection. Post-vaccination antibody testing guides need for additional doses.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is conducting a well-child visit for a 12-month-old. The immunization record shows the infant has received NO vaccines due to parental hesitancy. The parents now want to start vaccinating. How should the catch-up schedule be approached?",
    o: ["Start with only one vaccine per visit to avoid overwhelming the immune system", "Begin all age-appropriate vaccines simultaneously using the accelerated catch-up schedule with minimum intervals — giving multiple vaccines today maximizes protection during this vulnerable period. The infant's immune system can safely handle multiple simultaneous vaccines", "Wait until the child is 2 years old to start", "Only give the most critical vaccines"],
    a: 1,
    r: "The catch-up schedule uses minimum intervals between doses to accelerate protection. At 12 months, the child should receive all age-appropriate vaccines simultaneously (DTaP, IPV, Hib, PCV13, hepatitis B, MMR, varicella, hepatitis A). Studies confirm simultaneous vaccination is safe and does not overwhelm the immune system. Every visit is an opportunity — delayed vaccination leaves the child vulnerable.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is providing post-vaccination education to a patient who received the COVID-19 mRNA booster. The patient asks: 'How does this booster make my immunity better than just repeating the same thing?' The BEST evidence-based explanation is:",
    o: ["The booster contains different ingredients than the original vaccine", "Boosters restimulate your immune memory cells, triggering them to produce higher quantities of more precisely targeted antibodies through a process called affinity maturation. Your immune system 'learns' to make better antibodies each time it encounters the antigen, broadening protection including against variants", "Boosters work by completely replacing your previous immunity", "There is no benefit to boosting — it's the same immune response"],
    a: 1,
    r: "Booster doses drive affinity maturation in germinal centers — memory B-cells undergo additional rounds of somatic hypermutation and selection, producing antibodies with progressively higher binding affinity. Class switching produces more IgG. Memory B-cell diversity increases, broadening protection against variants (epitope spreading). The secondary/tertiary response is faster (1-3 days), larger (10-100x more antibodies), and qualitatively superior.",
    s: "Infectious Disease"
  },
  {
    q: "A new nurse asks: 'Why do we give PCV13 (conjugate) to infants but used to give PPSV23 (polysaccharide) to elderly adults? What's the difference?' The preceptor's BEST explanation addresses the immunological basis:",
    o: ["They are the same vaccine with different names", "Infants under 2 have immature B-cells that cannot respond to polysaccharide antigens alone — conjugation to a protein carrier enables T-cell help and memory formation. Adults have mature B-cells that can respond to polysaccharides, but current guidelines now recommend PCV20 for adults too, as conjugate vaccines produce better memory responses and mucosal immunity than polysaccharide vaccines at all ages", "Polysaccharide vaccines are always superior", "The choice is based on cost, not immunology"],
    a: 1,
    r: "This reflects the immunological maturation of B-cell responses. Children <2 years cannot mount T-independent responses to polysaccharides — conjugation recruits T-helper cells, enabling memory formation. Adults can respond to polysaccharides but with limited memory (T-independent). Current ACIP guidelines now recommend conjugate vaccines (PCV20) for adults because they produce stronger memory responses and reduce nasopharyngeal carriage (herd immunity benefit).",
    s: "Infectious Disease"
  }
];
