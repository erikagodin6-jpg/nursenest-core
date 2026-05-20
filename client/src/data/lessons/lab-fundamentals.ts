import type { LessonContent } from "./types";

const hemoglobinHematocrit: LessonContent = {
  title: "Hemoglobin & Hematocrit Fundamentals",
  cellular: {
    title: "Oxygen Transport Physiology",
    content: "Hemoglobin is the iron-containing protein in red blood cells responsible for oxygen transport. Each hemoglobin molecule binds up to four oxygen molecules. Hematocrit represents the percentage of blood volume occupied by red blood cells and reflects overall red cell mass relative to plasma. These values are interdependent: hemoglobin measures oxygen-carrying capacity while hematocrit reflects cellular proportion. Both are essential for evaluating anemia, polycythemia, fluid status, and oxygenation adequacy. Decreased hemoglobin/hematocrit indicates anemia (from blood loss, decreased production, or increased destruction), fluid overload (dilutional effect), or chronic disease. Elevated values indicate polycythemia, dehydration (hemoconcentration), or chronic hypoxia compensation. Critical nursing considerations include recognizing that hemoglobin and hematocrit change predictably with fluid shifts: IV fluid administration dilutes values while dehydration concentrates them. Trending values over time is more clinically meaningful than isolated readings. The relationship between hemoglobin and hematocrit approximately follows a 1:3 ratio (e.g., hemoglobin 10 g/dL corresponds to approximately 30% hematocrit)."
  },
  signs: {
    left: [
      "Low H&H: fatigue, pallor, tachycardia, dyspnea on exertion",
      "Trending values over time reveals true trajectory",
      "H&H ratio approximately 1:3 (Hgb 10 ≈ Hct 30%)",
      "Fluid administration dilutes values (hemodilution)",
      "Post-hemorrhage: H&H drops may lag behind actual blood loss"
    ],
    right: [
      "Critically low Hgb (<7 g/dL): tissue hypoxia, cardiac compromise",
      "Elevated Hct (>55%): polycythemia, hyperviscosity, thrombosis risk",
      "Hemoconcentration from dehydration falsely elevates values",
      "Chronic hypoxia causes compensatory polycythemia",
      "Transfusion trigger varies by clinical context (typically Hgb <7-8 g/dL)"
    ]
  },
  medications: [
    { name: "Packed Red Blood Cells (pRBCs)", type: "Blood product", action: "Replaces red cell mass and restores oxygen-carrying capacity in significant anemia", sideEffects: "Transfusion reactions, fluid overload, iron overload (chronic transfusions)", contra: "Consent required; type and cross-match essential", pearl: "Each unit of pRBCs raises hemoglobin by approximately 1 g/dL" },
    { name: "Erythropoietin (EPO)", type: "Hematopoietic growth factor", action: "Stimulates red blood cell production in bone marrow; used in chronic kidney disease anemia", sideEffects: "Hypertension, thrombosis, pure red cell aplasia (rare)", contra: "Uncontrolled hypertension, malignancy", pearl: "Iron supplementation often needed concurrently to support increased RBC production" }
  ],
  pearls: [
    "Hemoglobin measures oxygen-carrying CAPACITY; hematocrit measures red cell PROPORTION",
    "H&H ratio is approximately 1:3 (Hgb 10 = Hct ~30%)",
    "Post-hemorrhage H&H may initially appear normal: values drop as fluid shifts occur",
    "Dehydration falsely elevates H&H (hemoconcentration)",
    "IV fluids dilute H&H (hemodilution): context matters",
    "Each unit of pRBCs raises hemoglobin by approximately 1 g/dL",
    "Trend values over time rather than relying on isolated readings"
  ],
  quiz: [
    { question: "A patient has hemoglobin of 8 g/dL. What is the expected hematocrit?", options: ["8%", "16%", "24%", "32%"], correct: 2, rationale: "The hemoglobin:hematocrit ratio is approximately 1:3. Hemoglobin of 8 g/dL corresponds to approximately 24% hematocrit." },
    { question: "A patient presents after significant hemorrhage. Initial H&H appears normal. What explains this?", options: ["The lab made an error", "H&H values lag behind actual blood loss as fluid shifts have not yet occurred", "The patient is not actually bleeding", "The values are accurate"], correct: 1, rationale: "Immediately after hemorrhage, H&H may appear normal because the remaining blood has normal concentration. As fluid shifts from interstitial space, hemodilution reveals the true deficit." },
    { question: "A dehydrated patient has elevated hematocrit. What is the most likely explanation?", options: ["Polycythemia vera", "Hemoconcentration from reduced plasma volume", "Bone marrow overproduction", "Lab error"], correct: 1, rationale: "Dehydration reduces plasma volume, concentrating the remaining blood and falsely elevating hematocrit. This is hemoconcentration, not true polycythemia." },
    { question: "Case: A 68-year-old male with chronic kidney disease presents with fatigue and pallor. Labs show Hgb 9.2 g/dL, Hct 28%, MCV 88 fL. Which finding is most consistent with his condition?", options: ["Microcytic anemia from iron deficiency", "Normocytic anemia from decreased erythropoietin production", "Macrocytic anemia from B12 deficiency", "Hemolytic anemia from autoimmune destruction"], correct: 1, rationale: "Chronic kidney disease causes normocytic anemia (MCV 80-100 fL) due to decreased erythropoietin production by the kidneys. The normal MCV of 88 fL confirms normocytic rather than microcytic or macrocytic anemia." },
    { question: "Case: A nurse receives morning labs for a patient who received 2 liters of normal saline overnight. The hemoglobin dropped from 12.4 to 10.8 g/dL. No signs of bleeding are noted. What should the nurse consider first?", options: ["Order a type and crossmatch for transfusion", "Recognize hemodilution from IV fluid administration as the likely cause", "Notify the provider of acute hemorrhage", "Repeat the lab draw from a different site"], correct: 1, rationale: "IV fluid administration expands plasma volume, diluting the concentration of red blood cells and lowering H&H values without actual blood loss. This hemodilution effect must be considered before assuming hemorrhage." },
    { question: "Case: A 45-year-old woman post-hysterectomy has Hgb 7.4 g/dL, HR 112, BP 98/62, and is dizzy on standing. The surgeon orders 2 units of pRBCs. After both units, what hemoglobin value would the nurse expect?", options: ["7.4 g/dL", "8.4 g/dL", "9.4 g/dL", "11.4 g/dL"], correct: 2, rationale: "Each unit of packed red blood cells raises hemoglobin by approximately 1 g/dL. Starting at 7.4 g/dL and transfusing 2 units should yield approximately 9.4 g/dL." },
    { question: "Case: A patient with COPD living at high altitude has a hematocrit of 58%. The provider is not concerned. Why might this value be expected?", options: ["The patient is severely dehydrated", "Chronic hypoxia triggers compensatory polycythemia via increased erythropoietin", "The lab specimen was hemolyzed", "The patient has an underlying malignancy"], correct: 1, rationale: "Chronic hypoxia from COPD and high altitude stimulates erythropoietin release from the kidneys, driving increased red blood cell production. This compensatory polycythemia raises the hematocrit as the body attempts to improve oxygen delivery." },
    { question: "Case: A trauma patient arrives with an estimated 1.5L blood loss. The initial CBC at 0200 shows Hgb 13.1 g/dL. At 0800, repeat labs show Hgb 9.6 g/dL. What happened between draws?", options: ["The patient received a blood transfusion", "Fluid shifted from interstitial spaces into the vascular compartment, revealing the true deficit", "The lab made an error on the first draw", "The patient had additional undetected bleeding"], correct: 1, rationale: "After acute hemorrhage, compensatory fluid shifts from the interstitial space into the vascular compartment over several hours. This hemodilution unmasks the true hemoglobin deficit, which is why the initial post-hemorrhage H&H can be misleadingly normal." }
  ]
};

