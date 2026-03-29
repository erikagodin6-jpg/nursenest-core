import type { ExamQuestion } from "./types";

export const npExamBatch28Questions: ExamQuestion[] = [
  {
    q: "An NP is treating a patient in a telehealth visit. During the visit, the NP notices concerning findings that suggest the patient may need an in-person examination. The patient lives 3 hours from the clinic and prefers telehealth only. What is the NP's responsibility?",
    o: ["Inform the patient that the clinical findings require in-person evaluation for patient safety, offer alternative closer providers if possible, and document the clinical rationale", "Continue telehealth management to accommodate patient preference", "Prescribe treatment based on telehealth assessment alone despite concerning findings", "End the telehealth visit and discharge the patient from care"],
    a: 0,
    r: "The NP's primary obligation is patient safety, which supersedes convenience. When telehealth assessment is insufficient for safe clinical decision-making, the NP must clearly communicate the need for in-person evaluation and document the clinical reasoning. Offering alternative closer providers demonstrates patient-centered care. Prescribing without adequate assessment creates liability. Patient abandonment (ending care without referral) is unethical and potentially illegal.",
    s: "Professional Practice"
  },
  {
    q: "An NP discovers a systemic medication dispensing error affecting 15 patients in her practice over the past month. No patients have been harmed. What is the NP's obligation?",
    o: ["Report through the institutional incident reporting system, conduct root cause analysis, notify affected patients per institutional policy and state law, and implement corrective action plan", "Correct the errors quietly without reporting since no harm occurred", "Report only the errors affecting patients who noticed symptoms", "Wait to see if any patients develop adverse effects before reporting"],
    a: 0,
    r: "Healthcare error reporting is both an ethical and legal obligation regardless of whether harm occurred. The NP must: 1) Report through incident reporting systems, 2) Participate in root cause analysis to identify systemic factors, 3) Notify affected patients per institutional policy and disclosure laws, 4) Implement corrective action to prevent recurrence. Concealing errors violates the ethical principle of transparency and prevents system improvement. Near-misses are critical learning opportunities for patient safety improvement.",
    s: "Professional Practice"
  },
  {
    q: "A 60-year-old male with type 2 diabetes, hypertension, and hyperlipidemia asks about his recommended immunizations. He received PCV20 last year and influenza vaccine 11 months ago. Which additional vaccines should the NP recommend?",
    o: ["Annual influenza vaccine, Tdap if not received in past 10 years, herpes zoster recombinant vaccine (Shingrix) 2-dose series", "No additional vaccines needed this year", "Live attenuated influenza vaccine", "Pneumococcal revaccination with PCV20"],
    a: 0,
    r: "This 60-year-old should receive: annual influenza vaccine (injectable, not LAIV for patients with chronic conditions), Tdap booster (if more than 10 years since last dose, then Td every 10 years), and Shingrix (recommended for all adults 50 and older, 2-dose series at 0 and 2-6 months, regardless of prior zoster history or Zostavax receipt). PCV20 is a one-time vaccine and does not need repeating. COVID-19 vaccination status should also be assessed.",
    s: "Preventive Medicine"
  },
  {
    q: "A 35-year-old female with a BMI of 42 and two prior failed medically supervised weight loss attempts asks about bariatric surgery. She has type 2 diabetes, hypertension, and obstructive sleep apnea. What are the NP's counseling points?",
    o: ["She meets criteria for bariatric surgery (BMI 40 or greater, or 35 or greater with obesity-related comorbidities); discuss surgical options, required preoperative evaluation, and lifelong nutritional follow-up", "Bariatric surgery is only for BMI greater than 50", "Advise another 6-month medically supervised diet before referral", "Bariatric surgery does not improve diabetes or hypertension"],
    a: 0,
    r: "NIH/ASMBS criteria for bariatric surgery include BMI 40 or greater, or BMI 35 or greater with obesity-related comorbidities (diabetes, hypertension, OSA). This patient meets criteria. Surgical options include Roux-en-Y gastric bypass, sleeve gastrectomy, and adjustable gastric banding. Preoperative evaluation includes psychiatric assessment, nutritional counseling, and medical optimization. Benefits include 50-70% excess weight loss, type 2 diabetes remission (60-80% with RYGB), and improved mortality. Lifelong vitamin/mineral supplementation and follow-up are required.",
    s: "Preventive Medicine"
  },
  {
    q: "A 55-year-old male with hepatitis C (genotype 1b) achieved sustained virologic response (SVR) with direct-acting antiviral therapy 2 years ago. He has cirrhosis (Child-Pugh A). What ongoing surveillance is required?",
    o: ["Hepatocellular carcinoma screening with abdominal ultrasound with or without AFP every 6 months indefinitely, as cirrhosis-related HCC risk persists despite SVR", "No further surveillance since HCV is cured", "Annual liver function tests only", "Colonoscopy every 5 years"],
    a: 0,
    r: "Despite achieving SVR (virologic cure), patients with cirrhosis retain HCC risk because fibrosis/cirrhosis may persist. AGA/AASLD guidelines recommend continued HCC surveillance with ultrasound (with or without AFP) every 6 months indefinitely in patients with cirrhosis, regardless of SVR status. HCC risk decreases after SVR but does not reach zero. Non-cirrhotic patients who achieve SVR do not require ongoing HCC surveillance. Liver stiffness and fibrosis regression should be monitored.",
    s: "Preventive Medicine"
  },
  {
    q: "A 35-year-old pregnant female at 16 weeks gestation has a positive Toxoplasma IgM and IgG. She owns 3 cats and reports cleaning the litter box daily. What should the NP do?",
    o: ["Order Toxoplasma IgG avidity testing to differentiate acute from past infection; counsel on cat litter avoidance and food safety; refer to maternal-fetal medicine", "Start empiric spiramycin immediately", "Reassure that toxoplasmosis is benign in pregnancy", "Recommend rehoming all cats immediately"],
    a: 0,
    r: "Positive IgM and IgG in pregnancy can represent acute infection (high risk of congenital toxoplasmosis) or chronic infection with persistent IgM (common, benign). IgG avidity testing differentiates: low avidity indicates recent (less than 4 months) infection, high avidity indicates past infection. If acute infection is confirmed, spiramycin (first trimester) or pyrimethamine-sulfadiazine (after first trimester) reduces transmission risk. Cat litter should be changed by someone else or gloves used. Cats do not need to be rehomed.",
    s: "Infectious Disease"
  },
  {
    q: "A 50-year-old male with a prosthetic knee joint presents with acute onset joint pain, swelling, and warmth 18 months after surgery. Temperature is 38.5 C. WBC is 15,000. What is the priority diagnostic and management step?",
    o: ["Arthrocentesis for synovial fluid analysis and culture before initiating empiric IV antibiotics; urgent orthopedic consultation", "Start oral antibiotics and follow up in 1 week", "Apply ice and prescribe NSAIDs", "Order joint X-ray and defer aspiration"],
    a: 0,
    r: "Acute prosthetic joint infection (PJI) presents with acute onset pain, swelling, warmth, and systemic signs in a previously well-functioning joint. Arthrocentesis is essential for synovial fluid WBC count (typically greater than 1100 in PJI), differential (greater than 64% PMN), culture, and crystal analysis. Cultures must be obtained BEFORE antibiotics. Orthopedic consultation is urgent as PJI may require surgical intervention (debridement with prosthesis retention, one-stage or two-stage exchange). IV antibiotics cover MSSA and MRSA pending culture results.",
    s: "Infectious Disease"
  },
  {
    q: "A 40-year-old female presents with easy bruising and petechiae. CBC shows isolated thrombocytopenia (platelets 18,000/mm3). WBC and hemoglobin are normal. Peripheral smear shows large platelets and no schistocytes. What is the most likely diagnosis and initial treatment?",
    o: ["Immune thrombocytopenic purpura (ITP); initiate corticosteroids (prednisone 1 mg/kg/day) or IVIG for rapid platelet elevation", "Thrombotic thrombocytopenic purpura; plasma exchange", "Disseminated intravascular coagulation; treat underlying cause", "Heparin-induced thrombocytopenia; discontinue heparin"],
    a: 0,
    r: "Isolated thrombocytopenia in an otherwise healthy patient with large platelets (indicating compensatory bone marrow response) and no schistocytes (ruling out TTP/HUS) is most consistent with ITP. ITP is a diagnosis of exclusion. First-line treatment for symptomatic ITP or platelets below 20,000 is corticosteroids (prednisone 1 mg/kg for 2-4 weeks with taper). IVIG provides rapid but transient platelet elevation for acute bleeding. Second-line options include rituximab, thrombopoietin receptor agonists (eltrombopag, romiplostim), and splenectomy.",
    s: "Hematology"
  },
  {
    q: "A 25-year-old African American male presents with severe bone pain, fever, and hemoglobin of 6.2 g/dL. He has a history of sickle cell disease. Reticulocyte count has dropped to 0.5% (normally elevated). Peripheral smear shows absence of reticulocytes. What complication has occurred?",
    o: ["Aplastic crisis most likely from parvovirus B19 infection; check parvovirus B19 IgM and supportive care with transfusion", "Acute chest syndrome; chest X-ray and exchange transfusion", "Splenic sequestration; emergent splenectomy", "Hemolytic crisis; increase hydroxyurea dose"],
    a: 0,
    r: "Sickle cell disease with sudden severe anemia and reticulocytopenia (inappropriately low reticulocyte count) indicates aplastic crisis, most commonly caused by parvovirus B19 infection. B19 infects erythroid precursors, halting red cell production for 7-10 days. In patients with shortened RBC lifespan (SCD), this causes precipitous hemoglobin drop. Treatment is supportive with RBC transfusion. The crisis is self-limited as B19 viremia clears and reticulocytosis resumes. Patients are infectious and should be isolated from other sickle cell patients and pregnant women.",
    s: "Hematology"
  },
  {
    q: "An 85-year-old male with advanced Parkinson disease in a skilled nursing facility has progressive dysphagia. A speech-language pathology evaluation recommends a pureed diet with thickened liquids. He is losing weight despite this. His family asks about alternative options. What should the NP discuss?",
    o: ["Discuss goals of care including comfort feeding, quality of life priorities, and risks vs benefits of enteral feeding; tube feeding does not prevent aspiration in neurodegenerative dysphagia", "Recommend PEG tube placement to prevent aspiration and maintain nutrition", "Suggest TPN for indefinite nutritional support", "Advise oral nutritional supplements without texture modification"],
    a: 0,
    r: "In advanced neurodegenerative diseases (Parkinson, dementia), dysphagia is progressive and irreversible. Evidence shows tube feeding does NOT reduce aspiration risk, improve nutritional status, or prolong meaningful survival in this population. Comfort feeding (careful hand feeding with foods the patient enjoys, accepting aspiration risk) aligns with palliative goals. The NP should facilitate goals-of-care discussions exploring the patient's values, advance directives, and comfort-focused care. TPN is not appropriate for chronic progressive dysphagia.",
    s: "Geriatrics"
  }
];
