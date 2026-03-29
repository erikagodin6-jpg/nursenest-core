import type { ExamQuestion } from "./types";

export const npExamBatch42Questions: ExamQuestion[] = [
  {
    q: "A 90-year-old female in a nursing home with advanced dementia (FAST stage 7C) develops pneumonia. She has a POLST form indicating comfort measures only. Her family requests aggressive treatment including intubation. How should the NP respond?",
    o: ["Honor the POLST form which reflects the patient's previously documented wishes; provide comfort-focused care including symptom management; facilitate a compassionate family meeting to discuss the patient's goals of care", "Intubate per family's request since they are next of kin", "Transfer to the ED for aggressive management", "Withhold all treatment including comfort measures"],
    a: 0,
    r: "POLST (Physician Orders for Life-Sustaining Treatment) is a legally binding medical order that takes precedence over family requests when the patient lacks capacity. It reflects the patient's own previously documented treatment preferences. The NP should: 1) Honor the POLST, 2) Provide aggressive comfort care (morphine for dyspnea, antipyretics, oxygen for comfort), 3) Hold a compassionate family meeting explaining the patient's wishes and the medical context, 4) Address family distress with chaplaincy/social work support. Comfort measures does not mean no treatment -- it means treatment focused on comfort rather than cure.",
    s: "Geriatrics"
  },
  {
    q: "A 30-year-old female presents with dysuria, frequency, and suprapubic pain. Urinalysis shows positive leukocyte esterase and nitrites. She has no fever, flank pain, or systemic symptoms. She is not pregnant. She has had 1 UTI in the past year. What is the empiric treatment?",
    o: ["Nitrofurantoin 100 mg BID for 5 days or TMP-SMX DS BID for 3 days (if local E. coli resistance to TMP-SMX is less than 20%)", "Ciprofloxacin 500 mg BID for 7 days", "Amoxicillin-clavulanate for 10 days", "IV ceftriaxone 1 g daily for 7 days"],
    a: 0,
    r: "Uncomplicated cystitis in a non-pregnant woman is treated empirically with first-line agents: nitrofurantoin monohydrate macrocrystals 100 mg BID for 5 days, or TMP-SMX DS BID for 3 days (if local resistance less than 20%), or fosfomycin 3 g single dose. Fluoroquinolones (ciprofloxacin) should be RESERVED for complicated UTIs or pyelonephritis due to serious side effects (tendon rupture, aortic dissection, neuropathy) and resistance concerns per FDA black box warning. Culture is not routinely needed for uncomplicated cystitis in otherwise healthy women.",
    s: "Infectious Disease"
  },
  {
    q: "A 55-year-old male presents with 3 weeks of cough with rust-colored sputum, night sweats, and 10-pound weight loss. He immigrated from Southeast Asia 5 years ago. CXR shows a right upper lobe cavitary lesion. What is the immediate next step?",
    o: ["Respiratory isolation; obtain 3 sputum specimens for acid-fast bacilli smear and culture; place a tuberculin skin test or IGRA", "Start empiric antibiotics for community-acquired pneumonia", "CT chest before any isolation measures", "Bronchoscopy for tissue biopsy"],
    a: 0,
    r: "Chronic cough with constitutional symptoms (night sweats, weight loss), cavitary upper lobe lesion, and epidemiological risk (immigration from TB-endemic region) mandates immediate respiratory isolation and TB evaluation. Three sputum specimens (ideally 8-24 hours apart with at least 1 early morning specimen) for AFB smear (rapid, moderate sensitivity), culture (gold standard, takes 2-6 weeks), and nucleic acid amplification test (GeneXpert, results within 2 hours with simultaneous rifampin resistance detection). Isolation continues until TB is excluded or the patient achieves clinical improvement on treatment with negative smears.",
    s: "Infectious Disease"
  },
  {
    q: "A 55-year-old male presents with acute onset of severe right first metatarsophalangeal joint pain, redness, and swelling. The pain started overnight and he cannot bear weight. He ate a large steak dinner and drank several beers the night before. Serum uric acid is 9.2 mg/dL. What is the definitive diagnostic test and acute treatment?",
    o: ["Joint aspiration showing negatively birefringent needle-shaped monosodium urate crystals under polarized light microscopy; treat with colchicine, NSAIDs, or corticosteroids", "Serum uric acid level is sufficient for diagnosis", "X-ray of the foot", "Blood culture to rule out septic arthritis"],
    a: 0,
    r: "Joint aspiration with synovial fluid analysis showing negatively birefringent needle-shaped monosodium urate (MSU) crystals under compensated polarized light microscopy is the gold standard for gout diagnosis. Serum uric acid can be normal during an acute flare (negative acute-phase reactant effect) and is unreliable for diagnosis. Acute treatment: colchicine (most effective within 24 hours of onset), NSAIDs (indomethacin, naproxen), or corticosteroids (oral or intra-articular). Do NOT start allopurinol during an acute flare (can worsen symptoms). Triggers include purine-rich foods, alcohol (especially beer), and dehydration.",
    s: "Musculoskeletal"
  },
  {
    q: "A 60-year-old female with a 15-year history of rheumatoid arthritis on methotrexate presents with new-onset morning stiffness lasting 3 hours, synovitis of bilateral MCPs and wrists, and elevated CRP despite methotrexate 25 mg weekly with adequate folic acid supplementation. What treatment escalation is recommended?",
    o: ["Add a biologic DMARD (TNF inhibitor such as adalimumab or etanercept) or JAK inhibitor (tofacitinib) to methotrexate", "Increase methotrexate to 40 mg weekly", "Switch to NSAID monotherapy", "Add hydroxychloroquine only"],
    a: 0,
    r: "RA with inadequate response to maximally dosed methotrexate (25 mg weekly is the maximum recommended dose) requires escalation to biologic or targeted synthetic DMARDs. The treat-to-target strategy aims for remission or low disease activity. First-line biologics: TNF inhibitors (adalimumab, etanercept) combined with methotrexate (combination is superior to either alone). JAK inhibitors (tofacitinib, baricitinib) are oral alternatives. ACR/EULAR guidelines recommend adding a biologic before switching csDMARDs. Monitoring includes TB screening before biologics and hepatitis B/C testing.",
    s: "Musculoskeletal"
  },
  {
    q: "A 50-year-old female with a 10-year ASCVD risk score of 12% asks about statin therapy. She has no diabetes, LDL is 145 mg/dL, and she has no history of ASCVD events. According to ACC/AHA guidelines, what is the recommendation?",
    o: ["Moderate-intensity statin therapy is recommended for primary prevention when 10-year ASCVD risk is 7.5-20% after clinician-patient risk discussion", "Statin therapy is only indicated for ASCVD risk greater than 20%", "Lifestyle modifications only; no statin indicated", "High-intensity statin therapy regardless of risk discussion"],
    a: 0,
    r: "ACC/AHA 2018 cholesterol guidelines recommend statin therapy based on four benefit groups: 1) Clinical ASCVD (secondary prevention -- high-intensity statin), 2) LDL 190 or greater (high-intensity statin), 3) Diabetes age 40-75 (moderate-intensity, high if risk factors), 4) Primary prevention with 10-year ASCVD risk 7.5-20% (moderate-intensity after risk discussion). This patient falls in group 4. Risk-enhancing factors (family history, CRP, CAC score, ethnicity-specific risks) can inform shared decision-making. If ASCVD risk is 5-7.5%, consider risk enhancers; if borderline, CAC scoring can guide the decision.",
    s: "Preventive Medicine"
  },
  {
    q: "A 35-year-old female presents for a well-woman exam. She has no significant medical history. She had a normal Pap smear with HPV co-testing 3 years ago. According to USPSTF guidelines, what cervical cancer screening is recommended?",
    o: ["Pap smear alone every 3 years, or HPV testing alone every 5 years, or co-testing (Pap + HPV) every 5 years for women aged 30-65", "Annual Pap smear regardless of prior results", "Pap smear every 5 years without HPV testing option", "No screening needed until age 40"],
    a: 0,
    r: "USPSTF 2018 cervical cancer screening recommendations for average-risk women: Age 21-29: Pap smear every 3 years (no HPV co-testing). Age 30-65: Three equally acceptable options: 1) Pap smear every 3 years, 2) HPV testing alone every 5 years, 3) Co-testing (Pap + HPV) every 5 years. Over 65 with adequate prior screening: discontinue screening. After hysterectomy with cervix removal and no history of CIN 2+: no screening. Annual Pap smears are no longer recommended due to high false-positive rates leading to unnecessary procedures.",
    s: "Preventive Medicine"
  }
];