const serumLipids: LessonContent = {
  title: "Serum Lipids: Clinical Interpretation",
  cellular: {
    title: "Lipid Metabolism & Cardiovascular Risk",
    content: "Serum lipids are a critical component of cardiovascular risk assessment. The lipid panel includes total cholesterol, LDL cholesterol (the primary atherogenic lipoprotein), HDL cholesterol (protective/reverse cholesterol transport), and triglycerides. LDL carries cholesterol to arterial walls where it can be oxidized, triggering inflammatory cascades, foam cell formation, and atherosclerotic plaque development. HDL facilitates reverse cholesterol transport, removing excess cholesterol from peripheral tissues back to the liver for excretion. Higher HDL levels correlate with lower cardiovascular risk. Triglycerides reflect dietary fat intake and hepatic lipid metabolism: elevated levels increase pancreatitis risk and contribute to atherogenic dyslipidemia. Clinical interpretation requires understanding the ratios and patterns: elevated LDL with low HDL represents highest atherogenic risk. Dyslipidemia is often asymptomatic until atherosclerosis produces clinical events (MI, stroke, peripheral vascular disease). Modifiable risk factors include diet, exercise, smoking, and obesity. Non-modifiable risk factors include age, sex, and family history."
  },
  signs: {
    left: [
      "Dyslipidemia is typically asymptomatic: detected through screening",
      "Elevated LDL = primary atherogenic driver",
      "High HDL = cardiovascular protective factor",
      "Elevated triglycerides = pancreatitis risk if severely elevated",
      "Xanthomas and xanthelasma may indicate severe hyperlipidemia"
    ],
    right: [
      "Atherosclerosis progression: plaque formation, vessel narrowing, rupture risk",
      "Acute coronary syndrome from plaque rupture",
      "Stroke from carotid atherosclerosis or thromboembolism",
      "Peripheral artery disease from lower extremity atherosclerosis",
      "Severe hypertriglyceridemia (>500): acute pancreatitis risk"
    ]
  },
  medications: [
    { name: "Statins (Atorvastatin/Rosuvastatin)", type: "HMG-CoA reductase inhibitor", action: "Inhibits cholesterol synthesis in liver, upregulates LDL receptors, reduces LDL by 30-50%", sideEffects: "Myalgia, rhabdomyolysis (rare), hepatotoxicity, new-onset diabetes", contra: "Active liver disease, pregnancy", pearl: "Monitor liver enzymes and CK if muscle symptoms develop; take in evening (peak hepatic synthesis)" },
    { name: "Fibrates (Fenofibrate)", type: "PPAR-alpha agonist", action: "Primarily reduces triglycerides and modestly increases HDL", sideEffects: "GI upset, myopathy (increased with statins), gallstones", contra: "Severe renal/hepatic disease", pearl: "Primary indication is severe hypertriglyceridemia to prevent pancreatitis" }
  ],
  pearls: [
    "LDL = 'bad' cholesterol (atherogenic); HDL = 'good' cholesterol (protective)",
    "Dyslipidemia is typically silent: screening is essential for early detection",
    "Statins are first-line therapy for elevated LDL and cardiovascular risk reduction",
    "Monitor liver enzymes and report muscle pain on statins (rhabdomyolysis risk)",
    "Severely elevated triglycerides (>500) → acute pancreatitis risk",
    "Lifestyle modifications: diet, exercise, smoking cessation, weight management",
    "Fasting lipid panel is preferred for accurate triglyceride measurement"
  ],
  quiz: [
    { question: "Which lipoprotein is the primary driver of atherosclerotic plaque formation?", options: ["HDL", "LDL", "VLDL", "Chylomicrons"], correct: 1, rationale: "LDL carries cholesterol to arterial walls where oxidation triggers inflammatory cascades and plaque development. LDL is the primary atherogenic lipoprotein." },
    { question: "A patient on statin therapy reports new-onset muscle pain. What is the nursing priority?", options: ["Reassure the patient it is normal", "Report to provider and obtain CK level to evaluate for rhabdomyolysis", "Increase the statin dose", "Discontinue all medications"], correct: 1, rationale: "Myalgia on statins may indicate rhabdomyolysis: a rare but serious complication. CK levels should be checked and the provider notified." },
    { question: "Case: A 52-year-old male has the following lipid panel: total cholesterol 268, LDL 182, HDL 34, triglycerides 310. He has a BMI of 34 and smokes. Which value represents the greatest immediate cardiovascular risk?", options: ["Total cholesterol of 268", "LDL of 182 combined with HDL of 34", "Triglycerides of 310", "BMI of 34"], correct: 1, rationale: "The combination of highly elevated LDL (goal <100) with low HDL (<40 for males) creates the most atherogenic lipid profile. LDL drives plaque formation while low HDL means inadequate reverse cholesterol transport for protection." },
    { question: "Case: A nurse is reviewing discharge education for a patient newly started on atorvastatin 40 mg daily. The patient asks when to take it. What is the best response?", options: ["Take it with your largest meal of the day", "Take it in the evening because the liver produces the most cholesterol at night", "Take it first thing in the morning on an empty stomach", "Timing does not matter at all for any statin"], correct: 1, rationale: "Hepatic cholesterol synthesis peaks at night. While newer statins like atorvastatin have long half-lives making timing less critical, evening dosing is traditionally recommended to align peak drug activity with peak cholesterol production." },
    { question: "Case: A 48-year-old woman has a triglyceride level of 620 mg/dL. She reports recent binge eating and heavy alcohol use. Beyond cardiovascular risk, what acute complication must the nurse monitor for?", options: ["Deep vein thrombosis", "Acute pancreatitis", "Hepatic encephalopathy", "Pulmonary embolism"], correct: 1, rationale: "Severely elevated triglycerides (>500 mg/dL) significantly increase the risk of acute pancreatitis. The nurse should monitor for sudden epigastric pain radiating to the back, nausea, and vomiting. This is an acute medical concern beyond chronic cardiovascular risk." },
    { question: "Case: A patient's lipid panel shows total cholesterol 195, LDL 110, HDL 62, triglycerides 115. The patient asks if these results are good. Which statement is most accurate?", options: ["All values are critically abnormal and need immediate treatment", "The total cholesterol and HDL are favorable, but the LDL is above optimal and lifestyle modifications should be discussed", "All values are within ideal range and no follow-up is needed", "The triglycerides are dangerously high"], correct: 1, rationale: "Total cholesterol under 200 and HDL above 60 are favorable. However, optimal LDL is below 100 mg/dL. An LDL of 110 is above optimal, and lifestyle modifications (diet, exercise, smoking cessation) should be discussed, with reassessment at the next screening interval." },
    { question: "A patient asks why they must fast before a lipid panel. What is the most accurate explanation?", options: ["All lipid values are affected by recent food intake", "Fasting is required for accurate triglyceride measurement, as recent meals significantly raise triglyceride levels", "The lab equipment requires a fasting sample to calibrate properly", "Fasting prevents hemolysis of the specimen"], correct: 1, rationale: "Triglycerides are most significantly affected by recent food intake and can rise substantially after a meal. While non-fasting panels are increasingly used, fasting provides the most accurate triglyceride measurement. LDL, HDL, and total cholesterol are less affected by fasting status." }
  ]
};

