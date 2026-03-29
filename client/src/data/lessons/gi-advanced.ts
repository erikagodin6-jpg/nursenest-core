import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";
const imgEsophagealVarices = getAssetUrl("esophagealvarices_1773374861631.png");
const imgBariatricSurgery = getAssetUrl("bariatricsurgery_1773517432559.png");

export const giAdvancedLessons: Record<string, LessonContent> = {
  "bariatric-surgery": {
    title: "Bariatric Surgery",
    image: imgBariatricSurgery,
    cellular: {
      title: "Bariatric Surgery - Types, Nutritional",
      content:
        "Bariatric surgery encompasses several procedures designed to promote significant weight loss in clients with morbid obesity (BMI ≥ 40, or ≥ 35 with comorbidities). The three primary surgical approaches are Roux-en-Y gastric bypass (RYGB), sleeve gastrectomy, and adjustable gastric banding. RYGB creates a small gastric pouch (approximately 30 mL) and bypasses a portion of the jejunum, resulting in both restrictive and malabsorptive mechanisms. Sleeve gastrectomy removes approximately 80% of the stomach along the greater curvature, creating a tubular 'sleeve' that restricts volume without bypassing intestinal segments. Adjustable gastric banding places an inflatable silicone band around the upper stomach to create a small proximal pouch with an adjustable stoma.\n\nAt the cellular level, these procedures alter gut hormone signaling. RYGB and sleeve gastrectomy increase glucagon-like peptide-1 (GLP-1) and peptide YY (PYY), which enhance insulin secretion and promote satiety. Ghrelin, a hunger hormone produced primarily in the gastric fundus, decreases substantially after sleeve gastrectomy because the fundus is removed. These hormonal changes contribute to improved glycemic control, often resolving type 2 diabetes even before significant weight loss occurs. The rearranged anatomy in RYGB also increases bile acid circulation, which activates farnesoid X receptors in the ileum and further modulates glucose metabolism.\n\nDumping syndrome is a major complication following RYGB, occurring when hyperosmolar chyme rapidly enters the jejunum. Early dumping (within 15-30 minutes of eating) results from fluid shifts into the intestinal lumen, causing abdominal cramping, nausea, diarrhea, diaphoresis, and tachycardia. Late dumping (1-3 hours postprandially) results from reactive hypoglycemia as excessive insulin is released in response to rapid glucose absorption. Nutritional deficiencies are common after malabsorptive procedures; iron, calcium, vitamin B12, folate, and fat-soluble vitamins (A, D, E, K) require lifelong supplementation. Clients must adhere to small, frequent, high-protein meals and avoid simple carbohydrates and liquids with meals."
    },
    riskFactors: [
      "BMI ≥ 40 or BMI ≥ 35 with obesity-related comorbidities",
      "Failed conservative weight loss measures (diet, exercise, pharmacotherapy)",
      "Type 2 diabetes, obstructive sleep apnea, or hypertension related to obesity",
      "History of binge eating disorder or uncontrolled psychiatric illness",
      "Smoking (increases anastomotic leak risk)",
      "Age extremes (adolescents and older adults carry higher surgical risk)",
      "Prior abdominal surgeries increasing adhesion risk"
    ],
    diagnostics: [
      "Preoperative: comprehensive metabolic panel, HbA1c, lipid panel, thyroid function",
      "Upper GI endoscopy to evaluate esophageal and gastric pathology",
      "Psychological evaluation for readiness and eating disorder screening",
      "Polysomnography for obstructive sleep apnea assessment",
      "Nutritional labs: iron, ferritin, B12, folate, vitamin D, calcium, albumin"
    ],
    management: [
      "Preoperative: weight loss of 5-10% to reduce liver size and surgical risk",
      "Postoperative diet progression: clear liquids → full liquids → pureed → soft → regular over 6-8 weeks",
      "Lifelong vitamin and mineral supplementation (multivitamin, calcium citrate, B12, iron, vitamin D)",
      "High-protein diet (60-80 g/day minimum) with small, frequent meals",
      "Avoid simple sugars, carbonated beverages, and drinking fluids with meals to prevent dumping syndrome",
      "Regular follow-up with bariatric team at 1, 3, 6, and 12 months, then annually"
    ],
    nursingActions: [
      "Monitor for signs of anastomotic leak: tachycardia, fever, abdominal pain, left shoulder pain",
      "Administer antiemetics as ordered for postoperative nausea",
      "Educate client on dumping syndrome prevention: eat slowly, avoid concentrated sweets, lie down after meals",
      "Report signs of dehydration: decreased urine output, dry mucous membranes, tachycardia",
      "Monitor and report nutritional deficiency symptoms: paresthesias, fatigue, hair loss, bone pain",
      "Encourage early ambulation to prevent DVT and promote GI motility"
    ],
    signs: {
      left: [
        "Early dumping: nausea, cramping, diarrhea within 15-30 min of eating",
        "Late dumping: diaphoresis, tremors, confusion 1-3 hours after eating",
        "Anastomotic leak: tachycardia > 120, fever, severe abdominal pain",
        "Nutritional deficiency: paresthesias, weakness, glossitis"
      ],
      right: [
        "Dehydration: oliguria, orthostatic hypotension, poor skin turgor",
        "Stricture: progressive dysphagia, vomiting, food intolerance",
        "Marginal ulcer: epigastric pain, GI bleeding, melena",
        "Internal hernia: intermittent severe crampy abdominal pain"
      ]
    },
    medications: [
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 antagonist)",
        action: "Blocks serotonin receptors in the chemoreceptor trigger zone and vagal nerve terminals to reduce nausea and vomiting",
        sideEffects: "Headache, constipation, QT prolongation",
        contra: "Congenital long QT syndrome, concurrent use of QT-prolonging drugs",
        pearl: "Administer as ordered for postoperative nausea; monitor ECG in clients with cardiac history"
      },
      {
        name: "Cyanocobalamin (Vitamin B12)",
        type: "Vitamin supplement",
        action: "Essential cofactor for DNA synthesis and neurological function; absorption impaired after RYGB due to bypassed intrinsic factor production",
        sideEffects: "Injection site pain (IM route), rare anaphylaxis",
        contra: "Cobalt hypersensitivity",
        pearl: "Sublingual or IM administration preferred post-RYGB because oral absorption is significantly reduced"
      }
    ],
    pearls: [
      "Tachycardia is the earliest sign of anastomotic leak; report heart rate > 120 immediately",
      "Dumping syndrome is managed through diet modification, not medication; teach clients to avoid concentrated sweets",
      "Clients must separate liquids from solids by at least 30 minutes to prevent dumping",
      "Weight regain is common 2-5 years postoperatively; ongoing behavioral support is essential",
      "RYGB alters drug absorption; report to provider when new medications are ordered"
    ],
    quiz: [
      {
        question: "A client 2 days post Roux-en-Y gastric bypass develops tachycardia (HR 128), low-grade fever, and complains of left shoulder pain. What should the nurse suspect?",
        options: [
          "Dumping syndrome",
          "Anastomotic leak",
          "Pulmonary embolism",
          "Reactive hypoglycemia"
        ],
        correct: 1,
        rationale: "Tachycardia, fever, and left shoulder pain (referred from diaphragmatic irritation) are classic signs of anastomotic leak after RYGB. This is a surgical emergency requiring immediate reporting to the provider."
      }
    ]
  },

  "cholecystitis": {
    title: "Cholecystitis",
    cellular: {
      title: "Cholecystitis - Gallstone Pathophysiology",
      content:
        "Cholecystitis is inflammation of the gallbladder, most commonly caused by obstruction of the cystic duct by gallstones (cholelithiasis). Gallstones form when bile becomes supersaturated with cholesterol or bilirubin, leading to crystal nucleation and stone growth. Cholesterol stones account for approximately 80% of cases and are associated with the 'Five Fs': Female, Forty, Fat, Fertile, and Fair. Pigment stones (calcium bilirubinate) are associated with chronic hemolysis and cirrhosis. When a stone lodges in the cystic duct, bile stasis occurs, causing increased intraluminal pressure, mucosal ischemia, and inflammatory cascade activation.\n\nAt the cellular level, the obstructed gallbladder releases phospholipase A, which converts lecithin in bile to lysolecithin; a potent cytotoxic agent that damages the mucosal epithelium. Prostaglandin release triggers further inflammation, edema, and impaired venous and lymphatic drainage. If left untreated, the gallbladder wall becomes ischemic, leading to gangrenous cholecystitis and potential perforation. Secondary bacterial infection (Escherichia coli, Klebsiella, Enterococcus) can occur in approximately 50% of acute cases. Acalculous cholecystitis (without stones) occurs in critically ill or immunocompromised clients due to bile stasis, ischemia, or opportunistic infection.\n\nMurphy's sign is a key physical examination finding: the examiner palpates the right upper quadrant while the client inspires deeply; a positive sign occurs when the inflamed gallbladder descends and contacts the examining hand, causing the client to abruptly halt inspiration due to pain. Complications include choledocholithiasis (stone in the common bile duct), cholangitis (infection of the bile duct system presenting with Charcot's triad: fever, jaundice, RUQ pain), and gallstone pancreatitis. Surgical management (laparoscopic cholecystectomy) is the gold standard treatment, while medical management with ursodeoxycholic acid may be used for non-surgical candidates."
    },
    riskFactors: [
      "Female sex (estrogen increases cholesterol secretion into bile)",
      "Age over 40 years",
      "Obesity and rapid weight loss (increases bile cholesterol saturation)",
      "Multiparity (pregnancy increases gallbladder stasis)",
      "Oral contraceptive or hormone replacement therapy use",
      "Native American or Hispanic ethnicity",
      "Diabetes mellitus, hyperlipidemia, and metabolic syndrome",
      "Total parenteral nutrition (bile stasis)"
    ],
    diagnostics: [
      "Right upper quadrant ultrasound: gallstones, gallbladder wall thickening (> 3 mm), pericholecystic fluid",
      "HIDA scan (hepatobiliary iminodiacetic acid): non-visualization of gallbladder confirms cystic duct obstruction",
      "CBC: leukocytosis with left shift indicating infection",
      "Liver function tests: elevated ALP, GGT; elevated bilirubin if CBD obstruction",
      "Serum lipase/amylase to rule out concurrent pancreatitis"
    ],
    management: [
      "NPO status to rest the gallbladder and reduce stimulation",
      "IV fluid resuscitation and electrolyte correction",
      "Laparoscopic cholecystectomy within 24-72 hours of presentation (gold standard)",
      "IV antibiotics for complicated cholecystitis (piperacillin-tazobactam or ceftriaxone + metronidazole)",
      "Percutaneous cholecystostomy tube for critically ill or non-surgical candidates",
      "Low-fat diet education for post-cholecystectomy discharge"
    ],
    nursingActions: [
      "Monitor and report signs of biliary obstruction: clay-colored stools, dark amber urine, jaundice",
      "Administer analgesics as ordered (ketorolac or meperidine preferred; avoid morphine; may cause sphincter of Oddi spasm)",
      "Monitor T-tube drainage if placed: record amount, color, consistency; report drainage > 500 mL/day",
      "Position client in semi-Fowler's or right side-lying to facilitate bile drainage",
      "Report signs of peritonitis: rigid abdomen, rebound tenderness, guarding, fever"
    ],
    signs: {
      left: [
        "Positive Murphy's sign (inspiratory arrest on RUQ palpation)",
        "Right upper quadrant pain radiating to right scapula",
        "Nausea and vomiting, especially after fatty meals",
        "Low-grade fever and tachycardia"
      ],
      right: [
        "Jaundice (suggests common bile duct involvement)",
        "Clay-colored (acholic) stools and dark urine",
        "Charcot's triad: fever, jaundice, RUQ pain (cholangitis)",
        "Reynolds' pentad: Charcot's triad + hypotension + altered mental status"
      ]
    },
    medications: [
      {
        name: "Ursodiol (Actigall)",
        type: "Bile acid dissolution agent",
        action: "Reduces cholesterol secretion and promotes gradual dissolution of cholesterol gallstones",
        sideEffects: "Diarrhea, nausea, abdominal pain, headache",
        contra: "Calcified stones, bile duct obstruction, chronic liver disease",
        pearl: "Used only for small cholesterol stones in non-surgical candidates; takes 6-24 months for dissolution"
      },
      {
        name: "Ketorolac (Toradol)",
        type: "NSAID analgesic",
        action: "Inhibits cyclooxygenase (COX-1 and COX-2) to reduce prostaglandin synthesis and inflammation-mediated pain",
        sideEffects: "GI bleeding, renal impairment, platelet dysfunction",
        contra: "Renal insufficiency, active GI bleeding, concurrent anticoagulation, use > 5 days",
        pearl: "Preferred over morphine for biliary colic because it does not cause sphincter of Oddi spasm"
      }
    ],
    pearls: [
      "Avoid morphine in cholecystitis; it may cause sphincter of Oddi spasm and worsen pain",
      "Murphy's sign differentiates cholecystitis from other RUQ pathology",
      "Post-cholecystectomy clients may experience transient diarrhea due to continuous bile flow into the duodenum",
      "Charcot's triad (fever, jaundice, RUQ pain) indicates ascending cholangitis; a medical emergency"
    ],
    quiz: [
      {
        question: "Which analgesic should the nurse question if ordered for a client with acute cholecystitis?",
        options: [
          "Ketorolac (Toradol)",
          "Morphine sulfate",
          "Acetaminophen (Tylenol)",
          "Hydromorphone (Dilaudid)"
        ],
        correct: 1,
        rationale: "Morphine can cause sphincter of Oddi spasm, potentially worsening biliary pain. Ketorolac or meperidine are preferred alternatives. The nurse should question the morphine order and report to the provider."
      }
    ]
  },

  "cirrhosis": {
    title: "Cirrhosis",
    cellular: {
      title: "Cirrhosis - Hepatocyte Destruction, Fibrosis",
      content:
        "Cirrhosis represents the end stage of chronic liver disease, characterized by irreversible replacement of normal hepatic parenchyma with fibrotic scar tissue and regenerative nodules. The most common causes include chronic alcohol use disorder, chronic hepatitis B and C infection, and non-alcoholic steatohepatitis (NASH). At the cellular level, persistent hepatocyte injury activates hepatic stellate cells, which transform from quiescent vitamin A-storing cells into myofibroblast-like cells that deposit excessive extracellular matrix proteins, primarily type I and III collagen, within the space of Disse.\n\nThis progressive fibrosis disrupts the hepatic sinusoidal architecture, increasing intrahepatic vascular resistance and leading to portal hypertension. As functional hepatocyte mass declines, the liver loses its ability to synthesize albumin, clotting factors (II, VII, IX, X), and bile; conjugate and excrete bilirubin; metabolize ammonia to urea via the urea cycle; and detoxify drugs and hormones. Hypoalbuminemia reduces plasma oncotic pressure, contributing to ascites and peripheral edema. Impaired clotting factor synthesis leads to coagulopathy, and failure to metabolize estrogen results in gynecomastia, spider angiomata, and palmar erythema in male clients.\n\nThe Child-Pugh classification system assesses cirrhosis severity using five parameters: serum albumin, serum bilirubin, INR/prothrombin time, ascites severity, and hepatic encephalopathy grade. Class A (5-6 points) indicates well-compensated disease, Class B (7-9 points) indicates significant functional compromise, and Class C (10-15 points) indicates decompensated cirrhosis with poor prognosis. The Model for End-Stage Liver Disease (MELD) score uses serum creatinine, bilirubin, and INR to predict 90-day mortality and prioritize liver transplant allocation."
    },
    riskFactors: [
      "Chronic alcohol use disorder (most common cause in Western countries)",
      "Chronic hepatitis B or C infection",
      "Non-alcoholic fatty liver disease (NAFLD)/NASH",
      "Autoimmune hepatitis",
      "Primary biliary cholangitis or primary sclerosing cholangitis",
      "Hemochromatosis (iron overload) or Wilson's disease (copper overload)",
      "Prolonged exposure to hepatotoxic drugs (methotrexate, isoniazid, amiodarone)",
      "Alpha-1 antitrypsin deficiency"
    ],
    diagnostics: [
      "Liver function tests: elevated AST/ALT (AST > ALT in alcoholic cirrhosis), elevated ALP, GGT",
      "Serum albumin (decreased), bilirubin (elevated), INR/PT (prolonged)",
      "CBC: thrombocytopenia (splenic sequestration), anemia (chronic disease or GI bleeding)",
      "Abdominal ultrasound with Doppler: nodular liver surface, splenomegaly, portal vein flow assessment",
      "Liver biopsy: definitive diagnosis showing fibrosis, regenerative nodules, and hepatocyte necrosis",
      "Upper endoscopy to screen for esophageal varices"
    ],
    management: [
      "Treat underlying cause: alcohol cessation, antiviral therapy for hepatitis B/C",
      "Sodium restriction (< 2 g/day) and fluid restriction for ascites management",
      "Diuretic therapy: spironolactone (primary) with furosemide (adjunct) in 100:40 mg ratio",
      "Lactulose and rifaximin for hepatic encephalopathy prevention and treatment",
      "Beta-blocker therapy (propranolol or nadolol) for variceal bleeding prophylaxis",
      "Liver transplant evaluation for decompensated cirrhosis (Child-Pugh C)"
    ],
    nursingActions: [
      "Monitor and report signs of hepatic encephalopathy: confusion, asterixis, fetor hepaticus",
      "Measure abdominal girth daily at the same level to track ascites progression",
      "Monitor for bleeding: check stool for occult blood, assess gums, monitor platelet count and INR",
      "Administer lactulose as ordered; titrate to 2-3 soft stools per day",
      "Weigh client daily and monitor strict intake and output",
      "Implement fall precautions for clients with encephalopathy or coagulopathy"
    ],
    signs: {
      left: [
        "Jaundice and scleral icterus (impaired bilirubin conjugation)",
        "Ascites and peripheral edema (hypoalbuminemia, portal hypertension)",
        "Spider angiomata on upper trunk and face",
        "Palmar erythema and gynecomastia (impaired estrogen metabolism)"
      ],
      right: [
        "Asterixis (flapping tremor); indicates hepatic encephalopathy",
        "Caput medusae (dilated periumbilical veins)",
        "Fetor hepaticus (musty, sweet breath odor)",
        "Splenomegaly with thrombocytopenia"
      ]
    },
    medications: [
      {
        name: "Spironolactone (Aldactone)",
        type: "Potassium-sparing diuretic (aldosterone antagonist)",
        action: "Blocks aldosterone receptors in the distal tubule, promoting sodium and water excretion while retaining potassium; counteracts secondary hyperaldosteronism in cirrhosis",
        sideEffects: "Hyperkalemia, gynecomastia, menstrual irregularities",
        contra: "Hyperkalemia, severe renal impairment, concurrent potassium supplementation",
        pearl: "First-line diuretic for cirrhotic ascites; often combined with furosemide in a 100:40 ratio to maintain potassium balance"
      },
      {
        name: "Lactulose",
        type: "Osmotic laxative / ammonia-reducing agent",
        action: "Metabolized by colonic bacteria to lactic acid, which lowers colonic pH, converting ammonia (NH3) to ammonium (NH4+) which cannot be reabsorbed; also acts as osmotic laxative to increase fecal ammonia excretion",
        sideEffects: "Diarrhea, abdominal bloating, flatulence, electrolyte imbalances",
        contra: "Galactosemia, bowel obstruction",
        pearl: "Titrate dose to achieve 2-3 soft stools per day; excessive diarrhea can cause dehydration and worsen encephalopathy"
      }
    ],
    pearls: [
      "AST:ALT ratio > 2:1 suggests alcoholic liver disease",
      "Spironolactone and furosemide are given in a 100:40 mg ratio for ascites management",
      "Asterixis (liver flap) is a hallmark finding of hepatic encephalopathy",
      "Restrict dietary protein only during acute encephalopathy episodes; chronic restriction leads to muscle wasting",
      "Thrombocytopenia in cirrhosis results from splenic sequestration, not bone marrow failure"
    ],
    quiz: [
      {
        question: "A client with cirrhosis is prescribed spironolactone 100 mg and furosemide 40 mg daily. Which lab value should the nurse monitor most closely?",
        options: [
          "Serum sodium",
          "Serum potassium",
          "Serum calcium",
          "Serum magnesium"
        ],
        correct: 1,
        rationale: "Spironolactone is potassium-sparing while furosemide is potassium-wasting. The combination is designed to maintain potassium balance, but serum potassium must be monitored closely to prevent dangerous hyperkalemia or hypokalemia."
      }
    ]
  },

  "portal-hypertension": {
    title: "Portal Hypertension",
    cellular: {
      title: "Portal Hypertension - Increased Portal Venous",
      content:
        "Portal hypertension is defined as a hepatic venous pressure gradient (HVPG) exceeding 5 mmHg, with clinically significant portal hypertension occurring at ≥ 10 mmHg. The portal venous system drains blood from the GI tract, spleen, pancreas, and gallbladder to the liver via the portal vein. In cirrhosis, progressive fibrosis and regenerative nodules compress hepatic sinusoids and increase intrahepatic vascular resistance. Simultaneously, splanchnic vasodilation mediated by excessive nitric oxide (NO) production increases portal venous inflow, creating a hyperdynamic circulatory state.\n\nAt the cellular level, activated hepatic stellate cells contract around sinusoids (functioning as hepatic pericytes), further increasing resistance. The imbalance between vasoconstrictors (endothelin-1, thromboxane A2) and vasodilators (nitric oxide) within the liver contributes to the pathology. The increased portal pressure opens portosystemic collateral pathways; these collaterals decompress the portal system but are fragile, thin-walled vessels that can rupture. Major collateral sites include esophageal varices, gastric varices, rectal hemorrhoids, and caput medusae (periumbilical veins).\n\nThe hyperdynamic circulation triggers activation of the renin-angiotensin-aldosterone system (RAAS) and sympathetic nervous system, leading to sodium and water retention that exacerbates ascites and edema. Splenomegaly results from venous congestion, causing hypersplenism with sequestration and destruction of platelets, white blood cells, and red blood cells. When HVPG exceeds 12 mmHg, the risk of variceal hemorrhage increases dramatically; this is a life-threatening emergency with mortality rates of 15-20% per bleeding episode."
    },
    riskFactors: [
      "Cirrhosis (most common cause in developed countries)",
      "Chronic hepatitis B or C infection",
      "Alcoholic liver disease",
      "Schistosomiasis (most common cause worldwide)",
      "Portal vein thrombosis or Budd-Chiari syndrome",
      "Non-cirrhotic portal fibrosis",
      "Right-sided heart failure causing hepatic congestion"
    ],
    diagnostics: [
      "Abdominal ultrasound with Doppler: portal vein diameter > 13 mm, reversed portal flow, splenomegaly",
      "Upper GI endoscopy: esophageal and gastric varices grading",
      "Hepatic venous pressure gradient (HVPG) measurement via transjugular catheterization",
      "CT or MRI angiography for portosystemic collateral mapping",
      "CBC: thrombocytopenia (< 150,000), leukopenia from hypersplenism",
      "Platelet count-to-spleen diameter ratio for non-invasive assessment"
    ],
    management: [
      "Non-selective beta-blockers (propranolol or nadolol) for primary prophylaxis of variceal bleeding",
      "Endoscopic variceal ligation (banding) for medium-to-large varices",
      "TIPS (transjugular intrahepatic portosystemic shunt) for refractory ascites or recurrent variceal bleeding",
      "Sodium restriction and diuretics (spironolactone + furosemide) for ascites",
      "Antibiotic prophylaxis (norfloxacin or ceftriaxone) during acute variceal bleeding",
      "Liver transplant evaluation for decompensated disease"
    ],
    nursingActions: [
      "Monitor for signs of variceal bleeding: hematemesis, melena, tachycardia, hypotension",
      "Maintain large-bore IV access and ensure blood type and crossmatch are current",
      "Monitor and report changes in abdominal girth, weight, and edema",
      "Administer octreotide as ordered for acute variceal bleeding (reduces splanchnic blood flow)",
      "Educate client on avoiding NSAIDs, aspirin, and alcohol",
      "Report signs of spontaneous bacterial peritonitis: fever, abdominal pain, worsening ascites"
    ],
    signs: {
      left: [
        "Splenomegaly with palpable spleen below left costal margin",
        "Ascites: shifting dullness, fluid wave, increased abdominal girth",
        "Caput medusae (visible periumbilical collateral veins)",
        "Hemorrhoidal bleeding from rectal varices"
      ],
      right: [
        "Esophageal variceal bleeding: massive hematemesis, melena",
        "Hypersplenism: thrombocytopenia, leukopenia, anemia",
        "Hepatorenal syndrome: oliguria, rising creatinine, hyponatremia",
        "Spider angiomata and palmar erythema"
      ]
    },
    medications: [
      {
        name: "Propranolol (Inderal)",
        type: "Non-selective beta-blocker",
        action: "Blocks β1 and β2 adrenergic receptors, reducing cardiac output (β1) and causing splanchnic vasoconstriction (β2 blockade), thereby decreasing portal venous inflow and pressure",
        sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm, masked hypoglycemia",
        contra: "Severe bradycardia, heart block, decompensated heart failure, asthma/severe COPD",
        pearl: "Titrate to resting heart rate of 55-60 bpm; do not use in acute variceal bleeding; start after hemorrhage is controlled"
      },
      {
        name: "Octreotide (Sandostatin)",
        type: "Somatostatin analog",
        action: "Inhibits release of vasodilatory hormones (glucagon), causing splanchnic vasoconstriction and reducing portal blood flow and pressure",
        sideEffects: "Hyperglycemia, bradycardia, abdominal pain, gallstone formation with long-term use",
        contra: "Hypersensitivity to octreotide",
        pearl: "First-line pharmacologic agent for acute variceal bleeding; administer as IV bolus followed by continuous infusion for 3-5 days"
      }
    ],
    pearls: [
      "HVPG ≥ 10 mmHg defines clinically significant portal hypertension; ≥ 12 mmHg increases variceal bleeding risk",
      "Non-selective beta-blockers reduce portal pressure by 20-25% and are first-line for variceal prophylaxis",
      "TIPS is reserved for refractory cases; it can worsen hepatic encephalopathy by shunting portal blood past the liver",
      "All clients with cirrhosis should undergo screening endoscopy for varices at diagnosis"
    ],
    quiz: [
      {
        question: "A client with known portal hypertension presents with sudden hematemesis and a heart rate of 130 bpm. Which medication should the nurse anticipate administering first?",
        options: [
          "Propranolol IV push",
          "Octreotide IV bolus followed by infusion",
          "Furosemide IV push",
          "Lactulose via nasogastric tube"
        ],
        correct: 1,
        rationale: "Octreotide is the first-line pharmacologic agent for acute variceal bleeding. It reduces splanchnic blood flow and portal pressure. Propranolol is used for prophylaxis, not acute bleeding management."
      }
    ]
  },

  "ascites": {
    title: "Ascites",
    cellular: {
      title: "Ascites - Fluid Accumulation, Paracentesis",
      content:
        "Ascites is the pathological accumulation of serous fluid within the peritoneal cavity, most commonly resulting from portal hypertension secondary to cirrhosis (accounting for approximately 85% of cases). The pathophysiology involves a complex interplay of hemodynamic and neurohumoral mechanisms. Portal hypertension increases hydrostatic pressure in the splanchnic capillary bed, driving fluid transudation into the peritoneal space. Simultaneously, hepatic dysfunction leads to decreased albumin synthesis, reducing plasma oncotic pressure and further favoring fluid extravasation.\n\nAt the cellular level, splanchnic vasodilation (mediated by excessive nitric oxide and other vasodilators) causes effective arterial underfilling, activating the RAAS, sympathetic nervous system, and non-osmotic release of antidiuretic hormone (ADH/vasopressin). These compensatory mechanisms promote avid renal sodium and water retention, perpetuating the cycle of fluid accumulation. The serum-ascites albumin gradient (SAAG) is the key diagnostic tool: SAAG ≥ 1.1 g/dL indicates portal hypertension as the cause (transudate), while SAAG < 1.1 g/dL suggests other etiologies such as peritoneal carcinomatosis, tuberculosis, or nephrotic syndrome (exudate).\n\nLarge-volume paracentesis (LVP) is performed for tense ascites causing respiratory compromise or significant discomfort. When more than 5 liters are removed, IV albumin (6-8 g per liter removed) must be administered to prevent post-paracentesis circulatory dysfunction (PPCD); a syndrome characterized by rapid reaccumulation of ascites, renal impairment, and hyponatremia. Spontaneous bacterial peritonitis (SBP) is a life-threatening complication occurring in 10-30% of hospitalized clients with ascites, diagnosed by ascitic fluid absolute neutrophil count ≥ 250 cells/mm³."
    },
    riskFactors: [
      "Cirrhosis with portal hypertension (most common cause)",
      "Alcoholic liver disease",
      "Chronic hepatitis B or C",
      "Heart failure (right-sided or biventricular)",
      "Nephrotic syndrome or peritoneal dialysis",
      "Peritoneal carcinomatosis (ovarian, gastric, colon cancer)",
      "Budd-Chiari syndrome (hepatic vein thrombosis)",
      "Pancreatitis or pancreatic duct disruption"
    ],
    diagnostics: [
      "Diagnostic paracentesis: cell count, albumin, total protein, culture, Gram stain",
      "SAAG calculation (serum albumin − ascitic albumin): ≥ 1.1 = portal hypertension",
      "Ascitic fluid neutrophil count ≥ 250 cells/mm³ = spontaneous bacterial peritonitis",
      "Abdominal ultrasound: detects as little as 100 mL of fluid; guides paracentesis",
      "Serum albumin, BUN, creatinine, electrolytes to assess hepatorenal function"
    ],
    management: [
      "Sodium restriction: < 2 g/day (88 mmol/day)",
      "Diuretic therapy: spironolactone 100 mg + furosemide 40 mg daily (100:40 ratio), titrate every 3-5 days",
      "Large-volume paracentesis with IV albumin replacement (6-8 g/L removed if > 5 L drained)",
      "TIPS placement for diuretic-refractory ascites",
      "Antibiotic prophylaxis for SBP prevention (norfloxacin or trimethoprim-sulfamethoxazole)",
      "Fluid restriction (1-1.5 L/day) only if serum sodium < 125 mEq/L"
    ],
    nursingActions: [
      "Measure abdominal girth daily at the level of the umbilicus, at the same time each day",
      "Monitor daily weight: goal weight loss 0.5 kg/day (without peripheral edema) or 1 kg/day (with edema)",
      "Monitor strict intake and output; report urine output < 0.5 mL/kg/hr",
      "During paracentesis: position client upright or slightly lateral; monitor vital signs every 15 minutes",
      "Administer IV albumin as ordered during large-volume paracentesis to prevent circulatory collapse",
      "Report signs of SBP: fever, abdominal pain, worsening encephalopathy, rebound tenderness"
    ],
    signs: {
      left: [
        "Abdominal distension with shifting dullness on percussion",
        "Fluid wave test positive",
        "Weight gain and increased abdominal girth",
        "Dyspnea from diaphragmatic elevation"
      ],
      right: [
        "Peripheral edema (pedal, pretibial, sacral)",
        "Umbilical hernia from increased intra-abdominal pressure",
        "SBP signs: fever, diffuse abdominal pain, cloudy ascitic fluid",
        "Hepatorenal syndrome: progressive oliguria, rising creatinine"
      ]
    },
    medications: [
      {
        name: "Spironolactone (Aldactone)",
        type: "Potassium-sparing diuretic",
        action: "Antagonizes aldosterone at the collecting duct, promoting sodium and water excretion while retaining potassium; addresses the secondary hyperaldosteronism driving ascites",
        sideEffects: "Hyperkalemia, gynecomastia, breast tenderness, menstrual irregularities",
        contra: "Hyperkalemia (> 5.5 mEq/L), anuria, Addison's disease",
        pearl: "First-line diuretic for ascites; monitor potassium closely, especially when combined with ACE inhibitors or ARBs"
      },
      {
        name: "Albumin (human) 25%",
        type: "Plasma volume expander",
        action: "Increases plasma oncotic pressure, drawing fluid from the interstitial and peritoneal spaces back into the intravascular compartment; prevents post-paracentesis circulatory dysfunction",
        sideEffects: "Fluid overload, pulmonary edema, allergic reactions, hypertension",
        contra: "Severe anemia, heart failure (use with caution)",
        pearl: "Administer 6-8 g per liter of ascites removed during large-volume paracentesis exceeding 5 L"
      }
    ],
    pearls: [
      "SAAG ≥ 1.1 g/dL = portal hypertension-related ascites (95% accuracy)",
      "Always perform diagnostic paracentesis on new-onset ascites and in any hospitalized client with ascites to rule out SBP",
      "Weight loss goal: 0.5 kg/day without edema, 1 kg/day with edema; faster diuresis risks hepatorenal syndrome",
      "Post-paracentesis albumin (6-8 g/L) is only required when > 5 L is removed"
    ],
    quiz: [
      {
        question: "During a large-volume paracentesis, 7 liters of ascitic fluid are removed. What should the nurse administer as ordered to prevent post-paracentesis circulatory dysfunction?",
        options: [
          "Normal saline 500 mL IV bolus",
          "IV albumin 6-8 g per liter removed",
          "Furosemide 80 mg IV push",
          "Packed red blood cells 1 unit"
        ],
        correct: 1,
        rationale: "When more than 5 liters of ascitic fluid are removed, IV albumin (6-8 g per liter drained) must be administered to maintain intravascular volume and prevent post-paracentesis circulatory dysfunction, which can lead to renal failure and rapid ascites reaccumulation."
      }
    ]
  },

  "esophageal-varices": {
    title: "Esophageal Varices",
    image: imgEsophagealVarices,
    cellular: {
      title: "Esophageal Varices - Variceal Bleeding",
      content:
        "Esophageal varices are dilated, tortuous submucosal veins in the lower esophagus that develop as portosystemic collaterals when portal pressure exceeds 10 mmHg. As portal hypertension increases, blood is diverted from the high-pressure portal system through the left gastric (coronary) vein into the esophageal venous plexus, which drains into the azygos system and systemic circulation. These collateral vessels are thin-walled, lack the structural support of normal veins, and progressively dilate under increasing pressure.\n\nAt the cellular level, the variceal wall consists of a single layer of endothelium with minimal smooth muscle and connective tissue support. As wall tension increases (according to Laplace's law: tension = pressure × radius / wall thickness), the risk of rupture escalates. Varices are most likely to bleed when they are large (> 5 mm), when portal pressure exceeds 12 mmHg, and when red wale marks (longitudinal red streaks indicating areas of extreme wall thinning) are present on endoscopy. Variceal hemorrhage is a medical emergency with 15-20% mortality per bleeding episode.\n\nAcute management involves hemodynamic resuscitation, pharmacologic therapy with vasoconstrictors (octreotide or terlipressin), and emergent upper endoscopy with variceal ligation (banding). Balloon tamponade (Sengstaken-Blakemore or Minnesota tube) is a temporizing bridge to definitive therapy when endoscopy is not immediately available or fails to control bleeding. The esophageal balloon is inflated to apply direct pressure against the bleeding varices, while the gastric balloon anchors the device. Balloon tamponade carries significant risks including esophageal rupture, aspiration, and pressure necrosis, and should not remain inflated for more than 24 hours."
    },
    riskFactors: [
      "Cirrhosis with portal hypertension (HVPG ≥ 10 mmHg)",
      "Large variceal size (> 5 mm) with red wale marks on endoscopy",
      "Child-Pugh class B or C (decompensated cirrhosis)",
      "Active alcohol use in clients with alcoholic cirrhosis",
      "Thrombocytopenia (< 100,000/mm³) as marker of severe portal hypertension",
      "History of prior variceal bleeding (60-70% rebleeding risk within 1 year)"
    ],
    diagnostics: [
      "Upper GI endoscopy (EGD): gold standard for diagnosis, grading, and treatment",
      "Variceal grading: small (< 5 mm), medium, large (> 5 mm) with/without red wale marks",
      "CBC: hemoglobin/hematocrit (degree of blood loss), thrombocytopenia",
      "Coagulation studies: PT/INR (prolonged due to liver dysfunction)",
      "Type and crossmatch: prepare at least 2-4 units PRBCs",
      "BUN/creatinine ratio elevated from upper GI blood digestion"
    ],
    management: [
      "Hemodynamic resuscitation: crystalloid fluids and PRBCs (target Hgb 7-8 g/dL; avoid over-transfusion)",
      "Octreotide IV bolus (50 mcg) followed by continuous infusion (50 mcg/hr) for 3-5 days",
      "Emergent EGD with endoscopic variceal ligation (banding) within 12 hours",
      "Balloon tamponade (Sengstaken-Blakemore tube) as bridge if endoscopy unavailable",
      "Antibiotic prophylaxis (ceftriaxone 1 g IV daily × 7 days) to prevent SBP",
      "TIPS for recurrent or refractory variceal bleeding"
    ],
    nursingActions: [
      "Maintain patent airway; keep intubation equipment at bedside; elevate HOB 30-45 degrees",
      "Monitor hemodynamic status: vital signs every 15 minutes during active bleeding",
      "Maintain large-bore IV access (two 16-18 gauge lines); administer blood products as ordered",
      "If balloon tamponade in place: keep scissors at bedside to cut tube if respiratory distress occurs",
      "Monitor for rebleeding: ongoing hematemesis, melena, tachycardia, decreasing hemoglobin",
      "Report any change in level of consciousness (may indicate hepatic encephalopathy from blood in GI tract)"
    ],
    signs: {
      left: [
        "Massive hematemesis (bright red or coffee-ground emesis)",
        "Melena (black, tarry stools) or hematochezia",
        "Tachycardia, hypotension, and signs of hypovolemic shock",
        "Pallor, diaphoresis, and altered mental status"
      ],
      right: [
        "Hepatic encephalopathy (blood protein load increases ammonia)",
        "Aspiration pneumonia (risk from vomiting blood)",
        "Hepatorenal syndrome triggered by hemorrhagic hypovolemia",
        "Abdominal distension from blood accumulation in GI tract"
      ]
    },
    medications: [
      {
        name: "Octreotide (Sandostatin)",
        type: "Somatostatin analog",
        action: "Causes splanchnic vasoconstriction, reducing portal blood flow and portal pressure; inhibits release of vasodilatory peptides",
        sideEffects: "Hyperglycemia, bradycardia, nausea, abdominal cramping",
        contra: "Hypersensitivity to octreotide",
        pearl: "Administer 50 mcg IV bolus, then 50 mcg/hr infusion for 3-5 days; always used in conjunction with endoscopic therapy"
      },
      {
        name: "Ceftriaxone",
        type: "Third-generation cephalosporin antibiotic",
        action: "Inhibits bacterial cell wall synthesis; used as prophylaxis against spontaneous bacterial peritonitis during variceal bleeding episodes",
        sideEffects: "Diarrhea, rash, biliary sludge, Clostridioides difficile infection",
        contra: "Cephalosporin allergy; do not co-administer with calcium-containing IV solutions in neonates",
        pearl: "Prophylactic antibiotics during variceal bleeding reduce mortality by 20%; administer 1 g IV daily for 7 days as ordered"
      }
    ],
    pearls: [
      "Keep scissors at the bedside with balloon tamponade; if the tube migrates, cut and remove immediately to prevent airway obstruction",
      "Target hemoglobin 7-8 g/dL during resuscitation; over-transfusion increases portal pressure and rebleeding risk",
      "Blood in the GI tract is a protein load that increases ammonia production; monitor for hepatic encephalopathy",
      "All clients surviving variceal bleeding should be started on secondary prophylaxis (beta-blocker + banding)"
    ],
    quiz: [
      {
        question: "A client with a Sengstaken-Blakemore tube in place suddenly develops severe respiratory distress. What is the nurse's priority action?",
        options: [
          "Deflate the esophageal balloon",
          "Cut the tube and remove it immediately",
          "Increase the oxygen flow rate",
          "Notify the provider stat"
        ],
        correct: 1,
        rationale: "If a balloon tamponade tube migrates proximally, the inflated gastric balloon can occlude the airway. The nurse must cut the tube and remove it immediately. This is why scissors are kept at the bedside at all times."
      }
    ]
  },

  "hepatitis": {
    title: "Hepatitis",
    image: getAssetUrl("hepatitisb_1773340513136.png"),
    cellular: {
      title: "Hepatitis - Types A-E, Transmission, Serology",
      content:
        "Hepatitis refers to inflammation of the liver, most commonly caused by hepatotropic viruses (A, B, C, D, E). Each virus has distinct transmission routes, clinical courses, and chronicity potential. Hepatitis A (HAV) and Hepatitis E (HEV) are transmitted via the fecal-oral route through contaminated food or water. Hepatitis B (HBV), C (HCV), and D (HDV) are transmitted through blood and body fluids, including sexual contact, percutaneous exposure, and vertical (mother-to-child) transmission. HDV is a defective RNA virus that requires HBV co-infection to replicate.\n\nAt the cellular level, hepatitis viruses do not directly destroy hepatocytes; rather, liver damage results from the host immune response. Cytotoxic T lymphocytes (CD8+) recognize viral antigens presented on hepatocyte surfaces via MHC class I molecules and initiate apoptosis. In HBV, a robust immune response clears the virus but causes significant hepatocyte destruction (acute hepatitis), while a weak immune response allows viral persistence (chronic hepatitis). HCV evades immune clearance through high mutation rates in its hypervariable region, leading to chronic infection in 75-85% of cases. Chronic HBV and HCV cause ongoing necroinflammation, progressive fibrosis, cirrhosis, and hepatocellular carcinoma.\n\nKey serologic markers include: HBsAg (active HBV infection), anti-HBs (immunity from vaccination or resolved infection), HBeAg (high viral replication and infectivity), anti-HBc IgM (acute infection), and anti-HBc IgG (past or chronic infection). For HCV, anti-HCV antibody indicates exposure (past or present), while HCV RNA PCR confirms active viremia. The prodromal phase of acute hepatitis is characterized by malaise, anorexia, nausea, and RUQ discomfort, followed by the icteric phase (jaundice, dark urine, clay-colored stools) and recovery phase."
    },
    riskFactors: [
      "HAV/HEV: travel to endemic areas, contaminated food/water, poor sanitation",
      "HBV: unprotected sexual contact, IV drug use, perinatal exposure, healthcare workers",
      "HCV: IV drug use (most common in US), blood transfusion before 1992, needle-stick injury",
      "HDV: only occurs with concurrent HBV infection",
      "Immunosuppression (increased risk of chronicity)",
      "Occupational exposure (healthcare workers, first responders)",
      "Men who have sex with men (HAV, HBV)",
      "Hemodialysis clients"
    ],
    diagnostics: [
      "Hepatitis A: anti-HAV IgM (acute), anti-HAV IgG (past infection/immunity)",
      "Hepatitis B panel: HBsAg, anti-HBs, anti-HBc IgM/IgG, HBeAg, HBV DNA",
      "Hepatitis C: anti-HCV antibody (screening), HCV RNA PCR (confirms active infection)",
      "Liver function tests: ALT/AST markedly elevated (often > 1000 in acute viral hepatitis)",
      "Bilirubin (elevated), PT/INR (prolonged in severe cases), albumin (decreased if chronic)"
    ],
    management: [
      "HAV: supportive care (rest, hydration, avoid hepatotoxic substances); self-limiting",
      "HBV acute: supportive; chronic: antiviral therapy (tenofovir or entecavir)",
      "HCV: direct-acting antiviral (DAA) therapy (sofosbuvir-based regimens); 95%+ cure rate",
      "Avoid alcohol and hepatotoxic medications (acetaminophen at reduced doses)",
      "Vaccination: HAV (2-dose series), HBV (3-dose series at 0, 1, 6 months)",
      "Post-exposure prophylaxis: HBIG + HBV vaccine for needle-stick or perinatal exposure"
    ],
    nursingActions: [
      "Implement standard precautions; add contact precautions for HAV (fecal-oral transmission)",
      "Monitor liver function tests and coagulation studies as ordered",
      "Administer antiemetics as ordered for nausea; encourage small, frequent, high-calorie meals",
      "Educate client on transmission prevention: safe sex, avoid sharing personal items, hand hygiene",
      "Report signs of fulminant hepatitis: rapid decline in mental status, severe coagulopathy, shrinking liver",
      "Ensure vaccination status of household contacts and sexual partners"
    ],
    signs: {
      left: [
        "Prodromal phase: malaise, anorexia, nausea, low-grade fever, RUQ discomfort",
        "Icteric phase: jaundice, scleral icterus, dark amber urine",
        "Hepatomegaly with RUQ tenderness on palpation",
        "Clay-colored (acholic) stools"
      ],
      right: [
        "Pruritus from bile salt deposition in skin",
        "Arthralgia and urticaria (immune complex deposition, especially HBV)",
        "Fatigue and weakness persisting for weeks to months",
        "Fulminant hepatitis: coagulopathy, encephalopathy, hepatic failure"
      ]
    },
    medications: [
      {
        name: "Tenofovir disoproxil (Viread)",
        type: "Nucleotide reverse transcriptase inhibitor (antiviral)",
        action: "Inhibits HBV DNA polymerase by competing with deoxyadenosine triphosphate for incorporation into viral DNA, causing chain termination",
        sideEffects: "Nephrotoxicity, Fanconi syndrome, decreased bone mineral density, lactic acidosis",
        contra: "Severe renal impairment (dose adjustment required), concurrent nephrotoxic agents",
        pearl: "First-line for chronic HBV; monitor renal function and phosphorus levels; do not discontinue abruptly; may cause severe hepatitis flare"
      },
      {
        name: "Sofosbuvir/Ledipasvir (Harvoni)",
        type: "Direct-acting antiviral (DAA) combination",
        action: "Sofosbuvir inhibits HCV NS5B RNA-dependent RNA polymerase; ledipasvir inhibits NS5A protein essential for viral replication and assembly",
        sideEffects: "Fatigue, headache, nausea, insomnia",
        contra: "Concurrent use with amiodarone (risk of symptomatic bradycardia); not for HBV co-infection without HBV treatment",
        pearl: "Achieves > 95% sustained virologic response (SVR/cure) in 8-12 weeks; screen for HBV before starting; DAA therapy can cause HBV reactivation"
      }
    ],
    pearls: [
      "HBsAg positive = current HBV infection; anti-HBs positive = immunity (vaccine or resolved infection)",
      "HCV is the most common blood-borne infection in the US; screen all adults born 1945-1965",
      "HAV and HEV do not cause chronic hepatitis; HBV, HCV, and HDV can become chronic",
      "DAA therapy for HCV can cause HBV reactivation; always screen for HBV before starting treatment",
      "Fulminant hepatic failure is more common with HBV (especially HBV-HDV co-infection) than HCV"
    ],
    quiz: [
      {
        question: "A client's hepatitis B serology shows HBsAg negative, anti-HBs positive, anti-HBc negative. What does this indicate?",
        options: [
          "Acute hepatitis B infection",
          "Chronic hepatitis B infection",
          "Immunity from hepatitis B vaccination",
          "Resolved hepatitis B infection with natural immunity"
        ],
        correct: 2,
        rationale: "HBsAg negative (no active infection), anti-HBs positive (immunity present), anti-HBc negative (no prior exposure to virus) indicates immunity from vaccination. Natural immunity would show anti-HBc positive (prior exposure)."
      }
    ]
  },

  "pancreatitis": {
    title: "Pancreatitis",
    cellular: {
      title: "Pancreatitis - Acute vs. Chronic",
      content:
        "Pancreatitis is inflammation of the pancreas resulting from premature activation of pancreatic enzymes within the gland, leading to autodigestion of pancreatic tissue. The two most common causes are gallstones (40%) and chronic alcohol use (40%). In gallstone pancreatitis, a stone lodges at the ampulla of Vater, obstructing the pancreatic duct and causing back-pressure that triggers premature trypsinogen-to-trypsin conversion. In alcoholic pancreatitis, alcohol and its metabolites (acetaldehyde) directly damage acinar cells, increase ductal protein secretion, and form protein plugs that obstruct small pancreatic ducts.\n\nAt the cellular level, the key event is inappropriate intracellular activation of trypsinogen to trypsin within acinar cells. Normally, pancreatic enzymes are synthesized as inactive zymogens and stored in zymogen granules separated from lysosomal enzymes. Injury disrupts this compartmentalization, allowing lysosomal hydrolases (cathepsin B) to activate trypsinogen. Active trypsin then activates other zymogens; phospholipase A2, elastase, and lipase; creating a cascade of tissue destruction. Phospholipase A2 damages cell membranes, elastase destroys blood vessel walls causing hemorrhage, and lipase digests peripancreatic fat (fat necrosis). Inflammatory mediators (TNF-α, IL-1, IL-6) are released, potentially leading to systemic inflammatory response syndrome (SIRS), organ failure, and death.\n\nRanson criteria predict severity at admission (age > 55, WBC > 16,000, glucose > 200, AST > 250, LDH > 350) and at 48 hours (hematocrit drop > 10%, BUN rise > 5, calcium < 8, PaO2 < 60, base deficit > 4, fluid sequestration > 6 L). A score ≥ 3 indicates severe pancreatitis with 15% mortality; ≥ 6 indicates 40% mortality. Grey Turner sign (flank ecchymosis) and Cullen sign (periumbilical ecchymosis) indicate retroperitoneal hemorrhage and severe necrotizing pancreatitis."
    },
    riskFactors: [
      "Gallstones (most common cause overall)",
      "Chronic alcohol use (most common cause of chronic pancreatitis)",
      "Hypertriglyceridemia (> 1000 mg/dL)",
      "ERCP (endoscopic retrograde cholangiopancreatography)",
      "Medications: azathioprine, valproic acid, thiazides, estrogens",
      "Smoking",
      "Pancreatic duct obstruction (tumors, pancreas divisum)",
      "Hypercalcemia and hyperparathyroidism"
    ],
    diagnostics: [
      "Serum lipase: most sensitive and specific marker; elevated ≥ 3× upper limit of normal",
      "Serum amylase: elevated early but less specific (also elevated in salivary disease, bowel obstruction)",
      "CT abdomen with contrast: identifies necrosis, fluid collections, pseudocysts (best at 72 hours)",
      "CBC: leukocytosis; CMP: hypocalcemia (calcium sequestered in fat necrosis), hyperglycemia",
      "Ranson criteria at admission and 48 hours for severity prediction",
      "Abdominal ultrasound to evaluate for gallstones as etiology"
    ],
    management: [
      "Aggressive IV fluid resuscitation: lactated Ringer's at 250-500 mL/hr initially",
      "Pain management: IV hydromorphone or fentanyl (avoid morphine; sphincter of Oddi spasm controversy)",
      "NPO initially; early enteral nutrition via nasojejunal tube within 24-48 hours (superior to TPN)",
      "ERCP with sphincterotomy for gallstone pancreatitis with biliary obstruction",
      "Cholecystectomy during same admission for gallstone pancreatitis (once inflammation resolves)",
      "Antibiotics only for infected pancreatic necrosis; not routine prophylaxis"
    ],
    nursingActions: [
      "Position client on left side with knees flexed to reduce pain",
      "Monitor and report Cullen sign (periumbilical ecchymosis) or Grey Turner sign (flank ecchymosis); indicates hemorrhagic pancreatitis",
      "Maintain strict NPO; provide oral hygiene every 2 hours",
      "Monitor serum calcium levels: hypocalcemia can cause tetany, seizures (positive Chvostek/Trousseau signs)",
      "Administer analgesics as ordered and assess pain using validated scale",
      "Monitor blood glucose levels: pancreatic beta-cell damage can cause hyperglycemia"
    ],
    signs: {
      left: [
        "Severe epigastric pain radiating to the back, worsened by eating and lying supine",
        "Nausea, vomiting, and abdominal distension",
        "Grey Turner sign: bluish-grey discoloration of the flanks",
        "Cullen sign: bluish discoloration around the umbilicus"
      ],
      right: [
        "Hypocalcemia: Chvostek sign, Trousseau sign, tetany",
        "Tachycardia, hypotension (third-spacing, hemorrhage)",
        "Hyperglycemia from beta-cell damage",
        "Jaundice (if common bile duct is compressed by edematous pancreatic head)"
      ]
    },
    medications: [
      {
        name: "Hydromorphone (Dilaudid)",
        type: "Opioid analgesic",
        action: "Binds to mu-opioid receptors in the CNS, inhibiting ascending pain pathways and altering pain perception",
        sideEffects: "Respiratory depression, sedation, constipation, nausea, hypotension",
        contra: "Severe respiratory depression, paralytic ileus, concurrent MAOIs",
        pearl: "Often preferred over morphine in pancreatitis due to lower theoretical risk of sphincter of Oddi spasm; administer as ordered with continuous pain assessment"
      },
      {
        name: "Pancrelipase (Creon)",
        type: "Pancreatic enzyme replacement",
        action: "Provides exogenous lipase, amylase, and protease to compensate for pancreatic exocrine insufficiency, improving fat and nutrient digestion",
        sideEffects: "Nausea, cramping, diarrhea, hyperuricosuria at high doses",
        contra: "Acute pancreatitis (not used during acute phase), pork allergy",
        pearl: "Used in chronic pancreatitis with steatorrhea; administer with meals and snacks; not on an empty stomach"
      }
    ],
    pearls: [
      "Lipase is more specific than amylase for pancreatitis; amylase can be elevated in many non-pancreatic conditions",
      "Grey Turner sign and Cullen sign indicate hemorrhagic pancreatitis; a severe, life-threatening presentation",
      "Hypocalcemia occurs because calcium binds to fatty acids in areas of fat necrosis (saponification)",
      "Early enteral nutrition is preferred over TPN; maintains gut barrier integrity and reduces infectious complications",
      "Ranson score ≥ 3 at 48 hours = severe pancreatitis with significantly increased mortality"
    ],
    quiz: [
      {
        question: "A client with acute pancreatitis develops facial twitching when the nurse taps over the facial nerve. What should the nurse report and monitor for?",
        options: [
          "Hyperkalemia and cardiac arrhythmias",
          "Hypocalcemia and potential seizure activity",
          "Hypernatremia and neurological changes",
          "Hypomagnesemia and muscle weakness"
        ],
        correct: 1,
        rationale: "Facial twitching when tapping the facial nerve is a positive Chvostek sign, indicating hypocalcemia. In pancreatitis, calcium is sequestered in areas of fat necrosis. The nurse should report this finding and monitor for seizures, tetany, and cardiac arrhythmias."
      }
    ]
  },

  "ibs": {
    title: "Irritable Bowel Syndrome (IBS)",
    cellular: {
      title: "IBS - Visceral Hypersensitivity, Gut-Brain",
      content:
        "Irritable bowel syndrome (IBS) is a chronic functional gastrointestinal disorder characterized by recurrent abdominal pain associated with changes in bowel habits, in the absence of structural or biochemical abnormalities. IBS affects approximately 10-15% of the global population and is classified into four subtypes: IBS with constipation (IBS-C), IBS with diarrhea (IBS-D), mixed IBS (IBS-M), and unsubtyped IBS (IBS-U). Diagnosis is based on the Rome IV criteria: recurrent abdominal pain at least 1 day per week in the last 3 months, associated with ≥ 2 of the following: related to defecation, associated with a change in stool frequency, or associated with a change in stool form.\n\nAt the cellular and neurophysiological level, IBS involves visceral hypersensitivity; an exaggerated sensory response to normal physiological stimuli such as intestinal distension. This results from peripheral sensitization of visceral afferent neurons (upregulation of ion channels like TRPV1) and central sensitization in the spinal cord and brain. The gut-brain axis, involving bidirectional communication between the enteric nervous system and the central nervous system via vagal and spinal pathways, is dysregulated. Serotonin (5-HT) plays a crucial role: 95% of the body's serotonin is produced in enterochromaffin cells of the GI tract, and alterations in serotonin signaling affect motility, secretion, and visceral sensation.\n\nThe low-FODMAP diet (Fermentable Oligosaccharides, Disaccharides, Monosaccharides, and Polyols) has strong evidence for symptom reduction in 50-80% of IBS clients. FODMAPs are short-chain carbohydrates that are poorly absorbed in the small intestine, leading to increased water content in the bowel (osmotic effect) and rapid fermentation by colonic bacteria producing hydrogen, methane, and carbon dioxide gas. This distension triggers pain in the hypersensitive viscera. Stress, anxiety, and depression frequently coexist with IBS and amplify symptoms through the gut-brain axis; psychological interventions including cognitive behavioral therapy (CBT) have demonstrated significant benefit."
    },
    riskFactors: [
      "Female sex (2:1 female-to-male ratio)",
      "Age < 50 years (onset typically in young adulthood)",
      "History of anxiety, depression, or psychological trauma",
      "Post-infectious IBS following acute gastroenteritis",
      "Visceral hypersensitivity and altered gut motility",
      "Dietary triggers: high-FODMAP foods, caffeine, alcohol",
      "Family history of IBS",
      "History of physical or sexual abuse (central sensitization)"
    ],
    diagnostics: [
      "Rome IV criteria: clinical diagnosis based on symptom pattern and duration",
      "CBC, CRP, ESR: to exclude inflammatory bowel disease (should be normal in IBS)",
      "Tissue transglutaminase (tTG-IgA) antibody: to rule out celiac disease",
      "Stool studies: calprotectin (normal in IBS, elevated in IBD), ova and parasites",
      "Colonoscopy only if alarm features present: age > 50, rectal bleeding, weight loss, anemia, family history of colon cancer"
    ],
    management: [
      "Low-FODMAP diet: elimination phase (2-6 weeks) followed by systematic reintroduction",
      "IBS-C: fiber supplementation (psyllium), osmotic laxatives (PEG 3350), linaclotide or lubiprostone",
      "IBS-D: loperamide for symptom control, rifaximin (antibiotic), alosetron (severe cases only)",
      "Antispasmodics (dicyclomine or hyoscyamine) for cramping pain",
      "Psychological interventions: CBT, gut-directed hypnotherapy, stress management",
      "Regular exercise and adequate sleep for symptom modulation"
    ],
    nursingActions: [
      "Encourage client to keep a food and symptom diary to identify triggers",
      "Educate on the low-FODMAP diet: avoid wheat, onions, garlic, dairy (lactose), apples, honey",
      "Administer antispasmodics as ordered 30 minutes before meals",
      "Assess and report psychological symptoms: anxiety, depression, impact on quality of life",
      "Monitor stool pattern using the Bristol Stool Form Scale",
      "Reinforce that IBS does not increase colorectal cancer risk; provide reassurance"
    ],
    signs: {
      left: [
        "Recurrent abdominal pain relieved or worsened by defecation",
        "Bloating and visible abdominal distension",
        "Altered stool frequency (> 3/day or < 3/week)",
        "Mucus in stools (without blood)"
      ],
      right: [
        "Urgency and incomplete evacuation sensation",
        "Symptoms worsen with stress, anxiety, or specific foods",
        "No nocturnal symptoms (IBS symptoms typically do not wake client from sleep)",
        "No weight loss, rectal bleeding, or fever (alarm features absent)"
      ]
    },
    medications: [
      {
        name: "Dicyclomine (Bentyl)",
        type: "Anticholinergic/antispasmodic",
        action: "Blocks muscarinic acetylcholine receptors on intestinal smooth muscle, reducing spasm and pain",
        sideEffects: "Dry mouth, constipation, urinary retention, blurred vision, drowsiness",
        contra: "Myasthenia gravis, glaucoma, GI obstruction, urinary retention",
        pearl: "Administer 30 minutes before meals for best effect; monitor for anticholinergic toxicity especially in older adults"
      },
      {
        name: "Linaclotide (Linzess)",
        type: "Guanylate cyclase-C agonist",
        action: "Activates guanylate cyclase-C receptors on intestinal epithelium, increasing intracellular cGMP, which stimulates chloride and bicarbonate secretion and accelerates intestinal transit; also reduces visceral pain signaling",
        sideEffects: "Diarrhea (most common), abdominal pain, flatulence",
        contra: "Pediatric clients < 6 years (contraindicated), known mechanical GI obstruction",
        pearl: "Used for IBS-C; take on empty stomach 30 minutes before first meal of the day; discontinue if severe diarrhea develops"
      }
    ],
    pearls: [
      "IBS is a diagnosis of exclusion; alarm features (weight loss, rectal bleeding, nocturnal symptoms, anemia) warrant further workup",
      "Low-FODMAP diet should be guided by a dietitian and is not meant to be a permanent restriction",
      "Nocturnal symptoms suggest organic disease (IBD, cancer), not IBS",
      "Fecal calprotectin is a useful non-invasive marker to differentiate IBS from inflammatory bowel disease"
    ],
    quiz: [
      {
        question: "Which finding in a client with suspected IBS warrants further diagnostic workup?",
        options: [
          "Bloating that worsens after meals",
          "Abdominal pain relieved by defecation",
          "Unintentional weight loss of 10 lbs in 2 months",
          "Mucus in stools without blood"
        ],
        correct: 2,
        rationale: "Unintentional weight loss is an alarm feature that is not consistent with IBS and requires further investigation (colonoscopy, imaging) to rule out organic pathology such as inflammatory bowel disease or malignancy."
      }
    ]
  },


  "crohns-disease": {
    title: "Crohn's Disease",
    cellular: {
      title: "Crohn's Disease - Transmural Inflammation",
      content:
        "Crohn's disease is a chronic inflammatory bowel disease characterized by transmural (full-thickness) inflammation that can affect any segment of the GI tract from mouth to anus, though the terminal ileum and proximal colon are most commonly involved. Unlike ulcerative colitis, Crohn's disease produces discontinuous 'skip lesions' with segments of normal bowel interspersed between inflamed areas. The transmural nature of inflammation leads to complications unique to Crohn's: strictures, fistulae (abnormal connections between bowel loops, bladder, vagina, or skin), and abscesses.\n\nAt the cellular level, Crohn's disease is driven primarily by a Th1/Th17 immune response. Dendritic cells and macrophages in the intestinal mucosa produce excessive IL-12 and IL-23, which activate Th1 cells (producing IFN-γ and TNF-α) and Th17 cells (producing IL-17). Non-caseating granulomas; clusters of activated macrophages (epithelioid cells) surrounded by lymphocytes; are a hallmark histological finding present in approximately 30% of biopsy specimens. The mucosal surface develops a characteristic 'cobblestone' appearance due to deep longitudinal and transverse ulcers separated by areas of edematous mucosa.\n\nTerminal ileum involvement causes malabsorption of bile salts (leading to fat malabsorption, steatorrhea, and fat-soluble vitamin deficiencies) and vitamin B12 (leading to megaloblastic anemia). Transmural inflammation and fibrosis can narrow the bowel lumen, creating strictures that cause obstructive symptoms. Fistulae develop when transmural inflammation creates sinus tracts; enterocutaneous (bowel to skin), enterovesical (bowel to bladder), enterovaginal, and enteroenteric fistulae each present with characteristic symptoms. Perianal disease (fissures, fistulae, abscesses) is present in up to 50% of clients."
    },
    riskFactors: [
      "Family history of IBD (first-degree relatives have 5-20× increased risk)",
      "Ashkenazi Jewish descent",
      "Smoking (doubles the risk of Crohn's and worsens disease course; opposite of UC)",
      "Age 15-30 years at peak onset",
      "NOD2/CARD15 gene mutations",
      "Western diet high in processed foods and refined sugars",
      "NSAID use (may trigger flares)",
      "History of appendectomy (may increase risk; opposite of UC)"
    ],
    diagnostics: [
      "Colonoscopy with ileoscopy and biopsy: skip lesions, cobblestoning, aphthous ulcers, non-caseating granulomas",
      "CT enterography or MR enterography: bowel wall thickening, strictures, fistulae, abscesses",
      "ASCA (anti-Saccharomyces cerevisiae antibodies): positive in 60-70% of Crohn's (not UC)",
      "Fecal calprotectin: elevated (correlates with degree of intestinal inflammation)",
      "CBC: anemia (B12 deficiency or chronic disease), leukocytosis",
      "CRP and ESR: elevated during active disease; albumin decreased"
    ],
    management: [
      "Induction of remission: corticosteroids (budesonide for ileal/right colonic disease) or biologics",
      "Maintenance: immunomodulators (azathioprine, methotrexate) or biologics (anti-TNF, vedolizumab, ustekinumab)",
      "Nutritional support: correct B12, iron, folate, and fat-soluble vitamin deficiencies",
      "Surgical intervention for strictures, abscesses, or fistulae refractory to medical therapy",
      "Smoking cessation (most important modifiable risk factor)",
      "Perianal disease management: seton drainage, fistula plug, anti-TNF therapy"
    ],
    nursingActions: [
      "Monitor for signs of bowel obstruction: colicky pain, vomiting, abdominal distension, absent bowel sounds",
      "Assess perianal area for fistulae, fissures, and abscesses; provide wound care as ordered",
      "Monitor nutritional status and weight; administer supplements (B12, iron, folate) as ordered",
      "Educate client on smoking cessation resources; smoking worsens Crohn's disease",
      "Administer immunosuppressants as ordered; monitor for infection signs",
      "Report signs of fistula formation: passage of stool from vagina, pneumaturia (air in urine), drainage from skin"
    ],
    signs: {
      left: [
        "Right lower quadrant pain (terminal ileum involvement mimics appendicitis)",
        "Non-bloody diarrhea (unlike UC, gross blood less common)",
        "Weight loss and malnutrition from malabsorption",
        "Perianal disease: fissures, fistulae, skin tags, abscesses"
      ],
      right: [
        "Cobblestone appearance of mucosa on endoscopy",
        "Steatorrhea (fatty, foul-smelling stools from bile salt malabsorption)",
        "Stricture symptoms: post-prandial bloating, cramping, obstipation",
        "Extraintestinal: oral aphthous ulcers, erythema nodosum, arthritis, kidney stones (oxalate)"
      ]
    },
    medications: [
      {
        name: "Budesonide (Entocort EC)",
        type: "Locally-acting corticosteroid",
        action: "High topical anti-inflammatory potency with extensive first-pass hepatic metabolism, minimizing systemic steroid side effects; reduces mucosal inflammation in terminal ileum and ascending colon",
        sideEffects: "Headache, nausea, adrenal suppression at high doses, moon face (less than prednisone)",
        contra: "Systemic fungal infections, hepatic cirrhosis (reduced first-pass metabolism increases systemic effects)",
        pearl: "Preferred over prednisone for mild-moderate ileal/right-sided Crohn's due to fewer systemic side effects"
      },
      {
        name: "Adalimumab (Humira)",
        type: "Monoclonal antibody (anti-TNF-α biologic)",
        action: "Binds and neutralizes TNF-α, reducing transmural inflammation, promoting mucosal healing, and reducing fistula drainage",
        sideEffects: "Injection site reactions, increased infection risk, TB reactivation, demyelinating disease, malignancy risk",
        contra: "Active infections, untreated latent TB, moderate-severe heart failure",
        pearl: "Self-administered subcutaneous injection; screen for TB before starting; educate client to report fever, persistent cough, or signs of infection"
      }
    ],
    pearls: [
      "Smoking worsens Crohn's but paradoxically appears protective in UC; always counsel Crohn's clients on cessation",
      "Terminal ileum involvement causes B12 and bile salt malabsorption; assess for megaloblastic anemia and steatorrhea",
      "Non-caseating granulomas on biopsy are characteristic of Crohn's but not required for diagnosis",
      "Crohn's is NOT cured by surgery; post-surgical recurrence at anastomotic sites is common",
      "ASCA positive + pANCA negative favors Crohn's; pANCA positive + ASCA negative favors UC"
    ],
    quiz: [
      {
        question: "A client with Crohn's disease reports passing air and stool through the vagina. What should the nurse suspect?",
        options: [
          "Rectovaginal fistula",
          "Vaginal infection",
          "Rectal prolapse",
          "Diverticulitis"
        ],
        correct: 0,
        rationale: "Passage of air (pneumovagina) and stool through the vagina indicates a rectovaginal or enterovaginal fistula, a complication of transmural inflammation in Crohn's disease. This requires reporting to the provider for surgical evaluation."
      }
    ]
  },

  "diverticulitis": {
    title: "Diverticulitis",
    cellular: {
      title: "Diverticulitis - Diverticular Perforation",
      content:
        "Diverticulitis occurs when one or more diverticula (outpouchings of the colonic mucosa and submucosa through the muscular wall) become inflamed or infected. Diverticula form at points of weakness in the colonic wall where the vasa recta (nutrient arteries) penetrate the circular muscle layer. Low dietary fiber leads to decreased stool bulk, increased intraluminal pressure during colonic segmentation, and progressive herniation of mucosa through these weak points. The sigmoid colon is most commonly affected due to its narrower diameter and highest intraluminal pressures (according to Laplace's law).\n\nAt the cellular level, diverticulitis begins when a fecalith (hardened stool) obstructs the neck of a diverticulum, leading to mucosal erosion, bacterial overgrowth, and micro- or macro-perforation. Localized infection triggers an inflammatory cascade with neutrophil infiltration, cytokine release, and pericolic abscess formation. In uncomplicated diverticulitis, the inflammation is contained by adjacent mesentery, omentum, and pericolonic fat, forming a localized phlegmon. In complicated diverticulitis, the inflammation extends to cause abscess formation, free perforation with purulent or fecal peritonitis, fistula formation (colovesical or colovaginal), or stricture with obstruction.\n\nThe Hinchey classification system grades the severity of complicated diverticulitis: Stage I = confined pericolic abscess, Stage II = distant abscess (pelvic, retroperitoneal), Stage III = purulent peritonitis from ruptured abscess, Stage IV = fecal peritonitis from free perforation. Hinchey I and II may be managed with antibiotics and percutaneous drainage, while III and IV typically require emergent surgery (Hartmann procedure: sigmoid resection with end colostomy)."
    },
    riskFactors: [
      "Low-fiber, high-refined-carbohydrate diet",
      "Age > 50 years (diverticula prevalence increases with age)",
      "Obesity (BMI > 30)",
      "Sedentary lifestyle",
      "Chronic NSAID or corticosteroid use",
      "Smoking",
      "Immunosuppression (increases risk of complicated diverticulitis)"
    ],
    diagnostics: [
      "CT abdomen/pelvis with IV contrast: gold standard; shows colonic wall thickening, pericolic fat stranding, abscess, free air",
      "CBC: leukocytosis with left shift",
      "CRP: elevated (correlates with severity)",
      "Urinalysis: pyuria or pneumaturia may suggest colovesical fistula",
      "Colonoscopy: performed 6-8 weeks AFTER acute episode resolves (never during acute diverticulitis; risk of perforation)"
    ],
    management: [
      "Uncomplicated: clear liquid diet progressing to low-residue diet; oral antibiotics (ciprofloxacin + metronidazole or amoxicillin-clavulanate)",
      "Complicated (abscess > 3 cm): CT-guided percutaneous drainage + IV antibiotics",
      "Hinchey III/IV: emergent surgery; Hartmann procedure (sigmoid resection with end colostomy)",
      "High-fiber diet (25-35 g/day) after acute episode resolves to prevent recurrence",
      "Elective sigmoid colectomy after 2 or more uncomplicated episodes or 1 complicated episode"
    ],
    nursingActions: [
      "Maintain NPO or clear liquid diet during acute phase as ordered",
      "Administer IV antibiotics as ordered; monitor for C. difficile (antibiotic-associated diarrhea)",
      "Monitor for signs of perforation: rigid abdomen, rebound tenderness, absent bowel sounds, fever > 39°C",
      "Educate on high-fiber diet for prevention after acute episode resolves",
      "Report signs of fistula: pneumaturia (air in urine), fecaluria, recurrent UTIs (colovesical fistula)",
      "Post-surgical: provide colostomy care education if Hartmann procedure performed"
    ],
    signs: {
      left: [
        "Left lower quadrant pain (sigmoid colon involvement); 'left-sided appendicitis'",
        "Low-grade fever and localized peritoneal signs",
        "Change in bowel habits: constipation or diarrhea",
        "Nausea, vomiting, and anorexia"
      ],
      right: [
        "Palpable tender mass in LLQ (phlegmon or abscess)",
        "Peritonitis signs: rigid abdomen, rebound tenderness, guarding (perforation)",
        "Pneumaturia or fecaluria (colovesical fistula)",
        "Rectal bleeding (more common in diverticular bleeding than diverticulitis)"
      ]
    },
    medications: [
      {
        name: "Metronidazole (Flagyl)",
        type: "Nitroimidazole antibiotic/antiprotozoal",
        action: "Disrupts bacterial DNA synthesis by forming toxic free radical intermediates in anaerobic organisms; provides anaerobic coverage essential for intra-abdominal infections",
        sideEffects: "Metallic taste, nausea, peripheral neuropathy, disulfiram-like reaction with alcohol",
        contra: "First trimester pregnancy, concurrent alcohol use, concurrent disulfiram",
        pearl: "Educate client to avoid ALL alcohol during treatment and for 48 hours after; causes severe nausea, vomiting, flushing (disulfiram reaction)"
      },
      {
        name: "Ciprofloxacin (Cipro)",
        type: "Fluoroquinolone antibiotic",
        action: "Inhibits bacterial DNA gyrase and topoisomerase IV, preventing DNA replication; provides gram-negative coverage for enteric organisms",
        sideEffects: "Tendon rupture (especially Achilles), QT prolongation, photosensitivity, C. difficile risk, peripheral neuropathy",
        contra: "Myasthenia gravis, concurrent tizanidine use, children/adolescents (tendon damage), history of fluoroquinolone-associated tendinopathy",
        pearl: "Black box warning for tendon rupture; report tendon pain immediately and discontinue; avoid concurrent dairy/antacids (chelation reduces absorption)"
      }
    ],
    pearls: [
      "Never perform colonoscopy during acute diverticulitis; wait 6-8 weeks to rule out colorectal cancer",
      "Left lower quadrant pain is classic; right-sided diverticulitis occurs more in Asian populations",
      "Metronidazole + ciprofloxacin covers both aerobic and anaerobic organisms in diverticulitis",
      "Nuts, seeds, and popcorn do NOT cause diverticulitis; this is a debunked myth"
    ],
    quiz: [
      {
        question: "A client with acute diverticulitis develops a rigid abdomen, fever of 39.5°C, and absent bowel sounds. What Hinchey classification does this most likely represent?",
        options: [
          "Hinchey Stage I (pericolic abscess)",
          "Hinchey Stage II (distant abscess)",
          "Hinchey Stage III (purulent peritonitis)",
          "Hinchey Stage IV (fecal peritonitis)"
        ],
        correct: 2,
        rationale: "Rigid abdomen, high fever, and absent bowel sounds indicate peritonitis. Hinchey Stage III is purulent peritonitis from rupture of a pericolic abscess. This requires emergent surgical intervention."
      }
    ]
  },

  "hemorrhoids": {
    title: "Hemorrhoids",
    cellular: {
      title: "Hemorrhoids - Internal vs. External, Rubber",
      content:
        "Hemorrhoids are dilated, engorged vascular cushions in the anal canal. The anal canal contains three primary hemorrhoidal cushions located at the left lateral, right anterior, and right posterior positions. These cushions are composed of arteriovenous communications, smooth muscle fibers (Treitz muscle), and connective tissue. They serve a normal physiological function, contributing to anal continence by providing a mucosal seal. Hemorrhoidal disease occurs when these cushions become pathologically enlarged, displaced, or symptomatic due to increased venous pressure, straining, or weakened supporting connective tissue.\n\nInternal hemorrhoids arise above the dentate (pectinate) line from the superior hemorrhoidal venous plexus and are covered by columnar epithelium. Because the area above the dentate line is innervated by visceral afferents, internal hemorrhoids are typically painless and present with bright red rectal bleeding (hematochezia) during or after defecation. They are graded: Grade I (bleeding without prolapse), Grade II (prolapse with spontaneous reduction), Grade III (prolapse requiring manual reduction), Grade IV (irreducible prolapse). External hemorrhoids arise below the dentate line from the inferior hemorrhoidal plexus and are covered by squamous epithelium with somatic innervation; they are therefore painful, especially when thrombosed.\n\nThrombosed external hemorrhoids present as acute, severe perianal pain with a visible bluish-purple, firm, tender mass. If presenting within 48-72 hours of onset, excisional thrombectomy provides rapid relief. Conservative management includes sitz baths, topical analgesics, fiber supplementation, and stool softeners. Rubber band ligation is the most effective office-based procedure for Grade I-III internal hemorrhoids: a small band is placed around the base of the hemorrhoid above the dentate line (where there is no somatic sensation), causing ischemic necrosis and sloughing within 5-7 days."
    },
    riskFactors: [
      "Chronic constipation and prolonged straining during defecation",
      "Low-fiber diet with inadequate fluid intake",
      "Pregnancy (increased pelvic venous pressure, hormonal changes)",
      "Obesity",
      "Prolonged sitting (especially on the toilet)",
      "Chronic diarrhea",
      "Portal hypertension (causes rectal varices, not true hemorrhoids, but often coexists)",
      "Heavy lifting or vigorous exercise"
    ],
    diagnostics: [
      "Digital rectal exam: may palpate external hemorrhoids or prolapsed internal hemorrhoids",
      "Anoscopy: direct visualization of internal hemorrhoids and grading",
      "Colonoscopy or flexible sigmoidoscopy: rule out other causes of rectal bleeding (polyps, cancer) in clients > 45 or with alarm features",
      "CBC: to assess for anemia from chronic blood loss"
    ],
    management: [
      "Conservative: high-fiber diet (25-35 g/day), adequate hydration (8-10 glasses/day), stool softeners",
      "Sitz baths: warm water 3-4 times daily for 15-20 minutes to reduce edema and spasm",
      "Rubber band ligation for Grade I-III internal hemorrhoids (office procedure)",
      "Thrombosed external hemorrhoid: excisional thrombectomy if within 48-72 hours of onset",
      "Hemorrhoidectomy (surgical excision) for Grade III-IV refractory to conservative/banding therapy",
      "Avoid prolonged sitting on toilet, straining, and heavy lifting"
    ],
    nursingActions: [
      "Educate on high-fiber diet and adequate fluid intake to prevent constipation",
      "Instruct on proper sitz bath technique: warm (not hot) water, 15-20 minutes, 3-4 times daily",
      "Administer stool softeners and topical preparations as ordered",
      "Post-hemorrhoidectomy: monitor for urinary retention (common complication due to pain and reflex spasm)",
      "Encourage client to avoid straining; respond promptly to the urge to defecate",
      "Monitor for post-banding complications: excessive pain, fever, urinary retention, bleeding"
    ],
    signs: {
      left: [
        "Painless bright red rectal bleeding during defecation (internal hemorrhoids)",
        "Perianal pruritus, irritation, and mucoid discharge",
        "Prolapsed tissue visible during straining (Grade II-IV)",
        "Severe acute perianal pain (thrombosed external hemorrhoid)"
      ],
      right: [
        "Visible bluish-purple perianal mass (thrombosed external hemorrhoid)",
        "Difficulty with perianal hygiene",
        "Anemia from chronic occult blood loss (rare)",
        "Sensation of incomplete evacuation"
      ]
    },
    medications: [
      {
        name: "Docusate sodium (Colace)",
        type: "Stool softener (surfactant laxative)",
        action: "Acts as a detergent in the intestinal lumen, lowering surface tension and allowing water and fat penetration into the stool mass, producing softer stools",
        sideEffects: "Mild cramping, diarrhea, throat irritation (liquid forms)",
        contra: "Intestinal obstruction, concurrent mineral oil use (increases mineral oil absorption)",
        pearl: "Encourage adequate fluid intake (8-10 glasses/day) for best effect; ineffective without adequate hydration"
      },
      {
        name: "Hydrocortisone/Pramoxine rectal cream",
        type: "Topical corticosteroid/local anesthetic combination",
        action: "Hydrocortisone reduces local inflammation; pramoxine provides temporary anesthetic relief of perianal pain and pruritus",
        sideEffects: "Skin atrophy, burning, irritation with prolonged use",
        contra: "Fungal/viral perianal infection, prolonged use > 7 days (skin atrophy risk)",
        pearl: "Limit use to 7 days to prevent perianal skin atrophy; apply externally only unless specific rectal formulation is prescribed"
      }
    ],
    pearls: [
      "Internal hemorrhoids are painless because they are above the dentate line (visceral innervation); external hemorrhoids are painful (somatic innervation)",
      "Rubber band ligation must be placed ABOVE the dentate line to avoid pain; placement below causes severe pain",
      "Urinary retention is the most common complication after hemorrhoidectomy; monitor voiding",
      "All rectal bleeding warrants investigation for colorectal cancer, especially in clients > 45 years"
    ],
    quiz: [
      {
        question: "A client presents with severe perianal pain and a firm, bluish-purple mass at the anal verge. Symptoms began 24 hours ago. What is the recommended treatment?",
        options: [
          "Rubber band ligation",
          "Excisional thrombectomy",
          "Emergency hemorrhoidectomy",
          "Sitz baths and stool softeners only"
        ],
        correct: 1,
        rationale: "A thrombosed external hemorrhoid presenting within 48-72 hours of symptom onset is best treated with excisional thrombectomy for rapid pain relief. Beyond 72 hours, conservative management (sitz baths, analgesics, stool softeners) is appropriate as the clot begins to resolve."
      }
    ]
  },

  "antacids": {
    title: "Antacids",
    cellular: {
      title: "Antacids - Aluminum/Magnesium Hydroxide",
      content:
        "Antacids are basic compounds that directly neutralize hydrochloric acid (HCl) in the gastric lumen, raising intragastric pH and providing rapid symptomatic relief of heartburn and dyspepsia. They do not reduce acid production; they neutralize acid that has already been secreted. The three main categories are aluminum-based (aluminum hydroxide), magnesium-based (magnesium hydroxide), and calcium-based (calcium carbonate) antacids. Each has a characteristic neutralization capacity and unique side effect profile that nurses must understand to manage client care effectively.\n\nAt the chemical level, antacids undergo neutralization reactions: Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O; Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O; CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. The released CO₂ from calcium carbonate can cause belching and gastric distension. Aluminum hydroxide has a slower onset but longer duration and causes constipation by forming insoluble aluminum salts that decrease intestinal motility. Magnesium hydroxide has a rapid onset and causes diarrhea through osmotic water retention in the intestinal lumen. Many commercial preparations combine aluminum and magnesium to counterbalance their opposing GI effects.\n\nAntacids significantly affect the absorption of many oral medications by altering gastric pH, binding drugs, or forming insoluble complexes. They reduce absorption of fluoroquinolones, tetracyclines, iron preparations, digoxin, and ketoconazole (requires acidic pH for absorption). Therefore, other oral medications should be administered at least 1-2 hours before or after antacids. Calcium carbonate carries the additional risk of acid rebound; where the calcium ion stimulates gastrin release and secondary acid hypersecretion; and milk-alkali syndrome (hypercalcemia, metabolic alkalosis, renal insufficiency) with chronic excessive use."
    },
    riskFactors: [
      "Overuse or chronic self-medication without provider guidance",
      "Concurrent use of medications with pH-dependent absorption",
      "Renal insufficiency (magnesium and aluminum accumulation risk)",
      "Hypercalcemia or history of kidney stones (calcium carbonate)",
      "Elderly clients (increased risk of constipation with aluminum-based antacids)",
      "Fluid and electrolyte imbalances"
    ],
    diagnostics: [
      "Monitor serum electrolytes: calcium, magnesium, phosphorus, aluminum levels",
      "Renal function (BUN, creatinine) in clients with chronic antacid use",
      "Monitor for signs of metabolic alkalosis: pH > 7.45, HCO₃⁻ > 28 mEq/L",
      "Assessment of concurrent medication list for drug interactions"
    ],
    management: [
      "Administer 1-3 hours after meals and at bedtime for optimal acid neutralization",
      "Separate from other oral medications by at least 1-2 hours",
      "Use combination aluminum/magnesium products to balance constipation and diarrhea effects",
      "Monitor renal function in clients on long-term therapy",
      "Educate that antacids provide symptomatic relief only; not a substitute for definitive acid suppression therapy"
    ],
    nursingActions: [
      "Administer antacids as ordered and separate from other medications by 1-2 hours",
      "Monitor bowel patterns: constipation (aluminum) or diarrhea (magnesium)",
      "Report signs of electrolyte imbalances: muscle weakness, confusion, cardiac arrhythmias",
      "Educate client that antacids are for short-term symptomatic relief; report persistent symptoms",
      "Monitor phosphorus levels with chronic aluminum hydroxide use (binds phosphorus in GI tract)"
    ],
    signs: {
      left: [
        "Constipation (aluminum-based antacids)",
        "Diarrhea (magnesium-based antacids)",
        "Belching and gastric distension (calcium carbonate; CO₂ release)",
        "Acid rebound (calcium carbonate; gastrin stimulation)"
      ],
      right: [
        "Hypophosphatemia (aluminum binds dietary phosphorus)",
        "Hypermagnesemia in renal impairment: hypotension, bradycardia, respiratory depression",
        "Hypercalcemia with excessive calcium carbonate: nausea, confusion, polyuria",
        "Milk-alkali syndrome: hypercalcemia + metabolic alkalosis + renal insufficiency"
      ]
    },
    medications: [
      {
        name: "Aluminum hydroxide (Amphojel)",
        type: "Antacid (aluminum-based)",
        action: "Neutralizes gastric HCl by reacting with acid in the stomach lumen; also binds dietary phosphate in the GI tract, reducing phosphorus absorption",
        sideEffects: "Constipation, hypophosphatemia, aluminum toxicity in renal failure (osteomalacia, encephalopathy)",
        contra: "Severe renal impairment (aluminum accumulation), hypophosphatemia",
        pearl: "Used therapeutically in hyperphosphatemia of chronic kidney disease to bind dietary phosphorus; causes constipation; remember 'AlumiNUM = NUMbs the bowel'"
      },
      {
        name: "Calcium carbonate (Tums)",
        type: "Antacid (calcium-based)",
        action: "Directly neutralizes gastric acid by reacting with HCl; also provides supplemental calcium",
        sideEffects: "Constipation, hypercalcemia, acid rebound, gas/belching (CO₂ production)",
        contra: "Hypercalcemia, renal calculi, hyperparathyroidism, digoxin therapy (hypercalcemia potentiates digoxin toxicity)",
        pearl: "Can cause acid rebound with chronic use due to gastrin release; separate from iron and thyroid medications by at least 2 hours"
      }
    ],
    pearls: [
      "Aluminum = constipation; Magnesium = diarrhea; combine them to balance GI effects",
      "Separate antacids from all other oral medications by at least 1-2 hours to prevent drug interactions",
      "Aluminum hydroxide binds phosphorus; used therapeutically in CKD hyperphosphatemia",
      "Calcium carbonate causes acid rebound; not recommended for long-term use in GERD"
    ],
    quiz: [
      {
        question: "A client is prescribed aluminum hydroxide and also takes ciprofloxacin for a urinary tract infection. How should the nurse advise medication administration?",
        options: [
          "Take both medications at the same time",
          "Take aluminum hydroxide 2 hours before or after ciprofloxacin",
          "Discontinue aluminum hydroxide while on ciprofloxacin",
          "Take ciprofloxacin with milk to enhance absorption"
        ],
        correct: 1,
        rationale: "Antacids bind fluoroquinolones (ciprofloxacin) in the GI tract, forming insoluble complexes that dramatically reduce antibiotic absorption. Medications should be separated by at least 1-2 hours to prevent this interaction."
      }
    ]
  },

  "h2-receptor-antagonists": {
    title: "H2-Receptor Antagonists",
    cellular: {
      title: "H2-Receptor Antagonists - Ranitidine",
      content:
        "H2-receptor antagonists (H2RAs) are competitive, reversible blockers of histamine type 2 (H2) receptors on the basolateral membrane of gastric parietal cells. Parietal cells in the gastric body and fundus secrete hydrochloric acid through the H⁺/K⁺-ATPase (proton pump) on their apical membrane. Acid secretion is stimulated by three main mediators: histamine (from enterochromaffin-like [ECL] cells), acetylcholine (from vagal nerve endings), and gastrin (from G cells). Histamine binding to H2 receptors activates adenylyl cyclase, increasing intracellular cyclic AMP (cAMP), which activates protein kinase A and ultimately stimulates the proton pump.\n\nH2RAs block the histamine-mediated pathway of acid secretion, reducing both basal and meal-stimulated acid output by approximately 60-70%. Because they block only the histamine pathway (not acetylcholine or gastrin pathways), they are less potent suppressors of acid secretion than proton pump inhibitors (PPIs), which directly inhibit the final common pathway (the proton pump itself). The major H2RAs include famotidine (Pepcid), ranitidine (Zantac; note: withdrawn in many markets due to NDMA contamination concerns), cimetidine (Tagamet), and nizatidine (Axid).\n\nCimetidine, the first H2RA developed, has the most significant drug interaction profile: it inhibits cytochrome P450 enzymes (CYP1A2, CYP2C19, CYP2D6, CYP3A4) and has anti-androgenic effects (gynecomastia, impotence). Famotidine is the most potent H2RA (20-40× more potent than cimetidine on a molar basis) with minimal drug interactions and is currently preferred. All H2RAs can cause tolerance (tachyphylaxis) with chronic use; receptor upregulation diminishes their acid-suppressive effect over time, which is a significant limitation compared to PPIs."
    },
    riskFactors: [
      "Chronic use leading to tolerance/tachyphylaxis",
      "Cimetidine use with concurrent medications metabolized by CYP450 (warfarin, phenytoin, theophylline)",
      "Renal impairment requiring dose adjustment (all H2RAs are renally cleared)",
      "Elderly clients (increased risk of CNS effects: confusion, dizziness)",
      "Concurrent use of anti-androgenic medications (cimetidine)",
      "Thrombocytopenia risk with chronic use"
    ],
    diagnostics: [
      "Monitor symptom relief: heartburn frequency and severity",
      "Renal function (BUN, creatinine) for dose adjustment",
      "CBC: rare thrombocytopenia with chronic use",
      "Hepatic function tests if concurrent hepatotoxic medications"
    ],
    management: [
      "Administer 30-60 minutes before meals for meal-stimulated acid suppression",
      "Bedtime dosing most effective for nocturnal acid suppression",
      "Dose reduction in renal impairment for all H2RAs",
      "Consider switching to PPI if tolerance develops or symptoms are inadequately controlled",
      "Avoid cimetidine in clients taking warfarin, phenytoin, or theophylline; use famotidine instead"
    ],
    nursingActions: [
      "Administer as ordered; timing depends on indication (before meals or at bedtime)",
      "Monitor for drug interactions, especially with cimetidine (CYP450 inhibitor)",
      "Report signs of GI bleeding: melena, hematemesis, decreased hemoglobin",
      "Educate client that tolerance may develop with chronic use; report diminishing symptom relief",
      "Monitor mental status in elderly clients; H2RAs can cause confusion and delirium"
    ],
    signs: {
      left: [
        "Headache (most common side effect across all H2RAs)",
        "Dizziness and drowsiness",
        "Diarrhea or constipation",
        "Tolerance/tachyphylaxis with chronic use"
      ],
      right: [
        "Cimetidine: gynecomastia, impotence (anti-androgenic effects)",
        "CNS effects in elderly: confusion, agitation, hallucinations",
        "Thrombocytopenia (rare, reversible)",
        "Drug interactions (cimetidine inhibits CYP450)"
      ]
    },
    medications: [
      {
        name: "Famotidine (Pepcid)",
        type: "H2-receptor antagonist",
        action: "Competitively and reversibly blocks histamine H2 receptors on gastric parietal cells, reducing cAMP-mediated acid secretion; the most potent H2RA with minimal CYP450 interactions",
        sideEffects: "Headache, dizziness, constipation, diarrhea",
        contra: "Hypersensitivity to H2RAs, severe renal impairment (dose adjustment needed)",
        pearl: "Preferred H2RA due to highest potency and fewest drug interactions; effective for nocturnal acid suppression when given at bedtime"
      },
      {
        name: "Cimetidine (Tagamet)",
        type: "H2-receptor antagonist",
        action: "Blocks H2 receptors on parietal cells, reducing histamine-stimulated acid secretion; also inhibits multiple CYP450 enzymes",
        sideEffects: "Gynecomastia, impotence (anti-androgenic), drug interactions (CYP450 inhibition), confusion in elderly",
        contra: "Concurrent warfarin, phenytoin, theophylline, or benzodiazepines without dose adjustment; renal impairment",
        pearl: "Due to extensive drug interactions and anti-androgenic effects, cimetidine is largely replaced by famotidine in clinical practice"
      }
    ],
    pearls: [
      "Famotidine is preferred over cimetidine due to fewer drug interactions and no anti-androgenic effects",
      "H2RAs are less potent than PPIs because they block only one of three acid-stimulating pathways",
      "Tolerance develops with chronic H2RA use; this does not occur with PPIs",
      "Ranitidine (Zantac) was withdrawn from many markets due to NDMA carcinogen contamination concerns"
    ],
    quiz: [
      {
        question: "A male client taking cimetidine reports breast enlargement and tenderness. What is the most likely explanation?",
        options: [
          "Allergic reaction to cimetidine",
          "Anti-androgenic effects of cimetidine",
          "Hepatic failure from cimetidine toxicity",
          "Interaction with another medication"
        ],
        correct: 1,
        rationale: "Cimetidine has anti-androgenic properties; it inhibits dihydrotestosterone binding and increases serum estradiol. This can cause gynecomastia and impotence. The nurse should report this finding and anticipate switching to famotidine."
      }
    ]
  },

  "proton-pump-inhibitors": {
    title: "Proton Pump Inhibitors (PPIs)",
    cellular: {
      title: "PPIs - Omeprazole, Pantoprazole",
      content:
        "Proton pump inhibitors (PPIs) are the most potent class of acid-suppressive medications, irreversibly inhibiting the hydrogen-potassium ATPase enzyme system (H⁺/K⁺-ATPase, or 'proton pump') on the apical membrane of gastric parietal cells. The proton pump is the final common pathway for all acid secretion, regardless of the stimulating mediator (histamine, acetylcholine, or gastrin). By covalently binding to cysteine residues on the alpha subunit of the proton pump, PPIs provide sustained acid suppression until new pump molecules are synthesized (half-life of pump turnover is approximately 18 hours).\n\nPPIs are prodrugs that require activation in an acidic environment. After oral absorption, they are distributed to parietal cells and accumulate in the acidic secretory canaliculi (pH ~ 1), where they are protonated and converted to their active sulfenamide form. This activated molecule then forms a disulfide bond with the proton pump, irreversibly inactivating it. Because only actively secreting pumps are inhibited, PPIs are most effective when taken 30-60 minutes before the first meal of the day, when fasting parietal cells are transitioning to active acid secretion. Maximum acid suppression requires 3-5 days of therapy as successive generations of pumps are inactivated.\n\nLong-term PPI use (> 1 year) is associated with several concerning adverse effects: increased risk of Clostridioides difficile infection (reduced gastric acid barrier), hypomagnesemia, vitamin B12 deficiency (acid-dependent absorption), calcium malabsorption leading to osteoporotic fractures (especially hip, wrist, spine), chronic kidney disease, and rebound acid hypersecretion upon discontinuation. Common PPIs include omeprazole (Prilosec), esomeprazole (Nexium), pantoprazole (Protonix), and lansoprazole (Prevacid)."
    },
    riskFactors: [
      "Long-term use > 1 year (increased complication risk)",
      "Elderly clients (higher osteoporotic fracture risk)",
      "Concurrent clopidogrel use; omeprazole inhibits CYP2C19-mediated activation of clopidogrel",
      "Renal impairment (increased risk of interstitial nephritis)",
      "Hypomagnesemia risk with concurrent diuretics",
      "Immunocompromised clients (C. difficile risk increased)"
    ],
    diagnostics: [
      "Monitor symptom relief (heartburn, regurgitation) after 4-8 weeks of therapy",
      "Serum magnesium levels with long-term use (especially if concurrent diuretics)",
      "Vitamin B12 levels annually with chronic use (> 2 years)",
      "Bone density screening (DEXA) for high-risk clients on long-term therapy",
      "Renal function monitoring for interstitial nephritis"
    ],
    management: [
      "Take 30-60 minutes before the first meal of the day on an empty stomach",
      "Standard course: 4-8 weeks for peptic ulcer disease; 8 weeks for GERD",
      "Evaluate need for continued therapy regularly; use lowest effective dose for shortest duration",
      "Taper gradually if discontinuing long-term therapy to prevent rebound acid hypersecretion",
      "Triple therapy for H. pylori: PPI + clarithromycin + amoxicillin (or metronidazole) × 14 days"
    ],
    nursingActions: [
      "Administer as ordered 30-60 minutes before breakfast; do not crush enteric-coated formulations",
      "Monitor for signs of hypomagnesemia: muscle cramps, tremors, cardiac arrhythmias",
      "Educate client on long-term risks: bone fractures, B12 deficiency, C. difficile infection",
      "Report new-onset diarrhea (especially watery, foul-smelling); may indicate C. difficile",
      "Monitor for drug interactions: PPIs reduce absorption of ketoconazole, iron, and calcium",
      "Do not abruptly discontinue long-term PPI therapy; taper as ordered"
    ],
    signs: {
      left: [
        "Headache, nausea, diarrhea, abdominal pain (common, usually mild)",
        "Flatulence and abdominal distension",
        "Hypomagnesemia: muscle cramps, tremor, seizures",
        "Vitamin B12 deficiency: paresthesias, fatigue, glossitis"
      ],
      right: [
        "C. difficile colitis: watery diarrhea, fever, abdominal pain",
        "Osteoporotic fractures (hip, wrist, spine) with long-term use",
        "Acute interstitial nephritis: fever, rash, elevated creatinine",
        "Rebound acid hypersecretion upon abrupt discontinuation"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton pump inhibitor",
        action: "Irreversibly inhibits H⁺/K⁺-ATPase on parietal cell apical membrane, blocking the final step of acid secretion regardless of stimulus; most effective acid suppression available",
        sideEffects: "Headache, diarrhea, nausea, hypomagnesemia, B12 deficiency, increased fracture risk",
        contra: "Concurrent rilpivirine, CYP2C19-dependent medications (clopidogrel interaction)",
        pearl: "Inhibits CYP2C19; can reduce clopidogrel activation; pantoprazole or lansoprazole preferred in clients taking clopidogrel"
      },
      {
        name: "Pantoprazole (Protonix)",
        type: "Proton pump inhibitor",
        action: "Irreversibly inhibits the gastric proton pump (H⁺/K⁺-ATPase); available in IV formulation for clients unable to take oral medications",
        sideEffects: "Headache, diarrhea, injection site reactions (IV), hypomagnesemia",
        contra: "Hypersensitivity to benzimidazole class",
        pearl: "Preferred PPI when IV administration is needed (e.g., active GI bleeding); has less CYP2C19 interaction than omeprazole; safer with clopidogrel"
      }
    ],
    pearls: [
      "PPIs must be taken 30-60 minutes before meals; the pump must be actively secreting acid for the drug to work",
      "Omeprazole reduces clopidogrel effectiveness; use pantoprazole instead in cardiac clients",
      "Taper PPIs gradually after long-term use to prevent rebound acid hypersecretion",
      "PPIs are more potent than H2RAs because they block the final common pathway of all acid secretion"
    ],
    quiz: [
      {
        question: "A client on long-term omeprazole therapy develops muscle cramps and cardiac arrhythmias. Which electrolyte should the nurse check first?",
        options: [
          "Serum sodium",
          "Serum potassium",
          "Serum magnesium",
          "Serum calcium"
        ],
        correct: 2,
        rationale: "Long-term PPI use can cause hypomagnesemia, presenting with muscle cramps, tremors, seizures, and cardiac arrhythmias. The nurse should check serum magnesium and report the finding to the provider."
      }
    ]
  },

  "antiemetics": {
    title: "Antiemetics",
    cellular: {
      title: "Antiemetics - Ondansetron, Metoclopramide",
      content:
        "Antiemetic medications target specific receptors involved in the emetic reflex arc to prevent or treat nausea and vomiting. The vomiting center in the medulla oblongata receives input from four main areas: the chemoreceptor trigger zone (CTZ) in the area postrema (outside the blood-brain barrier, sensitive to toxins and drugs), the vestibular system (motion-related inputs via histamine H1 and muscarinic receptors), the GI tract (vagal afferents with serotonin 5-HT3 receptors), and higher cortical centers (anticipatory nausea via memory and anxiety pathways). Effective antiemetic therapy requires matching the drug's receptor target to the emetic stimulus.\n\nOndansetron (Zofran) is a selective 5-HT3 receptor antagonist that blocks serotonin binding on vagal afferents in the GI tract and in the CTZ. It is the first-line antiemetic for chemotherapy-induced and postoperative nausea and vomiting (PONV). Serotonin is released from enterochromaffin cells in the GI mucosa when damaged by chemotherapy, surgery, or radiation; ondansetron blocks this signal before it reaches the vomiting center. Metoclopramide (Reglan) is a dopamine D2 antagonist and weak 5-HT3 antagonist that also has prokinetic effects, accelerating gastric emptying by increasing gastric motility. Its dopamine-blocking action carries a risk of extrapyramidal symptoms (EPS) and tardive dyskinesia with chronic use.\n\nPromethazine (Phenergan) is a first-generation antihistamine (H1 blocker) with anticholinergic properties that is effective for motion sickness and postoperative nausea. However, it carries significant risks including severe tissue injury from IV extravasation (can cause gangrene), excessive sedation, and respiratory depression; the FDA has a boxed warning against IV use in children under 2. Other antiemetic classes include anticholinergics (scopolamine; transdermal for motion sickness), NK1 receptor antagonists (aprepitant; for highly emetogenic chemotherapy), and cannabinoids (dronabinol; appetite stimulation and chemotherapy-related nausea)."
    },
    riskFactors: [
      "QT prolongation risk with ondansetron (especially at high IV doses)",
      "Extrapyramidal symptoms with metoclopramide (especially in young women and elderly)",
      "Tissue necrosis with promethazine IV extravasation",
      "Excessive sedation with promethazine and first-generation antihistamines",
      "Concurrent use of CNS depressants enhances sedation risk",
      "Pheochromocytoma (metoclopramide can cause hypertensive crisis)"
    ],
    diagnostics: [
      "ECG monitoring for QT interval with ondansetron use (especially IV)",
      "Monitor for extrapyramidal symptoms with metoclopramide: dystonia, akathisia, parkinsonism",
      "Assess IV site patency before promethazine administration",
      "Neurological assessment for tardive dyskinesia with chronic metoclopramide use"
    ],
    management: [
      "Match antiemetic to emetic stimulus: 5-HT3 antagonists for chemotherapy/postop; anticholinergics for motion sickness",
      "Ondansetron: 4-8 mg IV or PO every 8 hours; premedicate before chemotherapy",
      "Metoclopramide: limit use to < 12 weeks to reduce tardive dyskinesia risk",
      "Promethazine: prefer deep IM injection over IV; never administer intra-arterially",
      "Combination therapy for highly emetogenic chemotherapy: ondansetron + dexamethasone + aprepitant"
    ],
    nursingActions: [
      "Administer ondansetron as ordered; monitor ECG for QT prolongation in high-risk clients",
      "Assess IV site patency before administering promethazine IV; dilute and administer slowly",
      "Monitor for EPS with metoclopramide: report dystonia, restlessness, involuntary movements",
      "Implement fall precautions with sedating antiemetics (promethazine, meclizine)",
      "Administer diphenhydramine as ordered for acute EPS reactions (metoclopramide)",
      "Educate client to avoid driving or operating machinery with sedating antiemetics"
    ],
    signs: {
      left: [
        "Ondansetron: headache, constipation, fatigue",
        "Metoclopramide: drowsiness, restlessness, diarrhea",
        "Promethazine: sedation, dry mouth, blurred vision",
        "Scopolamine: dry mouth, urinary retention, blurred vision"
      ],
      right: [
        "QT prolongation with ondansetron (risk of torsades de pointes)",
        "Extrapyramidal symptoms with metoclopramide: acute dystonia, tardive dyskinesia",
        "Tissue necrosis/gangrene from promethazine IV extravasation",
        "Serotonin syndrome if ondansetron combined with SSRIs/MAOIs"
      ]
    },
    medications: [
      {
        name: "Ondansetron (Zofran)",
        type: "Selective 5-HT3 receptor antagonist",
        action: "Blocks serotonin receptors in the CTZ and on peripheral vagal nerve terminals in the GI tract, interrupting the emetic reflex arc",
        sideEffects: "Headache, constipation, QT prolongation, fatigue",
        contra: "Congenital long QT syndrome, concurrent QT-prolonging drugs, apomorphine use",
        pearl: "First-line for chemotherapy-induced and postoperative nausea; maximum single IV dose of 16 mg to reduce QT prolongation risk"
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Dopamine D2 antagonist / prokinetic agent",
        action: "Blocks dopamine D2 receptors in the CTZ (antiemetic effect) and enhances acetylcholine release in the GI tract (prokinetic effect), accelerating gastric emptying",
        sideEffects: "Drowsiness, EPS (dystonia, akathisia), tardive dyskinesia, galactorrhea (hyperprolactinemia)",
        contra: "GI obstruction or perforation, pheochromocytoma, seizure disorder, concurrent drugs causing EPS",
        pearl: "Black box warning for tardive dyskinesia with use > 12 weeks; administer diphenhydramine for acute dystonic reactions"
      }
    ],
    pearls: [
      "Ondansetron does not cause sedation or EPS; it is the safest first-line antiemetic for most indications",
      "Promethazine IV extravasation can cause tissue necrosis; always verify IV patency; IM route preferred",
      "Metoclopramide is both an antiemetic AND a prokinetic; useful in gastroparesis but limit to < 12 weeks",
      "Treat acute EPS from metoclopramide or promethazine with IV diphenhydramine (Benadryl)"
    ],
    quiz: [
      {
        question: "A client receiving metoclopramide develops sudden neck stiffness, involuntary upward eye deviation, and jaw clenching. What should the nurse administer as ordered?",
        options: [
          "Naloxone (Narcan)",
          "Diphenhydramine (Benadryl)",
          "Ondansetron (Zofran)",
          "Lorazepam (Ativan)"
        ],
        correct: 1,
        rationale: "The symptoms describe an acute dystonic reaction (extrapyramidal symptom) from dopamine D2 blockade by metoclopramide. Diphenhydramine (anticholinergic) is administered to restore dopamine-acetylcholine balance and rapidly resolves the dystonia."
      }
    ]
  },

  "laxatives": {
    title: "Laxatives",
    cellular: {
      title: "Laxatives - Osmotic, Stimulant, Bulk-Forming",
      content:
        "Laxatives are medications that promote bowel movements through various mechanisms, classified into four main categories based on their mode of action. Bulk-forming laxatives (psyllium, methylcellulose) are the most physiologically similar to dietary fiber; they absorb water in the intestinal lumen, increasing fecal bulk and stimulating peristalsis through mechanoreceptor activation. They are the safest laxative category and are recommended as first-line therapy for chronic constipation, but require adequate fluid intake (8-10 glasses/day) to prevent intestinal obstruction.\n\nOsmotic laxatives (polyethylene glycol [PEG 3350/MiraLAX], magnesium hydroxide [Milk of Magnesia], lactulose) draw water into the intestinal lumen through osmotic gradients, softening stool and increasing intraluminal volume. PEG 3350 is an inert, non-absorbable polymer that is the preferred osmotic agent for chronic constipation due to predictable dose-response and minimal electrolyte disturbance. Lactulose is an osmotic laxative also used to reduce ammonia levels in hepatic encephalopathy; colonic bacteria ferment it to organic acids that lower pH and trap ammonia as ammonium ions. Magnesium-containing laxatives must be used cautiously in renal impairment due to magnesium accumulation risk.\n\nStimulant laxatives (bisacodyl, senna/sennosides) directly stimulate myenteric plexus neurons in the colonic wall, increasing peristaltic contractions and inhibiting water and electrolyte reabsorption. They are potent and rapid-acting but should not be used long-term due to risk of melanosis coli (benign pigmentation of colonic mucosa), electrolyte imbalances (hypokalemia), and cathartic colon (dependence with diminished colonic motility). Stool softeners (docusate sodium) are surfactants that lower surface tension of stool, allowing water and fat penetration; they are preventive agents, not effective for established constipation."
    },
    riskFactors: [
      "Chronic stimulant laxative use leading to cathartic colon and dependence",
      "Inadequate fluid intake with bulk-forming laxatives (impaction/obstruction risk)",
      "Electrolyte imbalances: hypokalemia (stimulant laxatives), hypermagnesemia (Mg-containing osmotic laxatives)",
      "Renal impairment (magnesium-containing laxative contraindicated)",
      "Bowel obstruction or undiagnosed abdominal pain (all laxatives contraindicated)",
      "Elderly clients at higher risk of dehydration and electrolyte disturbances"
    ],
    diagnostics: [
      "Serum electrolytes: potassium, magnesium, sodium, phosphorus",
      "Renal function (BUN, creatinine) before magnesium-containing laxatives",
      "Abdominal X-ray if obstruction suspected (before initiating laxatives)",
      "Bristol Stool Form Scale to guide therapy adjustments"
    ],
    management: [
      "First-line: lifestyle modifications; high-fiber diet (25-35 g/day), adequate fluids (8-10 glasses/day), regular exercise",
      "Bulk-forming laxatives (psyllium) as first pharmacologic therapy for chronic constipation",
      "Osmotic laxatives (PEG 3350) for chronic constipation unresponsive to fiber",
      "Stimulant laxatives (bisacodyl, senna) for short-term use or acute constipation; not daily",
      "Stool softeners (docusate) for prevention in post-surgical clients or those on opioids",
      "Address underlying cause: medications (opioids), metabolic (hypothyroidism), structural (obstruction)"
    ],
    nursingActions: [
      "Administer bulk-forming laxatives with a full glass of water (240 mL minimum) to prevent obstruction",
      "Educate client that stool softeners prevent hard stools but do not treat established constipation",
      "Monitor for electrolyte imbalances with stimulant and osmotic laxatives: hypokalemia, dehydration",
      "Report absence of bowel movement for > 3 days despite laxative therapy",
      "Educate client to avoid chronic stimulant laxative use; risk of bowel dependence",
      "Monitor strict intake and output in clients receiving bowel preparation regimens"
    ],
    signs: {
      left: [
        "Bulk-forming: bloating, flatulence, obstruction if taken with insufficient fluid",
        "Osmotic: bloating, cramping, flatulence, watery diarrhea with overuse",
        "Stimulant: abdominal cramping, diarrhea, melanosis coli",
        "Stool softener: mild cramping, throat irritation (liquid forms)"
      ],
      right: [
        "Hypokalemia (stimulant laxatives): muscle weakness, cardiac arrhythmias",
        "Hypermagnesemia (Mg-based osmotics in renal failure): hypotension, respiratory depression",
        "Cathartic colon (chronic stimulant use): loss of normal colonic motility",
        "Dehydration and metabolic alkalosis with chronic laxative abuse"
      ]
    },
    medications: [
      {
        name: "Polyethylene glycol 3350 (MiraLAX)",
        type: "Osmotic laxative",
        action: "Retains water in the intestinal lumen through osmotic effect, increasing stool water content and volume; does not ferment (less gas than lactulose) and does not cause electrolyte shifts",
        sideEffects: "Bloating, cramping, nausea, diarrhea with excessive dosing",
        contra: "Known or suspected bowel obstruction, GI perforation",
        pearl: "Preferred osmotic laxative for chronic constipation; dissolve in 8 oz liquid; onset 1-3 days; safe for long-term use"
      },
      {
        name: "Bisacodyl (Dulcolax)",
        type: "Stimulant laxative",
        action: "Directly stimulates sensory nerve endings in the colonic mucosa and myenteric plexus, increasing peristaltic contractions; also inhibits water and electrolyte reabsorption in the colon",
        sideEffects: "Abdominal cramping, diarrhea, electrolyte depletion (hypokalemia), melanosis coli",
        contra: "Acute abdomen, bowel obstruction, dehydration, active inflammatory bowel disease",
        pearl: "Do not crush enteric-coated tablets; do not take within 1 hour of antacids or milk (premature coating dissolution causes gastric irritation)"
      }
    ],
    pearls: [
      "Bulk-forming laxatives MUST be taken with adequate fluid; can cause esophageal or intestinal obstruction if taken dry",
      "Stool softeners are preventive agents; they are not effective for treating existing constipation",
      "Stimulant laxatives should not be used long-term; can lead to cathartic colon and laxative dependence",
      "Never give laxatives to clients with undiagnosed abdominal pain; may mask surgical abdomen"
    ],
    quiz: [
      {
        question: "A client takes psyllium (Metamucil) with only a sip of water. What complication should the nurse be most concerned about?",
        options: [
          "Diarrhea",
          "Esophageal or intestinal obstruction",
          "Hyperkalemia",
          "Rebound constipation"
        ],
        correct: 1,
        rationale: "Bulk-forming laxatives absorb water and expand in the GI tract. Without adequate fluid (at least a full glass of water, 240 mL), psyllium can form a gelatinous mass that causes esophageal or intestinal obstruction. Always administer with a full glass of water."
      }
    ]
  },

  "antidiarrheals": {
    title: "Antidiarrheals",
    cellular: {
      title: "Antidiarrheals - Loperamide, Bismuth",
      content:
        "Antidiarrheal medications reduce stool frequency and volume through different mechanisms depending on the drug class. Loperamide (Imodium) is a synthetic opioid that acts on mu-opioid receptors in the myenteric plexus of the intestinal wall. Unlike other opioids, loperamide does not cross the blood-brain barrier at therapeutic doses (it is a substrate for P-glycoprotein efflux pumps that actively transport it out of the CNS), so it provides peripheral antidiarrheal effects without central analgesic or euphoric properties. It decreases intestinal motility, increases transit time, and enhances water and electrolyte absorption from the intestinal lumen.\n\nBismuth subsalicylate (Pepto-Bismol) has multiple mechanisms of action: it reduces intestinal secretion through antiprostaglandin effects, has mild antimicrobial activity against pathogenic bacteria (including Helicobacter pylori), and provides a protective coating on the intestinal mucosa. In the acidic gastric environment, bismuth subsalicylate is hydrolyzed to bismuth (which has topical antimicrobial and anti-inflammatory effects) and salicylate (which is absorbed systemically). This salicylate component is clinically significant; it can cause salicylism in overdose and has the same contraindications as aspirin.\n\nImportant clinical considerations include: loperamide should NOT be used in infectious diarrhea with bloody stools or high fever (C. difficile, Shigella, E. coli O157:H7) because slowing motility traps toxins in the colon and increases the risk of toxic megacolon. Bismuth subsalicylate causes harmless black discoloration of the tongue and stool; educate clients to prevent unnecessary alarm. Neither agent should be used for more than 48 hours without medical evaluation, as persistent diarrhea may indicate an underlying condition requiring specific treatment."
    },
    riskFactors: [
      "Loperamide misuse/overdose (may cause QT prolongation, cardiac arrhythmias, and death at supratherapeutic doses)",
      "Use in infectious diarrhea with fever/bloody stools (risk of toxic megacolon)",
      "Salicylate sensitivity or aspirin allergy (bismuth subsalicylate)",
      "Concurrent anticoagulant therapy (bismuth subsalicylate has salicylate effects)",
      "Children under 2 years (loperamide) or children/teens with viral illness (bismuth; Reye syndrome risk)",
      "Renal impairment (salicylate accumulation with bismuth subsalicylate)"
    ],
    diagnostics: [
      "Stool studies before initiating antidiarrheals: culture, ova and parasites, C. difficile toxin",
      "Electrolytes: monitor for dehydration, hypokalemia, metabolic acidosis",
      "CBC: assess for leukocytosis (infectious etiology)",
      "Assess stool character: bloody or mucoid stools contraindicate loperamide"
    ],
    management: [
      "Address underlying cause: rehydration (oral rehydration solution or IV fluids) is the priority",
      "Loperamide: 4 mg initially, then 2 mg after each loose stool (max 16 mg/day)",
      "Bismuth subsalicylate: 524 mg every 30-60 minutes as needed (max 8 doses/24 hours)",
      "Do not use antidiarrheals for more than 48 hours without medical evaluation",
      "For infectious diarrhea: treat the infection, not the symptom (avoid loperamide)"
    ],
    nursingActions: [
      "Assess stool frequency, consistency, and presence of blood or mucus before administering antidiarrheals",
      "Do NOT administer loperamide if client has bloody diarrhea, high fever, or suspected C. difficile; report to provider",
      "Monitor for dehydration: skin turgor, mucous membranes, urine output, vital signs",
      "Educate client that bismuth subsalicylate causes harmless black tongue and black stools",
      "Monitor for loperamide toxicity at high doses: abdominal distension, constipation, ileus",
      "Report diarrhea persisting > 48 hours despite treatment"
    ],
    signs: {
      left: [
        "Loperamide: constipation, abdominal cramps, drowsiness, dry mouth",
        "Bismuth subsalicylate: black tongue and stools (harmless), nausea",
        "Dehydration from ongoing fluid losses: thirst, dry mucous membranes",
        "Electrolyte imbalances: weakness, muscle cramps"
      ],
      right: [
        "Loperamide overdose: paralytic ileus, QT prolongation, ventricular arrhythmias",
        "Salicylism from bismuth: tinnitus, nausea, vomiting, confusion",
        "Toxic megacolon if loperamide used in invasive infectious diarrhea",
        "Reye syndrome risk with bismuth in children with viral illness"
      ]
    },
    medications: [
      {
        name: "Loperamide (Imodium)",
        type: "Peripheral opioid receptor agonist (antidiarrheal)",
        action: "Activates mu-opioid receptors in the intestinal myenteric plexus, slowing peristalsis, increasing intestinal transit time, and enhancing water and electrolyte reabsorption; does not cross blood-brain barrier at therapeutic doses",
        sideEffects: "Constipation, abdominal cramps, dizziness, nausea; overdose: QT prolongation, cardiac arrest",
        contra: "Bloody diarrhea, bacterial enterocolitis (C. difficile, Shigella), abdominal distension, children < 2 years",
        pearl: "Do NOT use for infectious diarrhea with blood or fever; trapping toxin-producing bacteria increases risk of toxic megacolon and systemic toxicity"
      },
      {
        name: "Bismuth subsalicylate (Pepto-Bismol)",
        type: "Antisecretory/antimicrobial antidiarrheal",
        action: "Reduces intestinal secretion (antiprostaglandin effect), provides antimicrobial activity against enteric pathogens, and coats intestinal mucosa; hydrolyzed to bismuth and salicylate in the GI tract",
        sideEffects: "Black tongue and stools, nausea, constipation, tinnitus (salicylism at high doses)",
        contra: "Aspirin/salicylate allergy, children with viral infections (Reye syndrome risk), concurrent anticoagulant therapy",
        pearl: "Contains salicylate; has same contraindications as aspirin; warn clients about harmless black discoloration of tongue and stool"
      }
    ],
    pearls: [
      "Never give loperamide for bloody diarrhea or suspected C. difficile; slowing motility traps toxins and worsens disease",
      "Bismuth subsalicylate = salicylate; avoid in aspirin allergy, children with viral illness, and concurrent anticoagulation",
      "Rehydration is always the priority in diarrheal illness; antidiarrheals address symptoms, not the cause",
      "Loperamide overdose is a growing concern; high doses cause fatal cardiac arrhythmias (QT prolongation)"
    ],
    quiz: [
      {
        question: "A client with C. difficile infection and bloody diarrhea asks for loperamide. What is the nurse's best response?",
        options: [
          "Administer loperamide as requested for comfort",
          "Explain that loperamide is contraindicated because it can worsen C. difficile infection",
          "Give half the normal loperamide dose",
          "Substitute bismuth subsalicylate instead"
        ],
        correct: 1,
        rationale: "Loperamide is contraindicated in C. difficile infection because slowing intestinal motility traps the toxin in the colon, increasing the risk of toxic megacolon and systemic toxicity. The nurse should explain this and report the request to the provider."
      }
    ]
  },

  "hepatic-encephalopathy-meds": {
    title: "Hepatic Encephalopathy Medications",
    cellular: {
      title: "Hepatic Encephalopathy Meds - Lactulose",
      content:
        "Hepatic encephalopathy (HE) is a neuropsychiatric syndrome resulting from the accumulation of neurotoxins, primarily ammonia (NH₃), in the systemic circulation due to impaired hepatic clearance. In a healthy liver, ammonia generated from protein metabolism, bacterial urease activity in the colon, and glutamine deamination in enterocytes is converted to urea via the urea cycle and excreted by the kidneys. In cirrhosis, two mechanisms cause hyperammonemia: decreased hepatocyte urea cycle function, and portosystemic shunting that diverts portal blood (containing ammonia from the GI tract) directly into the systemic circulation, bypassing hepatic detoxification.\n\nAt the cellular level, ammonia crosses the blood-brain barrier and is metabolized by astrocytes using glutamine synthetase to convert glutamate + ammonia → glutamine. Accumulation of glutamine within astrocytes creates an osmotic gradient, causing astrocyte swelling (Alzheimer type II astrocytosis) and cerebral edema. This leads to increased intracranial pressure, impaired neurotransmission, altered cerebral blood flow, and the clinical manifestations of HE; ranging from subtle cognitive impairment (minimal HE) through confusion, asterixis, and somnolence to coma (West Haven Grade IV). Precipitating factors include GI bleeding (protein load), infection, constipation, hypokalemia, alkalosis (favors NH₃ over NH₄⁺, increasing CNS penetration), sedative use, and dehydration.\n\nLactulose and rifaximin are the mainstays of HE treatment and prevention. Lactulose is a non-absorbable synthetic disaccharide that is fermented by colonic bacteria to lactic, acetic, and formic acids, lowering colonic pH. The acidic environment converts ammonia (NH₃, which is absorbable) to ammonium (NH₄⁺, which is not absorbable), trapping it in the colonic lumen for fecal excretion. Additionally, the osmotic laxative effect increases fecal ammonia elimination. Rifaximin is a non-absorbable antibiotic (rifamycin derivative) that reduces ammonia-producing gut bacteria without significant systemic absorption or resistance development."
    },
    riskFactors: [
      "Cirrhosis with portosystemic shunting (most common setting)",
      "GI bleeding (blood protein digestion increases ammonia production)",
      "Infection/sepsis (increased catabolism and ammonia production)",
      "Constipation (increased ammonia absorption from prolonged colonic contact)",
      "Hypokalemia and metabolic alkalosis (favor NH₃ form that crosses blood-brain barrier)",
      "High dietary protein intake (excessive amino acid deamination)",
      "Sedatives, opioids, and benzodiazepines (decrease CNS function, worsen HE)",
      "TIPS procedure (increases portosystemic shunting)"
    ],
    diagnostics: [
      "Clinical assessment using West Haven criteria: Grade 0 (minimal HE) through Grade IV (coma)",
      "Serum ammonia level: elevated, though levels correlate poorly with clinical severity",
      "Asterixis (flapping tremor) assessment: hallmark finding of Grade II-III HE",
      "Number connection test or Stroop test for minimal HE detection",
      "Evaluate precipitating factors: CBC, CMP (potassium, BUN), blood cultures, stool guaiac",
      "CT head to rule out structural causes (subdural hematoma, stroke) if presentation is atypical"
    ],
    management: [
      "Lactulose: titrate to 2-3 soft bowel movements per day (usual dose 15-30 mL PO 2-3 times daily)",
      "Rifaximin 550 mg PO twice daily as adjunctive therapy to lactulose for HE prevention",
      "Identify and treat precipitating factors: infection, GI bleeding, electrolyte imbalances, constipation",
      "Protein restriction only in acute, severe episodes (1.2-1.5 g/kg/day otherwise to prevent sarcopenia)",
      "Lactulose enemas (300 mL in 700 mL water) for clients unable to take oral medications",
      "Zinc supplementation (zinc is a cofactor in urea cycle enzymes)"
    ],
    nursingActions: [
      "Administer lactulose as ordered; titrate to achieve 2-3 soft stools per day",
      "Monitor level of consciousness using standardized scales (West Haven, Glasgow Coma Scale)",
      "Assess for asterixis: have client extend arms with wrists dorsiflexed and fingers spread",
      "Implement safety precautions: fall risk, aspiration precautions, bed alarm if confused",
      "Monitor serum ammonia levels, electrolytes (especially potassium), and renal function",
      "Report excessive diarrhea from lactulose; dehydration can paradoxically worsen HE"
    ],
    signs: {
      left: [
        "Grade I: sleep disturbance, shortened attention span, mild confusion",
        "Grade II: lethargy, disorientation, asterixis (flapping tremor)",
        "Grade III: somnolence, marked confusion, incomprehensible speech",
        "Grade IV: coma, unresponsive to painful stimuli"
      ],
      right: [
        "Asterixis (liver flap): involuntary flapping movements with dorsiflexed wrists",
        "Fetor hepaticus: sweet, musty breath odor from dimethyl sulfide",
        "Hyperreflexia progressing to areflexia in advanced stages",
        "Constructional apraxia: inability to draw simple figures (five-pointed star)"
      ]
    },
    medications: [
      {
        name: "Lactulose",
        type: "Osmotic laxative / ammonia-reducing agent",
        action: "Colonic bacteria ferment lactulose to organic acids, lowering colonic pH from ~7 to ~5, converting absorbable ammonia (NH₃) to non-absorbable ammonium (NH₄⁺); osmotic effect increases fecal bulk and accelerates ammonia excretion",
        sideEffects: "Diarrhea, flatulence, abdominal cramping, nausea, electrolyte imbalances (hypokalemia, hyponatremia)",
        contra: "Galactosemia, bowel obstruction",
        pearl: "Titrate to 2-3 soft stools/day; too few = inadequate ammonia clearance, too many = dehydration which WORSENS encephalopathy"
      },
      {
        name: "Rifaximin (Xifaxan)",
        type: "Non-absorbable rifamycin antibiotic",
        action: "Inhibits bacterial RNA synthesis by binding DNA-dependent RNA polymerase; reduces ammonia-producing enteric bacteria in the colon with < 0.4% systemic absorption",
        sideEffects: "Nausea, flatulence, abdominal pain, headache, peripheral edema",
        contra: "Hypersensitivity to rifaximin or rifamycin class; avoid in severe hepatic impairment if not indicated",
        pearl: "Added to lactulose for secondary prevention of HE recurrence; reduces HE episodes by 50%; does not cause significant antibiotic resistance due to minimal absorption"
      }
    ],
    pearls: [
      "Lactulose titration goal: 2-3 soft stools/day; excessive diarrhea causes dehydration and hypokalemia, which worsen HE",
      "Alkalosis promotes HE because NH₃ (crosses blood-brain barrier) predominates over NH₄⁺ in alkaline pH",
      "GI bleeding is a major HE precipitant; blood in the GI tract is a massive protein/ammonia load",
      "Serum ammonia levels correlate poorly with clinical severity; always treat based on clinical assessment",
      "Do NOT chronically restrict dietary protein; this causes sarcopenia and worsens outcomes in cirrhosis"
    ],
    quiz: [
      {
        question: "A client with hepatic encephalopathy is taking lactulose and has had 6 watery stools today. What should the nurse do?",
        options: [
          "Continue the current lactulose dose as prescribed",
          "Administer an additional lactulose dose to further reduce ammonia",
          "Hold lactulose and report to the provider; excessive diarrhea can worsen HE",
          "Increase fluid intake and continue lactulose at the same dose"
        ],
        correct: 2,
        rationale: "The goal is 2-3 soft stools/day. Excessive diarrhea from lactulose causes dehydration, hypokalemia, and metabolic alkalosis; all of which worsen hepatic encephalopathy. The nurse should hold the dose and report to the provider for dose adjustment."
      }
    ]
  },
  "viral-hepatitis": {
    title: "Viral Hepatitis",
    image: getAssetUrl("hepatitisb_1773340513136.png"),
    cellular: { title: "Hepatotropic Virus Pathology", content: "Viral hepatitis involves inflammation and necrosis of hepatocytes caused by hepatotropic viruses (A, B, C, D, E). Each virus targets hepatocytes through specific receptors and replicates within the cell. The immune response (cytotoxic T lymphocytes) directed against viral antigens on the hepatocyte surface causes the majority of liver damage, not the virus itself. Hepatocyte necrosis leads to elevated transaminases (ALT > AST), impaired bilirubin conjugation (jaundice), and reduced synthetic function (coagulopathy, hypoalbuminemia). Hepatitis A and E are transmitted fecal-oral and typically cause acute self-limited disease. Hepatitis B and C are bloodborne and can progress to chronic hepatitis, cirrhosis, and hepatocellular carcinoma." },
    riskFactors: ["IV drug use (shared needles - Hep B, C)", "Unprotected sexual contact (Hep B)", "Travel to endemic areas (Hep A, E)", "Contaminated food/water (Hep A, E)", "Healthcare workers (needlestick - Hep B, C)", "Blood transfusion before 1992 (Hep C)", "Perinatal transmission (Hep B)", "Tattoos/body piercings with non-sterile equipment", "Dialysis patients", "Immunocompromised individuals"],
    diagnostics: ["Expect hepatitis panel with serologic markers", "Monitor liver function tests (ALT, AST, bilirubin, albumin)", "Expect coagulation studies (PT/INR)", "Monitor for signs of hepatic failure", "Expect abdominal ultrasound", "Monitor for hepatic encephalopathy signs"],
    management: ["Enforce strict hand hygiene and standard precautions", "Administer hepatitis A and B vaccines as indicated", "Maintain adequate nutrition with small frequent meals", "Avoid hepatotoxic substances (alcohol, acetaminophen)", "Implement contact precautions for Hep A/E (fecal-oral)", "Refer for antiviral treatment (Hep B, C) as ordered"],
    nursingActions: ["Monitor liver function tests trends", "Assess for jaundice (scleral icterus is earliest sign)", "Monitor for coagulopathy (bleeding, bruising)", "Educate on transmission prevention", "Assess nutritional intake and appetite", "Report signs of hepatic encephalopathy (confusion, asterixis)", "Administer prescribed antiemetics for nausea", "Educate about avoiding alcohol and hepatotoxic medications"],
    signs: {
      left: ["Fatigue and Malaise", "Anorexia and Nausea", "Right Upper Quadrant Tenderness", "Low-Grade Fever (Prodromal Phase)"],
      right: ["Jaundice and Scleral Icterus", "Dark Urine (Cola-Colored) and Clay-Colored Stools", "Hepatomegaly with Tenderness", "Coagulopathy (Elevated PT/INR)"]
    },
    medications: [
      { name: "Hepatitis B Vaccine", type: "Immunization", action: "Stimulates anti-HBs antibody production for lifelong immunity", sideEffects: "Injection site soreness, mild fever", contra: "Severe allergic reaction to prior dose or yeast", pearl: "3-dose series (0, 1, 6 months); check anti-HBs titer in healthcare workers to confirm immunity >10 mIU/mL" },
      { name: "Immune Globulin", type: "Passive Immunization", action: "Provides immediate but temporary passive immunity", sideEffects: "Injection site pain, allergic reaction", contra: "IgA deficiency (risk of anaphylaxis)", pearl: "Give within 24 hours of Hep A exposure or within 12 hours of birth for infants of HBsAg+ mothers (with vaccine)" }
    ],
    pearls: [
      "Hep A: fecal-oral, acute only, VACCINE available; Hep B: bloodborne, can become chronic, VACCINE available; Hep C: bloodborne, most common chronic form, NO vaccine, NOW CURABLE with DAAs",
      "ALT is the most specific liver enzyme - 'L for Liver'; ALT > AST suggests viral hepatitis; AST > ALT (2:1 ratio) suggests alcoholic hepatitis",
      "Infants born to HBsAg-positive mothers must receive BOTH hepatitis B vaccine AND hepatitis B immune globulin (HBIG) within 12 hours of birth"
    ],
    quiz: [{
      question: "A patient has positive HBsAg, positive HBeAg, and positive anti-HBc IgM. What does this serologic pattern indicate?",
      options: ["Chronic hepatitis B infection", "Acute hepatitis B infection with high infectivity", "Immunity from vaccination", "Resolved past hepatitis B infection"],
      correct: 1,
      rationale: "HBsAg positive = active infection. Anti-HBc IgM = acute (recent) infection (IgG would indicate chronic or past). HBeAg positive = high viral replication and high infectivity. This combination indicates an acute, highly infectious hepatitis B infection."
    }]
  },
  "hepatitis-c": {
    title: "Hepatitis C",
    image: getAssetUrl("hepatitisc_1773340513136.png"),
    cellular: { title: "Chronic Bloodborne Hepatitis", content: "Hepatitis C virus (HCV) is an RNA flavivirus that infects hepatocytes via the CD81 receptor and claudin-1. Unlike hepatitis B, HCV has high mutation rates and lacks a proofreading mechanism, creating viral quasispecies that evade immune detection - this is why no vaccine exists and why chronic infection develops in 75-85% of cases. Chronic HCV triggers persistent low-grade inflammation, stellate cell activation, and progressive fibrosis (F0-F4 staging). Over 20-30 years, 15-30% of chronically infected patients progress to cirrhosis, and 1-5% per year of cirrhotics develop hepatocellular carcinoma (HCC). HCV is now CURABLE with direct-acting antivirals (DAAs)." },
    riskFactors: ["IV drug use (most common route in North America)", "Blood transfusion/organ transplant before 1992", "Needlestick injuries (healthcare workers)", "Birth to HCV-infected mother (5% vertical transmission)", "Intranasal drug use (shared straws)", "Tattoos/piercings with non-sterile equipment", "Incarceration history", "HIV co-infection", "Born between 1945-1965 (baby boomer screening recommendation)", "Hemodialysis"],
    diagnostics: ["Expect anti-HCV antibody test (screening)", "Expect HCV RNA viral load (confirms active infection)", "Expect HCV genotype testing (guides treatment selection)", "Monitor liver function tests", "Expect FibroScan or liver biopsy for fibrosis staging", "Expect hepatic function panel (albumin, bilirubin, INR)", "Screen for HCC with alpha-fetoprotein and ultrasound every 6 months in cirrhotics"],
    management: ["Initiate direct-acting antiviral (DAA) therapy as prescribed", "Treatment duration typically 8-12 weeks", "Avoid alcohol completely", "Avoid hepatotoxic medications (especially acetaminophen >2g/day)", "Screen and vaccinate for hepatitis A and B", "Monitor for drug interactions with DAAs", "Post-treatment: confirm sustained virologic response (SVR) at 12 weeks"],
    nursingActions: ["Educate on medication adherence (missed doses reduce cure rates)", "Teach blood and body fluid precautions", "Assess for medication side effects and drug interactions", "Educate on avoiding alcohol", "Ensure hepatitis A and B vaccination is complete", "Support mental health (depression common with diagnosis)", "Educate on transmission prevention (do not share razors, toothbrushes)", "Monitor for signs of decompensated liver disease"],
    signs: {
      left: ["Often Asymptomatic for Decades", "Fatigue (Most Common Symptom)", "Mild RUQ Discomfort", "Arthralgia and Myalgia"],
      right: ["Jaundice (Advanced Disease)", "Spider Angiomata and Palmar Erythema", "Cryoglobulinemia (Purpura, Arthritis, Neuropathy)", "Hepatocellular Carcinoma (Late Complication)"]
    },
    medications: [
      { name: "Sofosbuvir/Velpatasvir (Epclusa)", type: "Direct-Acting Antiviral (DAA)", action: "Pan-genotypic: Sofosbuvir inhibits NS5B RNA polymerase; Velpatasvir inhibits NS5A protein - blocks viral replication", sideEffects: "Headache, fatigue, nausea", contra: "Co-administration with amiodarone (risk of fatal bradycardia), strong P-gp inducers", pearl: "Pan-genotypic (works for ALL genotypes 1-6); 12-week course; >95% cure rate (SVR12); check for drug interactions especially with PPIs, statins, and HIV medications" },
      { name: "Glecaprevir/Pibrentasvir (Mavyret)", type: "Direct-Acting Antiviral (DAA)", action: "NS3/4A protease inhibitor + NS5A inhibitor; dual-target viral replication blockade", sideEffects: "Headache, fatigue, diarrhea", contra: "Moderate-to-severe hepatic impairment (Child-Pugh B or C), co-administration with atazanavir or rifampin", pearl: "8-week treatment for treatment-naive patients without cirrhosis; pan-genotypic; >97% cure rate" }
    ],
    pearls: [
      "Hepatitis C is now CURABLE - DAAs achieve >95% sustained virologic response (SVR); cure is defined as undetectable HCV RNA 12 weeks after treatment completion",
      "Anti-HCV antibody positive does NOT distinguish active from resolved infection - must confirm with HCV RNA viral load; antibody remains positive for life even after cure",
      "There is NO vaccine for hepatitis C due to the virus's rapid mutation rate - prevention relies entirely on avoiding blood-to-blood contact"
    ],
    quiz: [{
      question: "A patient treated for hepatitis C has undetectable HCV RNA 12 weeks after completing DAA therapy. What does this result indicate?",
      options: ["The patient needs additional treatment cycles", "Sustained virologic response - the patient is cured", "The patient is now immune and cannot be reinfected", "The virus is in remission but may return"],
      correct: 1,
      rationale: "Sustained virologic response at 12 weeks (SVR12) is defined as undetectable HCV RNA 12 weeks after completing treatment. This is considered a virologic cure with >99% durability. However, unlike hepatitis B recovery, HCV cure does NOT confer immunity - patients can be reinfected with new exposure. The anti-HCV antibody remains positive for life (it's a marker of past exposure, not immunity)."
    }]
  },
  "chronic-hepatitis": {
    title: "Chronic Hepatitis",
    cellular: { title: "Persistent Hepatic Inflammation", content: "Chronic hepatitis is defined as persistent hepatic inflammation lasting >6 months, most commonly caused by hepatitis B or C viruses, autoimmune hepatitis, or drug-induced liver injury. Persistent inflammation activates hepatic stellate cells (Ito cells), which transform into myofibroblasts and deposit excessive extracellular matrix (collagen types I and III). This progressive fibrosis distorts hepatic architecture, impairs sinusoidal blood flow, and ultimately leads to cirrhosis. The METAVIR scoring system grades inflammation (A0-A3) and stages fibrosis (F0-F4, where F4 = cirrhosis). Unlike acute hepatitis, chronic hepatitis often presents insidiously with nonspecific symptoms until decompensation occurs." },
    riskFactors: ["Chronic hepatitis B infection (5-10% of adults, 90% of infected neonates)", "Chronic hepatitis C infection (75-85% of acute infections)", "Autoimmune hepatitis (female predominance, associated with other autoimmune diseases)", "Chronic alcohol use", "Non-alcoholic steatohepatitis (NASH/MAFLD)", "Drug-induced hepatotoxicity (methotrexate, isoniazid, statins)", "Wilson disease", "Alpha-1 antitrypsin deficiency", "Hemochromatosis"],
    diagnostics: ["Monitor serial liver function tests (ALT, AST trends over time)", "Expect viral hepatitis serologies and viral loads", "Expect autoimmune markers (ANA, anti-smooth muscle antibody, IgG levels)", "Expect non-invasive fibrosis assessment (FibroScan/elastography)", "Expect liver biopsy for definitive diagnosis and staging", "Monitor alpha-fetoprotein every 6 months (HCC screening)", "Expect metabolic workup (ferritin, ceruloplasmin, A1AT level)"],
    management: ["Treat underlying etiology (antivirals for HBV/HCV, immunosuppression for autoimmune)", "Avoid hepatotoxic substances (alcohol, unnecessary medications)", "Vaccinate against hepatitis A and B if not immune", "Screen for hepatocellular carcinoma every 6 months", "Manage complications of portal hypertension", "Refer for liver transplant evaluation when appropriate", "Encourage Mediterranean-type diet and exercise for NAFLD"],
    nursingActions: ["Monitor liver function trends over time", "Educate on medication adherence for antiviral or immunosuppressive therapy", "Assess for signs of disease progression (jaundice, ascites, encephalopathy)", "Teach about alcohol avoidance", "Ensure vaccination status is current", "Monitor for medication side effects", "Screen for depression (common with chronic liver disease diagnosis)", "Educate on signs requiring immediate medical attention"],
    signs: {
      left: ["Fatigue (Most Common Symptom)", "Mild RUQ Discomfort", "Anorexia and Weight Loss", "Hepatomegaly"],
      right: ["Progressive Jaundice", "Spider Angiomata (Estrogen Metabolism Impairment)", "Palmar Erythema", "Signs of Cirrhosis (Ascites, Varices, Encephalopathy)"]
    },
    medications: [
      { name: "Entecavir/Tenofovir", type: "Antiviral (HBV)", action: "Nucleos(t)ide analogues that suppress HBV DNA replication", sideEffects: "Headache, fatigue; tenofovir: renal toxicity, bone density loss", contra: "Renal impairment (tenofovir); lactic acidosis risk", pearl: "First-line HBV antivirals; do NOT stop abruptly - risk of severe hepatic flare from immune reconstitution" },
      { name: "Prednisone + Azathioprine", type: "Immunosuppressive (Autoimmune Hepatitis)", action: "Suppress the autoimmune attack on hepatocytes", sideEffects: "Infection risk, bone loss, diabetes, myelosuppression", contra: "Active infection, TPMT deficiency (azathioprine)", pearl: "Check TPMT enzyme activity before starting azathioprine; 80% of autoimmune hepatitis patients respond to immunosuppression" }
    ],
    pearls: [
      "Chronic hepatitis is often silent for years - 'the liver suffers in silence'; many patients are diagnosed incidentally through abnormal liver enzymes",
      "NEVER abruptly stop HBV antivirals - withdrawal can trigger a severe hepatitis flare due to immune reconstitution that can lead to liver failure",
      "All patients with chronic hepatitis B or C AND cirrhosis need HCC screening with ultrasound and alpha-fetoprotein every 6 months for life"
    ],
    quiz: [{
      question: "A patient with chronic hepatitis B on entecavir tells the nurse they stopped taking their medication 2 weeks ago because they 'felt fine.' What is the nurse's priority concern?",
      options: ["The patient will develop drug resistance", "The patient is at risk for a severe hepatitis flare from abrupt discontinuation", "The viral load will slowly increase but without immediate danger", "The medication has a long half-life so 2 weeks is not concerning"],
      correct: 1,
      rationale: "Abrupt discontinuation of HBV nucleos(t)ide analogues can trigger a severe hepatitis B flare due to immune reconstitution and rapid viral rebound. The immune system, no longer suppressed by viral suppression, mounts an aggressive response against the rebounding virus, causing massive hepatocyte necrosis. This can lead to acute liver failure and death. The nurse should urgently contact the provider and educate the patient to never stop these medications without medical supervision."
    }]
  },

  "biliary-atresia-rpn": {
    title: "Biliary Atresia",
    cellular: {
      title: "Biliary Atresia - Recognizing Obstructive",
      content:
        "Biliary atresia is a condition in which the bile ducts outside the liver become blocked or destroyed, preventing bile from draining into the intestine. Bile is a fluid produced by the liver that helps digest fats and carries waste products for excretion. When bile cannot drain, it backs up into the liver, causing progressive damage. This condition occurs in approximately 1 in 10,000-15,000 live births and is the most common reason for liver transplantation in children.\n\nThe hallmark presentation is persistent jaundice beyond 2 weeks of life. Unlike physiological jaundice of the newborn (which resolves within the first 1-2 weeks), biliary atresia jaundice worsens over time. The backed-up bile causes conjugated (direct) hyperbilirubinemia, which is always abnormal in a newborn. The infant develops pale, clay-colored (acholic) stools because bile pigments cannot reach the intestine, and dark amber urine because excess conjugated bilirubin is excreted by the kidneys. The liver becomes enlarged and firm on palpation as bile accumulates and causes inflammation and early fibrosis. Without surgical intervention, progressive liver fibrosis leads to cirrhosis and liver failure within the first year of life."
    },
    riskFactors: [
      "Newborn with jaundice persisting beyond 2 weeks of life",
      "Female sex (slightly higher incidence)",
      "Premature birth or low birth weight",
      "Associated congenital anomalies (polysplenia, situs inversus, cardiac defects)"
    ],
    diagnostics: [
      "Serum bilirubin: elevated direct (conjugated) bilirubin is always abnormal in a newborn",
      "Liver function tests: elevated GGT and ALP",
      "Abdominal ultrasound: absent or abnormal gallbladder, triangular cord sign at porta hepatis",
      "HIDA scan: no excretion of radiotracer into the intestine confirms biliary obstruction",
      "Liver biopsy and intraoperative cholangiogram for definitive diagnosis"
    ],
    management: [
      "Kasai portoenterostomy (surgical connection of a loop of intestine directly to the liver surface to allow bile drainage) performed ideally before 60 days of life",
      "Fat-soluble vitamin supplementation (A, D, E, K) because bile is needed for fat absorption",
      "Medium-chain triglyceride (MCT) formula for improved fat absorption",
      "Monitor for cholangitis (infection of the bile drainage system) post-Kasai",
      "Liver transplant evaluation if Kasai procedure fails or cirrhosis progresses"
    ],
    nursingActions: [
      "Monitor stool color: report persistent pale or clay-colored stools to the RN/provider",
      "Monitor skin and sclera for worsening jaundice",
      "Weigh infant daily and record intake and output accurately",
      "Administer fat-soluble vitamins and MCT formula as ordered",
      "Report signs of cholangitis: fever, worsening jaundice, irritability",
      "Educate parents on stool color monitoring using a stool color card"
    ],
    signs: {
      left: [
        "Persistent jaundice beyond 2 weeks of life (worsening, not resolving)",
        "Clay-colored (acholic) stools",
        "Dark amber or tea-colored urine",
        "Hepatomegaly (enlarged, firm liver on palpation)"
      ],
      right: [
        "Poor weight gain and failure to thrive",
        "Abdominal distension",
        "Easy bruising (vitamin K malabsorption → coagulopathy)",
        "Irritability and poor feeding"
      ]
    },
    medications: [
      {
        name: "Ursodiol (Actigall)",
        type: "Bile acid (choleretic agent)",
        action: "Promotes bile flow and protects hepatocytes from toxic bile acid accumulation",
        sideEffects: "Diarrhea, nausea",
        contra: "Complete biliary obstruction (no bile flow possible)",
        pearl: "Used post-Kasai to promote bile drainage; monitor stool color to assess effectiveness"
      },
      {
        name: "Phytonadione (Vitamin K)",
        type: "Fat-soluble vitamin supplement",
        action: "Essential cofactor for synthesis of clotting factors II, VII, IX, X; malabsorbed when bile flow is absent",
        sideEffects: "Injection site reaction, rare anaphylaxis with IV administration",
        contra: "Known hypersensitivity",
        pearl: "Give IM or IV as bile absence prevents oral absorption; monitor for bruising and bleeding as signs of deficiency"
      }
    ],
    pearls: [
      "Any jaundice persisting beyond 2 weeks of life requires a fractionated bilirubin to rule out biliary atresia",
      "Clay-colored stools + dark urine + persistent jaundice = suspect biliary atresia until proven otherwise",
      "The Kasai procedure is most successful when performed before 60 days of life; early recognition is critical",
      "Biliary atresia is the #1 indication for pediatric liver transplantation"
    ],
    quiz: [
      {
        question: "A 3-week-old infant has persistent jaundice, clay-colored stools, and dark urine. Which action should the practical nurse take first?",
        options: [
          "Document findings and continue routine care",
          "Report findings to the RN/provider immediately",
          "Place the infant under phototherapy lights",
          "Increase oral feeding frequency"
        ],
        correct: 1,
        rationale: "Persistent jaundice beyond 2 weeks with clay-colored stools and dark urine suggests biliary atresia, which requires urgent evaluation. The practical nurse should report these findings immediately so that diagnostic workup (fractionated bilirubin, ultrasound) can be initiated. Phototherapy treats unconjugated hyperbilirubinemia and would not address obstructive jaundice."
      }
    ]
  },

  "biliary-atresia": {
    title: "Biliary Atresia",
    cellular: {
      title: "Biliary Atresia - Progressive Obliterative",
      content:
        "Biliary atresia is a progressive obliterative cholangiopathy of infancy in which the extrahepatic bile ducts undergo inflammatory destruction and fibrous obliteration, preventing bile drainage from the liver to the duodenum. The etiology remains incompletely understood but involves a complex interplay of viral triggers, immune-mediated bile duct injury, and defective morphogenesis. The perinatal or acquired form (approximately 85% of cases) is thought to be initiated by a viral insult (reovirus, rotavirus, or cytomegalovirus) that triggers an aberrant immune response targeting bile duct epithelial cells (cholangiocytes).\n\nAt the cellular level, the inflammatory infiltrate surrounding the bile ducts is predominantly composed of CD4+ and CD8+ T lymphocytes, natural killer cells, and macrophages. These immune cells release pro-inflammatory cytokines including TNF-α, IFN-γ, and IL-2, which directly damage cholangiocyte apical membranes and tight junctions. Activated macrophages produce matrix metalloproteinases (MMPs) that degrade the periductal extracellular matrix, while transforming growth factor-β (TGF-β) signaling activates periductal myofibroblasts that deposit excessive collagen, leading to concentric fibrosis and luminal obliteration. The progressive cholestasis activates hepatic stellate cells through bile acid toxicity, accelerating bridging fibrosis and biliary cirrhosis.\n\nThe embryonic or fetal form (approximately 15% of cases) involves defective bile duct morphogenesis during the fourth to sixth week of gestation, often associated with laterality defects (biliary atresia splenic malformation syndrome). These infants may present with polysplenia, situs inversus, preduodenal portal vein, interrupted inferior vena cava, and cardiac anomalies. This form suggests a developmental defect in the Notch signaling pathway or abnormal Hedgehog signaling that disrupts ductal plate remodeling.\n\nThe Kasai portoenterostomy involves excision of the obliterated extrahepatic bile ducts and creation of a Roux-en-Y jejunal conduit anastomosed to the porta hepatis (the transected surface of the liver hilum where microscopic bile ductules may still be patent). Success depends critically on age at surgery: when performed before 60 days of life, approximately 60-70% of infants achieve bile drainage. After 90 days, success rates drop below 20% due to advanced intrahepatic fibrosis. Even with successful bile drainage, approximately 70-80% of children eventually require liver transplantation due to progressive intrahepatic disease."
    },
    riskFactors: [
      "Newborn with persistent conjugated hyperbilirubinemia beyond 2 weeks of life",
      "Female sex (slightly higher incidence in perinatal form)",
      "Possible viral triggers: reovirus, rotavirus, CMV exposure in perinatal period",
      "Associated congenital anomalies (polysplenia, situs inversus, cardiac defects) in embryonic form",
      "No clear genetic inheritance pattern in most cases"
    ],
    diagnostics: [
      "Fractionated bilirubin: elevated direct (conjugated) bilirubin (> 1 mg/dL or > 20% of total) is always pathological",
      "Liver function tests: markedly elevated GGT (most sensitive), elevated ALP, variably elevated transaminases",
      "Abdominal ultrasound: absent or atretic gallbladder, triangular cord sign (echogenic triangular density at porta hepatis), absent common bile duct",
      "Hepatobiliary scintigraphy (HIDA scan): good hepatocyte uptake but NO excretion into the intestine within 24 hours",
      "Percutaneous liver biopsy: bile duct proliferation, bile plugs in portal triads, portal fibrosis, inflammatory infiltrate",
      "Intraoperative cholangiogram: definitive diagnosis showing non-patent extrahepatic biliary system"
    ],
    management: [
      "Kasai portoenterostomy within 30-60 days of life for optimal outcomes",
      "Perioperative IV antibiotics to prevent cholangitis",
      "Postoperative ursodiol (ursodeoxycholic acid) to promote bile flow and protect hepatocytes",
      "Prophylactic antibiotics (trimethoprim-sulfamethoxazole) for cholangitis prevention in first year post-Kasai",
      "Aggressive nutritional support: MCT-based formula, caloric supplementation (120-150% of normal requirements)",
      "Fat-soluble vitamin supplementation (vitamins A, D, E, K) with monitoring of serum levels",
      "Liver transplant evaluation for failed Kasai (no bile drainage by 3 months post-surgery) or progressive liver failure"
    ],
    nursingActions: [
      "Monitor stool color systematically using a validated stool color card; report any pale or acholic stools",
      "Monitor and report signs of ascending cholangitis: fever, worsening jaundice, acholic stools, irritability",
      "Maintain strict intake and output; monitor daily weights and growth parameters",
      "Administer fat-soluble vitamins and assess for deficiency signs: bleeding (K), rickets (D), neurological changes (E), night blindness (A)",
      "Monitor for signs of portal hypertension: splenomegaly, ascites, variceal bleeding",
      "Educate parents on long-term monitoring needs, stool color assessment, and signs requiring emergency care",
      "Provide psychosocial support to family regarding potential need for liver transplantation"
    ],
    signs: {
      left: [
        "Persistent jaundice worsening beyond 2 weeks of life",
        "Acholic (clay-colored, pale) stools",
        "Dark amber urine (conjugated bilirubinuria)",
        "Hepatomegaly with firm liver edge on palpation"
      ],
      right: [
        "Failure to thrive and poor weight gain despite adequate intake",
        "Splenomegaly (developing portal hypertension)",
        "Ascites (progressive liver fibrosis)",
        "Easy bruising and prolonged bleeding (vitamin K malabsorption)",
        "Pruritus (bile salt deposition in skin)"
      ]
    },
    medications: [
      {
        name: "Ursodiol (Ursodeoxycholic Acid)",
        type: "Hydrophilic bile acid / Choleretic",
        action: "Replaces toxic hydrophobic bile acids at the hepatocyte membrane, stabilizes cholangiocyte membranes, promotes bicarbonate-rich bile secretion (choleresis), and has anti-apoptotic effects on hepatocytes via inhibition of mitochondrial membrane permeability transition",
        sideEffects: "Diarrhea, nausea, elevated transaminases (transient)",
        contra: "Complete biliary obstruction with no bile flow",
        pearl: "Start post-Kasai to maximize bile drainage; effective bile flow is confirmed by pigmented (yellow-green) stools"
      },
      {
        name: "Trimethoprim-Sulfamethoxazole (TMP-SMX)",
        type: "Antibiotic (folate antagonist combination)",
        action: "Prophylactic suppression of enteric bacteria that can ascend through the Roux-en-Y conduit and cause cholangitis",
        sideEffects: "Rash, bone marrow suppression, Stevens-Johnson syndrome (rare), hepatotoxicity",
        contra: "Sulfa allergy, severe hepatic or renal impairment, G6PD deficiency",
        pearl: "Cholangitis is the most common post-Kasai complication; prophylaxis significantly reduces episodes in the first year"
      }
    ],
    pearls: [
      "Conjugated (direct) bilirubin > 1 mg/dL in a newborn is NEVER normal and demands immediate investigation",
      "The 'golden window' for Kasai surgery is before 60 days of life; every day of delay worsens outcomes",
      "GGT is the most sensitive liver enzyme for biliary atresia and is markedly elevated compared to other neonatal cholestatic conditions",
      "Even successful Kasai is not curative; 70-80% of patients eventually need liver transplantation",
      "Cholangitis post-Kasai presents as fever + worsening jaundice + acholic stools; requires immediate IV antibiotics"
    ],
    quiz: [
      {
        question: "A 4-week-old infant presents with worsening jaundice, clay-colored stools, and dark urine. Laboratory results show a total bilirubin of 9.2 mg/dL with a direct bilirubin of 6.8 mg/dL. Which diagnostic finding on hepatobiliary scintigraphy (HIDA scan) would confirm biliary atresia?",
        options: [
          "Rapid uptake and excretion of radiotracer into the intestine",
          "Good hepatocyte uptake but no excretion into the intestine at 24 hours",
          "Poor hepatocyte uptake with delayed excretion into the intestine",
          "Normal uptake and excretion with gallbladder visualization"
        ],
        correct: 1,
        rationale: "In biliary atresia, hepatocytes can take up the radiotracer normally, but the obliterated extrahepatic bile ducts prevent any excretion into the intestine. Non-visualization of the intestine at 24 hours despite good hepatocyte uptake is characteristic of biliary atresia and differentiates it from neonatal hepatitis, where some excretion may occur."
      }
    ]
  },

  "biliary-atresia-np": {
    title: "Biliary Atresia",
    cellular: {
      title: "Biliary Atresia - Molecular Pathogenesis",
      content:
        "Biliary atresia represents a phenotypic endpoint of progressive obliterative cholangiopathy driven by the convergence of viral triggers, dysregulated innate and adaptive immunity, and aberrant developmental signaling. Current molecular evidence supports a two-hit model: an initial viral insult (reovirus type 3, rotavirus group C, or CMV) infects cholangiocytes via apical membrane receptors, triggering innate immune activation through pattern recognition receptors (Toll-like receptors TLR3 and TLR7 recognizing viral dsRNA and ssRNA respectively). This initial inflammatory response activates resident hepatic macrophages (Kupffer cells) and recruits circulating monocytes, NK cells, and dendritic cells to the periductal region.\n\nThe second hit involves a maladaptive adaptive immune response. Molecular mimicry between viral epitopes and cholangiocyte surface antigens (particularly enolase-α and annexin A2) drives autoreactive CD4+ Th1 cell activation. These Th1 cells produce IFN-γ and TNF-α that upregulate MHC class II expression on cholangiocytes, rendering them targets for CD8+ cytotoxic T lymphocyte-mediated killing via perforin-granzyme pathways and Fas-FasL-mediated apoptosis. Simultaneously, IL-17-producing Th17 cells amplify neutrophil recruitment and periductal inflammation. Regulatory T cell (Treg) dysfunction, characterized by decreased FOXP3 expression, fails to suppress this autoimmune cascade.\n\nAt the molecular level, TGF-β1 signaling through Smad2/3 phosphorylation activates hepatic stellate cells and portal fibroblasts, driving excessive deposition of collagen types I, III, and IV in the portal tracts. Hedgehog pathway activation (through Sonic Hedgehog ligand binding to Patched receptors on stellate cells) promotes epithelial-to-mesenchymal transition (EMT) of reactive cholangiocytes, further contributing to fibrogenesis. The Notch signaling pathway, essential for normal biliary morphogenesis during the ductal plate remodeling phase (weeks 12-20 of gestation), is disrupted in the embryonic form of biliary atresia, leading to defective intrahepatic bile duct formation resembling Alagille syndrome.\n\nThe Kasai portoenterostomy exploits the fact that microscopic bile ductules at the porta hepatis (within the fibrous tissue remnant) may still be patent and connected to intrahepatic bile ducts. Resection of the fibrous remnant and anastomosis of a Roux-en-Y jejunal loop to the exposed transected surface allows bile to drain directly from these microscopic channels. Post-Kasai, the native liver bile drainage capacity is assessed by monitoring serum bilirubin clearance: normalization of total bilirubin to < 2 mg/dL within 3 months predicts a 10-year native liver survival of approximately 75%. Persistently elevated bilirubin indicates ongoing intrahepatic disease progression requiring transplant evaluation.\n\nLiver transplantation outcomes in biliary atresia are excellent, with 5-year patient survival exceeding 90% and graft survival exceeding 85%. Living-donor left lateral segmentectomy from a parent is the most common graft type. Post-transplant immunosuppression typically involves tacrolimus-based regimens targeting calcineurin-NFAT pathway inhibition to prevent T cell-mediated graft rejection. Long-term complications include chronic rejection, post-transplant lymphoproliferative disorder (PTLD, driven by EBV reactivation), and renal dysfunction from calcineurin inhibitor nephrotoxicity."
    },
    riskFactors: [
      "Perinatal viral exposure (reovirus, rotavirus, CMV) triggering immune-mediated bile duct destruction",
      "Dysregulated Th1/Th17 immune response with Treg insufficiency",
      "Biliary atresia splenic malformation (BASM) syndrome with laterality defects (embryonic form)",
      "Possible genetic susceptibility loci identified on chromosomes 2q37.3 and 10q24.2 (GPC1 and ADD3 genes)",
      "Aberrant Notch and Hedgehog signaling during biliary morphogenesis (embryonic form)",
      "No clear Mendelian inheritance pattern; likely multifactorial etiology"
    ],
    diagnostics: [
      "Fractionated bilirubin: conjugated fraction > 20% of total or > 1 mg/dL is always pathological in neonates",
      "Serum GGT: markedly elevated (often > 300 U/L); most sensitive biochemical marker distinguishing BA from other neonatal cholestatic conditions",
      "Abdominal ultrasound: triangular cord sign (sensitivity 73-100%), absent/abnormal gallbladder, absent common bile duct",
      "Hepatobiliary scintigraphy with phenobarbital priming: good hepatocyte uptake, absent intestinal excretion at 24 hours",
      "MR cholangiography (MRCP): emerging non-invasive tool for visualizing biliary anatomy",
      "Percutaneous liver biopsy: bile duct proliferation, bile plugs in portal triads, portal fibrosis with preserved lobular architecture (distinguishes from neonatal hepatitis)",
      "Intraoperative cholangiogram: gold standard showing non-patent extrahepatic biliary system",
      "Post-Kasai monitoring: serial bilirubin trends, liver elastography (FibroScan) for fibrosis staging"
    ],
    management: [
      "Kasai portoenterostomy before 30-45 days of life for optimal outcomes (before 60 days at latest)",
      "Perioperative corticosteroids (prednisolone taper) to reduce periductal inflammation and improve bile drainage (evidence mixed but widely practiced)",
      "Ursodeoxycholic acid (15-20 mg/kg/day) for choleresis and hepatoprotection post-Kasai",
      "Cholangitis prophylaxis: TMP-SMX or neomycin for 12 months post-Kasai",
      "Aggressive nutritional optimization: MCT-enriched formula, caloric density 120-150% of age-appropriate intake",
      "Fat-soluble vitamin replacement with serum level monitoring: vitamin A (retinol), D (25-OH), E (alpha-tocopherol:lipid ratio), K (INR/PT)",
      "Portal hypertension management: propranolol for variceal prophylaxis, endoscopic variceal ligation if indicated",
      "Liver transplant evaluation: indicated for failed Kasai (persistent jaundice at 3 months), growth failure, recurrent cholangitis, or progressive portal hypertension",
      "Post-transplant: tacrolimus-based immunosuppression, EBV viral load monitoring for PTLD surveillance"
    ],
    nursingActions: [
      "Coordinate multidisciplinary care: hepatology, transplant surgery, nutrition, social work",
      "Monitor post-Kasai bilirubin trends: failure to clear bilirubin below 2 mg/dL by 3 months post-surgery indicates poor prognosis",
      "Assess for cholangitis systematically: fever > 38°C, rising bilirubin, acholic stools, elevated WBC with left shift",
      "Monitor fat-soluble vitamin levels and administer water-miscible preparations as ordered",
      "Perform serial growth assessments and nutritional status monitoring (mid-arm circumference, triceps skinfold)",
      "Educate family on transplant evaluation process, living-donor options, and long-term immunosuppression requirements",
      "Monitor for portal hypertension complications: splenomegaly progression, thrombocytopenia trends, variceal bleeding signs",
      "Support family through complex medical decision-making with evidence-based information"
    ],
    signs: {
      left: [
        "Progressive conjugated hyperbilirubinemia not responding to Kasai",
        "Persistent acholic stools post-Kasai (indicates failed bile drainage)",
        "Hepatomegaly progressing to firm, nodular liver (cirrhotic transformation)",
        "Ascites and abdominal distension (decompensated portal hypertension)"
      ],
      right: [
        "Splenomegaly with hypersplenism (thrombocytopenia, leukopenia)",
        "Growth failure despite caloric supplementation (hepatic synthetic failure)",
        "Fat-soluble vitamin deficiency manifestations: rickets (D), coagulopathy (K), peripheral neuropathy (E)",
        "Recurrent cholangitis episodes with increasing frequency"
      ]
    },
    medications: [
      {
        name: "Tacrolimus (Prograf)",
        type: "Calcineurin inhibitor / Immunosuppressant",
        action: "Binds FKBP12 protein, forming a complex that inhibits calcineurin phosphatase activity, preventing dephosphorylation of NFAT transcription factor, thereby blocking IL-2 transcription and T cell activation; critical for preventing graft rejection post-liver transplant",
        sideEffects: "Nephrotoxicity, neurotoxicity (tremor, headache), hyperglycemia, hyperkalemia, hypertension, increased infection risk",
        contra: "Hypersensitivity to tacrolimus or polyoxyl 60 hydrogenated castor oil (IV formulation)",
        pearl: "Therapeutic drug monitoring essential (trough levels 8-12 ng/mL early post-transplant, 5-8 ng/mL maintenance); nephrotoxicity is dose-dependent and the primary long-term concern"
      },
      {
        name: "Prednisolone",
        type: "Corticosteroid / Anti-inflammatory",
        action: "Suppresses periductal inflammation post-Kasai by inhibiting NF-κB-mediated cytokine transcription, reducing immune-mediated cholangiocyte injury; may improve early bile drainage",
        sideEffects: "Growth suppression, immunosuppression, hyperglycemia, adrenal suppression, osteoporosis",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "Typically given as a post-Kasai taper (starting 2 mg/kg/day, weaning over 8-12 weeks); evidence for benefit is mixed but widely practiced in major centers"
      }
    ],
    pearls: [
      "The two-hit hypothesis (viral trigger → autoimmune bile duct destruction) explains why biliary atresia presents postnatally even though bile ducts form by week 12 of gestation",
      "GGT is the single most useful biochemical marker: markedly elevated in biliary atresia, normal or mildly elevated in most other neonatal cholestatic conditions",
      "Post-Kasai bilirubin clearance to < 2 mg/dL within 3 months is the strongest predictor of native liver survival",
      "Liver transplant for biliary atresia has > 90% five-year patient survival; living-donor left lateral segmentectomy is preferred for size matching",
      "PTLD risk is highest in the first year post-transplant; EBV-seronegative recipients of EBV-seropositive grafts are at highest risk"
    ],
    quiz: [
      {
        question: "A nurse practitioner is evaluating a 10-week-old infant 6 weeks post-Kasai portoenterostomy. The total bilirubin remains 8.4 mg/dL with a direct fraction of 6.9 mg/dL, and stools remain pale. Which clinical implication is most accurate?",
        options: [
          "This is expected; bilirubin clearance takes 4-6 months post-Kasai",
          "The persistent hyperbilirubinemia indicates Kasai failure and warrants liver transplant evaluation",
          "Increasing the ursodiol dose will resolve the cholestasis",
          "The infant should undergo a repeat Kasai procedure"
        ],
        correct: 1,
        rationale: "Failure to clear bilirubin below 2 mg/dL within 3 months post-Kasai is the strongest predictor of poor native liver survival and indicates Kasai failure. At 6 weeks post-surgery with persistently elevated conjugated bilirubin and acholic stools, this infant shows no evidence of effective bile drainage. Liver transplant evaluation should be initiated. A repeat Kasai procedure is not standard practice and has poor outcomes."
      }
    ]
  },

  "eosinophilic-esophagitis-rpn": {
    title: "Eosinophilic Esophagitis",
    cellular: {
      title: "Eosinophilic Esophagitis - Recognizing",
      content:
        "Eosinophilic esophagitis (EoE) is a chronic immune-mediated condition in which the esophagus becomes inflamed with a type of white blood cell called eosinophils. Normally, eosinophils are not found in the esophageal tissue; their presence indicates an allergic inflammatory response. This inflammation causes the esophagus to become swollen, stiff, and narrowed, making swallowing difficult and painful.\n\nEoE is increasingly common, particularly in children and young adults with a history of other allergic conditions such as asthma, eczema, or food allergies. The most common symptom in older children and adults is dysphagia (difficulty swallowing), especially with solid foods. Younger children may present with feeding difficulties, food refusal, vomiting, and failure to thrive. A hallmark presentation is food impaction, where a solid food bolus becomes stuck in the esophagus and cannot pass. Clients often develop compensatory eating behaviors such as eating very slowly, cutting food into tiny pieces, drinking excessive liquids with meals, and avoiding certain textures."
    },
    riskFactors: [
      "Male sex (3:1 male-to-female ratio)",
      "History of atopic conditions: asthma, eczema, allergic rhinitis, food allergies",
      "Family history of EoE or atopic diseases",
      "Caucasian ethnicity (highest prevalence)",
      "Age: can occur at any age but most commonly diagnosed in children and young adults"
    ],
    diagnostics: [
      "Upper endoscopy with esophageal biopsies is the definitive diagnostic test: look for esophageal rings (trachealization), white plaques (eosinophilic microabscesses), linear furrows, and edema",
      "Histology showing 15 or more eosinophils per high-power field confirms the diagnosis",
      "Allergy testing (skin prick testing and/or serum IgE panels) to identify potential food triggers",
      "Barium swallow may show esophageal narrowing, rings, or strictures but is not diagnostic",
      "Monitor weight, growth charts (in children), and nutritional status during dietary elimination therapy",
      "Assess for other atopic conditions: asthma control, eczema severity, allergic rhinitis symptoms",
    ],
    management: [
      "Dietary elimination therapy: remove common trigger foods (milk, wheat, eggs, soy, nuts, fish/shellfish)",
      "Swallowed topical corticosteroids (fluticasone or budesonide) to reduce esophageal eosinophilic inflammation",
      "Proton pump inhibitor (PPI) therapy as initial trial",
      "Esophageal dilation for symptomatic strictures",
      "Allergy testing to identify potential food triggers"
    ],
    nursingActions: [
      "Monitor for signs of food impaction: sudden inability to swallow, drooling, chest pain",
      "Educate client/family on dietary elimination and food diary keeping",
      "Report episodes of dysphagia, food impaction, or weight loss to the RN/provider",
      "Ensure client understands how to properly swallow topical corticosteroids (swallow, do not inhale)",
      "Monitor growth parameters in pediatric clients",
      "Provide emotional support; dietary restrictions can be socially challenging for children"
    ],
    signs: {
      left: [
        "Dysphagia (difficulty swallowing), especially with solid foods",
        "Food impaction (food bolus stuck in esophagus)",
        "Chest pain or heartburn not responsive to antacids",
        "Feeding refusal and vomiting in young children"
      ],
      right: [
        "Compensatory eating behaviors (slow eating, excessive chewing, avoiding textures)",
        "Failure to thrive or poor weight gain in children",
        "Abdominal pain and nausea",
        "History of multiple atopic conditions (asthma, eczema, allergies)"
      ]
    },
    medications: [
      {
        name: "Fluticasone (swallowed, not inhaled)",
        type: "Topical corticosteroid",
        action: "Reduces eosinophilic inflammation in the esophageal mucosa when swallowed as a topical agent",
        sideEffects: "Oral candidiasis (thrush), esophageal candidiasis",
        contra: "Active esophageal infection",
        pearl: "Client must swallow the medication, NOT inhale it; do not eat or drink for 30 minutes after administration to maximize mucosal contact time"
      },
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton pump inhibitor (PPI)",
        action: "Suppresses gastric acid secretion, which may reduce acid-mediated esophageal inflammation; some patients with EoE respond to PPI therapy alone",
        sideEffects: "Headache, diarrhea, abdominal pain; long-term: vitamin B12 and magnesium deficiency",
        contra: "Known hypersensitivity",
        pearl: "PPI-responsive esophageal eosinophilia is now considered part of the EoE spectrum; a PPI trial is often the first step"
      }
    ],
    pearls: [
      "EoE should be suspected in any client with recurrent dysphagia, food impaction, or heartburn not responding to standard GERD treatment",
      "Food impaction requiring emergency removal is often the event that leads to EoE diagnosis",
      "The 'six food elimination diet' removes milk, wheat, eggs, soy, nuts, and fish/shellfish; foods are reintroduced one at a time",
      "Topical corticosteroids for EoE are swallowed, not inhaled; this is a common point of client confusion"
    ],
    quiz: [
      {
        question: "A 12-year-old with a history of asthma and eczema presents with difficulty swallowing solid foods and reports that food 'gets stuck.' Which condition should the nurse suspect?",
        options: [
          "Gastroesophageal reflux disease (GERD)",
          "Eosinophilic esophagitis (EoE)",
          "Esophageal cancer",
          "Achalasia"
        ],
        correct: 1,
        rationale: "The combination of dysphagia with food impaction symptoms in a young client with a strong atopic history (asthma, eczema) is highly suggestive of eosinophilic esophagitis. While GERD can cause heartburn, it typically does not cause dysphagia with food impaction in children."
      }
    ]
  },

  "eosinophilic-esophagitis": {
    title: "Eosinophilic Esophagitis",
    cellular: {
      title: "Eosinophilic Esophagitis - Th2-Mediated",
      content:
        "Eosinophilic esophagitis (EoE) is a chronic, antigen-driven, immune-mediated esophageal disease characterized by symptoms of esophageal dysfunction and histologically by eosinophil-predominant inflammation (≥ 15 eosinophils per high-power field on esophageal biopsy). The pathogenesis involves a Th2-mediated immune response triggered primarily by food antigens and, to a lesser extent, aeroallergens.\n\nAt the cellular level, antigen presentation by esophageal dendritic cells activates CD4+ Th2 lymphocytes, which produce interleukin-4 (IL-4), interleukin-5 (IL-5), and interleukin-13 (IL-13). IL-5 is the primary cytokine responsible for eosinophil maturation in the bone marrow, recruitment to the esophagus, and prolonged survival through inhibition of apoptosis. IL-13 acts on esophageal epithelial cells to downregulate the barrier protein desmoglein-1, disrupting epithelial integrity and increasing permeability to luminal antigens. IL-13 also induces esophageal epithelial cells to produce eotaxin-3 (CCL26), the most potent eosinophil chemotactic factor, which binds to CCR3 receptors on eosinophils, creating a powerful chemoattractant gradient that draws eosinophils into the esophageal mucosa.\n\nActivated eosinophils degranulate, releasing major basic protein (MBP), eosinophil peroxidase (EPO), and eosinophil cationic protein (ECP), which are directly cytotoxic to epithelial cells. Eosinophils also release TGF-β1, which activates subepithelial fibroblasts and smooth muscle cells, driving collagen deposition and smooth muscle hypertrophy in the lamina propria. This fibrotic remodeling progressively reduces esophageal compliance and caliber, creating the characteristic ringed appearance (trachealization or feline esophagus) and strictures seen on endoscopy.\n\nEndoscopic findings include linear furrows (vertical grooves from mucosal edema), white exudates or plaques (eosinophilic microabscesses), concentric rings (fixed strictures from subepithelial fibrosis), mucosal edema with loss of vascular pattern, and narrow-caliber esophagus. The EoE Endoscopic Reference Score (EREFS) standardizes the grading of these findings. Biopsy must be obtained from both the proximal and distal esophagus (minimum 2-4 specimens from each site) because eosinophilic infiltration can be patchy."
    },
    riskFactors: [
      "Male sex (3:1 predominance)",
      "Atopic triad: concurrent asthma, eczema, or allergic rhinitis (50-80% of EoE patients)",
      "IgE-mediated food allergies (though EoE itself is primarily non-IgE mediated)",
      "Family history of EoE (sibling recurrence risk 40-fold higher than general population)",
      "Caucasian ethnicity",
      "Early antibiotic exposure, cesarean delivery, and formula feeding (microbiome disruption hypothesis)"
    ],
    diagnostics: [
      "Upper endoscopy with biopsies: ≥ 15 eosinophils/HPF from proximal AND distal esophagus (minimum 6 biopsies total)",
      "Endoscopic findings: rings, furrows, white exudates, edema, strictures (EREFS scoring)",
      "Symptoms of esophageal dysfunction: dysphagia, food impaction, chest pain, feeding difficulties",
      "Rule out other causes of esophageal eosinophilia: GERD, parasitic infection, hypereosinophilic syndrome, Crohn's disease",
      "PPI trial: current guidelines consider PPI-responsive esophageal eosinophilia as part of the EoE spectrum",
      "Allergy testing (skin prick testing and atopy patch testing) to guide dietary elimination"
    ],
    management: [
      "Dietary therapy: empiric 6-food elimination diet (milk, wheat, eggs, soy, nuts, fish/shellfish) with sequential reintroduction and repeat endoscopy after each food",
      "2-food or 4-food elimination (step-up approach: remove milk and wheat first, then add soy and eggs if needed)",
      "Swallowed topical corticosteroids: fluticasone MDI (swallowed without spacer) or oral viscous budesonide slurry",
      "PPI therapy: omeprazole or esomeprazole as first-line or adjunctive therapy",
      "Endoscopic dilation for symptomatic strictures (gradual, controlled dilation to avoid perforation)",
      "Dupilumab (anti-IL-4/IL-13 monoclonal antibody) for refractory EoE in patients ≥ 12 years and weighing ≥ 40 kg",
      "Repeat endoscopy with biopsies 8-12 weeks after each therapeutic intervention to assess histological response"
    ],
    nursingActions: [
      "Educate on proper swallowed corticosteroid technique: puff into mouth and swallow (no spacer), or mix budesonide with honey/sucralose slurry; NPO for 30 minutes after",
      "Assess and document dysphagia severity using a validated symptom scoring tool",
      "Monitor for food impaction: sudden dysphagia, inability to swallow saliva, drooling, chest pain → emergency",
      "Support dietary elimination compliance: connect with dietitian, provide meal planning resources",
      "Monitor growth charts in pediatric patients and report any decline in growth velocity",
      "Educate on the chronic nature of EoE: lifelong disease requiring ongoing monitoring even during remission",
      "Screen for oral candidiasis in patients on swallowed corticosteroids"
    ],
    signs: {
      left: [
        "Dysphagia primarily to solid foods (most common symptom in adolescents and adults)",
        "Food impaction requiring emergency endoscopic removal",
        "Heartburn/chest pain unresponsive to standard GERD therapy",
        "Feeding difficulties, vomiting, and food refusal in young children"
      ],
      right: [
        "Endoscopic: rings (trachealization), linear furrows, white exudates, narrow caliber",
        "Compensatory eating behaviors (prolonged mealtimes, excessive liquid intake with solids)",
        "Failure to thrive in pediatric patients",
        "Concurrent atopic conditions (asthma, eczema, rhinitis, food allergies)"
      ]
    },
    medications: [
      {
        name: "Oral Viscous Budesonide (OVB)",
        type: "Topical corticosteroid slurry",
        action: "Potent glucocorticoid that suppresses Th2 cytokine production, reduces eotaxin-3 expression, inhibits eosinophil recruitment and activation, and restores epithelial barrier protein (desmoglein-1) expression in the esophageal mucosa",
        sideEffects: "Esophageal candidiasis (10-15%), adrenal suppression (rare with topical use)",
        contra: "Active esophageal infection (candidiasis, herpes)",
        pearl: "Mix budesonide respules with 5-10 mL of sucralose or honey to create a viscous slurry that coats the esophagus; NPO for 30 min after dosing to maximize mucosal contact"
      },
      {
        name: "Dupilumab (Dupixent)",
        type: "Monoclonal antibody (anti-IL-4Rα)",
        action: "Blocks IL-4 and IL-13 signaling by binding the shared IL-4 receptor alpha subunit, inhibiting Th2-mediated inflammation, reducing eotaxin-3 production, and decreasing eosinophil recruitment to the esophagus",
        sideEffects: "Injection site reactions, conjunctivitis, nasopharyngitis",
        contra: "Known hypersensitivity to dupilumab; caution with helminth infections",
        pearl: "First FDA-approved biologic for EoE (2022); indicated for patients ≥ 12 years and ≥ 40 kg with inadequate response to or intolerance of conventional therapies"
      }
    ],
    pearls: [
      "Diagnostic threshold is ≥ 15 eosinophils/HPF on esophageal biopsy; always biopsy both proximal and distal esophagus (at least 6 biopsies total)",
      "Milk and wheat are the two most common trigger foods, accounting for the majority of EoE cases; a 2-food elimination diet is now the preferred initial approach",
      "EoE is a chronic disease; stopping treatment leads to relapse in most patients within 3-6 months",
      "Esophageal perforation risk during dilation is low (< 1%) when using the 'rule of three' (no more than 3 mm dilation per session)",
      "Dupilumab is the first biologic therapy for EoE and represents a paradigm shift for refractory cases"
    ],
    quiz: [
      {
        question: "A nurse is caring for a client recently diagnosed with eosinophilic esophagitis who is prescribed oral viscous budesonide. Which instruction is most important for the nurse to provide?",
        options: [
          "Take the medication with a full glass of water",
          "Swallow the viscous slurry and do not eat or drink for 30 minutes afterward",
          "Use a spacer device to ensure proper inhalation",
          "Take the medication with food to prevent stomach upset"
        ],
        correct: 1,
        rationale: "Oral viscous budesonide must be swallowed (not inhaled) and the patient should remain NPO for 30 minutes after to maximize esophageal mucosal contact time. Drinking water immediately would wash the medication away from the esophageal surface, reducing its therapeutic effect."
      }
    ]
  },

  "eosinophilic-esophagitis-np": {
    title: "Eosinophilic Esophagitis",
    cellular: {
      title: "Eosinophilic Esophagitis - Cytokine Pathways",
      content:
        "Eosinophilic esophagitis represents a paradigm of chronic Th2-polarized mucosal inflammation driven by a complex interplay between genetic susceptibility, epithelial barrier dysfunction, and antigen-specific immune activation. Genome-wide association studies (GWAS) have identified the EoE susceptibility locus on chromosome 5q22 encompassing the TSLP (thymic stromal lymphopoietin) gene, and the 2p23 locus harboring the CAPN14 (calpain-14) gene. TSLP, an epithelial-derived alarmin cytokine released in response to allergen exposure, activates dendritic cells to promote Th2 polarization. Calpain-14, an intracellular protease induced by IL-13 in esophageal epithelial cells, cleaves desmoglein-1 and disrupts epithelial barrier integrity, creating a positive feedback loop of barrier dysfunction → allergen penetration → Th2 amplification.\n\nThe molecular cascade begins when food or aeroallergens penetrate the disrupted epithelial barrier and are captured by CD11c+ dendritic cells in the esophageal lamina propria. These dendritic cells migrate to regional lymph nodes and present antigen to naïve CD4+ T cells in the context of TSLP-primed co-stimulation, driving Th2 differentiation. The resulting Th2 effector cells home to the esophageal mucosa via integrin α4β7 and CCR3-mediated chemotaxis. IL-4 from Th2 cells drives B cell class switching to IgE and IgG4 production, while IL-5 acts on eosinophil progenitors in the bone marrow, promoting eosinophilopoiesis, and on mature eosinophils to enhance survival by upregulating anti-apoptotic protein Bcl-2.\n\nIL-13 is the central effector cytokine in EoE pathogenesis, acting on esophageal epithelial cells through the IL-4Rα/IL-13Rα1 receptor complex to activate JAK1/TYK2-STAT6 signaling. STAT6 phosphorylation drives transcription of eotaxin-3 (CCL26), periostin, and CAPN14 while suppressing desmoglein-1, filaggrin, and involucrin expression. The net result is a defective epithelial barrier producing massive eosinophil chemoattraction. Eotaxin-3 is the single most upregulated gene in EoE esophageal tissue (53-fold increase over controls) and serves as a potential biomarker.\n\nTissue remodeling in EoE involves TGF-β1-mediated activation of subepithelial fibroblasts through Smad2/3 signaling, driving collagen deposition and lamina propria fibrosis. Concurrently, eosinophil-derived TGF-β1 stimulates smooth muscle cell hypertrophy and hyperplasia, contributing to esophageal wall thickening and decreased compliance (reduced distensibility). The EndoFLIP (endolumenal functional lumen imaging probe) system measures esophageal distensibility and has emerged as a functional biomarker that correlates with fibrostenotic disease severity and food impaction risk better than histology alone.\n\nBiologic therapies targeting the Th2 axis represent the frontier of EoE management. Dupilumab (anti-IL-4Rα) blocks both IL-4 and IL-13 signaling, achieving histological remission (< 6 eos/HPF) in 60% of patients in phase 3 trials. Emerging therapies include anti-IL-5 agents (mepolizumab, reslizumab) which reduce tissue eosinophilia but show inconsistent symptom improvement, anti-IL-13 (cendakimab/RPC4046) with promising phase 2/3 data, anti-TSLP (tezepelumab) targeting the upstream alarmin, and anti-Siglec-8 (lirentelimab) which induces eosinophil apoptosis. The dissociation between eosinophil count reduction and symptom improvement with anti-IL-5 therapy suggests that tissue remodeling and fibrosis, rather than active eosinophilic inflammation alone, may be the primary drivers of symptoms in established disease."
    },
    riskFactors: [
      "Genetic susceptibility: TSLP gene polymorphisms (5q22), CAPN14 variants (2p23), eotaxin-3 (CCL26) gene variants",
      "Epithelial barrier dysfunction: loss of desmoglein-1, filaggrin, involucrin expression",
      "Atopic comorbidities: 50-80% of EoE patients have concurrent asthma, eczema, rhinitis, or IgE-mediated food allergy",
      "Male sex (3:1 ratio; estrogen may be protective via downregulation of eotaxin-3)",
      "Environmental factors: early antibiotic exposure, acid suppression in infancy, cesarean delivery (microbiome disruption)",
      "Family history: sibling recurrence risk 40-80 fold higher than general population; 50% heritability in twin studies"
    ],
    diagnostics: [
      "Upper endoscopy with systematic biopsies: ≥ 15 eos/HPF from ≥ 2 esophageal levels (proximal and distal; minimum 6 biopsies); stomach and duodenum biopsied to exclude eosinophilic gastroenteritis",
      "EREFS scoring (Endoscopic Reference Score): standardized grading of Exudates, Rings, Edema, Furrows, and Strictures",
      "EndoFLIP (functional lumen imaging probe): measures esophageal distensibility (reduced distensibility plateau < 12 mm indicates fibrostenotic disease)",
      "Esophageal string test or Cytosponge: minimally invasive biomarker monitoring (eosinophil-derived proteins: MBP, EPO, eotaxin-3)",
      "Serum biomarkers under investigation: absolute eosinophil count (low sensitivity), eotaxin-3, periostin, ECP",
      "Allergy testing: skin prick testing (SPT) for IgE-mediated sensitization, atopy patch testing (limited clinical utility)",
      "Food-specific IgG4 panel (research tool; clinical utility not established)"
    ],
    management: [
      "Step-up dietary approach: 2-food elimination diet (milk + wheat) → 4-food → 6-food with endoscopic reassessment after each 6-8 week elimination period",
      "Swallowed topical corticosteroids: oral viscous budesonide (OVB) 1-2 mg BID or fluticasone MDI 440-880 mcg BID swallowed; induction for 8-12 weeks, then maintenance dosing",
      "PPI therapy: high-dose PPI (omeprazole 20-40 mg BID) as first-line or adjunctive; PPI-responsive EoE is now part of the EoE spectrum",
      "Dupilumab 300 mg SC weekly: FDA-approved for EoE in patients ≥ 12 years and ≥ 40 kg with inadequate response to conventional therapy; 60% histological remission rate",
      "Endoscopic dilation for fixed strictures: through-the-scope balloon or Savary dilators; follow 'rule of three' (≤ 3 mm increment per session); repeat as needed",
      "Emerging biologics: cendakimab (anti-IL-13), tezepelumab (anti-TSLP), lirentelimab (anti-Siglec-8) in clinical trials",
      "Maintenance therapy required lifelong: relapse occurs in > 80% of patients within 3-6 months of treatment discontinuation",
      "Monitoring: repeat endoscopy with biopsies 8-12 weeks after therapy initiation and with each dietary modification; consider EndoFLIP for functional assessment"
    ],
    nursingActions: [
      "Coordinate multidisciplinary care: gastroenterology, allergy/immunology, dietitian, and psychosocial support",
      "Educate on biologic therapy administration: dupilumab self-injection technique, injection site rotation, cold chain storage",
      "Monitor for biologic therapy adverse effects: injection site reactions, conjunctivitis (dupilumab-specific), eosinophilia",
      "Assess esophageal symptom burden using validated tools (Dysphagia Symptom Questionnaire - DSQ, EoE Activity Index - EEsAI)",
      "Coordinate sequential dietary elimination and reintroduction protocols with endoscopy scheduling",
      "Educate on emergency food impaction management: do not attempt to force-swallow; present to ED for endoscopic removal",
      "Monitor for adrenal suppression in patients on chronic swallowed corticosteroids (morning cortisol screening)",
      "Support quality of life: EoE significantly impacts psychosocial functioning, especially in adolescents"
    ],
    signs: {
      left: [
        "Dysphagia to solids with compensatory eating behaviors",
        "Food impaction requiring emergency endoscopic removal",
        "Heartburn or chest pain refractory to standard GERD therapy",
        "Feeding difficulty, food refusal, and failure to thrive in young children"
      ],
      right: [
        "Endoscopic: rings (fibrostenotic), furrows (inflammatory), exudates (eosinophilic microabscesses)",
        "Reduced esophageal distensibility on EndoFLIP (< 12 mm distensibility plateau)",
        "Histology: ≥ 15 eos/HPF with eosinophil microabscesses, basal zone hyperplasia, spongiosis",
        "Tissue remodeling: subepithelial fibrosis, smooth muscle hypertrophy on deep biopsies"
      ]
    },
    medications: [
      {
        name: "Dupilumab (Dupixent)",
        type: "Monoclonal antibody (anti-IL-4 receptor alpha)",
        action: "Binds IL-4Rα subunit shared by IL-4 and IL-13 receptors, blocking JAK1/TYK2-STAT6 signaling cascade, reducing eotaxin-3 transcription, restoring desmoglein-1 expression, decreasing eosinophil recruitment, and inhibiting subepithelial fibrosis; achieves histological remission (< 6 eos/HPF) in 60% of patients",
        sideEffects: "Injection site reactions (10-15%), conjunctivitis (5-10%), nasopharyngitis, transient peripheral eosinophilia",
        contra: "Hypersensitivity to dupilumab; screen for helminth infections before initiation",
        pearl: "300 mg SC weekly is the approved EoE dose (higher frequency than atopic dermatitis dosing); onset of histological improvement seen by week 12; conjunctivitis is a class effect of IL-13 blockade"
      },
      {
        name: "Cendakimab (investigational)",
        type: "Monoclonal antibody (anti-IL-13)",
        action: "Selectively neutralizes IL-13 without blocking IL-4 signaling, specifically targeting the downstream effector cytokine responsible for eotaxin-3 induction, epithelial barrier disruption, and fibroblast activation in EoE",
        sideEffects: "Injection site reactions, upper respiratory infections (phase 3 trial data)",
        contra: "Investigational; not yet approved",
        pearl: "Phase 3 trials show histological remission rates comparable to dupilumab; selective IL-13 blockade may reduce conjunctivitis risk seen with dual IL-4/IL-13 inhibition"
      }
    ],
    pearls: [
      "Eotaxin-3 (CCL26) is the most upregulated gene in EoE tissue (53-fold increase); it is the critical eosinophil chemoattractant driven by IL-13-STAT6 signaling",
      "EndoFLIP distensibility measurement better predicts food impaction risk than eosinophil count or endoscopic appearance alone",
      "Anti-IL-5 therapies reduce eosinophil counts but show inconsistent symptom improvement, suggesting fibrotic remodeling is the primary symptom driver in established disease",
      "The CAPN14-desmoglein-1 axis creates a positive feedback loop: IL-13 → calpain-14 activation → desmoglein-1 cleavage → barrier dysfunction → allergen penetration → more IL-13",
      "Maintenance therapy is essential; EoE is a chronic disease with > 80% relapse rate within months of discontinuing treatment"
    ],
    quiz: [
      {
        question: "A nurse practitioner is evaluating treatment options for a 16-year-old with eosinophilic esophagitis refractory to swallowed budesonide and dietary elimination. The most recent biopsy shows 45 eos/HPF with significant subepithelial fibrosis. Which biologic therapy is FDA-approved for this indication?",
        options: [
          "Mepolizumab (anti-IL-5)",
          "Omalizumab (anti-IgE)",
          "Dupilumab (anti-IL-4Rα)",
          "Benralizumab (anti-IL-5Rα)"
        ],
        correct: 2,
        rationale: "Dupilumab (anti-IL-4Rα) is the first and currently only FDA-approved biologic for eosinophilic esophagitis in patients ≥ 12 years and ≥ 40 kg. By blocking the shared IL-4Rα subunit, it inhibits both IL-4 and IL-13 signaling, addressing the central Th2 cytokine axis in EoE pathogenesis. Anti-IL-5 agents reduce eosinophil counts but have not shown consistent symptom improvement in EoE trials."
      }
    ]
  },

  "meckel-diverticulum-rpn": {
    title: "Meckel's Diverticulum",
    cellular: {
      title: "Meckel's Diverticulum - Recognizing Painless",
      content:
        "Meckel's diverticulum is the most common congenital anomaly of the gastrointestinal tract, affecting approximately 2% of the population. It is a small pouch (outpouching) of the intestinal wall located in the ileum (the last part of the small intestine), usually within about 2 feet (60 cm) of the ileocecal valve. This pouch is a remnant of the omphalomesenteric (vitelline) duct, which normally connects the developing intestine to the yolk sac during fetal development and usually disappears completely by the seventh week of gestation.\n\nThe classic teaching for Meckel's diverticulum is the 'Rule of 2s': it occurs in 2% of the population, is about 2 inches long, is located within 2 feet of the ileocecal valve, is usually found before age 2, and may contain 2 types of ectopic (misplaced) tissue  -  gastric and pancreatic. When the diverticulum contains gastric tissue, it produces hydrochloric acid, which can erode the adjacent normal intestinal lining and cause painless rectal bleeding. This bleeding is the most common presentation in children and typically appears as brick-red or maroon-colored (currant jelly) stools."
    },
    riskFactors: [
      "Congenital anomaly present from birth (failure of vitelline duct regression)",
      "Male sex (symptomatic cases are 2-3 times more common in males)",
      "Age under 2 years (most common age for symptomatic presentation)",
      "Presence of ectopic gastric tissue within the diverticulum (increases bleeding risk)"
    ],
    diagnostics: [
      "Meckel's scan (technetium-99m pertechnetate scintigraphy): the radiotracer is taken up by ectopic gastric mucosa within the diverticulum, appearing as an abnormal focus of uptake in the right lower quadrant",
      "Monitor hemoglobin and hematocrit for significant drops from rectal bleeding",
      "Assess stool color and consistency: painless brick-red or maroon (currant jelly) stools are the hallmark presentation in children",
      "Abdominal X-ray or CT scan if intestinal obstruction is suspected (volvulus, intussusception secondary to the diverticulum)",
      "Monitor vital signs for signs of hypovolemic shock from significant bleeding: tachycardia, hypotension, poor capillary refill, decreased urine output",
      "Type and crossmatch blood in case transfusion is needed for significant hemorrhage",
    ],
    management: [
      "Surgical resection (removal of the diverticulum) for symptomatic cases",
      "IV fluid resuscitation for significant bleeding",
      "Blood transfusion if hemoglobin drops significantly from bleeding",
      "Monitor for signs of intestinal obstruction if the diverticulum causes a volvulus or intussusception",
      "Post-surgical routine wound care and pain management"
    ],
    nursingActions: [
      "Monitor and report painless rectal bleeding (brick-red or maroon stools) in a child",
      "Monitor vital signs for signs of hypovolemia: tachycardia, hypotension, poor capillary refill",
      "Maintain accurate intake and output, including stool output",
      "Report any abdominal distension, vomiting, or signs of intestinal obstruction",
      "Prepare client for Meckel's scan (technetium-99m pertechnetate scan) as ordered",
      "Post-surgical: monitor surgical site, resume diet as ordered, assess bowel function"
    ],
    signs: {
      left: [
        "Painless rectal bleeding (most common presentation in children)",
        "Brick-red or maroon-colored (currant jelly) stools",
        "Signs of anemia from chronic or acute blood loss: pallor, tachycardia, fatigue",
        "No abdominal pain with bleeding episodes (painless)"
      ],
      right: [
        "Abdominal pain and distension (if obstruction or volvulus occurs)",
        "Nausea and vomiting (if intestinal obstruction develops)",
        "Signs of peritonitis (if diverticulitis or perforation occurs): rigid abdomen, fever, guarding",
        "Melena or hematochezia depending on bleeding rate"
      ]
    },
    medications: [
      {
        name: "Normal Saline or Lactated Ringer's",
        type: "IV crystalloid fluid",
        action: "Volume replacement to maintain circulatory volume and tissue perfusion during acute bleeding episodes",
        sideEffects: "Fluid overload if administered too rapidly in pediatric patients",
        contra: "Heart failure (use with caution); monitor for signs of fluid overload",
        pearl: "Use weight-based boluses (20 mL/kg) for pediatric fluid resuscitation; reassess after each bolus"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Non-opioid analgesic / Antipyretic",
        action: "Provides post-surgical pain relief by inhibiting central prostaglandin synthesis",
        sideEffects: "Hepatotoxicity with overdose",
        contra: "Severe liver disease; do not exceed maximum daily dose (based on weight in children)",
        pearl: "First-line post-surgical analgesic in pediatric patients; use weight-based dosing (10-15 mg/kg every 4-6 hours)"
      }
    ],
    pearls: [
      "The 'Rule of 2s' helps remember key features of Meckel's diverticulum: 2% of population, 2 inches long, 2 feet from ileocecal valve, presents before age 2, 2 types of ectopic tissue",
      "Painless rectal bleeding in a child under 2 should raise suspicion for Meckel's diverticulum",
      "The Meckel's scan (technetium-99m) detects ectopic gastric tissue in the diverticulum, which is the cause of bleeding",
      "Most Meckel's diverticula are asymptomatic and found incidentally; only symptomatic cases require surgery"
    ],
    quiz: [
      {
        question: "A 20-month-old child presents with painless, brick-red rectal bleeding. The child appears pale but is otherwise comfortable with a non-tender abdomen. Which condition should the nurse suspect?",
        options: [
          "Intussusception",
          "Meckel's diverticulum",
          "Pyloric stenosis",
          "Hirschsprung disease"
        ],
        correct: 1,
        rationale: "Painless rectal bleeding with brick-red stools in a child under 2 is the classic presentation of a symptomatic Meckel's diverticulum with ectopic gastric tissue. Intussusception also causes rectal bleeding but is typically accompanied by colicky abdominal pain and a 'sausage-shaped' mass. The painless nature of the bleeding is the key differentiating feature."
      }
    ]
  },

  "meckel-diverticulum": {
    title: "Meckel's Diverticulum",
    cellular: {
      title: "Meckel's Diverticulum - Vitelline Duct",
      content:
        "Meckel's diverticulum is a true diverticulum (containing all layers of the intestinal wall: mucosa, submucosa, muscularis propria, and serosa) arising from incomplete obliteration of the omphalomesenteric (vitelline) duct. During embryonic development, the vitelline duct connects the midgut lumen to the yolk sac, providing nutrition to the developing embryo. By the seventh week of gestation, this duct normally undergoes complete involution. Persistence of the intestinal end of the vitelline duct results in Meckel's diverticulum, which protrudes from the antimesenteric border of the ileum.\n\nAt the cellular level, the diverticulum contains normal ileal mucosa in its base but may harbor heterotopic (ectopic) tissue in approximately 50% of symptomatic cases. Ectopic gastric mucosa is present in approximately 60% of symptomatic cases and contains functional parietal cells that secrete hydrochloric acid and chief cells that produce pepsinogen. This acid secretion directly erodes the adjacent normal ileal mucosa, causing peptic ulceration at the junction between the ectopic gastric tissue and the native ileal epithelium. The ulcerated mucosa bleeds, producing the characteristic painless lower GI hemorrhage. The ileal mucosa lacks the protective mechanisms of native gastric mucosa (bicarbonate secretion, mucus layer, rapid epithelial turnover), making it highly vulnerable to acid injury.\n\nEctopic pancreatic tissue is found in approximately 5-16% of symptomatic cases and can cause inflammation (diverticulitis) mimicking appendicitis. Complications beyond bleeding include intestinal obstruction (from intussusception with the diverticulum acting as a lead point, volvulus around a persistent fibrous band connecting the diverticulum to the umbilicus, or internal herniation), diverticulitis (clinically indistinguishable from appendicitis), and perforation with peritonitis.\n\nThe Meckel's scan (technetium-99m pertechnetate scintigraphy) exploits the fact that technetium-99m pertechnetate is taken up by gastric mucosa parietal cells. Pretreatment with an H2-receptor blocker (ranitidine) or a proton pump inhibitor 48 hours before the scan increases sensitivity by preventing acid secretion, which washes the radionuclide from the gastric mucosa and reduces detection. The sensitivity of the Meckel's scan is approximately 85-90% in children but only 60% in adults, partly because adults are less likely to have ectopic gastric tissue."
    },
    riskFactors: [
      "Congenital: failure of vitelline duct regression by week 7 of gestation",
      "Male sex: symptomatic presentations are 2-3 times more common in males",
      "Age under 2 years: peak age for hemorrhagic presentation",
      "Presence of ectopic gastric tissue (highest risk for bleeding)",
      "Persistent fibrous band to umbilicus (risk for volvulus and obstruction)"
    ],
    diagnostics: [
      "Technetium-99m pertechnetate scan (Meckel's scan): detects ectopic gastric tissue; sensitivity 85-90% in children",
      "Pretreatment with H2 blocker (cimetidine/ranitidine) or PPI before Meckel's scan improves sensitivity",
      "CBC: anemia (low hemoglobin/hematocrit) from acute or chronic GI bleeding",
      "CT scan with contrast: may show a blind-ending loop or inflammatory changes in the RLQ",
      "CT angiography or tagged RBC scan for active bleeding localization",
      "Capsule endoscopy or double-balloon enteroscopy: may visualize the diverticulum directly",
      "Surgical exploration: definitive diagnosis when imaging is inconclusive but clinical suspicion remains high"
    ],
    management: [
      "Surgical resection for all symptomatic Meckel's diverticula",
      "Simple diverticulectomy: for uncomplicated cases with a narrow neck and no adjacent ileal pathology",
      "Segmental ileal resection with primary anastomosis: for diverticula with broad bases, adjacent ulceration, or when ectopic tissue extends into adjacent ileum",
      "Laparoscopic approach preferred when feasible",
      "Aggressive IV fluid resuscitation and blood transfusion for acute hemorrhage",
      "Incidental Meckel's diverticulum: resection recommended in young males with palpable abnormalities or clinical risk factors; observation for asymptomatic cases in older adults"
    ],
    nursingActions: [
      "Monitor hemodynamic status during acute bleeding: heart rate, blood pressure, urine output, capillary refill",
      "Monitor and document stool characteristics: color, amount, frequency (use a stool chart)",
      "Maintain large-bore IV access and ensure type and crossmatch are current",
      "Prepare client for Meckel's scan: explain procedure, ensure pretreatment medications are administered as ordered",
      "Post-surgical: monitor for return of bowel function, assess surgical site, advance diet as tolerated",
      "Report signs of complications: obstruction (distension, vomiting, absent bowel sounds), peritonitis (rigid abdomen, fever)"
    ],
    signs: {
      left: [
        "Painless rectal bleeding: brick-red or maroon stools (hemorrhage from ectopic gastric tissue ulceration)",
        "Iron deficiency anemia from occult chronic bleeding",
        "Currant jelly stools (if intussusception occurs with Meckel's as lead point)",
        "Periumbilical pain progressing to RLQ (diverticulitis mimicking appendicitis)"
      ],
      right: [
        "Abdominal distension and bilious vomiting (intestinal obstruction from volvulus or intussusception)",
        "Right lower quadrant tenderness with guarding (Meckel's diverticulitis)",
        "Signs of peritonitis: rigid abdomen, rebound tenderness, fever (perforation)",
        "Hemodynamic instability: tachycardia, hypotension, poor perfusion (massive hemorrhage)"
      ]
    },
    medications: [
      {
        name: "Cimetidine or Ranitidine (pre-scan)",
        type: "H2-receptor antagonist",
        action: "Blocks histamine-2 receptors on parietal cells, inhibiting acid secretion; in the context of Meckel's scan, prevents acid-mediated washout of technetium-99m from ectopic gastric mucosa, increasing scan sensitivity",
        sideEffects: "Headache, dizziness, diarrhea; ranitidine withdrawn in some markets due to NDMA contamination",
        contra: "Known hypersensitivity",
        pearl: "Administered 48 hours before the Meckel's scan to enhance detection of ectopic gastric tissue; improves sensitivity from approximately 60% to 85-90%"
      },
      {
        name: "Pantoprazole (Protonix) IV",
        type: "Proton pump inhibitor",
        action: "Irreversibly inhibits the H+/K+ ATPase proton pump on parietal cells, suppressing gastric acid secretion; used adjunctively to reduce acid-mediated mucosal erosion from ectopic gastric tissue",
        sideEffects: "Headache, diarrhea, hypomagnesemia with prolonged use",
        contra: "Known hypersensitivity to benzimidazoles",
        pearl: "May be used as pre-scan preparation and to reduce ongoing acid-mediated ulceration while awaiting surgical intervention"
      }
    ],
    pearls: [
      "Meckel's diverticulum is a TRUE diverticulum (all intestinal wall layers) on the antimesenteric border, unlike colonic diverticula which are pseudodiverticula",
      "Painless rectal bleeding in a child under 2 = Meckel's diverticulum until proven otherwise",
      "The Meckel's scan detects ectopic GASTRIC tissue, not the diverticulum itself; a negative scan does not rule out Meckel's (diverticulum without gastric tissue will be missed)",
      "Meckel's diverticulitis is clinically indistinguishable from appendicitis; it is often diagnosed intraoperatively when a normal appendix is found",
      "The lifetime risk of complications from an asymptomatic Meckel's diverticulum is approximately 4-6%, decreasing with age"
    ],
    quiz: [
      {
        question: "A nurse is preparing a 3-year-old child for a technetium-99m pertechnetate (Meckel's) scan. Which medication should the nurse expect to administer before the scan to improve diagnostic accuracy?",
        options: [
          "Ondansetron (Zofran)",
          "Cimetidine (Tagamet)",
          "Metoclopramide (Reglan)",
          "Sucralfate (Carafate)"
        ],
        correct: 1,
        rationale: "H2-receptor antagonists such as cimetidine are administered before a Meckel's scan to block acid secretion by ectopic gastric parietal cells. This prevents the acid-mediated washout of technetium-99m pertechnetate from the gastric mucosa, increasing the scan's sensitivity for detecting ectopic gastric tissue. Without pretreatment, the scan may miss smaller foci of gastric tissue."
      }
    ]
  },

  "meckel-diverticulum-np": {
    title: "Meckel's Diverticulum",
    cellular: {
      title: "Meckel's Diverticulum - Embryologic",
      content:
        "Meckel's diverticulum represents the prototypical vitelline duct anomaly, arising from incomplete involution of the omphalomesenteric (vitelline) duct during the fifth to seventh week of embryonic development. The vitelline duct connects the primitive midgut to the yolk sac and provides nutritional support to the developing embryo before placental circulation is established. Normal embryogenesis requires complete regression of this duct by week 7, mediated by apoptotic signaling through the BMP (bone morphogenetic protein) and Wnt/β-catenin pathways that regulate mesenteric and ductal remodeling. Failure of apoptosis in the intestinal segment of the vitelline duct results in a persistent blind-ending pouch  -  Meckel's diverticulum.\n\nThe spectrum of vitelline duct anomalies includes: (1) Meckel's diverticulum (most common; persistence of the intestinal end), (2) vitelline duct cyst (persistence of the middle segment, forming an isolated cyst), (3) vitelline duct fistula (complete persistent patent duct from ileum to umbilicus, presenting with intestinal content drainage from the umbilicus), (4) fibrous band (a cord-like remnant connecting the diverticulum to the umbilicus, creating a potential axis for volvulus), and (5) umbilical sinus (persistence of the umbilical end only).\n\nThe heterotopic tissue within Meckel's diverticulum arises from aberrant differentiation of pluripotent endodermal stem cells during embryonic gut regionalization. The gastric heterotopia contains functionally active parietal cells expressing H+/K+ ATPase proton pumps that secrete hydrochloric acid, and chief cells producing pepsinogen. This ectopic acid production creates a hostile microenvironment at the junction between gastric-type and ileal-type mucosa, where the ileal epithelium lacks the protective mechanisms of native gastric mucosa  -  specifically, the surface mucus-bicarbonate barrier, prostaglandin-mediated cytoprotection, and the rapid epithelial turnover (every 3-5 days) that characterizes gastric mucosa. The result is peptic ulceration of the adjacent ileal mucosa with erosion into submucosal arterioles, producing hemorrhage.\n\nPancreatic heterotopia, found in 5-16% of symptomatic cases, contains exocrine acinar tissue and ductal elements. This tissue can produce pancreatic enzymes (lipase, amylase, trypsinogen) and undergo inflammatory changes mimicking diverticulitis. Rarely, pancreatic heterotopia can develop into pancreatic adenocarcinoma or neuroendocrine tumors. Carcinoid tumors (well-differentiated neuroendocrine tumors) are the most common neoplasm arising in Meckel's diverticulum, arising from enterochromaffin cells within the heterotopic or native mucosa. Gastrointestinal stromal tumors (GISTs) and adenocarcinomas have also been reported.\n\nSurgical decision-making for incidentally discovered Meckel's diverticulum remains controversial. A 2020 meta-analysis supports prophylactic resection in patients under 50 years with a diverticulum > 2 cm, palpable abnormality, or visible heterotopic tissue. The lifetime complication risk decreases with age: approximately 4.2% for ages 0-20, 2% for ages 20-40, and nearly zero after age 60. Laparoscopic resection has reduced morbidity of prophylactic surgery, shifting the risk-benefit calculation in favor of resection, especially when a fibrous band to the umbilicus is present (volvulus risk)."
    },
    riskFactors: [
      "Embryologic: failure of BMP/Wnt-mediated apoptotic regression of the vitelline duct by week 7 of gestation",
      "Heterotopic gastric tissue: present in 50-60% of symptomatic cases; contains functional parietal cells causing peptic ulceration",
      "Male sex: symptomatic presentations 2-3 times more frequent (possibly related to hormonal influences on acid secretion)",
      "Persistent fibrous band or mesodiverticular band: creates axis for volvulus and internal herniation",
      "Broad-based diverticulum (> 2 cm): higher complication rate than narrow-necked diverticula"
    ],
    diagnostics: [
      "Technetium-99m pertechnetate scintigraphy: specificity 95%, sensitivity 85-90% in children (lower in adults); improved with pentagastrin stimulation, cimetidine pretreatment, and glucagon (reduces peristalsis)",
      "CT enterography or CT angiography: identifies the diverticulum as a blind-ending loop on the antimesenteric border; useful for obstruction and active bleeding localization",
      "Capsule endoscopy: direct visualization of the diverticulum and heterotopic mucosa; useful in occult GI bleeding evaluation",
      "Double-balloon enteroscopy: allows both visualization and tissue biopsy; can confirm heterotopic tissue histologically",
      "Tagged RBC scan (technetium-99m-labeled red blood cells): localizes active bleeding source when Meckel's scan is negative",
      "Mesenteric angiography: identifies active arterial bleeding (requires bleeding rate > 0.5 mL/min)",
      "Intraoperative diagnosis: definitive when non-invasive workup is inconclusive; laparoscopic exploration of terminal ileum"
    ],
    management: [
      "Symptomatic Meckel's: mandatory surgical resection via diverticulectomy or segmental ileal resection with primary anastomosis",
      "Diverticulectomy with stapled transection: appropriate for narrow-based diverticula without adjacent ileal involvement",
      "Segmental ileal resection: required when the diverticulum has a broad base (> 2 cm), when ectopic tissue extends into adjacent ileum, or when adjacent ileal ulceration is present",
      "Laparoscopic approach: preferred for elective resection; shorter recovery, lower wound complications",
      "Incidental Meckel's: prophylactic resection recommended for patients < 50 years, male sex, diverticulum > 2 cm, palpable abnormality, or visible band/heterotopic tissue",
      "Acute hemorrhage management: IV fluid resuscitation, packed RBC transfusion (target hemoglobin > 7 g/dL), emergent surgical intervention for massive or refractory bleeding",
      "Post-operative: standard surgical follow-up; no long-term surveillance needed after complete resection"
    ],
    nursingActions: [
      "Coordinate pre-operative imaging studies and ensure appropriate scan preparation (cimetidine pretreatment for Meckel's scan)",
      "Manage acute GI hemorrhage: two large-bore IVs, fluid resuscitation, blood product administration, continuous hemodynamic monitoring",
      "Monitor for rare post-operative complications: anastomotic leak (tachycardia, fever, peritoneal signs), wound infection, adhesive small bowel obstruction",
      "Educate patient/family on the congenital nature of the condition and excellent prognosis after surgical resection",
      "For NP prescriptive practice: order pre-scan cimetidine protocol, manage post-operative pain (multimodal analgesia), advance diet progression"
    ],
    signs: {
      left: [
        "Painless massive lower GI hemorrhage: brick-red or maroon hematochezia (ectopic gastric tissue ulceration)",
        "Chronic iron deficiency anemia from occult bleeding",
        "RLQ pain mimicking appendicitis (Meckel's diverticulitis)",
        "Small bowel obstruction pattern: bilious vomiting, abdominal distension, absent flatus"
      ],
      right: [
        "Umbilical drainage of intestinal content (patent vitelline duct fistula)",
        "Volvulus with small bowel ischemia: severe colicky pain, hemodynamic instability",
        "Intussusception with Meckel's as lead point: intermittent colicky pain, currant jelly stools, palpable mass",
        "Peritoneal signs from perforation: rigid abdomen, guarding, rebound tenderness, fever"
      ]
    },
    medications: [
      {
        name: "Cimetidine (pre-scan protocol)",
        type: "H2-receptor antagonist",
        action: "Blocks H2 histamine receptors on ectopic gastric parietal cells, preventing HCl secretion; in diagnostic context, prevents acid-mediated washout of technetium-99m pertechnetate from ectopic gastric mucosa, improving Meckel's scan sensitivity from 60% to 85-90%",
        sideEffects: "Anti-androgenic effects (gynecomastia, decreased libido) with prolonged use, drug interactions via CYP450 inhibition",
        contra: "Known hypersensitivity; caution with hepatic impairment due to CYP450 interactions",
        pearl: "Administered 20 mg/kg/day divided BID for 2 days before the scan; alternative: famotidine (does not inhibit CYP450)"
      },
      {
        name: "Octreotide (Sandostatin)",
        type: "Somatostatin analogue",
        action: "Reduces splanchnic blood flow and inhibits GI hormone secretion; used as adjunctive therapy for refractory GI hemorrhage from Meckel's diverticulum to reduce bleeding rate before surgical intervention",
        sideEffects: "Bradycardia, hyperglycemia, gallstone formation, injection site pain",
        contra: "Hypersensitivity to octreotide",
        pearl: "Consider as a temporizing measure for massive hemorrhage from Meckel's diverticulum in patients who are hemodynamically unstable and awaiting emergent surgery"
      }
    ],
    pearls: [
      "Meckel's diverticulum is a TRUE diverticulum (all wall layers) because it arises from the embryonic vitelline duct, unlike acquired pseudodiverticula that herniate through muscular defects",
      "The 'Rule of 2s' is a mnemonic, not a clinical rule: approximately 50% of symptomatic cases present after age 2, and ectopic gastric tissue prevalence varies by study",
      "A negative Meckel's scan does NOT rule out Meckel's diverticulum; it only rules out ectopic gastric tissue; diverticula containing only pancreatic tissue or normal ileal mucosa will be missed",
      "Carcinoid tumors in Meckel's diverticulum are typically benign (< 2 cm) with low metastatic potential; however, resection specimens should always undergo histopathological examination",
      "The incidental Meckel's resection debate has shifted toward resection in young patients since laparoscopic surgery has reduced operative morbidity significantly"
    ],
    quiz: [
      {
        question: "A nurse practitioner is evaluating a 28-year-old male with recurrent episodes of painless lower GI bleeding. A Meckel's scan is negative. Which of the following is the most appropriate next step?",
        options: [
          "Reassure the patient that Meckel's diverticulum has been ruled out",
          "Order a tagged RBC scan or CT angiography to localize the bleeding source",
          "Repeat the Meckel's scan without cimetidine pretreatment",
          "Prescribe iron supplementation and discharge with outpatient follow-up"
        ],
        correct: 1,
        rationale: "A negative Meckel's scan only indicates the absence of detectable ectopic gastric tissue; it does not rule out Meckel's diverticulum as a cause of bleeding. The diverticulum may contain pancreatic heterotopia or have bleeding from a non-gastric mechanism. Additional imaging with tagged RBC scan, CT angiography, or mesenteric angiography should be pursued to localize the active bleeding source. If suspicion remains high, laparoscopic exploration may be warranted."
      }
    ]
  },
  "ulcerative-colitis-rpn": {
    title: "Ulcerative Colitis",
    cellular: { title: "Chronic Colonic Inflammation Basics", content: "Ulcerative colitis (UC) is a chronic inflammatory bowel disease that affects ONLY the colon and rectum. The inflammation is continuous (no skip lesions) and starts at the rectum, extending proximally in a continuous pattern. Unlike Crohn's disease, UC involves only the mucosa and submucosa (superficial layers) of the bowel wall. The hallmark symptom is bloody diarrhea with mucus, often 10-20 or more stools per day during flares. Patients experience urgency, tenesmus (painful straining), and cramping abdominal pain typically in the left lower quadrant. Serious complications include toxic megacolon (acute colonic dilation with systemic toxicity), perforation, and significantly increased risk of colorectal cancer after 8-10 years of disease. UC follows a relapsing-remitting pattern with periods of flare and remission. Unlike Crohn's disease, UC is curable with total colectomy (surgical removal of the entire colon)." },
    riskFactors: ["Family history of inflammatory bowel disease", "Age 15-30 years (peak onset period)", "Ashkenazi Jewish descent", "Smoking cessation (paradoxically increases risk - smoking is protective in UC)", "NSAID use can trigger flares", "Stress and emotional distress worsen symptoms"],
    diagnostics: ["Monitor stool frequency, consistency, and presence of blood and mucus", "Assess abdomen for distension, tenderness, and bowel sounds", "Monitor weight trends and nutritional status", "Assess for signs of dehydration (dry mucous membranes, poor turgor, decreased urine)", "Report signs of toxic megacolon: severe distension, fever above 38.6C, tachycardia"],
    management: ["Administer prescribed 5-ASA medications (mesalamine) as ordered", "Provide low-residue diet during active flares to reduce bowel stimulation", "Maintain fluid and electrolyte balance with IV fluids as ordered", "Monitor intake and output accurately", "Report increasing stool frequency, worsening bloody diarrhea, or abdominal distension"],
    nursingActions: ["Monitor stool frequency and character every shift - document blood and mucus", "Assess for dehydration: vital signs, mucous membranes, skin turgor, urine output", "Administer medications on schedule and monitor for side effects", "Provide meticulous perianal skin care to prevent breakdown from frequent stools", "Weigh patient daily to track nutritional status", "Report signs of toxic megacolon immediately (distension, fever, tachycardia, absent bowel sounds)"],
    signs: {
      left: ["Bloody Diarrhea with Mucus (10-20x/day)", "Urgency and Tenesmus", "Left Lower Quadrant Cramping", "Weight Loss and Fatigue"],
      right: ["Toxic Megacolon: Severe Distension, Fever, Tachycardia", "Extraintestinal: Joint Pain, Eye Inflammation", "Erythema Nodosum (painful red nodules on shins)", "Anemia from Chronic Blood Loss"]
    },
    medications: [
      { name: "Mesalamine (5-ASA)", type: "Aminosalicylate", action: "Topical anti-inflammatory for colonic mucosa - reduces prostaglandin and leukotriene production", sideEffects: "Headache, nausea, abdominal pain", contra: "Salicylate allergy", pearl: "First-line for mild-moderate UC. Available as oral tablets, enemas, or suppositories for targeted delivery to affected colon. Enemas reach left colon; suppositories target rectum." },
      { name: "Prednisone", type: "Corticosteroid", action: "Potent anti-inflammatory that suppresses immune response during acute flares", sideEffects: "Hyperglycemia, mood changes, weight gain, osteoporosis, infection risk", contra: "Active untreated infection, uncontrolled diabetes", pearl: "Used for acute flares ONLY - not for maintenance. Taper gradually to avoid adrenal crisis. Monitor blood glucose closely during steroid therapy." }
    ],
    pearls: ["Low-fiber diet during active flares, gradually increase fiber during remission", "Total colectomy CURES UC (unlike Crohn's disease which has no surgical cure)", "AVOID opioids and anticholinergics during flares - they decrease bowel motility and increase toxic megacolon risk", "Colonoscopy surveillance for colorectal cancer begins 8 years after diagnosis", "UC vs Crohn's: UC is continuous, mucosal, colon only; Crohn's is skip lesions, transmural, anywhere mouth to anus"],
    quiz: [{ question: "A patient with ulcerative colitis develops sudden severe abdominal distension, fever of 39.2C, and tachycardia. What complication should the nurse suspect and what is the priority action?", options: ["Constipation - administer enema as ordered", "Toxic megacolon - notify provider immediately and prepare for emergency intervention", "Normal UC flare - increase mesalamine dose", "Appendicitis - assess McBurney's point"], correct: 1, rationale: "Severe abdominal distension with fever and tachycardia in a UC patient strongly suggests toxic megacolon - a life-threatening emergency. The colon dilates massively and can perforate. The nurse must notify the provider immediately. Treatment includes NPO, NG tube, IV steroids, and possible emergency colectomy. AVOID opioids and anticholinergics." }]
  },
  "ulcerative-colitis-np": {
    title: "Ulcerative Colitis",
    cellular: { title: "Molecular Immunopathology of Ulcerative", content: "Ulcerative colitis is driven by a dysregulated mucosal immune response to commensal gut flora in genetically susceptible individuals. The epithelial barrier dysfunction involves defective tight junction proteins (claudins, occludins) and reduced mucin production by goblet cells, allowing bacterial translocation across the mucosa. This triggers innate immune activation via toll-like receptors (TLR4 recognizing LPS) on dendritic cells and macrophages. The adaptive immune response is Th2-skewed with IL-5 and IL-13 driving mucosal inflammation, NKT cells producing IL-13 that directly damages epithelial cells, and elevated mucosal antibodies (pANCA positive in 65-70% of UC patients). The inflammatory cascade involves TNF-alpha, IL-1beta, and IL-6 activating NF-kB signaling in colonocytes, upregulating adhesion molecules (ICAM-1, VCAM-1) that recruit neutrophils from the vasculature. Neutrophil infiltration into the crypts forms the pathognomonic crypt abscess on histology. Chronic inflammation leads to architectural distortion with crypt branching, goblet cell depletion, and Paneth cell metaplasia. The colorectal cancer pathway involves inflammation-driven dysplasia through p53 mutations, microsatellite instability, and chromosomal instability occurring in a field effect across the inflamed mucosa. JAK-STAT signaling pathway dysregulation has emerged as a therapeutic target (tofacitinib). Sphingosine-1-phosphate receptor modulation (ozanimod) reduces lymphocyte egress from lymph nodes, decreasing mucosal T-cell infiltration." },
    riskFactors: ["HLA-DRB1*0103 and other MHC class II associations", "IL-23R, IL-10, and CARD9 gene polymorphisms", "Altered gut microbiome diversity (reduced Firmicutes)", "NSAID and antibiotic use disrupting microbiome", "Appendectomy (protective - 70% risk reduction)", "Vitamin D deficiency associated with flare frequency", "Primary sclerosing cholangitis (PSC) coexistence in 5%", "CMV superinfection triggering steroid-refractory flares"],
    diagnostics: ["Colonoscopy with biopsies: continuous mucosal inflammation, crypt abscesses, architectural distortion", "Fecal calprotectin for disease activity monitoring (correlates with endoscopic activity)", "CRP and ESR for systemic inflammation assessment", "CBC: anemia of chronic disease, thrombocytosis as inflammatory marker", "pANCA positive (65-70% UC vs 10-15% Crohn's) - aids differential diagnosis", "Stool studies: C. diff toxin, CMV PCR (rule out superinfection in steroid-refractory disease)", "CT abdomen if toxic megacolon suspected (colonic diameter >6cm)", "Chromoendoscopy for dysplasia surveillance after 8 years of disease"],
    management: ["Prescribe mesalamine (oral + topical combination) for mild-moderate disease induction and maintenance", "Initiate corticosteroids (prednisone 40-60mg/day with taper) for moderate-severe flares", "Prescribe thiopurines (azathioprine 2-2.5 mg/kg/day) for steroid-dependent disease maintenance", "Initiate anti-TNF therapy (infliximab, adalimumab) for moderate-severe disease refractory to conventional therapy", "Consider vedolizumab (anti-integrin - gut-selective) for TNF-failure patients", "Prescribe tofacitinib (JAK inhibitor) for moderate-severe UC with anti-TNF failure", "Consider ozanimod (S1P receptor modulator) for moderate-severe UC", "Order CMV colitis workup for steroid-refractory disease (CMV PCR, immunohistochemistry)", "Refer for colectomy consultation in medically refractory disease or high-grade dysplasia"],
    nursingActions: ["Monitor fecal calprotectin trends to assess treatment response and predict relapse", "Check TPMT/NUDT15 genotype before initiating thiopurines (dose-adjust or avoid for poor metabolizers)", "Screen for latent TB (QuantiFERON) and hepatitis B before biologic therapy", "Monitor CBC and LFTs every 3 months on thiopurine therapy", "Assess for opportunistic infections on immunosuppressive therapy", "Coordinate cancer surveillance colonoscopy scheduling per guidelines", "Evaluate bone density for patients with cumulative steroid exposure", "Screen for venous thromboembolism risk (UC patients have 2-3x increased VTE risk)"],
    signs: {
      left: ["Crypt Abscesses on Histology (pathognomonic)", "Continuous Mucosal Inflammation from Rectum Proximally", "pANCA Positivity (65-70%)", "Goblet Cell Depletion and Architectural Distortion"],
      right: ["Toxic Megacolon: >6cm Colonic Dilation with SIRS", "PSC Association (5%) - Alkaline Phosphatase Elevation", "Dysplasia-Carcinoma Sequence (field effect)", "CMV Superinfection in Steroid-Refractory Disease"]
    },
    medications: [
      { name: "Infliximab (Remicade)", type: "Anti-TNF-alpha Monoclonal Antibody", action: "Chimeric IgG1 antibody that binds soluble and membrane-bound TNF-alpha, inducing complement-dependent cytotoxicity and antibody-dependent cellular cytotoxicity of TNF-expressing inflammatory cells. Also induces T-cell apoptosis and promotes regulatory macrophage differentiation.", sideEffects: "Infusion reactions, TB reactivation, hepatosplenic T-cell lymphoma (rare, especially with thiopurine combination), demyelinating disease, heart failure exacerbation", contra: "Active severe infection, moderate-severe heart failure (NYHA III-IV), demyelinating disease, prior hepatosplenic T-cell lymphoma", pearl: "NP prescribing: Induction 5mg/kg at weeks 0, 2, 6 then q8 weeks maintenance. Therapeutic drug monitoring (TDL >5 mcg/mL) optimizes outcomes. Anti-drug antibodies predict loss of response - add thiopurine to reduce immunogenicity. Screen for TB and Hep B before starting." },
      { name: "Tofacitinib (Xeljanz)", type: "JAK Inhibitor (JAK1/JAK3)", action: "Small molecule that inhibits Janus kinases 1 and 3, blocking intracellular signaling downstream of multiple cytokine receptors (IL-2, IL-4, IL-6, IL-7, IL-9, IL-15, IL-21). Reduces T-cell activation, proliferation, and inflammatory cytokine production.", sideEffects: "Herpes zoster reactivation (5-10x increased risk), VTE risk, hyperlipidemia, lymphopenia, hepatotoxicity", contra: "Active serious infection, lymphocyte count <500, ANC <1000, Hgb <9", pearl: "Induction: 10mg BID x 8 weeks, then 5mg BID maintenance. Oral small molecule (no infusions needed). FDA black box warning for increased cardiovascular events and malignancy risk vs TNF inhibitors in RA (not confirmed in UC studies). Check fasting lipids at 4-8 weeks. Shingrix vaccine recommended before starting." },
      { name: "Vedolizumab (Entyvio)", type: "Anti-Integrin (alpha4beta7) Monoclonal Antibody", action: "Humanized antibody that selectively blocks alpha4beta7 integrin interaction with MAdCAM-1 on gut endothelium, preventing gut-selective lymphocyte trafficking. Does not affect systemic immunity.", sideEffects: "Nasopharyngitis, headache, arthralgia, infusion reactions (rare)", contra: "Active serious GI infection (PML risk theoretical but not confirmed)", pearl: "Gut-selective mechanism provides favorable safety profile compared to systemic immunosuppressants. Slower onset (12-16 weeks) but good long-term efficacy and safety. Preferred for elderly patients or those with infection history. No increased malignancy or serious infection signal." }
    ],
    pearls: ["Fecal calprotectin <150 mcg/g correlates with mucosal healing - use as non-invasive monitoring tool between colonoscopies", "CMV superinfection occurs in 20-30% of steroid-refractory UC - always test before escalating immunosuppression", "TPMT/NUDT15 genotyping is mandatory before thiopurine initiation - homozygous poor metabolizers (1 in 300) develop life-threatening myelosuppression", "Dysplasia surveillance: chromoendoscopy with targeted biopsies has replaced random 4-quadrant biopsies per updated guidelines", "UC patients have 2-3x increased VTE risk during flares - consider thromboprophylaxis for hospitalized patients"],
    quiz: [
      { question: "An NP manages a UC patient on infliximab who develops steroid-refractory symptoms. Stool C. diff is negative. What additional workup is essential before escalating immunosuppression?", options: ["Repeat colonoscopy with random biopsies only", "CMV PCR and colonoscopy with CMV immunohistochemistry on biopsies", "Increase infliximab dose without additional testing", "Switch to oral corticosteroids and reassess in 2 weeks"], correct: 1, rationale: "CMV superinfection occurs in 20-30% of steroid-refractory UC cases and requires antiviral therapy (ganciclovir), not escalation of immunosuppression. CMV colitis is diagnosed by tissue PCR and immunohistochemistry on colonoscopic biopsies showing cytomegalic inclusion bodies. Treating CMV while maintaining or reducing immunosuppression is the correct approach." },
      { question: "Which pharmacogenomic test is mandatory before prescribing azathioprine for UC maintenance therapy?", options: ["HLA-B5701 genotyping", "TPMT and NUDT15 genotyping", "CYP2D6 phenotyping", "IL-28B genotyping"], correct: 1, rationale: "TPMT (thiopurine methyltransferase) and NUDT15 genotyping identifies patients at risk for severe myelosuppression from thiopurines. Homozygous poor metabolizers (1 in 300 for TPMT) develop life-threatening pancytopenia at standard doses. Heterozygous carriers require dose reduction. This is a standard-of-care pharmacogenomic test before thiopurine initiation." }
    ]
  },
  "sucralfate-rpn": {
    title: "Sucralfate",
    cellular: { title: "Mucosal Protectant Basics", content: "Sucralfate is a gastrointestinal mucosal protectant used to treat and prevent gastric and duodenal ulcers. It is an aluminum hydroxide salt of sucrose octasulfate that works by forming a protective barrier over ulcerated tissue. In the acidic environment of the stomach (pH below 4), sucralfate undergoes cross-linking and polymerization, creating a viscous paste that adheres selectively to ulcer craters and damaged mucosa. This physical barrier protects the underlying tissue from gastric acid, pepsin, and bile salts, allowing the ulcer to heal. Sucralfate also stimulates prostaglandin production and bicarbonate secretion by the gastric mucosa, and binds epidermal growth factor to concentrate it at the ulcer site, promoting mucosal repair. Because it works locally rather than systemically, it has very few systemic side effects. The main concern is aluminum absorption, particularly in patients with renal impairment, and significant drug interactions because it can bind to and reduce absorption of many other medications." },
    riskFactors: ["Active duodenal ulcer requiring mucosal protection", "Stress ulcer prophylaxis in critically ill patients", "NSAID-induced gastric irritation", "Renal impairment (aluminum accumulation risk)", "Multiple medication use (drug interaction potential)", "Difficulty swallowing large tablets"],
    diagnostics: ["Assess for epigastric pain, heartburn, or GI discomfort", "Monitor stool color and consistency for melena (tarry stools)", "Assess swallowing ability before administration", "Monitor other medication effectiveness (sucralfate may reduce absorption)", "Monitor renal function in patients with kidney disease"],
    management: ["Administer on an empty stomach 1 hour before meals and at bedtime", "Give at least 2 hours apart from other medications", "Monitor for constipation (most common side effect)", "Report any signs of GI bleeding (melena, hematemesis)", "Do not crush tablets - give as whole tablet or suspension form"],
    nursingActions: ["Administer 1 hour before meals and at bedtime for maximum effectiveness", "Separate from ALL other medications by at least 2 hours", "Monitor bowel patterns for constipation", "Assess for therapeutic response (decreased epigastric pain)", "Check renal function labs in patients with kidney disease", "Report signs of aluminum toxicity in renal patients (confusion, muscle weakness)"],
    signs: {
      left: ["Epigastric Pain Relief (therapeutic effect)", "Decreased Heartburn and GI Discomfort", "Ulcer Healing on Follow-up Endoscopy", "Constipation (most common side effect)"],
      right: ["Drug Interactions - Reduced Absorption of Other Meds", "Aluminum Accumulation in Renal Failure", "Bezoar Formation (rare, especially with enteral feeds)", "Dry Mouth"]
    },
    medications: [
      { name: "Sucralfate (Carafate)", type: "Mucosal Protectant / Cytoprotective Agent", action: "Forms protective barrier over ulcerated mucosa in acidic environment - prevents acid, pepsin, and bile contact with damaged tissue", sideEffects: "Constipation (most common), dry mouth, nausea, aluminum accumulation in renal failure", contra: "Use cautiously in renal impairment (aluminum content), dysphagia or GI obstruction risk", pearl: "Must be given on EMPTY STOMACH - 1 hour before meals and at bedtime. Separate from other medications by 2 hours. Does NOT reduce acid production - it physically protects the ulcer. Interacts with fluoroquinolones, phenytoin, digoxin, warfarin, levothyroxine." },
      { name: "Omeprazole (Prilosec)", type: "Proton Pump Inhibitor", action: "Irreversibly blocks H+/K+ ATPase pump to reduce gastric acid secretion by 90%", sideEffects: "Headache, C. diff risk, hypomagnesemia, B12 deficiency (long-term)", contra: "Known hypersensitivity", pearl: "Often used alongside or as alternative to sucralfate for ulcer treatment. PPIs reduce acid production; sucralfate protects the ulcer physically. If using both, give PPI 30 minutes before meals and sucralfate 1 hour before meals - separate by at least 30 minutes." }
    ],
    pearls: ["Sucralfate works LOCALLY - it does not reduce acid production like PPIs or H2 blockers", "The #1 nursing consideration: give on EMPTY stomach, 1 hour before meals, separate from other meds by 2 hours", "Constipation is the most common side effect - encourage fluids and fiber intake", "Monitor renal patients for aluminum toxicity: confusion, muscle weakness, bone pain", "Do not give with enteral tube feeds - can cause bezoar formation. Flush tube well before and after administration"],
    quiz: [{ question: "A nurse is preparing to administer sucralfate to a patient who also takes levothyroxine at 0700 and digoxin at 0900. When should sucralfate be given?", options: ["At 0700 with levothyroxine", "At 0800, between the other medications", "At 1100 or later, at least 2 hours after the last medication", "At any time - sucralfate does not interact with other drugs"], correct: 2, rationale: "Sucralfate must be separated from ALL other medications by at least 2 hours because it can bind to and reduce absorption of many drugs including levothyroxine, digoxin, fluoroquinolones, and warfarin. Giving it at 1100 or later ensures a 2-hour separation from digoxin at 0900." }]
  },
  "sucralfate": {
    title: "Sucralfate",
    cellular: { title: "Cytoprotective Mechanism of Action", content: "Sucralfate (aluminum hydroxide salt of sucrose octasulfate) undergoes acid-catalyzed polymerization at pH below 4, forming a viscous adhesive gel that selectively binds to positively charged proteins in ulcer craters through electrostatic interaction. The sulfate groups of sucralfate carry strong negative charges that create ionic bonds with exposed positively charged tissue proteins (fibrinogen, albumin) at the ulcer base, creating a physical barrier lasting 6-8 hours. Beyond physical protection, sucralfate exerts cytoprotective effects through multiple mechanisms: stimulation of prostaglandin E2 synthesis (enhances mucosal blood flow and bicarbonate secretion), binding and concentration of epidermal growth factor (EGF) and fibroblast growth factor (FGF) at the ulcer site (accelerating epithelial cell migration and proliferation), and inhibition of pepsin activity by 32% and bile acid binding by 20-30%. Sucralfate also adsorbs bile salts in the gastric lumen, reducing their mucosal toxicity. The aluminum component provides additional acid-neutralizing capacity, though this is minimal compared to dedicated antacids. Bioavailability is very low (less than 5% absorbed systemically) because the therapeutic effect is entirely local. However, the small amount of aluminum absorbed can accumulate in patients with impaired renal clearance, leading to aluminum toxicity." },
    riskFactors: ["Active duodenal or gastric ulcer requiring mucosal protection", "Stress ulcer prophylaxis in ICU patients (ventilated, coagulopathic, head injury)", "NSAID-associated gastropathy prevention", "Renal impairment - GFR below 30 (aluminum accumulation risk)", "Polypharmacy - multiple medications affected by binding interactions", "Enteral feeding (bezoar risk with concurrent tube feeds)", "Dysphagia or esophageal stricture (large tablet size)"],
    diagnostics: ["H. pylori testing (urea breath test, stool antigen) before initiating ulcer therapy", "Endoscopy to confirm ulcer location and rule out malignancy", "CBC for baseline hemoglobin (assess for chronic GI blood loss)", "Renal function (BUN, creatinine, GFR) to assess aluminum clearance", "Serum aluminum level if prolonged use in renal impairment", "Monitor therapeutic response: symptom resolution and endoscopic healing at 4-8 weeks"],
    management: ["Administer 1 gram QID (1 hour before meals and at bedtime) for active ulcers", "Separate from all interacting medications by minimum 2 hours", "Continue treatment for 4-8 weeks for duodenal ulcer healing", "Coordinate medication schedule to minimize drug interaction impact", "Monitor for constipation and implement bowel regimen if needed", "Assess for aluminum toxicity in renal patients: encephalopathy, osteomalacia, anemia"],
    nursingActions: ["Create comprehensive medication administration schedule that accounts for 2-hour separation requirements", "Assess pain level and location before and after administration to evaluate therapeutic response", "Monitor bowel function - constipation occurs in 2-3% of patients", "Verify renal function before administration in patients with kidney disease", "Educate patient on proper timing: empty stomach is essential for drug activation", "Coordinate with pharmacy on alternative dosage forms (suspension) for patients unable to swallow tablets", "Monitor INR closely in patients on concurrent warfarin (sucralfate reduces warfarin absorption by up to 30%)", "Document medication interactions and alert providers to potential absorption issues"],
    signs: {
      left: ["Ulcer Healing: Epigastric Pain Relief Within 1-2 Weeks", "Protective Barrier Formation Over Ulcer Crater", "Prostaglandin E2 Stimulation: Enhanced Mucosal Blood Flow", "EGF Concentration at Ulcer Site: Accelerated Epithelial Repair"],
      right: ["Constipation (2-3% incidence)", "Drug Interaction: Reduced Absorption of Concurrent Medications", "Aluminum Accumulation in Renal Failure: Encephalopathy, Osteomalacia", "Bezoar Formation with Enteral Feeds"]
    },
    medications: [
      { name: "Sucralfate (Carafate)", type: "Cytoprotective Agent / Mucosal Protectant", action: "Acid-catalyzed polymerization forms adhesive barrier over ulcerated mucosa via electrostatic binding to exposed proteins; stimulates prostaglandin E2, concentrates EGF/FGF at ulcer site, inhibits pepsin, and adsorbs bile acids", sideEffects: "Constipation (most common), dry mouth, nausea, aluminum toxicity in renal failure (encephalopathy, osteomalacia, microcytic anemia)", contra: "Severe renal impairment (GFR <30 - aluminum accumulation), GI obstruction, known hypersensitivity", pearl: "Key drug interactions: reduces absorption of fluoroquinolones (60-70% reduction), phenytoin (reduces levels by 20%), digoxin, warfarin (up to 30% reduction), levothyroxine (significant reduction), and ketoconazole. Requires acidic pH to activate - avoid concurrent PPIs within 30 minutes. Heal rate for duodenal ulcer: 82-90% at 8 weeks." },
      { name: "Misoprostol (Cytotec)", type: "Prostaglandin E1 Analog", action: "Replaces protective prostaglandins inhibited by NSAIDs - enhances mucosal blood flow, stimulates mucus and bicarbonate secretion", sideEffects: "Diarrhea (dose-dependent, 13-40%), abdominal cramping, uterine contractions", contra: "Pregnancy (Category X - abortifacient), women of childbearing potential without contraception", pearl: "Alternative cytoprotective agent specifically indicated for NSAID-induced ulcer prevention. Given QID with food. The combination product diclofenac/misoprostol (Arthrotec) provides NSAID therapy with built-in gastroprotection." }
    ],
    pearls: ["Sucralfate requires pH below 4 to activate - giving it with PPIs simultaneously reduces its effectiveness because PPIs raise gastric pH", "The 2-hour medication separation rule is critical: create a visual medication schedule for patients on multiple drugs", "Stress ulcer prophylaxis: sucralfate has lower pneumonia risk than PPIs (does not raise gastric pH, so less bacterial colonization) but PPIs are more effective at preventing clinically significant bleeding", "Warfarin interaction is clinically significant - monitor INR closely and separate dosing. May need warfarin dose adjustment.", "Aluminum toxicity triad in renal failure: dialysis encephalopathy (myoclonus, seizures), osteomalacia (bone pain, fractures), and microcytic anemia (aluminum inhibits heme synthesis)"],
    quiz: [
      { question: "A nurse is caring for an ICU patient on a ventilator who needs stress ulcer prophylaxis. The provider asks the nurse's preference between sucralfate and a PPI. What is the key consideration?", options: ["Both are identical in efficacy and safety", "Sucralfate has lower VAP risk because it does not raise gastric pH, but PPIs are more effective at preventing GI bleeding", "PPIs are always preferred in the ICU", "Sucralfate is contraindicated in ventilated patients"], correct: 1, rationale: "PPIs raise gastric pH, which can promote bacterial colonization and increase ventilator-associated pneumonia (VAP) risk. Sucralfate preserves the acidic gastric environment, reducing bacterial overgrowth and VAP risk. However, PPIs are more effective at preventing clinically significant GI bleeding. The choice depends on patient-specific risk factors (bleeding risk vs VAP risk)." },
      { question: "A patient on warfarin and sucralfate has an INR of 1.4 (subtherapeutic). What is the most likely cause?", options: ["Warfarin resistance requiring genetic testing", "Sucralfate binding warfarin in the GI tract and reducing its absorption by up to 30%", "Laboratory error requiring repeat testing", "Vitamin K excess from dietary sources"], correct: 1, rationale: "Sucralfate binds warfarin in the GI tract through electrostatic and adsorptive mechanisms, reducing absorption by up to 30%. This results in subtherapeutic INR levels. The nurse should verify that medications are separated by at least 2 hours and notify the provider about the interaction for potential warfarin dose adjustment." }
    ]
  },
  "sucralfate-np": {
    title: "Sucralfate",
    cellular: { title: "Pharmacology of Cytoprotective Agents", content: "Sucralfate's mechanism involves acid-catalyzed hydrolysis of the aluminum hydroxide moiety followed by cross-linking of sucrose octasulfate polymers through aluminum coordination bonds, creating a viscous polyanion gel with strong electrostatic affinity for positively charged proteins (fibrinogen, albumin, fibronectin) exposed at the ulcer base. The binding energy (approximately 6.5 kcal/mol) exceeds that of normal mucosa (2.1 kcal/mol), explaining selective ulcer adherence. Cytoprotective mechanisms operate through parallel pathways: direct stimulation of constitutive cyclooxygenase-1 (COX-1) increasing prostaglandin E2 and I2 synthesis (enhancing mucosal blood flow by 30% and bicarbonate secretion by 50%), sequestration of epidermal growth factor (EGF) from saliva and gastric juice at the ulcer surface (concentrating it 7-fold compared to surrounding mucosa), and adsorption of bile acids (primarily chenodeoxycholic acid and deoxycholic acid) that cause mucosal injury through solubilization of membrane phospholipids. The pepsin inhibition (32% reduction) occurs via both direct binding and pH-mediated conformational change of the enzyme. Aluminum absorption is minimal (0.005-0.1% of administered dose) in patients with normal renal function, with clearance via glomerular filtration. In CKD stage 4-5 (GFR below 30), aluminum clearance decreases proportionally, with accumulation in bone (displacing calcium at the mineralization front causing osteomalacia), brain (aluminum-transferrin complex crosses BBB), and erythroid precursors (inhibiting delta-aminolevulinic acid dehydratase and ferrochelatase, causing microcytic anemia)." },
    riskFactors: ["Duodenal ulcer requiring non-acid-suppressive therapy", "H. pylori-negative, NSAID-negative ulcer (rare indications)", "Stress ulcer prophylaxis when VAP risk outweighs bleeding risk", "Bile reflux gastropathy (binds bile acids)", "Radiation-induced mucositis or esophagitis", "CKD stage 4-5 (absolute contraindication for chronic use)", "Extensive polypharmacy requiring careful interaction management", "Barrett's esophagus with bile acid component"],
    diagnostics: ["Upper endoscopy with biopsy for ulcer characterization and H. pylori testing", "H. pylori testing: urea breath test (preferred), stool antigen, or endoscopic biopsy CLO test", "Comprehensive metabolic panel with renal function for aluminum clearance assessment", "Serum aluminum level if GFR below 60 and treatment exceeds 4 weeks", "Gastrin level to rule out Zollinger-Ellison syndrome in refractory ulcers", "Stool H. pylori antigen 4 weeks after eradication therapy completion", "24-hour pH monitoring if GERD component suspected"],
    management: ["Prescribe sucralfate 1g QID (ac and hs) for active duodenal ulcer - 4-8 week course", "Create detailed medication administration schedule accounting for all drug interactions", "Prescribe concurrent H. pylori eradication if testing positive (quadruple therapy preferred)", "Monitor serum aluminum quarterly if GFR 30-60; avoid if GFR below 30", "Switch to PPI-based therapy if significant polypharmacy makes 2-hour separation impractical", "Prescribe sucralfate suspension for ICU stress ulcer prophylaxis when VAP risk is high", "Consider misoprostol 200mcg QID for NSAID gastropathy prevention in patients who must continue NSAIDs", "Coordinate with nephrology for aluminum monitoring in CKD patients"],
    nursingActions: ["Develop comprehensive medication reconciliation with interaction analysis for all concurrent drugs", "Calculate 2-hour separation windows for each interacting medication and create patient-specific dosing schedule", "Monitor therapeutic drug levels for narrow therapeutic index drugs (warfarin INR, phenytoin levels, digoxin levels) when combined with sucralfate", "Assess aluminum accumulation risk: check GFR, order serum aluminum if indicated", "Evaluate clinical response: symptom resolution timeline and endoscopic healing rate at 4-8 weeks", "Consider switching to PPI if sucralfate schedule is impractical for patient adherence", "Monitor for aluminum toxicity triad in renal patients: cognitive changes, bone pain, anemia", "Educate on evidence-based rationale for timing requirements and interaction prevention"],
    signs: {
      left: ["Selective Ulcer Adherence: 3x Binding Affinity vs Normal Mucosa", "PGE2 Stimulation: 30% Mucosal Blood Flow Increase", "EGF Concentration: 7-fold at Ulcer Surface", "Pepsin Inhibition: 32% Activity Reduction"],
      right: ["Aluminum Bone Deposition: Osteomalacia at Mineralization Front", "BBB Penetration: Aluminum-Transferrin Complex Neurotoxicity", "Erythroid Suppression: ALA Dehydratase and Ferrochelatase Inhibition", "Fluoroquinolone Chelation: 60-70% Absorption Reduction"]
    },
    medications: [
      { name: "Sucralfate (Carafate)", type: "Cytoprotective Polyanionic Gel", action: "Acid-catalyzed polymerization forms electrostatic barrier over ulcerated mucosa; COX-1-mediated PGE2/PGI2 stimulation; EGF sequestration at ulcer site; bile acid adsorption; 32% pepsin inhibition", sideEffects: "Constipation, aluminum toxicity in CKD (osteomalacia, encephalopathy, microcytic anemia), bezoar formation", contra: "CKD stage 4-5 (GFR <30) for chronic use, GI obstruction, concurrent fluoroquinolone therapy (chelation)", pearl: "NP prescribing considerations: 82-90% duodenal ulcer healing at 8 weeks. Lower pneumonia risk than PPIs in ICU (preserves gastric acidity). Major interactions: fluoroquinolones (-60-70%), phenytoin (-20%), warfarin (-30%), levothyroxine (significant reduction), tetracyclines, ketoconazole. Aluminum clearance T1/2 is 24 hours (normal renal function) vs weeks-months in ESRD." },
      { name: "Bismuth Subsalicylate (Pepto-Bismol)", type: "Cytoprotective / Antimicrobial", action: "Forms protective coating over ulcerated mucosa; has direct antibacterial activity against H. pylori; reduces pepsin activity; stimulates PGE2 synthesis", sideEffects: "Black tongue and stool (harmless bismuth sulfide), tinnitus (salicylate component), Reye syndrome risk in children", contra: "Aspirin/salicylate allergy, children with viral illness (Reye syndrome), concurrent anticoagulant therapy", pearl: "Component of bismuth quadruple therapy for H. pylori (PPI + bismuth + metronidazole + tetracycline x 14 days). First-line H. pylori eradication when clarithromycin resistance exceeds 15% (most North American regions). Does not require acid activation like sucralfate." }
    ],
    pearls: ["Sucralfate vs PPI for stress ulcer prophylaxis: sucralfate preserves gastric acidity (lower VAP risk) but PPIs prevent more clinically significant GI bleeds - individualize based on patient risk profile", "The fluoroquinolone interaction is clinically catastrophic: 60-70% absorption reduction can lead to treatment failure for serious infections - NEVER co-administer, and 2-hour separation may be insufficient for some patients", "Aluminum toxicity in dialysis patients: historical 'dialysis dementia' from aluminum-containing phosphate binders. Modern practice avoids aluminum-based agents in ESRD - use sevelamer or lanthanum instead", "Sucralfate slurry (crushed tablet in water) can be applied topically for radiation-induced oral mucositis - an important off-label NP prescribing application", "For patients on more than 5 medications, the practical difficulty of 2-hour separations often makes PPIs the better choice despite theoretical advantages of sucralfate"],
    quiz: [
      { question: "An NP is evaluating a CKD stage 3b patient (GFR 38) on sucralfate for 6 weeks who develops new confusion, bone pain, and microcytic anemia with normal iron studies. What is the most likely diagnosis?", options: ["Iron deficiency anemia from GI blood loss", "Aluminum toxicity from impaired renal clearance of absorbed aluminum", "Vitamin B12 deficiency from medication interaction", "Uremic encephalopathy unrelated to sucralfate"], correct: 1, rationale: "The triad of encephalopathy (confusion), osteomalacia (bone pain), and microcytic anemia with normal iron studies in a CKD patient on sucralfate is diagnostic of aluminum toxicity. Aluminum accumulates when GFR is impaired - it deposits in bone (displacing calcium at the mineralization front), crosses the BBB as aluminum-transferrin complex, and inhibits heme synthesis enzymes (ALA dehydratase, ferrochelatase). Sucralfate should be discontinued and serum aluminum level checked." },
      { question: "An NP is prescribing sucralfate for an ICU patient on a ventilator. The pharmacist suggests a PPI instead. What is the evidence-based response?", options: ["PPIs and sucralfate are equivalent for all outcomes", "Sucralfate has lower VAP risk because it preserves gastric acidity, but PPIs are superior for preventing clinically significant GI bleeding - the choice depends on patient-specific risk factors", "Sucralfate is always superior in the ICU setting", "PPIs have no role in ICU stress ulcer prophylaxis"], correct: 1, rationale: "The SUP-ICU and PEPTIC trials established that PPIs reduce clinically significant GI bleeding more effectively than sucralfate/H2 blockers, but the preservation of gastric acidity with sucralfate reduces gastric bacterial colonization and potentially VAP risk. The clinician should individualize: high GI bleeding risk (coagulopathy, prior GI bleed, prolonged ventilation) favors PPIs; high VAP risk with low bleeding risk may favor sucralfate." }
    ]
  }
};
