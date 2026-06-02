import type { ExamQuestion } from "./types";

export const npExamBatch11Questions: ExamQuestion[] = [
  {
    q: "A 52-year-old male with longstanding GERD undergoes screening upper endoscopy. Biopsy of the distal esophagus shows intestinal metaplasia (Barrett esophagus) without dysplasia. What is the recommended surveillance and management?",
    o: ["Continue PPI therapy and repeat endoscopy with systematic biopsy in 3-5 years", "Perform immediate endoscopic mucosal resection", "Discontinue PPI and monitor symptoms", "Refer for esophagectomy"],
    a: 0,
    r: "Non-dysplastic Barrett esophagus carries a low annual risk of progression to adenocarcinoma (0.5% per year). Management includes continued PPI therapy to reduce acid exposure and surveillance endoscopy with 4-quadrant biopsies every 3-5 years. Endoscopic resection is for confirmed dysplasia or early neoplasia. PPI discontinuation accelerates mucosal injury. Esophagectomy is for high-grade dysplasia or carcinoma.",
    s: "Gastrointestinal"
  },
  {
    q: "A 45-year-old female presents with intermittent right upper quadrant pain after fatty meals, without fever or jaundice. Ultrasound shows multiple gallstones without common bile duct dilation. Liver function tests are normal. What is the appropriate management?",
    o: ["Refer for elective cholecystectomy given symptomatic cholelithiasis", "Prescribe ursodeoxycholic acid for stone dissolution", "Order MRCP to evaluate the biliary tree", "Observe without intervention"],
    a: 0,
    r: "Symptomatic cholelithiasis (biliary colic with meals) is an indication for elective laparoscopic cholecystectomy to prevent complications (acute cholecystitis, choledocholithiasis, gallstone pancreatitis). Ursodiol may partially dissolve cholesterol stones but has low efficacy and high recurrence rates. MRCP is indicated for suspected CBD stones. Observation risks progression to acute cholecystitis.",
    s: "Gastrointestinal"
  },
  {
    q: "A 68-year-old male presents with unintentional weight loss of 15 pounds over 4 months, new-onset painless jaundice, and dark urine. CA 19-9 is elevated. CT abdomen shows a mass in the head of the pancreas with dilation of the common bile duct and pancreatic duct. What is the most likely diagnosis and next step?",
    o: ["Pancreatic adenocarcinoma; refer to surgical oncology for staging and possible Whipple procedure", "Chronic pancreatitis; prescribe pancreatic enzyme replacement", "Cholangiocarcinoma; start palliative chemotherapy", "Acute pancreatitis; NPO and IV fluids"],
    a: 0,
    r: "Painless obstructive jaundice with weight loss, elevated CA 19-9, and a pancreatic head mass is classic for pancreatic adenocarcinoma. The double duct sign (CBD and PD dilation) on imaging is highly suggestive. Surgical oncology referral for pancreaticoduodenectomy (Whipple) is appropriate for resectable disease. EUS-guided FNA may be needed for tissue diagnosis. Chronic pancreatitis typically presents with pain. Cholangiocarcinoma arises from the bile duct, not the pancreas.",
    s: "Gastrointestinal"
  },
  {
    q: "A 32-year-old male with Crohn disease on adalimumab presents with perianal pain, swelling, and purulent drainage. Examination reveals a fluctuant perianal abscess. What is the immediate management?",
    o: ["Urgent surgical consultation for incision and drainage with evaluation for perianal fistula", "Increase adalimumab dose", "Prescribe oral ciprofloxacin and metronidazole without drainage", "Apply warm compresses and observe"],
    a: 0,
    r: "Perianal abscess in Crohn disease requires surgical incision and drainage as the definitive treatment. Antibiotics alone without drainage are ineffective for established abscess. Perianal Crohn disease frequently involves fistula formation, which should be evaluated at the time of drainage with examination under anesthesia. Biologic therapy adjustment addresses underlying inflammation but does not treat acute abscess.",
    s: "Gastrointestinal"
  },
  {
    q: "A 55-year-old female with cirrhosis secondary to hepatitis C presents with new-onset ascites. Diagnostic paracentesis shows a serum-ascites albumin gradient (SAAG) of 1.8 g/dL and total protein of 1.5 g/dL. Ascitic fluid PMN count is 30 cells/mm3. What is the appropriate initial management?",
    o: ["Sodium restriction to 2 g/day and spironolactone 100 mg daily; consider adding furosemide", "Large volume paracentesis with albumin replacement", "Start empiric IV ceftriaxone for spontaneous bacterial peritonitis", "Refer for transjugular intrahepatic portosystemic shunt (TIPS)"],
    a: 0,
    r: "New-onset ascites with SAAG greater than 1.1 g/dL confirms portal hypertension as the etiology. First-line management includes dietary sodium restriction (2 g/day) and diuretic therapy (spironolactone +/- furosemide). PMN count below 250 cells/mm3 rules out SBP. Large volume paracentesis is for refractory or tense ascites. TIPS is for diuretic-resistant ascites. Low total protein (below 1.5 g/dL) warrants SBP prophylaxis, which should be considered but initial management focuses on diuretics.",
    s: "Gastrointestinal"
  },
  {
    q: "A 58-year-old male with type 2 diabetes and CKD stage 3a (eGFR 52) has blood pressure of 145/90 mmHg on amlodipine 10 mg and lisinopril 20 mg. Serum potassium is 4.8 mEq/L. UACR is 350 mg/g. What medication adjustment provides the best renoprotective benefit?",
    o: ["Add dapagliflozin (SGLT2 inhibitor) with close monitoring of eGFR and potassium", "Add spironolactone 25 mg daily", "Increase amlodipine to 20 mg daily", "Add an ARB to the ACE inhibitor (dual RAAS blockade)"],
    a: 0,
    r: "SGLT2 inhibitors have demonstrated significant renoprotective and cardiovascular benefits in CKD with albuminuria independent of diabetes status (DAPA-CKD, CREDENCE trials). Adding to existing RAAS blockade provides additive renal protection. Spironolactone may be considered but risks hyperkalemia with potassium already 4.8. Dual RAAS blockade is not recommended (ONTARGET trial showed increased adverse events). Amlodipine dose increase lacks renal-specific benefits.",
    s: "Renal"
  },
  {
    q: "A 42-year-old female presents with sudden onset flank pain and gross hematuria. CT shows a 4 mm stone in the left proximal ureter without hydronephrosis. Creatinine is 0.9. She has no fever. What is the recommended management?",
    o: ["Conservative management with hydration, NSAIDs for pain, and alpha-blocker (tamsulosin) for medical expulsive therapy", "Emergent urological referral for extracorporeal shock wave lithotripsy", "Admission for IV antibiotics and urgent stone extraction", "CT-guided percutaneous nephrostomy"],
    a: 0,
    r: "Ureteral stones less than 5 mm have a high (greater than 90%) spontaneous passage rate. Conservative management includes adequate hydration, NSAIDs for pain (superior to opioids for renal colic), and alpha-blockers to facilitate stone passage. No signs of infection or obstruction. ESWL is for stones 5-20 mm that fail conservative management. Antibiotics and admission are not indicated without infection. Nephrostomy is for obstructed infected kidneys.",
    s: "Renal"
  },
  {
    q: "A 70-year-old male with CKD stage 4 (eGFR 18) presents with potassium of 6.2 mEq/L. ECG shows peaked T waves. He takes lisinopril and spironolactone. What is the immediate priority?",
    o: ["Administer IV calcium gluconate for cardiac stabilization, then insulin/dextrose and kayexalate; hold lisinopril and spironolactone", "Prescribe oral kayexalate and discharge with follow-up in 3 days", "Initiate emergent hemodialysis", "Reduce spironolactone dose and recheck potassium in 1 week"],
    a: 0,
    r: "Hyperkalemia of 6.2 mEq/L with ECG changes (peaked T waves) is a medical emergency. Immediate cardiac stabilization with IV calcium gluconate (10 mL of 10% over 2-3 minutes) is the first step. This is followed by treatments to shift potassium intracellularly (insulin 10 units with dextrose) and remove potassium from the body (kayexalate, possibly dialysis). RAAS-blocking medications contributing to hyperkalemia should be held. Outpatient management alone is unsafe.",
    s: "Renal"
  },
  {
    q: "A 35-year-old male with no significant history presents with blood pressure of 185/115 mmHg. He has grade III retinopathy, serum creatinine of 2.4 (baseline 0.9), and proteinuria on dipstick. What is this clinical presentation and initial management?",
    o: ["Hypertensive emergency with target organ damage; admit for IV antihypertensive therapy with controlled BP reduction of 25% in first hour", "Hypertensive urgency; prescribe oral amlodipine and follow up in 1 week", "Essential hypertension; start lisinopril 10 mg daily", "White coat hypertension; ambulatory blood pressure monitoring"],
    a: 0,
    r: "Severely elevated BP with evidence of target organ damage (grade III retinopathy, acute kidney injury, proteinuria) constitutes a hypertensive emergency requiring admission and IV antihypertensive therapy. BP should be reduced by no more than 25% in the first hour to prevent ischemic complications, then gradually to 160/100 over the next 2-6 hours. Oral therapy alone is insufficient. This is not urgency (no organ damage) or white coat hypertension.",
    s: "Renal"
  },
  {
    q: "A 55-year-old female with CKD stage 3b presents for routine follow-up. Labs show calcium 8.2 mg/dL, phosphorus 5.8 mg/dL, PTH 185 pg/mL (normal 10-65), and 25-OH vitamin D 15 ng/mL. What is the appropriate management?",
    o: ["Correct vitamin D deficiency with ergocalciferol or cholecalciferol, initiate phosphate binder with meals, and monitor calcium/phosphorus/PTH quarterly", "Start calcitriol immediately", "Refer for parathyroidectomy", "Prescribe calcium carbonate supplements three times daily"],
    a: 0,
    r: "CKD-mineral bone disorder with secondary hyperparathyroidism, hyperphosphatemia, and vitamin D deficiency requires a stepwise approach: First replete vitamin D (ergocalciferol/cholecalciferol), then initiate phosphate binders with meals. Active vitamin D (calcitriol) is considered after correcting 25-OH vitamin D and if PTH remains elevated. Parathyroidectomy is for refractory tertiary hyperparathyroidism. Calcium supplements without controlling phosphorus worsens vascular calcification.",
    s: "Renal"
  }
];