const coagulationStudies: LessonContent = {
  title: "Coagulation Studies: PT/INR & aPTT",
  cellular: {
    title: "Coagulation Cascade & Monitoring",
    content: "The coagulation cascade involves two converging pathways (intrinsic and extrinsic) that ultimately produce a fibrin clot. Prothrombin Time (PT) measures the extrinsic pathway and is standardized as INR (International Normalized Ratio) for monitoring warfarin therapy. Therapeutic INR target is often 2.0-3.0 for most indications (higher for mechanical heart valves). Activated Partial Thromboplastin Time (aPTT) measures the intrinsic pathway and monitors heparin therapy. Therapeutic aPTT target is often 1.5-2.5 times the control value (approximately 45-75 seconds). Understanding which test monitors which medication is a core exam concept: PT/INR monitors warfarin (vitamin K antagonist affecting factors II, VII, IX, X); aPTT monitors unfractionated heparin (which enhances antithrombin III activity). Elevated PT/INR indicates extrinsic pathway prolongation: increased bleeding risk from warfarin excess, liver disease, DIC, or vitamin K deficiency. Elevated aPTT indicates intrinsic pathway prolongation: increased bleeding risk from heparin excess, hemophilia, or DIC. Both values help identify coagulopathy and guide anticoagulation management."
  },
  signs: {
    left: [
      "PT/INR monitors WARFARIN therapy (extrinsic pathway)",
      "aPTT monitors HEPARIN therapy (intrinsic pathway)",
      "Therapeutic INR: typically 2.0-3.0",
      "Therapeutic aPTT: 1.5-2.5x control (~45-75 seconds)",
      "Regular monitoring required for dose adjustment"
    ],
    right: [
      "Supratherapeutic INR (>3.0): hemorrhage risk: hold warfarin",
      "INR >5.0: serious bleeding risk: may need vitamin K",
      "Elevated aPTT with heparin: reduce or hold infusion",
      "Bleeding signs: petechiae, hematuria, melena, epistaxis, gingival bleeding",
      "DIC causes both PT and aPTT prolongation with consumptive coagulopathy"
    ]
  },
  medications: [
    { name: "Warfarin (Coumadin)", type: "Vitamin K antagonist", action: "Inhibits vitamin K-dependent clotting factor synthesis (II, VII, IX, X); monitored by PT/INR", sideEffects: "Hemorrhage, skin necrosis (rare)", contra: "Active bleeding, pregnancy (teratogenic)", pearl: "Antidote is vitamin K (phytonadione). Many drug and food interactions: consistent vitamin K intake is key" },
    { name: "Unfractionated Heparin (UFH)", type: "Indirect thrombin inhibitor", action: "Enhances antithrombin III activity; monitored by aPTT", sideEffects: "Hemorrhage, HIT (heparin-induced thrombocytopenia), osteoporosis (long-term)", contra: "Active bleeding, HIT history, severe thrombocytopenia", pearl: "Antidote is protamine sulfate. Short half-life: effects resolve quickly when discontinued" },
    { name: "Vitamin K (Phytonadione)", type: "Fat-soluble vitamin / warfarin antidote", action: "Restores vitamin K-dependent clotting factor synthesis; reverses warfarin effect", sideEffects: "Anaphylaxis risk (IV route), warfarin resistance for days after administration", contra: "None absolute when treating life-threatening hemorrhage", pearl: "IV route carries highest anaphylaxis risk: slow infusion required; oral preferred when not emergent" }
  ],
  pearls: [
    "PT/INR = warfarin monitoring; aPTT = heparin monitoring: never confuse these",
    "Warfarin antidote = vitamin K; Heparin antidote = protamine sulfate",
    "Therapeutic INR 2.0-3.0 for most indications",
    "Consistent vitamin K intake is essential for stable warfarin dosing",
    "Assess for bleeding signs: petechiae, bruising, hematuria, melena, gingival bleeding",
    "HIT (heparin-induced thrombocytopenia) requires immediate heparin discontinuation",
    "DIC causes BOTH PT and aPTT prolongation with consumptive coagulopathy"
  ],
  quiz: [
    { question: "Which lab test monitors warfarin therapy?", options: ["aPTT", "PT/INR", "CBC", "BMP"], correct: 1, rationale: "PT/INR measures the extrinsic pathway affected by warfarin. INR standardizes the result for consistent monitoring." },
    { question: "A patient on warfarin has an INR of 5.2 with no active bleeding. What is the priority intervention?", options: ["Continue warfarin as ordered", "Administer vitamin K as ordered and hold warfarin", "Give protamine sulfate", "Increase warfarin dose"], correct: 1, rationale: "INR >5.0 indicates serious bleeding risk. Warfarin should be held and vitamin K administered. Protamine is the heparin antidote, not warfarin." },
    { question: "A patient on heparin develops a platelet count drop from 180,000 to 70,000. What is the concern?", options: ["Normal variation", "Heparin-induced thrombocytopenia (HIT): discontinue heparin immediately", "Iron deficiency", "Lab error"], correct: 1, rationale: "A significant platelet drop on heparin therapy suggests HIT, a dangerous immune-mediated condition causing paradoxical thrombosis. Heparin must be discontinued immediately." },
    { question: "Case: A 72-year-old patient with a mechanical aortic valve replacement is on warfarin. The INR today is 2.1. The target range for this patient is 2.5-3.5. What is the appropriate action?", options: ["Hold warfarin because the INR is therapeutic", "Notify the provider that the INR is subtherapeutic for a mechanical valve and a dose adjustment may be needed", "Administer vitamin K to lower the INR further", "Discontinue warfarin and switch to aspirin"], correct: 1, rationale: "Patients with mechanical heart valves require a higher target INR of 2.5-3.5 due to increased thrombotic risk. An INR of 2.1 is subtherapeutic for this indication, though it would be within range for most other conditions. The provider should be notified for potential dose adjustment." },
    { question: "Case: A patient on a continuous heparin infusion has an aPTT drawn at 0600. The result is 42 seconds (control: 30 seconds). The target is 1.5-2.5 times control (45-75 seconds). What should the nurse do?", options: ["Hold the heparin infusion immediately", "Increase the heparin rate per protocol because the aPTT is subtherapeutic", "Continue the current rate because 42 seconds is close enough", "Administer protamine sulfate"], correct: 1, rationale: "The target aPTT is 45-75 seconds (1.5-2.5 times the control of 30). An aPTT of 42 seconds is below the therapeutic range, meaning the patient is underanticoagulated. Per heparin protocol, the infusion rate should be increased to achieve therapeutic anticoagulation." },
    { question: "Case: A patient on warfarin presents with dark, tarry stools. The INR is 3.8. What is the priority nursing assessment?", options: ["Ask the patient about dietary changes", "Assess for signs of active GI bleeding, check vital signs for hemodynamic stability, and notify the provider immediately", "Administer the next scheduled warfarin dose", "Recommend increased dietary vitamin K"], correct: 1, rationale: "Dark tarry stools (melena) indicate upper GI bleeding. Combined with a supratherapeutic INR of 3.8, the patient is at significant hemorrhagic risk. Priority actions include vital sign assessment for hemodynamic instability (tachycardia, hypotension), holding warfarin, and immediate provider notification." },
    { question: "Case: A nurse is caring for a post-operative patient who had a DVT and is bridging from heparin to warfarin. The provider orders to discontinue heparin when INR reaches therapeutic range. Why is overlap therapy necessary?", options: ["Warfarin works immediately but heparin provides extra protection", "Warfarin takes 3-5 days to reach full anticoagulant effect because it depends on depletion of existing clotting factors", "Heparin enhances warfarin absorption", "The two medications synergize to dissolve existing clots"], correct: 1, rationale: "Warfarin inhibits synthesis of NEW vitamin K-dependent clotting factors but does not affect factors already in circulation. It takes 3-5 days for existing factors (especially factor II with a 60-hour half-life) to be depleted. Heparin provides immediate anticoagulation during this transition period." },
    { question: "Case: A patient with DIC (disseminated intravascular coagulation) has both PT and aPTT prolonged, platelets of 45,000, and elevated D-dimer. What pathophysiology explains these simultaneous findings?", options: ["The patient has both warfarin and heparin toxicity", "Widespread microvascular clotting consumes clotting factors and platelets, paradoxically causing both clotting and bleeding", "The patient has liver failure", "The lab specimens were all hemolyzed"], correct: 1, rationale: "DIC involves widespread activation of the clotting cascade, forming microthrombi throughout the vasculature. This consumes clotting factors (prolonging PT and aPTT), platelets (thrombocytopenia), and generates fibrin degradation products (elevated D-dimer). The result is a consumptive coagulopathy with paradoxical simultaneous clotting and bleeding." }
  ]
};

