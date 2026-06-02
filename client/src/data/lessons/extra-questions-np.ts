import type { LessonContent } from "./types";

const npExtraBank: Record<string, LessonContent> = {
  "np-testbank-advanced-assessment": {
    title: "Advanced Assessment Test Bank",
    cellular: {
      title: "Advanced Health Assessment",
      content: "Advanced health assessment requires the clinician to integrate comprehensive history-taking, systematic physical examination, and diagnostic reasoning into a unified clinical picture. The assessment process extends beyond basic nursing assessment to include differential diagnosis formulation, advanced diagnostic ordering and interpretation, and evidence-based clinical decision-making.\n\nThe cardiovascular assessment involves auscultation of heart sounds at all five auscultatory areas (aortic, pulmonic, Erb's point, tricuspid, mitral), identification of S3 (volume overload/heart failure) and S4 (decreased ventricular compliance) gallops, and murmur grading (I-VI). Jugular venous distension (JVD) assessment at 45 degrees provides right atrial pressure estimation.\n\nThe pulmonary assessment includes percussion patterns (resonance, hyperresonance, dullness), tactile fremitus evaluation, and differentiation of adventitious breath sounds. Egophony (E-to-A change) over areas of consolidation aids pneumonia diagnosis.\n\nThe abdominal assessment follows the sequence of inspection, auscultation, percussion, and palpation. The clinician must identify organomegaly, ascites (shifting dullness, fluid wave), peritoneal signs (rebound tenderness, guarding), and special maneuvers (Murphy sign, McBurney point, Rovsing sign, psoas sign, obturator sign).\n\nNeurological assessment encompasses cranial nerve testing (I-XII), motor and sensory evaluation, cerebellar function (Romberg, finger-to-nose, heel-to-shin, rapid alternating movements), deep tendon reflex grading (0-4+), and pathological reflexes (Babinski, clonus). The Mini-Mental State Examination (MMSE) and Montreal Cognitive Assessment (MoCA) screen for cognitive impairment.\n\nMusculoskeletal assessment includes joint-specific maneuvers: shoulder (Neer, Hawkins, empty can), knee (Lachman, McMurray, drawer tests), hip (FABER/Patrick, Trendelenburg), and spine (straight leg raise for radiculopathy)."
    },
    riskFactors: [
      "Incomplete history-taking leading to missed diagnoses",
      "Failure to perform age-appropriate screening examinations",
      "Over-reliance on diagnostic testing without thorough physical examination",
      "Cognitive biases: anchoring, premature closure, confirmation bias",
      "Inadequate social determinants of health assessment",
      "Failure to assess medication adherence and polypharmacy",
      "Missing red flag symptoms requiring urgent referral",
      "Incomplete family history for genetic risk stratification"
    ],
    diagnostics: [
      "Comprehensive metabolic panel (CMP) for electrolytes, renal and hepatic function",
      "Complete blood count (CBC) with differential for infection, anemia, malignancy screening",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides for cardiovascular risk",
      "HbA1c for diabetes screening and monitoring (diagnostic ≥6.5%)",
      "Thyroid function tests: TSH (screening), free T4, free T3 (if TSH abnormal)",
      "Urinalysis with microscopy for renal disease, UTI, and proteinuria screening",
      "ECG interpretation: rate, rhythm, axis, intervals (PR, QRS, QT), ST-segment changes",
      "Chest X-ray interpretation: cardiac silhouette, lung fields, costophrenic angles",
      "BNP/NT-proBNP for heart failure evaluation (BNP >100 pg/mL suggestive)",
      "Troponin I/T for acute coronary syndrome (serial measurements q3-6h)",
      "D-dimer for venous thromboembolism exclusion (high sensitivity, low specificity)",
      "DEXA scan for osteoporosis screening (T-score ≤ -2.5 diagnostic)"
    ],
    management: [
      "Develop systematic approach to history-taking: HPI (OLDCARTS), PMH, PSH, medications, allergies, family history, social history, ROS",
      "Apply clinical prediction rules: Wells criteria (PE/DVT), CHA2DS2-VASc (stroke risk in AFib), HEART score (ACS), Ottawa ankle/knee rules",
      "Integrate U.S. Preventive Services Task Force (USPSTF) screening recommendations by age and risk",
      "Formulate differential diagnoses using problem representation and illness scripts",
      "Order diagnostics based on pre-test probability and clinical reasoning",
      "Apply shared decision-making for screening and treatment options",
      "Document using structured formats (SOAP) with clear assessment and plan",
      "Implement appropriate follow-up intervals based on acuity and diagnosis"
    ],
    nursingActions: [
      "Perform comprehensive head-to-toe assessment with focused examination based on chief complaint",
      "Obtain vital signs including orthostatic measurements when indicated",
      "Calculate BMI and waist circumference for cardiovascular risk assessment",
      "Perform point-of-care testing when appropriate (glucose, urine dipstick, rapid strep)",
      "Assess functional status using validated tools (ADLs, IADLs, Karnofsky Performance Scale)",
      "Screen for depression (PHQ-9), anxiety (GAD-7), and substance use (AUDIT, CAGE)",
      "Perform fall risk assessment in elderly patients (Timed Up and Go, Morse Fall Scale)",
      "Conduct medication reconciliation at every encounter"
    ],
    signs: {
      left: [
        "Heart sounds: S1 (mitral/tricuspid closure), S2 (aortic/pulmonic closure)",
        "S3 gallop: rapid ventricular filling (heart failure, volume overload)",
        "S4 gallop: atrial contraction against stiff ventricle (HTN, CAD)",
        "Murmur grading I-VI: I barely audible, VI audible without stethoscope",
        "JVD assessment at 45 degrees: elevated >4cm above sternal angle",
        "Hepatojugular reflux: sustained JVD with liver pressure (RHF)",
        "Pulsus paradoxus >10 mmHg: cardiac tamponade, severe asthma",
        "Egophony (E-to-A change): lung consolidation"
      ],
      right: [
        "Shifting dullness and fluid wave: ascites detection",
        "Murphy sign positive: acute cholecystitis",
        "McBurney point tenderness: appendicitis",
        "Babinski sign (upgoing plantar): upper motor neuron lesion",
        "Clonus (>3 beats): upper motor neuron pathology",
        "Romberg positive: proprioceptive or vestibular dysfunction",
        "Lachman test positive: ACL tear",
        "Straight leg raise positive at 30-70 degrees: lumbar radiculopathy"
      ]
    },
    medications: [
      { name: "Aspirin 81mg", type: "Antiplatelet", action: "Irreversibly inhibits cyclooxygenase-1 (COX-1), preventing thromboxane A2 formation and platelet aggregation", sideEffects: "GI bleeding, tinnitus, Reye syndrome in children", contra: "Active GI bleeding, aspirin-exacerbated respiratory disease, children <18 with viral illness", pearl: "For acute MI, chew 325mg for rapid buccal absorption; maintenance dose 81mg daily for primary and secondary prevention" },
      { name: "Metformin", type: "Biguanide (antihyperglycemic)", action: "Decreases hepatic glucose production, increases insulin sensitivity in peripheral tissues, reduces intestinal glucose absorption", sideEffects: "GI upset (diarrhea, nausea), metallic taste, B12 deficiency with long-term use, lactic acidosis (rare)", contra: "eGFR <30 mL/min (contraindicated), eGFR 30-45 (do not initiate), metabolic acidosis, acute/chronic alcohol abuse", pearl: "First-line for T2DM; hold 48h before and after iodinated contrast; check B12 annually with long-term use" },
      { name: "Lisinopril", type: "ACE inhibitor", action: "Inhibits angiotensin-converting enzyme, preventing conversion of angiotensin I to angiotensin II, reducing aldosterone secretion", sideEffects: "Dry cough (10-15%), hyperkalemia, angioedema, acute kidney injury, hypotension", contra: "Bilateral renal artery stenosis, pregnancy (teratogenic), history of ACE inhibitor-induced angioedema, concurrent use with aliskiren in diabetes", pearl: "Check creatinine and potassium 1-2 weeks after initiation; up to 30% rise in creatinine is acceptable; switch to ARB if cough intolerable" },
      { name: "Atorvastatin", type: "HMG-CoA reductase inhibitor (statin)", action: "Inhibits 3-hydroxy-3-methylglutaryl coenzyme A reductase, reducing hepatic cholesterol synthesis and upregulating LDL receptors", sideEffects: "Myalgia, elevated transaminases, rhabdomyolysis (rare), new-onset diabetes", contra: "Active liver disease, pregnancy, concurrent strong CYP3A4 inhibitors at high doses", pearl: "High-intensity (40-80mg) for ASCVD or LDL ≥190; obtain baseline ALT; if myalgia develops, check CK and consider dose reduction or switching to rosuvastatin" },
      { name: "Levothyroxine", type: "Thyroid hormone replacement", action: "Synthetic T4 replacement, converted to active T3 in peripheral tissues, restores metabolic function and TSH feedback", sideEffects: "Palpitations, tachycardia, anxiety, insomnia, weight loss, bone loss with overreplacement", contra: "Untreated adrenal insufficiency (must correct cortisol first), uncorrected thyrotoxicosis", pearl: "Take on empty stomach 30-60 min before breakfast; separate from calcium, iron, and PPIs by 4 hours; recheck TSH in 6-8 weeks after dose changes" }
    ],
    pearls: [
      "Always assess for red flags in headache: thunderclap onset, worst headache of life, fever with neck stiffness, new onset after age 50, focal neurological deficits, papilledema",
      "The SAAG (serum-ascites albumin gradient) ≥1.1 g/dL indicates portal hypertension; <1.1 suggests peritoneal malignancy, TB, or nephrotic syndrome",
      "BNP <100 pg/mL effectively rules out heart failure; BNP >400 strongly suggests decompensated HF; values between 100-400 require clinical correlation",
      "In acute coronary syndrome, troponin elevation with a rise-and-fall pattern distinguishes acute MI from chronic troponin elevation seen in CKD or stable HF",
      "The Wells score for PE: >6 points = high probability, proceed directly to CTPA; ≤4 points = low probability, obtain D-dimer first",
      "A normal D-dimer has >95% negative predictive value for PE/DVT; however, it is elevated in pregnancy, malignancy, infection, surgery, and advanced age, limiting specificity",
      "Orthostatic hypotension is defined as a drop in systolic BP ≥20 mmHg or diastolic BP ≥10 mmHg within 3 minutes of standing; assess in all patients with dizziness or syncope",
      "The CHA2DS2-VASc score determines anticoagulation need in atrial fibrillation: score ≥2 in males or ≥3 in females warrants anticoagulation (DOAC preferred over warfarin)"
    ],
    quiz: [
      { question: "A 68-year-old client presents with sudden onset crushing substernal chest pain radiating to the left arm and jaw. Troponin is elevated. What is the initial pharmacologic management the clinician should order?", options: ["Morphine only", "Aspirin, nitroglycerin, heparin, and beta-blocker (MONA protocol)", "Thrombolytics immediately without further assessment", "Oral metoprolol and discharge with follow-up"], correct: 1, rationale: "Acute STEMI management follows evidence-based protocols: aspirin (antiplatelet), nitroglycerin (coronary vasodilation), anticoagulation (heparin), beta-blocker (reduce myocardial oxygen demand), and evaluate for emergent PCI or fibrinolytics." },
      { question: "The clinician is evaluating a client with suspected Cushing syndrome. Which initial laboratory test is most appropriate?", options: ["Random cortisol level", "24-hour urine free cortisol or overnight dexamethasone suppression test", "ACTH stimulation test", "Serum aldosterone level"], correct: 1, rationale: "Initial screening for Cushing syndrome includes 24-hour urine free cortisol, late-night salivary cortisol, or 1mg overnight dexamethasone suppression test. These identify hypercortisolism before determining the cause." },
      { question: "A client presents with new-onset ascites. The clinician orders a paracentesis. The serum-ascites albumin gradient (SAAG) is 1.8 g/dL. What does this indicate?", options: ["Ascites from malignancy", "Portal hypertension-related ascites", "Tuberculous peritonitis", "Pancreatic ascites"], correct: 1, rationale: "SAAG greater than or equal to 1.1 g/dL indicates portal hypertension (cirrhosis, heart failure, Budd-Chiari). SAAG <1.1 suggests non-portal hypertension causes (malignancy, TB peritonitis, nephrotic syndrome)." },
      { question: "A 55-year-old client has a TSH of 0.1 mIU/L and free T4 of 3.8 ng/dL. The clinician should order which test next?", options: ["Repeat TSH in 6 months", "Thyroid uptake and scan to differentiate hyperthyroid causes", "Start methimazole empirically", "Thyroid ultrasound only"], correct: 1, rationale: "Suppressed TSH with elevated free T4 confirms hyperthyroidism. Thyroid uptake and scan differentiates Graves disease (diffuse uptake), toxic nodular goiter (focal uptake), and thyroiditis (low uptake), guiding treatment." },
      { question: "A client with heart failure has a BNP of 1,200 pg/mL. What does this level indicate?", options: ["Normal cardiac function", "Mild heart failure", "Severe/decompensated heart failure", "Pulmonary disease only"], correct: 2, rationale: "BNP >400-500 pg/mL strongly suggests heart failure with high specificity. BNP >1,000 indicates severe/decompensated HF requiring aggressive diuresis, afterload reduction, and possible inotropic support." },
      { question: "When interpreting a chest X-ray, the clinician notices bilateral butterfly-shaped opacities. What condition does this suggest?", options: ["Pneumonia", "Pulmonary edema", "Pulmonary fibrosis", "Pleural effusion"], correct: 1, rationale: "Bilateral butterfly/bat-wing opacities on CXR are classic for pulmonary edema (cardiogenic). The pattern reflects alveolar flooding that is more prominent centrally (perihilar) and spares the periphery." },
      { question: "A client presents with polyuria, polydipsia, and a random glucose of 15.2 mmol/L. The clinician orders an HbA1c which returns at 8.2%. What is the diagnosis?", options: ["Prediabetes", "Type 2 diabetes mellitus", "Diabetes insipidus", "Metabolic syndrome without diabetes"], correct: 1, rationale: "HbA1c greater than or equal to 6.5% is diagnostic of diabetes mellitus. Combined with classic symptoms (polyuria, polydipsia) and random glucose >11.1 mmol/L, the diagnosis is confirmed without additional testing." },
      { question: "A client presents with sudden unilateral flank pain radiating to the groin, hematuria, and nausea. Which imaging should the clinician order first?", options: ["Abdominal X-ray (KUB)", "Non-contrast CT abdomen/pelvis", "Renal ultrasound", "IV pyelogram"], correct: 1, rationale: "Non-contrast CT (CT KUB) is the gold standard for diagnosing nephrolithiasis with sensitivity >95%. It identifies stone size, location, and complications (hydronephrosis, ureteral obstruction) without contrast risk." },
    ],
    preTest: [
      { question: "An NP is evaluating a client with chronic kidney disease. The eGFR is 22 mL/min/1.73m2. What CKD stage is this?", options: ["Stage 3a", "Stage 3b", "Stage 4", "Stage 5"], correct: 2, rationale: "CKD staging: Stage 1 (eGFR >90), Stage 2 (60-89), Stage 3a (45-59), Stage 3b (30-44), Stage 4 (15-29), Stage 5 (<15). An eGFR of 22 is Stage 4, requiring nephrology referral and dialysis planning." },
    ],
  },
  "np-testbank-prescribing": {
    title: "Prescribing & Pharmacotherapeutics Test Bank",
    cellular: {
      title: "Advanced Pharmacotherapeutics",
      content: "Pharmacotherapeutics at the advanced practice level requires mastery of pharmacokinetics (absorption, distribution, metabolism, excretion), pharmacodynamics (drug-receptor interactions, dose-response relationships), and pharmacogenomics (genetic variations affecting drug metabolism).\n\nAbsorption is influenced by route of administration, formulation, GI pH, blood flow, and first-pass metabolism. Bioavailability varies significantly: IV administration has 100% bioavailability, while oral medications undergo first-pass hepatic metabolism that can substantially reduce systemic availability (e.g., propranolol oral bioavailability ~25%).\n\nDrug metabolism occurs primarily in the liver via cytochrome P450 (CYP) enzymes. Key isoforms include CYP3A4 (metabolizes ~50% of drugs), CYP2D6 (codeine, tamoxifen, many antidepressants), CYP2C19 (clopidogrel, PPIs), and CYP2C9 (warfarin, phenytoin). Genetic polymorphisms create poor metabolizers, intermediate metabolizers, extensive metabolizers, and ultra-rapid metabolizers, significantly affecting drug response.\n\nRenal dosing adjustments are critical for drugs with significant renal elimination. The Cockcroft-Gault equation or CKD-EPI formula estimates kidney function for dosing decisions. Drugs requiring renal adjustment include metformin, DOACs, gabapentin, vancomycin, aminoglycosides, and lithium.\n\nHepatic dosing considerations use the Child-Pugh classification. Phase I reactions (oxidation, reduction, hydrolysis via CYP enzymes) are more affected by liver disease than Phase II reactions (conjugation, glucuronidation).\n\nPrescribing in special populations requires attention to physiologic changes. Pregnancy drug safety uses FDA Letter Categories (being replaced by the Pregnancy and Lactation Labeling Rule). Pediatric dosing often uses weight-based calculations. Geriatric prescribing follows the Beers Criteria to avoid potentially inappropriate medications, and START/STOPP criteria guide prescribing optimization.\n\nTherapeutic drug monitoring (TDM) is essential for narrow therapeutic index drugs: warfarin (INR), digoxin (0.5-2.0 ng/mL), phenytoin (10-20 mcg/mL), lithium (0.6-1.2 mEq/L), vancomycin (trough 15-20 for serious infections), and aminoglycosides."
    },
    riskFactors: [
      "Polypharmacy (≥5 medications) increasing drug interaction risk",
      "Renal impairment requiring dose adjustments for renally cleared drugs",
      "Hepatic impairment affecting drug metabolism (CYP450 system)",
      "Genetic polymorphisms in CYP2D6, CYP2C19, CYP2C9 altering drug metabolism",
      "Extremes of age: neonates (immature metabolism) and elderly (declining organ function)",
      "Pregnancy and lactation requiring careful risk-benefit analysis",
      "Non-adherence due to cost, complexity, or side effects",
      "Herbal supplement interactions (St. John's Wort induces CYP3A4, reducing drug levels)"
    ],
    diagnostics: [
      "Serum drug levels for narrow therapeutic index drugs (digoxin, phenytoin, lithium, vancomycin)",
      "INR monitoring for warfarin therapy (target 2.0-3.0 for most indications, 2.5-3.5 for mechanical valves)",
      "HbA1c for antidiabetic therapy effectiveness (target <7% for most adults)",
      "Lipid panel for statin therapy monitoring (LDL goal based on risk category)",
      "Hepatic function panel (AST, ALT, bilirubin) before and during hepatotoxic drug therapy",
      "Renal function (eGFR, BUN, creatinine) for dose adjustments of renally cleared drugs",
      "CBC for drugs causing bone marrow suppression (methotrexate, clozapine, carbamazepine)",
      "Serum potassium for drugs affecting potassium balance (ACE inhibitors, diuretics, spironolactone)",
      "TSH for monitoring thyroid replacement therapy (target 0.5-4.0 mIU/L for most adults)",
      "CYP pharmacogenomic testing when available (CYP2C19 for clopidogrel, CYP2D6 for codeine)"
    ],
    management: [
      "Apply evidence-based clinical practice guidelines (ADA, ACC/AHA, GOLD, JNC) for medication selection",
      "Start low, go slow in elderly patients; titrate to therapeutic effect",
      "Consider cost-effectiveness and formulary coverage in medication selection",
      "Use deprescribing strategies for inappropriate medications in the elderly (Beers Criteria review)",
      "Implement antimicrobial stewardship: select narrowest spectrum, appropriate duration, culture-guided therapy",
      "Monitor for drug-drug interactions using clinical decision support tools",
      "Assess medication adherence at each visit using motivational interviewing and pill counts",
      "Provide patient education on drug purpose, administration, side effects, and when to seek care"
    ],
    nursingActions: [
      "Perform medication reconciliation at every encounter including OTC and supplements",
      "Calculate creatinine clearance or eGFR for renal dose adjustments",
      "Monitor for adverse drug reactions and report via MedWatch when appropriate",
      "Educate patients on potential food-drug interactions (grapefruit with statins/CCBs, vitamin K with warfarin)",
      "Assess for allergies versus intolerances to guide safe prescribing alternatives",
      "Coordinate with pharmacists for complex medication management",
      "Implement and monitor therapeutic drug levels with appropriate timing (trough levels before next dose)",
      "Evaluate for serotonin syndrome risk when combining serotonergic agents (SSRIs + tramadol, MAOIs + triptans)"
    ],
    signs: {
      left: [
        "Drug toxicity signs: digoxin (visual changes, bradycardia, nausea)",
        "Lithium toxicity: fine tremor (therapeutic), coarse tremor/ataxia (toxic), seizures (severe)",
        "Serotonin syndrome triad: mental status changes, autonomic instability, neuromuscular hyperactivity",
        "Neuroleptic malignant syndrome: hyperthermia, lead-pipe rigidity, altered consciousness, autonomic dysfunction",
        "Warfarin over-anticoagulation: petechiae, ecchymoses, bleeding gums, hematuria",
        "Stevens-Johnson syndrome: target lesions, mucosal erosions, skin sloughing <10% BSA",
        "ACE inhibitor angioedema: lip/tongue/pharyngeal swelling without urticaria",
        "Aminoglycoside toxicity: ototoxicity (hearing loss, tinnitus), nephrotoxicity (rising creatinine)"
      ],
      right: [
        "Drug-induced QT prolongation: torsades risk with macrolides, fluoroquinolones, antipsychotics",
        "Statin-induced rhabdomyolysis: muscle pain, dark urine, CK >10x upper normal",
        "NSAID-induced AKI: rising creatinine, decreased urine output, hyperkalemia",
        "Metformin-associated lactic acidosis: Kussmaul breathing, abdominal pain, lethargy",
        "Phenytoin toxicity: nystagmus (early), ataxia (moderate), lethargy/seizures (severe)",
        "Clozapine-induced agranulocytosis: fever, sore throat, ANC <500 (requires REMS monitoring)",
        "Opioid overdose: miosis, respiratory depression, decreased LOC (naloxone reversal)",
        "Corticosteroid adverse effects: hyperglycemia, osteoporosis, adrenal suppression, immunosuppression"
      ]
    },
    medications: [
      { name: "Empagliflozin (Jardiance)", type: "SGLT2 inhibitor", action: "Inhibits sodium-glucose co-transporter 2 in the proximal renal tubule, reducing glucose reabsorption and promoting glycosuria; also reduces preload and afterload", sideEffects: "Genital mycotic infections, UTI, polyuria, hypotension, euglycemic DKA (rare), Fournier gangrene (rare)", contra: "eGFR <20 mL/min for glycemic benefit (can continue for cardiorenal benefit), type 1 diabetes, recurrent genital infections", pearl: "Provides cardiovascular and renal protective benefits independent of glucose lowering; preferred second-line after metformin for T2DM with established ASCVD or CKD per ADA guidelines" },
      { name: "Apixaban (Eliquis)", type: "Direct oral anticoagulant (Factor Xa inhibitor)", action: "Selectively and reversibly inhibits factor Xa, reducing thrombin generation and clot formation without requiring antithrombin as a cofactor", sideEffects: "Bleeding (GI, intracranial), anemia, bruising", contra: "Active pathological bleeding, prosthetic heart valves, severe hepatic impairment (Child-Pugh C), concurrent use of strong dual CYP3A4 and P-gp inhibitors", pearl: "Preferred DOAC in renal impairment (safe with CrCl as low as 15 mL/min); dose reduce to 2.5mg BID if ≥2 of: age ≥80, weight ≤60kg, creatinine ≥1.5; reversal agent: andexanet alfa" },
      { name: "Semaglutide (Ozempic/Wegovy)", type: "GLP-1 receptor agonist", action: "Mimics incretin hormone GLP-1, stimulating glucose-dependent insulin secretion, suppressing glucagon, delaying gastric emptying, and promoting satiety via central appetite suppression", sideEffects: "Nausea, vomiting, diarrhea, pancreatitis (rare), gallbladder disease, injection site reactions", contra: "Personal or family history of medullary thyroid carcinoma, MEN2 syndrome, history of pancreatitis, gastroparesis", pearl: "Start at low dose and titrate every 4 weeks to minimize GI side effects; cardiovascular benefit demonstrated in SUSTAIN-6 trial; available as weekly subcutaneous injection or daily oral formulation" },
      { name: "Dapagliflozin (Farxiga)", type: "SGLT2 inhibitor", action: "Blocks renal glucose reabsorption in the proximal tubule; reduces intraglomerular pressure via tubuloglomerular feedback restoration, providing cardiorenal protection", sideEffects: "Genital mycotic infections, urinary tract infections, volume depletion, euglycemic DKA, lower limb amputation risk (canagliflozin specifically)", contra: "Dialysis patients, type 1 diabetes, severe renal impairment for glycemic use", pearl: "DAPA-HF and DAPA-CKD trials demonstrated benefit in heart failure (HFrEF) and CKD regardless of diabetes status; now indicated for HF and CKD as standalone indications" },
      { name: "Buprenorphine/Naloxone (Suboxone)", type: "Partial opioid agonist/antagonist", action: "Buprenorphine is a partial mu-opioid agonist with high receptor affinity and ceiling effect on respiratory depression; naloxone deters parenteral abuse (precipitates withdrawal if injected)", sideEffects: "Headache, nausea, constipation, insomnia, diaphoresis, precipitated withdrawal if initiated too early", contra: "Active alcohol withdrawal requiring sedation, severe respiratory depression, concurrent full opioid agonist use", pearl: "Requires XDEA waiver training (X-waiver) to prescribe; patient must be in moderate opioid withdrawal (COWS score ≥12) before induction to avoid precipitated withdrawal; sublingual administration only" }
    ],
    pearls: [
      "CYP3A4 inhibitors (ketoconazole, erythromycin, grapefruit juice, ritonavir) increase levels of most statins, CCBs, benzodiazepines, and many other drugs; always check for interactions",
      "CYP2D6 poor metabolizers cannot convert codeine to morphine, making it ineffective for pain; ultra-rapid metabolizers produce excessive morphine, risking fatal respiratory depression",
      "When switching from an ACE inhibitor to sacubitril/valsartan (Entresto), a 36-hour washout period is mandatory to prevent life-threatening angioedema from dual neprilysin and ACE inhibition",
      "Fluoroquinolones carry FDA black box warnings for tendon rupture, peripheral neuropathy, CNS effects, and aortic dissection; reserve for infections without safer alternatives",
      "Methotrexate requires folate supplementation (folic acid 1mg daily) to reduce toxicity; monitor CBC, hepatic panel, and renal function; teratogenic (Category X) requiring contraception",
      "The Beers Criteria identifies medications to avoid in elderly patients: benzodiazepines (fall risk), first-generation antihistamines (anticholinergic), long-acting sulfonylureas (hypoglycemia), and NSAIDs (GI/renal risk)",
      "PTU is preferred over methimazole in first trimester pregnancy (methimazole associated with aplasia cutis and choanal atresia); switch to methimazole in second/third trimester",
      "Warfarin is dosed based on INR response, not fixed dosing; genetic testing for CYP2C9 and VKORC1 polymorphisms can guide initial dosing"
    ],
    quiz: [
      { question: "A client with type 2 diabetes and an eGFR of 55 mL/min has an HbA1c of 8.5% on metformin monotherapy. What should the clinician add?", options: ["Glyburide (sulfonylurea)", "Empagliflozin (SGLT2 inhibitor) for cardiovascular and renal benefit", "Pioglitazone (thiazolidinedione)", "Insulin glargine as next step"], correct: 1, rationale: "SGLT2 inhibitors (empagliflozin, dapagliflozin) provide glycemic control plus cardiovascular and renal protective benefits independent of glucose lowering. Preferred second-line in clients with CKD, HF, or ASCVD per ADA guidelines." },
      { question: "A client with atrial fibrillation and a CrCl of 25 mL/min needs anticoagulation. Which agent should the clinician prescribe?", options: ["Rivaroxaban 20mg daily", "Apixaban 5mg BID (or 2.5mg BID with dose reduction criteria)", "Dabigatran 150mg BID", "Edoxaban 60mg daily"], correct: 1, rationale: "Apixaban is the preferred DOAC in severe renal impairment. It can be used with CrCl as low as 15 mL/min (or even on dialysis per some guidelines). Dabigatran is contraindicated with CrCl <30, and rivaroxaban/edoxaban require dose adjustments." },
      { question: "A 45-year-old client with migraines and a history of hemiplegic migraine asks about triptan therapy. What should the clinician advise?", options: ["Triptans are safe for all migraine types", "Triptans are contraindicated in hemiplegic migraine due to vasoconstriction risk", "Ergotamine is a better choice", "No treatment is available for hemiplegic migraine"], correct: 1, rationale: "Triptans (5-HT1B/1D agonists) cause vasoconstriction and are contraindicated in hemiplegic and basilar migraine due to theoretical risk of stroke. Alternative preventives include verapamil, valproate, or CGRP monoclonal antibodies." },
      { question: "A client is prescribed warfarin. The clinician notes the client is also taking fluconazole for a fungal infection. What interaction should be anticipated?", options: ["Decreased warfarin effect", "Significantly increased INR due to CYP2C9 inhibition", "No interaction", "Need to switch to a higher warfarin dose"], correct: 1, rationale: "Fluconazole is a potent CYP2C9 and CYP3A4 inhibitor, significantly increasing warfarin levels and bleeding risk. The INR may rise dramatically. Reduce warfarin dose by 25-50% and monitor INR closely." },
      { question: "An NP is managing a client with COPD-asthma overlap. Which inhaler combination is appropriate?", options: ["SABA alone", "ICS/LABA combination (e.g., budesonide/formoterol)", "LAMA alone", "Oral theophylline monotherapy"], correct: 1, rationale: "COPD-asthma overlap requires an ICS component (for the asthma) plus a long-acting bronchodilator (for COPD). ICS/LABA combinations like budesonide/formoterol or fluticasone/salmeterol address both components. A LAMA may be added for additional COPD control." },
      { question: "A client with bipolar disorder I is pregnant (first trimester). Which mood stabilizer has the lowest teratogenic risk?", options: ["Valproic acid", "Carbamazepine", "Lamotrigine", "Lithium"], correct: 2, rationale: "Lamotrigine has the most favorable safety profile in pregnancy among mood stabilizers. Valproic acid has the highest teratogenic risk (neural tube defects, 6-9%). Lithium carries Ebstein anomaly risk. Carbamazepine also has neural tube defect risk." },
      { question: "A client with community-acquired pneumonia (CAP) is being treated as an outpatient. The clinician should prescribe which empiric antibiotic for a healthy adult with no comorbidities?", options: ["Amoxicillin/clavulanate plus azithromycin", "Amoxicillin 1g TID or doxycycline 100mg BID", "Levofloxacin 750mg daily", "Ceftriaxone IM plus azithromycin"], correct: 1, rationale: "Per ATS/IDSA 2019 guidelines, healthy outpatient CAP without comorbidities: amoxicillin 1g TID, doxycycline 100mg BID, or a macrolide (if local resistance <25%). Fluoroquinolones are reserved for clients with comorbidities." },
      { question: "An NP is prescribing an ACE inhibitor for a newly diagnosed heart failure client. Which statement about monitoring is correct?", options: ["No monitoring needed after starting", "Check serum creatinine and potassium within 1-2 weeks of initiation", "Only check blood pressure monthly", "Renal function monitoring is unnecessary if baseline was normal"], correct: 1, rationale: "ACE inhibitors can cause hyperkalemia and acute kidney injury (especially in renal artery stenosis). Creatinine and potassium should be checked 1-2 weeks after starting or dose changes. A creatinine rise up to 30% is acceptable." },
    ],
  },
  "np-testbank-differential-diagnosis": {
    title: "Differential Diagnosis Test Bank",
    cellular: {
      title: "Differential Diagnosis and Clinical Reasoning",
      content: "Differential diagnosis is the systematic process of distinguishing between conditions that share similar clinical features. The clinician must develop and refine a problem representation, generate a differential list, and strategically order tests to rule in or rule out competing diagnoses.\n\nThe diagnostic reasoning process follows a structured approach: (1) gather clinical data through history and physical examination, (2) create a problem representation summarizing the key features (age, sex, acuity, key symptoms, pertinent positives and negatives), (3) generate a differential diagnosis list using pattern recognition and analytic reasoning, (4) prioritize differentials by probability and severity (must-not-miss diagnoses), and (5) order targeted diagnostics to confirm or exclude leading diagnoses.\n\nCognitive biases significantly affect diagnostic accuracy. Anchoring bias occurs when the clinician fixates on an initial impression. Premature closure stops the diagnostic process too early. Availability bias overestimates diagnoses recently encountered. Confirmation bias selectively seeks information supporting the initial hypothesis. The clinician must employ deliberate diagnostic reasoning strategies and metacognition to mitigate these biases.\n\nChest pain differential diagnosis illustrates the systematic approach. The must-not-miss diagnoses include acute coronary syndrome (MI, unstable angina), aortic dissection, pulmonary embolism, tension pneumothorax, esophageal rupture (Boerhaave syndrome), and cardiac tamponade. Less emergent but common causes include GERD, musculoskeletal pain, costochondritis, anxiety/panic disorder, and pericarditis. The history, ECG, troponin, chest X-ray, and D-dimer guide differentiation.\n\nHeadache differential requires distinguishing primary headaches (migraine, tension-type, cluster) from secondary headaches caused by subarachnoid hemorrhage, meningitis, temporal arteritis, intracranial mass, idiopathic intracranial hypertension, or cervicogenic pain. Red flags (SNOOPPP mnemonic) prompt emergent neuroimaging.\n\nAcute abdominal pain differentials are organized by location: RUQ (cholecystitis, hepatitis, pneumonia), epigastric (PUD, pancreatitis, MI), LUQ (splenic injury, gastritis), RLQ (appendicitis, ovarian pathology, ectopic pregnancy), LLQ (diverticulitis, ovarian pathology), and diffuse (peritonitis, bowel obstruction, mesenteric ischemia, DKA)."
    },
    riskFactors: [
      "Cognitive biases leading to diagnostic error (anchoring, premature closure, availability heuristic)",
      "Incomplete history-taking missing critical red flags",
      "Atypical disease presentations in elderly, immunocompromised, or diabetic patients",
      "Low index of suspicion for rare but life-threatening conditions",
      "Failure to consider demographic-specific risks (age, sex, race, occupation)",
      "Communication barriers (language, health literacy, cultural differences)",
      "Time pressure in clinical settings reducing thorough evaluation",
      "Over-reliance on technology and testing without clinical correlation"
    ],
    diagnostics: [
      "ECG: ST changes (STEMI/NSTEMI), T-wave inversions (ischemia), S1Q3T3 (PE), PR depression (pericarditis), low voltage (tamponade/effusion)",
      "Troponin I/T with serial measurements for acute coronary syndrome (0h and 3h protocol, or high-sensitivity at 0h and 1h)",
      "CT angiography: gold standard for PE (CTPA), aortic dissection (CTA chest), and renal artery stenosis",
      "Lumbar puncture: CSF analysis for meningitis (cell count, glucose, protein, gram stain, culture), SAH (xanthochromia, RBCs)",
      "ANA panel with specific antibodies: anti-dsDNA (SLE), anti-Smith (SLE), anti-centromere (limited scleroderma), anti-Scl-70 (diffuse scleroderma)",
      "Rheumatoid factor and anti-CCP antibodies for rheumatoid arthritis diagnosis",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology (appendicitis, diverticulitis, abscess)",
      "Liver function tests with hepatitis panel (HAV IgM, HBsAg, HBcAb, HCV Ab) for acute hepatitis workup",
      "Serum lipase (preferred over amylase) for acute pancreatitis (diagnostic at >3x upper limit of normal)",
      "ESR and CRP: nonspecific inflammatory markers; markedly elevated ESR (>100) suggests malignancy, temporal arteritis, or endocarditis",
      "Procalcitonin: distinguishes bacterial infection from viral or non-infectious inflammation (>0.5 ng/mL suggests bacterial)"
    ],
    management: [
      "Always consider 'must-not-miss' diagnoses first (life-threatening conditions that mimic common presentations)",
      "Use validated clinical decision rules to guide workup: Wells (PE/DVT), HEART (ACS), CURB-65 (pneumonia severity), PERC (PE exclusion)",
      "Apply Bayesian reasoning: pre-test probability determines test selection and post-test probability interpretation",
      "For diagnostic uncertainty, establish a follow-up plan with specific return precautions and time-defined reassessment",
      "Document clinical reasoning including differential diagnosis, rationale for chosen workup, and why alternatives were excluded",
      "When presentations are atypical, broaden the differential beyond the most common diagnoses",
      "Utilize specialist consultation for complex or ambiguous cases, especially when outside NP scope",
      "Implement diagnostic time-outs: pause to reconsider the differential when initial testing is negative or diagnosis unclear"
    ],
    nursingActions: [
      "Obtain a thorough history with specific attention to timing, character, associated symptoms, and aggravating/alleviating factors (OLDCARTS)",
      "Perform a focused physical examination based on the differential diagnosis being considered",
      "Identify and communicate red flag findings requiring immediate evaluation or referral",
      "Order and interpret diagnostic studies in a logical stepwise manner",
      "Reassess the clinical picture as test results return and narrow or broaden the differential accordingly",
      "Provide clear patient education regarding the diagnostic process, expected timeline, and return precautions",
      "Coordinate care with specialists and ensure appropriate follow-up for pending results",
      "Use teach-back method to confirm patient understanding of warning signs requiring emergency care"
    ],
    signs: {
      left: [
        "Chest pain differentials: crushing/pressure (ACS), tearing/ripping to back (dissection), pleuritic (PE, pericarditis), burning (GERD)",
        "Abdominal pain: RLQ (appendicitis), RUQ with Murphy sign (cholecystitis), epigastric radiating to back (pancreatitis)",
        "Headache red flags: thunderclap onset (SAH), fever/stiff neck (meningitis), temporal tenderness in elderly (GCA)",
        "Dyspnea acute: absent breath sounds (pneumothorax), crackles (pulmonary edema), wheezing (asthma/COPD), leg swelling (PE)",
        "Joint pain: monoarticular hot/red (septic joint vs gout), symmetric polyarticular (RA), asymmetric with nail changes (psoriatic)",
        "Skin rash differentials: malar (SLE), heliotrope (dermatomyositis), target lesions (erythema multiforme)",
        "Syncope evaluation: cardiac (arrhythmia, structural), vasovagal (prodrome), orthostatic (dehydration, autonomic)",
        "Weight loss differentials: malignancy, hyperthyroidism, diabetes, TB, depression, adrenal insufficiency"
      ],
      right: [
        "Aortic dissection: BP differential >20 mmHg between arms, widened mediastinum on CXR, acute aortic regurgitation murmur",
        "Pulmonary embolism: acute dyspnea, pleuritic chest pain, tachycardia, hypoxia, S1Q3T3 on ECG, elevated D-dimer",
        "Cardiac tamponade: Beck triad (hypotension, muffled sounds, JVD), pulsus paradoxus >10 mmHg, electrical alternans on ECG",
        "Meningitis: nuchal rigidity, Kernig sign (hamstring pain with knee extension), Brudzinski sign (neck flexion causes hip flexion)",
        "Appendicitis: McBurney point tenderness, Rovsing sign (RLQ pain with LLQ palpation), psoas sign, obturator sign",
        "SLE criteria: malar rash, photosensitivity, oral ulcers, arthritis, serositis, renal disorder, cytopenias, positive ANA/anti-dsDNA",
        "Addisonian crisis: profound hypotension, hyperkalemia, hyponatremia, hypoglycemia, hyperpigmentation",
        "Pheochromocytoma: episodic hypertension, headache, diaphoresis, palpitations (rule of 10s: 10% bilateral, 10% malignant, 10% extra-adrenal)"
      ]
    },
    medications: [
      { name: "Alteplase (tPA)", type: "Fibrinolytic (thrombolytic)", action: "Tissue plasminogen activator that converts plasminogen to plasmin, dissolving fibrin clots; achieves vessel recanalization in acute ischemic stroke and massive PE", sideEffects: "Hemorrhage (intracranial most feared), angioedema (especially with concurrent ACE inhibitor), reperfusion arrhythmias", contra: "Active internal bleeding, recent intracranial surgery/trauma (<3 months), history of hemorrhagic stroke, uncontrolled HTN (>185/110 for stroke), platelet count <100,000, INR >1.7", pearl: "For ischemic stroke: 0.9 mg/kg (max 90mg), 10% as IV bolus, remainder over 60 minutes; must be given within 4.5 hours of symptom onset; door-to-needle time goal <60 minutes" },
      { name: "Colchicine", type: "Anti-inflammatory (gout and pericarditis)", action: "Inhibits microtubule polymerization, disrupting neutrophil migration, adhesion, and phagocytosis; reduces crystal-mediated inflammation in gout and pericarditis", sideEffects: "GI symptoms (diarrhea, nausea, vomiting are dose-limiting), bone marrow suppression with chronic use, myopathy, neuropathy", contra: "Severe renal or hepatic impairment with concurrent P-gp or CYP3A4 inhibitors, concurrent colchicine with clarithromycin or cyclosporine", pearl: "For acute gout: 1.2mg at onset, then 0.6mg 1 hour later (total 1.8mg); much lower dose than historical high-dose regimens; also used as adjunct for acute pericarditis to reduce recurrence (COPE trial)" },
      { name: "Nitroglycerin", type: "Organic nitrate (vasodilator)", action: "Releases nitric oxide, causing venous dilation (reduced preload) at low doses and arterial dilation (reduced afterload) at higher doses; coronary artery vasodilation improves myocardial oxygen supply", sideEffects: "Headache, hypotension, reflex tachycardia, dizziness, syncope, methemoglobinemia (rare)", contra: "Concurrent PDE5 inhibitor use (sildenafil, tadalafil) within 24-48 hours (severe hypotension), right ventricular infarction, severe aortic stenosis, hypertrophic cardiomyopathy with obstruction", pearl: "Sublingual onset 1-3 minutes; if chest pain unrelieved after 1 dose, call 911; tolerance develops with continuous use — provide 10-12 hour nitrate-free interval daily" },
      { name: "Prednisone", type: "Systemic corticosteroid", action: "Suppresses inflammatory and immune responses by inhibiting phospholipase A2, reducing prostaglandin and leukotriene synthesis; stabilizes lysosomal membranes; reduces capillary permeability", sideEffects: "Hyperglycemia, osteoporosis, adrenal suppression, immunosuppression, GI ulceration, mood changes, insomnia, weight gain, cataracts, skin thinning", contra: "Systemic fungal infections, live vaccines during high-dose therapy, untreated infections", pearl: "Taper gradually after >2 weeks of use to prevent adrenal crisis; morning dosing mimics physiologic cortisol rhythm; prescribe PPI for GI protection and calcium/vitamin D for bone protection with chronic use" }
    ],
    pearls: [
      "The 'Big 6' must-not-miss diagnoses for acute chest pain: MI, aortic dissection, PE, tension pneumothorax, cardiac tamponade, and esophageal rupture — all require rapid identification to prevent death",
      "Aortic dissection is the great mimicker: it can present as MI (coronary ostia involvement), stroke (carotid involvement), acute limb ischemia (iliac involvement), or renal failure (renal artery involvement)",
      "A negative D-dimer (with appropriate pretest probability per PERC or Wells) effectively rules out PE/DVT; however, D-dimer loses utility in hospitalized patients, post-surgical patients, and those with active malignancy",
      "In acute monoarticular arthritis, always perform arthrocentesis to rule out septic arthritis before attributing to gout or pseudogout; septic arthritis is a surgical emergency",
      "Troponin elevation is NOT specific for MI: other causes include PE, myocarditis, heart failure, renal failure, sepsis, and demand ischemia — clinical context determines the diagnosis",
      "Temporal arteritis (giant cell arteritis) in patients >50 with new headache, jaw claudication, visual changes, or elevated ESR >50 requires immediate empiric corticosteroids pending temporal artery biopsy to prevent irreversible blindness",
      "The HEART score (History, ECG, Age, Risk factors, Troponin) stratifies chest pain patients: 0-3 = low risk (safe for discharge with follow-up), 4-6 = moderate (observation), 7-10 = high risk (admission and intervention)",
      "Ectopic pregnancy must be on the differential for any reproductive-age female presenting with abdominal/pelvic pain — always obtain a beta-hCG before imaging"
    ],
    quiz: [
      { question: "A 70-year-old presents with acute onset severe tearing chest pain radiating to the back. BP is 190/110 in the right arm and 150/90 in the left arm. What is the most likely diagnosis?", options: ["Acute myocardial infarction", "Aortic dissection", "Pulmonary embolism", "Esophageal rupture"], correct: 1, rationale: "Severe tearing/ripping chest/back pain with >20 mmHg blood pressure differential between arms is highly suspicious for aortic dissection. CT angiography or TEE confirms diagnosis. Immediate BP control with IV esmolol and nitroprusside." },
      { question: "A client presents with fever, new heart murmur, Janeway lesions, and splinter hemorrhages. Blood cultures grow Streptococcus viridans. What is the diagnosis?", options: ["Acute rheumatic fever", "Infective endocarditis (subacute)", "Myocarditis", "Pericarditis"], correct: 1, rationale: "Modified Duke criteria: 2 major (positive blood cultures + endocardial involvement on echo) or 1 major + 3 minor establish diagnosis. S. viridans is the most common cause of subacute IE on native valves." },
      { question: "A 30-year-old female presents with fatigue, joint pain, malar rash, and a positive ANA. Anti-dsDNA is elevated. What should the clinician order to complete the workup?", options: ["Rheumatoid factor only", "Complement levels (C3, C4), CBC, urinalysis, and anti-Smith antibodies", "HLA-B27 testing", "ESR alone"], correct: 1, rationale: "SLE workup includes complement levels (low in active disease), CBC (cytopenias), urinalysis (proteinuria/casts for lupus nephritis), anti-Smith (highly specific for SLE), and anti-dsDNA (correlates with disease activity and nephritis)." },
      { question: "A client presents with progressive dyspnea, dry cough, and clubbing. High-resolution CT shows honeycombing and ground-glass opacities. Pulmonary function tests show a restrictive pattern. What is the most likely diagnosis?", options: ["COPD", "Idiopathic pulmonary fibrosis (IPF)", "Asthma", "Sarcoidosis"], correct: 1, rationale: "IPF presents with progressive dyspnea, dry cough, clubbing, velcro-like crackles, restrictive PFTs (decreased FVC, normal FEV1/FVC ratio), and UIP pattern on HRCT (honeycombing, traction bronchiectasis, ground-glass opacities)." },
      { question: "A client presents with epigastric pain that worsens with eating, early satiety, and weight loss. H. pylori testing is positive. What is the appropriate treatment the clinician should prescribe?", options: ["PPI monotherapy for 8 weeks", "Triple therapy: PPI + amoxicillin + clarithromycin for 14 days", "H2 blocker alone", "Sucralfate without antimicrobials"], correct: 1, rationale: "H. pylori eradication requires combination therapy. First-line: PPI + amoxicillin + clarithromycin (or metronidazole) for 14 days. Bismuth quadruple therapy is an alternative. Confirm eradication with urea breath test 4 weeks after treatment." },
      { question: "A 25-year-old presents with recurrent episodes of unilateral throbbing headache with aura, nausea, and photophobia occurring 8 days per month. What preventive medication should the clinician prescribe?", options: ["Acetaminophen daily", "Topiramate, propranolol, or amitriptyline", "Sumatriptan daily", "Ibuprofen around the clock"], correct: 1, rationale: "Migraine preventive therapy is indicated when attacks occur >4 days/month, are disabling, or abortive therapy fails. First-line preventives: beta-blockers (propranolol), anticonvulsants (topiramate, valproate), TCAs (amitriptyline), or CGRP mAbs." },
      { question: "A client with a BMI of 32 presents with snoring, witnessed apneas, and excessive daytime sleepiness. The Epworth Sleepiness Scale is 15. What should the clinician order?", options: ["Trial of sedative medication", "Polysomnography (sleep study)", "Chest X-ray", "Thyroid function tests only"], correct: 1, rationale: "Classic OSA presentation: obesity, snoring, witnessed apneas, daytime sleepiness (ESS >10). Polysomnography (or home sleep apnea testing for uncomplicated cases) confirms diagnosis with AHI quantification. CPAP is first-line treatment." },
      { question: "A 60-year-old male presents with progressive difficulty initiating urination, weak stream, nocturia, and incomplete emptying. DRE reveals a smooth, enlarged prostate. PSA is 2.8 ng/mL. What is the initial pharmacologic management?", options: ["Immediate surgical referral", "Alpha-blocker (tamsulosin) with or without 5-alpha reductase inhibitor", "Antibiotics for prostatitis", "Observation only"], correct: 1, rationale: "Benign prostatic hyperplasia (BPH) with moderate-severe LUTS: alpha-blockers (tamsulosin, alfuzosin) relax smooth muscle for rapid symptom relief. 5-alpha reductase inhibitors (finasteride, dutasteride) shrink the prostate over 6-12 months for large glands." },
    ],
  },
  "np-testbank-emergency-management": {
    title: "Emergency & Complex Management Test Bank",
    cellular: {
      title: "Emergency and Complex Clinical Management",
      content: "Emergency and complex management requires the clinician to rapidly assess, diagnose, and initiate treatment for life-threatening conditions. The approach follows the systematic ABCDE framework: Airway, Breathing, Circulation, Disability (neurologic), and Exposure.\n\nSepsis and Septic Shock: Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection (Sepsis-3 criteria using SOFA score ≥2). Septic shock adds persistent hypotension requiring vasopressors to maintain MAP ≥65 mmHg AND serum lactate >2 mmol/L despite adequate volume resuscitation. The Surviving Sepsis Campaign Hour-1 Bundle includes: measure lactate, obtain blood cultures before antibiotics, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid for hypotension or lactate ≥4, and apply vasopressors for MAP <65 despite fluids.\n\nAcute Coronary Syndromes: The spectrum includes unstable angina (no biomarker elevation), NSTEMI (troponin elevation without ST elevation), and STEMI (troponin elevation with ST elevation in ≥2 contiguous leads). Time-dependent management for STEMI targets door-to-balloon <90 minutes for primary PCI or door-to-needle <30 minutes for fibrinolytics when PCI unavailable.\n\nDiabetic Emergencies: DKA presents with hyperglycemia (usually >250 mg/dL), metabolic acidosis (pH <7.3, HCO3 <18), ketonemia/ketonuria, and anion gap elevation. The pathophysiology involves absolute insulin deficiency leading to lipolysis and ketogenesis. HHS (hyperosmolar hyperglycemic state) presents with extreme hyperglycemia (>600 mg/dL), hyperosmolarity (>320 mOsm/kg), and minimal ketosis, typically in type 2 diabetes.\n\nElectrolyte Emergencies: Severe hyponatremia (<120 mEq/L) risks cerebral edema and seizures. Correction must not exceed 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome (central pontine myelinolysis). Severe hyperkalemia (>6.5 mEq/L) with ECG changes (peaked T waves, widened QRS, sine wave) is immediately life-threatening. Treatment sequence: (1) calcium gluconate for cardiac membrane stabilization, (2) insulin + D50 to shift potassium intracellularly, (3) sodium bicarbonate if acidotic, (4) kayexalate or patiromer for GI elimination, and (5) emergent dialysis if refractory.\n\nStatus Epilepticus: Defined as seizure activity lasting >5 minutes or ≥2 seizures without return to baseline. First-line: IV benzodiazepines (lorazepam 4mg or diazepam 10mg). Second-line: fosphenytoin, valproate, or levetiracetam. Refractory status epilepticus requires continuous infusion (midazolam, propofol, or pentobarbital) with continuous EEG monitoring."
    },
    riskFactors: [
      "Delayed recognition of sepsis leading to increased mortality (each hour delay in antibiotics increases mortality 7.6%)",
      "Missed STEMI due to atypical presentation (elderly, women, diabetics may lack typical chest pain)",
      "Inappropriate insulin administration in DKA with hypokalemia (<3.3 mEq/L) risking cardiac arrest",
      "Rapid correction of chronic hyponatremia causing osmotic demyelination syndrome",
      "Failure to recognize and treat tension pneumothorax (clinical diagnosis, do not delay for imaging)",
      "Missed massive PE in patients with unexplained hemodynamic instability",
      "Inadequate fluid resuscitation volume in septic shock (minimum 30 mL/kg crystalloid)",
      "Over-reliance on fever for infection identification (immunocompromised patients may be afebrile with severe infection)"
    ],
    diagnostics: [
      "Serum lactate: marker of tissue hypoperfusion (>2 mmol/L concerning, >4 mmol/L severe; repeat to assess clearance)",
      "Procalcitonin: bacterial infection marker for antibiotic initiation and de-escalation (>0.5 ng/mL suggests bacterial cause)",
      "Arterial blood gas (ABG): pH, PaCO2, PaO2, HCO3, base excess for acid-base status and oxygenation",
      "Serum osmolality: calculated (2Na + glucose/18 + BUN/2.8) vs measured; osmolar gap >10 suggests toxic alcohol ingestion",
      "Anion gap: Na - (Cl + HCO3); normal 8-12; elevated in MUDPILES (Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates)",
      "Troponin with serial measurements (0h and 3h or high-sensitivity 0h and 1h protocol) for acute coronary syndrome",
      "CT pulmonary angiography (CTPA) for PE in hemodynamically stable patients with high pretest probability",
      "Bedside echocardiography (POCUS): assess cardiac function, pericardial effusion, RV strain, IVC for volume status",
      "Serum ammonia level for hepatic encephalopathy (correlates poorly with clinical severity but supports diagnosis)",
      "Blood cultures (2 sets from 2 sites) before antibiotics in suspected sepsis/bacteremia"
    ],
    management: [
      "Apply Hour-1 Sepsis Bundle: lactate, blood cultures, broad-spectrum antibiotics, 30 mL/kg crystalloid, vasopressors for MAP <65",
      "STEMI: activate cath lab, dual antiplatelet therapy (aspirin + P2Y12 inhibitor), anticoagulation, beta-blocker (if no contraindication), door-to-balloon <90 min",
      "DKA protocol: aggressive IV fluid resuscitation (NS initially), insulin drip (0.1 units/kg/hr after potassium confirmed >3.3), potassium replacement, monitor glucose hourly and electrolytes q2-4h",
      "Severe hyperkalemia: stabilize myocardium (calcium gluconate), shift potassium (insulin/D50, albuterol, bicarb), remove potassium (kayexalate, loop diuretics, dialysis)",
      "Status epilepticus: benzodiazepine immediately, if refractory add fosphenytoin/levetiracetam, if still refractory intubate and continuous infusion with EEG monitoring",
      "Massive PE with hemodynamic instability: systemic thrombolysis (alteplase 100mg over 2h) or catheter-directed therapy if available",
      "Adrenal crisis: IV hydrocortisone 100mg bolus, aggressive NS resuscitation, identify and treat precipitating cause",
      "Thyroid storm: sequential treatment — beta-blocker, PTU, iodine solution (1 hour after PTU), corticosteroids"
    ],
    nursingActions: [
      "Perform rapid primary survey (ABCDE) and stabilize life-threatening conditions immediately",
      "Establish large-bore IV access (two 18-gauge or larger) and initiate fluid resuscitation as indicated",
      "Continuously monitor vital signs, cardiac rhythm, pulse oximetry, and end-tidal CO2 when applicable",
      "Calculate and administer weight-based medications accurately (tPA, heparin, insulin drips)",
      "Monitor intake and output strictly; target urine output ≥0.5 mL/kg/hr as a marker of adequate perfusion",
      "Perform frequent neurological assessments (GCS, pupil reactivity) in altered mental status patients",
      "Prepare for and assist with emergent procedures: intubation, central line placement, chest tube insertion, cardioversion",
      "Communicate effectively using SBAR format when reporting critical findings or requesting urgent consultation"
    ],
    signs: {
      left: [
        "Sepsis: fever/hypothermia, tachycardia, tachypnea, altered mental status, warm/flushed skin (early) or cool/mottled (late)",
        "DKA: Kussmaul respirations (deep, rapid), fruity breath (acetone), abdominal pain, nausea/vomiting, polyuria, altered LOC",
        "Hyperkalemia ECG progression: peaked T waves → PR prolongation → widened QRS → sine wave → asystole",
        "Tension pneumothorax: absent breath sounds (affected side), tracheal deviation (away), JVD, hypotension, hyperresonance",
        "Massive PE: acute dyspnea, pleuritic chest pain, hemodynamic collapse, JVD, RV dilation on echo, S1Q3T3 on ECG",
        "Adrenal crisis: severe hypotension refractory to fluids, hyperkalemia, hyponatremia, hypoglycemia, abdominal pain",
        "Thyroid storm: hyperthermia >40°C, severe tachycardia, atrial fibrillation, agitation/delirium, heart failure, jaundice (late)",
        "Malignant hyperthermia: masseter rigidity, rapidly rising temperature, metabolic/respiratory acidosis, rhabdomyolysis"
      ],
      right: [
        "Cardiac tamponade: Beck triad (hypotension, muffled sounds, JVD), electrical alternans, pulsus paradoxus",
        "Hyponatremia seizures: sodium <120, cerebral edema, altered LOC, seizures; treat with 3% hypertonic saline 100mL bolus",
        "Status epilepticus: continuous seizure >5 minutes, postictal Todd paralysis, metabolic acidosis, hyperthermia, rhabdomyolysis",
        "Acute liver failure: coagulopathy (INR >1.5), encephalopathy (asterixis, confusion), jaundice, elevated ammonia",
        "Aortic dissection: tearing pain to back, BP differential >20 mmHg, acute aortic regurgitation, pulse deficit",
        "Cardiogenic shock: cold/clammy skin, elevated JVP, pulmonary edema, low cardiac output, elevated PCWP, elevated SVR",
        "Anaphylaxis: urticaria, angioedema, bronchospasm, hypotension, GI symptoms; treat with IM epinephrine 0.3-0.5mg mid-anterolateral thigh",
        "Acute mesenteric ischemia: severe abdominal pain 'out of proportion to exam,' bloody diarrhea (late), metabolic acidosis, elevated lactate"
      ]
    },
    medications: [
      { name: "Norepinephrine (Levophed)", type: "Vasopressor (alpha-1 and beta-1 agonist)", action: "Potent alpha-1 adrenergic agonist causing arterial and venous vasoconstriction; moderate beta-1 agonism increases cardiac contractility and heart rate; raises MAP and SVR", sideEffects: "Tissue necrosis with extravasation, peripheral ischemia, arrhythmias, hypertension, reflex bradycardia", contra: "Hypovolemia (must volume resuscitate first), mesenteric or peripheral vascular thrombosis (relative)", pearl: "First-line vasopressor for septic shock per Surviving Sepsis Campaign; must be given through central venous access (peripheral use only as bridge); if extravasation occurs, infiltrate area with phentolamine" },
      { name: "Dantrolene", type: "Skeletal muscle relaxant (direct-acting)", action: "Inhibits calcium release from the sarcoplasmic reticulum via ryanodine receptor antagonism, reducing skeletal muscle contraction and thermogenesis in malignant hyperthermia", sideEffects: "Muscle weakness, drowsiness, dizziness, hepatotoxicity with chronic use, phlebitis at IV site", contra: "Active liver disease (for chronic oral use), conditions requiring maintained muscle tone", pearl: "Specific antidote for malignant hyperthermia: 2.5 mg/kg IV bolus, repeat every 5-10 minutes until symptoms resolve (no maximum dose in MH crisis); requires reconstitution with sterile water (60mL per 20mg vial) — time-consuming, start immediately" },
      { name: "Vasopressin (ADH)", type: "Non-catecholamine vasopressor", action: "Acts on V1 receptors in vascular smooth muscle causing vasoconstriction independent of catecholamine pathways; V2 receptor activation in collecting duct promotes water reabsorption", sideEffects: "Digital ischemia, mesenteric ischemia, hyponatremia, skin necrosis, cardiac ischemia", contra: "Known hypersensitivity, responsive septic shock (use as adjunct, not first-line)", pearl: "Fixed dose of 0.03-0.04 units/min in septic shock (do not titrate); added to norepinephrine to achieve target MAP and allow catecholamine dose reduction; may be used in cardiac arrest per ACLS (40 units IV push replacing first or second dose of epinephrine)" },
      { name: "Epinephrine (Adrenaline)", type: "Sympathomimetic (alpha and beta agonist)", action: "Non-selective adrenergic agonist: alpha-1 (vasoconstriction), beta-1 (increased HR and contractility), beta-2 (bronchodilation, vasodilation at low doses); reverses anaphylaxis through multiple mechanisms", sideEffects: "Tachycardia, hypertension, arrhythmias, anxiety, tremor, hyperglycemia, myocardial ischemia", contra: "No absolute contraindications in anaphylaxis or cardiac arrest", pearl: "IM epinephrine (0.3-0.5mg of 1:1,000) is first-line for anaphylaxis — give immediately, repeat q5-15 min; IV push in cardiac arrest (1mg of 1:10,000 q3-5 min); never give 1:1,000 concentration IV (use 1:10,000 only)" },
      { name: "Calcium Gluconate 10%", type: "Electrolyte replacement / cardiac membrane stabilizer", action: "Directly antagonizes the membrane effects of hyperkalemia on cardiac myocytes, raising the threshold potential and stabilizing the cardiac membrane; does NOT lower serum potassium", sideEffects: "Bradycardia with rapid infusion, hypercalcemia, tissue necrosis with extravasation, cardiac arrest if given too rapidly", contra: "Hypercalcemia, concurrent digitalis therapy (relative — may precipitate digoxin toxicity; use with extreme caution)", pearl: "First medication given in severe hyperkalemia with ECG changes — onset within 1-3 minutes, duration 30-60 minutes; administer 10 mL of 10% solution over 2-3 minutes; must follow with potassium-lowering therapies (insulin/D50, albuterol, kayexalate)" }
    ],
    pearls: [
      "In septic shock, every hour delay in antibiotic administration increases mortality by approximately 7.6% — administer broad-spectrum antibiotics within 1 hour of recognition, even before culture results",
      "Never start insulin in DKA until potassium is confirmed >3.3 mEq/L — insulin drives potassium intracellularly and can cause fatal hypokalemia and cardiac arrest",
      "Chronic hyponatremia correction must not exceed 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome (central pontine myelinolysis) — if overcorrected, administer desmopressin (DDAVP) to re-lower sodium",
      "Tension pneumothorax is a CLINICAL diagnosis — do not delay treatment for imaging; perform needle decompression at the 2nd intercostal space, midclavicular line, followed by chest tube placement",
      "In massive PE with hemodynamic instability, systemic thrombolysis with alteplase (100mg IV over 2 hours) is indicated even with relative contraindications when the patient is in extremis",
      "The treatment sequence for thyroid storm is critical: beta-blocker FIRST (symptom control), then PTU (blocks synthesis AND peripheral conversion), then iodine solution ONE HOUR after PTU (blocks hormone release, but if given before PTU, provides substrate for more hormone), then corticosteroids (blocks T4-to-T3 conversion and treats relative adrenal insufficiency)",
      "In right ventricular infarction (inferior STEMI with right-sided ST elevation in V4R), avoid nitroglycerin and diuretics as they reduce preload, worsening RV output; administer IV fluids to maintain preload",
      "Calcium gluconate in hyperkalemia stabilizes the cardiac membrane but does NOT lower potassium — always follow with potassium-shifting agents (insulin/dextrose, albuterol) and elimination therapies (kayexalate, dialysis)"
    ],
    quiz: [
      { question: "A client in the ED has a serum sodium of 118 mEq/L. At what rate should the clinician correct the sodium to prevent osmotic demyelination syndrome?", options: ["Rapid correction at 3-4 mEq/L per hour", "No more than 8-10 mEq/L in the first 24 hours", "Correct to 140 mEq/L within 6 hours", "Rate of correction is not important"], correct: 1, rationale: "Rapid correction of chronic hyponatremia risks osmotic demyelination syndrome (central pontine myelinolysis). Limit correction to 8-10 mEq/L in 24 hours (some guidelines say 6-8). Use 3% hypertonic saline with frequent sodium monitoring." },
      { question: "A client presents with DKA. The initial potassium is 3.2 mEq/L. What should the clinician do before starting insulin?", options: ["Start insulin drip immediately", "Replace potassium first; hold insulin until potassium is >3.3 mEq/L", "Administer sodium bicarbonate", "Start oral potassium supplements"], correct: 1, rationale: "Insulin drives potassium intracellularly. Starting insulin with a potassium <3.3 mEq/L can cause life-threatening hypokalemia and cardiac arrest. Replace potassium (20-40 mEq/hr IV) until >3.3 before initiating insulin." },
      { question: "A postoperative client develops a temperature of 40.2 C, muscle rigidity, tachycardia, and metabolic acidosis after receiving succinylcholine. What is the diagnosis and treatment?", options: ["Sepsis; start antibiotics", "Malignant hyperthermia; administer dantrolene", "Neuroleptic malignant syndrome; give bromocriptine", "Serotonin syndrome; give cyproheptadine"], correct: 1, rationale: "Malignant hyperthermia is triggered by volatile anesthetics or succinylcholine in genetically susceptible individuals. Pathophysiology involves uncontrolled calcium release in skeletal muscle. Dantrolene (2.5 mg/kg IV) is the specific antidote." },
      { question: "A client with suspected pulmonary embolism has a Wells score of 8 and is hemodynamically unstable. What should the clinician order?", options: ["D-dimer testing", "CT pulmonary angiography", "Systemic thrombolysis with alteplase", "Observation with heparin only"], correct: 2, rationale: "Massive PE (hemodynamically unstable) is a medical emergency. Systemic thrombolysis (alteplase 100mg IV over 2 hours) is indicated for massive PE with hemodynamic instability (hypotension, shock) when benefits outweigh bleeding risk." },
      { question: "An NP is managing a client with acute liver failure. Which lab value indicates the most severe coagulopathy?", options: ["Albumin of 3.0 g/dL", "INR >5.0 with elevated ammonia", "Slightly elevated AST", "Mildly elevated bilirubin"], correct: 1, rationale: "In acute liver failure, INR is the most sensitive marker of synthetic function and coagulopathy. INR >5.0 with elevated ammonia and encephalopathy indicates severe hepatocellular failure requiring ICU management and transplant evaluation." },
      { question: "A client with acute adrenal crisis presents with severe hypotension, hyperkalemia, and hyponatremia. What is the immediate treatment?", options: ["IV normal saline and oral prednisone", "IV hydrocortisone 100mg bolus, aggressive IV fluid resuscitation, and vasopressors if needed", "Fludrocortisone oral only", "Potassium replacement"], correct: 1, rationale: "Adrenal crisis requires emergent IV hydrocortisone (100mg bolus then 50mg q8h), aggressive IV NS resuscitation (often 1-2L in first hour), and vasopressors if unresponsive to fluids. Do NOT wait for cortisol levels to treat." },
      { question: "A client with thyroid storm presents with fever of 40.5 C, tachycardia at 160 bpm, altered mental status, and atrial fibrillation. What is the correct order of treatment?", options: ["Methimazole alone", "Beta-blocker first, then thionamide (PTU preferred), then iodine solution 1 hour later, then corticosteroids", "Radioactive iodine ablation", "Thyroidectomy immediately"], correct: 1, rationale: "Thyroid storm treatment order: (1) beta-blocker (propranolol) for symptomatic relief, (2) PTU (preferred over methimazole; blocks synthesis AND peripheral T4-to-T3 conversion), (3) iodine solution 1 hour after PTU (blocks hormone release), (4) corticosteroids (block T4-to-T3 conversion)." },
      { question: "A client presents with crushing substernal chest pain. ECG shows ST elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?", options: ["Left anterior descending (LAD)", "Left circumflex (LCx)", "Right coronary artery (RCA)", "Left main coronary artery"], correct: 2, rationale: "ST elevation in inferior leads (II, III, aVF) indicates inferior MI, most commonly caused by RCA occlusion (85% of cases). Always check right-sided leads (V4R) for right ventricular involvement. Avoid nitroglycerin and volume depletion in RV infarction." },
    ],
    preTest: [
      { question: "A client has the following ABG: pH 7.22, PaCO2 28, HCO3 12, PaO2 92. What is the acid-base disturbance?", options: ["Respiratory acidosis", "Metabolic acidosis with respiratory compensation", "Mixed respiratory and metabolic alkalosis", "Normal ABG"], correct: 1, rationale: "pH 7.22 (acidotic), PaCO2 28 (low, indicating hyperventilation/compensation), HCO3 12 (low, metabolic cause). This is primary metabolic acidosis with respiratory compensation (Kussmaul breathing). Calculate anion gap to determine the cause." },
      { question: "A client with acute pancreatitis has a lipase level of 1,800 U/L and a CT scan showing >30% pancreatic necrosis. What is the Balthazar CT severity index classification?", options: ["Mild pancreatitis", "Moderate pancreatitis", "Severe pancreatitis with necrosis requiring close monitoring", "Normal findings"], correct: 2, rationale: "Pancreatic necrosis >30% on CT significantly increases mortality and morbidity. The Balthazar CT severity index combines inflammation grade (A-E) and necrosis percentage. >30% necrosis carries a 25% mortality risk. Consider ICU admission and serial reassessment." },
    ],
  },
};

export { npExtraBank };
