import type { LessonContent } from "./types";

export const rnGiCancerPedsIntegLessons: Record<string, LessonContent> = {
  "liver-cirrhosis-patho-rn": {
    title: "Liver Cirrhosis: RN Pathophysiology",
    cellular: {
      title: "Hepatocyte Damage & Portal Hypertension",
      content: "Cirrhosis is the end-stage of chronic liver disease characterized by irreversible replacement of normal hepatic parenchyma with fibrous scar tissue and regenerative nodules. Persistent hepatocyte injury (from alcohol, viral hepatitis, NAFLD, or autoimmune disease) triggers hepatic stellate cell activation, which produces excessive collagen deposition in the space of Disse. This fibrosis disrupts sinusoidal blood flow, increasing portal venous pressure above the normal 5-10 mmHg threshold. Portal hypertension (>12 mmHg) drives the formation of portosystemic collaterals (esophageal varices, caput medusae, hemorrhoids), splenomegaly with hypersplenism, and ascites through increased hydrostatic pressure combined with decreased oncotic pressure from impaired albumin synthesis. Hepatocyte loss also reduces synthesis of clotting factors (II, VII, IX, X), bile salts, and bilirubin conjugation, leading to coagulopathy and jaundice. Impaired ammonia metabolism by damaged hepatocytes leads to hyperammonemia and hepatic encephalopathy through glutamine accumulation in astrocytes causing cerebral edema."
    },
    riskFactors: [
      "Chronic alcohol use disorder (most common cause in Western countries)",
      "Chronic hepatitis B or C infection",
      "Non-alcoholic fatty liver disease (NAFLD) and non-alcoholic steatohepatitis (NASH)",
      "Autoimmune hepatitis",
      "Primary biliary cholangitis or primary sclerosing cholangitis",
      "Hemochromatosis or Wilson disease",
      "Alpha-1 antitrypsin deficiency",
      "Prolonged exposure to hepatotoxic medications"
    ],
    diagnostics: [
      "Liver function tests: elevated AST/ALT (AST:ALT ratio >2:1 suggests alcoholic etiology), elevated bilirubin, decreased albumin (<3.5 g/dL)",
      "Coagulation studies: prolonged PT/INR reflecting decreased clotting factor synthesis",
      "CBC: thrombocytopenia (splenomegaly with sequestration), anemia",
      "Serum ammonia level: elevated in hepatic encephalopathy",
      "Abdominal ultrasound with Doppler: nodular liver surface, portal vein flow reversal, ascites",
      "Upper endoscopy (EGD): screening for esophageal and gastric varices",
      "Paracentesis: serum-ascites albumin gradient (SAAG) >1.1 g/dL confirms portal hypertension",
      "Child-Pugh score and MELD score for disease severity and transplant listing",
      "FibroScan (transient elastography): non-invasive fibrosis assessment"
    ],
    management: [
      "Alcohol cessation and substance abuse counseling for alcoholic cirrhosis",
      "Antiviral therapy for hepatitis B/C-related cirrhosis",
      "Sodium restriction (2g/day) and diuretics (spironolactone + furosemide) for ascites management",
      "Large-volume paracentesis with albumin replacement (6-8 g/L removed) for tense ascites",
      "Lactulose titrated to 2-3 soft stools daily for hepatic encephalopathy prevention",
      "Rifaximin 550 mg BID as adjunct for recurrent hepatic encephalopathy",
      "Non-selective beta-blockers (propranolol, nadolol) for variceal bleeding prophylaxis",
      "Endoscopic variceal ligation (banding) for medium-large varices",
      "TIPS (transjugular intrahepatic portosystemic shunt) for refractory ascites or recurrent variceal bleeding",
      "Liver transplant evaluation for decompensated cirrhosis (MELD score >=15)"
    ],
    nursingActions: [
      "Monitor daily weight, abdominal girth measurements, and strict I&O for fluid status",
      "Assess for signs of hepatic encephalopathy: asterixis (flapping tremor), confusion, personality changes, sleep-wake reversal",
      "Administer lactulose as prescribed and monitor stool frequency and consistency",
      "Monitor coagulation studies and assess for bleeding (gums, petechiae, ecchymoses, melena)",
      "Implement fall precautions due to altered mentation and coagulopathy",
      "Educate patient on sodium-restricted diet and fluid restriction if hyponatremic",
      "Monitor serum electrolytes, renal function, and ammonia levels",
      "Assess skin for jaundice, pruritus, spider angiomata, and palmar erythema",
      "Position patient in semi-Fowler position for ascites-related dyspnea"
    ],
    assessmentFindings: [
      "Jaundice and scleral icterus reflecting hyperbilirubinemia",
      "Ascites: shifting dullness, fluid wave, increased abdominal girth",
      "Spider angiomata on upper body and face",
      "Palmar erythema and Dupuytren contracture",
      "Asterixis (liver flap) indicating hepatic encephalopathy",
      "Caput medusae (dilated periumbilical veins)",
      "Splenomegaly palpable below left costal margin",
      "Peripheral edema and muscle wasting",
      "Fetor hepaticus (musty, sweet breath odor)"
    ],
    signs: {
      left: [
        "Portal hypertension (>12 mmHg)",
        "Esophageal varices",
        "Ascites formation",
        "Splenomegaly",
        "Caput medusae"
      ],
      right: [
        "Hepatic encephalopathy",
        "Coagulopathy (elevated INR)",
        "Hypoalbuminemia",
        "Jaundice",
        "Hepatorenal syndrome"
      ]
    },
    medications: [
      { name: "Lactulose", type: "Osmotic laxative", action: "Reduces ammonia by converting NH3 to NH4+ in colon for fecal excretion", sideEffects: "Diarrhea, flatulence, abdominal cramping, electrolyte imbalances", contra: "Galactosemia; use with caution in diabetes", pearl: "Titrate to 2-3 soft stools/day; monitor for dehydration and hypokalemia" },
      { name: "Spironolactone", type: "Potassium-sparing diuretic (aldosterone antagonist)", action: "Blocks aldosterone receptors in distal tubule; counteracts secondary hyperaldosteronism of cirrhosis", sideEffects: "Hyperkalemia, gynecomastia, metabolic acidosis", contra: "Potassium >5.5 mEq/L, renal failure", pearl: "Typically combined with furosemide in 100:40 ratio; monitor potassium closely" },
      { name: "Propranolol", type: "Non-selective beta-blocker", action: "Reduces portal pressure by decreasing cardiac output (beta-1) and splanchnic vasoconstriction (beta-2)", sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm", contra: "Severe bradycardia, asthma, decompensated HF; hold if SBP <90", pearl: "Target resting HR of 55-60 bpm for variceal prophylaxis" },
      { name: "Rifaximin", type: "Non-absorbable antibiotic", action: "Reduces ammonia-producing intestinal bacteria without systemic absorption", sideEffects: "Nausea, flatulence, headache", contra: "Hypersensitivity to rifamycins", pearl: "Used with lactulose for secondary prevention of hepatic encephalopathy episodes" },
      { name: "Octreotide", type: "Somatostatin analog", action: "Reduces splanchnic blood flow and portal pressure during acute variceal bleeding", sideEffects: "Hyperglycemia, bradycardia, nausea", contra: "Hypersensitivity", pearl: "Given as IV bolus 50 mcg then 50 mcg/hr infusion for 3-5 days during acute variceal hemorrhage" }
    ],
    pearls: [
      "MELD score (Model for End-Stage Liver Disease) uses bilirubin, INR, and creatinine to predict 90-day mortality and prioritize transplant listing",
      "Child-Pugh classification (A, B, C) uses bilirubin, albumin, INR, ascites, and encephalopathy grade to assess severity",
      "Spontaneous bacterial peritonitis (SBP): suspect in any cirrhotic with ascites who develops fever, abdominal pain, or worsening encephalopathy; diagnose with PMN count >250/mm3 in ascitic fluid",
      "Hepatorenal syndrome: functional renal failure in advanced cirrhosis; type 1 (rapid, <2 weeks) is life-threatening; albumin and vasopressors (terlipressin) are bridge to transplant",
      "Never give NSAIDs to cirrhotic patients — they reduce renal blood flow and precipitate hepatorenal syndrome",
      "Asterixis is tested by asking patient to dorsiflex wrists with arms extended — involuntary flapping indicates grade 2+ hepatic encephalopathy"
    ],
    quiz: [
      { question: "A client with cirrhosis has a serum ammonia level of 95 mcg/dL and is demonstrating asterixis. Which medication should the nurse administer first?", options: ["Furosemide", "Lactulose", "Spironolactone", "Vitamin K"], correct: 1, rationale: "Elevated ammonia with asterixis indicates hepatic encephalopathy. Lactulose is the first-line treatment as it converts ammonia (NH3) to ammonium (NH4+) in the colon, which is then excreted in stool. It also draws water into the bowel via osmosis, increasing fecal elimination of ammonia." },
      { question: "During a paracentesis, 5 liters of ascitic fluid is removed. What should the nurse anticipate administering?", options: ["Packed red blood cells", "Normal saline bolus", "25% albumin intravenously", "Fresh frozen plasma"], correct: 2, rationale: "Large-volume paracentesis (>5 L) requires IV albumin replacement (6-8 g per liter removed) to prevent post-paracentesis circulatory dysfunction, which can lead to rapid reaccumulation of ascites and hepatorenal syndrome." },
      { question: "A cirrhotic patient on propranolol has a blood pressure of 85/50 and heart rate of 48 bpm. What is the priority nursing action?", options: ["Administer the next dose of propranolol", "Hold propranolol and notify the provider", "Encourage oral fluids", "Reposition to Trendelenburg"], correct: 1, rationale: "Hypotension and bradycardia are signs of beta-blocker toxicity/intolerance. The nurse should hold the medication and notify the provider. In cirrhotic patients, propranolol should be discontinued if SBP drops below 90 mmHg or HR below 55 bpm." }
    ]
  },

  "hepatitis-viral-rn": {
    title: "Hepatitis: Viral Types & Liver Function",
    cellular: {
      title: "Viral Hepatitis Pathogenesis",
      content: "Viral hepatitis involves inflammation and necrosis of hepatocytes caused by hepatotropic viruses (A through E). Hepatitis A (HAV) and E (HEV) are transmitted via the fecal-oral route and cause acute, self-limiting infections. HAV enters enterocytes, reaches the liver via portal circulation, and replicates in hepatocytes; the immune response (cytotoxic T cells) causes hepatocyte destruction rather than the virus itself. Hepatitis B (HBV) is a DNA virus transmitted through blood, sexual contact, and vertical transmission; it integrates into the host genome and can cause chronic infection. HBV surface antigen (HBsAg) persistence >6 months defines chronic HBV, which carries risk for cirrhosis and hepatocellular carcinoma. Hepatitis C (HCV) is an RNA virus transmitted primarily through blood; it evades immune clearance through rapid mutation, causing chronic infection in 75-85% of cases. Chronic HCV drives progressive fibrosis through persistent inflammation and stellate cell activation. Hepatitis D (HDV) is a defective RNA virus requiring HBV coinfection to replicate. All forms produce elevated aminotransferases (ALT > AST in viral hepatitis, unlike alcoholic liver disease where AST > ALT), conjugated hyperbilirubinemia, and potential coagulopathy."
    },
    riskFactors: [
      "HAV/HEV: contaminated food/water, poor sanitation, international travel to endemic areas",
      "HBV: unprotected sexual contact, IV drug use, needle stick injuries, vertical transmission, unvaccinated healthcare workers",
      "HCV: IV drug use (most common in developed countries), blood transfusions before 1992, needle stick injuries, tattoos with unsterile equipment",
      "HDV: requires HBV coinfection; same risk factors as HBV",
      "Immunocompromised states (HIV coinfection accelerates progression)",
      "Occupational exposure in healthcare settings"
    ],
    diagnostics: [
      "HAV: IgM anti-HAV (acute infection), IgG anti-HAV (immunity from prior infection or vaccination)",
      "HBV serology panel: HBsAg (active infection), anti-HBs (immunity), HBeAg (high infectivity), anti-HBe (decreased replication), anti-HBc IgM (acute), anti-HBc IgG (chronic or resolved)",
      "HCV: anti-HCV antibody (screening), HCV RNA viral load (confirms active infection), genotyping (guides treatment)",
      "Liver function tests: ALT > AST elevation (ALT more liver-specific), elevated bilirubin, decreased albumin in chronic disease",
      "PT/INR: prolonged with severe hepatocellular damage",
      "Liver biopsy or FibroScan: staging fibrosis in chronic HBV/HCV",
      "AFP (alpha-fetoprotein): screening for hepatocellular carcinoma in chronic HBV/HCV",
      "Ultrasound: assess for hepatomegaly, cirrhosis, focal lesions"
    ],
    management: [
      "HAV: supportive care, rest, adequate nutrition; no specific antiviral therapy",
      "HBV acute: supportive care; chronic HBV: entecavir or tenofovir (nucleoside analogs) for viral suppression",
      "HCV: direct-acting antivirals (DAAs) — sofosbuvir/velpatasvir or glecaprevir/pibrentasvir achieve >95% cure rates in 8-12 weeks",
      "HDV: pegylated interferon alfa; bulevirtide (entry inhibitor) for chronic HDV",
      "HAV vaccination: 2-dose series for at-risk populations; post-exposure prophylaxis within 2 weeks",
      "HBV vaccination: 3-dose series (0, 1, 6 months); check anti-HBs titer for healthcare workers",
      "Activity restriction during acute phase; no alcohol consumption",
      "Contact precautions for HAV (fecal-oral); standard/blood precautions for HBV/HCV",
      "Screening contacts and sexual partners for HBV/HCV"
    ],
    nursingActions: [
      "Implement appropriate isolation precautions based on hepatitis type (enteric for HAV, standard/blood for HBV/HCV)",
      "Monitor liver function tests trending for improvement or worsening",
      "Assess for signs of fulminant hepatic failure: rapidly worsening jaundice, coagulopathy, encephalopathy",
      "Educate patient on transmission prevention specific to hepatitis type",
      "Administer hepatitis vaccines and immune globulin as prescribed for post-exposure prophylaxis",
      "Monitor for medication hepatotoxicity and avoid hepatotoxic drugs (acetaminophen >2g/day, alcohol)",
      "Provide nutritional support: small frequent meals, adequate protein unless encephalopathic",
      "Assess for pruritus management: cholestyramine, cool baths, antihistamines",
      "Ensure follow-up for chronic HBV/HCV: regular AFP and ultrasound screening every 6 months"
    ],
    assessmentFindings: [
      "Prodromal phase: fatigue, malaise, anorexia, nausea, RUQ discomfort, low-grade fever",
      "Icteric phase: jaundice, dark (tea-colored) urine, clay-colored (acholic) stools, hepatomegaly with tenderness",
      "Recovery phase: gradual resolution of jaundice and symptoms over weeks to months",
      "Chronic hepatitis: may be asymptomatic or present with persistent fatigue and mild RUQ discomfort",
      "Spider angiomata and palmar erythema in chronic disease progression",
      "Arthralgias and skin rashes (serum sickness-like) in acute HBV"
    ],
    signs: {
      left: [
        "HAV: fecal-oral, acute only",
        "HBV: blood/body fluids, can become chronic",
        "HCV: blood, 75-85% become chronic"
      ],
      right: [
        "HDV: requires HBV coinfection",
        "HEV: fecal-oral, dangerous in pregnancy",
        "All types: hepatocyte inflammation"
      ]
    },
    medications: [
      { name: "Entecavir", type: "Nucleoside analog (anti-HBV)", action: "Inhibits HBV DNA polymerase, suppressing viral replication", sideEffects: "Headache, fatigue, dizziness, lactic acidosis (rare)", contra: "Hypersensitivity; do not discontinue abruptly (risk of hepatic flare)", pearl: "First-line for chronic HBV; high barrier to resistance; monitor HBV DNA levels" },
      { name: "Sofosbuvir/Velpatasvir", type: "Direct-acting antiviral combination (anti-HCV)", action: "Sofosbuvir inhibits NS5B RNA polymerase; velpatasvir inhibits NS5A — together they block HCV replication", sideEffects: "Headache, fatigue, nausea", contra: "Strong P-glycoprotein inducers; with amiodarone (symptomatic bradycardia)", pearl: "Pan-genotypic: effective against all HCV genotypes 1-6; 12-week course achieves >95% sustained virologic response" },
      { name: "Hepatitis B Immune Globulin (HBIG)", type: "Passive immunization", action: "Provides immediate passive immunity with anti-HBs antibodies", sideEffects: "Injection site pain, low-grade fever, myalgia", contra: "IgA deficiency with anti-IgA antibodies", pearl: "Given within 12 hours of birth to infants of HBsAg+ mothers along with HBV vaccine series; also used post-needle stick" },
      { name: "Pegylated Interferon Alfa", type: "Immunomodulator", action: "Enhances immune-mediated clearance of hepatitis virus and inhibits viral replication", sideEffects: "Flu-like symptoms, depression, myelosuppression, thyroid dysfunction, autoimmune reactions", contra: "Decompensated cirrhosis, autoimmune hepatitis, severe psychiatric illness", pearl: "Primarily used for HDV and select HBV cases; monitor CBC and thyroid function regularly" }
    ],
    pearls: [
      "HBV 'window period': time when HBsAg has cleared but anti-HBs has not yet appeared — only anti-HBc IgM is detectable during this phase",
      "Hepatitis B is the only DNA hepatitis virus; all others are RNA viruses",
      "HCV is now curable with DAAs in 8-12 weeks — the treatment paradigm has shifted from management to cure",
      "Pregnant women who are HBsAg+ should receive tenofovir in the third trimester if HBV DNA >200,000 IU/mL to reduce vertical transmission",
      "HAV and HEV do NOT cause chronic hepatitis; HBV, HCV, and HDV can progress to chronicity",
      "HEV is particularly dangerous in pregnancy (up to 25% mortality in third trimester)"
    ],
    quiz: [
      { question: "A healthcare worker sustains a needle stick from a patient who is HBsAg positive. The worker's anti-HBs titer is >10 mIU/mL. What is the priority intervention?", options: ["Administer HBIG immediately", "Begin the hepatitis B vaccine series", "No intervention needed — the worker is immune", "Administer both HBIG and hepatitis B vaccine"], correct: 2, rationale: "An anti-HBs titer >10 mIU/mL indicates adequate immunity from prior vaccination. No post-exposure prophylaxis is needed. If the titer were <10, both HBIG and a booster vaccine would be indicated." },
      { question: "A patient has the following hepatitis B serology: HBsAg negative, anti-HBs positive, anti-HBc negative. What does this indicate?", options: ["Acute hepatitis B infection", "Chronic hepatitis B infection", "Immunity from vaccination", "Immunity from natural infection"], correct: 2, rationale: "HBsAg negative (no active infection), anti-HBs positive (immunity), anti-HBc negative (never infected) = immunity from vaccination. Natural infection immunity would show anti-HBc positive." },
      { question: "Which hepatitis virus requires coinfection with another hepatitis virus to replicate?", options: ["Hepatitis A", "Hepatitis C", "Hepatitis D", "Hepatitis E"], correct: 2, rationale: "Hepatitis D (delta virus) is a defective RNA virus that requires the HBsAg coat protein from hepatitis B to replicate. It can occur as coinfection (simultaneous with HBV) or superinfection (HBV carrier acquires HDV), with superinfection having worse prognosis." }
    ]
  },

  "acute-pancreatitis-patho-rn": {
    title: "Acute Pancreatitis: RN Pathophysiology",
    cellular: {
      title: "Autodigestion & Inflammatory Cascade",
      content: "Acute pancreatitis results from premature activation of pancreatic enzymes (particularly trypsinogen to trypsin) within the pancreatic parenchyma, leading to autodigestion. The two most common etiologies are gallstones (40%) impacting the ampulla of Vater and causing bile reflux into the pancreatic duct, and alcohol (40%) causing direct toxic injury to acinar cells and increased zymogens. Premature trypsin activation triggers a cascade: trypsin activates other zymogens (elastase, phospholipase, lipase), elastase digests blood vessel walls causing hemorrhage, lipase digests peripancreatic fat causing fat necrosis and saponification (calcium binding to fatty acids, causing hypocalcemia), and phospholipase damages cell membranes. The massive inflammatory response releases cytokines (TNF-alpha, IL-1, IL-6) into systemic circulation, potentially causing SIRS, multiorgan failure, and ARDS. Cullen sign (periumbilical ecchymosis) and Grey Turner sign (flank ecchymosis) indicate retroperitoneal hemorrhage from severe necrotizing pancreatitis. Ranson criteria at admission and at 48 hours predict severity and mortality."
    },
    riskFactors: [
      "Gallstones (most common cause overall — 40%)",
      "Chronic alcohol use (most common in men — 40%)",
      "Hypertriglyceridemia (>1000 mg/dL)",
      "Post-ERCP pancreatitis (5-10% of procedures)",
      "Medications: valproic acid, azathioprine, thiazides, estrogens, tetracycline",
      "Pancreas divisum or sphincter of Oddi dysfunction",
      "Trauma (blunt abdominal injury, post-surgical)",
      "Hypercalcemia",
      "Scorpion stings (tropical regions)",
      "Idiopathic (15-25% of cases)"
    ],
    diagnostics: [
      "Serum lipase: most sensitive and specific marker; elevated >3x upper limit of normal is diagnostic (preferred over amylase)",
      "Serum amylase: rises within 6-12 hours, peaks at 48 hours; less specific than lipase",
      "CT abdomen with IV contrast: gold standard for diagnosing necrosis and complications (peripancreatic fluid, pseudocyst); perform at 72+ hours if concern for necrosis",
      "Ranson criteria: assess at admission (age >55, WBC >16,000, glucose >200, AST >250, LDH >350) and at 48 hours (Hct drop >10%, BUN rise >5, calcium <8, PaO2 <60, base deficit >4, fluid sequestration >6L)",
      "CBC: leukocytosis, hemoconcentration (elevated Hct suggests third-spacing)",
      "BMP: hypocalcemia (fat saponification), hyperglycemia (islet cell damage), elevated BUN (dehydration)",
      "CRP >150 mg/L at 48 hours suggests severe pancreatitis",
      "Triglyceride level if no gallstone or alcohol etiology",
      "MRCP or EUS: evaluate for choledocholithiasis if biliary etiology suspected"
    ],
    management: [
      "Aggressive IV fluid resuscitation: lactated Ringer's at 5-10 mL/kg/hr initially, targeting UOP >0.5 mL/kg/hr",
      "Pain management: IV opioids (hydromorphone preferred; meperidine historically used but falling out of favor), multimodal approach with acetaminophen and NSAIDs",
      "NPO status initially if nausea/vomiting/ileus present, but early oral feeding (within 24 hours) as tolerated improves outcomes",
      "Low-fat, soft diet when advancing oral intake; enteral nutrition via NJ tube if unable to tolerate oral within 72 hours",
      "Avoid TPN unless enteral route is not feasible — enteral nutrition maintains gut mucosal integrity and reduces infection risk",
      "ERCP within 24 hours for biliary pancreatitis with cholangitis or persistent biliary obstruction",
      "Cholecystectomy during index admission for mild gallstone pancreatitis; delayed for severe disease",
      "Antibiotics NOT routinely indicated; use only for confirmed infected necrosis (CT-guided aspiration with culture)",
      "ICU admission for severe pancreatitis with organ failure"
    ],
    nursingActions: [
      "Maintain strict NPO as prescribed; advance diet slowly with low-fat foods when bowel sounds return",
      "Administer aggressive IV fluid replacement and monitor I&O; report UOP <0.5 mL/kg/hr",
      "Position patient in side-lying or fetal position with knees flexed to reduce pain",
      "Monitor for Cullen sign (periumbilical bruising) and Grey Turner sign (flank bruising) — indicators of hemorrhagic pancreatitis",
      "Assess pain using validated scale; administer analgesics promptly — pain is severe and unrelenting",
      "Monitor serum calcium closely — hypocalcemia can cause tetany, Chvostek and Trousseau signs",
      "Check blood glucose regularly — pancreatitis can damage islets of Langerhans causing hyperglycemia",
      "Monitor respiratory status — pancreatitis is a risk factor for ARDS and pleural effusions",
      "Maintain NG tube to low intermittent suction if prescribed for persistent vomiting or ileus"
    ],
    assessmentFindings: [
      "Severe epigastric pain radiating to the back, worsened by eating and lying supine",
      "Nausea, vomiting, and abdominal distension",
      "Guarding and rebound tenderness on abdominal examination",
      "Cullen sign: periumbilical ecchymosis (indicates retroperitoneal hemorrhage)",
      "Grey Turner sign: flank ecchymosis (indicates retroperitoneal hemorrhage)",
      "Fever, tachycardia, hypotension (systemic inflammatory response)",
      "Diminished or absent bowel sounds (paralytic ileus)",
      "Jaundice if biliary obstruction present",
      "Tachypnea and decreased breath sounds at lung bases (pleural effusion)"
    ],
    signs: [
      "Epigastric pain radiating to back — hallmark presentation",
      "Cullen sign and Grey Turner sign — hemorrhagic pancreatitis",
      "Lipase >3x upper normal limit — diagnostic",
      "Hypocalcemia — fat saponification",
      "Hyperglycemia — islet cell damage",
      "Elevated WBC and CRP — inflammatory response"
    ],
    medications: [
      { name: "Hydromorphone", type: "Opioid analgesic", action: "Binds mu-opioid receptors for potent pain relief", sideEffects: "Respiratory depression, constipation, nausea, sedation, hypotension", contra: "Respiratory depression, paralytic ileus, acute alcoholism", pearl: "Preferred over morphine in pancreatitis; meperidine no longer first-line due to seizure risk with metabolite normeperidine" },
      { name: "Lactated Ringer's solution", type: "Isotonic crystalloid", action: "Volume expansion and correction of intravascular depletion from third-spacing", sideEffects: "Fluid overload, pulmonary edema if over-resuscitated", contra: "Hyperkalemia, severe hepatic failure", pearl: "Preferred over normal saline in pancreatitis — LR may reduce SIRS compared to NS; target UOP >0.5 mL/kg/hr" },
      { name: "Pantoprazole", type: "Proton pump inhibitor", action: "Reduces gastric acid secretion to decrease pancreatic stimulation", sideEffects: "Headache, diarrhea, hypomagnesemia with prolonged use", contra: "Hypersensitivity to PPIs", pearl: "Used for stress ulcer prophylaxis in severe pancreatitis; IV form for patients who are NPO" },
      { name: "Imipenem-cilastatin", type: "Carbapenem antibiotic", action: "Broad-spectrum antibiotic with pancreatic tissue penetration", sideEffects: "Nausea, diarrhea, seizures (rare), C. diff risk", contra: "Carbapenem allergy", pearl: "Reserved for confirmed infected pancreatic necrosis — NOT for routine prophylaxis in acute pancreatitis" }
    ],
    pearls: [
      "Ranson criteria >=3 at admission and 48 hours indicates severe pancreatitis with 15-40% mortality",
      "Lipase is more specific for pancreatitis than amylase — amylase can be elevated in parotitis, renal failure, and bowel obstruction",
      "Cullen and Grey Turner signs are late findings (48-72 hours) indicating hemorrhagic pancreatitis — present in only ~3% of cases but indicate severe disease",
      "Early enteral nutrition (within 24-48 hours) is preferred over TPN — it maintains gut barrier function and reduces infectious complications",
      "Hypocalcemia in pancreatitis occurs because fatty acids released from fat necrosis bind calcium (saponification), lowering serum calcium",
      "The pancreas sits retroperitoneally — that is why pain radiates to the back and why peritoneal signs may be minimal initially"
    ],
    quiz: [
      { question: "A client admitted with acute pancreatitis has a serum calcium of 7.2 mg/dL. What is the pathophysiological mechanism for this finding?", options: ["Decreased PTH secretion", "Calcium saponification from fat necrosis", "Excessive calcium excretion by the kidneys", "Vitamin D deficiency"], correct: 1, rationale: "In acute pancreatitis, lipase digests peripancreatic fat, releasing free fatty acids. These fatty acids bind to ionized calcium (saponification), sequestering calcium and causing hypocalcemia. This is a hallmark finding of severe necrotizing pancreatitis." },
      { question: "A nurse observes bluish discoloration around a pancreatitis patient's umbilicus. This finding is documented as:", options: ["Grey Turner sign", "Cullen sign", "Murphy sign", "Rovsing sign"], correct: 1, rationale: "Cullen sign is periumbilical ecchymosis indicating retroperitoneal hemorrhage in severe pancreatitis. Grey Turner sign is flank ecchymosis. Murphy sign is RUQ pain with inspiration (cholecystitis). Rovsing sign is RLQ pain with LLQ palpation (appendicitis)." },
      { question: "Which dietary recommendation is most appropriate for a client recovering from acute pancreatitis?", options: ["High-fat diet to promote caloric intake", "Low-fat, bland diet with small frequent meals", "Clear liquid diet indefinitely", "High-protein, high-calorie diet without restrictions"], correct: 1, rationale: "A low-fat diet reduces pancreatic stimulation. Fat is the strongest stimulant of pancreatic enzyme secretion (via CCK release). Small frequent meals are better tolerated. Alcohol should be permanently avoided." }
    ]
  },

  "gi-bleeding-assessment-rn": {
    title: "GI Bleeding: Upper vs Lower Assessment",
    cellular: {
      title: "Hemodynamic Impact of GI Hemorrhage",
      content: "Gastrointestinal bleeding is classified by location relative to the ligament of Treitz: upper GI bleeding (UGIB) occurs above (esophagus, stomach, duodenum) and lower GI bleeding (LGIB) occurs below (jejunum, ileum, colon, rectum). UGIB is more common and more likely to be hemodynamically significant. Peptic ulcer disease accounts for 35-50% of UGIB (H. pylori and NSAIDs damage the protective mucosal barrier, exposing submucosa to acid-pepsin digestion and eroding into blood vessels). Esophageal varices from portal hypertension cause 10-20% of UGIB and carry 30-50% mortality. Mallory-Weiss tears from forceful vomiting cause 5-10%. In LGIB, diverticular bleeding (painless, massive) and angiodysplasia (AV malformations) are most common in older adults; hemorrhoids and anal fissures are most common overall but rarely hemodynamically significant. Blood in the GI tract is an osmotic and cathartic stimulus, often causing increased peristalsis. Hematemesis (vomiting blood) is always upper GI. Melena (black tarry stool) typically indicates UGIB (requires >50-100 mL blood degraded by gastric acid and bacteria). Hematochezia (bright red rectal bleeding) typically indicates LGIB but can occur with brisk UGIB (>1L rapid hemorrhage). The body compensates for blood loss through tachycardia, peripheral vasoconstriction, and fluid shifts from interstitial space, but decompensation occurs when >30% blood volume is lost."
    },
    riskFactors: [
      "NSAID use (most common modifiable risk factor for peptic ulcer bleeding)",
      "H. pylori infection",
      "Anticoagulant or antiplatelet therapy (warfarin, DOACs, aspirin, clopidogrel)",
      "Liver cirrhosis with portal hypertension (variceal bleeding)",
      "Heavy alcohol use",
      "History of peptic ulcer disease",
      "Advanced age (diverticular disease, angiodysplasia)",
      "Coagulopathy or thrombocytopenia",
      "Mechanical ventilation >48 hours (stress ulceration)",
      "Recent forceful retching or vomiting (Mallory-Weiss tear)"
    ],
    diagnostics: [
      "CBC: serial hemoglobin/hematocrit (initial values may be normal due to hemoconcentration; H&H drops after fluid resuscitation)",
      "Type and crossmatch: prepare for transfusion",
      "BUN/creatinine ratio: >20:1 in UGIB (digested blood is absorbed as protein, raising BUN)",
      "Coagulation studies: PT/INR, aPTT, platelet count",
      "Upper endoscopy (EGD): diagnostic and therapeutic for UGIB; perform within 24 hours (12 hours for suspected variceal bleed)",
      "Colonoscopy: diagnostic for LGIB after adequate bowel preparation",
      "NG tube lavage: positive for blood/coffee grounds confirms UGIB (clear aspirate does not rule out duodenal source)",
      "Tagged RBC scan: detects bleeding rates as low as 0.1 mL/min for occult LGIB",
      "CT angiography: detects active bleeding >0.5 mL/min; useful for hemodynamically unstable LGIB",
      "Glasgow-Blatchford score: risk stratification for UGIB (score 0 = safe for outpatient management)"
    ],
    management: [
      "Two large-bore IV catheters (16-18 gauge) for rapid volume resuscitation",
      "Aggressive crystalloid resuscitation with isotonic fluids (NS or LR)",
      "Blood transfusion: target hemoglobin >7 g/dL (>9 g/dL for active coronary disease); use massive transfusion protocol if hemorrhagic shock",
      "IV PPI therapy (pantoprazole 80 mg bolus then 8 mg/hr infusion) for suspected peptic ulcer UGIB",
      "Octreotide infusion for suspected variceal bleeding (reduces splanchnic blood flow)",
      "Endoscopic hemostasis: cauterization, clipping, injection, or banding (for varices)",
      "NPO status pending endoscopy",
      "Correct coagulopathy: vitamin K for warfarin, PCC for severe INR elevation, platelet transfusion if <50,000",
      "Interventional radiology: angiographic embolization for failed endoscopic therapy",
      "Surgery: indicated for massive refractory hemorrhage, perforation, or failed endoscopic/radiologic intervention"
    ],
    nursingActions: [
      "Establish two large-bore (16-18 gauge) peripheral IVs immediately upon presentation",
      "Continuous hemodynamic monitoring: HR, BP, MAP, pulse oximetry",
      "Monitor orthostatic vital signs if patient is stable enough: positive orthostatics (HR increase >20 bpm or SBP drop >20 mmHg on standing) indicate >15% blood volume loss",
      "Strict I&O including accurate measurement of blood in emesis and stool",
      "Test stool and emesis for occult blood (guaiac test)",
      "Maintain NPO status and prepare for emergent endoscopy",
      "Administer blood products as prescribed; monitor for transfusion reactions",
      "Position patient on left side with HOB elevated to prevent aspiration from hematemesis",
      "Monitor serial hemoglobin/hematocrit every 4-6 hours",
      "Insert Foley catheter for accurate UOP monitoring; report <0.5 mL/kg/hr"
    ],
    assessmentFindings: [
      "Hematemesis: bright red (active arterial bleeding) or coffee-ground (blood degraded by gastric acid)",
      "Melena: black, tarry, sticky, foul-smelling stool (digested blood from UGIB)",
      "Hematochezia: bright red blood per rectum (LGIB or massive UGIB)",
      "Tachycardia and hypotension (early signs of hemodynamic compromise)",
      "Orthostatic hypotension (positive tilt test)",
      "Cool, clammy, pale skin (peripheral vasoconstriction)",
      "Decreased urine output (<0.5 mL/kg/hr)",
      "Restlessness, anxiety, altered mental status (cerebral hypoperfusion)",
      "Abdominal distension and hyperactive bowel sounds (blood is a GI irritant)"
    ],
    signs: {
      left: [
        "UGIB: hematemesis, coffee-ground emesis",
        "UGIB: melena (black tarry stool)",
        "UGIB: elevated BUN:creatinine ratio",
        "Sources: PUD, varices, Mallory-Weiss"
      ],
      right: [
        "LGIB: hematochezia (bright red blood)",
        "LGIB: typically less hemodynamically significant",
        "LGIB: normal BUN:creatinine ratio",
        "Sources: diverticulosis, angiodysplasia, hemorrhoids"
      ]
    },
    medications: [
      { name: "Pantoprazole IV", type: "Proton pump inhibitor", action: "Irreversibly inhibits H+/K+ ATPase pump, raising gastric pH >6 to stabilize clot formation", sideEffects: "Headache, diarrhea, hypomagnesemia", contra: "PPI allergy", pearl: "UGIB protocol: 80 mg IV bolus then 8 mg/hr continuous infusion for 72 hours; reduces rebleeding after endoscopic hemostasis" },
      { name: "Octreotide", type: "Somatostatin analog", action: "Reduces splanchnic blood flow and portal pressure; decreases gastric acid secretion", sideEffects: "Hyperglycemia, bradycardia, abdominal pain", contra: "Hypersensitivity", pearl: "First-line pharmacotherapy for variceal bleeding: 50 mcg IV bolus then 50 mcg/hr for 3-5 days; give BEFORE endoscopy" },
      { name: "Vasopressin", type: "ADH analog/splanchnic vasoconstrictor", action: "Causes splanchnic vasoconstriction reducing portal blood flow and variceal pressure", sideEffects: "Coronary vasoconstriction, mesenteric ischemia, hyponatremia", contra: "Coronary artery disease, peripheral vascular disease", pearl: "Less preferred than octreotide due to adverse effects; if used, co-administer nitroglycerin to counteract coronary vasoconstriction" },
      { name: "Tranexamic acid", type: "Antifibrinolytic", action: "Inhibits plasminogen activation, stabilizing clots", sideEffects: "Nausea, diarrhea, thrombotic events", contra: "Active thromboembolic disease, DIC", pearl: "HALT-IT trial showed no mortality benefit in GI bleeding; use is controversial and not routinely recommended" }
    ],
    pearls: [
      "The initial hemoglobin may be NORMAL in acute hemorrhage — it takes 24-72 hours for hemodilution to occur; serial monitoring is essential",
      "BUN:creatinine ratio >20:1 is a clue for UGIB — digested blood proteins are absorbed as urea nitrogen",
      "Melena requires only 50-100 mL of blood in the GI tract; it can persist for 3-5 days after bleeding stops",
      "Hematochezia in a hemodynamically UNSTABLE patient should prompt upper GI evaluation — rapid UGIB can present with bright red rectal bleeding",
      "Modified Glasgow-Blatchford score of 0 (normal vitals, normal Hgb, normal BUN, no melena/syncope/liver or heart disease) identifies low-risk patients who may be safely managed as outpatients",
      "NG lavage with coffee-ground or bloody aspirate confirms UGIB; however, a clear aspirate does not exclude a post-pyloric (duodenal) source"
    ],
    quiz: [
      { question: "A client presents with black tarry stools and a BUN of 42 mg/dL with creatinine of 1.0 mg/dL. Where is the most likely source of bleeding?", options: ["Rectal hemorrhoids", "Diverticular bleeding in the sigmoid colon", "Duodenal ulcer", "Anal fissure"], correct: 2, rationale: "Melena (black tarry stool) and an elevated BUN:creatinine ratio of 42:1 (>20:1) strongly indicate UGIB. Digested blood proteins are absorbed in the small intestine and converted to urea, raising the BUN disproportionately to creatinine." },
      { question: "A client with suspected GI bleeding has a hemoglobin of 13.5 g/dL on admission but tachycardia (HR 118) and orthostatic hypotension. Why might the hemoglobin appear normal?", options: ["The patient is not actually bleeding", "Laboratory error", "Hemoconcentration — Hgb has not equilibrated yet with fluid resuscitation", "The patient has polycythemia masking anemia"], correct: 2, rationale: "In acute hemorrhage, the initial hemoglobin may appear normal because both red cells and plasma are lost proportionally. Hemodilution occurs over 24-72 hours as interstitial fluid shifts into the vascular space and IV fluids are administered. Clinical signs (tachycardia, orthostatic changes) are more reliable early indicators." },
      { question: "What is the priority nursing action for a client presenting with massive hematemesis?", options: ["Insert a nasogastric tube for lavage", "Establish two large-bore IV accesses and prepare for transfusion", "Obtain an abdominal X-ray", "Administer oral antacids"], correct: 1, rationale: "The priority in massive GI bleeding is establishing vascular access for fluid resuscitation and blood transfusion. Two large-bore (16-18 gauge) IVs allow rapid volume replacement. Airway protection (left lateral position, possible intubation) is also critical. Endoscopy is the definitive diagnostic and therapeutic intervention." }
    ]
  },

  "bowel-obstruction-patho-rn": {
    title: "Bowel Obstruction: Pathophysiology & Management",
    cellular: {
      title: "Mechanical vs Functional Obstruction",
      content: "Bowel obstruction is classified as mechanical (physical blockage of intestinal lumen) or functional (paralytic ileus — impaired peristalsis without physical blockage). Mechanical small bowel obstruction (SBO) is most commonly caused by adhesions (60%, typically post-surgical), hernias (15%), and tumors (15%). Large bowel obstruction (LBO) is most commonly caused by colorectal cancer (60%), diverticular disease (20%), and volvulus (5%). In mechanical obstruction, accumulated gas and fluid proximal to the obstruction cause bowel distension, which increases intraluminal pressure. This pressure compresses mucosal blood vessels, causing ischemia, bacterial translocation, and potential necrosis and perforation. Third-spacing of fluid into the bowel lumen and peritoneal cavity causes significant intravascular volume depletion and electrolyte imbalances (hypokalemia, hyponatremia, metabolic alkalosis from vomiting in proximal SBO or metabolic acidosis from ischemia). Closed-loop obstruction (both ends of a bowel segment are occluded, as in volvulus or incarcerated hernia) is a surgical emergency due to rapid progression to strangulation and perforation. Paralytic ileus results from temporary inhibition of peristalsis following surgery, electrolyte imbalances (hypokalemia), opioid use, peritonitis, or spinal injury."
    },
    riskFactors: [
      "Previous abdominal surgery (adhesion formation — most common cause of SBO)",
      "Colorectal cancer (most common cause of LBO)",
      "Incarcerated hernia (inguinal, femoral, ventral)",
      "Crohn disease (stricture formation)",
      "Diverticular disease with stricture",
      "Volvulus (sigmoid most common in adults, cecal in younger patients)",
      "Intussusception (most common cause of intestinal obstruction in children 6 months-3 years)",
      "Fecal impaction (common in elderly and immobile patients)",
      "Opioid use (paralytic ileus)",
      "Recent abdominal or pelvic surgery (postoperative ileus)"
    ],
    diagnostics: [
      "Abdominal X-ray (KUB): dilated loops of bowel, air-fluid levels on upright film, absence of gas in rectum (complete obstruction)",
      "CT abdomen/pelvis with contrast: identifies transition point, cause of obstruction, and signs of strangulation (bowel wall thickening, mesenteric haziness, pneumatosis)",
      "CBC: leukocytosis (suggests strangulation or perforation), hemoconcentration",
      "BMP: hypokalemia, hyponatremia, elevated BUN/creatinine (dehydration), metabolic alkalosis (vomiting) or metabolic acidosis (ischemia/necrosis)",
      "Serum lactate: elevated suggests bowel ischemia/strangulation — surgical emergency",
      "Abdominal ultrasound: useful for intussusception in children (target sign)",
      "Water-soluble contrast study (Gastrografin): both diagnostic and therapeutic in partial SBO (osmotic action draws fluid into lumen, stimulates peristalsis)"
    ],
    management: [
      "NPO status to rest the bowel",
      "NG tube decompression: relieves nausea/vomiting, reduces distension and aspiration risk",
      "Aggressive IV fluid resuscitation with isotonic crystalloids to correct dehydration from third-spacing",
      "Electrolyte replacement: potassium, sodium, chloride as indicated",
      "Partial SBO without strangulation: conservative management (NPO, NG, IV fluids) resolves 65-80% of adhesive SBOs",
      "Complete SBO or signs of strangulation: urgent surgical exploration (lysis of adhesions, bowel resection if necrotic)",
      "LBO: surgical decompression, possible colonic stenting for malignant obstruction as bridge to surgery",
      "Volvulus: initial sigmoidoscopic decompression for sigmoid volvulus; surgical intervention for cecal volvulus",
      "Paralytic ileus: treat underlying cause, ambulation, electrolyte correction, minimize opioids; consider alvimopan for postoperative ileus"
    ],
    nursingActions: [
      "Maintain NPO status and NG tube to low intermittent suction; monitor and record output color, amount, and character",
      "Monitor and replace fluid and electrolyte losses: track I&O strictly",
      "Assess bowel sounds in all four quadrants every 4 hours: absent sounds indicate ileus, high-pitched tinkling/rushes indicate mechanical obstruction",
      "Monitor abdominal girth measurements at umbilicus level every 8 hours to track distension",
      "Assess for signs of strangulation: increasing pain, fever, tachycardia, peritoneal signs (rebound, rigidity, guarding)",
      "Position patient in semi-Fowler to reduce diaphragmatic pressure from distension",
      "Provide oral care every 2 hours while NPO and with NG tube in place",
      "Assess and document NG tube placement every shift and before medication administration",
      "Post-surgery: monitor for return of bowel function (flatus, bowel sounds, stool passage)"
    ],
    assessmentFindings: [
      "SBO: crampy, intermittent (colicky) abdominal pain, frequent vomiting (bilious or feculent), abdominal distension",
      "LBO: progressive abdominal distension, constipation/obstipation, late vomiting (feculent), less acute presentation",
      "High-pitched, tinkling bowel sounds proximal to obstruction (mechanical)",
      "Absent bowel sounds (paralytic ileus or late mechanical obstruction)",
      "Abdominal distension and tympany to percussion",
      "Dehydration signs: dry mucous membranes, poor skin turgor, tachycardia, decreased urine output",
      "Signs of strangulation: severe constant pain, fever, peritoneal signs, hemodynamic instability"
    ],
    signs: {
      left: [
        "SBO: vomiting early, distension mild",
        "SBO: adhesions most common cause",
        "SBO: colicky pain",
        "SBO: high-pitched bowel sounds"
      ],
      right: [
        "LBO: distension prominent, vomiting late",
        "LBO: cancer most common cause",
        "LBO: obstipation (no stool or gas)",
        "LBO: risk of perforation higher"
      ]
    },
    medications: [
      { name: "Alvimopan", type: "Peripheral mu-opioid receptor antagonist", action: "Blocks opioid effects on GI tract without affecting central analgesia, accelerating return of bowel function", sideEffects: "Nausea, flatulence, hypokalemia", contra: "Patients on chronic opioids >7 days; GI obstruction", pearl: "FDA-approved only for post-surgical ileus in hospitalized patients; given 30 min-5 hrs before surgery then BID up to 7 days" },
      { name: "Metoclopramide", type: "Dopamine antagonist/prokinetic", action: "Enhances gastric motility and accelerates gastric emptying; antiemetic via CTZ blockade", sideEffects: "Drowsiness, tardive dyskinesia (prolonged use), extrapyramidal symptoms", contra: "Mechanical bowel obstruction, pheochromocytoma, seizure disorder", pearl: "CONTRAINDICATED in mechanical obstruction — increases intraluminal pressure; appropriate only for paralytic ileus or gastroparesis" },
      { name: "Ondansetron", type: "5-HT3 receptor antagonist antiemetic", action: "Blocks serotonin receptors in CTZ and vagal afferents; reduces nausea and vomiting", sideEffects: "Headache, constipation, QT prolongation", contra: "Concomitant apomorphine; caution in patients with QT prolongation", pearl: "Used for symptomatic relief of vomiting in bowel obstruction; does not treat the obstruction itself" }
    ],
    pearls: [
      "Adhesive SBO is the most common surgical emergency — 80% of SBOs are caused by post-surgical adhesions",
      "Feculent vomiting (feces-like odor) indicates prolonged obstruction with bacterial overgrowth — more common in distal SBO and LBO",
      "An obstructed patient who suddenly reports pain relief may indicate bowel perforation — this is an ominous sign requiring immediate surgical evaluation",
      "X-ray pattern: dilated small bowel (>3 cm), dilated large bowel (>6 cm), dilated cecum (>9 cm = perforation risk) — remember the 3-6-9 rule",
      "Gastrografin (water-soluble contrast) given via NG tube is both diagnostic (identifies transition point) and therapeutic (osmotic action promotes resolution of partial SBO)",
      "Never use barium in suspected perforation — free barium in the peritoneum causes severe chemical peritonitis"
    ],
    quiz: [
      { question: "A post-surgical client has absent bowel sounds, abdominal distension, and has not passed flatus for 72 hours. Which type of bowel obstruction does the nurse suspect?", options: ["Mechanical small bowel obstruction from adhesions", "Paralytic ileus", "Volvulus", "Intussusception"], correct: 1, rationale: "Absent bowel sounds, distension, and no flatus post-surgery without colicky pain suggest paralytic ileus — temporary cessation of peristalsis common after abdominal surgery. Mechanical obstruction would present with high-pitched bowel sounds and colicky pain." },
      { question: "A client with bowel obstruction suddenly reports that the pain has stopped and feels better. Vital signs show HR 122, BP 88/56, T 39.1C. What should the nurse suspect?", options: ["Spontaneous resolution of obstruction", "Bowel perforation", "Medication effectiveness", "Anxiety resolution"], correct: 1, rationale: "Sudden pain relief in an obstructed patient with concurrent fever, tachycardia, and hypotension strongly suggests bowel perforation. The pain decreases because intraluminal pressure is released, but peritonitis and sepsis rapidly develop. This is a surgical emergency." },
      { question: "What is the 3-6-9 rule in bowel obstruction?", options: ["Maximum safe diuretic doses", "Normal bowel diameter thresholds: small bowel >3cm, large bowel >6cm, cecum >9cm indicates dilation", "Hours between serial abdominal exams", "Fluid replacement calculation formula"], correct: 1, rationale: "The 3-6-9 rule refers to the maximum normal diameter on abdominal X-ray: small bowel >3 cm, large bowel >6 cm, and cecum >9 cm are considered abnormally dilated. Cecal diameter >9-12 cm carries high risk for perforation." }
    ]
  },

  "ibd-crohns-vs-uc-rn": {
    title: "IBD: Crohn Disease vs Ulcerative Colitis",
    cellular: {
      title: "Transmural vs Mucosal Inflammation",
      content: "Inflammatory bowel disease (IBD) encompasses two chronic, relapsing conditions: Crohn disease (CD) and ulcerative colitis (UC). Crohn disease can affect ANY part of the GI tract from mouth to anus (terminal ileum most common) and involves transmural inflammation (all layers of the bowel wall — mucosa through serosa). This transmural involvement leads to characteristic complications: fistulae (abnormal connections between bowel segments or to skin, bladder, vagina), strictures (fibrotic narrowing from chronic inflammation), and abscess formation. Skip lesions (areas of disease separated by normal bowel) and cobblestone appearance of the mucosa are hallmarks. Non-caseating granulomas are found on biopsy. Ulcerative colitis is limited to the colon and rectum, always involves the rectum (extends proximally in a continuous pattern), and affects only the mucosa and submucosa. UC causes crypt abscesses, pseudopolyps, and a continuous pattern of inflammation without skip lesions. Bloody diarrhea with mucus is the cardinal symptom. Toxic megacolon (colonic dilation >6 cm with systemic toxicity) is a life-threatening complication of UC. Both conditions have extraintestinal manifestations including arthritis, uveitis/iritis, erythema nodosum, pyoderma gangrenosum, primary sclerosing cholangitis (more common in UC), and increased colorectal cancer risk (significantly higher in UC due to continuous mucosal inflammation)."
    },
    riskFactors: [
      "Family history of IBD (strongest risk factor)",
      "Ashkenazi Jewish descent (higher prevalence)",
      "Smoking: increases risk and severity of Crohn disease but is paradoxically protective in UC",
      "Age: bimodal distribution with peaks at 15-30 and 50-70 years",
      "Northern European descent",
      "Urban living and industrialized countries",
      "Prior appendectomy may be protective against UC",
      "NSAID use may trigger flares",
      "History of infectious gastroenteritis"
    ],
    diagnostics: [
      "Colonoscopy with biopsy: gold standard for diagnosis and differentiation",
      "Crohn: skip lesions, cobblestone mucosa, deep linear ulcers, non-caseating granulomas on biopsy",
      "UC: continuous inflammation starting at rectum extending proximally, crypt abscesses, pseudopolyps",
      "CT enterography: identifies Crohn complications (strictures, fistulae, abscesses)",
      "MR enterography: preferred over CT for radiation reduction in young patients with Crohn",
      "Stool studies: calprotectin and lactoferrin (inflammatory markers), C. diff testing to rule out infectious cause",
      "Lab work: CRP, ESR (inflammatory markers), CBC (anemia), albumin (malnutrition), iron studies",
      "pANCA and ASCA: pANCA positive more common in UC; ASCA positive more common in Crohn (neither is diagnostic alone)",
      "Abdominal X-ray: rule out toxic megacolon (colonic dilation >6 cm)"
    ],
    management: [
      "Aminosalicylates (mesalamine/5-ASA): first-line for mild-moderate UC; less effective in Crohn",
      "Corticosteroids (prednisone, budesonide): for acute flares/induction of remission; NOT for maintenance",
      "Immunomodulators (azathioprine, 6-mercaptopurine, methotrexate): steroid-sparing maintenance agents",
      "Biologics: anti-TNF agents (infliximab, adalimumab) for moderate-severe disease; integrin inhibitors (vedolizumab) for UC",
      "Small molecule therapies: tofacitinib (JAK inhibitor) for moderate-severe UC",
      "Antibiotics (metronidazole, ciprofloxacin): for perianal Crohn disease and abscess management",
      "Nutritional support: enteral nutrition preferred; correct vitamin deficiencies (B12, folate, iron, vitamin D)",
      "Surgery for Crohn: resection of diseased segments (NOT curative — disease recurs); strictureplasty for strictures",
      "Surgery for UC: total proctocolectomy with ileal pouch-anal anastomosis (J-pouch) is CURATIVE",
      "Colorectal cancer screening: colonoscopy every 1-2 years starting 8-10 years after diagnosis"
    ],
    nursingActions: [
      "Monitor stool frequency, consistency, volume, and presence of blood or mucus",
      "Assess nutritional status: daily weights, albumin, prealbumin, dietary intake",
      "Administer medications as prescribed and monitor for adverse effects (immunosuppression, liver toxicity)",
      "Assess for extraintestinal manifestations: joint pain, eye inflammation, skin lesions",
      "Monitor for toxic megacolon signs: acute abdominal distension, fever >38.6C, tachycardia, leukocytosis",
      "Provide emotional support — IBD is chronic with significant psychosocial impact on young adults",
      "Educate patient on smoking cessation (especially Crohn — smoking worsens disease and increases surgical recurrence)",
      "Coordinate with dietitian for elimination diets during flares and nutritional supplementation",
      "Pre-biologic therapy: screen for latent TB (PPD/IGRA), hepatitis B, and immunization status"
    ],
    assessmentFindings: [
      "Crohn: RLQ pain (terminal ileum), diarrhea (non-bloody), weight loss, perianal disease (fistulae, skin tags, abscesses)",
      "UC: LLQ pain, bloody diarrhea with mucus, tenesmus (urgency with incomplete evacuation), rectal bleeding",
      "Both: abdominal cramping that worsens with eating, fatigue, fever during flares",
      "Extraintestinal: arthralgias, uveitis, erythema nodosum (tender red nodules on shins), pyoderma gangrenosum",
      "Growth failure in pediatric patients (especially Crohn)",
      "Perianal examination: fistula openings, abscesses, skin tags (Crohn-specific)"
    ],
    signs: {
      left: [
        "Crohn: any GI tract area (mouth to anus)",
        "Crohn: transmural, skip lesions",
        "Crohn: fistulae, strictures, abscesses",
        "Crohn: cobblestone mucosa, granulomas",
        "Crohn: non-bloody diarrhea",
        "Crohn: NOT cured by surgery"
      ],
      right: [
        "UC: colon and rectum only",
        "UC: mucosal only, continuous",
        "UC: toxic megacolon, hemorrhage",
        "UC: crypt abscesses, pseudopolyps",
        "UC: bloody diarrhea with mucus",
        "UC: CURED by proctocolectomy"
      ]
    },
    medications: [
      { name: "Mesalamine (5-ASA)", type: "Aminosalicylate anti-inflammatory", action: "Topical anti-inflammatory action on colonic mucosa; inhibits prostaglandin and leukotriene synthesis", sideEffects: "Headache, nausea, diarrhea, rare interstitial nephritis", contra: "Salicylate allergy, renal impairment", pearl: "First-line for mild-moderate UC (oral and/or rectal); less effective in Crohn disease; monitor renal function annually" },
      { name: "Infliximab", type: "Anti-TNF-alpha monoclonal antibody (biologic)", action: "Neutralizes TNF-alpha, a key pro-inflammatory cytokine driving IBD inflammation", sideEffects: "Infusion reactions, increased infection risk (TB reactivation, opportunistic infections), lymphoma risk (rare)", contra: "Active infection, untreated latent TB, NYHA class III-IV heart failure", pearl: "Screen for latent TB before starting; administer with immunomodulator to reduce antibody formation; given IV at 0, 2, and 6 weeks then every 8 weeks" },
      { name: "Azathioprine", type: "Immunomodulator (purine analog)", action: "Inhibits purine synthesis, suppressing T-cell proliferation and reducing inflammatory response", sideEffects: "Myelosuppression (check TPMT before starting), hepatotoxicity, pancreatitis, nausea", contra: "TPMT deficiency (risk of severe myelosuppression), pregnancy (teratogenic)", pearl: "Check TPMT enzyme level before initiating — deficient patients develop life-threatening myelosuppression; monitor CBC every 3 months" },
      { name: "Budesonide", type: "Locally-acting corticosteroid", action: "Anti-inflammatory with high first-pass metabolism, reducing systemic steroid side effects", sideEffects: "Less than systemic steroids but still: adrenal suppression, hyperglycemia, insomnia", contra: "Systemic fungal infections, concurrent live vaccines", pearl: "Preferred over prednisone for mild-moderate ileal/right-sided Crohn flares — fewer systemic effects; available as oral controlled-release and rectal foam" }
    ],
    pearls: [
      "Key differentiator: Crohn = transmural, skip lesions, any GI location, fistulae; UC = mucosal, continuous from rectum, colon only, bloody diarrhea",
      "Smoking has OPPOSITE effects: worsens Crohn (doubles recurrence after surgery) but is paradoxically protective in UC",
      "Toxic megacolon: colonic dilation >6 cm with systemic toxicity — avoid opioids, anticholinergics, and barium enemas during acute UC flare as they can precipitate this",
      "Total proctocolectomy with J-pouch CURES UC but Crohn disease has no surgical cure (70% recurrence rate after resection)",
      "TPMT testing before azathioprine/6-MP is essential — 1 in 300 patients has complete deficiency and will develop fatal myelosuppression",
      "Colorectal cancer risk increases significantly after 8-10 years of UC; surveillance colonoscopy with biopsies every 1-2 years is standard"
    ],
    quiz: [
      { question: "A client with Crohn disease develops a draining perianal fistula. Which medication does the nurse anticipate?", options: ["Mesalamine enema", "Oral metronidazole", "IV methylprednisolone", "Oral sulfasalazine"], correct: 1, rationale: "Perianal fistulae in Crohn disease are treated with antibiotics (metronidazole +/- ciprofloxacin) as first-line therapy, followed by anti-TNF biologics (infliximab) for complex or refractory fistulae. Mesalamine is primarily for UC. Steroids do not heal fistulae." },
      { question: "Which finding differentiates ulcerative colitis from Crohn disease on colonoscopy?", options: ["Skip lesions with cobblestone appearance", "Continuous inflammation starting at the rectum with crypt abscesses", "Transmural inflammation with granulomas", "Terminal ileum involvement with strictures"], correct: 1, rationale: "UC shows continuous inflammation always starting at the rectum extending proximally, with crypt abscesses and pseudopolyps. Crohn shows skip lesions, cobblestone mucosa, transmural inflammation, and non-caseating granulomas." },
      { question: "Why should opioids be avoided during an acute UC flare?", options: ["They cause hepatotoxicity", "They can precipitate toxic megacolon by slowing colonic motility", "They interfere with mesalamine absorption", "They cause bloody diarrhea"], correct: 1, rationale: "Opioids, anticholinergics, and other drugs that decrease colonic motility can precipitate toxic megacolon during acute UC flares by causing colonic dilation and fecal stasis, worsening inflammation and risking perforation." }
    ]
  },

  "cancer-biology-fundamentals-rn": {
    title: "Cancer Biology Fundamentals",
    cellular: {
      title: "Cell Cycle, Oncogenes & Metastasis",
      content: "Cancer results from uncontrolled cell proliferation caused by accumulated mutations in genes regulating cell growth, differentiation, and apoptosis. The cell cycle consists of G1 (growth and preparation for DNA synthesis), S phase (DNA replication), G2 (preparation for mitosis), and M phase (mitosis and cytokinesis). G0 is a quiescent resting state. Proto-oncogenes are normal genes that promote cell growth; when mutated (activated), they become oncogenes that drive uncontrolled proliferation (e.g., HER2/neu in breast cancer, RAS in pancreatic cancer, BCR-ABL in CML). Tumor suppressor genes normally inhibit cell growth and promote apoptosis; their inactivation removes growth brakes (e.g., p53 'guardian of the genome' mutated in >50% of cancers, BRCA1/2 in hereditary breast/ovarian cancer, Rb in retinoblastoma, APC in familial adenomatous polyposis). The metastatic cascade involves: local invasion (cancer cells produce matrix metalloproteinases that degrade basement membrane), intravasation (entering blood/lymphatic vessels), survival in circulation, extravasation (exiting at distant site), and colonization with angiogenesis (new blood vessel formation via VEGF). Tumor grading (I-IV) reflects cellular differentiation (how abnormal cells look microscopically). Tumor staging (TNM: Tumor size, Nodes, Metastasis) describes anatomic extent and is the most important prognostic factor. Tumor markers (PSA, CA-125, AFP, CEA, CA 19-9) are used for screening, monitoring treatment response, and detecting recurrence — NOT for definitive diagnosis."
    },
    riskFactors: [
      "Tobacco use (lung, bladder, pancreas, head/neck, esophageal cancers)",
      "UV radiation exposure (melanoma, squamous cell, basal cell carcinoma)",
      "Family history and genetic predisposition (BRCA1/2, Lynch syndrome, Li-Fraumeni syndrome)",
      "Chronic viral infections (HPV — cervical; HBV/HCV — hepatocellular; EBV — lymphoma; HIV — Kaposi sarcoma)",
      "Obesity and sedentary lifestyle (breast, colon, endometrial, kidney cancers)",
      "Alcohol use (liver, breast, esophageal, head/neck cancers)",
      "Occupational exposures (asbestos — mesothelioma; benzene — leukemia; vinyl chloride — hepatic angiosarcoma)",
      "Immunosuppression (organ transplant recipients, HIV/AIDS)",
      "Age (most cancers increase with age due to accumulated mutations)",
      "Prior radiation therapy (secondary malignancies)"
    ],
    diagnostics: [
      "Biopsy: definitive diagnosis — histological examination of tissue specimen (excisional, incisional, core needle, FNA)",
      "TNM staging: T (tumor size/extent), N (regional lymph node involvement), M (distant metastasis); determines prognosis and treatment",
      "Tumor grading: Grade I (well-differentiated, least aggressive) to Grade IV (undifferentiated/anaplastic, most aggressive)",
      "Tumor markers: PSA (prostate), CA-125 (ovarian), AFP (liver, testicular), CEA (colorectal), CA 19-9 (pancreatic), beta-hCG (testicular, gestational trophoblastic)",
      "Imaging: CT, MRI, PET-CT (metabolic activity of tumors), bone scan (metastatic disease)",
      "CBC with differential: evaluate for hematologic malignancies, baseline before chemotherapy",
      "LDH: elevated in many cancers; nonspecific marker of cell turnover",
      "Genetic testing: BRCA1/2, Lynch syndrome genes, HER2 amplification, EGFR mutations for targeted therapy"
    ],
    management: [
      "Surgery: primary treatment for solid tumors; may be curative (complete resection with clear margins) or palliative (debulking)",
      "Chemotherapy: systemic treatment targeting rapidly dividing cells; cell-cycle specific (S-phase: antimetabolites; M-phase: vinca alkaloids) and non-specific (alkylating agents, anthracyclines)",
      "Radiation therapy: ionizing radiation to damage cancer cell DNA; external beam or brachytherapy; used for cure, control, or palliation",
      "Targeted therapy: drugs targeting specific molecular abnormalities (trastuzumab for HER2+, imatinib for BCR-ABL+, bevacizumab for VEGF)",
      "Immunotherapy: checkpoint inhibitors (pembrolizumab, nivolumab) that block PD-1/PD-L1, allowing immune system to attack cancer cells",
      "Hormonal therapy: for hormone-receptor-positive cancers (tamoxifen for ER+ breast cancer, leuprolide for prostate cancer)",
      "Bone marrow/stem cell transplant: for hematologic malignancies after high-dose chemotherapy",
      "Palliative care: symptom management, pain control, quality of life for advanced/metastatic disease",
      "Clinical trials: access to novel therapies for refractory disease"
    ],
    nursingActions: [
      "Administer chemotherapy per institutional protocol with appropriate PPE (closed-system transfer devices, double gloving)",
      "Monitor for and manage common chemotherapy side effects: nausea/vomiting (administer antiemetics 30 min before), mucositis, alopecia, fatigue",
      "Monitor CBC regularly: nadir (lowest point) typically occurs 7-14 days after chemotherapy — highest infection risk",
      "Implement neutropenic precautions when ANC <1500/mm3: private room, no fresh flowers/fruits, strict hand hygiene, mask for visitors",
      "Assess for tumor lysis syndrome: hyperkalemia, hyperphosphatemia, hyperuricemia, hypocalcemia within 12-72 hours of treatment",
      "Monitor for extravasation of vesicant chemotherapy agents: stop infusion immediately, aspirate residual drug, apply appropriate antidote",
      "Provide psychosocial support and connect patients with oncology social workers, support groups, and survivorship programs",
      "Educate patients about cancer screening recommendations for early detection",
      "Manage cancer pain using WHO pain ladder: non-opioids, weak opioids, strong opioids with adjuvants"
    ],
    assessmentFindings: [
      "Seven warning signs of cancer (CAUTION): Change in bowel/bladder habits, A sore that does not heal, Unusual bleeding/discharge, Thickening or lump, Indigestion or difficulty swallowing, Obvious change in wart/mole, Nagging cough or hoarseness",
      "Unexplained weight loss (>10% body weight over 6 months)",
      "Persistent fatigue not relieved by rest",
      "Palpable lymphadenopathy (firm, non-tender, fixed nodes)",
      "New or changing skin lesions",
      "Paraneoplastic syndromes: SIADH (small cell lung), hypercalcemia (squamous cell lung, breast), Cushing syndrome (ectopic ACTH)"
    ],
    signs: {
      left: [
        "Oncogenes: promote cell growth (HER2, RAS, BCR-ABL)",
        "Tumor suppressor loss: removes growth brakes (p53, BRCA, Rb)",
        "Grading: cellular differentiation (I-IV)",
        "Tumor markers: monitoring tool, not diagnostic"
      ],
      right: [
        "TNM staging: most important prognostic factor",
        "Metastasis cascade: invasion, intravasation, extravasation, colonization",
        "Angiogenesis: VEGF-driven new blood vessel formation",
        "Apoptosis evasion: hallmark of cancer cells"
      ]
    },
    medications: [
      { name: "Cyclophosphamide", type: "Alkylating agent (cell-cycle non-specific)", action: "Cross-links DNA strands preventing replication; affects all phases of cell cycle", sideEffects: "Myelosuppression, hemorrhagic cystitis, nausea/vomiting, alopecia, secondary malignancies", contra: "Severe myelosuppression, active infection", pearl: "Hemorrhagic cystitis prevention: aggressive hydration, MESNA (uroprotective agent), void frequently; hold if ANC <1500" },
      { name: "Doxorubicin", type: "Anthracycline antibiotic antineoplastic", action: "Intercalates DNA, inhibits topoisomerase II, generates free radicals causing DNA damage", sideEffects: "Cumulative cardiotoxicity (monitor LVEF), myelosuppression, red-colored urine, VESICANT", contra: "Severe cardiac disease, cumulative dose >550 mg/m2 (>450 with chest radiation)", pearl: "VESICANT — causes severe tissue necrosis if extravasated; use dexrazoxane as cardioprotectant; monitor MUGA/echo before and during therapy" },
      { name: "Trastuzumab", type: "Monoclonal antibody (targeted therapy)", action: "Binds HER2 receptor on breast cancer cells, inhibiting proliferation and promoting antibody-dependent cell death", sideEffects: "Cardiotoxicity (LV dysfunction), infusion reactions, pulmonary toxicity", contra: "Severe cardiac dysfunction", pearl: "Only for HER2-positive cancers (20-25% of breast cancers); monitor LVEF every 3 months; do NOT give concurrently with anthracyclines (synergistic cardiotoxicity)" },
      { name: "Ondansetron", type: "5-HT3 receptor antagonist antiemetic", action: "Blocks serotonin receptors in CTZ and GI vagal afferents; prevents chemotherapy-induced nausea and vomiting", sideEffects: "Headache, constipation, QT prolongation", contra: "Concomitant apomorphine", pearl: "Administer 30 minutes before emetogenic chemotherapy; often combined with dexamethasone and NK1 antagonist (aprepitant) for highly emetogenic regimens" }
    ],
    pearls: [
      "p53 is called the 'guardian of the genome' — it stops the cell cycle at G1 to allow DNA repair or triggers apoptosis if damage is irreparable; mutated in >50% of all cancers",
      "Tumor markers are NOT used for screening in the general population (except PSA, controversial) — they are used for monitoring treatment response and detecting recurrence",
      "Chemotherapy nadir: the point of lowest blood cell count, typically 7-14 days post-treatment — this is when infection risk is highest",
      "Vesicant extravasation: STOP infusion, aspirate residual drug, apply antidote (dexrazoxane for anthracyclines, hyaluronidase for vinca alkaloids); NEVER flush the line",
      "Cancer staging (TNM) determines prognosis and treatment plan; cancer grading reflects aggressiveness of the individual tumor cells",
      "Two-hit hypothesis (Knudson): tumor suppressor genes require BOTH alleles to be inactivated (two 'hits') before losing function — explains why hereditary cancers occur earlier (one hit is inherited)"
    ],
    quiz: [
      { question: "A nurse is reviewing a pathology report showing a Grade III, Stage IIB breast tumor. Which classification gives the most prognostic information?", options: ["Grade III", "Stage IIB", "Both provide equal information", "Neither is prognostic"], correct: 1, rationale: "Stage (TNM) is the most important prognostic factor in cancer because it describes the anatomic extent of disease (tumor size, lymph node involvement, distant metastasis). Grading reflects cellular differentiation and aggressiveness but staging determines treatment and survival outcomes." },
      { question: "During chemotherapy administration, the nurse notices swelling and redness at the IV site. The chemotherapy is a vesicant. What is the priority action?", options: ["Flush the IV with normal saline", "Stop the infusion immediately and aspirate residual drug", "Apply a warm compress and continue at a slower rate", "Elevate the extremity and continue monitoring"], correct: 1, rationale: "Vesicant extravasation can cause severe tissue necrosis. The priority is to STOP the infusion immediately, aspirate as much drug as possible through the IV catheter, and apply the appropriate antidote. NEVER flush — it disperses the vesicant into surrounding tissue." },
      { question: "A patient's absolute neutrophil count (ANC) is 800/mm3. What nursing intervention is most important?", options: ["Encourage a diet rich in fresh fruits and vegetables", "Implement neutropenic precautions including private room and no fresh flowers", "Administer aspirin for fever prevention", "Increase physical activity to stimulate bone marrow"], correct: 1, rationale: "An ANC <1000/mm3 indicates severe neutropenia with high infection risk. Neutropenic precautions include private room, strict hand hygiene, no fresh flowers/fruits (harbor mold and bacteria), cooked foods only, limit visitors, and monitor for subtle signs of infection (fever may be the only sign)." }
    ]
  },

  "oncologic-emergencies-rn": {
    title: "Oncologic Emergencies",
    cellular: {
      title: "Tumor Lysis, SVC Syndrome & Spinal Cord Compression",
      content: "Oncologic emergencies are life-threatening complications arising from cancer or its treatment that require immediate recognition and intervention. Tumor lysis syndrome (TLS) occurs when rapid cancer cell destruction (typically after chemotherapy for hematologic malignancies) releases intracellular contents: potassium (hyperkalemia causing cardiac arrhythmias), phosphate (hyperphosphatemia causing calcium-phosphate crystal deposition and hypocalcemia), uric acid (hyperuricemia causing acute kidney injury from crystal nephropathy), and nucleic acids. The metabolic triad is hyperkalemia + hyperphosphatemia + hyperuricemia with resultant hypocalcemia. Superior vena cava (SVC) syndrome results from compression or thrombosis of the SVC, most commonly by lung cancer (especially small cell) or lymphoma. Impaired venous drainage from the upper body causes facial/neck/upper extremity edema, JVD, dyspnea, and cough. It can progress to cerebral edema and airway compromise. Spinal cord compression occurs when tumors (commonly breast, lung, prostate metastases) compress the spinal cord, causing back pain, motor weakness, sensory loss, and bowel/bladder dysfunction. This is a neurologic emergency — permanent paralysis results if not treated within 24-48 hours. Hypercalcemia of malignancy occurs in 10-30% of advanced cancers through PTHrP secretion (squamous cell carcinomas), osteolytic bone destruction (multiple myeloma, breast cancer), or ectopic calcitriol production (lymphoma)."
    },
    riskFactors: [
      "TLS: high tumor burden, rapidly proliferating cancers (Burkitt lymphoma, ALL, AML with high WBC), pre-existing renal impairment, dehydration",
      "SVC syndrome: mediastinal tumors (lung cancer, lymphoma), central venous catheter-related thrombosis",
      "Spinal cord compression: cancers with bone metastasis predilection (breast, lung, prostate, multiple myeloma, renal cell)",
      "Hypercalcemia: squamous cell carcinomas (PTHrP), breast cancer, multiple myeloma, renal cell carcinoma",
      "Initiation of chemotherapy or radiation therapy for rapidly growing tumors",
      "DIC: acute promyelocytic leukemia, metastatic adenocarcinoma, sepsis in immunocompromised patients"
    ],
    diagnostics: [
      "TLS labs: serum potassium (>6 mEq/L critical), phosphorus (elevated), uric acid (>8 mg/dL), calcium (low), BUN/creatinine (AKI), LDH (cell destruction)",
      "Continuous cardiac monitoring: hyperkalemia causes peaked T waves, widened QRS, V-fib",
      "SVC syndrome: CT chest with contrast (identifies mass and thrombus), CXR (mediastinal widening)",
      "Spinal cord compression: MRI of entire spine (gold standard), plain X-rays may show vertebral body destruction",
      "Hypercalcemia: total and ionized calcium, PTH, PTHrP, vitamin D levels, serum phosphorus",
      "ECG: shortened QT in hypercalcemia, peaked T waves in hyperkalemia",
      "Coagulation panel: DIC shows prolonged PT/PTT, low fibrinogen, elevated D-dimer, thrombocytopenia"
    ],
    management: [
      "TLS prevention: aggressive IV hydration (3 L/m2/day), allopurinol (prevents uric acid formation), rasburicase (breaks down existing uric acid — contraindicated in G6PD deficiency)",
      "TLS treatment: IV hydration, cardiac monitoring, correct hyperkalemia emergently (calcium gluconate, insulin/glucose, kayexalate), phosphate binders, hemodialysis if refractory",
      "SVC syndrome: radiation therapy (most cases), endovascular stenting for acute symptoms, corticosteroids for lymphoma/edema, chemotherapy for SCLC",
      "Spinal cord compression: high-dose dexamethasone (10 mg IV bolus then 4 mg q6h), radiation therapy to the tumor, surgical decompression for spinal instability or radiation-resistant tumors",
      "Hypercalcemia: aggressive IV NS hydration (200-500 mL/hr), IV bisphosphonates (zoledronic acid 4 mg over 15 min), calcitonin (rapid onset bridge), denosumab for bisphosphonate-refractory cases",
      "DIC: treat underlying cause, blood product replacement (FFP, cryoprecipitate for fibrinogen <100, platelets), heparin in select cases"
    ],
    nursingActions: [
      "TLS: monitor strict I&O, maintain UOP >2 mL/kg/hr with aggressive hydration, check electrolytes every 4-6 hours for 72 hours post-chemotherapy",
      "TLS: have emergency cardiac drugs at bedside: calcium gluconate, insulin/D50, sodium bicarbonate",
      "SVC syndrome: elevate HOB >45 degrees, avoid upper extremity venipuncture/BP measurement, monitor for airway compromise and neurologic changes",
      "Spinal cord compression: perform neurological assessment every 2-4 hours (motor strength, sensation, reflexes, bladder function), strict bed rest until spine is stabilized",
      "Spinal cord compression: document baseline neurological status immediately — deterioration is a surgical emergency",
      "Hypercalcemia: maintain hydration, encourage mobility (immobility worsens bone resorption), monitor cardiac rhythm, assess for lethargy and confusion",
      "Monitor for DIC: assess all puncture sites for oozing, check for petechiae, ecchymoses, hematuria, and melena",
      "Provide emotional support — oncologic emergencies are frightening and may indicate disease progression"
    ],
    assessmentFindings: [
      "TLS: nausea, vomiting, lethargy, muscle cramps/tetany (hypocalcemia), cardiac arrhythmias (hyperkalemia), oliguria (AKI)",
      "SVC syndrome: facial and periorbital edema (worse in morning/supine), neck and upper extremity swelling, JVD, dyspnea, cough, Pemberton sign (facial plethora with arm elevation)",
      "Spinal cord compression: severe back pain (worst at night), progressive motor weakness (upper vs lower motor neuron), sensory loss below compression level, urinary retention then overflow incontinence",
      "Hypercalcemia: 'stones, bones, groans, and psychiatric overtones' — renal calculi, bone pain, abdominal pain/constipation, confusion/lethargy/coma",
      "DIC: simultaneous bleeding (petechiae, oozing, hemorrhage) and thrombosis (digital ischemia, organ failure)"
    ],
    signs: {
      left: [
        "TLS: K+ up, PO4 up, uric acid up, Ca2+ down",
        "SVC syndrome: facial/neck edema, JVD, dyspnea",
        "Spinal cord compression: back pain, motor weakness"
      ],
      right: [
        "Hypercalcemia: stones, bones, groans, psych overtones",
        "DIC: simultaneous bleeding and clotting",
        "All require IMMEDIATE intervention"
      ]
    },
    medications: [
      { name: "Rasburicase", type: "Recombinant urate oxidase", action: "Converts uric acid to allantoin (highly soluble, easily excreted), rapidly reducing uric acid levels", sideEffects: "Methemoglobinemia, hemolytic anemia in G6PD deficiency, anaphylaxis", contra: "G6PD deficiency (causes severe hemolysis), pregnancy", pearl: "Works within 4 hours vs allopurinol which takes days; must process blood samples on ice (rasburicase continues to degrade uric acid ex vivo causing falsely low levels)" },
      { name: "Dexamethasone (high-dose)", type: "Corticosteroid", action: "Reduces peritumoral edema and inflammation; lympholytic for lymphoma causing SVC syndrome", sideEffects: "Hyperglycemia, immunosuppression, GI bleeding, insomnia, psychosis", contra: "Active untreated infection", pearl: "For spinal cord compression: 10 mg IV bolus then 4 mg q6h; for SVC syndrome from lymphoma: can cause dramatic tumor shrinkage and symptom relief within hours" },
      { name: "Zoledronic acid", type: "IV bisphosphonate", action: "Inhibits osteoclast-mediated bone resorption, lowering serum calcium", sideEffects: "Fever, myalgias, hypocalcemia, osteonecrosis of jaw (rare), renal impairment", contra: "CrCl <35 mL/min, pregnancy", pearl: "Onset 2-4 days, peak effect 4-7 days; calcitonin is used as bridge for rapid onset; hydration must be initiated before bisphosphonate" },
      { name: "Calcium gluconate (10%)", type: "Electrolyte replacement / cardiac membrane stabilizer", action: "Stabilizes cardiac myocyte membranes against effects of hyperkalemia; does NOT lower potassium", sideEffects: "Bradycardia, tissue necrosis if extravasated, cardiac arrest with digoxin", contra: "Digoxin toxicity (can precipitate fatal arrhythmia), hypercalcemia", pearl: "Given IV over 2-5 minutes for symptomatic hyperkalemia or ECG changes; temporizing measure — must also lower potassium with insulin/glucose, kayexalate, or dialysis" }
    ],
    pearls: [
      "TLS triad: hyperkalemia + hyperphosphatemia + hyperuricemia with secondary hypocalcemia — remember the 3 HIGHs and 1 LOW",
      "Rasburicase is contraindicated in G6PD deficiency — screen African American, Mediterranean, and Southeast Asian patients before administering",
      "Spinal cord compression is a 24-48 hour emergency: 'time is function' — once paraplegia is established, it is usually irreversible",
      "Hypercalcemia mnemonic: 'Stones (kidney), Bones (pain, fractures), Groans (abdominal pain, constipation), Psychiatric Overtones (confusion, lethargy, coma)'",
      "SVC syndrome: NEVER start IV access or take BP in the upper extremities — impaired venous drainage causes inaccurate readings and increases extravasation risk",
      "For acute TLS with hyperkalemia showing ECG changes: first give calcium gluconate (cardiac protection), then insulin/dextrose (shifts K+ intracellularly), then treat the underlying cause"
    ],
    quiz: [
      { question: "A client with Burkitt lymphoma begins chemotherapy. Twenty-four hours later, labs show: K+ 6.8, PO4 7.2, uric acid 14, Ca2+ 6.9. Which oncologic emergency does the nurse recognize?", options: ["Superior vena cava syndrome", "Tumor lysis syndrome", "Hypercalcemia of malignancy", "Spinal cord compression"], correct: 1, rationale: "The classic TLS electrolyte pattern: hyperkalemia, hyperphosphatemia, hyperuricemia, and hypocalcemia. This occurs from rapid lysis of tumor cells releasing intracellular contents. Burkitt lymphoma is highly susceptible to TLS due to its extremely rapid doubling time." },
      { question: "A client with lung cancer develops progressive facial swelling, JVD, and dyspnea. The nurse avoids taking blood pressure on which extremity?", options: ["Right leg", "Left leg", "Either upper extremity", "It does not matter"], correct: 2, rationale: "SVC syndrome impairs venous drainage from the upper body. BP measurement and venipuncture in the upper extremities should be avoided because impaired venous return causes inaccurate readings and increased risk of extravasation and edema. Use lower extremities for IV access and monitoring." },
      { question: "A client with metastatic prostate cancer reports new-onset severe back pain and difficulty walking. The nurse notes bilateral lower extremity weakness and urinary retention. What is the priority nursing action?", options: ["Administer oral analgesics and reassess in 1 hour", "Notify the provider immediately for emergent MRI and dexamethasone administration", "Apply a heating pad to the lower back", "Encourage ambulation to prevent deconditioning"], correct: 1, rationale: "Back pain with progressive motor weakness and bladder dysfunction in a patient with known cancer strongly suggests spinal cord compression. This is a neurological emergency requiring immediate MRI, high-dose dexamethasone, and radiation therapy or surgery. Delay risks permanent paralysis." }
    ]
  },

  "neutropenic-precautions-rn": {
    title: "Neutropenic Precautions & Febrile Neutropenia",
    cellular: {
      title: "ANC Calculation & Infection Risk",
      content: "Neutropenia is defined as an absolute neutrophil count (ANC) below 1500/mm3, with severe neutropenia below 500/mm3 and profound neutropenia below 100/mm3. ANC is calculated: ANC = WBC x (% segmented neutrophils + % bands) / 100. Neutrophils are the body's primary defense against bacterial and fungal infections. When ANC falls below 500/mm3, the risk of serious infection rises dramatically, and below 100/mm3, the risk is extremely high with potential for life-threatening sepsis within hours. Chemotherapy-induced neutropenia is the most common cause in oncology patients. The nadir (lowest ANC) typically occurs 7-14 days after chemotherapy, though this varies by agent. Febrile neutropenia is defined as a single oral temperature >=38.3C (101F) or sustained temperature >=38.0C (100.4F) for one hour in a patient with ANC <500/mm3 (or expected to decrease below 500 within 48 hours). This is a medical emergency requiring blood cultures and empiric broad-spectrum antibiotics within 60 minutes of presentation — delays in antibiotic administration increase mortality. The MASCC (Multinational Association for Supportive Care in Cancer) risk score stratifies patients into low-risk (outpatient management possible) and high-risk (inpatient IV antibiotics required). Colony-stimulating factors (G-CSF: filgrastim; GM-CSF: sargramostim) stimulate granulopoiesis in the bone marrow, shortening the duration and severity of neutropenia."
    },
    riskFactors: [
      "Myelosuppressive chemotherapy (alkylating agents, anthracyclines, taxanes)",
      "Radiation therapy to large bone marrow-bearing areas (pelvis, sternum, vertebrae)",
      "Hematologic malignancies (leukemia, lymphoma, myelodysplastic syndromes)",
      "Bone marrow transplant recipients during engraftment period",
      "Pre-existing bone marrow compromise or prior chemotherapy cycles",
      "Advanced age (>65 years) with chemotherapy",
      "Poor nutritional status and performance status",
      "Prior episodes of febrile neutropenia",
      "Comorbidities: renal impairment, hepatic dysfunction, HIV/AIDS"
    ],
    diagnostics: [
      "CBC with differential: ANC calculation (WBC x [%segs + %bands] / 100)",
      "Blood cultures: at least 2 sets (aerobic and anaerobic) from different sites; draw from central line AND peripheral vein if central access present",
      "Urinalysis and urine culture",
      "Chest X-ray: evaluate for pneumonia (may have minimal infiltrates due to inability to mount inflammatory response)",
      "Sputum culture if productive cough present",
      "Wound cultures if skin breakdown present",
      "Lactate level: elevated suggests sepsis",
      "CRP and procalcitonin: trending markers of infection/response to treatment",
      "CT imaging: consider for occult abscess, typhlitis (neutropenic enterocolitis), invasive fungal infection",
      "Galactomannan and beta-D-glucan assays: screening for invasive aspergillosis and other fungal infections in prolonged neutropenia"
    ],
    management: [
      "Empiric broad-spectrum antibiotics within 60 minutes of febrile neutropenia recognition: anti-pseudomonal beta-lactam (cefepime, piperacillin-tazobactam, or meropenem)",
      "Add vancomycin for: suspected catheter-related infection, skin/soft tissue infection, hemodynamic instability, or known MRSA colonization",
      "Antifungal therapy: add empirically if fever persists >4-7 days despite antibiotics (voriconazole for aspergillosis, micafungin for candidiasis)",
      "Continue antibiotics until ANC >500/mm3 and afebrile for 48 hours",
      "G-CSF (filgrastim, pegfilgrastim): administer 24-72 hours after chemotherapy for primary prophylaxis if regimen has >20% febrile neutropenia risk",
      "Low-risk febrile neutropenia (MASCC score >=21): may be managed with oral antibiotics (ciprofloxacin + amoxicillin-clavulanate) in select outpatients",
      "Dose reduction or delay of subsequent chemotherapy cycles if recurrent febrile neutropenia",
      "Transfuse platelets if <10,000/mm3 (or <20,000 with bleeding/fever)"
    ],
    nursingActions: [
      "Calculate ANC from CBC results and report values <1500 to the provider immediately",
      "Implement neutropenic precautions when ANC <1500: private room (positive-pressure HEPA filtration for stem cell transplant patients)",
      "Strict hand hygiene: single most important infection prevention measure",
      "No fresh flowers, plants, fruits, or vegetables in patient room (harbor Aspergillus and other organisms)",
      "Cooked foods only; avoid raw meat, unpasteurized dairy, soft cheeses, raw eggs",
      "Limit visitors; screen all visitors for illness; visitors and staff must wear masks",
      "Avoid rectal temperatures, suppositories, enemas, and unnecessary invasive procedures",
      "Perform meticulous skin and oral assessment every shift: infection in neutropenic patients may present WITHOUT typical inflammatory signs (no pus, no erythema, no swelling)",
      "Administer filgrastim subcutaneously as prescribed; do not give within 24 hours of chemotherapy",
      "Monitor temperature every 4 hours; instruct patient to report ANY fever immediately — do not use antipyretics prophylactically as they may mask fever",
      "Draw blood cultures promptly when fever develops — do NOT delay antibiotics waiting for culture results"
    ],
    assessmentFindings: [
      "Fever: may be the ONLY sign of infection in neutropenic patients (classic signs of infection require neutrophils to produce inflammatory response)",
      "Subtle signs: malaise, fatigue, chills, tachycardia, hypotension without obvious infection source",
      "Oral mucositis: breakdown of oral mucosa from chemotherapy provides entry point for bacteria",
      "Perianal area: redness, tenderness, or swelling (avoid rectal exams — can introduce bacteria)",
      "Central line exit site: redness, drainage, tenderness suggesting catheter-related infection",
      "Pulmonary: cough, dyspnea — chest X-ray may appear normal due to absent neutrophilic infiltrate",
      "GI: abdominal pain especially RLQ (typhlitis/neutropenic enterocolitis)"
    ],
    signs: [
      "ANC <500: severe neutropenia — high infection risk",
      "ANC <100: profound neutropenia — critical infection risk",
      "Fever >=38.3C with ANC <500: febrile neutropenia — medical emergency",
      "Nadir: 7-14 days post-chemotherapy — peak vulnerability",
      "Absence of classic infection signs: neutrophils needed for pus, swelling, erythema"
    ],
    medications: [
      { name: "Filgrastim (G-CSF)", type: "Colony-stimulating factor", action: "Stimulates bone marrow production of neutrophils by binding to G-CSF receptors on granulocyte precursors", sideEffects: "Bone pain (most common — from marrow expansion), splenic rupture (rare), leukocytosis", contra: "Hypersensitivity to E. coli-derived proteins", pearl: "Give 24-72 hours AFTER chemotherapy (not during — chemo destroys rapidly dividing cells including stimulated precursors); bone pain managed with acetaminophen or loratadine" },
      { name: "Pegfilgrastim", type: "Long-acting G-CSF", action: "Same mechanism as filgrastim but pegylation extends half-life to allow single-dose per chemotherapy cycle", sideEffects: "Same as filgrastim: bone pain, splenic rupture risk", contra: "Same as filgrastim; do not give 14 days before through 24 hours after chemotherapy", pearl: "Single subcutaneous injection per chemotherapy cycle (vs daily filgrastim); do NOT use in acute myeloid leukemia — can stimulate blast proliferation" },
      { name: "Cefepime", type: "Fourth-generation cephalosporin", action: "Anti-pseudomonal beta-lactam with broad gram-negative and gram-positive coverage", sideEffects: "Neurotoxicity (seizures, encephalopathy — especially in renal impairment), rash, diarrhea, C. diff", contra: "Cephalosporin/penicillin allergy (cross-reactivity)", pearl: "First-line empiric monotherapy for febrile neutropenia; must be dose-adjusted for renal function; administer within 60 minutes of fever" },
      { name: "Voriconazole", type: "Triazole antifungal", action: "Inhibits fungal cytochrome P450-dependent 14-alpha-lanosterol demethylase, disrupting ergosterol synthesis", sideEffects: "Visual disturbances (photopsia), hepatotoxicity, photosensitivity, QT prolongation", contra: "Coadministration with rifampin, carbamazepine, or long-acting barbiturates (reduce voriconazole levels); severe hepatic impairment", pearl: "First-line for invasive aspergillosis; monitor trough levels (target 1-5 mcg/mL); warn patients about transient visual changes (flashing lights, blurred vision)" }
    ],
    pearls: [
      "ANC calculation: WBC x (% segs + % bands) / 100. Example: WBC 2,000, segs 30%, bands 5% => ANC = 2000 x 0.35 = 700 (severe neutropenia)",
      "Fever may be the ONLY sign of life-threatening infection in neutropenic patients — classic signs (pus, erythema, swelling) require neutrophils for the inflammatory response",
      "Blood cultures and empiric antibiotics within 60 MINUTES — 'time to antibiotics' directly impacts mortality in febrile neutropenia",
      "Do NOT use rectal thermometers, suppositories, or enemas in neutropenic patients — mucosal disruption can introduce bacteria directly into the bloodstream",
      "Filgrastim causes bone pain because it stimulates rapid expansion of bone marrow — this is actually a therapeutic effect indicating it is working",
      "Febrile neutropenia mortality ranges from 5% (low-risk) to 30% (high-risk with complications) — early recognition and treatment are critical"
    ],
    quiz: [
      { question: "A client's CBC shows: WBC 1,800, segmented neutrophils 25%, bands 3%. What is the ANC and what action should the nurse take?", options: ["ANC = 504; implement neutropenic precautions", "ANC = 1,800; no precautions needed", "ANC = 2,500; standard care", "ANC = 450; transfer to ICU immediately"], correct: 0, rationale: "ANC = WBC x (% segs + % bands) / 100 = 1800 x (25 + 3) / 100 = 1800 x 0.28 = 504. ANC <500 is severe neutropenia. Implement neutropenic precautions: private room, hand hygiene, no fresh flowers/fruits, cooked food only, limit visitors." },
      { question: "A neutropenic client develops a temperature of 38.5C. What is the FIRST nursing action?", options: ["Administer acetaminophen and recheck in 1 hour", "Draw blood cultures and notify the provider for STAT antibiotic orders", "Apply cooling blankets", "Increase IV fluid rate and monitor"], correct: 1, rationale: "Febrile neutropenia is a medical emergency. The first actions are drawing at least 2 sets of blood cultures and notifying the provider for immediate empiric broad-spectrum antibiotics. Goal is antibiotics within 60 minutes. Do NOT give antipyretics before cultures — they mask fever." },
      { question: "When should filgrastim (G-CSF) be administered in relation to chemotherapy?", options: ["During chemotherapy infusion", "24-72 hours after chemotherapy completion", "24 hours before chemotherapy", "Only when ANC drops below 100"], correct: 1, rationale: "Filgrastim stimulates rapid neutrophil precursor proliferation in bone marrow. If given during or immediately after chemotherapy, these rapidly dividing precursors would be destroyed by the cytotoxic agents. Wait 24-72 hours after chemotherapy for optimal effect." }
    ]
  },

  "pediatric-respiratory-distress-rn": {
    title: "Pediatric Respiratory Distress: Croup, Epiglottitis & Bronchiolitis",
    cellular: {
      title: "Pediatric Airway Anatomy & Pathology",
      content: "Pediatric airways differ significantly from adult airways, making children more vulnerable to respiratory distress. The pediatric airway is shorter, narrower, and more compliant. The larynx is higher (C3-C4 vs C4-C6 in adults) and more anterior. The epiglottis is omega-shaped and angled differently. Crucially, the narrowest point is at the cricoid cartilage (subglottic area) rather than the glottis as in adults. Per Poiseuille's law, airway resistance is inversely proportional to the radius to the fourth power — even 1 mm of mucosal edema in a pediatric airway can reduce cross-sectional area by 50-75%, dramatically increasing work of breathing. Croup (laryngotracheobronchitis) is caused primarily by parainfluenza virus (types 1 and 3), causing subglottic edema and the characteristic barky (seal-like) cough and inspiratory stridor. The steeple sign on neck X-ray shows subglottic narrowing. Epiglottitis is a bacterial infection (historically H. influenzae type b, now more commonly S. aureus, S. pneumoniae, and Group A Strep due to Hib vaccination) causing rapid, severe swelling of the epiglottis and supraglottic structures. This is a true airway emergency — the thumbprint sign on lateral neck X-ray shows the swollen epiglottis. Bronchiolitis is a lower airway disease (bronchioles) caused primarily by respiratory syncytial virus (RSV), causing bronchiolar edema, mucus plugging, and air trapping. It is the most common lower respiratory tract infection in infants <1 year, peaking at 2-6 months."
    },
    riskFactors: [
      "Croup: age 6 months to 3 years (peak incidence), fall/winter seasons, parainfluenza virus exposure",
      "Epiglottitis: incomplete or absent Hib vaccination, age 2-6 years (bacterial), adults (H. influenzae, S. aureus)",
      "Bronchiolitis: age <1 year (especially <6 months), RSV exposure, premature birth (<37 weeks), congenital heart disease, chronic lung disease (BPD), immunodeficiency",
      "All: daycare attendance, crowded living conditions, secondhand smoke exposure",
      "Anatomical factors: infants are obligate nose breathers, smaller airway diameter, less cartilaginous support"
    ],
    diagnostics: [
      "Croup: clinical diagnosis; AP neck X-ray shows steeple sign (subglottic narrowing); Westley croup score for severity assessment",
      "Epiglottitis: lateral neck X-ray shows thumbprint sign (swollen epiglottis); DO NOT attempt direct visualization of pharynx unless prepared for emergent intubation",
      "Bronchiolitis: primarily clinical diagnosis; nasal swab for RSV antigen testing (rapid test); chest X-ray shows hyperinflation and peribronchial thickening",
      "Pulse oximetry: continuous monitoring in all cases (SpO2 <92% indicates need for oxygen supplementation)",
      "Blood gas: only in severe respiratory distress; respiratory acidosis indicates impending respiratory failure",
      "CBC: may show leukocytosis in bacterial epiglottitis; typically normal or mild lymphocytosis in viral croup and bronchiolitis"
    ],
    management: [
      "Croup: cool mist humidification, oral dexamethasone 0.6 mg/kg (single dose — reduces edema within 6 hours), nebulized racemic epinephrine for moderate-severe stridor at rest (observe 2-4 hours for rebound)",
      "Epiglottitis: AIRWAY MANAGEMENT IS PRIORITY — do not agitate the child, allow position of comfort, prepare for emergent intubation or tracheostomy, IV antibiotics (ceftriaxone or ampicillin-sulbactam)",
      "Bronchiolitis: supportive care is the mainstay — nasal suctioning (bulb syringe), supplemental oxygen to maintain SpO2 >90%, adequate hydration (IV or NG if unable to feed)",
      "Bronchiolitis: hypertonic saline (3%) nebulization may improve mucociliary clearance in hospitalized patients",
      "Palivizumab (Synagis): RSV immunoprophylaxis for high-risk infants (preterm <29 weeks, CHD, chronic lung disease) during RSV season",
      "Heliox (helium-oxygen mixture): may reduce work of breathing in severe croup by improving laminar flow through narrowed airway",
      "All: minimize procedures that increase agitation — crying worsens airway obstruction"
    ],
    nursingActions: [
      "Assess respiratory status continuously: rate, depth, effort, retractions (subcostal, intercostal, suprasternal), nasal flaring, grunting, head bobbing",
      "Monitor SpO2 continuously; report sustained SpO2 <92%",
      "For croup: position upright in parent's lap, provide cool mist, keep child calm — agitation worsens stridor",
      "For epiglottitis: DO NOT examine the throat, DO NOT lay the child down, DO NOT attempt oral suctioning — any agitation can cause complete airway obstruction",
      "For epiglottitis: keep emergency intubation equipment, tracheostomy tray, and crash cart at bedside; allow child to assume position of comfort (tripod position)",
      "For bronchiolitis: perform gentle nasal suctioning before feeds and as needed; position HOB elevated at 30 degrees",
      "Maintain hydration: monitor I&O, assess for dehydration (decreased tears, sunken fontanel, decreased wet diapers)",
      "Educate parents on signs of respiratory deterioration requiring immediate medical attention",
      "Contact isolation for RSV: gown and gloves, meticulous hand hygiene, dedicated equipment"
    ],
    assessmentFindings: [
      "Croup: barky (seal-like) cough, inspiratory stridor (worse at night and with agitation), hoarseness, low-grade fever, gradual onset over 1-2 days",
      "Epiglottitis: abrupt onset, high fever (>39C), severe sore throat, drooling (unable to swallow), muffled voice, tripod positioning, anxious appearance, absence of spontaneous cough",
      "Bronchiolitis: rhinorrhea, wheezing, fine crackles, tachypnea, subcostal/intercostal retractions, poor feeding, low-grade fever, apnea in young infants",
      "Classic 4 D's of epiglottitis: Dysphagia, Drooling, Distress, Dysphonia",
      "Signs of impending respiratory failure in all: altered level of consciousness, decreasing respiratory effort (exhaustion), cyanosis, bradycardia"
    ],
    signs: {
      left: [
        "Croup: barky cough, steeple sign",
        "Croup: gradual onset, viral",
        "Croup: inspiratory stridor",
        "Croup: age 6 months to 3 years"
      ],
      right: [
        "Epiglottitis: 4 D's, thumbprint sign",
        "Epiglottitis: abrupt onset, bacterial",
        "Epiglottitis: drooling, tripod position",
        "Bronchiolitis: RSV, wheezing, <1 year"
      ]
    },
    medications: [
      { name: "Dexamethasone", type: "Corticosteroid", action: "Reduces subglottic mucosal edema in croup via anti-inflammatory action", sideEffects: "Hyperglycemia, immunosuppression (minimal with single dose), behavioral changes", contra: "Active untreated infection (relative); benefits outweigh risks in croup", pearl: "Single dose of 0.6 mg/kg PO/IM (max 10 mg) is the standard for croup — onset 6 hours, duration 24-36 hours; effective even for mild croup" },
      { name: "Racemic epinephrine", type: "Alpha and beta adrenergic agonist (nebulized)", action: "Causes mucosal vasoconstriction reducing subglottic edema; onset within minutes", sideEffects: "Tachycardia, tremor, rebound edema (2-4 hours after administration)", contra: "Use with caution in children with cardiac conditions", pearl: "Used for moderate-severe croup with stridor at rest; MUST observe for 2-4 hours after administration for rebound worsening; can repeat every 15-20 minutes for severe cases" },
      { name: "Palivizumab (Synagis)", type: "Monoclonal antibody (RSV prophylaxis)", action: "Binds RSV F-protein, preventing viral entry into respiratory epithelial cells", sideEffects: "Injection site reaction, fever, rash", contra: "History of severe reaction to prior dose", pearl: "Given IM monthly during RSV season (November-March) to eligible high-risk infants; PROPHYLAXIS only — does not treat active RSV infection" },
      { name: "Ceftriaxone", type: "Third-generation cephalosporin", action: "Broad-spectrum bactericidal activity against common epiglottitis pathogens (H. influenzae, S. pneumoniae, GAS)", sideEffects: "Diarrhea, rash, biliary sludging", contra: "Cephalosporin allergy; do not mix with calcium-containing solutions in neonates", pearl: "First-line IV antibiotic for epiglottitis; given after airway is secured; continue for 7-10 days" }
    ],
    pearls: [
      "Poiseuille's law: 1 mm of edema in a 4 mm pediatric airway reduces cross-sectional area by 75% vs only 19% in an 8 mm adult airway — small changes have enormous impact in children",
      "NEVER examine the throat of a child with suspected epiglottitis — tongue blade or laryngoscopy can trigger complete airway obstruction and laryngospasm",
      "The classic differentiation: Croup = barky cough, stridor, gradual onset; Epiglottitis = drooling, dysphagia, distress, sudden onset; Bronchiolitis = wheezing, crackles, RSV in infant",
      "Racemic epinephrine rebound: symptoms may worsen 2-4 hours after nebulization as the vasoconstrictive effect wears off — observe patient before considering discharge",
      "RSV bronchiolitis: bronchodilators (albuterol) are generally NOT recommended by AAP guidelines — no evidence of benefit and may cause adverse effects in infants",
      "The tripod position (sitting upright, leaning forward, chin thrust out) is the child's instinctive posture to maximize airway opening — DO NOT force the child to lie down"
    ],
    quiz: [
      { question: "A 2-year-old presents with a barky cough, inspiratory stridor, and hoarseness that started gradually over 2 days. Temperature is 38.2C. What does the nurse suspect?", options: ["Epiglottitis", "Croup", "Bronchiolitis", "Foreign body aspiration"], correct: 1, rationale: "Barky (seal-like) cough, inspiratory stridor, hoarseness, gradual onset, and low-grade fever in a toddler are classic for croup (laryngotracheobronchitis). Epiglottitis has abrupt onset with high fever and drooling. Bronchiolitis presents with wheezing in infants. Foreign body aspiration has sudden onset." },
      { question: "A child with suspected epiglottitis is drooling, sitting in tripod position, and has a high fever. What should the nurse avoid doing?", options: ["Providing supplemental oxygen", "Allowing the parent to hold the child", "Examining the child's throat with a tongue depressor", "Keeping emergency airway equipment at bedside"], correct: 2, rationale: "NEVER examine the throat of a child with suspected epiglottitis. Using a tongue depressor or attempting direct visualization can trigger laryngospasm and complete airway obstruction. Keep the child calm in the parent's arms, prepare for emergent intubation, and allow only controlled visualization in the OR." },
      { question: "A 4-month-old infant with RSV bronchiolitis has nasal flaring, subcostal retractions, and SpO2 of 88%. What is the priority nursing intervention?", options: ["Administer albuterol nebulizer", "Apply supplemental oxygen to maintain SpO2 >90%", "Perform deep suctioning of the trachea", "Administer IV corticosteroids"], correct: 1, rationale: "The priority is supplemental oxygen to maintain SpO2 >90%. AAP guidelines for bronchiolitis do NOT recommend routine bronchodilators (albuterol) or corticosteroids — they show no benefit and may cause adverse effects. Nasal suctioning and hydration support are the other mainstays of treatment." }
    ]
  },

  "pediatric-fluid-electrolyte-rn": {
    title: "Pediatric Fluid & Electrolyte Management",
    cellular: {
      title: "Weight-Based Calculations & Dehydration",
      content: "Pediatric fluid and electrolyte management differs fundamentally from adult management due to children's higher metabolic rate, greater body surface area-to-weight ratio, higher total body water percentage (75-80% in newborns vs 60% in adults), and immature renal concentrating ability. These factors make children more susceptible to fluid imbalances and more rapid progression to dehydration. Maintenance fluid requirements are calculated using the Holliday-Segar method: 100 mL/kg/day for the first 10 kg, 50 mL/kg/day for the next 10 kg, and 20 mL/kg/day for each kg above 20 kg. The equivalent hourly rate is the 4-2-1 rule: 4 mL/kg/hr for first 10 kg, 2 mL/kg/hr for next 10 kg, 1 mL/kg/hr for each kg above 20 kg. Dehydration is classified as mild (3-5% body weight loss in infants, 3% in adolescents), moderate (6-9% in infants), and severe (>=10% in infants). Isotonic dehydration (proportional loss of water and sodium) is most common (80% of cases). Hypotonic dehydration (greater sodium than water loss) leads to intracellular edema and is more hemodynamically dangerous. Hypertonic dehydration (greater water than sodium loss) causes intracellular dehydration and neurological symptoms and requires SLOW correction to prevent cerebral edema. Pediatric electrolyte ranges differ: potassium is normally slightly higher in neonates (3.5-6.0 mEq/L) and serum sodium normal range is the same as adults (135-145 mEq/L) but neonates are less able to concentrate urine."
    },
    riskFactors: [
      "Gastroenteritis with vomiting and diarrhea (most common cause of dehydration in children)",
      "Younger age (infants have higher fluid turnover relative to body weight)",
      "Fever (increases insensible losses by 12% per degree Celsius above 37C)",
      "Burns (significant evaporative losses)",
      "Diabetic ketoacidosis (osmotic diuresis)",
      "Pyloric stenosis (persistent vomiting causing hypochloremic metabolic alkalosis)",
      "Inadequate fluid intake (poor feeding, developmental disability)",
      "Cystic fibrosis (excessive sodium and chloride losses in sweat)",
      "Renal disease (inability to concentrate urine)",
      "High-output ostomies or drains"
    ],
    diagnostics: [
      "Accurate body weight: most reliable measure of fluid status in children; compare to recent known weight to calculate percentage of dehydration",
      "Serum electrolytes: sodium, potassium, chloride, bicarbonate, BUN, creatinine, glucose",
      "Serum osmolality: helps classify dehydration type (isotonic 275-295, hypotonic <275, hypertonic >295)",
      "BUN:creatinine ratio: >20:1 suggests prerenal azotemia from dehydration",
      "Urinalysis: specific gravity >1.030 indicates concentrated urine (dehydration); presence of ketones",
      "Blood gas: metabolic acidosis (bicarbonate <18 mEq/L) common in moderate-severe dehydration",
      "Urine output monitoring: <1 mL/kg/hr in infants and <0.5 mL/kg/hr in children indicates inadequate perfusion",
      "Clinical assessment: capillary refill time, skin turgor, mucous membranes, tears, fontanel status (anterior fontanel)"
    ],
    management: [
      "Mild dehydration (3-5%): oral rehydration therapy (ORT) with commercial oral rehydration solutions (Pedialyte); NOT juices, sports drinks, or plain water",
      "Moderate dehydration (6-9%): ORT if tolerated; IV NS or LR bolus 20 mL/kg over 20-30 minutes if oral route fails; reassess and repeat bolus as needed",
      "Severe dehydration (>=10%): emergent IV NS or LR 20 mL/kg bolus; may need 2-3 boluses; transition to maintenance + deficit replacement over 24 hours",
      "Maintenance fluid calculation (Holliday-Segar): 100/50/20 rule per day or 4/2/1 rule per hour",
      "Deficit replacement: calculate fluid deficit (% dehydration x weight in kg x 10 = mL deficit); replace over 24 hours (isotonic) or 48 hours (hypertonic dehydration)",
      "Hypertonic dehydration: correct sodium slowly (no more than 0.5 mEq/L/hr or 10-12 mEq/L/24 hours) to prevent cerebral edema",
      "Potassium replacement: add KCl to maintenance fluids ONLY after urine output is established (typically 20-40 mEq/L)",
      "DKA fluid management: 10-20 mL/kg NS bolus initially; then 1.5x maintenance over 24-48 hours; avoid rapid correction to prevent cerebral edema"
    ],
    nursingActions: [
      "Obtain accurate daily weights at the same time, on the same scale, with the same clothing — 1 kg weight loss = 1 L fluid loss",
      "Calculate and administer maintenance fluids using the Holliday-Segar method; verify calculations with a second nurse",
      "Strict I&O including weighing diapers (1 gram = 1 mL); count wet diapers (infants: minimum 6-8 per day when hydrated)",
      "Assess dehydration clinical signs: anterior fontanel (sunken = dehydration), skin turgor (tenting), mucous membranes (dry = dehydration), tears (absent = moderate-severe), capillary refill (>2 seconds = poor perfusion)",
      "Monitor serum electrolytes every 4-6 hours during active rehydration and report abnormalities",
      "Use infusion pumps for ALL pediatric IV fluids — free-flow or gravity infusion can cause fatal fluid overload",
      "Assess IV site hourly in pediatric patients — infiltration can occur rapidly; use smallest appropriate catheter",
      "Reintroduce oral fluids gradually: small frequent amounts (5-10 mL every 5-10 minutes) using ORS; BRAT diet (bananas, rice, applesauce, toast) for advancing diet after vomiting subsides",
      "Educate parents on ORT at home: give 10 mL/kg of ORS after each loose stool; avoid sugary drinks"
    ],
    assessmentFindings: [
      "Mild dehydration: slightly dry mucous membranes, slightly decreased urine output, mildly increased thirst",
      "Moderate dehydration: sunken fontanel, sunken eyes, absent tears, decreased skin turgor, tachycardia, dry mucous membranes, decreased urine output",
      "Severe dehydration: very sunken fontanel, markedly sunken eyes, absent tears, tenting skin turgor, tachycardia with weak/thready pulse, hypotension, very decreased/absent urine output, lethargy/altered mental status, mottled skin",
      "Overhydration (fluid overload): weight gain, periorbital/peripheral edema, full/bulging fontanel, crackles, hepatomegaly, tachypnea"
    ],
    signs: {
      left: [
        "Holliday-Segar: 100/50/20 mL/kg/day",
        "4/2/1 rule: mL/kg/hour",
        "Mild: 3-5% weight loss",
        "Moderate: 6-9% weight loss"
      ],
      right: [
        "Severe: >=10% weight loss",
        "1 kg weight change = 1 L fluid",
        "Sunken fontanel = dehydration",
        "Bulging fontanel = overhydration"
      ]
    },
    medications: [
      { name: "Oral Rehydration Solution (ORS/Pedialyte)", type: "Electrolyte replacement solution", action: "Contains optimal sodium-glucose ratio to maximize intestinal water absorption via sodium-glucose cotransporter (SGLT1)", sideEffects: "Vomiting if given too rapidly", contra: "Severe dehydration requiring IV access, protracted vomiting, ileus", pearl: "WHO formula: Na 75 mEq/L, glucose 75 mmol/L; give 50-100 mL/kg over 4 hours for mild-moderate dehydration; avoid apple juice and sports drinks (high osmolality worsens diarrhea)" },
      { name: "Normal saline (0.9% NaCl)", type: "Isotonic crystalloid", action: "Volume expansion matching extracellular fluid osmolality", sideEffects: "Hyperchloremic metabolic acidosis with large volumes, fluid overload", contra: "Hypernatremia (relative — use with caution), fluid overload", pearl: "Standard bolus for pediatric dehydration: 20 mL/kg over 20-30 minutes; may repeat up to 60 mL/kg total; switch to maintenance fluid (D5 0.45% NS) after resuscitation" },
      { name: "Potassium chloride (IV)", type: "Electrolyte replacement", action: "Replaces potassium losses from vomiting, diarrhea, and diuresis", sideEffects: "Cardiac arrhythmias (rapid infusion), pain at IV site, hyperkalemia", contra: "Anuria, hyperkalemia, untreated Addison disease", pearl: "NEVER give IV KCl until urine output is established (kidneys are primary excretory route); max concentration 40 mEq/L peripherally; max rate 0.5 mEq/kg/hr; always use infusion pump" }
    ],
    pearls: [
      "Holliday-Segar maintenance fluid calculation: 100 mL/kg for first 10 kg + 50 mL/kg for next 10 kg + 20 mL/kg for each kg >20. Example: 25 kg child = (10x100) + (10x50) + (5x20) = 1000 + 500 + 100 = 1600 mL/day",
      "The 4-2-1 rule for hourly rate: 4 mL/kg/hr for first 10 kg + 2 mL/kg/hr for next 10 kg + 1 mL/kg/hr for >20 kg. Same 25 kg child: 40 + 20 + 5 = 65 mL/hr",
      "NEVER add potassium to IV fluids until the child has urinated — kidneys must be functioning to prevent fatal hyperkalemia",
      "Anterior fontanel: sunken = dehydration, flat = normal, bulging = overhydration or increased ICP; closes by 12-18 months",
      "Hypertonic dehydration: correct sodium SLOWLY (max 10-12 mEq/L per 24 hours) to prevent cerebral edema from rapid osmotic shifts",
      "Pediatric DKA: avoid aggressive fluid resuscitation — cerebral edema is the leading cause of DKA-related death in children; use 10-20 mL/kg bolus (not 60 mL/kg)"
    ],
    quiz: [
      { question: "Calculate the maintenance IV fluid rate for a 15 kg child using the 4-2-1 rule.", options: ["40 mL/hr", "50 mL/hr", "60 mL/hr", "65 mL/hr"], correct: 1, rationale: "4-2-1 rule: 4 mL/kg/hr for first 10 kg = 40 mL/hr + 2 mL/kg/hr for next 5 kg = 10 mL/hr. Total = 50 mL/hr." },
      { question: "An infant's anterior fontanel is sunken and skin turgor shows tenting. The infant has had 3 wet diapers in the past 12 hours. What level of dehydration does the nurse assess?", options: ["Mild (3-5%)", "Moderate (6-9%)", "Severe (>=10%)", "Normal hydration"], correct: 1, rationale: "Sunken fontanel, tenting skin turgor, and decreased urine output (3 wet diapers in 12 hours is reduced from the normal 6-8) indicate moderate dehydration. Severe dehydration would show absent tears, altered mental status, and very decreased or absent urine output." },
      { question: "A child is being rehydrated for hypertonic dehydration with a serum sodium of 162 mEq/L. Why must the nurse correct the sodium slowly?", options: ["Rapid correction causes renal failure", "Rapid correction causes cerebral edema from osmotic fluid shifts into brain cells", "Rapid correction causes cardiac arrhythmias", "Slow correction is not necessary for hypertonic dehydration"], correct: 1, rationale: "In hypertonic dehydration, brain cells have accumulated idiogenic osmoles to maintain intracellular volume. Rapid lowering of serum sodium causes water to rush into brain cells (down the osmotic gradient), causing cerebral edema, seizures, and potentially death. Correct no faster than 0.5 mEq/L/hr." }
    ]
  },

  "low-cardiac-output-peds-rn": {
    title: "Low Cardiac Output Syndrome in Pediatric Patients",
    cellular: {
      title: "Postoperative Cardiac Complications in Children",
      content: "Low cardiac output syndrome (LCOS) is a clinical state of inadequate systemic oxygen delivery occurring in 25% of children within the first 6-18 hours after cardiac surgery. Cardiac output (CO) equals heart rate (HR) x stroke volume (SV), and stroke volume depends on preload, afterload, and contractility. In the postoperative pediatric cardiac patient, multiple factors reduce CO: myocardial stunning from cardiopulmonary bypass (inflammatory cascade, ischemia-reperfusion injury), residual structural lesions, arrhythmias, tamponade, increased afterload from hypothermia-induced vasoconstriction, and changes in preload from bleeding or third-spacing. Neonates and infants are particularly vulnerable because their myocardium has fewer contractile elements, limited ability to increase stroke volume (relatively non-compliant ventricles), and primary dependence on heart rate to augment cardiac output. Children compensate for low CO through tachycardia and peripheral vasoconstriction (maintaining blood pressure until late decompensation). Therefore, hypotension is a LATE and ominous sign in pediatric patients — tachycardia, poor perfusion, oliguria, metabolic acidosis, and rising lactate are earlier indicators. Inotropic support (milrinone, epinephrine, dopamine) targets improved contractility and optimized preload/afterload. Milrinone is particularly valuable because it provides inotropy AND reduces afterload (lusitropy), which is beneficial in the stiff, post-bypass myocardium."
    },
    riskFactors: [
      "Prolonged cardiopulmonary bypass time (>120 minutes increases inflammatory response and myocardial stunning)",
      "Aortic cross-clamp time (ischemia-reperfusion injury)",
      "Neonatal and infant age (immature myocardium with limited cardiac reserve)",
      "Complex cardiac repairs (Norwood procedure, arterial switch, Fontan)",
      "Pre-existing ventricular dysfunction",
      "Residual structural defects (residual VSD, valve regurgitation)",
      "Postoperative arrhythmias (JET, complete heart block)",
      "Hypothermia causing increased SVR",
      "Cardiac tamponade from mediastinal bleeding",
      "Pulmonary hypertension (right heart failure)"
    ],
    diagnostics: [
      "Continuous hemodynamic monitoring: arterial line (BP), CVP, left atrial pressure (if available)",
      "Mixed venous oxygen saturation (SvO2): <60% indicates inadequate oxygen delivery",
      "Serum lactate: rising lactate indicates tissue hypoperfusion (>2 mmol/L concerning, >4 mmol/L critical)",
      "Near-infrared spectroscopy (NIRS): continuous cerebral and renal tissue oxygenation monitoring",
      "Echocardiography: assess ventricular function, pericardial effusion, residual lesions, valve function",
      "ECG/continuous telemetry: identify arrhythmias (junctional ectopic tachycardia most common post-cardiac surgery arrhythmia in children)",
      "ABG: metabolic acidosis (base deficit) reflects tissue hypoperfusion",
      "Chest X-ray: assess heart size (enlarging silhouette may indicate tamponade), pleural effusions, pulmonary edema",
      "UOP monitoring: <1 mL/kg/hr in infants indicates inadequate renal perfusion"
    ],
    management: [
      "Volume optimization: crystalloid or colloid boluses (5-10 mL/kg) guided by CVP, atrial pressures, and clinical response",
      "Inotropic support: milrinone (first-line for LCOS — positive inotropy + vasodilation reducing afterload), epinephrine (for more severe low CO), dopamine (low-dose for renal perfusion)",
      "Afterload reduction: milrinone, nitroprusside, or nicardipine to reduce SVR in patients with high afterload",
      "Rate optimization: maintain age-appropriate heart rate; temporary pacing for bradycardia or heart block; treat JET with cooling and amiodarone",
      "Mechanical ventilation optimization: minimize intrathoracic pressure effects on preload; optimize PEEP",
      "Temperature management: active warming to 36.5-37.0C (hypothermia increases SVR and myocardial oxygen demand)",
      "Surgical re-exploration: if tamponade suspected (falling BP, rising CVP/JVD, decreased chest tube output suddenly), or if significant residual lesion identified",
      "ECMO (extracorporeal membrane oxygenation): rescue therapy for refractory LCOS not responding to maximal medical therapy"
    ],
    nursingActions: [
      "Continuous hemodynamic monitoring with trending of HR, BP, CVP, oxygen saturations, and NIRS values",
      "Monitor chest tube output: >3 mL/kg/hr for 3 consecutive hours may indicate surgical bleeding requiring re-exploration",
      "Measure and trend serum lactate every 2-4 hours: rising lactate is the earliest indicator of inadequate tissue perfusion",
      "Strict I&O with hourly UOP calculation: report <1 mL/kg/hr in infants, <0.5 mL/kg/hr in older children",
      "Assess peripheral perfusion: capillary refill time, skin temperature (cool extremities), core-peripheral temperature gap (>2C gap indicates vasoconstriction)",
      "Administer inotropes via central line using infusion pumps; verify weight-based dosing calculations",
      "Monitor for cardiac tamponade: sudden decrease in chest tube drainage (tube may be occluded by clot), hypotension, tachycardia, narrow pulse pressure, muffled heart sounds",
      "Maintain normothermia: use warming blankets, warm IV fluids, monitor core temperature continuously",
      "Minimize unnecessary stimulation: cluster nursing care, provide adequate sedation and pain management",
      "Have emergency equipment at bedside: defibrillator, pacing equipment, intubation supplies, ECMO team contact information"
    ],
    assessmentFindings: [
      "Tachycardia: earliest compensatory sign (heart rate-dependent cardiac output in infants)",
      "Poor peripheral perfusion: cool extremities, mottled skin, prolonged capillary refill (>3 seconds), weak peripheral pulses",
      "Decreased urine output: <1 mL/kg/hr indicates renal hypoperfusion",
      "Rising lactate and base deficit on ABG (metabolic acidosis from anaerobic metabolism)",
      "Widening core-to-peripheral temperature gradient",
      "Altered mental status: irritability progressing to lethargy",
      "Hypotension: LATE sign in children — by the time BP drops, 25-30% of blood volume may be lost",
      "Decreased mixed venous oxygen saturation (SvO2 <60%)",
      "Signs of cardiac tamponade: sudden decrease in chest tube drainage, JVD, muffled heart sounds, pulsus paradoxus"
    ],
    signs: [
      "CO = HR x SV — infants depend on HR more than SV",
      "Tachycardia is the first compensatory mechanism in children",
      "Hypotension is a LATE sign — indicates decompensation",
      "Rising lactate: earliest lab indicator of tissue hypoperfusion",
      "LCOS window: typically 6-18 hours post-cardiac surgery",
      "Core-peripheral temp gap >2C indicates vasoconstriction and poor perfusion"
    ],
    medications: [
      { name: "Milrinone", type: "Phosphodiesterase-3 inhibitor (inodilator)", action: "Increases cAMP in myocardium (positive inotropy) and vascular smooth muscle (vasodilation/reduced afterload)", sideEffects: "Hypotension (from vasodilation), thrombocytopenia, arrhythmias", contra: "Severe aortic/pulmonic stenosis (afterload reduction dangerous), hypovolemia", pearl: "First-line for pediatric LCOS; loading dose 50 mcg/kg over 30-60 min then 0.25-0.75 mcg/kg/min infusion; unique advantage of reducing afterload without increasing myocardial oxygen demand" },
      { name: "Epinephrine", type: "Catecholamine (alpha and beta agonist)", action: "Low dose (0.01-0.05 mcg/kg/min): beta effects predominate (increased HR and contractility); high dose (>0.1 mcg/kg/min): alpha effects predominate (vasoconstriction)", sideEffects: "Tachycardia, arrhythmias, myocardial ischemia, hyperglycemia, lactic acidosis at high doses", contra: "Hypovolemia (correct volume first)", pearl: "Second-line after milrinone for LCOS; escalating doses indicate worsening CO; monitor closely for tachyarrhythmias and rising lactate at high doses" },
      { name: "Dopamine", type: "Catecholamine precursor", action: "Dose-dependent: low (1-5 mcg/kg/min) renal/mesenteric vasodilation; moderate (5-10) positive inotropy; high (>10) vasoconstriction", sideEffects: "Tachycardia, arrhythmias, tissue necrosis if extravasated", contra: "Pheochromocytoma, uncorrected tachyarrhythmias", pearl: "Central line preferred for infusion; if peripheral, use largest vein available and monitor site closely; extravasation treated with phentolamine infiltration" }
    ],
    pearls: [
      "In pediatric cardiac patients: 'when in doubt about cardiac output, measure the lactate' — rising lactate is the most sensitive early indicator of inadequate tissue perfusion",
      "Children maintain blood pressure through compensatory tachycardia and vasoconstriction until 25-30% of blood volume is lost — hypotension is PRE-ARREST in children",
      "The LCOS window (6-18 hours post-cardiac surgery) is the period of highest risk — cardiac output typically reaches its nadir around 8-12 hours postoperatively",
      "JET (junctional ectopic tachycardia) is the most common post-cardiac surgery arrhythmia in children — it causes loss of AV synchrony and reduces cardiac output; treated with cooling to 35C and amiodarone",
      "Milrinone is the preferred inotrope in LCOS because it reduces afterload (unlike dobutamine or epinephrine), which is beneficial for the stunned, stiff post-bypass myocardium",
      "A sudden cessation of chest tube drainage in a postoperative cardiac patient should raise immediate concern for tamponade — clot may be occluding the tube while blood accumulates in the pericardium"
    ],
    quiz: [
      { question: "A 6-month-old is 12 hours post-cardiac surgery. The nurse notes HR 180, BP 72/45, capillary refill 5 seconds, cool extremities, and UOP 0.5 mL/kg/hr. Lactate is 5.2 mmol/L. What does the nurse suspect?", options: ["Normal postoperative recovery", "Low cardiac output syndrome", "Sepsis", "Dehydration"], correct: 1, rationale: "Tachycardia, borderline low BP, poor perfusion (prolonged cap refill, cool extremities), decreased UOP, and elevated lactate at 12 hours post-cardiac surgery are classic for LCOS. The timing (6-18 hour window) and constellation of findings are diagnostic." },
      { question: "Why is hypotension considered a late and ominous sign in pediatric patients?", options: ["Children have lower baseline blood pressures", "Children compensate with tachycardia and vasoconstriction, maintaining BP until 25-30% blood volume is lost", "Blood pressure monitors are inaccurate in children", "Children do not develop hypotension"], correct: 1, rationale: "Pediatric patients have powerful compensatory mechanisms (tachycardia, peripheral vasoconstriction) that maintain blood pressure even with significant volume depletion. By the time hypotension occurs, the child has exhausted compensatory reserves and is approaching cardiovascular collapse." },
      { question: "A postoperative cardiac infant has been draining 5 mL/hr from chest tubes. Drainage suddenly stops, and the infant develops tachycardia, hypotension, and muffled heart sounds. What complication does the nurse suspect?", options: ["Pneumothorax", "Cardiac tamponade", "Hypovolemia", "Pulmonary embolism"], correct: 1, rationale: "Sudden cessation of chest tube drainage with hemodynamic deterioration (tachycardia, hypotension, muffled heart sounds) indicates cardiac tamponade. A blood clot likely occluded the chest tube while blood continued to accumulate in the pericardium, compressing the heart and impairing filling." }
    ]
  },

  "pediatric-seizures-neuro-rn": {
    title: "Pediatric Seizures & Neurologic Emergencies",
    cellular: {
      title: "Febrile Seizures & Status Epilepticus",
      content: "Seizures in children result from abnormal, excessive, synchronous neuronal discharge in the brain. Febrile seizures are the most common seizure type in children, occurring in 2-5% of children aged 6 months to 5 years during febrile illness (temperature typically >38.3C/101F). They are classified as simple (generalized tonic-clonic, <15 minutes, single episode per illness, no focal features) or complex (focal onset, >15 minutes, recurrent within 24 hours, or Todd paralysis). Simple febrile seizures have an excellent prognosis with no increased risk of epilepsy; complex febrile seizures carry a slightly increased risk. The pathophysiology involves immature thermoregulatory mechanisms and increased neuronal excitability during rapid temperature elevation — the RATE of temperature rise matters more than the absolute temperature. Status epilepticus is a neurological emergency defined as continuous seizure activity lasting >5 minutes or two or more seizures without return to baseline consciousness. In children, status epilepticus causes progressive metabolic acidosis, hyperthermia, rhabdomyolysis, and eventually neuronal injury from excitotoxicity (excessive glutamate release causing calcium influx, mitochondrial failure, and cell death). Time is critical: the longer the seizure lasts, the more resistant it becomes to treatment (due to GABA receptor internalization and glutamate receptor upregulation). Developmental considerations are essential — infants may present with subtle seizures (eye deviation, lip smacking, bicycling movements) rather than classic tonic-clonic activity. Neonatal seizures are almost always symptomatic of underlying pathology (hypoxic-ischemic encephalopathy, intracranial hemorrhage, infection, metabolic disturbances)."
    },
    riskFactors: [
      "Febrile seizures: age 6 months to 5 years, family history of febrile seizures, high fever (rate of rise more important than peak), viral illness (HHV-6 roseola, influenza)",
      "Status epilepticus: known epilepsy with subtherapeutic anticonvulsant levels, acute brain insult (meningitis, encephalitis, trauma, stroke), electrolyte abnormalities, ingestion/poisoning",
      "Neonatal seizures: hypoxic-ischemic encephalopathy (most common cause), intracranial hemorrhage, meningitis, hypoglycemia, hypocalcemia, inborn errors of metabolism",
      "Epilepsy risk factors: brain malformations, perinatal injury, CNS infection, head trauma, genetic syndromes",
      "Medication non-adherence or abrupt anticonvulsant withdrawal"
    ],
    diagnostics: [
      "Fingerstick glucose: immediate bedside test — hypoglycemia is a treatable cause of seizures in all ages",
      "Temperature: assess for febrile seizure; identify and treat infection",
      "Serum electrolytes: sodium, calcium, magnesium, glucose, BUN/creatinine",
      "Anticonvulsant drug levels: if on chronic therapy (phenytoin, valproic acid, carbamazepine, phenobarbital)",
      "CBC, blood cultures: if infection suspected",
      "Lumbar puncture: indicated for febrile seizures in <6 months (rule out meningitis), immunocompromised, or clinical suspicion of CNS infection; contraindicated with increased ICP",
      "EEG (electroencephalography): standard for seizure characterization; urgent in status epilepticus and refractory seizures",
      "Neuroimaging: CT (emergent — rule out hemorrhage, hydrocephalus) or MRI (definitive — structural abnormalities, mesial temporal sclerosis)",
      "Toxicology screen: if ingestion suspected"
    ],
    management: [
      "Febrile seizure acute management: position safely on side, protect from injury, do not restrain or place objects in mouth, time the seizure",
      "Simple febrile seizures: treat the fever source, antipyretics for comfort (do NOT prevent future febrile seizures), parental education and reassurance",
      "Status epilepticus protocol (time-based): 0-5 min: stabilize ABCs, check glucose, IV/IO access; 5-20 min: benzodiazepine (IV lorazepam 0.1 mg/kg or IM midazolam 0.2 mg/kg); 20-40 min: second-line agent (fosphenytoin 20 PE/kg IV or levetiracetam 40-60 mg/kg IV); >40 min: third-line (phenobarbital or propofol/midazolam infusion with intubation)",
      "Rectal diazepam (Diastat): prescribed for home use in children with known epilepsy and history of prolonged seizures",
      "Maintenance anticonvulsant therapy: indicated for epilepsy diagnosis (2+ unprovoked seizures); NOT indicated for simple febrile seizures",
      "Refractory status epilepticus: ICU admission, continuous EEG monitoring, anesthetic infusions (propofol, midazolam, or pentobarbital)"
    ],
    nursingActions: [
      "During seizure: maintain airway (position on side/recovery position), do NOT insert anything into the mouth, pad side rails, remove hazardous objects, suction as needed after seizure ends",
      "Time the seizure: document onset, duration, type of movements, body parts involved, pupil response, incontinence, and postictal state",
      "Maintain oxygen delivery via blow-by or mask; have bag-valve-mask ready for apnea",
      "Establish IV access (if possible during seizure) for medication administration; if no IV, administer IM midazolam or rectal diazepam",
      "Check fingerstick glucose immediately — administer D10W 2-5 mL/kg for neonates or D25W 2 mL/kg for infants/children if hypoglycemic",
      "Postictal: maintain side-lying position, monitor respirations closely (especially after benzodiazepine administration), assess neurological status at frequent intervals",
      "Monitor for respiratory depression after benzodiazepine administration — have flumazenil available (reversal agent) but use cautiously in seizure patients",
      "Document detailed seizure description for EEG correlation: aura, onset location, progression, eye deviation, automatisms, duration, postictal state",
      "Educate parents: seizure first aid, when to call 911 (seizure >5 min, breathing difficulty, injury, first seizure), medication administration (rectal diazepam), seizure precautions"
    ],
    assessmentFindings: [
      "Tonic phase: sudden loss of consciousness, muscle rigidity, may cry out, falls, may have apnea and cyanosis",
      "Clonic phase: rhythmic jerking of extremities, may have incontinence, frothing at mouth",
      "Postictal phase: drowsiness, confusion, headache, may last minutes to hours",
      "Febrile seizure: occurs with rapid rise in temperature, generalized tonic-clonic in simple type",
      "Infantile seizures: may be subtle — eye deviation, lip smacking, bicycling movements, apnea",
      "Status epilepticus: continuous seizure activity >5 minutes without return to consciousness",
      "Todd paralysis: transient focal weakness following seizure (may mimic stroke)"
    ],
    signs: {
      left: [
        "Simple febrile: <15 min, generalized, single, no focal signs",
        "Complex febrile: >15 min, focal, recurrent, or Todd paralysis",
        "Status epilepticus: >5 min continuous seizure"
      ],
      right: [
        "Neonatal seizures: subtle, always investigate underlying cause",
        "Postictal: drowsiness, confusion, weakness (Todd paralysis)",
        "ALWAYS check glucose first"
      ]
    },
    medications: [
      { name: "Lorazepam", type: "Benzodiazepine (first-line for status epilepticus)", action: "Enhances GABA-A receptor activity, inhibiting neuronal excitability and terminating seizure", sideEffects: "Respiratory depression, sedation, hypotension", contra: "Severe respiratory depression, acute narrow-angle glaucoma", pearl: "IV lorazepam 0.1 mg/kg (max 4 mg/dose); onset 2-3 minutes IV; can repeat once in 5-10 minutes; monitor respiratory status closely — have bag-valve-mask ready" },
      { name: "Midazolam", type: "Benzodiazepine (IM/intranasal route)", action: "Same GABA-A enhancement as lorazepam; water-soluble formulation allows IM/IN administration", sideEffects: "Respiratory depression, sedation, paradoxical agitation in children", contra: "Severe respiratory insufficiency", pearl: "IM midazolam 0.2 mg/kg (max 10 mg) is first-line when IV access is not available — RAMPART trial showed IM midazolam was as effective as IV lorazepam; intranasal route (0.2 mg/kg) is another option" },
      { name: "Levetiracetam", type: "Anticonvulsant (SV2A modulator)", action: "Binds synaptic vesicle protein SV2A, modulating neurotransmitter release; exact antiepileptic mechanism not fully understood", sideEffects: "Irritability ('Keppra rage' in children), drowsiness, dizziness", contra: "Hypersensitivity", pearl: "Increasingly used as second-line in pediatric status epilepticus (40-60 mg/kg IV); fewer drug interactions than phenytoin; no cardiac monitoring required; watch for behavioral side effects in children" },
      { name: "Rectal diazepam (Diastat)", type: "Benzodiazepine (rescue medication for home use)", action: "GABA-A receptor agonist providing rapid seizure termination via rectal mucosa absorption", sideEffects: "Respiratory depression, sedation, rectal irritation", contra: "Acute narrow-angle glaucoma", pearl: "Prescribed for home/school rescue use in children with known epilepsy and history of prolonged/cluster seizures; caregiver training is essential; call 911 if seizure persists >5 minutes after administration" }
    ],
    pearls: [
      "Simple febrile seizures do NOT increase the risk of epilepsy and do NOT cause brain damage — parental reassurance is a critical nursing intervention",
      "The 5-20-40 rule for status epilepticus: benzodiazepine at 5 minutes, second-line AED at 20 minutes, third-line/anesthetic agents at 40 minutes",
      "IM midazolam is as effective as IV lorazepam for pre-hospital seizure management (RAMPART trial) — this is critical when IV access is not available",
      "NEVER put anything in the mouth during a seizure — the myth of 'swallowing the tongue' is false; bite blocks cause dental injury and aspiration",
      "Check glucose first in any seizing child — hypoglycemia is the most common treatable cause and is rapidly corrected",
      "Neonatal seizures are always pathological (never benign) — always investigate for HIE, infection, hemorrhage, or metabolic cause"
    ],
    quiz: [
      { question: "A 3-year-old develops a generalized tonic-clonic seizure lasting 2 minutes during a febrile illness. This is the child's first seizure, with no focal features and a temperature of 39.2C. What type of seizure does the nurse document?", options: ["Complex febrile seizure", "Simple febrile seizure", "Status epilepticus", "Epileptic seizure"], correct: 1, rationale: "A simple febrile seizure is: generalized (not focal), <15 minutes, single episode per illness, in a child 6 months-5 years with fever. This meets all criteria. Complex febrile seizures would be focal, >15 minutes, or recurrent within 24 hours." },
      { question: "A child is having a continuous seizure for 7 minutes with no IV access. What medication should the nurse administer?", options: ["IV lorazepam 0.1 mg/kg", "IM midazolam 0.2 mg/kg", "Oral levetiracetam", "Rectal phenobarbital"], correct: 1, rationale: "When IV access is unavailable, IM midazolam 0.2 mg/kg is the first-line treatment for status epilepticus. The RAMPART trial demonstrated it is as effective as IV lorazepam. Intranasal midazolam or rectal diazepam are alternatives." },
      { question: "After administering lorazepam for status epilepticus, what should the nurse monitor most closely?", options: ["Blood glucose", "Respiratory rate and depth", "Urine output", "Pupil reaction"], correct: 1, rationale: "Benzodiazepines cause respiratory depression. After administering lorazepam, the nurse must monitor respiratory rate, depth, and oxygen saturation closely. Have bag-valve-mask and suction equipment immediately available. Respiratory arrest is the most dangerous adverse effect." }
    ]
  },

  "wound-healing-phases-rn": {
    title: "Wound Healing: Phases & Factors",
    cellular: {
      title: "Hemostasis, Inflammation, Proliferation & Remodeling",
      content: "Wound healing is a complex, overlapping cascade of four phases. Phase 1 — Hemostasis (immediate): vascular injury triggers vasoconstriction, platelet aggregation, and fibrin clot formation creating a temporary wound seal. Platelets release growth factors (PDGF, TGF-beta) that initiate the inflammatory phase. Phase 2 — Inflammation (days 1-6): neutrophils arrive within hours to phagocytize bacteria and debris; macrophages arrive by day 2-3 and are the MOST IMPORTANT cells in wound healing (they coordinate the entire healing process by secreting cytokines, growth factors, and transitioning the wound from inflammation to proliferation). Cardinal signs of inflammation: rubor (redness), calor (heat), tumor (swelling), dolor (pain), and functio laesa (loss of function). Phase 3 — Proliferation (days 4-21): fibroblasts synthesize collagen and form granulation tissue (red, beefy, vascular tissue); epithelial cells migrate across the wound surface (epithelialization); angiogenesis creates new blood vessels; wound contraction reduces wound size. Phase 4 — Remodeling/Maturation (day 21 to 2 years): type III collagen is replaced by stronger type I collagen; scar tissue reorganizes along lines of stress; maximum tensile strength reaches only 80% of original tissue strength. Wounds heal by primary intention (surgical closure, edges approximated), secondary intention (wound left open to granulate and contract), or tertiary intention (delayed closure after initial open management). Factors impairing wound healing include malnutrition (especially protein, vitamin C, zinc), diabetes, smoking, immunosuppression, infection, poor perfusion, advanced age, and certain medications (corticosteroids, NSAIDs, chemotherapy)."
    },
    riskFactors: [
      "Malnutrition: protein deficiency (impairs collagen synthesis), vitamin C deficiency (required for collagen cross-linking), zinc deficiency (needed for cell division), vitamin A deficiency (epithelial integrity)",
      "Diabetes mellitus: impaired neutrophil function, microangiopathy, peripheral neuropathy",
      "Smoking: nicotine causes vasoconstriction reducing tissue oxygenation; CO binds hemoglobin",
      "Advanced age: decreased immune function, thinner skin, reduced collagen synthesis",
      "Obesity: poor perfusion to adipose tissue, increased wound tension",
      "Immunosuppressive therapy: corticosteroids, chemotherapy, radiation therapy",
      "Chronic diseases: peripheral vascular disease, chronic kidney disease, liver disease",
      "Wound infection: bacterial burden >100,000 organisms/gram of tissue",
      "Foreign bodies in the wound",
      "Mechanical stress on the wound (excessive tension, inadequate immobilization)"
    ],
    diagnostics: [
      "Wound assessment: location, size (length x width x depth), wound bed appearance (granulation, slough, eschar, necrotic tissue), exudate (color, amount, odor)",
      "Wound culture: quantitative culture if infection suspected (>100,000 CFU/g = wound infection); obtain from wound base after cleansing, not from surface",
      "Serum albumin and prealbumin: nutritional status assessment (albumin <3.5 g/dL indicates malnutrition impacting healing; prealbumin more sensitive for acute changes)",
      "HbA1c: glycemic control assessment in diabetic patients (target <7% for optimal healing)",
      "Ankle-brachial index (ABI): vascular perfusion assessment for lower extremity wounds (ABI <0.5 indicates severe PAD)",
      "Tissue oxygen measurement: transcutaneous oximetry (TcPO2) >40 mmHg needed for healing",
      "WBC count and differential: elevated WBC suggests infection",
      "Photography: serial wound photographs for objective documentation of healing progress"
    ],
    management: [
      "Wound cleansing: normal saline irrigation at 4-15 psi (use 30-60 mL syringe with 18-gauge angiocath for adequate pressure); avoid cytotoxic agents (hydrogen peroxide, povidone-iodine) on healing tissue",
      "Debridement: remove necrotic tissue (autolytic with moisture-retentive dressings, enzymatic with collagenase, sharp/surgical, mechanical with wet-to-dry)",
      "Moist wound healing: maintain optimal moisture balance — wounds heal 50% faster in moist environments; use appropriate dressings (hydrogels for dry wounds, alginates for heavily exudating wounds)",
      "Negative pressure wound therapy (wound VAC): promotes granulation tissue formation in complex wounds by applying controlled negative pressure",
      "Nutritional optimization: protein 1.25-1.5 g/kg/day, vitamin C 250-500 mg BID, zinc 220 mg daily, adequate calories",
      "Offloading: pressure redistribution for pressure injuries and diabetic foot ulcers",
      "Glycemic control: blood glucose <180 mg/dL for optimal wound healing",
      "Compression therapy: for venous stasis ulcers (contraindicated if ABI <0.5)",
      "Hyperbaric oxygen therapy: for select chronic non-healing wounds, diabetic foot ulcers, radiation injury"
    ],
    nursingActions: [
      "Perform comprehensive wound assessment using MEASURE framework: Measure (L x W x D), Exudate, Appearance, Suffering (pain), Undermining/tunneling, Re-evaluate, Edge condition",
      "Document wound characteristics accurately using consistent terminology every assessment",
      "Select appropriate wound dressings based on wound bed characteristics and exudate amount",
      "Monitor for signs of wound infection: increasing pain, erythema extending beyond wound margins, warmth, edema, purulent drainage, fever, elevated WBC",
      "Maintain aseptic technique during wound care; use sterile technique for acute surgical wounds",
      "Assess nutritional status and collaborate with dietitian for optimization",
      "Educate patient on wound care at home: dressing changes, signs of infection, when to seek medical attention",
      "Assess pain before, during, and after wound care; administer analgesics 30 minutes before dressing changes",
      "Position patient to avoid pressure on wound; turn every 2 hours for immobile patients",
      "Coordinate with wound care specialist or enterostomal therapist for complex wounds"
    ],
    assessmentFindings: [
      "Healthy healing wound: red, beefy granulation tissue; moist wound bed; decreasing size over time; minimal exudate",
      "Infected wound: erythema extending >2 cm beyond wound margins, increased warmth, edema, purulent drainage (yellow/green), foul odor, increasing pain, fever",
      "Chronic/non-healing wound: wound bed with slough (yellow) or eschar (black/brown necrotic tissue), undermining, rolled wound edges, failure to progress",
      "Wound dehiscence: separation of wound edges; evisceration: protrusion of abdominal contents through wound (surgical emergency)",
      "Sinus tracts and tunneling: palpated with cotton-tipped applicator; document clock position and depth"
    ],
    signs: {
      left: [
        "Phase 1: Hemostasis (seconds to minutes)",
        "Phase 2: Inflammation (days 1-6)",
        "Phase 3: Proliferation (days 4-21)",
        "Phase 4: Remodeling (21 days to 2 years)"
      ],
      right: [
        "Primary intention: edges approximated (sutures)",
        "Secondary intention: open wound, granulation",
        "Tertiary intention: delayed closure",
        "Max tensile strength: 80% of original"
      ]
    },
    medications: [
      { name: "Collagenase (Santyl)", type: "Enzymatic debriding agent", action: "Selectively digests collagen in necrotic tissue without damaging viable tissue", sideEffects: "Transient erythema at wound margins, pain with application", contra: "Do not use with silver-containing products or acidic solutions (inactivates enzyme)", pearl: "Apply directly to necrotic tissue; cross-hatch eschar before application to improve penetration; keep wound moist with appropriate secondary dressing" },
      { name: "Mupirocin (Bactroban)", type: "Topical antibiotic", action: "Inhibits bacterial protein synthesis; effective against S. aureus including MRSA", sideEffects: "Burning, stinging at application site", contra: "Hypersensitivity to mupirocin", pearl: "Used for wound infections, nasal MRSA decolonization; do NOT use mupirocin for >10 days (resistance development)" },
      { name: "Silver sulfadiazine (Silvadene)", type: "Topical antimicrobial (sulfonamide + silver)", action: "Silver ions disrupt bacterial cell membranes; broad-spectrum coverage including Pseudomonas", sideEffects: "Transient leukopenia, skin discoloration, photosensitivity", contra: "Sulfonamide allergy, pregnancy (near term), premature infants (kernicterus risk)", pearl: "Commonly used for partial-thickness burns; forms a pseudoeschar that requires removal and reapplication daily; monitor CBC for leukopenia" }
    ],
    pearls: [
      "Macrophages are the MOST IMPORTANT cells in wound healing — they coordinate the transition from inflammation to proliferation; without macrophages, wounds do not heal",
      "Wounds heal 50% faster in a MOIST environment — the era of 'letting wounds dry out' is over; select dressings that maintain optimal moisture balance",
      "Vitamin C deficiency impairs collagen synthesis and cross-linking — scurvy presents with poor wound healing, bleeding gums, and petechiae",
      "Corticosteroids impair wound healing by suppressing inflammation and immune function; vitamin A (10,000 IU/day) can partially counteract steroid effects on healing",
      "The 'red-yellow-black' wound assessment: Red (granulation) = protect; Yellow (slough) = cleanse/debride; Black (eschar) = debride",
      "Wound evisceration: cover with sterile saline-moistened towels, position supine with knees flexed, do NOT attempt to replace organs, notify surgeon STAT"
    ],
    quiz: [
      { question: "Which cell type is considered the most critical for coordinating wound healing?", options: ["Neutrophils", "Fibroblasts", "Macrophages", "Platelets"], correct: 2, rationale: "Macrophages are the most important cells in wound healing. They phagocytize debris, secrete growth factors (PDGF, TGF-beta, VEGF) that recruit fibroblasts and stimulate angiogenesis, and orchestrate the transition from the inflammatory to proliferative phase. Without macrophages, healing is significantly impaired." },
      { question: "A surgical wound separates on postoperative day 5 and the patient reports feeling a 'pop.' The nurse sees loops of bowel protruding through the wound. What is the FIRST action?", options: ["Attempt to replace the bowel contents", "Cover with sterile saline-moistened towels and call the surgeon STAT", "Apply an abdominal binder tightly", "Irrigate the wound with antiseptic solution"], correct: 1, rationale: "Evisceration is a surgical emergency. The exposed organs must be covered with sterile saline-moistened towels to prevent drying and contamination. Position the patient supine with knees flexed to reduce abdominal tension. Never attempt to replace organs. Notify the surgeon immediately for emergent return to OR." },
      { question: "Which nutritional supplement is most important for collagen synthesis in wound healing?", options: ["Vitamin B12", "Vitamin C", "Vitamin D", "Vitamin E"], correct: 1, rationale: "Vitamin C (ascorbic acid) is essential for collagen synthesis and cross-linking. It acts as a cofactor for prolyl and lysyl hydroxylase enzymes needed for collagen stability. Deficiency (scurvy) causes impaired wound healing, easy bruising, and connective tissue disorders." }
    ]
  },

  "pressure-injuries-staging-rn": {
    title: "Pressure Injuries: Staging & Prevention",
    cellular: {
      title: "Tissue Ischemia & Braden Scale Assessment",
      content: "Pressure injuries (formerly pressure ulcers or decubitus ulcers) result from prolonged, unrelieved pressure on tissue, causing localized damage to skin and/or underlying soft tissue usually over a bony prominence. The primary mechanism is tissue ischemia: external pressure exceeding capillary closing pressure (~32 mmHg) occludes blood flow, causing ischemia, hypoxia, metabolic waste accumulation, and cellular death. Contributing factors include shear (parallel forces that cause tissue layers to slide against each other, damaging blood vessels), friction (superficial skin damage from rubbing), and moisture (maceration weakening the stratum corneum). Staging: Stage 1 — intact skin with non-blanchable erythema (press and release the reddened area; if it does NOT blanch/turn white, it is Stage 1). Stage 2 — partial-thickness skin loss involving epidermis and/or dermis; presents as a shallow open ulcer with red-pink wound bed, or intact/ruptured serum-filled blister. Stage 3 — full-thickness skin loss; subcutaneous fat may be visible but bone, tendon, and muscle are NOT exposed; may include undermining and tunneling. Stage 4 — full-thickness tissue loss with exposed bone, tendon, or muscle; may include osteomyelitis. Unstageable — full-thickness tissue loss with wound base obscured by slough (yellow) or eschar (black); cannot be staged until debridement reveals the wound bed. Deep tissue pressure injury (DTPI) — intact or non-intact skin with localized area of persistent non-blanchable deep red, maroon, or purple discoloration; represents damage to underlying soft tissue from pressure/shear; may evolve rapidly. The Braden Scale (scored 6-23) assesses six domains: sensory perception, moisture, activity, mobility, nutrition, and friction/shear. Score <=18 indicates at-risk; <=12 indicates high risk."
    },
    riskFactors: [
      "Immobility (most significant risk factor) — inability to reposition independently",
      "Impaired sensation (spinal cord injury, neuropathy, sedation)",
      "Moisture exposure (incontinence, diaphoresis, wound drainage)",
      "Poor nutritional status (albumin <3.5 g/dL, inadequate protein/caloric intake)",
      "Advanced age (thinner skin, decreased subcutaneous tissue, reduced perfusion)",
      "Friction and shear forces (sliding down in bed, improper transfer technique)",
      "Impaired circulation (peripheral vascular disease, diabetes, heart failure)",
      "Low body weight or obesity (bony prominences or increased weight on tissues)",
      "Chronic conditions: diabetes, renal failure, spinal cord injury",
      "Medical devices: oxygen masks, splints, endotracheal tubes causing pressure"
    ],
    diagnostics: [
      "Braden Scale assessment: scored on admission and at regular intervals (every shift for acute care); domains: sensory perception (1-4), moisture (1-4), activity (1-4), mobility (1-4), nutrition (1-4), friction/shear (1-3); total 6-23; <=18 = at risk",
      "Comprehensive skin assessment: head-to-toe on admission and every shift; pay special attention to bony prominences (sacrum, heels, ischial tuberosities, trochanters, occiput in infants/children)",
      "Wound measurement: length x width x depth using disposable ruler; document undermining and tunneling by clock position",
      "Wound bed assessment: percentage of granulation, slough, eschar, necrotic tissue",
      "Nutritional labs: albumin (<3.5 g/dL), prealbumin (<15 mg/dL), total protein, lymphocyte count",
      "Wound culture: if signs of infection present (obtain from wound base, not surface)",
      "Ankle-brachial index: for lower extremity ulcers to assess vascular sufficiency",
      "Bone biopsy/MRI: if osteomyelitis suspected in Stage 4 injuries"
    ],
    management: [
      "Prevention is paramount: pressure redistribution is the cornerstone",
      "Repositioning schedule: every 2 hours for bed-bound patients; every 1 hour for wheelchair-bound; 30-degree lateral position preferred (avoids trochanteric and sacral pressure)",
      "Pressure-redistribution support surfaces: foam overlays for at-risk, alternating pressure devices for moderate-high risk, low-air-loss or air-fluidized beds for Stage 3-4",
      "Heel suspension: elevate heels off bed surface with pillows under calves (NOT under heels); use heel suspension boots",
      "Nutritional optimization: protein 1.25-1.5 g/kg/day, vitamin C 250 mg BID, zinc 220 mg daily, adequate hydration",
      "Moisture management: use barrier creams for incontinence-associated dermatitis; change soiled linens promptly; manage excessive perspiration",
      "Wound care by stage: Stage 1 = transparent film/skin protectant; Stage 2 = hydrocolloid or foam dressing; Stage 3-4 = wound bed preparation, debridement, appropriate moisture-management dressings, negative pressure wound therapy if indicated",
      "Offloading: no pressure on the wound site; use appropriate turning schedules and support surfaces"
    ],
    nursingActions: [
      "Perform Braden Scale assessment on admission, every shift (acute care), with change in condition, and at regular intervals per policy",
      "Conduct head-to-toe skin assessment on admission and every shift — document findings including any areas of non-blanchable erythema",
      "Implement turning schedule: reposition every 2 hours; post turning schedule at bedside; document each repositioning",
      "Elevate heels off the bed using pillows under the calves — heels are the second most common site for pressure injuries",
      "Apply barrier cream to perineum and skin folds for moisture protection; keep skin clean and dry",
      "Use lift sheets/transfer devices to minimize friction and shear during repositioning — NEVER drag the patient across sheets",
      "Maintain HOB at lowest degree consistent with medical needs — elevation >30 degrees increases sacral shear forces",
      "Optimize nutrition: coordinate with dietitian; provide high-protein supplements; ensure adequate hydration",
      "Inspect under and around medical devices (oxygen tubing, splints, catheters, endotracheal tubes) for device-related pressure injuries",
      "Educate patient and family on skin inspection, repositioning importance, and nutrition for healing",
      "Document wound stage, size, wound bed characteristics, drainage, and surrounding skin at each assessment"
    ],
    assessmentFindings: [
      "Stage 1: non-blanchable erythema of intact skin; may feel warm, firm, or boggy compared to surrounding tissue; may be painful",
      "Stage 2: partial-thickness loss; shallow open ulcer with red-pink wound bed; may present as intact or ruptured serum-filled blister; NO slough or eschar",
      "Stage 3: full-thickness skin loss; subcutaneous fat visible; bone, tendon, muscle NOT visible; may have undermining/tunneling",
      "Stage 4: full-thickness tissue loss with exposed bone, tendon, or muscle; often with undermining and tunneling; osteomyelitis risk",
      "Unstageable: wound base covered by slough (yellow) and/or eschar (black/brown); true depth cannot be determined",
      "Deep tissue pressure injury: localized deep red, maroon, or purple area of intact or non-intact skin; may evolve rapidly to reveal full extent of injury"
    ],
    signs: {
      left: [
        "Stage 1: non-blanchable erythema, intact skin",
        "Stage 2: partial-thickness, blister or shallow ulcer",
        "Stage 3: full-thickness, fat visible, no bone/muscle",
        "Stage 4: full-thickness, bone/tendon/muscle exposed"
      ],
      right: [
        "Unstageable: slough or eschar obscures base",
        "DTPI: deep red/purple, intact or non-intact",
        "Most common sites: sacrum (#1), heels (#2)",
        "Braden Score <=18: at risk for pressure injury"
      ]
    },
    medications: [
      { name: "Zinc sulfate", type: "Essential mineral supplement", action: "Required for cell division, immune function, and protein synthesis critical for wound healing", sideEffects: "Nausea, metallic taste, copper deficiency with prolonged use", contra: "Zinc allergy; use with caution in renal impairment", pearl: "220 mg (50 mg elemental zinc) daily for 2-3 weeks during active wound healing; prolonged use (>3 months) can cause copper deficiency anemia" },
      { name: "Ascorbic acid (Vitamin C)", type: "Vitamin supplement", action: "Essential cofactor for collagen synthesis and cross-linking; antioxidant; enhances immune function", sideEffects: "GI upset, kidney stones (with very high doses), false-negative occult blood tests", contra: "History of oxalate kidney stones (relative)", pearl: "250-500 mg BID for wound healing; deficiency (scurvy) causes impaired collagen formation, poor wound healing, gum bleeding" },
      { name: "Enzymatic debriding agents (Collagenase)", type: "Topical enzymatic debrider", action: "Selectively digests collagen in devitalized tissue, facilitating autolytic debridement", sideEffects: "Local erythema, transient pain", contra: "Wounds with exposed major nerves or blood vessels", pearl: "Apply 2 mm thick to necrotic tissue daily; protect periwound skin with barrier cream; do not use with silver, iodine, or acidic cleansers (inactivate the enzyme)" }
    ],
    pearls: [
      "NEVER stage a pressure injury by reverse staging (e.g., a Stage 4 does not become Stage 3 as it heals) — a healing Stage 4 is documented as 'Stage 4, healing'",
      "The sacrum is the #1 most common site and heels are #2 — elevate heels off the bed ALWAYS for immobile patients",
      "Braden Scale score interpretation: 15-18 = mild risk, 13-14 = moderate risk, 10-12 = high risk, <=9 = very high risk",
      "30-degree lateral position is preferred over 90-degree side-lying because it avoids direct pressure on the trochanter",
      "Stage 2 pressure injuries should NEVER have slough or eschar — if present, the wound is at least Stage 3 or unstageable",
      "Medical device-related pressure injuries (MDRPI) are the fastest-growing category — always inspect under oxygen masks, nasal cannula, cervical collars, splints, and endotracheal tubes",
      "Incontinence-associated dermatitis (IAD) is NOT a pressure injury — it is moisture damage; however, IAD increases the risk of developing a pressure injury in the affected area"
    ],
    quiz: [
      { question: "A nurse assesses a reddened area over a patient's sacrum. When pressed, the area does not blanch (turn white). What stage pressure injury should the nurse document?", options: ["Stage 1", "Stage 2", "Unstageable", "Deep tissue pressure injury"], correct: 0, rationale: "Stage 1 pressure injury is defined as non-blanchable erythema of intact skin. When you press on the reddened area and it does NOT blanch (turn white), it indicates capillary damage and early tissue ischemia. The skin is still intact — no open wound." },
      { question: "A patient's wound shows full-thickness tissue loss with exposed tendon visible at the wound base. What is the correct staging?", options: ["Stage 2", "Stage 3", "Stage 4", "Unstageable"], correct: 2, rationale: "Stage 4 pressure injuries involve full-thickness tissue loss with exposed bone, tendon, or muscle. Stage 3 has full-thickness loss with visible subcutaneous fat but bone/tendon/muscle are NOT visible. The presence of exposed tendon makes this Stage 4." },
      { question: "A patient's Braden Scale score is 12. Which nursing intervention is most important?", options: ["Standard repositioning every 4 hours", "Implement aggressive pressure injury prevention protocol with repositioning every 2 hours and specialty support surface", "No specific interventions needed", "Apply a heat lamp to promote circulation"], correct: 1, rationale: "A Braden Score of 12 indicates HIGH risk for pressure injury development. Aggressive prevention measures are required: repositioning every 2 hours (or more frequently), specialty pressure-redistribution surface, nutritional optimization, heel elevation, moisture management, and meticulous skin assessment." }
    ]
  },

  "skin-cancer-assessment-rn": {
    title: "Skin Cancer Assessment: ABCDE & Types",
    cellular: {
      title: "Melanoma, Basal Cell & Squamous Cell Carcinoma",
      content: "Skin cancers arise from different cell types in the epidermis and have vastly different behaviors and prognoses. Basal cell carcinoma (BCC) is the most common cancer overall, arising from basal cells in the stratum basale. It grows very slowly, almost NEVER metastasizes (<0.1%), and typically presents as a pearly, flesh-colored papule with telangiectasia (visible blood vessels) and rolled borders, often on sun-exposed areas (face, ears, nose). It may develop central ulceration ('rodent ulcer'). Squamous cell carcinoma (SCC) arises from keratinocytes in the stratum spinosum. It is the second most common skin cancer and CAN metastasize (3-5% risk, higher in immunosuppressed patients). SCC presents as a scaly, erythematous plaque or nodule, often with a rough, crusted surface, and may develop a cutaneous horn. Risk factors include cumulative UV exposure, immunosuppression, chronic wounds/scars (Marjolin ulcer), and HPV infection. Actinic keratoses are pre-cancerous SCC precursor lesions. Melanoma arises from melanocytes and is the most dangerous skin cancer due to its high metastatic potential. It accounts for only 4% of skin cancers but causes 75% of skin cancer deaths. The ABCDE criteria for melanoma detection: Asymmetry (one half unlike the other), Border irregularity (scalloped, notched), Color variation (multiple shades of brown, black, red, white, blue), Diameter >6 mm (larger than a pencil eraser), Evolving (changing in size, shape, color, or symptoms). Breslow depth (measured in millimeters from the top of the granular layer to the deepest point of tumor invasion) is the single most important prognostic factor for melanoma — deeper invasion correlates with higher metastatic risk and worse survival."
    },
    riskFactors: [
      "UV radiation exposure: cumulative sun exposure (BCC, SCC), intermittent intense exposure/blistering sunburns (melanoma)",
      "Fair skin, light hair, light eyes (Fitzpatrick skin types I-II)",
      "History of sunburns, especially blistering sunburns before age 18",
      "Family history of melanoma (10% of cases are familial)",
      "Multiple or atypical/dysplastic nevi (>50 common moles or >5 atypical moles increases melanoma risk)",
      "Immunosuppression: organ transplant recipients have 65x increased risk of SCC",
      "Tanning bed use (increases melanoma risk by 75% when first used before age 35)",
      "Previous history of skin cancer (recurrence risk)",
      "Actinic keratoses: precursor to SCC",
      "Chronic wounds/scars: SCC can develop in chronic ulcers (Marjolin ulcer)",
      "Occupational exposure: arsenic (SCC), ionizing radiation"
    ],
    diagnostics: [
      "Full-body skin examination: systematic head-to-toe assessment including scalp, between toes, nail beds, mucous membranes",
      "ABCDE criteria for melanoma assessment: Asymmetry, Border irregularity, Color variation, Diameter >6 mm, Evolving",
      "Dermoscopy: magnified, illuminated skin examination (10x magnification) improves diagnostic accuracy by 20-30%",
      "Excisional biopsy: preferred method — removes entire lesion with narrow margin for complete histologic evaluation; includes Breslow depth measurement",
      "Shave biopsy: acceptable for suspected BCC/SCC but NOT for suspected melanoma (may not capture full depth)",
      "Sentinel lymph node biopsy: indicated for melanoma with Breslow depth >0.8 mm to assess regional metastasis",
      "CT/PET scan: staging for advanced melanoma to assess distant metastasis (lungs, liver, brain, bone)",
      "LDH level: elevated in metastatic melanoma (poor prognostic indicator)",
      "Genetic testing: BRAF mutation testing for advanced melanoma (guides targeted therapy with vemurafenib/dabrafenib)"
    ],
    management: [
      "BCC: surgical excision with 4 mm margins; Mohs micrographic surgery for cosmetically sensitive or high-risk areas; topical imiquimod or 5-fluorouracil for superficial BCC",
      "SCC: surgical excision with 4-6 mm margins; Mohs surgery for high-risk areas; radiation for inoperable cases; sentinel lymph node biopsy if high-risk features",
      "Actinic keratoses (pre-SCC): cryotherapy (liquid nitrogen), topical 5-FU, topical imiquimod, photodynamic therapy",
      "Melanoma: wide local excision (margins based on Breslow depth: in situ = 5 mm, <1mm = 1 cm, 1-2mm = 1-2 cm, >2mm = 2 cm); sentinel lymph node biopsy for depth >0.8 mm",
      "Advanced melanoma: immunotherapy (pembrolizumab, nivolumab — checkpoint inhibitors), targeted therapy (BRAF/MEK inhibitors for BRAF-mutated tumors), radiation for brain metastases",
      "Sun protection education: daily broad-spectrum SPF 30+ sunscreen, protective clothing, avoidance of peak UV hours (10 AM - 4 PM), no tanning beds",
      "Regular follow-up: skin exams every 3-6 months for first 2 years after melanoma diagnosis, then annually"
    ],
    nursingActions: [
      "Perform comprehensive skin assessment on admission and regularly; teach patients self-skin examination technique",
      "Teach ABCDE criteria to patients for melanoma early detection",
      "Educate on 'ugly duckling' sign: a mole that looks different from all others on the patient's body warrants evaluation",
      "Post-biopsy/excision wound care education: keep site clean and dry, signs of infection to report, follow-up appointment importance",
      "Educate on sun protection measures: SPF 30+ broad-spectrum sunscreen, reapply every 2 hours, protective clothing, seek shade",
      "Counsel on avoidance of tanning beds — emphasize that there is no 'safe tan' from UV radiation",
      "Monitor immunotherapy patients for immune-related adverse events: rash, diarrhea, hepatitis, pneumonitis, endocrinopathy, thyroid dysfunction",
      "Provide psychosocial support: melanoma diagnosis causes significant anxiety; connect with support resources",
      "Screen high-risk patients (family history, multiple atypical nevi, fair skin with extensive sun exposure) and refer to dermatology",
      "Educate transplant patients on dramatically increased skin cancer risk (65x for SCC) and need for regular dermatologic surveillance"
    ],
    assessmentFindings: [
      "BCC: pearly, flesh-colored or pink papule/nodule with telangiectasia; rolled pearly borders; central ulceration ('rodent ulcer'); slow-growing; sun-exposed areas (face, nose, ears)",
      "SCC: scaly, erythematous plaque or nodule; rough/crusted surface; may have cutaneous horn; may arise from actinic keratosis; sun-exposed areas, lower lip, ears",
      "Melanoma: pigmented lesion meeting ABCDE criteria; may have satellite lesions; common on trunk (men), legs (women); can occur on palms, soles, nail beds (acral lentiginous melanoma in darker skin)",
      "Actinic keratosis (pre-cancer): rough, scaly, sandpaper-like patches on sun-damaged skin; typically flesh-colored to reddish-brown",
      "Regional lymphadenopathy: firm, non-tender nodes may indicate metastatic spread (especially melanoma)"
    ],
    signs: {
      left: [
        "BCC: pearly papule, telangiectasia, rolled borders",
        "BCC: most common, almost never metastasizes",
        "SCC: scaly plaque, crusted, may have horn",
        "SCC: can metastasize (3-5%)"
      ],
      right: [
        "Melanoma: ABCDE criteria",
        "Melanoma: most dangerous, high metastatic potential",
        "Breslow depth: #1 prognostic factor for melanoma",
        "Actinic keratosis: pre-cancerous SCC precursor"
      ]
    },
    medications: [
      { name: "Imiquimod (Aldara)", type: "Topical immune response modifier", action: "Stimulates local immune response by activating toll-like receptor 7, inducing interferon-alpha and other cytokines that promote tumor cell destruction", sideEffects: "Local skin reactions (erythema, erosion, crusting, flaking), flu-like symptoms", contra: "Application to internal surfaces, surgical wounds", pearl: "Used for superficial BCC and actinic keratoses; applied 5 nights/week for 6 weeks (AK) or 5 nights/week for 6-12 weeks (BCC); warn patients that significant local reaction indicates therapeutic effect" },
      { name: "5-Fluorouracil topical (Efudex)", type: "Topical antimetabolite", action: "Inhibits thymidylate synthase, blocking DNA synthesis in rapidly dividing cells (pre-cancerous and cancerous)", sideEffects: "Severe inflammatory reaction (expected), pain, burning, crusting at treatment sites", contra: "Pregnancy (category X), DPD deficiency (systemic toxicity risk)", pearl: "Applied to actinic keratoses and superficial BCC; expect redness, crusting, and erosion during treatment (4-6 weeks) — this is the intended therapeutic response; educate patient to continue through the inflammatory phase" },
      { name: "Pembrolizumab", type: "PD-1 checkpoint inhibitor (immunotherapy)", action: "Blocks PD-1 receptor on T cells, preventing cancer cell immune evasion and restoring anti-tumor immune response", sideEffects: "Immune-related adverse events: dermatitis, colitis, hepatitis, pneumonitis, endocrinopathy, nephritis", contra: "Active autoimmune disease, concurrent high-dose steroids", pearl: "First-line for advanced/metastatic melanoma; monitor for immune-related adverse events at every visit — can affect ANY organ system; thyroid dysfunction is most common endocrinopathy (check TSH regularly)" }
    ],
    pearls: [
      "ABCDE melanoma criteria: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolving — any change in a mole warrants evaluation",
      "Breslow depth is the single most important prognostic factor for melanoma: <1mm = >95% 5-year survival; >4mm = <50% 5-year survival",
      "BCC almost NEVER metastasizes (<0.1%) but is locally destructive — it can erode into cartilage and bone if neglected",
      "The 'ugly duckling' sign: a lesion that looks distinctly different from all other moles on a patient's body should be evaluated regardless of whether it meets ABCDE criteria",
      "Organ transplant recipients have 65x increased risk of SCC due to chronic immunosuppression — they need dermatologic screening every 6-12 months",
      "Acral lentiginous melanoma (palms, soles, nail beds) is the most common melanoma type in dark-skinned individuals — Bob Marley died from melanoma under his toenail"
    ],
    quiz: [
      { question: "During a skin assessment, the nurse notes a pigmented lesion on a patient's back with irregular borders, multiple colors (brown, black, red), and a diameter of 8 mm. Which action should the nurse take?", options: ["Document as a benign mole", "Apply sunscreen to the lesion", "Refer to dermatology for evaluation — the lesion meets ABCDE criteria for melanoma", "Monitor at the next annual visit"], correct: 2, rationale: "This lesion meets multiple ABCDE criteria: Border irregularity, Color variation (multiple colors), and Diameter >6mm. Any lesion meeting one or more ABCDE criteria warrants prompt dermatologic evaluation and possible biopsy to rule out melanoma." },
      { question: "Which skin cancer type is most dangerous despite being the least common?", options: ["Basal cell carcinoma", "Squamous cell carcinoma", "Melanoma", "Actinic keratosis"], correct: 2, rationale: "Melanoma accounts for only 4% of skin cancers but causes 75% of skin cancer deaths due to its high metastatic potential. BCC is the most common but almost never metastasizes. SCC can metastasize but less frequently than melanoma. Actinic keratosis is pre-cancerous, not cancer." },
      { question: "What is the most important prognostic factor for melanoma?", options: ["Tumor diameter", "Patient age", "Breslow depth (thickness of invasion in millimeters)", "Location on the body"], correct: 2, rationale: "Breslow depth measures the vertical thickness of the melanoma from the granular layer to the deepest point of invasion. It is the single most important prognostic factor — deeper invasion correlates with higher metastatic risk and lower survival rates. It also determines the surgical excision margins." }
    ]
  }
};
