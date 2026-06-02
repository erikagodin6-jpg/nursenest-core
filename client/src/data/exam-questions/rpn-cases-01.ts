import type { ExamQuestion } from "./types";

export const rpnCases01Questions: ExamQuestion[] = [
  {
    q: "A 74-year-old female with type 2 diabetes and hypertension is admitted for a urinary tract infection. Current medications include metformin 850 mg BID, ramipril 10 mg daily, and hydrochlorothiazide 25 mg daily. Vital signs: T 38.4°C, HR 92, BP 108/62, RR 18, SpO2 96%. The nurse notes the client's blood glucose is 3.2 mmol/L. What is the priority nursing action?",
    o: ["Administer a fast-acting carbohydrate source such as 15 g of glucose tablets and recheck in 15 minutes", "Hold the next dose of metformin and document the finding", "Notify the healthcare provider immediately before any intervention", "Encourage the client to eat her next scheduled meal early"],
    a: 0,
    r: "A blood glucose of 3.2 mmol/L indicates hypoglycaemia, which requires immediate treatment. The rule of 15 directs the nurse to give 15 g of fast-acting carbohydrate, wait 15 minutes, and recheck. Holding metformin alone does not address the acute hypoglycaemia. Notifying the provider is appropriate but treatment should not be delayed. Waiting for a meal is unsafe when the glucose is this low.",
    s: "Endocrine"
  },
  {
    q: "A 74-year-old female with type 2 diabetes and hypertension is admitted for a urinary tract infection. Her blood glucose was 3.2 mmol/L and she was treated with 15 g of glucose. Fifteen minutes later, the recheck shows 4.8 mmol/L. Her next meal is in 90 minutes. What should the nurse do next?",
    o: ["Provide a snack containing protein and complex carbohydrate to sustain the blood glucose", "Administer another 15 g of fast-acting carbohydrate", "Resume normal monitoring schedule since the glucose has normalized", "Administer her scheduled dose of metformin immediately"],
    a: 0,
    r: "After treating hypoglycaemia, if the blood glucose returns above 4.0 mmol/L but the next meal is more than one hour away, a snack with protein and complex carbohydrate helps prevent recurrence. The glucose is now adequate so additional fast-acting carbohydrate is unnecessary. Simply resuming normal monitoring ignores the risk of repeat hypoglycaemia. Administering metformin without addressing the gap before the next meal is inappropriate.",
    s: "Endocrine"
  },
  {
    q: "A 74-year-old female admitted for a urinary tract infection is on IV ceftriaxone. The nurse notes she has developed watery diarrhoea 6 times today, abdominal cramping, and a temperature of 38.7°C. What should the nurse suspect and report?",
    o: ["Clostridioides difficile infection related to antibiotic use", "Normal side effect of ceftriaxone that requires no intervention", "Food-borne gastroenteritis unrelated to the current treatment", "Worsening of the urinary tract infection"],
    a: 0,
    r: "Antibiotic-associated diarrhoea with fever, cramping, and frequent watery stools is highly suspicious for C. difficile infection. Cephalosporins are a known risk factor. This is not a benign side effect and requires stool testing, contact precautions, and possible treatment change. Food-borne illness is less likely in the hospital setting. UTI does not typically cause diarrhoea.",
    s: "Infection Control"
  },
  {
    q: "A 68-year-old male with heart failure is on furosemide 40 mg daily, carvedilol 12.5 mg BID, and ramipril 5 mg daily. He reports dizziness when standing. Vital signs: lying BP 128/76, HR 68; standing BP 96/58, HR 88. Weight has decreased 3 kg in 4 days. What finding should the nurse report to the healthcare provider first?",
    o: ["Orthostatic hypotension with a systolic drop of 32 mmHg and significant weight loss suggesting overdiuresis", "The heart rate increase of 20 bpm on standing", "The lying blood pressure being higher than expected for a heart failure patient", "The need for a higher dose of carvedilol to control the heart rate"],
    a: 0,
    r: "A systolic BP drop greater than 20 mmHg on standing defines orthostatic hypotension. Combined with a 3 kg weight loss in 4 days, this suggests excessive fluid removal from furosemide. The nurse should report both findings as the diuretic dose may need adjustment. While the heart rate increase is part of the orthostatic picture, the BP drop and weight loss together are the most clinically significant findings. The lying BP is acceptable. Increasing carvedilol would worsen the hypotension.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old male with heart failure on furosemide, carvedilol, and ramipril has orthostatic hypotension and 3 kg weight loss. His most recent lab work shows: potassium 3.1 mmol/L, sodium 134 mmol/L, creatinine 128 µmol/L. Which lab value is most concerning and requires immediate reporting?",
    o: ["Potassium 3.1 mmol/L, which is critically low and increases the risk of cardiac arrhythmias", "Sodium 134 mmol/L, indicating severe hyponatraemia", "Creatinine 128 µmol/L, indicating acute kidney failure", "All values are within normal limits for a patient on these medications"],
    a: 0,
    r: "Potassium of 3.1 mmol/L is below normal (3.5-5.0 mmol/L) and is a known complication of loop diuretics. Hypokalaemia increases the risk of life-threatening arrhythmias, especially in heart failure patients on digoxin or with existing cardiac disease. Sodium of 134 is mildly low but not critically so. Creatinine of 128 may be mildly elevated but needs comparison to baseline. These values are not all normal.",
    s: "Pharmacology"
  },
  {
    q: "A 68-year-old male with heart failure is found to have a potassium of 3.1 mmol/L while on furosemide. The healthcare provider orders potassium chloride 40 mEq orally. What is the most important nursing consideration when administering this medication?",
    o: ["Ensure the potassium is taken with a full glass of water and food to reduce gastrointestinal irritation", "Crush the potassium tablet for easier swallowing since the client is elderly", "Administer the full dose on an empty stomach for better absorption", "Hold the dose until the next scheduled blood draw to recheck the level first"],
    a: 0,
    r: "Oral potassium chloride is a gastrointestinal irritant and should be taken with food and a full glass of water to prevent nausea, vomiting, and GI ulceration. Extended-release potassium tablets should never be crushed as this destroys the slow-release mechanism and can cause GI injury. Empty stomach administration increases irritation risk. The potassium level is low enough to warrant treatment without waiting for a recheck.",
    s: "Pharmacology"
  },
  {
    q: "A 82-year-old female with dementia is admitted after a fall at her long-term care home. She has a history of osteoporosis and takes calcium carbonate 500 mg BID and vitamin D3 1000 IU daily. She is alert but confused, with a shortened and externally rotated right leg. The nurse notes right hip pain with any movement. What should the nurse do first?",
    o: ["Immobilize the right leg in the position found and report findings immediately to the healthcare provider", "Attempt to straighten the leg to assess for full range of motion", "Administer acetaminophen and reassess pain in 30 minutes", "Help the client ambulate to the bathroom to assess gait stability"],
    a: 0,
    r: "A shortened, externally rotated leg with hip pain after a fall in an osteoporotic elderly client is the classic presentation of a hip fracture. The nurse should immobilize the leg in the position found (do not attempt to realign) and notify the provider immediately for imaging. Attempting to straighten the leg or ambulate could worsen a fracture and cause further injury. Pain management is important but should not delay immobilization and reporting.",
    s: "Musculoskeletal"
  },
  {
    q: "A 82-year-old female with dementia who fell and is suspected of having a hip fracture is awaiting transfer for X-ray. She is moaning and grimacing. The nurse knows that pain assessment in clients with cognitive impairment requires a specialized approach. Which pain assessment tool is most appropriate?",
    o: ["PAINAD (Pain Assessment in Advanced Dementia) scale, which uses behavioural indicators", "Visual Analogue Scale (VAS) with a 10-cm line", "Numeric Rating Scale (NRS) from 0 to 10", "McGill Pain Questionnaire for comprehensive pain assessment"],
    a: 0,
    r: "The PAINAD scale is specifically designed for clients with advanced dementia who cannot self-report pain. It uses five behavioural indicators: breathing, negative vocalization, facial expression, body language, and consolability. The VAS and NRS require the client to self-report, which is unreliable in advanced dementia. The McGill Pain Questionnaire is complex and requires verbal and cognitive capacity beyond this client's abilities.",
    s: "Gerontology"
  },
  {
    q: "A 56-year-old male with COPD is receiving oxygen via nasal cannula at 2 L/min. His SpO2 is 91%. He asks the nurse to increase the oxygen because he still feels short of breath. What is the most appropriate nursing response?",
    o: ["Explain that the target SpO2 for COPD is 88-92% and that higher oxygen levels could suppress his drive to breathe, then report his dyspnoea to the provider", "Increase the oxygen to 4 L/min to improve the client's comfort", "Discontinue the oxygen since his SpO2 is within the acceptable range and he is likely anxious", "Switch to a non-rebreather mask at 10 L/min for maximum oxygenation"],
    a: 0,
    r: "In COPD, the target SpO2 is 88-92%. These clients may rely on hypoxic drive for respiratory stimulation, so excessive oxygen can suppress breathing. The current SpO2 of 91% is within target. The nurse should explain this to the client while reporting the ongoing dyspnoea to the provider for further assessment. Increasing to 4 L/min or a non-rebreather risks CO2 retention and respiratory depression. Discontinuing oxygen without addressing the client's distress is inappropriate.",
    s: "Respiratory"
  },
  {
    q: "A 56-year-old male with COPD is using a metered-dose inhaler (MDI) with salbutamol. The nurse observes him activating the inhaler and immediately inhaling rapidly. What teaching should the nurse reinforce?",
    o: ["Instruct the client to inhale slowly and deeply after activating the MDI, then hold his breath for 10 seconds", "Tell the client his technique is correct and no changes are needed", "Advise the client to exhale forcefully into the MDI before activating it", "Recommend using the MDI without the spacer for a more direct medication delivery"],
    a: 0,
    r: "Proper MDI technique requires slow, deep inhalation after activation to allow the medication to reach the lower airways. Rapid inhalation causes the medication to deposit in the oropharynx rather than the lungs, reducing effectiveness. Breath-holding for 10 seconds allows medication absorption. Exhaling into the MDI is incorrect. A spacer improves drug delivery and should be used when available, not removed.",
    s: "Respiratory"
  },
  {
    q: "A 45-year-old female is 2 days post-laparoscopic cholecystectomy. She reports sharp right shoulder pain rated 6/10. Her abdominal incision sites are clean, dry, and intact. Vital signs are stable. What should the nurse explain to the client about this pain?",
    o: ["Referred pain from residual carbon dioxide gas used during the laparoscopic procedure irritating the diaphragm", "A possible complication of bile duct injury requiring immediate investigation", "Musculoskeletal strain from positioning during surgery that will resolve with physiotherapy", "A pulmonary embolism presenting as shoulder pain requiring urgent CT angiography"],
    a: 0,
    r: "Right shoulder pain after laparoscopic surgery is a well-known phenomenon caused by residual CO2 gas irritating the diaphragm, which shares innervation with the shoulder via the phrenic nerve (C3-C5). This referred pain is common and self-limiting, typically resolving within 24-72 hours. With stable vitals and intact incisions, bile duct injury is unlikely. PE would present with dyspnoea and chest pain. Musculoskeletal strain does not explain the referred pattern.",
    s: "GI"
  },
  {
    q: "A 45-year-old female post-cholecystectomy is being prepared for discharge. The nurse is providing dietary teaching. Which dietary instruction is most appropriate?",
    o: ["Gradually reintroduce fats into the diet, starting with small amounts and increasing as tolerated over several weeks", "Avoid all dietary fats permanently since the gallbladder has been removed", "Resume a normal high-fat diet immediately since the gallbladder is no longer needed", "Follow a clear liquid diet for 2 weeks before introducing solid foods"],
    a: 0,
    r: "After cholecystectomy, bile flows continuously from the liver into the duodenum rather than being stored and concentrated. Most clients can tolerate a normal diet eventually, but gradual fat reintroduction allows the body to adjust. Some clients experience fat intolerance initially. Permanent fat avoidance is unnecessarily restrictive. Immediate high-fat meals may cause diarrhoea and bloating. A 2-week clear liquid diet is excessive and nutritionally inadequate.",
    s: "GI"
  },
  {
    q: "A nurse is caring for a 70-year-old male with a newly inserted peripheral IV in his left forearm. During a routine assessment, the nurse notes the site is swollen, cool to touch, and the IV fluid is not infusing freely. There is no erythema or warmth. What should the nurse do first?",
    o: ["Stop the infusion, remove the IV catheter, and apply a cool compress to the site", "Flush the IV line with 10 mL of normal saline to restore patency", "Apply a warm compress to the site and increase the infusion rate", "Elevate the arm and continue the infusion at a slower rate"],
    a: 0,
    r: "The findings of swelling, cool skin, and poor infusion without erythema indicate IV infiltration — fluid is leaking into surrounding tissue. The nurse must stop the infusion immediately and remove the catheter to prevent further tissue damage. A cool compress reduces swelling for non-vesicant solutions. Flushing would push more fluid into the tissue. Warm compresses are used for phlebitis (with erythema and warmth). Continuing the infusion at any rate worsens the infiltration.",
    s: "Safety"
  },
  {
    q: "A nurse is preparing to administer morning medications to four clients. Which situation requires the nurse to hold the medication and notify the healthcare provider before administering?",
    o: ["Digoxin 0.125 mg for a client whose apical heart rate is 54 beats per minute", "Metoprolol 25 mg for a client whose blood pressure is 118/72 mmHg", "Acetaminophen 650 mg for a client who reports a pain level of 4/10", "Docusate sodium 100 mg for a client who had a bowel movement yesterday"],
    a: 0,
    r: "Digoxin should be held and the provider notified when the apical heart rate is below 60 bpm (54 in this case). Digoxin slows the heart rate, and administering it with bradycardia could cause dangerous cardiac arrhythmias. The BP of 118/72 is acceptable for metoprolol. Acetaminophen for pain of 4/10 is appropriate. Docusate sodium is a stool softener and having a bowel movement yesterday does not contraindicate its use.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client on contact precautions for MRSA. A family member asks why they need to wear a gown and gloves when visiting. What is the most appropriate nursing response?",
    o: ["Explain that MRSA is spread by direct contact and the gown and gloves prevent carrying the bacteria to other people and surfaces", "Tell the family member that the precautions are hospital policy and cannot be questioned", "Advise the family member that hand washing alone is sufficient and PPE is optional for visitors", "Explain that MRSA is airborne and the gown prevents inhalation of the bacteria"],
    a: 0,
    r: "MRSA is transmitted by direct contact with infected wounds, contaminated surfaces, or colonized skin. Contact precautions (gown and gloves) prevent the visitor from carrying MRSA on clothing or hands to other patients or surfaces. Simply citing policy without explanation does not promote understanding. Hand hygiene alone is insufficient when direct contact with the client or environment is expected. MRSA is not airborne — it requires contact transmission.",
    s: "Infection Control"
  },
  {
    q: "A nurse working on a medical unit receives shift report on four clients. Which client should the nurse assess first?",
    o: ["A client with pneumonia whose SpO2 has dropped from 94% to 87% in the past hour", "A client with a urinary tract infection who reports urgency and frequency", "A client post-hip replacement who rates surgical pain as 5/10", "A client with diabetes whose fasting blood glucose is 8.2 mmol/L"],
    a: 0,
    r: "An SpO2 drop from 94% to 87% represents acute respiratory deterioration that could lead to respiratory failure. This is the most urgent finding requiring immediate assessment and intervention. UTI symptoms of urgency and frequency are uncomfortable but not life-threatening. Pain of 5/10 post-surgery requires attention but is not emergent. A fasting glucose of 8.2 mmol/L is mildly elevated but not dangerous.",
    s: "Safety"
  },
  {
    q: "A nurse is teaching a client newly diagnosed with hypertension about lifestyle modifications. The client takes amlodipine 5 mg daily. Which dietary recommendation is most important?",
    o: ["Reduce sodium intake to less than 2000 mg per day, as excess sodium contributes to fluid retention and elevated blood pressure", "Eliminate all potassium-rich foods to prevent hyperkalemia while on the medication", "Increase caffeine intake to improve energy levels and counteract medication fatigue", "Follow a high-protein diet to strengthen blood vessel walls"],
    a: 0,
    r: "Sodium restriction to less than 2000 mg/day is a cornerstone of hypertension management, as sodium promotes water retention and increases blood volume and pressure. Amlodipine is a calcium channel blocker and does not cause potassium imbalances, so potassium restriction is unnecessary. Caffeine can transiently raise blood pressure and should not be increased. While adequate protein is important for health, high-protein diets do not strengthen blood vessels.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a 60-year-old client receiving a blood transfusion of packed red blood cells. Twenty minutes into the transfusion, the client develops chills, fever of 39.1°C, flank pain, and dark urine. What should the nurse do first?",
    o: ["Stop the transfusion immediately and keep the IV line open with normal saline", "Slow the transfusion rate and administer acetaminophen for the fever", "Continue the transfusion and monitor closely since mild reactions are common", "Disconnect the IV tubing and send the blood bag back to the blood bank immediately"],
    a: 0,
    r: "Chills, fever, flank pain, and dark urine (haemoglobinuria) during a blood transfusion indicate an acute haemolytic transfusion reaction — a medical emergency. The nurse must stop the transfusion immediately while keeping the IV patent with normal saline for fluid resuscitation and emergency medications. Slowing the rate or continuing allows more incompatible blood to be infused. The blood tubing should be disconnected but the IV access must be maintained; sending the blood bag back happens after stabilizing the client.",
    s: "Safety"
  }
];
