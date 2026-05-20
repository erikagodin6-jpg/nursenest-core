import type { ExamQuestion } from "./types";

export const cnpleBatch02Questions: ExamQuestion[] = [
  {
    q: "A 68-year-old male with a history of atrial fibrillation, hypertension, and diabetes presents for anticoagulation review. He is currently on warfarin with a time in therapeutic range of 45% over the past 6 months. His CHA2DS2-VASc score is 4. Renal function is normal (eGFR 78). What medication change should the NP consider?",
    o: ["Switch to a direct oral anticoagulant (DOAC) such as apixaban or rivaroxaban, as DOACs are preferred over warfarin in non-valvular AF with poor TTR", "Increase warfarin dose and recheck INR weekly", "Discontinue anticoagulation and start ASA 81 mg daily", "Add clopidogrel to the current warfarin regimen"],
    a: 0,
    r: "CCS atrial fibrillation guidelines recommend DOACs over warfarin for most patients with non-valvular AF due to superior efficacy, safety, and convenience. A TTR of 45% (target >65-70%) indicates poor warfarin control, increasing both bleeding and thromboembolic risk. With a CHA2DS2-VASc of 4 (high stroke risk) and normal renal function, switching to a DOAC is appropriate. Simply increasing warfarin dose without addressing the underlying TTR issue is insufficient. ASA alone is inadequate for high stroke risk. Adding clopidogrel to warfarin dramatically increases bleeding without adequate stroke prevention.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old female presents with progressive difficulty swallowing both solids and liquids over the past 6 months. She reports regurgitation of undigested food, nocturnal cough, and 5 kg weight loss. A barium swallow shows a dilated oesophagus with a bird-beak appearance at the gastroesophageal junction. What is the most likely diagnosis?",
    o: ["Achalasia, characterised by failure of the lower oesophageal sphincter to relax and absent oesophageal peristalsis", "Gastroesophageal reflux disease", "Oesophageal carcinoma", "Oesophageal stricture from chronic acid exposure"],
    a: 0,
    r: "The bird-beak appearance on barium swallow (smooth tapering of the distal oesophagus with proximal dilation) is pathognomonic for achalasia. Progressive dysphagia to both solids AND liquids simultaneously suggests a motility disorder rather than mechanical obstruction (which typically progresses from solids to liquids). Regurgitation of undigested food occurs because food sits in the dilated oesophagus without passage. GERD causes heartburn predominantly. Oesophageal carcinoma causes progressive dysphagia from solids to liquids with an irregular stricture on imaging. Peptic strictures cause solid dysphagia with a smooth concentric narrowing.",
    s: "GI"
  },
  {
    q: "A 35-year-old male presents with a 3-day history of painful swelling of the right knee. He had unprotected sexual intercourse 2 weeks ago. On examination, the knee is warm, erythematous, with a large effusion. He has a temperature of 38.4°C and a pustular rash on his hands. What is the most important initial investigation?",
    o: ["Arthrocentesis of the knee for synovial fluid analysis (cell count, Gram stain, culture, crystal analysis) to differentiate septic arthritis from other causes", "Start empiric antibiotics without joint aspiration", "X-ray of the knee as the sole investigation", "Blood cultures only and treat empirically for gout"],
    a: 0,
    r: "Acute monoarthritis with fever and risk factors for sexually transmitted infection (unprotected sex, pustular rash suggesting disseminated gonococcal infection) requires urgent arthrocentesis. Synovial fluid analysis differentiates septic arthritis (WBC >50,000/µL, positive Gram stain/culture), crystal arthropathy (monosodium urate or CPPD crystals), and reactive arthritis. Gonococcal arthritis may have lower WBC counts and often negative Gram stain, but synovial fluid culture and PCR are essential. Starting antibiotics without aspiration may sterilise the fluid and delay diagnosis. X-ray shows only soft tissue swelling acutely. Blood cultures alone are insufficient as gonococcal bacteraemia is often intermittent.",
    s: "Musculoskeletal"
  },
  {
    q: "A 58-year-old female with type 2 diabetes presents with a painless ulcer on the plantar surface of her right foot under the first metatarsal head. She has a history of peripheral neuropathy with loss of protective sensation. The ulcer is 2 cm in diameter, extends to subcutaneous tissue, and has a clean granulating base without purulence. Pedal pulses are palpable. What is the most critical component of management?",
    o: ["Offloading the affected foot with a total contact cast or removable cast walker to eliminate pressure on the ulcer, along with wound care and glycaemic optimization", "Oral antibiotics for 14 days to prevent infection", "Surgical debridement under general anaesthesia", "Refer for hyperbaric oxygen therapy as first-line treatment"],
    a: 0,
    r: "Offloading is the single most important intervention for neuropathic diabetic foot ulcers. The ulcer is caused by repetitive mechanical stress on an insensate foot. Without pressure relief, wound healing cannot occur regardless of other interventions. Total contact casting is the gold standard, providing consistent pressure redistribution. Good wound care (moist wound healing, regular debridement of callus) and glycaemic optimization support healing. Antibiotics are not indicated without clinical signs of infection. Sharp debridement can be done at bedside. Hyperbaric oxygen may be considered for refractory wounds but is not first-line.",
    s: "Endocrine"
  },
  {
    q: "A 50-year-old male presents with a 4-week history of persistent cough, haemoptysis, and unintentional weight loss of 6 kg. He has a 35-pack-year smoking history. Chest X-ray shows a 3.5 cm spiculated mass in the right upper lobe with ipsilateral hilar lymphadenopathy. What is the most appropriate next step?",
    o: ["CT chest with contrast and referral for tissue biopsy (CT-guided or bronchoscopic) for histological diagnosis and staging", "Repeat chest X-ray in 3 months to assess for change", "Start empiric antibiotics for presumed pneumonia", "PET scan as the sole diagnostic investigation"],
    a: 0,
    r: "A spiculated mass with hilar lymphadenopathy in a heavy smoker with haemoptysis and weight loss is highly suspicious for lung carcinoma until proven otherwise. Urgent CT chest with contrast provides detailed characterisation and initial staging. Tissue diagnosis through CT-guided percutaneous biopsy or bronchoscopy with biopsy is essential for histological typing (NSCLC vs SCLC) and molecular testing to guide treatment. Watching and waiting with repeat imaging delays diagnosis of a likely malignancy. Antibiotics would be inappropriate as treatment for a spiculated mass. PET scan is used for staging after tissue diagnosis is obtained, not as the sole investigation.",
    s: "Respiratory"
  },
  {
    q: "A 42-year-old female presents with a 2-month history of watery diarrhoea, abdominal cramps, and 4 kg weight loss. She has a palpable goitre, tremor, lid lag, and tachycardia at rest (HR 104). TSH is <0.01 mIU/L, free T4 is 48 pmol/L (normal 12-22), and free T3 is 12.8 pmol/L (normal 3.1-6.8). What additional test helps confirm the underlying aetiology?",
    o: ["TSH receptor antibodies (TRAb) to confirm Graves disease as the cause of thyrotoxicosis", "Anti-TPO antibodies to confirm Hashimoto thyroiditis", "Thyroglobulin level to assess for thyroid cancer", "24-hour urinary iodine excretion"],
    a: 0,
    r: "The presentation is thyrotoxicosis (suppressed TSH, elevated free T4 and T3) with goitre, likely Graves disease. TRAb (thyroid-stimulating immunoglobulins) are pathognomonic for Graves disease, being positive in >95% of cases. They confirm autoimmune aetiology and help distinguish Graves from other causes of thyrotoxicosis (toxic multinodular goitre, thyroiditis). Anti-TPO antibodies are present in both Graves and Hashimoto and do not differentiate between them. Thyroglobulin is a tumour marker for differentiated thyroid cancer follow-up. Urinary iodine assesses iodine status, not the aetiology of thyrotoxicosis.",
    s: "Endocrine"
  },
  {
    q: "A 42-year-old female diagnosed with Graves disease is being started on antithyroid medication. She is not pregnant and has no drug allergies. What is the most important counselling point regarding methimazole therapy?",
    o: ["Report sore throat, fever, or mouth ulcers immediately as these may indicate agranulocytosis, a rare but potentially fatal adverse effect", "Expect permanent weight gain as a side effect of the medication", "The medication works within 24 hours and symptoms should resolve immediately", "Blood monitoring is never required once the dose is established"],
    a: 0,
    r: "Agranulocytosis is the most serious adverse effect of methimazole (and propylthiouracil), occurring in approximately 0.2-0.5% of patients, usually within the first 3 months. Patients must be counselled to seek immediate medical attention if they develop sore throat, fever, or mouth ulcers, and to have an urgent CBC performed. This is potentially fatal if unrecognised. Weight change reflects normalising metabolism. Methimazole takes 4-8 weeks for full effect as it blocks new hormone synthesis but does not affect preformed hormone. Regular CBC and liver function monitoring is recommended, especially in the first 3 months.",
    s: "Pharmacology"
  },
  {
    q: "A 55-year-old male presents with a 3-month history of progressive numbness and tingling in a stocking-and-glove distribution, difficulty with fine motor tasks, and unsteady gait. He has a history of heavy alcohol use and a diet poor in fruits and vegetables. CBC shows MCV of 112 fL. What vitamin deficiency should be investigated first?",
    o: ["Vitamin B12 (cobalamin) deficiency, which causes peripheral neuropathy, subacute combined degeneration of the spinal cord, and macrocytic anaemia", "Vitamin D deficiency", "Vitamin C deficiency (scurvy)", "Vitamin A deficiency"],
    a: 0,
    r: "Peripheral neuropathy in a stocking-and-glove distribution with macrocytosis (MCV 112 fL) in a patient with heavy alcohol use and poor diet strongly suggests vitamin B12 deficiency. B12 deficiency causes demyelination of peripheral nerves and posterior/lateral columns of the spinal cord (subacute combined degeneration), manifesting as peripheral neuropathy, sensory ataxia, and potential cognitive changes. Folate deficiency can also cause macrocytic anaemia but less commonly causes neurological disease. Vitamin D deficiency causes bone pain and muscle weakness. Vitamin C deficiency causes bleeding gums and petechiae. Vitamin A deficiency causes night blindness.",
    s: "Neurological"
  },
  {
    q: "A 30-year-old female presents with a 5 mm dark brown, asymmetric mole on her left calf that she reports has changed in colour and size over 3 months. The lesion has irregular borders, colour variation (brown, black, and reddish areas), and is slightly raised. What is the most appropriate management?",
    o: ["Urgent referral for excisional biopsy of the entire lesion with narrow margins for histopathological evaluation to rule out melanoma", "Photograph the lesion and reassess in 6 months", "Shave biopsy for cosmetic removal", "Cryotherapy to destroy the lesion"],
    a: 0,
    r: "This lesion meets multiple ABCDE criteria for melanoma: Asymmetry, Border irregularity, Colour variation, Diameter ≥6 mm (approaching at 5 mm), and Evolution (change over time). Urgent excisional biopsy with 1-2 mm clinical margins is the standard of care to obtain a complete histopathological specimen for accurate diagnosis and Breslow thickness measurement. Delaying with observation risks progression of a potential melanoma. Shave biopsy may transect the lesion, preventing accurate depth measurement. Cryotherapy destroys tissue without histological examination, making melanoma diagnosis impossible.",
    s: "Dermatology"
  },
  {
    q: "A 65-year-old female presents with a sudden onset of painless vision loss in her right eye described as a curtain falling over her vision from above. She has a history of hypertension, atrial fibrillation (not anticoagulated), and carotid artery stenosis. On fundoscopy, the right retina appears pale with a cherry-red spot at the macula. What is the most likely diagnosis?",
    o: ["Central retinal artery occlusion, an ophthalmic emergency requiring immediate referral", "Central retinal vein occlusion", "Acute angle-closure glaucoma", "Vitreous haemorrhage"],
    a: 0,
    r: "Sudden painless vision loss with a pale retina and cherry-red macula on fundoscopy is pathognomonic for central retinal artery occlusion (CRAO). The cherry-red spot represents the fovea, which receives its blood supply from the underlying choroidal circulation while the surrounding retina is ischaemic (pale). This is an ophthalmic emergency with a narrow treatment window (<4-6 hours). Risk factors include AF (cardioembolism), carotid stenosis, and hypertension. Central retinal vein occlusion presents with diffuse retinal haemorrhages. Acute angle-closure glaucoma causes painful vision loss with a mid-dilated pupil. Vitreous haemorrhage causes painless vision loss but with obscured fundus view.",
    s: "Neurological"
  },
  {
    q: "A 48-year-old male presents with recurrent episodes of intense fear, palpitations, diaphoresis, chest tightness, and a feeling of impending doom lasting 10-15 minutes. Episodes occur without warning, 2-3 times per week for the past month. Between episodes, he worries constantly about having another attack and avoids crowded places. Medical workup including ECG, thyroid function, and toxicology screen are normal. What is the most likely diagnosis?",
    o: ["Panic disorder with agoraphobia, given recurrent unexpected panic attacks with persistent worry and avoidance behaviour", "Generalised anxiety disorder", "Social anxiety disorder", "Post-traumatic stress disorder"],
    a: 0,
    r: "Recurrent unexpected panic attacks (discrete episodes of intense fear with physical symptoms peaking within minutes) with persistent worry about future attacks and avoidance behaviour (avoiding crowded places) meet DSM-5 criteria for panic disorder with agoraphobia. The attacks are unexpected (not triggered by a specific situation), which distinguishes panic disorder from phobias. GAD involves chronic excessive worry about multiple domains without discrete panic attacks. Social anxiety disorder involves fear specifically of social situations. PTSD requires a traumatic event with re-experiencing, avoidance, and hyperarousal symptoms.",
    s: "Mental Health"
  },
  {
    q: "A 48-year-old male diagnosed with panic disorder with agoraphobia asks about treatment options. He prefers medication and is willing to try psychotherapy. What is the most appropriate initial treatment plan?",
    o: ["SSRI (sertraline or escitalopram) as first-line pharmacotherapy combined with cognitive behavioural therapy, which has the strongest evidence for panic disorder", "Benzodiazepine monotherapy (alprazolam TID) as first-line treatment", "Beta-blocker (propranolol) as primary treatment for panic disorder", "Buspirone as first-line pharmacotherapy"],
    a: 0,
    r: "SSRIs are first-line pharmacotherapy for panic disorder per CANMAT and APA guidelines, with sertraline, escitalopram, paroxetine, and fluoxetine having the strongest evidence. CBT (particularly exposure-based and cognitive restructuring) is the first-line psychotherapy. Combined SSRI + CBT has superior outcomes compared to either alone. Benzodiazepines provide rapid relief but carry dependence risk, are not disease-modifying, and should not be used as monotherapy long-term. Beta-blockers help performance anxiety but are not effective for panic disorder. Buspirone is effective for GAD but not panic disorder.",
    s: "Mental Health"
  },
  {
    q: "A 25-year-old male presents after a motor vehicle collision with pain and swelling of his right wrist. X-ray reveals a fracture of the scaphoid bone. The NP applies a thumb spica cast. What complication is the patient most at risk for, and what follow-up is essential?",
    o: ["Avascular necrosis of the proximal pole due to the scaphoid's retrograde blood supply; follow-up imaging in 10-14 days is essential as initial X-rays may miss non-displaced fractures", "Compartment syndrome of the forearm", "Fat embolism syndrome", "Immediate need for surgical fixation in all cases"],
    a: 0,
    r: "The scaphoid bone receives its blood supply in a retrograde fashion from distal to proximal, making the proximal pole vulnerable to avascular necrosis (AVN) following fracture (risk ~13-50% for proximal pole fractures). Follow-up imaging (repeat X-ray or MRI) at 10-14 days is critical because initial radiographs may appear normal even with a fracture (up to 20% of scaphoid fractures are occult on initial X-ray). Non-union is another significant complication. Compartment syndrome is associated with forearm fractures, not isolated scaphoid fractures. Fat embolism occurs with long bone fractures. Many scaphoid fractures heal with immobilisation alone.",
    s: "Musculoskeletal"
  },
  {
    q: "A 62-year-old female with rheumatoid arthritis on methotrexate 15 mg weekly presents for routine monitoring. Her labs show ALT 88 U/L (normal <35), AST 72 U/L (normal <35), and CBC is normal. She reports no alcohol use. What is the most appropriate action?",
    o: ["Hold methotrexate, recheck liver enzymes in 2-4 weeks, and consider dose reduction or alternative DMARD if transaminases remain persistently elevated above 2-3 times the upper limit of normal", "Continue methotrexate at the current dose as mild elevations are expected", "Immediately discontinue methotrexate permanently and never rechallenge", "Order a liver biopsy before making any medication changes"],
    a: 0,
    r: "Methotrexate-induced hepatotoxicity requires monitoring. ALT/AST elevations to 2-3× ULN (as in this case) warrant holding the drug, rechecking in 2-4 weeks, and considering dose reduction. ACR/CRA guidelines recommend holding methotrexate if transaminases are persistently >2× ULN and discontinuing if >3× ULN on repeated testing. Continuing without addressing the elevation risks progressive hepatic fibrosis. Permanent discontinuation is premature for a first episode of moderate elevation without signs of liver failure. Liver biopsy is reserved for persistently abnormal results despite dose modification or when fibrosis is suspected after prolonged therapy.",
    s: "Pharmacology"
  },
  {
    q: "A 40-year-old female presents with a chief complaint of fatigue and pallor. CBC reveals Hb 98 g/L, MCV 72 fL, ferritin 8 µg/L, TIBC elevated. Peripheral smear shows microcytic hypochromic red cells. She has heavy menstrual periods. What is the most likely diagnosis and initial treatment?",
    o: ["Iron deficiency anaemia secondary to menorrhagia; treat with oral ferrous sulfate 300 mg daily and investigate the cause of heavy menstrual bleeding", "Thalassaemia trait requiring no treatment", "Anaemia of chronic disease requiring erythropoietin", "Vitamin B12 deficiency anaemia requiring intramuscular injections"],
    a: 0,
    r: "Microcytic anaemia (MCV 72 fL) with low ferritin (most specific marker for iron deficiency), elevated TIBC, and hypochromic red cells confirms iron deficiency anaemia. Heavy menstrual bleeding is the most common cause in premenopausal women. Treatment is oral iron supplementation (ferrous sulfate 300 mg daily provides ~60 mg elemental iron) taken on an empty stomach with vitamin C to enhance absorption. The underlying cause (menorrhagia) must also be investigated and managed. Thalassaemia trait has normal or elevated ferritin. Anaemia of chronic disease has low TIBC and normal/elevated ferritin. B12 deficiency causes macrocytic (not microcytic) anaemia.",
    s: "Hematology"
  },
  {
    q: "A 58-year-old male with a history of gout presents with his fourth flare in the past 12 months. His last uric acid level was 540 µmol/L. He has stage 2 CKD (eGFR 72). He is currently not on urate-lowering therapy. When should urate-lowering therapy be initiated?",
    o: ["Initiate allopurinol during or shortly after the acute flare has been treated, given the frequency of attacks (≥2/year) and elevated uric acid, with concurrent anti-inflammatory prophylaxis", "Wait until 6 months after the last flare before starting ULT", "Only start ULT if uric acid exceeds 600 µmol/L", "ULT is contraindicated in patients with CKD"],
    a: 0,
    r: "Current ACR/CRA guidelines recommend initiating ULT for patients with ≥2 gout flares per year, tophi, or urate-related renal disease. The traditional practice of waiting weeks after a flare to start ULT has been updated; allopurinol can be safely initiated during an acute flare when paired with anti-inflammatory prophylaxis (low-dose colchicine for 3-6 months). The target uric acid is <360 µmol/L (or <300 µmol/L for tophaceous gout). Allopurinol should be started at a low dose (100 mg, or 50 mg in CKD) and titrated to target. ULT is not contraindicated in CKD; dose adjustment is required, and allopurinol is safe with appropriate titration.",
    s: "Musculoskeletal"
  },
  {
    q: "A 70-year-old female with well-controlled hypertension and type 2 diabetes presents for bone health assessment. She is postmenopausal (age of menopause 52). She has never had a fracture. BMI is 22. She takes calcium and vitamin D supplements. What is the most appropriate screening investigation?",
    o: ["Dual-energy X-ray absorptiometry (DXA) scan, as it is recommended for all women aged 65 and older, and for postmenopausal women with risk factors", "No screening needed until age 75", "CT scan of the spine for vertebral assessment", "Serum calcium and phosphate levels as the sole screening"],
    a: 0,
    r: "Osteoporosis Canada and CTFPHC guidelines recommend DXA screening for all women aged 65 and older, and for postmenopausal women under 65 with risk factors. This 70-year-old postmenopausal woman meets age-based screening criteria. DXA measures bone mineral density at the hip and lumbar spine, providing T-scores for diagnosis (osteoporosis T-score ≤-2.5) and fracture risk assessment. Delaying to age 75 misses intervention opportunities. CT provides vertebral fracture assessment but not standardised BMD measurement. Serum calcium and phosphate are typically normal in primary osteoporosis and do not screen for bone density.",
    s: "Musculoskeletal"
  },
  {
    q: "A 32-year-old male presents to the NP clinic with acute right flank pain radiating to the groin, nausea, and haematuria. He is writhing in pain and unable to find a comfortable position. Vital signs: T 36.8°C, HR 98, BP 142/88. What is the most appropriate initial investigation and management?",
    o: ["Urinalysis, serum creatinine, and non-contrast CT of the abdomen/pelvis to confirm ureteral calculus; manage pain with ketorolac or diclofenac as first-line analgesic", "IV morphine only and discharge without imaging", "Abdominal ultrasound as the sole diagnostic test", "Start empiric antibiotics for pyelonephritis"],
    a: 0,
    r: "The presentation is classic for acute ureteral colic: sudden severe colicky flank pain radiating to the groin, nausea, haematuria, and restlessness. Non-contrast CT abdomen/pelvis is the gold-standard investigation (sensitivity >95%) for urolithiasis, identifying stone size, location, and complications (hydronephrosis, hydroureter). NSAIDs (ketorolac IM/IV or diclofenac) are superior to opioids as first-line analgesia for renal colic per evidence-based guidelines. Pain management without diagnosis is incomplete. Ultrasound has lower sensitivity for ureteral stones. The patient is afebrile with no systemic signs of infection, making pyelonephritis less likely.",
    s: "Renal"
  },
  {
    q: "An 18-year-old female presents to the NP with a 3-day history of vaginal discharge that is yellow-green, malodorous, and frothy. She reports dysuria and post-coital bleeding. She is sexually active with a new partner and uses no barrier contraception. Speculum examination reveals a strawberry cervix. What is the most likely diagnosis?",
    o: ["Trichomoniasis, characterised by the frothy yellow-green discharge, strawberry cervix (colpitis macularis), and dysuria", "Bacterial vaginosis", "Vulvovaginal candidiasis", "Chlamydial cervicitis"],
    a: 0,
    r: "Frothy yellow-green malodorous vaginal discharge with strawberry cervix (punctate haemorrhages on the cervix, also called colpitis macularis) is pathognomonic for Trichomonas vaginalis infection. Trichomoniasis is an STI caused by a flagellated protozoan. Diagnosis is confirmed by wet mount (motile trichomonads), NAAT, or rapid antigen test. Treatment is metronidazole 500 mg BID for 7 days (or single 2 g dose), with partner treatment. Bacterial vaginosis causes thin grey homogeneous discharge with fishy odour but no cervical findings. Candidiasis causes thick white cottage-cheese discharge with pruritus. Chlamydia is often asymptomatic or causes mucopurulent cervical discharge.",
    s: "Infectious Disease"
  },
  {
    q: "A 55-year-old male with chronic hepatitis C (genotype 1a, no cirrhosis) presents for treatment discussion. His viral load is 2.4 million IU/mL. He has no contraindications to direct-acting antiviral therapy. eGFR is 85. What is the recommended treatment approach?",
    o: ["Direct-acting antiviral therapy such as sofosbuvir/velpatasvir (pan-genotypic) for 12 weeks, which achieves sustained virological response in >95% of patients", "Pegylated interferon and ribavirin for 48 weeks", "Liver biopsy before any treatment decision can be made", "No treatment as he has no cirrhosis and should be monitored only"],
    a: 0,
    r: "Current hepatitis C treatment has been revolutionised by direct-acting antivirals. Pan-genotypic regimens like sofosbuvir/velpatasvir for 12 weeks achieve SVR (cure) rates >95% across all genotypes, are well-tolerated, and are recommended by CASL and AASLD guidelines for treatment-naïve patients without cirrhosis. Pegylated interferon/ribavirin is obsolete due to inferior efficacy, prolonged duration, and significant side effects. Liver biopsy is no longer required to determine treatment eligibility; non-invasive fibrosis assessment (FibroScan, APRI, FIB-4) is sufficient. Current guidelines recommend treating all patients with chronic HCV regardless of fibrosis stage to prevent progression and transmission.",
    s: "GI"
  },
  {
    q: "A 6-year-old female is brought to the clinic with a 4-day history of periorbital oedema, generalised oedema, and decreased urine output. She had a viral upper respiratory infection 2 weeks ago. Urinalysis shows 4+ protein, no blood, and no casts. Serum albumin is 18 g/L. Cholesterol is 9.2 mmol/L. Renal function is normal. What is the most likely diagnosis?",
    o: ["Minimal change disease presenting as nephrotic syndrome, the most common cause of nephrotic syndrome in children aged 1-10 years", "Post-streptococcal glomerulonephritis", "IgA nephropathy", "Membranous nephropathy"],
    a: 0,
    r: "Nephrotic syndrome (heavy proteinuria, hypoalbuminaemia, hyperlipidaemia, oedema) in a child aged 1-10 years is most commonly caused by minimal change disease (approximately 80% of cases). The absence of haematuria and casts is characteristic. Post-streptococcal glomerulonephritis presents with nephritic syndrome (haematuria, hypertension, oliguria, mild proteinuria). IgA nephropathy typically presents with gross haematuria. Membranous nephropathy is the most common cause of nephrotic syndrome in adults, not children. Initial treatment is empiric corticosteroids (prednisone) without biopsy, as >90% of children with MCD respond to steroids.",
    s: "Renal"
  },
  {
    q: "A 44-year-old female with HIV (CD4 350, viral load 45,000 copies/mL) presents to discuss antiretroviral therapy initiation. She has no significant comorbidities and no known drug allergies. Hepatitis B serology shows chronic HBV co-infection (HBsAg positive). What consideration is most critical when selecting her ART regimen?",
    o: ["The ART regimen must include tenofovir (TDF or TAF) plus emtricitabine (FTC) or lamivudine (3TC) as the NRTI backbone, as these agents have dual activity against both HIV and HBV", "HBV co-infection does not influence ART selection", "Treat HBV first with entecavir before starting ART", "Avoid all NRTIs due to risk of hepatic flare"],
    a: 0,
    r: "In HIV-HBV co-infection, the ART regimen must include agents active against both viruses. Tenofovir (TDF or TAF) combined with emtricitabine or lamivudine provides dual HIV and HBV suppression. Discontinuing or omitting HBV-active agents risks severe hepatic flares from HBV reactivation (immune reconstitution hepatitis). Canadian HIV guidelines recommend initiating ART for all people living with HIV regardless of CD4 count, and HBV co-infection influences NRTI backbone selection. Treating HBV separately is unnecessary when ART includes dual-active agents. NRTIs are not avoided; specific NRTIs are deliberately chosen for their HBV activity.",
    s: "Infectious Disease"
  },
  {
    q: "A 38-year-old female presents with a progressively enlarging, well-circumscribed, rubbery, mobile 2.5 cm breast mass. Ultrasound shows a solid, homogeneous, well-defined oval mass with smooth margins. She has no family history of breast cancer. What is the most likely diagnosis?",
    o: ["Fibroadenoma, the most common benign solid breast mass in women under 40, characterised by well-defined borders and mobility on palpation", "Invasive ductal carcinoma", "Phyllodes tumour", "Breast cyst"],
    a: 0,
    r: "A well-circumscribed, mobile, rubbery solid mass in a woman under 40 with smooth margins on ultrasound is characteristic of a fibroadenoma. Fibroadenomas are the most common benign breast tumour in young women, composed of stromal and epithelial tissue. They are classically described as having a rubbery consistency and being highly mobile (breast mouse). Invasive ductal carcinoma typically presents as a hard, irregular, fixed mass with ill-defined margins. Phyllodes tumours are rare and typically larger with rapid growth. Breast cysts are fluid-filled and appear anechoic on ultrasound, not solid.",
    s: "Reproductive"
  },
  {
    q: "A 60-year-old male with a 20-year history of type 2 diabetes and diabetic retinopathy presents with bilateral lower extremity oedema and blood pressure of 154/96. Urine ACR is 85 mg/mmol. eGFR is 34 mL/min (CKD stage 3b). Current medications include ramipril 10 mg daily, amlodipine 10 mg daily, metformin 500 mg BID, and insulin glargine 30 units at bedtime. What additional medication should be started for renal protection?",
    o: ["Dapagliflozin or empagliflozin (SGLT2 inhibitor), which has demonstrated slowing of CKD progression and reduction of cardiovascular events in patients with diabetic kidney disease on top of maximised RAAS inhibition", "Aliskiren added to the ACE inhibitor for dual RAAS blockade", "Furosemide 40 mg daily for oedema management only", "Lisinopril to replace ramipril as a stronger ACE inhibitor"],
    a: 0,
    r: "SGLT2 inhibitors (dapagliflozin, empagliflozin) have demonstrated significant renal protection in landmark trials (DAPA-CKD, EMPA-KIDNEY, CREDENCE) in patients with diabetic kidney disease, reducing the composite outcome of sustained eGFR decline, kidney failure, and renal or cardiovascular death. They can be initiated down to eGFR 20-25 and continued until dialysis. Adding an SGLT2 inhibitor to maximised ACEi provides additive renal protection through tubuloglomerular feedback mechanism. Dual RAAS blockade (ACEi + DRI) is contraindicated (ALTITUDE trial: increased adverse events). Furosemide manages symptoms but does not slow CKD progression. Switching between ACEi agents provides no additional benefit.",
    s: "Renal"
  },
  {
    q: "A 50-year-old female presents with a 6-month history of progressive bilateral hand stiffness and pain in the distal interphalangeal joints. Examination reveals bony enlargement (Heberden nodes) at the DIPs bilaterally. There is no warmth, erythema, or synovial thickening. Hand X-ray shows joint space narrowing, osteophytes, and subchondral sclerosis at the DIPs. ESR and CRP are normal. What is the diagnosis?",
    o: ["Nodal osteoarthritis of the hands, characterised by Heberden nodes at the DIPs, bony enlargement without inflammatory signs, and typical radiographic findings", "Rheumatoid arthritis of the hands", "Psoriatic arthritis", "Erosive inflammatory osteoarthritis"],
    a: 0,
    r: "Heberden nodes (bony enlargements at DIPs) with radiographic osteoarthritis features (joint space narrowing, osteophytes, subchondral sclerosis) and normal inflammatory markers confirm nodal osteoarthritis. OA characteristically affects DIPs (Heberden) and PIPs (Bouchard) with bony, non-inflammatory enlargement. Rheumatoid arthritis affects MCPs and PIPs symmetrically with soft tissue synovial swelling, elevated inflammatory markers, and erosions. Psoriatic arthritis can affect DIPs but presents with dactylitis, enthesitis, and often skin/nail psoriasis. Erosive inflammatory OA shows central erosions with a gull-wing pattern on X-ray and inflammatory episodes.",
    s: "Musculoskeletal"
  },
  {
    q: "A 28-year-old male presents with a 2-day history of severe headache, neck stiffness, photophobia, and fever of 39.4°C. He has no rash. Kernig sign is positive. The NP suspects bacterial meningitis. What is the most critical immediate action?",
    o: ["Administer empiric IV antibiotics (ceftriaxone plus vancomycin) immediately without delaying for lumbar puncture or imaging if CT is required first", "Perform lumbar puncture before any antibiotic administration", "Order a CT head before any other intervention", "Start oral amoxicillin and discharge with follow-up in 24 hours"],
    a: 0,
    r: "Suspected bacterial meningitis is a medical emergency where every hour of delay in antibiotic administration increases mortality. If LP can be performed immediately, blood cultures and LP should be done followed by immediate antibiotics. However, if CT is required first (focal neurological deficits, papilloedema, altered consciousness, immunocompromise), antibiotics must be given BEFORE CT and LP. Empiric therapy for adults 18-50: ceftriaxone 2 g IV q12h + vancomycin (for MRSA and penicillin-resistant pneumococcus). Delaying antibiotics for any investigation is inappropriate. Oral antibiotics are completely inadequate for bacterial meningitis.",
    s: "Infectious Disease"
  },
  {
    q: "A 72-year-old female with moderate dementia and recurrent falls is prescribed quetiapine 25 mg at bedtime by a previous provider for insomnia. She presents with a new prescription request. According to the Beers Criteria and Canadian guidelines, what should the NP recommend?",
    o: ["Deprescribe quetiapine as antipsychotics are associated with increased mortality in elderly patients with dementia and are inappropriate for insomnia; implement non-pharmacological sleep hygiene interventions", "Continue quetiapine and increase to 50 mg for better sleep", "Switch to a long-acting benzodiazepine for insomnia", "Add trazodone 50 mg to the quetiapine for synergistic sleep benefit"],
    a: 0,
    r: "Antipsychotics carry a Health Canada/FDA black box warning for increased mortality (1.6-1.7× risk) in elderly patients with dementia, primarily from cerebrovascular events and infections. Using quetiapine for insomnia in this population is inappropriate per Beers Criteria, STOPP criteria, and Canadian Deprescribing Network guidelines. Deprescribing with gradual taper and implementing non-pharmacological interventions (sleep hygiene, consistent routine, light exposure, reduced caffeine) is recommended. Increasing the dose worsens risk. Long-acting benzodiazepines are also Beers Criteria listed and increase fall risk. Adding trazodone to quetiapine compounds sedation and fall risk.",
    s: "Geriatric"
  }
];