const malnutritionMarkers: LessonContent = {
  title: "Malnutrition Laboratory Markers",
  cellular: {
    title: "Biochemical Assessment of Nutritional Status",
    content: "Malnutrition is a clinical syndrome that can be assessed through specific laboratory markers reflecting protein status, visceral protein stores, and metabolic function. Albumin is the most commonly cited nutritional marker but has significant limitations: its long half-life (approximately 18-21 days) makes it a poor indicator of acute nutritional changes, and it is affected by inflammation, liver disease, fluid status, and renal losses. Prealbumin (transthyretin) has a shorter half-life (approximately 2-3 days) making it more responsive to acute changes in nutritional status. It is the preferred marker for monitoring short-term nutritional intervention effectiveness. Transferrin reflects iron-binding capacity and protein status with an intermediate half-life. Total lymphocyte count may indicate immune competence affected by malnutrition. Nitrogen balance studies assess protein anabolism versus catabolism. Critical understanding: no single lab value diagnoses malnutrition: clinical assessment including weight trends, intake adequacy, functional status, and physical examination remains essential. Inflammatory states dramatically affect protein markers (acute phase response), making interpretation context-dependent."
  },
  signs: {
    left: [
      "Albumin: long half-life (18-21 days): reflects chronic status, NOT acute changes",
      "Prealbumin: short half-life (2-3 days): preferred for acute monitoring",
      "Transferrin: intermediate marker reflecting iron and protein status",
      "Nitrogen balance: positive = anabolic; negative = catabolic",
      "Weight trends and dietary intake remain essential clinical assessments"
    ],
    right: [
      "Low albumin: edema, poor wound healing, immune compromise",
      "Severely low prealbumin: acute protein-calorie malnutrition",
      "Low lymphocyte count: impaired immune function from malnutrition",
      "Negative nitrogen balance: muscle wasting, delayed healing",
      "Inflammation falsely lowers protein markers (acute phase response)"
    ]
  },
  medications: [
    { name: "Parenteral Nutrition (TPN)", type: "IV nutritional support", action: "Provides complete nutrition (dextrose, amino acids, lipids, vitamins, minerals) intravenously when GI tract is non-functional", sideEffects: "Infection (line sepsis), hyperglycemia, electrolyte imbalances, liver dysfunction, refeeding syndrome", contra: "Functional GI tract (enteral nutrition preferred)", pearl: "Monitor blood glucose closely: TPN commonly distorts glucose and lab values. Central line required." },
    { name: "Enteral Nutrition", type: "GI-administered nutrition", action: "Provides nutrition via feeding tube when oral intake is inadequate but GI tract functions", sideEffects: "Aspiration risk, diarrhea, tube displacement, electrolyte shifts", contra: "GI obstruction, ileus, severe GI bleeding", pearl: "Enteral nutrition is ALWAYS preferred over parenteral when GI tract is functional: preserves gut integrity" }
  ],
  pearls: [
    "Albumin is NOT a good marker for acute nutritional changes: its half-life is 18-21 days",
    "Prealbumin is the preferred marker for monitoring acute nutritional intervention (half-life 2-3 days)",
    "Inflammation dramatically affects protein markers: interpret in clinical context",
    "Enteral nutrition is ALWAYS preferred over parenteral when the GI tract works",
    "Refeeding syndrome risk in severely malnourished patients: monitor phosphate, potassium, magnesium",
    "Nitrogen balance: positive = building tissue; negative = breaking down tissue",
    "No single lab value diagnoses malnutrition: clinical assessment is essential"
  ],
  quiz: [
    { question: "Which laboratory marker best reflects acute changes in nutritional status?", options: ["Albumin", "Prealbumin (transthyretin)", "Total protein", "Hemoglobin"], correct: 1, rationale: "Prealbumin has a short half-life of 2-3 days, making it responsive to acute nutritional changes. Albumin's 18-21 day half-life reflects chronic status only." },
    { question: "A critically ill patient has low albumin. Can this alone confirm malnutrition?", options: ["Yes, albumin is the definitive malnutrition marker", "No: inflammation causes acute phase protein depression that lowers albumin independent of nutritional status", "Yes, if albumin is below 2.0", "No, albumin is unrelated to nutrition"], correct: 1, rationale: "Critical illness triggers an acute phase response that depresses albumin regardless of nutritional status. Clinical assessment including intake, weight trends, and functional status is required." },
    { question: "Case: A 78-year-old patient with a hip fracture has been NPO for 3 days awaiting surgery. The dietitian orders prealbumin rather than albumin to assess nutritional status. Why is prealbumin preferred in this scenario?", options: ["Prealbumin is cheaper to run", "Prealbumin has a 2-3 day half-life and will reflect the acute nutritional decline from 3 days NPO, while albumin with its 18-21 day half-life would still appear normal", "Prealbumin is more specific to bone healing", "Albumin cannot be measured in post-surgical patients"], correct: 1, rationale: "Prealbumin's short half-life (2-3 days) makes it sensitive to recent nutritional changes. After 3 days NPO, prealbumin will begin to drop reflecting the acute protein deficit. Albumin's 18-21 day half-life means it would still reflect pre-admission status and not yet show the decline." },
    { question: "Case: A patient with sepsis has an albumin of 1.8 g/dL. The nurse initiates TPN as ordered. After 48 hours, prealbumin rises from 8 to 14 mg/dL, but albumin remains at 1.9 g/dL. What does this suggest?", options: ["The TPN is not working", "The albumin should be rechecked because the value must be wrong", "The TPN is providing adequate nutrition as shown by rising prealbumin, but albumin will take weeks to respond due to its long half-life", "The patient needs albumin infusion rather than TPN"], correct: 2, rationale: "Prealbumin rising from 8 to 14 mg/dL within 48 hours indicates that nutritional intervention is effective. Albumin's 18-21 day half-life means it will take much longer to rise in response to improved nutrition. Prealbumin is the appropriate marker for monitoring short-term nutritional response." },
    { question: "Case: A severely malnourished patient is started on aggressive refeeding after 2 weeks of minimal intake. Within 24 hours, the patient develops confusion, tachycardia, and weakness. Which electrolyte abnormality is most likely?", options: ["Hypernatremia", "Hypophosphatemia from refeeding syndrome", "Hypercalcemia", "Hypermagnesemia"], correct: 1, rationale: "Refeeding syndrome occurs when malnourished patients receive aggressive nutritional repletion. Insulin release drives phosphate, potassium, and magnesium into cells, causing dangerous drops in serum levels. Hypophosphatemia is the hallmark finding and can cause cardiac dysfunction, respiratory failure, and neurological symptoms." },
    { question: "A patient with cirrhosis has albumin of 2.2 g/dL and significant ascites. The nurse notes peripheral edema. What is the relationship between low albumin and the edema?", options: ["Low albumin is unrelated to edema", "Decreased albumin reduces plasma oncotic pressure, causing fluid to shift from the vascular space into the interstitial tissue", "The albumin level causes direct kidney damage", "Low albumin increases blood pressure"], correct: 1, rationale: "Albumin is the primary protein maintaining plasma oncotic pressure. When albumin drops significantly, oncotic pressure decreases and fluid shifts from the intravascular compartment into the interstitial space, causing peripheral edema and contributing to ascites formation." }
  ]
};

