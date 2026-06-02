import { getAssetUrl } from "@/lib/asset-url";
import type { ExamQuestion } from "./types";

export const npExamBatch06Questions: ExamQuestion[] = [
  {
    q: "A 52-year-old female with no family history of breast cancer asks about breast cancer screening. She has average risk. According to current USPSTF guidelines, what is the appropriate screening recommendation?",
    o: ["Biennial screening mammography starting at age 40 for average-risk women", "Annual mammography starting at age 50", "Clinical breast exam annually with mammography every 3 years", "No screening until age 55"],
    a: 0,
    r: "The USPSTF (2024 update) recommends biennial screening mammography for average-risk women starting at age 40 through age 74. This reflects the updated B recommendation for the 40-49 age group. Annual mammography is recommended by some organizations (ACR, ACS) but USPSTF recommends biennial. Clinical breast exam has insufficient evidence as a standalone screening modality.",
    s: "Preventive Medicine"
  },
  {
    q: "A 50-year-old male with no family history of colorectal cancer and average risk asks about colon cancer screening. He has never been screened. Which screening strategy is most appropriate?",
    o: ["Colonoscopy every 10 years or annual FIT (fecal immunochemical test) beginning at age 45", "Colonoscopy at age 55", "Annual guaiac-based fecal occult blood test starting now", "CT colonography every 5 years starting at age 60"],
    a: 0,
    r: "Current guidelines recommend colorectal cancer screening beginning at age 45 for average-risk individuals. Colonoscopy every 10 years or annual FIT are both acceptable first-line strategies. This patient should have started screening at 45 and should begin now. Guaiac-based FOBT has been largely replaced by FIT due to better performance characteristics.",
    s: "Preventive Medicine"
  },
  {
    q: "A 45-year-old male with a BMI of 32, blood pressure of 138/88 mmHg, and fasting glucose of 108 mg/dL asks about diabetes screening. He has no symptoms. What is the recommended screening approach?",
    o: ["Fasting glucose, HbA1c, or oral glucose tolerance test; repeat every 3 years if normal", "Random glucose only if symptomatic", "Screen only if BMI exceeds 40", "No screening until age 50"],
    a: 0,
    r: "USPSTF and ADA recommend screening for type 2 diabetes in adults aged 35-70 with overweight/obesity. This patient has multiple risk factors (BMI 32, borderline hypertension, impaired fasting glucose). Screening can be done with fasting glucose, HbA1c, or OGTT and should be repeated every 3 years if normal. Waiting for symptoms delays diagnosis of a condition that is often asymptomatic in early stages.",
    s: "Preventive Medicine"
  },
  {
    q: "A 65-year-old female who has smoked 1 pack per day for 35 years asks about lung cancer screening. She currently smokes. What is the USPSTF recommendation?",
    o: ["Annual low-dose CT scan; offer smoking cessation counseling and pharmacotherapy concurrently", "Chest X-ray annually", "No screening until symptomatic", "Sputum cytology every 6 months"],
    a: 0,
    r: "USPSTF recommends annual low-dose CT (LDCT) for adults aged 50-80 with a 20-pack-year smoking history who currently smoke or quit within the past 15 years. This patient qualifies with 35 pack-years of active smoking. Screening should be combined with smoking cessation intervention. Chest X-ray lacks sensitivity for early lung cancer detection. Sputum cytology is not recommended for screening.",
    s: "Preventive Medicine"
  },
  {
    q: "A 58-year-old male with well-controlled hypertension and a 10-year ASCVD risk of 12% on lipid panel shows LDL 142 mg/dL, HDL 38 mg/dL, and triglycerides 180 mg/dL. He has tried lifestyle modifications for 6 months. What is the appropriate pharmacotherapy?",
    o: ["Moderate-to-high intensity statin (atorvastatin 40-80 mg or rosuvastatin 20-40 mg)", "Ezetimibe 10 mg monotherapy", "Fenofibrate 145 mg for triglycerides", "Niacin 500 mg daily"],
    a: 0,
    r: "With a 10-year ASCVD risk of 12% (intermediate risk, 7.5-20%), statin therapy is recommended after shared decision-making. Moderate-to-high intensity statins are the cornerstone of lipid management for cardiovascular risk reduction. Ezetimibe is adjunctive therapy after statin optimization. Fenofibrate is considered when triglycerides exceed 500 mg/dL. Niacin has limited evidence for cardiovascular benefit and significant side effects.",
    s: "Preventive Medicine"
  },
  {
    q: "A 32-year-old male presents with fever, night sweats, weight loss, and a CD4 count of 180 cells/mm3. He has not been on antiretroviral therapy. Chest X-ray shows bilateral interstitial infiltrates. LDH is elevated at 520 U/L. SpO2 is 89% on room air. What is the most likely diagnosis and initial treatment?",
    o: ["Pneumocystis jirovecii pneumonia; start TMP-SMX and corticosteroids for PaO2 less than 70 mmHg", "Community-acquired pneumonia; start amoxicillin", "Pulmonary tuberculosis; start RIPE therapy", "Kaposi sarcoma; refer to oncology"],
    a: 0,
    r: "CD4 below 200, bilateral interstitial infiltrates, elevated LDH, and hypoxia are classic for PCP. TMP-SMX is first-line; adjunctive corticosteroids are indicated when PaO2 is less than 70 mmHg or A-a gradient exceeds 35. CAP is less likely given the immunocompromised state and characteristic imaging. TB presents differently on imaging. Kaposi sarcoma is a consideration but imaging pattern differs.",
    s: "Infectious Disease",
    image: getAssetUrl("kaposisarcoma_1773517523349.png")
  },
  {
    q: "A 22-year-old female presents with dysuria, urinary frequency, and suprapubic pain for 2 days. She is not pregnant and has no history of complicated UTI. Urinalysis shows nitrites and leukocyte esterase. What is the recommended empiric treatment?",
    o: ["Nitrofurantoin 100 mg twice daily for 5 days", "Ciprofloxacin 500 mg twice daily for 7 days", "Amoxicillin-clavulanate 875 mg twice daily for 7 days", "TMP-SMX single dose"],
    a: 0,
    r: "Uncomplicated cystitis in a non-pregnant female is treated with nitrofurantoin (first-line per IDSA guidelines) for 5 days. Fluoroquinolones should be reserved for complicated UTIs due to resistance concerns and side effects. Amoxicillin-clavulanate has inferior cure rates. Single-dose TMP-SMX is less effective than the standard 3-day course.",
    s: "Infectious Disease"
  },
  {
    q: "A 45-year-old male with a history of IV drug use presents with fever, new-onset heart murmur, splinter hemorrhages, and Janeway lesions. Blood cultures are drawn. What is the most likely diagnosis and initial empiric antibiotic regimen?",
    o: ["Infective endocarditis; vancomycin plus gentamicin pending culture results", "Rheumatic fever; penicillin and aspirin", "Septic arthritis; ceftriaxone", "Osteomyelitis; nafcillin"],
    a: 0,
    r: "Classic Duke criteria features (fever, new murmur, peripheral embolic phenomena in an IVDU) indicate infective endocarditis. Empiric coverage for both MSSA and MRSA (vancomycin) plus synergistic gentamicin is appropriate pending blood culture and sensitivity results. IVDU-associated endocarditis commonly involves the tricuspid valve with Staphylococcus aureus.",
    s: "Infectious Disease"
  },
  {
    q: "A 60-year-old diabetic male presents with a deep foot ulcer with surrounding cellulitis, crepitus on palpation, and foul-smelling drainage. Temperature is 39.2 C. WBC is 22,000. What is the most appropriate management?",
    o: ["Emergent surgical consultation for debridement plus broad-spectrum IV antibiotics (vancomycin, piperacillin-tazobactam)", "Oral amoxicillin-clavulanate and outpatient wound care", "Topical silver sulfadiazine and daily dressing changes", "Hyperbaric oxygen therapy as sole treatment"],
    a: 0,
    r: "Crepitus, systemic toxicity, and deep infection in a diabetic foot indicate necrotizing soft tissue infection or gas gangrene requiring emergent surgical debridement and broad-spectrum IV antibiotics covering gram-positive, gram-negative, and anaerobic organisms. Outpatient management is inappropriate. Topical therapy is insufficient. HBO is adjunctive, not definitive.",
    s: "Infectious Disease"
  },
  {
    q: "A 30-year-old female presents with a painless genital ulcer. Dark-field microscopy is positive for spirochetes. RPR is reactive at 1:32. FTA-ABS is positive. She is not pregnant and has no drug allergies. What is the recommended treatment?",
    o: ["Benzathine penicillin G 2.4 million units IM single dose", "Doxycycline 100 mg twice daily for 14 days", "Azithromycin 2 g single oral dose", "Ceftriaxone 250 mg IM single dose"],
    a: 0,
    r: "Primary syphilis (painless chancre, positive dark-field, reactive serology) is treated with benzathine penicillin G 2.4 million units IM as a single dose -- the gold standard for all stages of syphilis. Doxycycline is an alternative for penicillin-allergic non-pregnant patients. Azithromycin resistance is increasing. Ceftriaxone is an alternative but penicillin remains preferred.",
    s: "Infectious Disease"
  }
];
