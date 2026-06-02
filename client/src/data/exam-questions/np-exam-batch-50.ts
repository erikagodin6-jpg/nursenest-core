import type { ExamQuestion } from "./types";

export const npExamBatch50Questions: ExamQuestion[] = [
  {
    q: "A 55-year-old male with compensated cirrhosis (Child-Pugh A) is found to have grade 2 esophageal varices on screening EGD. He has never had variceal bleeding. What primary prophylaxis is recommended?",
    o: ["Non-selective beta-blocker (nadolol or propranolol) OR endoscopic variceal ligation (EVL); both are effective for primary prophylaxis of variceal hemorrhage", "No treatment until first bleeding episode", "Surgical portosystemic shunt", "Octreotide infusion prophylactically"],
    a: 0,
    r: "Medium-large esophageal varices (grade 2-3) in cirrhosis require primary prophylaxis to prevent first variceal hemorrhage (which carries 15-20% mortality). Two equally effective options: 1) Non-selective beta-blockers (NSBB -- nadolol or propranolol, target HR 55-60 bpm) reduce portal pressure by decreasing cardiac output and splanchnic blood flow, 2) EVL (endoscopic variceal ligation/banding) -- repeat every 2-4 weeks until obliteration. The choice depends on patient factors, availability, and preference. Carvedilol (NSBB with alpha-blocking) may be superior to traditional NSBBs.",
    s: "Gastrointestinal"
  },
  {
    q: "A 30-year-old male presents with nephrotic syndrome. He has no systemic disease. Renal biopsy shows normal glomeruli on light microscopy, diffuse foot process effacement on electron microscopy, and negative immunofluorescence. What is the diagnosis and first-line treatment?",
    o: ["Minimal change disease; high-dose prednisone (1 mg/kg/day, max 80 mg) for 8-12 weeks with gradual taper; 90% of adults achieve complete remission", "Focal segmental glomerulosclerosis; calcineurin inhibitor", "Membranous nephropathy; rituximab", "IgA nephropathy; fish oil supplements"],
    a: 0,
    r: "Minimal change disease (MCD) is characterized by: nephrotic syndrome (massive proteinuria, hypoalbuminemia, edema, hyperlipidemia), normal light microscopy ('minimal change'), diffuse podocyte foot process effacement on EM (the diagnostic hallmark), and negative immunofluorescence. It is the most common cause of nephrotic syndrome in children (80%) and accounts for 10-15% in adults. First-line: high-dose corticosteroids achieve complete remission in 80-90% of adults (response is slower than in children, often requiring 8-16 weeks). Relapses occur in 50-70% and may require steroid-sparing agents (cyclophosphamide, calcineurin inhibitors, rituximab).",
    s: "Renal"
  },
  {
    q: "A 60-year-old female with end-stage renal disease on hemodialysis has secondary hyperparathyroidism with PTH 950 pg/mL, phosphorus 7.8 mg/dL, and calcium 8.5 mg/dL. What is the management?",
    o: ["Phosphate binders with meals (sevelamer or lanthanum), calcitriol or vitamin D analog, cinacalcet to suppress PTH, and dietary phosphorus restriction; parathyroidectomy for refractory disease", "Calcium supplementation to raise serum calcium", "High-dose vitamin D only", "No treatment needed for secondary hyperparathyroidism"],
    a: 0,
    r: "CKD-mineral bone disorder (CKD-MBD) with secondary hyperparathyroidism results from phosphate retention, reduced active vitamin D synthesis, and hypocalcemia driving PTH secretion. KDIGO management: 1) Dietary phosphorus restriction (800-1000 mg/day), 2) Phosphate binders with meals (sevelamer or lanthanum preferred; calcium-based binders limited due to vascular calcification risk), 3) Active vitamin D (calcitriol) or analogs (paricalcitol) to suppress PTH, 4) Cinacalcet (calcimimetic) directly suppresses PTH secretion. Target PTH: 2-9 times upper normal for stage 5D. Refractory hyperparathyroidism (PTH persistently greater than 800) may require parathyroidectomy.",
    s: "Renal"
  },
  {
    q: "A 40-year-old female presents with depressed mood, psychomotor retardation, excessive guilt, anhedonia, and psychotic features (believes she is dead and her organs are rotting). What is this specific psychotic symptom called and what is the treatment approach?",
    o: ["Cotard delusion (nihilistic delusion); treatment requires combination of antidepressant plus antipsychotic for psychotic depression; ECT is highly effective", "Simple major depressive disorder; SSRI monotherapy", "Somatic symptom disorder; cognitive therapy", "Conversion disorder; physical therapy"],
    a: 0,
    r: "Cotard delusion (nihilistic delusion -- belief that one is dead, does not exist, or that one's organs are missing/rotting) is associated with severe psychotic depression. Psychotic depression (MDD with psychotic features) requires combination therapy: antidepressant plus antipsychotic (the STOP-PD II trial showed that combination sertraline plus olanzapine was significantly more effective than either alone). ECT is the most effective treatment for psychotic depression (response rates 80-90%) and is considered when medication trials fail or when rapid response is needed. SSRI monotherapy is insufficient for psychotic depression.",
    s: "Psychiatry"
  },
  {
    q: "An NP is managing a patient who develops a rare but serious adverse drug reaction. The NP suspects it may be related to a newly approved medication. Where should this adverse event be reported?",
    o: ["FDA MedWatch (adverse event reporting system) for post-market surveillance of drug safety", "Report to the pharmacy only", "No reporting is required for approved medications", "Report to the drug manufacturer only"],
    a: 0,
    r: "FDA MedWatch is the safety information and adverse event reporting program for drugs, biologics, medical devices, and dietary supplements. Healthcare providers (and patients) can submit voluntary reports of suspected adverse reactions. This post-market surveillance system has identified serious drug safety signals leading to black box warnings (e.g., fluoroquinolone tendinopathy), REMS requirements, and drug withdrawals (e.g., rofecoxib). Reporting is critical because pre-approval clinical trials have limited power to detect rare adverse events. MedWatch reports can be submitted online, by phone, or by mail. All reporters are protected from liability.",
    s: "Professional Practice"
  },
  {
    q: "A 55-year-old male asks about prostate cancer screening. He has no family history of prostate cancer and is in good health. What does the USPSTF recommend?",
    o: ["Shared decision-making about PSA-based screening for men aged 55-69; discuss potential benefits (small mortality reduction) and significant harms (overdiagnosis, overtreatment, false positives)", "Annual PSA screening for all men starting at age 40", "PSA screening is recommended against for all age groups", "Digital rectal exam alone is sufficient screening"],
    a: 0,
    r: "USPSTF 2018 recommendation for prostate cancer screening: 1) Ages 55-69: shared decision-making (Grade C) -- discuss that PSA screening provides a small potential mortality reduction but significant risks of overdiagnosis (detecting cancers that would never cause symptoms), overtreatment (surgery/radiation complications including incontinence and erectile dysfunction in 20-30%), and false positives leading to unnecessary biopsies. 2) Ages 70+: recommend against screening (Grade D). The NP should elicit the patient's values regarding screening trade-offs. African American men and those with family history may benefit from earlier discussion (age 40-55).",
    s: "Preventive Medicine"
  },
  {
    q: "A 50-year-old female presents with a painful vesicular rash in a T4 dermatomal distribution on the right chest. She has had burning pain in the area for 3 days before the rash appeared. What is the diagnosis and treatment?",
    o: ["Herpes zoster (shingles); antiviral therapy with valacyclovir 1000 mg TID for 7 days, initiated within 72 hours of rash onset for maximum benefit", "Allergic contact dermatitis; topical corticosteroid", "Herpes simplex; acyclovir 400 mg TID", "Cellulitis; IV antibiotics"],
    a: 0,
    r: "Herpes zoster results from reactivation of latent varicella-zoster virus in dorsal root ganglia, producing a painful vesicular rash in a dermatomal distribution (does not cross midline). Prodromal pain precedes the rash by 2-3 days. Treatment: antivirals (valacyclovir 1g TID, famciclovir 500mg TID, or acyclovir 800mg 5x/day) for 7 days, ideally within 72 hours of rash onset (reduces duration, severity, and risk of postherpetic neuralgia). Pain management: gabapentin/pregabalin for neuropathic pain, analgesics. Prevention: Shingrix vaccine (2 doses) for adults 50+ regardless of prior zoster history.",
    s: "Dermatology"
  },
  {
    q: "A 50-year-old postmenopausal female on tamoxifen for breast cancer presents with abnormal uterine bleeding. What is the primary concern and required evaluation?",
    o: ["Endometrial cancer risk increased by tamoxifen (SERM with estrogen agonist effect on the endometrium); transvaginal ultrasound and endometrial biopsy are required", "Normal side effect of tamoxifen; reassurance only", "Cervical cancer; Pap smear", "Vaginal atrophy; estrogen cream"],
    a: 0,
    r: "Tamoxifen is a selective estrogen receptor modulator (SERM) that acts as an estrogen antagonist in breast tissue but an agonist in the endometrium. Long-term tamoxifen use increases endometrial cancer risk 2-7 fold (endometrial polyps, hyperplasia, and carcinoma). Any abnormal uterine bleeding in a woman on tamoxifen requires urgent evaluation: transvaginal ultrasound (endometrial thickness assessment) and endometrial biopsy (tissue sampling). Annual screening ultrasound in asymptomatic women on tamoxifen is controversial and NOT recommended (high false-positive rate).",
    s: "Women's Health"
  },
  {
    q: "An 85-year-old female with multiple comorbidities (HFpEF, CKD stage 3, osteoarthritis) asks for pain management for her knee arthritis. She currently takes acetaminophen 650 mg TID with minimal relief. What are the safest escalation options?",
    o: ["Topical NSAIDs (diclofenac gel) applied to the affected knee, duloxetine (FDA-approved for OA pain in elderly), physical therapy, and intra-articular corticosteroid injections", "Oral ibuprofen 800 mg TID", "Oxycodone 5 mg every 4 hours", "Celecoxib 200 mg daily"],
    a: 0,
    r: "Pain management in elderly patients with multiple comorbidities requires careful medication selection. Oral NSAIDs are relatively contraindicated with HFpEF (fluid retention, worsening HF) and CKD (GFR decline, hyperkalemia). Safer options: 1) Topical diclofenac (systemic absorption is minimal, effective for knee OA), 2) Duloxetine (SNRI, FDA-approved for chronic musculoskeletal pain, avoids renal and cardiac risks), 3) Intra-articular corticosteroid injections (local effect, minimal systemic absorption), 4) Physical therapy (strengthening, flexibility), 5) Acetaminophen optimization (up to 2g/day in elderly). Opioids carry fall, sedation, and constipation risks per Beers Criteria.",
    s: "Geriatrics"
  },
  {
    q: "A 45-year-old male with ankylosing spondylitis on naproxen presents with progressive low back pain and stiffness worse in the morning lasting greater than 1 hour. He has elevated CRP. HLA-B27 is positive. Sacroiliac joint MRI shows active sacroiliitis with bone marrow edema. What treatment should be escalated to?",
    o: ["TNF inhibitor (adalimumab, infliximab, etanercept) or IL-17 inhibitor (secukinumab) as NSAIDs have failed", "Methotrexate for axial spondyloarthritis", "Oral corticosteroids long-term", "Sulfasalazine for spinal disease"],
    a: 0,
    r: "Ankylosing spondylitis (axial spondyloarthritis) failing NSAIDs should be escalated directly to biologic therapy. TNF inhibitors are first-line biologics for axial SpA (ATLAS, ASSERT trials demonstrated significant improvement in BASDAI scores, spinal mobility, and MRI inflammation). IL-17 inhibitors (secukinumab -- MEASURE trials) are an effective alternative. Important: conventional DMARDs (methotrexate, sulfasalazine, leflunomide) are NOT effective for axial (spinal) disease in AS -- they only help peripheral joint involvement. JAK inhibitors (tofacitinib, upadacitinib) are newer options for axial SpA.",
    s: "Musculoskeletal"
  }
];