const specimenCollection: LessonContent = {
  title: "Laboratory Specimen Collection: Peripheral vs",
  cellular: {
    title: "Specimen Integrity & Collection Accuracy",
    content: "Accurate laboratory results depend on proper specimen collection technique. Peripheral venipuncture is the standard method and generally produces the most accurate results. Central line draws are convenient but introduce significant sources of error including contamination from infusing solutions (especially TPN, dextrose, or electrolyte-containing fluids), heparin lock contamination, and dilution effects. Proper central line draw technique requires pausing infusions for an appropriate interval, performing an adequate discard volume to clear the line of residual solution, and drawing below any infusing port when possible. Drawing from an active infusion line without protocol is a critical error that commonly distorts lab values. Hemolysis from improper collection technique falsely elevates potassium (one of the most tested lab artifacts) and LDH while potentially invalidating other results. Clotted specimens from improper mixing or delayed processing produce unreliable results. When lab values appear inconsistent, the systematic approach is: Step 1: evaluate collection method (peripheral vs central, infusing line?), Step 2: evaluate specimen quality (hemolysis, clotting, tube error), Step 3: only then consider true pathology after excluding collection artifacts."
  },
  signs: {
    left: [
      "Peripheral draws produce the most accurate results",
      "Central line draws require adequate discard volume",
      "Pause infusions before drawing from central lines",
      "Never draw from active infusion without protocol",
      "Proper tube selection and mixing technique essential"
    ],
    right: [
      "Hemolysis falsely elevates potassium: most tested lab artifact",
      "TPN infusion commonly distorts glucose, electrolytes, and protein labs",
      "Drawing from infusing line → contaminated, unreliable results",
      "Unexpected lab values → first question collection validity",
      "Improper sampling may cause unnecessary treatment or missed diagnosis"
    ]
  },
  medications: [],
  pearls: [
    "Peripheral draws = most accurate; central line draws require discard protocol",
    "NEVER draw from an active infusion line without following institutional protocol",
    "Hemolysis falsely elevates potassium: the most commonly tested lab artifact",
    "TPN commonly distorts labs: glucose, electrolytes, proteins all affected",
    "Unexpected labs → question sampling validity FIRST before assuming pathology",
    "Improper sampling may lead to unnecessary treatment, missed diagnoses, or medication errors",
    "Central line draws require: pause infusion → discard → then draw specimen"
  ],
  quiz: [
    { question: "Lab results show an unexpectedly high potassium level. The specimen appears pink-tinged. What is the most likely explanation?", options: ["True hyperkalemia", "Hemolysis during specimen collection falsely elevating potassium", "Renal failure", "Medication effect"], correct: 1, rationale: "Pink-tinged serum indicates hemolysis. Hemolysis falsely elevates potassium by releasing intracellular potassium from ruptured red blood cells: the most commonly tested lab artifact." },
    { question: "A nurse draws blood from a central line that has TPN infusing. What is the primary concern?", options: ["Pain at the site", "Specimen contamination from TPN distorting glucose, electrolyte, and protein values", "Air embolism risk", "Catheter dislodgement"], correct: 1, rationale: "TPN contains high concentrations of dextrose, amino acids, and electrolytes. Drawing from an infusing line without proper protocol contaminates the specimen and produces unreliable results." },
    { question: "Case: A nurse draws blood from a patient's right arm. The patient has a peripheral IV running D5W in the right antecubital fossa. The glucose result comes back at 342 mg/dL. The patient is non-diabetic with no symptoms. What is the most likely explanation?", options: ["The patient has new-onset diabetes", "The specimen was drawn from the same arm as the IV, and the D5W contaminated the sample, falsely elevating the glucose", "The patient ate a large meal right before the draw", "The lab equipment malfunctioned"], correct: 1, rationale: "Drawing blood from the same arm as an IV infusion, especially one containing dextrose, contaminates the specimen. The D5W (5% dextrose in water) directly elevates the glucose reading. The blood should be redrawn from the opposite arm or below the IV site with the infusion paused." },
    { question: "Case: A patient has a triple-lumen central line with TPN on the proximal port and normal saline on the medial port. The nurse needs to draw a BMP. Which is the best approach?", options: ["Draw from any available port without stopping infusions", "Pause all infusions, waste an adequate discard volume from the distal port, then draw the specimen", "Draw from a peripheral vein for the most accurate results", "Draw from the proximal TPN port after flushing with saline"], correct: 2, rationale: "Peripheral draws produce the most accurate results and should be the first choice when available. While central line draws are acceptable with proper technique (pausing infusions and adequate discard), a peripheral draw eliminates the risk of contamination from infusing solutions entirely." },
    { question: "Case: A night-shift nurse collects a blood specimen at 0300 but the specimen is not transported to the lab until 0600. Which lab values are most likely to be inaccurate due to the delay?", options: ["Hemoglobin and hematocrit", "Glucose (which continues to be metabolized by cells in the tube) and coagulation studies (which may clot)", "Sodium and chloride", "Total protein and albumin"], correct: 1, rationale: "Delayed transport causes glucose to decrease as red blood cells continue to metabolize glucose in the tube (glycolysis). Coagulation specimens may clot if not processed promptly. Proper specimen handling includes timely transport within institutional guidelines." },
    { question: "Case: A nurse is drawing blood and notices the patient has been clenching their fist vigorously for 2 minutes with a tourniquet in place. Which lab value is most likely to be falsely affected?", options: ["Hemoglobin", "Potassium, which may be falsely elevated from prolonged tourniquet and fist clenching causing local hemolysis and potassium release", "Sodium", "Creatinine"], correct: 1, rationale: "Prolonged tourniquet application and vigorous fist clenching cause venous stasis and local tissue ischemia, which can lead to hemolysis and release of intracellular potassium. The tourniquet should be released within 1 minute and the patient should not pump their fist excessively." },
    { question: "A nurse collects blood in the wrong tube. The specimen for a PT/INR is placed in a lavender-top (EDTA) tube instead of a light blue-top (citrate) tube. What should the nurse do?", options: ["Send it to the lab anyway since the test can still be run", "Recollect the specimen in the correct light blue-top citrate tube because anticoagulant additives are specific to each test", "Add citrate to the lavender tube to correct it", "Label the tube as light blue and send it"], correct: 1, rationale: "Each tube color contains specific additives designed for particular tests. Coagulation studies require citrate (light blue top) at a precise blood-to-anticoagulant ratio. EDTA (lavender top) will interfere with coagulation testing and produce invalid results. The specimen must be recollected in the correct tube." }
  ]
};

export const labFundamentalsLessons: Record<string, LessonContent> = {
  "hemoglobin-hematocrit": hemoglobinHematocrit,
  "serum-lipids": serumLipids,
  "coagulation-studies": coagulationStudies,
  "malnutrition-markers": malnutritionMarkers,
  "specimen-collection": specimenCollection,
};
