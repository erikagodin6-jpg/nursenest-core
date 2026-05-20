import type { ExamQuestion } from "./types";

export const npExamBatch24Questions: ExamQuestion[] = [
  {
    q: "A 50-year-old male with cirrhosis presents with confusion, asterixis, and fetor hepaticus. His last lactulose dose was 3 days ago due to diarrhea. Ammonia level is 142 mcmol/L (normal less than 35). What is the immediate management?",
    o: ["Resume lactulose titrated to 2-3 soft stools daily and add rifaximin 550 mg twice daily", "Start broad-spectrum antibiotics for presumed infection", "Administer IV ammonia-lowering agents", "Perform emergent liver transplant evaluation only"],
    a: 0,
    r: "Hepatic encephalopathy in cirrhosis is primarily managed with lactulose (osmotic laxative that converts ammonia to ammonium in the colon for fecal excretion) titrated to 2-3 soft stools per day. Rifaximin (non-absorbable antibiotic) reduces ammonia-producing intestinal bacteria and is added for recurrent episodes. This patient's encephalopathy was precipitated by lactulose discontinuation. Identifying and treating precipitants (infection, GI bleeding, constipation, medication non-compliance) is essential.",
    s: "Gastrointestinal"
  },
  {
    q: "A 40-year-old female presents with right upper quadrant pain, fever of 38.9 C, and jaundice (Charcot triad). Ultrasound shows a dilated common bile duct at 12 mm with a shadowing stone. What is the priority intervention?",
    o: ["Emergent ERCP with sphincterotomy and stone extraction plus IV antibiotics", "Elective cholecystectomy within 2 weeks", "Oral ursodiol for stone dissolution", "CT abdomen for further characterization"],
    a: 0,
    r: "Charcot triad (RUQ pain, fever, jaundice) indicates acute cholangitis from CBD obstruction. This is a life-threatening emergency requiring emergent biliary decompression via ERCP with sphincterotomy and stone extraction. IV antibiotics (covering gram-negative enterics and anaerobes) should be started simultaneously. Without drainage, cholangitis can progress to septic shock and Reynolds pentad (adding hypotension and altered mental status). Cholecystectomy follows after the acute episode resolves.",
    s: "Gastrointestinal"
  },
  {
    q: "A 55-year-old male with alcoholic cirrhosis has a MELD-Na score of 22. He has been abstinent from alcohol for 8 months. Hepatocellular carcinoma screening ultrasound shows a 2.5 cm arterially enhancing lesion with washout on portal venous phase. What does this imaging pattern indicate?",
    o: ["Hepatocellular carcinoma meeting LI-RADS 5 criteria; can be diagnosed without biopsy based on imaging characteristics alone", "Benign hepatic adenoma requiring observation", "Focal nodular hyperplasia; no intervention needed", "Metastatic disease requiring tissue biopsy for primary site identification"],
    a: 0,
    r: "In a cirrhotic liver, a lesion showing arterial hyperenhancement followed by washout on portal venous or delayed phase meets LI-RADS 5 criteria (definitive HCC). This imaging pattern has 95%+ specificity for HCC in cirrhosis, allowing diagnosis WITHOUT biopsy (to avoid tumor seeding and bleeding risk). Management depends on tumor size, number, liver function, and transplant candidacy. Milan criteria (single tumor 5 cm or less, or up to 3 tumors each 3 cm or less) determine transplant eligibility.",
    s: "Gastrointestinal"
  },
  {
    q: "A 35-year-old female with irritable bowel syndrome with diarrhea (IBS-D) has failed dietary modifications (low FODMAP), fiber supplementation, and loperamide. Rome IV criteria are met. What is the next pharmacological step?",
    o: ["Eluxadoline or rifaximin (both FDA-approved for IBS-D)", "Corticosteroids for presumed inflammatory etiology", "Laxatives for symptom relief", "Cholecystectomy for suspected biliary cause"],
    a: 0,
    r: "IBS-D failing first-line therapies (dietary modification, antispasmodics, loperamide) can be managed with eluxadoline (mu-opioid agonist/delta-opioid antagonist, contraindicated without a gallbladder or with pancreatitis history) or rifaximin 550 mg TID for 14 days (may be repeated). Alosetron (5-HT3 antagonist) is FDA-approved only for severe IBS-D in women failing conventional therapy, with a risk management program. IBS is not an inflammatory condition, so corticosteroids are inappropriate.",
    s: "Gastrointestinal"
  },
  {
    q: "A 60-year-old male presents with dysphagia to both solids and liquids simultaneously. Barium swallow shows a dilated esophagus with a bird-beak narrowing at the lower esophageal sphincter. What is the most likely diagnosis and definitive treatment?",
    o: ["Achalasia; peroral endoscopic myotomy (POEM) or laparoscopic Heller myotomy with partial fundoplication", "Esophageal carcinoma; surgical resection", "Esophageal stricture; serial dilation", "Diffuse esophageal spasm; calcium channel blockers"],
    a: 0,
    r: "Simultaneous dysphagia to solids and liquids suggests a motility disorder, not a mechanical obstruction. Bird-beak deformity on barium swallow (smooth, symmetric narrowing of the distal esophagus with proximal dilation) is pathognomonic for achalasia. Confirmatory testing is high-resolution manometry showing incomplete LES relaxation and absent peristalsis. Definitive treatments are POEM or Heller myotomy. Esophageal cancer causes progressive dysphagia to solids first, then liquids.",
    s: "Gastrointestinal"
  },
  {
    q: "A 30-year-old female presents with recurrent UTIs (5 in the past year). Urine cultures consistently show Escherichia coli. She uses diaphragm with spermicide for contraception. What preventive strategies should the NP recommend?",
    o: ["Switch contraception method, consider postcoital antibiotic prophylaxis (TMP-SMX or nitrofurantoin), and assess for anatomic abnormalities if persistent", "Long-term daily ciprofloxacin prophylaxis", "Cranberry extract as sole intervention", "Prophylactic IV antibiotic infusions monthly"],
    a: 0,
    r: "Recurrent UTIs (3 or more per year) warrant evaluation of modifiable risk factors. Diaphragm with spermicide significantly increases UTI risk by altering vaginal flora. Switching contraception is first-line prevention. Additional strategies include postcoital prophylaxis (single dose TMP-SMX or nitrofurantoin after intercourse), daily low-dose prophylaxis (if postcoital strategy fails), or self-start therapy. Fluoroquinolones are not recommended for prophylaxis due to resistance concerns and side effects.",
    s: "Renal"
  },
  {
    q: "A 45-year-old male with IgA nephropathy has persistent proteinuria of 1.8 g/day despite maximum-dose ACE inhibitor therapy for 6 months. eGFR is 55. What additional therapy should the NP discuss?",
    o: ["Consider a targeted-release formulation of budesonide (Nefecon) or immunosuppressive therapy based on nephrology guidance", "Add an ARB to the ACE inhibitor (dual RAAS blockade)", "Increase ACE inhibitor beyond maximum dose", "Start mycophenolate empirically without biopsy confirmation"],
    a: 0,
    r: "IgA nephropathy with persistent proteinuria greater than 1 g/day despite optimized RAAS blockade indicates risk of progressive CKD. Targeted-release budesonide (Nefecon) was FDA-approved for IgA nephropathy and acts on Peyer patches to reduce IgA1 production. Dual RAAS blockade increases adverse events without benefit. The TESTING trial showed benefit of systemic steroids but with infection risk. Nephrology co-management is essential for immunosuppressive decisions.",
    s: "Renal"
  },
  {
    q: "A 55-year-old female on hemodialysis three times weekly presents with intradialytic hypotension (BP drops from 140/80 to 85/50 during dialysis), cramping, and nausea. What modifications should be discussed with the dialysis team?",
    o: ["Reduce ultrafiltration rate, adjust dry weight assessment, consider sodium profiling, and evaluate for cardiac dysfunction", "Increase ultrafiltration rate to shorten dialysis time", "Administer IV labetalol during dialysis", "Hold all antihypertensive medications permanently"],
    a: 0,
    r: "Intradialytic hypotension affects 20-30% of hemodialysis sessions. Management includes reducing ultrafiltration rate (slower fluid removal), reassessing dry weight (may be set too low), sodium modeling (varying dialysate sodium concentration), cooling dialysate temperature, and withholding antihypertensives on dialysis days. Midodrine can be given pre-dialysis. Cardiac evaluation rules out diastolic dysfunction or pericardial disease contributing to hemodynamic instability.",
    s: "Renal"
  },
  {
    q: "A 35-year-old pregnant female at 28 weeks gestation presents with blood pressure of 160/105 mmHg, proteinuria of 3.5 g/24 hours, and platelet count of 95,000. Her previous blood pressures were normal. What is the diagnosis and management?",
    o: ["Preeclampsia with severe features; initiate magnesium sulfate for seizure prophylaxis, antihypertensive therapy, and plan for delivery at 34 weeks with corticosteroids for fetal lung maturity", "Gestational hypertension; monitor weekly", "Chronic hypertension; adjust home medications", "Essential hypertension with incidental proteinuria"],
    a: 0,
    r: "New-onset hypertension after 20 weeks with significant proteinuria and thrombocytopenia meets criteria for preeclampsia with severe features. Management includes: magnesium sulfate (seizure prophylaxis), IV labetalol or hydralazine (acute BP control), betamethasone (fetal lung maturity if less than 34 weeks), and delivery planning. Delivery is the definitive treatment. At 28-34 weeks, expectant management with close monitoring may allow corticosteroid administration, but immediate delivery is indicated for uncontrollable symptoms.",
    s: "Renal"
  },
  {
    q: "A 60-year-old male with diabetes presents with microalbuminuria (UACR 180 mg/g) and eGFR 72. He is on maximum-dose lisinopril. What novel therapy class should the NP consider adding for renal protection?",
    o: ["Finerenone (nonsteroidal mineralocorticoid receptor antagonist) per FIDELIO-DKD and FIGARO-DKD trial evidence", "Traditional spironolactone at high doses", "IV cyclophosphamide", "Mycophenolate mofetil"],
    a: 0,
    r: "Finerenone is a nonsteroidal MRA that demonstrated significant reduction in CKD progression and cardiovascular events in patients with diabetic kidney disease (FIDELIO-DKD and FIGARO-DKD trials). Unlike steroidal MRAs (spironolactone), finerenone has lower hyperkalemia and gynecomastia risk. It is added to maximally tolerated RAAS blockade and SGLT2 inhibitor therapy. Cyclophosphamide and MMF are for glomerulonephritis, not diabetic nephropathy.",
    s: "Renal"
  }
];
