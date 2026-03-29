import type { ExamQuestion } from "./types";

export const npExpansionAQuestions: ExamQuestion[] = [
  // ===== ADVANCED ECG & CARDIAC DIAGNOSTICS (Questions 1-10) =====
  {
    q: "A 58-year-old male presents with exertional chest pain and dyspnea. Resting ECG shows ST depression of 2 mm in leads V4-V6. Troponin is negative. Which diagnostic study should the nurse practitioner order next?",
    o: ["Coronary CT angiography", "Exercise stress echocardiography", "Chest radiograph", "Repeat troponin in 24 hours"],
    a: 1,
    r: "Exercise stress echocardiography is the appropriate next step for a patient with exertional symptoms and resting ECG changes suggestive of ischemia but negative troponin. It evaluates for inducible ischemia and wall motion abnormalities under stress. Coronary CT angiography assesses anatomy but does not provide functional data. Chest radiograph is non-specific for coronary disease. Repeating troponin alone does not address the diagnostic workup for stable angina.",
    s: "Cardiovascular"
  },
  {
    q: "An NP reviews a 12-lead ECG showing a prolonged PR interval of 280 ms with consistent P-to-QRS conduction. The patient is asymptomatic with a heart rate of 56 bpm. What is the most appropriate management?",
    o: ["Immediate cardiology referral for pacemaker evaluation", "Observation with periodic ECG monitoring", "Initiation of atropine 0.5 mg IV", "Discontinuation of all current medications"],
    a: 1,
    r: "First-degree AV block (prolonged PR interval greater than 200 ms with consistent conduction) in an asymptomatic patient is a benign finding. Periodic monitoring is appropriate. Pacemaker insertion is not indicated for asymptomatic first-degree AV block. Atropine is reserved for symptomatic bradycardia. Discontinuing all medications is not warranted without evidence of a causative drug.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old female with a history of hypertension presents with palpitations. ECG reveals an irregularly irregular rhythm with no discernible P waves and a ventricular rate of 142 bpm. Her CHA2DS2-VASc score is 4. Which initial management step is most appropriate?",
    o: ["Immediate synchronized cardioversion", "Initiation of rate control with metoprolol and anticoagulation with apixaban", "Administration of IV amiodarone for rhythm control", "Referral for catheter ablation"],
    a: 1,
    r: "This patient has atrial fibrillation with rapid ventricular response. With a CHA2DS2-VASc score of 4, she is at high stroke risk and requires anticoagulation. Rate control with a beta-blocker is first-line for stable patients. Cardioversion is reserved for hemodynamically unstable patients. IV amiodarone is not first-line for rate control. Catheter ablation is considered after failed pharmacologic management.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old male presents with syncope. ECG shows a QTc interval of 520 ms. Family history includes sudden cardiac death in a sibling at age 30. Which action should the NP take first?",
    o: ["Prescribe a beta-blocker and refer to cardiology urgently", "Order an exercise stress test", "Initiate amiodarone therapy", "Reassure the patient and schedule routine follow-up"],
    a: 0,
    r: "Prolonged QTc interval (greater than 500 ms) with syncope and a family history of sudden cardiac death raises concern for long QT syndrome, which carries a risk of torsades de pointes and sudden death. Beta-blockers reduce the risk of arrhythmic events, and urgent cardiology referral for genetic testing and potential ICD evaluation is indicated. Exercise stress testing may provoke arrhythmias and is not the first step. Amiodarone can further prolong the QT interval. Reassurance is inappropriate given the risk profile.",
    s: "Cardiovascular"
  },
  {
    q: "An NP evaluates a 65-year-old patient with chronic stable heart failure. The most recent echocardiogram shows a left ventricular ejection fraction (LVEF) of 30%. Current medications include lisinopril, carvedilol, and furosemide. Which medication should be added to reduce mortality?",
    o: ["Spironolactone", "Amlodipine", "Digoxin", "Hydralazine"],
    a: 0,
    r: "For heart failure with reduced ejection fraction (HFrEF, LVEF 35% or less), guideline-directed medical therapy includes an ACE inhibitor or ARB, beta-blocker, and a mineralocorticoid receptor antagonist (spironolactone or eplerenone). Adding spironolactone has been shown to reduce mortality. Amlodipine does not improve mortality in HFrEF. Digoxin reduces hospitalizations but does not reduce mortality. Hydralazine combined with nitrates is an alternative if ACE inhibitors and ARBs are not tolerated.",
    s: "Cardiovascular"
  },
  {
    q: "A patient presents with acute-onset tearing chest pain radiating to the back. BP is 198/110 mmHg in the right arm and 162/88 mmHg in the left arm. ECG shows sinus tachycardia without ST changes. What is the most appropriate initial diagnostic study?",
    o: ["CT angiography of the chest", "Cardiac catheterization", "Transthoracic echocardiography", "D-dimer assay"],
    a: 0,
    r: "The presentation of tearing chest pain radiating to the back with a significant blood pressure differential between arms is classic for acute aortic dissection. CT angiography of the chest is the gold standard diagnostic study, providing rapid and definitive imaging. Cardiac catheterization is indicated for coronary disease, not dissection. Echocardiography may show aortic root dilation but is not definitive. D-dimer may be elevated but is non-specific.",
    s: "Cardiovascular"
  },
  {
    q: "A 50-year-old patient has an ECG showing ST elevation in leads II, III, and aVF with reciprocal ST depression in leads I and aVL. Which coronary artery is most likely involved?",
    o: ["Right coronary artery", "Left anterior descending artery", "Left circumflex artery", "Left main coronary artery"],
    a: 0,
    r: "ST elevation in the inferior leads (II, III, aVF) with reciprocal changes in the lateral leads (I, aVL) is indicative of an inferior STEMI, most commonly caused by occlusion of the right coronary artery. The left anterior descending supplies the anterior wall. The left circumflex supplies the lateral wall. The left main supplies both the LAD and circumflex territories.",
    s: "Cardiovascular"
  },
  {
    q: "An NP is interpreting a Holter monitor report for a patient with unexplained syncope. The report shows intermittent Mobitz type II second-degree AV block with dropped QRS complexes. What is the recommended management?",
    o: ["Referral for permanent pacemaker implantation", "Initiation of atropine therapy", "Observation with repeat Holter in 3 months", "Trial of theophylline to increase heart rate"],
    a: 0,
    r: "Mobitz type II second-degree AV block is a structural conduction defect with a high risk of progression to complete heart block. Permanent pacemaker implantation is the standard of care, especially in a symptomatic patient with syncope. Atropine is a temporary measure for symptomatic bradycardia and does not address the underlying conduction disease. Observation risks sudden progression to complete heart block. Theophylline is not standard therapy for this condition.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old patient with a metallic prosthetic aortic valve presents for routine follow-up. The INR is 2.0. The target INR range for this patient is 2.5 to 3.5. What should the NP do?",
    o: ["Increase the warfarin dose and recheck INR in 5 to 7 days", "Continue the current warfarin dose", "Switch to apixaban for easier management", "Hold warfarin for 2 days then resume at a higher dose"],
    a: 0,
    r: "Patients with mechanical heart valves require anticoagulation with warfarin at a target INR of 2.5 to 3.5. An INR of 2.0 is subtherapeutic, increasing thromboembolic risk. The dose should be increased with INR rechecked in 5 to 7 days. Continuing the current dose leaves the patient at risk. Direct oral anticoagulants such as apixaban are contraindicated in mechanical valves. Holding warfarin would further lower the INR.",
    s: "Cardiovascular"
  },
  {
    q: "A patient with known hypertrophic cardiomyopathy (HCM) asks about exercise recommendations. Which activity should the NP advise the patient to avoid?",
    o: ["Competitive high-intensity sports such as basketball", "Low-intensity walking programs", "Supervised cardiac rehabilitation", "Gentle yoga and stretching"],
    a: 0,
    r: "Patients with hypertrophic cardiomyopathy are at increased risk of sudden cardiac death during high-intensity competitive sports due to dynamic left ventricular outflow tract obstruction and arrhythmias. Current guidelines recommend avoiding competitive high-intensity exercise. Low-intensity walking, supervised rehabilitation, and gentle yoga are generally considered safe with appropriate medical clearance.",
    s: "Cardiovascular"
  },

  // ===== PULMONARY FUNCTION & IMAGING (Questions 11-20) =====
  {
    q: "A 55-year-old patient with a 30-pack-year smoking history presents with progressive dyspnea. Spirometry shows FEV1/FVC ratio of 0.58 and FEV1 of 52% predicted post-bronchodilator. How should the NP classify this COPD?",
    o: ["GOLD Stage III - Severe", "GOLD Stage II - Moderate", "GOLD Stage I - Mild", "GOLD Stage IV - Very Severe"],
    a: 1,
    r: "COPD severity is classified by post-bronchodilator FEV1. GOLD Stage II (Moderate) corresponds to FEV1 50% to less than 80% predicted. An FEV1 of 52% falls within this range. Stage I is FEV1 80% or greater. Stage III is FEV1 30% to less than 50%. Stage IV is FEV1 less than 30% or less than 50% with chronic respiratory failure.",
    s: "Respiratory"
  },
  {
    q: "A 40-year-old non-smoking female presents with episodic wheezing and chest tightness. Baseline spirometry is normal. Which test should the NP order to confirm the diagnosis of asthma?",
    o: ["Methacholine challenge test", "High-resolution CT of the chest", "Arterial blood gas analysis", "Peak expiratory flow rate at rest"],
    a: 0,
    r: "When baseline spirometry is normal in a patient with suspected asthma, a bronchial provocation test such as methacholine challenge can demonstrate airway hyperresponsiveness. A positive test (20% decline in FEV1 at a threshold concentration) supports the diagnosis. CT chest evaluates parenchymal disease but does not diagnose asthma. ABG is non-specific. A single peak flow measurement at rest does not assess variability or hyperresponsiveness.",
    s: "Respiratory"
  },
  {
    q: "A chest radiograph of a 62-year-old male with chronic cough shows a solitary pulmonary nodule measuring 12 mm in the right upper lobe. The patient has a 40-pack-year smoking history. What is the most appropriate next step?",
    o: ["Order a CT-guided biopsy or PET-CT scan", "Repeat chest radiograph in 12 months", "Reassure the patient and schedule annual follow-up", "Initiate empiric antibiotics for possible pneumonia"],
    a: 0,
    r: "A solitary pulmonary nodule greater than 8 mm in a high-risk patient (heavy smoker, older age) has a significant probability of malignancy and requires further evaluation with PET-CT to assess metabolic activity or CT-guided biopsy for tissue diagnosis. Watchful waiting with repeat imaging at 12 months is appropriate for smaller, low-risk nodules. Reassurance is inappropriate given the risk factors. Empiric antibiotics are not indicated without clinical signs of infection.",
    s: "Respiratory"
  },
  {
    q: "An NP is interpreting pulmonary function tests for a patient with suspected interstitial lung disease. Which pattern is most consistent with a restrictive process?",
    o: ["Reduced FVC with normal or elevated FEV1/FVC ratio", "Reduced FEV1 with reduced FEV1/FVC ratio", "Normal FVC with reduced peak expiratory flow", "Increased residual volume with air trapping"],
    a: 0,
    r: "Restrictive lung disease is characterized by reduced lung volumes. The FVC is reduced while the FEV1/FVC ratio is preserved or increased because both FEV1 and FVC decrease proportionally. An obstructive pattern shows a disproportionately reduced FEV1 with a low FEV1/FVC ratio. Reduced peak flow with normal FVC is non-specific. Increased residual volume with air trapping is characteristic of obstructive disease.",
    s: "Respiratory"
  },
  {
    q: "A 70-year-old patient presents with acute onset dyspnea and pleuritic chest pain. D-dimer is elevated at 1.2 mg/L. The Wells score for pulmonary embolism is 6 (PE likely). Which imaging study should the NP order?",
    o: ["CT pulmonary angiography", "Ventilation-perfusion scan", "Bilateral lower extremity venous duplex ultrasound", "Chest radiograph"],
    a: 0,
    r: "CT pulmonary angiography (CTPA) is the gold standard diagnostic imaging for pulmonary embolism and is the first-line test when PE is likely based on clinical probability scoring. A V/Q scan is an alternative when CTPA is contraindicated (contrast allergy, renal insufficiency). Lower extremity ultrasound can identify DVT but does not rule out PE. Chest radiograph findings in PE are often non-specific.",
    s: "Respiratory"
  },
  {
    q: "A patient with known COPD has an arterial blood gas showing pH 7.32, PaCO2 58 mmHg, HCO3 34 mmol/L, and PaO2 55 mmHg. How should the NP interpret this result?",
    o: ["Chronic respiratory acidosis with acute exacerbation", "Acute respiratory acidosis", "Compensated metabolic alkalosis", "Mixed respiratory and metabolic acidosis"],
    a: 0,
    r: "The elevated PaCO2 indicates respiratory acidosis. The elevated bicarbonate (34 mmol/L) reflects renal compensation, indicating chronicity. However, the pH remains acidotic (7.32) rather than fully compensated, suggesting an acute-on-chronic exacerbation. Pure acute respiratory acidosis would have normal bicarbonate. Metabolic alkalosis would show primary elevation of bicarbonate with compensatory rise in PaCO2. Mixed acidosis would show both low bicarbonate and elevated PaCO2.",
    s: "Respiratory"
  },
  {
    q: "A 35-year-old patient presents with recurrent episodes of pneumonia in the same lung segment. What is the most appropriate diagnostic study to investigate an underlying cause?",
    o: ["CT chest with contrast and bronchoscopy", "Serial sputum cultures", "Repeat chest radiograph in 6 weeks", "Pulmonary function tests"],
    a: 0,
    r: "Recurrent pneumonia in the same anatomic location suggests an obstructing lesion such as a tumor, foreign body, or bronchial stenosis. CT chest with contrast provides detailed anatomic imaging, and bronchoscopy allows direct visualization and biopsy of any obstructing lesion. Serial sputum cultures identify organisms but not the cause of recurrence. Repeat radiograph delays diagnosis. PFTs assess function but do not identify focal pathology.",
    s: "Respiratory"
  },
  {
    q: "An NP is managing a patient with newly diagnosed obstructive sleep apnea (OSA) confirmed by polysomnography showing an apnea-hypopnea index (AHI) of 22 events per hour. What is the first-line treatment?",
    o: ["Continuous positive airway pressure (CPAP) therapy", "Oral appliance therapy", "Uvulopalatopharyngoplasty (UPPP)", "Positional therapy with sleep positioning device"],
    a: 0,
    r: "CPAP is the gold standard first-line treatment for moderate to severe obstructive sleep apnea (AHI 15 or greater). An AHI of 22 classifies as moderate OSA. CPAP maintains airway patency during sleep, reducing apneic events and improving oxygenation. Oral appliances are alternatives for mild OSA or CPAP-intolerant patients. UPPP is a surgical option for select patients who fail conservative therapy. Positional therapy alone is insufficient for moderate to severe OSA.",
    s: "Respiratory"
  },
  {
    q: "A patient with suspected sarcoidosis presents with bilateral hilar lymphadenopathy on chest radiograph. Which laboratory finding is most supportive of the diagnosis?",
    o: ["Elevated serum angiotensin-converting enzyme (ACE) level", "Elevated erythrocyte sedimentation rate (ESR)", "Positive antinuclear antibody (ANA)", "Elevated serum lactate dehydrogenase (LDH)"],
    a: 0,
    r: "Elevated serum ACE level is found in approximately 60% of patients with active sarcoidosis and supports the diagnosis in the appropriate clinical context. While not specific enough to be diagnostic alone, it is the most supportive laboratory finding listed. ESR is a non-specific inflammatory marker. ANA positivity suggests autoimmune conditions. Elevated LDH is non-specific and associated with many conditions including lymphoma and hemolysis.",
    s: "Respiratory"
  },
  {
    q: "A 48-year-old patient presents with progressive exertional dyspnea. CT chest reveals ground-glass opacities with a peripheral and basilar distribution. Pulmonary function tests show a restrictive pattern with reduced DLCO. What is the most likely diagnosis?",
    o: ["Idiopathic pulmonary fibrosis", "Chronic obstructive pulmonary disease", "Pulmonary arterial hypertension", "Chronic pulmonary embolism"],
    a: 0,
    r: "The combination of progressive dyspnea, ground-glass opacities with peripheral and basilar distribution on CT, restrictive spirometry, and reduced diffusing capacity (DLCO) is classic for idiopathic pulmonary fibrosis (IPF). COPD shows obstructive physiology. Pulmonary arterial hypertension may cause dyspnea but does not typically show ground-glass opacities in this distribution. Chronic PE shows vascular abnormalities rather than diffuse parenchymal disease.",
    s: "Respiratory"
  },

  // ===== HEMATOLOGY/ONCOLOGY MANAGEMENT (Questions 21-30) =====
  {
    q: "A 68-year-old male presents with fatigue, unintentional weight loss, and a hemoglobin of 92 g/L. Peripheral blood smear shows rouleaux formation. Serum protein electrophoresis reveals an M-spike. Which diagnostic test should the NP order to confirm the suspected diagnosis?",
    o: ["Bone marrow biopsy with cytogenetics", "CT scan of the abdomen", "Iron studies panel", "Reticulocyte count"],
    a: 0,
    r: "The presentation of anemia, weight loss, rouleaux formation, and a monoclonal M-spike on serum protein electrophoresis is highly suggestive of multiple myeloma. Bone marrow biopsy with cytogenetics is essential to confirm the diagnosis by demonstrating clonal plasma cells and assessing prognosis. CT abdomen does not evaluate bone marrow. Iron studies may show anemia of chronic disease but do not confirm myeloma. Reticulocyte count assesses marrow response but is not diagnostic.",
    s: "Hematology"
  },
  {
    q: "A patient receiving chemotherapy presents with a temperature of 38.5 degrees Celsius and an absolute neutrophil count (ANC) of 0.4 x 10^9/L. What is the priority action?",
    o: ["Obtain blood cultures and initiate broad-spectrum IV antibiotics immediately", "Administer acetaminophen and recheck temperature in 4 hours", "Hold chemotherapy and schedule outpatient follow-up", "Order a chest radiograph and urinalysis before initiating treatment"],
    a: 0,
    r: "Febrile neutropenia (temperature 38.3 degrees Celsius or higher with ANC less than 0.5 x 10^9/L) is an oncologic emergency. Blood cultures should be obtained and empiric broad-spectrum antibiotics initiated within 60 minutes. Delaying antibiotics to obtain imaging increases mortality. Acetaminophen alone does not address the underlying infection risk. Outpatient management may be considered only for low-risk patients meeting specific criteria.",
    s: "Hematology"
  },
  {
    q: "An NP is evaluating a 45-year-old female with a platelet count of 28 x 10^9/L, petechiae, and mucosal bleeding. CBC shows normal WBC and hemoglobin. Peripheral smear shows large platelets with no schistocytes. What is the most likely diagnosis?",
    o: ["Immune thrombocytopenic purpura (ITP)", "Thrombotic thrombocytopenic purpura (TTP)", "Disseminated intravascular coagulation (DIC)", "Aplastic anemia"],
    a: 0,
    r: "Isolated thrombocytopenia with large platelets on smear, normal WBC and hemoglobin, and absence of schistocytes is characteristic of immune thrombocytopenic purpura (ITP). TTP would present with schistocytes (microangiopathic hemolytic anemia) and often neurological symptoms. DIC shows schistocytes with coagulopathy. Aplastic anemia affects all cell lines (pancytopenia), not just platelets.",
    s: "Hematology"
  },
  {
    q: "A patient with newly diagnosed chronic myeloid leukemia (CML) has a positive Philadelphia chromosome. The NP anticipates initiation of which medication class?",
    o: ["Tyrosine kinase inhibitor (imatinib)", "Alkylating agent (cyclophosphamide)", "Monoclonal antibody (rituximab)", "Antimetabolite (methotrexate)"],
    a: 0,
    r: "The Philadelphia chromosome results in the BCR-ABL fusion gene, producing an abnormal tyrosine kinase. Imatinib (a tyrosine kinase inhibitor) specifically targets this protein and is the standard first-line therapy for CML. Cyclophosphamide is used for various malignancies but is not first-line for CML. Rituximab targets CD20 on B cells. Methotrexate is used in various cancers but does not target the specific CML mechanism.",
    s: "Hematology"
  },
  {
    q: "A 30-year-old female presents with fatigue and laboratory results showing hemoglobin 98 g/L, MCV 68 fL, ferritin 8 mcg/L, and TIBC 450 mcg/dL. Which treatment should the NP prescribe?",
    o: ["Oral ferrous sulfate 325 mg daily with vitamin C", "Intramuscular vitamin B12 injection", "Folic acid 1 mg daily", "Erythropoietin-stimulating agent"],
    a: 0,
    r: "The laboratory findings of microcytic anemia (low MCV), low ferritin, and elevated TIBC are diagnostic of iron deficiency anemia. Oral iron supplementation with ferrous sulfate is first-line therapy. Vitamin C enhances iron absorption. B12 deficiency causes macrocytic anemia with high MCV. Folic acid deficiency also causes macrocytic anemia. Erythropoietin-stimulating agents are used in anemia of chronic kidney disease, not iron deficiency.",
    s: "Hematology"
  },
  {
    q: "An NP is monitoring a patient on warfarin therapy who develops an INR of 8.5 without active bleeding. What is the appropriate management?",
    o: ["Hold warfarin and administer oral vitamin K 2.5 to 5 mg", "Administer fresh frozen plasma immediately", "Continue warfarin at a reduced dose", "Administer IV vitamin K 10 mg and prothrombin complex concentrate"],
    a: 0,
    r: "An INR of 8.5 without active bleeding is a supratherapeutic level with high bleeding risk. Management includes holding warfarin and administering oral vitamin K (2.5 to 5 mg) to gradually lower the INR. Fresh frozen plasma is reserved for active bleeding or urgent reversal. Continuing warfarin at any dose is inappropriate with this INR. IV vitamin K with prothrombin complex concentrate is for life-threatening bleeding.",
    s: "Hematology"
  },
  {
    q: "A 55-year-old patient presents with painless cervical lymphadenopathy, night sweats, and unintentional weight loss of 8 kg over 3 months. CBC shows normal values. What is the most important next diagnostic step?",
    o: ["Excisional lymph node biopsy", "Fine needle aspiration of the lymph node", "CT scan of the chest, abdomen, and pelvis", "Monospot test for infectious mononucleosis"],
    a: 0,
    r: "Painless lymphadenopathy with B symptoms (night sweats, weight loss greater than 10% of body weight) raises strong suspicion for lymphoma. Excisional lymph node biopsy is the gold standard as it preserves tissue architecture needed for accurate histologic classification and subtyping. Fine needle aspiration may be insufficient for lymphoma diagnosis. CT staging is important but follows tissue diagnosis. Monospot testing is appropriate for younger patients with acute symptoms suggestive of EBV.",
    s: "Hematology"
  },
  {
    q: "A patient is being evaluated for a suspected hemolytic anemia. Which laboratory finding is most consistent with intravascular hemolysis?",
    o: ["Elevated serum LDH, low haptoglobin, and positive urine hemosiderin", "Elevated ferritin with normal reticulocyte count", "Low MCV with elevated RDW", "Elevated serum iron with low TIBC"],
    a: 0,
    r: "Intravascular hemolysis releases free hemoglobin into the plasma, which binds haptoglobin (causing low haptoglobin), elevates LDH from red cell destruction, and leads to hemoglobin filtration in the kidneys producing positive urine hemosiderin. Elevated ferritin with normal reticulocytes does not suggest hemolysis. Low MCV with elevated RDW suggests iron deficiency. Elevated iron with low TIBC suggests iron overload or chronic disease.",
    s: "Hematology"
  },
  {
    q: "An NP is managing a 62-year-old patient with polycythemia vera. The patient's hematocrit is 0.56. What is the primary treatment goal?",
    o: ["Reduce hematocrit to below 0.45 through phlebotomy", "Initiate hydroxyurea to suppress all cell lines", "Prescribe aspirin 325 mg daily for thrombosis prevention", "Refer for immediate bone marrow transplant"],
    a: 0,
    r: "The primary treatment goal in polycythemia vera is to reduce the hematocrit below 0.45 to decrease the risk of thrombotic events. Phlebotomy is the first-line treatment for achieving this target. Hydroxyurea is added for high-risk patients or those who do not tolerate phlebotomy, but the initial intervention is phlebotomy. Low-dose aspirin (81 mg) is recommended, but 325 mg increases bleeding risk. Bone marrow transplant is reserved for advanced or transformed disease.",
    s: "Hematology"
  },
  {
    q: "A 70-year-old patient with a history of breast cancer treated 5 years ago presents with new back pain and an elevated alkaline phosphatase. Plain radiograph of the spine shows lytic lesions in L2 and L4. What should the NP order next?",
    o: ["Bone scan and oncology referral for evaluation of metastatic disease", "MRI of the lumbar spine only", "Vitamin D and calcium supplementation", "Physical therapy referral for back pain management"],
    a: 0,
    r: "Lytic bone lesions in a patient with a history of breast cancer are highly suspicious for metastatic disease. A bone scan evaluates the extent of skeletal involvement, and urgent oncology referral is required for staging and treatment planning. MRI of the lumbar spine alone does not assess the full skeletal extent. Vitamin D and calcium supplementation does not address the underlying malignancy. Physical therapy alone is inappropriate when metastatic disease is suspected.",
    s: "Hematology"
  },

  // ===== MUSCULOSKELETAL & RHEUMATOLOGY (Questions 31-40) =====
  {
    q: "A 35-year-old female presents with bilateral symmetric joint pain and morning stiffness lasting 90 minutes, affecting the MCP and PIP joints. Labs show positive anti-CCP antibodies and elevated ESR. Which diagnosis is most likely?",
    o: ["Rheumatoid arthritis", "Osteoarthritis", "Systemic lupus erythematosus", "Gout"],
    a: 0,
    r: "Bilateral symmetric polyarthritis affecting small joints (MCP, PIP) with prolonged morning stiffness, positive anti-CCP antibodies, and elevated inflammatory markers is classic for rheumatoid arthritis. Osteoarthritis typically affects DIP joints and has brief morning stiffness. SLE can cause joint pain but typically presents with multi-system involvement. Gout usually presents as acute monoarthritis, most commonly in the first MTP joint.",
    s: "Musculoskeletal"
  },
  {
    q: "An NP is initiating methotrexate for a patient with rheumatoid arthritis. Which baseline laboratory tests and supplementation should be ordered before starting therapy?",
    o: ["CBC, hepatic function panel, renal function, hepatitis B and C serology, and folic acid supplementation", "TSH, lipid panel, and iron supplementation", "Urinalysis, vitamin D level, and calcium supplementation", "Serum uric acid, synovial fluid analysis, and colchicine"],
    a: 0,
    r: "Methotrexate requires baseline assessment of hepatic function (hepatotoxicity risk), renal function (drug clearance), CBC (myelosuppression risk), and hepatitis B/C serology (risk of reactivation). Folic acid supplementation (1 mg daily) reduces side effects including mucositis, GI symptoms, and hepatotoxicity. TSH and lipids are not relevant to methotrexate monitoring. Uric acid and synovial fluid are for gout evaluation.",
    s: "Musculoskeletal"
  },
  {
    q: "A 50-year-old male presents with acute onset of severe pain, redness, and swelling of the first metatarsophalangeal joint. Synovial fluid analysis shows negatively birefringent needle-shaped crystals. What is the first-line treatment for this acute episode?",
    o: ["Colchicine or NSAID therapy", "Allopurinol initiation", "Intra-articular corticosteroid injection", "Probenecid therapy"],
    a: 0,
    r: "Acute gouty arthritis with monosodium urate crystals (negatively birefringent, needle-shaped) is treated with anti-inflammatory therapy. NSAIDs (indomethacin or naproxen) or colchicine within 36 hours of onset are first-line for acute flares. Allopurinol is a urate-lowering therapy for chronic management and should not be initiated during an acute flare as it can worsen symptoms. Intra-articular corticosteroid is an option if NSAIDs and colchicine are contraindicated. Probenecid is a uricosuric agent for chronic management.",
    s: "Musculoskeletal"
  },
  {
    q: "A 28-year-old male presents with low back pain and stiffness that worsens with rest and improves with exercise. Symptoms have persisted for more than 3 months. Physical examination reveals limited lumbar flexion. HLA-B27 is positive. What imaging should the NP order?",
    o: ["MRI of the sacroiliac joints", "CT scan of the lumbar spine", "Plain radiograph of the lumbar spine", "Bone density scan (DEXA)"],
    a: 0,
    r: "Inflammatory back pain (onset before age 40, insidious onset, improvement with exercise, worsening with rest, duration greater than 3 months) with positive HLA-B27 suggests ankylosing spondylitis. MRI of the sacroiliac joints is the preferred initial imaging modality as it can detect early sacroiliitis (bone marrow edema) before radiographic changes are visible. Plain radiographs may be normal in early disease. CT provides better bony detail but involves higher radiation. DEXA assesses bone density, not inflammation.",
    s: "Musculoskeletal"
  },
  {
    q: "An NP is evaluating a 65-year-old female with knee pain that worsens with activity and improves with rest. Physical examination reveals crepitus, bony enlargement, and limited range of motion. Radiograph shows joint space narrowing and osteophyte formation. What is the first-line pharmacologic treatment?",
    o: ["Topical NSAID or oral acetaminophen", "Oral prednisone taper", "Intra-articular hyaluronic acid injection", "Tramadol"],
    a: 0,
    r: "Osteoarthritis management follows a stepwise approach. First-line pharmacologic therapy includes topical NSAIDs (preferred for localized knee OA to minimize systemic effects) or oral acetaminophen. Oral corticosteroids are not recommended for OA management. Intra-articular hyaluronic acid has limited evidence and is not first-line. Tramadol and opioids are reserved for refractory cases due to side effects and dependence risk.",
    s: "Musculoskeletal"
  },
  {
    q: "A 42-year-old female presents with a butterfly-shaped facial rash, joint pain, oral ulcers, and fatigue. Labs show positive ANA at 1:640 and positive anti-dsDNA antibodies. Urinalysis reveals proteinuria. What is the priority concern?",
    o: ["Lupus nephritis requiring nephrology referral", "Discoid lupus requiring dermatology referral", "Drug-induced lupus from medication history", "Fibromyalgia with secondary ANA positivity"],
    a: 0,
    r: "The classic presentation of malar rash, joint pain, oral ulcers with positive ANA and anti-dsDNA antibodies is consistent with systemic lupus erythematosus (SLE). The presence of proteinuria indicates renal involvement (lupus nephritis), which is a serious complication requiring urgent nephrology referral and possible renal biopsy. Discoid lupus is a cutaneous-only form without systemic manifestations. Drug-induced lupus typically shows anti-histone antibodies. Fibromyalgia does not present with these clinical and serological findings.",
    s: "Musculoskeletal"
  },
  {
    q: "A patient on long-term prednisone therapy (more than 3 months) for a chronic inflammatory condition asks about bone health. What should the NP recommend?",
    o: ["DEXA scan and initiation of calcium, vitamin D, and consider bisphosphonate therapy", "Calcium supplementation only", "Annual plain radiographs of the spine", "No intervention needed until symptoms develop"],
    a: 0,
    r: "Glucocorticoid-induced osteoporosis is a significant risk with chronic corticosteroid use. Guidelines recommend DEXA scanning to assess bone density, calcium (1000-1200 mg/day) and vitamin D (600-800 IU/day) supplementation, and consideration of bisphosphonate therapy (such as alendronate) for moderate to high fracture risk. Calcium alone is insufficient. Plain radiographs detect fractures but not early bone loss. Waiting for symptoms means waiting for fractures.",
    s: "Musculoskeletal"
  },
  {
    q: "A 60-year-old patient presents with shoulder pain and inability to actively abduct the arm past 60 degrees, though passive range of motion is full. Which diagnostic test should the NP order?",
    o: ["Ultrasound or MRI of the shoulder", "Plain radiograph of the shoulder only", "Nerve conduction studies", "Bone scan"],
    a: 0,
    r: "Active range of motion limitation with preserved passive range of motion suggests a rotator cuff pathology (tear or tendinopathy). Ultrasound or MRI of the shoulder are the preferred imaging modalities to evaluate the rotator cuff tendons, with MRI being more comprehensive. Plain radiographs may show calcification or bony changes but cannot visualize soft tissue tears. Nerve conduction studies evaluate neurological causes. Bone scan evaluates for occult fractures or metastatic disease.",
    s: "Musculoskeletal"
  },
  {
    q: "An NP suspects polymyalgia rheumatica in a 72-year-old patient with bilateral shoulder and hip girdle stiffness, elevated ESR of 65 mm/hr, and elevated CRP. What is the recommended initial treatment?",
    o: ["Low-dose prednisone (12.5 to 25 mg daily)", "Methotrexate as a steroid-sparing agent", "High-dose pulse methylprednisolone IV", "Ibuprofen 800 mg three times daily"],
    a: 0,
    r: "Polymyalgia rheumatica (PMR) is characterized by bilateral shoulder and hip girdle pain and stiffness in patients older than 50 with elevated inflammatory markers. Low-dose prednisone (12.5 to 25 mg daily) is the standard initial treatment, and dramatic improvement within 24 to 72 hours is characteristic and supports the diagnosis. Methotrexate may be used as a steroid-sparing agent if relapse occurs but is not first-line. High-dose IV steroids are for giant cell arteritis with visual symptoms. NSAIDs alone are typically insufficient for PMR.",
    s: "Musculoskeletal"
  },
  {
    q: "A patient with fibromyalgia asks about pharmacologic treatment options. Which medication is first-line for fibromyalgia management?",
    o: ["Duloxetine or pregabalin", "Oxycodone extended-release", "Prednisone taper", "Methotrexate"],
    a: 0,
    r: "First-line pharmacologic therapies for fibromyalgia include duloxetine (SNRI), pregabalin (alpha-2-delta ligand), and milnacipran (SNRI). These medications modulate central pain processing. Opioids are not recommended for fibromyalgia due to lack of efficacy and risk of dependence. Corticosteroids are not effective as fibromyalgia is not an inflammatory condition. Methotrexate is for autoimmune inflammatory conditions, not fibromyalgia.",
    s: "Musculoskeletal"
  },

  // ===== PEDIATRIC PRIMARY CARE (Questions 41-50) =====
  {
    q: "A 6-month-old infant is brought in for a well-child visit. The parent reports the infant is exclusively breastfed. Which supplementation should the NP recommend?",
    o: ["Vitamin D 400 IU daily", "Iron supplementation 10 mg daily", "Fluoride supplementation 0.25 mg daily", "Vitamin C 50 mg daily"],
    a: 0,
    r: "The Canadian Paediatric Society and AAP recommend vitamin D supplementation of 400 IU daily for all breastfed infants from birth, as breast milk does not contain adequate vitamin D to prevent rickets. Iron supplementation is recommended starting at 4 to 6 months if the infant is not receiving iron-fortified foods. Fluoride is recommended after 6 months of age if the water supply is deficient. Vitamin C supplementation is not routinely recommended for infants.",
    s: "Pediatrics"
  },
  {
    q: "A 4-year-old child presents with a barking cough, inspiratory stridor, and mild intercostal retractions. There is no drooling, and the child is able to drink fluids. What is the most appropriate initial treatment?",
    o: ["Single dose of oral dexamethasone 0.6 mg/kg", "IV antibiotics for suspected epiglottitis", "Nebulized albuterol treatments", "Immediate intubation"],
    a: 0,
    r: "The presentation of barking cough, inspiratory stridor, and retractions without drooling or toxicity is consistent with moderate croup (laryngotracheobronchitis). A single dose of oral dexamethasone (0.6 mg/kg) is the standard treatment, reducing airway edema and the need for further interventions. Epiglottitis typically presents with drooling, dysphagia, and toxic appearance. Albuterol targets lower airway bronchospasm, not upper airway edema. Intubation is reserved for severe respiratory failure.",
    s: "Pediatrics"
  },
  {
    q: "An NP is reviewing the immunization schedule for a healthy 12-month-old. Which vaccines should be administered at this visit?",
    o: ["MMR, varicella, pneumococcal conjugate (PCV13), and hepatitis A (first dose)", "DTaP, IPV, and Hib booster only", "Meningococcal conjugate and HPV vaccines", "No vaccines are due at 12 months"],
    a: 0,
    r: "At the 12-month visit, the recommended immunizations include MMR (first dose), varicella (first dose), pneumococcal conjugate (PCV13, booster dose), and hepatitis A (first of two doses). DTaP, IPV, and Hib have doses at various ages but the specific combination at 12 months follows the schedule above. Meningococcal conjugate is typically given at 11-12 years. HPV vaccine begins at 9-14 years of age.",
    s: "Pediatrics"
  },
  {
    q: "A 3-year-old child presents with a 3-day history of high fever followed by the sudden appearance of a diffuse pink macular rash as the fever resolves. The child appears well. What is the most likely diagnosis?",
    o: ["Roseola infantum (HHV-6)", "Measles", "Scarlet fever", "Kawasaki disease"],
    a: 0,
    r: "Roseola infantum (caused by human herpesvirus 6) classically presents with 3 to 5 days of high fever followed by the appearance of a diffuse macular or maculopapular rash as the fever subsides. The child appears well once the rash appears. Measles presents with the triad of cough, coryza, conjunctivitis, and Koplik spots with rash during fever. Scarlet fever shows a sandpaper-like rash with concurrent fever and pharyngitis. Kawasaki disease presents with persistent fever for 5 or more days with specific diagnostic criteria.",
    s: "Pediatrics"
  },
  {
    q: "A parent brings a 2-year-old for developmental screening. The child does not use any words, does not point to objects of interest, and does not make eye contact. Which referral should the NP prioritize?",
    o: ["Developmental pediatrics and audiology for autism spectrum disorder evaluation", "Speech-language pathology only", "Ophthalmology for vision assessment", "Reassurance with follow-up at 3 years"],
    a: 0,
    r: "By 2 years of age, a child should use at least 50 words and begin combining words. Absence of words, lack of pointing (joint attention), and poor eye contact are red flags for autism spectrum disorder (ASD). Referral to developmental pediatrics for comprehensive ASD evaluation and audiology to rule out hearing loss is the priority. Speech therapy alone does not address the broader developmental concerns. Ophthalmology does not address the core concerns. Delaying evaluation risks missing the critical early intervention window.",
    s: "Pediatrics"
  },
  {
    q: "A 7-year-old presents with a 2-week history of periorbital edema, dark urine, and decreased urine output. Blood pressure is 142/92 mmHg. Urinalysis shows RBC casts and proteinuria. The parent reports the child had a sore throat 2 weeks prior. What is the most likely diagnosis?",
    o: ["Post-streptococcal glomerulonephritis", "Nephrotic syndrome", "Urinary tract infection", "Henoch-Schonlein purpura nephritis"],
    a: 0,
    r: "The triad of edema, hypertension, and hematuria (with RBC casts) following a streptococcal pharyngitis 1 to 3 weeks prior is classic for post-streptococcal glomerulonephritis (PSGN). Nephrotic syndrome presents with massive proteinuria, hypoalbuminemia, and edema but typically without RBC casts or hypertension. UTI presents with dysuria and bacteriuria. HSP nephritis follows the characteristic purpuric rash and may cause nephritis but lacks the temporal association with streptococcal infection.",
    s: "Pediatrics"
  },
  {
    q: "An NP is assessing a newborn at the 2-week well-baby visit. The infant has not regained birth weight, the mother reports difficulty with latch, and the infant has fewer than 4 wet diapers per day. What is the priority action?",
    o: ["Perform a comprehensive feeding assessment and evaluate for tongue-tie, and refer to lactation consultant", "Switch the infant to formula feeding immediately", "Reassure the mother that weight will normalize by 1 month", "Order a metabolic screening panel"],
    a: 0,
    r: "Failure to regain birth weight by 2 weeks, poor latch, and decreased urine output indicate inadequate feeding and possible dehydration. A comprehensive feeding assessment including evaluation for anatomical causes (tongue-tie) and referral to a lactation consultant is the priority to support breastfeeding. Switching to formula without assessment may undermine breastfeeding goals. Reassurance is inappropriate given the concerning findings. Metabolic screening may be warranted later but does not address the immediate feeding issue.",
    s: "Pediatrics"
  },
  {
    q: "A 10-year-old child presents with a BMI at the 97th percentile. Acanthosis nigricans is noted on the neck. Fasting glucose is 6.8 mmol/L. Which additional test should the NP order?",
    o: ["Hemoglobin A1C and fasting lipid panel", "Thyroid function tests only", "Random urine cortisol", "Growth hormone level"],
    a: 0,
    r: "Obesity (BMI at or above the 95th percentile) with acanthosis nigricans (a marker of insulin resistance) and elevated fasting glucose (6.8 mmol/L, above the normal upper limit of 5.5 mmol/L) raises concern for type 2 diabetes or prediabetes. HbA1C confirms glycemic status, and a fasting lipid panel screens for metabolic syndrome. Thyroid testing may be reasonable but does not address the immediate concern. Urine cortisol screens for Cushing syndrome, which is rare. Growth hormone is not indicated in this presentation.",
    s: "Pediatrics"
  },
  {
    q: "A 5-year-old child has recurrent episodes of wheezing triggered by exercise and viral infections, occurring more than 2 days per week but not daily. Nighttime symptoms occur 3 to 4 times per month. How should the NP classify this asthma?",
    o: ["Mild persistent asthma", "Intermittent asthma", "Moderate persistent asthma", "Severe persistent asthma"],
    a: 0,
    r: "Asthma classification in children: symptoms more than 2 days per week but not daily, with nighttime awakenings 3 to 4 times per month, corresponds to mild persistent asthma. Intermittent asthma involves symptoms 2 days per week or less and nighttime symptoms 2 times per month or less. Moderate persistent involves daily symptoms or nighttime symptoms more than once per week. Severe persistent involves continuous symptoms with frequent nighttime awakenings.",
    s: "Pediatrics"
  },
  {
    q: "A parent asks when their child should first visit a dentist. The child is 11 months old with two erupted lower central incisors. What should the NP recommend?",
    o: ["Schedule a dental visit by age 1 year or within 6 months of first tooth eruption", "Wait until the child has a full set of primary teeth around age 3", "Visit the dentist when the child can cooperate with an examination at age 4 to 5", "No dental visit needed until permanent teeth begin erupting at age 6"],
    a: 0,
    r: "The Canadian Dental Association and AAPD recommend the first dental visit by age 1 year or within 6 months of the eruption of the first tooth. Early dental visits establish a dental home, assess risk for caries, provide anticipatory guidance on oral hygiene, and allow for early intervention. Delaying dental care until age 3, 4-5, or 6 misses opportunities for early caries prevention and detection.",
    s: "Pediatrics"
  },

  // ===== GERIATRIC ASSESSMENT & POLYPHARMACY (Questions 51-60) =====
  {
    q: "An NP is performing a comprehensive geriatric assessment on an 82-year-old patient taking 12 medications. Which validated tool should be used to assess for potentially inappropriate medications?",
    o: ["Beers Criteria", "Braden Scale", "Norton Scale", "Morse Fall Scale"],
    a: 0,
    r: "The Beers Criteria (American Geriatrics Society) is the standard tool for identifying potentially inappropriate medications (PIMs) in older adults. It lists medications that should be avoided or used with caution due to age-related changes in pharmacokinetics and increased sensitivity. The Braden Scale assesses pressure injury risk. The Norton Scale also assesses pressure ulcer risk. The Morse Fall Scale assesses fall risk.",
    s: "Geriatrics"
  },
  {
    q: "A 78-year-old patient presents with a fall at home. Current medications include metoprolol, furosemide, diazepam, tamsulosin, and oxybutynin. Which medication combination most significantly contributes to fall risk?",
    o: ["Diazepam and tamsulosin", "Metoprolol and furosemide", "Oxybutynin and metoprolol", "Furosemide and oxybutynin"],
    a: 0,
    r: "Diazepam (a long-acting benzodiazepine) causes sedation, impaired balance, and cognitive effects, and is listed on the Beers Criteria as a high-risk medication for falls in older adults. Tamsulosin (an alpha-blocker) causes orthostatic hypotension. This combination has the highest synergistic fall risk. While furosemide causes volume depletion and oxybutynin causes anticholinergic effects (dizziness, confusion), the combination of a benzodiazepine with an alpha-blocker is most significantly associated with falls.",
    s: "Geriatrics"
  },
  {
    q: "An 85-year-old patient with mild cognitive impairment scores 22/30 on the Montreal Cognitive Assessment (MoCA). The patient's daughter asks about driving safety. What should the NP recommend?",
    o: ["Formal driving assessment through an occupational therapist or driving rehabilitation specialist", "Immediate cessation of driving privileges", "No restrictions as the patient has only mild impairment", "Family members should accompany the patient while driving"],
    a: 0,
    r: "A MoCA score of 22/30 indicates mild cognitive impairment, which may or may not affect driving ability. Rather than making assumptions, a formal driving assessment by a qualified professional (occupational therapist or driving rehabilitation specialist) objectively evaluates the patient's functional driving capacity. Immediate cessation may be premature without assessment. Ignoring cognitive changes is unsafe. Family accompaniment does not constitute a valid safety assessment.",
    s: "Geriatrics"
  },
  {
    q: "An NP is deprescribing medications for a 90-year-old patient in long-term care with advanced dementia and a life expectancy of less than 6 months. Which medication is most appropriate to discontinue?",
    o: ["Atorvastatin for primary cardiovascular prevention", "Levothyroxine for hypothyroidism", "Acetaminophen for chronic pain management", "Low-dose aspirin for secondary stroke prevention"],
    a: 0,
    r: "In patients with advanced dementia and limited life expectancy, medications prescribed for primary prevention (such as statins) are unlikely to provide benefit within the remaining lifespan and may contribute to pill burden, side effects, and reduced quality of life. Deprescribing statins in this context is appropriate and supported by evidence. Levothyroxine is necessary for thyroid replacement. Acetaminophen manages comfort. Aspirin for secondary prevention may still be beneficial but is a lower priority for discontinuation.",
    s: "Geriatrics"
  },
  {
    q: "A 75-year-old patient on multiple medications presents with confusion, dry mouth, constipation, urinary retention, and blurred vision. Which medication class is most likely responsible?",
    o: ["Anticholinergic medications", "Beta-blockers", "ACE inhibitors", "Thiazide diuretics"],
    a: 0,
    r: "The constellation of confusion, dry mouth, constipation, urinary retention, and blurred vision represents the classic anticholinergic toxidrome. Common offending medications in older adults include diphenhydramine, oxybutynin, tricyclic antidepressants, and first-generation antihistamines. The anticholinergic burden is cumulative when multiple medications with anticholinergic properties are combined. Beta-blockers cause bradycardia and fatigue. ACE inhibitors cause cough and hyperkalemia. Thiazide diuretics cause electrolyte imbalances.",
    s: "Geriatrics"
  },
  {
    q: "An NP is evaluating an 80-year-old patient for osteoporosis. DEXA scan shows a T-score of -2.8 at the femoral neck. The patient has no prior fracture history. What is the recommended treatment?",
    o: ["Bisphosphonate therapy (alendronate) with calcium and vitamin D supplementation", "Calcium and vitamin D supplementation alone", "Raloxifene as first-line therapy", "No treatment until a fracture occurs"],
    a: 0,
    r: "A T-score of -2.5 or lower at the femoral neck or lumbar spine confirms osteoporosis. Bisphosphonate therapy (alendronate, risedronate, or zoledronic acid) is first-line pharmacologic treatment to reduce fracture risk, along with adequate calcium (1200 mg/day) and vitamin D (800-1000 IU/day). Calcium and vitamin D alone are insufficient for osteoporosis treatment. Raloxifene is an alternative but not first-line. Waiting for a fracture exposes the patient to preventable morbidity.",
    s: "Geriatrics"
  },
  {
    q: "A 77-year-old patient with a history of falls has a blood pressure of 148/82 mmHg while sitting and 120/68 mmHg upon standing. The patient reports dizziness with position changes. What adjustment should the NP consider?",
    o: ["Reduce or adjust antihypertensive medications and reassess orthostatic symptoms", "Add midodrine for orthostatic hypotension", "Increase the antihypertensive medication dose to lower sitting blood pressure", "Prescribe fludrocortisone for volume expansion"],
    a: 0,
    r: "Orthostatic hypotension (drop of 20 mmHg or more in systolic BP upon standing) in an older adult on antihypertensives is a significant fall risk factor. The priority is to reduce or adjust antihypertensive medications, particularly those contributing to orthostatic symptoms. Adding midodrine or fludrocortisone without first addressing the iatrogenic cause is inappropriate. Increasing the antihypertensive dose would worsen orthostatic symptoms and fall risk.",
    s: "Geriatrics"
  },
  {
    q: "An 83-year-old patient in a long-term care facility has been prescribed a proton pump inhibitor (PPI) for 4 years without clear indication. Which risks should the NP consider when evaluating continued use?",
    o: ["Increased risk of Clostridioides difficile infection, fractures, and hypomagnesemia", "Increased risk of hyperkalemia and hepatotoxicity", "Increased risk of hypoglycemia and weight gain", "Increased risk of urinary retention and tachycardia"],
    a: 0,
    r: "Long-term PPI use in older adults is associated with increased risk of C. difficile infection (due to altered gastric pH and gut flora), osteoporotic fractures (reduced calcium absorption), hypomagnesemia, vitamin B12 deficiency, and community-acquired pneumonia. PPIs do not cause hyperkalemia, hepatotoxicity, hypoglycemia, weight gain, urinary retention, or tachycardia. Deprescribing PPIs when no longer indicated is an important aspect of geriatric care.",
    s: "Geriatrics"
  },
  {
    q: "An NP is screening a 79-year-old patient for frailty. Which assessment finding is most consistent with frailty syndrome?",
    o: ["Unintentional weight loss, self-reported exhaustion, low physical activity, slow walking speed, and weak grip strength", "Elevated BMI with preserved muscle mass", "Acute confusion with focal neurological deficits", "Nocturnal polyuria with urinary urgency"],
    a: 0,
    r: "The Fried Frailty Phenotype defines frailty as meeting 3 or more of 5 criteria: unintentional weight loss (more than 4.5 kg in the past year), self-reported exhaustion, low physical activity, slow walking speed, and weak grip strength. This phenotype predicts adverse outcomes including falls, disability, hospitalization, and mortality. Elevated BMI with preserved muscle is not frailty. Acute confusion with focal deficits suggests stroke. Nocturnal polyuria suggests a urologic condition.",
    s: "Geriatrics"
  },
  {
    q: "A 76-year-old patient newly prescribed amitriptyline 25 mg at bedtime for insomnia returns with worsened confusion and a fall. What should the NP do?",
    o: ["Discontinue amitriptyline and choose a non-anticholinergic alternative", "Increase amitriptyline to 50 mg for better sleep", "Add donepezil to counteract anticholinergic effects", "Continue amitriptyline and add a fall prevention program"],
    a: 0,
    r: "Amitriptyline is a tricyclic antidepressant with strong anticholinergic properties and is listed on the Beers Criteria as potentially inappropriate for older adults due to risks of sedation, confusion, orthostatic hypotension, and falls. The medication should be discontinued and replaced with a safer alternative for insomnia management (such as sleep hygiene, melatonin, or short-term low-dose trazodone if needed). Increasing the dose worsens side effects. Adding donepezil does not adequately counteract anticholinergic burden. Continuing the offending agent is inappropriate.",
    s: "Geriatrics"
  },

  // ===== PAIN MANAGEMENT & OPIOID PRESCRIBING (Questions 61-70) =====
  {
    q: "A patient with chronic non-cancer pain has been on morphine equivalent doses of 90 mg per day for 6 months with inadequate pain control. The NP wants to rotate to a different opioid. What is the recommended approach for equianalgesic dose conversion?",
    o: ["Calculate the equianalgesic dose of the new opioid and reduce by 25 to 50 percent for incomplete cross-tolerance", "Convert directly to the equianalgesic dose of the new opioid", "Double the equianalgesic dose to ensure adequate pain control", "Taper the current opioid to zero before starting the new opioid"],
    a: 0,
    r: "When rotating opioids, the equianalgesic dose of the new opioid should be calculated, then reduced by 25 to 50 percent to account for incomplete cross-tolerance between opioids. This prevents overdose while allowing dose titration based on response. Direct conversion without reduction risks overdose. Doubling the dose is dangerous. Complete discontinuation before starting a new opioid causes unnecessary pain and withdrawal symptoms.",
    s: "Pain Management"
  },
  {
    q: "An NP is prescribing opioids for a patient with chronic pain. According to Canadian prescribing guidelines, which concurrent prescription is essential to include?",
    o: ["Naloxone kit for opioid overdose reversal", "Benzodiazepine for anxiety management", "Gabapentin as a mandatory adjunct", "Muscle relaxant for improved pain control"],
    a: 0,
    r: "Canadian guidelines recommend prescribing or ensuring access to a naloxone kit for all patients receiving opioid therapy, especially those at risk for overdose. This harm reduction strategy can be life-saving in the event of accidental overdose. Concurrent benzodiazepine prescribing increases the risk of respiratory depression and death and should be avoided. Gabapentin may be useful as an adjunct but is not mandatory. Muscle relaxants add sedation risk.",
    s: "Pain Management"
  },
  {
    q: "A patient with chronic low back pain and no red flag symptoms has failed 6 weeks of conservative therapy including acetaminophen and physiotherapy. What is the most appropriate next pharmacologic step?",
    o: ["Trial of an NSAID or SNRI (duloxetine)", "Initiation of long-acting oxycodone", "Referral for epidural steroid injection", "Prescribe diazepam for muscle spasm"],
    a: 0,
    r: "For chronic low back pain that has not responded to first-line therapy (acetaminophen, exercise, physiotherapy), the next step includes NSAIDs (if not contraindicated) or an SNRI such as duloxetine, which has evidence for chronic musculoskeletal pain. Opioids should not be first-line for chronic non-cancer pain. Epidural injections may be considered for radiculopathy but are not the next step for non-specific back pain. Benzodiazepines add sedation and dependence risk without clear long-term benefit.",
    s: "Pain Management"
  },
  {
    q: "A patient on chronic opioid therapy presents with pinpoint pupils, respiratory rate of 8 breaths per minute, and decreased level of consciousness. What is the priority intervention?",
    o: ["Administer naloxone 0.4 mg IV/IM and monitor for response", "Position the patient supine and observe for 30 minutes", "Administer flumazenil 0.2 mg IV", "Obtain arterial blood gas before intervening"],
    a: 0,
    r: "The triad of pinpoint pupils (miosis), respiratory depression, and decreased consciousness is the classic opioid toxidrome. Naloxone (0.4 mg IV or IM) is the opioid antagonist and should be administered immediately with repeat dosing as needed. Observation without intervention risks respiratory arrest. Flumazenil reverses benzodiazepines, not opioids. Waiting for ABG results delays life-saving treatment.",
    s: "Pain Management"
  },
  {
    q: "An NP is evaluating a patient on long-term opioid therapy who reports needing increasing doses for the same level of pain relief without any new pathology. What does this phenomenon most likely represent?",
    o: ["Opioid tolerance", "Opioid addiction", "Pseudoaddiction", "Opioid-induced hyperalgesia"],
    a: 0,
    r: "Opioid tolerance is a pharmacologic phenomenon where repeated exposure to an opioid results in diminished analgesic effect, requiring higher doses for the same pain relief. It is a predictable physiologic response and not indicative of addiction. Addiction involves compulsive use despite harm and loss of control. Pseudoaddiction involves drug-seeking behavior driven by inadequate pain treatment. Opioid-induced hyperalgesia is increased pain sensitivity caused by the opioid itself, where more opioid paradoxically worsens pain.",
    s: "Pain Management"
  },
  {
    q: "A patient with neuropathic pain from diabetic peripheral neuropathy has tried gabapentin 1800 mg daily with minimal improvement. What is the most appropriate next-line therapy?",
    o: ["Pregabalin or duloxetine", "Morphine sustained-release", "Topical capsaicin only", "Carbamazepine"],
    a: 0,
    r: "For diabetic peripheral neuropathy refractory to gabapentin, guidelines recommend trial of pregabalin (another alpha-2-delta ligand with better bioavailability) or duloxetine (SNRI with evidence for neuropathic pain). These are first-line alternatives. Opioids are not first-line for neuropathic pain. Topical capsaicin may provide adjunctive relief but is not sufficient as monotherapy. Carbamazepine is first-line for trigeminal neuralgia but not for diabetic neuropathy.",
    s: "Pain Management"
  },
  {
    q: "An NP is developing a pain management agreement for a patient starting chronic opioid therapy. Which element is essential to include?",
    o: ["Random urine drug testing, single prescriber and pharmacy agreement, and clear discontinuation criteria", "Guaranteed medication refills regardless of compliance", "Freedom to obtain opioid prescriptions from multiple providers", "Unlimited dose escalation based on patient request"],
    a: 0,
    r: "A comprehensive opioid management agreement should include random urine drug testing for compliance monitoring, a single prescriber and single pharmacy requirement to prevent diversion, and clear criteria for discontinuation (such as aberrant behaviors or failure to meet treatment goals). Guaranteed refills, multiple prescribers, and unlimited dose escalation enable misuse and are contrary to safe prescribing practices.",
    s: "Pain Management"
  },
  {
    q: "A patient with cancer pain is on sustained-release morphine 60 mg every 12 hours. The patient reports breakthrough pain episodes 3 to 4 times daily. What is the appropriate breakthrough dose?",
    o: ["Immediate-release morphine 10 to 20 mg every 4 hours as needed", "Sustained-release morphine 30 mg as needed", "Immediate-release morphine 60 mg as needed", "Fentanyl patch 25 mcg/hr"],
    a: 0,
    r: "The breakthrough dose of an opioid is calculated as 10 to 15 percent of the total daily opioid dose. The total daily dose is 120 mg of morphine (60 mg twice daily). Ten to fifteen percent of 120 mg is 12 to 18 mg, so immediate-release morphine 10 to 20 mg every 4 hours as needed is appropriate. Sustained-release formulations should never be used for breakthrough pain. Sixty mg is 50 percent of the daily dose and risks overdose. A fentanyl patch is for baseline pain management, not breakthrough.",
    s: "Pain Management"
  },
  {
    q: "An NP is considering prescribing buprenorphine-naloxone for a patient with opioid use disorder. When should the first dose be administered?",
    o: ["When the patient is in mild to moderate opioid withdrawal (COWS score 8 to 12 or higher)", "Immediately after the last dose of the full agonist opioid", "When the patient is asymptomatic and comfortable", "Only after the patient has been opioid-free for 7 days"],
    a: 0,
    r: "Buprenorphine (a partial agonist) should be initiated when the patient is experiencing mild to moderate opioid withdrawal, typically assessed using the Clinical Opiate Withdrawal Scale (COWS) with a score of 8 to 12 or higher. Administering buprenorphine too early (while full agonist is still active) can precipitate severe withdrawal. Administering when comfortable or after only brief abstinence risks precipitated withdrawal. Waiting 7 days is unnecessarily long and causes suffering.",
    s: "Pain Management"
  },
  {
    q: "A post-surgical patient reports a pain level of 8/10. The NP wants to use a multimodal analgesia approach. Which combination best represents multimodal pain management?",
    o: ["Acetaminophen, an NSAID, a regional nerve block, and a low-dose opioid", "Morphine and hydromorphone given together", "Two different opioids administered at alternating intervals", "A single high-dose opioid with a benzodiazepine for anxiolysis"],
    a: 0,
    r: "Multimodal analgesia combines medications and techniques with different mechanisms of action to target pain pathways at multiple levels. This includes non-opioid analgesics (acetaminophen, NSAIDs), regional anesthesia (nerve blocks), and judicious opioid use. This approach improves pain control while minimizing opioid requirements and side effects. Combining two opioids is not multimodal. Alternating opioids provides no mechanistic diversity. Opioid plus benzodiazepine increases respiratory depression risk.",
    s: "Pain Management"
  },

  // ===== EMERGENCY & URGENT CARE (Questions 71-80) =====
  {
    q: "A 55-year-old patient presents to urgent care with sudden onset severe headache described as the worst headache of my life. Neurological examination is normal. What is the priority diagnostic study?",
    o: ["Non-contrast CT head followed by lumbar puncture if CT is negative", "MRI of the brain with gadolinium contrast", "Prescription of sumatriptan for presumed migraine", "CT head with contrast"],
    a: 0,
    r: "Thunderclap headache (sudden onset, maximal intensity) is a classic presentation of subarachnoid hemorrhage (SAH) until proven otherwise. Non-contrast CT head is the first-line imaging and is highly sensitive within the first 6 hours. If CT is negative, lumbar puncture should be performed to detect xanthochromia. MRI is not the first-line study for acute SAH. Treating as migraine without ruling out SAH is dangerous. CT with contrast does not improve sensitivity for acute hemorrhage.",
    s: "Emergency"
  },
  {
    q: "A patient presents with anaphylaxis after a bee sting. Symptoms include urticaria, angioedema, wheezing, and blood pressure of 78/40 mmHg. The patient received intramuscular epinephrine 5 minutes ago with no improvement. What should the NP do next?",
    o: ["Repeat intramuscular epinephrine 0.3 to 0.5 mg and establish IV access for fluid resuscitation", "Administer IV diphenhydramine and wait for response", "Administer subcutaneous epinephrine instead", "Apply cold compresses to the sting site and monitor"],
    a: 0,
    r: "Epinephrine is the first-line treatment for anaphylaxis and can be repeated every 5 to 15 minutes if symptoms persist. For refractory anaphylaxis with persistent hypotension, IV access should be established for aggressive fluid resuscitation and potential IV epinephrine infusion. Antihistamines are adjunctive but do not treat the life-threatening cardiovascular and respiratory components. Subcutaneous administration has slower absorption than intramuscular. Cold compresses do not address systemic anaphylaxis.",
    s: "Emergency"
  },
  {
    q: "A 45-year-old patient presents with acute onset right lower quadrant pain, rebound tenderness, and a temperature of 38.8 degrees Celsius. WBC is 16.2 x 10^9/L. What is the most appropriate next step?",
    o: ["Emergent surgical consultation and CT abdomen with contrast", "Prescribe oral antibiotics and follow up in 24 hours", "Order an abdominal ultrasound and discharge with pain management", "Administer a Fleet enema for suspected constipation"],
    a: 0,
    r: "Right lower quadrant pain with rebound tenderness, fever, and leukocytosis is highly suspicious for acute appendicitis until proven otherwise. CT abdomen with contrast is the gold standard imaging for diagnosing appendicitis in adults, and emergent surgical consultation is required as perforation risk increases with delay. Outpatient management with oral antibiotics is inappropriate for suspected appendicitis. Ultrasound is preferred in pediatric patients and pregnant women. An enema could worsen the condition if appendicitis is present.",
    s: "Emergency"
  },
  {
    q: "A 30-year-old male presents with testicular torsion symptoms including sudden onset severe scrotal pain and a high-riding testis with absent cremasteric reflex. What is the priority action?",
    o: ["Emergent urological consultation for surgical exploration within 6 hours", "Order a scrotal ultrasound with Doppler before consulting", "Prescribe NSAIDs and schedule outpatient urology follow-up", "Administer antibiotics for suspected epididymitis"],
    a: 0,
    r: "Testicular torsion is a surgical emergency. Testicular salvage rates exceed 90% if detorsion occurs within 6 hours of symptom onset but drop significantly after that. When clinical findings are classic (sudden pain, high-riding testis, absent cremasteric reflex), emergent surgical exploration should not be delayed for imaging. While Doppler ultrasound can confirm the diagnosis, it should not delay surgery in a classic presentation. NSAIDs alone do not address the vascular compromise. Antibiotics treat epididymitis but not torsion.",
    s: "Emergency"
  },
  {
    q: "A patient presents to urgent care with a laceration to the forearm sustained 14 hours ago. The wound is clean with no signs of infection. What is the appropriate wound management?",
    o: ["Clean the wound, provide delayed primary closure or allow healing by secondary intention, and update tetanus status", "Perform primary wound closure with sutures", "Apply adhesive skin closure strips and discharge", "Irrigate and apply a topical antibiotic without closure"],
    a: 0,
    r: "Lacerations presenting beyond 6 to 12 hours (depending on location and contamination) are at increased risk for infection if closed primarily. Clean wounds presenting at 14 hours should be cleaned thoroughly, and options include delayed primary closure (at 3 to 5 days if no infection develops) or healing by secondary intention. Tetanus prophylaxis should be updated if needed. Primary closure at 14 hours increases infection risk. Adhesive strips provide insufficient closure for most lacerations. Irrigation alone without a closure plan is incomplete management.",
    s: "Emergency"
  },
  {
    q: "A 60-year-old patient presents with acute onset facial droop, slurred speech, and right arm weakness. Symptom onset was 2 hours ago. Non-contrast CT head shows no hemorrhage. What is the next step?",
    o: ["Assess eligibility for IV alteplase (tPA) and initiate within the treatment window", "Administer aspirin 325 mg immediately", "Order an MRI brain before initiating treatment", "Admit for observation and start anticoagulation with heparin"],
    a: 0,
    r: "This presentation is consistent with an acute ischemic stroke. With symptom onset within the 4.5-hour window and no hemorrhage on CT, the patient should be assessed for IV alteplase (tPA) eligibility and treatment initiated as soon as possible. Every minute of delay increases brain tissue loss. Aspirin is appropriate but not within 24 hours of tPA. MRI provides additional detail but should not delay thrombolytic therapy. Heparin is not the standard acute treatment for ischemic stroke.",
    s: "Emergency"
  },
  {
    q: "A patient with type 1 diabetes presents with blood glucose of 28 mmol/L, pH 7.18, serum bicarbonate 10 mmol/L, and positive serum ketones. Which intervention should be initiated first?",
    o: ["IV normal saline bolus for fluid resuscitation", "Subcutaneous insulin lispro injection", "IV sodium bicarbonate infusion", "Oral glucose solution"],
    a: 0,
    r: "Diabetic ketoacidosis (DKA) presents with hyperglycemia, metabolic acidosis, and ketonemia. The initial priority is aggressive IV fluid resuscitation with normal saline to correct dehydration, improve renal perfusion, and reduce glucose concentration. Insulin infusion follows after initial fluid resuscitation and potassium assessment. Subcutaneous insulin has unreliable absorption in dehydrated patients. Sodium bicarbonate is only considered for pH below 6.9. Oral glucose is contraindicated in hyperglycemia.",
    s: "Emergency"
  },
  {
    q: "A 25-year-old patient presents after a motor vehicle collision with neck pain and midline cervical tenderness. The patient is alert, oriented, and neurologically intact. Which imaging study should the NP order?",
    o: ["CT cervical spine", "Plain radiograph of the cervical spine (3-view)", "MRI of the cervical spine", "No imaging if Canadian C-Spine Rule criteria are met for clearance"],
    a: 0,
    r: "Midline cervical tenderness after trauma is a positive finding on the Canadian C-Spine Rule and indicates the need for imaging. CT cervical spine is the preferred modality in trauma settings due to superior sensitivity for fracture detection compared to plain radiographs. MRI is used to evaluate ligamentous injury and spinal cord pathology but is not the first-line study. The Canadian C-Spine Rule cannot clear this patient because midline tenderness is present.",
    s: "Emergency"
  },
  {
    q: "A patient presents with a foreign body sensation in the right eye after grinding metal. Visual acuity is 20/40 in the affected eye. Slit lamp examination reveals a metallic foreign body embedded in the cornea with a surrounding rust ring. What is the appropriate management?",
    o: ["Remove the foreign body under slit lamp guidance, treat with topical antibiotic, and refer to ophthalmology for rust ring removal", "Prescribe topical antibiotic drops and follow up in 1 week", "Irrigate the eye with normal saline and apply an eye patch", "Refer directly to the emergency department for surgical removal"],
    a: 0,
    r: "Corneal metallic foreign bodies should be removed promptly to prevent further corneal damage and infection. Removal can be performed under slit lamp guidance using a sterile needle or spud. The rust ring may require removal by ophthalmology with a rotating burr if it does not resolve. Topical antibiotics prevent secondary infection. Simple irrigation is insufficient for an embedded foreign body. Eye patching is no longer routinely recommended for corneal injuries. Emergency surgical removal is not typically needed for uncomplicated corneal foreign bodies.",
    s: "Emergency"
  },
  {
    q: "A patient presents with a nosebleed (epistaxis) that has not stopped despite 20 minutes of direct pressure with anterior nasal packing. Blood is visible in the posterior pharynx. What is the next step?",
    o: ["Insert a posterior nasal pack or epistaxis balloon and arrange ENT consultation", "Apply additional anterior packing and continue observation", "Cauterize the nasal septum with silver nitrate", "Discharge with instructions to continue pinching the nose at home"],
    a: 0,
    r: "Posterior epistaxis (bleeding visible in the posterior pharynx that does not respond to anterior packing) requires posterior nasal packing or a specialized epistaxis balloon to tamponade the bleeding source. ENT consultation is essential as posterior bleeds often require endoscopic cauterization or arterial ligation. Additional anterior packing will not address a posterior source. Silver nitrate cauterization is for anterior bleeds only. Discharging a patient with active posterior epistaxis is unsafe.",
    s: "Emergency"
  },

  // ===== HEALTH PROMOTION & SCREENING GUIDELINES (Questions 81-90) =====
  {
    q: "A 50-year-old female with no family history of breast cancer asks about screening mammography. According to Canadian screening guidelines, what should the NP recommend?",
    o: ["Mammography every 2 years for women aged 50 to 74", "Annual mammography starting at age 40", "Breast MRI annually starting at age 50", "Self-breast examination monthly without imaging"],
    a: 0,
    r: "The Canadian Task Force on Preventive Health Care recommends screening mammography every 2 to 3 years for women aged 50 to 74 at average risk. Screening for women 40 to 49 at average risk is not routinely recommended but should involve shared decision-making. Annual mammography starting at 40 is the US guideline for some organizations. Breast MRI is reserved for high-risk patients. Self-breast examination alone is insufficient for screening.",
    s: "Health Promotion"
  },
  {
    q: "An NP is counseling a 55-year-old patient about colorectal cancer screening. The patient has no family history of colorectal cancer. Which screening test is recommended?",
    o: ["Fecal immunochemical test (FIT) every 2 years or colonoscopy every 10 years", "Colonoscopy every 5 years regardless of risk", "CT colonography annually", "Digital rectal examination annually"],
    a: 0,
    r: "For average-risk individuals aged 50 to 74, colorectal cancer screening options include fecal immunochemical test (FIT) every 2 years or colonoscopy every 10 years. FIT is the preferred initial screening test in Canadian guidelines due to its non-invasive nature and cost-effectiveness. Colonoscopy every 5 years is for patients with a history of adenomatous polyps. CT colonography is not the first-line screening method. Digital rectal examination is not an adequate screening tool for colorectal cancer.",
    s: "Health Promotion"
  },
  {
    q: "A 45-year-old male with a BMI of 32, sedentary lifestyle, and family history of type 2 diabetes asks about diabetes screening. What should the NP recommend?",
    o: ["Fasting plasma glucose or HbA1C every 3 years, starting now due to risk factors", "OGTT every 5 years starting at age 50", "Random glucose measurement at the next visit", "No screening needed until symptoms develop"],
    a: 0,
    r: "Diabetes screening is recommended every 3 years for individuals aged 40 and older, or earlier and more frequently for those with risk factors (obesity, family history, sedentary lifestyle, ethnicity). Fasting plasma glucose or HbA1C are acceptable screening tests. This patient's multiple risk factors warrant screening now. Waiting until age 50 or until symptoms develop delays diagnosis of a condition where early intervention prevents complications. Random glucose is not a standard screening test.",
    s: "Health Promotion"
  },
  {
    q: "An NP is discussing cervical cancer screening with a 30-year-old female. Her last Pap test was normal 2 years ago. What is the recommended screening interval?",
    o: ["Pap test every 3 years for women aged 25 to 69", "Annual Pap test for all sexually active women", "HPV testing alone every 5 years", "No further screening needed if the last result was normal"],
    a: 0,
    r: "Canadian guidelines recommend cervical cancer screening with Pap test (cytology) every 3 years for women aged 25 to 69 who have ever been sexually active. Some jurisdictions are transitioning to primary HPV testing every 5 years for women 25 to 65. Annual Pap tests are no longer recommended as they do not improve detection rates but increase false positives and unnecessary procedures. One normal result does not eliminate the need for future screening.",
    s: "Health Promotion"
  },
  {
    q: "A 65-year-old male smoker with a 35-pack-year history asks about lung cancer screening. What should the NP recommend?",
    o: ["Annual low-dose CT chest for adults aged 55 to 74 with 30 or more pack-year smoking history", "Chest radiograph every 2 years", "Sputum cytology annually", "No screening available for lung cancer"],
    a: 0,
    r: "Low-dose CT (LDCT) chest screening is recommended annually for adults aged 55 to 74 (some guidelines extend to 80) with a 30 or more pack-year smoking history who are current smokers or who quit within the past 15 years. LDCT has been shown to reduce lung cancer mortality. Chest radiograph lacks sensitivity for early-stage lung cancer. Sputum cytology has not been shown to reduce mortality. Effective lung cancer screening is available for eligible individuals.",
    s: "Health Promotion"
  },
  {
    q: "An NP is performing cardiovascular risk assessment on a 52-year-old male with a blood pressure of 142/88 mmHg, total cholesterol 6.2 mmol/L, LDL 4.1 mmol/L, and fasting glucose 5.8 mmol/L. What is the initial management priority?",
    o: ["Lifestyle modifications including dietary changes, exercise, and weight management with follow-up BP monitoring", "Immediate initiation of antihypertensive and statin therapy", "Referral to cardiology for stress testing", "Reassurance that all values are within normal limits"],
    a: 0,
    r: "This patient has stage 1 hypertension and hyperlipidemia. For initial management without established cardiovascular disease, lifestyle modifications (DASH diet, sodium restriction, regular aerobic exercise, weight management, smoking cessation, alcohol moderation) are the first step with follow-up blood pressure monitoring. If blood pressure remains elevated after 3 to 6 months of lifestyle changes, pharmacologic therapy should be initiated. Immediate drug therapy is for higher stages or those with target organ damage. Values are not normal. Stress testing is premature without specific indication.",
    s: "Health Promotion"
  },
  {
    q: "A 21-year-old female college student asks about the HPV vaccine. She has not previously been vaccinated. What should the NP recommend?",
    o: ["HPV vaccination is recommended as a 3-dose series for those starting at age 15 or older", "HPV vaccine is no longer effective after age 18", "Only a single dose is needed at this age", "HPV vaccination is only recommended for males"],
    a: 0,
    r: "HPV vaccination is recommended for individuals through age 26 who were not adequately vaccinated previously. For those initiating the series at age 15 or older, a 3-dose schedule is recommended (0, 1-2, and 6 months). For those starting before age 15, a 2-dose schedule is sufficient. The vaccine is effective up to age 26 (and may be offered to age 45 with shared decision-making). It is recommended for all genders.",
    s: "Health Promotion"
  },
  {
    q: "An NP is counseling a patient about osteoporosis screening. The patient is a 67-year-old postmenopausal female with no risk factors. When should bone density screening be recommended?",
    o: ["DEXA scan at age 65 for all postmenopausal women without prior screening", "DEXA scan only if a fracture occurs", "DEXA scan at age 50 at menopause onset", "No screening is recommended for women without risk factors"],
    a: 0,
    r: "DEXA screening is recommended for all women aged 65 and older, regardless of risk factors. For women younger than 65 with risk factors (low body weight, smoking, family history, glucocorticoid use), earlier screening may be warranted. Waiting until a fracture occurs means the diagnosis is made too late for primary prevention. Age 50 is too early for routine screening in average-risk women. Screening is recommended for all women 65 and older.",
    s: "Health Promotion"
  },
  {
    q: "A 48-year-old patient asks about hepatitis C screening. The patient has no known risk factors and was born in 1976. What should the NP recommend?",
    o: ["One-time hepatitis C screening with anti-HCV antibody test for all adults aged 18 and older", "Screening only for those with known risk factors", "Annual hepatitis C screening for all adults", "No screening needed if the patient has no symptoms"],
    a: 0,
    r: "Updated guidelines recommend universal one-time hepatitis C screening for all adults aged 18 and older (or at least once for those born between 1945 and 1965 in some guidelines). This approach identifies the large number of individuals with undiagnosed chronic hepatitis C who can benefit from curative direct-acting antiviral therapy. Risk-factor-based screening alone misses many cases. Annual screening is not necessary for average-risk individuals. Hepatitis C is often asymptomatic for decades.",
    s: "Health Promotion"
  },
  {
    q: "An NP is advising a 70-year-old patient about influenza and pneumococcal vaccination. The patient has not received a pneumococcal vaccine. What vaccines should be recommended?",
    o: ["Annual influenza vaccine and PCV20 (or PCV15 followed by PPSV23)", "Influenza vaccine every 5 years and no pneumococcal vaccine needed", "High-dose influenza vaccine only", "Pneumococcal vaccine only if the patient has chronic lung disease"],
    a: 0,
    r: "Adults 65 and older should receive annual influenza vaccination (high-dose or adjuvanted formulation preferred) and pneumococcal vaccination. Current guidelines recommend PCV20 alone or PCV15 followed by PPSV23 at least 1 year later for pneumococcal-vaccine-naive adults 65 and older. Influenza vaccine is needed annually due to antigenic drift. Pneumococcal vaccination is recommended for all adults 65 and older regardless of comorbidities.",
    s: "Health Promotion"
  },

  // ===== PALLIATIVE & END-OF-LIFE CARE (Questions 91-100) =====
  {
    q: "An NP is managing a terminally ill patient with severe dyspnea. The patient is already receiving supplemental oxygen with minimal relief. What is the most appropriate pharmacologic intervention?",
    o: ["Low-dose morphine for dyspnea relief", "Increase oxygen flow rate to maximum", "Initiate IV furosemide for presumed fluid overload", "Prescribe albuterol nebulizer treatments"],
    a: 0,
    r: "Low-dose opioids (morphine) are the gold standard for managing refractory dyspnea in palliative care. Morphine reduces the sensation of breathlessness by acting on central opioid receptors in the brainstem and reducing the ventilatory response to hypoxia and hypercapnia. Simply increasing oxygen does not address dyspnea perception if hypoxemia is not the primary driver. Furosemide is appropriate only if fluid overload is present. Albuterol treats bronchospasm but not the global dyspnea of advanced disease.",
    s: "Palliative Care"
  },
  {
    q: "A patient with advanced pancreatic cancer is experiencing intractable nausea and vomiting unresponsive to ondansetron. Which alternative antiemetic should the NP consider?",
    o: ["Haloperidol 0.5 to 1 mg subcutaneously every 8 hours", "Increase ondansetron to maximum dose", "Prescribe metoclopramide if there is no bowel obstruction", "Discontinue all antiemetics and provide comfort measures only"],
    a: 0,
    r: "In palliative care, when first-line antiemetics (such as ondansetron) fail, haloperidol is an effective alternative acting on the chemoreceptor trigger zone (D2 receptor antagonist). It is particularly useful for nausea caused by metabolic derangements, medications, and malignancy. Subcutaneous administration is available when the oral route is compromised. Increasing the dose of a failed medication is not optimal. Metoclopramide is an option if there is no bowel obstruction. Discontinuing all antiemetics causes unnecessary suffering.",
    s: "Palliative Care"
  },
  {
    q: "A family member asks the NP about the dying process for their loved one who is actively dying. The patient has developed Cheyne-Stokes respirations and mottled extremities. What should the NP explain?",
    o: ["These are normal physiologic changes of the dying process and do not indicate suffering", "These symptoms indicate the patient is in pain and needs increased analgesics", "Emergency intubation should be considered", "The patient should be transferred to the ICU for monitoring"],
    a: 0,
    r: "Cheyne-Stokes respirations (cyclical breathing with periods of apnea) and mottled extremities (peripheral circulatory changes) are expected signs of the active dying process. They are not indicators of pain or distress and do not require aggressive medical intervention. Explaining these normal changes to family members reduces anxiety and supports informed decision-making. Increasing analgesics is not indicated without pain assessment. Intubation and ICU transfer are not consistent with comfort-focused care in actively dying patients.",
    s: "Palliative Care"
  },
  {
    q: "An NP is managing a patient with end-stage COPD who has a terminal respiratory secretion (death rattle). The patient is unresponsive. What is the most appropriate intervention?",
    o: ["Administer glycopyrrolate 0.2 mg subcutaneously to reduce secretions", "Perform deep oropharyngeal suctioning every 2 hours", "Administer IV normal saline to thin secretions", "Insert a nasogastric tube for secretion management"],
    a: 0,
    r: "Glycopyrrolate (an anticholinergic) reduces the production of upper airway secretions that cause the death rattle. It does not cross the blood-brain barrier, making it preferable to scopolamine in terms of central nervous system side effects. Deep suctioning is distressing, often ineffective, and not recommended for terminal secretions. IV fluids can worsen secretion production. Nasogastric tubes are invasive and do not address upper airway secretions.",
    s: "Palliative Care"
  },
  {
    q: "A patient with a terminal diagnosis and a prognosis of less than 6 months asks about Medical Assistance in Dying (MAiD). What is the NP's role in this conversation?",
    o: ["Provide information about MAiD eligibility criteria and the assessment process, and offer referral to an assessor", "Refuse to discuss MAiD based on personal beliefs without referral", "Initiate the MAiD process without formal assessment", "Advise the patient that MAiD is only available for cancer diagnoses"],
    a: 0,
    r: "In Canada, NPs have a professional obligation to provide information about MAiD to patients who inquire, regardless of personal beliefs. This includes explaining eligibility criteria (grievous and irremediable medical condition, informed consent, independent assessments) and offering referral to an authorized MAiD assessor. Refusing without referral violates professional obligations. The NP should not initiate the process without proper assessment. MAiD is not limited to cancer diagnoses; it is available for eligible patients with grievous and irremediable conditions.",
    s: "Palliative Care"
  },
  {
    q: "A palliative care patient with bowel obstruction from peritoneal carcinomatosis develops nausea, vomiting, and colicky abdominal pain. Surgery is not an option. What is the most appropriate management?",
    o: ["Octreotide subcutaneously to reduce secretions and dexamethasone for anti-inflammatory effect", "High-dose metoclopramide for bowel stimulation", "Nasogastric tube insertion and bowel rest only", "Aggressive IV hydration and total parenteral nutrition"],
    a: 0,
    r: "In malignant bowel obstruction where surgery is not feasible, medical management focuses on symptom control. Octreotide (a somatostatin analog) reduces GI secretions and may help resolve partial obstructions. Dexamethasone has anti-inflammatory and anti-edema effects that can reduce perilesional swelling. Metoclopramide (a prokinetic) is contraindicated in complete bowel obstruction as it can worsen colicky pain and perforation risk. NG tubes are uncomfortable and a last resort. Aggressive hydration may worsen edema and secretions.",
    s: "Palliative Care"
  },
  {
    q: "An NP is prescribing medications for a palliative care patient who can no longer swallow. Which route of administration is preferred for comfort medications?",
    o: ["Subcutaneous continuous infusion or intermittent injections", "Intravenous bolus administration", "Intramuscular injections", "Rectal suppository administration"],
    a: 0,
    r: "When the oral route is unavailable in palliative care, subcutaneous administration is the preferred alternative route. Continuous subcutaneous infusion (CSCI) or intermittent subcutaneous injections provide reliable drug delivery with minimal discomfort. Many palliative medications (morphine, hydromorphone, midazolam, glycopyrrolate, haloperidol) can be given subcutaneously. IV access may be difficult and is more invasive. IM injections are painful. Rectal administration is an alternative but is less preferred by patients and has variable absorption.",
    s: "Palliative Care"
  },
  {
    q: "A patient with advanced cancer and bone metastases has increasing pain despite escalating oral morphine doses. The current dose is 200 mg of oral morphine equivalents daily. Which adjuvant therapy should the NP consider adding?",
    o: ["Dexamethasone and a bisphosphonate (zoledronic acid) for bone pain", "Switch to acetaminophen monotherapy", "Add an NSAID as the sole intervention", "Discontinue morphine and start pregabalin alone"],
    a: 0,
    r: "For cancer-related bone pain refractory to opioid dose escalation, adjuvant therapies are essential. Dexamethasone reduces inflammation and periosteal edema contributing to pain. Bisphosphonates (zoledronic acid) inhibit osteoclast-mediated bone destruction, reduce skeletal events, and provide analgesic benefit for bone metastases. Acetaminophen alone is insufficient for severe cancer pain. NSAIDs may help as an adjunct but are not sufficient alone. Discontinuing opioids would cause uncontrolled pain; pregabalin addresses neuropathic but not nociceptive bone pain.",
    s: "Palliative Care"
  },
  {
    q: "An NP is discussing advance care planning with a patient who has early-stage dementia. The patient is currently capable of making decisions. What should the NP prioritize?",
    o: ["Facilitate completion of advance directives and designation of a substitute decision-maker while the patient has capacity", "Defer the conversation until the disease progresses further", "Have the family make all decisions on the patient's behalf now", "Document the NP's preferred treatment plan in the chart"],
    a: 0,
    r: "Advance care planning should occur while the patient has decision-making capacity. This includes completing advance directives (documenting treatment preferences) and designating a substitute decision-maker (power of attorney for personal care). Early-stage dementia allows meaningful participation in these discussions. Deferring risks losing the window of capacity. Family should not make decisions when the patient is still capable. The NP should facilitate the patient's own values and preferences, not impose their own treatment plan.",
    s: "Palliative Care"
  },
  {
    q: "A patient receiving palliative care develops terminal restlessness with agitation, moaning, and purposeless movements. Standard comfort measures have been ineffective. What pharmacologic intervention should the NP consider?",
    o: ["Midazolam subcutaneously for palliative sedation", "Physical restraints for patient safety", "IV caffeine to improve alertness", "Increase the opioid dose without assessment"],
    a: 0,
    r: "Terminal restlessness (terminal agitation) is a distressing symptom in the dying process. When non-pharmacologic interventions fail, midazolam (a short-acting benzodiazepine) administered subcutaneously is the preferred medication for palliative sedation to manage refractory agitation and ensure comfort. Physical restraints are not appropriate in palliative care and can increase agitation. IV caffeine would worsen agitation. Increasing opioids without assessing for other causes of restlessness (urinary retention, constipation, spiritual distress) may worsen delirium.",
    s: "Palliative Care"
  }
];
