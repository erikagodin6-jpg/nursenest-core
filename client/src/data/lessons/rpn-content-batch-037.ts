import type { LessonContent } from "./types";

export const rpnContentBatch037Lessons: Record<string, LessonContent> = {
  "vitamin-deficiency-syndromes-rpn": {
    title: "Vitamin Deficiency Syndromes",
    cellular: {
      title: "Vitamin Functions and Deficiency Pathophysiology",
      content: "Vitamins are organic micronutrients essential for enzymatic reactions, cellular metabolism, and tissue maintenance. Fat-soluble vitamins (A, D, E, K) are stored in adipose tissue and the liver, while water-soluble vitamins (B complex, C) require regular dietary intake. Vitamin A deficiency impairs rhodopsin synthesis causing night blindness and weakens epithelial barriers. Vitamin D deficiency disrupts calcium-phosphorus homeostasis leading to rickets in children and osteomalacia in adults. Vitamin B12 deficiency causes megaloblastic anemia and peripheral neuropathy due to impaired DNA synthesis and myelin maintenance. Vitamin C deficiency (scurvy) weakens collagen synthesis causing bleeding gums, petechiae, and poor wound healing. Thiamine (B1) deficiency causes beriberi and Wernicke encephalopathy through impaired glucose metabolism in neural tissue."
    },
    riskFactors: [
      "Chronic alcoholism depleting thiamine and folate stores",
      "Strict vegan diet without B12 supplementation",
      "Malabsorptive conditions (celiac disease, Crohn's, gastric bypass)",
      "Elderly patients with poor dietary intake and isolation",
      "Prolonged parenteral nutrition without vitamin supplementation"
    ],
    diagnostics: [
      "Serum vitamin levels (B12, folate, 25-OH vitamin D, retinol)",
      "Complete blood count with peripheral smear for megaloblastic changes",
      "Methylmalonic acid and homocysteine for B12 deficiency confirmation",
      "Prothrombin time/INR for vitamin K status assessment"
    ],
    management: [
      "Identify and treat the underlying cause of deficiency",
      "Initiate appropriate vitamin supplementation (oral or parenteral)",
      "Dietary counseling with referral to registered dietitian",
      "Monitor laboratory values to assess treatment response"
    ],
    nursingActions: [
      "Assess dietary history and identify risk factors for deficiency",
      "Administer vitamin supplements as prescribed and monitor for adverse effects",
      "Educate patient on food sources rich in deficient vitamins",
      "Monitor for neurological changes in B12 deficiency (paresthesias, gait disturbance)",
      "Document dietary intake and response to supplementation therapy"
    ],
    signs: {
      left: [
        "Adequate dietary intake with balanced nutrition",
        "Normal skin integrity and wound healing",
        "Normal neurological function and reflexes",
        "Laboratory values within normal ranges"
      ],
      right: [
        "Angular cheilitis, glossitis (B vitamin deficiency)",
        "Bleeding gums and petechiae (vitamin C deficiency)",
        "Night blindness and dry eyes (vitamin A deficiency)",
        "Bone pain and muscle weakness (vitamin D deficiency)"
      ]
    },
    medications: [
      {
        name: "Cyanocobalamin (Vitamin B12)",
        type: "Water-soluble vitamin supplement",
        action: "Replaces deficient B12 essential for DNA synthesis and myelin maintenance",
        sideEffects: "Injection site pain, mild diarrhea, hypokalemia during initial treatment",
        contra: "Leber hereditary optic neuropathy",
        pearl: "IM injections required if deficiency is due to intrinsic factor deficiency or malabsorption; oral supplements insufficient."
      }
    ],
    pearls: [
      "B12 deficiency can cause irreversible neurological damage if not treated promptly",
      "Vitamin K is the antidote for warfarin toxicity - administer IV for serious bleeding",
      "Folate supplementation can mask B12 deficiency by correcting anemia without addressing neuropathy"
    ],
    quiz: [
      {
        question: "A patient with chronic alcoholism is most at risk for deficiency of which vitamin?",
        options: ["Vitamin A", "Vitamin D", "Thiamine (B1)", "Vitamin E"],
        correct: 2,
        rationale: "Chronic alcoholism depletes thiamine stores, leading to Wernicke encephalopathy and beriberi."
      },
      {
        question: "Which clinical finding is characteristic of scurvy (vitamin C deficiency)?",
        options: ["Night blindness", "Bleeding gums and petechiae", "Peripheral neuropathy", "Bone deformities"],
        correct: 1,
        rationale: "Vitamin C is essential for collagen synthesis; deficiency causes fragile capillaries, bleeding gums, and petechiae."
      },
      {
        question: "A vegan patient with fatigue has an MCV of 110 fL. The nurse should anticipate testing for:",
        options: ["Iron deficiency", "Vitamin B12 deficiency", "Vitamin A deficiency", "Vitamin K deficiency"],
        correct: 1,
        rationale: "Elevated MCV indicates macrocytic anemia; vegans are at risk for B12 deficiency due to absence of animal products."
      }
    ]
  },
  "malnutrition-assessment-rpn": {
    title: "Malnutrition Assessment",
    cellular: {
      title: "Malnutrition Pathophysiology and Classification",
      content: "Malnutrition encompasses both undernutrition and overnutrition, with protein-energy malnutrition (PEM) being the most clinically significant form in hospital settings. Marasmus results from chronic caloric deficiency causing wasting of fat and muscle stores while preserving visceral proteins initially. Kwashiorkor develops from severe protein deficiency despite adequate caloric intake, characterized by hypoalbuminemia, edema, and fatty liver. Hospital-acquired malnutrition affects 30-50% of hospitalized patients, increasing infection risk, impairing wound healing, prolonging length of stay, and increasing mortality. Serum albumin (half-life 20 days) and prealbumin (half-life 2-3 days) serve as markers of visceral protein status, with prealbumin being more responsive to nutritional changes. The Subjective Global Assessment (SGA) combines weight history, dietary intake, GI symptoms, and physical examination for malnutrition classification."
    },
    riskFactors: [
      "Chronic illness with increased metabolic demands (cancer, COPD, heart failure)",
      "Dysphagia or difficulty swallowing limiting oral intake",
      "Depression, social isolation, or poverty limiting food access",
      "Recent surgery, trauma, or burns increasing catabolic state",
      "Prolonged NPO status without nutritional support"
    ],
    diagnostics: [
      "Serum albumin (<3.5 g/dL suggests chronic malnutrition)",
      "Prealbumin level (<15 mg/dL indicates acute nutritional depletion)",
      "Body mass index (BMI) calculation and trending",
      "Malnutrition screening tools (MNA, MUST, NRS-2002)"
    ],
    management: [
      "Caloric supplementation with high-protein diet as tolerated",
      "Small frequent meals with nutrient-dense foods",
      "Oral nutritional supplements between meals",
      "Enteral or parenteral nutrition if oral intake is inadequate"
    ],
    nursingActions: [
      "Perform nutritional screening on admission using validated tools",
      "Weigh patient consistently at same time, same scale, same clothing",
      "Monitor and record dietary intake accurately including percentage eaten",
      "Assist with meals and create a pleasant eating environment",
      "Refer to registered dietitian for patients at nutritional risk"
    ],
    signs: {
      left: [
        "BMI 18.5-24.9 with stable weight",
        "Serum albumin > 3.5 g/dL",
        "Adequate muscle mass and subcutaneous fat",
        "Consuming > 75% of meals consistently"
      ],
      right: [
        "Unintentional weight loss > 5% in 30 days or > 10% in 6 months",
        "Temporal wasting and loss of subcutaneous fat",
        "Peripheral edema with low albumin (kwashiorkor pattern)",
        "Poor wound healing and skin breakdown"
      ]
    },
    medications: [
      {
        name: "Megestrol Acetate (Megace)",
        type: "Progestational appetite stimulant",
        action: "Stimulates appetite and promotes weight gain through hormonal mechanism",
        sideEffects: "Thromboembolism, adrenal suppression, hyperglycemia, edema",
        contra: "Known or suspected pregnancy, active thromboembolic disease",
        pearl: "Monitor for signs of DVT; typically reserved for cancer-related cachexia after other interventions fail."
      }
    ],
    pearls: [
      "Prealbumin is more sensitive than albumin for detecting acute nutritional changes due to its shorter half-life",
      "Refeeding syndrome can occur when malnourished patients receive aggressive nutrition - monitor phosphorus, potassium, and magnesium",
      "A 10% unintentional weight loss in 6 months is a significant clinical finding requiring nutritional intervention"
    ],
    quiz: [
      {
        question: "Which lab value best reflects acute nutritional status changes?",
        options: ["Serum albumin", "Prealbumin", "Total protein", "BUN"],
        correct: 1,
        rationale: "Prealbumin has a half-life of 2-3 days, making it more responsive to acute nutritional changes than albumin (20-day half-life)."
      },
      {
        question: "A malnourished patient begins receiving TPN. The nurse should monitor closely for:",
        options: ["Hyperkalemia", "Refeeding syndrome", "Metabolic alkalosis", "Hypernatremia"],
        correct: 1,
        rationale: "Refeeding syndrome causes dangerous drops in phosphorus, potassium, and magnesium when malnourished patients receive aggressive nutrition."
      },
      {
        question: "Which assessment finding indicates protein-calorie malnutrition?",
        options: ["Peripheral edema with albumin 2.1 g/dL", "BMI of 26", "Serum glucose 180 mg/dL", "Hemoglobin 14 g/dL"],
        correct: 0,
        rationale: "Low albumin with peripheral edema indicates kwashiorkor-type protein malnutrition with impaired oncotic pressure."
      }
    ]
  },
  "enteral-nutrition-management-rpn": {
    title: "Enteral Nutrition Management",
    cellular: {
      title: "Enteral Feeding Physiology and Delivery",
      content: "Enteral nutrition delivers nutrients directly into the gastrointestinal tract via tubes when patients cannot meet nutritional needs orally but have a functional GI tract. Nasogastric (NG) tubes are used for short-term feeding (< 4 weeks), while percutaneous endoscopic gastrostomy (PEG) tubes provide long-term access. Jejunal feeding tubes bypass the stomach and are indicated for patients with gastroparesis, high aspiration risk, or pancreatitis. Continuous feeding delivers formula at a constant rate via pump, reducing dumping syndrome risk. Bolus feeding mimics normal meal patterns but carries higher aspiration risk. The gut-associated lymphoid tissue (GALT) requires enteral stimulation to maintain immune function and mucosal barrier integrity, making enteral feeding preferable to parenteral nutrition when the GI tract is functional."
    },
    riskFactors: [
      "Altered level of consciousness increasing aspiration risk",
      "Impaired gag or swallow reflex from neurological injury",
      "Head and neck surgery preventing oral intake",
      "Severe dysphagia from stroke or progressive neurological disease",
      "Critical illness with inability to meet caloric needs orally"
    ],
    diagnostics: [
      "Chest X-ray to confirm NG tube placement before initial feeding",
      "Gastric residual volume measurement (varies by protocol)",
      "Blood glucose monitoring for hyperglycemia from enteral formula",
      "Electrolyte panel monitoring during initiation and adjustment"
    ],
    management: [
      "Verify tube placement before each feeding (radiograph for initial, pH testing for ongoing)",
      "Elevate head of bed 30-45 degrees during feeding and 30-60 minutes after",
      "Flush tube with 30 mL water before and after feedings and medications",
      "Advance feeding rate gradually as tolerated per protocol"
    ],
    nursingActions: [
      "Confirm tube placement before initiating any feeding using approved methods",
      "Maintain head of bed elevation at 30-45 degrees to prevent aspiration",
      "Monitor for feeding intolerance: abdominal distension, nausea, diarrhea, cramping",
      "Provide oral care every 2 hours for patients with NG or OG tubes",
      "Document feeding rate, tolerance, residual volumes, and total intake"
    ],
    signs: {
      left: [
        "Tolerating prescribed feeding rate without distension",
        "Soft non-distended abdomen with active bowel sounds",
        "Blood glucose within target range",
        "Regular bowel movements without diarrhea"
      ],
      right: [
        "Abdominal distension and high gastric residual volumes",
        "Aspiration signs: coughing, desaturation, tachypnea during feeds",
        "Diarrhea or formula intolerance",
        "Tube displacement or clogging"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic/antiemetic",
        action: "Increases gastric motility and accelerates gastric emptying to improve feeding tolerance",
        sideEffects: "Tardive dyskinesia with prolonged use, drowsiness, restlessness",
        contra: "GI obstruction, pheochromocytoma, seizure disorders",
        pearl: "FDA black box warning for tardive dyskinesia - limit use to < 12 weeks; assess for involuntary movements."
      }
    ],
    pearls: [
      "Never rely on auscultation alone to verify NG tube placement - always use radiographic or pH confirmation",
      "If the GI tract works, use it - enteral feeding maintains gut integrity better than parenteral nutrition",
      "Flush tubes with water, not cranberry juice or cola - these can clog tubes and are not evidence-based"
    ],
    quiz: [
      {
        question: "The gold standard for initial NG tube placement verification is:",
        options: ["Auscultation of air insufflation", "pH testing of aspirate", "Chest X-ray", "Water bubbling test"],
        correct: 2,
        rationale: "Chest X-ray is the gold standard for confirming initial NG tube placement before any feeding."
      },
      {
        question: "During enteral feeding, the head of the bed should be elevated to:",
        options: ["Flat (0 degrees)", "15 degrees", "30-45 degrees", "90 degrees"],
        correct: 2,
        rationale: "Head of bed at 30-45 degrees reduces aspiration risk during and after enteral feeding."
      },
      {
        question: "A patient receiving tube feeding develops sudden coughing and oxygen desaturation. The nurse should first:",
        options: ["Increase the feeding rate", "Stop the feeding immediately", "Check gastric residual", "Reposition the patient prone"],
        correct: 1,
        rationale: "Coughing and desaturation during tube feeding suggest aspiration - stop feeding immediately and assess."
      }
    ]
  },
  "parenteral-nutrition-basics-rpn": {
    title: "Parenteral Nutrition (TPN) Basics",
    cellular: {
      title: "Total Parenteral Nutrition Physiology",
      content: "Total parenteral nutrition (TPN) delivers complete nutrition intravenously when the gastrointestinal tract cannot be used. TPN solutions contain dextrose (carbohydrate source), amino acids (protein source), lipid emulsions (fat source), electrolytes, vitamins, and trace elements. The high osmolarity of TPN (typically >900 mOsm/L) requires administration through a central venous access device to prevent phlebitis and vessel damage. Peripheral parenteral nutrition (PPN) can be used short-term but provides fewer calories due to osmolarity limitations. Hyperglycemia is the most common metabolic complication because of high dextrose concentration. The liver metabolizes TPN components, and hepatic steatosis can develop with prolonged use. Abrupt discontinuation can cause rebound hypoglycemia due to elevated endogenous insulin levels."
    },
    riskFactors: [
      "Non-functional GI tract (bowel obstruction, ileus, severe pancreatitis)",
      "Short bowel syndrome with insufficient absorptive surface",
      "High-output enterocutaneous fistula",
      "Severe mucositis from chemotherapy preventing enteral intake",
      "Prolonged postoperative ileus beyond 7 days"
    ],
    diagnostics: [
      "Blood glucose monitoring every 4-6 hours during TPN infusion",
      "Daily electrolytes (sodium, potassium, magnesium, phosphorus) initially",
      "Liver function tests weekly to monitor for hepatic complications",
      "Triglyceride level before and during lipid emulsion administration"
    ],
    management: [
      "Administer through dedicated central line lumen using infusion pump",
      "Never abruptly discontinue - taper rate over 1-2 hours to prevent hypoglycemia",
      "Change TPN tubing and filter every 24 hours per protocol",
      "Transition to enteral nutrition as soon as GI function returns"
    ],
    nursingActions: [
      "Use strict aseptic technique for all central line access and TPN handling",
      "Monitor blood glucose every 4-6 hours and administer insulin as prescribed",
      "Inspect TPN bag for precipitates, cloudiness, or discoloration before hanging",
      "Monitor for signs of central line infection (fever, erythema, purulent drainage)",
      "Do not add medications to TPN bag or infuse other solutions through TPN lumen"
    ],
    signs: {
      left: [
        "Blood glucose 80-180 mg/dL during TPN infusion",
        "Electrolytes within normal limits on daily monitoring",
        "No signs of central line infection",
        "Liver function tests within normal parameters"
      ],
      right: [
        "Hyperglycemia > 200 mg/dL requiring insulin adjustment",
        "Fever with central line suggesting catheter-related bloodstream infection",
        "Elevated liver enzymes indicating hepatic steatosis",
        "Electrolyte imbalances (hypokalemia, hypophosphatemia, hypomagnesemia)"
      ]
    },
    medications: [
      {
        name: "Regular Insulin (added to TPN or separate drip)",
        type: "Rapid-acting hormone",
        action: "Controls hyperglycemia caused by high dextrose content in TPN solution",
        sideEffects: "Hypoglycemia, hypokalemia",
        contra: "Hypoglycemia (blood glucose < 70 mg/dL)",
        pearl: "Monitor glucose closely when TPN is started, rate-changed, or discontinued - insulin needs change with TPN adjustments."
      }
    ],
    pearls: [
      "Never abruptly stop TPN - taper rate gradually to prevent rebound hypoglycemia from circulating insulin",
      "If TPN bag is not available on time, hang D10W at the same rate to prevent hypoglycemia",
      "Catheter-related bloodstream infection (CRBSI) is the most serious complication - maintain strict aseptic technique"
    ],
    quiz: [
      {
        question: "TPN must be administered through a central line because of its:",
        options: ["Low pH", "High osmolarity", "Lipid content", "Vitamin concentration"],
        correct: 1,
        rationale: "TPN has high osmolarity (>900 mOsm/L) that would cause phlebitis and vessel damage in peripheral veins."
      },
      {
        question: "If TPN is abruptly discontinued, the patient is at risk for:",
        options: ["Hyperglycemia", "Rebound hypoglycemia", "Hypernatremia", "Metabolic alkalosis"],
        correct: 1,
        rationale: "Abrupt TPN cessation causes rebound hypoglycemia because endogenous insulin levels remain elevated after the dextrose source stops."
      },
      {
        question: "The most common metabolic complication of TPN administration is:",
        options: ["Hypoglycemia", "Hyperglycemia", "Hyperkalemia", "Metabolic acidosis"],
        correct: 1,
        rationale: "High dextrose concentration in TPN frequently causes hyperglycemia requiring insulin management."
      }
    ]
  },
  "diabetic-diet-management-rpn": {
    title: "Diabetic Diet Management",
    cellular: {
      title: "Glycemic Control Through Nutritional Management",
      content: "Medical nutrition therapy (MNT) is a cornerstone of diabetes management, targeting glycemic control through carbohydrate management, portion control, and consistent meal timing. Carbohydrate counting allows patients to match insulin doses to carbohydrate intake, typically starting with 45-60 grams per meal for most adults. The glycemic index (GI) ranks foods by how rapidly they raise blood glucose, with low-GI foods (<55) causing slower, more controlled rises. Fiber intake of 25-30 grams daily slows glucose absorption and improves insulin sensitivity. Consistent carbohydrate intake prevents glycemic variability that damages vascular endothelium through oxidative stress. Protein does not significantly raise blood glucose and should comprise 15-20% of total calories. Dietary fat modification focuses on replacing saturated fats with monounsaturated and polyunsaturated fats to reduce cardiovascular risk."
    },
    riskFactors: [
      "Lack of diabetes education and carbohydrate awareness",
      "Limited access to healthy food options (food deserts)",
      "Cultural dietary patterns high in refined carbohydrates",
      "Irregular meal patterns causing glycemic variability",
      "Comorbid renal disease requiring additional dietary restrictions"
    ],
    diagnostics: [
      "Hemoglobin A1c every 3 months (goal < 7% for most adults)",
      "Fasting blood glucose and postprandial glucose monitoring",
      "Lipid panel annually for cardiovascular risk assessment",
      "Renal function tests to guide protein intake recommendations"
    ],
    management: [
      "Consistent carbohydrate intake with 45-60 grams per meal",
      "Balanced plate method: 50% non-starchy vegetables, 25% lean protein, 25% whole grains",
      "Limit added sugars and choose low-glycemic-index foods",
      "Coordinate meal timing with insulin administration schedule"
    ],
    nursingActions: [
      "Assess patient understanding of carbohydrate counting and glycemic index",
      "Monitor blood glucose before meals and 2 hours postprandial to evaluate dietary effects",
      "Educate on reading food labels for total carbohydrate content per serving",
      "Teach consistent meal timing to prevent hypoglycemia between meals",
      "Collaborate with dietitian for individualized meal planning"
    ],
    signs: {
      left: [
        "Blood glucose 80-130 mg/dL fasting, < 180 mg/dL postprandial",
        "HbA1c < 7% indicating sustained glycemic control",
        "Stable weight and adequate energy levels",
        "Patient demonstrates carbohydrate counting skills"
      ],
      right: [
        "Persistent hyperglycemia despite medication compliance (assess diet)",
        "Wide glucose fluctuations between meals",
        "Weight gain from excessive caloric intake",
        "Hypoglycemia from skipped meals or mismatched insulin-to-carb ratio"
      ]
    },
    medications: [
      {
        name: "Glucose Tablets (Dex4)",
        type: "Rapid-acting glucose supplement",
        action: "Raises blood glucose within 10-15 minutes for hypoglycemia treatment",
        sideEffects: "Rebound hyperglycemia if over-treated",
        contra: "None in emergency hypoglycemia management",
        pearl: "Rule of 15: give 15g fast-acting carbs, wait 15 minutes, recheck glucose; repeat if still < 70 mg/dL."
      }
    ],
    pearls: [
      "The plate method is the simplest dietary teaching tool: half the plate non-starchy vegetables, quarter protein, quarter carbs",
      "Teach patients to always carry fast-acting glucose for hypoglycemia treatment",
      "Consistent carbohydrate intake is more important than complete carb restriction for glycemic stability"
    ],
    quiz: [
      {
        question: "For most adults with diabetes, the recommended carbohydrate intake per meal is:",
        options: ["15-20 grams", "45-60 grams", "100-120 grams", "Zero carbohydrates"],
        correct: 1,
        rationale: "Most adults with diabetes are advised to consume 45-60 grams of carbohydrates per meal for glycemic control."
      },
      {
        question: "When teaching the plate method, the practical nurse instructs the patient that half the plate should contain:",
        options: ["Whole grains", "Non-starchy vegetables", "Lean protein", "Dairy products"],
        correct: 1,
        rationale: "The plate method recommends filling half the plate with non-starchy vegetables, one-quarter protein, one-quarter grains/starch."
      },
      {
        question: "A patient with diabetes has a blood glucose of 62 mg/dL. The nurse should give:",
        options: ["Regular insulin 2 units", "15 grams of fast-acting carbohydrate", "A full meal immediately", "Nothing until the next scheduled meal"],
        correct: 1,
        rationale: "The Rule of 15: give 15 grams of fast-acting carbs for glucose < 70 mg/dL, recheck in 15 minutes."
      }
    ]
  },
  "renal-diet-principles-rpn": {
    title: "Renal Diet Principles",
    cellular: {
      title: "Dietary Management in Renal Impairment",
      content: "Dietary modification in chronic kidney disease (CKD) aims to reduce metabolic waste accumulation, control fluid balance, and prevent electrolyte disturbances. As glomerular filtration rate (GFR) declines, the kidneys lose ability to excrete potassium, phosphorus, sodium, and nitrogenous waste products. Potassium restriction (typically 2,000-3,000 mg/day) prevents life-threatening hyperkalemia and cardiac arrhythmias. Phosphorus restriction (800-1,000 mg/day) prevents renal osteodystrophy and vascular calcification through secondary hyperparathyroidism. Sodium restriction (1,500-2,000 mg/day) controls hypertension and fluid retention. Protein restriction in pre-dialysis CKD (0.6-0.8 g/kg/day) reduces uremic toxin production, while dialysis patients require increased protein (1.2 g/kg/day) to replace losses. Fluid restriction depends on urine output and dialysis schedule."
    },
    riskFactors: [
      "Progressive CKD with declining GFR below 30 mL/min",
      "Dialysis-dependent end-stage renal disease",
      "Poor dietary compliance and limited health literacy",
      "Multiple dietary restrictions causing nutritional inadequacy",
      "Cultural food preferences conflicting with renal diet restrictions"
    ],
    diagnostics: [
      "BUN and creatinine for renal function trending",
      "Serum potassium, phosphorus, and calcium levels",
      "Serum albumin for nutritional status assessment",
      "24-hour urine collection for protein and creatinine clearance"
    ],
    management: [
      "Restrict potassium-rich foods (bananas, oranges, potatoes, tomatoes)",
      "Limit phosphorus from dairy products, colas, processed foods",
      "Sodium restriction to 1,500-2,000 mg daily",
      "Adjust protein intake based on CKD stage and dialysis status"
    ],
    nursingActions: [
      "Educate patient on high-potassium foods to avoid and safe alternatives",
      "Teach label reading for sodium and phosphorus content in packaged foods",
      "Monitor fluid intake and output in fluid-restricted patients",
      "Administer phosphate binders with meals as prescribed",
      "Reinforce dietary teaching and assess understanding using teach-back"
    ],
    signs: {
      left: [
        "Serum potassium 3.5-5.0 mEq/L",
        "Phosphorus within target range (3.5-5.5 mg/dL)",
        "Fluid balance maintained without excessive edema",
        "Patient verbalizes understanding of dietary restrictions"
      ],
      right: [
        "Hyperkalemia > 5.5 mEq/L with ECG changes",
        "Hyperphosphatemia with elevated PTH and bone pain",
        "Fluid overload with peripheral edema and dyspnea",
        "Uremic symptoms (nausea, metallic taste, pruritus)"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel)",
        type: "Phosphate binder",
        action: "Binds dietary phosphorus in the GI tract preventing absorption",
        sideEffects: "Constipation, nausea, abdominal pain, flatulence",
        contra: "Bowel obstruction, hypophosphatemia",
        pearl: "Must be taken WITH meals to bind phosphorus in food; taking it between meals provides no benefit."
      }
    ],
    pearls: [
      "Phosphate binders must be taken with meals - they bind dietary phosphorus and are useless if taken on an empty stomach",
      "Teach patients to leach potassium from potatoes by soaking peeled, sliced potatoes in water for 2+ hours before cooking",
      "Star fruit is strictly contraindicated in CKD - it contains a neurotoxin that healthy kidneys clear but diseased kidneys cannot"
    ],
    quiz: [
      {
        question: "A patient with CKD stage 4 should restrict which mineral to prevent cardiac arrhythmias?",
        options: ["Calcium", "Potassium", "Iron", "Zinc"],
        correct: 1,
        rationale: "Potassium restriction prevents hyperkalemia and life-threatening cardiac arrhythmias in advanced CKD."
      },
      {
        question: "Phosphate binders should be administered:",
        options: ["On an empty stomach", "At bedtime", "With meals", "Two hours after meals"],
        correct: 2,
        rationale: "Phosphate binders must be taken with meals to bind dietary phosphorus in the GI tract."
      },
      {
        question: "Which food group must be most carefully restricted in a patient on hemodialysis?",
        options: ["Whole grains", "Leafy green vegetables", "High-potassium fruits (bananas, oranges)", "Lean poultry"],
        correct: 2,
        rationale: "High-potassium foods must be restricted in dialysis patients to prevent dangerous hyperkalemia."
      }
    ]
  },
  "cardiac-diet-management-rpn": {
    title: "Cardiac/Heart-Healthy Diet",
    cellular: {
      title: "Dietary Factors in Cardiovascular Disease Prevention",
      content: "Heart-healthy dietary patterns reduce cardiovascular risk through multiple mechanisms including blood pressure reduction, lipid profile improvement, inflammation reduction, and endothelial function optimization. The DASH (Dietary Approaches to Stop Hypertension) diet emphasizes fruits, vegetables, whole grains, lean proteins, and low-fat dairy while limiting sodium to 1,500-2,300 mg/day. The Mediterranean diet rich in olive oil, fish, nuts, and whole grains has demonstrated significant reduction in cardiovascular events through anti-inflammatory and antioxidant effects. Sodium restriction reduces extracellular fluid volume and peripheral vascular resistance, lowering blood pressure by 5-8 mmHg. Dietary cholesterol and saturated fat intake directly affect LDL cholesterol levels and atherosclerotic plaque formation. Omega-3 fatty acids from fatty fish reduce triglycerides, inflammation, and arrhythmia risk."
    },
    riskFactors: [
      "High sodium intake (>2,300 mg/day) contributing to hypertension",
      "Diet high in saturated and trans fats elevating LDL cholesterol",
      "Low fiber intake reducing cholesterol excretion",
      "Excessive alcohol intake contributing to hypertriglyceridemia",
      "Processed food reliance with hidden sodium and unhealthy fats"
    ],
    diagnostics: [
      "Fasting lipid panel (total cholesterol, LDL, HDL, triglycerides)",
      "Blood pressure measurement and 24-hour ambulatory monitoring",
      "Fasting blood glucose and HbA1c for metabolic risk",
      "Serum sodium and weight trending for fluid retention"
    ],
    management: [
      "Implement DASH diet with sodium restriction to 1,500-2,300 mg/day",
      "Replace saturated fats with unsaturated fats (olive oil, nuts, avocado)",
      "Increase omega-3 fatty acid intake through fatty fish 2-3 times weekly",
      "Limit alcohol to moderate intake and eliminate trans fats"
    ],
    nursingActions: [
      "Educate patient on reading nutrition labels for sodium, fat, and cholesterol content",
      "Teach DASH diet principles using visual aids and meal planning guides",
      "Monitor daily weights and dietary sodium intake in heart failure patients",
      "Assess barriers to dietary compliance (cost, access, cultural preferences)",
      "Document dietary teaching and patient understanding using teach-back method"
    ],
    signs: {
      left: [
        "Blood pressure < 130/80 mmHg with dietary management",
        "LDL cholesterol within target range for risk level",
        "Stable weight without fluid retention",
        "Patient reports following dietary recommendations"
      ],
      right: [
        "Uncontrolled hypertension despite medication compliance",
        "Elevated LDL cholesterol and triglycerides",
        "Weight gain from sodium-related fluid retention",
        "Worsening heart failure symptoms (dyspnea, edema)"
      ]
    },
    medications: [
      {
        name: "Atorvastatin (Lipitor)",
        type: "HMG-CoA reductase inhibitor (statin)",
        action: "Lowers LDL cholesterol by inhibiting hepatic cholesterol synthesis",
        sideEffects: "Myalgia, elevated liver enzymes, rhabdomyolysis (rare)",
        contra: "Active liver disease, pregnancy",
        pearl: "Dietary modification should always accompany statin therapy - medications work best with lifestyle changes."
      }
    ],
    pearls: [
      "1 teaspoon of salt = 2,300 mg sodium - help patients visualize their daily limit",
      "DASH diet can lower systolic BP by 8-14 mmHg - comparable to adding a medication",
      "Heart failure patients should weigh daily and report weight gain > 2 lbs in 24 hours or > 5 lbs in a week"
    ],
    quiz: [
      {
        question: "The DASH diet recommends limiting daily sodium intake to:",
        options: ["500 mg", "1,500-2,300 mg", "4,000 mg", "No sodium restriction"],
        correct: 1,
        rationale: "DASH diet recommends 1,500-2,300 mg sodium daily to reduce blood pressure."
      },
      {
        question: "Which fat source is recommended in a heart-healthy diet?",
        options: ["Butter and lard", "Coconut oil", "Olive oil and nuts", "Margarine with trans fats"],
        correct: 2,
        rationale: "Monounsaturated fats from olive oil and nuts improve lipid profiles and reduce cardiovascular risk."
      },
      {
        question: "A heart failure patient gained 3 pounds overnight. The nurse should assess for:",
        options: ["Increased muscle mass", "Fluid retention and sodium excess", "Medication side effects only", "Normal weight variation"],
        correct: 1,
        rationale: "Rapid weight gain in heart failure indicates fluid retention, often from excessive sodium intake."
      }
    ]
  },
  "dysphagia-diet-modifications-rpn": {
    title: "Dysphagia Diet Modifications",
    cellular: {
      title: "Swallowing Physiology and Dysphagia Classification",
      content: "Dysphagia involves impaired swallowing function that may occur at the oral, pharyngeal, or esophageal phase. The International Dysphagia Diet Standardisation Initiative (IDDSI) framework provides a global standardized terminology for texture-modified foods (levels 3-7) and thickened liquids (levels 0-4). Level 0 represents thin liquids, level 1 slightly thick, level 2 mildly thick, level 3 moderately thick (liquidized), level 4 extremely thick (pureed), level 5 minced and moist, level 6 soft and bite-sized, and level 7 regular. Aspiration occurs when food or liquid enters the trachea below the level of the true vocal cords, potentially causing aspiration pneumonia. Silent aspiration occurs without visible coughing or distress, making it particularly dangerous. Speech-language pathologists (SLPs) assess swallowing function and determine appropriate diet texture."
    },
    riskFactors: [
      "Stroke affecting cranial nerves IX, X, or XII",
      "Progressive neurological diseases (Parkinson's, ALS, MS)",
      "Head and neck cancer or surgical intervention",
      "Prolonged intubation causing laryngeal edema and weakness",
      "Advanced dementia with loss of coordinated swallowing"
    ],
    diagnostics: [
      "Bedside swallow assessment by speech-language pathologist",
      "Modified barium swallow study (videofluoroscopic evaluation)",
      "Fiberoptic endoscopic evaluation of swallowing (FEES)",
      "Pulse oximetry during feeding trials for desaturation"
    ],
    management: [
      "Implement diet texture as specified by SLP (IDDSI level designation)",
      "Thicken liquids to prescribed consistency using commercial thickeners",
      "Upright positioning at 90 degrees during meals and 30 minutes after",
      "Small bites, slow pace, and chin-tuck positioning as directed"
    ],
    nursingActions: [
      "Verify diet order matches SLP recommendations before providing any food or liquid",
      "Position patient upright at 90 degrees and ensure alertness before meals",
      "Supervise meals and observe for signs of aspiration (coughing, wet voice, choking)",
      "Provide oral care before and after meals to reduce bacterial aspiration risk",
      "Document swallowing ability, diet tolerance, and percentage of meal consumed"
    ],
    signs: {
      left: [
        "Swallowing food and liquids without coughing or choking",
        "Clear voice quality during and after meals",
        "Maintaining adequate oral intake and hydration",
        "No signs of aspiration pneumonia"
      ],
      right: [
        "Coughing, gagging, or choking during meals",
        "Wet or gurgling voice quality after swallowing",
        "Pocketing food in cheeks without swallowing",
        "Recurrent aspiration pneumonia or unexplained fevers"
      ]
    },
    medications: [
      {
        name: "Commercial Thickener (SimplyThick, Thick-It)",
        type: "Food/liquid texture modifier",
        action: "Increases viscosity of liquids to slow bolus transit and reduce aspiration risk",
        sideEffects: "Patient refusal due to altered taste, inadequate fluid intake from dislike",
        contra: "Necrotizing enterocolitis risk in premature infants (SimplyThick xanthan gum-based)",
        pearl: "Follow exact thickening instructions - under-thickening provides no protection and over-thickening increases choking risk."
      }
    ],
    pearls: [
      "Never give thin liquids to a patient with dysphagia until cleared by SLP - water is the most commonly aspirated liquid",
      "A wet or gurgling voice after swallowing is a sign of pharyngeal residue and aspiration risk",
      "Oral hygiene is critical in dysphagia patients - aspiration of bacteria-laden saliva causes pneumonia"
    ],
    quiz: [
      {
        question: "Before feeding a patient with dysphagia, the nurse should ensure the patient is:",
        options: ["Lying flat for comfort", "Alert and positioned upright at 90 degrees", "Sedated for relaxation", "In left lateral position"],
        correct: 1,
        rationale: "Upright positioning at 90 degrees with alertness helps protect the airway during swallowing."
      },
      {
        question: "Which sign during feeding suggests aspiration is occurring?",
        options: ["Patient eating slowly", "Wet or gurgling voice quality after swallowing", "Requesting more food", "Mild throat clearing once"],
        correct: 1,
        rationale: "A wet or gurgling voice indicates liquid or food pooling in the pharynx near the airway."
      },
      {
        question: "The diet consistency for a patient with dysphagia is determined by:",
        options: ["The practical nurse", "The patient's preference", "Speech-language pathologist assessment", "The physician only"],
        correct: 2,
        rationale: "Speech-language pathologists perform swallowing assessments and determine safe diet texture levels."
      }
    ]
  },
  "pediatric-nutrition-needs-rpn": {
    title: "Pediatric Nutrition Needs",
    cellular: {
      title: "Growth-Related Nutritional Requirements in Children",
      content: "Pediatric nutrition must support rapid growth, brain development, and immune system maturation across developmental stages. Infants require 100-120 kcal/kg/day with breast milk or iron-fortified formula as the sole nutrition source for the first 6 months. Breast milk provides optimal nutrition with immunoglobulins (especially IgA), lactoferrin, and prebiotics that protect against infections. Introduction of solid foods begins at approximately 6 months when developmental readiness signs appear (sitting with support, loss of tongue thrust reflex, interest in food). Toddlers (1-3 years) need approximately 1,000-1,400 calories daily with a variety of foods from all food groups. Iron deficiency is the most common nutritional deficiency in children, particularly in toddlers who drink excessive cow's milk displacing iron-rich foods. Calcium and vitamin D requirements increase during adolescent growth spurts to support bone mineralization."
    },
    riskFactors: [
      "Exclusive cow's milk before 12 months causing iron deficiency and GI bleeding",
      "Picky eating in toddlers leading to nutritional gaps",
      "Food allergies limiting dietary diversity",
      "Low socioeconomic status limiting access to nutritious foods",
      "Chronic illness increasing metabolic demands beyond normal intake"
    ],
    diagnostics: [
      "Growth chart plotting (weight, height, head circumference for age)",
      "Hemoglobin and ferritin for iron status screening at 9-12 months",
      "Serum 25-OH vitamin D level in high-risk populations",
      "BMI-for-age percentile tracking after age 2"
    ],
    management: [
      "Exclusive breastfeeding or iron-fortified formula for first 6 months",
      "Introduction of single-ingredient foods at 6 months, one at a time",
      "Iron-rich foods emphasized when complementary foods begin",
      "Transition to whole cow's milk at 12 months (limit to 16-24 oz/day)"
    ],
    nursingActions: [
      "Assess growth parameters at every well-child visit and plot on growth charts",
      "Educate parents on age-appropriate foods and choking hazards",
      "Screen for iron deficiency anemia at 9-12 months of age",
      "Counsel parents to avoid honey before 12 months (botulism risk)",
      "Support breastfeeding and address lactation challenges"
    ],
    signs: {
      left: [
        "Weight and height tracking along expected growth percentiles",
        "Adequate iron stores with normal hemoglobin for age",
        "Developmentally appropriate feeding skills",
        "Varied diet with foods from all food groups"
      ],
      right: [
        "Failure to thrive (weight < 3rd percentile or crossing two percentile lines)",
        "Iron deficiency anemia (pallor, fatigue, irritability)",
        "Obesity (BMI > 95th percentile for age)",
        "Feeding difficulties or food refusal affecting growth"
      ]
    },
    medications: [
      {
        name: "Ferrous Sulfate (iron supplement)",
        type: "Iron replacement",
        action: "Replaces iron stores to correct iron deficiency anemia and support hemoglobin synthesis",
        sideEffects: "Constipation, dark stools, nausea, teeth staining (liquid form)",
        contra: "Iron overload conditions (hemochromatosis, repeated transfusions)",
        pearl: "Give with vitamin C (orange juice) to enhance absorption; avoid giving with milk or calcium which inhibit absorption."
      }
    ],
    pearls: [
      "No honey before age 1 - risk of infant botulism from Clostridium botulinum spores",
      "Cow's milk should not be introduced until 12 months - it's low in iron and can cause GI microbleeding in infants",
      "Excessive juice intake (>4-6 oz/day in children 1-6 years) contributes to diarrhea and dental caries"
    ],
    quiz: [
      {
        question: "Complementary foods should be introduced to infants at approximately:",
        options: ["2 months", "4 months", "6 months", "9 months"],
        correct: 2,
        rationale: "Solid foods are introduced around 6 months when developmental readiness signs appear."
      },
      {
        question: "Honey is contraindicated in infants under 12 months because of risk for:",
        options: ["Allergic reaction", "Infant botulism", "Choking", "Dental caries"],
        correct: 1,
        rationale: "Honey can contain Clostridium botulinum spores that immature infant intestinal flora cannot prevent from germinating."
      },
      {
        question: "A 15-month-old drinking 40 oz of cow's milk daily is at risk for:",
        options: ["Vitamin D toxicity", "Iron deficiency anemia", "Hypercalcemia", "Protein excess"],
        correct: 1,
        rationale: "Excessive cow's milk displaces iron-rich foods and inhibits iron absorption, causing iron deficiency anemia."
      }
    ]
  },
  "obesity-assessment-management-rpn": {
    title: "Obesity Assessment and Management",
    cellular: {
      title: "Obesity Pathophysiology and Metabolic Effects",
      content: "Obesity is a chronic metabolic disease characterized by excessive adipose tissue accumulation with a BMI ≥ 30 kg/m². Adipose tissue functions as an endocrine organ, secreting pro-inflammatory cytokines (TNF-alpha, IL-6) and adipokines (leptin, adiponectin) that promote chronic low-grade inflammation, insulin resistance, and endothelial dysfunction. Visceral (abdominal) obesity is more metabolically dangerous than subcutaneous fat, as it directly drains pro-inflammatory factors into the portal circulation affecting liver metabolism. Leptin resistance develops as adipose tissue increases, impairing normal appetite regulation. Obesity significantly increases risk for type 2 diabetes, cardiovascular disease, obstructive sleep apnea, osteoarthritis, GERD, certain cancers, and non-alcoholic fatty liver disease. Treatment follows a tiered approach: lifestyle modification first, pharmacotherapy for BMI ≥ 30 or ≥ 27 with comorbidities, and bariatric surgery for BMI ≥ 40 or ≥ 35 with comorbidities."
    },
    riskFactors: [
      "Sedentary lifestyle with prolonged sitting and low physical activity",
      "High-calorie diet rich in processed foods, sugar-sweetened beverages",
      "Genetic predisposition and family history of obesity",
      "Medications that promote weight gain (corticosteroids, some antipsychotics, insulin)",
      "Endocrine disorders (hypothyroidism, Cushing syndrome, PCOS)"
    ],
    diagnostics: [
      "BMI calculation (weight in kg / height in meters squared)",
      "Waist circumference (>40 inches male, >35 inches female indicates abdominal obesity)",
      "Fasting glucose, HbA1c, and lipid panel for metabolic screening",
      "Thyroid function tests to rule out endocrine causes"
    ],
    management: [
      "Lifestyle modification with 500-750 kcal/day deficit for 1-2 lb/week weight loss",
      "Regular physical activity goal of 150+ minutes moderate intensity per week",
      "Behavioral therapy and cognitive restructuring for eating patterns",
      "Consider pharmacotherapy or bariatric surgery referral per BMI criteria"
    ],
    nursingActions: [
      "Calculate and document BMI at each clinical encounter without judgment",
      "Assess readiness for change using motivational interviewing techniques",
      "Set realistic, achievable weight loss goals (5-10% initial body weight)",
      "Screen for obesity-related comorbidities at each visit",
      "Provide non-judgmental support and address weight stigma"
    ],
    signs: {
      left: [
        "BMI 18.5-24.9 (normal weight range)",
        "Waist circumference within healthy limits",
        "Normal fasting glucose and lipid panel",
        "Adequate physical activity levels"
      ],
      right: [
        "BMI ≥ 30 with metabolic syndrome indicators",
        "Abdominal obesity with elevated waist circumference",
        "Insulin resistance with acanthosis nigricans",
        "Obstructive sleep apnea symptoms (snoring, daytime somnolence)"
      ]
    },
    medications: [
      {
        name: "Orlistat (Xenical/Alli)",
        type: "Lipase inhibitor",
        action: "Inhibits pancreatic and gastric lipase, preventing absorption of approximately 30% of dietary fat",
        sideEffects: "Oily stool, fecal urgency, flatulence, fat-soluble vitamin malabsorption",
        contra: "Chronic malabsorption syndrome, cholestasis",
        pearl: "Must take a multivitamin with fat-soluble vitamins (A, D, E, K) at bedtime due to impaired absorption; take orlistat with meals."
      }
    ],
    pearls: [
      "A 5-10% weight loss significantly reduces cardiovascular and metabolic risk even if the patient remains obese",
      "Use person-first language ('person with obesity') rather than 'obese patient' to reduce stigma",
      "Motivational interviewing is more effective than directive advice for supporting behavioral change"
    ],
    quiz: [
      {
        question: "Obesity is defined as a BMI of:",
        options: ["≥ 25 kg/m²", "≥ 28 kg/m²", "≥ 30 kg/m²", "≥ 35 kg/m²"],
        correct: 2,
        rationale: "Obesity is clinically defined as BMI ≥ 30 kg/m²; BMI 25-29.9 is overweight."
      },
      {
        question: "Which assessment finding suggests metabolic syndrome in an obese patient?",
        options: ["Low resting heart rate", "Acanthosis nigricans on the neck", "Normal fasting glucose", "Low triglycerides"],
        correct: 1,
        rationale: "Acanthosis nigricans (dark, velvety skin patches) indicates insulin resistance, a key component of metabolic syndrome."
      },
      {
        question: "The initial recommended weight loss goal for an obese patient is:",
        options: ["50% of body weight", "5-10% of initial body weight", "Return to ideal body weight", "30 pounds in the first month"],
        correct: 1,
        rationale: "A 5-10% weight loss is a realistic initial goal that significantly improves metabolic health."
      }
    ]
  }
};
