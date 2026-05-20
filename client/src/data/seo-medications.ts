export interface SeoMedication {
  slug: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  mechanism: string;
  indications: string[];
  sideEffects: { effect: string; severity: string; detail: string }[];
  contraindications: string[];
  nursingConsiderations: string[];
  examTips: string[];
  practiceQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    rationale: string;
  }[];
  targetKeywords: string[];
  metaTitle: string;
  metaDescription: string;
}

export const seoMedications: SeoMedication[] = [
  {
    slug: "metformin",
    genericName: "Metformin",
    brandNames: ["Glucophage", "Glumetza", "Fortamet"],
    drugClass: "Biguanide (Oral Hypoglycemic)",
    mechanism:
      "Activates AMP-activated protein kinase (AMPK) in hepatocytes, suppressing hepatic gluconeogenesis and improving peripheral insulin sensitivity. Enters hepatocytes via organic cation transporter 1 (OCT1) and partially inhibits mitochondrial respiratory chain complex I, reducing ATP production and increasing the AMP:ATP ratio. Does NOT stimulate insulin release from pancreatic beta cells, so hypoglycemia does not occur as monotherapy.",
    indications: [
      "Type 2 diabetes mellitus (first-line therapy)",
      "Prediabetes (off-label)",
      "Polycystic ovary syndrome (off-label)",
      "Insulin resistance syndromes",
    ],
    sideEffects: [
      { effect: "GI disturbances (nausea, diarrhea, cramping)", severity: "Common", detail: "Increased intestinal serotonin release and altered bile acid metabolism. Taking with meals and using extended-release formulation reduces symptoms." },
      { effect: "Lactic acidosis", severity: "Life-threatening", detail: "Inhibition of mitochondrial complex I impairs lactate conversion. Risk increases with renal impairment, hepatic disease, excessive alcohol, dehydration, sepsis, and hypoxic states." },
      { effect: "Vitamin B12 deficiency", severity: "Common (long-term)", detail: "Interferes with calcium-dependent intrinsic factor-B12 complex binding in the ileum, reducing B12 absorption by up to 30%." },
      { effect: "Metallic taste", severity: "Common", detail: "Direct stimulation of taste receptor cells and altered zinc homeostasis in taste buds." },
    ],
    contraindications: [
      "eGFR < 30 mL/min (severe renal impairment)",
      "Metabolic acidosis, including diabetic ketoacidosis",
      "Within 48 hours of iodinated contrast dye procedures",
      "Severe hepatic impairment",
      "Excessive alcohol use",
      "Conditions predisposing to tissue hypoxia (sepsis, shock, acute heart failure)",
    ],
    nursingConsiderations: [
      "Monitor renal function (eGFR) before starting and at least annually; contraindicated if eGFR < 30 mL/min, dose reduction at eGFR 30-45.",
      "Hold 48 hours before and after iodinated contrast dye procedures to prevent acute kidney injury and metformin accumulation.",
      "Administer with meals to reduce GI side effects; extended-release formulation further improves tolerance.",
      "Monitor B12 levels periodically, especially with symptoms of peripheral neuropathy.",
      "Teach patient that metformin alone does NOT cause hypoglycemia; risk increases when combined with insulin or sulfonylureas.",
    ],
    examTips: [
      "First-line therapy for type 2 diabetes - always the correct initial choice on exams.",
      "Does NOT cause hypoglycemia as monotherapy - key differentiator from sulfonylureas.",
      "Hold before contrast dye - classic exam question about procedure preparation.",
      "Lactic acidosis is rare but life-threatening - know the risk factors (renal impairment, alcohol, hypoxia).",
      "Weight neutral or modest weight loss - unlike insulin and sulfonylureas.",
    ],
    practiceQuestions: [
      {
        question: "A patient with type 2 diabetes is scheduled for a CT scan with IV contrast. The patient takes metformin 1000 mg twice daily. What is the priority nursing action?",
        options: [
          "Administer the metformin as scheduled before the procedure",
          "Hold metformin 48 hours before and after the contrast procedure",
          "Switch metformin to insulin for the day of the procedure",
          "Increase fluid intake but continue all medications as prescribed",
        ],
        correctIndex: 1,
        rationale: "Metformin must be held 48 hours before and after iodinated contrast dye procedures. Contrast-induced nephropathy can reduce metformin clearance, causing toxic accumulation and lactic acidosis.",
      },
      {
        question: "A nurse is educating a patient newly prescribed metformin. Which statement by the patient indicates understanding?",
        options: [
          "I will take this medication on an empty stomach each morning.",
          "I need to carry glucose tablets in case my blood sugar drops too low.",
          "I should take this medication with meals to reduce stomach upset.",
          "I should avoid eating any carbohydrates while on this medication.",
        ],
        correctIndex: 2,
        rationale: "Metformin should be taken with meals to minimize GI side effects. As monotherapy, metformin does not cause hypoglycemia, so glucose tablets are not specifically required for metformin alone.",
      },
      {
        question: "Which laboratory value should be monitored periodically in a patient on long-term metformin therapy?",
        options: [
          "Serum calcium",
          "Vitamin B12 level",
          "INR",
          "Serum sodium",
        ],
        correctIndex: 1,
        rationale: "Long-term metformin use interferes with vitamin B12 absorption in the ileum. Periodic B12 monitoring is recommended, especially if the patient develops symptoms of peripheral neuropathy.",
      },
    ],
    targetKeywords: ["metformin nursing", "metformin side effects nursing", "metformin NCLEX", "metformin pharmacology", "biguanide nursing considerations"],
    metaTitle: "Metformin Nursing Pharmacology Guide | NurseNest",
    metaDescription: "Complete metformin pharmacology review for nursing students. Drug class, mechanism of action, side effects, nursing considerations, and NCLEX-style practice questions.",
  },
  {
    slug: "lisinopril",
    genericName: "Lisinopril",
    brandNames: ["Prinivil", "Zestril"],
    drugClass: "ACE Inhibitor (Angiotensin-Converting Enzyme Inhibitor)",
    mechanism:
      "Inhibits angiotensin-converting enzyme (ACE), blocking conversion of angiotensin I to angiotensin II. This reduces vasoconstriction and aldosterone secretion. ACE also degrades bradykinin; by blocking ACE, lisinopril preserves bradykinin, causing vasodilation through nitric oxide and prostacyclin release. Accumulated bradykinin sensitizes airway C-fibers, causing the characteristic dry cough.",
    indications: [
      "Hypertension",
      "Heart failure",
      "Post-myocardial infarction (left ventricular dysfunction)",
      "Diabetic nephropathy (proteinuria reduction)",
      "Chronic kidney disease (renoprotective)",
    ],
    sideEffects: [
      { effect: "Dry cough", severity: "Common", detail: "Accumulated bradykinin and substance P stimulate airway C-fiber sensory nerves. Not dose-dependent. Resolves 1-4 weeks after discontinuation." },
      { effect: "Hyperkalemia", severity: "Serious", detail: "Reduced aldosterone secretion decreases distal tubule potassium excretion. Dangerous in renal impairment or with potassium-sparing diuretics." },
      { effect: "Angioedema", severity: "Life-threatening", detail: "Bradykinin accumulation causes vascular permeability and tissue edema, particularly face, lips, tongue, and larynx. Can be fatal if airway compromised." },
      { effect: "Acute kidney injury (first-dose hypotension)", severity: "Serious", detail: "In bilateral renal artery stenosis, ACE inhibition removes compensatory efferent arteriolar constriction, causing GFR to drop." },
      { effect: "Teratogenicity", severity: "Life-threatening", detail: "Causes renal dysgenesis, oligohydramnios, and fetal death. Absolutely contraindicated in pregnancy." },
    ],
    contraindications: [
      "Pregnancy (Category D/X - teratogenic)",
      "History of angioedema (ACE inhibitor or idiopathic)",
      "Bilateral renal artery stenosis",
      "Concurrent use with aliskiren in patients with diabetes",
      "Concurrent use with sacubitril (neprilysin inhibitor) within 36 hours",
    ],
    nursingConsiderations: [
      "Monitor potassium levels, especially when combined with potassium supplements, potassium-sparing diuretics, or in renal impairment.",
      "Check baseline and periodic BUN/creatinine; rising creatinine (>30% from baseline) may indicate renal artery stenosis.",
      "Teach patient about dry cough: it is NOT an allergic reaction and will resolve if medication is switched to an ARB.",
      "Pregnancy test before starting in women of childbearing age. Absolutely contraindicated in pregnancy.",
      "Monitor for angioedema: swelling of face, lips, tongue, or throat requires immediate discontinuation and emergency treatment.",
      "First-dose hypotension risk: advise taking first dose at bedtime, especially in patients on diuretics.",
    ],
    examTips: [
      "Dry cough = ACE inhibitor side effect. Switch to ARB (e.g., losartan) if cough intolerable.",
      "Pregnancy is an absolute contraindication - always choose to discontinue or avoid in pregnant patients.",
      "Monitor potassium - ACE inhibitors cause hyperKALemia (opposite of diuretics).",
      "Angioedema is a medical emergency requiring airway management.",
      "Renoprotective in diabetic nephropathy - correct choice for diabetic patients with proteinuria.",
    ],
    practiceQuestions: [
      {
        question: "A patient taking lisinopril reports a persistent dry cough that started 2 weeks after beginning the medication. What is the best nursing response?",
        options: [
          "Instruct the patient to take a cough suppressant with the medication.",
          "Explain this is a common side effect and notify the provider about switching to an ARB.",
          "Tell the patient to discontinue the medication immediately.",
          "Assess for signs of heart failure exacerbation.",
        ],
        correctIndex: 1,
        rationale: "Dry cough is a well-known side effect of ACE inhibitors caused by bradykinin accumulation. Switching to an ARB (which does not affect bradykinin) typically resolves the cough.",
      },
      {
        question: "A nurse is reviewing a newly admitted patient's medication list. The patient takes lisinopril and just received a positive pregnancy test. What is the priority action?",
        options: [
          "Continue the medication and monitor blood pressure closely.",
          "Reduce the dose to the lowest effective amount.",
          "Notify the provider immediately to discontinue the medication.",
          "Switch to a higher dose to maintain blood pressure control during pregnancy.",
        ],
        correctIndex: 2,
        rationale: "ACE inhibitors are absolutely contraindicated in pregnancy due to teratogenic effects including fetal renal dysgenesis and oligohydramnios. The provider must be notified immediately to discontinue and select an alternative antihypertensive.",
      },
      {
        question: "Which laboratory finding should the nurse report immediately in a patient taking lisinopril?",
        options: [
          "Potassium 5.8 mEq/L",
          "Sodium 138 mEq/L",
          "BUN 18 mg/dL",
          "Glucose 110 mg/dL",
        ],
        correctIndex: 0,
        rationale: "ACE inhibitors reduce aldosterone secretion, which decreases potassium excretion. A potassium of 5.8 mEq/L is dangerously elevated and can cause fatal cardiac arrhythmias. This requires immediate notification.",
      },
    ],
    targetKeywords: ["lisinopril nursing", "ACE inhibitor side effects", "lisinopril NCLEX", "ACE inhibitor pharmacology", "lisinopril nursing considerations"],
    metaTitle: "Lisinopril (ACE Inhibitor) Nursing Pharmacology Guide | NurseNest",
    metaDescription: "Master lisinopril pharmacology for nursing exams. ACE inhibitor mechanism, side effects including dry cough and angioedema, nursing considerations, and practice questions.",
  },
  {
    slug: "warfarin",
    genericName: "Warfarin",
    brandNames: ["Coumadin", "Jantoven"],
    drugClass: "Vitamin K Antagonist (Oral Anticoagulant)",
    mechanism:
      "Inhibits vitamin K epoxide reductase (VKORC1), preventing the recycling of vitamin K needed for synthesis of clotting factors II, VII, IX, and X. Only affects synthesis of NEW factors; does not inactivate existing circulating factors. Full anticoagulation takes 5-7 days because onset depends on the half-life of each factor: Factor VII (6h), IX (24h), X (36h), II (60h).",
    indications: [
      "Atrial fibrillation (stroke prevention)",
      "Mechanical heart valves",
      "Deep vein thrombosis (treatment and prevention)",
      "Pulmonary embolism",
      "Hypercoagulable states",
    ],
    sideEffects: [
      { effect: "Hemorrhage", severity: "Life-threatening", detail: "Excessive inhibition of clotting factor synthesis reduces hemostatic capacity below the threshold for wound sealing." },
      { effect: "Skin necrosis", severity: "Life-threatening", detail: "Protein C (shortest half-life) depletes before pro-coagulant factors, creating transient hypercoagulable state causing microvascular thrombosis in adipose tissue." },
      { effect: "Purple toe syndrome", severity: "Serious", detail: "Cholesterol crystal embolization from atherosclerotic plaques, facilitated by anticoagulant effect reducing thrombus stability." },
    ],
    contraindications: [
      "Pregnancy (Category X - teratogenic, crosses placenta)",
      "Active bleeding or hemorrhagic tendencies",
      "Recent surgery of the CNS or eye",
      "Severe hepatic disease",
      "Unsupervised patients with high fall risk",
      "Malignant hypertension",
    ],
    nursingConsiderations: [
      "Monitor INR regularly: therapeutic range 2.0-3.0 for most indications, 2.5-3.5 for mechanical mitral valves.",
      "Teach consistent vitamin K intake: do not eliminate green vegetables, maintain CONSISTENT intake to keep INR stable.",
      "Warfarin has extensive drug-food interactions: antibiotics, NSAIDs, and many herbal supplements alter metabolism.",
      "Pregnancy category X: crosses placenta and is teratogenic. Must use alternative anticoagulation in pregnant patients.",
      "Reversal: vitamin K (phytonadione) reverses effect in 12-24h; for acute hemorrhage, use FFP or 4-factor PCC for immediate reversal.",
    ],
    examTips: [
      "INR is the monitoring lab for warfarin (not aPTT - that is heparin).",
      "Consistent vitamin K intake - do not eliminate, just keep consistent.",
      "Pregnancy category X - always contraindicated in pregnancy.",
      "Antidote is vitamin K (phytonadione); for emergencies, use FFP or 4-factor PCC.",
      "Takes 5-7 days for full effect - requires heparin bridge for acute anticoagulation.",
    ],
    practiceQuestions: [
      {
        question: "A patient on warfarin has an INR of 5.2 with no active bleeding. What is the priority nursing action?",
        options: [
          "Administer protamine sulfate IV immediately.",
          "Hold warfarin and notify the provider; vitamin K may be ordered.",
          "Prepare for emergency blood transfusion.",
          "Continue the current dose and recheck INR in 1 week.",
        ],
        correctIndex: 1,
        rationale: "An INR of 5.2 is supratherapeutic and increases bleeding risk. Without active bleeding, the priority is to hold warfarin and notify the provider. Vitamin K may be ordered to bring the INR back into range. Protamine sulfate is the antidote for heparin, not warfarin.",
      },
      {
        question: "Which patient statement indicates a need for further teaching about warfarin?",
        options: [
          "I will have my INR checked regularly as ordered.",
          "I stopped eating all green vegetables to keep my INR stable.",
          "I will avoid taking aspirin unless my doctor approves it.",
          "I will report unusual bruising or bleeding to my doctor.",
        ],
        correctIndex: 1,
        rationale: "Patients should not eliminate vitamin K-rich foods; they should maintain CONSISTENT intake. Dramatic changes in vitamin K consumption cause INR fluctuations.",
      },
      {
        question: "A nurse is caring for a patient taking warfarin who is also prescribed a new antibiotic (metronidazole). What is the most important nursing action?",
        options: [
          "Administer both medications at different times of day.",
          "Monitor INR more frequently; antibiotics can increase warfarin effect.",
          "Hold the warfarin until the antibiotic course is completed.",
          "No action needed; antibiotics do not interact with warfarin.",
        ],
        correctIndex: 1,
        rationale: "Metronidazole inhibits CYP2C9, the enzyme that metabolizes warfarin. This interaction increases warfarin levels and bleeding risk. More frequent INR monitoring is essential.",
      },
    ],
    targetKeywords: ["warfarin nursing", "warfarin INR monitoring", "warfarin NCLEX", "coumadin nursing considerations", "vitamin K antagonist pharmacology"],
    metaTitle: "Warfarin (Coumadin) Nursing Pharmacology Guide | NurseNest",
    metaDescription: "Complete warfarin pharmacology for nursing exams. INR monitoring, vitamin K interactions, nursing considerations, reversal agents, and NCLEX practice questions.",
  },
  {
    slug: "insulin",
    genericName: "Regular Insulin (Human)",
    brandNames: ["Humulin R", "Novolin R"],
    drugClass: "Short-Acting Insulin",
    mechanism:
      "Binds to insulin tyrosine kinase receptors, promoting glucose uptake via GLUT-4 translocation to the cell membrane in skeletal muscle and adipose tissue. Stimulates glycogen synthesis, suppresses hepatic gluconeogenesis, and inhibits lipolysis. Also activates Na+/K+ ATPase pumps, driving potassium into cells, which is therapeutically exploited to treat hyperkalemia.",
    indications: [
      "Diabetic ketoacidosis (DKA) - IV infusion",
      "Hyperkalemia (with dextrose)",
      "Type 1 diabetes mellitus",
      "Type 2 diabetes (when oral agents insufficient)",
      "Hyperglycemia management in hospitalized patients",
    ],
    sideEffects: [
      { effect: "Hypoglycemia", severity: "Life-threatening", detail: "Excessive glucose uptake relative to supply. Brain depends on glucose; neuroglycopenia causes confusion, seizures, coma, death. Most common and most dangerous insulin side effect." },
      { effect: "Hypokalemia", severity: "Life-threatening", detail: "Insulin activates Na+/K+ ATPase pumps, shifting K+ intracellularly. Serum K+ drops rapidly, causing potentially lethal arrhythmias." },
      { effect: "Lipodystrophy", severity: "Common", detail: "Repeated injection at the same site causes lipohypertrophy or lipoatrophy, impairing absorption predictability." },
      { effect: "Weight gain", severity: "Common", detail: "Insulin promotes anabolic processes and reduces glucosuria, retaining calories that were previously lost." },
    ],
    contraindications: [
      "Hypoglycemia (blood glucose < 70 mg/dL)",
      "Hypokalemia (K+ < 3.3 mEq/L) before initiating insulin in DKA",
      "Known hypersensitivity to insulin product components",
    ],
    nursingConsiderations: [
      "Only regular insulin can be given IV - no other insulin type can be administered intravenously.",
      "In DKA: check potassium BEFORE starting insulin. If K+ < 3.3, replace potassium FIRST. Monitor K+ every 1-2 hours during infusion.",
      "When glucose approaches 200-250 in DKA, add dextrose to IV fluids - do NOT stop insulin (ketoacidosis correction requires continued insulin).",
      "For subcutaneous regular insulin: onset 30-60 min, peak 2-4 hours, duration 6-8 hours. Give 30 minutes before meals.",
      "Always verify units with another nurse (independent double-check). Insulin errors are among the most common and dangerous medication errors.",
      "Hypoglycemia treatment: Rule of 15 - 15g fast-acting carbohydrate, recheck in 15 minutes. If unconscious: glucagon IM or D50 IV.",
    ],
    examTips: [
      "Only REGULAR insulin can be given IV - the most tested insulin fact on exams.",
      "Check potassium BEFORE giving insulin in DKA - hypokalemia kills before hyperglycemia.",
      "Rule of 15 for hypoglycemia - 15g carbs, recheck in 15 minutes.",
      "Do NOT stop insulin in DKA when glucose normalizes - add dextrose instead.",
      "High-alert medication requiring independent double-check.",
    ],
    practiceQuestions: [
      {
        question: "A patient in DKA has a serum potassium of 3.0 mEq/L. The provider orders an insulin drip. What is the nurse's priority action?",
        options: [
          "Start the insulin drip as ordered and monitor potassium hourly.",
          "Hold insulin, notify the provider, and replace potassium first.",
          "Administer the insulin drip with an additional potassium supplement.",
          "Reduce the insulin drip rate by half until potassium normalizes.",
        ],
        correctIndex: 1,
        rationale: "Insulin drives potassium intracellularly. Starting insulin with a K+ of 3.0 mEq/L (already hypokalemic) can cause fatal cardiac arrhythmias. Potassium must be replaced to at least 3.3 mEq/L before starting insulin.",
      },
      {
        question: "The nurse is preparing to administer insulin. Which type can be given intravenously?",
        options: [
          "NPH (isophane) insulin",
          "Insulin glargine (Lantus)",
          "Regular insulin (Humulin R)",
          "Insulin detemir (Levemir)",
        ],
        correctIndex: 2,
        rationale: "Only regular insulin can be administered intravenously. NPH, glargine, and detemir are designed for subcutaneous use only. This is a high-yield exam fact.",
      },
      {
        question: "A patient with type 1 diabetes on an insulin drip for DKA now has a blood glucose of 220 mg/dL. What should the nurse do?",
        options: [
          "Discontinue the insulin drip since blood glucose is near normal.",
          "Continue the insulin drip and add dextrose to the IV fluids.",
          "Switch to subcutaneous insulin immediately.",
          "Hold the insulin drip for 2 hours then resume at half rate.",
        ],
        correctIndex: 1,
        rationale: "In DKA, insulin must continue until the anion gap closes and ketoacidosis resolves. When glucose approaches 200-250 mg/dL, dextrose is added to IV fluids to prevent hypoglycemia while continuing insulin for ketoacidosis correction.",
      },
    ],
    targetKeywords: ["insulin nursing", "regular insulin IV", "insulin DKA nursing", "insulin NCLEX", "insulin pharmacology nursing"],
    metaTitle: "Insulin Nursing Pharmacology Guide | NurseNest",
    metaDescription: "Master insulin pharmacology for nursing exams. Regular insulin IV administration, DKA management, hypoglycemia treatment, Rule of 15, and NCLEX practice questions.",
  },
  {
    slug: "amiodarone",
    genericName: "Amiodarone",
    brandNames: ["Cordarone", "Pacerone", "Nexterone"],
    drugClass: "Class III Antiarrhythmic (Potassium Channel Blocker)",
    mechanism:
      "Blocks potassium channels (Class III effect), prolonging repolarization and the refractory period. Also has Class I (sodium channel blocking), Class II (beta-blocking), and Class IV (calcium channel blocking) properties, making it the most broad-spectrum antiarrhythmic. Contains 37% iodine by weight, which causes significant thyroid effects. Extremely lipophilic with a half-life of 40-55 days.",
    indications: [
      "Life-threatening ventricular arrhythmias (VT/VF)",
      "Atrial fibrillation (rhythm and rate control)",
      "ACLS: refractory ventricular fibrillation / pulseless VT",
      "Supraventricular tachycardia",
    ],
    sideEffects: [
      { effect: "Pulmonary toxicity (pneumonitis/fibrosis)", severity: "Life-threatening", detail: "Direct cytotoxic damage to type II pneumocytes causes phospholipidosis. Can be fatal and irreversible. Monitor with baseline and periodic PFTs and chest X-rays." },
      { effect: "Thyroid dysfunction", severity: "Serious", detail: "Iodine content causes hypothyroidism (Wolff-Chaikoff effect) or hyperthyroidism (Jod-Basedow phenomenon). Inhibits T4 to T3 conversion." },
      { effect: "Hepatotoxicity", severity: "Serious", detail: "Phospholipidosis in hepatocytes causes steatohepatitis. Monitor LFTs regularly." },
      { effect: "Corneal microdeposits", severity: "Common", detail: "Lipophilic drug-phospholipid complexes accumulate in corneal epithelium in >90% of patients. Usually asymptomatic." },
      { effect: "Photosensitivity / blue-gray skin", severity: "Common", detail: "Absorbs UV light generating free radicals. Long-term accumulation causes characteristic blue-gray skin discoloration." },
      { effect: "QT prolongation", severity: "Serious", detail: "Potassium channel blockade prolongs repolarization; can trigger torsades de pointes, though less common than with other Class III agents." },
    ],
    contraindications: [
      "Severe sinus node dysfunction (unless pacemaker present)",
      "Second- or third-degree heart block (without pacemaker)",
      "Cardiogenic shock",
      "Known hypersensitivity to iodine",
      "Severe hepatic impairment",
    ],
    nursingConsiderations: [
      "Baseline and periodic monitoring required: PFTs every 3-6 months, TFTs every 6 months, LFTs, chest X-ray, ophthalmologic exam.",
      "Assess for pulmonary toxicity: new-onset dyspnea, cough, or fever is pulmonary toxicity until proven otherwise.",
      "IV administration: use in-line filter, administer through central line when possible. Never mix with other drugs.",
      "Teach sun protection: SPF 50+ sunscreen and protective clothing due to severe photosensitivity.",
      "Drug interactions extensive due to CYP3A4 and CYP2C9 inhibition: reduce digoxin dose by 50%, warfarin dose by 30-50%.",
      "Half-life is 40-55 days: adverse effects may persist for months after discontinuation.",
    ],
    examTips: [
      "Pulmonary toxicity is the most dangerous side effect - any respiratory symptoms on amiodarone are guilty until proven innocent.",
      "Contains iodine - can cause both hypo- and hyperthyroidism. Monitor TFTs.",
      "Drug interaction with digoxin: reduce digoxin dose by 50% when starting amiodarone.",
      "Drug interaction with warfarin: reduce warfarin dose by 30-50% and monitor INR closely.",
      "Half-life of 40-55 days - effects last long after discontinuation.",
      "IV: use in-line filter and central line. Causes phlebitis peripherally.",
    ],
    practiceQuestions: [
      {
        question: "A patient on amiodarone reports new-onset shortness of breath and a dry cough. What is the priority nursing action?",
        options: [
          "Administer a bronchodilator and reassess in 30 minutes.",
          "Document the findings and continue monitoring during the next shift.",
          "Notify the provider immediately - this may indicate pulmonary toxicity.",
          "Encourage deep breathing exercises and incentive spirometry.",
        ],
        correctIndex: 2,
        rationale: "Pulmonary toxicity is a life-threatening complication of amiodarone. Any new respiratory symptoms in a patient on amiodarone should be treated as pulmonary toxicity until proven otherwise. Immediate provider notification is essential.",
      },
      {
        question: "A patient is taking both amiodarone and digoxin. The nurse notes a digoxin level of 2.4 ng/mL. What interaction is most likely responsible?",
        options: [
          "Amiodarone increases renal clearance of digoxin.",
          "Amiodarone inhibits CYP3A4 and P-glycoprotein, increasing digoxin levels.",
          "Digoxin interferes with amiodarone absorption.",
          "Amiodarone converts digoxin to an active metabolite.",
        ],
        correctIndex: 1,
        rationale: "Amiodarone inhibits P-glycoprotein and CYP3A4, significantly increasing digoxin levels. The digoxin dose should be reduced by approximately 50% when amiodarone is started. A level of 2.4 ng/mL exceeds the therapeutic range (0.5-2.0 ng/mL).",
      },
      {
        question: "Which monitoring is essential for a patient on long-term amiodarone therapy? Select the most comprehensive answer.",
        options: [
          "CBC and electrolytes every 6 months.",
          "PFTs, TFTs, LFTs, chest X-ray, and ophthalmologic exam periodically.",
          "Renal function tests and urinalysis quarterly.",
          "INR and aPTT weekly.",
        ],
        correctIndex: 1,
        rationale: "Amiodarone requires comprehensive monitoring: pulmonary function tests (lung toxicity), thyroid function tests (iodine content affects thyroid), liver function tests (hepatotoxicity), chest X-ray (pulmonary fibrosis), and ophthalmologic exams (corneal deposits).",
      },
    ],
    targetKeywords: ["amiodarone nursing", "amiodarone side effects", "amiodarone NCLEX", "amiodarone pulmonary toxicity", "class III antiarrhythmic nursing"],
    metaTitle: "Amiodarone Nursing Pharmacology Guide | NurseNest",
    metaDescription: "Complete amiodarone pharmacology for nursing exams. Pulmonary toxicity monitoring, thyroid effects, drug interactions with digoxin and warfarin, and NCLEX practice questions.",
  },
];
