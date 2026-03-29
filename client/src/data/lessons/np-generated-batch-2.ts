import type { LessonContent } from "./types";

export const npGeneratedBatch2: Record<string, LessonContent> = {
  "portal-hypertension-np": {
    title: "Portal Hypertension: Varices & Beta-Blockers",
    cellular: {
      title: "Pathophysiology of Portal Hypertension",
      content: "Portal Hypertension: Varices & Beta-Blockers involves specific alterations in portal hypertension physiology. The pathophysiology of Portal Hypertension encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of portal hypertension."
    },
    riskFactors: [
      "Tobacco use (pack-year dependent risk calculation)",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Prior stroke or TIA with residual neurological deficit",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Coronary artery disease with prior MI or PCI",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Sedentary lifestyle with deconditioning"
    ],
    diagnostics: [
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Holter or event monitor for intermittent arrhythmia detection",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "Ankle-brachial index for peripheral vascular disease screening"
    ],
    management: [
      "Beta-blocker titration to resting HR 60-70 bpm",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Referral for surgical intervention when medical therapy insufficient",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      },
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      }
    ],
    pearls: [
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis"
    ],
    quiz: [
      {
        question: "A 65-year-old with portal hypertension presents with dyspnea, JVD, and bilateral crackles. BNP 850 pg/mL. Which initial intervention is most appropriate?",
        options: [
          "IV furosemide 40mg and continuous monitoring",
          "Immediate cardiac catheterization",
          "Start amiodarone drip",
          "Discharge with PCP follow-up in 2 weeks"
        ],
        correct: 0,
        rationale: "IV furosemide addresses acute volume overload in portal hypertension with continuous monitoring for response."
      }
    ]
  },
  "tips-procedure-np": {
    title: "TIPS Procedure: Indications & Complications",
    cellular: {
      title: "Pathophysiology of TIPS Procedure",
      content: "TIPS Procedure: Indications & Complications involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. TIPS Procedure pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "NSAID use >2 weeks without gastroprotection",
      "History of C. difficile infection (recurrence risk 20%)",
      "Prior abdominal surgery with adhesion formation",
      "Diabetes with gastroparesis and motility dysfunction",
      "Hepatitis B/C viral infection with cirrhosis progression",
      "Immunosuppression increasing infectious GI complications",
      "High-fat diet with cholelithiasis predisposition"
    ],
    diagnostics: [
      "MRCP for biliary and pancreatic duct evaluation",
      "Colonoscopy with polypectomy for lower GI assessment",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture"
    ],
    management: [
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Bowel rest with IV fluids for acute pancreatitis",
      "Cholecystectomy for symptomatic cholelithiasis",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Gluten-free diet (lifelong) for confirmed celiac disease"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to tips procedure)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      }
    ],
    pearls: [
      "TIPS Procedure evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of tips procedure"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with tips procedure. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for tips procedure."
      }
    ]
  },
  "cholecystectomy-np": {
    title: "Cholecystectomy: Bile Duct Injury",
    cellular: {
      title: "Pathophysiology of Cholecystectomy",
      content: "Cholecystectomy: Bile Duct Injury involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Cholecystectomy pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Chronic PPI use >8 weeks without reassessment",
      "H. pylori infection (most common cause of PUD worldwide)",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "Pancreatic insufficiency with malabsorption",
      "Family history of GI malignancy (first-degree relative)",
      "NSAID use >2 weeks without gastroprotection",
      "Alcohol use disorder with chronic mucosal injury"
    ],
    diagnostics: [
      "EGD with biopsy for upper GI pathology evaluation",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "Colonoscopy with polypectomy for lower GI assessment",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin"
    ],
    management: [
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Bowel rest with IV fluids for acute pancreatitis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to cholecystectomy)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      },
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      }
    ],
    pearls: [
      "Cholecystectomy evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of cholecystectomy"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with cholecystectomy. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for cholecystectomy."
      }
    ]
  },
  "nafld-nash-np": {
    title: "NAFLD/NASH: Fibrosis Staging",
    cellular: {
      title: "Pathophysiology of NAFLD/NASH",
      content: "NAFLD/NASH represents a spectrum from steatosis to steatohepatitis, fibrosis, and cirrhosis. The multiple-hit hypothesis: insulin resistance drives steatosis; oxidative stress, lipotoxicity, and gut-derived endotoxins trigger inflammation. FIB-4 <1.3 excludes advanced fibrosis; >2.67 suggests advanced fibrosis. Resmetirom is the first FDA-approved therapy for NASH with moderate-to-advanced fibrosis."
    },
    riskFactors: [
      "Chronic PPI use >8 weeks without reassessment",
      "H. pylori infection (most common cause of PUD worldwide)",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "Pancreatic insufficiency with malabsorption",
      "Family history of GI malignancy (first-degree relative)",
      "NSAID use >2 weeks without gastroprotection",
      "Alcohol use disorder with chronic mucosal injury"
    ],
    diagnostics: [
      "EGD with biopsy for upper GI pathology evaluation",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "Colonoscopy with polypectomy for lower GI assessment",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin"
    ],
    management: [
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Bowel rest with IV fluids for acute pancreatitis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to nafld/nash)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      },
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      }
    ],
    pearls: [
      "NAFLD/NASH evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of nafld/nash"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with nafld/nash. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for nafld/nash."
      }
    ]
  },
  "colon-cancer-screening-np": {
    title: "Colon Cancer Screening: Guidelines, FIT",
    cellular: {
      title: "Pathophysiology of Colon Cancer Screening",
      content: "Colon Cancer Screening: Guidelines, FIT involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Colon Cancer Screening pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "IBD family history (10-25% have affected first-degree relative)",
      "History of C. difficile infection (recurrence risk 20%)",
      "High-fat diet with cholelithiasis predisposition",
      "NSAID use >2 weeks without gastroprotection",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "Hepatitis B/C viral infection with cirrhosis progression"
    ],
    diagnostics: [
      "EGD with biopsy for upper GI pathology evaluation",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "Colonoscopy with polypectomy for lower GI assessment",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin"
    ],
    management: [
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Bowel rest with IV fluids for acute pancreatitis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to colon cancer screening)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      }
    ],
    pearls: [
      "Colon Cancer Screening evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of colon cancer screening"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with colon cancer screening. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for colon cancer screening."
      }
    ]
  },
  "pancreatic-cancer-workup-np": {
    title: "Pancreatic Cancer Workup: CA 19-9",
    cellular: {
      title: "Pathophysiology of Pancreatic Cancer Workup",
      content: "Pancreatic Cancer Workup: CA 19-9 involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Pancreatic Cancer Workup pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Chronic PPI use >8 weeks without reassessment",
      "H. pylori infection (most common cause of PUD worldwide)",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "Pancreatic insufficiency with malabsorption",
      "Family history of GI malignancy (first-degree relative)",
      "NSAID use >2 weeks without gastroprotection",
      "Alcohol use disorder with chronic mucosal injury"
    ],
    diagnostics: [
      "EGD with biopsy for upper GI pathology evaluation",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "Colonoscopy with polypectomy for lower GI assessment",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin"
    ],
    management: [
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Bowel rest with IV fluids for acute pancreatitis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to pancreatic cancer workup)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      },
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      }
    ],
    pearls: [
      "Pancreatic Cancer Workup evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of pancreatic cancer workup"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with pancreatic cancer workup. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for pancreatic cancer workup."
      }
    ]
  },
  "chronic-diarrhea-algorithm-np": {
    title: "Chronic Diarrhea Algorithm: Osmotic vs",
    cellular: {
      title: "Pathophysiology of Chronic Diarrhea Algorithm",
      content: "Chronic Diarrhea Algorithm: Osmotic vs involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Chronic Diarrhea Algorithm pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "H. pylori infection (most common cause of PUD worldwide)",
      "Chronic PPI use >8 weeks without reassessment",
      "Family history of GI malignancy (first-degree relative)",
      "Chronic liver disease with portal hypertension",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "History of C. difficile infection (recurrence risk 20%)",
      "Immunosuppression increasing infectious GI complications"
    ],
    diagnostics: [
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "MRCP for biliary and pancreatic duct evaluation",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "EGD with biopsy for upper GI pathology evaluation",
      "Capsule endoscopy for obscure small bowel bleeding"
    ],
    management: [
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to chronic diarrhea algorithm)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      }
    ],
    pearls: [
      "Chronic Diarrhea Algorithm evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of chronic diarrhea algorithm"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with chronic diarrhea algorithm. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for chronic diarrhea algorithm."
      }
    ]
  },
  "chronic-mesenteric-ischemia-np": {
    title: "Chronic Mesenteric Ischemia: Postprandial",
    cellular: {
      title: "Pathophysiology of Chronic Mesenteric Ischemia",
      content: "Chronic Mesenteric Ischemia: Postprandial involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Chronic Mesenteric Ischemia pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Prior abdominal surgery with adhesion formation",
      "Hepatitis B/C viral infection with cirrhosis progression",
      "High-fat diet with cholelithiasis predisposition",
      "IBD family history (10-25% have affected first-degree relative)",
      "Tobacco use (impairs mucosal healing)",
      "Pancreatic insufficiency with malabsorption",
      "Radiation therapy to abdomen causing enteritis"
    ],
    diagnostics: [
      "Capsule endoscopy for obscure small bowel bleeding",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "EGD with biopsy for upper GI pathology evaluation",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "ERCP for therapeutic biliary/pancreatic duct intervention"
    ],
    management: [
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "Bowel rest with IV fluids for acute pancreatitis",
      "Nutritional support: enteral preferred over parenteral when feasible"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to chronic mesenteric ischemia)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Chronic Mesenteric Ischemia evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of chronic mesenteric ischemia"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with chronic mesenteric ischemia. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for chronic mesenteric ischemia."
      }
    ]
  },
  "chronic-pancreatitis-management-np": {
    title: "Chronic Pancreatitis: Enzyme Replacement",
    cellular: {
      title: "Pathophysiology of Chronic Pancreatitis",
      content: "Acute pancreatitis results from premature trypsinogen activation within acinar cells, triggering autodigestive cascade. Gallstones (40%) and alcohol (40%) are most common causes. Severity: Revised Atlanta classification (mild, moderate-severe, severe). Ranson criteria and BISAP score predict severity. Management: aggressive IV fluids (LR preferred, 250-500 mL/hr initially), pain control, NPO then early enteral feeding."
    },
    riskFactors: [
      "History of C. difficile infection (recurrence risk 20%)",
      "NSAID use >2 weeks without gastroprotection",
      "Hepatitis B/C viral infection with cirrhosis progression",
      "Radiation therapy to abdomen causing enteritis",
      "Prior abdominal surgery with adhesion formation",
      "Alcohol use disorder with chronic mucosal injury",
      "Tobacco use (impairs mucosal healing)"
    ],
    diagnostics: [
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "MRCP for biliary and pancreatic duct evaluation",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "Capsule endoscopy for obscure small bowel bleeding",
      "Colonoscopy with polypectomy for lower GI assessment",
      "Abdominal X-ray: obstruction, free air, calcifications"
    ],
    management: [
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Surgical consultation for acute abdomen with peritoneal signs"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to chronic pancreatitis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Chronic Pancreatitis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of chronic pancreatitis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with chronic pancreatitis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for chronic pancreatitis."
      }
    ]
  },
  "pancreatic-neuroendocrine-tumors-np": {
    title: "Pancreatic Neuroendocrine Tumors: Functional",
    cellular: {
      title: "Pathophysiology of Pancreatic Neuroendocrine Tumors",
      content: "Pancreatic Neuroendocrine Tumors: Functional involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Pancreatic Neuroendocrine Tumors pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "History of C. difficile infection (recurrence risk 20%)",
      "NSAID use >2 weeks without gastroprotection",
      "Hepatitis B/C viral infection with cirrhosis progression",
      "Radiation therapy to abdomen causing enteritis",
      "Prior abdominal surgery with adhesion formation",
      "Alcohol use disorder with chronic mucosal injury",
      "Tobacco use (impairs mucosal healing)"
    ],
    diagnostics: [
      "MRCP for biliary and pancreatic duct evaluation",
      "Colonoscopy with polypectomy for lower GI assessment",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture"
    ],
    management: [
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Bowel rest with IV fluids for acute pancreatitis",
      "Cholecystectomy for symptomatic cholelithiasis",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Gluten-free diet (lifelong) for confirmed celiac disease"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to pancreatic neuroendocrine tumors)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Pancreatic Neuroendocrine Tumors evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of pancreatic neuroendocrine tumors"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with pancreatic neuroendocrine tumors. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for pancreatic neuroendocrine tumors."
      }
    ]
  },
  "eosinophilic-esophagitis-np": {
    title: "Eosinophilic Esophagitis: Diagnosis",
    cellular: {
      title: "Pathophysiology of Eosinophilic Esophagitis",
      content: "Eosinophilic Esophagitis: Diagnosis involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Eosinophilic Esophagitis pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "IBD family history (10-25% have affected first-degree relative)",
      "History of C. difficile infection (recurrence risk 20%)",
      "High-fat diet with cholelithiasis predisposition",
      "NSAID use >2 weeks without gastroprotection",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "Hepatitis B/C viral infection with cirrhosis progression"
    ],
    diagnostics: [
      "EGD with biopsy for upper GI pathology evaluation",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "Colonoscopy with polypectomy for lower GI assessment",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin"
    ],
    management: [
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Bowel rest with IV fluids for acute pancreatitis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to eosinophilic esophagitis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      }
    ],
    pearls: [
      "Eosinophilic Esophagitis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of eosinophilic esophagitis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with eosinophilic esophagitis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for eosinophilic esophagitis."
      }
    ]
  },
  "sibo-np": {
    title: "Small Intestinal Bacterial Overgrowth: Breath",
    cellular: {
      title: "Pathophysiology of Small Intestinal Bacterial Overgrowth",
      content: "Small Intestinal Bacterial Overgrowth: Breath involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Small Intestinal Bacterial Overgrowth pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Chronic PPI use >8 weeks without reassessment",
      "H. pylori infection (most common cause of PUD worldwide)",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "Pancreatic insufficiency with malabsorption",
      "Family history of GI malignancy (first-degree relative)",
      "NSAID use >2 weeks without gastroprotection",
      "Alcohol use disorder with chronic mucosal injury"
    ],
    diagnostics: [
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "MRCP for biliary and pancreatic duct evaluation",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "EGD with biopsy for upper GI pathology evaluation",
      "Capsule endoscopy for obscure small bowel bleeding"
    ],
    management: [
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to small intestinal bacterial overgrowth)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      },
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      }
    ],
    pearls: [
      "Small Intestinal Bacterial Overgrowth evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of small intestinal bacterial overgrowth"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with small intestinal bacterial overgrowth. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for small intestinal bacterial overgrowth."
      }
    ]
  },
  "microscopic-colitis-np": {
    title: "Microscopic Colitis: Collagenous vs",
    cellular: {
      title: "Pathophysiology of Microscopic Colitis",
      content: "Microscopic Colitis: Collagenous vs involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Microscopic Colitis pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "IBD family history (10-25% have affected first-degree relative)",
      "History of C. difficile infection (recurrence risk 20%)",
      "High-fat diet with cholelithiasis predisposition",
      "NSAID use >2 weeks without gastroprotection",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "Hepatitis B/C viral infection with cirrhosis progression"
    ],
    diagnostics: [
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "EGD with biopsy for upper GI pathology evaluation",
      "Colonoscopy with polypectomy for lower GI assessment",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "MRCP for biliary and pancreatic duct evaluation",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "RUQ ultrasound for gallbladder and hepatic assessment"
    ],
    management: [
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to microscopic colitis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      }
    ],
    pearls: [
      "Microscopic Colitis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of microscopic colitis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with microscopic colitis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for microscopic colitis."
      }
    ]
  },
  "celiac-workup-algorithm-np": {
    title: "Celiac Disease Workup: tTG-IgA",
    cellular: {
      title: "Pathophysiology of Celiac Disease Workup",
      content: "Celiac disease is T-cell mediated autoimmune enteropathy triggered by gluten in HLA-DQ2/DQ8 individuals. tTG deamidates gliadin creating neo-epitopes. Th1 response causes villous atrophy, crypt hyperplasia, intraepithelial lymphocytosis. Screen with tTG-IgA + total IgA. Marsh 3 on biopsy confirms diagnosis."
    },
    riskFactors: [
      "Chronic liver disease with portal hypertension",
      "Pancreatic insufficiency with malabsorption",
      "Chronic constipation with diverticular disease risk",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "Age >65 with declining mucosal defenses",
      "Radiation therapy to abdomen causing enteritis",
      "H. pylori infection (most common cause of PUD worldwide)"
    ],
    diagnostics: [
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "H. pylori testing: urea breath test, stool antigen, or biopsy",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "FibroScan or FIB-4 score for hepatic fibrosis staging"
    ],
    management: [
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Cholecystectomy for symptomatic cholelithiasis",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to celiac disease workup)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      }
    ],
    pearls: [
      "Celiac Disease Workup evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of celiac disease workup"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with celiac disease workup. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for celiac disease workup."
      }
    ]
  },
  "pancreatitis-management-np": {
    title: "Pancreatitis",
    cellular: {
      title: "Pathophysiology of Pancreatitis",
      content: "Acute pancreatitis results from premature trypsinogen activation within acinar cells, triggering autodigestive cascade. Gallstones (40%) and alcohol (40%) are most common causes. Severity: Revised Atlanta classification (mild, moderate-severe, severe). Ranson criteria and BISAP score predict severity. Management: aggressive IV fluids (LR preferred, 250-500 mL/hr initially), pain control, NPO then early enteral feeding."
    },
    riskFactors: [
      "Tobacco use (impairs mucosal healing)",
      "High-fat diet with cholelithiasis predisposition",
      "Diabetes with gastroparesis and motility dysfunction",
      "History of C. difficile infection (recurrence risk 20%)",
      "Radiation therapy to abdomen causing enteritis",
      "Chronic constipation with diverticular disease risk",
      "IBD family history (10-25% have affected first-degree relative)"
    ],
    diagnostics: [
      "Abdominal X-ray: obstruction, free air, calcifications",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "Colonoscopy with polypectomy for lower GI assessment",
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "EGD with biopsy for upper GI pathology evaluation"
    ],
    management: [
      "Surgical consultation for acute abdomen with peritoneal signs",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Cholecystectomy for symptomatic cholelithiasis",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to pancreatitis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Pancreatitis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of pancreatitis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with pancreatitis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for pancreatitis."
      }
    ]
  },
  "melanoma-staging-np": {
    title: "Melanoma: Breslow Depth & Staging",
    cellular: {
      title: "Pathophysiology of Melanoma",
      content: "Melanoma arises from malignant melanocyte transformation driven by UV-induced DNA damage and BRAF (50%), NRAS (25%), or NF1 mutations. BRAF V600E constitutively activates MAPK cascade. Breslow depth is the strongest prognostic factor: <1mm = 95% 5-year survival; >4mm = 45%. SLNB recommended for >0.8mm or ulcerated tumors. Immunotherapy (anti-PD-1, anti-CTLA-4) and BRAF/MEK inhibitors have revolutionized advanced melanoma treatment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for melanoma",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Melanoma management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of melanoma?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "psoriasis-advanced-np": {
    title: "Psoriasis: Biologics & Systemic Therapy",
    cellular: {
      title: "Pathophysiology of Psoriasis",
      content: "Psoriasis: Biologics & Systemic Therapy involves specific alterations in psoriasis physiology. The pathophysiology of Psoriasis encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of psoriasis."
    },
    riskFactors: [
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Family history of premature CVD (<55 males, <65 females)",
      "Age >65 with cardiovascular degeneration",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Peripheral artery disease (ABI <0.9)",
      "Obesity (BMI >30) with metabolic syndrome",
      "Chronic kidney disease (eGFR <60 mL/min)"
    ],
    diagnostics: [
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)"
    ],
    management: [
      "Referral for surgical intervention when medical therapy insufficient",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "Loop diuretics titrated to euvolemia based on daily weights"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      },
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      }
    ],
    pearls: [
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise"
    ],
    quiz: [
      {
        question: "A patient with history of psoriasis has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "drug-eruptions-np": {
    title: "Drug Eruptions: Morbilliform & Fixed Drug",
    cellular: {
      title: "Pathophysiology of Drug Eruptions",
      content: "Drug Eruptions: Morbilliform & Fixed Drug involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for drug eruptions",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Drug Eruptions management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of drug eruptions?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "sjs-np": {
    title: "Stevens-Johnson Syndrome: SCORTEN",
    cellular: {
      title: "Pathophysiology of Stevens-Johnson Syndrome",
      content: "SJS/TEN are severe cutaneous drug reactions. SJS: <10% BSA; TEN: >30% BSA. CD8+ T cells release granulysin causing widespread keratinocyte apoptosis. Common drugs: allopurinol, carbamazepine, lamotrigine, sulfonamides. HLA-B*5801 screening before allopurinol in high-risk populations. SCORTEN predicts mortality."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for stevens-johnson syndrome",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Stevens-Johnson Syndrome management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of stevens-johnson syndrome?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "wound-healing-molecular-np": {
    title: "Wound Healing: Molecular & Growth Factors",
    cellular: {
      title: "Pathophysiology of Wound Healing",
      content: "Wound Healing: Molecular & Growth Factors involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for wound healing",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Wound Healing management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of wound healing?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "necrotizing-fasciitis-np": {
    title: "Necrotizing Fasciitis: LRINEC Score",
    cellular: {
      title: "Pathophysiology of Necrotizing Fasciitis",
      content: "Necrotizing Fasciitis: LRINEC Score involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for necrotizing fasciitis",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Necrotizing Fasciitis management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of necrotizing fasciitis?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "ten-np": {
    title: "Toxic Epidermal Necrolysis: ICU Management",
    cellular: {
      title: "Pathophysiology of Toxic Epidermal Necrolysis",
      content: "Toxic Epidermal Necrolysis: ICU Management involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for toxic epidermal necrolysis",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Toxic Epidermal Necrolysis management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of toxic epidermal necrolysis?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "actinic-keratosis-np": {
    title: "Actinic Keratosis: Premalignant Workup",
    cellular: {
      title: "Pathophysiology of Actinic Keratosis",
      content: "Actinic Keratosis: Premalignant Workup involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for actinic keratosis",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Actinic Keratosis management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of actinic keratosis?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "squamous-cell-carcinoma-np": {
    title: "Squamous Cell Carcinoma: Staging",
    cellular: {
      title: "Pathophysiology of Squamous Cell Carcinoma",
      content: "Squamous Cell Carcinoma: Staging involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for squamous cell carcinoma",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Squamous Cell Carcinoma management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of squamous cell carcinoma?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "dermatitis-herpetiformis-np": {
    title: "Dermatitis Herpetiformis: Celiac Association",
    cellular: {
      title: "Pathophysiology of Dermatitis Herpetiformis",
      content: "Celiac disease is T-cell mediated autoimmune enteropathy triggered by gluten in HLA-DQ2/DQ8 individuals. tTG deamidates gliadin creating neo-epitopes. Th1 response causes villous atrophy, crypt hyperplasia, intraepithelial lymphocytosis. Screen with tTG-IgA + total IgA. Marsh 3 on biopsy confirms diagnosis."
    },
    riskFactors: [
      "Radiation therapy to abdomen causing enteritis",
      "Diabetes with gastroparesis and motility dysfunction",
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "Prior abdominal surgery with adhesion formation",
      "IBD family history (10-25% have affected first-degree relative)",
      "Chronic PPI use >8 weeks without reassessment",
      "History of C. difficile infection (recurrence risk 20%)"
    ],
    diagnostics: [
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "EGD with biopsy for upper GI pathology evaluation",
      "H. pylori testing: urea breath test, stool antigen, or biopsy",
      "Colonoscopy with polypectomy for lower GI assessment"
    ],
    management: [
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Cholecystectomy for symptomatic cholelithiasis",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Bowel rest with IV fluids for acute pancreatitis",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to dermatitis herpetiformis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Dermatitis Herpetiformis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of dermatitis herpetiformis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with dermatitis herpetiformis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for dermatitis herpetiformis."
      }
    ]
  },
  "bppv-management-np": {
    title: "BPPV: Epley Maneuver & Differential Diagnosis",
    cellular: {
      title: "Pathophysiology of BPPV",
      content: "BPPV is caused by displaced otoconia from the utricle into semicircular canals (posterior 85-95%). Dix-Hallpike test diagnostic: upbeat-torsional nystagmus with 2-5s latency, <60s duration, fatigable. Epley maneuver has 80-90% success rate."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "menieres-disease-np": {
    title: "Meniere's Disease: Endolymphatic Hydrops",
    cellular: {
      title: "Pathophysiology of Meniere's Disease",
      content: "Meniere disease involves endolymphatic hydrops from impaired endolymph reabsorption. Diagnostic criteria: >=2 episodes vertigo 20min-12h, audiometrically documented low-to-mid frequency SNHL, aural fullness, tinnitus. Treatment: low-sodium diet, diuretics, intratympanic dexamethasone/gentamicin."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "labyrinthitis-np": {
    title: "Labyrinthitis: Vestibular vs Central",
    cellular: {
      title: "Pathophysiology of Labyrinthitis",
      content: "Labyrinthitis: Vestibular vs Central involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "ramsay-hunt-np": {
    title: "Ramsay-Hunt Syndrome: VZV Reactivation",
    cellular: {
      title: "Pathophysiology of Ramsay-Hunt Syndrome",
      content: "Ramsay-Hunt syndrome results from VZV reactivation in the geniculate ganglion causing ipsilateral facial nerve palsy, ear pain, and vesicular eruption on the ear/palate. Triad: facial paralysis, ear pain, vesicles. Treatment: valacyclovir 1g TID + prednisone 60mg x7 days, started within 72h of onset."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "rhinosinusitis-np": {
    title: "Rhinosinusitis: Antibiotic Stewardship",
    cellular: {
      title: "Pathophysiology of Rhinosinusitis",
      content: "Rhinosinusitis: Antibiotic Stewardship involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "pharyngitis-management-np": {
    title: "Pharyngitis: GAS Testing",
    cellular: {
      title: "Pathophysiology of Pharyngitis",
      content: "Pharyngitis: GAS Testing involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "otitis-externa-np": {
    title: "Otitis Externa: Malignant OE Differential",
    cellular: {
      title: "Pathophysiology of Otitis Externa",
      content: "Otitis Externa: Malignant OE Differential involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "papilledema-np": {
    title: "Papilledema: ICP Workup & Neuroimaging",
    cellular: {
      title: "Pathophysiology of Papilledema",
      content: "Papilledema: ICP Workup & Neuroimaging involves systematic interpretation of laboratory values, imaging studies, and diagnostic procedures essential for clinical decision-making in papilledema. Understanding sensitivity, specificity, positive and negative predictive values guides test selection and result interpretation."
    },
    riskFactors: [
      "Pre-analytical errors (specimen handling, timing, patient preparation)",
      "Interfering substances (hemolysis, lipemia, medications)",
      "Reference range variations by age, sex, and ethnicity",
      "Test selection bias and overtesting",
      "Failure to correlate results with clinical context",
      "Delayed specimen processing affecting accuracy",
      "Patient factors: fasting status, hydration, circadian variation"
    ],
    diagnostics: [
      "Appropriate test selection based on pre-test probability",
      "Proper specimen collection and handling protocols",
      "Reference range application with patient-specific adjustments",
      "Serial trending of values for clinical significance",
      "Sensitivity/specificity consideration for screening vs confirmatory tests",
      "Correlation of laboratory results with clinical presentation",
      "Critical value identification and urgent communication"
    ],
    management: [
      "Evidence-based first-line therapy for papilledema per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Normal vs abnormal value identification",
        "Trending analysis over time",
        "Clinical correlation with symptoms",
        "Pre-test probability assessment"
      ],
      right: [
        "Critical value recognition and response",
        "Sensitivity and specificity interpretation",
        "False positive and false negative consideration",
        "Cost-effective test ordering strategy"
      ]
    },
    medications: [
      {
        name: "Laboratory Test Interpretation Framework",
        type: "Diagnostic Tool",
        action: "Systematic approach to interpreting lab values within clinical context including pre-analytical, analytical, and post-analytical phases",
        sideEffects: "Over-reliance on lab values without clinical correlation",
        contra: "Treating lab numbers in isolation from clinical presentation",
        pearl: "Always correlate labs with clinical picture. Know common interferences: hemolysis (falsely elevated K+, LDH), biotin (falsely decreased troponin, TSH), lipemia (falsely decreased sodium)."
      },
      {
        name: "Imaging Selection Guidelines",
        type: "Diagnostic Decision Support",
        action: "Evidence-based imaging selection using ACR Appropriateness Criteria to guide modality choice by clinical scenario",
        sideEffects: "Radiation exposure concerns with CT studies",
        contra: "Contrast administration in severe renal impairment or allergy without premedication",
        pearl: "ACR Appropriateness Criteria guide imaging selection. CT with contrast: hold metformin 48h if eGFR <30. MRI: screen for metallic implants. Ultrasound: no radiation, excellent for pregnant patients. Choose wisely: avoid unnecessary imaging."
      }
    ],
    pearls: [
      "Papilledema requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Papilledema management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with papilledema. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of papilledema."
      }
    ]
  },
  "hearing-loss-differential-np": {
    title: "Hearing Loss: Audiometric Interpretation",
    cellular: {
      title: "Pathophysiology of Hearing Loss",
      content: "Hearing Loss: Audiometric Interpretation involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "psychopharmacology-advanced-np": {
    title: "Psychopharmacology: Receptor Binding",
    cellular: {
      title: "Pharmacology of Psychopharmacology",
      content: "Psychopharmacology: Receptor Binding encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to psychopharmacology."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Psychopharmacology management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to psychopharmacology. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "mood-stabilizers-moa-np": {
    title: "Mood Stabilizers: MOA & Monitoring",
    cellular: {
      title: "Pathophysiology of Mood Stabilizers",
      content: "Mood Stabilizers: MOA & Monitoring involves alterations in neurotransmitter systems, neural circuit function, and psychosocial factors specific to mood stabilizers."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Mood Stabilizers management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with mood stabilizers. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of mood stabilizers."
      }
    ]
  },
  "antipsychotic-profiles-np": {
    title: "Antipsychotic Receptor Profiles: Typical vs",
    cellular: {
      title: "Pathophysiology of Antipsychotic Receptor Profiles",
      content: "Antipsychotic Receptor Profiles: Typical vs involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Antipsychotic Receptor Profiles pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "NSAID use >2 weeks without gastroprotection",
      "History of C. difficile infection (recurrence risk 20%)",
      "Prior abdominal surgery with adhesion formation",
      "Diabetes with gastroparesis and motility dysfunction",
      "Hepatitis B/C viral infection with cirrhosis progression",
      "Immunosuppression increasing infectious GI complications",
      "High-fat diet with cholelithiasis predisposition"
    ],
    diagnostics: [
      "MRCP for biliary and pancreatic duct evaluation",
      "Colonoscopy with polypectomy for lower GI assessment",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture"
    ],
    management: [
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Bowel rest with IV fluids for acute pancreatitis",
      "Cholecystectomy for symptomatic cholelithiasis",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Gluten-free diet (lifelong) for confirmed celiac disease"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to antipsychotic receptor profiles)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      }
    ],
    pearls: [
      "Antipsychotic Receptor Profiles evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of antipsychotic receptor profiles"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with antipsychotic receptor profiles. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for antipsychotic receptor profiles."
      }
    ]
  },
  "benzodiazepine-pharmacology-np": {
    title: "Benzodiazepine Pharmacology: GABA",
    cellular: {
      title: "Pharmacology of Benzodiazepine Pharmacology",
      content: "Benzodiazepine Pharmacology: GABA encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to benzodiazepine pharmacology."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Benzodiazepine Pharmacology management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to benzodiazepine pharmacology. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "serotonin-syndrome-advanced-np": {
    title: "Serotonin Syndrome: Hunter Criteria",
    cellular: {
      title: "Pharmacology of Serotonin Syndrome",
      content: "Serotonin Syndrome: Hunter Criteria encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to serotonin syndrome."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Serotonin Syndrome management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to serotonin syndrome. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "nms-advanced-np": {
    title: "Neuroleptic Malignant Syndrome: Dantrolene",
    cellular: {
      title: "Pathophysiology of Neuroleptic Malignant Syndrome",
      content: "Neuroleptic Malignant Syndrome: Dantrolene involves malignant transformation through accumulation of genetic mutations (oncogene activation, tumor suppressor loss) driving uncontrolled proliferation. The hallmarks of cancer include sustained proliferative signaling, evading growth suppressors, resisting cell death, enabling replicative immortality, inducing angiogenesis, and activating invasion/metastasis. TNM staging guides prognosis and treatment decisions."
    },
    riskFactors: [
      "Age (strongest risk factor for most cancers)",
      "Tobacco use (dose-dependent carcinogenic exposure)",
      "Family history and inherited cancer syndromes (BRCA, Lynch)",
      "Chronic inflammation or infection (H. pylori, HBV/HCV, HPV)",
      "Environmental carcinogen exposure (asbestos, radiation, benzene)",
      "Immunosuppression (transplant, HIV)",
      "Obesity (associated with 13 cancer types)"
    ],
    diagnostics: [
      "Tissue biopsy with histopathological examination (gold standard)",
      "CT chest/abdomen/pelvis for staging",
      "PET-CT for metabolic activity and metastatic survey",
      "Tumor markers (CEA, PSA, CA-125, AFP, LDH)",
      "Molecular profiling and genomic testing (BRCA, MSI, PD-L1, TMB)",
      "CBC, CMP, LDH for baseline and tumor burden",
      "Age-appropriate cancer screening per USPSTF/ACS guidelines"
    ],
    management: [
      "Evidence-based first-line therapy for neuroleptic malignant syndrome per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Unexplained weight loss >10% in 6 months",
        "Persistent fatigue unresponsive to rest",
        "Pain (new onset, progressive)",
        "New mass or lymphadenopathy"
      ],
      right: [
        "B symptoms: fever, night sweats, weight loss",
        "Performance status assessment (ECOG/Karnofsky)",
        "Paraneoplastic syndromes",
        "Evidence of metastatic disease"
      ]
    },
    medications: [
      {
        name: "Pembrolizumab (Keytruda)",
        type: "Anti-PD-1 Checkpoint Inhibitor",
        action: "Blocks PD-1 receptor on T cells restoring anti-tumor immune surveillance",
        sideEffects: "Immune-related adverse events: colitis, hepatitis, pneumonitis, thyroiditis, dermatitis",
        contra: "Autoimmune disease (relative), organ transplant",
        pearl: "First-line for PD-L1 high (>=50%) NSCLC, MSI-H/dMMR tumors. Monitor thyroid function, LFTs. Manage irAEs with corticosteroids."
      },
      {
        name: "Ondansetron (Zofran)",
        type: "5-HT3 Receptor Antagonist",
        action: "Blocks serotonin 5-HT3 receptors in CTZ and vagal afferents preventing chemotherapy-induced emesis",
        sideEffects: "Headache, constipation, QT prolongation (dose-dependent)",
        contra: "Concomitant apomorphine, congenital long QT syndrome",
        pearl: "4-8mg IV/PO q8h. Combine with dexamethasone +/- NK1 antagonist (aprepitant) for highly emetogenic chemo. ECG for QT if multiple doses."
      }
    ],
    pearls: [
      "Neuroleptic Malignant Syndrome requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Neuroleptic Malignant Syndrome management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with neuroleptic malignant syndrome. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of neuroleptic malignant syndrome."
      }
    ]
  },
  "ect-np": {
    title: "ECT: Indications, Mechanism & Monitoring",
    cellular: {
      title: "Pathophysiology of ECT",
      content: "DIC involves systemic activation of coagulation with simultaneous consumption of clotting factors and platelets causing both microvascular thrombosis and hemorrhage. Triggers: sepsis, trauma, malignancy, obstetric complications. Labs: prolonged PT/aPTT, low fibrinogen (<100), elevated D-dimer, thrombocytopenia, schistocytes on smear. Treatment: treat underlying cause, replace with FFP/cryo/platelets if bleeding, heparin only if thrombosis predominates."
    },
    riskFactors: [
      "Liver disease with coagulopathy and thrombocytopenia",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Splenomegaly with hypersplenism",
      "Malignancy with bone marrow infiltration or DIC",
      "Chemotherapy-induced myelosuppression",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Chronic kidney disease with decreased erythropoietin"
    ],
    diagnostics: [
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "B12 and folate levels (methylmalonic acid if B12 borderline)"
    ],
    management: [
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Folate supplementation: 1mg PO daily"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      },
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "ECT management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with ect presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of ect."
      }
    ]
  },
  "sud-advanced-np": {
    title: "Substance Use Disorders: Advanced",
    cellular: {
      title: "Pathophysiology of Substance Use Disorders",
      content: "Substance Use Disorders: Advanced involves alterations in neurotransmitter systems, neural circuit function, and psychosocial factors specific to substance use disorders."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Substance Use Disorders management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with substance use disorders. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of substance use disorders."
      }
    ]
  },
  "oud-mat-np": {
    title: "Opioid Use Disorder: MAT",
    cellular: {
      title: "Pathophysiology of Opioid Use Disorder",
      content: "Opioid Use Disorder involves mu-opioid receptor activation in the ventral tegmental area and nucleus accumbens driving reward and physical dependence. MAT is standard of care: buprenorphine (partial mu agonist, can prescribe in office), methadone (full agonist, OTP clinics only for OUD), naltrexone (mu antagonist, requires 7-10 days opioid-free). Buprenorphine: DATA 2000 waiver eliminated in 2023. Naloxone distribution for overdose reversal."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Opioid Use Disorder management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with opioid use disorder. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of opioid use disorder."
      }
    ]
  },
  "separation-anxiety-np": {
    title: "Separation Anxiety: Neurodevelopmental",
    cellular: {
      title: "Pathophysiology of Separation Anxiety",
      content: "Separation Anxiety: Neurodevelopmental involves age-specific developmental, physiological, and pathological mechanisms unique to pediatric populations. Separation Anxiety in children requires understanding of growth parameters, developmental milestones, weight-based medication dosing, and age-appropriate normal values that differ significantly from adult parameters."
    },
    riskFactors: [
      "Prematurity or low birth weight",
      "Incomplete immunization status",
      "Daycare/school exposure to communicable diseases",
      "Genetic syndromes or chromosomal abnormalities",
      "Family history of hereditary conditions",
      "Environmental exposures (lead, secondhand smoke)",
      "Nutritional deficiencies or failure to thrive"
    ],
    diagnostics: [
      "Age-appropriate vital signs and growth chart assessment",
      "Developmental screening (ASQ, M-CHAT for ASD)",
      "CBC with differential using age-adjusted normals",
      "Age-specific metabolic and liver function panels",
      "Imaging modulated for radiation minimization in children",
      "Immunization records and catch-up schedule review",
      "Genetic testing or newborn screening results review"
    ],
    management: [
      "Evidence-based first-line therapy for separation anxiety per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever (distinguish age-based risk: <28d = always high risk)",
        "Irritability, poor feeding, or lethargy",
        "Rash (viral exanthem, purpura, petechiae)",
        "Respiratory distress (nasal flaring, grunting, retractions)"
      ],
      right: [
        "Growth faltering or failure to thrive",
        "Developmental delay or regression",
        "Dehydration assessment (fontanelle, tears, UOP, skin turgor)",
        "Weight-based medication dosing verification"
      ]
    },
    medications: [
      {
        name: "Amoxicillin (pediatric)",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis",
        sideEffects: "Diarrhea, rash (especially with EBV)",
        contra: "Penicillin allergy",
        pearl: "AOM: 80-90mg/kg/day divided BID x10d (<2y) or x5-7d (>=2y). Strep pharyngitis: 50mg/kg/day (max 1000mg) divided BID x10d."
      },
      {
        name: "Ibuprofen (pediatric)",
        type: "NSAID",
        action: "Inhibits COX-1 and COX-2 reducing prostaglandin synthesis",
        sideEffects: "GI upset, renal impairment with dehydration",
        contra: "Age <6 months, dehydration, renal impairment, varicella (Reye syndrome association less clear than aspirin)",
        pearl: "10mg/kg/dose q6-8h (max 40mg/kg/day). Do NOT alternate with acetaminophen routinely. Ensure hydration. Avoid in dehydrated children."
      }
    ],
    pearls: [
      "Separation Anxiety requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Separation Anxiety management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with separation anxiety. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of separation anxiety."
      }
    ]
  },
  "adhd-pharmacology-np": {
    title: "ADHD Pharmacology: Stimulant vs Non-Stimulant",
    cellular: {
      title: "Pharmacology of ADHD Pharmacology",
      content: "ADHD Pharmacology: Stimulant vs Non-Stimulant encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to adhd pharmacology."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "ADHD Pharmacology management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to adhd pharmacology. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "suicide-risk-assessment-np": {
    title: "Suicide Risk Assessment: Columbia Protocol",
    cellular: {
      title: "Pathophysiology of Suicide Risk Assessment",
      content: "Suicide Risk Assessment: Columbia Protocol involves alterations in neurotransmitter systems, neural circuit function, and psychosocial factors specific to suicide risk assessment."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Suicide Risk Assessment management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with suicide risk assessment. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of suicide risk assessment."
      }
    ]
  },
  "ptsd-management-np": {
    title: "PTSD Management: Prazosin, EMDR",
    cellular: {
      title: "Pathophysiology of PTSD Management",
      content: "PTSD Management: Prazosin, EMDR involves alterations in neurotransmitter systems, neural circuit function, and psychosocial factors specific to ptsd management."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "PTSD Management management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with ptsd management. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of ptsd management."
      }
    ]
  },
  "eating-disorder-management-np": {
    title: "Eating Disorder Management: Medical",
    cellular: {
      title: "Pathophysiology of Eating Disorder Management",
      content: "DIC involves systemic activation of coagulation with simultaneous consumption of clotting factors and platelets causing both microvascular thrombosis and hemorrhage. Triggers: sepsis, trauma, malignancy, obstetric complications. Labs: prolonged PT/aPTT, low fibrinogen (<100), elevated D-dimer, thrombocytopenia, schistocytes on smear. Treatment: treat underlying cause, replace with FFP/cryo/platelets if bleeding, heparin only if thrombosis predominates."
    },
    riskFactors: [
      "Chronic disease states causing anemia of inflammation",
      "Recent surgery or trauma with blood loss",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Splenomegaly with hypersplenism",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chemotherapy-induced myelosuppression",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)"
    ],
    diagnostics: [
      "Reticulocyte count (production index) for bone marrow response",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia"
    ],
    management: [
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Eating Disorder Management management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with eating disorder management presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of eating disorder management."
      }
    ]
  },
  "insomnia-pharmacotherapy-np": {
    title: "Insomnia Pharmacotherapy: CBT-I",
    cellular: {
      title: "Pharmacology of Insomnia Pharmacotherapy",
      content: "Insomnia Pharmacotherapy: CBT-I encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to insomnia pharmacotherapy."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Insomnia Pharmacotherapy management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to insomnia pharmacotherapy. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "geriatric-depression-np": {
    title: "Geriatric Depression: Late-Onset",
    cellular: {
      title: "Pathophysiology of Geriatric Depression",
      content: "Major depressive disorder involves monoamine deficiency (serotonin, norepinephrine, dopamine), HPA axis dysregulation, neuroinflammation, and altered neuroplasticity. DSM-5: >=5 of 9 SIGECAPS criteria for >=2 weeks. First-line: SSRIs (sertraline, escitalopram). Black box warning: suicidality monitoring in age <25. PHQ-9 for screening and monitoring. Adequate trial: 6-8 weeks at therapeutic dose."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Geriatric Depression management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with geriatric depression. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of geriatric depression."
      }
    ]
  },
  "personality-disorder-assessment-np": {
    title: "Personality Disorder Assessment: Cluster",
    cellular: {
      title: "Pathophysiology of Personality Disorder Assessment",
      content: "Personality Disorder Assessment: Cluster involves alterations in neurotransmitter systems, neural circuit function, and psychosocial factors specific to personality disorder assessment."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Personality Disorder Assessment management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with personality disorder assessment. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of personality disorder assessment."
      }
    ]
  },
  "conduct-disorder-np": {
    title: "Conduct Disorder",
    cellular: {
      title: "Pathophysiology of Conduct Disorder",
      content: "Conduct disorder is a persistent pattern of behavior violating societal norms and others' rights. DSM-5: >=3 of 15 criteria in 12 months from 4 categories: aggression to people/animals, destruction of property, deceitfulness/theft, serious rule violations. Childhood-onset type (<10y) has worse prognosis and may progress to antisocial personality disorder. Treatment: multimodal including parent management training, cognitive-behavioral therapy, and family therapy. Medications only for comorbidities (ADHD, depression, aggression)."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Conduct Disorder management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with conduct disorder. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of conduct disorder."
      }
    ]
  },
  "alcohol-withdrawal-np": {
    title: "Alcohol Withdrawal",
    cellular: {
      title: "Pathophysiology of Alcohol Withdrawal",
      content: "Alcohol withdrawal syndrome results from chronic GABA receptor downregulation and NMDA receptor upregulation. Onset 6-24h after last drink. Progression: anxiety/tremor (6-12h), withdrawal seizures (12-48h), delirium tremens (48-96h, 5% mortality untreated). CIWA-Ar protocol guides benzodiazepine dosing: diazepam 10-20mg or chlordiazepoxide 50-100mg q1h for CIWA >10. Thiamine 500mg IV x3 days before glucose to prevent Wernicke encephalopathy. Phenobarbital for benzodiazepine-refractory withdrawal."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Alcohol Withdrawal management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with alcohol withdrawal. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of alcohol withdrawal."
      }
    ]
  },
  "serotonin-syndrome-np": {
    title: "Serotonin Syndrome: Hunter Criteria",
    cellular: {
      title: "Pharmacology of Serotonin Syndrome",
      content: "Serotonin Syndrome: Hunter Criteria encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to serotonin syndrome."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Serotonin Syndrome management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to serotonin syndrome. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "intimate-partner-violence-np": {
    title: "Intimate Partner Violence",
    cellular: {
      title: "Pathophysiology of Intimate Partner Violence",
      content: "Intimate partner violence (IPV) affects 1 in 4 women and 1 in 10 men. Types: physical, sexual, psychological/emotional, and financial abuse. Screening: USPTF recommends screening all women of reproductive age (HITS, HARK, or STAT tools). Red flags: frequent ED visits, injuries inconsistent with stated mechanism, depression, anxiety, chronic pain. Provider response: assess safety, validate, provide resources (National DV Hotline: 1-800-799-7233), document findings, mandatory reporting per state law for children/elderly."
    },
    riskFactors: [
      "Genetic predisposition and family psychiatric history",
      "Childhood adversity and trauma (ACE score)",
      "Substance use disorders (comorbidity >50%)",
      "Chronic medical conditions (pain, neurological, endocrine)",
      "Social isolation and lack of support systems",
      "Medication non-adherence and treatment discontinuation",
      "Socioeconomic stressors and adverse social determinants"
    ],
    diagnostics: [
      "Structured clinical interview using DSM-5 criteria",
      "Validated screening tools (PHQ-9, GAD-7, AUDIT-C, Columbia Suicide Severity Rating Scale)",
      "Comprehensive psychiatric history and mental status exam",
      "Suicide risk assessment (ideation, plan, means, intent, protective factors)",
      "Substance use screening and toxicology when indicated",
      "Medical workup to exclude organic causes (TSH, CBC, CMP, B12, folate)",
      "Collateral history from family/caregivers when appropriate"
    ],
    management: [
      "Evidence-based psychotherapy (CBT, DBT, motivational interviewing)",
      "First-line pharmacotherapy based on diagnosis and patient factors",
      "Suicide safety planning and means restriction counseling",
      "Integrated substance use disorder treatment when comorbid",
      "Regular follow-up with symptom monitoring using validated scales",
      "Crisis intervention resources and safety planning",
      "Psychiatric referral for treatment-resistant or complex presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Mood disturbance (depression, mania, anxiety, irritability)",
        "Sleep changes (insomnia, hypersomnia)",
        "Appetite and weight changes",
        "Psychomotor agitation or retardation"
      ],
      right: [
        "Cognitive symptoms (concentration, memory, decision-making)",
        "Psychotic features (hallucinations, delusions, disorganized thinking)",
        "Suicidal or homicidal ideation",
        "Substance use signs (intoxication, withdrawal)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "SSRI",
        action: "Selectively inhibits serotonin reuptake transporter (SERT) increasing synaptic 5-HT",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, weight gain",
        contra: "MAOi use within 14 days, concurrent pimozide or thioridazine",
        pearl: "Start 50mg daily (25mg for panic disorder/PTSD). Max 200mg. BLACK BOX: monitor suicidality in <25y. Takes 4-6 weeks for full effect. First-line for MDD, GAD, PTSD, OCD."
      },
      {
        name: "Buprenorphine/Naloxone (Suboxone)",
        type: "Partial Mu Agonist / Antagonist Combination",
        action: "Buprenorphine: partial mu agonist with ceiling effect on respiratory depression; naloxone: deters IV misuse",
        sideEffects: "Headache, nausea, constipation, precipitation of withdrawal if opioids still present",
        contra: "Active opioid use within 12-24h (precipitated withdrawal), severe hepatic impairment",
        pearl: "Induction: start 2-4mg SL when in moderate withdrawal (COWS >=8). Titrate to 8-24mg/day. X-waiver requirement eliminated 2023. Prescribe naloxone for all patients."
      }
    ],
    pearls: [
      "Always screen for suicidality: ask directly - asking does NOT increase risk",
      "Black box warning: all antidepressants carry suicidality risk in patients <25 years",
      "Intimate Partner Violence management requires integrated approach combining pharmacotherapy, psychotherapy, and social support"
    ],
    quiz: [
      {
        question: "A patient presents with symptoms consistent with intimate partner violence. Most important initial assessment?",
        options: [
          "Start medication immediately",
          "Comprehensive psychiatric evaluation including suicide risk assessment",
          "Discharge with self-help resources only",
          "Referral without current assessment"
        ],
        correct: 1,
        rationale: "Comprehensive psychiatric evaluation with suicide risk assessment is the critical first step for safe and effective management of intimate partner violence."
      }
    ]
  },
  "ovarian-torsion-np": {
    title: "Ovarian Torsion: Diagnosis",
    cellular: {
      title: "Pathophysiology of Ovarian Torsion",
      content: "Ovarian Torsion: Diagnosis involves reproductive, obstetric, or gynecologic pathophysiology specific to ovarian torsion."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for ovarian torsion",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Ovarian Torsion management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with ovarian torsion. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for ovarian torsion."
      }
    ]
  },
  "ectopic-pregnancy-np": {
    title: "Ectopic Pregnancy: Methotrexate vs Surgical",
    cellular: {
      title: "Pathophysiology of Ectopic Pregnancy",
      content: "Ectopic Pregnancy: Methotrexate vs Surgical involves reproductive, obstetric, or gynecologic pathophysiology specific to ectopic pregnancy."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for ectopic pregnancy",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Ectopic Pregnancy management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with ectopic pregnancy. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for ectopic pregnancy."
      }
    ]
  },
  "cervical-cancer-screening-np": {
    title: "Cervical Cancer Screening: Guidelines",
    cellular: {
      title: "Pathophysiology of Cervical Cancer Screening",
      content: "Cervical Cancer Screening: Guidelines involves malignant transformation through accumulation of genetic mutations (oncogene activation, tumor suppressor loss) driving uncontrolled proliferation. The hallmarks of cancer include sustained proliferative signaling, evading growth suppressors, resisting cell death, enabling replicative immortality, inducing angiogenesis, and activating invasion/metastasis. TNM staging guides prognosis and treatment decisions."
    },
    riskFactors: [
      "Age (strongest risk factor for most cancers)",
      "Tobacco use (dose-dependent carcinogenic exposure)",
      "Family history and inherited cancer syndromes (BRCA, Lynch)",
      "Chronic inflammation or infection (H. pylori, HBV/HCV, HPV)",
      "Environmental carcinogen exposure (asbestos, radiation, benzene)",
      "Immunosuppression (transplant, HIV)",
      "Obesity (associated with 13 cancer types)"
    ],
    diagnostics: [
      "Tissue biopsy with histopathological examination (gold standard)",
      "CT chest/abdomen/pelvis for staging",
      "PET-CT for metabolic activity and metastatic survey",
      "Tumor markers (CEA, PSA, CA-125, AFP, LDH)",
      "Molecular profiling and genomic testing (BRCA, MSI, PD-L1, TMB)",
      "CBC, CMP, LDH for baseline and tumor burden",
      "Age-appropriate cancer screening per USPSTF/ACS guidelines"
    ],
    management: [
      "Evidence-based first-line therapy for cervical cancer screening per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Unexplained weight loss >10% in 6 months",
        "Persistent fatigue unresponsive to rest",
        "Pain (new onset, progressive)",
        "New mass or lymphadenopathy"
      ],
      right: [
        "B symptoms: fever, night sweats, weight loss",
        "Performance status assessment (ECOG/Karnofsky)",
        "Paraneoplastic syndromes",
        "Evidence of metastatic disease"
      ]
    },
    medications: [
      {
        name: "Pembrolizumab (Keytruda)",
        type: "Anti-PD-1 Checkpoint Inhibitor",
        action: "Blocks PD-1 receptor on T cells restoring anti-tumor immune surveillance",
        sideEffects: "Immune-related adverse events: colitis, hepatitis, pneumonitis, thyroiditis, dermatitis",
        contra: "Autoimmune disease (relative), organ transplant",
        pearl: "First-line for PD-L1 high (>=50%) NSCLC, MSI-H/dMMR tumors. Monitor thyroid function, LFTs. Manage irAEs with corticosteroids."
      },
      {
        name: "Ondansetron (Zofran)",
        type: "5-HT3 Receptor Antagonist",
        action: "Blocks serotonin 5-HT3 receptors in CTZ and vagal afferents preventing chemotherapy-induced emesis",
        sideEffects: "Headache, constipation, QT prolongation (dose-dependent)",
        contra: "Concomitant apomorphine, congenital long QT syndrome",
        pearl: "4-8mg IV/PO q8h. Combine with dexamethasone +/- NK1 antagonist (aprepitant) for highly emetogenic chemo. ECG for QT if multiple doses."
      }
    ],
    pearls: [
      "Cervical Cancer Screening requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Cervical Cancer Screening management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with cervical cancer screening. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of cervical cancer screening."
      }
    ]
  },
  "hrt-prescribing-np": {
    title: "HRT Prescribing: Risks, Benefits & Monitoring",
    cellular: {
      title: "Pharmacology of HRT Prescribing",
      content: "HRT Prescribing: Risks, Benefits & Monitoring encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to hrt prescribing."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "HRT Prescribing management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to hrt prescribing. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "infertility-workup-np": {
    title: "Infertility Workup: Female",
    cellular: {
      title: "Pathophysiology of Infertility Workup",
      content: "Infertility Workup: Female involves reproductive, obstetric, or gynecologic pathophysiology specific to infertility workup."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for infertility workup",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Infertility Workup management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with infertility workup. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for infertility workup."
      }
    ]
  },
  "recurrent-pregnancy-loss-np": {
    title: "Recurrent Pregnancy Loss: Antiphospholipid",
    cellular: {
      title: "Pathophysiology of Recurrent Pregnancy Loss",
      content: "Recurrent Pregnancy Loss: Antiphospholipid involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to recurrent pregnancy loss."
    },
    riskFactors: [
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Recurrent UTIs or urinary tract obstruction",
      "Multiple myeloma with cast nephropathy",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Sickle cell disease with papillary necrosis",
      "IV contrast administration (contrast-induced nephropathy)",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)"
    ],
    diagnostics: [
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "CBC for anemia of CKD evaluation"
    ],
    management: [
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Recurrent Pregnancy Loss management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with recurrent pregnancy loss has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "preconception-counseling-np": {
    title: "Preconception Counseling: Optimization",
    cellular: {
      title: "Pathophysiology of Preconception Counseling",
      content: "Preconception Counseling: Optimization involves reproductive, obstetric, or gynecologic pathophysiology specific to preconception counseling."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for preconception counseling",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Preconception Counseling management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with preconception counseling. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for preconception counseling."
      }
    ]
  },
  "breast-cancer-screening-np": {
    title: "Breast Cancer Screening: Mammography",
    cellular: {
      title: "Pathophysiology of Breast Cancer Screening",
      content: "Breast Cancer Screening: Mammography involves malignant transformation through accumulation of genetic mutations (oncogene activation, tumor suppressor loss) driving uncontrolled proliferation. The hallmarks of cancer include sustained proliferative signaling, evading growth suppressors, resisting cell death, enabling replicative immortality, inducing angiogenesis, and activating invasion/metastasis. TNM staging guides prognosis and treatment decisions."
    },
    riskFactors: [
      "Age (strongest risk factor for most cancers)",
      "Tobacco use (dose-dependent carcinogenic exposure)",
      "Family history and inherited cancer syndromes (BRCA, Lynch)",
      "Chronic inflammation or infection (H. pylori, HBV/HCV, HPV)",
      "Environmental carcinogen exposure (asbestos, radiation, benzene)",
      "Immunosuppression (transplant, HIV)",
      "Obesity (associated with 13 cancer types)"
    ],
    diagnostics: [
      "Tissue biopsy with histopathological examination (gold standard)",
      "CT chest/abdomen/pelvis for staging",
      "PET-CT for metabolic activity and metastatic survey",
      "Tumor markers (CEA, PSA, CA-125, AFP, LDH)",
      "Molecular profiling and genomic testing (BRCA, MSI, PD-L1, TMB)",
      "CBC, CMP, LDH for baseline and tumor burden",
      "Age-appropriate cancer screening per USPSTF/ACS guidelines"
    ],
    management: [
      "Evidence-based first-line therapy for breast cancer screening per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Unexplained weight loss >10% in 6 months",
        "Persistent fatigue unresponsive to rest",
        "Pain (new onset, progressive)",
        "New mass or lymphadenopathy"
      ],
      right: [
        "B symptoms: fever, night sweats, weight loss",
        "Performance status assessment (ECOG/Karnofsky)",
        "Paraneoplastic syndromes",
        "Evidence of metastatic disease"
      ]
    },
    medications: [
      {
        name: "Pembrolizumab (Keytruda)",
        type: "Anti-PD-1 Checkpoint Inhibitor",
        action: "Blocks PD-1 receptor on T cells restoring anti-tumor immune surveillance",
        sideEffects: "Immune-related adverse events: colitis, hepatitis, pneumonitis, thyroiditis, dermatitis",
        contra: "Autoimmune disease (relative), organ transplant",
        pearl: "First-line for PD-L1 high (>=50%) NSCLC, MSI-H/dMMR tumors. Monitor thyroid function, LFTs. Manage irAEs with corticosteroids."
      },
      {
        name: "Ondansetron (Zofran)",
        type: "5-HT3 Receptor Antagonist",
        action: "Blocks serotonin 5-HT3 receptors in CTZ and vagal afferents preventing chemotherapy-induced emesis",
        sideEffects: "Headache, constipation, QT prolongation (dose-dependent)",
        contra: "Concomitant apomorphine, congenital long QT syndrome",
        pearl: "4-8mg IV/PO q8h. Combine with dexamethasone +/- NK1 antagonist (aprepitant) for highly emetogenic chemo. ECG for QT if multiple doses."
      }
    ],
    pearls: [
      "Breast Cancer Screening requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Breast Cancer Screening management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with breast cancer screening. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of breast cancer screening."
      }
    ]
  },
  "contraception-prescribing-np": {
    title: "Contraception Prescribing: CDC MEC",
    cellular: {
      title: "Pharmacology of Contraception Prescribing",
      content: "Contraception Prescribing: CDC MEC encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to contraception prescribing."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Contraception Prescribing management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to contraception prescribing. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "menopause-pharmacotherapy-np": {
    title: "Menopause Pharmacotherapy: Vasomotor Symptom",
    cellular: {
      title: "Pharmacology of Menopause Pharmacotherapy",
      content: "Menopause Pharmacotherapy: Vasomotor Symptom encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to menopause pharmacotherapy."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Menopause Pharmacotherapy management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to menopause pharmacotherapy. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "priapism-np": {
    title: "Priapism: Ischemic vs Nonischemic",
    cellular: {
      title: "Pathophysiology of Priapism",
      content: "Priapism is a prolonged erection (>4 hours) unrelated to sexual stimulation. Ischemic (low-flow, 95%): painful, dark blood on aspiration, corporal blood gas shows acidosis/hypoxia. Non-ischemic (high-flow, 5%): painless, usually post-traumatic. Ischemic is a urologic emergency: aspiration of corporal blood, intracavernous phenylephrine injection (200-500mcg q3-5min), surgical shunt if refractory. Risk factors: sickle cell disease (most common cause in children), PDE5 inhibitors, trazodone, antipsychotics."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for priapism",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Priapism evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with priapism presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for priapism."
      }
    ]
  },
  "balanitis-np": {
    title: "Balanitis: Etiology & Treatment Algorithms",
    cellular: {
      title: "Pathophysiology of Balanitis",
      content: "Balanitis is inflammation of the glans penis, often extending to the prepuce (balanoposthitis). Most common cause: Candida albicans (especially in uncircumcised males and diabetics). Other causes: bacterial (group B strep, anaerobes), contact dermatitis, psoriasis, lichen sclerosus (BXO). Treatment: topical antifungals (clotrimazole) for Candida, antibiotics for bacterial, topical steroids for inflammatory. Recurrent balanitis in adults warrants diabetes screening and consideration of circumcision."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for balanitis",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Balanitis evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with balanitis presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for balanitis."
      }
    ]
  },
  "penile-cancer-np": {
    title: "Penile Cancer: Staging & Surgical Management",
    cellular: {
      title: "Pathophysiology of Penile Cancer",
      content: "Penile Cancer: Staging & Surgical Management involves malignant transformation through accumulation of genetic mutations (oncogene activation, tumor suppressor loss) driving uncontrolled proliferation. The hallmarks of cancer include sustained proliferative signaling, evading growth suppressors, resisting cell death, enabling replicative immortality, inducing angiogenesis, and activating invasion/metastasis. TNM staging guides prognosis and treatment decisions."
    },
    riskFactors: [
      "Age (strongest risk factor for most cancers)",
      "Tobacco use (dose-dependent carcinogenic exposure)",
      "Family history and inherited cancer syndromes (BRCA, Lynch)",
      "Chronic inflammation or infection (H. pylori, HBV/HCV, HPV)",
      "Environmental carcinogen exposure (asbestos, radiation, benzene)",
      "Immunosuppression (transplant, HIV)",
      "Obesity (associated with 13 cancer types)"
    ],
    diagnostics: [
      "Tissue biopsy with histopathological examination (gold standard)",
      "CT chest/abdomen/pelvis for staging",
      "PET-CT for metabolic activity and metastatic survey",
      "Tumor markers (CEA, PSA, CA-125, AFP, LDH)",
      "Molecular profiling and genomic testing (BRCA, MSI, PD-L1, TMB)",
      "CBC, CMP, LDH for baseline and tumor burden",
      "Age-appropriate cancer screening per USPSTF/ACS guidelines"
    ],
    management: [
      "Evidence-based first-line therapy for penile cancer per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Unexplained weight loss >10% in 6 months",
        "Persistent fatigue unresponsive to rest",
        "Pain (new onset, progressive)",
        "New mass or lymphadenopathy"
      ],
      right: [
        "B symptoms: fever, night sweats, weight loss",
        "Performance status assessment (ECOG/Karnofsky)",
        "Paraneoplastic syndromes",
        "Evidence of metastatic disease"
      ]
    },
    medications: [
      {
        name: "Pembrolizumab (Keytruda)",
        type: "Anti-PD-1 Checkpoint Inhibitor",
        action: "Blocks PD-1 receptor on T cells restoring anti-tumor immune surveillance",
        sideEffects: "Immune-related adverse events: colitis, hepatitis, pneumonitis, thyroiditis, dermatitis",
        contra: "Autoimmune disease (relative), organ transplant",
        pearl: "First-line for PD-L1 high (>=50%) NSCLC, MSI-H/dMMR tumors. Monitor thyroid function, LFTs. Manage irAEs with corticosteroids."
      },
      {
        name: "Ondansetron (Zofran)",
        type: "5-HT3 Receptor Antagonist",
        action: "Blocks serotonin 5-HT3 receptors in CTZ and vagal afferents preventing chemotherapy-induced emesis",
        sideEffects: "Headache, constipation, QT prolongation (dose-dependent)",
        contra: "Concomitant apomorphine, congenital long QT syndrome",
        pearl: "4-8mg IV/PO q8h. Combine with dexamethasone +/- NK1 antagonist (aprepitant) for highly emetogenic chemo. ECG for QT if multiple doses."
      }
    ],
    pearls: [
      "Penile Cancer requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Penile Cancer management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with penile cancer. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of penile cancer."
      }
    ]
  },
  "cryptorchidism-np": {
    title: "Cryptorchidism: GnRH Axis & Orchiopexy Timing",
    cellular: {
      title: "Pathophysiology of Cryptorchidism",
      content: "Cryptorchidism (undescended testis) affects 3% of full-term males. Normally, testicular descent is regulated by insulin-like peptide 3 (INSL3) and testosterone acting on gubernaculum. Associated with increased testicular cancer risk (40x), infertility, testicular torsion, and inguinal hernia. Spontaneous descent usually by 6 months. If persistent at 6 months, refer for orchiopexy (surgical correction) by 12-18 months to preserve fertility potential and facilitate cancer surveillance."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for cryptorchidism",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Cryptorchidism evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with cryptorchidism presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for cryptorchidism."
      }
    ]
  },
  "orchitis-np": {
    title: "Orchitis: Viral vs Bacterial",
    cellular: {
      title: "Pathophysiology of Orchitis",
      content: "Orchitis is testicular inflammation, viral (mumps orchitis: most common, bilateral 15-30%, can cause infertility) or bacterial (usually from epididymitis extension: E. coli in >35y, Chlamydia/Gonorrhea in <35y). Prehn sign positive (elevation relieves pain) differentiates from torsion (negative Prehn). Doppler US confirms blood flow. Bacterial: ceftriaxone 500mg IM x1 + doxycycline 100mg BID x10d (<35y) or fluoroquinolone (>35y). Viral: supportive care, NSAIDs."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for orchitis",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Orchitis evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with orchitis presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for orchitis."
      }
    ]
  },
  "prostatitis-np": {
    title: "Prostatitis: NIH Classification",
    cellular: {
      title: "Pathophysiology of Prostatitis",
      content: "Prostatitis: NIH Classification involves male reproductive, urological, or andrological pathophysiology specific to prostatitis."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for prostatitis",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Prostatitis evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with prostatitis presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for prostatitis."
      }
    ]
  },
  "htn-guidelines-np": {
    title: "Hypertension: JNC/ACC-AHA Guidelines",
    cellular: {
      title: "Pathophysiology of Hypertension",
      content: "Hypertension: JNC/ACC-AHA Guidelines involves specific alterations in hypertension physiology. The pathophysiology of Hypertension encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of hypertension."
    },
    riskFactors: [
      "Obesity (BMI >30) with metabolic syndrome",
      "Sedentary lifestyle with deconditioning",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Diabetes mellitus type 2 with HbA1c >7%",
      "History of preeclampsia or gestational hypertension",
      "Left ventricular hypertrophy on ECG or echo"
    ],
    diagnostics: [
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "Ankle-brachial index for peripheral vascular disease screening",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "HbA1c for glycemic control assessment in diabetic patients",
      "CRP and ESR for inflammatory/infectious cardiac conditions"
    ],
    management: [
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week",
      "Structured exercise program: 150 min/week moderate-intensity aerobic"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      },
      {
        name: "Spironolactone (Aldactone)",
        type: "Mineralocorticoid Receptor Antagonist",
        action: "Competitively blocks aldosterone at collecting duct; reduces sodium retention, fibrosis, and remodeling",
        sideEffects: "Hyperkalemia, gynecomastia, breast tenderness, menstrual irregularity",
        contra: "K+ >5.0 mEq/L, eGFR <30, concurrent K+-sparing diuretics, Addison disease",
        pearl: "HF: 25mg daily. RALES: 30% mortality reduction. Check K+ at 3 days and 1 week. Switch to eplerenone if gynecomastia."
      }
    ],
    pearls: [
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "Target LDL <70 mg/dL for established ASCVD (consider <55 for very high risk)",
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF"
    ],
    quiz: [
      {
        question: "A 58-year-old with hypertension has LDL 145, diabetes, and HTN. Best lipid management?",
        options: [
          "Lifestyle modification only for 6 months",
          "Moderate-intensity statin",
          "High-intensity statin (atorvastatin 40-80mg)",
          "Ezetimibe monotherapy"
        ],
        correct: 2,
        rationale: "With multiple ASCVD risk factors and hypertension, high-intensity statin therapy is indicated per ACC/AHA guidelines."
      }
    ]
  },
  "dm2-management-np": {
    title: "Diabetes Type 2: ADA Guidelines & SGLT2/GLP-1",
    cellular: {
      title: "Pathophysiology of Diabetes Type 2",
      content: "T2DM features insulin resistance and progressive beta-cell dysfunction. Insulin resistance from TNF-alpha, IL-6, free fatty acids impairs IRS phosphorylation. Beta-cell compensation fails through glucotoxicity and lipotoxicity. First-line: metformin + lifestyle. Second-line based on comorbidities: SGLT2i or GLP-1RA for ASCVD, HF, CKD."
    },
    riskFactors: [
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Iodine deficiency or excess affecting thyroid function",
      "Eating disorders with hypothalamic amenorrhea",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency"
    ],
    diagnostics: [
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Plasma metanephrines for pheochromocytoma screening",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)"
    ],
    management: [
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Medical nutrition therapy with carbohydrate counting",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Diabetes self-management education and support (DSMES)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      },
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Diabetes Type 2 management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected diabetes type 2. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for diabetes type 2",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for diabetes type 2 while being cost-effective."
      }
    ]
  },
  "lipid-management-np": {
    title: "Lipid Management: Statin Intensity",
    cellular: {
      title: "Pathophysiology of Lipid Management",
      content: "Lipid Management: Statin Intensity requires understanding of comparative pharmacology, mechanism-based selection, patient-specific factors, and formulary considerations for optimal therapeutic outcomes in lipid management."
    },
    riskFactors: [
      "Multiple comorbidities complicating medication selection",
      "Drug-drug interactions with current regimen",
      "Renal or hepatic impairment requiring dose adjustment",
      "Medication allergies or prior adverse reactions",
      "Cost and insurance formulary restrictions",
      "Patient preferences and adherence barriers",
      "Pregnancy, lactation, or reproductive age considerations"
    ],
    diagnostics: [
      "Review indication, contraindications, and drug interactions",
      "Assess renal and hepatic function for dosing",
      "Check allergy history and cross-reactivity potential",
      "Evaluate current medication list for interactions",
      "Consider patient factors: age, weight, comorbidities, pregnancy status",
      "Review formulary coverage and cost considerations",
      "Assess patient adherence history and preferences"
    ],
    management: [
      "Evidence-based first-line therapy for lipid management per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Symptom response to medication",
        "Adverse effect monitoring",
        "Drug level therapeutic range",
        "Patient adherence assessment"
      ],
      right: [
        "Efficacy comparison with alternatives",
        "Safety profile comparison",
        "Cost-effectiveness analysis",
        "Guideline concordance verification"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Selection Process",
        type: "Clinical Decision Framework",
        action: "Systematic comparison of medications within a class based on efficacy, safety, cost, and patient factors",
        sideEffects: "Analysis paralysis with multiple equivalent options",
        contra: "Ignoring patient-specific factors in selection",
        pearl: "Use decision aids: first-line per guidelines, then adjust for comorbidities, drug interactions, renal/hepatic function, cost, and patient preference. STEPS framework: Safety, Tolerability, Effectiveness, Price, Simplicity."
      },
      {
        name: "Pharmacogenomic Considerations",
        type: "Precision Medicine",
        action: "Genetic testing to predict drug metabolism, efficacy, and adverse reaction risk",
        sideEffects: "Limited evidence for some gene-drug pairs",
        contra: "Relying solely on pharmacogenomics without clinical context",
        pearl: "CPIC guidelines: CYP2D6 for codeine/TCAs, CYP2C19 for clopidogrel/PPIs, HLA-B*5701 for abacavir, HLA-B*1502 for carbamazepine (Asian descent). DPYD for fluoropyrimidines."
      }
    ],
    pearls: [
      "Lipid Management requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Lipid Management management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with lipid management. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of lipid management."
      }
    ]
  },
  "obesity-medicine-np": {
    title: "Obesity Medicine: Pharmacotherapy",
    cellular: {
      title: "Pharmacology of Obesity Medicine",
      content: "Obesity Medicine: Pharmacotherapy encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to obesity medicine."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Obesity Medicine management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to obesity medicine. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "chronic-pain-mgmt-np": {
    title: "Chronic Pain Management: Multimodal Approach",
    cellular: {
      title: "Pathophysiology of Chronic Pain Management",
      content: "Chronic pain (>3 months) involves peripheral and central sensitization. Peripheral: nociceptor upregulation, inflammatory mediators (prostaglandins, bradykinin, substance P). Central: wind-up phenomenon, NMDA receptor activation, descending inhibition failure. Multimodal approach: non-pharmacologic (CBT, PT, acupuncture, TENS) combined with pharmacologic (acetaminophen, NSAIDs, gabapentinoids, duloxetine, TCAs). Avoid chronic opioids when possible; if necessary, lowest effective dose with functional goals. PMP check for controlled substances."
    },
    riskFactors: [
      "Condition-specific predisposing factors for chronic pain management",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for chronic pain management",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for chronic pain management",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of chronic pain management",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to chronic pain management",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of chronic pain management",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for chronic pain management. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Chronic Pain Management requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of chronic pain management"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with chronic pain management. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for chronic pain management."
      }
    ]
  },
  "headache-differential-np": {
    title: "Headache Differential: Red Flags & Triptans",
    cellular: {
      title: "Pharmacology of Headache Differential",
      content: "Headache Differential: Red Flags & Triptans encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to headache differential."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Headache Differential management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to headache differential. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "low-back-pain-np": {
    title: "Low Back Pain: Evidence-Based Evaluation",
    cellular: {
      title: "Pathophysiology of Low Back Pain",
      content: "Low Back Pain: Evidence-Based Evaluation encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Low Back Pain requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for low back pain per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Low Back Pain requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Low Back Pain management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with low back pain. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of low back pain."
      }
    ]
  },
  "gerd-management-np": {
    title: "GERD Management: PPI Stewardship",
    cellular: {
      title: "Pathophysiology of GERD Management",
      content: "GERD results from transient lower esophageal sphincter relaxation allowing gastric acid reflux, causing esophageal mucosal injury. Chronic acid exposure can lead to Barrett esophagus (intestinal metaplasia replacing squamous epithelium), a premalignant condition with 0.5% annual progression to esophageal adenocarcinoma. Los Angeles classification grades erosive esophagitis (A-D). Management: PPI therapy (8-week course), lifestyle modifications, endoscopic surveillance for Barrett."
    },
    riskFactors: [
      "Immunosuppression increasing infectious GI complications",
      "Alcohol use disorder with chronic mucosal injury",
      "Pancreatic insufficiency with malabsorption",
      "H. pylori infection (most common cause of PUD worldwide)",
      "Chronic liver disease with portal hypertension",
      "Tobacco use (impairs mucosal healing)",
      "Age >65 with declining mucosal defenses"
    ],
    diagnostics: [
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "Capsule endoscopy for obscure small bowel bleeding",
      "Anti-tTG IgA with total IgA for celiac disease screening"
    ],
    management: [
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Bowel rest with IV fluids for acute pancreatitis",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Cholecystectomy for symptomatic cholelithiasis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to gerd management)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      }
    ],
    pearls: [
      "GERD Management evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of gerd management"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with gerd management. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for gerd management."
      }
    ]
  },
  "asthma-outpatient-np": {
    title: "Asthma Management: Stepwise Outpatient",
    cellular: {
      title: "Pathophysiology of Asthma Management",
      content: "Asthma is chronic inflammatory disease driven by Th2 immune response producing IL-4 (IgE switching), IL-5 (eosinophil recruitment), IL-13 (mucus, hyperresponsiveness). IgE cross-linking triggers mast cell degranulation. Stepwise therapy: Step 1-2 = PRN ICS-formoterol; Step 3 = low-dose ICS-LABA; Step 4-5 = medium-high ICS-LABA +/- LAMA +/- biologic."
    },
    riskFactors: [
      "Current or former tobacco use (pack-year calculation)",
      "Prior TB exposure or latent TB infection",
      "Cystic fibrosis genotype (CFTR mutations)",
      "Family history of alpha-1 antitrypsin deficiency",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Obesity with restrictive physiology and OSA",
      "Indoor air pollution and biomass fuel exposure"
    ],
    diagnostics: [
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO",
      "Polysomnography for sleep-disordered breathing",
      "Procalcitonin for bacterial vs viral pneumonia differentiation",
      "CT chest high-resolution for interstitial/parenchymal disease",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "Pulse oximetry and continuous SpO2 monitoring",
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)"
    ],
    management: [
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)",
      "Smoking cessation: varenicline + counseling (most effective combination)",
      "Annual influenza and pneumococcal vaccination",
      "LAMA (tiotropium 18mcg daily) for COPD maintenance",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "Antibiotic therapy based on local resistance patterns and severity scoring",
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      },
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Asthma Management management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with asthma management develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for asthma management."
      }
    ]
  },
  "copd-outpatient-np": {
    title: "COPD Management: GOLD Guidelines & Inhalers",
    cellular: {
      title: "Pathophysiology of COPD Management",
      content: "COPD features persistent airflow limitation from obstructive bronchiolitis and emphysema. Inhaled irritants activate macrophages and neutrophils releasing proteases (MMP-9, elastase) overwhelming alpha-1 antitrypsin. Mucus gland hyperplasia and goblet cell metaplasia cause chronic mucus hypersecretion. FEV1/FVC <0.7 post-bronchodilator confirms diagnosis. GOLD classification guides therapy."
    },
    riskFactors: [
      "Immunocompromised state increasing pneumonia susceptibility",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Indoor air pollution and biomass fuel exposure",
      "GERD with chronic microaspiration",
      "Age >65 with declining mucociliary clearance",
      "Cystic fibrosis genotype (CFTR mutations)",
      "Environmental allergen sensitization (dust mites, mold, pollen)"
    ],
    diagnostics: [
      "Sputum culture, Gram stain, and AFB stain",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "D-dimer (high sensitivity, low specificity for PE)",
      "Peak expiratory flow rate monitoring for asthma",
      "Procalcitonin for bacterial vs viral pneumonia differentiation",
      "Bronchoscopy with BAL for diagnostic sampling"
    ],
    management: [
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Annual influenza and pneumococcal vaccination",
      "Chest tube placement for pneumothorax or empyema drainage"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      },
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "COPD Management management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with copd management develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for copd management."
      }
    ]
  },
  "uti-management-np": {
    title: "UTI Management: Uncomplicated vs Complicated",
    cellular: {
      title: "Pathophysiology of UTI Management",
      content: "UTI pathogenesis involves uropathogenic E. coli (80% of uncomplicated UTIs) with P-fimbriae and type 1 pili adhesins. Uncomplicated cystitis: nitrofurantoin 100mg BID x5 days or TMP-SMX x3 days (if resistance <20%). Pyelonephritis: fluoroquinolone x7 days or IV ceftriaxone. Complicated UTI: IV antibiotics with imaging to rule out obstruction/abscess. CAUTI: remove/replace catheter + antibiotics based on culture."
    },
    riskFactors: [
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Diabetes mellitus with impaired neutrophil function",
      "Splenectomy with encapsulated organism susceptibility",
      "Chronic liver disease with impaired immune function"
    ],
    diagnostics: [
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "CRP and ESR for inflammatory response quantification",
      "Sensitivity testing for targeted antimicrobial therapy",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads"
    ],
    management: [
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Immunization update for preventable infections",
      "Source control: drainage, debridement, device removal",
      "Repeat cultures at 48-72h to document clearance",
      "Infectious disease consultation for complex or resistant infections"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "UTI Management management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected uti management has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "sinusitis-management-np": {
    title: "Sinusitis: Bacterial vs Viral",
    cellular: {
      title: "Pathophysiology of Sinusitis",
      content: "Sinusitis: Bacterial vs Viral involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "otitis-media-management-np": {
    title: "Otitis Media: Watchful Waiting vs Antibiotics",
    cellular: {
      title: "Pathophysiology of Otitis Media",
      content: "Otitis Media: Watchful Waiting vs Antibiotics involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "annual-wellness-visit-np": {
    title: "Annual Wellness Visit: Age-Appropriate",
    cellular: {
      title: "Pathophysiology of Annual Wellness Visit",
      content: "Annual Wellness Visit: Age-Appropriate encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Annual Wellness Visit requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for annual wellness visit per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Annual Wellness Visit requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Annual Wellness Visit management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with annual wellness visit. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of annual wellness visit."
      }
    ]
  },
  "cancer-screening-guidelines-np": {
    title: "Cancer Screening by Age/Gender: USPSTF",
    cellular: {
      title: "Pathophysiology of Cancer Screening by Age/Gender",
      content: "Cancer Screening by Age/Gender: USPSTF involves malignant transformation through accumulation of genetic mutations (oncogene activation, tumor suppressor loss) driving uncontrolled proliferation. The hallmarks of cancer include sustained proliferative signaling, evading growth suppressors, resisting cell death, enabling replicative immortality, inducing angiogenesis, and activating invasion/metastasis. TNM staging guides prognosis and treatment decisions."
    },
    riskFactors: [
      "Age (strongest risk factor for most cancers)",
      "Tobacco use (dose-dependent carcinogenic exposure)",
      "Family history and inherited cancer syndromes (BRCA, Lynch)",
      "Chronic inflammation or infection (H. pylori, HBV/HCV, HPV)",
      "Environmental carcinogen exposure (asbestos, radiation, benzene)",
      "Immunosuppression (transplant, HIV)",
      "Obesity (associated with 13 cancer types)"
    ],
    diagnostics: [
      "Tissue biopsy with histopathological examination (gold standard)",
      "CT chest/abdomen/pelvis for staging",
      "PET-CT for metabolic activity and metastatic survey",
      "Tumor markers (CEA, PSA, CA-125, AFP, LDH)",
      "Molecular profiling and genomic testing (BRCA, MSI, PD-L1, TMB)",
      "CBC, CMP, LDH for baseline and tumor burden",
      "Age-appropriate cancer screening per USPSTF/ACS guidelines"
    ],
    management: [
      "Evidence-based first-line therapy for cancer screening by age/gender per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Unexplained weight loss >10% in 6 months",
        "Persistent fatigue unresponsive to rest",
        "Pain (new onset, progressive)",
        "New mass or lymphadenopathy"
      ],
      right: [
        "B symptoms: fever, night sweats, weight loss",
        "Performance status assessment (ECOG/Karnofsky)",
        "Paraneoplastic syndromes",
        "Evidence of metastatic disease"
      ]
    },
    medications: [
      {
        name: "Pembrolizumab (Keytruda)",
        type: "Anti-PD-1 Checkpoint Inhibitor",
        action: "Blocks PD-1 receptor on T cells restoring anti-tumor immune surveillance",
        sideEffects: "Immune-related adverse events: colitis, hepatitis, pneumonitis, thyroiditis, dermatitis",
        contra: "Autoimmune disease (relative), organ transplant",
        pearl: "First-line for PD-L1 high (>=50%) NSCLC, MSI-H/dMMR tumors. Monitor thyroid function, LFTs. Manage irAEs with corticosteroids."
      },
      {
        name: "Ondansetron (Zofran)",
        type: "5-HT3 Receptor Antagonist",
        action: "Blocks serotonin 5-HT3 receptors in CTZ and vagal afferents preventing chemotherapy-induced emesis",
        sideEffects: "Headache, constipation, QT prolongation (dose-dependent)",
        contra: "Concomitant apomorphine, congenital long QT syndrome",
        pearl: "4-8mg IV/PO q8h. Combine with dexamethasone +/- NK1 antagonist (aprepitant) for highly emetogenic chemo. ECG for QT if multiple doses."
      }
    ],
    pearls: [
      "Cancer Screening by Age/Gender requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Cancer Screening by Age/Gender management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with cancer screening by age/gender. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of cancer screening by age/gender."
      }
    ]
  },
  "preoperative-assessment-np": {
    title: "Preoperative Assessment: Risk Stratification",
    cellular: {
      title: "Pathophysiology of Preoperative Assessment",
      content: "Preoperative Assessment: Risk Stratification involves systematic clinical evaluation skills essential for NP practice. Preoperative Assessment requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for preoperative assessment per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Preoperative Assessment requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Preoperative Assessment management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with preoperative assessment. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of preoperative assessment."
      }
    ]
  },
  "sports-physical-np": {
    title: "Sports Physical Assessment: Cardiac Screening",
    cellular: {
      title: "Pathophysiology of Sports Physical Assessment",
      content: "Sports Physical Assessment: Cardiac Screening involves specific alterations in sports physical assessment physiology. The pathophysiology of Sports Physical Assessment encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of sports physical assessment."
    },
    riskFactors: [
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Tobacco use (pack-year dependent risk calculation)",
      "Coronary artery disease with prior MI or PCI",
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Prior stroke or TIA with residual neurological deficit",
      "Family history of premature CVD (<55 males, <65 females)",
      "Obesity (BMI >30) with metabolic syndrome"
    ],
    diagnostics: [
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "Holter or event monitor for intermittent arrhythmia detection",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "CT angiography of chest for aortic or pulmonary vascular pathology"
    ],
    management: [
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "SGLT2 inhibitor for HF regardless of diabetes status"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      },
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      }
    ],
    pearls: [
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis"
    ],
    quiz: [
      {
        question: "A 65-year-old with sports physical assessment presents with dyspnea, JVD, and bilateral crackles. BNP 850 pg/mL. Which initial intervention is most appropriate?",
        options: [
          "IV furosemide 40mg and continuous monitoring",
          "Immediate cardiac catheterization",
          "Start amiodarone drip",
          "Discharge with PCP follow-up in 2 weeks"
        ],
        correct: 0,
        rationale: "IV furosemide addresses acute volume overload in sports physical assessment with continuous monitoring for response."
      }
    ]
  },
  "chronic-disease-management-plans-np": {
    title: "Chronic Disease Management Plans: CCM Model",
    cellular: {
      title: "Pathophysiology of Chronic Disease Management Plans",
      content: "Chronic Disease Management Plans: CCM Model involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Chronic Disease Management Plans pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for chronic disease management plans",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for chronic disease management plans",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for chronic disease management plans",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of chronic disease management plans",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to chronic disease management plans",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of chronic disease management plans",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for chronic disease management plans. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Chronic Disease Management Plans requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of chronic disease management plans"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with chronic disease management plans. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for chronic disease management plans."
      }
    ]
  },
  "smoking-cessation-np": {
    title: "Smoking Cessation: Pharmacotherapy",
    cellular: {
      title: "Pharmacology of Smoking Cessation",
      content: "Smoking Cessation: Pharmacotherapy encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to smoking cessation."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Smoking Cessation management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to smoking cessation. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "alcohol-use-screening-np": {
    title: "Alcohol Use Screening: AUDIT-C",
    cellular: {
      title: "Pathophysiology of Alcohol Use Screening",
      content: "Alcohol Use Screening: AUDIT-C encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Alcohol Use Screening requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for alcohol use screening per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Alcohol Use Screening requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Alcohol Use Screening management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with alcohol use screening. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of alcohol use screening."
      }
    ]
  },
  "advance-care-planning-np": {
    title: "Advance Care Planning: Goals of Care",
    cellular: {
      title: "Pathophysiology of Advance Care Planning",
      content: "Advance Care Planning: Goals of Care encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Advance Care Planning requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for advance care planning per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Advance Care Planning requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Advance Care Planning management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with advance care planning. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of advance care planning."
      }
    ]
  },
  "ethics-np-practice-np": {
    title: "Ethics: Autonomy & Beneficence",
    cellular: {
      title: "Pathophysiology of Ethics",
      content: "Ethics: Autonomy & Beneficence encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Ethics requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for ethics per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Ethics requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Ethics management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with ethics. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of ethics."
      }
    ]
  },
  "informed-consent-advanced-np": {
    title: "Informed Consent: Capacity",
    cellular: {
      title: "Pathophysiology of Informed Consent",
      content: "Informed Consent: Capacity involves systematic clinical evaluation skills essential for NP practice. Informed Consent requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for informed consent per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Informed Consent requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Informed Consent management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with informed consent. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of informed consent."
      }
    ]
  },
  "eol-pharmacology-np": {
    title: "End-of-Life Pharmacology: Symptom Management",
    cellular: {
      title: "Pharmacology of End-of-Life Pharmacology",
      content: "End-of-Life Pharmacology: Symptom Management encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to end-of-life pharmacology."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "End-of-Life Pharmacology management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to end-of-life pharmacology. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "palliative-sedation-np": {
    title: "Palliative Sedation: Indications & Protocols",
    cellular: {
      title: "Pathophysiology of Palliative Sedation",
      content: "DIC involves systemic activation of coagulation with simultaneous consumption of clotting factors and platelets causing both microvascular thrombosis and hemorrhage. Triggers: sepsis, trauma, malignancy, obstetric complications. Labs: prolonged PT/aPTT, low fibrinogen (<100), elevated D-dimer, thrombocytopenia, schistocytes on smear. Treatment: treat underlying cause, replace with FFP/cryo/platelets if bleeding, heparin only if thrombosis predominates."
    },
    riskFactors: [
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Malignancy with bone marrow infiltration or DIC",
      "Liver disease with coagulopathy and thrombocytopenia",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Chronic disease states causing anemia of inflammation",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)"
    ],
    diagnostics: [
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Reticulocyte count (production index) for bone marrow response",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation"
    ],
    management: [
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Palliative Sedation management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with palliative sedation presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of palliative sedation."
      }
    ]
  },
  "prognostication-np": {
    title: "Prognostication: Tools & Communication",
    cellular: {
      title: "Pathophysiology of Prognostication",
      content: "Prognostication: Tools & Communication involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to prognostication."
    },
    riskFactors: [
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)",
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Crowded living conditions (TB, meningococcal disease)",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "IV drug use with bacteremia risk",
      "Splenectomy with encapsulated organism susceptibility"
    ],
    diagnostics: [
      "Procalcitonin for bacterial infection likelihood",
      "Sensitivity testing for targeted antimicrobial therapy",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "CT with contrast for abscess, collection, or source identification",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)"
    ],
    management: [
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion",
      "Immunization update for preventable infections",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Repeat cultures at 48-72h to document clearance"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Prognostication management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected prognostication has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "hospice-eligibility-np": {
    title: "Hospice Eligibility: LCD Criteria & Referral",
    cellular: {
      title: "Pathophysiology of Hospice Eligibility",
      content: "Hospice Eligibility: LCD Criteria & Referral encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Hospice Eligibility requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for hospice eligibility per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Hospice Eligibility requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Hospice Eligibility management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with hospice eligibility. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of hospice eligibility."
      }
    ]
  },
  "pain-crisis-management-np": {
    title: "Pain Crisis Management: Rapid Titration",
    cellular: {
      title: "Pathophysiology of Pain Crisis Management",
      content: "Pain Crisis Management: Rapid Titration involves reproductive, obstetric, or gynecologic pathophysiology specific to pain crisis management."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for pain crisis management",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Pain Crisis Management management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with pain crisis management. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for pain crisis management."
      }
    ]
  },
  "antibiotic-resistance-np": {
    title: "Antibiotic Resistance: ESBL, CRE",
    cellular: {
      title: "Pathophysiology of Antibiotic Resistance",
      content: "Antibiotic Resistance: ESBL, CRE involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to antibiotic resistance."
    },
    riskFactors: [
      "Chronic liver disease with impaired immune function",
      "Chronic skin breakdown or wounds",
      "Crowded living conditions (TB, meningococcal disease)",
      "Malnutrition with impaired immune cell production",
      "IV drug use with bacteremia risk",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)"
    ],
    diagnostics: [
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "Chest X-ray for pneumonia evaluation",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Urinalysis with urine culture and sensitivity",
      "CT with contrast for abscess, collection, or source identification",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "CRP and ESR for inflammatory response quantification"
    ],
    management: [
      "Infectious disease consultation for complex or resistant infections",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Antibiotic Resistance management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected antibiotic resistance has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "empiric-antibiotic-np": {
    title: "Empiric Antibiotic Selection: Site-Based",
    cellular: {
      title: "Pathophysiology of Empiric Antibiotic Selection",
      content: "Empiric Antibiotic Selection: Site-Based requires understanding of comparative pharmacology, mechanism-based selection, patient-specific factors, and formulary considerations for optimal therapeutic outcomes in empiric antibiotic selection."
    },
    riskFactors: [
      "Multiple comorbidities complicating medication selection",
      "Drug-drug interactions with current regimen",
      "Renal or hepatic impairment requiring dose adjustment",
      "Medication allergies or prior adverse reactions",
      "Cost and insurance formulary restrictions",
      "Patient preferences and adherence barriers",
      "Pregnancy, lactation, or reproductive age considerations"
    ],
    diagnostics: [
      "Review indication, contraindications, and drug interactions",
      "Assess renal and hepatic function for dosing",
      "Check allergy history and cross-reactivity potential",
      "Evaluate current medication list for interactions",
      "Consider patient factors: age, weight, comorbidities, pregnancy status",
      "Review formulary coverage and cost considerations",
      "Assess patient adherence history and preferences"
    ],
    management: [
      "Evidence-based first-line therapy for empiric antibiotic selection per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Symptom response to medication",
        "Adverse effect monitoring",
        "Drug level therapeutic range",
        "Patient adherence assessment"
      ],
      right: [
        "Efficacy comparison with alternatives",
        "Safety profile comparison",
        "Cost-effectiveness analysis",
        "Guideline concordance verification"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Selection Process",
        type: "Clinical Decision Framework",
        action: "Systematic comparison of medications within a class based on efficacy, safety, cost, and patient factors",
        sideEffects: "Analysis paralysis with multiple equivalent options",
        contra: "Ignoring patient-specific factors in selection",
        pearl: "Use decision aids: first-line per guidelines, then adjust for comorbidities, drug interactions, renal/hepatic function, cost, and patient preference. STEPS framework: Safety, Tolerability, Effectiveness, Price, Simplicity."
      },
      {
        name: "Pharmacogenomic Considerations",
        type: "Precision Medicine",
        action: "Genetic testing to predict drug metabolism, efficacy, and adverse reaction risk",
        sideEffects: "Limited evidence for some gene-drug pairs",
        contra: "Relying solely on pharmacogenomics without clinical context",
        pearl: "CPIC guidelines: CYP2D6 for codeine/TCAs, CYP2C19 for clopidogrel/PPIs, HLA-B*5701 for abacavir, HLA-B*1502 for carbamazepine (Asian descent). DPYD for fluoropyrimidines."
      }
    ],
    pearls: [
      "Empiric Antibiotic Selection requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Empiric Antibiotic Selection management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with empiric antibiotic selection. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of empiric antibiotic selection."
      }
    ]
  },
  "hiv-art-np": {
    title: "HIV Management: ART Regimens",
    cellular: {
      title: "Pathophysiology of HIV Management",
      content: "HIV is a retrovirus targeting CD4+ T cells via gp120 binding to CD4 and CCR5/CXCR4 co-receptors. Reverse transcriptase converts RNA to DNA integrated into host genome. CD4 <200 = AIDS. ART: INSTI-based regimen (bictegravir/emtricitabine/TAF) preferred. Start ART on day of diagnosis. PrEP: emtricitabine/TDF or TAF for high-risk individuals. Monitor: CD4 count, viral load, resistance testing."
    },
    riskFactors: [
      "Crowded living conditions (TB, meningococcal disease)",
      "IV drug use with bacteremia risk",
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Chronic skin breakdown or wounds",
      "Splenectomy with encapsulated organism susceptibility",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Age extremes (<2 and >65 years with immature/declining immunity)"
    ],
    diagnostics: [
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "CT with contrast for abscess, collection, or source identification",
      "Sensitivity testing for targeted antimicrobial therapy",
      "Chest X-ray for pneumonia evaluation",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "CRP and ESR for inflammatory response quantification",
      "Wound/tissue/fluid cultures with Gram stain"
    ],
    management: [
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Immunization update for preventable infections",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "Repeat cultures at 48-72h to document clearance",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Isolation precautions: contact, droplet, or airborne based on pathogen"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "HIV Management management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected hiv management has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "tb-management-advanced-np": {
    title: "TB Management: LTBI, Active TB & DOT",
    cellular: {
      title: "Pathophysiology of TB Management",
      content: "Traumatic brain injury classification: Mild (GCS 13-15), Moderate (GCS 9-12), Severe (GCS 3-8). Primary injury: mechanical disruption. Secondary injury: cerebral edema, ischemia, excitotoxicity, inflammation. Management: prevent secondary injury with normothermia, normoglycemia, normocarbia (PaCO2 35-40), ICP monitoring (goal <22 mmHg), CPP maintenance (60-70 mmHg). Hyperosmolar therapy: mannitol 0.25-1g/kg or hypertonic saline 3% (preferred). Surgical decompression for refractory ICP elevation."
    },
    riskFactors: [
      "Condition-specific predisposing factors for tb management",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for tb management",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for tb management",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of tb management",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to tb management",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of tb management",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for tb management. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "TB Management requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of tb management"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with tb management. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for tb management."
      }
    ]
  },
  "septic-arthritis-np": {
    title: "Septic Arthritis: Joint Aspiration",
    cellular: {
      title: "Pathophysiology of Septic Arthritis",
      content: "Septic arthritis is a joint space infection most commonly caused by S. aureus (>50% of cases in adults). Route: hematogenous spread, direct inoculation, or contiguous spread. Presents with acute monoarthritis (knee most common), fever, severe pain with passive ROM. Diagnosis: joint aspiration showing WBC >50,000 with >75% PMNs, positive Gram stain/culture. Synovial lactate >10 mmol/L highly suggestive. Treatment: emergent joint drainage (arthrocentesis or surgical) plus IV antibiotics for 4-6 weeks."
    },
    riskFactors: [
      "Prior joint trauma or overuse",
      "Age 30-50 for RA onset; 15-45 for SLE onset",
      "Medication-induced lupus (hydralazine, procainamide, isoniazid)",
      "Chronic infections triggering reactive arthritis",
      "Female sex (SLE, RA, Sjogren: 9:1 female predominance)",
      "Vitamin D deficiency associated with autoimmune disease risk",
      "Autoimmune disease clustering (thyroid + RA + Sjogren)"
    ],
    diagnostics: [
      "CBC (cytopenias in SLE), CMP, urinalysis (lupus nephritis)",
      "ANA with reflex to specific antibodies (anti-dsDNA, anti-Smith, anti-SSA/SSB)",
      "Complement levels (C3, C4: decreased in active SLE)",
      "Dual-energy CT for tophaceous gout diagnosis",
      "Rheumatoid factor and anti-CCP antibodies for RA",
      "Synovial fluid analysis: WBC count, culture, crystal examination",
      "ANCA panel (c-ANCA/PR3, p-ANCA/MPO) for vasculitis evaluation"
    ],
    management: [
      "Allopurinol for chronic gout (target uric acid <6 mg/dL)",
      "Methotrexate as anchor DMARD for RA (start 15mg/week, max 25mg/week)",
      "Prednisone for acute flares with rapid taper (bridge to DMARD effect)",
      "Bone density screening for chronic corticosteroid use",
      "Hydroxychloroquine 200-400mg daily for SLE (retinal screening annually)",
      "Rituximab for refractory RA or ANCA vasculitis",
      "Cyclophosphamide for severe lupus nephritis (class III/IV) or vasculitis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Joint pain, swelling, morning stiffness >30 minutes",
        "Symmetric polyarthritis (RA) vs asymmetric monoarthritis (gout, septic)",
        "Skin manifestations (malar rash, purpura, rheumatoid nodules)",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Extra-articular features (lung, kidney, eye involvement)",
        "Joint deformities (swan neck, boutonniere, ulnar deviation)",
        "Elevated inflammatory markers (ESR, CRP)",
        "Positive autoantibodies (ANA, RF, anti-CCP, ANCA)"
      ]
    },
    medications: [
      {
        name: "Colchicine (Colcrys)",
        type: "Anti-inflammatory (Tubulin Inhibitor)",
        action: "Inhibits tubulin polymerization disrupting inflammasome assembly, neutrophil chemotaxis, and IL-1beta release",
        sideEffects: "Diarrhea, nausea, vomiting, myelosuppression (rare, dose-related)",
        contra: "Severe renal (reduce dose) or hepatic impairment with concurrent CYP3A4/P-gp inhibitors",
        pearl: "Acute gout: 1.2mg then 0.6mg 1h later (within 36h onset). Prophylaxis: 0.6mg daily-BID. Low-dose is as effective and better tolerated than high-dose."
      },
      {
        name: "Methotrexate",
        type: "Conventional DMARD (Folate Antagonist)",
        action: "Inhibits dihydrofolate reductase and AICAR transformylase; anti-inflammatory via adenosine pathway",
        sideEffects: "Hepatotoxicity, myelosuppression, stomatitis, pneumonitis, teratogenicity",
        contra: "Pregnancy (category X), severe hepatic/renal disease, immunodeficiency, pre-existing blood dyscrasias",
        pearl: "Start 15mg PO/SC weekly with folic acid 1mg daily (reduces side effects). Check CBC, LFTs at baseline, 4 weeks, then q3 months. Takes 6-12 weeks for full effect."
      }
    ],
    pearls: [
      "Morning stiffness >30-60 min = inflammatory arthritis vs OA (<30 min, improves with activity)",
      "Methotrexate requires folic acid co-prescription, CBC/LFT monitoring, and contraception counseling",
      "Septic Arthritis diagnosis requires integration of clinical presentation, labs, imaging, and often rheumatology consultation"
    ],
    quiz: [
      {
        question: "A patient with suspected septic arthritis has joint pain and swelling. Most important next step?",
        options: [
          "Start empiric NSAIDs only",
          "Joint aspiration with synovial fluid analysis plus targeted serologic workup",
          "Immediate high-dose steroids without diagnosis",
          "CT scan of all joints"
        ],
        correct: 1,
        rationale: "Joint aspiration with synovial fluid analysis differentiates infectious, crystal, and inflammatory arthropathies, while targeted serology helps confirm the specific diagnosis of septic arthritis."
      }
    ]
  },
  "osteomyelitis-np": {
    title: "Osteomyelitis: Acute vs Chronic Management",
    cellular: {
      title: "Pathophysiology of Osteomyelitis",
      content: "Osteomyelitis: Acute vs Chronic Management involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to osteomyelitis."
    },
    riskFactors: [
      "Chronic skin breakdown or wounds",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "IV drug use with bacteremia risk",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "Diabetes mellitus with impaired neutrophil function"
    ],
    diagnostics: [
      "Chest X-ray for pneumonia evaluation",
      "CRP and ESR for inflammatory response quantification",
      "CT with contrast for abscess, collection, or source identification",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "Wound/tissue/fluid cultures with Gram stain",
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "CBC with differential (left shift, leukocytosis, lymphopenia)"
    ],
    management: [
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Source control: drainage, debridement, device removal"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Osteomyelitis management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected osteomyelitis has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "meningitis-management-np": {
    title: "Meningitis: Empiric Coverage & Dexamethasone",
    cellular: {
      title: "Pathophysiology of Meningitis",
      content: "Meningitis: Empiric Coverage & Dexamethasone involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Meningitis pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Atrial fibrillation with cardioembolic stroke risk",
      "Sleep deprivation or circadian rhythm disruption",
      "Age >65 with progressive neurodegenerative risk",
      "Obesity and metabolic syndrome with neuroinflammation",
      "Family history of neurological disease (first-degree relative)",
      "Prior CNS infection (increased seizure risk)"
    ],
    diagnostics: [
      "Visual field testing and fundoscopic exam for papilledema",
      "Glasgow Coma Scale (GCS) for consciousness level assessment",
      "Carotid duplex ultrasound for extracranial stenosis",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "Neuropsychological testing for cognitive domain assessment",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)",
      "Genetic testing when hereditary neurological condition suspected"
    ],
    management: [
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Supportive care: HOB elevation 30 degrees, normothermia, euglycemia",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate",
      "Palliative care and goals of care discussion for progressive diseases"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      },
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Meningitis requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with meningitis. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for meningitis."
      }
    ]
  },
  "lyme-disease-np": {
    title: "Lyme Disease: Staging & Doxycycline Protocols",
    cellular: {
      title: "Pathophysiology of Lyme Disease",
      content: "Lyme Disease: Staging & Doxycycline Protocols involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to lyme disease."
    },
    riskFactors: [
      "IV drug use with bacteremia risk",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Splenectomy with encapsulated organism susceptibility",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Malnutrition with impaired immune cell production",
      "Diabetes mellitus with impaired neutrophil function",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)"
    ],
    diagnostics: [
      "CT with contrast for abscess, collection, or source identification",
      "Wound/tissue/fluid cultures with Gram stain",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "CRP and ESR for inflammatory response quantification",
      "Urinalysis with urine culture and sensitivity",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Procalcitonin for bacterial infection likelihood"
    ],
    management: [
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Repeat cultures at 48-72h to document clearance",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Source control: drainage, debridement, device removal",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Lyme Disease management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected lyme disease has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "sti-management-np": {
    title: "STI Management: Syndromic",
    cellular: {
      title: "Pathophysiology of STI Management",
      content: "STI Management: Syndromic involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to sti management."
    },
    riskFactors: [
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "Chronic liver disease with impaired immune function",
      "Diabetes mellitus with impaired neutrophil function",
      "Splenectomy with encapsulated organism susceptibility",
      "Crowded living conditions (TB, meningococcal disease)",
      "Malnutrition with impaired immune cell production",
      "Chronic skin breakdown or wounds"
    ],
    diagnostics: [
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Urinalysis with urine culture and sensitivity",
      "Chest X-ray for pneumonia evaluation"
    ],
    management: [
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Infectious disease consultation for complex or resistant infections",
      "Source control: drainage, debridement, device removal",
      "Repeat cultures at 48-72h to document clearance",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "STI Management management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected sti management has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "oral-candidiasis-np": {
    title: "Oral Candidiasis: Azole Resistance",
    cellular: {
      title: "Pathophysiology of Oral Candidiasis",
      content: "Oral Candidiasis: Azole Resistance involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to oral candidiasis."
    },
    riskFactors: [
      "Chronic liver disease with impaired immune function",
      "Chronic skin breakdown or wounds",
      "Crowded living conditions (TB, meningococcal disease)",
      "Malnutrition with impaired immune cell production",
      "IV drug use with bacteremia risk",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)"
    ],
    diagnostics: [
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "Chest X-ray for pneumonia evaluation",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Urinalysis with urine culture and sensitivity",
      "CT with contrast for abscess, collection, or source identification",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "CRP and ESR for inflammatory response quantification"
    ],
    management: [
      "Infectious disease consultation for complex or resistant infections",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Oral Candidiasis management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected oral candidiasis has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "post-viral-syndromes-np": {
    title: "Post-Viral Syndromes: Long COVID",
    cellular: {
      title: "Pathophysiology of Post-Viral Syndromes",
      content: "Post-Viral Syndromes: Long COVID involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to post-viral syndromes."
    },
    riskFactors: [
      "Crowded living conditions (TB, meningococcal disease)",
      "IV drug use with bacteremia risk",
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Chronic skin breakdown or wounds",
      "Splenectomy with encapsulated organism susceptibility",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Age extremes (<2 and >65 years with immature/declining immunity)"
    ],
    diagnostics: [
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "CT with contrast for abscess, collection, or source identification",
      "Sensitivity testing for targeted antimicrobial therapy",
      "Chest X-ray for pneumonia evaluation",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "CRP and ESR for inflammatory response quantification",
      "Wound/tissue/fluid cultures with Gram stain"
    ],
    management: [
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Immunization update for preventable infections",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "Repeat cultures at 48-72h to document clearance",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Isolation precautions: contact, droplet, or airborne based on pathogen"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Post-Viral Syndromes management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected post-viral syndromes has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "cdiff-recurrence-management-np": {
    title: "C. diff Recurrence: Fidaxomicin",
    cellular: {
      title: "Pathophysiology of C. diff Recurrence",
      content: "C. diff Recurrence: Fidaxomicin involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. C. diff Recurrence pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for c. diff recurrence",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for c. diff recurrence",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for c. diff recurrence",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of c. diff recurrence",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to c. diff recurrence",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of c. diff recurrence",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for c. diff recurrence. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "C. diff Recurrence requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of c. diff recurrence"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with c. diff recurrence. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for c. diff recurrence."
      }
    ]
  },
  "ie-prophylaxis-np": {
    title: "Infective Endocarditis Prophylaxis: AHA",
    cellular: {
      title: "Pathophysiology of Infective Endocarditis Prophylaxis",
      content: "Infective Endocarditis Prophylaxis: AHA involves specific alterations in infective endocarditis prophylaxis physiology. The pathophysiology of Infective Endocarditis Prophylaxis encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of infective endocarditis prophylaxis."
    },
    riskFactors: [
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Prior stroke or TIA with residual neurological deficit",
      "Left ventricular hypertrophy on ECG or echo",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)"
    ],
    diagnostics: [
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "Holter or event monitor for intermittent arrhythmia detection",
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions"
    ],
    management: [
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "CRT for EF <=35% with LBBB and QRS >=150ms"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Amlodipine (Norvasc)",
        type: "Dihydropyridine CCB",
        action: "Blocks L-type calcium channels in vascular smooth muscle causing vasodilation",
        sideEffects: "Peripheral edema (dose-dependent), flushing, headache, gingival hyperplasia",
        contra: "Severe aortic stenosis, cardiogenic shock, unstable angina (use with caution)",
        pearl: "Start 5mg daily, max 10mg. Safe in HFpEF. Edema is dose-related, not allergic."
      },
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      }
    ],
    pearls: [
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF",
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI"
    ],
    quiz: [
      {
        question: "Which diagnostic finding is most specific for acute decompensation in infective endocarditis prophylaxis?",
        options: [
          "Normal chest X-ray",
          "BNP 50 pg/mL",
          "Elevated troponin with ECG changes",
          "Normal echocardiogram"
        ],
        correct: 2,
        rationale: "Elevated troponin with ECG changes indicates myocardial injury requiring urgent evaluation in the context of infective endocarditis prophylaxis."
      }
    ]
  },
  "travel-medicine-np": {
    title: "Travel Medicine: Prophylaxis, Malaria",
    cellular: {
      title: "Pathophysiology of Travel Medicine",
      content: "DIC involves systemic activation of coagulation with simultaneous consumption of clotting factors and platelets causing both microvascular thrombosis and hemorrhage. Triggers: sepsis, trauma, malignancy, obstetric complications. Labs: prolonged PT/aPTT, low fibrinogen (<100), elevated D-dimer, thrombocytopenia, schistocytes on smear. Treatment: treat underlying cause, replace with FFP/cryo/platelets if bleeding, heparin only if thrombosis predominates."
    },
    riskFactors: [
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Chronic kidney disease with decreased erythropoietin",
      "Chemotherapy-induced myelosuppression",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Antiphospholipid syndrome with thrombotic risk",
      "Iron deficiency (most common cause of anemia worldwide)"
    ],
    diagnostics: [
      "Fibrinogen level for DIC or consumption coagulopathy",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "CBC with differential and peripheral blood smear review"
    ],
    management: [
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "Folate supplementation: 1mg PO daily",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      },
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Travel Medicine management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with travel medicine presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of travel medicine."
      }
    ]
  },
  "opportunistic-infections-hiv-np": {
    title: "Opportunistic Infections in HIV: CD4",
    cellular: {
      title: "Pathophysiology of Opportunistic Infections in HIV",
      content: "HIV is a retrovirus targeting CD4+ T cells via gp120 binding to CD4 and CCR5/CXCR4 co-receptors. Reverse transcriptase converts RNA to DNA integrated into host genome. CD4 <200 = AIDS. ART: INSTI-based regimen (bictegravir/emtricitabine/TAF) preferred. Start ART on day of diagnosis. PrEP: emtricitabine/TDF or TAF for high-risk individuals. Monitor: CD4 count, viral load, resistance testing."
    },
    riskFactors: [
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "Chronic liver disease with impaired immune function",
      "Diabetes mellitus with impaired neutrophil function",
      "Splenectomy with encapsulated organism susceptibility",
      "Crowded living conditions (TB, meningococcal disease)",
      "Malnutrition with impaired immune cell production",
      "Chronic skin breakdown or wounds"
    ],
    diagnostics: [
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "Lumbar puncture for CNS infection (meningitis, encephalitis)",
      "Urinalysis with urine culture and sensitivity",
      "Chest X-ray for pneumonia evaluation"
    ],
    management: [
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Infectious disease consultation for complex or resistant infections",
      "Source control: drainage, debridement, device removal",
      "Repeat cultures at 48-72h to document clearance",
      "Post-exposure prophylaxis for HIV, hepatitis B, TB contacts",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Opportunistic Infections in HIV management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected opportunistic infections in hiv has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "mrsa-decolonization-np": {
    title: "MRSA Decolonization: Mupirocin",
    cellular: {
      title: "Pathophysiology of MRSA Decolonization",
      content: "MRSA Decolonization: Mupirocin involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to mrsa decolonization."
    },
    riskFactors: [
      "Malnutrition with impaired immune cell production",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Chronic skin breakdown or wounds",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)"
    ],
    diagnostics: [
      "Urinalysis with urine culture and sensitivity",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "Chest X-ray for pneumonia evaluation",
      "Procalcitonin for bacterial infection likelihood",
      "CRP and ESR for inflammatory response quantification",
      "Sensitivity testing for targeted antimicrobial therapy",
      "Blood cultures x2 sets (before antibiotics) from separate sites"
    ],
    management: [
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Immunization update for preventable infections",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "MRSA Decolonization management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected mrsa decolonization has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "sepsis-management-np": {
    title: "Sepsis: SOFA Scoring, Source Control",
    cellular: {
      title: "Pathophysiology of Sepsis",
      content: "Sepsis is life-threatening organ dysfunction from dysregulated host response to infection (Sepsis-3). qSOFA: AMS, SBP <=100, RR >=22. SOFA score >=2 from baseline. Septic shock: sepsis + vasopressors for MAP >=65 + lactate >2 despite adequate fluid. Hour-1 bundle: blood cultures, lactate, broad-spectrum antibiotics, 30 mL/kg crystalloid for hypotension or lactate >=4. Norepinephrine first-line vasopressor."
    },
    riskFactors: [
      "IV drug use with bacteremia risk",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Splenectomy with encapsulated organism susceptibility",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Malnutrition with impaired immune cell production",
      "Diabetes mellitus with impaired neutrophil function",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)"
    ],
    diagnostics: [
      "CT with contrast for abscess, collection, or source identification",
      "Wound/tissue/fluid cultures with Gram stain",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "CRP and ESR for inflammatory response quantification",
      "Urinalysis with urine culture and sensitivity",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Procalcitonin for bacterial infection likelihood"
    ],
    management: [
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Repeat cultures at 48-72h to document clearance",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Source control: drainage, debridement, device removal",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Sepsis management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected sepsis has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "antibiotic-stewardship-np": {
    title: "Antibiotic Stewardship: PK/PD Optimization",
    cellular: {
      title: "Pathophysiology of Antibiotic Stewardship",
      content: "Antibiotic Stewardship: PK/PD Optimization involves alterations in airway structure, gas exchange, or pulmonary vascular function. Antibiotic Stewardship pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Obesity with restrictive physiology and OSA",
      "Current or former tobacco use (pack-year calculation)",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "Immunocompromised state increasing pneumonia susceptibility",
      "Prior TB exposure or latent TB infection",
      "Age >65 with declining mucociliary clearance"
    ],
    diagnostics: [
      "Pulse oximetry and continuous SpO2 monitoring",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "Bronchoscopy with BAL for diagnostic sampling",
      "Sputum culture, Gram stain, and AFB stain",
      "Polysomnography for sleep-disordered breathing",
      "Peak expiratory flow rate monitoring for asthma"
    ],
    management: [
      "Antibiotic therapy based on local resistance patterns and severity scoring",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "Chest tube placement for pneumothorax or empyema drainage",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "Smoking cessation: varenicline + counseling (most effective combination)",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      },
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Antibiotic Stewardship management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with antibiotic stewardship develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for antibiotic stewardship."
      }
    ]
  },
  "chlamydia-management-np": {
    title: "Chlamydia",
    cellular: {
      title: "Pathophysiology of Chlamydia",
      content: "Chlamydia involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Chlamydia pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for chlamydia",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for chlamydia",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for chlamydia",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of chlamydia",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to chlamydia",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of chlamydia",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for chlamydia. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Chlamydia requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of chlamydia"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with chlamydia. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for chlamydia."
      }
    ]
  },
  "syphilis-management-np": {
    title: "Syphilis",
    cellular: {
      title: "Pathophysiology of Syphilis",
      content: "Syphilis involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Syphilis pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for syphilis",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for syphilis",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for syphilis",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of syphilis",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to syphilis",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of syphilis",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for syphilis. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Syphilis requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of syphilis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with syphilis. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for syphilis."
      }
    ]
  },
  "bacterial-meningitis-np": {
    title: "Bacterial Meningitis",
    cellular: {
      title: "Pathophysiology of Bacterial Meningitis",
      content: "Bacterial Meningitis involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Bacterial Meningitis pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Diabetes with peripheral and autonomic neuropathy",
      "Age >65 with progressive neurodegenerative risk",
      "Hypertension (leading modifiable risk for stroke)",
      "Sleep deprivation or circadian rhythm disruption",
      "Tobacco use with cerebrovascular disease risk",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Atrial fibrillation with cardioembolic stroke risk"
    ],
    diagnostics: [
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "Carotid duplex ultrasound for extracranial stenosis",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Glasgow Coma Scale (GCS) for consciousness level assessment"
    ],
    management: [
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      },
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Bacterial Meningitis requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with bacterial meningitis. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for bacterial meningitis."
      }
    ]
  },
  "prostate-cancer-np": {
    title: "Prostate Cancer",
    cellular: {
      title: "Pathophysiology of Prostate Cancer",
      content: "Prostate Cancer involves malignant transformation through accumulation of genetic mutations (oncogene activation, tumor suppressor loss) driving uncontrolled proliferation. The hallmarks of cancer include sustained proliferative signaling, evading growth suppressors, resisting cell death, enabling replicative immortality, inducing angiogenesis, and activating invasion/metastasis. TNM staging guides prognosis and treatment decisions."
    },
    riskFactors: [
      "Age (strongest risk factor for most cancers)",
      "Tobacco use (dose-dependent carcinogenic exposure)",
      "Family history and inherited cancer syndromes (BRCA, Lynch)",
      "Chronic inflammation or infection (H. pylori, HBV/HCV, HPV)",
      "Environmental carcinogen exposure (asbestos, radiation, benzene)",
      "Immunosuppression (transplant, HIV)",
      "Obesity (associated with 13 cancer types)"
    ],
    diagnostics: [
      "Tissue biopsy with histopathological examination (gold standard)",
      "CT chest/abdomen/pelvis for staging",
      "PET-CT for metabolic activity and metastatic survey",
      "Tumor markers (CEA, PSA, CA-125, AFP, LDH)",
      "Molecular profiling and genomic testing (BRCA, MSI, PD-L1, TMB)",
      "CBC, CMP, LDH for baseline and tumor burden",
      "Age-appropriate cancer screening per USPSTF/ACS guidelines"
    ],
    management: [
      "Evidence-based first-line therapy for prostate cancer per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Unexplained weight loss >10% in 6 months",
        "Persistent fatigue unresponsive to rest",
        "Pain (new onset, progressive)",
        "New mass or lymphadenopathy"
      ],
      right: [
        "B symptoms: fever, night sweats, weight loss",
        "Performance status assessment (ECOG/Karnofsky)",
        "Paraneoplastic syndromes",
        "Evidence of metastatic disease"
      ]
    },
    medications: [
      {
        name: "Pembrolizumab (Keytruda)",
        type: "Anti-PD-1 Checkpoint Inhibitor",
        action: "Blocks PD-1 receptor on T cells restoring anti-tumor immune surveillance",
        sideEffects: "Immune-related adverse events: colitis, hepatitis, pneumonitis, thyroiditis, dermatitis",
        contra: "Autoimmune disease (relative), organ transplant",
        pearl: "First-line for PD-L1 high (>=50%) NSCLC, MSI-H/dMMR tumors. Monitor thyroid function, LFTs. Manage irAEs with corticosteroids."
      },
      {
        name: "Ondansetron (Zofran)",
        type: "5-HT3 Receptor Antagonist",
        action: "Blocks serotonin 5-HT3 receptors in CTZ and vagal afferents preventing chemotherapy-induced emesis",
        sideEffects: "Headache, constipation, QT prolongation (dose-dependent)",
        contra: "Concomitant apomorphine, congenital long QT syndrome",
        pearl: "4-8mg IV/PO q8h. Combine with dexamethasone +/- NK1 antagonist (aprepitant) for highly emetogenic chemo. ECG for QT if multiple doses."
      }
    ],
    pearls: [
      "Prostate Cancer requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Prostate Cancer management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with prostate cancer. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of prostate cancer."
      }
    ]
  },
  "trauma-atls-np": {
    title: "Trauma Assessment: ATLS Primary",
    cellular: {
      title: "Pathophysiology of Trauma Assessment",
      content: "Trauma Assessment: ATLS Primary involves systematic clinical evaluation skills essential for NP practice. Trauma Assessment requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for trauma assessment per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Trauma Assessment requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Trauma Assessment management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with trauma assessment. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of trauma assessment."
      }
    ]
  },
  "massive-transfusion-np": {
    title: "Massive Transfusion Protocol: 1:1:1 Ratio",
    cellular: {
      title: "Pathophysiology of Massive Transfusion Protocol",
      content: "Massive Transfusion Protocol: 1:1:1 Ratio involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to massive transfusion protocol."
    },
    riskFactors: [
      "Malignancy with bone marrow infiltration or DIC",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Chronic disease states causing anemia of inflammation",
      "Chronic kidney disease with decreased erythropoietin",
      "Recent surgery or trauma with blood loss",
      "Antiphospholipid syndrome with thrombotic risk"
    ],
    diagnostics: [
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Reticulocyte count (production index) for bone marrow response",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "Flow cytometry for leukemia/lymphoma immunophenotyping"
    ],
    management: [
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "Folate supplementation: 1mg PO daily",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "Hematology referral for unexplained cytopenias or suspected malignancy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      },
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Massive Transfusion Protocol management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with massive transfusion protocol presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of massive transfusion protocol."
      }
    ]
  },
  "damage-control-resus-np": {
    title: "Damage Control Resuscitation: Permissive",
    cellular: {
      title: "Pathophysiology of Damage Control Resuscitation",
      content: "Damage Control Resuscitation: Permissive involves multi-system pathophysiology requiring integration of knowledge across organ systems for damage control resuscitation."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Damage Control Resuscitation management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with damage control resuscitation arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for damage control resuscitation."
      }
    ]
  },
  "burn-resuscitation-np": {
    title: "Burn Resuscitation: Parkland Formula",
    cellular: {
      title: "Pathophysiology of Burn Resuscitation",
      content: "Burn Resuscitation: Parkland Formula involves multi-system pathophysiology requiring integration of knowledge across organ systems for burn resuscitation."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Burn Resuscitation management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with burn resuscitation arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for burn resuscitation."
      }
    ]
  },
  "crush-injury-np": {
    title: "Crush Injury: Rhabdomyolysis & Hyperkalemia",
    cellular: {
      title: "Pathophysiology of Crush Injury",
      content: "Rhabdomyolysis involves skeletal muscle breakdown releasing myoglobin, CK, potassium, and phosphate into circulation. Myoglobin precipitates in renal tubules causing AKI through direct toxicity, tubular obstruction, and vasoconstriction. CK >5x ULN diagnostic (often >10,000 U/L in severe cases). Treatment: aggressive IV NS at 200-300 mL/hr targeting UOP 200-300 mL/hr. Monitor for hyperkalemia, hypocalcemia, DIC, compartment syndrome."
    },
    riskFactors: [
      "Age >60 with age-related GFR decline",
      "Multiple myeloma with cast nephropathy",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Recurrent UTIs or urinary tract obstruction",
      "Sickle cell disease with papillary necrosis"
    ],
    diagnostics: [
      "Urinalysis with microscopy (casts, crystals, cells)",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "Complement levels (C3, C4) for glomerulonephritis workup"
    ],
    management: [
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Nephrology referral when eGFR <30 or rapidly declining"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Crush Injury management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with crush injury has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "blast-injury-np": {
    title: "Blast Injury: Primary, Secondary & Tertiary",
    cellular: {
      title: "Pathophysiology of Blast Injury",
      content: "Blast injury classification: Primary (barotrauma from pressure wave: TM rupture, blast lung, intestinal perforation), Secondary (penetrating injuries from projectiles/debris), Tertiary (blunt trauma from body displacement), Quaternary (burns, crush, inhalation, radiation). Blast lung: bilateral pulmonary hemorrhage and pneumothoraces - avoid positive pressure ventilation if possible. All blast-exposed patients need TM evaluation and serial abdominal exams."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Blast Injury management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with blast injury arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for blast injury."
      }
    ]
  },
  "hypothermia-management-np": {
    title: "Hypothermia Management: Rewarming Strategies",
    cellular: {
      title: "Pathophysiology of Hypothermia Management",
      content: "Hypothermia Management: Rewarming Strategies involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Hypothermia Management pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for hypothermia management",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for hypothermia management",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for hypothermia management",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of hypothermia management",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to hypothermia management",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of hypothermia management",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for hypothermia management. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Hypothermia Management requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of hypothermia management"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with hypothermia management. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for hypothermia management."
      }
    ]
  },
  "drowning-management-np": {
    title: "Drowning Management: Pulmonary",
    cellular: {
      title: "Pathophysiology of Drowning Management",
      content: "Drowning Management: Pulmonary involves alterations in airway structure, gas exchange, or pulmonary vascular function. Drowning Management pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Indoor air pollution and biomass fuel exposure",
      "Prematurity with bronchopulmonary dysplasia history",
      "Connective tissue disease with ILD predisposition",
      "Obesity with restrictive physiology and OSA",
      "Family history of alpha-1 antitrypsin deficiency",
      "Age >65 with declining mucociliary clearance",
      "Childhood asthma with persistent airway hyperreactivity"
    ],
    diagnostics: [
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "Thoracentesis with Light criteria for pleural effusion classification",
      "6-minute walk test for functional capacity assessment",
      "Pulse oximetry and continuous SpO2 monitoring",
      "CT chest high-resolution for interstitial/parenchymal disease",
      "Peak expiratory flow rate monitoring for asthma",
      "CT pulmonary angiography for PE evaluation"
    ],
    management: [
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "Inhaler technique assessment and spacer use education",
      "Step-up/step-down approach based on asthma control assessment",
      "Antibiotic therapy based on local resistance patterns and severity scoring",
      "LAMA (tiotropium 18mcg daily) for COPD maintenance",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      },
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Drowning Management management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with drowning management develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for drowning management."
      }
    ]
  },
  "acetaminophen-od-np": {
    title: "Acetaminophen Overdose: NAC Protocol",
    cellular: {
      title: "Pharmacology of Acetaminophen Overdose",
      content: "Acetaminophen overdose causes hepatotoxicity via NAPQI (toxic metabolite normally conjugated by glutathione). Toxic dose: >150mg/kg or >7.5g in adults. Rumack-Matthew nomogram guides treatment starting 4h post-ingestion. N-acetylcysteine (NAC) is the antidote: replenishes glutathione. Most effective within 8h but beneficial up to 24h+. IV protocol: 150mg/kg over 1h, then 50mg/kg over 4h, then 100mg/kg over 16h. Monitor AST/ALT, INR, creatinine, lactate for hepatic injury. King's College Criteria guide transplant referral."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Acetaminophen Overdose management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to acetaminophen overdose. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "aspirin-od-np": {
    title: "Aspirin Overdose: Alkalinization & Dialysis",
    cellular: {
      title: "Pathophysiology of Aspirin Overdose",
      content: "Aspirin Overdose: Alkalinization & Dialysis involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to aspirin overdose."
    },
    riskFactors: [
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Recurrent UTIs or urinary tract obstruction",
      "Multiple myeloma with cast nephropathy",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Sickle cell disease with papillary necrosis",
      "IV contrast administration (contrast-induced nephropathy)",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)"
    ],
    diagnostics: [
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "CBC for anemia of CKD evaluation"
    ],
    management: [
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Aspirin Overdose management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with aspirin overdose has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "opioid-od-np": {
    title: "Opioid Overdose: Naloxone Dosing & Monitoring",
    cellular: {
      title: "Pharmacology of Opioid Overdose",
      content: "Opioid Overdose: Naloxone Dosing & Monitoring encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to opioid overdose."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Opioid Overdose management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to opioid overdose. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "altered-mental-status-algorithm-np": {
    title: "Altered Mental Status Algorithm: AEIOU-TIPS",
    cellular: {
      title: "Pathophysiology of Altered Mental Status Algorithm",
      content: "Altered Mental Status Algorithm: AEIOU-TIPS involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Altered Mental Status Algorithm pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "IBD family history (10-25% have affected first-degree relative)",
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "NSAID use >2 weeks without gastroprotection",
      "Tobacco use (impairs mucosal healing)",
      "History of C. difficile infection (recurrence risk 20%)",
      "Family history of GI malignancy (first-degree relative)",
      "Prior abdominal surgery with adhesion formation"
    ],
    diagnostics: [
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "MRCP for biliary and pancreatic duct evaluation",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "EGD with biopsy for upper GI pathology evaluation",
      "Capsule endoscopy for obscure small bowel bleeding"
    ],
    management: [
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to altered mental status algorithm)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Altered Mental Status Algorithm evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of altered mental status algorithm"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with altered mental status algorithm. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for altered mental status algorithm."
      }
    ]
  },
  "chest-pain-workup-np": {
    title: "Chest Pain Workup: ACS Rule-Out",
    cellular: {
      title: "Pathophysiology of Chest Pain Workup",
      content: "Chest Pain Workup: ACS Rule-Out involves specific alterations in chest pain workup physiology. The pathophysiology of Chest Pain Workup encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of chest pain workup."
    },
    riskFactors: [
      "Coronary artery disease with prior MI or PCI",
      "Prior stroke or TIA with residual neurological deficit",
      "Obesity (BMI >30) with metabolic syndrome",
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Sedentary lifestyle with deconditioning",
      "Peripheral artery disease (ABI <0.9)",
      "Heavy alcohol use (>14 drinks/week males, >7 females)"
    ],
    diagnostics: [
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "Holter or event monitor for intermittent arrhythmia detection",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "Ankle-brachial index for peripheral vascular disease screening",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "Coagulation studies: PT/INR, aPTT, D-dimer"
    ],
    management: [
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Lisinopril (Zestril/Prinivil)",
        type: "ACE Inhibitor",
        action: "Inhibits ACE converting angiotensin I to II; reduces preload, afterload, and cardiac remodeling",
        sideEffects: "Dry cough (10-15%), hyperkalemia, angioedema (0.1-0.7%), acute kidney injury",
        contra: "History of ACEi angioedema, bilateral renal artery stenosis, pregnancy",
        pearl: "Start 5-10mg daily, titrate to 20-40mg. Check K+ and Cr within 1-2 weeks of initiation."
      },
      {
        name: "Atorvastatin (Lipitor)",
        type: "HMG-CoA Reductase Inhibitor",
        action: "Inhibits cholesterol synthesis, upregulates LDL receptors; pleiotropic anti-inflammatory and plaque-stabilizing effects",
        sideEffects: "Myalgia, elevated transaminases, new-onset diabetes",
        contra: "Active liver disease, pregnancy, unexplained persistent LFT elevation",
        pearl: "High-intensity: 40-80mg daily. Reduces LDL by 50%. Check CK only if symptomatic myopathy."
      }
    ],
    pearls: [
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids"
    ],
    quiz: [
      {
        question: "A patient with history of chest pain workup has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "abdominal-pain-algorithm-np": {
    title: "Abdominal Pain Algorithm: Surgical vs Medical",
    cellular: {
      title: "Pathophysiology of Abdominal Pain Algorithm",
      content: "DIC involves systemic activation of coagulation with simultaneous consumption of clotting factors and platelets causing both microvascular thrombosis and hemorrhage. Triggers: sepsis, trauma, malignancy, obstetric complications. Labs: prolonged PT/aPTT, low fibrinogen (<100), elevated D-dimer, thrombocytopenia, schistocytes on smear. Treatment: treat underlying cause, replace with FFP/cryo/platelets if bleeding, heparin only if thrombosis predominates."
    },
    riskFactors: [
      "Chemotherapy-induced myelosuppression",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Chronic kidney disease with decreased erythropoietin",
      "Malignancy with bone marrow infiltration or DIC",
      "Iron deficiency (most common cause of anemia worldwide)",
      "Chronic disease states causing anemia of inflammation"
    ],
    diagnostics: [
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "CBC with differential and peripheral blood smear review",
      "Reticulocyte count (production index) for bone marrow response"
    ],
    management: [
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "Folate supplementation: 1mg PO daily",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      },
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Abdominal Pain Algorithm management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with abdominal pain algorithm presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of abdominal pain algorithm."
      }
    ]
  },
  "syncope-emergency-workup-np": {
    title: "Syncope Emergency Workup: San Francisco Rule",
    cellular: {
      title: "Pathophysiology of Syncope Emergency Workup",
      content: "Syncope Emergency Workup: San Francisco Rule involves specific alterations in syncope emergency workup physiology. The pathophysiology of Syncope Emergency Workup encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of syncope emergency workup."
    },
    riskFactors: [
      "Peripheral artery disease (ABI <0.9)",
      "Age >65 with cardiovascular degeneration",
      "History of preeclampsia or gestational hypertension",
      "Chronic hypertension with end-organ damage",
      "Chronic kidney disease (eGFR <60 mL/min)",
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Dyslipidemia (LDL >130 despite lifestyle modification)"
    ],
    diagnostics: [
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "HbA1c for glycemic control assessment in diabetic patients",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)",
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "CBC with differential (anemia worsens cardiac ischemia)"
    ],
    management: [
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "Loop diuretics titrated to euvolemia based on daily weights",
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Atorvastatin (Lipitor)",
        type: "HMG-CoA Reductase Inhibitor",
        action: "Inhibits cholesterol synthesis, upregulates LDL receptors; pleiotropic anti-inflammatory and plaque-stabilizing effects",
        sideEffects: "Myalgia, elevated transaminases, new-onset diabetes",
        contra: "Active liver disease, pregnancy, unexplained persistent LFT elevation",
        pearl: "High-intensity: 40-80mg daily. Reduces LDL by 50%. Check CK only if symptomatic myopathy."
      },
      {
        name: "Amlodipine (Norvasc)",
        type: "Dihydropyridine CCB",
        action: "Blocks L-type calcium channels in vascular smooth muscle causing vasodilation",
        sideEffects: "Peripheral edema (dose-dependent), flushing, headache, gingival hyperplasia",
        contra: "Severe aortic stenosis, cardiogenic shock, unstable angina (use with caution)",
        pearl: "Start 5mg daily, max 10mg. Safe in HFpEF. Edema is dose-related, not allergic."
      }
    ],
    pearls: [
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise",
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF",
      "Target LDL <70 mg/dL for established ASCVD (consider <55 for very high risk)"
    ],
    quiz: [
      {
        question: "A 58-year-old with syncope emergency workup has LDL 145, diabetes, and HTN. Best lipid management?",
        options: [
          "Lifestyle modification only for 6 months",
          "Moderate-intensity statin",
          "High-intensity statin (atorvastatin 40-80mg)",
          "Ezetimibe monotherapy"
        ],
        correct: 2,
        rationale: "With multiple ASCVD risk factors and syncope emergency workup, high-intensity statin therapy is indicated per ACC/AHA guidelines."
      }
    ]
  },
  "acute-visual-loss-np": {
    title: "Acute Visual Loss Workup: CRAO, GCA",
    cellular: {
      title: "Pathophysiology of Acute Visual Loss Workup",
      content: "Acute Visual Loss Workup: CRAO, GCA involves multi-system pathophysiology requiring integration of knowledge across organ systems for acute visual loss workup."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Acute Visual Loss Workup management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with acute visual loss workup arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for acute visual loss workup."
      }
    ]
  },
  "acute-testicular-pain-np": {
    title: "Acute Testicular Pain: Torsion vs",
    cellular: {
      title: "Pathophysiology of Acute Testicular Pain",
      content: "Acute Testicular Pain: Torsion vs involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to acute testicular pain."
    },
    riskFactors: [
      "Chronic skin breakdown or wounds",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "IV drug use with bacteremia risk",
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "Diabetes mellitus with impaired neutrophil function"
    ],
    diagnostics: [
      "Chest X-ray for pneumonia evaluation",
      "CRP and ESR for inflammatory response quantification",
      "CT with contrast for abscess, collection, or source identification",
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "Wound/tissue/fluid cultures with Gram stain",
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "CBC with differential (left shift, leukocytosis, lymphopenia)"
    ],
    management: [
      "Antifungal therapy: fluconazole, caspofungin, or amphotericin B based on risk",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Source control: drainage, debridement, device removal"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Acute Testicular Pain management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected acute testicular pain has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "toxicology-screening-approach-np": {
    title: "Toxicology Screening Approach: Toxidromes",
    cellular: {
      title: "Pathophysiology of Toxicology Screening Approach",
      content: "Toxicology Screening Approach: Toxidromes involves multi-system pathophysiology requiring integration of knowledge across organ systems for toxicology screening approach."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Toxicology Screening Approach management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with toxicology screening approach arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for toxicology screening approach."
      }
    ]
  },
  "acute-low-back-pain-algorithm-np": {
    title: "Acute Low Back Pain Algorithm: Red Flags",
    cellular: {
      title: "Pharmacology of Acute Low Back Pain Algorithm",
      content: "Acute Low Back Pain Algorithm: Red Flags encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to acute low back pain algorithm."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Acute Low Back Pain Algorithm management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to acute low back pain algorithm. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "polypharmacy-deprescribing-np": {
    title: "Polypharmacy: Deprescribing Frameworks",
    cellular: {
      title: "Pharmacology of Polypharmacy",
      content: "Polypharmacy: Deprescribing Frameworks encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to polypharmacy."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Polypharmacy management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to polypharmacy. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "beers-criteria-np": {
    title: "Beers Criteria: Potentially Inappropriate",
    cellular: {
      title: "Pharmacology of Beers Criteria",
      content: "Beers Criteria: Potentially Inappropriate encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to beers criteria."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Beers Criteria management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to beers criteria. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "delirium-dementia-advanced-np": {
    title: "Delirium vs Dementia: Advanced",
    cellular: {
      title: "Pathophysiology of Delirium vs Dementia",
      content: "Delirium vs Dementia: Advanced involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Delirium vs Dementia pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Obesity and metabolic syndrome with neuroinflammation",
      "Sleep deprivation or circadian rhythm disruption",
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Hypertension (leading modifiable risk for stroke)",
      "Prior CNS infection (increased seizure risk)",
      "Prior head trauma or TBI history",
      "Age >65 with progressive neurodegenerative risk"
    ],
    diagnostics: [
      "Neuropsychological testing for cognitive domain assessment",
      "Carotid duplex ultrasound for extracranial stenosis",
      "MRA or CTA for intracranial vascular evaluation",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "Genetic testing when hereditary neurological condition suspected",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)"
    ],
    management: [
      "Supportive care: HOB elevation 30 degrees, normothermia, euglycemia",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Palliative care and goals of care discussion for progressive diseases",
      "Blood pressure management per AHA stroke guidelines",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      },
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Delirium vs Dementia requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with delirium vs dementia. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for delirium vs dementia."
      }
    ]
  },
  "falls-prevention-np": {
    title: "Falls Prevention: Evidence-Based",
    cellular: {
      title: "Pathophysiology of Falls Prevention",
      content: "Falls Prevention: Evidence-Based encompasses the professional, ethical, and regulatory frameworks guiding advanced practice nursing. Falls Prevention requires understanding of NP scope of practice, prescriptive authority, collaborative practice agreements, documentation standards, and quality improvement methodologies."
    },
    riskFactors: [
      "Inadequate documentation leading to liability exposure",
      "Scope of practice violations and regulatory non-compliance",
      "Communication failures in interprofessional teams",
      "Cultural insensitivity affecting patient trust and outcomes",
      "Implicit bias in clinical decision-making",
      "Burnout and compassion fatigue affecting clinical judgment",
      "Failure to obtain informed consent properly",
      "HIPAA violations and privacy breaches",
      "Prescriptive authority limitations misunderstanding",
      "Inadequate continuing education and competency gaps"
    ],
    diagnostics: [
      "State nurse practice act and regulatory requirements review",
      "Scope of practice analysis and collaborative practice agreements",
      "Documentation audit and compliance assessment",
      "Quality metrics and patient outcome tracking",
      "Cultural competency self-assessment tools",
      "Continuing education requirements and certification tracking",
      "Risk management and malpractice prevention review"
    ],
    management: [
      "Evidence-based first-line therapy for falls prevention per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Scope of practice compliance",
        "Documentation quality and completeness",
        "Patient communication effectiveness",
        "Cultural competency indicators"
      ],
      right: [
        "Quality metric performance (HEDIS, CMS)",
        "Patient satisfaction measures",
        "Prescriptive authority compliance",
        "Interprofessional collaboration effectiveness"
      ]
    },
    medications: [
      {
        name: "Evidence-Based Practice Standards",
        type: "Professional Framework",
        action: "Integration of research evidence, clinical expertise, and patient values in decision-making",
        sideEffects: "Implementation barriers in resource-limited settings",
        contra: "Rigid protocol adherence without clinical judgment",
        pearl: "ANCC Magnet Recognition Program values EBP integration. Use Plan-Do-Study-Act (PDSA) cycles for quality improvement. Document clinical reasoning in assessment/plan."
      },
      {
        name: "Ethical Decision-Making Framework",
        type: "Professional Standard",
        action: "Systematic approach to ethical dilemmas using principles of autonomy, beneficence, non-maleficence, and justice",
        sideEffects: "Principle conflicts requiring ethical committee consultation",
        contra: "Unilateral decisions on complex ethical issues without team input",
        pearl: "ANA Code of Ethics guides NP practice. Advance directive discussions should occur before crisis. Ethics committee consultation available for unresolvable conflicts."
      }
    ],
    pearls: [
      "Falls Prevention requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Falls Prevention management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with falls prevention. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of falls prevention."
      }
    ]
  },
  "pressure-injury-prevention-np": {
    title: "Pressure Injury Prevention: Braden & Bundles",
    cellular: {
      title: "Pathophysiology of Pressure Injury Prevention",
      content: "Pressure Injury Prevention: Braden & Bundles involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to pressure injury prevention."
    },
    riskFactors: [
      "Recurrent UTIs or urinary tract obstruction",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Sickle cell disease with papillary necrosis",
      "IV contrast administration (contrast-induced nephropathy)",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Hypertension (second leading cause of CKD)",
      "Age >60 with age-related GFR decline"
    ],
    diagnostics: [
      "24-hour urine collection for proteinuria quantification and CrCl",
      "CBC for anemia of CKD evaluation",
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "Urinalysis with microscopy (casts, crystals, cells)"
    ],
    management: [
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Pressure Injury Prevention management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with pressure injury prevention has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "urinary-incontinence-np": {
    title: "Urinary Incontinence: Types & Management",
    cellular: {
      title: "Pathophysiology of Urinary Incontinence",
      content: "Urinary Incontinence: Types & Management involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Urinary Incontinence pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for urinary incontinence",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for urinary incontinence",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for urinary incontinence",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of urinary incontinence",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to urinary incontinence",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of urinary incontinence",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for urinary incontinence. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Urinary Incontinence requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of urinary incontinence"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with urinary incontinence. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for urinary incontinence."
      }
    ]
  },
  "osteoporosis-advanced-np": {
    title: "Osteoporosis: FRAX, Bisphosphonates",
    cellular: {
      title: "Pathophysiology of Osteoporosis",
      content: "Osteoporosis: FRAX, Bisphosphonates involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to osteoporosis."
    },
    riskFactors: [
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "IV contrast administration (contrast-induced nephropathy)",
      "Recurrent UTIs or urinary tract obstruction",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Hypertension (second leading cause of CKD)"
    ],
    diagnostics: [
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "CBC for anemia of CKD evaluation",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)"
    ],
    management: [
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Osteoporosis management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with osteoporosis has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "multimodal-analgesia-np": {
    title: "Multimodal Analgesia: Synergistic",
    cellular: {
      title: "Pathophysiology of Multimodal Analgesia",
      content: "Multimodal Analgesia: Synergistic involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to multimodal analgesia."
    },
    riskFactors: [
      "IV drug use with bacteremia risk",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Splenectomy with encapsulated organism susceptibility",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Malnutrition with impaired immune cell production",
      "Diabetes mellitus with impaired neutrophil function",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)"
    ],
    diagnostics: [
      "CT with contrast for abscess, collection, or source identification",
      "Wound/tissue/fluid cultures with Gram stain",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "CRP and ESR for inflammatory response quantification",
      "Urinalysis with urine culture and sensitivity",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Procalcitonin for bacterial infection likelihood"
    ],
    management: [
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Repeat cultures at 48-72h to document clearance",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Source control: drainage, debridement, device removal",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Multimodal Analgesia management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected multimodal analgesia has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "regional-anesthesia-np": {
    title: "Regional Anesthesia: Nerve Blocks & Epidural",
    cellular: {
      title: "Pathophysiology of Regional Anesthesia",
      content: "Regional Anesthesia: Nerve Blocks & Epidural involves reproductive, obstetric, or gynecologic pathophysiology specific to regional anesthesia."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for regional anesthesia",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Regional Anesthesia management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with regional anesthesia. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for regional anesthesia."
      }
    ]
  },
  "ketamine-infusion-np": {
    title: "Ketamine Infusion: Sub-Anesthetic Protocols",
    cellular: {
      title: "Pharmacology of Ketamine Infusion",
      content: "Sub-anesthetic ketamine infusion for refractory pain or treatment-resistant depression. Mechanism: NMDA receptor antagonist, also modulates opioid receptors, monoamine systems, and mTOR pathway (neuroplasticity). Pain dosing: 0.1-0.5 mg/kg/hr IV continuous infusion. Depression dosing: 0.5 mg/kg IV over 40 minutes (or intranasal esketamine/Spravato). Monitoring: continuous cardiorespiratory monitoring, blood pressure q15min, dissociative symptoms assessment. Side effects: dissociation, nausea, hypertension, laryngospasm (rare). Contraindicated in uncontrolled hypertension, elevated ICP, psychotic disorders."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Ketamine Infusion management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to ketamine infusion. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "pca-management-np": {
    title: "PCA Management: Programming & Safety",
    cellular: {
      title: "Pathophysiology of PCA Management",
      content: "PCA Management: Programming & Safety involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. PCA Management pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for pca management",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for pca management",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for pca management",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of pca management",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to pca management",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of pca management",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for pca management. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "PCA Management requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of pca management"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with pca management. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for pca management."
      }
    ]
  },
  "neuropathic-pain-np": {
    title: "Neuropathic Pain: Gabapentinoids & TCAs",
    cellular: {
      title: "Pathophysiology of Neuropathic Pain",
      content: "Neuropathic Pain: Gabapentinoids & TCAs involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Neuropathic Pain pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Occupational toxin exposure (heavy metals, organophosphates)",
      "Tobacco use with cerebrovascular disease risk",
      "Atrial fibrillation with cardioembolic stroke risk",
      "Prior CNS infection (increased seizure risk)",
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Hypertension (leading modifiable risk for stroke)",
      "Obesity and metabolic syndrome with neuroinflammation"
    ],
    diagnostics: [
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "Glasgow Coma Scale (GCS) for consciousness level assessment",
      "Genetic testing when hereditary neurological condition suspected",
      "Visual field testing and fundoscopic exam for papilledema",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "Neuropsychological testing for cognitive domain assessment"
    ],
    management: [
      "Seizure precautions and driving restriction counseling",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)",
      "Palliative care and goals of care discussion for progressive diseases",
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Supportive care: HOB elevation 30 degrees, normothermia, euglycemia"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      },
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Neuropathic Pain requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with neuropathic pain. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for neuropathic pain."
      }
    ]
  },
  "chronic-pain-assessment-np": {
    title: "Chronic Pain Assessment: Functional",
    cellular: {
      title: "Pathophysiology of Chronic Pain Assessment",
      content: "Chronic Pain Assessment: Functional involves systematic clinical evaluation skills essential for NP practice. Chronic Pain Assessment requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for chronic pain assessment per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Chronic Pain Assessment requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Chronic Pain Assessment management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with chronic pain assessment. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of chronic pain assessment."
      }
    ]
  },
  "opioid-tapering-np": {
    title: "Opioid Tapering: CDC Guidelines & Strategies",
    cellular: {
      title: "Pharmacology of Opioid Tapering",
      content: "Opioid tapering follows CDC Clinical Practice Guideline (2022). Taper rate: reduce 5-10% of original dose per month (slower = better tolerated). For patients on high doses (>90 MME/day): consider more gradual taper, buprenorphine transition, or referral to pain/addiction specialist. Interdisciplinary approach: non-opioid pain management (acetaminophen, NSAIDs, gabapentinoids, duloxetine, PT, CBT for pain), mental health support, and monitoring for withdrawal symptoms and worsening pain. Never abruptly discontinue in dependent patients."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Opioid Tapering management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to opioid tapering. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "comprehensive-hpi-np": {
    title: "Comprehensive History and Physical (H&P)",
    cellular: {
      title: "Pathophysiology of Comprehensive History and Physical (H&P)",
      content: "Comprehensive History and Physical (H&P) involves systematic clinical evaluation skills essential for NP practice. Comprehensive History and Physical (H&P) requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for comprehensive history and physical (h&p) per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Comprehensive History and Physical (H&P) requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Comprehensive History and Physical (H&P) management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with comprehensive history and physical (h&p). Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of comprehensive history and physical (h&p)."
      }
    ]
  },
  "differential-diagnosis-np": {
    title: "Differential Diagnosis Formulation",
    cellular: {
      title: "Pathophysiology of Differential Diagnosis Formulation",
      content: "Differential Diagnosis Formulation involves systematic clinical evaluation skills essential for NP practice. Differential Diagnosis Formulation requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for differential diagnosis formulation per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Differential Diagnosis Formulation requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Differential Diagnosis Formulation management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with differential diagnosis formulation. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of differential diagnosis formulation."
      }
    ]
  },
  "clinical-reasoning-np": {
    title: "Clinical Reasoning and Decision-Making",
    cellular: {
      title: "Pathophysiology of Clinical Reasoning and Decision-Making",
      content: "AKI KDIGO staging: Stage 1 (Cr 1.5-1.9x baseline or >=0.3 increase in 48h), Stage 2 (2-2.9x), Stage 3 (>=3x or Cr >4.0 or dialysis initiation). Prerenal (60-70%): decreased perfusion (FENa <1%, BUN:Cr >20:1). Intrinsic (25-30%): ATN (muddy brown casts, FENa >2%), GN (RBC casts), AIN (eosinophils, WBC casts). Postrenal (5-10%): obstruction (hydronephrosis on ultrasound)."
    },
    riskFactors: [
      "Sickle cell disease with papillary necrosis",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Volume depletion from any cause",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Age >60 with age-related GFR decline",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)"
    ],
    diagnostics: [
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "CBC for anemia of CKD evaluation",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)"
    ],
    management: [
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Clinical Reasoning and Decision-Making management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with clinical reasoning and decision-making has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "evidence-based-assessment-np": {
    title: "Evidence-Based Assessment Practice",
    cellular: {
      title: "Pathophysiology of Evidence-Based Assessment Practice",
      content: "Evidence-Based Assessment Practice involves systematic clinical evaluation skills essential for NP practice. Evidence-Based Assessment Practice requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for evidence-based assessment practice per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Evidence-Based Assessment Practice requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Evidence-Based Assessment Practice management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with evidence-based assessment practice. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of evidence-based assessment practice."
      }
    ]
  },
  "advanced-cardiac-auscultation-np": {
    title: "Cardiac Auscultation (Murmurs, Gallops",
    cellular: {
      title: "Pathophysiology of Cardiac Auscultation (Murmurs, Gallops",
      content: "Cardiac Auscultation (Murmurs, Gallops involves specific alterations in cardiac auscultation (murmurs, gallops physiology. The pathophysiology of Cardiac Auscultation (Murmurs, Gallops encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of cardiac auscultation (murmurs, gallops."
    },
    riskFactors: [
      "Family history of premature CVD (<55 males, <65 females)",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Peripheral artery disease (ABI <0.9)",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Age >65 with cardiovascular degeneration",
      "Sedentary lifestyle with deconditioning",
      "History of preeclampsia or gestational hypertension"
    ],
    diagnostics: [
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Ankle-brachial index for peripheral vascular disease screening",
      "HbA1c for glycemic control assessment in diabetic patients"
    ],
    management: [
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "Referral for surgical intervention when medical therapy insufficient",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      },
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      }
    ],
    pearls: [
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise"
    ],
    quiz: [
      {
        question: "A patient with history of cardiac auscultation (murmurs, gallops has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "ecg-advanced-np": {
    title: "12-Lead ECG: Advanced Interpretation",
    cellular: {
      title: "Pathophysiology of 12-Lead ECG",
      content: "12-Lead ECG: Advanced Interpretation involves systematic interpretation of laboratory values, imaging studies, and diagnostic procedures essential for clinical decision-making in 12-lead ecg. Understanding sensitivity, specificity, positive and negative predictive values guides test selection and result interpretation."
    },
    riskFactors: [
      "Pre-analytical errors (specimen handling, timing, patient preparation)",
      "Interfering substances (hemolysis, lipemia, medications)",
      "Reference range variations by age, sex, and ethnicity",
      "Test selection bias and overtesting",
      "Failure to correlate results with clinical context",
      "Delayed specimen processing affecting accuracy",
      "Patient factors: fasting status, hydration, circadian variation"
    ],
    diagnostics: [
      "Appropriate test selection based on pre-test probability",
      "Proper specimen collection and handling protocols",
      "Reference range application with patient-specific adjustments",
      "Serial trending of values for clinical significance",
      "Sensitivity/specificity consideration for screening vs confirmatory tests",
      "Correlation of laboratory results with clinical presentation",
      "Critical value identification and urgent communication"
    ],
    management: [
      "Evidence-based first-line therapy for 12-lead ecg per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Normal vs abnormal value identification",
        "Trending analysis over time",
        "Clinical correlation with symptoms",
        "Pre-test probability assessment"
      ],
      right: [
        "Critical value recognition and response",
        "Sensitivity and specificity interpretation",
        "False positive and false negative consideration",
        "Cost-effective test ordering strategy"
      ]
    },
    medications: [
      {
        name: "Laboratory Test Interpretation Framework",
        type: "Diagnostic Tool",
        action: "Systematic approach to interpreting lab values within clinical context including pre-analytical, analytical, and post-analytical phases",
        sideEffects: "Over-reliance on lab values without clinical correlation",
        contra: "Treating lab numbers in isolation from clinical presentation",
        pearl: "Always correlate labs with clinical picture. Know common interferences: hemolysis (falsely elevated K+, LDH), biotin (falsely decreased troponin, TSH), lipemia (falsely decreased sodium)."
      },
      {
        name: "Imaging Selection Guidelines",
        type: "Diagnostic Decision Support",
        action: "Evidence-based imaging selection using ACR Appropriateness Criteria to guide modality choice by clinical scenario",
        sideEffects: "Radiation exposure concerns with CT studies",
        contra: "Contrast administration in severe renal impairment or allergy without premedication",
        pearl: "ACR Appropriateness Criteria guide imaging selection. CT with contrast: hold metformin 48h if eGFR <30. MRI: screen for metallic implants. Ultrasound: no radiation, excellent for pregnant patients. Choose wisely: avoid unnecessary imaging."
      }
    ],
    pearls: [
      "12-Lead ECG requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "12-Lead ECG management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with 12-lead ecg. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of 12-lead ecg."
      }
    ]
  },
  "hemodynamic-monitoring-np": {
    title: "Hemodynamic Monitoring: Waveform Analysis",
    cellular: {
      title: "Pathophysiology of Hemodynamic Monitoring",
      content: "Hemodynamic Monitoring: Waveform Analysis involves specific alterations in hemodynamic monitoring physiology. The pathophysiology of Hemodynamic Monitoring encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of hemodynamic monitoring."
    },
    riskFactors: [
      "Tobacco use (pack-year dependent risk calculation)",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Prior stroke or TIA with residual neurological deficit",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Coronary artery disease with prior MI or PCI",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Sedentary lifestyle with deconditioning"
    ],
    diagnostics: [
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Holter or event monitor for intermittent arrhythmia detection",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "Ankle-brachial index for peripheral vascular disease screening"
    ],
    management: [
      "Beta-blocker titration to resting HR 60-70 bpm",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Referral for surgical intervention when medical therapy insufficient",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      },
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      }
    ],
    pearls: [
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis"
    ],
    quiz: [
      {
        question: "A 65-year-old with hemodynamic monitoring presents with dyspnea, JVD, and bilateral crackles. BNP 850 pg/mL. Which initial intervention is most appropriate?",
        options: [
          "IV furosemide 40mg and continuous monitoring",
          "Immediate cardiac catheterization",
          "Start amiodarone drip",
          "Discharge with PCP follow-up in 2 weeks"
        ],
        correct: 0,
        rationale: "IV furosemide addresses acute volume overload in hemodynamic monitoring with continuous monitoring for response."
      }
    ]
  },
  "swan-ganz-np": {
    title: "Pulmonary Artery Catheter (Swan-Ganz)",
    cellular: {
      title: "Pathophysiology of Pulmonary Artery Catheter (Swan-Ganz)",
      content: "Pulmonary Artery Catheter (Swan-Ganz) involves alterations in airway structure, gas exchange, or pulmonary vascular function. Pulmonary Artery Catheter (Swan-Ganz) pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Connective tissue disease with ILD predisposition",
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "GERD with chronic microaspiration",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Radiation therapy to chest",
      "Family history of alpha-1 antitrypsin deficiency",
      "Current or former tobacco use (pack-year calculation)"
    ],
    diagnostics: [
      "6-minute walk test for functional capacity assessment",
      "Bronchoscopy with BAL for diagnostic sampling",
      "D-dimer (high sensitivity, low specificity for PE)",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "CT chest high-resolution for interstitial/parenchymal disease",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO"
    ],
    management: [
      "Step-up/step-down approach based on asthma control assessment",
      "Chest tube placement for pneumothorax or empyema drainage",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "LAMA (tiotropium 18mcg daily) for COPD maintenance",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Pulmonary Artery Catheter (Swan-Ganz) management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with pulmonary artery catheter (swan-ganz) develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for pulmonary artery catheter (swan-ganz)."
      }
    ]
  },
  "cardiac-output-np": {
    title: "Cardiac Output",
    cellular: {
      title: "Pathophysiology of Cardiac Output",
      content: "Cardiac Output involves specific alterations in cardiac output physiology. The pathophysiology of Cardiac Output encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of cardiac output."
    },
    riskFactors: [
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Chronic hypertension with end-organ damage",
      "Age >65 with cardiovascular degeneration",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Tobacco use (pack-year dependent risk calculation)",
      "Family history of premature CVD (<55 males, <65 females)"
    ],
    diagnostics: [
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides"
    ],
    management: [
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      },
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      }
    ],
    pearls: [
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions"
    ],
    quiz: [
      {
        question: "A patient with cardiac output on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "pft-interpretation-np": {
    title: "Pulmonary Function Test Interpretation",
    cellular: {
      title: "Pathophysiology of Pulmonary Function Test Interpretation",
      content: "Pulmonary Function Test Interpretation involves alterations in airway structure, gas exchange, or pulmonary vascular function. Pulmonary Function Test Interpretation pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Prior TB exposure or latent TB infection",
      "Obesity with restrictive physiology and OSA",
      "Immunocompromised state increasing pneumonia susceptibility",
      "Connective tissue disease with ILD predisposition",
      "Cystic fibrosis genotype (CFTR mutations)",
      "Current or former tobacco use (pack-year calculation)",
      "Prematurity with bronchopulmonary dysplasia history"
    ],
    diagnostics: [
      "Polysomnography for sleep-disordered breathing",
      "Pulse oximetry and continuous SpO2 monitoring",
      "Sputum culture, Gram stain, and AFB stain",
      "6-minute walk test for functional capacity assessment",
      "Procalcitonin for bacterial vs viral pneumonia differentiation",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO",
      "Thoracentesis with Light criteria for pleural effusion classification"
    ],
    management: [
      "Smoking cessation: varenicline + counseling (most effective combination)",
      "Antibiotic therapy based on local resistance patterns and severity scoring",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "Step-up/step-down approach based on asthma control assessment",
      "Annual influenza and pneumococcal vaccination",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)",
      "Inhaler technique assessment and spacer use education"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Pulmonary Function Test Interpretation management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with pulmonary function test interpretation develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for pulmonary function test interpretation."
      }
    ]
  },
  "abg-advanced-np": {
    title: "ABG Interpretation: Complex Acid-Base",
    cellular: {
      title: "Pathophysiology of ABG Interpretation",
      content: "ABG Interpretation: Complex Acid-Base involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to abg interpretation."
    },
    riskFactors: [
      "Hypertension (second leading cause of CKD)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Age >60 with age-related GFR decline",
      "Volume depletion from any cause",
      "Multiple myeloma with cast nephropathy",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Recurrent UTIs or urinary tract obstruction"
    ],
    diagnostics: [
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "24-hour urine collection for proteinuria quantification and CrCl"
    ],
    management: [
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "ABG Interpretation management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with abg interpretation has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "vent-waveform-np": {
    title: "Ventilator Waveform Analysis: Auto-PEEP",
    cellular: {
      title: "Pathophysiology of Ventilator Waveform Analysis",
      content: "Ventilator Waveform Analysis: Auto-PEEP involves alterations in airway structure, gas exchange, or pulmonary vascular function. Ventilator Waveform Analysis pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Radiation therapy to chest",
      "GERD with chronic microaspiration",
      "Prior TB exposure or latent TB infection",
      "Indoor air pollution and biomass fuel exposure",
      "Current or former tobacco use (pack-year calculation)",
      "Childhood asthma with persistent airway hyperreactivity",
      "Occupational dust/chemical exposure (asbestos, silica, coal)"
    ],
    diagnostics: [
      "Methacholine challenge for suspected asthma with normal spirometry",
      "D-dimer (high sensitivity, low specificity for PE)",
      "Polysomnography for sleep-disordered breathing",
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO",
      "CT pulmonary angiography for PE evaluation",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation"
    ],
    management: [
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Smoking cessation: varenicline + counseling (most effective combination)",
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)",
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      },
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Ventilator Waveform Analysis management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with ventilator waveform analysis develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for ventilator waveform analysis."
      }
    ]
  },
  "respiratory-mechanics-np": {
    title: "Respiratory Mechanics Assessment",
    cellular: {
      title: "Pathophysiology of Respiratory Mechanics Assessment",
      content: "Respiratory Mechanics Assessment involves alterations in airway structure, gas exchange, or pulmonary vascular function. Respiratory Mechanics Assessment pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Family history of alpha-1 antitrypsin deficiency",
      "Connective tissue disease with ILD predisposition",
      "Radiation therapy to chest",
      "Immunocompromised state increasing pneumonia susceptibility",
      "Childhood asthma with persistent airway hyperreactivity",
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "Obesity with restrictive physiology and OSA"
    ],
    diagnostics: [
      "CT chest high-resolution for interstitial/parenchymal disease",
      "6-minute walk test for functional capacity assessment",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "Sputum culture, Gram stain, and AFB stain",
      "CT pulmonary angiography for PE evaluation",
      "Bronchoscopy with BAL for diagnostic sampling",
      "Pulse oximetry and continuous SpO2 monitoring"
    ],
    management: [
      "LAMA (tiotropium 18mcg daily) for COPD maintenance",
      "Step-up/step-down approach based on asthma control assessment",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation",
      "Chest tube placement for pneumothorax or empyema drainage",
      "Antibiotic therapy based on local resistance patterns and severity scoring"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Respiratory Mechanics Assessment management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with respiratory mechanics assessment develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for respiratory mechanics assessment."
      }
    ]
  },
  "neuro-exam-advanced-np": {
    title: "Comprehensive Neurological Examination",
    cellular: {
      title: "Pathophysiology of Comprehensive Neurological Examination",
      content: "Comprehensive Neurological Examination involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Comprehensive Neurological Examination pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Hypertension (leading modifiable risk for stroke)",
      "Occupational toxin exposure (heavy metals, organophosphates)",
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Chronic alcohol use with neurotoxicity",
      "Family history of neurological disease (first-degree relative)",
      "Tobacco use with cerebrovascular disease risk",
      "Prior head trauma or TBI history"
    ],
    diagnostics: [
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)",
      "Visual field testing and fundoscopic exam for papilledema",
      "EEG for seizure characterization and localization",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)"
    ],
    management: [
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Seizure precautions and driving restriction counseling",
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Blood pressure management per AHA stroke guidelines"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      },
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Comprehensive Neurological Examination requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with comprehensive neurological examination. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for comprehensive neurological examination."
      }
    ]
  },
  "cranial-nerve-advanced-np": {
    title: "Cranial Nerve Testing: Advanced Techniques",
    cellular: {
      title: "Pathophysiology of Cranial Nerve Testing",
      content: "Cranial Nerve Testing: Advanced Techniques involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to cranial nerve testing."
    },
    riskFactors: [
      "Prolonged hospitalization (>48h increases nosocomial infection risk)",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Diabetes mellitus with impaired neutrophil function",
      "Splenectomy with encapsulated organism susceptibility",
      "Chronic liver disease with impaired immune function"
    ],
    diagnostics: [
      "Lactate level for sepsis severity (>2 mmol/L concerning)",
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "CRP and ESR for inflammatory response quantification",
      "Sensitivity testing for targeted antimicrobial therapy",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads"
    ],
    management: [
      "De-escalation to narrow-spectrum based on culture and sensitivity results",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Immunization update for preventable infections",
      "Source control: drainage, debridement, device removal",
      "Repeat cultures at 48-72h to document clearance",
      "Infectious disease consultation for complex or resistant infections"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Cranial Nerve Testing management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected cranial nerve testing has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "cerebellar-exam-np": {
    title: "Cerebellar Examination",
    cellular: {
      title: "Pathophysiology of Cerebellar Examination",
      content: "Cerebellar Examination involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Cerebellar Examination pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Diabetes with peripheral and autonomic neuropathy",
      "Age >65 with progressive neurodegenerative risk",
      "Hypertension (leading modifiable risk for stroke)",
      "Sleep deprivation or circadian rhythm disruption",
      "Tobacco use with cerebrovascular disease risk",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Atrial fibrillation with cardioembolic stroke risk"
    ],
    diagnostics: [
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "Carotid duplex ultrasound for extracranial stenosis",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Glasgow Coma Scale (GCS) for consciousness level assessment"
    ],
    management: [
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      },
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Cerebellar Examination requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with cerebellar examination. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for cerebellar examination."
      }
    ]
  },
  "motor-sensory-exam-np": {
    title: "Motor and Sensory Examination",
    cellular: {
      title: "Pathophysiology of Motor and Sensory Examination",
      content: "Motor and Sensory Examination involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Motor and Sensory Examination pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Sleep deprivation or circadian rhythm disruption",
      "Prior head trauma or TBI history",
      "Chronic alcohol use with neurotoxicity",
      "Occupational toxin exposure (heavy metals, organophosphates)",
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Obesity and metabolic syndrome with neuroinflammation",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)"
    ],
    diagnostics: [
      "Carotid duplex ultrasound for extracranial stenosis",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "EEG for seizure characterization and localization",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)",
      "MRA or CTA for intracranial vascular evaluation",
      "Neuropsychological testing for cognitive domain assessment",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening"
    ],
    management: [
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Blood pressure management per AHA stroke guidelines",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Seizure precautions and driving restriction counseling",
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Supportive care: HOB elevation 30 degrees, normothermia, euglycemia",
      "Rehabilitation: PT, OT, speech therapy for functional recovery"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      },
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Motor and Sensory Examination requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with motor and sensory examination. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for motor and sensory examination."
      }
    ]
  },
  "reflex-grading-np": {
    title: "Deep Tendon Reflexes",
    cellular: {
      title: "Pathophysiology of Deep Tendon Reflexes",
      content: "Deep Tendon Reflexes involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Deep Tendon Reflexes pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Age >65 with progressive neurodegenerative risk",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Occupational toxin exposure (heavy metals, organophosphates)",
      "Prior head trauma or TBI history",
      "Hypertension (leading modifiable risk for stroke)",
      "Diabetes with peripheral and autonomic neuropathy",
      "Family history of neurological disease (first-degree relative)"
    ],
    diagnostics: [
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)"
    ],
    management: [
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Seizure precautions and driving restriction counseling",
      "Blood pressure management per AHA stroke guidelines",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      },
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Deep Tendon Reflexes requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with deep tendon reflexes. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for deep tendon reflexes."
      }
    ]
  },
  "brain-death-assessment-np": {
    title: "Brain Death Assessment Protocol",
    cellular: {
      title: "Pathophysiology of Brain Death Assessment Protocol",
      content: "Brain Death Assessment Protocol involves systematic clinical evaluation skills essential for NP practice. Brain Death Assessment Protocol requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for brain death assessment protocol per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Brain Death Assessment Protocol requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Brain Death Assessment Protocol management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with brain death assessment protocol. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of brain death assessment protocol."
      }
    ]
  },
  "dermatological-exam-np": {
    title: "Dermatological Assessment",
    cellular: {
      title: "Pathophysiology of Dermatological Assessment",
      content: "Dermatological Assessment involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for dermatological assessment",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Dermatological Assessment management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of dermatological assessment?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "dermoscopy-np": {
    title: "Dermoscopy: Pattern Analysis",
    cellular: {
      title: "Pathophysiology of Dermoscopy",
      content: "Dermoscopy: Pattern Analysis involves pathological changes in skin structure and function through disruptions in keratinocyte differentiation, melanocyte function, or immune surveillance within the cutaneous microenvironment."
    },
    riskFactors: [
      "UV exposure and cumulative sun damage",
      "Fair skin (Fitzpatrick I-II)",
      "Immunosuppression (transplant, HIV, medications)",
      "Personal/family history of skin cancer or dysplastic nevi",
      "Medication-related dermatological effects (drug eruptions)",
      "Chronic inflammatory skin conditions predisposing to malignancy",
      "Occupational chemical or irritant skin exposures"
    ],
    diagnostics: [
      "Full skin exam with dermoscopy for pigmented lesions",
      "Biopsy (punch, shave, or excisional) based on lesion type",
      "Wood lamp examination for fluorescence patterns",
      "Patch testing for suspected contact dermatitis",
      "Lab: CBC, CMP, ESR/CRP, autoimmune panels as indicated",
      "Cultures (bacterial, fungal, viral) for infectious dermatoses",
      "PASI, BSA, or DLQI severity scoring tools"
    ],
    management: [
      "Evidence-based treatment per AAD guidelines for dermoscopy",
      "Topical therapy: corticosteroids, calcineurin inhibitors, retinoids",
      "Systemic therapy: methotrexate, cyclosporine for moderate-severe disease",
      "Biologics for refractory inflammatory dermatoses",
      "Wound care and infection prevention protocols",
      "Sun protection (SPF 30+) and skin cancer surveillance",
      "Dermatology referral for complex or refractory presentations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary lesion morphology and distribution",
        "Distribution pattern (sun-exposed, dermatome, flexural)",
        "Pruritus, pain, burning sensation",
        "Mucosal involvement (eyes, mouth, genitalia)"
      ],
      right: [
        "Nikolsky sign (epidermal detachment)",
        "Koebner phenomenon (trauma-induced lesions)",
        "Auspitz sign (pinpoint bleeding with scale removal)",
        "Secondary changes: scaling, crusting, lichenification, excoriation"
      ]
    },
    medications: [
      {
        name: "Clobetasol 0.05%",
        type: "Super-potent topical corticosteroid (Class I)",
        action: "Binds glucocorticoid receptors inhibiting PLA2 and NF-kB, reducing inflammatory cytokines",
        sideEffects: "Skin atrophy, striae, telangiectasia, HPA suppression with prolonged use",
        contra: "Face, groin, axillae; avoid >2 weeks; contraindicated in rosacea",
        pearl: "Limit to 2 weeks on thick-skinned areas. Maximum 50g/week. Step down to medium-potency for maintenance."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF-alpha Monoclonal Antibody",
        action: "Binds TNF-alpha preventing receptor interaction, reducing inflammatory cascade",
        sideEffects: "Injection site reactions, infection risk, TB reactivation, lymphoma risk",
        contra: "Active infection, latent TB (treat first), decompensated HF",
        pearl: "Screen for TB, hepatitis B/C, HIV before initiating. Psoriasis: 80mg loading, then 40mg q2 weeks."
      }
    ],
    pearls: [
      "ABCDE criteria for melanocytic lesion assessment: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution",
      "Dermoscopy management matches treatment intensity to disease severity",
      "Drug-induced reactions: document timing of new medications relative to rash onset"
    ],
    quiz: [
      {
        question: "Which finding is most concerning for a severe presentation of dermoscopy?",
        options: [
          "Mild localized pruritus responding to topical therapy",
          "Mucosal involvement with skin detachment and positive Nikolsky sign",
          "Localized rash stable for 6 months",
          "Seasonal exacerbation without progression"
        ],
        correct: 1,
        rationale: "Mucosal involvement with skin detachment and Nikolsky sign suggests severe cutaneous reaction requiring immediate intervention."
      }
    ]
  },
  "msk-special-tests-np": {
    title: "Musculoskeletal Special Tests (Lachman",
    cellular: {
      title: "Pathophysiology of Musculoskeletal Special Tests (Lachman",
      content: "Musculoskeletal Special Tests (Lachman involves systematic clinical evaluation skills essential for NP practice. Musculoskeletal Special Tests (Lachman requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for musculoskeletal special tests (lachman per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Musculoskeletal Special Tests (Lachman requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Musculoskeletal Special Tests (Lachman management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with musculoskeletal special tests (lachman. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of musculoskeletal special tests (lachman."
      }
    ]
  },
  "joint-exam-np": {
    title: "Joint-Specific Examination Techniques",
    cellular: {
      title: "Pathophysiology of Joint-Specific Examination Techniques",
      content: "Joint-Specific Examination Techniques involves systematic clinical evaluation skills essential for NP practice. Joint-Specific Examination Techniques requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for joint-specific examination techniques per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Joint-Specific Examination Techniques requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Joint-Specific Examination Techniques management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with joint-specific examination techniques. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of joint-specific examination techniques."
      }
    ]
  },
  "spine-exam-np": {
    title: "Spinal Assessment (Spurling, SLR, Schober)",
    cellular: {
      title: "Pathophysiology of Spinal Assessment (Spurling, SLR, Schober)",
      content: "Spinal Assessment (Spurling, SLR, Schober) involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Spinal Assessment (Spurling, SLR, Schober) pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Prior head trauma or TBI history",
      "Obesity and metabolic syndrome with neuroinflammation",
      "Prior CNS infection (increased seizure risk)",
      "Tobacco use with cerebrovascular disease risk",
      "Chronic alcohol use with neurotoxicity",
      "Sleep deprivation or circadian rhythm disruption",
      "Diabetes with peripheral and autonomic neuropathy"
    ],
    diagnostics: [
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "Neuropsychological testing for cognitive domain assessment",
      "Genetic testing when hereditary neurological condition suspected",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "EEG for seizure characterization and localization",
      "Carotid duplex ultrasound for extracranial stenosis",
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation"
    ],
    management: [
      "Blood pressure management per AHA stroke guidelines",
      "Supportive care: HOB elevation 30 degrees, normothermia, euglycemia",
      "Palliative care and goals of care discussion for progressive diseases",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      },
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Spinal Assessment (Spurling, SLR, Schober) requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with spinal assessment (spurling, slr, schober). Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for spinal assessment (spurling, slr, schober)."
      }
    ]
  },
  "gait-analysis-np": {
    title: "Gait Analysis and Abnormalities",
    cellular: {
      title: "Pathophysiology of Gait Analysis and Abnormalities",
      content: "Gait Analysis and Abnormalities involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Gait Analysis and Abnormalities pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Prior CNS infection (increased seizure risk)",
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Family history of neurological disease (first-degree relative)",
      "Age >65 with progressive neurodegenerative risk",
      "Chronic alcohol use with neurotoxicity",
      "Hypertension (leading modifiable risk for stroke)"
    ],
    diagnostics: [
      "Genetic testing when hereditary neurological condition suspected",
      "MRA or CTA for intracranial vascular evaluation",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "EEG for seizure characterization and localization",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)"
    ],
    management: [
      "Palliative care and goals of care discussion for progressive diseases",
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      },
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Gait Analysis and Abnormalities requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with gait analysis and abnormalities. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for gait analysis and abnormalities."
      }
    ]
  },
  "ophthalmoscopic-exam-np": {
    title: "Ophthalmoscopic Examination (Fundoscopy)",
    cellular: {
      title: "Pathophysiology of Ophthalmoscopic Examination (Fundoscopy)",
      content: "Ophthalmoscopic Examination (Fundoscopy) involves systematic clinical evaluation skills essential for NP practice. Ophthalmoscopic Examination (Fundoscopy) requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for ophthalmoscopic examination (fundoscopy) per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Ophthalmoscopic Examination (Fundoscopy) requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Ophthalmoscopic Examination (Fundoscopy) management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with ophthalmoscopic examination (fundoscopy). Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of ophthalmoscopic examination (fundoscopy)."
      }
    ]
  },
  "otoscopic-exam-np": {
    title: "Otoscopic and Audiometric Examination",
    cellular: {
      title: "Pathophysiology of Otoscopic and Audiometric Examination",
      content: "Otoscopic and Audiometric Examination involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "thyroid-exam-np": {
    title: "Thyroid Examination: Palpation and Assessment",
    cellular: {
      title: "Pathophysiology of Thyroid Examination",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "MEN syndrome family history",
      "Chronic corticosteroid use with HPA axis suppression",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis"
    ],
    diagnostics: [
      "24-hour urine free cortisol for Cushing confirmation",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)"
    ],
    management: [
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Diabetes self-management education and support (DSMES)",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Continuous glucose monitoring for insulin-dependent diabetes"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Thyroid Examination management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected thyroid examination. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for thyroid examination",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for thyroid examination while being cost-effective."
      }
    ]
  },
  "breast-exam-np": {
    title: "Clinical Breast Examination",
    cellular: {
      title: "Pathophysiology of Clinical Breast Examination",
      content: "Clinical Breast Examination involves reproductive, obstetric, or gynecologic pathophysiology specific to clinical breast examination."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for clinical breast examination",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Clinical Breast Examination management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with clinical breast examination. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for clinical breast examination."
      }
    ]
  },
  "gynecological-exam-np": {
    title: "Gynecological Assessment",
    cellular: {
      title: "Pathophysiology of Gynecological Assessment",
      content: "Gynecological Assessment involves systematic clinical evaluation skills essential for NP practice. Gynecological Assessment requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for gynecological assessment per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Gynecological Assessment requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Gynecological Assessment management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with gynecological assessment. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of gynecological assessment."
      }
    ]
  },
  "prenatal-assessment-np": {
    title: "Advanced Prenatal Assessment",
    cellular: {
      title: "Pathophysiology of Advanced Prenatal Assessment",
      content: "Advanced Prenatal Assessment involves systematic clinical evaluation skills essential for NP practice. Advanced Prenatal Assessment requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for advanced prenatal assessment per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Advanced Prenatal Assessment requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Advanced Prenatal Assessment management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with advanced prenatal assessment. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of advanced prenatal assessment."
      }
    ]
  },
  "fetal-surveillance-np": {
    title: "Fetal Surveillance: NST, BPP, CST",
    cellular: {
      title: "Pathophysiology of Fetal Surveillance",
      content: "Fetal Surveillance: NST, BPP, CST involves reproductive, obstetric, or gynecologic pathophysiology specific to fetal surveillance."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for fetal surveillance",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Fetal Surveillance management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with fetal surveillance. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for fetal surveillance."
      }
    ]
  },
  "geriatric-assessment-np": {
    title: "Comprehensive Geriatric Assessment (CGA)",
    cellular: {
      title: "Pathophysiology of Comprehensive Geriatric Assessment (CGA)",
      content: "Comprehensive Geriatric Assessment (CGA) involves systematic clinical evaluation skills essential for NP practice. Comprehensive Geriatric Assessment (CGA) requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for comprehensive geriatric assessment (cga) per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Comprehensive Geriatric Assessment (CGA) requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Comprehensive Geriatric Assessment (CGA) management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with comprehensive geriatric assessment (cga). Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of comprehensive geriatric assessment (cga)."
      }
    ]
  },
  "frailty-assessment-np": {
    title: "Frailty Assessment (Clinical Frailty Scale)",
    cellular: {
      title: "Pathophysiology of Frailty Assessment (Clinical Frailty Scale)",
      content: "Frailty Assessment (Clinical Frailty Scale) involves systematic clinical evaluation skills essential for NP practice. Frailty Assessment (Clinical Frailty Scale) requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for frailty assessment (clinical frailty scale) per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Frailty Assessment (Clinical Frailty Scale) requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Frailty Assessment (Clinical Frailty Scale) management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with frailty assessment (clinical frailty scale). Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of frailty assessment (clinical frailty scale)."
      }
    ]
  },
  "cognitive-screening-np": {
    title: "Cognitive Screening (MMSE, MoCA, Mini-Cog)",
    cellular: {
      title: "Pathophysiology of Cognitive Screening (MMSE, MoCA, Mini-Cog)",
      content: "Cognitive Screening (MMSE, MoCA, Mini-Cog) involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Cognitive Screening (MMSE, MoCA, Mini-Cog) pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Sleep deprivation or circadian rhythm disruption",
      "Prior head trauma or TBI history",
      "Chronic alcohol use with neurotoxicity",
      "Occupational toxin exposure (heavy metals, organophosphates)",
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Obesity and metabolic syndrome with neuroinflammation",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)"
    ],
    diagnostics: [
      "Carotid duplex ultrasound for extracranial stenosis",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "EEG for seizure characterization and localization",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)",
      "MRA or CTA for intracranial vascular evaluation",
      "Neuropsychological testing for cognitive domain assessment",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening"
    ],
    management: [
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Blood pressure management per AHA stroke guidelines",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Seizure precautions and driving restriction counseling",
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Supportive care: HOB elevation 30 degrees, normothermia, euglycemia",
      "Rehabilitation: PT, OT, speech therapy for functional recovery"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      },
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Cognitive Screening (MMSE, MoCA, Mini-Cog) requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with cognitive screening (mmse, moca, mini-cog). Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for cognitive screening (mmse, moca, mini-cog)."
      }
    ]
  },
  "developmental-screening-np": {
    title: "Pediatric Developmental Screening (ASQ",
    cellular: {
      title: "Pathophysiology of Pediatric Developmental Screening (ASQ",
      content: "Pediatric Developmental Screening (ASQ involves age-specific developmental, physiological, and pathological mechanisms unique to pediatric populations. Pediatric Developmental Screening (ASQ in children requires understanding of growth parameters, developmental milestones, weight-based medication dosing, and age-appropriate normal values that differ significantly from adult parameters."
    },
    riskFactors: [
      "Prematurity or low birth weight",
      "Incomplete immunization status",
      "Daycare/school exposure to communicable diseases",
      "Genetic syndromes or chromosomal abnormalities",
      "Family history of hereditary conditions",
      "Environmental exposures (lead, secondhand smoke)",
      "Nutritional deficiencies or failure to thrive"
    ],
    diagnostics: [
      "Age-appropriate vital signs and growth chart assessment",
      "Developmental screening (ASQ, M-CHAT for ASD)",
      "CBC with differential using age-adjusted normals",
      "Age-specific metabolic and liver function panels",
      "Imaging modulated for radiation minimization in children",
      "Immunization records and catch-up schedule review",
      "Genetic testing or newborn screening results review"
    ],
    management: [
      "Evidence-based first-line therapy for pediatric developmental screening (asq per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever (distinguish age-based risk: <28d = always high risk)",
        "Irritability, poor feeding, or lethargy",
        "Rash (viral exanthem, purpura, petechiae)",
        "Respiratory distress (nasal flaring, grunting, retractions)"
      ],
      right: [
        "Growth faltering or failure to thrive",
        "Developmental delay or regression",
        "Dehydration assessment (fontanelle, tears, UOP, skin turgor)",
        "Weight-based medication dosing verification"
      ]
    },
    medications: [
      {
        name: "Amoxicillin (pediatric)",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis",
        sideEffects: "Diarrhea, rash (especially with EBV)",
        contra: "Penicillin allergy",
        pearl: "AOM: 80-90mg/kg/day divided BID x10d (<2y) or x5-7d (>=2y). Strep pharyngitis: 50mg/kg/day (max 1000mg) divided BID x10d."
      },
      {
        name: "Ibuprofen (pediatric)",
        type: "NSAID",
        action: "Inhibits COX-1 and COX-2 reducing prostaglandin synthesis",
        sideEffects: "GI upset, renal impairment with dehydration",
        contra: "Age <6 months, dehydration, renal impairment, varicella (Reye syndrome association less clear than aspirin)",
        pearl: "10mg/kg/dose q6-8h (max 40mg/kg/day). Do NOT alternate with acetaminophen routinely. Ensure hydration. Avoid in dehydrated children."
      }
    ],
    pearls: [
      "Pediatric Developmental Screening (ASQ requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Pediatric Developmental Screening (ASQ management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with pediatric developmental screening (asq. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of pediatric developmental screening (asq."
      }
    ]
  },
  "psychiatric-diagnostic-np": {
    title: "Psychiatric Diagnostic Assessment (DSM-5)",
    cellular: {
      title: "Pathophysiology of Psychiatric Diagnostic Assessment (DSM-5)",
      content: "Psychiatric Diagnostic Assessment (DSM-5) involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to psychiatric diagnostic assessment (dsm-5)."
    },
    riskFactors: [
      "IV drug use with bacteremia risk",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Splenectomy with encapsulated organism susceptibility",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Malnutrition with impaired immune cell production",
      "Diabetes mellitus with impaired neutrophil function",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)"
    ],
    diagnostics: [
      "CT with contrast for abscess, collection, or source identification",
      "Wound/tissue/fluid cultures with Gram stain",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "CRP and ESR for inflammatory response quantification",
      "Urinalysis with urine culture and sensitivity",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Procalcitonin for bacterial infection likelihood"
    ],
    management: [
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Repeat cultures at 48-72h to document clearance",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Source control: drainage, debridement, device removal",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Psychiatric Diagnostic Assessment (DSM-5) management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected psychiatric diagnostic assessment (dsm-5) has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "vascular-assessment-np": {
    title: "Advanced Vascular Assessment (Doppler, ABI)",
    cellular: {
      title: "Pathophysiology of Advanced Vascular Assessment (Doppler, ABI)",
      content: "Advanced Vascular Assessment (Doppler, ABI) involves systematic clinical evaluation skills essential for NP practice. Advanced Vascular Assessment (Doppler, ABI) requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for advanced vascular assessment (doppler, abi) per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Advanced Vascular Assessment (Doppler, ABI) requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Advanced Vascular Assessment (Doppler, ABI) management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with advanced vascular assessment (doppler, abi). Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of advanced vascular assessment (doppler, abi)."
      }
    ]
  },
  "lymphedema-assessment-np": {
    title: "Lymphedema Assessment and Staging",
    cellular: {
      title: "Pathophysiology of Lymphedema Assessment and Staging",
      content: "Lymphedema Assessment and Staging involves malignant transformation through accumulation of genetic mutations (oncogene activation, tumor suppressor loss) driving uncontrolled proliferation. The hallmarks of cancer include sustained proliferative signaling, evading growth suppressors, resisting cell death, enabling replicative immortality, inducing angiogenesis, and activating invasion/metastasis. TNM staging guides prognosis and treatment decisions."
    },
    riskFactors: [
      "Age (strongest risk factor for most cancers)",
      "Tobacco use (dose-dependent carcinogenic exposure)",
      "Family history and inherited cancer syndromes (BRCA, Lynch)",
      "Chronic inflammation or infection (H. pylori, HBV/HCV, HPV)",
      "Environmental carcinogen exposure (asbestos, radiation, benzene)",
      "Immunosuppression (transplant, HIV)",
      "Obesity (associated with 13 cancer types)"
    ],
    diagnostics: [
      "Tissue biopsy with histopathological examination (gold standard)",
      "CT chest/abdomen/pelvis for staging",
      "PET-CT for metabolic activity and metastatic survey",
      "Tumor markers (CEA, PSA, CA-125, AFP, LDH)",
      "Molecular profiling and genomic testing (BRCA, MSI, PD-L1, TMB)",
      "CBC, CMP, LDH for baseline and tumor burden",
      "Age-appropriate cancer screening per USPSTF/ACS guidelines"
    ],
    management: [
      "Evidence-based first-line therapy for lymphedema assessment and staging per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Unexplained weight loss >10% in 6 months",
        "Persistent fatigue unresponsive to rest",
        "Pain (new onset, progressive)",
        "New mass or lymphadenopathy"
      ],
      right: [
        "B symptoms: fever, night sweats, weight loss",
        "Performance status assessment (ECOG/Karnofsky)",
        "Paraneoplastic syndromes",
        "Evidence of metastatic disease"
      ]
    },
    medications: [
      {
        name: "Pembrolizumab (Keytruda)",
        type: "Anti-PD-1 Checkpoint Inhibitor",
        action: "Blocks PD-1 receptor on T cells restoring anti-tumor immune surveillance",
        sideEffects: "Immune-related adverse events: colitis, hepatitis, pneumonitis, thyroiditis, dermatitis",
        contra: "Autoimmune disease (relative), organ transplant",
        pearl: "First-line for PD-L1 high (>=50%) NSCLC, MSI-H/dMMR tumors. Monitor thyroid function, LFTs. Manage irAEs with corticosteroids."
      },
      {
        name: "Ondansetron (Zofran)",
        type: "5-HT3 Receptor Antagonist",
        action: "Blocks serotonin 5-HT3 receptors in CTZ and vagal afferents preventing chemotherapy-induced emesis",
        sideEffects: "Headache, constipation, QT prolongation (dose-dependent)",
        contra: "Concomitant apomorphine, congenital long QT syndrome",
        pearl: "4-8mg IV/PO q8h. Combine with dexamethasone +/- NK1 antagonist (aprepitant) for highly emetogenic chemo. ECG for QT if multiple doses."
      }
    ],
    pearls: [
      "Lymphedema Assessment and Staging requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Lymphedema Assessment and Staging management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with lymphedema assessment and staging. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of lymphedema assessment and staging."
      }
    ]
  },
  "abdominal-exam-np": {
    title: "Abdominal Examination (Murphy, McBurney",
    cellular: {
      title: "Pathophysiology of Abdominal Examination (Murphy, McBurney",
      content: "Abdominal Examination (Murphy, McBurney involves multi-system pathophysiology requiring integration of knowledge across organ systems for abdominal examination (murphy, mcburney."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Abdominal Examination (Murphy, McBurney management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with abdominal examination (murphy, mcburney arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for abdominal examination (murphy, mcburney."
      }
    ]
  },
  "rectal-prostate-np": {
    title: "Digital Rectal and Prostate Examination",
    cellular: {
      title: "Pathophysiology of Digital Rectal and Prostate Examination",
      content: "Digital Rectal and Prostate Examination involves male reproductive, urological, or andrological pathophysiology specific to digital rectal and prostate examination."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for digital rectal and prostate examination",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Digital Rectal and Prostate Examination evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with digital rectal and prostate examination presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for digital rectal and prostate examination."
      }
    ]
  },
  "sofa-apache-np": {
    title: "SOFA and APACHE II Scoring",
    cellular: {
      title: "Pathophysiology of SOFA and APACHE II Scoring",
      content: "SOFA and APACHE II Scoring involves systematic clinical evaluation skills essential for NP practice. SOFA and APACHE II Scoring requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for sofa and apache ii scoring per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "SOFA and APACHE II Scoring requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "SOFA and APACHE II Scoring management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with sofa and apache ii scoring. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of sofa and apache ii scoring."
      }
    ]
  },
  "wells-criteria-np": {
    title: "Wells Criteria and Clinical Prediction Rules",
    cellular: {
      title: "Pathophysiology of Wells Criteria and Clinical Prediction Rules",
      content: "DIC involves systemic activation of coagulation with simultaneous consumption of clotting factors and platelets causing both microvascular thrombosis and hemorrhage. Triggers: sepsis, trauma, malignancy, obstetric complications. Labs: prolonged PT/aPTT, low fibrinogen (<100), elevated D-dimer, thrombocytopenia, schistocytes on smear. Treatment: treat underlying cause, replace with FFP/cryo/platelets if bleeding, heparin only if thrombosis predominates."
    },
    riskFactors: [
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chronic kidney disease with decreased erythropoietin",
      "Recent surgery or trauma with blood loss",
      "Iron deficiency (most common cause of anemia worldwide)",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Liver disease with coagulopathy and thrombocytopenia"
    ],
    diagnostics: [
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "CBC with differential and peripheral blood smear review",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)"
    ],
    management: [
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Folate supplementation: 1mg PO daily",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "IVIG for severe ITP with active bleeding or preprocedural"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      },
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Wells Criteria and Clinical Prediction Rules management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with wells criteria and clinical prediction rules presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of wells criteria and clinical prediction rules."
      }
    ]
  },
  "imaging-interpretation-np": {
    title: "Chest X-Ray and Basic Imaging Interpretation",
    cellular: {
      title: "Pathophysiology of Chest X-Ray and Basic Imaging Interpretation",
      content: "Chest X-Ray and Basic Imaging Interpretation involves systematic interpretation of laboratory values, imaging studies, and diagnostic procedures essential for clinical decision-making in chest x-ray and basic imaging interpretation. Understanding sensitivity, specificity, positive and negative predictive values guides test selection and result interpretation."
    },
    riskFactors: [
      "Pre-analytical errors (specimen handling, timing, patient preparation)",
      "Interfering substances (hemolysis, lipemia, medications)",
      "Reference range variations by age, sex, and ethnicity",
      "Test selection bias and overtesting",
      "Failure to correlate results with clinical context",
      "Delayed specimen processing affecting accuracy",
      "Patient factors: fasting status, hydration, circadian variation"
    ],
    diagnostics: [
      "Appropriate test selection based on pre-test probability",
      "Proper specimen collection and handling protocols",
      "Reference range application with patient-specific adjustments",
      "Serial trending of values for clinical significance",
      "Sensitivity/specificity consideration for screening vs confirmatory tests",
      "Correlation of laboratory results with clinical presentation",
      "Critical value identification and urgent communication"
    ],
    management: [
      "Evidence-based first-line therapy for chest x-ray and basic imaging interpretation per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Normal vs abnormal value identification",
        "Trending analysis over time",
        "Clinical correlation with symptoms",
        "Pre-test probability assessment"
      ],
      right: [
        "Critical value recognition and response",
        "Sensitivity and specificity interpretation",
        "False positive and false negative consideration",
        "Cost-effective test ordering strategy"
      ]
    },
    medications: [
      {
        name: "Laboratory Test Interpretation Framework",
        type: "Diagnostic Tool",
        action: "Systematic approach to interpreting lab values within clinical context including pre-analytical, analytical, and post-analytical phases",
        sideEffects: "Over-reliance on lab values without clinical correlation",
        contra: "Treating lab numbers in isolation from clinical presentation",
        pearl: "Always correlate labs with clinical picture. Know common interferences: hemolysis (falsely elevated K+, LDH), biotin (falsely decreased troponin, TSH), lipemia (falsely decreased sodium)."
      },
      {
        name: "Imaging Selection Guidelines",
        type: "Diagnostic Decision Support",
        action: "Evidence-based imaging selection using ACR Appropriateness Criteria to guide modality choice by clinical scenario",
        sideEffects: "Radiation exposure concerns with CT studies",
        contra: "Contrast administration in severe renal impairment or allergy without premedication",
        pearl: "ACR Appropriateness Criteria guide imaging selection. CT with contrast: hold metformin 48h if eGFR <30. MRI: screen for metallic implants. Ultrasound: no radiation, excellent for pregnant patients. Choose wisely: avoid unnecessary imaging."
      }
    ],
    pearls: [
      "Chest X-Ray and Basic Imaging Interpretation requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Chest X-Ray and Basic Imaging Interpretation management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with chest x-ray and basic imaging interpretation. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of chest x-ray and basic imaging interpretation."
      }
    ]
  },
  "lab-interpretation-np": {
    title: "Lab Interpretation: Panels and Trends",
    cellular: {
      title: "Pathophysiology of Lab Interpretation",
      content: "Lab Interpretation: Panels and Trends involves systematic interpretation of laboratory values, imaging studies, and diagnostic procedures essential for clinical decision-making in lab interpretation. Understanding sensitivity, specificity, positive and negative predictive values guides test selection and result interpretation."
    },
    riskFactors: [
      "Pre-analytical errors (specimen handling, timing, patient preparation)",
      "Interfering substances (hemolysis, lipemia, medications)",
      "Reference range variations by age, sex, and ethnicity",
      "Test selection bias and overtesting",
      "Failure to correlate results with clinical context",
      "Delayed specimen processing affecting accuracy",
      "Patient factors: fasting status, hydration, circadian variation"
    ],
    diagnostics: [
      "Appropriate test selection based on pre-test probability",
      "Proper specimen collection and handling protocols",
      "Reference range application with patient-specific adjustments",
      "Serial trending of values for clinical significance",
      "Sensitivity/specificity consideration for screening vs confirmatory tests",
      "Correlation of laboratory results with clinical presentation",
      "Critical value identification and urgent communication"
    ],
    management: [
      "Evidence-based first-line therapy for lab interpretation per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Normal vs abnormal value identification",
        "Trending analysis over time",
        "Clinical correlation with symptoms",
        "Pre-test probability assessment"
      ],
      right: [
        "Critical value recognition and response",
        "Sensitivity and specificity interpretation",
        "False positive and false negative consideration",
        "Cost-effective test ordering strategy"
      ]
    },
    medications: [
      {
        name: "Laboratory Test Interpretation Framework",
        type: "Diagnostic Tool",
        action: "Systematic approach to interpreting lab values within clinical context including pre-analytical, analytical, and post-analytical phases",
        sideEffects: "Over-reliance on lab values without clinical correlation",
        contra: "Treating lab numbers in isolation from clinical presentation",
        pearl: "Always correlate labs with clinical picture. Know common interferences: hemolysis (falsely elevated K+, LDH), biotin (falsely decreased troponin, TSH), lipemia (falsely decreased sodium)."
      },
      {
        name: "Imaging Selection Guidelines",
        type: "Diagnostic Decision Support",
        action: "Evidence-based imaging selection using ACR Appropriateness Criteria to guide modality choice by clinical scenario",
        sideEffects: "Radiation exposure concerns with CT studies",
        contra: "Contrast administration in severe renal impairment or allergy without premedication",
        pearl: "ACR Appropriateness Criteria guide imaging selection. CT with contrast: hold metformin 48h if eGFR <30. MRI: screen for metallic implants. Ultrasound: no radiation, excellent for pregnant patients. Choose wisely: avoid unnecessary imaging."
      }
    ],
    pearls: [
      "Lab Interpretation requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Lab Interpretation management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with lab interpretation. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of lab interpretation."
      }
    ]
  },
  "point-of-care-us-np": {
    title: "Point-of-Care Ultrasound (POCUS) Assessment",
    cellular: {
      title: "Pathophysiology of Point-of-Care Ultrasound (POCUS) Assessment",
      content: "Point-of-Care Ultrasound (POCUS) Assessment involves systematic clinical evaluation skills essential for NP practice. Point-of-Care Ultrasound (POCUS) Assessment requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for point-of-care ultrasound (pocus) assessment per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Point-of-Care Ultrasound (POCUS) Assessment requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Point-of-Care Ultrasound (POCUS) Assessment management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with point-of-care ultrasound (pocus) assessment. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of point-of-care ultrasound (pocus) assessment."
      }
    ]
  }
};
