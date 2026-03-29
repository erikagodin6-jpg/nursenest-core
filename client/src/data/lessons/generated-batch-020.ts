import type { LessonContent } from "./types";

export const generatedBatch020Lessons: Record<string, LessonContent> = {
  "cirrhosis-core-np": {
      "title": "Cirrhosis Core Concepts",
      "cellular": {
        "title": "Hepatic Fibrosis & Cirrhosis Pathophysiology",
        "content": "Cirrhosis is the end-stage of chronic liver disease characterized by diffuse fibrosis, regenerative nodule formation, and distortion of hepatic architecture. Chronic injury (alcohol, viral hepatitis, NAFLD/NASH) activates hepatic stellate cells, which transform from quiescent vitamin A-storing cells into myofibroblasts that produce excessive collagen (types I and III), forming fibrous septa that disrupt normal lobular architecture. This creates portosystemic shunting, impaired hepatocyte function, and portal hypertension (hepatic venous pressure gradient >5 mmHg; clinically significant >10 mmHg). Consequences include synthetic failure (hypoalbuminemia, coagulopathy), impaired detoxification (hyperammonemia → hepatic encephalopathy), and portal hypertension complications (varices, ascites, splenomegaly)."
      },
      "riskFactors": [
        "Chronic alcohol use (most common cause in Western countries; >60-80 g/day men, >20-40 g/day women for >10 years)",
        "Chronic hepatitis C (HCV) and hepatitis B (HBV) infection",
        "Non-alcoholic steatohepatitis (NASH) / metabolic-associated steatotic liver disease (MASLD)",
        "Autoimmune hepatitis",
        "Primary biliary cholangitis (PBC) and primary sclerosing cholangitis (PSC)",
        "Hereditary hemochromatosis, Wilson disease, alpha-1 antitrypsin deficiency",
        "Drug-induced liver injury (methotrexate, amiodarone)",
        "Chronic biliary obstruction"
      ],
      "diagnostics": [
        "Liver biopsy: gold standard for diagnosis and staging (Metavir fibrosis score F0-F4; F4 = cirrhosis)",
        "FibroScan (transient elastography): non-invasive assessment of liver stiffness; >12.5 kPa suggests cirrhosis",
        "FIB-4 index: calculated from age, AST, ALT, and platelet count; non-invasive fibrosis assessment",
        "Serum markers: AST/ALT ratio >1 suggests cirrhosis (reversed from hepatitis); low albumin, prolonged PT/INR, elevated bilirubin, thrombocytopenia (splenic sequestration)",
        "Abdominal ultrasound: nodular liver surface, splenomegaly, ascites, portal vein dilation (>13 mm)",
        "Upper endoscopy: screen for esophageal/gastric varices at diagnosis; every 2-3 years if none found",
        "AFP every 6 months for HCC surveillance (with ultrasound)",
        "Hepatic venous pressure gradient (HVPG): >10 mmHg = clinically significant portal hypertension"
      ],
      "management": [
        "Treat underlying etiology: alcohol cessation, antiviral therapy for HCV/HBV, weight loss for NASH, immunosuppression for autoimmune hepatitis",
        "Compensated cirrhosis: regular surveillance (HCC screening q6 months, variceal screening by EGD), hepatitis A/B vaccination, avoid hepatotoxins (alcohol, NSAIDs, high-dose acetaminophen)",
        "Decompensated cirrhosis (ascites, variceal bleeding, encephalopathy, jaundice): manage each complication specifically",
        "Ascites: sodium restriction (<2g/day), diuretics (spironolactone 100 mg + furosemide 40 mg in 100:40 ratio), therapeutic paracentesis for tense ascites with albumin replacement (6-8 g per liter removed if >5L)",
        "Variceal bleeding prophylaxis: non-selective beta-blocker (propranolol, nadolol, carvedilol) or endoscopic variceal ligation (EVL)",
        "Hepatic encephalopathy: lactulose (titrate to 2-3 soft stools/day) + rifaximin 550 mg BID",
        "Liver transplant evaluation for decompensated cirrhosis or HCC within Milan criteria"
      ],
      "nursingActions": [
        "Monitor for signs of decompensation: new ascites, jaundice, confusion (encephalopathy), GI bleeding",
        "Calculate and monitor Child-Pugh and MELD scores to assess disease severity and transplant candidacy",
        "Assess for asterixis (liver flap) as an early sign of hepatic encephalopathy",
        "Implement fall precautions for patients with encephalopathy",
        "Monitor for spontaneous bacterial peritonitis (SBP) in patients with ascites: paracentesis if fever, abdominal pain, or worsening encephalopathy",
        "Educate on absolute alcohol avoidance, sodium restriction, medication adherence",
        "Coordinate HCC surveillance: AFP + ultrasound every 6 months"
      ],
      "assessmentFindings": [
        "Compensated: may be asymptomatic; fatigue, spider angiomata, palmar erythema, gynecomastia, testicular atrophy",
        "Decompensated: ascites (shifting dullness, fluid wave), jaundice, peripheral edema, hepatic encephalopathy (confusion, asterixis, fetor hepaticus)",
        "Portal hypertension signs: caput medusae, splenomegaly, hemorrhoids, esophageal varices",
        "Coagulopathy: easy bruising, mucosal bleeding, prolonged PT/INR",
        "Hepatorenal syndrome: progressive renal failure in advanced cirrhosis without intrinsic renal disease"
      ],
      "signs": {
        "left": [
          "Compensated cirrhosis with normal synthetic function",
          "Mild spider angiomata or palmar erythema without decompensation",
          "Stable MELD score, normal albumin, no ascites",
          "Small varices without red wale signs on endoscopy"
        ],
        "right": [
          "Acute variceal hemorrhage: hematemesis, melena, hemorrhagic shock",
          "Grade III-IV hepatic encephalopathy: coma, unresponsive",
          "Spontaneous bacterial peritonitis: fever, abdominal pain, worsening ascites",
          "Hepatorenal syndrome type 1: rapidly progressive renal failure (creatinine doubling in <2 weeks)",
          "Hepatocellular carcinoma: new hepatic mass on surveillance imaging"
        ]
      },
      "medications": [
        {
          "name": "Spironolactone",
          "type": "Aldosterone antagonist / potassium-sparing diuretic",
          "action": "Blocks aldosterone at the mineralocorticoid receptor in the collecting duct; in cirrhosis, secondary hyperaldosteronism from RAAS activation causes avid sodium retention and ascites; spironolactone counteracts this by promoting natriuresis",
          "sideEffects": "Hyperkalemia, gynecomastia and breast tenderness (anti-androgen effect), menstrual irregularities, GI upset",
          "contra": "K+ >5.5, severe renal failure, concurrent potassium supplements",
          "pearl": "Cornerstone of ascites management; used with furosemide in 100:40 mg ratio to maintain potassium balance; start at 100 mg/day, increase every 3-5 days as needed; maximum 400 mg/day; monitor electrolytes and renal function closely"
        },
        {
          "name": "Lactulose",
          "type": "Osmotic laxative / ammonia-reducing agent",
          "action": "Non-absorbable disaccharide metabolized by colonic bacteria to lactic and acetic acids; acidifies colonic contents converting ammonia (NH3) to ammonium (NH4+) which cannot be absorbed; osmotic effect increases fecal elimination of ammonium; reduces blood ammonia levels and improves hepatic encephalopathy",
          "sideEffects": "Bloating, flatulence, abdominal cramping, diarrhea (excessive dosing), dehydration and electrolyte imbalances with overuse",
          "contra": "Galactosemia, bowel obstruction",
          "pearl": "Titrate dose to achieve 2-3 soft stools per day; typical dose 15-30 mL (10-20 g) PO 2-4 times daily; can also be given rectally as retention enema (300 mL in 700 mL water) for patients unable to take PO; combine with rifaximin for prevention of recurrent hepatic encephalopathy"
        }
      ],
      "pearls": [
        "Child-Pugh score (A/B/C) assesses cirrhosis severity using 5 parameters: bilirubin, albumin, INR, ascites, encephalopathy; MELD score (bilirubin, INR, creatinine) determines transplant priority",
        "Ascites diuretic ratio: spironolactone:furosemide = 100:40 mg to maintain potassium balance; monitor renal function and electrolytes frequently",
        "Spontaneous bacterial peritonitis (SBP): diagnose by paracentesis with PMN count ≥250 cells/mm³; treat with ceftriaxone + IV albumin; prophylaxis with norfloxacin or TMP-SMX after first episode",
        "In cirrhosis, AST > ALT (reversed from hepatitis); de Ritis ratio >1 suggests cirrhosis; thrombocytopenia is often the first laboratory clue",
        "NSAIDs are CONTRAINDICATED in cirrhosis -- they reduce renal prostaglandins, worsen renal function, and increase GI bleeding risk",
        "Acetaminophen is safe in cirrhosis at reduced doses (max 2 g/day); it is actually safer than NSAIDs for pain in cirrhotic patients"
      ],
      "quiz": [
        {
          "question": "A patient with cirrhosis and ascites is started on diuretics. Which ratio of spironolactone to furosemide maintains potassium balance?",
          "options": [
            "25:40 mg",
            "40:100 mg",
            "100:40 mg",
            "100:100 mg"
          ],
          "correct": 2,
          "rationale": "The recommended diuretic ratio for ascites management is spironolactone 100 mg to furosemide 40 mg. Spironolactone's potassium-sparing effect offsets furosemide's potassium-wasting effect, maintaining serum potassium in the normal range."
        },
        {
          "question": "A cirrhotic patient with ascites develops fever and abdominal pain. Paracentesis shows PMN count of 350 cells/mm³. What is the diagnosis and treatment?",
          "options": [
            "Peritoneal carcinomatosis -- oncology referral",
            "Spontaneous bacterial peritonitis -- IV ceftriaxone and albumin",
            "Appendicitis -- surgical consultation",
            "Secondary bacterial peritonitis -- emergent surgery"
          ],
          "correct": 1,
          "rationale": "PMN count ≥250 cells/mm³ on paracentesis in a cirrhotic patient with ascites is diagnostic of spontaneous bacterial peritonitis (SBP). Treatment is empiric IV ceftriaxone plus IV albumin (1.5 g/kg on day 1, 1 g/kg on day 3) to prevent hepatorenal syndrome."
        },
        {
          "question": "Which medication is CONTRAINDICATED in a patient with cirrhosis and ascites?",
          "options": [
            "Acetaminophen 1 g twice daily",
            "Ibuprofen 400 mg three times daily",
            "Lactulose 30 mL twice daily",
            "Spironolactone 100 mg daily"
          ],
          "correct": 1,
          "rationale": "NSAIDs (including ibuprofen) are contraindicated in cirrhosis because they inhibit renal prostaglandin synthesis, reducing renal blood flow and worsening sodium retention, ascites, and renal function. They also increase GI bleeding risk. Acetaminophen at reduced doses (max 2 g/day) is the preferred analgesic."
        }
      ]
    },
  "cirrhosis-diagnostic-criteria-np": {
      "title": "Cirrhosis: Diagnostic Criteria",
      "cellular": {
        "title": "Non-Invasive Fibrosis Assessment & Scoring Systems",
        "content": "Diagnosing cirrhosis has evolved from mandatory liver biopsy (Metavir F4) to validated non-invasive methods. FibroScan (transient elastography) measures liver stiffness using ultrasound-based shear wave velocity: <7 kPa is normal, 7-12.5 kPa suggests significant fibrosis, >12.5 kPa suggests cirrhosis (with >95% NPV for ruling out advanced fibrosis). Serum biomarker panels include FIB-4 (combining age, AST, ALT, platelets; >3.25 suggests advanced fibrosis), APRI (AST-to-platelet ratio index), and enhanced liver fibrosis (ELF) test. The Child-Pugh classification (A=5-6, B=7-9, C=10-15) uses bilirubin, albumin, INR, ascites, and encephalopathy to stage functional severity. The MELD score (using bilirubin, INR, creatinine) predicts 3-month mortality and determines transplant priority."
      },
      "riskFactors": [
        "Same as cirrhosis-core: chronic alcohol use, HCV/HBV, NASH/MASLD, autoimmune hepatitis, metabolic liver diseases",
        "Patients with persistent transaminase elevation >6 months warrant fibrosis assessment",
        "Thrombocytopenia (<150,000) in chronic liver disease patients is often the first clue to portal hypertension",
        "Patients with any known chronic liver disease should be periodically assessed for fibrosis progression",
        "Metabolic syndrome components (obesity, diabetes, dyslipidemia) increase NASH-related fibrosis risk"
      ],
      "diagnostics": [
        "FIB-4 index: (Age x AST) / (Platelets x √ALT); <1.30 rules out advanced fibrosis; >3.25 suggests advanced fibrosis/cirrhosis; intermediate values need further testing",
        "FibroScan (transient elastography): >12.5 kPa suggests cirrhosis; limited by obesity (XL probe needed), ascites, and acute inflammation (false elevation)",
        "APRI score: (AST/ULN x 100) / platelets; >2.0 suggests cirrhosis",
        "Child-Pugh score: Bilirubin (1-3 pts), Albumin (1-3 pts), INR (1-3 pts), Ascites (1-3 pts), Encephalopathy (1-3 pts); Class A (5-6), B (7-9), C (10-15)",
        "MELD score: 3.78 x ln(bilirubin) + 11.2 x ln(INR) + 9.57 x ln(creatinine) + 6.43; range 6-40; determines transplant prioritization",
        "Liver biopsy: gold standard but invasive; reserved for diagnostic uncertainty, multiple potential etiologies, or assessing treatment response",
        "Imaging features of cirrhosis: nodular liver contour, caudate lobe hypertrophy, splenomegaly, portal vein >13mm, ascites"
      ],
      "management": [
        "Use non-invasive tests as first-line for fibrosis staging in most chronic liver disease patients",
        "Refer to hepatology when FIB-4 >3.25, FibroScan >12.5 kPa, or clinical/imaging features suggest cirrhosis",
        "Once cirrhosis confirmed: classify as compensated vs decompensated; calculate Child-Pugh and MELD scores",
        "Compensated (Child-Pugh A): treat etiology, HCC surveillance q6 months, variceal screening, avoid hepatotoxins",
        "Decompensated (Child-Pugh B/C or MELD ≥15): manage complications, refer for transplant evaluation",
        "Monitor MELD score regularly in decompensated patients for transplant listing priority",
        "Serial non-invasive fibrosis assessments to monitor treatment response (e.g., after HCV cure, alcohol cessation)"
      ],
      "nursingActions": [
        "Calculate and trend FIB-4, Child-Pugh, and MELD scores at each visit",
        "Ensure HCC surveillance protocol is implemented: ultrasound + AFP every 6 months for ALL cirrhotic patients",
        "Screen for esophageal varices by upper endoscopy at time of cirrhosis diagnosis",
        "Monitor for transition from compensated to decompensated cirrhosis: new ascites, jaundice, encephalopathy, variceal bleed",
        "Educate patients on the meaning of their scores and prognosis in understandable terms",
        "Coordinate multidisciplinary care: hepatology, nutrition (protein optimization, sodium restriction), social work (alcohol cessation support), transplant team"
      ],
      "assessmentFindings": [
        "Laboratory patterns: thrombocytopenia (often first finding, from splenic sequestration), AST > ALT, low albumin, elevated bilirubin, prolonged INR",
        "Physical findings: spider angiomata (upper body), palmar erythema, jaundice, gynecomastia, testicular atrophy, caput medusae, splenomegaly",
        "Imaging: nodular liver surface, caudate lobe hypertrophy relative to right lobe, splenomegaly, collateral vessels",
        "Decompensation markers: ascites, hepatic encephalopathy, variceal bleeding, jaundice (bilirubin >3)"
      ],
      "signs": {
        "left": [
          "Compensated cirrhosis: normal synthetic function, no ascites or encephalopathy (Child-Pugh A)",
          "FIB-4 <1.30 effectively ruling out advanced fibrosis",
          "Stable MELD score <10 with no decompensation events",
          "Liver stiffness improving after treatment of underlying cause"
        ],
        "right": [
          "MELD score ≥15 indicating need for transplant evaluation",
          "Rapidly rising MELD score (>5 point increase in 3 months)",
          "First decompensation event: new ascites, variceal bleed, or hepatic encephalopathy",
          "Child-Pugh C cirrhosis: 1-year survival only 45% without transplant",
          "Hepatocellular carcinoma detected on surveillance imaging"
        ]
      },
      "medications": [
        {
          "name": "Rifaximin (Xifaxan)",
          "type": "Non-absorbable antibiotic (rifamycin derivative)",
          "action": "Minimally absorbed oral antibiotic that acts locally in the gut to reduce ammonia-producing bacteria; does not significantly alter overall gut flora composition; reduces recurrence of hepatic encephalopathy by 58% when added to lactulose",
          "sideEffects": "Generally well-tolerated; headache, nausea, peripheral edema, ascites, C. difficile (rare despite antibiotic class)",
          "contra": "Hypersensitivity to rifaximin or rifamycin antimicrobials",
          "pearl": "550 mg BID for prevention of recurrent hepatic encephalopathy (RFHE trial); used in combination with lactulose, not as replacement; very expensive but reduces hospitalizations; minimal systemic absorption (<0.4%) so drug interactions are minimal"
        }
      ],
      "pearls": [
        "FIB-4 <1.30 has >90% NPV for excluding advanced fibrosis -- excellent first-line screening tool for primary care",
        "Child-Pugh score uses CLINICAL parameters (ascites, encephalopathy) making it somewhat subjective; MELD uses only LABORATORY values (bilirubin, INR, creatinine) making it more objective for transplant allocation",
        "Thrombocytopenia is often the FIRST laboratory abnormality in developing cirrhosis -- always evaluate platelet count <150,000 in context of liver disease risk factors",
        "FibroScan values can be falsely elevated by acute hepatitis flares, post-prandial state, cholestasis, and right heart failure -- interpret in clinical context",
        "The transition from compensated to decompensated cirrhosis carries a dramatic prognostic change: median survival drops from >12 years to ~2 years",
        "MELD-Na (incorporating sodium) is now used for transplant allocation; hyponatremia in cirrhosis indicates poor prognosis"
      ],
      "quiz": [
        {
          "question": "A patient with chronic hepatitis C has a FIB-4 score of 4.2 and FibroScan of 15.8 kPa. What do these results suggest?",
          "options": [
            "Normal liver with no fibrosis",
            "Mild hepatic steatosis",
            "Advanced fibrosis/cirrhosis requiring hepatology referral",
            "Acute hepatitis flare"
          ],
          "correct": 2,
          "rationale": "FIB-4 >3.25 and FibroScan >12.5 kPa both independently suggest advanced fibrosis or cirrhosis. These concordant results strongly indicate cirrhosis, warranting hepatology referral for comprehensive management including HCC surveillance, variceal screening, and transplant evaluation."
        },
        {
          "question": "Which scoring system is used to determine liver transplant prioritization?",
          "options": [
            "Child-Pugh score",
            "MELD score",
            "FIB-4 index",
            "APRI score"
          ],
          "correct": 1,
          "rationale": "The MELD (Model for End-stage Liver Disease) score, calculated from bilirubin, INR, and creatinine, is used for transplant organ allocation. Higher MELD scores indicate greater disease severity and receive transplant priority. Child-Pugh is useful for prognostication but is not used for transplant allocation due to its subjective components."
        },
        {
          "question": "A cirrhotic patient's platelet count drops from 180,000 to 95,000 over 6 months. What does this most likely indicate?",
          "options": [
            "Medication side effect",
            "Worsening portal hypertension with splenic sequestration",
            "Aplastic anemia",
            "Vitamin B12 deficiency"
          ],
          "correct": 1,
          "rationale": "Progressive thrombocytopenia in cirrhosis is caused by portal hypertension-induced splenomegaly and splenic sequestration of platelets. It is often the first laboratory clue to developing portal hypertension. Decreased thrombopoietin production by the failing liver also contributes."
        }
      ]
    },
  "cirrhosis-patho-np": {
      "title": "Cirrhosis Pathophysiology",
      "cellular": {
        "title": "Portal Hypertension & Splanchnic Vasodilation",
        "content": "Portal hypertension in cirrhosis results from increased intrahepatic resistance (structural: fibrosis, nodular distortion; dynamic: stellate cell contraction from decreased nitric oxide and increased endothelin-1) and increased portal blood flow (splanchnic vasodilation from excessive nitric oxide production in the mesenteric circulation). When the hepatic venous pressure gradient (HVPG) exceeds 10 mmHg, portosystemic collaterals develop at sites of portal-systemic anastomosis: esophageal varices (left gastric vein → esophageal veins), caput medusae (paraumbilical veins), hemorrhoids (superior → inferior rectal veins), and retroperitoneal shunts. Splanchnic vasodilation reduces effective arterial blood volume, triggering RAAS activation, sympathetic nervous system stimulation, and ADH release, causing renal sodium and water retention (ascites) and ultimately hepatorenal syndrome."
      },
      "riskFactors": [
        "Continued alcohol intake in alcoholic cirrhosis (accelerates fibrosis progression and portal hypertension)",
        "Untreated chronic hepatitis B or C (ongoing inflammation drives fibrosis)",
        "NASH with ongoing metabolic risk factors (obesity, insulin resistance, dyslipidemia)",
        "Portal vein thrombosis (adds pre-hepatic component to portal hypertension)",
        "TIPS dysfunction or stenosis (causes recurrent portal hypertension)",
        "Non-compliance with beta-blocker prophylaxis (increases variceal bleeding risk)",
        "Hepatocellular carcinoma with portal vein invasion"
      ],
      "diagnostics": [
        "HVPG measurement: gold standard; >5 mmHg = portal hypertension; >10 mmHg = clinically significant (variceal formation); >12 mmHg = variceal bleeding risk; >20 mmHg = treatment failure risk",
        "Upper endoscopy: grade varices (small vs large), identify red wale signs (high bleeding risk)",
        "Doppler ultrasound: portal vein diameter (>13 mm suggests portal HTN), flow direction (hepatofugal = reversed flow away from liver)",
        "Platelet count/spleen diameter ratio: <909 has high sensitivity for esophageal varices",
        "Serum-ascites albumin gradient (SAAG): ≥1.1 g/dL confirms portal hypertension as cause of ascites; <1.1 suggests non-portal hypertension cause (malignancy, TB, nephrotic syndrome)",
        "Serum ammonia level: correlates loosely with encephalopathy; trends more useful than single values"
      ],
      "management": [
        "Primary prophylaxis of variceal bleeding: non-selective beta-blocker (nadolol, propranolol, or carvedilol) for medium-large varices; alternative: endoscopic variceal ligation (EVL)",
        "Acute variceal hemorrhage: IV octreotide (250 mcg bolus then 25-50 mcg/hr infusion) + emergent EGD with EVL within 12 hours + IV ceftriaxone (antibiotic prophylaxis)",
        "Ascites management: sodium restriction <2g/day, spironolactone + furosemide, therapeutic paracentesis with albumin replacement for tense ascites",
        "Hepatic encephalopathy: lactulose titrated to 2-3 BMs/day + rifaximin 550 mg BID; identify and treat precipitants (infection, GI bleed, constipation, medications, electrolyte imbalances)",
        "Hepatorenal syndrome: IV albumin + midodrine + octreotide (or IV norepinephrine); definitive treatment is liver transplant",
        "TIPS (transjugular intrahepatic portosystemic shunt): for refractory ascites or recurrent variceal bleeding despite medical therapy; contraindicated in severe encephalopathy"
      ],
      "nursingActions": [
        "Monitor for variceal bleeding: hematemesis, melena, hematochezia, tachycardia, hypotension; have 2 large-bore IVs ready",
        "Assess hepatic encephalopathy grade: Grade I (subtle personality changes, tremor), Grade II (lethargy, asterixis), Grade III (somnolence, confusion), Grade IV (coma)",
        "Perform asterixis testing (liver flap): ask patient to dorsiflex wrists with arms extended; involuntary flapping indicates encephalopathy",
        "Monitor daily weights and abdominal girth for ascites progression",
        "Identify encephalopathy precipitants: infection (SBP), GI bleeding, constipation, medication non-compliance, electrolyte abnormalities, dehydration",
        "Calculate SAAG on paracentesis fluid to confirm portal hypertensive ascites (≥1.1 g/dL)",
        "Administer lactulose and monitor bowel movement frequency (target 2-3 soft stools/day)"
      ],
      "assessmentFindings": [
        "Ascites: shifting dullness (detects >500 mL), fluid wave (detects large volumes), abdominal distension",
        "Esophageal varices: may be asymptomatic until hemorrhage (hematemesis, melena)",
        "Hepatic encephalopathy: sleep-wake reversal (early), asterixis, confusion progressing to coma",
        "Hepatorenal syndrome: oliguria, rising creatinine without response to volume challenge, bland urine sediment",
        "Splenomegaly: palpable below left costal margin, thrombocytopenia, leukopenia",
        "Spider angiomata: blanch with central compression and refill from center outward (arterial)"
      ],
      "signs": {
        "left": [
          "Small varices without red wale signs on screening endoscopy",
          "Mild ascites controlled with low-dose diuretics",
          "Grade I encephalopathy with intact daily function",
          "Stable renal function with adequate urine output"
        ],
        "right": [
          "Massive variceal hemorrhage with hemodynamic instability -- emergent EGD and octreotide",
          "Grade IV hepatic encephalopathy (coma) -- ICU admission, intubation for airway protection",
          "Refractory ascites requiring repeated paracentesis or TIPS consideration",
          "Hepatorenal syndrome type 1: creatinine doubling in <2 weeks with no response to albumin challenge",
          "Spontaneous bacterial peritonitis with sepsis"
        ]
      },
      "medications": [
        {
          "name": "Octreotide",
          "type": "Somatostatin analogue",
          "action": "Inhibits release of vasodilatory hormones (glucagon) from the splanchnic circulation, causing splanchnic vasoconstriction and reducing portal blood flow and pressure; reduces variceal bleeding",
          "sideEffects": "Hyperglycemia (inhibits insulin release), bradycardia, GI cramps, diarrhea/steatorrhea, gallstone formation (long-term)",
          "contra": "Known hypersensitivity; use with caution in diabetes (glucose monitoring needed)",
          "pearl": "IV bolus 50 mcg then continuous infusion 25-50 mcg/hr for acute variceal hemorrhage; continue for 3-5 days; used adjunctively with emergent EGD and EVL; also used with midodrine and albumin for hepatorenal syndrome (off-label)"
        },
        {
          "name": "Nadolol",
          "type": "Non-selective beta-blocker",
          "action": "Blocks beta-1 (reduces cardiac output) and beta-2 (permits unopposed alpha-mediated splanchnic vasoconstriction) receptors, reducing portal blood flow and portal pressure; decreases HVPG and variceal bleeding risk",
          "sideEffects": "Bradycardia, hypotension, fatigue, bronchospasm, masking of hypoglycemia symptoms",
          "contra": "Decompensated heart failure, severe bradycardia (<50), COPD/asthma (non-selective beta blockade), refractory ascites with SBP <90 (beta-blockers may worsen hemodynamics in very advanced cirrhosis)",
          "pearl": "Titrate to resting heart rate of 55-60 bpm; non-selective beta-blockade is essential (beta-2 blockade causes splanchnic vasoconstriction); carvedilol has additional anti-alpha1 effect providing greater portal pressure reduction; CONTRAINDICATE in advanced decompensated cirrhosis with refractory ascites (worsens survival)"
        }
      ],
      "pearls": [
        "SAAG ≥1.1 g/dL = portal hypertensive ascites (cirrhosis, heart failure, Budd-Chiari); SAAG <1.1 = non-portal hypertensive (malignancy, TB, nephrotic syndrome, pancreatitis)",
        "Non-selective beta-blockers (NOT selective beta-1 blockers like metoprolol) are required for variceal prophylaxis -- beta-2 blockade causes splanchnic vasoconstriction which is the key mechanism",
        "In VERY advanced/decompensated cirrhosis with refractory ascites, SBP <90, or hepatorenal syndrome, non-selective beta-blockers may WORSEN hemodynamics and survival (the 'window' hypothesis)",
        "Acute variceal hemorrhage: ABCs + 2 large-bore IVs + blood products + octreotide IV + ceftriaxone (antibiotic prophylaxis reduces mortality) + emergent EGD within 12 hours",
        "Hepatic encephalopathy precipitants (MNEMONIC: HEPATICS): Hemorrhage, Electrolyte imbalance, Protein excess, Azotemia, Toxins/drugs (sedatives, opioids), Infection (SBP), Constipation, Shunts",
        "Lactulose works by acidifying the colon (NH3 → NH4+, which cannot be absorbed) AND by osmotic laxative effect increasing fecal ammonia excretion"
      ],
      "quiz": [
        {
          "question": "A paracentesis fluid analysis shows SAAG of 1.8 g/dL and protein of 1.2 g/dL. What does this indicate?",
          "options": [
            "Malignant ascites",
            "Portal hypertensive ascites (e.g., cirrhosis)",
            "Tuberculous peritonitis",
            "Nephrotic syndrome-related ascites"
          ],
          "correct": 1,
          "rationale": "SAAG ≥1.1 g/dL indicates portal hypertension as the cause of ascites (cirrhosis, heart failure, Budd-Chiari). Low ascitic protein (<2.5 g/dL) further suggests cirrhosis rather than cardiac ascites (which typically has protein >2.5 g/dL). SAAG <1.1 would suggest non-portal hypertensive causes."
        },
        {
          "question": "Why is metoprolol (selective beta-1 blocker) NOT appropriate for variceal bleeding prophylaxis?",
          "options": [
            "It causes too much bradycardia",
            "It lacks beta-2 blockade, which is needed for splanchnic vasoconstriction to reduce portal pressure",
            "It is metabolized by the liver and accumulates in cirrhosis",
            "It interacts with lactulose"
          ],
          "correct": 1,
          "rationale": "Variceal bleeding prophylaxis requires NON-selective beta-blockers (nadolol, propranolol, carvedilol) because beta-2 blockade causes splanchnic vasoconstriction, reducing portal blood flow. Selective beta-1 blockers only reduce cardiac output without the crucial splanchnic vasoconstriction."
        },
        {
          "question": "A cirrhotic patient with encephalopathy is found to be constipated and has not had a bowel movement in 3 days. How does this relate to the encephalopathy?",
          "options": [
            "Constipation is unrelated to encephalopathy",
            "Constipation increases colonic ammonia absorption, worsening encephalopathy",
            "Constipation causes hepatorenal syndrome",
            "Constipation indicates lactulose is working"
          ],
          "correct": 1,
          "rationale": "Constipation is a common precipitant of hepatic encephalopathy. Slow colonic transit increases the time for bacterial ammonia production and absorption into the portal circulation. Lactulose treats both problems: it acidifies the colon (trapping ammonia as NH4+) and its osmotic laxative effect increases fecal ammonia elimination."
        }
      ]
    },
  "ckd-diagnostic-criteria-np": {
      "title": "CKD: Diagnostic Criteria",
      "cellular": {
        "title": "CKD Staging & Diagnostic Framework",
        "content": "Chronic kidney disease is defined as kidney damage (albuminuria, structural abnormalities) or GFR <60 mL/min/1.73m² persisting for ≥3 months. The CKD-EPI (Chronic Kidney Disease Epidemiology Collaboration) equation is preferred for eGFR calculation, using serum creatinine, age, sex, and (previously) race. KDIGO staging combines GFR categories (G1: ≥90, G2: 60-89, G3a: 45-59, G3b: 30-44, G4: 15-29, G5: <15) with albuminuria categories (A1: <30 mg/g, A2: 30-300 mg/g, A3: >300 mg/g) to create a risk matrix for progression. Albuminuria is the most sensitive early marker of diabetic nephropathy and an independent cardiovascular risk factor. Two abnormal values ≥3 months apart confirm the diagnosis and exclude acute kidney injury."
      },
      "riskFactors": [
        "Diabetes mellitus (leading cause of CKD in developed countries; ~40% of CKD cases)",
        "Hypertension (second leading cause; both cause and consequence of CKD)",
        "Glomerulonephritis (IgA nephropathy, lupus nephritis, FSGS)",
        "Polycystic kidney disease (most common genetic cause)",
        "Recurrent pyelonephritis or urinary tract obstruction",
        "Cardiovascular disease (bidirectional relationship with CKD)",
        "Obesity, metabolic syndrome",
        "Nephrotoxic medications: NSAIDs (chronic use), aminoglycosides, lithium, contrast agents",
        "African American, Hispanic, Native American race (higher CKD prevalence and progression)",
        "Family history of kidney disease",
        "Age >60 years"
      ],
      "diagnostics": [
        "Serum creatinine with eGFR calculation (CKD-EPI equation): two values ≥3 months apart showing eGFR <60 confirms CKD",
        "Urine albumin-to-creatinine ratio (UACR): spot sample; A1 (<30) normal, A2 (30-300) moderately increased, A3 (>300) severely increased",
        "Urinalysis: proteinuria, hematuria, casts (RBC casts = glomerulonephritis, WBC casts = pyelonephritis/interstitial nephritis, waxy casts = advanced CKD)",
        "Renal ultrasound: kidney size (small echogenic kidneys = chronic scarring; large kidneys = diabetic nephropathy, PKD, amyloidosis), hydronephrosis, cysts",
        "Serum cystatin C: alternative to creatinine for eGFR; less affected by muscle mass, useful in elderly and extreme body habitus",
        "BMP: electrolytes (hyperkalemia, hyperphosphatemia, metabolic acidosis), calcium",
        "CBC: normocytic anemia from decreased erythropoietin production",
        "Renal biopsy: for unexplained CKD, nephrotic syndrome, rapidly progressive GN, or when diagnosis impacts management"
      ],
      "management": [
        "Slow progression: ACEi or ARB for all patients with albuminuria (reduces intraglomerular pressure); BP target <130/80",
        "SGLT2 inhibitors (dapagliflozin, empagliflozin): indicated for CKD with eGFR ≥20 regardless of diabetes status (DAPA-CKD and EMPA-KIDNEY trials); reduces CKD progression and cardiovascular events",
        "Finerenone (non-steroidal MRA): for diabetic kidney disease with albuminuria on maximized ACEi/ARB",
        "Blood pressure control: target <130/80; ACEi/ARB first-line; avoid in bilateral renal artery stenosis",
        "Glycemic control in diabetic CKD: HbA1c target ~7%; SGLT2 inhibitors if eGFR ≥20; dose-adjust metformin by eGFR (contraindicated if <30)",
        "Manage CKD complications: anemia (ESAs when Hgb <10), mineral bone disease (phosphate binders, vitamin D), metabolic acidosis (sodium bicarbonate if HCO3 <22), hyperkalemia",
        "Nephrology referral: eGFR <30, rapidly declining GFR, persistent albuminuria A3, refractory HTN, electrolyte abnormalities, unclear etiology"
      ],
      "nursingActions": [
        "Calculate and trend eGFR and UACR at each visit; stage CKD using KDIGO GFR + albuminuria matrix",
        "Ensure ACEi/ARB or SGLT2 inhibitor is prescribed for all CKD patients with albuminuria; check BMP 1-2 weeks after initiation",
        "Review medication list for nephrotoxic drugs: NSAIDs, certain antibiotics (aminoglycosides), contrast agents; dose-adjust renally-cleared medications",
        "Educate on sodium restriction (<2g/day), protein moderation (0.8 g/kg/day in advanced CKD), potassium awareness",
        "Monitor for CKD complications: anemia (CBC every 6-12 months), mineral bone disease (calcium, phosphorus, PTH, vitamin D annually for stages 3-5)",
        "Counsel on avoiding contrast dye when possible; if contrast needed, ensure pre- and post-hydration protocol",
        "Coordinate nephrology referral when eGFR <30 or rapidly declining; begin dialysis access planning at eGFR <20"
      ],
      "assessmentFindings": [
        "Often asymptomatic in early stages (G1-G3a); detected by laboratory screening",
        "Fatigue, decreased appetite, nausea (uremic symptoms in G4-G5)",
        "Peripheral edema, hypertension, volume overload",
        "Pallor (anemia from decreased erythropoietin)",
        "Uremic frost (late finding in severe uremia), pruritus, restless legs",
        "Small echogenic kidneys on ultrasound (chronic scarring)",
        "Pericardial friction rub (uremic pericarditis -- indication for emergent dialysis)"
      ],
      "signs": {
        "left": [
          "CKD G1-G2 with albuminuria: normal eGFR, treatable with RAAS blockade and SGLT2i",
          "Stable CKD G3a responding to medical management",
          "Mild anemia correctable with iron supplementation"
        ],
        "right": [
          "Rapidly progressive GN: rapidly declining GFR over weeks-months requiring urgent biopsy and treatment",
          "Uremic emergency: pericarditis, encephalopathy, severe hyperkalemia -- indication for emergent dialysis",
          "CKD G5: eGFR <15, preparing for renal replacement therapy (dialysis or transplant)",
          "Severe hyperkalemia (K+ >6.5) with ECG changes (peaked T waves, widened QRS)",
          "Pulmonary edema from volume overload refractory to diuretics"
        ]
      },
      "medications": [
        {
          "name": "Dapagliflozin (Farxiga)",
          "type": "SGLT2 inhibitor",
          "action": "Blocks sodium-glucose cotransporter 2 in the proximal tubule, reducing glucose and sodium reabsorption; causes osmotic diuresis and natriuresis; restores tubuloglomerular feedback, reducing intraglomerular pressure and hyperfiltration; provides renoprotective, cardioprotective, and glycemic benefits independent of diabetes status",
          "sideEffects": "Genital mycotic infections (vulvovaginal candidiasis in women, balanitis in men), UTI, volume depletion, euglycemic DKA (rare, mainly in type 1 DM), Fournier gangrene (rare)",
          "contra": "Type 1 diabetes (DKA risk), eGFR <20 (for initiation; can continue if already on therapy), dialysis, recurrent UTIs or genital infections",
          "pearl": "DAPA-CKD trial showed 39% reduction in CKD progression in patients with eGFR 25-75 regardless of diabetes status; 10 mg daily; initial eGFR dip (10-15%) is expected and hemodynamically mediated (like ACEi) -- do NOT discontinue; can be used down to eGFR 20 for initiation"
        }
      ],
      "pearls": [
        "CKD requires TWO abnormal values ≥3 months apart (eGFR <60 OR albuminuria) to distinguish from AKI",
        "SGLT2 inhibitors are now indicated for CKD with albuminuria REGARDLESS of diabetes status (DAPA-CKD, EMPA-KIDNEY); one of the most important advances in nephrology",
        "An initial 10-15% eGFR dip with ACEi/ARB or SGLT2i is EXPECTED and reflects reduced intraglomerular pressure (the renoprotective mechanism) -- do NOT discontinue unless rise >30%",
        "UACR >30 mg/g (A2) is the earliest marker of diabetic nephropathy and independently predicts cardiovascular risk",
        "CKD-EPI equation: the race coefficient was removed in 2021 to address health disparities",
        "KDIGO heat map combines GFR stage (G1-G5) and albuminuria category (A1-A3) to assign risk color: green (low), yellow (moderate), orange (high), red (very high) -- determines monitoring frequency and treatment intensity"
      ],
      "quiz": [
        {
          "question": "A 55-year-old diabetic patient has eGFR of 48 and UACR of 180 mg/g confirmed on repeat testing. Which medication provides the strongest evidence for slowing CKD progression?",
          "options": [
            "Metformin",
            "Dapagliflozin (SGLT2 inhibitor)",
            "Amlodipine",
            "Furosemide"
          ],
          "correct": 1,
          "rationale": "SGLT2 inhibitors (dapagliflozin, empagliflozin) have the strongest recent evidence for slowing CKD progression. The DAPA-CKD trial showed a 39% reduction in the composite of sustained eGFR decline, ESKD, and renal/CV death, regardless of diabetes status. This patient should be on an ACEi/ARB AND an SGLT2 inhibitor."
        },
        {
          "question": "Two weeks after starting an ACEi, a CKD patient's creatinine rises from 1.5 to 1.8 mg/dL (20% increase). What should the NP do?",
          "options": [
            "Immediately discontinue the ACEi",
            "Continue the ACEi -- up to a 30% creatinine rise is expected and reflects the renoprotective mechanism",
            "Double the ACEi dose for greater protection",
            "Switch to an ARB"
          ],
          "correct": 1,
          "rationale": "A creatinine rise up to 30% after initiating ACEi/ARB or SGLT2i is expected and reflects reduced intraglomerular pressure from efferent arteriolar dilation -- this IS the renoprotective mechanism. Discontinuation should only occur if the rise exceeds 30%, hyperkalemia develops, or symptoms of AKI appear."
        },
        {
          "question": "Which is the earliest laboratory marker of diabetic nephropathy?",
          "options": [
            "Elevated serum creatinine",
            "Microalbuminuria (UACR 30-300 mg/g)",
            "Hematuria",
            "Elevated BUN"
          ],
          "correct": 1,
          "rationale": "Microalbuminuria (UACR 30-300 mg/g, now termed moderately increased albuminuria or A2) is the earliest detectable marker of diabetic nephropathy, preceding GFR decline by years. Annual UACR screening is recommended for all diabetic patients. It is also an independent cardiovascular risk factor."
        }
      ]
    },
  "ckd-medication-adjustments-np": {
      "title": "CKD: Medication Adjustments",
      "cellular": {
        "title": "Pharmacokinetics in Renal Impairment",
        "content": "Renal impairment profoundly alters drug pharmacokinetics. Reduced GFR decreases clearance of renally-excreted drugs, leading to accumulation and toxicity. Uremia also affects non-renal pathways: decreased protein binding (uremic toxins displace drugs from albumin, increasing free drug fraction of highly protein-bound drugs like phenytoin and warfarin), altered hepatic metabolism (CYP3A4 activity reduced by ~30% in severe CKD), decreased intestinal absorption (uremic gastroparesis, altered gut pH), and increased volume of distribution (edema, altered body composition). Drug dosing in CKD requires adjustment by either reducing the dose (maintaining interval) or extending the interval (maintaining dose), depending on whether efficacy depends on peak concentration or sustained levels."
      },
      "riskFactors": [
        "Polypharmacy (CKD patients take an average of 10-12 medications)",
        "Rapidly changing renal function (requires frequent dose reassessment)",
        "Elderly patients with age-related GFR decline and comorbidities",
        "Diabetes with fluctuating glucose control (affects drug metabolism and renal function)",
        "Heart failure with cardiorenal syndrome (variable renal perfusion)",
        "Dialysis patients (drug removal during dialysis sessions)",
        "Over-the-counter NSAID use (nephrotoxic and commonly used without provider knowledge)",
        "Herbal supplements with nephrotoxic potential (aristolochic acid, ephedra)"
      ],
      "diagnostics": [
        "Calculate eGFR (CKD-EPI) at every prescribing encounter for renally-dosed medications",
        "Monitor drug levels for narrow therapeutic index medications: vancomycin (trough 10-20), digoxin (0.5-0.9 in CKD/HF), lithium, aminoglycosides, phenytoin",
        "Adjust phenytoin level for hypoalbuminemia: Corrected phenytoin = measured phenytoin / (0.2 x albumin + 0.1)",
        "Monitor BMP (K+, creatinine, BUN) with RAAS blockade, diuretics, and potassium-affecting medications",
        "Monitor CBC with medications that suppress bone marrow and are renally cleared",
        "Review all medications at each visit using a renal dosing reference (Lexicomp, clinical pharmacist)",
        "Check for drug-drug interactions that are amplified in CKD (e.g., ACEi + K+-sparing diuretic + NSAID = severe hyperkalemia)"
      ],
      "management": [
        "Metformin: safe if eGFR >30; reduce dose to 1000 mg/day max if eGFR 30-45; contraindicated if eGFR <30 (lactic acidosis risk)",
        "NSAIDs: AVOID in CKD (reduce GFR, increase hyperkalemia risk, worsen HTN and edema); if absolutely needed, use lowest dose for shortest duration",
        "Gabapentin/pregabalin: dose reduce significantly in CKD (gabapentin: 300 mg TID if eGFR >60; 300 mg BID if 30-60; 300 mg daily if 15-30; 300 mg every other day if <15)",
        "Opioids: avoid morphine (active metabolite M6G accumulates → respiratory depression); hydromorphone is safer; fentanyl is preferred in severe CKD/dialysis",
        "Antibiotics: vancomycin and aminoglycosides require trough-based dosing; fluoroquinolones need dose adjustment; nitrofurantoin ineffective if eGFR <30",
        "Anticoagulants: warfarin does NOT require dose adjustment (hepatic metabolism) but CKD patients have increased bleeding risk; DOACs need dose reduction (rivaroxaban, apixaban adjust below eGFR 50; dabigatran contraindicated if CrCl <30)",
        "Allopurinol: start 100 mg/day and titrate slowly in CKD; dose limit based on CrCl"
      ],
      "nursingActions": [
        "Systematically review ALL medications against current eGFR at each visit; use renal dosing charts or clinical pharmacist support",
        "Identify and discontinue nephrotoxic medications: NSAIDs, certain antibiotics, contrast agents where possible",
        "Counsel patients to avoid OTC NSAIDs (ibuprofen, naproxen) -- most common patient-acquired nephrotoxin",
        "Adjust doses when eGFR changes significantly (>20% change or crossing a dosing threshold)",
        "Monitor therapeutic drug levels for narrow TI medications and adjust per renal dosing guidelines",
        "Coordinate with pharmacy for dialysis-specific dosing: determine if drug is removed by dialysis and whether supplemental dosing is needed post-dialysis",
        "Educate patients to inform ALL providers of their kidney disease and current eGFR"
      ],
      "assessmentFindings": [
        "Drug toxicity signs: sedation/confusion (opioids, gabapentin accumulation), bleeding (anticoagulant excess), hypoglycemia (sulfonylurea/insulin accumulation), ototoxicity (aminoglycosides)",
        "Uremic symptoms worsening despite stable GFR may indicate medication accumulation",
        "Volume overload from sodium-retaining medications (NSAIDs, steroids) in CKD patients",
        "Hyperkalemia from ACEi/ARB/MRA accumulation or NSAID-induced reduced potassium excretion",
        "Metformin-associated lactic acidosis (rare but fatal): abdominal pain, tachypnea, confusion, elevated lactate"
      ],
      "signs": {
        "left": [
          "Medications appropriately dosed for current eGFR",
          "Therapeutic drug levels within target range",
          "No evidence of drug accumulation or toxicity",
          "Patient educated on nephrotoxin avoidance"
        ],
        "right": [
          "Morphine toxicity in CKD: respiratory depression from M6G metabolite accumulation",
          "Metformin-associated lactic acidosis: Kussmaul breathing, elevated lactate >5, shock",
          "Vancomycin nephrotoxicity: rising creatinine with supratherapeutic trough levels",
          "Severe hyperkalemia from triple whammy (ACEi + spironolactone + NSAID) with ECG changes",
          "Digoxin toxicity in renal impairment: nausea, visual changes, bradycardia, arrhythmias"
        ]
      },
      "medications": [
        {
          "name": "Metformin",
          "type": "Biguanide antidiabetic",
          "action": "Reduces hepatic glucose production and improves insulin sensitivity; does not cause hypoglycemia as monotherapy; renally cleared without metabolism",
          "sideEffects": "GI upset (nausea, diarrhea), metallic taste, lactic acidosis (rare, primarily in renal impairment), B12 deficiency (long-term use)",
          "contra": "eGFR <30 (FDA updated from blanket creatinine cutoffs to eGFR-based guidance); acute/unstable HF; conditions predisposing to lactic acidosis; hold 48 hours before and after IV contrast",
          "pearl": "Safe at eGFR >45 (no dose adjustment); reduce max dose to 1000 mg/day if eGFR 30-45; contraindicated if eGFR <30; hold before IV contrast and restart 48 hours later after confirming stable renal function; the old blanket contraindication at creatinine >1.5 (men) or >1.4 (women) is OUTDATED"
        }
      ],
      "pearls": [
        "AVOID morphine in CKD -- its active metabolite morphine-6-glucuronide (M6G) accumulates and causes prolonged respiratory depression; hydromorphone or fentanyl are safer alternatives",
        "Metformin is SAFE in CKD with eGFR >30 (updated FDA guidance replaced the old creatinine-based cutoffs); reduce dose if eGFR 30-45; contraindicated if <30",
        "The 'triple whammy' of ACEi/ARB + diuretic + NSAID is the most common cause of preventable drug-induced AKI -- counsel ALL CKD patients to avoid NSAIDs",
        "Gabapentin accumulation in CKD causes sedation, ataxia, and myoclonus -- dose MUST be reduced; many providers fail to adjust for renal function",
        "Nitrofurantoin is INEFFECTIVE if eGFR <30 because it cannot achieve adequate urinary concentrations; also risks peripheral neuropathy in CKD",
        "Phenytoin level must be corrected for albumin in CKD: Adjusted level = measured level / (0.2 × albumin + 0.1); without correction, levels appear falsely low leading to overdosing"
      ],
      "quiz": [
        {
          "question": "A patient with eGFR 25 is prescribed morphine for chronic pain. Why is this inappropriate?",
          "options": [
            "Morphine is hepatotoxic in renal failure",
            "Morphine's active metabolite M6G accumulates in CKD, causing prolonged respiratory depression",
            "Morphine is ineffective in CKD patients",
            "Morphine causes acute kidney injury"
          ],
          "correct": 1,
          "rationale": "Morphine is renally cleared, and its active metabolite morphine-6-glucuronide (M6G) accumulates in CKD, causing prolonged sedation and potentially fatal respiratory depression. Hydromorphone or fentanyl (hepatically metabolized) are safer alternatives in severe CKD."
        },
        {
          "question": "A diabetic patient has eGFR of 38. Should metformin be continued?",
          "options": [
            "No -- metformin is contraindicated at any GFR below 60",
            "Yes -- at full dose with no adjustment needed",
            "Yes -- but reduce the maximum dose to 1000 mg/day",
            "No -- switch to insulin immediately"
          ],
          "correct": 2,
          "rationale": "Per updated FDA guidance, metformin is safe at eGFR ≥30 but should be dose-reduced (max 1000 mg/day) when eGFR is 30-45 due to increased lactic acidosis risk. It should be discontinued if eGFR falls below 30."
        },
        {
          "question": "A CKD patient on lisinopril and furosemide takes ibuprofen for back pain and develops AKI. What is the mechanism?",
          "options": [
            "Ibuprofen allergy",
            "Triple whammy: NSAID constricts afferent arteriole + ACEi dilates efferent arteriole + diuretic reduces volume, all reducing GFR simultaneously",
            "Furosemide toxicity",
            "Lisinopril overdose"
          ],
          "correct": 1,
          "rationale": "The 'triple whammy' combines three mechanisms that reduce GFR: NSAIDs block prostaglandin-mediated afferent arteriolar dilation, ACEi/ARBs dilate the efferent arteriole, and diuretics reduce intravascular volume. Together, they can cause severe AKI, especially in patients with underlying CKD."
        }
      ]
    },
  "ckd-progression-patho-np": {
      "title": "CKD Progression Pathophysiology",
      "cellular": {
        "title": "Nephron Loss & Maladaptive Hyperfiltration",
        "content": "CKD progression follows a common final pathway regardless of the initial insult. When nephrons are lost, remaining nephrons undergo compensatory hyperfiltration (increased single-nephron GFR) to maintain total GFR temporarily. This maladaptive response involves afferent arteriolar dilation and efferent vasoconstriction (mediated by angiotensin II), increasing intraglomerular pressure and flow. The resulting glomerular hypertension damages the glomerular basement membrane, causes podocyte injury and detachment, and leads to proteinuria. Filtered proteins are toxic to tubular epithelial cells, triggering tubulointerstitial inflammation and fibrosis through TGF-beta, NF-kB, and complement activation. This creates a self-perpetuating cycle: nephron loss → hyperfiltration → glomerular injury → proteinuria → tubulointerstitial fibrosis → more nephron loss. RAAS blockade (ACEi/ARB) and SGLT2 inhibitors interrupt this cycle by reducing intraglomerular pressure."
      },
      "riskFactors": [
        "Persistent proteinuria/albuminuria (strongest predictor of CKD progression; higher proteinuria = faster decline)",
        "Uncontrolled hypertension (accelerates nephrosclerosis and glomerular damage)",
        "Uncontrolled diabetes (glycation of GBM, mesangial expansion, nodular glomerulosclerosis)",
        "Acute kidney injury episodes (each AKI episode accelerates CKD progression)",
        "Smoking (renal vasoconstriction, oxidative stress, accelerated atherosclerosis)",
        "Obesity (hyperfiltration, lipotoxicity, adipokine-mediated inflammation)",
        "Nephrotoxin exposure (NSAIDs, aminoglycosides, contrast agents)",
        "High dietary sodium intake (counteracts RAAS blockade, increases proteinuria)",
        "Non-adherence to RAAS blockade or SGLT2 inhibitor therapy"
      ],
      "diagnostics": [
        "eGFR trajectory: calculate rate of decline; >5 mL/min/year is rapid progression requiring investigation",
        "Serial UACR monitoring: increasing proteinuria indicates accelerating nephron damage",
        "Renal ultrasound: progressive decrease in kidney size indicates chronic scarring",
        "Kidney biopsy: if cause of CKD unclear or rapidly progressive decline",
        "Monitor for complications as GFR declines: anemia (Hgb, iron studies), mineral bone disease (Ca, PO4, PTH, vitamin D), metabolic acidosis (HCO3)",
        "24-hour urine protein if UACR is borderline or to quantify protein loss precisely"
      ],
      "management": [
        "Maximize RAAS blockade: ACEi or ARB titrated to maximum tolerated dose; reduces proteinuria and slows progression",
        "Add SGLT2 inhibitor (dapagliflozin or empagliflozin) for additional renoprotection regardless of diabetes status",
        "Add finerenone (non-steroidal MRA) for diabetic CKD with persistent albuminuria on maximal ACEi/ARB (FIDELIO-DKD trial)",
        "Blood pressure target <130/80; essential to slow progression",
        "Glycemic control: HbA1c ~7% for most; avoid over-tight control in advanced CKD (hypoglycemia risk increases as insulin clearance decreases)",
        "Sodium restriction <2 g/day (amplifies RAAS blockade efficacy)",
        "Protein moderation: 0.8 g/kg/day in CKD G3-5 (reduces hyperfiltration); avoid very low protein diets (<0.6 g/kg) without dietitian supervision",
        "Smoking cessation, weight management, avoid nephrotoxins"
      ],
      "nursingActions": [
        "Track eGFR slope over time: calculate annual rate of decline; refer urgently if >5 mL/min/year",
        "Maximize RAAS blockade dose: uptitrate ACEi/ARB to guideline-recommended targets; monitor BMP 1-2 weeks after each adjustment",
        "Ensure SGLT2 inhibitor is prescribed for eligible patients (eGFR ≥20 with albuminuria)",
        "Counsel on sodium restriction (<2 g/day) -- critical for augmenting RAAS blockade efficacy",
        "Identify and eliminate nephrotoxin exposure: NSAIDs, herbal supplements, contrast agents",
        "Educate on the importance of each medication in the renoprotective regimen and consequences of non-adherence",
        "Coordinate dietary counseling: protein moderation, potassium awareness, sodium restriction"
      ],
      "assessmentFindings": [
        "Increasing proteinuria on serial UACR measurements (indicates worsening glomerular damage)",
        "Progressive eGFR decline over serial measurements",
        "Worsening hypertension despite medication compliance",
        "New anemia (decreasing Hgb from reduced erythropoietin production)",
        "Rising phosphorus with decreasing calcium (secondary hyperparathyroidism)",
        "Metabolic acidosis (decreasing serum bicarbonate <22 mEq/L)"
      ],
      "signs": {
        "left": [
          "Stable eGFR trajectory on maximized medical therapy",
          "Decreasing proteinuria in response to RAAS blockade (indicates effective treatment)",
          "Blood pressure at target <130/80",
          "Expected initial eGFR dip (10-15%) after starting ACEi/ARB or SGLT2i"
        ],
        "right": [
          "Rapid GFR decline >5 mL/min/year despite optimal therapy -- evaluate for superimposed disease",
          "Nephrotic-range proteinuria (>3.5 g/day) with hypoalbuminemia and edema",
          "CKD stage 5 (eGFR <15) requiring dialysis access planning",
          "Refractory hyperkalemia despite dietary restriction and medication adjustment",
          "Severe metabolic acidosis with Kussmaul breathing (pH <7.2)"
        ]
      },
      "medications": [
        {
          "name": "Finerenone (Kerendia)",
          "type": "Non-steroidal mineralocorticoid receptor antagonist",
          "action": "Selectively blocks the mineralocorticoid receptor in the kidney and heart; reduces fibrosis, inflammation, and sodium retention; unlike spironolactone, minimal anti-androgen effects; FIDELIO-DKD showed 18% reduction in CKD progression in diabetic CKD patients on RAAS blockade",
          "sideEffects": "Hyperkalemia (primary concern; monitor K+ closely), hypotension, decreased eGFR (expected initial dip)",
          "contra": "K+ >5.0, eGFR <25 for initiation, severe hepatic impairment (Child-Pugh C), concurrent strong CYP3A4 inhibitors, concurrent use with other MRAs",
          "pearl": "Add to maximized ACEi/ARB in diabetic CKD with persistent albuminuria; start 10 mg if eGFR 25-60 or 20 mg if eGFR >60; check K+ at 4 weeks and periodically; provides additional renoprotection beyond ACEi/ARB and SGLT2i; the stacking of ACEi/ARB + SGLT2i + finerenone represents the current optimal renoprotective regimen"
        }
      ],
      "pearls": [
        "Proteinuria is BOTH a marker and a MEDIATOR of CKD progression -- reducing proteinuria with RAAS blockade directly slows kidney damage",
        "The modern CKD progression-slowing regimen: ACEi/ARB (maximum dose) + SGLT2 inhibitor + finerenone (for diabetic CKD) + BP <130/80 + sodium restriction",
        "An initial eGFR dip of 10-15% after starting ACEi/ARB or SGLT2i is EXPECTED and reflects reduced intraglomerular pressure (the protective mechanism) -- do NOT stop the medication",
        "Each AKI episode accelerates CKD progression -- AKI is NOT fully reversible; prevention is critical",
        "Sodium restriction (<2 g/day) is critical -- high sodium intake directly counteracts the renoprotective effects of RAAS blockade by expanding volume and increasing intraglomerular pressure",
        "eGFR slope (rate of decline) is more clinically important than a single eGFR value -- track trajectory over time"
      ],
      "quiz": [
        {
          "question": "Why do remaining nephrons undergo hyperfiltration when nephrons are lost in CKD?",
          "options": [
            "It is a beneficial adaptation with no consequences",
            "Remaining nephrons increase their single-nephron GFR to compensate, but this maladaptive response causes glomerular hypertension, proteinuria, and progressive nephron damage",
            "The kidneys regenerate new nephrons to replace lost ones",
            "Hyperfiltration only occurs in diabetic nephropathy"
          ],
          "correct": 1,
          "rationale": "Compensatory hyperfiltration is initially adaptive (maintaining total GFR) but ultimately maladaptive. Increased intraglomerular pressure damages glomeruli, causes proteinuria, and triggers tubulointerstitial fibrosis -- creating a self-perpetuating cycle of nephron loss. ACEi/ARBs and SGLT2 inhibitors reduce intraglomerular pressure, breaking this cycle."
        },
        {
          "question": "A patient with diabetic CKD is on maximum-dose lisinopril and empagliflozin but still has UACR of 250 mg/g. What additional medication can be added?",
          "options": [
            "Another ARB (dual RAAS blockade)",
            "Finerenone (non-steroidal MRA)",
            "Amlodipine",
            "Metformin"
          ],
          "correct": 1,
          "rationale": "Finerenone is a non-steroidal MRA approved for diabetic CKD with persistent albuminuria despite maximized ACEi/ARB therapy. The FIDELIO-DKD trial showed additional 18% reduction in CKD progression. This represents the third pillar of the modern renoprotective regimen. Dual ACEi/ARB is contraindicated."
        },
        {
          "question": "Which factor most strongly predicts CKD progression?",
          "options": [
            "Patient's age",
            "Serum creatinine level",
            "Degree of proteinuria/albuminuria",
            "Blood glucose level"
          ],
          "correct": 2,
          "rationale": "Proteinuria/albuminuria is the strongest independent predictor of CKD progression. It is both a marker of glomerular damage and a direct mediator of tubulointerstitial fibrosis. Higher proteinuria levels predict faster GFR decline, which is why reducing proteinuria with RAAS blockade is the primary therapeutic target."
        }
      ]
    },
  "ckd-staging-np": {
      "title": "CKD Staging",
      "cellular": {
        "title": "KDIGO GFR & Albuminuria Classification",
        "content": "The KDIGO classification stages CKD using a two-dimensional matrix combining GFR categories and albuminuria categories. GFR stages: G1 (≥90, normal), G2 (60-89, mildly decreased), G3a (45-59, mild-moderate), G3b (30-44, moderate-severe), G4 (15-29, severe), G5 (<15, kidney failure). Albuminuria categories: A1 (<30 mg/g, normal), A2 (30-300, moderately increased/microalbuminuria), A3 (>300, severely increased/macroalbuminuria). G1-G2 require evidence of kidney damage (albuminuria, structural abnormality) to qualify as CKD. The heat map assigns risk colors guiding monitoring frequency: green (annual), yellow (annual), orange (every 6 months), red (every 3 months). Management intensity increases with both declining GFR and increasing albuminuria."
      },
      "riskFactors": [
        "All CKD risk factors apply for staging assessment",
        "Stage G3a is the most common stage at diagnosis (often incidental finding)",
        "Rapid progression (>5 mL/min/year decline) may skip stages",
        "Acute-on-chronic kidney injury can cause apparent stage worsening that may partially reverse",
        "Albuminuria progression (A1 → A2 → A3) often precedes GFR decline in diabetic nephropathy",
        "Elderly patients may have stable low GFR (G3a) without progressive CKD (age-related nephron loss)"
      ],
      "diagnostics": [
        "eGFR via CKD-EPI equation: two values ≥3 months apart confirming persistence",
        "UACR: spot urine sample; confirm abnormal result on repeat testing (exclude transient causes: exercise, fever, UTI, menstruation)",
        "Combine GFR category (G1-G5) and albuminuria category (A1-A3) for complete staging",
        "KDIGO heat map determines: monitoring frequency, intensity of RAAS blockade, referral timing, complication screening frequency",
        "Rate of eGFR decline: calculate slope from serial values; >5 mL/min/year = rapid progression",
        "Stage-appropriate complication screening: G3a+: electrolytes, calcium, phosphorus, PTH annually; G4+: add Hgb, iron studies every 6 months"
      ],
      "management": [
        "G1-G2: manage risk factors (BP, glucose, lipids); ACEi/ARB if albuminuria A2-A3; annual monitoring",
        "G3a: above + monitor for complications; SGLT2 inhibitor if albuminuria; avoid nephrotoxins; moderate protein intake",
        "G3b: above + increase monitoring to every 6 months; adjust medication doses; bone mineral disease management",
        "G4: above + nephrology co-management; dialysis access planning (AV fistula creation when eGFR ~15-20); transplant evaluation",
        "G5: renal replacement therapy (hemodialysis, peritoneal dialysis) or conservative management; transplant (pre-emptive preferred)",
        "All stages with A2-A3: ACEi/ARB at maximum tolerated dose + SGLT2 inhibitor regardless of diabetes status"
      ],
      "nursingActions": [
        "Stage CKD using BOTH GFR and albuminuria categories at each visit; document in the chart",
        "Apply the KDIGO heat map to determine appropriate monitoring intervals and intervention intensity",
        "Ensure stage-appropriate medication adjustments: dose-adjust renally-cleared drugs at each stage transition",
        "Initiate complication screening per stage: anemia (G3a+), mineral bone disease (G3a+), metabolic acidosis (G3b+)",
        "Coordinate nephrology referral at G4 or earlier if rapid progression, unclear etiology, or refractory complications",
        "Begin patient education about renal replacement therapy options at G4: hemodialysis, peritoneal dialysis, transplant, conservative management",
        "Ensure AV fistula creation is planned 6+ months before anticipated dialysis start (maturation time)"
      ],
      "assessmentFindings": [
        "G1-G3a: often asymptomatic; detected by screening labs",
        "G3b-G4: fatigue, nocturia (loss of concentrating ability), mild edema, early anemia",
        "G5: uremic symptoms (nausea, anorexia, metallic taste, pruritus, restless legs, encephalopathy, pericarditis)",
        "Progressive albuminuria category increase indicates worsening kidney damage",
        "Complication development correlates with stage: anemia at G3a, hyperphosphatemia at G3b, acidosis at G4, uremia at G5"
      ],
      "signs": {
        "left": [
          "Stable eGFR at G1-G3a with controlled risk factors",
          "A1 albuminuria (normal) with preserved kidney function",
          "Gradual age-appropriate GFR decline (~1 mL/min/year after age 40)",
          "Responding appropriately to RAAS blockade with decreasing proteinuria"
        ],
        "right": [
          "Rapid stage progression (skipping stages within months) -- evaluate for rapidly progressive GN",
          "Stage G5 with uremic symptoms: indication for dialysis initiation",
          "Stage G4-G5 without dialysis access planning (AV fistula takes 3-6 months to mature)",
          "Stage G5 with uremic pericarditis (pericardial friction rub) -- EMERGENT dialysis indication",
          "Acute-on-chronic kidney injury with sudden stage jump"
        ]
      },
      "medications": [
        {
          "name": "Sevelamer (Renagel/Renvela)",
          "type": "Non-calcium phosphate binder",
          "action": "Binds dietary phosphate in the GI tract, preventing absorption; reduces serum phosphorus in CKD stages 3-5; avoids calcium loading unlike calcium-based binders (calcium carbonate, calcium acetate)",
          "sideEffects": "GI upset (nausea, constipation, diarrhea, bloating, flatulence), metabolic acidosis (Renagel/HCl form; use Renvela/carbonate form instead)",
          "contra": "Bowel obstruction, fecal impaction, hypophosphatemia",
          "pearl": "Take with meals (must be present in GI tract when phosphorus-containing food is eaten); preferred over calcium-based binders to avoid vascular calcification (especially in dialysis patients); Renvela (carbonate form) preferred over Renagel (HCl form) to avoid worsening metabolic acidosis in CKD"
        }
      ],
      "pearls": [
        "CKD staging requires BOTH GFR category (G1-G5) AND albuminuria category (A1-A3) -- stating only GFR is incomplete staging",
        "G1 and G2 require evidence of kidney DAMAGE (albuminuria, abnormal imaging, biopsy findings) to be called CKD -- a GFR of 70 alone is NOT CKD in a healthy person",
        "The KDIGO heat map is a visual tool: green = low risk/annual monitoring; yellow = moderate/annual; orange = high/every 6 months; red = very high/every 3 months + nephrology referral",
        "AV fistula should be created when eGFR approaches 15-20 (at least 6 months before anticipated dialysis) -- 'Fistula First' initiative; fistula requires 3-6 months to mature",
        "Indications for emergent dialysis (mnemonic AEIOU): Acidosis (refractory), Electrolytes (hyperkalemia refractory to medical management), Ingestion (toxic alcohol, lithium, aspirin), Overload (fluid overload refractory to diuretics), Uremia (encephalopathy, pericarditis, bleeding)",
        "Conservative management (no dialysis) is an acceptable option for elderly patients with multiple comorbidities and limited life expectancy -- focus on symptom management and quality of life"
      ],
      "quiz": [
        {
          "question": "A patient has eGFR 52 and UACR 180 mg/g. What is their CKD stage and monitoring recommendation?",
          "options": [
            "CKD G3a-A2; monitor every 6 months per KDIGO heat map",
            "CKD G3a-A1; monitor annually",
            "CKD G2-A3; monitor every 3 months",
            "No CKD -- eGFR is above 45"
          ],
          "correct": 0,
          "rationale": "eGFR 52 = G3a (45-59) and UACR 180 = A2 (30-300). Per the KDIGO heat map, G3a-A2 falls in the orange (high risk) zone, recommending monitoring every 6 months. This patient should be on ACEi/ARB and SGLT2 inhibitor."
        },
        {
          "question": "When should AV fistula creation be planned for a CKD patient?",
          "options": [
            "When the patient starts dialysis",
            "When eGFR drops below 5",
            "At least 6 months before anticipated dialysis start, typically around eGFR 15-20",
            "Only after the patient starts hemodialysis via temporary catheter"
          ],
          "correct": 2,
          "rationale": "AV fistulas require 3-6 months to mature and may require revision. The 'Fistula First' initiative recommends creation when eGFR approaches 15-20, at least 6 months before anticipated dialysis. Starting dialysis via catheter increases infection risk and should be avoided when possible."
        },
        {
          "question": "Which is an emergent indication for dialysis? (Use AEIOU mnemonic)",
          "options": [
            "eGFR <15 without symptoms",
            "Mild hyponatremia",
            "Refractory hyperkalemia with ECG changes",
            "Asymptomatic proteinuria"
          ],
          "correct": 2,
          "rationale": "AEIOU emergent dialysis indications: Acidosis (refractory to medical management), Electrolytes (hyperkalemia refractory to medical management with ECG changes), Ingestion (toxic substances), Overload (fluid overload refractory to diuretics), Uremia (encephalopathy, pericarditis, bleeding)."
        }
      ]
    },
  "cleft-lip-palate": {
      "title": "Cleft Lip and Palate",
      "cellular": {
        "title": "Craniofacial Development Failure",
        "content": "Cleft lip and/or palate results from failure of fusion of the maxillary and medial nasal processes (cleft lip, occurs at 5-7 weeks gestation) or failure of fusion of the palatal shelves (cleft palate, occurs at 7-12 weeks gestation). Cleft lip ranges from a small notch to complete separation extending into the nose (unilateral or bilateral). Cleft palate involves the hard palate, soft palate, or both, and can be isolated or associated with cleft lip. The condition causes feeding difficulties (inability to create suction), speech problems (velopharyngeal insufficiency causing hypernasal speech), recurrent otitis media (eustachian tube dysfunction), and dental abnormalities. Multidisciplinary team management is essential from birth through adolescence."
      },
      "riskFactors": [
        "Family history (recurrence risk ~4% with one affected sibling; 9% with two affected siblings)",
        "Maternal smoking during pregnancy (2x increased risk)",
        "Maternal alcohol use in first trimester",
        "Anticonvulsant use: phenytoin, valproic acid, carbamazepine (teratogenic)",
        "Maternal folate deficiency (inadequate periconceptional folic acid supplementation)",
        "Maternal diabetes",
        "Asian and Native American descent (higher incidence)",
        "Associated syndromes: Pierre Robin sequence, Treacher Collins, Stickler syndrome, velocardiofacial (22q11.2 deletion)"
      ],
      "diagnostics": [
        "Prenatal diagnosis: cleft lip may be detected on second-trimester ultrasound (18-20 weeks); cleft palate alone is difficult to diagnose prenatally",
        "Physical examination at birth: inspect lip for continuity; palpate hard and soft palate (submucous cleft may be palpable as a midline notch in the posterior hard palate but visually normal)",
        "Feeding assessment: observe for nasal regurgitation, inability to create suction, excessive air intake during feeding",
        "Audiologic evaluation: newborn hearing screen and regular audiologic follow-up (chronic eustachian tube dysfunction → conductive hearing loss)",
        "Genetic evaluation: to identify associated syndromes; karyotype or microarray if additional anomalies present",
        "Speech-language pathology assessment starting at 12-18 months"
      ],
      "management": [
        "Cleft lip repair: cheiloplasty at approximately 3 months of age ('rule of 10s': 10 weeks old, 10 lbs weight, Hgb 10 g/dL)",
        "Cleft palate repair: palatoplasty at approximately 9-12 months of age (before speech development)",
        "Myringotomy with PE (pressure equalization) tubes for chronic otitis media with effusion",
        "Orthodontic management: presurgical orthopedics (NAM appliance), dental care throughout childhood",
        "Speech therapy: beginning after palate repair; pharyngeal flap surgery if velopharyngeal insufficiency persists",
        "Alveolar bone grafting at 6-10 years (mixed dentition stage)",
        "Long-term follow-up through adolescence: rhinoplasty, orthodontics, psychosocial support"
      ],
      "nursingActions": [
        "Pre-surgical feeding: use specialized bottles (Haberman/SpecialNeeds feeder, Pigeon nipple, or squeezable bottles) that deliver milk without requiring suction",
        "Position upright during feeding to prevent nasal regurgitation and aspiration",
        "Post-operative cleft lip repair (Logan bow/lip protector): prevent the infant from rubbing the surgical site; use elbow restraints (No-No splints) to prevent hands reaching the face",
        "Post-operative feeding: use cup or syringe feeding for 7-14 days after lip repair (NO nipple or pacifier on surgical site); resume specialized bottle after palate repair per surgeon protocol",
        "Assess surgical site for bleeding, infection, wound dehiscence",
        "Educate parents on long-term care plan: multiple surgeries, dental care, speech therapy, audiologic monitoring",
        "Provide emotional support and connect family with cleft team and support groups (e.g., Smile Train, cleft palate foundation)"
      ],
      "assessmentFindings": [
        "Visible cleft of the lip (unilateral or bilateral; may extend into the nose)",
        "Cleft of the hard/soft palate visible on inspection or palpable on examination",
        "Feeding difficulties: inability to latch or create suction, nasal regurgitation of milk, prolonged feeding times, poor weight gain",
        "Recurrent otitis media (eustachian tube dysfunction causes fluid accumulation)",
        "Speech abnormalities (hypernasal speech from velopharyngeal insufficiency) -- assessed at 18-24 months",
        "Dental abnormalities: missing, malpositioned, or supernumerary teeth near the cleft"
      ],
      "signs": {
        "left": [
          "Isolated minor cleft lip with adequate feeding using specialized bottle",
          "Weight gain appropriate with feeding modifications",
          "Normal hearing on audiologic screening",
          "Surgical repair proceeding on typical timeline"
        ],
        "right": [
          "Failure to thrive despite feeding modifications (inadequate caloric intake)",
          "Aspiration pneumonia from chronic nasal regurgitation",
          "Post-surgical wound dehiscence (surgical site opening)",
          "Severe bilateral cleft lip and palate with associated syndrome (Pierre Robin: micrognathia, glossoptosis, airway obstruction)",
          "Acute airway obstruction in Pierre Robin sequence (glossoptosis)"
        ]
      },
      "medications": [
        {
          "name": "Acetaminophen (infant drops)",
          "type": "Analgesic/antipyretic",
          "action": "Central COX inhibition providing pain relief and fever reduction; first-line analgesic for post-surgical pain in cleft repair patients",
          "sideEffects": "Hepatotoxicity at supratherapeutic doses; rare rash",
          "contra": "Severe hepatic impairment; known hypersensitivity",
          "pearl": "15 mg/kg/dose every 4-6 hours (max 75 mg/kg/day); use weight-based dosing with the measuring device provided; first-line post-operative pain management after cleft repair; avoid aspirin and NSAIDs in infants"
        }
      ],
      "pearls": [
        "Rule of 10s for cleft lip repair timing: 10 weeks old, 10 lbs weight, Hgb 10 g/dL",
        "Cleft palate repair before 12 months to optimize speech development (before the child begins talking)",
        "NO nipple or pacifier after cleft lip repair -- use cup or syringe feeding to protect the surgical site",
        "Elbow restraints (No-No splints) prevent infant from touching the surgical site with hands -- remove periodically for supervised range of motion",
        "Eustachian tube dysfunction is nearly universal in cleft palate patients -- PE tubes are commonly placed at the time of palate repair",
        "Pierre Robin sequence (cleft palate + micrognathia + glossoptosis) may cause airway obstruction -- position prone to move the tongue forward; may need nasopharyngeal airway or surgical intervention"
      ],
      "quiz": [
        {
          "question": "When is the optimal timing for cleft lip repair?",
          "options": [
            "Within the first 24 hours of life",
            "At approximately 3 months of age (rule of 10s)",
            "At 12 months of age",
            "After 2 years when the child can cooperate"
          ],
          "correct": 1,
          "rationale": "Cleft lip repair (cheiloplasty) is typically performed at approximately 3 months of age, following the 'rule of 10s': 10 weeks old, 10 pounds weight, and hemoglobin of 10 g/dL. This timing allows adequate growth for surgical repair while minimizing the psychosocial impact on the family."
        },
        {
          "question": "A nurse is feeding an infant after cleft lip repair. Which feeding method is appropriate?",
          "options": [
            "Regular bottle with standard nipple",
            "Breastfeeding directly at the breast",
            "Cup or syringe feeding -- no nipple should contact the surgical site",
            "No feeding for 48 hours post-operatively"
          ],
          "correct": 2,
          "rationale": "After cleft lip repair, no nipple or pacifier should be placed against the surgical site for 7-14 days to prevent disruption of the suture line. Cup feeding, syringe feeding, or spoon feeding are appropriate alternatives. Specific protocols vary by surgeon."
        },
        {
          "question": "Why do infants with cleft palate require PE tubes?",
          "options": [
            "They have congenital hearing loss requiring surgical correction",
            "Eustachian tube dysfunction causes chronic middle ear effusion and conductive hearing loss",
            "PE tubes prevent speech delays",
            "PE tubes are part of the palate repair procedure"
          ],
          "correct": 1,
          "rationale": "Cleft palate disrupts the normal attachment of the tensor veli palatini muscle, which opens the eustachian tube. This causes chronic eustachian tube dysfunction, leading to recurrent otitis media with effusion and conductive hearing loss. PE tubes provide drainage and ventilation of the middle ear."
        }
      ]
    },
  "clinical-prioritization-np": {
      "title": "Clinical Prioritization",
      "cellular": {
        "title": "Triage & Clinical Decision-Making",
        "content": "Clinical prioritization requires systematic assessment of patient acuity and time-sensitivity of interventions. The ABCs (Airway, Breathing, Circulation) framework ensures life-threatening conditions are addressed first. Maslow's hierarchy applies to nursing prioritization: physiological needs (oxygenation, circulation, fluid balance) take precedence over safety, then psychosocial needs. The acute vs chronic framework distinguishes new/changing conditions requiring immediate intervention from stable chronic conditions. Clinical decision rules (HEART score, Wells criteria, CURB-65) standardize risk stratification. Triage systems (ESI 1-5, MTS) categorize patients by acuity: ESI-1 (immediate/resuscitation), ESI-2 (emergent/high risk), ESI-3 (urgent), ESI-4 (less urgent), ESI-5 (non-urgent). The NP must also recognize the 'can't miss' diagnoses that present with common symptoms but carry high mortality if delayed."
      },
      "riskFactors": [
        "Cognitive biases that impair prioritization: anchoring (fixating on initial diagnosis), premature closure (stopping workup too early), availability bias (overweighing recent experience)",
        "Diagnostic momentum (accepting prior diagnosis without re-evaluation)",
        "High patient volumes and time pressure reducing systematic assessment",
        "Atypical presentations masking serious pathology (elderly, immunocompromised, diabetic patients)",
        "Communication failures in handoffs and transitions of care",
        "Alarm fatigue in monitored settings (desensitization to clinical alerts)"
      ],
      "diagnostics": [
        "ESI (Emergency Severity Index) triage: 5-level system based on acuity and resource needs",
        "Clinical prediction rules for risk stratification: HEART score (chest pain), Wells criteria (PE/DVT), CURB-65 (pneumonia severity), Ottawa ankle/knee rules (fracture)",
        "Serial vital signs with early warning scores (NEWS, MEWS) for deterioration detection",
        "Point-of-care testing: troponin, lactate, blood gas for rapid decision-making",
        "Focused bedside assessment: ABCDE survey for critical patients"
      ],
      "management": [
        "Immediate (ESI-1): cardiopulmonary arrest, anaphylaxis, acute airway obstruction, massive hemorrhage, tension pneumothorax -- intervene within seconds",
        "Emergent (ESI-2): STEMI, stroke within thrombolytic window, sepsis, unstable vital signs, severe pain -- intervene within minutes",
        "Urgent (ESI-3): stable chest pain, abdominal pain requiring workup, moderate asthma exacerbation -- intervene within 30-60 minutes",
        "Semi-urgent (ESI-4): minor laceration, stable chronic conditions, simple UTI -- can wait hours safely",
        "Non-urgent (ESI-5): prescription refills, minor symptoms, stable follow-up -- can wait without risk",
        "Time-critical diagnoses: STEMI (door-to-balloon <90 min), stroke (door-to-needle <60 min), sepsis (antibiotics within 1 hour), necrotizing fasciitis (emergent surgery)"
      ],
      "nursingActions": [
        "Apply the ABC framework to ALL clinical encounters: address airway, breathing, and circulation threats first before proceeding to other assessment",
        "Use Maslow's hierarchy: physiological needs (oxygenation, perfusion, pain) → safety → psychosocial → education",
        "Identify 'can't miss' diagnoses for common presentations: chest pain (ACS, PE, aortic dissection, tension pneumothorax); headache (SAH, meningitis); abdominal pain (AAA rupture, ectopic pregnancy, appendicitis)",
        "Apply clinical decision rules to standardize risk assessment and reduce cognitive bias",
        "Implement structured handoff communication (SBAR, I-PASS) to prevent information loss during transitions",
        "Recognize and manage cognitive biases: always ask 'What else could this be?' to prevent premature closure",
        "Reassess frequently: initial low-acuity triage can change -- patients deteriorate"
      ],
      "assessmentFindings": [
        "Immediate threats: unresponsive patient, absent/agonal respirations, pulselessness, anaphylaxis (airway edema, stridor), massive hemorrhage",
        "Emergent findings: acute altered mental status, severe respiratory distress, hemodynamic instability, acute focal neurological deficit (stroke), severe sepsis signs",
        "Urgent findings: acute pain with stable vitals, moderate respiratory symptoms, stable GI bleeding, new rash with systemic symptoms",
        "Deterioration indicators: new tachycardia, increasing oxygen requirements, declining mental status, rising lactate"
      ],
      "signs": {
        "left": [
          "Stable chronic conditions with unchanged symptoms",
          "Normal vital signs with low-risk presentation",
          "Clinical decision rule scoring low risk (HEART 0-3, Wells <2)",
          "Patient responding to initial management"
        ],
        "right": [
          "Pulseless/apneic patient requiring CPR",
          "Anaphylaxis with airway compromise: stridor, angioedema, hypotension",
          "Acute stroke within thrombolytic window (last known well <4.5 hours for IV tPA)",
          "Sepsis with lactate >4 and refractory hypotension (septic shock)",
          "Massive GI hemorrhage with hemodynamic instability"
        ]
      },
      "medications": [
        {
          "name": "Epinephrine (1:1000 IM / 1:10,000 IV)",
          "type": "Sympathomimetic (alpha and beta agonist)",
          "action": "Alpha-1: vasoconstriction (reverses hypotension and mucosal edema); Beta-1: increases heart rate and contractility; Beta-2: bronchodilation and mast cell stabilization; FIRST-LINE for anaphylaxis",
          "sideEffects": "Tachycardia, palpitations, hypertension, anxiety, tremor, headache",
          "contra": "No absolute contraindications in anaphylaxis (life-saving; benefits always outweigh risks)",
          "pearl": "Anaphylaxis: 0.3-0.5 mg (1:1000) IM in lateral thigh; can repeat every 5-15 minutes; IM preferred over IV (safer, faster absorption from lateral thigh); IV epinephrine only in refractory anaphylaxis or cardiac arrest with continuous monitoring; ACLS cardiac arrest: 1 mg (1:10,000) IV every 3-5 minutes"
        }
      ],
      "pearls": [
        "ABCs FIRST, ALWAYS: a patient can die from airway obstruction in minutes, hemorrhage in hours, and infection in days -- prioritize accordingly",
        "'Can't miss' diagnoses for common presentations: Chest pain → ACS, PE, aortic dissection, tension pneumothorax; Headache → SAH, meningitis; Abdominal pain → AAA rupture, ectopic pregnancy, mesenteric ischemia",
        "Time-critical interventions: STEMI door-to-balloon <90 min; stroke door-to-needle <60 min; sepsis antibiotics within 1 hour; trauma golden hour; anaphylaxis epinephrine IMMEDIATELY",
        "When a patient's story doesn't add up -- RECONSIDER the diagnosis; cognitive biases kill patients; always ask 'What am I missing?'",
        "Acute change in mental status is ALWAYS a red flag requiring immediate evaluation -- the differential includes hypoglycemia (check glucose FIRST -- most rapidly reversible), stroke, sepsis, intracranial hemorrhage, drug overdose",
        "Serial reassessment is critical: a patient triaged as ESI-3 can deteriorate to ESI-1; initial impression can be wrong"
      ],
      "quiz": [
        {
          "question": "An NP is managing four patients simultaneously. Which requires the MOST immediate attention?",
          "options": [
            "Patient with stable angina waiting for stress test results",
            "Patient with fever of 38.5°C and known UTI on antibiotics",
            "Patient with acute onset left-sided weakness 45 minutes ago",
            "Patient requesting pain medication refill for chronic back pain"
          ],
          "correct": 2,
          "rationale": "Acute onset focal neurological deficit (left-sided weakness) within the thrombolytic window (<4.5 hours from last known well) is a time-critical emergency. This patient needs immediate stroke team activation, CT head, and potential IV tPA. Every minute of delay equals ~1.9 million neurons lost."
        },
        {
          "question": "A patient presents with diffuse abdominal pain, blood pressure 80/50, and heart rate 120. The NP's initial assessment should focus on:",
          "options": [
            "Detailed past medical and surgical history",
            "ABCs: ensure airway, breathing, and circulation are stabilized before further assessment",
            "Comprehensive physical examination including neurological exam",
            "Patient's pain rating and administration of analgesics"
          ],
          "correct": 1,
          "rationale": "This patient is hemodynamically unstable (hypotension, tachycardia), indicating potential hemorrhagic shock from a surgical emergency (ruptured AAA, ruptured ectopic, GI hemorrhage). The ABC approach mandates stabilizing airway, breathing, and circulation (IV access, fluids, blood products) before detailed history-taking."
        },
        {
          "question": "Which cognitive bias involves accepting a previous clinician's diagnosis without independent re-evaluation?",
          "options": [
            "Anchoring bias",
            "Diagnostic momentum",
            "Availability bias",
            "Confirmation bias"
          ],
          "correct": 1,
          "rationale": "Diagnostic momentum occurs when a diagnosis established by a prior clinician is carried forward without critical re-evaluation. Each clinician should independently assess the patient and consider whether the working diagnosis fits the current clinical picture."
        }
      ]
    },
  "clinical-reasoning-np": {
      "title": "Clinical Reasoning",
      "cellular": {
        "title": "Diagnostic Reasoning & Bayesian Thinking",
        "content": "Clinical reasoning integrates pattern recognition (System 1, fast/intuitive) with analytical reasoning (System 2, slow/deliberate). Bayesian reasoning adjusts disease probability based on sequential evidence: pre-test probability (based on prevalence, risk factors, presentation) is modified by test characteristics (sensitivity, specificity, likelihood ratios) to yield post-test probability. A test's utility depends on pre-test probability: high-sensitivity tests are best for ruling OUT disease (SnNout: Sensitive test, Negative result, rules Out); high-specificity tests are best for ruling IN disease (SpPin: Specific test, Positive result, rules In). The NP applies illness scripts (structured mental models of diseases with predisposing factors, pathophysiology, and clinical features), generates differential diagnoses, and systematically narrows them using history, exam, and testing."
      },
      "riskFactors": [
        "Cognitive biases: anchoring (fixating on first impression), premature closure (stopping too early), availability (overweighing recent cases), confirmation (seeking only supportive evidence)",
        "System 1 overreliance in complex cases (pattern recognition fails with atypical presentations)",
        "Knowledge gaps in rare but dangerous conditions",
        "Fatigue, cognitive overload, time pressure",
        "Handoff communication failures",
        "Atypical presentations: elderly, immunocompromised, pregnant, pediatric patients present differently"
      ],
      "diagnostics": [
        "Sensitivity: true positive rate; the ability of a test to correctly identify disease; high sensitivity → low false negative rate → good for screening/ruling out (SnNout)",
        "Specificity: true positive rate for non-disease; ability to correctly identify absence of disease; high specificity → low false positive rate → good for confirming/ruling in (SpPin)",
        "Likelihood ratios: LR+ = sensitivity/(1-specificity); LR- = (1-sensitivity)/specificity; LR+ >10 or LR- <0.1 are strong; modify pre-test probability",
        "Positive predictive value: probability of disease given positive test; affected by prevalence",
        "Negative predictive value: probability of no disease given negative test; high-sensitivity tests in low-prevalence settings have high NPV",
        "Clinical prediction rules: validated scoring systems that standardize probability assessment (HEART, Wells, PERC, Ottawa rules, Centor/McIsaac, CURB-65)"
      ],
      "management": [
        "Generate broad differential diagnosis using system-based approach before narrowing",
        "Apply hypothesis-driven workup: choose tests that will maximally discriminate between competing diagnoses",
        "Use clinical prediction rules to standardize risk assessment and reduce cognitive error",
        "High-sensitivity tests first for screening/ruling out dangerous diagnoses; high-specificity tests to confirm",
        "Develop problem representation: one-sentence summary capturing key features (age, sex, acuity, key symptoms/signs)",
        "Implement diagnostic time-outs: periodically reassess the working diagnosis, especially when the patient isn't improving as expected",
        "Practice 'what else could this be?' thinking to combat premature closure"
      ],
      "nursingActions": [
        "Formulate a one-line problem representation summarizing the clinical picture before generating differential",
        "Develop a systematic approach to differential diagnosis: always consider life-threatening diagnoses first",
        "Apply appropriate clinical decision rules to guide workup (HEART score for chest pain, Wells for PE, CURB-65 for pneumonia)",
        "Select diagnostic tests based on Bayesian reasoning: consider pre-test probability before ordering tests",
        "Implement structured diagnostic time-outs: reassess the working diagnosis at defined intervals or when expected improvement does not occur",
        "Use cognitive forcing strategies to reduce bias: consider opposite diagnosis, involve colleagues for second opinion",
        "Document clinical reasoning in the medical record: differential diagnosis, rationale for testing, and decision-making process"
      ],
      "assessmentFindings": [
        "This is a cognitive skill assessment, not a physical condition",
        "Application of clinical reasoning is assessed through: accuracy of differential diagnosis, appropriateness of test selection, interpretation of results in clinical context",
        "Effective clinical reasoning produces: timely diagnosis, appropriate treatment, avoidance of diagnostic errors",
        "Diagnostic error indicators: unexpected patient deterioration, delayed diagnosis of time-sensitive conditions, excessive or unnecessary testing"
      ],
      "signs": {
        "left": [
          "Working diagnosis confirmed by appropriate testing",
          "Patient improving as expected with treatment",
          "Clinical reasoning documented with clear rationale",
          "Clinical decision rule appropriately applied"
        ],
        "right": [
          "Unexpected patient deterioration suggesting wrong or missed diagnosis",
          "Failure to consider life-threatening 'can't miss' diagnoses (premature closure)",
          "Test results contradicting working diagnosis -- requires diagnostic reassessment",
          "Time-sensitive diagnosis missed due to cognitive bias or inadequate evaluation"
        ]
      },
      "medications": [
        {
          "name": "No specific medications for clinical reasoning",
          "type": "Cognitive and decision-making skill",
          "action": "Clinical reasoning guides all medication selection and management decisions; the reasoning process itself is the 'intervention'",
          "sideEffects": "N/A",
          "contra": "N/A",
          "pearl": "The most important clinical reasoning pearl: when a patient is not improving as expected, reassess the diagnosis rather than escalating treatment for the wrong diagnosis"
        }
      ],
      "pearls": [
        "SnNout: Sensitive test + Negative result = rules OUT disease (use high-sensitivity tests for screening/exclusion)",
        "SpPin: Specific test + Positive result = rules IN disease (use high-specificity tests for confirmation)",
        "Always ask 'What am I missing?' -- premature closure (stopping the diagnostic process too early) is the most common cognitive error leading to diagnostic failure",
        "Problem representation: distill the case into one sentence capturing demographics, acuity, and key features; this activates the correct illness scripts from memory",
        "Pre-test probability determines test utility: ordering a D-dimer (high sensitivity) in a high-probability PE patient is useless (won't change management regardless of result); ordering it in a low-probability patient is helpful (negative result rules out PE)",
        "When the patient isn't getting better on your treatment, it's more likely the diagnosis is wrong than that the treatment is failing -- reassess rather than escalate"
      ],
      "quiz": [
        {
          "question": "A test has 95% sensitivity and 50% specificity. In what clinical scenario is this test MOST useful?",
          "options": [
            "Confirming a diagnosis in a patient with high pre-test probability",
            "Screening/ruling out disease in a patient with low-to-moderate pre-test probability",
            "Monitoring treatment response",
            "Determining disease prognosis"
          ],
          "correct": 1,
          "rationale": "A highly sensitive test (95%) with low specificity (50%) is best for RULING OUT disease (SnNout). A negative result in this test makes disease very unlikely (few false negatives). However, a positive result is not confirmatory due to the high false-positive rate (low specificity). This makes it ideal for screening."
        },
        {
          "question": "An NP diagnosed a patient with community-acquired pneumonia and started antibiotics. After 72 hours, the patient is worsening despite appropriate therapy. What should the NP do?",
          "options": [
            "Escalate to broader-spectrum antibiotics immediately",
            "Continue current therapy -- pneumonia takes time to resolve",
            "Reassess the diagnosis: consider alternative diagnoses (PE, empyema, lung cancer, heart failure)",
            "Discharge and schedule outpatient follow-up"
          ],
          "correct": 2,
          "rationale": "When a patient is not improving as expected, the most common error is to escalate treatment without reassessing the diagnosis. The NP should consider alternative diagnoses: could this be a PE, empyema, lung cancer with post-obstructive pneumonia, or heart failure masquerading as pneumonia?"
        },
        {
          "question": "What does it mean when a clinical prediction rule (e.g., Wells score for PE) yields a low pre-test probability?",
          "options": [
            "PE has been definitively excluded -- no further testing needed",
            "A high-sensitivity test (D-dimer) can be used to safely rule out PE",
            "Imaging is required regardless of the score",
            "The patient should be started on anticoagulation empirically"
          ],
          "correct": 1,
          "rationale": "A low pre-test probability (e.g., Wells score ≤4 with low clinical suspicion) means a high-sensitivity test like D-dimer can effectively rule out PE. A negative D-dimer in this setting has a very high NPV (>99%), safely excluding PE without imaging. In high pre-test probability, D-dimer is not helpful (proceed directly to imaging)."
        }
      ]
    },
  "cll-rn": {
        title: "Chronic Lymphocytic Leukemia",
        cellular: { title: "Pathogenesis of CLL", content: "Chronic lymphocytic leukemia (CLL) is the most common adult leukemia in Western countries, characterized by the clonal proliferation and progressive accumulation of functionally incompetent, mature-appearing CD5-positive B lymphocytes in the peripheral blood, bone marrow, lymph nodes, and spleen. CLL accounts for approximately 25-30% of all adult leukemias with an incidence of approximately 4-5 per 100,000 annually. The median age at diagnosis is 70 years, with a male-to-female ratio of approximately 2:1. The pathogenesis of CLL involves the clonal expansion of B lymphocytes that have arrested at an intermediate stage of B-cell differentiation. These CLL cells characteristically co-express the B-cell markers CD19, CD20 (dim), and CD23 with the T-cell marker CD5 -- this aberrant CD5 expression on B cells is the immunophenotypic hallmark of CLL and distinguishes it from other B-cell lymphoproliferative disorders. The CLL cells also express dim surface immunoglobulin (sIg), typically IgM and/or IgD, reflecting their origin from antigen-experienced B cells. The fundamental defect in CLL is not excessive proliferation (the CLL cells actually divide slowly) but rather defective apoptosis -- the CLL cells accumulate because they fail to undergo programmed cell death. Overexpression of the anti-apoptotic protein BCL-2 is nearly universal in CLL and is a major contributor to this apoptotic resistance. The BCL-2 protein resides on the outer mitochondrial membrane where it prevents the release of cytochrome c and other pro-apoptotic factors, blocking the intrinsic apoptotic pathway. This understanding led directly to the development of venetoclax, a BCL-2 inhibitor that has transformed CLL treatment. The B-cell receptor (BCR) signaling pathway plays a central role in CLL cell survival and proliferation. In normal B cells, antigen binding to the BCR activates a signaling cascade through Bruton's tyrosine kinase (BTK), phosphoinositide 3-kinase (PI3K), and downstream effectors that promote cell survival, proliferation, and migration. In CLL, the BCR signaling pathway is constitutively activated (in some cases by autonomous signaling independent of antigen binding), providing continuous survival signals to the malignant cells. This constitutive BCR signaling activates NF-kappaB, MAPK/ERK, and PI3K/AKT pathways, promoting cell survival, chemokine-directed migration to lymphoid niches, and resistance to apoptosis. BTK is a critical node in this signaling cascade, and its inhibition by ibrutinib and other BTK inhibitors has revolutionized CLL therapy. CLL cells also critically depend on interactions with the tumor microenvironment in lymphoid tissues (bone marrow and lymph nodes). Stromal cells, T cells, and nurse-like cells in these compartments provide survival signals through direct contact (CD40 ligand, BAFF, APRIL) and paracrine cytokine signaling (IL-4, IL-6, IL-15), creating protective niches where CLL cells are shielded from apoptosis. BTK inhibitors disrupt this microenvironmental support by inhibiting chemokine-mediated migration and adhesion of CLL cells to stromal cells, causing a characteristic early lymphocytosis (initial rise in peripheral lymphocyte count as CLL cells are mobilized from lymphoid tissues into the blood) that resolves over weeks to months as the displaced cells undergo apoptosis. CLL has a highly variable clinical course. Approximately one-third of patients never require treatment and have near-normal life expectancy (watch and wait approach); one-third have an initially indolent course that eventually progresses to require treatment; and one-third have aggressive disease requiring early treatment. Prognostic stratification relies on genetic and molecular features: del(13q) as the sole abnormality carries the best prognosis (median survival >15 years); trisomy 12 and normal karyotype have intermediate prognosis; del(11q) (ATM gene) confers adverse prognosis with extensive lymphadenopathy; and del(17p) (TP53 gene) carries the worst prognosis with resistance to conventional chemotherapy and median survival of 2-3 years with chemoimmunotherapy. IGHV mutation status is another critical prognostic marker: mutated IGHV (>2% deviation from germline) indicates the CLL arose from a post-germinal center B cell and carries favorable prognosis; unmutated IGHV indicates pre-germinal center origin with more aggressive behavior. The clinical presentation includes progressive lymphocytosis (peripheral blood lymphocyte count >5,000/mcL with characteristic mature-appearing small lymphocytes), lymphadenopathy (painless, symmetric, most commonly cervical, axillary, and inguinal), splenomegaly, hepatomegaly, and constitutional symptoms (fatigue, night sweats, weight loss, fever). Smudge cells (basket cells) on the peripheral blood smear are a characteristic artifact: fragile CLL lymphocytes are easily disrupted during slide preparation, creating smeared nuclear remnants. CLL causes immunodeficiency through multiple mechanisms: hypogammaglobulinemia (progressive decline in serum immunoglobulin levels as normal B-cell function is suppressed), impaired T-cell function, and complement deficiency. This immune dysfunction makes infections the leading cause of morbidity and mortality in CLL. Autoimmune complications occur in 5-10% of CLL patients, most commonly autoimmune hemolytic anemia (AIHA, warm type -- direct Coombs test positive) and immune thrombocytopenic purpura (ITP). Richter transformation -- the development of aggressive diffuse large B-cell lymphoma (DLBCL) from the CLL clone -- occurs in approximately 2-10% of patients and presents with rapidly enlarging lymphadenopathy, markedly elevated LDH, constitutional symptoms, and dramatically worsening prognosis (median survival 5-8 months). Treatment is indicated for active disease as defined by iwCLL criteria: progressive marrow failure, massive or progressive lymphadenopathy or splenomegaly, progressive lymphocytosis (>50% increase over 2 months or lymphocyte doubling time <6 months), autoimmune cytopenias unresponsive to corticosteroids, or significant constitutional symptoms. Current first-line therapy has shifted from chemoimmunotherapy (fludarabine/cyclophosphamide/rituximab -- FCR) to targeted therapies: BTK inhibitors (ibrutinib, acalabrutinib, zanubrutinib) and BCL-2 inhibitors (venetoclax) combined with anti-CD20 antibodies (obinutuzumab, rituximab), which provide superior outcomes with more tolerable side effect profiles. The nursing role encompasses monitoring for disease progression, managing treatment side effects (atrial fibrillation and bleeding with BTK inhibitors, tumor lysis syndrome with venetoclax), infection prevention and surveillance, and patient education about the chronic nature of the disease." },
        riskFactors: ["Age >65 years (median age at diagnosis 70; risk increases progressively with age)","Male sex (approximately 2:1 male-to-female ratio)","Caucasian ethnicity (CLL is significantly more common in Western populations; rare in Asian populations)","Family history of CLL or other lymphoproliferative disorders (first-degree relatives have 2-8 times increased risk; familial CLL accounts for 5-10% of cases)","Monoclonal B-cell lymphocytosis (MBL -- precursor state with clonal B cells <5,000/mcL; MBL progresses to CLL requiring treatment at approximately 1-2% per year)","Agent Orange exposure (recognized association in Vietnam veterans)","Certain agricultural chemical exposures (herbicides, insecticides -- epidemiological association)"],
        diagnostics: ["Complete blood count with differential (lymphocytosis >5,000/mcL with mature small lymphocytes is the hallmark finding; may be incidentally discovered)","Peripheral blood smear (mature-appearing small lymphocytes with scant cytoplasm, condensed nuclear chromatin; characteristic smudge cells/basket cells from fragile lymphocyte disruption during slide preparation)","Flow cytometry of peripheral blood (diagnostic gold standard: CD5+, CD19+, CD20 dim, CD23+, sIg dim, CD200+ immunophenotype; distinguishes CLL from mantle cell lymphoma which is CD5+/CD23-)","FISH panel for prognostic cytogenetics (del(13q), trisomy 12, del(11q)/ATM, del(17p)/TP53 -- critical for treatment selection and prognosis)","IGHV mutation analysis (mutated vs unmutated -- key prognostic marker; unmutated IGHV indicates more aggressive disease)","TP53 mutation sequencing (detects TP53 mutations not captured by del(17p) FISH; predicts chemotherapy resistance)","Quantitative immunoglobulins (IgG, IgA, IgM -- progressive hypogammaglobulinemia occurs in most patients and predisposes to recurrent infections)"],
        management: ["BTK inhibitors as first-line targeted therapy (ibrutinib, acalabrutinib, or zanubrutinib -- continuous oral therapy until progression; particularly important for del(17p)/TP53 mutated disease which is chemotherapy-resistant)","Venetoclax-based regimens (venetoclax + obinutuzumab for time-limited first-line therapy; venetoclax + rituximab for relapsed disease; requires TLS prophylaxis during dose ramp-up)","Watch and wait for asymptomatic early-stage CLL (Rai stage 0-II without active disease criteria; treatment is NOT indicated based on elevated lymphocyte count alone)","IVIG replacement for recurrent infections with documented hypogammaglobulinemia (IgG <500 mg/dL with recurrent bacterial infections)","Infection prevention (age-appropriate vaccinations before treatment initiation; pneumococcal, influenza, COVID-19; avoid live vaccines; Pneumocystis prophylaxis with BTK inhibitors)","Richter transformation evaluation (rapid clinical deterioration with markedly elevated LDH warrants PET/CT and biopsy of most FDG-avid node)"],
        nursingActions: ["Monitor CBC with differential regularly per protocol (track lymphocyte count trends, hemoglobin, platelets -- progressive cytopenias indicate disease progression or treatment effect)","Assess for signs of infection at every visit (CLL patients are immunocompromised -- fever may be the only sign; common infections include pneumonia, sinusitis, UTI, herpes zoster, and opportunistic infections)","Educate patients about watch-and-wait approach (many patients have difficulty accepting 'no treatment' for cancer; explain that early treatment does NOT improve outcomes in asymptomatic disease and that monitoring IS active management)","Monitor for BTK inhibitor side effects: atrial fibrillation (palpitations, irregular pulse -- obtain ECG), bleeding (bruising, epistaxis -- BTK inhibitors impair platelet function; hold before procedures), hypertension, arthralgias, diarrhea","Implement tumor lysis syndrome (TLS) prevention protocol for venetoclax initiation: gradual dose ramp-up over 5 weeks (20mg -> 50mg -> 100mg -> 200mg -> 400mg), aggressive hydration, allopurinol, frequent lab monitoring (K+, uric acid, phosphorus, calcium, creatinine at 6-8 hours and 24 hours after each dose increase)","Assess for autoimmune complications: monitor for signs of AIHA (jaundice, dark urine, fatigue, tachycardia) and ITP (petechiae, mucosal bleeding, easy bruising) -- obtain direct Coombs test and reticulocyte count if hemolytic anemia suspected","Monitor for Richter transformation: sudden rapid lymph node enlargement, markedly elevated LDH, new B symptoms (fever, drenching night sweats, weight loss >10%), sudden clinical deterioration -- report immediately"],
        assessmentFindings: ["Painless lymphadenopathy (symmetric, generalized -- cervical, axillary, inguinal nodes most commonly involved; rubbery, non-tender, mobile)","Splenomegaly (progressive; may cause early satiety, left upper quadrant discomfort)","Fatigue and malaise (often the most prominent symptom; multifactorial -- anemia, disease burden, cytokine effects)","Recurrent infections (sinopulmonary infections most common; reflects progressive immunodeficiency from hypogammaglobulinemia and T-cell dysfunction)","Smudge cells on peripheral blood smear (fragile CLL lymphocytes disrupted during slide preparation -- characteristic artifact)","B symptoms when present (fever >38C, drenching night sweats, unintentional weight loss >10% over 6 months -- indicate active disease requiring treatment)","Signs of autoimmune hemolysis (jaundice, pallor, tachycardia, dark urine -- warm AIHA with positive direct Coombs test occurs in 5-10% of CLL patients)"],
        signs: { left: ["Asymptomatic lymphocytosis discovered incidentally on routine blood work","Rai stage 0 (lymphocytosis only) with stable counts over months","Mild painless cervical lymphadenopathy without constitutional symptoms","Normal hemoglobin and platelet counts","Normal immunoglobulin levels"], right: ["Richter transformation to aggressive DLBCL (rapid node enlargement, markedly elevated LDH, rapidly declining performance status)","Severe autoimmune hemolytic anemia (hemoglobin <7, hemodynamically unstable)","Severe hypogammaglobulinemia with life-threatening sepsis","Progressive bone marrow failure with pancytopenia","Massive symptomatic splenomegaly causing cytopenias and abdominal distension"] },
        medications: [{ name: "Ibrutinib (Imbruvica)", type: "Bruton's tyrosine kinase (BTK) inhibitor (targeted oral therapy)", action: "Covalently and irreversibly binds to a cysteine residue (C481) in the ATP-binding domain of Bruton's tyrosine kinase, permanently inactivating the enzyme. BTK is a critical signaling molecule in the B-cell receptor (BCR) pathway that drives CLL cell survival, proliferation, and retention in protective lymphoid microenvironments. By inhibiting BTK, ibrutinib blocks BCR-mediated survival signals, disrupts CLL cell interactions with the protective stromal microenvironment (inhibiting chemokine-mediated migration and adhesion), and promotes CLL cell mobilization from lymphoid tissues into the peripheral blood where they undergo apoptosis. This produces the characteristic early treatment lymphocytosis (rising lymphocyte count in the first weeks to months of therapy as CLL cells are displaced from tissues) followed by progressive lymphocyte count reduction.", sideEffects: "Atrial fibrillation (5-16%, dose-related; BTK inhibition affects cardiac ion channels; more common in patients with pre-existing cardiac disease), bleeding (bruising, epistaxis, petechiae -- BTK plays a role in platelet adhesion and aggregation through collagen receptor glycoprotein VI signaling; major hemorrhage in 2-5%), hypertension (new or worsening in up to 20%), arthralgias, diarrhea, rash, infection risk (aspergillosis risk, pneumonia), second primary malignancies (skin cancers)", contra: "Concurrent use of strong CYP3A4 inhibitors (ketoconazole, voriconazole -- significantly increase ibrutinib levels) or inducers (rifampin -- reduce efficacy); concurrent anticoagulation requires careful risk-benefit assessment due to additive bleeding risk; hold 3-7 days before surgical procedures", pearl: "420 mg PO once daily, taken at the same time each day with water; CONTINUOUS therapy -- do not stop at remission (disease typically relapses upon discontinuation with BTK inhibitors); early lymphocytosis is EXPECTED and is NOT treatment failure (lymphocyte count may rise 2-3x in first months as CLL cells are mobilized from lymph nodes -- this resolves over 3-6 months); monitor ECG for atrial fibrillation; avoid concurrent use with antiplatelet agents and anticoagulants when possible; grapefruit and Seville oranges inhibit CYP3A4 and should be avoided; second-generation BTK inhibitors (acalabrutinib, zanubrutinib) have fewer off-target effects and lower AF rates" },{ name: "Venetoclax (Venclexta)", type: "BCL-2 inhibitor (BH3 mimetic oral targeted therapy)", action: "Selectively binds to the BH3-binding groove of the anti-apoptotic protein BCL-2, displacing pro-apoptotic proteins BIM and BAX from BCL-2 sequestration. The liberated BIM and BAX oligomerize and form pores in the outer mitochondrial membrane (mitochondrial outer membrane permeabilization/MOMP), triggering cytochrome c release, apoptosome assembly, and activation of the caspase cascade leading to rapid apoptosis. CLL cells are exquisitely dependent on BCL-2 for survival (BCL-2 overexpression is nearly universal in CLL), making them highly sensitive to venetoclax-induced apoptosis. The rapid and extensive cell killing by venetoclax creates significant risk of tumor lysis syndrome, necessitating a carefully structured dose ramp-up protocol.", sideEffects: "Tumor lysis syndrome (TLS -- the most significant risk; rapid cell lysis releases intracellular contents causing hyperkalemia, hyperphosphatemia, hyperuricemia, hypocalcemia, and acute kidney injury; can be fatal; requires mandatory dose ramp-up protocol), neutropenia (dose-dependent, may require G-CSF support or dose reduction; most common grade 3-4 adverse event), diarrhea, nausea, upper respiratory tract infections, fatigue, anemia", contra: "Concurrent strong CYP3A4 inhibitors during dose ramp-up (dramatically increases venetoclax levels and TLS risk); inadequate hydration or inability to maintain scheduled lab monitoring during ramp-up; tumor burden too high for safe initiation without pre-treatment debulking", pearl: "MANDATORY dose ramp-up over 5 weeks: 20 mg x 1 week, 50 mg x 1 week, 100 mg x 1 week, 200 mg x 1 week, then 400 mg daily (maintenance); TLS prophylaxis required at EVERY dose increase: adequate hydration (1.5-2 L/day starting 2 days before), allopurinol (300 mg daily starting 2-3 days before first dose), and STAT labs at 6-8 hours and 24 hours after each new dose level (potassium, uric acid, phosphorus, calcium, creatinine); hospitalize for first dose if high TLS risk (any lymph node >10 cm or ALC >25,000 with any node >5 cm); unlike BTK inhibitors, venetoclax-based regimens can be TIME-LIMITED (typically 12-24 months) with durable remissions -- this is a major advantage for patients who want a treatment-free period" },{ name: "Rituximab (Rituxan)", type: "Anti-CD20 chimeric monoclonal antibody", action: "Binds to the CD20 antigen expressed on the surface of normal and malignant B lymphocytes (including CLL cells, though CLL cells express CD20 at lower density than normal B cells). CD20 binding triggers B-cell destruction through multiple mechanisms: complement-dependent cytotoxicity (CDC -- activation of the classical complement pathway), antibody-dependent cellular cytotoxicity (ADCC -- engagement of Fc receptors on NK cells and macrophages), antibody-dependent cellular phagocytosis (ADCP), and direct induction of apoptosis. In CLL, rituximab is used in combination with chemotherapy (FCR) or targeted agents (venetoclax-rituximab) to enhance CLL cell killing.", sideEffects: "Infusion-related reactions (most common: fever, chills, rigors, hypotension, bronchospasm, urticaria -- more frequent with first infusion; pre-medicate with acetaminophen, diphenhydramine, and corticosteroid), hepatitis B reactivation (screen all patients with HBsAg and anti-HBc before treatment; administer antiviral prophylaxis if positive), progressive multifocal leukoencephalopathy (PML -- rare but fatal JC virus reactivation), late-onset neutropenia (months after treatment completion), hypogammaglobulinemia (cumulative B-cell depletion reduces antibody production)", contra: "Active, severe infections; known hypersensitivity; hepatitis B virus carriers without antiviral prophylaxis (risk of fatal reactivation); live vaccines (B-cell depletion impairs vaccine response for 6-12 months after treatment)", pearl: "First infusion: start slowly at 50 mg/hour, escalate by 50 mg/hour every 30 minutes as tolerated to maximum 400 mg/hour; subsequent infusions can be given faster if first was tolerated; pre-medication with acetaminophen, diphenhydramine, and methylprednisolone is standard; HBV screening is MANDATORY before first dose; obinutuzumab (Gazyva) is a newer anti-CD20 antibody with superior efficacy in CLL (enhanced ADCC and direct cell death compared to rituximab) and is preferred in venetoclax combination regimens; monitor for infusion reactions -- have emergency medications at bedside; post-treatment IVIG may be needed for hypogammaglobulinemia" }],
        pearls: ["CLL is a diagnosis that does NOT always require immediate treatment -- watch-and-wait is appropriate for asymptomatic early-stage disease; educate patients that treatment is initiated only when iwCLL criteria for active disease are met, NOT based on lymphocyte count alone","Smudge cells on the peripheral blood smear are a characteristic artifact of CLL -- fragile CLL lymphocytes are disrupted during slide preparation, creating smeared nuclear remnants; their presence in high numbers should prompt flow cytometry for CLL evaluation","Early lymphocytosis during BTK inhibitor therapy (ibrutinib, acalabrutinib) is EXPECTED and NOT treatment failure -- the rising lymphocyte count reflects mobilization of CLL cells from protective lymphoid microenvironments into the peripheral blood; this resolves over 3-6 months as displaced cells undergo apoptosis","Venetoclax requires a MANDATORY 5-week dose ramp-up protocol with tumor lysis syndrome monitoring (labs at 6-8 and 24 hours after each dose increase) because the rapid BCL-2 inhibitor-induced apoptosis can cause lethal TLS -- this protocol must NEVER be shortened or bypassed","Del(17p)/TP53 mutation identifies CLL that is RESISTANT to conventional chemotherapy -- these patients should receive targeted therapy (BTK inhibitor or venetoclax-based regimen) as first-line treatment rather than chemoimmunotherapy","Richter transformation (CLL transforming to aggressive DLBCL) should be suspected when a CLL patient develops rapidly enlarging lymph nodes, markedly elevated LDH, new B symptoms, or sudden clinical deterioration -- PET/CT and biopsy of the most FDG-avid node are essential for diagnosis","Hypogammaglobulinemia is progressive in CLL and is the primary driver of infection susceptibility -- IVIG replacement (monthly infusion to maintain IgG >500 mg/dL) is indicated for patients with recurrent serious bacterial infections and documented IgG <500 mg/dL"],
        quiz: [{ question: "A patient newly started on ibrutinib for CLL has a follow-up CBC showing the lymphocyte count increased from 45,000 to 78,000/mcL after 6 weeks of treatment. The patient feels well with shrinking lymph nodes. What should the nurse understand about this finding?", options: ["This indicates treatment failure and ibrutinib should be discontinued","This is an expected pharmacological effect -- BTK inhibitors mobilize CLL cells from lymph nodes into the blood, causing transient lymphocytosis that resolves over months","The dose of ibrutinib needs to be increased to control the rising count","This represents Richter transformation requiring urgent biopsy"], correct: 1, rationale: "Early treatment lymphocytosis is a well-characterized and EXPECTED effect of BTK inhibitors. Ibrutinib disrupts CLL cell retention in lymphoid tissues by inhibiting chemokine-mediated migration and adhesion, causing CLL cells to mobilize from lymph nodes and bone marrow into the peripheral blood. This explains the rising blood lymphocyte count occurring simultaneously with shrinking lymph nodes. The displaced cells gradually undergo apoptosis over 3-6 months, and the lymphocyte count normalizes. This is NOT treatment failure and does not require dose changes or discontinuation." },{ question: "The nurse is initiating venetoclax for a CLL patient with a lymphocyte count of 80,000/mcL and a 7 cm lymph node. Which safety measure is MOST critical during the dose ramp-up?", options: ["Daily chest X-rays to monitor for pneumonia","Tumor lysis syndrome monitoring with labs at 6-8 hours and 24 hours after each dose escalation, along with adequate hydration and allopurinol prophylaxis","Weekly cardiac monitoring with serial echocardiograms","Daily bone marrow biopsies to assess treatment response"], correct: 1, rationale: "Tumor lysis syndrome (TLS) is the most critical safety concern during venetoclax initiation. The rapid and extensive apoptosis of CLL cells releases intracellular contents (potassium, phosphorus, uric acid, nucleic acids), which can cause hyperkalemia, hyperphosphatemia, hyperuricemia, hypocalcemia, acute kidney injury, and death. The mandatory TLS prophylaxis protocol includes: adequate hydration (1.5-2 L/day), allopurinol, and STAT labs at 6-8 hours and 24 hours after EACH dose increase during the 5-week ramp-up. With an ALC of 80,000 and a 7 cm node, this patient is at high TLS risk and may require hospitalization for the first dose." },{ question: "A CLL patient presents with rapidly enlarging cervical lymph nodes, LDH of 1,200 U/L (normal <250), drenching night sweats, and 15-pound weight loss over 3 weeks. The nurse should be most concerned about:", options: ["Normal disease progression of CLL requiring standard treatment initiation","Richter transformation -- CLL transforming to aggressive diffuse large B-cell lymphoma requiring urgent evaluation","A concurrent upper respiratory infection causing reactive lymphadenopathy","Autoimmune hemolytic anemia complicating the CLL"], correct: 1, rationale: "Richter transformation (development of aggressive DLBCL from the CLL clone) occurs in 2-10% of CLL patients and presents with this classic constellation: rapidly enlarging lymph nodes, markedly elevated LDH, prominent B symptoms (fever, night sweats, weight loss), and sudden clinical deterioration. The dramatic elevation of LDH reflects the high proliferative rate and tissue destruction of the aggressive lymphoma. This requires urgent evaluation with PET/CT (shows intensely FDG-avid nodes) and biopsy of the most metabolically active node for definitive diagnosis. Median survival after Richter transformation is only 5-8 months, making rapid diagnosis and treatment critical." }]
  },
  "cml-management-np": {
      "title": "CML Management",
      "cellular": {
        "title": "BCR-ABL Oncogene & Tyrosine Kinase Inhibition",
        "content": "Chronic myeloid leukemia (CML) is defined by the Philadelphia chromosome t(9;22), which creates the BCR-ABL fusion oncogene encoding a constitutively active tyrosine kinase. This drives unregulated myeloid proliferation and resistance to apoptosis. CML progresses through three phases: chronic (>90% of patients at diagnosis; leukocytosis with left shift, basophilia, splenomegaly), accelerated (10-19% blasts, increasing basophilia, cytogenetic evolution), and blast crisis (≥20% blasts, behaves like acute leukemia with poor prognosis). Tyrosine kinase inhibitors (TKIs) revolutionized treatment: imatinib was the first targeted therapy, binding the ATP-binding site of BCR-ABL and reducing its kinase activity. Second-generation TKIs (dasatinib, nilotinib, bosutinib) have greater potency and overcome many imatinib-resistant mutations, except the T315I gatekeeper mutation (treated with ponatinib)."
      },
      "riskFactors": [
        "Age (median diagnosis at 64 years)",
        "Ionizing radiation exposure (atomic bomb survivors had increased CML incidence)",
        "No known hereditary risk factors (BCR-ABL is an acquired somatic mutation)",
        "Phase progression risk factors: large spleen, high blast count, additional cytogenetic abnormalities, platelet count >700k or <100k",
        "TKI resistance: BCR-ABL kinase domain mutations (most common: T315I), gene amplification, alternative signaling pathway activation",
        "TKI non-adherence (most common cause of treatment failure)"
      ],
      "diagnostics": [
        "CBC with differential: leukocytosis (often >100,000/µL) with left shift (myelocytes, metamyelocytes, bands), basophilia, eosinophilia, thrombocytosis",
        "Peripheral blood smear: granulocyte maturation spectrum (myeloblasts through mature neutrophils)",
        "Bone marrow biopsy with cytogenetics: Philadelphia chromosome t(9;22)(q34;q11.2) -- confirms diagnosis",
        "FISH (fluorescence in situ hybridization): detects BCR-ABL fusion; faster than conventional cytogenetics",
        "Quantitative RT-PCR for BCR-ABL transcripts: most sensitive test; used for monitoring treatment response (target: major molecular response = BCR-ABL ≤0.1% IS)",
        "Sokal or Euro risk scores for prognostic stratification at diagnosis",
        "BCR-ABL kinase domain mutation analysis if treatment failure or loss of response"
      ],
      "management": [
        "First-line chronic phase: TKI therapy -- imatinib 400 mg daily, dasatinib 100 mg daily, nilotinib 300 mg BID, or bosutinib 400 mg daily",
        "Monitoring milestones: BCR-ABL ≤10% IS at 3 months, ≤1% at 6 months, ≤0.1% (major molecular response, MMR) at 12 months",
        "Treatment failure: switch to alternative TKI; perform BCR-ABL mutation analysis to guide selection",
        "T315I mutation: ponatinib (third-generation TKI) or asciminib (STAMP inhibitor targeting myristoyl pocket)",
        "Accelerated/blast crisis: more potent TKI + consider chemotherapy and allogeneic stem cell transplant",
        "Treatment-free remission (TFR): select patients with deep molecular response (MR4.5 for ≥2 years) may attempt TKI discontinuation with close monitoring",
        "Allogeneic stem cell transplant: reserved for TKI-refractory disease, blast crisis, or T315I mutation if ponatinib fails"
      ],
      "nursingActions": [
        "Ensure BCR-ABL monitoring by quantitative RT-PCR every 3 months for first 2 years, then every 3-6 months",
        "Monitor treatment milestones: verify BCR-ABL response at 3, 6, and 12 months; failure to meet milestones requires regimen change",
        "Assess TKI adherence at every visit -- non-adherence is the most common cause of treatment failure",
        "Monitor for TKI side effects: imatinib (edema, muscle cramps, GI upset, myelosuppression), dasatinib (pleural effusion, pulmonary arterial hypertension), nilotinib (QT prolongation, hyperglycemia, pancreatitis, vascular events)",
        "Monitor ECG for QT prolongation with nilotinib; fasting lipid panel and glucose",
        "Educate on drug-food interactions: nilotinib must be taken on EMPTY stomach (food increases absorption by 80%, risking QT prolongation); imatinib WITH food",
        "Monitor CBC weekly initially then monthly; hold TKI for severe myelosuppression (ANC <1000, platelets <50,000)"
      ],
      "assessmentFindings": [
        "Often incidental finding on CBC: marked leukocytosis (WBC 50,000-500,000)",
        "Splenomegaly (60% at diagnosis; may cause LUQ fullness, early satiety)",
        "Fatigue, malaise, weight loss, night sweats (constitutional symptoms)",
        "Leukostasis symptoms if WBC >100,000: visual changes, dyspnea, priapism, altered mental status (medical emergency)",
        "Gout from hyperuricemia (massive cell turnover)",
        "Accelerated/blast crisis: increasing blasts, worsening symptoms, organ infiltration"
      ],
      "signs": {
        "left": [
          "Incidental leukocytosis on routine CBC with no symptoms",
          "Chronic phase CML responding to TKI with declining BCR-ABL levels",
          "Achieving major molecular response (BCR-ABL ≤0.1%) at 12 months",
          "Stable CBC on TKI therapy with minimal side effects"
        ],
        "right": [
          "Leukostasis from WBC >100,000: emergent leukapheresis required",
          "Blast crisis: ≥20% blasts, behaves like acute leukemia (poor prognosis)",
          "TKI resistance with T315I mutation requiring ponatinib",
          "Severe dasatinib-induced pleural effusion requiring TKI switch",
          "Tumor lysis syndrome during initial treatment of high WBC count"
        ]
      },
      "medications": [
        {
          "name": "Imatinib (Gleevec)",
          "type": "First-generation tyrosine kinase inhibitor",
          "action": "Competitively binds the ATP-binding site of the BCR-ABL fusion protein, blocking its constitutive tyrosine kinase activity; halts unregulated myeloid proliferation and induces apoptosis of Ph+ cells; revolutionized CML from fatal disease to manageable chronic condition",
          "sideEffects": "Edema (periorbital, peripheral), muscle cramps, nausea, diarrhea, rash, myelosuppression, hepatotoxicity, QT prolongation (rare)",
          "contra": "Known hypersensitivity; pregnancy (teratogenic); concurrent strong CYP3A4 inhibitors (increases levels); severe hepatic impairment",
          "pearl": "400 mg daily WITH food and full glass of water; CYP3A4 substrate (avoid grapefruit juice, St. John's wort); 5-year survival >90% in chronic phase CML; most patients achieve complete cytogenetic response; resistance develops via BCR-ABL mutations -- second-generation TKIs overcome most mutations except T315I"
        },
        {
          "name": "Dasatinib (Sprycel)",
          "type": "Second-generation tyrosine kinase inhibitor (multi-kinase inhibitor)",
          "action": "325x more potent than imatinib against BCR-ABL; also inhibits SRC family kinases; covers most imatinib-resistant BCR-ABL mutations (except T315I); crosses the blood-brain barrier (useful for CNS disease)",
          "sideEffects": "Pleural effusion (20-35%, unique to dasatinib -- dose-dependent), pulmonary arterial hypertension (rare but serious), myelosuppression (more than imatinib), GI upset, headache, hemorrhage",
          "contra": "Pregnancy, known hypersensitivity; caution in patients with pleural disease or PAH risk factors",
          "pearl": "100 mg daily; pleural effusion is the most clinically significant side effect -- monitor for dyspnea, cough; manage with dose reduction, diuretics, or TKI switch; unlike nilotinib, can be taken with or without food; hold for ANC <500 or platelets <10,000"
        }
      ],
      "pearls": [
        "The Philadelphia chromosome t(9;22) creating BCR-ABL is the hallmark of CML -- its presence confirms the diagnosis and its quantitation guides therapy",
        "TKI therapy transformed CML from a uniformly fatal disease (median survival 3-5 years) to a chronic manageable condition (10-year survival >80%)",
        "NON-ADHERENCE is the #1 cause of TKI treatment failure -- assess adherence at every visit; even partial non-adherence significantly reduces molecular response rates",
        "BCR-ABL monitoring milestones: ≤10% at 3 months, ≤1% at 6 months, ≤0.1% (MMR) at 12 months; failure to meet these triggers regimen change",
        "T315I 'gatekeeper' mutation confers resistance to ALL first and second-generation TKIs; only ponatinib and asciminib are effective",
        "Nilotinib must be taken on EMPTY stomach (no food 2 hours before or 1 hour after) due to dramatically increased absorption with food risking QT prolongation; imatinib is the opposite -- take WITH food"
      ],
      "quiz": [
        {
          "question": "A CML patient on imatinib has a BCR-ABL level of 15% at 3 months. Per NCCN guidelines, this indicates:",
          "options": [
            "Optimal response -- continue imatinib",
            "Warning -- continue imatinib with close monitoring",
            "Treatment failure -- switch TKI and check for BCR-ABL mutations",
            "Complete molecular response -- consider TKI discontinuation"
          ],
          "correct": 2,
          "rationale": "BCR-ABL >10% at 3 months is considered treatment failure per NCCN/ELN guidelines. The patient should be switched to a second-generation TKI (dasatinib, nilotinib, or bosutinib) and BCR-ABL kinase domain mutation analysis should be performed to guide selection."
        },
        {
          "question": "BCR-ABL mutation analysis reveals a T315I mutation. Which TKI is effective against this mutation?",
          "options": [
            "Imatinib",
            "Dasatinib",
            "Nilotinib",
            "Ponatinib"
          ],
          "correct": 3,
          "rationale": "The T315I 'gatekeeper' mutation confers resistance to ALL first-generation (imatinib) and second-generation (dasatinib, nilotinib, bosutinib) TKIs. Ponatinib (third-generation) and asciminib (STAMP inhibitor) are the only TKIs effective against T315I."
        },
        {
          "question": "Why must nilotinib be taken on an empty stomach?",
          "options": [
            "Food decreases absorption",
            "Food increases absorption by ~80%, raising drug levels and QT prolongation risk",
            "It causes more nausea with food",
            "It interacts with dairy products"
          ],
          "correct": 1,
          "rationale": "Food increases nilotinib absorption by approximately 80%, leading to supratherapeutic levels and increased risk of QT prolongation (potentially fatal arrhythmias). It must be taken 2 hours after and 1 hour before meals. This is opposite to imatinib, which should be taken WITH food."
        }
      ]
    },
  "cmp-interpretation-np": {
      "title": "CMP Interpretation",
      "cellular": {
        "title": "Comprehensive Metabolic Panel Components",
        "content": "The comprehensive metabolic panel (CMP) includes 14 tests evaluating renal function (BUN, creatinine, eGFR), electrolytes (Na+, K+, Cl-, CO2/bicarbonate, calcium), glucose, and hepatic function (total protein, albumin, bilirubin, AST, ALT, ALP). Interpreting the CMP requires understanding of the physiological systems each test reflects. Sodium reflects water balance (hyponatremia is usually dilutional, not sodium depletion). Potassium homeostasis is maintained by aldosterone (renal excretion), insulin (cellular uptake), and acid-base status (acidosis shifts K+ extracellularly). The anion gap (Na - Cl - HCO3; normal 8-12) identifies the cause of metabolic acidosis: elevated gap indicates acid accumulation (MUDPILES: Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates); normal gap indicates bicarbonate loss (diarrhea, RTA)."
      },
      "riskFactors": [
        "CKD (abnormal creatinine, BUN, electrolytes, calcium, phosphorus, bicarbonate)",
        "Liver disease (abnormal AST, ALT, ALP, bilirubin, albumin, INR)",
        "Diabetes (glucose abnormalities, potential renal/hepatic involvement)",
        "Heart failure (dilutional hyponatremia, prerenal azotemia)",
        "Dehydration and volume depletion (prerenal azotemia, hypernatremia)",
        "Medications: diuretics (electrolyte derangements), ACEi/ARB (hyperkalemia, creatinine changes), NSAIDs (renal impairment)",
        "Malnutrition, alcoholism (hypoalbuminemia, hypomagnesemia, electrolyte abnormalities)",
        "Rhabdomyolysis (elevated creatinine from CK, hyperkalemia, hyperphosphatemia, hypocalcemia)"
      ],
      "diagnostics": [
        "Electrolytes: Na+ (135-145), K+ (3.5-5.0), Cl- (96-106), CO2/bicarb (22-28); derangements indicate fluid/acid-base/hormonal disorders",
        "Renal function: BUN (7-20), Creatinine (0.7-1.3 male, 0.6-1.1 female), eGFR; BUN/Cr ratio >20:1 suggests prerenal azotemia",
        "Glucose: fasting 70-99 normal, 100-125 prediabetes, ≥126 diabetes; random ≥200 with symptoms = diabetes",
        "Hepatic panel: AST/ALT (aminotransferases indicating hepatocellular injury); ALP (cholestatic/biliary obstruction); bilirubin (direct/indirect for conjugated/unconjugated); albumin (synthetic function)",
        "Anion gap calculation: Na - (Cl + HCO3); normal 8-12; elevated gap acidosis (MUDPILES) vs normal gap acidosis (bicarbonate loss)",
        "Calcium: total calcium must be corrected for albumin; corrected Ca = total Ca + 0.8 × (4.0 - albumin); ionized calcium is more accurate"
      ],
      "management": [
        "Hyponatremia: determine volume status first (hypovolemic → NS; euvolemic SIADH → fluid restrict; hypervolemic HF/cirrhosis → fluid restrict + diuretics); correct slowly ≤8 mEq/L per 24 hours to prevent osmotic demyelination syndrome",
        "Hyperkalemia: ECG first; if ECG changes → IV calcium gluconate (membrane stabilizer), insulin + dextrose, albuterol, sodium bicarb; if K+ >6.5 or refractory → dialysis",
        "Hypokalemia: oral KCl supplementation (10-20 mEq per 0.1 mEq/L deficit); always check magnesium (hypomagnesemia causes refractory hypokalemia); IV KCl max 10 mEq/hour peripheral, 20 mEq/hour central",
        "Elevated transaminases: pattern recognition (AST:ALT >2:1 in alcoholic liver disease; ALT > AST in viral/NASH; markedly elevated >1000 in ischemic hepatitis, viral hepatitis, acetaminophen toxicity)",
        "Elevated ALP with normal transaminases: cholestatic pattern → check GGT (elevated confirms hepatobiliary source vs bone); obtain RUQ ultrasound",
        "Metabolic acidosis with elevated anion gap: identify and treat the underlying cause (MUDPILES mnemonic)"
      ],
      "nursingActions": [
        "Interpret CMP systematically: electrolytes → renal function → glucose → hepatic panel; always calculate anion gap in acidosis",
        "Correlate laboratory abnormalities with clinical presentation and medication list",
        "Correct total calcium for albumin level: corrected Ca = total Ca + 0.8 × (4.0 - albumin)",
        "Identify critically abnormal values requiring immediate intervention: K+ >6.0 or <2.5, Na+ <120 or >160, glucose <50 or >600, creatinine rising acutely",
        "Ensure ECG is obtained for any potassium abnormality outside normal range",
        "Calculate BUN/Cr ratio to differentiate prerenal (>20:1) from intrinsic renal disease",
        "Monitor trends over time rather than single values; rate of change is clinically important"
      ],
      "assessmentFindings": [
        "Hyponatremia (<135): confusion, headache, nausea, seizures, coma if severe/rapid",
        "Hyperkalemia (>5.0): muscle weakness, paresthesias, peaked T waves, widened QRS, bradycardia, cardiac arrest if severe",
        "Hypocalcemia: Chvostek sign (facial twitching with tapping CN VII), Trousseau sign (carpal spasm with BP cuff inflation), perioral tingling, tetany, QT prolongation",
        "Elevated BUN/Cr with oliguria: assess volume status, urine output, medications",
        "Elevated transaminases: RUQ tenderness, jaundice, hepatomegaly suggest hepatic pathology",
        "Hyperglycemia: polyuria, polydipsia, polyphagia, blurred vision; Kussmaul breathing if DKA"
      ],
      "signs": {
        "left": [
          "Mild electrolyte abnormalities correctable with oral supplementation",
          "Mildly elevated transaminases (<3x ULN) requiring monitoring",
          "Stable mild chronic kidney disease on serial CMP",
          "Mild hyperglycemia in known diabetic responding to adjustment"
        ],
        "right": [
          "Severe hyperkalemia (K+ >6.5) with peaked T waves and widened QRS -- emergent treatment needed",
          "Severe hyponatremia (<120) with seizures or altered mental status -- hypertonic saline (3% NS)",
          "Transaminases >1000 IU/L (ischemic hepatitis, acetaminophen toxicity, acute viral hepatitis)",
          "DKA: glucose >250, anion gap >12, pH <7.3, bicarb <18, positive ketones",
          "Acute kidney injury: creatinine >2x baseline or oliguria <0.5 mL/kg/hr"
        ]
      },
      "medications": [
        {
          "name": "Potassium Chloride (KCl)",
          "type": "Electrolyte supplement",
          "action": "Provides potassium for replacement in hypokalemia; essential for maintaining resting membrane potential, cardiac conduction, muscle contraction, and acid-base balance",
          "sideEffects": "GI irritation (nausea, vomiting, diarrhea with oral formulation), hyperkalemia if over-supplemented, tissue necrosis if IV infiltrates, cardiac arrhythmias if infused too rapidly",
          "contra": "Hyperkalemia, severe renal impairment (impaired excretion), Addison disease, concurrent potassium-sparing diuretics without monitoring",
          "pearl": "Oral: 10-20 mEq for each 0.1 mEq/L deficit; IV: max 10 mEq/hour peripheral line, 20 mEq/hour central line with cardiac monitoring; ALWAYS check and replete magnesium first -- hypomagnesemia causes refractory hypokalemia (magnesium is required for the renal potassium-retaining channel ROMK); never give IV push"
        }
      ],
      "pearls": [
        "ALWAYS check magnesium when treating hypokalemia -- hypomagnesemia causes refractory hypokalemia because Mg2+ is required for the ROMK channel that retains potassium in the kidney",
        "Anion gap = Na - (Cl + HCO3); elevated gap (>12) = acid ACCUMULATION (MUDPILES); normal gap = bicarbonate LOSS (diarrhea, RTA)",
        "Correct calcium for albumin: for every 1 g/dL albumin below 4.0, add 0.8 to measured calcium; or use ionized calcium directly",
        "AST:ALT ratio >2:1 suggests alcoholic liver disease; ALT > AST suggests viral hepatitis or NASH; ALT and AST >1000 suggests ischemic hepatitis, acute viral hepatitis, or acetaminophen toxicity",
        "Hyponatremia correction speed is CRITICAL: ≤8 mEq/L in 24 hours to prevent osmotic demyelination syndrome (central pontine myelinolysis); too-rapid correction is more dangerous than the hyponatremia itself in many cases",
        "BUN/Cr ratio >20:1 = prerenal azotemia (volume depletion, CHF, liver failure); ratio 10-20:1 = intrinsic renal disease; ratio <10:1 = post-renal or protein malnutrition"
      ],
      "quiz": [
        {
          "question": "A patient has K+ of 2.8 mEq/L. IV potassium replacement is started but levels remain low despite appropriate supplementation. What should the NP check?",
          "options": [
            "Serum calcium level",
            "Serum magnesium level -- hypomagnesemia causes refractory hypokalemia",
            "Serum phosphorus level",
            "Thyroid function tests"
          ],
          "correct": 1,
          "rationale": "Hypomagnesemia is the most common cause of refractory hypokalemia. Magnesium is required for the ROMK potassium channel in the kidney; without adequate magnesium, the kidney wastes potassium regardless of supplementation. Always check and replete magnesium before or concurrently with potassium."
        },
        {
          "question": "A patient has Na+ 118, serum osmolality 260, and urine osmolality 500. The patient is euvolemic. What is the most likely diagnosis?",
          "options": [
            "Dehydration",
            "SIADH (syndrome of inappropriate ADH secretion)",
            "Adrenal insufficiency",
            "Psychogenic polydipsia"
          ],
          "correct": 1,
          "rationale": "Hyponatremia with low serum osmolality (hypotonic hyponatremia), concentrated urine (osmolality >100), and euvolemic status is classic for SIADH. In SIADH, excess ADH causes water retention and dilutional hyponatremia. Treatment is fluid restriction; severe cases may need hypertonic saline."
        },
        {
          "question": "A patient has metabolic acidosis with anion gap of 22. Using the MUDPILES mnemonic, which condition is NOT a cause of elevated anion gap acidosis?",
          "options": [
            "Diabetic ketoacidosis",
            "Lactic acidosis",
            "Diarrhea",
            "Uremia"
          ],
          "correct": 2,
          "rationale": "Diarrhea causes a NORMAL anion gap (non-gap) metabolic acidosis through direct bicarbonate loss in the stool. MUDPILES causes of elevated anion gap acidosis: Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates."
        }
      ]
    },
};
