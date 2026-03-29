import type { ExamQuestion } from "./types";

export const npUsBatch01Questions: ExamQuestion[] = [
  {
    q: "A 54-year-old male presents with a 2-month history of epigastric pain that worsens with meals and 10-pound unintentional weight loss. He has a 30-pack-year smoking history. Upper endoscopy reveals a 3-cm ulcerated mass in the gastric body. Biopsy shows intestinal-type adenocarcinoma. What is the most appropriate next step?",
    o: ["CT chest, abdomen, and pelvis for staging before determining treatment approach", "Immediate subtotal gastrectomy without further workup", "Triple therapy for H. pylori eradication and repeat endoscopy in 8 weeks", "Start a proton pump inhibitor and monitor symptom resolution"],
    a: 0,
    r: "Biopsy-confirmed gastric adenocarcinoma requires staging with CT imaging of the chest, abdomen, and pelvis to assess for distant metastases and locoregional extent before treatment decisions. Endoscopic ultrasound may also be performed for T and N staging. Surgery without staging may lead to unnecessary morbidity if metastatic disease is present. H. pylori eradication is important but does not treat established cancer. PPI therapy alone is inappropriate management for confirmed malignancy.",
    s: "GI"
  },
  {
    q: "A 62-year-old female with type 2 diabetes and hypertension presents with a spot urine albumin-to-creatinine ratio of 285 mg/g on two separate occasions. Serum creatinine is 1.4 mg/dL with an eGFR of 48 mL/min/1.73m². She is currently taking lisinopril 20 mg daily. What additional medication should be initiated?",
    o: ["Finerenone, a nonsteroidal mineralocorticoid receptor antagonist with proven renal and cardiovascular benefit in diabetic kidney disease", "Spironolactone 25 mg daily for additional albuminuria reduction", "Add losartan to the existing lisinopril for dual RAAS blockade", "Start furosemide 20 mg daily for kidney protection"],
    a: 0,
    r: "Finerenone has demonstrated significant reduction in CKD progression and cardiovascular events in patients with type 2 diabetes and CKD (FIDELIO-DKD and FIGARO-DKD trials). It is recommended as add-on therapy to maximally tolerated ACE inhibitor or ARB. Spironolactone increases hyperkalemia risk without proven renal outcome benefit in this population. Dual RAAS blockade (ACEi + ARB) is contraindicated due to increased risk of hyperkalemia, hypotension, and acute kidney injury (ONTARGET trial). Furosemide manages fluid but does not provide renal protection.",
    s: "Renal"
  },
  {
    q: "A 28-year-old female presents with fatigue, cold intolerance, weight gain, and constipation for 3 months. Physical examination reveals dry skin, delayed deep tendon reflexes, and a non-tender diffuse goiter. TSH is 12.8 mIU/L and free T4 is 0.6 ng/dL. Anti-TPO antibodies are elevated. What is the most appropriate treatment?",
    o: ["Levothyroxine starting at 1.6 mcg/kg/day with TSH recheck in 6-8 weeks", "Liothyronine (T3) 25 mcg daily as primary replacement", "Start desiccated thyroid extract for more natural hormone replacement", "No treatment needed; recheck labs in 3 months as this may be transient"],
    a: 0,
    r: "This is primary hypothyroidism from Hashimoto thyroiditis (elevated TSH, low free T4, positive anti-TPO). ATA guidelines recommend levothyroxine as first-line replacement at approximately 1.6 mcg/kg/day in young, healthy patients. TSH should be rechecked in 6-8 weeks to allow steady state. T3 monotherapy is not recommended as it has a short half-life and causes fluctuating levels. Desiccated thyroid provides inconsistent T3:T4 ratios. With overt hypothyroidism (elevated TSH with low free T4 and symptoms), treatment should not be deferred.",
    s: "Endocrine"
  },
  {
    q: "A 45-year-old male presents with sudden onset of the worst headache of his life while lifting weights. He reports a brief loss of consciousness. In the ED, he is drowsy but follows commands. CT head without contrast is negative. What is the most appropriate next step?",
    o: ["Lumbar puncture to evaluate for xanthochromia, as CT sensitivity decreases after 6 hours from onset", "Discharge with analgesics and migraine follow-up since CT is negative", "MRI brain with gadolinium to evaluate for posterior fossa mass", "Start sumatriptan for presumed thunderclap migraine"],
    a: 0,
    r: "Thunderclap headache ('worst headache of my life') with exertional onset and loss of consciousness is subarachnoid hemorrhage until proven otherwise. CT head has ~98% sensitivity within 6 hours but decreases significantly after 12 hours. A negative CT does not exclude SAH, and lumbar puncture must be performed to look for xanthochromia (bilirubin-stained CSF from RBC breakdown) or elevated RBCs. Discharging without LP risks missing a ruptured aneurysm. MRI may be helpful but LP is the standard next step after negative CT. Triptans are contraindicated in suspected SAH due to vasoconstrictive properties.",
    s: "Neurological"
  },
  {
    q: "A 70-year-old male with COPD presents with increasing dyspnea, purulent sputum production, and fever for 3 days. FEV1 is 35% predicted at baseline. SpO2 is 88% on room air. ABG shows pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg. Chest X-ray shows hyperinflation without consolidation. What is the most appropriate intervention?",
    o: ["Noninvasive positive-pressure ventilation (BiPAP) along with bronchodilators, systemic corticosteroids, and antibiotics", "Intubation and mechanical ventilation immediately", "High-flow nasal cannula oxygen at 15 L/min targeting SpO2 of 99%", "Nebulized albuterol alone and reassess in 2 hours"],
    a: 0,
    r: "This is an acute exacerbation of COPD with acute-on-chronic respiratory acidosis (pH 7.31, PaCO2 58). GOLD guidelines recommend NIV (BiPAP) as first-line ventilatory support for AECOPD with respiratory acidosis (pH 7.25-7.35), which reduces intubation rates and mortality. Concurrent treatment includes short-acting bronchodilators, systemic corticosteroids (prednisone 40 mg x 5 days), and antibiotics for purulent exacerbation. Immediate intubation is reserved for severe acidosis (pH <7.25) or NIV failure. High-flow oxygen targeting 99% risks worsening hypercapnia in CO2-retaining COPD. Bronchodilators alone are insufficient given the respiratory acidosis.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old female presents with progressive proximal muscle weakness over 2 months. She has difficulty rising from a chair and climbing stairs. She also reports a violaceous (heliotrope) rash on her upper eyelids and erythematous papules over her knuckles. CK is 4,200 U/L. What is the most important additional evaluation?",
    o: ["Age-appropriate malignancy screening, as dermatomyositis is associated with occult cancer in up to 25% of adults", "Start high-dose prednisone immediately without further workup", "EMG and nerve conduction studies as the sole diagnostic step", "Skin biopsy of the knuckle papules only"],
    a: 0,
    r: "Dermatomyositis is characterized by proximal muscle weakness, elevated CK, heliotrope rash (violaceous eyelid discoloration), and Gottron papules (erythematous papules over knuckles). In adults over 40, there is a significant association with occult malignancy (ovarian, lung, GI, breast, lymphoma) in up to 25% of cases, particularly in the first 3 years after diagnosis. Age-appropriate cancer screening (CT chest/abdomen/pelvis, mammography, colonoscopy, etc.) is essential. While treatment with corticosteroids and EMG/muscle biopsy for confirmation are important, malignancy screening should not be delayed.",
    s: "Musculoskeletal"
  },
  {
    q: "A 38-year-old male presents with a 3-week history of progressive jaundice, dark urine, and clay-colored stools. He reports 15-pound weight loss. CT abdomen shows a 2.5-cm mass in the head of the pancreas with biliary dilation but no vascular invasion or distant metastases. CA 19-9 is 380 U/mL. What is the most appropriate management?",
    o: ["Referral for pancreaticoduodenectomy (Whipple procedure) as the tumor appears resectable", "Palliative chemotherapy with gemcitabine as primary treatment", "ERCP with stent placement as definitive treatment", "Observation with repeat CT in 3 months"],
    a: 0,
    r: "A pancreatic head mass causing obstructive jaundice without vascular invasion or metastases is potentially resectable. Pancreaticoduodenectomy (Whipple procedure) offers the only chance for cure in pancreatic adenocarcinoma. Surgical resection is the standard of care for resectable disease, with neoadjuvant chemotherapy considered at high-volume centers. Palliative chemotherapy is reserved for unresectable or metastatic disease. ERCP with stenting provides biliary decompression but is not definitive treatment. Observation allows disease progression and loss of the resectability window.",
    s: "GI"
  },
  {
    q: "A 22-year-old female presents with acute onset of right lower quadrant pain, nausea, and a positive urine pregnancy test. Last menstrual period was 7 weeks ago. Transvaginal ultrasound shows an empty uterus and a 3-cm complex adnexal mass with free fluid in the cul-de-sac. Serum beta-hCG is 6,500 mIU/mL. Vital signs show HR 110, BP 90/60. What is the most appropriate management?",
    o: ["Emergent surgical intervention (laparoscopy or laparotomy) for suspected ruptured ectopic pregnancy", "Administer methotrexate 50 mg/m² IM as an outpatient", "Serial beta-hCG monitoring every 48 hours", "Repeat ultrasound in 1 week to reassess for intrauterine pregnancy"],
    a: 0,
    r: "This patient has a ruptured ectopic pregnancy: empty uterus with beta-hCG above the discriminatory zone (1,500-2,000), complex adnexal mass, free fluid (hemoperitoneum), and hemodynamic instability (tachycardia, hypotension). This is a surgical emergency requiring immediate intervention. Methotrexate is indicated for unruptured ectopic pregnancies in hemodynamically stable patients with beta-hCG <5,000, no fetal cardiac activity, and mass <3.5 cm. Serial monitoring delays treatment of an acute surgical emergency. Repeat ultrasound is inappropriate in a hemodynamically unstable patient.",
    s: "Reproductive"
  },
  {
    q: "A 65-year-old male presents with new-onset seizure. MRI brain reveals a 4-cm ring-enhancing lesion in the right frontal lobe with surrounding vasogenic edema. He has a 40-pack-year smoking history. CT chest shows a 3-cm spiculated mass in the left lower lobe. What is the most likely diagnosis?",
    o: ["Metastatic lung cancer to the brain", "Primary glioblastoma multiforme with incidental pulmonary nodule", "Brain abscess from pulmonary source", "Meningioma with unrelated lung finding"],
    a: 0,
    r: "In a heavy smoker with a spiculated lung mass and a ring-enhancing brain lesion, metastatic lung cancer is the most likely diagnosis. Lung cancer is the most common primary malignancy to metastasize to the brain. Ring enhancement with surrounding edema is characteristic of brain metastases. While GBM also presents as a ring-enhancing lesion, the concurrent spiculated lung mass makes metastasis far more probable. Brain abscess would typically present with fever and elevated inflammatory markers. Meningiomas are extra-axial, dural-based, and homogeneously enhancing.",
    s: "Neurological"
  },
  {
    q: "A 50-year-old female presents with a BMI of 42, type 2 diabetes (HbA1c 8.5%), obstructive sleep apnea, and osteoarthritis of bilateral knees. She has failed multiple supervised weight loss programs including pharmacotherapy. What is the most appropriate next recommendation?",
    o: ["Referral for bariatric surgery evaluation, as she meets NIH criteria with BMI >40 and obesity-related comorbidities", "Restart orlistat 120 mg three times daily with meals", "Very low-calorie diet (800 kcal/day) under medical supervision", "Recommend a commercial weight loss program with weekly check-ins"],
    a: 0,
    r: "NIH guidelines recommend bariatric surgery consideration for patients with BMI ≥40 or BMI ≥35 with obesity-related comorbidities who have failed adequate trials of nonsurgical weight management. This patient meets both criteria (BMI 42 with T2DM, OSA, and OA) and has failed supervised programs including pharmacotherapy. Bariatric surgery provides the most durable weight loss and greatest improvement in obesity-related comorbidities. Orlistat produces modest weight loss (3-5% body weight). VLCDs have high regain rates. Commercial programs alone are unlikely to succeed after supervised program failures.",
    s: "Endocrine"
  },
  {
    q: "A 72-year-old female with atrial fibrillation on apixaban presents after a mechanical fall from standing height. She is alert and oriented with a GCS of 15. She reports mild headache but no loss of consciousness, vomiting, or focal neurological deficits. What is the most appropriate initial evaluation?",
    o: ["CT head without contrast immediately, as anticoagulated patients are at high risk for delayed intracranial hemorrhage even after minor head trauma", "Neurological observation for 4 hours; CT only if symptoms develop", "Skull X-ray series to evaluate for fracture", "Reverse apixaban with andexanet alfa before any imaging"],
    a: 0,
    r: "Anticoagulated patients have a significantly elevated risk of intracranial hemorrhage following head trauma, including delayed bleeding that may present hours after the initial injury. Current guidelines recommend immediate CT head for all anticoagulated patients with head injury, regardless of symptom severity. Observation alone risks missing evolving hemorrhage. Skull X-rays have been largely replaced by CT for head trauma evaluation. Reversal agents are reserved for confirmed intracranial hemorrhage or life-threatening bleeding, not as a precautionary measure before imaging.",
    s: "Neurological"
  },
  {
    q: "A 35-year-old male presents with a painless, enlarging neck mass for 6 weeks. Examination reveals a 3-cm firm, rubbery, non-tender lymph node in the left posterior cervical chain. He reports night sweats, pruritus, and 12-pound weight loss. CBC shows mild eosinophilia. What is the most appropriate diagnostic step?",
    o: ["Excisional lymph node biopsy for histopathological examination and architectural assessment", "Fine-needle aspiration of the lymph node", "Start empiric antibiotics for 2 weeks and reassess", "PET-CT scan as the initial diagnostic study"],
    a: 0,
    r: "Painless lymphadenopathy with B symptoms (night sweats, weight loss, fever) and pruritus in a young adult is classic for Hodgkin lymphoma. Excisional biopsy is the gold standard, as it preserves nodal architecture necessary for diagnosis and subtyping (Reed-Sternberg cells in proper microenvironment). FNA is insufficient because it cannot assess architecture, leading to high rates of non-diagnostic or inconclusive results for lymphoma. Antibiotics delay diagnosis when clinical suspicion for lymphoma is high. PET-CT is essential for staging but requires tissue diagnosis first.",
    s: "Hematology"
  },
  {
    q: "A 58-year-old male with well-controlled HIV (CD4 650, undetectable viral load) presents for routine preventive care. He has no history of anal symptoms. His last colonoscopy was 5 years ago and was normal. What cancer screening recommendation is most important for this patient?",
    o: ["Anal cytology (anal Pap smear) screening for anal squamous cell carcinoma, given the elevated risk in HIV-positive males", "Repeat colonoscopy now, as HIV patients require screening every 5 years", "Annual low-dose CT chest for lung cancer screening regardless of smoking history", "No additional screening beyond standard age-appropriate guidelines"],
    a: 0,
    r: "HIV-positive men have a significantly elevated risk of anal squamous cell carcinoma (up to 80-fold higher than the general population) due to high rates of persistent high-risk HPV infection. The ANCHOR trial demonstrated that treating high-grade anal squamous intraepithelial lesions (HSIL) reduced progression to anal cancer by 57%. Current guidelines recommend anal cytology screening for HIV-positive MSM and women with a history of cervical/vulvar HSIL. Colonoscopy follows standard 10-year intervals unless high-risk polyps were found. LDCT is indicated only with sufficient smoking history.",
    s: "Infectious Disease"
  },
  {
    q: "A 42-year-old female presents with progressive bilateral hand stiffness and pain worse in the morning lasting 2 hours. She also reports dry eyes and dry mouth. RF is positive at 1:320 and anti-CCP is strongly positive. Anti-SSA (Ro) antibodies are also positive. What additional workup is most important?",
    o: ["Schirmer test and minor salivary gland biopsy to evaluate for secondary Sjogren syndrome", "Echocardiogram to evaluate for rheumatic heart disease", "Anti-dsDNA antibodies to rule out systemic lupus erythematosus", "HLA-B27 testing to evaluate for ankylosing spondylitis"],
    a: 0,
    r: "This patient has rheumatoid arthritis (symmetric polyarthritis, morning stiffness >60 minutes, positive RF and anti-CCP) with sicca symptoms (dry eyes and mouth) and positive anti-SSA antibodies, strongly suggesting secondary Sjogren syndrome. Schirmer test (measures tear production) and minor salivary gland biopsy (shows focal lymphocytic sialadenitis) confirm the diagnosis. Secondary Sjogren occurs in up to 20-30% of RA patients. Echocardiogram evaluates valvular disease, not relevant here. Anti-dsDNA is specific for SLE, which presents differently. HLA-B27 is associated with axial spondyloarthropathies, not RA.",
    s: "Musculoskeletal"
  },
  {
    q: "A 68-year-old male presents with progressive dyspnea on exertion for 6 months. Physical examination reveals bibasilar inspiratory crackles (Velcro rales) and digital clubbing. High-resolution CT shows bilateral basilar predominant reticular pattern with honeycombing and traction bronchiectasis. What is the most likely diagnosis?",
    o: ["Idiopathic pulmonary fibrosis based on the usual interstitial pneumonia pattern on HRCT", "Hypersensitivity pneumonitis", "Sarcoidosis with pulmonary involvement", "Congestive heart failure with bilateral effusions"],
    a: 0,
    r: "The combination of progressive dyspnea, bibasilar Velcro crackles, digital clubbing, and HRCT showing basilar-predominant reticular pattern with honeycombing and traction bronchiectasis constitutes a definite usual interstitial pneumonia (UIP) pattern, which is pathognomonic for IPF when secondary causes are excluded. This pattern is sufficient for diagnosis without surgical lung biopsy per ATS/ERS guidelines. Hypersensitivity pneumonitis typically shows upper/mid-zone predominance with air trapping. Sarcoidosis shows upper-zone predominance with lymphadenopathy. CHF shows cardiomegaly, effusions, and septal thickening rather than honeycombing.",
    s: "Respiratory"
  },
  {
    q: "A 25-year-old female presents with recurrent oral ulcers, genital ulcers, and anterior uveitis. She also reports tender erythematous nodules on her shins. She is of Turkish descent. Pathergy test is positive. What is the most likely diagnosis?",
    o: ["Behcet disease", "Systemic lupus erythematosus", "Reactive arthritis (Reiter syndrome)", "Herpes simplex virus infection"],
    a: 0,
    r: "Behcet disease is a systemic vasculitis characterized by the triad of recurrent oral ulcers, genital ulcers, and uveitis. Additional features include erythema nodosum, skin lesions, and a positive pathergy test (exaggerated skin response to minor trauma). It is most prevalent along the ancient Silk Road (Turkey, Iran, Japan). SLE can cause oral ulcers but not typically genital ulcers or positive pathergy. Reactive arthritis involves urethritis, conjunctivitis, and arthritis. HSV causes vesicular lesions that ulcerate but does not cause uveitis or erythema nodosum.",
    s: "Dermatology"
  },
  {
    q: "A 48-year-old male with a history of alcohol use disorder presents with hematemesis. Upper endoscopy reveals large esophageal varices with active bleeding. After initial hemodynamic stabilization, which medication should be administered immediately?",
    o: ["Octreotide IV bolus followed by continuous infusion to reduce portal pressure and variceal bleeding", "Propranolol 40 mg orally to reduce portal hypertension", "Vasopressin IV infusion without nitroglycerin", "Tranexamic acid IV for hemostasis"],
    a: 0,
    r: "Octreotide (a somatostatin analog) reduces splanchnic blood flow and portal pressure, decreasing variceal bleeding. It should be started immediately and continued for 3-5 days alongside endoscopic band ligation. IV antibiotics (ceftriaxone) should also be given as prophylaxis. Propranolol is for primary and secondary prophylaxis, not acute bleeding management, and should not be given during hemodynamic instability. Vasopressin alone has significant side effects (cardiac and mesenteric ischemia) and has been largely replaced by octreotide. Tranexamic acid has not shown benefit in variceal bleeding and may increase thromboembolic risk.",
    s: "GI"
  },
  {
    q: "A 60-year-old female with a history of breast cancer treated with lumpectomy and radiation 5 years ago presents for routine follow-up. She is on tamoxifen. She reports new irregular vaginal bleeding for the past month. What is the most appropriate initial evaluation?",
    o: ["Transvaginal ultrasound to measure endometrial thickness followed by endometrial biopsy if thickened", "Reassure that irregular bleeding is a common side effect of tamoxifen", "Switch tamoxifen to an aromatase inhibitor without further evaluation", "Perform a Pap smear to evaluate the cervix"],
    a: 0,
    r: "Tamoxifen acts as an estrogen agonist on the endometrium, increasing the risk of endometrial hyperplasia, polyps, and endometrial carcinoma (2-7 fold). Any new vaginal bleeding in a patient on tamoxifen requires prompt evaluation with transvaginal ultrasound and endometrial biopsy. While some irregular bleeding may occur with tamoxifen, assuming it is benign without evaluation is dangerous. Switching to an aromatase inhibitor may be appropriate after evaluation but does not address the current concern. Pap smear evaluates the cervix, not the endometrium.",
    s: "Reproductive"
  },
  {
    q: "A 14-year-old male presents with knee pain and swelling after a football injury. He reports hearing a 'pop' at the time of injury. Physical examination reveals a positive Lachman test and pivot shift test. MRI confirms a complete anterior cruciate ligament tear. What is the most appropriate management recommendation?",
    o: ["ACL reconstruction surgery after a period of prehabilitation, given his age, activity level, and risk of secondary meniscal injury with conservative management", "Hinged knee brace and physical therapy alone with return to sports in 6 weeks", "Immobilization in a long leg cast for 8 weeks", "Activity modification and observation until skeletal maturity before surgical consideration"],
    a: 0,
    r: "In skeletally immature athletes with complete ACL tears, current evidence supports early ACL reconstruction (using physeal-sparing or physeal-respecting techniques) rather than delayed treatment. Studies show that delaying reconstruction in active adolescents results in high rates of secondary meniscal tears and chondral injuries (up to 75% at 1 year), which worsen long-term outcomes. Brace and PT alone do not restore functional stability in complete tears for young athletes. Cast immobilization causes muscle atrophy without healing the ligament. Waiting until skeletal maturity risks irreversible joint damage.",
    s: "Musculoskeletal"
  },
  {
    q: "A 55-year-old male with schizophrenia managed on clozapine presents for routine monitoring. His recent ANC is 1,200/mm³, down from 2,100/mm³ last month. He has been stable on clozapine for 3 years with no psychotic symptoms. What is the most appropriate action?",
    o: ["Continue clozapine but increase ANC monitoring frequency to three times weekly as this falls in the 'yellow alert' range", "Discontinue clozapine immediately and switch to haloperidol", "Continue current monitoring schedule as ANC is above 1,000", "Hold clozapine, administer filgrastim, and resume when ANC normalizes"],
    a: 0,
    r: "Per the Clozapine REMS program, an ANC of 1,000-1,499/mm³ constitutes a 'yellow alert' (mild neutropenia) requiring increased monitoring to three times weekly while continuing clozapine. Clozapine is discontinued only when ANC falls below 1,000 (moderate neutropenia/red alert) in the general population or below 500 in patients with benign ethnic neutropenia. Given this patient's stability on clozapine for 3 years, maintaining treatment with enhanced surveillance is appropriate. Abrupt discontinuation risks severe psychotic relapse. Filgrastim is considered if ANC continues to decline toward the red alert threshold.",
    s: "Mental Health"
  }
];
