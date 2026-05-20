import type { LessonContent } from "./types";

export const pharmacologyCardioRespLessons: Record<string, LessonContent> = {
  "pharm-cardiovascular": {
    title: "Cardiovascular Pharmacology",
    cellular: {
      title: "Cardiovascular Drug Mechanisms at the",
      content: "Cardiovascular drugs target specific cellular receptors and ion channels to modulate cardiac output, vascular resistance, and blood coagulation. ACE inhibitors block the conversion of angiotensin I to angiotensin II at the endothelial cell surface, reducing vasoconstriction and aldosterone secretion. Beta-adrenergic blockers competitively inhibit catecholamine binding at beta-1 receptors on cardiac myocytes, decreasing heart rate and contractility. Calcium channel blockers prevent calcium influx through L-type voltage-gated channels in vascular smooth muscle and cardiac conduction tissue, producing vasodilation and rate control. Anticoagulants interfere with the coagulation cascade at various points, from thrombin inhibition to vitamin K-dependent factor synthesis, while antiplatelet agents inhibit platelet aggregation through cyclooxygenase or ADP receptor blockade."
    },
    riskFactors: [
      "Polypharmacy increases risk of drug-drug interactions with cardiovascular medications",
      "Renal impairment requires dose adjustment for ACE inhibitors, ARBs, digoxin, and DOACs",
      "Hepatic dysfunction affects metabolism of warfarin, statins, and amiodarone",
      "Electrolyte imbalances potentiate toxicity of digoxin and antiarrhythmics",
      "Advanced age increases sensitivity to antihypertensives and anticoagulants",
      "Genetic polymorphisms in CYP2C19 affect clopidogrel activation"
    ],
    diagnostics: [
      "INR monitoring for warfarin therapy (target 2.0-3.0 for most indications)",
      "aPTT monitoring for unfractionated heparin infusion",
      "Anti-Xa levels for LMWH monitoring in renal impairment or obesity",
      "Serum potassium monitoring with ACE inhibitors, ARBs, and potassium-sparing diuretics",
      "Lipid panel monitoring 4-12 weeks after statin initiation",
      "Liver function tests before and during statin therapy",
      "Thyroid function tests and pulmonary function with amiodarone",
      "Serum creatinine and BUN with ACE inhibitors and diuretics",
      "CBC with platelet count for anticoagulant and antiplatelet therapy"
    ],
    management: [
      "Titrate antihypertensives gradually to avoid orthostatic hypotension",
      "Hold ACE inhibitors if potassium exceeds 5.5 mEq/L",
      "Reverse warfarin with vitamin K or fresh frozen plasma for active bleeding",
      "Protamine sulfate reverses heparin; idarucizumab reverses dabigatran",
      "Do not abruptly discontinue beta blockers due to rebound tachycardia risk",
      "Administer IV furosemide slowly to prevent ototoxicity",
      "Monitor for signs of bleeding with all anticoagulant and antiplatelet therapy"
    ],
    nursingActions: [
      "Assess blood pressure before administering antihypertensives",
      "Monitor heart rate before giving beta blockers; hold if HR below 60 bpm",
      "Educate patients on consistent vitamin K intake with warfarin therapy",
      "Teach patients to rise slowly to prevent orthostatic hypotension",
      "Monitor I&O and daily weights with diuretic therapy",
      "Assess for signs of bleeding: bruising, petechiae, hematuria, melena",
      "Educate on the importance of not doubling doses if a dose is missed"
    ],
    assessmentFindings: [
      "Dry cough with ACE inhibitors (switch to ARB if intolerable)",
      "Peripheral edema reduction indicates effective diuretic therapy",
      "Bradycardia with beta blockers and non-DHP calcium channel blockers",
      "Gingival hyperplasia with calcium channel blockers",
      "Muscle pain or weakness may indicate statin-induced myopathy"
    ],
    signs: {
      left: [
        "Hypotension and dizziness from excessive antihypertensive effect",
        "Hyperkalemia (peaked T waves, muscle weakness) with ACE inhibitors or potassium-sparing diuretics",
        "Dry persistent cough as a hallmark ACE inhibitor side effect",
        "Bleeding complications from anticoagulant or antiplatelet therapy",
        "Hepatotoxicity presenting as jaundice or elevated transaminases with statins",
        "Pulmonary toxicity (dyspnea, dry cough) with long-term amiodarone use"
      ],
      right: [
        "Therapeutic blood pressure reduction (goal typically below 130/80 mmHg)",
        "INR within target range (2.0-3.0) indicating effective warfarin therapy",
        "Decreased LDL cholesterol levels with statin therapy",
        "Resolution of edema and decreased daily weight with diuretic therapy",
        "Stable heart rate between 60-100 bpm with rate-control agents",
        "Absence of thromboembolic events with anticoagulant therapy"
      ]
    },
    medications: [
      {
        name: "Lisinopril",
        type: "ACE Inhibitor (Antihypertensive)",
        action: "Blocks conversion of angiotensin I to angiotensin II, reducing vasoconstriction and aldosterone secretion, lowering blood pressure and cardiac afterload",
        sideEffects: "Dry persistent cough, hyperkalemia, angioedema, dizziness, hypotension, elevated creatinine",
        contra: "Pregnancy (teratogenic), bilateral renal artery stenosis, history of angioedema, concurrent use with aliskiren in diabetic patients",
        pearl: "Dry cough occurs in up to 20% of patients due to bradykinin accumulation; switch to an ARB if intolerable. Monitor potassium and renal function within 1-2 weeks of initiation."
      },
      {
        name: "Losartan",
        type: "Angiotensin II Receptor Blocker (ARB)",
        action: "Selectively blocks angiotensin II at the AT1 receptor, preventing vasoconstriction and aldosterone release without affecting bradykinin metabolism",
        sideEffects: "Hyperkalemia, hypotension, dizziness, elevated creatinine, rarely angioedema",
        contra: "Pregnancy, bilateral renal artery stenosis, concurrent use with ACE inhibitors or aliskiren in diabetic patients",
        pearl: "ARBs do not cause the dry cough associated with ACE inhibitors because they do not affect bradykinin levels. Often used as first-line alternative when ACE inhibitors are not tolerated."
      },
      {
        name: "Metoprolol",
        type: "Beta-1 Selective Blocker (Class II Antiarrhythmic)",
        action: "Selectively blocks beta-1 adrenergic receptors in the heart, reducing heart rate, contractility, and myocardial oxygen demand. Also suppresses AV node conduction.",
        sideEffects: "Bradycardia, hypotension, fatigue, depression, bronchospasm at higher doses, sexual dysfunction, masking of hypoglycemia symptoms",
        contra: "Severe bradycardia, second or third-degree heart block, decompensated heart failure, cardiogenic shock",
        pearl: "Never abruptly discontinue beta blockers as this can cause rebound tachycardia, hypertension, and myocardial ischemia. Taper over 1-2 weeks. Beta-1 selectivity is lost at higher doses."
      },
      {
        name: "Amlodipine",
        type: "Dihydropyridine Calcium Channel Blocker",
        action: "Blocks L-type calcium channels in vascular smooth muscle, causing vasodilation and reducing peripheral vascular resistance and blood pressure",
        sideEffects: "Peripheral edema, flushing, headache, dizziness, reflex tachycardia, gingival hyperplasia",
        contra: "Severe aortic stenosis, unstable angina without concurrent beta blocker",
        pearl: "Dihydropyridine CCBs primarily affect vascular smooth muscle (vasodilation) rather than cardiac conduction. Peripheral edema is dose-dependent and not related to heart failure. Grapefruit juice increases drug levels."
      },
      {
        name: "Diltiazem",
        type: "Non-Dihydropyridine Calcium Channel Blocker (Class IV Antiarrhythmic)",
        action: "Blocks calcium channels in both cardiac and vascular smooth muscle, reducing heart rate, AV node conduction, and peripheral vascular resistance",
        sideEffects: "Bradycardia, hypotension, constipation, AV block, peripheral edema, dizziness",
        contra: "Severe bradycardia, second or third-degree AV block, sick sinus syndrome, concurrent IV beta blocker use, systolic heart failure",
        pearl: "Non-DHP CCBs (diltiazem, verapamil) have significant cardiac effects unlike DHPs. Never combine IV diltiazem with IV beta blockers due to risk of severe bradycardia and asystole. Useful for rate control in atrial fibrillation."
      },
      {
        name: "Verapamil",
        type: "Non-Dihydropyridine Calcium Channel Blocker (Class IV Antiarrhythmic)",
        action: "Blocks calcium channels primarily in cardiac tissue, decreasing SA and AV node conduction velocity, heart rate, and myocardial contractility",
        sideEffects: "Constipation (most common), bradycardia, hypotension, AV block, heart failure exacerbation, peripheral edema",
        contra: "Heart failure with reduced ejection fraction, severe bradycardia, second or third-degree AV block, concurrent beta blocker use, ventricular tachycardia",
        pearl: "Verapamil has the strongest negative inotropic effect among CCBs. Constipation is the most common side effect and may require stool softeners. Contraindicated in wide-complex tachycardia of unknown origin."
      },
      {
        name: "Hydrochlorothiazide (HCTZ)",
        type: "Thiazide Diuretic",
        action: "Inhibits sodium-chloride cotransporter in the distal convoluted tubule, increasing excretion of sodium, chloride, and water, thereby reducing blood volume and blood pressure",
        sideEffects: "Hypokalemia, hyponatremia, hyperglycemia, hyperuricemia (gout exacerbation), hypercalcemia, photosensitivity, increased cholesterol",
        contra: "Anuria, severe renal impairment (GFR less than 30 mL/min), sulfonamide allergy (cross-sensitivity possible), refractory hypokalemia",
        pearl: "Thiazides lose effectiveness in severe renal impairment (GFR below 30). They cause hypercalcemia (useful in patients with osteoporosis) while loop diuretics cause hypocalcemia. Monitor electrolytes regularly."
      },
      {
        name: "Furosemide",
        type: "Loop Diuretic",
        action: "Inhibits sodium-potassium-chloride cotransporter in the thick ascending loop of Henle, producing potent diuresis and reducing preload in heart failure",
        sideEffects: "Hypokalemia, hyponatremia, hypocalcemia, hypomagnesemia, ototoxicity (especially with rapid IV administration), dehydration, metabolic alkalosis",
        contra: "Anuria, hepatic coma, severe electrolyte depletion, sulfonamide allergy (use with caution)",
        pearl: "IV furosemide should be administered no faster than 4 mg/min to prevent ototoxicity. Monitor daily weights and I&O. Ototoxicity risk increases with concurrent aminoglycoside use. Loop diuretics waste calcium (opposite of thiazides)."
      },
      {
        name: "Spironolactone",
        type: "Potassium-Sparing Diuretic / Aldosterone Antagonist",
        action: "Competitively blocks aldosterone receptors in the collecting duct, preventing sodium reabsorption and potassium excretion. Also reduces cardiac fibrosis in heart failure.",
        sideEffects: "Hyperkalemia, gynecomastia, breast tenderness, menstrual irregularities, GI upset, sexual dysfunction",
        contra: "Hyperkalemia (K+ above 5.0 mEq/L), severe renal impairment, Addison disease, concurrent use with other potassium-sparing agents or potassium supplements",
        pearl: "Spironolactone reduces mortality in heart failure with reduced ejection fraction (RALES trial). Gynecomastia is a common reason for switching to eplerenone. Do not use potassium supplements concurrently."
      },
      {
        name: "Hydralazine",
        type: "Direct Vasodilator",
        action: "Directly relaxes arteriolar smooth muscle through nitric oxide-mediated mechanisms, reducing systemic vascular resistance and afterload",
        sideEffects: "Reflex tachycardia, headache, flushing, fluid retention, drug-induced lupus (with chronic high-dose use), nasal congestion",
        contra: "Coronary artery disease (due to reflex tachycardia), mitral valve rheumatic heart disease, dissecting aortic aneurysm",
        pearl: "Hydralazine combined with isosorbide dinitrate (BiDil) is recommended for heart failure in African American patients who cannot tolerate ACE inhibitors or ARBs. Drug-induced lupus is dose-related and reversible upon discontinuation."
      },
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "Angiotensin Receptor-Neprilysin Inhibitor (ARNI)",
        action: "Combines neprilysin inhibition (increasing natriuretic peptides that promote vasodilation and diuresis) with ARB activity to reduce neurohormonal activation in heart failure",
        sideEffects: "Hypotension, hyperkalemia, angioedema, dizziness, renal impairment, cough",
        contra: "Concurrent ACE inhibitor use (36-hour washout required), history of angioedema with ACE inhibitor, pregnancy, severe hepatic impairment",
        pearl: "Must allow 36-hour washout period after stopping ACE inhibitor before starting sacubitril/valsartan to reduce angioedema risk. Shown to reduce cardiovascular mortality and heart failure hospitalizations versus enalapril (PARADIGM-HF trial)."
      },
      {
        name: "Dapagliflozin",
        type: "SGLT2 Inhibitor (Heart Failure Indication)",
        action: "Inhibits sodium-glucose cotransporter 2 in the proximal tubule, promoting glucosuria and natriuresis, reducing preload and afterload, and providing cardioprotective and renoprotective effects",
        sideEffects: "Genital mycotic infections, urinary tract infections, volume depletion, hypotension, diabetic ketoacidosis (even with normal glucose), Fournier gangrene (rare)",
        contra: "Severe renal impairment for glycemic control (though used for HF regardless of diabetes status), type 1 diabetes, history of DKA",
        pearl: "SGLT2 inhibitors are now guideline-directed therapy for HFrEF regardless of diabetes status (DAPA-HF trial). Hold before major surgery due to DKA risk. Euglycemic DKA can occur even with normal blood glucose."
      },
      {
        name: "Ivabradine",
        type: "Hyperpolarization-Activated Cyclic Nucleotide-Gated Channel Blocker",
        action: "Selectively inhibits the If current in the sinoatrial node, reducing heart rate without affecting blood pressure, contractility, or conduction",
        sideEffects: "Bradycardia, luminous phenomena (phosphenes/visual brightness), hypertension, atrial fibrillation, blurred vision",
        contra: "Acute decompensated heart failure, blood pressure below 90/50 mmHg, sick sinus syndrome, SA block, third-degree AV block, resting heart rate below 60 bpm, severe hepatic impairment, concurrent strong CYP3A4 inhibitors",
        pearl: "Ivabradine is indicated for stable HFrEF with resting HR of 70 bpm or greater despite maximally tolerated beta blocker. It reduces heart rate without the negative inotropic effects of beta blockers. Phosphenes (visual flashes) are a unique side effect."
      },
      {
        name: "Procainamide",
        type: "Class IA Antiarrhythmic (Sodium Channel Blocker)",
        action: "Blocks fast sodium channels, slowing conduction velocity and prolonging the action potential duration and effective refractory period in atrial and ventricular tissue",
        sideEffects: "Hypotension (especially IV), QT prolongation, torsades de pointes, drug-induced lupus (long-term use), agranulocytosis, GI upset",
        contra: "Torsades de pointes, systemic lupus erythematosus, second or third-degree heart block, QT prolongation, severe heart failure",
        pearl: "Drug-induced lupus occurs in up to 30% of patients on long-term therapy; monitor ANA levels. Check CBC regularly for agranulocytosis. IV administration requires continuous ECG and blood pressure monitoring."
      },
      {
        name: "Amiodarone",
        type: "Class III Antiarrhythmic (Potassium Channel Blocker)",
        action: "Blocks potassium channels prolonging repolarization, also blocks sodium and calcium channels and has anti-adrenergic properties, effective against both atrial and ventricular arrhythmias",
        sideEffects: "Pulmonary toxicity (pneumonitis/fibrosis), thyroid dysfunction (both hypo and hyper), hepatotoxicity, corneal microdeposits, blue-gray skin discoloration, photosensitivity, peripheral neuropathy, QT prolongation",
        contra: "Severe sinus node dysfunction, second or third-degree AV block, cardiogenic shock, iodine hypersensitivity, pregnancy",
        pearl: "Amiodarone has an extremely long half-life (40-55 days). Requires baseline and periodic pulmonary function tests, thyroid function tests, liver function tests, and ophthalmologic exams. Contains iodine which affects thyroid function. Numerous drug interactions via CYP3A4."
      },
      {
        name: "Heparin (Unfractionated - UFH)",
        type: "Anticoagulant (Indirect Thrombin Inhibitor)",
        action: "Binds to antithrombin III, accelerating its ability to inactivate thrombin (factor IIa) and factor Xa by 1000-fold, preventing clot formation and propagation",
        sideEffects: "Bleeding, heparin-induced thrombocytopenia (HIT), osteoporosis (long-term use), injection site reactions, hyperkalemia",
        contra: "Active major bleeding, severe thrombocytopenia, history of HIT, uncontrolled hypertension",
        pearl: "Monitor aPTT every 6 hours until stable (goal 1.5-2.5 times control). Protamine sulfate is the antidote (1 mg per 100 units of heparin). HIT typically occurs 5-10 days after initiation; monitor platelet counts. UFH is preferred in renal failure due to short half-life."
      },
      {
        name: "Enoxaparin",
        type: "Low Molecular Weight Heparin (LMWH)",
        action: "Primarily inhibits factor Xa through antithrombin III binding, with less effect on thrombin compared to UFH, providing more predictable anticoagulation",
        sideEffects: "Bleeding, injection site bruising/hematoma, thrombocytopenia (less common than UFH), elevated liver enzymes",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl below 30 mL/min requires dose adjustment), epidural/spinal anesthesia timing considerations",
        pearl: "Administer subcutaneously in the abdomen; do not expel air bubble before injection. Does not routinely require monitoring, but anti-Xa levels may be checked in obesity, renal impairment, or pregnancy. No complete reversal agent (protamine only partially effective)."
      },
      {
        name: "Warfarin",
        type: "Anticoagulant (Vitamin K Antagonist)",
        action: "Inhibits vitamin K epoxide reductase, blocking synthesis of vitamin K-dependent clotting factors (II, VII, IX, X) and proteins C and S",
        sideEffects: "Bleeding, skin necrosis (rare, early therapy), purple toe syndrome, teratogenicity, hair loss",
        contra: "Pregnancy (Category X), active bleeding, recent surgery of the CNS or eye, unsupervised patients with high fall risk, severe hepatic disease",
        pearl: "Takes 3-5 days for full anticoagulant effect; overlap with heparin is required. INR goal is 2.0-3.0 for most indications (2.5-3.5 for mechanical heart valves). Vitamin K is the antidote; for serious bleeding, use 4-factor PCC or FFP. Numerous food and drug interactions."
      },
      {
        name: "Rivaroxaban",
        type: "Direct Oral Anticoagulant (Factor Xa Inhibitor)",
        action: "Directly and selectively inhibits factor Xa without requiring antithrombin III as a cofactor, interrupting the coagulation cascade",
        sideEffects: "Bleeding, GI upset, wound secretion, back pain, hepatotoxicity (rare)",
        contra: "Active pathological bleeding, severe hepatic disease with coagulopathy, prosthetic heart valves",
        pearl: "Take rivaroxaban 15 mg and 20 mg doses with food to ensure adequate absorption. No routine monitoring required but anti-Xa levels can be measured in emergencies. Andexanet alfa is the specific reversal agent for factor Xa inhibitors."
      },
      {
        name: "Apixaban",
        type: "Direct Oral Anticoagulant (Factor Xa Inhibitor)",
        action: "Selectively inhibits free and clot-bound factor Xa, preventing thrombin generation and clot formation without direct effect on platelet aggregation",
        sideEffects: "Bleeding, bruising, nausea, anemia, hypersensitivity reactions",
        contra: "Active pathological bleeding, severe hepatic disease, prosthetic heart valves, triple positive antiphospholipid syndrome",
        pearl: "Apixaban has the lowest bleeding risk among DOACs based on clinical trial data. Dose reduction criteria include age 80 or older, body weight 60 kg or less, or serum creatinine 1.5 mg/dL or greater (need 2 of 3). Reversal with andexanet alfa."
      },
      {
        name: "Aspirin",
        type: "Antiplatelet (Cyclooxygenase Inhibitor)",
        action: "Irreversibly inhibits cyclooxygenase-1 (COX-1) in platelets, blocking thromboxane A2 synthesis and preventing platelet aggregation for the lifespan of the platelet (7-10 days)",
        sideEffects: "GI bleeding, peptic ulcer disease, tinnitus, Reye syndrome in children, increased bleeding time, bronchospasm in aspirin-sensitive asthma",
        contra: "Active GI bleeding, aspirin-sensitive asthma, children under 18 with viral illness (Reye syndrome), third trimester of pregnancy, bleeding disorders",
        pearl: "Low-dose aspirin (81 mg) is used for cardiovascular prophylaxis. Irreversible platelet inhibition means effects last 7-10 days (platelet lifespan). Must be held 7 days before surgery. Chew non-enteric coated aspirin during acute MI for faster absorption."
      },
      {
        name: "Clopidogrel",
        type: "Antiplatelet (P2Y12 ADP Receptor Inhibitor)",
        action: "Irreversibly blocks the P2Y12 ADP receptor on platelets, inhibiting ADP-mediated platelet activation and aggregation",
        sideEffects: "Bleeding, bruising, GI upset, thrombotic thrombocytopenic purpura (rare), neutropenia",
        contra: "Active pathological bleeding, severe hepatic impairment, concurrent use of omeprazole or esomeprazole (reduce effectiveness via CYP2C19 inhibition)",
        pearl: "CYP2C19 poor metabolizers have reduced conversion of clopidogrel to its active form, leading to diminished antiplatelet effect. Pharmacogenomic testing may guide therapy. Dual antiplatelet therapy (DAPT) with aspirin and clopidogrel is standard after coronary stent placement for 6-12 months."
      },
      {
        name: "Atorvastatin",
        type: "HMG-CoA Reductase Inhibitor (Statin)",
        action: "Competitively inhibits HMG-CoA reductase, the rate-limiting enzyme in hepatic cholesterol synthesis, upregulating LDL receptor expression and lowering circulating LDL cholesterol",
        sideEffects: "Myalgia, rhabdomyolysis (rare but serious), hepatotoxicity, elevated liver enzymes, new-onset diabetes, GI upset, headache",
        contra: "Active liver disease, unexplained persistent elevations of serum transaminases, pregnancy, breastfeeding",
        pearl: "Monitor CK levels if patient reports muscle pain; rhabdomyolysis can cause acute kidney injury from myoglobin. Avoid concurrent use with strong CYP3A4 inhibitors (e.g., clarithromycin, itraconazole). Statins provide pleiotropic effects beyond lipid lowering including anti-inflammatory and plaque-stabilizing properties."
      },
      {
        name: "Ezetimibe",
        type: "Cholesterol Absorption Inhibitor",
        action: "Selectively inhibits the Niemann-Pick C1-Like 1 (NPC1L1) protein at the brush border of the small intestine, blocking intestinal absorption of dietary and biliary cholesterol",
        sideEffects: "Diarrhea, abdominal pain, fatigue, upper respiratory tract infection, myalgia (especially when combined with statins)",
        contra: "Active liver disease when combined with a statin, moderate to severe hepatic impairment",
        pearl: "Often used as add-on therapy when statins alone do not achieve target LDL reduction. Can be taken with or without food. Well tolerated with few drug interactions. Combined with statin provides additional 15-20% LDL reduction."
      },
      {
        name: "Evolocumab",
        type: "PCSK9 Inhibitor (Monoclonal Antibody)",
        action: "Binds to proprotein convertase subtilisin/kexin type 9 (PCSK9), preventing degradation of LDL receptors on hepatocytes, increasing LDL receptor recycling and LDL cholesterol clearance",
        sideEffects: "Injection site reactions, nasopharyngitis, upper respiratory tract infections, back pain, influenza-like symptoms",
        contra: "Serious hypersensitivity to the drug, pregnancy",
        pearl: "PCSK9 inhibitors can reduce LDL by 50-60% on top of statin therapy. Administered as subcutaneous injection every 2 weeks or monthly. Reserved for patients with familial hypercholesterolemia or atherosclerotic cardiovascular disease not at goal on maximally tolerated statin plus ezetimibe."
      },
      {
        name: "Fenofibrate",
        type: "Fibric Acid Derivative (Fibrate)",
        action: "Activates peroxisome proliferator-activated receptor alpha (PPAR-alpha), increasing lipoprotein lipase activity to reduce triglycerides and modestly increase HDL cholesterol",
        sideEffects: "GI upset, myopathy (especially combined with statins), cholelithiasis, elevated liver enzymes, rash, photosensitivity",
        contra: "Severe renal impairment, severe hepatic disease, active gallbladder disease, breastfeeding, concurrent use with strong statins (increased rhabdomyolysis risk)",
        pearl: "Primarily used for severe hypertriglyceridemia (above 500 mg/dL) to prevent pancreatitis. When combining with statins, fenofibrate is preferred over gemfibrozil due to lower rhabdomyolysis risk. Monitor renal function and liver enzymes periodically."
      },
      {
        name: "Nitroglycerin",
        type: "Vasodilator (Organic Nitrate)",
        action: "Converted to nitric oxide, which activates guanylate cyclase in vascular smooth muscle, increasing cGMP and causing venodilation (primarily) and arteriolar dilation, reducing preload and myocardial oxygen demand",
        sideEffects: "Headache (most common), hypotension, reflex tachycardia, dizziness, flushing, tolerance with continuous use",
        contra: "Concurrent PDE-5 inhibitor use (sildenafil, tadalafil - fatal hypotension), severe hypotension (SBP below 90 mmHg), right ventricular infarction, increased intracranial pressure, hypertrophic obstructive cardiomyopathy",
        pearl: "Sublingual NTG: place under tongue, may repeat every 5 minutes for up to 3 doses. If no relief after first dose, call 911. IV NTG requires non-PVC tubing (drug adsorbs to PVC). Tolerance develops with continuous use - provide a 10-12 hour nitrate-free interval daily. Headache indicates the drug is working."
      },
      {
        name: "Milrinone (Primacor)",
        type: "Phosphodiesterase-3 Inhibitor (Inodilator)",
        action: "Inhibits phosphodiesterase-3 in cardiac and vascular smooth muscle, increasing intracellular cAMP, which enhances cardiac contractility (positive inotropy) and causes vasodilation, reducing both preload and afterload",
        sideEffects: "Hypotension, ventricular arrhythmias (ventricular tachycardia, ventricular fibrillation), thrombocytopenia, headache, tremor",
        contra: "Severe aortic or pulmonic stenosis, hypovolemia, hypotension (SBP below 90 mmHg)",
        pearl: "Used for short-term management of acute decompensated heart failure. IV only - administer via infusion pump with continuous cardiac monitoring. Monitor platelet count (thrombocytopenia risk). Does not require functioning beta receptors (advantage over dobutamine in patients on beta blockers). Often called an 'inodilator' because it increases contractility AND causes vasodilation."
      },
      {
        name: "Dopamine",
        type: "Vasopressor / Inotrope (Catecholamine)",
        action: "Dose-dependent receptor activation: low dose (1-5 mcg/kg/min) stimulates dopaminergic receptors causing renal and mesenteric vasodilation; moderate dose (5-10 mcg/kg/min) stimulates beta-1 receptors increasing cardiac contractility and heart rate; high dose (>10 mcg/kg/min) stimulates alpha-1 receptors causing peripheral vasoconstriction",
        sideEffects: "Tachycardia, arrhythmias, hypertension, tissue necrosis with extravasation, nausea, headache, anginal pain",
        contra: "Pheochromocytoma, uncorrected tachyarrhythmias, ventricular fibrillation. Use with caution in patients on MAOIs (potentiated effect).",
        pearl: "Administer via central line when possible - extravasation causes tissue necrosis (treat with phentolamine infiltration). Dose-dependent effects: 'Dopa doses for Dilation, Beta doses for the Beat, Alpha doses for the Arteries.' Titrate to desired hemodynamic effect. Taper gradually - do not abruptly discontinue."
      }
    ],
    pearls: [
      "The suffix '-pril' indicates ACE inhibitors, '-sartan' indicates ARBs, '-olol' indicates beta blockers, '-dipine' indicates dihydropyridine CCBs, and '-statin' indicates HMG-CoA reductase inhibitors.",
      "ACE inhibitors are first-line for diabetic patients with hypertension due to renoprotective effects, but are contraindicated in pregnancy.",
      "Never combine ACE inhibitors with ARBs (dual RAAS blockade) due to increased risk of hyperkalemia, hypotension, and renal failure.",
      "Warfarin requires overlap with heparin for 3-5 days because warfarin initially creates a transient hypercoagulable state by depleting protein C before clotting factors decline.",
      "Amiodarone is the most effective antiarrhythmic but has the most toxicities (pulmonary, thyroid, hepatic, ocular, dermatologic) - remember 'Amiodarone affects Almost All organs'.",
      "Loop diuretics cause hypocalcemia while thiazide diuretics cause hypercalcemia - 'Loops Lose calcium, Thiazides Take calcium back'.",
      "In acute coronary syndrome, administer aspirin 325 mg chewed immediately, followed by dual antiplatelet therapy with clopidogrel or ticagrelor.",
      "Hold metformin 48 hours before and after contrast dye administration to prevent lactic acidosis in patients also on cardiovascular medications.",
      "Sacubitril/valsartan (ARNI) requires a 36-hour washout from ACE inhibitors to prevent angioedema; it replaces the ACE inhibitor in heart failure regimen."
    ],
    lifespan: {
      title: "Lifespan Considerations in Cardiovascular",
      content: "Pediatric patients require weight-based dosing for all cardiovascular medications. Older adults are more susceptible to orthostatic hypotension from antihypertensives and bleeding complications from anticoagulants; start low and go slow with dose titration. Pregnancy contraindicates ACE inhibitors, ARBs, warfarin, statins, and most DOACs. Labetalol, methyldopa, and nifedipine are preferred antihypertensives during pregnancy. Renal function declines with age, necessitating dose adjustments for renally cleared medications including digoxin, enoxaparin, and DOACs."
    },
    quiz: [
      {
        question: "A patient taking lisinopril develops a persistent dry cough. What is the most appropriate nursing action?",
        options: [
          "Administer a cough suppressant and continue the medication",
          "Notify the provider to discuss switching to an ARB such as losartan",
          "Hold the medication and monitor blood pressure",
          "Instruct the patient that the cough will resolve with continued use"
        ],
        correct: 1,
        rationale: "A dry cough is a common side effect of ACE inhibitors caused by bradykinin accumulation. The appropriate action is to notify the provider about switching to an ARB, which does not affect bradykinin metabolism and does not cause cough."
      },
      {
        question: "Which laboratory value should the nurse monitor most closely when a patient is receiving both furosemide and digoxin?",
        options: [
          "Serum sodium level",
          "Serum potassium level",
          "Blood urea nitrogen",
          "Serum calcium level"
        ],
        correct: 1,
        rationale: "Furosemide causes potassium wasting (hypokalemia). Hypokalemia increases the risk of digoxin toxicity because digoxin and potassium compete for the same binding site on the sodium-potassium ATPase pump. Potassium levels must be monitored closely."
      },
      {
        question: "A patient on warfarin has an INR of 5.2 with no signs of active bleeding. What is the priority nursing action?",
        options: [
          "Administer protamine sulfate immediately",
          "Hold warfarin and notify the provider; vitamin K may be administered",
          "Administer fresh frozen plasma stat",
          "Continue warfarin at the current dose and recheck INR in 24 hours"
        ],
        correct: 1,
        rationale: "An INR of 5.2 is supratherapeutic and increases bleeding risk. Without active bleeding, the appropriate response is to hold warfarin and notify the provider. Low-dose oral vitamin K may be given. Protamine sulfate reverses heparin, not warfarin. FFP is for active serious bleeding."
      },
      {
        question: "Which instruction is essential for a patient prescribed amiodarone?",
        options: [
          "Take the medication on an empty stomach for best absorption",
          "Wear sunscreen and protective clothing due to photosensitivity",
          "Increase dietary potassium intake to prevent hypokalemia",
          "Report any weight gain greater than 1 pound per week"
        ],
        correct: 1,
        rationale: "Amiodarone causes photosensitivity and can lead to blue-gray skin discoloration with sun exposure. Patients should wear sunscreen and protective clothing. Amiodarone also requires monitoring of thyroid, pulmonary, hepatic, and ophthalmologic function."
      },
      {
        question: "A patient is started on dual antiplatelet therapy with aspirin and clopidogrel after coronary stent placement. Which medication should the nurse advise the patient to avoid?",
        options: [
          "Acetaminophen",
          "Omeprazole",
          "Famotidine",
          "Metformin"
        ],
        correct: 1,
        rationale: "Omeprazole and esomeprazole inhibit CYP2C19, which is needed to convert clopidogrel to its active metabolite. This interaction reduces the antiplatelet effect of clopidogrel. Pantoprazole or famotidine are preferred alternatives for GI protection."
      }
    ]
  },

  "pharm-respiratory": {
    title: "Respiratory Pharmacology",
    cellular: {
      title: "Respiratory Drug Mechanisms at the Cellular",
      content: "Respiratory pharmacology targets airway smooth muscle, inflammatory mediators, and mucus-producing cells to restore airflow and reduce airway hyperreactivity. Beta-2 agonists activate beta-2 adrenergic receptors on bronchial smooth muscle, stimulating adenylyl cyclase to increase intracellular cyclic AMP, which promotes smooth muscle relaxation and bronchodilation. Inhaled corticosteroids suppress inflammatory gene transcription by binding to glucocorticoid receptors in the cytoplasm and translocating to the nucleus, reducing production of inflammatory cytokines, chemokines, and adhesion molecules in the airway mucosa. Anticholinergic agents block muscarinic M3 receptors on airway smooth muscle, preventing acetylcholine-mediated bronchoconstriction and reducing mucus secretion. Leukotriene receptor antagonists block cysteinyl leukotriene receptors, preventing leukotriene-mediated bronchoconstriction, mucus production, and eosinophilic inflammation."
    },
    riskFactors: [
      "Poor inhaler technique results in inadequate drug delivery to the lungs",
      "Tobacco smoking accelerates decline in lung function and reduces corticosteroid efficacy",
      "Allergic triggers and occupational exposures worsen underlying airway disease",
      "Non-adherence to controller medications increases risk of exacerbations",
      "Oral corticosteroid dependence leads to adrenal suppression and systemic side effects",
      "GERD and obesity contribute to worsening asthma control"
    ],
    diagnostics: [
      "Peak expiratory flow (PEF) monitoring for asthma management",
      "Spirometry with FEV1/FVC ratio for COPD and asthma diagnosis",
      "Serum IgE levels before initiating omalizumab therapy",
      "Complete blood count with eosinophil count for biologic therapy eligibility",
      "Bone density screening for patients on long-term systemic corticosteroids",
      "Oral candidiasis screening in patients on inhaled corticosteroids",
      "Blood glucose monitoring during systemic corticosteroid therapy",
      "Adrenal function testing when tapering systemic corticosteroids"
    ],
    management: [
      "Follow stepwise approach for asthma: step up if uncontrolled, step down after 3 months of good control",
      "SABA rescue inhaler use more than 2 days per week indicates inadequate control",
      "All patients with persistent asthma should receive an inhaled corticosteroid",
      "COPD management follows GOLD guidelines based on symptoms and exacerbation history",
      "Systemic corticosteroids should be tapered gradually to prevent adrenal crisis",
      "LABA should never be used as monotherapy in asthma (must combine with ICS)",
      "Biologic agents are reserved for severe persistent asthma unresponsive to standard therapy"
    ],
    nursingActions: [
      "Teach and verify proper inhaler technique at every visit using teach-back method",
      "Instruct patients to rinse mouth after inhaled corticosteroid use to prevent oral thrush",
      "Educate on the difference between rescue (SABA) and maintenance (ICS, LABA) inhalers",
      "Assess peak flow readings and symptom diary to evaluate asthma control",
      "Monitor for signs of systemic steroid toxicity: weight gain, hyperglycemia, moon face",
      "Instruct patients to carry rescue inhaler at all times",
      "Teach spacer use with metered-dose inhalers to improve drug delivery"
    ],
    assessmentFindings: [
      "Improved peak flow readings indicate effective bronchodilator therapy",
      "Oral thrush (white patches in mouth) suggests inadequate mouth rinsing after ICS use",
      "Tremor and tachycardia are expected side effects of beta-2 agonist use",
      "Decreased wheezing after bronchodilator administration indicates therapeutic response",
      "Cushingoid features suggest excessive systemic corticosteroid exposure"
    ],
    signs: {
      left: [
        "Tachycardia and tremor from beta-2 agonist overstimulation",
        "Oral candidiasis (thrush) from inhaled corticosteroid deposition in the oropharynx",
        "Adrenal suppression from prolonged systemic corticosteroid use",
        "Paradoxical bronchospasm after inhaler use (rare but requires immediate intervention)",
        "Hypokalemia from high-dose beta-2 agonist or systemic corticosteroid use",
        "Growth suppression in children on chronic inhaled corticosteroids"
      ],
      right: [
        "Decreased wheezing and improved air movement after bronchodilator therapy",
        "Improved FEV1 and peak expiratory flow values with appropriate controller therapy",
        "Reduced frequency of rescue inhaler use (less than 2 times per week indicates good control)",
        "Decreased nighttime awakenings from respiratory symptoms",
        "Normal oxygen saturation (SpO2 95% or greater) maintained with therapy",
        "Reduced exacerbation frequency with consistent controller medication use"
      ]
    },
    medications: [
      {
        name: "Albuterol",
        type: "Short-Acting Beta-2 Agonist (SABA)",
        action: "Selectively stimulates beta-2 adrenergic receptors in bronchial smooth muscle, activating adenylyl cyclase and increasing cAMP to produce rapid bronchodilation within 5-15 minutes",
        sideEffects: "Tremor, tachycardia, palpitations, nervousness, headache, hypokalemia with excessive use, paradoxical bronchospasm (rare)",
        contra: "Hypersensitivity to albuterol, use with caution in cardiac arrhythmias, hyperthyroidism, and uncontrolled diabetes",
        pearl: "Albuterol is the first-line rescue medication for acute bronchospasm. Using a rescue inhaler more than 2 days per week (excluding exercise pre-treatment) indicates the need for a step-up in controller therapy. Onset is 5-15 minutes with duration of 4-6 hours."
      },
      {
        name: "Salmeterol",
        type: "Long-Acting Beta-2 Agonist (LABA)",
        action: "Provides sustained beta-2 receptor stimulation with slow onset (15-30 minutes) and prolonged bronchodilation lasting 12 hours through lipophilic side chain anchoring in the cell membrane",
        sideEffects: "Tremor, headache, tachycardia, palpitations, muscle cramps, upper respiratory tract infection",
        contra: "Monotherapy in asthma (BLACK BOX WARNING: increased risk of asthma-related death when used without ICS), acute bronchospasm (not a rescue inhaler)",
        pearl: "LABAs must ALWAYS be combined with an inhaled corticosteroid in asthma (FDA Black Box Warning). Salmeterol is NOT a rescue inhaler due to slow onset. In COPD, LABA monotherapy is acceptable. Available in combination with fluticasone (Advair)."
      },
      {
        name: "Formoterol",
        type: "Long-Acting Beta-2 Agonist (LABA)",
        action: "Provides full beta-2 agonism with rapid onset (1-3 minutes) and long duration (12 hours), combining rescue and maintenance properties at the cellular level",
        sideEffects: "Tremor, headache, tachycardia, pharyngitis, sinusitis, hypokalemia",
        contra: "Monotherapy in asthma (same Black Box Warning as salmeterol), severe hypersensitivity to milk proteins (in some DPI formulations)",
        pearl: "Unlike salmeterol, formoterol has a rapid onset making it suitable for both maintenance and reliever therapy (MART/SMART strategy) when combined with budesonide. This is the basis for single maintenance and reliever therapy (SMART) approach in asthma guidelines."
      },
      {
        name: "Fluticasone",
        type: "Inhaled Corticosteroid (ICS)",
        action: "Binds to intracellular glucocorticoid receptors, translocating to the nucleus to suppress transcription of inflammatory genes, reducing airway inflammation, mucus production, and bronchial hyperresponsiveness",
        sideEffects: "Oral candidiasis (thrush), dysphonia (hoarseness), pharyngitis, growth velocity reduction in children, adrenal suppression at high doses, osteoporosis with long-term high-dose use, easy bruising",
        contra: "Primary treatment of acute bronchospasm or status asthmaticus, untreated fungal infections of the mouth",
        pearl: "The cornerstone of persistent asthma management. Always instruct patients to rinse mouth and spit after each use to prevent oral candidiasis. Using a spacer with MDI reduces oropharyngeal deposition and improves lung delivery. Anti-inflammatory effects take 1-2 weeks for full benefit."
      },
      {
        name: "Budesonide",
        type: "Inhaled Corticosteroid (ICS)",
        action: "High-potency glucocorticoid that suppresses multiple inflammatory pathways in the airway, reducing eosinophilic infiltration, cytokine release, and airway wall remodeling",
        sideEffects: "Oral thrush, hoarseness, cough, headache, nasopharyngitis, growth suppression in children",
        contra: "Acute bronchospasm (not a rescue medication), hypersensitivity, active or quiescent tuberculosis",
        pearl: "Budesonide has high first-pass metabolism, giving it a better safety profile than some other ICS. Available as nebulizer solution for young children who cannot use inhalers. Combined with formoterol in SMART therapy approach for both maintenance and reliever use."
      },
      {
        name: "Ipratropium",
        type: "Short-Acting Muscarinic Antagonist (SAMA)",
        action: "Competitively blocks muscarinic M3 receptors in airway smooth muscle, preventing acetylcholine-mediated bronchoconstriction and reducing mucus gland secretion",
        sideEffects: "Dry mouth, urinary retention, blurred vision (if sprayed in eyes), cough, headache, dizziness, constipation",
        contra: "Hypersensitivity to atropine or atropine derivatives, soy or peanut allergy (MDI formulation contains soy lecithin)",
        pearl: "Often combined with albuterol (DuoNeb/Combivent) for acute COPD exacerbations and severe asthma attacks. Onset is slower than albuterol (15-30 minutes). Primary role is in COPD rather than asthma. Caution with narrow-angle glaucoma and prostatic hyperplasia."
      },
      {
        name: "Tiotropium",
        type: "Long-Acting Muscarinic Antagonist (LAMA)",
        action: "Selectively and prolongedly blocks M3 muscarinic receptors with slow dissociation kinetics, providing sustained bronchodilation for 24 hours and reducing mucus hypersecretion",
        sideEffects: "Dry mouth (most common), constipation, urinary retention, blurred vision, pharyngitis, sinusitis, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma, urinary retention, prostatic hyperplasia",
        pearl: "First-line maintenance therapy for COPD. Once-daily dosing improves adherence. Also approved as add-on therapy for poorly controlled asthma. Instruct patients not to swallow the capsule (for DPI devices) and to avoid getting powder in eyes. HandiHaler and Respimat are different delivery devices with different dosing."
      },
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "Combination Inhaler (ICS + LABA)",
        action: "Combines anti-inflammatory effects of fluticasone (reducing airway inflammation) with sustained bronchodilation from salmeterol (beta-2 agonism), addressing both components of airway disease",
        sideEffects: "Oral candidiasis, hoarseness, headache, upper respiratory infection, tremor, palpitations, bone density loss with long-term use",
        contra: "Acute bronchospasm, monotherapy with LABA component in asthma, severe milk protein allergy (Diskus formulation)",
        pearl: "Combination inhalers improve adherence by preventing LABA monotherapy in asthma. The ICS component addresses the Black Box Warning concern. Available as Diskus (DPI) and MDI. Not a rescue inhaler. Rinse mouth after use. Step down to ICS alone after achieving 3 months of good asthma control."
      },
      {
        name: "Montelukast",
        type: "Leukotriene Receptor Antagonist (LTRA)",
        action: "Selectively blocks the cysteinyl leukotriene receptor CysLT1, preventing leukotriene-mediated bronchoconstriction, mucus secretion, and eosinophilic airway inflammation",
        sideEffects: "Headache, abdominal pain, behavioral changes (FDA Black Box Warning: neuropsychiatric events including suicidal ideation, aggression, depression, anxiety, insomnia, especially in children)",
        contra: "Hypersensitivity to montelukast, phenylketonuria (chewable tablets contain aspartame)",
        pearl: "FDA Black Box Warning for neuropsychiatric events including suicidal thinking, agitation, aggression, and depression. Monitor behavioral changes closely, especially in children. Taken once daily in the evening. Particularly effective for exercise-induced bronchospasm and aspirin-exacerbated respiratory disease. Not effective for acute bronchospasm."
      },
      {
        name: "Prednisone",
        type: "Systemic Corticosteroid",
        action: "Suppresses multiple inflammatory and immune pathways by inhibiting phospholipase A2, reducing prostaglandin and leukotriene synthesis, suppressing T-cell activation, and decreasing vascular permeability in the airways",
        sideEffects: "Hyperglycemia, weight gain, immunosuppression, osteoporosis, adrenal suppression, mood changes, insomnia, peptic ulcer, cataracts, myopathy, growth suppression in children, Cushingoid features",
        contra: "Systemic fungal infections, live vaccines during therapy, active untreated infections",
        pearl: "Used for acute asthma and COPD exacerbations (typically 5-7 day course). Administer in the morning to mimic physiologic cortisol secretion. Taper gradually if used more than 2 weeks to prevent adrenal crisis. Short burst courses (less than 2 weeks) generally do not require tapering. Monitor blood glucose closely in diabetic patients."
      },
      {
        name: "Omalizumab",
        type: "Anti-IgE Monoclonal Antibody (Biologic)",
        action: "Binds to free circulating IgE, preventing IgE from attaching to high-affinity receptors on mast cells and basophils, thereby reducing allergen-triggered degranulation and inflammatory mediator release",
        sideEffects: "Injection site reactions, anaphylaxis (BLACK BOX WARNING: risk of anaphylaxis, may occur after any dose), headache, upper respiratory infections, sinusitis, arthralgia",
        contra: "Acute bronchospasm or status asthmaticus, anaphylaxis to omalizumab",
        pearl: "BLACK BOX WARNING for anaphylaxis - patients must be observed for at least 2 hours after each of the first 3 injections and 30 minutes for subsequent injections. Only for moderate-to-severe persistent allergic asthma with elevated IgE. Administered subcutaneously every 2-4 weeks. Dose based on body weight and pretreatment IgE level."
      },
      {
        name: "Dupilumab",
        type: "Anti-IL-4/IL-13 Monoclonal Antibody (Biologic)",
        action: "Blocks interleukin-4 and interleukin-13 signaling by binding to IL-4 receptor alpha, inhibiting type 2 inflammatory pathways that drive eosinophilic airway inflammation, mucus overproduction, and airway remodeling",
        sideEffects: "Injection site reactions, conjunctivitis, blepharitis, oral herpes, eosinophilia (transient), arthralgia, hypersensitivity reactions",
        contra: "Known hypersensitivity to dupilumab, active parasitic infections (may impair immune response to helminths)",
        pearl: "Indicated for moderate-to-severe eosinophilic asthma or oral corticosteroid-dependent asthma, as well as atopic dermatitis and chronic rhinosinusitis with nasal polyps. Does not require IgE level monitoring like omalizumab. May allow reduction in maintenance oral corticosteroid dose. Self-administered subcutaneously every 2 weeks."
      }
    ],
    pearls: [
      "SABA rescue inhaler use more than 2 days per week (excluding exercise pre-treatment) indicates inadequate asthma control and need for step-up in therapy.",
      "LABAs must NEVER be used as monotherapy in asthma due to FDA Black Box Warning for increased asthma-related death; they must always be combined with an ICS.",
      "Proper inhaler technique is critical: MDIs require slow deep inhalation with 10-second breath hold; DPIs require fast forceful inhalation. A spacer improves MDI drug delivery by 40-60%.",
      "Rinse mouth and spit after every inhaled corticosteroid use to prevent oral candidiasis; using a spacer with MDI also reduces oropharyngeal deposition.",
      "Montelukast carries an FDA Black Box Warning for neuropsychiatric events including suicidal ideation - monitor behavior changes closely, particularly in pediatric patients.",
      "In COPD stepwise therapy, start with a LAMA or LABA, then combine LAMA+LABA, then add ICS only if frequent exacerbations with eosinophilic phenotype. ICS monotherapy is NOT recommended in COPD.",
      "SMART therapy (Single Maintenance And Reliever Therapy) uses budesonide/formoterol as both the controller and rescue inhaler, reducing exacerbation rates.",
      "Systemic corticosteroids used for more than 2 weeks require gradual tapering to prevent adrenal crisis from hypothalamic-pituitary-adrenal axis suppression."
    ],
    lifespan: {
      title: "Lifespan Considerations in Respiratory",
      content: "Pediatric patients under 4 years typically use nebulizers or MDIs with spacer and face mask for inhaled medications. Monitor growth velocity in children on inhaled corticosteroids. Older adults may have difficulty with DPI devices due to reduced inspiratory force and should use MDIs with spacers or nebulizers. Pregnancy category considerations: albuterol and budesonide are preferred in pregnant asthmatic patients. Older adults on systemic corticosteroids are at higher risk for osteoporosis and should receive calcium, vitamin D, and bone density monitoring."
    },
    quiz: [
      {
        question: "A patient with asthma reports using their albuterol rescue inhaler 4-5 times per week. What does this indicate?",
        options: [
          "The patient has well-controlled asthma",
          "The patient needs a higher dose of albuterol",
          "The patient's asthma is not well controlled and controller therapy should be initiated or stepped up",
          "The patient should switch from albuterol to ipratropium for rescue use"
        ],
        correct: 2,
        rationale: "Using a SABA rescue inhaler more than 2 days per week indicates inadequately controlled asthma according to NAEPP guidelines. The patient needs initiation of or adjustment to controller therapy (typically an inhaled corticosteroid), not simply a higher dose of rescue medication."
      },
      {
        question: "What is the most important patient education point for inhaled corticosteroid use?",
        options: [
          "Take an extra dose during an acute asthma attack for faster relief",
          "Rinse the mouth with water and spit after each use to prevent oral thrush",
          "Use the inhaler only when wheezing occurs",
          "Discontinue the medication when symptoms improve"
        ],
        correct: 1,
        rationale: "Rinsing the mouth and spitting after inhaled corticosteroid use prevents oral candidiasis (thrush), which occurs from corticosteroid deposition in the oropharynx. ICS are maintenance medications used daily regardless of symptoms, not rescue medications for acute attacks."
      },
      {
        question: "Why must salmeterol (LABA) never be used as monotherapy in asthma?",
        options: [
          "It causes severe rebound bronchospasm when used alone",
          "FDA Black Box Warning: increased risk of asthma-related death without concurrent ICS",
          "It is ineffective without an ICS to potentiate its action",
          "It causes rapid tachyphylaxis within 48 hours of monotherapy"
        ],
        correct: 1,
        rationale: "The FDA issued a Black Box Warning based on clinical trials showing increased asthma-related deaths when LABAs were used without concurrent inhaled corticosteroids. LABAs address bronchospasm but not the underlying airway inflammation, which can worsen without ICS therapy."
      },
      {
        question: "A nurse is administering ipratropium via nebulizer to a patient with COPD. Which assessment finding should prompt the nurse to withhold the medication and notify the provider?",
        options: [
          "Dry mouth",
          "Mild headache",
          "Urinary retention and elevated intraocular pressure",
          "Slightly increased heart rate of 88 bpm"
        ],
        correct: 2,
        rationale: "Ipratropium is an anticholinergic agent that can worsen urinary retention and increase intraocular pressure. It is contraindicated in patients with narrow-angle glaucoma and should be used cautiously in those with prostatic hyperplasia. Dry mouth and mild headache are common expected side effects."
      },
      {
        question: "Which patient requires the longest observation period after receiving omalizumab?",
        options: [
          "A patient receiving their tenth injection",
          "A patient receiving their first injection",
          "A patient who experienced injection site redness previously",
          "A patient with well-controlled asthma on omalizumab for 2 years"
        ],
        correct: 1,
        rationale: "Omalizumab carries a Black Box Warning for anaphylaxis. Patients must be observed for at least 2 hours after each of the first 3 injections due to the highest risk period. Subsequent injections require 30-minute observation. Anaphylaxis can occur after any dose but is most likely early in treatment."
      }
    ]
  },

  "pharm-endocrine": {
    title: "Endocrine Pharmacology",
    cellular: {
      title: "Endocrine Drug Mechanisms at the Cellular",
      content: "Endocrine pharmacology involves replacing deficient hormones, suppressing excess hormone production, or modulating cellular responses to hormonal signaling. Exogenous insulin binds to insulin receptors on target cell membranes, triggering autophosphorylation of the receptor tyrosine kinase domain and activating the PI3K/Akt signaling cascade, which translocates GLUT4 glucose transporters to the cell surface for glucose uptake. Metformin activates AMP-activated protein kinase (AMPK) in hepatocytes, suppressing hepatic gluconeogenesis and improving peripheral insulin sensitivity without directly stimulating insulin secretion. Levothyroxine provides exogenous T4 that is converted to the active T3 form in peripheral tissues, binding to nuclear thyroid hormone receptors to regulate gene transcription controlling metabolic rate, protein synthesis, and thermogenesis. Methimazole inhibits thyroid peroxidase, the enzyme responsible for iodination and coupling of tyrosine residues in thyroglobulin, thereby blocking thyroid hormone synthesis."
    },
    riskFactors: [
      "Renal impairment affects clearance of insulin, metformin, SGLT2 inhibitors, and sulfonylureas",
      "Hepatic dysfunction impairs gluconeogenesis and drug metabolism",
      "Illness, stress, and surgery alter insulin requirements and glucose homeostasis",
      "Skipping meals increases hypoglycemia risk with insulin and sulfonylureas",
      "Polypharmacy increases risk of drug interactions affecting glucose and thyroid levels",
      "Pregnancy alters thyroid hormone requirements and limits medication options"
    ],
    diagnostics: [
      "Hemoglobin A1C every 3 months until stable, then every 6 months (target below 7% for most adults)",
      "Fasting blood glucose and pre/post-meal glucose monitoring for insulin dose adjustment",
      "Serum creatinine and eGFR before and during metformin therapy",
      "TSH and free T4 levels every 6-8 weeks after levothyroxine initiation or dose change",
      "Liver function tests before and during thiazolidinedione therapy",
      "Serum calcium and vitamin D levels with corticosteroid therapy",
      "CBC and liver function tests with methimazole (agranulocytosis risk)",
      "Bone density scan (DEXA) for patients on long-term corticosteroid therapy"
    ],
    management: [
      "Metformin is first-line pharmacotherapy for type 2 diabetes unless contraindicated",
      "Insulin dose adjustments based on pattern management of blood glucose trends",
      "Rotate insulin injection sites to prevent lipodystrophy",
      "Hold metformin 48 hours before and after IV contrast dye procedures",
      "Levothyroxine should be taken on an empty stomach 30-60 minutes before breakfast",
      "Never abruptly discontinue corticosteroids after prolonged use; taper gradually",
      "Sick day management: continue long-acting insulin, check glucose every 2-4 hours, monitor ketones"
    ],
    nursingActions: [
      "Verify insulin type, dose, and expiration before administration; use two-person verification for high-alert medication",
      "Monitor blood glucose before meals and at bedtime for insulin-dependent patients",
      "Educate patients on signs of hypoglycemia: shakiness, diaphoresis, confusion, tachycardia",
      "Teach proper insulin injection technique: rotate sites, inject at 90-degree angle, do not massage site",
      "Assess for signs of thyroid storm: hyperthermia, tachycardia, altered mental status",
      "Monitor weight, blood pressure, and fluid status with corticosteroid therapy",
      "Educate diabetic patients on sick day rules and when to seek emergency care"
    ],
    assessmentFindings: [
      "Hypoglycemia symptoms: tremor, diaphoresis, tachycardia, confusion, irritability (blood glucose below 70 mg/dL)",
      "DKA findings: Kussmaul breathing, fruity breath, polyuria, polydipsia, nausea, abdominal pain",
      "Hypothyroid symptoms improving with levothyroxine: less fatigue, weight loss, improved mentation",
      "Cushing syndrome features with chronic corticosteroid use: moon face, buffalo hump, central obesity, striae",
      "Lactic acidosis signs with metformin: malaise, myalgia, respiratory distress, abdominal pain"
    ],
    signs: {
      left: [
        "Hypoglycemia from insulin or sulfonylurea excess: diaphoresis, tremor, confusion, seizures",
        "Lactic acidosis from metformin in renal impairment: muscle pain, weakness, hyperventilation",
        "Agranulocytosis from methimazole: fever, sore throat, infection (CBC monitoring required)",
        "Genitourinary infections (UTIs and genital mycotic infections) from SGLT2 inhibitors",
        "Weight gain and edema from thiazolidinediones indicating fluid retention",
        "Adrenal crisis from abrupt corticosteroid withdrawal: hypotension, shock, altered consciousness"
      ],
      right: [
        "Blood glucose within target range (fasting 80-130 mg/dL, post-meal below 180 mg/dL)",
        "HbA1C below 7% indicating adequate glycemic control over prior 2-3 months",
        "TSH within normal range (0.4-4.0 mIU/L) on thyroid replacement therapy",
        "Stable weight and absence of polyuria/polydipsia with diabetes management",
        "Resolution of hypothyroid symptoms with appropriate levothyroxine dosing",
        "No signs of adrenal insufficiency during corticosteroid taper"
      ]
    },
    medications: [
      {
        name: "Insulin Lispro (Humalog)",
        type: "Rapid-Acting Insulin Analog",
        action: "Modified insulin molecule with reversed lysine-proline sequence enabling faster absorption and action. Mimics physiologic prandial insulin release to manage postprandial glucose excursions.",
        sideEffects: "Hypoglycemia, injection site reactions, lipodystrophy (with repeated same-site injection), weight gain, hypokalemia",
        contra: "Hypoglycemia episodes, hypersensitivity to insulin lispro",
        pearl: "Onset: 15 minutes. Peak: 1-2 hours. Duration: 3-5 hours. Administer within 15 minutes before or immediately after meals. Can be used in insulin pumps. Inject subcutaneously - do not mix with other insulins in the same syringe except NPH (draw rapid-acting first)."
      },
      {
        name: "Insulin Aspart (NovoLog)",
        type: "Rapid-Acting Insulin Analog",
        action: "Substitution of aspartic acid for proline at position B28 reduces self-association, allowing faster absorption from subcutaneous tissue for rapid glucose lowering",
        sideEffects: "Hypoglycemia, injection site lipodystrophy, weight gain, allergic reactions, peripheral edema",
        contra: "Hypoglycemia, known hypersensitivity",
        pearl: "Onset: 10-20 minutes. Peak: 1-3 hours. Duration: 3-5 hours. Similar profile to lispro. Can be used in insulin pumps. For IV use, only regular insulin should be used (aspart may be used IV in select protocols). Always verify concentration (U-100 vs U-200)."
      },
      {
        name: "Regular Insulin (Humulin R)",
        type: "Short-Acting Insulin",
        action: "Recombinant human insulin that binds to insulin receptors, promoting cellular glucose uptake, glycogen synthesis, and inhibiting hepatic gluconeogenesis",
        sideEffects: "Hypoglycemia, weight gain, injection site reactions, hypokalemia",
        contra: "Hypoglycemia",
        pearl: "Onset: 30-60 minutes. Peak: 2-4 hours. Duration: 6-8 hours. The ONLY insulin approved for IV administration. Used in DKA protocols, sliding scale regimens, and hyperkalemia management (with dextrose). Administer 30 minutes before meals when given subcutaneously."
      },
      {
        name: "NPH Insulin (Humulin N)",
        type: "Intermediate-Acting Insulin",
        action: "Protamine-conjugated insulin that forms a crystalline suspension, delaying absorption and providing intermediate-duration basal insulin coverage",
        sideEffects: "Hypoglycemia (especially at peak time), weight gain, injection site reactions, lipodystrophy",
        contra: "Hypoglycemia, IV administration (suspension will occlude IV line)",
        pearl: "Onset: 1-2 hours. Peak: 4-12 hours. Duration: 12-18 hours. Must be gently rolled (not shaken) to resuspend before injection. Cloudy appearance is normal. The pronounced peak increases nocturnal hypoglycemia risk. When mixing with rapid/short-acting insulin, always draw the clear insulin first ('clear before cloudy')."
      },
      {
        name: "Insulin Glargine (Lantus)",
        type: "Long-Acting Insulin Analog",
        action: "Modified insulin that forms microprecipitates at physiologic pH after subcutaneous injection, providing slow steady absorption with no pronounced peak, mimicking basal endogenous insulin secretion",
        sideEffects: "Hypoglycemia (less common than NPH), weight gain, injection site reactions, lipodystrophy",
        contra: "Hypoglycemia, IV administration, do not mix with any other insulin in the same syringe",
        pearl: "Onset: 1-2 hours. Peak: peakless (relatively flat profile). Duration: 20-24 hours. Administer once daily at the same time each day. Clear solution (unlike NPH). Do NOT mix with any other insulin - inject separately. Provides consistent basal coverage with less nocturnal hypoglycemia than NPH."
      },
      {
        name: "Insulin Detemir (Levemir)",
        type: "Long-Acting Insulin Analog",
        action: "Acylated insulin analog that binds to albumin in subcutaneous tissue and bloodstream, prolonging its action by slowing distribution to target tissues",
        sideEffects: "Hypoglycemia, weight gain (less than other insulins), injection site reactions, allergic reactions",
        contra: "Hypoglycemia, IV administration",
        pearl: "Onset: 1-2 hours. Peak: 6-8 hours (mild peak). Duration: up to 24 hours (may require twice-daily dosing). Associated with less weight gain compared to other basal insulins. Do not mix with other insulins. Clear solution. May need twice-daily dosing in some patients."
      },
      {
        name: "Insulin Degludec (Tresiba)",
        type: "Ultra-Long-Acting Insulin Analog",
        action: "Forms multi-hexamer chains after subcutaneous injection, creating a depot that releases insulin monomers slowly and consistently over an extended period exceeding 42 hours",
        sideEffects: "Hypoglycemia (lowest rate among basal insulins), weight gain, injection site reactions, allergic reactions",
        contra: "Hypoglycemia, IV administration",
        pearl: "Onset: 1-2 hours. Peak: peakless. Duration: greater than 42 hours. Allows flexible dosing time (minimum 8 hours between doses). Provides the most stable basal insulin coverage with lowest hypoglycemia risk among basal insulins. Available in U-100 and U-200 concentrations."
      },
      {
        name: "Metformin",
        type: "Biguanide (Oral Antidiabetic)",
        action: "Activates AMP-activated protein kinase (AMPK) to decrease hepatic glucose production, increase intestinal glucose absorption, and improve insulin sensitivity in peripheral tissues without stimulating insulin secretion",
        sideEffects: "GI upset (nausea, diarrhea, flatulence, metallic taste), vitamin B12 deficiency (long-term), lactic acidosis (rare but serious)",
        contra: "eGFR below 30 mL/min (contraindicated), eGFR 30-45 (do not initiate, may continue with monitoring), metabolic acidosis, acute or chronic conditions with tissue hypoxia, excessive alcohol intake",
        pearl: "First-line therapy for type 2 diabetes. Does NOT cause hypoglycemia when used alone (does not stimulate insulin secretion). Weight neutral or promotes modest weight loss. Hold 48 hours before and after IV iodinated contrast procedures. Take with meals to reduce GI side effects. Monitor vitamin B12 levels annually."
      },
      {
        name: "Glipizide",
        type: "Sulfonylurea (Insulin Secretagogue)",
        action: "Binds to sulfonylurea receptors on pancreatic beta cell membranes, blocking ATP-sensitive potassium channels, causing depolarization and calcium-mediated insulin release regardless of glucose level",
        sideEffects: "Hypoglycemia (most significant risk), weight gain, GI upset, photosensitivity, disulfiram-like reaction with alcohol, blood dyscrasias (rare)",
        contra: "Type 1 diabetes, DKA, sulfonamide allergy (cross-sensitivity possible), severe renal or hepatic impairment",
        pearl: "Sulfonylureas stimulate insulin secretion regardless of blood glucose level, making hypoglycemia the primary concern. Higher risk in elderly, malnourished, and renally impaired patients. Take 30 minutes before meals. Second-generation sulfonylureas (glipizide, glimepiride, glyburide) are more potent than first-generation."
      },
      {
        name: "Sitagliptin",
        type: "DPP-4 Inhibitor (Incretin Enhancer)",
        action: "Inhibits dipeptidyl peptidase-4 enzyme, preventing degradation of incretin hormones (GLP-1 and GIP), thereby increasing glucose-dependent insulin secretion and decreasing glucagon release",
        sideEffects: "Nasopharyngitis, upper respiratory infection, headache, pancreatitis (rare), joint pain, heart failure exacerbation (saxagliptin/alogliptin)",
        contra: "History of pancreatitis, type 1 diabetes, serious hypersensitivity to sitagliptin",
        pearl: "DPP-4 inhibitors are 'glucose-dependent,' meaning they only stimulate insulin when glucose is elevated, resulting in low hypoglycemia risk. Weight neutral. Monitor for signs of pancreatitis (severe abdominal pain radiating to back). Dose adjustment needed in renal impairment. The suffix '-gliptin' identifies this class."
      },
      {
        name: "Pioglitazone",
        type: "Thiazolidinedione (Insulin Sensitizer)",
        action: "Activates peroxisome proliferator-activated receptor gamma (PPAR-gamma) in adipose tissue, muscle, and liver, increasing insulin sensitivity and glucose uptake while reducing hepatic glucose output",
        sideEffects: "Weight gain, fluid retention/edema, heart failure exacerbation, bone fractures (especially in women), bladder cancer risk (long-term use - BLACK BOX WARNING for heart failure), hepatotoxicity, macular edema",
        contra: "NYHA Class III or IV heart failure (BLACK BOX WARNING), active bladder cancer, active liver disease",
        pearl: "BLACK BOX WARNING for heart failure due to fluid retention. Monitor liver function before and during therapy. Takes 2-3 months for full glycemic effect. Increases fracture risk in postmenopausal women. Do not use in patients with symptomatic heart failure."
      },
      {
        name: "Semaglutide",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics endogenous glucagon-like peptide-1 (GLP-1), stimulating glucose-dependent insulin secretion, suppressing glucagon, slowing gastric emptying, and promoting satiety through CNS appetite centers",
        sideEffects: "Nausea (most common, usually transient), vomiting, diarrhea, constipation, pancreatitis, injection site reactions, gallbladder disease",
        contra: "Personal or family history of medullary thyroid carcinoma (BLACK BOX WARNING), Multiple Endocrine Neoplasia syndrome type 2 (MEN 2), pancreatitis history",
        pearl: "BLACK BOX WARNING for thyroid C-cell tumors (medullary thyroid carcinoma) based on animal studies. Significant weight loss benefit (also FDA-approved for weight management at higher doses). Available as weekly subcutaneous injection (Ozempic) or daily oral tablet (Rybelsus). Start at low dose and titrate up to minimize GI side effects."
      },
      {
        name: "Liraglutide",
        type: "GLP-1 Receptor Agonist",
        action: "Long-acting GLP-1 analog with 97% homology to native GLP-1, providing glucose-dependent insulin stimulation, glucagon suppression, delayed gastric emptying, and central appetite reduction",
        sideEffects: "Nausea, vomiting, diarrhea, headache, pancreatitis, injection site reactions, tachycardia, renal impairment",
        contra: "Personal or family history of medullary thyroid carcinoma (BLACK BOX WARNING), MEN 2 syndrome, pancreatitis",
        pearl: "Same BLACK BOX WARNING as semaglutide for thyroid C-cell tumors. Daily subcutaneous injection. Also FDA-approved for weight management (Saxenda) and cardiovascular risk reduction (LEADER trial). Provides A1C reduction of 1.0-1.5% and promotes weight loss of 2-4 kg. Dose titration reduces GI intolerance."
      },
      {
        name: "Empagliflozin",
        type: "SGLT2 Inhibitor",
        action: "Blocks sodium-glucose cotransporter 2 in the proximal renal tubule, reducing glucose reabsorption and promoting urinary glucose excretion of approximately 70 g/day, lowering blood glucose independently of insulin",
        sideEffects: "Genital mycotic infections (yeast infections), urinary tract infections, polyuria, volume depletion, hypotension, euglycemic DKA, Fournier gangrene (rare), acute kidney injury",
        contra: "Severe renal impairment (eGFR below 20 for glycemic indication), type 1 diabetes, history of DKA, active serious UTI",
        pearl: "Provides cardiovascular mortality benefit (EMPA-REG OUTCOME trial) and renal protective effects independent of glucose lowering. Euglycemic DKA can occur even with normal blood glucose. Hold before surgery (at least 3 days). Teach patients about genital hygiene to prevent fungal infections. The suffix '-gliflozin' identifies this class."
      },
      {
        name: "Levothyroxine",
        type: "Thyroid Hormone Replacement (Synthetic T4)",
        action: "Provides exogenous thyroxine (T4) that is converted to triiodothyronine (T3) in peripheral tissues, binding to nuclear thyroid hormone receptors to regulate metabolic rate, protein synthesis, cardiac output, and thermogenesis",
        sideEffects: "Symptoms of hyperthyroidism if overdosed: tachycardia, palpitations, tremor, weight loss, insomnia, heat intolerance, anxiety, diarrhea, angina",
        contra: "Untreated adrenal insufficiency (may precipitate adrenal crisis), acute myocardial infarction, uncorrected thyrotoxicosis",
        pearl: "Take on an empty stomach 30-60 minutes before breakfast or at bedtime (at least 3 hours after last meal) with water only. Separate from calcium, iron, and antacids by at least 4 hours (they reduce absorption). Monitor TSH every 6-8 weeks after dose changes. Start low in elderly and cardiac patients (12.5-25 mcg daily)."
      },
      {
        name: "Methimazole",
        type: "Antithyroid Agent (Thionamide)",
        action: "Inhibits thyroid peroxidase enzyme, blocking oxidation and organification of iodide and coupling of iodotyrosines, thereby suppressing thyroid hormone synthesis",
        sideEffects: "Agranulocytosis (potentially fatal - monitor WBC), hepatotoxicity, rash, urticaria, arthralgia, GI upset, taste alteration, hypothyroidism (overtreatment)",
        contra: "Prior methimazole hypersensitivity, breastfeeding is acceptable at low doses, pregnancy (preferred over PTU after first trimester but both carry risks)",
        pearl: "Agranulocytosis is the most serious adverse effect - instruct patients to report fever, sore throat, or mouth sores immediately (obtain CBC). Methimazole is preferred over PTU for most patients due to once-daily dosing and lower hepatotoxicity risk. Takes 4-6 weeks for full effect because it blocks new hormone synthesis but does not affect stored hormone."
      },
      {
        name: "Propylthiouracil (PTU)",
        type: "Antithyroid Agent (Thionamide)",
        action: "Inhibits thyroid peroxidase (like methimazole) and additionally blocks peripheral conversion of T4 to T3, providing dual mechanism for reducing thyroid hormone activity",
        sideEffects: "Hepatotoxicity (BLACK BOX WARNING for severe liver failure), agranulocytosis, rash, vasculitis, lupus-like syndrome, GI upset",
        contra: "Hepatic disease, hypersensitivity to PTU",
        pearl: "BLACK BOX WARNING for severe hepatotoxicity including liver failure and death. Reserved for first trimester of pregnancy (when methimazole is contraindicated due to teratogenicity) and thyroid storm (due to additional peripheral T4-to-T3 conversion blockade). Requires three-times-daily dosing. Switch to methimazole after first trimester."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Binds to intracellular glucocorticoid receptors, modulating gene transcription to suppress inflammation and immune response, increase gluconeogenesis, and affect protein and fat metabolism",
        sideEffects: "Hyperglycemia, immunosuppression, osteoporosis, adrenal suppression, peptic ulcer disease, mood disturbances (euphoria, psychosis), insomnia, weight gain, cataracts, glaucoma, poor wound healing, growth retardation in children",
        contra: "Systemic fungal infections, live virus vaccines, active untreated infections",
        pearl: "Administer in the morning to mimic physiologic cortisol secretion and minimize adrenal suppression and insomnia. Taper gradually after more than 2 weeks of use to prevent adrenal crisis. Monitor blood glucose closely (may unmask or worsen diabetes). Concurrent calcium, vitamin D, and possibly bisphosphonate for bone protection with long-term use."
      },
      {
        name: "Dexamethasone",
        type: "Systemic Glucocorticoid (High Potency)",
        action: "Highly potent glucocorticoid with minimal mineralocorticoid activity, providing powerful anti-inflammatory and immunosuppressive effects approximately 25 times more potent than cortisol",
        sideEffects: "Same as prednisone but potentially more pronounced due to higher potency: hyperglycemia, immunosuppression, osteoporosis, adrenal suppression, myopathy, psychiatric effects",
        contra: "Systemic fungal infections, cerebral malaria, concurrent live vaccines",
        pearl: "25-30 times more potent than hydrocortisone with longest duration of action (36-72 hours biological half-life). Used in cerebral edema, croup, antiemetic regimens, and COVID-19 (showed mortality benefit in RECOVERY trial). No significant mineralocorticoid effect, so minimal sodium retention. Used in the dexamethasone suppression test for Cushing diagnosis."
      },
      {
        name: "Hydrocortisone",
        type: "Systemic Glucocorticoid (Physiologic Replacement)",
        action: "Synthetic cortisol providing both glucocorticoid and mineralocorticoid effects, used as physiologic replacement in adrenal insufficiency and stress-dose coverage",
        sideEffects: "Fluid retention (due to mineralocorticoid activity), hypertension, hypokalemia, hyperglycemia, immunosuppression, peptic ulcer, skin thinning",
        contra: "Systemic fungal infections, known hypersensitivity",
        pearl: "Drug of choice for adrenal crisis (IV hydrocortisone 100 mg bolus then 50 mg every 8 hours). Has both glucocorticoid and mineralocorticoid activity, making it ideal for adrenal insufficiency replacement. Stress dosing: double or triple the dose during physiologic stress (illness, surgery). Least potent systemic corticosteroid."
      },
      {
        name: "Estrogen (Conjugated Estrogens / Estradiol)",
        type: "Hormone Replacement Therapy",
        action: "Binds to estrogen receptors (ER-alpha and ER-beta) in target tissues, regulating gene transcription involved in reproductive function, bone metabolism, cardiovascular protection, and CNS function",
        sideEffects: "Venous thromboembolism (DVT/PE), breast tenderness, nausea, headache, fluid retention, breakthrough bleeding, increased risk of breast cancer (with long-term use), endometrial hyperplasia (without progesterone in women with intact uterus)",
        contra: "Known or suspected breast cancer, active DVT/PE or history of thromboembolic events, undiagnosed vaginal bleeding, active liver disease, pregnancy",
        pearl: "Use the lowest effective dose for the shortest duration necessary to treat menopausal symptoms. Unopposed estrogen (without progesterone) in women with an intact uterus increases endometrial cancer risk. Transdermal delivery has lower VTE risk than oral. Black Box Warning for cardiovascular events and breast cancer with prolonged use."
      },
      {
        name: "Progesterone (Medroxyprogesterone)",
        type: "Progestational Hormone",
        action: "Binds to progesterone receptors, transforming proliferative endometrium to secretory endometrium, preventing endometrial hyperplasia, and providing contraceptive effects through multiple mechanisms",
        sideEffects: "Breakthrough bleeding, weight gain, mood changes, depression, headache, breast tenderness, decreased bone density (injectable form), acne",
        contra: "Known or suspected pregnancy, active thromboembolic disease, liver dysfunction, undiagnosed vaginal bleeding, breast cancer",
        pearl: "Must be combined with estrogen in hormone replacement therapy for women with intact uterus to prevent estrogen-induced endometrial hyperplasia and cancer. Injectable medroxyprogesterone (Depo-Provera) for contraception may cause reversible bone density loss. Black Box Warning includes loss of bone mineral density with prolonged injectable use."
      },
      {
        name: "Testosterone",
        type: "Androgen Hormone",
        action: "Binds to androgen receptors in target tissues, promoting protein synthesis, muscle development, bone density, erythropoiesis, and male sexual characteristics",
        sideEffects: "Polycythemia (increased red blood cells), acne, sleep apnea exacerbation, hepatotoxicity (oral forms), mood changes, gynecomastia (from aromatization to estrogen), testicular atrophy, infertility, cardiovascular risk",
        contra: "Prostate cancer, breast cancer in males, polycythemia, severe cardiac/hepatic/renal disease, pregnancy (Category X - virilization of female fetus)",
        pearl: "Monitor hematocrit (withhold if above 54% due to polycythemia and stroke/MI risk), PSA, and lipid panel regularly. Available as injections, topical gels, patches, and pellets. Topical gels require caution to avoid transfer to women and children through skin contact. Exogenous testosterone suppresses spermatogenesis and may cause infertility."
      }
    ],
    pearls: [
      "Regular insulin is the ONLY insulin that can be administered intravenously; all other insulin formulations are subcutaneous only.",
      "When mixing insulins, always draw clear (regular/rapid) before cloudy (NPH) to prevent contamination of the clear vial - remember 'clear before cloudy.'",
      "Long-acting insulins (glargine, detemir, degludec) should NEVER be mixed with other insulins in the same syringe.",
      "Metformin does not cause hypoglycemia when used alone because it does not stimulate insulin secretion; however, it can cause hypoglycemia when combined with insulin or sulfonylureas.",
      "GLP-1 receptor agonists (semaglutide, liraglutide) carry a Black Box Warning for medullary thyroid carcinoma - contraindicated in patients with personal or family history of MTC or MEN 2 syndrome.",
      "PTU is reserved for first trimester of pregnancy and thyroid storm because of its Black Box Warning for hepatotoxicity; methimazole is preferred for all other situations.",
      "Levothyroxine must be taken on an empty stomach and separated from calcium, iron, and antacids by 4 hours to ensure adequate absorption.",
      "The Rule of 15 for hypoglycemia treatment: give 15 grams of fast-acting carbohydrate, wait 15 minutes, recheck glucose, and repeat if still below 70 mg/dL.",
      "SGLT2 inhibitors can cause euglycemic DKA (DKA with normal blood glucose), which is a diagnostic challenge - check ketones in patients with symptoms of DKA regardless of glucose level."
    ],
    lifespan: {
      title: "Lifespan Considerations in Endocrine",
      content: "Pediatric type 1 diabetes management requires careful insulin dose adjustment for growth spurts, variable activity levels, and pubertal hormonal changes. Older adults are at increased risk for hypoglycemia and may have less stringent A1C targets (below 8% rather than 7%). Pregnancy requires tight glycemic control (A1C below 6.5%) using insulin as the primary agent since most oral antidiabetics are contraindicated. Gestational diabetes is typically managed with diet first, then insulin if needed. In pregnancy, PTU is used in the first trimester and methimazole afterward. Growth hormone, thyroid hormone, and corticosteroid dosing in children requires frequent monitoring and adjustment based on growth charts and developmental milestones."
    },
    quiz: [
      {
        question: "A nurse is preparing to administer insulin to a patient who takes both NPH and regular insulin. What is the correct technique?",
        options: [
          "Draw NPH first, then regular insulin into the same syringe",
          "Draw regular (clear) insulin first, then NPH (cloudy) insulin into the same syringe",
          "Mix both insulins in a separate cup before drawing into the syringe",
          "Administer NPH and regular insulin in separate syringes at different sites only"
        ],
        correct: 1,
        rationale: "When mixing insulins, always draw clear (regular) before cloudy (NPH) to prevent NPH protamine from contaminating the regular insulin vial. This is remembered as 'clear before cloudy.' The insulins can be mixed in the same syringe."
      },
      {
        question: "Which insulin is the ONLY type approved for intravenous administration?",
        options: [
          "Insulin glargine (Lantus)",
          "NPH insulin (Humulin N)",
          "Regular insulin (Humulin R)",
          "Insulin lispro (Humalog)"
        ],
        correct: 2,
        rationale: "Regular insulin is the only insulin approved for IV administration. Long-acting insulins like glargine form precipitates and would occlude IV lines. NPH is a suspension and cannot be given IV. While some rapid-acting insulins may be used IV in select protocols, regular insulin is the standard for IV use in DKA and hyperkalemia."
      },
      {
        question: "A patient on metformin is scheduled for a CT scan with IV contrast dye. What is the appropriate nursing action?",
        options: [
          "Continue metformin as usual; contrast dye does not interact with metformin",
          "Hold metformin 48 hours before and 48 hours after the procedure, monitoring renal function",
          "Administer a double dose of metformin before the procedure to prevent hyperglycemia",
          "Switch to insulin glargine permanently before the procedure"
        ],
        correct: 1,
        rationale: "Metformin must be held 48 hours before and after IV contrast dye administration because contrast dye can impair renal function, and metformin is renally cleared. Impaired clearance of metformin in the setting of contrast-induced nephropathy increases the risk of lactic acidosis. Renal function should be verified before resuming."
      },
      {
        question: "A patient taking levothyroxine asks when to take the medication. What is the correct instruction?",
        options: [
          "Take with breakfast for best absorption",
          "Take at bedtime with a glass of milk",
          "Take on an empty stomach 30-60 minutes before breakfast with water",
          "Take with iron and calcium supplements for synergistic effects"
        ],
        correct: 2,
        rationale: "Levothyroxine should be taken on an empty stomach 30-60 minutes before breakfast with water only to ensure optimal absorption. Calcium, iron, and antacids must be separated by at least 4 hours as they bind to levothyroxine and reduce its absorption. Food also decreases absorption."
      },
      {
        question: "Which adverse effect of methimazole requires immediate reporting and discontinuation of the medication?",
        options: [
          "Mild skin rash",
          "Metallic taste in the mouth",
          "Fever, sore throat, and mouth ulcers suggesting agranulocytosis",
          "Mild GI upset after taking the medication"
        ],
        correct: 2,
        rationale: "Fever, sore throat, and mouth ulcers are signs of agranulocytosis, a potentially life-threatening adverse effect of methimazole. Patients must be instructed to report these symptoms immediately. A CBC should be obtained and the drug discontinued if agranulocytosis is confirmed. Mild rash and GI upset are common and less serious side effects."
      }
    ]
  }
};
